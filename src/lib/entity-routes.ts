import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, canEditContent } from '@/lib/auth'
import {
  appendToSheet,
  deleteSheetRow,
  findRowByField,
  getSheetData,
  parseSheetData,
  updateSheetRow,
  SCHEMAS,
} from '@/lib/google-sheets'
import { generateId, getCurrentDateTime } from '@/lib/utils'

interface EntityRouteConfig {
  sheet: string
  idField?: string
}

export function createEntityHandlers(config: EntityRouteConfig) {
  const { sheet, idField = 'id' } = config
  const schema = SCHEMAS[sheet as keyof typeof SCHEMAS]

  async function GET(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url)
      const id = searchParams.get('id')

      const data = await getSheetData(sheet)
      let items = parseSheetData<Record<string, string>>(data, schema)

      if (id) {
        const item = items.find((i) => i[idField] === id)
        if (!item) {
          return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
        }
        return NextResponse.json({ success: true, data: item })
      }

      if (items.some((i) => i.status)) {
        items = items.filter((i) => !i.status || i.status === 'active')
      }

      items.sort((a, b) => {
        const orderA = Number(a.sortOrder) || 999
        const orderB = Number(b.sortOrder) || 999
        return orderA - orderB
      })

      return NextResponse.json({ success: true, data: items })
    } catch (error) {
      console.error(`Get ${sheet} error:`, error)
      return NextResponse.json({ success: false, error: `Failed to fetch ${sheet}` }, { status: 500 })
    }
  }

  async function POST(request: NextRequest) {
    try {
      const session = await getCurrentUser()
      if (!session || !canEditContent(session.user.role)) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
      }

      const body = await request.json()
      const id = body[idField] || generateId()
      const now = getCurrentDateTime()

      const row: Record<string, string> = { ...body, [idField]: id }
      if (schema.includes('status') && !row.status) row.status = 'active'
      if (schema.includes('updatedAt')) row.updatedAt = now
      if (schema.includes('updatedBy')) row.updatedBy = session.user.name

      const rowValues = schema.map((col) => row[col] || '')
      await appendToSheet(sheet, [rowValues])

      return NextResponse.json({ success: true, data: row, message: 'Created successfully' })
    } catch (error) {
      console.error(`Create ${sheet} error:`, error)
      return NextResponse.json({ success: false, error: `Failed to create ${sheet}` }, { status: 500 })
    }
  }

  async function PUT(request: NextRequest) {
    try {
      const session = await getCurrentUser()
      if (!session || !canEditContent(session.user.role)) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
      }

      const body = await request.json()
      const id = body[idField]
      if (!id) {
        return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
      }

      const existing = await findRowByField(sheet, idField, id)
      if (!existing) {
        return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
      }

      const now = getCurrentDateTime()
      const row: Record<string, string> = { ...existing.row, ...body, [idField]: id }
      if (schema.includes('updatedAt')) row.updatedAt = now
      if (schema.includes('updatedBy')) row.updatedBy = session.user.name

      const rowValues = schema.map((col) => row[col] || '')
      await updateSheetRow(sheet, existing.rowIndex, rowValues)

      return NextResponse.json({ success: true, data: row, message: 'Updated successfully' })
    } catch (error) {
      console.error(`Update ${sheet} error:`, error)
      return NextResponse.json({ success: false, error: `Failed to update ${sheet}` }, { status: 500 })
    }
  }

  async function DELETE(request: NextRequest) {
    try {
      const session = await getCurrentUser()
      if (!session || !canEditContent(session.user.role)) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
      }

      const { searchParams } = new URL(request.url)
      const id = searchParams.get('id')
      if (!id) {
        return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
      }

      const existing = await findRowByField(sheet, idField, id)
      if (!existing) {
        return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
      }

      await deleteSheetRow(sheet, existing.rowIndex)
      return NextResponse.json({ success: true, message: 'Deleted successfully' })
    } catch (error) {
      console.error(`Delete ${sheet} error:`, error)
      return NextResponse.json({ success: false, error: `Failed to delete ${sheet}` }, { status: 500 })
    }
  }

  return { GET, POST, PUT, DELETE }
}
