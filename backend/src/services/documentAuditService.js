const Document = require('../models/document');
const DocumentAudit = require('../models/documentAudit');
const { AppError } = require('../utils/appError');
const config = require('../config');
const mongoose = require('mongoose');

class DocumentAuditService {
  constructor() {
    this.retentionPeriod = config.audit.retentionPeriod || 365; // Days
    this.batchSize = config.audit.batchSize || 1000;
  }

  /**
   * Log document activity
   * @param {string} documentId - Document ID
   * @param {string} userId - User ID
   * @param {string} action - Action performed
   * @param {Object} details - Additional details
   * @returns {Object} Audit log entry
   */
  async logActivity(documentId, userId, action, details = {}) {
    try {
      const audit = new DocumentAudit({
        documentId: new mongoose.Types.ObjectId(documentId),
        userId: new mongoose.Types.ObjectId(userId),
        action,
        details,
        timestamp: new Date()
      });

      await audit.save();

      // Update document's last activity
      await Document.findByIdAndUpdate(documentId, {
        $set: {
          'metadata.lastActivity': {
            action,
            timestamp: audit.timestamp,
            userId
          }
        }
      });

      return audit;
    } catch (error) {
      throw new AppError(error.message || 'Error logging activity', error.statusCode || 500);
    }
  }

  /**
   * Get document audit trail
   * @param {string} documentId - Document ID
   * @param {Object} options - Query options
   * @returns {Array} Audit trail
   */
  async getAuditTrail(documentId, options = {}) {
    const {
      startDate,
      endDate,
      action,
      userId,
      limit = 50,
      skip = 0,
      sort = { timestamp: -1 }
    } = options;

    const query = { documentId: new mongoose.Types.ObjectId(documentId) };

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    if (action) query.action = action;
    if (userId) query.userId = new mongoose.Types.ObjectId(userId);

    const auditTrail = await DocumentAudit.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email');

    return auditTrail;
  }

  /**
   * Get user activity
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Array} User activity
   */
  async getUserActivity(userId, options = {}) {
    const {
      startDate,
      endDate,
      action,
      documentId,
      limit = 50,
      skip = 0,
      sort = { timestamp: -1 }
    } = options;

    const query = { userId: new mongoose.Types.ObjectId(userId) };

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    if (action) query.action = action;
    if (documentId) query.documentId = new mongoose.Types.ObjectId(documentId);

    const activity = await DocumentAudit.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('documentId', 'fileName documentType');

    return activity;
  }

  /**
   * Get activity statistics
   * @param {Object} options - Query options
   * @returns {Object} Activity statistics
   */
  async getActivityStats(options = {}) {
    const {
      startDate,
      endDate,
      groupBy = 'day'
    } = options;

    const match = {};
    if (startDate || endDate) {
      match.timestamp = {};
      if (startDate) match.timestamp.$gte = new Date(startDate);
      if (endDate) match.timestamp.$lte = new Date(endDate);
    }

    const group = {
      _id: {
        $dateToString: {
          format: groupBy === 'day' ? '%Y-%m-%d' : '%Y-%m',
          date: '$timestamp'
        }
      },
      count: { $sum: 1 },
      actions: { $addToSet: '$action' }
    };

    const stats = await DocumentAudit.aggregate([
      { $match: match },
      { $group: group },
      { $sort: { _id: 1 } }
    ]);

    return stats.map(stat => ({
      date: stat._id,
      count: stat.count,
      actions: stat.actions
    }));
  }

  /**
   * Get action statistics
   * @param {Object} options - Query options
   * @returns {Object} Action statistics
   */
  async getActionStats(options = {}) {
    const {
      startDate,
      endDate
    } = options;

    const match = {};
    if (startDate || endDate) {
      match.timestamp = {};
      if (startDate) match.timestamp.$gte = new Date(startDate);
      if (endDate) match.timestamp.$lte = new Date(endDate);
    }

    const stats = await DocumentAudit.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' },
          uniqueDocuments: { $addToSet: '$documentId' }
        }
      },
      {
        $project: {
          action: '$_id',
          count: 1,
          uniqueUsers: { $size: '$uniqueUsers' },
          uniqueDocuments: { $size: '$uniqueDocuments' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return stats;
  }

  /**
   * Get user statistics
   * @param {Object} options - Query options
   * @returns {Object} User statistics
   */
  async getUserStats(options = {}) {
    const {
      startDate,
      endDate,
      limit = 10
    } = options;

    const match = {};
    if (startDate || endDate) {
      match.timestamp = {};
      if (startDate) match.timestamp.$gte = new Date(startDate);
      if (endDate) match.timestamp.$lte = new Date(endDate);
    }

    const stats = await DocumentAudit.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 },
          actions: { $addToSet: '$action' },
          documents: { $addToSet: '$documentId' }
        }
      },
      {
        $project: {
          userId: '$_id',
          count: 1,
          uniqueActions: { $size: '$actions' },
          uniqueDocuments: { $size: '$documents' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);

    return stats;
  }

  /**
   * Clean up old audit logs
   * @param {number} days - Days to retain
   */
  async cleanupAuditLogs(days = this.retentionPeriod) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    let deleted = 0;
    let batch;

    do {
      batch = await DocumentAudit.find({
        timestamp: { $lt: cutoffDate }
      })
        .limit(this.batchSize)
        .lean();

      if (batch.length > 0) {
        const ids = batch.map(log => log._id);
        await DocumentAudit.deleteMany({ _id: { $in: ids } });
        deleted += batch.length;
      }
    } while (batch.length === this.batchSize);

    return deleted;
  }

  /**
   * Export audit logs
   * @param {Object} options - Export options
   * @returns {Object} Export data
   */
  async exportAuditLogs(options = {}) {
    const {
      startDate,
      endDate,
      format = 'json'
    } = options;

    const query = {};
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const logs = await DocumentAudit.find(query)
      .sort({ timestamp: 1 })
      .populate('userId', 'name email')
      .populate('documentId', 'fileName documentType')
      .lean();

    if (format === 'csv') {
      return this.convertToCsv(logs);
    }

    return logs;
  }

  /**
   * Convert logs to CSV
   * @param {Array} logs - Audit logs
   * @returns {string} CSV data
   */
  convertToCsv(logs) {
    const headers = [
      'Timestamp',
      'Document ID',
      'Document Name',
      'Document Type',
      'User ID',
      'User Name',
      'User Email',
      'Action',
      'Details'
    ];

    const rows = logs.map(log => [
      log.timestamp.toISOString(),
      log.documentId?._id || '',
      log.documentId?.fileName || '',
      log.documentId?.documentType || '',
      log.userId?._id || '',
      log.userId?.name || '',
      log.userId?.email || '',
      log.action,
      JSON.stringify(log.details)
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  }

  /**
   * Schedule cleanup job
   */
  scheduleCleanup() {
    // Run daily at midnight
    const schedule = '0 0 * * *';
    const job = {
      name: 'audit-cleanup',
      schedule,
      handler: () => this.cleanupAuditLogs()
    };

    // Add to job scheduler
    require('../utils/scheduler').addJob(job);
  }
}

module.exports = new DocumentAuditService(); 