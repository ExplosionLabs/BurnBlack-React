#!/bin/bash
# Ultra-simple deployment script for BurnBlack-React

# Define installation directory
WEB_DIR="/var/www/html/burnblack"

echo "=== BurnBlack Deployment Script ==="
echo "Installing to: $WEB_DIR"

# Check for root
if [ "$(id -u)" != "0" ]; then
  echo "This script must be run as root"
  exit 1
fi

# Step 1: Create directories
echo "Creating directories..."
mkdir -p $WEB_DIR/backend
mkdir -p $WEB_DIR/frontend

# Step 2: Clone repository
echo "Cloning repository..."
cd /tmp
rm -rf burnblack-temp
git clone https://github.com/ExplosionLabs/BurnBlack-React.git burnblack-temp

# Step 3: Check if clone was successful
echo "Checking repository..."
if [ ! -d "/tmp/burnblack-temp/backend" ]; then
  echo "ERROR: Backend directory not found!"
  exit 1
fi

if [ ! -d "/tmp/burnblack-temp/frontend" ]; then
  echo "ERROR: Frontend directory not found!"
  exit 1
fi

# Step 4: Copy files
echo "Copying files..."
cp -R /tmp/burnblack-temp/backend/* $WEB_DIR/backend/
cp -R /tmp/burnblack-temp/frontend/* $WEB_DIR/frontend/

# Step 5: Install backend
echo "Setting up backend..."
cd $WEB_DIR/backend
npm install

# Step 6: Create .env file
echo "Creating environment file..."
echo "PORT=3001" > $WEB_DIR/backend/.env
echo "NODE_ENV=production" >> $WEB_DIR/backend/.env
echo "ERI_API_BASE_URL=https://api.incometax.gov.in/eri/api" >> $WEB_DIR/backend/.env
echo "ERI_USER_ID=ERIP007754" >> $WEB_DIR/backend/.env
echo "ERI_IP=13.232.70.157" >> $WEB_DIR/backend/.env

# Step 7: Install PM2
echo "Installing PM2..."
npm install -g pm2

# Step 8: Install frontend
echo "Setting up frontend..."
cd $WEB_DIR/frontend
npm install
npm run build

# Step 9: Configure Nginx
echo "Configuring Nginx..."
echo 'server {' > /etc/nginx/sites-available/burnblack
echo '    listen 80;' >> /etc/nginx/sites-available/burnblack
echo '    server_name _;' >> /etc/nginx/sites-available/burnblack
echo '' >> /etc/nginx/sites-available/burnblack
echo '    # Frontend' >> /etc/nginx/sites-available/burnblack
echo "    location / {" >> /etc/nginx/sites-available/burnblack
echo "        root $WEB_DIR/frontend/build;" >> /etc/nginx/sites-available/burnblack
echo '        index index.html index.htm;' >> /etc/nginx/sites-available/burnblack
echo '        try_files $uri $uri/ /index.html;' >> /etc/nginx/sites-available/burnblack
echo '    }' >> /etc/nginx/sites-available/burnblack
echo '' >> /etc/nginx/sites-available/burnblack
echo '    # Backend API' >> /etc/nginx/sites-available/burnblack
echo '    location /api/ {' >> /etc/nginx/sites-available/burnblack
echo '        proxy_pass http://localhost:3001/;' >> /etc/nginx/sites-available/burnblack
echo '        proxy_http_version 1.1;' >> /etc/nginx/sites-available/burnblack
echo '        proxy_set_header Upgrade $http_upgrade;' >> /etc/nginx/sites-available/burnblack
echo '        proxy_set_header Connection "upgrade";' >> /etc/nginx/sites-available/burnblack
echo '        proxy_set_header Host $host;' >> /etc/nginx/sites-available/burnblack
echo '        proxy_cache_bypass $http_upgrade;' >> /etc/nginx/sites-available/burnblack
echo '    }' >> /etc/nginx/sites-available/burnblack
echo '}' >> /etc/nginx/sites-available/burnblack

# Step 10: Enable site
echo "Enabling site..."
ln -sf /etc/nginx/sites-available/burnblack /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
systemctl restart nginx

# Step 11: Start backend
echo "Starting backend..."
cd $WEB_DIR/backend
if [ -f "$WEB_DIR/backend/dist/index.js" ]; then
  pm2 start dist/index.js --name burnblack-backend
else
  pm2 start index.js --name burnblack-backend
fi

# Step 12: Save PM2
echo "Saving PM2 configuration..."
pm2 save

# Done
echo "=== Deployment Complete ==="
echo "Your application should now be accessible at http://$(hostname -I | awk '{print $1}')" 