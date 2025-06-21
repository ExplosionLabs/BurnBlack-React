const Document = require('../models/document');
const { AppError } = require('../utils/appError');
const DocumentAuditService = require('./documentAuditService');
const DocumentNotificationService = require('./documentNotificationService');
const config = require('../config');

class DocumentExpiryService {
  constructor() {
    this.expiryThresholds = config.expiry.thresholds || {
      critical: 30, // Days
      warning: 90
    };
  }

  /**
   * Get document expiry status
   * @param {Object} document - Document object
   * @returns {Object} Expiry status
   */
  async getExpiryStatus(document) {
    if (!document.expiryDate) {
      return {
        status: 'NO_EXPIRY',
        daysRemaining: null,
        isExpired: false,
        isCritical: false,
        isWarning: false
      };
    }

    const now = new Date();
    const expiryDate = new Date(document.expiryDate);
    const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

    const status = {
      daysRemaining,
      isExpired: daysRemaining <= 0,
      isCritical: daysRemaining > 0 && daysRemaining <= this.expiryThresholds.critical,
      isWarning: daysRemaining > this.expiryThresholds.critical && daysRemaining <= this.expiryThresholds.warning
    };

    if (status.isExpired) {
      status.status = 'EXPIRED';
    } else if (status.isCritical) {
      status.status = 'CRITICAL';
    } else if (status.isWarning) {
      status.status = 'WARNING';
    } else {
      status.status = 'VALID';
    }

    return status;
  }

  /**
   * Update document expiry
   * @param {string} documentId - Document ID
   * @param {Date} expiryDate - New expiry date
   * @param {string} userId - User ID
   * @returns {Object} Updated document
   */
  async updateExpiry(documentId, expiryDate, userId) {
    const document = await Document.findById(documentId);
    if (!document) {
      throw new AppError('Document not found', 404);
    }

    const oldExpiryDate = document.expiryDate;
    document.expiryDate = expiryDate;

    await document.save();

    // Log expiry update
    await DocumentAuditService.logActivity(
      documentId,
      userId,
      'EXPIRY_UPDATED',
      {
        oldExpiryDate,
        newExpiryDate: expiryDate
      }
    );

    // Get new expiry status
    const expiryStatus = await this.getExpiryStatus(document);

    // Send notification if status changed
    if (expiryStatus.status !== 'VALID') {
      await DocumentNotificationService.processDocumentNotification(
        documentId,
        expiryStatus.isExpired ? 'documentExpired' : 'documentExpiring',
        { expiryStatus }
      );
    }

    return {
      document,
      expiryStatus
    };
  }

  /**
   * Process document expiry
   * @param {string} documentId - Document ID
   * @returns {Object} Processing result
   */
  async processDocumentExpiry(documentId) {
    const document = await Document.findById(documentId);
    if (!document) {
      throw new AppError('Document not found', 404);
    }

    const expiryStatus = await this.getExpiryStatus(document);

    if (expiryStatus.isExpired) {
      // Update document status
      document.status = 'EXPIRED';
      await document.save();

      // Log expiry
      await DocumentAuditService.logActivity(
        documentId,
        'system',
        'DOCUMENT_EXPIRED',
        { expiryStatus }
      );

      // Send notification
      await DocumentNotificationService.processDocumentNotification(
        documentId,
        'documentExpired',
        { expiryStatus }
      );
    }

    return {
      document,
      expiryStatus
    };
  }

  /**
   * Get expiring documents
   * @param {Object} options - Query options
   * @returns {Array} Expiring documents
   */
  async getExpiringDocuments(options = {}) {
    const {
      status,
      days,
      limit = 50,
      skip = 0
    } = options;

    const now = new Date();
    const query = {
      expiryDate: { $exists: true, $ne: null },
      status: { $ne: 'EXPIRED' }
    };

    if (status) {
      query.status = status;
    }

    if (days) {
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() + days);
      query.expiryDate = { $lte: targetDate };
    }

    const documents = await Document.find(query)
      .sort({ expiryDate: 1 })
      .skip(skip)
      .limit(limit);

    const results = await Promise.all(
      documents.map(async doc => ({
        document: doc,
        expiryStatus: await this.getExpiryStatus(doc)
      }))
    );

    return results;
  }

  /**
   * Get expiry statistics
   * @returns {Object} Expiry statistics
   */
  async getExpiryStats() {
    const now = new Date();
    const criticalDate = new Date(now);
    criticalDate.setDate(criticalDate.getDate() + this.expiryThresholds.critical);
    const warningDate = new Date(now);
    warningDate.setDate(warningDate.getDate() + this.expiryThresholds.warning);

    const [
      totalDocuments,
      expiredDocuments,
      criticalDocuments,
      warningDocuments,
      typeStats
    ] = await Promise.all([
      Document.countDocuments({ expiryDate: { $exists: true } }),
      Document.countDocuments({
        expiryDate: { $lt: now },
        status: { $ne: 'EXPIRED' }
      }),
      Document.countDocuments({
        expiryDate: {
          $gt: now,
          $lte: criticalDate
        },
        status: { $ne: 'EXPIRED' }
      }),
      Document.countDocuments({
        expiryDate: {
          $gt: criticalDate,
          $lte: warningDate
        },
        status: { $ne: 'EXPIRED' }
      }),
      Document.aggregate([
        {
          $match: {
            expiryDate: { $exists: true }
          }
        },
        {
          $group: {
            _id: '$documentType',
            total: { $sum: 1 },
            expired: {
              $sum: {
                $cond: [
                  { $lt: ['$expiryDate', now] },
                  1,
                  0
                ]
              }
            },
            critical: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $gt: ['$expiryDate', now] },
                      { $lte: ['$expiryDate', criticalDate] }
                    ]
                  },
                  1,
                  0
                ]
              }
            },
            warning: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $gt: ['$expiryDate', criticalDate] },
                      { $lte: ['$expiryDate', warningDate] }
                    ]
                  },
                  1,
                  0
                ]
              }
            }
          }
        }
      ])
    ]);

    return {
      total: totalDocuments,
      expired: expiredDocuments,
      critical: criticalDocuments,
      warning: warningDocuments,
      byType: typeStats.reduce((acc, curr) => ({
        ...acc,
        [curr._id]: {
          total: curr.total,
          expired: curr.expired,
          critical: curr.critical,
          warning: curr.warning
        }
      }), {})
    };
  }

  /**
   * Process all document expiries
   */
  async processAllExpiries() {
    const documents = await Document.find({
      expiryDate: { $exists: true },
      status: { $ne: 'EXPIRED' }
    });

    const results = await Promise.all(
      documents.map(doc => this.processDocumentExpiry(doc._id))
    );

    return {
      processed: results.length,
      expired: results.filter(r => r.expiryStatus.isExpired).length,
      critical: results.filter(r => r.expiryStatus.isCritical).length,
      warning: results.filter(r => r.expiryStatus.isWarning).length
    };
  }

  /**
   * Schedule expiry processing
   */
  scheduleProcessing() {
    // Run daily at midnight
    const schedule = '0 0 * * *';
    const job = {
      name: 'expiry-processing',
      schedule,
      handler: () => this.processAllExpiries()
    };

    // Add to job scheduler
    require('../utils/scheduler').addJob(job);
  }
}

module.exports = new DocumentExpiryService(); 