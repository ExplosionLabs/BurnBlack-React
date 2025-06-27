const sharp = require('sharp');
const pdf = require('pdf-poppler');
const path = require('path');
const fs = require('fs').promises;
const { AppError } = require('../utils/appError');
const config = require('../config');

class DocumentPreviewService {
  constructor() {
    this.previewDir = path.join(config.uploadDir, 'previews');
    this.ensurePreviewDir();
  }

  /**
   * Ensure preview directory exists
   */
  async ensurePreviewDir() {
    try {
      await fs.access(this.previewDir);
    } catch {
      await fs.mkdir(this.previewDir, { recursive: true });
    }
  }

  /**
   * Generate preview for document
   * @param {string} filePath - Path to original document
   * @param {string} mimeType - Document mime type
   * @param {string} documentId - Document ID
   * @returns {Object} Preview information
   */
  async generatePreview(filePath, mimeType, documentId) {
    try {
      const previewPath = path.join(this.previewDir, `${documentId}.jpg`);

      if (mimeType === 'application/pdf') {
        await this.generatePDFPreview(filePath, previewPath);
      } else if (mimeType.startsWith('image/')) {
        await this.generateImagePreview(filePath, previewPath);
      } else {
        throw new AppError('Unsupported file type for preview', 400);
      }

      return {
        previewUrl: `/api/documents/preview/${documentId}`,
        thumbnailUrl: `/api/documents/thumbnail/${documentId}`
      };
    } catch (error) {
      throw new AppError(error.message || 'Error generating preview', error.statusCode || 500);
    }
  }

  /**
   * Generate preview from PDF
   * @param {string} pdfPath - Path to PDF file
   * @param {string} outputPath - Path to save preview
   */
  async generatePDFPreview(pdfPath, outputPath) {
    const opts = {
      format: 'jpeg',
      out_dir: path.dirname(outputPath),
      out_prefix: path.basename(outputPath, '.jpg'),
      page: 1,
      scale: 2.0,
      dpi: 300
    };

    await pdf.convert(pdfPath, opts);
  }

  /**
   * Generate preview from image
   * @param {string} imagePath - Path to image file
   * @param {string} outputPath - Path to save preview
   */
  async generateImagePreview(imagePath, outputPath) {
    await sharp(imagePath)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    // Generate thumbnail
    const thumbnailPath = path.join(
      path.dirname(outputPath),
      `${path.basename(outputPath, '.jpg')}_thumb.jpg`
    );

    await sharp(imagePath)
      .resize(300, 300, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 60 })
      .toFile(thumbnailPath);
  }

  /**
   * Get preview file path
   * @param {string} documentId - Document ID
   * @returns {string} Preview file path
   */
  async getPreviewPath(documentId) {
    const previewPath = path.join(this.previewDir, `${documentId}.jpg`);
    try {
      await fs.access(previewPath);
      return previewPath;
    } catch {
      throw new AppError('Preview not found', 404);
    }
  }

  /**
   * Get thumbnail file path
   * @param {string} documentId - Document ID
   * @returns {string} Thumbnail file path
   */
  async getThumbnailPath(documentId) {
    const thumbnailPath = path.join(this.previewDir, `${documentId}_thumb.jpg`);
    try {
      await fs.access(thumbnailPath);
      return thumbnailPath;
    } catch {
      // If thumbnail doesn't exist, return preview path
      return this.getPreviewPath(documentId);
    }
  }

  /**
   * Delete preview files
   * @param {string} documentId - Document ID
   */
  async deletePreview(documentId) {
    const previewPath = path.join(this.previewDir, `${documentId}.jpg`);
    const thumbnailPath = path.join(this.previewDir, `${documentId}_thumb.jpg`);

    await Promise.all([
      fs.unlink(previewPath).catch(() => {}),
      fs.unlink(thumbnailPath).catch(() => {})
    ]);
  }
}

module.exports = new DocumentPreviewService(); 