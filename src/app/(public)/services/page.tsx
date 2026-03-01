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
  CheckCircle
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Explore comprehensive healthcare services at AsterMed Healthcare - from general consultation to specialized treatments.',
}

const services = [
  {
    id: 'general',
    icon: Stethoscope,
    title: 'General Consultation',
    description: 'Comprehensive health check-ups and primary care services for all ages. Our experienced general physicians provide thorough examinations and personalized health advice.',
    features: [
      'Complete health assessments',
      'Preventive care and screenings',
      'Chronic disease management',
      'Health counseling and education',
      'Referrals to specialists when needed',
    ],
    color: 'bg-primary',
  },
  {
    id: 'pediatrics',
    icon: Baby,
    title: 'Pediatrics',
    description: 'Specialized care for infants, children, and adolescents. Our pediatric team provides comprehensive healthcare from newborn care to adolescent medicine.',
    features: [
      'Well-child visits and immunizations',
      'Growth and development monitoring',
      'Childhood illness treatment',
      'Nutritional guidance',
      'Behavioral health support',
    ],
    color: 'bg-secondary',
  },
  {
    id: 'gynecology',
    icon: Heart,
    title: 'Gynecology',
    description: "Expert women's health services covering all aspects of reproductive health. Our gynecologists provide compassionate care in a comfortable environment.",
    features: [
      'Routine gynecological exams',
      'Prenatal and postnatal care',
      'Family planning services',
      'Menopause management',
      'Treatment of gynecological conditions',
    ],
    color: 'bg-accent',
  },
  {
    id: 'cardiology',
    icon: Activity,
    title: 'Cardiology',
    description: 'Advanced heart care with modern diagnostic facilities. Our cardiologists specialize in the prevention, diagnosis, and treatment of heart conditions.',
    features: [
      'Cardiac risk assessment',
      'ECG and echocardiography',
      'Heart disease management',
      'Hypertension treatment',
      'Lifestyle modification counseling',
    ],
    color: 'bg-error',
  },
  {
    id: 'orthopedics',
    icon: Bone,
    title: 'Orthopedics',
    description: 'Comprehensive bone, joint, and muscle care. Our orthopedic specialists treat a wide range of musculoskeletal conditions using the latest techniques.',
    features: [
      'Joint pain treatment',
      'Sports injury management',
      'Fracture care',
      'Arthritis treatment',
      'Physical therapy coordination',
    ],
    color: 'bg-primary',
  },
  {
    id: 'dermatology',
    icon: Pill,
    title: 'Dermatology',
    description: 'Complete skin care treatments including medical dermatology and cosmetic procedures. Our dermatologists address all skin, hair, and nail concerns.',
    features: [
      'Acne and skin condition treatment',
      'Skin cancer screening',
      'Cosmetic dermatology',
      'Hair loss treatment',
      'Laser treatments',
    ],
    color: 'bg-secondary',
  },
  {
    id: 'ophthalmology',
    icon: Eye,
    title: 'Ophthalmology',
    description: 'Comprehensive eye care services from routine eye exams to advanced treatments. Our ophthalmologists ensure your vision health is in good hands.',
    features: [
      'Comprehensive eye exams',
      'Cataract evaluation',
      'Glaucoma screening',
      'Diabetic eye care',
      'Vision correction consultations',
    ],
    color: 'bg-accent',
  },
  {
    id: 'neurology',
    icon: Brain,
    title: 'Neurology',
    description: 'Expert care for neurological conditions affecting the brain, spinal cord, and nerves. Our neurologists provide thorough evaluation and treatment.',
    features: [
      'Headache and migraine treatment',
      'Stroke prevention and care',
      'Epilepsy management',
      'Movement disorders',
      'Memory and cognitive assessments',
    ],
    color: 'bg-primary',
  },
]

export default function ServicesPage() {
  return (
    <>
      <section className="gradient-hero text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Healthcare Services
            </h1>
            <p className="text-xl text-white/80">
              Comprehensive medical services delivered with compassion and expertise. 
              From primary care to specialized treatments, we've got you covered.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom">
          <div className="space-y-16">
            {services.map((service, index) => (
              <div
                key={service.id}
                id={service.id}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className={`w-16 h-16 rounded-xl ${service.color} flex items-center justify-center mb-6`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-text-primary mb-4">
                    {service.title}
                  </h2>
                  <p className="text-text-secondary mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-text-primary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/appointment">
                    <Button rightIcon={<ArrowRight className="w-5 h-5" />}>
                      Book Appointment
                    </Button>
                  </Link>
                </div>
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <Card className="p-0 overflow-hidden">
                    <div className={`h-64 ${service.color} opacity-10`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <service.icon className={`w-32 h-32 ${service.color.replace('bg-', 'text-')} opacity-20`} />
                    </div>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-muted">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Our Services?
            </h2>
            <p className="text-text-secondary">
              We combine expertise, technology, and compassion to deliver the best healthcare experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-8">
              <CardContent>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">50+</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Expert Doctors</h3>
                <p className="text-text-secondary text-sm">
                  Board-certified specialists with years of experience
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8">
              <CardContent>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-secondary">Modern</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Latest Technology</h3>
                <p className="text-text-secondary text-sm">
                  State-of-the-art equipment for accurate diagnosis
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8">
              <CardContent>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-accent">24/7</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Always Available</h3>
                <p className="text-text-secondary text-sm">
                  Emergency services available round the clock
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="section gradient-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Book an appointment with our specialists today and take the first step 
            towards better health.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/appointment">
              <Button variant="secondary" size="lg">
                Book Appointment
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
