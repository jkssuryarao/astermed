import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, canViewAnalytics } from '@/lib/auth'
import { 
  appendToSheet, 
  getSheetData, 
  parseSheetData,
  SHEETS, 
  SCHEMAS 
} from '@/lib/google-sheets'
import { generateId, getCurrentDateTime } from '@/lib/utils'
import { AnalyticsEvent, DashboardStats, AnalyticsSummary, Appointment, Query, Blog, User } from '@/lib/types'
import { subDays, format, startOfDay, eachDayOfInterval } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentUser()
    
    if (!session || !canViewAnalytics(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    if (type === 'stats') {
      const [appointmentsData, usersData, queriesData, blogsData, analyticsData] = await Promise.all([
        getSheetData(SHEETS.APPOINTMENTS),
        getSheetData(SHEETS.USERS),
        getSheetData(SHEETS.QUERIES),
        getSheetData(SHEETS.BLOGS),
        getSheetData(SHEETS.ANALYTICS),
      ])
      
      const appointments = parseSheetData<Appointment>(appointmentsData, SCHEMAS[SHEETS.APPOINTMENTS])
      const users = parseSheetData<User>(usersData, SCHEMAS[SHEETS.USERS])
      const queries = parseSheetData<Query>(queriesData, SCHEMAS[SHEETS.QUERIES])
      const blogs = parseSheetData<Blog>(blogsData, SCHEMAS[SHEETS.BLOGS])
      const analytics = parseSheetData<AnalyticsEvent>(analyticsData, SCHEMAS[SHEETS.ANALYTICS])
      
      const today = format(new Date(), 'yyyy-MM-dd')
      
      const stats: DashboardStats = {
        totalAppointments: appointments.length,
        pendingAppointments: appointments.filter(a => a.status === 'pending').length,
        totalUsers: users.filter(u => u.role === 'user').length,
        openQueries: queries.filter(q => q.status === 'open' || q.status === 'in_progress').length,
        totalBlogs: blogs.filter(b => b.status === 'published').length,
        pageViews: analytics.filter(a => a.type === 'page_view').length,
        appointmentsToday: appointments.filter(a => a.date === today).length,
        chatbotInteractions: analytics.filter(a => a.type === 'chatbot').length,
      }
      
      return NextResponse.json({
        success: true,
        data: stats,
      })
    }
    
    if (type === 'summary') {
      const days = parseInt(searchParams.get('days') || '30')
      const startDate = startOfDay(subDays(new Date(), days))
      const endDate = startOfDay(new Date())
      
      const analyticsData = await getSheetData(SHEETS.ANALYTICS)
      const analytics = parseSheetData<AnalyticsEvent>(analyticsData, SCHEMAS[SHEETS.ANALYTICS])
      
      const recentAnalytics = analytics.filter(
        a => new Date(a.createdAt) >= startDate
      )
      
      const dateRange = eachDayOfInterval({ start: startDate, end: endDate })
      
      const pageViews = dateRange.map(date => {
        const dateStr = format(date, 'yyyy-MM-dd')
        return {
          date: dateStr,
          count: recentAnalytics.filter(
            a => a.type === 'page_view' && a.createdAt.startsWith(dateStr)
          ).length,
        }
      })
      
      const appointmentsData = await getSheetData(SHEETS.APPOINTMENTS)
      const appointments = parseSheetData<Appointment>(appointmentsData, SCHEMAS[SHEETS.APPOINTMENTS])
      
      const appointmentsByDate = dateRange.map(date => {
        const dateStr = format(date, 'yyyy-MM-dd')
        return {
          date: dateStr,
          count: appointments.filter(a => a.createdAt.startsWith(dateStr)).length,
        }
      })
      
      const chatbotInteractions = dateRange.map(date => {
        const dateStr = format(date, 'yyyy-MM-dd')
        return {
          date: dateStr,
          count: recentAnalytics.filter(
            a => a.type === 'chatbot' && a.createdAt.startsWith(dateStr)
          ).length,
        }
      })
      
      const pageViewCounts: Record<string, number> = {}
      recentAnalytics
        .filter(a => a.type === 'page_view')
        .forEach(a => {
          pageViewCounts[a.page] = (pageViewCounts[a.page] || 0) + 1
        })
      
      const topPages = Object.entries(pageViewCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([page, views]) => ({ page, views }))
      
      const usersData = await getSheetData(SHEETS.USERS)
      const users = parseSheetData<User>(usersData, SCHEMAS[SHEETS.USERS])
      
      const userSignups = dateRange.map(date => {
        const dateStr = format(date, 'yyyy-MM-dd')
        return {
          date: dateStr,
          count: users.filter(u => u.createdAt.startsWith(dateStr)).length,
        }
      })
      
      const summary: AnalyticsSummary = {
        pageViews,
        appointments: appointmentsByDate,
        chatbotInteractions,
        topPages,
        userSignups,
      }
      
      return NextResponse.json({
        success: true,
        data: summary,
      })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid type parameter',
    }, { status: 400 })
  } catch (error) {
    console.error('Get analytics error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, page, event, metadata } = body
    
    const now = getCurrentDateTime()
    const newEvent: AnalyticsEvent = {
      id: generateId(),
      type: type || 'page_view',
      page: page || '',
      event: event || '',
      userId: '',
      sessionId: body.sessionId || '',
      userAgent: '',
      ip: '',
      referrer: body.referrer || '',
      metadata: metadata ? JSON.stringify(metadata) : '',
      createdAt: now,
    }
    
    await appendToSheet(SHEETS.ANALYTICS, [[
      newEvent.id,
      newEvent.type,
      newEvent.page,
      newEvent.event,
      newEvent.userId,
      newEvent.sessionId,
      newEvent.userAgent,
      newEvent.ip,
      newEvent.referrer,
      newEvent.metadata,
      newEvent.createdAt,
    ]])
    
    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Track analytics error:', error)
    return NextResponse.json({
      success: false,
    }, { status: 500 })
  }
}
