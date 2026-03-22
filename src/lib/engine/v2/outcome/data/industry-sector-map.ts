// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Industry Sector → Profile Mapping (OL-1.0)
// Maps standard IndustrySector enum values to industry profile IDs
// ═══════════════════════════════════════════════════════════════

/**
 * Maps the standard industry_sector values (from Zod schema / ProfileContext)
 * to the outcome layer industry profile IDs.
 * Multiple sectors can map to the same industry profile.
 */
export const SECTOR_TO_INDUSTRY_PROFILE: Record<string, string> = {
  // Direct matches — each sector has its own dedicated profile
  real_estate: "real_estate",
  consulting_professional_services: "consulting_professional_services",
  sales_brokerage: "sales_brokerage",
  technology: "technology",
  finance_banking: "finance_banking",
  insurance: "insurance",
  healthcare: "healthcare",
  legal_services: "legal_services",
  construction_trades: "construction_trades",
  hospitality_food_service: "hospitality_food_service",
  transportation_logistics: "transportation_logistics",
  manufacturing: "manufacturing",
  education: "education",
  nonprofit_public_sector: "nonprofit_public_sector",
  agriculture: "agriculture",
  energy_utilities: "energy_utilities",

  // Mapped matches — sectors that share a profile
  media_entertainment: "creator_media",
  retail_ecommerce: "ecommerce_product",

  // "other" — returns null (uses family defaults only)
};

/**
 * Resolve a standard industry sector to an industry profile ID.
 * Returns null if no specific industry profile exists.
 */
export function resolveIndustryProfileId(industrySector: string): string | null {
  return SECTOR_TO_INDUSTRY_PROFILE[industrySector] ?? null;
}
