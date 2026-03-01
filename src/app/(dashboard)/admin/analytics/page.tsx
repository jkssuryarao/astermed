'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, Calendar, Eye, Bot } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import { DashboardStats, AnalyticsSummary } from '@/lib/types'

const periodOptions = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
]

export default function AdminAnalytics() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, summaryRes] = await Promise.all([
          fetch('/api/analytics?type=stats'),
          fetch(`/api/analytics?type=summary&days=${period}`),
        ])
        
        const statsData = await statsRes.json()
        const summaryData = await summaryRes.json()
        
        if (statsData.success) setStats(statsData.data)
        if (summaryData.success) setSummary(summaryData.data)
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [period])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="loader" />
      </div>
    )
  }

  const statCards = [
    { title: 'Total Page Views', value: stats?.pageViews || 0, icon: Eye, color: 'bg-primary' },
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'bg-secondary' },
    { title: 'Total Appointments', value: stats?.totalAppointments || 0, icon: Calendar, color: 'bg-accent' },
    { title: 'Chatbot Interactions', value: stats?.chatbotInteractions || 0, icon: Bot, color: 'bg-warning' },
  ]

  const maxPageViews = Math.max(...(summary?.pageViews.map(d => d.count) || [1]))
  const maxAppointments = Math.max(...(summary?.appointments.map(d => d.count) || [1]))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Analytics Dashboard</h1>
          <p className="text-text-secondary">Track website performance and user engagement</p>
        </div>
        <Select
          options={periodOptions}
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="w-48"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{stat.value.toLocaleString()}</p>
                <p className="text-sm text-text-muted">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-1">
              {summary?.pageViews.slice(-14).map((day, index) => (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-primary/20 hover:bg-primary/40 transition-colors rounded-t"
                    style={{ height: `${(day.count / maxPageViews) * 100}%`, minHeight: day.count > 0 ? '8px' : '0' }}
                  />
                  {index % 2 === 0 && (
                    <span className="text-xs text-text-muted mt-2 rotate-45 origin-left">
                      {day.date.slice(5)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-1">
              {summary?.appointments.slice(-14).map((day, index) => (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-secondary/20 hover:bg-secondary/40 transition-colors rounded-t"
                    style={{ height: `${(day.count / maxAppointments) * 100}%`, minHeight: day.count > 0 ? '8px' : '0' }}
                  />
                  {index % 2 === 0 && (
                    <span className="text-xs text-text-muted mt-2 rotate-45 origin-left">
                      {day.date.slice(5)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            {summary?.topPages && summary.topPages.length > 0 ? (
              <div className="space-y-4">
                {summary.topPages.map((page, index) => (
                  <div key={page.page} className="flex items-center gap-4">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-text-primary truncate">{page.page || '/'}</p>
                      <div className="w-full h-2 bg-muted rounded-full mt-1">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(page.views / (summary.topPages[0]?.views || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-text-muted">{page.views}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-text-muted py-8">No page view data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-1">
              {summary?.userSignups.slice(-14).map((day, index) => (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-accent/20 hover:bg-accent/40 transition-colors rounded-t"
                    style={{ 
                      height: `${(day.count / Math.max(...(summary?.userSignups.map(d => d.count) || [1]))) * 100}%`,
                      minHeight: day.count > 0 ? '8px' : '0'
                    }}
                  />
                  {index % 2 === 0 && (
                    <span className="text-xs text-text-muted mt-2 rotate-45 origin-left">
                      {day.date.slice(5)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
