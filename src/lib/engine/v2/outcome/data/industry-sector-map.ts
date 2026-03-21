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
  // Direct matches
  real_estate: "real_estate",
  consulting_professional_services: "consulting_professional_services",
  sales_brokerage: "sales_brokerage",

  // Mapped matches
  legal_services: "consulting_professional_services",
  healthcare: "private_practice_coaching",
  education: "private_practice_coaching",
  media_entertainment: "creator_media",
  retail_ecommerce: "ecommerce_product",
  finance_banking: "investing_asset",
  insurance: "sales_brokerage",

  // No specific profile — returns null (uses family defaults)
  // technology, construction_trades, hospitality_food_service,
  // transportation_logistics, manufacturing, nonprofit_public_sector,
  // agriculture, energy_utilities, other
};

/**
 * Resolve a standard industry sector to an industry profile ID.
 * Returns null if no specific industry profile exists.
 */
export function resolveIndustryProfileId(industrySector: string): string | null {
  return SECTOR_TO_INDUSTRY_PROFILE[industrySector] ?? null;
}
