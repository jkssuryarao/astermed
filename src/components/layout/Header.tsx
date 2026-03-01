'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

interface HeaderProps {
  user?: {
    name: string
    email: string
    role: string
  } | null
}

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Doctors', href: '/doctors' },
  { name: 'Blogs', href: '/blogs' },
  { name: 'Contact', href: '/contact' },
]

export default function Header({ user }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
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
        isScrolled ? 'bg-white shadow-soft py-2' : 'bg-white/95 backdrop-blur-sm py-4'
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <span className="text-xl font-bold text-primary">AsterMed</span>
              <span className="hidden sm:inline text-sm text-text-secondary ml-1">Healthcare</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'text-primary bg-primary/5'
                    : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="tel:09381659308"
              className="flex items-center text-sm text-text-secondary hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4 mr-2" />
              093816 59308
            </a>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-text-primary">{user.name}</span>
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-elevated py-2 animate-slide-down">
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-text-primary hover:bg-muted"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                    {(user.role === 'admin' || user.role === 'editor') && (
                      <Link
                        href={user.role === 'admin' ? '/admin' : '/editor'}
                        className="flex items-center px-4 py-2 text-sm text-text-primary hover:bg-muted"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        {user.role === 'admin' ? 'Admin Panel' : 'Editor Panel'}
                      </Link>
                    )}
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-error/5"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/appointment">
                  <Button size="sm">Book Appointment</Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 animate-slide-down">
            <nav className="flex flex-col space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-4 py-3 rounded-lg text-base font-medium transition-colors',
                    pathname === item.href
                      ? 'text-primary bg-primary/5'
                      : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              <a
                href="tel:09381659308"
                className="flex items-center px-4 py-2 text-text-secondary"
              >
                <Phone className="w-5 h-5 mr-3" />
                093816 59308
              </a>
              
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" fullWidth>Dashboard</Button>
                  </Link>
                  <Button variant="ghost" fullWidth onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" fullWidth>Login</Button>
                  </Link>
                  <Link href="/appointment" onClick={() => setIsOpen(false)}>
                    <Button fullWidth>Book Appointment</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
