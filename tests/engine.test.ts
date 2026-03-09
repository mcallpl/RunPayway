// RUNPAYWAY™ Income Stability Score™ — Engine Test Harness
// Model RP-1.0 | Version 1.0

import { computeScore } from "../src/lib/engine/scoring";
import { selectInterpretation } from "../src/lib/engine/interpretation";
import { validateDiagnosticInput } from "../src/lib/engine/validation";
import { computeInputChecksum } from "../src/lib/engine/serialization";
import { generateAuthorizationCode } from "../src/lib/engine/authentication";
import { getRulesetChecksum, getManifest } from "../src/lib/engine/manifest";
import { verifyEngineIntegrity, isEngineVerified } from "../src/lib/engine/integrity";
import type { DiagnosticInput, AllowedValue, StabilityBand } from "../src/lib/engine/types";
import { CANONICAL_KEYS, ALLOWED_VALUES } from "../src/lib/engine/types";
import {
  STRUCTURE_WEIGHT_PERCENT,
  STABILITY_WEIGHT_PERCENT,
  BAND_THRESHOLDS,
  CONSTRAINT_TIE_BREAK_ORDER,
  DRIVER_TIE_BREAK_ORDER,
  STRUCTURAL_PRIORITY_MAP,
} from "../src/lib/engine/constants";

let passed = 0;
let failed = 0;
let total = 0;

function assert(condition: boolean, message: string) {
  total++;
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`  FAIL: ${message}`);
  }
}

function assertEqual(actual: unknown, expected: unknown, message: string) {
  total++;
  if (actual === expected) {
    passed++;
  } else {
    failed++;
    console.error(`  FAIL: ${message} — expected ${expected}, got ${actual}`);
  }
}

function makeInput(values: number[]): DiagnosticInput {
  return {
    recurring_income_proportion: values[0] as AllowedValue,
    income_concentration: values[1] as AllowedValue,
    number_of_income_sources: values[2] as AllowedValue,
    forward_revenue_visibility: values[3] as AllowedValue,
    earnings_variability: values[4] as AllowedValue,
    income_continuity_without_active_labor: values[5] as AllowedValue,
  };
}

// ============================================================
// 1. MANIFEST AND INTEGRITY
// ============================================================
console.log("1. Manifest and Integrity");

const manifest = getManifest();
assert(manifest !== null, "Manifest loads");
assertEqual(manifest.manifest_id, "RP1-2026-001", "Manifest ID");
assertEqual(manifest.model_code, "RP-1.0", "Model code");
assertEqual(manifest.question_count, 6, "Question count");
assertEqual(manifest.answer_option_count, 5, "Answer option count");

const checksum = getRulesetChecksum();
assert(/^[a-f0-9]{64}$/.test(checksum), "Checksum is 64-char hex");

verifyEngineIntegrity();
assert(isEngineVerified(), "Engine verified after integrity check");

// ============================================================
// 2. VALIDATION
// ============================================================
console.log("2. Validation");

// Valid inputs
const validInput = makeInput([0, 25, 50, 75, 100, 0]);
const validated = validateDiagnosticInput(validInput);
assert(validated !== null, "Valid input passes validation");

// All zero
const allZero = makeInput([0, 0, 0, 0, 0, 0]);
assert(validateDiagnosticInput(allZero) !== null, "All zeros valid");

// All 100
const allHundred = makeInput([100, 100, 100, 100, 100, 100]);
assert(validateDiagnosticInput(allHundred) !== null, "All 100s valid");

// All allowed value combos
for (const v of ALLOWED_VALUES) {
  const input = makeInput([v, v, v, v, v, v]);
  assert(validateDiagnosticInput(input) !== null, `Uniform value ${v} valid`);
}

// Invalid: non-integer
try {
  validateDiagnosticInput(makeInput([0.5, 25, 50, 75, 100, 0]));
  assert(false, "Non-integer should fail");
} catch {
  assert(true, "Non-integer rejected");
}

// Invalid: out of range
try {
  validateDiagnosticInput(makeInput([10, 25, 50, 75, 100, 0]));
  assert(false, "Value 10 should fail");
} catch {
  assert(true, "Non-allowed value 10 rejected");
}

// Invalid: missing key
try {
  validateDiagnosticInput({ recurring_income_proportion: 0 });
  assert(false, "Partial input should fail");
} catch {
  assert(true, "Partial input rejected");
}

// Invalid: null
try {
  validateDiagnosticInput(null);
  assert(false, "Null should fail");
} catch {
  assert(true, "Null rejected");
}

// Invalid: extra keys
try {
  validateDiagnosticInput({
    ...makeInput([0, 25, 50, 75, 100, 0]),
    extra_field: 50,
  });
  assert(false, "Extra keys should fail");
} catch {
  assert(true, "Extra keys rejected");
}

// ============================================================
// 3. SCORING — PILLAR COMPUTATION
// ============================================================
console.log("3. Scoring — Pillar Computation");

// Test: all zeros
{
  const result = computeScore(makeInput([0, 0, 0, 0, 0, 0]));
  assertEqual(result.structure_score, 0, "All zeros → structure = 0");
  assertEqual(result.stability_score, 0, "All zeros → stability = 0");
  assertEqual(result.final_score, 0, "All zeros → final = 0");
  assertEqual(result.stability_band, "Limited Stability", "All zeros → Limited");
}

// Test: all 100
{
  const result = computeScore(makeInput([100, 100, 100, 100, 100, 100]));
  assertEqual(result.structure_score, 100, "All 100 → structure = 100");
  assertEqual(result.stability_score, 100, "All 100 → stability = 100");
  assertEqual(result.final_score, 100, "All 100 → final = 100");
  assertEqual(result.stability_band, "High Stability", "All 100 → High");
}

// Test: structure only
{
  const result = computeScore(makeInput([75, 0, 75, 75, 0, 0]));
  // structure = floor((75+75+75)/3) = floor(225/3) = 75
  // stability = floor((0+0+0)/3) = 0
  // final = floor((75*60 + 0*40)/100) = floor(4500/100) = 45
  assertEqual(result.structure_score, 75, "Structure-only → 75");
  assertEqual(result.stability_score, 0, "Structure-only → stability 0");
  assertEqual(result.final_score, 45, "Structure-only → final 45");
  assertEqual(result.stability_band, "Developing Stability", "Structure-only → Developing");
}

// Test: stability only
{
  const result = computeScore(makeInput([0, 75, 0, 0, 75, 75]));
  // structure = floor((0+0+0)/3) = 0
  // stability = floor((75+75+75)/3) = 75
  // final = floor((0*60 + 75*40)/100) = floor(3000/100) = 30
  assertEqual(result.structure_score, 0, "Stability-only → structure 0");
  assertEqual(result.stability_score, 75, "Stability-only → 75");
  assertEqual(result.final_score, 30, "Stability-only → final 30");
  assertEqual(result.stability_band, "Limited Stability", "Stability-only → Limited");
}

// ============================================================
// 4. SCORING — INTEGER MATH
// ============================================================
console.log("4. Scoring — Integer Math (floor)");

// floor((25+50+75)/3) = floor(150/3) = 50
// floor((0+25+100)/3) = floor(125/3) = floor(41.66) = 41
// final = floor((50*60 + 41*40)/100) = floor(3000+1640)/100 = floor(4640/100) = floor(46.4) = 46
{
  const result = computeScore(makeInput([25, 0, 50, 75, 25, 100]));
  assertEqual(result.structure_score, 50, "Floor test → structure 50");
  assertEqual(result.stability_score, 41, "Floor test → stability 41");
  assertEqual(result.final_score, 46, "Floor test → final 46");
}

// Verify integer types
{
  const result = computeScore(makeInput([25, 25, 25, 25, 25, 25]));
  assert(Number.isInteger(result.structure_score), "structure_score is integer");
  assert(Number.isInteger(result.stability_score), "stability_score is integer");
  assert(Number.isInteger(result.final_score), "final_score is integer");
}

// ============================================================
// 5. BAND ASSIGNMENT
// ============================================================
console.log("5. Band Assignment");

function getBand(score: number): string {
  for (const t of BAND_THRESHOLDS) {
    if (score >= t.min && score <= t.max) return t.band;
  }
  return "unknown";
}

// Boundary tests
assertEqual(getBand(0), "Limited Stability", "Score 0 → Limited");
assertEqual(getBand(39), "Limited Stability", "Score 39 → Limited");
assertEqual(getBand(40), "Developing Stability", "Score 40 → Developing");
assertEqual(getBand(59), "Developing Stability", "Score 59 → Developing");
assertEqual(getBand(60), "Established Stability", "Score 60 → Established");
assertEqual(getBand(79), "Established Stability", "Score 79 → Established");
assertEqual(getBand(80), "High Stability", "Score 80 → High");
assertEqual(getBand(100), "High Stability", "Score 100 → High");

// ============================================================
// 6. INTERPRETATION
// ============================================================
console.log("6. Interpretation");

// Primary constraint: lowest value wins
{
  const input = makeInput([75, 50, 100, 25, 75, 0]);
  const result = computeScore(input);
  const interp = selectInterpretation(input, result.final_score, result.stability_band);
  assertEqual(
    interp.primary_constraint_key,
    "income_continuity_without_active_labor",
    "Lowest value (0) is constraint"
  );
}

// Constraint tie-break: first in order wins
{
  const input = makeInput([0, 0, 0, 0, 0, 0]);
  const result = computeScore(input);
  const interp = selectInterpretation(input, result.final_score, result.stability_band);
  assertEqual(
    interp.primary_constraint_key,
    "income_continuity_without_active_labor",
    "All-zero tie-break → income_continuity first"
  );
}

// Drivers: top 3 highest excluding constraint
{
  const input = makeInput([100, 75, 50, 25, 0, 0]);
  const result = computeScore(input);
  const interp = selectInterpretation(input, result.final_score, result.stability_band);
  // Constraint: income_continuity (0) — wins over earnings_variability by tie-break
  // Drivers from remaining: recurring(100), income_conc(75), number_sources(50), forward(25), earnings(0)
  assertEqual(interp.driver_1_key, "recurring_income_proportion", "Driver 1 = highest");
  assertEqual(interp.driver_2_key, "income_concentration", "Driver 2 = second highest");
  assertEqual(interp.driver_3_key, "number_of_income_sources", "Driver 3 = third highest");
}

// Structural priority derived from constraint
{
  const input = makeInput([75, 50, 100, 0, 75, 50]);
  const result = computeScore(input);
  const interp = selectInterpretation(input, result.final_score, result.stability_band);
  assertEqual(
    interp.primary_constraint_key,
    "forward_revenue_visibility",
    "Constraint = forward_revenue_visibility (value 0)"
  );
  assertEqual(
    interp.structural_priority_label,
    "Extend Forward Revenue Commitments",
    "Priority maps from constraint"
  );
}

// Band interpretation text for each band
{
  for (const band of ["Limited Stability", "Developing Stability", "Established Stability", "High Stability"] as StabilityBand[]) {
    const input = makeInput(
      band === "Limited Stability" ? [0, 0, 0, 0, 0, 0] :
      band === "Developing Stability" ? [50, 50, 50, 50, 50, 50] :
      band === "Established Stability" ? [75, 75, 75, 75, 75, 75] :
      [100, 100, 100, 100, 100, 100]
    );
    const result = computeScore(input);
    const interp = selectInterpretation(input, result.final_score, result.stability_band);
    assert(
      interp.band_interpretation_text.includes("Stability Classification:"),
      `Band ${band} has correct interpretation text prefix`
    );
  }
}

// ============================================================
// 7. SERIALIZATION AND AUTHENTICATION
// ============================================================
console.log("7. Serialization and Authentication");

{
  const input = makeInput([25, 50, 75, 100, 0, 25]);
  const checksum1 = computeInputChecksum(input);
  const checksum2 = computeInputChecksum(input);
  assertEqual(checksum1, checksum2, "Same inputs → same checksum");
  assert(/^[a-f0-9]{64}$/.test(checksum1), "Checksum is 64-char hex");
}

{
  const input1 = makeInput([25, 50, 75, 100, 0, 25]);
  const input2 = makeInput([25, 50, 75, 100, 0, 50]);
  const c1 = computeInputChecksum(input1);
  const c2 = computeInputChecksum(input2);
  assert(c1 !== c2, "Different inputs → different checksums");
}

// Auth code format
{
  const input = makeInput([50, 50, 50, 50, 50, 50]);
  const auth = generateAuthorizationCode("test-id", input, "2026-01-01T00:00:00Z");
  assert(/^[a-f0-9]{64}$/.test(auth), "Auth code is 64-char hex");
}

// Auth code determinism
{
  const input = makeInput([50, 50, 50, 50, 50, 50]);
  const a1 = generateAuthorizationCode("id-1", input, "2026-01-01T00:00:00Z");
  const a2 = generateAuthorizationCode("id-1", input, "2026-01-01T00:00:00Z");
  assertEqual(a1, a2, "Same params → same auth code");
}

// Different record IDs produce different auth codes
{
  const input = makeInput([50, 50, 50, 50, 50, 50]);
  const a1 = generateAuthorizationCode("id-1", input, "2026-01-01T00:00:00Z");
  const a2 = generateAuthorizationCode("id-2", input, "2026-01-01T00:00:00Z");
  assert(a1 !== a2, "Different record IDs → different auth codes");
}

// ============================================================
// 8. EXHAUSTIVE SCORING: ALL VALUE COMBOS
// ============================================================
console.log("8. Exhaustive Scoring (all value combinations)");

const values: AllowedValue[] = [0, 25, 50, 75, 100];
let comboCount = 0;

for (const v1 of values) {
  for (const v2 of values) {
    for (const v3 of values) {
      for (const v4 of values) {
        for (const v5 of values) {
          for (const v6 of values) {
            const input = makeInput([v1, v2, v3, v4, v5, v6]);
            const result = computeScore(input);

            // Integer checks
            assert(Number.isInteger(result.structure_score), `Combo int check structure [${v1},${v2},${v3},${v4},${v5},${v6}]`);
            assert(Number.isInteger(result.stability_score), `Combo int check stability [${v1},${v2},${v3},${v4},${v5},${v6}]`);
            assert(Number.isInteger(result.final_score), `Combo int check final [${v1},${v2},${v3},${v4},${v5},${v6}]`);

            // Range checks
            assert(result.final_score >= 0 && result.final_score <= 100, `Combo range check [${v1},${v2},${v3},${v4},${v5},${v6}]`);

            // Band assignment
            assert(
              ["Limited Stability", "Developing Stability", "Established Stability", "High Stability"].includes(result.stability_band),
              `Combo band check [${v1},${v2},${v3},${v4},${v5},${v6}]`
            );

            // Formula verification
            const expectedStructure = Math.floor((v1 + v3 + v4) / 3);
            const expectedStability = Math.floor((v2 + v5 + v6) / 3);
            const expectedFinal = Math.floor((expectedStructure * 60 + expectedStability * 40) / 100);
            assertEqual(result.structure_score, expectedStructure, `Combo structure formula [${v1},${v2},${v3},${v4},${v5},${v6}]`);
            assertEqual(result.stability_score, expectedStability, `Combo stability formula [${v1},${v2},${v3},${v4},${v5},${v6}]`);
            assertEqual(result.final_score, expectedFinal, `Combo final formula [${v1},${v2},${v3},${v4},${v5},${v6}]`);

            // Interpretation
            const interp = selectInterpretation(input, result.final_score, result.stability_band);
            assert(interp.primary_constraint_key !== undefined, `Combo interp constraint [${v1},${v2},${v3},${v4},${v5},${v6}]`);
            assert(interp.driver_1_key !== interp.primary_constraint_key, `Combo driver1 ≠ constraint [${v1},${v2},${v3},${v4},${v5},${v6}]`);
            assert(interp.driver_2_key !== interp.primary_constraint_key, `Combo driver2 ≠ constraint [${v1},${v2},${v3},${v4},${v5},${v6}]`);
            assert(interp.driver_3_key !== interp.primary_constraint_key, `Combo driver3 ≠ constraint [${v1},${v2},${v3},${v4},${v5},${v6}]`);

            // All 3 drivers are distinct
            assert(
              interp.driver_1_key !== interp.driver_2_key &&
              interp.driver_1_key !== interp.driver_3_key &&
              interp.driver_2_key !== interp.driver_3_key,
              `Combo drivers distinct [${v1},${v2},${v3},${v4},${v5},${v6}]`
            );

            comboCount++;
          }
        }
      }
    }
  }
}

console.log(`  Exhaustive combos tested: ${comboCount}`);

// ============================================================
// 9. IDEMPOTENCY CHECK
// ============================================================
console.log("9. Idempotency");

{
  const input = makeInput([25, 75, 50, 100, 0, 50]);
  const r1 = computeScore(input);
  const r2 = computeScore(input);
  assertEqual(r1.final_score, r2.final_score, "Same input → same score");
  assertEqual(r1.stability_band, r2.stability_band, "Same input → same band");
  assertEqual(r1.structure_score, r2.structure_score, "Same input → same structure");
  assertEqual(r1.stability_score, r2.stability_score, "Same input → same stability");
}

// ============================================================
// 10. CONSTANTS VERIFICATION
// ============================================================
console.log("10. Constants Verification");

assertEqual(STRUCTURE_WEIGHT_PERCENT, 60, "Structure weight = 60");
assertEqual(STABILITY_WEIGHT_PERCENT, 40, "Stability weight = 40");
assertEqual(STRUCTURE_WEIGHT_PERCENT + STABILITY_WEIGHT_PERCENT, 100, "Weights sum to 100");
assertEqual(CANONICAL_KEYS.length, 6, "6 canonical keys");
assertEqual(CONSTRAINT_TIE_BREAK_ORDER.length, 6, "6 constraint tie-break entries");
assertEqual(DRIVER_TIE_BREAK_ORDER.length, 6, "6 driver tie-break entries");
assertEqual(Object.keys(STRUCTURAL_PRIORITY_MAP).length, 6, "6 priority mappings");

// Band thresholds cover 0–100 without gaps
assertEqual(BAND_THRESHOLDS[0].min, 0, "Bands start at 0");
assertEqual(BAND_THRESHOLDS[BAND_THRESHOLDS.length - 1].max, 100, "Bands end at 100");
for (let i = 1; i < BAND_THRESHOLDS.length; i++) {
  assertEqual(
    BAND_THRESHOLDS[i].min,
    BAND_THRESHOLDS[i - 1].max + 1,
    `Band ${i} starts right after band ${i - 1}`
  );
}

// ============================================================
// SUMMARY
// ============================================================
console.log("");
console.log("============================================================");
console.log(`TOTAL: ${total}  PASSED: ${passed}  FAILED: ${failed}`);
console.log("============================================================");

if (failed > 0) {
  process.exit(1);
}
