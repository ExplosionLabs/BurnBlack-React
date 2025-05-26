import axios, { AxiosError } from 'axios';
import { useNotification } from '../contexts/NotificationContext';

interface ApiError {
  statusCode: number;
  message: string;
  errors?: any[];
}

export const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    
    // Handle network errors
    if (!axiosError.response) {
      throw new Error('Network error. Please check your internet connection.');
    }

    const { status, data } = axiosError.response;

    // Handle specific HTTP status codes
    switch (status) {
      case 400:
        throw new Error(data.message || 'Bad request');
      case 401:
        // Handle unauthorized access
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      case 403:
        throw new Error('You do not have permission to perform this action');
      case 404:
        throw new Error('Resource not found');
      case 409:
        throw new Error(data.message || 'Conflict with current state');
      case 422:
        // Handle validation errors
        if (data.errors) {
          const errorMessage = Object.entries(data.errors)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
            .join('\n');
          throw new Error(errorMessage);
        }
        throw new Error(data.message || 'Validation failed');
      case 429:
        throw new Error('Too many requests. Please try again later.');
      case 500:
        throw new Error('Internal server error. Please try again later.');
      default:
        throw new Error(data.message || 'An unexpected error occurred');
    }
  }

  // Handle non-Axios errors
  if (error instanceof Error) {
    throw error;
  }

  // Handle unknown errors
  throw new Error('An unexpected error occurred');
};

// Hook for handling errors with notifications
export const useErrorHandler = () => {
  const { showNotification } = useNotification();

  const handleError = (error: unknown) => {
    try {
      handleApiError(error);
    } catch (err) {
      if (err instanceof Error) {
        showNotification(err.message, 'error');
      } else {
        showNotification('An unexpected error occurred', 'error');
      }
      throw err;
    }
  };

  return { handleError };
};

// Utility function to check if error is an API error
export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    'message' in error
  );
};

// Utility function to get error message
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (isApiError(error)) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Utility function to handle form validation errors
export const handleValidationError = (error: unknown): Record<string, string> => {
  if (axios.isAxiosError(error) && error.response?.status === 422) {
    const data = error.response.data as ApiError;
    if (data.errors) {
      return Object.entries(data.errors).reduce(
        (acc, [field, messages]) => ({
          ...acc,
          [field]: (messages as string[]).join(', ')
        }),
        {}
      );
    }
  }
  return {};
};

// Export all error handling utilities
export default {
  handleApiError,
  useErrorHandler,
  isApiError,
  getErrorMessage,
  handleValidationError
}; 