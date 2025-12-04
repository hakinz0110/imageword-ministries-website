import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Event = {
  id: string
  title: string
  description: string | null
  event_date: string
  end_date: string | null
  location: string | null
  image_url: string | null
  is_recurring: boolean
  recurring_schedule: string | null
  registration_link: string | null
  flyer_url: string | null
  category: string | null
  max_attendees: number | null
  current_attendees: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export type Sermon = {
  id: string
  title: string
  description: string | null
  pastor: string
  sermon_date: string
  video_url: string | null
  audio_url: string | null
  thumbnail_url: string | null
  series_name: string | null
  scripture_reference: string | null
  duration: number | null
  views: number
  is_featured: boolean
  is_published: boolean
  created_at: string
  updated_at: string
}

export type Ministry = {
  id: string
  name: string
  description: string | null
  long_description: string | null
  image_url: string | null
  leader_name: string | null
  leader_email: string | null
  leader_phone: string | null
  meeting_schedule: string | null
  meeting_location: string | null
  category: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export type Leadership = {
  id: string
  name: string
  title: string
  bio: string | null
  image_url: string | null
  email: string | null
  phone: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type SiteSetting = {
  id: string
  key: string
  value: string | null
  description: string | null
  updated_at: string
}
