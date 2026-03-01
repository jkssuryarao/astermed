import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { User, UserRole, AuthSession } from './types'
import { SHEETS, findRowByField, getSheetData, parseSheetData, SCHEMAS } from './google-sheets'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'
const TOKEN_EXPIRY = '7d'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: Omit<User, 'password'>): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  )
}

export function verifyToken(token: string): { id: string; email: string; role: UserRole; name: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: UserRole; name: string }
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<AuthSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  
  if (!token) return null
  
  const decoded = verifyToken(token)
  if (!decoded) return null
  
  const result = await findRowByField(SHEETS.USERS, 'id', decoded.id)
  if (!result) return null
  
  const user = result.row as User
  if (user.status !== 'active') return null
  
  const { password, resetToken, resetTokenExpiry, ...safeUser } = user
  
  return { user: safeUser as Omit<User, 'password' | 'resetToken' | 'resetTokenExpiry'>, token }
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await findRowByField(SHEETS.USERS, 'id', id)
  if (!result) return null
  return result.row as User
}

export async function getUserByEmail(email: string): Promise<{ user: User; rowIndex: number } | null> {
  const result = await findRowByField(SHEETS.USERS, 'email', email.toLowerCase())
  if (!result) return null
  return { user: result.row as User, rowIndex: result.rowIndex }
}

export async function getAllUsers(): Promise<User[]> {
  const data = await getSheetData(SHEETS.USERS)
  return parseSheetData<User>(data, SCHEMAS[SHEETS.USERS])
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole | UserRole[]): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    admin: 3,
    editor: 2,
    user: 1,
  }
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.some(role => roleHierarchy[userRole] >= roleHierarchy[role])
  }
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export function canAccessAdmin(role: UserRole): boolean {
  return role === 'admin'
}

export function canAccessEditor(role: UserRole): boolean {
  return role === 'admin' || role === 'editor'
}

export function canManageUsers(role: UserRole): boolean {
  return role === 'admin'
}

export function canManageSettings(role: UserRole): boolean {
  return role === 'admin'
}

export function canEditContent(role: UserRole): boolean {
  return role === 'admin' || role === 'editor'
}

export function canManageBlogs(role: UserRole): boolean {
  return role === 'admin' || role === 'editor'
}

export function canViewAnalytics(role: UserRole): boolean {
  return role === 'admin' || role === 'editor'
}

export function canRespondToQueries(role: UserRole): boolean {
  return role === 'admin' || role === 'editor'
}
