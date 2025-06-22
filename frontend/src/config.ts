// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Feature Flags
export const FEATURES = {
  ENABLE_OCR: true,
  ENABLE_DOCUMENT_VERIFICATION: true,
  ENABLE_PAYMENT_GATEWAY: true,
  ENABLE_EMAIL_NOTIFICATIONS: true,
  ENABLE_SMS_NOTIFICATIONS: false
};

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  MAX_FILES_PER_UPLOAD: 5
};

// Pagination Configuration
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

// Session Configuration
export const SESSION = {
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  TOKEN_EXPIRY: 15 * 60 * 1000, // 15 minutes
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// Notification Configuration
export const NOTIFICATION = {
  AUTO_HIDE_DURATION: 5000, // 5 seconds
  MAX_VISIBLE: 3
};

// Document Configuration
export const DOCUMENT = {
  MAX_PREVIEW_SIZE: 5 * 1024 * 1024, // 5MB
  PREVIEW_FORMATS: ['pdf', 'jpg', 'jpeg', 'png'],
  EXPIRY_NOTIFICATION_DAYS: 30
};

// Payment Configuration
export const PAYMENT = {
  CURRENCY: 'INR',
  MIN_AMOUNT: 100,
  MAX_AMOUNT: 1000000,
  SUPPORTED_GATEWAYS: ['razorpay']
};

// Analytics Configuration
export const ANALYTICS = {
  ENABLED: true,
  TRACKING_ID: process.env.REACT_APP_GA_TRACKING_ID
};

// Theme Configuration
export const THEME = {
  PRIMARY_COLOR: '#1976d2',
  SECONDARY_COLOR: '#dc004e',
  ERROR_COLOR: '#f44336',
  WARNING_COLOR: '#ff9800',
  INFO_COLOR: '#2196f3',
  SUCCESS_COLOR: '#4caf50'
};

// Cache Configuration
export const CACHE = {
  ENABLED: true,
  TTL: 5 * 60 * 1000, // 5 minutes
  MAX_ITEMS: 100
};

// Security Configuration
export const SECURITY = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_SPECIAL: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_UPPERCASE: true,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000 // 15 minutes
};

// Export all configurations
export default {
  API_BASE_URL,
  FEATURES,
  UPLOAD_CONFIG,
  PAGINATION,
  SESSION,
  NOTIFICATION,
  DOCUMENT,
  PAYMENT,
  ANALYTICS,
  THEME,
  CACHE,
  SECURITY
}; 