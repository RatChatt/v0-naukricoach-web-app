// Re-export useAuth from the auth context for consistency
export { useAuth } from "@/contexts/auth-context"
export type { AuthContextType } from "@/contexts/auth-context"

// Additional auth-related types
export interface AuthError {
  message: string
  code?: string
}

export interface AuthState {
  user: any
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}
