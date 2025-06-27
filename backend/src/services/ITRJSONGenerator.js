// ITR JSON Generator Service for MongoDB Backend
// Fixed version addressing critical bugs identified in analysis

const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Import MongoDB models
const User = require('../models/User');
const Form16Data = require('../models/form16Data');
const PersonalDetail = require('../models/personalDetailModel');
const BankDetail = require('../models/bankDetail');
const ContactDetail = require('../models/contactDetail');
const IncomeInterest = require('../models/IncomeInterest');
const TaxSummary = require('../models/taxSumarry');

class ITRJSONGenerator {
  constructor(itrType = 'ITR-1', assessmentYear = '2024-25') {
    this.itrType = itrType;
    this.assessmentYear = assessmentYear;
    this.currentDate = new Date().toISOString().split('T')[0];
    this.financialYear = this.getFinancialYear(assessmentYear);
  }

  // ========================================
  // MAIN ITR GENERATION METHOD
  // ========================================
  
  async generateCompliantJSON(userId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // 1. Validate user ID format
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }

      // 2. Aggregate all user data from MongoDB
      const userData = await this.aggregateUserData(userId, session);
      
      // 3. Validate data completeness
      const validation = await this.validateDataCompleteness(userData);
      if (!validation.isComplete) {
        throw new Error(`Missing required data: ${validation.missingFields.join(', ')}`);
      }

      // 4. Determine appropriate ITR type if not specified
      if (this.itrType === 'AUTO') {
        this.itrType = this.recommendITRType(userData);
      }

      // 5. Generate ITR JSON based on type
      let itrData;
      switch (this.itrType) {
        case 'ITR-1':
          itrData = await this.generateITR1(userData);
          break;
        case 'ITR-2':
          itrData = await this.generateITR2(userData);
          break;
        case 'ITR-3':
          itrData = await this.generateITR3(userData);
          break;
        case 'ITR-4':
          itrData = await this.generateITR4(userData);
          break;
        default:
          throw new Error(`Unsupported ITR type: ${this.itrType}`);
      }

      // 6. Validate generated JSON against ITR schema
      await this.validateITRSchema(itrData);

      // 7. Generate secure checksum (SHA-256 instead of MD5)
      const checksum = this.generateSecureChecksum(itrData);
      
      // 8. Create file metadata
      const fileName = this.generateFileName(userData.personal, checksum);
      
      const result = {
        success: true,
        itrType: this.itrType,
        assessmentYear: this.assessmentYear,
        fileName: fileName,
        checksum: checksum,
        data: itrData,
        metadata: {
          generatedAt: new Date().toISOString(),
          userId: userId,
          totalIncome: itrData.ITR?.PartA_GEN1?.GrossTotalIncome || 0,
          taxPayable: itrData.ITR?.PartB_TTI?.TotalTaxPayable || 0,
          refundAmount: itrData.ITR?.Refund?.RefundDue || 0
        }
      };

      await session.commitTransaction();
      return result;

    } catch (error) {
      await session.abortTransaction();
      console.error('ITR Generation Error:', error);
      throw new Error(`ITR generation failed: ${error.message}`);
    } finally {
      session.endSession();
    }
  }

  // ========================================
  // DATA AGGREGATION METHODS (MongoDB)
  // ========================================

  async aggregateUserData(userId, session) {
    try {
      // Get user basic info
      const user = await User.findById(userId).session(session);
      if (!user) {
        throw new Error('User not found');
      }

      // Get personal details
      const personal = await PersonalDetail.findOne({ userId }).session(session);
      
      // Get contact details
      const contact = await ContactDetail.findOne({ userId }).session(session);
      
      // Get bank details
      const bank = await BankDetail.findOne({ userId }).session(session);
      
      // Get Form 16 data
      const form16Data = await Form16Data.find({ userId }).session(session);
      
      // Get other income sources
      const interestIncome = await IncomeInterest.find({ userId }).session(session);
      
      // Get tax summary
      const taxSummary = await TaxSummary.findOne({ userId }).session(session);

      return {
        user,
        personal,
        contact,
        bank,
        form16Data: form16Data || [],
        interestIncome: interestIncome || [],
        taxSummary
      };

    } catch (error) {
      throw new Error(`Data aggregation failed: ${error.message}`);
    }
  }

  // ========================================
  // DATA VALIDATION METHODS
  // ========================================

  async validateDataCompleteness(userData) {
    const missingFields = [];
    
    // Validate essential user data
    if (!userData.user) missingFields.push('User profile');
    if (!userData.personal?.panNumber) missingFields.push('PAN number');
    if (!userData.personal?.firstName) missingFields.push('First name');
    if (!userData.personal?.lastName) missingFields.push('Last name');
    if (!userData.personal?.dateOfBirth) missingFields.push('Date of birth');
    
    // Validate contact information
    if (!userData.contact?.email) missingFields.push('Email address');
    if (!userData.contact?.mobile) missingFields.push('Mobile number');
    
    // Validate bank details for refund
    if (!userData.bank?.accountNumber) missingFields.push('Bank account number');
    if (!userData.bank?.ifscCode) missingFields.push('IFSC code');
    
    // Validate income data
    if (!userData.form16Data || userData.form16Data.length === 0) {
      missingFields.push('Form 16 / Salary income data');
    }

    return {
      isComplete: missingFields.length === 0,
      missingFields
    };
  }

  // ========================================
  // ITR TYPE RECOMMENDATION (Fixed Logic)
  // ========================================

  recommendITRType(userData) {
    try {
      // Calculate total income from all sources
      let totalIncome = 0;
      let hasBusinessIncome = false;
      let hasCapitalGains = false;
      let hasHouseProperty = false;
      let hasOtherSources = false;

      // Salary income from Form 16
      if (userData.form16Data && userData.form16Data.length > 0) {
        totalIncome += userData.form16Data.reduce((sum, form16) => {
          return sum + (parseFloat(form16.grossSalary) || 0);
        }, 0);
      }

      // Interest income
      if (userData.interestIncome && userData.interestIncome.length > 0) {
        const interestTotal = userData.interestIncome.reduce((sum, interest) => {
          return sum + (parseFloat(interest.amount) || 0);
        }, 0);
        totalIncome += interestTotal;
        if (interestTotal > 10000) hasOtherSources = true;
      }

      // ITR-1 eligibility (most restrictive)
      if (totalIncome <= 5000000 && 
          !hasBusinessIncome && 
          !hasCapitalGains && 
          !hasHouseProperty && 
          !hasOtherSources) {
        return 'ITR-1';
      }

      // ITR-2 for individuals with capital gains or multiple income sources
      if (!hasBusinessIncome && totalIncome <= 10000000) {
        return 'ITR-2';
      }

      // ITR-3 for business/professional income
      if (hasBusinessIncome) {
        return 'ITR-3';
      }

      // Default to ITR-2 for most cases
      return 'ITR-2';

    } catch (error) {
      console.error('ITR type recommendation error:', error);
      return 'ITR-2'; // Safe default
    }
  }

  // ========================================
  // TAX CALCULATION METHODS (Fixed)
  // ========================================

  calculateOldRegimeTax(taxableIncome) {
    // Fixed tax slab calculation with proper boundaries
    const taxSlabs = [
      { min: 0, max: 250000, rate: 0 },
      { min: 250001, max: 500000, rate: 0.05 },
      { min: 500001, max: 1000000, rate: 0.20 },
      { min: 1000001, max: Infinity, rate: 0.30 }
    ];

    let tax = 0;
    
    for (const slab of taxSlabs) {
      if (taxableIncome > slab.min) {
        const taxableAtThisSlab = Math.min(taxableIncome, slab.max) - slab.min + 1;
        tax += taxableAtThisSlab * slab.rate;
      }
    }

    // Add surcharge for high income
    let surcharge = 0;
    if (taxableIncome > 5000000 && taxableIncome <= 10000000) {
      surcharge = tax * 0.10;
    } else if (taxableIncome > 10000000 && taxableIncome <= 20000000) {
      surcharge = tax * 0.15;
    } else if (taxableIncome > 20000000 && taxableIncome <= 50000000) {
      surcharge = tax * 0.25;
    } else if (taxableIncome > 50000000) {
      surcharge = tax * 0.37;
    }

    // Add Health and Education Cess
    const cess = (tax + surcharge) * 0.04;

    return {
      tax: Math.round(tax),
      surcharge: Math.round(surcharge),
      cess: Math.round(cess),
      totalTax: Math.round(tax + surcharge + cess)
    };
  }

  calculateNewRegimeTax(taxableIncome) {
    // New regime tax slabs (2023-24 onwards)
    const taxSlabs = [
      { min: 0, max: 300000, rate: 0 },
      { min: 300001, max: 600000, rate: 0.05 },
      { min: 600001, max: 900000, rate: 0.10 },
      { min: 900001, max: 1200000, rate: 0.15 },
      { min: 1200001, max: 1500000, rate: 0.20 },
      { min: 1500001, max: Infinity, rate: 0.30 }
    ];

    let tax = 0;
    
    for (const slab of taxSlabs) {
      if (taxableIncome > slab.min) {
        const taxableAtThisSlab = Math.min(taxableIncome, slab.max) - slab.min + 1;
        tax += taxableAtThisSlab * slab.rate;
      }
    }

    // Standard deduction and rebate
    const rebate = taxableIncome <= 700000 ? Math.min(tax, 25000) : 0;
    tax = Math.max(0, tax - rebate);

    // Add surcharge (same as old regime)
    let surcharge = 0;
    if (taxableIncome > 5000000) {
      surcharge = tax * 0.10;
    }

    // Add Health and Education Cess
    const cess = (tax + surcharge) * 0.04;

    return {
      tax: Math.round(tax),
      surcharge: Math.round(surcharge),
      cess: Math.round(cess),
      totalTax: Math.round(tax + surcharge + cess),
      rebate: Math.round(rebate)
    };
  }

  // ========================================
  // ITR GENERATION METHODS
  // ========================================

  async generateITR1(userData) {
    // Implementation for ITR-1 specific to salary income
    const personal = userData.personal;
    const form16 = userData.form16Data[0] || {};
    
    const grossSalary = parseFloat(form16.grossSalary) || 0;
    const standardDeduction = Math.min(grossSalary, 50000);
    const taxableIncome = Math.max(0, grossSalary - standardDeduction);
    
    const oldRegimeTax = this.calculateOldRegimeTax(taxableIncome);
    const newRegimeTax = this.calculateNewRegimeTax(taxableIncome);

    return {
      ITR: {
        ITRType: 'ITR1',
        AssessmentYear: this.assessmentYear,
        PartA_GEN1: {
          PersonalInfo: {
            AssesseeName: `${personal.firstName} ${personal.lastName}`,
            PAN: personal.panNumber,
            DOB: personal.dateOfBirth,
            Status: 'I', // Individual
            ResidentialStatus: 'R', // Resident
            FilingStatus: 'O' // Original
          },
          GrossTotalIncome: grossSalary,
          TotalIncome: taxableIncome
        },
        PartB_TTI: {
          TotalTaxPayable: oldRegimeTax.totalTax
        }
      }
    };
  }

  async generateITR2(userData) {
    // Implementation for ITR-2 (more complex income sources)
    // Similar structure but includes capital gains, house property etc.
    return this.generateITR1(userData); // Simplified for now
  }

  async generateITR3(userData) {
    // Implementation for ITR-3 (business income)
    return this.generateITR1(userData); // Simplified for now
  }

  async generateITR4(userData) {
    // Implementation for ITR-4 (presumptive business)
    return this.generateITR1(userData); // Simplified for now
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  generateSecureChecksum(data) {
    // Use SHA-256 instead of MD5 for security
    return crypto.createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex');
  }

  generateFileName(personal, checksum) {
    const panNumber = personal?.panNumber || 'UNKNOWN';
    const name = personal?.firstName?.replace(/\s+/g, '_') || 'USER';
    const timestamp = new Date().toISOString().split('T')[0];
    
    return `${this.itrType}_${this.assessmentYear}_${panNumber}_${name}_${timestamp}_${checksum.substring(0, 8)}.json`;
  }

  getFinancialYear(assessmentYear) {
    const [startYear] = assessmentYear.split('-');
    return `${parseInt(startYear) - 1}-${startYear}`;
  }

  async validateITRSchema(itrData) {
    // Basic schema validation
    if (!itrData.ITR) {
      throw new Error('Invalid ITR structure: Missing ITR root');
    }
    
    if (!itrData.ITR.PartA_GEN1) {
      throw new Error('Invalid ITR structure: Missing PartA_GEN1');
    }
    
    // Add more schema validation as needed
    return true;
  }
}

module.exports = ITRJSONGenerator;