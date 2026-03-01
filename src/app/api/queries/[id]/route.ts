import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, canRespondToQueries } from '@/lib/auth'
import { queryResponseSchema, validateData } from '@/lib/validation'
import { 
  findRowByField,
  updateSheetRow,
  SHEETS, 
  SCHEMAS 
} from '@/lib/google-sheets'
import { getCurrentDateTime } from '@/lib/utils'
import { Query } from '@/lib/types'

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
    
    const result = await findRowByField(SHEETS.QUERIES, 'id', id)
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Query not found' },
        { status: 404 }
      )
    }
    
    const query = result.row as Query
    
    if (session.user.role === 'user' && query.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: query,
    })
  } catch (error) {
    console.error('Get query error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch query' },
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
    
    if (!session || !canRespondToQueries(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    const result = await findRowByField(SHEETS.QUERIES, 'id', id)
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Query not found' },
        { status: 404 }
      )
    }
    
    const query = result.row as Query
    
    const validation = validateData(queryResponseSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }
    
    const { response, status } = validation.data
    const now = getCurrentDateTime()
    
    const updatedQuery: Query = {
      ...query,
      response,
      status,
      respondedAt: now,
      respondedBy: session.user.name,
      updatedAt: now,
    }
    
    if (body.priority) {
      updatedQuery.priority = body.priority
    }
    
    if (body.assignedTo) {
      updatedQuery.assignedTo = body.assignedTo
    }
    
    const rowValues = SCHEMAS[SHEETS.QUERIES].map(
      col => updatedQuery[col as keyof Query] || ''
    )
    
    await updateSheetRow(SHEETS.QUERIES, result.rowIndex, rowValues)
    
    return NextResponse.json({
      success: true,
      data: updatedQuery,
      message: 'Query updated successfully',
    })
  } catch (error) {
    console.error('Update query error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update query' },
      { status: 500 }
    )
  }
}
