// src/stores/userSlicePrisma.ts
// Updated Redux slice for Prisma/PostgreSQL user management

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '../api/authApiPrisma';
import { PrismaUser, AuthResponse } from '../api/authApiPrisma';

// State interface for Prisma user
interface UserState {
  user: PrismaUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  emailVerificationRequired: boolean;
}

// Initial state
const initialState: UserState = {
  user: authApi.getStoredUser(),
  loading: false,
  error: null,
  isAuthenticated: authApi.isAuthenticated(),
  emailVerificationRequired: false,
};

// ========================================
// ASYNC THUNKS
// ========================================

// Register user
export const registerUserAsync = createAsyncThunk(
  'user/register',
  async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: 'USER' | 'ADMIN';
  }, { rejectWithValue }) => {
    try {
      const response = await authApi.registerUser(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Login user
export const loginUserAsync = createAsyncThunk(
  'user/login',
  async (credentials: {
    email: string;
    password: string;
  }, { rejectWithValue }) => {
    try {
      const response = await authApi.loginUser(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Google OAuth
export const googleAuthAsync = createAsyncThunk(
  'user/googleAuth',
  async (idToken: string, { rejectWithValue }) => {
    try {
      const response = await authApi.googleAuth(idToken);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Google authentication failed');
    }
  }
);

// Get user profile
export const getUserProfileAsync = createAsyncThunk(
  'user/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getUserProfile();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

// Update user profile
export const updateUserProfileAsync = createAsyncThunk(
  'user/updateProfile',
  async (updateData: {
    name?: string;
    phone?: string;
    password?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await authApi.updateUserProfile(updateData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Profile update failed');
    }
  }
);

// Logout user
export const logoutUserAsync = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logoutUser();
      authApi.clearAuth();
      return true;
    } catch (error: any) {
      // Even if API call fails, clear local storage
      authApi.clearAuth();
      return true;
    }
  }
);

// Check authentication status
export const checkAuthAsync = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.checkAuthStatus();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Authentication check failed');
    }
  }
);

// Verify email
export const verifyEmailAsync = createAsyncThunk(
  'user/verifyEmail',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyEmail(token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Email verification failed');
    }
  }
);

// ========================================
// USER SLICE
// ========================================

const userSlicePrisma = createSlice({
  name: 'userPrisma',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear user data
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.emailVerificationRequired = false;
      authApi.clearAuth();
    },
    
    // Set email verification required
    setEmailVerificationRequired: (state, action: PayloadAction<boolean>) => {
      state.emailVerificationRequired = action.payload;
    },
    
    // Update user data locally
    updateUserLocal: (state, action: PayloadAction<Partial<PrismaUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    
    // Migrate user data from MongoDB format
    migrateUserData: (state, action: PayloadAction<any>) => {
      const convertedUser = authApi.convertUserFormat(action.payload);
      state.user = convertedUser;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(convertedUser));
    },
  },
  extraReducers: (builder) => {
    // Register user
    builder
      .addCase(registerUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
        state.emailVerificationRequired = !action.payload.data.user.emailVerified;
        
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(action.payload.data.user));
        localStorage.setItem('token', action.payload.data.token);
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Login user
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
        state.emailVerificationRequired = !action.payload.data.user.emailVerified;
        
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(action.payload.data.user));
        localStorage.setItem('token', action.payload.data.token);
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Google Auth
    builder
      .addCase(googleAuthAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleAuthAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
        state.emailVerificationRequired = false; // Google users are auto-verified
        
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(action.payload.data.user));
        localStorage.setItem('token', action.payload.data.token);
      })
      .addCase(googleAuthAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get user profile
    builder
      .addCase(getUserProfileAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.isAuthenticated = true;
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(action.payload.data));
      })
      .addCase(getUserProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update user profile
    builder
      .addCase(updateUserProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(action.payload.data));
      })
      .addCase(updateUserProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout user
    builder
      .addCase(logoutUserAsync.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.emailVerificationRequired = false;
      });

    // Check authentication
    builder
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        if (action.payload.data.authenticated) {
          state.user = action.payload.data.user;
          state.isAuthenticated = true;
          state.emailVerificationRequired = !action.payload.data.user.emailVerified;
        } else {
          state.user = null;
          state.isAuthenticated = false;
          authApi.clearAuth();
        }
      })
      .addCase(checkAuthAsync.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        authApi.clearAuth();
      });

    // Verify email
    builder
      .addCase(verifyEmailAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmailAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.emailVerificationRequired = false;
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(action.payload.data));
      })
      .addCase(verifyEmailAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  clearError,
  clearUser,
  setEmailVerificationRequired,
  updateUserLocal,
  migrateUserData,
} = userSlicePrisma.actions;

// Selectors
export const selectUser = (state: { userPrisma: UserState }) => state.userPrisma.user;
export const selectIsAuthenticated = (state: { userPrisma: UserState }) => state.userPrisma.isAuthenticated;
export const selectUserLoading = (state: { userPrisma: UserState }) => state.userPrisma.loading;
export const selectUserError = (state: { userPrisma: UserState }) => state.userPrisma.error;
export const selectEmailVerificationRequired = (state: { userPrisma: UserState }) => state.userPrisma.emailVerificationRequired;

// Export reducer
export default userSlicePrisma.reducer;