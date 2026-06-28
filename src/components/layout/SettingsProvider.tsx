'use client'

import { createContext, useContext, ReactNode } from 'react'
import { DEFAULT_SETTINGS } from '@/lib/defaults'
import type { SiteSettings } from '@/lib/types'

const SettingsContext = createContext<SiteSettings>(DEFAULT_SETTINGS)

export function SettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings
  children: ReactNode
}) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSiteSettings() {
  return useContext(SettingsContext)
}
