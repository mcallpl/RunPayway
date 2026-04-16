/**
 * Maps the advisor dashboard's display-name industries to the engine's IndustrySector type.
 * The dashboard uses a broader set of names than the consumer diagnostic flow.
 */

import type { IndustrySector } from "@/lib/engine/v2/types";

const INDUSTRY_TO_SECTOR: Record<string, IndustrySector> = {
  "Real Estate":               "real_estate",
  "Professional Services":     "consulting_professional_services",
  "Agency / Client Services":  "consulting_professional_services",
  "Private Practice / Coaching": "consulting_professional_services",
  "Creator / Media":           "media_entertainment",
  "E-commerce / Product":      "retail_ecommerce",
  "Investing / Asset Income":  "finance_banking",
  "Sales / Brokerage":         "sales_brokerage",
  "Technology":                "technology",
  "Finance / Banking":         "finance_banking",
  "Insurance":                 "insurance",
  "Healthcare":                "healthcare",
  "Legal Services":            "legal_services",
  "Construction / Trades":     "construction_trades",
  "Hospitality / Food Service": "hospitality_food_service",
  "Transportation / Logistics": "transportation_logistics",
  "Manufacturing":             "manufacturing",
  "Education":                 "education",
  "Nonprofit / Public Sector": "nonprofit_public_sector",
  "Agriculture":               "agriculture",
  "Energy / Utilities":        "energy_utilities",
};

export function mapIndustryToSector(displayName: string): IndustrySector {
  return INDUSTRY_TO_SECTOR[displayName] || "other";
}
