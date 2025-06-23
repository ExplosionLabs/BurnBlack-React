# ITR JSON Download Flow Test Guide

## 🎯 Objective
Verify that the JSON download captures **actual user-entered values** from every step, with **no mock/hardcoded data**.

## 🧪 Test Scenario: Complete ITR Flow with Custom Values

### Step 1: Personal Details
**Navigate to**: Smart ITR Flow → Personal Details

**Enter Test Data**:
- Name: `John Test Doe`
- PAN: `ABCDE1234F`
- Aadhaar: `1234 5678 9012`
- Date of Birth: `1990-01-15`
- Email: `john.test@example.com`
- Mobile: `+91 98765 43210`
- Address Line 1: `Test House 123`
- City: `Mumbai`
- State: `Maharashtra`
- Pincode: `400001`

**Expected**: All values should be saved to ITRFlowContext

### Step 2: Income Details
**Navigate to**: Income Sources

**Select and Enter**:
1. **Salary Income**:
   - Gross Salary: `1200000`
   - Basic Pay: `600000`
   - HRA: `240000`
   - TDS: `150000`

2. **Interest Income**:
   - Savings Interest: `15000`
   - FD Interest: `25000`

3. **Dividend Income**:
   - Equity Dividend: `5000`
   - Mutual Fund Dividend: `3000`

**Expected**: Total income should calculate to `1248000` (salary net + interest + dividend)

### Step 3: Deductions
**Navigate to**: Tax Deductions

**Select and Enter**:
1. **Section 80C**:
   - PPF: `150000`
   - ELSS: `50000`
   - Life Insurance: `25000`

2. **Section 80D**:
   - Self & Family Premium: `25000`
   - Parents Premium: `30000`

**Expected**: Total 80C should be capped at `150000`, 80D should be `55000`

### Step 4: Review & JSON Download
**Navigate to**: Review & Calculate

**Verify Display**:
- All personal details match entered values
- Income breakdown shows custom amounts
- Deduction breakdown shows custom amounts
- Tax calculations based on actual income

**Download JSON**: Click "Download ITR JSON"

## 🔍 JSON Verification Checklist

### ✅ Personal Information Section
```json
"PersonalInfo": {
  "Name": "John Test Doe",          // ✓ Custom value
  "PAN": "ABCDE1234F",             // ✓ Custom value
  "AadhaarNumber": "123456789012",  // ✓ Custom value (formatted)
  "Email": "john.test@example.com", // ✓ Custom value
  "Mobile": "+91 98765 43210",      // ✓ Custom value
  "Address": {
    "Line1": "Test House 123",      // ✓ Custom value
    "City": "Mumbai",               // ✓ Custom value
    "State": "Maharashtra",         // ✓ Custom value
    "Pincode": "400001"            // ✓ Custom value
  }
}
```

### ✅ Income Details Section
```json
"IncomeDetails": {
  "Salary": {
    "Employers": [{
      "GrossSalary": 1200000,      // ✓ Custom value
      "BasicPay": 600000,          // ✓ Custom value
      "HRA": 240000,               // ✓ Custom value
      "TDSDeducted": 150000        // ✓ Custom value
    }],
    "NetSalary": 1050000           // ✓ Calculated value
  },
  "Interest": {
    "SavingsBankInterest": 15000,  // ✓ Custom value
    "FixedDepositInterest": 25000, // ✓ Custom value
    "TotalInterest": 40000         // ✓ Calculated value
  },
  "Dividend": {
    "EquityShares": 5000,          // ✓ Custom value
    "MutualFunds": 3000,           // ✓ Custom value
    "TotalDividend": 8000          // ✓ Calculated value
  },
  "GrossTotalIncome": 1098000      // ✓ Calculated from all sources
}
```

### ✅ Deductions Section
```json
"Deductions": {
  "Section80C": {
    "PPF": 150000,                 // ✓ Custom value
    "ELSS": 50000,                 // ✓ Custom value
    "LifeInsurance": 25000,        // ✓ Custom value
    "Total": 150000                // ✓ Capped at limit
  },
  "Section80D": {
    "SelfAndFamily": 25000,        // ✓ Custom value
    "Parents": 30000,              // ✓ Custom value
    "Total": 55000                 // ✓ Calculated value
  },
  "TotalDeductions": 205000        // ✓ Calculated from all sections
}
```

### ✅ Tax Computation Section
```json
"TaxComputation": {
  "GrossTotalIncome": 1098000,     // ✓ From income calculation
  "TotalDeductions": 205000,       // ✓ From deductions calculation
  "TaxableIncome": 843000,         // ✓ GTI - Deductions - Standard(50k)
  "TaxLiability": 88600,           // ✓ Calculated based on tax slabs
  "RefundDue": 61400,              // ✓ TDS - Tax Liability
  "TaxRegime": "Old"               // ✓ Selected regime
}
```

## 🚨 Red Flags (Should NOT Appear)
- ❌ Any hardcoded values like `800000` income
- ❌ Mock names like "John Doe" if custom name was entered
- ❌ Placeholder values like "ABCDE1234F" if custom PAN was entered
- ❌ Zero values when custom amounts were entered
- ❌ Missing sections that were filled by user

## 🧪 Development Test Features

### Test Data Capture Button
In development mode, you'll see a red "🧪 Test JSON Download" button at the bottom-left of the Smart ITR Flow. This downloads a detailed test report showing what data is being captured at each step.

### Browser Console Logs
Check browser console for detailed data capture information when using the test button.

## ✅ Success Criteria

1. **Personal Details**: All custom values appear correctly in JSON
2. **Income Sources**: All entered amounts appear with correct calculations
3. **Deductions**: All entered amounts appear with proper limits applied
4. **Tax Calculations**: All calculations based on user data, not hardcoded values
5. **No Mock Data**: Zero instances of placeholder/mock data in final JSON
6. **Data Persistence**: Values persist when navigating between steps
7. **Validation**: Proper format validation with helpful error messages

## 🐛 Common Issues to Check

1. **Infinite Loops**: No console errors about "Maximum update depth exceeded"
2. **Missing Data**: "No Data Found" should not appear if user completed steps
3. **Validation Errors**: Format validation should be user-friendly
4. **Auto-formatting**: Aadhaar, PAN, and mobile should format automatically
5. **Step Completion**: Step progress should update correctly

## 📝 Test Results Template

**Date**: ___________  
**Tester**: ___________  

| Step | Data Entered | JSON Output | Status |
|------|-------------|-------------|---------|
| Personal Details | ✓/✗ | ✓/✗ | Pass/Fail |
| Income Sources | ✓/✗ | ✓/✗ | Pass/Fail |
| Deductions | ✓/✗ | ✓/✗ | Pass/Fail |
| Tax Calculations | ✓/✗ | ✓/✗ | Pass/Fail |

**Overall Result**: Pass/Fail  
**Notes**: ___________