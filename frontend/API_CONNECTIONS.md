# Frontend-Backend API Connections

## Overview
The frontend is properly connected to the backend using environment variables and centralized API configuration.

## Environment Configuration

### Required Environment Variables
Create a `.env` file in the frontend directory with:

```env
# Backend API Configuration
VITE_BACKEND_URL=http://localhost:5001

# Supabase Configuration  
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: External service configurations
VITE_SUREPASS_API_URL=https://api.surepass.io
VITE_SUREPASS_API_KEY=your-surepass-api-key
```

## API Configuration
- **Centralized Config**: `/src/config/api.ts` - All API endpoints and configuration
- **Backend Base URL**: Configurable via `VITE_BACKEND_URL` environment variable
- **Authentication**: JWT tokens stored in localStorage, included in API headers

## API Endpoints Structure

### Authentication APIs (`/api/v1/auth`)
- `POST /register` - User registration
- `POST /login` - User login  
- `POST /google` - Google OAuth login
- `GET /me` - Get user profile
- `PUT /profile` - Update user profile
- `POST /logout` - User logout

### ITR Filing APIs (`/api/v1/itr`)
- `POST /upload` - Upload ITR data for processing
- `POST /validate` - Validate ITR data with IT Department
- `POST /submit` - Submit ITR to IT Department
- `POST /documents` - Generate ITR documents

### Income & Tax APIs
- `/api/v1/calculateIncome/*` - Income calculation endpoints
- `/api/v1/fillDetail/*` - Form data endpoints
- `/api/v1/tax/*` - Tax calculation endpoints

## Key Features

### 1. No Mock Data in Production
- ✅ All faker/mock data removed from core components
- ✅ Test components only show in development mode
- ✅ Real API endpoints configured for all functionality

### 2. Proper Error Handling
- ✅ Standardized error handling across all API calls
- ✅ Authentication token validation
- ✅ Network error handling with retry mechanisms

### 3. Real ITR Filing Integration
- ✅ `ITRFilingService` connects to real backend endpoints
- ✅ Fallback to development mode when backend unavailable
- ✅ Progress tracking and status updates
- ✅ Document generation and download

### 4. Authentication Flow
- ✅ JWT token management
- ✅ Automatic token refresh
- ✅ Supabase integration for OAuth
- ✅ Protected routes and middleware

## File Structure

```
src/
├── config/
│   └── api.ts                    # Centralized API configuration
├── api/                          # API layer files
│   ├── authApiPrisma.ts         # Authentication APIs
│   ├── userApi.ts               # User management APIs
│   ├── fileITR.ts               # ITR file upload APIs
│   ├── calculateIncome.ts       # Income calculation APIs
│   └── ...
├── services/
│   ├── ITRFilingService.ts      # ITR filing service (real backend)
│   └── ITRJSONGenerator.ts      # ITR JSON generation
├── utils/
│   ├── validation.ts            # Input validation utilities
│   └── errorHandler.ts          # Standardized error handling
└── contexts/
    ├── SupabaseAuthContext.tsx  # Supabase authentication
    └── ITRFlowContext.tsx       # ITR flow state management
```

## Production Deployment

### Environment Setup
1. Set `VITE_BACKEND_URL` to production backend URL
2. Configure Supabase production credentials
3. Ensure all environment variables are properly set

### Verification
- ✅ No hardcoded localhost URLs in production code
- ✅ Environment variable validation on startup
- ✅ Proper CORS configuration between frontend and backend
- ✅ HTTPS enforced in production

### Testing Connectivity
1. Check browser network tab for API calls
2. Verify authentication flow with real backend
3. Test ITR filing process end-to-end
4. Confirm file uploads and downloads work

## Security Considerations
- JWT tokens stored securely in localStorage
- Automatic token refresh and validation
- CSRF protection via proper headers
- Input validation on both frontend and backend
- HTTPS enforcement in production

## Troubleshooting

### Common Issues
1. **CORS errors**: Ensure backend CORS is configured for frontend domain
2. **401 Unauthorized**: Check JWT token validity and backend authentication
3. **Environment variables**: Verify all required variables are set
4. **Network errors**: Check backend availability and network connectivity

### Debug Mode
- Set `VITE_NODE_ENV=development` to enable debug logging
- Check browser console for detailed error messages
- Use TestDataCapture component for data validation (dev only)