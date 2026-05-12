#!/bin/bash
set -e

cd /var/www/html/RunPayway

echo "Installing dependencies..."
npm ci

echo "Verifying Next binary..."
ls -la node_modules/.bin/next
test -x node_modules/.bin/next

echo "Restarting RunPayway..."
pm2 delete runpayway || true
pm2 start /var/www/html/RunPayway/node_modules/.bin/next --name runpayway -- start -p 3000
pm2 save

sleep 3
pm2 logs runpayway --nostream --lines 30

echo "Testing local app..."
curl -s http://127.0.0.1:3000/RunPayway/ | grep -o "Structural Exposure\|Additional sections" | head -10

echo "Testing public URL..."
curl -sL https://peoplestar.com/RunPayway/ | grep -o "Structural Exposure\|Additional sections" | head -10
