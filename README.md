# BurnBlack-React Deployment Guide

This guide explains how to deploy the BurnBlack-React application on a Bitnami server.

## Deployment Steps

1. Connect to your server through SSH:
   ```
   ssh bitnami@your-server-ip
   ```

2. Create the deployment script:
   ```
   nano deploy.sh
   ```
   
   Copy and paste the content of the `deploy.sh` script from this repository.

3. Make the script executable:
   ```
   chmod +x deploy.sh
   ```

4. Run the deployment script with root privileges:
   ```
   sudo ./deploy.sh
   ```

   > **Note:** The script must be run as root to install packages and configure Nginx.

5. The script will:
   - Create the application directories in `/var/www/html/burnblack`
   - Clone the repository to a temporary directory and copy files to the proper locations
   - Install dependencies for both frontend and backend
   - Configure Nginx to serve the application
   - Start the backend with PM2

## Application Structure

The application will be installed to standard web server directories:

```
/var/www/html/burnblack/
├── backend/          # Backend Node.js application
├── frontend/         # Frontend React application
```

## Post-Deployment

After deployment:

- The frontend will be accessible at: `http://your-server-ip`
- The backend API will be accessible at: `http://your-server-ip/api/`

## ERI Whitelisting

This deployment uses IP address `13.232.70.157` which is being whitelisted with the ERI system (ERIP007754) as specified in the whitelisting document.

## Maintenance

- To view running processes: `pm2 list`
- To restart the backend: `pm2 restart burnblack-backend`
- To view logs: `pm2 logs burnblack-backend`
- To update the application: Run the deployment script again

## Troubleshooting

- Check Nginx logs: `sudo less /var/log/nginx/error.log`
- Check application logs: `pm2 logs`
- Restart Nginx: `sudo systemctl restart nginx`
- Check file permissions: Make sure the web server has appropriate permissions on all files
