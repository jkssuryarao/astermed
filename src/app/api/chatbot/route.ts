import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { appendToSheet, getSheetData, parseSheetData, SHEETS, SCHEMAS } from '@/lib/google-sheets'
import { generateId, getCurrentDateTime, getTimeSlots, formatTime } from '@/lib/utils'
import { Appointment, Setting } from '@/lib/types'

const PREDEFINED_RESPONSES: Record<string, string> = {
  greeting: "Hello! Welcome to AsterMed Healthcare. How can I assist you today?",
  services: "We offer a wide range of healthcare services including General Consultation, Pediatrics, Gynecology, Cardiology, Orthopedics, and more. Would you like to book an appointment?",
  timing: "Our clinic is open Monday to Saturday, 9:00 AM to 6:00 PM. We have a lunch break from 1:00 PM to 2:00 PM.",
  location: "We are located at Vinayaka Nagar, Hafeezpet, Hyderabad, Telangana 500049. You can reach us at 093816 59308.",
  booking: "I can help you book an appointment! Please tell me your preferred date and I'll show you available time slots.",
  thanks: "You're welcome! Is there anything else I can help you with?",
  default: "I understand you need assistance. For complex queries, please contact us at 093816 59308 or raise a support ticket. Would you like to book an appointment instead?",
}

function detectIntent(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.match(/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/)) {
    return 'greeting'
  }
  if (lowerMessage.match(/\b(service|treatment|offer|specialit|doctor)\b/)) {
    return 'services'
  }
  if (lowerMessage.match(/\b(time|hour|open|close|timing|schedule)\b/)) {
    return 'timing'
  }
  if (lowerMessage.match(/\b(where|location|address|direction|map|reach)\b/)) {
    return 'location'
  }
  if (lowerMessage.match(/\b(book|appointment|schedule|visit|consult)\b/)) {
    return 'booking'
  }
  if (lowerMessage.match(/\b(thank|thanks|appreciate)\b/)) {
    return 'thanks'
  }
  
  return 'default'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, sessionId, context } = body
    const session = await getCurrentUser()
    
    if (!message) {
      return NextResponse.json({
        success: false,
        error: 'Message is required',
      }, { status: 400 })
    }
    
    const settingsData = await getSheetData(SHEETS.SETTINGS)
    const settings = parseSheetData<Setting>(settingsData, SCHEMAS[SHEETS.SETTINGS])
    
    const chatbotEnabled = settings.find(s => s.key === 'chatbot_enabled')?.value !== 'false'
    const chatbotMode = settings.find(s => s.key === 'chatbot_mode')?.value || 'nlp'
    
    if (!chatbotEnabled) {
      return NextResponse.json({
        success: true,
        data: {
          message: "I'm currently offline. Please call us at 093816 59308 for assistance.",
          action: null,
        },
      })
    }
    
    await appendToSheet(SHEETS.ANALYTICS, [[
      generateId(),
      'chatbot',
      '/chatbot',
      message,
      session?.user?.id || '',
      sessionId || '',
      '',
      '',
      '',
      JSON.stringify({ context }),
      getCurrentDateTime(),
    ]])
    
    const intent = detectIntent(message)
    let response = PREDEFINED_RESPONSES[intent]
    let action = null
    
    if (chatbotMode === 'appointment' || intent === 'booking') {
      if (context?.awaitingDate) {
        const dateMatch = message.match(/(\d{4}-\d{2}-\d{2})|(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(today|tomorrow)/i)
        
        if (dateMatch) {
          let date = dateMatch[0]
          
          if (date.toLowerCase() === 'today') {
            date = new Date().toISOString().split('T')[0]
          } else if (date.toLowerCase() === 'tomorrow') {
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            date = tomorrow.toISOString().split('T')[0]
          }
          
          const appointmentsData = await getSheetData(SHEETS.APPOINTMENTS)
          const appointments = parseSheetData<Appointment>(appointmentsData, SCHEMAS[SHEETS.APPOINTMENTS])
          
          const bookedSlots = appointments
            .filter(apt => apt.date === date && apt.status !== 'cancelled')
            .map(apt => apt.timeSlot)
          
          const availableSlots = getTimeSlots().filter(slot => !bookedSlots.includes(slot))
          
          if (availableSlots.length === 0) {
            response = `Sorry, there are no available slots on ${date}. Please try another date.`
            action = { type: 'request_date' }
          } else {
            const slotsText = availableSlots.slice(0, 6).map(s => formatTime(s)).join(', ')
            response = `Available slots on ${date}:\n${slotsText}${availableSlots.length > 6 ? '\n...and more' : ''}\n\nWhich time works for you?`
            action = { type: 'show_slots', date, slots: availableSlots }
          }
        } else {
          response = "Please provide a valid date in format YYYY-MM-DD, or say 'today' or 'tomorrow'."
          action = { type: 'request_date' }
        }
      } else if (context?.awaitingSlot && context?.selectedDate) {
        const timeMatch = message.match(/(\d{1,2}:\d{2})|(\d{1,2}\s*(am|pm))/i)
        
        if (timeMatch) {
          response = session
            ? `Great! I'll book your appointment for ${context.selectedDate} at ${timeMatch[0]}. Would you like me to confirm this booking?`
            : "To complete your booking, I'll need your contact details. Please provide your name, email, and phone number."
          action = { 
            type: session ? 'confirm_booking' : 'request_contact',
            date: context.selectedDate,
            time: timeMatch[0],
          }
        } else {
          response = "Please select a time slot from the available options."
          action = { type: 'request_slot' }
        }
      } else {
        response = "I'd be happy to help you book an appointment! What date would you prefer? (You can say 'today', 'tomorrow', or provide a date like 2024-12-20)"
        action = { type: 'request_date' }
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        message: response,
        action,
        intent,
      },
    })
  } catch (error) {
    console.error('Chatbot error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process message',
    }, { status: 500 })
  }
}
