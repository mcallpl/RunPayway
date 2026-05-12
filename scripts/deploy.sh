#!/bin/bash
set -e

echo "🚀 Deploying to DigitalOcean..."

cd /var/www/html/RunPayway

echo "🔄 Installing dependencies..."
npm ci 2>&1 | tail -3

echo "🧹 Clearing build cache..."
rm -rf .next/cache 2>/dev/null || true

echo "▶️  Restarting app..."
npm install -g pm2 2>&1 | tail -1
pm2 kill 2>/dev/null || true
sleep 3
pm2 start npm --name runpayway --cwd /var/www/html/RunPayway -- start
pm2 save
sleep 2
pm2 logs runpayway --nostream --lines 5

echo "✅ Deployment complete!"
