#!/usr/bin/env bash
# RUNPAYWAY — Post-deploy smoke test
# Verifies every worker endpoint the frontend depends on is reachable.
# A 404 with "Unknown endpoint" means the route is missing from the worker.
# Other errors (400, 401, 500) are expected for empty/invalid payloads
# but prove the endpoint EXISTS and is routed correctly.

set -euo pipefail

WORKER="https://runpayway-pressuremap.mcallpl.workers.dev"
FAILURES=0

check_post() {
  local path="$1"
  local body="$2"
  local label="${3:-POST $path}"

  STATUS=$(curl -s -o /tmp/smoke_body -w "%{http_code}" \
    -X POST \
    -H "Content-Type: application/json" \
    -d "$body" \
    "${WORKER}${path}" 2>/dev/null)

  BODY=$(cat /tmp/smoke_body 2>/dev/null || echo "")

  # 404 with "Unknown endpoint" = route missing from worker
  if [ "$STATUS" = "404" ] && echo "$BODY" | grep -q "Unknown endpoint"; then
    echo "FAIL  $label -> $STATUS (Unknown endpoint)"
    FAILURES=$((FAILURES + 1))
    return
  fi

  # Any 2xx/4xx (except missing route) = endpoint exists
  echo "  OK  $label -> $STATUS"
}

check_get() {
  local path="$1"
  local label="${2:-GET $path}"

  STATUS=$(curl -s -o /tmp/smoke_body -w "%{http_code}" \
    "${WORKER}${path}" 2>/dev/null)

  BODY=$(cat /tmp/smoke_body 2>/dev/null || echo "")

  if [ "$STATUS" = "404" ]; then
    echo "FAIL  $label -> $STATUS"
    FAILURES=$((FAILURES + 1))
    return
  fi

  echo "  OK  $label -> $STATUS"
}

echo ""
echo "=== RunPayway Worker Smoke Test ==="
echo "Target: $WORKER"
echo ""

# --- POST endpoints used by frontend ---
check_post "/pressuremap"   '{"industry":"test","score":50,"band":"Developing","weakest_factor":"recurrence"}' \
                            "POST /pressuremap (PressureMap)"

check_post "/plain-english" '{"industry":"test","score":50,"band":"Developing","weakest_factor":"recurrence"}' \
                            "POST /plain-english (Plain English)"

check_post "/action-plan"   '{"industry":"test","score":50,"band":"Developing","weakest_factor":"recurrence"}' \
                            "POST /action-plan (Action Plan)"

check_post "/save-record"   '{"id":"smoke-test","score":0}' \
                            "POST /save-record (Save Record)"

check_post "/get-record"    '{"id":"smoke-test"}' \
                            "POST /get-record (Get Record)"

check_post "/send-email"    '{}' \
                            "POST /send-email (Send Email)"

check_post "/contact"       '{"email":"test@test.com","message":"smoke"}' \
                            "POST /contact (Contact Form)"

check_post "/simulate"      '{"inputs":{"income_persistence_pct":50,"largest_source_pct":50,"source_diversity_count":3,"forward_secured_pct":30,"income_variability_level":"moderate","labor_dependence_pct":60}}' \
                            "POST /simulate (Simulator)"

check_post "/simulate-batch" '{"base_inputs":{"income_persistence_pct":50,"largest_source_pct":50,"source_diversity_count":3,"forward_secured_pct":30,"income_variability_level":"moderate","labor_dependence_pct":60},"scenarios":[{"id":"test","modified_inputs":{}}]}' \
                             "POST /simulate-batch (Batch Simulator)"

check_post "/timeline"      '{"current_inputs":{"income_persistence_pct":50,"largest_source_pct":50,"source_diversity_count":3,"forward_secured_pct":30,"income_variability_level":"moderate","labor_dependence_pct":60},"target_inputs":{"income_persistence_pct":70,"largest_source_pct":40,"source_diversity_count":4,"forward_secured_pct":50,"income_variability_level":"low","labor_dependence_pct":40}}' \
                            "POST /timeline (Timeline)"

check_post "/analytics"     '{"event":"smoke_test","timestamp":"2026-01-01T00:00:00Z"}' \
                            "POST /analytics (Analytics)"

# --- GET endpoints ---
check_get "/presets"        "GET /presets (Simulator Presets)"

echo ""
if [ "$FAILURES" -gt 0 ]; then
  echo "FAILED: $FAILURES endpoint(s) missing from worker!"
  echo "The frontend calls these endpoints but the worker does not handle them."
  echo "Add the missing route(s) to worker/index.js before shipping."
  exit 1
else
  echo "All endpoints verified."
fi
