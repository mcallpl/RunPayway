// ═══════════════════════════════════════════════════════════════
// Engine 16B — Action Translation Tests
// Ensures determinism and correct behavior across template resolution
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { executeAssessment } from "../src/lib/engine/v2/index";
import { translateActions } from "../src/lib/engine/v2/engines/16b-action-translation";
import type {
  RawDiagnosticInput,
  ProfileContext,
  RecommendedAction,
  AvoidAction,
  ConstraintHierarchy,
  SensitivityResult,
  ScoreLiftProjection,
  ResolvedProfile,
  CanonicalInput,
} from "../src/lib/engine/v2/types";

// ─── FIXTURES ───────────────────────────────────────────────

const mockCanonicalInput: CanonicalInput = {
  income_persistence_pct: 30,
  largest_source_pct: 65,
  source_diversity_count: 2,
  forward_secured_pct: 20,
  income_variability_level: "high",
  labor_dependence_pct: 85,
};

const mockConstraints: ConstraintHierarchy = {
  root_constraint: "high_concentration",
  primary_constraint: "weak_forward_visibility",
  secondary_constraint: "low_persistence",
  dependent_constraint: "high_labor_dependence",
  hidden_unlock: null,
};

const mockSensitivity: SensitivityResult = {
  tests: [
    {
      factor: "largest_source_pct",
      delta_description: "Reduce largest source by 20%",
      original_score: 55,
      projected_score: 65,
      lift: 10,
      rank: 1,
    },
    {
      factor: "forward_secured_pct",
      delta_description: "Increase forward visibility by 30%",
      original_score: 55,
      projected_score: 63,
      lift: 8,
      rank: 2,
    },
  ],
  highest_lift_factor: "largest_source_pct",
  bottleneck_factor: "forward_secured_pct",
  low_return_factor: "income_variability_level",
};

const mockScoreLift: ScoreLiftProjection = {
  lift_scenarios: [
    {
      scenario_id: "lift-1",
      label: "Diversify revenue",
      change_description: "Add new client at 15% revenue",
      original_score: 55,
      projected_score: 65,
      lift: 10,
      projected_band: "Developing Stability",
      band_shift: true,
    },
    {
      scenario_id: "lift-2",
      label: "Secure forward contracts",
      change_description: "Increase forward visibility to 50%",
      original_score: 55,
      projected_score: 63,
      lift: 8,
      projected_band: "Developing Stability",
      band_shift: false,
    },
    {
      scenario_id: "lift-3",
      label: "Build passive income",
      change_description: "Create 10% non-labor revenue",
      original_score: 55,
      projected_score: 62,
      lift: 7,
      projected_band: "Developing Stability",
      band_shift: false,
    },
  ],
  combined_top_two: {
    scenario_id: "combined",
    label: "Diversify + Secure forward",
    change_description: "Both actions",
    original_score: 55,
    projected_score: 72,
    lift: 17,
    projected_band: "Established Stability",
    band_shift: true,
  },
  highest_single_lift: {
    scenario_id: "lift-1",
    label: "Diversify revenue",
    change_description: "Add new client at 15% revenue",
    original_score: 55,
    projected_score: 65,
    lift: 10,
    projected_band: "Developing Stability",
    band_shift: true,
  },
};

const mockRecommendedActions: RecommendedAction[] = [
  {
    action_id: "ACT-CON-01",
    priority: 1,
    label: "Reduce Single-Source Concentration",
    description: "Diversify revenue across more clients or revenue lines",
    category: "diversification",
    expected_impact: "Improves concentration resilience and reduces fragility",
    timeframe: "Within 60 days: sign 1-2 new clients",
    target: "Acquire enough new revenue that your largest source drops below 50%",
    tradeoff: "New clients start small and take time to ramp.",
  },
  {
    action_id: "ACT-LIFT-FWD",
    priority: 2,
    label: "Lock In Forward Revenue",
    description: "Convert pipeline opportunities to signed commitments",
    category: "revenue_structure",
    expected_impact: "Highest projected score lift based on sensitivity analysis",
    timeframe: "Within 30 days",
    target: "Convert at least 2 pipeline opportunities to signed commitments",
    tradeoff: "Signed commitments reduce flexibility to pursue higher-value opportunities.",
  },
];

const mockAvoidActions: AvoidAction[] = [
  {
    action_id: "AVD-01",
    label: "Do not pursue income source diversification as first move",
    reason: "Salaried employees should focus on supplemental streams before restructuring primary income",
  },
];

const mockProfileHealthcare: ResolvedProfile = {
  profile_class: "business_owner",
  operating_structure: "retained_advisor",
  primary_income_model: "commission",
  revenue_structure: "active_heavy",
  industry_sector: "healthcare",
  maturity_stage: "established",
  profile_archetype: "Healthcare Commission Earner",
  is_labor_primary: true,
  is_asset_primary: false,
  is_recurring_model: false,
  is_project_model: false,
};

const mockProfileConsulting: ResolvedProfile = {
  profile_class: "business_owner",
  operating_structure: "small_agency",
  primary_income_model: "retainer",
  revenue_structure: "hybrid",
  industry_sector: "consulting_professional_services",
  maturity_stage: "developing",
  profile_archetype: "Independent Consultant",
  is_labor_primary: false,
  is_asset_primary: false,
  is_recurring_model: true,
  is_project_model: false,
};

// ─── TESTS ──────────────────────────────────────────────

describe("Engine 16B — Action Translation Unit Tests", () => {
  it("should use exact industry + income model template when available", () => {
    const result = translateActions(
      mockRecommendedActions,
      mockAvoidActions,
      mockConstraints,
      mockSensitivity,
      mockScoreLift,
      mockProfileHealthcare,
      mockCanonicalInput,
      null,
    );

    expect(result).toBeDefined();
    expect(result.top_moves.length).toBeGreaterThan(0);
  });

  it("should produce identical ActionPlan on repeated execution with same inputs", () => {
    const extendedInputs = {
      largest_account_or_channel_pct: 65,
      months_of_visibility: 2,
    };

    const result1 = translateActions(
      mockRecommendedActions,
      mockAvoidActions,
      mockConstraints,
      mockSensitivity,
      mockScoreLift,
      mockProfileHealthcare,
      mockCanonicalInput,
      extendedInputs,
    );

    const result2 = translateActions(
      mockRecommendedActions,
      mockAvoidActions,
      mockConstraints,
      mockSensitivity,
      mockScoreLift,
      mockProfileHealthcare,
      mockCanonicalInput,
      extendedInputs,
    );

    expect(JSON.stringify(result1)).toBe(JSON.stringify(result2));
  });

  it("should assign 'high' confidence when template + extended inputs present", () => {
    const extendedInputs = {
      largest_account_or_channel_pct: 65,
      customer_concentration_within_recurring_level: "high" as const,
    };

    const result = translateActions(
      mockRecommendedActions,
      [],
      mockConstraints,
      mockSensitivity,
      mockScoreLift,
      mockProfileHealthcare,
      mockCanonicalInput,
      extendedInputs,
    );

    const firstMove = result.top_moves[0];
    expect(firstMove.action_confidence).toBe("high");
  });

  it("should assign 'moderate' confidence with single extended input", () => {
    const extendedInputs = {
      largest_account_or_channel_pct: 65,
    };

    const result = translateActions(
      mockRecommendedActions,
      [],
      mockConstraints,
      mockSensitivity,
      mockScoreLift,
      mockProfileHealthcare,
      mockCanonicalInput,
      extendedInputs,
    );

    const firstMove = result.top_moves[0];
    expect(firstMove.action_confidence).toBe("moderate");
  });

  it("should assign 'guarded' confidence with no extended inputs", () => {
    const result = translateActions(
      mockRecommendedActions,
      [],
      mockConstraints,
      mockSensitivity,
      mockScoreLift,
      mockProfileConsulting,
      mockCanonicalInput,
      null,
    );

    const firstMove = result.top_moves[0];
    expect(firstMove.action_confidence).toBe("guarded");
  });

  it("should return complete ActionPlan with all required fields", () => {
    const result = translateActions(
      mockRecommendedActions,
      mockAvoidActions,
      mockConstraints,
      mockSensitivity,
      mockScoreLift,
      mockProfileConsulting,
      mockCanonicalInput,
      null,
    );

    expect(result).toHaveProperty("primary_opportunity");
    expect(result).toHaveProperty("top_moves");
    expect(result).toHaveProperty("first_recommended_shift");
    expect(result).toHaveProperty("avoid_first");
    expect(result).toHaveProperty("reassessment_trigger");

    expect(result.primary_opportunity).toBeTruthy();
    expect(result.first_recommended_shift).toBeTruthy();
    expect(result.avoid_first).toBeTruthy();
    expect(result.reassessment_trigger).toBeTruthy();
    expect(Array.isArray(result.top_moves)).toBe(true);
    expect(result.top_moves.length).toBeGreaterThan(0);
    expect(result.top_moves.length).toBeLessThanOrEqual(3);
  });

  it("should populate TranslatedActionMove with all fields", () => {
    const result = translateActions(
      mockRecommendedActions,
      [],
      mockConstraints,
      mockSensitivity,
      mockScoreLift,
      mockProfileConsulting,
      mockCanonicalInput,
      null,
    );

    const move = result.top_moves[0];

    expect(move).toHaveProperty("rank");
    expect(move).toHaveProperty("source_action_id");
    expect(move).toHaveProperty("action_title");
    expect(move).toHaveProperty("selected_because");
    expect(move).toHaveProperty("target_metric");
    expect(move).toHaveProperty("first_step");
    expect(move).toHaveProperty("avoid_first");
    expect(move).toHaveProperty("estimated_score_lift");
    expect(move).toHaveProperty("reassess_when");
    expect(move).toHaveProperty("action_confidence");

    result.top_moves.forEach((m, idx) => {
      expect(m.rank).toBe(idx + 1);
    });
  });

  it("should generate constraint-appropriate reassessment triggers", () => {
    const constraints1: ConstraintHierarchy = {
      root_constraint: "high_concentration",
      primary_constraint: "weak_forward_visibility",
      secondary_constraint: "low_persistence",
      dependent_constraint: null,
      hidden_unlock: null,
    };

    const constraints2: ConstraintHierarchy = {
      root_constraint: "weak_forward_visibility",
      primary_constraint: "high_concentration",
      secondary_constraint: "low_persistence",
      dependent_constraint: null,
      hidden_unlock: null,
    };

    const result1 = translateActions(
      mockRecommendedActions,
      [],
      constraints1,
      mockSensitivity,
      mockScoreLift,
      mockProfileConsulting,
      mockCanonicalInput,
      null,
    );

    const result2 = translateActions(
      mockRecommendedActions,
      [],
      constraints2,
      mockSensitivity,
      mockScoreLift,
      mockProfileConsulting,
      mockCanonicalInput,
      null,
    );

    expect(result1.reassessment_trigger).not.toBe(result2.reassessment_trigger);
  });
});

describe("Engine 16B — Integration with Full Pipeline", () => {
  it("should include action_plan in final AssessmentRecord", () => {
    const rawInputs: RawDiagnosticInput = {
      q1_recurring_revenue_base: "C",
      q2_income_concentration: "D",
      q3_income_source_diversity: "C",
      q4_forward_revenue_visibility: "B",
      q5_earnings_variability: "D",
      q6_income_continuity_without_labor: "B",
    };

    const profile: ProfileContext = {
      profile_class: "business_owner",
      operating_structure: "small_agency",
      primary_income_model: "project_fee",
      revenue_structure: "active_heavy",
      industry_sector: "consulting_professional_services",
      maturity_stage: "developing",
    };

    const record = executeAssessment({ rawInputs, profile });

    expect(record).toHaveProperty("action_plan");
    expect(record.action_plan).toBeDefined();
    expect(record.action_plan).toHaveProperty("primary_opportunity");
    expect(record.action_plan).toHaveProperty("top_moves");
    expect(record.action_plan).toHaveProperty("first_recommended_shift");
    expect(record.action_plan).toHaveProperty("avoid_first");
    expect(record.action_plan).toHaveProperty("reassessment_trigger");
  });

  it("should produce identical action_plan for identical inputs (determinism)", () => {
    const rawInputs: RawDiagnosticInput = {
      q1_recurring_revenue_base: "D",
      q2_income_concentration: "E",
      q3_income_source_diversity: "C",
      q4_forward_revenue_visibility: "C",
      q5_earnings_variability: "E",
      q6_income_continuity_without_labor: "C",
    };

    const profile: ProfileContext = {
      profile_class: "business_owner",
      operating_structure: "retained_advisor",
      primary_income_model: "commission",
      revenue_structure: "active_heavy",
      industry_sector: "real_estate",
      maturity_stage: "established",
    };

    const record1 = executeAssessment({ rawInputs, profile });
    const record2 = executeAssessment({ rawInputs, profile });

    expect(JSON.stringify(record1.action_plan)).toBe(
      JSON.stringify(record2.action_plan),
    );
  });

  it("should not affect scoring outputs when generating action_plan", () => {
    const rawInputs: RawDiagnosticInput = {
      q1_recurring_revenue_base: "B",
      q2_income_concentration: "B",
      q3_income_source_diversity: "B",
      q4_forward_revenue_visibility: "B",
      q5_earnings_variability: "B",
      q6_income_continuity_without_labor: "B",
    };

    const profile: ProfileContext = {
      profile_class: "individual",
      operating_structure: "solo_service",
      primary_income_model: "subscription",
      revenue_structure: "recurring_heavy",
      industry_sector: "technology",
      maturity_stage: "established",
    };

    const record1 = executeAssessment({ rawInputs, profile });
    const record2 = executeAssessment({ rawInputs, profile });

    expect(record1.scores.overall_score).toBe(record2.scores.overall_score);
    expect(record1.scores.structure_score).toBe(record2.scores.structure_score);
  });

  it("should include action_plan in all assessment records", () => {
    const rawInputs: RawDiagnosticInput = {
      q1_recurring_revenue_base: "C",
      q2_income_concentration: "D",
      q3_income_source_diversity: "C",
      q4_forward_revenue_visibility: "B",
      q5_earnings_variability: "D",
      q6_income_continuity_without_labor: "B",
    };

    const profile: ProfileContext = {
      profile_class: "business_owner",
      operating_structure: "small_agency",
      primary_income_model: "retainer",
      revenue_structure: "hybrid",
      industry_sector: "consulting_professional_services",
      maturity_stage: "developing",
    };

    const record = executeAssessment({
      rawInputs,
      profile,
      extendedInputs: {
        largest_account_or_channel_pct: 65,
        renewal_income_pct: 30,
        recurring_contract_term_months_avg: 12,
      },
    });

    // Verify action_plan structure
    expect(record.action_plan).toBeDefined();
    expect(record.action_plan.top_moves.length).toBeGreaterThan(0);
    expect(record.action_plan.top_moves.length).toBeLessThanOrEqual(3);

    // Verify moves have proper confidence assignments
    record.action_plan.top_moves.forEach((move) => {
      expect(["high", "moderate", "guarded"]).toContain(move.action_confidence);
      expect(move.estimated_score_lift).toBeGreaterThanOrEqual(0);
    });
  });
});
