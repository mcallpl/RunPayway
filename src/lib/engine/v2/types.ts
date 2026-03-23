// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Model RP-2.0 Domain Types
// Deterministic Structural Income Diagnostic Platform
// ═══════════════════════════════════════════════════════════════

// ─── ANSWER VALUES ───────────────────────────────────────

export type AnswerChoice = "A" | "B" | "C" | "D" | "E";

// ─── RAW INPUTS (from intake form) ──────────────────────

export interface RawDiagnosticInput {
  q1_recurring_revenue_base: AnswerChoice;
  q2_income_concentration: AnswerChoice;
  q3_income_source_diversity: AnswerChoice;
  q4_forward_revenue_visibility: AnswerChoice;
  q5_earnings_variability: AnswerChoice;
  q6_income_continuity_without_labor: AnswerChoice;
}

// ─── CANONICAL INPUTS (normalized to numeric) ───────────

export interface CanonicalInput {
  income_persistence_pct: number;
  largest_source_pct: number;
  source_diversity_count: number;
  forward_secured_pct: number;
  income_variability_level: VariabilityLevel;
  labor_dependence_pct: number;
}

export type VariabilityLevel = "low" | "moderate" | "high" | "extreme";

// ─── PROFILE CONTEXT ────────────────────────────────────

export type ProfileClass = "individual" | "business_owner" | "hybrid";

export type OperatingStructure =
  | "solo_service"
  | "small_agency"
  | "commissioned_operator"
  | "retained_advisor"
  | "creator_operator"
  | "productized_service"
  | "portfolio_operator"
  | "asset_supported";

export type PrimaryIncomeModel =
  | "commission"
  | "retainer"
  | "project_fee"
  | "subscription"
  | "salary"
  | "mixed_services"
  | "licensing"
  | "rental"
  | "ecommerce"
  | "digital_products"
  | "other";

export type RevenueStructure =
  | "active_heavy"
  | "hybrid"
  | "recurring_heavy"
  | "asset_heavy"
  | "mixed";

export type IndustrySector =
  | "real_estate"
  | "finance_banking"
  | "insurance"
  | "technology"
  | "healthcare"
  | "legal_services"
  | "consulting_professional_services"
  | "sales_brokerage"
  | "media_entertainment"
  | "construction_trades"
  | "retail_ecommerce"
  | "hospitality_food_service"
  | "transportation_logistics"
  | "manufacturing"
  | "education"
  | "nonprofit_public_sector"
  | "agriculture"
  | "energy_utilities"
  | "other";

export type MaturityStage = "early" | "developing" | "established";

export interface ProfileContext {
  profile_class: ProfileClass;
  operating_structure: OperatingStructure;
  primary_income_model: PrimaryIncomeModel;
  revenue_structure: RevenueStructure;
  industry_sector: IndustrySector;
  maturity_stage: MaturityStage;
}

// ─── RESOLVED PROFILE ───────────────────────────────────

export interface ResolvedProfile extends ProfileContext {
  profile_archetype: string;
  is_labor_primary: boolean;
  is_asset_primary: boolean;
  is_recurring_model: boolean;
  is_project_model: boolean;
}

// ─── EXTENDED INPUTS (optional) ─────────────────────────

export type RiskLevel = "low" | "moderate" | "high";

export interface ExtendedInputs {
  recurring_contract_term_months_avg?: number;
  cancellation_risk_level?: RiskLevel;
  platform_dependency_level?: RiskLevel;
  customer_concentration_within_recurring_level?: RiskLevel;
  months_of_visibility?: number;
  repeat_revenue_pct?: number;
  asset_backed_income_pct?: number;
  booked_but_cancelable_pct?: number;
  historical_assessment_count?: number;
}

// ─── RAW SCORE BREAKDOWN ────────────────────────────────

export interface RawScoreBreakdown {
  income_persistence_score: number;
  source_diversity_score: number;
  forward_security_score: number;
  concentration_resilience_score: number;
  labor_dependence_score: number;
  variability_score: number;
  continuity_months: number;
  continuity_score: number;
  structure_subtotal: number;
  stability_subtotal: number;
  raw_total: number;
}

// ─── SCORING OUTPUTS ────────────────────────────────────

export interface ScoreBreakdown {
  overall_score: number;
  structure_score: number;
  stability_score: number;
  continuity_score: number;
  concentration_resilience_score: number;
  forward_security_score: number;
  labor_dependence_score: number;
  quality_adjustment: number;
  fragility_score: number;
}

export type StabilityBand =
  | "Limited Stability"
  | "Developing Stability"
  | "Established Stability"
  | "High Stability";

export type SubBandLabel = string;

export interface BandClassification {
  primary_band: StabilityBand;
  sub_band: SubBandLabel;
  warning_overlays: WarningOverlay[];
}

export interface WarningOverlay {
  code: string;
  label: string;
  trigger: string;
}

// ─── INTERACTION EFFECTS ────────────────────────────────

export interface InteractionEffect {
  code: string;
  type: "penalty" | "bonus";
  points: number;
  trigger_condition: string;
  factors_involved: string[];
}

export interface InteractionResult {
  effects: InteractionEffect[];
  total_penalty: number;
  total_bonus: number;
  net_adjustment: number;
}

// ─── INCOME QUALITY ─────────────────────────────────────

export type DurabilityGrade =
  | "fragile"
  | "thin"
  | "moderate"
  | "durable"
  | "highly_durable";

export interface QualityResult {
  quality_score: number;
  durability_grade: DurabilityGrade;
  adjustments: QualityAdjustment[];
}

export interface QualityAdjustment {
  factor: string;
  delta: number;
  reason: string;
}

// ─── STRUCTURAL INDICATORS ─────────────────────────────

export type IndicatorLevel = "very_low" | "low" | "moderate" | "high" | "very_high";

export interface StructuralIndicator {
  key: string;
  label: string;
  raw_value: number;
  normalized_value: number;
  level: IndicatorLevel;
}

// ─── CONSTRAINT HIERARCHY ───────────────────────────────

export type ConstraintKey =
  | "weak_forward_visibility"
  | "high_labor_dependence"
  | "high_concentration"
  | "low_persistence"
  | "high_variability"
  | "weak_durability"
  | "shallow_continuity";

export interface ConstraintHierarchy {
  root_constraint: ConstraintKey;
  primary_constraint: ConstraintKey;
  secondary_constraint: ConstraintKey;
  dependent_constraint: ConstraintKey | null;
  hidden_unlock: ConstraintKey | null;
}

// ─── FRAGILITY ──────────────────────────────────────────

export type FragilityClass =
  | "brittle"
  | "thin"
  | "uneven"
  | "supported"
  | "resilient";

export type FailureMode =
  | "concentration_collapse"
  | "labor_interruption"
  | "visibility_gap"
  | "durability_thinness";

export interface FragilityResult {
  fragility_score: number;
  fragility_class: FragilityClass;
  deductions: FragilityDeduction[];
  primary_failure_mode: FailureMode;
  secondary_failure_modes: FailureMode[];
}

export interface FragilityDeduction {
  trigger: string;
  points: number;
  condition_met: boolean;
}

// ─── SENSITIVITY ────────────────────────────────────────

export interface SensitivityResult {
  tests: SensitivityTest[];
  highest_lift_factor: string;
  bottleneck_factor: string;
  low_return_factor: string;
}

export interface SensitivityTest {
  factor: string;
  delta_description: string;
  original_score: number;
  projected_score: number;
  lift: number;
  rank: number;
}

// ─── RISK SCENARIOS ─────────────────────────────────────

export interface RiskScenario {
  scenario_id: string;
  label: string;
  description: string;
  original_score: number;
  scenario_score: number;
  score_drop: number;
  original_band: StabilityBand;
  scenario_band: StabilityBand;
  band_shift: boolean;
  narrative: string;
}

// ─── SCORE LIFT ─────────────────────────────────────────

export interface ScoreLiftProjection {
  lift_scenarios: LiftScenario[];
  combined_top_two: LiftScenario;
  highest_single_lift: LiftScenario;
}

export interface LiftScenario {
  scenario_id: string;
  label: string;
  change_description: string;
  original_score: number;
  projected_score: number;
  lift: number;
  projected_band: StabilityBand;
  band_shift: boolean;
}

// ─── DIAGNOSTIC CONFIDENCE ──────────────────────────────

export type ConfidenceLevel = "high" | "moderate" | "guarded" | "low";

export interface ConfidenceResult {
  confidence_score: number;
  confidence_level: ConfidenceLevel;
  deductions: ConfidenceDeduction[];
}

export interface ConfidenceDeduction {
  reason: string;
  points: number;
}

// ─── EXPLAINABILITY ─────────────────────────────────────

export interface SurprisingInsight {
  headline: string;
  explanation: string;
  data_point: string;
}

export interface TradeoffNarrative {
  action_label: string;
  upside: string;
  downside: string;
  net_recommendation: string;
}

export interface PredictiveWarning {
  headline: string;
  explanation: string;
  timeframe: string;
}

export interface BehavioralInsight {
  pattern: string;
  consequence: string;
  reframe: string;
}

export interface ExecutionRoadmapWeek {
  week: string;
  action: string;
  detail: string;
  success_metric: string;
}

export interface ScriptTemplate {
  id: string;
  title: string;
  context: string;
  script: string;
}

export interface ExplainabilityResult {
  why_this_score: string;
  why_not_higher: string;
  strongest_supports: string[];
  strongest_suppressors: string[];
  interaction_summary: string;
  best_lift_explanation: string;
  fragility_explanation: string;
  surprising_insights: SurprisingInsight[];
  tradeoff_narratives: TradeoffNarrative[];
  one_thing_that_matters: string;
  reusable_framework: string[];
  predictive_warnings: PredictiveWarning[];
  behavioral_insights: BehavioralInsight[];
}

// ─── ACTIONS ────────────────────────────────────────────

export interface RecommendedAction {
  action_id: string;
  priority: number;
  label: string;
  description: string;
  category: string;
  expected_impact: string;
  blocked_until?: string;
  sequencing_note?: string;
  timeframe: string;
  target: string;
  tradeoff: string;
}

export interface AvoidAction {
  action_id: string;
  label: string;
  reason: string;
}

export interface ActionResult {
  recommended_actions: RecommendedAction[];
  avoid_actions: AvoidAction[];
  execution_roadmap: ExecutionRoadmapWeek[];
  script_templates: ScriptTemplate[];
}

// ─── REASSESSMENT ───────────────────────────────────────

export interface ReassessmentTrigger {
  trigger_id: string;
  condition: string;
  threshold: string;
  current_value: string;
  description: string;
}

// ─── BENCHMARKING ───────────────────────────────────────

export interface BenchmarkResult {
  peer_percentile: number;
  cluster_average_score: number;
  top_20_threshold: number;
  peer_band_distribution: {
    limited: number;
    developing: number;
    established: number;
    high: number;
  };
  outlier_dimensions: OutlierDimension[];
}

export interface OutlierDimension {
  factor: string;
  user_value: number;
  peer_average: number;
  direction: "above" | "below";
  magnitude: "slight" | "notable" | "significant";
}

// ─── COMPARATIVE REASSESSMENT ───────────────────────────

export interface ComparisonResult {
  prior_assessment_id: string;
  prior_overall_score: number;
  current_overall_score: number;
  score_delta: number;
  prior_band: StabilityBand;
  current_band: StabilityBand;
  band_changed: boolean;
  factor_deltas: FactorDelta[];
  improvement_narrative: string;
}

export interface FactorDelta {
  factor: string;
  prior_value: number;
  current_value: number;
  delta: number;
  direction: "improved" | "declined" | "unchanged";
}

// ─── INTEGRITY ──────────────────────────────────────────

export interface IntegrityResult {
  input_hash: string;
  output_hash: string;
  manifest_hash: string;
  record_hash: string;
}

export interface ModelManifest {
  model_version: "RP-2.0";
  factor_version: "F-2.0";
  scenario_version: "S-2.0";
  benchmark_version: "B-2.0";
  explanation_version: "E-2.0";
}

// ─── REASON CODES ───────────────────────────────────────

export type ReasonCategory =
  | "validation"
  | "context"
  | "normalization"
  | "scoring"
  | "indicators"
  | "interactions"
  | "quality"
  | "constraints"
  | "fragility"
  | "sensitivity"
  | "scenarios"
  | "lift"
  | "confidence"
  | "explainability"
  | "actions"
  | "reassessment"
  | "benchmarking"
  | "integrity";

export interface ReasonCode {
  code: string;
  category: ReasonCategory;
  severity: "info" | "warning" | "critical";
  message: string;
  details?: string;
}

// ─── FULL ASSESSMENT RECORD ─────────────────────────────

export interface AssessmentRecord {
  assessment_id: string;
  created_at: string;
  model_manifest: ModelManifest;

  raw_inputs: RawDiagnosticInput;
  validated_inputs: RawDiagnosticInput;
  normalized_inputs: CanonicalInput;
  profile_context: ProfileContext;
  resolved_profile: ResolvedProfile;
  extended_inputs: ExtendedInputs | null;

  scores: ScoreBreakdown;
  raw_scores: RawScoreBreakdown;
  bands: BandClassification;

  indicators: StructuralIndicator[];
  interactions: InteractionResult;
  quality: QualityResult;
  constraints: ConstraintHierarchy;
  fragility: FragilityResult;
  sensitivity: SensitivityResult;
  scenarios: RiskScenario[];
  score_lift_projection: ScoreLiftProjection;
  confidence: ConfidenceResult;

  explainability: ExplainabilityResult;
  recommended_actions: RecommendedAction[];
  avoid_actions: AvoidAction[];
  execution_roadmap: ExecutionRoadmapWeek[];
  script_templates: ScriptTemplate[];
  reassessment_triggers: ReassessmentTrigger[];
  benchmarks: BenchmarkResult | null;
  comparison: ComparisonResult | null;

  reason_codes: ReasonCode[];
  integrity: IntegrityResult;

  // Outcome Layer (OL-1.0) — Layer 2 + Layer 3 enrichment
  outcome_layer?: import("./outcome/types").OutcomeLayerResult;
}
