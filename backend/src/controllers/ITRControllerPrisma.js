// ITR Controller for Prisma/PostgreSQL Backend
// Enhanced controller implementing the PLATFORM_UPGRADE_PLAN.md ITR JSON generation system

const ITRJSONGeneratorPrisma = require('../services/ITRJSONGeneratorPrisma');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

// ========================================
// ITR JSON GENERATION ENDPOINTS
// ========================================

// Generate ITR JSON (Main endpoint)
const generateITRJSON = async (req, res) => {
  try {
    const { userId, itrType = 'ITR-1', assessmentYear = '2024-25' } = req.body;
    
    // Validate request
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    console.log(`Starting ITR JSON generation for user ${userId}, type: ${itrType}`);

    // Initialize ITR generator
    const generator = new ITRJSONGeneratorPrisma(itrType, assessmentYear);
    
    // Generate ITR JSON
    const result = await generator.generateCompliantJSON(userId);
    
    // Store generation log in database
    const generationLog = await prisma.iTRGeneration.create({
      data: {
        userId,
        itrType,
        fileName: result.fileName,
        checksum: result.checksum,
        assessmentYear,
        generatedAt: new Date(),
        metadata: JSON.stringify(result.metadata)
      }
    });

    console.log(`ITR JSON generated successfully: ${result.fileName}`);

    res.json({
      success: true,
      message: 'ITR JSON generated successfully',
      data: {
        fileName: result.fileName,
        downloadUrl: `/api/v1/itr/download/${result.checksum}`,
        previewUrl: `/api/v1/itr/preview/${result.checksum}`,
        metadata: result.metadata,
        generationId: generationLog.id
      }
    });

  } catch (error) {
    console.error('ITR JSON generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'ITR JSON generation failed',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Download ITR JSON file
const downloadITRJSON = async (req, res) => {
  try {
    const { checksum } = req.params;
    
    // Find generation log
    const log = await prisma.iTRGeneration.findFirst({
      where: { checksum },
      include: {
        user: {
          include: {
            personalDetails: true,
            contactDetails: true
          }
        }
      }
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'ITR file not found'
      });
    }

    // Regenerate JSON (ensures latest data)
    const generator = new ITRJSONGeneratorPrisma(log.itrType, log.assessmentYear);
    const result = await generator.generateCompliantJSON(log.userId);

    // Set download headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${log.fileName}"`);
    res.setHeader('X-Generated-At', result.metadata.generatedAt);
    res.setHeader('X-ITR-Type', log.itrType);

    // Send JSON file
    res.send(JSON.stringify(result.json, null, 2));

    // Update download count
    await prisma.iTRGeneration.update({
      where: { id: log.id },
      data: { 
        downloadCount: { increment: 1 },
        lastDownloadedAt: new Date()
      }
    });

    console.log(`ITR JSON downloaded: ${log.fileName} by user ${log.userId}`);

  } catch (error) {
    console.error('ITR download error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download ITR JSON'
    });
  }
};

// Preview ITR JSON (without download)
const previewITRJSON = async (req, res) => {
  try {
    const { checksum } = req.params;
    
    const log = await prisma.iTRGeneration.findFirst({
      where: { checksum }
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'ITR file not found'
      });
    }

    // Generate preview (limited data)
    const generator = new ITRJSONGeneratorPrisma(log.itrType, log.assessmentYear);
    const result = await generator.generateCompliantJSON(log.userId);

    // Return preview with masked sensitive data
    const preview = {
      metadata: result.metadata,
      structure: {
        itrType: log.itrType,
        assessmentYear: log.assessmentYear,
        sections: Object.keys(result.json.ITR[log.itrType.replace('-', '')]),
        personalInfo: {
          name: result.json.ITR[log.itrType.replace('-', '')].PersonalInfo?.AssesseeName,
          pan: result.json.ITR[log.itrType.replace('-', '')].PersonalInfo?.PAN?.replace(/(.{4})(.*)(.{1})/, '$1****$3')
        },
        taxSummary: {
          grossIncome: result.json.ITR[log.itrType.replace('-', '')].ITR1_IncomeDeductions?.GrossTotIncome,
          taxLiability: result.json.ITR[log.itrType.replace('-', '')].ITR1_TaxComputation?.NetTaxLiability,
          refundDue: result.json.ITR[log.itrType.replace('-', '')].Refund?.RefundDue
        }
      }
    };

    res.json({
      success: true,
      data: preview
    });

  } catch (error) {
    console.error('ITR preview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate ITR preview'
    });
  }
};

// ========================================
// ITR VALIDATION & RECOMMENDATIONS
// ========================================

// Validate user data for ITR generation
const validateITRData = async (req, res) => {
  try {
    const { userId, itrType = 'AUTO' } = req.body;
    
    const generator = new ITRJSONGeneratorPrisma(itrType);
    const userData = await generator.aggregateUserData(userId);
    
    // Validate data completeness
    const validation = await generator.validateDataCompleteness(userData);
    
    // Recommend ITR type
    const recommendedITR = generator.recommendITRType(userData);
    
    // Calculate tax comparison
    const taxData = await generator.calculateTaxData(userData.user);
    
    res.json({
      success: true,
      data: {
        validation,
        recommendedITR,
        currentITR: itrType !== 'AUTO' ? itrType : recommendedITR,
        taxComparison: {
          oldRegime: taxData.oldRegime,
          newRegime: taxData.newRegime,
          recommendedRegime: taxData.recommendedRegime,
          savings: Math.abs(taxData.oldRegime.totalTax - taxData.newRegime.totalTax)
        },
        summary: {
          grossIncome: taxData.grossIncome,
          taxableIncome: taxData.taxableIncome,
          totalDeductions: taxData.totalDeductions,
          refundDue: taxData.refundDue,
          balanceTax: taxData.balanceTax
        }
      }
    });

  } catch (error) {
    console.error('ITR validation error:', error);
    res.status(500).json({
      success: false,
      message: 'ITR validation failed',
      error: error.message
    });
  }
};

// Get tax calculation breakdown
const getTaxCalculation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { regime = 'BOTH' } = req.query;

    const generator = new ITRJSONGeneratorPrisma();
    const userData = await generator.aggregateUserData(userId);
    
    const income = await generator.calculateIncomeAggregates(userData.user);
    const deductions = await generator.calculateDeductionAggregates(userData.user);
    const tax = await generator.calculateTaxData(userData.user);

    let response = {
      success: true,
      data: {
        income,
        deductions,
        regime: regime,
        calculatedAt: new Date()
      }
    };

    if (regime === 'OLD' || regime === 'BOTH') {
      response.data.oldRegime = tax.oldRegime;
    }

    if (regime === 'NEW' || regime === 'BOTH') {
      response.data.newRegime = tax.newRegime;
    }

    if (regime === 'BOTH') {
      response.data.comparison = {
        recommendedRegime: tax.recommendedRegime,
        savings: Math.abs(tax.oldRegime.totalTax - tax.newRegime.totalTax),
        oldRegimeTax: tax.oldRegime.totalTax,
        newRegimeTax: tax.newRegime.totalTax
      };
    }

    res.json(response);

  } catch (error) {
    console.error('Tax calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Tax calculation failed',
      error: error.message
    });
  }
};

// ========================================
// ITR HISTORY & MANAGEMENT
// ========================================

// Get user's ITR generation history
const getITRHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const history = await prisma.iTRGeneration.findMany({
      where: { userId },
      orderBy: { generatedAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
      select: {
        id: true,
        itrType: true,
        fileName: true,
        checksum: true,
        assessmentYear: true,
        generatedAt: true,
        downloadCount: true,
        lastDownloadedAt: true,
        metadata: true
      }
    });

    const total = await prisma.iTRGeneration.count({
      where: { userId }
    });

    res.json({
      success: true,
      data: {
        history,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: (parseInt(offset) + parseInt(limit)) < total
        }
      }
    });

  } catch (error) {
    console.error('ITR history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ITR history'
    });
  }
};

// Delete ITR generation record
const deleteITRGeneration = async (req, res) => {
  try {
    const { generationId } = req.params;
    const { userId } = req.body; // For security

    const deleted = await prisma.iTRGeneration.deleteMany({
      where: { 
        id: generationId,
        userId // Ensure user can only delete their own records
      }
    });

    if (deleted.count === 0) {
      return res.status(404).json({
        success: false,
        message: 'ITR generation record not found'
      });
    }

    res.json({
      success: true,
      message: 'ITR generation record deleted successfully'
    });

  } catch (error) {
    console.error('ITR deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete ITR generation record'
    });
  }
};

// ========================================
// BULK ITR OPERATIONS (ADMIN)
// ========================================

// Generate ITR for multiple users (Admin only)
const bulkGenerateITR = async (req, res) => {
  try {
    const { userIds, itrType = 'ITR-1', assessmentYear = '2024-25' } = req.body;
    
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User IDs array is required'
      });
    }

    const results = [];
    const errors = [];

    for (const userId of userIds) {
      try {
        const generator = new ITRJSONGeneratorPrisma(itrType, assessmentYear);
        const result = await generator.generateCompliantJSON(userId);
        
        await prisma.iTRGeneration.create({
          data: {
            userId,
            itrType,
            fileName: result.fileName,
            checksum: result.checksum,
            assessmentYear,
            generatedAt: new Date(),
            metadata: JSON.stringify(result.metadata)
          }
        });

        results.push({
          userId,
          success: true,
          fileName: result.fileName,
          checksum: result.checksum
        });

      } catch (error) {
        errors.push({
          userId,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: `Bulk ITR generation completed. ${results.length} successful, ${errors.length} failed.`,
      data: {
        successful: results,
        failed: errors,
        summary: {
          total: userIds.length,
          successful: results.length,
          failed: errors.length,
          successRate: `${((results.length / userIds.length) * 100).toFixed(2)}%`
        }
      }
    });

  } catch (error) {
    console.error('Bulk ITR generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Bulk ITR generation failed'
    });
  }
};

// ========================================
// EXPORTS
// ========================================

module.exports = {
  generateITRJSON,
  downloadITRJSON,
  previewITRJSON,
  validateITRData,
  getTaxCalculation,
  getITRHistory,
  deleteITRGeneration,
  bulkGenerateITR
};