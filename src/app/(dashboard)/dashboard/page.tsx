'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Clock, FileText, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { formatDate, formatTime } from '@/lib/utils'
import { Appointment, Query } from '@/lib/types'

export default function UserDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [queries, setQueries] = useState<Query[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsRes, queriesRes] = await Promise.all([
          fetch('/api/appointments'),
          fetch('/api/queries'),
        ])
        
        const appointmentsData = await appointmentsRes.json()
        const queriesData = await queriesRes.json()
        
        if (appointmentsData.success) {
          setAppointments(appointmentsData.data.slice(0, 5))
        }
        if (queriesData.success) {
          setQueries(queriesData.data.slice(0, 5))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const upcomingAppointments = appointments.filter(
    apt => apt.status === 'pending' || apt.status === 'confirmed'
  )
  const openQueries = queries.filter(
    q => q.status === 'open' || q.status === 'in_progress'
  )

  const statusColors: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
    pending: 'warning',
    confirmed: 'success',
    cancelled: 'error',
    completed: 'info',
    open: 'warning',
    in_progress: 'info',
    resolved: 'success',
    closed: 'secondary' as any,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Welcome Back!</h1>
        <p className="text-text-secondary">Here's an overview of your healthcare activities.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{appointments.length}</p>
              <p className="text-sm text-text-muted">Total Appointments</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{upcomingAppointments.length}</p>
              <p className="text-sm text-text-muted">Upcoming</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{queries.length}</p>
              <p className="text-sm text-text-muted">Support Tickets</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-error" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{openQueries.length}</p>
              <p className="text-sm text-text-muted">Open Tickets</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Appointments</CardTitle>
            <Link href="/dashboard/appointments">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="loader" />
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto text-text-muted mb-3" />
                <p className="text-text-muted">No upcoming appointments</p>
                <Link href="/appointment" className="mt-4 inline-block">
                  <Button size="sm">Book Appointment</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {formatDate(apt.date, 'MMM')}
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {formatDate(apt.date, 'dd')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{apt.service}</p>
                        <p className="text-sm text-text-muted">
                          {formatTime(apt.timeSlot)}
                        </p>
                      </div>
                    </div>
                    <Badge variant={statusColors[apt.status]}>
                      {apt.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Tickets</CardTitle>
            <Link href="/dashboard/queries">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="loader" />
              </div>
            ) : queries.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 mx-auto text-text-muted mb-3" />
                <p className="text-text-muted">No support tickets yet</p>
                <Link href="/contact" className="mt-4 inline-block">
                  <Button size="sm" variant="outline">Raise a Ticket</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {queries.slice(0, 4).map((query) => (
                  <div
                    key={query.id}
                    className="flex items-start justify-between p-4 bg-muted rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-text-primary line-clamp-1">
                        {query.subject}
                      </p>
                      <p className="text-sm text-text-muted">
                        {formatDate(query.createdAt)}
                      </p>
                    </div>
                    <Badge variant={statusColors[query.status]} size="sm">
                      {query.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-primary to-secondary text-white">
        <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
          <div>
            <h3 className="text-xl font-semibold mb-1">Need to see a doctor?</h3>
            <p className="text-white/80">Book an appointment with our specialists today.</p>
          </div>
          <Link href="/appointment">
            <Button variant="secondary">
              Book Appointment <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
