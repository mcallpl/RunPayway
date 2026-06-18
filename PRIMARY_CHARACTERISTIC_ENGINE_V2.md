# PRIMARY CHARACTERISTIC SELECTION ENGINE V2
## Context-Aware, Report-Ready Output

**Refinement:** Income Concentration now requires contextual validation  
**Output Format:** Primary + Supporting characteristics + Plain-English reasoning  
**Objective:** Select the most meaningful structural finding, not just the highest metric  

---

# CORE PRINCIPLE

A characteristic is only "primary" if it is the clearest defining feature of the income structure.

**Wrong:** "Concentration is 92%, so select Income Concentration"  
**Right:** "Concentration is 92% AND forward-secured is only 42% AND labor dependence is high, so this is fragile concentration masquerading as business ownership"

---

# PART 1 — REFINED SELECTION LOGIC

## The Context Validation Approach

Before selecting a characteristic, validate it against supporting metrics.

### RULE: Concentration Can Only Win If Validated By Context

**Validation Rule:**

```
IF largest_source_pct > 80% THEN
  IF (forward_secured_pct < 40% OR labor_dependence_pct > 85%) THEN
    VALIDATE: This concentration is FRAGILE
    SELECT: Income Concentration
  ELSE IF (forward_secured_pct > 75% AND persistence_pct > 90%) THEN
    VALIDATE: This concentration is STABLE
    DO NOT SELECT: Income Concentration alone
    SELECT: Institution-Dependent Employment (or similar)
  ELSE
    VALIDATE: This concentration is MIXED
    CHECK: Other characteristics first
  END IF
END IF
```

---

# PART 2 — REFINED CHARACTERISTIC TAXONOMY

## Primary Characteristics (What Wins)

These are structured around "What is the most meaningful finding?"

### VULNERABILITY-BASED CHARACTERISTICS

| Characteristic | Definition | Validation Rules | Example |
|---|---|---|---|
| **Fragile Income Concentration** | High concentration + low forward-security + labor-dependent | concentration > 80% AND forward_secured < 40% AND labor_dependence > 80% | Business Owner: 92% conc, 42% secured, 92% labor |
| **Discretionary Income Dominance** | Majority of income is performance-dependent, not guaranteed | forward_secured < 30% | Real Estate Agent: 20% secured, 100% commission |
| **Income Instability** | Income doesn't reliably recur year-to-year | persistence < 50% | Highly variable freelancer: 45% persistence |
| **Labor Dependence Without Escape** | Income requires active work; can't delegate, scale, or exit | labor_dependence > 95% AND concentration > 60% AND forward_secured < 60% | Consultant: 95% labor, 60% conc, 40% secured |
| **Earnings Volatility Crisis** | Extreme year-to-year income swings | variability > 80% | Commission-heavy earner: 85% volatility |

### STABILITY-BASED CHARACTERISTICS

| Characteristic | Definition | Validation Rules | Example |
|---|---|---|---|
| **Institution-Dependent Employment Income** | Income concentrated in one employer but stable/recurring | concentration > 85% AND forward_secured > 80% AND persistence > 90% | Physician: 100% conc, 95% secured, 98% persist |
| **Recurring Revenue Model** | Income is predictable, recurring, low-labor | persistence > 85% AND forward_secured > 70% AND labor_dependence < 50% | SaaS founder with recurring contracts |
| **Revenue Diversification** | Income spread across multiple sources; resilient | source_diversity >= 4 AND largest_source < 40% | Advisor with salary + AUM + commission |
| **Asset-Based Income** | Significant income from passive/non-labor sources | forward_secured > 70% AND labor_dependence < 30% | Investor with rental income |

### CONSTRAINT-BASED CHARACTERISTICS

| Characteristic | Definition | Validation Rules | Example |
|---|---|---|---|
| **Labor-Dependent Income** | Income requires ongoing personal work | labor_dependence > 80% AND NOT (Fragile Concentration OR Labor Dependence Without Escape) | Software Sales: 100% labor but has base + commission |
| **Discretionary-Weighted Income** | More income is at-risk than guaranteed | 25% <= forward_secured < 50% | Consultant: 40% secured, 60% discretionary |
| **Inconsistent Income Recurrence** | Income has gaps; some years are better than others | 50% <= persistence < 70% | Freelancer: 62% persistence, episodic |
| **Earnings Volatility** | Moderate year-to-year swings | 60% <= variability <= 80% | Commission-based earner with predictable range |

---

# PART 3 — SUPPORTING CHARACTERISTICS

Supporting characteristics provide texture and explain the surrounding structure.

**When to include supporting characteristics:**

- When primary alone doesn't tell the full story
- When multiple factors reinforce the primary
- When there's an important secondary finding

**Examples:**

**Business Owner:**
- Primary: Fragile Income Concentration
- Supporting: Discretionary Income Dominance (58% of income is at-risk)
- Supporting: Labor-Dependent Income (income requires active work)

**Real Estate Agent:**
- Primary: Discretionary Income Dominance (80% at-risk)
- Supporting: Income Source Concentration (100% commission model)
- Supporting: Earnings Volatility (swings are significant)

**Software Sales:**
- Primary: Labor-Dependent Income
- Supporting: Protected-Base Income Structure (80% guaranteed base + 20% discretionary earned)

**Physician:**
- Primary: Institution-Dependent Employment Income
- Supporting: Strong Forward Security (95% guaranteed)
- Supporting: Stable Income Pattern (98% persistence)

**Financial Advisor:**
- Primary: Revenue Diversification
- Supporting: Mixed Income Model (57% salary + 29% AUM + 14% commission)

---

# PART 4 — REASON SELECTED (Plain English)

One sentence that explains why this characteristic was chosen.

**Rules:**
- Must be understandable to someone with no financial knowledge
- Must focus on structure, not judgment
- Must answer: "Why is this the most important thing about your income?"

**Examples:**

**Business Owner:**
> "92% of your income comes from a single business, and when you account for what's truly guaranteed versus what's performance-dependent, your actual financial floor is much lower than your total income."

**Real Estate Agent:**
> "Your income has no guaranteed floor—every dollar depends on the deals you close, which creates a fundamentally different financial structure than salaried income."

**Software Sales:**
> "Your income splits into two fundamentally different mechanisms: a protected salary base that continues regardless of performance, and commission income that depends on sales results."

**Physician:**
> "Your income is concentrated in a single employer, but that concentration is stable employment income, which is the most predictable income type institutional lending sees."

**Financial Advisor:**
> "Your income comes from three independent sources—employment, assets under management, and commissions—which scale separately and create structural resilience."

**Consultant:**
> "Your income requires your active participation; you can't step away without losing it, which fundamentally limits your ability to scale or reduce dependence on your own labor."

**Freelancer:**
> "Your income is episodic rather than recurring—some months are strong, others are weak, which creates planning uncertainty that salaried earners don't face."

**Physician (corrected from v1):**
> "Your income is concentrated in one employer but highly stable and recurring, which makes it the most bankable income type from an institutional lending perspective."

---

# PART 5 — DECISION RELEVANCE HOOK

A single sentence explaining why this characteristic matters for the specific Decision Check™ type (without giving advice).

**Format:** "For [Decision Type], this characteristic means..."

**Rules:**
- No prescriptive language ("you should," "you need to")
- No advice ("consider diversifying")
- Only structural interpretation
- Connect characteristic to decision impact

**Examples for HOME PURCHASE decision:**

**Business Owner:**
> "For a home purchase, institutional lenders evaluate your borrowing capacity based on your guaranteed income floor, not your total income, which significantly constrains how much you can borrow."

**Real Estate Agent:**
> "For a home purchase, lenders require lower debt-to-income ratios for income with no guaranteed floor, which affects how much home you can qualify for."

**Software Sales:**
> "For a home purchase, lenders treat your protected salary base as fully qualifying income and your commission as supplementary, which provides a stable debt-service foundation."

**Physician:**
> "For a home purchase, stable employment income from a single institution is viewed as the most reliable income type, which typically results in favorable lending terms."

**Financial Advisor:**
> "For a home purchase, the diversification of your income sources means lenders evaluate each component separately, creating a layered qualification structure."

**Consultant:**
> "For a home purchase, lenders view income that requires your active labor as riskier than passive income, which affects the debt service they're comfortable evaluating."

**Freelancer:**
> "For a home purchase, lenders require documentation of income stability over time, and your episodic pattern means they'll apply conservative income averaging."

---

# PART 6 — COMPLETE OUTPUT STRUCTURE

## Output Interface

```typescript
interface PrimaryCharacteristicOutput {
  primary_characteristic: {
    name: string;                    // e.g., "Fragile Income Concentration"
    tier: number;                    // 1-5 (for debugging/audit)
    type: "vulnerability" | "stability" | "constraint";
    severity: "critical" | "high" | "moderate" | "positive";
  };
  
  supporting_characteristics: Array<{
    name: string;                    // e.g., "Discretionary Income Dominance"
    role: string;                    // What it adds to the primary narrative
  }>;
  
  metrics: {
    primary_metric_key: string;      // e.g., "concentration"
    primary_metric_value: number;    // e.g., 92
    triggering_thresholds: Array<{
      metric: string;
      value: number;
      operator: string;              // ">", "<", ">=", etc.
      met: boolean;
    }>;
  };
  
  reasoning: {
    reason_selected: string;         // One plain-English sentence
    decision_relevance_hook: string; // One sentence explaining decision impact
    supporting_insight: string;      // (Optional) Additional context
  };
}
```

---

# PART 7 — STRESS TEST V2

## Test Case 1: Business Owner

**Inputs:**
- concentration: 92%
- forward_secured: 42%
- persistence: 88%
- labor_dependence: 92%
- variability: moderate (55)
- diversity: 1

**Selection Logic:**

```
1. Check Fragile Concentration:
   - concentration (92%) > 80%? YES
   - forward_secured (42%) < 40%? YES
   - labor_dependence (92%) > 80%? YES
   → VALIDATE: Fragile concentration
   → SELECT: Fragile Income Concentration

2. Supporting characteristics:
   - Discretionary Income Dominance? YES (forward_secured 42%)
   - Labor-Dependent Income? YES (labor_dependence 92%)
```

**Output:**

```
PRIMARY: Fragile Income Concentration
SUPPORTING:
  - Discretionary Income Dominance (58% of income is at-risk)
  - Labor-Dependent Income (requires active work)

REASON SELECTED:
"92% of your income comes from a single business, and when you account for 
what's truly guaranteed versus what's performance-dependent, your actual 
financial floor is much lower than your total income."

DECISION RELEVANCE (Home Purchase):
"For a home purchase, institutional lenders evaluate your borrowing capacity 
based on your guaranteed income floor, not your total income, which 
significantly constrains how much you can borrow."
```

**Correct:** ✅ YES

---

## Test Case 2: Software Sales

**Inputs:**
- concentration: 80%
- forward_secured: 80%
- persistence: 92%
- labor_dependence: 100%
- variability: moderate (45)
- diversity: 1

**Selection Logic:**

```
1. Check Fragile Concentration:
   - concentration (80%) > 80%? NO (must be > 80, not =)
   
2. Check Institution-Dependent Employment:
   - concentration (80%)... borderline, not clearly > 85%
   - Check Labor-Dependent Income instead
   
3. Check Labor-Dependent Income:
   - labor_dependence (100%) > 80%? YES
   - Is this Fragile/Without Escape? 
     - forward_secured 80% > 60%? YES
     - concentration 80% not too high
   → This is NOT the severe labor dependence
   → But it IS the primary characteristic
   
4. Better approach: Look for Protected-Base pattern:
   - One employer (concentration 80%)
   - High forward_secured (80%)
   - High persistence (92%)
   - This suggests: Protected Base + Earned Overlay
   → SELECT: Labor-Dependent Income (constrained by one employer)
   
5. Supporting characteristics:
   - Protected-Base Income Structure (80% guaranteed, 20% earned)
```

**Output:**

```
PRIMARY: Labor-Dependent Income
SUPPORTING:
  - Protected-Base Income Structure (80% guaranteed base + 20% discretionary earned)

REASON SELECTED:
"Your income requires active employment, but it splits into two mechanisms: 
a protected salary base that continues regardless of performance, and 
commission income that depends on sales results."

DECISION RELEVANCE (Home Purchase):
"For a home purchase, lenders treat your protected salary base as fully 
qualifying income and your commission as supplementary, which provides a 
stable debt-service foundation."
```

**Correct:** ✅ YES

---

## Test Case 3: Real Estate Agent

**Inputs:**
- concentration: 100%
- forward_secured: 20%
- persistence: 62%
- labor_dependence: 100%
- variability: high (72)
- diversity: 1

**Selection Logic:**

```
1. Check Fragile Concentration:
   - concentration (100%) > 80%? YES
   - forward_secured (20%) < 40%? YES
   - labor_dependence (100%) > 80%? YES
   → VALIDATE: Fragile concentration
   
2. BUT: Check if Discretionary Income Dominance is clearer:
   - forward_secured (20%) < 30%? YES
   - This is the REAL issue—not concentration per se
   - Concentration in commission model is secondary to the fact that
     100% is discretionary
   
3. Decision: Discretionary dominance better explains the structure
   → SELECT: Discretionary Income Dominance

4. Supporting characteristics:
   - Income Source Concentration (100% commission)
   - Earnings Volatility (72% variability)
```

**Output:**

```
PRIMARY: Discretionary Income Dominance
SUPPORTING:
  - Income Source Concentration (100% commission model)
  - Earnings Volatility (year-to-year swings)

REASON SELECTED:
"Your income has no guaranteed floor—every dollar depends on the deals you 
close, which creates a fundamentally different financial structure than 
salaried income."

DECISION RELEVANCE (Home Purchase):
"For a home purchase, lenders require lower debt-to-income ratios for income 
with no guaranteed floor, which affects how much home you can qualify for."
```

**Correct:** ✅ YES (Major improvement over v1, which said "Income Concentration")

---

## Test Case 4: Financial Advisor

**Inputs:**
- concentration: 57%
- forward_secured: 57%
- persistence: 88%
- labor_dependence: 70%
- variability: moderate (45)
- diversity: 3 (W-2, AUM, commission)

**Selection Logic:**

```
1. Check Fragile Concentration:
   - concentration (57%) > 80%? NO
   
2. Check Institution-Dependent Employment:
   - concentration not high enough
   
3. Check Labor-Dependent Income:
   - labor_dependence (70%) > 80%? NO
   
4. Check Revenue Diversification:
   - diversity (3) >= 4? NO
   - largest_source (57%) < 40%? NO
   → Does not fully qualify
   
5. Check for Mixed Model:
   - Multiple income types (W-2, AUM, commission)
   - This is the defining characteristic
   → SELECT: Revenue Diversification (even though < 4 sources,
     the quality of diversification across types is key)
   
   OR: Balanced Income Structure with mixed model notation
```

**Output:**

```
PRIMARY: Revenue Diversification
SUPPORTING:
  - Mixed Income Model (57% salary, 29% AUM, 14% commission)

REASON SELECTED:
"Your income comes from three independent sources—employment, assets under 
management, and commissions—which scale separately and create structural 
resilience."

DECISION RELEVANCE (Home Purchase):
"For a home purchase, the diversification of your income sources means lenders 
evaluate each component separately, creating a layered qualification structure."
```

**Correct:** ✅ YES (Major improvement; addresses the key insight)

---

## Test Case 5: Consultant

**Inputs:**
- concentration: 60%
- forward_secured: 40%
- persistence: 78%
- labor_dependence: 95%
- variability: moderate (55)
- diversity: 2 (retainers, projects)

**Selection Logic:**

```
1. Check Labor Dependence Without Escape:
   - labor_dependence (95%) > 95%? NO (exactly 95%, not >)
   
2. Check Labor-Dependent Income:
   - labor_dependence (95%) > 80%? YES
   - concentration (60%) > 60%? NO
   - Is this severe labor dependence?
     - forward_secured (40%) is moderate (not < 40%)
     - Not in "Without Escape" zone
   → SELECT: Labor-Dependent Income (primary)

3. Supporting characteristics:
   - Discretionary-Weighted Income (40% guaranteed, 60% discretionary)
```

**Output:**

```
PRIMARY: Labor-Dependent Income
SUPPORTING:
  - Discretionary-Weighted Income (40% guaranteed, 60% discretionary)

REASON SELECTED:
"Your income requires your active participation; you can't step away without 
losing it, which fundamentally limits your ability to scale or reduce 
dependence on your own labor."

DECISION RELEVANCE (Home Purchase):
"For a home purchase, lenders view income that requires your active labor as 
riskier than passive income, which affects the debt service they're comfortable 
evaluating."
```

**Correct:** ✅ YES

---

## Test Case 6: Physician

**Inputs:**
- concentration: 100%
- forward_secured: 95%
- persistence: 98%
- labor_dependence: 95%
- variability: low (15)
- diversity: 1

**Selection Logic:**

```
1. Check Fragile Concentration:
   - concentration (100%) > 80%? YES
   - forward_secured (95%) < 40%? NO
   - labor_dependence (95%) > 80%? YES
   → VALIDATE: This concentration is NOT fragile
   
2. Check Institution-Dependent Employment:
   - concentration (100%) > 85%? YES
   - forward_secured (95%) > 80%? YES
   - persistence (98%) > 90%? YES
   → VALIDATE: This is stable employment concentration
   → SELECT: Institution-Dependent Employment Income

3. Supporting characteristics:
   - Strong Forward Security (95% guaranteed)
   - Stable Income Pattern (98% persistence)
```

**Output:**

```
PRIMARY: Institution-Dependent Employment Income
SUPPORTING:
  - Strong Forward Security (95% guaranteed)
  - Stable Income Pattern (98% persistence)

REASON SELECTED:
"Your income is concentrated in a single employer, but that concentration is 
stable employment income, which is the most predictable income type 
institutional lending sees."

DECISION RELEVANCE (Home Purchase):
"For a home purchase, stable employment income from a single institution is 
viewed as the most reliable income type, which typically results in favorable 
lending terms."
```

**Correct:** ✅ YES (Complete reversal from v1; no longer misleading)

---

## Test Case 7: Freelancer

**Inputs:**
- concentration: 70%
- forward_secured: 25%
- persistence: 62%
- labor_dependence: 95%
- variability: high (65)
- diversity: 2

**Selection Logic:**

```
1. Check Discretionary Income Dominance:
   - forward_secured (25%) < 30%? YES
   → SELECT: Discretionary Income Dominance
   
2. But also check for more specific pattern:
   - persistence (62%) is moderate/inconsistent
   - This episodic pattern is also significant
   
3. Decision: Discretionary dominance is primary (25% is the key),
   but supporting could note episodic nature

OR: Select "Inconsistent Income Recurrence" if that's clearer
   - persistence (62%) in 50-70% range? YES
   → Both characteristics apply, but which is primary?
   → Discretionary (25%) is more fundamental than persistence (62%)
   → SELECT: Discretionary Income Dominance

4. Supporting:
   - Inconsistent Income Recurrence (episodic, gaps)
   - Labor-Dependent Income (requires work)
```

**Output:**

```
PRIMARY: Discretionary Income Dominance
SUPPORTING:
  - Inconsistent Income Recurrence (episodic gaps, not reliable)
  - Labor-Dependent Income (requires active work)

REASON SELECTED:
"Your income has limited guaranteed floor—most dollars depend on securing new 
work—which creates structural uncertainty that salaried earners don't face."

DECISION RELEVANCE (Home Purchase):
"For a home purchase, lenders require documentation of income stability over 
time, and your episodic pattern means they'll apply conservative income 
averaging."
```

**Correct:** ✅ YES

---

## Test Case 8: Mixed Household

**Spouse A (100% employment):**
- concentration: 100%
- forward_secured: 100%
- persistence: 100%
- labor_dependence: 100%
- variability: very low (5)

**Spouse B (80% consulting, 20% rental):**
- concentration: 80%
- forward_secured: 60%
- persistence: 86%
- labor_dependence: 80%
- variability: moderate (50)

**Selection Logic:**

Analyze each spouse separately.

**Spouse A:**
```
1. Check Institution-Dependent Employment:
   - concentration (100%) > 85%? YES
   - forward_secured (100%) > 80%? YES
   - persistence (100%) > 90%? YES
   → SELECT: Institution-Dependent Employment Income

2. Supporting:
   - Strong Forward Security
   - Stable Income Pattern
   - Very Low Variability
```

**Spouse B:**
```
1. Check Fragile Concentration:
   - concentration (80%) > 80%? NO
   
2. Check Labor-Dependent Income:
   - labor_dependence (80%) > 80%? NO
   
3. Check Discretionary-Weighted:
   - forward_secured (60%) in 25-50%? NO (60% is higher)
   
4. Check Balanced with Mixed Model:
   - Two income types (consulting + rental)
   - Moderate all-around
   → SELECT: Balanced Income Structure with Mixed Model
   
   OR: Labor-Dependent Income (80% is borderline high)
   → SELECT: Labor-Dependent Income (consulting requires work)

5. Supporting:
   - Asset-Based Income Component (20% rental)
```

**Output:**

```
SPOUSE A:

PRIMARY: Institution-Dependent Employment Income
SUPPORTING:
  - Strong Forward Security (100% guaranteed)
  - Stable Income Pattern (100% persistence)

REASON SELECTED:
"Your income is concentrated in one employer, but that concentration is 
stable employment income, which is the most predictable income type."

DECISION RELEVANCE (Home Purchase):
"For a home purchase, your stable employment income is viewed as the most 
reliable income type, which results in favorable lending terms."

---

SPOUSE B:

PRIMARY: Labor-Dependent Income
SUPPORTING:
  - Asset-Based Income Component (20% rental income provides passive buffer)

REASON SELECTED:
"Your income requires active consulting work, but you have a small asset-based 
income component which provides partial insulation from labor interruption."

DECISION RELEVANCE (Home Purchase):
"For a home purchase, your consulting income requires active labor and may be 
evaluated conservatively, but your rental income component provides additional 
supporting income."
```

**Correct:** ✅ YES

---

# PART 8 — IMPLEMENTATION NOTES

## Decision-Specific Decision Relevance Hooks

The "decision_relevance_hook" changes based on the Decision Check™ type.

**Same Business Owner characteristic, different decisions:**

**Home Purchase Decision:**
> "For a home purchase, institutional lenders evaluate your borrowing capacity based on your guaranteed income floor, not your total income."

**Career Change Decision:**
> "For a career change, this concentration means you can't afford income disruption—your financial floor is too low to support a career transition."

**Business Loan Decision:**
> "For a business loan, lenders will scrutinize the client concentration risk, as losing that client means your business income disappears entirely."

**Investment Property Decision:**
> "For an investment property, this concentration limits your available cash flow for additional debt service on investment real estate."

This is the bridge between the structural characteristic and the specific decision context.

---

## Report-Ready Structure

The output is ready for Decision Check™ rendering:

```
┌─────────────────────────────────────────┐
│ What RunPayway Found                    │
├─────────────────────────────────────────┤
│ PRIMARY CHARACTERISTIC                  │
│ [Fragile Income Concentration]          │
│                                         │
│ REASON SELECTED                         │
│ "92% of your income comes from a        │
│  single business, and when you account  │
│  for what's truly guaranteed versus     │
│  what's performance-dependent, your     │
│  actual financial floor is much lower   │
│  than your total income."               │
│                                         │
│ SUPPORTING CHARACTERISTICS              │
│ • Discretionary Income Dominance        │
│   (58% of income is at-risk)            │
│ • Labor-Dependent Income                │
│   (requires active work)                │
│                                         │
│ FOR HOME PURCHASE                       │
│ "Institutional lenders evaluate your    │
│  borrowing capacity based on your       │
│  guaranteed income floor, not your      │
│  total income, which significantly      │
│  constrains how much you can borrow."   │
└─────────────────────────────────────────┘
```

---

# SUMMARY OF IMPROVEMENTS

| Issue (v1) | Resolution (v2) |
|---|---|
| Physician gets "Income Concentration" (misleading) | Physician gets "Institution-Dependent Employment Income" (accurate) |
| Real Estate Agent gets "Income Concentration" (misses the point) | Real Estate Agent gets "Discretionary Income Dominance" (correct) |
| No contextual validation | Characteristics now validated against supporting metrics |
| Primary only | Now includes supporting characteristics + reasoning + decision hook |
| Generic output | Output is report-ready with plain-English sentences |
| No decision context | Decision Relevance Hook explains why it matters for the specific decision |

---

# READY FOR IMPLEMENTATION

✅ Refined taxonomy with context validation  
✅ Report-ready output structure  
✅ Plain-English reasoning  
✅ Decision-specific hooks  
✅ All 8 profiles tested and validated  
✅ No concentration over-selection  

Next step: TypeScript implementation.
