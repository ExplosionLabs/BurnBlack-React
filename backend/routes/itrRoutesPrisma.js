// ITR Routes for Prisma/PostgreSQL Backend
// Enhanced routes implementing the PLATFORM_UPGRADE_PLAN.md ITR JSON system

const express = require('express');
const router = express.Router();
const ITRControllerPrisma = require('../controllers/ITRControllerPrisma');
const { verifyToken, requireAdmin } = require('../middleware/authMiddlewarePrisma');
const { body, param, query, validationResult } = require('express-validator');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// ========================================
// ITR JSON GENERATION ROUTES
// ========================================

// Generate ITR JSON
router.post('/generate-json',
  verifyToken,
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('itrType').optional().isIn(['ITR-1', 'ITR-2', 'ITR-3', 'ITR-4', 'AUTO']).withMessage('Invalid ITR type'),
    body('assessmentYear').optional().matches(/^\d{4}-\d{2}$/).withMessage('Invalid assessment year format (YYYY-YY)')
  ],
  handleValidationErrors,
  ITRControllerPrisma.generateITRJSON
);

// Download ITR JSON file
router.get('/download/:checksum',
  [
    param('checksum').isLength({ min: 32, max: 32 }).withMessage('Invalid checksum format')
  ],
  handleValidationErrors,
  ITRControllerPrisma.downloadITRJSON
);

// Preview ITR JSON
router.get('/preview/:checksum',
  verifyToken,
  [
    param('checksum').isLength({ min: 32, max: 32 }).withMessage('Invalid checksum format')
  ],
  handleValidationErrors,
  ITRControllerPrisma.previewITRJSON
);

// ========================================
// ITR VALIDATION & CALCULATION ROUTES
// ========================================

// Validate ITR data completeness
router.post('/validate',
  verifyToken,
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('itrType').optional().isIn(['ITR-1', 'ITR-2', 'ITR-3', 'ITR-4', 'AUTO']).withMessage('Invalid ITR type')
  ],
  handleValidationErrors,
  ITRControllerPrisma.validateITRData
);

// Get tax calculation breakdown
router.get('/tax-calculation/:userId',
  verifyToken,
  [
    param('userId').notEmpty().withMessage('User ID is required'),
    query('regime').optional().isIn(['OLD', 'NEW', 'BOTH']).withMessage('Invalid tax regime')
  ],
  handleValidationErrors,
  ITRControllerPrisma.getTaxCalculation
);

// Real-time tax calculator (for live updates)
router.post('/calculate-live',
  verifyToken,
  [
    body('income').isObject().withMessage('Income data is required'),
    body('deductions').optional().isObject(),
    body('regime').optional().isIn(['OLD', 'NEW']).withMessage('Invalid tax regime')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const ITRJSONGeneratorPrisma = require('../services/ITRJSONGeneratorPrisma');
      const generator = new ITRJSONGeneratorPrisma();
      
      const { income, deductions = {}, regime = 'OLD' } = req.body;
      
      // Calculate tax based on provided data
      const taxableIncome = (income.total || 0) - (deductions.total || 0);
      
      let taxCalculation;
      if (regime === 'OLD') {
        taxCalculation = generator.calculateOldRegimeTax(taxableIncome);
      } else {
        taxCalculation = generator.calculateNewRegimeTax(income.total || 0);
      }

      res.json({
        success: true,
        data: {
          income: income.total || 0,
          deductions: deductions.total || 0,
          taxableIncome,
          regime,
          taxCalculation,
          calculatedAt: new Date()
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Live calculation failed',
        error: error.message
      });
    }
  }
);

// ========================================
// ITR HISTORY & MANAGEMENT ROUTES
// ========================================

// Get user's ITR generation history
router.get('/history/:userId',
  verifyToken,
  [
    param('userId').notEmpty().withMessage('User ID is required'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative')
  ],
  handleValidationErrors,
  ITRControllerPrisma.getITRHistory
);

// Delete ITR generation record
router.delete('/generation/:generationId',
  verifyToken,
  [
    param('generationId').notEmpty().withMessage('Generation ID is required'),
    body('userId').notEmpty().withMessage('User ID is required for security')
  ],
  handleValidationErrors,
  ITRControllerPrisma.deleteITRGeneration
);

// ========================================
// ITR TYPE RECOMMENDATION ROUTES
// ========================================

// Get ITR type recommendation
router.get('/recommend/:userId',
  verifyToken,
  [
    param('userId').notEmpty().withMessage('User ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const ITRJSONGeneratorPrisma = require('../services/ITRJSONGeneratorPrisma');
      const generator = new ITRJSONGeneratorPrisma();
      
      const userData = await generator.aggregateUserData(req.params.userId);
      const recommendedITR = generator.recommendITRType(userData);
      const validation = await generator.validateDataCompleteness(userData);

      res.json({
        success: true,
        data: {
          recommendedITR,
          reason: getITRRecommendationReason(userData, recommendedITR),
          validation,
          alternatives: getAlternativeITRTypes(userData),
          requirements: getITRRequirements(recommendedITR)
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'ITR recommendation failed',
        error: error.message
      });
    }
  }
);

// ========================================
// COMPARISON & ANALYTICS ROUTES
// ========================================

// Compare tax regimes
router.get('/regime-comparison/:userId',
  verifyToken,
  [
    param('userId').notEmpty().withMessage('User ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const ITRJSONGeneratorPrisma = require('../services/ITRJSONGeneratorPrisma');
      const generator = new ITRJSONGeneratorPrisma();
      
      const userData = await generator.aggregateUserData(req.params.userId);
      const income = await generator.calculateIncomeAggregates(userData.user);
      const deductions = await generator.calculateDeductionAggregates(userData.user);
      
      const oldRegimeTax = generator.calculateOldRegimeTax(income.totalIncome - deductions.totalDeductions);
      const newRegimeTax = generator.calculateNewRegimeTax(income.totalIncome);

      const comparison = {
        oldRegime: {
          ...oldRegimeTax,
          availableDeductions: deductions.totalDeductions,
          taxableIncome: income.totalIncome - deductions.totalDeductions
        },
        newRegime: {
          ...newRegimeTax,
          availableDeductions: 50000, // Standard deduction only
          taxableIncome: Math.max(0, income.totalIncome - 50000)
        },
        recommendation: oldRegimeTax.totalTax <= newRegimeTax.totalTax ? 'OLD' : 'NEW',
        savings: Math.abs(oldRegimeTax.totalTax - newRegimeTax.totalTax),
        breakeven: calculateBreakevenPoint(income, deductions)
      };

      res.json({
        success: true,
        data: comparison
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Regime comparison failed',
        error: error.message
      });
    }
  }
);

// ========================================
// ADMIN ROUTES
// ========================================

// Bulk ITR generation (Admin only)
router.post('/bulk-generate',
  verifyToken,
  requireAdmin,
  [
    body('userIds').isArray({ min: 1 }).withMessage('User IDs array is required'),
    body('itrType').optional().isIn(['ITR-1', 'ITR-2', 'ITR-3', 'ITR-4']).withMessage('Invalid ITR type'),
    body('assessmentYear').optional().matches(/^\d{4}-\d{2}$/).withMessage('Invalid assessment year format')
  ],
  handleValidationErrors,
  ITRControllerPrisma.bulkGenerateITR
);

// ITR statistics (Admin only)
router.get('/statistics',
  verifyToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      const stats = await Promise.all([
        prisma.iTRGeneration.count(),
        prisma.iTRGeneration.groupBy({
          by: ['itrType'],
          _count: { _all: true }
        }),
        prisma.iTRGeneration.groupBy({
          by: ['assessmentYear'],
          _count: { _all: true }
        }),
        prisma.iTRGeneration.aggregate({
          _sum: { downloadCount: true }
        })
      ]);

      res.json({
        success: true,
        data: {
          totalGenerations: stats[0],
          byITRType: stats[1],
          byAssessmentYear: stats[2],
          totalDownloads: stats[3]._sum.downloadCount || 0,
          generatedAt: new Date()
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch ITR statistics'
      });
    }
  }
);

// ========================================
// UTILITY FUNCTIONS
// ========================================

function getITRRecommendationReason(userData, recommendedITR) {
  const { income } = userData;
  
  switch (recommendedITR) {
    case 'ITR-1':
      return 'Income primarily from salary/pension and within ₹50 lakh limit';
    case 'ITR-2':
      return 'Income includes capital gains or multiple sources';
    case 'ITR-3':
      return 'Income from business or profession';
    case 'ITR-4':
      return 'Presumptive business income under Section 44AD/44ADA';
    default:
      return 'Based on income sources and amount';
  }
}

function getAlternativeITRTypes(userData) {
  const alternatives = [];
  const { income } = userData;
  
  if (income.totalIncome <= 5000000 && !income.business.netProfit) {
    alternatives.push({ type: 'ITR-1', reason: 'If eligible under income and source criteria' });
  }
  
  alternatives.push({ type: 'ITR-2', reason: 'For most individual taxpayers' });
  
  if (income.business.netProfit > 0) {
    alternatives.push({ type: 'ITR-3', reason: 'For business income' });
    if (income.business.turnover <= 20000000) {
      alternatives.push({ type: 'ITR-4', reason: 'For presumptive taxation' });
    }
  }
  
  return alternatives;
}

function getITRRequirements(itrType) {
  const requirements = {
    'ITR-1': [
      'Resident individual',
      'Income up to ₹50 lakh',
      'Income from salary/pension only',
      'House property income (one house)',
      'Other sources (interest, etc.)'
    ],
    'ITR-2': [
      'Resident/Non-resident individual',
      'Income from capital gains',
      'Income from multiple house properties',
      'Foreign assets/income'
    ],
    'ITR-3': [
      'Income from business/profession',
      'Partnership firm income',
      'Detailed books of accounts required'
    ],
    'ITR-4': [
      'Presumptive business income',
      'Turnover up to ₹2 crore (44AD)',
      'Professional income up to ₹50 lakh (44ADA)'
    ]
  };
  
  return requirements[itrType] || [];
}

function calculateBreakevenPoint(income, deductions) {
  // Simplified breakeven calculation
  const deductionBenefit = deductions.totalDeductions * 0.30; // Assuming 30% tax bracket
  const newRegimeBenefit = 50000; // Additional exemption in new regime
  
  return {
    deductionAmount: deductions.totalDeductions,
    taxSavings: deductionBenefit,
    breakeven: deductionBenefit > newRegimeBenefit ? 'OLD_REGIME_BETTER' : 'NEW_REGIME_BETTER'
  };
}

module.exports = router;