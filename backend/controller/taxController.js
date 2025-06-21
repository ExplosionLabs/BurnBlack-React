const taxService = require('../services/TaxService');

// Get Tax Summary
const getTaxSummary = async (req, res) => {
  try {
    const { financialYear } = req.params;
    const summary = await taxService.getTaxSummary(req.user.id, financialYear);
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Calculate Tax Savings
const calculateTaxSavings = async (req, res) => {
  try {
    const { financialYear } = req.params;
    const savings = await taxService.calculateTaxSavings(req.user.id, financialYear);
    res.json({
      success: true,
      data: savings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Calculate Tax Liability
const calculateTaxLiability = async (req, res) => {
  try {
    const { financialYear } = req.params;
    const liability = await taxService.calculateTaxLiability(req.user.id, financialYear);
    res.json({
      success: true,
      data: liability
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getTaxSummary,
  calculateTaxSavings,
  calculateTaxLiability
}; 