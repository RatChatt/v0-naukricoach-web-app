"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { getSupabaseClient, isDemo, isSupabaseConfigured } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  isDemo: boolean
  isConfigured: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  isGoogleAuthEnabled: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user for demo mode
const mockUser = {
  id: "demo-user-123",
  email: "demo@naukricoach.com",
  user_metadata: {
    name: "Demo User",
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  aud: "authenticated",
  role: "authenticated",
} as User

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isGoogleAuthEnabled, setIsGoogleAuthEnabled] = useState(false)
  const isConfigured = isSupabaseConfigured()

  useEffect(() => {
    if (isDemo) {
      // In demo mode, simulate authentication and enable Google auth
      setUser(mockUser)
      setIsGoogleAuthEnabled(true)
      setLoading(false)
      return
    }

    if (!isConfigured) {
      setLoading(false)
      setError("Supabase is not properly configured")
      return
    }

    try {
      const supabase = getSupabaseClient()

      // Check if Google auth is enabled
      setIsGoogleAuthEnabled(true) // Assume enabled if Supabase is configured

      // Get initial session
      supabase.auth
        .getSession()
        .then(({ data: { session } }) => {
          setUser(session?.user ?? null)
          setLoading(false)
        })
        .catch((err) => {
          console.error("Auth session error:", err)
          setError("Authentication service unavailable")
          setLoading(false)
        })

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })

      return () => subscription.unsubscribe()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }, [isConfigured])

  const signIn = async (email: string, password: string) => {
    if (isDemo) {
      // Demo mode - simulate successful login
      setUser(mockUser)
      return
    }

    if (!isConfigured) {
      throw new Error("Authentication is not configured. Please contact support.")
    }

    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, name: string) => {
    if (isDemo) {
      // Demo mode - simulate successful signup
      setUser({
        ...mockUser,
        email,
        user_metadata: { name },
      })
      return
    }

    if (!isConfigured) {
      throw new Error("Authentication is not configured. Please contact support.")
    }

    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
  }

  const signInWithGoogle = async () => {
    if (isDemo) {
      // Demo mode - simulate successful Google login
      setUser({
        ...mockUser,
        email: "demo.google@naukricoach.com",
        user_metadata: {
          name: "Demo Google User",
          avatar_url: "https://via.placeholder.com/40",
          provider: "google",
        },
      })
      return
    }

    if (!isConfigured) {
      throw new Error("Authentication is not configured. Please contact support.")
    }

    if (!isGoogleAuthEnabled) {
      throw new Error("Google authentication is not configured. Please use email/password login or contact support.")
    }

    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    })

    if (error) {
      if (error.message.includes("provider is not enabled")) {
        throw new Error("Google authentication is not configured. Please use email/password login or contact support.")
      }
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    if (isDemo) {
      // Demo mode - simulate password reset
      return
    }

    if (!isConfigured) {
      throw new Error("Authentication is not configured. Please contact support.")
    }

    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) throw error
  }

  const signOut = async () => {
    if (isDemo) {
      setUser(null)
      return
    }

    if (!isConfigured) {
      return
    }

    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isDemo,
        isConfigured,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        resetPassword,
        isGoogleAuthEnabled,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
