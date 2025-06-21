// src/pages/ImportantPage/Login/LoginPrisma.tsx
// Updated Login component for Prisma/PostgreSQL backend integration

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import clsx from 'clsx';

// Base Components
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { FormInput, FormCheck } from "@/components/Base/Form";
import Button from "@/components/Base/Button";

// Assets
import logoUrl from "@/assets/images/logo.svg";
import illustrationUrl from "@/assets/images/illustration.svg";

// Migration Config
import { MIGRATION_CONFIG, DataFormatUtils, MigrationLogger } from '@/config/migration';

// API and Store (dynamic imports based on migration config)
import { RootState } from '../../../stores/store';

// Types
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResponse {
  status: string;
  message?: string;
  data: {
    user: any;
    token: string;
  };
}

function LoginPrisma() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<LoginFormData>>({});
  
  // Dynamic API and store selection based on migration config
  const [authAPI, setAuthAPI] = useState<any>(null);
  const [userActions, setUserActions] = useState<any>(null);
  
  // Redux state (will work with both old and new slices)
  const userState = useSelector((state: RootState) => 
    MIGRATION_CONFIG.USE_PRISMA_USER_STORE ? 
      (state as any).userPrisma : 
      state.user
  );
  
  // Load appropriate API and actions based on migration config
  useEffect(() => {
    const loadServices = async () => {
      try {
        if (MIGRATION_CONFIG.USE_PRISMA_AUTH_API || MIGRATION_CONFIG.MIGRATION_MODE === 'PRISMA') {
          MigrationLogger.log('Loading Prisma Auth API');
          const authModule = await import('@/api/authApiPrisma');
          const storeModule = await import('@/stores/userSlicePrisma');
          setAuthAPI(authModule);
          setUserActions(storeModule);
        } else {
          MigrationLogger.log('Loading MongoDB Auth API');
          const authModule = await import('@/api/userApi');
          const storeModule = await import('@/stores/userSlice');
          setAuthAPI(authModule);
          setUserActions(storeModule);
        }
      } catch (error) {
        console.error('Failed to load auth services:', error);
        toast.error('Failed to initialize authentication');
      }
    };
    
    loadServices();
  }, []);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (userState?.user || userState?.isAuthenticated) {
      navigate('/fileITR');
    }
  }, [userState, navigate]);
  
  // Form validation
  const validateForm = (): boolean => {
    const errors: Partial<LoginFormData> = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name as keyof LoginFormData]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !authAPI || !userActions) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      MigrationLogger.log('Attempting login with:', { email: formData.email });
      
      let response: LoginResponse;
      
      if (MIGRATION_CONFIG.USE_PRISMA_AUTH_API || MIGRATION_CONFIG.MIGRATION_MODE === 'PRISMA') {
        // Use Prisma API
        response = await authAPI.loginUser({
          email: formData.email,
          password: formData.password
        });
        
        // Dispatch to Prisma store
        dispatch(userActions.loginUserAsync.fulfilled(response));
      } else {
        // Use MongoDB API
        const mongoResponse = await authAPI.loginUser({
          email: formData.email,
          password: formData.password
        });
        
        // Convert response format if needed
        const normalizedUser = DataFormatUtils.normalizeUser(mongoResponse.user || mongoResponse.data?.user);
        response = {
          status: 'success',
          data: {
            user: normalizedUser,
            token: mongoResponse.token || mongoResponse.data?.token
          }
        };
        
        // Dispatch to original store
        dispatch(userActions.loginSuccess(response.data));
      }
      
      MigrationLogger.log('Login successful:', response.data.user.email);
      toast.success('Login successful!');
      
      // Remember user if checkbox is checked
      if (formData.rememberMe) {
        localStorage.setItem('rememberUser', 'true');
      }
      
      // Navigate to dashboard
      navigate('/fileITR');
      
    } catch (error: any) {
      MigrationLogger.error('Login failed:', error);
      
      const errorMessage = error.message || error.response?.data?.message || 'Login failed';
      
      if (MIGRATION_CONFIG.USE_PRISMA_AUTH_API || MIGRATION_CONFIG.MIGRATION_MODE === 'PRISMA') {
        dispatch(userActions.loginUserAsync.rejected({ payload: errorMessage }));
      } else {
        dispatch(userActions.loginFailure(errorMessage));
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle Google OAuth
  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential || !authAPI || !userActions) {
      toast.error('Google authentication failed');
      return;
    }
    
    setIsLoading(true);
    
    try {
      MigrationLogger.log('Attempting Google login');
      
      let response: LoginResponse;
      
      if (MIGRATION_CONFIG.USE_PRISMA_AUTH_API || MIGRATION_CONFIG.MIGRATION_MODE === 'PRISMA') {
        // Use Prisma Google Auth
        response = await authAPI.googleAuth(credentialResponse.credential);
        dispatch(userActions.googleAuthAsync.fulfilled(response));
      } else {
        // Use MongoDB Google Auth
        const mongoResponse = await authAPI.registerUserWithGoogle({
          token: credentialResponse.credential
        });
        
        const normalizedUser = DataFormatUtils.normalizeUser(mongoResponse.user || mongoResponse.data?.user);
        response = {
          status: 'success',
          data: {
            user: normalizedUser,
            token: mongoResponse.token || mongoResponse.data?.token
          }
        };
        
        dispatch(userActions.googleLoginSuccess(response.data));
      }
      
      MigrationLogger.log('Google login successful:', response.data.user.email);
      toast.success('Google authentication successful!');
      navigate('/fileITR');
      
    } catch (error: any) {
      MigrationLogger.error('Google login failed:', error);
      
      const errorMessage = error.message || 'Google authentication failed';
      
      if (MIGRATION_CONFIG.USE_PRISMA_AUTH_API || MIGRATION_CONFIG.MIGRATION_MODE === 'PRISMA') {
        dispatch(userActions.googleAuthAsync.rejected({ payload: errorMessage }));
      } else {
        dispatch(userActions.googleLoginFailure(errorMessage));
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLoginError = () => {
    toast.error('Google authentication failed');
  };
  
  return (
    <>
      <div className="container">
        <div className="flex items-center justify-center w-full min-h-screen p-5 md:p-20">
          <div className="w-96 intro-y">
            {/* Theme Switcher */}
            <div className="flex justify-end mb-5">
              <ThemeSwitcher />
            </div>
            
            {/* Logo */}
            <img
              alt="BurnBlack"
              className="w-16 mx-auto"
              src={logoUrl}
            />
            
            {/* Title */}
            <div className="text-white text-3xl font-medium text-center mt-8">
              Sign In to BurnBlack
            </div>
            <div className="text-slate-400 text-center mt-2">
              Access your tax filing dashboard
            </div>
            
            {/* Migration Mode Indicator (dev only) */}
            {import.meta.env.DEV && (
              <div className="text-xs text-center mt-2 text-yellow-400">
                Mode: {MIGRATION_CONFIG.MIGRATION_MODE} 
                {MIGRATION_CONFIG.USE_PRISMA_AUTH_API && ' (Prisma API)'}
              </div>
            )}
            
            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="box px-5 py-8 mt-10 max-w-[450px] relative"
            >
              <form onSubmit={handleSubmit}>
                {/* Email Field */}
                <FormInput
                  type="email"
                  name="email"
                  className={clsx("block px-4 py-3", {
                    "border-red-500": formErrors.email
                  })}
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                {formErrors.email && (
                  <div className="text-red-500 text-sm mt-1">{formErrors.email}</div>
                )}
                
                {/* Password Field */}
                <FormInput
                  type="password"
                  name="password"
                  className={clsx("block px-4 py-3 mt-4", {
                    "border-red-500": formErrors.password
                  })}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                {formErrors.password && (
                  <div className="text-red-500 text-sm mt-1">{formErrors.password}</div>
                )}
                
                {/* Remember Me & Forgot Password */}
                <div className="flex text-slate-500 text-xs sm:text-sm mt-4">
                  <div className="flex items-center mr-auto">
                    <FormCheck.Input
                      id="remember-me"
                      name="rememberMe"
                      type="checkbox"
                      className="mr-2 border"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    <label
                      className="cursor-pointer select-none"
                      htmlFor="remember-me"
                    >
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="hover:text-primary"
                    onClick={() => navigate('/forgot-password')}
                  >
                    Forgot Password?
                  </button>
                </div>
                
                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3 mt-5"
                  disabled={isLoading || !authAPI}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing In...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
                
                {/* Error Display */}
                {userState?.error && (
                  <div className="text-red-500 text-sm text-center mt-3">
                    {userState.error}
                  </div>
                )}
              </form>
              
              {/* Divider */}
              <div className="intro-x text-slate-500 text-center my-6">
                <div className="relative">
                  <hr className="border-slate-300" />
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm">
                    OR
                  </span>
                </div>
              </div>
              
              {/* Google Login */}
              <div className="intro-x flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={handleGoogleLoginError}
                  useOneTap
                />
              </div>
              
              {/* Sign Up Link */}
              <div className="intro-x text-slate-500 text-center mt-6">
                Don't have an account?{' '}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => navigate('/register')}
                >
                  Sign up here
                </button>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Background Illustration */}
        <div
          className="intro-y fixed inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `url(${illustrationUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: -1
          }}
        />
      </div>
      
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default LoginPrisma;