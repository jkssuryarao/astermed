import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, canManageBlogs } from '@/lib/auth'
import { blogSchema, validateData } from '@/lib/validation'
import { 
  findRowByField,
  updateSheetRow,
  deleteSheetRow,
  SHEETS, 
  SCHEMAS 
} from '@/lib/google-sheets'
import { getCurrentDateTime, generateSlug } from '@/lib/utils'
import { Blog } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getCurrentUser()
    
    const result = await findRowByField(SHEETS.BLOGS, 'id', id)
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      )
    }
    
    const blog = result.row as Blog
    
    if (blog.status !== 'published' && (!session || session.user.role === 'user')) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: blog,
    })
  } catch (error) {
    console.error('Get blog error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getCurrentUser()
    
    if (!session || !canManageBlogs(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    
    const result = await findRowByField(SHEETS.BLOGS, 'id', id)
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      )
    }
    
    const blog = result.row as Blog
    
    const validation = validateData(blogSchema.partial(), body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }
    
    const now = getCurrentDateTime()
    const updates: Partial<Blog> = validation.data
    
    if (updates.title && updates.title !== blog.title) {
      updates.slug = generateSlug(updates.title)
    }
    
    if (updates.status === 'published' && blog.status !== 'published') {
      updates.publishedAt = now
    }
    
    const updatedBlog: Blog = {
      ...blog,
      ...updates,
      updatedAt: now,
    }
    
    const rowValues = SCHEMAS[SHEETS.BLOGS].map(
      col => updatedBlog[col as keyof Blog] || ''
    )
    
    await updateSheetRow(SHEETS.BLOGS, result.rowIndex, rowValues)
    
    return NextResponse.json({
      success: true,
      data: updatedBlog,
      message: 'Blog updated successfully',
    })
  } catch (error) {
    console.error('Update blog error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update blog' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getCurrentUser()
    
    if (!session || !canManageBlogs(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    const result = await findRowByField(SHEETS.BLOGS, 'id', id)
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      )
    }
    
    await deleteSheetRow(SHEETS.BLOGS, result.rowIndex)
    
    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully',
    })
  } catch (error) {
    console.error('Delete blog error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog' },
      { status: 500 }
    )
  }
}
