import Link from 'next/link'
import { Phone, MessageCircle, Mail } from 'lucide-react'
import Button from '@/components/ui/Button'
import { getContentValue, getSiteSettings } from '@/lib/content'

export const revalidate = 60

export default async function LabTestsPage() {
  const [settings, message] = await Promise.all([
    getSiteSettings(),
    getContentValue(
      'lab-tests',
      'main',
      'message',
      'Online lab test booking is coming soon. Please contact us to book your tests.'
    ),
  ])

  const phone = settings.clinic_phone
  const whatsapp = settings.clinic_whatsapp || phone
  const phoneHref = `tel:${phone.replace(/\s/g, '')}`
  const whatsappHref = `https://wa.me/91${whatsapp.replace(/\D/g, '').slice(-10)}`

  return (
    <section className="section bg-muted min-h-[60vh]">
      <div className="container-custom max-w-2xl text-center">
        <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Laboratory</span>
        <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-6">Book Lab Test</h1>
        <p className="text-text-secondary text-lg mb-10">{message}</p>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <a href={phoneHref} className="bg-white rounded-xl p-6 shadow-card hover:shadow-elevated transition-shadow">
            <Phone className="w-8 h-8 text-secondary mx-auto mb-3" />
            <p className="font-semibold text-text-primary">Call Us</p>
            <p className="text-sm text-text-secondary mt-1">{phone}</p>
          </a>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl p-6 shadow-card hover:shadow-elevated transition-shadow">
            <MessageCircle className="w-8 h-8 text-secondary mx-auto mb-3" />
            <p className="font-semibold text-text-primary">WhatsApp</p>
            <p className="text-sm text-text-secondary mt-1">{whatsapp}</p>
          </a>
          <a href={`mailto:${settings.clinic_email}`} className="bg-white rounded-xl p-6 shadow-card hover:shadow-elevated transition-shadow">
            <Mail className="w-8 h-8 text-secondary mx-auto mb-3" />
            <p className="font-semibold text-text-primary">Email</p>
            <p className="text-sm text-text-secondary mt-1">{settings.clinic_email}</p>
          </a>
        </div>

        <Link href="/contact">
          <Button size="lg" variant="secondary">Contact Us</Button>
        </Link>
      </div>
    </section>
  )
}
