'use client'

import Link from 'next/link'
import Logo from '@/components/brand/Logo'
import { BRAND } from '@/lib/brand'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { useSiteSettings } from './SettingsProvider'

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Our Doctors', href: '/doctors' },
  { name: 'Book Appointment', href: '/appointment' },
  { name: 'Book Lab Test', href: '/lab-tests' },
  { name: 'Activities', href: '/activities' },
  { name: 'Board Members', href: '/board-members' },
  { name: 'Blog', href: '/blogs' },
  { name: 'Contact Us', href: '/contact' },
]

export default function Footer() {
  const settings = useSiteSettings()
  const currentYear = new Date().getFullYear()
  const phoneHref = `tel:${settings.clinic_phone.replace(/\s/g, '')}`
  const mapUrl = settings.clinic_map_url || 'https://maps.google.com/?q=Hafeezpet+Hyderabad'
  const mapEmbed = settings.clinic_map_embed

  const socialLinks = [
    { icon: Facebook, url: settings.social_facebook, enabled: settings.facebook_enabled === 'true' },
    { icon: Instagram, url: settings.social_instagram, enabled: settings.instagram_enabled === 'true' },
    { icon: Youtube, url: settings.social_youtube, enabled: settings.youtube_enabled === 'true' },
    { icon: Linkedin, url: settings.social_linkedin, enabled: settings.linkedin_enabled === 'true' },
  ].filter((s) => s.enabled && s.url)

  return (
    <footer className="bg-primary text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="mb-6">
              <Logo variant="full" size="md" href="/" light />
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-4">{settings.clinic_address}</p>
            <div className="flex space-x-3">
              {socialLinks.map(({ icon: Icon, url }) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">QUICK LINKS</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/80 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">CONTACT US</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                <a href={phoneHref} className="text-white/80 hover:text-white text-sm">{settings.clinic_phone}</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
                <a href={`mailto:${settings.clinic_email}`} className="text-white/80 hover:text-white text-sm">{settings.clinic_email}</a>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div className="text-white/80 text-sm">
                  <p>Mon - Sat: {settings.working_hours_start} - {settings.working_hours_end}</p>
                  <p>Sunday: Closed</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">FIND US</h3>
            {mapEmbed ? (
              <div className="rounded-xl overflow-hidden mb-4 h-40">
                <iframe
                  src={mapEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Clinic location"
                />
              </div>
            ) : (
              <div className="rounded-xl bg-white/10 h-40 flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-white/40" />
              </div>
            )}
            <a href={mapUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm" fullWidth>
                Get Directions
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm">
              © {currentYear} {settings.copyright_text || `${BRAND.title}. All rights reserved.`}
            </p>
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-white/60 hover:text-white text-sm">Privacy Policy</Link>
              <Link href="/terms" className="text-white/60 hover:text-white text-sm">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
