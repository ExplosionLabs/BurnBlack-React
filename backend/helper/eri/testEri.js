const { generateSignature, verifySignature, getPublicCertificate, generateTestPayload } = require('./eriSignature');

// Generate a test payload
console.log('Generating test payload...');
const testPayload = generateTestPayload();
console.log(JSON.stringify(testPayload, null, 2));

// Verify the signature
console.log('\nVerifying signature...');
const verificationResult = verifySignature(testPayload.sign, testPayload.data);
console.log('Signature verification result:', verificationResult);

// Get the public certificate
console.log('\nPublic Certificate:');
console.log(getPublicCertificate()); 