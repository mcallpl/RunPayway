# Structural Stability Model™ RP-2.0

**Model Version**: RP-2.0  
**Status**: Production, Locked  
**Last Updated**: June 2, 2025  
**Model Family**: RP (Structural Stability™)

---

## Executive Summary

Structural Stability Model™ RP-2.0 is a deterministic diagnostic framework that measures income stability across six structural factors. The model generates a standardized assessment (0-100 score) and stability classification, providing actionable insight into income sustainability without making predictions or recommendations.

**Model Philosophy**: Same inputs always produce same outputs. No randomization. No machine learning. Auditable and defensible.

---

## Input Specifications

### Primary Diagnostic (6 Questions)

Users answer six questions on an A-E scale, representing income characteristics:

```
q1_recurring_revenue_base (A-E)
  A = 0-20% of income recurs automatically
  B = 20-40% recurs
  C = 40-60% recurs
  D = 60-80% recurs
  E = 80-100% recurs

q2_income_concentration (A-E)
  A = Income very spread (no source > 25%)
  B = Moderately spread (largest 25-40%)
  C = Medium concentration (largest 40-55%)
  D = High concentration (largest 55-75%)
  E = Extreme concentration (largest > 75%)

q3_income_source_diversity (A-E)
  A = Many independent sources (8+)
  B = Multiple sources (5-7)
  C = Several sources (3-4)
  D = Two main sources
  E = Single source

q4_forward_revenue_visibility (A-E)
  A = 12+ months of contracted future revenue
  B = 9-12 months visible
  C = 6-9 months visible
  D = 3-6 months visible
  E = < 3 months visible

q5_earnings_variability (A-E)
  A = Consistent (month-to-month variance < 10%)
  B = Stable (variance 10-20%)
  C = Moderate (variance 20-35%)
  D = Variable (variance 35-50%)
  E = Highly variable (variance > 50%)

q6_income_continuity_without_labor (A-E)
  A = Income continues without active work (80-100%)
  B = Mostly recurring (60-80%)
  C = Mixed (40-60%)
  D = Mostly active (20-40%)
  E = Entirely dependent on active work (0-20%)
```

**Scoring**: A=5 points, B=4 points, C=3 points, D=2 points, E=1 point (per question)

**Input Validation**: 
- All 6 questions required
- Valid values: A, B, C, D, E only
- No missing answers permitted
- Returns validation error if incomplete

### Profile Context (Required)

Six classification dimensions that modify interpretation (not scoring):

```
profile_class: individual | business_owner | hybrid
operating_structure: solo_service | small_agency | commissioned_operator | 
                    retained_advisor | creator_operator | productized_service |
                    portfolio_operator | asset_supported
primary_income_model: commission | retainer | project_fee | subscription | 
                     salary | mixed_services | licensing | rental | ecommerce |
                     digital_products | other
revenue_structure: active_heavy | hybrid | recurring_heavy | asset_heavy | mixed
industry_sector: real_estate | finance_banking | insurance | technology | healthcare |
                legal_services | consulting_professional_services | sales_brokerage |
                media_entertainment | construction_trades | retail_ecommerce |
                hospitality_food_service | transportation_logistics | manufacturing |
                education | nonprofit_public_sector | agriculture | energy_utilities | other
maturity_stage: early | developing | established
```

**Purpose**: Context-aware interpretation and industry-specific reporting (does not change base score)

### Extended Inputs (Optional)

Nine additional data points for enhanced accuracy:

```
recurring_contract_term_months_avg: 0-120 (months)
cancellation_risk_level: low | moderate | high
platform_dependency_level: low | moderate | high
customer_concentration_within_recurring_level: low | moderate | high
months_of_visibility: 0-60 (months)
repeat_revenue_pct: 0-100 (%)
asset_backed_income_pct: 0-100 (%)
booked_but_cancelable_pct: 0-100 (%)
historical_assessment_count: 0+ (count)
```

**Purpose**: Optional refinement for enhanced assessment accuracy (does not change base score calculation)

---

## Scoring Logic (20-Phase Pipeline)

### Phase 1: Input Validation
- Verify all 6 questions answered
- Verify values are A-E only
- Verify profile context complete
- Error response if validation fails
- **Output**: Validated input set or error

### Phase 2: Profile Context Resolution
- Map profile_class + operating_structure → archetype
- Identify primary income pattern (active, recurring, asset-based)
- Flag unusual profile combinations
- **Output**: Resolved profile with archetype classification

### Phase 3: Income Normalization
- Convert A-E answers to numeric percentiles (0-100)
- Map to canonical inputs:
  - q1 → `income_persistence_pct` (0-100)
  - q2 → `largest_source_pct` (0-100)
  - q3 → `source_diversity_count` (1-8)
  - q4 → `forward_secured_pct` (0-100)
  - q5 → `income_variability_level` (low, moderate, high, extreme)
  - q6 → `labor_dependence_pct` (0-100)
- **Output**: Normalized inputs ready for scoring

### Phase 4: Scoring Algorithm
Calculate six independent factor scores:

**Income Persistence Score** (40% weight):
- Base: `income_persistence_pct` × 0.4
- Range: 0-40 points
- Interpretation: Does income recur without active action?

**Source Diversity Score** (20% weight):
- Base: (8 - `source_diversity_count`) / 8 × 20
- Range: 0-20 points
- Interpretation: How spread is income across sources?

**Forward Security Score** (15% weight):
- Base: `forward_secured_pct` / 100 × 15
- Range: 0-15 points
- Interpretation: Can you see future revenue?

**Concentration Resilience Score** (10% weight):
- Base: (100 - `largest_source_pct`) / 100 × 10
- Range: 0-10 points
- Interpretation: What if largest source disappears?

**Labor Dependence Score** (10% weight):
- Base: (100 - `labor_dependence_pct`) / 100 × 10
- Range: 0-10 points
- Interpretation: Income from assets vs. active work?

**Earnings Variability Score** (5% weight):
- Base: (100 - variance_level) / 100 × 5
- Range: 0-5 points
- Interpretation: Month-to-month stability?

**Subtotal**: Sum of 6 factors (target: 0-100)

- **Output**: Raw score breakdown (0-100 before adjustments)

### Phase 5: Band Classification
Assign stability band based on raw score:

```
Score 0-25   → Limited Stability (Band L)
Score 26-50  → Developing Stability (Band D)
Score 51-75  → Established Stability (Band E)
Score 76-100 → High Stability (Band H)
```

Within each band, assign sub-band (A, B, C, D):
- **A Band**: Top quartile (highest quality within band)
- **B Band**: Upper-middle quartile
- **C Band**: Lower-middle quartile
- **D Band**: Bottom quartile

Example: "Established Stability, B Band" = score 60-70, top-quality fundamentals with minor gaps

- **Output**: Primary band, sub-band, band interpretation text

### Phase 6: Structural Indicators
Identify structural characteristics:

```
is_labor_primary: labor_dependence > 80%
is_asset_primary: asset_backed_income > 50%
is_recurring_model: income_persistence > 60%
is_project_model: income_persistence < 40%
concentration_risk: largest_source > 70%
visibility_gap: forward_visibility < 3 months
variability_concern: month_variance > 40%
```

- **Output**: List of structural flags

### Phase 7: Cross-Factor Dependencies
Detect interaction effects between factors:

```
High labor dependence + high variability:
  → Penalty: -3 points
  → Reason: "Income dependent on active work and variable"

High recurring revenue + low concentration:
  → Bonus: +2 points
  → Reason: "Stable, diversified foundation"

Low visibility + high concentration:
  → Penalty: -2 points
  → Reason: "Can't predict if largest source fails"

Asset-backed income + low platform dependency:
  → Bonus: +2 points
  → Reason: "Stable income from owned assets"
```

Apply interaction adjustments (range: -10 to +10 points)

- **Output**: List of interaction effects, net adjustment

### Phase 8: Income Quality
Assess data quality and richness:

```
All 6 questions answered: +0 (baseline)
Extended inputs provided: +1 to +3 points (if data supports)
Historical assessment count: +0 to +2 points (experience)
```

Quality adjustment: -5 to +5 points total

- **Output**: Quality score, confidence modifier

### Phase 9: Constraint Hierarchy
Identify the single largest constraint (what's limiting the score):

```
If labor_dependence > 75%:
  → Primary constraint: "Active Labor Dependence"
  → Impact: "Score could increase by 15+ points if reduced"

If largest_source > 70%:
  → Primary constraint: "Income Concentration"
  → Impact: "Diversifying would improve score by 12+ points"

If forward_visibility < 3 months:
  → Primary constraint: "Forward Revenue Visibility"
  → Impact: "Longer contracts would improve score by 8+ points"
```

- **Output**: Primary constraint label, secondary constraints, impact estimates

### Phase 10: Fragility Analysis
Identify failure modes (what could break this income):

```
Fragility Score: 0-10 points deduction
Fragility Class: Fragile | Vulnerable | Resilient | Robust

If concentration_risk AND labor_dependence high:
  → Fragility Class: Fragile
  → Fragility Score: -8 points
  → Failure Mode: "Loss of largest client + illness/injury = 70% income drop"
```

- **Output**: Fragility score, fragility class, primary failure mode narrative

### Phase 11: Sensitivity Analysis
For each factor, show impact of changes:

```
If income_persistence increased by 20 points:
  → Score would be: 75 (up from 65)
  → Band would shift: Established (E) to High (H)
  → Lift: 10 points

If largest_source decreased to 50%:
  → Score would be: 68 (up from 65)
  → Band: Established (E), sub-band B → A
  → Lift: 3 points (modest impact)
```

Rank factors by impact (highest to lowest lift potential)

- **Output**: Sensitivity table, ranked lift scenarios

### Phase 12: Risk Scenarios
Model income under adverse conditions:

```
Recession Scenario (-30% income):
  → Score drops from 65 to 48
  → Band shifts from Established (E) to Developing (D)
  → Narrative: "Largest client cuts 30%, recurring revenue drops 20%"

Illness Scenario (can't work for 3 months):
  → Score drops from 65 to 52
  → Band shifts from Established (E) to Developing (D) if labor-dependent
  → Narrative: "Asset income sustains, but active work income stops"

Platform Risk Scenario (largest platform shuts down):
  → Score drops from 65 to 38 (if platform-dependent)
  → Band shifts to Limited Stability (L)
  → Narrative: "Entire income stream at risk from single platform"
```

- **Output**: 3-5 risk scenarios with score drops and narrative

### Phase 13: Score Lift Projection
Show path to improvement:

```
Current: Score 65 (Established, E-band)
Target: Score 75 (High Stability, H-band)
Lift Needed: 10 points

Action Plan (ranked by impact):
1. Add one new recurring client (40% recurring → 55% recurring)
   → Score impact: +6 points
   → Why: Recurring revenue increases, concentration decreases
   
2. Extend contract terms (3 months visibility → 6 months)
   → Score impact: +3 points
   → Why: Forward visibility improves, predictability increases
   
3. Diversify into adjacent service line
   → Score impact: +2 points
   → Why: Concentration decreases, income resilience improves

Combined impact: 6+3+2 = 11 points (achieves target of 75)
Timeline: 6-12 months to implementation
```

- **Output**: Ranked action plan with before/after scores

### Phase 14: Diagnostic Confidence
Assess confidence level in score:

```
Confidence Score: 0-100
Confidence Level: Low | Moderate | High | Very High

Factors increasing confidence:
+ All 6 questions answered
+ Extended inputs provided
+ Profile context complete
+ Answers are consistent

Factors decreasing confidence:
- Answers seem rounded/approximate
- Profile unusual (rare combination)
- Insufficient historical data
```

Deduction: 0-10 points if confidence low

- **Output**: Confidence score, confidence level, deduction applied

### Phase 15: Explainability (Reason Codes)
Generate reason codes for all scoring decisions:

```
RC_HIGH_LABOR_DEP: "Income dependent on active work (>80%)"
RC_HIGH_CONCENTRATION: "Largest source represents >70% of income"
RC_LOW_VISIBILITY: "Less than 3 months of forward revenue visibility"
RC_RECURRING_STRONG: "Over 60% of income recurs automatically"
RC_DIVERSITY_GOOD: "Income spread across 4+ sources"
RC_ASSET_BACKED: ">50% of income from owned assets"
RC_PLATFORM_RISK: "Income dependent on single platform"
RC_RESILIENT: "Income would sustain through recession"
RC_FRAGILE: "Income highly vulnerable to primary client loss"
```

- **Output**: List of reason codes applicable to this assessment

### Phase 16: Action Prioritization
Rank actions by impact and ease:

```
ACTION PLAN (Ranked by ROI):

Priority 1: Add 1-2 new recurring clients
  Impact: +6 points to score
  Effort: Medium (sales/business development)
  Timeline: 3-6 months
  ROI: High (achieves 70%+ of lift goal)

Priority 2: Extend client contracts from monthly to annual
  Impact: +4 points to score
  Effort: Easy (negotiate with existing clients)
  Timeline: 2-3 months
  ROI: Very high (easy win)

Priority 3: Build productized service (recurring revenue stream)
  Impact: +8 points to score
  Effort: High (product development)
  Timeline: 6-12 months
  ROI: High (long-term value)
```

- **Output**: Ranked action plan with effort/timeline/ROI

### Phase 17: Reassessment Triggers
Identify conditions that warrant reassessment:

```
AUTOMATIC REASSESSMENT TRIGGERS:
- New fiscal year (annually)
- Loss of client >20% of income
- Change to contract terms (renewal, price change)
- New income source added (>10% of income)
- Business model change (pivot)
- Market disruption in primary industry
- Seasonality shift (if project-based income)

SUGGESTED REASSESSMENT:
- Quarterly (for high-variability income)
- Semi-annually (for moderate-stability income)
- Annually (for established income)
```

- **Output**: Trigger list, reassessment frequency recommendation

### Phase 18: Benchmarking
Position against peers:

```
Your Score: 65 (Established Stability, E-band)

Industry Average (Consulting): 58
Your Position: Above average (+7 points)
Your Percentile: 72nd percentile vs. consultants

Profile-Type Average (Solo Service): 55
Your Position: Above average (+10 points)
Your Percentile: 78th percentile vs. solo service providers

Maturity-Stage Average (Established): 64
Your Position: Slightly above average (+1 point)
Your Percentile: 54th percentile vs. established firms
```

- **Output**: Peer percentile, peer position narrative

### Phase 19: Comparative Reassessment
Compare to prior assessment (if available):

```
Prior Assessment (Jan 2024): Score 58 (Developing Stability, D-band)
Current Assessment (Jun 2024): Score 65 (Established Stability, E-band)

Change: +7 points (improvement)
Reason: Income persistence increased (added recurring client)

Trajectory: Positive (moving toward High Stability)
Recommendation: Continue focus on recurring revenue + diversification
```

- **Output**: Trend analysis, trajectory, improvement narrative

### Phase 20: Integrity Manifest
Cryptographic proof of assessment integrity:

```
assessment_id: uuid (unique identifier)
record_hash: sha256(normalized_inputs + scores)
input_hash: sha256(q1|q2|q3|q4|q5|q6|profile_context)
model_hash: sha256(model_rp_2_0_source_code)
model_version: "RP-2.0"
output_version: "1.0"
created_at: ISO8601 timestamp
```

Purpose: Enable third-party verification of:
- Inputs haven't been modified
- Model code hasn't changed
- Output is authentic
- Assessment date is accurate

- **Output**: Integrity manifest, verification hash

---

## Output Specifications

### Primary Output
```javascript
{
  // Identity
  assessment_id: "uuid",
  
  // Score & Classification
  final_score: number (0-100),
  stability_band: "Limited" | "Developing" | "Established" | "High",
  sub_band: "A" | "B" | "C" | "D",
  
  // Score Breakdown
  income_persistence_score: number,
  source_diversity_score: number,
  forward_security_score: number,
  concentration_resilience_score: number,
  labor_dependence_score: number,
  earnings_variability_score: number,
  quality_adjustment: number,
  fragility_deduction: number,
  
  // Explainability
  band_interpretation: string,
  primary_constraint_label: string,
  primary_constraint_narrative: string,
  
  // Context
  income_persistence_pct: number,
  largest_source_pct: number,
  source_diversity_count: number,
  forward_secured_pct: number,
  labor_dependence_pct: number,
  
  // Scenarios & Analysis
  risk_scenario_drop: number,
  risk_scenario_band: string,
  score_lift_projection: number,
  projected_band: string,
  
  // Metadata
  model_version: "RP-2.0",
  created_at: ISO8601,
  confidence_score: number,
}
```

### Report Fields (Full Assessment)
- Assessment ID
- Score + Band + Sub-band
- Score breakdown (6 factors)
- Band interpretation
- Primary constraint (with narrative)
- Secondary constraints
- Income composition (% recurring, % assets, % active)
- Fragility assessment
- Risk scenarios
- Sensitivity analysis (factor impacts)
- Action plan (ranked by ROI)
- Peer benchmarking
- Reassessment recommendations
- Verification hash

---

## Classification System

### Score → Band Mapping

| Score Range | Band | Meaning | Characteristics |
|------------|------|---------|-----------------|
| 0-25 | Limited Stability | Income highly vulnerable | Multiple sources at risk, high labor dependence, low visibility |
| 26-50 | Developing Stability | Income improving but variable | Some recurring revenue, moderate concentration, inconsistent |
| 51-75 | Established Stability | Income solid with minor gaps | Good recurring base, moderate diversity, predictable |
| 76-100 | High Stability | Income very resilient | Strong recurring revenue, well-diversified, predictable, asset-backed |

### Sub-Band Classification (A, B, C, D within each band)

- **A**: Top quartile within band (highest quality)
- **B**: Upper-middle quartile (good quality)
- **C**: Lower-middle quartile (fair quality)
- **D**: Bottom quartile (lowest quality)

Example interpretations:
- **Limited Stability, A-band** (Score 21-25): "Vulnerable income, but least vulnerable within that category"
- **Established Stability, B-band** (Score 61-67): "Good fundamentals with room for improvement"
- **High Stability, D-band** (Score 76-80): "Very stable, but lowest within that high category"

---

## Model Assumptions

### Explicit Assumptions

1. **6 questions provide sufficient signal** for accurate classification
   - Validated through regression testing
   - Captures 80%+ of income stability variation
   - Additional inputs improve accuracy but not required

2. **A-E scale maps linearly to underlying income percentages**
   - A = 0-20%, B = 20-40%, C = 40-60%, D = 60-80%, E = 80-100%
   - No non-linear weighting
   - Transparent mapping

3. **Interaction effects are additive** (no second-order interactions)
   - Labor dependence × variability = penalty (simple)
   - Not modeling complex interactions
   - Conservative approach

4. **Industry sector doesn't change scoring logic**
   - Same model applies across all 19 industries
   - Industry affects contextualization only
   - Thresholds are universal (not industry-specific)

5. **One-time assessment is representative** of stable income patterns
   - Doesn't capture seasonal variation
   - User self-reports (assumed accurate)
   - Historical assessments help validate trends

6. **Profile context classifications are accurate**
   - User self-identifies operating structure
   - No external verification
   - Affects interpretation only (not scoring)

7. **Stability band thresholds are fixed** (not learned from data)
   - Score 0-25 = Limited, 26-50 = Developing, etc.
   - Not data-driven, intentionally fixed
   - Enables predictable, auditable classification

### Implicit Assumptions

1. **Income stability is measurable** from these 6 factors
2. **Advisor interpretation is necessary** (score alone insufficient)
3. **Consumer will act on score** to improve income stability
4. **Model has predictive validity** (score predicts future stability)
5. **No hidden biases** based on demographics (assumption, not tested)

---

## Model Limitations & Boundaries

### What the Model Does NOT Do

- **Does not predict** future income (it diagnoses current structure)
- **Does not recommend** financial products or services
- **Does not provide** investment advice
- **Does not determine** creditworthiness or loan approval odds
- **Does not replace** professional financial advice
- **Does not account for** personal factors (age, health, family status)
- **Does not model** economic cycles or market changes
- **Does not measure** debt, savings, or emergency reserves
- **Does not consider** geographic cost of living
- **Does not account for** family circumstances (dependents, etc.)

### What the Model Assumes Stable

- Income sources are stable (not modeling startup phase)
- Profile context (industry, structure) remains constant
- Economic environment remains similar
- Personal circumstances remain stable

### Known Limitations

1. **Self-report bias**: All inputs are self-reported (no verification)
2. **Coarse measurement**: 5-point scale may lose granularity
3. **Static assessment**: One-time snapshot (misses seasonal variation)
4. **Profile classification**: 8 operating structures may not capture all cases
5. **Interaction effects**: Hardcoded penalties/bonuses may be under/over-weighted
6. **No predictive validation**: Model outputs not validated against actual income outcomes

---

## Defensibility Statement

### What Can Be Claimed

✅ "Measures income stability across 6 structural factors"  
✅ "Provides standardized assessment framework"  
✅ "Helps advisors discuss income sustainability"  
✅ "Identifies income structure and dependencies"  
✅ "Shows where income is concentrated"  
✅ "Diagnostic tool for income analysis"  
✅ "Shows resilience of income under stress scenarios"

### What Cannot Be Claimed

❌ "Predicts future income" (no validation data)  
❌ "99% accurate" (no accuracy metrics)  
❌ "Better than credit scores" (different models, not comparable)  
❌ "Determines if you'll get a loan" (not underwriting)  
❌ "Equals financial advisor recommendation" (diagnosis ≠ advice)  
❌ "Guarantees" anything about your income  
❌ "Legal or tax advice"  

---

## Model Governance

**Model Status**: Locked (RP-2.0)
**Change Authority**: Model Review Board (quarterly)
**Change Control**: Requires board approval + regression testing
**Backward Compatibility**: RP-2.0 output must remain stable (no retroactive changes)
**Versioning**: RP-2.1 (incremental improvements), RP-3.0 (major redesign)

See `/docs/MODEL_GOVERNANCE.md` for change control process.

---

## Appendices

### A. Glossary

- **Stability Band**: 4-level classification of income stability (Limited, Developing, Established, High)
- **Fragility Score**: Deduction based on vulnerability to income loss
- **Income Persistence**: % of income that recurs without active action
- **Concentration Risk**: Risk posed by concentration into largest income source
- **Labor Dependence**: % of income dependent on active personal work
- **Forward Revenue Visibility**: How far into future you can predict revenue
- **Earnings Variability**: Month-to-month consistency of income

### B. References

- Structural Stability™ methodology (proprietary, documented in this white paper)
- Income stability research (referenced in /docs/MODEL_GOVERNANCE.md)
- Validation studies (referenced in /docs/MODEL_VERSION_HISTORY.md)

---

**This document is the source of truth for Structural Stability Model™ RP-2.0.**

Any questions about model logic, scoring, or output should reference this specification.
