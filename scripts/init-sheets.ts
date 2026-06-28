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
  doctors: [
    'id', 'name', 'qualifications', 'specialty', 'experienceYears', 'availability',
    'bio', 'photoUrl', 'sortOrder', 'status'
  ],
  board_members: [
    'id', 'name', 'designation', 'qualifications', 'experienceYears', 'photoUrl', 'sortOrder', 'status'
  ],
  activities: [
    'id', 'title', 'location', 'date', 'imageUrl', 'description', 'sortOrder', 'status'
  ],
  departments: [
    'id', 'slug', 'name', 'color', 'bullets', 'ctaLabel', 'ctaHref', 'sortOrder'
  ],
  service_timings: [
    'id', 'department', 'weekdayLabel', 'weekdayHours', 'sundayHours', 'sortOrder'
  ],
}

const DEFAULT_SETTINGS = [
  { key: 'clinic_name', value: 'AsterMed diagnostic and Health services', description: 'Clinic display name' },
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
  { key: 'clinic_whatsapp', value: '093816 59308', description: 'WhatsApp contact number' },
  { key: 'clinic_map_url', value: 'https://maps.google.com/?q=Hafeezpet+Hyderabad', description: 'Google Maps directions URL' },
  { key: 'clinic_map_embed', value: '', description: 'Google Maps embed URL for footer' },
  { key: 'hero_image_url', value: '', description: 'Hero section background image URL' },
  { key: 'walk_in_text', value: 'Walk-in Available', description: 'Walk-in availability text' },
  { key: 'copyright_text', value: 'AsterMed diagnostic and Health services. All rights reserved.', description: 'Footer copyright text' },
]

const DEFAULT_CONTENT = [
  ['hero-title', 'home', 'hero', 'title', 'AsterMed diagnostic and Health services', 'text'],
  ['hero-tagline', 'home', 'hero', 'tagline', 'Complete care. Trusted always.', 'text'],
  ['hero-subtitle', 'home', 'hero', 'subtitle', 'Precision Trust Care', 'text'],
  ['hero-values', 'home', 'hero', 'values', JSON.stringify([
    { label: 'Expert Doctors', icon: 'stethoscope' },
    { label: 'Advanced Diagnostics', icon: 'microscope' },
    { label: 'Accurate Reports', icon: 'file-check' },
    { label: 'Patient First Care', icon: 'heart' },
  ]), 'json'],
  ['timings-values', 'home', 'timings', 'values', JSON.stringify([
    { label: 'Accurate Results', icon: 'check-circle' },
    { label: 'Hygienic Environment', icon: 'shield' },
    { label: 'Affordable Care', icon: 'wallet' },
    { label: 'Trained Professionals', icon: 'users' },
  ]), 'json'],
  ['about-text', 'home', 'about', 'text', 'AsterMed diagnostic and Health services is committed to providing quality healthcare with a patient-first approach.', 'text'],
  ['about-values', 'home', 'about', 'values', JSON.stringify([
    { label: 'Patient First Approach', icon: 'heart' },
    { label: 'Quality & Accuracy', icon: 'award' },
    { label: 'Advanced Technology', icon: 'cpu' },
    { label: 'Affordable Healthcare', icon: 'wallet' },
  ]), 'json'],
  ['journey-milestones', 'home', 'journey', 'milestones', JSON.stringify([
    { year: '2020', text: 'Clinic Started' },
    { year: '2021', text: 'Lab Services Launched' },
    { year: '2022', text: 'Vaccination Center Opened' },
    { year: '2023', text: '10,000+ Patients Served' },
    { year: '2024', text: 'Expanded Diagnostic Services' },
  ]), 'json'],
  ['lab-popular-tests', 'home', 'lab', 'popular_tests', JSON.stringify(['CBC', 'HbA1c', 'Thyroid Profile', 'Lipid Profile', 'Liver Function', 'Kidney Function']), 'json'],
  ['lab-process-steps', 'home', 'lab', 'process_steps', JSON.stringify([
    { label: 'Choose Date', icon: 'calendar' },
    { label: 'Home Collection', icon: 'home' },
    { label: 'Secure Payment', icon: 'credit-card' },
    { label: 'Digital Reports', icon: 'file-text' },
  ]), 'json'],
  ['lab-coming-soon', 'lab-tests', 'main', 'message', 'Online lab test booking is coming soon. Please contact us to book your tests.', 'text'],
]

const DEFAULT_DEPARTMENTS = [
  ['dept-clinic', 'clinic', 'Clinic', 'secondary', JSON.stringify(['General Consultation', 'Chronic Disease Management', 'Preventive Health Checkups', 'Minor Procedures', 'Health Counseling']), 'Learn More', '/services#clinic', '1'],
  ['dept-laboratory', 'laboratory', 'Laboratory', 'primary', JSON.stringify(['Accurate & Advanced Testing', 'Home Sample Collection', 'Fast Report Turnaround', 'Wide Test Menu', 'Quality Assured Results']), 'Book Lab Test', '/lab-tests', '2'],
  ['dept-vaccines', 'vaccines', 'Vaccines', 'purple', JSON.stringify(['Child Vaccinations', 'Adult Vaccinations', 'Travel Vaccines', 'Flu Vaccines', 'Immunization Records']), 'Book Vaccine', '/appointment?service=vaccines', '3'],
]

const DEFAULT_SERVICE_TIMINGS = [
  ['timing-clinic', 'Clinic', 'Monday to Saturday', '9:00 AM – 6:00 PM', 'Closed', '1'],
  ['timing-laboratory', 'Laboratory', 'Monday to Saturday', '7:00 AM – 8:00 PM', '8:00 AM – 2:00 PM', '2'],
  ['timing-vaccines', 'Vaccines', 'Monday to Saturday', '9:00 AM – 6:00 PM', 'Closed', '3'],
]

async function seedContentRows(
  sheetName: string,
  _columns: string[],
  rows: string[][],
  getKey: (row: string[]) => string,
  withTimestamps = false
) {
  const sheets = await getGoogleSheetsClient()
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${sheetName}!A:Z`,
  })
  const data = response.data.values || []
  const existingKeys = data.slice(1).map((row: string[]) => getKey(row))
  const now = new Date().toISOString()
  const toCreate: string[][] = []

  for (const row of rows) {
    if (!existingKeys.includes(getKey(row))) {
      toCreate.push(withTimestamps ? [...row, now, 'system'] : row)
    }
  }

  if (toCreate.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: toCreate },
    })
    console.log(`   ✅ Created ${toCreate.length} default rows in ${sheetName}`)
  } else {
    console.log(`   ℹ️  All default rows already exist in ${sheetName}`)
  }
}

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

  console.log('\n📄 Initializing default content...')
  await seedContentRows('content', ['id', 'page', 'section', 'key', 'value', 'type'], DEFAULT_CONTENT, (row) => row[0], true)

  console.log('\n🏥 Initializing departments...')
  await seedContentRows('departments', ['id', 'slug', 'name', 'color', 'bullets', 'ctaLabel', 'ctaHref', 'sortOrder'], DEFAULT_DEPARTMENTS, (row) => row[0], false)

  console.log('\n🕐 Initializing service timings...')
  await seedContentRows('service_timings', ['id', 'department', 'weekdayLabel', 'weekdayHours', 'sundayHours', 'sortOrder'], DEFAULT_SERVICE_TIMINGS, (row) => row[0], false)
  
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
