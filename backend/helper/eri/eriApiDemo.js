/**
 * ERI API Demo
 * This script demonstrates how to use the ERI API client
 */

const EriApiClient = require('./eriApiClient');
const dotenv = require('dotenv');

// Load environment variables if available
dotenv.config();

// Get API password from environment variable or use default
const API_PASSWORD = process.env.ERI_PASSWORD || 'YourPassword';

/**
 * Main demo function
 */
async function runEriApiDemo() {
  console.log('=== ERI API Demonstration ===');
  console.log('This script will test various ERI API endpoints\n');

  // Create ERI API client
  const eriClient = new EriApiClient();
  
  try {
    // Step 1: Login to ERI API
    console.log('Step 1: Logging in to ERI API...');
    const loginResult = await eriClient.login(API_PASSWORD);
    console.log('Login successful!');
    console.log(`Token: ${loginResult.token ? loginResult.token.substring(0, 15) + '...' : 'No token received'}\n`);

    // Step 2: Get list of assessment years
    console.log('Step 2: Getting assessment years list...');
    const ayList = await eriClient.getAYList();
    console.log('Assessment Years:');
    console.log(JSON.stringify(ayList, null, 2));
    console.log();

    // Step 3: Get taxpayer details
    console.log('Step 3: Getting taxpayer details...');
    // Replace with a valid PAN number for testing
    const pan = process.env.TEST_PAN || 'ABCDE1234F';
    const taxpayerDetails = await eriClient.getTaxpayerDetails(pan);
    console.log('Taxpayer Details:');
    console.log(JSON.stringify(taxpayerDetails, null, 2));
    console.log();

    // Step 4: Get Form 26AS (if assessment year is available)
    if (ayList && ayList.ayList && ayList.ayList.length > 0) {
      const ay = ayList.ayList[0]; // Use first available assessment year
      console.log(`Step 4: Getting Form 26AS for AY ${ay}...`);
      const form26as = await eriClient.getForm26AS(pan, ay);
      console.log('Form 26AS Data:');
      console.log(JSON.stringify(form26as, null, 2));
      console.log();

      // Step 5: Get return details
      console.log(`Step 5: Getting return details for AY ${ay}...`);
      const returnDetails = await eriClient.getReturnDetails(pan, ay);
      console.log('Return Details:');
      console.log(JSON.stringify(returnDetails, null, 2));
      console.log();
    }

    console.log('=== ERI API Demo Completed Successfully ===');
  } catch (error) {
    console.error('\n=== ERI API Demo Failed ===');
    console.error(`Error: ${error.message}`);
  }
}

// Run the demo if this file is executed directly
if (require.main === module) {
  runEriApiDemo();
}

module.exports = { runEriApiDemo }; 