// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Outcome Layer Types (OL-1.0)
// Layer 2: Income-Model Outcomes | Layer 3: Industry Refinement
// ═══════════════════════════════════════════════════════════════

// ─── Intake Signal Types ────────────────────────────────

export type ContinuitySignal = "weak" | "moderate" | "strong";
export type ForwardSignal = "weak" | "moderate" | "strong";
export type RenewalDepth = "none" | "moderate" | "strong";

export type ConcentrationType = "client" | "employer" | "channel" | "platform" | "product" | "asset" | "mixed";
export type ReplacementDifficulty = "low" | "moderate" | "high";
export type ControlLevel = "very_low" | "low" | "moderate" | "high";

export type SensitivityLevel = "low" | "moderate" | "high";

export type ForwardQuality = "none" | "moderate" | "strong";
export type CancellationRisk = "low" | "moderate" | "high";
export type VisibilityHorizon = "none" | "short" | "medium" | "long";

export interface IntakeSignals {
  continuity_signal: ContinuitySignal;
  forward_signal: ForwardSignal;
  renewal_depth: RenewalDepth;
  concentration_type: ConcentrationType;
  replacement_difficulty: ReplacementDifficulty;
  control_level: ControlLevel;
  labor_sensitivity: SensitivityLevel;
  pipeline_sensitivity: SensitivityLevel;
  external_sensitivity: SensitivityLevel;
  forward_quality: ForwardQuality;
  cancellation_risk: CancellationRisk;
  visibility_horizon: VisibilityHorizon;
}

// ─── Raw Intake Field Values ────────────────────────────

export type PrimaryRevenuePattern =
  | "one_time_project"
  | "commission_event"
  | "retainer_contract"
  | "subscription_membership"
  | "repeat_customer"
  | "licensing_royalty"
  | "rental_asset"
  | "mixed_pattern";

export type LargestSourceType =
  | "single_client"
  | "employer"
  | "referral_channel"
  | "platform_marketplace"
  | "top_product_line"
  | "top_asset"
  | "mixed_sources";

export type PrimaryWeaknessPattern =
  | "stop_working"
  | "pipeline_slows"
  | "source_leaves"
  | "platform_drops"
  | "bookings_decline"
  | "seasonal_cycle"
  | "mixed_causes";

export type ForwardSecurityMethod =
  | "signed_contracts"
  | "retainers"
  | "subscriptions"
  | "booked_appointments"
  | "scheduled_deals"
  | "repeat_customer_base"
  | "lease_agreements"
  | "not_secured";

export interface RawIntakeFields {
  primary_revenue_pattern?: PrimaryRevenuePattern;
  largest_source_type?: LargestSourceType;
  primary_weakness_pattern?: PrimaryWeaknessPattern;
  forward_security_method?: ForwardSecurityMethod;
}

// ─── Income Model Family Types ──────────────────────────

export type IncomeModelFamilyId =
  | "employment_led"
  | "commission_led"
  | "contract_project_led"
  | "retainer_subscription_led"
  | "practice_led"
  | "agency_led"
  | "product_led"
  | "creator_audience_led"
  | "referral_affiliate_led"
  | "asset_rental_led"
  | "investment_led"
  | "hybrid_multi";

export interface IncomeModelFamily {
  family_id: IncomeModelFamilyId;
  family_label: string;
  income_models: string[];
  common_weak_points: string[];
  supportive_patterns: string[];
  primary_risk_scenarios: string[];
  stronger_structure_signals: string[];
  default_action_priorities: ActionItem[];
  default_avoid_priorities: string[];
  reassessment_trigger_templates: TriggerTemplate[];
  explanation_translation_map: Record<string, string>;
  benchmark_cluster_key: string;
}

export interface ActionItem {
  action_id: string;
  label: string;
  description: string;
  why_now?: string;
  expected_effect?: string;
  blocked_until?: string;
}

export interface TriggerTemplate {
  trigger_id: string;
  condition: string;
  display_text: string;
}

// ─── Scenario Types ─────────────────────────────────────

export type ScenarioSeverity = "critical" | "high" | "moderate";

export interface DeterministicScenario {
  scenario_id: string;
  label: string;
  applicable_families: IncomeModelFamilyId[];
  applicable_industries: string[];
  description: string;
  why_it_matters: string;
  severity: ScenarioSeverity;
}

export interface SelectedScenario {
  scenario_id: string;
  label: string;
  description: string;
  severity: ScenarioSeverity;
  why_it_matters: string;
}

// ─── Stronger Structure Pattern Types ───────────────────

export interface StrongerStructurePattern {
  pattern_id: string;
  family: IncomeModelFamilyId;
  industry_override?: string;
  display_text: string;
  explanation_text: string;
}

// ─── Industry Profile Types ─────────────────────────────

export interface IndustryProfile {
  industry_id: string;
  industry_label: string;
  applicable_income_models: string[];
  scenario_emphasis: string[];
  stronger_structure_overrides: string[];
  action_priority_overrides: ActionItem[];
  reassessment_trigger_overrides: TriggerTemplate[];
  explanation_language_overrides: Record<string, string>;
  benchmark_framing: {
    framing_text: string;
    peer_group_label: string;
  };
}

// ─── Outcome Layer Result ───────────────────────────────

export interface OutcomeLayerResult {
  income_model_family: {
    family_id: IncomeModelFamilyId;
    family_label: string;
  };
  industry_refinement_profile: {
    industry_id: string;
    industry_label: string;
  } | null;
  selected_scenarios: SelectedScenario[];
  stronger_structure_patterns: string[];
  ranked_action_map: {
    rank: number;
    action_id: string;
    label: string;
    description: string;
    why_now: string;
    expected_effect: string;
  }[];
  avoid_actions: string[];
  reassessment_trigger_set: TriggerTemplate[];
  explanation_translation_layer: Record<string, string>;
  benchmark_context_layer: {
    framing_text: string;
    peer_group_label: string;
  } | null;
}
