import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, canManageBlogs } from '@/lib/auth'
import { blogSchema, validateData } from '@/lib/validation'
import { 
  appendToSheet, 
  getSheetData, 
  parseSheetData,
  findRowByField,
  SHEETS, 
  SCHEMAS 
} from '@/lib/google-sheets'
import { generateId, generateSlug, getCurrentDateTime } from '@/lib/utils'
import { Blog } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentUser()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const slug = searchParams.get('slug')
    
    const data = await getSheetData(SHEETS.BLOGS)
    let blogs = parseSheetData<Blog>(data, SCHEMAS[SHEETS.BLOGS])
    
    if (slug) {
      const blog = blogs.find(b => b.slug === slug)
      if (!blog) {
        return NextResponse.json(
          { success: false, error: 'Blog not found' },
          { status: 404 }
        )
      }
      
      if (blog.status !== 'published' && !session) {
        return NextResponse.json(
          { success: false, error: 'Blog not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        success: true,
        data: blog,
      })
    }
    
    if (!session || session.user.role === 'user') {
      blogs = blogs.filter(b => b.status === 'published')
    } else if (status) {
      blogs = blogs.filter(b => b.status === status)
    }
    
    if (category) {
      blogs = blogs.filter(b => b.category === category)
    }
    
    blogs.sort((a, b) => 
      new Date(b.publishedAt || b.createdAt).getTime() - 
      new Date(a.publishedAt || a.createdAt).getTime()
    )
    
    return NextResponse.json({
      success: true,
      data: blogs,
    })
  } catch (error) {
    console.error('Get blogs error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentUser()
    
    if (!session || !canManageBlogs(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    
    const validation = validateData(blogSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }
    
    const { title, excerpt, content, coverImage, category, tags, status } = validation.data
    
    let slug = generateSlug(title)
    
    const existingSlug = await findRowByField(SHEETS.BLOGS, 'slug', slug)
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`
    }
    
    const now = getCurrentDateTime()
    const newBlog: Blog = {
      id: generateId(),
      title,
      slug,
      excerpt,
      content,
      coverImage: coverImage || '',
      author: session.user.name,
      authorId: session.user.id,
      category,
      tags: tags || '',
      status,
      views: '0',
      createdAt: now,
      updatedAt: now,
      publishedAt: status === 'published' ? now : '',
    }
    
    await appendToSheet(SHEETS.BLOGS, [[
      newBlog.id,
      newBlog.title,
      newBlog.slug,
      newBlog.excerpt,
      newBlog.content,
      newBlog.coverImage,
      newBlog.author,
      newBlog.authorId,
      newBlog.category,
      newBlog.tags,
      newBlog.status,
      newBlog.views,
      newBlog.createdAt,
      newBlog.updatedAt,
      newBlog.publishedAt,
    ]])
    
    return NextResponse.json({
      success: true,
      data: newBlog,
      message: 'Blog created successfully',
    })
  } catch (error) {
    console.error('Create blog error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create blog' },
      { status: 500 }
    )
  }
}
