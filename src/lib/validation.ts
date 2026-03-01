import { z } from 'zod'

export const emailSchema = z.string().email('Invalid email address').toLowerCase()

export const mobileSchema = z.string()
  .min(10, 'Mobile number must be at least 10 digits')
  .max(15, 'Mobile number must be at most 15 digits')
  .regex(/^[+]?[\d\s-]+$/, 'Invalid mobile number format')

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be at most 100 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')

export const signupSchema = z.object({
  email: emailSchema,
  mobile: mobileSchema,
  password: passwordSchema,
  name: nameSchema,
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const appointmentSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  timeSlot: z.string().min(1, 'Time slot is required'),
  service: z.string().min(1, 'Service is required'),
  doctor: z.string().optional(),
  notes: z.string().max(500, 'Notes must be at most 500 characters').optional(),
  guestName: nameSchema.optional(),
  guestEmail: emailSchema.optional(),
  guestMobile: mobileSchema.optional(),
})

export const querySchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200, 'Subject must be at most 200 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message must be at most 2000 characters'),
  guestName: nameSchema.optional(),
  guestEmail: emailSchema.optional(),
  guestMobile: mobileSchema.optional(),
})

export const blogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must be at most 200 characters'),
  excerpt: z.string().min(20, 'Excerpt must be at least 20 characters').max(500, 'Excerpt must be at most 500 characters'),
  content: z.string().min(100, 'Content must be at least 100 characters'),
  coverImage: z.string().url('Invalid cover image URL').optional().or(z.literal('')),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
})

export const profileUpdateSchema = z.object({
  name: nameSchema,
  mobile: mobileSchema,
})

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export const userCreateSchema = z.object({
  email: emailSchema,
  mobile: mobileSchema,
  password: passwordSchema,
  name: nameSchema,
  role: z.enum(['admin', 'editor', 'user']),
})

export const userUpdateSchema = z.object({
  name: nameSchema.optional(),
  mobile: mobileSchema.optional(),
  role: z.enum(['admin', 'editor', 'user']).optional(),
  status: z.enum(['active', 'disabled', 'pending']).optional(),
})

export const settingSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string(),
  description: z.string().optional(),
})

export const contentSchema = z.object({
  page: z.string().min(1, 'Page is required'),
  section: z.string().min(1, 'Section is required'),
  key: z.string().min(1, 'Key is required'),
  value: z.string(),
  type: z.enum(['text', 'image', 'html', 'json']),
})

export const queryResponseSchema = z.object({
  response: z.string().min(10, 'Response must be at least 10 characters').max(2000, 'Response must be at most 2000 characters'),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']),
})

export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  const errors = result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
  return { success: false, error: errors }
}
