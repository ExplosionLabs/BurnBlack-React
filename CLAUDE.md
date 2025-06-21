# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- **Start development servers**: `npm run dev` (starts backend dev server)
- **Install all dependencies**: `npm run install-all` (installs root, backend, and frontend dependencies)  
- **Start production**: `npm start` (starts backend production server)

### Backend (from backend/ directory)
- **Development**: `npm run dev` (uses nodemon)
- **Production**: `npm start`
- **Testing**: `npm test` (uses jest)
- **Linting**: `npm run lint` (uses eslint)

### Frontend (from frontend/ directory)
- **Development**: `npm run dev` (uses vite)
- **Build**: `npm run build` (TypeScript compilation + vite build)
- **Preview**: `npm run preview`

## Architecture Overview

This is a full-stack Indian tax management platform (BurnBlack) with separate frontend and backend applications:

### Project Structure
- **Root**: Contains workspace package.json with scripts to manage both applications
- **Backend**: Node.js/Express API with MongoDB using Mongoose ODM
- **Frontend**: React/TypeScript application with Vite, Redux, and TailwindCSS
- **Docs**: Comprehensive documentation in `/docs` folder

### Backend Architecture
- **Technology Stack**: Node.js, Express, MongoDB, TypeScript
- **Key Features**: JWT authentication, Google OAuth, payment integration (Razorpay), email services, OCR processing
- **Structure**: 
  - Controllers organized by domain (Auth, Income, Tax, etc.)
  - Models using Mongoose schemas for tax data, user management, and financial calculations
  - Services layer for business logic (tax calculations, document processing, notifications)
  - Middleware for authentication, validation, rate limiting, and security

### Frontend Architecture  
- **Technology Stack**: React, TypeScript, Vite, Redux Toolkit, TailwindCSS, Material-UI
- **Key Features**: Multi-step tax filing wizard, document upload, calculations, payment integration
- **Structure**:
  - Component-based architecture with Base components, Layout, and Feature-specific components
  - Pages organized by tax filing workflow (Personal Details, Income Sources, Tax Saving, etc.)
  - Redux store for state management with slices for theme, user, and application state
  - API layer with Axios for backend communication

### Domain-Specific Context
This is a **tax management system** for Indian tax filing (ITR). Key domains include:
- **Personal Information**: PAN details, contact info, bank details
- **Income Sources**: Salary (Form 16), interest income, dividend income
- **House Property**: Rental income, property details, tenant information  
- **Capital Gains**: Stock transactions, mutual funds, gold, real estate, foreign assets
- **Business/Professional Income**: P&L statements, balance sheets, depreciation
- **Other Income**: Agricultural income, exempt income, crypto/VDA income
- **Tax Saving**: Deductions (80C, 80D, etc.), donations, loans
- **Tax Calculations**: Automated ITR computation and filing

### Authentication System
- Google OAuth integration for user authentication
- JWT tokens for session management  
- Role-based access with admin dashboard functionality
- Email verification and OTP systems

### Key Integration Points
- **Payment Gateway**: Razorpay for transaction processing
- **Email Services**: SendGrid and Nodemailer for notifications
- **Document Processing**: OCR with Tesseract.js for form scanning
- **File Management**: Multer for uploads, Excel processing for tax data

### Development Notes
- Backend uses both JavaScript and TypeScript files
- Frontend is fully TypeScript with strict type checking
- Comprehensive error handling and validation throughout
- Extensive logging and monitoring capabilities
- Both applications configured for production deployment on Vercel