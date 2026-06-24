# Phase 7 Scope Card
## Architecture Correction and Boundary Separation Planning

**Status**: Planning Only — Audit Phase Not Yet Authorized  
**Baseline Commit**: 14cbc7a  
**Date Prepared**: 2026-06-24  
**Prepared By**: Claude Code Architecture Planning

---

## 1. CURRENT ARCHITECTURE BASELINE

### Phase 5 Locked (Deterministic Evaluation Persistence)
- **Status**: ✅ LOCKED  
- **Scope**: Core evaluation engine, result persistence, audit hash computation
- **Key Components**:
  - Evaluation repository and persistence service (`src/lib/persistence/`)
  - Audit ledger with hash-based chain ordering (`src/lib/persistence/audit-service.ts`)
  - Policy compilation and execution (`packages/rp-dsl/`)
  - Deterministic evaluation via `/api/v1/evaluate`
  - Snapshot storage and replay capability

### Phase 6 Locked (Deterministic Policy Governance)
- **Status**: ✅ LOCKED  
- **Scope**: Policy lifecycle, approval workflow, authorization enforcement, audit trail
- **Key Components**:
  - Governance service (`src/lib/phase6/governance-service.ts`)
  - Governance types and state machine (`src/lib/phase6/governance-types.ts`)
  - Governance repository (`src/lib/phase6/governance-repository.ts`)
  - Authorization helper (`src/lib/phase6/authorization-helper.ts`)
  - Governance audit event service (`src/lib/phase6/governance-audit-event-service.ts`)
  - Policy binding and cohort management

### Current API Route Structure (Mixed, Needs Separation)
```
/api/
  ├── /badge/          [Legacy, Ad-hoc]
  ├── /health/         [Infrastructure health check]
  ├── /verify/         [Auth/verification, legacy]
  ├── /webhooks/       [Stripe integration]
  ├── /platform/v1/    [CORRECT: Deterministic governance APIs]
  │   └── /governance/
  │       ├── /activate
  │       ├── /approve
  │       ├── /history
  │       ├── /reject
  │       ├── /retire
  │       ├── /state
  │       ├── /submit
  │       └── /supersede
  │
  ├── /v1/             [MIXED: Consumer + Platform + Advisory]
  │   ├── /evaluate           [Platform: deterministic evaluation]
  │   ├── /score              [Platform: result score]
  │   ├── /snapshot/:id       [Platform: snapshot retrieval]
  │   ├── /replay             [Platform: audit replay]
  │   ├── /advisor-analyze    [ADVISORY: AI-powered guidance]
  │   ├── /pressure-map       [ADVISORY: market context]
  │   ├── /send-report        [CONSUMER: email delivery]
  │   ├── /export             [CONSUMER: PDF export]
  │   ├── /data-export        [CONSUMER: raw data export]
  │   ├── /payment-token      [CONSUMER: Stripe integration]
  │   ├── /verify-payment     [CONSUMER: purchase verification]
  │   ├── /monitoring         [Platform: operational metrics]
  │   ├── /follow-up          [CONSUMER: post-evaluation]
  │   ├── /simulator-access   [CONSUMER: simulator auth]
  │
  └── /v2/
      └── /score          [DUPLICATE/VERSIONING: unclear purpose]
```

### Current src/lib Structure (Mixed, Needs Separation)
```
src/lib/
├── [Platform Core]
│   ├── engine/                    [Core evaluation logic]
│   ├── persistence/               [Phase 5: Evaluation & audit persistence]
│   ├── phase6/                    [Phase 6: Policy governance]
│   ├── audit-log.ts              [Governance audit events]
│   ├── client-engine-v2.ts       [Client-side evaluation fallback]
│   │
├── [Consumer/Advisory Infrastructure]
│   ├── agents/                    [AI advisor agents]
│   ├── industry-vocabulary.ts     [Vocabulary for advisor AI]
│   ├── advisor-questions.ts       [Questions for advisor]
│   ├── questions-free.ts          [Free tier questions]
│   ├── questions-advisor.ts       [Advisor-specific questions]
│   │
├── [Consumer Features]
│   ├── email.ts                   [Report email delivery]
│   ├── monitoring.ts              [User engagement metrics]
│   ├── monitoring-storage.ts      [Metric storage]
│   ├── action-scripts.ts          [Post-evaluation actions]
│   │
├── [Configuration & Utilities]
│   ├── config.ts                  [Runtime configuration]
│   ├── analytics.ts               [Consumer analytics]
│   ├── fetch-helpers.ts           [HTTP utilities]
│   ├── payment-token.ts           [Stripe payment flow]
│   ├── rate-limit.ts              [API rate limiting]
│   ├── api-auth.ts                [API authentication]
│   ├── file-lock.ts               [File-based locking]
│   │
├── [i18n & Customization]
│   ├── i18n/                      [Internationalization]
│   ├── industry-map.ts            [Industry classification]
│   ├── industry-pages.ts          [Industry-specific content]
│   ├── industry-tailoring.ts      [Industry customization]
│   ├── industry-vocabulary.ts     [Industry vocabulary]
│   │
├── [Adapters & Deprecated]
│   ├── v2-to-v1-adapter.ts       [Version bridging]
│   ├── worker-api.ts              [Edge worker API]
│   ├── plan-validation.ts         [Plan validation]
│   └── sector-map.ts              [Sector classification]
```

### Current Product Messaging (Landing Page & Copy)
- **Current positioning**: RunPayway™ **evaluates income stability** (infrastructure-first)
- **Decision Check™**: Packaged consumer product offering free evaluation + paid report
- **Advisor**: AI-powered guidance layer (currently unnamed, mixed in `/api/v1/`)
- **PressureMap**: Market context reference (calls external API, or fallback)
- **Design system**: Locked (Navy/Purple/Teal/Sand palette, Inter, 8px grid, 60px CTAs)

---

## 2. ARCHITECTURE CORRECTION GOALS

### Primary Objectives
1. **Platform Infrastructure Clarity**: Preserve and extend `/api/platform/v1/*` as the deterministic, policy-driven evaluation infrastructure. This is RunPayway™ core.
   
2. **Consumer Product Separation**: Isolate `/api/consumer/v1/*` for Decision Check™ packaged flows (evaluation request → payment verification → report delivery).
   
3. **Advisory/AI Containment**: Move AI guidance to `/api/advisory/v1/*` and explicitly mark as optional, dependent on external services (Gemini API). Keep imports out of platform/governance layers.
   
4. **Naming Coherence**: Align all internal naming, copy, and architectural concepts to reflect that RunPayway™ is **deterministic financial infrastructure** (like Stripe or Plaid), not a consumer advisory product.
   
5. **Governance Leakage Prevention**: Ensure `/api/platform/v1/governance/*` routes cannot be called from consumer or advisory flows without explicit escalation.

---

## 3. AUDIT TARGETS

### 3.1 API Route Structure
**What to audit:**
- Every route in `/api/v1/`, `/api/v2/`, and unplaced routes (`/verify`, `/badge`, etc.)
- Route naming (does it clearly indicate platform/consumer/advisory?)
- Route dependencies (does `/api/consumer/` import from `/api/advisory/`?)
- Governance route access (who can call `/api/platform/v1/governance/*`?)
- Legacy routes (are `/api/v2/score`, `/api/verify/`, `/api/badge/` still needed?)

**Classification scheme:**
- **Platform Infrastructure**: Core deterministic evaluation, policy governance, audit replay, snapshots
- **Consumer Packaged Product**: Payment, report delivery, export, email, follow-up for Decision Check™
- **Advisory/AI Layer**: AI-powered guidance, market context, multi-step coaching
- **Infrastructure/Health**: Health checks, monitoring, rate limiting, webhooks
- **Deprecated**: Legacy endpoints that can be removed

### 3.2 src/lib Structure
**What to audit:**
- Every module in `src/lib/`
- Module purpose (is it platform, consumer, or advisory?)
- Module dependencies (does advisory import platform? Does consumer import advisory?)
- AI agent code (`agents/`, `advisor-questions.ts`, `industry-vocabulary.ts`)
- Question sets (free, advisor, platform-only?)
- Storage and persistence (what data is persisted where?)

**Classification scheme:**
Same as API routes.

### 3.3 Landing Page & Product Copy
**What to audit:**
- Hero messaging (does it say "RunPayway™ evaluates income stability" or "Run your money better"?)
- Decision Check™ positioning (is it clearly a packaged product? Or the whole company?)
- Advisory positioning (is it named? Is it optional? Is it part of core offering?)
- CTA placement (sign up for evaluation vs. buy Decision Check™ vs. talk to advisor?)
- Product hierarchy (what's primary, what's secondary, what's advanced?)
- Use of ™ trademark marker (is RunPayway™ spelled correctly everywhere customer-facing?)

### 3.4 Decision Check™ Flow Boundaries
**What to audit:**
- Entry points (free evaluation, premium report, advisor upsell)
- Pricing integration (where does Stripe payment flow live?)
- Report generation (is it deterministic, or advisory-influenced?)
- Post-purchase flow (email delivery, access control, data export)
- Upgrade paths (free → paid, paid → advisor)

### 3.5 PressureMap and Advisor Analyze References
**What to audit:**
- PressureMap API calls (where are they? Are they behind rate limits? What's the fallback?)
- Advisor Analyze endpoint (`/api/v1/advisor-analyze`)
- Integration with evaluation flow (is advisory optional or required?)
- External dependency management (what happens if Gemini API is unavailable?)
- Configuration and feature flags

### 3.6 AI/Advisory Endpoint or Import Audit
**What to audit:**
- All files in `src/lib/agents/`
- All imports of Gemini API, Claude API, or other LLM services
- References to `advisor-questions.ts`, `industry-vocabulary.ts` in platform routes
- System prompts and AI instructions (are they isolated from governance logic?)
- Training data references (where does advisory AI get its context?)

### 3.7 Consumer vs. Platform Naming
**What to audit:**
- Variable names, function names, route paths
- Do they clearly indicate which layer they belong to?
- Examples:
  - ✅ Good: `PlatformEvaluationService`, `/api/platform/v1/evaluate`
  - ✅ Good: `ConsumerReportService`, `/api/consumer/v1/send-report`
  - ❌ Bad: `EvaluationService` (ambiguous), `/api/v1/evaluate` (which layer?)
  - ❌ Bad: `AdvisorGuidanceInEvaluationLogic` (leakage)

### 3.8 Files That Imply RunPayway™ is Consumer-First
**What to audit:**
- Landing page copy mentioning "your financial goals" vs. "income stability evaluation"
- Product naming (is Decision Check™ called "RunPayway Assessment"? Or clearly separate?)
- Feature positioning (advisor as core feature vs. optional add-on)
- Marketing copy in components that should be neutral
- Examples of implicit consumer-first design:
  - Page titled "Assess Your Income" (should be "Evaluate Income Stability")
  - Component named `ConsumerDashboard` at root level (should be scoped)
  - Email templates mixing product marketing with evaluation results

---

## 4. REQUIRED FINDINGS

For **each finding** identified during audit, the scope card recommends classifying it as one of:

### Finding Classification Template

```
Finding: [Brief name]
Location: [File path or route]
Current State: [What is it now?]
Classification: [One of below]

Classification Options:
- PLATFORM_INFRASTRUCTURE: Core deterministic evaluation, governance, audit
- CONSUMER_PACKAGED_PRODUCT: Decision Check™ flows (payment, report, export, email)
- ADVISORY_AI_LAYER: AI-powered guidance, optional external services
- INFRASTRUCTURE_HEALTH: Monitoring, health checks, logging, webhooks
- DEPRECATED: Legacy code no longer needed
- MISPLACED: Correct classification, wrong location

Recommended Action: [Rename, move, isolate, remove, or future-hold]
Block(s) Affected: [Which Phase 7 block will handle this?]
Regression Risk: [None, Low, Medium, High]
```

### Examples of Expected Finding Types

#### Finding Type: Route in Wrong Namespace
```
Finding: Advisor AI analysis in /api/v1/ instead of /api/advisory/v1/
Location: /api/v1/advisor-analyze/route.ts
Current State: Gemini API call for AI guidance
Classification: ADVISORY_AI_LAYER
Recommended Action: Move to /api/advisory/v1/analyze, update imports
Block(s) Affected: 7A (inventory), 7D (route restructuring)
Regression Risk: Medium (depends on /api/v1 path hardcoded in frontend)
```

#### Finding Type: Module Serving Multiple Layers
```
Finding: Industry vocabulary used for both platform evaluation and advisor AI
Location: src/lib/industry-vocabulary.ts
Current State: 346KB file with industry-specific context for both layers
Classification: CONSUMER_PACKAGED_PRODUCT (used by advisor AI)
Recommended Action: Split into platform-only and advisor-context modules
Block(s) Affected: 7B (boundary classification), 7D (route restructuring)
Regression Risk: High (widely imported, large refactor)
```

#### Finding Type: Copy Implying Consumer-First
```
Finding: Landing page hero messaging "Understand Your Financial Future"
Location: src/app/(marketing)/page.tsx (lines 300-350)
Current State: Consumer-focused call-to-action
Classification: CONSUMER_PACKAGED_PRODUCT (Decision Check™)
Recommended Action: Clarify RunPayway™ core is infrastructure; Decision Check™ is product
Block(s) Affected: 7C (naming and copy correction)
Regression Risk: Low (copy-only change, no code refactor)
```

---

## 5. OUT-OF-SCOPE EXCLUSIONS

### Explicitly NOT Included in Phase 7

- ❌ **No Implementation**: Phase 7 is audit and planning only. No code refactoring, no route moves, no renames.
- ❌ **No File Writes**: Do not create new modules, endpoints, or services during the audit phase.
- ❌ **No Schema Changes**: No Prisma schema updates, no database migrations.
- ❌ **No Migrations**: Do not create new migration files.
- ❌ **No Endpoint Refactors**: Do not change function signatures, parameter names, or response schemas yet.
- ❌ **No package.json Changes**: Do not add, remove, or upgrade dependencies in Phase 7.
- ❌ **No Phase 8 Concepts**: Do not introduce future-state architecture, multi-region deployment, or advanced features.
- ❌ **No New Product Copy Implementation**: Do not rewrite landing pages, marketing copy, or CTAs.
- ❌ **No Advisory Feature Expansion**: Do not add new AI capabilities, coaching flows, or advisor workflows.
- ❌ **No AI Prompt Implementation**: Do not refine system prompts, training data, or AI instruction sets.
- ❌ **No Direct Database Access Bypasses**: Do not add query-level shortcuts that bypass governance.

### Deferred to Later Phases

- **Phase 8**: Route migration, endpoint refactoring, package.json updates
- **Phase 9**: New advisory features, multi-language support for advisor AI
- **Phase 10**: Advanced analytics, advisor performance measurement, market data integration

---

## 6. PROPOSED PHASE 7 BLOCKS

Phase 7 will be broken into 5 sequentially approved blocks. **Each block requires explicit approval before work begins.**

### Block 7A: Architecture Inventory and Route Map
**Objective**: Complete audit of current API routes and lib structure.

**Deliverable**: 
- Comprehensive route inventory (all endpoints, current namespace, classification)
- Dependency map (which routes call which lib modules)
- Import graph (advisory imports, consumer imports, governance imports)
- Current state visualization (architecture diagram)

**Verification Criteria**:
- ✅ All `/api/` routes cataloged and classified
- ✅ All `src/lib/` modules cataloged and classified
- ✅ Import graph complete with 0 missing dependencies
- ✅ Diagram shows current state accurately

**Estimated Scope**: 2–4 hours audit time. No code changes.

---

### Block 7B: Platform / Consumer / Advisory Boundary Classification
**Objective**: Classify every identified artifact (route, module, component) into its correct layer.

**Deliverable**:
- Classification matrix (file name → layer classification → current location → target location)
- Boundary violation report (code that violates layer rules, e.g., advisor imports in platform routes)
- Naming audit (variables, functions, types that are ambiguous or misleading)
- Copy audit (landing page, email templates, component labels that imply wrong positioning)

**Verification Criteria**:
- ✅ Every route classified (0 ambiguous)
- ✅ Every lib module classified (0 ambiguous)
- ✅ Boundary violations explicitly listed (0 assumed, all documented)
- ✅ Naming issues flagged with examples

**Estimated Scope**: 4–6 hours audit time. No code changes.

---

### Block 7C: Naming and Copy Correction Plan
**Objective**: Plan all naming and copy changes needed to reflect architecture.

**Deliverable**:
- Rename plan (file → old name → new name, with reason)
- Copy correction plan (file → old copy → new copy, with brand tone guide)
- Trademark audit (RunPayway™ spelled correctly everywhere customer-facing)
- Brand messaging guide (what is RunPayway™ core? What is Decision Check™? What is the advisor?)

**Verification Criteria**:
- ✅ All renames mapped to a specific reason (separation, clarity, trademark)
- ✅ All copy changes aligned with brand tone
- ✅ Trademark usage consistent throughout
- ✅ Brand hierarchy clear in messaging

**Estimated Scope**: 2–3 hours planning time. No code changes.

---

### Block 7D: Route Restructuring Plan
**Objective**: Plan all route moves and namespace corrections.

**Deliverable**:
- Route migration matrix (old path → new path, with reason)
- Redirect plan (what old paths need temporary redirects for backwards compatibility?)
- Import update plan (what imports need to change when routes move?)
- Backwards-compatibility strategy (do we deprecate old routes or hard-break?)
- Rollback strategy (how do we safely test route moves without breaking frontend?)

**Verification Criteria**:
- ✅ Every route migration justified (separation, clarity, or consolidation)
- ✅ Redirect strategy explicit (temp 301? Hard break? Gradual migration?)
- ✅ Import update list complete
- ✅ Testing strategy clear before implementation

**Estimated Scope**: 3–4 hours planning time. No code changes.

---

### Block 7E: Implementation Plan and Gate Recommendations
**Objective**: Plan the Phase 8+ implementation roadmap with explicit authorization gates.

**Deliverable**:
- Phased implementation roadmap (which changes in which order?)
- Risk matrix (each major change → regression risk → mitigation)
- Testing plan (what tests exist? What new tests are needed before implementation?)
- Dependency order (must renames happen before route moves? Must route moves happen before import updates?)
- Go/No-Go decision (is the architecture clear enough to proceed?)
- Known blockers and assumptions

**Verification Criteria**:
- ✅ Implementation sequence has explicit rationale
- ✅ Each change has a rollback strategy
- ✅ Test coverage identified
- ✅ Known risks documented with mitigations
- ✅ Go/No-Go recommendation clear

**Estimated Scope**: 3–4 hours planning time. No code changes.

---

## 7. VERIFICATION GATES

Before Phase 7 Audit Begins:
- [ ] Explicit approval from technical stakeholder (authorization required)
- [ ] Commit baseline established (current: 14cbc7a)

After Each Block Completes:
- [ ] Block deliverable reviewed and approved before next block starts
- [ ] No code changes introduced during planning

After Phase 7 Completes (Before Phase 8):
- [ ] Phase 5 regression test: existing `/api/v1/evaluate` still works identically
- [ ] Phase 6 regression test: governance workflow still works end-to-end
- [ ] No governance leakage: `/api/platform/v1/governance/*` cannot be called from consumer routes
- [ ] No advisory imports in platform routes (grep check)
- [ ] No consumer imports in platform governance routes (grep check)
- [ ] Existing test suite still passes (npm run test)
- [ ] New tests proposed before any implementation begins

---

## 8. GO / HOLD RECOMMENDATION

### Recommendation: **HOLD** pending explicit authorization

**Rationale**:
Phase 7 is a **destructive refactor** in terms of code organization. While no code will be changed during the audit itself, the findings will guide Phase 8's implementation of:
- Route restructuring (`/api/v1/*` → `/api/consumer/v1/*`, `/api/advisory/v1/*`)
- Module renames and moves
- Copy/messaging updates
- Naming changes throughout codebase

**These changes carry MEDIUM-to-HIGH regression risk** because:
1. Frontend code may have hardcoded `/api/v1/` paths (need to verify)
2. Consumer contracts (request/response shapes) may be tightly coupled (need to verify)
3. Advisory AI system prompts reference specific domain structures (need to verify)
4. Test suite may have mocked paths (need to verify)

**Before Phase 7 Audit Can Proceed**:
1. ✅ Confirm **explicit authorization** from the technical stakeholder
2. ✅ Run a **frontend scan** to find all hardcoded `/api/` paths (prevents breaking changes)
3. ✅ Verify **advisory AI can be safely isolated** (Gemini API calls, system prompts)
4. ✅ Identify **consumer contracts** that must remain backwards-compatible
5. ✅ Confirm **Phase 5 & 6 regression tests** are sufficient (or add new ones)

**If Authorization Given**:
Phase 7A (Architecture Inventory) can begin **immediately** with no implementation risk, since it's pure audit.

**If Authorization Withheld**:
Phase 7 should remain in **HOLD** status. The codebase can continue to function as-is, with the understanding that platform/consumer/advisory boundaries will be corrected in a future phase.

---

## 9. SUMMARY: PHASE 7 ARCHITECTURE CORRECTION OVERVIEW

| Aspect | Current State | Phase 7 Audit Target | Phase 8+ Implementation Goal |
|--------|---------------|----------------------|------------------------------|
| **Platform APIs** | Scattered in `/api/platform/v1/` and `/api/v1/` | Inventory, classify, standardize | All deterministic evaluation in `/api/platform/v1/*` |
| **Consumer APIs** | Mixed with platform in `/api/v1/` | Inventory, classify, separate | All Decision Check™ flows in `/api/consumer/v1/*` |
| **Advisory APIs** | Monolithic in `/api/v1/advisor-analyze` | Inventory, classify, isolate | All optional AI guidance in `/api/advisory/v1/*` |
| **Governance Routes** | Clean in `/api/platform/v1/governance/*` | Audit access control | Locked, no leakage to other layers |
| **Lib Structure** | Mixed (platform, consumer, advisory all interleaved) | Inventory, classify boundaries | Separated with explicit import rules |
| **Product Messaging** | Ambiguous (RunPayway™ vs. Decision Check™) | Audit and correct | Clear: infrastructure vs. packaged product vs. optional AI |
| **Naming** | Inconsistent (ambiguous about layer) | Audit and plan renames | Consistent (platform, consumer, advisory prefixes) |
| **Test Coverage** | Existing (Phase 5 & 6 regressions) | Verify sufficiency | Add new tests for boundary separation before Phase 8 |

---

## APPENDIX: AUDIT SCOPE CHECKLIST

### Routes to Audit (30 total)
- [ ] `/api/badge/[code]` — legacy?
- [ ] `/api/badge/[code]/embed` — legacy?
- [ ] `/api/health` — infrastructure
- [ ] `/api/verify` — deprecated?
- [ ] `/api/verify-public` — deprecated?
- [ ] `/api/webhooks/stripe` — infrastructure
- [ ] `/api/platform/v1/governance/activate` — platform ✅
- [ ] `/api/platform/v1/governance/approve` — platform ✅
- [ ] `/api/platform/v1/governance/history` — platform ✅
- [ ] `/api/platform/v1/governance/reject` — platform ✅
- [ ] `/api/platform/v1/governance/retire` — platform ✅
- [ ] `/api/platform/v1/governance/state` — platform ✅
- [ ] `/api/platform/v1/governance/submit` — platform ✅
- [ ] `/api/platform/v1/governance/supersede` — platform ✅
- [ ] `/api/v1/advisor-analyze` — advisory?
- [ ] `/api/v1/data-export` — consumer?
- [ ] `/api/v1/evaluate` — platform
- [ ] `/api/v1/export` — consumer?
- [ ] `/api/v1/follow-up` — consumer?
- [ ] `/api/v1/monitoring` — infrastructure?
- [ ] `/api/v1/payment-token` — consumer?
- [ ] `/api/v1/pressure-map` — advisory?
- [ ] `/api/v1/replay` — platform
- [ ] `/api/v1/score` — platform
- [ ] `/api/v1/send-report` — consumer?
- [ ] `/api/v1/simulator-access` — consumer?
- [ ] `/api/v1/snapshot/:id` — platform
- [ ] `/api/v1/verify-payment` — consumer?
- [ ] `/api/v2/score` — platform (why v2?)

### Lib Modules to Audit (35 total)
- [ ] `engine/` — platform
- [ ] `persistence/` — platform (Phase 5)
- [ ] `phase6/` — platform (Phase 6)
- [ ] `agents/` — advisory?
- [ ] `email.ts` — consumer
- [ ] `industry-vocabulary.ts` — advisory/consumer?
- [ ] `advisor-questions.ts` — advisory?
- [ ] `questions-free.ts` — consumer?
- [ ] `questions.ts` — consumer?
- [ ] `questions-advisor.ts` — advisory?
- [ ] `monitoring.ts` — infrastructure
- [ ] `monitoring-storage.ts` — infrastructure
- [ ] `action-scripts.ts` — consumer?
- [ ] `analytics.ts` — consumer?
- [ ] `config.ts` — infrastructure
- [ ] `api-auth.ts` — infrastructure
- [ ] `rate-limit.ts` — infrastructure
- [ ] `payment-token.ts` — consumer
- [ ] `industry-map.ts` — consumer?
- [ ] `industry-pages.ts` — consumer?
- [ ] `industry-tailoring.ts` — consumer?
- [ ] `i18n/` — consumer?
- [ ] `fetch-helpers.ts` — infrastructure
- [ ] `file-lock.ts` — infrastructure
- [ ] `audit-log.ts` — platform (Phase 6)
- [ ] `v2-to-v1-adapter.ts` — legacy?
- [ ] `worker-api.ts` — infrastructure?
- [ ] `plan-validation.ts` — platform?
- [ ] `sector-map.ts` — platform?
- [ ] `client-engine-v2.ts` — platform?
- [ ] `prisma.ts` — infrastructure
- [ ] `design-tokens.ts` — infrastructure
- [ ] `industry-vocabulary.ts` — advisory/consumer

### Product Messaging to Audit
- [ ] Landing page hero section
- [ ] Decision Check™ positioning
- [ ] Advisor positioning and naming
- [ ] Feature hierarchy (free vs. paid vs. premium)
- [ ] Email templates (report delivery, follow-up)
- [ ] Component labels and CTAs
- [ ] Trademark usage (RunPayway™)

---

## FINAL DECISION MATRIX

| Condition | Decision | Reason |
|-----------|----------|--------|
| Explicit authorization provided | **→ Begin Phase 7A** | Audit has zero implementation risk |
| Frontend scan shows no hardcoded paths | **→ Continue planning** | Route migration is feasible |
| Advisory AI can be safely isolated | **→ Continue planning** | Isolation is possible without breaking changes |
| Phase 5 & 6 regression tests exist | **→ Approve for implementation** | Safe rollback strategy available |
| Authorization withheld | **→ HOLD Phase 7** | Defer to future decision |
| Frontend scan finds many hardcoded paths | **→ Adjust plan** | May need gradual migration or compatibility layer |
| Advisory AI is tightly coupled | **→ Adjust plan** | May need Phase 8 advisory refactor first |

---

**End of Phase 7 Scope Card**

*This document is a planning artifact only. No code has been modified. The findings and recommendations are proposals for future phases, pending explicit authorization.*
