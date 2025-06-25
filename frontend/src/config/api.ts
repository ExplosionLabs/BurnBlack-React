// Centralized API configuration
export const API_CONFIG = {
  // Backend base URL
  BASE_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001',
  
  // API endpoints
  ENDPOINTS: {
    AUTH: '/api/v1/auth',
    ITR: '/api/v1/itr',
    USERS: '/api/v1/users',
    ADMIN: '/api/v1/admin',
    INCOME: '/api/v1/income',
    TAX: '/api/v1/tax',
    DOCUMENTS: '/api/v1/documents',
    CALCULATE_INCOME: '/api/v1/calculateIncome',
    FILL_DETAIL: '/api/v1/fillDetail',
    SUREPASS: '/api/v1/surepass',
  },
  
  // External APIs
  EXTERNAL: {
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    SUREPASS_URL: import.meta.env.VITE_SUREPASS_API_URL,
    SUREPASS_KEY: import.meta.env.VITE_SUREPASS_API_KEY,
  },
  
  // Request configuration
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  
  // File upload limits
  FILE_CONFIG: {
    MAX_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760, // 10MB
    ALLOWED_TYPES: import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(',') || ['pdf', 'jpg', 'jpeg', 'png', 'xlsx', 'xls'],
  },
  
  // Environment checks
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
} as const;

// Helper functions
export const getFullApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export const getAuthHeaders = (includeAuth: boolean = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return headers;
};

export const validateEnvironment = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check required environment variables
  if (!API_CONFIG.BASE_URL) {
    errors.push('VITE_BACKEND_URL is not configured');
  }
  
  if (!API_CONFIG.EXTERNAL.SUPABASE_URL) {
    errors.push('VITE_SUPABASE_URL is not configured');
  }
  
  if (!API_CONFIG.EXTERNAL.SUPABASE_ANON_KEY) {
    errors.push('VITE_SUPABASE_ANON_KEY is not configured');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Axios instance configuration helper
export const createApiClient = () => {
  // This can be used with axios.create() to create a configured instance
  return {
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: getAuthHeaders(false), // Don't include auth by default
  };
};

export default API_CONFIG;