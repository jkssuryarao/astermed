import { Metadata } from 'next'
import Link from 'next/link'
import {
  Heart,
  Baby,
  Stethoscope,
  Bone,
  Eye,
  Brain,
  Pill,
  Activity,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import DepartmentCard from '@/components/shared/DepartmentCard'
import { getDepartments } from '@/lib/content'
import { BRAND } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'Our Services',
  description: `Explore healthcare services at ${BRAND.title}.`,
}

export const revalidate = 60

const specialties = [
  {
    id: 'general',
    icon: Stethoscope,
    title: 'General Consultation',
    description: 'Comprehensive health check-ups and primary care for all ages.',
    features: ['Complete health assessments', 'Preventive care', 'Chronic disease management', 'Health counseling'],
    color: 'bg-primary',
  },
  {
    id: 'pediatrics',
    icon: Baby,
    title: 'Pediatrics',
    description: 'Specialized care for infants, children, and adolescents.',
    features: ['Well-child visits', 'Immunizations', 'Growth monitoring', 'Nutritional guidance'],
    color: 'bg-secondary',
  },
  {
    id: 'gynecology',
    icon: Heart,
    title: 'Gynecology',
    description: "Expert women's health and prenatal care.",
    features: ['Routine exams', 'Prenatal care', 'Family planning', 'Menopause management'],
    color: 'bg-accent',
  },
  {
    id: 'cardiology',
    icon: Activity,
    title: 'Cardiology',
    description: 'Advanced heart care and diagnostic services.',
    features: ['Cardiac assessment', 'ECG services', 'Heart disease management', 'Hypertension care'],
    color: 'bg-error',
  },
  {
    id: 'orthopedics',
    icon: Bone,
    title: 'Orthopedics',
    description: 'Bone, joint, and muscle care from specialists.',
    features: ['Joint pain treatment', 'Sports injuries', 'Fracture care', 'Arthritis management'],
    color: 'bg-primary',
  },
  {
    id: 'dermatology',
    icon: Pill,
    title: 'Dermatology',
    description: 'Medical and cosmetic skin care treatments.',
    features: ['Skin conditions', 'Acne treatment', 'Hair care', 'Cosmetic dermatology'],
    color: 'bg-secondary',
  },
  {
    id: 'ophthalmology',
    icon: Eye,
    title: 'Ophthalmology',
    description: 'Comprehensive eye care and vision health.',
    features: ['Eye exams', 'Cataract evaluation', 'Glaucoma screening', 'Diabetic eye care'],
    color: 'bg-accent',
  },
  {
    id: 'neurology',
    icon: Brain,
    title: 'Neurology',
    description: 'Care for neurological conditions and disorders.',
    features: ['Headache treatment', 'Stroke care', 'Epilepsy management', 'Cognitive assessments'],
    color: 'bg-primary',
  },
]

export default async function ServicesPage() {
  const departments = await getDepartments()

  return (
    <>
      <section className="gradient-hero text-white py-20">
        <div className="container-custom max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">OUR SERVICES</h1>
          <p className="text-xl text-white/80">
            Clinic, laboratory, and vaccination services — plus specialty care under one roof.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-center mb-10">Departments</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {departments.map((dept) => (
              <div key={dept.id} id={dept.slug}>
                <DepartmentCard department={dept} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-muted" id="specialties">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-center mb-4">Specialty Services</h2>
          <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
            In-depth care across multiple medical specialties.
          </p>
          <div className="space-y-12">
            {specialties.map((service) => (
              <div key={service.id} id={service.id} className="grid lg:grid-cols-2 gap-8 items-start bg-white rounded-2xl p-8 shadow-card">
                <div>
                  <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-4`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="text-text-secondary mb-4">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-text-primary">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/appointment">
                    <Button size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>Book Appointment</Button>
                  </Link>
                </div>
                <Card className="bg-muted/50 border-0">
                  <CardContent className="flex items-center justify-center min-h-[200px]">
                    <service.icon className={`w-24 h-24 ${service.color.replace('bg-', 'text-')} opacity-20`} />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section gradient-primary text-white text-center">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">Book an appointment or contact us for more information.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/appointment"><Button variant="secondary" size="lg">Book Appointment</Button></Link>
            <Link href="/lab-tests"><Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">Book Lab Test</Button></Link>
          </div>
        </div>
      </section>
    </>
  )
}
