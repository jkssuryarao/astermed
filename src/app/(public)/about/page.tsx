import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Award, Users, Heart, Target, Eye, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about AsterMed Healthcare - our mission, vision, and commitment to providing premium healthcare services in Hyderabad.',
}

const values = [
  {
    icon: Heart,
    title: 'Patient-Centered Care',
    description: 'We put our patients first, ensuring personalized treatment plans and compassionate care for every individual.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We strive for excellence in everything we do, from medical care to patient experience.',
  },
  {
    icon: Users,
    title: 'Teamwork',
    description: 'Our multidisciplinary team works together to provide comprehensive healthcare solutions.',
  },
  {
    icon: Target,
    title: 'Innovation',
    description: 'We embrace the latest medical technologies and practices to deliver the best outcomes.',
  },
]

const milestones = [
  { year: '2010', title: 'Founded', description: 'AsterMed Healthcare was established in Hyderabad' },
  { year: '2013', title: 'Expansion', description: 'Added specialized departments and new facilities' },
  { year: '2017', title: 'Digital Transformation', description: 'Launched online appointment booking system' },
  { year: '2020', title: 'Recognition', description: 'Awarded Best Healthcare Provider in Telangana' },
  { year: '2023', title: '10,000+ Patients', description: 'Milestone of serving 10,000+ satisfied patients' },
]

export default function AboutPage() {
  return (
    <>
      <section className="gradient-hero text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About AsterMed Healthcare
            </h1>
            <p className="text-xl text-white/80">
              Dedicated to providing premium healthcare services with compassion, 
              excellence, and innovation since 2010.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                A Legacy of Compassionate Care
              </h2>
              <p className="text-text-secondary mb-6">
                AsterMed Healthcare was founded with a simple yet powerful vision: to make 
                quality healthcare accessible to everyone. What started as a small clinic 
                in Hafeezpet has grown into a trusted healthcare destination serving 
                thousands of patients each year.
              </p>
              <p className="text-text-secondary mb-6">
                Our team of experienced doctors, nurses, and healthcare professionals are 
                committed to providing personalized care that treats not just the ailment, 
                but the whole person. We believe that healthcare should be a partnership 
                between patients and providers.
              </p>
              <p className="text-text-secondary">
                Over the years, we have invested in state-of-the-art medical equipment, 
                continuous staff training, and facility upgrades to ensure that our 
                patients receive the best possible care.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-elevated">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop"
                  alt="AsterMed Healthcare facility"
                  className="w-full h-auto"
                />
              </div>
              <Card className="absolute -bottom-6 -left-6 max-w-xs">
                <CardContent className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">15+</span>
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">Years of Excellence</p>
                    <p className="text-sm text-text-muted">Serving the community</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-muted">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16">
            <Card className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Our Vision</h3>
              </div>
              <p className="text-text-secondary">
                To be the most trusted healthcare provider in Telangana, recognized for 
                our commitment to excellence, innovation, and patient-centered care. 
                We envision a community where quality healthcare is accessible to all, 
                where patients feel empowered to take control of their health journey.
              </p>
            </Card>
            
            <Card className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Our Mission</h3>
              </div>
              <p className="text-text-secondary">
                To deliver comprehensive, compassionate, and high-quality healthcare 
                services that improve the health and well-being of our patients. 
                We are committed to combining medical expertise with a personal touch, 
                ensuring every patient feels valued and cared for.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              What We Stand For
            </h2>
            <p className="text-text-secondary">
              Our core values guide everything we do, from patient care to community engagement.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="text-center p-6">
                <CardContent>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-text-secondary text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-muted">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Our Journey</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              Milestones & Achievements
            </h2>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20 hidden md:block" />
            
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <Card className="inline-block p-6">
                      <CardContent>
                        <span className="text-3xl font-bold text-primary">{milestone.year}</span>
                        <h3 className="text-lg font-semibold mt-2 mb-1">{milestone.title}</h3>
                        <p className="text-text-secondary text-sm">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="hidden md:flex w-12 h-12 rounded-full bg-primary text-white items-center justify-center font-bold z-10">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section gradient-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Our Care?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied patients who trust AsterMed Healthcare 
            for their medical needs. Book your appointment today.
          </p>
          <Link href="/appointment">
            <Button variant="secondary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Book an Appointment
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
