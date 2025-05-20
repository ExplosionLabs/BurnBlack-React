#!/bin/bash
# Minimal setup script - no API config

echo "=== Minimal Setup Script ==="

# Use fixed paths instead of variables
echo "Setting up applications..."
cd /var/www/html/BurnBlack-React/backend
npm install

cd /var/www/html/BurnBlack-React/frontend
npm install
npm run build

# Install PM2
npm install -g pm2

# Configure Nginx
echo "Configuring Nginx..."
cat > /etc/nginx/sites-available/burnblack << EOF
server {
    listen 80;
    server_name _;
    
    location / {
        root /var/www/html/BurnBlack-React/frontend/build;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/burnblack /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
systemctl restart nginx

# Set permissions
chown -R bitnami:daemon /var/www/html/BurnBlack-React
chmod -R 755 /var/www/html/BurnBlack-React

# Start backend
echo "Starting backend..."
cd /var/www/html/BurnBlack-React/backend
echo "PORT=3001" > .env

# List files in backend directory to see what files exist
echo "Files in backend directory:"
ls -la

# Check for the entry point file
if [ -f "index.js" ]; then
  echo "Found index.js"
  pm2 start ./index.js --name burnblack-backend
elif [ -f "app.js" ]; then
  echo "Found app.js"
  pm2 start ./app.js --name burnblack-backend
elif [ -f "server.js" ]; then
  echo "Found server.js"
  pm2 start ./server.js --name burnblack-backend
else
  echo "ERROR: No entry point found. Please check the backend directory."
  exit 1
fi

pm2 save

# Display IP
echo "=== Setup Complete ==="
IP=$(hostname -I | awk '{print $1}')
echo "Your app should be available at: http://$IP" 