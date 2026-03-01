'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Search, Edit, Ban, CheckCircle, User as UserIcon, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Modal from '@/components/ui/Modal'
import { userCreateSchema } from '@/lib/validation'
import { formatDate } from '@/lib/utils'
import { z } from 'zod'

type UserForm = z.infer<typeof userCreateSchema>

interface User {
  id: string
  email: string
  mobile: string
  name: string
  role: 'admin' | 'editor' | 'user'
  status: 'active' | 'disabled' | 'pending'
  createdAt: string
  lastLogin: string
}

const roleOptions = [
  { value: '', label: 'All Roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'user', label: 'User' },
]

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'disabled', label: 'Disabled' },
]

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<UserForm>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      role: 'user',
    },
  })

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleCreateUser = async (data: UserForm) => {
    setSubmitting(true)
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (result.success) {
        fetchUsers()
        setShowCreateModal(false)
        form.reset()
      } else {
        alert(result.error)
      }
    } catch (error) {
      console.error('Error creating user:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateUser = async (data: Partial<User>) => {
    if (!selectedUser) return
    
    setSubmitting(true)
    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (result.success) {
        fetchUsers()
        setShowEditModal(false)
        setSelectedUser(null)
      } else {
        alert(result.error)
      }
    } catch (error) {
      console.error('Error updating user:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleUserStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'disabled' : 'active'
    await handleUpdateUser({ status: newStatus } as any)
  }

  const filteredUsers = users.filter(user => {
    if (roleFilter && user.role !== roleFilter) return false
    if (statusFilter && user.status !== statusFilter) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return user.name.toLowerCase().includes(query) || 
             user.email.toLowerCase().includes(query)
    }
    return true
  })

  const roleColors: Record<string, 'primary' | 'secondary' | 'info'> = {
    admin: 'primary',
    editor: 'secondary',
    user: 'info',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">User Management</h1>
          <p className="text-text-secondary">Manage all user accounts</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
            <Select
              options={roleOptions}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-40"
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-40"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="loader" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <UserIcon className="w-16 h-16 mx-auto text-text-muted mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No Users Found
            </h3>
            <p className="text-text-muted">
              {searchQuery || roleFilter || statusFilter
                ? 'Try adjusting your filters'
                : 'No users have been created yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-text-muted">User</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Role</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Status</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Last Login</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{user.name}</p>
                        <p className="text-sm text-text-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={roleColors[user.role]}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={user.status === 'active' ? 'success' : 'error'}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-text-muted">
                    {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user)
                          setShowEditModal(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user)
                          toggleUserStatus(user)
                        }}
                        className={user.status === 'active' ? 'text-error hover:text-error' : 'text-accent hover:text-accent'}
                      >
                        {user.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          form.reset()
        }}
        title="Create New User"
        size="lg"
      >
        <form onSubmit={form.handleSubmit(handleCreateUser)} className="space-y-4">
          <Input
            label="Full Name"
            {...form.register('name')}
            error={form.formState.errors.name?.message}
          />
          <Input
            label="Email Address"
            type="email"
            {...form.register('email')}
            error={form.formState.errors.email?.message}
          />
          <Input
            label="Mobile Number"
            type="tel"
            {...form.register('mobile')}
            error={form.formState.errors.mobile?.message}
          />
          <Input
            label="Password"
            type="password"
            {...form.register('password')}
            error={form.formState.errors.password?.message}
          />
          <Select
            label="Role"
            options={[
              { value: 'user', label: 'User' },
              { value: 'editor', label: 'Editor' },
              { value: 'admin', label: 'Admin' },
            ]}
            {...form.register('role')}
            error={form.formState.errors.role?.message}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" type="button" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Create User
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedUser(null)
        }}
        title="Edit User"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium text-lg">
                  {selectedUser.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="font-semibold text-text-primary">{selectedUser.name}</p>
                <p className="text-sm text-text-muted">{selectedUser.email}</p>
              </div>
            </div>
            
            <Select
              label="Role"
              options={[
                { value: 'user', label: 'User' },
                { value: 'editor', label: 'Editor' },
                { value: 'admin', label: 'Admin' },
              ]}
              value={selectedUser.role}
              onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value as any })}
            />
            
            <Select
              label="Status"
              options={[
                { value: 'active', label: 'Active' },
                { value: 'disabled', label: 'Disabled' },
              ]}
              value={selectedUser.status}
              onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value as any })}
            />
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => handleUpdateUser({
                  role: selectedUser.role,
                  status: selectedUser.status,
                } as any)}
                loading={submitting}
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
