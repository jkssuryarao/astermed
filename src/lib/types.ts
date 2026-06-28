export type UserRole = 'admin' | 'editor' | 'user'
export type UserStatus = 'active' | 'disabled' | 'pending'
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'
export type QueryStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type QueryPriority = 'low' | 'medium' | 'high' | 'urgent'
export type BlogStatus = 'draft' | 'published' | 'archived'
export type AnalyticsEventType = 'page_view' | 'click' | 'appointment' | 'chatbot' | 'signup' | 'login'

export interface User {
  id: string
  email: string
  mobile: string
  password: string
  name: string
  role: UserRole
  status: UserStatus
  createdAt: string
  updatedAt: string
  lastLogin: string
  resetToken?: string
  resetTokenExpiry?: string
}

export interface Appointment {
  id: string
  userId: string
  guestName: string
  guestEmail: string
  guestMobile: string
  date: string
  timeSlot: string
  service: string
  doctor: string
  status: AppointmentStatus
  notes: string
  createdAt: string
  updatedAt: string
  cancelledAt?: string
  cancelReason?: string
}

export interface Query {
  id: string
  userId: string
  guestName: string
  guestEmail: string
  guestMobile: string
  subject: string
  message: string
  status: QueryStatus
  priority: QueryPriority
  assignedTo: string
  response: string
  respondedAt: string
  respondedBy: string
  createdAt: string
  updatedAt: string
}

export interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  author: string
  authorId: string
  category: string
  tags: string
  status: BlogStatus
  views: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export interface AnalyticsEvent {
  id: string
  type: AnalyticsEventType
  page: string
  event: string
  userId: string
  sessionId: string
  userAgent: string
  ip: string
  referrer: string
  metadata: string
  createdAt: string
}

export interface Setting {
  key: string
  value: string
  description: string
  updatedAt: string
  updatedBy: string
}

export interface Content {
  id: string
  page: string
  section: string
  key: string
  value: string
  type: 'text' | 'image' | 'html' | 'json'
  updatedAt: string
  updatedBy: string
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface Service {
  id: string
  name: string
  description: string
  duration: number
  icon: string
}

export interface DoctorProfile {
  id: string
  name: string
  qualifications: string
  specialty: string
  experienceYears: string
  availability: string
  bio: string
  photoUrl: string
  sortOrder: string
  status: 'active' | 'inactive' | string
}

export interface BoardMember {
  id: string
  name: string
  designation: string
  qualifications: string
  experienceYears: string
  photoUrl: string
  sortOrder: string
  status: 'active' | 'inactive' | string
}

export interface Activity {
  id: string
  title: string
  location: string
  date: string
  imageUrl: string
  description: string
  sortOrder: string
  status: 'active' | 'inactive' | string
}

export interface Department {
  id: string
  slug: string
  name: string
  color: string
  bullets: string
  ctaLabel: string
  ctaHref: string
  sortOrder: string
}

export interface ServiceTiming {
  id: string
  department: string
  weekdayLabel: string
  weekdayHours: string
  sundayHours: string
  sortOrder: string
}

export interface SiteSettings {
  clinic_name: string
  clinic_email: string
  clinic_phone: string
  clinic_whatsapp: string
  clinic_address: string
  clinic_map_url: string
  clinic_map_embed: string
  social_facebook: string
  social_instagram: string
  social_youtube: string
  social_linkedin: string
  facebook_enabled: string
  instagram_enabled: string
  youtube_enabled: string
  linkedin_enabled: string
  hero_image_url: string
  walk_in_text: string
  copyright_text: string
  working_hours_start: string
  working_hours_end: string
}

/** @deprecated Use DoctorProfile */
export interface Doctor {
  id: string
  name: string
  specialty: string
  image: string
  bio: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface AuthSession {
  user: Omit<User, 'password' | 'resetToken' | 'resetTokenExpiry'>
  token: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface DashboardStats {
  totalAppointments: number
  pendingAppointments: number
  totalUsers: number
  openQueries: number
  totalBlogs: number
  pageViews: number
  appointmentsToday: number
  chatbotInteractions: number
}

export interface AnalyticsSummary {
  pageViews: { date: string; count: number }[]
  appointments: { date: string; count: number }[]
  chatbotInteractions: { date: string; count: number }[]
  topPages: { page: string; views: number }[]
  userSignups: { date: string; count: number }[]
}
