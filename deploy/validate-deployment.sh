#!/bin/bash
# RunPayway Deployment Validator
# Run this after any deployment to catch missing files, permission issues, etc
# Should be part of post-deploy hooks and scheduled checks

set -e

RUNPAYWAY_ROOT="/var/www/html/RunPayway"
LOG_FILE="/var/log/runpayway-deployment.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_success() {
  echo -e "${GREEN}[OK]${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

log_warning() {
  echo -e "${YELLOW}[WARN]${NC} $1" | tee -a "$LOG_FILE"
}

# Header
echo "======================================================" | tee -a "$LOG_FILE"
echo "RunPayway Deployment Validation - $(date '+%Y-%m-%d %H:%M:%S')" | tee -a "$LOG_FILE"
echo "======================================================" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Check if RunPayway directory exists
if [ ! -d "$RUNPAYWAY_ROOT" ]; then
  log_error "RunPayway directory not found at $RUNPAYWAY_ROOT"
  exit 1
fi

# 1. Check critical files
echo "1. Checking critical files..." | tee -a "$LOG_FILE"
critical_files=(
  "$RUNPAYWAY_ROOT/.next"
  "$RUNPAYWAY_ROOT/package.json"
  "$RUNPAYWAY_ROOT/next.config.js"
  "$RUNPAYWAY_ROOT/.env.local"
  "$RUNPAYWAY_ROOT/public/favicon.ico"
)

missing_files=()
for file in "${critical_files[@]}"; do
  if [ -e "$file" ]; then
    log_success "Found: $(basename $file)"
  else
    log_error "Missing: $file"
    missing_files+=("$file")
  fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
  log_error "Critical files missing: ${missing_files[*]}"
  exit 1
fi

echo "" | tee -a "$LOG_FILE"

# 2. Check directory permissions
echo "2. Checking directory permissions..." | tee -a "$LOG_FILE"
if [ -w "$RUNPAYWAY_ROOT" ]; then
  log_success "RunPayway directory is writable"
else
  log_error "RunPayway directory is not writable"
  exit 1
fi

if [ -w "$RUNPAYWAY_ROOT/.next" ]; then
  log_success "Build output directory (.next) is writable"
else
  log_warning "Build output directory (.next) is not writable (may cause issues)"
fi

echo "" | tee -a "$LOG_FILE"

# 3. Check PM2 process
echo "3. Checking PM2 process..." | tee -a "$LOG_FILE"
if pm2 list | grep -q "runpayway"; then
  log_success "PM2 process 'runpayway' is registered"
  pm2 status | grep runpayway | tee -a "$LOG_FILE"
else
  log_warning "PM2 process 'runpayway' not found (may not be running yet)"
fi

echo "" | tee -a "$LOG_FILE"

# 4. Check Node.js dependencies
echo "4. Checking Node.js dependencies..." | tee -a "$LOG_FILE"
if [ -d "$RUNPAYWAY_ROOT/node_modules" ]; then
  node_modules_count=$(find "$RUNPAYWAY_ROOT/node_modules" -maxdepth 1 -type d | wc -l)
  if [ "$node_modules_count" -gt 5 ]; then
    log_success "node_modules installed ($node_modules_count directories)"
  else
    log_warning "node_modules may be incomplete"
  fi
else
  log_warning "node_modules not found (may need to reinstall)"
fi

echo "" | tee -a "$LOG_FILE"

# 5. Check environment variables
echo "5. Checking environment variables..." | tee -a "$LOG_FILE"
if [ -f "$RUNPAYWAY_ROOT/.env.local" ]; then
  log_success ".env.local file exists"
  if grep -q "GEMINI_API_KEY" "$RUNPAYWAY_ROOT/.env.local"; then
    log_success "GEMINI_API_KEY configured"
  else
    log_warning "GEMINI_API_KEY not found in .env.local"
  fi
  if grep -q "NEXT_PUBLIC_STRIPE_CHECKOUT_URL" "$RUNPAYWAY_ROOT/.env.local"; then
    log_success "STRIPE_CHECKOUT_URL configured"
  else
    log_warning "STRIPE_CHECKOUT_URL not found in .env.local"
  fi
else
  log_error ".env.local file not found"
  exit 1
fi

echo "" | tee -a "$LOG_FILE"

# 6. Check HTTP connectivity
echo "6. Checking HTTP connectivity..." | tee -a "$LOG_FILE"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://runpayway.peoplestar.com/ 2>/dev/null || echo "000")
if [ "$HTTP_STATUS" = "200" ]; then
  log_success "HTTPS endpoint returning 200 OK"
elif [ "$HTTP_STATUS" = "000" ]; then
  log_warning "Could not connect to HTTPS endpoint (network issue)"
else
  log_warning "HTTPS endpoint returning $HTTP_STATUS"
fi

echo "" | tee -a "$LOG_FILE"

# 7. Check API health endpoint
echo "7. Checking API health endpoint..." | tee -a "$LOG_FILE"
HEALTH_STATUS=$(curl -s https://runpayway.peoplestar.com/api/health 2>/dev/null | grep -o '"status":"ok"' || echo "")
if [ -n "$HEALTH_STATUS" ]; then
  log_success "Health check endpoint responding correctly"
else
  log_warning "Health check endpoint not responding with expected data"
fi

echo "" | tee -a "$LOG_FILE"
echo "======================================================" | tee -a "$LOG_FILE"
echo "✅ Validation complete at $(date '+%Y-%m-%d %H:%M:%S')" | tee -a "$LOG_FILE"
echo "======================================================" | tee -a "$LOG_FILE"
