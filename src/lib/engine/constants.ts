// RUNPAYWAY™ Income Stability Score™ Diagnostic System
// Model RP-1.0 | Version 1.0 — Model Constants

import type { CanonicalKey, StabilityBand } from "./types";

// Model identity
export const MODEL_NAME = "Income Stability Score";
export const MODEL_ISSUER = "RunPayway";
export const MODEL_CODE = "RP-1.0";
export const MODEL_DISPLAY_VERSION = "Version 1.0";
export const MODEL_VERSION_FULL = "RP-1.0 | Version 1.0";
export const MANIFEST_ID = "RP1-2026-001";
export const INTERPRETATION_VERSION = "RP1-INT-1.0";
export const APPLICATION_VERSION = "1.0.0";

// Diagnostic structure
export const QUESTION_COUNT = 6;
export const ANSWER_OPTION_COUNT = 5;
export const ASSESSMENT_TIMEFRAME_MONTHS = 12;
export const INCOME_CONTINUITY_TEST_DAYS = 90;
export const MAX_DRIVER_COUNT = 3;

// Answer mapping
export const ANSWER_MAP: Record<string, number> = {
  A: 0,
  B: 25,
  C: 50,
  D: 75,
  E: 100,
};

// Weights
export const STRUCTURE_WEIGHT_PERCENT = 60;
export const STABILITY_WEIGHT_PERCENT = 40;

// Band thresholds
export const BAND_THRESHOLDS: { min: number; max: number; band: StabilityBand }[] = [
  { min: 0, max: 39, band: "Limited Stability" },
  { min: 40, max: 59, band: "Developing Stability" },
  { min: 60, max: 79, band: "Established Stability" },
  { min: 80, max: 100, band: "High Stability" },
];

// Primary Structural Constraint tie-break order
export const CONSTRAINT_TIE_BREAK_ORDER: CanonicalKey[] = [
  "income_continuity_without_active_labor",
  "recurring_income_proportion",
  "forward_revenue_visibility",
  "income_concentration",
  "number_of_income_sources",
  "earnings_variability",
];

// Structural Drivers Supporting Stability tie-break order
export const DRIVER_TIE_BREAK_ORDER: CanonicalKey[] = [
  "recurring_income_proportion",
  "number_of_income_sources",
  "forward_revenue_visibility",
  "income_concentration",
  "earnings_variability",
  "income_continuity_without_active_labor",
];

// Structural Priority mapping
export const STRUCTURAL_PRIORITY_MAP: Record<CanonicalKey, string> = {
  income_continuity_without_active_labor: "Increase Income Persistence",
  recurring_income_proportion: "Expand Recurring Revenue Base",
  forward_revenue_visibility: "Extend Forward Revenue Commitments",
  income_concentration: "Reduce Income Concentration",
  number_of_income_sources: "Increase Qualifying Income Sources",
  earnings_variability: "Reduce Earnings Variability",
};

// Field labels
export const FIELD_LABELS: Record<CanonicalKey, string> = {
  recurring_income_proportion: "Recurring Revenue Base",
  income_concentration: "Income Concentration",
  number_of_income_sources: "Income Source Count",
  forward_revenue_visibility: "Forward Revenue Visibility",
  earnings_variability: "Earnings Variability",
  income_continuity_without_active_labor: "Income Continuity Without Active Labor",
};

// Record and verification constants
export const VERIFICATION_URL = "RunPayway.com/verify";
export const DEFAULT_REGISTRY_STATUS = "Active" as const;
export const DEFAULT_VERIFICATION_STATUS = "valid" as const;

// Delivery constants
export const DELIVERY_METHOD = "secure_link";
export const EMAIL_SUBJECT = "Your RunPayway Income Stability Assessment";

// Serialization constants
export const SERIALIZATION_FORMAT = "canonical JSON";
export const SERIALIZATION_ENCODING = "UTF-8";
export const HASH_ALGORITHM = "SHA-256";

// Canonical enumerations
export const CLASSIFICATIONS = [
  "Individual",
  "Business Entity",
  "Team / Partnership",
] as const;

export const OPERATING_STRUCTURES = [
  "Employee (W-2)",
  "Independent Professional / Contractor",
  "Business Owner / Firm",
  "Partnership",
  "Nonprofit Organization",
] as const;

export const PRIMARY_INCOME_MODELS = [
  "Salary-Based",
  "Commission-Based",
  "Contract-Based",
  "Asset-Based",
  "Mixed Income",
] as const;

export const REVENUE_STRUCTURES = [
  "Primarily Active",
  "Hybrid Active / Recurring",
  "Recurring Revenue",
  "Asset-Derived Revenue",
] as const;

export const INDUSTRY_SECTORS = [
  "Real Estate",
  "Finance / Banking",
  "Insurance",
  "Technology",
  "Healthcare",
  "Legal Services",
  "Consulting / Professional Services",
  "Sales / Brokerage",
  "Media / Entertainment",
  "Construction / Trades",
  "Retail / E-Commerce",
  "Hospitality / Food Service",
  "Transportation / Logistics",
  "Manufacturing",
  "Education",
  "Nonprofit / Public Sector",
  "Agriculture",
  "Energy / Utilities",
  "Other",
] as const;
