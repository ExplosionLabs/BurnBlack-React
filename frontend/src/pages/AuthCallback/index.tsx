import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          navigate('/login?error=' + encodeURIComponent(error.message))
          return
        }

        if (data.session) {
          // Successfully authenticated, redirect to dashboard
          console.log('User authenticated:', data.session.user)
          navigate('/dashboard')
        } else {
          // No session found, redirect to login
          navigate('/login')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        navigate('/login?error=' + encodeURIComponent('Authentication failed'))
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Completing authentication...</p>
      </div>
    </div>
  )
}

export default AuthCallback