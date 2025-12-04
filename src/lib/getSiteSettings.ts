import { supabase } from './supabase'

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
}

// Server-side function to get site settings
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')

    if (error) {
      console.error('Error fetching site settings:', error)
      return null
    }

    // Convert array of {key, value} to object
    const settingsObj = data?.reduce((acc, item) => {
      acc[item.key] = item.value
      return acc
    }, {} as Record<string, string>)

    return settingsObj as SiteSettings
  } catch (err) {
    console.error('Failed to load settings:', err)
    return null
  }
}

// Get a single setting value
export async function getSiteSetting(key: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .single()

    if (error) {
      console.error(`Error fetching setting ${key}:`, error)
      return null
    }

    return data?.value || null
  } catch (err) {
    console.error(`Failed to load setting ${key}:`, err)
    return null
  }
}
