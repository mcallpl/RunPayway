// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Outcome Layer Test Suite (OL-1.0)
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { executeAssessment } from "../src/lib/engine/v2/index";
import { resolveFamily } from "../src/lib/engine/v2/outcome/data/income-model-families";
import { FAMILY_PROFILES } from "../src/lib/engine/v2/outcome/data/family-profiles";
import { INDUSTRY_PROFILES } from "../src/lib/engine/v2/outcome/data/industry-profiles";
import { normalizeIntakeSignals } from "../src/lib/engine/v2/outcome/engines/intake-signals";
import { resolveFamilyProfile } from "../src/lib/engine/v2/outcome/engines/family-resolution";
import { selectScenarios } from "../src/lib/engine/v2/outcome/engines/scenario-selection";
import { mergeActions, mergeTriggers, mergeExplanations, mergeStrongerPatterns, applyScenarioEmphasis } from "../src/lib/engine/v2/outcome/engines/override-merge";
import { FAMILY_BENCHMARK_CONTEXT } from "../src/lib/engine/v2/outcome/data/benchmark-context";
import type { RawDiagnosticInput, ProfileContext } from "../src/lib/engine/v2/types";
import type { RawIntakeFields, IncomeModelFamilyId, ActionItem, SelectedScenario } from "../src/lib/engine/v2/outcome/types";

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

// ─── PHASE 2: INDUSTRY PROFILES ─────────────────────────

describe("Industry Profiles", () => {
  it("all 8 priority industries have complete profiles", () => {
    const required = [
      "real_estate", "consulting_professional_services", "agency_client_services",
      "private_practice_coaching", "creator_media", "ecommerce_product",
      "investing_asset", "sales_brokerage",
    ];

    for (const id of required) {
      const profile = INDUSTRY_PROFILES[id];
      expect(profile).toBeDefined();
      expect(profile.industry_label).toBeTruthy();
      expect(profile.applicable_income_models.length).toBeGreaterThan(0);
      expect(profile.scenario_emphasis.length).toBeGreaterThan(0);
      expect(profile.stronger_structure_overrides.length).toBeGreaterThan(0);
      expect(profile.action_priority_overrides.length).toBeGreaterThan(0);
      expect(profile.reassessment_trigger_overrides.length).toBeGreaterThan(0);
      expect(Object.keys(profile.explanation_language_overrides).length).toBeGreaterThan(0);
      expect(profile.benchmark_framing.framing_text).toBeTruthy();
      expect(profile.benchmark_framing.peer_group_label).toBeTruthy();
    }
  });
});

// ─── PHASE 2: OVERRIDE MERGE ENGINE ─────────────────────

describe("Override Merge Engine", () => {
  const familyActions: ActionItem[] = [
    { action_id: "FAM-01", label: "Family Action 1", description: "Desc 1" },
    { action_id: "FAM-02", label: "Family Action 2", description: "Desc 2" },
    { action_id: "FAM-03", label: "Family Action 3", description: "Desc 3" },
  ];
  const industryActions: ActionItem[] = [
    { action_id: "IND-01", label: "Industry Action 1", description: "Desc I1" },
    { action_id: "IND-02", label: "Industry Action 2", description: "Desc I2" },
  ];

  it("mergeActions puts industry actions first", () => {
    const merged = mergeActions(familyActions, industryActions, 4);
    expect(merged[0].action_id).toBe("IND-01");
    expect(merged[1].action_id).toBe("IND-02");
    expect(merged[2].action_id).toBe("FAM-01");
    expect(merged.length).toBe(4);
  });

  it("mergeActions respects max limit", () => {
    const merged = mergeActions(familyActions, industryActions, 3);
    expect(merged.length).toBe(3);
  });

  it("mergeActions returns family defaults when no industry overrides", () => {
    const merged = mergeActions(familyActions, [], 4);
    expect(merged[0].action_id).toBe("FAM-01");
  });

  it("mergeTriggers adds industry triggers without removing family ones", () => {
    const familyTriggers = [
      { trigger_id: "RT-F1", condition: "cond1", display_text: "text1" },
    ];
    const industryTriggers = [
      { trigger_id: "RT-I1", condition: "cond2", display_text: "text2" },
    ];
    const merged = mergeTriggers(familyTriggers, industryTriggers);
    expect(merged.length).toBe(2);
    expect(merged.map(t => t.trigger_id)).toContain("RT-F1");
    expect(merged.map(t => t.trigger_id)).toContain("RT-I1");
  });

  it("mergeTriggers deduplicates by trigger_id", () => {
    const familyTriggers = [
      { trigger_id: "RT-01", condition: "cond1", display_text: "family text" },
    ];
    const industryTriggers = [
      { trigger_id: "RT-01", condition: "cond1", display_text: "industry text" },
    ];
    const merged = mergeTriggers(familyTriggers, industryTriggers);
    expect(merged.length).toBe(1);
    expect(merged[0].display_text).toBe("family text"); // family wins
  });

  it("mergeExplanations replaces family text with industry text", () => {
    const family = { low_forward_secured: "family text", high_concentration: "family conc" };
    const industry = { low_forward_secured: "industry text" };
    const merged = mergeExplanations(family, industry);
    expect(merged.low_forward_secured).toBe("industry text");
    expect(merged.high_concentration).toBe("family conc");
  });

  it("mergeStrongerPatterns puts industry patterns first", () => {
    const family = ["Family pattern 1", "Family pattern 2", "Family pattern 3"];
    const industry = ["Industry pattern 1", "Industry pattern 2"];
    const merged = mergeStrongerPatterns(family, industry, 4);
    expect(merged[0]).toBe("Industry pattern 1");
    expect(merged[1]).toBe("Industry pattern 2");
    expect(merged.length).toBe(4);
  });

  it("applyScenarioEmphasis moves emphasized scenarios to top", () => {
    const scenarios: SelectedScenario[] = [
      { scenario_id: "RS-A", label: "A", description: "a", severity: "moderate", why_it_matters: "a" },
      { scenario_id: "RS-B", label: "B", description: "b", severity: "high", why_it_matters: "b" },
      { scenario_id: "RS-C", label: "C", description: "c", severity: "critical", why_it_matters: "c" },
    ];
    const result = applyScenarioEmphasis(scenarios, ["RS-C", "RS-B"]);
    expect(result[0].scenario_id).toBe("RS-C");
    expect(result[1].scenario_id).toBe("RS-B");
    expect(result[2].scenario_id).toBe("RS-A");
  });
});

// ─── PHASE 2: FULL INTEGRATION WITH INDUSTRY ────────────

describe("Outcome Layer with Industry Refinement", () => {
  it("applies real_estate industry overrides for commission profile", () => {
    const result = executeAssessment({
      rawInputs: MID_INPUTS,
      profile: {
        ...PROFILE_COMMISSION,
        industry_sector: "real_estate",
      },
      intakeFields: {
        primary_revenue_pattern: "commission_event",
        primary_weakness_pattern: "pipeline_slows",
        forward_security_method: "not_secured",
      },
    });

    const ol = result.outcome_layer!;
    expect(ol.industry_refinement_profile).not.toBeNull();
    expect(ol.industry_refinement_profile!.industry_id).toBe("real_estate");
    expect(ol.benchmark_context_layer).not.toBeNull();
    expect(ol.benchmark_context_layer!.peer_group_label).toBe("Real Estate");

    // Industry explanation overrides should be applied
    expect(ol.explanation_translation_layer.low_forward_secured).toContain("pipeline");
  });

  it("applies consulting industry overrides for retainer profile", () => {
    const result = executeAssessment({
      rawInputs: MID_INPUTS,
      profile: {
        ...PROFILE_RETAINER,
        industry_sector: "consulting_professional_services",
      },
    });

    const ol = result.outcome_layer!;
    expect(ol.industry_refinement_profile).not.toBeNull();
    expect(ol.industry_refinement_profile!.industry_id).toBe("consulting_professional_services");

    // Actions should be industry-overridden
    expect(ol.ranked_action_map[0].action_id).toContain("PS");
  });

  it("returns null industry profile for industries without overrides", () => {
    const result = executeAssessment({
      rawInputs: MID_INPUTS,
      profile: {
        ...PROFILE_COMMISSION,
        industry_sector: "agriculture",
      },
    });

    const ol = result.outcome_layer!;
    expect(ol.industry_refinement_profile).toBeNull();
    // Benchmark context still comes from family even without industry
    expect(ol.benchmark_context_layer).not.toBeNull();
    expect(ol.benchmark_context_layer!.peer_group_label).toBeTruthy();
    // Family defaults should still be present
    expect(ol.ranked_action_map.length).toBeGreaterThan(0);
  });

  it("industry overrides do not affect core score", () => {
    const withIndustry = executeAssessment({
      rawInputs: MID_INPUTS,
      profile: { ...PROFILE_COMMISSION, industry_sector: "real_estate" },
    });
    const withoutIndustry = executeAssessment({
      rawInputs: MID_INPUTS,
      profile: { ...PROFILE_COMMISSION, industry_sector: "agriculture" },
    });

    expect(withIndustry.scores.overall_score).toBe(withoutIndustry.scores.overall_score);
    expect(withIndustry.integrity.input_hash).toBe(withoutIndustry.integrity.input_hash);
  });

  it("all mapped industry sectors produce valid outcome layers", () => {
    const industries = [
      "real_estate", "consulting_professional_services", "sales_brokerage",
      "healthcare", "media_entertainment", "retail_ecommerce",
      "finance_banking", "legal_services",
    ];

    for (const ind of industries) {
      const result = executeAssessment({
        rawInputs: MID_INPUTS,
        profile: { ...PROFILE_COMMISSION, industry_sector: ind as ProfileContext["industry_sector"] },
      });
      const ol = result.outcome_layer!;
      expect(ol.industry_refinement_profile).not.toBeNull();
      expect(ol.stronger_structure_patterns.length).toBeGreaterThan(0);
      expect(ol.ranked_action_map.length).toBeGreaterThan(0);
      expect(ol.reassessment_trigger_set.length).toBeGreaterThan(0);
    }
  });
});

// ─── PHASE 3: BENCHMARK CONTEXT ─────────────────────────

describe("Benchmark Context Layer", () => {
  it("all 12 families have benchmark context entries", () => {
    const families: IncomeModelFamilyId[] = [
      "employment_led", "commission_led", "contract_project_led",
      "retainer_subscription_led", "practice_led", "agency_led",
      "product_led", "creator_audience_led", "referral_affiliate_led",
      "asset_rental_led", "investment_led", "hybrid_multi",
    ];
    for (const fam of families) {
      const ctx = FAMILY_BENCHMARK_CONTEXT[fam];
      expect(ctx).toBeDefined();
      expect(ctx.cluster_key).toBeTruthy();
      expect(ctx.peer_group_label).toBeTruthy();
      expect(ctx.framing_text).toBeTruthy();
      expect(ctx.typical_score_range.low).toBeLessThan(ctx.typical_score_range.mid);
      expect(ctx.typical_score_range.mid).toBeLessThan(ctx.typical_score_range.high);
      expect(ctx.common_strengths.length).toBeGreaterThan(0);
      expect(ctx.common_weaknesses.length).toBeGreaterThan(0);
    }
  });

  it("benchmark context is always populated in outcome layer", () => {
    const result = executeAssessment({
      rawInputs: MID_INPUTS,
      profile: PROFILE_COMMISSION,
    });
    const ol = result.outcome_layer!;
    expect(ol.benchmark_context_layer).not.toBeNull();
    expect(ol.benchmark_context_layer!.typical_score_range).toBeDefined();
    expect(ol.benchmark_context_layer!.common_strengths.length).toBeGreaterThan(0);
    expect(ol.benchmark_context_layer!.common_weaknesses.length).toBeGreaterThan(0);
  });

  it("industry profile overrides benchmark framing text", () => {
    const result = executeAssessment({
      rawInputs: MID_INPUTS,
      profile: { ...PROFILE_COMMISSION, industry_sector: "real_estate" as const },
    });
    const ol = result.outcome_layer!;
    expect(ol.benchmark_context_layer!.peer_group_label).toBe("Real Estate");
    // But family benchmark data (score ranges, strengths/weaknesses) is preserved
    expect(ol.benchmark_context_layer!.typical_score_range).toBeDefined();
  });

  it("family benchmark used when no industry profile exists", () => {
    const result = executeAssessment({
      rawInputs: MID_INPUTS,
      profile: { ...PROFILE_COMMISSION, industry_sector: "agriculture" as const },
    });
    const ol = result.outcome_layer!;
    expect(ol.benchmark_context_layer!.peer_group_label).toBe("Commission Earners");
  });
});

// ─── PHASE 3: OUTCOME MANIFEST ──────────────────────────

describe("Outcome Layer Manifest", () => {
  it("outcome manifest is always present", () => {
    const result = executeAssessment({
      rawInputs: MID_INPUTS,
      profile: PROFILE_COMMISSION,
    });
    const ol = result.outcome_layer!;
    expect(ol.outcome_manifest).toBeDefined();
    expect(ol.outcome_manifest.outcome_layer_version).toBe("OL-1.0");
    expect(ol.outcome_manifest.family_registry_version).toBe("FR-1.0");
    expect(ol.outcome_manifest.scenario_registry_version).toBe("SR-1.0");
    expect(ol.outcome_manifest.industry_registry_version).toBe("IR-1.0");
    expect(ol.outcome_manifest.benchmark_registry_version).toBe("BR-1.0");
  });

  it("outcome manifest is stable across invocations", () => {
    const r1 = executeAssessment({ rawInputs: MID_INPUTS, profile: PROFILE_COMMISSION });
    const r2 = executeAssessment({ rawInputs: MID_INPUTS, profile: PROFILE_RETAINER });
    expect(r1.outcome_layer!.outcome_manifest).toEqual(r2.outcome_layer!.outcome_manifest);
  });
});
