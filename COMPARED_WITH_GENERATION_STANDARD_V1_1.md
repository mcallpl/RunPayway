# Compared With Generation Standard™ v1.1

**Status**: LOCKED  
**Version**: 1.1 (Revised)  
**Date**: June 19, 2026  
**Lock Date**: June 19, 2026  
**Previous Version**: v1.0 (superseded)  

---

## PURPOSE

Generate the public-facing **Compared With** statement that answers the customer's natural question:

> Compared with who?

This standard is a **communication layer only**. It translates internal archetype assignments into plain-English comparison groups that customers immediately understand.

This standard does NOT:
- Evaluate or score archetypes
- Interpret structural characteristics
- Advise whether a situation is good or bad
- Determine whether archetypes should be primary or secondary
- Calibrate classification boundaries

Archetype assignment (primary vs. secondary) is handled by the Support Structure Archetype Standard™.

Compared With Generation Standard™ simply translates those assignments into customer-facing language.

---

## CORE PRINCIPLE

**Compared With identifies the structural peer group in plain language.**

RunPayway compares situations by how the supporting structure behaves—not by job title, income amount, or industry.

Example:

```
Internal: "Primary: Employment Dominant archetype, Secondary: Transaction Dominant archetype"
↓
Translation: "Home purchases supported primarily by stable employment income with variable commission support"
```

The customer immediately understands: "I'm being compared to others with employment + variable commission structure."

---

## GOVERNANCE CLARIFICATION

**Comparison Translation Archetypes™** are implementation-layer translation constructs used exclusively for Compared With™ generation.

They do not replace, modify, supersede, or redefine the locked Support Structure Archetype™ framework.

**Support Structure Archetypes™ remain the governing measurement standard.**

Comparison Translation Archetypes™ exist solely to translate measurement outputs into consumer-readable comparison language.

The 7 archetypes in this standard (Employment Dominant, Stable Base With Earned Overlay, etc.) are translation labels that map 1:1 to Support Structure Archetypes™ for communication purposes only.

---

## PUBLIC QUESTION ANSWERED

**Customer asks**: "Typical compared to who?"

**Compared With answers**: "Here's the structural comparison group."

The customer should understand in 3 seconds:
1. What type of decision they're evaluating
2. What type of supporting structure defines their peer group
3. That this is structural, not occupational

---

## GENERATION INPUTS

**Required Inputs** (must be present):

1. **Decision Type™**
   - Home Purchase
   - Vehicle Purchase
   - Retirement
   - Career Change
   - Business Launch
   - Business Acquisition
   - Business Expansion
   - Employee Hire
   - Investment Property
   - Other Financial Commitment

2. **Primary Support Structure Archetype™**
   - Assigned by Support Structure Archetype Standard™
   - One of: 7 locked archetypes or "Other"
   - Required for every report

3. **Secondary Support Structure Archetype™** (optional)
   - Assigned by Support Structure Archetype Standard™
   - Present only if dual-support structure exists
   - May be null

**All inputs are determined by upstream standards. Compared With Generation Standard™ consumes these inputs as-is and does not re-evaluate them.**

If inputs are missing or invalid, the report cannot be generated. Return error.

---

## ARCHETYPE TRANSLATION RULES

Transform internal archetype names into customer-facing language.

**CRITICAL**: Never expose internal archetype names or numeric definitions in customer-facing output.

---

### Archetype 1: Employment Dominant

**Translation Options**:

- **Standard**: "employment income"
- **Specific**: "employment-based income from a single employer"
- **With context**: "primary employment income"

**Usage**:
- Use "employment income" in most cases (clear, concise)
- Use "primary employment income" only when secondary archetype needs emphasis
- Use "employment-based income from a single employer" if occupational clarification is helpful

**Examples**:
- "Home purchases supported by employment income."
- "Retirement decisions supported by primary employment income."
- "Vehicle purchases supported by employment-based income from a single employer."

---

### Archetype 2: Stable Base With Earned Overlay

**Translation Options**:

- **Standard**: "a base salary with variable earning potential"
- **Alternative**: "base compensation with earned income"
- **Specific**: "guaranteed base compensation and performance-based earnings"

**Usage**:
- Use "base salary with variable earning potential" in most cases
- Use "base compensation with earned income" for formal/professional tone
- Use full form only if distinction between guaranteed/earned is critical to understanding

**Examples**:
- "Home purchases supported by a base salary with variable earning potential."
- "Business launches supported by base compensation with earned income."
- "Retirement decisions supported by guaranteed base compensation and performance-based earnings."

---

### Archetype 3: Recurring-Plus-Project

**Translation Options**:

- **Standard**: "recurring client base with project-based income"
- **Alternative**: "recurring contracts supplemented by project revenue"
- **Specific**: "a mix of recurring retainer income and project-based revenue"

**Usage**:
- Use "recurring client base with project-based income" in most cases
- Use specific form if detailed structure needs emphasis
- Use alternative for formal contexts

**Examples**:
- "Business launches supported by recurring client base with project-based income."
- "Home purchases supported by recurring contracts supplemented by project revenue."
- "Retirement decisions supported by a mix of recurring retainer income and project-based revenue."

---

### Archetype 4: Multi-Component Hybrid

**Translation Options**:

- **Standard**: "multiple income types from a single source"
- **Alternative**: "mixed earned and passive income"
- **Specific**: "base compensation and alternative income (commission, bonus, or assets under management)"

**Usage**:
- Use "multiple income types from a single source" for conciseness
- Use "mixed earned and passive income" when composition is important
- Use specific form with parenthetical only when clarification is essential

**Examples**:
- "Retirement decisions supported by multiple income types from a single source."
- "Home purchases supported by mixed earned and passive income."
- "Business launches supported by base compensation and alternative income (commission, bonus, or assets under management)."

---

### Archetype 5: Transaction Dominant

**Translation Options**:

- **Standard**: "variable, transaction-based income"
- **Alternative**: "income dependent on completed transactions"
- **Specific**: "transaction-driven income with minimal guaranteed base"

**Usage**:
- Use "variable, transaction-based income" in most cases (clear, concise)
- Use alternative for formal tone
- Use specific form only if "minimal guaranteed base" distinction is important

**Examples**:
- "Home purchases supported by variable, transaction-based income."
- "Vehicle purchases supported by income dependent on completed transactions."
- "Retirement decisions supported by transaction-driven income with minimal guaranteed base."

---

### Archetype 6: Single-Client Transaction Dependent

**Translation Options**:

- **Standard**: "revenue concentrated with a single primary client"
- **Alternative**: "income from a single major client"
- **Specific**: "transaction-dependent revenue from a single client"

**Usage**:
- Use "revenue concentrated with a single primary client" to emphasize concentration
- Use "income from a single major client" for simpler tone
- Use specific form if transaction nature needs emphasis

**Examples**:
- "Business expansions supported by revenue concentrated with a single primary client."
- "Home purchases supported by income from a single major client."
- "Career changes supported by transaction-dependent revenue from a single client."

---

### Archetype 7: Platform-Mediated Gig

**Translation Options**:

- **Standard**: "gig economy or platform-mediated income"
- **Alternative**: "income from gig platforms"
- **Specific**: "platform-based gig income with variable availability"

**Usage**:
- Use "gig economy or platform-mediated income" in most cases
- Use alternative for conversational tone
- Use specific form if platform-dependence is important to emphasize

**Examples**:
- "Home purchases supported by gig economy or platform-mediated income."
- "Vehicle purchases supported by income from gig platforms."
- "Retirement decisions supported by platform-based gig income with variable availability."

---

### Archetype 8: Other

**When Used**:
If the support structure doesn't fit the 7 defined archetypes.

**Translation**:
Describe the actual structure in plain language.

**Example**:
```
Instead of: "Supported by Other"
Use: "Supported by a combination of employment income and real estate investment returns"
```

---

## PRIMARY ARCHETYPE RULES

How the primary archetype appears in Compared With statements.

### Rule P1: Always Translate

The primary archetype must be translated to plain language.

**Standard Template**:
```
[Decision Type] supported by [archetype translation].
```

**Examples**:
```
Home purchases supported by employment income.
Business launches supported by recurring client base with project-based income.
Retirement decisions supported by gig economy or platform-mediated income.
```

---

### Rule P2: Use Parallel Language Structure

All archetype translations should use parallel grammatical structure.

**Parallel** ✅:
```
"supported by employment income"
"supported by a base salary with variable earning potential"
"supported by variable, transaction-based income"
"supported by multiple income types"
```

**Not Parallel** ❌:
```
"supported by people who are employed"
"supported by a salary structure with earning potential"
"supported by transactions as primary income source"
"supported by multiple types of people"
```

Use consistent grammar across all translations.

---

### Rule P3: Positive Framing (Describe What IS, Not What ISN'T)

Describe the structure that exists, not what's absent.

**Positive** ✅:
```
"Supported by variable, transaction-based income."
```

**Negative** ❌:
```
"Supported by income without a stable base."
```

Positive framing is clearer and more professional.

---

## SECONDARY ARCHETYPE RULES

How the secondary archetype modifies the primary.

### Rule S1: Secondary Only When Present

Include a secondary archetype in the statement ONLY if the Support Structure Archetype Standard™ has assigned one.

Do not invent or assume secondary archetypes.

**If secondary exists**: Use modifier rule below.  
**If secondary is null**: Use primary only.

---

### Rule S2: Structural Relationship Determines Modifier

The modifier word ("with" vs. "and") depends on how the archetypes relate structurally.

**Use "with" (secondary enhances/supports primary)**:

When secondary reinforces, supplements, or builds on primary.

```
"Supported primarily by [primary] with [secondary] support"

Examples:
- "Home purchases supported primarily by employment income with variable commission support"
- "Business launches supported primarily by operating business revenue with personal employment income"
```

**Use "and" (independent structures)**:

When secondary is structurally independent of primary.

```
"Supported by [primary] and [secondary]"

Examples:
- "Retirement decisions supported by employment income and portfolio assets"
- "Investment properties supported by employment income and rental property revenue"
```

**Test**: If secondary can exist without primary, use "and". If secondary depends on primary, use "with".

---

## PUBLIC LANGUAGE RULES

Compared With statements must be immediately clear to customers and professionals simultaneously.

### Rule L1: Plain English Only

**Plain English** ✅:
```
"Supported by a base salary with variable earning potential."
```

**Framework Language** ❌:
```
"Supported by an Employment Dominant archetype with overlay characteristics."
```

Never expose internal framework terminology.

---

### Rule L2: Active, Descriptive Language

**Active** ✅:
```
"Supported by variable, transaction-based income."
```

**Passive** ❌:
```
"By income that varies based on completed transactions."
```

Use direct language about the structure's behavior.

---

### Rule L3: Professional Tone (All Audiences)

Language must be appropriate simultaneously for:
- Consumer (no jargon)
- CFO (defensible, precise)
- CFP (structurally clear)
- Underwriter (unambiguous)

**Professional** ✅:
```
"Business launches supported by operating business revenue."
```

**Too Casual** ❌:
```
"Business launches where the owner's business is already making money."
```

**Too Technical** ❌:
```
"Business launches supported by incumbent operating revenue streams exceeding exit thresholds."
```

---

### Rule L4: No Judgment Language

Do not use words that evaluate whether the structure is good, bad, risky, safe, or likely.

**Prohibited**:
- risky, riskier, risk factor
- safe, safer, safest
- stable (implies reliability judgment)
- strong, stronger, weak, weaker
- reliable, unreliable
- challenging, difficult
- cannot sustain, likely to sustain
- sufficient, insufficient
- solid, fragile
- secure, insecure

**Why**: RunPayway measures dependence, not quality. Avoid judgment language.

**Examples**:

Bad:
```
"Supported by a risky income structure."
"Supported by less stable compensation."
"Cannot reliably support long-term decisions."
```

Good:
```
"Supported by variable, transaction-based income."
"Supported by performance-dependent compensation."
"Supported by income that varies year-to-year."
```

---

## EXAMPLE LIBRARY

22 examples demonstrating correct Compared With generation across decision types and archetype combinations.

---

### HOME PURCHASE EXAMPLES

#### Example 1: Employment Dominant

**Input**:
- Decision Type: Home Purchase
- Primary Archetype: Employment Dominant
- Secondary Archetype: None

**Output**:
```
Compared With
Home purchases supported by employment income.
```

---

#### Example 2: Stable Base With Earned Overlay

**Input**:
- Decision Type: Home Purchase
- Primary Archetype: Stable Base With Earned Overlay
- Secondary Archetype: None

**Output**:
```
Compared With
Home purchases supported by a base salary with variable earning potential.
```

---

#### Example 3: Transaction Dominant

**Input**:
- Decision Type: Home Purchase
- Primary Archetype: Transaction Dominant
- Secondary Archetype: None

**Output**:
```
Compared With
Home purchases supported by variable, transaction-based income.
```

---

#### Example 4: Multi-Component Hybrid

**Input**:
- Decision Type: Home Purchase
- Primary Archetype: Multi-Component Hybrid
- Secondary Archetype: None

**Output**:
```
Compared With
Home purchases supported by multiple income types from a single source.
```

---

#### Example 5: Recurring-Plus-Project

**Input**:
- Decision Type: Home Purchase
- Primary Archetype: Recurring-Plus-Project
- Secondary Archetype: None

**Output**:
```
Compared With
Home purchases supported by recurring client base with project-based income.
```

---

#### Example 6: Employment Dominant (Primary) + Commission (Secondary)

**Input**:
- Decision Type: Home Purchase
- Primary Archetype: Employment Dominant
- Secondary Archetype: Stable Base With Earned Overlay (representing commission)

**Output**:
```
Compared With
Home purchases supported primarily by employment income with variable commission support.
```

---

#### Example 7: Platform-Mediated Gig

**Input**:
- Decision Type: Home Purchase
- Primary Archetype: Platform-Mediated Gig
- Secondary Archetype: None

**Output**:
```
Compared With
Home purchases supported by gig economy or platform-mediated income.
```

---

#### Example 8: Single-Client Transaction Dependent

**Input**:
- Decision Type: Home Purchase
- Primary Archetype: Single-Client Transaction Dependent
- Secondary Archetype: None

**Output**:
```
Compared With
Home purchases supported by revenue concentrated with a single primary client.
```

---

### RETIREMENT EXAMPLES

#### Example 9: Employment Dominant

**Input**:
- Decision Type: Retirement
- Primary Archetype: Employment Dominant
- Secondary Archetype: None

**Output**:
```
Compared With
Retirement decisions supported by employment income.
```

---

#### Example 10: Employment Dominant (Primary) + Portfolio Assets (Secondary)

**Input**:
- Decision Type: Retirement
- Primary Archetype: Employment Dominant
- Secondary Archetype: Multi-Component Hybrid (representing portfolio)

**Output**:
```
Compared With
Retirement decisions supported by employment income and portfolio assets.
```

---

#### Example 11: Transaction Dominant

**Input**:
- Decision Type: Retirement
- Primary Archetype: Transaction Dominant
- Secondary Archetype: None

**Output**:
```
Compared With
Retirement decisions supported by variable, transaction-based income.
```

---

#### Example 12: Recurring-Plus-Project (Consulting) + Portfolio (Secondary)

**Input**:
- Decision Type: Retirement
- Primary Archetype: Recurring-Plus-Project
- Secondary Archetype: Multi-Component Hybrid

**Output**:
```
Compared With
Retirement decisions supported by consulting income and portfolio assets.
```

---

### BUSINESS LAUNCH EXAMPLES

#### Example 13: Recurring-Plus-Project

**Input**:
- Decision Type: Business Launch
- Primary Archetype: Recurring-Plus-Project
- Secondary Archetype: None

**Output**:
```
Compared With
Business launches supported by recurring client base with project-based income.
```

---

#### Example 14: Single-Client Transaction Dependent

**Input**:
- Decision Type: Business Launch
- Primary Archetype: Single-Client Transaction Dependent
- Secondary Archetype: None

**Output**:
```
Compared With
Business launches supported by revenue concentrated with a single primary client.
```

---

#### Example 15: Recurring-Plus-Project (Primary) + Employment (Secondary)

**Input**:
- Decision Type: Business Launch
- Primary Archetype: Recurring-Plus-Project
- Secondary Archetype: Employment Dominant

**Output**:
```
Compared With
Business launches supported by recurring client base with project-based income and household employment income.
```

---

### CAREER CHANGE EXAMPLES

#### Example 16: Employment Dominant

**Input**:
- Decision Type: Career Change
- Primary Archetype: Employment Dominant
- Secondary Archetype: None

**Output**:
```
Compared With
Career changes supported by employment income.
```

---

#### Example 17: Employment Dominant (Primary) + Severance/Savings (Secondary)

**Input**:
- Decision Type: Career Change
- Primary Archetype: Employment Dominant
- Secondary Archetype: Multi-Component Hybrid

**Output**:
```
Compared With
Career changes supported by employment income and savings or severance package.
```

---

#### Example 18: Transaction Dominant

**Input**:
- Decision Type: Career Change
- Primary Archetype: Transaction Dominant
- Secondary Archetype: None

**Output**:
```
Compared With
Career changes supported by variable, transaction-based income.
```

---

### BUSINESS ACQUISITION EXAMPLES

#### Example 19: Recurring-Plus-Project

**Input**:
- Decision Type: Business Acquisition
- Primary Archetype: Recurring-Plus-Project
- Secondary Archetype: None

**Output**:
```
Compared With
Business acquisitions supported by operating business revenue.
```

---

#### Example 20: Single-Client Transaction Dependent (Primary) + Employment (Secondary)

**Input**:
- Decision Type: Business Acquisition
- Primary Archetype: Single-Client Transaction Dependent
- Secondary Archetype: Employment Dominant

**Output**:
```
Compared With
Business acquisitions supported primarily by revenue concentrated with a single primary client with personal employment income.
```

---

### INVESTMENT PROPERTY EXAMPLES

#### Example 21: Multi-Component Hybrid

**Input**:
- Decision Type: Investment Property
- Primary Archetype: Multi-Component Hybrid
- Secondary Archetype: None

**Output**:
```
Compared With
Investment properties supported by multiple income types from a single source.
```

---

#### Example 22: Dual-Earner: Employment (Primary) + Gig (Secondary)

**Input**:
- Decision Type: Home Purchase
- Primary Archetype: Employment Dominant
- Secondary Archetype: Platform-Mediated Gig

**Output**:
```
Compared With
Home purchases supported by primary employment income with supplemental gig-based income.
```

---

## DETERMINISTIC STANDARD

**The same inputs must always produce the same Compared With statement.**

### Determinism Rules

#### Rule D1: Input Consistency

Identical inputs produce identical output.

**Example**:
```
Input A: Decision Type = Home Purchase, Primary = Employment Dominant, Secondary = None
Output A: "Home purchases supported by employment income."

Input B: Decision Type = Home Purchase, Primary = Employment Dominant, Secondary = None
Output B: "Home purchases supported by employment income."

Output A == Output B ✓
```

---

#### Rule D2: No Subjective Qualifiers

Remove all language that introduces interpretation:
- "generally"
- "typically"
- "often"
- "usually"
- "may"
- "materially"
- "usually"
- "depending on"

Every rule uses:
- Clear logical conditions (IF/THEN)
- Defined categories (archetype names)
- No subjective assessment

---

#### Rule D3: Translation Consistency

Each archetype always translates to the same output in the same context.

**Example**:
```
Employment Dominant + Home Purchase = "Home purchases supported by employment income."

This is ALWAYS the output, never:
- "Home purchases supported by stable employment income"
- "Home purchases supported by primary employment income"
- Any other variation
```

(The "Standard" translation option is the default; alternatives exist only for specific contexts, not arbitrary preference.)

---

## PUBLIC BOUNDARY

This standard does NOT expose or contain:

❌ **Never expose**:
- Internal archetype names
- Classification boundaries
- Numeric thresholds (Forward Secured %, Variability scores, etc.)
- Stability bands
- Calibration metrics
- Benchmark datasets
- Classification assignment rules
- Demand profile specifications

✅ **Only public in this standard**:
- Archetype translation rules (plain English only)
- Modifier rules (with/and logic)
- Public language rules
- Example outputs
- Determinism guarantees

---

## CHANGES FROM v1.0

**Removed**:
- Archetype Internal Definitions (all numeric ranges)
- Granularity Rules (G1-G4)
- Refinement Rules
- Demand Profile logic
- 60% threshold logic
- Example "Why this granularity" justifications
- All advisory language examples
- Comparison group specificity drivers
- Unsourced calibration rules

**Streamlined**:
- Purpose (focused on communication only)
- Generation Inputs (removed Demand Profile input)
- Example Library (simplified, removed reasoning)

**Kept**:
- 7 Archetype translations (improved, no numeric definitions)
- Primary/Secondary modifier rules
- Public language rules
- 22 Example outputs
- Determinism standard
- Public boundary protection

**Result**: Standard is ~50% smaller, more focused, more defensible.

---

## VERSION CONTROL

**Compared With Generation Standard™ v1.1**

**Lock Date Pending**: Pending institutional audit  
**Status**: READY FOR AUDIT  
**Previous**: v1.0 (superseded)

This standard is now in audit phase. Changes after audit completion require version increment.

---

## END STANDARD

**Standard Size**: ~4,000 words (v1.0 was ~8,000)  
**Complexity**: Simplified (communication layer only)  
**Defensibility**: Improved (no invented rules or thresholds)  
**Public Exposure**: Reduced (no proprietary boundaries visible)

Ready for institutional audit before lock.
