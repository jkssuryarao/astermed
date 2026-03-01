'use client'

import { useState } from 'react'
import { FileEdit, Image, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

export default function CMSPage() {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    
    setTimeout(() => {
      setSaving(false)
      setMessage({ type: 'success', text: 'Content saved successfully!' })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Content Management</h1>
          <p className="text-text-secondary">Edit website content and images</p>
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

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileEdit className="w-5 h-5" />
              Home Page
            </CardTitle>
            <CardDescription>Edit the main landing page content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Hero Title"
              defaultValue="Your Health is Our Priority"
            />
            <Textarea
              label="Hero Description"
              defaultValue="Experience world-class healthcare with our team of expert doctors. We provide comprehensive medical services with a focus on patient comfort and well-being."
              rows={3}
            />
            <Input
              label="Hero Image URL"
              placeholder="https://example.com/hero-image.jpg"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileEdit className="w-5 h-5" />
              About Page
            </CardTitle>
            <CardDescription>Edit the about page content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Page Title"
              defaultValue="About AsterMed Healthcare"
            />
            <Textarea
              label="Story Section"
              defaultValue="AsterMed Healthcare was founded with a simple yet powerful vision: to make quality healthcare accessible to everyone."
              rows={4}
            />
            <Input
              label="Years of Experience"
              type="number"
              defaultValue="15"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              Image Gallery
            </CardTitle>
            <CardDescription>Manage website images</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                >
                  <Image className="w-8 h-8 text-text-muted" />
                </div>
              ))}
            </div>
            <p className="text-sm text-text-muted mt-4">
              Click on a placeholder to upload an image
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
