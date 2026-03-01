'use client'

import { ReactNode, useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import Chatbot from '@/components/chatbot/Chatbot'

interface MainLayoutProps {
  children: ReactNode
}

interface User {
  name: string
  email: string
  role: string
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setUser(data.data.user)
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUser()
  }, [])

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'page_view',
            page: window.location.pathname,
            referrer: document.referrer,
            sessionId: getSessionId(),
          }),
        })
      } catch (error) {
        // Silent fail for analytics
      }
    }
    
    trackPageView()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
      <Chatbot user={user} />
    </div>
  )
}

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  let sessionId = sessionStorage.getItem('session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('session_id', sessionId)
  }
  return sessionId
}
