'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2, Calendar, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  action?: {
    type: string
    [key: string]: any
  }
}

interface ChatbotProps {
  user?: {
    name: string
    email: string
  } | null
}

export default function Chatbot({ user }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! Welcome to AsterMed Healthcare. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [context, setContext] = useState<Record<string, any>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
          sessionId: getSessionId(),
          context,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.data.message,
          timestamp: new Date(),
          action: data.data.action,
        }

        setMessages((prev) => [...prev, assistantMessage])

        if (data.data.action) {
          handleAction(data.data.action)
        }
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm sorry, I encountered an error. Please try again or contact us at 093816 59308.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleAction = (action: { type: string; [key: string]: any }) => {
    switch (action.type) {
      case 'request_date':
        setContext({ ...context, awaitingDate: true })
        break
      case 'show_slots':
        setContext({ 
          ...context, 
          awaitingDate: false, 
          awaitingSlot: true, 
          selectedDate: action.date,
          availableSlots: action.slots,
        })
        break
      case 'request_slot':
        setContext({ ...context, awaitingSlot: true })
        break
      case 'confirm_booking':
      case 'request_contact':
        setContext({ 
          ...context, 
          awaitingSlot: false,
          bookingDate: action.date,
          bookingTime: action.time,
        })
        break
      default:
        break
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickActions = [
    { label: 'Book Appointment', value: 'I want to book an appointment' },
    { label: 'Services', value: 'What services do you offer?' },
    { label: 'Timing', value: 'What are your working hours?' },
    { label: 'Location', value: 'Where are you located?' },
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-elevated flex items-center justify-center transition-all duration-300',
          'bg-primary hover:bg-primary-600 text-white',
          isOpen && 'scale-0 opacity-0'
        )}
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <div
        className={cn(
          'fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-elevated transition-all duration-300 overflow-hidden',
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        )}
      >
        <div className="gradient-primary p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">AsterMed Assistant</h3>
              <p className="text-white/70 text-xs">Online | Typically replies instantly</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-muted/50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-3 text-sm',
                  message.role === 'user'
                    ? 'bg-primary text-white rounded-br-md'
                    : 'bg-white text-text-primary shadow-sm rounded-bl-md'
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className={cn(
                  'text-xs mt-1',
                  message.role === 'user' ? 'text-white/70' : 'text-text-muted'
                )}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="px-4 py-3 border-t border-gray-100 bg-white">
            <p className="text-xs text-text-muted mb-2">Quick actions:</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => {
                    setInput(action.value)
                    setTimeout(() => sendMessage(), 100)
                  }}
                  className="px-3 py-1.5 text-xs bg-primary/5 text-primary rounded-full hover:bg-primary/10 transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2.5 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                input.trim()
                  ? 'bg-primary text-white hover:bg-primary-600'
                  : 'bg-gray-100 text-gray-400'
              )}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          
          <div className="flex items-center justify-center mt-3 space-x-4">
            <a
              href="/appointment"
              className="flex items-center text-xs text-primary hover:text-primary-600 transition-colors"
            >
              <Calendar className="w-3 h-3 mr-1" />
              Book Online
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="tel:09381659308"
              className="flex items-center text-xs text-primary hover:text-primary-600 transition-colors"
            >
              <Phone className="w-3 h-3 mr-1" />
              Call Us
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  let sessionId = sessionStorage.getItem('chat_session_id')
  if (!sessionId) {
    sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('chat_session_id', sessionId)
  }
  return sessionId
}
