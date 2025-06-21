const Document = require('../models/document');
const User = require('../models/user');
const { AppError } = require('../utils/appError');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const config = require('../config');

class DocumentShareService {
  constructor() {
    this.shareExpiryTimes = {
      TEMPORARY: 24 * 60 * 60 * 1000, // 24 hours
      SHORT_TERM: 7 * 24 * 60 * 60 * 1000, // 7 days
      LONG_TERM: 30 * 24 * 60 * 60 * 1000 // 30 days
    };
  }

  /**
   * Generate share token
   * @param {string} documentId - Document ID
   * @param {string} userId - User ID
   * @returns {string} Share token
   */
  generateShareToken(documentId, userId) {
    const data = `${documentId}:${userId}:${Date.now()}`;
    return crypto
      .createHmac('sha256', config.jwtSecret)
      .update(data)
      .digest('hex');
  }

  /**
   * Share document
   * @param {string} documentId - Document ID
   * @param {string} ownerId - Owner user ID
   * @param {Object} shareOptions - Share options
   * @returns {Object} Share information
   */
  async shareDocument(documentId, ownerId, shareOptions) {
    try {
      const document = await Document.findOne({
        _id: documentId,
        userId: ownerId
      });

      if (!document) {
        throw new AppError('Document not found', 404);
      }

      const {
        recipientEmail,
        accessLevel = 'VIEW',
        expiryType = 'TEMPORARY',
        password = null,
        allowedActions = ['VIEW']
      } = shareOptions;

      // Validate recipient
      const recipient = await User.findOne({ email: recipientEmail });
      if (!recipient) {
        throw new AppError('Recipient not found', 404);
      }

      // Generate share token
      const shareToken = this.generateShareToken(documentId, ownerId);

      // Calculate expiry
      const expiresAt = new Date(Date.now() + this.shareExpiryTimes[expiryType]);

      // Create share record
      const share = {
        token: shareToken,
        documentId,
        ownerId,
        recipientId: recipient._id,
        accessLevel,
        allowedActions,
        password: password ? await this.hashPassword(password) : null,
        expiresAt,
        createdAt: new Date()
      };

      // Update document metadata
      document.metadata.set('shares', [
        ...(document.metadata.get('shares') || []),
        share
      ]);

      await document.save();

      return {
        shareToken,
        shareUrl: `${config.frontendUrl}/shared/${shareToken}`,
        expiresAt,
        accessLevel,
        allowedActions
      };
    } catch (error) {
      throw new AppError(error.message || 'Error sharing document', error.statusCode || 500);
    }
  }

  /**
   * Hash password for share access
   * @param {string} password - Share password
   * @returns {string} Hashed password
   */
  async hashPassword(password) {
    return crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');
  }

  /**
   * Verify share access
   * @param {string} shareToken - Share token
   * @param {string} password - Share password (if required)
   * @returns {Object} Share information
   */
  async verifyShareAccess(shareToken, password = null) {
    const document = await Document.findOne({
      'metadata.shares.token': shareToken
    });

    if (!document) {
      throw new AppError('Invalid share token', 404);
    }

    const share = document.metadata.get('shares').find(s => s.token === shareToken);

    if (!share) {
      throw new AppError('Share not found', 404);
    }

    // Check expiry
    if (new Date() > share.expiresAt) {
      throw new AppError('Share link has expired', 403);
    }

    // Check password if required
    if (share.password) {
      if (!password) {
        throw new AppError('Password required', 401);
      }

      const hashedPassword = await this.hashPassword(password);
      if (hashedPassword !== share.password) {
        throw new AppError('Invalid password', 401);
      }
    }

    return {
      document,
      share,
      accessLevel: share.accessLevel,
      allowedActions: share.allowedActions
    };
  }

  /**
   * Revoke share access
   * @param {string} documentId - Document ID
   * @param {string} ownerId - Owner user ID
   * @param {string} shareToken - Share token to revoke
   */
  async revokeShareAccess(documentId, ownerId, shareToken) {
    const document = await Document.findOne({
      _id: documentId,
      userId: ownerId
    });

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    const shares = document.metadata.get('shares') || [];
    const updatedShares = shares.filter(share => share.token !== shareToken);

    document.metadata.set('shares', updatedShares);
    await document.save();
  }

  /**
   * Update share access
   * @param {string} documentId - Document ID
   * @param {string} ownerId - Owner user ID
   * @param {string} shareToken - Share token
   * @param {Object} updateOptions - Update options
   */
  async updateShareAccess(documentId, ownerId, shareToken, updateOptions) {
    const document = await Document.findOne({
      _id: documentId,
      userId: ownerId
    });

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    const shares = document.metadata.get('shares') || [];
    const shareIndex = shares.findIndex(share => share.token === shareToken);

    if (shareIndex === -1) {
      throw new AppError('Share not found', 404);
    }

    const share = shares[shareIndex];
    const {
      accessLevel,
      allowedActions,
      expiryType,
      password
    } = updateOptions;

    // Update share properties
    if (accessLevel) share.accessLevel = accessLevel;
    if (allowedActions) share.allowedActions = allowedActions;
    if (expiryType) {
      share.expiresAt = new Date(Date.now() + this.shareExpiryTimes[expiryType]);
    }
    if (password !== undefined) {
      share.password = password ? await this.hashPassword(password) : null;
    }

    document.metadata.set('shares', shares);
    await document.save();
  }

  /**
   * Get shared documents
   * @param {string} userId - User ID
   * @returns {Array} Shared documents
   */
  async getSharedDocuments(userId) {
    const documents = await Document.find({
      'metadata.shares.recipientId': userId
    });

    return documents.map(doc => {
      const share = doc.metadata.get('shares').find(s => s.recipientId.toString() === userId);
      return {
        ...doc.toObject(),
        share: {
          token: share.token,
          accessLevel: share.accessLevel,
          allowedActions: share.allowedActions,
          expiresAt: share.expiresAt
        }
      };
    });
  }

  /**
   * Get document shares
   * @param {string} documentId - Document ID
   * @param {string} ownerId - Owner user ID
   * @returns {Array} Share information
   */
  async getDocumentShares(documentId, ownerId) {
    const document = await Document.findOne({
      _id: documentId,
      userId: ownerId
    });

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    const shares = document.metadata.get('shares') || [];
    const recipientIds = shares.map(share => share.recipientId);

    const recipients = await User.find({
      _id: { $in: recipientIds }
    }).select('email name');

    return shares.map(share => {
      const recipient = recipients.find(r => r._id.toString() === share.recipientId.toString());
      return {
        ...share,
        recipient: {
          email: recipient.email,
          name: recipient.name
        }
      };
    });
  }
}

module.exports = new DocumentShareService(); 