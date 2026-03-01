import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserByEmail, verifyPassword, generateToken } from '@/lib/auth'
import { loginSchema, validateData } from '@/lib/validation'
import { updateSheetRow, SHEETS, SCHEMAS } from '@/lib/google-sheets'
import { User } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validation = validateData(loginSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }
    
    const { email, password } = validation.data
    
    const result = await getUserByEmail(email)
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    const { user, rowIndex } = result
    
    if (user.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Account is disabled. Please contact support.' },
        { status: 403 }
      )
    }
    
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    const token = generateToken(user)
    
    const updatedUser: User = {
      ...user,
      lastLogin: new Date().toISOString(),
    }
    
    const rowValues = SCHEMAS[SHEETS.USERS].map(col => updatedUser[col as keyof User] || '')
    await updateSheetRow(SHEETS.USERS, rowIndex, rowValues)
    
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    
    cookieStore.set('user-role', user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    
    const { password: _, resetToken, resetTokenExpiry, ...safeUser } = user
    
    return NextResponse.json({
      success: true,
      data: { user: safeUser, token },
      message: 'Login successful',
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}
