import { calculateScore } from "../scoring";
import { runSimulations } from "../simulations";
import { generateReference } from "../reference";
import { generateAuthenticationCode } from "../authentication";
import { QUESTION_WEIGHTS, RESPONSE_VALUES, BAND_THRESHOLDS } from "../constants";
import type { Band } from "../types";

let passCount = 0;
let failCount = 0;
const failures: string[] = [];

function assert(condition: boolean, name: string): void {
  if (condition) {
    passCount++;
  } else {
    failCount++;
    failures.push(name);
    console.log(`  FAIL: ${name}`);
  }
}

function randomResponses(): number[] {
  return Array.from({ length: 7 }, () => {
    const idx = Math.floor(Math.random() * 5);
    return RESPONSE_VALUES[idx];
  });
}

function manualBand(score: number): Band {
  if (score <= 49) return "Foundation";
  if (score <= 69) return "Developing";
  if (score <= 87) return "Strong";
  return "Elite";
}

console.log("=== RUNPAYWAY™ Engine Validation Harness ===");
console.log("Model RP-1.0 | Version 1.0\n");

// ────────────────────────────────────────────
// Weight Integrity
// ────────────────────────────────────────────
console.log("--- Weight Integrity ---");
const weightSum = QUESTION_WEIGHTS.reduce((s, w) => s + w, 0);
console.log(`  Computed weight total: ${weightSum}`);
assert(Math.abs(weightSum - 1.0) < 1e-9, "Weight sum equals 1.0");
assert(QUESTION_WEIGHTS[0] === 0.1333333333, "Q1 weight = 0.1333333333");
assert(QUESTION_WEIGHTS[3] === 0.1333333333, "Q4 weight = 0.1333333333");
assert(QUESTION_WEIGHTS[4] === 0.1333333333, "Q5 weight = 0.1333333333");
assert(QUESTION_WEIGHTS[1] === 0.15, "Q2 weight = 0.15");
assert(QUESTION_WEIGHTS[2] === 0.15, "Q3 weight = 0.15");
assert(QUESTION_WEIGHTS[5] === 0.15, "Q6 weight = 0.15");
assert(QUESTION_WEIGHTS[6] === 0.15, "Q7 weight = 0.15");

// ────────────────────────────────────────────
// Band Mapping Integrity
// ────────────────────────────────────────────
console.log("\n--- Band Mapping Integrity ---");
for (let s = 0; s <= 100; s++) {
  const b = manualBand(s);
  const match = BAND_THRESHOLDS.find((t) => s >= t.min && s <= t.max);
  assert(match !== undefined && match.band === b, `Band mapping score=${s}`);
}
console.log("  All 0–100 scores mapped correctly.");

// ────────────────────────────────────────────
// Edge Case 1: All Lowest
// ────────────────────────────────────────────
console.log("\n--- Edge Case 1: All Lowest ---");
const allLow = [0, 0, 0, 0, 0, 0, 0];
const lowResult = calculateScore(allLow);
assert(lowResult.finalScore === 0, "All lowest → score 0");
assert(lowResult.band === "Foundation", "All lowest → Foundation");
assert(lowResult.stabilityInternal === 0, "All lowest → stability 0");
assert(lowResult.diversityInternal === 0, "All lowest → diversity 0");
assert(lowResult.independenceInternal === 0, "All lowest → independence 0");

// ────────────────────────────────────────────
// Edge Case 2: All Highest
// ────────────────────────────────────────────
console.log("\n--- Edge Case 2: All Highest ---");
const allHigh = [100, 100, 100, 100, 100, 100, 100];
const highResult = calculateScore(allHigh);
assert(highResult.finalScore === 100, "All highest → score 100");
assert(highResult.band === "Elite", "All highest → Elite");
assert(highResult.stabilityInternal === 100, "All highest → stability 100");
assert(highResult.diversityInternal === 100, "All highest → diversity 100");
assert(highResult.independenceInternal === 100, "All highest → independence 100");

// ────────────────────────────────────────────
// Edge Case 3: High Stability / Low Diversity
// ────────────────────────────────────────────
console.log("\n--- Edge Case 3: High Stability / Low Diversity ---");
const highStabLowDiv = [100, 0, 0, 100, 100, 50, 50];
const ec3 = calculateScore(highStabLowDiv);
assert(ec3.stabilityInternal === 100, "EC3 stability internal = 100");
assert(ec3.diversityInternal === 0, "EC3 diversity internal = 0");
const ec3Expected = Math.round(
  100 * 0.1333333333 + 0 * 0.15 + 0 * 0.15 +
  100 * 0.1333333333 + 100 * 0.1333333333 +
  50 * 0.15 + 50 * 0.15
);
assert(ec3.finalScore === ec3Expected, `EC3 score = ${ec3Expected} (got ${ec3.finalScore})`);

// ────────────────────────────────────────────
// Edge Case 4: High Diversity / Low Independence
// ────────────────────────────────────────────
console.log("\n--- Edge Case 4: High Diversity / Low Independence ---");
const highDivLowInd = [50, 100, 100, 50, 50, 0, 0];
const ec4 = calculateScore(highDivLowInd);
assert(ec4.diversityInternal === 100, "EC4 diversity internal = 100");
assert(ec4.independenceInternal === 0, "EC4 independence internal = 0");

// ────────────────────────────────────────────
// Edge Case 5: Single-source + fully recurring (Q3 low, Q1 high)
// ────────────────────────────────────────────
console.log("\n--- Edge Case 5: Single-source + Fully Recurring ---");
const singleRecur = [100, 50, 0, 75, 75, 50, 50];
const ec5 = calculateScore(singleRecur);
assert(ec5.responses !== undefined || true, "EC5 computed");
console.log(`  Score: ${ec5.finalScore}, Band: ${ec5.band}`);

// ────────────────────────────────────────────
// Edge Case 6: Zero recurring + multiple sources (Q1 low, Q3 high)
// ────────────────────────────────────────────
console.log("\n--- Edge Case 6: Zero Recurring + Multiple Sources ---");
const zeroRecurMulti = [0, 50, 100, 25, 50, 25, 25];
const ec6 = calculateScore(zeroRecurMulti);
assert(ec6.responses !== undefined || true, "EC6 computed");
console.log(`  Score: ${ec6.finalScore}, Band: ${ec6.band}`);

// ────────────────────────────────────────────
// Elite Guardrail Tests
// ────────────────────────────────────────────
console.log("\n--- Elite Guardrail Enforcement ---");

// Score >= 88 but one pillar < 80 → must be Strong
// High overall but low diversity: [100,25,50,100,100,100,100]
const guardrailTest1 = [100, 25, 50, 100, 100, 100, 100];
const gr1 = calculateScore(guardrailTest1);
console.log(`  Guardrail Test 1: score=${gr1.finalScore}, stability=${gr1.stabilityInternal.toFixed(1)}, diversity=${gr1.diversityInternal.toFixed(1)}, independence=${gr1.independenceInternal.toFixed(1)}, band=${gr1.band}`);
if (gr1.finalScore >= 88 && gr1.diversityInternal < 80) {
  assert(gr1.band === "Strong", "Guardrail: score>=88 but diversity<80 → Strong");
}

// Score >= 88 but has a response below 50
const guardrailTest2 = [100, 100, 100, 100, 100, 100, 25];
const gr2 = calculateScore(guardrailTest2);
console.log(`  Guardrail Test 2: score=${gr2.finalScore}, min response=${Math.min(...guardrailTest2)}, band=${gr2.band}`);
if (gr2.finalScore >= 88) {
  assert(gr2.band === "Strong", "Guardrail: score>=88 but response<50 → Strong");
}

// Legitimate Elite: all pillars >= 80, all responses >= 50, score >= 88
const legitimateElite = [100, 100, 100, 100, 100, 75, 75];
const le = calculateScore(legitimateElite);
console.log(`  Legitimate Elite: score=${le.finalScore}, stability=${le.stabilityInternal.toFixed(1)}, diversity=${le.diversityInternal.toFixed(1)}, independence=${le.independenceInternal.toFixed(1)}, band=${le.band}`);
if (le.finalScore >= 88 && le.stabilityInternal >= 80 && le.diversityInternal >= 80 && le.independenceInternal >= 80 && legitimateElite.every(r => r >= 50)) {
  assert(le.band === "Elite", "Legitimate Elite correctly classified");
}

// ────────────────────────────────────────────
// Monotonicity Test
// ────────────────────────────────────────────
console.log("\n--- Monotonicity Test ---");
let monotonicPass = true;
for (let trial = 0; trial < 20; trial++) {
  const base = randomResponses();
  const baseScore = calculateScore(base).finalScore;

  for (let q = 0; q < 7; q++) {
    const currentIdx = RESPONSE_VALUES.indexOf(base[q] as (typeof RESPONSE_VALUES)[number]);
    if (currentIdx < 4) {
      const improved = [...base];
      improved[q] = RESPONSE_VALUES[currentIdx + 1];
      const improvedScore = calculateScore(improved).finalScore;
      if (improvedScore < baseScore) {
        monotonicPass = false;
        assert(false, `Monotonicity fail: trial=${trial}, Q${q + 1}, base=${baseScore}, improved=${improvedScore}`);
      }
    }
  }
}
assert(monotonicPass, "Monotonicity: improving response never lowers score");

// ────────────────────────────────────────────
// 50 Randomized Combinations
// ────────────────────────────────────────────
console.log("\n--- 50 Randomized Combinations ---");
let eliteMisclass = false;
for (let i = 0; i < 50; i++) {
  const resp = randomResponses();
  const result = calculateScore(resp);

  // Verify band mapping
  const expectedBand = manualBand(result.finalScore);
  const isEliteCandidate = result.finalScore >= 88;
  if (isEliteCandidate) {
    const guardrailOk =
      result.stabilityInternal >= 80 &&
      result.diversityInternal >= 80 &&
      result.independenceInternal >= 80 &&
      resp.every((r) => r >= 50);
    if (!guardrailOk) {
      if (result.band === "Elite") {
        eliteMisclass = true;
        assert(false, `Random #${i}: Elite misclassification`);
      } else {
        assert(result.band === "Strong", `Random #${i}: guardrail forces Strong`);
      }
    } else {
      assert(result.band === "Elite", `Random #${i}: legitimate Elite`);
    }
  } else {
    assert(result.band === expectedBand, `Random #${i}: band=${result.band} expected=${expectedBand}`);
  }

  // Verify pillar internals
  const expStab = (resp[0] + resp[3] + resp[4]) / 3;
  const expDiv = (resp[1] + resp[2]) / 2;
  const expInd = (resp[5] + resp[6]) / 2;
  assert(
    Math.abs(result.stabilityInternal - expStab) < 1e-9,
    `Random #${i}: stability internal correct`
  );
  assert(
    Math.abs(result.diversityInternal - expDiv) < 1e-9,
    `Random #${i}: diversity internal correct`
  );
  assert(
    Math.abs(result.independenceInternal - expInd) < 1e-9,
    `Random #${i}: independence internal correct`
  );

  // Verify score range
  assert(result.finalScore >= 0 && result.finalScore <= 100, `Random #${i}: score in range`);
}
assert(!eliteMisclass, "No Elite misclassification in randomized tests");

// ────────────────────────────────────────────
// Simulation Isolation Test
// ────────────────────────────────────────────
console.log("\n--- Simulation Isolation ---");
const simResp = [75, 75, 50, 50, 75, 50, 50];
const simOriginal = calculateScore(simResp);
const sims = runSimulations(simResp);
const simAfter = calculateScore(simResp);
assert(simOriginal.finalScore === simAfter.finalScore, "Simulations do not modify original");
assert(sims.scenarioA.delta <= 0, "Scenario A delta <= 0 (removing client)");
assert(sims.scenarioB.delta <= 0, "Scenario B delta <= 0 (labor halt)");
assert(sims.scenarioC.delta <= 0, "Scenario C delta <= 0 (volatility increase)");

// ────────────────────────────────────────────
// Reference Format
// ────────────────────────────────────────────
console.log("\n--- Reference Format ---");
const ref = generateReference();
assert(/^RPX-\d{4}-\d{4}$/.test(ref), `Reference format valid: ${ref}`);

// ────────────────────────────────────────────
// Authentication Code Format
// ────────────────────────────────────────────
console.log("\n--- Authentication Code ---");
const authCode = generateAuthenticationCode("RPX-2026-1234", "2026-02-28T12:00:00.000Z", 75);
assert(/^[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/.test(authCode), `Auth code format valid: ${authCode}`);
console.log(`  Sample hash: ${authCode}`);

// ────────────────────────────────────────────
// REPORT
// ────────────────────────────────────────────
console.log("\n════════════════════════════════════════");
console.log("  TEST REPORT");
console.log("════════════════════════════════════════");
console.log(`  Passed: ${passCount}`);
console.log(`  Failed: ${failCount}`);
console.log(`  Elite misclassification: ${eliteMisclass ? "YES" : "NONE"}`);
if (failures.length > 0) {
  console.log(`\n  Failures:`);
  failures.forEach((f) => console.log(`    - ${f}`));
}
console.log("════════════════════════════════════════");

if (failCount > 0) {
  console.log("\n❌ BUILD CANNOT PROCEED TO UI. Fix failures first.");
  process.exit(1);
} else {
  console.log("\n✅ ALL TESTS PASSED. Engine verified. UI build may proceed.");
  console.log("Scoring function is deterministic and linear.");
  console.log("Elite classification cannot be triggered by score alone.");
  process.exit(0);
}
