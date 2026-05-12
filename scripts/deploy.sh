#!/bin/bash
set -e

echo "🚀 Deploying to DigitalOcean..."

cd /var/www/html/RunPayway

echo "🔄 Installing production dependencies..."
npm ci --omit=dev 2>&1 | tail -3

echo "▶️  Restarting app..."
npm install -g pm2 2>&1 | tail -1
pm2 restart runpayway || pm2 start npm --name runpayway -- start
pm2 save

echo "✅ Deployment complete!"
