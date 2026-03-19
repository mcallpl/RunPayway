// RUNPAYWAY™ Income Stability Score™ Diagnostic System
// Model RP-1.0 | Version 1.0 — Type Definitions

export const CANONICAL_KEYS = [
  "recurring_income_proportion",
  "income_concentration",
  "number_of_income_sources",
  "forward_revenue_visibility",
  "earnings_variability",
  "income_continuity_without_active_labor",
] as const;

export type CanonicalKey = (typeof CANONICAL_KEYS)[number];

export const STRUCTURE_KEYS: CanonicalKey[] = [
  "recurring_income_proportion",
  "number_of_income_sources",
  "forward_revenue_visibility",
];

export const STABILITY_KEYS: CanonicalKey[] = [
  "income_concentration",
  "earnings_variability",
  "income_continuity_without_active_labor",
];

export const ALLOWED_VALUES = [0, 25, 50, 75, 100] as const;
export type AllowedValue = (typeof ALLOWED_VALUES)[number];

export interface DiagnosticInput {
  recurring_income_proportion: AllowedValue;
  income_concentration: AllowedValue;
  number_of_income_sources: AllowedValue;
  forward_revenue_visibility: AllowedValue;
  earnings_variability: AllowedValue;
  income_continuity_without_active_labor: AllowedValue;
}

export type StabilityBand =
  | "Limited Stability"
  | "Developing Stability"
  | "Established Stability"
  | "High Stability";

export interface ScoringResult {
  structure_score: number;
  stability_score: number;
  final_score: number;
  stability_band: StabilityBand;
}

export interface InterpretationResult {
  band_interpretation_key: string;
  band_interpretation_text: string;
  primary_constraint_key: CanonicalKey;
  primary_constraint_label: string;
  primary_constraint_text: string;
  driver_1_key: CanonicalKey;
  driver_1_label: string;
  driver_1_text: string;
  driver_2_key: CanonicalKey;
  driver_2_label: string;
  driver_2_text: string;
  driver_3_key: CanonicalKey;
  driver_3_label: string;
  driver_3_text: string;
  structural_priority_key: CanonicalKey;
  structural_priority_label: string;
  structural_priority_text: string;
}

export interface ProfileContext {
  assessment_title?: string;
  classification: string;
  operating_structure: string;
  primary_income_model: string;
  revenue_structure: string;
  industry_sector: string;
  recipient_email?: string;
}

export interface DiagnosticSubmission {
  profile: ProfileContext;
  inputs: DiagnosticInput;
}

export interface StructuralAssessmentRecord {
  // Record identity
  record_id: string;
  authorization_code: string;
  assessment_date_utc: string;
  issued_timestamp_utc: string;

  // Governance metadata
  manifest_id: string;
  model_version: string;
  application_version: string;
  ruleset_checksum: string;
  interpretation_version: string;
  record_hash: string;

  // Subject linkage
  subject_identifier: string;
  recipient_email: string;

  // Profile context
  assessment_title: string;
  classification: string;
  operating_structure: string;
  primary_income_model: string;
  revenue_structure: string;
  industry_sector: string;

  // Canonical engine inputs
  recurring_income_proportion: AllowedValue;
  income_concentration: AllowedValue;
  number_of_income_sources: AllowedValue;
  forward_revenue_visibility: AllowedValue;
  earnings_variability: AllowedValue;
  income_continuity_without_active_labor: AllowedValue;

  // Engine snapshot
  engine_snapshot: string;

  // Scoring outputs
  final_score: number;
  stability_band: StabilityBand;
  structure_score: number;
  stability_score: number;
  input_checksum: string;

  // Interpretation outputs
  band_interpretation_key: string;
  band_interpretation_text: string;
  primary_constraint_key: string;
  primary_constraint_label: string;
  primary_constraint_text: string;
  driver_1_key: string;
  driver_1_label: string;
  driver_1_text: string;
  driver_2_key: string;
  driver_2_label: string;
  driver_2_text: string;
  driver_3_key: string;
  driver_3_label: string;
  driver_3_text: string;
  structural_priority_key: string;
  structural_priority_label: string;
  structural_priority_text: string;

  // Refined diagnostic outputs
  page_1_key_insight_text: string;
  page_2_key_insight_text: string;
  page_3_key_insight_text: string;
  page_4_key_insight_text: string;
  page_5_key_insight_text: string;
  page_6_key_insight_text: string;

  // Labor-Asset position
  labor_asset_position_key: string;
  labor_asset_position_label: string;
  labor_asset_framework_text: string;
  labor_asset_marker_position: number;

  // Structural Income Map
  active_income_level: number;
  semi_persistent_income_level: number;
  persistent_income_level: number;

  // Structural Indicators
  income_persistence_label: string;
  income_source_diversity_label: string;
  forward_revenue_visibility_label: string;
  income_variability_label: string;
  active_labor_dependence_label: string;
  exposure_concentration_label: string;

  // Stability spectrum
  stability_spectrum_position: number;

  // Peer benchmark
  peer_benchmark_group_key: string;
  peer_benchmark_group_label: string;
  peer_benchmark_text: string;
  peer_distribution_payload: string;
  peer_position_marker: number;

  // Evolution path
  evolution_path_key: string;
  evolution_path_title: string;
  evolution_path_steps_payload: string;
  current_evolution_stage_key: string;
  current_evolution_stage_label: string;
  current_evolution_stage_position: number;
  sector_mechanisms_payload: string;
  sector_avg_score: number;
  sector_top_20_threshold: number;
  peer_band_distribution_payload: string;
  constraint_guidance_payload: string;
  structural_improvement_path_text: string;
  action_plan_payload: string;

  // Report sections (render cache)
  report_sections?: object;

  // Peer percentile (derived)
  peer_stability_percentile: number;
  peer_stability_percentile_label: string;

  // Stability trajectory projection (derived, illustrative only)
  projected_final_score: number;
  projected_stability_band: string;
  projected_structure_score: number;
  projected_stability_score: number;
  trajectory_constraint_key: string;
  trajectory_current_value: number;
  trajectory_projected_value: number;

  // Income continuity estimate
  income_continuity_pct: number;      // % of income that continues without active work
  income_continuity_months: number;   // estimated months of continuity
  income_continuity_text: string;     // plain-language description

  // Risk scenario
  risk_scenario_score: number;
  risk_scenario_band: string;
  risk_scenario_drop: number;
  risk_scenario_text: string;

  // Advisor discussion guide
  advisor_discussion_guide_payload: string; // JSON

  // Product recommendations
  product_recommendations_payload: string;  // JSON

  // Registry fields
  registry_status: "Active" | "Superseded" | "Revoked";
  registry_visibility: "private" | "public";
  registry_listing_id?: string;
  registry_listed_timestamp?: string;
  verification_status: "valid" | "invalid";

  // Delivery metadata
  delivery_method: string;
  delivery_status: string;
  delivery_initiated_at_utc?: string;
  message_reference_id?: string;
  secure_download_link?: string;
}

export interface StorageBackend {
  saveRecord(record: StructuralAssessmentRecord): Promise<void>;
  getRecord(recordId: string): Promise<StructuralAssessmentRecord | null>;
  findByInputChecksum(
    checksum: string,
    modelVersion: string
  ): Promise<StructuralAssessmentRecord | null>;
  verifyRecord(
    recordId: string,
    authorizationCode: string
  ): Promise<StructuralAssessmentRecord | null>;
  supersedePriorRecords(
    subjectIdentifier: string,
    excludeRecordId: string
  ): Promise<void>;
}
