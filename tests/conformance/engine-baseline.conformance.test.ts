// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™: WO-G Slice 1
// RP-2.0 Historical Characterization Baseline (Conformance)
//
// Governing authority: ADR-006, WO-G, Acceptance Log Entry 17,
// GOVERNANCE_FREEZE_V1. Companion document:
// docs/COMPLEX_INCOME_MEASUREMENT_STANDARD_V1.md
//
// This test characterizes ONLY the following proposition:
//
//   For this exact valid input and repository baseline, the current
//   RP-2.0 engine deterministically returns the selected pinned fields.
//
// It does NOT claim that these fields or values are the accepted
// RunPayway™ enterprise measurement standard. The current RP-2.0
// score, band, reason-code vocabulary, calculation semantics, and
// output structure are recorded here as historical characterization
// evidence for governance review only; not adopted as normative.
//
// Purity: this test imports only the pure RP-2.0 engine entry point.
// It loads no Prisma, database, persistence, API, network, or
// filesystem-writing dependency, and touches no WO-F / public-DTO,
// verify-public, or Stable/Moderate/Volatile public-projection code.
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { executeAssessment } from "../../src/lib/engine/v2/index";
import type { ExecuteAssessmentOptions } from "../../src/lib/engine/v2/index";

// ─── Fixed, valid input vector under the existing engine contract ───
// All six diagnostic inputs at the mid ("C") option with an established
// individual solo-service consulting profile. This mirrors the shape
// exercised by the engine's own regression suite and is a valid
// ExecuteAssessmentOptions under the current input contract.
const BASELINE_INPUT: ExecuteAssessmentOptions = {
  rawInputs: {
    q1_recurring_revenue_base: "C",
    q2_income_concentration: "C",
    q3_income_source_diversity: "C",
    q4_forward_revenue_visibility: "C",
    q5_earnings_variability: "C",
    q6_income_continuity_without_labor: "C",
  },
  profile: {
    profile_class: "individual",
    operating_structure: "solo_service",
    primary_income_model: "project_fee",
    revenue_structure: "active_heavy",
    industry_sector: "consulting_professional_services",
    maturity_stage: "established",
  },
};

// ─── Pinned deterministic fields (historical characterization) ───────
// Reason-code ordering is not treated as contractually meaningful, so
// the reason-code set is normalized (sorted by code) before assertion.
const PINNED = {
  overall_score: 51,
  primary_band: "Established Stability",
  fragility_score: 100,
  fragility_class: "resilient",
  root_constraint: "high_concentration",
  reason_codes_sorted: [
    "ACT-001", "BNK-001", "CNF-001", "CON-001", "CON-002", "CTX-001",
    "EXP-001", "FRG-001", "IGT-001", "IND-001", "INT-001", "LFT-001",
    "NRM-001", "QAL-002", "RSA-001", "SCN-001", "SCN-002", "SCR-001",
    "SCR-002", "SCR-003", "SEN-001", "VAL-003",
  ],
} as const;

function sortedReasonCodes(record: ReturnType<typeof executeAssessment>): string[] {
  return (record.reason_codes || []).map((c) => c.code).sort();
}

describe("WO-G Slice 1: RP-2.0 historical characterization baseline", () => {
  it("deterministically returns the pinned fields for the fixed baseline input", () => {
    const record = executeAssessment(BASELINE_INPUT);

    expect(record.scores.overall_score).toBe(PINNED.overall_score);
    expect(record.bands.primary_band).toBe(PINNED.primary_band);
    expect(record.fragility.fragility_score).toBe(PINNED.fragility_score);
    expect(record.fragility.fragility_class).toBe(PINNED.fragility_class);
    expect(record.constraints.root_constraint).toBe(PINNED.root_constraint);
    expect(sortedReasonCodes(record)).toEqual(PINNED.reason_codes_sorted);
  });

  it("produces identical pinned fields across repeated executions (determinism)", () => {
    const a = executeAssessment(BASELINE_INPUT);
    const b = executeAssessment(BASELINE_INPUT);

    expect(a.scores.overall_score).toBe(b.scores.overall_score);
    expect(a.bands.primary_band).toBe(b.bands.primary_band);
    expect(a.fragility.fragility_score).toBe(b.fragility.fragility_score);
    expect(a.fragility.fragility_class).toBe(b.fragility.fragility_class);
    expect(a.constraints.root_constraint).toBe(b.constraints.root_constraint);
    expect(sortedReasonCodes(a)).toEqual(sortedReasonCodes(b));
  });

  it("excludes non-deterministic fields from characterization", () => {
    // assessment_id (UUID) and created_at (timestamp) are environment/
    // run-dependent and are intentionally NOT pinned. They are asserted
    // here only to document that they vary and are excluded by design.
    const a = executeAssessment(BASELINE_INPUT);
    const b = executeAssessment(BASELINE_INPUT);

    expect(a.assessment_id).not.toBe(b.assessment_id);
    // created_at is a generated timestamp; it is excluded from the baseline.
    expect(typeof a.created_at).toBe("string");
  });
});
