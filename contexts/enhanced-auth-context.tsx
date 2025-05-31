"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { authHelpers, onAuthStateChange, isDemo } from "@/lib/supabase-auth"

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
  isDemo: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>
  refreshProfile: () => Promise<void>
}

interface UserProfile {
  id: string
  full_name?: string
  email?: string
  optional_subject?: string
  home_state?: string
  educational_background?: string
  work_experience?: string
  current_affairs_level?: string
  avatar_url?: string
  provider?: string
  created_at?: string
  updated_at?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user for demo mode
const mockUser = {
  id: "demo-user-123",
  email: "demo@naukricoach.com",
  user_metadata: {
    name: "Demo User",
    full_name: "Demo User",
    avatar_url: "https://ui-avatars.io/api/?name=Demo+User&background=3b82f6&color=fff",
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  aud: "authenticated",
  role: "authenticated",
} as User

const mockProfile: UserProfile = {
  id: "demo-user-123",
  full_name: "Demo User",
  email: "demo@naukricoach.com",
  optional_subject: "Public Administration",
  home_state: "Delhi",
  educational_background: "B.Tech Computer Science",
  current_affairs_level: "Intermediate",
  provider: "demo",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export function EnhancedAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isDemo) {
      // In demo mode, simulate authentication
      setUser(mockUser)
      setProfile(mockProfile)
      setLoading(false)
      return
    }

    // Initialize auth state
    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)

      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await loadUserProfile(session.user.id)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const initializeAuth = async () => {
    try {
      const session = await authHelpers.getSession()
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await loadUserProfile(session.user.id)
      }
    } catch (err: any) {
      console.error("Auth initialization error:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadUserProfile = async (userId: string) => {
    try {
      let profile = await authHelpers.getUserProfile(userId)

      // If no profile exists, create one from user metadata
      if (!profile && user) {
        const metadata = user.user_metadata || {}
        const newProfile = {
          full_name: metadata.full_name || metadata.name || "",
          email: user.email || "",
          avatar_url: metadata.avatar_url || metadata.picture || "",
          provider: metadata.provider || "email",
        }

        profile = await authHelpers.upsertUserProfile(userId, newProfile)
      }

      setProfile(profile)
    } catch (err: any) {
      console.error("Profile loading error:", err)
      setError(err.message)
    }
  }

  const signInWithGoogle = async () => {
    if (isDemo) {
      setUser(mockUser)
      setProfile(mockProfile)
      return
    }

    try {
      setError(null)
      setLoading(true)
      await authHelpers.signInWithGoogle()
      // The auth state change listener will handle the rest
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    if (isDemo) {
      setUser(mockUser)
      setProfile(mockProfile)
      return
    }

    try {
      setError(null)
      setLoading(true)
      await authHelpers.signInWithEmail(email, password)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    if (isDemo) {
      setUser({
        ...mockUser,
        email,
        user_metadata: { name, full_name: name },
      })
      setProfile({
        ...mockProfile,
        email,
        full_name: name,
      })
      return
    }

    try {
      setError(null)
      setLoading(true)
      await authHelpers.signUpWithEmail(email, password, {
        full_name: name,
        name: name,
      })
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const signOut = async () => {
    if (isDemo) {
      setUser(null)
      setProfile(null)
      setSession(null)
      return
    }

    try {
      setError(null)
      await authHelpers.signOut()
      setUser(null)
      setProfile(null)
      setSession(null)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (isDemo) {
      setProfile((prev) => (prev ? { ...prev, ...profileData } : null))
      return
    }

    if (!user) {
      throw new Error("No user logged in")
    }

    try {
      setError(null)
      const updatedProfile = await authHelpers.upsertUserProfile(user.id, profileData)
      setProfile(updatedProfile)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const refreshProfile = async () => {
    if (user && !isDemo) {
      await loadUserProfile(user.id)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        error,
        isDemo,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useEnhancedAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useEnhancedAuth must be used within an EnhancedAuthProvider")
  }
  return context
}

// Backward compatibility
export const useAuth = useEnhancedAuth
