'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Search, Edit, Trash2, Eye, EyeOff, FileText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Modal from '@/components/ui/Modal'
import { blogSchema } from '@/lib/validation'
import { formatDate } from '@/lib/utils'
import { Blog } from '@/lib/types'
import { z } from 'zod'

type BlogForm = z.infer<typeof blogSchema>

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

const categoryOptions = [
  { value: 'health-tips', label: 'Health Tips' },
  { value: 'medical-news', label: 'Medical News' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'nutrition', label: 'Nutrition' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'mental-health', label: 'Mental Health' },
]

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const form = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      status: 'draft',
    },
  })

  const fetchBlogs = async () => {
    try {
      let url = '/api/blogs?'
      if (statusFilter) url += `status=${statusFilter}&`
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        setBlogs(data.data)
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [statusFilter])

  const handleCreateBlog = async (data: BlogForm) => {
    setSubmitting(true)
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (result.success) {
        fetchBlogs()
        setShowCreateModal(false)
        form.reset()
      } else {
        alert(result.error)
      }
    } catch (error) {
      console.error('Error creating blog:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateBlog = async (data: BlogForm) => {
    if (!selectedBlog) return
    
    setSubmitting(true)
    try {
      const response = await fetch(`/api/blogs/${selectedBlog.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (result.success) {
        fetchBlogs()
        setShowEditModal(false)
        setSelectedBlog(null)
        form.reset()
      } else {
        alert(result.error)
      }
    } catch (error) {
      console.error('Error updating blog:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteBlog = async (blog: Blog) => {
    if (!confirm('Are you sure you want to delete this blog?')) return
    
    setDeleting(true)
    try {
      const response = await fetch(`/api/blogs/${blog.id}`, {
        method: 'DELETE',
      })
      
      const result = await response.json()
      
      if (result.success) {
        fetchBlogs()
      } else {
        alert(result.error)
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
    } finally {
      setDeleting(false)
    }
  }

  const toggleVisibility = async (blog: Blog) => {
    const newStatus = blog.status === 'published' ? 'draft' : 'published'
    
    try {
      const response = await fetch(`/api/blogs/${blog.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (response.ok) {
        fetchBlogs()
      }
    } catch (error) {
      console.error('Error toggling visibility:', error)
    }
  }

  const openEditModal = (blog: Blog) => {
    setSelectedBlog(blog)
    form.reset({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage,
      category: blog.category,
      tags: blog.tags,
      status: blog.status,
    })
    setShowEditModal(true)
  }

  const filteredBlogs = blogs.filter(blog => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return blog.title.toLowerCase().includes(query)
    }
    return true
  })

  const statusColors: Record<string, 'success' | 'warning' | 'info'> = {
    published: 'success',
    draft: 'warning',
    archived: 'info',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Blog Management</h1>
          <p className="text-text-secondary">Create and manage blog posts</p>
        </div>
        <Button onClick={() => {
          form.reset({ status: 'draft' })
          setShowCreateModal(true)
        }}>
          <Plus className="w-4 h-4 mr-2" />
          New Blog
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
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
      ) : filteredBlogs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-text-muted mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No Blogs Found
            </h3>
            <p className="text-text-muted mb-4">
              {searchQuery || statusFilter
                ? 'Try adjusting your filters'
                : 'No blogs have been created yet'}
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              Create Your First Blog
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredBlogs.map((blog) => (
            <Card key={blog.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                    {blog.coverImage ? (
                      <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-8 h-8 text-text-muted" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-text-primary mb-1">{blog.title}</h3>
                        <p className="text-sm text-text-secondary line-clamp-2 mb-2">{blog.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs text-text-muted">
                          <span>{blog.author}</span>
                          <span>{formatDate(blog.createdAt)}</span>
                          {blog.category && <Badge variant="secondary" size="sm">{blog.category}</Badge>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={statusColors[blog.status]}>{blog.status}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleVisibility(blog)}
                      title={blog.status === 'published' ? 'Unpublish' : 'Publish'}
                    >
                      {blog.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(blog)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBlog(blog)}
                      className="text-error hover:text-error"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showCreateModal || showEditModal}
        onClose={() => {
          setShowCreateModal(false)
          setShowEditModal(false)
          setSelectedBlog(null)
          form.reset()
        }}
        title={showEditModal ? 'Edit Blog' : 'Create New Blog'}
        size="full"
      >
        <form onSubmit={form.handleSubmit(showEditModal ? handleUpdateBlog : handleCreateBlog)} className="space-y-4">
          <Input
            label="Title"
            {...form.register('title')}
            error={form.formState.errors.title?.message}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              options={categoryOptions}
              {...form.register('category')}
              error={form.formState.errors.category?.message}
            />
            <Select
              label="Status"
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'published', label: 'Published' },
                { value: 'archived', label: 'Archived' },
              ]}
              {...form.register('status')}
              error={form.formState.errors.status?.message}
            />
          </div>
          <Input
            label="Cover Image URL"
            placeholder="https://example.com/image.jpg"
            {...form.register('coverImage')}
            error={form.formState.errors.coverImage?.message}
          />
          <Textarea
            label="Excerpt"
            placeholder="Brief summary of the blog..."
            rows={2}
            {...form.register('excerpt')}
            error={form.formState.errors.excerpt?.message}
          />
          <Textarea
            label="Content (HTML supported)"
            placeholder="Write your blog content here..."
            rows={10}
            {...form.register('content')}
            error={form.formState.errors.content?.message}
          />
          <Input
            label="Tags (comma separated)"
            placeholder="health, wellness, tips"
            {...form.register('tags')}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="ghost"
              type="button"
              onClick={() => {
                setShowCreateModal(false)
                setShowEditModal(false)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {showEditModal ? 'Update Blog' : 'Create Blog'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
