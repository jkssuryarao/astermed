import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { 
  findRowByField,
  updateSheetRow,
  SHEETS, 
  SCHEMAS 
} from '@/lib/google-sheets'
import { getCurrentDateTime } from '@/lib/utils'
import { Appointment, AppointmentStatus } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getCurrentUser()
    
    const result = await findRowByField(SHEETS.APPOINTMENTS, 'id', id)
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      )
    }
    
    const appointment = result.row as Appointment
    
    if (session?.user.role === 'user' && appointment.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: appointment,
    })
  } catch (error) {
    console.error('Get appointment error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointment' },
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
    
    const result = await findRowByField(SHEETS.APPOINTMENTS, 'id', id)
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      )
    }
    
    const appointment = result.row as Appointment
    
    const isOwner = session?.user.id === appointment.userId
    const isStaff = session?.user.role === 'admin' || session?.user.role === 'editor'
    
    if (!isOwner && !isStaff) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    const allowedUpdates = isStaff 
      ? ['status', 'notes', 'doctor', 'date', 'timeSlot', 'service']
      : ['status', 'notes']
    
    const updates: Partial<Appointment> = {}
    
    for (const key of allowedUpdates) {
      if (body[key] !== undefined) {
        (updates as any)[key] = body[key]
      }
    }
    
    if (body.status === 'cancelled' && body.cancelReason) {
      updates.cancelledAt = getCurrentDateTime()
      updates.cancelReason = body.cancelReason
    }
    
    updates.updatedAt = getCurrentDateTime()
    
    const updatedAppointment: Appointment = {
      ...appointment,
      ...updates,
    }
    
    const rowValues = SCHEMAS[SHEETS.APPOINTMENTS].map(
      col => updatedAppointment[col as keyof Appointment] || ''
    )
    
    await updateSheetRow(SHEETS.APPOINTMENTS, result.rowIndex, rowValues)
    
    return NextResponse.json({
      success: true,
      data: updatedAppointment,
      message: 'Appointment updated successfully',
    })
  } catch (error) {
    console.error('Update appointment error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update appointment' },
      { status: 500 }
    )
  }
}
