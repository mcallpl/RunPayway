// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Intake Signal Normalization Engine (OL-1.0)
// Converts raw intake fields into deterministic signal objects
// ═══════════════════════════════════════════════════════════════

import type {
  RawIntakeFields,
  IntakeSignals,
  PrimaryRevenuePattern,
  LargestSourceType,
  PrimaryWeaknessPattern,
  ForwardSecurityMethod,
} from "../types";

// ─── Revenue Pattern → Signals ──────────────────────────

const REVENUE_PATTERN_MAP: Record<PrimaryRevenuePattern, Pick<IntakeSignals, "continuity_signal" | "forward_signal" | "renewal_depth">> = {
  one_time_project:       { continuity_signal: "weak",     forward_signal: "weak",     renewal_depth: "none" },
  commission_event:       { continuity_signal: "weak",     forward_signal: "weak",     renewal_depth: "none" },
  retainer_contract:      { continuity_signal: "moderate", forward_signal: "strong",   renewal_depth: "moderate" },
  subscription_membership: { continuity_signal: "strong",  forward_signal: "strong",   renewal_depth: "strong" },
  repeat_customer:        { continuity_signal: "moderate", forward_signal: "moderate", renewal_depth: "moderate" },
  licensing_royalty:       { continuity_signal: "strong",   forward_signal: "moderate", renewal_depth: "strong" },
  rental_asset:           { continuity_signal: "strong",   forward_signal: "strong",   renewal_depth: "strong" },
  mixed_pattern:          { continuity_signal: "moderate", forward_signal: "moderate", renewal_depth: "moderate" },
};

// ─── Largest Source Type → Signals ──────────────────────

const SOURCE_TYPE_MAP: Record<LargestSourceType, Pick<IntakeSignals, "concentration_type" | "replacement_difficulty" | "control_level">> = {
  single_client:        { concentration_type: "client",   replacement_difficulty: "high",     control_level: "low" },
  employer:             { concentration_type: "employer", replacement_difficulty: "high",     control_level: "low" },
  referral_channel:     { concentration_type: "channel",  replacement_difficulty: "moderate", control_level: "low" },
  platform_marketplace: { concentration_type: "platform", replacement_difficulty: "moderate", control_level: "very_low" },
  top_product_line:     { concentration_type: "product",  replacement_difficulty: "moderate", control_level: "high" },
  top_asset:            { concentration_type: "asset",    replacement_difficulty: "low",      control_level: "high" },
  mixed_sources:        { concentration_type: "mixed",    replacement_difficulty: "moderate", control_level: "moderate" },
};

// ─── Weakness Pattern → Signals ─────────────────────────

const WEAKNESS_MAP: Record<PrimaryWeaknessPattern, Pick<IntakeSignals, "labor_sensitivity" | "pipeline_sensitivity" | "external_sensitivity">> = {
  stop_working:     { labor_sensitivity: "high",     pipeline_sensitivity: "low",      external_sensitivity: "low" },
  pipeline_slows:   { labor_sensitivity: "moderate", pipeline_sensitivity: "high",     external_sensitivity: "low" },
  source_leaves:    { labor_sensitivity: "low",      pipeline_sensitivity: "low",      external_sensitivity: "high" },
  platform_drops:   { labor_sensitivity: "low",      pipeline_sensitivity: "moderate", external_sensitivity: "high" },
  bookings_decline: { labor_sensitivity: "moderate", pipeline_sensitivity: "high",     external_sensitivity: "moderate" },
  seasonal_cycle:   { labor_sensitivity: "moderate", pipeline_sensitivity: "moderate", external_sensitivity: "moderate" },
  mixed_causes:     { labor_sensitivity: "moderate", pipeline_sensitivity: "moderate", external_sensitivity: "moderate" },
};

// ─── Forward Security Method → Signals ──────────────────

const FORWARD_MAP: Record<ForwardSecurityMethod, Pick<IntakeSignals, "forward_quality" | "cancellation_risk" | "visibility_horizon">> = {
  signed_contracts:     { forward_quality: "strong",   cancellation_risk: "low",      visibility_horizon: "long" },
  retainers:            { forward_quality: "strong",   cancellation_risk: "moderate", visibility_horizon: "medium" },
  subscriptions:        { forward_quality: "strong",   cancellation_risk: "moderate", visibility_horizon: "medium" },
  booked_appointments:  { forward_quality: "moderate", cancellation_risk: "moderate", visibility_horizon: "short" },
  scheduled_deals:      { forward_quality: "moderate", cancellation_risk: "moderate", visibility_horizon: "short" },
  repeat_customer_base: { forward_quality: "moderate", cancellation_risk: "high",     visibility_horizon: "short" },
  lease_agreements:     { forward_quality: "strong",   cancellation_risk: "low",      visibility_horizon: "long" },
  not_secured:          { forward_quality: "none",     cancellation_risk: "high",     visibility_horizon: "none" },
};

// ─── Defaults ───────────────────────────────────────────

const DEFAULT_SIGNALS: IntakeSignals = {
  continuity_signal: "moderate",
  forward_signal: "moderate",
  renewal_depth: "moderate",
  concentration_type: "mixed",
  replacement_difficulty: "moderate",
  control_level: "moderate",
  labor_sensitivity: "moderate",
  pipeline_sensitivity: "moderate",
  external_sensitivity: "moderate",
  forward_quality: "moderate",
  cancellation_risk: "moderate",
  visibility_horizon: "short",
};

// ─── Normalization Function ─────────────────────────────

export function normalizeIntakeSignals(raw: RawIntakeFields | null | undefined): IntakeSignals {
  if (!raw) return DEFAULT_SIGNALS;

  const revenueSignals = raw.primary_revenue_pattern
    ? REVENUE_PATTERN_MAP[raw.primary_revenue_pattern]
    : {};

  const sourceSignals = raw.largest_source_type
    ? SOURCE_TYPE_MAP[raw.largest_source_type]
    : {};

  const weaknessSignals = raw.primary_weakness_pattern
    ? WEAKNESS_MAP[raw.primary_weakness_pattern]
    : {};

  const forwardSignals = raw.forward_security_method
    ? FORWARD_MAP[raw.forward_security_method]
    : {};

  return {
    ...DEFAULT_SIGNALS,
    ...revenueSignals,
    ...sourceSignals,
    ...weaknessSignals,
    ...forwardSignals,
  };
}
