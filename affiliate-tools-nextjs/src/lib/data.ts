import { supabase, Tool, PricingType } from './supabaseClient'
import { mockTools, mockCategories } from './mockData'

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return supabase !== null
}

export async function getAllTools(): Promise<Tool[]> {
  if (!isSupabaseConfigured()) {
    return mockTools
  }

  const { data, error } = await supabase!
    .from('tools')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tools:', error)
    return mockTools
  }

  return data || mockTools
}

export async function getToolById(id: string): Promise<Tool | null> {
  if (!isSupabaseConfigured()) {
    return mockTools.find(tool => tool.id === id) || null
  }

  const { data, error } = await supabase!
    .from('tools')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching tool:', error)
    return mockTools.find(tool => tool.id === id) || null
  }

  return data
}

export async function searchTools(
  query?: string,
  category?: string,
  pricing?: PricingType
): Promise<Tool[]> {
  if (!isSupabaseConfigured()) {
    let filteredTools = mockTools

    // Apply search filter
    if (query) {
      filteredTools = filteredTools.filter(tool =>
        tool.title.toLowerCase().includes(query.toLowerCase())
      )
    }

    // Apply category filter
    if (category) {
      filteredTools = filteredTools.filter(tool =>
        tool.categories.includes(category)
      )
    }

    // Apply pricing filter
    if (pricing) {
      filteredTools = filteredTools.filter(tool => tool.pricing === pricing)
    }

    return filteredTools
  }

  let supabaseQuery = supabase!
    .from('tools')
    .select('*')

  // Add search filter
  if (query) {
    supabaseQuery = supabaseQuery.ilike('title', `%${query}%`)
  }

  // Add category filter
  if (category) {
    supabaseQuery = supabaseQuery.contains('categories', [category])
  }

  // Add pricing filter
  if (pricing) {
    supabaseQuery = supabaseQuery.eq('pricing', pricing)
  }

  const { data, error } = await supabaseQuery.order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching tools:', error)
    return []
  }

  return data || []
}

export async function getAllCategories(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return mockCategories
  }

  const { data, error } = await supabase!
    .from('tools')
    .select('categories')

  if (error) {
    console.error('Error fetching categories:', error)
    return mockCategories
  }

  // Flatten and deduplicate categories
  const allCategories = data?.flatMap(tool => tool.categories) || []
  return [...new Set(allCategories)].sort()
}

export const PRICING_OPTIONS: PricingType[] = ['Free', 'Freemium', 'Paid', 'Lifetime']