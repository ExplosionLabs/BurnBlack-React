const axios = require('axios');
const { generateSignature } = require('./eriSignature');
const https = require('https');

// Base URL for ERI APIs - Try production URL
const ERI_BASE_URL = 'https://services.incometax.gov.in/eri/api'; // Updated to prod URL

// Test credentials
const ERI_ID = 'ERIP007754';
const PASSWORD = 'Burnblack@123'; // Replace with your actual password

/**
 * Login to ERI API
 * @returns {Promise<Object>} - Login response with token
 */
async function loginToEriApi() {
  try {
    // Prepare login data
    const loginData = {
      serviceName: "EriDataService",
      entity: ERI_ID,
      pass: PASSWORD
    };

    // Generate signature
    const signedData = generateSignature(loginData);
    
    console.log('Sending login request with signed data:');
    console.log(JSON.stringify(signedData, null, 2));

    // Create HTTPS agent with relaxed SSL options
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    // Make API request
    const response = await axios.post(`${ERI_BASE_URL}/erilogin`, signedData, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
      },
      timeout: 15000, // Longer timeout
      httpsAgent, // Use custom HTTPS agent
      proxy: false, // Disable proxy
    });

    console.log('\nLogin Response:');
    console.log(JSON.stringify(response.data, null, 2));

    // Return token for further requests
    return response.data;
  } catch (error) {
    console.error('\nLogin Error:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', JSON.stringify(error.response.data));
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received');
      console.error('Error details:', error.message);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
}

/**
 * Get taxpayer details from ERI API
 * @param {string} token - Authentication token from login
 * @param {string} pan - PAN number
 * @returns {Promise<Object>} - Taxpayer details
 */
async function getTaxpayerDetails(token, pan) {
  try {
    if (!token) {
      throw new Error('Token is required for this API call');
    }

    // Prepare request data
    const requestData = {
      serviceName: "GetTaxpayerDetails",
      entity: ERI_ID,
      pan: pan
    };

    // Generate signature
    const signedData = generateSignature(requestData);
    
    // Add token
    signedData.token = token;
    
    console.log('\nSending taxpayer details request:');
    console.log(JSON.stringify(signedData, null, 2));

    // Make API request
    const response = await axios.post(`${ERI_BASE_URL}/gettaxpayerdetails`, signedData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('\nTaxpayer Details Response:');
    console.log(JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.error('\nTaxpayer Details Error:');
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
}

/**
 * Run the complete API test flow
 */
async function runApiTest() {
  try {
    console.log('=== Starting ERI API Test ===\n');
    
    // Step 1: Login to get token
    console.log('Step 1: Login to ERI API\n');
    const loginResponse = await loginToEriApi();
    
    if (!loginResponse || !loginResponse.token) {
      console.error('Login failed or no token received');
      return;
    }
    
    const token = loginResponse.token;
    console.log(`\nToken received: ${token.substring(0, 15)}...`);
    
    // Step 2: Get taxpayer details with PAN
    console.log('\nStep 2: Get Taxpayer Details\n');
    const pan = 'ABCDE1234F'; // Replace with a valid PAN for testing
    await getTaxpayerDetails(token, pan);
    
    console.log('\n=== ERI API Test Completed ===');
  } catch (error) {
    console.error('\nTest Failed:', error.message);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  runApiTest();
}

module.exports = {
  loginToEriApi,
  getTaxpayerDetails,
  runApiTest
}; 