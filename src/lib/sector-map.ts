/**
 * Shared sector/industry mapping used by the dashboard and vocabulary system.
 */

export const SECTOR_MAP: Record<string, string> = {
  "Real Estate": "real_estate",
  "Finance / Banking": "finance_banking",
  "Insurance": "insurance",
  "Technology": "technology",
  "Healthcare": "healthcare",
  "Legal Services": "legal_services",
  "Consulting / Professional Services": "consulting_professional_services",
  "Sales / Brokerage": "sales_brokerage",
  "Media / Entertainment": "creative_media",
  "Construction / Trades": "construction_trades",
  "Retail / E-Commerce": "retail_ecommerce",
  "Hospitality / Food Service": "hospitality",
  "Transportation / Logistics": "transportation",
  "Manufacturing": "manufacturing",
  "Education": "education_training",
  "Nonprofit / Public Sector": "nonprofit",
  "Agriculture": "agriculture",
  "Energy / Utilities": "energy",
  "Other": "default",
  // Also match already-normalized keys
  "real_estate": "real_estate",
  "finance_banking": "finance_banking",
  "insurance": "insurance",
  "technology": "technology",
  "healthcare": "healthcare",
  "legal_services": "legal_services",
  "consulting_professional_services": "consulting_professional_services",
  "consulting": "consulting_professional_services",
  "sales_brokerage": "sales_brokerage",
  "creative_media": "creative_media",
  "construction_trades": "construction_trades",
  "education_training": "education_training",
  "fitness_wellness": "fitness_wellness",
  "retail_ecommerce": "retail_ecommerce",
  "hospitality": "hospitality",
  "transportation": "transportation",
  "manufacturing": "manufacturing",
  "nonprofit": "nonprofit",
  "agriculture": "agriculture",
  "energy": "energy",
};

export function normSector(raw: string): string {
  const match = SECTOR_MAP[raw] || SECTOR_MAP[raw.toLowerCase()];
  return match || "default";
}

export function formatIndustry(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}
