/**
 * ERI Whitelisting Status Check
 * This script helps diagnose connection issues with the ERI API
 */

const axios = require('axios');
const dns = require('dns');
const { promisify } = require('util');
const { generateSignature } = require('./eriSignature');

// List of potential ERI API endpoints to check
const ERI_ENDPOINTS = [
  'https://eriapi.uat.incometax.gov.in',
  'https://api-uat.incometax.gov.in/eri/api',
  'https://services.incometax.gov.in/eri/api'
];

// Test credentials
const ERI_ID = 'ERIP007754';
const PASSWORD = 'Burnblack@123';

/**
 * Check DNS resolution for a hostname
 * @param {string} url - URL to check
 * @returns {Promise<object>} - DNS lookup result
 */
async function checkDnsResolution(url) {
  try {
    const hostname = new URL(url).hostname;
    const lookup = promisify(dns.lookup);
    const result = await lookup(hostname);
    return {
      hostname,
      resolved: true,
      ip: result.address,
      family: `IPv${result.family}`
    };
  } catch (error) {
    const hostname = url.replace(/^https?:\/\//, '').split('/')[0];
    return {
      hostname,
      resolved: false,
      error: error.message
    };
  }
}

/**
 * Test connection to an endpoint
 * @param {string} url - Endpoint URL
 * @returns {Promise<object>} - Connection test result
 */
async function testConnection(url) {
  try {
    const response = await axios.get(url, {
      timeout: 5000,
      validateStatus: () => true
    });
    
    return {
      url,
      connected: true,
      status: response.status,
      statusText: response.statusText
    };
  } catch (error) {
    return {
      url,
      connected: false,
      error: error.message
    };
  }
}

/**
 * Attempt to login to the ERI API
 * @param {string} url - API base URL
 * @returns {Promise<object>} - Login result
 */
async function attemptLogin(url) {
  try {
    // Prepare login data
    const loginData = {
      serviceName: "EriDataService",
      entity: ERI_ID,
      pass: PASSWORD
    };

    // Generate signature
    const signedData = generateSignature(loginData);
    
    // Make API request
    const response = await axios.post(`${url}/erilogin`, signedData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 8000,
      validateStatus: () => true
    });

    return {
      url: `${url}/erilogin`,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    return {
      url: `${url}/erilogin`,
      error: error.message
    };
  }
}

/**
 * Run whitelisting status check
 */
async function checkWhitelistingStatus() {
  console.log('=== ERI API Whitelisting Status Check ===\n');
  
  // Step 1: Check DNS resolution
  console.log('Step 1: Checking DNS resolution for ERI endpoints...');
  const dnsResults = [];
  
  for (const endpoint of ERI_ENDPOINTS) {
    const result = await checkDnsResolution(endpoint);
    dnsResults.push(result);
    
    if (result.resolved) {
      console.log(`✅ ${result.hostname} resolves to ${result.ip} (${result.family})`);
    } else {
      console.log(`❌ ${result.hostname} - DNS resolution failed: ${result.error}`);
    }
  }
  
  console.log('\nStep 2: Testing connection to ERI endpoints...');
  const connectionResults = [];
  
  for (const endpoint of ERI_ENDPOINTS) {
    const result = await testConnection(endpoint);
    connectionResults.push(result);
    
    if (result.connected) {
      console.log(`✅ ${result.url} - Connection successful (Status: ${result.status} ${result.statusText})`);
    } else {
      console.log(`❌ ${result.url} - Connection failed: ${result.error}`);
    }
  }
  
  console.log('\nStep 3: Attempting login to ERI endpoints...');
  const loginResults = [];
  
  for (const endpoint of ERI_ENDPOINTS) {
    // Only test endpoints that resolved successfully
    const dnsResult = dnsResults.find(r => endpoint.includes(r.hostname));
    
    if (dnsResult && dnsResult.resolved) {
      console.log(`Attempting login to ${endpoint}...`);
      const result = await attemptLogin(endpoint);
      loginResults.push(result);
      
      if (!result.error) {
        console.log(`📝 ${result.url} - Response: ${JSON.stringify(result.data)}`);
      } else {
        console.log(`❌ ${result.url} - Login failed: ${result.error}`);
      }
    }
  }
  
  // Step 4: Check whitelisting status and provide recommendations
  console.log('\n=== Whitelisting Status Analysis ===\n');
  
  // Check if any endpoint resolved and connected
  const anyResolvedAndConnected = connectionResults.some(r => r.connected);
  const anySuccessfulLogin = loginResults.some(r => !r.error);
  
  if (!anyResolvedAndConnected) {
    console.log('⚠️ DIAGNOSIS: None of the ERI endpoints are accessible from your network.');
    console.log('This likely indicates one of the following issues:');
    console.log('1. Network connectivity problems');
    console.log('2. Firewall blocking outbound connections');
    console.log('3. DNS resolution issues');
    console.log('\nRECOMMENDATIONS:');
    console.log('1. Check your internet connection');
    console.log('2. Verify firewall settings');
    console.log('3. Try connecting from a different network');
  } else if (!anySuccessfulLogin) {
    console.log('⚠️ DIAGNOSIS: ERI endpoints are accessible, but login attempts failed.');
    console.log('This likely indicates one of the following issues:');
    console.log('1. Your ERI ID is not yet whitelisted with the Income Tax Department');
    console.log('2. The server may be temporarily unavailable');
    console.log('3. The digital signature process may have issues');
    console.log('\nRECOMMENDATIONS:');
    console.log('1. Submit whitelisting request to the ERI helpdesk with:');
    console.log('   - IP details');
    console.log('   - Primary Email ID');
    console.log('   - Primary Mobile Number');
    console.log('   - Public Key Certificate');
    console.log('   - Sign Data');
    console.log('2. Wait for confirmation of whitelisting');
    console.log('3. Try connecting during business hours');
  } else {
    console.log('✅ DIAGNOSIS: Successfully connected to at least one ERI endpoint.');
    console.log('Your whitelisting appears to be active and working.');
  }
  
  console.log('\n=== Next Steps ===\n');
  console.log('1. If not yet whitelisted:');
  console.log('   - Run "node helper/eri/whitelistDetails.js" to generate your whitelisting document');
  console.log('   - Submit the information to eri.helpdesk@incometax.gov.in');
  console.log('2. After whitelisting confirmation:');
  console.log('   - Run "node helper/eri/eriApiTest.js" to test API connectivity');
  console.log('   - Run "node helper/eri/eriApiDemo.js" for more comprehensive testing');
}

// Run the status check if this file is executed directly
if (require.main === module) {
  checkWhitelistingStatus();
}

module.exports = { checkWhitelistingStatus }; 