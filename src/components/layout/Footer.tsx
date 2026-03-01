'use client'

import Link from 'next/link'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Heart
} from 'lucide-react'

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Our Doctors', href: '/doctors' },
  { name: 'Blog', href: '/blogs' },
  { name: 'Contact', href: '/contact' },
]

const services = [
  { name: 'General Consultation', href: '/services#general' },
  { name: 'Pediatrics', href: '/services#pediatrics' },
  { name: 'Gynecology', href: '/services#gynecology' },
  { name: 'Cardiology', href: '/services#cardiology' },
  { name: 'Orthopedics', href: '/services#orthopedics' },
  { name: 'Dermatology', href: '/services#dermatology' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <span className="text-primary font-bold text-xl">A</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white">AsterMed</span>
                <span className="text-sm text-white/70 ml-1">Healthcare</span>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              Providing premium healthcare services with a focus on patient comfort and well-being. 
              Your health is our priority.
            </p>
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link 
                    href={service.href}
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm">
                  Vinayaka Nagar, Hafeezpet,<br />
                  Hyderabad, Telangana 500049
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                <a 
                  href="tel:09381659308" 
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  093816 59308
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
                <a 
                  href="mailto:contact@astermedhealthcare.com" 
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  contact@astermedhealthcare.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div className="text-white/80 text-sm">
                  <p>Mon - Sat: 9:00 AM - 6:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-white/60 text-sm">
              © {currentYear} AsterMed Healthcare. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-white/60 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/60 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
            <p className="text-white/60 text-sm flex items-center">
              Made with <Heart className="w-4 h-4 mx-1 text-error" /> for better healthcare
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
