const Document = require('../models/document');
const User = require('../models/user');
const { AppError } = require('../utils/appError');
const DocumentAuditService = require('./documentAuditService');
const DocumentExpiryService = require('./documentExpiryService');
const config = require('../config');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

class DocumentNotificationService {
  constructor() {
    // Initialize email transporter
    this.emailTransporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.password
      }
    });

    // Initialize Twilio client
    this.twilioClient = twilio(
      config.twilio.accountSid,
      config.twilio.authToken
    );

    // Notification templates
    this.templates = {
      documentUploaded: {
        email: {
          subject: 'Document Uploaded Successfully',
          template: 'document-uploaded'
        },
        sms: {
          template: 'Your document has been uploaded successfully. Document ID: {{documentId}}'
        }
      },
      documentVerified: {
        email: {
          subject: 'Document Verified',
          template: 'document-verified'
        },
        sms: {
          template: 'Your document has been verified. Document ID: {{documentId}}'
        }
      },
      documentRejected: {
        email: {
          subject: 'Document Rejected',
          template: 'document-rejected'
        },
        sms: {
          template: 'Your document has been rejected. Reason: {{reason}}. Document ID: {{documentId}}'
        }
      },
      documentExpiring: {
        email: {
          subject: 'Document Expiring Soon',
          template: 'document-expiring'
        },
        sms: {
          template: 'Your document will expire in {{daysRemaining}} days. Document ID: {{documentId}}'
        }
      },
      documentExpired: {
        email: {
          subject: 'Document Expired',
          template: 'document-expired'
        },
        sms: {
          template: 'Your document has expired. Please upload a new one. Document ID: {{documentId}}'
        }
      },
      documentShared: {
        email: {
          subject: 'Document Shared With You',
          template: 'document-shared'
        },
        sms: {
          template: 'A document has been shared with you. Access it at: {{shareUrl}}'
        }
      },
      documentAccessRevoked: {
        email: {
          subject: 'Document Access Revoked',
          template: 'document-access-revoked'
        },
        sms: {
          template: 'Your access to document {{documentId}} has been revoked.'
        }
      }
    };
  }

  /**
   * Send notification
   * @param {string} userId - User ID
   * @param {string} type - Notification type
   * @param {Object} data - Notification data
   * @param {Object} options - Notification options
   */
  async sendNotification(userId, type, data, options = {}) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      const template = this.templates[type];
      if (!template) {
        throw new AppError('Invalid notification type', 400);
      }

      const notificationData = {
        ...data,
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone
      };

      // Send notifications based on user preferences
      const notifications = [];

      if (user.notificationPreferences?.email && template.email) {
        notifications.push(
          this.sendEmailNotification(user, template.email, notificationData)
        );
      }

      if (user.notificationPreferences?.sms && template.sms && user.phone) {
        notifications.push(
          this.sendSmsNotification(user, template.sms, notificationData)
        );
      }

      if (user.notificationPreferences?.push && template.push) {
        notifications.push(
          this.sendPushNotification(user, template.push, notificationData)
        );
      }

      await Promise.all(notifications);

      // Log notification activity
      await DocumentAuditService.logActivity(
        data.documentId,
        userId,
        'NOTIFICATION_SENT',
        {
          type,
          channels: Object.keys(user.notificationPreferences || {}).filter(
            channel => user.notificationPreferences[channel]
          )
        }
      );
    } catch (error) {
      throw new AppError(error.message || 'Error sending notification', error.statusCode || 500);
    }
  }

  /**
   * Send email notification
   * @param {Object} user - User object
   * @param {Object} template - Email template
   * @param {Object} data - Notification data
   */
  async sendEmailNotification(user, template, data) {
    const { subject, template: templateName } = template;

    // Get email template
    const emailTemplate = await this.getEmailTemplate(templateName, data);

    // Send email
    await this.emailTransporter.sendMail({
      from: config.email.from,
      to: user.email,
      subject: this.replacePlaceholders(subject, data),
      html: emailTemplate
    });
  }

  /**
   * Send SMS notification
   * @param {Object} user - User object
   * @param {Object} template - SMS template
   * @param {Object} data - Notification data
   */
  async sendSmsNotification(user, template, data) {
    const message = this.replacePlaceholders(template.template, data);

    // Send SMS
    await this.twilioClient.messages.create({
      body: message,
      to: user.phone,
      from: config.twilio.phoneNumber
    });
  }

  /**
   * Send push notification
   * @param {Object} user - User object
   * @param {Object} template - Push template
   * @param {Object} data - Notification data
   */
  async sendPushNotification(user, template, data) {
    // Implement push notification logic here
    // This could use Firebase Cloud Messaging, OneSignal, or other push services
    console.log('Push notification:', {
      userId: user._id,
      template,
      data
    });
  }

  /**
   * Get email template
   * @param {string} templateName - Template name
   * @param {Object} data - Template data
   * @returns {string} Rendered template
   */
  async getEmailTemplate(templateName, data) {
    // Implement template rendering logic here
    // This could use a template engine like Handlebars, EJS, etc.
    return `Template: ${templateName}, Data: ${JSON.stringify(data)}`;
  }

  /**
   * Replace placeholders in template
   * @param {string} template - Template string
   * @param {Object} data - Template data
   * @returns {string} Processed template
   */
  replacePlaceholders(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] || match);
  }

  /**
   * Process document notifications
   * @param {string} documentId - Document ID
   * @param {string} type - Notification type
   * @param {Object} data - Additional data
   */
  async processDocumentNotification(documentId, type, data = {}) {
    const document = await Document.findById(documentId);
    if (!document) {
      throw new AppError('Document not found', 404);
    }

    const notificationData = {
      documentId: document._id,
      documentType: document.documentType,
      documentName: document.fileName,
      ...data
    };

    await this.sendNotification(document.userId, type, notificationData);
  }

  /**
   * Process document expiry notifications
   */
  async processExpiryNotifications() {
    const documents = await Document.find({
      status: { $in: ['VERIFIED', 'PENDING'] }
    });

    for (const document of documents) {
      const expiryStatus = await DocumentExpiryService.getExpiryStatus(document);

      if (expiryStatus.status === 'EXPIRED') {
        await this.processDocumentNotification(
          document._id,
          'documentExpired',
          { expiryStatus }
        );
      } else if (expiryStatus.status === 'CRITICAL') {
        await this.processDocumentNotification(
          document._id,
          'documentExpiring',
          { expiryStatus }
        );
      }
    }
  }

  /**
   * Process document share notifications
   * @param {string} documentId - Document ID
   * @param {string} recipientId - Recipient user ID
   * @param {Object} shareData - Share data
   */
  async processShareNotification(documentId, recipientId, shareData) {
    await this.sendNotification(
      recipientId,
      'documentShared',
      {
        documentId,
        shareUrl: shareData.shareUrl,
        accessLevel: shareData.accessLevel,
        expiresAt: shareData.expiresAt
      }
    );
  }

  /**
   * Process document access revocation notification
   * @param {string} documentId - Document ID
   * @param {string} recipientId - Recipient user ID
   */
  async processAccessRevocationNotification(documentId, recipientId) {
    await this.sendNotification(
      recipientId,
      'documentAccessRevoked',
      { documentId }
    );
  }

  /**
   * Get notification preferences
   * @param {string} userId - User ID
   * @returns {Object} Notification preferences
   */
  async getNotificationPreferences(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user.notificationPreferences || {
      email: true,
      sms: false,
      push: false
    };
  }

  /**
   * Update notification preferences
   * @param {string} userId - User ID
   * @param {Object} preferences - New preferences
   * @returns {Object} Updated preferences
   */
  async updateNotificationPreferences(userId, preferences) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.notificationPreferences = {
      ...user.notificationPreferences,
      ...preferences
    };

    await user.save();

    return user.notificationPreferences;
  }

  /**
   * Get notification statistics
   * @returns {Object} Notification statistics
   */
  async getNotificationStats() {
    const [
      totalNotifications,
      channelStats,
      typeStats
    ] = await Promise.all([
      Document.countDocuments({ 'metadata.notifications': { $exists: true } }),
      Document.aggregate([
        { $unwind: '$metadata.notifications' },
        {
          $group: {
            _id: '$metadata.notifications.channel',
            count: { $sum: 1 }
          }
        }
      ]),
      Document.aggregate([
        { $unwind: '$metadata.notifications' },
        {
          $group: {
            _id: '$metadata.notifications.type',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    return {
      totalNotifications,
      channelBreakdown: channelStats.reduce((acc, curr) => ({
        ...acc,
        [curr._id]: curr.count
      }), {}),
      typeBreakdown: typeStats.reduce((acc, curr) => ({
        ...acc,
        [curr._id]: curr.count
      }), {})
    };
  }
}

module.exports = new DocumentNotificationService(); 