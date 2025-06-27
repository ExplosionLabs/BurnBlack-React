const TaxSummary = require('../models/taxSummary');
const { AppError } = require('../utils/appError');

class TaxCalculationService {
  // Tax slabs for FY 2023-24 (AY 2024-25)
  static TAX_SLABS = {
    INDIVIDUAL: [
      { min: 0, max: 300000, rate: 0 },
      { min: 300001, max: 600000, rate: 0.05 },
      { min: 600001, max: 900000, rate: 0.10 },
      { min: 900001, max: 1200000, rate: 0.15 },
      { min: 1200001, max: 1500000, rate: 0.20 },
      { min: 1500001, max: Infinity, rate: 0.30 }
    ],
    SENIOR_CITIZEN: [
      { min: 0, max: 300000, rate: 0 },
      { min: 300001, max: 500000, rate: 0.05 },
      { min: 500001, max: 1000000, rate: 0.20 },
      { min: 1000001, max: Infinity, rate: 0.30 }
    ],
    SUPER_SENIOR_CITIZEN: [
      { min: 0, max: 500000, rate: 0 },
      { min: 500001, max: 1000000, rate: 0.20 },
      { min: 1000001, max: Infinity, rate: 0.30 }
    ]
  };

  static HEALTH_EDUCATION_CESS = 0.04; // 4% of income tax
  static SURCHARGE_RATES = {
    INDIVIDUAL: [
      { min: 5000000, max: 10000000, rate: 0.10 },
      { min: 10000001, max: 20000000, rate: 0.15 },
      { min: 20000001, max: 50000000, rate: 0.25 },
      { min: 50000001, max: Infinity, rate: 0.37 }
    ]
  };

  /**
   * Calculate tax for a given income and user type
   * @param {Object} params
   * @param {number} params.grossIncome - Total gross income
   * @param {number} params.totalDeductions - Total deductions
   * @param {string} params.userType - Type of user (INDIVIDUAL, SENIOR_CITIZEN, SUPER_SENIOR_CITIZEN)
   * @param {number} params.taxPaid - Tax already paid (TDS, advance tax, etc.)
   * @returns {Object} Tax calculation results
   */
  static async calculateTax({ grossIncome, totalDeductions, userType = 'INDIVIDUAL', taxPaid = 0 }) {
    try {
      // Validate inputs
      if (grossIncome < 0) throw new AppError('Gross income cannot be negative', 400);
      if (totalDeductions < 0) throw new AppError('Deductions cannot be negative', 400);
      if (taxPaid < 0) throw new AppError('Tax paid cannot be negative', 400);
      if (!this.TAX_SLABS[userType]) throw new AppError('Invalid user type', 400);

      // Calculate taxable income
      const taxableIncome = Math.max(0, grossIncome - totalDeductions);

      // Calculate income tax
      let incomeTax = 0;
      const slabs = this.TAX_SLABS[userType];
      
      for (const slab of slabs) {
        if (taxableIncome > slab.min) {
          const taxableAmount = Math.min(taxableIncome - slab.min, slab.max - slab.min);
          incomeTax += taxableAmount * slab.rate;
        }
      }

      // Calculate surcharge if applicable
      let surcharge = 0;
      if (userType === 'INDIVIDUAL') {
        const surchargeSlabs = this.SURCHARGE_RATES.INDIVIDUAL;
        for (const slab of surchargeSlabs) {
          if (taxableIncome > slab.min) {
            surcharge = incomeTax * slab.rate;
            break;
          }
        }
      }

      // Calculate health and education cess
      const healthEducationCess = (incomeTax + surcharge) * this.HEALTH_EDUCATION_CESS;

      // Calculate total tax liability
      const totalTaxLiability = incomeTax + surcharge + healthEducationCess;

      // Calculate tax due/refund
      const taxDue = Math.max(0, totalTaxLiability - taxPaid);
      const taxRefund = Math.max(0, taxPaid - totalTaxLiability);

      return {
        grossIncome,
        totalDeductions,
        taxableIncome,
        incomeTaxAtNormalRates: incomeTax,
        surcharge,
        healthEducationCess,
        totalTaxLiability,
        taxPaid,
        taxDue,
        taxRefund,
        userType
      };
    } catch (error) {
      throw new AppError(error.message || 'Error calculating tax', error.statusCode || 500);
    }
  }

  /**
   * Calculate deductions under various sections
   * @param {Object} params
   * @returns {Object} Deduction calculations
   */
  static async calculateDeductions({
    section80C = 0,
    housePropertyDeduction = 0,
    section80D = 0,
    section80E = 0,
    section80G = 0,
    section80TTA = 0,
    otherDeductions = 0
  }) {
    try {
      // Validate inputs
      const deductions = {
        section80C: Math.min(section80C, 150000), // Max limit 1.5L
        housePropertyDeduction,
        section80D: Math.min(section80D, 25000), // Max limit 25K
        section80E,
        section80G,
        section80TTA: Math.min(section80TTA, 10000), // Max limit 10K
        otherDeductions
      };

      // Calculate total deductions
      const totalDeductions = Object.values(deductions).reduce((sum, value) => sum + value, 0);

      return {
        ...deductions,
        totalDeductions
      };
    } catch (error) {
      throw new AppError(error.message || 'Error calculating deductions', error.statusCode || 500);
    }
  }

  /**
   * Save tax calculation results
   * @param {string} userId - User ID
   * @param {Object} taxCalculation - Tax calculation results
   * @returns {Object} Saved tax summary
   */
  static async saveTaxCalculation(userId, taxCalculation) {
    try {
      const taxSummary = await TaxSummary.findOneAndUpdate(
        { userId },
        {
          ...taxCalculation,
          lastUpdated: new Date()
        },
        { upsert: true, new: true }
      );

      return taxSummary;
    } catch (error) {
      throw new AppError(error.message || 'Error saving tax calculation', error.statusCode || 500);
    }
  }

  /**
   * Get tax calculation history
   * @param {string} userId - User ID
   * @returns {Array} Tax calculation history
   */
  static async getTaxHistory(userId) {
    try {
      const taxHistory = await TaxSummary.find({ userId })
        .sort({ lastUpdated: -1 })
        .select('-__v');

      return taxHistory;
    } catch (error) {
      throw new AppError(error.message || 'Error fetching tax history', error.statusCode || 500);
    }
  }
}

module.exports = TaxCalculationService; 