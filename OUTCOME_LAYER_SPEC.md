# RUNPAYWAY™ — Deterministic Outcome Layer Specification

**Layer 2: Income-Model Outcomes | Layer 3: Industry Refinement**
**Model RP-2.0 Extension | Version OL-1.0**
**Date: 2026-03-20**

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

### Three-Layer Output Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1 — Fixed Core Model (existing, unchanged)          │
│  Score · Bands · Interactions · Fragility · Sensitivity     │
│  Explainability · Integrity · Scenarios · Lift · Confidence │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 2 — Income-Model Deterministic Outcomes              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Income Model Family Resolution                      │   │
│  │  12 families ← 21 income models                     │   │
│  └──────────┬──────────────────────────────────────────┘   │
│             │                                               │
│  ┌──────────▼──────────────────────────────────────────┐   │
│  │  Family-Specific Output Generation                   │   │
│  │  • Risk patterns        • Scenarios                  │   │
│  │  • Stronger-structure   • Action maps                │   │
│  │  • Reassessment triggers • Explanation translations  │   │
│  └──────────┬──────────────────────────────────────────┘   │
└─────────────┼───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 3 — Industry Refinement                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Industry Profile Resolution                         │   │
│  │  8+ priority industries                              │   │
│  └──────────┬──────────────────────────────────────────┘   │
│             │                                               │
│  ┌──────────▼──────────────────────────────────────────┐   │
│  │  Override Application (merge, not replace)           │   │
│  │  • Scenario emphasis     • Action re-ranking         │   │
│  │  • Structure overrides   • Trigger overrides         │   │
│  │  • Explanation phrasing  • Benchmark framing         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Resolution Order

1. Layer 1 runs first (unchanged — produces core `AssessmentRecord`)
2. Layer 2 resolves income model → family → generates family-specific outputs
3. Layer 3 resolves industry → applies overrides to Layer 2 outputs
4. Final merged output is appended to `AssessmentRecord.outcome_layer`

### Key Constraint

Layer 2 and Layer 3 **never modify** Layer 1 outputs. They produce **additional** structured fields that sit alongside the core record. The score, bands, interactions, fragility, and integrity remain identical regardless of income model or industry.

---

## 2. DATA MODEL / TABLE STRUCTURE

### Registry Architecture

```
income_model_families          # 12 families
  └── income_model_profiles    # 21 models → family mapping + overrides

industry_profiles              # 8+ industries

scenario_registry              # ~24 deterministic scenarios
  ├── family_scenario_map      # which scenarios apply to which families
  └── industry_scenario_emphasis  # industry emphasis overrides

stronger_structure_registry    # ~30 patterns
  ├── family_pattern_map       # family-default patterns
  └── industry_pattern_overrides  # industry-specific overrides

action_registry                # ~20 action templates
  ├── family_action_map        # family-default action rankings
  └── industry_action_overrides   # industry re-rankings

reassessment_trigger_registry  # ~20 trigger templates
  ├── family_trigger_map       # family-default triggers
  └── industry_trigger_overrides  # industry-specific wording

explanation_translation_registry  # per reason code
  ├── family_translations      # family-specific phrasing
  └── industry_translations    # industry-specific phrasing

benchmark_context_registry     # per industry
```

All registries are versioned with `registry_version: "OL-1.0"`.

---

## 3. NEW INTAKE FIELDS

### Field 1: Primary Revenue Pattern

```typescript
{
  field_id: "primary_revenue_pattern",
  purpose: "Identifies the dominant pattern by which revenue arrives",
  question: "Which best describes how most of your income arrives?",
  options: [
    { value: "one_time_project", label: "One-time projects or engagements" },
    { value: "commission_event", label: "Commissions or event-based earnings" },
    { value: "retainer_contract", label: "Retainers or ongoing contracts" },
    { value: "subscription_membership", label: "Subscriptions or memberships" },
    { value: "repeat_customer", label: "Repeat customer purchases" },
    { value: "licensing_royalty", label: "Licensing, royalties, or residuals" },
    { value: "rental_asset", label: "Rental or asset-generated income" },
    { value: "mixed_pattern", label: "Mixed — no single dominant pattern" }
  ],
  canonical_mapping: {
    one_time_project:      { continuity_signal: "weak",     forward_signal: "weak",   renewal_depth: "none" },
    commission_event:      { continuity_signal: "weak",     forward_signal: "weak",   renewal_depth: "none" },
    retainer_contract:     { continuity_signal: "moderate", forward_signal: "strong", renewal_depth: "moderate" },
    subscription_membership: { continuity_signal: "strong", forward_signal: "strong", renewal_depth: "strong" },
    repeat_customer:       { continuity_signal: "moderate", forward_signal: "moderate", renewal_depth: "moderate" },
    licensing_royalty:      { continuity_signal: "strong",  forward_signal: "moderate", renewal_depth: "strong" },
    rental_asset:          { continuity_signal: "strong",   forward_signal: "strong", renewal_depth: "strong" },
    mixed_pattern:         { continuity_signal: "moderate", forward_signal: "moderate", renewal_depth: "moderate" }
  },
  layer_effects: {
    layer_2: "Selects which scenario sets and stronger-structure patterns are most relevant",
    layer_3: "Refines action priorities and explanation phrasing"
  }
}
```

### Field 2: Largest Source Type

```typescript
{
  field_id: "largest_source_type",
  purpose: "Identifies the nature of the single largest income source",
  question: "What type is your single largest income source?",
  options: [
    { value: "single_client", label: "A single client or customer" },
    { value: "employer", label: "An employer (W-2 or equivalent)" },
    { value: "referral_channel", label: "A referral channel or partner" },
    { value: "platform_marketplace", label: "A platform or marketplace" },
    { value: "top_product_line", label: "A top product or product line" },
    { value: "top_asset", label: "A top asset or property" },
    { value: "mixed_sources", label: "No single type dominates" }
  ],
  canonical_mapping: {
    single_client:       { concentration_type: "client",   replacement_difficulty: "high",   control_level: "low" },
    employer:            { concentration_type: "employer", replacement_difficulty: "high",   control_level: "low" },
    referral_channel:    { concentration_type: "channel",  replacement_difficulty: "moderate", control_level: "low" },
    platform_marketplace: { concentration_type: "platform", replacement_difficulty: "moderate", control_level: "very_low" },
    top_product_line:    { concentration_type: "product",  replacement_difficulty: "moderate", control_level: "high" },
    top_asset:           { concentration_type: "asset",    replacement_difficulty: "low",    control_level: "high" },
    mixed_sources:       { concentration_type: "mixed",    replacement_difficulty: "moderate", control_level: "moderate" }
  },
  layer_effects: {
    layer_2: "Determines which concentration scenarios and risk narratives apply",
    layer_3: "Selects industry-specific concentration risk language"
  }
}
```

### Field 3: Primary Weakness Pattern

```typescript
{
  field_id: "primary_weakness_pattern",
  purpose: "Identifies how the user perceives their income weakens",
  question: "When your income weakens, what usually causes it?",
  options: [
    { value: "stop_working", label: "When I stop working or slow down" },
    { value: "pipeline_slows", label: "When my pipeline or deal flow slows" },
    { value: "source_leaves", label: "When a key source or client leaves" },
    { value: "platform_drops", label: "When platform traffic or visibility drops" },
    { value: "bookings_decline", label: "When bookings or appointments decline" },
    { value: "seasonal_cycle", label: "Seasonal or cyclical patterns" },
    { value: "mixed_causes", label: "Mixed — no single dominant cause" }
  ],
  canonical_mapping: {
    stop_working:    { labor_sensitivity: "high",     pipeline_sensitivity: "low",  external_sensitivity: "low" },
    pipeline_slows:  { labor_sensitivity: "moderate", pipeline_sensitivity: "high", external_sensitivity: "low" },
    source_leaves:   { labor_sensitivity: "low",      pipeline_sensitivity: "low",  external_sensitivity: "high" },
    platform_drops:  { labor_sensitivity: "low",      pipeline_sensitivity: "moderate", external_sensitivity: "high" },
    bookings_decline: { labor_sensitivity: "moderate", pipeline_sensitivity: "high", external_sensitivity: "moderate" },
    seasonal_cycle:  { labor_sensitivity: "moderate",  pipeline_sensitivity: "moderate", external_sensitivity: "moderate" },
    mixed_causes:    { labor_sensitivity: "moderate",  pipeline_sensitivity: "moderate", external_sensitivity: "moderate" }
  },
  layer_effects: {
    layer_2: "Validates fragility interpretation and selects most relevant risk scenarios",
    layer_3: "Refines explanation language around vulnerability"
  }
}
```

### Field 4: Forward Security Method

```typescript
{
  field_id: "forward_security_method",
  purpose: "Identifies how income is typically secured in advance",
  question: "How is most of your upcoming income secured before the month begins?",
  options: [
    { value: "signed_contracts", label: "Signed contracts or agreements" },
    { value: "retainers", label: "Active retainers" },
    { value: "subscriptions", label: "Subscriptions or memberships" },
    { value: "booked_appointments", label: "Booked appointments or sessions" },
    { value: "scheduled_deals", label: "Scheduled closings or committed deals" },
    { value: "repeat_customer_base", label: "Reliable repeat customer base" },
    { value: "lease_agreements", label: "Lease agreements or rental contracts" },
    { value: "not_secured", label: "Not much is secured ahead" }
  ],
  canonical_mapping: {
    signed_contracts:     { forward_quality: "strong",   cancellation_risk: "low",      visibility_horizon: "long" },
    retainers:            { forward_quality: "strong",   cancellation_risk: "moderate", visibility_horizon: "medium" },
    subscriptions:        { forward_quality: "strong",   cancellation_risk: "moderate", visibility_horizon: "medium" },
    booked_appointments:  { forward_quality: "moderate", cancellation_risk: "moderate", visibility_horizon: "short" },
    scheduled_deals:      { forward_quality: "moderate", cancellation_risk: "moderate", visibility_horizon: "short" },
    repeat_customer_base: { forward_quality: "moderate", cancellation_risk: "high",     visibility_horizon: "short" },
    lease_agreements:     { forward_quality: "strong",   cancellation_risk: "low",      visibility_horizon: "long" },
    not_secured:          { forward_quality: "none",     cancellation_risk: "high",     visibility_horizon: "none" }
  },
  layer_effects: {
    layer_2: "Determines forward-visibility scenario severity and action specificity",
    layer_3: "Selects industry-appropriate improvement language for forward security"
  }
}
```

---

## 4. CANONICAL NORMALIZATION APPROACH

### New Field Normalization

Each new intake field normalizes into a **signal object** (not a numeric score). These signals are used by Layer 2 and Layer 3 for deterministic rule selection — they do not feed into the Layer 1 score engine.

```typescript
interface IntakeSignals {
  // From primary_revenue_pattern
  continuity_signal: "weak" | "moderate" | "strong";
  forward_signal: "weak" | "moderate" | "strong";
  renewal_depth: "none" | "moderate" | "strong";

  // From largest_source_type
  concentration_type: "client" | "employer" | "channel" | "platform" | "product" | "asset" | "mixed";
  replacement_difficulty: "low" | "moderate" | "high";
  control_level: "very_low" | "low" | "moderate" | "high";

  // From primary_weakness_pattern
  labor_sensitivity: "low" | "moderate" | "high";
  pipeline_sensitivity: "low" | "moderate" | "high";
  external_sensitivity: "low" | "moderate" | "high";

  // From forward_security_method
  forward_quality: "none" | "moderate" | "strong";
  cancellation_risk: "low" | "moderate" | "high";
  visibility_horizon: "none" | "short" | "medium" | "long";
}
```

### Resolution Rule

```
IntakeSignals are derived deterministically from the 4 new intake fields.
IntakeSignals are passed to Layer 2 and Layer 3 engines.
IntakeSignals NEVER modify Layer 1 scoring.
```

---

## 5. INCOME MODEL FAMILY ARCHITECTURE

### 12 Families ← 21 Income Models

```
┌──────────────────────────────────────────────────────────────────────┐
│ Family                    │ Income Models Mapped                    │
├──────────────────────────────────────────────────────────────────────┤
│ employment_led            │ Employee Salary                         │
│ commission_led            │ Commission-Based, Real Estate Brokerage │
│ contract_project_led      │ Contract-Based, Independent Contractor, │
│                           │ Project-Based Work                      │
│ retainer_subscription_led │ Subscription/Retainer, Consulting/      │
│                           │ Client Services                         │
│ practice_led              │ Professional Practice                   │
│ agency_led                │ Agency/Brokerage, Team/Partnership      │
│ product_led               │ Product Sales, Digital Product Sales,   │
│                           │ Franchise Ownership                     │
│ creator_audience_led      │ Creator/Media Income                    │
│ referral_affiliate_led    │ Affiliate/Referral Income               │
│ asset_rental_led          │ Real Estate Rental Income               │
│ investment_led            │ Investment/Dividend Income,              │
│                           │ Licensing/Royalty Income                 │
│ hybrid_multi              │ Hybrid Multiple Income Sources,         │
│                           │ Business Ownership                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Family Selection Logic

```typescript
function resolveFamily(primary_income_model: string): IncomeModelFamily {
  return INCOME_MODEL_TO_FAMILY_MAP[primary_income_model];
}
// Direct lookup — no ambiguity, no fallback logic needed.
// Business Ownership → hybrid_multi (most owners have mixed revenue)
// Consulting/Client Services → retainer_subscription_led (consulting typically seeks retainer)
```

---

## 6. FULL INCOME MODEL COVERAGE MAP

### Family: `employment_led`

```typescript
{
  family_id: "employment_led",
  family_label: "Employment-Led",
  income_models: ["Employee Salary"],
  common_weak_points: [
    "Single employer concentration",
    "Income stops immediately if employment ends",
    "No forward visibility beyond pay period",
    "Zero continuity without active work"
  ],
  supportive_patterns: [
    "Predictable pay cycle",
    "Employer-provided benefits buffer",
    "Low variability month-to-month"
  ],
  primary_risk_scenarios: ["RS-JOB-LOSS", "RS-EMPLOYER-DOWNSIZE", "RS-INDUSTRY-CONTRACTION"],
  stronger_structure_signals: [
    "Supplemental income source established",
    "Side revenue stream producing recurring income",
    "Emergency continuity from non-employment source"
  ],
  default_action_priorities: [
    "ACT-SUPPLEMENT-01: Build one income source outside employment",
    "ACT-FORWARD-02: Create forward-committed supplemental revenue",
    "ACT-DIVERSIFY-03: Reduce single-employer concentration"
  ],
  default_avoid_priorities: [
    "Do not over-invest in single-employer career advancement without structural backup",
    "Do not treat bonuses as structural improvement"
  ],
  reassessment_trigger_templates: [
    "RT-EMP-01: New non-employment income source established",
    "RT-EMP-02: Supplemental recurring revenue reaches 10%+ of total",
    "RT-EMP-03: Forward-committed income extends beyond pay period"
  ],
  explanation_translation_map: {
    "low_forward_secured": "Your income visibility extends only to the next pay period. There is no committed income beyond your current employment arrangement.",
    "high_concentration": "Your income depends entirely on one employer. If that employment ends, 100% of income stops.",
    "high_labor_dependence": "Your income requires your continued active employment. There is no passive or recurring component."
  },
  benchmark_cluster_key: "employment_benchmark"
}
```

### Family: `commission_led`

```typescript
{
  family_id: "commission_led",
  family_label: "Commission-Led",
  income_models: ["Commission-Based", "Real Estate Brokerage Income"],
  common_weak_points: [
    "Income arrives in uneven bursts",
    "Forward visibility limited to active pipeline",
    "High variability between strong and weak months",
    "Income stops when active selling stops"
  ],
  supportive_patterns: [
    "Large deal pipeline in progress",
    "Repeat client relationships generating referrals",
    "Multiple concurrent deal tracks"
  ],
  primary_risk_scenarios: ["RS-PIPELINE-DRY", "RS-TOP-CLIENT-LOST", "RS-MARKET-SLOWDOWN", "RS-DEAL-DELAYED"],
  stronger_structure_signals: [
    "Recurring referral income layer established",
    "Property management or passive income stream added",
    "Team structure sharing deal flow",
    "Forward bookings or listings under contract"
  ],
  default_action_priorities: [
    "ACT-RECUR-01: Build a recurring or residual income layer alongside commission work",
    "ACT-PIPELINE-02: Extend pipeline visibility to 3+ months of committed deals",
    "ACT-DIVERSIFY-03: Reduce dependence on top referral source or client relationship"
  ],
  default_avoid_priorities: [
    "Do not treat a single large closing as structural improvement",
    "Do not ignore forward pipeline while current deals are strong"
  ],
  reassessment_trigger_templates: [
    "RT-COM-01: Recurring or residual income component reaches 15%+ of total",
    "RT-COM-02: Forward committed pipeline extends to 3+ months",
    "RT-COM-03: Top source concentration drops below 40%"
  ],
  explanation_translation_map: {
    "low_forward_secured": "Most upcoming income depends on deals that have not yet closed. There is limited revenue already committed before the month begins.",
    "high_variability": "Commission income naturally swings between strong and weak months. The structure has not yet smoothed this pattern with recurring revenue.",
    "high_labor_dependence": "Income depends on your continued active selling, prospecting, and deal management."
  },
  benchmark_cluster_key: "commission_benchmark"
}
```

### Family: `contract_project_led`

```typescript
{
  family_id: "contract_project_led",
  family_label: "Contract / Project-Led",
  income_models: ["Contract-Based", "Independent Contractor", "Project-Based Work"],
  common_weak_points: [
    "Income tied to project start/end dates",
    "Gap risk between engagements",
    "Forward visibility limited to current contracts",
    "Concentration on a few active clients"
  ],
  supportive_patterns: [
    "Overlapping project timelines",
    "Repeat client history",
    "Milestone-based payment schedules"
  ],
  primary_risk_scenarios: ["RS-CONTRACT-END", "RS-GAP-PERIOD", "RS-CLIENT-BUDGET-CUT", "RS-SCOPE-REDUCTION"],
  stronger_structure_signals: [
    "Multi-month contracts with committed payment schedules",
    "Retainer component alongside project work",
    "3+ active clients at any given time",
    "Pipeline of signed next engagements"
  ],
  default_action_priorities: [
    "ACT-RETAINER-01: Convert at least one project relationship into a retainer or recurring engagement",
    "ACT-OVERLAP-02: Maintain overlapping contract timelines to eliminate gap periods",
    "ACT-FORWARD-03: Secure next engagement before current contract ends"
  ],
  default_avoid_priorities: [
    "Do not wait until a contract ends to seek the next one",
    "Do not treat a single large project as income stability"
  ],
  reassessment_trigger_templates: [
    "RT-CON-01: Retainer or recurring component reaches 20%+ of total",
    "RT-CON-02: Next engagement signed before current one ends",
    "RT-CON-03: Active client count reaches 3+ simultaneous"
  ],
  explanation_translation_map: {
    "low_forward_secured": "Your income visibility is tied to current contract timelines. Once active contracts end, no committed income follows unless new work is already signed.",
    "high_concentration": "A small number of clients account for most of your contract revenue. Losing one would create a meaningful gap.",
    "short_continuity": "Contract income stops when the engagement ends. There is limited passive or continuing income between projects."
  },
  benchmark_cluster_key: "contract_benchmark"
}
```

### Family: `retainer_subscription_led`

```typescript
{
  family_id: "retainer_subscription_led",
  family_label: "Retainer / Subscription-Led",
  income_models: ["Subscription / Retainer Services", "Consulting / Client Services"],
  common_weak_points: [
    "Cancellation or non-renewal risk",
    "Client concentration within recurring base",
    "Revenue ceiling without new acquisition",
    "Platform or billing dependency"
  ],
  supportive_patterns: [
    "Monthly recurring revenue base",
    "Multi-month or annual contracts",
    "Low historical churn rate",
    "Diversified subscriber or retainer base"
  ],
  primary_risk_scenarios: ["RS-CHURN-SPIKE", "RS-TOP-RETAINER-LOST", "RS-RENEWAL-DECLINE", "RS-PRICING-PRESSURE"],
  stronger_structure_signals: [
    "Annual contract terms (vs monthly)",
    "Diversified retainer base — no single client > 25%",
    "Net revenue retention above 90%",
    "Forward visibility extending 6+ months"
  ],
  default_action_priorities: [
    "ACT-TERM-01: Extend contract terms from monthly to quarterly or annual",
    "ACT-DIVERSIFY-02: Reduce top-client concentration within recurring base",
    "ACT-RETENTION-03: Improve renewal and retention processes"
  ],
  default_avoid_priorities: [
    "Do not chase new acquisition at the expense of retention",
    "Do not treat month-to-month retainers as durable forward security"
  ],
  reassessment_trigger_templates: [
    "RT-RET-01: Average contract term extends to 6+ months",
    "RT-RET-02: No single retainer client exceeds 25% of recurring revenue",
    "RT-RET-03: Net retention rate exceeds 90% over trailing 6 months"
  ],
  explanation_translation_map: {
    "low_forward_secured": "While retainer or subscription revenue provides some forward visibility, short contract terms or high cancellation risk reduce the effective security of that income.",
    "high_concentration": "Too much recurring revenue depends on a small number of retainer clients. Losing one would meaningfully reduce the recurring base.",
    "high_labor_dependence": "Even with retainers, the income still requires your active service delivery. The retainer creates forward visibility but not labor independence."
  },
  benchmark_cluster_key: "retainer_benchmark"
}
```

### Family: `practice_led`

```typescript
{
  family_id: "practice_led",
  family_label: "Practice-Led",
  income_models: ["Professional Practice"],
  common_weak_points: [
    "Income tied to practitioner availability",
    "Interruption sensitivity — illness, burnout, leave",
    "Limited scalability without associates",
    "Client concentration if caseload is small"
  ],
  supportive_patterns: [
    "Established referral network",
    "Recurring client base requiring ongoing services",
    "Booked appointment schedule extending weeks ahead"
  ],
  primary_risk_scenarios: ["RS-PRACTITIONER-UNAVAILABLE", "RS-REFERRAL-SOURCE-LOST", "RS-CASELOAD-DECLINE", "RS-REGULATORY-CHANGE"],
  stronger_structure_signals: [
    "Associate or partner carrying part of caseload",
    "Recurring service plans or memberships",
    "Booked schedule extending 4+ weeks ahead",
    "Multiple active referral sources"
  ],
  default_action_priorities: [
    "ACT-DELEGATE-01: Add an associate, partner, or contractor to reduce founder dependence",
    "ACT-RECURRING-02: Create a recurring service plan or membership tier",
    "ACT-BOOKING-03: Extend forward-booked schedule to 4+ weeks"
  ],
  default_avoid_priorities: [
    "Do not rely solely on increasing personal hours to improve the score",
    "Do not treat short-term caseload spikes as structural improvement"
  ],
  reassessment_trigger_templates: [
    "RT-PRA-01: Associate or partner absorbing 20%+ of service delivery",
    "RT-PRA-02: Recurring service plan revenue reaches 15%+ of total",
    "RT-PRA-03: Forward-booked schedule extends to 6+ weeks"
  ],
  explanation_translation_map: {
    "high_labor_dependence": "Your income depends almost entirely on your personal availability to see clients or perform services. If you are unavailable, income stops.",
    "low_forward_secured": "Forward visibility is limited to your currently booked appointments. There is limited committed income beyond the near-term schedule.",
    "high_concentration": "Your practice depends heavily on a small number of referral sources or a concentrated client base."
  },
  benchmark_cluster_key: "practice_benchmark"
}
```

### Family: `agency_led`

```typescript
{
  family_id: "agency_led",
  family_label: "Agency-Led",
  income_models: ["Agency / Brokerage Income", "Team / Partnership Income"],
  common_weak_points: [
    "Concentration on a few large accounts",
    "Founder or key-person dependence for client relationships",
    "Scope creep reducing effective margins",
    "Renewal risk on annual contracts"
  ],
  supportive_patterns: [
    "Retainer-based client relationships",
    "Multi-year contracts",
    "Diversified client portfolio",
    "Team-based delivery (not founder-dependent)"
  ],
  primary_risk_scenarios: ["RS-TOP-ACCOUNT-LOST", "RS-FOUNDER-UNAVAILABLE", "RS-SCOPE-CREEP", "RS-BUDGET-SEASON-CUT"],
  stronger_structure_signals: [
    "No single client exceeds 20% of revenue",
    "Team delivers without founder on every account",
    "Average contract term exceeds 12 months",
    "Pipeline of signed new business extending 3+ months"
  ],
  default_action_priorities: [
    "ACT-SPREAD-01: Reduce largest client to under 25% of total revenue",
    "ACT-TEAM-02: Transition client delivery to team members, not founder",
    "ACT-TERM-03: Extend average contract length to 12+ months",
    "ACT-PIPELINE-04: Maintain 3+ months of committed new business pipeline"
  ],
  default_avoid_priorities: [
    "Do not take on a new large client that increases concentration",
    "Do not treat project-based wins as recurring unless contracted"
  ],
  reassessment_trigger_templates: [
    "RT-AGN-01: Top client concentration drops below 25%",
    "RT-AGN-02: Founder dependency reduced — team delivers 50%+ of revenue",
    "RT-AGN-03: Average contract term extends to 12+ months"
  ],
  explanation_translation_map: {
    "high_concentration": "A small number of clients drive most of the agency's revenue. Losing the largest account would create a significant revenue gap.",
    "high_labor_dependence": "Key client relationships still depend on the founder or a small number of individuals. The agency has not yet distributed delivery broadly enough.",
    "low_forward_secured": "Too little of the agency's future revenue is already protected by signed retainers, renewals, or committed forward contracts."
  },
  benchmark_cluster_key: "agency_benchmark"
}
```

### Family: `product_led`

```typescript
{
  family_id: "product_led",
  family_label: "Product-Led",
  income_models: ["Product Sales", "Digital Product Sales", "Franchise Ownership"],
  common_weak_points: [
    "Revenue depends on ongoing sales volume",
    "Seasonal or trend-driven demand",
    "Channel or platform dependency",
    "Inventory or supply chain exposure"
  ],
  supportive_patterns: [
    "Repeat customer base",
    "Multiple sales channels",
    "Subscription or auto-replenishment component",
    "Diversified product catalog"
  ],
  primary_risk_scenarios: ["RS-DEMAND-DROP", "RS-CHANNEL-DISRUPTION", "RS-INVENTORY-DELAY", "RS-COMPETITOR-ENTRY"],
  stronger_structure_signals: [
    "Subscription or auto-reorder revenue layer",
    "3+ active sales channels",
    "Repeat customer rate above 40%",
    "No single product exceeding 40% of revenue"
  ],
  default_action_priorities: [
    "ACT-SUBSCRIBE-01: Add a subscription, membership, or auto-reorder revenue layer",
    "ACT-CHANNEL-02: Diversify beyond the primary sales channel",
    "ACT-REPEAT-03: Increase repeat customer rate through retention programs"
  ],
  default_avoid_priorities: [
    "Do not rely on a single product launch to improve stability",
    "Do not count inventory value as forward-secured income"
  ],
  reassessment_trigger_templates: [
    "RT-PRD-01: Subscription or recurring component reaches 20%+ of revenue",
    "RT-PRD-02: Active sales channels reach 3+",
    "RT-PRD-03: Repeat customer rate exceeds 40%"
  ],
  explanation_translation_map: {
    "low_forward_secured": "Product revenue depends on ongoing sales. There is limited committed or pre-sold income before the month begins.",
    "high_concentration": "Revenue is concentrated in a single product line or sales channel. A disruption there would disproportionately affect total income.",
    "high_variability": "Sales volume fluctuates based on demand, seasonality, or marketing performance. The revenue pattern is not yet smooth."
  },
  benchmark_cluster_key: "product_benchmark"
}
```

### Family: `creator_audience_led`

```typescript
{
  family_id: "creator_audience_led",
  family_label: "Creator / Audience-Led",
  income_models: ["Creator / Media Income"],
  common_weak_points: [
    "Platform dependency for distribution and monetization",
    "Audience attention is volatile",
    "Sponsorship and brand deal income is episodic",
    "Limited forward visibility beyond current deals"
  ],
  supportive_patterns: [
    "Direct audience relationship (email, membership)",
    "Multiple monetization channels",
    "Evergreen content generating passive income",
    "Recurring membership or Patreon-style income"
  ],
  primary_risk_scenarios: ["RS-PLATFORM-ALGO-CHANGE", "RS-SPONSOR-PULLBACK", "RS-AUDIENCE-DECLINE", "RS-CONTENT-BURNOUT"],
  stronger_structure_signals: [
    "Recurring membership or community revenue",
    "Evergreen content producing passive royalties",
    "Direct audience channel (email list, owned platform)",
    "3+ monetization methods active simultaneously"
  ],
  default_action_priorities: [
    "ACT-MEMBERSHIP-01: Build a recurring membership, community, or subscription layer",
    "ACT-OWNED-02: Develop a direct audience channel you control (email, owned site)",
    "ACT-EVERGREEN-03: Create evergreen content or products generating passive income",
    "ACT-DIVERSIFY-04: Monetize through 3+ methods (sponsors, products, memberships, licensing)"
  ],
  default_avoid_priorities: [
    "Do not rely on a single platform for all income",
    "Do not treat viral content performance as structural improvement"
  ],
  reassessment_trigger_templates: [
    "RT-CRE-01: Recurring membership revenue reaches 20%+ of total",
    "RT-CRE-02: Direct audience channel established with 1,000+ engaged contacts",
    "RT-CRE-03: Evergreen or passive income component reaches 15%+ of total"
  ],
  explanation_translation_map: {
    "high_labor_dependence": "Your income depends on your continued content creation, audience engagement, and active production. If you stop creating, income declines.",
    "low_forward_secured": "Most income arrives through episodic deals, ad revenue, or sponsorships that are not committed in advance. There is limited forward-secured income.",
    "high_concentration": "Too much income depends on a single platform, sponsor, or monetization channel. A change in any one of them would significantly affect total income."
  },
  benchmark_cluster_key: "creator_benchmark"
}
```

### Family: `referral_affiliate_led`

```typescript
{
  family_id: "referral_affiliate_led",
  family_label: "Referral / Affiliate-Led",
  income_models: ["Affiliate / Referral Income"],
  common_weak_points: [
    "Income depends on traffic or referral volume you may not control",
    "Platform or program terms can change unilaterally",
    "Revenue tied to third-party product/service performance",
    "Limited forward visibility"
  ],
  supportive_patterns: [
    "Multiple affiliate programs or referral partners",
    "Evergreen content driving consistent referral traffic",
    "Recurring commission structures (SaaS affiliates)"
  ],
  primary_risk_scenarios: ["RS-PROGRAM-TERMS-CHANGE", "RS-TRAFFIC-DECLINE", "RS-PARTNER-DISCONTINUE", "RS-COMMISSION-RATE-CUT"],
  stronger_structure_signals: [
    "Recurring affiliate commissions (not one-time)",
    "5+ active affiliate/referral programs",
    "Owned traffic source (email, SEO) vs paid traffic",
    "Direct partnership agreements with committed terms"
  ],
  default_action_priorities: [
    "ACT-RECURRING-AFF-01: Prioritize affiliate programs with recurring commissions",
    "ACT-OWNED-TRAFFIC-02: Build owned traffic sources instead of relying on paid or platform traffic",
    "ACT-DIVERSIFY-AFF-03: Expand to 5+ active referral programs to reduce single-program risk"
  ],
  default_avoid_priorities: [
    "Do not treat a single affiliate program as a stable income source",
    "Do not count one-time referral bonuses as recurring income"
  ],
  reassessment_trigger_templates: [
    "RT-AFF-01: Recurring commissions reach 30%+ of affiliate income",
    "RT-AFF-02: Active programs reach 5+ with no single program exceeding 30%",
    "RT-AFF-03: Owned traffic source driving 50%+ of referral volume"
  ],
  explanation_translation_map: {
    "low_forward_secured": "Affiliate and referral income arrives based on ongoing traffic and conversion. Very little is committed or guaranteed before the month begins.",
    "high_concentration": "Too much referral income depends on a single program, partner, or traffic source.",
    "high_labor_dependence": "While affiliate income can be passive, your current structure still depends on active content creation or traffic generation to maintain volume."
  },
  benchmark_cluster_key: "affiliate_benchmark"
}
```

### Family: `asset_rental_led`

```typescript
{
  family_id: "asset_rental_led",
  family_label: "Asset / Rental-Led",
  income_models: ["Real Estate Rental Income"],
  common_weak_points: [
    "Vacancy risk",
    "Tenant concentration if few units",
    "Maintenance and capital expenditure exposure",
    "Market-rate sensitivity"
  ],
  supportive_patterns: [
    "Long-term lease agreements",
    "Multiple properties or units",
    "Low historical vacancy rate",
    "Property management delegation"
  ],
  primary_risk_scenarios: ["RS-VACANCY", "RS-TENANT-DEFAULT", "RS-MAJOR-REPAIR", "RS-MARKET-RATE-DECLINE"],
  stronger_structure_signals: [
    "Average lease term exceeding 12 months",
    "Vacancy rate below 5%",
    "5+ rental units diversifying tenant risk",
    "Professional property management in place"
  ],
  default_action_priorities: [
    "ACT-LEASE-01: Extend average lease terms to 12+ months",
    "ACT-UNITS-02: Add rental units to diversify tenant concentration",
    "ACT-RESERVE-03: Build capital reserve for vacancy and maintenance periods"
  ],
  default_avoid_priorities: [
    "Do not treat property appreciation as income stability",
    "Do not over-leverage to acquire additional units"
  ],
  reassessment_trigger_templates: [
    "RT-RNT-01: Average lease term extends to 12+ months",
    "RT-RNT-02: Vacancy rate drops below 5%",
    "RT-RNT-03: Rental unit count reaches 5+ with no single tenant exceeding 20% of rental income"
  ],
  explanation_translation_map: {
    "low_forward_secured": "While leases provide some forward visibility, upcoming vacancies, short lease terms, or month-to-month tenants reduce the certainty of future rental income.",
    "high_concentration": "Too much rental income depends on a small number of tenants or a single property. A vacancy or default in one unit would meaningfully reduce total income.",
    "high_labor_dependence": "Rental income should be relatively labor-independent, but if you are personally managing properties, maintenance, and tenant relationships, disruption to your availability still affects income."
  },
  benchmark_cluster_key: "rental_benchmark"
}
```

### Family: `investment_led`

```typescript
{
  family_id: "investment_led",
  family_label: "Investment-Led",
  income_models: ["Investment / Dividend Income", "Licensing / Royalty Income"],
  common_weak_points: [
    "Market volatility affecting dividend or distribution levels",
    "Concentration in a single asset class or issuer",
    "Licensing terms subject to renewal or renegotiation",
    "Income sensitive to interest rate or policy changes"
  ],
  supportive_patterns: [
    "Diversified portfolio across asset classes",
    "Long-term licensing agreements",
    "Dividend history with consistent or growing payouts",
    "Multiple income-producing assets"
  ],
  primary_risk_scenarios: ["RS-DIVIDEND-CUT", "RS-MARKET-CORRECTION", "RS-LICENSE-NON-RENEWAL", "RS-INTEREST-RATE-SHIFT"],
  stronger_structure_signals: [
    "No single asset or issuer exceeding 15% of investment income",
    "5+ income-producing positions or licenses",
    "10+ year track record of consistent distributions",
    "Multi-year licensing agreements with renewal options"
  ],
  default_action_priorities: [
    "ACT-DIVERSIFY-INV-01: Reduce single-issuer or single-asset concentration",
    "ACT-TERM-INV-02: Extend licensing or royalty agreement terms",
    "ACT-INCOME-INV-03: Shift toward income-focused investments with consistent payout histories"
  ],
  default_avoid_priorities: [
    "Do not treat capital gains as income stability",
    "Do not count unrealized appreciation as forward-secured income"
  ],
  reassessment_trigger_templates: [
    "RT-INV-01: No single position exceeds 15% of investment income",
    "RT-INV-02: Income-producing positions reach 5+ across asset classes",
    "RT-INV-03: Licensing agreement extended to 3+ years with renewal option"
  ],
  explanation_translation_map: {
    "low_forward_secured": "Investment income depends on dividend declarations, distribution schedules, and licensing terms that can change. Forward certainty is moderate but not fully committed.",
    "high_concentration": "Too much investment income depends on a single issuer, asset, or licensing arrangement.",
    "high_variability": "Investment income varies based on market conditions, dividend policies, or royalty volumes. The income pattern is not fully predictable."
  },
  benchmark_cluster_key: "investment_benchmark"
}
```

### Family: `hybrid_multi`

```typescript
{
  family_id: "hybrid_multi",
  family_label: "Hybrid / Multi-Source",
  income_models: ["Hybrid Multiple Income Sources", "Business Ownership"],
  common_weak_points: [
    "Complexity of managing multiple income streams",
    "Risk of one dominant stream masking structural weakness",
    "Forward visibility varies by stream",
    "Difficulty tracking true concentration"
  ],
  supportive_patterns: [
    "Multiple independent income sources active simultaneously",
    "Mix of active and passive income",
    "At least one recurring component",
    "No single source exceeding 40% of total"
  ],
  primary_risk_scenarios: ["RS-DOMINANT-SOURCE-LOST", "RS-MANAGEMENT-OVERLOAD", "RS-CROSS-STREAM-CORRELATION", "RS-WEAKEST-STREAM-DRAG"],
  stronger_structure_signals: [
    "3+ truly independent income sources",
    "At least one passive or recurring stream",
    "No single source exceeding 30% of total",
    "Each source has its own forward visibility"
  ],
  default_action_priorities: [
    "ACT-BALANCE-01: Ensure no single source exceeds 30% of total income",
    "ACT-PASSIVE-02: Strengthen the passive or recurring component to 25%+ of total",
    "ACT-INDEPENDENT-03: Verify that income sources are truly independent (not correlated)"
  ],
  default_avoid_priorities: [
    "Do not add more sources without strengthening existing ones first",
    "Do not treat complexity as diversification"
  ],
  reassessment_trigger_templates: [
    "RT-HYB-01: No single source exceeds 30% of total",
    "RT-HYB-02: Passive or recurring component reaches 25%+ of total",
    "RT-HYB-03: All major sources have independent forward visibility"
  ],
  explanation_translation_map: {
    "low_forward_secured": "While multiple income streams exist, the overall forward visibility depends on the weakest stream. Some components may have limited committed income ahead.",
    "high_concentration": "Despite multiple streams, one source still dominates. The diversification benefit is limited until the largest source is reduced.",
    "high_labor_dependence": "Even with multiple streams, most still require your active involvement. The structure needs at least one stream that continues without daily effort."
  },
  benchmark_cluster_key: "hybrid_benchmark"
}
```

---

## 7. INDUSTRY REFINEMENT LAYER ARCHITECTURE

### Override Merge Logic

```
Final output = Family defaults MERGED WITH Industry overrides

Merge rules:
1. Industry scenario_emphasis adds weight to specific scenarios (does not remove family scenarios)
2. Industry action_priority_overrides can RE-RANK family actions (insert at specific positions)
3. Industry explanation_language_overrides REPLACE family explanation text for specific reason codes
4. Industry reassessment_trigger_overrides can ADD industry-specific triggers (do not remove family triggers)
5. Industry stronger_structure_overrides can ADD industry-specific patterns
6. If conflict: Industry override wins for display text; Family wins for structural logic
```

---

## 8. INDUSTRY-SELECTED SCENARIO SET FRAMEWORK

### Scenario Registry

```typescript
const SCENARIO_REGISTRY: DeterministicScenario[] = [
  // Employment
  { scenario_id: "RS-JOB-LOSS", label: "Job Loss", applicable_families: ["employment_led"], applicable_industries: ["*"], description: "Your employer terminates your position.", severity: "critical" },
  { scenario_id: "RS-EMPLOYER-DOWNSIZE", label: "Employer Downsizing", applicable_families: ["employment_led"], applicable_industries: ["*"], description: "Your employer reduces headcount.", severity: "high" },

  // Commission / Pipeline
  { scenario_id: "RS-PIPELINE-DRY", label: "Pipeline Dries Up", applicable_families: ["commission_led", "contract_project_led"], applicable_industries: ["real_estate", "professional_services"], description: "Your active pipeline of deals or projects drops to near zero.", severity: "critical" },
  { scenario_id: "RS-DEAL-DELAYED", label: "Major Deal Delayed", applicable_families: ["commission_led", "contract_project_led"], applicable_industries: ["real_estate"], description: "Your largest pending deal is delayed by 3+ months.", severity: "high" },
  { scenario_id: "RS-MARKET-SLOWDOWN", label: "Market Slowdown", applicable_families: ["commission_led", "asset_rental_led", "investment_led"], applicable_industries: ["real_estate", "investing_asset"], description: "The broader market slows, reducing deal flow and demand.", severity: "high" },

  // Client / Account
  { scenario_id: "RS-TOP-CLIENT-LOST", label: "Top Client Lost", applicable_families: ["commission_led", "contract_project_led", "retainer_subscription_led", "agency_led", "practice_led"], applicable_industries: ["*"], description: "Your single largest client or account ends the relationship.", severity: "critical" },
  { scenario_id: "RS-TOP-ACCOUNT-LOST", label: "Top Account Lost", applicable_families: ["agency_led"], applicable_industries: ["agency_client_services"], description: "Your agency's largest account terminates.", severity: "critical" },
  { scenario_id: "RS-CLIENT-BUDGET-CUT", label: "Client Budget Cut", applicable_families: ["contract_project_led", "agency_led", "retainer_subscription_led"], applicable_industries: ["*"], description: "Your client reduces their budget for your services.", severity: "moderate" },

  // Contract / Engagement
  { scenario_id: "RS-CONTRACT-END", label: "Contract Ends Without Renewal", applicable_families: ["contract_project_led"], applicable_industries: ["*"], description: "Your current contract ends and is not renewed.", severity: "high" },
  { scenario_id: "RS-GAP-PERIOD", label: "Gap Between Engagements", applicable_families: ["contract_project_led"], applicable_industries: ["consulting_client_services", "professional_services"], description: "You experience a gap of 2+ months between engagements.", severity: "high" },

  // Retention / Churn
  { scenario_id: "RS-CHURN-SPIKE", label: "Churn Spike", applicable_families: ["retainer_subscription_led", "product_led"], applicable_industries: ["*"], description: "Your cancellation or non-renewal rate spikes for a quarter.", severity: "high" },
  { scenario_id: "RS-RENEWAL-DECLINE", label: "Renewal Rate Declines", applicable_families: ["retainer_subscription_led"], applicable_industries: ["*"], description: "Your renewal or retention rate drops below historical norms.", severity: "moderate" },

  // Founder / Key Person
  { scenario_id: "RS-FOUNDER-UNAVAILABLE", label: "Founder Unavailable", applicable_families: ["agency_led", "practice_led", "hybrid_multi"], applicable_industries: ["*"], description: "The founder or primary operator is unavailable for 90 days.", severity: "critical" },
  { scenario_id: "RS-PRACTITIONER-UNAVAILABLE", label: "Practitioner Unavailable", applicable_families: ["practice_led"], applicable_industries: ["private_practice_coaching"], description: "You are unable to see clients or deliver services for 90 days.", severity: "critical" },

  // Platform / Channel
  { scenario_id: "RS-PLATFORM-ALGO-CHANGE", label: "Platform Algorithm Change", applicable_families: ["creator_audience_led", "referral_affiliate_led", "product_led"], applicable_industries: ["creator_media", "ecommerce_product"], description: "A platform you depend on changes its algorithm or terms.", severity: "high" },
  { scenario_id: "RS-CHANNEL-DISRUPTION", label: "Sales Channel Disrupted", applicable_families: ["product_led", "referral_affiliate_led"], applicable_industries: ["ecommerce_product"], description: "Your primary sales or distribution channel is disrupted.", severity: "high" },

  // Audience / Traffic
  { scenario_id: "RS-AUDIENCE-DECLINE", label: "Audience Decline", applicable_families: ["creator_audience_led"], applicable_industries: ["creator_media"], description: "Your audience engagement or reach declines by 40%+.", severity: "high" },
  { scenario_id: "RS-SPONSOR-PULLBACK", label: "Sponsor Pullback", applicable_families: ["creator_audience_led"], applicable_industries: ["creator_media"], description: "Your largest sponsor or brand deal partner pulls back.", severity: "high" },
  { scenario_id: "RS-TRAFFIC-DECLINE", label: "Traffic Decline", applicable_families: ["referral_affiliate_led", "product_led"], applicable_industries: ["*"], description: "Organic or referral traffic drops by 40%+.", severity: "high" },

  // Asset / Rental
  { scenario_id: "RS-VACANCY", label: "Vacancy Event", applicable_families: ["asset_rental_led"], applicable_industries: ["real_estate", "investing_asset"], description: "One or more rental units become vacant.", severity: "high" },
  { scenario_id: "RS-TENANT-DEFAULT", label: "Tenant Default", applicable_families: ["asset_rental_led"], applicable_industries: ["real_estate"], description: "A major tenant stops paying rent.", severity: "high" },
  { scenario_id: "RS-MAJOR-REPAIR", label: "Major Repair Required", applicable_families: ["asset_rental_led"], applicable_industries: ["real_estate"], description: "A property requires a major unplanned repair.", severity: "moderate" },

  // Investment
  { scenario_id: "RS-DIVIDEND-CUT", label: "Dividend or Distribution Cut", applicable_families: ["investment_led"], applicable_industries: ["investing_asset"], description: "A major holding reduces or eliminates its dividend.", severity: "high" },
  { scenario_id: "RS-MARKET-CORRECTION", label: "Market Correction", applicable_families: ["investment_led"], applicable_industries: ["investing_asset"], description: "A broad market correction reduces portfolio income.", severity: "high" },
  { scenario_id: "RS-LICENSE-NON-RENEWAL", label: "License Non-Renewal", applicable_families: ["investment_led"], applicable_industries: ["*"], description: "A licensing or royalty agreement is not renewed.", severity: "high" },

  // Product
  { scenario_id: "RS-DEMAND-DROP", label: "Demand Drop", applicable_families: ["product_led"], applicable_industries: ["ecommerce_product"], description: "Demand for your core product drops by 30%+.", severity: "high" },
  { scenario_id: "RS-INVENTORY-DELAY", label: "Inventory or Supply Delay", applicable_families: ["product_led"], applicable_industries: ["ecommerce_product"], description: "A supply chain disruption delays inventory for 2+ months.", severity: "moderate" },
];
```

### Scenario Selection Logic

```typescript
function selectScenarios(
  family: string,
  industry: string,
  intakeSignals: IntakeSignals,
  fragilityClass: string,
): SelectedScenario[] {
  // 1. Filter scenarios by family applicability
  let candidates = SCENARIO_REGISTRY.filter(s =>
    s.applicable_families.includes(family)
  );

  // 2. Filter by industry applicability
  candidates = candidates.filter(s =>
    s.applicable_industries.includes("*") || s.applicable_industries.includes(industry)
  );

  // 3. Apply intake signal emphasis
  if (intakeSignals.labor_sensitivity === "high") {
    // Boost severity of labor-related scenarios
    candidates = candidates.map(s =>
      s.scenario_id.includes("UNAVAILABLE") || s.scenario_id.includes("JOB")
        ? { ...s, severity_boost: true }
        : s
    );
  }

  // 4. Sort by severity (critical > high > moderate), boosted first
  // 5. Return top 4 scenarios
  return candidates.slice(0, 4);
}
```

---

## 9–12. STRONGER-STRUCTURE, ACTION MAP, REASSESSMENT, EXPLANATION FRAMEWORKS

> These follow the same registry pattern as scenarios. Each has:
> - A global registry of templates
> - Family-level defaults
> - Industry-level overrides
> - Deterministic selection based on family + industry + intake signals + Layer 1 outputs

The complete registries are defined within each family profile in Section 6 above. The industry-specific overrides are defined in the industry profiles below.

---

## 13. DETERMINISTIC RULE-SELECTION LOGIC

```typescript
function resolveOutcomeLayer(
  coreRecord: AssessmentRecord,
  intakeSignals: IntakeSignals,
): OutcomeLayerResult {

  // 1. Resolve family
  const family = resolveFamily(coreRecord.profile_context.primary_income_model);
  const familyProfile = FAMILY_PROFILES[family.family_id];

  // 2. Resolve industry
  const industry = coreRecord.profile_context.industry_sector;
  const industryProfile = INDUSTRY_PROFILES[industry] ?? null;

  // 3. Select scenarios
  const scenarios = selectScenarios(
    family.family_id, industry, intakeSignals, coreRecord.fragility.fragility_class
  );

  // 4. Select stronger-structure patterns
  let patterns = familyProfile.stronger_structure_signals;
  if (industryProfile?.stronger_structure_overrides) {
    patterns = [...industryProfile.stronger_structure_overrides, ...patterns].slice(0, 5);
  }

  // 5. Build action map
  let actions = familyProfile.default_action_priorities;
  if (industryProfile?.action_priority_overrides) {
    actions = mergeActionPriorities(actions, industryProfile.action_priority_overrides);
  }

  // 6. Build reassessment triggers
  let triggers = familyProfile.reassessment_trigger_templates;
  if (industryProfile?.reassessment_trigger_overrides) {
    triggers = [...triggers, ...industryProfile.reassessment_trigger_overrides];
  }

  // 7. Build explanation translations
  let explanations = familyProfile.explanation_translation_map;
  if (industryProfile?.explanation_language_overrides) {
    explanations = { ...explanations, ...industryProfile.explanation_language_overrides };
  }

  // 8. Build benchmark context
  const benchmarkContext = industryProfile?.benchmark_framing_templates ?? null;

  return {
    income_model_family: family,
    industry_refinement_profile: industryProfile,
    selected_scenarios: scenarios,
    stronger_structure_patterns: patterns,
    ranked_action_map: actions,
    reassessment_trigger_set: triggers,
    explanation_translation_layer: explanations,
    benchmark_context_layer: benchmarkContext,
  };
}
```

---

## 14. OUTPUT CONTRACT ADDITIONS

```typescript
interface OutcomeLayerResult {
  income_model_family: {
    family_id: string;
    family_label: string;
  };
  industry_refinement_profile: {
    industry_id: string;
    industry_label: string;
  } | null;
  selected_scenarios: {
    scenario_id: string;
    label: string;
    description: string;
    severity: "critical" | "high" | "moderate";
    why_it_matters: string;
  }[];
  stronger_structure_patterns: string[];
  ranked_action_map: {
    rank: number;
    action_id: string;
    label: string;
    description: string;
    why_now: string;
    expected_effect: string;
    blocked_until?: string;
  }[];
  avoid_actions: string[];
  reassessment_trigger_set: {
    trigger_id: string;
    condition: string;
    display_text: string;
  }[];
  explanation_translation_layer: Record<string, string>;
  benchmark_context_layer: {
    framing_text: string;
    peer_group_label: string;
  } | null;
}
```

This is appended to `AssessmentRecord` as:

```typescript
interface AssessmentRecord {
  // ... existing Layer 1 fields ...
  outcome_layer: OutcomeLayerResult;
}
```

---

## 15. RECOMMENDED BACKEND TABLES / JSON SCHEMA

```sql
-- Income Model Families
CREATE TABLE income_model_families (
  family_id           TEXT PRIMARY KEY,
  family_label        TEXT NOT NULL,
  income_models       JSONB NOT NULL,     -- string[]
  common_weak_points  JSONB NOT NULL,     -- string[]
  supportive_patterns JSONB NOT NULL,     -- string[]
  risk_scenarios      JSONB NOT NULL,     -- string[] (scenario_ids)
  stronger_signals    JSONB NOT NULL,     -- string[]
  action_priorities   JSONB NOT NULL,     -- string[]
  avoid_priorities    JSONB NOT NULL,     -- string[]
  reassessment_triggers JSONB NOT NULL,   -- string[]
  explanation_map     JSONB NOT NULL,     -- Record<string, string>
  benchmark_key       TEXT NOT NULL,
  version             TEXT NOT NULL DEFAULT 'OL-1.0'
);

-- Industry Profiles
CREATE TABLE industry_profiles (
  industry_id                   TEXT PRIMARY KEY,
  industry_label                TEXT NOT NULL,
  applicable_income_models      JSONB NOT NULL,
  scenario_emphasis             JSONB,    -- scenario_id[] with weights
  stronger_structure_overrides  JSONB,    -- string[]
  action_priority_overrides     JSONB,    -- ranked action overrides
  reassessment_trigger_overrides JSONB,   -- additional triggers
  explanation_overrides         JSONB,    -- Record<string, string>
  benchmark_framing             JSONB,    -- { framing_text, peer_group_label }
  version                       TEXT NOT NULL DEFAULT 'OL-1.0'
);

-- Scenario Registry
CREATE TABLE scenario_registry (
  scenario_id          TEXT PRIMARY KEY,
  label                TEXT NOT NULL,
  applicable_families  JSONB NOT NULL,
  applicable_industries JSONB NOT NULL,
  description          TEXT NOT NULL,
  why_it_matters       TEXT NOT NULL,
  severity             TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'moderate')),
  preconditions        JSONB,
  version              TEXT NOT NULL DEFAULT 'OL-1.0'
);
```

---

## 16. EXAMPLE OUTPUTS

### Example 1: Real Estate Brokerage + Real Estate

```json
{
  "income_model_family": { "family_id": "commission_led", "family_label": "Commission-Led" },
  "industry_refinement_profile": { "industry_id": "real_estate", "industry_label": "Real Estate" },
  "selected_scenarios": [
    { "scenario_id": "RS-PIPELINE-DRY", "label": "Pipeline Dries Up", "severity": "critical", "description": "Your active pipeline of listings and deals drops to near zero." },
    { "scenario_id": "RS-TOP-CLIENT-LOST", "label": "Top Client Lost", "severity": "critical", "description": "Your single largest referral source or repeat client stops sending business." },
    { "scenario_id": "RS-DEAL-DELAYED", "label": "Major Deal Delayed", "severity": "high", "description": "Your largest pending closing is delayed by 3+ months." },
    { "scenario_id": "RS-MARKET-SLOWDOWN", "label": "Market Slowdown", "severity": "high", "description": "The local real estate market slows, reducing listing volume and buyer activity." }
  ],
  "stronger_structure_patterns": [
    "Property management income layer alongside brokerage",
    "Recurring referral fee arrangements with past clients",
    "Team structure sharing deal flow and listings",
    "Forward bookings or listings under active contract"
  ],
  "ranked_action_map": [
    { "rank": 1, "label": "Build a recurring income layer (property management, referral fees)", "why_now": "Commission income alone leaves the structure exposed to pipeline gaps" },
    { "rank": 2, "label": "Extend pipeline visibility to 3+ months of active listings/deals", "why_now": "Forward visibility is limited to currently active transactions" },
    { "rank": 3, "label": "Reduce dependence on top referral source", "why_now": "A single referral channel drives disproportionate business" }
  ],
  "explanation_translation_layer": {
    "low_forward_secured": "Most upcoming income depends on deals that have not yet closed. There are no committed commissions before closings complete."
  },
  "benchmark_context_layer": {
    "framing_text": "Among real estate professionals in your market tier",
    "peer_group_label": "Real Estate Brokerage"
  }
}
```

### Example 2: Agency Income + Agency / Client Services

```json
{
  "income_model_family": { "family_id": "agency_led", "family_label": "Agency-Led" },
  "industry_refinement_profile": { "industry_id": "agency_client_services", "industry_label": "Agency / Client Services" },
  "selected_scenarios": [
    { "scenario_id": "RS-TOP-ACCOUNT-LOST", "label": "Top Account Lost", "severity": "critical", "description": "Your agency's largest account terminates." },
    { "scenario_id": "RS-FOUNDER-UNAVAILABLE", "label": "Founder Unavailable", "severity": "critical", "description": "The founder is unavailable for 90 days." },
    { "scenario_id": "RS-BUDGET-SEASON-CUT", "label": "Budget Season Cut", "severity": "high", "description": "Multiple clients reduce budgets during annual planning." },
    { "scenario_id": "RS-SCOPE-CREEP", "label": "Scope Creep", "severity": "moderate", "description": "Unbilled scope expansion erodes effective margins." }
  ],
  "stronger_structure_patterns": [
    "No single client exceeds 20% of revenue",
    "Team delivers without founder on every account",
    "Average contract term exceeds 12 months",
    "Retainer base covers 60%+ of fixed costs"
  ],
  "ranked_action_map": [
    { "rank": 1, "label": "Reduce largest client to under 25% of total revenue", "why_now": "Account concentration creates outsized fragility" },
    { "rank": 2, "label": "Transition client delivery to team members", "why_now": "Founder dependency limits scalability and creates interruption risk" },
    { "rank": 3, "label": "Extend average contract length to 12+ months", "why_now": "Short contracts reduce forward visibility" }
  ],
  "explanation_translation_layer": {
    "high_concentration": "A small number of clients drive most of the agency's revenue. Losing the largest account would create a significant revenue gap that takes months to replace."
  }
}
```

### Example 3: Consulting + Professional Services

```json
{
  "income_model_family": { "family_id": "retainer_subscription_led", "family_label": "Retainer / Subscription-Led" },
  "selected_scenarios": [
    { "scenario_id": "RS-TOP-CLIENT-LOST", "label": "Top Retainer Client Lost", "severity": "critical" },
    { "scenario_id": "RS-GAP-PERIOD", "label": "Gap Between Engagements", "severity": "high" },
    { "scenario_id": "RS-RENEWAL-DECLINE", "label": "Renewal Rate Declines", "severity": "moderate" },
    { "scenario_id": "RS-CLIENT-BUDGET-CUT", "label": "Client Budget Cut", "severity": "moderate" }
  ],
  "stronger_structure_patterns": [
    "Annual retainer agreements replacing monthly terms",
    "No single retainer client exceeding 25% of revenue",
    "Pipeline of next engagements signed before current ones end",
    "Advisory board or fractional roles providing baseline income"
  ],
  "ranked_action_map": [
    { "rank": 1, "label": "Convert monthly retainers to quarterly or annual agreements" },
    { "rank": 2, "label": "Diversify retainer client base to reduce top-client risk" },
    { "rank": 3, "label": "Secure next engagement before current retainer period ends" }
  ]
}
```

### Example 4: Creator / Media Income + Creator / Media

```json
{
  "income_model_family": { "family_id": "creator_audience_led", "family_label": "Creator / Audience-Led" },
  "selected_scenarios": [
    { "scenario_id": "RS-PLATFORM-ALGO-CHANGE", "label": "Platform Algorithm Change", "severity": "critical" },
    { "scenario_id": "RS-SPONSOR-PULLBACK", "label": "Sponsor Pullback", "severity": "high" },
    { "scenario_id": "RS-AUDIENCE-DECLINE", "label": "Audience Decline", "severity": "high" },
    { "scenario_id": "RS-CONTENT-BURNOUT", "label": "Content Burnout", "severity": "high" }
  ],
  "stronger_structure_patterns": [
    "Recurring membership or community revenue at 20%+",
    "Direct audience channel (email list) with 5,000+ subscribers",
    "Evergreen content generating passive royalties or affiliate income",
    "3+ active monetization methods"
  ],
  "ranked_action_map": [
    { "rank": 1, "label": "Build a recurring membership, community, or subscription" },
    { "rank": 2, "label": "Develop a direct audience channel you control" },
    { "rank": 3, "label": "Create evergreen products generating passive income" }
  ]
}
```

### Example 5: Product Sales + E-commerce / Product

```json
{
  "income_model_family": { "family_id": "product_led", "family_label": "Product-Led" },
  "selected_scenarios": [
    { "scenario_id": "RS-DEMAND-DROP", "label": "Demand Drop", "severity": "high" },
    { "scenario_id": "RS-CHANNEL-DISRUPTION", "label": "Sales Channel Disrupted", "severity": "high" },
    { "scenario_id": "RS-INVENTORY-DELAY", "label": "Inventory or Supply Delay", "severity": "moderate" },
    { "scenario_id": "RS-PLATFORM-ALGO-CHANGE", "label": "Platform Algorithm Change", "severity": "high" }
  ],
  "stronger_structure_patterns": [
    "Subscription or auto-reorder revenue layer at 20%+",
    "3+ active independent sales channels",
    "Repeat customer rate above 40%",
    "No single product exceeding 40% of revenue"
  ],
  "ranked_action_map": [
    { "rank": 1, "label": "Add a subscription or auto-reorder layer" },
    { "rank": 2, "label": "Diversify beyond the primary sales channel" },
    { "rank": 3, "label": "Build retention programs to increase repeat customer rate" }
  ]
}
```

### Example 6: Investment / Dividend + Investing / Asset

```json
{
  "income_model_family": { "family_id": "investment_led", "family_label": "Investment-Led" },
  "selected_scenarios": [
    { "scenario_id": "RS-DIVIDEND-CUT", "label": "Dividend or Distribution Cut", "severity": "high" },
    { "scenario_id": "RS-MARKET-CORRECTION", "label": "Market Correction", "severity": "high" },
    { "scenario_id": "RS-LICENSE-NON-RENEWAL", "label": "License Non-Renewal", "severity": "high" },
    { "scenario_id": "RS-INTEREST-RATE-SHIFT", "label": "Interest Rate Shift", "severity": "moderate" }
  ],
  "stronger_structure_patterns": [
    "No single position exceeding 15% of investment income",
    "5+ income-producing positions across asset classes",
    "Multi-year licensing agreements with renewal options",
    "Income-focused portfolio with 10+ year payout history"
  ],
  "ranked_action_map": [
    { "rank": 1, "label": "Reduce single-issuer or single-asset concentration" },
    { "rank": 2, "label": "Extend licensing or royalty agreement terms" },
    { "rank": 3, "label": "Shift toward income-focused investments with consistent histories" }
  ]
}
```

---

## 17. IMMEDIATE IMPLEMENTATION PRIORITY

### Phase 1 (Core Registry Build)

```
Priority  Component                          File
────────  ─────────────────────────────────  ──────────────────────────────────
1.1       Income model family map            data/income-model-families.ts
1.2       Family profiles (12 families)      data/family-profiles.ts
1.3       New intake field schemas           schemas/intake-signals.schema.ts
1.4       Intake signal normalization        engines/intake-signals.ts
1.5       Scenario registry (24 scenarios)   data/scenario-registry.ts
1.6       Stronger-structure registry        data/stronger-structure-registry.ts
1.7       Family resolution engine           engines/family-resolution.ts
1.8       Scenario selection engine          engines/scenario-selection.ts
1.9       Unit tests for family + scenarios  tests/outcome-layer.test.ts
```

### Phase 2 (Action + Explanation Layers)

```
Priority  Component                          File
────────  ─────────────────────────────────  ──────────────────────────────────
2.1       Action map registry               data/action-registry.ts
2.2       Reassessment trigger registry     data/trigger-registry.ts
2.3       Explanation translation registry  data/explanation-registry.ts
2.4       Industry profiles (8 industries)  data/industry-profiles.ts
2.5       Override merge engine             engines/override-merge.ts
2.6       Outcome layer orchestrator        engines/outcome-orchestrator.ts
2.7       Output contract extension         types.ts (extend AssessmentRecord)
2.8       Integration with v2 orchestrator  index.ts (add outcome layer call)
2.9       Integration tests                 tests/outcome-integration.test.ts
```

### Phase 3 (Benchmark + Admin)

```
Priority  Component                          File
────────  ─────────────────────────────────  ──────────────────────────────────
3.1       Benchmark context registry        data/benchmark-context.ts
3.2       Version manifest extension        engines/20-integrity-manifest.ts
3.3       Database migration (if needed)    db/migrations/002_outcome_layer.sql
3.4       Registry admin utilities          (future)
3.5       Full exhaustive determinism tests  tests/outcome-exhaustive.test.ts
```

---

## 18. OPEN QUESTIONS / ASSUMPTIONS

### Open Questions

1. **New intake field placement**: Should the 4 new fields be collected as part of the existing profile step (step 7 after 6 diagnostic questions), or as a separate "income context" step? **Assumption: Add to the existing profile step to minimize intake friction.**

2. **Backward compatibility**: Existing assessments don't have the 4 new intake fields. Should the outcome layer return a default/generic result for records without intake signals? **Assumption: Yes — use `mixed` defaults for all 4 new fields when not provided. The outcome layer degrades gracefully to the family-level defaults.**

3. **Report page rendering**: The current report page renders V1-adapted output. Should the outcome layer outputs replace existing report sections, or appear as additional sections? **Assumption: Replace the existing action cards, scenario text, and explanation text with the more specific outcome-layer versions. Do not add new pages.**

4. **Scenario count**: The spec shows 4 scenarios per assessment. Should this be configurable? **Assumption: Fixed at 4. Always show the top 4 by severity for the user's family + industry combination.**

5. **Industry list expansion**: 8 priority industries are defined. The existing codebase has 19 sectors. Should all 19 receive industry profiles? **Assumption: Phase 1 covers 8 priority industries. Remaining 11 use family-level defaults with no industry override. Phase 2 can add more.**

6. **Intake field requirement**: Should the 4 new fields be required or optional? **Assumption: Optional with defaults. This allows the system to work without them while producing richer results when they are provided.**

### Assumptions Made

1. Layer 2/3 outputs are deterministic — same family + industry + intake signals + Layer 1 outputs always produce the same outcome layer.
2. The 12-family grouping is stable and does not need per-assessment dynamic resolution beyond the direct lookup.
3. Industry overrides are additive (merge), not destructive (replace). Family defaults always serve as the base.
4. All registries are versioned as `OL-1.0` and included in the manifest hash for integrity verification.
5. The outcome layer adds ~2KB to the assessment record size (structured JSON).
6. Scenario severity (`critical` / `high` / `moderate`) is fixed per scenario and does not change based on the user's score.

---

*End of Outcome Layer Specification*
*RUNPAYWAY™ | Model RP-2.0 | Outcome Layer OL-1.0*
