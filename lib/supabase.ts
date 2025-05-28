import { createClient } from "@supabase/supabase-js"

// For development/demo purposes, we'll use a fallback configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "https://demo.supabase.co" // Demo fallback

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "demo-key" // Demo fallback

// Create a mock client for demo purposes if real credentials aren't available
const isDemo = supabaseUrl === "https://demo.supabase.co"

if (isDemo) {
  console.warn("Using demo mode - Supabase integration not properly configured")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client-side singleton
let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}

export { isDemo }
