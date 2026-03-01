'use client'

import { useState, useEffect, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Settings, 
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  Users,
  BarChart3,
  FileEdit,
  Cog,
  Image,
  Instagram,
  Bot
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: ReactNode
}

interface UserData {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'user'
}

const userNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Appointments', href: '/dashboard/appointments', icon: Calendar },
  { name: 'Support Tickets', href: '/dashboard/queries', icon: MessageSquare },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
]

const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
  { name: 'Blogs', href: '/admin/blogs', icon: FileText },
  { name: 'Queries', href: '/admin/queries', icon: MessageSquare },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'CMS', href: '/admin/cms', icon: FileEdit },
  { name: 'Chatbot', href: '/admin/chatbot', icon: Bot },
  { name: 'Settings', href: '/admin/settings', icon: Cog },
]

const editorNavigation = [
  { name: 'Dashboard', href: '/editor', icon: LayoutDashboard },
  { name: 'Blogs', href: '/editor/blogs', icon: FileText },
  { name: 'Queries', href: '/editor/queries', icon: MessageSquare },
  { name: 'Analytics', href: '/editor/analytics', icon: BarChart3 },
  { name: 'CMS', href: '/editor/cms', icon: FileEdit },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setUser(data.data.user)
          } else {
            router.push('/login')
          }
        } else {
          router.push('/login')
        }
      } catch (error) {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="loader" />
      </div>
    )
  }

  if (!user) return null

  const isAdmin = pathname.startsWith('/admin')
  const isEditor = pathname.startsWith('/editor')
  
  const navigation = isAdmin 
    ? adminNavigation 
    : isEditor 
    ? editorNavigation 
    : userNavigation

  const basePath = isAdmin ? '/admin' : isEditor ? '/editor' : '/dashboard'

  return (
    <div className="min-h-screen bg-muted">
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity',
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-bold text-primary">AsterMed</span>
          </Link>
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== basePath && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-muted hover:text-text-primary'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-error/5 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-muted"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold text-text-primary">
                {isAdmin ? 'Admin Panel' : isEditor ? 'Editor Panel' : 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-muted relative">
                <Bell className="w-5 h-5 text-text-secondary" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
              </button>
              
              <div className="flex items-center gap-3 pl-3 border-l">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-sm font-medium">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-text-primary">{user.name}</p>
                  <p className="text-xs text-text-muted capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
