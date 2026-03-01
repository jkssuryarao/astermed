'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, Filter, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Modal from '@/components/ui/Modal'
import { formatDate, formatTime, generateGoogleCalendarUrl } from '@/lib/utils'
import { Appointment } from '@/lib/types'

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const services: Record<string, string> = {
  general: 'General Consultation',
  pediatrics: 'Pediatrics',
  gynecology: 'Gynecology',
  cardiology: 'Cardiology',
  orthopedics: 'Orthopedics',
  dermatology: 'Dermatology',
  ent: 'ENT',
  ophthalmology: 'Ophthalmology',
}

export default function UserAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelling, setCancelling] = useState(false)

  const fetchAppointments = async () => {
    try {
      let url = '/api/appointments'
      if (statusFilter) {
        url += `?status=${statusFilter}`
      }
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        setAppointments(data.data)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [statusFilter])

  const handleCancel = async () => {
    if (!selectedAppointment || !cancelReason.trim()) return
    
    setCancelling(true)
    try {
      const response = await fetch(`/api/appointments/${selectedAppointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'cancelled',
          cancelReason: cancelReason.trim(),
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchAppointments()
        setShowCancelModal(false)
        setCancelReason('')
        setSelectedAppointment(null)
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error)
    } finally {
      setCancelling(false)
    }
  }

  const statusColors: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
    pending: 'warning',
    confirmed: 'success',
    cancelled: 'error',
    completed: 'info',
  }

  const upcomingAppointments = appointments.filter(
    apt => (apt.status === 'pending' || apt.status === 'confirmed') && 
           new Date(apt.date) >= new Date()
  )
  
  const pastAppointments = appointments.filter(
    apt => apt.status === 'completed' || apt.status === 'cancelled' ||
           new Date(apt.date) < new Date()
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">My Appointments</h1>
          <p className="text-text-secondary">View and manage your appointments</p>
        </div>
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-48"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="loader" />
        </div>
      ) : appointments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-text-muted mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No Appointments Found
            </h3>
            <p className="text-text-muted mb-4">
              You haven't booked any appointments yet.
            </p>
            <a href="/appointment">
              <Button>Book Your First Appointment</Button>
            </a>
          </CardContent>
        </Card>
      ) : (
        <>
          {upcomingAppointments.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-text-primary">Upcoming Appointments</h2>
              <div className="grid gap-4">
                {upcomingAppointments.map((apt) => (
                  <Card key={apt.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-xl bg-primary/10 flex flex-col items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {formatDate(apt.date, 'MMM')}
                            </span>
                            <span className="text-2xl font-bold text-primary">
                              {formatDate(apt.date, 'dd')}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-text-primary">
                                {services[apt.service] || apt.service}
                              </h3>
                              <Badge variant={statusColors[apt.status]} size="sm">
                                {apt.status}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatTime(apt.timeSlot)}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                Hafeezpet, Hyderabad
                              </span>
                            </div>
                            {apt.notes && (
                              <p className="text-sm text-text-muted mt-2">
                                Note: {apt.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <a
                            href={generateGoogleCalendarUrl(apt)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="sm">
                              <Calendar className="w-4 h-4 mr-1" />
                              Add to Calendar
                            </Button>
                          </a>
                          {apt.status !== 'cancelled' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedAppointment(apt)
                                setShowCancelModal(true)
                              }}
                              className="text-error hover:text-error hover:bg-error/5"
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {pastAppointments.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-text-primary">Past Appointments</h2>
              <div className="grid gap-4">
                {pastAppointments.map((apt) => (
                  <Card key={apt.id} className="bg-muted/50">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-xl bg-gray-200 flex flex-col items-center justify-center">
                            <span className="text-sm font-medium text-text-muted">
                              {formatDate(apt.date, 'MMM')}
                            </span>
                            <span className="text-2xl font-bold text-text-muted">
                              {formatDate(apt.date, 'dd')}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-text-primary">
                                {services[apt.service] || apt.service}
                              </h3>
                              <Badge variant={statusColors[apt.status]} size="sm">
                                {apt.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-text-secondary">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatTime(apt.timeSlot)}
                              </span>
                            </div>
                            {apt.cancelReason && (
                              <p className="text-sm text-error mt-2">
                                Cancelled: {apt.cancelReason}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {apt.status === 'completed' && (
                          <a href="/appointment">
                            <Button variant="outline" size="sm">
                              Book Again
                            </Button>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false)
          setCancelReason('')
        }}
        title="Cancel Appointment"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            Are you sure you want to cancel this appointment? Please provide a reason.
          </p>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Reason for cancellation..."
            className="input"
            rows={3}
          />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowCancelModal(false)}>
              Keep Appointment
            </Button>
            <Button
              variant="danger"
              onClick={handleCancel}
              loading={cancelling}
              disabled={!cancelReason.trim()}
            >
              Cancel Appointment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
