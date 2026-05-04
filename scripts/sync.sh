#!/bin/bash
set -e

echo "🔄 Checking if you're on the latest version..."

# Fetch latest from remote
git fetch origin

# Compare local main with origin/main
LOCAL=$(git rev-parse main 2>/dev/null || echo "")
REMOTE=$(git rev-parse origin/main 2>/dev/null || echo "")

if [ -z "$LOCAL" ] || [ -z "$REMOTE" ]; then
  echo "✗ Error: Could not determine git state"
  exit 1
fi

if [ "$LOCAL" = "$REMOTE" ]; then
  echo "✓ You're on the latest version"
else
  COMMITS_BEHIND=$(git rev-list --count origin/main..main 2>/dev/null || echo "0")
  echo "⬇️  You're behind by $COMMITS_BEHIND commits. Pulling latest..."
  git pull origin main
  echo "✓ Latest version pulled"
fi

# Install/update dependencies if package.json changed
echo "📦 Updating dependencies..."
npm install --no-audit --no-fund

echo ""
echo "✅ You're ready to work!"
echo "   Start making changes and commit normally."
echo "   Changes will auto-push to GitHub → DigitalOcean"
