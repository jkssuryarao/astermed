import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import { getIcon } from '@/lib/icons'
import type { SiteSettings } from '@/lib/types'

interface HeroSectionProps {
  title: string
  tagline: string
  subtitle: string
  values: { label: string; icon: string }[]
  settings: SiteSettings
}

export default function HeroSection({ title, tagline, subtitle, values, settings }: HeroSectionProps) {
  const bgImage = settings.hero_image_url || 'https://images.unsplash.com/photo-1519494020893-4d4167359e33?w=1920&h=800&fit=crop'

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-primary/40" />

      <div className="container-custom relative z-10 py-20">
        <div className="max-w-2xl text-white">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-secondary font-medium mb-2">{tagline}</p>
          {subtitle && <p className="text-white/80 mb-8">{subtitle}</p>}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {values.map((item) => {
              const Icon = getIcon(item.icon)
              return (
                <div key={item.label} className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-2">
                    <Icon className="w-6 h-6 text-secondary" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium">{item.label}</p>
                </div>
              )
            })}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/appointment">
              <Button size="lg" variant="secondary" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Book Appointment
              </Button>
            </Link>
            <Link href="/lab-tests">
              <Button size="lg" variant="primary" className="bg-primary-800 hover:bg-primary-900 border-2 border-white/20">
                Book Lab Test
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
