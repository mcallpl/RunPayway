# RunPayway™ — Intellectual Property Registry

**Document Classification:** Internal — Confidential
**Prepared for:** PeopleStar Enterprises, LLC
**Model Version:** RP-2.0
**Last Updated:** April 2, 2026
**Document Version:** 1.0

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Model Specifications](#2-model-specifications)
3. [Scoring Methodology](#3-scoring-methodology)
4. [Industry-Specific Integration](#4-industry-specific-integration)
5. [System Integrity & Data Validation](#5-system-integrity--data-validation)
6. [Recommendations & Future Enhancements](#6-recommendations--future-enhancements)
7. [Intellectual Property](#7-intellectual-property)
8. [Miscellaneous](#8-miscellaneous)

---

## 1. Product Overview

### 1.1 Purpose

RunPayway™ is a deterministic structural income diagnostic platform that evaluates the stability and resilience of income structures for independent professionals, freelancers, contractors, consultants, business owners, and anyone whose income does not arrive in a fixed paycheck.

The platform measures how income is **built** — not how much is earned — and quantifies how that structure holds up when conditions change. It is the first standardized measurement system for income stability, creating an entirely new category in financial assessment.

### 1.2 Income Stability Score™

The Income Stability Score™ is a standardized metric ranging from 0 to 100 that classifies income stability into four bands:

| Band | Score Range | Description |
|------|-----------|-------------|
| **Limited Stability** | 0–29 | Income structure needs attention. High vulnerability to disruption. |
| **Developing Stability** | 30–49 | Building toward stability, but not structurally protected yet. |
| **Established Stability** | 50–74 | Solid foundation with identifiable gaps to address. |
| **High Stability** | 75–100 | Income is structurally sound and resilient under pressure. |

### 1.3 Key Features

**Deterministic Scoring**
Identical inputs always produce identical results. The scoring engine is a 20-stage pure-function pipeline with no side effects, no randomness (except UUID generation for record identity), and no subjective adjustments. Every scoring rule is published. Every weight is fixed.

**Industry-Specific Benchmarks**
Peer benchmarks for 19 industry sectors with average scores, top-20% thresholds, and band distribution percentages. Users see where they stand relative to professionals in their specific industry.

**Cross-Factor Interaction Rules**
The model captures how structural weaknesses compound. Eight penalty rules and two bonus rules adjust the overall score based on factor combinations that create or mitigate systemic risk.

**Command Center & PressureMap™**
Interactive tools for visualizing income stability structure, running what-if simulations, testing stress scenarios, and tracking a 12-week execution roadmap.

**Open Model Architecture**
Every scoring rule, weight, threshold, and band classification is published and version-locked. Users can verify that the same inputs produce the same score at any time. The model version (RP-2.0) is included in every assessment record with SHA-256 integrity hashes.

### 1.4 Pricing Structure

| Tier | Price | Includes |
|------|-------|----------|
| **Income Stability Score™** | $0 (always free) | Score, band, primary constraint, highest-impact improvement, peer percentile |
| **RunPayway™ Diagnostic Report** | $69 (one-time) | Full diagnostic report, PressureMap™, Command Center, what-if simulator, 12-week roadmap, industry benchmarks |

---

## 2. Model Specifications

### 2.1 Model Version & Manifest

| Component | Version |
|-----------|---------|
| Model Version | RP-2.0 |
| Factor Version | F-2.0 |
| Scenario Version | S-2.0 |
| Benchmark Version | B-2.0 |
| Explanation Version | E-2.0 |
| Outcome Layer | OL-1.0 |

### 2.2 Engine Pipeline Architecture

The scoring system is a **20-engine pure-function pipeline**. Each engine receives validated, typed inputs and produces typed outputs. No engine has side effects. No engine accesses external data at runtime. The pipeline is entirely synchronous and completes in under 20ms.

| Engine | Name | Purpose |
|--------|------|---------|
| 01 | Input Validation | Validates raw inputs against Zod schemas |
| 02 | Profile Context Resolution | Maps operating structure + income model to archetype |
| 03 | Income Normalization | Converts A–E answers to canonical numeric values |
| 04 | Deterministic Scoring | Computes 7 factor scores via lookup tables |
| 05 | Band Classification | Assigns stability band + warning overlays |
| 06 | Structural Indicators | Normalizes factors to 0–100 scale for visualization |
| 07 | Cross-Factor Dependency | Evaluates 10 interaction rules (8 penalties, 2 bonuses) |
| 08 | Income Quality & Durability | Scores income quality from extended inputs |
| 09 | Constraint Hierarchy | Identifies primary structural weakness |
| 10 | Fragility Analysis | Computes fragility score and failure modes |
| 11 | Sensitivity Analysis | Measures marginal impact of improving each factor |
| 12 | Risk Scenarios | Runs 6 stress tests (source loss, labor interruption, etc.) |
| 13 | Score Lift Projections | Projects uplift from single and combined improvements |
| 14 | Diagnostic Confidence | Assesses input quality, contradictions, and sensitivity |
| 15 | Explainability | Generates natural language analysis across 13 dimensions |
| 16 | Benchmarking | Computes peer percentile and outlier dimensions |
| 17 | Action Prioritization | Produces ranked actions, roadmap, and script templates |
| 18 | Reassessment Triggers | Identifies conditions when reassessment becomes meaningful |
| 19 | Comparative Reassessment | Computes deltas between current and prior assessments |
| 20 | Integrity & Manifest | Generates SHA-256 hashes and model manifest |

### 2.3 Core Scoring System

The score is composed of two blocks:

**Structure Block (60 points maximum)**
Measures how income is built.

| Factor | Max Points | What It Measures |
|--------|-----------|------------------|
| Income Persistence | 15 | Income that continues without re-selling |
| Source Diversification | 10 | Number of independent income streams |
| Forward Security | 15 | Income secured ahead of time |
| Concentration Resilience | 10 | Reliance on any single source (inverted) |
| Quality Adjustment | 10 | Contract durability, cancellation risk, platform dependency |

**Stability Block (40 points maximum)**
Measures how income behaves under pressure.

| Factor | Max Points | What It Measures |
|--------|-----------|------------------|
| Labor Independence | 20 | Income that continues without active work |
| Variability | 10 | Earnings consistency over time |
| Continuity | 10 | Months of structural income runway |

**Cross-Factor Interactions (net adjustment clamped to [-12, +8])**
Applied after raw scoring to capture compound weaknesses and reinforcing strengths.

**Overall Score = Structure + Stability + Interactions, clamped to [0, 100]**

---

## 3. Scoring Methodology

### 3.1 Input Questions (Q1–Q6)

Users answer six questions, each with five choices (A through E). Answers map to canonical numeric values:

**Q1 — Recurring or Continuing Revenue Base** → `income_persistence_pct`

| Answer | Canonical Value | Meaning |
|--------|----------------|---------|
| A | 5% | Almost no recurring income |
| B | 20% | Small portion recurring |
| C | 45% | Moderate recurring base |
| D | 73% | Strong recurring base |
| E | 93% | Nearly all recurring |

**Q2 — Income Concentration** → `largest_source_pct`

| Answer | Canonical Value | Meaning |
|--------|----------------|---------|
| A | 95% | Nearly all from one source |
| B | 80% | Heavily concentrated |
| C | 60% | Moderately concentrated |
| D | 40% | Reasonably distributed |
| E | 15% | Well diversified |

**Q3 — Meaningful Income Source Diversity** → `source_diversity_count`

| Answer | Canonical Value | Meaning |
|--------|----------------|---------|
| A | 1 source | Single source |
| B | 2 sources | Limited diversity |
| C | 3 sources | Moderate diversity |
| D | 6 sources | Strong diversity |
| E | 8 sources | Highly diversified |

**Q4 — Forward Revenue Visibility** → `forward_secured_pct`

| Answer | Canonical Value | Meaning |
|--------|----------------|---------|
| A | 4% | Almost nothing secured |
| B | 12% | Small portion secured |
| C | 33% | One-third secured |
| D | 71% | Strong forward visibility |
| E | 100% | Fully secured ahead of time |

**Q5 — Earnings Variability** → `income_variability_level`

| Answer | Level | Numeric Value |
|--------|-------|---------------|
| A | Extreme | 88 |
| B | High | 63 |
| C | Moderate | 37 |
| D | Low | 17 |
| E | Low | 5 |

**Q6 — Income Continuity Without Active Labor** → `labor_dependence_pct`

| Answer | Canonical Value | Meaning |
|--------|----------------|---------|
| A | 100% | Fully labor-dependent |
| B | 87% | Heavily labor-dependent |
| C | 62% | Moderately dependent |
| D | 37% | Some independence |
| E | 12% | Mostly labor-independent |

### 3.2 Factor Scoring Lookup Tables

Each canonical value is converted to factor points via deterministic lookup tables:

**Income Persistence (0–15 points)**

| Range | Points |
|-------|--------|
| 0–10% | 1 |
| 11–20% | 3 |
| 21–35% | 5 |
| 36–50% | 8 |
| 51–65% | 11 |
| 66–80% | 13 |
| 81–100% | 15 |

**Source Diversity (0–10 points)**

| Count | Points |
|-------|--------|
| 1 | 1 |
| 2 | 3 |
| 3 | 5 |
| 4 | 7 |
| 5 | 8 |
| 6+ | 10 |

**Forward Security (0–15 points)**

| Range | Points |
|-------|--------|
| 0–5% | 0 |
| 6–15% | 2 |
| 16–30% | 5 |
| 31–45% | 8 |
| 46–60% | 11 |
| 61–75% | 13 |
| 76–100% | 15 |

**Concentration Resilience (0–10 points)**

| Range (largest_source_pct) | Points |
|----------------------------|--------|
| 0–20% | 10 |
| 21–35% | 8 |
| 36–50% | 6 |
| 51–65% | 4 |
| 66–80% | 2 |
| 81–100% | 0 |

**Labor Independence (0–20 points)**

| Range (labor_dependence_pct) | Points |
|------------------------------|--------|
| 0–20% | 20 |
| 21–35% | 17 |
| 36–50% | 14 |
| 51–65% | 10 |
| 66–80% | 6 |
| 81–100% | 2 |

**Earnings Stability (0–10 points)**

| Level | Points |
|-------|--------|
| Low | 10 |
| Moderate | 7 |
| High | 3 |
| Extreme | 0 |

**Continuity Score (0–10 points)**

| Months | Points |
|--------|--------|
| 0–0.9 | 0 |
| 1.0–1.9 | 2 |
| 2.0–2.9 | 4 |
| 3.0–4.4 | 6 |
| 4.5–6.0 | 8 |
| 6.01–12.0 | 10 |

### 3.3 Continuity Months Formula

```
continuity_months = (persistence × 0.03) + (forward × 0.04)
                  + ((100 - labor) × 0.02) - (largest × 0.015)

Clamped to [0, 12]
```

### 3.4 Cross-Factor Interaction Rules

**Penalty Rules**

| Code | Points | Condition | Description |
|------|--------|-----------|-------------|
| CF-01 | -5 | largest_source ≥ 70% AND forward_secured ≤ 20% | Concentration + weak visibility |
| CF-02 | -5 | labor_dependence ≥ 75% AND persistence ≤ 25% | Labor dependence + low persistence |
| CF-03 | -4 | source_diversity ≥ 4 AND largest_source ≥ 65% | Diverse sources but still concentrated |
| CF-04 | -5 | persistence ≥ 50% AND cancellation_risk = high | Persistent but cancellable |
| CF-05 | -4 | forward ≥ 40% AND booked_cancelable ≥ 50% | Forward revenue mostly cancelable |
| CF-06 | -4 | source_diversity ≤ 2 AND variability = extreme | Few sources + extreme swings |

**Bonus Rules**

| Code | Points | Condition | Description |
|------|--------|-----------|-------------|
| CF-B01 | +3 | forward_secured ≥ 45% AND largest_source ≤ 35% | Strong visibility + low concentration |
| CF-B02 | +4 | persistence ≥ 60% AND labor_dependence ≤ 35% | High persistence + low labor |

**Net Adjustment Clamp:** [-12, +8]
**Floor Rule:** Penalties cannot reduce score below 50% of pre-interaction baseline.

### 3.5 Score Distribution (Verified)

Full enumeration of all 15,625 possible input combinations (5^6) produces:

| Band | Count | Percentage |
|------|-------|-----------|
| Limited Stability (0–29) | 2,250 | 14.4% |
| Developing Stability (30–49) | 5,601 | 35.8% |
| Established Stability (50–74) | 6,653 | 42.6% |
| High Stability (75–100) | 1,121 | 7.2% |

95 unique score values produced across the 0–100 range.

### 3.6 Verified Edge Cases

| Test Case | Inputs | Score | Band | Fragility |
|-----------|--------|-------|------|-----------|
| All minimum | A,A,A,A,A,A | 5 | Limited | Brittle (0) |
| All maximum | E,E,E,E,E,E | 100 | High | Resilient (100) |
| All middle | C,C,C,C,C,C | 51 | Established | Resilient (100) |
| Boundary 29/30 | A,A,A,D,A,C | 30 | Developing | — |
| Boundary 49/50 | A,A,B,D,D,D | 50 | Established | — |
| Boundary 74/75 | A,D,D,E,D,E | 75 | High | — |

### 3.7 Fragility Assessment

Fragility is a **parallel evaluation** independent of the score. A user can have an Established score (structurally sound) but a thin fragility class (structurally brittle under specific shocks).

**Fragility Rules (base = 100, deductions only)**

| Trigger | Deduction | Condition |
|---------|-----------|-----------|
| Concentration risk | -25 | largest_source ≥ 70% |
| Labor dependence | -20 | labor_dependence ≥ 80% |
| No forward visibility | -20 | forward_secured ≤ 10% |
| High variability | -10 | variability = high |
| Extreme variability | -20 | variability = extreme |
| Minimal continuity | -15 | continuity_months < 1 |
| Fragile durability | -15 | durability_grade = fragile |

**Fragility Classification**

| Score Range | Class | Meaning |
|-------------|-------|---------|
| 0–24 | Brittle | One shock could collapse the structure |
| 25–44 | Thin | Limited structural protection |
| 45–64 | Uneven | Some protection but gaps remain |
| 65–79 | Supported | Reasonable structural cushion |
| 80–100 | Resilient | Strong structural protection |

**Failure Modes:** `concentration_collapse`, `labor_interruption`, `visibility_gap`, `durability_thinness`

---

## 4. Industry-Specific Integration

### 4.1 Outcome Layer (OL-1.0)

The Outcome Layer is a deterministic overlay that enriches the core assessment with industry-specific and income-model-specific context. It **never modifies** the Layer 1 core score — it only adds contextual fields.

### 4.2 Income Model Families (12)

| # | Family | Income Models Mapped |
|---|--------|---------------------|
| 1 | Employment-Led | Salary |
| 2 | Commission-Led | Commission, Real Estate Brokerage |
| 3 | Contract/Project-Led | Project Fee, Independent Contractor |
| 4 | Retainer/Subscription-Led | Subscription, Retainer, Consulting |
| 5 | Practice-Led | Professional Practice |
| 6 | Agency-Led | Agency, Team/Partnership |
| 7 | Product-Led | E-commerce, Digital Products, Franchise |
| 8 | Creator/Audience-Led | Creator, Media |
| 9 | Referral/Affiliate-Led | Affiliate, Referral |
| 10 | Asset/Rental-Led | Real Estate Rental |
| 11 | Investment-Led | Dividends, Licensing, Royalties |
| 12 | Hybrid/Multi-Source | Multiple mixed sources (default) |

Each family includes: family-specific weak points, supportive patterns, primary risk scenarios, stronger structure signals, default action priorities, avoid priorities, reassessment trigger templates, explanation translation maps, and benchmark cluster keys.

### 4.3 Industry Sector Benchmarks (19)

| Industry | Avg Score | Top 20% | Limited | Developing | Established | High |
|----------|-----------|---------|---------|-----------|-------------|------|
| Real Estate | 38 | 62 | 30% | 35% | 25% | 10% |
| Finance / Banking | 48 | 70 | 18% | 35% | 32% | 15% |
| Insurance | 52 | 72 | 15% | 30% | 35% | 20% |
| Technology | 45 | 68 | 20% | 35% | 30% | 15% |
| Healthcare | 50 | 70 | 15% | 32% | 35% | 18% |
| Legal Services | 46 | 68 | 18% | 35% | 32% | 15% |
| Consulting / Prof. Services | 42 | 65 | 22% | 38% | 28% | 12% |
| Sales / Brokerage | 36 | 58 | 32% | 35% | 23% | 10% |
| Media / Entertainment | 34 | 55 | 35% | 33% | 22% | 10% |
| Construction / Trades | 40 | 60 | 25% | 38% | 27% | 10% |
| Retail / E-Commerce | 42 | 62 | 22% | 38% | 28% | 12% |
| Hospitality / Food Service | 35 | 55 | 32% | 38% | 22% | 8% |
| Transportation / Logistics | 40 | 60 | 25% | 38% | 27% | 10% |
| Manufacturing | 48 | 68 | 18% | 35% | 32% | 15% |
| Education | 52 | 70 | 12% | 30% | 38% | 20% |
| Nonprofit / Public Sector | 50 | 68 | 15% | 32% | 35% | 18% |
| Agriculture | 35 | 55 | 30% | 38% | 24% | 8% |
| Energy / Utilities | 50 | 70 | 15% | 30% | 35% | 20% |
| Other | 42 | 65 | 22% | 38% | 28% | 12% |

### 4.4 Industry-Specific Simulator Presets

Each of the 19 industries has tailored stress scenarios in addition to the 6 generic presets:

| Industry | Custom Scenario |
|----------|----------------|
| Real Estate | Top listing falls through; Seasonal slowdown |
| Consulting | Biggest retainer cancels; 3-month project gap |
| Sales / Brokerage | Deal pipeline stalls |
| Construction | Next job start delayed 6 weeks |
| Media / Entertainment | No bookings for 60 days |
| Legal Services | Largest matter concludes |
| Healthcare | Compensation model shifts |
| Insurance | Renewal retention drops 20% |
| Retail / E-Commerce | Sales volume drops 30% |
| Hospitality | Customer traffic drops 25% |
| Education | Position contract not renewed |
| Transportation | Primary route or contract lost |
| Agriculture | Season yield underperforms |
| Technology | Employer restructures compensation |
| Energy / Utilities | Regulatory conditions change |
| Finance / Banking | Performance-linked pay drops 40% |
| Manufacturing | Customer demand drops, output slows |
| Nonprofit | Funding priorities shift, budget cut |
| Other | Generic presets only |

### 4.5 No AI in Core Scoring

All explainability, trade-off narratives, behavioral insights, predictive warnings, and action prioritization are generated **deterministically** by Engine 15 and Engine 16. No large language model or AI system is used in the scoring pipeline. This eliminates hallucination risk entirely.

AI is used only for enriching the uploaded diagnostic report with additional industry context **after** the deterministic score has been computed and locked. The AI layer cannot modify scores, bands, constraints, or any structural assessment data.

---

## 5. System Integrity & Data Validation

### 5.1 Integrity Engine (Engine 20)

Every assessment record includes four SHA-256 hashes:

| Hash | Purpose |
|------|---------|
| `input_hash` | SHA-256 of normalized inputs — verifies input authenticity |
| `output_hash` | SHA-256 of core scores — verifies computation integrity |
| `manifest_hash` | SHA-256 of model versions — verifies model identity |
| `record_hash` | SHA-256(input + output + manifest + assessment_id) — full record verification |

### 5.2 Reason Code Registry (31 codes)

Every decision the engine makes is tracked via reason codes:

**Validation (4 codes)**
- VAL-001: Invalid diagnostic input format [critical]
- VAL-002: Invalid profile context format [critical]
- VAL-003: Extended inputs not provided — using defaults [info]
- VAL-004: Extended input value out of expected range [warning]

**Context (2 codes)**
- CTX-001: Profile archetype resolved [info]
- CTX-002: Profile mismatch detected [warning]

**Normalization (1 code)**
- NRM-001: Inputs normalized to canonical values [info]

**Scoring (4 codes)**
- SCR-001: Raw scores computed [info]
- SCR-002: Quality adjustment applied [info]
- SCR-003: Interaction adjustments applied [info]
- SCR-004: Overall score clamped to valid range [warning]

**Indicators (1 code)**
- IND-001: Structural indicators computed [info]

**Interactions (4 codes)**
- INT-001: No interaction effects triggered [info]
- INT-002: Interaction penalties applied [warning]
- INT-003: Interaction bonuses applied [info]
- INT-004: Net adjustment clamped [warning]

**Quality (2 codes)**
- QAL-001: Quality score computed from extended inputs [info]
- QAL-002: Quality defaulted — no extended inputs [info]

**Constraints (2 codes)**
- CON-001: Constraint hierarchy computed [info]
- CON-002: Hidden unlock constraint identified [info]

**Fragility (3 codes)**
- FRG-001: Fragility score computed [info]
- FRG-002: Fragility class is brittle [warning]
- FRG-003: Multiple failure modes detected [warning]

**Sensitivity (2 codes)**
- SEN-001: Sensitivity tests completed [info]
- SEN-002: Score highly sensitive to small changes [warning]

**Scenarios (2 codes)**
- SCN-001: Risk scenarios computed [info]
- SCN-002: Band shift detected in stress scenario [warning]

**Lift (2 codes)**
- LFT-001: Score lift projections computed [info]
- LFT-002: Combined top two moves projected [info]

**Confidence (3 codes)**
- CNF-001: Diagnostic confidence computed [info]
- CNF-002: Contradiction detected in inputs [warning]
- CNF-003: Confidence level below moderate [warning]

**Explainability (1 code)**
- EXP-001: Explainability objects generated [info]

**Actions (2 codes)**
- ACT-001: Actions prioritized [info]
- ACT-002: Sequencing constraints applied [info]

**Reassessment (1 code)**
- RSA-001: Reassessment triggers computed [info]

**Benchmarking (2 codes)**
- BNK-001: Benchmarks computed from sector data [info]
- BNK-002: Outlier dimensions identified [info]

**Integrity (2 codes)**
- IGT-001: Integrity hashes computed [info]
- IGT-002: Integrity verification failed [critical]

### 5.3 Warning Overlays

When certain thresholds are met, warning overlays are applied to the band classification:

| Warning | Trigger |
|---------|---------|
| WRN-FRAG | Fragility score ≤ 25 |
| WRN-CONC | Largest source ≥ 70% |
| WRN-LABOR | Labor dependence ≥ 80% |
| WRN-VIS | Forward secured ≤ 10% |

### 5.4 Diagnostic Confidence Assessment

**Base confidence: 100**

| Deduction | Points | Trigger |
|-----------|--------|---------|
| Contradiction detected | -20 | High recurring + high labor, etc. |
| Missing extended inputs | -10 | Extended quality inputs not provided |
| Profile mismatch | -10 | Input patterns don't match selected profile |
| High sensitivity | -10 | Score changes ≥15 points from small input changes |
| Missing quality dimensions | -10 | Key quality inputs (cancellation, platform) not assessed |

**Confidence Levels**

| Score Range | Level |
|-------------|-------|
| 85–100 | High |
| 65–84 | Moderate |
| 45–64 | Guarded |
| 0–44 | Low |

### 5.5 Regression Test Suite

A 29-assertion automated test suite validates:
- Determinism (identical inputs = identical outputs)
- Edge cases (all-min, all-max scores)
- Cross-factor rule triggering (CF-01, CF-02, CF-B01)
- Band boundary accuracy (exact 30, 50, 75 thresholds)
- Industry profile resolution
- Score range validity across 125+ input combinations
- Model manifest and integrity hash presence
- Interaction adjustment clamping

Run: `npx tsx src/lib/engine/v2/__tests__/regression.test.ts`

### 5.6 Known Issues Resolved

| Issue | Severity | Status | Resolution |
|-------|----------|--------|------------|
| `executeAssessment()` ReferenceError | Critical | Fixed | Moved `computeBenchmarks()` before `generateExplainability()` |
| Simulator fragility divergence | Medium | Fixed | Aligned client-side fragility rules with Engine 10 |
| V1/V2 engine duplication | Medium | Fixed | Retired v1 engine (-4,042 lines); all scoring through v2 |

---

## 6. Recommendations & Future Enhancements

### 6.1 Implemented Improvements

| Enhancement | Status | Description |
|-------------|--------|-------------|
| Industry-specific simulator presets | Implemented | 19 industries with tailored stress scenarios |
| Quality score transparency | Implemented | Missing quality dimensions surfaced to users |
| Benchmark percentile in free tier | Implemented | Peer percentile shown on free score page |
| Longitudinal tracking (Engine 19) | Implemented | Score deltas and factor improvements between assessments |
| Regression test suite | Implemented | 29 automated assertions for CI/CD validation |
| V1 engine retirement | Implemented | Single codebase, single scoring engine |

### 6.2 Future Considerations

**Confidence System Refinement**
The contradiction detector flags "high recurring + high labor" as suspicious, but this combination is plausible (e.g., SaaS company with labor-heavy delivery). Consider expanding the contradiction logic to account for profile archetypes where this combination is normal.

**Quality Score Default**
When extended inputs are missing, `quality_score` defaults to 5 (midpoint on 0–10 scale). Consider defaulting to 3–4 to reflect the uncertainty inherent in incomplete inputs, rather than assuming neutral quality.

**Expanded Industry Presets**
Current presets cover 19 industries with 1–2 custom scenarios each. Emerging categories (AI/ML consultants, content creators, gig economy workers) may warrant dedicated presets as the user base grows.

**Benchmark Data Calibration**
Current sector benchmarks are structural estimates. As real assessment data accumulates, benchmarks should be recalibrated against actual user distributions per industry.

---

## 7. Intellectual Property

### 7.1 Proprietary Scoring System

The Income Stability Score™ is a proprietary deterministic scoring mechanism developed by PeopleStar Enterprises, LLC. The system is unique in its approach to measuring income **structure** rather than income **amount** — a category that did not previously exist in financial assessment tools.

Key proprietary elements:
- The 6-dimension structural assessment framework (Q1–Q6)
- The 60/40 Structure–Stability weighting system
- The cross-factor interaction rules (CF-01 through CF-B02)
- The fragility assessment methodology (parallel to score)
- The continuity months formula
- The constraint hierarchy algorithm (root, primary, secondary, dependent, hidden unlock)

### 7.2 Core Engine Pipeline

The 20-engine pipeline architecture is a proprietary system design. Each engine is a pure function with defined inputs, outputs, and no side effects. The pipeline processes a single assessment in under 20ms with full deterministic guarantees.

### 7.3 Branded Products & Features

| Name | Type | Description |
|------|------|-------------|
| RunPayway™ | Platform | The structural income diagnostic platform |
| Income Stability Score™ | Metric | The 0–100 standardized stability measurement |
| PressureMap™ | Feature | Structural analysis showing where pressure concentrates |
| Command Center | Feature | Interactive dashboard with simulator, roadmap, and benchmarks |
| Model RP-2.0 | Engine | The deterministic scoring model version |

### 7.4 Outcome Layer & AI Integration

The Outcome Layer (OL-1.0) is a proprietary contextual enrichment system. It provides:
- 12 income model family profiles with tailored weak points, risk scenarios, and action priorities
- 19 industry profiles with sector-specific scenario emphasis and benchmark framing
- Deterministic explainability across 13 dimensions (no AI in core analysis)
- AI enrichment is limited to post-scoring contextual layering and never modifies deterministic outputs

---

## 8. Miscellaneous

### 8.1 Model Version Policy

The scoring model is version-locked. When the model changes, the version number increments. All prior assessments retain their model version in the record, ensuring that any assessment can be verified against the model that produced it. Model versions are never applied retroactively.

Current versions:
- Model: RP-2.0
- Factor Weights: F-2.0
- Scenario Definitions: S-2.0
- Benchmark Data: B-2.0
- Explanation Templates: E-2.0

### 8.2 Privacy & Data Policy

- **No bank connections.** The system does not connect to banks, financial institutions, or any external data providers.
- **No credit pulls.** No credit bureau data is accessed or used.
- **No third-party data collection.** Assessment inputs are provided solely by the user.
- **Private by default.** Assessment results are not shared with third parties unless explicitly authorized by the user.
- **Data minimization.** Only the 6 structural inputs, profile context, and optional extended inputs are collected. No personally identifiable financial data is required.

### 8.3 Terms of Use — Key Provisions

- The Income Stability Score™ is a **structural income assessment**, not financial advice, investment advice, credit underwriting, or prediction of future outcomes.
- The system measures **current structural conditions** based on user-provided inputs. It does not forecast, predict, or guarantee future income stability.
- Results are valid as of the date of assessment and may change if inputs change.

### 8.4 Acceptable Use Policy — Key Provisions

- The platform may not be used for training machine learning models or AI systems.
- Reverse-engineering, decompilation, or systematic extraction of scoring rules, weights, or thresholds is prohibited.
- Automated mass querying of the scoring API is prohibited.
- The platform may not be used for credit underwriting, lending decisions, or employment screening.

### 8.5 Technology Stack

| Component | Technology |
|-----------|-----------|
| Framework | Next.js (React) |
| Language | TypeScript |
| Validation | Zod schemas |
| Hashing | SHA-256 (Node.js crypto / Web Crypto API) |
| Payments | Stripe |
| Email | Resend |
| Hosting | GoDaddy (static deployment via GitHub Actions FTP) |
| Repository | GitHub (private) |

### 8.6 Entity Information

- **Product:** RunPayway™
- **Entity:** PeopleStar Enterprises, LLC
- **Location:** Orange County, California, USA
- **Model Version:** RP-2.0
- **Copyright:** 2026 RunPayway™. All rights reserved.

---

*This document is confidential and intended for internal use by PeopleStar Enterprises, LLC. It contains proprietary intellectual property and trade secrets. Unauthorized distribution, reproduction, or disclosure is prohibited.*
