# RunPayway™ Diagnostic Quick Reference

**TL;DR:** Same core outputs, three audience-specific presentations.

---

## THE 6 QUESTIONS (All Audiences)

| Q | Concept | Individual Framing | Advisor Framing |
|---|---------|-------------------|-----------------|
| 1 | Recurring Revenue | "% that renews automatically?" | "% renews without re-earning?" |
| 2 | Concentration | "How spread out across sources?" | "% from largest source?" |
| 3 | Diversity | "How many sources 10%+?" | "Distinct meaningful sources?" |
| 4 | Forward Revenue | "Months locked in contracts?" | "% of upcoming income secured?" |
| 5 | Consistency | "Monthly fluctuation range?" | "Variable month-to-month?" |
| 6 | Labor Independence | "% without active work?" | "% continues if can't work?" |

---

## ANSWER → SCORE PIPELINE

```
Q Answer (A–E) 
  ↓
Canonical Input (numeric, e.g., 20% persistence, 80% concentration)
  ↓
Factor Score (0–15 or 0–10 or 0–20 points)
  ↓
Subtotal (Structure 0–50 + Stability 0–40)
  ↓
Adjustments (Quality +0–10, Interactions ±4–5, Fragility -0–25)
  ↓
Overall Score (0–100)
  ↓
Stability Band (Limited → Developing → Established → High)
```

---

## THE CORE OUTPUTS (Identical for All Reports)

```
• Overall Score (0–100)
• Stability Band (Limited/Developing/Established/High)
• 6 Canonical Inputs (persistence, concentration, diversity, forward, variability, labor)
• Fragility Score & Class
• Risk Scenarios (6 templates, score impacts)
• Constraint Flags (active/inactive)
• Primary Constraint Ranking
```

**These NEVER vary by audience.**

---

## THE THREE REPORTS (Different Presentations)

### Individual Report
- **Length:** 8–12 pages (PDF)
- **Tone:** Educational, empowering, personal
- **Opening:** One-sentence diagnostic ("What this means for you")
- **Main Content:** 6 factors explained in plain English
- **Risk:** "What if?" scenarios with mitigation
- **Action:** 12–18 month roadmap with phases
- **Why:** Self-understanding + emotional clarity

### Advisor Report
- **Length:** 4–6 pages (PDF + JSON data export)
- **Tone:** Operational, clinical, discussion-focused
- **Opening:** Executive summary (score + band + primary risk)
- **Main Content:** Raw factor scores + peer percentiles
- **Risk:** Scenarios ranked by likelihood; band-shift focus
- **Action:** Conversation levers ("what could improve this 10 pts?")
- **Why:** Communication utility + workflow speed

### Organization Report
- **Length:** 2–3 pages summary (Structured data: JSON/CSV)
- **Tone:** Procedural, comparative, governance-focused
- **Opening:** Assessment header + cohort classifiers
- **Main Content:** Deterministic lookup tables, constraint flags
- **Risk:** Scenarios + cohort frequency (% experiencing this)
- **Action:** Governance status (RED/YELLOW/GREEN) + target metrics
- **Why:** Standardization + comparability + governance

---

## QUICK FACT SHEET

### Score Bands
| Range | Band | Meaning |
|-------|------|---------|
| 0–29 | Limited Stability™ | At-risk, unstable |
| 30–49 | Developing Stability™ | Building foundation |
| 50–74 | Established Stability™ | Durable, sustainable |
| 75–100 | High Stability™ | Resilient, mature |

### Factor Scoring (What Helps)
- **Persistence:** High % auto-renewing income (+15 pts max)
- **Diversity:** Multiple meaningful sources (+10 pts max)
- **Forward:** Months of locked-in revenue (+15 pts max)
- **Concentration:** Low % from largest source (+10 pts max, inverse)
- **Labor:** Income without active work (+20 pts max, inverse)
- **Variability:** Consistent month-to-month earnings (+10 pts max)

### Main Risk Signals
- **Concentration ≥ 70%** → Single-source failure (worst scenario)
- **Forward ≤ 10%** → No visibility beyond 30 days
- **Persistence ≤ 25%** → Requires continuous re-earning
- **Labor ≥ 80%** → Zero income if can't work
- **Variability = extreme** → Earnings all over the place
- **Continuity < 1 month** → Can't sustain 30 days

---

## WHEN TO USE WHICH REPORT

| Need | Use This | Why |
|------|----------|-----|
| Client self-understanding | Individual | Explains what score means, roadmap for improvement |
| Advisor prep for meeting | Advisor | Talking points, score impacts, conversation starters |
| Portfolio risk classification | Organization | Governance flags, cohort comparison, trend tracking |
| Board/leadership reporting | Organization | Structured data, cohort analysis, risk percentiles |
| Compliance/audit | Organization | Deterministic scoring, execution hash, audit trail |

---

## IMPLEMENTATION TASKS

- [ ] **Advisor Report Template:** Use IMPLEMENTATION_GUIDE section 2.1–2.8
- [ ] **Organization Report Export:** JSON/CSV with governance fields (section 2.1–2.8)
- [ ] **Cohort Benchmarking:** Add percentiles by operating_structure + industry
- [ ] **Conversation Levers:** Implement "hidden unlock" detection (when constraints shift)
- [ ] **Governance Automation:** RED/YELLOW/GREEN status flagging
- [ ] **Audit Trail:** Timestamp, assessor, prior comparison, QA notes
- [ ] **Workflow Guides:** Advisor pre/during/post meeting checklists

---

## KEY DOCUMENTS

1. **DIAGNOSTIC_FLOW.md** — Complete process from intake → scoring → outputs
   - All 6 questions with exact answers
   - Q→A→Canonical→Score mappings
   - Scoring formulas and tables
   - Core outputs specification

2. **REPORT_EXAMPLES.md** — Side-by-side examples of same assessment in 3 formats
   - Sarah Chen (solo consultant) sample
   - Individual report excerpt
   - Advisor report excerpt
   - Organization report excerpt

3. **IMPLEMENTATION_GUIDE.md** — How to build ideal advisor & organization reports
   - Advisor report spec (each section)
   - Organization report spec (each section)
   - Operational workflows
   - Pitfalls to avoid

---

## ARCHITECTURE GOLDEN RULES

1. ✓ **Core outputs are deterministic.** Same inputs always produce same score/band.
2. ✓ **Presentation is customizable.** Same score told different ways for different audiences.
3. ✓ **Never duplicate narrative.** Individual explains why, Advisor shows what to do, Org captures governance.
4. ✓ **Percentiles provide context.** Always include "how does this compare to peer group?"
5. ✓ **Actions are tied to score impact.** "+3 pts if you extend contracts from 4 → 6 months"
6. ✓ **Constraints are ranked by severity.** Primary constraint is the #1 limiting factor.
7. ✓ **Scenarios are concrete.** "If largest client ends: score 61 → 40, drops to Developing Stability"

---

## ONE-PAGE SUMMARY FOR STAKEHOLDERS

**What You Now Have:**
- Complete diagnostic process flow (intake → 6 questions → scoring → 3 report types)
- Exact question wording for Individual and Advisor audiences
- Full scoring logic (answer → canonical → factor → subtotal → overall score)
- Three report templates optimized for different audiences:
  - Individual: Personal, educational (8–12 pages)
  - Advisor: Operational, discussion-focused (4–6 pages + JSON)
  - Organization: Procedural, governance-focused (structured data)

**What You Can Build Next:**
- Advisor Report generator (use IMPLEMENTATION_GUIDE)
- Organization Report export pipeline (JSON/CSV)
- Cohort benchmarking (percentiles by structure + industry)
- Governance automation (RED/YELLOW/GREEN flagging)
- Advisor workflows (pre/during/post meeting guides)

**Key Insight:**
Same core outputs, three audiences. The score is always identical; the story changes. Individual needs emotional clarity, Advisor needs operational insight, Organization needs governance data.

---

**Created:** May 18, 2026 | **Documentation Complete**
