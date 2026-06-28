import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, GraduationCap } from 'lucide-react'
import DoctorCard from '@/components/shared/DoctorCard'
import Button from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { getDoctors } from '@/lib/content'
import { BRAND } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'Our Doctors',
  description: `Meet our team of experienced healthcare professionals at ${BRAND.title}.`,
}

export const revalidate = 60

export default async function DoctorsPage() {
  const doctors = await getDoctors()

  return (
    <>
      <section className="gradient-hero text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">MEET OUR DOCTORS</h1>
            <p className="text-xl text-white/80">
              Experienced and certified healthcare professionals dedicated to your well-being.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom">
          {doctors.length === 0 ? (
            <div className="text-center py-20 bg-muted rounded-2xl">
              <p className="text-text-secondary mb-4">Doctor profiles will be added soon.</p>
              <Link href="/appointment">
                <Button variant="secondary">Book Appointment</Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section bg-muted">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose Our Doctors?</h2>
              <p className="text-text-secondary mb-8">
                Our medical team brings specialized expertise and a patient-first approach to every consultation.
              </p>
              <ul className="space-y-3">
                {[
                  'Board-certified specialists',
                  'Continuous medical education',
                  'Patient-centered care',
                  'Modern diagnostic support',
                  'Collaborative treatment plans',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-text-primary">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Card className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Expert Care</h3>
              <p className="text-text-secondary mb-6">Trusted professionals at {BRAND.title}</p>
              <Link href="/appointment">
                <Button rightIcon={<ArrowRight className="w-5 h-5" />}>Book a Consultation</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
