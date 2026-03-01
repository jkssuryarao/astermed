const { google } = require('googleapis')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config({ path: '.env.local' })

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

function getPrivateKey(): string {
  const key = process.env.GOOGLE_PRIVATE_KEY || ''
  return key.replace(/\\n/g, '\n')
}

async function getGoogleSheetsClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: getPrivateKey(),
    scopes: SCOPES,
  })

  return google.sheets({ version: 'v4', auth })
}

const SHEET_ID = process.env.GOOGLE_SHEET_ID!

const SHEETS_CONFIG: Record<string, string[]> = {
  users: [
    'id', 'email', 'mobile', 'password', 'name', 'role', 'status', 
    'createdAt', 'updatedAt', 'lastLogin', 'resetToken', 'resetTokenExpiry'
  ],
  appointments: [
    'id', 'userId', 'guestName', 'guestEmail', 'guestMobile', 
    'date', 'timeSlot', 'service', 'doctor', 'status', 'notes',
    'createdAt', 'updatedAt', 'cancelledAt', 'cancelReason'
  ],
  queries: [
    'id', 'userId', 'guestName', 'guestEmail', 'guestMobile',
    'subject', 'message', 'status', 'priority', 'assignedTo',
    'response', 'respondedAt', 'respondedBy', 'createdAt', 'updatedAt'
  ],
  blogs: [
    'id', 'title', 'slug', 'excerpt', 'content', 'coverImage', 
    'author', 'authorId', 'category', 'tags', 'status', 'views',
    'createdAt', 'updatedAt', 'publishedAt'
  ],
  analytics: [
    'id', 'type', 'page', 'event', 'userId', 'sessionId',
    'userAgent', 'ip', 'referrer', 'metadata', 'createdAt'
  ],
  settings: [
    'key', 'value', 'description', 'updatedAt', 'updatedBy'
  ],
  content: [
    'id', 'page', 'section', 'key', 'value', 'type', 'updatedAt', 'updatedBy'
  ],
}

const DEFAULT_SETTINGS = [
  { key: 'clinic_name', value: 'AsterMed Healthcare', description: 'Clinic display name' },
  { key: 'clinic_email', value: 'contact@astermedhealthcare.com', description: 'Clinic contact email' },
  { key: 'clinic_phone', value: '093816 59308', description: 'Clinic contact phone' },
  { key: 'clinic_address', value: 'Vinayaka Nagar, Hafeezpet, Hyderabad, Telangana 500049', description: 'Clinic address' },
  { key: 'chatbot_enabled', value: 'true', description: 'Enable/disable chatbot' },
  { key: 'chatbot_mode', value: 'appointment', description: 'Chatbot mode: appointment, whatsapp, nlp' },
  { key: 'social_instagram', value: '', description: 'Instagram profile URL' },
  { key: 'social_youtube', value: '', description: 'YouTube channel URL' },
  { key: 'social_linkedin', value: '', description: 'LinkedIn page URL' },
  { key: 'social_facebook', value: '', description: 'Facebook page URL' },
  { key: 'instagram_enabled', value: 'true', description: 'Show Instagram icon' },
  { key: 'youtube_enabled', value: 'true', description: 'Show YouTube icon' },
  { key: 'linkedin_enabled', value: 'true', description: 'Show LinkedIn icon' },
  { key: 'facebook_enabled', value: 'true', description: 'Show Facebook icon' },
  { key: 'booking_advance_days', value: '90', description: 'Max days in advance for booking' },
  { key: 'time_slot_duration', value: '30', description: 'Appointment slot duration in minutes' },
  { key: 'working_hours_start', value: '09:00', description: 'Clinic opening time' },
  { key: 'working_hours_end', value: '18:00', description: 'Clinic closing time' },
  { key: 'lunch_break_start', value: '13:00', description: 'Lunch break start' },
  { key: 'lunch_break_end', value: '14:00', description: 'Lunch break end' },
]

async function initializeSheets() {
  console.log('🚀 Starting Google Sheets initialization...\n')
  
  if (!SHEET_ID) {
    console.error('❌ GOOGLE_SHEET_ID is not set in environment variables')
    process.exit(1)
  }
  
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    console.error('❌ GOOGLE_SERVICE_ACCOUNT_EMAIL is not set in environment variables')
    process.exit(1)
  }
  
  if (!process.env.GOOGLE_PRIVATE_KEY) {
    console.error('❌ GOOGLE_PRIVATE_KEY is not set in environment variables')
    process.exit(1)
  }

  const sheets = await getGoogleSheetsClient()
  
  console.log('📊 Connecting to Google Sheets...')
  
  let spreadsheet
  try {
    spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID })
    console.log(`✅ Connected to spreadsheet: ${spreadsheet.data.properties?.title}\n`)
  } catch (error: any) {
    console.error(`❌ Failed to connect to spreadsheet: ${error.message}`)
    console.error('   Make sure the service account has access to the spreadsheet')
    process.exit(1)
  }
  
  const existingSheets = spreadsheet.data.sheets?.map((s: any) => s.properties?.title) || []
  
  for (const [sheetName, columns] of Object.entries(SHEETS_CONFIG)) {
    console.log(`📋 Processing sheet: ${sheetName}`)
    
    if (!existingSheets.includes(sheetName)) {
      console.log(`   Creating new sheet: ${sheetName}`)
      
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
          requests: [{
            addSheet: {
              properties: { title: sheetName }
            }
          }]
        }
      })
      
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `${sheetName}!A1:${String.fromCharCode(65 + columns.length - 1)}1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [columns]
        }
      })
      
      console.log(`   ✅ Created sheet with ${columns.length} columns`)
    } else {
      console.log(`   Sheet already exists, checking columns...`)
      
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${sheetName}!1:1`
      })
      
      const existingColumns = response.data.values?.[0] || []
      const missingColumns = columns.filter((col: string) => !existingColumns.includes(col))
      
      if (missingColumns.length > 0) {
        const newRow = [...existingColumns, ...missingColumns]
        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: `${sheetName}!A1:${String.fromCharCode(65 + newRow.length - 1)}1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [newRow]
          }
        })
        console.log(`   ✅ Added missing columns: ${missingColumns.join(', ')}`)
      } else {
        console.log(`   ✅ All columns present`)
      }
    }
  }
  
  console.log('\n👤 Creating default users...')
  
  const usersResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'users!A:Z'
  })
  
  const usersData = usersResponse.data.values || []
  const existingEmails = usersData.slice(1).map((row: any[]) => row[1]?.toLowerCase())
  
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@astermed.com'
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'AsterMed@Admin2024'
  const editorEmail = process.env.DEFAULT_EDITOR_EMAIL || 'editor@astermed.com'
  const editorPassword = process.env.DEFAULT_EDITOR_PASSWORD || 'AsterMed@Editor2024'
  
  const usersToCreate: any[][] = []
  const now = new Date().toISOString()
  
  if (!existingEmails.includes(adminEmail.toLowerCase())) {
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 12)
    usersToCreate.push([
      uuidv4(),
      adminEmail.toLowerCase(),
      '0000000000',
      hashedAdminPassword,
      'Admin User',
      'admin',
      'active',
      now,
      now,
      '',
      '',
      ''
    ])
    console.log(`   ✅ Admin user will be created: ${adminEmail}`)
  } else {
    console.log(`   ℹ️  Admin user already exists: ${adminEmail}`)
  }
  
  if (!existingEmails.includes(editorEmail.toLowerCase())) {
    const hashedEditorPassword = await bcrypt.hash(editorPassword, 12)
    usersToCreate.push([
      uuidv4(),
      editorEmail.toLowerCase(),
      '0000000000',
      hashedEditorPassword,
      'Editor User',
      'editor',
      'active',
      now,
      now,
      '',
      '',
      ''
    ])
    console.log(`   ✅ Editor user will be created: ${editorEmail}`)
  } else {
    console.log(`   ℹ️  Editor user already exists: ${editorEmail}`)
  }
  
  if (usersToCreate.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'users!A:Z',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: usersToCreate
      }
    })
  }
  
  console.log('\n⚙️  Initializing default settings...')
  
  const settingsResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'settings!A:Z'
  })
  
  const settingsData = settingsResponse.data.values || []
  const existingKeys = settingsData.slice(1).map((row: any[]) => row[0])
  
  const settingsToCreate: any[][] = []
  
  for (const setting of DEFAULT_SETTINGS) {
    if (!existingKeys.includes(setting.key)) {
      settingsToCreate.push([
        setting.key,
        setting.value,
        setting.description,
        now,
        'system'
      ])
    }
  }
  
  if (settingsToCreate.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'settings!A:Z',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: settingsToCreate
      }
    })
    console.log(`   ✅ Created ${settingsToCreate.length} default settings`)
  } else {
    console.log('   ℹ️  All default settings already exist')
  }
  
  console.log('\n' + '═'.repeat(50))
  console.log('✅ Google Sheets initialization complete!')
  console.log('═'.repeat(50))
  console.log('\n📝 Default Credentials:')
  console.log('─'.repeat(50))
  console.log(`   Admin Email:    ${adminEmail}`)
  console.log(`   Admin Password: ${adminPassword}`)
  console.log('─'.repeat(50))
  console.log(`   Editor Email:    ${editorEmail}`)
  console.log(`   Editor Password: ${editorPassword}`)
  console.log('─'.repeat(50))
  console.log('\n⚠️  IMPORTANT: Change these passwords after first login!')
  console.log('\n')
}

initializeSheets().catch(console.error)
