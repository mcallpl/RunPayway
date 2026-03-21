// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Outcome Layer Test Suite (OL-1.0)
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { executeAssessment } from "../src/lib/engine/v2/index";
import { resolveFamily } from "../src/lib/engine/v2/outcome/data/income-model-families";
import { FAMILY_PROFILES } from "../src/lib/engine/v2/outcome/data/family-profiles";
import { normalizeIntakeSignals } from "../src/lib/engine/v2/outcome/engines/intake-signals";
import { resolveFamilyProfile } from "../src/lib/engine/v2/outcome/engines/family-resolution";
import { selectScenarios } from "../src/lib/engine/v2/outcome/engines/scenario-selection";
import type { RawDiagnosticInput, ProfileContext } from "../src/lib/engine/v2/types";
import type { RawIntakeFields, IncomeModelFamilyId } from "../src/lib/engine/v2/outcome/types";

// ─── FIXTURES ───────────────────────────────────────────

const MID_INPUTS: RawDiagnosticInput = {
  q1_recurring_revenue_base: "C",
  q2_income_concentration: "C",
  q3_income_source_diversity: "C",
  q4_forward_revenue_visibility: "C",
  q5_earnings_variability: "C",
  q6_income_continuity_without_labor: "C",
};

const PROFILE_COMMISSION: ProfileContext = {
  profile_class: "individual",
  operating_structure: "commissioned_operator",
  primary_income_model: "commission",
  revenue_structure: "active_heavy",
  industry_sector: "real_estate",
  maturity_stage: "developing",
};

const PROFILE_RETAINER: ProfileContext = {
  profile_class: "individual",
  operating_structure: "retained_advisor",
  primary_income_model: "retainer",
  revenue_structure: "recurring_heavy",
  industry_sector: "consulting_professional_services",
  maturity_stage: "established",
};

const PROFILE_CREATOR: ProfileContext = {
  profile_class: "individual",
  operating_structure: "creator_operator",
  primary_income_model: "digital_products",
  revenue_structure: "mixed",
  industry_sector: "media_entertainment",
  maturity_stage: "developing",
};

// ─── FAMILY RESOLUTION TESTS ────────────────────────────

describe("Income Model Family Resolution", () => {
  it("resolves all 21 income models to valid families", () => {
    const models = [
      "Employee Salary", "Commission-Based", "Contract-Based",
      "Independent Contractor", "Team / Partnership Income",
      "Business Ownership", "Professional Practice",
      "Consulting / Client Services", "Agency / Brokerage Income",
      "Project-Based Work", "Subscription / Retainer Services",
      "Licensing / Royalty Income", "Product Sales",
      "Digital Product Sales", "Creator / Media Income",
      "Affiliate / Referral Income", "Real Estate Rental Income",
      "Real Estate Brokerage Income", "Franchise Ownership",
      "Investment / Dividend Income", "Hybrid Multiple Income Sources",
    ];

    const validFamilies: IncomeModelFamilyId[] = [
      "employment_led", "commission_led", "contract_project_led",
      "retainer_subscription_led", "practice_led", "agency_led",
      "product_led", "creator_audience_led", "referral_affiliate_led",
      "asset_rental_led", "investment_led", "hybrid_multi",
    ];

    for (const model of models) {
      const family = resolveFamily(model);
      expect(validFamilies).toContain(family);
    }
  });

  it("maps commission to commission_led", () => {
    expect(resolveFamily("commission")).toBe("commission_led");
    expect(resolveFamily("Commission-Based")).toBe("commission_led");
  });

  it("maps salary to employment_led", () => {
    expect(resolveFamily("salary")).toBe("employment_led");
    expect(resolveFamily("Employee Salary")).toBe("employment_led");
  });

  it("maps unknown models to hybrid_multi", () => {
    expect(resolveFamily("something_unknown")).toBe("hybrid_multi");
  });

  it("returns a complete family profile for each family", () => {
    for (const [id, profile] of Object.entries(FAMILY_PROFILES)) {
      expect(profile.family_id).toBe(id);
      expect(profile.family_label).toBeTruthy();
      expect(profile.income_models.length).toBeGreaterThan(0);
      expect(profile.common_weak_points.length).toBeGreaterThan(0);
      expect(profile.primary_risk_scenarios.length).toBeGreaterThan(0);
      expect(profile.stronger_structure_signals.length).toBeGreaterThan(0);
      expect(profile.default_action_priorities.length).toBeGreaterThan(0);
      expect(profile.reassessment_trigger_templates.length).toBeGreaterThan(0);
      expect(Object.keys(profile.explanation_translation_map).length).toBeGreaterThan(0);
    }
  });
});

// ─── INTAKE SIGNAL TESTS ────────────────────────────────

describe("Intake Signal Normalization", () => {
  it("returns defaults when no fields provided", () => {
    const signals = normalizeIntakeSignals(null);
    expect(signals.continuity_signal).toBe("moderate");
    expect(signals.forward_signal).toBe("moderate");
    expect(signals.concentration_type).toBe("mixed");
    expect(signals.labor_sensitivity).toBe("moderate");
  });

  it("normalizes commission/event pattern correctly", () => {
    const signals = normalizeIntakeSignals({
      primary_revenue_pattern: "commission_event",
      largest_source_type: "single_client",
      primary_weakness_pattern: "pipeline_slows",
      forward_security_method: "not_secured",
    });
    expect(signals.continuity_signal).toBe("weak");
    expect(signals.forward_signal).toBe("weak");
    expect(signals.concentration_type).toBe("client");
    expect(signals.pipeline_sensitivity).toBe("high");
    expect(signals.forward_quality).toBe("none");
  });

  it("normalizes subscription pattern correctly", () => {
    const signals = normalizeIntakeSignals({
      primary_revenue_pattern: "subscription_membership",
      forward_security_method: "subscriptions",
    });
    expect(signals.continuity_signal).toBe("strong");
    expect(signals.renewal_depth).toBe("strong");
    expect(signals.forward_quality).toBe("strong");
    expect(signals.visibility_horizon).toBe("medium");
  });

  it("normalizes rental/asset pattern correctly", () => {
    const signals = normalizeIntakeSignals({
      primary_revenue_pattern: "rental_asset",
      largest_source_type: "top_asset",
      forward_security_method: "lease_agreements",
    });
    expect(signals.continuity_signal).toBe("strong");
    expect(signals.concentration_type).toBe("asset");
    expect(signals.control_level).toBe("high");
    expect(signals.forward_quality).toBe("strong");
    expect(signals.visibility_horizon).toBe("long");
  });
});

// ─── SCENARIO SELECTION TESTS ───────────────────────────

describe("Scenario Selection", () => {
  it("selects scenarios for commission_led family", () => {
    const signals = normalizeIntakeSignals({
      primary_revenue_pattern: "commission_event",
      primary_weakness_pattern: "pipeline_slows",
    });
    const scenarios = selectScenarios("commission_led", "real_estate", signals, "uneven");
    expect(scenarios.length).toBeLessThanOrEqual(4);
    expect(scenarios.length).toBeGreaterThan(0);
    // Should include pipeline-related scenarios
    const ids = scenarios.map(s => s.scenario_id);
    expect(ids.some(id => id.includes("PIPELINE") || id.includes("CLIENT") || id.includes("DEAL"))).toBe(true);
  });

  it("selects scenarios for employment_led family", () => {
    const signals = normalizeIntakeSignals({
      primary_weakness_pattern: "stop_working",
    });
    const scenarios = selectScenarios("employment_led", "other", signals, "thin");
    expect(scenarios.length).toBeGreaterThan(0);
    const ids = scenarios.map(s => s.scenario_id);
    expect(ids).toContain("RS-JOB-LOSS");
  });

  it("selects scenarios for creator_audience_led family", () => {
    const signals = normalizeIntakeSignals({
      primary_weakness_pattern: "platform_drops",
      largest_source_type: "platform_marketplace",
    });
    const scenarios = selectScenarios("creator_audience_led", "media_entertainment", signals, "uneven");
    expect(scenarios.length).toBeGreaterThan(0);
    const ids = scenarios.map(s => s.scenario_id);
    expect(ids.some(id => id.includes("PLATFORM") || id.includes("AUDIENCE") || id.includes("SPONSOR"))).toBe(true);
  });

  it("returns max 4 scenarios", () => {
    const signals = normalizeIntakeSignals(null);
    const scenarios = selectScenarios("hybrid_multi", "other", signals, "brittle");
    expect(scenarios.length).toBeLessThanOrEqual(4);
  });

  it("is deterministic — same inputs produce same scenarios", () => {
    const signals = normalizeIntakeSignals({
      primary_revenue_pattern: "retainer_contract",
      primary_weakness_pattern: "source_leaves",
    });
    const s1 = selectScenarios("retainer_subscription_led", "consulting_professional_services", signals, "uneven");
    const s2 = selectScenarios("retainer_subscription_led", "consulting_professional_services", signals, "uneven");
    expect(s1.map(s => s.scenario_id)).toEqual(s2.map(s => s.scenario_id));
  });
});

// ─── FULL PIPELINE INTEGRATION ──────────────────────────

describe("Outcome Layer Integration", () => {
  it("produces outcome_layer in assessment record for commission profile", () => {
    const result = executeAssessment({
      rawInputs: MID_INPUTS,
      profile: PROFILE_COMMISSION,
      intakeFields: {
        primary_revenue_pattern: "commission_event",
        largest_source_type: "single_client",
        primary_weakness_pattern: "pipeline_slows",
        forward_security_method: "not_secured",
      },
    });

    expect(result.outcome_layer).toBeDefined();
    expect(result.outcome_layer!.income_model_family.family_id).toBe("commission_led");
    expect(result.outcome_layer!.selected_scenarios.length).toBeGreaterThan(0);
    expect(result.outcome_layer!.stronger_structure_patterns.length).toBeGreaterThan(0);
    expect(result.outcome_layer!.ranked_action_map.length).toBeGreaterThan(0);
    expect(result.outcome_layer!.avoid_actions.length).toBeGreaterThan(0);
    expect(result.outcome_layer!.reassessment_trigger_set.length).toBeGreaterThan(0);
    expect(Object.keys(result.outcome_layer!.explanation_translation_layer).length).toBeGreaterThan(0);
  });

  it("produces outcome_layer for retainer profile", () => {
    const result = executeAssessment({
      rawInputs: MID_INPUTS,
      profile: PROFILE_RETAINER,
      intakeFields: {
        primary_revenue_pattern: "retainer_contract",
        forward_security_method: "retainers",
      },
    });

    expect(result.outcome_layer).toBeDefined();
    expect(result.outcome_layer!.income_model_family.family_id).toBe("retainer_subscription_led");
  });

  it("produces outcome_layer without intake fields (graceful defaults)", () => {
    const result = executeAssessment({
      rawInputs: MID_INPUTS,
      profile: PROFILE_COMMISSION,
    });

    expect(result.outcome_layer).toBeDefined();
    expect(result.outcome_layer!.income_model_family.family_id).toBe("commission_led");
    expect(result.outcome_layer!.selected_scenarios.length).toBeGreaterThan(0);
  });

  it("outcome layer does not affect core score", () => {
    const withFields = executeAssessment({
      rawInputs: MID_INPUTS,
      profile: PROFILE_COMMISSION,
      intakeFields: {
        primary_revenue_pattern: "commission_event",
        primary_weakness_pattern: "pipeline_slows",
      },
    });

    const withoutFields = executeAssessment({
      rawInputs: MID_INPUTS,
      profile: PROFILE_COMMISSION,
    });

    // Core scores must be identical regardless of intake fields
    expect(withFields.scores.overall_score).toBe(withoutFields.scores.overall_score);
    expect(withFields.scores.structure_score).toBe(withoutFields.scores.structure_score);
    expect(withFields.scores.stability_score).toBe(withoutFields.scores.stability_score);
    expect(withFields.bands.primary_band).toBe(withoutFields.bands.primary_band);
    expect(withFields.integrity.input_hash).toBe(withoutFields.integrity.input_hash);
  });

  it("different income models produce different family assignments", () => {
    const commission = executeAssessment({ rawInputs: MID_INPUTS, profile: PROFILE_COMMISSION });
    const retainer = executeAssessment({ rawInputs: MID_INPUTS, profile: PROFILE_RETAINER });
    const creator = executeAssessment({ rawInputs: MID_INPUTS, profile: PROFILE_CREATOR });

    expect(commission.outcome_layer!.income_model_family.family_id).toBe("commission_led");
    expect(retainer.outcome_layer!.income_model_family.family_id).toBe("retainer_subscription_led");
    // digital_products maps to product_led
    expect(creator.outcome_layer!.income_model_family.family_id).toBe("product_led");
  });

  it("all 12 families have complete profiles", () => {
    const families: IncomeModelFamilyId[] = [
      "employment_led", "commission_led", "contract_project_led",
      "retainer_subscription_led", "practice_led", "agency_led",
      "product_led", "creator_audience_led", "referral_affiliate_led",
      "asset_rental_led", "investment_led", "hybrid_multi",
    ];

    for (const fam of families) {
      const profile = FAMILY_PROFILES[fam];
      expect(profile).toBeDefined();
      expect(profile.default_action_priorities.length).toBeGreaterThanOrEqual(3);
      expect(profile.reassessment_trigger_templates.length).toBeGreaterThanOrEqual(3);
      expect(profile.stronger_structure_signals.length).toBeGreaterThanOrEqual(3);
      // Each action has required fields
      for (const action of profile.default_action_priorities) {
        expect(action.action_id).toBeTruthy();
        expect(action.label).toBeTruthy();
        expect(action.description).toBeTruthy();
      }
    }
  });
});
