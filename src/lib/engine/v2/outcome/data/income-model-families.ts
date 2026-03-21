// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Income Model → Family Mapping (OL-1.0)
// 21 income models → 12 families
// ═══════════════════════════════════════════════════════════════

import type { IncomeModelFamilyId } from "../types";

/** Direct lookup: primary_income_model string → family_id */
export const INCOME_MODEL_TO_FAMILY: Record<string, IncomeModelFamilyId> = {
  // Employment-led
  "Employee Salary": "employment_led",
  "salary": "employment_led",

  // Commission-led
  "Commission-Based": "commission_led",
  "commission": "commission_led",
  "Real Estate Brokerage Income": "commission_led",

  // Contract / Project-led
  "Contract-Based": "contract_project_led",
  "project_fee": "contract_project_led",
  "Independent Contractor": "contract_project_led",
  "Project-Based Work": "contract_project_led",

  // Retainer / Subscription-led
  "Subscription / Retainer Services": "retainer_subscription_led",
  "subscription": "retainer_subscription_led",
  "Consulting / Client Services": "retainer_subscription_led",
  "retainer": "retainer_subscription_led",

  // Practice-led
  "Professional Practice": "practice_led",

  // Agency-led
  "Agency / Brokerage Income": "agency_led",
  "Team / Partnership Income": "agency_led",

  // Product-led
  "Product Sales": "product_led",
  "ecommerce": "product_led",
  "Digital Product Sales": "product_led",
  "digital_products": "product_led",
  "Franchise Ownership": "product_led",

  // Creator / Audience-led
  "Creator / Media Income": "creator_audience_led",

  // Referral / Affiliate-led
  "Affiliate / Referral Income": "referral_affiliate_led",

  // Asset / Rental-led
  "Real Estate Rental Income": "asset_rental_led",
  "rental": "asset_rental_led",

  // Investment-led
  "Investment / Dividend Income": "investment_led",
  "Licensing / Royalty Income": "investment_led",
  "licensing": "investment_led",

  // Hybrid / Multi-source
  "Hybrid Multiple Income Sources": "hybrid_multi",
  "Business Ownership": "hybrid_multi",
  "mixed_services": "hybrid_multi",
  "other": "hybrid_multi",
};

/** Default family when no match found */
export const DEFAULT_FAMILY: IncomeModelFamilyId = "hybrid_multi";

/** Resolve income model to family */
export function resolveFamily(primaryIncomeModel: string): IncomeModelFamilyId {
  return INCOME_MODEL_TO_FAMILY[primaryIncomeModel] ?? DEFAULT_FAMILY;
}
