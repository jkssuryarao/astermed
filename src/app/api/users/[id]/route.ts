import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, canManageUsers, hashPassword } from '@/lib/auth'
import { userUpdateSchema, validateData } from '@/lib/validation'
import { 
  findRowByField,
  updateSheetRow,
  SHEETS, 
  SCHEMAS 
} from '@/lib/google-sheets'
import { getCurrentDateTime } from '@/lib/utils'
import { User } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getCurrentUser()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    if (session.user.id !== id && !canManageUsers(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    const result = await findRowByField(SHEETS.USERS, 'id', id)
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    const { password, resetToken, resetTokenExpiry, ...safeUser } = result.row as User
    
    return NextResponse.json({
      success: true,
      data: safeUser,
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const session = await getCurrentUser()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const isOwn = session.user.id === id
    const isAdmin = canManageUsers(session.user.role)
    
    if (!isOwn && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    const result = await findRowByField(SHEETS.USERS, 'id', id)
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    const user = result.row as User
    
    const validation = validateData(userUpdateSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }
    
    const updates = validation.data
    
    if (!isAdmin && (updates.role || updates.status)) {
      return NextResponse.json(
        { success: false, error: 'Cannot modify role or status' },
        { status: 403 }
      )
    }
    
    const now = getCurrentDateTime()
    const updatedUser: User = {
      ...user,
      ...updates,
      updatedAt: now,
    }
    
    if (body.password) {
      updatedUser.password = await hashPassword(body.password)
    }
    
    const rowValues = SCHEMAS[SHEETS.USERS].map(
      col => updatedUser[col as keyof User] || ''
    )
    
    await updateSheetRow(SHEETS.USERS, result.rowIndex, rowValues)
    
    const { password, resetToken, resetTokenExpiry, ...safeUser } = updatedUser
    
    return NextResponse.json({
      success: true,
      data: safeUser,
      message: 'User updated successfully',
    })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
