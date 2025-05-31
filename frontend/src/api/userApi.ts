// src/api/userApi.ts
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const registerUser = async (userData: {
  name: string;
  phone: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/register`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);

    if (axios.isAxiosError(error)) {
      // Axios-specific error handling
      throw error.response ? error.response.data : 'Something went wrong';
    } else {
      // Non-Axios errors
      throw 'Something went wrong';
    }
  }
};

export const loginUser = async (userData: { email: string; password: string }) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/login`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);

    if (axios.isAxiosError(error)) {
      // Axios-specific error handling
      throw error.response ? error.response.data : 'Something went wrong';
    } else {
      // Non-Axios errors
      throw 'Something went wrong';
    }
  }
};

// export const sendPhoneOtp = (phoneNumber: string) => {
//   return axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/send-phone-otp`, { phoneNumber });
// };

// export const sendEmailOtp = (email: string) => {
//   return axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/send-email-otp`, { email });
// };

// export const verifyOtp = async (otp: string, type: string,identifier :string) => {
//   try {
//     const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/verify-otp`, { otp,type,identifier  });
//     return response.data.message === 'OTP verified. Proceed to register.';
//   } catch (error) {
//     return false;
//   }
// }

export const registerUserWithGoogle = async (data: any) => {
  const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/google-signup`, data);
  return response.data;
};

export const sendForgotPasswordOtp = async (email: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/auth/forgot-password`,
      { email }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response ? error.response.data : 'Something went wrong';
    } else {
      throw 'Something went wrong';
    }
  }
};

export const resetPasswordWithOtp = async (email: string, otp: string, newPassword: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/auth/reset-password`,
      { email, otp, newPassword }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response ? error.response.data : 'Something went wrong';
    } else {
      throw 'Something went wrong';
    }
  }
};