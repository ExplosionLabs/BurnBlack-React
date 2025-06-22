// Surepass API Integration for BurnBlack Smart ITR Flow
// Comprehensive API client for all Surepass verification services

import axios from 'axios';

const SUREPASS_BASE_URL = 'https://kyc-api.surepass.io';
const SUREPASS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTczNTE5NTQyNSwianRpIjoiMTk3NDVmZTktMzVlZS00N2ZmLTk4ODMtMDAxZWNhMTVmNGNmIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmNvbXBsaWFuY2VlYXN5QHN1cmVwYXNzLmlvIiwibmJmIjoxNzM1MTk1NDI1LCJleHAiOjIzNjU5MTU0MjUsImVtYWlsIjoiY29tcGxpYW5jZWVhc3lAc3VyZXBhc3MuaW8iLCJ0ZW5hbnRfaWQiOiJtYWluIiwidXNlcl9jbGFpbXMiOnsic2NvcGVzIjpbInVzZXIiXX19.V7aJ6Z1L7xpu1CqLTHdDR6SNOT7bo3NzSL7ZQk1T-mE';

// Create axios instance with default config
const surepassAPI = axios.create({
  baseURL: SUREPASS_BASE_URL,
  headers: {
    'Authorization': `Bearer ${SUREPASS_TOKEN}`,
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 seconds timeout
});

// Response interfaces
interface SurepassResponse<T> {
  status_code: number;
  message: string;
  success: boolean;
  data: T;
}

interface PANDetails {
  pan: string;
  name: string;
  category: string;
  status: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  father_name?: string;
  date_of_birth?: string;
}

interface AadhaarDetails {
  aadhaar: string;
  name: string;
  gender: string;
  date_of_birth: string;
  father_name?: string;
  address: {
    house: string;
    street: string;
    landmark: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
  };
}

interface BankDetails {
  account_number: string;
  ifsc: string;
  bank_name: string;
  branch_name: string;
  account_type: string;
  account_status: string;
  name_at_bank: string;
}

interface OCRResult {
  pan?: string;
  name?: string;
  father_name?: string;
  date_of_birth?: string;
  [key: string]: any;
}

export class SurepassService {
  
  // ====================================
  // PAN VERIFICATION SERVICES
  // ====================================
  
  /**
   * Verify PAN and get personal details
   */
  static async verifyPAN(pan: string): Promise<PANDetails> {
    try {
      const response = await surepassAPI.post<SurepassResponse<PANDetails>>('/api/v1/pan-verify', {
        id_number: pan.toUpperCase()
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'PAN verification failed');
      }
    } catch (error: any) {
      console.error('PAN Verification Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to verify PAN');
    }
  }

  /**
   * Get PAN holder name details
   */
  static async getPANName(pan: string): Promise<{ name: string; category: string }> {
    try {
      const response = await surepassAPI.post('/api/v1/pan-name', {
        id_number: pan.toUpperCase()
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'PAN name fetch failed');
      }
    } catch (error: any) {
      console.error('PAN Name Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get PAN name');
    }
  }

  /**
   * Extract PAN details from uploaded image using OCR
   */
  static async extractPANFromImage(imageFile: File): Promise<OCRResult> {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await surepassAPI.post('/api/v1/ocr-pan', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'PAN OCR failed');
      }
    } catch (error: any) {
      console.error('PAN OCR Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to extract PAN from image');
    }
  }

  // ====================================
  // AADHAAR VERIFICATION SERVICES
  // ====================================
  
  /**
   * Validate Aadhaar number
   */
  static async validateAadhaar(aadhaar: string): Promise<boolean> {
    try {
      const response = await surepassAPI.post('/api/v1/aadhaar-validation', {
        id_number: aadhaar.replace(/\s/g, '') // Remove spaces
      });
      
      return response.data.success;
    } catch (error: any) {
      console.error('Aadhaar Validation Error:', error);
      return false;
    }
  }

  /**
   * Extract Aadhaar details from uploaded image using OCR
   */
  static async extractAadhaarFromImage(imageFile: File): Promise<AadhaarDetails> {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await surepassAPI.post('/api/v1/ocr-aadhaar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Aadhaar OCR failed');
      }
    } catch (error: any) {
      console.error('Aadhaar OCR Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to extract Aadhaar from image');
    }
  }

  /**
   * Check if PAN and Aadhaar are linked
   */
  static async checkPANAadhaarLink(pan: string, aadhaar: string): Promise<boolean> {
    try {
      const response = await surepassAPI.post('/api/v1/pan-aadhaar-link-check', {
        pan: pan.toUpperCase(),
        aadhaar: aadhaar.replace(/\s/g, '')
      });
      
      return response.data.success && response.data.data.linked;
    } catch (error: any) {
      console.error('PAN-Aadhaar Link Check Error:', error);
      return false;
    }
  }

  // ====================================
  // BANK VERIFICATION SERVICES
  // ====================================
  
  /**
   * Verify bank account details
   */
  static async verifyBankAccount(accountNumber: string, ifsc: string): Promise<BankDetails> {
    try {
      const response = await surepassAPI.post<SurepassResponse<BankDetails>>('/api/v1/bank-verification', {
        account_number: accountNumber,
        ifsc: ifsc.toUpperCase()
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Bank verification failed');
      }
    } catch (error: any) {
      console.error('Bank Verification Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to verify bank account');
    }
  }

  // ====================================
  // DOCUMENT OCR SERVICES
  // ====================================
  
  /**
   * Extract ITR/Form 16 data from uploaded document
   */
  static async extractITRData(documentFile: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', documentFile);

      const response = await surepassAPI.post('/api/v1/ocr-itr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'ITR OCR failed');
      }
    } catch (error: any) {
      console.error('ITR OCR Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to extract ITR data');
    }
  }

  /**
   * Extract driving license data (for additional verification)
   */
  static async extractDrivingLicenseData(imageFile: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await surepassAPI.post('/api/v1/ocr-license', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'License OCR failed');
      }
    } catch (error: any) {
      console.error('License OCR Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to extract license data');
    }
  }

  // ====================================
  // ITR COMPLIANCE & DATA SERVICES
  // ====================================
  
  /**
   * Check ITR compliance status
   */
  static async checkITRCompliance(pan: string, assessmentYear: string): Promise<any> {
    try {
      const response = await surepassAPI.post('/api/v1/itr-compliance', {
        pan: pan.toUpperCase(),
        assessment_year: assessmentYear
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'ITR compliance check failed');
      }
    } catch (error: any) {
      console.error('ITR Compliance Check Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to check ITR compliance');
    }
  }

  /**
   * Get GSTIN by PAN (for business users)
   */
  static async getGSTINByPAN(pan: string): Promise<any[]> {
    try {
      const response = await surepassAPI.post('/api/v1/corporate-gstin-by-pan', {
        pan: pan.toUpperCase()
      });
      
      if (response.data.success) {
        return response.data.data || [];
      } else {
        return [];
      }
    } catch (error: any) {
      console.error('GSTIN by PAN Error:', error);
      return [];
    }
  }

  // ====================================
  // UTILITY FUNCTIONS
  // ====================================
  
  /**
   * Match names for verification
   */
  static async matchNames(name1: string, name2: string): Promise<{ match: boolean; score: number }> {
    try {
      const response = await surepassAPI.post('/api/v1/name-match', {
        name1: name1.trim(),
        name2: name2.trim()
      });
      
      if (response.data.success) {
        return {
          match: response.data.data.match,
          score: response.data.data.score
        };
      } else {
        return { match: false, score: 0 };
      }
    } catch (error: any) {
      console.error('Name Match Error:', error);
      return { match: false, score: 0 };
    }
  }

  /**
   * Face matching for additional security
   */
  static async faceMatch(image1: File, image2: File): Promise<{ match: boolean; confidence: number }> {
    try {
      const formData = new FormData();
      formData.append('image1', image1);
      formData.append('image2', image2);

      const response = await surepassAPI.post('/api/v1/face-match', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        return {
          match: response.data.data.match,
          confidence: response.data.data.confidence
        };
      } else {
        return { match: false, confidence: 0 };
      }
    } catch (error: any) {
      console.error('Face Match Error:', error);
      return { match: false, confidence: 0 };
    }
  }

  // ====================================
  // ERROR HANDLING & RETRY LOGIC
  // ====================================
  
  /**
   * Retry failed API calls with exponential backoff
   */
  static async retryAPI<T>(
    apiCall: () => Promise<T>, 
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error: any) {
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        console.log(`Retrying API call, attempt ${attempt + 1}/${maxRetries}`);
      }
    }
    
    throw new Error('Max retries exceeded');
  }

  /**
   * Health check for Surepass API
   */
  static async healthCheck(): Promise<boolean> {
    try {
      // Use a simple PAN validation as health check
      const response = await surepassAPI.post('/api/v1/pan-verify', {
        id_number: 'ABCDE1234F' // Test PAN
      });
      
      return response.status === 200;
    } catch (error) {
      console.error('Surepass API Health Check Failed:', error);
      return false;
    }
  }
}

// Export commonly used functions
export const {
  verifyPAN,
  getPANName,
  extractPANFromImage,
  validateAadhaar,
  extractAadhaarFromImage,
  checkPANAadhaarLink,
  verifyBankAccount,
  extractITRData,
  checkITRCompliance,
  getGSTINByPAN,
  matchNames,
  retryAPI,
  healthCheck
} = SurepassService;

export default SurepassService;