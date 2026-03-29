/* ------------------------------------------------------------------ */
/*  RunPayway™ — Sample assessment data for demo states               */
/*  4 profiles, one per stability band                                 */
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
        fragility: { fragility_score: 18, fragility_class: "brittle", primary_failure_mode: "concentration_collapse" },
        sensitivity: { tests: [
          { factor: "largest_source_pct", delta_description: "Add a second income source", lift: 9, projected_score: 31, original_score: 22, rank: 1 },
          { factor: "labor_dependence_pct", delta_description: "Create any income that does not require your daily work", lift: 6, projected_score: 28, original_score: 22, rank: 2 },
        ]},
        scenarios: [
          { scenario_id: "client_concentration_loss", label: "Client Concentration Loss", original_score: 22, scenario_score: 5, score_drop: 17, original_band: "Limited Stability", scenario_band: "Limited Stability", band_shift: false, narrative: "Losing your primary source would be catastrophic — nearly all income gone." },
          { scenario_id: "active_labor_interrupted", label: "Active Labor Interrupted", original_score: 22, scenario_score: 8, score_drop: 14, original_band: "Limited Stability", scenario_band: "Limited Stability", band_shift: false, narrative: "Unable to work means zero income within weeks." },
        ],
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
        fragility: { fragility_score: 38, fragility_class: "fragile", primary_failure_mode: "visibility_gap" },
        sensitivity: { tests: [
          { factor: "forward_secured_pct", delta_description: "Lock in 3 more months of income ahead", lift: 6, projected_score: 48, original_score: 42, rank: 1 },
          { factor: "income_persistence_pct", delta_description: "Convert one client to a monthly retainer", lift: 5, projected_score: 47, original_score: 42, rank: 2 },
        ]},
        scenarios: [
          { scenario_id: "client_concentration_loss", label: "Client Concentration Loss", original_score: 42, scenario_score: 28, score_drop: 14, original_band: "Developing Stability", scenario_band: "Limited Stability", band_shift: true, narrative: "Losing your top client would push you below the stability threshold." },
          { scenario_id: "active_labor_interrupted", label: "Active Labor Interrupted", original_score: 42, scenario_score: 30, score_drop: 12, original_band: "Developing Stability", scenario_band: "Developing Stability", band_shift: false, narrative: "Income stops within weeks of being unable to work." },
        ],
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
        fragility: { fragility_score: 62, fragility_class: "moderate", primary_failure_mode: "labor_interruption" },
        sensitivity: { tests: [
          { factor: "labor_dependence_pct", delta_description: "Reduce how much depends on your daily work by 20%", lift: 5, projected_score: 67, original_score: 62, rank: 1 },
          { factor: "income_persistence_pct", delta_description: "Increase protected income by 15%", lift: 4, projected_score: 66, original_score: 62, rank: 2 },
        ]},
        scenarios: [
          { scenario_id: "active_labor_interrupted", label: "Active Labor Interrupted", original_score: 62, scenario_score: 49, score_drop: 13, original_band: "Established Stability", scenario_band: "Developing Stability", band_shift: true, narrative: "A 90-day work stoppage would drop you to Developing." },
          { scenario_id: "client_concentration_loss", label: "Client Concentration Loss", original_score: 62, scenario_score: 52, score_drop: 10, original_band: "Established Stability", scenario_band: "Established Stability", band_shift: false, narrative: "Losing your top client hurts but does not break the structure." },
        ],
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
        fragility: { fragility_score: 82, fragility_class: "resilient", primary_failure_mode: "durability_thinness" },
        sensitivity: { tests: [
          { factor: "income_persistence_pct", delta_description: "Increase protected income by 10%", lift: 3, projected_score: 84, original_score: 81, rank: 1 },
          { factor: "largest_source_pct", delta_description: "Further diversify income sources", lift: 2, projected_score: 83, original_score: 81, rank: 2 },
        ]},
        scenarios: [
          { scenario_id: "client_concentration_loss", label: "Client Concentration Loss", original_score: 81, scenario_score: 68, score_drop: 13, original_band: "High Stability", scenario_band: "Established Stability", band_shift: true, narrative: "Even a major client loss keeps you above Developing." },
          { scenario_id: "active_labor_interrupted", label: "Active Labor Interrupted", original_score: 81, scenario_score: 72, score_drop: 9, original_band: "High Stability", scenario_band: "Established Stability", band_shift: true, narrative: "9+ months of continuity means income survives extended disruption." },
        ],
      },
    }),
  },
];

export const SAMPLE_RECORD = SAMPLE_PROFILES[1].record; // Default: Developing

export const IS_SAMPLE = (record: Record<string, unknown> | null): boolean => {
  return !record || record.record_id === "sample-demo" || (record.final_score as number) === 0;
};
