const Document = require('../models/document');
const OCRService = require('./ocrService');
const { AppError } = require('../utils/appError');
const path = require('path');
const fs = require('fs').promises;
const config = require('../../config/database');
const { v4: uuidv4 } = require('uuid');

class DocumentService {
  /**
   * Upload and process document
   * @param {string} userId - User ID
   * @param {Object} file - Uploaded file
   * @param {Object} metadata - Document metadata
   * @returns {Object} Created document
   */
  async uploadDocument(userId, file, metadata) {
    try {
      // Generate unique storage key
      const storageKey = `${userId}/${uuidv4()}-${file.originalname}`;
      const filePath = path.join(config.uploadDir, storageKey);

      // Ensure upload directory exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });

      // Save file
      await fs.writeFile(filePath, file.buffer);

      // Extract text using OCR
      const extractedText = await OCRService.extractText(filePath, file.mimetype);

      // Extract structured data based on document type
      let extractedData = null;
      switch (metadata.documentType) {
        case 'FORM16':
          extractedData = await OCRService.extractForm16Data(extractedText);
          break;
        case 'BANK_STATEMENT':
          extractedData = await OCRService.extractBankStatementData(extractedText);
          break;
        case 'INTEREST_CERTIFICATE':
          extractedData = await OCRService.extractInterestCertificateData(extractedText);
          break;
      }

      // Create document record
      const document = new Document({
        userId,
        documentType: metadata.documentType,
        financialYear: metadata.financialYear,
        fileName: file.originalname,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        storageKey,
        url: `/api/documents/${storageKey}`,
        relatedIncome: metadata.relatedIncome,
        metadata: {
          ...metadata.metadata,
          extractedText,
          extractedData
        }
      });

      await document.save();

      // Cleanup OCR resources
      await OCRService.cleanup();

      return document;
    } catch (error) {
      // Cleanup on error
      if (filePath) {
        await fs.unlink(filePath).catch(() => {});
      }
      await OCRService.cleanup();
      throw new AppError(error.message || 'Error uploading document', error.statusCode || 500);
    }
  }

  /**
   * Get document by ID
   * @param {string} documentId - Document ID
   * @param {string} userId - User ID
   * @returns {Object} Document
   */
  async getDocument(documentId, userId) {
    const document = await Document.findOne({
      _id: documentId,
      userId
    });

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    return document;
  }

  /**
   * Get documents by type and financial year
   * @param {string} userId - User ID
   * @param {string} documentType - Document type
   * @param {string} financialYear - Financial year
   * @returns {Array} Documents
   */
  async getDocumentsByType(userId, documentType, financialYear) {
    const query = { userId, documentType };
    if (financialYear) {
      query.financialYear = financialYear;
    }

    return Document.find(query)
      .sort({ createdAt: -1 });
  }

  /**
   * Get documents by income
   * @param {string} userId - User ID
   * @param {string} incomeType - Income type
   * @param {string} incomeId - Income ID
   * @returns {Array} Documents
   */
  async getDocumentsByIncome(userId, incomeType, incomeId) {
    return Document.find({
      userId,
      'relatedIncome.incomeType': incomeType,
      'relatedIncome.incomeId': incomeId
    })
      .sort({ createdAt: -1 });
  }

  /**
   * Update document verification status
   * @param {string} documentId - Document ID
   * @param {string} userId - User ID
   * @param {boolean} isVerified - Verification status
   * @param {string} notes - Verification notes
   * @returns {Object} Updated document
   */
  async updateVerificationStatus(documentId, userId, isVerified, notes) {
    const document = await this.getDocument(documentId, userId);

    if (isVerified) {
      await document.verify(userId, notes);
    } else {
      await document.reject(userId, notes);
    }

    return document;
  }

  /**
   * Delete document
   * @param {string} documentId - Document ID
   * @param {string} userId - User ID
   */
  async deleteDocument(documentId, userId) {
    const document = await this.getDocument(documentId, userId);

    // Delete file from storage
    const filePath = path.join(config.uploadDir, document.storageKey);
    await fs.unlink(filePath).catch(() => {});

    // Delete document record
    await document.remove();
  }

  /**
   * Get document statistics
   * @param {string} userId - User ID
   * @param {string} financialYear - Financial year
   * @returns {Object} Document statistics
   */
  async getDocumentStats(userId, financialYear) {
    const query = { userId };
    if (financialYear) {
      query.financialYear = financialYear;
    }

    const [total, verified, pending, rejected] = await Promise.all([
      Document.countDocuments(query),
      Document.countDocuments({ ...query, status: 'VERIFIED' }),
      Document.countDocuments({ ...query, status: 'PENDING' }),
      Document.countDocuments({ ...query, status: 'REJECTED' })
    ]);

    const byType = await Document.aggregate([
      { $match: query },
      { $group: {
        _id: '$documentType',
        count: { $sum: 1 },
        verified: {
          $sum: { $cond: [{ $eq: ['$status', 'VERIFIED'] }, 1, 0] }
        }
      }},
      { $sort: { count: -1 } }
    ]);

    return {
      total,
      verified,
      pending,
      rejected,
      byType
    };
  }

  /**
   * Get document download URL
   * @param {string} documentId - Document ID
   * @param {string} userId - User ID
   * @returns {Object} Document download info
   */
  async getDocumentDownloadUrl(documentId, userId) {
    const document = await this.getDocument(documentId, userId);
    const filePath = path.join(config.uploadDir, document.storageKey);

    try {
      await fs.access(filePath);
      return {
        fileName: document.originalName,
        filePath
      };
    } catch (error) {
      throw new AppError('Document file not found', 404);
    }
  }
}

module.exports = new DocumentService(); 