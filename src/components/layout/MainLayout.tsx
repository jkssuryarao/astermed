import { getSiteSettings } from '@/lib/content'
import MainLayoutClient from './MainLayoutClient'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  return <MainLayoutClient settings={settings}>{children}</MainLayoutClient>
}
