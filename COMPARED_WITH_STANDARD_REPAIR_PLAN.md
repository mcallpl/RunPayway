# COMPARED_WITH_STANDARD_REPAIR_PLAN.md

**Objective**: Map audit findings to specific corrections without rewriting the standard yet.

**Approach**: Root cause → Violation → Proposed fix → Impact analysis

---

# CRITICAL ISSUE #1: CATEGORY DRIFT (Advisory Language)

## Root Cause

The standard's example justifications ("Why this granularity" sections) use judgment language when explaining why a Compared With statement is specific or broad.

This language leaks into the reasoning layer and could affect how the standard is implemented, potentially introducing advisory framing into the public output.

Examples of leaked judgment language:
- Line 1176: "transaction income cannot reliably sustain 30-40 year retirement"
- Line 1230: "concentration is the key risk factor"
- Line 1331-1332: "career change is riskier without stable income"
- Line 431, 465: "Emphasize risk" labels in archetype translations
- Throughout: "stable" (implies judgment about quality/reliability)

## Why This Violates Locked RunPayway Standard

**Violation of Master Prompt Section 24 (Tone Standard)**:

RunPayway copy must be:
- ✅ objective
- ✅ measured
- ✅ deterministic
- ❌ NOT: "you should"
- ❌ NOT: recommendations
- ❌ NOT: financial advice
- ❌ NOT: risk language
- ❌ NOT: safety language ("safe," "unsafe," "risky")

**Specific Violations**:

1. "Cannot reliably sustain" = Predictive claim (prohibited)
2. "Risk factor" = Risk assessment language (prohibited)
3. "Riskier" = Safety/risk judgment (prohibited)
4. "Single-point-of-failure" = Negative judgment (prohibited)
5. "Stable" in public translations = Implies this income is "good" or "reliable" (judgment)

**Violation of Master Prompt Section 7 (Core Equation)**:

RunPayway measures: "How heavily a commitment relies on supporting conditions remaining intact"

Not: "How safe/risky/good/bad the decision is"

The judgment language shifts toward evaluating quality, not measuring dependence.

---

## Proposed Corrections

### Correction 1A: Remove "Emphasize Risk" Labels from Archetype Translations

**Current** (Lines 431, 465):
```
Archetype 5: "Emphasize risk" label
"variable, transaction-dependent income with minimal guaranteed base"

Archetype 6: "Emphasize risk" label
"revenue concentrated with a single primary client with variable transaction-based income"
```

**Proposed**:
Delete the "Emphasize risk" context labels entirely. They frame the archetype in judgment terms.

**Replacement Logic**:
Use pure structural language. No risk framing.

```
Archetype 5:
"variable, transaction-dependent income"

Archetype 6:
"revenue concentrated with a single primary client"
```

The statement itself says what the structure is. No judgment needed.

---

### Correction 1B: Replace Judgment Language in Example Justifications

**Current** (Example 10, Line 1176):
```
"Why this granularity:
- LOW alignment with demand (transaction income cannot reliably sustain 30-40 year retirement)"
```

**Problem**: "Cannot reliably sustain" is predictive. It predicts the outcome will be negative.

**Proposed**:
```
"Why this granularity:
- LOW alignment with demand (transaction-based income operates differently from typical retirement support models)"
```

**Rationale**: This is purely descriptive (it operates differently). Not judgment-based (it won't work).

---

**Current** (Example 12, Line 1230-1231):
```
"- HIGH specificity (concentration is the key risk factor)"
```

**Problem**: "Risk factor" = Risk assessment language (prohibited).

**Proposed**:
```
"- HIGH specificity (concentration is a defining structural characteristic that diverges from typical business launch support)"
```

**Rationale**: Describes the structure, not the risk.

---

**Current** (Example 16, Line 1331-1332):
```
"Customer understands: career change is riskier without stable income during transition"
```

**Problem**: "Riskier" = Safety/risk judgment (prohibited). "Stable" = Implies quality judgment.

**Proposed**:
```
"Customer understands: career change with variable transaction-based income operates differently than career change with consistent recurring income"
```

**Rationale**: Pure structure comparison. No safety framing.

---

### Correction 1C: Replace "Stable" With Structural Description

**Current** (Throughout; Lines 285-303, 686, 865, etc.):
```
"stable employment income"
"stable employment income"
"stable base with variable earning potential"
```

**Problem**: "Stable" is a judgment word. It implies the income is "good" or "reliable" (quality assessment), not just a measurement of the structure.

**Proposed**:
Use the archetype's actual structural characteristic instead:

```
Employment Dominant archetype:
INSTEAD OF: "stable employment income"
USE: "employment-based income from a single employer"

This describes the structure (employment, single employer) without judging it as "stable."
```

**Rationale**: 
The measurement says: Persistence 98%, Variability 0.0-0.2, Band A
The judgment says: "stable"

Use the measurement-based description, not the judgment word.

---

## Impact Analysis

### Impact on Determinism

**Before Repair**: Medium impact
- Some judgment language is in justifications, not in the Compared With output itself
- But it influences how implementers understand the rules

**After Repair**: Positive
- Removes judgment layer entirely
- Rules become clearer (based on structure, not assessment)
- Same input will produce same output regardless of implementer's judgment

---

### Impact on Adoption

**Before Repair**: Negative
- Customers might read judgment language and think RunPayway is making risk assessments
- Breaks trust (looks advisory)

**After Repair**: Positive
- Compared With statements are purely descriptive
- Customers see measurement, not judgment
- Increases adoption confidence (doesn't sound advisory)

---

### Impact on Category Protection

**Before Repair**: Violation
- Drifts toward risk scoring
- Drifts toward affordability assessment
- Uses prohibited language (risky, stable, cannot sustain)

**After Repair**: Compliant
- Pure measurement language
- No risk framing
- No quality judgment
- Maintains category protection

---

---

# CRITICAL ISSUE #2: PROPRIETARY THRESHOLD EXPOSURE

## Root Cause

The standard includes full numeric definitions for each archetype's internal classification boundaries:

```
Employment Dominant:
- Forward Secured: 95%+
- Variability: Very low (0.0-0.2)
- Stability Band: A
- Persistence: 98%+

Recurring-Plus-Project:
- Forward Secured: 35-50%
- Variability: Moderate (0.4-0.6)
- Stability Band: B
- (etc.)
```

These numeric ranges ARE the "classification boundaries" that should be protected per Section 26 of the Master Prompt.

## Why This Violates Locked RunPayway Standard

**Violation of Master Prompt Section 26 (Intellectual Property Boundary)**:

Protected/proprietary:
- ✅ Classification Assignment Rules™
- ✅ Classification Boundaries™
- ✅ Calibration Methodology™

By including these numeric ranges in this standard:
1. We're publishing classification boundaries that should be protected
2. Competitors can reverse-engineer our thresholds
3. An audit trail exists (this document) that reveals our exact definitions
4. Wide audience access = IP exposure

**Specific Violations**:

These definitions define HOW we classify customers into archetypes. That's "Classification Boundaries™" which is listed as protected.

---

## Proposed Corrections

### Correction 2A: Remove All Numeric Archetype Definitions

**Current** (Lines 275-507, all 7 archetypes):
```
### Archetype 1: Employment Dominant

**Internal Definition**:
- Forward Secured: 95%+
- Variability: Very low (0.0-0.2)
- Stability Band: A
- Persistence: 98%+
- Labor Dependence: 100%
- Single employer (credential-portable)
```

**Proposed**:
Delete the entire "Internal Definition" section for all 7 archetypes.

Replace with archetype NAME only, plus a brief structural description (NO numeric thresholds).

```
### Archetype 1: Employment Dominant

**Structural Characteristics**:
Income that is primarily from W-2 employment with high continuity and low variability.
```

**Rationale**:
- This describes the structure (what it IS)
- Not how to classify it (NUMERIC boundaries)
- Customers and internal teams can understand the archetype without seeing thresholds
- Proprietary boundaries remain protected

---

### Correction 2B: Remove Numeric Ranges From "Why This Granularity" Sections

**Current** (Throughout examples):
```
**Archetype Translation:**
- Employment Dominant → "primary employment income from a single employer"

Archetype has: "Forward Secured: 95%+, Variability: Very low (0.0-0.2), Stability Band: A, Persistence: 98%+"
```

**Proposed**:
Keep only the translation. Remove the numeric details entirely.

```
**Archetype Translation:**
- Employment Dominant → "primary employment income"

(No numeric ranges exposed)
```

**Rationale**:
- Implementers don't need the numeric boundaries to apply the rules
- The archetype name is sufficient
- Boundaries remain protected

---

### Correction 2C: Move Numeric Definitions to Internal-Only Documentation

**Proposed Structure**:

Create a SEPARATE internal document (not this standard):
```
CLASSIFICATION_BOUNDARIES_INTERNAL.md (CONFIDENTIAL)
- Not published
- Not in git repo accessible to customers
- Only for internal calibration teams
```

This standard references archetypes by NAME only. The numeric definitions live in protected internal docs.

```
Standard: "Primary Archetype: Employment Dominant"
↓
Readers look up: What is Employment Dominant?
↓
Answer: "Income that is primarily from W-2 employment with high continuity and low variability"
↓
(Implementation teams with access to CONFIDENTIAL docs know the numeric boundaries, but those boundaries aren't in this public standard)
```

---

## Impact Analysis

### Impact on Determinism

**Before Repair**: Positive (numeric thresholds help determinism)
- But: They leak proprietary information

**After Repair**: Still Positive
- Same logic applies (archetypes are deterministic)
- No information loss for implementation
- Just archetype NAMES are used, not numeric ranges
- Determinism is preserved because implementers have the archetype definitions elsewhere (in protected docs)

---

### Impact on Adoption

**Before Repair**: Potentially negative
- Wide audience sees classification boundaries
- Competitors understand our calibration
- Regulators could ask "Why these thresholds?"

**After Repair**: Positive
- Standard remains clean and non-proprietary
- Doesn't leak trade secrets
- Can be shared more widely without IP risk

---

### Impact on Category Protection

**Before Repair**: Neutral
- Numeric definitions don't violate category protection directly
- But: Exposing thresholds could allow competitors to game the system or critique our calibration

**After Repair**: Positive
- Standard remains credible
- Thresholds stay proprietary
- No ability to reverse-engineer classification logic

---

---

# CRITICAL ISSUE #3: SOFT DETERMINISM (Subjective Qualifiers)

## Root Cause

Multiple rules use soft/subjective language that allows different interpretations from the same input:

- Line 602: "Include secondary only when it **materially adds** to understanding" (unquantified)
- Line 241: "Support structure is **close to** typical Demand Profile" (unquantified)
- Line 677: "customer's support structure **aligns with** Demand Profile" (unquantified)
- Rule G3 (Lines 717-759): "**High variability** → specify" (no threshold defined)
- Line 622: "**at least 60%** of support characteristics" (undefined: which characteristics?)

These allow different implementers to produce different outputs from identical inputs.

## Why This Violates Locked RunPayway Standard

**Violation of Master Prompt Section 23 (Trust Standard)**:

"The same measured inputs must always produce the same classification."

**Specific Violations**:

1. "Materially adds" is subjective
   - Does 10% secondary material? 20%? 30%?
   - Different interpretations = different outputs
   - VIOLATES determinism requirement

2. "Close to" and "aligns with" are subjective
   - No numeric threshold for "close"
   - Violates determinism requirement

3. "High variability" without numeric threshold
   - Is Variability 0.4 "high"? 0.5? 0.6?
   - Different implementers answer differently
   - Violates determinism requirement

---

## Proposed Corrections

### Correction 3A: Replace "Materially Adds" With Numeric Threshold

**Current** (Line 602):
```
Rule S1: "Include a secondary archetype only when it materially adds to understanding."
```

**Problem**: "Materially adds" is undefined.

**Proposed**:
```
Rule S1: "Include a secondary archetype only when it represents ≥15% of overall support structure."

Rationale: 
- <15%: Secondary is too minor to affect comparison group understanding
- ≥15%: Secondary meaningfully changes the comparison peer group
- This is deterministic (can be measured from input data)
```

**Implementation Logic**:
```
IF secondary_support_percentage >= 15%:
  INCLUDE secondary in Compared With statement
ELSE:
  OMIT secondary (use primary only)
```

---

### Correction 3B: Replace "Close To" / "Aligns With" With Numeric Threshold

**Current** (Lines 241, 677):
```
Rule G1: "Support structure is close to typical Demand Profile"
Rule G2: "Support structure diverges meaningfully from typical Demand Profile"
```

**Problem**: No numeric threshold for "close" or "diverges meaningfully."

**Proposed**:
```
Rule G1: "When primary archetype MATCHES the typical archetype for Decision Type
         (same archetype name as Demand Profile expectation)"
  → Use BROAD description

Rule G2: "When primary archetype DIFFERS from typical archetype for Decision Type
         (different archetype name than Demand Profile expectation)"
  → Use SPECIFIC description
```

**Implementation Logic**:
```
Demand Profile for Home Purchase: "Typically supported by Employment Dominant archetype"

IF primary_archetype == "Employment Dominant":
  Granularity = BROAD
  Output: "Home purchases supported by employment income."
  
ELSE IF primary_archetype != "Employment Dominant":
  Granularity = SPECIFIC
  Output: "Home purchases supported by [specific archetype translation]."
```

**Rationale**:
- No subjectivity: Either archetype matches or it doesn't
- Deterministic: Same input always produces same output
- Clear boundary: Match vs. different archetype names

---

### Correction 3C: Define "High Variability" With Numeric Threshold

**Current** (Rule G3, Line 721):
```
"1. Income Variability
   - High variability → specify the variation nature
   - Low variability → broad description is fine"
```

**Problem**: No numeric threshold for "high."

**Proposed**:
Use the archetype definitions as thresholds:

```
Rule G3 (Revised): Specificity Drivers

1. Income Variability Threshold
   - Variability ≤ 0.3: Low → broad description
   - Variability > 0.3: High → specific description
   
   Based on archetype definitions:
   - Employment Dominant: Variability 0.0-0.2 → clearly LOW
   - Transaction Dominant: Variability 0.65-0.8 → clearly HIGH
   - Threshold 0.3 = conservative boundary (triggers specificity at moderate variability)
```

**Implementation Logic**:
```
IF variability_score <= 0.3:
  Specify_income_variability = false
ELSE IF variability_score > 0.3:
  Specify_income_variability = true
```

---

### Correction 3D: Define "Support Characteristics" in 60% Rule

**Current** (Line 622):
```
"The primary archetype should represent at least 60% of support characteristics."
```

**Problem**: "Support characteristics" is undefined. Does it mean:
- 60% of Forward Secured amount?
- 60% of all 5 conditions equally weighted?
- 60% of just continuity/concentration?

**Proposed**:
```
Rule S2 (Revised): Primary Archetype Dominance

"The primary archetype should represent at least 60% of overall support structure magnitude
 (measured by support amount or income contribution to the decision)."

Clarification:
- Primary archetype = the archetype describing the majority support source
- 60% threshold = primary source must be ≥60% of total support
- Measured by: Income contribution, savings amount, or business revenue (decision-specific)

Example:
- Customer has: $100k employment + $40k commission = $140k total
- Employment dominance: 100/140 = 71% > 60% ✓ Primary
- Commission dominance: 40/140 = 29% < 60% ✗ Secondary
```

**Implementation Logic**:
```
primary_dominance_pct = primary_support_amount / total_support_amount

IF primary_dominance_pct >= 0.60:
  Assignment is VALID (primary is primary)
ELSE IF primary_dominance_pct < 0.60:
  SWAP: Make secondary the primary
```

---

## Impact Analysis

### Impact on Determinism

**Before Repair**: VIOLATED
- Soft qualifiers allow multiple interpretations
- Same input could produce different outputs

**After Repair**: FULLY DETERMINISTIC
- All rules use numeric thresholds or clear logical conditions
- Same input always produces same output
- No subjective interpretation possible

---

### Impact on Adoption

**Before Repair**: Negative
- Implementers get different results
- Inconsistency across reports reduces trust

**After Repair**: Positive
- All reports are consistent
- Customers see same Compared With for same situation
- Trust increases due to consistency

---

### Impact on Category Protection

**Before Repair**: Neutral
- Soft determinism doesn't violate category protection directly
- But: Inconsistency could make it look like judgment-based

**After Repair**: Positive
- Determinism proves it's rule-based, not judgment-based
- Strengthens trust that this is measurement, not advice

---

---

# CRITICAL ISSUE #4: UNLOCKED DEPENDENCY (Demand Profiles)

## Root Cause

The entire granularity framework (Rules G1-G4) depends on "Demand Profiles" that are:
- Acknowledged in the locked Master Prompt (Section 12)
- But NOT defined in detail

This standard invents Demand Profile definitions without authorization:
```
Lines 219-237:
"Home Purchase typically demands:
- Duration: 30 years
- Magnitude: $30,000-$60,000/year
- Continuity: Recurring
- Required characteristics: Stability focus"
```

If Demand Profiles are later defined differently (or locked), this standard breaks.

## Why This Violates Locked RunPayway Standard

**Violation of Master Prompt Section 12 (Demand Profiles)**:

```
"Demand Profiles™ define the typical support requirements associated with each Decision Type™.
Demand Profiles are internal measurement standards."
```

The Master Prompt acknowledges Demand Profiles but does NOT define them in detail.

**The Problem**:
- This standard CREATES definitions for Demand Profiles
- Those definitions are not in the locked Master Prompt
- If Demand Profile definitions are later locked (differently), this standard is outdated
- The granularity rules become dependent on a moving target

**Specific Violations**:

1. Invents Demand Profile definitions not in Master Prompt
2. Uses invented definitions to drive granularity rules
3. Creates single point of failure: If Demand Profiles change, granularity rules break

---

## Proposed Corrections

### Correction 4A: Option 1 — Lock Demand Profiles First (Preferred)

**Proposed**:
Before finalizing this standard, create and lock:
```
DEMAND_PROFILES_STANDARD_V1.0.md

Define for each Decision Type:
- Duration requirement (months/years)
- Magnitude requirement (amount range)
- Continuity requirement (recurring, flexible, etc.)
- Typical archetype expectation
- Variability tolerance
```

Then reference locked Demand Profiles in this standard.

**Example**:
```
Rule G1 (Revised): "When primary archetype MATCHES the archetype defined in the locked Demand Profile for the Decision Type"

This standard then says:
"Reference: DEMAND_PROFILES_STANDARD_V1.0.md, Section 3.1 (Home Purchase)"

No invention of demand characteristics in THIS standard.
```

**Effort**: Significant (requires creating and locking a new standard)

---

### Correction 4B: Option 2 — Remove Granularity Rules (Conservative)

**Proposed**:
If Demand Profiles aren't locked, REMOVE all granularity rules from this standard.

Keep only:
- Archetype translations
- Primary/Secondary modifier rules
- Output format rules

Remove:
- Rule G1 (Broad when alignment is high)
- Rule G2 (Specific when divergence is high)
- Rule G3 (Specificity drivers)
- Rule G4 (Don't over-specify)

**Rationale**:
- Removes dependency on undefined Demand Profiles
- Makes this standard independent and locked
- Granularity decisions move to implementation layer (can be adjusted as Demand Profiles are defined)

**Trade-off**: Less prescriptive guidance on granularity, but more defensible.

---

### Correction 4C: Option 3 — Explicit Input Dependency (Pragmatic)

**Proposed**:
Keep granularity rules BUT make Demand Profile a required LOCKED INPUT.

Add to Section 3 (Generation Inputs):
```
**REQUIRED INPUT (Must be locked before implementation)**:

4. **Demand Profile™** (LOCKED STANDARD REQUIRED)
   - Must be defined in: DEMAND_PROFILES_STANDARD_V1.0.md
   - Specifies typical support requirements for each Decision Type
   - Granularity rules depend on this input being locked
   - If Demand Profiles change, this standard requires re-audit
```

Add to Section 3:
```
PREREQUISITE FOR LOCK:
This standard cannot be locked until Demand Profiles are locked in a separate standard.
```

**Rationale**:
- Acknowledges the dependency explicitly
- Makes clear what's required before implementation
- Allows standard to remain as-is, but with clear prerequisite

---

## Recommendation

**Preferred Approach**: Correction 4B (Remove Granularity Rules)

**Rationale**:
1. Makes this standard completely independent
2. Removes moving-target dependency
3. Still allows implementation teams to apply granularity logic at implementation time (when Demand Profiles are defined)
4. Cleaner separation of concerns: This standard defines HOW to compare, not WHY (that's Demand Profiles)

---

## Impact Analysis

### Impact on Determinism

**Before Repair** (with invented Demand Profiles): Brittle
- Deterministic NOW, but breaks if Demand Profiles are redefined

**After Repair (Option 2)**: Stable
- Deterministic independent of external changes
- Granularity applied at implementation time (after Demand Profiles are locked)

**After Repair (Option 1)**: Stable
- Deterministic if Demand Profiles are locked
- But adds dependency: Both standards must stay in sync

---

### Impact on Adoption

**Before Repair**: Negative
- Granularity feels arbitrary without locked Demand Profile justification

**After Repair (Option 2)**: Neutral
- No granularity guidance in this standard
- Cleaner, simpler standard

**After Repair (Option 1)**: Positive
- Granularity has clear justification (locked Demand Profiles)
- More prescriptive guidance

---

### Impact on Category Protection

**Before Repair**: Neutral
- Inventing Demand Profiles doesn't violate category protection directly
- But: Suggests we're making quality judgments (typical = good)

**After Repair**: Positive
- Removes invented assumptions
- Cleaner, purer measurement framework

---

---

# CRITICAL ISSUE #5: UNSOURCED CALIBRATION (60% Threshold)

## Root Cause

Rule S2 (Line 622) specifies:

```
"The primary archetype should represent at least 60% of support characteristics."
```

This 60% threshold has NO source. It's not in:
- The locked Master Prompt
- The INCOME_STRUCTURE_ARCHETYPE_INVESTIGATION.md
- Any other locked standard

It appears invented for this standard.

## Why This Violates Locked RunPayway Standard

**Violation of Master Prompt Section 23 (Trust Standard)**:

"The same measured inputs must always produce the same classification."

And: "A measurement standard should be trusted because it consistently produces results that can be understood, explained, and reproduced."

**The Problem**:
- Can we explain WHERE 60% comes from? No.
- If a CFO/regulator asks "Why 60% and not 70%?" what's the answer?
- No audit trail. No justification.
- This looks arbitrary, not measured.

---

## Proposed Corrections

### Correction 5A: Source the 60% Threshold

**Investigation Required**:

Before rewriting, answer:
1. Does 60% exist in locked standards? (Search: INCOME_STRUCTURE_ARCHETYPE_INVESTIGATION.md, Master Prompt)
2. Is there a measurement basis? (E.g., "60% is the statistical threshold where primary/secondary distinction matters")
3. Is there a design decision? (E.g., "We chose 60% to ensure secondary is meaningful but not confusing")

**If Found**: Document source in standard
```
Rule S2: "Primary archetype should represent at least 60% of support characteristics.

Source: [cite locked standard or measurement data]
Rationale: [explain why 60% was chosen]"
```

---

### Correction 5B: Change to Different Threshold (If No Source Found)

**Option 1**: Use 70% (higher confidence that primary dominates)
```
Rule S2: "Primary archetype should represent at least 70% of support characteristics."

Rationale: Ensures primary archetype is clearly dominant; secondary is clearly subordinate.
```

**Option 2**: Use "More than 50%" (simple majority)
```
Rule S2: "Primary archetype should represent more than 50% of support characteristics."

Rationale: Primary = larger source; secondary = smaller source. Simple rule.
```

**Option 3**: Use "At least as much as secondary + X%" (relative, not absolute)
```
Rule S2: "Primary archetype should represent at least 1.5x the secondary amount."

Rationale: Primary must be substantially larger than secondary.
Example: Primary 60%, Secondary 40% → Ratio 1.5:1 ✓
```

---

### Correction 5C: Document Decision Rationale

**Proposed**:
Whatever threshold is chosen, document in the standard:

```
Rule S2: "Primary Dominance Threshold"

Threshold: [X]% of support structure

Rationale:
- Why this percentage? [Business logic or measurement justification]
- What happens if threshold is violated? [Swap primary/secondary]
- Is this threshold revisable? [Yes, locked at v1.0 but can change in v1.1+]

Locked at: June 19, 2026, version 1.0
Change history: [If changed later, document when and why]
```

---

## Impact Analysis

### Impact on Determinism

**Before Repair**: Negative
- 60% is unjustified, which could lead people to question the rule
- But: The rule itself IS deterministic (either ≥60% or <60%)

**After Repair**: Positive
- If sourced: rule is trustworthy and deterministic
- If documented: people understand the rationale
- Justification increases confidence in the standard

---

### Impact on Adoption

**Before Repair**: Negative
- "Why 60%" is a question with no answer
- Looks arbitrary, which reduces confidence

**After Repair**: Positive
- Clear rationale for the threshold
- Increases user confidence in the standard

---

### Impact on Category Protection

**Before Repair**: Neutral
- Unsourced threshold doesn't violate category protection
- But: Makes standard look less rigorous

**After Repair**: Positive
- Justified thresholds strengthen claims of objectivity and measurement

---

---

# SUMMARY: WHAT TO PRESERVE, REMOVE, REWRITE, REVALIDATE

## A. WHAT REMAINS UNCHANGED

These elements are solid and need no repair:

✅ **Overall Structure & Format**
- 8 archetype set
- Public output hierarchy (Decision Type → Measurement → Position → Compared With → etc.)
- Template-based approach
- 22 example outputs (with justifications rewritten)

✅ **Archetype Sourcing**
- All 7 archetype names are correct
- Structural descriptions are appropriate
- Translation quality is good

✅ **Primary/Secondary Rules**
- Modifier logic ("with" vs. "and") is sound
- "With" for complementary, "And" for independent is correct concept

✅ **Public Boundary Concept**
- Protecting proprietary logic is the right goal
- Just need to enforce it better

✅ **3-Second Test Framework**
- Adoption validation is good
- 8/9 examples pass; edge case (3-part) can be refined

---

## B. WHAT MUST BE REMOVED

These elements violate locked standards and must be deleted:

❌ **Remove: All Numeric Archetype Definitions** (Lines 275-507)

Delete for all 7 archetypes:
```
**Internal Definition**:
- Forward Secured: 95%+
- Variability: Very low (0.0-0.2)
- Stability Band: A
- Persistence: 98%+
```

**Rationale**: These are proprietary "Classification Boundaries™"

**Impact**: Standard remains deterministic; boundaries move to protected internal docs

---

❌ **Remove: "Emphasize Risk" Labels** (Lines 431, 465)

Delete from Archetype 5 and 6 translations:
```
"Emphasize risk" context label
```

**Rationale**: Advisory language that violates category protection

---

❌ **Remove: All Advisory Language From Example Justifications**

Examples to fix:
- Line 1176: "cannot reliably sustain" → "operates differently than"
- Line 1230: "concentration is the key risk factor" → "concentration is a defining structural characteristic"
- Line 1331-1332: "riskier" → "operates differently"
- Line 1435-1436: "risky" → "operates differently"

**Rationale**: Measurement, not judgment

---

❌ **Remove: Invented Demand Profile Definitions** (Lines 219-237)

Either:
- Option 1: Keep IF Demand Profiles are locked separately
- Option 2: Remove if Demand Profiles won't be locked
- Option 3: Make Demand Profile a required locked input

**Rationale**: Can't invent locked standards

---

❌ **Remove: Unsourced 60% Threshold Explanation** (Line 622)

Either:
- Source it from locked standard
- Document the decision rationale
- Or adjust to a different percentage

**Rationale**: Thresholds must be defensible

---

## C. WHAT MUST BE REWRITTEN

These elements need substantive changes:

🔄 **Rewrite: Archetype Translations (Remove "Stable")**

**Current**:
```
Employment Dominant → "stable employment income"
```

**Proposed**:
```
Employment Dominant → "employment-based income from a single employer"
```

(Describes structure, removes judgment word "stable")

---

**Current**:
```
Stable Base With Earned Overlay → "a base salary with variable earning potential"
```

**Proposed**:
```
Stable Base With Earned Overlay → "employment income with additional earned compensation"
```

(Removes "stable"; describes mechanism)

---

🔄 **Rewrite: Granularity Rules (Make Deterministic)**

**Current** (Rule G1, Line 241):
```
"Support structure is close to typical Demand Profile" → BROAD
```

**Proposed**:
```
"Primary archetype MATCHES typical archetype from Demand Profile" → BROAD
"Primary archetype DIFFERS from typical archetype from Demand Profile" → SPECIFIC
```

(Deterministic: Match or don't match, no subjectivity)

---

🔄 **Rewrite: Specificity Drivers (Add Numeric Thresholds)**

**Current** (Rule G3, Line 721):
```
"High variability → specify"
```

**Proposed**:
```
"Variability > 0.3 → specify"
```

(Numeric threshold based on archetype definitions)

---

🔄 **Rewrite: Rule S1 (Materially Adds)**

**Current**:
```
"Include secondary only when it materially adds to understanding"
```

**Proposed**:
```
"Include secondary archetype when it represents ≥15% of overall support structure"
```

(Numeric, deterministic)

---

🔄 **Rewrite: All "Why This Granularity" Sections**

Remove judgment language. Use pure structural description.

**Current Example**:
```
"- LOW alignment with demand (transaction income cannot reliably sustain 30-40 year retirement)"
```

**Proposed**:
```
"- Diverges from typical (transaction-based income operates differently from typical retirement support models)"
```

---

🔄 **Rewrite: Rule S2 (60% Threshold)**

Either:
- Source the 60% from locked standard
- Document rationale for the 60% choice
- Change to different threshold if no source

**Current**:
```
"The primary archetype should represent at least 60% of support characteristics."
(No source, no rationale)
```

**Proposed**:
```
"The primary archetype should represent at least 60% of total support amount/magnitude.

Rationale: Ensures primary is clearly dominant; secondary is clearly supplementary.
Threshold locked v1.0: June 19, 2026. Change requires new version."
```

---

## D. WHAT MUST BE REVALIDATED

After rewrites, these elements need re-testing:

🔍 **Revalidate: 3-Second Test**

After all rewrites, re-run all 22 examples through 3-second clarity test.

Expected result: All should pass (8/9 already pass before rewrites)

---

🔍 **Revalidate: Determinism Check**

After making rules numeric/deterministic, verify:
- Same input always produces same output
- No subjective qualifiers remain
- All thresholds are numeric or logical

Expected result: 100% deterministic (vs. current soft determinism)

---

🔍 **Revalidate: Category Protection Check**

After removing judgment language, scan for:
- "Risk," "risky," "safer," "stable," "strong," "weak"
- Predictive claims ("will," "cannot sustain," "likely")
- Advisory language ("should," "recommend," "better")

Expected result: Zero violations (vs. current 6+ violations)

---

🔍 **Revalidate: Proprietary Boundary Check**

After removing numeric definitions, verify:
- No numeric thresholds exposed
- No calibration methodology visible
- Only archetype NAMES and translations public

Expected result: Fully protected IP

---

🔍 **Revalidate: CFO/Underwriter Audit**

After rewrites, re-run Section 8-9 of this audit.

Expected result:
- CFO accepts deterministic thresholds as defensible
- Underwriter accepts structural comparison logic
- No exposed proprietary logic

---

🔍 **Revalidate: Consumer Clarity**

After rewrites, apply 3-second test to final outputs.

Expected result: Customers understand comparison group without framework knowledge

---

---

# NEXT STEP

Once this repair plan is approved:

1. **Lock the decisions** (Which corrections apply? 4A, 4B, or 4C for Demand Profiles?)
2. **Rewrite the standard** using these corrections
3. **Re-audit** against the repaired version
4. **Lock the final version**

Currently: REPAIR PLAN ONLY (not approved yet)

---

**Plan Status**: Ready for user approval  
**Next Action**: User reviews plan → Approves/modifies → Implementation proceeds
