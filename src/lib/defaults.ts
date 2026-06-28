import { BRAND } from './brand'
import type {
  Activity,
  BoardMember,
  Content,
  Department,
  DoctorProfile,
  ServiceTiming,
  SiteSettings,
} from './types'

export const DEFAULT_SETTINGS: SiteSettings = {
  clinic_name: BRAND.title,
  clinic_email: 'contact@astermedhealthcare.com',
  clinic_phone: '093816 59308',
  clinic_whatsapp: '093816 59308',
  clinic_address: 'Vinayaka Nagar, Hafeezpet, Hyderabad, Telangana 500049',
  clinic_map_url: 'https://maps.google.com/?q=Hafeezpet+Hyderabad',
  clinic_map_embed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.345678901234!2d78.3456789!3d17.4567890!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sHafeezpet!5e0!3m2!1sen!2sin!4v1234567890',
  social_facebook: '',
  social_instagram: '',
  social_youtube: '',
  social_linkedin: '',
  facebook_enabled: 'true',
  instagram_enabled: 'true',
  youtube_enabled: 'true',
  linkedin_enabled: 'true',
  hero_image_url: '',
  walk_in_text: 'Walk-in Available',
  copyright_text: `${BRAND.title}. All rights reserved.`,
  working_hours_start: '09:00',
  working_hours_end: '18:00',
}

export const DEFAULT_DEPARTMENTS: Department[] = [
  {
    id: 'dept-clinic',
    slug: 'clinic',
    name: 'Clinic',
    color: 'secondary',
    bullets: JSON.stringify([
      'General Consultation',
      'Chronic Disease Management',
      'Preventive Health Checkups',
      'Minor Procedures',
      'Health Counseling',
    ]),
    ctaLabel: 'Learn More',
    ctaHref: '/services#clinic',
    sortOrder: '1',
  },
  {
    id: 'dept-laboratory',
    slug: 'laboratory',
    name: 'Laboratory',
    color: 'primary',
    bullets: JSON.stringify([
      'Accurate & Advanced Testing',
      'Home Sample Collection',
      'Fast Report Turnaround',
      'Wide Test Menu',
      'Quality Assured Results',
    ]),
    ctaLabel: 'Book Lab Test',
    ctaHref: '/lab-tests',
    sortOrder: '2',
  },
  {
    id: 'dept-vaccines',
    slug: 'vaccines',
    name: 'Vaccines',
    color: 'purple',
    bullets: JSON.stringify([
      'Child Vaccinations',
      'Adult Vaccinations',
      'Travel Vaccines',
      'Flu Vaccines',
      'Immunization Records',
    ]),
    ctaLabel: 'Book Vaccine',
    ctaHref: '/appointment?service=vaccines',
    sortOrder: '3',
  },
]

export const DEFAULT_SERVICE_TIMINGS: ServiceTiming[] = [
  {
    id: 'timing-clinic',
    department: 'Clinic',
    weekdayLabel: 'Monday to Saturday',
    weekdayHours: '9:00 AM – 6:00 PM',
    sundayHours: 'Closed',
    sortOrder: '1',
  },
  {
    id: 'timing-laboratory',
    department: 'Laboratory',
    weekdayLabel: 'Monday to Saturday',
    weekdayHours: '7:00 AM – 8:00 PM',
    sundayHours: '8:00 AM – 2:00 PM',
    sortOrder: '2',
  },
  {
    id: 'timing-vaccines',
    department: 'Vaccines',
    weekdayLabel: 'Monday to Saturday',
    weekdayHours: '9:00 AM – 6:00 PM',
    sundayHours: 'Closed',
    sortOrder: '3',
  },
]

export const DEFAULT_DOCTORS: DoctorProfile[] = []

export const DEFAULT_BOARD_MEMBERS: BoardMember[] = []

export const DEFAULT_ACTIVITIES: Activity[] = []

export const DEFAULT_CONTENT: Omit<Content, 'updatedAt' | 'updatedBy'>[] = [
  { id: 'hero-title', page: 'home', section: 'hero', key: 'title', value: BRAND.title, type: 'text' },
  { id: 'hero-tagline', page: 'home', section: 'hero', key: 'tagline', value: 'Complete care. Trusted always.', type: 'text' },
  { id: 'hero-subtitle', page: 'home', section: 'hero', key: 'subtitle', value: BRAND.tagline, type: 'text' },
  {
    id: 'hero-values',
    page: 'home',
    section: 'hero',
    key: 'values',
    value: JSON.stringify([
      { label: 'Expert Doctors', icon: 'stethoscope' },
      { label: 'Advanced Diagnostics', icon: 'microscope' },
      { label: 'Accurate Reports', icon: 'file-check' },
      { label: 'Patient First Care', icon: 'heart' },
    ]),
    type: 'json',
  },
  {
    id: 'timings-values',
    page: 'home',
    section: 'timings',
    key: 'values',
    value: JSON.stringify([
      { label: 'Accurate Results', icon: 'check-circle' },
      { label: 'Hygienic Environment', icon: 'shield' },
      { label: 'Affordable Care', icon: 'wallet' },
      { label: 'Trained Professionals', icon: 'users' },
    ]),
    type: 'json',
  },
  {
    id: 'about-text',
    page: 'home',
    section: 'about',
    key: 'text',
    value: `${BRAND.title} is committed to providing quality healthcare with a patient-first approach. We combine advanced diagnostics, experienced doctors, and compassionate care to serve our community in Hafeezpet and beyond.`,
    type: 'text',
  },
  {
    id: 'about-values',
    page: 'home',
    section: 'about',
    key: 'values',
    value: JSON.stringify([
      { label: 'Patient First Approach', icon: 'heart' },
      { label: 'Quality & Accuracy', icon: 'award' },
      { label: 'Advanced Technology', icon: 'cpu' },
      { label: 'Affordable Healthcare', icon: 'wallet' },
    ]),
    type: 'json',
  },
  {
    id: 'journey-milestones',
    page: 'home',
    section: 'journey',
    key: 'milestones',
    value: JSON.stringify([
      { year: '2020', text: 'Clinic Started' },
      { year: '2021', text: 'Lab Services Launched' },
      { year: '2022', text: 'Vaccination Center Opened' },
      { year: '2023', text: '10,000+ Patients Served' },
      { year: '2024', text: 'Expanded Diagnostic Services' },
    ]),
    type: 'json',
  },
  {
    id: 'lab-popular-tests',
    page: 'home',
    section: 'lab',
    key: 'popular_tests',
    value: JSON.stringify(['CBC', 'HbA1c', 'Thyroid Profile', 'Lipid Profile', 'Liver Function', 'Kidney Function']),
    type: 'json',
  },
  {
    id: 'lab-process-steps',
    page: 'home',
    section: 'lab',
    key: 'process_steps',
    value: JSON.stringify([
      { label: 'Choose Date', icon: 'calendar' },
      { label: 'Home Collection', icon: 'home' },
      { label: 'Secure Payment', icon: 'credit-card' },
      { label: 'Digital Reports', icon: 'file-text' },
    ]),
    type: 'json',
  },
  {
    id: 'lab-coming-soon',
    page: 'lab-tests',
    section: 'main',
    key: 'message',
    value: 'Online lab test booking is coming soon. Please contact us to book your tests.',
    type: 'text',
  },
]
