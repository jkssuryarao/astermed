import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, canManageSettings, canEditContent } from '@/lib/auth'
import { settingSchema, validateData } from '@/lib/validation'
import { 
  getSheetData, 
  parseSheetData,
  findRowByField,
  updateSheetRow,
  appendToSheet,
  SHEETS, 
  SCHEMAS 
} from '@/lib/google-sheets'
import { getCurrentDateTime } from '@/lib/utils'
import { Setting } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    const keys = searchParams.get('keys')?.split(',')
    
    const data = await getSheetData(SHEETS.SETTINGS)
    const settings = parseSheetData<Setting>(data, SCHEMAS[SHEETS.SETTINGS])
    
    if (key) {
      const setting = settings.find(s => s.key === key)
      return NextResponse.json({
        success: true,
        data: setting?.value || null,
      })
    }
    
    if (keys) {
      const result: Record<string, string> = {}
      keys.forEach(k => {
        const setting = settings.find(s => s.key === k)
        if (setting) {
          result[k] = setting.value
        }
      })
      return NextResponse.json({
        success: true,
        data: result,
      })
    }
    
    return NextResponse.json({
      success: true,
      data: settings,
    })
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentUser()
    
    if (!session || !canManageSettings(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    
    const validation = validateData(settingSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }
    
    const { key, value, description } = validation.data
    const now = getCurrentDateTime()
    
    const existing = await findRowByField(SHEETS.SETTINGS, 'key', key)
    
    if (existing) {
      const updatedSetting: Setting = {
        key,
        value,
        description: description || existing.row.description,
        updatedAt: now,
        updatedBy: session.user.name,
      }
      
      const rowValues = SCHEMAS[SHEETS.SETTINGS].map(
        col => updatedSetting[col as keyof Setting] || ''
      )
      
      await updateSheetRow(SHEETS.SETTINGS, existing.rowIndex, rowValues)
      
      return NextResponse.json({
        success: true,
        data: updatedSetting,
        message: 'Setting updated successfully',
      })
    }
    
    const newSetting: Setting = {
      key,
      value,
      description: description || '',
      updatedAt: now,
      updatedBy: session.user.name,
    }
    
    await appendToSheet(SHEETS.SETTINGS, [[
      newSetting.key,
      newSetting.value,
      newSetting.description,
      newSetting.updatedAt,
      newSetting.updatedBy,
    ]])
    
    return NextResponse.json({
      success: true,
      data: newSetting,
      message: 'Setting created successfully',
    })
  } catch (error) {
    console.error('Create/update setting error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save setting' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getCurrentUser()
    
    if (!session || !canManageSettings(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    
    if (!body.settings || typeof body.settings !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid settings format' },
        { status: 400 }
      )
    }
    
    const now = getCurrentDateTime()
    const data = await getSheetData(SHEETS.SETTINGS)
    const existingSettings = parseSheetData<Setting>(data, SCHEMAS[SHEETS.SETTINGS])
    
    for (const [key, value] of Object.entries(body.settings)) {
      const existing = existingSettings.find(s => s.key === key)
      const existingIndex = data.findIndex((row, i) => i > 0 && row[0] === key)
      
      if (existingIndex > 0) {
        const updatedSetting: Setting = {
          key,
          value: String(value),
          description: existing?.description || '',
          updatedAt: now,
          updatedBy: session.user.name,
        }
        
        const rowValues = SCHEMAS[SHEETS.SETTINGS].map(
          col => updatedSetting[col as keyof Setting] || ''
        )
        
        await updateSheetRow(SHEETS.SETTINGS, existingIndex + 1, rowValues)
      } else {
        const newSetting: Setting = {
          key,
          value: String(value),
          description: '',
          updatedAt: now,
          updatedBy: session.user.name,
        }
        
        await appendToSheet(SHEETS.SETTINGS, [[
          newSetting.key,
          newSetting.value,
          newSetting.description,
          newSetting.updatedAt,
          newSetting.updatedBy,
        ]])
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
    })
  } catch (error) {
    console.error('Bulk update settings error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
