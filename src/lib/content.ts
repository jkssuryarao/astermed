import { unstable_cache } from 'next/cache'
import {
  getSheetData,
  parseSheetData,
  SHEETS,
  SCHEMAS,
} from './google-sheets'
import {
  DEFAULT_ACTIVITIES,
  DEFAULT_BOARD_MEMBERS,
  DEFAULT_CONTENT,
  DEFAULT_DEPARTMENTS,
  DEFAULT_DOCTORS,
  DEFAULT_SERVICE_TIMINGS,
  DEFAULT_SETTINGS,
} from './defaults'
import type {
  Activity,
  BoardMember,
  Content,
  Department,
  DoctorProfile,
  ServiceTiming,
  Setting,
  SiteSettings,
} from './types'

const REVALIDATE_SECONDS = 60

function isSheetsConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SHEET_ID &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY
  )
}

async function fetchSettingsRaw(): Promise<SiteSettings> {
  if (!isSheetsConfigured()) return DEFAULT_SETTINGS
  try {
    const data = await getSheetData(SHEETS.SETTINGS)
    const settings = parseSheetData<Setting>(data, SCHEMAS[SHEETS.SETTINGS])
    const map = settings.reduce<Record<string, string>>((acc, s) => {
      acc[s.key] = s.value
      return acc
    }, {})
    return { ...DEFAULT_SETTINGS, ...map } as SiteSettings
  } catch {
    return DEFAULT_SETTINGS
  }
}

export const getSiteSettings = unstable_cache(fetchSettingsRaw, ['site-settings'], {
  revalidate: REVALIDATE_SECONDS,
})

async function fetchContentRaw(): Promise<Content[]> {
  if (!isSheetsConfigured()) {
    return DEFAULT_CONTENT.map((c) => ({
      ...c,
      updatedAt: '',
      updatedBy: 'system',
    }))
  }
  try {
    const data = await getSheetData(SHEETS.CONTENT)
    const items = parseSheetData<Content>(data, SCHEMAS[SHEETS.CONTENT])
    if (items.length === 0) {
      return DEFAULT_CONTENT.map((c) => ({
        ...c,
        updatedAt: '',
        updatedBy: 'system',
      }))
    }
    return items
  } catch {
    return DEFAULT_CONTENT.map((c) => ({
      ...c,
      updatedAt: '',
      updatedBy: 'system',
    }))
  }
}

export const getContent = unstable_cache(fetchContentRaw, ['site-content'], {
  revalidate: REVALIDATE_SECONDS,
})

export async function getContentValue(
  page: string,
  section: string,
  key: string,
  fallback = ''
): Promise<string> {
  const items = await getContent()
  const item = items.find((c) => c.page === page && c.section === section && c.key === key)
  return item?.value || fallback
}

export async function getContentJson<T>(
  page: string,
  section: string,
  key: string,
  fallback: T
): Promise<T> {
  const raw = await getContentValue(page, section, key, '')
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

async function fetchEntity<T extends Record<string, any>>(
  sheet: string,
  schema: string[],
  defaults: T[],
  statusField = 'status'
): Promise<T[]> {
  if (!isSheetsConfigured()) return defaults
  try {
    const data = await getSheetData(sheet)
    let items = parseSheetData<T>(data, schema)
    if (statusField && items.length > 0) {
      items = items.filter((item) => {
        const status = (item as Record<string, string>)[statusField]
        return !status || status === 'active'
      })
    }
    items.sort((a, b) => {
      const orderA = Number((a as Record<string, string>).sortOrder) || 999
      const orderB = Number((b as Record<string, string>).sortOrder) || 999
      return orderA - orderB
    })
    return items.length > 0 ? items : defaults
  } catch {
    return defaults
  }
}

export const getDoctors = unstable_cache(
  () => fetchEntity<DoctorProfile>(SHEETS.DOCTORS, SCHEMAS[SHEETS.DOCTORS], DEFAULT_DOCTORS),
  ['doctors'],
  { revalidate: REVALIDATE_SECONDS }
)

export const getBoardMembers = unstable_cache(
  () =>
    fetchEntity<BoardMember>(SHEETS.BOARD_MEMBERS, SCHEMAS[SHEETS.BOARD_MEMBERS], DEFAULT_BOARD_MEMBERS),
  ['board-members'],
  { revalidate: REVALIDATE_SECONDS }
)

export const getActivities = unstable_cache(
  () => fetchEntity<Activity>(SHEETS.ACTIVITIES, SCHEMAS[SHEETS.ACTIVITIES], DEFAULT_ACTIVITIES),
  ['activities'],
  { revalidate: REVALIDATE_SECONDS }
)

export const getDepartments = unstable_cache(
  () => fetchEntity<Department>(SHEETS.DEPARTMENTS, SCHEMAS[SHEETS.DEPARTMENTS], DEFAULT_DEPARTMENTS, ''),
  ['departments'],
  { revalidate: REVALIDATE_SECONDS }
)

export const getServiceTimings = unstable_cache(
  () =>
    fetchEntity<ServiceTiming>(
      SHEETS.SERVICE_TIMINGS,
      SCHEMAS[SHEETS.SERVICE_TIMINGS],
      DEFAULT_SERVICE_TIMINGS,
      ''
    ),
  ['service-timings'],
  { revalidate: REVALIDATE_SECONDS }
)

export function parseBullets(bullets: string): string[] {
  try {
    const parsed = JSON.parse(bullets)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return bullets ? bullets.split('|').map((s) => s.trim()) : []
  }
}

export async function getHomePageData() {
  const [settings, content, doctors, boardMembers, activities, departments, serviceTimings] =
    await Promise.all([
      getSiteSettings(),
      getContent(),
      getDoctors(),
      getBoardMembers(),
      getActivities(),
      getDepartments(),
      getServiceTimings(),
    ])

  const getVal = (page: string, section: string, key: string, fallback = '') => {
    const item = content.find((c) => c.page === page && c.section === section && c.key === key)
    return item?.value || fallback
  }

  const getJson = <T,>(page: string, section: string, key: string, fallback: T): T => {
    const raw = getVal(page, section, key, '')
    if (!raw) return fallback
    try {
      return JSON.parse(raw) as T
    } catch {
      return fallback
    }
  }

  return {
    settings,
    hero: {
      title: getVal('home', 'hero', 'title', DEFAULT_SETTINGS.clinic_name),
      tagline: getVal('home', 'hero', 'tagline', 'Complete care. Trusted always.'),
      subtitle: getVal('home', 'hero', 'subtitle', ''),
      values: getJson('home', 'hero', 'values', [] as { label: string; icon: string }[]),
    },
    timingsValues: getJson('home', 'timings', 'values', [] as { label: string; icon: string }[]),
    about: {
      text: getVal('home', 'about', 'text', ''),
      values: getJson('home', 'about', 'values', [] as { label: string; icon: string }[]),
    },
    journey: getJson('home', 'journey', 'milestones', [] as { year: string; text: string }[]),
    lab: {
      popularTests: getJson('home', 'lab', 'popular_tests', [] as string[]),
      processSteps: getJson('home', 'lab', 'process_steps', [] as { label: string; icon: string }[]),
      comingSoonMessage: getVal(
        'lab-tests',
        'main',
        'message',
        'Online lab test booking is coming soon. Please contact us to book your tests.'
      ),
    },
    doctors,
    boardMembers,
    activities,
    departments,
    serviceTimings,
  }
}
