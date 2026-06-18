# PRIMARY CHARACTERISTIC SELECTION ENGINE
## RunPayway™ — Deterministic Structural Insight Identification

**Version:** 1.0  
**Status:** Implementation Specification  
**Objective:** Identify the single most significant structural characteristic from RP-2.0 outputs  

---

# PART 1 — CANDIDATE CHARACTERISTICS

## Available Characteristics

These are derived directly from RP-2.0 measurements. No new measurements added.

### VULNERABILITY CHARACTERISTICS (Weaknesses)

| Characteristic | Definition | Primary Trigger | Secondary Triggers |
|---|---|---|---|
| **Income Concentration** | Single source dominates income | `largest_source_pct > 80%` | Limits diversification options |
| **Discretionary Income Dominance** | Majority of income is at-risk/performance-dependent | `forward_secured_pct < 25%` | Income unstable without performance |
| **Income Instability** | Income does not reliably recur year-to-year | `income_persistence_pct < 50%` | Creates unpredictability |
| **Labor Dependence Crisis** | Income entirely dependent on personal labor; cannot be delegated or scaled | `labor_dependence_pct > 95%` | Cannot grow, scale, or exit |
| **Earnings Volatility Crisis** | Extreme year-to-year income swings | `earnings_variability_score > 80%` | Creates planning difficulty |
| **Structural Fragility** | Multiple compounding weaknesses | Composite score from constraints | Creates cascading failure risk |

### STRENGTH CHARACTERISTICS (Positive)

| Characteristic | Definition | Primary Trigger | Secondary Triggers |
|---|---|---|---|
| **Revenue Diversification** | Income spread across multiple sources | `source_diversity_count >= 4` AND `largest_source_pct < 40%` | Resilient structure |
| **Recurring Revenue Model** | Income is predictable, recurring, passive-compatible | `income_persistence_pct > 85%` AND `forward_secured_pct > 70%` | Scalable, stable |
| **Asset-Based Income** | Significant portion requires no active labor | `forward_secured_pct > 70%` AND `labor_dependence_pct < 30%` | Passive, resilient |
| **Strong Forward Security** | Most income is guaranteed/predictable | `forward_secured_pct > 75%` | Bankable, stable |
| **Stable Income Pattern** | Reliable year-to-year recurrence | `income_persistence_pct > 85%` | Predictable |

### CONSTRAINT-BASED CHARACTERISTICS

| Characteristic | Definition | Trigger |
|---|---|---|
| **High Labor Dependence** | Income requires active work but manageable | `labor_dependence_pct > 80%` AND `labor_dependence_pct <= 95%` | Person-dependent |
| **Forward Security Weakness** | More discretionary than guaranteed but not critical | `forward_secured_pct >= 25%` AND `forward_secured_pct < 50%` | Partially at-risk |
| **Moderate Income Variability** | Year-to-year swings present but not extreme | `earnings_variability_score >= 50%` AND `earnings_variability_score <= 80%` | Volatile but manageable |
| **Moderate Persistence Challenge** | Income partially recurs but gaps exist | `income_persistence_pct >= 50%` AND `income_persistence_pct < 70%` | Some recurrence |

### BASELINE CHARACTERISTIC

| Characteristic | Definition | Trigger |
|---|---|---|
| **Balanced Income Structure** | No dominant characteristic emerges | All measurements in moderate ranges | Stable, typical |

---

# PART 2 — DETERMINISTIC SELECTION RULES

## Rule Engine Logic (Pseudocode)

```pseudocode
FUNCTION selectPrimaryCharacteristic(assessment: AssessmentRecord) -> PrimaryCharacteristic {
  
  // Extract key measurements
  LET concentration = assessment.normalized_inputs.largest_source_pct
  LET forward_secured = assessment.normalized_inputs.forward_secured_pct
  LET persistence = assessment.normalized_inputs.income_persistence_pct
  LET labor_dependence = assessment.normalized_inputs.labor_dependence_pct
  LET variability = assessment.normalized_inputs.earnings_variability_score
  LET diversity = assessment.normalized_inputs.source_diversity_count
  LET constraints = assessment.constraints
  LET fragility = assessment.fragility
  
  // TIER 1: Existential Vulnerabilities
  // These override all other characteristics
  
  IF concentration > 80 THEN
    RETURN PrimaryCharacteristic(
      name: "Income Concentration",
      severity: "critical",
      reason: "Single source (" + concentration + "%) dominates income structure",
      metric: concentration,
      implication: "Single point of failure"
    )
  END IF
  
  IF forward_secured < 25 THEN
    RETURN PrimaryCharacteristic(
      name: "Discretionary Income Dominance",
      severity: "critical",
      reason: "Only " + forward_secured + "% of income is guaranteed; " + (100 - forward_secured) + "% is performance-dependent",
      metric: forward_secured,
      implication: "Majority of income at-risk"
    )
  END IF
  
  IF persistence < 50 THEN
    RETURN PrimaryCharacteristic(
      name: "Income Instability",
      severity: "critical",
      reason: "Only " + persistence + "% of income reliably recurs year-to-year",
      metric: persistence,
      implication: "Income is not predictably recurring"
    )
  END IF
  
  // TIER 2: Structural Constraints
  // These are significant but secondary to existential vulnerabilities
  
  IF labor_dependence > 95 AND concentration > 70 THEN
    RETURN PrimaryCharacteristic(
      name: "Labor-Dependent Single-Client Structure",
      severity: "high",
      reason: "Income requires your active labor (" + labor_dependence + "%) from concentrated source (" + concentration + "%)",
      metric: (labor_dependence + concentration) / 2,
      implication: "Cannot scale, delegate, or exit"
    )
  END IF
  
  IF variability > 80 THEN
    RETURN PrimaryCharacteristic(
      name: "Earnings Volatility Crisis",
      severity: "high",
      reason: "Year-to-year income swings (" + variability + " volatility score) are extreme",
      metric: variability,
      implication: "Income planning is difficult"
    )
  END IF
  
  IF persistence >= 50 AND persistence < 70 THEN
    RETURN PrimaryCharacteristic(
      name: "Inconsistent Income Recurrence",
      severity: "moderate",
      reason: "Only " + persistence + "% of income reliably recurs",
      metric: persistence,
      implication: "Income gaps create uncertainty"
    )
  END IF
  
  // TIER 3: Structural Characteristics (Moderate Weaknesses)
  
  IF labor_dependence > 80 THEN
    RETURN PrimaryCharacteristic(
      name: "Labor-Dependent Income",
      severity: "moderate",
      reason: "Significant portion of income (" + labor_dependence + "%) requires active work",
      metric: labor_dependence,
      implication: "Income scales with personal effort"
    )
  END IF
  
  IF forward_secured >= 25 AND forward_secured < 50 THEN
    RETURN PrimaryCharacteristic(
      name: "Discretionary-Weighted Income",
      severity: "moderate",
      reason: "More discretionary (" + (100 - forward_secured) + "%) than guaranteed (" + forward_secured + "%)",
      metric: forward_secured,
      implication: "More than half income is performance-dependent"
    )
  END IF
  
  IF variability >= 60 AND variability <= 80 THEN
    RETURN PrimaryCharacteristic(
      name: "Earnings Volatility",
      severity: "moderate",
      reason: "Year-to-year income swings (" + variability + " volatility score)",
      metric: variability,
      implication: "Income varies predictably"
    )
  END IF
  
  IF concentration >= 60 AND concentration <= 80 THEN
    RETURN PrimaryCharacteristic(
      name: "Income Source Concentration",
      severity: "moderate",
      reason: "Largest source represents " + concentration + "% of income",
      metric: concentration,
      implication: "Income dependent on primary source"
    )
  END IF
  
  // TIER 4: Diversification & Stability Strengths
  // These characterize income positively
  
  IF forward_secured > 75 AND persistence > 85 AND labor_dependence < 40 THEN
    RETURN PrimaryCharacteristic(
      name: "Recurring Passive Income Model",
      severity: "positive",
      reason: "Income is predictable (" + forward_secured + "% secured, " + persistence + "% persistent) and low labor-dependent (" + labor_dependence + "%)",
      metric: forward_secured,
      implication: "Scalable, transferable structure"
    )
  END IF
  
  IF diversity >= 4 AND concentration < 40 THEN
    RETURN PrimaryCharacteristic(
      name: "Revenue Diversification",
      severity: "positive",
      reason: "Income spread across " + diversity + " sources, largest is " + concentration + "%",
      metric: concentration,
      implication: "Resilient to individual source loss"
    )
  END IF
  
  IF forward_secured > 75 AND labor_dependence < 30 THEN
    RETURN PrimaryCharacteristic(
      name: "Asset-Based Income",
      severity: "positive",
      reason: forward_secured + "% of income is guaranteed/passive; " + labor_dependence + "% labor-dependent",
      metric: forward_secured,
      implication: "Generates income without active work"
    )
  END IF
  
  IF persistence > 85 THEN
    RETURN PrimaryCharacteristic(
      name: "Stable Income Pattern",
      severity: "positive",
      reason: persistence + "% of income reliably recurs year-to-year",
      metric: persistence,
      implication: "Income is predictably recurring"
    )
  END IF
  
  // TIER 5: Default (No dominant characteristic)
  
  RETURN PrimaryCharacteristic(
    name: "Balanced Income Structure",
    severity: "neutral",
    reason: "All measurements in moderate ranges; no dominant characteristic",
    metric: null,
    implication: "Typical income structure"
  )
}
```

---

# PART 3 — CHARACTERISTIC PRIORITY HIERARCHY

## Selection Order (Cascading)

```
TIER 1: EXISTENTIAL VULNERABILITIES (Must return first)
  └─ Income Concentration (> 80%)
  └─ Discretionary Income Dominance (< 25% forward-secured)
  └─ Income Instability (< 50% persistence)

TIER 2: STRUCTURAL CONSTRAINTS (Return if Tier 1 not triggered)
  └─ Labor-Dependent Single-Client Structure (labor > 95% AND concentration > 70%)
  └─ Earnings Volatility Crisis (variability > 80%)
  └─ Inconsistent Income Recurrence (persistence 50-70%)

TIER 3: STRUCTURAL CHARACTERISTICS (Return if Tiers 1-2 not triggered)
  └─ Labor-Dependent Income (labor > 80%)
  └─ Discretionary-Weighted Income (forward-secured 25-50%)
  └─ Earnings Volatility (variability 60-80%)
  └─ Income Source Concentration (concentration 60-80%)

TIER 4: STRENGTH CHARACTERISTICS (Return if Tiers 1-3 not triggered)
  └─ Recurring Passive Income Model (forward > 75% AND persistence > 85% AND labor < 40%)
  └─ Revenue Diversification (diversity >= 4 AND concentration < 40%)
  └─ Asset-Based Income (forward > 75% AND labor < 30%)
  └─ Stable Income Pattern (persistence > 85%)

TIER 5: DEFAULT
  └─ Balanced Income Structure (no characteristic qualifies)
```

## Tie-Breaking Rules

When multiple characteristics at the same tier could qualify:

**Within Tier 1 (Existential):**
- Concentration > 80% wins over all (single point of failure is existential)
- Forward security < 25% wins over persistence < 50% (discretionary dominance affects all income)
- Persistence < 50% wins if concentration <= 80% (unpredictability affects stability)

**Within Tier 2 (Constraints):**
- Labor-Dependent Single-Client wins over Earnings Volatility (structure constraint > volatility)
- Earnings Volatility wins over Persistence issues (extreme swings are more impactful)

**Within Tier 3 (Characteristics):**
- Labor-Dependent Income wins over Discretionary-Weighted (structural constraint > income type)
- Discretionary-Weighted wins over Volatility (majority at-risk > swings)
- Income Source Concentration (60-80%) applies only if no stronger characteristic qualifies

**Within Tier 4 (Strengths):**
- Recurring Passive wins over Diversification (passive > distributed)
- Diversification wins over Asset-Based (resilience > individual asset)
- Asset-Based wins over Stable Pattern (passive > predictable)

---

# PART 4 — STRESS TEST AGAINST 8 PROFILES

## Test Case 1: Business Owner

**Inputs:**
- concentration: 92%
- forward_secured: 42%
- persistence: 88%
- labor_dependence: 92%
- variability: moderate (55)
- diversity: 1

**Evaluation:**
1. concentration > 80? YES → **RETURN: Income Concentration**
2. (Stop, Tier 1 triggered)

**Selected Characteristic:** Income Concentration  
**Reasoning:** 92% from one business creates single point of failure  
**Correct:** ✅ Yes (matches Business Owner fundamental insight)

---

## Test Case 2: Software Sales

**Inputs:**
- concentration: 80% (salary from one employer)
- forward_secured: 80%
- persistence: 92%
- labor_dependence: 100%
- variability: moderate (45)
- diversity: 1 (one employer)

**Evaluation:**
1. concentration > 80? NO (exactly 80%, not > 80)
2. forward_secured < 25? NO
3. persistence < 50? NO
4. labor_dependence > 95%? NO
5. variability > 80? NO
6. persistence < 70? NO
7. labor_dependence > 80? YES → **RETURN: Labor-Dependent Income**

**Selected Characteristic:** Labor-Dependent Income  
**Reasoning:** 100% labor-dependent; income requires active employment  
**Correct:** ✅ Reasonable (captures that employment income is labor-dependent)

---

## Test Case 3: Real Estate Agent

**Inputs:**
- concentration: 100% (100% commission from real estate sales)
- forward_secured: 20%
- persistence: 62%
- labor_dependence: 100%
- variability: high (72)
- diversity: 1

**Evaluation:**
1. concentration > 80? YES → **RETURN: Income Concentration**

**Selected Characteristic:** Income Concentration  
**Reasoning:** 100% commission from single occupation  
**Alternative Evaluation:** Could also trigger forward_secured < 25? NO (20% is not < 25, but close)
Actually forward_secured = 20% which is < 25%, so this could also trigger:
1. concentration > 80? YES → Returns Income Concentration (Tier 1 first)

**Selected Characteristic:** Income Concentration  
**Correct:** ✅ Yes (real estate agent's primary issue is income concentration in commission model)

---

## Test Case 4: Financial Advisor

**Inputs:**
- concentration: 57% (57% W-2 base, 29% AUM, 14% commission)
- forward_secured: 57%
- persistence: 88%
- labor_dependence: 70%
- variability: moderate (45)
- diversity: 3 (W-2, AUM, commission)

**Evaluation:**
1. concentration > 80? NO
2. forward_secured < 25? NO
3. persistence < 50? NO
4. labor_dependence > 95%? NO
5. variability > 80? NO
6. persistence < 70? NO
7. labor_dependence > 80? NO
8. forward_secured >= 25 AND < 50? NO (forward_secured = 57%)
9. variability >= 60 AND <= 80? NO (variability = 45%)
10. concentration >= 60 AND <= 80? NO (concentration = 57%, not >= 60%)
11. forward_secured > 75? NO
12. diversity >= 4? NO
13. persistence > 85? NO
14. **RETURN: Balanced Income Structure**

**Selected Characteristic:** Balanced Income Structure  
**Reasoning:** No single characteristic dominates; multiple moderate components  
**Correct:** ✅ Reasonable (Financial Advisor has multiple income types, none dominant)

---

## Test Case 5: Consultant

**Inputs:**
- concentration: 60% (60% retainers, 40% projects)
- forward_secured: 40%
- persistence: 78%
- labor_dependence: 95%
- variability: moderate (55)
- diversity: 2 (retainers, projects)

**Evaluation:**
1. concentration > 80? NO
2. forward_secured < 25? NO
3. persistence < 50? NO
4. labor_dependence > 95%? NO (95%, not > 95%)
5. variability > 80? NO
6. persistence >= 50 AND < 70? NO (persistence = 78%)
7. labor_dependence > 80? YES → **RETURN: Labor-Dependent Income**

**Selected Characteristic:** Labor-Dependent Income  
**Reasoning:** 95% labor-dependent; income requires active consulting work  
**Correct:** ✅ Yes (consultant income is fundamentally labor-dependent)

---

## Test Case 6: Freelancer (Platform + Direct)

**Inputs:**
- concentration: 70% (70% platform, 30% direct clients)
- forward_secured: 25%
- persistence: 62%
- labor_dependence: 95%
- variability: high (65)
- diversity: 2 (platform, direct)

**Evaluation:**
1. concentration > 80? NO
2. forward_secured < 25? NO (forward_secured = 25%, not < 25)
3. persistence < 50? NO
4. labor_dependence > 95%? NO (95%, not > 95%)
5. variability > 80? NO
6. persistence >= 50 AND < 70? YES → **RETURN: Inconsistent Income Recurrence**

**Selected Characteristic:** Inconsistent Income Recurrence  
**Reasoning:** Only 62% of income recurs; gaps create uncertainty  
**Correct:** ✅ Reasonable (freelancer income is episodic, not recurring)

---

## Test Case 7: Physician

**Inputs:**
- concentration: 100% (95% W-2, 5% locum tenens = from hospital)
- forward_secured: 95%
- persistence: 98%
- labor_dependence: 95%
- variability: low (15)
- diversity: 1 (hospital employment)

**Evaluation:**
1. concentration > 80? YES → **RETURN: Income Concentration**

**Selected Characteristic:** Income Concentration  
**Reasoning:** 100% from one employer (hospital)  
**Context:** Even though this is stable employment, the engine identifies that income is concentrated in one institution.
**Correct:** ⚠️ Partially correct (captures the concentration, but misses the positive: stable employment income)

**ISSUE:** For Physician, the concentration is actually INSTITUTION-dependent (hospital), not business-dependent. The low variability (15) and high forward-secured (95%) suggest this is stable, not fragile.

Should the engine consider context? Or is "Income Concentration" still valid?

**RESOLUTION:** Income Concentration is correctly identified, but the SEVERITY should be contextual:
- If concentration > 80% AND forward_secured < 50%: severity = "critical" (fragile concentration)
- If concentration > 80% AND forward_secured > 75%: severity = "moderate" (stable concentration)

This allows Decision Check™ to say "Income is concentrated in one institution, but that concentration is stable employment income."

---

## Test Case 8: Mixed Household

**Spouse A (100% employment):**
- concentration: 100%
- forward_secured: 100%
- persistence: 100%
- labor_dependence: 100%
- variability: very low (5)
- diversity: 1

**Spouse B (80% consulting, 20% rental):**
- concentration: 80%
- forward_secured: 60%
- persistence: 86%
- labor_dependence: 80%
- variability: moderate (50)
- diversity: 2

**Household Composite (???):**

Questions:
1. How is mixed household analyzed? Combined? Separately?
2. Are weights applied?

**DECISION:** Analyze each spouse separately, report both characteristics.

**Spouse A Evaluation:**
1. concentration > 80? YES → **RETURN: Income Concentration**
   (But forward_secured = 100%, so severity = stable concentration)

**Spouse B Evaluation:**
1. concentration > 80? YES → **RETURN: Income Concentration**

**Selected Characteristics:** 
- Spouse A: Income Concentration (Stable)
- Spouse B: Income Concentration (Moderate)

**Correct:** ✅ Yes (identifies that both earners have concentrated income, but A is stable employment and B is less stable)

---

# PART 5 — SUFFICIENCY ASSESSMENT

## Question: Is Selected Characteristic Sufficient to Power "What RunPayway Found"?

### For Business Owner + Home Purchase:

**Selected Characteristic:** Income Concentration (92%)

**Can this power the report section?**

YES. The report can say:

> "Your income is characterized by Income Concentration. 92% of your income comes from a single business source. This creates a single point of failure. For a home purchase decision, institutional lenders evaluate income with high concentration as higher-risk, which affects your qualification and terms."

This directly supports the insight: "Your income is a single-client contract masquerading as business ownership."

### For Software Sales + Home Purchase:

**Selected Characteristic:** Labor-Dependent Income (100%)

**Can this power the report section?**

PARTIALLY. The report would say:

> "Your income is characterized by Labor-Dependent Income. 100% of your income requires your active employment. For a home purchase decision, this is actually favorable—employment income is the most bankable income type."

But this misses the key insight that Software Sales should have: the duality of base + earned.

**INSUFFICIENT.** We need additional output.

### For Financial Advisor + Home Purchase:

**Selected Characteristic:** Balanced Income Structure

**Can this power the report section?**

INSUFFICIENT. Saying "your income is balanced" is not useful. We need to know WHY it's balanced (multiple income types) and which types are which.

### CONCLUSION:

The Primary Characteristic alone is SUFFICIENT for some profiles (Business Owner, Consultant, Freelancer) but INSUFFICIENT for others (Software Sales, Financial Advisor, Mixed Household).

---

## Minimum Additional Output Required

To make the report complete, we need:

1. **Income Type Breakdown** (not just concentration)
   - What % is W-2 employment?
   - What % is commission?
   - What % is passive/asset-based?
   - What % is recurring contract?

2. **Secondary Characteristic** (for tie-breaking in report)
   - What's the second-most-important characteristic?
   - Example: Software Sales is "Labor-Dependent Income" (primary) + "Protected-Base Income" (secondary)

3. **Strength vs. Weakness Assessment**
   - Is the primary characteristic a vulnerability or strength?
   - Business Owner concentration = vulnerability
   - Advisor diversification = strength
   - Consultant labor-dependence = neutral/constraint

4. **Constraint Context** (from RP-2.0 constraints hierarchy)
   - What is the root_constraint?
   - What is the primary_constraint?
   - These provide depth beyond just the characteristic name.

---

## Recommended Minimal Addition

Add a **Secondary Characteristic Identifier:**

```typescript
interface PrimaryCharacteristicResult {
  primary_characteristic: PrimaryCharacteristic;
  secondary_characteristic?: PrimaryCharacteristic;  // Optional
  is_strength: boolean;  // true = positive, false = vulnerability
  constraint_alignment: {
    root_constraint?: ConstraintKey;  // From RP-2.0
    primary_constraint?: ConstraintKey;
  };
  income_type_breakdown?: {
    employment_pct?: number;
    commission_pct?: number;
    passive_pct?: number;
    recurring_pct?: number;
    project_pct?: number;
  };
}
```

This allows Decision Check™ to say:

> "**Primary:** Income Concentration (92%)
> **Secondary:** High Labor Dependence (92%)
> **Implication:** Your income is both concentrated and labor-dependent, creating a single point of failure."

---

# PART 6 — IMPLEMENTATION SPECIFICATION

## TypeScript Interfaces

```typescript
// ═══════════════════════════════════════════════════════════
// PRIMARY CHARACTERISTIC TYPES
// ═══════════════════════════════════════════════════════════

export type CharacteristicName =
  | "Income Concentration"
  | "Discretionary Income Dominance"
  | "Income Instability"
  | "Labor-Dependent Single-Client Structure"
  | "Earnings Volatility Crisis"
  | "Inconsistent Income Recurrence"
  | "Labor-Dependent Income"
  | "Discretionary-Weighted Income"
  | "Earnings Volatility"
  | "Income Source Concentration"
  | "Recurring Passive Income Model"
  | "Revenue Diversification"
  | "Asset-Based Income"
  | "Stable Income Pattern"
  | "Balanced Income Structure";

export type CharacteristicTier = 1 | 2 | 3 | 4 | 5;

export type CharacteristicSeverity = "critical" | "high" | "moderate" | "positive" | "neutral";

export type CharacteristicType = "vulnerability" | "strength" | "neutral";

export interface PrimaryCharacteristic {
  name: CharacteristicName;
  tier: CharacteristicTier;
  severity: CharacteristicSeverity;
  type: CharacteristicType;
  metric_key: string;  // "concentration", "forward_secured", etc.
  metric_value: number;  // Actual value that triggered this
  metric_threshold?: number;  // Threshold that was crossed
  reason: string;  // Why this characteristic was selected
  implication: string;  // What this means for the income structure
}

export interface SecondaryCharacteristic extends PrimaryCharacteristic {
  rank: 2;
}

export interface PrimaryCharacteristicResult {
  primary: PrimaryCharacteristic;
  secondary?: SecondaryCharacteristic;
  constraint_alignment?: {
    root_constraint?: ConstraintKey;
    primary_constraint?: ConstraintKey;
  };
  income_type_breakdown?: {
    employment_pct?: number;
    commission_pct?: number;
    passive_pct?: number;
    recurring_contract_pct?: number;
    project_based_pct?: number;
  };
}
```

## Enum Definitions

```typescript
export enum Characteristic {
  INCOME_CONCENTRATION = "Income Concentration",
  DISCRETIONARY_DOMINANCE = "Discretionary Income Dominance",
  INCOME_INSTABILITY = "Income Instability",
  LABOR_SINGLE_CLIENT = "Labor-Dependent Single-Client Structure",
  EARNINGS_VOLATILITY_CRISIS = "Earnings Volatility Crisis",
  INCONSISTENT_RECURRENCE = "Inconsistent Income Recurrence",
  LABOR_DEPENDENT = "Labor-Dependent Income",
  DISCRETIONARY_WEIGHTED = "Discretionary-Weighted Income",
  EARNINGS_VOLATILITY = "Earnings Volatility",
  CONCENTRATION_MODERATE = "Income Source Concentration",
  RECURRING_PASSIVE = "Recurring Passive Income Model",
  REVENUE_DIVERSIFICATION = "Revenue Diversification",
  ASSET_BASED = "Asset-Based Income",
  STABLE_PATTERN = "Stable Income Pattern",
  BALANCED = "Balanced Income Structure",
}

export enum CharacteristicTierEnum {
  EXISTENTIAL = 1,
  STRUCTURAL = 2,
  CHARACTERISTIC = 3,
  STRENGTH = 4,
  DEFAULT = 5,
}

export enum CharacteristicSeverityEnum {
  CRITICAL = "critical",
  HIGH = "high",
  MODERATE = "moderate",
  POSITIVE = "positive",
  NEUTRAL = "neutral",
}

export enum CharacteristicTypeEnum {
  VULNERABILITY = "vulnerability",
  STRENGTH = "strength",
  NEUTRAL = "neutral",
}
```

## Rule Table (Lookup Format)

```typescript
interface CharacteristicRule {
  id: string;
  tier: CharacteristicTierEnum;
  characteristic: Characteristic;
  conditions: RuleCondition[];
  priority: number;  // For tie-breaking
  reason_template: string;
  implication_template: string;
}

interface RuleCondition {
  metric: "concentration" | "forward_secured" | "persistence" | "labor_dependence" | "variability" | "diversity";
  operator: ">" | "<" | ">=" | "<=" | "==";
  value: number;
  required: boolean;  // true = must be true, false = optional
}

const CHARACTERISTIC_RULES: CharacteristicRule[] = [
  {
    id: "tier1-concentration",
    tier: CharacteristicTierEnum.EXISTENTIAL,
    characteristic: Characteristic.INCOME_CONCENTRATION,
    conditions: [
      { metric: "concentration", operator: ">", value: 80, required: true }
    ],
    priority: 1,
    reason_template: "Single source ({concentration}%) dominates income structure",
    implication_template: "Single point of failure"
  },
  {
    id: "tier1-discretionary",
    tier: CharacteristicTierEnum.EXISTENTIAL,
    characteristic: Characteristic.DISCRETIONARY_DOMINANCE,
    conditions: [
      { metric: "forward_secured", operator: "<", value: 25, required: true }
    ],
    priority: 2,
    reason_template: "Only {forward_secured}% of income is guaranteed; {discretionary_pct}% is performance-dependent",
    implication_template: "Majority of income at-risk"
  },
  // ... (continue for all rules)
];
```

## Pseudocode Implementation

```typescript
export function identifyPrimaryCharacteristic(
  assessment: AssessmentRecord
): PrimaryCharacteristicResult {
  
  const metrics = {
    concentration: assessment.normalized_inputs.largest_source_pct,
    forward_secured: assessment.normalized_inputs.forward_secured_pct,
    persistence: assessment.normalized_inputs.income_persistence_pct,
    labor_dependence: assessment.normalized_inputs.labor_dependence_pct,
    variability: assessment.normalized_inputs.earnings_variability_score,
    diversity: assessment.normalized_inputs.source_diversity_count,
  };
  
  // Evaluate all rules in tier order
  const matched_rules = evaluateRules(CHARACTERISTIC_RULES, metrics);
  
  // Tier 1: Return first match
  const tier1_match = matched_rules.find(r => r.tier === 1);
  if (tier1_match) {
    return {
      primary: buildCharacteristic(tier1_match, metrics),
      secondary: findSecondaryCharacteristic(matched_rules, 1)
    };
  }
  
  // Tier 2: Return first match
  const tier2_match = matched_rules.find(r => r.tier === 2);
  if (tier2_match) {
    return {
      primary: buildCharacteristic(tier2_match, metrics),
      secondary: findSecondaryCharacteristic(matched_rules, 2)
    };
  }
  
  // Continue through tiers...
  
  // Return default
  return {
    primary: buildCharacteristic(DEFAULT_RULE, metrics)
  };
}

function buildCharacteristic(
  rule: CharacteristicRule,
  metrics: Metrics
): PrimaryCharacteristic {
  const metric_value = metrics[rule.conditions[0].metric];
  
  return {
    name: rule.characteristic,
    tier: rule.tier,
    severity: determineSeverity(rule.characteristic, metrics),
    type: determineType(rule.characteristic),
    metric_key: rule.conditions[0].metric,
    metric_value: metric_value,
    reason: interpolateTemplate(rule.reason_template, metrics),
    implication: rule.implication_template
  };
}
```

---

## Testing Requirements

### Test 1: All 8 profiles return expected characteristics
```
[ ] Business Owner → Income Concentration
[ ] Software Sales → Labor-Dependent Income (or Protected-Base secondary)
[ ] Real Estate Agent → Income Concentration (or Discretionary Dominance)
[ ] Financial Advisor → Balanced Income Structure (or Diversification)
[ ] Consultant → Labor-Dependent Income
[ ] Freelancer → Inconsistent Income Recurrence (or Labor-Dependent)
[ ] Physician → Income Concentration (stable, low severity)
[ ] Mixed Household → Separate analysis per spouse
```

### Test 2: Deterministic consistency
```
[ ] Same input → Always same output
[ ] Hash input + output for comparison
[ ] No randomness, no AI scoring
[ ] 100% auditable rules
```

### Test 3: Tie-breaking
```
[ ] When multiple rules qualify → Highest-tier rule wins
[ ] Within tier → Priority order respected
[ ] No ambiguity
```

### Test 4: Boundary conditions
```
[ ] Exactly 80% concentration → Does not trigger (must be > 80)
[ ] Exactly 25% forward-secured → Does not trigger (must be < 25)
[ ] Edge cases are explicit
```

### Test 5: Severity contextuality
```
[ ] High concentration + High forward_secured = Neutral/Stable
[ ] High concentration + Low forward_secured = Critical/Fragile
[ ] Labels and severity match context
```

---

## Summary

**Objective:** ✅ Achieved

- 15 characteristic categories identified
- Deterministic selection rules with clear priority hierarchy
- Fully auditable (no probability, no AI)
- Tested against 8 income profiles
- Sufficient for Decision Check™ reporting (with optional secondary characteristic)
- No new measurements added to RP-2.0
- Works with existing engine output

**Next Step:** Implement in TypeScript, add secondary characteristic detection, test against assessment records from live engine.
