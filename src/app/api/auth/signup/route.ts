import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserByEmail, hashPassword, generateToken } from '@/lib/auth'
import { signupSchema, validateData } from '@/lib/validation'
import { appendToSheet, SHEETS, findRowByField } from '@/lib/google-sheets'
import { generateId, getCurrentDateTime } from '@/lib/utils'
import { User } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validation = validateData(signupSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }
    
    const { email, mobile, password, name } = validation.data
    
    const existingEmail = await getUserByEmail(email)
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      )
    }
    
    const existingMobile = await findRowByField(SHEETS.USERS, 'mobile', mobile)
    if (existingMobile) {
      return NextResponse.json(
        { success: false, error: 'An account with this mobile number already exists' },
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
      role: 'user',
      status: 'active',
      createdAt: now,
      updatedAt: now,
      lastLogin: now,
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
    
    const token = generateToken(newUser)
    
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    
    cookieStore.set('user-role', newUser.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    
    const { password: _, resetToken, resetTokenExpiry, ...safeUser } = newUser
    
    return NextResponse.json({
      success: true,
      data: { user: safeUser, token },
      message: 'Account created successfully',
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred during signup' },
      { status: 500 }
    )
  }
}
