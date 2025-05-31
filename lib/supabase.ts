import { createClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Check if we have valid Supabase configuration
export const isDemo =
  !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("demo") || supabaseAnonKey.includes("demo")

// Create Supabase client
export function getSupabaseClient() {
  if (isDemo) {
    // Return a mock client for demo mode
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () => Promise.resolve({ data: null, error: null }),
        signUp: () => Promise.resolve({ data: null, error: null }),
        signInWithOAuth: () => Promise.resolve({ data: null, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        resetPasswordForEmail: () => Promise.resolve({ error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: { code: "PGRST116" } }),
            order: () => ({
              limit: () => Promise.resolve({ data: [], error: null }),
            }),
          }),
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
        upsert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
        update: () => ({
          eq: () => Promise.resolve({ data: null, error: null }),
        }),
        delete: () => ({
          eq: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    } as any
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
}

// Helper function to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return !isDemo && supabaseUrl.startsWith("https://") && supabaseAnonKey.length > 20
}

// Get configuration status for UI display
export function getConfigurationStatus() {
  if (isDemo) {
    return {
      configured: false,
      message: "Supabase integration not configured",
      type: "demo" as const,
    }
  }

  if (!supabaseUrl.startsWith("https://")) {
    return {
      configured: false,
      message: "Invalid Supabase URL",
      type: "error" as const,
    }
  }

  if (supabaseAnonKey.length < 20) {
    return {
      configured: false,
      message: "Invalid Supabase anonymous key",
      type: "error" as const,
    }
  }

  return {
    configured: true,
    message: "Supabase integration active",
    type: "success" as const,
  }
}
