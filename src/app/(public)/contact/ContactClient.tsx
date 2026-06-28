'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react'
import { querySchema } from '@/lib/validation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { Card, CardContent } from '@/components/ui/Card'
import { z } from 'zod'
import type { SiteSettings } from '@/lib/types'

type ContactForm = z.infer<typeof querySchema>

interface ContactClientProps {
  settings: SiteSettings
}

export default function ContactClient({ settings }: ContactClientProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(querySchema),
  })

  const onSubmit = async (data: ContactForm) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        setSuccess(true)
        reset()
      } else {
        setError(result.error || 'Failed to send message')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const phoneHref = `tel:${settings.clinic_phone.replace(/\s/g, '')}`
  const addressLines = settings.clinic_address.split(',').map((s) => s.trim())

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      content: addressLines.length > 1 ? addressLines : [settings.clinic_address],
      color: 'bg-primary',
    },
    {
      icon: Phone,
      title: 'Phone',
      content: [settings.clinic_phone],
      link: phoneHref,
      color: 'bg-secondary',
    },
    {
      icon: Mail,
      title: 'Email',
      content: [settings.clinic_email],
      link: `mailto:${settings.clinic_email}`,
      color: 'bg-accent',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: [
        `Mon - Sat: ${settings.working_hours_start} - ${settings.working_hours_end}`,
        'Sunday: Closed',
      ],
      color: 'bg-primary',
    },
  ]

  return (
    <>
      <section className="gradient-hero text-white py-20">
        <div className="container-custom max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-white/80">
            Get in touch with us for appointments, inquiries, or feedback.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info) => (
              <Card key={info.title} hover>
                <CardContent className="text-center">
                  <div className={`w-14 h-14 mx-auto rounded-xl ${info.color} flex items-center justify-center mb-4`}>
                    <info.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">{info.title}</h3>
                  {info.link ? (
                    <a href={info.link} className="text-text-secondary hover:text-primary text-sm">
                      {info.content.map((line, i) => (
                        <span key={i} className="block">{line}</span>
                      ))}
                    </a>
                  ) : (
                    info.content.map((line, i) => (
                      <p key={i} className="text-text-secondary text-sm">{line}</p>
                    ))
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              {success ? (
                <Card className="bg-accent/5 border border-accent/20">
                  <CardContent className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-accent mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
                    <p className="text-text-secondary">We will get back to you soon.</p>
                    <Button className="mt-4" variant="outline" onClick={() => setSuccess(false)}>
                      Send Another Message
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {error && (
                    <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">{error}</div>
                  )}
                  <Input label="Name" required {...register('guestName')} error={errors.guestName?.message} />
                  <Input label="Email" type="email" required {...register('guestEmail')} error={errors.guestEmail?.message} />
                  <Input label="Phone" required {...register('guestMobile')} error={errors.guestMobile?.message} />
                  <Input label="Subject" required {...register('subject')} error={errors.subject?.message} />
                  <Textarea label="Message" required rows={5} {...register('message')} error={errors.message?.message} />
                  <Button type="submit" loading={loading} leftIcon={<Send className="w-4 h-4" />}>
                    Send Message
                  </Button>
                </form>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Find Us</h2>
              <div className="rounded-2xl overflow-hidden h-80 bg-muted">
                {settings.clinic_map_embed ? (
                  <iframe
                    src={settings.clinic_map_embed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Clinic location"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    <MapPin className="w-12 h-12" />
                  </div>
                )}
              </div>
              {settings.clinic_map_url && (
                <a
                  href={settings.clinic_map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4"
                >
                  <Button variant="secondary" size="sm">Get Directions</Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
