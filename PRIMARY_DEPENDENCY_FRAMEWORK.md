# RunPayway™ Primary Dependency Framework
## Implementation-Ready Specification

**Version**: 1.0  
**Status**: Ready for implementation  
**Purpose**: Interpret income structure more intelligently by understanding WHAT income depends on  
**Constraint**: Measurement-only; does not change RP-2.0 score or add advice

---

## PART 1: DEPENDENCY TYPE TAXONOMY

### Six Core Dependency Types

#### 1. EMPLOYER DEPENDENCY

**Definition**: Income is primarily tied to an employment relationship with a company or organization.

**Plain Language**: "You work for a company or organization as an employee."

**What Creates This**:
- W-2 employment
- Salary or hourly wage
- Employment contract
- Direct employer relationship
- Loss of employment = loss of income

**Examples**:
- Software engineer at Google (W-2 salary)
- Teacher at school (W-2 salary + benefits)
- Nurse at hospital (W-2 salary)
- Sales representative at company (W-2 + commission)

**RP-2.0 Factors Affected**:
- Labor Dependence: HIGH (income requires employment)
- Income Persistence: VARIABLE (depends on job security)
- Forward Visibility: HIGH (contract/employment terms visible)
- Concentration: DEPENDS (single employer or multiple jobs)

**Allowed Report Language**:
- ✅ "Your income is employment-dependent"
- ✅ "You work for [employer type]"
- ✅ "Income continues as long as employment continues"
- ✅ "Job loss would impact [X]% of income"
- ✅ "Your income is tied to employment"

**Prohibited Report Language**:
- ❌ "Your job is secure" (prediction)
- ❌ "You are ready to buy a home" (approval)
- ❌ "You should look for another job" (advice)
- ❌ "Your employment is unstable" (judgment)
- ❌ "Your employer might fire you" (prediction)

**Edge Cases**:
- Multiple jobs: Still Employer Dependency (multiple employers)
- W-2 + commission: Employer Dependency (W-2 is primary)
- Contractor to employer: Client Dependency or Platform Dependency (not W-2)
- Low job security: Still Employer Dependency (structural fact)

---

#### 2. CLIENT DEPENDENCY

**Definition**: Income is primarily from direct relationships with individual clients or customers.

**Plain Language**: "You work for clients; they hire you directly."

**What Creates This**:
- Freelance work
- Consulting engagements
- Client retainers
- Direct client relationships
- You manage client relationship
- Loss of client = loss of that income stream

**Examples**:
- Consultant with 5-10 retainer clients
- Freelance designer with direct clients
- Virtual assistant serving multiple clients
- Consultant with project-based clients
- Coach with private clients

**RP-2.0 Factors Affected**:
- Labor Dependence: HIGH (income requires active work)
- Concentration: VARIABLE (depends on number of clients)
- Income Persistence: VARIABLE (depends on contract length)
- Source Diversity: HIGH (potential for multiple clients)

**Allowed Report Language**:
- ✅ "Your income is client-dependent"
- ✅ "You work directly with clients"
- ✅ "Loss of a major client would reduce income [X]%"
- ✅ "Your income comes from client relationships"
- ✅ "Client concentration is [X]%"

**Prohibited Report Language**:
- ❌ "You have a stable income" (judgment)
- ❌ "You should diversify your clients" (advice)
- ❌ "Your clients might leave" (prediction)
- ❌ "You are at risk" (judgment)
- ❌ "You need backup clients" (advice)

**Edge Cases**:
- One client providing 100%: Extreme concentration (still Client Dependency)
- Multiple clients through one platform: Platform Dependency (not Client)
- Retainer + project clients: Still Client Dependency
- Client relationship is contractual: Client Dependency (formalized client relationship)

---

#### 3. PLATFORM DEPENDENCY

**Definition**: Income flows through a platform or marketplace intermediary; the platform controls access and terms.

**Plain Language**: "Your income comes through a platform or app."

**What Creates This**:
- Gig platforms (Uber, Lyft, DoorDash)
- Freelance marketplaces (Upwork, Fiverr, Toptal)
- E-commerce platforms (Amazon, Etsy, Shopify)
- Creator platforms (YouTube, Patreon, Substack)
- You don't control terms; platform does
- Loss of platform access = loss of income

**Examples**:
- Uber/Lyft driver
- Upwork freelancer (primary income source)
- Etsy shop owner
- YouTube creator with ad revenue
- TaskRabbit service provider
- Amazon seller

**RP-2.0 Factors Affected**:
- Labor Dependence: HIGH (income requires active work or platform presence)
- Forward Visibility: LOW (platform can change terms, remove you)
- Concentration: VARIABLE (depends on platform dependency)
- Income Persistence: VARIABLE (depends on platform algorithm/policy)

**Allowed Report Language**:
- ✅ "Your income is platform-dependent"
- ✅ "You work through a platform or marketplace"
- ✅ "Income depends on platform access"
- ✅ "Platform policy changes could affect income"
- ✅ "Income flows through [platform type]"

**Prohibited Report Language**:
- ❌ "The platform might remove you" (prediction)
- ❌ "You are vulnerable to platform changes" (judgment)
- ❌ "You should diversify off the platform" (advice)
- ❌ "Platform income is unstable" (judgment)
- ❌ "You should move to a different platform" (advice)

**Edge Cases**:
- Multiple platforms: Still Platform Dependency (multiple platforms)
- Platform with guaranteed contract: Still Platform Dependency (platform controls terms)
- Freelancer with mix of platform + direct clients: Mixed Dependency
- Creator with multiple platforms: Mixed or Platform Dependency

---

#### 4. TRANSACTION DEPENDENCY

**Definition**: Income is commission-based or per-transaction; each transaction is independent.

**Plain Language**: "Your income comes from sales or transactions."

**What Creates This**:
- Commission-based income
- Per-transaction fees
- Deal-closing based
- Each sale = separate income event
- Loss of deal flow = loss of income
- No recurring income base

**Examples**:
- Real estate agent (commission per sale)
- Stock broker (commission per trade)
- Car salesperson (commission per car)
- Insurance agent (commission per policy)
- Sales professional (commission per deal)

**RP-2.0 Factors Affected**:
- Labor Dependence: VERY HIGH (income requires active deal-closing)
- Variability: VERY HIGH (income depends on transaction volume)
- Forward Visibility: VERY LOW (pipeline dependent)
- Income Persistence: ZERO (no income without active work)

**Allowed Report Language**:
- ✅ "Your income is transaction-dependent"
- ✅ "You earn commission per transaction"
- ✅ "Income varies based on transaction volume"
- ✅ "Loss of transaction activity would reduce income"
- ✅ "Income depends on closing deals"

**Prohibited Report Language**:
- ❌ "You are at risk" (judgment)
- ❌ "Your income is unstable" (judgment)
- ❌ "You should look for more stable work" (advice)
- ❌ "You might not earn enough" (prediction/affordability)
- ❌ "You need a backup plan" (advice)

**Edge Cases**:
- Agent with retainer + commission: Mixed Dependency (retainer is recurring)
- Salesperson with base salary + commission: Employer Dependency (W-2 is primary)
- Commission-only with no base: Pure Transaction Dependency
- 100% deal-dependent: Extreme transaction dependency

---

#### 5. ASSET DEPENDENCY

**Definition**: Income is primarily from owned assets; relatively passive or semi-passive.

**Plain Language**: "Your income comes from things you own."

**What Creates This**:
- Rental property income
- Investment/dividend income
- Royalty/licensing income
- Passive business income
- Asset generates income without active work
- Loss of asset = loss of that income

**Examples**:
- Rental property owner (rental income)
- Dividend investor (stock dividends)
- Author with royalties
- Creator with passive income (course, book)
- Business owner with passive business model

**RP-2.0 Factors Affected**:
- Labor Dependence: VERY LOW (income doesn't require active work)
- Income Persistence: HIGH (recurring as long as asset held)
- Concentration: DEPENDS (one asset vs. multiple)
- Variability: DEPENDS (market-dependent)

**Allowed Report Language**:
- ✅ "Your income is asset-dependent"
- ✅ "You have passive income from owned assets"
- ✅ "Income continues without active work"
- ✅ "Asset value affects income"
- ✅ "Loss of asset would impact income"

**Prohibited Report Language**:
- ❌ "Your assets are secure" (prediction)
- ❌ "Asset values will increase" (prediction)
- ❌ "You have reliable income" (judgment)
- ❌ "You should diversify investments" (advice)
- ❌ "Your asset is underperforming" (judgment)

**Edge Cases**:
- Real estate owner who also manages property: Asset + Labor (semi-passive)
- Stock portfolio: Pure Asset Dependency
- Business owner who's not operationally involved: Asset Dependency
- Royalty income with active updates: Asset + Labor (semi-passive)

---

#### 6. MIXED DEPENDENCY

**Definition**: Income comes from multiple dependency types in significant amounts.

**Plain Language**: "Your income comes from different sources."

**What Creates This**:
- W-2 salary + rental income
- W-2 salary + commission
- Freelance clients + platform work
- Salary + commission + rental income
- Multiple income types contribute meaningfully

**Examples**:
- Software engineer (W-2) + rental property (Asset)
- Real estate agent (Transaction) + property management (Client)
- Consultant (Client) + dividend income (Asset)
- Employee (Employer) + freelance work (Client) + royalties (Asset)

**RP-2.0 Factors Affected**:
- All factors are affected differently per income type
- Overall resilience may be higher (diversified)
- Structure is more complex

**Allowed Report Language**:
- ✅ "Your income comes from multiple sources"
- ✅ "You have [type A] income plus [type B] income"
- ✅ "Loss of [source] would reduce income [X]%"
- ✅ "Your income is diversified across [types]"
- ✅ "Different income types create different risks"

**Prohibited Report Language**:
- ❌ "You have stable income" (judgment)
- ❌ "Your diversification is good" (judgment)
- ❌ "You should focus on one type" (advice)
- ❌ "You are well-positioned" (approval)
- ❌ "Your income is secure" (judgment)

**Edge Cases**:
- 90% one type, 10% another: Likely not Mixed (primary type dominates)
- 50/50 two types: Clearly Mixed
- Multiple small sources: If none > 10%, likely Mixed
- Rapidly changing mix: Use current state (not projections)

---

## PART 2: CUSTOMER INTAKE QUESTION

### The Question

**Primary Question**:

> "Which of these best describes your largest income source?"

**Answer Options** (in recommended order):

1. **An employer** (you work for a company as an employee)
   - Backend: `EMPLOYER`
   - Helper: "You receive a salary or hourly wage"
   - Example: "W-2 job, salary, employment benefits"

2. **Clients or customers** (you work directly for them)
   - Backend: `CLIENT`
   - Helper: "You manage client relationships directly"
   - Example: "Freelance, consulting, retainers"

3. **A platform or marketplace** (your work flows through an app or website)
   - Backend: `PLATFORM`
   - Helper: "You work through a marketplace or gig app"
   - Example: "Uber, Upwork, Etsy, DoorDash"

4. **Commission or sales activity** (you earn per transaction/deal)
   - Backend: `TRANSACTION`
   - Helper: "You earn money per sale or deal closed"
   - Example: "Real estate, sales, commission"

5. **Investments or rental property** (you own assets that generate income)
   - Backend: `ASSET`
   - Helper: "Income from things you own"
   - Example: "Rental property, dividends, royalties"

6. **A mix of these** (multiple significant income sources)
   - Backend: `MIXED`
   - Helper: "You have multiple important income types"
   - Example: "W-2 job + freelance + rental income"

### User Confusion & Reduction

**Common Confusion Points**:

| Confusion | Cause | Reduction Strategy |
|-----------|-------|-------------------|
| Freelancer vs. Platform | Unclear if client relationship or marketplace | Ask: "Do you manage the client, or does a platform assign work?" |
| Contractor vs. Employer | W-2 vs. 1099 confusion | Say: "W-2 = employer (employee); 1099 = usually client or platform" |
| Commission + Salary | Both present | Say: "Choose the one that's larger; we'll ask about mix later" |
| Asset + Labor | Rental with management | Say: "If you actively manage it, pick what's larger" |
| Multiple Clients | Multiple relationships | Say: "Client dependency; you manage the relationships" |
| Part-time Mix | Multiple income types | Say: "Choose your largest source; we track if you have multiple" |

---

## PART 3: BACKEND DATA CONTRACT

### Field Definition

```json
{
  "field_name": "primary_dependency_type",
  "type": "enum",
  "required": false,
  "values": [
    "EMPLOYER",
    "CLIENT", 
    "PLATFORM",
    "TRANSACTION",
    "ASSET",
    "MIXED"
  ],
  "validation": {
    "rules": [
      "Must be one of 6 enum values",
      "Case-insensitive on input; stored uppercase",
      "Whitespace trimmed"
    ],
    "error_response": "Invalid dependency type. Must be one of: employer, client, platform, transaction, asset, mixed"
  },
  "required_for": [
    "Interpretation optimization",
    "Report customization"
  ],
  "does_not_affect": [
    "RP-2.0 score",
    "Stability band",
    "Classification",
    "Assessment result"
  ],
  "fallback_behavior": {
    "if_not_provided": "Infer from RP-2.0 outputs using inference rules (see below)",
    "if_invalid": "Return validation error; use last valid value if available",
    "confidence_if_inferred": "Lower confidence indicator in report"
  }
}
```

### Inference Rules (When Not Provided)

If user doesn't provide dependency type, infer from RP-2.0:

```
IF labor_dependence >= 0.95 AND income_persistence >= 0.6:
  → Likely EMPLOYER (W-2 with benefits)

ELSE IF labor_dependence >= 0.95 AND source_diversity > 3:
  → Likely CLIENT (multiple clients, high labor)

ELSE IF labor_dependence >= 0.95 AND forward_visibility <= 0.3:
  → Likely TRANSACTION (low visibility = deal-based)

ELSE IF labor_dependence <= 0.2 AND source_diversity <= 2:
  → Likely ASSET (low labor, stable income)

ELSE IF source_diversity >= 4 AND multiple_types evident:
  → Likely MIXED

ELSE:
  → DEFAULT: Use provided value or mark as INFERRED
```

### Impact on Interpretation (Not Score)

| Component | Impact | Notes |
|-----------|--------|-------|
| RP-2.0 Score | NONE | Interpretation-only feature |
| Report Language | HIGH | Enables specific, contextual phrasing |
| Insight Selection | MEDIUM | Prioritizes relevant insights |
| Decision Context | HIGH | Decision-type-specific interpretation |
| Concentration Language | HIGH | Clarifies what concentration means |
| Variability Language | MEDIUM | Context for variability interpretation |
| Industry Interpretation | MEDIUM | Helps contextualize within industry |

---

## PART 4: INTERPRETATION RULES

### Dependency Type × Concentration Matrix

#### EMPLOYER DEPENDENCY

**Low Concentration (<50%)**:
```
Meaning: Multiple employers or jobs
Insight: "You diversify income across multiple employers"
Allowed: "Income from multiple job sources"
Prohibited: "Safe" "Stable" "Low risk"
Primary: Diversity is structural strength
```

**Moderate Concentration (50-75%)**:
```
Meaning: One primary employer + other jobs
Insight: "Primary employer is [X]% of income; other jobs are [Y]%"
Allowed: "Largest employer represents [X]% of income"
Prohibited: "Stable" "Risky" "Secure"
Primary: Concentration in primary employer
```

**High Concentration (>75%)**:
```
Meaning: Almost all income from one employer
Insight: "Nearly all income from one employer ([X]%)"
Allowed: "Loss of this employment would impact [X]% of income"
Prohibited: "You are at risk" "Job security is an issue" "You should..."
Primary: Single employer concentration risk
```

#### CLIENT DEPENDENCY

**Low Concentration (<30%)**:
```
Meaning: Many small clients (healthy diversification)
Insight: "You work with multiple clients; largest is [X]%"
Allowed: "Income spread across [N] clients"
Prohibited: "Safe" "Stable" "Diverse is good"
Primary: Client diversification (structural strength)
```

**Moderate Concentration (30-70%)**:
```
Meaning: Several main clients + others
Insight: "Primary client represents [X]%; others make up [Y]%"
Allowed: "Largest client is [X]% of income"
Prohibited: "Risky" "Vulnerable" "You should diversify"
Primary: Client concentration risk
```

**High Concentration (>70%)**:
```
Meaning: Highly client-dependent (1-2 major clients)
Insight: "Largest client represents [X]% of income"
Allowed: "Loss of largest client would impact [X]% of income"
Prohibited: "You are at risk" "Unstable" "You should..."
Primary: Extreme client concentration
```

#### PLATFORM DEPENDENCY

**Low Concentration (<40% through one platform)**:
```
Meaning: Multiple platforms (platform diversification)
Insight: "You work across multiple platforms; largest is [X]%"
Allowed: "Income diversified across [N] platforms"
Prohibited: "Safe" "Stable" "Platform dependent"
Primary: Platform diversification
```

**Moderate Concentration (40-75% through one platform)**:
```
Meaning: Primary platform + others
Insight: "Primary platform is [X]% of income"
Allowed: "Largest platform represents [X]% of income"
Prohibited: "Platform might remove you" "Unstable"
Primary: Platform concentration
```

**High Concentration (>75% through one platform)**:
```
Meaning: Almost all income through one platform
Insight: "Nearly all income ([X]%) comes through one platform"
Allowed: "Loss of platform access would impact [X]% of income"
Prohibited: "Vulnerable" "At risk" "Should diversify"
Primary: Platform dependency risk
```

#### TRANSACTION DEPENDENCY

**Low Variability + Good Pipeline**:
```
Meaning: Consistent transaction volume
Insight: "Commission income is relatively consistent"
Allowed: "Transaction activity provides [X]% of income"
Prohibited: "Stable" "Secure" "Predictable"
Primary: Consistency despite transaction nature
```

**Moderate Variability**:
```
Meaning: Transaction volume fluctuates
Insight: "Commission income varies based on deal volume"
Allowed: "Income from transactions varies [X]% month-to-month"
Prohibited: "Unstable" "Risky" "Should find steady work"
Primary: Variability in transaction-based income
```

**High Variability + Low Visibility**:
```
Meaning: Unpredictable transaction volume
Insight: "Commission income is highly variable and uncertain"
Allowed: "Deal-based income varies significantly month-to-month"
Prohibited: "Unreliable" "Unsafe" "Precarious"
Primary: Transaction unpredictability and variability
```

#### ASSET DEPENDENCY

**Single Asset**:
```
Meaning: One primary asset (rental property, portfolio, etc.)
Insight: "Income is concentrated in one asset type"
Allowed: "Primary income source is [asset type]"
Prohibited: "Stable" "Safe" "Secure"
Primary: Single asset concentration
```

**Diversified Assets**:
```
Meaning: Multiple assets (rental + stocks + royalties, etc.)
Insight: "Income comes from multiple asset types"
Allowed: "Income diversified across [asset types]"
Prohibited: "Well-diversified" "Safe portfolio"
Primary: Asset diversification
```

**Market-Dependent**:
```
Meaning: Asset income affected by market conditions
Insight: "Asset income depends on market performance"
Allowed: "Income from assets varies with market conditions"
Prohibited: "Volatile" "At risk from markets" "Should change portfolio"
Primary: Market dependency of asset income
```

#### MIXED DEPENDENCY

**Balanced Mix** (Multiple types significant):
```
Meaning: Several income types contribute materially
Insight: "You have multiple types of income"
Allowed: "Income comes from [type A] and [type B]"
Prohibited: "Diversified" "Resilient" "Well-positioned"
Primary: Income type composition (structural fact)
```

**Dominated by One Type** (90%+ from one):
```
Meaning: Multiple types, but one dominates
Insight: "Primary income is [type]; supplemented by [other types]"
Allowed: "[Type A] is [X]% of income; [type B] is [Y]%"
Prohibited: Same as dominant type
Primary: Use primary type rules
```

**Unstable Mix** (Types change frequently):
```
Meaning: Income composition is volatile
Insight: "Your income comes from multiple changing sources"
Allowed: "Income composition varies; currently [types]"
Prohibited: "Unstable" "Risky" "Should stabilize"
Primary: Income type volatility
```

---

## PART 5: DECISION-CONTEXT RULES

### Home Purchase

**Employer Dependency** (Most relevant):
```
Primary: Concentration in single employer affects mortgage qualification
Secondary: W-2 is lender-preferred; employment stability matters
Language: "Your income is employment-dependent. Lender will verify employment."
Must Avoid: "Job security concerns" "Likely to be laid off" "Should find more stable work"
```

**Client Dependency**:
```
Primary: Client concentration risk (largest client loss = income loss)
Secondary: Income variability and contract terms
Language: "Largest client represents [X]% of income. Loss of this client would impact ability to service mortgage."
Must Avoid: "Client relationships are unstable" "Should diversify clients" "At risk"
```

**Transaction Dependency**:
```
Primary: Income variability and visibility (lender concerns)
Secondary: Concentration in deal flow
Language: "Commission income varies based on transaction volume. Lender will verify average income over time."
Must Avoid: "Commission is risky" "Unstable income" "Should get steady work"
```

**Asset Dependency**:
```
Primary: Stability and predictability (positive for mortgage)
Secondary: Asset value dependency
Language: "Asset income is relatively predictable. Lender will verify income history."
Must Avoid: Generic statements; focus on predictability factor
```

**Platform Dependency**:
```
Primary: Platform control of income terms (lender concern)
Secondary: Income variability
Language: "Income depends on platform terms and access. Lender will focus on income history."
Must Avoid: "Platform might remove you" "Precarious" "Vulnerable"
```

### Career Change

**Employer Dependency** (Most relevant):
```
Primary: Loss of employment = total income loss (no recurring base)
Secondary: W-2 doesn't provide transition income
Language: "All income requires active employment. Career transition would eliminate income completely."
Must Avoid: "Job loss" "Might be fired" "Risky" "Should wait"
```

**Client Dependency**:
```
Primary: Can client relationships continue during transition?
Secondary: Retainers vs. project-only work
Language: "Client relationships can potentially continue at reduced hours during transition."
Must Avoid: "Client relationships are insecure" "Should build more clients first"
```

**Recurring Revenue** (Client retainers):
```
Primary: Recurring base provides runway (positive)
Secondary: Can be scaled down to support transition
Language: "Recurring retainer income ([X]%) continues without full hours, providing transition foundation."
Must Avoid: Same as Client
```

**Transaction Dependency**:
```
Primary: Deal flow stops if focus shifts (no runway)
Secondary: Deal-based income can't be reduced; hours = income
Language: "Commission income would decline significantly if hours shift to new career."
Must Avoid: "Deal flow is unreliable" "Should find more stable work"
```

### Business Launch

**Concentration/Largest Client** (Most relevant):
```
Primary: Major client is financial safety net during launch
Secondary: Client relationship must survive launch focus
Language: "Largest client ([X]% of income) would be your financial foundation during launch."
Must Avoid: "Client might leave" "Risk if you focus elsewhere" "Should build deeper relationships first"
```

**Recurring vs. Project** (Most relevant):
```
Primary: Recurring income continues at reduced hours; projects decline
Secondary: Revenue structure during launch focus shift
Language: "Recurring revenue ([X]%) continues if hours reduce; project revenue ([Y]%) would decline."
Must Avoid: Same as above
```

**Dependency Type Flexibility**:
```
EMPLOYER: Reduce hours? Not feasible; employment is full-time model
CLIENT: Can often reduce hours or reduce projects while maintaining retainers
PLATFORM: Limited flexibility; hours directly = income
TRANSACTION: No flexibility; deal-closing requires full attention
ASSET: No impact from launch focus
```

### Education Investment

**Labor Dependence** (Most relevant):
```
Primary: Can you study while working?
Secondary: Income continues during program?
Language: "Your income requires [X]% active work. You could study while maintaining [Y]% recurring income."
Must Avoid: "Full-time study is feasible/infeasible" "You can afford this" "You should/shouldn't study"
```

**Variability** (Most relevant):
```
Primary: Income consistency for program payment planning
Secondary: Month-to-month variations
Language: "Your income varies [X]%. Program with fixed monthly payments would need to accommodate variation."
Must Avoid: "Stable enough for school" "Can support tuition" "This program is feasible"
```

**Dependency Type Impact**:
```
EMPLOYER: Can reduce hours for school if employer allows
CLIENT: Can often reduce hours while maintaining retainers
PLATFORM: Can set own hours; flexibility
TRANSACTION: No flexibility; hours = income
ASSET: No impact from education focus
```

### Investment Property

**Concentration + Variability** (Most relevant):
```
Primary: What if largest income source changes?
Secondary: Variability creates mismatch with fixed property costs
Language: "Income is [A]% concentrated + shows [B]% variability. Property has fixed costs that don't adjust."
Must Avoid: "Need [X] reserves" "Can't afford property" "Too risky"
```

**Fragility** (Most relevant):
```
Primary: How vulnerable is income to disruption?
Secondary: Multiple disruption modes
Language: "Income structure shows [fragility level]. Loss of largest source + variability would create cash flow pressure."
Must Avoid: "Too fragile for property" "Should wait until more stable" "This is risky"
```

**Dependency Type Risk**:
```
EMPLOYER: Job loss = all income; high property risk
CLIENT: Client loss = partial income; moderate risk
PLATFORM: Platform removal = all income; high risk
TRANSACTION: Deal loss = income reduction; high volatility risk
ASSET: Complement to other income; lower risk
```

---

## PART 6: INDUSTRY-CONTEXT RULES

### Technology Industry

**Software Sales + Employer Dependency**:
```
Structure: W-2 salary + commission from deals
Report: "Your income combines W-2 base + commission. W-2 is stable; commission varies."
Why: Tech sales is compensation structure, not dependency change
Language: "W-2 base is typical for tech sales; commission is supplementary."
Avoid: "Commission is risky" "Base protects you" "Stable structure"
```

**Software Sales + Platform Dependency** (Unusual):
```
Structure: Work as contractor through platform
Report: "Your tech work flows through a platform. Platform provides access to customers."
Why: Platform is intermediary; different from typical employer
Language: "Platform-based tech work. Platform controls work assignment."
Avoid: "Precarious" "Vulnerable to platform" "Should find direct work"
```

### Real Estate Industry

**Real Estate Agent + Transaction Dependency**:
```
Structure: Commission-based; each deal is transaction
Report: "Your income is commission-based. Each transaction is independent. Income depends on closing deals."
Why: Core structure of real estate agent role
Language: "Commission income; varies with deal pipeline and closing success."
Avoid: "Income is unstable" "Unreliable" "Should look for steady work"
```

**Real Estate Agent + Concentration**:
```
Structure: Concentrated in broker/brokerage relationship
Report: "If broker relationship changes, [X]% of income would be affected."
Why: Broker controls access to listings, technology, support
Language: "Broker relationship is critical to income access."
Avoid: "Broker might remove you" "Insecure position"
```

### Consulting Industry

**Consultant + Client Dependency**:
```
Structure: Multiple retainer clients + project clients
Report: "You work directly with clients. Income from retainers ([X]%) and projects ([Y]%)."
Why: Direct client relationships are core structure
Language: "Client relationships provide income. Mix of retainers + projects."
Avoid: "Relationships are fragile" "Unstable" "Should diversify"
```

**Consultant + Recurring Revenue**:
```
Structure: Retainers provide base; projects supplementary
Report: "Retainer income ([X]%) continues; project income ([Y]%) varies with project flow."
Why: Retainers vs. projects is structural distinction
Language: "Recurring retainers provide foundation; projects are supplementary."
Avoid: Same as above
```

### Freelance Industry

**Freelancer + Platform Dependency** (Upwork, Fiverr, etc.):
```
Structure: Work flows through marketplace; client found through platform
Report: "Your work comes through a freelance platform. Platform controls visibility and client access."
Why: Platform is intermediary; different from direct client work
Language: "Platform-based freelancing. Marketplace provides customer access."
Avoid: "Platform might remove you" "Precarious" "Should leave the platform"
```

**Freelancer + Client Dependency** (Direct clients):
```
Structure: Direct client relationships; platform not primary
Report: "You work directly with clients. You manage client relationships."
Why: Direct relationships give more control
Language: "Direct client relationships provide income."
Avoid: Same as Consultant above
```

### Financial Services

**Financial Advisor + Client Dependency**:
```
Structure: AUM fees from specific client accounts
Report: "Your income comes from managing specific client accounts. Income tied to client relationships and account size."
Why: AUM is client-specific; different from transaction-based
Language: "Client-dependent income. AUM-based fee structure."
Avoid: "Client relationships are risky" "Should diversify clients"
```

**Financial Advisor + Asset Dependency** (Portion):
```
Structure: Some income from own investments + client assets
Report: "Part of income comes from own investments. Asset performance affects income."
Why: Asset dependency is structural component
Language: "Asset-backed income component ([X]%). Depends on investment performance."
Avoid: "Asset-dependent" (if saying own assets determine financial health)
```

### Healthcare

**Physician + Employer Dependency**:
```
Structure: Hospital/health system employment
Report: "Your income is employment-based. Medical license is portable; can find work elsewhere."
Why: Portability of credentials is relevant to employment risk
Language: "Hospital employment. Medical credential provides employment flexibility."
Avoid: "Hospital concentration means vulnerability" "Should look elsewhere"
```

**Physician + Contract Dependency** (Locum tenens):
```
Structure: Contract-based assignments through staffing agency
Report: "Your income comes from contract assignments. Each contract is term-based."
Why: Contract structure is key distinction
Language: "Contract-based employment through staffing model."
Avoid: "Contracts are unstable" "Contract income is risky"
```

---

## PART 7: EDGE CASE HANDLING

### Edge Case 1: W-2 Employee with 100% Employer Dependency

**Trigger**: 
- labor_dependence >= 0.95
- concentration = 1.0 (single employer)

**Handling**:
- Classify as: EMPLOYER DEPENDENCY
- Report: "All income from single employer. Loss of employment = total income loss."
- Not a problem; this is structural fact
- Don't imply risk; this is common structure
- Language: Factual (employment-dependent), not judgmental

---

### Edge Case 2: Commission Employee with Employer + Transaction Dependency

**Trigger**:
- W-2 base salary (60%) + commission (40%)

**Handling**:
- Primary: EMPLOYER (W-2 is primary structure)
- Secondary: Note commission component
- Report: "Income combines W-2 base + commission. Base is stable; commission varies with sales."
- Don't classify as TRANSACTION (W-2 is primary structure)

---

### Edge Case 3: Freelancer with Multiple Clients Through One Platform

**Trigger**:
- Multiple clients (5-10)
- All accessed through platform (Upwork, Toptal, etc.)

**Handling**:
- Primary: PLATFORM DEPENDENCY (platform is intermediary)
- Secondary: Note client diversification
- Report: "Multiple clients accessed through platform. Platform controls access and terms."
- Not CLIENT (platform controls relationship)

---

### Edge Case 4: Business Owner with One Major Client (90%+)

**Trigger**:
- Business owner (self-employed)
- One client is 90%+ of revenue

**Handling**:
- Classify as: CLIENT DEPENDENCY (or ask user)
- Report: "Nearly all income ([X]%) from one client. Loss of this client would be severe."
- Extreme concentration; this is structural fact
- Don't imply judgment; focus on concentration fact

---

### Edge Case 5: Real Estate Agent with Broker Concentration

**Trigger**:
- Real estate agent (transaction-based)
- All transactions through one broker

**Handling**:
- Primary: TRANSACTION DEPENDENCY (commission structure)
- Secondary: Broker concentration
- Report: "Transaction-based income through one broker. Broker relationship is critical."
- Broker concentration is secondary to transaction structure

---

### Edge Case 6: Financial Advisor with Mixed Client + Asset Dependency

**Trigger**:
- W-2 base salary (40%)
- AUM fees from client accounts (40%)
- Own investment income (20%)

**Handling**:
- Classify as: MIXED DEPENDENCY (multiple significant types)
- Report: "Income combines W-2 salary + AUM fees + own investments. Multiple income sources."
- Three distinct types; none dominant
- Keep description factual and specific

---

### Edge Case 7: Household with Multiple Income Types

**Trigger**:
- Person 1: W-2 employment (60% of household)
- Person 2: Freelance (30% of household)
- Investment income (10% of household)

**Handling**:
- For each person: Classify individually
- Household level: MIXED DEPENDENCY
- Report: Describe each person's dependency separately
- Don't aggregate; multiple income earners = multiple dependencies

---

### Edge Case 8: User Selects "Mixed" When Single Type Dominates

**Trigger**:
- User selects MIXED
- But 95% from one type (e.g., 95% W-2, 5% rental)

**Handling**:
- Option 1: Accept MIXED (user preference)
- Option 2: Clarify: "Most income is from [type]. Should we select [type] instead?"
- Option 3: Store as stated; note primary type inferred from RP-2.0
- Default: Use user's answer; don't override

---

### Edge Case 9: Unclear User Answer

**Trigger**:
- User answer is ambiguous (e.g., "both" or "all of them")

**Handling**:
- Response: "Let's clarify. What generates the largest part of your income?"
- Follow-up with most common category questions
- If still unclear: Mark as INFERRED from RP-2.0
- Flag in report: "Dependency type inferred; user should verify"

---

### Edge Case 10: Low Confidence Assessment

**Trigger**:
- RP-2.0 confidence_score < 0.5
- Dependency type provided but inconsistent with RP-2.0 data

**Handling**:
- Use provided dependency type (customer input > inference)
- But flag confidence in metadata
- Report note: "Income structure analysis based on your input; low confidence in some metrics"
- Don't over-interpret concentration

---

### Edge Case 11: Income Structure Changes Frequently

**Trigger**:
- User has changed income type multiple times in recent months
- E.g., W-2 → Freelance → W-2 → Commission

**Handling**:
- Ask: "What is your income like right now?" (current state)
- Use current state, not history
- Note in report: "Current income structure; may change"
- Don't predict future changes

---

### Edge Case 12: Part-Time Arrangement

**Trigger**:
- User has part-time W-2 (30%) + part-time platform work (40%) + freelance (30%)

**Handling**:
- Classify as: MIXED (multiple significant types)
- Report: "Income comes from multiple sources: W-2 ([X]%), platform work ([Y]%), freelance ([Z]%)"
- Each type is significant; none dominates
- No aggregation; describe each type's dependency

---

## PART 8: TEST CASES

### Test 1: Software Sales + Home Purchase + Employer Dependency

**Inputs**:
```
decision_type: HomePurchase
industry: Technology / SaaS Sales
rp2_outputs:
  concentration: 100% (single employer)
  labor_dependence: 15% (salary is stable base)
  variability: 20% (commission varies)
  forward_visibility: 12 months (employment contract)
  fragility_deduction: 1 (low risk)
primary_dependency: EMPLOYER
```

**Expected Primary Insight**:
```
TEXT: "Your income is entirely from a single W-2 employer. 
       Loss of employment would eliminate 100% of income. 
       Mortgage qualification will focus on employment stability and history."
       
SECONDARY: "Your commission component varies with performance ([X]%). 
            Lender may use lower multiplier for variable portion."
            
SUPPORTING: "W-2 employment income is lender-preferred. 
             Typical documentation: employment verification, paystubs, W-2s."
```

**Prohibited Language**:
- ❌ "Your job is secure"
- ❌ "You are ready to buy"
- ❌ "You should buy now"
- ❌ "Employment risk is low"

**Why Rule Fired**:
- Employer Dependency determined by user answer and confirmed by 100% concentration
- High concentration in employment creates primary insight
- W-2 is mortgage-positive; document explains lender process

---

### Test 2: Real Estate Agent + Investment Property + Transaction Dependency

**Inputs**:
```
decision_type: InvestmentProperty
industry: Real Estate
rp2_outputs:
  concentration: 70% (one broker/source)
  labor_dependence: 90% (commission-dependent)
  variability: 60% (deal-based and seasonal)
  forward_visibility: 2 months (pipeline-based)
  fragility_deduction: 5 (moderate fragility)
primary_dependency: TRANSACTION
```

**Expected Primary Insight**:
```
TEXT: "Your income is commission-based (transaction-dependent). 
       Each deal closing generates income; no deals = no income. 
       Income varies ([X]%) based on deal pipeline and closing success."
       
SECONDARY: "Income is [Y]% concentrated in one broker/source. 
           Broker relationship changes would affect [Y]% of income."
           
SUPPORTING: "Income shows significant month-to-month variation. 
             Property has fixed costs that don't adjust seasonally. 
             Income structure creates mismatch with property expense requirements."
```

**Prohibited Language**:
- ❌ "Commission income is unstable"
- ❌ "You are at risk"
- ❌ "You should not buy property"
- ❌ "You need [X] reserves" (affordability calculation)

**Why Rule Fired**:
- Transaction Dependency from user answer + confirmed by 90% labor dependence
- High variability + low visibility surfaces as primary concern
- Concentration in broker + transaction structure = secondary insight
- Mismatch between variable income + fixed property costs = supporting

---

### Test 3: Contractor + Business Launch + Client Dependency

**Inputs**:
```
decision_type: BusinessLaunch
industry: Consulting
rp2_outputs:
  concentration: 60% (largest client)
  labor_dependence: 75% (retainers + projects)
  income_persistence: 40% (recurring retainers)
  forward_visibility: 4 months (retainer contracts)
  fragility_deduction: 2 (good resilience)
primary_dependency: CLIENT
```

**Expected Primary Insight**:
```
TEXT: "Your largest client represents [X]% of income. 
       This client relationship is your financial foundation during launch. 
       Protecting and maintaining this client while building new business is critical."
       
SECONDARY: "Recurring retainer income ([Y]%) continues even if project hours reduce. 
            This provides launch foundation. 
            Project work ([Z]%) would decline if focus shifts."
            
SUPPORTING: "Client relationships allow hours flexibility. 
             Can reduce project work while maintaining retainers. 
             Income structure supports parallel business building model."
```

**Prohibited Language**:
- ❌ "Client might leave"
- ❌ "You are at risk from client loss"
- ❌ "You should build more clients first"
- ❌ "You are not ready to launch"

**Why Rule Fired**:
- Client Dependency from user answer + confirmed by direct client concentration
- 60% concentration in largest client = primary insight
- Recurring revenue base = secondary (positive for launch)
- Structure supports flexibility = supporting

---

### Test 4: Freelancer + Home Purchase + Platform Dependency

**Inputs**:
```
decision_type: HomePurchase
industry: Tech/Design Freelance
rp2_outputs:
  concentration: 65% (Upwork is primary platform)
  labor_dependence: 85% (project-based work)
  variability: 45% (project flow varies)
  forward_visibility: 3 months (limited pipeline)
  fragility_deduction: 3 (moderate fragility)
primary_dependency: PLATFORM
```

**Expected Primary Insight**:
```
TEXT: "Your work flows through a freelance platform. 
       Platform controls visibility, work assignment, and terms. 
       Income depends on platform access and algorithm. 
       Lender will focus on income history and platform reliability."
       
SECONDARY: "Income shows moderate variation ([X]%) based on project availability. 
            Lender may require longer income history to verify stability."
            
SUPPORTING: "Platform-based income. Lender typically requires [duration] of history. 
             Multiple platforms would strengthen application."
```

**Prohibited Language**:
- ❌ "Platform might remove you"
- ❌ "Platform income is precarious"
- ❌ "You should get direct clients"
- ❌ "Platform work is risky"

**Why Rule Fired**:
- Platform Dependency from user answer + confirmed by 65% platform concentration
- Platform as intermediary = key structural insight
- Forward visibility (3 months) is short; noted as secondary
- Lender perspective = practical context for Home Purchase decision

---

### Test 5: Physician + Home Purchase + Employer Dependency

**Inputs**:
```
decision_type: HomePurchase
industry: Healthcare / Physician
rp2_outputs:
  concentration: 90% (hospital employer)
  labor_dependence: 20% (salary continues)
  variability: 25% (salary + shift bonus)
  forward_visibility: 24 months (contract)
  fragility_deduction: 1 (very low - high resilience)
primary_dependency: EMPLOYER
```

**Expected Primary Insight**:
```
TEXT: "Your income is concentrated in hospital employment ([X]%). 
       However, medical credential is portable; you could transition to another system. 
       This portability reduces employment concentration risk. 
       Lender will find W-2 physician income highly attractive."
       
SECONDARY: "Income is stable month-to-month ([X]% variability). 
            Shift bonus is supplementary; salary is primary. 
            Stability is favorable for mortgage qualification."
            
SUPPORTING: "Healthcare professional income. 
             Medical credential provides employment flexibility across systems. 
             Physician income is preferred by lenders; standard documentation required."
```

**Prohibited Language**:
- ❌ "Hospital job is secure"
- ❌ "You are ready to buy"
- ❌ "Physician income is good"
- ❌ "Portability protects you"

**Why Rule Fired**:
- Employer Dependency confirmed (hospital W-2)
- High concentration + portability of credential = unique insight
- Medical credential portability is structural fact, not judgment
- Physician income context for Home Purchase

---

### Test 6: Financial Advisor + Education Investment + Client/Asset Mixed

**Inputs**:
```
decision_type: EducationInvestment
industry: Finance / Wealth Management
rp2_outputs:
  concentration: 50% (balanced mix)
  labor_dependence: 40% (60% continues without active work)
  income_persistence: 60% (W-2 base + AUM)
  variability: 20% (stable base + variable commission)
  forward_visibility: 12 months (client contracts)
primary_dependency: MIXED (Client + Asset components)
```

**Expected Primary Insight**:
```
TEXT: "Your income comes from multiple sources: W-2 salary ([X]%), 
       AUM fees from client accounts ([Y]%), and commission ([Z]%). 
       About 60% continues without active work (salary + AUM)."
       
SECONDARY: "Your income is stable month-to-month ([20]% variability). 
            This stability supports consistent education expense planning."
            
SUPPORTING: "You could maintain 60% of income (salary + AUM) while studying. 
             Commission income would likely decline if focus shifts. 
             Part-time study is compatible with reduced hours."
```

**Prohibited Language**:
- ❌ "You can afford education"
- ❌ "This program is feasible"
- ❌ "You are ready to invest in education"
- ❌ "Stable enough for school"

**Why Rule Fired**:
- Mixed Dependency (multiple significant income types)
- Labor dependence 40% = key insight for education planning
- Income persistence 60% = structural positive for study/work balance
- Variability 20% = favorable for fixed education costs

---

### Test 7: Business Owner + Investment Property + Client Dependency

**Inputs**:
```
decision_type: InvestmentProperty
industry: B2B Services / Business Owner
rp2_outputs:
  concentration: 85% (one major account)
  labor_dependence: 60% (business can run with support)
  variability: 50% (project-based)
  forward_visibility: 6 months (contract)
  fragility_deduction: 4 (moderate vulnerability)
primary_dependency: CLIENT
```

**Expected Primary Insight**:
```
TEXT: "Nearly all business income ([X]%) comes from one client account. 
       Loss of this account would be severe. 
       Business structure is highly vulnerable to single-client loss."
       
SECONDARY: "Income shows moderate variation ([Y]%) based on project activity. 
            Variable income creates mismatch with property's fixed obligations."
            
SUPPORTING: "Single-client concentration + project variability + moderate fragility. 
             Income structure shows vulnerability to multiple disruption modes."
```

**Prohibited Language**:
- ❌ "You need [X] reserves"
- ❌ "This is too risky for property"
- ❌ "You should wait"
- ❌ "You are not ready"

**Why Rule Fired**:
- Client Dependency from high concentration in account
- 85% concentration = extreme dependency on one client
- 50% variability + fixed property costs = mismatch insight
- Fragility deduction indicates structural vulnerability

---

### Test 8: Commission-Only Salesperson + Home Purchase + Transaction Dependency

**Inputs**:
```
decision_type: HomePurchase
industry: Sales / Commission-Only
rp2_outputs:
  concentration: 70% (largest product line)
  labor_dependence: 100% (pure commission)
  variability: 55% (deal-based)
  forward_visibility: 1 month (pipeline-based)
  fragility_deduction: 4 (moderate fragility)
primary_dependency: TRANSACTION
```

**Expected Primary Insight**:
```
TEXT: "Your income is entirely commission-based (100% labor dependent). 
       Each sale generates income; no sales = no income. 
       Lender will require extensive income history to establish stability baseline."
       
SECONDARY: "Income is [Y]% concentrated in one product line. 
            Loss of this sales channel would impact [Y]% of income."
            
SUPPORTING: "Commission income varies significantly ([Z]%) based on sales activity. 
             Lender may require [duration] of history to qualify. 
             Income stability demonstration is critical for mortgage approval."
```

**Prohibited Language**:
- ❌ "Commission income is risky"
- ❌ "You should get steady work"
- ❌ "You are unlikely to qualify"
- ❌ "This is unstable income"

**Why Rule Fired**:
- Transaction Dependency (pure commission structure)
- 100% labor dependence = all income requires active selling
- Forward visibility 1 month = lender concern (short pipeline)
- Extensive history requirement is structural fact

---

### Test 9: Consultant + Career Change + Contract Dependency

**Inputs**:
```
decision_type: CareerChange
industry: Consulting / Professional Services
rp2_outputs:
  concentration: 45% (no dominant client)
  labor_dependence: 70% (retainers + projects)
  income_persistence: 35% (recurring retainers)
  forward_visibility: 5 months (contract terms)
  fragility_deduction: 2 (good resilience)
primary_dependency: CLIENT
```

**Expected Primary Insight**:
```
TEXT: "Your income comes from multiple client relationships. 
       Recurring retainer income ([X]%) would continue even if focus shifts. 
       This provides transition foundation."
       
SECONDARY: "About [Y]% of income requires active work on projects. 
            Project work would decline if hours shift to new career. 
            Recurring retainers ([Z]%) are your transition base."
            
SUPPORTING: "Multiple clients reduce concentration risk. 
             Retainer structure allows reduced hours while building new career. 
             Income model supports gradual transition."
```

**Prohibited Language**:
- ❌ "You have [X] months of runway"
- ❌ "You can afford to transition"
- ❌ "You are ready to change careers"
- ❌ "Clients might leave"

**Why Rule Fired**:
- Client Dependency (direct client relationships)
- 35% recurring (retainers) = key insight for career change runway
- 70% labor dependence = active work required, but retainers continue
- Multiple clients = lower concentration risk

---

### Test 10: Mixed Income Household + Home Purchase + Mixed Dependency

**Inputs**:
```
decision_type: HomePurchase
income_structure: Household with multiple earners
rp2_outputs (person 1): W-2 software engineer (60% of household income)
rp2_outputs (person 2): Freelancer (25% of household income)
investment_income: 15% of household income
primary_dependency: MIXED (evaluated per person + household)
```

**Expected Primary Insight**:
```
TEXT: "Your household income comes from multiple sources: 
       Person 1 is W-2 employed ([X]%), Person 2 is self-employed freelance ([Y]%), 
       and investment income ([Z]%). Lender will evaluate each income type separately."
       
SECONDARY: "W-2 employment income ([X]%) is primary and stable. 
            Freelance income ([Y]%) requires additional verification. 
            Investment income ([Z]%) is supplementary."
            
SUPPORTING: "Household income is diversified across employment types. 
             Lender will focus on combined stability and verification of each source. 
             Multiple income sources can strengthen application."
```

**Prohibited Language**:
- ❌ "Diversified income is good"
- ❌ "You are well-positioned"
- ❌ "Multiple sources make you stable"
- ❌ "You are ready to buy"

**Why Rule Fired**:
- Mixed Dependency (multiple significant income types at household level)
- Each person has different dependency type
- Lender evaluates per-income-source
- Multiple sources = factual structural description (not judgment)

---

## PART 9: IMPLEMENTATION OUTPUT

### 1. Final Dependency Type Taxonomy

✅ **6 Core Types** (Locked):
1. Employer Dependency
2. Client Dependency
3. Platform Dependency
4. Transaction Dependency
5. Asset Dependency
6. Mixed Dependency

### 2. Customer-Facing Intake Question

**Question**:
> "Which of these best describes your largest income source?"

**Options** (in order):
1. An employer (W-2 job, salary)
2. Clients or customers (freelance, consulting)
3. A platform or marketplace (Uber, Upwork, Etsy)
4. Commission or sales activity (real estate, sales)
5. Investments or rental property (passive income)
6. A mix of these (multiple income types)

### 3. Backend Enum Contract

```
Field: primary_dependency_type
Type: ENUM
Values: EMPLOYER | CLIENT | PLATFORM | TRANSACTION | ASSET | MIXED
Required: NO (but improves interpretation)
Score Impact: NONE (interpretation-only)
Fallback: Inferred from RP-2.0 if not provided
```

### 4. Validation Rules

```
✅ Exact enum match required
✅ Case-insensitive input
✅ Error message if invalid
✅ Fallback to inference if not provided
✅ Store last valid value if correction needed
```

### 5. Interpretation Rules

✅ **Dependency Type × Concentration Matrix**: 6 types × 3 levels (18 combinations)
✅ **Language Maps**: Allowed / Prohibited per combination
✅ **Primary/Secondary/Supporting Logic**: Defined for all combinations

### 6. Decision-Context Rules

✅ **Home Purchase**: Employer & Client most relevant; Transaction concerning
✅ **Career Change**: Labor dependence critical; recurring income is runway
✅ **Business Launch**: Largest client concentration; recurring base viability
✅ **Education Investment**: Labor dependence & variability for study compatibility
✅ **Investment Property**: Concentration & fragility for property cost mismatch

### 7. Industry-Context Examples

✅ **Technology**: W-2 + commission; employer primary
✅ **Real Estate**: Transaction-dependent; broker concentration secondary
✅ **Consulting**: Client-dependent; retainer vs. project distinction
✅ **Financial Services**: Client-dependent for AUM; asset component possible
✅ **Healthcare**: Employer-dependent; credential portability relevant
✅ **Freelance**: Platform vs. direct clients (key distinction)

### 8. Edge-Case Handling

✅ **12 Edge Cases Defined**: W-2 + commission, multiple platforms, unclear answers, etc.
✅ **Deterministic Routing**: Each edge case has specified handling
✅ **User Clarity**: Confusion points identified and reduction strategies provided

### 9. Test Cases

✅ **10 Test Cases**: Covers all 5 decision types + various dependency types
✅ **Expected Outputs**: Primary, secondary, supporting insights specified
✅ **Prohibited Language**: Called out for each case
✅ **Rule Firing Logic**: Explained for each

### 10. Implementation Checklist

#### Phase 1: Intake Question
- [ ] UI component for 6 dependency options
- [ ] Helper text for each option
- [ ] Confusion-reduction messaging
- [ ] Validation on selection
- [ ] Store selection in backend

#### Phase 2: Backend Integration
- [ ] Add `primary_dependency_type` field to assessment
- [ ] Implement enum validation
- [ ] Implement inference rules
- [ ] Add field to API contract

#### Phase 3: Interpretation Engine
- [ ] Build dependency type × concentration matrix
- [ ] Implement insight generation logic
- [ ] Add language map validation
- [ ] Implement decision-context rules

#### Phase 4: Report Generation
- [ ] Update report templates to use dependency context
- [ ] Add dependency-specific language per section
- [ ] Validate against prohibited language list
- [ ] Test all 10 test cases

#### Phase 5: Testing & QA
- [ ] Unit test all 6 dependency types
- [ ] Unit test all edge cases
- [ ] Integration test with RP-2.0 outputs
- [ ] Validate test case outputs
- [ ] User acceptance testing

---

## SUMMARY

The Primary Dependency Framework enables RunPayway to answer: **"What is the income primarily dependent on?"**

**Benefit**: More specific, contextual report language without changing RP-2.0 score or adding advice.

**Example Improvement**:
- **Before**: "A large portion of income is concentrated."
- **After**: "A large portion of income is dependent on one employer. Loss of employment would eliminate 100% of income."

**Implementation Status**: Ready for development. All specifications locked.

