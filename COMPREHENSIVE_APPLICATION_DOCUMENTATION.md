# BurnBlack Tax Management Platform - Comprehensive Documentation

## Table of Contents
1. [Application Overview](#application-overview)
2. [User Authentication & Management](#user-authentication--management)
3. [Main User Flows](#main-user-flows)
4. [Page-by-Page Breakdown](#page-by-page-breakdown)
5. [Backend Schema Documentation](#backend-schema-documentation)
6. [API Endpoints & Data Flow](#api-endpoints--data-flow)
7. [Admin Panel](#admin-panel)
8. [Technical Architecture](#technical-architecture)

---

## Application Overview

**BurnBlack** is a comprehensive Indian tax management platform that enables users to file Income Tax Returns (ITR) online. The platform supports various income sources, tax saving instruments, and provides automated tax calculations according to Indian tax laws.

### Core Features
- **Multi-step Tax Filing Wizard**
- **Automated Tax Calculations**
- **Support for ITR-1, ITR-2, ITR-3, ITR-4 forms**
- **Capital Gains Management**
- **Professional/Business Income Handling**
- **Tax Saving Optimization**
- **Payment Integration (Razorpay)**
- **Document Upload & OCR Processing**
- **Admin Dashboard for Management**

---

## User Authentication & Management

### 1. User Registration Flow
**Route**: `/register`
**Component**: `frontend/src/pages/ImportantPage/Register/index.tsx`

**Steps**:
1. User enters basic information (name, email, phone, password)
2. Google OAuth integration available as alternative
3. Email verification token sent
4. User redirected to email verification page

**Schema**: User Model
```javascript
{
  name: String (required),
  phone: String,
  email: String (required, unique),
  password: String,
  role: String (enum: ["admin", "user"], default: "user"),
  emailVerified: Boolean (default: false),
  emailVerificationDate: Date,
  lastVerificationEmailSent: Date
}
```

### 2. Login Flow
**Route**: `/login`
**Component**: `frontend/src/pages/ImportantPage/Login/index.tsx`

**Steps**:
1. Email/password authentication
2. Google OAuth login option
3. JWT token generation and storage
4. Redirect to ITR main page on success

### 3. Email Verification
**Route**: `/verify-email`
**Component**: `frontend/src/pages/EmailVerification.tsx`

**Steps**:
1. User clicks verification link from email
2. Token validation on backend
3. Account activation
4. Redirect to login page

---

## Main User Flows

### Primary Tax Filing Journey

```
Home Page → Registration/Login → ITR Main Dashboard → Personal Details → Income Sources → Tax Saving → Tax Summary → Payment & Filing
```

### Detailed Step-by-Step Flow

#### Phase 1: Getting Started
1. **Landing Page** (`/`)
   - Feature showcase with pricing plans
   - Call-to-action buttons
   - FAQ section and testimonials

2. **Authentication** (`/login` or `/register`)
   - User account creation or login
   - Google OAuth integration
   - Email verification process

#### Phase 2: Profile Setup
3. **ITR Main Page** (`/fileITR`)
   - Welcome message with user's name
   - Progress tracking
   - Quick actions and status overview
   - Session year display (AY 2024-2025)

4. **Personal Details** (`/fileITR/personalDetail`)
   - Personal information form
   - Address details
   - Contact information
   - Bank account details
   - PAN card linking

#### Phase 3: Income Declaration
5. **Income Sources Hub** (`/fileITR/incomeSources`)
   - Multiple income type selection
   - Form 16 upload/manual entry
   - Various income categories

#### Phase 4: Tax Optimization
6. **Tax Saving** (`/tax-saving`)
   - Tax deduction entry
   - Investment details
   - Tax paid information

#### Phase 5: Review & File
7. **Tax Summary** (`/fileITR/tax-summary`)
   - Complete tax calculation
   - Review all entered data
   - Final filing and payment

---

## Page-by-Page Breakdown

### 1. Public Pages

#### Homepage (`/`)
**File**: `frontend/src/pages/ImportantPage/HomePage/index.tsx`
**Purpose**: Marketing landing page with platform features

**Sections**:
- **Hero Section**: Main value proposition with CTA buttons
- **Features Section**: 6 key features (Smart Filing, Security, Maximum Savings, Expert Support, Real-time Updates, Lightning Fast)
- **Testimonials**: User reviews and ratings
- **Pricing Plans**: Basic (Free), Pro (₹999), Enterprise (Custom)
- **FAQ Section**: Common questions and answers
- **Footer**: Links to resources, legal pages, and company info

**Key Elements**:
- Framer Motion animations
- Responsive design
- Conditional routing based on authentication status
- Interactive FAQ accordion

#### Login Page (`/login`)
**File**: `frontend/src/pages/ImportantPage/Login/index.tsx`
**Purpose**: User authentication

**Features**:
- Email/password form
- Google OAuth integration
- Form validation
- Error handling with toast notifications
- Responsive design with motion animations

#### Registration Page (`/register`)
**File**: `frontend/src/pages/ImportantPage/Register/index.tsx`
**Purpose**: New user account creation

**Form Fields**:
- Full name
- Email address
- Phone number
- Password
- Terms and conditions acceptance

### 2. Main Application Pages

#### ITR Main Dashboard (`/fileITR`)
**File**: `frontend/src/pages/ImportantPage/FileITR/ITRMainPage/index.tsx`
**Purpose**: Central hub for tax filing process

**Features**:
- Welcome message with user's name
- PAN number display
- Current assessment year (AY 2024-2025)
- Progress tracking with visual indicators
- Quick navigation to different sections
- Image carousel with tax-related content

**Progress Steps**:
1. Link PAN & Pre-fill
2. Add your Details
3. File ITR

#### Personal Details Page (`/fileITR/personalDetail`)
**File**: `frontend/src/pages/ImportantPage/FileITR/Personal Detail/index.tsx`
**Purpose**: Collect user's personal and contact information

**Components**:
- **PersonalDetail**: Name, DOB, gender, marital status
- **AddressSection**: Complete address information
- **ContactDetail**: Phone, email, PAN details
- **BankDetails**: Bank account information for refunds

**Navigation**:
- Back: Upload Form16 page
- Next: Income Sources page

#### Income Sources Hub (`/fileITR/incomeSources`)
**File**: `frontend/src/pages/ImportantPage/FileITR/IncomeSources/index.tsx`
**Purpose**: Central page for all income types

**Income Categories**:
1. **Salary Income** (Form 16)
2. **Interest Income**
3. **Capital Gains**
4. **House Property Income**
5. **Professional/Business Income**
6. **Virtual Assets (Crypto/NFT)**
7. **Other Income**

### 3. Income Source Detail Pages

#### Form 16 / Salary Income
**Routes**:
- Manual Entry: `/fileITR/incomeSources/fill-detail`
- Interest Income: `/fileITR/incomeSources/incomeInterest`

**Components**:
- **Form16Manually**: Manual salary details entry
- **IncomeInterest**: Interest from savings accounts, FDs

**Schema**: Form16DataManual
```javascript
{
  userId: ObjectId,
  employerName: String,
  employerTAN: String,
  grossSalary: Number,
  salaryBreakup: [{ type: String, amount: Number }],
  perquisitesAmount: Number,
  standardDeduction: Number,
  professionalTax: Number,
  // ... additional fields
}
```

#### Capital Gains (`/fileITR/incomeSources/capitalGain`)
**File**: `frontend/src/ImportantComponent/CaptialGainComponent/CapitalGainSubMain.tsx`
**Purpose**: Manage all capital gains transactions

**Asset Types**:
1. **Stocks & Mutual Funds**
2. **Bonds & Debentures**
3. **Gold Assets**
4. **Land & Building**
5. **Foreign Assets**
6. **Stock RSUs**

**Schema**: StockMutualAssestSchema
```javascript
{
  userId: ObjectId,
  assetType: String, // "Stocks" or "Mutual Funds"
  assetSubType: String, // Listed/Non-Listed Securities
  dateOfSale: Date,
  dateOfPurchase: Date,
  description: String,
  salePrice: Number,
  transferExpenses: Number,
  purchasePrice: Number,
  sttPaid: Boolean,
  totalProfit: Number // Auto-calculated
}
```

#### House Property Income (`/fileITR/incomeSources/income-house-property`)
**Purpose**: Rental and self-occupied property management

**Property Types**:
- **Self-Occupied Property**: `/fileITR/incomeSources/self-occupied-property/:propertyIndex`
- **Rental Property**: `/fileITR/incomeSources/rental-property/:propertyIndex`

**Schema**: Property Model
```javascript
{
  userId: ObjectId,
  propertyIndex: String,
  propertyType: String,
  netTaxableIncome: Number,
  houseAddress: {
    flatNo: String,
    premiseName: String,
    road: String,
    area: String,
    pincode: String,
    country: String,
    state: String,
    city: String
  },
  ownerDetails: {
    ownerName: String,
    ownerPan: String,
    ownerShare: Number,
    hasMultipleOwners: Boolean,
    coOwners: [...]
  },
  rentalIncomeDetails: {
    annualRent: String,
    taxPaid: Number,
    standardDeduction: Number,
    netIncome: Number
  }
}
```

#### Professional/Business Income
**Routes**:
- Main: `/fileITR/incomeSources/income-professional-freelancing-business`
- Professional: `/fileITR/incomeSources/professional-income`
- Business: `/fileITR/incomeSources/bussiness-income`
- Books of Account: `/fileITR/incomeSources/book-of-account-dashboard`

**Accounting Components**:
- **Profit & Loss**: `/fileITR/profit-and-loss-boa`
- **Balance Sheet**: `/fileITR/balance-sheet-boa`
- **Depreciation**: `/fileITR/add-deprectation`

#### Virtual Assets (`/fileITR/incomeSources/virtual-assets`)
**Purpose**: Cryptocurrency and NFT income reporting

**Components**:
- **CryptoVDAComponent**: Cryptocurrency transactions
- **NFTComponent**: NFT trading income

#### Other Income (`/fileITR/incomeSources/other-income`)
**Sub-categories**:
- **Exempt Income**: `/fileITR/exempt-other-income`
- **Agricultural Income**: `/fileITR/agri-income`
- **Business Fund Income**: `/fileITR/bussiness-fund`

#### Dividend Income (`/fileITR/incomeSources/dividend-income`)
**Purpose**: Dividend from stocks and mutual funds

### 4. Tax Saving Section

#### Tax Saving Hub (`/tax-saving`)
**File**: `frontend/src/pages/ImportantPage/FileITR/TaxSaving/index.tsx`
**Purpose**: Manage all tax deductions and savings

**Categories**:
1. **Tax Deductions**
2. **Tax Paid**
3. **Other Tax Adjustments**

#### Tax Deduction Dashboard (`/tax-saving/dashboard`)
**Purpose**: Overview of all available deductions

**Deduction Types**:
- **Section 80C**: `/tax-saving/dashboard` (investments up to ₹1.5L)
- **Section 80D**: Medical insurance
- **Section 80G**: Donations (`/tax-saving/deduction-80g`)
- **Section 80GGA**: Rural donations (`/tax-saving/deduction-80gga`)
- **Political Contributions**: `/tax-saving/contri-party`

**Schema**: TaxInvestment
```javascript
{
  userId: ObjectId,
  section80C: Number (max: 150000),
  savingsInterest80TTA: Number,
  pensionContribution80CCC: Number (max: 150000),
  npsEmployeeContribution: Number,
  npsEmployerContribution: Number
}
```

#### Tax Paid Section (`/tax-saving/tax-paid`)
**Sub-sections**:
- **TDS Non-Salary**: `/tax-saving/tds-nonsalary`
- **TDS on Rent**: `/tax-saving/tds-rent`
- **Tax Collected**: `/tax-saving/tax-collected`

#### Other Tax (`/tax-saving/other-tax`)
**Purpose**: Additional tax adjustments and losses

### 5. Final Review

#### Tax Summary (`/fileITR/tax-summary`)
**File**: `frontend/src/pages/ImportantPage/FileITR/TaxSummary/index.tsx`
**Purpose**: Final review before filing

**Summary Sections**:
- **Income Summary**: All income sources totaled
- **Deduction Summary**: All eligible deductions
- **Tax Calculation**: Final tax liability/refund
- **Payment Section**: Tax payment if required

### 6. Additional Pages

#### Wallet (`/wallet`)
**File**: `frontend/src/pages/Wallet/Wallet.tsx`
**Purpose**: Payment management and transaction history

**Schema**: Wallet
```javascript
{
  userId: ObjectId (unique),
  balance: Number (min: 0),
  transactions: [{
    type: String (enum: ['credit', 'debit']),
    amount: Number,
    description: String,
    razorpayPaymentId: String,
    razorpayOrderId: String,
    status: String (enum: ['pending', 'completed', 'failed']),
    timestamp: Date
  }]
}
```

---

## Admin Panel

### Admin Authentication
**Route**: `/admin`
**Access Control**: Role-based (admin users only)

### Admin Dashboard (`/admin`)
**File**: `frontend/src/pages/ImportantPage/AdminDashboard/AdminDashboard.tsx`
**Features**:
- User statistics
- Transaction overview
- System health monitoring
- Quick actions

### Admin Pages

#### User Management (`/admin/users`)
**File**: `frontend/src/pages/ImportantPage/AdminDashboard/AdminUser.tsx`
**Features**:
- User list with search/filter
- User account management
- Role assignment
- Account status modification

#### GST Data Management (`/admin/all-gst-data`)
**File**: `frontend/src/pages/ImportantPage/AdminDashboard/AllGstindata.tsx`
**Purpose**: Manage GST-related information for business users

---

## Backend Schema Documentation

### Core Models

#### 1. User Management
```javascript
// User.js
{
  name: String (required),
  phone: String,
  email: String (required, unique, lowercase, trim),
  password: String,
  role: String (enum: ["admin", "user"], default: "user"),
  emailVerified: Boolean (default: false),
  emailVerificationDate: Date,
  lastVerificationEmailSent: Date,
  timestamps: true,
  virtuals: { canRequestVerificationEmail }
}

// PersonalDetail.js
{
  userId: ObjectId (ref: "User", required),
  firstName: String,
  middleName: String,
  lastName: String,
  dob: Date,
  gender: String,
  maritalStatus: String,
  timestamps: true
}

// ContactDetail.js
{
  userId: ObjectId (ref: "User", required),
  email: String,
  phone: String,
  panNumber: String,
  aadharNumber: String,
  alternativeEmail: String,
  alternativePhone: String,
  timestamps: true
}

// BankDetail.js
{
  userId: ObjectId (ref: "User", required),
  accountNumber: String,
  ifscCode: String,
  bankName: String,
  accountType: String,
  accountHolderName: String,
  timestamps: true
}
```

#### 2. Income Models
```javascript
// Form16DataManual.js
{
  userId: ObjectId (ref: "User", required),
  employerName: String,
  employerTAN: String,
  employerCategory: String,
  totalTax: String,
  grossSalary: Number,
  notifiedIncome: Number,
  salaryBreakup: [{ type: String, amount: Number }],
  perquisitesAmount: Number,
  perquisites: [{ description: String, amount: String }],
  profitAmount: Number,
  profitsInLieu: [{ description: String, amount: String }],
  notifiedCountry: [{ description: String, amount: String }],
  notifiedIncomeOtherCountry: Number,
  previousYearIncomeTax: Number,
  exemptAllowance: Number,
  exemptAllowancereakup: [SalaryBreakupSchema],
  balance: Number,
  standardDeduction: Number,
  professionalTax: Number,
  reliefUnder89: Number,
  incomeClaimed: Number,
  address: {
    pincode: Number,
    addressLine: String,
    country: String,
    state: String,
    city: String
  }
}

// StockMutualAssest.js
{
  userId: ObjectId (ref: "User"),
  assetType: String, // "Stocks" or "Mutual Funds"
  assetSubType: String, // Listed Securities, Non Listed Securities
  dateOfSale: Date,
  dateOfPurchase: Date,
  description: String,
  salePrice: Number,
  transferExpenses: Number,
  purchasePrice: Number,
  sttPaid: Boolean,
  totalProfit: Number (auto-calculated),
  timestamps: true
}

// Property.js
{
  userId: ObjectId (ref: "User", required),
  propertyIndex: String,
  propertyType: String,
  netTaxableIncome: Number,
  houseAddress: {
    flatNo: String,
    premiseName: String,
    road: String,
    area: String,
    pincode: String,
    country: String,
    state: String,
    city: String
  },
  ownerDetails: {
    ownerName: String,
    ownerPan: String,
    ownerShare: Number,
    hasMultipleOwners: Boolean,
    coOwners: [{
      coOwnerName: String,
      coOwnerPan: String,
      coOwnerShare: Number
    }]
  },
  taxSavings: {
    constructionYear: String,
    interestDuringConstruction: Number,
    interestAfterCompletion: Number,
    totalDeduction: Number
  },
  rentalIncomeDetails: {
    annualRent: String,
    taxPaid: Number,
    standardDeduction: Number,
    netIncome: Number
  }
}
```

#### 3. Tax Saving Models
```javascript
// TaxSavingInvestment.js
{
  userId: ObjectId (ref: "User", required),
  section80C: Number (default: 0, max: 150000),
  savingsInterest80TTA: Number (default: 0),
  pensionContribution80CCC: Number (default: 0, max: 150000),
  npsEmployeeContribution: Number (default: 0),
  npsEmployerContribution: Number (default: 0)
}

// Donation Models (80G, Political, Rural)
{
  userId: ObjectId (ref: "User", required),
  organizationName: String,
  donationType: String,
  amount: Number,
  date: Date,
  receiptNumber: String,
  eligibleAmount: Number,
  deductionPercentage: Number
}

// Medical Insurance (80D)
{
  userId: ObjectId (ref: "User", required),
  policyType: String,
  insuredPersons: String,
  premiumPaid: Number,
  eligibleAmount: Number,
  policyNumber: String,
  insuranceCompany: String
}
```

#### 4. Professional Income Models
```javascript
// ProfessionalIncome.js
{
  userId: ObjectId (ref: "User", required),
  businessType: String,
  businessName: String,
  businessAddress: String,
  grossReceipts: Number,
  totalIncome: Number,
  businessExpenses: Number,
  netProfit: Number,
  depreciationClaimed: Number
}

// BalanceSheet.js
{
  userId: ObjectId (ref: "User", required),
  year: String,
  assets: {
    fixedAssets: Number,
    currentAssets: Number,
    totalAssets: Number
  },
  liabilities: {
    capital: Number,
    currentLiabilities: Number,
    totalLiabilities: Number
  }
}

// ProfitLoss.js
{
  userId: ObjectId (ref: "User", required),
  year: String,
  income: {
    businessIncome: Number,
    otherIncome: Number,
    totalIncome: Number
  },
  expenses: {
    directExpenses: Number,
    indirectExpenses: Number,
    depreciation: Number,
    totalExpenses: Number
  },
  netProfit: Number
}
```

#### 5. Virtual Assets Models
```javascript
// CryptoIncome.js
{
  userId: ObjectId (ref: "User", required),
  assetType: String, // "Cryptocurrency" or "NFT"
  coinName: String,
  purchaseDate: Date,
  saleDate: Date,
  purchasePrice: Number,
  salePrice: Number,
  quantity: Number,
  exchangeName: String,
  transactionHash: String,
  profit: Number (auto-calculated)
}
```

#### 6. Other Income Models
```javascript
// AgriIncome.js
{
  userId: ObjectId (ref: "User", required),
  landArea: Number,
  location: String,
  cropType: String,
  annualIncome: Number,
  expenses: Number,
  netIncome: Number
}

// ExemptIncome.js
{
  userId: ObjectId (ref: "User", required),
  incomeType: String,
  description: String,
  amount: Number,
  section: String // Section under which exempt
}

// DividendIncome.js
{
  userId: ObjectId (ref: "User", required),
  companyName: String,
  dividendAmount: Number,
  taxDeducted: Number,
  dateReceived: Date,
  shareQuantity: Number
}
```

#### 7. Financial Models
```javascript
// Wallet.js
{
  userId: ObjectId (ref: "User", required, unique),
  balance: Number (default: 0, min: 0),
  transactions: [{
    type: String (enum: ['credit', 'debit'], required),
    amount: Number (required),
    description: String,
    razorpayPaymentId: String,
    razorpayOrderId: String,
    status: String (enum: ['pending', 'completed', 'failed'], default: 'pending'),
    timestamp: Date (default: Date.now)
  }],
  timestamps: true
}

// TaxSummary.js
{
  userId: ObjectId (ref: "User", required),
  assessmentYear: String,
  totalIncome: Number,
  totalDeductions: Number,
  taxableIncome: Number,
  taxLiability: Number,
  taxPaid: Number,
  refundAmount: Number,
  filingStatus: String,
  filingDate: Date
}
```

---

## API Endpoints & Data Flow

### Authentication Endpoints
```
POST /api/v1/auth/register - User registration
POST /api/v1/auth/login - User login
POST /api/v1/auth/google-login - Google OAuth
POST /api/v1/auth/verify-email - Email verification
POST /api/v1/auth/resend-verification - Resend verification email
POST /api/v1/auth/forgot-password - Password reset request
POST /api/v1/auth/reset-password - Password reset
```

### User Profile Endpoints
```
GET /api/v1/user/profile - Get user profile
PUT /api/v1/user/profile - Update user profile
GET /api/v1/fillDetail/getPersonalDetails - Get personal details
POST /api/v1/fillDetail/savePersonalDetails - Save personal details
GET /api/v1/fillDetail/getContactDetails - Get contact details
POST /api/v1/fillDetail/saveContactDetails - Save contact details
GET /api/v1/fillDetail/getBankDetails - Get bank details
POST /api/v1/fillDetail/saveBankDetails - Save bank details
```

### Income Source Endpoints
```
GET /api/v1/income/form16 - Get Form 16 data
POST /api/v1/income/form16 - Save Form 16 data
GET /api/v1/income/interest - Get interest income
POST /api/v1/income/interest - Save interest income
GET /api/v1/income/dividend - Get dividend income
POST /api/v1/income/dividend - Save dividend income
GET /api/v1/income/capital-gains - Get capital gains
POST /api/v1/income/capital-gains - Save capital gains
GET /api/v1/income/property - Get property income
POST /api/v1/income/property - Save property income
GET /api/v1/income/professional - Get professional income
POST /api/v1/income/professional - Save professional income
GET /api/v1/income/crypto - Get crypto income
POST /api/v1/income/crypto - Save crypto income
```

### Tax Saving Endpoints
```
GET /api/v1/tax-saving/investments - Get tax saving investments
POST /api/v1/tax-saving/investments - Save tax saving investments
GET /api/v1/tax-saving/deductions - Get deductions
POST /api/v1/tax-saving/deductions - Save deductions
GET /api/v1/tax-saving/donations - Get donations
POST /api/v1/tax-saving/donations - Save donations
GET /api/v1/tax-saving/medical - Get medical insurance
POST /api/v1/tax-saving/medical - Save medical insurance
```

### Calculation & Filing Endpoints
```
POST /api/v1/calculate/tax - Calculate tax liability
GET /api/v1/tax-summary - Get tax summary
POST /api/v1/file-itr - File ITR
GET /api/v1/filing-status - Get filing status
```

### Payment Endpoints
```
GET /api/v1/wallet/balance - Get wallet balance
POST /api/v1/wallet/add-money - Add money to wallet
GET /api/v1/wallet/transactions - Get transaction history
POST /api/v1/payment/create-order - Create payment order
POST /api/v1/payment/verify - Verify payment
```

### Admin Endpoints
```
GET /api/v1/admin/users - Get all users
PUT /api/v1/admin/users/:id - Update user
DELETE /api/v1/admin/users/:id - Delete user
GET /api/v1/admin/statistics - Get system statistics
GET /api/v1/admin/transactions - Get all transactions
GET /api/v1/admin/gst-data - Get GST data
```

---

## Navigation & User Experience

### Route Protection
- **Public Routes**: Home, Login, Register, Email Verification
- **Protected Routes**: All ITR-related pages (requires authentication)
- **Admin Routes**: Admin panel (requires admin role)

### Progressive Data Collection
The application uses a step-by-step approach:
1. **Personal Information** → Basic profile setup
2. **Income Sources** → Detailed income collection
3. **Tax Savings** → Deduction optimization
4. **Review & File** → Final calculation and submission

### Form Validation & Error Handling
- Client-side validation using Yup schemas
- Server-side validation with express-validator
- Real-time error feedback
- Toast notifications for user feedback

### State Management
- Redux Toolkit for global state
- User authentication state
- Form data persistence
- Theme management (dark/light mode)

### Responsive Design
- Mobile-first approach
- Responsive navigation
- Touch-friendly interfaces
- Progressive web app features

---

## Technical Architecture Summary

### Frontend Stack
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **React Router** for navigation
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Axios** for API calls
- **React Hook Form** for form management

### Backend Stack
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **Nodemailer** for email services
- **Razorpay** for payment processing

### Key Features
- **Multi-tenant architecture** supporting multiple users
- **Real-time tax calculations** based on Indian tax laws
- **Document upload and OCR processing** for automatic data extraction
- **Comprehensive audit trails** for all user actions
- **Secure payment processing** with Razorpay integration
- **Email notifications** for important events
- **Admin dashboard** for system management

This comprehensive documentation provides a complete overview of the BurnBlack tax management platform, covering all user flows, database schemas, API endpoints, and technical implementation details.