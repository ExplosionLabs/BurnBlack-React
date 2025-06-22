const {
  SalaryIncome,
  BusinessIncome,
  PropertyIncome,
  OtherIncome
} = require('../models/income');
const { AppError } = require('../utils/appError');

class IncomeService {
  /**
   * Calculate total income from all sources
   * @param {string} userId - User ID
   * @param {string} financialYear - Financial year
   * @returns {Object} Income summary
   */
  static async calculateTotalIncome(userId, financialYear) {
    try {
      // Get all income sources
      const [salaryIncomes, businessIncomes, propertyIncomes, otherIncomes] = await Promise.all([
        SalaryIncome.find({ userId, financialYear, status: { $ne: 'REJECTED' } }),
        BusinessIncome.find({ userId, financialYear, status: { $ne: 'REJECTED' } }),
        PropertyIncome.find({ userId, financialYear, status: { $ne: 'REJECTED' } }),
        OtherIncome.find({ userId, financialYear, status: { $ne: 'REJECTED' } })
      ]);

      // Calculate totals
      const salaryTotal = salaryIncomes.reduce((sum, income) => sum + income.amount, 0);
      const businessTotal = businessIncomes.reduce((sum, income) => sum + income.profit, 0);
      const propertyTotal = propertyIncomes.reduce((sum, income) => {
        const netIncome = income.annualValue - 
          (income.municipalTaxes + income.standardDeduction + income.interestOnLoan);
        return sum + Math.max(0, netIncome);
      }, 0);
      const otherTotal = otherIncomes.reduce((sum, income) => sum + income.taxableAmount, 0);

      // Calculate total TDS
      const totalTDS = [
        ...salaryIncomes,
        ...businessIncomes,
        ...propertyIncomes,
        ...otherIncomes
      ].reduce((sum, income) => sum + (income.tds || 0), 0);

      return {
        salaryIncome: {
          total: salaryTotal,
          sources: salaryIncomes
        },
        businessIncome: {
          total: businessTotal,
          sources: businessIncomes
        },
        propertyIncome: {
          total: propertyTotal,
          sources: propertyIncomes
        },
        otherIncome: {
          total: otherTotal,
          sources: otherIncomes
        },
        totalIncome: salaryTotal + businessTotal + propertyTotal + otherTotal,
        totalTDS
      };
    } catch (error) {
      throw new AppError(error.message || 'Error calculating total income', error.statusCode || 500);
    }
  }

  /**
   * Add salary income
   * @param {string} userId - User ID
   * @param {Object} salaryData - Salary income data
   * @returns {Object} Created salary income
   */
  static async addSalaryIncome(userId, salaryData) {
    try {
      const salaryIncome = new SalaryIncome({
        userId,
        ...salaryData,
        amount: this.calculateTotalSalary(salaryData)
      });

      await salaryIncome.save();
      return salaryIncome;
    } catch (error) {
      throw new AppError(error.message || 'Error adding salary income', error.statusCode || 500);
    }
  }

  /**
   * Add business income
   * @param {string} userId - User ID
   * @param {Object} businessData - Business income data
   * @returns {Object} Created business income
   */
  static async addBusinessIncome(userId, businessData) {
    try {
      const businessIncome = new BusinessIncome({
        userId,
        ...businessData,
        amount: businessData.profit
      });

      await businessIncome.save();
      return businessIncome;
    } catch (error) {
      throw new AppError(error.message || 'Error adding business income', error.statusCode || 500);
    }
  }

  /**
   * Add property income
   * @param {string} userId - User ID
   * @param {Object} propertyData - Property income data
   * @returns {Object} Created property income
   */
  static async addPropertyIncome(userId, propertyData) {
    try {
      const netIncome = this.calculateNetPropertyIncome(propertyData);
      const propertyIncome = new PropertyIncome({
        userId,
        ...propertyData,
        amount: Math.max(0, netIncome)
      });

      await propertyIncome.save();
      return propertyIncome;
    } catch (error) {
      throw new AppError(error.message || 'Error adding property income', error.statusCode || 500);
    }
  }

  /**
   * Add other income
   * @param {string} userId - User ID
   * @param {Object} otherIncomeData - Other income data
   * @returns {Object} Created other income
   */
  static async addOtherIncome(userId, otherIncomeData) {
    try {
      const otherIncome = new OtherIncome({
        userId,
        ...otherIncomeData,
        amount: otherIncomeData.taxableAmount + (otherIncomeData.exemptAmount || 0)
      });

      await otherIncome.save();
      return otherIncome;
    } catch (error) {
      throw new AppError(error.message || 'Error adding other income', error.statusCode || 500);
    }
  }

  /**
   * Calculate total salary from components
   * @param {Object} salaryData - Salary components
   * @returns {number} Total salary
   */
  static calculateTotalSalary(salaryData) {
    const {
      basicSalary,
      hra,
      specialAllowance,
      otherAllowances,
      perquisites,
      gratuity
    } = salaryData;

    let total = basicSalary + hra + specialAllowance;

    // Add other allowances
    if (otherAllowances instanceof Map) {
      otherAllowances.forEach(amount => {
        total += amount;
      });
    }

    // Add perquisites
    if (perquisites instanceof Map) {
      perquisites.forEach(amount => {
        total += amount;
      });
    }

    // Add gratuity if provided
    if (gratuity) {
      total += gratuity;
    }

    return total;
  }

  /**
   * Calculate net property income
   * @param {Object} propertyData - Property income data
   * @returns {number} Net property income
   */
  static calculateNetPropertyIncome(propertyData) {
    const {
      annualValue,
      municipalTaxes,
      standardDeduction,
      interestOnLoan,
      otherDeductions
    } = propertyData;

    let netIncome = annualValue - municipalTaxes;

    // Apply standard deduction (30% of net annual value)
    const standardDeductionAmount = Math.min(standardDeduction, netIncome * 0.3);
    netIncome -= standardDeductionAmount;

    // Deduct interest on loan
    netIncome -= interestOnLoan;

    // Deduct other deductions
    if (otherDeductions instanceof Map) {
      otherDeductions.forEach(amount => {
        netIncome -= amount;
      });
    }

    return netIncome;
  }

  /**
   * Update income verification status
   * @param {string} incomeId - Income ID
   * @param {string} incomeType - Type of income
   * @param {boolean} isVerified - Verification status
   * @returns {Object} Updated income
   */
  static async updateVerificationStatus(incomeId, incomeType, isVerified) {
    try {
      let IncomeModel;
      switch (incomeType) {
        case 'SALARY':
          IncomeModel = SalaryIncome;
          break;
        case 'BUSINESS':
          IncomeModel = BusinessIncome;
          break;
        case 'PROPERTY':
          IncomeModel = PropertyIncome;
          break;
        case 'OTHER':
          IncomeModel = OtherIncome;
          break;
        default:
          throw new AppError('Invalid income type', 400);
      }

      const income = await IncomeModel.findByIdAndUpdate(
        incomeId,
        {
          isVerified,
          verificationDate: isVerified ? new Date() : null,
          status: isVerified ? 'VERIFIED' : 'DRAFT'
        },
        { new: true }
      );

      if (!income) {
        throw new AppError('Income not found', 404);
      }

      return income;
    } catch (error) {
      throw new AppError(error.message || 'Error updating verification status', error.statusCode || 500);
    }
  }

  /**
   * Get income history
   * @param {string} userId - User ID
   * @param {string} financialYear - Financial year
   * @returns {Object} Income history
   */
  static async getIncomeHistory(userId, financialYear) {
    try {
      const [salaryHistory, businessHistory, propertyHistory, otherHistory] = await Promise.all([
        SalaryIncome.find({ userId, financialYear }).sort({ createdAt: -1 }),
        BusinessIncome.find({ userId, financialYear }).sort({ createdAt: -1 }),
        PropertyIncome.find({ userId, financialYear }).sort({ createdAt: -1 }),
        OtherIncome.find({ userId, financialYear }).sort({ createdAt: -1 })
      ]);

      return {
        salaryHistory,
        businessHistory,
        propertyHistory,
        otherHistory
      };
    } catch (error) {
      throw new AppError(error.message || 'Error fetching income history', error.statusCode || 500);
    }
  }
}

module.exports = IncomeService; 