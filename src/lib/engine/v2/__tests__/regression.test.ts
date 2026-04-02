// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — RP-2.0 Regression Test Suite
// Validates determinism, edge cases, cross-factor rules, and
// band boundary accuracy for the scoring pipeline.
// Run: npx tsx src/lib/engine/v2/__tests__/regression.test.ts
// ═══════════════════════════════════════════════════════════════

import { executeAssessment } from "../index";
import type { ExecuteAssessmentOptions } from "../index";

// ─── HELPERS ────────────────────────────────────────────────

type Q = "A" | "B" | "C" | "D" | "E";

function makeOpts(
  q1: Q, q2: Q, q3: Q, q4: Q, q5: Q, q6: Q,
  profileOverrides?: Record<string, string>,
): ExecuteAssessmentOptions {
  return {
    rawInputs: {
      q1_recurring_revenue_base: q1,
      q2_income_concentration: q2,
      q3_income_source_diversity: q3,
      q4_forward_revenue_visibility: q4,
      q5_earnings_variability: q5,
      q6_income_continuity_without_labor: q6,
    },
    profile: {
      profile_class: "individual",
      operating_structure: "solo_service",
      primary_income_model: "project_fee",
      revenue_structure: "active_heavy",
      industry_sector: "consulting_professional_services",
      maturity_stage: "established",
      ...profileOverrides,
    },
  };
}

let passed = 0;
let failed = 0;

function assert(name: string, condition: boolean, detail?: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

// ─── TEST 1: DETERMINISM ────────────────────────────────────

console.log("\n▸ Test 1: Determinism");
const run1 = executeAssessment(makeOpts("C", "C", "C", "C", "C", "C"));
const run2 = executeAssessment(makeOpts("C", "C", "C", "C", "C", "C"));

assert("Same score", run1.scores.overall_score === run2.scores.overall_score);
assert("Same band", run1.bands.primary_band === run2.bands.primary_band);
assert("Same fragility score", run1.fragility.fragility_score === run2.fragility.fragility_score);
assert("Same fragility class", run1.fragility.fragility_class === run2.fragility.fragility_class);
assert("Same primary constraint", run1.constraints.root_constraint === run2.constraints.root_constraint);

// ─── TEST 2: ALL MINIMUM ───────────────────────────────────

console.log("\n▸ Test 2: All Minimum (worst case)");
const allMin = executeAssessment(makeOpts("A", "A", "A", "A", "A", "A"));

assert("Score ≤ 10", allMin.scores.overall_score <= 10, `got ${allMin.scores.overall_score}`);
assert("Band = Limited Stability", allMin.bands.primary_band === "Limited Stability");
assert("Fragility class = brittle", allMin.fragility.fragility_class === "brittle");
assert("Score ≥ 0", allMin.scores.overall_score >= 0);

// ─── TEST 3: ALL MAXIMUM ───────────────────────────────────

console.log("\n▸ Test 3: All Maximum (best case)");
const allMax = executeAssessment(makeOpts("E", "E", "E", "E", "E", "E"));

assert("Score = 100", allMax.scores.overall_score === 100, `got ${allMax.scores.overall_score}`);
assert("Band = High Stability", allMax.bands.primary_band === "High Stability");
assert("Fragility class = resilient", allMax.fragility.fragility_class === "resilient");

// ─── TEST 4: CROSS-FACTOR CF-01 ────────────────────────────

console.log("\n▸ Test 4: CF-01 (high concentration + low visibility)");
const cf01 = executeAssessment(makeOpts("C", "A", "B", "A", "C", "C"));
const cf01Codes = cf01.interactions.effects.map((e: { code: string }) => e.code);

assert("CF-01 triggered", cf01Codes.includes("CF-01"), `effects: ${cf01Codes.join(", ")}`);

// ─── TEST 5: CROSS-FACTOR CF-02 ────────────────────────────

console.log("\n▸ Test 5: CF-02 (high labor + low persistence)");
const cf02 = executeAssessment(makeOpts("A", "C", "C", "C", "C", "A"));
const cf02Codes = cf02.interactions.effects.map((e: { code: string }) => e.code);

assert("CF-02 triggered", cf02Codes.includes("CF-02"), `effects: ${cf02Codes.join(", ")}`);

// ─── TEST 6: CROSS-FACTOR BONUS CF-B01 ─────────────────────

console.log("\n▸ Test 6: CF-B01 (strong visibility + low concentration)");
const cfb01 = executeAssessment(makeOpts("C", "E", "D", "D", "D", "C"));
const cfb01Codes = cfb01.interactions.effects.map((e: { code: string }) => e.code);

assert("CF-B01 triggered", cfb01Codes.includes("CF-B01"), `effects: ${cfb01Codes.join(", ")}`);

// ─── TEST 7: BAND BOUNDARY 29/30 ───────────────────────────

console.log("\n▸ Test 7: Band boundary — Limited/Developing (29/30)");
const boundary30 = executeAssessment(makeOpts("A", "A", "A", "D", "A", "C"));
const score30 = boundary30.scores.overall_score;

assert("Score near 30", score30 >= 28 && score30 <= 32, `got ${score30}`);
if (score30 >= 30) {
  assert("Band = Developing Stability", boundary30.bands.primary_band === "Developing Stability");
} else {
  assert("Band = Limited Stability", boundary30.bands.primary_band === "Limited Stability");
}

// ─── TEST 8: BAND BOUNDARY 49/50 ───────────────────────────

console.log("\n▸ Test 8: Band boundary — Developing/Established (49/50)");
const boundary50 = executeAssessment(makeOpts("A", "A", "B", "D", "D", "D"));
const score50 = boundary50.scores.overall_score;

assert("Score near 50", score50 >= 48 && score50 <= 52, `got ${score50}`);
if (score50 >= 50) {
  assert("Band = Established Stability", boundary50.bands.primary_band === "Established Stability");
} else {
  assert("Band = Developing Stability", boundary50.bands.primary_band === "Developing Stability");
}

// ─── TEST 9: BAND BOUNDARY 74/75 ───────────────────────────

console.log("\n▸ Test 9: Band boundary — Established/High (74/75)");
const boundary75 = executeAssessment(makeOpts("A", "D", "D", "E", "D", "E"));
const score75 = boundary75.scores.overall_score;

assert("Score near 75", score75 >= 73 && score75 <= 77, `got ${score75}`);
if (score75 >= 75) {
  assert("Band = High Stability", boundary75.bands.primary_band === "High Stability");
} else {
  assert("Band = Established Stability", boundary75.bands.primary_band === "Established Stability");
}

// ─── TEST 10: INDUSTRY PROFILE ──────────────────────────────

console.log("\n▸ Test 10: Real estate agent profile");
const realEstate = executeAssessment(makeOpts("B", "B", "B", "A", "B", "A", {
  profile_class: "individual",
  operating_structure: "commissioned_operator",
  primary_income_model: "commission",
  revenue_structure: "active_heavy",
  industry_sector: "real_estate",
  maturity_stage: "established",
}));

assert("Band = Limited Stability", realEstate.bands.primary_band === "Limited Stability");
assert("Fragility class is brittle or thin",
  realEstate.fragility.fragility_class === "brittle" || realEstate.fragility.fragility_class === "thin",
  `got ${realEstate.fragility.fragility_class}`);

// ─── TEST 11: SCORE RANGE VALIDITY ──────────────────────────

console.log("\n▸ Test 11: Score always in [0, 100]");
const combos: Q[] = ["A", "B", "C", "D", "E"];
let rangeValid = true;
let testedCount = 0;
for (const q1 of combos) {
  for (const q2 of combos) {
    for (const q6 of combos) {
      const r = executeAssessment(makeOpts(q1, q2, "C", "C", "C", q6));
      if (r.scores.overall_score < 0 || r.scores.overall_score > 100) {
        rangeValid = false;
        break;
      }
      testedCount++;
    }
  }
}
assert(`All ${testedCount} combinations in [0, 100]`, rangeValid);

// ─── TEST 12: MODEL MANIFEST PRESENT ────────────────────────

console.log("\n▸ Test 12: Model manifest and integrity");
assert("Model version = RP-2.0", run1.model_manifest.model_version === "RP-2.0");
assert("Input hash present", typeof run1.integrity.input_hash === "string" && run1.integrity.input_hash.length > 0);
assert("Record hash present", typeof run1.integrity.record_hash === "string" && run1.integrity.record_hash.length > 0);

// ─── TEST 13: INTERACTION CLAMP ─────────────────────────────

console.log("\n▸ Test 13: Interaction adjustment clamped [-12, +8]");
assert("All-min interaction ≥ -12", allMin.interactions.net_adjustment >= -12, `got ${allMin.interactions.net_adjustment}`);
assert("All-max interaction ≤ +8", allMax.interactions.net_adjustment <= 8, `got ${allMax.interactions.net_adjustment}`);

// ─── SUMMARY ────────────────────────────────────────────────

console.log(`\n${"═".repeat(50)}`);
console.log(`  ${passed} passed, ${failed} failed`);
console.log(`${"═".repeat(50)}\n`);

if (failed > 0) process.exit(1);
