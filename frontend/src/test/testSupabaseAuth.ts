// Test script for Supabase authentication
// This file can be run in the browser console to test auth functionality

import { supabase } from '../lib/supabase'

export const testAuth = {
  // Test user registration with email verification
  async testRegistration() {
    const testEmail = `gautam31.hitesh+${Math.floor(Math.random() * 1000)}@gmail.com`
    const testPassword = 'TestPassword123!'
    
    console.log('Testing registration with email:', testEmail)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            name: 'Test User',
            phone: '+91 9876543210'
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        console.error('Registration error:', error)
        return { success: false, error: error.message }
      }
      
      console.log('Registration successful:', data)
      return { 
        success: true, 
        data, 
        message: `Registration successful! Check email ${testEmail} for verification.` 
      }
    } catch (error) {
      console.error('Registration exception:', error)
      return { success: false, error: 'Registration failed' }
    }
  },

  // Test Google OAuth
  async testGoogleAuth() {
    console.log('Testing Google OAuth...')
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        console.error('Google auth error:', error)
        return { success: false, error: error.message }
      }
      
      console.log('Google auth initiated:', data)
      return { success: true, data, message: 'Google auth initiated successfully' }
    } catch (error) {
      console.error('Google auth exception:', error)
      return { success: false, error: 'Google auth failed' }
    }
  },

  // Test session retrieval
  async testSession() {
    console.log('Testing session retrieval...')
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Session error:', error)
        return { success: false, error: error.message }
      }
      
      console.log('Current session:', session)
      return { 
        success: true, 
        session, 
        message: session ? 'User is logged in' : 'No active session' 
      }
    } catch (error) {
      console.error('Session exception:', error)
      return { success: false, error: 'Failed to get session' }
    }
  },

  // Test database connection
  async testDatabase() {
    console.log('Testing database connection...')
    
    try {
      // Try to fetch profiles (this will work even if empty due to RLS)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
      
      if (error) {
        console.error('Database error:', error)
        return { success: false, error: error.message }
      }
      
      console.log('Database connection successful:', data)
      return { success: true, data, message: 'Database connection working' }
    } catch (error) {
      console.error('Database exception:', error)
      return { success: false, error: 'Database connection failed' }
    }
  },

  // Run all tests
  async runAllTests() {
    console.log('=== Starting Supabase Authentication Tests ===')
    
    const results = {
      database: await this.testDatabase(),
      session: await this.testSession(),
      registration: await this.testRegistration(),
      // Note: Google auth can't be fully tested in console as it requires user interaction
    }
    
    console.log('=== Test Results ===')
    console.table(results)
    
    return results
  }
}

// Export for global access in browser console
if (typeof window !== 'undefined') {
  (window as any).testSupabaseAuth = testAuth
}

export default testAuth