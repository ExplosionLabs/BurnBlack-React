const Tesseract = require('tesseract.js');
const pdf = require('pdf-parse');
const { createWorker } = require('tesseract.js');
const { AppError } = require('../utils/appError');
const fs = require('fs').promises;
const path = require('path');
const config = require('../../config/database');
const { logger } = require('../utils/logger');
const { ApiError } = require('../utils/apiError');

class OCRService {
  constructor() {
    this.worker = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      this.worker = await createWorker({
        logger: m => {
          logger.debug('OCR Progress:', m);
        }
      });

      // Load English language data
      await this.worker.loadLanguage('eng');
      await this.worker.initialize('eng');
      
      // Set page segmentation mode to auto
      await this.worker.setParameters({
        tessedit_pageseg_mode: Tesseract.PSM.AUTO
      });

      this.isInitialized = true;
      logger.info('OCR Service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize OCR service:', error);
      throw new ApiError(500, 'Failed to initialize OCR service');
    }
  }

  async extractText(filePath, options = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const {
        language = 'eng',
        psm = Tesseract.PSM.AUTO,
        oem = Tesseract.OEM.LSTM_ONLY,
        dpi = 300
      } = options;

      // Update worker parameters if needed
      if (language !== 'eng') {
        await this.worker.loadLanguage(language);
        await this.worker.initialize(language);
      }

      await this.worker.setParameters({
        tessedit_pageseg_mode: psm,
        tessedit_ocr_engine_mode: oem
      });

      // Perform OCR
      const { data } = await this.worker.recognize(filePath, {
        dpi
      });

      return {
        text: data.text,
        confidence: data.confidence,
        words: data.words,
        lines: data.lines,
        paragraphs: data.paragraphs,
        blocks: data.blocks
      };
    } catch (error) {
      logger.error('OCR extraction failed:', error);
      throw new ApiError(500, 'Failed to extract text from document');
    }
  }

  async extractTextFromBuffer(buffer, options = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const {
        language = 'eng',
        psm = Tesseract.PSM.AUTO,
        oem = Tesseract.OEM.LSTM_ONLY,
        dpi = 300
      } = options;

      // Update worker parameters if needed
      if (language !== 'eng') {
        await this.worker.loadLanguage(language);
        await this.worker.initialize(language);
      }

      await this.worker.setParameters({
        tessedit_pageseg_mode: psm,
        tessedit_ocr_engine_mode: oem
      });

      // Perform OCR
      const { data } = await this.worker.recognize(buffer, {
        dpi
      });

      return {
        text: data.text,
        confidence: data.confidence,
        words: data.words,
        lines: data.lines,
        paragraphs: data.paragraphs,
        blocks: data.blocks
      };
    } catch (error) {
      logger.error('OCR extraction from buffer failed:', error);
      throw new ApiError(500, 'Failed to extract text from document buffer');
    }
  }

  async extractStructuredData(filePath, template) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Extract text first
      const { text, words, lines } = await this.extractText(filePath);

      // Process based on template
      const structuredData = this.processTemplate(text, words, lines, template);

      return {
        rawText: text,
        structuredData,
        confidence: this.calculateConfidence(words)
      };
    } catch (error) {
      logger.error('Structured data extraction failed:', error);
      throw new ApiError(500, 'Failed to extract structured data from document');
    }
  }

  processTemplate(text, words, lines, template) {
    const result = {};

    // Process each field in the template
    for (const [field, config] of Object.entries(template)) {
      const { type, pattern, position, validation } = config;

      switch (type) {
        case 'regex':
          result[field] = this.extractByRegex(text, pattern);
          break;
        case 'position':
          result[field] = this.extractByPosition(words, position);
          break;
        case 'keyword':
          result[field] = this.extractByKeyword(lines, pattern);
          break;
        default:
          result[field] = null;
      }

      // Apply validation if specified
      if (validation && result[field]) {
        result[field] = this.validateField(result[field], validation);
      }
    }

    return result;
  }

  extractByRegex(text, pattern) {
    const regex = new RegExp(pattern, 'i');
    const match = text.match(regex);
    return match ? match[1] : null;
  }

  extractByPosition(words, position) {
    const { x, y, width, height } = position;
    return words
      .filter(word => 
        word.bbox.x0 >= x &&
        word.bbox.y0 >= y &&
        word.bbox.x1 <= x + width &&
        word.bbox.y1 <= y + height
      )
      .map(word => word.text)
      .join(' ');
  }

  extractByKeyword(lines, keyword) {
    const line = lines.find(line => 
      line.text.toLowerCase().includes(keyword.toLowerCase())
    );
    return line ? line.text.split(keyword)[1].trim() : null;
  }

  validateField(value, validation) {
    if (validation.type === 'regex' && !new RegExp(validation.pattern).test(value)) {
      return null;
    }
    if (validation.type === 'date' && !this.isValidDate(value)) {
      return null;
    }
    if (validation.type === 'number' && isNaN(Number(value))) {
      return null;
    }
    return value;
  }

  isValidDate(value) {
    const date = new Date(value);
    return date instanceof Date && !isNaN(date);
  }

  calculateConfidence(words) {
    if (!words.length) return 0;
    const totalConfidence = words.reduce((sum, word) => sum + word.confidence, 0);
    return totalConfidence / words.length;
  }

  async terminate() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
      logger.info('OCR Service terminated');
    }
  }

  /**
   * Extract text from document
   * @param {string} filePath - Path to document
   * @param {string} mimeType - Document mime type
   * @returns {string} Extracted text
   */
  async extractTextFromDocument(filePath, mimeType) {
    try {
      await this.initialize();
      const fileBuffer = await fs.readFile(filePath);

      let text = '';
      if (mimeType === 'application/pdf') {
        const pdfData = await pdf(fileBuffer);
        text = pdfData.text;
      } else if (mimeType.startsWith('image/')) {
        const { data: { text: extractedText } } = await this.worker.recognize(fileBuffer);
        text = extractedText;
      } else {
        throw new AppError('Unsupported file type for OCR', 400);
      }

      return text;
    } catch (error) {
      throw new AppError(error.message || 'Error extracting text from document', error.statusCode || 500);
    }
  }

  /**
   * Extract data from Form 16
   * @param {string} text - Extracted text from Form 16
   * @returns {Object} Extracted Form 16 data
   */
  async extractForm16Data(text) {
    try {
      const data = {
        employer: {
          name: this.extractEmployerName(text),
          pan: this.extractEmployerPAN(text),
          tan: this.extractEmployerTAN(text)
        },
        employee: {
          name: this.extractEmployeeName(text),
          pan: this.extractEmployeePAN(text)
        },
        assessmentYear: this.extractAssessmentYear(text),
        salary: {
          gross: this.extractGrossSalary(text),
          totalDeductions: this.extractTotalDeductions(text),
          taxableIncome: this.extractTaxableIncome(text),
          taxPaid: this.extractTaxPaid(text)
        },
        components: {
          basic: this.extractBasicSalary(text),
          hra: this.extractHRA(text),
          specialAllowance: this.extractSpecialAllowance(text),
          professionalTax: this.extractProfessionalTax(text),
          otherAllowances: this.extractOtherAllowances(text)
        }
      };

      // Validate extracted data
      this.validateForm16Data(data);

      return data;
    } catch (error) {
      throw new AppError(error.message || 'Error extracting Form 16 data', error.statusCode || 500);
    }
  }

  /**
   * Extract data from bank statement
   * @param {string} text - Extracted text from bank statement
   * @returns {Object} Extracted bank statement data
   */
  async extractBankStatementData(text) {
    try {
      const data = {
        bank: {
          name: this.extractBankName(text),
          branch: this.extractBankBranch(text),
          accountNumber: this.extractAccountNumber(text)
        },
        accountHolder: this.extractAccountHolderName(text),
        period: {
          from: this.extractStatementPeriodFrom(text),
          to: this.extractStatementPeriodTo(text)
        },
        transactions: this.extractTransactions(text),
        summary: {
          openingBalance: this.extractOpeningBalance(text),
          closingBalance: this.extractClosingBalance(text),
          totalCredits: this.extractTotalCredits(text),
          totalDebits: this.extractTotalDebits(text)
        }
      };

      // Validate extracted data
      this.validateBankStatementData(data);

      return data;
    } catch (error) {
      throw new AppError(error.message || 'Error extracting bank statement data', error.statusCode || 500);
    }
  }

  /**
   * Extract data from interest certificate
   * @param {string} text - Extracted text from interest certificate
   * @returns {Object} Extracted interest certificate data
   */
  async extractInterestCertificateData(text) {
    try {
      const data = {
        bank: {
          name: this.extractBankName(text),
          branch: this.extractBankBranch(text)
        },
        accountHolder: this.extractAccountHolderName(text),
        accountNumber: this.extractAccountNumber(text),
        period: {
          from: this.extractInterestPeriodFrom(text),
          to: this.extractInterestPeriodTo(text)
        },
        interest: {
          rate: this.extractInterestRate(text),
          amount: this.extractInterestAmount(text),
          tds: this.extractInterestTDS(text),
          netAmount: this.extractNetInterestAmount(text)
        }
      };

      // Validate extracted data
      this.validateInterestCertificateData(data);

      return data;
    } catch (error) {
      throw new AppError(error.message || 'Error extracting interest certificate data', error.statusCode || 500);
    }
  }

  // Helper methods for Form 16 extraction
  extractEmployerName(text) {
    const match = text.match(/Employer's Name and Address[:\s]+([^\n]+)/i);
    return match ? match[1].trim() : null;
  }

  extractEmployerPAN(text) {
    const match = text.match(/Employer's PAN[:\s]+([A-Z]{5}[0-9]{4}[A-Z])/i);
    return match ? match[1] : null;
  }

  extractEmployerTAN(text) {
    const match = text.match(/Employer's TAN[:\s]+([A-Z]{4}[0-9]{5}[A-Z])/i);
    return match ? match[1] : null;
  }

  extractEmployeeName(text) {
    const match = text.match(/Employee's Name[:\s]+([^\n]+)/i);
    return match ? match[1].trim() : null;
  }

  extractEmployeePAN(text) {
    const match = text.match(/Employee's PAN[:\s]+([A-Z]{5}[0-9]{4}[A-Z])/i);
    return match ? match[1] : null;
  }

  extractAssessmentYear(text) {
    const match = text.match(/Assessment Year[:\s]+(\d{4}-\d{2})/i);
    return match ? match[1] : null;
  }

  extractGrossSalary(text) {
    const match = text.match(/Gross Salary[:\s]+(\d+(?:,\d+)*(?:\.\d{2})?)/i);
    return match ? parseFloat(match[1].replace(/,/g, '')) : null;
  }

  extractTotalDeductions(text) {
    const match = text.match(/Total Deductions[:\s]+(\d+(?:,\d+)*(?:\.\d{2})?)/i);
    return match ? parseFloat(match[1].replace(/,/g, '')) : null;
  }

  extractTaxableIncome(text) {
    const match = text.match(/Taxable Income[:\s]+(\d+(?:,\d+)*(?:\.\d{2})?)/i);
    return match ? parseFloat(match[1].replace(/,/g, '')) : null;
  }

  extractTaxPaid(text) {
    const match = text.match(/Total Tax Paid[:\s]+(\d+(?:,\d+)*(?:\.\d{2})?)/i);
    return match ? parseFloat(match[1].replace(/,/g, '')) : null;
  }

  // Helper methods for bank statement extraction
  extractBankName(text) {
    const match = text.match(/Bank Name[:\s]+([^\n]+)/i);
    return match ? match[1].trim() : null;
  }

  extractBankBranch(text) {
    const match = text.match(/Branch[:\s]+([^\n]+)/i);
    return match ? match[1].trim() : null;
  }

  extractAccountNumber(text) {
    const match = text.match(/Account Number[:\s]+(\d+)/i);
    return match ? match[1] : null;
  }

  extractAccountHolderName(text) {
    const match = text.match(/Account Holder[:\s]+([^\n]+)/i);
    return match ? match[1].trim() : null;
  }

  extractStatementPeriodFrom(text) {
    const match = text.match(/Statement Period[:\s]+(\d{2}[/-]\d{2}[/-]\d{4})/i);
    return match ? new Date(match[1]) : null;
  }

  extractStatementPeriodTo(text) {
    const match = text.match(/to[:\s]+(\d{2}[/-]\d{2}[/-]\d{4})/i);
    return match ? new Date(match[1]) : null;
  }

  extractTransactions(text) {
    // Complex regex to match transaction lines
    const transactionRegex = /(\d{2}[/-]\d{2}[/-]\d{4})\s+([^\n]+?)\s+(\d+(?:,\d+)*(?:\.\d{2})?)\s+(\d+(?:,\d+)*(?:\.\d{2})?)/g;
    const transactions = [];
    let match;

    while ((match = transactionRegex.exec(text)) !== null) {
      transactions.push({
        date: new Date(match[1]),
        description: match[2].trim(),
        debit: parseFloat(match[3].replace(/,/g, '')) || 0,
        credit: parseFloat(match[4].replace(/,/g, '')) || 0
      });
    }

    return transactions;
  }

  // Helper methods for interest certificate extraction
  extractInterestPeriodFrom(text) {
    const match = text.match(/Interest Period[:\s]+(\d{2}[/-]\d{2}[/-]\d{4})/i);
    return match ? new Date(match[1]) : null;
  }

  extractInterestPeriodTo(text) {
    const match = text.match(/to[:\s]+(\d{2}[/-]\d{2}[/-]\d{4})/i);
    return match ? new Date(match[1]) : null;
  }

  extractInterestRate(text) {
    const match = text.match(/Interest Rate[:\s]+(\d+(?:\.\d{2})?)/i);
    return match ? parseFloat(match[1]) : null;
  }

  extractInterestAmount(text) {
    const match = text.match(/Interest Amount[:\s]+(\d+(?:,\d+)*(?:\.\d{2})?)/i);
    return match ? parseFloat(match[1].replace(/,/g, '')) : null;
  }

  extractInterestTDS(text) {
    const match = text.match(/TDS[:\s]+(\d+(?:,\d+)*(?:\.\d{2})?)/i);
    return match ? parseFloat(match[1].replace(/,/g, '')) : null;
  }

  extractNetInterestAmount(text) {
    const match = text.match(/Net Interest[:\s]+(\d+(?:,\d+)*(?:\.\d{2})?)/i);
    return match ? parseFloat(match[1].replace(/,/g, '')) : null;
  }

  // Validation methods
  validateForm16Data(data) {
    const requiredFields = [
      'employer.name',
      'employer.pan',
      'employer.tan',
      'employee.name',
      'employee.pan',
      'assessmentYear',
      'salary.gross',
      'salary.totalDeductions',
      'salary.taxableIncome'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], data);
      return value === null || value === undefined;
    });

    if (missingFields.length > 0) {
      throw new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400);
    }
  }

  validateBankStatementData(data) {
    const requiredFields = [
      'bank.name',
      'accountNumber',
      'accountHolder',
      'period.from',
      'period.to',
      'summary.openingBalance',
      'summary.closingBalance'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], data);
      return value === null || value === undefined;
    });

    if (missingFields.length > 0) {
      throw new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400);
    }
  }

  validateInterestCertificateData(data) {
    const requiredFields = [
      'bank.name',
      'accountHolder',
      'accountNumber',
      'period.from',
      'period.to',
      'interest.rate',
      'interest.amount'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], data);
      return value === null || value === undefined;
    });

    if (missingFields.length > 0) {
      throw new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400);
    }
  }
}

module.exports = new OCRService(); 