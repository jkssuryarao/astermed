import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import AboutJourneySection from '@/components/home/AboutJourneySection'
import { getHomePageData } from '@/lib/content'
import { BRAND } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'About Us',
  description: `About ${BRAND.title} — ${BRAND.tagline}`,
}

export const revalidate = 60

export default async function AboutPage() {
  const data = await getHomePageData()

  return (
    <>
      <section className="gradient-hero text-white py-20">
        <div className="container-custom max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About {BRAND.title}</h1>
          <p className="text-xl text-white/80">{BRAND.tagline}</p>
        </div>
      </section>

      <AboutJourneySection
        aboutText={data.about.text}
        aboutValues={data.about.values}
        milestones={data.journey}
      />

      <section className="section bg-white text-center">
        <div className="container-custom">
          <h2 className="text-2xl font-bold mb-4">Visit Us Today</h2>
          <p className="text-text-secondary mb-8 max-w-xl mx-auto">
            Experience quality healthcare at our Hafeezpet clinic.
          </p>
          <Link href="/appointment">
            <Button rightIcon={<ArrowRight className="w-5 h-5" />}>Book Appointment</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
