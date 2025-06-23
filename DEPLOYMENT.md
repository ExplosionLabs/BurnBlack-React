# Deployment Guide

## Prerequisites

1. **Google OAuth Setup**: Ensure you have valid Google OAuth credentials
2. **Vercel Account**: For hosting both frontend and backend
3. **Environment Variables**: All required secrets configured

## Backend Deployment

1. **Deploy Backend to Vercel**:
   ```bash
   cd backend
   vercel --prod
   ```

2. **Set Backend Environment Variables in Vercel**:
   - `JWT_SECRET`: Your JWT secret key
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
   - `NODE_ENV`: production

3. **Note the Backend URL**: After deployment, copy the backend URL (e.g., `https://burnblack-backend.vercel.app`)

## Frontend Deployment

1. **Set Frontend Environment Variables in Vercel**:
   - `VITE_BACKEND_URL`: Your backend URL from step 3 above
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth client ID

2. **Deploy Frontend**:
   ```bash
   cd ../
   vercel --prod
   ```

## Google OAuth Configuration

Update your Google Cloud Console OAuth settings:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Credentials > OAuth 2.0 Client IDs
3. Add your production URLs to **Authorized JavaScript origins**:
   - `https://your-frontend-url.vercel.app`
4. Add your production URLs to **Authorized redirect URIs**:
   - `https://your-frontend-url.vercel.app`

## Environment Variables Summary

### Backend (Vercel Environment Variables)
```
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NODE_ENV=production
```

### Frontend (Vercel Environment Variables)
```
VITE_BACKEND_URL=https://your-backend-url.vercel.app
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## Troubleshooting

1. **CORS Issues**: Ensure backend allows requests from frontend domain
2. **Environment Variables**: Check they're set correctly in Vercel dashboard
3. **Google OAuth**: Verify authorized origins include your production domains
4. **Network Errors**: Ensure backend is deployed and accessible

## Current Status

- ✅ Local development working
- ⏳ Backend deployment needed
- ⏳ Production environment variables needed
- ⏳ Google OAuth production setup needed