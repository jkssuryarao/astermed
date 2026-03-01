'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Modal from '@/components/ui/Modal'
import { formatDate } from '@/lib/utils'
import { Query } from '@/lib/types'

export default function UserQueries() {
  const [queries, setQueries] = useState<Query[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewModal, setShowNewModal] = useState(false)
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null)
  const [newQuery, setNewQuery] = useState({ subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const fetchQueries = async () => {
    try {
      const response = await fetch('/api/queries')
      const data = await response.json()
      
      if (data.success) {
        setQueries(data.data)
      }
    } catch (error) {
      console.error('Error fetching queries:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQueries()
  }, [])

  const handleSubmit = async () => {
    if (!newQuery.subject.trim() || !newQuery.message.trim()) return
    
    setSubmitting(true)
    try {
      const response = await fetch('/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuery),
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchQueries()
        setShowNewModal(false)
        setNewQuery({ subject: '', message: '' })
      }
    } catch (error) {
      console.error('Error creating query:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const statusColors: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
    open: 'warning',
    in_progress: 'info',
    resolved: 'success',
    closed: 'secondary' as any,
  }

  const statusIcons: Record<string, any> = {
    open: AlertCircle,
    in_progress: Clock,
    resolved: CheckCircle,
    closed: CheckCircle,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Support Tickets</h1>
          <p className="text-text-secondary">View and manage your support queries</p>
        </div>
        <Button onClick={() => setShowNewModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="loader" />
        </div>
      ) : queries.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="w-16 h-16 mx-auto text-text-muted mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No Support Tickets
            </h3>
            <p className="text-text-muted mb-4">
              You haven't raised any support tickets yet.
            </p>
            <Button onClick={() => setShowNewModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Ticket
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {queries.map((query) => {
            const StatusIcon = statusIcons[query.status]
            
            return (
              <Card
                key={query.id}
                hover
                className="cursor-pointer"
                onClick={() => setSelectedQuery(query)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        query.status === 'open' ? 'bg-warning/10' :
                        query.status === 'in_progress' ? 'bg-blue-100' :
                        'bg-accent/10'
                      }`}>
                        <StatusIcon className={`w-5 h-5 ${
                          query.status === 'open' ? 'text-warning' :
                          query.status === 'in_progress' ? 'text-blue-600' :
                          'text-accent'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary mb-1">
                          {query.subject}
                        </h3>
                        <p className="text-sm text-text-secondary line-clamp-2 mb-2">
                          {query.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-text-muted">
                          <span>Created: {formatDate(query.createdAt)}</span>
                          {query.respondedAt && (
                            <span>Responded: {formatDate(query.respondedAt)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge variant={statusColors[query.status]}>
                      {query.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Modal
        isOpen={showNewModal}
        onClose={() => {
          setShowNewModal(false)
          setNewQuery({ subject: '', message: '' })
        }}
        title="Create New Support Ticket"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Subject"
            placeholder="Brief description of your issue"
            value={newQuery.subject}
            onChange={(e) => setNewQuery({ ...newQuery, subject: e.target.value })}
            required
          />
          <Textarea
            label="Message"
            placeholder="Describe your issue in detail..."
            value={newQuery.message}
            onChange={(e) => setNewQuery({ ...newQuery, message: e.target.value })}
            rows={5}
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowNewModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              loading={submitting}
              disabled={!newQuery.subject.trim() || !newQuery.message.trim()}
            >
              Submit Ticket
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!selectedQuery}
        onClose={() => setSelectedQuery(null)}
        title="Ticket Details"
        size="lg"
      >
        {selectedQuery && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{selectedQuery.subject}</h3>
                <Badge variant={statusColors[selectedQuery.status]}>
                  {selectedQuery.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-text-muted mb-2">Your Message:</p>
                <p className="text-text-primary whitespace-pre-wrap">
                  {selectedQuery.message}
                </p>
              </div>
              <p className="text-xs text-text-muted mt-2">
                Submitted on {formatDate(selectedQuery.createdAt, 'PPp')}
              </p>
            </div>

            {selectedQuery.response && (
              <div>
                <div className="bg-accent/10 rounded-lg p-4">
                  <p className="text-sm text-accent-700 mb-2">Response from {selectedQuery.respondedBy}:</p>
                  <p className="text-text-primary whitespace-pre-wrap">
                    {selectedQuery.response}
                  </p>
                </div>
                <p className="text-xs text-text-muted mt-2">
                  Responded on {formatDate(selectedQuery.respondedAt, 'PPp')}
                </p>
              </div>
            )}

            {!selectedQuery.response && selectedQuery.status === 'open' && (
              <div className="bg-warning/10 rounded-lg p-4 text-center">
                <Clock className="w-8 h-8 mx-auto text-warning mb-2" />
                <p className="text-sm text-text-secondary">
                  Your ticket is being reviewed. We'll respond within 24-48 hours.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
