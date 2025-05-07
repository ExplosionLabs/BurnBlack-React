# ERI API Integration Guide

This guide explains how to use the implemented ERI (Electronic Return Intermediary) digital signature functionality in this application.

## Prerequisites

The implementation uses the `node-forge` library for cryptographic operations:

```
npm install node-forge --save
```

## Files Structure

- `helper/eri/eriSignature.js` - Main implementation for ERI data signing
- `helper/eri/certificates/` - Directory containing certificate files:
  - `private_key.pem` - Private key (keep secure)
  - `certificate.pem` - Public certificate (for whitelisting)
  - `burnblack.pfx` - PKCS12 certificate (used by the application)
- `helper/eri/whitelistDetails.js` - Script to generate whitelisting requirements
- `helper/eri/whitelistingDocument.txt` - Generated document with all whitelisting requirements

## Using the ERI Signature Functionality

1. Import the module:

```javascript
const { generateSignature } = require('./helper/eri/eriSignature');
```

2. Use it to sign data for API requests:

```javascript
// Example data object
const data = {
  serviceName: "EriDataService",
  entity: "YOUR_ERI_ID",
  pass: "YourPassword"
};

// Generate signature
const signedData = generateSignature(data);

// Use signedData in your API request
// signedData contains: { sign, data, eriUserId }
```

## Whitelisting Process

To whitelist your application with the ERI system, you need to provide:

1. IP details - Server IP addresses
2. Primary Email ID for whitelisting in UAT
3. Primary Mobile Number for Whitelisting in UAT
4. Public Key Certificate (in PEM format)
5. Sample signed data for testing

All these details have been generated in the `whitelistingDocument.txt` file. You need to:

1. Update the placeholder email and mobile number in `whitelistDetails.js`
2. Run `node helper/eri/whitelistDetails.js` to regenerate the document
3. Submit the information to the ERI helpdesk

## Certificate Management

For production use, you should:

1. Request an official certificate from a trusted Certificate Authority
2. Replace the self-signed certificates in the `certificates` directory
3. Update the certificate password in `eriSignature.js` (CERT_PASSWORD constant)
4. Update the ERI user ID in `eriSignature.js` (ERI_USER_ID constant)

## Testing

Run the test script to verify everything is working:

```
node helper/eri/testEri.js
```

Note: The verification functionality in node-forge has limitations, but the generated signatures should be compatible with the Java verification method described in the ERI documentation.

## Important Notes

- Keep the private key and PKCS12 file secure
- Regularly update certificates before they expire
- Follow the ERI guidelines for any API changes 