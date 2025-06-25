import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { FormInput, FormCheck } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../../contexts/SupabaseAuthContext';
import { ValidationUtils } from '../../../utils/validation';
import { ErrorHandler } from '../../../utils/errorHandler';
import LoadingButton from '../../../components/Common/LoadingButton';

function SupabaseLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithEmail, signInWithGoogle, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    // Check for message from registration
    const urlParams = new URLSearchParams(location.search);
    const message = urlParams.get('message');
    if (message) {
      toast.info(decodeURIComponent(message));
    }
  }, [location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear validation error for the field being edited
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (error) clearError(); // Clear auth error when user starts typing
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const emailValidation = ValidationUtils.validateEmail(formData.email);
    const passwordValidation = formData.password ? { isValid: true } : { isValid: false, error: 'Password is required' };
    
    const newValidationErrors = {
      email: emailValidation.isValid ? '' : emailValidation.error || '',
      password: passwordValidation.isValid ? '' : passwordValidation.error || ''
    };
    
    setValidationErrors(newValidationErrors);
    
    // If validation fails, don't proceed
    if (!emailValidation.isValid || !passwordValidation.isValid) {
      toast.error('Please fix the validation errors');
      return;
    }

    try {
      const { data, error } = await signInWithEmail(formData.email, formData.password);
      
      if (error) {
        toast.error(error.message || 'Login failed');
        return;
      }

      if (data.user) {
        toast.success('Login successful!');
        navigate("/dashboard");
      }
    } catch (error) {
      ErrorHandler.handleAuthError(error, 'email_login');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await signInWithGoogle();
      
      if (error) {
        toast.error(error.message || 'Google login failed');
        return;
      }

      // The redirect will be handled by the OAuth flow
      // User will be redirected to /auth/callback and then to /fileITR
    } catch (error) {
      ErrorHandler.handleAuthError(error, 'google_login');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-xl">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </motion.div>

        <motion.form 
          className="mt-8 space-y-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleEmailLogin}
        >
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <FormInput
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`appearance-none relative block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                  validationErrors.email 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
                placeholder="Enter your email"
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <FormInput
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`appearance-none relative block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                  validationErrors.password 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
                placeholder="Enter your password"
              />
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <FormCheck.Input
              id="remember_me"
              name="remember_me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <FormCheck.Label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Remember me
            </FormCheck.Label>
            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              Forgot your password?
            </a>
          </div>

          <div className="space-y-4">
            <LoadingButton
              type="submit"
              loading={loading}
              loadingText="Signing in..."
              variant="primary"
              size="md"
              className="w-full"
            >
              Sign in
            </LoadingButton>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
              </div>
            </div>

            <LoadingButton
              type="button"
              onClick={handleGoogleLogin}
              loading={loading}
              loadingText="Connecting..."
              variant="secondary"
              size="md"
              className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </LoadingButton>
          </div>
        </motion.form>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Sign up now
          </motion.button>
        </p>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </motion.div>
  );
}

export default SupabaseLogin;