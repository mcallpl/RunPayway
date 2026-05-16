#!/bin/bash
set -e

echo "=== Enabling Apache modules ==="
a2enmod proxy proxy_http headers rewrite ssl

# Determine which certificate to use
CERT_PATH="/etc/letsencrypt/live/webapps.peoplestar.com"
if [ -d "/etc/letsencrypt/live/runpayway.peoplestar.com" ]; then
  CERT_PATH="/etc/letsencrypt/live/runpayway.peoplestar.com"
  echo "✓ Using certificate for runpayway.peoplestar.com"
elif [ -d "/etc/letsencrypt/live/peoplestar.com" ]; then
  CERT_PATH="/etc/letsencrypt/live/peoplestar.com"
  echo "✓ Using certificate for peoplestar.com"
else
  echo "⚠ Using fallback certificate: webapps.peoplestar.com"
fi

echo "=== Creating VirtualHost for runpayway.peoplestar.com ==="
cat > /etc/apache2/sites-available/runpayway.conf << 'VHOST_CONFIG'
<VirtualHost *:80>
  ServerName runpayway.peoplestar.com
  ServerAlias www.runpayway.peoplestar.com
  Redirect permanent / https://runpayway.peoplestar.com/
</VirtualHost>

<VirtualHost *:443>
  ServerName runpayway.peoplestar.com
  ServerAlias www.runpayway.peoplestar.com
  SSLEngine on
  SSLCertificateFile CERT_PATH_PLACEHOLDER/fullchain.pem
  SSLCertificateKeyFile CERT_PATH_PLACEHOLDER/privkey.pem
  ProxyPreserveHost On
  ProxyPass / http://127.0.0.1:3000/
  ProxyPassReverse / http://127.0.0.1:3000/
</VirtualHost>
VHOST_CONFIG

# Replace the placeholder with actual cert path
sed -i "s|CERT_PATH_PLACEHOLDER|$CERT_PATH|g" /etc/apache2/sites-available/runpayway.conf

echo "=== Enabling site ==="
a2ensite runpayway.conf
a2dissite 000-default 2>/dev/null || true

echo "=== Testing Apache config ==="
apache2ctl configtest

echo "=== Reloading Apache ==="
systemctl reload apache2
sleep 2

echo "✓ Apache configured for runpayway.peoplestar.com"
echo "  Certificate: $CERT_PATH"
