#!/bin/bash
# Ultra-simple setup script for BurnBlack-React

echo "=== BurnBlack-React Setup Script ==="
echo "Starting setup..."

# Setup variables
APP_DIR="/var/www/html/BurnBlack-React"
echo "App directory: $APP_DIR"

# Install dependencies for backend
echo "Installing backend dependencies..."
cd "$APP_DIR/backend"
npm install

# Install dependencies for frontend
echo "Installing frontend dependencies..."
cd "$APP_DIR/frontend"
npm install

# Create backend environment file
echo "Creating environment file..."
echo "PORT=3001" > "$APP_DIR/backend/.env"
echo "NODE_ENV=production" >> "$APP_DIR/backend/.env"
echo "ERI_API_BASE_URL=https://api.incometax.gov.in/eri/api" >> "$APP_DIR/backend/.env"
echo "ERI_USER_ID=ERIP007754" >> "$APP_DIR/backend/.env"
echo "ERI_IP=13.232.70.157" >> "$APP_DIR/backend/.env"

# Build frontend
echo "Building frontend..."
cd "$APP_DIR/frontend"
npm run build

# Install PM2
echo "Installing PM2..."
npm install -g pm2

# Configure Nginx
echo "Configuring Nginx..."
echo "server {" > /etc/nginx/sites-available/burnblack
echo "    listen 80;" >> /etc/nginx/sites-available/burnblack
echo "    server_name _;" >> /etc/nginx/sites-available/burnblack
echo "" >> /etc/nginx/sites-available/burnblack
echo "    # Frontend" >> /etc/nginx/sites-available/burnblack
echo "    location / {" >> /etc/nginx/sites-available/burnblack
echo "        root $APP_DIR/frontend/build;" >> /etc/nginx/sites-available/burnblack
echo "        index index.html index.htm;" >> /etc/nginx/sites-available/burnblack
echo "        try_files \$uri \$uri/ /index.html;" >> /etc/nginx/sites-available/burnblack
echo "    }" >> /etc/nginx/sites-available/burnblack
echo "" >> /etc/nginx/sites-available/burnblack
echo "    # Backend API" >> /etc/nginx/sites-available/burnblack
echo "    location /api/ {" >> /etc/nginx/sites-available/burnblack
echo "        proxy_pass http://localhost:3001/;" >> /etc/nginx/sites-available/burnblack
echo "        proxy_http_version 1.1;" >> /etc/nginx/sites-available/burnblack
echo "        proxy_set_header Upgrade \$http_upgrade;" >> /etc/nginx/sites-available/burnblack
echo "        proxy_set_header Connection 'upgrade';" >> /etc/nginx/sites-available/burnblack
echo "        proxy_set_header Host \$host;" >> /etc/nginx/sites-available/burnblack
echo "        proxy_cache_bypass \$http_upgrade;" >> /etc/nginx/sites-available/burnblack
echo "    }" >> /etc/nginx/sites-available/burnblack
echo "}" >> /etc/nginx/sites-available/burnblack

# Enable site and restart Nginx
echo "Enabling site..."
ln -sf /etc/nginx/sites-available/burnblack /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
systemctl restart nginx

# Set permissions
echo "Setting permissions..."
chown -R bitnami:daemon "$APP_DIR"
chmod -R 755 "$APP_DIR"

# Start backend with PM2
echo "Starting backend..."
cd "$APP_DIR/backend"
PM2_ENTRY=""
if [ -f "$APP_DIR/backend/dist/index.js" ]
then
  PM2_ENTRY="dist/index.js"
  echo "Found entry point: dist/index.js"
else
  PM2_ENTRY="index.js"
  echo "Using default entry point: index.js"
fi
pm2 start "$PM2_ENTRY" --name burnblack-backend
pm2 save

# Display completion message
echo "=== Setup Complete ==="
SERVER_IP=$(hostname -I | awk '{print $1}')
echo "Frontend: http://$SERVER_IP"
echo "Backend API: http://$SERVER_IP/api/" 