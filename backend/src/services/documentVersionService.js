const Document = require('../models/document');
const { AppError } = require('../utils/appError');
const path = require('path');
const fs = require('fs').promises;
const config = require('../config');
const { v4: uuidv4 } = require('uuid');

class DocumentVersionService {
  constructor() {
    this.versionDir = path.join(config.uploadDir, 'versions');
    this.ensureVersionDir();
  }

  /**
   * Ensure version directory exists
   */
  async ensureVersionDir() {
    try {
      await fs.access(this.versionDir);
    } catch {
      await fs.mkdir(this.versionDir, { recursive: true });
    }
  }

  /**
   * Create new version of document
   * @param {string} documentId - Original document ID
   * @param {Object} file - New version file
   * @param {Object} metadata - Version metadata
   * @returns {Object} New version document
   */
  async createVersion(documentId, file, metadata) {
    try {
      const originalDoc = await Document.findById(documentId);
      if (!originalDoc) {
        throw new AppError('Original document not found', 404);
      }

      // Generate version storage key
      const versionKey = `${originalDoc.userId}/${documentId}/${uuidv4()}-${file.originalname}`;
      const versionPath = path.join(this.versionDir, versionKey);

      // Save version file
      await fs.mkdir(path.dirname(versionPath), { recursive: true });
      await fs.writeFile(versionPath, file.buffer);

      // Create version document
      const version = new Document({
        userId: originalDoc.userId,
        documentType: originalDoc.documentType,
        financialYear: originalDoc.financialYear,
        fileName: file.originalname,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        storageKey: versionKey,
        url: `/api/documents/version/${version._id}`,
        status: 'PENDING',
        relatedIncome: originalDoc.relatedIncome,
        metadata: {
          ...metadata,
          versionOf: documentId,
          versionNumber: await this.getNextVersionNumber(documentId),
          versionReason: metadata.versionReason || 'Update',
          previousVersion: originalDoc._id
        }
      });

      await version.save();

      // Update original document metadata
      originalDoc.metadata.set('latestVersion', version._id);
      await originalDoc.save();

      return version;
    } catch (error) {
      throw new AppError(error.message || 'Error creating document version', error.statusCode || 500);
    }
  }

  /**
   * Get next version number for document
   * @param {string} documentId - Document ID
   * @returns {number} Next version number
   */
  async getNextVersionNumber(documentId) {
    const latestVersion = await Document.findOne({
      'metadata.versionOf': documentId
    })
      .sort({ 'metadata.versionNumber': -1 })
      .select('metadata.versionNumber');

    return (latestVersion?.metadata?.get('versionNumber') || 0) + 1;
  }

  /**
   * Get version history
   * @param {string} documentId - Document ID
   * @returns {Array} Version history
   */
  async getVersionHistory(documentId) {
    const versions = await Document.find({
      $or: [
        { _id: documentId },
        { 'metadata.versionOf': documentId }
      ]
    })
      .sort({ 'metadata.versionNumber': 1 })
      .select('-storageKey');

    return versions.map(doc => ({
      ...doc.toObject(),
      isCurrentVersion: !doc.metadata?.get('versionOf'),
      versionNumber: doc.metadata?.get('versionNumber') || 0,
      versionReason: doc.metadata?.get('versionReason')
    }));
  }

  /**
   * Get specific version
   * @param {string} versionId - Version document ID
   * @returns {Object} Version document
   */
  async getVersion(versionId) {
    const version = await Document.findById(versionId);
    if (!version) {
      throw new AppError('Version not found', 404);
    }

    return version;
  }

  /**
   * Restore previous version
   * @param {string} versionId - Version to restore
   * @returns {Object} Restored version
   */
  async restoreVersion(versionId) {
    const version = await this.getVersion(versionId);
    const originalDoc = await Document.findById(version.metadata.get('versionOf'));

    if (!originalDoc) {
      throw new AppError('Original document not found', 404);
    }

    // Create new version from the restored version
    const restoredVersion = await this.createVersion(
      originalDoc._id,
      {
        buffer: await fs.readFile(path.join(this.versionDir, version.storageKey)),
        originalname: version.originalName,
        mimetype: version.mimeType,
        size: version.size
      },
      {
        versionReason: `Restored from version ${version.metadata.get('versionNumber')}`,
        restoredFrom: versionId
      }
    );

    return restoredVersion;
  }

  /**
   * Compare versions
   * @param {string} versionId1 - First version ID
   * @param {string} versionId2 - Second version ID
   * @returns {Object} Comparison result
   */
  async compareVersions(versionId1, versionId2) {
    const [version1, version2] = await Promise.all([
      this.getVersion(versionId1),
      this.getVersion(versionId2)
    ]);

    // Compare metadata
    const metadataDiff = this.compareMetadata(
      version1.metadata,
      version2.metadata
    );

    // Compare extracted data if available
    const dataDiff = this.compareExtractedData(
      version1.metadata.get('extractedData'),
      version2.metadata.get('extractedData')
    );

    return {
      metadataDiff,
      dataDiff,
      version1: {
        id: version1._id,
        versionNumber: version1.metadata.get('versionNumber'),
        createdAt: version1.createdAt
      },
      version2: {
        id: version2._id,
        versionNumber: version2.metadata.get('versionNumber'),
        createdAt: version2.createdAt
      }
    };
  }

  /**
   * Compare metadata between versions
   * @param {Map} metadata1 - First version metadata
   * @param {Map} metadata2 - Second version metadata
   * @returns {Object} Metadata differences
   */
  compareMetadata(metadata1, metadata2) {
    const diff = {};
    const allKeys = new Set([
      ...Array.from(metadata1.keys()),
      ...Array.from(metadata2.keys())
    ]);

    for (const key of allKeys) {
      const value1 = metadata1.get(key);
      const value2 = metadata2.get(key);

      if (JSON.stringify(value1) !== JSON.stringify(value2)) {
        diff[key] = {
          from: value1,
          to: value2
        };
      }
    }

    return diff;
  }

  /**
   * Compare extracted data between versions
   * @param {Object} data1 - First version data
   * @param {Object} data2 - Second version data
   * @returns {Object} Data differences
   */
  compareExtractedData(data1, data2) {
    if (!data1 || !data2) {
      return null;
    }

    const diff = {};
    const allKeys = new Set([
      ...Object.keys(data1),
      ...Object.keys(data2)
    ]);

    for (const key of allKeys) {
      const value1 = data1[key];
      const value2 = data2[key];

      if (JSON.stringify(value1) !== JSON.stringify(value2)) {
        diff[key] = {
          from: value1,
          to: value2
        };
      }
    }

    return diff;
  }

  /**
   * Delete version
   * @param {string} versionId - Version ID
   */
  async deleteVersion(versionId) {
    const version = await this.getVersion(versionId);
    const originalDoc = await Document.findById(version.metadata.get('versionOf'));

    if (!originalDoc) {
      throw new AppError('Original document not found', 404);
    }

    // Delete version file
    const versionPath = path.join(this.versionDir, version.storageKey);
    await fs.unlink(versionPath).catch(() => {});

    // Delete version document
    await version.remove();

    // Update original document if this was the latest version
    if (originalDoc.metadata.get('latestVersion')?.toString() === versionId) {
      const previousVersion = await Document.findOne({
        'metadata.versionOf': originalDoc._id,
        _id: { $ne: versionId }
      })
        .sort({ 'metadata.versionNumber': -1 });

      originalDoc.metadata.set('latestVersion', previousVersion?._id);
      await originalDoc.save();
    }
  }
}

module.exports = new DocumentVersionService(); 