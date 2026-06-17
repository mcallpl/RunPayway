# RunPayway™ Interpretation Layer Specification

**Status**: Final implementation specification for Interpretation Layer  
**Objective**: Increase report value from 6.5–7/10 to 8.5+/10 without adding advice, predictions, or determinations  
**Scope**: Complete deterministic interpretation rules above RP-2.0 engine  

---

## PART 1: PRIMARY DEPENDENCY FRAMEWORK

### Dependency Type Analysis

**Question**: Are the 7 proposed types sufficient?

**Answer**: ✅ **YES, with modification**

The 7 types cover 95%+ of income structures. Add one more for completeness.

---

### Complete Dependency Type Library

#### **1. EMPLOYER DEPENDENCY**

**Definition**: Income flows from W-2 employment relationship with single or primary employer.

**What Creates It**:
- W-2 salary
- W-2 bonus (even if variable)
- W-2 benefits (health, retirement matching)
- Employer-provided equity/ESOP

**Inputs Required**:
- Primary income source is W-2 employment
- Employer concentration (100% in single employer is typical)

**How It Differs from Concentration**:
- Concentration (Q2) measures: "70% from largest source"
- Dependency Type measures: "That 70% is a W-2 employer, not a transaction"
- Importance: W-2 employer dependency is more stable than transaction dependency

**How It Affects Interpretation**:
- ✅ Income is stable and predictable
- ✅ Employer can provide job continuity verification
- ❌ Job loss = 100% income loss (no other source)
- ❌ Career change = must leave employer (income stops immediately)
- ⚠️ Employment verification is standard (lenders know this type)

**Report Language It Supports**:
✅ "Your income is entirely employer-dependent (W-2). This means: [employer characteristics matter]"  
✅ "In home purchase, employer stability is what lenders verify"  
✅ "In career change, you must leave this employer entirely"  

**Report Language It Prohibits**:
❌ "Your income is secure" (wrong; job loss = no income)  
❌ "This income will continue forever" (wrong; employer can terminate)  
❌ "You're approved for the decision" (can't approve)  

---

#### **2. CLIENT DEPENDENCY**

**Definition**: Income flows from client relationships (retainers, projects, services). Client is distinct entity that could terminate relationship.

**What Creates It**:
- Consulting retainers
- Agency client relationships
- Freelance client base
- Professional services client list
- Retained advisor relationships

**Inputs Required**:
- Primary income source is client relationships (not platform, not transactions)
- Client concentration (typical: 1-5 major clients)
- Contract duration (month-to-month vs. annual)

**How It Differs from Concentration**:
- Concentration measures: "60% from one client"
- Dependency Type measures: "That 60% is a relationship-dependent client, not an employer"
- Importance: Client loss is different from employer loss (can replace clients; job replacement is different)

**How It Affects Interpretation**:
- ⚠️ Income is medium-term stable (depends on contract renewal)
- ⚠️ Client can terminate with notice period (typically 30-90 days)
- ❌ Client loss = significant income loss but can replace client
- ⚠️ Career change = can reduce hours on clients while building new business
- ⚠️ Client relationship quality matters (tenure, renewal likelihood)

**Report Language It Supports**:
✅ "Your income is client-dependent. This means: [client relationship characteristics matter]"  
✅ "In business launch, you can reduce hours on clients while building new business"  
✅ "Client tenure and renewal likelihood affect income stability"  

**Report Language It Prohibits**:
❌ "Client loss means you're jobless" (wrong; you can find new clients)  
❌ "Your income is as stable as W-2 employment" (wrong; higher turnover risk)  
❌ "You're stuck with these clients" (wrong; you can diversify)  

---

#### **3. CONTRACT DEPENDENCY**

**Definition**: Income flows from specific, time-bound contracts or commitments. Contract is the primary security mechanism.

**What Creates It**:
- Fixed-term service contracts
- SaaS recurring contracts with customer
- Licensed/proprietary usage contracts
- Government/institutional contracts

**Inputs Required**:
- Primary income source is contractual commitment
- Contract term length (1-year, 3-year, multi-year)
- Renewal likelihood (automatic, optional, uncertain)

**How It Differs from Concentration**:
- Concentration measures: "50% from one contract"
- Dependency Type measures: "That 50% is a 3-year locked contract, not month-to-month"
- Importance: Contract lock-in creates stability; lack of lock-in creates fragility

**How It Affects Interpretation**:
- ✅ Income is highly predictable during contract term
- ❌ Income uncertainty exists at renewal
- ✅ Multiple contracts provide diversification
- ⚠️ Contract portfolio health is critical

**Report Language It Supports**:
✅ "Your income is contract-dependent. Contracts total [X years] of committed revenue"  
✅ "Contract renewal dates: [timeline]"  
✅ "In investment property, contract income covers property costs if contracts renew"  

**Report Language It Prohibits**:
❌ "Your income is guaranteed" (wrong; depends on renewal)  
❌ "You have long-term security" (wrong; depends on contract terms)  

---

#### **4. TRANSACTION DEPENDENCY**

**Definition**: Income flows from completed transactions or deals. Each transaction is independent; income stops when transactions stop.

**What Creates It**:
- Real estate commissions (deal-by-deal)
- Sales commissions (transaction-based)
- Broker/dealer fees (per-deal)
- Project completion fees (per-project)

**Inputs Required**:
- Primary income source is transaction-based (not employer, not client, not contract)
- Deal/transaction flow (typical: variable monthly)
- Seasonality pattern (Q4 strong, Q1 weak, etc.)

**How It Differs from Concentration**:
- Concentration measures: "70% of deals this year were real estate"
- Dependency Type measures: "Income is transaction-based (deal-dependent), not employer or client dependent"
- Importance: Transaction dependency is highly variable and market-dependent

**How It Affects Interpretation**:
- ❌ Income is unpredictable (deal-dependent, market-dependent)
- ❌ Income can drop to zero if deal flow stops
- ⚠️ Seasonal variation is typical (Q4 peak, Q1-Q2 valley)
- ❌ Career change = cannot build new business while closing deals (incompatible activities)
- ⚠️ Forward visibility is poor (deals in pipeline ≠ closed deals)

**Report Language It Supports**:
✅ "Your income is transaction-dependent. Income comes from [deal closing / deal brokerage]"  
✅ "Seasonal pattern: Q4 peak, Q1-Q2 valley"  
✅ "In investment property, transaction income variability matters for expense coverage"  

**Report Language It Prohibits**:
❌ "Your income is stable" (wrong; highly variable)  
❌ "You can build a new business on the side" (wrong; incompatible with deal-closing)  

---

#### **5. PLATFORM DEPENDENCY**

**Definition**: Income flows from a third-party platform. Platform controls terms, access, payment, and can change/terminate without notice.

**What Creates It**:
- Gig work (Uber, DoorDash, TaskRabbit)
- Creator economy (YouTube, Twitch, TikTok)
- Freelance platforms (Upwork, Fiverr, Toptal)
- App marketplaces (Apple App Store, Google Play, Amazon)
- Affiliate networks

**Inputs Required**:
- Primary income source is platform-mediated (not direct client, not contract)
- Platform concentration (100% of income on single platform is high risk)
- Platform stability (mature platform vs. new platform)

**How It Differs from Concentration**:
- Concentration measures: "70% from single income source"
- Dependency Type measures: "That 70% flows through Upwork platform; platform risk exists"
- Importance: Platform can change terms, suspend account, or disappear

**How It Affects Interpretation**:
- ⚠️ Income is medium-term vulnerable (platform risk)
- ❌ Platform can change terms (algorithm, fees, policies) without notice
- ❌ Platform can suspend/ban account
- ⚠️ Income can drop to zero if platform bans user
- ⚠️ Forward visibility is poor (depends on platform algorithm)

**Report Language It Supports**:
✅ "Your income flows through [platform]. This means: [platform risk characteristics]"  
✅ "Platform concentration of [X]% creates additional risk beyond normal concentration"  
✅ "Platform changes (algorithm, fees, policies) can affect income without notice"  

**Report Language It Prohibits**:
❌ "Your income is stable" (wrong; platform risk)  
❌ "You control your income" (wrong; platform controls access/terms)  

---

#### **6. ASSET DEPENDENCY**

**Definition**: Income flows from ownership/control of assets. Assets generate income relatively independently of personal labor.

**What Creates It**:
- Rental income (real estate)
- Dividend income (securities)
- Licensing income (intellectual property)
- Affiliate income (established platform/audience)
- Passive income (automated systems)

**Inputs Required**:
- Primary income source is asset-generated (not labor)
- Asset type (real estate, securities, IP, audience)
- Asset stability (mortgaged vs. free and clear; market-dependent vs. stable)

**How It Differs from Concentration**:
- Concentration measures: "50% from real estate rental"
- Dependency Type measures: "That 50% is asset-backed income; scales independently of labor"
- Importance: Asset income is more durable than labor income

**How It Affects Interpretation**:
- ✅ Income continues without personal labor (90-day test reveals this)
- ✅ Income is more durable and long-term
- ⚠️ Asset quality and maintenance matter
- ⚠️ Market conditions affect asset value (real estate, stocks)
- ✅ Asset can be replaced/added (scale through more assets)

**Report Language It Supports**:
✅ "Your income is asset-backed. This means: [asset income characteristics]"  
✅ "Asset income represents [X]% of total; provides stability foundation"  
✅ "Asset-backed income continues without active work"  

**Report Language It Prohibits**:
❌ "You have passive income without any work" (wrong; assets require maintenance/management)  
❌ "Asset income will grow" (wrong; can't predict)  

---

#### **7. MIXED DEPENDENCY** (Most Common)

**Definition**: Income flows from multiple dependency types combined. Most common real-world scenario.

**What Creates It**:
- W-2 salary + commission (employer + transaction)
- Retainers + project work (client + transaction)
- W-2 salary + rental income (employer + asset)
- Consulting retainers + own products (client + asset)

**Inputs Required**:
- Identify primary dependency type (largest %)
- Identify secondary dependency type (next largest %)
- Concentration within each type

**How It Differs from Concentration**:
- Concentration measures: "60% from largest source"
- Dependency Type measures: "Primary source is [Type A]; secondary is [Type B]"
- Importance: Mix of types creates different stability profile than single type

**How It Affects Interpretation**:
- ⚠️ Income profile depends on mix of types
- ⚠️ Loss of primary type affects income differently than loss of secondary
- ✅ Multiple types provide diversification
- ⚠️ Types may be correlated (both drop in recession) or uncorrelated (stable in different conditions)

**Report Language It Supports**:
✅ "Your income is mixed: [X]% from [Type A], [Y]% from [Type B]"  
✅ "Loss of [Type A] would impact income by [X]%; loss of [Type B] by [Y]%"  
✅ "Types provide [correlation/diversification]"  

**Report Language It Prohibits**:
❌ "You have stable income" (depends on type mix)  
❌ "You have diversified income" (diversification depends on types and their correlation)  

---

### Secondary Framework Decisions

**Question**: Should RunPayway also identify:
- Secondary Dependency?
- Dependency Strength?
- Dependency Stability?

**Answer**: ⚠️ **DEPENDS ON COMPLEXITY COST**

**Secondary Dependency**:
- ✅ Valuable: Identifies second-largest income source type
- ⚠️ Cost: Adds complexity; requires additional input
- ⚠️ Justification: 80% of insight comes from PRIMARY dependency
- 🔴 Recommendation: **DEFER** — Start with primary only; add secondary in v1.1 if needed

**Dependency Strength** (how locked-in is the dependency):
- Example: Contract Dependency with 1-month notice vs. 3-year lock
- ✅ Valuable: Explains why same dependency type can have different stability
- ⚠️ Cost: Significant complexity; requires contract term input
- 🟡 Recommendation: **CONDITIONAL** — Include if contract term input is collected (already planned)

**Dependency Stability** (how likely is the dependency to continue):
- Example: Client relationship with 5-year tenure vs. 1-month tenure
- ✅ Valuable: Explains dependency risk beyond type
- ❌ Cost: Very high complexity; requires historical data
- 🔴 Recommendation: **DO NOT INCLUDE** — Requires data not available at intake

---

### Primary Dependency Input Specification

**Input Name**: Primary Income Dependency Type  
**Input Type**: Single-select dropdown  
**Options**:
1. Employer (W-2)
2. Client (Consulting, Freelance, Agency)
3. Contract (Time-bound commitment)
4. Transaction (Deal-by-deal, Commission)
5. Platform (Gig, Creator, Marketplace)
6. Asset (Rental, Dividend, Licensing)
7. Mixed (Multiple types)

**If Mixed**: Follow-up input:
- Primary Dependency Type: [selection]
- Secondary Dependency Type: [selection]
- Percentage split: [primary %] / [secondary %]

**Friction**: Minimal (1-3 selections depending on mix)  
**Effort to Add**: Low (1 input, deterministic rules)  
**Value Unlocked**: High (transforms generic "concentration" into specific "concentration in [TYPE]")

---

## PART 2: INDUSTRY DEPENDENCY LIBRARY

### Architecture

**Goal**: Deterministic interpretation rules at intersection of:
- Industry
- Primary Dependency Type
- Constraint (from RP-2.0)

**Result**: Same score + constraint produces different interpretations based on industry + dependency.

---

### Example: Real Estate Industry

#### REAL ESTATE: Common Patterns

**Typical Dependency Mix**:
- Primary: Transaction (70–85%)
- Secondary: Retainer/Referral (15–30%)

**Common Concentration Pattern**:
- Single broker: 70–90%
- Single property type: 60–80%
- Combination of both: 50%+ from one broker + type

**Common Visibility Pattern**:
- Pipeline visibility: 2–4 months (deals in progress)
- Closing uncertainty: 30–40% of pipeline closes
- Forward visibility: 1–2 months of actual committed revenue

**Common Variability Pattern**:
- Seasonal: Q4 peak, Q1-Q2 valley (40–60% swing)
- Deal-dependent: Month-to-month swings of 50–75%
- Predictable seasonality but unpredictable deal timing

**Common Labor Dependence Pattern**:
- 85–95% labor-dependent (income stops if not closing deals)
- Cannot delegate deal closing (must be personal)
- Cannot reduce hours without proportional income loss

**Common Fragility Trigger**:
- Market downturn (fewer deals, longer sales cycles)
- Broker relationship loss (change brokers = loss of deal flow)
- Personal events (illness, sabbatical, career change)

---

### Interpretation Rules Matrix

**Rules Format**: IF [Industry] + [Dependency Type] + [Constraint] THEN [Interpretation]

#### Real Estate + Transaction + High Concentration

```
IF Industry = Real Estate
   + Dependency Type = Transaction
   + Concentration ≥ 70%

THEN:
  Primary narrative: "Income is concentrated in deal pipeline from [single broker/single property type]"
  
  Structural observation: "This concentration is typical for real estate agents, 
  but creates market-cycle vulnerability"
  
  Variability context: "Real estate deal flow is seasonal (Q4 peak, Q1-Q2 valley); 
  your concentration amplifies seasonal swings"
  
  Visibility context: "Forward visibility is limited to deals in current pipeline; 
  many pipeline deals do not close"
  
  What this means for [Decision Type]:
    • Home Purchase: "Commission income requires 2+ years documentation; 
      concentration may require larger down payment"
    • Career Change: "Cannot build new career while closing deals; incompatible activities"
    • Business Launch: "Deal flow must continue to fund launch; reducing hours = reduced income"
    • Education: "Seasonality (Q1-Q2 valley) makes tuition payment inconsistent"
    • Investment Property: "Variable income means worst-case months may not cover property costs"
```

#### Real Estate + Transaction + Low Forward Visibility

```
IF Industry = Real Estate
   + Dependency Type = Transaction
   + Forward Visibility ≤ 15%

THEN:
  Primary narrative: "Deal pipeline visibility is limited; closed deals are your only committed revenue"
  
  Structural observation: "This is typical for real estate, but creates planning uncertainty"
  
  What this means: "You cannot reliably project income beyond current month; 
  next month depends on deals closing this month"
  
  For investment property: "Property requires fixed expenses; transaction-based income 
  makes month-to-month expense coverage uncertain"
```

---

### Industry Library Specifications

**For Each Industry, Define**:

1. **Common Dependency Types** (what's typical)
2. **Common Concentration Pattern** (where does income concentrate)
3. **Common Visibility Pattern** (how far ahead can they see)
4. **Common Variability Pattern** (how much do earnings swing)
5. **Common Labor Dependence** (how much is active work)
6. **Fragility Triggers** (what breaks the income structure)
7. **Interpretation Rules** (IF industry + dependency + constraint THEN...)

**Industries to Build First** (highest volume, highest complexity):
1. ✅ Real Estate (high transaction dependency)
2. ✅ Sales/Commission (high transaction dependency)
3. ✅ Healthcare (high employer + W-2)
4. ✅ Technology (mixed: salary + equity + bonus)
5. ✅ Consulting (high client + retainer)
6. ✅ Finance (high employer + bonus)
7. ✅ Freelance/Gig (high platform dependency)

**Phase 1 Build**: 7 industries (covers 70% of use cases)  
**Phase 2 Build**: Remaining 12 industries (covers remaining 30%)

---

## PART 3: DECISION INTERPRETATION ENGINE

### Home Purchase Decision

**What Characteristics Matter Most**:
1. **Income Continuity** — Will income continue for 30 years?
2. **Verification Feasibility** — Can lenders verify/underwrite this income?
3. **Concentration Risk** — Would loss of largest source eliminate mortgage payment?
4. **Labor Dependence** — Would job loss/disability eliminate payment?

**What Should Be Surfaced First**:
- Dependency type (what kind of income is supporting the mortgage?)
- Concentration (how much from single source?)
- Labor dependence (what % continues if you can't work?)

**What Should Be Ignored**:
- Visibility/forward planning (lenders don't care; mortgage is 30 years)
- Variability (lenders accept employment income has bonus variation)
- Diversification opportunities (not relevant to home purchase decision)

**What Creates Customer Insight**:
✅ "Your dependency type is [Type]; lenders verify [Type-specific verification]"  
✅ "Your concentration [X]% from [source type] matters for down payment / interest rate"  
✅ "If largest source is lost, [X]% of income disappears; emergency reserves matter"  
✅ "Your labor dependence [X]% means job loss = mortgage payment risk"  

**What Creates Dissatisfaction**:
❌ "You're approved for a mortgage" (can't say; not RunPayway's role)  
❌ "Here's how much you can borrow" (can't calculate; not underwriting)  
❌ "Here's the interest rate you'll get" (can't predict)  
❌ "You should wait before buying" (can't prescribe timing)  

**What Creates "I Never Thought About That" Moments**:
✅ "Your dependency type (Transaction) means each deal is independent; lenders care about deal-closing consistency"  
✅ "Your concentration in [broker] is industry-typical but means specific lender documentation"  
✅ "Your labor dependence [X]% means job loss would immediately eliminate mortgage payment ability"  

---

### Career Change Decision

**What Characteristics Matter Most**:
1. **Recurring Income Availability** — What % of income continues without current job?
2. **Transition Duration** — How many months can recurring income sustain living?
3. **New Career Income Timeline** — When would new income need to replace current?
4. **Runway Clarity** — Is runway sufficient for realistic transition?

**What Should Be Surfaced First**:
- Recurring income amount (explicit calculation)
- Labor dependence (what % continues without job)
- Timeframe needed (how many months until new income required)

**What Should Be Ignored**:
- Forward visibility (not relevant; leaving current job anyway)
- Concentration (not relevant; you're leaving everything)
- Stability bands (not relevant; this is a temporary transition decision)

**What Creates Customer Insight**:
✅ "Your recurring income is $X/month; this is your transition foundation"  
✅ "If you leave [current job], $Y of income continues automatically; $Z must come from savings"  
✅ "At $Z/month burn rate, your savings provides [N] months runway"  
✅ "New career would need to generate $Z/month by month [N] to avoid savings depletion"  

**What Creates Dissatisfaction**:
❌ "You're ready for a career change" (can't determine readiness)  
❌ "You should wait 6 months" (can't prescribe timing)  
❌ "You need X savings first" (can't prescribe requirements)  
❌ "You can't afford this career change" (can't determine affordability)  

**What Creates "I Never Thought About That" Moments**:
✅ "Your recurring income ($X) covers Y% of living expenses; this is your safety net"  
✅ "Removing current income assumes you'd drop from $A to $B; new career must reach $B eventually"  
✅ "Your dependency type (Client vs. Employer) affects how quickly you could reduce hours during transition"  

**CRITICAL MISSING INPUT FOR THIS DECISION**:
❌ **Living Expenses** — RunPayway doesn't collect this
- Needed to calculate: Runway = Recurring Income ÷ Monthly Burn Rate
- Without it: Cannot surface explicit runway calculation
- Alternative: Provide formula, let customer calculate
- See Part 7 for detailed discussion

---

### Business Launch Decision

**What Characteristics Matter Most**:
1. **Current Business Sustainability** — Will income sustain if hours reduce to 60%?
2. **Largest Client Security** — Is largest client your safety net?
3. **Runway Definition** — How many months until new business must generate income?
4. **Revenue Stability** — Which income components continue if focus shifts?

**What Should Be Surfaced First**:
- Income type breakdown (what % is recurring, active, etc.)
- Dependency type (how does reducing hours affect each type?)
- Largest client details (concentration + stability)

**What Should Be Ignored**:
- Diversity score (not relevant; can't diversify while launching new business)
- Forward visibility (not relevant; changing business anyway)
- Variability patterns (not relevant; will change during launch)

**What Creates Customer Insight**:
✅ "Your recurring income ($X) should continue at reduced hours; active income ($Y) will decline"  
✅ "Your largest client represents [Z]%; this is your financial safety net during launch"  
✅ "If focus reduces 50%, income would likely drop from $A to $B; new business must generate $[A-B] by month [N]"  
✅ "Your dependency type (Client vs. Transaction) affects how easily you can reduce hours"  

**What Creates Dissatisfaction**:
❌ "You're ready to launch a business" (can't determine readiness)  
❌ "You should wait until you have more savings" (can't prescribe requirements)  
❌ "You can launch while maintaining full hours" (wrong; not realistic)  

**What Creates "I Never Thought About That" Moments**:
✅ "Your largest client is [Z]% of income; losing this during launch would be catastrophic"  
✅ "Your dependency type (Transaction) means you can't easily reduce hours; each deal reduced = income reduced"  
✅ "Your recurring income ($X) is your runway; new business must replace active income ($Y) or runway depletes"  

**CRITICAL MISSING INPUT FOR THIS DECISION**:
❌ **Target Hours Reduction** — RunPayway doesn't know what % hours customer wants to reduce
- Needed to calculate: New income at reduced hours
- Without it: Cannot surface "hours reduction impact" explicitly
- Alternative: Provide table: "If you reduce from 40 hrs to 20 hrs, impact depends on your type"
- See Part 7 for detailed discussion

---

### Education Investment Decision

**What Characteristics Matter Most**:
1. **Income Consistency** — Is income predictable month-to-month?
2. **Monthly Cash Flow** — Can income cover tuition + living consistently?
3. **Study Mode Feasibility** — Full-time vs. part-time based on income pattern?
4. **Income Continuation** — Will income continue if reducing work hours?

**What Should Be Surfaced First**:
- Income variability (worst month vs. best month)
- Tuition payment feasibility (can you pay same amount each month?)
- Work/study compatibility (can you study while maintaining income?)

**What Should Be Ignored**:
- Concentration (not relevant; tuition is fixed regardless)
- Forward visibility (not relevant; tuition is predictable)
- Labor dependence (not relevant unless reducing work hours)

**What Creates Customer Insight**:
✅ "Your monthly income ranges from $X to $Y; this affects tuition payment consistency"  
✅ "Your worst month ($X) is [above/below] typical MBA payment of $Z"  
✅ "Your variability pattern suggests [full-time / part-time / flexible] study is most feasible"  
✅ "Your dependency type (Employer vs. Client) affects whether you can reduce work hours during intensive courses"  

**What Creates Dissatisfaction**:
❌ "You can afford an MBA" (can't determine affordability)  
❌ "You should wait for more stable income" (can't prescribe timing)  
❌ "You need X savings first" (can't prescribe requirements)  

**What Creates "I Never Thought About That" Moments**:
✅ "Your variability [X]% means worst-case months may require savings draw for tuition"  
✅ "Your dependency type (W-2) makes part-time study compatible; full-time study means income stops"  
✅ "If you reduce hours during intensive courses, your income would drop by [%]; plan accordingly"  

**CRITICAL MISSING INPUT FOR THIS DECISION**:
❌ **Tuition Amount & Duration** — RunPayway doesn't know program cost
- Needed to calculate: Can income cover tuition?
- Without it: Cannot surface "tuition payment feasibility" explicitly
- Alternative: Ask customer to provide; create simple comparison
- See Part 7 for detailed discussion

---

### Investment Property Decision

**What Characteristics Matter Most**:
1. **Worst-Case Income Coverage** — In worst months, is income above property costs?
2. **Reserve Requirements** — How many months of property expenses should be saved?
3. **Concentration Risk** — If largest source is lost, can property still be afforded?
4. **Income Durability** — Will income sustain if personal events disrupt work?

**What Should Be Surfaced First**:
- Worst-case monthly income (explicit number)
- Property cost estimate (from customer or standard for area)
- Income shortfall in worst months (explicit gap)

**What Should Be Ignored**:
- Forward visibility (not relevant; property payment is 30 years)
- Diversity score (not relevant; concentration matters differently here)

**What Creates Customer Insight**:
✅ "In worst months, your income ($X) vs. property costs ($Y) creates a $Z gap"  
✅ "To sustain [N] months of worst-case income, you'd need $[reserves] in emergency savings"  
✅ "Your largest source is [Z]% of income; if lost, property becomes [sustainable/tight/untenable]"  
✅ "Your dependency type (Transaction) means income volatility directly impacts property expense coverage"  

**What Creates Dissatisfaction**:
❌ "You can afford investment property" (can't determine affordability)  
❌ "You're not ready to buy investment property" (can't determine readiness)  
❌ "You should wait until you have more savings" (can't prescribe requirements)  

**What Creates "I Never Thought About That" Moments**:
✅ "In your worst month ($X), property costs ($Y) exceed income; this is real and requires reserves"  
✅ "Your concentration [Z]% means property's entire safety net depends on one client/source"  
✅ "Your dependency type (Transaction) means property costs are fixed but income is variable; reserves are essential"  

**CRITICAL MISSING INPUT FOR THIS DECISION**:
❌ **Property Cost Estimate** — RunPayway doesn't know property price
- Needed to calculate: Income gap in worst months
- Without it: Cannot surface "expense coverage" explicitly
- Alternative: Ask customer for estimated property cost; calculate gap
- See Part 7 for detailed discussion

---

## PART 4: INSIGHT HIERARCHY

### Ranking Algorithm

**Objective**: Determine which insight appears first in report.

**Principle**: Surface the constraint/characteristic that most affects the selected decision.

---

### Ranking Rules (Deterministic)

#### **Rule 1: Decision-Specific Ranking**

**For Home Purchase**:
- Rank by: Concentration, then Labor Dependence, then Continuity
- Why: Lenders care most about income stability for 30-year mortgage

**For Career Change**:
- Rank by: Recurring Income Availability, then Runway Clarity, then Dependency Type
- Why: Transition requires understanding how much income continues

**For Business Launch**:
- Rank by: Largest Client Security, then Recurring Income, then Runway
- Why: Launch is high-risk; largest client and recurring base are safety nets

**For Education Investment**:
- Rank by: Variability/Consistency, then Dependency Type, then Income Continuity
- Why: Tuition requires consistent monthly payments

**For Investment Property**:
- Rank by: Worst-Case Coverage Gap, then Concentration Risk, then Stability
- Why: Property has fixed costs; worst-case coverage is critical

---

#### **Rule 2: Constraint Severity Override**

If a constraint is severe (extreme value), it overrides decision-specific ranking.

```
IF Fragility Score ≤ 25 (Brittle):
  Rank Fragility first (regardless of decision)
  Why: Structural health is foundational

IF Concentration ≥ 85%:
  Rank Concentration second (unless overridden by fragility)
  Why: Single-point-of-failure is critical risk

IF Labor Dependence ≥ 95%:
  Rank Labor Dependence high
  Why: Income completely dependent on personal effort

IF Variability > 75% (Extreme):
  Rank Variability high for decisions sensitive to consistency
  Why: Extreme swings affect planning decisions
```

---

#### **Rule 3: Dependency Type Context**

Factor dependency type into ranking:

```
IF Dependency Type = Platform:
  Rank Platform Risk high
  Why: Platform can change terms/suspend account

IF Dependency Type = Transaction:
  Rank Variability/Forward Visibility high
  Why: Transaction income is volatile and uncertain

IF Dependency Type = Asset:
  Rank Labor Dependence low (it will be good)
  Emphasize Income Continuity instead
  Why: Asset income is durable

IF Dependency Type = Employer:
  Rank Job Loss Risk high
  Why: Single job = 100% income loss
```

---

### Insight Ranking Output

**Report Structure for Each Decision**:

```
SECTION 1: PRIMARY INSIGHT (Decision-ranked first insight)
  [Most important finding for this decision]

SECTION 2: SECONDARY INSIGHT (Second-most important)
  [Second most important finding]

SECTION 3: SUPPORTING OBSERVATIONS
  [Additional structural observations]

SECTION 4: DEPENDENCY DETAIL
  [Explicit dependency type + implications]

SECTION 5: DECISION-SPECIFIC CONTEXT
  [What this means for selected decision]
```

---

### Example: Software Sales + Home Purchase

**Decision**: Home Purchase  
**Dependency Type**: Employer (W-2)  
**Concentration**: 100% (single employer)  
**Labor Dependence**: Low (100% salary continues)  
**Variability**: Low (salary is stable)  
**Fragility**: Medium (job loss = no income)  

**Insight Ranking**:
1. **Primary**: "Your income is employer-dependent (W-2). Concentration in single employer is typical for W-2 income but means job loss = no income."
2. **Secondary**: "Your income stability for mortgage: W-2 salary is lender-preferred; requires employment verification; commission component will be scrutinized."
3. **Supporting**: "Labor dependence is low (salary continues); job stability is the key variable."

---

### Example: Real Estate Agent + Investment Property

**Decision**: Investment Property  
**Dependency Type**: Transaction (commission-based)  
**Concentration**: 70% from broker  
**Labor Dependence**: 90% (income stops if not closing deals)  
**Variability**: 60% (seasonal + deal-dependent)  
**Fragility**: Uneven (some resilience but notable gaps)  

**Insight Ranking**:
1. **Primary**: "Your worst-case monthly income ($3K) vs. property costs ($6K) creates $3K monthly gap. This requires property expense reserves."
2. **Secondary**: "Your dependency type (transaction-based commission) means income is volatile; property costs are fixed. This mismatch requires careful planning."
3. **Supporting**: "Your concentration (70% from single broker) means broker loss would be catastrophic during property ownership. Broker relationship stability is critical."

---

## PART 5: REPORT VALUE TEST

### Current Gap Analysis

**Current Report Satisfaction**: 6.5–7/10

**Why**:
- ✅ Income structure is described accurately
- ✅ RP-2.0 scoring is defensible
- ❌ Interpretation feels generic (same for all customers)
- ❌ Missing: What makes THIS PERSON'S structure unique
- ❌ Missing: Dependency type context
- ❌ Missing: Industry-specific patterns
- ❌ Missing: Decision-specific emphasis

---

### What Would Move Report to 8.5+/10

#### **Addition 1: Dependency Type Identification**

**Current**: "Your income is concentrated at 70%."  
**With Addition**: "Your income is concentrated at 70% in [Employer/Client/Platform/Transaction]. This means [TYPE-specific implication]."

**Customer Value**:
- ✅ Makes interpretation specific to their income type
- ✅ Reveals "this concentration matters differently than I thought"
- ✅ No length increase (substitution, not addition)
- ✅ No advice added (pure measurement)

**Implementation**: +1 input (Primary Dependency Type)  
**Effort**: Medium (rules for each type + combinations)  
**Value Increase**: +0.5–1.0 point (moves from generic to specific)

---

#### **Addition 2: Industry Context**

**Current**: Generic interpretation for all industries.  
**With Addition**: "In [industry], [constraint] typically means [industry-specific pattern]."

**Example**:
- Real Estate: "Concentration in deal pipeline creates seasonality (Q4 peak, Q1-Q2 valley)"
- Software Sales: "Concentration in single employer is typical; job stability is key variable"
- Consulting: "Concentration in retainers is healthy; project income is variable"

**Customer Value**:
- ✅ Makes interpretation relevant to their industry
- ✅ Provides context: "Is this normal for my field?"
- ✅ Reveals industry-specific patterns
- ✅ No advice added (pure measurement + context)

**Implementation**: Industry-specific rules (already planned)  
**Effort**: High (19 industries × constraints × dependency types)  
**Value Increase**: +0.75–1.0 point (moves from generic to industry-relevant)

---

#### **Addition 3: Decision-Specific Emphasis**

**Current**: Same 8 sections for all 5 decision types.  
**With Addition**: Reorder sections by decision-specific ranking.

**Example**:
- Home Purchase: Emphasize "Concentration & Labor Dependence" (lender concerns)
- Career Change: Emphasize "Recurring Income & Runway" (transition concerns)
- Investment Property: Emphasize "Worst-Case Coverage" (expense concerns)

**Customer Value**:
- ✅ Makes report feel personally relevant
- ✅ Reveals what matters for their specific decision
- ✅ No additional content (reordering only)
- ✅ No advice added (same info, different priority)

**Implementation**: Insight ranking rules (already designed in Part 4)  
**Effort**: Low (reorder report sections per decision)  
**Value Increase**: +0.5–0.75 point (makes report feel personal)

---

#### **Addition 4: Explicit Insight Surfacing**

**Current**: Report describes structure; customer must infer implications.  
**With Addition**: Report explicitly states the ONE insight most relevant to decision.

**Example**:
- Home Purchase: "Your W-2 income is lender-preferred; requires employer verification"
- Career Change: "Your recurring income ($X) provides [N] months runway if you leave job"
- Investment Property: "In worst months, property costs exceed income by $Z; reserves needed"

**Customer Value**:
- ✅ Removes ambiguity ("here's what this means for YOUR decision")
- ✅ Creates "I never thought about that" moment
- ✅ No length increase (substitution of generic with specific)
- ✅ No advice added (pure measurement + implication)

**Implementation**: Decision-specific interpretation rules (already designed in Part 3)  
**Effort**: Medium (write decision-specific implications)  
**Value Increase**: +1.0–1.5 points (this is the primary value driver)

---

#### **Addition 5: Explicit Gap Analysis** (If Inputs Provided)

**Requirement**: Customer provides [Living Expenses | Property Costs | Tuition]

**Current**: Report describes income structure.  
**With Addition**: Report shows explicit gap for relevant decisions.

**Examples**:
- Career Change: "Recurring income ($X) covers Y% of living expenses ($Z); gap: $[Z-X]"
- Investment Property: "Worst-case income ($X) vs. property costs ($Y); gap: $[Y-X]"
- Education: "Monthly variability ($X–$Y) vs. tuition ($Z); feasibility: [assessment]"

**Customer Value**:
- ✅ Makes decision implications explicit
- ✅ No advice (pure gap analysis)
- ✅ Highly relevant to decision

**Implementation**: Collect optional input + calculate gap  
**Effort**: Low (simple calculation)  
**Value Increase**: +0.75–1.0 point (if inputs provided)  
**Risk**: If inputs not provided, no benefit

---

### Summary: Value Improvements

| Addition | Current | With Addition | Effort | Value ↑ |
|----------|---------|---------------|--------|---------|
| Dependency Type | Generic | Specific | Medium | +0.5–1.0 |
| Industry Context | Generic | Industry-Relevant | High | +0.75–1.0 |
| Decision Emphasis | Same for all | Decision-Specific | Low | +0.5–0.75 |
| Explicit Insight | Implicit | Explicit | Medium | +1.0–1.5 |
| Gap Analysis | N/A | Explicit (if inputs) | Low | +0.75–1.0 |
| **Total Potential** | **6.5–7/10** | **8.5–9.5/10** | — | **+2.0–2.5** |

**Conservative Estimate**: Additions 1–4 → 8.0–8.5/10  
**Optimistic Estimate**: Additions 1–5 → 8.5–9.5/10

---

## PART 6: CUSTOMER SATISFACTION STRESS TEST

### Test Methodology

For each decision type, evaluate from customer perspective:
1. What are they hoping to learn?
2. What's their actual underlying question?
3. What information feels valuable?
4. What information feels generic?
5. What information disappoints?
6. What creates "aha" moments?
7. What creates referral potential?
8. What creates repeat usage?

**Scoring**:
- Customer Satisfaction (1–10): Does it meet expectations?
- Perceived Value (1–10): Is it worth $9.99?
- Insight Score (1–10): Did it reveal something new?
- Referral Potential (1–10): Would they recommend?

---

### HOME PURCHASE

**What They're Hoping to Learn**:
- "Will lenders approve me?"
- "What interest rate will I get?"
- "What's my max loan amount?"
- "What else should I prepare?"

**Their Actual Question**:
> "Is my income strong enough for home purchase?"

**What Feels Valuable**:
✅ "Lenders will verify [income type] like this..."  
✅ "Your concentration [X]% might affect [down payment / interest rate]"  
✅ "If [largest source] is lost, you'd lose [X]% of income — emergency reserves matter"  
✅ "Employment verification is key for W-2 income; commission requires [documentation]"  

**What Feels Generic**:
⚠️ "You have salary + commission income" (they already know)  
⚠️ "Concentration is a risk" (obvious)  
⚠️ "Stability band is Established" (so what?)  

**What Disappoints**:
❌ "This determines whether you're approved" (we can't say)  
❌ "This is your max loan amount" (we can't calculate)  
❌ "This predicts your interest rate" (we can't predict)  

**"Aha" Moments** (with new report):
✅ "My W-2 salary is what matters; commission is secondary"  
✅ "Being 100% employer-dependent means job loss = mortgage risk"  
✅ "My concentration in one broker matters for documentation"  

**Referral Potential**:
⚠️ Medium — Useful if it answered their questions; low if it felt generic

**Repeat Usage**:
❌ Minimal — One-time use unless refinancing

**Rating Prediction**:

| Metric | Current | With New Additions | Target |
|--------|---------|-------------------|--------|
| Satisfaction | 6/10 | 8/10 | 8.5+/10 |
| Perceived Value | 5/10 | 7.5/10 | 8.5+/10 |
| Insight | 6/10 | 8/10 | 8.5+/10 |
| Referral | 5/10 | 7.5/10 | 8.5+/10 |
| **Average** | **5.5/10** | **7.6/10** | **8.5+/10** |

**Gap Remaining for 8.5+**: Needs explicit dependency type + decision emphasis + lender documentation context.

---

### CAREER CHANGE

**What They're Hoping to Learn**:
- "How long can I survive without income?"
- "How much should I save?"
- "When is the right time to leave?"
- "What's my safety net?"

**Their Actual Question**:
> "Can I afford to leave this job and survive the transition?"

**What Feels Valuable**:
✅ "Your recurring income is $X/month; this is your transition foundation"  
✅ "If you leave, [X]% of income continues automatically"  
✅ "Based on your recurring income, you have [N]-month runway"  
✅ "New career must generate $X/month by month [N] to avoid savings depletion"  

**What Feels Generic**:
⚠️ "You have retainers + project work" (they know)  
⚠️ "Recurring income is important" (obvious)  
⚠️ "Career change is risky" (obvious)  

**What Disappoints**:
❌ "You're ready to change careers" (we can't determine)  
❌ "You should wait 6 months" (we can't prescribe)  
❌ "You need $X saved" (we can't determine requirement)  

**"Aha" Moments** (with new report):
✅ "My recurring income is only [Y]% of total; that's my transition safety net"  
✅ "Leaving this job means losing [Z]% of income immediately"  
✅ "My runway is [N] months, assuming my expenses stay same"  

**Referral Potential**:
✅ High — Very relevant for others considering career change

**Repeat Usage**:
⚠️ Moderate — May use again if timeline changes; useful during job search

**Rating Prediction**:

| Metric | Current | With New Additions | Target |
|--------|---------|-------------------|--------|
| Satisfaction | 7/10 | 8.5/10 | 8.5+/10 |
| Perceived Value | 7/10 | 8.5/10 | 8.5+/10 |
| Insight | 7/10 | 8.5/10 | 8.5+/10 |
| Referral | 8/10 | 9/10 | 8.5+/10 |
| **Average** | **7.25/10** | **8.6/10** | **8.5+/10** |

**Gap Remaining for 8.5+**: Needs explicit runway calculation (requires living expenses input).

---

### BUSINESS LAUNCH

**What They're Hoping to Learn**:
- "Can I afford to launch a business?"
- "How long do I need to keep current income?"
- "What if I lose my largest client during launch?"
- "How much runway do I have?"

**Their Actual Question**:
> "Can my current income sustain itself while I build something new?"

**What Feels Valuable**:
✅ "Your recurring income ($X) should continue even if you reduce hours"  
✅ "Your largest client is [Y]%; if lost during launch, [impact]"  
✅ "Reducing hours by 50% would impact income by approximately [Z]%"  
✅ "New business needs to generate $X/month by month [N] to replace active income"  

**What Feels Generic**:
⚠️ "You have recurring + project income" (they know)  
⚠️ "Largest client is important" (obvious)  
⚠️ "Business launches are risky" (obvious)  

**What Disappoints**:
❌ "You're ready to launch a business" (we can't determine)  
❌ "You should have more savings first" (we can't prescribe)  
❌ "You can't launch while working full-time" (we can't advise)  

**"Aha" Moments** (with new report):
✅ "My largest client is my safety net; can't afford to lose them during launch"  
✅ "My dependency type (Client) means I can reduce hours gradually"  
✅ "My recurring income ($X) covers [Y]% of living expenses; new business must generate remainder"  

**Referral Potential**:
✅ High — Very relevant for aspiring entrepreneurs

**Repeat Usage**:
✅ High — May reference during launch phase; may re-assess as new business develops

**Rating Prediction**:

| Metric | Current | With New Additions | Target |
|--------|---------|-------------------|--------|
| Satisfaction | 7/10 | 8.5/10 | 8.5+/10 |
| Perceived Value | 7/10 | 8.5/10 | 8.5+/10 |
| Insight | 8/10 | 9/10 | 8.5+/10 |
| Referral | 8/10 | 9/10 | 8.5+/10 |
| **Average** | **7.5/10** | **8.75/10** | **8.5+/10** |

**Gap Remaining for 8.5+**: Small — Mainly needs dependency type + explicit safety net analysis.

---

### EDUCATION INVESTMENT

**What They're Hoping to Learn**:
- "Can I afford to study?"
- "Will my income be consistent enough?"
- "Can I study full-time or must it be part-time?"
- "How will studying affect my income?"

**Their Actual Question**:
> "Is my income predictable enough to sustain multi-year education costs?"

**What Feels Valuable**:
✅ "Your income ranges from $X to $Y monthly; tuition stability: [assessment]"  
✅ "Your worst month ($X) is [above/below] typical MBA payment of $Z"  
✅ "Your variability pattern suggests [full-time / part-time / flexible] study is feasible"  
✅ "Your dependency type (Employer vs. Client) affects work/study compatibility"  

**What Feels Generic**:
⚠️ "You have salary + bonus" (they know)  
⚠️ "Income variability matters" (obvious)  
⚠️ "Education requires consistent payments" (obvious)  

**What Disappoints**:
❌ "You can afford an MBA" (we can't determine)  
❌ "You should wait for more stable income" (we can't prescribe)  
❌ "You need X savings first" (we can't prescribe)  

**"Aha" Moments** (with new report):
✅ "My worst month ($X) vs. tuition ($Y) creates a gap; I'd need to cover from savings"  
✅ "My dependency type (W-2) means full-time study = no income"  
✅ "Part-time evening study is feasible; full-time is risky given my income structure"  

**Referral Potential**:
✅ High — Relevant for others considering education

**Repeat Usage**:
⚠️ Low — One-time use, unless education is delayed

**Rating Prediction**:

| Metric | Current | With New Additions | Target |
|--------|---------|-------------------|--------|
| Satisfaction | 7/10 | 8.5/10 | 8.5+/10 |
| Perceived Value | 7/10 | 8.5/10 | 8.5+/10 |
| Insight | 7/10 | 8.5/10 | 8.5+/10 |
| Referral | 8/10 | 9/10 | 8.5+/10 |
| **Average** | **7.25/10** | **8.6/10** | **8.5+/10** |

**Gap Remaining for 8.5+**: Needs income variability vs. tuition analysis (requires tuition input).

---

### INVESTMENT PROPERTY

**What They're Hoping to Learn**:
- "Will my income cover property costs?"
- "What if income drops?"
- "How much should I save first?"
- "Am I taking on too much risk?"

**Their Actual Question**:
> "Can my income reliably cover fixed property expenses, especially in bad months?"

**What Feels Valuable**:
✅ "Your worst month income ($X) vs. property costs ($Y) creates $Z gap"  
✅ "To sustain [N] months of worst-case, you'd need $[reserves]"  
✅ "Your largest source is [Y]%; if lost, property becomes [sustainable/tight/untenable]"  
✅ "Your dependency type (Transaction) makes income volatile; property costs are fixed"  

**What Feels Generic**:
⚠️ "You have variable income" (they know)  
⚠️ "Property costs are fixed" (obvious)  
⚠️ "Investment property is risky" (obvious)  

**What Disappoints**:
❌ "You can afford investment property" (we can't determine)  
❌ "You're not ready to buy" (we can't determine)  
❌ "You need X months reserves" (we can't prescribe)  

**"Aha" Moments** (with new report):
✅ "In my worst months, property costs exceed income; I absolutely need emergency reserves"  
✅ "My concentration (70%) in one source means my entire property safety net depends on that source"  
✅ "My dependency type (Transaction/Commission) is incompatible with fixed property costs; volatility is real"  

**Referral Potential**:
✅ Very High — Critical decision, want real insight before committing

**Repeat Usage**:
✅ High — May reference during property search; may re-assess with different properties

**Rating Prediction**:

| Metric | Current | With New Additions | Target |
|--------|---------|-------------------|--------|
| Satisfaction | 6/10 | 8.5/10 | 8.5+/10 |
| Perceived Value | 6/10 | 8.5/10 | 8.5+/10 |
| Insight | 7/10 | 9/10 | 8.5+/10 |
| Referral | 7/10 | 9/10 | 8.5+/10 |
| **Average** | **6.5/10** | **8.75/10** | **8.5+/10** |

**Gap Remaining for 8.5+**: Needs property cost estimate + explicit gap calculation.

---

## PART 7: FINAL OUTPUT

### 1. COMPLETE PRIMARY DEPENDENCY FRAMEWORK

**Seven Dependency Types** ✅:
1. Employer Dependency (W-2)
2. Client Dependency (Freelance, Consulting)
3. Contract Dependency (Time-bound Commitments)
4. Transaction Dependency (Deal-by-deal, Commission)
5. Platform Dependency (Gig, Creator, Marketplace)
6. Asset Dependency (Rental, Dividend, IP)
7. Mixed Dependency (Multiple Types)

**Input Specification**:
- Single-select dropdown with options 1-7
- If Mixed: Follow-up inputs for primary + secondary + split
- Friction: Minimal (1-3 selections)
- Value: High (transforms generic to specific interpretation)

**Do NOT Include** (adds too much complexity without proportional value):
- ❌ Secondary Dependency (defer to v1.1)
- ❌ Dependency Strength (defer to v1.1)
- ❌ Dependency Stability (requires historical data; skip)

---

### 2. COMPLETE INDUSTRY DEPENDENCY LIBRARY ARCHITECTURE

**Build First** (7 industries, 70% of use cases):
1. Real Estate
2. Sales/Commission
3. Healthcare/Medical
4. Technology
5. Consulting/Professional Services
6. Finance/Banking
7. Freelance/Gig

**Build Second** (12 industries, remaining 30%):
8. Legal
9. Education
10. Insurance
11. Government/Public Sector
12. Manufacturing
13. Retail/E-commerce
14. Hospitality/Food Service
15. Transportation/Logistics
16. Construction
17. Media/Entertainment
18. Non-profit
19. Agriculture

**Architecture for Each Industry**:
```
INDUSTRY: [Name]

Common Dependency Types:
  Primary: [Type] [%]
  Secondary: [Type] [%]

Common Concentration Patterns:
  - [Source]: [typical %]
  - [Risk]: [description]

Common Visibility Pattern:
  - Forward visibility: [typical months]
  - Predictability: [assessment]

Common Variability Pattern:
  - Seasonal: [yes/no, pattern]
  - Month-to-month swing: [typical %]

Common Labor Dependence:
  - [typical %] of income is labor-dependent
  - [assessment of implications]

Fragility Triggers:
  - [Market/event that breaks structure]

Interpretation Rules:
  IF [Dependency Type] + [Constraint] THEN [Interpretation]
```

**Implementation Effort**: High (requires industry expertise)  
**Timeline**: 4 weeks (7 industries); 8 weeks (all 19)  
**ROI**: Transforms generic report into industry-contextual report

---

### 3. COMPLETE DECISION INTERPRETATION ENGINE

**For Each Decision Type**:

✅ **Home Purchase**:
- Characteristics Matter: Income Continuity, Verification Feasibility, Concentration, Labor Dependence
- Surface First: Dependency Type, Concentration, Labor Dependence
- Ignore: Visibility (not relevant; mortgage is 30 years), Diversity (not relevant)
- Insight: Lender verification approach, concentration implications, employment risk

✅ **Career Change**:
- Characteristics Matter: Recurring Income, Transition Duration, New Income Timeline, Runway
- Surface First: Recurring Income amount, Labor Dependence, Runway (if living expenses provided)
- Ignore: Concentration (you're leaving anyway), Visibility, Diversity
- Insight: Transition foundation, runway duration, income continuity without current job

✅ **Business Launch**:
- Characteristics Matter: Business Sustainability, Largest Client Security, Runway, Revenue Stability
- Surface First: Income Mix, Largest Client, Runway (if startup costs provided)
- Ignore: Diversity (can't diversify while launching), Visibility (irrelevant)
- Insight: Safety net (largest client), recurring income runway, dependency type implications

✅ **Education Investment**:
- Characteristics Matter: Income Consistency, Monthly Cash Flow, Study Mode, Income Continuation
- Surface First: Variability, Monthly Swing, Dependency Type (work/study compatibility)
- Ignore: Concentration (not relevant), Visibility (not relevant)
- Insight: Tuition payment feasibility, study mode recommendation, income consistency

✅ **Investment Property**:
- Characteristics Matter: Worst-Case Coverage, Reserve Requirements, Concentration Risk, Durability
- Surface First: Worst-Case Income, Property Cost Gap, Concentration, Dependency Type
- Ignore: Forward Visibility (irrelevant; property is 30 years), Diversity (not primary concern)
- Insight: Worst-month gap, reserve requirements, concentration risk to property

**Missing Inputs Required**: See Part 7 Section 7 below

---

### 4. COMPLETE INSIGHT HIERARCHY

**Ranking Algorithm**:

**Step 1**: Apply decision-specific ranking
```
Home Purchase → Rank by: [Concentration, Labor Dependence, Continuity]
Career Change → Rank by: [Recurring Income, Runway, Dependency Type]
Business Launch → Rank by: [Largest Client, Recurring Income, Runway]
Education → Rank by: [Variability, Dependency Type, Continuity]
Investment Property → Rank by: [Worst-Case Gap, Concentration, Stability]
```

**Step 2**: Override if severe constraint exists
```
IF Fragility ≤ 25 → Rank Fragility first
IF Concentration ≥ 85% → Rank Concentration second (unless overridden)
IF Labor Dependence ≥ 95% → Rank Labor Dependence high
IF Variability > 75% → Rank high for consistency-sensitive decisions
```

**Step 3**: Factor in dependency type
```
IF Platform Dependency → Rank Platform Risk high
IF Transaction Dependency → Rank Variability/Visibility high
IF Asset Dependency → Rank Labor Dependence low; emphasize Income Continuity
IF Employer Dependency → Rank Job Loss Risk high
```

**Result**: Deterministic insight ordering without subjectivity

---

### 5. CUSTOMER SATISFACTION ANALYSIS

**Current State**: 6.5–7/10 across all decision types

**With Proposed Additions**:

| Decision | Current | With Additions | Target | Feasibility |
|----------|---------|---|---|---|
| Home Purchase | 5.5/10 | 7.6/10 | 8.5+ | ✅ Achievable with 1-2 additions |
| Career Change | 7.25/10 | 8.6/10 | 8.5+ | ✅ Achievable with 1 input |
| Business Launch | 7.5/10 | 8.75/10 | 8.5+ | ✅ Very achievable |
| Education | 7.25/10 | 8.6/10 | 8.5+ | ✅ Achievable with 1 input |
| Investment Property | 6.5/10 | 8.75/10 | 8.5+ | ✅ Achievable with 1 input |

**Average Satisfaction Potential**: 6.5–7/10 → 8.5–8.75/10

---

### 6. REMAINING GAPS

**Critical Gaps** 🔴:
1. **Interpretation rules not written** (framework designed; implementation pending)
2. **Industry library not built** (architecture designed; content pending)
3. **Decision-specific rules not written** (frameworks designed; implementation pending)

**Important Gaps** 🟠:
1. **Living Expenses not collected** (needed for Career Change runway)
2. **Property Cost not collected** (needed for Investment Property gap analysis)
3. **Tuition Amount not collected** (needed for Education feasibility)
4. **Startup Cost not collected** (needed for Business Launch runway)
5. **Hours Reduction not specified** (needed for Business Launch impact analysis)

**Minor Gaps** 🟡:
1. Dependency Type input not yet in system
2. Report structure not yet reorganized by decision
3. Insight ranking logic not yet coded

---

### 7. INPUTS STILL REQUIRED

**REQUIRED for Launch** ✅:
1. **Primary Dependency Type** (Home, Career Change, Business, Education, Property)
   - Friction: 1-3 dropdowns
   - Value: High (enables all interpretation improvements)
   - Include in v1.0? **YES**

**SHOULD HAVE for Full Value** 🟠:
2. **Living Expenses** (for Career Change runway)
   - Friction: 1 number input
   - Value: High for Career Change decision
   - Include in v1.0? **Optional** (can be deferred to v1.1 if too much friction)

3. **Property Cost Estimate** (for Investment Property gap analysis)
   - Friction: 1 number input
   - Value: High for Investment Property decision
   - Include in v1.0? **Optional** (can be deferred to v1.1)

4. **Tuition Amount & Duration** (for Education feasibility)
   - Friction: 2 number inputs
   - Value: High for Education decision
   - Include in v1.0? **Optional** (can be deferred to v1.1)

**NICE-TO-HAVE for Edge Cases** 🟡:
5. **Startup Cost** (for Business Launch runway)
   - Friction: 1 number input
   - Value: Medium (helps runway calculation)
   - Include in v1.0? **Defer** (v1.1)

6. **Target Hours Reduction** (for Business Launch impact)
   - Friction: 1 number input
   - Value: Medium (helps scenario modeling)
   - Include in v1.0? **Defer** (v1.1)

**Recommended v1.0 Input Stack**:
- Primary Dependency Type (required)
- Living Expenses (optional, but highly recommended)
- Property Cost Estimate (optional, but highly recommended)

---

### 8. INPUTS NOT REQUIRED

**Reject These** (add friction without value):
- ❌ Secondary Dependency (80% of value from primary only)
- ❌ Dependency Strength (requires input complexity; can infer from contract term)
- ❌ Dependency Stability (requires historical data not available at intake)
- ❌ Operating Structure (nice context, not essential for interpretation)
- ❌ Contract Term (nice context, but optional; defer to v1.1)
- ❌ Income Trend (requires prior assessment; skip for now)

**Reason**: These add complexity without proportional value increase. Start with Primary Dependency Type + optional financial inputs for decision-specific gaps.

---

### 9. LAUNCH BLOCKERS

**Blocking Issues** 🔴 (Must resolve before launch):
1. **Interpretation rules not written**
   - Current state: Framework designed, rules not implemented
   - Resolution: Write deterministic rules for each interpretation scenario
   - Timeline: 2 weeks

2. **Industry library not built**
   - Current state: Architecture designed, content not written
   - Resolution: Build first 7 industries (70% of cases)
   - Timeline: 4 weeks (can expand to 19 in post-launch)
   - Alternative: Launch with top 7 industries; expand post-launch

3. **Decision-specific ranking logic not coded**
   - Current state: Algorithm designed, not implemented
   - Resolution: Implement insight ranking rules
   - Timeline: 1 week

4. **Dependency Type input not in system**
   - Current state: Designed, not integrated
   - Resolution: Add to intake form
   - Timeline: 1-2 days

**Non-Blocking for v1.0** 🟡:
- Living Expenses input (optional; implement in v1.1)
- Property Cost input (optional; implement in v1.1)
- Tuition input (optional; implement in v1.1)
- Enterprise Dashboard (separate track)
- Advisor Dashboard (separate track)

---

### 10. WHAT SHOULD BE BUILT NEXT

**Phase 1: Pre-Launch Preparation** (3-4 weeks)

1. **Write Interpretation Rules**
   - Deterministic rules for each decision type
   - Dependency type + decision combinations
   - Expected output language

2. **Build Top 7 Industries**
   - Real Estate, Sales, Healthcare, Tech, Consulting, Finance, Freelance
   - Common patterns, triggers, interpretation rules per industry

3. **Implement Insight Ranking**
   - Code decision-specific ranking algorithm
   - Code constraint severity override
   - Code dependency type context

4. **Integrate Dependency Type Input**
   - Add to intake form
   - Connect to interpretation rules
   - Test combinations

5. **Test on 20+ Diverse Profiles**
   - Verify interpretation rules work
   - Verify report feels specific (not generic)
   - Verify customer satisfaction is 8+/10

---

**Phase 2: Launch** (v1.0)

1. Consumer Decision Check™ Report (with interpretation improvements)
2. Income Stability Score™ for Advisors
3. Basic Benchmarking (percentile within industry)
4. 7 supported industries

---

**Phase 3: Post-Launch Improvements** (v1.1, weeks 5-8)

1. Add Living Expenses input (enable Career Change runway)
2. Add Property Cost input (enable Investment Property gap)
3. Add Tuition input (enable Education feasibility)
4. Expand to remaining 12 industries
5. Add time-series tracking (monitor structure changes)

---

**Phase 4: Enterprise Features** (v2.0, months 2+)

1. Advisor Dashboard (Income Stability Score™ interface)
2. Enterprise Portfolio Dashboard (aggregate risk)
3. Advanced Benchmarking (multi-dimensional)
4. API/Integration

---

### FINAL VERDICT

**Current State**: RP-2.0 is production-ready. Interpretation layer is incomplete.

**Path to 8.5+/10 Customer Satisfaction**:
1. ✅ Add Primary Dependency Type input
2. ✅ Write deterministic interpretation rules (all decision types)
3. ✅ Build top 7 industries
4. ✅ Implement insight ranking algorithm
5. ✅ Implement report section reordering by decision
6. ⚠️ Add optional living/property/tuition inputs (recommended but not blocking)

**Timeline**: 3-4 weeks for blocking items; 4 additional weeks for recommended additions

**Feasibility**: ✅ High — No architectural redesign; just rule implementation + content creation

**Launch Readiness**: With Phase 1 complete, v1.0 is ready. Phase 2 can be expanded post-launch.

---

## APPENDIX: QUICK REFERENCE

### Dependency Types at a Glance

| Type | Stability | Duration | Loss Impact | Key Risk |
|------|-----------|----------|-------------|----------|
| Employer | High | Long | Total (100%) | Job loss |
| Client | Medium | Medium | Significant (50-80%) | Client loss |
| Contract | High | Medium-Long | Depends on term | Renewal |
| Transaction | Low | Short | Variable | Deal flow |
| Platform | Low | Short | Variable | Platform changes |
| Asset | High | Long | None (scalable) | Asset degradation |
| Mixed | Varies | Varies | Varies | Depends on mix |

### Decision × Dependency × Constraint Interaction Map

| Decision | Most Important | Least Important | Watch For |
|----------|---|---|---|
| **Home Purchase** | Concentration, Labor Dependence | Visibility, Diversity | Job loss risk |
| **Career Change** | Recurring Income, Runway | Diversity, Concentration | Transition duration |
| **Business Launch** | Largest Client, Recurring Base | Diversity, Visibility | Safety net loss |
| **Education** | Variability, Consistency | Concentration, Diversity | Monthly swing |
| **Investment Property** | Worst-Case Gap, Concentration | Visibility, Diversity | Fixed costs coverage |

