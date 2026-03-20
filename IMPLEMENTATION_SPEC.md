# RUNPAYWAY™ — Production Implementation Specification

**Model RP-1.0 | Version 2.0 Build Spec**
**Deterministic Structural Income Diagnostic Platform**
**Date: 2026-03-20**

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

### Architecture Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                        NEXT.JS APP ROUTER                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │ Landing  │ │ Intake   │ │ Report   │ │ Advisor/History  │   │
│  │ Page     │ │ Flow     │ │ Pages    │ │ Pages            │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘   │
│                          │                                      │
│              ┌───────────▼───────────────┐                     │
│              │   API ROUTE HANDLERS      │                     │
│              │   /api/v1/score           │                     │
│              │   /api/v1/assessment/*    │                     │
│              │   /api/v1/verify          │                     │
│              │   /api/v1/compare         │                     │
│              └───────────┬───────────────┘                     │
│                          │                                      │
│              ┌───────────▼───────────────┐                     │
│              │   ENGINE ORCHESTRATOR     │                     │
│              │   Deterministic Pipeline  │                     │
│              └───────────┬───────────────┘                     │
│                          │                                      │
│  ┌───────────────────────▼──────────────────────────────────┐  │
│  │              20 DETERMINISTIC ENGINES                     │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │  │
│  │  │Validate │ │Profile  │ │Normalize│ │Score    │       │  │
│  │  │         │ │Context  │ │         │ │         │       │  │
│  │  ├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤       │  │
│  │  │Band     │ │Indicator│ │CrossFact│ │Quality  │       │  │
│  │  │         │ │         │ │Depend.  │ │Durabil. │       │  │
│  │  ├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤       │  │
│  │  │Constrai.│ │Fragility│ │Sensitiv.│ │Risk     │       │  │
│  │  │Hierarch.│ │         │ │Marginal │ │Scenario │       │  │
│  │  ├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤       │  │
│  │  │ScoreLift│ │Confid.  │ │Explain. │ │Action   │       │  │
│  │  │Simulate │ │         │ │         │ │Priority │       │  │
│  │  ├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤       │  │
│  │  │Reassess │ │Benchmark│ │Compare  │ │Integrity│       │  │
│  │  │Triggers │ │         │ │Reassess │ │Manifest │       │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          │                                      │
│              ┌───────────▼───────────────┐                     │
│              │   SUPABASE / POSTGRES     │                     │
│              │   (persistence layer)     │                     │
│              └───────────────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
```

### Key Architectural Principles

1. **Pure function pipeline**: Every engine is a pure function — no side effects, no external calls, no randomness.
2. **Orchestrator pattern**: A single orchestrator calls engines in dependency order and passes results forward.
3. **Versioned rulesets**: Every constant table, scoring rule, and threshold is versioned and checksummed.
4. **Immutable records**: Once an assessment is generated, its record is append-only. No mutation.
5. **Deterministic reproducibility**: `SHA-256(canonical_inputs + manifest_version)` → identical output, always.

### Deviation from Current Codebase

The current RP-1.0 uses a simple 60/40 mean-of-three formula with values [0, 25, 50, 75, 100]. This spec introduces:

- **Weighted factor scoring** with per-factor point tables (not simple averages)
- **Interaction penalties/bonuses** (cross-factor dependency)
- **Income quality & durability scoring** (extended inputs)
- **Fragility engine** with failure mode classification
- **Sensitivity/marginal impact analysis**
- **6 deterministic risk scenarios**
- **Score lift simulator**
- **Diagnostic confidence scoring**
- **Rich explainability objects**
- **Action prioritization with sequencing**
- **Reassessment trigger detection**
- **Canonical input remapping** from [0,25,50,75,100] → real-world numeric values

---

## 2. RECOMMENDED FOLDER STRUCTURE

```
src/
├── lib/
│   ├── engine/
│   │   ├── v2/                              # New versioned engine
│   │   │   ├── index.ts                     # Orchestrator — calls all engines in order
│   │   │   ├── types.ts                     # All domain types & interfaces
│   │   │   ├── constants.ts                 # Versioned constants & rulesets
│   │   │   ├── reason-codes.ts              # Centralized reason code registry
│   │   │   │
│   │   │   ├── engines/
│   │   │   │   ├── 01-input-validation.ts
│   │   │   │   ├── 02-profile-context.ts
│   │   │   │   ├── 03-income-normalization.ts
│   │   │   │   ├── 04-scoring.ts
│   │   │   │   ├── 05-band-classification.ts
│   │   │   │   ├── 06-structural-indicators.ts
│   │   │   │   ├── 07-cross-factor-dependency.ts
│   │   │   │   ├── 08-income-quality.ts
│   │   │   │   ├── 09-constraint-hierarchy.ts
│   │   │   │   ├── 10-fragility.ts
│   │   │   │   ├── 11-sensitivity.ts
│   │   │   │   ├── 12-risk-scenarios.ts
│   │   │   │   ├── 13-score-lift.ts
│   │   │   │   ├── 14-diagnostic-confidence.ts
│   │   │   │   ├── 15-explainability.ts
│   │   │   │   ├── 16-action-prioritization.ts
│   │   │   │   ├── 17-reassessment-triggers.ts
│   │   │   │   ├── 18-benchmarking.ts
│   │   │   │   ├── 19-comparative-reassessment.ts
│   │   │   │   └── 20-integrity-manifest.ts
│   │   │   │
│   │   │   ├── schemas/                     # Zod schemas
│   │   │   │   ├── input.schema.ts
│   │   │   │   ├── profile.schema.ts
│   │   │   │   ├── extended-input.schema.ts
│   │   │   │   └── output.schema.ts
│   │   │   │
│   │   │   └── data/
│   │   │       ├── sector-benchmarks.ts
│   │   │       ├── action-library.ts
│   │   │       ├── scenario-templates.ts
│   │   │       └── explanation-templates.ts
│   │   │
│   │   └── v1/                              # Current engine (preserved)
│   │       ├── scoring.ts
│   │       ├── constants.ts
│   │       └── ...
│   │
│   ├── db/
│   │   ├── schema.sql                       # PostgreSQL DDL
│   │   ├── client.ts                        # Supabase client
│   │   ├── queries/
│   │   │   ├── assessments.ts
│   │   │   ├── users.ts
│   │   │   └── benchmarks.ts
│   │   └── migrations/
│   │       └── 001_initial.sql
│   │
│   └── utils/
│       ├── hash.ts                          # SHA-256 utilities
│       └── format.ts                        # Number/label formatting
│
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                         # Landing
│   │   ├── pricing/page.tsx
│   │   └── ...
│   │
│   ├── (app)/
│   │   ├── intake/page.tsx                  # Assessment intake flow
│   │   ├── review-answers/page.tsx          # Answer review before submit
│   │   ├── processing/page.tsx              # Generation state
│   │   ├── report/[id]/page.tsx             # Premium report
│   │   ├── verify/[id]/page.tsx             # Verification page
│   │   ├── compare/page.tsx                 # Reassessment compare
│   │   ├── advisor/[id]/page.tsx            # Advisor summary
│   │   └── history/page.tsx                 # Assessment history
│   │
│   └── api/
│       └── v2/
│           ├── assessment/
│           │   ├── create/route.ts
│           │   ├── save-progress/route.ts
│           │   ├── submit/route.ts
│           │   └── [id]/route.ts
│           ├── report/[id]/route.ts
│           ├── verify/[id]/route.ts
│           ├── compare/route.ts
│           └── advisor/[id]/route.ts
│
└── components/
    ├── intake/
    │   ├── QuestionCard.tsx
    │   ├── AnswerOption.tsx
    │   ├── ProgressBar.tsx
    │   ├── DefinitionDrawer.tsx
    │   └── ReviewSummary.tsx
    │
    ├── report/
    │   ├── ExecutiveDiagnostic.tsx
    │   ├── ScoreBand.tsx
    │   ├── WhyNotHigher.tsx
    │   ├── IndicatorBreakdown.tsx
    │   ├── ConstraintHierarchy.tsx
    │   ├── FragilityFailureMode.tsx
    │   ├── StressTestScenarios.tsx
    │   ├── ScoreLiftBlueprint.tsx
    │   ├── HighestImpactActions.tsx
    │   ├── ReassessmentTriggers.tsx
    │   ├── PeerClusterContext.tsx
    │   └── VerificationFooter.tsx
    │
    └── shared/
        ├── PageHeader.tsx
        ├── DiagnosticCard.tsx
        ├── MetricRow.tsx
        └── SectionDivider.tsx

tests/
├── engines/
│   ├── input-validation.test.ts
│   ├── scoring.test.ts
│   ├── band-classification.test.ts
│   ├── cross-factor-dependency.test.ts
│   ├── income-quality.test.ts
│   ├── constraint-hierarchy.test.ts
│   ├── fragility.test.ts
│   ├── sensitivity.test.ts
│   ├── risk-scenarios.test.ts
│   ├── score-lift.test.ts
│   ├── confidence.test.ts
│   ├── explainability.test.ts
│   ├── action-prioritization.test.ts
│   ├── reassessment-triggers.test.ts
│   ├── benchmarking.test.ts
│   ├── integrity.test.ts
│   └── orchestrator.test.ts
├── integration/
│   ├── full-pipeline.test.ts
│   ├── exhaustive-combos.test.ts
│   └── snapshot.test.ts
└── fixtures/
    ├── canonical-inputs.ts
    └── expected-outputs.ts
```

---

## 3. FRONTEND APPLICATION SPEC

### Design System Constants

```typescript
// src/lib/design-tokens.ts

export const COLORS = {
  // Neutrals
  background:    "#FAFAF9",    // Warm off-white
  surface:       "#FFFFFF",
  surfaceAlt:    "#F5F5F4",    // Stone 100
  border:        "#E7E5E4",    // Stone 200
  borderSubtle:  "#F5F5F4",    // Stone 100
  textPrimary:   "#1C1917",    // Stone 900
  textSecondary: "#57534E",    // Stone 600
  textTertiary:  "#A8A29E",    // Stone 400

  // Accent — single institutional blue
  accent:        "#1E3A5F",    // Deep navy
  accentLight:   "#2C5282",    // Slightly lighter
  accentMuted:   "#EBF0F5",    // Very light wash

  // Band colors
  bandLimited:      "#991B1B",  // Red 800
  bandDeveloping:   "#B45309",  // Amber 700
  bandEstablished:  "#1D4ED8",  // Blue 700
  bandHigh:         "#15803D",  // Green 700

  // Functional
  warning:       "#92400E",
  error:         "#991B1B",
  success:       "#166534",
} as const;

export const TYPOGRAPHY = {
  fontFamily:    "'Inter', system-ui, -apple-system, sans-serif",
  fontDisplay:   "'Newsreader', 'Georgia', serif",  // For headings

  // Scale
  xs:    "0.75rem",    // 12px
  sm:    "0.875rem",   // 14px
  base:  "1rem",       // 16px
  lg:    "1.125rem",   // 18px
  xl:    "1.25rem",    // 20px
  "2xl": "1.5rem",     // 24px
  "3xl": "1.875rem",   // 30px
  "4xl": "2.25rem",    // 36px
  "5xl": "3rem",       // 48px
} as const;

export const SPACING = {
  page:    "max-w-[720px] mx-auto px-6",  // Narrow content column
  section: "py-16 md:py-24",
  card:    "p-8 md:p-10",
} as const;
```

### Global Layout Rules

- Max content width: 720px for report/intake, 1080px for marketing
- Minimum tap target: 48px
- Section spacing: 64px mobile, 96px desktop
- Card border: 1px solid border color, no shadow (or 1px shadow max)
- No border-radius > 8px
- No gradients anywhere in report or intake
- Typography: serif for major headings, sans-serif for body

---

## 4. BACKEND ENGINE ARCHITECTURE

### Orchestrator Pipeline

The orchestrator calls engines in strict dependency order. Each engine receives only the outputs it needs from prior engines.

```typescript
// src/lib/engine/v2/index.ts

export function executeAssessment(
  rawInputs: RawDiagnosticInput,
  profile: ProfileContext,
  extendedInputs?: ExtendedInputs,
  priorAssessment?: AssessmentRecord | null,
  benchmarkData?: SectorBenchmarkData | null,
): AssessmentResult {

  // 1. Validate
  const validated = validateInputs(rawInputs);
  const validatedProfile = validateProfile(profile);
  const validatedExtended = validateExtendedInputs(extendedInputs);

  // 2. Profile Context Resolution
  const resolvedProfile = resolveProfileContext(validatedProfile);

  // 3. Normalize to canonical values
  const normalized = normalizeInputs(validated);

  // 4. Score
  const scores = computeScores(normalized);

  // 5. Cross-Factor Dependency (penalties/bonuses)
  const interactions = computeInteractions(normalized, validatedExtended);

  // 6. Apply interactions to score
  const adjustedScores = applyInteractions(scores, interactions);

  // 7. Band Classification
  const bands = classifyBand(adjustedScores, normalized);

  // 8. Structural Indicators
  const indicators = computeIndicators(normalized);

  // 9. Income Quality & Durability
  const quality = computeQuality(normalized, validatedExtended);

  // 10. Constraint Hierarchy
  const constraints = computeConstraints(
    normalized, adjustedScores, interactions, quality
  );

  // 11. Fragility
  const fragility = computeFragility(normalized, quality);

  // 12. Sensitivity / Marginal Impact
  const sensitivity = computeSensitivity(normalized, validatedExtended);

  // 13. Risk Scenarios
  const scenarios = computeRiskScenarios(normalized, adjustedScores, quality);

  // 14. Score Lift Simulator
  const scoreLift = computeScoreLift(normalized, validatedExtended);

  // 15. Diagnostic Confidence
  const confidence = computeConfidence(
    normalized, validatedExtended, resolvedProfile, sensitivity
  );

  // 16. Explainability
  const explainability = generateExplainability(
    adjustedScores, bands, constraints, interactions,
    sensitivity, fragility, quality
  );

  // 17. Action Prioritization
  const actions = prioritizeActions(
    constraints, fragility, sensitivity, resolvedProfile
  );

  // 18. Reassessment Triggers
  const triggers = computeReassessmentTriggers(
    normalized, adjustedScores, quality
  );

  // 19. Benchmarking
  const benchmarks = computeBenchmarks(
    adjustedScores, resolvedProfile, benchmarkData
  );

  // 20. Comparative Reassessment (if prior exists)
  const comparison = priorAssessment
    ? computeComparison(adjustedScores, priorAssessment)
    : null;

  // 21. Integrity & Manifest
  const integrity = computeIntegrity(
    normalized, adjustedScores, resolvedProfile
  );

  return assembleRecord({
    validated, normalized, resolvedProfile, validatedExtended,
    adjustedScores, interactions, bands, indicators, quality,
    constraints, fragility, sensitivity, scenarios, scoreLift,
    confidence, explainability, actions, triggers, benchmarks,
    comparison, integrity,
  });
}
```

### Engine Contract

Every engine follows this pattern:

```typescript
// Pure function — no side effects
export function computeX(
  ...deterministic inputs
): XResult {
  // All logic is deterministic
  // All constants come from versioned rulesets
  // All math uses integer or clamped arithmetic
  // Returns a strongly-typed result object
}
```

---

## 5. TYPESCRIPT DOMAIN MODELS AND INTERFACES

```typescript
// src/lib/engine/v2/types.ts

// ─── ANSWER VALUES ───────────────────────────────────────

/** Raw answer selection from intake form */
export type AnswerChoice = "A" | "B" | "C" | "D" | "E";

// ─── RAW INPUTS (from intake form) ──────────────────────

export interface RawDiagnosticInput {
  q1_recurring_revenue_base: AnswerChoice;
  q2_income_concentration: AnswerChoice;
  q3_income_source_diversity: AnswerChoice;
  q4_forward_revenue_visibility: AnswerChoice;
  q5_earnings_variability: AnswerChoice;
  q6_income_continuity_without_labor: AnswerChoice;
}

// ─── CANONICAL INPUTS (normalized to numeric) ───────────

export interface CanonicalInput {
  income_persistence_pct: number;         // 0–100
  largest_source_pct: number;             // 0–100
  source_diversity_count: number;         // 1–8+
  forward_secured_pct: number;            // 0–100
  income_variability_level: VariabilityLevel;
  labor_dependence_pct: number;           // 0–100
}

export type VariabilityLevel = "low" | "moderate" | "high" | "extreme";

// ─── PROFILE CONTEXT ────────────────────────────────────

export type ProfileClass = "individual" | "business_owner" | "hybrid";

export type OperatingStructure =
  | "solo_service"
  | "small_agency"
  | "commissioned_operator"
  | "retained_advisor"
  | "creator_operator"
  | "productized_service"
  | "portfolio_operator"
  | "asset_supported";

export type PrimaryIncomeModel =
  | "commission"
  | "retainer"
  | "project_fee"
  | "subscription"
  | "salary"
  | "mixed_services"
  | "licensing"
  | "rental"
  | "ecommerce"
  | "digital_products"
  | "other";

export type RevenueStructure =
  | "active_heavy"
  | "hybrid"
  | "recurring_heavy"
  | "asset_heavy"
  | "mixed";

export type IndustrySector =
  | "real_estate"
  | "finance_banking"
  | "insurance"
  | "technology"
  | "healthcare"
  | "legal_services"
  | "consulting_professional_services"
  | "sales_brokerage"
  | "media_entertainment"
  | "construction_trades"
  | "retail_ecommerce"
  | "hospitality_food_service"
  | "transportation_logistics"
  | "manufacturing"
  | "education"
  | "nonprofit_public_sector"
  | "agriculture"
  | "energy_utilities"
  | "other";

export type MaturityStage = "early" | "developing" | "established";

export interface ProfileContext {
  profile_class: ProfileClass;
  operating_structure: OperatingStructure;
  primary_income_model: PrimaryIncomeModel;
  revenue_structure: RevenueStructure;
  industry_sector: IndustrySector;
  maturity_stage: MaturityStage;
}

// ─── EXTENDED INPUTS (optional) ─────────────────────────

export type RiskLevel = "low" | "moderate" | "high";

export interface ExtendedInputs {
  recurring_contract_term_months_avg?: number;
  cancellation_risk_level?: RiskLevel;
  platform_dependency_level?: RiskLevel;
  customer_concentration_within_recurring_level?: RiskLevel;
  months_of_visibility?: number;
  repeat_revenue_pct?: number;
  asset_backed_income_pct?: number;
  booked_but_cancelable_pct?: number;
  historical_assessment_count?: number;
}

// ─── SCORING OUTPUTS ────────────────────────────────────

export interface ScoreBreakdown {
  overall_score: number;              // 0–100
  structure_score: number;            // 0–60
  stability_score: number;            // 0–40
  continuity_score: number;           // 0–10
  concentration_resilience_score: number;  // 0–10
  forward_security_score: number;     // 0–15
  labor_dependence_score: number;     // 0–20
  quality_adjustment: number;         // 0–10
  fragility_score: number;            // 0–100
}

export type StabilityBand =
  | "Limited Stability"
  | "Developing Stability"
  | "Established Stability"
  | "High Stability";

export type SubBandLabel = string;  // e.g., "Limited Stability / Concentration Risk"

export interface BandClassification {
  primary_band: StabilityBand;
  sub_band: SubBandLabel;
  warning_overlays: WarningOverlay[];
}

export interface WarningOverlay {
  code: string;
  label: string;
  trigger: string;
}

// ─── INTERACTION EFFECTS ────────────────────────────────

export interface InteractionEffect {
  code: string;              // "CF-01", "CF-B01"
  type: "penalty" | "bonus";
  points: number;            // negative for penalty, positive for bonus
  trigger_condition: string;
  factors_involved: string[];
}

export interface InteractionResult {
  effects: InteractionEffect[];
  total_penalty: number;
  total_bonus: number;
  net_adjustment: number;    // clamped to [-20, +8]
}

// ─── INCOME QUALITY ─────────────────────────────────────

export type DurabilityGrade =
  | "fragile"
  | "thin"
  | "moderate"
  | "durable"
  | "highly_durable";

export interface QualityResult {
  quality_score: number;           // 0–10
  durability_grade: DurabilityGrade;
  adjustments: QualityAdjustment[];
}

export interface QualityAdjustment {
  factor: string;
  delta: number;
  reason: string;
}

// ─── STRUCTURAL INDICATORS ─────────────────────────────

export interface StructuralIndicator {
  key: string;
  label: string;
  raw_value: number;
  normalized_value: number;  // 0–100
  level: "very_low" | "low" | "moderate" | "high" | "very_high";
}

// ─── CONSTRAINT HIERARCHY ───────────────────────────────

export type ConstraintKey =
  | "weak_forward_visibility"
  | "high_labor_dependence"
  | "high_concentration"
  | "low_persistence"
  | "high_variability"
  | "weak_durability"
  | "shallow_continuity";

export interface ConstraintHierarchy {
  root_constraint: ConstraintKey;
  primary_constraint: ConstraintKey;
  secondary_constraint: ConstraintKey;
  dependent_constraint: ConstraintKey | null;
  hidden_unlock: ConstraintKey | null;
}

// ─── FRAGILITY ──────────────────────────────────────────

export type FragilityClass =
  | "brittle"
  | "thin"
  | "uneven"
  | "supported"
  | "resilient";

export type FailureMode =
  | "concentration_collapse"
  | "labor_interruption"
  | "visibility_gap"
  | "durability_thinness";

export interface FragilityResult {
  fragility_score: number;         // 0–100
  fragility_class: FragilityClass;
  deductions: FragilityDeduction[];
  primary_failure_mode: FailureMode;
  secondary_failure_modes: FailureMode[];
}

export interface FragilityDeduction {
  trigger: string;
  points: number;
  condition_met: boolean;
}

// ─── SENSITIVITY ────────────────────────────────────────

export interface SensitivityResult {
  tests: SensitivityTest[];
  highest_lift_factor: string;
  bottleneck_factor: string;
  low_return_factor: string;
}

export interface SensitivityTest {
  factor: string;
  delta_description: string;
  original_score: number;
  projected_score: number;
  lift: number;
  rank: number;
}

// ─── RISK SCENARIOS ─────────────────────────────────────

export interface RiskScenario {
  scenario_id: string;
  label: string;
  description: string;
  original_score: number;
  scenario_score: number;
  score_drop: number;
  original_band: StabilityBand;
  scenario_band: StabilityBand;
  band_shift: boolean;
  narrative: string;
}

// ─── SCORE LIFT ─────────────────────────────────────────

export interface ScoreLiftProjection {
  lift_scenarios: LiftScenario[];
  combined_top_two: LiftScenario;
  highest_single_lift: LiftScenario;
}

export interface LiftScenario {
  scenario_id: string;
  label: string;
  change_description: string;
  original_score: number;
  projected_score: number;
  lift: number;
  projected_band: StabilityBand;
  band_shift: boolean;
}

// ─── DIAGNOSTIC CONFIDENCE ──────────────────────────────

export type ConfidenceLevel = "high" | "moderate" | "guarded" | "low";

export interface ConfidenceResult {
  confidence_score: number;         // 0–100
  confidence_level: ConfidenceLevel;
  deductions: ConfidenceDeduction[];
}

export interface ConfidenceDeduction {
  reason: string;
  points: number;
}

// ─── EXPLAINABILITY ─────────────────────────────────────

export interface ExplainabilityResult {
  why_this_score: string;
  why_not_higher: string;
  strongest_supports: string[];
  strongest_suppressors: string[];
  interaction_summary: string;
  best_lift_explanation: string;
  fragility_explanation: string;
}

// ─── ACTIONS ────────────────────────────────────────────

export interface RecommendedAction {
  action_id: string;
  priority: number;           // 1 = highest
  label: string;
  description: string;
  category: string;
  expected_impact: string;
  blocked_until?: string;     // action_id of prerequisite
  sequencing_note?: string;
}

export interface ActionResult {
  recommended_actions: RecommendedAction[];
  avoid_actions: AvoidAction[];
}

export interface AvoidAction {
  action_id: string;
  label: string;
  reason: string;
}

// ─── REASSESSMENT ───────────────────────────────────────

export interface ReassessmentTrigger {
  trigger_id: string;
  condition: string;
  threshold: string;
  current_value: string;
  description: string;
}

// ─── BENCHMARKING ───────────────────────────────────────

export interface BenchmarkResult {
  peer_percentile: number;
  cluster_average_score: number;
  top_20_threshold: number;
  peer_band_distribution: {
    limited: number;
    developing: number;
    established: number;
    high: number;
  };
  outlier_dimensions: OutlierDimension[];
}

export interface OutlierDimension {
  factor: string;
  user_value: number;
  peer_average: number;
  direction: "above" | "below";
  magnitude: "slight" | "notable" | "significant";
}

// ─── COMPARATIVE REASSESSMENT ───────────────────────────

export interface ComparisonResult {
  prior_assessment_id: string;
  prior_overall_score: number;
  current_overall_score: number;
  score_delta: number;
  prior_band: StabilityBand;
  current_band: StabilityBand;
  band_changed: boolean;
  factor_deltas: FactorDelta[];
  improvement_narrative: string;
}

export interface FactorDelta {
  factor: string;
  prior_value: number;
  current_value: number;
  delta: number;
  direction: "improved" | "declined" | "unchanged";
}

// ─── INTEGRITY ──────────────────────────────────────────

export interface IntegrityResult {
  input_hash: string;
  output_hash: string;
  manifest_hash: string;
  record_hash: string;
}

export interface ModelManifest {
  model_version: "RP-1.0";
  factor_version: "F-1.0";
  scenario_version: "S-1.0";
  benchmark_version: "B-1.0";
  explanation_version: "E-1.0";
}

// ─── REASON CODES ───────────────────────────────────────

export interface ReasonCode {
  code: string;          // e.g., "VAL-001", "SCR-003"
  category: ReasonCategory;
  severity: "info" | "warning" | "critical";
  message: string;
  details?: string;
}

export type ReasonCategory =
  | "validation"
  | "context"
  | "normalization"
  | "scoring"
  | "indicators"
  | "interactions"
  | "quality"
  | "constraints"
  | "fragility"
  | "sensitivity"
  | "scenarios"
  | "lift"
  | "confidence"
  | "explainability"
  | "actions"
  | "reassessment"
  | "benchmarking"
  | "integrity";

// ─── FULL ASSESSMENT RECORD ─────────────────────────────

export interface AssessmentRecord {
  assessment_id: string;
  created_at: string;        // ISO 8601
  model_manifest: ModelManifest;

  // Inputs
  raw_inputs: RawDiagnosticInput;
  validated_inputs: RawDiagnosticInput;
  normalized_inputs: CanonicalInput;
  profile_context: ProfileContext;
  extended_inputs: ExtendedInputs | null;

  // Scoring
  scores: ScoreBreakdown;
  bands: BandClassification;

  // Analysis
  indicators: StructuralIndicator[];
  interactions: InteractionResult;
  quality: QualityResult;
  constraints: ConstraintHierarchy;
  fragility: FragilityResult;
  sensitivity: SensitivityResult;
  scenarios: RiskScenario[];
  score_lift_projection: ScoreLiftProjection;
  confidence: ConfidenceResult;

  // Presentation
  explainability: ExplainabilityResult;
  recommended_actions: RecommendedAction[];
  avoid_actions: AvoidAction[];
  reassessment_triggers: ReassessmentTrigger[];
  benchmarks: BenchmarkResult | null;
  comparison: ComparisonResult | null;

  // Governance
  reason_codes: ReasonCode[];
  integrity: IntegrityResult;
}
```

---

## 6. VERSIONED CONSTANTS AND SCORING RULESETS

```typescript
// src/lib/engine/v2/constants.ts

// ─── MODEL IDENTITY ─────────────────────────────────────

export const MODEL_VERSION = "RP-1.0" as const;
export const FACTOR_VERSION = "F-1.0" as const;
export const SCENARIO_VERSION = "S-1.0" as const;
export const BENCHMARK_VERSION = "B-1.0" as const;
export const EXPLANATION_VERSION = "E-1.0" as const;

// ─── ANSWER → CANONICAL MAPPING ─────────────────────────

/**
 * Q1 — Recurring or Continuing Revenue Base
 * Maps to: income_persistence_pct
 * Strategy: midpoint of each range
 */
export const Q1_MAPPING: Record<string, number> = {
  A: 5,    // 0–10% → midpoint 5
  B: 20,   // 11–30% → midpoint 20.5, rounded to 20
  C: 45,   // 31–60% → midpoint 45.5, rounded to 45
  D: 73,   // 61–85% → midpoint 73
  E: 93,   // 86–100% → midpoint 93
} as const;

/**
 * Q2 — Income Concentration
 * Maps to: largest_source_pct
 * NOTE: This question is INVERSE — high % = bad
 * Strategy: midpoint of each range
 */
export const Q2_MAPPING: Record<string, number> = {
  A: 95,   // 90–100% → midpoint 95
  B: 80,   // 70–89% → midpoint 79.5, rounded to 80
  C: 60,   // 50–69% → midpoint 59.5, rounded to 60
  D: 40,   // 30–49% → midpoint 39.5, rounded to 40
  E: 15,   // Under 30% → midpoint 15
} as const;

/**
 * Q3 — Meaningful Income Source Diversity
 * Maps to: source_diversity_count
 * Strategy: midpoint of each range (or exact value)
 */
export const Q3_MAPPING: Record<string, number> = {
  A: 1,    // 1
  B: 2,    // 2
  C: 3,    // 3–4 → floor midpoint 3
  D: 6,    // 5–7 → midpoint 6
  E: 8,    // 8+ → representative 8
} as const;

/**
 * Q4 — Forward Revenue Visibility
 * Maps to: forward_secured_pct
 * Strategy: convert months to estimated % of annual income secured
 *   < 1 month  → ~4% secured
 *   1–2 months → ~12%
 *   3–5 months → ~33%
 *   6–11 months → ~71%
 *   12+ months → ~100%
 */
export const Q4_MAPPING: Record<string, number> = {
  A: 4,    // < 1 month
  B: 12,   // 1–2 months
  C: 33,   // 3–5 months
  D: 71,   // 6–11 months
  E: 100,  // 12+ months
} as const;

/**
 * Q5 — Earnings Variability
 * Maps to: income_variability_level
 * NOTE: This question is INVERSE — high variability = bad
 */
export const Q5_MAPPING: Record<string, VariabilityLevel> = {
  A: "extreme",   // More than 75%
  B: "high",      // 50–75%
  C: "moderate",  // 25–49%
  D: "low",       // 10–24%
  E: "low",       // Less than 10%
} as const;

/**
 * Q5 — Also map to numeric for scoring formulas that need it
 */
export const Q5_NUMERIC_MAPPING: Record<string, number> = {
  A: 88,   // More than 75% variability → midpoint 87.5, rounded
  B: 63,   // 50–75% → midpoint 62.5, rounded
  C: 37,   // 25–49% → midpoint 37
  D: 17,   // 10–24% → midpoint 17
  E: 5,    // Less than 10% → midpoint 5
} as const;

/**
 * Q6 — Income Continuity Without Active Labor
 * Maps to: labor_dependence_pct (INVERSE of continuity)
 * Strategy: midpoint, then invert
 *   0% continuity → 100% labor dependent
 *   1–25% → 87% labor dependent
 *   26–50% → 62%
 *   51–75% → 37%
 *   76–100% → 12%
 */
export const Q6_MAPPING: Record<string, number> = {
  A: 100,  // 0% continuity → 100% labor dependent
  B: 87,   // 1–25% continuity → midpoint 13%, invert to 87%
  C: 62,   // 26–50% → midpoint 38%, invert to 62%
  D: 37,   // 51–75% → midpoint 63%, invert to 37%
  E: 12,   // 76–100% → midpoint 88%, invert to 12%
} as const;

// ─── FACTOR SCORING TABLES ──────────────────────────────

/**
 * income_persistence_pct → 0–15 points
 */
export const INCOME_PERSISTENCE_SCORE_TABLE: [number, number, number][] = [
  // [min, max, points]
  [0,   10,  1],
  [11,  20,  3],
  [21,  35,  5],
  [36,  50,  8],
  [51,  65,  11],
  [66,  80,  13],
  [81,  100, 15],
] as const;

/**
 * source_diversity_count → 0–10 points
 */
export const SOURCE_DIVERSITY_SCORE_TABLE: [number, number][] = [
  // [count, points]
  [1, 1],
  [2, 3],
  [3, 5],
  [4, 7],
  [5, 8],
  [6, 10],  // 6+ → 10
] as const;

/**
 * forward_secured_pct → 0–15 points
 */
export const FORWARD_SECURED_SCORE_TABLE: [number, number, number][] = [
  [0,   5,   0],
  [6,   15,  2],
  [16,  30,  5],
  [31,  45,  8],
  [46,  60,  11],
  [61,  75,  13],
  [76,  100, 15],
] as const;

/**
 * largest_source_pct (inverse) → 0–10 points
 * NOTE: Lower largest_source_pct = more diversified = higher score
 */
export const CONCENTRATION_INVERSE_SCORE_TABLE: [number, number, number][] = [
  [0,   20,  10],
  [21,  35,  8],
  [36,  50,  6],
  [51,  65,  4],
  [66,  80,  2],
  [81,  100, 0],
] as const;

/**
 * labor_dependence_pct (inverse) → 0–20 points
 * NOTE: Lower labor_dependence_pct = more independent = higher score
 */
export const LABOR_DEPENDENCE_INVERSE_SCORE_TABLE: [number, number, number][] = [
  [0,   20,  20],
  [21,  35,  17],
  [36,  50,  14],
  [51,  65,  10],
  [66,  80,  6],
  [81,  100, 2],
] as const;

/**
 * income_variability_level (inverse) → 0–10 points
 */
export const VARIABILITY_INVERSE_SCORE_TABLE: Record<string, number> = {
  low: 10,
  moderate: 7,
  high: 3,
  extreme: 0,
} as const;

/**
 * continuity_months → 0–10 points
 */
export const CONTINUITY_SCORE_TABLE: [number, number, number][] = [
  [0,    0.9, 0],
  [1.0,  1.9, 2],
  [2.0,  2.9, 4],
  [3.0,  4.4, 6],
  [4.5,  6.0, 8],
  [6.01, 12,  10],
] as const;

// ─── BAND THRESHOLDS ────────────────────────────────────

export const BAND_THRESHOLDS = [
  { min: 0,  max: 29,  band: "Limited Stability" },
  { min: 30, max: 49,  band: "Developing Stability" },
  { min: 50, max: 74,  band: "Established Stability" },
  { min: 75, max: 100, band: "High Stability" },
] as const;

// ─── WARNING OVERLAY TRIGGERS ───────────────────────────

export const WARNING_OVERLAY_RULES = [
  {
    code: "WRN-FRAG",
    label: "Fragility Warning",
    condition: (fragility_score: number) => fragility_score <= 25,
    trigger: "fragility_score <= 25",
  },
  {
    code: "WRN-CONC",
    label: "Concentration Risk",
    condition: (largest_source_pct: number) => largest_source_pct >= 70,
    trigger: "largest_source_pct >= 70",
  },
  {
    code: "WRN-LABOR",
    label: "Labor-Heavy",
    condition: (labor_dependence_pct: number) => labor_dependence_pct >= 80,
    trigger: "labor_dependence_pct >= 80",
  },
  {
    code: "WRN-VIS",
    label: "Thin Visibility",
    condition: (forward_secured_pct: number) => forward_secured_pct <= 10,
    trigger: "forward_secured_pct <= 10",
  },
] as const;

// ─── INTERACTION PENALTY/BONUS RULES ────────────────────

export interface InteractionRule {
  code: string;
  type: "penalty" | "bonus";
  points: number;
  condition: (n: CanonicalInput, ext?: ExtendedInputs) => boolean;
  factors: string[];
  description: string;
}

export const INTERACTION_RULES: InteractionRule[] = [
  {
    code: "CF-01",
    type: "penalty",
    points: -8,
    condition: (n) => n.largest_source_pct >= 70 && n.forward_secured_pct <= 20,
    factors: ["largest_source_pct", "forward_secured_pct"],
    description: "High concentration with weak forward visibility",
  },
  {
    code: "CF-02",
    type: "penalty",
    points: -7,
    condition: (n) => n.labor_dependence_pct >= 75 && n.income_persistence_pct <= 25,
    factors: ["labor_dependence_pct", "income_persistence_pct"],
    description: "High labor dependence with low persistence",
  },
  {
    code: "CF-03",
    type: "penalty",
    points: -4,
    condition: (n) => n.source_diversity_count >= 4 && n.largest_source_pct >= 65,
    factors: ["source_diversity_count", "largest_source_pct"],
    description: "Diverse sources but still concentrated",
  },
  {
    code: "CF-04",
    type: "penalty",
    points: -5,
    condition: (n, ext) =>
      n.income_persistence_pct >= 50 &&
      ext?.cancellation_risk_level === "high",
    factors: ["income_persistence_pct", "cancellation_risk_level"],
    description: "Persistent revenue but high cancellation risk",
  },
  {
    code: "CF-05",
    type: "penalty",
    points: -4,
    condition: (n, ext) =>
      n.forward_secured_pct >= 40 &&
      (ext?.booked_but_cancelable_pct ?? 0) >= 50,
    factors: ["forward_secured_pct", "booked_but_cancelable_pct"],
    description: "Forward revenue mostly cancelable",
  },
  {
    code: "CF-06",
    type: "penalty",
    points: -6,
    condition: (n) =>
      n.source_diversity_count <= 2 &&
      n.income_variability_level === "extreme",
    factors: ["source_diversity_count", "income_variability_level"],
    description: "Few sources with extreme variability",
  },
  {
    code: "CF-B01",
    type: "bonus",
    points: 3,
    condition: (n) => n.forward_secured_pct >= 45 && n.largest_source_pct <= 35,
    factors: ["forward_secured_pct", "largest_source_pct"],
    description: "Strong visibility with low concentration",
  },
  {
    code: "CF-B02",
    type: "bonus",
    points: 4,
    condition: (n) => n.income_persistence_pct >= 60 && n.labor_dependence_pct <= 35,
    factors: ["income_persistence_pct", "labor_dependence_pct"],
    description: "High persistence with low labor dependence",
  },
];

export const MAX_SINGLE_BONUS = 4;
export const MAX_SINGLE_PENALTY = -8;
export const NET_ADJUSTMENT_CLAMP = { min: -20, max: 8 };

// ─── QUALITY ADJUSTMENT RULES ───────────────────────────

export const QUALITY_BASE = 5;
export const QUALITY_CLAMP = { min: 0, max: 10 };

export const QUALITY_RULES = [
  { field: "recurring_contract_term_months_avg", condition: (v: number) => v >= 12, delta: 2, reason: "Long contract terms (12+ months)" },
  { field: "recurring_contract_term_months_avg", condition: (v: number) => v >= 6 && v < 12, delta: 1, reason: "Moderate contract terms (6-11 months)" },
  { field: "recurring_contract_term_months_avg", condition: (v: number) => v <= 2, delta: -2, reason: "Very short contract terms (0-2 months)" },
  { field: "cancellation_risk_level", condition: (v: string) => v === "low", delta: 2, reason: "Low cancellation risk" },
  { field: "cancellation_risk_level", condition: (v: string) => v === "high", delta: -2, reason: "High cancellation risk" },
  { field: "platform_dependency_level", condition: (v: string) => v === "high", delta: -2, reason: "High platform dependency" },
  { field: "platform_dependency_level", condition: (v: string) => v === "moderate", delta: -1, reason: "Moderate platform dependency" },
  { field: "customer_concentration_within_recurring_level", condition: (v: string) => v === "high", delta: -2, reason: "High customer concentration in recurring" },
  { field: "customer_concentration_within_recurring_level", condition: (v: string) => v === "moderate", delta: -1, reason: "Moderate customer concentration in recurring" },
  { field: "booked_but_cancelable_pct", condition: (v: number) => v >= 50, delta: -2, reason: "High cancelable booked revenue" },
] as const;

export const DURABILITY_GRADE_TABLE: [number, number, DurabilityGrade][] = [
  [0, 2, "fragile"],
  [3, 4, "thin"],
  [5, 6, "moderate"],
  [7, 8, "durable"],
  [9, 10, "highly_durable"],
];

// ─── FRAGILITY DEDUCTION RULES ──────────────────────────

export const FRAGILITY_BASE = 100;

export const FRAGILITY_RULES = [
  { condition: (n: CanonicalInput) => n.largest_source_pct >= 70, points: -25, trigger: "largest_source_pct >= 70" },
  { condition: (n: CanonicalInput) => n.labor_dependence_pct >= 80, points: -20, trigger: "labor_dependence_pct >= 80" },
  { condition: (n: CanonicalInput) => n.forward_secured_pct <= 10, points: -20, trigger: "forward_secured_pct <= 10" },
  { condition: (n: CanonicalInput, _q: QualityResult, vl: VariabilityLevel) => vl === "high", points: -10, trigger: "variability = high" },
  { condition: (n: CanonicalInput, _q: QualityResult, vl: VariabilityLevel) => vl === "extreme", points: -20, trigger: "variability = extreme" },
  { condition: (n: CanonicalInput, _q: QualityResult, _vl: VariabilityLevel, cm: number) => cm < 1, points: -15, trigger: "continuity_months < 1" },
  { condition: (_n: CanonicalInput, q: QualityResult) => q.durability_grade === "fragile", points: -15, trigger: "durability_grade = fragile" },
];

export const FRAGILITY_CLASS_TABLE: [number, number, FragilityClass][] = [
  [0,  24,  "brittle"],
  [25, 44,  "thin"],
  [45, 64,  "uneven"],
  [65, 79,  "supported"],
  [80, 100, "resilient"],
];

// ─── SENSITIVITY TEST DEFINITIONS ───────────────────────

export const SENSITIVITY_TESTS = [
  { factor: "forward_secured_pct", delta: 15, description: "+15 forward secured %" },
  { factor: "largest_source_pct", delta: -15, description: "-15 largest source %" },
  { factor: "labor_dependence_pct", delta: -15, description: "-15 labor dependence %" },
  { factor: "income_persistence_pct", delta: 15, description: "+15 income persistence %" },
  { factor: "source_diversity_count", delta: 2, description: "+2 income sources" },
  { factor: "quality_score", delta: 2, description: "+2 quality score" },
] as const;

// ─── CONFIDENCE DEDUCTION RULES ─────────────────────────

export const CONFIDENCE_BASE = 100;

export const CONFIDENCE_LEVELS: [number, number, ConfidenceLevel][] = [
  [85, 100, "high"],
  [65, 84,  "moderate"],
  [45, 64,  "guarded"],
  [0,  44,  "low"],
];

// ─── RISK SCENARIO DEFINITIONS ──────────────────────────

export const RISK_SCENARIO_TEMPLATES = [
  {
    scenario_id: "RS-01",
    label: "Largest Source Removed",
    description: "Your single largest income source is lost entirely.",
  },
  {
    scenario_id: "RS-02",
    label: "Active Labor Interrupted",
    description: "You are unable to perform active work for 90 days.",
  },
  {
    scenario_id: "RS-03",
    label: "Forward Commitments Delayed",
    description: "All booked forward revenue is delayed by 3 months.",
  },
  {
    scenario_id: "RS-04",
    label: "Recurring Stream Degrades",
    description: "Your recurring/continuing revenue drops by 40%.",
  },
  {
    scenario_id: "RS-05",
    label: "High Volatility Month",
    description: "You experience a month at your historical low income level.",
  },
  {
    scenario_id: "RS-06",
    label: "Platform Dependency Shock",
    description: "A platform you depend on changes terms or access.",
  },
] as const;

// ─── SCORE LIFT SCENARIO DEFINITIONS ────────────────────

export const LIFT_SCENARIO_TEMPLATES = [
  {
    scenario_id: "LS-01",
    label: "Extend Forward Visibility",
    factor: "forward_secured_pct",
    delta: 15,
  },
  {
    scenario_id: "LS-02",
    label: "Reduce Concentration",
    factor: "largest_source_pct",
    delta: -15,
  },
  {
    scenario_id: "LS-03",
    label: "Reduce Labor Dependence",
    factor: "labor_dependence_pct",
    delta: -15,
  },
  {
    scenario_id: "LS-04",
    label: "Increase Persistent Revenue",
    factor: "income_persistence_pct",
    delta: 15,
  },
  {
    scenario_id: "LS-05",
    label: "Improve Income Quality",
    factor: "quality_score",
    delta: 2,
  },
  {
    scenario_id: "LS-06",
    label: "Combined Top Two Moves",
    factor: "combined",
    delta: 0,  // Dynamically determined
  },
] as const;
```

---

## 7. BACKEND ENGINE-BY-ENGINE IMPLEMENTATION SPEC

### Engine 01 — Input Validation

```typescript
// src/lib/engine/v2/engines/01-input-validation.ts

import { z } from "zod";

const AnswerChoiceSchema = z.enum(["A", "B", "C", "D", "E"]);

export const RawDiagnosticInputSchema = z.object({
  q1_recurring_revenue_base: AnswerChoiceSchema,
  q2_income_concentration: AnswerChoiceSchema,
  q3_income_source_diversity: AnswerChoiceSchema,
  q4_forward_revenue_visibility: AnswerChoiceSchema,
  q5_earnings_variability: AnswerChoiceSchema,
  q6_income_continuity_without_labor: AnswerChoiceSchema,
}).strict();

export const ProfileContextSchema = z.object({
  profile_class: z.enum(["individual", "business_owner", "hybrid"]),
  operating_structure: z.enum([
    "solo_service", "small_agency", "commissioned_operator",
    "retained_advisor", "creator_operator", "productized_service",
    "portfolio_operator", "asset_supported",
  ]),
  primary_income_model: z.enum([
    "commission", "retainer", "project_fee", "subscription",
    "salary", "mixed_services", "licensing", "rental",
    "ecommerce", "digital_products", "other",
  ]),
  revenue_structure: z.enum([
    "active_heavy", "hybrid", "recurring_heavy", "asset_heavy", "mixed",
  ]),
  industry_sector: z.enum([
    "real_estate", "finance_banking", "insurance", "technology",
    "healthcare", "legal_services", "consulting_professional_services",
    "sales_brokerage", "media_entertainment", "construction_trades",
    "retail_ecommerce", "hospitality_food_service",
    "transportation_logistics", "manufacturing", "education",
    "nonprofit_public_sector", "agriculture", "energy_utilities", "other",
  ]),
  maturity_stage: z.enum(["early", "developing", "established"]),
}).strict();

const RiskLevelSchema = z.enum(["low", "moderate", "high"]);

export const ExtendedInputsSchema = z.object({
  recurring_contract_term_months_avg: z.number().min(0).max(120).optional(),
  cancellation_risk_level: RiskLevelSchema.optional(),
  platform_dependency_level: RiskLevelSchema.optional(),
  customer_concentration_within_recurring_level: RiskLevelSchema.optional(),
  months_of_visibility: z.number().min(0).max(60).optional(),
  repeat_revenue_pct: z.number().min(0).max(100).optional(),
  asset_backed_income_pct: z.number().min(0).max(100).optional(),
  booked_but_cancelable_pct: z.number().min(0).max(100).optional(),
  historical_assessment_count: z.number().int().min(0).optional(),
}).strict().optional();

export function validateInputs(raw: unknown): RawDiagnosticInput {
  return RawDiagnosticInputSchema.parse(raw);
}

export function validateProfile(raw: unknown): ProfileContext {
  return ProfileContextSchema.parse(raw);
}

export function validateExtendedInputs(raw: unknown): ExtendedInputs | null {
  if (!raw) return null;
  return ExtendedInputsSchema.parse(raw) ?? null;
}
```

### Engine 02 — Profile Context Resolution

```typescript
// src/lib/engine/v2/engines/02-profile-context.ts

export interface ResolvedProfile extends ProfileContext {
  profile_archetype: string;
  is_labor_primary: boolean;
  is_asset_primary: boolean;
  is_recurring_model: boolean;
  is_project_model: boolean;
}

const LABOR_PRIMARY_STRUCTURES: OperatingStructure[] = [
  "solo_service", "commissioned_operator", "creator_operator",
];

const ASSET_PRIMARY_STRUCTURES: OperatingStructure[] = [
  "portfolio_operator", "asset_supported",
];

const RECURRING_MODELS: PrimaryIncomeModel[] = [
  "retainer", "subscription", "licensing", "rental",
];

const PROJECT_MODELS: PrimaryIncomeModel[] = [
  "commission", "project_fee",
];

export function resolveProfileContext(profile: ProfileContext): ResolvedProfile {
  const is_labor_primary = LABOR_PRIMARY_STRUCTURES.includes(profile.operating_structure);
  const is_asset_primary = ASSET_PRIMARY_STRUCTURES.includes(profile.operating_structure);
  const is_recurring_model = RECURRING_MODELS.includes(profile.primary_income_model);
  const is_project_model = PROJECT_MODELS.includes(profile.primary_income_model);

  // Derive archetype from combination
  let profile_archetype: string;
  if (is_asset_primary && is_recurring_model) {
    profile_archetype = "asset_recurring";
  } else if (is_asset_primary) {
    profile_archetype = "asset_diversified";
  } else if (is_labor_primary && is_project_model) {
    profile_archetype = "labor_project";
  } else if (is_labor_primary && is_recurring_model) {
    profile_archetype = "labor_transitioning";
  } else if (is_labor_primary) {
    profile_archetype = "labor_active";
  } else if (is_recurring_model) {
    profile_archetype = "hybrid_recurring";
  } else {
    profile_archetype = "hybrid_mixed";
  }

  return {
    ...profile,
    profile_archetype,
    is_labor_primary,
    is_asset_primary,
    is_recurring_model,
    is_project_model,
  };
}
```

### Engine 03 — Income Structure Normalization

```typescript
// src/lib/engine/v2/engines/03-income-normalization.ts

import {
  Q1_MAPPING, Q2_MAPPING, Q3_MAPPING, Q4_MAPPING,
  Q5_MAPPING, Q5_NUMERIC_MAPPING, Q6_MAPPING,
} from "../constants";

export function normalizeInputs(raw: RawDiagnosticInput): CanonicalInput {
  return {
    income_persistence_pct: Q1_MAPPING[raw.q1_recurring_revenue_base],
    largest_source_pct: Q2_MAPPING[raw.q2_income_concentration],
    source_diversity_count: Q3_MAPPING[raw.q3_income_source_diversity],
    forward_secured_pct: Q4_MAPPING[raw.q4_forward_revenue_visibility],
    income_variability_level: Q5_MAPPING[raw.q5_earnings_variability],
    labor_dependence_pct: Q6_MAPPING[raw.q6_income_continuity_without_labor],
  };
}

/** Utility: get numeric variability value for formulas */
export function getVariabilityNumeric(raw: RawDiagnosticInput): number {
  return Q5_NUMERIC_MAPPING[raw.q5_earnings_variability];
}
```

### Engine 04 — Deterministic Scoring

```typescript
// src/lib/engine/v2/engines/04-scoring.ts

import {
  INCOME_PERSISTENCE_SCORE_TABLE,
  SOURCE_DIVERSITY_SCORE_TABLE,
  FORWARD_SECURED_SCORE_TABLE,
  CONCENTRATION_INVERSE_SCORE_TABLE,
  LABOR_DEPENDENCE_INVERSE_SCORE_TABLE,
  VARIABILITY_INVERSE_SCORE_TABLE,
  CONTINUITY_SCORE_TABLE,
} from "../constants";

/** Look up score from a range table */
function lookupRangeScore(value: number, table: readonly [number, number, number][]): number {
  for (const [min, max, points] of table) {
    if (value >= min && value <= max) return points;
  }
  return 0;
}

/** Look up score from a count table */
function lookupCountScore(count: number, table: readonly [number, number][]): number {
  // Use last entry for values >= max defined count
  for (let i = table.length - 1; i >= 0; i--) {
    if (count >= table[i][0]) return table[i][1];
  }
  return table[0][1];
}

/** Compute continuity_months from canonical inputs */
export function computeContinuityMonths(n: CanonicalInput): number {
  const raw = (
    (n.income_persistence_pct * 0.03) +
    (n.forward_secured_pct * 0.04) +
    ((100 - n.labor_dependence_pct) * 0.02) -
    (n.largest_source_pct * 0.015)
  );
  return Math.min(12, Math.max(0, raw));
}

export interface RawScoreBreakdown {
  income_persistence_score: number;      // 0–15
  source_diversity_score: number;        // 0–10
  forward_security_score: number;        // 0–15
  concentration_resilience_score: number;// 0–10
  labor_dependence_score: number;        // 0–20
  variability_score: number;             // 0–10
  continuity_months: number;
  continuity_score: number;              // 0–10
  structure_subtotal: number;            // 0–50 (before quality)
  stability_subtotal: number;            // 0–40
  raw_total: number;                     // 0–90 (before quality adjustment)
}

export function computeRawScores(n: CanonicalInput): RawScoreBreakdown {
  const income_persistence_score = lookupRangeScore(
    n.income_persistence_pct, INCOME_PERSISTENCE_SCORE_TABLE
  );
  const source_diversity_score = lookupCountScore(
    n.source_diversity_count, SOURCE_DIVERSITY_SCORE_TABLE
  );
  const forward_security_score = lookupRangeScore(
    n.forward_secured_pct, FORWARD_SECURED_SCORE_TABLE
  );
  const concentration_resilience_score = lookupRangeScore(
    n.largest_source_pct, CONCENTRATION_INVERSE_SCORE_TABLE
  );
  const labor_dependence_score = lookupRangeScore(
    n.labor_dependence_pct, LABOR_DEPENDENCE_INVERSE_SCORE_TABLE
  );
  const variability_score = VARIABILITY_INVERSE_SCORE_TABLE[n.income_variability_level];

  const continuity_months = computeContinuityMonths(n);
  const continuity_score = lookupRangeScore(
    continuity_months, CONTINUITY_SCORE_TABLE
  );

  // Structure block: persistence(15) + diversity(10) + forward(15) + concentration(10) = 50
  // Quality adjustment(10) added separately = 60 total
  const structure_subtotal = (
    income_persistence_score +
    source_diversity_score +
    forward_security_score +
    concentration_resilience_score
  );

  // Stability block: labor(20) + variability(10) + continuity(10) = 40
  const stability_subtotal = (
    labor_dependence_score +
    variability_score +
    continuity_score
  );

  const raw_total = structure_subtotal + stability_subtotal;

  return {
    income_persistence_score,
    source_diversity_score,
    forward_security_score,
    concentration_resilience_score,
    labor_dependence_score,
    variability_score,
    continuity_months,
    continuity_score,
    structure_subtotal,
    stability_subtotal,
    raw_total,
  };
}
```

### Engine 05 — Band Classification

```typescript
// src/lib/engine/v2/engines/05-band-classification.ts

import { BAND_THRESHOLDS, WARNING_OVERLAY_RULES } from "../constants";

export function classifyBand(
  overall_score: number,
  normalized: CanonicalInput,
  fragility_score: number,
): BandClassification {
  // Primary band
  let primary_band: StabilityBand = "Limited Stability";
  for (const { min, max, band } of BAND_THRESHOLDS) {
    if (overall_score >= min && overall_score <= max) {
      primary_band = band as StabilityBand;
      break;
    }
  }

  // Warning overlays
  const warning_overlays: WarningOverlay[] = [];

  if (fragility_score <= 25) {
    warning_overlays.push({ code: "WRN-FRAG", label: "Fragility Warning", trigger: "fragility_score <= 25" });
  }
  if (normalized.largest_source_pct >= 70) {
    warning_overlays.push({ code: "WRN-CONC", label: "Concentration Risk", trigger: "largest_source_pct >= 70" });
  }
  if (normalized.labor_dependence_pct >= 80) {
    warning_overlays.push({ code: "WRN-LABOR", label: "Labor-Heavy", trigger: "labor_dependence_pct >= 80" });
  }
  if (normalized.forward_secured_pct <= 10) {
    warning_overlays.push({ code: "WRN-VIS", label: "Thin Visibility", trigger: "forward_secured_pct <= 10" });
  }

  // Sub-band: primary band + most significant warning
  const sub_band = warning_overlays.length > 0
    ? `${primary_band} / ${warning_overlays[0].label}`
    : primary_band;

  return { primary_band, sub_band, warning_overlays };
}
```

### Engine 06 — Structural Indicators

```typescript
// src/lib/engine/v2/engines/06-structural-indicators.ts

type IndicatorLevel = "very_low" | "low" | "moderate" | "high" | "very_high";

function classifyLevel(value: number): IndicatorLevel {
  if (value <= 10) return "very_low";
  if (value <= 30) return "low";
  if (value <= 55) return "moderate";
  if (value <= 80) return "high";
  return "very_high";
}

export function computeIndicators(n: CanonicalInput): StructuralIndicator[] {
  return [
    {
      key: "income_persistence",
      label: "Income Persistence",
      raw_value: n.income_persistence_pct,
      normalized_value: n.income_persistence_pct,
      level: classifyLevel(n.income_persistence_pct),
    },
    {
      key: "source_diversification",
      label: "Source Diversification",
      raw_value: n.source_diversity_count,
      // Normalize count to 0–100 scale: 1→12, 2→25, 3→37, 4→50, 5→62, 6→75, 7→87, 8→100
      normalized_value: Math.min(100, Math.round((n.source_diversity_count / 8) * 100)),
      level: classifyLevel(Math.min(100, Math.round((n.source_diversity_count / 8) * 100))),
    },
    {
      key: "forward_visibility",
      label: "Forward Revenue Visibility",
      raw_value: n.forward_secured_pct,
      normalized_value: n.forward_secured_pct,
      level: classifyLevel(n.forward_secured_pct),
    },
    {
      key: "concentration_resilience",
      label: "Concentration Resilience",
      raw_value: n.largest_source_pct,
      normalized_value: 100 - n.largest_source_pct,  // inverted
      level: classifyLevel(100 - n.largest_source_pct),
    },
    {
      key: "labor_independence",
      label: "Labor Independence",
      raw_value: n.labor_dependence_pct,
      normalized_value: 100 - n.labor_dependence_pct,  // inverted
      level: classifyLevel(100 - n.labor_dependence_pct),
    },
    {
      key: "earnings_stability",
      label: "Earnings Stability",
      raw_value: variabilityToNumeric(n.income_variability_level),
      normalized_value: 100 - variabilityToNumeric(n.income_variability_level),  // inverted
      level: classifyLevel(100 - variabilityToNumeric(n.income_variability_level)),
    },
  ];
}

function variabilityToNumeric(level: VariabilityLevel): number {
  const map: Record<VariabilityLevel, number> = {
    low: 15,
    moderate: 37,
    high: 63,
    extreme: 88,
  };
  return map[level];
}
```

### Engine 07 — Cross-Factor Dependency

```typescript
// src/lib/engine/v2/engines/07-cross-factor-dependency.ts

import { INTERACTION_RULES, NET_ADJUSTMENT_CLAMP } from "../constants";

export function computeInteractions(
  n: CanonicalInput,
  ext: ExtendedInputs | null,
): InteractionResult {
  const effects: InteractionEffect[] = [];

  for (const rule of INTERACTION_RULES) {
    if (rule.condition(n, ext ?? undefined)) {
      effects.push({
        code: rule.code,
        type: rule.type,
        points: rule.points,
        trigger_condition: rule.description,
        factors_involved: rule.factors,
      });
    }
  }

  const total_penalty = effects
    .filter(e => e.type === "penalty")
    .reduce((sum, e) => sum + e.points, 0);

  const total_bonus = effects
    .filter(e => e.type === "bonus")
    .reduce((sum, e) => sum + e.points, 0);

  const raw_net = total_penalty + total_bonus;
  const net_adjustment = Math.max(
    NET_ADJUSTMENT_CLAMP.min,
    Math.min(NET_ADJUSTMENT_CLAMP.max, raw_net)
  );

  return { effects, total_penalty, total_bonus, net_adjustment };
}

export function applyInteractions(
  rawScores: RawScoreBreakdown,
  interactions: InteractionResult,
  qualityAdjustment: number,
): ScoreBreakdown {
  const structure_score = rawScores.structure_subtotal + qualityAdjustment;  // max 60
  const stability_score = rawScores.stability_subtotal;                      // max 40
  const pre_interaction = structure_score + stability_score;                  // max 100

  const overall_score = Math.max(0, Math.min(100,
    pre_interaction + interactions.net_adjustment
  ));

  return {
    overall_score,
    structure_score,
    stability_score,
    continuity_score: rawScores.continuity_score,
    concentration_resilience_score: rawScores.concentration_resilience_score,
    forward_security_score: rawScores.forward_security_score,
    labor_dependence_score: rawScores.labor_dependence_score,
    quality_adjustment: qualityAdjustment,
    fragility_score: 0,  // Set by fragility engine later
  };
}
```

### Engine 08 — Income Quality & Durability

```typescript
// src/lib/engine/v2/engines/08-income-quality.ts

import { QUALITY_BASE, QUALITY_CLAMP, QUALITY_RULES, DURABILITY_GRADE_TABLE } from "../constants";

export function computeQuality(
  _n: CanonicalInput,
  ext: ExtendedInputs | null,
): QualityResult {
  let score = QUALITY_BASE;
  const adjustments: QualityAdjustment[] = [];

  if (!ext) {
    // No extended inputs → return default moderate quality
    return {
      quality_score: QUALITY_BASE,
      durability_grade: "moderate",
      adjustments: [],
    };
  }

  for (const rule of QUALITY_RULES) {
    const value = (ext as Record<string, unknown>)[rule.field];
    if (value !== undefined && rule.condition(value as never)) {
      score += rule.delta;
      adjustments.push({
        factor: rule.field,
        delta: rule.delta,
        reason: rule.reason,
      });
    }
  }

  score = Math.max(QUALITY_CLAMP.min, Math.min(QUALITY_CLAMP.max, score));

  let durability_grade: DurabilityGrade = "moderate";
  for (const [min, max, grade] of DURABILITY_GRADE_TABLE) {
    if (score >= min && score <= max) {
      durability_grade = grade;
      break;
    }
  }

  return { quality_score: score, durability_grade, adjustments };
}
```

### Engine 09 — Constraint Hierarchy

```typescript
// src/lib/engine/v2/engines/09-constraint-hierarchy.ts

interface ConstraintCandidate {
  key: ConstraintKey;
  factor_score: number;
  interaction_involvement: number;  // count of penalties involving this factor
  continuity_impact: boolean;
  fragility_impact: number;
}

const FACTOR_TO_CONSTRAINT: Record<string, ConstraintKey> = {
  forward_secured_pct: "weak_forward_visibility",
  labor_dependence_pct: "high_labor_dependence",
  largest_source_pct: "high_concentration",
  income_persistence_pct: "low_persistence",
  income_variability_level: "high_variability",
};

export function computeConstraints(
  n: CanonicalInput,
  scores: RawScoreBreakdown,
  interactions: InteractionResult,
  quality: QualityResult,
): ConstraintHierarchy {
  // Build candidates with their scores
  const candidates: ConstraintCandidate[] = [
    {
      key: "weak_forward_visibility",
      factor_score: scores.forward_security_score,
      interaction_involvement: countInteractionInvolvement("forward_secured_pct", interactions),
      continuity_impact: true,
      fragility_impact: n.forward_secured_pct <= 10 ? 20 : 0,
    },
    {
      key: "high_labor_dependence",
      factor_score: scores.labor_dependence_score,
      interaction_involvement: countInteractionInvolvement("labor_dependence_pct", interactions),
      continuity_impact: true,
      fragility_impact: n.labor_dependence_pct >= 80 ? 20 : 0,
    },
    {
      key: "high_concentration",
      factor_score: scores.concentration_resilience_score,
      interaction_involvement: countInteractionInvolvement("largest_source_pct", interactions),
      continuity_impact: true,
      fragility_impact: n.largest_source_pct >= 70 ? 25 : 0,
    },
    {
      key: "low_persistence",
      factor_score: scores.income_persistence_score,
      interaction_involvement: countInteractionInvolvement("income_persistence_pct", interactions),
      continuity_impact: true,
      fragility_impact: 0,
    },
    {
      key: "high_variability",
      factor_score: scores.variability_score,
      interaction_involvement: countInteractionInvolvement("income_variability_level", interactions),
      continuity_impact: false,
      fragility_impact: n.income_variability_level === "extreme" ? 20 : n.income_variability_level === "high" ? 10 : 0,
    },
    {
      key: "weak_durability",
      factor_score: quality.quality_score,
      interaction_involvement: 0,
      continuity_impact: false,
      fragility_impact: quality.durability_grade === "fragile" ? 15 : 0,
    },
    {
      key: "shallow_continuity",
      factor_score: scores.continuity_score,
      interaction_involvement: 0,
      continuity_impact: true,
      fragility_impact: scores.continuity_months < 1 ? 15 : 0,
    },
  ];

  // Sort by: 1) interaction involvement desc, 2) lowest factor score, 3) fragility impact desc
  candidates.sort((a, b) => {
    if (b.interaction_involvement !== a.interaction_involvement) {
      return b.interaction_involvement - a.interaction_involvement;
    }
    if (a.factor_score !== b.factor_score) {
      return a.factor_score - b.factor_score;
    }
    return b.fragility_impact - a.fragility_impact;
  });

  const root_constraint = candidates[0].key;
  const primary_constraint = candidates[1]?.key ?? root_constraint;
  const secondary_constraint = candidates[2]?.key ?? primary_constraint;

  // Dependent: a constraint that won't improve until root is addressed
  const dependent_constraint = findDependentConstraint(root_constraint, candidates);

  // Hidden unlock: a moderate-scoring factor that, if improved, unblocks others
  const hidden_unlock = findHiddenUnlock(candidates);

  return {
    root_constraint,
    primary_constraint,
    secondary_constraint,
    dependent_constraint,
    hidden_unlock,
  };
}

function countInteractionInvolvement(
  factor: string,
  interactions: InteractionResult,
): number {
  return interactions.effects
    .filter(e => e.type === "penalty" && e.factors_involved.includes(factor))
    .length;
}

function findDependentConstraint(
  root: ConstraintKey,
  candidates: ConstraintCandidate[],
): ConstraintKey | null {
  // A constraint that shares interaction penalties with root
  // but has a higher factor score — it's being held down by root
  const rootCandidate = candidates.find(c => c.key === root);
  if (!rootCandidate) return null;

  for (const c of candidates) {
    if (c.key === root) continue;
    if (c.interaction_involvement > 0 && c.factor_score > rootCandidate.factor_score) {
      return c.key;
    }
  }
  return null;
}

function findHiddenUnlock(candidates: ConstraintCandidate[]): ConstraintKey | null {
  // A mid-ranked candidate with continuity impact and moderate score
  for (const c of candidates.slice(2)) {
    if (c.continuity_impact && c.factor_score >= 3 && c.factor_score <= 8) {
      return c.key;
    }
  }
  return null;
}
```

### Engine 10 — Fragility

```typescript
// src/lib/engine/v2/engines/10-fragility.ts

import { FRAGILITY_BASE, FRAGILITY_RULES, FRAGILITY_CLASS_TABLE } from "../constants";

export function computeFragility(
  n: CanonicalInput,
  quality: QualityResult,
  continuity_months: number,
): FragilityResult {
  let score = FRAGILITY_BASE;
  const deductions: FragilityDeduction[] = [];

  for (const rule of FRAGILITY_RULES) {
    const met = rule.condition(n, quality, n.income_variability_level, continuity_months);
    deductions.push({
      trigger: rule.trigger,
      points: rule.points,
      condition_met: met,
    });
    if (met) {
      score += rule.points;  // points are negative
    }
  }

  score = Math.max(0, Math.min(100, score));

  let fragility_class: FragilityClass = "resilient";
  for (const [min, max, cls] of FRAGILITY_CLASS_TABLE) {
    if (score >= min && score <= max) {
      fragility_class = cls;
      break;
    }
  }

  // Determine failure modes
  const failure_modes: FailureMode[] = [];
  if (n.largest_source_pct >= 70) failure_modes.push("concentration_collapse");
  if (n.labor_dependence_pct >= 80) failure_modes.push("labor_interruption");
  if (n.forward_secured_pct <= 10) failure_modes.push("visibility_gap");
  if (quality.durability_grade === "fragile" || quality.durability_grade === "thin") {
    failure_modes.push("durability_thinness");
  }

  return {
    fragility_score: score,
    fragility_class,
    deductions,
    primary_failure_mode: failure_modes[0] ?? "visibility_gap",
    secondary_failure_modes: failure_modes.slice(1),
  };
}
```

### Engine 11 — Sensitivity / Marginal Impact

```typescript
// src/lib/engine/v2/engines/11-sensitivity.ts

import { SENSITIVITY_TESTS } from "../constants";

export function computeSensitivity(
  n: CanonicalInput,
  ext: ExtendedInputs | null,
  currentScore: number,
  computeScoreFn: (modified: CanonicalInput, modifiedExt: ExtendedInputs | null) => number,
): SensitivityResult {
  const tests: SensitivityTest[] = [];

  for (const test of SENSITIVITY_TESTS) {
    let projected_score: number;

    if (test.factor === "quality_score") {
      // Quality score delta requires recomputing with modified extended inputs
      const modifiedExt = ext ? { ...ext } : {};
      // Approximate: increase contract term to boost quality
      projected_score = computeScoreFn(n, modifiedExt);
      // Simplified: just add the quality delta directly
      projected_score = Math.min(100, currentScore + test.delta);
    } else {
      const modified = { ...n };
      const currentVal = (modified as Record<string, unknown>)[test.factor] as number;
      (modified as Record<string, unknown>)[test.factor] = Math.max(
        0, Math.min(100, currentVal + test.delta)
      );
      projected_score = computeScoreFn(modified, ext);
    }

    tests.push({
      factor: test.factor,
      delta_description: test.description,
      original_score: currentScore,
      projected_score,
      lift: projected_score - currentScore,
      rank: 0,  // Set below
    });
  }

  // Rank by lift descending
  tests.sort((a, b) => b.lift - a.lift);
  tests.forEach((t, i) => { t.rank = i + 1; });

  return {
    tests,
    highest_lift_factor: tests[0]?.factor ?? "",
    bottleneck_factor: tests[tests.length - 1]?.factor ?? "",
    low_return_factor: tests.find(t => t.lift <= 1)?.factor ?? tests[tests.length - 1]?.factor ?? "",
  };
}
```

### Engine 12 — Risk Scenarios

```typescript
// src/lib/engine/v2/engines/12-risk-scenarios.ts

import { RISK_SCENARIO_TEMPLATES, BAND_THRESHOLDS } from "../constants";

function getBand(score: number): StabilityBand {
  for (const { min, max, band } of BAND_THRESHOLDS) {
    if (score >= min && score <= max) return band as StabilityBand;
  }
  return "Limited Stability";
}

export function computeRiskScenarios(
  n: CanonicalInput,
  currentScore: number,
  currentBand: StabilityBand,
  quality: QualityResult,
  computeScoreFn: (modified: CanonicalInput) => number,
): RiskScenario[] {
  return RISK_SCENARIO_TEMPLATES.map(template => {
    const modified = { ...n };
    let score_drop: number;

    switch (template.scenario_id) {
      case "RS-01": // Largest source removed
        // Concentration goes to 0 (no single source), but income drops
        modified.largest_source_pct = 0;
        modified.source_diversity_count = Math.max(1, n.source_diversity_count - 1);
        modified.income_persistence_pct = Math.max(0, Math.round(
          n.income_persistence_pct * (1 - n.largest_source_pct / 100)
        ));
        break;

      case "RS-02": // Active labor interrupted
        modified.labor_dependence_pct = 100;
        modified.forward_secured_pct = Math.max(0, Math.round(n.forward_secured_pct * 0.5));
        break;

      case "RS-03": // Forward commitments delayed
        modified.forward_secured_pct = Math.max(0, Math.round(n.forward_secured_pct * 0.25));
        break;

      case "RS-04": // Recurring stream degrades
        modified.income_persistence_pct = Math.max(0, Math.round(n.income_persistence_pct * 0.6));
        break;

      case "RS-05": // High volatility month
        modified.income_variability_level = "extreme";
        break;

      case "RS-06": // Platform dependency shock
        // Reduce persistence and forward visibility
        modified.income_persistence_pct = Math.max(0, Math.round(n.income_persistence_pct * 0.5));
        modified.forward_secured_pct = Math.max(0, Math.round(n.forward_secured_pct * 0.3));
        break;
    }

    const scenario_score = computeScoreFn(modified);
    score_drop = currentScore - scenario_score;
    const scenario_band = getBand(scenario_score);

    return {
      scenario_id: template.scenario_id,
      label: template.label,
      description: template.description,
      original_score: currentScore,
      scenario_score,
      score_drop,
      original_band: currentBand,
      scenario_band,
      band_shift: scenario_band !== currentBand,
      narrative: generateScenarioNarrative(template.label, currentScore, scenario_score, currentBand, scenario_band),
    };
  });
}

function generateScenarioNarrative(
  label: string,
  original: number,
  scenario: number,
  originalBand: string,
  scenarioBand: string,
): string {
  const drop = original - scenario;
  if (drop <= 0) {
    return `Under the "${label}" scenario, your score remains stable at ${scenario}.`;
  }
  const bandShift = originalBand !== scenarioBand
    ? ` Your classification would shift from ${originalBand} to ${scenarioBand}.`
    : " Your classification band would remain unchanged.";
  return `Under the "${label}" scenario, your score would drop by ${drop} points to ${scenario}.${bandShift}`;
}
```

### Engine 13 — Score Lift Simulator

```typescript
// src/lib/engine/v2/engines/13-score-lift.ts

import { LIFT_SCENARIO_TEMPLATES, BAND_THRESHOLDS } from "../constants";

function getBand(score: number): StabilityBand {
  for (const { min, max, band } of BAND_THRESHOLDS) {
    if (score >= min && score <= max) return band as StabilityBand;
  }
  return "Limited Stability";
}

export function computeScoreLift(
  n: CanonicalInput,
  ext: ExtendedInputs | null,
  currentScore: number,
  currentBand: StabilityBand,
  computeScoreFn: (modified: CanonicalInput) => number,
): ScoreLiftProjection {
  const lift_scenarios: LiftScenario[] = [];

  for (const template of LIFT_SCENARIO_TEMPLATES) {
    if (template.scenario_id === "LS-06") continue; // Handle combined separately

    const modified = { ...n };
    if (template.factor === "quality_score") {
      // Quality improvement — approximate as direct score add
      const projected_score = Math.min(100, currentScore + template.delta);
      lift_scenarios.push({
        scenario_id: template.scenario_id,
        label: template.label,
        change_description: `Improve quality score by ${template.delta}`,
        original_score: currentScore,
        projected_score,
        lift: projected_score - currentScore,
        projected_band: getBand(projected_score),
        band_shift: getBand(projected_score) !== currentBand,
      });
      continue;
    }

    const currentVal = (modified as Record<string, number>)[template.factor];
    (modified as Record<string, number>)[template.factor] = Math.max(
      0, Math.min(100, currentVal + template.delta)
    );
    const projected_score = computeScoreFn(modified);

    lift_scenarios.push({
      scenario_id: template.scenario_id,
      label: template.label,
      change_description: `${template.delta > 0 ? "+" : ""}${template.delta} ${template.factor}`,
      original_score: currentScore,
      projected_score,
      lift: projected_score - currentScore,
      projected_band: getBand(projected_score),
      band_shift: getBand(projected_score) !== currentBand,
    });
  }

  // Sort by lift to find top two
  const sorted = [...lift_scenarios].sort((a, b) => b.lift - a.lift);
  const highest_single_lift = sorted[0];

  // Combined top two
  const top1 = LIFT_SCENARIO_TEMPLATES.find(t => t.scenario_id === sorted[0]?.scenario_id);
  const top2 = LIFT_SCENARIO_TEMPLATES.find(t => t.scenario_id === sorted[1]?.scenario_id);

  let combined: LiftScenario;
  if (top1 && top2 && top1.factor !== "quality_score" && top2.factor !== "quality_score") {
    const modified = { ...n };
    (modified as Record<string, number>)[top1.factor] = Math.max(
      0, Math.min(100, (modified as Record<string, number>)[top1.factor] + top1.delta)
    );
    (modified as Record<string, number>)[top2.factor] = Math.max(
      0, Math.min(100, (modified as Record<string, number>)[top2.factor] + top2.delta)
    );
    const combined_score = computeScoreFn(modified);
    combined = {
      scenario_id: "LS-06",
      label: "Combined Top Two Moves",
      change_description: `${top1.label} + ${top2.label}`,
      original_score: currentScore,
      projected_score: combined_score,
      lift: combined_score - currentScore,
      projected_band: getBand(combined_score),
      band_shift: getBand(combined_score) !== currentBand,
    };
  } else {
    combined = {
      scenario_id: "LS-06",
      label: "Combined Top Two Moves",
      change_description: "N/A",
      original_score: currentScore,
      projected_score: currentScore,
      lift: 0,
      projected_band: currentBand,
      band_shift: false,
    };
  }

  return {
    lift_scenarios,
    combined_top_two: combined,
    highest_single_lift,
  };
}
```

### Engine 14 — Diagnostic Confidence

```typescript
// src/lib/engine/v2/engines/14-diagnostic-confidence.ts

import { CONFIDENCE_BASE, CONFIDENCE_LEVELS } from "../constants";

export function computeConfidence(
  n: CanonicalInput,
  ext: ExtendedInputs | null,
  profile: ResolvedProfile,
  sensitivity: SensitivityResult,
): ConfidenceResult {
  let score = CONFIDENCE_BASE;
  const deductions: ConfidenceDeduction[] = [];

  // Check for contradictions
  const contradictions = detectContradictions(n, profile);
  if (contradictions.length > 0) {
    score -= 20;
    deductions.push({
      reason: `Contradiction detected: ${contradictions[0]}`,
      points: -20,
    });
  }

  // Missing extended inputs
  if (!ext || Object.keys(ext).length === 0) {
    score -= 10;
    deductions.push({
      reason: "Extended quality inputs not provided",
      points: -10,
    });
  }

  // Profile mismatch
  if (profileMismatch(n, profile)) {
    score -= 10;
    deductions.push({
      reason: "Profile context may not align with diagnostic inputs",
      points: -10,
    });
  }

  // Scenario instability — if small changes cause large score swings
  const maxLift = sensitivity.tests[0]?.lift ?? 0;
  if (maxLift >= 15) {
    score -= 10;
    deductions.push({
      reason: "Score is highly sensitive to small input changes",
      points: -10,
    });
  }

  // High ambiguity in quality inputs
  if (ext && ext.cancellation_risk_level === undefined && ext.platform_dependency_level === undefined) {
    score -= 10;
    deductions.push({
      reason: "Key quality dimensions not assessed",
      points: -10,
    });
  }

  score = Math.max(0, Math.min(100, score));

  let confidence_level: ConfidenceLevel = "low";
  for (const [min, max, level] of CONFIDENCE_LEVELS) {
    if (score >= min && score <= max) {
      confidence_level = level;
      break;
    }
  }

  return { confidence_score: score, confidence_level, deductions };
}

function detectContradictions(n: CanonicalInput, profile: ResolvedProfile): string[] {
  const contradictions: string[] = [];

  // Claims high persistence but high labor dependence
  if (n.income_persistence_pct >= 70 && n.labor_dependence_pct >= 80) {
    contradictions.push(
      "High recurring revenue reported alongside near-total labor dependence"
    );
  }

  // Claims asset-supported structure but no labor independence
  if (profile.operating_structure === "asset_supported" && n.labor_dependence_pct >= 80) {
    contradictions.push(
      "Asset-supported structure selected but income is highly labor-dependent"
    );
  }

  // Claims many sources but extreme concentration
  if (n.source_diversity_count >= 5 && n.largest_source_pct >= 80) {
    contradictions.push(
      "Many income sources reported but single source dominates at 80%+"
    );
  }

  return contradictions;
}

function profileMismatch(n: CanonicalInput, profile: ResolvedProfile): boolean {
  // Salary model but claims high source diversity
  if (profile.primary_income_model === "salary" && n.source_diversity_count >= 5) {
    return true;
  }
  // Recurring model but no persistence
  if (profile.is_recurring_model && n.income_persistence_pct <= 10) {
    return true;
  }
  return false;
}
```

### Engine 15 — Deterministic Explainability

```typescript
// src/lib/engine/v2/engines/15-explainability.ts

export function generateExplainability(
  scores: ScoreBreakdown,
  bands: BandClassification,
  constraints: ConstraintHierarchy,
  interactions: InteractionResult,
  sensitivity: SensitivityResult,
  fragility: FragilityResult,
  quality: QualityResult,
): ExplainabilityResult {
  const why_this_score = generateWhyThisScore(scores, bands);
  const why_not_higher = generateWhyNotHigher(scores, constraints, interactions);
  const strongest_supports = generateStrongestSupports(scores);
  const strongest_suppressors = generateStrongestSuppressors(scores, constraints);
  const interaction_summary = generateInteractionSummary(interactions);
  const best_lift_explanation = generateBestLiftExplanation(sensitivity);
  const fragility_explanation = generateFragilityExplanation(fragility, quality);

  return {
    why_this_score,
    why_not_higher,
    strongest_supports,
    strongest_suppressors,
    interaction_summary,
    best_lift_explanation,
    fragility_explanation,
  };
}

function generateWhyThisScore(scores: ScoreBreakdown, bands: BandClassification): string {
  return `Your overall score of ${scores.overall_score} places you in the ${bands.primary_band} range. ` +
    `Your income structure contributes ${scores.structure_score} of 60 possible structure points, ` +
    `and your stability factors contribute ${scores.stability_score} of 40 possible stability points.`;
}

function generateWhyNotHigher(
  scores: ScoreBreakdown,
  constraints: ConstraintHierarchy,
  interactions: InteractionResult,
): string {
  const constraintLabel = CONSTRAINT_LABELS[constraints.root_constraint];
  let explanation = `The primary factor holding your score back is ${constraintLabel}. `;

  if (interactions.net_adjustment < 0) {
    explanation += `Cross-factor interactions reduced your score by ${Math.abs(interactions.net_adjustment)} points ` +
      `because of structural tensions between your income characteristics. `;
  }

  if (constraints.secondary_constraint) {
    explanation += `A secondary constraint — ${CONSTRAINT_LABELS[constraints.secondary_constraint]} — ` +
      `also limits improvement potential.`;
  }

  return explanation;
}

function generateStrongestSupports(scores: ScoreBreakdown): string[] {
  const supports: { label: string; score: number; max: number }[] = [
    { label: "Labor independence", score: scores.labor_dependence_score, max: 20 },
    { label: "Forward visibility", score: scores.forward_security_score, max: 15 },
    { label: "Income persistence", score: scores.concentration_resilience_score, max: 15 },
    { label: "Concentration resilience", score: scores.concentration_resilience_score, max: 10 },
  ];

  return supports
    .filter(s => s.score >= s.max * 0.6)
    .sort((a, b) => (b.score / b.max) - (a.score / a.max))
    .slice(0, 3)
    .map(s => `${s.label}: ${s.score}/${s.max} points`);
}

function generateStrongestSuppressors(
  scores: ScoreBreakdown,
  constraints: ConstraintHierarchy,
): string[] {
  const suppressors: string[] = [];
  suppressors.push(CONSTRAINT_LABELS[constraints.root_constraint]);
  if (constraints.primary_constraint !== constraints.root_constraint) {
    suppressors.push(CONSTRAINT_LABELS[constraints.primary_constraint]);
  }
  if (constraints.secondary_constraint !== constraints.primary_constraint) {
    suppressors.push(CONSTRAINT_LABELS[constraints.secondary_constraint]);
  }
  return suppressors;
}

function generateInteractionSummary(interactions: InteractionResult): string {
  if (interactions.effects.length === 0) {
    return "No cross-factor interactions were detected in your income structure.";
  }
  const penalties = interactions.effects.filter(e => e.type === "penalty");
  const bonuses = interactions.effects.filter(e => e.type === "bonus");

  let summary = "";
  if (penalties.length > 0) {
    summary += `${penalties.length} structural tension${penalties.length > 1 ? "s" : ""} detected ` +
      `(${interactions.total_penalty} point impact). `;
  }
  if (bonuses.length > 0) {
    summary += `${bonuses.length} structural strength${bonuses.length > 1 ? "s" : ""} recognized ` +
      `(+${interactions.total_bonus} points).`;
  }
  return summary;
}

function generateBestLiftExplanation(sensitivity: SensitivityResult): string {
  const top = sensitivity.tests[0];
  if (!top || top.lift <= 0) {
    return "No single factor change produces meaningful score improvement in isolation.";
  }
  return `The highest-impact improvement would be ${top.delta_description}, ` +
    `which projects a ${top.lift}-point increase from ${top.original_score} to ${top.projected_score}.`;
}

function generateFragilityExplanation(
  fragility: FragilityResult,
  quality: QualityResult,
): string {
  return `Your fragility score is ${fragility.fragility_score}/100 (${fragility.fragility_class}). ` +
    `Your primary failure mode is ${FAILURE_MODE_LABELS[fragility.primary_failure_mode]}. ` +
    `Income quality is rated ${quality.durability_grade} (${quality.quality_score}/10).`;
}

const CONSTRAINT_LABELS: Record<ConstraintKey, string> = {
  weak_forward_visibility: "weak forward revenue visibility",
  high_labor_dependence: "high labor dependence",
  high_concentration: "high income concentration",
  low_persistence: "low income persistence",
  high_variability: "high earnings variability",
  weak_durability: "weak income durability",
  shallow_continuity: "shallow income continuity",
};

const FAILURE_MODE_LABELS: Record<FailureMode, string> = {
  concentration_collapse: "concentration collapse — over-reliance on a single source",
  labor_interruption: "labor interruption — income stops when you stop",
  visibility_gap: "visibility gap — no forward revenue certainty",
  durability_thinness: "durability thinness — recurring revenue is fragile or cancelable",
};
```

### Engine 16 — Action Prioritization

```typescript
// src/lib/engine/v2/engines/16-action-prioritization.ts

export function prioritizeActions(
  constraints: ConstraintHierarchy,
  fragility: FragilityResult,
  sensitivity: SensitivityResult,
  profile: ResolvedProfile,
): ActionResult {
  const recommended: RecommendedAction[] = [];
  const avoid: AvoidAction[] = [];

  // Map root constraint to primary action
  const rootAction = ROOT_CONSTRAINT_ACTIONS[constraints.root_constraint];
  if (rootAction) {
    recommended.push({
      ...rootAction,
      priority: 1,
    });
  }

  // Map highest lift factor to secondary action
  const liftAction = LIFT_FACTOR_ACTIONS[sensitivity.highest_lift_factor];
  if (liftAction && liftAction.action_id !== rootAction?.action_id) {
    recommended.push({
      ...liftAction,
      priority: 2,
    });
  }

  // Map fragility class to tertiary action
  const fragilityAction = FRAGILITY_ACTIONS[fragility.fragility_class];
  if (fragilityAction) {
    const existing = recommended.find(a => a.action_id === fragilityAction.action_id);
    if (!existing) {
      recommended.push({
        ...fragilityAction,
        priority: recommended.length + 1,
      });
    }
  }

  // Profile-specific actions
  const profileActions = PROFILE_ACTIONS[profile.profile_archetype] ?? [];
  for (const action of profileActions) {
    const existing = recommended.find(a => a.action_id === action.action_id);
    if (!existing && recommended.length < 6) {
      recommended.push({
        ...action,
        priority: recommended.length + 1,
      });
    }
  }

  // Sequencing: mark blocked actions
  for (const action of recommended) {
    const blockedBy = SEQUENCING_RULES[action.action_id];
    if (blockedBy && recommended.some(a => a.action_id === blockedBy)) {
      action.blocked_until = blockedBy;
      action.sequencing_note = `Address "${recommended.find(a => a.action_id === blockedBy)?.label}" first`;
    }
  }

  // Avoid actions based on profile
  if (profile.primary_income_model === "salary") {
    avoid.push({
      action_id: "AVD-01",
      label: "Do not pursue income source diversification as first move",
      reason: "Salaried employees should focus on supplemental streams before restructuring primary income",
    });
  }

  return { recommended_actions: recommended, avoid_actions: avoid };
}

// Action library (abbreviated — full library in data/action-library.ts)
const ROOT_CONSTRAINT_ACTIONS: Record<ConstraintKey, RecommendedAction> = {
  weak_forward_visibility: {
    action_id: "ACT-FWD-01",
    priority: 0,
    label: "Extend Forward Revenue Commitments",
    description: "Negotiate longer contract terms, retainers, or advance booking windows to increase visibility.",
    category: "revenue_structure",
    expected_impact: "Improves forward security score and continuity estimate",
  },
  high_labor_dependence: {
    action_id: "ACT-LBR-01",
    priority: 0,
    label: "Build Labor-Independent Revenue",
    description: "Develop recurring, passive, or asset-backed income that continues without active work.",
    category: "income_independence",
    expected_impact: "Improves labor dependence score and fragility resilience",
  },
  high_concentration: {
    action_id: "ACT-CON-01",
    priority: 0,
    label: "Reduce Single-Source Concentration",
    description: "Diversify revenue across more clients or revenue lines to reduce single-source risk.",
    category: "diversification",
    expected_impact: "Improves concentration resilience and reduces fragility",
  },
  low_persistence: {
    action_id: "ACT-PER-01",
    priority: 0,
    label: "Increase Recurring Revenue Base",
    description: "Convert one-time revenue into retainers, subscriptions, or continuing relationships.",
    category: "revenue_structure",
    expected_impact: "Improves persistence score and continuity estimate",
  },
  high_variability: {
    action_id: "ACT-VAR-01",
    priority: 0,
    label: "Stabilize Monthly Earnings",
    description: "Smooth revenue through retainers, payment plans, or consistent delivery cadence.",
    category: "cash_flow",
    expected_impact: "Improves variability score",
  },
  weak_durability: {
    action_id: "ACT-DUR-01",
    priority: 0,
    label: "Strengthen Revenue Durability",
    description: "Reduce cancellation risk, extend contract terms, and lower platform dependency.",
    category: "quality",
    expected_impact: "Improves quality score and durability grade",
  },
  shallow_continuity: {
    action_id: "ACT-CNT-01",
    priority: 0,
    label: "Deepen Income Continuity",
    description: "Build income streams that persist for at least 90 days without active work.",
    category: "income_independence",
    expected_impact: "Improves continuity estimate and stability score",
  },
};

// Sequencing rules: action_id → blocked_by_action_id
const SEQUENCING_RULES: Record<string, string> = {
  "ACT-CON-01": "ACT-PER-01",  // Don't diversify before you have persistent revenue
};

// Additional action maps (LIFT_FACTOR_ACTIONS, FRAGILITY_ACTIONS, PROFILE_ACTIONS)
// would follow the same pattern — omitted for brevity, defined in data/action-library.ts
```

### Engine 17 — Reassessment Triggers

```typescript
// src/lib/engine/v2/engines/17-reassessment-triggers.ts

export function computeReassessmentTriggers(
  n: CanonicalInput,
  scores: ScoreBreakdown,
  quality: QualityResult,
): ReassessmentTrigger[] {
  const triggers: ReassessmentTrigger[] = [];

  if (n.forward_secured_pct < 90) {
    triggers.push({
      trigger_id: "RT-01",
      condition: "forward_secured_pct improves by 10+",
      threshold: `${n.forward_secured_pct + 10}%`,
      current_value: `${n.forward_secured_pct}%`,
      description: "If your forward-committed revenue increases by 10+ percentage points, reassess to capture improved visibility.",
    });
  }

  if (n.largest_source_pct > 25) {
    triggers.push({
      trigger_id: "RT-02",
      condition: "largest_source_pct decreases by 10+",
      threshold: `${n.largest_source_pct - 10}%`,
      current_value: `${n.largest_source_pct}%`,
      description: "If your largest income source drops below this threshold through diversification, reassess to reflect reduced concentration.",
    });
  }

  if (n.labor_dependence_pct > 25) {
    triggers.push({
      trigger_id: "RT-03",
      condition: "labor_dependence_pct decreases by 10+",
      threshold: `${n.labor_dependence_pct - 10}%`,
      current_value: `${n.labor_dependence_pct}%`,
      description: "If your labor dependence drops by 10+ points through building passive or recurring income, reassess.",
    });
  }

  if (quality.quality_score < 8) {
    triggers.push({
      trigger_id: "RT-04",
      condition: "quality_score increases by 2+",
      threshold: `${quality.quality_score + 2}`,
      current_value: `${quality.quality_score}`,
      description: "If you extend contract terms, reduce cancellation risk, or lower platform dependency, reassess to capture quality improvements.",
    });
  }

  triggers.push({
    trigger_id: "RT-05",
    condition: "New committed revenue stream added",
    threshold: "1+ new recurring source",
    current_value: `${n.source_diversity_count} sources`,
    description: "If you add a new meaningfully independent recurring revenue stream, reassess to reflect improved diversification.",
  });

  return triggers;
}
```

### Engine 18 — Benchmarking

```typescript
// src/lib/engine/v2/engines/18-benchmarking.ts

import { SECTOR_BENCHMARKS } from "../data/sector-benchmarks";

export function computeBenchmarks(
  scores: ScoreBreakdown,
  profile: ResolvedProfile,
  indicators: StructuralIndicator[],
): BenchmarkResult {
  const sectorData = SECTOR_BENCHMARKS[profile.industry_sector] ?? SECTOR_BENCHMARKS.other;

  // Compute peer percentile by interpolation within band
  const peer_percentile = computePeerPercentile(
    scores.overall_score,
    sectorData.peer_band_distribution
  );

  // Find outlier dimensions
  const outlier_dimensions: OutlierDimension[] = [];
  for (const indicator of indicators) {
    const peerAvg = sectorData.indicator_averages?.[indicator.key] ?? 50;
    const diff = indicator.normalized_value - peerAvg;
    const absDiff = Math.abs(diff);

    if (absDiff >= 15) {
      outlier_dimensions.push({
        factor: indicator.label,
        user_value: indicator.normalized_value,
        peer_average: peerAvg,
        direction: diff > 0 ? "above" : "below",
        magnitude: absDiff >= 30 ? "significant" : "notable",
      });
    }
  }

  return {
    peer_percentile,
    cluster_average_score: sectorData.avg_score,
    top_20_threshold: sectorData.top_20_threshold,
    peer_band_distribution: sectorData.peer_band_distribution,
    outlier_dimensions,
  };
}

function computePeerPercentile(
  score: number,
  distribution: { limited: number; developing: number; established: number; high: number },
): number {
  // Determine which band the score falls in and interpolate
  const bandRanges = [
    { min: 0, max: 29, cumStart: 0, bandPct: distribution.limited },
    { min: 30, max: 49, cumStart: distribution.limited, bandPct: distribution.developing },
    { min: 50, max: 74, cumStart: distribution.limited + distribution.developing, bandPct: distribution.established },
    { min: 75, max: 100, cumStart: distribution.limited + distribution.developing + distribution.established, bandPct: distribution.high },
  ];

  for (const range of bandRanges) {
    if (score >= range.min && score <= range.max) {
      const positionInBand = (score - range.min) / (range.max - range.min);
      return Math.round(range.cumStart + (positionInBand * range.bandPct));
    }
  }
  return 50;
}
```

### Engine 19 — Comparative Reassessment

```typescript
// src/lib/engine/v2/engines/19-comparative-reassessment.ts

export function computeComparison(
  current: ScoreBreakdown,
  currentNormalized: CanonicalInput,
  prior: AssessmentRecord,
): ComparisonResult {
  const priorNormalized = prior.normalized_inputs;

  const factor_deltas: FactorDelta[] = [
    makeDelta("Income Persistence", currentNormalized.income_persistence_pct, priorNormalized.income_persistence_pct),
    makeDelta("Largest Source %", currentNormalized.largest_source_pct, priorNormalized.largest_source_pct),
    makeDelta("Source Diversity", currentNormalized.source_diversity_count, priorNormalized.source_diversity_count),
    makeDelta("Forward Secured %", currentNormalized.forward_secured_pct, priorNormalized.forward_secured_pct),
    makeDelta("Labor Dependence %", currentNormalized.labor_dependence_pct, priorNormalized.labor_dependence_pct),
  ];

  const score_delta = current.overall_score - prior.scores.overall_score;

  return {
    prior_assessment_id: prior.assessment_id,
    prior_overall_score: prior.scores.overall_score,
    current_overall_score: current.overall_score,
    score_delta,
    prior_band: prior.bands.primary_band,
    current_band: classifyBandSimple(current.overall_score),
    band_changed: prior.bands.primary_band !== classifyBandSimple(current.overall_score),
    factor_deltas,
    improvement_narrative: generateImprovementNarrative(score_delta, factor_deltas),
  };
}

function makeDelta(factor: string, current: number, prior: number): FactorDelta {
  const delta = current - prior;
  return {
    factor,
    prior_value: prior,
    current_value: current,
    delta,
    direction: delta > 0 ? "improved" : delta < 0 ? "declined" : "unchanged",
  };
}

function classifyBandSimple(score: number): StabilityBand {
  if (score < 30) return "Limited Stability";
  if (score < 50) return "Developing Stability";
  if (score < 75) return "Established Stability";
  return "High Stability";
}

function generateImprovementNarrative(delta: number, factors: FactorDelta[]): string {
  if (delta === 0) return "Your score has not changed since your prior assessment.";

  const direction = delta > 0 ? "improved" : "declined";
  const improved = factors.filter(f => f.direction === "improved").map(f => f.factor);
  const declined = factors.filter(f => f.direction === "declined").map(f => f.factor);

  let narrative = `Your score has ${direction} by ${Math.abs(delta)} points. `;
  if (improved.length > 0) {
    narrative += `Improvements in ${improved.join(", ")}. `;
  }
  if (declined.length > 0) {
    narrative += `Declines in ${declined.join(", ")}.`;
  }
  return narrative;
}
```

### Engine 20 — Integrity & Manifest

```typescript
// src/lib/engine/v2/engines/20-integrity-manifest.ts

import { createHash } from "crypto";
import {
  MODEL_VERSION, FACTOR_VERSION, SCENARIO_VERSION,
  BENCHMARK_VERSION, EXPLANATION_VERSION,
} from "../constants";

export function computeIntegrity(
  normalized: CanonicalInput,
  scores: ScoreBreakdown,
  assessmentId: string,
): IntegrityResult {
  const input_hash = sha256(JSON.stringify(sortKeys(normalized)));

  const output_hash = sha256(JSON.stringify(sortKeys({
    overall_score: scores.overall_score,
    structure_score: scores.structure_score,
    stability_score: scores.stability_score,
  })));

  const manifest_hash = sha256(JSON.stringify({
    model_version: MODEL_VERSION,
    factor_version: FACTOR_VERSION,
    scenario_version: SCENARIO_VERSION,
    benchmark_version: BENCHMARK_VERSION,
    explanation_version: EXPLANATION_VERSION,
  }));

  const record_hash = sha256(
    input_hash + output_hash + manifest_hash + assessmentId
  );

  return { input_hash, output_hash, manifest_hash, record_hash };
}

export function getModelManifest(): ModelManifest {
  return {
    model_version: MODEL_VERSION,
    factor_version: FACTOR_VERSION,
    scenario_version: SCENARIO_VERSION,
    benchmark_version: BENCHMARK_VERSION,
    explanation_version: EXPLANATION_VERSION,
  };
}

function sha256(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

function sortKeys(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.keys(obj).sort().reduce((sorted, key) => {
    sorted[key] = obj[key];
    return sorted;
  }, {} as Record<string, unknown>);
}
```

---

## 8. DATABASE SCHEMA

```sql
-- src/lib/db/schema.sql

-- ─── USERS ──────────────────────────────────────────────

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── USER PROFILES ──────────────────────────────────────

CREATE TABLE user_profiles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_class       TEXT NOT NULL CHECK (profile_class IN ('individual', 'business_owner', 'hybrid')),
  operating_structure TEXT NOT NULL,
  primary_income_model TEXT NOT NULL,
  revenue_structure   TEXT NOT NULL,
  industry_sector     TEXT NOT NULL,
  maturity_stage      TEXT NOT NULL CHECK (maturity_stage IN ('early', 'developing', 'established')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- ─── ASSESSMENTS ────────────────────────────────────────

CREATE TABLE assessments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Status
  status              TEXT NOT NULL DEFAULT 'active'
                      CHECK (status IN ('active', 'superseded', 'revoked')),

  -- Raw inputs (answer choices)
  raw_inputs          JSONB NOT NULL,

  -- Normalized canonical inputs
  normalized_inputs   JSONB NOT NULL,

  -- Profile context
  profile_context     JSONB NOT NULL,

  -- Extended inputs (nullable)
  extended_inputs     JSONB,

  -- Core scores
  overall_score       INTEGER NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  structure_score     INTEGER NOT NULL CHECK (structure_score BETWEEN 0 AND 60),
  stability_score     INTEGER NOT NULL CHECK (stability_score BETWEEN 0 AND 40),
  quality_adjustment  INTEGER NOT NULL DEFAULT 0,
  net_interaction     INTEGER NOT NULL DEFAULT 0,

  -- Band
  primary_band        TEXT NOT NULL,
  sub_band            TEXT NOT NULL,
  warning_overlays    JSONB NOT NULL DEFAULT '[]',

  -- Fragility
  fragility_score     INTEGER NOT NULL CHECK (fragility_score BETWEEN 0 AND 100),
  fragility_class     TEXT NOT NULL,
  primary_failure_mode TEXT NOT NULL,

  -- Quality
  quality_score       INTEGER NOT NULL CHECK (quality_score BETWEEN 0 AND 10),
  durability_grade    TEXT NOT NULL,

  -- Continuity
  continuity_months   NUMERIC(4,1) NOT NULL,
  continuity_score    INTEGER NOT NULL,

  -- Constraints
  constraints         JSONB NOT NULL,

  -- Full analysis payload (indicators, interactions, scenarios, etc.)
  analysis_payload    JSONB NOT NULL,

  -- Explainability
  explainability      JSONB NOT NULL,

  -- Actions
  recommended_actions JSONB NOT NULL DEFAULT '[]',
  avoid_actions       JSONB NOT NULL DEFAULT '[]',

  -- Reassessment triggers
  reassessment_triggers JSONB NOT NULL DEFAULT '[]',

  -- Benchmarks
  benchmarks          JSONB,

  -- Confidence
  confidence_score    INTEGER NOT NULL,
  confidence_level    TEXT NOT NULL,

  -- Reason codes
  reason_codes        JSONB NOT NULL DEFAULT '[]',

  -- Integrity
  input_hash          TEXT NOT NULL,
  output_hash         TEXT NOT NULL,
  manifest_hash       TEXT NOT NULL,
  record_hash         TEXT NOT NULL,

  -- Model manifest
  model_version       TEXT NOT NULL DEFAULT 'RP-1.0',
  factor_version      TEXT NOT NULL DEFAULT 'F-1.0',
  scenario_version    TEXT NOT NULL DEFAULT 'S-1.0',
  benchmark_version   TEXT NOT NULL DEFAULT 'B-1.0',
  explanation_version TEXT NOT NULL DEFAULT 'E-1.0',

  -- Timestamps
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_input_hash ON assessments(input_hash);
CREATE INDEX idx_assessments_record_hash ON assessments(record_hash);

-- ─── ASSESSMENT DELTAS (comparison tracking) ────────────

CREATE TABLE assessment_deltas (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  current_assessment  UUID NOT NULL REFERENCES assessments(id),
  prior_assessment    UUID NOT NULL REFERENCES assessments(id),
  score_delta         INTEGER NOT NULL,
  band_changed        BOOLEAN NOT NULL DEFAULT false,
  factor_deltas       JSONB NOT NULL,
  narrative           TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── MODEL MANIFESTS ────────────────────────────────────

CREATE TABLE model_manifests (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_version       TEXT NOT NULL,
  factor_version      TEXT NOT NULL,
  scenario_version    TEXT NOT NULL,
  benchmark_version   TEXT NOT NULL,
  explanation_version TEXT NOT NULL,
  manifest_hash       TEXT NOT NULL UNIQUE,
  scoring_rules       JSONB NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── BENCHMARK CLUSTERS ─────────────────────────────────

CREATE TABLE benchmark_clusters (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_sector     TEXT NOT NULL,
  profile_archetype   TEXT,
  maturity_stage      TEXT,
  avg_score           INTEGER NOT NULL,
  top_20_threshold    INTEGER NOT NULL,
  band_distribution   JSONB NOT NULL,
  indicator_averages  JSONB,
  sample_size         INTEGER NOT NULL DEFAULT 0,
  version             TEXT NOT NULL DEFAULT 'B-1.0',
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(industry_sector, profile_archetype, maturity_stage, version)
);

-- ─── ACTION LIBRARY ─────────────────────────────────────

CREATE TABLE action_library (
  action_id           TEXT PRIMARY KEY,
  label               TEXT NOT NULL,
  description         TEXT NOT NULL,
  category            TEXT NOT NULL,
  expected_impact     TEXT NOT NULL,
  constraint_key      TEXT,
  profile_archetype   TEXT,
  version             TEXT NOT NULL DEFAULT 'E-1.0'
);

-- ─── SCENARIO TEMPLATES ─────────────────────────────────

CREATE TABLE scenario_templates (
  scenario_id         TEXT PRIMARY KEY,
  label               TEXT NOT NULL,
  description         TEXT NOT NULL,
  type                TEXT NOT NULL CHECK (type IN ('risk', 'lift')),
  version             TEXT NOT NULL DEFAULT 'S-1.0'
);

-- ─── REASON CODE REGISTRY ───────────────────────────────

CREATE TABLE reason_code_registry (
  code                TEXT PRIMARY KEY,
  category            TEXT NOT NULL,
  severity            TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  message             TEXT NOT NULL,
  version             TEXT NOT NULL DEFAULT 'E-1.0'
);

-- ─── INTAKE PROGRESS (save/resume) ─────────────────────

CREATE TABLE intake_progress (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id          TEXT NOT NULL,
  answers             JSONB NOT NULL DEFAULT '{}',
  profile             JSONB,
  current_step        INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 9. API ROUTES / SERVICE CONTRACTS

### API Route Definitions

```
POST   /api/v2/assessment/create         Create new assessment
POST   /api/v2/assessment/save-progress  Save intake progress
POST   /api/v2/assessment/submit         Submit answers and generate report
GET    /api/v2/assessment/[id]           Fetch assessment by ID
GET    /api/v2/report/[id]              Fetch full report payload
GET    /api/v2/verify/[id]             Fetch verification data
POST   /api/v2/compare                  Compare two assessments
GET    /api/v2/advisor/[id]            Fetch advisor summary view
GET    /api/v2/history                 Fetch user's assessment history
```

### Contract Details

```typescript
// POST /api/v2/assessment/submit

// Request
interface SubmitAssessmentRequest {
  raw_inputs: RawDiagnosticInput;
  profile: ProfileContext;
  extended_inputs?: ExtendedInputs;
  payment_token?: string;
}

// Response
interface SubmitAssessmentResponse {
  assessment_id: string;
  status: "complete";
  scores: ScoreBreakdown;
  bands: BandClassification;
  report_url: string;      // /report/{assessment_id}
  verify_url: string;      // /verify/{assessment_id}
}

// GET /api/v2/report/[id]

// Response: Full AssessmentRecord (see types.ts)

// GET /api/v2/verify/[id]

// Response
interface VerifyResponse {
  assessment_id: string;
  status: "active" | "superseded" | "revoked";
  created_at: string;
  model_manifest: ModelManifest;
  overall_score: number;
  primary_band: StabilityBand;
  integrity: IntegrityResult;
  is_current: boolean;
}

// POST /api/v2/compare

// Request
interface CompareRequest {
  current_assessment_id: string;
  prior_assessment_id: string;
}

// Response: ComparisonResult

// GET /api/v2/advisor/[id]

// Response
interface AdvisorSummaryResponse {
  assessment_id: string;
  overall_score: number;
  primary_band: StabilityBand;
  sub_band: string;
  root_constraint: ConstraintKey;
  primary_constraint: ConstraintKey;
  strongest_suppressors: string[];
  highest_lift: LiftScenario;
  top_risk_scenario: RiskScenario;
  fragility_class: FragilityClass;
  primary_failure_mode: FailureMode;
  recommended_actions: RecommendedAction[];
  reassessment_triggers: ReassessmentTrigger[];
  confidence_level: ConfidenceLevel;
}

// POST /api/v2/assessment/save-progress

// Request
interface SaveProgressRequest {
  session_id: string;
  answers: Partial<RawDiagnosticInput>;
  profile?: Partial<ProfileContext>;
  current_step: number;
}

// Response
interface SaveProgressResponse {
  saved: boolean;
  session_id: string;
}

// GET /api/v2/history

// Response
interface AssessmentHistoryResponse {
  assessments: {
    assessment_id: string;
    created_at: string;
    overall_score: number;
    primary_band: StabilityBand;
    status: "active" | "superseded" | "revoked";
  }[];
}
```

---

## 10. REPORT PAYLOAD CONTRACT

The full report page consumes the `AssessmentRecord` type defined in Section 5. The report endpoint returns the complete record with all 20 engine outputs.

Key payload sections mapped to report sections:

| Report Section | Payload Fields |
|---|---|
| Executive Diagnostic | `scores.overall_score`, `bands`, `explainability.why_this_score` |
| Score + Band | `scores`, `bands`, `warning_overlays` |
| Why This Score Is Not Higher | `explainability.why_not_higher`, `constraints`, `interactions` |
| Structural Indicator Breakdown | `indicators[]` |
| Constraint Hierarchy | `constraints` (root, primary, secondary, dependent, hidden_unlock) |
| Fragility & Failure Mode | `fragility`, `quality` |
| Stress Test Scenarios | `scenarios[]` |
| Score Lift Blueprint | `score_lift_projection` |
| Highest-Impact Actions | `recommended_actions[]`, `avoid_actions[]` |
| Reassessment Triggers | `reassessment_triggers[]` |
| Peer / Cluster Context | `benchmarks` |
| Verification & Integrity | `integrity`, `model_manifest`, `confidence` |

---

## 11. FRONTEND PAGE-BY-PAGE UI SPEC

### Page 1 — Landing Page

**Purpose**: Communicate the product's value and drive intake conversion.

**Sections**:
1. Hero — headline, subline, single CTA button
2. What You'll Learn — 6 diagnostic question previews as concise bullets
3. How It Works — 3-step strip (Answer → Score → Act)
4. Sample Score Card — static example of a score + band display
5. Who This Is For — 3 archetype cards (Freelancer, Advisor, Business Owner)
6. Pricing CTA — single tier or comparison
7. Footer — legal, verification link, model version

**Key States**: Default only (no auth-dependent state)

**Mobile**: Stack all sections vertically. Hero text left-aligned. CTA full-width.

**Trust**: Model version shown in footer. "Deterministic scoring — no AI, no subjective judgment" tagline.

---

### Page 2 — Intake Page

**Purpose**: Collect 6 diagnostic answers + profile context.

**Sections**:
1. Progress bar — 6 steps + profile step, numbered
2. Question card — one question visible at a time
3. Answer options — 5 segmented cards, vertically stacked
4. Definition drawer — expandable "What does this mean?" below question
5. Navigation — Back / Next buttons, keyboard navigation support

**Components**:
- `QuestionCard`: Question label (serif, large), explanation (sans, muted), definition toggle
- `AnswerOption`: Card with letter badge (A–E), answer text, selection state (border highlight, no fill change)
- `ProgressBar`: Horizontal steps, current step filled, completed steps checked
- `DefinitionDrawer`: Collapsible below question text, light background, smaller type

**Data Requirements**: Question text from locked constants. No API call until submit.

**Key States**:
- `unanswered` — no selection, Next disabled
- `answered` — selection highlighted, Next enabled
- `reviewing` — navigating back to change answer

**Mobile**: Full-width cards. Minimum 48px tap targets. Scroll to top on step change.

**Accessibility**: Keyboard navigation (arrow keys for answer selection, Enter to advance). ARIA labels on all interactive elements. Focus management on step transitions.

**Premium Feel**: Generous whitespace around question. Serif heading. Calm, unhurried pacing. No countdown timers or urgency language.

---

### Page 3 — Review Answers Page

**Purpose**: Let user confirm answers before irreversible submission.

**Sections**:
1. Header — "Review Your Answers"
2. Answer summary — 6 rows, each showing question label, selected answer, and edit button
3. Profile summary — operating structure, income model, sector
4. Submit CTA — "Generate My Assessment"

**Components**:
- `ReviewRow`: Question label (truncated), answer text, "Edit" link → returns to that step
- `SubmitButton`: Full-width, navy background, disabled until all 6 + profile answered

**Key States**:
- `complete` — all answered, submit enabled
- `incomplete` — missing answers highlighted with subtle border

**Mobile**: Stack rows vertically. Edit links right-aligned.

---

### Page 4 — Processing Page

**Purpose**: Transition state while assessment generates. Reinforce value and reduce abandonment.

**Sections**:
1. Status indicator — animated dots or subtle progress ring (no spinner)
2. Stage text — cycling through: "Validating inputs…", "Computing structure score…", "Analyzing constraints…", "Generating report…"
3. Reassurance text — "Your assessment is generated deterministically. Same inputs, same score, every time."

**Duration**: 2–4 seconds total (artificial delay for perceived thoroughness).

**Key States**:
- `processing` — animation active
- `complete` — auto-redirect to report page
- `error` — show error message with retry CTA

**Mobile**: Centered vertically. No horizontal scroll.

---

### Page 5 — Report Page

**Purpose**: The core product experience. Must feel like a $200+ diagnostic.

**Sections** (in order):

1. **Executive Diagnostic Header**
   - Score displayed large (72px+ font, serif)
   - Band label with color-coded badge
   - Sub-band if applicable
   - Warning overlays as subtle pills below band
   - One-sentence `why_this_score` summary

2. **Score Composition**
   - Structure score bar (x/60)
   - Stability score bar (x/40)
   - Quality adjustment indicator
   - Net interaction adjustment indicator
   - Horizontal stacked bar or two discrete bars

3. **Why This Score Is Not Higher**
   - `why_not_higher` text block
   - Root constraint highlighted with icon
   - Interaction effects listed if applicable

4. **Structural Indicator Breakdown**
   - 6 indicators as horizontal rows
   - Each: label, level badge, normalized bar (0–100)
   - Sorted by impact (lowest first = most concerning)

5. **Constraint Hierarchy**
   - Root → Primary → Secondary cascade
   - Dependent constraint shown if exists
   - Hidden unlock shown if exists
   - Visual hierarchy: indented cards or connected nodes

6. **Fragility & Failure Mode**
   - Fragility score + class badge
   - Failure modes listed
   - Deduction breakdown table
   - Durability grade indicator

7. **Stress Test Scenarios**
   - 6 scenario cards
   - Each: scenario label, description, original score → scenario score, band shift indicator
   - Most severe scenario highlighted

8. **Score Lift Blueprint**
   - 5 individual lift scenarios as ranked cards
   - Combined top two shown prominently
   - Each: change description, projected score, lift amount, band shift indicator

9. **Highest-Impact Actions**
   - Prioritized action list (numbered)
   - Each: label, description, expected impact, sequencing note if blocked
   - Avoid actions shown separately in muted section

10. **Reassessment Triggers**
    - Trigger cards with condition, threshold, current value
    - Clear "reassess when" framing

11. **Peer / Cluster Context**
    - Peer percentile
    - Cluster average score
    - Top 20% threshold
    - Band distribution bar
    - Outlier dimensions listed

12. **Verification & Model Integrity**
    - Assessment ID
    - Issue date
    - Model version string
    - Confidence level badge
    - Record hash (truncated)
    - "Verify this assessment" link
    - Manifest versions listed

**Mobile**: Single column. Sections stack. Score still prominent. Cards full-width. Scenario cards scroll horizontally if needed.

**Accessibility**: All data tables use proper `<table>` semantics. Score bars have `aria-valuenow`. Color is never the sole indicator.

**Premium Feel**: Ample whitespace between sections. Serif headings for section titles. Muted borders between sections. No clutter. Score presentation should feel like a credit report or institutional document.

---

### Page 6 — Verification Page

**Purpose**: Third-party verification of assessment authenticity.

**Sections**:
1. Verification status badge — "Verified Active" / "Superseded" / "Revoked"
2. Assessment metadata — ID, date, model version
3. Score + Band (display only)
4. Integrity hashes — input_hash, output_hash, manifest_hash, record_hash
5. Model manifest details

**Data**: Fetched via `GET /api/v2/verify/[id]`

**Trust**: This page should feel like a certificate verification portal.

---

### Page 7 — Compare / Reassessment Page

**Purpose**: Side-by-side comparison of two assessments.

**Sections**:
1. Score comparison — two large scores with delta indicator (+/- badge)
2. Band comparison — prior and current bands
3. Factor deltas table — each factor with prior → current values and directional arrow
4. Improvement narrative text block
5. Remaining triggers — what's left to improve

**Data**: Fetched via `POST /api/v2/compare`

---

### Page 8 — Advisor Summary Page

**Purpose**: Condensed view for professional advisors reviewing a client's assessment.

**Sections**:
1. Client score + band header
2. Root constraint + top suppressors
3. Highest-lift action
4. Top risk scenario
5. Fragility class + primary failure mode
6. Recommended actions (top 3)
7. Reassessment readiness

**Design**: Printable. Single page if possible. No interactive elements. Clean PDF export target.

---

### Page 9 — Assessment History Page

**Purpose**: View and manage past assessments.

**Sections**:
1. Assessment list — date, score, band, status badge, link to report
2. Compare CTA — select two assessments to compare
3. Current/active indicator — green dot on most recent active

**Data**: Fetched via `GET /api/v2/history`

---

## 12. QUESTION FLOW AND INTAKE SPEC

### Exact Answer Mapping Table

```
┌──────┬────────┬──────────────────────────────────┬──────────────────────────┬──────────┐
│ Q#   │ Answer │ Answer Text                      │ Canonical Field          │ Value    │
├──────┼────────┼──────────────────────────────────┼──────────────────────────┼──────────┤
│ Q1   │ A      │ 0–10%                            │ income_persistence_pct   │ 5        │
│ Q1   │ B      │ 11–30%                           │ income_persistence_pct   │ 20       │
│ Q1   │ C      │ 31–60%                           │ income_persistence_pct   │ 45       │
│ Q1   │ D      │ 61–85%                           │ income_persistence_pct   │ 73       │
│ Q1   │ E      │ 86–100%                          │ income_persistence_pct   │ 93       │
├──────┼────────┼──────────────────────────────────┼──────────────────────────┼──────────┤
│ Q2   │ A      │ 90–100%                          │ largest_source_pct       │ 95       │
│ Q2   │ B      │ 70–89%                           │ largest_source_pct       │ 80       │
│ Q2   │ C      │ 50–69%                           │ largest_source_pct       │ 60       │
│ Q2   │ D      │ 30–49%                           │ largest_source_pct       │ 40       │
│ Q2   │ E      │ Under 30%                        │ largest_source_pct       │ 15       │
├──────┼────────┼──────────────────────────────────┼──────────────────────────┼──────────┤
│ Q3   │ A      │ 1                                │ source_diversity_count   │ 1        │
│ Q3   │ B      │ 2                                │ source_diversity_count   │ 2        │
│ Q3   │ C      │ 3–4                              │ source_diversity_count   │ 3        │
│ Q3   │ D      │ 5–7                              │ source_diversity_count   │ 6        │
│ Q3   │ E      │ 8 or more                        │ source_diversity_count   │ 8        │
├──────┼────────┼──────────────────────────────────┼──────────────────────────┼──────────┤
│ Q4   │ A      │ Less than 1 month                │ forward_secured_pct      │ 4        │
│ Q4   │ B      │ 1–2 months                       │ forward_secured_pct      │ 12       │
│ Q4   │ C      │ 3–5 months                       │ forward_secured_pct      │ 33       │
│ Q4   │ D      │ 6–11 months                      │ forward_secured_pct      │ 71       │
│ Q4   │ E      │ 12 or more months                │ forward_secured_pct      │ 100      │
├──────┼────────┼──────────────────────────────────┼──────────────────────────┼──────────┤
│ Q5   │ A      │ More than 75%                    │ income_variability_level │ extreme  │
│ Q5   │ B      │ 50–75%                           │ income_variability_level │ high     │
│ Q5   │ C      │ 25–49%                           │ income_variability_level │ moderate │
│ Q5   │ D      │ 10–24%                           │ income_variability_level │ low      │
│ Q5   │ E      │ Less than 10%                    │ income_variability_level │ low      │
├──────┼────────┼──────────────────────────────────┼──────────────────────────┼──────────┤
│ Q6   │ A      │ 0%                               │ labor_dependence_pct     │ 100      │
│ Q6   │ B      │ 1–25%                            │ labor_dependence_pct     │ 87       │
│ Q6   │ C      │ 26–50%                           │ labor_dependence_pct     │ 62       │
│ Q6   │ D      │ 51–75%                           │ labor_dependence_pct     │ 37       │
│ Q6   │ E      │ 76–100%                          │ labor_dependence_pct     │ 12       │
└──────┴────────┴──────────────────────────────────┴──────────────────────────┴──────────┘
```

### Microcopy Strategy

- Question labels: Direct, no jargon. Present tense.
- Definitions: Shown below question in muted text. Always visible (not hidden behind toggle in v1 — toggle is for expanded clarification).
- Answer card text: The exact range text. No rephrasing.
- Expanded clarification: Examples relevant to the user's industry sector if available.

### Validation Behavior

- Cannot advance without selecting an answer
- Cannot submit without all 6 questions + profile complete
- No back-button data loss (state preserved in memory + optional save-progress)

### Edge Cases

- Browser back button: preserve state, show current step
- Page refresh: restore from `intake_progress` if saved, otherwise restart
- Tab close: prompt "unsaved progress" warning if answers exist

---

## 13. REPORT GENERATION AND RENDERING SPEC

### Generation Flow

1. User submits answers → `POST /api/v2/assessment/submit`
2. Server runs full 20-engine pipeline (pure functions, ~50ms)
3. Server persists `AssessmentRecord` to database
4. Server returns `assessment_id` + summary
5. Client redirects to `/report/[id]`
6. Report page fetches `GET /api/v2/report/[id]`
7. Client renders all 12 report sections from payload

### Rendering Strategy

- **Server-side rendering** for the report page (SEO not needed, but SSR ensures fast first paint)
- **Static section components**: Each report section is a standalone component receiving typed props
- **No client-side scoring**: All computation happens server-side. Report page is a read-only render.
- **Print stylesheet**: `@media print` rules ensure clean single-page-per-section printing
- **PDF export**: Phase 2 — use `@react-pdf/renderer` or Puppeteer for server-side PDF generation from the same component tree

### Rendering Rules

- Score is always displayed as integer (no decimals)
- Bands always use exact canonical names
- Percentage values always shown with `%` suffix
- Point values always shown with `/max` suffix (e.g., "13/15")
- Narrative text uses sixth-grade reading level
- No repeated content across sections
- No generic filler — every sentence must be generated from assessment data

---

## 14. TESTING STRATEGY

### Unit Tests (per engine)

```typescript
// tests/engines/scoring.test.ts — Example

import { describe, it, expect } from "vitest";
import { computeRawScores, computeContinuityMonths } from "../../src/lib/engine/v2/engines/04-scoring";

describe("Scoring Engine", () => {
  it("scores all-minimum inputs correctly", () => {
    const input: CanonicalInput = {
      income_persistence_pct: 5,
      largest_source_pct: 95,
      source_diversity_count: 1,
      forward_secured_pct: 4,
      income_variability_level: "extreme",
      labor_dependence_pct: 100,
    };
    const scores = computeRawScores(input);
    expect(scores.income_persistence_score).toBe(1);
    expect(scores.source_diversity_score).toBe(1);
    expect(scores.forward_security_score).toBe(0);
    expect(scores.concentration_resilience_score).toBe(0);
    expect(scores.labor_dependence_score).toBe(2);
    expect(scores.variability_score).toBe(0);
    expect(scores.structure_subtotal).toBe(2);   // 1+1+0+0
    expect(scores.stability_subtotal).toBe(2);   // 2+0+continuity
  });

  it("scores all-maximum inputs correctly", () => {
    const input: CanonicalInput = {
      income_persistence_pct: 93,
      largest_source_pct: 15,
      source_diversity_count: 8,
      forward_secured_pct: 100,
      income_variability_level: "low",
      labor_dependence_pct: 12,
    };
    const scores = computeRawScores(input);
    expect(scores.income_persistence_score).toBe(15);
    expect(scores.source_diversity_score).toBe(10);
    expect(scores.forward_security_score).toBe(15);
    expect(scores.concentration_resilience_score).toBe(10);
    expect(scores.labor_dependence_score).toBe(20);
    expect(scores.variability_score).toBe(10);
    expect(scores.structure_subtotal).toBe(50);
    expect(scores.stability_subtotal).toBe(40);  // 20+10+10
  });

  it("computes continuity months deterministically", () => {
    const input: CanonicalInput = {
      income_persistence_pct: 45,
      largest_source_pct: 60,
      source_diversity_count: 3,
      forward_secured_pct: 33,
      income_variability_level: "moderate",
      labor_dependence_pct: 62,
    };
    const months = computeContinuityMonths(input);
    // (45*0.03) + (33*0.04) + ((100-62)*0.02) - (60*0.015)
    // = 1.35 + 1.32 + 0.76 - 0.90
    // = 2.53
    expect(months).toBeCloseTo(2.53, 1);
  });

  it("clamps continuity months between 0 and 12", () => {
    // Extreme negative case
    const low: CanonicalInput = {
      income_persistence_pct: 0,
      largest_source_pct: 100,
      source_diversity_count: 1,
      forward_secured_pct: 0,
      income_variability_level: "extreme",
      labor_dependence_pct: 100,
    };
    expect(computeContinuityMonths(low)).toBe(0);

    // Extreme positive case
    const high: CanonicalInput = {
      income_persistence_pct: 100,
      largest_source_pct: 0,
      source_diversity_count: 8,
      forward_secured_pct: 100,
      income_variability_level: "low",
      labor_dependence_pct: 0,
    };
    expect(computeContinuityMonths(high)).toBe(9);  // 3+4+2-0 = 9
  });
});
```

### Integration Tests

```typescript
// tests/integration/full-pipeline.test.ts

describe("Full Assessment Pipeline", () => {
  it("produces identical output for identical inputs", () => {
    const raw: RawDiagnosticInput = {
      q1_recurring_revenue_base: "C",
      q2_income_concentration: "B",
      q3_income_source_diversity: "C",
      q4_forward_revenue_visibility: "B",
      q5_earnings_variability: "C",
      q6_income_continuity_without_labor: "B",
    };
    const profile: ProfileContext = {
      profile_class: "individual",
      operating_structure: "solo_service",
      primary_income_model: "commission",
      revenue_structure: "active_heavy",
      industry_sector: "real_estate",
      maturity_stage: "developing",
    };

    const result1 = executeAssessment(raw, profile);
    const result2 = executeAssessment(raw, profile);

    expect(result1.scores.overall_score).toBe(result2.scores.overall_score);
    expect(result1.integrity.record_hash).toBe(result2.integrity.record_hash);
    expect(result1.bands.primary_band).toBe(result2.bands.primary_band);
  });

  it("applies interaction penalties correctly", () => {
    const raw: RawDiagnosticInput = {
      q1_recurring_revenue_base: "A",  // low persistence → 5%
      q2_income_concentration: "A",    // high concentration → 95%
      q3_income_source_diversity: "A", // 1 source
      q4_forward_revenue_visibility: "A", // < 1 month → 4%
      q5_earnings_variability: "A",    // extreme
      q6_income_continuity_without_labor: "A", // 0% → 100% labor dependent
    };
    const profile: ProfileContext = {
      profile_class: "individual",
      operating_structure: "solo_service",
      primary_income_model: "commission",
      revenue_structure: "active_heavy",
      industry_sector: "real_estate",
      maturity_stage: "early",
    };

    const result = executeAssessment(raw, profile);

    // Should trigger CF-01 (concentration + weak visibility): -8
    // Should trigger CF-02 (labor + low persistence): -7
    // Should trigger CF-06 (few sources + extreme variability): -6
    // Total penalties: -21, clamped to -20
    expect(result.interactions.net_adjustment).toBe(-20);
    expect(result.bands.primary_band).toBe("Limited Stability");
  });
});
```

### Snapshot Tests

```typescript
// tests/integration/snapshot.test.ts

describe("Report Payload Snapshots", () => {
  it("matches snapshot for canonical test case", () => {
    const result = executeAssessment(CANONICAL_TEST_INPUT, CANONICAL_TEST_PROFILE);
    expect(result).toMatchSnapshot();
  });
});
```

### Exhaustive Determinism Test

```typescript
// tests/integration/exhaustive-combos.test.ts

describe("Exhaustive Deterministic Verification", () => {
  it("all 15,625 answer combinations produce consistent results", () => {
    const choices: AnswerChoice[] = ["A", "B", "C", "D", "E"];
    let count = 0;

    for (const q1 of choices) {
      for (const q2 of choices) {
        for (const q3 of choices) {
          for (const q4 of choices) {
            for (const q5 of choices) {
              for (const q6 of choices) {
                const raw = {
                  q1_recurring_revenue_base: q1,
                  q2_income_concentration: q2,
                  q3_income_source_diversity: q3,
                  q4_forward_revenue_visibility: q4,
                  q5_earnings_variability: q5,
                  q6_income_continuity_without_labor: q6,
                };
                const profile = DEFAULT_PROFILE;

                const r1 = executeAssessment(raw, profile);
                const r2 = executeAssessment(raw, profile);

                expect(r1.scores.overall_score).toBe(r2.scores.overall_score);
                expect(r1.integrity.input_hash).toBe(r2.integrity.input_hash);
                expect(r1.bands.primary_band).toBe(r2.bands.primary_band);

                // Bounds check
                expect(r1.scores.overall_score).toBeGreaterThanOrEqual(0);
                expect(r1.scores.overall_score).toBeLessThanOrEqual(100);

                count++;
              }
            }
          }
        }
      }
    }
    expect(count).toBe(15625);  // 5^6
  });
});
```

### Version Manifest Tests

```typescript
describe("Manifest Integrity", () => {
  it("manifest hash is stable across invocations", () => {
    const m1 = computeIntegrity(SAMPLE_INPUT, SAMPLE_SCORES, "test-id");
    const m2 = computeIntegrity(SAMPLE_INPUT, SAMPLE_SCORES, "test-id");
    expect(m1.manifest_hash).toBe(m2.manifest_hash);
  });
});
```

---

## 15. OPEN QUESTIONS / ASSUMPTIONS

### Open Questions

1. **Q5 answer D and E both map to "low"**: The spec defines D (10–24%) and E (< 10%) — both are mapped to `income_variability_level: "low"`. This means D and E produce identical factor scores (10 points). Should E receive a distinct mapping (e.g., `"very_low"` → 10 points, `"low"` → 8 points) to differentiate? **Assumption: Preserved as locked. Both D and E → "low" → 10 points.**

2. **Quality adjustment contribution to structure block**: The spec allocates 10 points for "quality adjustment contribution" within the 60-point structure block. However, quality depends on extended inputs that are optional. If no extended inputs are provided, quality defaults to 5/10. This means the max achievable structure score without extended inputs is 55/60. **Assumption: This is intentional — extended inputs unlock the full scoring range.**

3. **Continuity score formula edge case**: The continuity formula can produce negative values when `largest_source_pct` is very high and other factors are very low. The spec says clamp to 0. **Assumption: Implemented as specified with floor of 0.**

4. **Interaction rules CF-04 and CF-05 depend on extended inputs**: These penalties only fire if `cancellation_risk_level` or `booked_but_cancelable_pct` are provided. Users without extended inputs will never trigger these penalties. **Assumption: This is intentional — the system is less precise without extended inputs, reflected in diagnostic confidence.**

5. **Benchmarking data source**: Benchmark clusters (peer_percentile, cluster_average, etc.) require population data. Initial launch will have no real data. **Assumption: Seed with curated estimates per sector. Mark benchmark confidence as "estimated" until sufficient data exists.**

6. **Profile context collection timing**: Should profile context be collected before, during, or after the 6 diagnostic questions? **Assumption: Collected as a 7th step after the 6 questions but before submission.**

7. **Source diversity count: Q3 maps E → 8, but scoring table caps at 6+**: Counts of 7 and 8 all score 10 points. **Assumption: Intentional — diminishing returns above 6 sources.**

### Assumptions Made

1. Q6 answer labels corrected to A, B, C, D, E (not A, B, C, C, E)
2. `overall_score` is clamped to [0, 100] after interaction adjustments
3. Extended inputs default to `null` — engines that need them handle the null case gracefully
4. Fragility rules for variability "high" and "extreme" are mutually exclusive (extreme takes priority) — implemented so both deductions are tracked but only the applicable one fires
5. Assessment IDs are UUIDv4
6. All hashes use SHA-256
7. Timestamps are UTC ISO 8601
8. The quality adjustment maps quality_score 0–10 directly to 0–10 structure points (1:1)

---

## 16. IMMEDIATE IMPLEMENTATION ORDER

### Phase 1 — Core Scoring Pipeline (Week 1–2)

```
Priority  Engine                              File
────────  ──────────────────────────────────  ─────────────────────────
1.1       Zod Schemas                         schemas/input.schema.ts
1.2       Input Validation Engine             engines/01-input-validation.ts
1.3       Income Normalization Engine         engines/03-income-normalization.ts
1.4       Deterministic Scoring Engine        engines/04-scoring.ts
1.5       Income Quality & Durability Engine  engines/08-income-quality.ts
1.6       Cross-Factor Dependency Engine      engines/07-cross-factor-dependency.ts
1.7       Band Classification Engine          engines/05-band-classification.ts
1.8       Structural Indicators Engine        engines/06-structural-indicators.ts
1.9       Constraint Hierarchy Engine         engines/09-constraint-hierarchy.ts
1.10      Explainability Engine               engines/15-explainability.ts
1.11      Orchestrator (Phase 1)              index.ts
1.12      Unit + Integration Tests            tests/engines/*.test.ts
```

### Phase 2 — Advanced Analysis (Week 3–4)

```
Priority  Engine                              File
────────  ──────────────────────────────────  ─────────────────────────
2.1       Fragility Engine                    engines/10-fragility.ts
2.2       Sensitivity / Marginal Impact       engines/11-sensitivity.ts
2.3       Risk Scenario Engine                engines/12-risk-scenarios.ts
2.4       Score Lift Simulator                engines/13-score-lift.ts
2.5       Action Prioritization Engine        engines/16-action-prioritization.ts
2.6       Profile Context Resolution          engines/02-profile-context.ts
2.7       Orchestrator (Phase 2)              index.ts (extend)
2.8       API Routes                          api/v2/assessment/*.ts
2.9       Database Schema + Migrations        db/schema.sql
2.10      Full Pipeline Integration Tests     tests/integration/*.test.ts
```

### Phase 3 — Completeness & Polish (Week 5–6)

```
Priority  Engine                              File
────────  ──────────────────────────────────  ─────────────────────────
3.1       Benchmarking Engine                 engines/18-benchmarking.ts
3.2       Comparative Reassessment Engine     engines/19-comparative-reassessment.ts
3.3       Diagnostic Confidence Engine        engines/14-diagnostic-confidence.ts
3.4       Reassessment Trigger Engine         engines/17-reassessment-triggers.ts
3.5       Integrity & Manifest Engine         engines/20-integrity-manifest.ts
3.6       Reason Code Registry                reason-codes.ts
3.7       Exhaustive Combo Tests              tests/integration/exhaustive.test.ts
3.8       Snapshot Tests                      tests/integration/snapshot.test.ts
```

### Phase 4 — Frontend (Week 5–8, parallel with Phase 3)

```
Priority  Page                                File
────────  ──────────────────────────────────  ─────────────────────────
4.1       Intake Flow                         (app)/intake/page.tsx
4.2       Review Answers                      (app)/review-answers/page.tsx
4.3       Processing State                    (app)/processing/page.tsx
4.4       Report Page                         (app)/report/[id]/page.tsx
4.5       Verification Page                   (app)/verify/[id]/page.tsx
4.6       Assessment History                  (app)/history/page.tsx
4.7       Compare Page                        (app)/compare/page.tsx
4.8       Advisor Summary                     (app)/advisor/[id]/page.tsx
4.9       Landing Page Updates                (marketing)/page.tsx
```

---

*End of Implementation Specification*
*RUNPAYWAY™ | Model RP-1.0 | Version 2.0 Build Spec*
