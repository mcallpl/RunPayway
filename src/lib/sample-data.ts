/* ------------------------------------------------------------------ */
/*  RunPayway™ — Sample assessment data for demo states               */
/*  4 profiles, one per stability band                                 */
/*  Stripped to UI-display fields only — no scoring weights/thresholds */
/* ------------------------------------------------------------------ */

export interface SampleProfile {
  id: string;
  label: string;
  band: string;
  bandShort: string;
  record: Record<string, unknown>;
}

const makeRecord = (overrides: Record<string, unknown>) => ({
  record_id: "sample-demo",
  authorization_code: "",
  model_version: "RP-2.0",
  assessment_date_utc: new Date().toISOString(),
  issued_timestamp_utc: new Date().toISOString(),
  classification: "individual",
  operating_structure: "independent_contractor",
  primary_income_model: "consulting",
  revenue_structure: "mixed",
  industry_sector: "consulting",
  ...overrides,
});

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    id: "limited",
    label: "Limited Stability",
    band: "Limited Stability",
    bandShort: "Limited",
    record: makeRecord({
      final_score: 22,
      stability_band: "Limited Stability",
      assessment_title: "Sample — Limited",
      active_income_level: 88,
      semi_persistent_income_level: 8,
      persistent_income_level: 4,
      income_continuity_months: 0.5,
      risk_scenario_score: 5,
      risk_scenario_drop: 17,
      _v2: {
        normalized_inputs: { income_persistence_pct: 8, largest_source_pct: 85, source_diversity_count: 1, forward_secured_pct: 5, income_variability_level: "high", labor_dependence_pct: 92 },
        quality: { quality_score: 3 },
        constraints: { root_constraint: "high_concentration", secondary_constraint: "high_labor_dependence" },
        fragility: { fragility_class: "brittle" },
      },
    }),
  },
  {
    id: "developing",
    label: "Developing Stability",
    band: "Developing Stability",
    bandShort: "Developing",
    record: makeRecord({
      final_score: 42,
      stability_band: "Developing Stability",
      assessment_title: "Sample — Developing",
      active_income_level: 68,
      semi_persistent_income_level: 22,
      persistent_income_level: 10,
      income_continuity_months: 1.8,
      risk_scenario_score: 28,
      risk_scenario_drop: 14,
      _v2: {
        normalized_inputs: { income_persistence_pct: 22, largest_source_pct: 60, source_diversity_count: 3, forward_secured_pct: 18, income_variability_level: "moderate", labor_dependence_pct: 72 },
        quality: { quality_score: 5 },
        constraints: { root_constraint: "weak_forward_visibility", secondary_constraint: "high_concentration" },
        fragility: { fragility_class: "fragile" },
      },
    }),
  },
  {
    id: "established",
    label: "Established Stability",
    band: "Established Stability",
    bandShort: "Established",
    record: makeRecord({
      final_score: 62,
      stability_band: "Established Stability",
      assessment_title: "Sample — Established",
      active_income_level: 42,
      semi_persistent_income_level: 35,
      persistent_income_level: 23,
      income_continuity_months: 4.2,
      risk_scenario_score: 49,
      risk_scenario_drop: 13,
      _v2: {
        normalized_inputs: { income_persistence_pct: 48, largest_source_pct: 38, source_diversity_count: 5, forward_secured_pct: 45, income_variability_level: "low", labor_dependence_pct: 48 },
        quality: { quality_score: 7 },
        constraints: { root_constraint: "high_labor_dependence", secondary_constraint: "low_persistence" },
        fragility: { fragility_class: "moderate" },
      },
    }),
  },
  {
    id: "high",
    label: "High Stability",
    band: "High Stability",
    bandShort: "High",
    record: makeRecord({
      final_score: 81,
      stability_band: "High Stability",
      assessment_title: "Sample — High",
      active_income_level: 22,
      semi_persistent_income_level: 38,
      persistent_income_level: 40,
      income_continuity_months: 9.5,
      risk_scenario_score: 68,
      risk_scenario_drop: 13,
      _v2: {
        normalized_inputs: { income_persistence_pct: 72, largest_source_pct: 25, source_diversity_count: 6, forward_secured_pct: 70, income_variability_level: "low", labor_dependence_pct: 28 },
        quality: { quality_score: 8 },
        constraints: { root_constraint: "low_persistence", secondary_constraint: "high_concentration" },
        fragility: { fragility_class: "resilient" },
      },
    }),
  },
];

export const SAMPLE_RECORD = SAMPLE_PROFILES[1].record; // Default: Developing

export const IS_SAMPLE = (record: Record<string, unknown> | null): boolean => {
  return !record || record.record_id === "sample-demo" || (record.final_score as number) === 0;
};
