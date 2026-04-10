# RunPayway™ — Complete System Reference

> **Purpose:** This document describes the entire RunPayway platform from architecture to business logic. It is the single source of truth for anyone (human or AI) working on the system.
>
> **Last updated:** 2026-04-10
> **Model version:** RP-2.0
> **Live URL:** https://peoplestar.com/RunPayway

---

## 1. What RunPayway Is

RunPayway is a **Structural Income Diagnostic Platform**. It scores how stable someone's income is — not how much they earn, but how their income is structured. The score (0–100) measures six dimensions of income architecture: recurrence, concentration, diversity, forward visibility, variability, and labor dependence.

The platform is deterministic. Same inputs always produce the same score. No AI is used in scoring — only in the narrative sections (PressureMap, Plain English interpretation, Action Plan) which are generated via Claude through a Cloudflare Worker.

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  FRONTEND (Next.js 15, Static Export)               │
│  Deployed to GoDaddy via GitHub Actions FTP          │
│  Lives at: peoplestar.com/RunPayway/                 │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  Marketing Pages (28 routes)                │    │
│  │  App Pages (13 routes)                      │    │
│  │  13 Components, 26 Library Modules          │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  V2 Scoring Engine (runs CLIENT-SIDE)       │    │
│  │  20 deterministic engines + outcome layer   │    │
│  │  No server dependency for scoring           │    │
│  └─────────────────────────────────────────────┘    │
└───────────────────────┬─────────────────────────────┘
                        │ fetch calls
                        ▼
┌─────────────────────────────────────────────────────┐
│  CLOUDFLARE WORKER (runpayway-pressuremap)          │
│  Deployed via wrangler                               │
│                                                     │
│  Endpoints:                                         │
│  POST /pressuremap     — Claude-generated analysis  │
│  POST /plain-english   — Claude-generated narrative │
│  POST /action-plan     — Claude-generated actions   │
│  POST /save-record     — D1 database persistence    │
│  POST /get-record      — D1 record retrieval        │
│  POST /send-email      — Resend email delivery      │
│  POST /contact         — Contact form handler       │
│  POST /nurture         — Nurture email scheduling   │
│  POST /simulate        — Single simulation          │
│  POST /simulate-batch  — Batch simulation (7 at once)│
│  POST /timeline        — 3/6/12 month projection    │
│  POST /analytics       — Event tracking             │
│  GET  /presets         — Simulator preset metadata   │
│  GET  /action-scripts/:sector — Industry scripts    │
│                                                     │
│  Database: Cloudflare D1 (runpayway-records)        │
│  Cron: Daily 9am EST — follow-up email processing   │
└─────────────────────────────────────────────────────┘
```

### Deployment

| Component | Host | Deploy Method |
|-----------|------|---------------|
| Frontend (static HTML/JS/CSS) | GoDaddy at `/public_html/RunPayway/` | GitHub Actions → FTP on push to main |
| Cloudflare Worker | Cloudflare Workers | `npx wrangler deploy` from `/worker/` |
| Database | Cloudflare D1 | Managed by worker |
| Emails | Resend API | Called from worker |
| Payments | Stripe Checkout | External redirect |

**Critical deployment rule:** The site lives at `/public_html/RunPayway/`, NOT at the root. The Next.js config uses `basePath: "/RunPayway"` for static export. All raw `window.location` URLs must include `/RunPayway/`.

---

## 3. User Flows

### Flow A: Free Assessment
```
Landing Page → /begin → /diagnostic-portal (profile) →
  "Initializing [Industry] diagnostic framework..." (1.8s) →
  /diagnostic (6 questions) → Score engine runs client-side →
  Loading screen (3s minimum, quotes displayed) →
  /free-score (score + constraint + stress test + upgrade CTA)
```

### Flow B: Paid Assessment ($69)
```
/pricing → Stripe Checkout → /checkout-success →
  /diagnostic-portal → /diagnostic → Score engine →
  PressureMap + Plain English + Action Plan (parallel Claude calls) →
  Score Reveal screen → "Enter Your Dashboard" → /dashboard
```

### Flow C: Annual Monitoring ($149/year)
```
/pricing → Stripe Checkout → /checkout-success →
  Creates monitoring session (access code + PIN) →
  /sign-in → /diagnostic-portal → /diagnostic →
  /dashboard (with History phase showing multiple assessments)
  Can retake up to 3x per year
```

### Flow D: Return Visit
```
User returns → /dashboard loads from localStorage →
  If paid: full dashboard access
  If free: redirected to /free-score
  If has access code: paste at /access-code → /dashboard
```

---

## 4. Pricing & Plans

| Plan | Price | Includes |
|------|-------|----------|
| **Free Score** | $0 | Score (0-100), band, primary constraint, stress test, industry context |
| **Full Diagnostic** | $69 one-time | Everything free + full report, dashboard, simulator, PressureMap, action plan, 12-week roadmap, negotiation scripts |
| **Annual Monitoring** | $149/year | Everything in Full + 3 reassessments/year, score tracking over time, comparative analysis |

Payment via Stripe Checkout. Purchase session stored in sessionStorage + localStorage as `rp_purchase_session`.

---

## 5. The Scoring Engine (RP-2.0)

### 6 Input Dimensions (from 6 diagnostic questions)

| # | Question | Canonical Field | Mapping (A→E) | Scoring |
|---|----------|----------------|---------------|---------|
| Q1 | Recurring Revenue Base | `income_persistence_pct` | 5% → 93% | 0-15 pts |
| Q2 | Income Concentration | `largest_source_pct` | 95% → 15% (inverse) | 0-10 pts |
| Q3 | Income Source Count | `source_diversity_count` | 1 → 8 sources | 0-10 pts |
| Q4 | Forward Revenue Visibility | `forward_secured_pct` | 4% → 100% | 0-15 pts |
| Q5 | Earnings Consistency | `income_variability_level` | extreme → low | 0-10 pts |
| Q6 | Income Without Active Work | `labor_dependence_pct` | 100% → 12% (inverse) | 0-20 pts |

**Questions use industry-specific vocabulary.** A real estate agent sees "property management fees, rental income, or referral residuals" for Q1, not generic "recurring revenue."

### 4 Stability Bands

| Band | Score Range | Color | Meaning |
|------|------------|-------|---------|
| Limited Stability | 0–29 | Red (#C74634) | Fragile, highly vulnerable to disruption |
| Developing Stability | 30–49 | Amber (#D0A23A) | Some structure, important weaknesses remain |
| Established Stability | 50–74 | Blue (#2B5EA7) | Meaningful structural protection in place |
| High Stability | 75–100 | Teal (#1F6D7A) | Well-protected against most disruptions |

### The 20-Engine Pipeline

Every assessment runs through 20 deterministic engines in sequence:

| # | Engine | Purpose | Key Output |
|---|--------|---------|------------|
| 01 | Input Validation | Validates A-E answers | Validated inputs |
| 02 | Profile Context | Resolves industry, structure, income model | Resolved profile |
| 03 | Income Normalization | Maps A-E → numeric values | 6 canonical dimensions |
| 04 | Raw Scoring | Computes 7 factor scores | Structure score (50pts) + Stability score (50pts) |
| 05 | Band Classification | Maps score → band | Primary band + sub-band |
| 06 | Structural Indicators | Derives 7 normalized indicators (0-100) | Indicator levels (very_low → very_high) |
| 07 | Cross-Factor Dependency | Applies 8 interaction rules (6 penalties, 2 bonuses) | Net adjustment (-12 to +8) |
| 08 | Income Quality | Evaluates optional extended inputs | Quality score, durability grade |
| 09 | Constraint Hierarchy | Ranks 7 constraints by severity | Root → primary → secondary constraints |
| 10 | Fragility | Computes fragility score (0-100) | Fragility class: brittle/thin/uneven/supported/resilient |
| 11 | Sensitivity | Tests 6 what-if adjustments | Highest-impact factor, bottleneck |
| 12 | Risk Scenarios | Models 6 downside stress tests | Score drops, band shifts |
| 13 | Score Lift | Models 5 improvement paths | Projected scores, combined top-two |
| 14 | Diagnostic Confidence | Calculates confidence (0-100) | high/moderate/guarded/low |
| 15 | Explainability | Generates human-readable narrative | Why this score, why not higher, surprising insights |
| 16 | Action Prioritization | Generates ranked actions | 5-7 actions, 2-3 avoids, 8-week roadmap, scripts |
| 17 | Reassessment Triggers | Identifies when to re-score | 6 trigger conditions |
| 18 | Benchmarking | Computes peer percentile | Cluster average, top 20% threshold, peer distribution |
| 19 | Comparative Reassessment | Compares to prior assessment | Score delta, factor deltas |
| 20 | Integrity Manifest | Creates verification hashes | SHA-256 of inputs, outputs, manifest, record |

### Outcome Layer (OL-1.0)

After the 20 engines, the Outcome Layer adds two additional enrichment passes:

**Layer 2 — Income Model Families (12 families):**
Maps 21 income model types to 12 deterministic families (employment_led, commission_led, contract_project_led, retainer_subscription_led, practice_led, agency_led, product_led, creator_audience_led, referral_affiliate_led, asset_rental_led, investment_led, hybrid_multi). Each family has unique weak points, action priorities, avoid actions, and explanation translations.

**Layer 3 — Industry Refinement (21 profiles):**
Maps 19+ industry sectors to detailed profiles with scenario emphasis, action overrides, reassessment triggers, explanation language overrides, and benchmark framing.

---

## 6. Industry Vocabulary System

**Location:** `src/lib/industry-vocabulary.ts` (2,767 lines)

Every surface of the app speaks the user's industry language. 19 industries + default, each with:

| Field | Example (Real Estate) | Example (Insurance) |
|-------|----------------------|---------------------|
| `nouns.recurring_revenue` | property management fees | renewal commissions |
| `nouns.top_client` | anchor listing client | largest book account |
| `nouns.pipeline` | active listings under contract | quoted prospects in pipeline |
| `nouns.passive_income` | rental portfolio income | passive renewal book |
| `nouns.forward_commitment` | signed listing agreements | bound policy commitments |
| `nouns.active_work` | showing properties and closing deals | writing new policies and servicing claims |
| `scenarios.lose_top_client` | Your anchor listing client takes their business to another agent | Your largest account moves their book to a competing agency |
| `actions.convert_retainer` | Propose a property management retainer to your highest-volume client | Offer an annual policy review retainer to your top 10 accounts |
| `constraints.high_concentration` | Your real estate income depends too heavily on a single transaction type... | Your book is dangerously concentrated in one carrier or account... |

**Consumed by:**
- Free-score page (constraint explanations, behaviors, improvements, industry context)
- Dashboard (constraint narratives, action descriptions, stress test labels)
- Diagnostic questions (industry nouns in question text)
- Worker Claude prompts (vocab_context injected into PressureMap, Plain English, Action Plan)
- Report PDF (scenario labels, stress test headings)
- Follow-up emails (reassessment prompts)

**19 Industries:** real_estate, consulting_professional_services, technology, healthcare, legal_services, finance_banking, insurance, sales_brokerage, creative_media, construction_trades, education_training, retail_ecommerce, hospitality, transportation, manufacturing, nonprofit, agriculture, energy, fitness_wellness

---

## 7. Claude AI Integration (via Cloudflare Worker)

Three narrative sections are generated by Claude (via Anthropic API), called in **parallel** during scoring:

### PressureMap™
- **Prompt:** Industry-specific structural analysis
- **Output:** 3 sections × 2 sentences each:
  - **Pressure** — The structural force working against this person
  - **Tailwind** — The structural opportunity available right now
  - **Leverage Move** — The single highest-leverage change
- **Vocabulary injected:** `vocab_context.pressure_framing`, `vocab_context.arrangement_types`

### Plain English Interpretation
- **Prompt:** Explain the score to the person who took it
- **Output:** 3-4 sentence interpretation + 1-2 sentence "why not higher"
- **Goal:** Reveal something the user didn't already know

### Action Plan
- **Prompt:** Strategy recommendation from an industry insider
- **Output:** Primary action + how, supporting action + how, combined interpretation, tradeoff (upside/cost/verdict)
- **Vocabulary injected:** Industry-specific arrangement types, pressure/opportunity framing

---

## 8. Dashboard (4 Phases)

### Phase 1: Diagnosis
- Score ring with animation
- Band classification
- Income behavior bar (active / semi-persistent / protected percentages)
- Industry baselines comparison
- Stress test results (lose top client, can't work 90 days)
- Constraint narrative (industry-specific)

### Phase 2: Plan
- Ranked improvement actions (from engine + vocabulary)
- 12-week execution roadmap with checkable steps
- Industry-specific negotiation scripts
- Projected score after each action

### Phase 3: Test (Simulator)
- What-if scenarios with 6 universal presets
- Industry-specific presets
- Real-time score recalculation
- Timeline projection (3/6/12 months)
- Scenario comparison table

### Phase 4: History
- Assessment timeline (for monitoring plan users)
- Score movement tracking
- Factor-by-factor delta comparison
- Peer percentile tracking over time
- Reassessment prompts (industry-specific)

---

## 9. Report (4 Pages)

Generated on-screen at `/review` with PDF download via jsPDF:

| Page | Title | Content |
|------|-------|---------|
| Cover | Score + Band | Score ring, band label, assessment title, industry, access code, model version |
| Key Findings | Structural Analysis | Income behavior bar, strongest factor, primary constraint, PressureMap intelligence |
| Stability Plan | What Moves Your Score | Top 3 actions with lift values, "What Becomes Possible," "What to Avoid," projected combined score |
| Stress Testing | Stress Testing Your Income | 3 risk scenarios with severity/score drops, real-world impact cards, stability type, key vulnerability |

**Design:** Navy headers with gradient accent lines, sand (#F4F1EA) backgrounds, brand typography (Inter + SF Mono), locked color palette (Navy #0E1A2B, Purple #4B3FAE, Teal #1F6D7A, Sand #F4F1EA).

**Low scores are never shown prominently.** Lift values ≤3 render smaller and muted. The report frames every finding as actionable, not alarming.

---

## 10. Email System

| Email | Trigger | Content |
|-------|---------|---------|
| **Report Delivery** | Assessment complete (if email provided) | Score, band, constraint, interpretation, record ID, CTA to dashboard |
| **Day 7 Follow-up** | Cron (worker) | Priority action reminder + 1 industry reassessment prompt |
| **Day 30 Follow-up** | Cron (worker) | Progress check + 3 industry reassessment prompts |
| **Day 90 Follow-up** | Cron (worker) | Reassessment invitation with industry-specific change examples |
| **Nurture Email 1** | Immediate (free users) | Score context + industry positioning |
| **Nurture Email 2** | Day 3 (free users) | Highest-leverage action for their constraint |
| **Nurture Email 3** | Day 7 (free users) | Industry benchmarking + upgrade CTA |

All emails use branded dark navy templates with gradient accents. Follow-up emails include industry-specific reassessment prompts from the vocabulary system.

---

## 11. File Structure

```
RunPayway/
├── .github/workflows/deploy.yml    — CI/CD (build + FTP to GoDaddy)
├── worker/
│   ├── index.js                    — Cloudflare Worker (all endpoints)
│   └── wrangler.toml               — Worker config (D1 binding, cron)
├── scripts/
│   └── smoke-test.sh               — Post-deploy endpoint verification
├── public/
│   ├── .htaccess                   — Apache config (caching, rewrites)
│   └── *.png                       — Logos and static assets
├── src/
│   ├── app/
│   │   ├── layout.tsx              — Root layout (fonts, viewport, metadata)
│   │   ├── error.tsx               — Global error boundary
│   │   ├── global-error.tsx        — Root error boundary
│   │   ├── globals.css             — Global styles (933 lines)
│   │   ├── (marketing)/            — 28 marketing pages + layout
│   │   │   ├── page.tsx            — Landing page (1,208 lines)
│   │   │   ├── pricing/            — 3-tier pricing
│   │   │   ├── checkout-success/   — Post-payment handler
│   │   │   └── ...                 — FAQ, methodology, legal, etc.
│   │   ├── (app)/                  — 13 app pages + layout
│   │   │   ├── diagnostic-portal/  — Profile intake + industry init
│   │   │   ├── diagnostic/         — 6-question assessment (1,479 lines)
│   │   │   ├── free-score/         — Free tier results
│   │   │   ├── review/             — Full report + PDF generation
│   │   │   ├── dashboard/          — Main dashboard (2,098 lines)
│   │   │   └── ...                 — access-code, simulator, etc.
│   │   └── api/                    — 18 API routes (dev-only, moved aside for static export)
│   ├── lib/
│   │   ├── engine/v2/              — 20-engine scoring pipeline
│   │   │   ├── index.ts            — Engine orchestrator
│   │   │   ├── engines/01-20       — Individual engines
│   │   │   ├── outcome/            — Outcome layer (families + industries)
│   │   │   ├── constants.ts        — Scoring tables and thresholds
│   │   │   ├── types.ts            — 60+ TypeScript interfaces
│   │   │   └── crypto-compat.ts    — Browser-safe SHA-256 + UUID
│   │   ├── industry-vocabulary.ts  — 19 industries × full vocabulary (2,767 lines)
│   │   ├── sector-map.ts           — Industry key normalization
│   │   ├── v2-to-v1-adapter.ts     — Engine output → report format
│   │   ├── worker-api.ts           — Cloudflare Worker API client
│   │   ├── industry-tailoring.ts   — Dynamic report copy generation
│   │   ├── design-tokens.ts        — Brand colors, typography, spacing
│   │   ├── email.ts                — Resend email integration
│   │   ├── payment-token.ts        — HMAC-signed payment tokens
│   │   ├── analytics.ts            — GA4 + Meta + LinkedIn tracking
│   │   ├── monitoring.ts           — Annual monitoring session management
│   │   └── i18n/                   — EN, ES, PT, HI translations
│   └── components/
│       ├── AccessibilityWidget.tsx  — WCAG 2.1 AA (7 profiles, granular controls)
│       ├── ShareableScoreCard.tsx   — Score sharing (LinkedIn, X)
│       ├── EmailCapture.tsx         — Email opt-in
│       ├── CookieConsent.tsx        — Cookie banner
│       └── ...                     — 9 more components
└── next.config.ts                  — Static export, basePath: "/RunPayway"
```

---

## 12. Design System

**Brand Palette (locked):**
| Token | Hex | Usage |
|-------|-----|-------|
| Navy | #0E1A2B | Primary text, headers, dark sections |
| Purple | #4B3FAE | Accents, CTAs, focus states |
| Teal | #1F6D7A | Positive indicators, improvements |
| Sand | #F4F1EA | Backgrounds, surfaces |
| White | #FFFFFF | Cards, clean surfaces |

**Typography:**
- Primary: Inter (-apple-system fallback)
- Mono: SF Mono, Fira Code (scores, codes, data)

**Tone:** Premium strategy brief. Plain English. No dashboard clutter. No fintech fluff. Speak directly to the user in second person using their industry's vocabulary.

---

## 13. Accessibility

WCAG 2.1 AA compliant via AccessibilityWidget:

- **7 profiles:** Seizure Safe, Vision Impaired, ADHD Friendly, Cognitive, Keyboard Navigation, Screen Reader, Older Adults
- **Granular controls:** Font size (6 levels), line height, letter spacing, content scale, color mode, text color
- **Keyboard:** Alt+A toggle, full focus management, skip links
- **Touch:** All interactive elements ≥44px on mobile
- **Motion:** Respects `prefers-reduced-motion`

---

## 14. Analytics & Tracking

| Platform | Events Tracked |
|----------|---------------|
| GA4 | page_view, assessment_start, assessment_complete, purchase_click |
| Meta Pixel | PageView, CompleteRegistration, InitiateCheckout |
| LinkedIn Insight | Conversion tracking |
| Custom (Worker) | All events sent to `/analytics` endpoint |

---

## 15. Internationalization

4 languages supported via React Context:
- English (en) — complete
- Spanish (es) — translation files present
- Portuguese (pt) — translation files present
- Hindi (hi) — translation files present

Storage: `rp_lang` in localStorage. Hook: `useLanguage()`.

---

## 16. Security & Compliance

- **No financial accounts connected** — ever
- **No credit pull** — the diagnostic is structural, not financial
- **Deterministic scoring** — same inputs = same score, always
- **SHA-256 integrity hashes** on every assessment record
- **HMAC-signed payment tokens** (30-day expiry)
- **Rate limiting** on API routes and worker endpoints
- **Audit logging** for key actions
- **7 legal pages:** Terms, Privacy, Security, Model Version Policy, Acceptable Use, DPA, Privacy Request

---

## 17. Key Technical Decisions

| Decision | Why |
|----------|-----|
| Scoring runs client-side | No server dependency, faster results, engine is deterministic pure math |
| Claude calls run in parallel | 3 API calls × 2-5s each → ~4s total instead of ~12s sequential |
| Static export to GoDaddy | Simple hosting, no server costs, HTML cached with no-cache headers |
| Cloudflare Worker for AI + DB | API keys secured server-side, D1 for persistence, cron for emails |
| Industry vocabulary as single file | One source of truth, every page imports from same place |
| `max-width: 100vw` removed | Was causing horizontal overflow on mobile with safe-area insets |
| Hooks before early returns | React requires consistent hook count across renders |
| `Array.isArray()` guards | v2 engine data can have unexpected shapes; guards prevent crashes |
| `/RunPayway/` basePath on all raw URLs | Site doesn't live at root; Next.js Link handles it but `window.location` doesn't |

---

## 18. Known Constraints

- **API routes don't work in static export** — all server logic lives in the Cloudflare Worker
- **Old v1 records in localStorage** may lack `_v2` field — dashboard falls back to hardcoded defaults
- **Access codes never expire** — a shared code works indefinitely
- **Worker can't import TypeScript modules** — industry data for emails is duplicated as a compact JS object in the worker
- **PDF generation uses jsPDF** (client-side) — limited formatting compared to server-rendered PDF

---

## 19. Summary Statistics

| Metric | Count |
|--------|-------|
| Total source files | 167 TypeScript/TSX |
| Total lines of code | ~46,500 |
| App pages | 13 |
| Marketing pages | 28 |
| API routes | 18 (dev-only) |
| Worker endpoints | 14 |
| Components | 13 |
| Library modules | 26 |
| Engine implementations | 20 + outcome layer |
| Industries with vocabulary | 19 + default |
| Income model families | 12 |
| Risk scenarios | 24 deterministic |
| Stability bands | 4 |
| Scoring dimensions | 6 input + 7 factor scores |
| Interaction rules | 8 (6 penalties, 2 bonuses) |
| i18n languages | 4 |
| Email templates | 7 (1 report + 3 nurture + 3 follow-up) |
| Accessibility profiles | 7 |
| Action script templates | 57 (3 per industry x 19) |
| Gamification badges | 10+ |

---

## 20. Features Not Covered Above

### Command Palette
- **Location:** `src/components/CommandPalette.tsx`
- **Trigger:** Cmd+K (Mac) / Ctrl+K (Windows)
- **Purpose:** Quick navigation to dashboard, report, pricing, home. 4 commands with keyboard shortcuts (1-4 keys).

### Gamification System
- **Location:** `src/lib/gamification.ts` (211 lines)
- **Badges:** first_report, simulator_explorer, pressuremap_viewer, action_starter, action_half, action_complete, score_up_5, score_up_10, band_shift, streak_3
- **Persistence:** localStorage (`rp_gamification` key)
- **Status:** Infrastructure built, not yet prominently surfaced in UI

### Action Scripts Library
- **Location:** `src/lib/action-scripts.ts` (836 lines)
- **Content:** 57 ready-to-use negotiation and outreach templates (3 per industry x 19 industries)
- **Categories:** Retainer pitch, diversification outreach, referral partnership scripts
- **Delivery:** Displayed in Dashboard Phase 2 (Plan) and fetched from worker via `GET /action-scripts/:sector`

### Badge Verification System
- **API routes:** `/api/badge/[code]/route.ts` and `/api/badge/[code]/embed/route.ts`
- **Marketing page:** `/badge`
- **Purpose:** Generates SVG verification badges showing score and band. Embed variant allows external websites to display a verified RunPayway badge.

### Blog System
- **Location:** `src/app/(marketing)/blog/page.tsx` + `src/app/(marketing)/blog/[slug]/page.tsx`
- **Purpose:** Blog listing page with dynamic slug-based article routes

### Middleware (Security Layer)
- **Location:** `src/middleware.ts`
- **Rate limiting:** 100 requests per minute per IP (API routes only)
- **Security headers:** Content-Security-Policy, HSTS, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy
- **CORS:** Same-origin only for API routes
- **Note:** Middleware runs in dynamic mode only. For static export (production), security headers come from `.htaccess`.

### SEO & Crawling
- **Robots:** `src/app/robots.ts` — generates robots.txt
- **Sitemap:** `src/app/sitemap.ts` — generates XML sitemap
- **404 page:** `src/app/not-found.tsx` — custom not-found page

### Supporting Library Modules
| Module | Lines | Purpose |
|--------|-------|---------|
| `pressure-map.ts` | 76 | Client-side PressureMap data formatting |
| `nurture-emails.ts` | 290 | 3-email nurture sequence templates |
| `audit-log.ts` | 70 | Event logging with client IP tracking |
| `rate-limit.ts` | 59 | Rate limiting for public endpoints |
| `file-lock.ts` | 68 | Mutex locks for concurrent file writes |
| `sample-data.ts` | 128 | Mock assessment data for development/demo |
| `monitoring-storage.ts` | 121 | Persistent storage for monitoring sessions |
| `engine.ts` | — | Storage backend initialization |

### Worker Endpoint Not Listed Above
- **GET /stats** — Returns aggregate assessment statistics from D1 database

### Environment Variables
| Variable | Purpose |
|----------|---------|
| `STATIC_EXPORT` | Set to "true" for GoDaddy FTP deploy |
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 measurement ID |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta/Facebook Pixel ID |
| `NEXT_PUBLIC_LINKEDIN_PARTNER_ID` | LinkedIn Insight Tag partner ID |
| `NEXT_PUBLIC_STRIPE_CHECKOUT_URL` | Stripe checkout link ($69 plan) |
| `NEXT_PUBLIC_STRIPE_ANNUAL_URL` | Stripe checkout link ($149 plan) |
| `RESEND_API_KEY` | Resend email service key (worker) |
| `ANTHROPIC_API_KEY` | Claude API key (worker) |
| `PAYMENT_TOKEN_SECRET` | HMAC secret for payment tokens |
| `FTP_SERVER` / `FTP_USERNAME` / `FTP_PASSWORD` | GoDaddy FTP credentials (GitHub Secrets) |
