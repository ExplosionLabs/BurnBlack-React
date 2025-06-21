const Document = require('../models/document');
const { AppError } = require('../utils/appError');
const DocumentAuditService = require('./documentAuditService');
const config = require('../config');
const pdf = require('pdf-parse');
const sharp = require('sharp');
const exif = require('exif-parser');
const mime = require('mime-types');
const path = require('path');

class DocumentMetadataService {
  constructor() {
    this.supportedTypes = {
      'application/pdf': this.extractPdfMetadata.bind(this),
      'image/jpeg': this.extractImageMetadata.bind(this),
      'image/png': this.extractImageMetadata.bind(this),
      'image/gif': this.extractImageMetadata.bind(this)
    };
  }

  /**
   * Extract metadata from document
   * @param {Object} document - Document object
   * @param {Buffer} buffer - File buffer
   * @returns {Object} Extracted metadata
   */
  async extractMetadata(document, buffer) {
    try {
      const extractor = this.supportedTypes[document.mimeType];
      if (!extractor) {
        return this.extractBasicMetadata(document, buffer);
      }

      const metadata = await extractor(buffer);
      await this.updateDocumentMetadata(document, metadata);

      // Log metadata extraction
      await DocumentAuditService.logActivity(
        document._id,
        document.userId,
        'METADATA_EXTRACTED',
        {
          type: document.mimeType,
          hasMetadata: !!metadata
        }
      );

      return metadata;
    } catch (error) {
      throw new AppError(error.message || 'Error extracting metadata', error.statusCode || 500);
    }
  }

  /**
   * Extract basic metadata
   * @param {Object} document - Document object
   * @param {Buffer} buffer - File buffer
   * @returns {Object} Basic metadata
   */
  async extractBasicMetadata(document, buffer) {
    const extension = path.extname(document.fileName).toLowerCase();
    const mimeType = mime.lookup(extension) || document.mimeType;

    return {
      basic: {
        fileName: document.fileName,
        originalName: document.originalName,
        extension,
        mimeType,
        size: buffer.length,
        lastModified: new Date()
      }
    };
  }

  /**
   * Extract PDF metadata
   * @param {Buffer} buffer - PDF buffer
   * @returns {Object} PDF metadata
   */
  async extractPdfMetadata(buffer) {
    const data = await pdf(buffer);
    const { info, metadata, numpages, version } = data;

    return {
      pdf: {
        ...info,
        ...metadata,
        numpages,
        version,
        encrypted: !!info.Encrypted,
        pageSize: this.getPdfPageSize(data),
        hasOutline: !!data.outline,
        hasAttachments: !!data.attachments
      },
      basic: {
        ...this.extractBasicMetadataFromPdf(info)
      }
    };
  }

  /**
   * Extract image metadata
   * @param {Buffer} buffer - Image buffer
   * @returns {Object} Image metadata
   */
  async extractImageMetadata(buffer) {
    const [imageInfo, exifData] = await Promise.all([
      this.getImageInfo(buffer),
      this.getExifData(buffer)
    ]);

    return {
      image: {
        ...imageInfo,
        ...exifData
      },
      basic: {
        ...this.extractBasicMetadataFromImage(imageInfo)
      }
    };
  }

  /**
   * Get image information
   * @param {Buffer} buffer - Image buffer
   * @returns {Object} Image information
   */
  async getImageInfo(buffer) {
    const metadata = await sharp(buffer).metadata();
    const { format, width, height, size, space, channels, depth, density, orientation, hasAlpha, hasProfile } = metadata;

    return {
      format,
      dimensions: {
        width,
        height,
        aspectRatio: width / height
      },
      size,
      color: {
        space,
        channels,
        depth,
        hasAlpha,
        hasProfile
      },
      density,
      orientation
    };
  }

  /**
   * Get EXIF data
   * @param {Buffer} buffer - Image buffer
   * @returns {Object} EXIF data
   */
  async getExifData(buffer) {
    try {
      const parser = exif.create(buffer);
      const result = parser.parse();

      if (!result || !result.tags) {
        return {};
      }

      const { tags } = result;
      return {
        exif: {
          make: tags.Make,
          model: tags.Model,
          software: tags.Software,
          dateTime: tags.DateTime,
          dateTimeOriginal: tags.DateTimeOriginal,
          dateTimeDigitized: tags.DateTimeDigitized,
          exposureTime: tags.ExposureTime,
          fNumber: tags.FNumber,
          isoSpeedRatings: tags.ISOSpeedRatings,
          focalLength: tags.FocalLength,
          flash: tags.Flash,
          meteringMode: tags.MeteringMode,
          whiteBalance: tags.WhiteBalance,
          gps: this.extractGpsData(tags)
        }
      };
    } catch {
      return {};
    }
  }

  /**
   * Extract GPS data from EXIF
   * @param {Object} tags - EXIF tags
   * @returns {Object} GPS data
   */
  extractGpsData(tags) {
    if (!tags.GPSLatitude || !tags.GPSLongitude) {
      return null;
    }

    return {
      latitude: this.convertGpsCoordinate(tags.GPSLatitude, tags.GPSLatitudeRef),
      longitude: this.convertGpsCoordinate(tags.GPSLongitude, tags.GPSLongitudeRef),
      altitude: tags.GPSAltitude,
      timestamp: tags.GPSTimestamp,
      speed: tags.GPSSpeed
    };
  }

  /**
   * Convert GPS coordinate
   * @param {Array} coordinate - GPS coordinate array
   * @param {string} ref - GPS reference
   * @returns {number} Decimal coordinate
   */
  convertGpsCoordinate(coordinate, ref) {
    if (!coordinate || !Array.isArray(coordinate)) {
      return null;
    }

    const [degrees, minutes, seconds] = coordinate;
    let decimal = degrees + minutes / 60 + seconds / 3600;

    if (ref === 'S' || ref === 'W') {
      decimal = -decimal;
    }

    return decimal;
  }

  /**
   * Get PDF page size
   * @param {Object} data - PDF data
   * @returns {Object} Page size
   */
  getPdfPageSize(data) {
    if (!data || !data.pageSize) {
      return null;
    }

    const { width, height, unit } = data.pageSize;
    return {
      width,
      height,
      unit,
      orientation: width > height ? 'landscape' : 'portrait'
    };
  }

  /**
   * Extract basic metadata from PDF
   * @param {Object} info - PDF info
   * @returns {Object} Basic metadata
   */
  extractBasicMetadataFromPdf(info) {
    return {
      title: info.Title,
      author: info.Author,
      subject: info.Subject,
      keywords: info.Keywords,
      creator: info.Creator,
      producer: info.Producer,
      creationDate: info.CreationDate,
      modificationDate: info.ModDate
    };
  }

  /**
   * Extract basic metadata from image
   * @param {Object} info - Image info
   * @returns {Object} Basic metadata
   */
  extractBasicMetadataFromImage(info) {
    return {
      format: info.format,
      dimensions: info.dimensions,
      size: info.size,
      color: info.color
    };
  }

  /**
   * Update document metadata
   * @param {Object} document - Document object
   * @param {Object} metadata - New metadata
   */
  async updateDocumentMetadata(document, metadata) {
    document.metadata = {
      ...document.metadata,
      ...metadata,
      lastModified: new Date()
    };

    await document.save();
  }

  /**
   * Get metadata statistics
   * @returns {Object} Metadata statistics
   */
  async getMetadataStats() {
    const [
      totalDocuments,
      typeStats,
      metadataStats
    ] = await Promise.all([
      Document.countDocuments(),
      Document.aggregate([
        { $group: { _id: '$mimeType', count: { $sum: 1 } } }
      ]),
      Document.aggregate([
        {
          $group: {
            _id: null,
            hasMetadata: {
              $sum: { $cond: [{ $gt: ['$metadata', {}] }, 1, 0] }
            },
            hasExif: {
              $sum: { $cond: [{ $gt: ['$metadata.image.exif', {}] }, 1, 0] }
            },
            hasPdfInfo: {
              $sum: { $cond: [{ $gt: ['$metadata.pdf', {}] }, 1, 0] }
            }
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
      metadataStats: metadataStats[0] || {
        hasMetadata: 0,
        hasExif: 0,
        hasPdfInfo: 0
      }
    };
  }

  /**
   * Clean up metadata
   * @param {Object} document - Document object
   */
  async cleanupMetadata(document) {
    const metadata = document.metadata || {};
    const cleaned = {};

    // Keep only non-empty values
    for (const [key, value] of Object.entries(metadata)) {
      if (value && typeof value === 'object') {
        const cleanedValue = this.cleanupMetadataValue(value);
        if (Object.keys(cleanedValue).length > 0) {
          cleaned[key] = cleanedValue;
        }
      } else if (value) {
        cleaned[key] = value;
      }
    }

    await this.updateDocumentMetadata(document, cleaned);
  }

  /**
   * Clean up metadata value
   * @param {Object} value - Metadata value
   * @returns {Object} Cleaned value
   */
  cleanupMetadataValue(value) {
    if (!value || typeof value !== 'object') {
      return value;
    }

    const cleaned = {};
    for (const [key, val] of Object.entries(value)) {
      if (val && typeof val === 'object') {
        const cleanedVal = this.cleanupMetadataValue(val);
        if (Object.keys(cleanedVal).length > 0) {
          cleaned[key] = cleanedVal;
        }
      } else if (val) {
        cleaned[key] = val;
      }
    }

    return cleaned;
  }

  /**
   * Schedule metadata cleanup
   */
  scheduleCleanup() {
    // Run weekly
    const schedule = '0 0 * * 0';
    const job = {
      name: 'metadata-cleanup',
      schedule,
      handler: async () => {
        const documents = await Document.find({
          'metadata.lastModified': { $exists: true }
        });

        for (const document of documents) {
          await this.cleanupMetadata(document);
        }
      }
    };

    // Add to job scheduler
    require('../utils/scheduler').addJob(job);
  }
}

module.exports = new DocumentMetadataService(); 