#!/bin/bash
set -e

echo "🚀 Deploying to DigitalOcean..."

cd /var/www/html/RunPayway

echo "📥 Pulling latest code from GitHub..."
git pull origin main

echo "🔄 Installing dependencies..."
npm install --no-audit --no-fund 2>&1 | tail -5

echo "🛑 Stopping old process..."
pm2 kill 2>/dev/null || true

echo "🏗️  Building app..."
npm run build 2>&1 | tail -10

echo "▶️  Starting app..."
npm install -g pm2 2>&1 | tail -1
pm2 start npm --name runpayway -- start
pm2 save

echo "✅ Deployment complete!"
