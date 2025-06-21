import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import { verifyEmail, resendVerificationEmail } from '../services/authService';

const EmailVerification: React.FC = () => {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'idle'>('idle');
  const [message, setMessage] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Get token from URL
  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    if (token) {
      verifyEmailToken();
    }
  }, [token]);

  // Handle cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const verifyEmailToken = async () => {
    try {
      setStatus('verifying');
      const response = await verifyEmail(token!);
      setStatus('success');
      setMessage('Email verified successfully! Redirecting to login...');
      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Failed to verify email');
    }
  };

  const handleResendVerification = async () => {
    try {
      setStatus('verifying');
      const response = await resendVerificationEmail();
      setStatus('success');
      setMessage('Verification email sent! Please check your inbox.');
      setCooldown(60); // 1 minute cooldown
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Failed to resend verification email');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" gutterBottom>
          Email Verification
        </Typography>

        {status === 'verifying' && (
          <Box sx={{ my: 3 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>
              Verifying your email...
            </Typography>
          </Box>
        )}

        {status === 'success' && (
          <Alert severity="success" sx={{ my: 2 }}>
            {message}
          </Alert>
        )}

        {status === 'error' && (
          <>
            <Alert severity="error" sx={{ my: 2 }}>
              {message}
            </Alert>
            <Button
              variant="contained"
              onClick={handleResendVerification}
              disabled={cooldown > 0}
              sx={{ mt: 2 }}
            >
              {cooldown > 0 
                ? `Resend in ${cooldown}s` 
                : 'Resend Verification Email'}
            </Button>
          </>
        )}

        {!token && (
          <Alert severity="info" sx={{ my: 2 }}>
            No verification token found. Please check your email for the verification link.
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default EmailVerification; 