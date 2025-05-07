# BurnBlack Technical Documentation

## System Architecture

### Frontend
- React-based Single Page Application (SPA)
- Redux for state management
- TypeScript for type safety
- Material-UI components for UI elements
- Google OAuth integration for authentication

### Backend
- Node.js/Express.js server
- MongoDB database with Mongoose ODM
- JWT-based authentication
- RESTful API architecture

## Technical Workflows

### Authentication Flow
1. **Registration**
   - User provides name, phone, email, and password
   - Password is hashed using bcrypt
   - JWT token generated upon successful registration
   - Google OAuth registration supported

2. **Login**
   - Email/password authentication
   - Google OAuth login
   - JWT token generation and validation
   - Token expiration set to 7 days

3. **Password Reset** (Currently Incomplete)
   - Email-based OTP system (partially implemented)
   - Phone-based OTP system (partially implemented)
   - OTP verification and password update flow

### Data Models

1. **User Model**
   - Basic user information (name, email, phone)
   - Role-based access control (admin/user)
   - Password (hashed)
   - Timestamps for creation and updates

2. **Personal Details**
   - First, middle, last name
   - Date of birth
   - Gender
   - Marital status

3. **Contact Details**
   - Aadhar number
   - PAN number
   - Primary and secondary contact information
   - Email addresses

4. **Bank Details**
   - Multiple bank accounts support
   - Account numbers
   - IFSC codes
   - Bank names

5. **Tax-Related Models**
   - Tax Summary
   - Form 16
   - TDS Rent
   - Tax Investments
   - Loans
   - Donations (80G, 80GG)
   - Political Contributions
   - Disability Details
   - Other Deductions

6. **Property Models**
   - Rental Property
   - Property Details
   - Address Information
   - Owner Details
   - Tax Savings

7. **Wallet System**
   - Balance tracking
   - Transaction history
   - Razorpay integration
   - Payment status tracking

## User Journey

1. **Registration & Onboarding**
   - User registration (email/password or Google)
   - Personal details collection
   - Contact information verification
   - Bank details setup

2. **Tax Filing Process**
   - Form 16 upload
   - Income details entry
   - Deduction claims
   - Tax calculation
   - Payment processing
   - ITR filing

3. **Property Management**
   - Property details entry
   - Rental income tracking
   - Tax savings calculation
   - Owner information management

## Data Flow

1. **Authentication Flow**
   ```
   Client -> API Request -> JWT Validation -> Database -> Response
   ```

2. **Tax Calculation Flow**
   ```
   User Input -> Data Validation -> Tax Calculation -> Database Storage -> Summary Generation
   ```

3. **Payment Flow**
   ```
   Payment Initiation -> Razorpay Integration -> Transaction Recording -> Wallet Update
   ```

## Missing Items (In Order of Importance)

1. **Critical Security Features**
   - Complete password reset functionality
   - Email verification system
   - Phone number verification
   - Rate limiting for API endpoints
   - Input validation and sanitization

2. **Authentication Enhancements**
   - Two-factor authentication
   - Session management
   - Token refresh mechanism
   - Logout functionality

3. **Data Management**
   - Data backup system
   - Data export functionality
   - Data retention policies
   - Data migration tools

4. **User Experience**
   - Form validation feedback
   - Loading states
   - Error handling and user notifications
   - Progress tracking for tax filing

5. **Integration Features**
   - Complete Razorpay integration
   - Document upload system
   - Email notification system
   - SMS notification system

6. **Administrative Features**
   - Admin dashboard
   - User management interface
   - System monitoring tools
   - Audit logging

7. **Testing Infrastructure**
   - Unit tests
   - Integration tests
   - End-to-end tests
   - Performance testing

8. **Documentation**
   - API documentation
   - User guides
   - Developer documentation
   - Deployment guides

## Security Considerations

1. **Data Protection**
   - Sensitive data encryption
   - Secure password storage
   - API key management
   - Environment variable protection

2. **Access Control**
   - Role-based access control
   - API endpoint protection
   - Resource authorization
   - Session management

3. **Compliance**
   - GDPR compliance
   - Data privacy regulations
   - Tax regulations
   - Financial regulations 