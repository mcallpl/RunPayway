# Typical Range Generation Standard™ v1.1

**Status**: READY FOR AUDIT  
**Version**: 1.1  
**Date**: June 19, 2026  

---

## PURPOSE

Generate the public-facing **Typical Range** statement that answers the customer's natural question:

> What is common?

Typical Range provides context for Position™ by showing the range of Commitment Pressure levels that most customers with similar support structures experience.

This standard is a **context framework only**. It does not predict, advise, or evaluate. It simply establishes what is typical for the peer group defined by Compared With™.

---

## CORE PRINCIPLE

**Typical Range identifies the range of common Commitment Pressure classifications within the comparison group.**

Typical Range does not rank situations or imply judgment. It provides context: "Here's where most people with your structure fall."

---

## PUBLIC QUESTION ANSWERED

**Customer asks**: "What's typical for someone in my comparison group?"

**Typical Range answers**: "Most comparable situations fall between X and Y Commitment Pressure levels."

The customer should understand in 3 seconds:
1. That this is about their comparison group (established by Compared With™)
2. That it shows a range of common Commitment Pressure levels
3. That it's descriptive, not prescriptive

---

## GENERATION INPUTS

**Required Inputs**:

1. **Decision Type™** (from report)
   - Home Purchase, Vehicle Purchase, Retirement, etc.

2. **Support Structure Archetype™** (from report)
   - Primary and Secondary archetypes

3. **Compared With™ Framework** (from Compared With™ standard)
   - The peer group definition

4. **Demand Profile™** (from locked measurement standards)
   - Typical support requirements for the Decision Type

**Optional Context**:
- Industry or sector (if relevant to peer group definition)
- Geographic region (if relevant)

**All inputs are deterministic. Same input produces same Typical Range output.**

---

## DEFINITION: TYPICAL RANGE™

**Typical Range™** is the range of Commitment Pressure classifications (CPL through CPC) that most customers with the same Decision Type and Support Structure archetype combination experience.

**Formula**:

```
Decision Type™ (defines the commitment requirement)
+
Primary Support Structure Archetype™ (defines the primary support structure)
+
Secondary Support Structure Archetype™ (defines any secondary support structure)
+
Demand Profile™ (defines what this decision type typically requires)
=
Typical Range™ (defines the common CP range for this combination)
```

**Example**:

```
Decision Type: Home Purchase
Primary Archetype: Employment Dominant
Secondary Archetype: None
Demand Profile: Home Purchase typically requires stable, recurring income

Result: Typical Range = Most customers with employment-only income supporting home purchases fall between Moderate (CPM) and Elevated (CPE) Commitment Pressure

Why? Employment income is stable, but home purchases have long duration and high magnitude, creating moderate-to-elevated dependence on that income continuing.
```

---

## PUBLIC LANGUAGE REQUIREMENT

### Display Format (Customer-Facing)

**Primary Display** (plain language first):

```
Typical Range

Most comparable situations fall between Moderate Commitment Pressure and Elevated Commitment Pressure.
```

**Secondary Display** (technical codes, optional):

```
CPM – CPE
```

**Critical Rule**: Customers should understand the statement without seeing CPL, CPM, CPE, CPH, CPC.

---

## ARCHETYPE-DECISION TYPE TYPICAL RANGES

These are base ranges per archetype and decision type combination. Individual cases may vary slightly based on secondary archetypes and specific characteristics, but these represent the typical center point.

---

### HOME PURCHASE TYPICAL RANGES

#### Employment Dominant
- **Typical Range**: Moderate to Elevated (CPM – CPE)
- **Why**: Stable income, but 30-year duration creates sustained dependence. Extended timeline and magnitude create moderate-to-elevated pressure.
- **Public Statement**: "Most home purchases supported by employment income fall between Moderate and Elevated Commitment Pressure."

#### Stable Base With Earned Overlay
- **Typical Range**: Moderate to Elevated (CPM – CPE)
- **Why**: Base is stable (like employment), but earned portion varies. Duration and magnitude create moderate-to-elevated pressure.
- **Public Statement**: "Most home purchases supported by a base salary with variable earning potential fall between Moderate and Elevated Commitment Pressure."

#### Recurring-Plus-Project
- **Typical Range**: Elevated (CPE)
- **Why**: Recurring base provides some stability, but project income varies. 30-year home duration requires consistency; project variability creates elevated pressure.
- **Public Statement**: "Most home purchases supported by recurring client base with project-based income fall at Elevated Commitment Pressure."

#### Multi-Component Hybrid
- **Typical Range**: Moderate to Elevated (CPM – CPE)
- **Why**: Multiple income sources provide some diversification, but all depend on primary source (employer). Duration and magnitude create moderate-to-elevated pressure.
- **Public Statement**: "Most home purchases supported by multiple forms of income from a single source fall between Moderate and Elevated Commitment Pressure."

#### Transaction Dominant
- **Typical Range**: Elevated to High (CPE – CPH)
- **Why**: Transaction-based income is inherently variable. 30-year home duration requires sustained transaction flow. Elevated-to-high pressure reflects dependency on continued transaction completion.
- **Public Statement**: "Most home purchases supported by variable, transaction-based income fall between Elevated and High Commitment Pressure."

#### Single-Client Transaction Dependent
- **Typical Range**: High to Critical (CPH – CPC)
- **Why**: Single client concentration + transaction dependence + 30-year duration = extreme dependence on client retention and continued transactions. High-to-critical pressure.
- **Public Statement**: "Most home purchases supported by revenue concentrated with a single primary client fall between High and Critical Commitment Pressure."

#### Platform-Mediated Gig
- **Typical Range**: Elevated to High (CPE – CPH)
- **Why**: Platform-dependent income is variable and algorithm-driven. 30-year duration requires sustained platform access. Elevated-to-high pressure reflects dependency on platform continuation.
- **Public Statement**: "Most home purchases supported by gig economy or platform-mediated income fall between Elevated and High Commitment Pressure."

---

### RETIREMENT TYPICAL RANGES

#### Employment Dominant
- **Typical Range**: Moderate (CPM)
- **Why**: Employment income transitions to retirement income (pension or savings). Duration is 30-40 years, but income is stable. Moderate pressure from duration length.
- **Public Statement**: "Most retirement decisions supported by employment income fall at Moderate Commitment Pressure."

#### Stable Base With Earned Overlay
- **Typical Range**: Moderate (CPM)
- **Why**: Base transitions to stable retirement income. Earned portion may stop at retirement. Overall moderate pressure from duration.
- **Public Statement**: "Most retirement decisions supported by a base salary with variable earning potential fall at Moderate Commitment Pressure."

#### Recurring-Plus-Project
- **Typical Range**: Moderate to Elevated (CPM – CPE)
- **Why**: Recurring income (retainers) can continue into retirement. Project income becomes less reliable. Moderate-to-elevated pressure from 30-40 year duration.
- **Public Statement**: "Most retirement decisions supported by recurring client base with project-based income fall between Moderate and Elevated Commitment Pressure."

#### Multi-Component Hybrid
- **Typical Range**: Low to Moderate (CPL – CPM)
- **Why**: Multiple income types + diversification = some resilience. Long duration still requires support, but multiple sources reduce pressure.
- **Public Statement**: "Most retirement decisions supported by multiple forms of income from a single source fall between Low and Moderate Commitment Pressure."

#### Transaction Dominant
- **Typical Range**: High (CPH)
- **Why**: Transaction income alone cannot sustain 30-40 year retirement. Extreme dependence on continued transactions. High pressure.
- **Public Statement**: "Most retirement decisions supported by variable, transaction-based income fall at High Commitment Pressure."

#### Single-Client Transaction Dependent
- **Typical Range**: Critical (CPC)
- **Why**: Single client + transactions + 30-40 years = unsustainable without significant additional support. Critical pressure.
- **Public Statement**: "Most retirement decisions supported by revenue concentrated with a single primary client fall at Critical Commitment Pressure."

#### Platform-Mediated Gig
- **Typical Range**: High (CPH)
- **Why**: Platform-dependent income cannot reliably sustain 30-40 year retirement. Dependent on continued platform access + algorithm continuation. High pressure.
- **Public Statement**: "Most retirement decisions supported by gig economy or platform-mediated income fall at High Commitment Pressure."

---

### BUSINESS LAUNCH TYPICAL RANGES

#### Employment Dominant
- **Typical Range**: Low to Moderate (CPL – CPM)
- **Why**: Personal employment supports living expenses during 18-36 month startup runway. Modest pressure because employment provides stability.
- **Public Statement**: "Most business launches supported by employment income fall between Low and Moderate Commitment Pressure."

#### Stable Base With Earned Overlay
- **Typical Range**: Moderate (CPM)
- **Why**: Base provides runway, but earned portion may end. Startup duration 18-36 months creates moderate pressure.
- **Public Statement**: "Most business launches supported by a base salary with variable earning potential fall at Moderate Commitment Pressure."

#### Recurring-Plus-Project
- **Typical Range**: Low to Moderate (CPL – CPM)
- **Why**: Existing recurring income can fund startup losses. Low-to-moderate pressure if recurring revenue is sufficient for startup runway.
- **Public Statement**: "Most business launches supported by recurring client base with project-based income fall between Low and Moderate Commitment Pressure."

#### Multi-Component Hybrid
- **Typical Range**: Moderate (CPM)
- **Why**: Multiple income sources provide some runway, but all from same source. Moderate pressure from startup duration and income dependence.
- **Public Statement**: "Most business launches supported by multiple forms of income from a single source fall at Moderate Commitment Pressure."

#### Transaction Dominant
- **Typical Range**: Elevated (CPE)
- **Why**: No guaranteed income for 18-36 month runway. Startup funding depends entirely on continued transactions. Elevated pressure.
- **Public Statement**: "Most business launches supported by variable, transaction-based income fall at Elevated Commitment Pressure."

#### Single-Client Transaction Dependent
- **Typical Range**: High (CPH)
- **Why**: Single client + transactions for startup runway = extreme dependence. If client stops or reduces, startup funding ends. High pressure.
- **Public Statement**: "Most business launches supported by revenue concentrated with a single primary client fall at High Commitment Pressure."

#### Platform-Mediated Gig
- **Typical Range**: Elevated (CPE)
- **Why**: Platform-dependent income for 18-36 month startup runway = dependence on platform continuation + algorithm. Elevated pressure.
- **Public Statement**: "Most business launches supported by gig economy or platform-mediated income fall at Elevated Commitment Pressure."

---

### CAREER CHANGE TYPICAL RANGES

#### Employment Dominant
- **Typical Range**: Low (CPL)
- **Why**: Existing employment provides transition bridge (12-24 months). New employment will continue income. Low pressure during transition.
- **Public Statement**: "Most career changes supported by employment income fall at Low Commitment Pressure."

#### Stable Base With Earned Overlay
- **Typical Range**: Low to Moderate (CPL – CPM)
- **Why**: Base provides transition income; earned portion may end. Low-to-moderate pressure from transition period.
- **Public Statement**: "Most career changes supported by a base salary with variable earning potential fall between Low and Moderate Commitment Pressure."

#### Recurring-Plus-Project
- **Typical Range**: Low to Moderate (CPL – CPM)
- **Why**: Recurring income continues during transition. Projects may provide additional income. Low-to-moderate pressure.
- **Public Statement**: "Most career changes supported by recurring client base with project-based income fall between Low and Moderate Commitment Pressure."

#### Multi-Component Hybrid
- **Typical Range**: Low (CPL)
- **Why**: Multiple income sources provide transition flexibility. Low pressure during 12-24 month career transition.
- **Public Statement**: "Most career changes supported by multiple forms of income from a single source fall at Low Commitment Pressure."

#### Transaction Dominant
- **Typical Range**: Moderate to Elevated (CPM – CPE)
- **Why**: No guaranteed income during 12-24 month transition. Dependent on continued transactions. Moderate-to-elevated pressure.
- **Public Statement**: "Most career changes supported by variable, transaction-based income fall between Moderate and Elevated Commitment Pressure."

#### Single-Client Transaction Dependent
- **Typical Range**: Elevated (CPE)
- **Why**: Single client + transactions during career transition = significant pressure if client stops. Elevated pressure.
- **Public Statement**: "Most career changes supported by revenue concentrated with a single primary client fall at Elevated Commitment Pressure."

#### Platform-Mediated Gig
- **Typical Range**: Moderate (CPM)
- **Why**: Platform income provides some transition support, but algorithm-dependent. Moderate pressure during 12-24 month transition.
- **Public Statement**: "Most career changes supported by gig economy or platform-mediated income fall at Moderate Commitment Pressure."

---

## SECONDARY ARCHETYPE ADJUSTMENT

When a secondary archetype is present, it may adjust the Typical Range up or down from the base.

**Adjustment Rules**:

### If Secondary Archetype "Reinforces" Primary (Uses "With" Modifier)

Secondary income reinforces and stabilizes primary. Typical Range may shift **lower**.

**Example**:
- Base: Employment Dominant (CPM for home purchase)
- Secondary: Stable Base With Earned Overlay (commission)
- Adjustment: Commission enhances stability → Range may shift to CPL-CPM instead of CPM-CPE
- Result: "Most home purchases supported primarily by employment income with variable commission support fall between Low and Moderate Commitment Pressure."

### If Secondary Archetype is Independent (Uses "And" Modifier)

Secondary income is parallel/independent. Typical Range reflects combined support.

**Example**:
- Base: Employment Dominant (CPM for retirement)
- Secondary: Multi-Component Hybrid (portfolio)
- Adjustment: Portfolio diversifies retirement → Range may shift lower to CPL-CPM instead of CPM
- Result: "Most retirement decisions supported by employment income and portfolio assets fall between Low and Moderate Commitment Pressure."

---

## DETERMINISM STANDARD

**The same inputs must always produce the same Typical Range output.**

- Same Decision Type + Same Primary Archetype + Same Secondary Archetype = Same Typical Range statement
- No subjective interpretation
- No variation based on customer characteristics
- No temporal changes

---

## PUBLIC BOUNDARY

**This standard does NOT expose**:
- Commitment Pressure calculation methodology
- Classification assignment rules
- Benchmark datasets
- Demand Profile specifications
- Calibration logic

**This standard ONLY exposes**:
- The Typical Range statement in plain language
- The comparison group definition (from Compared With™)
- The range brackets (Moderate to Elevated, etc.)
- Technical codes (CPM – CPE) as secondary display

---

## CONTEXT LAYER CONSISTENCY

Typical Range fits into the full report output flow:

```
Measurement
(What did I get? "Elevated Commitment Pressure")
↓
Position  
(Where do I sit? "Higher Than Typical")
↓
Compared With
(Compared with who? "Home purchases supported by employment income")
↓
Typical Range
(What is common? "Most fall between Moderate and Elevated")
↓
Interpretation
(What does it mean?)
↓
Primary Drivers
(Why did I get this result?)
↓
Implications
(Why does it matter?)
↓
Technical Classification
(CPE)
```

**Consistency Rules**:
- Position and Typical Range work together but are distinct
  - Position: "Your specific placement within the range"
  - Typical Range: "The overall range itself"
- Compared With provides the peer group; Typical Range shows what's common in that group
- No duplication or contradiction across all 7 sections

---

## VERSION CONTROL

**Typical Range Generation Standard™ v1.1**

**Lock Date Pending**: Pending institutional audit  
**Status**: READY FOR AUDIT  
**Related Standards**: 
- Position Assignment Standard™ (LOCKED)
- Support Structure Archetype Standard™ (LOCKED)
- Compared With Generation Standard™ v1.1 (LOCKED)

---

## END STANDARD

**Ready for institutional audit before lock.**
