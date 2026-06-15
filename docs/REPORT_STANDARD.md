# RunPayway™ Report Standard

**Scope**: Assessment report structure, fields, immutability, verification  
**Version**: 1.0  
**Effective Date**: June 2, 2025  
**Applies To**: All RP-2.0+ assessments

---

## Core Principle

**Every report is an immutable institutional record.**

Once generated, a report:
- Cannot be modified (only new assessments created)
- Can be verified (through hash-based integrity)
- Preserves model version (forever identified with RP-2.0, RP-2.1, etc.)
- Supports historical review (for audit, compliance, advisor reference)

---

## Report Anatomy

### Required Header

Every report must include:

```
Assessment ID:           [uuid]
Assessment Date:         [ISO8601 timestamp]
Model Version:          [RP-2.0 | RP-2.1 | RP-3.0]
Model Build ID:         [git commit hash]
Output Version:         [1.0]
Verification Available: https://runpayway.com/verify?id=[assessment_id]&code=[auth_code]
```

**Purpose**: Enables third-party verification and historical tracking

---

### Primary Score Section

```
Income Stability Score:  [0-100]
Stability Classification: [Limited|Developing|Established|High] Stability
Sub-Band:               [A|B|C|D]

Interpretation:
[Band-specific narrative, 2-3 sentences]

Example:
"You have Established Stability (Score: 65, E-Band). 
Your income has a solid recurring foundation (65% automatic) 
but is concentrated in your largest client (72% of income). 
Diversifying would significantly improve your resilience."
```

---

### Score Breakdown Section

```
Factor Scores (out of 100):

Income Persistence        [40 pts]   ←── Does income recur without action?
Source Diversity         [18 pts]   ←── How spread across sources?
Forward Revenue Visibility [12 pts] ←── Can you see 6+ months ahead?
Concentration Resilience  [8 pts]   ←── What if largest source fails?
Labor Dependence         [7 pts]    ←── Income from assets vs. work?
Earnings Variability     [3 pts]    ←── Month-to-month consistency?
────────────────────────────────
Subtotal                 [88 pts]
Quality Adjustment       [-1 pts]   (due to limited extended input data)
Fragility Deduction      [-5 pts]   (high concentration risk)
────────────────────────────────
Final Score              [82 pts] → [Clamped to 75, Established Stability]
```

---

### Primary Constraint Section

```
Your Biggest Limitation:  Income Concentration

Current Situation:
  • Largest client represents 72% of total income
  • Losing this client would drop your score to 48 (Developing Stability)
  • Recovery would require 6-12 months of new business

Why This Matters:
  Your income is fundamentally dependent on one major client.
  This creates significant vulnerability. Economic downturn, client 
  budget cuts, or relationship changes could severely impact your income.

What Would Help:
  Adding 1-2 new recurring clients (each 15%+ of income) would:
  • Reduce concentration to 45% from largest source
  • Improve your score by 10+ points (to 85, High Stability)
  • Dramatically increase resilience

Action Step:
  Identify 2-3 target clients in your pipeline. Focus on closing 
  one new recurring client in next 6 months.
```

---

### Income Structure Breakdown

```
Income Composition:

Recurring Revenue:      65% (automatic, requires no action)
  - Retainer clients:   45%
  - Subscription:       15%
  - Recurring projects: 5%

Active Income:         35% (requires ongoing work)
  - New projects:      20%
  - Consulting:        10%
  - Speaking:          5%

Asset-Backed Income:   0% (no passive income streams)

Largest Single Source: Client ABC (72%)
Next 3 Largest:       Client XYZ (12%), Retainer M (8%), Project 1 (5%)
```

---

### Risk Scenarios Section

```
Income Resilience Under Stress:

Recession Scenario (-30% Income):
  Your income would drop to $35,000/month (from $50,000)
  New Score: 48 (Developing Stability)
  Why: Largest client cuts 30%, active income drops 40%
  Timeline to Recovery: 6-9 months

Loss of Largest Client:
  Your income would drop to $14,000/month (from $50,000)
  New Score: 32 (Limited Stability)
  Why: 72% of income disappears
  Timeline to Recovery: 12+ months
  Mitigation: Emergency fund for 6+ months

Extended Illness (3 months unable to work):
  Your income would drop to $32,500/month (from $50,000)
  New Score: 58 (Developing Stability)
  Why: Active work stops, recurring continues
  Timeline to Recovery: Immediate return when healthy

Platform Risk (if any work depends on single platform):
  [Not applicable to your income structure]
```

---

### Sensitivity Analysis Section

```
What Matters Most:

Factor Impact on Score (if changed):

1. Add one new $10K/month recurring client
   Score Impact: +6 points (65 → 71)
   Why: Concentration decreases, recurring revenue increases
   Effort: Medium

2. Extend client contracts to 24 months (from monthly)
   Score Impact: +3 points (65 → 68)
   Why: Forward visibility improves
   Effort: Low

3. Build productized service generating $5K/month recurring
   Score Impact: +8 points (65 → 73)
   Why: Recurring revenue increases, labor dependence decreases
   Effort: High

4. Diversify into adjacent service line
   Score Impact: +2 points (65 → 67)
   Why: Concentration decreases
   Effort: Medium

Combined Impact (do all 4): +19 points → Score 84 (High Stability)
Timeline: 6-12 months
```

---

### Action Plan Section

```
Your Path to High Stability (75+ score):

Ranked by Impact-to-Effort Ratio:

PRIORITY 1: Extend Contracts (LOW EFFORT, MEDIUM IMPACT)
  Objective: Move from monthly to annual contracts
  Action: Contact 3 largest clients, propose annual agreements
  Expected Improvement: +3 points (current: 65, target: 68)
  Timeline: 1-2 months
  Why This Matters: Provides forward revenue visibility

PRIORITY 2: Add New Recurring Client (MEDIUM EFFORT, HIGH IMPACT)
  Objective: Add $8-12K/month recurring revenue
  Action: Identify & close one new retainer client
  Expected Improvement: +6 points (target: 74, approaching High)
  Timeline: 3-6 months
  Why This Matters: Reduces concentration, increases stability

PRIORITY 3: Productize Service (HIGH EFFORT, HIGH IMPACT)
  Objective: Create $5K/month recurring product or service
  Action: Design, build, and launch product
  Expected Improvement: +4 points (target: 78, High Stability)
  Timeline: 6-12 months
  Why This Matters: Creates passive income, reduces active work dependence

Combined Impact: 3 + 6 + 4 = +13 points → 78 (High Stability, A-Band)
```

---

### Peer Benchmarking Section

```
How You Compare:

Your Score: 65 (Established Stability)

vs. Consultants Nationally:
  Average Score: 58
  Your Position: Above average (+7 points)
  Your Percentile: 72nd (better than 72% of consultants)
  Your Status: Strong foundation, but not exceptional

vs. Solo Service Providers:
  Average Score: 55
  Your Position: Well above average (+10 points)
  Your Percentile: 78th (better than 78% of solo practitioners)
  Your Status: Strongest income group

vs. Freelancers/Contract Workers:
  Average Score: 52
  Your Position: Well above average (+13 points)
  Your Percentile: 82nd (better than 82% of freelancers)
  Your Status: Exceptionally stable
```

---

## Immutability Guarantee

### Once Created, Report Is Locked

```
Report Created: June 2, 2025 at 2:30 PM UTC
  Score: 65
  Band: Established Stability
  Model: RP-2.0
  
Today (June 2, 2025): Report shows score 65
In 1 year (June 2, 2026): Same report still shows score 65
In 5 years (June 2, 2030): Same report still shows score 65

Even if:
  • Model improves (RP-2.1 released)
  • Scoring changes
  • Your income changes
  
Original report NEVER changes. It's a historical record.
```

---

### What Can Change

**You CAN create a new assessment** (new report with same or updated inputs):

```
Original Assessment (June 2, 2025): Score 65
New Assessment (Dec 2, 2025): Score 71 (you added new client)

Both reports coexist:
  • First report: Immutable historical record (score 65)
  • Second report: Current status (score 71)
  • Shows progress over time
```

**You CANNOT modify existing report**:
```
❌ Change June report's score
❌ Update June report's narrative
❌ Remove June report findings
❌ Rerun June report through new model version
```

---

## Verification Standard

### Three-Part Verification

Every report can be verified through:

**Part 1: Assessment ID Lookup**
```
Query: /api/verify?id=550e8400-e29b-41d4-a716-446655440000
Response: {
  assessment_id: "550e8400-e29b-41d4-a716-446655440000",
  model_version: "RP-2.0",
  final_score: 65,
  stability_band: "Established",
  created_at: "2025-06-02T14:30:00Z"
}
```

**Part 2: Authorization Code Check**
```
Query: /api/verify?id=[id]&code=[auth_code]
  (Authorization code validates that requester has legitimate access)
Response: Full report details
```

**Part 3: Hash Verification** (advanced)
```
Retrieve hashes from report:
  • input_hash = SHA256(questions + profile)
  • output_hash = SHA256(score + band + factors)
  • model_hash = SHA256(RP-2.0 source code)
  • record_hash = SHA256(inputs + outputs)
  
Independently verify:
  1. Recompute input_hash from questions → matches? ✅
  2. Recompute model_hash from RP-2.0 code → matches? ✅
  3. Recompute output_hash from score/band → matches? ✅
  4. Recompute record_hash from all data → matches? ✅
  
If all hashes match: Report is authentic and unmodified
If any hash differs: Report has been tampered with (impossible under this system)
```

---

## Report Retention & Archival

### Retention Schedule

```
Report Created: 2025-06-02

Access Policy:
  Years 1-2:        Full access, full details
  Years 2-5:        Full access, full details
  Years 5-10:       Read-only (archive)
  After 10 years:   Legal hold (if required)
```

### Archival Use Cases

**Advisor Reviewing Past Assessment**:
```
2026: Advisor wants to see client's June 2025 assessment
  → Report still available, displays exactly as created
  → Can create new RP-2.1 assessment for updated analysis
  → Can compare old vs. new side-by-side
```

**Compliance Audit**:
```
2027: Compliance auditor reviews assessment integrity
  → Retrieves June 2025 report
  → Verifies hash integrity
  → Confirms model version & output haven't changed
  → Uses as evidence of proper record-keeping
```

---

## Required Report Fields (Checklist)

Every report must include:

### Metadata Section
- [ ] Assessment ID (UUID)
- [ ] Assessment date & time (ISO8601)
- [ ] Model version (RP-2.0, RP-2.1, etc.)
- [ ] Model build ID (git commit)
- [ ] Output version (1.0, 1.1, etc.)
- [ ] Verification URL

### Score Section
- [ ] Final score (0-100)
- [ ] Stability band (Limited/Developing/Established/High)
- [ ] Sub-band (A/B/C/D)
- [ ] Band interpretation (2-3 sentence narrative)

### Breakdown Section
- [ ] 6 factor scores (income persistence, diversity, visibility, concentration, labor, variability)
- [ ] Adjustments (quality, fragility)
- [ ] Calculation transparency (show math)

### Analysis Section
- [ ] Primary constraint (what limits score?)
- [ ] Income composition breakdown
- [ ] Risk scenarios (recession, illness, loss of major client)
- [ ] Sensitivity analysis (what changes score most?)
- [ ] Action plan (ranked by impact/effort)

### Context Section
- [ ] Peer benchmarking (percentile vs. comparable group)
- [ ] Reassessment recommendation (when to update)
- [ ] Advisor discussion guide (talking points)

### Verification Section
- [ ] Input hash (proves inputs unchanged)
- [ ] Output hash (proves score unchanged)
- [ ] Model hash (proves model version accurate)
- [ ] Record hash (proves integrity)

---

## Advisor Use & Interpretation

### What Advisors Should Say

✅ **OK to say**:
- "You scored 65, which is Established Stability"
- "Your score reflects your income structure"
- "The biggest risk is concentration in one client"
- "Here's what could improve your score"
- "Let's review this again in 6 months to see progress"

❌ **NOT OK to say**:
- "This score predicts your future income" (diagnostic, not predictive)
- "This means you're approved for a loan" (not underwriting)
- "This is like a credit score" (different purpose)
- "You're guaranteed stable income" (risk scenarios show what could break)
- "This is financial advice" (it's analysis, not advice)

---

## Test Cases for Report Validation

Before releasing any report, validate against test cases:

### Test Case 1: Determinism
```
Input: q1=A, q2=C, q3=B, q4=D, q5=D, q6=A
Expected Score: 58 (always)
Validation: Run 3x, compare output
Pass: All 3 runs = 58 ✅
Fail: Any variance ❌
```

### Test Case 2: Band Boundary
```
Input for score 50: Expected band = Developing (D)
Input for score 51: Expected band = Established (A)
Validation: Check band assignment
Pass: Correct bands ✅
Fail: Wrong bands ❌
```

### Test Case 3: Constraint Detection
```
Input with 80% from one source: Expected primary constraint = "Income Concentration"
Validation: Check constraint label
Pass: Correct constraint ✅
Fail: Wrong constraint ❌
```

### Test Case 4: Report Completeness
```
Validation: Report includes all required fields
  ✅ Metadata section
  ✅ Score section
  ✅ Breakdown section
  ✅ Analysis section
  ✅ Context section
  ✅ Verification section
Pass: All sections present ✅
Fail: Missing section ❌
```

---

## Report Standard Evolution

**This standard applies to all RP-2.0+ reports.**

When RP-2.1 released:
- RP-2.0 reports unchanged (immutable)
- RP-2.1 reports may have new fields (extended input analysis, improved confidence intervals)
- Both versions coexist

When RP-3.0 released:
- RP-2.0 and RP-2.1 reports unchanged
- RP-3.0 reports may have predictive elements (if validated)
- All versions verifiable & archival-ready

---

**This document is the source of truth for assessment report standards.**

Key principle: **Reports are institutional records. Once created, they are immutable, verifiable, and permanent.**
