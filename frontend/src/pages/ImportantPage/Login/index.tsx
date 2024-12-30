import React, { useState } from 'react';
import ThemeSwitcher from "@/components/ThemeSwitcher";
import logoUrl from "@/assets/images/logo.svg";
import illustrationUrl from "@/assets/images/illustration.svg";
import { FormInput, FormCheck } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';
import { loginFailure, loginRequest, loginSuccess ,googleLoginRequest, googleLoginSuccess, googleLoginFailure} from '@/stores/userSlice';
import { loginUser,registerUserWithGoogle } from '@/api/userApi';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

function Main() {
  const navigate=useNavigate();
 
  const [formData, setFormData] = useState({

    email: '',
    password: '',

  });
  const dispatch = useDispatch();
  const {user, loading, error } = useSelector((state: RootState) => state.user);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

   

    const userData = {
      email: formData.email,
      password: formData.password,
    };

    dispatch(loginRequest());

    try {
      const response = await loginUser(userData);
      dispatch(loginSuccess(response));
      toast.success('Login successful!');
      navigate("/fileITR")
    } catch (error: any) {
      dispatch(loginFailure(error));
      alert('Login. Please try again.');
    }
  };
  function decodeJwt(token: string) {
    const base64Url = token.split('.')[1]; // Get the payload part of the JWT (the second part)
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // URL-safe base64
    const decoded = atob(base64); // Decode the Base64 string
    return JSON.parse(decoded); // Parse and return the JSON payload
  }
  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      alert('Google Sign-In failed! No credential received.');
      return;
    }

    dispatch(googleLoginRequest());
    try {
      const response = await registerUserWithGoogle({ token: credentialResponse.credential });
      dispatch(googleLoginSuccess(response));
      toast.success('Login successful!');
      setTimeout(() => {
        navigate("/fileITR");
      }, 2000);
    } catch (error) {
      console.error("Error during Google login:", error);
      dispatch(googleLoginFailure(error instanceof Error ? error.message : 'Unknown error'));
      alert('Google Sign-In failed!');
    }}
  const handleGoogleLoginFailure = () => {
    dispatch(googleLoginFailure('Google Sign-In was unsuccessful.'));
    alert('Google Sign-In failed!');
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
          
          <h2 className=" text-3xl font-extrabold text-gray-900 dark:text-white">
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
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Enter your email"
              />
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
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

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
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </motion.button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="relative flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginFailure}
                  useOneTap
                  type="standard"
                  theme="filled_black"
                  size="large"
                  shape="rectangular"
                  width="100%"
                />
              </div>
            </div>
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

export default Main;
