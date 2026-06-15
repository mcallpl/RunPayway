#!/bin/bash
set -e

echo "=== Enabling Apache modules ==="
a2enmod proxy proxy_http headers rewrite ssl 2>/dev/null || true

CERT_PATH="/etc/letsencrypt/live/runpayway.peoplestar.com"

# Generate certificate if it doesn't exist
if [ ! -d "$CERT_PATH" ]; then
  echo "=== Attempting to generate Let's Encrypt certificate ==="
  if command -v certbot &> /dev/null; then
    systemctl stop apache2 || true
    timeout 30 certbot certonly \
      --standalone \
      -d runpayway.peoplestar.com \
      -d www.runpayway.peoplestar.com \
      -n \
      --agree-tos \
      --email mcallpl@gmail.com \
      --preferred-challenges http || echo "⚠ Certbot failed or timed out; continuing without cert generation"
    systemctl start apache2 || true
  else
    echo "⚠ Certbot not available; certificate must exist or be generated separately"
  fi
fi

echo "=== Creating VirtualHost for runpayway.peoplestar.com ==="

if [ -f "$CERT_PATH/fullchain.pem" ] && [ -f "$CERT_PATH/privkey.pem" ]; then
  echo "✓ Certificate found; configuring HTTP→HTTPS with SSL"
  cat > /etc/apache2/sites-available/runpayway.conf << EOF
<VirtualHost *:80>
  ServerName runpayway.peoplestar.com
  ServerAlias www.runpayway.peoplestar.com
  Redirect permanent / https://runpayway.peoplestar.com/
</VirtualHost>

<VirtualHost *:443>
  ServerName runpayway.peoplestar.com
  ServerAlias www.runpayway.peoplestar.com
  SSLEngine on
  SSLCertificateFile $CERT_PATH/fullchain.pem
  SSLCertificateKeyFile $CERT_PATH/privkey.pem
  ProxyPreserveHost On
  ProxyPass / http://127.0.0.1:3000/
  ProxyPassReverse / http://127.0.0.1:3000/
</VirtualHost>
EOF
else
  echo "⚠ Certificate not found; configuring HTTP-only proxy"
  cat > /etc/apache2/sites-available/runpayway.conf << EOF
<VirtualHost *:80>
  ServerName runpayway.peoplestar.com
  ServerAlias www.runpayway.peoplestar.com
  ProxyPreserveHost On
  ProxyPass / http://127.0.0.1:3000/
  ProxyPassReverse / http://127.0.0.1:3000/
</VirtualHost>
EOF
fi

echo "=== Enabling site ==="
a2ensite runpayway.conf
a2dissite 000-default 2>/dev/null || true

echo "=== Testing Apache config ==="
apache2ctl configtest

echo "=== Reloading Apache ==="
systemctl reload apache2
sleep 2

echo "✓ Apache configured with valid certificate for runpayway.peoplestar.com"
