#!/bin/bash
set -e

echo "=== Enabling Apache modules ==="
a2enmod proxy proxy_http headers rewrite ssl

echo "=== Ensuring Let's Encrypt certificate exists for runpayway.peoplestar.com ==="
if [ ! -d /etc/letsencrypt/live/runpayway.peoplestar.com ]; then
  echo "Certificate not found, generating with certbot..."
  certbot certonly --standalone -d runpayway.peoplestar.com -n --agree-tos --email mcallpl@gmail.com 2>&1 || echo "Certbot failed; continuing with existing cert"
fi

echo "=== Creating VirtualHost for runpayway.peoplestar.com ==="
cat > /etc/apache2/sites-available/runpayway.conf << 'VHOST_CONFIG'
<VirtualHost *:80>
  ServerName runpayway.peoplestar.com
  Redirect permanent / https://runpayway.peoplestar.com/
</VirtualHost>

<VirtualHost *:443>
  ServerName runpayway.peoplestar.com
  SSLEngine on
  SSLCertificateFile /etc/letsencrypt/live/runpayway.peoplestar.com/fullchain.pem
  SSLCertificateKeyFile /etc/letsencrypt/live/runpayway.peoplestar.com/privkey.pem
  ProxyPreserveHost On
  ProxyPass / http://127.0.0.1:3000/
  ProxyPassReverse / http://127.0.0.1:3000/
</VirtualHost>
VHOST_CONFIG

echo "=== Enabling site ==="
a2ensite runpayway.conf

echo "=== Testing Apache config ==="
apache2ctl configtest

echo "=== Reloading Apache ==="
systemctl reload apache2
sleep 2

echo "✓ Apache configured for runpayway.peoplestar.com with SSL"
