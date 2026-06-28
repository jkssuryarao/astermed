'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Logo from '@/components/brand/Logo'
import { useSiteSettings } from './SettingsProvider'

interface HeaderProps {
  user?: {
    name: string
    email: string
    role: string
  } | null
}

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  {
    name: 'Services',
    href: '/services',
    children: [
      { name: 'Clinic', href: '/services#clinic' },
      { name: 'Laboratory', href: '/services#laboratory' },
      { name: 'Vaccines', href: '/services#vaccines' },
      { name: 'All Specialties', href: '/services#specialties' },
    ],
  },
  { name: 'Our Doctors', href: '/doctors' },
  { name: 'Book Appointment', href: '/appointment' },
  { name: 'Book Lab Test', href: '/lab-tests' },
  { name: 'Activities', href: '/activities' },
  { name: 'Board Members', href: '/board-members' },
  { name: 'Contact Us', href: '/contact' },
]

export default function Header({ user }: HeaderProps) {
  const settings = useSiteSettings()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const pathname = usePathname()
  const phone = settings.clinic_phone
  const phoneHref = `tel:${phone.replace(/\s/g, '')}`

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white shadow-soft py-2' : 'bg-white/95 backdrop-blur-sm py-3'
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between gap-4">
          <Logo variant="full" size="md" href="/" />

          <nav className="hidden xl:flex items-center flex-wrap gap-0.5">
            {navigation.map((item) =>
              item.children ? (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1',
                      pathname.startsWith('/services')
                        ? 'text-primary bg-primary/5'
                        : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                    )}
                  >
                    {item.name}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </Link>
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-elevated py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-text-secondary hover:text-primary hover:bg-muted"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                    pathname === item.href
                      ? 'text-primary bg-primary/5'
                      : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                  )}
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>

          <div className="hidden xl:flex items-center space-x-3 flex-shrink-0">
            <a
              href={phoneHref}
              className="flex items-center text-sm text-text-secondary hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4 mr-1.5" />
              {phone}
            </a>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-elevated py-2 animate-slide-down">
                    <Link href="/dashboard" className="flex items-center px-4 py-2 text-sm hover:bg-muted" onClick={() => setShowUserMenu(false)}>
                      <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                    </Link>
                    {(user.role === 'admin' || user.role === 'editor') && (
                      <Link href={user.role === 'admin' ? '/admin' : '/editor'} className="flex items-center px-4 py-2 text-sm hover:bg-muted" onClick={() => setShowUserMenu(false)}>
                        <LayoutDashboard className="w-4 h-4 mr-2" /> {user.role === 'admin' ? 'Admin' : 'Editor'}
                      </Link>
                    )}
                    <hr className="my-2 border-gray-100" />
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-error/5">
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/appointment">
                <Button size="sm" variant="secondary">Book Appointment</Button>
              </Link>
            )}
          </div>

          <button className="xl:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="xl:hidden mt-4 pb-4 animate-slide-down max-h-[70vh] overflow-y-auto">
            <nav className="flex flex-col space-y-1">
              {navigation.map((item) =>
                item.children ? (
                  <div key={item.name}>
                    <button
                      onClick={() => setServicesOpen(!servicesOpen)}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-base font-medium text-text-secondary"
                    >
                      {item.name}
                      <ChevronDown className={cn('w-4 h-4 transition-transform', servicesOpen && 'rotate-180')} />
                    </button>
                    {servicesOpen && (
                      <div className="pl-4 space-y-1">
                        {item.children.map((child) => (
                          <Link key={child.name} href={child.href} className="block px-4 py-2 text-sm text-text-secondary hover:text-primary" onClick={() => setIsOpen(false)}>
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn('px-4 py-3 rounded-lg text-base font-medium', pathname === item.href ? 'text-primary bg-primary/5' : 'text-text-secondary')}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </nav>
            <div className="mt-4 pt-4 border-t space-y-3">
              <a href={phoneHref} className="flex items-center px-4 py-2 text-text-secondary">
                <Phone className="w-5 h-5 mr-3" /> {phone}
              </a>
              {!user && (
                <Link href="/appointment" onClick={() => setIsOpen(false)}>
                  <Button fullWidth variant="secondary">Book Appointment</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
