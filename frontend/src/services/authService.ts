import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

// ... existing auth service functions ...

// Email verification functions
export const verifyEmail = async (token: string) => {
  const response = await axios.post(`${API_URL}/email-verification/verify`, { token });
  return response.data;
};

export const resendVerificationEmail = async () => {
  const response = await axios.post(`${API_URL}/email-verification/send`, {
    email: localStorage.getItem('userEmail') // Store this during registration
  });
  return response.data;
};

// Add email verification status check
export const checkEmailVerificationStatus = async () => {
  const response = await axios.get(`${API_URL}/auth/verification-status`);
  return response.data;
}; 