// src/contexts/AuthContextPrisma.tsx
// Updated AuthContext for Prisma/PostgreSQL backend integration

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import * as authApi from '../api/authApiPrisma';
import { PrismaUser } from '../api/authApiPrisma';
import { useNotification } from './NotificationContext';

interface AuthContextType {
  user: PrismaUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  emailVerificationRequired: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  googleAuth: (idToken: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  refreshUserData: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'USER' | 'ADMIN';
}

interface UpdateProfileData {
  name?: string;
  phone?: string;
  password?: string;
}

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProviderPrisma: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<PrismaUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emailVerificationRequired, setEmailVerificationRequired] = useState(false);
  const { showNotification } = useNotification();

  // Check if token is valid
  const isTokenValid = useCallback((token: string): boolean => {
    try {
      const decoded = jwtDecode(token) as TokenPayload;
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }, []);

  // Load user from stored data and validate token
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    const storedUser = authApi.getStoredUser();
    
    if (!token || !storedUser) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    // Check if token is still valid
    if (!isTokenValid(token)) {
      authApi.clearAuth();
      setUser(null);
      setIsLoading(false);
      showNotification('Session expired. Please login again.', 'error');
      return;
    }

    try {
      // Refresh user data from server
      const response = await authApi.getUserProfile();
      setUser(response.data);
      setEmailVerificationRequired(!response.data.emailVerified);
    } catch (error) {
      // If API call fails, use stored data but show warning
      console.warn('Failed to refresh user data, using stored data');
      setUser(storedUser);
      setEmailVerificationRequired(!storedUser.emailVerified);
    } finally {
      setIsLoading(false);
    }
  }, [isTokenValid, showNotification]);

  // Initialize auth state
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Set up automatic token expiry handling
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    try {
      const decoded = jwtDecode(token) as TokenPayload;
      const expiresIn = decoded.exp * 1000 - Date.now();
      
      // Clear auth 1 minute before expiry or when expired
      const expireTimeout = setTimeout(() => {
        authApi.clearAuth();
        setUser(null);
        showNotification('Session expired. Please login again.', 'error');
      }, Math.max(expiresIn - 60000, 0));

      return () => clearTimeout(expireTimeout);
    } catch (error) {
      console.error('Token parsing error:', error);
    }
  }, [user, showNotification]);

  // ========================================
  // AUTHENTICATION METHODS
  // ========================================

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.loginUser({ email, password });
      
      setUser(response.data.user);
      setEmailVerificationRequired(!response.data.user.emailVerified);
      
      showNotification('Login successful', 'success');
    } catch (error: any) {
      showNotification(error.message || 'Login failed', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await authApi.registerUser(userData);
      
      setUser(response.data.user);
      setEmailVerificationRequired(!response.data.user.emailVerified);
      
      if (!response.data.user.emailVerified) {
        showNotification('Registration successful. Please verify your email to continue.', 'success');
      } else {
        showNotification('Registration successful', 'success');
      }
    } catch (error: any) {
      showNotification(error.message || 'Registration failed', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleAuth = async (idToken: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.googleAuth(idToken);
      
      setUser(response.data.user);
      setEmailVerificationRequired(false); // Google users are auto-verified
      
      showNotification('Google authentication successful', 'success');
    } catch (error: any) {
      showNotification(error.message || 'Google authentication failed', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      authApi.logoutUser().catch(() => {
        // Ignore API errors on logout
      });
    } finally {
      authApi.clearAuth();
      setUser(null);
      setEmailVerificationRequired(false);
      showNotification('Logged out successfully', 'success');
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await authApi.forgotPassword(email);
      showNotification('Password reset instructions sent to your email', 'success');
    } catch (error: any) {
      showNotification(error.message || 'Failed to send reset instructions', 'error');
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      await authApi.resetPassword(token, password);
      showNotification('Password reset successful. Please login with your new password.', 'success');
    } catch (error: any) {
      showNotification(error.message || 'Password reset failed', 'error');
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      const response = await authApi.verifyEmail(token);
      setUser(response.data);
      setEmailVerificationRequired(false);
      showNotification('Email verified successfully', 'success');
    } catch (error: any) {
      showNotification(error.message || 'Email verification failed', 'error');
      throw error;
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      setIsLoading(true);
      const response = await authApi.updateUserProfile(data);
      
      setUser(response.data);
      showNotification('Profile updated successfully', 'success');
    } catch (error: any) {
      showNotification(error.message || 'Profile update failed', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      const response = await authApi.getUserProfile();
      setUser(response.data);
      setEmailVerificationRequired(!response.data.emailVerified);
    } catch (error: any) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await authApi.checkAuthStatus();
      if (response.data.authenticated) {
        setUser(response.data.user);
        setEmailVerificationRequired(!response.data.user.emailVerified);
      } else {
        setUser(null);
        setEmailVerificationRequired(false);
        authApi.clearAuth();
      }
    } catch (error) {
      setUser(null);
      setEmailVerificationRequired(false);
      authApi.clearAuth();
    }
  };

  // Context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    emailVerificationRequired,
    login,
    register,
    googleAuth,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    updateProfile,
    refreshUserData,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuthPrisma = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthPrisma must be used within an AuthProviderPrisma');
  }
  return context;
};

// Higher-order component for protected routes
export const withAuthPrisma = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const { isAuthenticated, isLoading } = useAuthPrisma();
    
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    if (!isAuthenticated) {
      // Redirect to login or show unauthorized message
      return <div>Please login to access this page</div>;
    }
    
    return <Component {...props} />;
  };
};

// Higher-order component for admin-only routes
export const withAdminAuthPrisma = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const { user, isAuthenticated, isLoading } = useAuthPrisma();
    
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      return <div>Admin access required</div>;
    }
    
    return <Component {...props} />;
  };
};

export default AuthContext;