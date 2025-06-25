// Comprehensive validation utilities for ITR flow
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class ValidationUtils {
  // PAN validation - Format: AAAAA9999A
  static validatePAN(pan: string): ValidationResult {
    if (!pan) {
      return { isValid: false, error: 'PAN is required' };
    }

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const cleanPAN = pan.replace(/\s/g, '').toUpperCase();

    if (!panRegex.test(cleanPAN)) {
      return { isValid: false, error: 'PAN must be in format AAAAA9999A (e.g., ABCDE1234F)' };
    }

    return { isValid: true };
  }

  // Aadhaar validation - 12 digits
  static validateAadhaar(aadhaar: string): ValidationResult {
    if (!aadhaar) {
      return { isValid: false, error: 'Aadhaar is required' };
    }

    const cleanAadhaar = aadhaar.replace(/\s/g, '');
    
    if (!/^\d{12}$/.test(cleanAadhaar)) {
      return { isValid: false, error: 'Aadhaar must be a 12-digit number' };
    }

    // Verify checksum using Verhoeff algorithm
    if (!this.verifyAadhaarChecksum(cleanAadhaar)) {
      return { isValid: false, error: 'Invalid Aadhaar number' };
    }

    return { isValid: true };
  }

  // Email validation
  static validateEmail(email: string): ValidationResult {
    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }

    return { isValid: true };
  }

  // Phone number validation (Indian format)
  static validatePhone(phone: string): ValidationResult {
    if (!phone) {
      return { isValid: false, error: 'Phone number is required' };
    }

    const cleanPhone = phone.replace(/\s|-/g, '');
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(cleanPhone)) {
      return { isValid: false, error: 'Please enter a valid 10-digit Indian mobile number' };
    }

    return { isValid: true };
  }

  // Financial amount validation
  static validateAmount(amount: number | string, fieldName: string, minValue: number = 0): ValidationResult {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numAmount)) {
      return { isValid: false, error: `${fieldName} must be a valid number` };
    }

    if (numAmount < minValue) {
      return { isValid: false, error: `${fieldName} must be at least ₹${minValue}` };
    }

    if (numAmount > 99999999) {
      return { isValid: false, error: `${fieldName} cannot exceed ₹9,99,99,999` };
    }

    return { isValid: true };
  }

  // Date validation
  static validateDate(date: string, fieldName: string): ValidationResult {
    if (!date) {
      return { isValid: false, error: `${fieldName} is required` };
    }

    const dateObj = new Date(date);
    const today = new Date();

    if (isNaN(dateObj.getTime())) {
      return { isValid: false, error: `Please enter a valid ${fieldName.toLowerCase()}` };
    }

    if (dateObj > today) {
      return { isValid: false, error: `${fieldName} cannot be in the future` };
    }

    return { isValid: true };
  }

  // Date of birth validation
  static validateDateOfBirth(dob: string): ValidationResult {
    const dateValidation = this.validateDate(dob, 'Date of birth');
    if (!dateValidation.isValid) {
      return dateValidation;
    }

    const dobDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();

    if (age < 18) {
      return { isValid: false, error: 'Age must be at least 18 years' };
    }

    if (age > 100) {
      return { isValid: false, error: 'Please enter a valid date of birth' };
    }

    return { isValid: true };
  }

  // Pincode validation (Indian format)
  static validatePincode(pincode: string): ValidationResult {
    if (!pincode) {
      return { isValid: false, error: 'Pincode is required' };
    }

    const pincodeRegex = /^[1-9][0-9]{5}$/;

    if (!pincodeRegex.test(pincode)) {
      return { isValid: false, error: 'Please enter a valid 6-digit pincode' };
    }

    return { isValid: true };
  }

  // Name validation
  static validateName(name: string, fieldName: string = 'Name'): ValidationResult {
    if (!name || name.trim().length === 0) {
      return { isValid: false, error: `${fieldName} is required` };
    }

    if (name.trim().length < 2) {
      return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
    }

    if (name.length > 100) {
      return { isValid: false, error: `${fieldName} cannot exceed 100 characters` };
    }

    const nameRegex = /^[a-zA-Z\s.'-]+$/;
    if (!nameRegex.test(name)) {
      return { isValid: false, error: `${fieldName} can only contain letters, spaces, dots, hyphens, and apostrophes` };
    }

    return { isValid: true };
  }

  // TAN validation
  static validateTAN(tan: string): ValidationResult {
    if (!tan) {
      return { isValid: true }; // TAN is optional
    }

    const tanRegex = /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/;
    const cleanTAN = tan.replace(/\s/g, '').toUpperCase();

    if (!tanRegex.test(cleanTAN)) {
      return { isValid: false, error: 'TAN must be in format AAAA99999A' };
    }

    return { isValid: true };
  }

  // Bank account validation
  static validateBankAccount(accountNumber: string): ValidationResult {
    if (!accountNumber) {
      return { isValid: false, error: 'Bank account number is required' };
    }

    const cleanAccount = accountNumber.replace(/\s/g, '');

    if (!/^\d{9,18}$/.test(cleanAccount)) {
      return { isValid: false, error: 'Bank account number must be 9-18 digits' };
    }

    return { isValid: true };
  }

  // IFSC code validation
  static validateIFSC(ifsc: string): ValidationResult {
    if (!ifsc) {
      return { isValid: false, error: 'IFSC code is required' };
    }

    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    const cleanIFSC = ifsc.replace(/\s/g, '').toUpperCase();

    if (!ifscRegex.test(cleanIFSC)) {
      return { isValid: false, error: 'IFSC code must be in format ABCD0123456' };
    }

    return { isValid: true };
  }

  // Verify Aadhaar checksum using Verhoeff algorithm
  private static verifyAadhaarChecksum(aadhaar: string): boolean {
    const verhoeffTable = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
      [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
      [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
      [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
      [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
      [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
      [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
      [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
      [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ];

    const permutationTable = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
      [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
      [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
      [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
      [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
      [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
      [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ];

    let checksum = 0;
    const digits = aadhaar.split('').map(Number);

    for (let i = 0; i < digits.length; i++) {
      checksum = verhoeffTable[checksum][permutationTable[i % 8][digits[i]]];
    }

    return checksum === 0;
  }

  // Comprehensive form validation
  static validatePersonalDetails(details: any): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    const nameValidation = this.validateName(details.name);
    if (!nameValidation.isValid) errors.name = nameValidation.error!;

    const panValidation = this.validatePAN(details.pan);
    if (!panValidation.isValid) errors.pan = panValidation.error!;

    if (details.aadhaar) {
      const aadhaarValidation = this.validateAadhaar(details.aadhaar);
      if (!aadhaarValidation.isValid) errors.aadhaar = aadhaarValidation.error!;
    }

    const emailValidation = this.validateEmail(details.email);
    if (!emailValidation.isValid) errors.email = emailValidation.error!;

    const phoneValidation = this.validatePhone(details.mobile);
    if (!phoneValidation.isValid) errors.mobile = phoneValidation.error!;

    const dobValidation = this.validateDateOfBirth(details.dateOfBirth);
    if (!dobValidation.isValid) errors.dateOfBirth = dobValidation.error!;

    if (details.address) {
      if (!details.address.line1) errors['address.line1'] = 'Address line 1 is required';
      if (!details.address.city) errors['address.city'] = 'City is required';
      if (!details.address.state) errors['address.state'] = 'State is required';
      
      const pincodeValidation = this.validatePincode(details.address.pincode);
      if (!pincodeValidation.isValid) errors['address.pincode'] = pincodeValidation.error!;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Format PAN for display
  static formatPAN(pan: string): string {
    return pan.replace(/\s/g, '').toUpperCase();
  }

  // Format Aadhaar for display
  static formatAadhaar(aadhaar: string): string {
    const clean = aadhaar.replace(/\s/g, '');
    return clean.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
  }

  // Format phone for display
  static formatPhone(phone: string): string {
    const clean = phone.replace(/\D/g, '');
    return clean.replace(/(\d{5})(\d{5})/, '$1 $2');
  }

  // Sanitize financial input
  static sanitizeAmount(value: string): number {
    return parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
  }
}