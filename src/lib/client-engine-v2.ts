// RUNPAYWAY™ — Client-Side Engine V2 for Static Export
// Runs the same deterministic RP-2.0 scoring logic in the browser
// when the server API is unavailable.

import type {
  RawDiagnosticInput,
  ProfileContext,
  ExtendedInputs,
  CanonicalInput,
  AssessmentRecord,
  ReasonCode,
  AnswerChoice,
} from "./engine/v2/types";

import { validateInputs, validateProfile, validateExtendedInputs } from "./engine/v2/engines/01-input-validation";
import { resolveProfileContext } from "./engine/v2/engines/02-profile-context";
import { normalizeInputs } from "./engine/v2/engines/03-income-normalization";
import { computeRawScores } from "./engine/v2/engines/04-scoring";
import { classifyBand, getBand } from "./engine/v2/engines/05-band-classification";
import { computeIndicators } from "./engine/v2/engines/06-structural-indicators";
import { computeInteractions, applyInteractions } from "./engine/v2/engines/07-cross-factor-dependency";
import { computeQuality } from "./engine/v2/engines/08-income-quality";
import { computeConstraints } from "./engine/v2/engines/09-constraint-hierarchy";
import { computeFragility } from "./engine/v2/engines/10-fragility";
import { computeSensitivity } from "./engine/v2/engines/11-sensitivity";
import { computeRiskScenarios } from "./engine/v2/engines/12-risk-scenarios";
import { computeScoreLift } from "./engine/v2/engines/13-score-lift";
import { computeConfidence } from "./engine/v2/engines/14-diagnostic-confidence";
import { generateExplainability } from "./engine/v2/engines/15-explainability";
import { prioritizeActions } from "./engine/v2/engines/16-action-prioritization";
import { computeReassessmentTriggers } from "./engine/v2/engines/17-reassessment-triggers";
import { computeBenchmarks } from "./engine/v2/engines/18-benchmarking";
import { REASON_CODES } from "./engine/v2/reason-codes";
import {
  MODEL_VERSION,
  FACTOR_VERSION,
  SCENARIO_VERSION,
  BENCHMARK_VERSION,
  EXPLANATION_VERSION,
} from "./engine/v2/constants";

// ─── Browser-compatible SHA-256 ─────────────────────────

async function sha256(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function sortKeys(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.keys(obj)
    .sort()
    .reduce(
      (sorted, key) => {
        sorted[key] = obj[key];
        return sorted;
      },
      {} as Record<string, unknown>,
    );
}

// ─── Score computation helper ───────────────────────────

function computeOverallScore(
  n: CanonicalInput,
  ext: ExtendedInputs | null,
): number {
  const rawScores = computeRawScores(n);
  const quality = computeQuality(n, ext);
  const interactions = computeInteractions(n, ext);
  const scores = applyInteractions(rawScores, interactions, quality.quality_score, 0);
  return scores.overall_score;
}

function computeScoreSimple(n: CanonicalInput): number {
  return computeOverallScore(n, null);
}

// ─── V1 → V2 Input Adapter ─────────────────────────────

const V1_ANSWER_MAP: Record<number, AnswerChoice> = {
  0: "A",
  25: "B",
  50: "C",
  75: "D",
  100: "E",
};

/**
 * Convert V1-style inputs (field names + numeric values 0/25/50/75/100)
 * to V2 RawDiagnosticInput (answer choices A-E).
 */
export function convertV1InputsToV2(inputs: Record<string, number>): RawDiagnosticInput {
  return {
    q1_recurring_revenue_base: V1_ANSWER_MAP[inputs.recurring_income_proportion] ?? "A",
    q2_income_concentration: V1_ANSWER_MAP[inputs.income_concentration] ?? "A",
    q3_income_source_diversity: V1_ANSWER_MAP[inputs.number_of_income_sources] ?? "A",
    q4_forward_revenue_visibility: V1_ANSWER_MAP[inputs.forward_revenue_visibility] ?? "A",
    q5_earnings_variability: V1_ANSWER_MAP[inputs.earnings_variability] ?? "A",
    q6_income_continuity_without_labor: V1_ANSWER_MAP[inputs.income_continuity_without_active_labor] ?? "A",
  };
}

/**
 * Convert V1-style profile fields to V2 ProfileContext.
 */
export function convertV1ProfileToV2(profile: Record<string, unknown>): ProfileContext {
  // Map V1 classification → V2 profile_class
  const classMap: Record<string, string> = {
    "Individual": "individual",
    "Business Entity": "business_owner",
    "Team / Partnership": "hybrid",
  };

  // Map V1 operating_structure → V2 operating_structure
  const structureMap: Record<string, string> = {
    "Employee (W-2)": "solo_service",
    "Independent Contractor": "solo_service",
    "Business Owner / Firm": "small_agency",
    "Partnership": "small_agency",
    "Nonprofit Organization": "small_agency",
  };

  // Map V1 primary_income_model → V2
  const modelMap: Record<string, string> = {
    "Employee Salary": "salary",
    "Commission-Based": "commission",
    "Contract-Based": "project_fee",
    "Independent Contractor": "project_fee",
    "Team / Partnership Income": "mixed_services",
    "Business Ownership": "mixed_services",
    "Professional Practice": "mixed_services",
    "Consulting / Client Services": "retainer",
    "Agency / Brokerage Income": "commission",
    "Project-Based Work": "project_fee",
    "Subscription / Retainer Services": "subscription",
    "Licensing / Royalty Income": "licensing",
    "Product Sales": "ecommerce",
    "Digital Product Sales": "digital_products",
    "Creator / Media Income": "digital_products",
    "Affiliate / Referral Income": "commission",
    "Real Estate Rental Income": "rental",
    "Real Estate Brokerage Income": "commission",
    "Franchise Ownership": "mixed_services",
    "Investment / Dividend Income": "licensing",
    "Hybrid Multiple Income Sources": "mixed_services",
  };

  // Map V1 revenue_structure → V2
  const revenueMap: Record<string, string> = {
    "Mostly One-Time Payments": "active_heavy",
    "Repeat Clients / Returning Customers": "hybrid",
    "Monthly Recurring Payments": "recurring_heavy",
    "Contracted Multi-Month Revenue": "recurring_heavy",
    "Long-Term Recurring Income": "asset_heavy",
    "Mixed Revenue Structure": "mixed",
  };

  // Map V1 industry_sector → V2
  const sectorMap: Record<string, string> = {
    "Real Estate": "real_estate",
    "Finance / Banking": "finance_banking",
    "Insurance": "insurance",
    "Technology": "technology",
    "Healthcare": "healthcare",
    "Legal Services": "legal_services",
    "Consulting / Professional Services": "consulting_professional_services",
    "Sales / Brokerage": "sales_brokerage",
    "Media / Entertainment": "media_entertainment",
    "Construction / Trades": "construction_trades",
    "Retail / E-Commerce": "retail_ecommerce",
    "Hospitality / Food Service": "hospitality_food_service",
    "Transportation / Logistics": "transportation_logistics",
    "Manufacturing": "manufacturing",
    "Education": "education",
    "Nonprofit / Public Sector": "nonprofit_public_sector",
    "Agriculture": "agriculture",
    "Energy / Utilities": "energy_utilities",
    "Other": "other",
  };

  const classification = String(profile.classification ?? "Individual");
  const operating_structure = String(profile.operating_structure ?? "Employee (W-2)");
  const primary_income_model = String(profile.primary_income_model ?? "Employee Salary");
  const revenue_structure = String(profile.revenue_structure ?? "Mixed Revenue Structure");
  const industry_sector = String(profile.industry_sector ?? "Other");

  return {
    profile_class: (classMap[classification] ?? "individual") as ProfileContext["profile_class"],
    operating_structure: (structureMap[operating_structure] ?? "solo_service") as ProfileContext["operating_structure"],
    primary_income_model: (modelMap[primary_income_model] ?? "other") as ProfileContext["primary_income_model"],
    revenue_structure: (revenueMap[revenue_structure] ?? "mixed") as ProfileContext["revenue_structure"],
    industry_sector: (sectorMap[industry_sector] ?? "other") as ProfileContext["industry_sector"],
    maturity_stage: "developing", // Default — not collected in V1 intake
  };
}

// ─── Main Client Engine ─────────────────────────────────

export async function executeClientEngineV2(submission: {
  profile: Record<string, unknown>;
  inputs: Record<string, number>;
}): Promise<AssessmentRecord> {
  const reason_codes: ReasonCode[] = [];

  // Convert V1 format to V2
  const rawInputs = convertV1InputsToV2(submission.inputs);
  const profileContext = convertV1ProfileToV2(submission.profile);

  // Validate
  const validated = validateInputs(rawInputs);
  const validatedProfile = validateProfile(profileContext);
  const validatedExtended: ExtendedInputs | null = null;
  reason_codes.push(REASON_CODES["VAL-003"]);

  // Resolve profile
  const resolvedProfile = resolveProfileContext(validatedProfile);
  reason_codes.push(REASON_CODES["CTX-001"]);

  // Normalize
  const normalized = normalizeInputs(validated);
  reason_codes.push(REASON_CODES["NRM-001"]);

  // Score
  const rawScores = computeRawScores(normalized);
  reason_codes.push(REASON_CODES["SCR-001"]);

  // Quality
  const quality = computeQuality(normalized, validatedExtended);
  reason_codes.push(REASON_CODES["QAL-002"]);

  // Interactions
  const interactions = computeInteractions(normalized, validatedExtended);
  if (interactions.effects.length === 0) {
    reason_codes.push(REASON_CODES["INT-001"]);
  } else {
    if (interactions.total_penalty < 0) reason_codes.push(REASON_CODES["INT-002"]);
    if (interactions.total_bonus > 0) reason_codes.push(REASON_CODES["INT-003"]);
  }

  // Fragility
  const fragility = computeFragility(normalized, quality, rawScores.continuity_months);
  reason_codes.push(REASON_CODES["FRG-001"]);

  // Final scores
  const scores = applyInteractions(rawScores, interactions, quality.quality_score, fragility.fragility_score);
  reason_codes.push(REASON_CODES["SCR-002"]);
  reason_codes.push(REASON_CODES["SCR-003"]);

  // Band
  const bands = classifyBand(scores.overall_score, normalized, fragility.fragility_score);

  // Indicators
  const indicators = computeIndicators(normalized);
  reason_codes.push(REASON_CODES["IND-001"]);

  // Constraints
  const constraints = computeConstraints(normalized, rawScores, interactions, quality);
  reason_codes.push(REASON_CODES["CON-001"]);

  // Sensitivity
  const sensitivity = computeSensitivity(
    normalized,
    validatedExtended,
    scores.overall_score,
    (modified, ext) => computeOverallScore(modified, ext),
  );
  reason_codes.push(REASON_CODES["SEN-001"]);

  // Risk scenarios
  const scenarios = computeRiskScenarios(
    normalized,
    scores.overall_score,
    bands.primary_band,
    computeScoreSimple,
  );
  reason_codes.push(REASON_CODES["SCN-001"]);

  // Score lift
  const scoreLift = computeScoreLift(
    normalized,
    validatedExtended,
    scores.overall_score,
    bands.primary_band,
    computeScoreSimple,
  );
  reason_codes.push(REASON_CODES["LFT-001"]);

  // Confidence
  const confidence = computeConfidence(normalized, validatedExtended, resolvedProfile, sensitivity);
  reason_codes.push(REASON_CODES["CNF-001"]);

  // Explainability
  const explainability = generateExplainability(
    scores, bands, constraints, interactions, sensitivity, fragility, quality,
  );
  reason_codes.push(REASON_CODES["EXP-001"]);

  // Actions
  const actions = prioritizeActions(constraints, fragility, sensitivity, resolvedProfile);
  reason_codes.push(REASON_CODES["ACT-001"]);

  // Reassessment triggers
  const reassessmentTriggers = computeReassessmentTriggers(normalized, quality);
  reason_codes.push(REASON_CODES["RSA-001"]);

  // Benchmarks
  const benchmarks = computeBenchmarks(scores, resolvedProfile, indicators);
  reason_codes.push(REASON_CODES["BNK-001"]);

  // Outcome layer (industry + family personalization)
  let outcome_layer = null;
  try {
    const { executeOutcomeLayer } = await import("./engine/v2/outcome/index");
    const coreRecord = {
      profile_context: validatedProfile,
      fragility: { fragility_class: fragility.fragility_class },
    };
    outcome_layer = executeOutcomeLayer(coreRecord as Parameters<typeof executeOutcomeLayer>[0]);
  } catch {
    // Outcome layer failed — continue without it
  }

  // Integrity (browser-compatible hashes)
  const assessmentId = crypto.randomUUID();
  const input_hash = await sha256(JSON.stringify(sortKeys(normalized as unknown as Record<string, unknown>)));
  const output_hash = await sha256(
    JSON.stringify(sortKeys({
      overall_score: scores.overall_score,
      structure_score: scores.structure_score,
      stability_score: scores.stability_score,
      fragility_score: scores.fragility_score,
    })),
  );
  const manifest_hash = await sha256(
    JSON.stringify({
      model_version: MODEL_VERSION,
      factor_version: FACTOR_VERSION,
      scenario_version: SCENARIO_VERSION,
      benchmark_version: BENCHMARK_VERSION,
      explanation_version: EXPLANATION_VERSION,
    }),
  );
  const record_hash = await sha256(input_hash + output_hash + manifest_hash + assessmentId);

  return {
    assessment_id: assessmentId,
    created_at: new Date().toISOString(),
    model_manifest: {
      model_version: MODEL_VERSION as "RP-2.0",
      factor_version: FACTOR_VERSION as "F-2.0",
      scenario_version: SCENARIO_VERSION as "S-2.0",
      benchmark_version: BENCHMARK_VERSION as "B-2.0",
      explanation_version: EXPLANATION_VERSION as "E-2.0",
    },

    raw_inputs: validated,
    validated_inputs: validated,
    normalized_inputs: normalized,
    profile_context: validatedProfile,
    resolved_profile: resolvedProfile,
    extended_inputs: validatedExtended,

    scores,
    raw_scores: rawScores,
    bands,

    indicators,
    interactions,
    quality,
    constraints,
    fragility,
    sensitivity,
    scenarios,
    score_lift_projection: scoreLift,
    confidence,

    explainability,
    recommended_actions: actions.recommended_actions,
    avoid_actions: actions.avoid_actions,
    reassessment_triggers: reassessmentTriggers,
    benchmarks,
    comparison: null,
    outcome_layer,

    reason_codes,
    integrity: { input_hash, output_hash, manifest_hash, record_hash },
  };
}
