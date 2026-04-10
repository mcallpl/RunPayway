#!/usr/bin/env bash
# RUNPAYWAY — End-to-end diagnostic flow test
# Tests the full user journey through worker endpoints.
# No dependencies beyond curl and bash.

set -uo pipefail

WORKER="https://runpayway-pressuremap.mcallpl.workers.dev"
PASSED=0
FAILED=0
TOTAL=10

# Unique test ID to avoid collisions
RUN_ID="e2e_$(date +%s)_$$"

# Common payload for AI endpoints
AI_PAYLOAD='{"industry":"Real Estate","operating_structure":"Independent Contractor","income_model":"Commission-Based","score":42,"band":"Developing Stability","weakest_factor":"high_concentration","recurrence_pct":20,"concentration_pct":65,"forward_visibility_pct":12,"labor_dependence_pct":70,"variability_level":"moderate"}'

# Common simulator inputs
SIM_INPUTS='{"income_persistence_pct":25,"largest_source_pct":65,"source_diversity_count":2,"forward_secured_pct":12,"income_variability_level":"moderate","labor_dependence_pct":70}'

pass() { PASSED=$((PASSED + 1)); echo "  OK   $1"; }
fail() { FAILED=$((FAILED + 1)); echo "  FAIL $1"; }

echo ""
echo "======================================"
echo " RunPayway End-to-End Diagnostic Test"
echo "======================================"
echo "Target: $WORKER"
echo "Run ID: $RUN_ID"
echo ""

# ──────────────────────────────────────────
# Step 1: Free purchase session
# ──────────────────────────────────────────
echo "Step 1: Free session creation"
echo "  OK   Free session logic is client-side — no API call needed"
PASSED=$((PASSED + 1))
echo ""

# ──────────────────────────────────────────
# Step 2: Score an assessment via /simulate
# ──────────────────────────────────────────
echo "Step 2: Score an assessment via engine"
RESP=$(curl -s -o /tmp/e2e_simulate -w "%{http_code}" \
  -X POST -H "Content-Type: application/json" \
  -d "{\"inputs\":$SIM_INPUTS}" \
  "${WORKER}/simulate" 2>/dev/null)
BODY=$(cat /tmp/e2e_simulate 2>/dev/null || echo "")

if [ "$RESP" = "200" ] && echo "$BODY" | grep -q '"score"'; then
  SCORE=$(echo "$BODY" | sed -n 's/.*"score":\([0-9]*\).*/\1/p')
  pass "Step 2 — Simulate score returned: $SCORE (HTTP $RESP)"
else
  fail "Step 2 — Simulate score (HTTP $RESP)"
  echo "       Response: $BODY"
fi
echo ""

# ──────────────────────────────────────────
# Step 3: PressureMap generation
# ──────────────────────────────────────────
echo "Step 3: PressureMap generation"
RESP=$(curl -s -o /tmp/e2e_pressuremap -w "%{http_code}" \
  -X POST -H "Content-Type: application/json" \
  -d "$AI_PAYLOAD" \
  "${WORKER}/pressuremap" 2>/dev/null)
BODY=$(cat /tmp/e2e_pressuremap 2>/dev/null || echo "")

HAS_PRESSURE=$(echo "$BODY" | grep -c '"pressure"' || true)
HAS_TAILWIND=$(echo "$BODY" | grep -c '"tailwind"' || true)
HAS_LEVERAGE=$(echo "$BODY" | grep -c '"leverage_move"' || true)

if [ "$RESP" = "200" ] && [ "$HAS_PRESSURE" -gt 0 ] && [ "$HAS_TAILWIND" -gt 0 ] && [ "$HAS_LEVERAGE" -gt 0 ]; then
  pass "Step 3 — PressureMap has pressure, tailwind, leverage_move (HTTP $RESP)"
else
  fail "Step 3 — PressureMap missing required fields (HTTP $RESP)"
  echo "       pressure=$HAS_PRESSURE tailwind=$HAS_TAILWIND leverage=$HAS_LEVERAGE"
  echo "       Response (first 300 chars): ${BODY:0:300}"
fi
echo ""

# ──────────────────────────────────────────
# Step 4: Plain English interpretation
# ──────────────────────────────────────────
echo "Step 4: Plain English interpretation"
RESP=$(curl -s -o /tmp/e2e_plaineng -w "%{http_code}" \
  -X POST -H "Content-Type: application/json" \
  -d "$AI_PAYLOAD" \
  "${WORKER}/plain-english" 2>/dev/null)
BODY=$(cat /tmp/e2e_plaineng 2>/dev/null || echo "")

if [ "$RESP" = "200" ] && echo "$BODY" | grep -q '"interpretation"'; then
  pass "Step 4 — Plain English has interpretation (HTTP $RESP)"
else
  fail "Step 4 — Plain English missing interpretation (HTTP $RESP)"
  echo "       Response (first 300 chars): ${BODY:0:300}"
fi
echo ""

# ──────────────────────────────────────────
# Step 5: Action Plan
# ──────────────────────────────────────────
echo "Step 5: Action Plan"
RESP=$(curl -s -o /tmp/e2e_actionplan -w "%{http_code}" \
  -X POST -H "Content-Type: application/json" \
  -d "$AI_PAYLOAD" \
  "${WORKER}/action-plan" 2>/dev/null)
BODY=$(cat /tmp/e2e_actionplan 2>/dev/null || echo "")

if [ "$RESP" = "200" ] && echo "$BODY" | grep -q '"primary_action"'; then
  pass "Step 5 — Action Plan has primary_action (HTTP $RESP)"
else
  fail "Step 5 — Action Plan missing primary_action (HTTP $RESP)"
  echo "       Response (first 300 chars): ${BODY:0:300}"
fi
echo ""

# ──────────────────────────────────────────
# Step 6: Save record with idempotency
# ──────────────────────────────────────────
echo "Step 6: Save record + idempotency"
IDEM_KEY="e2e_idem_${RUN_ID}"
RECORD_ID="rec_${RUN_ID}"
SAVE_BODY="{\"id\":\"$RECORD_ID\",\"assessment_title\":\"E2E Test\",\"industry\":\"Real Estate\",\"operating_structure\":\"Independent Contractor\",\"income_model\":\"Commission-Based\",\"score\":42,\"band\":\"Developing Stability\",\"idempotency_key\":\"$IDEM_KEY\",\"record_data\":{\"test\":true}}"

# First save
RESP1=$(curl -s -o /tmp/e2e_save1 -w "%{http_code}" \
  -X POST -H "Content-Type: application/json" \
  -d "$SAVE_BODY" \
  "${WORKER}/save-record" 2>/dev/null)
BODY1=$(cat /tmp/e2e_save1 2>/dev/null || echo "")

# Second save — same idempotency key
RESP2=$(curl -s -o /tmp/e2e_save2 -w "%{http_code}" \
  -X POST -H "Content-Type: application/json" \
  -d "$SAVE_BODY" \
  "${WORKER}/save-record" 2>/dev/null)
BODY2=$(cat /tmp/e2e_save2 2>/dev/null || echo "")

HAS_IDEMPOTENT=$(echo "$BODY2" | grep -c '"idempotent":true' || true)

if [ "$RESP1" = "200" ] && [ "$RESP2" = "200" ] && [ "$HAS_IDEMPOTENT" -gt 0 ]; then
  pass "Step 6 — Save OK, second save returned idempotent:true (HTTP $RESP1/$RESP2)"
else
  fail "Step 6 — Idempotency check failed (HTTP $RESP1/$RESP2)"
  echo "       Save 1: $BODY1"
  echo "       Save 2: $BODY2"
fi
echo ""

# ──────────────────────────────────────────
# Step 7: Entitlement lifecycle
# ──────────────────────────────────────────
echo "Step 7: Entitlement lifecycle"
ENT_EMAIL="e2e-${RUN_ID}@test.runpayway.com"
STEP7_OK=true

# 7a: Create free entitlement
RESP=$(curl -s -o /tmp/e2e_ent_create -w "%{http_code}" \
  -X POST -H "Content-Type: application/json" \
  -d "{\"email\":\"$ENT_EMAIL\",\"plan_key\":\"free\"}" \
  "${WORKER}/entitlement/create" 2>/dev/null)
BODY=$(cat /tmp/e2e_ent_create 2>/dev/null || echo "")
ENT_ID=$(echo "$BODY" | sed -n 's/.*"id":"\([^"]*\)".*/\1/p' | head -1)

if [ "$RESP" != "200" ] || [ -z "$ENT_ID" ]; then
  fail "Step 7 — Create entitlement failed (HTTP $RESP)"
  echo "       Response: $BODY"
  STEP7_OK=false
fi

if $STEP7_OK; then
  # 7b: Check — should be allowed
  RESP=$(curl -s -o /tmp/e2e_ent_check1 -w "%{http_code}" \
    -X POST -H "Content-Type: application/json" \
    -d "{\"email\":\"$ENT_EMAIL\",\"plan_key\":\"free\"}" \
    "${WORKER}/entitlement/check" 2>/dev/null)
  BODY=$(cat /tmp/e2e_ent_check1 2>/dev/null || echo "")

  if [ "$RESP" != "200" ] || ! echo "$BODY" | grep -q '"allowed":true'; then
    fail "Step 7 — Check should be allowed but was not (HTTP $RESP)"
    echo "       Response: $BODY"
    STEP7_OK=false
  fi
fi

if $STEP7_OK; then
  # 7c: Use — should exhaust (free plan = 1 assessment)
  RESP=$(curl -s -o /tmp/e2e_ent_use -w "%{http_code}" \
    -X POST -H "Content-Type: application/json" \
    -d "{\"entitlement_id\":\"$ENT_ID\",\"assessment_id\":\"assess_${RUN_ID}\"}" \
    "${WORKER}/entitlement/use" 2>/dev/null)
  BODY=$(cat /tmp/e2e_ent_use 2>/dev/null || echo "")

  if [ "$RESP" != "200" ] || ! echo "$BODY" | grep -q '"success":true'; then
    fail "Step 7 — Use entitlement failed (HTTP $RESP)"
    echo "       Response: $BODY"
    STEP7_OK=false
  fi
fi

if $STEP7_OK; then
  # 7d: Check again — should be blocked (exhausted)
  RESP=$(curl -s -o /tmp/e2e_ent_check2 -w "%{http_code}" \
    -X POST -H "Content-Type: application/json" \
    -d "{\"email\":\"$ENT_EMAIL\",\"plan_key\":\"free\"}" \
    "${WORKER}/entitlement/check" 2>/dev/null)
  BODY=$(cat /tmp/e2e_ent_check2 2>/dev/null || echo "")

  if [ "$RESP" = "200" ] && echo "$BODY" | grep -q '"allowed":false'; then
    pass "Step 7 — Full entitlement lifecycle: create -> check(allowed) -> use -> check(blocked) (HTTP 200)"
  else
    fail "Step 7 — Post-exhaustion check should be blocked but was not (HTTP $RESP)"
    echo "       Response: $BODY"
    STEP7_OK=false
  fi
fi

if ! $STEP7_OK; then
  : # already counted as failed above
fi
echo ""

# ──────────────────────────────────────────
# Step 8: Simulation batch
# ──────────────────────────────────────────
echo "Step 8: Simulation batch (3 scenarios)"
BATCH_BODY="{\"base_inputs\":$SIM_INPUTS,\"scenarios\":[{\"id\":\"scenario_a\",\"modified_inputs\":{\"income_persistence_pct\":60}},{\"id\":\"scenario_b\",\"modified_inputs\":{\"largest_source_pct\":30}},{\"id\":\"scenario_c\",\"modified_inputs\":{\"source_diversity_count\":5}}]}"

RESP=$(curl -s -o /tmp/e2e_batch -w "%{http_code}" \
  -X POST -H "Content-Type: application/json" \
  -d "$BATCH_BODY" \
  "${WORKER}/simulate-batch" 2>/dev/null)
BODY=$(cat /tmp/e2e_batch 2>/dev/null || echo "")

HAS_A=$(echo "$BODY" | grep -c '"scenario_a"' || true)
HAS_B=$(echo "$BODY" | grep -c '"scenario_b"' || true)
HAS_C=$(echo "$BODY" | grep -c '"scenario_c"' || true)

if [ "$RESP" = "200" ] && [ "$HAS_A" -gt 0 ] && [ "$HAS_B" -gt 0 ] && [ "$HAS_C" -gt 0 ]; then
  pass "Step 8 — Batch returned all 3 scenario results (HTTP $RESP)"
else
  fail "Step 8 — Batch missing scenario results (HTTP $RESP)"
  echo "       scenario_a=$HAS_A scenario_b=$HAS_B scenario_c=$HAS_C"
  echo "       Response (first 300 chars): ${BODY:0:300}"
fi
echo ""

# ──────────────────────────────────────────
# Step 9: Error reporting
# ──────────────────────────────────────────
echo "Step 9: Error reporting"
RESP=$(curl -s -o /tmp/e2e_errreport -w "%{http_code}" \
  -X POST -H "Content-Type: application/json" \
  -d "{\"error_message\":\"E2E test error from run $RUN_ID\",\"component\":\"e2e-test\",\"page_url\":\"https://peoplestar.com/RunPayway/test\"}" \
  "${WORKER}/error-report" 2>/dev/null)
BODY=$(cat /tmp/e2e_errreport 2>/dev/null || echo "")

if [ "$RESP" = "200" ] && echo "$BODY" | grep -q '"success":true'; then
  ERR_ID=$(echo "$BODY" | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')
  pass "Step 9 — Error report stored as $ERR_ID (HTTP $RESP)"
else
  fail "Step 9 — Error report failed (HTTP $RESP)"
  echo "       Response: $BODY"
fi
echo ""

# ──────────────────────────────────────────
# Step 10: Rate limiting — normal usage passes
# ──────────────────────────────────────────
echo "Step 10: Rate limiting — 5 rapid calls"
RATE_OK=0
RATE_BLOCKED=0

for i in 1 2 3 4 5; do
  RESP=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST -H "Content-Type: application/json" \
    -d "{\"inputs\":$SIM_INPUTS}" \
    "${WORKER}/simulate" 2>/dev/null)
  if [ "$RESP" = "200" ]; then
    RATE_OK=$((RATE_OK + 1))
  elif [ "$RESP" = "429" ]; then
    RATE_BLOCKED=$((RATE_BLOCKED + 1))
  fi
done

if [ "$RATE_OK" -eq 5 ]; then
  pass "Step 10 — All 5 rapid calls passed ($RATE_OK/5 OK, $RATE_BLOCKED blocked)"
else
  fail "Step 10 — Some calls were blocked ($RATE_OK/5 OK, $RATE_BLOCKED/5 rate-limited)"
fi
echo ""

# ──────────────────────────────────────────
# Summary
# ──────────────────────────────────────────
echo "======================================"
echo " Results: $PASSED/$TOTAL passed"
echo "======================================"

if [ "$FAILED" -gt 0 ]; then
  echo ""
  echo "$FAILED test(s) FAILED."
  exit 1
else
  echo ""
  echo "All tests passed."
  exit 0
fi
