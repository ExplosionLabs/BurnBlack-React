import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/SupabaseAuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
}

const SupabaseProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // If auth is required but user is not authenticated, redirect to login
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If user is authenticated but trying to access auth pages, redirect to dashboard
  if (!requireAuth && user && (location.pathname === '/login' || location.pathname === '/register')) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default SupabaseProtectedRoute