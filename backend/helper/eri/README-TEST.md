# ERI API Testing Guide

This guide explains how to test your ERI API integration to ensure it's working correctly.

## Prerequisites

Before testing, make sure you have:

1. Set up your ERI credentials (ERI ID and password)
2. Generated your digital certificates
3. Installed required dependencies:
   ```
   npm install node-forge axios dotenv
   ```

## Configuration

1. Create a `.env` file in your backend directory with the following content:
   ```
   ERI_PASSWORD=YourActualPassword
   TEST_PAN=ValidPANNumber
   ```

   Replace `YourActualPassword` with your actual ERI password and `ValidPANNumber` with a valid PAN number for testing.

## Available Test Scripts

We've created several scripts to test the ERI API integration:

### 1. Simple API Test

This script tests the basic login and taxpayer details endpoints:

```bash
node helper/eri/eriApiTest.js
```

Before running, make sure to update the password in the script (look for `const PASSWORD = 'YourPassword';`).

### 2. Comprehensive API Demo

This script tests multiple endpoints including assessment years list, taxpayer details, Form 26AS, and return details:

```bash
node helper/eri/eriApiDemo.js
```

The demo uses environment variables from your `.env` file.

### 3. Test Signature Generation

To test only the signature generation without making API calls:

```bash
node helper/eri/testEri.js
```

## API Client Usage

We've created a reusable ERI API client that you can use in your application:

```javascript
const EriApiClient = require('./helper/eri/eriApiClient');

// Create client instance
const eriClient = new EriApiClient();

// Login
await eriClient.login('YourPassword');

// Get taxpayer details
const taxpayerDetails = await eriClient.getTaxpayerDetails('ABCDE1234F');

// Get assessment years
const ayList = await eriClient.getAYList();

// Get Form 26AS data
const form26as = await eriClient.getForm26AS('ABCDE1234F', '2023-24');

// Get return details
const returnDetails = await eriClient.getReturnDetails('ABCDE1234F', '2023-24');
```

## Troubleshooting

If you encounter issues:

1. **Connection Errors**: Ensure your server is whitelisted with the ERI system
2. **Authentication Errors**: Verify your ERI ID and password are correct
3. **Signature Errors**: Check that your certificate files are properly generated
4. **Invalid Data Errors**: Ensure you're providing valid data (e.g., a valid PAN number)

## API Endpoints Reference

Run the following command to see a list of all available API endpoints:

```bash
node helper/eri/eriEndpoints.js
```

## Next Steps

Once testing is successful:

1. Integrate the ERI API client into your application
2. Implement proper error handling and retry mechanisms
3. Add caching to improve performance
4. Consider monitoring API usage and implementing rate limiting 