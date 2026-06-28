import { getSiteSettings } from '@/lib/content'
import ContactClient from './ContactClient'

export const revalidate = 60

export default async function ContactPage() {
  const settings = await getSiteSettings()
  return <ContactClient settings={settings} />
}
