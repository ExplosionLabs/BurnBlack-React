/**
 * ERI API Client
 * A reusable client for making authenticated requests to ERI APIs
 */

const axios = require('axios');
const { generateSignature } = require('./eriSignature');
const ERI_ENDPOINTS = require('./eriEndpoints');

class EriApiClient {
  constructor(baseUrl = 'https://eriapi.uat.incometax.gov.in', eriId = 'ERIP007754') {
    this.baseUrl = baseUrl;
    this.eriId = eriId;
    this.token = null;
  }

  /**
   * Login to the ERI system
   * @param {string} password - ERI password
   * @returns {Promise<Object>} - Login response
   */
  async login(password) {
    try {
      // Prepare login data
      const loginData = {
        serviceName: "EriDataService",
        entity: this.eriId,
        pass: password
      };

      // Generate signature
      const signedData = generateSignature(loginData);

      // Make API request
      const response = await axios.post(`${this.baseUrl}${ERI_ENDPOINTS.login.url}`, signedData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Save token for future requests
      if (response.data && response.data.token) {
        this.token = response.data.token;
      }

      return response.data;
    } catch (error) {
      this._handleError(error, 'Login');
      throw error;
    }
  }

  /**
   * Get taxpayer details
   * @param {string} pan - PAN number
   * @returns {Promise<Object>} - Taxpayer details
   */
  async getTaxpayerDetails(pan) {
    return this._makeAuthenticatedRequest(
      ERI_ENDPOINTS.getTaxpayerDetails.url,
      {
        serviceName: "GetTaxpayerDetails",
        entity: this.eriId,
        pan
      }
    );
  }

  /**
   * Get return details
   * @param {string} pan - PAN number
   * @param {string} ay - Assessment year
   * @returns {Promise<Object>} - Return details
   */
  async getReturnDetails(pan, ay) {
    return this._makeAuthenticatedRequest(
      ERI_ENDPOINTS.getReturnDetails.url,
      {
        serviceName: "GetReturnDetails",
        entity: this.eriId,
        pan,
        ay
      }
    );
  }

  /**
   * Get taxpayer return status
   * @param {string} pan - PAN number
   * @param {string} ay - Assessment year
   * @returns {Promise<Object>} - Return status
   */
  async getTaxpayerReturnStatus(pan, ay) {
    return this._makeAuthenticatedRequest(
      ERI_ENDPOINTS.getTaxpayerReturnStatus.url,
      {
        serviceName: "GetTaxpayerReturnStatus",
        entity: this.eriId,
        pan,
        ay
      }
    );
  }

  /**
   * Get Form 26AS
   * @param {string} pan - PAN number
   * @param {string} ay - Assessment year
   * @returns {Promise<Object>} - Form 26AS data
   */
  async getForm26AS(pan, ay) {
    return this._makeAuthenticatedRequest(
      ERI_ENDPOINTS.getForm26AS.url,
      {
        serviceName: "GetForm26AS",
        entity: this.eriId,
        pan,
        ay
      }
    );
  }

  /**
   * Get list of assessment years
   * @returns {Promise<Object>} - List of assessment years
   */
  async getAYList() {
    return this._makeAuthenticatedRequest(
      ERI_ENDPOINTS.getAYList.url,
      {
        serviceName: "GetAYList",
        entity: this.eriId
      }
    );
  }

  /**
   * Make an authenticated request to an ERI endpoint
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request data
   * @returns {Promise<Object>} - API response
   * @private
   */
  async _makeAuthenticatedRequest(endpoint, data) {
    try {
      if (!this.token) {
        throw new Error('Not logged in. Call login() first.');
      }

      // Generate signature
      const signedData = generateSignature(data);
      
      // Add token
      signedData.token = this.token;

      // Make API request
      const response = await axios.post(`${this.baseUrl}${endpoint}`, signedData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      this._handleError(error, endpoint);
      throw error;
    }
  }

  /**
   * Handle API errors
   * @param {Error} error - Error object
   * @param {string} operation - Operation name
   * @private
   */
  _handleError(error, operation) {
    if (error.response) {
      console.error(`ERI API ${operation} Error - Status: ${error.response.status}`);
      console.error(`Response: ${JSON.stringify(error.response.data)}`);
      
      // Token expired
      if (error.response.status === 401) {
        this.token = null;
      }
    } else if (error.request) {
      console.error(`ERI API ${operation} Error - No response received`);
    } else {
      console.error(`ERI API ${operation} Error: ${error.message}`);
    }
  }
}

// Export the client
module.exports = EriApiClient; 