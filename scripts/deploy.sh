#!/bin/bash
set -e

echo "🚀 Deploying to DigitalOcean..."

cd /var/www/html/RunPayway

echo "🔄 Installing dependencies..."
npm install --no-audit --no-fund 2>&1 | tail -5

echo "💾 Checking swap..."
if ! swapon --show | grep -q '/swapfile'; then
  echo "📝 Creating 2GB swap file..."
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  echo "✅ Swap created"
else
  echo "✅ Swap already exists"
fi
free -h

echo "🏗️  Building app..."
npm run build 2>&1 | tail -10

echo "▶️  Starting app..."
npm install -g pm2 2>&1 | tail -1
pm2 restart runpayway || pm2 start npm --name runpayway -- start
pm2 save

echo "✅ Deployment complete!"
