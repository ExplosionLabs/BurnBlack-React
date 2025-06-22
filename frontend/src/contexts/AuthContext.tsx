import React from 'react';

const { createContext, useContext, useState, useEffect, useCallback } = React;
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { API_BASE_URL, SESSION } from '../config';
import { useNotification } from './NotificationContext';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isEmailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();

  const api = axios.create({
    baseURL: `${API_BASE_URL}/auth`,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add auth token to requests
  const setAuthToken = useCallback((token: string | null) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem(SESSION.TOKEN_KEY, token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem(SESSION.TOKEN_KEY);
    }
  }, []);

  // Load user from token
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem(SESSION.TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setAuthToken(token);
      const decoded = jwtDecode(token) as any;
      
      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        setAuthToken(null);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Get user data
      const response = await api.get('/me');
      setUser(response.data);
    } catch (error) {
      setAuthToken(null);
      setUser(null);
      showNotification('Session expired. Please login again.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [setAuthToken, showNotification]);

  // Initialize auth state
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Set up token refresh
  useEffect(() => {
    const token = localStorage.getItem(SESSION.TOKEN_KEY);
    if (!token) return;

    const decoded = jwtDecode(token) as any;
    const expiresIn = decoded.exp * 1000 - Date.now();
    
    // Refresh token 1 minute before expiry
    const refreshTimeout = setTimeout(() => {
      refreshToken();
    }, expiresIn - 60000);

    return () => clearTimeout(refreshTimeout);
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/login', { email, password });
      const { token, refreshToken } = response.data;
      
      setAuthToken(token);
      localStorage.setItem(SESSION.REFRESH_TOKEN_KEY, refreshToken);
      
      await loadUser();
      showNotification('Login successful', 'success');
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Login failed', 'error');
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      await api.post('/register', userData);
      showNotification('Registration successful. Please verify your email.', 'success');
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Registration failed', 'error');
      throw error;
    }
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem(SESSION.REFRESH_TOKEN_KEY);
    setUser(null);
    showNotification('Logged out successfully', 'success');
  };

  const forgotPassword = async (email: string) => {
    try {
      await api.post('/forgot-password', { email });
      showNotification('Password reset instructions sent to your email', 'success');
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to send reset instructions', 'error');
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      await api.post('/reset-password', { token, password });
      showNotification('Password reset successful. Please login with your new password.', 'success');
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Password reset failed', 'error');
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      await api.post('/verify-email', { token });
      showNotification('Email verified successfully', 'success');
      if (user) {
        setUser({ ...user, isEmailVerified: true });
      }
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Email verification failed', 'error');
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem(SESSION.REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/refresh-token', { refreshToken });
      const { token, newRefreshToken } = response.data;
      
      setAuthToken(token);
      localStorage.setItem(SESSION.REFRESH_TOKEN_KEY, newRefreshToken);
      
      await loadUser();
    } catch (error) {
      setAuthToken(null);
      localStorage.removeItem(SESSION.REFRESH_TOKEN_KEY);
      setUser(null);
      showNotification('Session expired. Please login again.', 'error');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        refreshToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 