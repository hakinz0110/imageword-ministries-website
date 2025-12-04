'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useSiteSettings, SiteSettings } from '@/hooks/useSiteSettings'

type SiteSettingsContextType = {
  settings: SiteSettings | null
  loading: boolean
  error: string | null
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined)

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const { settings, loading, error } = useSiteSettings()

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, error }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettingsContext() {
  const context = useContext(SiteSettingsContext)
  if (context === undefined) {
    throw new Error('useSiteSettingsContext must be used within a SiteSettingsProvider')
  }
  return context
}
