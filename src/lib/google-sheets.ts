import { google } from 'googleapis'

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

function getPrivateKey(): string {
  const key = process.env.GOOGLE_PRIVATE_KEY || ''
  return key.replace(/\\n/g, '\n')
}

export async function getGoogleSheetsClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: getPrivateKey(),
    scopes: SCOPES,
  })

  const sheets = google.sheets({ version: 'v4', auth })
  return sheets
}

export const SHEET_ID = process.env.GOOGLE_SHEET_ID!

export const SHEETS = {
  USERS: 'users',
  APPOINTMENTS: 'appointments',
  QUERIES: 'queries',
  BLOGS: 'blogs',
  ANALYTICS: 'analytics',
  SETTINGS: 'settings',
  CONTENT: 'content',
} as const

export const SCHEMAS = {
  [SHEETS.USERS]: [
    'id', 'email', 'mobile', 'password', 'name', 'role', 'status', 
    'createdAt', 'updatedAt', 'lastLogin', 'resetToken', 'resetTokenExpiry'
  ],
  [SHEETS.APPOINTMENTS]: [
    'id', 'userId', 'guestName', 'guestEmail', 'guestMobile', 
    'date', 'timeSlot', 'service', 'doctor', 'status', 'notes',
    'createdAt', 'updatedAt', 'cancelledAt', 'cancelReason'
  ],
  [SHEETS.QUERIES]: [
    'id', 'userId', 'guestName', 'guestEmail', 'guestMobile',
    'subject', 'message', 'status', 'priority', 'assignedTo',
    'response', 'respondedAt', 'respondedBy', 'createdAt', 'updatedAt'
  ],
  [SHEETS.BLOGS]: [
    'id', 'title', 'slug', 'excerpt', 'content', 'coverImage', 
    'author', 'authorId', 'category', 'tags', 'status', 'views',
    'createdAt', 'updatedAt', 'publishedAt'
  ],
  [SHEETS.ANALYTICS]: [
    'id', 'type', 'page', 'event', 'userId', 'sessionId',
    'userAgent', 'ip', 'referrer', 'metadata', 'createdAt'
  ],
  [SHEETS.SETTINGS]: [
    'key', 'value', 'description', 'updatedAt', 'updatedBy'
  ],
  [SHEETS.CONTENT]: [
    'id', 'page', 'section', 'key', 'value', 'type', 'updatedAt', 'updatedBy'
  ],
}

export async function getSheetData(sheetName: string): Promise<string[][]> {
  const sheets = await getGoogleSheetsClient()
  
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${sheetName}!A:Z`,
    })
    
    return response.data.values || []
  } catch (error: any) {
    if (error.code === 400 && error.message?.includes('Unable to parse range')) {
      return []
    }
    throw error
  }
}

export async function appendToSheet(sheetName: string, values: any[][]): Promise<void> {
  const sheets = await getGoogleSheetsClient()
  
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${sheetName}!A:Z`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values,
    },
  })
}

export async function updateSheetRow(
  sheetName: string, 
  rowIndex: number, 
  values: any[]
): Promise<void> {
  const sheets = await getGoogleSheetsClient()
  
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${sheetName}!A${rowIndex}:Z${rowIndex}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [values],
    },
  })
}

export async function deleteSheetRow(sheetName: string, rowIndex: number): Promise<void> {
  const sheets = await getGoogleSheetsClient()
  
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: SHEET_ID,
  })
  
  const sheet = spreadsheet.data.sheets?.find(
    (s) => s.properties?.title === sheetName
  )
  
  if (!sheet?.properties?.sheetId) {
    throw new Error(`Sheet ${sheetName} not found`)
  }
  
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: sheet.properties.sheetId,
              dimension: 'ROWS',
              startIndex: rowIndex - 1,
              endIndex: rowIndex,
            },
          },
        },
      ],
    },
  })
}

export function parseSheetData<T extends Record<string, any>>(
  data: string[][],
  schema: string[]
): T[] {
  if (data.length < 2) return []
  
  const headers = data[0]
  const rows = data.slice(1)
  
  return rows.map((row) => {
    const obj: Record<string, any> = {}
    headers.forEach((header, index) => {
      obj[header] = row[index] || ''
    })
    return obj as T
  })
}

export async function findRowByField(
  sheetName: string,
  fieldName: string,
  value: string
): Promise<{ row: Record<string, any>; rowIndex: number } | null> {
  const data = await getSheetData(sheetName)
  if (data.length < 2) return null
  
  const headers = data[0]
  const fieldIndex = headers.indexOf(fieldName)
  
  if (fieldIndex === -1) return null
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][fieldIndex] === value) {
      const row: Record<string, any> = {}
      headers.forEach((header, index) => {
        row[header] = data[i][index] || ''
      })
      return { row, rowIndex: i + 1 }
    }
  }
  
  return null
}

export async function findRowsByField(
  sheetName: string,
  fieldName: string,
  value: string
): Promise<{ row: Record<string, any>; rowIndex: number }[]> {
  const data = await getSheetData(sheetName)
  if (data.length < 2) return []
  
  const headers = data[0]
  const fieldIndex = headers.indexOf(fieldName)
  
  if (fieldIndex === -1) return []
  
  const results: { row: Record<string, any>; rowIndex: number }[] = []
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][fieldIndex] === value) {
      const row: Record<string, any> = {}
      headers.forEach((header, index) => {
        row[header] = data[i][index] || ''
      })
      results.push({ row, rowIndex: i + 1 })
    }
  }
  
  return results
}
