const Document = require('../models/document');
const { AppError } = require('../utils/appError');
const DocumentAuditService = require('./documentAuditService');
const DocumentMetadataService = require('./documentMetadataService');
const config = require('../config');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const pdf = require('pdf-parse');

class DocumentStorageService {
  constructor() {
    this.storageDir = config.uploadDir;
    this.tempDir = path.join(this.storageDir, 'temp');
    this.versionsDir = path.join(this.storageDir, 'versions');
    this.thumbnailsDir = path.join(this.storageDir, 'thumbnails');

    // Ensure directories exist
    this.ensureDirectories();
  }

  /**
   * Ensure required directories exist
   */
  async ensureDirectories() {
    const directories = [
      this.storageDir,
      this.tempDir,
      this.versionsDir,
      this.thumbnailsDir
    ];

    for (const dir of directories) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
      }
    }
  }

  /**
   * Store document
   * @param {Object} file - File object
   * @param {Object} metadata - Document metadata
   * @returns {Object} Stored document
   */
  async storeDocument(file, metadata) {
    try {
      // Generate unique storage key
      const storageKey = this.generateStorageKey(file.originalname);

      // Process file based on type
      const processedFile = await this.processFile(file);

      // Store file
      const filePath = path.join(this.storageDir, storageKey);
      await fs.writeFile(filePath, processedFile.buffer);

      // Generate thumbnail if applicable
      let thumbnailKey = null;
      if (this.isImageFile(file.mimetype)) {
        thumbnailKey = await this.generateThumbnail(file.buffer, storageKey);
      }

      // Create document record
      const document = new Document({
        ...metadata,
        fileName: file.originalname,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: processedFile.size,
        storageKey,
        thumbnailKey,
        url: `/api/documents/${storageKey}`,
        status: 'PENDING',
        metadata: {
          ...metadata.metadata,
          fileHash: this.generateFileHash(processedFile.buffer),
          lastModified: new Date()
        }
      });

      await document.save();

      // Extract metadata
      await DocumentMetadataService.extractMetadata(document, processedFile.buffer);

      // Log storage activity
      await DocumentAuditService.logActivity(
        document._id,
        document.userId,
        'DOCUMENT_STORED',
        {
          size: processedFile.size,
          mimeType: file.mimetype,
          hasThumbnail: !!thumbnailKey
        }
      );

      return document;
    } catch (error) {
      throw new AppError(error.message || 'Error storing document', error.statusCode || 500);
    }
  }

  /**
   * Process file before storage
   * @param {Object} file - File object
   * @returns {Object} Processed file
   */
  async processFile(file) {
    const { buffer, mimetype } = file;

    // Process based on file type
    if (this.isImageFile(mimetype)) {
      return this.processImage(buffer);
    } else if (mimetype === 'application/pdf') {
      return this.processPdf(buffer);
    }

    // Return original file for other types
    return {
      buffer,
      size: buffer.length
    };
  }

  /**
   * Process image file
   * @param {Buffer} buffer - Image buffer
   * @returns {Object} Processed image
   */
  async processImage(buffer) {
    // Optimize image
    const processed = await sharp(buffer)
      .resize(2000, 2000, { // Max dimensions
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
      .toBuffer();

    return {
      buffer: processed,
      size: processed.length
    };
  }

  /**
   * Process PDF file
   * @param {Buffer} buffer - PDF buffer
   * @returns {Object} Processed PDF
   */
  async processPdf(buffer) {
    // Validate PDF
    const data = await pdf(buffer);
    if (!data || !data.numpages) {
      throw new AppError('Invalid PDF file', 400);
    }

    return {
      buffer,
      size: buffer.length
    };
  }

  /**
   * Generate thumbnail
   * @param {Buffer} buffer - Image buffer
   * @param {string} storageKey - Original file storage key
   * @returns {string} Thumbnail storage key
   */
  async generateThumbnail(buffer, storageKey) {
    const thumbnailKey = `thumb_${storageKey}`;
    const thumbnailPath = path.join(this.thumbnailsDir, thumbnailKey);

    // Generate thumbnail
    await sharp(buffer)
      .resize(200, 200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 60 })
      .toFile(thumbnailPath);

    return thumbnailKey;
  }

  /**
   * Generate storage key
   * @param {string} originalName - Original file name
   * @returns {string} Storage key
   */
  generateStorageKey(originalName) {
    const timestamp = Date.now();
    const random = uuidv4();
    const extension = path.extname(originalName);
    return `${timestamp}_${random}${extension}`;
  }

  /**
   * Generate file hash
   * @param {Buffer} buffer - File buffer
   * @returns {string} File hash
   */
  generateFileHash(buffer) {
    return crypto
      .createHash('sha256')
      .update(buffer)
      .digest('hex');
  }

  /**
   * Check if file is an image
   * @param {string} mimetype - File MIME type
   * @returns {boolean} Is image file
   */
  isImageFile(mimetype) {
    return mimetype.startsWith('image/');
  }

  /**
   * Get document file
   * @param {string} documentId - Document ID
   * @returns {Object} Document file
   */
  async getDocumentFile(documentId) {
    const document = await Document.findById(documentId);
    if (!document) {
      throw new AppError('Document not found', 404);
    }

    const filePath = path.join(this.storageDir, document.storageKey);
    const buffer = await fs.readFile(filePath);

    return {
      buffer,
      mimeType: document.mimeType,
      fileName: document.fileName
    };
  }

  /**
   * Get document thumbnail
   * @param {string} documentId - Document ID
   * @returns {Object} Thumbnail file
   */
  async getDocumentThumbnail(documentId) {
    const document = await Document.findById(documentId);
    if (!document) {
      throw new AppError('Document not found', 404);
    }

    if (!document.thumbnailKey) {
      throw new AppError('Thumbnail not available', 404);
    }

    const thumbnailPath = path.join(this.thumbnailsDir, document.thumbnailKey);
    const buffer = await fs.readFile(thumbnailPath);

    return {
      buffer,
      mimeType: 'image/jpeg',
      fileName: `thumb_${document.fileName}`
    };
  }

  /**
   * Delete document
   * @param {string} documentId - Document ID
   */
  async deleteDocument(documentId) {
    const document = await Document.findById(documentId);
    if (!document) {
      throw new AppError('Document not found', 404);
    }

    // Delete files
    const filePath = path.join(this.storageDir, document.storageKey);
    await fs.unlink(filePath).catch(() => {});

    if (document.thumbnailKey) {
      const thumbnailPath = path.join(this.thumbnailsDir, document.thumbnailKey);
      await fs.unlink(thumbnailPath).catch(() => {});
    }

    // Delete document record
    await document.remove();

    // Log deletion activity
    await DocumentAuditService.logActivity(
      documentId,
      document.userId,
      'DOCUMENT_DELETED',
      {
        fileName: document.fileName,
        size: document.size
      }
    );
  }

  /**
   * Move document to version
   * @param {string} documentId - Document ID
   * @returns {string} Version storage key
   */
  async moveToVersion(documentId) {
    const document = await Document.findById(documentId);
    if (!document) {
      throw new AppError('Document not found', 404);
    }

    const versionKey = `version_${document.storageKey}`;
    const sourcePath = path.join(this.storageDir, document.storageKey);
    const versionPath = path.join(this.versionsDir, versionKey);

    // Move file to versions directory
    await fs.rename(sourcePath, versionPath);

    // Move thumbnail if exists
    if (document.thumbnailKey) {
      const sourceThumbPath = path.join(this.thumbnailsDir, document.thumbnailKey);
      const versionThumbKey = `version_${document.thumbnailKey}`;
      const versionThumbPath = path.join(this.thumbnailsDir, versionThumbKey);

      await fs.rename(sourceThumbPath, versionThumbPath);
      document.thumbnailKey = versionThumbKey;
    }

    // Update document record
    document.storageKey = versionKey;
    document.url = `/api/documents/version/${versionKey}`;
    await document.save();

    return versionKey;
  }

  /**
   * Get storage statistics
   * @returns {Object} Storage statistics
   */
  async getStorageStats() {
    const [
      totalDocuments,
      typeStats,
      sizeStats
    ] = await Promise.all([
      Document.countDocuments(),
      Document.aggregate([
        { $group: { _id: '$mimeType', count: { $sum: 1 } } }
      ]),
      Document.aggregate([
        {
          $group: {
            _id: null,
            totalSize: { $sum: '$size' },
            avgSize: { $avg: '$size' },
            maxSize: { $max: '$size' },
            minSize: { $min: '$size' }
          }
        }
      ])
    ]);

    return {
      totalDocuments,
      documentTypes: typeStats.reduce((acc, curr) => ({
        ...acc,
        [curr._id]: curr.count
      }), {}),
      sizeStats: sizeStats[0] || {
        totalSize: 0,
        avgSize: 0,
        maxSize: 0,
        minSize: 0
      }
    };
  }

  /**
   * Clean up temporary files
   */
  async cleanupTempFiles() {
    const files = await fs.readdir(this.tempDir);
    const now = Date.now();

    for (const file of files) {
      const filePath = path.join(this.tempDir, file);
      const stats = await fs.stat(filePath);

      // Delete files older than 24 hours
      if (now - stats.mtimeMs > 24 * 60 * 60 * 1000) {
        await fs.unlink(filePath).catch(() => {});
      }
    }
  }

  /**
   * Schedule cleanup job
   */
  scheduleCleanup() {
    // Run daily at midnight
    const schedule = '0 0 * * *';
    const job = {
      name: 'storage-cleanup',
      schedule,
      handler: () => this.cleanupTempFiles()
    };

    // Add to job scheduler
    require('../utils/scheduler').addJob(job);
  }
}

module.exports = new DocumentStorageService(); 