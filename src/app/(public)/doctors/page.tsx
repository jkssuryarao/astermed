import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Award, GraduationCap, Clock } from 'lucide-react'
import Button from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export const metadata: Metadata = {
  title: 'Our Doctors',
  description: 'Meet our team of experienced and certified healthcare professionals at AsterMed Healthcare.',
}

const doctors = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    specialty: 'General Physician',
    qualifications: 'MBBS, MD (General Medicine)',
    experience: '15+ years',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop',
    bio: 'Dr. Rajesh Kumar is a highly experienced general physician with expertise in diagnosing and treating a wide range of medical conditions.',
    available: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  },
  {
    id: '2',
    name: 'Dr. Priya Sharma',
    specialty: 'Pediatrician',
    qualifications: 'MBBS, MD (Pediatrics)',
    experience: '12+ years',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop',
    bio: 'Dr. Priya Sharma specializes in child healthcare, from newborn care to adolescent medicine.',
    available: ['Mon', 'Wed', 'Fri', 'Sat'],
  },
  {
    id: '3',
    name: 'Dr. Anita Reddy',
    specialty: 'Gynecologist',
    qualifications: 'MBBS, MS (Obstetrics & Gynecology)',
    experience: '18+ years',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop',
    bio: "Dr. Anita Reddy is an expert in women's health, providing comprehensive care for all stages of a woman's life.",
    available: ['Tue', 'Thu', 'Sat'],
  },
  {
    id: '4',
    name: 'Dr. Vikram Singh',
    specialty: 'Cardiologist',
    qualifications: 'MBBS, DM (Cardiology)',
    experience: '20+ years',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop',
    bio: 'Dr. Vikram Singh is a renowned cardiologist with expertise in both preventive and interventional cardiology.',
    available: ['Mon', 'Wed', 'Fri'],
  },
  {
    id: '5',
    name: 'Dr. Suresh Patel',
    specialty: 'Orthopedic Surgeon',
    qualifications: 'MBBS, MS (Orthopedics)',
    experience: '14+ years',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop',
    bio: 'Dr. Suresh Patel specializes in treating bone and joint conditions, from sports injuries to degenerative diseases.',
    available: ['Mon', 'Tue', 'Thu', 'Sat'],
  },
  {
    id: '6',
    name: 'Dr. Meera Krishnan',
    specialty: 'Dermatologist',
    qualifications: 'MBBS, MD (Dermatology)',
    experience: '10+ years',
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=300&h=300&fit=crop',
    bio: 'Dr. Meera Krishnan provides expert care for all skin, hair, and nail conditions with a focus on both medical and cosmetic dermatology.',
    available: ['Tue', 'Wed', 'Thu', 'Sat'],
  },
]

export default function DoctorsPage() {
  return (
    <>
      <section className="gradient-hero text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Expert Doctors
            </h1>
            <p className="text-xl text-white/80">
              Meet our team of experienced and certified healthcare professionals 
              dedicated to providing you with the best medical care.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <Card key={doctor.id} hover className="overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-primary/10 to-secondary/10 relative">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <Badge variant="secondary" size="sm" className="mb-3">
                    {doctor.specialty}
                  </Badge>
                  <h3 className="text-xl font-semibold text-text-primary mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-sm text-text-muted mb-3">
                    {doctor.qualifications}
                  </p>
                  <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                    {doctor.bio}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm mb-4">
                    <span className="flex items-center gap-1 text-primary">
                      <Award className="w-4 h-4" />
                      {doctor.experience}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-text-muted" />
                    <span className="text-xs text-text-muted">Available:</span>
                    <div className="flex gap-1">
                      {doctor.available.map(day => (
                        <span key={day} className="text-xs bg-accent/10 text-accent-700 px-2 py-0.5 rounded">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Link href="/appointment">
                    <Button fullWidth variant="outline" size="sm">
                      Book Appointment
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-muted">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose Our Doctors?
              </h2>
              <p className="text-text-secondary mb-8">
                Our medical team consists of highly qualified professionals who are 
                committed to providing exceptional patient care. Each doctor brings 
                years of experience and specialized expertise to ensure you receive 
                the best treatment.
              </p>
              
              <div className="space-y-4">
                {[
                  'Board-certified specialists in their respective fields',
                  'Continuous medical education and training',
                  'Patient-centered approach to healthcare',
                  'Access to latest medical technologies',
                  'Collaborative care across specialties',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-text-primary">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">50+ Years</h3>
              <p className="text-text-secondary mb-6">
                Combined experience of our medical team
              </p>
              <Link href="/appointment">
                <Button rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Book a Consultation
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
