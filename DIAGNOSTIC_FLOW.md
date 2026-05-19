# RunPayway™ Diagnostic Process Flow

**Model Version: RP-2.0** | **Complete Assessment Pipeline**

---

## PHASE 1: INTAKE CLASSIFICATION (Before Scoring)

### Purpose
Classify the client's business structure *before* scoring. This context shapes interpretation, language, and emphasis.

### Step 1.1: Operating Structure
**Question:** "What best describes how you operate?"

**Options:**
- `solo_service` — Solo service provider (freelancer, consultant, coach)
- `small_agency` — Small agency (2–10 people)
- `commissioned_operator` — Commission-based operator (salesperson, broker)
- `retained_advisor` — Retained professional (advisor, retainer-based)
- `creator_operator` — Creator with business (content creator + courses, products)
- `productized_service` — Productized service (fixed-scope service packages)
- `portfolio_operator` — Portfolio operator (multiple investments/properties)
- `asset_supported` — Asset-supported (real estate, equipment, intellectual property)

**Why:** Determines default expectations, constraints, and language for scenarios.

---

### Step 1.2: Primary Income Model
**Question:** "What is your primary income model?"

**Options:**
- `commission` — Commission-based
- `retainer` — Retainer/ongoing fees
- `project_fee` — Project-based fees
- `subscription` — Subscription/recurring billing
- `salary` — Salary (W-2 or equivalent)
- `mixed_services` — Mixed service models
- `licensing` — Licensing/royalties
- `rental` — Rental income
- `ecommerce` — E-commerce/product sales
- `digital_products` — Digital products (courses, software)
- `other` — Other

**Why:** Shapes revenue structure interpretation and industry-specific action recommendations.

---

### Step 1.3: Revenue Structure
**Question:** "How would you classify your revenue structure?"

**Options:**
- `active_heavy` — Mostly active work (service, commission, project)
- `hybrid` — Mix of active and passive/recurring
- `recurring_heavy` — Mostly recurring/subscription
- `asset_heavy` — Mostly asset-based (rental, dividends, licensing)
- `mixed` — Mixed across all types

**Why:** Determines fragility calculations, risk scenarios, and constraints.

**Ambiguity Flags** (warnings during classification):
- Solo service + subscription = unusual (confirm subscription model)
- Salary + asset-heavy = unusual (confirm passive income alongside salary)
- Commission + recurring-heavy = unusual (confirm residual commissions)
- Rental income + solo service = misclassified (should be portfolio operator)

---

### Step 1.4: Years in Current Structure
**Question:** "How long have you operated this way?"

**Input:** Text field (years/months)

**Why:** Affects maturity stage, diagnostic confidence, and contextual interpretation.

---

## PHASE 2: DIAGNOSTIC QUESTIONS

### Question Set (Same 6 Questions for All Audiences, Different Framing)

| # | Concept | Measures | Individual Framing | Advisor Framing |
|---|---------|----------|-------------------|-----------------|
| **Q1** | Recurring Revenue Base | `income_persistence_pct` | "What percentage of your income renews automatically through an existing agreement or subscription?" | "What portion of your client's income renews automatically — through existing agreements, renewals, or subscriptions — without requiring new client acquisition?" |
| **Q2** | Income Concentration | `largest_source_pct` (inverse) | "How spread out was your income across different sources? How much depended on any single source?" | "How concentrated is your client's income around a single source — top client, employer, transaction type, or platform?" |
| **Q3** | Source Diversification | `source_diversity_count` | "How many separate income sources each contributed at least 10% of your total income?" | "How many distinct income sources — each representing at least 10% of total income — does your client have?" |
| **Q4** | Forward Revenue Visibility | `forward_secured_pct` | "How many months of future income are currently secured — such as contracts, retainers, or booked projects?" | "How much of your client's upcoming income is already secured through signed contracts, binding renewals, or committed forward agreements?" |
| **Q5** | Earnings Consistency | `income_variability_level` | "Over 12 months, how consistent was your monthly income? Compare highest and lowest earning months relative to your average." | "Over the past 12 months, how variable has your client's monthly income been? Assess the range between their highest and lowest earning months relative to their average." |
| **Q6** | Labor Independence | `labor_dependence_pct` (inverse) | "If you stopped active work for 90 consecutive days, what percentage of your income would continue automatically?" | "If your client stopped actively working for 90 consecutive days, what percentage of their income would continue to arrive without direct intervention?" |

---

### Answer Options & Canonical Mapping

#### Q1 → `income_persistence_pct`

| Answer | Text | Maps To |
|--------|------|---------|
| **A** | 0–10% | **5%** persistence |
| **B** | 11–30% | **20%** persistence |
| **C** | 31–60% | **45%** persistence |
| **D** | 61–85% | **73%** persistence |
| **E** | 86–100% | **93%** persistence |

---

#### Q2 → `largest_source_pct`

| Answer | Text | Maps To |
|--------|------|---------|
| **A** | Almost all from one source (90–100%) | **95%** concentration |
| **B** | Mostly from one source (70–89%) | **80%** concentration |
| **C** | About half from one source (50–69%) | **60%** concentration |
| **D** | Spread across a few sources (30–49% from largest) | **40%** concentration |
| **E** | Well diversified (under 30% from any single source) | **15%** concentration |

*Note: High concentration is bad. Engine uses this inversely in scoring.*

---

#### Q3 → `source_diversity_count`

| Answer | Text | Maps To |
|--------|------|---------|
| **A** | 1 source | **1** source |
| **B** | 2 sources | **2** sources |
| **C** | 3–4 sources | **3** sources |
| **D** | 5–7 sources | **6** sources |
| **E** | 8 or more sources | **8** sources |

---

#### Q4 → `forward_secured_pct`

| Answer | Text | Maps To |
|--------|------|---------|
| **A** | Less than 1 month | **4%** forward secured |
| **B** | 1–2 months | **12%** forward secured |
| **C** | 3–5 months | **33%** forward secured |
| **D** | 6–11 months | **71%** forward secured |
| **E** | 12 or more months | **100%** forward secured |

---

#### Q5 → `income_variability_level`

| Answer | Text | Maps To Level | Maps To Numeric |
|--------|------|---------------|-----------------|
| **A** | Very inconsistent (fluctuated more than 75%) | **extreme** | 88 |
| **B** | Inconsistent (fluctuated 50–75%) | **high** | 63 |
| **C** | Somewhat consistent (fluctuated 25–49%) | **moderate** | 37 |
| **D** | Mostly consistent (fluctuated 10–24%) | **low** | 17 |
| **E** | Very consistent (fluctuated less than 10%) | **low** | 5 |

*Note: Level names are used in explanations; numeric is used in formulas.*

---

#### Q6 → `labor_dependence_pct`

| Answer | Text | Maps To |
|--------|------|---------|
| **A** | 0% | **100%** dependent on labor |
| **B** | 1–25% | **87%** dependent on labor |
| **C** | 26–50% | **62%** dependent on labor |
| **D** | 51–75% | **37%** dependent on labor |
| **E** | 76–100% | **12%** dependent on labor |

*Note: High labor dependence is bad. A=100% means "zero income without work."*

---

## PHASE 3: NORMALIZATION & SCORING

### Step 3.1: Canonical Input Assembly
After answers are collected, they map to **6 canonical inputs**:

```typescript
interface CanonicalInput {
  income_persistence_pct: number;      // Q1 → [5, 20, 45, 73, 93]
  largest_source_pct: number;          // Q2 → [95, 80, 60, 40, 15]
  source_diversity_count: number;      // Q3 → [1, 2, 3, 6, 8]
  forward_secured_pct: number;         // Q4 → [4, 12, 33, 71, 100]
  income_variability_level: string;    // Q5 → ["extreme", "high", "moderate", "low"]
  labor_dependence_pct: number;        // Q6 → [100, 87, 62, 37, 12]
}
```

---

### Step 3.2: Derived Metric — Continuity Months

**Formula:**
```
continuity_months = (persistence * 0.03) 
                  + (forward * 0.04) 
                  + ((100 - labor) * 0.02) 
                  - (largest * 0.015)
                  
Clamped to [0, 12]
```

**Purpose:** Estimates how many months the client could sustain their income with zero new work or clients.

**Example:**
- Persistence: 45%, Forward: 33%, Labor: 62%, Largest: 60%
- Raw: (45 × 0.03) + (33 × 0.04) + (38 × 0.02) - (60 × 0.015)
- Raw: 1.35 + 1.32 + 0.76 - 0.90 = **2.53 months** → Clamped to 2.53

---

### Step 3.3: Raw Factor Scores (7 Factors)

#### Factor 1: Income Persistence Score (0–15 points)

| Range | Points |
|-------|--------|
| 0–10% | 1 |
| 11–20% | 3 |
| 21–35% | 5 |
| 36–50% | 8 |
| 51–65% | 11 |
| 66–80% | 13 |
| 81–100% | **15** |

*"How much income automatically renews?"*

---

#### Factor 2: Source Diversity Score (0–10 points)

| Count | Points |
|-------|--------|
| 1 source | 1 |
| 2 sources | 3 |
| 3 sources | 5 |
| 4 sources | 7 |
| 5 sources | 8 |
| 6+ sources | **10** |

*"How many meaningful income sources?"*

---

#### Factor 3: Forward Security Score (0–15 points)

| Range | Points |
|-------|--------|
| 0–5% | 0 |
| 6–15% | 2 |
| 16–30% | 5 |
| 31–45% | 8 |
| 46–60% | 11 |
| 61–75% | 13 |
| 76–100% | **15** |

*"How much forward revenue is locked in?"*

---

#### Factor 4: Concentration Resilience Score (0–10 points) — Inverse

| Largest Source | Points |
|----------------|--------|
| 0–20% | **10** |
| 21–35% | 8 |
| 36–50% | 6 |
| 51–65% | 4 |
| 66–80% | 2 |
| 81–100% | 0 |

*"How much if the largest source is lost?"* — Higher is better.

---

#### Factor 5: Labor Dependence Score (0–20 points) — Inverse

| Labor Dependence | Points |
|-----------------|--------|
| 0–20% | **20** |
| 21–35% | 17 |
| 36–50% | 14 |
| 51–65% | 10 |
| 66–80% | 6 |
| 81–100% | 2 |

*"How much income if you stop working?"* — Higher is better.

---

#### Factor 6: Variability Score (0–10 points) — Inverse

| Variability Level | Points |
|-------------------|--------|
| low | **10** |
| moderate | 7 |
| high | 3 |
| extreme | 0 |

*"How stable are monthly earnings?"*

---

#### Factor 7: Continuity Score (0–10 points)

| Continuity Months | Points |
|------------------|--------|
| 0–0.9 months | 0 |
| 1.0–1.9 months | 2 |
| 2.0–2.9 months | 4 |
| 3.0–4.4 months | 6 |
| 4.5–6.0 months | 8 |
| 6.01–12 months | **10** |

*"How many months can they sustain without new work?"*

---

### Step 3.4: Raw Score Subtotals

**Structure Subtotal (0–50 points):**
```
Persistence (0–15) 
+ Diversity (0–10) 
+ Forward Security (0–15) 
+ Concentration Resilience (0–10) 
= 0–50
```

**Stability Subtotal (0–40 points):**
```
Labor Dependence (0–20) 
+ Variability (0–10) 
+ Continuity (0–10) 
= 0–40
```

**Raw Total (0–90 points):**
```
Structure Subtotal (0–50) + Stability Subtotal (0–40) = 0–90
```

---

### Step 3.5: Quality Adjustment (0–10 points)

Applied when **extended inputs** are provided (optional advisor-specific data):

**Quality Rules:**
- Contract term ≥ 12 months: **+2 points**
- Contract term 6–11 months: **+1 point**
- Contract term 0–2 months: **-2 points**
- Low cancellation risk: **+2 points**
- High cancellation risk: **-2 points**
- High platform dependency: **-2 points**
- Moderate platform dependency: **-1 point**
- High customer concentration in recurring: **-2 points**
- Moderate customer concentration in recurring: **-1 point**
- Booked but cancelable revenue ≥ 50%: **-2 points**

**Base:** 5 points + adjustments (clamped to 0–10)

---

### Step 3.6: Cross-Factor Interactions

**Penalties** (reduce score):

| Code | Condition | Penalty | Factors |
|------|-----------|---------|---------|
| **CF-01** | Large source (≥70%) + weak forward (≤20%) | -5 pts | concentration, visibility |
| **CF-02** | High labor (≥75%) + low persistence (≤25%) | -5 pts | labor, persistence |
| **CF-03** | Multiple sources (≥4) but concentrated (≥65%) | -4 pts | diversity, concentration |
| **CF-04** | Strong persistence (≥50%) + high cancellation risk | -5 pts | persistence, risk |
| **CF-05** | Forward revenue (≥40%) mostly cancelable (≥50%) | -4 pts | forward, risk |
| **CF-06** | Few sources (≤2) + extreme variability | -4 pts | diversity, variability |

**Bonuses** (increase score):

| Code | Condition | Bonus | Factors |
|------|-----------|-------|---------|
| **CF-B01** | Strong forward (≥45%) + low concentration (≤35%) | +3 pts | forward, concentration |
| **CF-B02** | High persistence (≥60%) + low labor (≤35%) | +4 pts | persistence, labor |

**Net adjustment clamped to [-12, +8]**

---

### Step 3.7: Fragility Calculation

**Base:** 100 points

**Fragility Penalties:**

| Condition | Penalty | Trigger |
|-----------|---------|---------|
| Largest source ≥ 70% | -25 pts | concentration_collapse |
| Labor dependence ≥ 80% | -20 pts | labor_interruption |
| Forward secured ≤ 10% | -20 pts | visibility_gap |
| Variability = high | -10 pts | earnings_volatility |
| Variability = extreme | -20 pts | earnings_volatility |
| Continuity < 1 month | -15 pts | shallow_continuity |
| Durability grade = fragile | -15 pts | durability_thinness |

**Fragility Score** = Base - penalties (clamped to 0–100)

**Fragility Class:**
- 0–24: **brittle** (severe risk)
- 25–44: **thin** (multiple risks)
- 45–64: **uneven** (mixed stability)
- 65–79: **supported** (some resilience)
- 80–100: **resilient** (strong foundation)

---

### Step 3.8: Final Score Assembly

```
Overall Score = 
    Structure Subtotal (0–50)
  + Stability Subtotal (0–40)
  + Quality Score (0–10)
  + Interaction Adjustments [-12, +8]
  - Fragility Penalty (scaled)
  
Maximum: 100 points
```

---

## PHASE 4: BAND CLASSIFICATION & CORE OUTPUTS

### Band Thresholds

| Score Range | Band Name | Label |
|-------------|-----------|-------|
| 0–29 | Limited Stability™ | Unstable, at-risk |
| 30–49 | Developing Stability™ | Foundation-building |
| 50–74 | Established Stability™ | Durable, sustainable |
| 75–100 | High Stability™ | Resilient, mature |

### Warning Overlays

Additional flags applied to the band:

| Code | Overlay | Trigger | Impact |
|------|---------|---------|--------|
| **WRN-FRAG** | Fragility Warning | Fragility score ≤ 25 | Brittle structure despite band |
| **WRN-CONC** | Concentration Risk | Largest source ≥ 70% | Single-source collapse risk |
| **WRN-LABOR** | Labor-Heavy | Labor dependence ≥ 80% | Can't sustain without work |
| **WRN-VIS** | Thin Visibility | Forward secured ≤ 10% | No forward revenue visibility |

**Example:** Score 65 + WRN-CONC = "Established Stability / Concentration Risk"

---

## PHASE 5: STRUCTURAL INDICATORS

### Six Key Indicators

1. **Income Persistence Index** (0–100)
   - How much income renews automatically
   - Calculated from Q1 and continuity formula

2. **Concentration Index** (0–100)
   - Inverse of largest source %; how diversified
   - 100 = perfectly diversified, 0 = single source

3. **Forward Visibility Index** (0–100)
   - How much forward revenue is locked in
   - Calculated from Q4 and forward security score

4. **Labor Dependence Index** (0–100)
   - Inverse of Q6; how much work is required
   - 100 = zero labor dependence, 0 = 100% labor dependent

5. **Continuity Index** (0–100)
   - How many months can sustain without new work
   - Normalized from continuity_months

6. **Variability Index** (0–100)
   - How consistent are monthly earnings
   - Inverse of earnings volatility

---

## PHASE 6: SENSITIVITY & RISK SCENARIOS

### Sensitivity Analysis

Tests: "What if each factor improved by X?"

| Test | Change | Effect |
|------|--------|--------|
| +15% forward secured | +15 pts | How much would extending contracts help? |
| -15% largest source | -15 pts | How much safer with less concentration? |
| -15% labor dependence | -15 pts | How much safer with passive income? |
| +15% persistence | +15 pts | How much safer with more recurring? |
| +2 sources | varies | How much safer with one more major source? |
| +2 quality | +2 pts | How much if contract terms improve? |

---

### Risk Scenarios (6 Templates)

| Scenario | Description | Typical Impact |
|----------|-------------|-----------------|
| **RS-01** | Largest Source Removed | Hardest hit; reveals concentration risk |
| **RS-02** | Active Labor Interrupted (90 days) | Reveals labor dependence |
| **RS-03** | Forward Commitments Delayed (3 months) | Tests visibility buffer |
| **RS-04** | Recurring Stream Degrades (40% loss) | Tests persistence resilience |
| **RS-05** | High Volatility Month | Reveals worst-case monthly income |
| **RS-06** | Platform Dependency Shock | Tests platform concentration (if applicable) |

---

## PHASE 7: CONSTRAINTS & FAILURE MODES

### Seven Constraint Keys

| Constraint | Trigger | Meaning |
|-----------|---------|---------|
| **weak_forward_visibility** | Forward ≤ 10% | Can't see beyond next month |
| **high_labor_dependence** | Labor ≥ 80% | Income dies if you stop |
| **high_concentration** | Largest ≥ 70% | Over-reliant on one source |
| **low_persistence** | Persistence ≤ 25% | Most income requires re-earning |
| **high_variability** | Variability = high/extreme | Earnings all over the place |
| **weak_durability** | Durability grade = fragile/thin | Income fragile or cancelable |
| **shallow_continuity** | Continuity < 1 month | Can't last 30 days without work |

### Failure Modes

| Mode | Description | Scenario |
|------|-------------|----------|
| **concentration_collapse** | Single source is lost | Largest source ends contract |
| **labor_interruption** | Can't work for extended period | Illness, sabbatical, burnout |
| **visibility_gap** | Forward revenue uncertain | No contracts locked in beyond 30 days |
| **durability_thinness** | Recurring revenue is fragile | High cancelation risk, short terms |

---

## PHASE 8: CORE OUTPUTS (Same for All Report Types)

### ✓ ALWAYS Present These Core Outputs

```typescript
{
  // Identity
  assessment_id: string;
  created_at: ISO8601;
  
  // Profile
  profile_class: "individual" | "business_owner" | "hybrid";
  operating_structure: string;
  primary_income_model: string;
  revenue_structure: string;
  industry_sector: string;
  
  // Raw Input (answers A–E)
  q1_recurring_revenue_base: "A" | "B" | "C" | "D" | "E";
  q2_income_concentration: "A" | "B" | "C" | "D" | "E";
  q3_income_source_diversity: "A" | "B" | "C" | "D" | "E";
  q4_forward_revenue_visibility: "A" | "B" | "C" | "D" | "E";
  q5_earnings_variability: "A" | "B" | "C" | "D" | "E";
  q6_income_continuity_without_labor: "A" | "B" | "C" | "D" | "E";
  
  // Normalized (canonical) inputs
  income_persistence_pct: number;
  largest_source_pct: number;
  source_diversity_count: number;
  forward_secured_pct: number;
  income_variability_level: "low" | "moderate" | "high" | "extreme";
  labor_dependence_pct: number;
  continuity_months: number;
  
  // Scores
  overall_score: number;                  // 0–100
  raw_total: number;
  structure_subtotal: number;             // 0–50
  stability_subtotal: number;             // 0–40
  quality_score: number;                  // 0–10
  fragility_score: number;                // 0–100
  
  // Classification
  primary_band: "Limited Stability" | "Developing Stability" | "Established Stability" | "High Stability";
  sub_band: string;                       // Primary band + overlay (if any)
  warning_overlays: Array<{
    code: string;
    label: string;
    trigger: string;
  }>;
  
  // Indicators
  income_persistence_index: number;       // 0–100
  concentration_index: number;            // 0–100
  forward_visibility_index: number;       // 0–100
  labor_dependence_index: number;         // 0–100
  continuity_index: number;               // 0–100
  variability_index: number;              // 0–100
  
  // Constraints
  primary_constraint: string;
  constraint_summary: {
    [key: string]: { active: boolean; severity: "low" | "medium" | "high" };
  };
  failure_modes: Array<{
    mode: string;
    description: string;
    likelihood: "low" | "medium" | "high";
  }>;
  
  // Scenarios & Risk
  risk_scenarios: Array<{
    scenario_id: string;
    label: string;
    description: string;
    original_score: number;
    scenario_score: number;
    score_drop: number;
    band_shift: boolean;
  }>;
  
  // Actions & Roadmap
  recommended_actions: Array<{
    rank: number;
    action_id: string;
    label: string;
    description: string;
    expected_effect: string;
  }>;
  
  // Reassessment
  reassessment_triggers: Array<{
    trigger_id: string;
    condition: string;
    lead_time_days: number;
  }>;
}
```

---

## PHASE 9: REPORT VARIATIONS

### ✓ ALL THREE REPORTS Have the Same Core Outputs

But presentation, emphasis, and language differ.

---

## 1. INDIVIDUAL REPORT (Self-understanding + Emotional Clarity)

### Design Principles
- **Goal:** Help the person understand what stability means for them
- **Audience:** Non-financial background, wants clarity
- **Tone:** Empowering, educational, personal

### Required Sections

#### Cover
- Income Stability Score™
- Stability Classification™ (e.g., "Established Stability")
- One-sentence diagnostic: "Your income has a strong foundation with clear visibility, but you're dependent on one major client."

#### Why This Score? (Explainability)
- Plain English breakdown of the 6 factors
- What helped the score (strongest supports)
- What held it back (strongest suppressors)
- No jargon; use examples from their specific business

#### The Dominant Constraint (Primary Risk)
- Name the #1 thing holding back the score
- Why it matters: What happens if it gets worse?
- What to change first

#### What If? Scenarios (Risk Illustration)
- Simplified 3–4 risk scenarios (not all 6)
- Plain language: "If your largest client left..."
- Show score impact
- Include mitigation (what you could do)

#### The Roadmap (To Improve)
- Top 3–5 actions in plain language
- Sequenced (do X first, then Y)
- Realistic timeframe
- Include tradeoffs (doing X costs Y)

#### Reassessment Timeline
- When to check back
- What would trigger an urgent reassessment

---

## 2. ADVISOR REPORT (Communication Utility + Workflow Speed)

### Design Principles
- **Goal:** Give advisors what they need to evaluate and discuss structure quickly
- **Audience:** Financial professionals, want efficiency
- **Tone:** Operational, structured, no hand-holding

### Required Sections

#### Executive Summary (½ page)
- **Score & Band:** "68 / Established Stability"
- **Fragility Class:** "thin" (operational risk)
- **Primary Structural Risk:** "High concentration (78% from top 3 clients)"
- **Workflow Value:** 1–2 sentences: "Client has resilient recurring base but needs concentration reduction; visibility extends 6 months"

#### Structural Diagnostics (Rapid Assessment)
- **6-factor breakdown** (no explanations, just numbers)
  - Persistence: 52% (moderate)
  - Concentration: 75% (high risk)
  - Diversity: 2 sources
  - Forward visibility: 5 months
  - Variability: ±18% (low)
  - Labor dependence: 41% (moderate)

#### Risk Scenarios (3 most relevant)
- **Scenario title | Original score | Scenario score | Drop | Band shift?**
  - Example: "Largest client ends | 68 → 47 | -21 pts | Drop to Developing Stability"
  - No narrative; pure structural impact

#### Constraints Ranked by Severity
1. High concentration (78%)
2. Shallow forward visibility (<6 months for non-recurring)
3. Labor-dependent revenue structure

#### Conversation Levers
**What could improve the score by 10+ points?**
- Extend forward contracts from 5 → 8 months (+6 pts)
- Add one major diversified source (-15% concentration, +5 pts)
- Increase recurring from 52% → 65% (+3 pts)

**What's the hidden unlock?**
- If concentration drops to <50%, constraint hierarchy shifts; primary bottleneck becomes forward visibility instead.

#### Actions (Operational, Not Motivational)
- **For Discussion:**
  1. Concentration reduction strategy (which 2–3 sources?)
  2. Forward visibility (extend longest contracts 6 → 12 months?)
  3. Recurring revenue pathway (subscription model?)

#### Reassessment Triggers
- **Before 3 months:** If major client signals contract end
- **Quarterly:** Standard check-in
- **After implementation:** Post-action reassessment

---

## 3. ORGANIZATION REPORT (Standardization + Comparability)

### Design Principles
- **Goal:** Enable organizations to run diagnostics at scale and compare cohorts
- **Audience:** Risk teams, program managers, workflow orchestrators
- **Tone:** Procedural, metrics-focused, comparative

### Required Sections

#### Assessment Header (Machine + Human Readable)
```json
{
  "assessment_id": "RPW-2024-001-A73",
  "assessment_date": "2024-01-15",
  "client_id": "CLIENT-0847",
  "profile_class": "individual",
  "operating_structure": "solo_service",
  "primary_income_model": "retainer",
  "revenue_structure": "hybrid",
  "industry_sector": "consulting_professional_services"
}
```

#### Canonical Input Record (Standardized Data)
```
Q1_Answer: C
Q1_Canonical: income_persistence_pct = 45

Q2_Answer: B
Q2_Canonical: largest_source_pct = 80

Q3_Answer: B
Q3_Canonical: source_diversity_count = 2

Q4_Answer: C
Q4_Canonical: forward_secured_pct = 33

Q5_Answer: D
Q5_Canonical: income_variability_level = "low"

Q6_Answer: D
Q6_Canonical: labor_dependence_pct = 37
```

#### Normalized Outputs (Deterministic)
| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| Overall Score | **68** | 50–74 | Established |
| Fragility Score | **72** | N/A | Supported |
| Primary Constraint | High concentration | Monitor |
| Continuity Months | **2.1** | Target: 3+ | Below |

#### Band Assignment
- **Primary Band:** Established Stability
- **Overlay:** Concentration Risk
- **Sub-Band:** "Established Stability / Concentration Risk"

#### Factor Scores (Deterministic Lookup Table)
| Factor | Raw Score | Max | Percentage |
|--------|-----------|-----|-----------|
| Persistence (Q1) | 8 | 15 | 53% |
| Diversity (Q3) | 3 | 10 | 30% |
| Forward Security (Q4) | 5 | 15 | 33% |
| Concentration Resilience (Q2) | 2 | 10 | 20% |
| Labor Dependence (Q6) | 14 | 20 | 70% |
| Variability (Q5) | 10 | 10 | 100% |
| Continuity (derived) | 4 | 10 | 40% |
| **Structure Subtotal** | **18** | **50** | **36%** |
| **Stability Subtotal** | **28** | **40** | **70%** |

#### Scenario Results (for Cohort Analysis)
| Scenario ID | Scenario Label | Score Drop | Band Shift | Frequency in Cohort |
|-------------|----------------|------------|-----------|-------------------|
| RS-01 | Largest Source Removed | -21 | Yes (→ Developing) | 45% |
| RS-02 | Active Labor Interrupted | -8 | No | 30% |
| RS-03 | Forward Delayed 3 months | -5 | No | 25% |

#### Constraint Flags (for Governance)
```
[ ] weak_forward_visibility       (No — forward = 33%)
[X] high_concentration             (Yes — largest = 80%)
[ ] low_persistence                (No — persistence = 45%)
[X] high_labor_dependence          (Yes — labor = 37%)
[ ] high_variability               (No — variability = low)
[ ] weak_durability                (No — durability = moderate)
[ ] shallow_continuity             (No — continuity = 2.1 months)
```

#### Cohort Positioning
- **Peer Group (Operating Structure):** Solo Service Providers
- **Score Range:** 30–65 typical; this client: **68** (above cohort median)
- **Concentration Percentile:** 72nd percentile (more concentrated than 72% of cohort)
- **Labor Dependence Percentile:** 35th percentile (less labor-dependent than 65% of cohort)

#### Reproducibility & Integrity
```
Model: RP-2.0
Factors: F-2.0
Scenarios: S-2.0
Execution Hash: 8f3a4c2e9b1d5f...
Audit Trail: Assessor, Timestamp, Changes
```

---

## PHASE 10: LANGUAGE CUSTOMIZATION BY AUDIENCE

### Individual Report Language

**Q1 Interpretation:**
- "A–B (0–30%)": "Your income is mostly transactional — you need to continually re-earn it."
- "C (31–60%)": "You have a moderate automatic renewal base that covers roughly half your income."
- "D–E (61–100%)": "Most of your income renews automatically — a strong foundation."

**Q2 Interpretation:**
- "A–B (70–100%)": "You're heavily dependent on one or two sources. If one ends, you lose 70%+ of income."
- "C (50–70%)": "About half your income comes from one source. Diversification would reduce risk."
- "D–E (15–49%)": "Your income is well-spread. Loss of one source wouldn't be catastrophic."

---

### Advisor Report Language

**Q1 Interpretation:**
- "Transactional (A–B)": "Requires continuous new business acquisition or project work; no revenue floor."
- "Hybrid (C)": "Recurring foundation exists but isn't the primary revenue driver."
- "Recurring-Heavy (D–E)": "Revenue floor is established; growth is additive."

**Q2 Interpretation:**
- "Extreme Concentration (90–100%)": "Structural single-point failure; recommend immediate diversification planning."
- "Significant Concentration (70–89%)": "Loss of largest source would drop score 10–15 points; key risk area."
- "Moderate Concentration (50–69%)": "Significant concentration but not catastrophic; diversification improves resilience by 5–8 points."
- "Well-Distributed (30–49% or less)": "Reasonable distribution; focus on other constraints."

---

### Organization Report Language

**Q2 Coding for Governance:**
- **Risk Level:** "High" if largest_source_pct ≥ 70%
- **Action Required:** "Concentration Management" if above threshold
- **Cohort Signal:** Report as percentile within operating_structure cohort

---

## QUICK REFERENCE: QUESTION-TO-OUTPUT MAPPING

| Q# | Concept | Canonical | Scoring | Band Impact | Risk Scenario |
|----|---------|-----------|---------|-------------|---------------|
| Q1 | Recurring | `income_persistence_pct` | 0–15 pts | High impact (affects structure subtotal) | RS-04: Recurring degrades 40% |
| Q2 | Concentration | `largest_source_pct` | 0–10 pts (inverse) | Medium impact (fragility trigger) | RS-01: Largest source removed |
| Q3 | Diversity | `source_diversity_count` | 0–10 pts | Low–medium (diversification helps) | RS-01 impact varies by diversity |
| Q4 | Forward | `forward_secured_pct` | 0–15 pts | High impact (visibility buffer) | RS-03: Forward delayed 3 months |
| Q5 | Variability | `income_variability_level` | 0–10 pts (inverse) | Low–medium (stability indicator) | RS-05: High volatility month |
| Q6 | Labor | `labor_dependence_pct` | 0–20 pts (inverse) | Highest impact (survival metric) | RS-02: Active labor interrupted |

---

## IMPLEMENTATION CHECKLIST FOR ADVISORS & ORGANIZATIONS

### ✓ For Advisor Report
- [ ] Simplify narrative (no explanations, just data)
- [ ] Highlight **Scenario RS-01** (largest source loss) as primary risk
- [ ] Include "Conversation Levers" (What would improve score by 10+ points?)
- [ ] Call out **hidden unlocks** (if constraint rank would shift with one action)
- [ ] Use percentiles within peer group (cohort context)
- [ ] Include **forward visibility in months**, not %; easier for planning

### ✓ For Organization Report
- [ ] Export all data in structured JSON/CSV format
- [ ] Map each Q answer to canonical input explicitly
- [ ] Flag constraint violations in binary (active/inactive)
- [ ] Include cohort percentiles for all major factors
- [ ] Add scenario frequency (% of cohort that would shift bands)
- [ ] Provide reproducibility hash (model version + execution audit)
- [ ] Enable **comparative analysis**: same person, different structures (solo vs. agency)

---

## GLOSSARY

| Term | Definition |
|------|-----------|
| **Canonical Input** | Normalized numeric representation of an answer (e.g., Q1=C → persistence_pct=45) |
| **Continuity Months** | Estimated months the client can sustain their income without new work or clients |
| **Concentration** | % of income from largest single source (high = risk) |
| **Forward Secured %** | % of future income that's contractually committed (high = safety) |
| **Fragility Class** | Structural durability: brittle → thin → uneven → supported → resilient |
| **Labor Dependence** | % of income that requires active work (high = vulnerability) |
| **Primary Constraint** | The single biggest bottleneck holding back the score |
| **Persistence** | % of income that renews automatically without re-earning (high = resilience) |
| **Stability Band** | Score-based classification: Limited → Developing → Established → High |
| **Variability Level** | Income consistency: extreme → high → moderate → low (low = stable) |

---

## Notes for Implementation

1. **Always use both question sets** (Individual + Advisor) side-by-side when designing new versions. They measure the same 6 factors but frame them for different audiences.

2. **Core outputs never change.** The overall_score, primary_band, and the 6 canonical inputs are deterministic and must be identical across all report types.

3. **Presentation layers are where customization happens.** Language, emphasis, narrative structure, and depth of explanation vary, but the underlying data doesn't.

4. **Advisor/Organization reports need operational data.** Include raw factor scores, constraint flags, and scenario results so they can make decisions and compare cohorts.

5. **Risk scenarios are powerful.** They show structural vulnerabilities far better than a single score. Include them in all reports, but vary depth (simplified for individuals, detailed for organizations).

6. **Comparative analysis is critical for organizations.** Add percentile comparisons within peer groups (by operating_structure and industry_sector) so decision-makers understand relative risk.

---

**End of Diagnostic Flow**
