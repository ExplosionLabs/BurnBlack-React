import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { 
  supabase, 
  signInWithGoogle, 
  signInWithEmail, 
  signUpWithEmail, 
  signOut, 
  getCurrentUser,
  getSession,
  onAuthStateChange 
} from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
  signInWithGoogle: () => Promise<{ data: any; error: AuthError | null }>
  signInWithEmail: (email: string, password: string) => Promise<{ data: any; error: AuthError | null }>
  signUpWithEmail: (email: string, password: string, options?: { data?: { name?: string; phone?: string } }) => Promise<{ data: any; error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const SupabaseAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await getSession()
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error getting initial session:', error)
        setError('Failed to get initial session')
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // Handle specific auth events
      if (event === 'SIGNED_IN') {
        setError(null)
      } else if (event === 'SIGNED_OUT') {
        setError(null)
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignInWithGoogle = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await signInWithGoogle()
      if (result.error) {
        setError(result.error.message)
      }
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during Google sign in'
      setError(errorMessage)
      return { data: null, error: { message: errorMessage } as AuthError }
    } finally {
      setLoading(false)
    }
  }

  const handleSignInWithEmail = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await signInWithEmail(email, password)
      if (result.error) {
        setError(result.error.message)
      }
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during email sign in'
      setError(errorMessage)
      return { data: null, error: { message: errorMessage } as AuthError }
    } finally {
      setLoading(false)
    }
  }

  const handleSignUpWithEmail = async (email: string, password: string, options?: { data?: { name?: string; phone?: string } }) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await signUpWithEmail(email, password, options)
      if (result.error) {
        setError(result.error.message)
      }
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during email sign up'
      setError(errorMessage)
      return { data: null, error: { message: errorMessage } as AuthError }
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await signOut()
      if (result.error) {
        setError(result.error.message)
      }
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during sign out'
      setError(errorMessage)
      return { error: { message: errorMessage } as AuthError }
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    error,
    signInWithGoogle: handleSignInWithGoogle,
    signInWithEmail: handleSignInWithEmail,
    signUpWithEmail: handleSignUpWithEmail,
    signOut: handleSignOut,
    clearError,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default SupabaseAuthProvider