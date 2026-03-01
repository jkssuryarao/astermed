'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react'
import { querySchema } from '@/lib/validation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { Card, CardContent } from '@/components/ui/Card'
import { z } from 'zod'

type ContactForm = z.infer<typeof querySchema>

const contactInfo = [
  {
    icon: MapPin,
    title: 'Address',
    content: ['Vinayaka Nagar, Hafeezpet,', 'Hyderabad, Telangana 500049'],
    color: 'bg-primary',
  },
  {
    icon: Phone,
    title: 'Phone',
    content: ['093816 59308'],
    link: 'tel:09381659308',
    color: 'bg-secondary',
  },
  {
    icon: Mail,
    title: 'Email',
    content: ['contact@astermedhealthcare.com'],
    link: 'mailto:contact@astermedhealthcare.com',
    color: 'bg-accent',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    content: ['Mon - Sat: 9:00 AM - 6:00 PM', 'Sunday: Closed'],
    color: 'bg-primary',
  },
]

export default function ContactPage() {
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
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="gradient-hero text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-white/80">
              Have questions or need assistance? We're here to help. 
              Reach out to us through any of the following channels.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((item) => (
              <Card key={item.title} hover className="text-center">
                <CardContent>
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-xl ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  {item.content.map((line, index) => (
                    <p key={index} className="text-text-secondary">
                      {item.link ? (
                        <a href={item.link} className="hover:text-primary transition-colors">
                          {line}
                        </a>
                      ) : (
                        line
                      )}
                    </p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-4">Send Us a Message</h2>
              <p className="text-text-secondary mb-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              {success ? (
                <Card className="bg-accent/10 border border-accent/20">
                  <CardContent className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold text-accent-700 mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-text-secondary mb-4">
                      We've received your message and will respond within 24-48 hours.
                    </p>
                    <Button variant="outline" onClick={() => setSuccess(false)}>
                      Send Another Message
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {error && (
                    <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      label="Full Name"
                      placeholder="John Doe"
                      required
                      {...register('guestName')}
                      error={errors.guestName?.message}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      required
                      {...register('guestEmail')}
                      error={errors.guestEmail?.message}
                    />
                  </div>

                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+91 9876543210"
                    {...register('guestMobile')}
                    error={errors.guestMobile?.message}
                  />

                  <Input
                    label="Subject"
                    placeholder="How can we help?"
                    required
                    {...register('subject')}
                    error={errors.subject?.message}
                  />

                  <Textarea
                    label="Message"
                    placeholder="Write your message here..."
                    rows={5}
                    required
                    {...register('message')}
                    error={errors.message?.message}
                  />

                  <Button type="submit" loading={loading} leftIcon={<Send className="w-5 h-5" />}>
                    Send Message
                  </Button>
                </form>
              )}
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">Find Us</h2>
              <p className="text-text-secondary mb-8">
                Visit our clinic for in-person consultation. We're conveniently located in Hafeezpet, Hyderabad.
              </p>
              
              <div className="rounded-xl overflow-hidden shadow-card h-[400px] bg-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.0677744090747!2d78.35747897516748!3d17.48952998339859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93dc8c5d69df%3A0x19688beb557fa0ee!2sHafeezpet%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-text-secondary">
                  <strong>Directions:</strong> We are located in Vinayaka Nagar, Hafeezpet. 
                  Nearest landmark is the Hafeezpet Metro Station (1.5 km away).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
