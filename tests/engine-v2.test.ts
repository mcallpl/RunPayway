// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Model RP-2.0 Engine Test Suite
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { executeAssessment } from "../src/lib/engine/v2/index";
import { normalizeInputs } from "../src/lib/engine/v2/engines/03-income-normalization";
import { computeRawScores, computeContinuityMonths } from "../src/lib/engine/v2/engines/04-scoring";
import { computeInteractions } from "../src/lib/engine/v2/engines/07-cross-factor-dependency";
import { computeQuality } from "../src/lib/engine/v2/engines/08-income-quality";
import { computeFragility } from "../src/lib/engine/v2/engines/10-fragility";
import { computeManifestHash } from "../src/lib/engine/v2/engines/20-integrity-manifest";
import type { RawDiagnosticInput, ProfileContext, CanonicalInput, AnswerChoice } from "../src/lib/engine/v2/types";

// ─── TEST FIXTURES ──────────────────────────────────────

const ALL_A_INPUTS: RawDiagnosticInput = {
  q1_recurring_revenue_base: "A",
  q2_income_concentration: "A",
  q3_income_source_diversity: "A",
  q4_forward_revenue_visibility: "A",
  q5_earnings_variability: "A",
  q6_income_continuity_without_labor: "A",
};

const ALL_E_INPUTS: RawDiagnosticInput = {
  q1_recurring_revenue_base: "E",
  q2_income_concentration: "E",
  q3_income_source_diversity: "E",
  q4_forward_revenue_visibility: "E",
  q5_earnings_variability: "E",
  q6_income_continuity_without_labor: "E",
};

const MID_INPUTS: RawDiagnosticInput = {
  q1_recurring_revenue_base: "C",
  q2_income_concentration: "C",
  q3_income_source_diversity: "C",
  q4_forward_revenue_visibility: "C",
  q5_earnings_variability: "C",
  q6_income_continuity_without_labor: "C",
};

const DEFAULT_PROFILE: ProfileContext = {
  profile_class: "individual",
  operating_structure: "solo_service",
  primary_income_model: "commission",
  revenue_structure: "active_heavy",
  industry_sector: "real_estate",
  maturity_stage: "developing",
};

// ─── NORMALIZATION TESTS ────────────────────────────────

describe("Engine 03 — Income Normalization", () => {
  it("maps all-A inputs to worst-case canonical values", () => {
    const n = normalizeInputs(ALL_A_INPUTS);
    expect(n.income_persistence_pct).toBe(5);
    expect(n.largest_source_pct).toBe(95);
    expect(n.source_diversity_count).toBe(1);
    expect(n.forward_secured_pct).toBe(4);
    expect(n.income_variability_level).toBe("extreme");
    expect(n.labor_dependence_pct).toBe(100);
  });

  it("maps all-E inputs to best-case canonical values", () => {
    const n = normalizeInputs(ALL_E_INPUTS);
    expect(n.income_persistence_pct).toBe(93);
    expect(n.largest_source_pct).toBe(15);
    expect(n.source_diversity_count).toBe(8);
    expect(n.forward_secured_pct).toBe(100);
    expect(n.income_variability_level).toBe("low");
    expect(n.labor_dependence_pct).toBe(12);
  });

  it("maps mid inputs correctly", () => {
    const n = normalizeInputs(MID_INPUTS);
    expect(n.income_persistence_pct).toBe(45);
    expect(n.largest_source_pct).toBe(60);
    expect(n.source_diversity_count).toBe(3);
    expect(n.forward_secured_pct).toBe(33);
    expect(n.income_variability_level).toBe("moderate");
    expect(n.labor_dependence_pct).toBe(62);
  });
});

// ─── SCORING TESTS ──────────────────────────────────────

describe("Engine 04 — Deterministic Scoring", () => {
  it("scores all-A (worst case) inputs", () => {
    const n = normalizeInputs(ALL_A_INPUTS);
    const scores = computeRawScores(n);

    expect(scores.income_persistence_score).toBe(1);   // 5 → 0-10 range → 1
    expect(scores.source_diversity_score).toBe(1);      // 1 source → 1
    expect(scores.forward_security_score).toBe(0);      // 4 → 0-5 range → 0
    expect(scores.concentration_resilience_score).toBe(0); // 95 → 81-100 → 0
    expect(scores.labor_dependence_score).toBe(2);      // 100 → 81-100 → 2
    expect(scores.variability_score).toBe(0);            // extreme → 0

    expect(scores.structure_subtotal).toBe(2);           // 1+1+0+0
    expect(scores.stability_subtotal).toBeGreaterThanOrEqual(2); // 2+0+continuity
  });

  it("scores all-E (best case) inputs", () => {
    const n = normalizeInputs(ALL_E_INPUTS);
    const scores = computeRawScores(n);

    expect(scores.income_persistence_score).toBe(15);   // 93 → 81-100 → 15
    expect(scores.source_diversity_score).toBe(10);     // 8 → 6+ → 10
    expect(scores.forward_security_score).toBe(15);     // 100 → 76-100 → 15
    expect(scores.concentration_resilience_score).toBe(10); // 15 → 0-20 → 10
    expect(scores.labor_dependence_score).toBe(20);     // 12 → 0-20 → 20
    expect(scores.variability_score).toBe(10);           // low → 10

    expect(scores.structure_subtotal).toBe(50);          // 15+10+15+10
    expect(scores.stability_subtotal).toBe(40);          // 20+10+10
  });

  it("computes continuity months correctly", () => {
    const n = normalizeInputs(MID_INPUTS);
    const months = computeContinuityMonths(n);
    // (45*0.03) + (33*0.04) + ((100-62)*0.02) - (60*0.015)
    // = 1.35 + 1.32 + 0.76 - 0.90 = 2.53
    expect(months).toBeCloseTo(2.53, 1);
  });

  it("clamps continuity months to [0, 12]", () => {
    // Worst case: should clamp to 0
    const worst: CanonicalInput = {
      income_persistence_pct: 0,
      largest_source_pct: 100,
      source_diversity_count: 1,
      forward_secured_pct: 0,
      income_variability_level: "extreme",
      labor_dependence_pct: 100,
    };
    expect(computeContinuityMonths(worst)).toBe(0);

    // Best case
    const best: CanonicalInput = {
      income_persistence_pct: 100,
      largest_source_pct: 0,
      source_diversity_count: 8,
      forward_secured_pct: 100,
      income_variability_level: "low",
      labor_dependence_pct: 0,
    };
    const months = computeContinuityMonths(best);
    // (100*0.03) + (100*0.04) + (100*0.02) - (0*0.015) = 3+4+2 = 9
    expect(months).toBe(9);
  });
});

// ─── INTERACTION TESTS ──────────────────────────────────

describe("Engine 07 — Cross-Factor Dependency", () => {
  it("triggers CF-01 when concentrated + low visibility", () => {
    const n: CanonicalInput = {
      income_persistence_pct: 50,
      largest_source_pct: 80,
      source_diversity_count: 2,
      forward_secured_pct: 10,
      income_variability_level: "moderate",
      labor_dependence_pct: 50,
    };
    const result = computeInteractions(n, null);
    const cf01 = result.effects.find((e) => e.code === "CF-01");
    expect(cf01).toBeDefined();
    expect(cf01!.points).toBe(-8);
  });

  it("triggers CF-02 when labor-heavy + low persistence", () => {
    const n: CanonicalInput = {
      income_persistence_pct: 20,
      largest_source_pct: 50,
      source_diversity_count: 3,
      forward_secured_pct: 30,
      income_variability_level: "moderate",
      labor_dependence_pct: 80,
    };
    const result = computeInteractions(n, null);
    const cf02 = result.effects.find((e) => e.code === "CF-02");
    expect(cf02).toBeDefined();
    expect(cf02!.points).toBe(-7);
  });

  it("triggers CF-B02 bonus when persistent + low labor", () => {
    const n: CanonicalInput = {
      income_persistence_pct: 70,
      largest_source_pct: 30,
      source_diversity_count: 4,
      forward_secured_pct: 50,
      income_variability_level: "low",
      labor_dependence_pct: 20,
    };
    const result = computeInteractions(n, null);
    const b02 = result.effects.find((e) => e.code === "CF-B02");
    expect(b02).toBeDefined();
    expect(b02!.points).toBe(4);
  });

  it("clamps net adjustment to [-20, +8]", () => {
    // Worst case: all penalties fire
    const n: CanonicalInput = {
      income_persistence_pct: 5,
      largest_source_pct: 95,
      source_diversity_count: 1,
      forward_secured_pct: 4,
      income_variability_level: "extreme",
      labor_dependence_pct: 100,
    };
    const result = computeInteractions(n, null);
    expect(result.net_adjustment).toBeGreaterThanOrEqual(-20);
    expect(result.net_adjustment).toBeLessThanOrEqual(8);
  });
});

// ─── QUALITY TESTS ──────────────────────────────────────

describe("Engine 08 — Income Quality", () => {
  it("returns default quality when no extended inputs", () => {
    const n = normalizeInputs(MID_INPUTS);
    const result = computeQuality(n, null);
    expect(result.quality_score).toBe(5);
    expect(result.durability_grade).toBe("moderate");
  });

  it("applies positive adjustments correctly", () => {
    const n = normalizeInputs(MID_INPUTS);
    const result = computeQuality(n, {
      recurring_contract_term_months_avg: 18,
      cancellation_risk_level: "low",
    });
    // Base 5 + 2 (long contract) + 2 (low cancel) = 9
    expect(result.quality_score).toBe(9);
    expect(result.durability_grade).toBe("highly_durable");
  });

  it("applies negative adjustments and clamps to 0", () => {
    const n = normalizeInputs(MID_INPUTS);
    const result = computeQuality(n, {
      recurring_contract_term_months_avg: 1,
      cancellation_risk_level: "high",
      platform_dependency_level: "high",
      customer_concentration_within_recurring_level: "high",
      booked_but_cancelable_pct: 60,
    });
    // Base 5 - 2 - 2 - 2 - 2 - 2 = -5 → clamped to 0
    expect(result.quality_score).toBe(0);
    expect(result.durability_grade).toBe("fragile");
  });
});

// ─── FRAGILITY TESTS ────────────────────────────────────

describe("Engine 10 — Fragility", () => {
  it("returns resilient for best-case inputs", () => {
    const n = normalizeInputs(ALL_E_INPUTS);
    const quality = computeQuality(n, null);
    const months = computeContinuityMonths(n);
    const result = computeFragility(n, quality, months);
    expect(result.fragility_score).toBeGreaterThanOrEqual(80);
    expect(result.fragility_class).toBe("resilient");
  });

  it("returns brittle for worst-case inputs", () => {
    const n = normalizeInputs(ALL_A_INPUTS);
    const quality = computeQuality(n, {
      recurring_contract_term_months_avg: 0,
      cancellation_risk_level: "high",
      platform_dependency_level: "high",
    });
    const months = computeContinuityMonths(n);
    const result = computeFragility(n, quality, months);
    expect(result.fragility_score).toBeLessThanOrEqual(24);
    expect(result.fragility_class).toBe("brittle");
    expect(result.primary_failure_mode).toBe("concentration_collapse");
  });
});

// ─── FULL PIPELINE TESTS ────────────────────────────────

describe("Full Assessment Pipeline", () => {
  it("produces identical output for identical inputs (determinism)", () => {
    const r1 = executeAssessment({ rawInputs: MID_INPUTS, profile: DEFAULT_PROFILE });
    const r2 = executeAssessment({ rawInputs: MID_INPUTS, profile: DEFAULT_PROFILE });

    expect(r1.scores.overall_score).toBe(r2.scores.overall_score);
    expect(r1.bands.primary_band).toBe(r2.bands.primary_band);
    expect(r1.integrity.input_hash).toBe(r2.integrity.input_hash);
    expect(r1.integrity.manifest_hash).toBe(r2.integrity.manifest_hash);
  });

  it("all-A inputs produce Limited Stability", () => {
    const result = executeAssessment({ rawInputs: ALL_A_INPUTS, profile: DEFAULT_PROFILE });
    expect(result.bands.primary_band).toBe("Limited Stability");
    expect(result.scores.overall_score).toBeLessThanOrEqual(29);
  });

  it("all-E inputs produce High Stability", () => {
    const result = executeAssessment({ rawInputs: ALL_E_INPUTS, profile: DEFAULT_PROFILE });
    expect(result.bands.primary_band).toBe("High Stability");
    expect(result.scores.overall_score).toBeGreaterThanOrEqual(75);
  });

  it("mid inputs produce a reasonable mid-range score", () => {
    const result = executeAssessment({ rawInputs: MID_INPUTS, profile: DEFAULT_PROFILE });
    expect(result.scores.overall_score).toBeGreaterThanOrEqual(20);
    expect(result.scores.overall_score).toBeLessThanOrEqual(70);
  });

  it("model manifest is RP-2.0", () => {
    const result = executeAssessment({ rawInputs: MID_INPUTS, profile: DEFAULT_PROFILE });
    expect(result.model_manifest.model_version).toBe("RP-2.0");
    expect(result.model_manifest.factor_version).toBe("F-2.0");
  });

  it("produces all required output sections", () => {
    const result = executeAssessment({ rawInputs: MID_INPUTS, profile: DEFAULT_PROFILE });

    // Core outputs
    expect(result.assessment_id).toBeDefined();
    expect(result.scores.overall_score).toBeGreaterThanOrEqual(0);
    expect(result.bands.primary_band).toBeDefined();
    expect(result.normalized_inputs).toBeDefined();

    // Analysis engines
    expect(result.indicators).toHaveLength(6);
    expect(result.interactions).toBeDefined();
    expect(result.quality).toBeDefined();
    expect(result.constraints.root_constraint).toBeDefined();
    expect(result.fragility.fragility_class).toBeDefined();
    expect(result.sensitivity.tests).toHaveLength(6);
    expect(result.scenarios).toHaveLength(6);
    expect(result.score_lift_projection.lift_scenarios.length).toBeGreaterThanOrEqual(5);
    expect(result.confidence.confidence_level).toBeDefined();

    // Presentation engines
    expect(result.explainability.why_this_score).toBeDefined();
    expect(result.explainability.why_not_higher).toBeDefined();
    expect(result.recommended_actions.length).toBeGreaterThan(0);
    expect(result.reassessment_triggers.length).toBeGreaterThan(0);
    expect(result.benchmarks).toBeDefined();

    // Governance
    expect(result.reason_codes.length).toBeGreaterThan(0);
    expect(result.integrity.input_hash).toBeDefined();
    expect(result.integrity.record_hash).toBeDefined();
  });

  it("interaction penalties fire correctly for worst-case", () => {
    const result = executeAssessment({ rawInputs: ALL_A_INPUTS, profile: DEFAULT_PROFILE });

    // CF-01: concentration(95) >= 70 AND forward(4) <= 20 → -8
    // CF-02: labor(100) >= 75 AND persistence(5) <= 25 → -7
    // CF-06: sources(1) <= 2 AND variability(extreme) → -6
    // Total: -21 → clamped to -20
    expect(result.interactions.net_adjustment).toBe(-20);
  });

  it("bonus fires for best-case inputs", () => {
    const result = executeAssessment({ rawInputs: ALL_E_INPUTS, profile: DEFAULT_PROFILE });

    // CF-B01: forward(100) >= 45 AND largest(15) <= 35 → +3
    // CF-B02: persistence(93) >= 60 AND labor(12) <= 35 → +4
    const bonuses = result.interactions.effects.filter((e) => e.type === "bonus");
    expect(bonuses.length).toBe(2);
    expect(result.interactions.total_bonus).toBe(7);
  });

  it("structure_score + stability_score + interactions = overall_score", () => {
    const result = executeAssessment({ rawInputs: MID_INPUTS, profile: DEFAULT_PROFILE });

    const expected = Math.max(
      0,
      Math.min(
        100,
        result.scores.structure_score +
          result.scores.stability_score +
          result.interactions.net_adjustment,
      ),
    );
    expect(result.scores.overall_score).toBe(expected);
  });

  it("scores are bounded [0, 100]", () => {
    const result = executeAssessment({ rawInputs: ALL_A_INPUTS, profile: DEFAULT_PROFILE });
    expect(result.scores.overall_score).toBeGreaterThanOrEqual(0);
    expect(result.scores.overall_score).toBeLessThanOrEqual(100);
  });
});

// ─── MANIFEST INTEGRITY ─────────────────────────────────

describe("Manifest Integrity", () => {
  it("manifest hash is stable", () => {
    const h1 = computeManifestHash();
    const h2 = computeManifestHash();
    expect(h1).toBe(h2);
  });
});

// ─── EXHAUSTIVE DETERMINISM (subset) ────────────────────

describe("Exhaustive Determinism (sampled)", () => {
  it("all 5^6 = 15,625 answer combinations produce bounded, deterministic scores", () => {
    const choices: AnswerChoice[] = ["A", "B", "C", "D", "E"];
    let count = 0;
    const seen = new Map<string, number>();

    for (const q1 of choices) {
      for (const q2 of choices) {
        for (const q3 of choices) {
          for (const q4 of choices) {
            for (const q5 of choices) {
              for (const q6 of choices) {
                const raw: RawDiagnosticInput = {
                  q1_recurring_revenue_base: q1,
                  q2_income_concentration: q2,
                  q3_income_source_diversity: q3,
                  q4_forward_revenue_visibility: q4,
                  q5_earnings_variability: q5,
                  q6_income_continuity_without_labor: q6,
                };

                const result = executeAssessment({
                  rawInputs: raw,
                  profile: DEFAULT_PROFILE,
                });

                // Bounded
                expect(result.scores.overall_score).toBeGreaterThanOrEqual(0);
                expect(result.scores.overall_score).toBeLessThanOrEqual(100);

                // Deterministic: same input hash → same score
                const key = result.integrity.input_hash;
                if (seen.has(key)) {
                  expect(result.scores.overall_score).toBe(seen.get(key));
                } else {
                  seen.set(key, result.scores.overall_score);
                }

                count++;
              }
            }
          }
        }
      }
    }

    expect(count).toBe(15625);
  }, 120000); // 2 minute timeout for exhaustive test
});
