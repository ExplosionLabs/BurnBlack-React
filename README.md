# BurnBlack - Indian Tax Management Platform

A comprehensive tax filing and management platform for Indian taxpayers, supporting ITR-1 through ITR-7 filings.

## 🚀 Quick Deploy to Vercel

This repository is optimized for one-click deployment to Vercel.

### Prerequisites
- Node.js 18+
- Environment variables configured in Vercel dashboard

### Deploy Steps
1. **Connect to Vercel**: Import this repository to your Vercel dashboard
2. **Environment Variables**: Add your environment variables in Vercel project settings
3. **Deploy**: Vercel will automatically build and deploy

### Environment Variables Required
```
VITE_BACKEND_URL=your_backend_url
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key
VITE_SUREPASS_TOKEN=your_surepass_token
```

## 🏗️ Project Structure

```
BurnBlack-React/
├── frontend/              # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── ITRFlow/   # Smart ITR Filing Flow
│   │   ├── pages/
│   │   └── services/
│   └── dist/             # Build output
├── backend/              # Node.js + Express backend  
│   ├── api/             # Vercel serverless functions
│   ├── routes/          # API routes
│   └── models/          # Database models
├── archive/             # Archived files (not deployed)
└── vercel.json          # Vercel deployment config
```

## 🔥 Key Features

### Smart ITR Filing Flow
- **Comprehensive Income Sources**: Salary, Business, Capital Gains, Foreign Assets, VDA
- **Complete Tax Deductions**: All sections from 80C to 80U
- **Automatic ITR Type Detection**: Based on income complexity
- **JSON Generation**: Ready-to-file ITR-1, ITR-2, ITR-3 formats
- **Tax Regime Comparison**: Old vs New regime optimization

### Technical Stack
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB, JWT Authentication
- **Deployment**: Vercel (Frontend) + Vercel Functions (API)
- **Security**: Rate limiting, CORS, Helmet, Input validation

## 🛠️ Local Development

```bash
# Install dependencies for both frontend and backend
npm run install-all

# Start development servers
npm run dev

# Build for production
npm run build
```

## 📁 Deployment Configuration

The project is configured for optimal Vercel deployment:

- **Frontend**: Vite static build optimized for Indian users (Mumbai region)
- **Backend**: Serverless functions for API endpoints
- **Environment**: Production-ready with security headers
- **Regions**: Optimized for Indian traffic (bom1)

## 🔐 Security Features

- JWT-based authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configured for production
- Helmet security headers
- Environment variable protection

## 📊 Supported ITR Types

- **ITR-1**: Salary + Basic Interest Income
- **ITR-2**: Capital Gains, House Property, Foreign Assets
- **ITR-3**: Business/Professional Income
- **ITR-4**: Presumptive Business Income

## 📝 License

Private - BurnBlack Platform
