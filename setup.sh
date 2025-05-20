#!/bin/bash
# Setup script for BurnBlack-React on Bitnami AWS Lightsail
# This script assumes the repository is already cloned

# Define the application path
APP_DIR="/var/www/html/BurnBlack-React"

echo "=== BurnBlack-React Setup Script ==="
echo "Setting up application at: $APP_DIR"

# Check for root
if [ "$(id -u)" != "0" ]; then
  echo "This script must be run as root"
  exit 1
fi

# Verify the application directory exists
if [ ! -d "$APP_DIR" ]; then
  echo "ERROR: Application directory $APP_DIR does not exist!"
  exit 1
fi

if [ ! -d "$APP_DIR/backend" ] || [ ! -d "$APP_DIR/frontend" ]; then
  echo "ERROR: Invalid repository structure. Missing backend or frontend directories."
  exit 1
fi

# Install Node.js dependencies
echo "=== Installing Node.js dependencies ==="
cd "$APP_DIR/backend"
echo "Installing backend dependencies..."
npm install

cd "$APP_DIR/frontend"
echo "Installing frontend dependencies..."
npm install

# Create backend environment file
echo "=== Creating backend environment file ==="
cat > "$APP_DIR/backend/.env" << EOL
PORT=3001
NODE_ENV=production
ERI_API_BASE_URL=https://api.incometax.gov.in/eri/api
ERI_USER_ID=ERIP007754
ERI_IP=13.232.70.157
EOL

# Build the frontend
echo "=== Building frontend ==="
cd "$APP_DIR/frontend"
npm run build

# Install PM2 globally if not already installed
if ! command -v pm2 &> /dev/null; then
  echo "=== Installing PM2 ==="
  npm install -g pm2
fi

# Configure Nginx
echo "=== Configuring Nginx ==="
cat > /etc/nginx/sites-available/burnblack << EOL
server {
    listen 80;
    server_name _;
    
    # Frontend
    location / {
        root $APP_DIR/frontend/build;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

# Enable site
ln -sf /etc/nginx/sites-available/burnblack /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Set proper ownership and permissions
echo "=== Setting permissions ==="
chown -R bitnami:daemon "$APP_DIR"
chmod -R 755 "$APP_DIR"

# Start the backend with PM2
echo "=== Starting backend service ==="
cd "$APP_DIR/backend"

# Determine the entry point
if [ -f "$APP_DIR/backend/dist/index.js" ]; then
  ENTRY_POINT="dist/index.js"
elif [ -f "$APP_DIR/backend/index.js" ]; then
  ENTRY_POINT="index.js"
else
  echo "ERROR: Cannot find backend entry point!"
  ls -la
  exit 1
fi

echo "Starting backend with entry point: $ENTRY_POINT"
pm2 start "$ENTRY_POINT" --name burnblack-backend

# Save PM2 config to persist across reboots
pm2 save
pm2 startup
systemctl restart nginx

# Get server IP
SERVER_IP=$(hostname -I | awk '{print $1}')

echo "=== Setup Complete ==="
echo "Your application should now be accessible at:"
echo "Frontend: http://$SERVER_IP"
echo "Backend API: http://$SERVER_IP/api/"
echo ""
echo "You can check the backend status with: pm2 status"
echo "View logs with: pm2 logs burnblack-backend" 