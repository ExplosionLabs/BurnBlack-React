/**
 * ERI Whitelisting Requirements Document
 * This file contains all the information needed for ERI API whitelisting
 */

const { getPublicCertificate, generateTestPayload } = require('./eriSignature');
const os = require('os');

// Generate test payload for sample signed data
const sampleSignedData = generateTestPayload();

// Get server IP addresses
const networkInterfaces = os.networkInterfaces();
const ipAddresses = [];

Object.keys(networkInterfaces).forEach(interfaceName => {
  const interfaces = networkInterfaces[interfaceName];
  interfaces.forEach(iface => {
    // Skip internal/loopback interfaces
    if (!iface.internal && iface.family === 'IPv4') {
      ipAddresses.push(iface.address);
    }
  });
});

// Whitelisting requirements
const whitelistingRequirements = {
  // 1. IP details
  ipDetails: ipAddresses.length > 0 ? ipAddresses.join(', ') : 'IP address not found',
  
  // 2. Primary email ID for whitelisting in UAT
  primaryEmail: 'your.email@example.com', // Replace with your actual email
  
  // 3. Primary mobile number for whitelisting in UAT
  primaryMobile: '+910000000000', // Replace with your actual mobile number
  
  // 4. Public key certificate (in PEM format)
  publicKeyCertificate: getPublicCertificate(),
  
  // 5. Sign data (sample signed data for testing)
  signData: JSON.stringify(sampleSignedData, null, 2)
};

// Export the requirements
module.exports = whitelistingRequirements;

// Print whitelisting requirements if this file is run directly
if (require.main === module) {
  console.log('ERI Whitelisting Requirements:');
  console.log('==============================\n');
  
  console.log('1. IP Details:');
  console.log(whitelistingRequirements.ipDetails);
  console.log('\n2. Primary Email ID for whitelisting in UAT:');
  console.log(whitelistingRequirements.primaryEmail);
  console.log('\n3. Primary Mobile Number for Whitelisting in UAT:');
  console.log(whitelistingRequirements.primaryMobile);
  console.log('\n4. Public Key Certificate:');
  console.log(whitelistingRequirements.publicKeyCertificate);
  console.log('\n5. Sign Data (Sample):');
  console.log(whitelistingRequirements.signData);
} 