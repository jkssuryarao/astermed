import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, canRespondToQueries } from '@/lib/auth'
import { querySchema, validateData } from '@/lib/validation'
import { 
  appendToSheet, 
  getSheetData, 
  parseSheetData,
  SHEETS, 
  SCHEMAS 
} from '@/lib/google-sheets'
import { generateId, getCurrentDateTime } from '@/lib/utils'
import { Query } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentUser()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const data = await getSheetData(SHEETS.QUERIES)
    let queries = parseSheetData<Query>(data, SCHEMAS[SHEETS.QUERIES])
    
    if (session.user.role === 'user') {
      queries = queries.filter(q => q.userId === session.user.id)
      
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
      queries = queries.filter(q => new Date(q.createdAt) >= threeMonthsAgo)
    }
    
    if (status) {
      queries = queries.filter(q => q.status === status)
    }
    
    queries.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    return NextResponse.json({
      success: true,
      data: queries,
    })
  } catch (error) {
    console.error('Get queries error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch queries' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const session = await getCurrentUser()
    
    const validation = validateData(querySchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }
    
    const { subject, message, guestName, guestEmail, guestMobile } = validation.data
    
    if (!session && (!guestName || !guestEmail)) {
      return NextResponse.json(
        { success: false, error: 'Guest queries require name and email' },
        { status: 400 }
      )
    }
    
    const now = getCurrentDateTime()
    const newQuery: Query = {
      id: generateId(),
      userId: session?.user.id || '',
      guestName: guestName || '',
      guestEmail: guestEmail || '',
      guestMobile: guestMobile || '',
      subject,
      message,
      status: 'open',
      priority: 'medium',
      assignedTo: '',
      response: '',
      respondedAt: '',
      respondedBy: '',
      createdAt: now,
      updatedAt: now,
    }
    
    await appendToSheet(SHEETS.QUERIES, [[
      newQuery.id,
      newQuery.userId,
      newQuery.guestName,
      newQuery.guestEmail,
      newQuery.guestMobile,
      newQuery.subject,
      newQuery.message,
      newQuery.status,
      newQuery.priority,
      newQuery.assignedTo,
      newQuery.response,
      newQuery.respondedAt,
      newQuery.respondedBy,
      newQuery.createdAt,
      newQuery.updatedAt,
    ]])
    
    return NextResponse.json({
      success: true,
      data: newQuery,
      message: 'Query submitted successfully',
    })
  } catch (error) {
    console.error('Create query error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit query' },
      { status: 500 }
    )
  }
}
