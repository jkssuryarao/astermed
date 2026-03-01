'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, MessageSquare, BarChart3, ArrowRight, Edit } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { DashboardStats } from '@/lib/types'

export default function EditorDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/analytics?type=stats')
        const data = await response.json()
        
        if (data.success) {
          setStats(data.data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Published Blogs',
      value: stats?.totalBlogs || 0,
      icon: FileText,
      color: 'bg-primary',
      href: '/editor/blogs',
    },
    {
      title: 'Open Queries',
      value: stats?.openQueries || 0,
      icon: MessageSquare,
      color: 'bg-secondary',
      href: '/editor/queries',
    },
    {
      title: 'Page Views',
      value: stats?.pageViews || 0,
      icon: BarChart3,
      color: 'bg-accent',
      href: '/editor/analytics',
    },
  ]

  const quickActions = [
    { title: 'Create Blog', description: 'Write a new blog post', href: '/editor/blogs', icon: FileText },
    { title: 'Respond to Queries', description: 'Answer customer questions', href: '/editor/queries', icon: MessageSquare },
    { title: 'Edit Content', description: 'Update website content', href: '/editor/cms', icon: Edit },
    { title: 'View Analytics', description: 'See website performance', href: '/editor/analytics', icon: BarChart3 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Editor Dashboard</h1>
        <p className="text-text-secondary">Manage content and respond to queries</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="loader" />
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-4">
            {statCards.map((stat) => (
              <Link key={stat.title} href={stat.href}>
                <Card hover className="h-full">
                  <CardContent className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                      <p className="text-sm text-text-muted">{stat.title}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <Card hover className="h-full">
                    <CardContent className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <action.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-text-primary mb-1">{action.title}</h3>
                        <p className="text-sm text-text-muted">{action.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-text-muted" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
