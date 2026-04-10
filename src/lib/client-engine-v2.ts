// RUNPAYWAY™ — V1-to-V2 Input Converters (lightweight)
// All scoring logic has been moved to the Cloudflare Worker.
// Only the input format conversion functions remain for the v1 API route.

const V1_ANSWER_MAP: Record<number, string> = {
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
export function convertV1InputsToV2(inputs: Record<string, number>) {
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
export function convertV1ProfileToV2(profile: Record<string, unknown>) {
  const classMap: Record<string, string> = {
    "Individual": "individual",
    "Business Entity": "business_owner",
    "Team / Partnership": "hybrid",
  };

  const structureMap: Record<string, string> = {
    "Employee (W-2)": "solo_service",
    "Independent Contractor": "solo_service",
    "Business Owner / Firm": "small_agency",
    "Partnership": "small_agency",
    "Nonprofit Organization": "small_agency",
  };

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

  const revenueMap: Record<string, string> = {
    "Mostly One-Time Payments": "active_heavy",
    "Repeat Clients / Returning Customers": "hybrid",
    "Monthly Recurring Payments": "recurring_heavy",
    "Contracted Multi-Month Revenue": "recurring_heavy",
    "Long-Term Recurring Income": "asset_heavy",
    "Mixed Revenue Structure": "mixed",
  };

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
    profile_class: classMap[classification] ?? "individual",
    operating_structure: structureMap[operating_structure] ?? "solo_service",
    primary_income_model: modelMap[primary_income_model] ?? "other",
    revenue_structure: revenueMap[revenue_structure] ?? "mixed",
    industry_sector: sectorMap[industry_sector] ?? "other",
    maturity_stage: "developing",
  };
}
