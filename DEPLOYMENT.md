# Deployment & Infrastructure

## Server Environment
- **Host:** DigitalOcean droplet (64.227.108.128)
- **OS:** Ubuntu
- **Web Server:** Apache 2.4.58
- **Node.js:** Running on port 3000

## SSL Certificates
- **Domain:** runpayway.peoplestar.com
- **Provider:** Let's Encrypt (auto-renewed)
- **Certificate Path:** `/etc/letsencrypt/live/runpayway.peoplestar.com/`
- **Checksum:** Verified in engine startup

## Apache Virtual Hosts Configuration

### runpayway.peoplestar.com
**File:** `/etc/apache2/sites-available/runpayway.conf`

Redirects all HTTP and HTTPS traffic from `https://runpayway.peoplestar.com` to `http://64.227.108.128/Runpayway`:

```apache
<VirtualHost *:80>
  ServerName runpayway.peoplestar.com
  Redirect permanent / http://64.227.108.128/Runpayway
</VirtualHost>

<VirtualHost *:443>
  ServerName runpayway.peoplestar.com
  SSLEngine on
  SSLCertificateFile /etc/letsencrypt/live/runpayway.peoplestar.com/fullchain.pem
  SSLCertificateKeyFile /etc/letsencrypt/live/runpayway.peoplestar.com/privkey.pem
  Redirect permanent / http://64.227.108.128/Runpayway
</VirtualHost>
```

**Key Points:**
- HTTPS is enforced with valid SSL certificate
- All traffic redirects to the IP-based path (not proxied)
- Certificate must match domain exactly (CN = runpayway.peoplestar.com)

### Default Server (/RunPayway path)
**File:** `/etc/apache2/sites-available/000-default.conf`

The default server (port 80, any hostname) serves the RunPayway static export at `/RunPayway/`:

```apache
Alias /RunPayway /var/www/html/RunPayway
<Directory /var/www/html/RunPayway>
    AllowOverride All
    Require all granted
    DirectoryIndex index.html
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /RunPayway/
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_FILENAME}/index.html -f
        RewriteRule ^(.*)$ $1/index.html [L]
    </IfModule>
</Directory>
```

**Key Points:**
- Aliases `/RunPayway` directory path to `/var/www/html/RunPayway`
- DirectoryIndex serves `index.html` when accessing directories
- URL rewriting handles Next.js static export routing (missing routes → index.html)
- AllowOverride allows `.htaccess` to override with additional rules

## Next.js Static Export
**Location:** `/var/www/html/RunPayway/`

The application is a Next.js 15 static export (STATIC_EXPORT=true).

**Build Output:** Standalone HTML, CSS, and JS files
- Entry point: `index.html`
- Assets: `_next/static/`
- Routes: Individual directories (e.g., `/about/`, `/pricing/`)

**The .htaccess file** (`/var/www/html/RunPayway/.htaccess`) provides:
- Directory index fallback
- URL rewriting for SPA routing
- Cache control headers for assets and HTML

## Request Flow

```
https://runpayway.peoplestar.com
    ↓ (301 redirect via Apache)
http://64.227.108.128/Runpayway/
    ↓ (served by default server Alias)
/var/www/html/RunPayway/index.html
    ↓ (rendered in browser)
Next.js app with proper route handling
```

## Deployment Process

1. Code is pushed to GitHub
2. GitHub Actions workflow (`.github/workflows/deploy.yml`) is triggered
3. Static export is built: `STATIC_EXPORT=true npx next build`
4. Files are deployed to `/var/www/html/RunPayway/` via FTP or SSH
5. Apache automatically serves updated files

## SSL Certificate Troubleshooting

**Issue:** Certificate mismatch error (NET::ERR_CERT_COMMON_NAME_INVALID)
- **Cause:** Apache vhost pointing to wrong certificate path (e.g., webapps cert instead of runpayway cert)
- **Fix:** Ensure `SSLCertificateFile` and `SSLCertificateKeyFile` in `runpayway.conf` point to correct domain's cert directory

**Verify Certificate:**
```bash
openssl x509 -in /etc/letsencrypt/live/runpayway.peoplestar.com/cert.pem -text -noout | grep -A 2 "Subject:"
```

## Apache Configuration Verification

Test configuration syntax:
```bash
apache2ctl configtest
```

Reload Apache after changes:
```bash
apachectl graceful
```

List active virtual hosts:
```bash
apache2ctl -S
```

## Future Improvements
- Consider wildcard certificate (`*.peoplestar.com`) to consolidate SSL across subdomains
- Document other vhosts (webapps.peoplestar.com, leads.peoplestar.com)
- Add monitoring/alerting for certificate expiration
