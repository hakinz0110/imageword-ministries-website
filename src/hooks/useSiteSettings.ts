import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type SiteSettings = {
  church_name: string
  tagline: string
  mission_statement: string
  contact_email: string
  contact_phone: string
  address_line1: string
  address_line2: string
  city: string
  state: string
  zip: string
  country: string
  service_time_1: string
  service_time_2: string
  service_time_3?: string
  facebook_url: string
  instagram_url: string
  youtube_url: string
  twitter_url: string
  logo_url?: string
  logo_filter?: string
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('key, value')

        if (error) throw error

        // Convert array of {key, value} to object
        const settingsObj = data?.reduce((acc, item) => {
          acc[item.key] = item.value
          return acc
        }, {} as Record<string, string>)

        setSettings(settingsObj as SiteSettings)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load settings')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return { settings, loading, error }
}
