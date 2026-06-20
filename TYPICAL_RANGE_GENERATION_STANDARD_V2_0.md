# Typical Range Generation Standard™ v2.0

**Status**: READY FOR AUDIT  
**Version**: 2.0 (Complete Rebuild)  
**Date**: June 19, 2026  
**Previous Version**: v1.1 (superseded — was benchmark catalog, not generation standard)  

---

## PURPOSE

Generate the public-facing **Typical Range** statement that answers the customer's natural question:

> What is common?

This standard is a **generation framework only**. It defines HOW to generate Typical Ranges from measured inputs, not WHAT the ranges are.

Typical Range provides context by showing the range of Commitment Pressure classifications that typically occur within a comparison group, derived from structural characteristics, not from lookup tables or benchmark catalogs.

---

## CORE PRINCIPLE

**Typical Range is generated from the gap between Demand Profile requirements and Support Structure Archetype characteristics.**

Typical Range:
- Is deterministic (same inputs always produce same output)
- Is derived (not looked up)
- Is context (not scoring)
- Is measured (not assigned)
- Contains no benchmark database
- Contains no static tables
- Contains no calibration logic

---

## PUBLIC QUESTION ANSWERED

**Customer asks**: "What's typical for someone in my comparison group?"

**Typical Range answers**: "Most comparable situations fall between X and Y Commitment Pressure levels."

The customer should understand in 3 seconds that this is showing a range of common outcomes in their peer group, derived from structural analysis, not from benchmarks or recommendations.

---

## GENERATION INPUTS

**All inputs must be present and deterministic:**

1. **Decision Type™** (from report)
   - Defines time horizon, magnitude requirement, continuity expectation
   - Source: Locked Decision Type™ Standard

2. **Demand Profile™** (from locked measurement standards)
   - Defines typical structure requirements for the Decision Type
   - Specifies: what characteristics support this decision well
   - Source: Locked Demand Profile™ Standard

3. **Support Structure Archetype™** (from report)
   - Describes customer's actual support structure characteristics
   - Specifies: what the customer actually has
   - Source: Support Structure Archetype™ Standard

4. **Comparison Group™** (from Compared With™ standard)
   - Identifies the peer group
   - Used to understand distribution within group
   - Source: Compared With Generation Standard™

**Sufficient for generation**: All 4 inputs above.

---

## RANGE CONSTRUCTION LOGIC

### Step 1: Identify Decision Type Requirements

**Input**: Decision Type™

**Process**:
- Extract time horizon (e.g., 30 years for home purchase, 18-36 months for business launch)
- Extract magnitude requirement (e.g., $30-60k/year ongoing for home purchase)
- Extract continuity expectation (e.g., recurring monthly income for home purchase)
- Extract typical structural requirements (e.g., stability, diversification, independence)

**Output**: Decision Type profile defining what characteristics typically support this decision

---

### Step 2: Identify Demand Profile Characteristics

**Input**: Demand Profile™ (locked)

**Process**:
- Extract typical structure characteristics that support this Decision Type
- Identify primary characteristics (most important for this decision)
- Identify secondary characteristics (reinforcing or diversifying)
- Identify exclusions (what doesn't work well for this decision)

**Output**: Baseline characteristics defining ideal support for this Decision Type

---

### Step 3: Analyze Support Structure Archetype

**Input**: Support Structure Archetype™

**Process**:
- Identify actual archetype characteristics
- Measure: What characteristics does this archetype have?
- Measure: What characteristics is it missing?
- Measure: Strength of characteristics present (full, partial, minimal)

**Output**: Actual structure profile defining what the customer has

---

### Step 4: Calculate Characteristic Gap

**Process**:
- Compare Demand Profile requirements against Support Structure Archetype characteristics
- Identify gaps (where archetype falls short of demand)
- Identify surpluses (where archetype exceeds demand)
- Measure: How critical are the gaps?
  - Critical gaps: Fundamental requirements not met
  - Moderate gaps: Secondary requirements partially met
  - Minor gaps: Tertiary characteristics missing

**Output**: Gap analysis showing alignment between requirements and reality

---

### Step 5: Determine Typical Range

**Process**:

Based on the gap analysis, determine where this combination typically falls:

```
Gap Analysis Result → Typical Range Classification

Strong alignment (archetype meets/exceeds demand in all critical areas)
→ Lower Commitment Pressure range (CPL, CPM)
(Dependence is lower because structure well-matches demand)

Moderate alignment (archetype meets demand in critical areas, gaps in secondary)
→ Moderate Commitment Pressure range (CPM, CPE)
(Dependence is moderate because gaps in secondary characteristics)

Weak alignment (archetype has critical gaps)
→ Higher Commitment Pressure range (CPE, CPH, CPC)
(Dependence is higher because fundamental requirements not met)
```

**Output**: Typical Range classification derived from structural alignment

---

## DEMAND INFLUENCE RULES

**How Demand Profile shapes Typical Range:**

### Rule D1: Time Horizon Influences Range Width

**Longer decision horizon** (30-40 years, e.g., home purchase or retirement)
→ Broader Typical Range (e.g., CPM-CPE, CPE-CPH)
- Why: Longer duration means more variability in what's "typical"
- Longer timeframe absorbs more variation in support circumstances

**Shorter decision horizon** (12-24 months, e.g., career change)
→ Narrower Typical Range (e.g., CPL-CPM, CPM)
- Why: Shorter duration means less variability
- Shorter timeframe constrains typical outcomes

---

### Rule D2: Stability Expectation Influences Range Shift

**Decision Type demands recurring/stable support**
→ Range shifts lower for stable archetypes, higher for variable archetypes
- Example: Home Purchase (demands stability) + Employment Dominant (provides stability) = CPM-CPE
- Example: Home Purchase (demands stability) + Transaction Dominant (variable) = CPE-CPH

**Decision Type tolerates variable support**
→ Range is flatter across archetype types
- Example: Business Launch (tolerates variable) + Employment = CPL-CPM
- Example: Business Launch (tolerates variable) + Transaction = CPM-CPE

---

### Rule D3: Continuity Expectation Influences Range Level

**Decision Type requires continuous support**
→ Typical Range higher for interrupted/concentrated archetypes
- Example: Retirement (requires 30-40 year continuity) + Single-Client (interrupted risk) = CPH-CPC
- Example: Retirement (requires continuity) + Platform-Mediated (algorithm-dependent) = CPH

**Decision Type tolerates support gaps**
→ Typical Range lower for interrupted archetypes
- Example: Business Expansion (allows runway periods) + Transaction = CPM-CPE
- Example: Career Change (allows transition gaps) + Gig = CPM

---

## ARCHETYPE INFLUENCE RULES

**How Support Structure Archetype shapes Typical Range:**

### Rule A1: Continuity Characteristics Influence Pressure Level

**High-continuity archetype** (Employment Dominant, Recurring-Plus-Project)
→ Lowers Typical Range relative to Demand Profile baseline
- Reason: Predictable continuation reduces dependence

**Low-continuity archetype** (Transaction Dominant, Single-Client)
→ Raises Typical Range relative to Demand Profile baseline
- Reason: Unpredictable continuation increases dependence

---

### Rule A2: Concentration Characteristics Influence Pressure Level

**Diversified archetype** (Multi-Component Hybrid, Recurring-Plus-Project)
→ Lowers Typical Range (if other characteristics are adequate)
- Reason: Multiple sources reduce concentration risk

**Concentrated archetype** (Single-Client Transaction Dependent, Employment Dominant single-employer)
→ Raises Typical Range (if time horizon is long)
- Reason: Single-source concentration increases dependence

---

### Rule A3: Variability Characteristics Influence Pressure Level

**Low-variability archetype** (Employment Dominant, Stable Base with good base %)
→ Lowers Typical Range for decisions requiring stability
- Reason: Predictable income reduces pressure

**High-variability archetype** (Transaction Dominant, Platform-Mediated Gig)
→ Raises Typical Range for decisions requiring recurring income
- Reason: Unpredictable income increases pressure

---

## COMPARISON GROUP INFLUENCE RULES

**How Comparison Group context shapes Typical Range:**

### Rule C1: Within-Group Distribution

**Input**: Comparison Group™ (from Compared With™)

**Process**:
- Identify all customers with the same archetype + decision type combination
- Measure their actual Commitment Pressure classifications
- Identify the range of classifications that appear in the group

**Output**: Typical Range is the most common/central range observed

---

### Rule C2: Group Size Influence

**Large, mature comparison group** (many customers with same combination)
→ Typical Range is stable, narrow, well-defined

**Small or new comparison group** (few customers with same combination)
→ Typical Range is wider, provisional, may expand/contract as data accumulates

---

## DETERMINISTIC STANDARD

**The same inputs always produce the same Typical Range output.**

### Determinism Rules

#### Rule T1: Input Consistency

Identical inputs (Decision Type + Demand Profile + Archetype + Comparison Group) always produce identical Typical Range output.

---

#### Rule T2: No Subjective Variables

The generation process contains no subjective interpretation:
- ❌ No "may shift"
- ❌ No "typically"
- ❌ No "usually"
- ❌ No judgment calls
- ✅ Only logical gaps analysis producing consistent output

---

#### Rule T3: Reproducibility

Any analyst using this standard with the same inputs and measured data should produce the same Typical Range.

---

## PUBLIC BOUNDARY

**This standard does NOT expose:**
- ❌ Benchmark datasets
- ❌ Calibration thresholds
- ❌ Gap analysis numbers
- ❌ Classification assignment rules
- ❌ Static range tables
- ❌ Proprietary alignment matrices

**This standard ONLY explains:**
- ✅ The generation process (high-level logic)
- ✅ How each input influences the range
- ✅ The principle (gap analysis produces range)
- ✅ Examples showing the process

---

## EXAMPLE GENERATION WALKTHROUGHS

### Example 1: Home Purchase + Employment Dominant

**Inputs**:
- Decision Type: Home Purchase
- Demand Profile: 30-year duration, $30-60k/year, recurring income required, stability expected
- Support Structure Archetype: Employment Dominant (95%+ forward-secured, 0.0-0.2 variability, high persistence)
- Comparison Group: Home purchases by employment-income earners

**Generation Process**:

Step 1: Decision Type Profile
```
Time horizon: 30 years (long duration)
Magnitude: $30-60k/year ongoing
Continuity: Monthly recurring income required
Typical characteristics: Stable, recurring, predictable
```

Step 2: Demand Profile
```
Typical support: Stable, recurring income over 30 years
Critical: Income continuity
Secondary: Income predictability
```

Step 3: Archetype Analysis
```
Employment Dominant has:
✓ Stable income (95%+ forward-secured)
✓ Recurring income (employment persistence)
✓ Predictable income (low variability 0.0-0.2)
✓ Meets critical demand characteristics
Gap: None in critical areas
```

Step 4: Gap Analysis
```
Archetype strength vs. Demand:
- Continuity: STRONG alignment
- Predictability: STRONG alignment
- Duration: No gap (archetype matches 30-year horizon)
Overall: STRONG alignment with demands
```

Step 5: Typical Range Determination
```
Strong alignment → Lower-to-moderate Commitment Pressure range
Why: Dependence on continuing support is moderate (long duration) but support is strong (stable employment)
Result: CPM – CPE (Moderate to Elevated)
```

**Public Output**:
```
Typical Range
Most home purchases supported by employment income fall between Moderate and Elevated Commitment Pressure.
```

---

### Example 2: Retirement + Single-Client Transaction Dependent

**Inputs**:
- Decision Type: Retirement
- Demand Profile: 30-40 year duration, sustained income required, stability critical
- Support Structure Archetype: Single-Client Transaction Dependent (5% forward-secured, 0.75 variability, 48% persistence)
- Comparison Group: Retirement decisions by transaction-dependent income earners

**Generation Process**:

Step 1: Decision Type Profile
```
Time horizon: 30-40 years (very long duration)
Magnitude: Sufficient for living expenses, 30-40 years
Continuity: Sustained income required throughout
Typical characteristics: Stable, highly predictable, long-term commitment
```

Step 2: Demand Profile
```
Typical support: Highly stable, sustained income over 30-40 years
Critical: Income continuity (cannot have gaps)
Critical: Income predictability (cannot have volatility)
```

Step 3: Archetype Analysis
```
Single-Client Transaction Dependent has:
✗ Minimal base income (5% forward-secured)
✗ High variability (0.75 variability)
✗ Low persistence (48% persistence)
✗ FAILS critical demand characteristics
Gaps: All critical areas
```

Step 4: Gap Analysis
```
Archetype strength vs. Demand:
- Continuity: CRITICAL GAP (48% persistence vs. 30-40 year requirement)
- Predictability: CRITICAL GAP (0.75 variability vs. stability requirement)
- Sustained income: CRITICAL GAP (5% forward-secured vs. full-amount requirement)
Overall: CRITICAL MISALIGNMENT with demands
```

Step 5: Typical Range Determination
```
Critical misalignment → High-to-critical Commitment Pressure range
Why: Decision depends entirely on continued transaction flow which is unpredictable and concentrated
Result: CPH – CPC (High to Critical)
```

**Public Output**:
```
Typical Range
Most retirement decisions supported by transaction-dependent income fall between High and Critical Commitment Pressure.
```

---

### Example 3: Business Launch + Recurring-Plus-Project

**Inputs**:
- Decision Type: Business Launch
- Demand Profile: 18-36 month runway, business revenue or personal income, variable support acceptable
- Support Structure Archetype: Recurring-Plus-Project (40-50% forward-secured, 0.55 variability, 80% persistence)
- Comparison Group: Business launches by consulting/project-based income earners

**Generation Process**:

Step 1: Decision Type Profile
```
Time horizon: 18-36 months (startup runway)
Magnitude: Cover operating losses during ramp
Continuity: Variable acceptable (startup has variable cash flow)
Typical characteristics: Runway available, adaptable, survivable during losses
```

Step 2: Demand Profile
```
Typical support: Available runway funds for 18-36 months
Critical: Sufficient cash flow to cover losses
Secondary: Ability to adjust/adapt during ramp period
Stable income: NOT required (variable acceptable)
```

Step 3: Archetype Analysis
```
Recurring-Plus-Project has:
✓ Recurring base (40-50% forward-secured)
✓ Project upside (additional revenue source)
✓ Reasonable persistence (80%)
✓ Can provide runway for 18-36 months
✓ Meets critical demand characteristics
Gap: None in critical areas (runway available)
```

Step 4: Gap Analysis
```
Archetype strength vs. Demand:
- Runway availability: STRONG alignment (recurring + project sources)
- Adaptability: STRONG alignment (multiple income sources)
- Variable tolerance: PERFECT alignment (archetype is variable)
Overall: STRONG alignment with demands
```

Step 5: Typical Range Determination
```
Strong alignment → Low-to-moderate Commitment Pressure range
Why: Archetype provides adequate runway and accepts variability that startups require
Result: CPL – CPM (Low to Moderate)
```

**Public Output**:
```
Typical Range
Most business launches supported by recurring client base with project-based income fall between Low and Moderate Commitment Pressure.
```

---

## CRITICAL TEST

**Can a Typical Range be generated for a new Decision Type without rewriting this standard?**

**Answer**: ✅ YES

**Proof**:

For any new Decision Type (e.g., "Sabbatical Leave"):

1. Define the Decision Type profile (time horizon, magnitude, continuity needs)
2. Define the Demand Profile (what characteristics support it)
3. Take customer's Support Structure Archetype
4. Run gap analysis (does archetype meet demand?)
5. Determine Typical Range from gap result
6. Generate public statement

**No rewrite needed.** The standard is a generation framework, not a lookup table.

---

## VERSION CONTROL

**Typical Range Generation Standard™ v2.0**

**Lock Date Pending**: Pending institutional audit  
**Status**: READY FOR AUDIT  
**Previous**: v1.1 (superseded — was benchmark catalog)

---

## END STANDARD

**Status**: Complete generation framework. No benchmark tables. No static ranges. No advisory language.

Ready for Category Protection, Context Layer, Determinism, and Architecture audits.
