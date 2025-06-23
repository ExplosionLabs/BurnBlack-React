const TaxSummary = require('../models/taxSummary');
// const TaxInvestment = require('../models/taxInvestment');
// const Donation80G = require('../models/donation80G');  
// const RentalProperty = require('../models/rentalProperty');

class TaxService {
  // Calculate Total Income
  async calculateTotalIncome(userId, financialYear) {
    try {
      const taxSummary = await TaxSummary.findOne({ 
        userId, 
        financialYear 
      });

      if (!taxSummary) {
        throw new Error('Tax summary not found for this year');
      }

      return {
        grossIncome: taxSummary.grossIncome,
        taxableIncome: taxSummary.taxableIncome,
        totalDeductions: taxSummary.totalDeductions
      };
    } catch (error) {
      throw error;
    }
  }

  // Calculate Tax Savings
  async calculateTaxSavings(userId, financialYear) {
    try {
      const [investments, donations, properties] = await Promise.all([
        TaxInvestment.findOne({ userId, financialYear }),
        Donation80G.find({ userId, financialYear }),
        RentalProperty.find({ userId, financialYear })
      ]);

      const savings = {
        section80C: investments?.section80C || 0,
        section80G: donations.reduce((sum, donation) => sum + donation.cashAmount, 0),
        rentalDeductions: properties.reduce((sum, property) => 
          sum + (property.taxSavings?.totalDeduction || 0), 0
        )
      };

      const totalSavings = Object.values(savings).reduce((sum, value) => sum + value, 0);

      return {
        savings,
        totalSavings,
        remainingLimit: {
          section80C: Math.max(0, 150000 - savings.section80C),
          section80G: 'No limit',
          rentalDeductions: 'Based on actual expenses'
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Calculate Tax Liability
  async calculateTaxLiability(userId, financialYear) {
    try {
      const taxSummary = await TaxSummary.findOne({ 
        userId, 
        financialYear 
      });

      if (!taxSummary) {
        throw new Error('Tax summary not found for this year');
      }

      // Get tax savings
      const { totalSavings } = await this.calculateTaxSavings(userId, financialYear);

      // Calculate final taxable income
      const finalTaxableIncome = Math.max(0, taxSummary.taxableIncome - totalSavings);

      // Calculate tax based on slabs (simplified version)
      let taxLiability = 0;
      if (finalTaxableIncome <= 250000) {
        taxLiability = 0;
      } else if (finalTaxableIncome <= 500000) {
        taxLiability = (finalTaxableIncome - 250000) * 0.05;
      } else if (finalTaxableIncome <= 1000000) {
        taxLiability = 12500 + (finalTaxableIncome - 500000) * 0.2;
      } else {
        taxLiability = 112500 + (finalTaxableIncome - 1000000) * 0.3;
      }

      // Add health and education cess
      const cess = taxLiability * 0.04;
      const totalTaxLiability = taxLiability + cess;

      return {
        taxableIncome: finalTaxableIncome,
        taxLiability,
        cess,
        totalTaxLiability,
        taxPaid: taxSummary.taxPaid || 0,
        taxDue: Math.max(0, totalTaxLiability - (taxSummary.taxPaid || 0))
      };
    } catch (error) {
      throw error;
    }
  }

  // Get Tax Summary
  async getTaxSummary(userId, financialYear) {
    try {
      const [income, savings, liability] = await Promise.all([
        this.calculateTotalIncome(userId, financialYear),
        this.calculateTaxSavings(userId, financialYear),
        this.calculateTaxLiability(userId, financialYear)
      ]);

      return {
        financialYear,
        income,
        savings,
        liability,
        status: liability.taxDue <= 0 ? 'PAID' : 'PENDING'
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TaxService(); 