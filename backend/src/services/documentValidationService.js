const Document = require('../models/document');
const { AppError } = require('../utils/appError');
const DocumentMetadataService = require('./documentMetadataService');
const DocumentAuditService = require('./documentAuditService');
const config = require('../config');

class DocumentValidationService {
  constructor() {
    this.validationRules = {
      // File size limits (in bytes)
      sizeLimits: {
        'application/pdf': 10 * 1024 * 1024, // 10MB
        'image/jpeg': 5 * 1024 * 1024, // 5MB
        'image/png': 5 * 1024 * 1024, // 5MB
        'application/msword': 2 * 1024 * 1024, // 2MB
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 2 * 1024 * 1024, // 2MB
        'application/vnd.ms-excel': 2 * 1024 * 1024, // 2MB
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 2 * 1024 * 1024 // 2MB
      },

      // Allowed file types
      allowedTypes: [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ],

      // Required metadata fields by document type
      requiredMetadata: {
        INCOME_TAX_RETURN: ['financialYear', 'assessmentYear', 'panNumber'],
        BANK_STATEMENT: ['accountNumber', 'bankName', 'statementPeriod'],
        SALARY_SLIP: ['employerName', 'month', 'year', 'employeeId'],
        RENT_RECEIPT: ['landlordName', 'propertyAddress', 'rentAmount', 'period'],
        INVESTMENT_PROOF: ['investmentType', 'amount', 'financialYear'],
        MEDICAL_BILL: ['hospitalName', 'patientName', 'billDate', 'amount'],
        HOUSE_RENT_ALLOWANCE: ['landlordName', 'propertyAddress', 'rentAmount', 'period'],
        EDUCATION_LOAN: ['lenderName', 'loanAccountNumber', 'interestAmount', 'financialYear']
      }
    };
  }

  /**
   * Validate document
   * @param {Object} document - Document object
   * @param {Object} file - File object
   * @returns {Object} Validation result
   */
  async validateDocument(document, file) {
    try {
      const validationResult = {
        isValid: true,
        errors: [],
        warnings: []
      };

      // Validate file type
      if (!this.validationRules.allowedTypes.includes(file.mimetype)) {
        validationResult.isValid = false;
        validationResult.errors.push('Unsupported file type');
      }

      // Validate file size
      const sizeLimit = this.validationRules.sizeLimits[file.mimetype];
      if (file.size > sizeLimit) {
        validationResult.isValid = false;
        validationResult.errors.push(`File size exceeds limit of ${sizeLimit / (1024 * 1024)}MB`);
      }

      // Validate required metadata
      const requiredFields = this.validationRules.requiredMetadata[document.documentType] || [];
      const missingFields = requiredFields.filter(field => !document.metadata.get(field));

      if (missingFields.length > 0) {
        validationResult.isValid = false;
        validationResult.errors.push(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate document content
      const contentValidation = await this.validateDocumentContent(document, file);
      validationResult.errors.push(...contentValidation.errors);
      validationResult.warnings.push(...contentValidation.warnings);

      // Update document validation status
      document.metadata.set('validation', {
        isValid: validationResult.isValid,
        lastValidated: new Date(),
        errors: validationResult.errors,
        warnings: validationResult.warnings
      });

      await document.save();

      // Log validation activity
      await DocumentAuditService.logActivity(
        document._id,
        document.userId,
        'DOCUMENT_VALIDATED',
        {
          isValid: validationResult.isValid,
          errors: validationResult.errors,
          warnings: validationResult.warnings
        }
      );

      return validationResult;
    } catch (error) {
      throw new AppError(error.message || 'Error validating document', error.statusCode || 500);
    }
  }

  /**
   * Validate document content
   * @param {Object} document - Document object
   * @param {Object} file - File object
   * @returns {Object} Content validation result
   */
  async validateDocumentContent(document, file) {
    const result = {
      errors: [],
      warnings: []
    };

    try {
      // Extract metadata for content validation
      const metadata = await DocumentMetadataService.extractMetadata(document, file.buffer);

      // Validate based on document type
      switch (document.documentType) {
        case 'INCOME_TAX_RETURN':
          this.validateIncomeTaxReturn(document, metadata, result);
          break;
        case 'BANK_STATEMENT':
          this.validateBankStatement(document, metadata, result);
          break;
        case 'SALARY_SLIP':
          this.validateSalarySlip(document, metadata, result);
          break;
        case 'RENT_RECEIPT':
          this.validateRentReceipt(document, metadata, result);
          break;
        case 'INVESTMENT_PROOF':
          this.validateInvestmentProof(document, metadata, result);
          break;
        case 'MEDICAL_BILL':
          this.validateMedicalBill(document, metadata, result);
          break;
        case 'HOUSE_RENT_ALLOWANCE':
          this.validateHouseRentAllowance(document, metadata, result);
          break;
        case 'EDUCATION_LOAN':
          this.validateEducationLoan(document, metadata, result);
          break;
      }

      // Common validations
      this.validateCommonFields(document, metadata, result);

    } catch (error) {
      result.errors.push(`Error validating content: ${error.message}`);
    }

    return result;
  }

  /**
   * Validate income tax return
   * @param {Object} document - Document object
   * @param {Object} metadata - Extracted metadata
   * @param {Object} result - Validation result
   */
  validateIncomeTaxReturn(document, metadata, result) {
    const { financialYear, panNumber } = document.metadata.toObject();

    // Validate PAN number format
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
      result.errors.push('Invalid PAN number format');
    }

    // Validate financial year format
    if (!/^\d{4}-\d{4}$/.test(financialYear)) {
      result.errors.push('Invalid financial year format');
    }

    // Check for required amounts
    const requiredAmounts = ['totalIncome', 'taxableIncome', 'taxPaid'];
    const missingAmounts = requiredAmounts.filter(amount => 
      !metadata.amounts.some(a => a.toLowerCase().includes(amount.toLowerCase()))
    );

    if (missingAmounts.length > 0) {
      result.warnings.push(`Could not find amounts for: ${missingAmounts.join(', ')}`);
    }
  }

  /**
   * Validate bank statement
   * @param {Object} document - Document object
   * @param {Object} metadata - Extracted metadata
   * @param {Object} result - Validation result
   */
  validateBankStatement(document, metadata, result) {
    const { accountNumber, bankName, statementPeriod } = document.metadata.toObject();

    // Validate account number format
    if (!/^\d{9,18}$/.test(accountNumber)) {
      result.errors.push('Invalid account number format');
    }

    // Validate statement period
    if (!statementPeriod || !statementPeriod.start || !statementPeriod.end) {
      result.errors.push('Invalid statement period');
    }

    // Check for transaction data
    if (!metadata.text.includes('Transaction') && !metadata.text.includes('Balance')) {
      result.warnings.push('Could not find transaction data in statement');
    }
  }

  /**
   * Validate salary slip
   * @param {Object} document - Document object
   * @param {Object} metadata - Extracted metadata
   * @param {Object} result - Validation result
   */
  validateSalarySlip(document, metadata, result) {
    const { employerName, month, year, employeeId } = document.metadata.toObject();

    // Validate month and year
    if (!/^(0[1-9]|1[0-2])$/.test(month) || !/^\d{4}$/.test(year)) {
      result.errors.push('Invalid month or year format');
    }

    // Check for required salary components
    const requiredComponents = ['Basic', 'HRA', 'DA', 'Gross', 'Net'];
    const missingComponents = requiredComponents.filter(component =>
      !metadata.text.toLowerCase().includes(component.toLowerCase())
    );

    if (missingComponents.length > 0) {
      result.warnings.push(`Could not find salary components: ${missingComponents.join(', ')}`);
    }
  }

  /**
   * Validate rent receipt
   * @param {Object} document - Document object
   * @param {Object} metadata - Extracted metadata
   * @param {Object} result - Validation result
   */
  validateRentReceipt(document, metadata, result) {
    const { landlordName, propertyAddress, rentAmount, period } = document.metadata.toObject();

    // Validate rent amount
    if (!rentAmount || isNaN(rentAmount)) {
      result.errors.push('Invalid rent amount');
    }

    // Validate period
    if (!period || !period.start || !period.end) {
      result.errors.push('Invalid rent period');
    }

    // Check for landlord details
    if (!metadata.text.toLowerCase().includes(landlordName.toLowerCase())) {
      result.warnings.push('Could not find landlord name in receipt');
    }
  }

  /**
   * Validate investment proof
   * @param {Object} document - Document object
   * @param {Object} metadata - Extracted metadata
   * @param {Object} result - Validation result
   */
  validateInvestmentProof(document, metadata, result) {
    const { investmentType, amount, financialYear } = document.metadata.toObject();

    // Validate investment amount
    if (!amount || isNaN(amount)) {
      result.errors.push('Invalid investment amount');
    }

    // Validate financial year
    if (!/^\d{4}-\d{4}$/.test(financialYear)) {
      result.errors.push('Invalid financial year format');
    }

    // Check for investment type
    if (!metadata.text.toLowerCase().includes(investmentType.toLowerCase())) {
      result.warnings.push('Could not find investment type in document');
    }
  }

  /**
   * Validate medical bill
   * @param {Object} document - Document object
   * @param {Object} metadata - Extracted metadata
   * @param {Object} result - Validation result
   */
  validateMedicalBill(document, metadata, result) {
    const { hospitalName, patientName, billDate, amount } = document.metadata.toObject();

    // Validate bill date
    if (!billDate || isNaN(new Date(billDate).getTime())) {
      result.errors.push('Invalid bill date');
    }

    // Validate bill amount
    if (!amount || isNaN(amount)) {
      result.errors.push('Invalid bill amount');
    }

    // Check for hospital details
    if (!metadata.text.toLowerCase().includes(hospitalName.toLowerCase())) {
      result.warnings.push('Could not find hospital name in bill');
    }
  }

  /**
   * Validate house rent allowance
   * @param {Object} document - Document object
   * @param {Object} metadata - Extracted metadata
   * @param {Object} result - Validation result
   */
  validateHouseRentAllowance(document, metadata, result) {
    const { landlordName, propertyAddress, rentAmount, period } = document.metadata.toObject();

    // Validate rent amount
    if (!rentAmount || isNaN(rentAmount)) {
      result.errors.push('Invalid rent amount');
    }

    // Validate period
    if (!period || !period.start || !period.end) {
      result.errors.push('Invalid rent period');
    }

    // Check for property details
    if (!metadata.text.toLowerCase().includes(propertyAddress.toLowerCase())) {
      result.warnings.push('Could not find property address in document');
    }
  }

  /**
   * Validate education loan
   * @param {Object} document - Document object
   * @param {Object} metadata - Extracted metadata
   * @param {Object} result - Validation result
   */
  validateEducationLoan(document, metadata, result) {
    const { lenderName, loanAccountNumber, interestAmount, financialYear } = document.metadata.toObject();

    // Validate loan account number
    if (!loanAccountNumber) {
      result.errors.push('Invalid loan account number');
    }

    // Validate interest amount
    if (!interestAmount || isNaN(interestAmount)) {
      result.errors.push('Invalid interest amount');
    }

    // Validate financial year
    if (!/^\d{4}-\d{4}$/.test(financialYear)) {
      result.errors.push('Invalid financial year format');
    }

    // Check for lender details
    if (!metadata.text.toLowerCase().includes(lenderName.toLowerCase())) {
      result.warnings.push('Could not find lender name in document');
    }
  }

  /**
   * Validate common fields
   * @param {Object} document - Document object
   * @param {Object} metadata - Extracted metadata
   * @param {Object} result - Validation result
   */
  validateCommonFields(document, metadata, result) {
    // Check for dates
    if (metadata.dates.length === 0) {
      result.warnings.push('No dates found in document');
    }

    // Check for amounts
    if (metadata.amounts.length === 0) {
      result.warnings.push('No amounts found in document');
    }

    // Check for text content
    if (!metadata.text || metadata.text.trim().length < 50) {
      result.warnings.push('Document may have insufficient text content');
    }

    // Check for document quality
    if (metadata.type === 'IMAGE' && metadata.text.length < 100) {
      result.warnings.push('Image quality may be poor or text may be unclear');
    }
  }

  /**
   * Get validation statistics
   * @returns {Object} Validation statistics
   */
  async getValidationStats() {
    const [
      totalDocuments,
      validationStats,
      errorStats
    ] = await Promise.all([
      Document.countDocuments(),
      Document.aggregate([
        {
          $group: {
            _id: '$metadata.validation.isValid',
            count: { $sum: 1 }
          }
        }
      ]),
      Document.aggregate([
        { $unwind: '$metadata.validation.errors' },
        {
          $group: {
            _id: '$metadata.validation.errors',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    return {
      totalDocuments,
      validationStatus: validationStats.reduce((acc, curr) => ({
        ...acc,
        [curr._id ? 'valid' : 'invalid']: curr.count
      }), {}),
      topErrors: errorStats.map(stat => ({
        error: stat._id,
        count: stat.count
      }))
    };
  }
}

module.exports = new DocumentValidationService(); 