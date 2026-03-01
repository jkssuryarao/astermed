'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Modal from '@/components/ui/Modal'
import { formatDate } from '@/lib/utils'
import { Query } from '@/lib/types'

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
]

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

export default function AdminQueries() {
  const [queries, setQueries] = useState<Query[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null)
  const [response, setResponse] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchQueries = async () => {
    try {
      let url = '/api/queries?'
      if (statusFilter) url += `status=${statusFilter}&`
      
      const res = await fetch(url)
      const data = await res.json()
      
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
  }, [statusFilter])

  const handleRespond = async () => {
    if (!selectedQuery || !response.trim()) return
    
    setSubmitting(true)
    try {
      const res = await fetch(`/api/queries/${selectedQuery.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response: response.trim(),
          status: newStatus || 'resolved',
        }),
      })
      
      const data = await res.json()
      
      if (data.success) {
        fetchQueries()
        setSelectedQuery(null)
        setResponse('')
        setNewStatus('')
      }
    } catch (error) {
      console.error('Error responding to query:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const openQueryModal = (query: Query) => {
    setSelectedQuery(query)
    setResponse(query.response || '')
    setNewStatus(query.status)
  }

  const statusColors: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
    open: 'warning',
    in_progress: 'info',
    resolved: 'success',
    closed: 'secondary' as any,
  }

  const priorityColors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
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
          <h1 className="text-2xl font-bold text-text-primary">Support Queries</h1>
          <p className="text-text-secondary">Manage and respond to customer queries</p>
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
      ) : queries.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="w-16 h-16 mx-auto text-text-muted mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No Queries Found
            </h3>
            <p className="text-text-muted">
              {statusFilter
                ? 'Try adjusting your filters'
                : 'No support queries have been submitted yet'}
            </p>
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
                onClick={() => openQueryModal(query)}
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
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-text-primary">{query.subject}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[query.priority]}`}>
                            {query.priority}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary line-clamp-2 mb-2">{query.message}</p>
                        <div className="flex items-center gap-4 text-xs text-text-muted">
                          <span>{query.guestName || query.guestEmail || 'Registered User'}</span>
                          <span>{formatDate(query.createdAt)}</span>
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
        isOpen={!!selectedQuery}
        onClose={() => {
          setSelectedQuery(null)
          setResponse('')
          setNewStatus('')
        }}
        title="Query Details"
        size="lg"
      >
        {selectedQuery && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-text-muted">From</span>
                <p className="font-medium">{selectedQuery.guestName || selectedQuery.guestEmail || 'Registered User'}</p>
              </div>
              <div>
                <span className="text-sm text-text-muted">Email</span>
                <p className="font-medium">{selectedQuery.guestEmail || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm text-text-muted">Priority</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[selectedQuery.priority]}`}>
                  {selectedQuery.priority}
                </span>
              </div>
              <div>
                <span className="text-sm text-text-muted">Created</span>
                <p className="font-medium">{formatDate(selectedQuery.createdAt, 'PPp')}</p>
              </div>
            </div>

            <div>
              <span className="text-sm text-text-muted">Subject</span>
              <p className="font-semibold text-lg">{selectedQuery.subject}</p>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <span className="text-sm text-text-muted">Message</span>
              <p className="mt-2 whitespace-pre-wrap">{selectedQuery.message}</p>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">Response</h4>
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response here..."
                rows={4}
              />
              <div className="flex items-center gap-4 mt-4">
                <Select
                  options={[
                    { value: 'in_progress', label: 'In Progress' },
                    { value: 'resolved', label: 'Resolved' },
                    { value: 'closed', label: 'Closed' },
                  ]}
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-48"
                  placeholder="Set status..."
                />
                <Button
                  onClick={handleRespond}
                  loading={submitting}
                  disabled={!response.trim()}
                  className="ml-auto"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Response
                </Button>
              </div>
            </div>

            {selectedQuery.response && (
              <div className="bg-accent/10 rounded-lg p-4">
                <span className="text-sm text-accent-700">Previous Response by {selectedQuery.respondedBy}:</span>
                <p className="mt-2 whitespace-pre-wrap">{selectedQuery.response}</p>
                <p className="text-xs text-text-muted mt-2">
                  {formatDate(selectedQuery.respondedAt, 'PPp')}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
