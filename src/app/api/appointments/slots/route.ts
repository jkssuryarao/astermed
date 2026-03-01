import { NextRequest, NextResponse } from 'next/server'
import { 
  getSheetData, 
  parseSheetData,
  SHEETS, 
  SCHEMAS 
} from '@/lib/google-sheets'
import { getTimeSlots, isValidBookingDate } from '@/lib/utils'
import { Appointment, TimeSlot } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    
    if (!date) {
      return NextResponse.json(
        { success: false, error: 'Date is required' },
        { status: 400 }
      )
    }
    
    if (!isValidBookingDate(date)) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking date' },
        { status: 400 }
      )
    }
    
    const data = await getSheetData(SHEETS.APPOINTMENTS)
    const appointments = parseSheetData<Appointment>(data, SCHEMAS[SHEETS.APPOINTMENTS])
    
    const bookedSlots = appointments
      .filter(apt => apt.date === date && apt.status !== 'cancelled')
      .map(apt => apt.timeSlot)
    
    const allSlots = getTimeSlots()
    const slots: TimeSlot[] = allSlots.map(time => ({
      time,
      available: !bookedSlots.includes(time),
    }))
    
    return NextResponse.json({
      success: true,
      data: slots,
    })
  } catch (error) {
    console.error('Get slots error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch available slots' },
      { status: 500 }
    )
  }
}
