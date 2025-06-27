// ITR Controller for MongoDB Backend
// Fixed version addressing critical bugs identified in analysis

const ITRJSONGenerator = require('../services/ITRJSONGenerator');
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');

// Import models for ITR generation logging
const User = require('../models/User');

// Create ITRGeneration model for logging
const ITRGenerationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itrType: { type: String, required: true, enum: ['ITR-1', 'ITR-2', 'ITR-3', 'ITR-4'] },
  fileName: { type: String, required: true },
  checksum: { type: String, required: true, unique: true },
  assessmentYear: { type: String, required: true },
  status: { type: String, enum: ['generated', 'downloaded', 'failed'], default: 'generated' },
  metadata: { type: mongoose.Schema.Types.Mixed },
  generatedAt: { type: Date, default: Date.now },
  downloadedAt: { type: Date },
  filePath: { type: String } // Store file path for downloads
});

const ITRGeneration = mongoose.model('ITRGeneration', ITRGenerationSchema);

// ========================================
// ITR JSON GENERATION ENDPOINTS
// ========================================

// Generate ITR JSON (Main endpoint) - Fixed with proper error handling
const generateITRJSON = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { userId, itrType = 'ITR-1', assessmentYear = '2024-25' } = req.body;
    
    // Fix Bug #11: Validate user ID format
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid User ID is required'
      });
    }

    // Fix Bug #6: Validate user ownership (if not admin)
    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to user data'
      });
    }

    console.log(`Starting ITR JSON generation for user ${userId}, type: ${itrType}`);

    // Initialize ITR generator
    const generator = new ITRJSONGenerator(itrType, assessmentYear);
    
    // Generate ITR JSON with transaction support
    const result = await generator.generateCompliantJSON(userId);
    
    // Fix Bug #7: Store generation log in database with transaction
    const generationLog = await ITRGeneration.create([{
      userId,
      itrType: result.itrType,
      fileName: result.fileName,
      checksum: result.checksum,
      assessmentYear,
      metadata: result.metadata,
      generatedAt: new Date()
    }], { session });

    // Optionally save file to disk (for large scale operations)
    const outputDir = path.join(process.cwd(), 'generated_itrs');
    await fs.mkdir(outputDir, { recursive: true });
    
    const filePath = path.join(outputDir, result.fileName);
    await fs.writeFile(filePath, JSON.stringify(result.data, null, 2));
    
    // Update log with file path
    await ITRGeneration.findByIdAndUpdate(
      generationLog[0]._id, 
      { filePath }, 
      { session }
    );

    await session.commitTransaction();

    console.log(`ITR JSON generated successfully: ${result.fileName}`);
    
    // Fix Bug #9: Don't expose sensitive data in response
    res.json({
      success: true,
      message: 'ITR JSON generated successfully',
      data: {
        itrType: result.itrType,
        assessmentYear: result.assessmentYear,
        fileName: result.fileName,
        checksum: result.checksum,
        downloadUrl: `/api/itr/download/${result.checksum}`,
        metadata: {
          generatedAt: result.metadata.generatedAt,
          totalIncome: result.metadata.totalIncome,
          taxPayable: result.metadata.taxPayable
        }
      }
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('ITR Generation Error:', error);
    
    // Fix Bug #9: Don't leak sensitive error information
    const errorMessage = error.message.includes('Missing required data') 
      ? error.message 
      : 'ITR generation failed due to internal error';
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      // Don't expose stack traces in production
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  } finally {
    session.endSession();
  }
};

// Download ITR JSON - Fixed with proper authorization
const downloadITRJSON = async (req, res) => {
  try {
    const { checksum } = req.params;
    
    if (!checksum) {
      return res.status(400).json({
        success: false,
        message: 'Checksum is required'
      });
    }

    // Fix Bug #6: Find ITR generation record with user validation
    const itrGeneration = await ITRGeneration.findOne({ checksum })
      .populate('userId', 'name email');
    
    if (!itrGeneration) {
      return res.status(404).json({
        success: false,
        message: 'ITR file not found'
      });
    }

    // Fix Bug #6: Validate user ownership (unless admin)
    if (req.user.role !== 'admin' && 
        req.user._id.toString() !== itrGeneration.userId._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to ITR file'
      });
    }

    // Check if file exists on disk
    if (itrGeneration.filePath && await fs.access(itrGeneration.filePath).then(() => true).catch(() => false)) {
      // Serve file from disk
      const fileContent = await fs.readFile(itrGeneration.filePath, 'utf8');
      
      // Update download timestamp
      await ITRGeneration.findByIdAndUpdate(itrGeneration._id, {
        downloadedAt: new Date(),
        status: 'downloaded'
      });

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${itrGeneration.fileName}"`);
      res.send(fileContent);
      
    } else {
      // Fix Bug #12: Don't regenerate, return error if file not found
      return res.status(410).json({
        success: false,
        message: 'ITR file has expired or been removed. Please regenerate.'
      });
    }

  } catch (error) {
    console.error('ITR Download Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download ITR file'
    });
  }
};

// Live tax calculation (for frontend preview)
const calculateLiveTax = async (req, res) => {
  try {
    const { income = {}, deductions = {}, regime = 'OLD' } = req.body;
    
    // Fix Bug #4: Validate input to prevent infinite loops
    const totalIncome = Math.max(0, parseFloat(income.total) || 0);
    const totalDeductions = Math.max(0, parseFloat(deductions.total) || 0);
    
    if (totalIncome > 100000000) { // 10 crore limit
      return res.status(400).json({
        success: false,
        message: 'Income amount too large'
      });
    }

    const generator = new ITRJSONGenerator();
    const taxableIncome = Math.max(0, totalIncome - totalDeductions);
    
    let taxCalculation;
    if (regime === 'NEW') {
      taxCalculation = generator.calculateNewRegimeTax(taxableIncome);
    } else {
      taxCalculation = generator.calculateOldRegimeTax(taxableIncome);
    }

    res.json({
      success: true,
      data: {
        taxableIncome,
        regime,
        ...taxCalculation
      }
    });

  } catch (error) {
    console.error('Live Tax Calculation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Tax calculation failed'
    });
  }
};

module.exports = {
  generateITRJSON,
  downloadITRJSON,
  calculateLiveTax,
  ITRGeneration // Export model for other services
};