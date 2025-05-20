
Here’s a step-by-step guide to gather the required data for API whitelisting with a third party:

---

### **1. IP Details**  
**Purpose**: Whitelist your web app’s IP addresses to allow API access.  
**Steps**:  
1. **Identify Public IPs**:  
   - If your app is hosted on a cloud platform (AWS, Azure, GCP), check:  
     - Elastic IPs (AWS).  
     - Load Balancer IPs/DNS.  
     - Firewall/NAT Gateway IPs.  
   - For on-premises servers, use tools like `curl ifconfig.me` or `nslookup` to find public IPs.  
2. **Document IPs**:  
   - List all IPs (IPv4 and IPv6) your app uses to communicate externally.  
   - Specify if IPs are static or dynamic (if dynamic, provide a domain name).  
3. **Share with Third Party**:  
   - Example format:  
     ```plaintext
     Primary IP: 203.0.113.10  
     Backup IP: 198.51.100.20  
     ```

---

### **2. Public Key Certificate**  
**Purpose**: Authenticate your app via TLS/mTLS or verify signed requests.  
**Steps**:  
1. **Generate or Retrieve Certificate**:  
   - If using a keystore (e.g., PKCS12/JKS), extract the public certificate:  
     ```bash
     openssl pkcs12 -in keystore.p12 -clcerts -nokeys -out public-cert.pem
     ```  
   - If you need a new certificate:  
     - Generate a CSR (Certificate Signing Request) and get it signed by a CA.  
     - Use OpenSSL or cloud-based tools (e.g., AWS ACM).  
2. **Format and Share**:  
   - Provide the certificate in PEM or CER format.  
   - Include the certificate chain if required.  
   - Example metadata to share:  
     ```plaintext
     Issuer: CN=Your Organization  
     Validity: 2023-01-01 to 2024-01-01  
     SHA-256 Fingerprint: A1:B2:C3:...
     ```

---

### **3. Sign Data**  
**Purpose**: Prove request integrity using cryptographic signatures.  
**Steps**:  
1. **Document Signing Process**:  
   - Algorithm: e.g., `SHA256withRSA` (corrected from `SHA25GwithRSA` in your code).  
   - Private Key Source: Path to keystore (e.g., `private key path`).  
2. **Provide Sample Code**:  
   - Share the code snippet from the document (after fixing typos like `XS99Certificate` → `X509Certificate`).  
   - Include a sample payload (as shown in Page 3).  
3. **Test Data**:  
   - Provide a test payload with a sample `dataToSign` and its `sign` value for validation.  

---

### **4. Final Document for Third Party**  
**Template**:  
```plaintext
To: [Third Party Support Team]  
Subject: API Whitelisting Request for [Your Web App]  

Dear Team,  

Please whitelist the following details for our API integration:  

1. **IP Addresses**:  
   - Primary: 203.0.113.10  
   - Backup: 198.51.100.20  

2. **Public Certificate**:  
   - Format: PEM  
   - Attached File: `public-cert.pem`  
   - Fingerprint: [SHA-256]  

3. **Signing Methodology**:  
   - Algorithm: SHA256withRSA  
   - Sample Signed Payload:  
     {  
       "sign": "MIAGCSqGSID3DQEHAqCAMIACAQExDzANBqlqhkgBZQMEAgEFADCABqkqhkiG9w0BBwEAAKCAM...",  
       "data": "ewOKCSJZZXJ2aWNlTmFtzS16IkVyapz25EYXRhU2VydmljZSIsDQogICAgImVudGl0esI6ICJ...",  
       "eriUserId": "ERIU010898"  
     }  

4. **Additional Notes**:  
   - Keystore Alias: `agencykey`  
   - Certificate Validity: Valid until 2024-01-01  

Let us know if further details are required.  
Best regards,  
[Your Team]  
```

---

### **Critical Checks**:  
- ✅ Validate IPs using `ping` or `traceroute`.  
- ✅ Test certificate validity (e.g., `openssl x509 -checkend 0 -noout -in public-cert.pem`).  
- ✅ Ensure signatures work with the third party’s verification tool.  

By following these steps, you’ll streamline the whitelisting process and ensure secure API integration.