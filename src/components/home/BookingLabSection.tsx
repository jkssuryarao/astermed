import Link from 'next/link'
import {
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Home,
  CreditCard,
  FileText,
  Search,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { getIcon } from '@/lib/icons'
import type { SiteSettings } from '@/lib/types'

interface BookingLabSectionProps {
  settings: SiteSettings
  popularTests: string[]
  processSteps: { label: string; icon: string }[]
}

const appointmentSteps = [
  'Choose Department',
  'Select Doctor',
  'Choose Date & Time',
  'Patient Details',
  'Confirm Appointment',
]

export default function BookingLabSection({
  settings,
  popularTests,
  processSteps,
}: BookingLabSectionProps) {
  const phone = settings.clinic_phone
  const whatsapp = settings.clinic_whatsapp || phone
  const phoneHref = `tel:${phone.replace(/\s/g, '')}`
  const whatsappHref = `https://wa.me/91${whatsapp.replace(/\D/g, '').slice(-10)}`

  return (
    <section className="section bg-muted">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">BOOK APPOINTMENT</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              {appointmentSteps.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-secondary text-white text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-xs sm:text-sm text-text-secondary hidden sm:inline">{step}</span>
                  {i < appointmentSteps.length - 1 && (
                    <span className="hidden sm:inline text-text-muted mx-1">→</span>
                  )}
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="text-center py-4">
                  <Phone className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <p className="text-xs text-text-muted mb-1">Call Us</p>
                  <a href={phoneHref} className="text-sm font-semibold text-primary">{phone}</a>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center py-4">
                  <MessageCircle className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <p className="text-xs text-text-muted mb-1">WhatsApp</p>
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary">
                    {whatsapp}
                  </a>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center py-4">
                  <MapPin className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <p className="text-xs text-text-muted mb-1">Walk-in</p>
                  <p className="text-sm font-semibold text-text-primary">{settings.walk_in_text}</p>
                </CardContent>
              </Card>
            </div>

            <Link href="/appointment">
              <Button size="lg" variant="secondary" fullWidth>
                Book Appointment Now
              </Button>
            </Link>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">BOOK LAB TEST ONLINE</h2>
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search for tests (e.g., CBC, HbA1c, Thyroid)"
                className="input pl-12"
                disabled
                readOnly
              />
            </div>

            {popularTests.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-text-secondary mb-3">Popular Tests</p>
                <div className="flex flex-wrap gap-2">
                  {popularTests.map((test) => (
                    <span
                      key={test}
                      className="px-3 py-1.5 bg-white rounded-full text-sm text-text-primary border border-gray-200"
                    >
                      {test}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 gap-3 mb-6">
              {processSteps.map((step) => {
                const Icon = getIcon(step.icon)
                return (
                  <div key={step.label} className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-xs text-text-secondary">{step.label}</p>
                  </div>
                )
              })}
            </div>

            <Link href="/lab-tests">
              <Button size="lg" variant="primary" fullWidth>
                Book Lab Test Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
