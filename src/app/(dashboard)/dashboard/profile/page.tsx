'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Mail, Phone, Lock, Save, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { profileUpdateSchema, passwordChangeSchema } from '@/lib/validation'
import { z } from 'zod'

type ProfileForm = z.infer<typeof profileUpdateSchema>
type PasswordForm = z.infer<typeof passwordChangeSchema>

interface UserData {
  id: string
  name: string
  email: string
  mobile: string
  role: string
  createdAt: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileUpdateSchema),
  })

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordChangeSchema),
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()
        
        if (data.success) {
          setUser(data.data.user)
          profileForm.reset({
            name: data.data.user.name,
            mobile: data.data.user.mobile,
          })
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUser()
  }, [])

  const handleProfileSubmit = async (data: ProfileForm) => {
    if (!user) return
    
    setSaving(true)
    setMessage(null)
    
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setUser(result.data)
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (data: PasswordForm) => {
    if (!user) return
    
    setSavingPassword(true)
    setMessage(null)
    
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: data.newPassword }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        passwordForm.reset()
        setMessage({ type: 'success', text: 'Password changed successfully!' })
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to change password' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' })
    } finally {
      setSavingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="loader" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Profile Settings</h1>
        <p className="text-text-secondary">Manage your account information</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-accent/10 text-accent-700' : 'bg-error/10 text-error'
        }`}>
          {message.text}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              {...profileForm.register('name')}
              error={profileForm.formState.errors.name?.message}
            />
            
            <div>
              <label className="label">Email Address</label>
              <div className="flex items-center gap-2 px-4 py-3 bg-muted rounded-lg">
                <Mail className="w-5 h-5 text-text-muted" />
                <span className="text-text-primary">{user.email}</span>
              </div>
              <p className="text-xs text-text-muted mt-1">Email cannot be changed</p>
            </div>
            
            <Input
              label="Mobile Number"
              type="tel"
              {...profileForm.register('mobile')}
              error={profileForm.formState.errors.mobile?.message}
            />
            
            <div className="pt-4">
              <Button type="submit" loading={saving}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
            <div className="relative">
              <Input
                label="Current Password"
                type={showPassword ? 'text' : 'password'}
                {...passwordForm.register('currentPassword')}
                error={passwordForm.formState.errors.currentPassword?.message}
              />
            </div>
            
            <div className="relative">
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                {...passwordForm.register('newPassword')}
                error={passwordForm.formState.errors.newPassword?.message}
                hint="Min 8 characters with uppercase, lowercase, and number"
              />
            </div>
            
            <div className="relative">
              <Input
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                {...passwordForm.register('confirmPassword')}
                error={passwordForm.formState.errors.confirmPassword?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-text-muted hover:text-text-primary"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="pt-4">
              <Button type="submit" loading={savingPassword}>
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-muted">Account Type</span>
              <p className="font-medium text-text-primary capitalize">{user.role}</p>
            </div>
            <div>
              <span className="text-text-muted">Member Since</span>
              <p className="font-medium text-text-primary">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
