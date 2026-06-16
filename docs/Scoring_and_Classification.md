# RunPayway™ Scoring & Classification Engine (RP-2.0)

## Overview

RunPayway™ uses a deterministic diagnostic engine that converts 6 simple questions into a comprehensive income stability score (0–100). The process is transparent, verifiable, and free from AI bias.

---

## Part 1: Answer Mappings (A–E → Canonical Values)

Each answer choice (A, B, C, D, E) maps to a normalized numeric value representing the underlying income characteristic.

### Q1: Recurring Revenue Base
Measures the percentage of income that renews automatically without new client acquisition.

| Answer | Interpretation | Canonical Value |
|--------|-----------------|-----------------|
| **A** | 0–10% | 5% persistence |
| **B** | 11–30% | 20% persistence |
| **C** | 31–60% | 45% persistence |
| **D** | 61–85% | 73% persistence |
| **E** | 86–100% | 93% persistence |

---

### Q2: Income Concentration
Measures how much income depends on the single largest source (higher = worse).

| Answer | Interpretation | Canonical Value |
|--------|-----------------|-----------------|
| **A** | 90–100% concentrated | 95% from largest source |
| **B** | 70–89% concentrated | 80% from largest source |
| **C** | 50–69% concentrated | 60% from largest source |
| **D** | 30–49% concentrated | 40% from largest source |
| **E** | Under 30% concentrated | 15% from largest source |

---

### Q3: Income Source Diversity
Measures how many distinct income sources each contribute at least 10% of total income.

| Answer | Interpretation | Canonical Value |
|--------|-----------------|-----------------|
| **A** | 1 source | 1 source |
| **B** | 2 sources | 2 sources |
| **C** | 3–4 sources | 3 sources |
| **D** | 5–7 sources | 6 sources |
| **E** | 8+ sources | 8 sources |

---

### Q4: Forward Revenue Visibility
Measures how many months of contractually committed income are already secured (higher = better).

| Answer | Interpretation | Canonical Value |
|--------|-----------------|-----------------|
| **A** | Less than 1 month | 4% secured |
| **B** | 1–2 months | 12% secured |
| **C** | 3–5 months | 33% secured |
| **D** | 6–11 months | 71% secured |
| **E** | 12+ months | 100% secured |

---

### Q5: Earnings Variability
Measures month-to-month income swings as a percentage of average income (higher = worse).

| Answer | Interpretation | Variability Level | Numeric Value |
|--------|-----------------|-------------------|----------------|
| **A** | Fluctuated >75% | extreme | 88 |
| **B** | Fluctuated 50–75% | high | 63 |
| **C** | Fluctuated 25–49% | moderate | 37 |
| **D** | Fluctuated 10–24% | low | 17 |
| **E** | Fluctuated <10% | low | 5 |

---

### Q6: Labor Dependence
Measures what percentage of income would continue without active work for 90 days (inverse: higher = better).

| Answer | Interpretation | Canonical Value | Labor Dependence |
|--------|-----------------|-----------------|-----------------|
| **A** | 0% continues | 100% dependent | 100% labor-heavy |
| **B** | 1–25% continues | 87% dependent | 87% labor-heavy |
| **C** | 26–50% continues | 62% dependent | 62% labor-heavy |
| **D** | 51–75% continues | 37% dependent | 37% labor-heavy |
| **E** | 76–100% continues | 12% dependent | 12% labor-heavy |

---

## Part 2: Scoring Calculation

### Structure: The Score Calculation Process

The engine calculates a **raw score (0–90)** from six factor scores, then applies quality adjustments and interaction penalties/bonuses to produce the **final overall score (0–100)**.

### Factor Scores (Raw Calculation)

Each canonical value from the answers is looked up in a scoring table to produce 0–10 or 0–15 points.

#### Factor 1: Income Persistence (0–15 points)
Based on Q1 recurring revenue percentage:

| Persistence % | Points |
|---|---|
| 0–10% | 1 |
| 11–20% | 3 |
| 21–35% | 5 |
| 36–50% | 8 |
| 51–65% | 11 |
| 66–80% | 13 |
| 81–100% | 15 |

---

#### Factor 2: Source Diversity (0–10 points)
Based on Q3 number of income sources:

| Source Count | Points |
|---|---|
| 1 | 1 |
| 2 | 3 |
| 3 | 5 |
| 4 | 7 |
| 5 | 8 |
| 6+ | 10 |

---

#### Factor 3: Forward Secured Revenue (0–15 points)
Based on Q4 percentage of forward income visibility:

| Forward Visibility % | Points |
|---|---|
| 0–5% | 0 |
| 6–15% | 2 |
| 16–30% | 5 |
| 31–45% | 8 |
| 46–60% | 11 |
| 61–75% | 13 |
| 76–100% | 15 |

---

#### Factor 4: Concentration Resilience (0–10 points)
Based on Q2 concentration — scored inversely (lower concentration = higher score):

| Largest Source % | Points |
|---|---|
| 0–20% | 10 |
| 21–35% | 8 |
| 36–50% | 6 |
| 51–65% | 4 |
| 66–80% | 2 |
| 81–100% | 0 |

---

#### Factor 5: Labor Dependence (0–20 points)
Based on Q6 labor independence — scored inversely (lower dependence = higher score):

| Labor Dependence % | Points |
|---|---|
| 0–20% | 20 |
| 21–35% | 17 |
| 36–50% | 14 |
| 51–65% | 10 |
| 66–80% | 6 |
| 81–100% | 2 |

---

#### Factor 6: Variability Resilience (0–10 points)
Based on Q5 earnings variability level — scored inversely (lower variance = higher score):

| Variability Level | Points |
|---|---|
| **low** | 10 |
| **moderate** | 7 |
| **high** | 3 |
| **extreme** | 0 |

---

#### Factor 7: Continuity Months (0–10 points)
Estimated from a composite formula:

**continuity_months = (persistence × 0.03) + (forward × 0.04) + ((100 − labor) × 0.02) − (largest × 0.015)**

Clamped to [0, 12] months, then scored:

| Continuity Months | Points |
|---|---|
| 0–0.9 | 0 |
| 1.0–1.9 | 2 |
| 2.0–2.9 | 4 |
| 3.0–4.4 | 6 |
| 4.5–6.0 | 8 |
| 6.01–12 | 10 |

---

### Score Assembly

**Structure Subtotal** (max 50 points):
- Income Persistence Score (0–15)
- Source Diversity Score (0–10)
- Forward Security Score (0–15)
- Concentration Resilience Score (0–10)

**Stability Subtotal** (max 40 points):
- Labor Dependence Score (0–20)
- Variability Score (0–10)
- Continuity Score (0–10)

**Raw Total**: Structure + Stability = 0–90 points

### Interaction Effects

After the raw total is calculated, the engine applies **interaction penalties and bonuses** if certain combinations of factors are triggered.

#### Penalties (−4 to −5 points each)

| Code | Condition | Points | Description |
|------|-----------|--------|-------------|
| CF-01 | Concentration ≥70% AND Forward Visibility ≤20% | −5 | High concentration with weak forward visibility |
| CF-02 | Labor Dependence ≥75% AND Persistence ≤25% | −5 | High labor dependence with low persistence |
| CF-03 | Source Diversity ≥4 AND Concentration ≥65% | −4 | Diverse sources but still concentrated |
| CF-04 | Persistence ≥50% AND High Cancellation Risk | −5 | Persistent revenue but high cancellation risk |
| CF-05 | Forward Revenue ≥40% AND >50% Cancelable | −4 | Forward revenue mostly cancelable |
| CF-06 | Diversity ≤2 AND Variability = Extreme | −4 | Few sources with extreme variability |

#### Bonuses (+3 to +4 points each)

| Code | Condition | Points | Description |
|------|-----------|--------|-------------|
| CF-B01 | Forward Visibility ≥45% AND Concentration ≤35% | +3 | Strong visibility with low concentration |
| CF-B02 | Persistence ≥60% AND Labor Dependence ≤35% | +4 | High persistence with low labor dependence |

**Net adjustment**: Clamped to [−12, +8] points

### Quality Adjustment

An optional quality score (0–10) can be applied based on extended inputs like:
- Contract term length (longer = higher quality)
- Cancellation risk (lower = higher quality)
- Platform dependency (lower = higher quality)

---

### Final Overall Score

**Overall Score = Raw Total + Net Adjustment + Quality Adjustment**

Clamped to [0, 100]

---

## Part 3: Stability Bands (Classification)

The overall score places the client into one of four stability bands:

### Band Thresholds

| Score Range | Primary Band | Characteristics |
|---|---|---|
| **0–29** | **Limited Stability** | High fragility; income is unpredictable and labor-dependent. Vulnerability to disruption is significant. |
| **30–49** | **Developing Stability** | Early-stage structure; some recurring or forward revenue, but not yet resilient. Growth potential; higher risk. |
| **50–74** | **Established Stability** | Solid foundation; reasonable diversification and forward visibility. Moderate resilience to disruption. |
| **75–100** | **High Stability** | Strong structure; well-diversified, predictable, and independent of personal labor. High resilience. |

---

### Sub-Band Classification

If any of the following **warning overlays** are triggered, the system adds a secondary descriptor to the primary band:

#### Warning Overlay Rules

| Code | Label | Trigger |
|---|---|---|
| **WRN-FRAG** | Fragility Warning | Fragility Score ≤ 25 |
| **WRN-CONC** | Concentration Risk | Largest Source ≥ 70% |
| **WRN-LABOR** | Labor-Heavy | Labor Dependence ≥ 80% |
| **WRN-VIS** | Thin Visibility | Forward Secured % ≤ 10% |

**Sub-band example**: "Established Stability / Concentration Risk"

---

## Part 4: Fragility Score (Structural Resilience)

A separate **Fragility Score (0–100)** is calculated to measure structural resilience to disruption.

### Fragility Base

Starts at **100 points**, then applies deductions based on risk factors:

| Condition | Points Deducted | Description |
|---|---|---|
| Concentration ≥ 70% | −25 | Over-reliance on single source |
| Labor Dependence ≥ 80% | −20 | Income stops when work stops |
| Forward Visibility ≤ 10% | −20 | No near-term revenue certainty |
| Variability = High | −10 | Significant month-to-month swings |
| Variability = Extreme | −20 | Severe income volatility |
| Continuity < 1 month | −15 | Less than one month estimated continuity |
| Durability Grade = Fragile | −15 | Underlying structure is weak |

### Fragility Classes

| Fragility Score | Class | Meaning |
|---|---|---|
| **0–24** | **Brittle** | Severe structural risk; single disruption could cause major income loss. |
| **25–44** | **Thin** | Significant vulnerabilities; disruption risk is elevated. |
| **45–64** | **Uneven** | Some resilience, but with notable gaps; moderate risk. |
| **65–79** | **Supported** | Generally resilient structure; limited disruption risk. |
| **80–100** | **Resilient** | Strong structural integrity; high resilience to disruption. |

---

## Part 5: Interpretation Logic

### One-Sentence Talking Point

The system identifies the **primary constraint** (root risk) and provides a context-aware talking point:

#### Constraint Keys and Display Labels

| Constraint Key | Display Label | Typical Trigger |
|---|---|---|
| `high_concentration` | Income Concentration | Largest source ≥ 70% |
| `high_labor_dependence` | Labor Dependence | Labor dependence ≥ 80% |
| `weak_forward_visibility` | Forward Visibility | Forward secured ≤ 10% |
| `low_persistence` | Low Persistence | Income persistence ≤ 25% |
| `high_variability` | Income Variability | Variability = high or extreme |
| `weak_durability` | Source Diversity | < 3 sources |

---

### Industry-Specific Risk Conversations

For each constraint, the system generates an industry-aware talking point. Example patterns:

**Income Concentration Risk in Consulting:**
> "In consulting, heavy reliance on one or two clients creates fragility. Ask about diversifying revenue sources or adding a second revenue line."

**Labor Dependence Risk in Professional Services:**
> "In professional services, income tied to hours worked limits growth. Discuss recurring revenue or productized services that reduce personal labor risk."

**Forward Visibility Risk in Real Estate:**
> "In real estate, short-term visibility makes planning difficult. Explore pipeline indicators your client tracks or contract renewal patterns."

---

### One-Paragraph Meeting Prep Template

The system generates a one-paragraph brief combining:

1. **Score & Band**: Client score and stability classification
2. **Fragility Note**: If brittle/thin, mention the structural risk
3. **Primary Risk**: Industry-specific conversation starter
4. **Lift Opportunity**: Highest-impact improvement scenario (if available)

**Example output:**
> "Jane scored 52, placing her in Established Stability. Her structure is uneven — a lost client could cause a temporary income dip. Her primary structural risk is Income Concentration. In consulting, heavy reliance on one or two clients creates fragility. Ask about diversifying revenue sources or adding a second revenue line. The single biggest improvement opportunity is Reduce Concentration, which could lift the score by 12 points."

---

## Part 6: Score Lift Scenarios (Improvement Opportunities)

The system calculates how much each client's score could improve by addressing specific factors:

### Lift Scenario Templates

| Scenario | Factor | Improvement |
|---|---|---|
| **Extend Forward Visibility** | +15 forward secured % | +2 to +5 points typically |
| **Reduce Concentration** | −15 largest source % | +2 to +8 points typically |
| **Reduce Labor Dependence** | −15 labor dependence % | +3 to +6 points typically |
| **Increase Persistent Revenue** | +15 income persistence % | +2 to +6 points typically |
| **Improve Income Quality** | +2 quality score | +1 to +3 points typically |

The system ranks these scenarios and highlights the **highest single lift** opportunity — the factor change that would produce the largest score improvement.

---

## Part 7: Confidence Levels

The assessment confidence is calculated based on data completeness:

| Confidence Score | Confidence Level | Meaning |
|---|---|---|
| **85–100** | High | Assessment is based on clear, consistent signals. |
| **65–84** | Moderate | Assessment is solid but could benefit from additional context. |
| **45–64** | Guarded | Assessment has some ambiguity; context matters. |
| **0–44** | Low | Assessment has significant uncertainty. |

---

## Example Calculation

### Sample Answers:
- Q1 (Recurring Revenue): **C** (31–60%)
- Q2 (Income Concentration): **D** (30–49%)
- Q3 (Source Diversity): **C** (3–4 sources)
- Q4 (Forward Visibility): **B** (1–2 months)
- Q5 (Earnings Variability): **C** (25–49% swing)
- Q6 (Labor Dependence): **D** (51–75% continues)

### Canonical Values:
- income_persistence_pct = 45
- largest_source_pct = 40
- source_diversity_count = 3
- forward_secured_pct = 12
- income_variability_level = moderate
- labor_dependence_pct = 37

### Factor Scores:
- Income Persistence (45%) = 5 points
- Source Diversity (3 sources) = 5 points
- Forward Secured (12%) = 2 points
- Concentration Resilience (40% largest) = 6 points
- Labor Dependence (37% dependent) = 14 points
- Variability (moderate) = 7 points
- Continuity = ~2.1 months = 6 points

### Raw Total:
5 + 5 + 2 + 6 + 14 + 7 + 6 = **45 points**

### Interaction Effects:
- CF-05 triggers (forward ≥ 40% AND >50% cancelable): Would apply −4, but forward is only 12%, so no trigger.
- No bonuses triggered.
- **Net adjustment: 0**

### Quality Adjustment:
- Assume no extended inputs: 0

### Final Overall Score:
45 + 0 + 0 = **45**

### Classification:
- **Primary Band**: Developing Stability (30–49 range)
- **Fragility Score**: 100 − 10 (variability) = 90 (Resilient)
- **Primary Constraint**: Weak Forward Visibility (12% secured)

---

## Technical Notes

- **Model Version**: RP-2.0
- **Factor Version**: F-2.0
- **Deterministic**: No randomness or AI bias. Same inputs always produce the same outputs.
- **Transparent**: Every point in the score is traceable to a specific rule or factor.
- **Verifiable**: The calculation can be audited at any step.
