import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { appointmentSchema, validateData } from '@/lib/validation'
import { 
  appendToSheet, 
  getSheetData, 
  parseSheetData,
  SHEETS, 
  SCHEMAS 
} from '@/lib/google-sheets'
import { generateId, getCurrentDateTime, isValidBookingDate } from '@/lib/utils'
import { Appointment } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentUser()
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const status = searchParams.get('status')
    const userId = searchParams.get('userId')
    
    const data = await getSheetData(SHEETS.APPOINTMENTS)
    let appointments = parseSheetData<Appointment>(data, SCHEMAS[SHEETS.APPOINTMENTS])
    
    if (session?.user.role === 'user') {
      appointments = appointments.filter(apt => apt.userId === session.user.id)
    } else if (userId && session?.user.role !== 'user') {
      appointments = appointments.filter(apt => apt.userId === userId)
    }
    
    if (date) {
      appointments = appointments.filter(apt => apt.date === date)
    }
    
    if (status) {
      appointments = appointments.filter(apt => apt.status === status)
    }
    
    appointments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    return NextResponse.json({
      success: true,
      data: appointments,
    })
  } catch (error) {
    console.error('Get appointments error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const session = await getCurrentUser()
    
    const validation = validateData(appointmentSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }
    
    const { date, timeSlot, service, doctor, notes, guestName, guestEmail, guestMobile } = validation.data
    
    if (!session && (!guestName || !guestEmail || !guestMobile)) {
      return NextResponse.json(
        { success: false, error: 'Guest bookings require name, email, and mobile' },
        { status: 400 }
      )
    }
    
    if (!isValidBookingDate(date)) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking date. Please select a date within the next 3 months.' },
        { status: 400 }
      )
    }
    
    const data = await getSheetData(SHEETS.APPOINTMENTS)
    const appointments = parseSheetData<Appointment>(data, SCHEMAS[SHEETS.APPOINTMENTS])
    
    const existingBooking = appointments.find(
      apt => apt.date === date && apt.timeSlot === timeSlot && 
             apt.status !== 'cancelled'
    )
    
    if (existingBooking) {
      return NextResponse.json(
        { success: false, error: 'This time slot is already booked. Please choose another.' },
        { status: 409 }
      )
    }
    
    const now = getCurrentDateTime()
    const newAppointment: Appointment = {
      id: generateId(),
      userId: session?.user.id || '',
      guestName: guestName || '',
      guestEmail: guestEmail || '',
      guestMobile: guestMobile || '',
      date,
      timeSlot,
      service,
      doctor: doctor || '',
      status: 'pending',
      notes: notes || '',
      createdAt: now,
      updatedAt: now,
      cancelledAt: '',
      cancelReason: '',
    }
    
    await appendToSheet(SHEETS.APPOINTMENTS, [[
      newAppointment.id,
      newAppointment.userId,
      newAppointment.guestName,
      newAppointment.guestEmail,
      newAppointment.guestMobile,
      newAppointment.date,
      newAppointment.timeSlot,
      newAppointment.service,
      newAppointment.doctor,
      newAppointment.status,
      newAppointment.notes,
      newAppointment.createdAt,
      newAppointment.updatedAt,
      newAppointment.cancelledAt,
      newAppointment.cancelReason,
    ]])
    
    return NextResponse.json({
      success: true,
      data: newAppointment,
      message: 'Appointment booked successfully',
    })
  } catch (error) {
    console.error('Create appointment error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}
