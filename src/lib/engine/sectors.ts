// sectors.ts — Sector-specific data for the RunPayway Refined Diagnostic System
// Model RP-1.0 | 19 industry sectors

export interface SectorData {
  evolution_path_key: string;
  evolution_path_title: string;
  evolution_path_steps: string[];
  sector_stability_mechanisms: string[];
  peer_benchmark_group_key: string;
  peer_benchmark_group_label: string;
  peer_benchmark_text: string;
  sector_improvement_disclaimer_text: string;
}

export const SECTOR_IMPROVEMENT_DISCLAIMER =
  "These examples illustrate structural patterns within the sector and do not constitute financial, legal, or investment advice.";

export const SECTOR_DATA: Record<string, SectorData> = {
  real_estate: {
    evolution_path_key: "real_estate",
    evolution_path_title: "Real Estate Income Evolution",
    evolution_path_steps: [
      "Commission Transactions",
      "Client Portfolio",
      "Team Brokerage",
      "Property Ownership",
      "Recurring Asset Income",
    ],
    sector_stability_mechanisms: [
      "property management income",
      "leasing revenue",
      "real estate investment holdings",
      "brokerage team structures",
      "real estate education programs",
    ],
    peer_benchmark_group_key: "real_estate",
    peer_benchmark_group_label: "Real Estate Professionals",
    peer_benchmark_text:
      "Compared to other real estate professionals at a similar stage.",
    sector_improvement_disclaimer_text: SECTOR_IMPROVEMENT_DISCLAIMER,
  },

  finance_banking: {
    evolution_path_key: "finance_banking",
    evolution_path_title: "Finance / Banking Income Evolution",
    evolution_path_steps: [
      "Transactional Advisory",
      "Client Book Development",
      "Portfolio Management",
      "Fund Participation",
      "Recurring Capital Income",
    ],
    sector_stability_mechanisms: [
      "assets under management fees",
      "recurring advisory retainers",
      "fund management structures",
      "interest and dividend income streams",
      "financial education and certification programs",
    ],
    peer_benchmark_group_key: "finance_banking",
    peer_benchmark_group_label: "Finance / Banking Professionals",
    peer_benchmark_text:
      "Compared to other finance and banking professionals at a similar stage.",
    sector_improvement_disclaimer_text: SECTOR_IMPROVEMENT_DISCLAIMER,
  },

  insurance: {
    evolution_path_key: "insurance",
    evolution_path_title: "Insurance Income Evolution",
    evolution_path_steps: [
      "Policy Sales",
      "Renewal Book",
      "Agency Development",
      "Portfolio Underwriting",
      "Recurring Premium Income",
    ],
    sector_stability_mechanisms: [
      "renewal commission structures",
      "policy portfolio retention",
      "agency override income",
      "group and institutional policy contracts",
      "insurance training and licensing programs",
    ],
    peer_benchmark_group_key: "insurance",
    peer_benchmark_group_label: "Insurance Professionals",
    peer_benchmark_text:
      "Compared to other insurance professionals at a similar stage.",
    sector_improvement_disclaimer_text: SECTOR_IMPROVEMENT_DISCLAIMER,
  },

  technology: {
    evolution_path_key: "technology",
    evolution_path_title: "Technology Income Evolution",
    evolution_path_steps: [
      "Project-Based Development",
      "Product Licensing",
      "Platform Deployment",
      "Subscription Revenue",
      "Recurring SaaS Income",
    ],
    sector_stability_mechanisms: [
      "subscription and licensing revenue",
      "maintenance and support contracts",
      "platform usage fees",
      "intellectual property licensing",
      "technology training and certification programs",
    ],
    peer_benchmark_group_key: "technology",
    peer_benchmark_group_label: "Technology Professionals",
    peer_benchmark_text:
      "Compared to other technology professionals at a similar stage.",
    sector_improvement_disclaimer_text: SECTOR_IMPROVEMENT_DISCLAIMER,
  },

  healthcare: {
    evolution_path_key: "healthcare",
    evolution_path_title: "Healthcare Income Evolution",
    evolution_path_steps: [
      "Clinical Practice",
      "Patient Panel Development",
      "Practice Ownership",
      "Multi-Location Operations",
      "Recurring Healthcare Revenue",
    ],
    sector_stability_mechanisms: [
      "contracted payer agreements",
      "patient membership and concierge models",
      "facility ownership structures",
      "ancillary service revenue",
      "medical education and training programs",
    ],
    peer_benchmark_group_key: "healthcare",
    peer_benchmark_group_label: "Healthcare Professionals",
    peer_benchmark_text:
      "Compared to other healthcare professionals at a similar stage.",
    sector_improvement_disclaimer_text: SECTOR_IMPROVEMENT_DISCLAIMER,
  },

  legal_services: {
    evolution_path_key: "legal_services",
    evolution_path_title: "Legal Services Income Evolution",
    evolution_path_steps: [
      "Billable Hour Practice",
      "Client Retainer Development",
      "Practice Group Leadership",
      "Firm Equity Participation",
      "Recurring Legal Revenue",
    ],
    sector_stability_mechanisms: [
      "retainer-based client agreements",
      "institutional client contracts",
      "firm equity distributions",
      "legal process outsourcing structures",
      "continuing legal education programs",
    ],
    peer_benchmark_group_key: "legal_services",
    peer_benchmark_group_label: "Legal Services Professionals",
    peer_benchmark_text:
      "Compared to other legal services professionals at a similar stage.",
    sector_improvement_disclaimer_text: SECTOR_IMPROVEMENT_DISCLAIMER,
  },

  consulting_professional_services: {
    evolution_path_key: "consulting_professional_services",
    evolution_path_title: "Consulting / Professional Services Income Evolution",
    evolution_path_steps: [
      "Engagement-Based Work",
      "Client Relationship Portfolio",
      "Service Line Development",
      "Firm Ownership",
      "Recurring Advisory Income",
    ],
    sector_stability_mechanisms: [
      "retainer and subscription advisory models",
      "multi-year engagement contracts",
      "productized service offerings",
      "partnership equity structures",
      "professional development and training programs",
    ],
    peer_benchmark_group_key: "consulting_professional_services",
    peer_benchmark_group_label: "Consulting / Professional Services Professionals",
    peer_benchmark_text:
      "Compared to other consulting and professional services professionals at a similar stage.",
    sector_improvement_disclaimer_text: SECTOR_IMPROVEMENT_DISCLAIMER,
  },

  sales_brokerage: {
    evolution_path_key: "sales_brokerage",
    evolution_path_title: "Sales / Brokerage Income Evolution",
    evolution_path_steps: [
      "Direct Sales Activity",
      "Account Portfolio",
      "Team Sales Management",
      "Distribution Ownership",
      "Recurring Commission Income",
    ],
    sector_stability_mechanisms: [
      "residual commission structures",
      "account portfolio retention",
      "sales team override income",
      "distribution and channel agreements",
      "sales training and development programs",
    ],
    peer_benchmark_group_key: "sales_brokerage",
    peer_benchmark_group_label: "Sales / Brokerage Professionals",
    peer_benchmark_text:
      "Compared to other sales and brokerage professionals at a similar stage.",
    sector_improvement_disclaimer_text: SECTOR_IMPROVEMENT_DISCLAIMER,
  },

  media_entertainment: {
    evolution_path_key: "media_entertainment",
    evolution_path_title: "Media / Entertainment Income Evolution",
    evolution_path_steps: [
      "Project-Based Production",
      "Content Library Development",
      "Distribution Channel Access",
      "Catalog Ownership",
      "Recurring Royalty Income",
    ],
    sector_stability_mechanisms: [
      "royalty and residual income streams",
      "content licensing agreements",
      "catalog and intellectual property ownership",
      "syndication and distribution contracts",
      "media production training programs",
    ],
    peer_benchmark_group_key: "media_entertainment",
    peer_benchmark_group_label: "Media / Entertainment Professionals",
    peer_benchmark_text:
      "Compared to other media and entertainment professionals at a similar stage.",
    sector_improvement_disclaimer_text: SECTOR_IMPROVEMENT_DISCLAIMER,
  },

  construction_trades: {
    evolution_path_key: "construction_trades",
    evolution_path_title: "Construction / Trades Income Evolution",
    evolution_path_steps: [
      "Job-Based Labor",
      "Contractor Operations",
      "Multi-Crew Management",
      "Property Development",
      "Recurring Contract Income",
    ],
    sector_stability_mechanisms: [
      "maintenance and service contract revenue",
      "multi-project pipeline management",
      "equipment leasing and ownership",
      "general contracting and subcontractor structures",
      "trade certification and apprenticeship programs",
    ],
    peer_benchmark_group_key: "construction_trades",
    peer_benchmark_group_label: "Construction / Trades Professionals",
    peer_benchmark_text:
      "Compared to other construction and trades professionals at a similar stage.",
    sector_improvement_disclaimer_text: SECTOR_IMPROVEMENT_DISCLAIMER,
  },

  retail_ecommerce: {
    evolution_path_key: "retail_ecommerce",
    evolution_path_title: "Retail / E-Commerce Income Evolution",
    evolution_path_steps: [
      "Direct Sales Operations",
      "Multi-Channel Presence",
      "Brand Development",
      "Wholesale Distribution",
      "Recurring Subscription Revenue",
    ],
    sector_stability_mechanisms: [
      "subscription and membership revenue",
      "wholesale and distribution agreements",
      "private label and brand licensing",
      "multi-channel fulfillment structures",
      "retail operations training programs",
    ],
    peer_benchmark_group_key: "retail_ecommerce",
    peer_benchmark_group_label: "Retail / E-Commerce Professionals",
    peer_benchmark_text:
      "Compared to other retail and e-commerce professionals at a similar stage.",
    sector_improvement_disclaimer_text: SECTOR_IMPROVEMENT_DISCLAIMER,
  },

  hospitality_food_service: {
    evolution_path_key: "hospitality_food_service",
    evolution_path_title: "Hospitality / Food Service Income Evolution",
    evolution_path_steps: [
      "Single-Location Operations",
      "Multi-Unit Management",
      "Brand Franchise Development",
      "Portfolio Ownership",
      "Recurring Franchise Income",
    ],
    sector_stability_mechanisms: [
      "franchise and licensing fee structures",
      "catering and event contract revenue",
      "multi-unit management systems",
      "supply chain and procurement agreements",
      "hospitality management training programs",
    ],
    peer_benchmark_group_key: "hospitality_food_service",
    peer_benchmark_group_label: "Hospitality / Food Service Professionals",
    peer_benchmark_text:
      "Compared to other hospitality and food service professionals at a similar stage.",
    sector_improvement_disclaimer_text: SECTOR_IMPROVEMENT_DISCLAIMER,
  },

  transportation_logistics: {
    evolution_path_key: "transportation_logistics",
    evolution_path_title: "Transportation / Logistics Income Evolution",
    evolution_path_steps: [
      "Owner-Operator Activity",
      "Fleet Development",
      "Route and Contract Management",
      "Logistics Infrastructure",
      "Recurring Freight Income",
    ],
    sector_stability_mechanisms: [
      "long-term freight and shipping contracts",
      "fleet leasing and asset ownership",
      "route and territory agreements",
      "warehousing and distribution center operations",
      "transportation safety and compliance programs",
    ],
    peer_benchmark_group_key: "transportation_logistics",
    peer_benchmark_group_label: "Transportation / Logistics Professionals",
    peer_benchmark_text:
      "Compared to other transportation and logistics professionals at a similar stage.",
    sector_improvement_disclaimer_text: SECTOR_IMPROVEMENT_DISCLAIMER,
  },

  manufacturing: {
    evolution_path_key: "manufacturing",
    evolution_path_title: "Manufacturing Income Evolution",
    evolution_path_steps: [
      "Job Shop Production",
      "Contract Manufacturing",
      "Product Line Development",
      "Facility Expansion",
      "Recurring Supply Agreement Income",
    ],
    sector_stability_mechanisms: [
      "long-term supply and purchase agreements",
      "contract manufacturing arrangements",
      "equipment and tooling licensing",
      "private label production contracts",
      "manufacturing process certification programs",
    ],
    peer_benchmark_group_key: "manufacturing",
    peer_benchmark_group_label: "Manufacturing Professionals",
    peer_benchmark_text:
      "Compared to other manufacturing professionals at a similar stage.",
    sector_improvement_disclaimer_text: SECTOR_IMPROVEMENT_DISCLAIMER,
  },

  education: {
    evolution_path_key: "education",
    evolution_path_title: "Education Income Evolution",
    evolution_path_steps: [
      "Direct Instruction",
      "Curriculum Development",
      "Program Administration",
      "Institutional Partnership",
      "Recurring Enrollment Income",
    ],
    sector_stability_mechanisms: [
      "tuition and enrollment revenue structures",
      "curriculum licensing and publishing",
      "institutional grant and endowment income",
      "continuing education and certification programs",
      "educational technology platform subscriptions",
    ],
    peer_benchmark_group_key: "education",
    peer_benchmark_group_label: "Education Professionals",
    peer_benchmark_text:
      "Compared to other education professionals at a similar stage.",
    sector_improvement_disclaimer_text: SECTOR_IMPROVEMENT_DISCLAIMER,
  },

  nonprofit_public_sector: {
    evolution_path_key: "nonprofit_public_sector",
    evolution_path_title: "Nonprofit / Public Sector Income Evolution",
    evolution_path_steps: [
      "Grant-Funded Operations",
      "Donor Development",
      "Program Revenue Diversification",
      "Endowment Building",
      "Recurring Institutional Funding",
    ],
    sector_stability_mechanisms: [
      "multi-year grant and contract agreements",
      "recurring donor and membership revenue",
      "program service fee structures",
      "endowment and reserve fund income",
      "public sector compliance and reporting programs",
    ],
    peer_benchmark_group_key: "nonprofit_public_sector",
    peer_benchmark_group_label: "Nonprofit / Public Sector Professionals",
    peer_benchmark_text:
      "Compared to other nonprofit and public sector professionals at a similar stage.",
    sector_improvement_disclaimer_text: SECTOR_IMPROVEMENT_DISCLAIMER,
  },

  agriculture: {
    evolution_path_key: "agriculture",
    evolution_path_title: "Agriculture Income Evolution",
    evolution_path_steps: [
      "Seasonal Crop Production",
      "Multi-Crop Diversification",
      "Value-Added Processing",
      "Land and Asset Portfolio",
      "Recurring Agricultural Revenue",
    ],
    sector_stability_mechanisms: [
      "forward contract and commodity agreements",
      "crop insurance and risk management structures",
      "land lease and rental income",
      "cooperative and marketing association participation",
      "agricultural certification and sustainability programs",
    ],
    peer_benchmark_group_key: "agriculture",
    peer_benchmark_group_label: "Agriculture Professionals",
    peer_benchmark_text:
      "Compared to other agriculture professionals at a similar stage.",
    sector_improvement_disclaimer_text: SECTOR_IMPROVEMENT_DISCLAIMER,
  },

  energy_utilities: {
    evolution_path_key: "energy_utilities",
    evolution_path_title: "Energy / Utilities Income Evolution",
    evolution_path_steps: [
      "Project-Based Installation",
      "Service Territory Development",
      "Infrastructure Ownership",
      "Power Purchase Agreements",
      "Recurring Utility Revenue",
    ],
    sector_stability_mechanisms: [
      "power purchase and offtake agreements",
      "rate-regulated utility revenue structures",
      "infrastructure lease and easement income",
      "renewable energy credit and incentive programs",
      "energy compliance and safety certification programs",
    ],
    peer_benchmark_group_key: "energy_utilities",
    peer_benchmark_group_label: "Energy / Utilities Professionals",
    peer_benchmark_text:
      "Compared to other energy and utilities professionals at a similar stage.",
    sector_improvement_disclaimer_text: SECTOR_IMPROVEMENT_DISCLAIMER,
  },

  other: {
    evolution_path_key: "other",
    evolution_path_title: "General Income Evolution",
    evolution_path_steps: [
      "Activity-Based Income",
      "Client Development",
      "Operational Scaling",
      "Asset Acquisition",
      "Recurring Revenue Streams",
    ],
    sector_stability_mechanisms: [
      "contract and retainer-based revenue",
      "recurring service agreements",
      "intellectual property and licensing income",
      "partnership and equity participation structures",
      "professional development and certification programs",
    ],
    peer_benchmark_group_key: "other",
    peer_benchmark_group_label: "General Professionals",
    peer_benchmark_text:
      "Compared to other professionals at a similar stage.",
    sector_improvement_disclaimer_text: SECTOR_IMPROVEMENT_DISCLAIMER,
  },
};

// Map display names (from canonical enumerations) to internal keys
const SECTOR_KEY_MAP: Record<string, string> = {
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

export function getSectorData(industrySector: string): SectorData {
  const key = SECTOR_KEY_MAP[industrySector] || "other";
  return SECTOR_DATA[key];
}
