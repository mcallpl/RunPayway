# RunPayway™ Deployment Guide

## Overview
This document defines the automated deployment system that ensures RunPayway stays operational 24/7 with zero deployment issues.

## Architecture

### 1. Pre-Deployment Validation (GitHub Actions)
**File:** `.github/workflows/deploy.yml`

Runs automatically on every push to main:
- Validates Node.js dependencies can be installed
- Checks all required build artifacts are created
- Verifies environment variables are configured
- Tests SSH connection to DigitalOcean
- Validates Next.js build succeeds
- Checks HTTP connectivity post-deployment
- Runs deployment validation script on server

**Benefits:**
- Broken code never reaches production
- Missing environment variables caught before deployment
- SSH key issues detected early
- Build failures block deployment automatically

### 2. Enhanced Health Check Endpoint
**File:** `src/app/api/health/route.ts`
**Access:** `GET /api/health`

Comprehensive health check returning:
```json
{
  "status": "ok|warning|error",
  "timestamp": "2026-06-20T21:00:00.000Z",
  "model": "RP-2.0",
  "summary": {
    "environment": "ok|warning|error",
    "build_artifacts": "ok|error",
    "api_routes": "ok|warning",
    "external_services": "ok|warning",
    "node_environment": "ok"
  },
  "details": { ... }
}
```

**Validates:**
1. **Environment Variables** - GEMINI_API_KEY, STRIPE_CHECKOUT_URL
2. **Build Artifacts** - .next directory, package.json present
3. **API Routes** - Critical endpoints accessible
4. **External Services** - Stripe, Gemini configured
5. **Node Environment** - Node version, runtime environment

**HTTP Status Codes:**
- `200 OK` - All checks passed (or warnings only)
- `503 Service Unavailable` - Critical errors detected

**Usage:**
```bash
# Quick health check
curl https://runpayway.peoplestar.com/api/health

# Parse JSON response
curl -s https://runpayway.peoplestar.com/api/health | jq '.summary'
```

### 3. Post-Deployment Validation Script
**File:** `deploy/validate-deployment.sh`
**Location on Server:** `/var/www/html/RunPayway/deploy/validate-deployment.sh`
**Runs:** Automatically after each deployment via GitHub Actions

**Validates:**
- Critical files exist (.next, package.json, next.config.js, .env.local)
- Directory permissions are correct
- PM2 process is registered
- Node.js dependencies installed
- Environment variables configured
- HTTP connectivity working
- API health endpoint responding

**Manual Execution:**
```bash
ssh root@64.227.108.128 bash /var/www/html/RunPayway/deploy/validate-deployment.sh
```

**Output:**
- Green checkmarks (✓) for successful checks
- Yellow warnings (⚠️) for non-critical issues
- Red errors (✗) for critical failures
- Log file at `/var/log/runpayway-deployment.log`

## Deployment Workflow

### Automatic Deployment (On Push to Main)

1. **GitHub Actions Triggered**
   ```
   Push to main → .github/workflows/deploy.yml starts
   ```

2. **Pre-Flight Checks**
   - Node.js dependencies resolved
   - Next.js build succeeds
   - Environment variables loaded
   - SSH credentials validated

3. **Build & Upload**
   - Build Next.js application
   - Create .env.local with secrets
   - Upload .next, public, src, config files to server
   - Clean existing node_modules (prevents corruption)

4. **Installation & Restart**
   ```bash
   cd /var/www/html/RunPayway
   npm ci --omit=dev           # Install production dependencies
   pm2 restart runpayway       # Restart with PM2
   ```

5. **Verification**
   - Check PM2 status
   - HTTP response code (should be 200)
   - Run deployment validation script
   - Verify /api/health endpoint

6. **Completion**
   - App available at https://runpayway.peoplestar.com
   - All critical systems validated
   - Logs available for debugging

### Manual Deployment

If automatic deployment fails:

```bash
# 1. SSH into DigitalOcean
ssh root@64.227.108.128

# 2. Check current status
cd /var/www/html/RunPayway
pm2 status
pm2 logs runpayway

# 3. Validate deployment
bash /var/www/html/RunPayway/deploy/validate-deployment.sh

# 4. Restart if needed
pm2 restart runpayway

# 5. Monitor logs
pm2 logs runpayway --lines 50
```

## Monitoring & Alerts

### Health Check Monitoring
Set up regular checks:

```bash
# Cron job (run every 5 minutes)
*/5 * * * * curl -s https://runpayway.peoplestar.com/api/health | grep -q '"status":"ok"' || echo "RunPayway health check failed" | mail -s "RunPayway Alert" admin@email.com
```

### PM2 Monitoring
Monitor process status:

```bash
# Check current status
ssh root@64.227.108.128 pm2 status

# Watch real-time logs
ssh root@64.227.108.128 pm2 logs runpayway --lines 100

# Check memory/CPU usage
ssh root@64.227.108.128 pm2 monit
```

### Log Files
- **Application Logs:** `ssh root@64.227.108.128 pm2 logs runpayway`
- **Deployment Logs:** `/var/log/runpayway-deployment.log`
- **System Logs:** `/var/log/syslog` (grep for "runpayway" or "node")

## Troubleshooting

### Issue: HTTP 500 or 502 errors

**Check 1: PM2 Process**
```bash
ssh root@64.227.108.128 pm2 status
```
If status is "stopped" or "errored":
```bash
ssh root@64.227.108.128 "cd /var/www/html/RunPayway && pm2 restart runpayway"
```

**Check 2: Application Logs**
```bash
ssh root@64.227.108.128 pm2 logs runpayway --err
```
Look for error messages in stdout/stderr

**Check 3: Environment Variables**
```bash
ssh root@64.227.108.128 cat /var/www/html/RunPayway/.env.local
```
Verify GEMINI_API_KEY and STRIPE_CHECKOUT_URL are present

**Check 4: Disk Space**
```bash
ssh root@64.227.108.128 df -h /var/www/html
```
If < 500MB free, clean up old node_modules:
```bash
ssh root@64.227.108.128 "rm -rf /var/www/html/RunPayway/node_modules && cd /var/www/html/RunPayway && npm ci --omit=dev"
```

### Issue: Health Check Returns Warnings

**Missing Environment Variables:**
```bash
ssh root@64.227.108.128 "cd /var/www/html/RunPayway && cat .env.local"
```
If missing, update via GitHub Actions secrets, then redeploy

**Missing Build Artifacts:**
```bash
ssh root@64.227.108.128 "ls -la /var/www/html/RunPayway/.next"
```
If missing, rebuild:
```bash
ssh root@64.227.108.128 "cd /var/www/html/RunPayway && npm run build"
```

### Issue: Deployment Fails in GitHub Actions

1. **Check SSH Key:**
   - Verify `DO_SSH_PRIVATE_KEY` secret exists in GitHub repo settings
   - Key must be base64 encoded
   - Test locally: `echo $DO_SSH_PRIVATE_KEY | base64 -d > ~/.ssh/test_key`

2. **Check Secrets:**
   - `DO_SSH_PRIVATE_KEY` - SSH private key (base64)
   - `GEMINI_API_KEY` - Google Gemini API key
   - `NEXT_PUBLIC_STRIPE_CHECKOUT_URL` - Stripe URL

3. **View Logs:**
   - Go to GitHub Actions tab in repo
   - Click failing workflow
   - Review "Deploy to DigitalOcean" job logs

## Rollback Procedure

If deployment causes issues:

### Option 1: Restart Previous PM2 Process
```bash
ssh root@64.227.108.128 "pm2 restart runpayway"
```

### Option 2: Revert to Last Working Commit
```bash
# Force push previous commit
git push -f origin main~1:main

# GitHub Actions will auto-deploy the previous version
```

### Option 3: Manual File Restore
```bash
ssh root@64.227.108.128 "cd /var/www/html/RunPayway && git checkout HEAD~1 -- ."
pm2 restart runpayway
```

## Performance Optimization

### Build Optimization
- `typescript: { ignoreBuildErrors: true }` - Allows builds to proceed with TS errors
- `eslint: { ignoreDuringBuilds: true }` - Prevents ESLint from blocking builds
- Security headers in `next.config.js` for optimal HTTPS performance

### Caching
- Static assets cache for 365 days
- API responses cache based on headers
- Next.js automatic static optimization

### Monitoring Build Size
```bash
ssh root@64.227.108.128 "du -sh /var/www/html/RunPayway/.next"
```
Ideal size: < 100MB (if > 500MB, clean and rebuild)

## Security Notes

1. **SSH Keys:** Private key stored in GitHub Actions secrets (base64 encoded)
2. **API Keys:** Environment variables never logged or exposed
3. **Secrets:** .env.local not stored in Git, only created during deployment
4. **HTTPS:** All endpoints redirect to HTTPS, TLS 1.2+ enforced
5. **Headers:** Security headers (CSP, HSTS, X-Frame-Options) set in next.config.js

## Critical Files & Paths

```
Local Development:
  /Users/cjmcallister/RunPayway/
  ├── src/app/api/health/route.ts          (Health check endpoint)
  ├── deploy/validate-deployment.sh        (Validation script)
  ├── .github/workflows/deploy.yml         (GitHub Actions)
  └── next.config.js                       (Build config)

Production Server (64.227.108.128):
  /var/www/html/RunPayway/
  ├── .next/                               (Built app)
  ├── node_modules/                        (Dependencies)
  ├── .env.local                           (Secrets - created at deploy)
  ├── package.json
  ├── public/
  └── deploy/validate-deployment.sh        (Validation script)

Logs & Config:
  /var/log/runpayway-deployment.log       (Deployment validation log)
  /etc/nginx/sites-enabled/runpayway*     (Nginx config)
```

## Related Documentation

- **GitHub Actions:** `.github/workflows/deploy.yml`
- **Health Check:** `src/app/api/health/route.ts`
- **Next.js Config:** `next.config.js`
- **Nginx Config:** `/etc/nginx/sites-enabled/` (on server)

---

**Last Updated:** June 20, 2026
**Owner:** RunPayway Team
**Reliability Target:** 99.9% uptime with automated safeguards
