/**
 * ERI API Endpoints Reference
 * This file contains a list of available ERI API endpoints and their descriptions
 */

const ERI_ENDPOINTS = {
  // Authentication
  login: {
    url: '/erilogin',
    method: 'POST',
    description: 'Login to the ERI system and obtain an authentication token',
    requiredFields: ['sign', 'data', 'eriUserId'],
    dataFields: ['serviceName', 'entity', 'pass']
  },

  // Taxpayer Information
  getTaxpayerDetails: {
    url: '/gettaxpayerdetails',
    method: 'POST',
    description: 'Get taxpayer details using PAN',
    requiredFields: ['sign', 'data', 'eriUserId', 'token'],
    dataFields: ['serviceName', 'entity', 'pan']
  },

  // Return Filing
  getReturnDetails: {
    url: '/getreturndetails',
    method: 'POST',
    description: 'Get details of returns filed by a taxpayer',
    requiredFields: ['sign', 'data', 'eriUserId', 'token'],
    dataFields: ['serviceName', 'entity', 'pan', 'ay']
  },

  getTaxpayerReturnStatus: {
    url: '/gettaxpayerreturnstatus',
    method: 'POST',
    description: 'Get status of returns filed by a taxpayer',
    requiredFields: ['sign', 'data', 'eriUserId', 'token'],
    dataFields: ['serviceName', 'entity', 'pan', 'ay']
  },

  // Form Management
  getActiveIncomeScheme: {
    url: '/getactiveincometaxscheme',
    method: 'POST',
    description: 'Get active income tax scheme information',
    requiredFields: ['sign', 'data', 'eriUserId', 'token'],
    dataFields: ['serviceName', 'entity', 'pan', 'ay']
  },

  getITRForm: {
    url: '/getitrform',
    method: 'POST',
    description: 'Get ITR form for the taxpayer',
    requiredFields: ['sign', 'data', 'eriUserId', 'token'],
    dataFields: ['serviceName', 'entity', 'pan', 'ay', 'formName']
  },

  submitITR: {
    url: '/submititr',
    method: 'POST',
    description: 'Submit ITR form data',
    requiredFields: ['sign', 'data', 'eriUserId', 'token'],
    dataFields: ['serviceName', 'entity', 'pan', 'ay', 'formName', 'formData']
  },

  // Form-26AS
  getForm26AS: {
    url: '/getform26as',
    method: 'POST',
    description: 'Get Form 26AS data for taxpayer',
    requiredFields: ['sign', 'data', 'eriUserId', 'token'],
    dataFields: ['serviceName', 'entity', 'pan', 'ay']
  },

  // CPC Communications
  getCPCCommunications: {
    url: '/getcpccommunications',
    method: 'POST',
    description: 'Get CPC communications for taxpayer',
    requiredFields: ['sign', 'data', 'eriUserId', 'token'],
    dataFields: ['serviceName', 'entity', 'pan', 'ay']
  },

  // Utility
  getAYList: {
    url: '/getaylist',
    method: 'POST',
    description: 'Get list of available assessment years',
    requiredFields: ['sign', 'data', 'eriUserId', 'token'],
    dataFields: ['serviceName', 'entity']
  },

  getITRFormList: {
    url: '/getitrformlist',
    method: 'POST',
    description: 'Get list of available ITR forms',
    requiredFields: ['sign', 'data', 'eriUserId', 'token'],
    dataFields: ['serviceName', 'entity', 'ay']
  }
};

// Export the endpoints
module.exports = ERI_ENDPOINTS;

// Print API endpoints if this file is run directly
if (require.main === module) {
  console.log('ERI API Endpoints Reference:');
  console.log('===========================\n');
  
  Object.entries(ERI_ENDPOINTS).forEach(([key, endpoint]) => {
    console.log(`${key}: ${endpoint.url}`);
    console.log(`Method: ${endpoint.method}`);
    console.log(`Description: ${endpoint.description}`);
    console.log(`Required Fields: ${endpoint.requiredFields.join(', ')}`);
    console.log(`Data Fields: ${endpoint.dataFields.join(', ')}`);
    console.log('\n');
  });
} 