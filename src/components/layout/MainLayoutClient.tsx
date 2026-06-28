'use client'

import { ReactNode, useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import Chatbot from '@/components/chatbot/Chatbot'
import { SettingsProvider } from './SettingsProvider'
import type { SiteSettings } from '@/lib/types'

interface MainLayoutClientProps {
  children: ReactNode
  settings: SiteSettings
}

interface User {
  name: string
  email: string
  role: string
}

export default function MainLayoutClient({ children, settings }: MainLayoutClientProps) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.success) setUser(data.data.user)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'page_view',
        page: window.location.pathname,
        referrer: document.referrer,
        sessionId: getSessionId(),
      }),
    }).catch(() => {})
  }, [])

  return (
    <SettingsProvider settings={settings}>
      <div className="flex flex-col min-h-screen">
        <Header user={user} />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
        <Chatbot user={user} />
      </div>
    </SettingsProvider>
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
