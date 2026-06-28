import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import DoctorCard from '@/components/shared/DoctorCard'
import HorizontalCarousel from '@/components/shared/HorizontalCarousel'
import type { DoctorProfile } from '@/lib/types'

interface DoctorsCarouselSectionProps {
  doctors: DoctorProfile[]
}

export default function DoctorsCarouselSection({ doctors }: DoctorsCarouselSectionProps) {
  if (doctors.length === 0) {
    return (
      <section className="section bg-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">MEET OUR DOCTORS</h2>
          <p className="text-text-secondary mb-6">Doctor profiles will be added soon.</p>
          <Link href="/doctors" className="text-primary font-medium hover:underline">
            View Doctors Page
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">MEET OUR DOCTORS</h2>
          <Link href="/doctors" className="text-primary font-medium flex items-center gap-1 hover:underline">
            View All Doctors <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <HorizontalCarousel>
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} compact />
          ))}
        </HorizontalCarousel>
      </div>
    </section>
  )
}
