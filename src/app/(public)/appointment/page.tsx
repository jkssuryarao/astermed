'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Calendar, Clock, User, Mail, Phone, FileText, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { appointmentSchema } from '@/lib/validation'
import { formatDate, formatTime, getCurrentDate, getMaxBookingDate, generateGoogleCalendarUrl } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { TimeSlot } from '@/lib/types'

const services = [
  { value: 'general', label: 'General Consultation' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'gynecology', label: 'Gynecology' },
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'orthopedics', label: 'Orthopedics' },
  { value: 'dermatology', label: 'Dermatology' },
  { value: 'ent', label: 'ENT' },
  { value: 'ophthalmology', label: 'Ophthalmology' },
]

const guestSchema = z.object({
  guestName: z.string().min(2, 'Name is required'),
  guestEmail: z.string().email('Valid email is required'),
  guestMobile: z.string().min(10, 'Valid mobile number is required'),
})

type AppointmentForm = z.infer<typeof appointmentSchema>

export default function AppointmentPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [appointment, setAppointment] = useState<any>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AppointmentForm>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      service: '',
      notes: '',
    },
  })

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
      }
    }
    fetchUser()
  }, [])

  const fetchSlots = async (date: string) => {
    setSlotsLoading(true)
    try {
      const response = await fetch(`/api/appointments/slots?date=${date}`)
      const data = await response.json()
      if (data.success) {
        setSlots(data.data)
      }
    } catch (error) {
      console.error('Error fetching slots:', error)
    } finally {
      setSlotsLoading(false)
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value
    setSelectedDate(date)
    setSelectedSlot('')
    setValue('date', date)
    setValue('timeSlot', '')
    if (date) {
      fetchSlots(date)
    }
  }

  const handleSlotSelect = (time: string) => {
    setSelectedSlot(time)
    setValue('timeSlot', time)
  }

  const onSubmit = async (data: AppointmentForm) => {
    setLoading(true)
    setError('')

    try {
      const payload = {
        ...data,
        ...(user ? {} : {
          guestName: data.guestName,
          guestEmail: data.guestEmail,
          guestMobile: data.guestMobile,
        }),
      }

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.success) {
        setAppointment(result.data)
        setSuccess(true)
        setStep(4)
      } else {
        setError(result.error || 'Failed to book appointment')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const watchedService = watch('service')

  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
              Book an Appointment
            </h1>
            <p className="text-text-secondary">
              Schedule your visit in just a few simple steps
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step >= s
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-text-muted'
                    }`}
                  >
                    {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                  </div>
                  {s < 4 && (
                    <div
                      className={`w-12 h-1 mx-2 transition-all ${
                        step > s ? 'bg-primary' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-8">
              {error && (
                <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                  {error}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold mb-2">Select Service & Date</h2>
                    <p className="text-text-secondary text-sm">
                      Choose the service you need and your preferred date
                    </p>
                  </div>

                  <Select
                    label="Select Service"
                    options={services}
                    placeholder="Choose a service"
                    required
                    {...register('service')}
                    error={errors.service?.message}
                  />

                  <div>
                    <label className="label">
                      Select Date <span className="text-error">*</span>
                    </label>
                    <input
                      type="date"
                      min={getCurrentDate()}
                      max={getMaxBookingDate()}
                      value={selectedDate}
                      onChange={handleDateChange}
                      className="input"
                    />
                    <p className="text-xs text-text-muted mt-1">
                      You can book up to 3 months in advance
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!watchedService || !selectedDate}
                      rightIcon={<ArrowRight className="w-5 h-5" />}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold mb-2">Select Time Slot</h2>
                    <p className="text-text-secondary text-sm">
                      Choose an available time slot for {formatDate(selectedDate)}
                    </p>
                  </div>

                  {slotsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="loader" />
                    </div>
                  ) : slots.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-text-muted">No slots available for this date</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {slots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => handleSlotSelect(slot.time)}
                          disabled={!slot.available}
                          className={`p-3 rounded-lg text-sm font-medium transition-all ${
                            selectedSlot === slot.time
                              ? 'bg-primary text-white'
                              : slot.available
                              ? 'bg-white border border-gray-200 hover:border-primary hover:text-primary'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {formatTime(slot.time)}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button
                      variant="ghost"
                      onClick={() => setStep(1)}
                      leftIcon={<ArrowLeft className="w-5 h-5" />}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={!selectedSlot}
                      rightIcon={<ArrowRight className="w-5 h-5" />}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold mb-2">
                      {user ? 'Confirm Details' : 'Enter Your Details'}
                    </h2>
                    <p className="text-text-secondary text-sm">
                      {user
                        ? 'Review your appointment details'
                        : 'Please provide your contact information'}
                    </p>
                  </div>

                  <div className="bg-muted rounded-lg p-4 mb-6">
                    <h3 className="font-medium mb-3">Appointment Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-text-muted">Service:</span>
                        <p className="font-medium">
                          {services.find((s) => s.value === watchedService)?.label}
                        </p>
                      </div>
                      <div>
                        <span className="text-text-muted">Date:</span>
                        <p className="font-medium">{formatDate(selectedDate)}</p>
                      </div>
                      <div>
                        <span className="text-text-muted">Time:</span>
                        <p className="font-medium">{formatTime(selectedSlot)}</p>
                      </div>
                    </div>
                  </div>

                  {!user && (
                    <div className="space-y-4">
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
                      <Input
                        label="Mobile Number"
                        type="tel"
                        placeholder="+91 9876543210"
                        required
                        {...register('guestMobile')}
                        error={errors.guestMobile?.message}
                      />
                    </div>
                  )}

                  {user && (
                    <div className="bg-accent/10 rounded-lg p-4">
                      <p className="text-accent-700 text-sm">
                        Booking as: <strong>{user.name}</strong> ({user.email})
                      </p>
                    </div>
                  )}

                  <Textarea
                    label="Additional Notes (Optional)"
                    placeholder="Any specific concerns or requirements..."
                    {...register('notes')}
                  />

                  <input type="hidden" {...register('date')} value={selectedDate} />
                  <input type="hidden" {...register('timeSlot')} value={selectedSlot} />

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep(2)}
                      leftIcon={<ArrowLeft className="w-5 h-5" />}
                    >
                      Back
                    </Button>
                    <Button type="submit" loading={loading}>
                      Confirm Booking
                    </Button>
                  </div>
                </form>
              )}

              {step === 4 && success && appointment && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    Appointment Booked!
                  </h2>
                  <p className="text-text-secondary mb-6">
                    Your appointment has been successfully scheduled.
                  </p>

                  <div className="bg-muted rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
                    <h3 className="font-semibold mb-4">Appointment Details</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Reference ID:</span>
                        <span className="font-mono">{appointment.id.slice(0, 8).toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Service:</span>
                        <span>{services.find((s) => s.value === appointment.service)?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Date:</span>
                        <span>{formatDate(appointment.date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Time:</span>
                        <span>{formatTime(appointment.timeSlot)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={generateGoogleCalendarUrl(appointment)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline">
                        <Calendar className="w-4 h-4 mr-2" />
                        Add to Calendar
                      </Button>
                    </a>
                    <Button onClick={() => router.push('/')}>
                      Back to Home
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
