'use client'

import { useState, useEffect } from 'react'
import { Bot, Power, MessageSquare, Zap, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

export default function ChatbotSettings() {
  const [settings, setSettings] = useState({
    chatbot_enabled: 'true',
    chatbot_mode: 'nlp',
    whatsapp_number: '',
    greeting_message: "Hello! Welcome to AsterMed Healthcare. How can I assist you today?",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings?keys=chatbot_enabled,chatbot_mode')
        const data = await response.json()
        
        if (data.success) {
          setSettings(prev => ({ ...prev, ...data.data }))
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            chatbot_enabled: settings.chatbot_enabled,
            chatbot_mode: settings.chatbot_mode,
          },
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Chatbot settings saved successfully!' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save settings' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="loader" />
      </div>
    )
  }

  const modes = [
    {
      value: 'appointment',
      label: 'Appointment Only',
      description: 'Chatbot focuses solely on helping users book appointments',
      icon: '📅',
    },
    {
      value: 'nlp',
      label: 'NLP + Appointment',
      description: 'Natural language responses with appointment booking capability',
      icon: '🤖',
    },
    {
      value: 'whatsapp',
      label: 'WhatsApp Redirect',
      description: 'Redirects users to WhatsApp for personalized assistance',
      icon: '💬',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Chatbot Settings</h1>
          <p className="text-text-secondary">Configure the website chatbot behavior</p>
        </div>
        <Button onClick={handleSave} loading={saving}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-accent/10 text-accent-700' : 'bg-error/10 text-error'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Power className="w-5 h-5" />
                Chatbot Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    settings.chatbot_enabled === 'true' ? 'bg-accent' : 'bg-gray-400'
                  }`} />
                  <span className="font-medium">
                    {settings.chatbot_enabled === 'true' ? 'Chatbot is Active' : 'Chatbot is Disabled'}
                  </span>
                </div>
                <Button
                  variant={settings.chatbot_enabled === 'true' ? 'danger' : 'primary'}
                  size="sm"
                  onClick={() => setSettings(prev => ({
                    ...prev,
                    chatbot_enabled: prev.chatbot_enabled === 'true' ? 'false' : 'true'
                  }))}
                >
                  {settings.chatbot_enabled === 'true' ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Chatbot Mode
              </CardTitle>
              <CardDescription>Select how the chatbot should interact with visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {modes.map((mode) => (
                  <div
                    key={mode.value}
                    onClick={() => setSettings(prev => ({ ...prev, chatbot_mode: mode.value }))}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      settings.chatbot_mode === mode.value
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent bg-muted hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{mode.icon}</span>
                      <div>
                        <p className="font-medium text-text-primary">{mode.label}</p>
                        <p className="text-sm text-text-muted">{mode.description}</p>
                      </div>
                      {settings.chatbot_mode === mode.value && (
                        <div className="ml-auto">
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {settings.chatbot_mode === 'whatsapp' && (
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="WhatsApp Business Number"
                  placeholder="+91 9876543210"
                  value={settings.whatsapp_number}
                  onChange={(e) => setSettings(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                />
                <p className="text-sm text-text-muted">
                  Enter the WhatsApp Business number users will be redirected to
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Greeting Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={settings.greeting_message}
                onChange={(e) => setSettings(prev => ({ ...prev, greeting_message: e.target.value }))}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">AsterMed Assistant</p>
                    <p className="text-xs text-text-muted">
                      {settings.chatbot_enabled === 'true' ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 text-sm">
                  {settings.greeting_message}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
