'use client'

import { useState, useEffect } from 'react'
import { Save, RefreshCw, Instagram, Youtube, Linkedin, Facebook, Clock, Bot, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

interface Settings {
  clinic_name: string
  clinic_email: string
  clinic_phone: string
  clinic_address: string
  chatbot_enabled: string
  chatbot_mode: string
  social_instagram: string
  social_youtube: string
  social_linkedin: string
  social_facebook: string
  instagram_enabled: string
  youtube_enabled: string
  linkedin_enabled: string
  facebook_enabled: string
  working_hours_start: string
  working_hours_end: string
  booking_advance_days: string
  time_slot_duration: string
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        const data = await response.json()
        
        if (data.success) {
          const settingsMap: Settings = {} as Settings
          data.data.forEach((s: { key: string; value: string }) => {
            settingsMap[s.key as keyof Settings] = s.value
          })
          setSettings(settingsMap)
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
    if (!settings) return
    
    setSaving(true)
    setMessage(null)
    
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save settings' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' })
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: keyof Settings, value: string) => {
    if (settings) {
      setSettings({ ...settings, [key]: value })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="loader" />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">Failed to load settings</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
          <p className="text-text-secondary">Manage system configuration</p>
        </div>
        <Button onClick={handleSave} loading={saving}>
          <Save className="w-4 h-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-accent/10 text-accent-700' : 'bg-error/10 text-error'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Clinic Information</CardTitle>
            <CardDescription>Basic clinic details displayed on the website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Clinic Name"
              value={settings.clinic_name || ''}
              onChange={(e) => updateSetting('clinic_name', e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              value={settings.clinic_email || ''}
              onChange={(e) => updateSetting('clinic_email', e.target.value)}
            />
            <Input
              label="Phone"
              value={settings.clinic_phone || ''}
              onChange={(e) => updateSetting('clinic_phone', e.target.value)}
            />
            <Input
              label="Address"
              value={settings.clinic_address || ''}
              onChange={(e) => updateSetting('clinic_address', e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Working Hours
            </CardTitle>
            <CardDescription>Configure appointment booking settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Opening Time"
                type="time"
                value={settings.working_hours_start || '09:00'}
                onChange={(e) => updateSetting('working_hours_start', e.target.value)}
              />
              <Input
                label="Closing Time"
                type="time"
                value={settings.working_hours_end || '18:00'}
                onChange={(e) => updateSetting('working_hours_end', e.target.value)}
              />
            </div>
            <Input
              label="Advance Booking Days"
              type="number"
              value={settings.booking_advance_days || '90'}
              onChange={(e) => updateSetting('booking_advance_days', e.target.value)}
            />
            <Select
              label="Time Slot Duration"
              options={[
                { value: '15', label: '15 minutes' },
                { value: '30', label: '30 minutes' },
                { value: '45', label: '45 minutes' },
                { value: '60', label: '60 minutes' },
              ]}
              value={settings.time_slot_duration || '30'}
              onChange={(e) => updateSetting('time_slot_duration', e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Chatbot Settings
            </CardTitle>
            <CardDescription>Configure the website chatbot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Chatbot Status"
              options={[
                { value: 'true', label: 'Enabled' },
                { value: 'false', label: 'Disabled' },
              ]}
              value={settings.chatbot_enabled || 'true'}
              onChange={(e) => updateSetting('chatbot_enabled', e.target.value)}
            />
            <Select
              label="Chatbot Mode"
              options={[
                { value: 'appointment', label: 'Appointment-only' },
                { value: 'nlp', label: 'NLP + Appointment' },
                { value: 'whatsapp', label: 'WhatsApp Redirect' },
              ]}
              value={settings.chatbot_mode || 'nlp'}
              onChange={(e) => updateSetting('chatbot_mode', e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>Social media links and visibility</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Instagram className="w-5 h-5 text-pink-500" />
              <Input
                className="flex-1"
                placeholder="Instagram URL"
                value={settings.social_instagram || ''}
                onChange={(e) => updateSetting('social_instagram', e.target.value)}
              />
              <Select
                options={[
                  { value: 'true', label: 'Show' },
                  { value: 'false', label: 'Hide' },
                ]}
                value={settings.instagram_enabled || 'true'}
                onChange={(e) => updateSetting('instagram_enabled', e.target.value)}
                className="w-24"
              />
            </div>
            <div className="flex items-center gap-4">
              <Youtube className="w-5 h-5 text-red-500" />
              <Input
                className="flex-1"
                placeholder="YouTube URL"
                value={settings.social_youtube || ''}
                onChange={(e) => updateSetting('social_youtube', e.target.value)}
              />
              <Select
                options={[
                  { value: 'true', label: 'Show' },
                  { value: 'false', label: 'Hide' },
                ]}
                value={settings.youtube_enabled || 'true'}
                onChange={(e) => updateSetting('youtube_enabled', e.target.value)}
                className="w-24"
              />
            </div>
            <div className="flex items-center gap-4">
              <Linkedin className="w-5 h-5 text-blue-600" />
              <Input
                className="flex-1"
                placeholder="LinkedIn URL"
                value={settings.social_linkedin || ''}
                onChange={(e) => updateSetting('social_linkedin', e.target.value)}
              />
              <Select
                options={[
                  { value: 'true', label: 'Show' },
                  { value: 'false', label: 'Hide' },
                ]}
                value={settings.linkedin_enabled || 'true'}
                onChange={(e) => updateSetting('linkedin_enabled', e.target.value)}
                className="w-24"
              />
            </div>
            <div className="flex items-center gap-4">
              <Facebook className="w-5 h-5 text-blue-500" />
              <Input
                className="flex-1"
                placeholder="Facebook URL"
                value={settings.social_facebook || ''}
                onChange={(e) => updateSetting('social_facebook', e.target.value)}
              />
              <Select
                options={[
                  { value: 'true', label: 'Show' },
                  { value: 'false', label: 'Hide' },
                ]}
                value={settings.facebook_enabled || 'true'}
                onChange={(e) => updateSetting('facebook_enabled', e.target.value)}
                className="w-24"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
