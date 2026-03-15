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
  improvement_guidance: string;
  avg_score: number;
  top_20_threshold: number;
  peer_band_distribution: {
    limited: number;
    developing: number;
    established: number;
    high: number;
  };
  constraint_guidance: Record<string, string>;
}

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
    improvement_guidance:
      "Transition from commission-based transactions toward recurring property management and leasing revenue. Build a client portfolio that generates referral income independent of active deal flow. Consider real estate investment holdings that produce passive rental income.",
    avg_score: 42,
    top_20_threshold: 62,
    peer_band_distribution: { limited: 28, developing: 36, established: 25, high: 11 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Commission-based transactions stop immediately when active deal-making pauses — consider building property management or leasing income.",
      recurring_income_proportion: "Most real estate income is one-time commissions — retainer-based advisory or property management fees create recurring revenue.",
      forward_revenue_visibility: "Real estate transactions are unpredictable — securing listing agreements or management contracts extends revenue visibility.",
      income_concentration: "Depending on a few large deals creates concentration risk — diversify across property types, client segments, or geographic markets.",
      number_of_income_sources: "A single brokerage or transaction pipeline limits stability — consider multiple income streams like referral networks, training, or investment income.",
      earnings_variability: "Real estate income naturally fluctuates with market cycles — recurring management fees or retainer structures smooth out monthly variation.",
    },
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
    improvement_guidance:
      "Shift from transactional advisory and deal-based compensation toward assets-under-management fee structures that grow with your client book. Build recurring advisory retainers that provide predictable monthly revenue regardless of market activity. Develop fund participation or carried-interest arrangements that generate income from portfolio performance over time.",
    avg_score: 55,
    top_20_threshold: 72,
    peer_band_distribution: { limited: 14, developing: 32, established: 34, high: 20 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Advisory fees tied to active client meetings stop when you step away — transition toward AUM-based fees that accrue regardless of daily activity.",
      recurring_income_proportion: "Deal-based compensation is episodic — build a book of recurring advisory retainers or management fees that renew automatically.",
      forward_revenue_visibility: "Transaction pipelines are uncertain quarter to quarter — multi-year advisory contracts or fund commitments extend revenue visibility significantly.",
      income_concentration: "Heavy reliance on a few institutional clients creates risk — diversify across client segments, asset classes, and service lines.",
      number_of_income_sources: "A single advisory practice limits resilience — add income from fund distributions, training programs, or strategic board participation.",
      earnings_variability: "Bonus-driven and deal-contingent compensation swings widely — AUM fees and retainers create a stable monthly baseline.",
    },
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
    improvement_guidance:
      "Focus on building a deep renewal book where annual policy renewals generate predictable trailing commissions without active reselling. Expand into agency ownership or override structures that earn income from the production of other agents. Pursue group and institutional policy contracts that provide multi-year premium income with high retention rates.",
    avg_score: 52,
    top_20_threshold: 68,
    peer_band_distribution: { limited: 16, developing: 34, established: 32, high: 18 },
    constraint_guidance: {
      income_continuity_without_active_labor: "New policy sales require constant prospecting — build a renewal book large enough that trailing commissions sustain income during inactive periods.",
      recurring_income_proportion: "First-year commissions dominate early careers — prioritize products with strong renewal commission structures that compound over time.",
      forward_revenue_visibility: "Policy lapse rates create uncertainty — improve retention strategies and secure multi-year group contracts for more predictable revenue.",
      income_concentration: "Relying on a narrow product line or single carrier concentrates risk — diversify across carriers, product types, and client segments.",
      number_of_income_sources: "Income from a single agency or product limits resilience — add override income, training revenue, or claims consulting as supplementary streams.",
      earnings_variability: "New business production fluctuates seasonally — a mature renewal book with high retention smooths monthly income variation.",
    },
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
    improvement_guidance:
      "Shift project-based development toward subscription or SaaS licensing models with recurring monthly revenue. Establish maintenance and support contracts that renew annually and provide baseline income between projects. Develop intellectual property that can be licensed independently of active consulting, creating income that scales without proportional labor.",
    avg_score: 48,
    top_20_threshold: 65,
    peer_band_distribution: { limited: 22, developing: 35, established: 28, high: 15 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Custom development and consulting income stops between engagements — build products or platforms that generate revenue while you are not actively coding.",
      recurring_income_proportion: "Project-based billing is one-time by nature — transition deliverables into subscription access, maintenance contracts, or usage-based pricing.",
      forward_revenue_visibility: "Technology project pipelines are notoriously unpredictable — annual support contracts and subscription commitments lock in forward revenue.",
      income_concentration: "Dependence on one or two enterprise clients is common in tech — diversify across client sizes, verticals, and contract types.",
      number_of_income_sources: "A single consulting practice or product limits stability — layer in training, licensing, support contracts, and affiliate revenue.",
      earnings_variability: "Feast-or-famine project cycles cause wide monthly swings — recurring SaaS or maintenance revenue creates a predictable baseline.",
    },
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
    improvement_guidance:
      "Move beyond fee-for-service clinical work toward contracted payer agreements and capitated care models that provide predictable per-patient revenue. Develop concierge or membership-based practice models where patients pay recurring fees for access and preventive care. Invest in practice ownership and ancillary services like diagnostics or physical therapy that generate facility-based income independent of your personal clinical hours.",
    avg_score: 54,
    top_20_threshold: 70,
    peer_band_distribution: { limited: 15, developing: 33, established: 33, high: 19 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Fee-for-service clinical income stops when you stop seeing patients — build toward practice ownership or concierge models that generate revenue beyond personal appointments.",
      recurring_income_proportion: "Most clinical income is billed per encounter — capitated contracts, membership fees, and payer agreements create predictable recurring revenue.",
      forward_revenue_visibility: "Patient volume fluctuates with seasons and referral patterns — long-term payer contracts and membership panels improve forward visibility.",
      income_concentration: "Reliance on a single payer or hospital system creates vulnerability — diversify across payers, service lines, and practice locations.",
      number_of_income_sources: "A solo clinical practice is a single income source — add ancillary services, training programs, or facility ownership as additional streams.",
      earnings_variability: "Clinical income varies with patient volume and reimbursement timing — capitated and membership models smooth monthly revenue.",
    },
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
    improvement_guidance:
      "Transition from hourly billing toward monthly retainer agreements that provide clients with ongoing access and give you predictable revenue. Build institutional client relationships with multi-year contracts for compliance, regulatory, or general counsel services. Pursue firm equity participation or origination credit structures that generate income from the firm's broader client base beyond your personal billable hours.",
    avg_score: 50,
    top_20_threshold: 67,
    peer_band_distribution: { limited: 18, developing: 35, established: 30, high: 17 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Billable-hour income ceases entirely during periods of non-billing — build retainer relationships and firm equity positions that produce income regardless of active casework.",
      recurring_income_proportion: "Most legal work is billed after completion on a matter-by-matter basis — shift toward monthly retainers and subscription legal service models.",
      forward_revenue_visibility: "Legal matters are often unpredictable in timing and scope — multi-year institutional contracts and retainer agreements create forward revenue certainty.",
      income_concentration: "Heavy reliance on a few large matters or clients creates significant risk — diversify across practice areas, client industries, and engagement types.",
      number_of_income_sources: "A single practice area or client relationship limits resilience — add mediation, training, board advisory, or publishing as supplementary income.",
      earnings_variability: "Legal income fluctuates with case resolutions and new matter origination — retainer-based revenue and equity distributions stabilize monthly cash flow.",
    },
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
    improvement_guidance:
      "Convert project-based consulting engagements into ongoing retainer or subscription advisory relationships with defined monthly deliverables. Productize your methodology into scalable offerings — frameworks, assessments, or training programs — that can be delivered repeatedly without full custom effort. Build toward firm ownership or partnership equity that earns income from the collective output of multiple consultants.",
    avg_score: 45,
    top_20_threshold: 63,
    peer_band_distribution: { limited: 24, developing: 37, established: 27, high: 12 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Consulting income is directly tied to billable hours and active engagements — build productized offerings and retainer contracts that generate revenue between projects.",
      recurring_income_proportion: "Most consulting revenue is project-based and non-recurring — establish subscription advisory models and annual retainers for ongoing client access.",
      forward_revenue_visibility: "Engagement pipelines are volatile and subject to client budget cycles — secure multi-year contracts and retainer commitments to extend visibility.",
      income_concentration: "A small number of large engagements can dominate revenue — diversify across industries, service lines, and client sizes to reduce dependence.",
      number_of_income_sources: "A single consulting practice is inherently a single source — add training, licensing, publishing, or partnership distributions as distinct income streams.",
      earnings_variability: "Consulting revenue follows an uneven engagement cycle — retainers and productized offerings create a steadier monthly income pattern.",
    },
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
    improvement_guidance:
      "Move from one-time transactional commissions toward residual commission structures where ongoing account activity generates trailing income. Build a managed account portfolio with high retention rates so that renewal revenue accumulates year over year. Develop sales team override income or distribution ownership that earns from the production of others rather than solely from personal selling.",
    avg_score: 40,
    top_20_threshold: 60,
    peer_band_distribution: { limited: 30, developing: 36, established: 24, high: 10 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Commission income depends entirely on closing new deals — build residual commission structures and account portfolios that pay even during periods of reduced personal selling.",
      recurring_income_proportion: "Most sales compensation is tied to individual transactions — pursue products with trailing commissions, renewal fees, or account management retainers.",
      forward_revenue_visibility: "Sales pipelines are inherently uncertain — contracted accounts, subscription-based products, and distribution agreements extend revenue predictability.",
      income_concentration: "Reliance on a few large accounts or a single product line concentrates risk — diversify across products, territories, and client segments.",
      number_of_income_sources: "A single sales role or territory is a single income source — add override income, training revenue, or channel distribution as supplementary streams.",
      earnings_variability: "Sales compensation swings with quota attainment and deal timing — residual commissions and account portfolio revenue dampen monthly fluctuations.",
    },
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
    improvement_guidance:
      "Shift from project-based production work toward building a content library that generates ongoing royalty and licensing income. Retain ownership of your creative intellectual property rather than assigning rights outright, so that syndication and distribution continue to pay over time. Develop catalog-level content assets — music catalogs, film libraries, or media franchises — that produce recurring revenue independent of new production activity.",
    avg_score: 38,
    top_20_threshold: 58,
    peer_band_distribution: { limited: 32, developing: 37, established: 22, high: 9 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Production-based income stops between projects — build a content catalog with licensing and royalty agreements that generate revenue during production gaps.",
      recurring_income_proportion: "Most media income is project-fee or gig-based — retain IP ownership and negotiate residual, royalty, and syndication agreements for ongoing revenue.",
      forward_revenue_visibility: "Entertainment projects are sporadic and unpredictable — multi-year distribution deals and licensing contracts provide forward revenue certainty.",
      income_concentration: "Dependence on a single production company, platform, or franchise concentrates risk — distribute content across multiple platforms and revenue channels.",
      number_of_income_sources: "A single production role or content type limits stability — diversify into licensing, training, live events, and merchandise as additional income streams.",
      earnings_variability: "Media income is highly cyclical around project release dates — catalog royalties and distribution residuals create a steadier monthly baseline.",
    },
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
    improvement_guidance:
      "Transition from job-by-job labor toward recurring maintenance and service contracts that provide predictable monthly revenue between construction projects. Build multi-crew operations where income is generated from the output of multiple teams rather than solely from your personal labor. Invest in equipment ownership and leasing arrangements that produce asset-based income independent of active jobsite work.",
    avg_score: 41,
    top_20_threshold: 61,
    peer_band_distribution: { limited: 29, developing: 37, established: 24, high: 10 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Trade income stops when you stop working on the jobsite — build maintenance contracts and crew management structures that earn without your daily physical presence.",
      recurring_income_proportion: "Construction income is project-based and non-recurring — recurring maintenance, inspection, and service contracts create a predictable revenue baseline.",
      forward_revenue_visibility: "Construction work is bid-based with uncertain timelines — secure multi-phase contracts and annual maintenance agreements for forward visibility.",
      income_concentration: "Reliance on a single general contractor or project type creates vulnerability — diversify across residential, commercial, and municipal work.",
      number_of_income_sources: "A single trade specialty or contractor relationship limits resilience — add equipment leasing, training, or property development as additional streams.",
      earnings_variability: "Construction income varies with weather, permitting, and project schedules — maintenance contracts and multi-crew operations reduce seasonal swings.",
    },
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
    improvement_guidance:
      "Move from one-time product sales toward subscription box, membership, or auto-replenishment models that generate recurring monthly revenue. Build wholesale and distribution agreements that provide bulk purchase commitments independent of daily retail traffic. Develop private-label brands and licensing arrangements that earn margin and royalty income beyond individual storefront transactions.",
    avg_score: 44,
    top_20_threshold: 63,
    peer_band_distribution: { limited: 25, developing: 36, established: 27, high: 12 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Retail sales require constant inventory management and customer acquisition — build subscription models and automated fulfillment that generate revenue without daily operational involvement.",
      recurring_income_proportion: "Most retail revenue comes from individual purchase transactions — subscription, membership, and auto-replenishment programs create recurring income.",
      forward_revenue_visibility: "Retail demand is seasonal and trend-driven — wholesale commitments, subscription pre-orders, and long-term distribution contracts improve predictability.",
      income_concentration: "Dependence on a single storefront, marketplace, or product category concentrates risk — sell across multiple channels and diversify product lines.",
      number_of_income_sources: "A single retail channel is inherently fragile — layer in wholesale, licensing, affiliate, and subscription revenue as distinct income streams.",
      earnings_variability: "Retail revenue fluctuates with seasons, trends, and promotions — subscriptions and wholesale contracts create a more stable monthly baseline.",
    },
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
    improvement_guidance:
      "Expand beyond single-location daily operations toward multi-unit management structures that diversify revenue across locations. Develop franchise or licensing models where brand fees and royalties provide recurring income independent of any single unit's daily performance. Secure catering contracts, event agreements, and institutional food service arrangements that lock in forward revenue and reduce dependence on walk-in traffic.",
    avg_score: 39,
    top_20_threshold: 59,
    peer_band_distribution: { limited: 31, developing: 37, established: 23, high: 9 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Hospitality income requires daily operational presence — build management teams and franchise structures so revenue flows without your personal involvement in daily service.",
      recurring_income_proportion: "Food service revenue is earned transaction by transaction — catering contracts, franchise royalties, and institutional agreements create recurring revenue streams.",
      forward_revenue_visibility: "Walk-in traffic and seasonal tourism are unpredictable — secure event bookings, corporate contracts, and franchise commitments for forward visibility.",
      income_concentration: "A single location or concept creates geographic and market concentration — diversify across locations, service formats, and revenue channels.",
      number_of_income_sources: "Operating a single restaurant or venue is a single income source — add catering, franchise fees, packaged goods, or consulting as additional streams.",
      earnings_variability: "Hospitality revenue swings with seasons, weather, and local events — contracted catering and franchise royalties stabilize monthly income.",
    },
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
    improvement_guidance:
      "Move from owner-operator hauling toward fleet development and long-term freight contracts that generate revenue from multiple vehicles and routes simultaneously. Secure multi-year shipping and logistics agreements with shippers who commit volume, providing predictable lane-based income. Invest in logistics infrastructure — warehousing, distribution centers, or brokerage platforms — that earns income from asset utilization rather than personal driving hours.",
    avg_score: 46,
    top_20_threshold: 64,
    peer_band_distribution: { limited: 23, developing: 36, established: 28, high: 13 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Owner-operator income stops when the truck stops — build a fleet and contract portfolio that generates freight revenue without your personal driving hours.",
      recurring_income_proportion: "Spot-market loads are one-time transactions — dedicated lane contracts and long-term shipping agreements create recurring freight revenue.",
      forward_revenue_visibility: "Spot freight rates and load availability change daily — multi-year contracts and dedicated lanes lock in forward revenue and volume.",
      income_concentration: "Dependence on a single shipper or lane creates route risk — diversify across shippers, routes, and freight types.",
      number_of_income_sources: "A single truck or route is a single income source — add fleet leasing, brokerage commissions, warehousing, or training as supplementary streams.",
      earnings_variability: "Freight rates and fuel costs cause significant monthly income swings — contracted rates and diversified routes reduce variability.",
    },
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
    improvement_guidance:
      "Transition from job-shop production toward long-term supply agreements and contract manufacturing arrangements that commit buyers to recurring purchase volumes. Develop proprietary product lines and private-label manufacturing contracts that provide margin beyond raw production fees. Invest in equipment and tooling that can be licensed or leased to other manufacturers, creating asset-based income independent of your own production runs.",
    avg_score: 51,
    top_20_threshold: 68,
    peer_band_distribution: { limited: 17, developing: 34, established: 32, high: 17 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Job-shop production income requires constant operational involvement — build contract manufacturing agreements and automated production lines that generate revenue with reduced personal oversight.",
      recurring_income_proportion: "Custom manufacturing orders are one-off — long-term supply agreements and blanket purchase orders create recurring production revenue.",
      forward_revenue_visibility: "Manufacturing order books can be volatile — multi-year supply contracts and forecasted purchase commitments extend revenue visibility.",
      income_concentration: "Dependence on a single buyer or product type creates significant risk — diversify across customers, industries, and product categories.",
      number_of_income_sources: "A single production facility or product line limits resilience — add tooling licensing, private-label contracts, and consulting as additional streams.",
      earnings_variability: "Manufacturing revenue fluctuates with order timing and raw material costs — blanket purchase agreements and fixed-price contracts stabilize monthly income.",
    },
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
    improvement_guidance:
      "Move beyond per-session instruction toward curriculum licensing and publishing arrangements that generate royalty income from materials used by others. Develop online courses or educational technology platforms with subscription-based access that scales enrollment without proportional teaching hours. Build institutional partnerships and certification programs that provide multi-year contracted revenue from organizations rather than individual students.",
    avg_score: 53,
    top_20_threshold: 69,
    peer_band_distribution: { limited: 16, developing: 33, established: 33, high: 18 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Teaching income stops during breaks and between terms — build curriculum licensing, online courses, and certification programs that generate revenue without active instruction.",
      recurring_income_proportion: "Per-session and per-semester teaching is non-recurring — subscription course platforms and institutional contracts create predictable recurring revenue.",
      forward_revenue_visibility: "Enrollment is uncertain until registration closes — multi-year institutional contracts and subscription models provide forward revenue certainty.",
      income_concentration: "Dependence on a single institution or enrollment cohort concentrates risk — diversify across institutions, online platforms, and corporate training clients.",
      number_of_income_sources: "A single teaching position is a single income source — add publishing, consulting, online courses, and certification programs as distinct revenue streams.",
      earnings_variability: "Education income follows academic cycles with predictable gaps — year-round online offerings and corporate training contracts fill seasonal troughs.",
    },
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
    improvement_guidance:
      "Shift from single-year competitive grants toward multi-year government contracts and institutional funding agreements that guarantee revenue over extended periods. Build a recurring donor and membership base where annual giving provides a predictable revenue floor. Develop earned-revenue program service fees and build endowment reserves that generate investment income independent of fundraising cycles.",
    avg_score: 47,
    top_20_threshold: 65,
    peer_band_distribution: { limited: 22, developing: 36, established: 29, high: 13 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Grant-funded positions depend on active program delivery and reporting — build endowment income and recurring donor revenue that continues regardless of specific program activity.",
      recurring_income_proportion: "Most grants are one-time or annual competitive awards — recurring memberships, monthly donors, and multi-year contracts create predictable revenue.",
      forward_revenue_visibility: "Grant cycles and government budget processes create funding uncertainty — multi-year awards and committed donor pledges extend revenue visibility.",
      income_concentration: "Heavy dependence on a single grant, funder, or government agency concentrates risk — diversify across funders, program revenue, and earned income.",
      number_of_income_sources: "A single grant or government contract is fragile — layer in membership revenue, program fees, consulting, and endowment income as distinct streams.",
      earnings_variability: "Grant funding arrives in irregular disbursements — monthly donor programs and program service fees create a steadier cash flow.",
    },
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
    improvement_guidance:
      "Move beyond single-season crop sales toward forward contracts and commodity agreements that lock in prices and volumes before harvest. Diversify into value-added processing — milling, packaging, or direct-to-consumer sales — that increases margin and extends revenue beyond raw commodity timing. Build a land and asset portfolio that generates lease income, rental revenue, and conservation program payments independent of active farming operations.",
    avg_score: 43,
    top_20_threshold: 62,
    peer_band_distribution: { limited: 27, developing: 36, established: 26, high: 11 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Farming income requires active seasonal labor — build land leases, equipment rental, and conservation program payments that generate revenue during off-seasons and without personal fieldwork.",
      recurring_income_proportion: "Crop sales are seasonal one-time events — forward contracts, subscription CSA programs, and land lease income create recurring revenue.",
      forward_revenue_visibility: "Agriculture is subject to weather, commodity prices, and policy changes — forward contracts and crop insurance extend revenue predictability.",
      income_concentration: "Reliance on a single crop or commodity concentrates risk — diversify across crops, livestock, value-added products, and land-based income.",
      number_of_income_sources: "A single farming operation is a single income source — add equipment rental, agritourism, consulting, or cooperative distributions as additional streams.",
      earnings_variability: "Agricultural income varies dramatically with harvests and commodity markets — forward contracts, crop insurance, and diversified operations smooth annual cash flow.",
    },
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
    improvement_guidance:
      "Transition from project-based installation work toward long-term power purchase agreements and offtake contracts that guarantee revenue over 10-25 year periods. Invest in energy infrastructure ownership — solar arrays, wind installations, or distribution assets — that produces rate-regulated or contracted revenue streams. Leverage renewable energy credits, capacity payments, and government incentive programs that provide supplementary income tied to infrastructure assets rather than active project labor.",
    avg_score: 56,
    top_20_threshold: 73,
    peer_band_distribution: { limited: 13, developing: 31, established: 35, high: 21 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Installation and project work stops between contracts — build infrastructure ownership positions and power purchase agreements that generate revenue continuously from energy production.",
      recurring_income_proportion: "Project-based energy work is non-recurring — power purchase agreements, maintenance contracts, and utility rate structures create long-term recurring revenue.",
      forward_revenue_visibility: "Energy project pipelines depend on policy and permitting — long-term PPAs and rate-regulated structures provide decades of forward revenue visibility.",
      income_concentration: "Dependence on a single utility, developer, or project site concentrates risk — diversify across energy types, geographies, and contract structures.",
      number_of_income_sources: "A single project or installation contract is a single source — add maintenance services, energy credits, consulting, and equipment leasing as distinct streams.",
      earnings_variability: "Energy project revenue is lumpy and milestone-driven — contracted utility revenue and PPA payments create predictable monthly cash flow.",
    },
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
    improvement_guidance:
      "Shift from activity-based and project-driven income toward retainer agreements and service contracts that provide predictable recurring revenue. Build scalable offerings — productized services, digital products, or licensing arrangements — that generate income without proportional increases in personal labor. Develop equity positions, asset ownership, or partnership structures that produce passive income from capital rather than time.",
    avg_score: 46,
    top_20_threshold: 64,
    peer_band_distribution: { limited: 24, developing: 36, established: 28, high: 12 },
    constraint_guidance: {
      income_continuity_without_active_labor: "Activity-based income stops when active work stops — build retainer contracts, licensing income, or asset-based revenue that continues during periods of reduced personal activity.",
      recurring_income_proportion: "Most project-based and freelance income is non-recurring — establish service agreements, subscriptions, or licensing deals that renew automatically.",
      forward_revenue_visibility: "Without contracts or commitments, future revenue is uncertain — secure multi-month agreements and subscription arrangements for forward visibility.",
      income_concentration: "Reliance on a few clients or a single service offering concentrates risk — diversify across client segments, services, and revenue types.",
      number_of_income_sources: "A single service or client relationship limits resilience — add licensing, training, partnerships, or investment income as additional streams.",
      earnings_variability: "Freelance and project income fluctuates unpredictably — retainers and subscription-based revenue create a more consistent monthly income pattern.",
    },
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
