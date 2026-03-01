import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, canManageUsers, hashPassword, getAllUsers } from '@/lib/auth'
import { userCreateSchema, validateData } from '@/lib/validation'
import { 
  appendToSheet, 
  findRowByField,
  SHEETS 
} from '@/lib/google-sheets'
import { generateId, getCurrentDateTime } from '@/lib/utils'
import { User } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentUser()
    
    if (!session || !canManageUsers(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    const users = await getAllUsers()
    
    const safeUsers = users.map(({ password, resetToken, resetTokenExpiry, ...user }) => user)
    
    return NextResponse.json({
      success: true,
      data: safeUsers,
    })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentUser()
    
    if (!session || !canManageUsers(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    
    const validation = validateData(userCreateSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }
    
    const { email, mobile, password, name, role } = validation.data
    
    const existingEmail = await findRowByField(SHEETS.USERS, 'email', email.toLowerCase())
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 409 }
      )
    }
    
    const hashedPassword = await hashPassword(password)
    const now = getCurrentDateTime()
    
    const newUser: User = {
      id: generateId(),
      email: email.toLowerCase(),
      mobile,
      password: hashedPassword,
      name,
      role,
      status: 'active',
      createdAt: now,
      updatedAt: now,
      lastLogin: '',
      resetToken: '',
      resetTokenExpiry: '',
    }
    
    await appendToSheet(SHEETS.USERS, [[
      newUser.id,
      newUser.email,
      newUser.mobile,
      newUser.password,
      newUser.name,
      newUser.role,
      newUser.status,
      newUser.createdAt,
      newUser.updatedAt,
      newUser.lastLogin,
      newUser.resetToken,
      newUser.resetTokenExpiry,
    ]])
    
    const { password: _, resetToken, resetTokenExpiry, ...safeUser } = newUser
    
    return NextResponse.json({
      success: true,
      data: safeUser,
      message: 'User created successfully',
    })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
