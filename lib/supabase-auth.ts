import { createClient } from "@supabase/supabase-js"

// Enhanced Supabase client with Google OAuth configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "https://demo.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "demo-key"

// Create Supabase client with auth configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
})

// Google OAuth configuration
export const googleAuthConfig = {
  provider: "google" as const,
  options: {
    redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
    queryParams: {
      access_type: "offline",
      prompt: "consent",
    },
    scopes: "openid email profile",
  },
}

// Auth helper functions
export const authHelpers = {
  // Sign in with Google
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth(googleAuthConfig)

    if (error) {
      console.error("Google sign-in error:", error)
      throw new Error(`Google sign-in failed: ${error.message}`)
    }

    return data
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Sign out error:", error)
      throw new Error(`Sign out failed: ${error.message}`)
    }
  },

  // Get current session
  async getSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()
    if (error) {
      console.error("Get session error:", error)
      return null
    }
    return session
  },

  // Get current user
  async getUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) {
      console.error("Get user error:", error)
      return null
    }
    return user
  },

  // Traditional email/password sign up
  async signUpWithEmail(email: string, password: string, metadata: any = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
      },
    })

    if (error) {
      console.error("Email sign-up error:", error)
      throw new Error(`Sign up failed: ${error.message}`)
    }

    return data
  },

  // Traditional email/password sign in
  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Email sign-in error:", error)
      throw new Error(`Sign in failed: ${error.message}`)
    }

    return data
  },

  // Create or update user profile
  async upsertUserProfile(userId: string, profileData: any) {
    const { data, error } = await supabase
      .from("user_profiles")
      .upsert({
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Profile upsert error:", error)
      throw new Error(`Profile update failed: ${error.message}`)
    }

    return data
  },

  // Get user profile
  async getUserProfile(userId: string) {
    const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found"
      console.error("Get profile error:", error)
      return null
    }

    return data
  },
}

// Auth state change listener
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback)
}

// Check if we're in demo mode
export const isDemo = supabaseUrl === "https://demo.supabase.co"
