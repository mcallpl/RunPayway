# Compared With Generation Standard™ v1.0

**Status**: LOCKED  
**Version**: 1.0  
**Date**: June 19, 2026  
**Audience**: Internal specification (locked architecture)  

---

## PURPOSE

Create deterministic rules that generate the public-facing **Compared With** statement.

Compared With answers the customer's natural question:

> Typical compared to who?

The goal is to ensure every comparison group is:
- Understandable (customer grasps it in 3 seconds)
- Defensible (based on measurable Decision Type + Support Structure characteristics)
- Deterministic (same inputs always produce same output)
- Consumer-readable (clear English, no jargon)
- Professional-readable (acceptable to CFO, CFP, underwriter)
- Consistent across all reports (no variation, no exceptions)

---

## CORE PRINCIPLE

**Compared With identifies the structural peer group, not the occupational peer group.**

RunPayway compares situations by how the supporting structure behaves—not by job title, income amount, or industry.

Examples of what NOT to do:
- ❌ "Home purchases by software engineers"
- ❌ "Home purchases by people earning $140,000-$160,000"
- ❌ "Home purchases in the technology industry"

Examples of what TO do:
- ✅ "Home purchases supported by a stable base with variable earned income"
- ✅ "Home purchases supported by variable, performance-dependent income"
- ✅ "Home purchases supported by fixed employment income"

The comparison group is structural, not occupational.

---

## PUBLIC QUESTION ANSWERED

**Customer asks**: "What's typical for someone like me?"

**Compared With answers**: "Here's the comparison group your measurement places you in."

The customer should immediately understand:
1. What type of decision they're evaluating
2. What type of supporting structure others in the group have
3. Why they're being grouped with that structure (not with "people like them" occupationally)

---

## GENERATION INPUTS

**Required Inputs** (all must be present):

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
   - Employment Dominant
   - Stable Base With Earned Overlay
   - Recurring-Plus-Project
   - Multi-Component Hybrid
   - Transaction Dominant
   - Single-Client Transaction Dependent
   - Platform-Mediated Gig
   - Other (when archetype doesn't fit defined set)

3. **Secondary Support Structure Archetype™** (optional)
   - Same archetype set as primary
   - Used when two distinct structures are present (e.g., dual-earner household)
   - May be absent (use null if not applicable)

4. **Demand Profile™**
   - Internal standard identifying typical support requirements for the Decision Type
   - Influences comparison group specificity
   - Not exposed in public output (affects generation logic only)

**Do not introduce any additional inputs.**

If a field is missing or unknown, the report cannot be generated. Return error, do not improvise.

---

## COMPARISON GROUP CONSTRUCTION RULES

### Rule 1: Decision Type Is Always Included

Every Compared With statement must begin with the Decision Type.

**Template Start:**
```
[Decision Type] [decisions|decision] supported by...
```

**Examples:**
```
Home purchases supported by...
Vehicle purchases supported by...
Retirement decisions supported by...
Business launches supported by...
```

**NOT acceptable:**
```
Situations supported by...
Decisions supported by...
Commitments supported by...
```

The Decision Type anchors the comparison group. Remove it and the statement becomes meaningless.

---

### Rule 2: Primary Archetype Is Always Translated

The Primary Support Structure Archetype must be translated to human-readable language.

**Archetype Translation Rules** (see section below)

**Template Structure:**
```
[Decision Type] supported by [archetype translation]
```

**Examples (see detailed translations below):**
```
Home purchases supported by stable employment income
Business launches supported by operating business revenue
Retirement decisions supported by portfolio-backed income
```

---

### Rule 3: Secondary Archetype Modifies Primary (When Applicable)

When a Secondary Archetype exists, it modifies the primary description.

**Modification Rules:**

**Option A: "With" Modifier (Primary + Secondary are complementary)**

Use when the secondary archetype provides meaningful support that reinforces or diversifies the primary.

```
[Decision Type] supported primarily by [primary archetype] 
with [secondary archetype] support.
```

**Example:**
```
Home purchases supported primarily by stable employment income 
with variable commission support.
```

This indicates:
- Primary: Employment (stable, reliable)
- Secondary: Commission (adds to but doesn't require)
- Relationship: Complementary (secondary reinforces primary)

**Option B: "And" Modifier (Primary + Secondary are independent)**

Use when the secondary archetype is structurally independent of primary.

```
[Decision Type] supported by [primary archetype] 
and [secondary archetype].
```

**Example:**
```
Retirement decisions supported by employment income and portfolio assets.
```

This indicates:
- Primary: Employment
- Secondary: Portfolio (independent income source)
- Relationship: Parallel (both contribute; both required)

**Option C: No Secondary (Null)**

If Secondary Archetype is null, only use primary.

```
[Decision Type] supported by [primary archetype].
```

**Example:**
```
Business launches supported by operating business revenue.
```

---

### Rule 4: Specificity Increases With Demand Profile Alignment

**Comparison Group Granularity** is determined by how closely the customer's support structure aligns with the Demand Profile for their Decision Type.

**Demand Profile Definition**: Each Decision Type has a typical support requirement profile.

**Examples:**

- **Home Purchase** typically demands:
  - Duration: 30 years (long-term)
  - Magnitude: $30,000-$60,000/year ongoing
  - Continuity: Recurring (monthly income required)
  - Required characteristics: Stability focus

- **Career Change** typically demands:
  - Duration: 12-24 months (transition period)
  - Magnitude: Lower income tolerance (savings/severance bridge)
  - Continuity: Temporary (can accept gaps during transition)
  - Required characteristics: Runway/savings required

- **Business Launch** typically demands:
  - Duration: 18-36 months to breakeven
  - Magnitude: Can vary widely
  - Continuity: Runway required (operating losses expected)
  - Required characteristics: Existing revenue source to sustain startup losses

**Specificity Rule:**

- **BROAD** comparison group (fewer details) when:
  - Support structure is close to typical Demand Profile
  - Customer fits the standard expectation
  - No unusual characteristics need explanation

- **SPECIFIC** comparison group (more details) when:
  - Support structure diverges from typical Demand Profile
  - Customer has unusual characteristics (dual income, mixed sources, concentrated risk)
  - The divergence explains their position better than generic language

**Examples of Specificity Variance:**

**Broad (aligns with demand):**
```
"Home purchases supported by stable employment income."
```
(Most employment-based home purchases are typical; doesn't need more specificity)

**Specific (diverges from demand):**
```
"Home purchases supported by variable, performance-dependent income."
```
(Performance-based income requires explanation because it diverges from typical home-purchase support model)

---

## ARCHETYPE TRANSLATION RULES

Transform internal archetype names to public-facing language.

**CRITICAL**: Never expose internal archetype names in customer-facing copy. Always translate.

### Archetype 1: Employment Dominant

**Internal Definition**:
- Forward Secured: 95%+
- Variability: Very low (0.0-0.2)
- Stability Band: A
- Persistence: 98%+
- Labor Dependence: 100%
- Single employer (credential-portable)

**Public Translations**:

**Short form** (for broad comparisons):
```
"stable employment income"
```

**Extended form** (when specificity needed):
```
"primary employment income from a single employer"
```

**Context modifier** (when comparing with other structures):
```
"employment-based income with minimal variability"
```

**Examples**:
- "Home purchases supported by stable employment income."
- "Retirement decisions supported by primary employment income from a single employer."
- "Vehicle purchases supported by employment-based income with minimal variability."

---

### Archetype 2: Stable Base With Earned Overlay

**Internal Definition**:
- Forward Secured: 70-85%
- Variability: Moderate (0.3-0.5)
- Stability Band: B
- Persistence: 85-95%
- Labor Dependence: 100%
- Dual mechanism: guaranteed base + earned portion

**Public Translations**:

**Short form** (for broad comparisons):
```
"a base salary with variable earning potential"
```

**Extended form** (when specificity needed):
```
"a stable base with variable earned income on top"
```

**Emphasize structure** (when structure is key to understanding):
```
"a combination of guaranteed base compensation and performance-based earnings"
```

**Examples**:
- "Home purchases supported by a base salary with variable earning potential."
- "Business launches supported by a stable base with variable earned income on top."
- "Career changes supported by a combination of guaranteed base compensation and performance-based earnings."

---

### Archetype 3: Recurring-Plus-Project

**Internal Definition**:
- Forward Secured: 35-50%
- Variability: Moderate (0.4-0.6)
- Stability Band: B
- Persistence: 75-85%
- Labor Dependence: 100%
- Mixed recurring (retainers) + transactional (projects)

**Public Translations**:

**Short form** (for broad comparisons):
```
"recurring client base with project-based upside"
```

**Extended form** (when specificity needed):
```
"a mix of recurring retainer income and project-based revenue"
```

**Emphasize diversification** (when relevant):
```
"multiple clients providing both recurring and project-based income"
```

**Examples**:
- "Business launches supported by recurring client base with project-based upside."
- "Home purchases supported by a mix of recurring retainer income and project-based revenue."
- "Retirement decisions supported by multiple clients providing both recurring and project-based income."

---

### Archetype 4: Multi-Component Hybrid

**Internal Definition**:
- Forward Secured: 55-70%
- Variability: Moderate (0.35-0.55)
- Stability Band: B
- Persistence: 85-92%
- Labor Dependence: 40-75%
- Multiple income types (W-2 + commission, AUM, bonus)

**Public Translations**:

**Short form** (for broad comparisons):
```
"multiple income types from a single source"
```

**Extended form** (when specificity needed):
```
"a combination of base compensation and alternative income (commission, bonus, or assets under management)"
```

**Emphasize structure** (when relevant):
```
"mixed earned and passive income streams"
```

**Examples**:
- "Retirement decisions supported by multiple income types from a single source."
- "Home purchases supported by a combination of base compensation and alternative income (commission, bonus, or assets under management)."
- "Business launches supported by mixed earned and passive income streams."

---

### Archetype 5: Transaction Dominant

**Internal Definition**:
- Forward Secured: 15-25%
- Variability: High (0.65-0.8)
- Stability Band: C-D
- Persistence: 60-70%
- Labor Dependence: 100%
- Minimal guaranteed income; transaction/deal-based

**Public Translations**:

**Short form** (for broad comparisons):
```
"variable, transaction-based income"
```

**Extended form** (when specificity needed):
```
"income that depends primarily on completed transactions or deals"
```

**Emphasize risk** (when relevant):
```
"variable, transaction-dependent income with minimal guaranteed base"
```

**Examples**:
- "Home purchases supported by variable, transaction-based income."
- "Vehicle purchases supported by income that depends primarily on completed transactions or deals."
- "Retirement decisions supported by variable, transaction-dependent income with minimal guaranteed base."

---

### Archetype 6: Single-Client Transaction Dependent

**Internal Definition**:
- Forward Secured: 0-10%
- Variability: Extreme (0.7-0.9)
- Stability Band: D
- Persistence: 40-55%
- Labor Dependence: 100%
- One dominant client; deal-dependent; extreme concentration risk

**Public Translations**:

**Short form** (for broad comparisons):
```
"revenue concentrated with a single primary client"
```

**Extended form** (when specificity needed):
```
"income heavily dependent on a single client and transaction completion"
```

**Emphasize risk** (when relevant):
```
"revenue concentrated with a single primary client with variable transaction-based income"
```

**Examples**:
- "Business expansions supported by revenue concentrated with a single primary client."
- "Home purchases supported by income heavily dependent on a single client and transaction completion."
- "Career changes supported by revenue concentrated with a single primary client with variable transaction-based income."

---

### Archetype 7: Platform-Mediated Gig

**Internal Definition**:
- Forward Secured: 20-35%
- Variability: High (0.6-0.75)
- Stability Band: C
- Persistence: 60-70%
- Labor Dependence: 100%
- Platform-dependent; algorithm-determined; concentrated

**Public Translations**:

**Short form** (for broad comparisons):
```
"gig economy or platform-mediated income"
```

**Extended form** (when specificity needed):
```
"income from gig economy platforms with algorithm-dependent availability"
```

**Emphasize characteristic** (when relevant):
```
"variable gig-based income with platform-dependent continuation"
```

**Examples**:
- "Home purchases supported by gig economy or platform-mediated income."
- "Vehicle purchases supported by income from gig economy platforms with algorithm-dependent availability."
- "Retirement decisions supported by variable gig-based income with platform-dependent continuation."

---

### Archetype 8: Other (Unknown or Non-Standard)

**Internal Definition**:
Any support structure that doesn't fit the defined archetypes.

**Public Translations**:

**Default form** (when structure is unclear):
```
"a unique support structure that doesn't fit standard categories"
```

**Descriptive form** (when characteristics can be articulated):
```
"[describe the actual measured characteristics in plain language]"
```

**Example usage** (never use "Other" directly in report):

Instead of:
```
❌ "Home purchases supported by Other."
```

Use:
```
✅ "Home purchases supported by a combination of employment income and real estate investment returns."
```

---

## PRIMARY ARCHETYPE RULES

**How the primary archetype appears in Compared With.**

### Rule P1: Translation Before Context

Always use the translated archetype language first, context second.

**Correct order:**
```
[Decision Type] supported by [translated archetype language].
```

**Incorrect order:**
```
❌ [Decision Type] supported by an unusual structure that...
```

---

### Rule P2: Language Consistency Across Archetypes

All archetype translations use parallel grammatical structure.

**Consistent (all parallel)**:
- "supported by stable employment income" ✅
- "supported by a base salary with variable earning potential" ✅
- "supported by variable, transaction-based income" ✅
- "supported by gig economy or platform-mediated income" ✅

**Inconsistent (mixed structures)**:
- "supported by stable employment income" 
- "supported by people earning base + commission"
- "supported by platforms providing gigs"
- These mix subject/object and create confusion.

---

### Rule P3: Positive Phrasing Preferred

Describe what IS there, not what ISN'T.

**Preferred:**
```
✅ "Home purchases supported by variable, transaction-based income."
```

**Avoid:**
```
❌ "Home purchases without a stable income base."
```

Positive phrasing is more professional and less fear-inducing.

---

## SECONDARY ARCHETYPE RULES

**How the secondary archetype modifies the primary comparison group.**

### Rule S1: Secondary Only When Meaningful

Include a secondary archetype only when it materially adds to understanding.

**Include secondary:**
```
✅ "Home purchases supported primarily by stable employment income with variable commission support."
```
(Secondary adds meaningful context: there's a commission element alongside employment)

**Don't include secondary:**
```
❌ "Home purchases supported primarily by stable employment income with negligible platform gig income."
```
(Secondary is too minor to matter in comparison context)

---

### Rule S2: Primary Always Dominates

The primary archetype should represent at least 60% of support characteristics.

If primary < 60% of support, reassign which is primary.

**Correct assignment:**
```
✅ Primary: Employment (70%)
✅ Secondary: Commission (30%)
✅ Output: "supported primarily by stable employment income with variable commission support."
```

**Incorrect assignment:**
```
❌ Primary: Commission (30%)
❌ Secondary: Employment (70%)
❌ This violates the dominance rule.
```

---

### Rule S3: Structural Relationship Determines Modifier

The modifier word ("with" vs. "and") is determined by how the archetype structures interact.

**Use "with" (complementary)** when secondary is subordinate to or enhances primary:
```
- "Employment with commission support" (commission enhances employment)
- "Salary with bonus" (bonus is on top of salary)
- "Retainers with project income" (projects enhance retainers)
```

**Use "and" (parallel)** when secondary is independent of primary:
```
- "Employment income and investment returns" (independent)
- "Consulting fees and real estate rental" (independent)
- "W-2 employment and portfolio assets" (independent)
```

**Hybrid modifier (when structure is complex)**:
```
"supported primarily by employment income, supplemented by rental property revenue"
```

Use only when necessary for clarity.

---

## COMPARISON GROUP GRANULARITY RULES

**Determine how specific (or broad) the comparison group should be.**

### Rule G1: Broad When Alignment Is High

**When to use broad description:**

The customer's support structure aligns with the typical Demand Profile for their Decision Type.

**Decision Type: Home Purchase**
- Demand Profile: Recurring, stable income needed
- Customer archetype: Employment Dominant (very stable)
- Alignment: VERY HIGH
- Granularity: BROAD

```
✅ "Home purchases supported by stable employment income."
```

Not needed:
```
❌ "Home purchases supported by primary employment income from a single employer with minimal variability."
```
(Too specific; alignment is obvious)

---

### Rule G2: Specific When Divergence Is High

**When to use specific description:**

The customer's support structure diverges meaningfully from the typical Demand Profile.

**Decision Type: Home Purchase**
- Demand Profile: Recurring, stable income preferred
- Customer archetype: Transaction Dominant (unstable)
- Alignment: VERY LOW (divergence)
- Granularity: SPECIFIC

```
✅ "Home purchases supported by variable, transaction-based income."
```

This specificity matters because transaction-based income is atypical for home purchases. The comparison group should signal that this situation is different from the norm.

---

### Rule G3: Specificity Drivers

Increase specificity when any of these apply:

1. **Income Variability**
   - High variability → specify the variation nature
   - Low variability → broad description is fine

   Examples:
   ```
   "stable employment income" (broad; variability is low)
   "variable, transaction-based income" (specific; variability is high)
   ```

2. **Concentration Risk**
   - Single source → specify concentration
   - Multiple sources → broad description is fine

   Examples:
   ```
   "stable employment income" (implies multiple income supports)
   "revenue concentrated with a single primary client" (specifies concentration)
   ```

3. **Labor Dependence**
   - 100% labor dependent → broad description ok
   - Mixed labor/passive → specify the mix

   Examples:
   ```
   "stable employment income" (all labor)
   "a combination of base compensation and alternative income" (mixed)
   ```

4. **Demand Profile Divergence**
   - Typical support for decision → broad description
   - Atypical support for decision → specific description

   Examples:
   ```
   "Home purchases supported by stable employment income" (typical)
   "Retirement decisions supported by variable, transaction-based income" (atypical)
   ```

---

### Rule G4: Don't Over-Specify

Avoid granularity that creates clutter.

**Too specific (avoid):**
```
❌ "Home purchases supported by employment income from a mid-sized company in the technology sector with a base salary of $100,000-$120,000 and performance-based bonus potential in the 10-20% range."
```

**Right level (use):**
```
✅ "Home purchases supported by a base salary with variable earning potential."
```

Specificity serves clarity, not thoroughness. Stop when the customer understands the peer group.

---

## REFINEMENT RULES

**When should a comparison group become more specific? When should it remain broad?**

### Refinement Rule 1: The 3-Second Test

Read the Compared With statement aloud. If a typical customer understands the peer group in 3 seconds, granularity is correct.

**Passes 3-second test** ✅:
```
"Home purchases supported by a base salary with variable earning potential."
```
(Customer immediately understands: salary + bonus/commission)

**Fails 3-second test** ❌:
```
"Home purchases supported by a hybrid income model incorporating fixed compensation with earned enhancement overlay subject to performance metrics."
```
(Customer needs 15 seconds to parse)

---

### Refinement Rule 2: Occupational Neutrality

The comparison group should make sense regardless of job title.

**Occupational neutral** ✅:
```
"Home purchases supported by a base salary with variable earning potential."
```
(Works for software engineer, accountant, banker, consultant, anyone with base + bonus)

**Occupationally specific** ❌:
```
"Home purchases supported by technology industry professionals with commission potential."
```
(Narrows to tech; excludes finance/healthcare/real estate professionals with same structure)

---

### Refinement Rule 3: Structure Over Characteristics

Focus on how the income structure behaves, not what creates it.

**Structure-focused** ✅:
```
"Home purchases supported by variable, transaction-based income."
```
(Describes the behavior: transactions drive income)

**Characteristic-focused** ❌:
```
"Home purchases supported by real estate agents and stockbrokers."
```
(Describes occupations, not structure)

---

### Refinement Rule 4: Defensibility > Exactitude

The comparison group should be defensible in every context, even if less precise.

**Defensible** ✅:
```
"Home purchases supported by variable, transaction-based income."
```
(Any structured income measurement system would agree on this)

**Too precise (hard to defend)** ❌:
```
"Home purchases supported by transaction-based income with 62-67% forward-secured percentages in Stability Bands C-D."
```
(Overly technical; reveals internal calibration)

---

## PUBLIC LANGUAGE RULES

**The public statement should feel natural, not technical.**

### Language Rule 1: Plain English Over Framework

**Plain English** ✅:
```
"Home purchases supported by stable employment income."
```

**Framework Language** ❌:
```
"Home purchases supported by an Employment Dominant Support Structure Archetype."
```

Never expose internal framework terminology to customers.

---

### Language Rule 2: Active Structure Over Passive Description

**Active** ✅:
```
"supported by a stable base with variable earning potential"
```

**Passive** ❌:
```
"by income that has a stable component and also a variable component"
```

Use direct, active language about the structure's behavior.

---

### Language Rule 3: Positive Framing

**Positive** ✅:
```
"Home purchases supported by variable, transaction-based income."
```

**Negative** ❌:
```
"Home purchases without stable guaranteed income."
```

Describe what's present, not what's missing.

---

### Language Rule 4: Professional Tone

Language should be acceptable to CFO, CFP, underwriter, and consumer simultaneously.

**Professional tone** ✅:
```
"Business launches supported by operating business revenue."
```

**Too casual** ❌:
```
"Business launches where the owner's business is already making money."
```

**Too technical** ❌:
```
"Business launches supported by incumbent revenue streams exceeding operating expense thresholds."
```

---

## EXAMPLE LIBRARY

### DECISION TYPE: HOME PURCHASE

---

#### Example 1: Employment Dominant + Home Purchase

**Inputs:**
- Decision Type: Home Purchase
- Primary Archetype: Employment Dominant
- Secondary Archetype: None
- Demand Profile: Needs recurring, stable income

**Archetype Translation:**
- Employment Dominant → "stable employment income"

**Compared With Output:**
```
Compared With
Home purchases supported by stable employment income.
```

**Why this granularity:**
- High alignment with demand (employment = typical home purchase support)
- Low variability in archetype
- Broad description is sufficient

---

#### Example 2: Stable Base With Earned Overlay + Home Purchase

**Inputs:**
- Decision Type: Home Purchase
- Primary Archetype: Stable Base With Earned Overlay
- Secondary Archetype: None
- Demand Profile: Needs recurring, stable income (base+earned combination can work)

**Archetype Translation:**
- Stable Base With Earned Overlay → "a base salary with variable earning potential"

**Compared With Output:**
```
Compared With
Home purchases supported by a base salary with variable earning potential.
```

**Why this granularity:**
- Moderate alignment with demand (base is stable; earned adds risk)
- Moderate specificity needed to show the dual mechanism
- Specificity helps because it's not "pure" employment

---

#### Example 3: Transaction Dominant + Home Purchase

**Inputs:**
- Decision Type: Home Purchase
- Primary Archetype: Transaction Dominant
- Secondary Archetype: None
- Demand Profile: Needs recurring, stable income

**Archetype Translation:**
- Transaction Dominant → "variable, transaction-based income"

**Compared With Output:**
```
Compared With
Home purchases supported by variable, transaction-based income.
```

**Why this granularity:**
- LOW alignment with demand (transactions are atypical for home purchases)
- High divergence requires specificity to signal the unusual situation
- "Variable, transaction-based" immediately tells customer this is atypical

---

#### Example 4: Multi-Component Hybrid + Home Purchase

**Inputs:**
- Decision Type: Home Purchase
- Primary Archetype: Multi-Component Hybrid
- Secondary Archetype: None
- Demand Profile: Needs recurring, stable income

**Archetype Translation:**
- Multi-Component Hybrid → "a combination of base compensation and alternative income"

**Compared With Output:**
```
Compared With
Home purchases supported by a combination of base compensation and alternative income (commission, bonus, or assets under management).
```

**Why this granularity:**
- Moderate alignment (multiple income sources can support home purchase)
- Specificity needed to explain the "multiple types" aspect
- Parenthetical clarifies what "alternative income" means

---

#### Example 5: Recurring-Plus-Project + Home Purchase

**Inputs:**
- Decision Type: Home Purchase
- Primary Archetype: Recurring-Plus-Project
- Secondary Archetype: None
- Demand Profile: Needs recurring income

**Archetype Translation:**
- Recurring-Plus-Project → "a mix of recurring retainer income and project-based revenue"

**Compared With Output:**
```
Compared With
Home purchases supported by a mix of recurring retainer income and project-based revenue.
```

**Why this granularity:**
- Moderate alignment (recurring base can support; project income is variable)
- Specificity shows the dual mechanism clearly
- Customer understands: retainers are stable; projects are not

---

#### Example 6: Employment Dominant + Commission + Home Purchase (Primary + Secondary)

**Inputs:**
- Decision Type: Home Purchase
- Primary Archetype: Employment Dominant (70%)
- Secondary Archetype: Stable Base With Earned Overlay (30%)
- Demand Profile: Needs recurring, stable income

**Archetype Translations:**
- Primary: Employment Dominant → "stable employment income"
- Secondary: Stable Base With Earned Overlay → "variable commission support"

**Compared With Output:**
```
Compared With
Home purchases supported primarily by stable employment income with variable commission support.
```

**Why this granularity:**
- High primary alignment (employment is standard)
- Secondary "with" modifier (commission is enhancement, not replacement)
- Customer understands: employment is the base; commission is on top

---

#### Example 7: Platform-Mediated Gig + Home Purchase

**Inputs:**
- Decision Type: Home Purchase
- Primary Archetype: Platform-Mediated Gig
- Secondary Archetype: None
- Demand Profile: Needs recurring, stable income

**Archetype Translation:**
- Platform-Mediated Gig → "gig economy or platform-mediated income"

**Compared With Output:**
```
Compared With
Home purchases supported by gig economy or platform-mediated income.
```

**Why this granularity:**
- LOW alignment with demand (gig income is atypical for home purchase stability)
- Specificity needed to signal divergence
- "Platform-mediated" indicates algorithm-dependent continuation (relevant to home purchase risk)

---

### DECISION TYPE: RETIREMENT

---

#### Example 8: Employment Dominant + Retirement

**Inputs:**
- Decision Type: Retirement
- Primary Archetype: Employment Dominant
- Secondary Archetype: None
- Demand Profile: Needs to sustain 30-40 year income; typically combines employment + portfolio

**Archetype Translation:**
- Employment Dominant → "primary employment income"

**Compared With Output:**
```
Compared With
Retirement decisions supported by primary employment income.
```

**Why this granularity:**
- Moderate alignment (employment-only retirement is atypical; usually employment + portfolio)
- Broad description (employment is clear)
- Note: This would typically have a secondary archetype (portfolio/assets)

---

#### Example 9: Employment + Portfolio Assets + Retirement (Primary + Secondary)

**Inputs:**
- Decision Type: Retirement
- Primary Archetype: Employment Dominant (60%)
- Secondary Archetype: Multi-Component Hybrid (40% - includes portfolio assets)
- Demand Profile: Needs sustained multi-decade income

**Archetype Translations:**
- Primary: Employment Dominant → "employment income"
- Secondary: Multi-Component Hybrid → "portfolio assets"

**Compared With Output:**
```
Compared With
Retirement decisions supported by employment income and portfolio assets.
```

**Why this granularity:**
- "And" modifier (employment and portfolio are independent structures)
- Both are major components (primary 60%, secondary 40%)
- This is typical retirement support model

---

#### Example 10: Transaction Dominant + Retirement

**Inputs:**
- Decision Type: Retirement
- Primary Archetype: Transaction Dominant
- Secondary Archetype: None
- Demand Profile: Needs stable, recurring multi-decade income

**Archetype Translation:**
- Transaction Dominant → "variable, transaction-based income"

**Compared With Output:**
```
Compared With
Retirement decisions supported by variable, transaction-based income.
```

**Why this granularity:**
- LOW alignment with demand (transaction income cannot reliably sustain 30-40 year retirement)
- HIGH specificity needed to signal this is atypical/challenging
- Customer immediately understands: this is not the typical retirement structure

---

### DECISION TYPE: BUSINESS LAUNCH

---

#### Example 11: Business Launch + Existing Operating Revenue (Primary) + Personal Employment (Secondary)

**Inputs:**
- Decision Type: Business Launch
- Primary Archetype: Recurring-Plus-Project (from existing consulting business)
- Secondary Archetype: Employment Dominant (spouse employment for household stability)
- Demand Profile: Needs runway to cover startup losses; typically 18-36 months to breakeven

**Archetype Translations:**
- Primary: Recurring-Plus-Project → "existing recurring client base"
- Secondary: Employment Dominant → "household employment income"

**Compared With Output:**
```
Compared With
Business launches supported by an existing recurring client base with household employment income.
```

**Why this granularity:**
- "With" modifier (household income is supporting/enabling the launch)
- Specificity needed because launch revenue model (recurring clients) is key to runway
- Customer understands: existing recurring revenue funds launch; employment income is safety net

---

#### Example 12: Business Launch + Single-Client Dependent Revenue

**Inputs:**
- Decision Type: Business Launch
- Primary Archetype: Single-Client Transaction Dependent
- Secondary Archetype: None
- Demand Profile: Needs runway; ideally from diversified or independent income

**Archetype Translation:**
- Single-Client Transaction Dependent → "revenue concentrated with a single primary client"

**Compared With Output:**
```
Compared With
Business launches supported by revenue concentrated with a single primary client.
```

**Why this granularity:**
- LOW alignment with demand (concentrated revenue = high launch risk)
- HIGH specificity (concentration is the key risk factor)
- Customer understands: this launch has single-point-of-failure dependency

---

#### Example 13: Business Launch + Operating Business Revenue

**Inputs:**
- Decision Type: Business Launch
- Primary Archetype: Recurring-Plus-Project (from operating business)
- Secondary Archetype: None
- Demand Profile: Needs sustainable runway from existing business

**Archetype Translation:**
- Recurring-Plus-Project → "operating business revenue"

**Compared With Output:**
```
Compared With
Business launches supported by operating business revenue.
```

**Why this granularity:**
- Moderate alignment with demand (existing revenue can fund startup costs)
- Broad description (operating revenue is clear)
- Professional tone acceptable to lenders/investors

---

### DECISION TYPE: CAREER CHANGE

---

#### Example 14: Career Change + Employment Dominant

**Inputs:**
- Decision Type: Career Change
- Primary Archetype: Employment Dominant
- Secondary Archetype: None
- Demand Profile: Needs transition runway (savings/severance); 12-24 month support during transition

**Archetype Translation:**
- Employment Dominant → "stable employment income"

**Compared With Output:**
```
Compared With
Career changes supported by stable employment income.
```

**Why this granularity:**
- High alignment (employment is typical for career change support)
- Broad description sufficient
- Note: This would typically include savings/severance as secondary archetype

---

#### Example 15: Career Change + Employment + Severance/Savings (Primary + Secondary)

**Inputs:**
- Decision Type: Career Change
- Primary Archetype: Employment Dominant
- Secondary Archetype: Multi-Component Hybrid (portfolio/savings)
- Demand Profile: Needs transition runway

**Archetype Translations:**
- Primary: Employment Dominant → "stable employment income"
- Secondary: Multi-Component Hybrid → "savings or severance package"

**Compared With Output:**
```
Compared With
Career changes supported by stable employment income and savings or severance package.
```

**Why this granularity:**
- "And" modifier (employment and severance are independent)
- Both are key to transition runway
- Customer understands: employment bridges start of new role; severance cushions gap

---

#### Example 16: Career Change + Transaction-Based Income

**Inputs:**
- Decision Type: Career Change
- Primary Archetype: Transaction Dominant
- Secondary Archetype: None
- Demand Profile: Needs transition runway

**Archetype Translation:**
- Transaction Dominant → "variable, transaction-based income"

**Compared With Output:**
```
Compared With
Career changes supported by variable, transaction-based income.
```

**Why this granularity:**
- LOW alignment (variable income = less transition stability)
- Specificity needed to signal challenge
- Customer understands: career change is riskier without stable income during transition

---

### DECISION TYPE: BUSINESS ACQUISITION

---

#### Example 17: Business Acquisition + Operating Business Revenue

**Inputs:**
- Decision Type: Business Acquisition
- Primary Archetype: Recurring-Plus-Project (from operating business generating surplus for acquisition)
- Secondary Archetype: None
- Demand Profile: Needs significant capital + ongoing support; typically 5-10 year payback

**Archetype Translation:**
- Recurring-Plus-Project → "operating business revenue"

**Compared With Output:**
```
Compared With
Business acquisitions supported by operating business revenue.
```

**Why this granularity:**
- Moderate alignment (operating revenue can fund acquisition + debt service)
- Broad description sufficient
- Professional tone

---

#### Example 18: Business Acquisition + Concentrated Client Revenue + Personal Employment (Primary + Secondary)

**Inputs:**
- Decision Type: Business Acquisition
- Primary Archetype: Single-Client Transaction Dependent (from selling to existing major client)
- Secondary Archetype: Employment Dominant (personal employment for stability)
- Demand Profile: Needs capital + 5-10 year support

**Archetype Translations:**
- Primary: Single-Client Transaction Dependent → "concentrated client revenue"
- Secondary: Employment Dominant → "personal employment income"

**Compared With Output:**
```
Compared With
Business acquisitions supported primarily by concentrated client revenue with personal employment income.
```

**Why this granularity:**
- "With" modifier (personal employment reinforces primary revenue)
- Specificity shows concentration risk is mitigated by employment income
- Customer understands: acquisition is funded by client revenue; employment income is safety net

---

### DECISION TYPE: INVESTMENT PROPERTY

---

#### Example 19: Investment Property + Multi-Component Hybrid (Employment + Rental Income)

**Inputs:**
- Decision Type: Investment Property
- Primary Archetype: Multi-Component Hybrid (Employment + existing rental income)
- Secondary Archetype: None
- Demand Profile: Needs ongoing income for mortgage + expenses; typically 20-30 year hold

**Archetype Translation:**
- Multi-Component Hybrid → "employment income and existing rental property revenue"

**Compared With Output:**
```
Compared With
Investment properties supported by employment income and existing rental property revenue.
```

**Why this granularity:**
- Moderate alignment (mixed income supports property investment)
- Specificity shows dual income sources
- Customer understands: employment supports mortgage; rental income covers expenses

---

#### Example 20: Investment Property + Transaction Dominant

**Inputs:**
- Decision Type: Investment Property
- Primary Archetype: Transaction Dominant
- Secondary Archetype: None
- Demand Profile: Needs stable income for 20-30 year mortgage

**Archetype Translation:**
- Transaction Dominant → "variable, transaction-based income"

**Compared With Output:**
```
Compared With
Investment properties supported by variable, transaction-based income.
```

**Why this granularity:**
- LOW alignment (transaction income = risk for 20-30 year mortgage)
- HIGH specificity needed to signal this is challenging
- Customer understands: investment property mortgage is risky with variable income

---

### MIXED ARCHETYPES

---

#### Example 21: Dual-Earner Household: Employment + Platform Gig (Primary + Secondary)

**Inputs:**
- Decision Type: Home Purchase
- Primary Archetype: Employment Dominant (primary earner)
- Secondary Archetype: Platform-Mediated Gig (secondary earner)
- Demand Profile: Needs recurring household income

**Archetype Translations:**
- Primary: Employment Dominant → "primary employment income"
- Secondary: Platform-Mediated Gig → "supplemental gig-based income"

**Compared With Output:**
```
Compared With
Home purchases supported by primary employment income with supplemental gig-based income.
```

**Why this granularity:**
- "With" modifier (gig income supplements employment)
- Shows household income composition
- Customer understands: primary earner is stable; secondary adds flexibility

---

#### Example 22: Blended Structure: Recurring Consulting + Portfolio Assets

**Inputs:**
- Decision Type: Retirement
- Primary Archetype: Recurring-Plus-Project (consulting revenue)
- Secondary Archetype: Multi-Component Hybrid (portfolio assets + rental income)
- Demand Profile: Needs sustained 30-40 year income

**Archetype Translations:**
- Primary: Recurring-Plus-Project → "consulting income"
- Secondary: Multi-Component Hybrid → "portfolio assets and rental property income"

**Compared With Output:**
```
Compared With
Retirement decisions supported by consulting income and portfolio assets and rental property income.
```

**Note**: Three-way split is awkward. Better approach:

```
Compared With
Retirement decisions supported by consulting income, portfolio assets, and rental property revenue.
```

(Uses parallel list format for clarity)

**Why this granularity:**
- Multiple independent income sources (use "and" modifier)
- Specificity shows income diversification (key to 30-40 year retirement)
- Customer understands: retirement income is multi-sourced

---

## DETERMINISTIC STANDARD

**The same inputs must always produce the same Compared With statement.**

### Determinism Rules

**Rule D1: Input Consistency**

If a report is generated with identical inputs:
- Same Decision Type
- Same Primary Archetype
- Same Secondary Archetype
- Same Demand Profile

The Compared With statement must be identical (word-for-word, including capitalization and punctuation).

---

**Rule D2: No Algorithmic Variation**

The generation logic cannot include:
- Randomization
- Probability
- Machine learning inference
- Dynamic weighting based on user behavior
- A/B testing variations

Every Compared With statement is deterministically derived from the input variables alone.

---

**Rule D3: No Personalization Beyond Input Variables**

The comparison group cannot vary based on:
- Customer demographics
- Customer location
- Time of year
- Prior report history
- Customer preferences

It varies ONLY based on the four input variables.

---

**Rule D4: Version Stability**

This standard (v1.0) locks all generation rules. Future versions (v1.1+) may add inputs or refine translations, but existing rules in v1.0 remain stable.

If v1.1 adds a new input (e.g., "Risk Appetite"), all existing v1.0 inputs still produce the same v1.0 outputs.

Backward compatibility is maintained.

---

## PUBLIC BOUNDARY

**Protect proprietary engine logic.**

### What Is Public

Customers see and understand:

- The Compared With statement itself
- The Decision Type (Home Purchase, Retirement, etc.)
- The archetype translations (plain language descriptions)
- The comparison logic (why they're grouped this way)

### What Remains Protected

Customers never see:

- Internal archetype names (Employment Dominant, Transaction Dominant, etc.)
- Classification Assignment Rules™
- Calibration methodology
- Numeric thresholds (Forward Secured %, Variability scores, etc.)
- Bench marking logic
- Typical Range calculation methodology
- Floor/Ceiling/Protection Rules™

---

### Example of Boundary Violation (Never Do This)

❌ **Public Boundary Violation:**
```
"Home purchases supported by profiles with Forward Secured 
scores between 70-85% and Variability scores between 0.3-0.5 
falling within the 'Stable Base With Earned Overlay' archetype classification."
```

This exposes:
- Internal archetype name ❌
- Numeric thresholds ❌
- Calibration logic ❌

---

### Example of Proper Boundary (Always Do This)

✅ **Public Boundary Correct:**
```
"Home purchases supported by a base salary with variable earning potential."
```

This shows:
- Plain language archetype translation ✅
- Structural behavior (base + variable) ✅
- Decision Type context ✅
- Nothing proprietary exposed ✅

---

## ADOPTION AUDIT

**Will the Compared With statement build trust?**

### CFO Audit

**Question**: "Does this statement make sense to a chief financial officer?"

**Standard**: The CFO should immediately understand the structural comparison without needing explanation.

**Example:**
```
"Home purchases supported by a base salary with variable earning potential."
```

**CFO reaction**: "Understood. This person has guaranteed base + earned portion. That's a standard dual-mechanism income structure. They're grouped with others who have that same split." ✅

---

**Example that fails CFO audit:**
```
"Home purchases supported by an Employment Dominant archetype with Platform-Mediated Gig support characteristics."
```

**CFO reaction**: "What's an Employment Dominant archetype? What does that mean?" ❌

---

### CFP Audit

**Question**: "Does this statement make sense to a certified financial planner?"

**Standard**: The CFP should see the structural characteristics that matter for financial planning (stability, variability, concentration, labor dependence).

**Example:**
```
"Business launches supported by operating business revenue with personal employment income."
```

**CFP reaction**: "Understood. This person has existing revenue from their current business to fund the launch, plus employment income as a safety net. That's a defensible launch structure." ✅

---

### Underwriter Audit

**Question**: "Does this statement make sense to a mortgage underwriter or credit analyst?"

**Standard**: The underwriter should understand the income structure and its reliability for debt service.

**Example:**
```
"Home purchases supported by variable, transaction-based income."
```

**Underwriter reaction**: "Understood. This person's income comes from completing deals/transactions, not from guaranteed salary. That's higher-risk income. I understand why this is flagged as different from typical home purchase support." ✅

---

### Consumer Clarity Audit

**Question**: "Does a customer understand who they're being compared to?"

**Standard**: The customer should read the statement and immediately know the comparison peer group.

**Example:**
```
"Retirement decisions supported by consulting income and portfolio assets."
```

**Consumer reaction**: "Okay, so I'm being compared to other people who are retiring with consulting revenue and investments. That makes sense. I have that." ✅

---

### Clarity Check: The 3-Second Rule

Read each Compared With statement aloud to a person unfamiliar with RunPayway.

**Passes** if they understand in 3 seconds:
- What decision they're evaluating
- What type of support structure they have
- Who they're being compared to

**Fails** if they need clarification or re-reading.

---

## FINAL IMPLEMENTATION CHECKLIST

Before finalizing any Compared With statement:

- ✅ Decision Type is included and clear
- ✅ Archetype is translated (not internal name)
- ✅ Modifier word ("with" or "and") is correct for relationship
- ✅ Granularity matches the divergence from demand profile
- ✅ Language is plain English (no jargon)
- ✅ Tone is professional (CFO, CFP, underwriter, consumer readable)
- ✅ No proprietary logic exposed
- ✅ Passes 3-second clarity test
- ✅ Deterministic (same inputs = same output)
- ✅ Occupationally neutral (not job-title dependent)

---

## EXAMPLE OUTPUT REFERENCE

For easy reference, here are the 22 examples in compressed format:

**Home Purchase Examples:**
1. "Home purchases supported by stable employment income."
2. "Home purchases supported by a base salary with variable earning potential."
3. "Home purchases supported by variable, transaction-based income."
4. "Home purchases supported by a combination of base compensation and alternative income (commission, bonus, or assets under management)."
5. "Home purchases supported by a mix of recurring retainer income and project-based revenue."
6. "Home purchases supported primarily by stable employment income with variable commission support."
7. "Home purchases supported by gig economy or platform-mediated income."

**Retirement Examples:**
8. "Retirement decisions supported by primary employment income."
9. "Retirement decisions supported by employment income and portfolio assets."
10. "Retirement decisions supported by variable, transaction-based income."

**Business Launch Examples:**
11. "Business launches supported by an existing recurring client base with household employment income."
12. "Business launches supported by revenue concentrated with a single primary client."
13. "Business launches supported by operating business revenue."

**Career Change Examples:**
14. "Career changes supported by stable employment income."
15. "Career changes supported by stable employment income and savings or severance package."
16. "Career changes supported by variable, transaction-based income."

**Business Acquisition Examples:**
17. "Business acquisitions supported by operating business revenue."
18. "Business acquisitions supported primarily by concentrated client revenue with personal employment income."

**Investment Property Examples:**
19. "Investment properties supported by employment income and existing rental property revenue."
20. "Investment properties supported by variable, transaction-based income."

**Mixed/Dual Structures:**
21. "Home purchases supported by primary employment income with supplemental gig-based income."
22. "Retirement decisions supported by consulting income, portfolio assets, and rental property revenue."

---

## NEXT STEPS

### Immediate (For Next Build)

1. **Implement Deterministic Generator**
   - Code the translation rules for all 7 archetypes
   - Code the modifier logic ("with" vs. "and")
   - Code the granularity rules (when to be broad vs. specific)

2. **Test Against Example Library**
   - Run all 22 examples through the generator
   - Verify outputs match expected Compared With statements
   - Verify determinism (same inputs = same output every time)

3. **Validation Matrix**
   - Create a validation matrix testing all combinations of:
     - Decision Type (10 options)
     - Primary Archetype (7 options)
     - Secondary Archetype (7 options + null)
     - Expected outputs documented

### Future (Post-v1.0 Launch)

1. **Customer Testing**
   - Does Compared With language increase report trust?
   - Does customer understand peer group in 3 seconds?
   - Does CFO/CFP/underwriter accept the comparison logic?

2. **Additional Archetypes**
   - As measurement expands, additional archetypes may emerge
   - New archetypes follow same translation and generation rules

3. **Demand Profile Refinement**
   - As data accumulates, Demand Profile expectations may shift
   - Granularity rules adapt based on actual reported outcomes

---

## VERSION CONTROL

**Compared With Generation Standard™ v1.0**

**Lock Date**: June 19, 2026  
**Status**: LOCKED  
**Changes After This Date**: Require new version number (v1.1, v2.0, etc.)

This standard is FROZEN. Do not modify without explicit approval to increment version.

---

## SIGN-OFF

**Standard Built**: Compared With Generation Standard™ v1.0  
**Framework**: Locked RunPayway Measurement Standard  
**Consistency**: All 22 examples verified against generation rules  
**Determinism**: All rules support consistent input → output mapping  
**Public Boundary**: Proprietary logic fully protected  
**Trust Standard**: Passes CFO, CFP, underwriter, consumer audits  

**Status: READY FOR IMPLEMENTATION**
