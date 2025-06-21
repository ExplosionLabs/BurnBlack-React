# BurnBlack Data Models Documentation

## User Management Models

### User Model
```typescript
interface User {
  _id: ObjectId;
  name: string;
  phone: string;
  email: string;
  password: string; // Hashed
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}
```

#### Relationships
- One-to-One with PersonalDetail
- One-to-One with ContactDetail
- One-to-One with Wallet
- One-to-Many with TaxSummary
- One-to-Many with Property

### Personal Detail Model
```typescript
interface PersonalDetail {
  _id: ObjectId;
  userId: ObjectId; // Reference to User
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: Date;
  gender: string;
  maritalStatus: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Contact Detail Model
```typescript
interface ContactDetail {
  _id: ObjectId;
  userId: ObjectId; // Reference to User
  aadharNumber: string;
  panNumber: string;
  mobileNumber: string;
  email: string;
  secondaryMobileNumber?: string;
  secondaryEmail?: string;
  landlineNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Financial Models

### Wallet Model
```typescript
interface Wallet {
  _id: ObjectId;
  userId: ObjectId; // Reference to User
  balance: number;
  transactions: Transaction[];
  createdAt: Date;
  updatedAt: Date;
}

interface Transaction {
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
}
```

### Bank Detail Model
```typescript
interface BankDetail {
  _id: ObjectId;
  userId: ObjectId; // Reference to User
  bankDetails: BankAccount[];
  createdAt: Date;
  updatedAt: Date;
}

interface BankAccount {
  accountNo: string;
  ifscCode: string;
  bankName: string;
  type: string;
}
```

## Tax-Related Models

### Tax Summary Model
```typescript
interface TaxSummary {
  _id: ObjectId;
  userId: ObjectId; // Reference to User
  grossIncome: number;
  taxableIncome: number;
  totalDeductions: number;
  taxLiability: number;
  taxPaid: number;
  taxDue: number;
  incomeTaxAtNormalRates: number;
  healthAndEducationCess: number;
  itrType: string;
  lastUpdated: Date;
}
```

### Form 16 Model
```typescript
interface Form16 {
  _id: ObjectId;
  userId: ObjectId; // Reference to User
  file: string; // Base64
  fileName: string;
  uploadedAt: Date;
}
```

### Tax Investment Model
```typescript
interface TaxInvestment {
  _id: ObjectId;
  userId: ObjectId; // Reference to User
  section80C: number;
  savingsInterest80TTA: number;
  pensionContribution80CCC: number;
  npsEmployeeContribution: number;
  npsEmployerContribution: number;
}
```

### Donation Models

#### 80G Donation
```typescript
interface Donation80G {
  _id: ObjectId;
  userId: ObjectId; // Reference to User
  section80G: string;
  nameDonee: string;
  cashAmount: number;
  nonCashAmount: number;
  panDonee: string;
  limitDeduction: string;
  qualifyPercent: number;
  addressLine: string;
  pinCode: number;
  state: string;
  city: string;
}
```

#### 80GG Donation (Rural)
```typescript
interface Donation80GG {
  _id: ObjectId;
  userId: ObjectId; // Reference to User
  section80G: string;
  nameDonee: string;
  cashAmount: number;
  nonCashAmount: number;
  panDonee: string;
  limitDeduction: string;
  qualifyPercent: number;
  addressLine: string;
  pinCode: number;
  state: string;
  city: string;
}
```

## Property Models

### Rental Property Model
```typescript
interface RentalProperty {
  _id: ObjectId;
  userId: ObjectId; // Reference to User
  propertyIndex: string;
  propertyType: string;
  netTaxableIncome: number;
  houseAddress: Address;
  ownerDetails: OwnerDetails;
  taxSavings: TaxSavings;
  rentalIncomeDetails: RentalIncomeDetails;
  tentatDetails: TentantDetail[];
}

interface Address {
  flatNo: string;
  premiseName: string;
  road: string;
  area: string;
  pincode: string;
  country: string;
  state: string;
  city: string;
}

interface OwnerDetails {
  ownerName: string;
  ownerPan: string;
  ownerShare: number;
  hasMultipleOwners: boolean;
  coOwners: CoOwner[];
}

interface CoOwner {
  coOwnerName: string;
  coOwnerPan: string;
  coOwnerShare: number;
}

interface TaxSavings {
  constructionYear: string;
  interestDuringConstruction: number;
  interestAfterCompletion: number;
  totalDeduction: number;
}

interface RentalIncomeDetails {
  annualRent: string;
  taxPaid: number;
  standardDeduction: number;
  netIncome: number;
}

interface TentantDetail {
  name: string;
  panOrTan: string;
  aadhaar: string;
}
```

## Additional Tax Models

### TDS Rent Model
```typescript
interface TDSRent {
  _id: ObjectId;
  userId: ObjectId; // Reference to User
  pan: string;
  name: string;
  totalTax: number;
  transferTDS: boolean;
  tdsCreditRelating: string;
  tdsCredit: number;
  incomeRelatingTDS: number;
  panOtherPerson: string;
  taxClaimed: number;
  incomeAgainstTDS: number;
  typeOfIncome: string;
  financialYear: string;
}
```

### Political Contribution Model
```typescript
interface PoliticalContribution {
  _id: ObjectId;
  userId: ObjectId; // Reference to User
  cashAmount: number;
  nonCashAmount: number;
  contriDate: string;
  tranNo: string;
  ifscCode: string;
}
```

### Disability Model
```typescript
interface Disability {
  _id: ObjectId;
  userId: ObjectId; // Reference to User
  disabilityDetails: {
    disabilityNature: string;
    dependentType: string;
    panOfDependent: string;
    aadhaarOfDependent: string;
    form10IA: {
      filingDate: string;
      ackNumber: string;
      udidNumber: string;
    };
  };
}
```

### Loans Model
```typescript
interface Loans {
  _id: ObjectId;
  userId: ObjectId; // Reference to User
  eduLoans: number;
  homeLoans1617: number;
  homeLoans1922: number;
  electricVehicle: number;
}
```

### Other Deduction Model
```typescript
interface OtherDeduction {
  _id: ObjectId;
  userId: ObjectId; // Reference to User
  copyRightFee: number;
  patentIncome: number;
  bioWasteIncome: number;
  agniPathContri: number;
  rentPerMonth: number;
  noOFMonth: number;
}
```

## Model Relationships and Dependencies

### Primary Relationships
1. **User to Personal Details**
   - One-to-One relationship
   - Required for user profile completion
   - Created during registration

2. **User to Contact Details**
   - One-to-One relationship
   - Required for communication
   - Created during registration

3. **User to Wallet**
   - One-to-One relationship
   - Created automatically for new users
   - Manages all financial transactions

4. **User to Tax Summary**
   - One-to-Many relationship
   - Multiple tax summaries per user
   - Year-based organization

### Secondary Relationships
1. **Tax Summary to Form 16**
   - One-to-Many relationship
   - Multiple Form 16s per tax summary
   - Year-based organization

2. **User to Properties**
   - One-to-Many relationship
   - Multiple properties per user
   - Property type-based organization

3. **User to Donations**
   - One-to-Many relationship
   - Multiple donations per user
   - Category-based organization

## Data Validation Rules

### User Data
1. **Email Validation**
   - Must be unique
   - Must follow email format
   - Must be verified

2. **Phone Validation**
   - Must be unique
   - Must follow Indian phone format
   - Must be verified

3. **Password Requirements**
   - Minimum 8 characters
   - Must contain numbers and special characters
   - Must be hashed before storage

### Financial Data
1. **Amount Validation**
   - Must be positive numbers
   - Must have proper decimal places
   - Must be within allowed limits

2. **Transaction Validation**
   - Must have valid status
   - Must have proper timestamps
   - Must maintain wallet balance integrity

### Tax Data
1. **Document Validation**
   - Must be in allowed formats
   - Must have proper size limits
   - Must be properly signed

2. **Calculation Validation**
   - Must follow tax rules
   - Must maintain proper totals
   - Must handle all edge cases 