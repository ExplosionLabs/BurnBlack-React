const fs = require('fs');
const path = require('path');
const forge = require('node-forge');

// Path to certificate files
const CERT_PATH = path.join(__dirname, 'certificates', 'burnblack.pfx');
const CERT_PASSWORD = 'burnblack123';
const ERI_USER_ID = 'ERIP007754'; // Replace with your actual ERI ID

/**
 * Generate signature for ERI authentication
 * @param {Object} data - Data object to sign
 * @returns {Object} - Signed data response
 */
function generateSignature(data) {
  try {
    // Read the PKCS12 file
    const pfxData = fs.readFileSync(CERT_PATH);
    const pfxAsn1 = forge.asn1.fromDer(forge.util.createBuffer(pfxData));
    const pfx = forge.pkcs12.pkcs12FromAsn1(pfxAsn1, CERT_PASSWORD);
    
    // Extract the private key
    let privateKey = null;
    const bags = pfx.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
    if (bags[forge.pki.oids.pkcs8ShroudedKeyBag]) {
      privateKey = bags[forge.pki.oids.pkcs8ShroudedKeyBag][0].key;
    } else {
      // Try to find the key in keyBag
      const keyBags = pfx.getBags({ bagType: forge.pki.oids.keyBag });
      if (keyBags[forge.pki.oids.keyBag]) {
        privateKey = keyBags[forge.pki.oids.keyBag][0].key;
      }
    }
    
    // Extract the certificate
    const certBags = pfx.getBags({ bagType: forge.pki.oids.certBag });
    const certificate = certBags[forge.pki.oids.certBag][0].cert;
    
    // Stringify data if it's an object
    const dataToSign = typeof data === 'object' ? JSON.stringify(data) : data;
    
    // Create PKCS#7 signed data
    const p7 = forge.pkcs7.createSignedData();
    p7.content = forge.util.createBuffer(dataToSign);
    p7.addCertificate(certificate);
    p7.addSigner({
      key: privateKey,
      certificate: certificate,
      digestAlgorithm: forge.pki.oids.sha256,
      authenticatedAttributes: [{
        type: forge.pki.oids.contentType,
        value: forge.pki.oids.data
      }, {
        type: forge.pki.oids.messageDigest
        // value will be auto-calculated
      }, {
        type: forge.pki.oids.signingTime,
        value: new Date()
      }]
    });
    
    // Sign the data
    p7.sign({ detached: true });
    
    // Convert to DER and then to Base64
    const bytes = forge.asn1.toDer(p7.toAsn1()).getBytes();
    const signedData = forge.util.encode64(bytes);
    
    // Encode the original data
    const encodedData = forge.util.encode64(dataToSign);
    
    // Create response object
    return {
      sign: signedData,
      data: encodedData,
      eriUserId: ERI_USER_ID
    };
  } catch (error) {
    console.error('Error generating signature:', error);
    throw error;
  }
}

/**
 * Verify signature (for testing purposes)
 * @param {String} signedData - Base64 encoded signed data
 * @param {String} encodedData - Base64 encoded original data
 * @returns {Boolean} - Verification result
 */
function verifySignature(signedData, encodedData) {
  try {
    // Read the PKCS12 file
    const pfxData = fs.readFileSync(CERT_PATH);
    const pfxAsn1 = forge.asn1.fromDer(forge.util.createBuffer(pfxData));
    const pfx = forge.pkcs12.pkcs12FromAsn1(pfxAsn1, CERT_PASSWORD);
    
    // Extract the certificate
    const certBags = pfx.getBags({ bagType: forge.pki.oids.certBag });
    const certificate = certBags[forge.pki.oids.certBag][0].cert;
    
    // Decode the signed data
    const signedBytes = forge.util.decode64(signedData);
    const p7 = forge.pkcs7.messageFromAsn1(forge.asn1.fromDer(forge.util.createBuffer(signedBytes)));
    
    // Decode the original data
    const originalData = forge.util.decode64(encodedData);
    p7.content = forge.util.createBuffer(originalData);
    
    // Verify the signature
    return p7.verify();
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

/**
 * Get the public certificate in PEM format
 * @returns {String} - PEM formatted certificate
 */
function getPublicCertificate() {
  try {
    return fs.readFileSync(path.join(__dirname, 'certificates', 'certificate.pem'), 'utf8');
  } catch (error) {
    console.error('Error reading certificate:', error);
    throw error;
  }
}

/**
 * Generate a test payload for ERI whitelisting
 * @returns {Object} - Test payload object
 */
function generateTestPayload() {
  const testData = {
    serviceName: "EriDataService",
    entity: ERI_USER_ID,
    pass: "TestPassword123"
  };
  
  return generateSignature(testData);
}

module.exports = {
  generateSignature,
  verifySignature,
  getPublicCertificate,
  generateTestPayload
}; 