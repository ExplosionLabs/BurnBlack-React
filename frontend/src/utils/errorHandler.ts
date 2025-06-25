import axios, { AxiosError } from 'axios';
import { useNotification } from '../contexts/NotificationContext';
import { toast } from 'react-toastify';

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

// Additional standardized error handlers
export const ErrorHandler = {
  // Standard error handling with toast notifications
  handle(error: unknown, context: { component: string; action: string }): void {
    console.error(`Error in ${context.component} - ${context.action}:`, error);
    
    let message = 'An unexpected error occurred';
    
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }
    
    toast.error(message);
  },

  // Auth-specific error handling
  handleAuthError(error: unknown, action: string): void {
    console.error(`Auth error - ${action}:`, error);
    
    let message = 'Authentication failed';
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        message = 'Invalid credentials. Please try again.';
      } else if (error.response?.status === 403) {
        message = 'Access denied. Please check your permissions.';
      } else {
        message = error.response?.data?.message || 'Authentication failed';
      }
    } else if (error instanceof Error) {
      message = error.message;
    }
    
    toast.error(message);
  },

  // Form validation error handling
  handleFormError(error: unknown, formName: string): void {
    console.error(`Form error - ${formName}:`, error);
    
    if (axios.isAxiosError(error) && error.response?.status === 422) {
      const data = error.response.data as ApiError;
      if (data.errors) {
        const errorMessages = Object.entries(data.errors)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
          .join('\n');
        toast.error(errorMessages);
        return;
      }
    }
    
    const message = error instanceof Error ? error.message : 'Form validation failed';
    toast.error(message);
  },

  // File operation error handling
  handleFileError(error: unknown, fileName: string, operation: string): void {
    console.error(`File error - ${operation} ${fileName}:`, error);
    
    let message = `Failed to ${operation} ${fileName}`;
    
    if (error instanceof Error) {
      message = error.message;
    }
    
    toast.error(message);
  },

  // API-specific error handling
  handleAPIError(error: unknown, endpoint: string, method: string): void {
    console.error(`API error - ${method} ${endpoint}:`, error);
    
    try {
      handleApiError(error);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('API request failed');
      }
    }
  },

  // Success message
  showSuccess(message: string): void {
    toast.success(message);
  },

  // Info message
  showInfo(message: string): void {
    toast.info(message);
  },

  // Warning message
  showWarning(message: string): void {
    toast.warning(message);
  }
};

// Export all error handling utilities
export default {
  handleApiError,
  useErrorHandler,
  isApiError,
  getErrorMessage,
  handleValidationError,
  ErrorHandler
}; 