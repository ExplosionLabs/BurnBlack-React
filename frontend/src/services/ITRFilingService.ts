// Real ITR Filing Service - replaces simulation
import { ITRJSONGenerator, ITRData } from './ITRJSONGenerator';
import { ValidationUtils } from '../utils/validation';
import { ErrorHandler } from '../utils/errorHandler';

export interface ITRFilingResult {
  acknowledgmentNumber: string;
  filingDate: string;
  assessmentYear: string;
  itrType: string;
  refundAmount: number;
  status: 'Filed Successfully' | 'Processing' | 'Verified' | 'Error';
  processingTime: string;
  downloadLinks: {
    acknowledgment: string;
    itrXML: string;
    taxComputationSheet: string;
  };
}

export interface FilingProgress {
  stage: 'uploading' | 'processing' | 'validating' | 'filing' | 'completed' | 'error';
  progress: number;
  message: string;
  estimatedTime?: string;
}

export class ITRFilingService {
  private static readonly API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
  private static readonly ITR_ENDPOINT = '/api/v1/itr';
  private static readonly TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

  static async fileITR(
    itrData: ITRData,
    onProgress: (progress: FilingProgress) => void
  ): Promise<ITRFilingResult> {
    try {
      // Stage 1: Validate data
      onProgress({
        stage: 'uploading',
        progress: 10,
        message: 'Validating ITR data...',
        estimatedTime: '30 seconds'
      });

      const validation = this.validateITRData(itrData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Stage 2: Generate JSON
      onProgress({
        stage: 'processing',
        progress: 30,
        message: 'Generating ITR JSON...',
        estimatedTime: '1 minute'
      });

      const itrJSON = ITRJSONGenerator.generateComprehensiveJSON(itrData);

      // Stage 3: Upload to ITR portal
      onProgress({
        stage: 'uploading',
        progress: 50,
        message: 'Uploading to Income Tax Portal...',
        estimatedTime: '2 minutes'
      });

      const uploadResult = await this.uploadToITRPortal(itrJSON, itrData);

      // Stage 4: Validate with IT Department
      onProgress({
        stage: 'validating',
        progress: 70,
        message: 'Validating with IT Department...',
        estimatedTime: '1 minute'
      });

      const validationResult = await this.validateWithITDepartment(uploadResult.transactionId);

      // Stage 5: Final submission
      onProgress({
        stage: 'filing',
        progress: 90,
        message: 'Filing ITR with Income Tax Department...',
        estimatedTime: '30 seconds'
      });

      const filingResult = await this.submitToITDepartment(validationResult.validationId);

      // Stage 6: Generate documents
      onProgress({
        stage: 'completed',
        progress: 100,
        message: 'ITR filed successfully! Generating documents...',
        estimatedTime: 'Complete'
      });

      const documents = await this.generateDocuments(filingResult.acknowledgmentNumber);

      return {
        acknowledgmentNumber: filingResult.acknowledgmentNumber,
        filingDate: filingResult.filingDate,
        assessmentYear: itrData.assessmentYear,
        itrType: filingResult.itrType,
        refundAmount: filingResult.refundAmount,
        status: 'Filed Successfully',
        processingTime: filingResult.processingTime,
        downloadLinks: documents
      };

    } catch (error) {
      onProgress({
        stage: 'error',
        progress: 0,
        message: `Filing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      throw error;
    }
  }

  private static validateITRData(itrData: ITRData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate personal details
    const personalValidation = ValidationUtils.validatePersonalDetails(itrData.personalDetails);
    if (!personalValidation.isValid) {
      errors.push(...Object.values(personalValidation.errors));
    }

    // Validate required income data
    if (!itrData.incomeDetails || Object.keys(itrData.incomeDetails).length === 0) {
      errors.push('At least one income source is required');
    }

    // Validate tax calculation
    if (!itrData.taxCalculation.grossTotalIncome || itrData.taxCalculation.grossTotalIncome <= 0) {
      errors.push('Gross total income must be greater than zero');
    }

    // Validate ITR type
    if (!itrData.itrType) {
      errors.push('ITR type must be determined');
    }

    // Validate assessment year
    if (!itrData.assessmentYear) {
      errors.push('Assessment year is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private static async uploadToITRPortal(itrJSON: object, itrData: ITRData): Promise<{ transactionId: string }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.API_BASE_URL}${this.ITR_ENDPOINT}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          itrData: itrJSON,
          personalDetails: itrData.personalDetails,
          assessmentYear: itrData.assessmentYear,
          itrType: itrData.itrType
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Upload timeout - please try again');
      }
      throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Network error'}`);
    }
  }

  private static async validateWithITDepartment(transactionId: string): Promise<{ validationId: string }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.API_BASE_URL}${this.ITR_ENDPOINT}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({ transactionId }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Validation failed with status ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Validation timeout - please try again');
      }
      throw new Error(`Validation failed: ${error instanceof Error ? error.message : 'Network error'}`);
    }
  }

  private static async submitToITDepartment(validationId: string): Promise<{
    acknowledgmentNumber: string;
    filingDate: string;
    itrType: string;
    refundAmount: number;
    processingTime: string;
  }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.API_BASE_URL}${this.ITR_ENDPOINT}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({ validationId }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Submission failed with status ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Submission timeout - please try again');
      }
      throw new Error(`Submission failed: ${error instanceof Error ? error.message : 'Network error'}`);
    }
  }

  private static async generateDocuments(acknowledgmentNumber: string): Promise<{
    acknowledgment: string;
    itrXML: string;
    taxComputationSheet: string;
  }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.API_BASE_URL}${this.ITR_ENDPOINT}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({ acknowledgmentNumber }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Document generation failed with status ${response.status}`);
      }

      const result = await response.json();
      return result.downloadLinks;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Document generation timeout - please try again');
      }
      throw new Error(`Document generation failed: ${error instanceof Error ? error.message : 'Network error'}`);
    }
  }

  // Fallback method for development/testing when API is not available
  static async fileITRFallback(
    itrData: ITRData,
    onProgress: (progress: FilingProgress) => void
  ): Promise<ITRFilingResult> {
    console.warn('Using fallback ITR filing - for development only. Backend API not available.');

    const stages: FilingProgress[] = [
      {
        stage: 'uploading',
        progress: 20,
        message: 'Validating ITR data...',
        estimatedTime: '30 seconds'
      },
      {
        stage: 'processing',
        progress: 40,
        message: 'Processing tax calculations...',
        estimatedTime: '1 minute'
      },
      {
        stage: 'validating',
        progress: 60,
        message: 'Validating against IT schemas...',
        estimatedTime: '45 seconds'
      },
      {
        stage: 'filing',
        progress: 80,
        message: 'Submitting to test environment...',
        estimatedTime: '30 seconds'
      },
      {
        stage: 'completed',
        progress: 100,
        message: 'Test filing completed successfully!',
        estimatedTime: 'Complete'
      }
    ];

    // Validate data first
    const validation = this.validateITRData(itrData);
    if (!validation.isValid) {
      onProgress({
        stage: 'error',
        progress: 0,
        message: `Validation failed: ${validation.errors.join(', ')}`
      });
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    for (let i = 0; i < stages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onProgress(stages[i]);
    }

    // Generate test result
    const refundAmount = Math.max(0, itrData.taxCalculation.refundOrDemand || 0);
    return {
      acknowledgmentNumber: `TEST-${Date.now()}-${itrData.personalDetails.pan?.replace(/\s/g, '')?.slice(-4) || 'XXXX'}`,
      filingDate: new Date().toLocaleDateString('en-IN'),
      assessmentYear: itrData.assessmentYear || '2024-25',
      itrType: itrData.itrType || 'ITR-1',
      refundAmount: refundAmount,
      status: 'Filed Successfully',
      processingTime: '2 minutes 30 seconds',
      downloadLinks: {
        acknowledgment: `/api/downloads/test-acknowledgment.pdf`,
        itrXML: `/api/downloads/test-itr.xml`,
        taxComputationSheet: `/api/downloads/test-computation.pdf`
      }
    };
  }

  static async downloadDocument(url: string, filename: string): Promise<void> {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      throw new Error(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}