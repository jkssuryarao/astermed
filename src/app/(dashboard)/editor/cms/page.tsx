'use client'

import { useState, useEffect } from 'react'
import { FileEdit, Save, Plus, Trash2, Users, Calendar, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { BRAND } from '@/lib/brand'
import type { Activity, BoardMember, DoctorProfile } from '@/lib/types'

interface ContentForm {
  heroTitle: string
  heroTagline: string
  heroSubtitle: string
  aboutText: string
  labComingSoon: string
  heroImageUrl: string
}

export default function CMSPage() {
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [form, setForm] = useState<ContentForm>({
    heroTitle: BRAND.title,
    heroTagline: 'Complete care. Trusted always.',
    heroSubtitle: BRAND.tagline,
    aboutText: '',
    labComingSoon: '',
    heroImageUrl: '',
  })
  const [doctors, setDoctors] = useState<DoctorProfile[]>([])
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([])
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [contentRes, doctorsRes, boardRes, activitiesRes, settingsRes] = await Promise.all([
        fetch('/api/content?page=home'),
        fetch('/api/doctors'),
        fetch('/api/board-members'),
        fetch('/api/activities'),
        fetch('/api/settings'),
      ])

      const contentData = await contentRes.json()
      const settingsData = await settingsRes.json()

      if (contentData.success) {
        const items = contentData.data as { section: string; key: string; value: string }[]
        const get = (section: string, key: string) =>
          items.find((c) => c.section === section && c.key === key)?.value || ''

        setForm({
          heroTitle: get('hero', 'title') || BRAND.title,
          heroTagline: get('hero', 'tagline') || 'Complete care. Trusted always.',
          heroSubtitle: get('hero', 'subtitle') || BRAND.tagline,
          aboutText: get('about', 'text') || '',
          labComingSoon: '',
          heroImageUrl: '',
        })

        const labRes = await fetch('/api/content?page=lab-tests&section=main')
        const labData = await labRes.json()
        if (labData.success) {
          const msg = labData.data.find((c: { key: string }) => c.key === 'message')?.value || ''
          setForm((f) => ({ ...f, labComingSoon: msg }))
        }
      }

      if (settingsData.success) {
        const settings = settingsData.data as { key: string; value: string }[]
        const heroImg = settings.find((s) => s.key === 'hero_image_url')?.value || ''
        setForm((f) => ({ ...f, heroImageUrl: heroImg }))
      }

      if (doctorsRes.ok) {
        const d = await doctorsRes.json()
        if (d.success) setDoctors(d.data)
      }
      if (boardRes.ok) {
        const b = await boardRes.json()
        if (b.success) setBoardMembers(b.data)
      }
      if (activitiesRes.ok) {
        const a = await activitiesRes.json()
        if (a.success) setActivities(a.data)
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to load content' })
    } finally {
      setLoading(false)
    }
  }

  const saveContent = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const contentItems = [
        { page: 'home', section: 'hero', key: 'title', value: form.heroTitle, type: 'text' },
        { page: 'home', section: 'hero', key: 'tagline', value: form.heroTagline, type: 'text' },
        { page: 'home', section: 'hero', key: 'subtitle', value: form.heroSubtitle, type: 'text' },
        { page: 'home', section: 'about', key: 'text', value: form.aboutText, type: 'text' },
        { page: 'lab-tests', section: 'main', key: 'message', value: form.labComingSoon, type: 'text' },
      ]

      const [contentRes, settingsRes] = await Promise.all([
        fetch('/api/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: contentItems }),
        }),
        fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'hero_image_url', value: form.heroImageUrl }),
        }),
      ])

      const contentResult = await contentRes.json()
      if (!contentResult.success) throw new Error(contentResult.error)

      setMessage({ type: 'success', text: 'Content saved successfully!' })
    } catch (e: unknown) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Failed to save' })
    } finally {
      setSaving(false)
    }
  }

  const saveDoctor = async (doctor: DoctorProfile) => {
    const method = doctors.find((d) => d.id === doctor.id) ? 'PUT' : 'POST'
    const res = await fetch('/api/doctors', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctor),
    })
    const data = await res.json()
    if (data.success) await loadAll()
    return data
  }

  const deleteDoctor = async (id: string) => {
    await fetch(`/api/doctors?id=${id}`, { method: 'DELETE' })
    await loadAll()
  }

  const addDoctor = () => {
    setDoctors([
      ...doctors,
      {
        id: `doc-${Date.now()}`,
        name: '',
        qualifications: '',
        specialty: '',
        experienceYears: '',
        availability: 'Mon - Sat',
        bio: '',
        photoUrl: '',
        sortOrder: String(doctors.length + 1),
        status: 'active',
      },
    ])
  }

  const addBoardMember = () => {
    setBoardMembers([
      ...boardMembers,
      {
        id: `board-${Date.now()}`,
        name: '',
        designation: '',
        qualifications: '',
        experienceYears: '',
        photoUrl: '',
        sortOrder: String(boardMembers.length + 1),
        status: 'active',
      },
    ])
  }

  const saveBoardMember = async (member: BoardMember) => {
    const method = boardMembers.some((m) => m.id === member.id && m.name) ? 'PUT' : 'POST'
    await fetch('/api/board-members', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member),
    })
    await loadAll()
  }

  const addActivity = () => {
    setActivities([
      ...activities,
      {
        id: `act-${Date.now()}`,
        title: '',
        location: '',
        date: '',
        imageUrl: '',
        description: '',
        sortOrder: String(activities.length + 1),
        status: 'active',
      },
    ])
  }

  const saveActivity = async (activity: Activity) => {
    const method = activities.some((a) => a.id === activity.id && a.title) ? 'PUT' : 'POST'
    await fetch('/api/activities', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity),
    })
    await loadAll()
  }

  if (loading) {
    return <div className="p-8 text-center text-text-muted">Loading content...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Content Management</h1>
          <p className="text-text-secondary">Edit website content stored in Google Sheets</p>
        </div>
        <Button onClick={saveContent} loading={saving}>
          <Save className="w-4 h-4 mr-2" />
          Save Page Content
        </Button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-accent/10 text-accent-700' : 'bg-error/10 text-error'}`}>
          {message.text}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileEdit className="w-5 h-5" />Home Page</CardTitle>
          <CardDescription>Hero and about content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input label="Hero Title" value={form.heroTitle} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })} />
          <Input label="Hero Tagline" value={form.heroTagline} onChange={(e) => setForm({ ...form, heroTagline: e.target.value })} />
          <Input label="Hero Subtitle" value={form.heroSubtitle} onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })} />
          <Input label="Hero Image URL" value={form.heroImageUrl} onChange={(e) => setForm({ ...form, heroImageUrl: e.target.value })} placeholder="https://..." />
          <Textarea label="About Text" value={form.aboutText} onChange={(e) => setForm({ ...form, aboutText: e.target.value })} rows={4} />
          <Textarea label="Lab Tests Coming Soon Message" value={form.labComingSoon} onChange={(e) => setForm({ ...form, labComingSoon: e.target.value })} rows={2} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Doctors</CardTitle>
              <CardDescription>Manage doctor profiles</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={addDoctor}><Plus className="w-4 h-4 mr-1" />Add</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {doctors.length === 0 && <p className="text-text-muted text-sm">No doctors yet. Click Add to create one.</p>}
          {doctors.map((doctor, i) => (
            <div key={doctor.id} className="p-4 border rounded-lg space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <Input label="Name" value={doctor.name} onChange={(e) => { const d = [...doctors]; d[i] = { ...d[i], name: e.target.value }; setDoctors(d) }} />
                <Input label="Specialty" value={doctor.specialty} onChange={(e) => { const d = [...doctors]; d[i] = { ...d[i], specialty: e.target.value }; setDoctors(d) }} />
                <Input label="Qualifications" value={doctor.qualifications} onChange={(e) => { const d = [...doctors]; d[i] = { ...d[i], qualifications: e.target.value }; setDoctors(d) }} />
                <Input label="Experience (years)" value={doctor.experienceYears} onChange={(e) => { const d = [...doctors]; d[i] = { ...d[i], experienceYears: e.target.value }; setDoctors(d) }} />
                <Input label="Availability" value={doctor.availability} onChange={(e) => { const d = [...doctors]; d[i] = { ...d[i], availability: e.target.value }; setDoctors(d) }} />
                <Input label="Photo URL" value={doctor.photoUrl} onChange={(e) => { const d = [...doctors]; d[i] = { ...d[i], photoUrl: e.target.value }; setDoctors(d) }} />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => saveDoctor(doctor)}>Save Doctor</Button>
                <Button size="sm" variant="ghost" onClick={() => deleteDoctor(doctor.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5" />Board Members</CardTitle>
            </div>
            <Button size="sm" variant="outline" onClick={addBoardMember}><Plus className="w-4 h-4 mr-1" />Add</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {boardMembers.map((member, i) => (
            <div key={member.id} className="p-4 border rounded-lg space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <Input label="Name" value={member.name} onChange={(e) => { const m = [...boardMembers]; m[i] = { ...m[i], name: e.target.value }; setBoardMembers(m) }} />
                <Input label="Designation" value={member.designation} onChange={(e) => { const m = [...boardMembers]; m[i] = { ...m[i], designation: e.target.value }; setBoardMembers(m) }} />
                <Input label="Qualifications" value={member.qualifications} onChange={(e) => { const m = [...boardMembers]; m[i] = { ...m[i], qualifications: e.target.value }; setBoardMembers(m) }} />
                <Input label="Photo URL" value={member.photoUrl} onChange={(e) => { const m = [...boardMembers]; m[i] = { ...m[i], photoUrl: e.target.value }; setBoardMembers(m) }} />
              </div>
              <Button size="sm" onClick={() => saveBoardMember(member)}>Save Member</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" />Activities</CardTitle>
            </div>
            <Button size="sm" variant="outline" onClick={addActivity}><Plus className="w-4 h-4 mr-1" />Add</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {activities.map((activity, i) => (
            <div key={activity.id} className="p-4 border rounded-lg space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <Input label="Title" value={activity.title} onChange={(e) => { const a = [...activities]; a[i] = { ...a[i], title: e.target.value }; setActivities(a) }} />
                <Input label="Location" value={activity.location} onChange={(e) => { const a = [...activities]; a[i] = { ...a[i], location: e.target.value }; setActivities(a) }} />
                <Input label="Date" value={activity.date} onChange={(e) => { const a = [...activities]; a[i] = { ...a[i], date: e.target.value }; setActivities(a) }} />
                <Input label="Image URL" value={activity.imageUrl} onChange={(e) => { const a = [...activities]; a[i] = { ...a[i], imageUrl: e.target.value }; setActivities(a) }} />
              </div>
              <Button size="sm" onClick={() => saveActivity(activity)}>Save Activity</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
