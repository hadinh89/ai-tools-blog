import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create client if environment variables are properly set
export const supabase = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_project_url' && 
  supabaseAnonKey !== 'your_supabase_anon_key'
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Database types
export interface Tool {
  id: string
  title: string
  affiliate_link: string
  categories: string[]
  highlights: string
  features: string
  pricing: 'Free' | 'Freemium' | 'Paid' | 'Lifetime'
  note: string
  image_url: string
  created_at: string
  updated_at: string
}

export type PricingType = 'Free' | 'Freemium' | 'Paid' | 'Lifetime'