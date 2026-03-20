// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Model RP-2.0 Zod Validation Schemas
// ═══════════════════════════════════════════════════════════════

import { z } from "zod";

// ─── RAW DIAGNOSTIC INPUT ───────────────────────────────

const AnswerChoiceSchema = z.enum(["A", "B", "C", "D", "E"]);

export const RawDiagnosticInputSchema = z.object({
  q1_recurring_revenue_base: AnswerChoiceSchema,
  q2_income_concentration: AnswerChoiceSchema,
  q3_income_source_diversity: AnswerChoiceSchema,
  q4_forward_revenue_visibility: AnswerChoiceSchema,
  q5_earnings_variability: AnswerChoiceSchema,
  q6_income_continuity_without_labor: AnswerChoiceSchema,
}).strict();

// ─── PROFILE CONTEXT ────────────────────────────────────

export const ProfileContextSchema = z.object({
  profile_class: z.enum(["individual", "business_owner", "hybrid"]),
  operating_structure: z.enum([
    "solo_service",
    "small_agency",
    "commissioned_operator",
    "retained_advisor",
    "creator_operator",
    "productized_service",
    "portfolio_operator",
    "asset_supported",
  ]),
  primary_income_model: z.enum([
    "commission",
    "retainer",
    "project_fee",
    "subscription",
    "salary",
    "mixed_services",
    "licensing",
    "rental",
    "ecommerce",
    "digital_products",
    "other",
  ]),
  revenue_structure: z.enum([
    "active_heavy",
    "hybrid",
    "recurring_heavy",
    "asset_heavy",
    "mixed",
  ]),
  industry_sector: z.enum([
    "real_estate",
    "finance_banking",
    "insurance",
    "technology",
    "healthcare",
    "legal_services",
    "consulting_professional_services",
    "sales_brokerage",
    "media_entertainment",
    "construction_trades",
    "retail_ecommerce",
    "hospitality_food_service",
    "transportation_logistics",
    "manufacturing",
    "education",
    "nonprofit_public_sector",
    "agriculture",
    "energy_utilities",
    "other",
  ]),
  maturity_stage: z.enum(["early", "developing", "established"]),
}).strict();

// ─── EXTENDED INPUTS ────────────────────────────────────

const RiskLevelSchema = z.enum(["low", "moderate", "high"]);

export const ExtendedInputsSchema = z.object({
  recurring_contract_term_months_avg: z.number().min(0).max(120).optional(),
  cancellation_risk_level: RiskLevelSchema.optional(),
  platform_dependency_level: RiskLevelSchema.optional(),
  customer_concentration_within_recurring_level: RiskLevelSchema.optional(),
  months_of_visibility: z.number().min(0).max(60).optional(),
  repeat_revenue_pct: z.number().min(0).max(100).optional(),
  asset_backed_income_pct: z.number().min(0).max(100).optional(),
  booked_but_cancelable_pct: z.number().min(0).max(100).optional(),
  historical_assessment_count: z.number().int().min(0).optional(),
}).strict();
