import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, canEditContent } from '@/lib/auth'
import {
  appendToSheet,
  findRowByField,
  getSheetData,
  parseSheetData,
  updateSheetRow,
  SHEETS,
  SCHEMAS,
} from '@/lib/google-sheets'
import { generateId, getCurrentDateTime } from '@/lib/utils'
import { Content } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    const section = searchParams.get('section')

    const data = await getSheetData(SHEETS.CONTENT)
    let items = parseSheetData<Content>(data, SCHEMAS[SHEETS.CONTENT])

    if (page) items = items.filter((c) => c.page === page)
    if (section) items = items.filter((c) => c.section === section)

    return NextResponse.json({ success: true, data: items })
  } catch (error) {
    console.error('Get content error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentUser()
    if (!session || !canEditContent(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const { page, section, key, value, type = 'text' } = body

    if (!page || !section || !key) {
      return NextResponse.json({ success: false, error: 'page, section, and key are required' }, { status: 400 })
    }

    const now = getCurrentDateTime()
    const existing = await findRowByField(SHEETS.CONTENT, 'id', body.id || `${page}-${section}-${key}`)

    if (existing) {
      const updated: Content = {
        ...existing.row as Content,
        value: value ?? existing.row.value,
        type: type || existing.row.type,
        updatedAt: now,
        updatedBy: session.user.name,
      }
      const rowValues = SCHEMAS[SHEETS.CONTENT].map((col) => updated[col as keyof Content] || '')
      await updateSheetRow(SHEETS.CONTENT, existing.rowIndex, rowValues)
      return NextResponse.json({ success: true, data: updated })
    }

    const item: Content = {
      id: body.id || `${page}-${section}-${key}`,
      page,
      section,
      key,
      value: value || '',
      type,
      updatedAt: now,
      updatedBy: session.user.name,
    }

    await appendToSheet(SHEETS.CONTENT, [[
      item.id, item.page, item.section, item.key, item.value, item.type, item.updatedAt, item.updatedBy,
    ]])

    return NextResponse.json({ success: true, data: item })
  } catch (error) {
    console.error('Save content error:', error)
    return NextResponse.json({ success: false, error: 'Failed to save content' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getCurrentUser()
    if (!session || !canEditContent(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    if (!body.items || !Array.isArray(body.items)) {
      return NextResponse.json({ success: false, error: 'items array required' }, { status: 400 })
    }

    const now = getCurrentDateTime()
    const results: Content[] = []

    for (const item of body.items) {
      const { page, section, key, value, type = 'text' } = item
      const id = item.id || `${page}-${section}-${key}`
      const existing = await findRowByField(SHEETS.CONTENT, 'id', id)

      const content: Content = {
        id,
        page,
        section,
        key,
        value: value || '',
        type,
        updatedAt: now,
        updatedBy: session.user.name,
      }

      if (existing) {
        const rowValues = SCHEMAS[SHEETS.CONTENT].map((col) => content[col as keyof Content] || '')
        await updateSheetRow(SHEETS.CONTENT, existing.rowIndex, rowValues)
      } else {
        await appendToSheet(SHEETS.CONTENT, [[
          content.id, content.page, content.section, content.key, content.value, content.type, content.updatedAt, content.updatedBy,
        ]])
      }
      results.push(content)
    }

    return NextResponse.json({ success: true, data: results, message: 'Content saved' })
  } catch (error) {
    console.error('Bulk save content error:', error)
    return NextResponse.json({ success: false, error: 'Failed to save content' }, { status: 500 })
  }
}
