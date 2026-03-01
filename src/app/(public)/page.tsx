import Link from 'next/link'
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Shield, 
  Heart, 
  Award,
  Users,
  Star,
  CheckCircle
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

const services = [
  {
    title: 'General Consultation',
    description: 'Comprehensive health check-ups and primary care services for all ages.',
    icon: Heart,
    color: 'bg-primary',
  },
  {
    title: 'Pediatrics',
    description: 'Specialized care for infants, children, and adolescents.',
    icon: Users,
    color: 'bg-secondary',
  },
  {
    title: 'Gynecology',
    description: "Expert women's health services and prenatal care.",
    icon: Shield,
    color: 'bg-accent',
  },
  {
    title: 'Cardiology',
    description: 'Advanced heart care with modern diagnostic facilities.',
    icon: Heart,
    color: 'bg-error',
  },
  {
    title: 'Orthopedics',
    description: 'Bone, joint, and muscle care from expert specialists.',
    icon: Award,
    color: 'bg-primary',
  },
  {
    title: 'Dermatology',
    description: 'Skin care treatments and cosmetic procedures.',
    icon: Star,
    color: 'bg-secondary',
  },
]

const stats = [
  { value: '15+', label: 'Years Experience' },
  { value: '50+', label: 'Expert Doctors' },
  { value: '10K+', label: 'Happy Patients' },
  { value: '24/7', label: 'Emergency Care' },
]

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Patient',
    content: 'Excellent care and friendly staff. The doctors took the time to explain everything thoroughly. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Rajesh Kumar',
    role: 'Patient',
    content: 'Very professional service. The online booking system is convenient and the clinic is well-maintained.',
    rating: 5,
  },
  {
    name: 'Anita Reddy',
    role: 'Patient',
    content: 'The pediatric care for my children has been exceptional. The staff is caring and the facilities are modern.',
    rating: 5,
  },
]

export default function HomePage() {
  return (
    <>
      <section className="relative gradient-hero min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        
        <div className="container-custom relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white animate-fade-in">
              <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                Premium Healthcare Services
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Your Health is Our
                <span className="text-secondary"> Priority</span>
              </h1>
              <p className="text-lg text-white/80 mb-8 max-w-xl">
                Experience world-class healthcare with our team of expert doctors. 
                We provide comprehensive medical services with a focus on patient comfort and well-being.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/appointment">
                  <Button size="lg" variant="secondary" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Book Appointment
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                    Our Services
                  </Button>
                </Link>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 mt-10 pt-10 border-t border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Emergency Line</p>
                    <p className="font-semibold">093816 59308</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Working Hours</p>
                    <p className="font-semibold">Mon-Sat: 9AM - 6PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20" />
                <img
                  src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=500&fit=crop"
                  alt="Healthcare professionals"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <Card className="absolute -bottom-6 -left-6 p-4 animate-slide-up shadow-elevated">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">10,000+</p>
                    <p className="text-text-muted text-sm">Satisfied Patients</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Our Services</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              Comprehensive Healthcare Services
            </h2>
            <p className="text-text-secondary">
              We offer a wide range of medical services to meet all your healthcare needs under one roof.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={service.title} hover className="group">
                <CardContent>
                  <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {service.title}
                  </h3>
                  <p className="text-text-secondary mb-4">
                    {service.description}
                  </p>
                  <Link 
                    href={`/services#${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center text-primary font-medium hover:text-primary-600 transition-colors"
                  >
                    Learn more <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/services">
              <Button variant="outline" size="lg">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-muted">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                Excellence in Healthcare Since 2010
              </h2>
              <p className="text-text-secondary mb-8">
                At AsterMed Healthcare, we combine cutting-edge medical technology with compassionate care. 
                Our team of experienced doctors and healthcare professionals are committed to providing 
                the highest quality medical services to our patients.
              </p>
              
              <div className="space-y-4">
                {[
                  'State-of-the-art medical facilities and equipment',
                  'Experienced and certified medical professionals',
                  'Personalized treatment plans for every patient',
                  'Convenient online appointment booking system',
                  'Affordable healthcare packages',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-text-primary">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Link href="/about">
                  <Button rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Learn More About Us
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <Card key={stat.label} className={index % 2 === 1 ? 'mt-8' : ''}>
                    <CardContent className="text-center">
                      <p className="text-4xl font-bold text-primary mb-1">{stat.value}</p>
                      <p className="text-text-muted text-sm">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-text-secondary">
              Read what our patients have to say about their experience at AsterMed Healthcare.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="relative">
                <CardContent>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-warning fill-warning" />
                    ))}
                  </div>
                  <p className="text-text-secondary mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">{testimonial.name}</p>
                      <p className="text-sm text-text-muted">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section gradient-primary text-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Experience Premium Healthcare?
              </h2>
              <p className="text-white/80 mb-8">
                Book your appointment today and take the first step towards better health. 
                Our team is ready to provide you with the best medical care.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/appointment">
                  <Button variant="secondary" size="lg">
                    Book Appointment Now
                  </Button>
                </Link>
                <a href="tel:09381659308">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                    <Phone className="w-5 h-5 mr-2" />
                    Call Us
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-white/70">
                      Vinayaka Nagar, Hafeezpet,<br />
                      Hyderabad, Telangana 500049
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-white/70">093816 59308</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Working Hours</p>
                    <p className="text-white/70">
                      Mon - Sat: 9:00 AM - 6:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
