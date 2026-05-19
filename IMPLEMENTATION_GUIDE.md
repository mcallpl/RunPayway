# RunPayway™ Report Implementation Guide

**For Building Ideal Advisor & Organization Report Versions**

---

## PHASE 0: ARCHITECTURE PRINCIPLES

### Non-Negotiable Rules

1. **Core outputs are deterministic and identical across all report types**
   - Overall score (0–100)
   - Stability band (Limited → Developing → Established → High)
   - The 6 canonical inputs (persistence, concentration, diversity, forward, variability, labor)
   - Risk scenarios and their impacts
   - Constraint flags

2. **Presentation layers are where customization happens**
   - Narrative style (educational vs. operational vs. procedural)
   - Depth of explanation (verbose vs. terse vs. structured)
   - Emphasis (what matters most for this audience)
   - Format (PDF narrative vs. operational notes vs. JSON/CSV)

3. **Never duplicate data; reference it**
   - Individual report explains "why this score matters"
   - Advisor report shows "what can change it"
   - Organization report captures "is it within tolerance?"

---

## PART 1: ADVISOR REPORT IMPLEMENTATION

### Design Brief

**Goal:** Give advisors what they need to assess client structure and plan interventions—fast.

**Format:** 4–6 page PDF + structured data fields

**Reading Time:** 5–8 minutes for experienced advisor

**Conversational Purpose:** Prep for client meeting + discussion roadmap

---

### Section 1.1: Executive Summary (½ page)

**Must include:**
- Score and band (e.g., "68 / Established Stability")
- Fragility class (brittle → resilient)
- Primary structural risk (1 sentence)
- Operational assessment (what does this client need?)
- Key conversation lever (what could improve score materially?)

**Example:**
```
Score: 61 / 100 | Band: Established Stability
Fragility: Supported (67/100)
Primary Risk: High concentration (80% from largest source)
Assessment: Stable recurring base with strong earnings 
            consistency; single-source failure risk is the 
            limiting factor.
Conversation Lever: Adding one mid-sized client (20K+/year) 
                    would improve score 8+ points and shift 
                    constraint hierarchy.
```

**Writing tips:**
- Use active voice ("concentration limits growth" not "there is concentration")
- Be specific about numbers (not "some concentration" but "80%")
- Lead with the actionable insight, not the diagnosis

---

### Section 1.2: Factor Breakdown (1 page, table format)

**Must include:**
- All 6 canonical inputs
- Raw score for each factor
- Benchmark (typical range for peer group)
- Assessment (one-liner: good/concern/critical?)

**Table format:**
```
Factor | Canonical | Score | Max | % | Peer Median | Assessment
───────────────────────────────────────────────────────────────
Q1 Recurring | 20% | 3/15 | 20% | 32% | Below median
Q2 Concentration | 80% | 2/10 | 20% | 62% | CRITICAL
Q3 Diversity | 2 | 3/10 | 30% | 3 | Below median
Q4 Forward | 33% | 5/15 | 33% | 41% | Slightly below
Q5 Variability | low | 10/10 | 100% | low | STRONG
Q6 Labor | 62% | 14/20 | 70% | 71% | Reasonable
```

**Why percentiles:** Advisors immediately understand "this client is below/above their peer group."

**Writing tips:**
- Use "CRITICAL" label for constraint triggers (>70% concentration, <10% forward, etc.)
- Use "STRONG" for outliers in the positive direction
- Peer median helps contextualize whether a factor is normal or unusual

---

### Section 1.3: Risk Scenarios (1 page)

**Must include:**
- All relevant scenarios (typically 4–5, not all 6)
- Original score → scenario score
- Band shift (YES/NO)
- Likelihood assessment

**Table format:**
```
Scenario | Original → Scenario | Drop | Band Shift | Likelihood
──────────────────────────────────────────────────────────────────
Largest source ends | 61 → 40 | -21 | YES | Medium
Labor interrupted | 61 → 53 | -8 | NO | Low
Forward delayed | 61 → 56 | -5 | NO | Low
Recurring degrades | 61 → 54 | -7 | NO | Medium
```

**Why this format:**
- Advisor scans left column to find the risk that matters
- Right column confirms whether client lands in a different stability band
- Likelihood helps prioritize ("what should we prepare for?")

**Writing tips:**
- Order by likelihood, not severity (most likely first)
- Include brief narrative for #1 risk only; others are self-explanatory
- Focus on "is this a band-shift risk?" (score drop >20–25 points)

---

### Section 1.4: Constraints Ranked (½ page)

**Must include:**
- All active constraints in priority order
- Trigger condition (what makes it active?)
- Operational impact
- Discussion question

**Format:**
```
1. HIGH CONCENTRATION (80% from largest)
   Trigger: largest_source_pct ≥ 70%
   Impact: Single-source failure → drop 21 pts to Developing Stability
   Discussion: Contract renewal terms? Client financial health?
   Action: Add 1 mid-sized client to reach <70%

2. LOW PERSISTENCE (20% auto-renews)
   Trigger: income_persistence_pct ≤ 30%
   Impact: Requires continuous sales; no revenue floor
   Discussion: Can largest client convert 40% to retainer?
   Action: Move 30% of largest client to recurring model

3. MINIMAL DIVERSITY (2 sources)
   Trigger: source_diversity_count ≤ 2
   Impact: Diversification benefit is zero; loss of any source is critical
   Discussion: Any cross-selling opportunity? Vertical expansion?
   Action: Acquire source #3 (independent market)
```

**Why this format:**
- Advisor reads top constraint; starts conversation there
- "Discussion" question gives specific talking points
- "Action" field links directly to improvement roadmap

**Writing tips:**
- Don't list inactive constraints (clutter)
- Discussion questions should be answerable in 1–2 minutes
- Actions should be achievable within 6–12 months

---

### Section 1.5: Conversation Levers (½ page)

**Must include:**
- Quick wins (can implement immediately)
- Transformational moves (6–12 month projects)
- Hidden unlocks (when constraint hierarchy shifts)

**Format:**
```
QUICK WIN 1: Extend Forward Visibility (Low Effort)
  Current: 33% (4 months)
  Target: 50% (6 months)
  Method: Propose 6-month minimum on all contracts
  Score Impact: +3 pts (61 → 64)
  Timeline: Immediate (next contract)
  Discussion: "Can we extend your typical contract from 4 → 6 months?"

QUICK WIN 2: Retainer Conversion (Medium Effort)
  Current: 20% recurring
  Target: 35% recurring
  Method: 50/50 split on largest client (half retainer, half project)
  Score Impact: +2 pts (61 → 63)
  Timeline: 1–2 months
  Discussion: "What if we locked in baseline work at [retainer rate]?"

TRANSFORMATIONAL: Client Diversification (High Effort)
  Current: 80% from largest; 2 sources
  Target: 60% from largest; 3+ sources
  Method: Add 1 mid-sized client ($20K–30K/year)
  Score Impact: +8 pts (61 → 69)
  Timeline: 3–6 months to acquire; 6 months to stabilize
  Discussion: "Who are your top 3 ideal new clients?"

HIDDEN UNLOCK: Constraint Hierarchy Shift at 50% Concentration
  If concentration drops below 50%:
    Primary Constraint Changes: Persistence (recurring revenue)
    Secondary Constraint: Forward Visibility
    Implication: Action priorities shift from "get another client"
                 to "build recurring foundation"
  Why it matters: After diversification, the focus should change.
                  Client should understand this inflection point.
```

**Why this format:**
- "Quick Wins" show immediate progress (builds confidence)
- "Transformational" sets realistic long-term expectation
- "Hidden Unlock" shows advisor when to pivot the conversation

**Writing tips:**
- Lead with score impact (numbers motivate action)
- Include specific discussion questions (advisor can use directly)
- Timeline is critical (realistic expectations)

---

### Section 1.6: Actions for Discussion (½ page)

**Must include:**
- 3–5 specific recommended actions
- Why now (what makes each action timely?)
- Expected effect (what changes if client does this?)

**Format:**
```
ACTION 1: CONCENTRATION REDUCTION STRATEGY (Priority 1)
  Description: Systematically reduce reliance on largest client
  Why Now: 80% concentration is the primary limiting factor; 
           every month of delay increases replacement risk
  Expected Effect: Concentration 80% → 60% (5–8 pts improvement)
  Discussion Topics:
    • Largest client relationship stability (contract term? renewal risk?)
    • BD timeline (6, 12, or 18 months to diversify?)
    • Ideal client profiles (who are top prospects?)
    • Approach (inbound referrals vs. outbound prospecting?)

ACTION 2: FORWARD REVENUE LOCKING (Priority 2)
  Description: Move from 4-month to 6+ month contracts
  Why Now: Forward visibility is secondary constraint; locking
           terms now provides stability while pursuing diversification
  Expected Effect: Forward visibility 33% → 50% (3 pts improvement)
  Discussion Topics:
    • Existing clients: Who can extend terms?
    • New contracts: Can 6 months become default minimum?
    • Pricing: Do longer terms require discounts?
    • Risks: What's cancellation policy?

ACTION 3: RECURRING REVENUE ARCHITECTURE (Priority 3)
  Description: Convert projects to 50/50 project + retainer mix
  Why Now: Persistence is second-order constraint; once 
           concentration and forward visibility improve, this becomes priority
  Expected Effect: Persistence 20% → 35% (2 pts improvement)
  Discussion Topics:
    • Which clients are retainer-suitable?
    • Retainer sizing (hours, scope, pricing)?
    • What's included vs. excluded?
    • How do you bundle this with projects?
```

**Why this format:**
- "Why Now" justifies the priority and urgency
- "Expected Effect" ties to score improvement
- "Discussion Topics" gives advisor 3–4 conversation starters

---

### Section 1.7: Reassessment & Monitoring (½ page)

**Must include:**
- Standard cadence (quarterly, etc.)
- Urgent triggers (what changes require immediate reassessment?)
- Post-action checkpoints (when to verify impact)

**Format:**
```
STANDARD CADENCE: Quarterly (every 90 days)

Routine checkpoints:
  • Has client composition changed?
  • Any new major clients or loss of revenue?
  • Contract terms extended or shortened?
  • Recurring revenue increased?

URGENT REASSESSMENT TRIGGERS (Don't wait for quarterly):
  • Largest client signals non-renewal (IMMEDIATE)
  • Largest client reduces engagement >25% (within 1 week)
  • New major client acquired ($15K+/year) (within 30 days)
  • Contract restructuring materially changes revenue (within 30 days)

POST-ACTION REASSESSMENT:
  • After acquiring new major client: Reassess to confirm impact
  • After retainer conversion: Reassess after 3 months of stability
  • After contract restructuring: Reassess in 60 days

Next Scheduled: [Date 90 days from issue date]
```

---

### Section 1.8: Data Fields for Operations

**Export as structured data** (JSON/CSV) alongside narrative:

```json
{
  "assessment_id": "RPW-2024-847",
  "client_id": "CLIENT-847",
  "assessment_date": "2024-01-15",
  "operating_structure": "solo_service",
  "primary_income_model": "project_fee",
  "industry_sector": "consulting_professional_services",
  
  "overall_score": 61,
  "primary_band": "Established Stability",
  "fragility_class": "supported",
  
  "canonical_inputs": {
    "income_persistence_pct": 20,
    "largest_source_pct": 80,
    "source_diversity_count": 2,
    "forward_secured_pct": 33,
    "income_variability_level": "low",
    "labor_dependence_pct": 62
  },
  
  "active_constraints": ["high_concentration"],
  "constraint_severity": {
    "high_concentration": "high",
    "low_persistence": "medium",
    "minimal_diversity": "medium",
    "forward_visibility": "low"
  },
  
  "risk_scenarios": [
    {
      "scenario_id": "RS-01",
      "label": "Largest source ends",
      "score_drop": 21,
      "band_shift": true,
      "likelihood": "medium"
    }
  ],
  
  "recommended_actions": [
    {
      "rank": 1,
      "action_id": "CONC-RED",
      "label": "Concentration Reduction",
      "expected_effect": "80% → 60% (5–8 pts)"
    }
  ]
}
```

**Why structured data:**
- Advisors can import into their CRM
- Enables workflow automation (flagging, alerts, progress tracking)
- Supports comparative analysis (how does this client compare to portfolio?)

---

## PART 2: ORGANIZATION REPORT IMPLEMENTATION

### Design Brief

**Goal:** Enable organizations to run diagnostics at scale, compare cohorts, and flag governance thresholds.

**Format:** Structured data (JSON/CSV) + governance summary

**Reading Time:** 2–3 minutes for decision (data scanning)

**Operational Purpose:** Risk classification, comparative benchmarking, trend tracking

---

### Section 2.1: Assessment Header (Machine + Human Readable)

**Must include:**
```json
{
  "assessment_id": "RPW-2024-TEST-847",
  "assessment_date": "2024-01-15T00:00:00Z",
  "client_id": "CLIENT-0847",
  "assessor": "System | [Advisor Name]",
  "profile_class": "individual",
  "operating_structure": "solo_service",
  "primary_income_model": "project_fee",
  "revenue_structure": "hybrid",
  "industry_sector": "consulting_professional_services",
  "maturity_stage": "developing",
  "years_in_structure": "3-5"
}
```

**Why this format:**
- Machine-readable for database ingestion
- Establishes cohort (operating_structure + industry_sector)
- Enables comparative queries ("all solo consultants in consulting_prof_services")

---

### Section 2.2: Normalized Answers (Question → Canonical)

**Must include:**
```csv
Question,Answer,Canonical_Field,Value,Unit
Q1_Recurring_Revenue_Base,B,income_persistence_pct,20,%
Q2_Income_Concentration,B,largest_source_pct,80,%
Q3_Income_Source_Diversity,B,source_diversity_count,2,count
Q4_Forward_Revenue_Visibility,C,forward_secured_pct,33,%
Q5_Earnings_Variability,D,income_variability_level,low,level
Q6_Labor_Independence,C,labor_dependence_pct,62,%
```

**Why this format:**
- Explicit mapping (question → normalized value)
- Auditable (can reconstruct logic if needed)
- Compatible with spreadsheets and databases

---

### Section 2.3: Deterministic Scoring (Lookup Tables)

**Must include:**
```csv
Factor,Canonical_Value,Score_Range,Points_Awarded,Max_Points,Percentage
Income_Persistence,20%,11-20%,3,15,20%
Source_Diversity,2,2,3,10,30%
Forward_Security,33%,16-30%,5,15,33%
Concentration_Resilience,80%,66-80%,2,10,20%
Labor_Dependence,62%,51-65%,10,20,50%
Variability,low,--,10,10,100%
Continuity_Months,1.5,1.0-1.9,2,10,20%

Structure_Subtotal,--,--,13,50,26%
Stability_Subtotal,--,--,22,40,55%
Raw_Total,--,--,35,90,39%
Quality_Adjustment,--,--,+5,10,50%
Interaction_Penalties,--,--,-4,-12,33%
Fragility_Impact,--,--,-3,--,--
Overall_Score,--,--,61,100,61%
```

**Why this format:**
- Governance teams can audit the math
- Reproducible (same inputs → same scores)
- No subjective interpretation

---

### Section 2.4: Band Assignment & Flags

**Must include:**
```json
{
  "overall_score": 61,
  "primary_band": "Established Stability",
  "band_range": [50, 74],
  "warning_overlays": ["Concentration Risk"],
  "sub_band": "Established Stability / Concentration Risk",
  
  "constraint_flags": {
    "weak_forward_visibility": false,
    "high_concentration": true,
    "low_persistence": false,
    "high_labor_dependence": false,
    "high_variability": false,
    "weak_durability": false,
    "shallow_continuity": false
  },
  
  "governance_status": "GREEN",
  "governance_action": "Tier 2 Engagement (proactive monitoring)",
  "escalation_trigger": "If concentration > 85% OR largest client signals non-renewal"
}
```

**Why this format:**
- Governance teams can filter by status (RED/YELLOW/GREEN)
- Constraint flags enable rule-based alerts
- Escalation triggers automate follow-up

---

### Section 2.5: Cohort Positioning (Benchmarking)

**Must include:**
```csv
Factor,Client_Value,Cohort_Median,Client_Percentile,Assessment
Income_Persistence,20%,32%,28th,Below median
Largest_Source_Concentration,80%,62%,72nd,More concentrated
Source_Diversity,2,3,35th,Below median
Forward_Visibility,33%,41%,42nd,Slightly below
Income_Variability,low,low,50th,At median (STRENGTH)
Labor_Dependence,62%,71%,38th,Less dependent (STRENGTH)

Overall_Score,61,61,50th,At cohort median
Fragility_Class,supported,supported,50th,At cohort median
```

**Why percentiles:**
- Decision-maker immediately understands "is this normal or unusual?"
- 28th percentile on persistence = "below 72% of peer group"
- 72nd percentile on concentration = "worse than 72% of peer group"

---

### Section 2.6: Risk Scenario Outcomes (Cohort Context)

**Must include:**
```csv
Scenario_ID,Scenario_Label,Client_Score,Scenario_Score,Drop,Band_Shift,Cohort_Frequency_%
RS-01,Largest source ends,61,40,-21,YES,45%
RS-02,Labor interrupted,61,53,-8,NO,30%
RS-03,Forward delayed,61,56,-5,NO,25%
RS-04,Recurring degrades,61,54,-7,NO,38%
RS-05,Volatility spike,61,57,-4,NO,15%
```

**Why cohort frequency:**
- "45% of solo consultants experience major client loss in 3–5 years"
- Decision-maker understands if this client is at typical or exceptional risk
- Frequency >40% = red-flag scenario; <15% = unlikely but possible

---

### Section 2.7: Governance Thresholds & Actions

**Must include:**
```json
{
  "governance_thresholds": {
    "red": {
      "score_below": 30,
      "condition": "Limited Stability band",
      "action": "Immediate intervention; client at acute risk"
    },
    "yellow": {
      "active_constraints": 2,
      "condition": "Multiple constraints active (concentration + persistence, etc.)",
      "action": "Quarterly monitoring; proactive plan required"
    },
    "green": {
      "score_range": [50, 100],
      "condition": "Established or High Stability",
      "action": "Standard annual review"
    }
  },
  
  "target_metrics_next_reassessment": {
    "concentration_target": "<70%",
    "persistence_target": "30%+",
    "diversity_target": "3+ sources",
    "forward_visibility_target": "6+ months"
  },
  
  "reassessment_schedule": "Quarterly (every 90 days)",
  "urgent_triggers": [
    "Largest client signals non-renewal (within 1 week)",
    "Engagement drops >25% (within 1 week)",
    "New major client acquired >$15K (within 30 days)"
  ]
}
```

**Why this format:**
- Governance teams have clear thresholds (automated alerting possible)
- Target metrics give clear "what success looks like"
- Reassessment schedule ensures continuity

---

### Section 2.8: Reproducibility & Audit Trail

**Must include:**
```json
{
  "model_versions": {
    "core_model": "RP-2.0",
    "factor_set": "F-2.0",
    "scenario_set": "S-2.0",
    "benchmark_set": "B-2.0"
  },
  
  "execution_integrity": {
    "execution_hash": "8f3a4c2e9b1d5f7a6e2c4b9d1a3f5e8c",
    "hash_input": "normalized_inputs + profile_context",
    "hash_purpose": "Verify reproducibility: same inputs → same hash"
  },
  
  "audit_trail": {
    "assessment_date": "2024-01-15T14:23:47Z",
    "assessor": "System",
    "prior_assessment_id": null,
    "changes_from_prior": null,
    "qa_passed": true,
    "qa_notes": "All validations passed; inputs within expected ranges"
  }
}
```

**Why this format:**
- Compliance teams can audit decisions (hash proves determinism)
- Comparison to prior assessment is explicit (change tracking)
- Reproducibility is verifiable

---

## PART 3: REPORT SELECTION MATRIX

When to use each report:

| Audience | Format | Depth | Use Case |
|----------|--------|-------|----------|
| **Individual** | PDF narrative | Deep (8–12 pages) | Client self-understanding; advisory prep |
| **Advisor** | PDF narrative + JSON | Medium (4–6 pages) | Pre-meeting prep; conversation guide |
| **Organization** | Structured data (JSON/CSV) | Shallow (2–3 pages summary) | Cohort analysis; governance flagging |

---

## PART 4: IMPLEMENTATION CHECKLIST

### For Advisor Report
- [ ] Executive summary is 5 lines or less
- [ ] Factor breakdown includes peer percentiles
- [ ] Risk scenarios ranked by likelihood (not severity)
- [ ] Constraints section lists "Discussion" and "Action" fields
- [ ] Conversation Levers include score impact and timeline
- [ ] Actions section gives specific talking points
- [ ] Reassessment triggers are clear and actionable
- [ ] JSON export includes all deterministic data

### For Organization Report
- [ ] Assessment header includes cohort classifiers (structure + industry)
- [ ] Questions explicitly map to canonical inputs
- [ ] Scoring is 100% deterministic lookup tables
- [ ] Constraint flags are binary (active/inactive)
- [ ] Cohort percentiles are included for all factors
- [ ] Risk scenarios include cohort frequency
- [ ] Governance status is clearly labeled (RED/YELLOW/GREEN)
- [ ] Execution hash enables reproducibility verification
- [ ] CSV/JSON export is database-ready

---

## PART 5: OPERATIONAL WORKFLOWS

### Advisor Workflow

1. **Before Client Meeting** (10 minutes)
   - Open Advisor Report
   - Read Executive Summary
   - Scan Factor Breakdown (identify outliers)
   - Review Top Constraint
   - Note Conversation Levers (talking points)

2. **During Client Meeting** (45–60 minutes)
   - Confirm profile classification (structure, model, industry)
   - Walk through 6 factors (use plain-English explanations)
   - Discuss primary risk scenario (largest drop)
   - Reference "Hidden Unlock" when relevant
   - Propose actions from "Recommended Actions" section

3. **After Meeting** (10 minutes)
   - Document which actions client commits to
   - Set reassessment date
   - Flag urgent triggers for monitoring
   - Enter action tracking in CRM

---

### Organization Workflow

1. **Intake Batch** (daily/weekly)
   - New assessments arrive in standardized JSON
   - Governance script flags RED/YELLOW status automatically
   - RED clients go into escalation queue
   - YELLOW clients added to quarterly review list

2. **Quarterly Cohort Analysis** (monthly)
   - Pull all assessments from past quarter
   - Aggregate by operating_structure + industry_sector
   - Calculate percentiles and identify patterns
   - Generate cohort report (median score, constraint frequency, etc.)
   - Identify outliers (clients at unusual risk levels)

3. **Reassessment Scheduling** (ongoing)
   - System checks reassessment_date weekly
   - Urgent triggers activate immediate reassessment
   - Reassessment data compared to prior assessment
   - Change tracking highlights score movements

---

## PART 6: COMMON PITFALLS TO AVOID

### Don't:
- ❌ Include inactive constraints (clutter, confusion)
- ❌ Use jargon in Advisor report (use plain language)
- ❌ Copy narrative from Individual report into Advisor report (different audiences)
- ❌ Round percentiles (63.7% is not the same as "about 64%")
- ❌ Hide score impacts in explanations (lead with +3 pts)
- ❌ Omit cohort context (advisors need benchmarks to calibrate)
- ❌ Change core outputs by report type (always identical scores)

### Do:
- ✓ Keep advisor report to 4–6 pages (scannable)
- ✓ Use tables and percentiles (visual scanning)
- ✓ Include action discussion questions (conversation starters)
- ✓ Highlight "why now" for each action (justifies priority)
- ✓ Link score impact to action (motivation)
- ✓ Include cohort percentiles (context)
- ✓ Export structured data alongside narrative (operational workflows)
- ✓ Timestamp all assessments (audit trail)

---

**End of Implementation Guide**
