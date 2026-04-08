# RunPayway — Founder Study Guide

> **Purpose:** Everything you need to speak confidently about RunPayway in any context — investor meetings, customer conversations, advisor outreach, enterprise sales, media interviews, podcast appearances.
>
> **How to use this:** Read Part 1 and Part 2 end-to-end. That gives you the full picture. Parts 3-6 are reference sections — scan before specific conversations. The "Never Say" section is your legal guardrail. Memorize it.

---

# PART 1: THE PRODUCT

---

## The One-Liner

**RunPayway measures how income is built — and whether it holds under pressure.**

Not how much you earn. How your income *behaves* when something changes.

---

## What RunPayway Is

| | |
|---|---|
| **Full name** | RunPayway™ |
| **Product** | Income Stability Score™ |
| **Score range** | 0–100 |
| **Model** | Structural Stability Model RP-2.0 |
| **Type** | Deterministic — fixed rules, same inputs = same result, every time |
| **Category** | Structural income measurement system |
| **Company** | PeopleStar Enterprises, Inc. |
| **Location** | 24312 Airporter Way, Laguna Niguel, California 92677 |
| **Site** | peoplestar.com/RunPayway |

---

## The Problem We Solve

Financial systems measure three things about money:

1. **What you earn** (income amount — tracked by employers, banks, tax returns)
2. **What you owe** (debt — tracked by credit bureaus via credit scores)
3. **What you've accumulated** (assets — tracked by advisors, brokerages)

Nobody measures the fourth thing: **how income is built structurally.**

A consultant earning $200K/year sounds great. But if 80% depends on one client, nothing is recurring, and everything stops if they stop working — the *structure* is fragile. That fragility is invisible to every existing financial system.

RunPayway makes it visible. One score. One fixed system. Reproducible every time.

### Why this matters right now

The workforce is shifting. More people earn variable income — freelancers, consultants, business owners, gig workers, commission-based professionals. Traditional income verification (pay stubs, W-2s) doesn't capture structural risk. A person with 5 diversified clients and 40% recurring revenue is structurally different from someone with 1 client and zero contracts — even if they earn the exact same amount.

No tool existed to measure that difference. Until RunPayway.

---

## How the Assessment Works (The Full User Journey)

### Step 1: Portal Entrance

User arrives at `/begin` → redirected to `/diagnostic-portal`.

**What they see first:**
- "Your Assessment Begins Here"
- Input: their name (appears on the report)
- Input: email (optional — for receiving their report)
- Badge: "Income Stability Score™ · Model RP-2.0"

**Then they fill out their profile:**
- Classification (Individual / Business Entity / Team or Partnership)
- Operating structure (Employee W-2 / Independent Contractor / Business Owner / Partnership / Nonprofit)
- Primary income model (21 options — from Employee Salary to Franchise Ownership)
- Revenue structure (One-Time Payments / Repeat Clients / Monthly Recurring / Contracted / Long-Term Recurring / Mixed)
- Industry sector (19 sectors)
- Years in current structure

### Step 2: Preparation Gate

**Full-screen navy overlay — impossible to miss.** This is the "Before you start, read this" screen.

It asks them to think about four things:
1. How many places does your income come from?
2. Does one source account for most of it?
3. How much of your income is recurring or already committed?
4. What happens if your biggest source disappears tomorrow?

They must click **"I'm Ready — Continue"** to proceed. This primes them to answer accurately.

*Why we built this:* Business owners don't always know the right answer off the top of their head. This 30-second pause dramatically improves assessment accuracy without revealing the actual questions.

### Step 3: The Diagnostic (6 Questions)

The assessment itself takes under 90 seconds. Six structural questions — each targeting a different dimension of income:

**The six dimensions being evaluated:**
1. **Recurring income** — How much continues without new effort
2. **Source reliance** — How dependent on the largest single source
3. **Number of sources** — How many independent income streams
4. **Income locked in** — How far ahead income is already secured
5. **Month-to-month steadiness** — How much income fluctuates
6. **Income without you** — How much continues if you stop working

Each dimension is scored independently using fixed rules. The model then combines them — with cross-dimension interaction analysis — into a single score from 0 to 100.

**Important:** We don't show these six dimension names publicly. On the marketing site, we group them into three themes: "How it's earned," "How it holds," "How it depends on you." This protects the IP while still communicating what's being measured.

### Step 4: Score Reveal

Animated reveal screen showing:
- The score (large, centered)
- The stability band
- Points to next band
- Primary constraint
- "Enter Your Dashboard →" CTA

### Step 5: The Report (What the $69 Unlocks)

**Page 1: Score, Band, and Stability Profile**
- Score (0-100) with visual scale bar
- Stability band classification
- Structural type (e.g., "Uneven")
- Distance to next band
- Access code for registry verification

**Page 2: Key Structural Findings**
- Primary takeaway (e.g., "Your income is stable — but one source carries most of the risk")
- Income behavior breakdown: Stops if you stop (%), Continues temporarily (%), Protected (%)
- Horizontal bar chart visualization
- Strongest factor identified
- Primary constraint identified

**Page 3: What Moves Your Score**
- Ranked action list with projected score impact (e.g., "Spread income sources: +11")
- Priority labels (High / Medium)
- "If implemented together" projection (e.g., 72 → 96)
- Each action has a specific description of what to do

**Page 4: Stress Testing**
- Three scenarios modeled against current structure:
  - Largest client lost (e.g., Severity: Severe, Score drops to 44, -28 impact)
  - Unable to work for 90 days (e.g., Severity: Significant, Score drops to 53)
  - Pipeline delay of 3 months (e.g., Severity: Moderate, Score drops to 64)
- Key vulnerability identified
- Stability type assessment

### Step 6: The Dashboard

The Dashboard is where the system becomes actionable. It includes:

**This Week Briefing**
- The single most important action right now
- Why it matters
- Your next 3 moves (specific, numbered steps)
- "Open the script →" link

**Negotiation Playbook**
- Actual scripts built from the user's numbers
- "I wanted to propose something that several of my long-term clients have found valuable — an ongoing advisory retainer..."
- Includes what to say if they push back
- How to tell if it worked

**12-Week Roadmap**
- Week-by-week milestones with projected score at each stage
- E.g., WK 1-2: Convert to retainer (score: 62) → WK 3-4: Add a new client (70) → WK 5-8: Build passive stream (75)
- Milestones generated from the user's actual starting numbers — not templates

**What-If Simulator**
- Real-time score projection
- User adjusts inputs and sees immediately how score changes
- "What if I converted my top client to a retainer?" → Score changes from 62 to 71

**PressureMap™**
- Structural view of where income is most exposed
- Industry-specific intelligence
- Visual representation of concentration risk

**Goal Mode**
- Reverse path modeling
- "I want to reach High Stability (75+)" → System shows exactly what needs to change and in what order

---

## The Scoring Engine — Technical Detail

### Model: RP-2.0 (Structural Stability Model)

**Architecture:**
- 20 modular engine components (01-input-validation through 20-integrity-manifest)
- Outcome Layer (OL-1.0) adds industry-specific context on top of the base score
- The score itself is deterministic — the Outcome Layer adds interpretation without changing it

**How scoring works:**
1. User provides 6 inputs (one per dimension)
2. Each dimension is scored independently against fixed criteria
3. Cross-dimension interactions are analyzed (e.g., high source reliance + low recurring income = compounding risk)
4. Dimensions are combined with fixed weights into a composite score (0-100)
5. Score is mapped to a stability band
6. Results are stamped with model version, timestamp, and authentication code

**What "deterministic" means in practice:**
- If two people give the exact same answers, they get the exact same score
- If the same person takes the assessment twice with the same answers, same score
- There is no randomness, no sampling, no probability
- The model is a function: inputs → fixed transformation → output

**What the Outcome Layer adds (OL-1.0):**
- Industry-specific scenario selection (a consultant gets different stress tests than a real estate agent)
- Tailored risk patterns by income model
- Sector-specific stress scenarios
- Explanation language precision by operating context
- Peer benchmarking by sector

**Critical distinction:** The Outcome Layer provides context and interpretation. It NEVER changes the score. The score and the diagnostic are separate systems. This is a key talking point.

### Version Control

- Every model version is identified by structured notation (RP-1.0, RP-2.0, etc.)
- Once deployed, a version is **immutable** — locked permanently
- If ANY rule changes — scoring criteria, input mapping, weights, band thresholds — a new version is created
- Every assessment snapshot is permanently associated with the version that produced it
- Old assessments are never recalculated under new versions
- This ensures historical transparency and auditability

---

## Data Architecture — What We Collect and Don't

### What we collect:
| Category | Data |
|----------|------|
| Identifiers | Name (assessment title), email address |
| Profile | Classification, operating structure, income model, revenue structure, industry |
| Assessment inputs | 6 user-provided responses |
| Billing | Payment transaction details (processed via Stripe) |
| Technical | IP address, device type, browser type, timestamps, session IDs |

### What we explicitly do NOT collect:
- Bank account credentials or access
- Credit data or credit reports
- Financial account balances
- Tax returns or financial documents
- Social Security numbers
- Biometric data
- Precise geolocation

### Data flow:
1. User inputs → processed by RP-2.0 engine → score generated
2. Score + metadata → stored as immutable snapshot record
3. Payment (if $69 tier) → Stripe processes, we never see card numbers
4. Report generated → stored in session, accessible via access code
5. Registry verification → confirms record consistency via authentication code

---

# PART 2: THE BUSINESS

---

## Revenue Model

| Tier | Price | Type | What Triggers It |
|------|-------|------|-----------------|
| Free Score | $0 | Lead generation | Anyone can take it, no account needed |
| Dashboard | $69 | One-time purchase | User wants the full diagnostic |
| Monitoring | $149/year | Subscription | User wants to track changes over time |
| Advisor License | TBD (est. $15-25/report) | Per-assessment | Advisor access by request |
| Enterprise API | TBD | Annual contract | Organization-level access |

### Unit economics (current):
- $69 is pure margin on the consumer side (no incremental cost per assessment — engine runs on fixed infrastructure)
- $149/year Monitoring includes 3 assessments — effectively $50/assessment with retention
- Advisor licensing at $15-25/report scales with book size
- Enterprise pricing is volume-based with custom contracts

### The free-to-paid funnel:
1. User takes free score (under 2 minutes, no friction)
2. Sees their score and primary constraint — enough to be curious
3. Offered the $69 Dashboard to see exactly what defines the score and what changes it
4. If they want ongoing tracking, $149/year Monitoring
5. Guarantee: "If it doesn't reveal something new, you don't pay" (30-day refund)

---

## Market Opportunity

### Who earns variable income in the US:
- ~59 million Americans freelance (Upwork, 2023)
- ~33 million small business owners (SBA)
- Millions more in commission-based, contract-based, and gig roles
- Traditional income verification (W-2, pay stubs) doesn't work for these people

### Adjacent markets:
- **Financial advisors:** ~300,000 in the US. Each manages dozens to hundreds of clients. One tool per advisor = scale.
- **Lenders:** Income verification is a $5B+ market. Structural evaluation is a new layer on top.
- **HR/Workforce platforms:** Contractor assessment at scale for onboarding, benefits, risk.
- **Insurance:** Income structure affects coverage decisions, risk pricing, eligibility.

### The category creation angle:
Credit scores didn't exist before 1989 (FICO). Before that, lending was subjective. FICO standardized it. RunPayway aims to do the same for income structure — create the standard measurement that doesn't exist yet.

---

## Competitive Landscape

**There is no direct competitor.** The category "structural income measurement" didn't exist before RunPayway. But you'll get asked about adjacencies:

| They'll mention | How it's different |
|----------------|-------------------|
| **Credit scores (FICO, VantageScore)** | Measures borrowing history. We measure income structure. Different inputs, different purpose. Complementary, not competitive. |
| **Income verification (Plaid, Argyle, Truework)** | Verifies income *amount* from bank/employer data. We measure income *structure* from self-reported inputs. They confirm what you earn; we evaluate how it's built. |
| **Financial planning tools (Mint, YNAB, Personal Capital)** | Tracks spending, budgeting, net worth. None measures structural income resilience. |
| **Risk assessment tools (generic)** | Most use ML/AI and are probabilistic. Ours is deterministic — fixed rules, reproducible. That's the differentiator for enterprises. |

**The real competition is inaction.** People don't know this measurement exists. The biggest challenge isn't beating a competitor — it's creating awareness that income structure can be measured.

---

## B2B Strategy: Advisors

### The pitch in one sentence:
"A standardized income risk assessment you can run for every client in under 2 minutes."

### Why advisors care:
- They evaluate assets, liabilities, and cash flow — but have **zero visibility** into income structure
- Client failure they didn't see coming is their biggest reputational risk
- The clients most at risk are the ones who look fine on paper (high income, fragile structure)

### What advisor access looks like (current and planned):
| Feature | Status |
|---------|--------|
| Run assessment on behalf of client | Available (existing flow, enter client name) |
| Full 4-page report per client | Available ($69 per client currently) |
| Dashboard per client | Available |
| Client-ready PDF | Available |
| Multi-client roster (list of all clients assessed) | Planned — requires account layer |
| Client comparison table (sort by risk) | Planned |
| White-label PDF (advisor's firm branding) | Planned — enterprise tier |
| Per-assessment pricing ($15-25/report) | Planned — manual pilot first |

### Go-to-market:
1. **Now:** Request access form on /advisors → manual follow-up → run pilot assessments
2. **Next:** Per-assessment pricing, client roster, comparison view
3. **Later:** Full self-service advisor portal, white-label, API

### Advisor types to target:
- Financial Advisors (largest segment, most immediate need)
- Wealth Managers (high-net-worth clients with complex income structures)
- Insurance Agents (income structure affects coverage and risk)
- Accountants/CPAs (annual review supplement)
- Tax Professionals (income structure context for planning)

### Objection handling:

**"My clients won't want to take another assessment"**
→ They don't take it. You do. Under 2 minutes. No client involvement needed.

**"I already evaluate income"**
→ You evaluate income *amount*. Do you know how it's *structured*? What percentage is recurring? What happens if their biggest source disappears? That's what this measures.

**"Sounds expensive"**
→ We're piloting advisor access now. Pricing is per-assessment. One client assessment costs less than one hour of your time — and reveals risk you'd never see on a balance sheet.

**"How do I know it's accurate?"**
→ Same fixed rules for every client. No interpretation. The system is deterministic — if you run it twice with the same answers, you get the same result. It's a measurement, not an opinion.

---

## B2B Strategy: Organizations / Enterprises

### The pitch in one sentence:
"A deterministic scoring engine that standardizes income structure evaluation at scale."

### Why enterprises care:
- Income evaluation is currently subjective — different analysts reach different conclusions on the same person
- Subjective decisions are compliance risks
- A fixed, auditable, version-controlled methodology eliminates variability

### Enterprise capabilities (current and planned):
| Feature | Status |
|---------|--------|
| API access (JSON in/out) | Exists (`/api/v2/score`) — needs auth key layer |
| Batch assessment | Planned — queue system needed |
| White-label reporting | Planned — template variable for org branding |
| Aggregate dashboard (distribution, trends) | Planned — reporting layer |
| Volume pricing | Planned — Stripe metered billing |
| SSO/SAML | Not started |
| Custom SLA | Available by contract |

### Use cases by vertical:

**Lending & Underwriting**
- Add structural income evaluation as a supplementary layer to credit decisions
- Standardize across analysts — same applicant, same score, every time
- Particularly valuable for non-W-2 applicants (self-employed, contractors, gig workers)

**Workforce Platforms**
- Assess contractor/freelancer income stability at onboarding
- Identify high-risk contractors before assignment
- Reassess at renewal to track changes

**Advisory Platforms**
- Deploy RunPayway as a tool advisors use within the platform
- Standardized income risk across all advisors on the platform
- Data layer: aggregate income stability metrics across the client base

**Benefits & Insurance**
- Income structure evaluation for eligibility determination
- Risk pricing based on structural stability
- Coverage decisions informed by objective measurement

### Enterprise compliance checklist (what they'll ask about):

| Question | Your Answer |
|----------|------------|
| SOC 2? | Building toward Type II readiness. Controls designed around Trust Services Criteria. |
| ISO 27001? | Practices informed by ISMS framework. Formal certification on roadmap. |
| GDPR? | DPA published. Data subject rights supported (Articles 15-21). DPIA process in place. SCCs for international transfers. |
| CCPA/CPRA? | Full California privacy rights. No sale of personal information. No sensitive PI collected. |
| Data retention? | Assessments retained for service + 12 months. Monitoring data: subscription + 90 days. Audit logs: 24 months. |
| Where is data stored? | United States. Encrypted in transit (TLS 1.2+). |
| Sub-processors? | Stripe (payments), Resend (email), Cloudflare (CDN/workers), GoDaddy (hosting). |
| Breach notification? | 72 hours. |
| Can data be deleted? | Yes. Privacy request form or email to privacy@peoplestar.com. |

---

# PART 3: INDUSTRY KNOWLEDGE

---

## How Income Structure Differs by Industry

When talking to someone in a specific industry, use their constraint. This shows you understand their world:

| Industry | The Constraint | What to Say |
|----------|---------------|-------------|
| **Consulting** | You are the product | "If you stop delivering, 85% of your income stops with you. That's a structural problem, not a revenue problem." |
| **Real Estate** | Pipeline dependency | "Nothing is contractually yours until it closes. One delayed closing can erase a quarter of annual earnings." |
| **Sales / Brokerage** | Nothing carries forward | "Last quarter was strong. But your structure doesn't carry that forward. Next quarter starts from zero." |
| **Freelance / Creative** | Every month starts at zero | "No project means no income. No retainer means no floor. You're re-earning your entire livelihood every 30 days." |
| **Construction / Trades** | The next job isn't signed | "The current project is solid. The next one is a handshake. No structural buffer between jobs." |
| **Media / Entertainment** | Between projects, income is zero | "Strong projects create strong months. Between them, income isn't low — it's zero." |
| **Insurance** | New business masks renewal erosion | "Strong production feels like growth. But if renewals are slipping underneath, structure is compounding backwards." |
| **Legal Services** | Three matters carry the practice | "Count your top three matters. They carry 60-70% of billings. When one concludes, the gap arrives all at once." |
| **Technology** | One employer, one decision | "Compensation feels stable because the system is stable. But it's one layoff away from total structural shift." |
| **Finance / Banking** | Variable component is what matters | "Base creates a floor. But the bonus, the production credit — that's where real earnings live. And it can vanish in one cycle." |
| **Healthcare** | One system, no alternatives | "Steady pay from one institution feels safe until the institution restructures." |
| **Fitness / Wellness** | Clients cancel same day | "Income is a collection of individual decisions that can reverse without notice." |

---

# PART 4: TALKING POINTS BY AUDIENCE

---

## For Anyone (The 30-Second Version)

> "We measure how income is built. Not how much you earn — how your income actually holds up when things change. A client leaves, a deal falls through, you step away. We score that structure from 0 to 100 using fixed rules. Same answers always give the same result. No AI, no interpretation. It takes under 2 minutes and the score is free."

## For Investors

> "We're creating a new measurement category. Credit scores measure borrowing — FICO standardized that in 1989. Income verification confirms amounts. But nobody measures income *structure* — whether it's resilient or fragile. 59 million Americans freelance. 33 million own businesses. Their income can't be evaluated with a pay stub. RunPayway is the standard for that evaluation. The score is free, the diagnostic is $69, monitoring is $149/year. B2B licensing starts this year — advisors at $15-25 per assessment, enterprise via API."

## For Individual Customers

> "Your income has a structure — whether you know it or not. RunPayway measures it. In under 2 minutes, you'll see a score from 0 to 100 that shows how your income holds up under pressure. Where it's strong. Where it breaks. And what you can do about it. The score is free. No bank accounts, no credit pull, no documents. Just answer a few questions about how your income works."

## For Advisors

> "You know your clients' assets, liabilities, and cash flow. But how their income is built — whether it holds or breaks under pressure — that's invisible to you right now. RunPayway gives you that visibility. Under 2 minutes per client, standardized methodology, fixed rules. You run the assessment, not the client. The result is a score, structural breakdown, stress test, and action plan. Every client, same system. No subjectivity."

## For Enterprise Buyers

> "Your organization evaluates income subjectively. Different analysts, different conclusions, same applicant. That's a compliance risk and an efficiency problem. RunPayway standardizes it with one fixed, deterministic methodology. API access, batch assessment, white-label reporting. Every result is stamped with model version, timestamp, and authentication code. Auditable, comparable, defensible."

## For Media / Press

> "Income is the most measured and least understood financial metric. We know what people earn, what they owe, what they've saved — but not how their income is built. Is it concentrated in one client? Does it stop when they stop working? Is anything recurring? RunPayway is the first system to measure that. A structural income score from 0 to 100, produced by fixed rules, reproducible every time. Free to take. Under 2 minutes."

---

# PART 5: RISKS, PROBLEMS, AND HONEST CHALLENGES

> These are the things that keep you up at night. Know them better than anyone so you're never caught off guard.

---

## Business Risks

### 1. Category Creation is Expensive

**The problem:** "Structural income measurement" doesn't exist as a recognized category. Nobody is searching for it. Nobody knows they need it. Every customer has to be educated before they convert.

**What this means:** Customer acquisition cost will be higher than established categories. You can't just run Google Ads for "income stability score" — nobody searches that term yet. Content marketing, PR, and word-of-mouth have to do the heavy lifting.

**How to talk about it:** "We're not competing for an existing market. We're creating one. That means the upside is uncapped, but the education burden is real. The free score is our answer — zero friction, immediate value, and it creates the 'aha moment' that drives paid conversion."

### 2. Self-Reported Data Quality

**The problem:** The assessment relies entirely on self-reported inputs. Users might not know their exact income breakdown, might guess wrong, or might deliberately misrepresent.

**What this means:** The score is only as good as the inputs. A user who says 50% of their income is recurring when it's actually 20% will get a more favorable score than they deserve.

**How to talk about it:** "The system is deterministic — same inputs, same result. The preparation screen primes users to think carefully before answering. We don't need exact numbers — reasonable estimates work because the system measures structural patterns, not precise amounts. And unlike credit scores, there's no incentive to game it — you're the only one who sees it."

**Mitigation built in:** The preparation gate (full-screen "Before you start, read this") was specifically designed to improve input quality by making users pause and think.

### 3. Revenue Concentration Risk

**The problem:** Right now, revenue depends on individual $69 purchases. That's a transactional business, not a recurring one. $149/year Monitoring helps, but adoption is uncertain.

**What this means:** Revenue is lumpy. A great month of marketing could drive 500 assessments. A quiet month could drive 50. No predictability until Monitoring subscriptions scale or B2B contracts land.

**How to talk about it:** "The $69 one-time model works for product-market fit validation. The real revenue engine is B2B — advisor licensing at $15-25 per assessment and enterprise API contracts. Those are recurring, predictable, and high-margin. We're building the individual product to prove the methodology, then licensing it to the channels that have the distribution."

### 4. The B2B Product Doesn't Fully Exist Yet

**The problem:** The Advisors and Organizations pages are live with request forms, but the actual multi-client roster, batch API, and volume billing aren't built yet. If an enterprise requests a briefing tomorrow, you'd be selling a future product.

**What this means:** You need to be honest about timeline. "Available by request" gives you room to pilot manually, but you can't pretend the enterprise product is turnkey.

**How to talk about it:** "We're running controlled pilots with advisors first — manually running assessments for their clients, delivering reports, and learning what they actually need before we automate. This is deliberate. We'd rather build the right product slowly than the wrong product fast."

### 5. Regulatory Risk

**The problem:** If RunPayway is ever perceived as providing financial advice, making credit-like determinations, or being used for regulated decisions (lending, employment screening), there could be regulatory scrutiny.

**What this means:** The legal language matters enormously. Every page says "not financial advice," "not a credit score," "not for employment screening." The Terms of Use prohibit using it for credit underwriting or employment decisions without authorization. But if an enterprise client uses it that way without a proper agreement, it could create liability.

**How to talk about it:** "We're a measurement system, not a financial product. Our terms explicitly prohibit unauthorized use for credit or employment decisions. Enterprise clients sign licensing agreements that define permitted use cases. We've structured the legal framework to be clear about what this is and what it isn't."

---

## Product Risks

### 6. Score Meaning and Interpretation

**The problem:** A score of 47 means different things to different people. Without context, users might misinterpret what it means — or worse, make bad decisions based on a number they don't fully understand.

**What this means:** The free score alone isn't enough context. The $69 diagnostic exists specifically to provide interpretation. But some users will see "47" and panic without understanding the nuance.

**How to talk about it:** "The free score tells you where you stand. The diagnostic tells you why. We deliberately separate them — the score is objective, the diagnostic adds context. Every score comes with the stability band, primary constraint, and distance to the next level. That's enough for a meaningful first read."

### 7. Limited Stability Scores Could Upset Users

**The problem:** Someone who thinks their income is fine might score 28 (Limited Stability) and feel attacked, defensive, or distrustful of the system.

**What this means:** The messaging around low scores has to be constructive, not alarming. "Limited Stability" is the gentlest possible label for 0-29. The system doesn't say "your income is bad" — it says "one disruption could seriously impact your income."

**How to talk about it:** "A low score isn't a judgment. It's a measurement. Most people have never evaluated their income structure before — a low score just means there's structural risk they weren't aware of. The value is in knowing, not in the number itself. The diagnostic shows exactly what to change."

### 8. Model Accuracy is Unvalidated by External Parties

**The problem:** RP-2.0 is internally developed. No academic institution, financial regulator, or independent auditor has validated the methodology. The scoring weights and interaction logic are proprietary.

**What this means:** You can claim the system is deterministic (provably true — same inputs, same output). You can claim it's version-controlled (provably true — stamped and immutable). But you can't claim it's "accurate" in the way a peer-reviewed model would be.

**How to talk about it:** "The model is deterministic and reproducible — that's verifiable. The methodology draws on established structural analysis principles. As we scale, independent validation is on the roadmap. But the value proposition doesn't depend on academic endorsement — it depends on giving people visibility into something they currently can't see."

### 9. Churn on Monitoring ($149/year)

**The problem:** After 3 assessments in a year, users might feel they've gotten what they need and not renew. If their score improved, what's the incentive to keep paying?

**What this means:** Monitoring retention depends on continuous perceived value. If the score plateaus, motivation to reassess drops.

**How to talk about it:** "Income structure changes even when income amount doesn't. A new client, a lost contract, a shift to recurring revenue — these all change your structure. Monitoring catches drift that you wouldn't notice otherwise. And the comparison between assessments — what improved, what didn't — is where the real insight lives."

---

## Technical Risks

### 10. Scalability Under Enterprise Load

**The problem:** The current architecture is a Next.js static export deployed via FTP to GoDaddy shared hosting. This works for consumer traffic but won't handle enterprise API volume.

**What this means:** Before signing enterprise API contracts, you need proper infrastructure — likely migrating the API to dedicated cloud hosting (AWS, Vercel, Cloudflare Workers) with proper rate limiting, logging, and uptime SLAs.

**How to talk about it:** "The scoring engine is already built and battle-tested. The infrastructure migration to enterprise-grade hosting is straightforward engineering — it's a deployment question, not an architecture question. The engine itself is modular and stateless, which makes scaling clean."

### 11. Single Point of Failure on Hosting

**The problem:** GoDaddy shared hosting has no SLA, no auto-scaling, no redundancy. If the server goes down, the entire platform goes down.

**What this means:** Fine for current consumer scale. Unacceptable for enterprise. This needs to be addressed before enterprise contracts.

### 12. No Automated Testing Suite

**The problem:** Changes to the scoring engine or UI are verified by manual build checks. There's no automated test suite catching regressions.

**What this means:** As the codebase grows and more people contribute, the risk of breaking changes increases. The deterministic nature of the scoring engine means you could write comprehensive test suites — the expected outputs are known for every input combination.

---

## Competitive Risks

### 13. A Big Player Copies the Concept

**The problem:** If "structural income measurement" proves valuable, a company like FICO, Plaid, or Intuit could build their own version with vastly more resources and distribution.

**How to talk about it:** "Two advantages: we define the standard (first mover), and our methodology is proprietary. A big player would have to build their own methodology from scratch, validate it, and explain why theirs is better. By then, we have years of real assessments, industry-specific intelligence, and brand recognition in the category we created. The defensibility is in the methodology and the data, not the idea."

### 14. Users Don't Come Back After the Free Score

**The problem:** The free score might satisfy curiosity without driving paid conversion. Users see "62 — Established Stability" and think "cool, I'm fine" without wanting the diagnostic.

**How to talk about it:** "The free score is deliberately incomplete. It shows WHERE you stand but not WHY or WHAT TO DO. The primary constraint and stress test outcomes are behind the diagnostic. Most people who score below 70 want to know what's limiting them. Most people who score above 70 want to know how to protect what they have. The curiosity gap is the conversion engine."

---

## The Problems You'll Be Asked About (And Honest Answers)

| They'll Ask | Honest Answer |
|------------|---------------|
| "How do I know this is legitimate?" | "The system is deterministic — same inputs, same result. You can test it yourself. The model is version-controlled and every assessment is verifiable. We publish our methodology, privacy policy, and terms. The 30-day refund guarantee means you risk nothing." |
| "What if I disagree with my score?" | "The score reflects the structural characteristics you described. If the inputs are accurate, the score is accurate. If something feels wrong, retake it — you might discover your initial estimates were off. The preparation screen helps you think through the answers before you start." |
| "Is this regulated?" | "We're a measurement system, not a financial product. We're not subject to financial advisory regulations because we don't provide financial advice. However, our terms prohibit unauthorized use for credit or employment decisions, and enterprise use requires a licensing agreement." |
| "Why should I trust a system nobody's heard of?" | "Every measurement standard started with nobody having heard of it. FICO didn't exist before 1989. The question isn't whether the brand is familiar — it's whether the methodology is sound. Ours is deterministic, version-controlled, and reproducible. You can verify that in under 2 minutes." |
| "What happens to my data?" | "Your inputs generate your score and report. We don't sell data, don't share it for advertising, and don't access external financial data. You can request deletion at any time through our privacy request form." |

---

# PART 6: OBJECTION HANDLING (COMPLETE)

---

## Product Objections

**"Isn't this just a credit score?"**
> No. Credit scores measure borrowing behavior — payment history, credit utilization, length of credit history. We measure income structure — how income is built, how concentrated it is, what happens if a source disappears. Completely different data, completely different purpose. We never pull credit. They're complementary.

**"Do you use AI?"**
> No. The model is deterministic — fixed rules applied consistently. Same inputs always produce the same result. No machine learning, no probability models, no neural networks. When you're creating a measurement standard, you need consistency and reproducibility, not intelligence. AI would make every score slightly different. That defeats the purpose.

**"How accurate is it?"**
> The system is deterministic and reproducible — that's verifiable accuracy. Same inputs, same result, every time. The quality of the output depends on the quality of the inputs, which is why we built the preparation screen — it prompts users to think carefully about four specific aspects of their income before starting. We don't need exact numbers. Reasonable estimates work. The system is built for it.

**"Why would someone pay $69 for this?"**
> The free score tells you where you stand. The $69 diagnostic tells you why. It shows the exact constraint limiting your stability, models what happens under stress, gives you a ranked action plan with projected score impact, and provides a 12-week roadmap with negotiation scripts. One bad income decision costs far more than $69. We also guarantee it — if it doesn't reveal something new, full refund.

**"What if my income is simple — just a salary?"**
> Salaried income has structure too. A W-2 employee with one employer, no side income, and no recurring contracts scores differently than someone with multiple income streams. The system evaluates the structural characteristics regardless of how simple or complex the income is. Even "simple" income has concentration risk (one employer = one decision away from zero).

**"This seems like it's only for freelancers"**
> It's for anyone whose income has structural characteristics worth measuring. Freelancers are the most obvious use case because their structure varies dramatically. But business owners, consultants, commission-based professionals, even salaried employees with variable compensation — all have structural properties that determine resilience. The system doesn't care what you call yourself. It measures the structure.

## Business Objections

**"How do you defend against someone copying this?"**
> The methodology is proprietary. We don't publish the scoring weights, dimension boundaries, or interaction logic. The brand (RunPayway™, Income Stability Score™, PressureMap™) is trademarked. The model versioning system creates an audit trail that proves provenance. And we have a significant first-mover advantage in defining the category. Someone can try to build a similar system, but they'd be copying the concept, not the methodology — and they'd have to explain why their version is the standard and ours isn't.

**"What's your moat?"**
> Three things: (1) The methodology — proprietary, version-controlled, and validated by real assessments. (2) The category — we're defining "structural income measurement" as a category. The first credible player in a new category sets the terms. (3) The data — every assessment improves our understanding of income structure patterns across industries, which informs the Outcome Layer intelligence. That compounds over time.

**"How do you acquire customers?"**
> The free score is the acquisition engine. Under 2 minutes, no account required, immediately valuable. Free-to-paid conversion happens when the score creates curiosity — "I'm at 47. What's limiting me?" The $69 diagnostic answers that question. Content marketing around industry-specific income structure themes drives organic traffic. B2B is outbound — advisor and enterprise outreach through the request forms.

---

# PART 6: REFERENCE

---

## Numbers to Know

| Fact | Number |
|------|--------|
| Score range | 0–100 |
| Structural dimensions | 6 |
| Stability bands | 4 (0-29, 30-49, 50-74, 75-100) |
| Time to free score | Under 2 minutes |
| Free score | $0 |
| Dashboard | $69 (one-time, lifetime access) |
| Monitoring | $149/year (3 assessments) |
| Refund window | 30 days |
| Model version | RP-2.0 |
| Breach notification | 72 hours |
| Advisor pricing target | $15-25 per assessment |
| US freelancers | ~59 million |
| US small business owners | ~33 million |
| US financial advisors | ~300,000 |
| Languages in development | Spanish, Portuguese, Hindi |
| Report pages | 4 |
| Assessment questions | 6 |
| Engine components | 20 modules |

---

## The Four Stability Bands

| Range | Band | One-Sentence Description | What It Means in Practice |
|-------|------|-------------------------|--------------------------|
| **0-29** | Limited Stability | One disruption could seriously impact income | Heavily dependent on active work. Stops when work stops. No built-in support. |
| **30-49** | Developing Stability | Income isn't protected yet | Some recurring elements exist but income still depends primarily on active effort. |
| **50-74** | Established Stability | Can handle most common disruptions | Diversified sources with meaningful forward visibility. Can absorb disruption without income loss. |
| **75-100** | High Stability | Holds up even under sustained pressure | Income continues with minimal active effort. Multiple persistent revenue sources provide durability. |

---

## Compliance Posture

| Framework | Status | What to Say |
|-----------|--------|------------|
| **SOC 2 Type II** | Building toward readiness | "Our controls are designed around the Trust Services Criteria. Formal certification is on our roadmap." |
| **ISO 27001** | Informed by ISMS framework | "Our security practices draw from ISO 27001 concepts. Formal certification is planned." |
| **GDPR** | DPA published, rights supported | "We have a published DPA, support all data subject rights, and maintain a 72-hour breach notification commitment." |
| **CCPA/CPRA** | Fully supported | "We support all California privacy rights. We don't sell data or collect sensitive PI." |
| **WCAG 2.1 AA** | Aligned | "Keyboard nav, screen readers, focus indicators, color contrast, no forced time limits." |
| **Section 508** | Aligned | "U.S. Federal accessibility guidelines." |
| **ADA Title III** | Addressed | "Digital accessibility obligations." |

**Never say "certified" or "compliant" for SOC 2 or ISO 27001.** Always say "building toward" or "informed by."

---

## What's Been Shipped

| Version | Name | Quarter | What It Includes |
|---------|------|---------|-----------------|
| RP-2.0 | Structural Stability Model | Q1 2026 | Deterministic scoring, 6 dimensions, 4-page report, integrity verification |
| OL-1.0 | Outcome Layer | Q1 2026 | Industry-specific scenarios, sector benchmarks, tailored risk patterns |
| CC-1.0 | Dashboard | Q1 2026 | PressureMap™, simulator, roadmap, scripts, Goal Mode |
| SM-1.0 | Stability Monitoring | Q2 2026 | Score timeline, delta tracking, Email+PIN auth, 3 assessments/year |
| GV-1.0 | Compliance & B2B | Q2 2026 | SOC 2/ISO 27001 alignment, GDPR/CCPA strengthening, advisor/org pages |

## Roadmap

| Timeline | What | Status |
|----------|------|--------|
| Q3 2026 | Spanish language support | In Development |
| Q4 2026 | Portuguese + Hindi | Planned |
| 2026 | Enterprise API + Advisor License | In Development |

---

## What You Must NEVER Say

| Never Say This | Why It's Dangerous |
|---------------|-------------------|
| "RunPayway predicts your income" | It measures structure. Predictions create liability. |
| "We provide financial advice" | We are not a registered investment adviser. This is a legal boundary. |
| "We access your bank account" | Self-reported inputs only. Saying otherwise is false. |
| "We use AI to calculate scores" | Fixed deterministic rules. Claiming AI invites scrutiny we don't need. |
| "Your score can be customized" | Same inputs = same result. Always. Customization destroys credibility. |
| "We'll tell you what to do" | We measure. You decide. Advice creates advisory liability. |
| "We're SOC 2 certified" | Building toward readiness. Claiming certification is fraud if not true. |
| "We're GDPR compliant" | Designed with GDPR principles. Not formally audited. |
| "This guarantees anything" | It's a measurement. Guarantees create legal exposure. |
| "Your data is 100% secure" | No system can guarantee absolute security. Our own legal docs say this. |
| "We're better than a credit score" | Different purpose. Not competitive. Don't invite that comparison as adversarial. |
| "The score tells you everything" | The score tells you where you stand. The diagnostic tells you why. They're separate. |

---

## Key URLs

| Page | Path |
|------|------|
| Landing page | / |
| How It Works | /how-it-works |
| Pricing | /pricing |
| Sample Report | /sample-report |
| Methodology | /methodology |
| About | /about |
| FAQ | /faq |
| For Advisors | /advisors |
| For Organizations | /organizations |
| New Releases | /coming-soon |
| Dashboard | /dashboard |
| Sign In (Monitoring) | /sign-in |
| Contact | /contact |
| Privacy Policy | /privacy-policy |
| Terms of Use | /terms-of-use |
| DPA | /data-processing-agreement |
| Security Practices | /security-practices |
| Model Version Policy | /model-version-policy |
| Accessibility | /accessibility |
| Acceptable Use | /acceptable-use-policy |

---

*Last updated: April 8, 2026*
*RunPayway™ is a product of PeopleStar Enterprises, Inc.*
*Model RP-2.0 | Deterministic | Version-controlled*
