// src/api/authApiPrisma.ts
// Updated API layer for Prisma/PostgreSQL backend integration

import axios, { AxiosResponse } from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
const API_PREFIX = '/api/v1/auth'; // Updated to match Prisma routes

// Types for Prisma-based responses
export interface PrismaUser {
  id: string; // UUID instead of _id
  name: string;
  email: string;
  phone?: string;
  role: 'USER' | 'ADMIN'; // Enum values
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  message?: string;
  data: {
    user: PrismaUser;
    token: string;
  };
}

export interface ApiError {
  status: 'error';
  message: string;
  data?: any;
}

// Configure axios defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function for error handling
const handleApiError = (error: any): never => {
  console.error('API Error:', error);
  
  if (axios.isAxiosError(error)) {
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'Something went wrong';
    throw new Error(errorMessage);
  } else {
    throw new Error('Network error occurred');
  }
};

// ========================================
// AUTHENTICATION API FUNCTIONS
// ========================================

// User Registration
export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'USER' | 'ADMIN';
}): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await apiClient.post(
      `${API_PREFIX}/register`,
      userData
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// User Login
export const loginUser = async (credentials: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await apiClient.post(
      `${API_PREFIX}/login`,
      credentials
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Google OAuth Authentication
export const googleAuth = async (idToken: string): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await apiClient.post(
      `${API_PREFIX}/google`,
      { idToken }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get User Profile
export const getUserProfile = async (): Promise<{ status: string; data: PrismaUser }> => {
  try {
    const response = await apiClient.get(`${API_PREFIX}/me`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Update User Profile
export const updateUserProfile = async (updateData: {
  name?: string;
  phone?: string;
  password?: string;
}): Promise<{ status: string; data: PrismaUser; message: string }> => {
  try {
    const response = await apiClient.put(`${API_PREFIX}/profile`, updateData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Logout User
export const logoutUser = async (): Promise<{ status: string; message: string }> => {
  try {
    const response = await apiClient.post(`${API_PREFIX}/logout`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Check Authentication Status
export const checkAuthStatus = async (): Promise<{ 
  status: string; 
  data: { authenticated: boolean; user: PrismaUser } 
}> => {
  try {
    const response = await apiClient.get(`${API_PREFIX}/check`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// ========================================
// PASSWORD MANAGEMENT
// ========================================

// Forgot Password
export const forgotPassword = async (email: string): Promise<{ 
  status: string; 
  message: string; 
  resetToken?: string; // Remove in production
}> => {
  try {
    const response = await apiClient.post(`${API_PREFIX}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Reset Password
export const resetPassword = async (
  token: string, 
  newPassword: string
): Promise<{ status: string; message: string; data: PrismaUser }> => {
  try {
    const response = await apiClient.post(`${API_PREFIX}/reset-password`, {
      token,
      newPassword
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// ========================================
// EMAIL VERIFICATION
// ========================================

// Verify Email
export const verifyEmail = async (token: string): Promise<{ 
  status: string; 
  message: string; 
  data: PrismaUser 
}> => {
  try {
    const response = await apiClient.get(`${API_PREFIX}/verify-email/${token}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// ========================================
// ADMIN FUNCTIONS
// ========================================

// Get All Users (Admin only)
export const getAllUsers = async (
  page: number = 1, 
  limit: number = 10
): Promise<{
  status: string;
  data: {
    users: PrismaUser[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}> => {
  try {
    const response = await apiClient.get(`${API_PREFIX}/users`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Delete User (Admin only)
export const deleteUser = async (userId: string): Promise<{ 
  status: string; 
  message: string; 
  data: PrismaUser 
}> => {
  try {
    const response = await apiClient.delete(`${API_PREFIX}/users/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// Get stored user data
export const getStoredUser = (): PrismaUser | null => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

// Clear authentication data
export const clearAuth = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Convert MongoDB user to Prisma user format (for migration compatibility)
export const convertUserFormat = (mongoUser: any): PrismaUser => {
  return {
    id: mongoUser._id || mongoUser.id,
    name: mongoUser.name,
    email: mongoUser.email,
    phone: mongoUser.phone,
    role: mongoUser.role === 'admin' ? 'ADMIN' : 'USER',
    emailVerified: mongoUser.emailVerified || false,
    createdAt: mongoUser.createdAt,
    updatedAt: mongoUser.updatedAt
  };
};

export default {
  registerUser,
  loginUser,
  googleAuth,
  getUserProfile,
  updateUserProfile,
  logoutUser,
  checkAuthStatus,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getAllUsers,
  deleteUser,
  isAuthenticated,
  getStoredUser,
  clearAuth,
  convertUserFormat
};