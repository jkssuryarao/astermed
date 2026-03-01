'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Search, Filter, Download, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Modal from '@/components/ui/Modal'
import { formatDate, formatTime } from '@/lib/utils'
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

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [updating, setUpdating] = useState(false)

  const fetchAppointments = async () => {
    try {
      let url = '/api/appointments?'
      if (statusFilter) url += `status=${statusFilter}&`
      if (dateFilter) url += `date=${dateFilter}&`
      
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
  }, [statusFilter, dateFilter])

  const handleUpdateStatus = async (appointment: Appointment, newStatus: string) => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchAppointments()
        setSelectedAppointment(null)
      }
    } catch (error) {
      console.error('Error updating appointment:', error)
    } finally {
      setUpdating(false)
    }
  }

  const exportToCSV = () => {
    const headers = ['ID', 'Patient', 'Email', 'Mobile', 'Date', 'Time', 'Service', 'Status', 'Created']
    const rows = appointments.map(apt => [
      apt.id,
      apt.guestName || apt.userId,
      apt.guestEmail,
      apt.guestMobile,
      apt.date,
      apt.timeSlot,
      services[apt.service] || apt.service,
      apt.status,
      apt.createdAt,
    ])
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `appointments-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const statusColors: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
    pending: 'warning',
    confirmed: 'success',
    cancelled: 'error',
    completed: 'info',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Appointments</h1>
          <p className="text-text-secondary">Manage all clinic appointments</p>
        </div>
        <Button variant="outline" onClick={exportToCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input w-48"
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-48"
            />
          </div>
        </CardContent>
      </Card>

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
            <p className="text-text-muted">
              {statusFilter || dateFilter
                ? 'Try adjusting your filters'
                : 'No appointments have been booked yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-3 px-4 font-medium text-text-muted">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Date & Time</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Service</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Status</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-text-primary">{apt.guestName || 'Registered User'}</p>
                      <p className="text-sm text-text-muted">{apt.guestEmail || apt.guestMobile}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-text-primary">{formatDate(apt.date)}</p>
                    <p className="text-sm text-text-muted">{formatTime(apt.timeSlot)}</p>
                  </td>
                  <td className="py-3 px-4">
                    {services[apt.service] || apt.service}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={statusColors[apt.status]}>
                      {apt.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAppointment(apt)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        title="Appointment Details"
        size="lg"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-text-muted">Patient Name</span>
                <p className="font-medium">{selectedAppointment.guestName || 'Registered User'}</p>
              </div>
              <div>
                <span className="text-sm text-text-muted">Contact</span>
                <p className="font-medium">{selectedAppointment.guestEmail || selectedAppointment.guestMobile}</p>
              </div>
              <div>
                <span className="text-sm text-text-muted">Date</span>
                <p className="font-medium">{formatDate(selectedAppointment.date)}</p>
              </div>
              <div>
                <span className="text-sm text-text-muted">Time</span>
                <p className="font-medium">{formatTime(selectedAppointment.timeSlot)}</p>
              </div>
              <div>
                <span className="text-sm text-text-muted">Service</span>
                <p className="font-medium">{services[selectedAppointment.service] || selectedAppointment.service}</p>
              </div>
              <div>
                <span className="text-sm text-text-muted">Status</span>
                <Badge variant={statusColors[selectedAppointment.status]}>
                  {selectedAppointment.status}
                </Badge>
              </div>
            </div>

            {selectedAppointment.notes && (
              <div>
                <span className="text-sm text-text-muted">Notes</span>
                <p className="mt-1 p-3 bg-muted rounded-lg">{selectedAppointment.notes}</p>
              </div>
            )}

            {selectedAppointment.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => handleUpdateStatus(selectedAppointment, 'confirmed')}
                  loading={updating}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleUpdateStatus(selectedAppointment, 'cancelled')}
                  loading={updating}
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}

            {selectedAppointment.status === 'confirmed' && (
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => handleUpdateStatus(selectedAppointment, 'completed')}
                  loading={updating}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
