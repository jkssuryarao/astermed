import { v4 as uuidv4 } from 'uuid'
import { format, addMonths, isAfter, isBefore, startOfDay, parseISO } from 'date-fns'

export function generateId(): string {
  return uuidv4()
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function formatDate(date: string | Date, formatStr: string = 'MMM dd, yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, formatStr)
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

export function getCurrentDate(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function getCurrentDateTime(): string {
  return new Date().toISOString()
}

export function getMaxBookingDate(): string {
  return format(addMonths(new Date(), 3), 'yyyy-MM-dd')
}

export function isValidBookingDate(date: string): boolean {
  const bookingDate = parseISO(date)
  const today = startOfDay(new Date())
  const maxDate = addMonths(today, 3)
  
  return !isBefore(bookingDate, today) && !isAfter(bookingDate, maxDate)
}

export function getTimeSlots(): string[] {
  const slots: string[] = []
  for (let hour = 9; hour <= 18; hour++) {
    if (hour !== 13) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
      if (hour !== 18) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`)
      }
    }
  }
  return slots
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
}

export function parseJsonSafe<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

export function stringifyJsonSafe(obj: any): string {
  try {
    return JSON.stringify(obj)
  } catch {
    return ''
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function maskEmail(email: string): string {
  const [name, domain] = email.split('@')
  if (name.length <= 2) return email
  return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}@${domain}`
}

export function maskMobile(mobile: string): string {
  if (mobile.length <= 4) return mobile
  return `${'*'.repeat(mobile.length - 4)}${mobile.slice(-4)}`
}

export function generateGoogleCalendarUrl(appointment: {
  date: string
  timeSlot: string
  service: string
  doctor?: string
}): string {
  const { date, timeSlot, service, doctor } = appointment
  const [hours, minutes] = timeSlot.split(':')
  
  const startDate = new Date(date)
  startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
  
  const endDate = new Date(startDate)
  endDate.setMinutes(endDate.getMinutes() + 30)
  
  const formatGoogleDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  
  const title = encodeURIComponent(`AsterMed Appointment - ${service}`)
  const details = encodeURIComponent(`Service: ${service}${doctor ? `\nDoctor: ${doctor}` : ''}\n\nAsterMed Healthcare\nVinayaka Nagar, Hafeezpet, Hyderabad`)
  const location = encodeURIComponent('AsterMed Healthcare, Vinayaka Nagar, Hafeezpet, Hyderabad, Telangana 500049')
  const dates = `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`
}

export function generateAppleCalendarUrl(appointment: {
  date: string
  timeSlot: string
  service: string
}): string {
  return generateGoogleCalendarUrl(appointment)
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const value = String(item[key])
    groups[value] = groups[value] || []
    groups[value].push(item)
    return groups
  }, {} as Record<string, T[]>)
}
