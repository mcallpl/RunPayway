# IMPLEMENTATION AUDIT
## RunPayway™ — Decision Check™ Production Path

**Date:** June 17, 2026  
**Objective:** Identify minimum viable architecture to make Decision Check™ real

---

# PART 1 — CURRENT STATE AUDIT

## What Exists

### ✅ CORE FOUNDATION (PRODUCTION-READY)

**Engine (RP-2.0)**
- `/src/lib/engine/v2/index.ts` — Complete 20-engine pipeline (orchestrator)
- 20 sequential engines: validation → normalization → scoring → classification → interpretation
- Pure functions. Deterministic. Identical inputs = Identical outputs.
- All engines in `/src/lib/engine/v2/engines/`
- Type system: `/src/lib/engine/v2/types.ts` (comprehensive, frozen)
- Schemas: `/src/lib/engine/v2/schemas/canonical-record.ts` (input/output contract)
- Assessment record output: Complete structural measurement

**Report Generator (PDF)**
- `/src/app/(app)/review/report-pdf.tsx` — jsPDF 4-page print document
- Accepts `ReportPDFData` interface
- Renders measurements + interpretation + scenarios + action plan
- Font handling, pagination, sanitization complete
- QR code removed for RP-2.0

### ⚠️ CURRENT FLOW (PARTIALLY COMPLETE)

**User Intake Path:**
1. `/begin` → redirects to `/free-assessment`
2. `/free-assessment` → Simple 5-question free flow (industry + 4 simplified questions)
   - Generates `RawDiagnosticInput`
   - Routes to `/free-score` or `/diagnostic-portal`
3. `/diagnostic` → Full assessment engine (6 detailed questions)
   - Calls `executeAssessment()` from RP-2.0
   - Converts output via `v2-to-v1-adapter`
   - Routes to `/dashboard`

**Storage Layer:**
- `/src/lib/engine/storage.ts` — Abstract interface (not implemented)
- `/src/lib/engine/storage-json.ts` — Local JSON fallback
- No database. No persistence. Assessments exist only in memory/session.

**API Routes Exist (But Not Decision Check™-Focused):**
- `/api/v1/score` — Legacy scoring endpoint
- `/api/v2/score` — New endpoint (incomplete)
- `/api/v1/pressure-map` — AI-generated industry analysis (non-standard)
- `/api/v1/advisor-analyze` — Advisor infrastructure (unnecessary)
- `/api/v1/send-report` — Email delivery (partial)
- `/api/v1/simulator-access` — Future feature
- `/api/v1/data-export` — Data export (future feature)

### ❌ UNNECESSARY INFRASTRUCTURE

**Advisor Portal**
- `/src/app/(app)/advisor-portal/` (entire directory)
- `/src/app/(app)/advisor-portal/dashboard/`
- Not required for Decision Check™ consumer product
- **MARK FOR REMOVAL**

**Dashboard**
- `/src/app/(app)/dashboard/` (complex, multi-page)
- `/src/app/(app)/dashboard/success/`
- `/src/app/(app)/dashboard/login/`
- Includes authentication, account management, history
- Not required for simple Decision Check™ flow
- **MARK FOR REMOVAL**

**Diagnostic Portal**
- `/src/app/(app)/diagnostic-portal/`
- Duplicate of `/diagnostic` with different styling
- **MARK FOR REMOVAL**

**Future Products (Not Decision Check™)**
- `/src/app/(app)/simulator/` — Scenario simulator
- `/src/app/(app)/precision/` — Advanced analysis
- `/src/app/(app)/pressuremap/` — AI risk analysis
- `/src/app/(app)/download/` — Data download
- `/src/app/(app)/unlock/` — Paywall logic
- `/src/app/(app)/tools/` — Tool hub
- **MARK FOR FUTURE PHASES**

**Complex Marketing**
- `/src/app/(marketing)/learn/` — 65-page topical authority (phase 2+)
- `/src/app/(marketing)/organizations/` (unnecessary)
- `/src/app/(marketing)/assessment-registry/` (future feature)
- **MARK FOR FUTURE PHASES**

**Unnecessary API Routes**
- `/api/v1/advisor-analyze` (advisor infrastructure)
- `/api/v1/simulator-access` (future feature)
- `/api/v1/data-export` (future feature)
- `/api/v1/follow-up` (incomplete)
- `/api/v1/snapshot/[id]` (data collection, future)
- **MARK FOR REMOVAL OR DEFER**

---

## What Works Against Decision Check™

### Problem 1: Storage Layer Broken
- `storage.ts` defines interface but is not implemented
- `storage-json.ts` exists but is never used in the flow
- Assessments disappear on page refresh
- No way to retrieve or download reports
- **BLOCKS:** Ability to store/retrieve Decision Check™ results

### Problem 2: Adapter Complexity
- `v2-to-v1-adapter.ts` converts engine output to "v1 record" format
- Creates unnecessary abstraction layer
- Decision Check™ should use RP-2.0 output directly
- **BLOCKS:** Simple, direct report generation from measurements

### Problem 3: Fragmented Intake
- `/free-assessment` (5 questions)
- `/diagnostic` (6 questions)
- Both route through different paths
- Neither is "Decision Check™ intake"
- **BLOCKS:** Clear product definition

### Problem 4: No Clear Report Route
- Report generator exists (`report-pdf.tsx`)
- Not integrated into user flow
- No endpoint to generate/download Decision Check™ report
- **BLOCKS:** MVP completion

### Problem 5: Unnecessary Session/Auth Complexity
- `rp_purchase_session` in sessionStorage
- `rp_previous_plan` in localStorage
- Plan-based route guards
- Not required for free Decision Check™
- **BLOCKS:** Simple, clear data flow

---

# PART 2 — TARGET ARCHITECTURE

## Layer 1: RunPayway Income Structure Standard™

**Purpose:** Single source of truth for all measurements.

**Components:**
```
src/lib/standard/
├── index.ts                    // Export all constants
├── types.ts                    // Core type definitions
├── constants.ts                // RP-2.0 outputs (Stability Bands, ranges)
├── rules.ts                    // Interpretation rules (fixed logic)
└── measurements.ts             // Measurement definitions
```

**What's Included:**
- Stability Bands (A/B/C/D definitions)
- Forward-Secured thresholds
- Income Persistence ranges
- Variability scales
- Labor Dependence thresholds
- Constraint hierarchy
- Decision Relevance rules (which measurements matter for which decisions)

**What's NOT Included:**
- Business logic (that's in the engine)
- Report formatting (that's in the consumer layer)
- Future classification (that's future phases)

**Status:** Already exists in engine (`v2/engines/`) — just needs to be ORGANIZED.

---

## Layer 2: Consumer Decision Check™ Product

**Purpose:** Help a consumer understand their income structure for a specific decision.

### 2A. Intake Flow

**Route:** `/decision-check/start`

**Steps:**
1. Collect Profile (name, email, income decision type)
2. Ask 6 standardized questions (same for all profiles, all decisions)
3. Generate assessment

**Components:**
```
src/app/(app)/decision-check/
├── start/page.tsx              // Entry → profile → questions
├── result/page.tsx             // Display assessment + download report
└── api/
    └── route.ts                // Intake → generate assessment
```

**What's NOT Included:**
- Complex branching logic
- Industry-specific questions (Decision Check™ is universal)
- Multiple decision types (start with one: Home Purchase)
- Simulations or scenarios (future phases)

### 2B. Assessment Engine

**Route:** Internal function (client + server)

**Steps:**
1. Receive profile + answers
2. Call `executeAssessment()` from RP-2.0
3. Return structured assessment

**Components:**
```
src/lib/assessment/
├── index.ts                    // Public API
├── intake-to-canonical.ts      // Convert questions to RP-2.0 input
└── result-transformer.ts       // Convert RP-2.0 output to report input
```

**What's NOT Included:**
- Pressure Map (PressureMap is future, and only works when available)
- Advisor analysis
- Multi-decision logic
- Simulations

### 2C. Report Generator

**Route:** `/decision-check/result` → PDF download

**Steps:**
1. Receive assessment + profile
2. Call existing `generateReportPDF()` from `report-pdf.tsx`
3. Return PDF bytes

**Components:**
```
// Reuse existing:
src/app/(app)/review/report-pdf.tsx

// Add wrapper:
src/app/(app)/decision-check/result/route.ts
```

**What's NOT Included:**
- Multiple report formats (PDF only for now)
- Email delivery (future phase)
- Advisor annotations
- Client customization

### 2D. Storage (Phase 2)

For MVP: No storage. Sessions only.
For Phase 2: Simple key-value (Cloudflare D1 or similar).

---

## Removed Components

**Deletion List:**
- `/src/app/(app)/advisor-portal/` (entire directory)
- `/src/app/(app)/dashboard/` → Replace with `/decision-check/result`
- `/src/app/(app)/diagnostic-portal/` (entire directory)
- `/src/app/(app)/simulator/` (defer to phase 2+)
- `/src/app/(app)/precision/` (defer to phase 2+)
- `/src/app/(app)/unlock/` (defer to phase 2+)
- `/src/app/(app)/tools/` (defer to phase 2+)
- `/src/app/(app)/pressuremap/` (defer to phase 2+)
- `/src/app/(app)/download/` (defer to phase 2+)
- `/src/lib/v2-to-v1-adapter.ts` (unnecessary)
- `/src/lib/engine/storage.ts` (unused)
- All unnecessary API routes (see list above)

**Simplification:**
- Remove session-based plan guards
- Remove localStorage auth logic
- Remove Stripe webhook handling (defer)
- Keep free-assessment but simplify routing

---

# PART 3 — FILE STRUCTURE

## New Directory Layout

```
src/
├── lib/
│   ├── standard/                    # Layer 1: Standard
│   │   ├── index.ts
│   │   ├── types.ts
│   │   ├── constants.ts             # Bands, thresholds
│   │   ├── rules.ts                 # Interpretation rules
│   │   └── measurements.ts          # Measurement definitions
│   │
│   ├── engine/                      # RP-2.0 (NO CHANGES)
│   │   └── v2/
│   │       ├── index.ts             # executeAssessment()
│   │       ├── engines/             # 20 pure functions
│   │       └── types.ts
│   │
│   ├── assessment/                  # Layer 2: Product Logic
│   │   ├── index.ts                 # assessDecision()
│   │   ├── intake-to-canonical.ts   # Questions → RP-2.0 input
│   │   └── result-transformer.ts    # RP-2.0 output → Report input
│   │
│   ├── questions-decision-check.ts  # Standardized 6 questions
│   └── [keep existing utilities]
│
├── app/
│   └── (app)/
│       ├── decision-check/          # NEW: Decision Check™ Product
│       │   ├── start/page.tsx       # Intake flow
│       │   ├── result/page.tsx      # Results display
│       │   ├── api/
│       │   │   ├── intake.ts        # Receive answers → assess
│       │   │   └── report.ts        # Generate PDF
│       │   └── layout.tsx
│       │
│       ├── free-assessment/         # Keep (simplified flow)
│       │   └── page.tsx
│       │
│       ├── [DELETE: advisor-portal/]
│       ├── [DELETE: dashboard/]
│       ├── [DELETE: diagnostic-portal/]
│       ├── [DELETE: simulator/]
│       ├── [DELETE: precision/]
│       ├── [DELETE: pressuremap/]
│       ├── [DELETE: download/]
│       ├── [DELETE: tools/]
│       └── [DELETE: unlock/]
│
└── components/
    └── [keep existing]
```

---

# PART 4 — BUILD PLAN

## Phase A: Foundation (Days 1-2)

**Objective:** Organize the standard. Make RP-2.0 the single source of truth.

**Tasks:**
1. Create `/src/lib/standard/` directory structure
2. Extract band definitions from engine → `constants.ts`
3. Extract measurement thresholds → `measurements.ts`
4. Extract interpretation rules → `rules.ts`
5. Create `/src/lib/standard/types.ts` (reference, don't duplicate)
6. Create `/src/lib/standard/index.ts` (clean exports)

**Output:**
- A clean standard layer that the entire product derives from
- No duplication of band logic or thresholds
- Single source of truth for "what is a Band A income"

**Deliverable:**
- Standard is organized, testable, reusable

---

## Phase B: Assessment Pipeline (Days 3-4)

**Objective:** Build the Decision Check™ assessment pipeline.

**Tasks:**
1. Create `/src/lib/assessment/index.ts` — Main entry point
   - Function: `assessDecision(profile, answers) → assessment`
   - Calls RP-2.0 engine directly (no v1-adapter)
   
2. Create `/src/lib/assessment/intake-to-canonical.ts`
   - Convert Decision Check™ questions → RP-2.0 canonical input
   - Map question answers to income structure fields
   
3. Create `/src/lib/assessment/result-transformer.ts`
   - Convert RP-2.0 output → Report input shape
   - Extract only what's needed for Decision Check™ report

4. Create `/src/lib/questions-decision-check.ts`
   - Define the 6 standard Decision Check™ questions
   - These are universal (same for all profiles, all decisions)
   - Focus on income structure measurement only

5. Clean up existing v2-to-v1 logic (delete v2-to-v1-adapter.ts)

**Output:**
- Clear pipeline: profile → assess → report input
- No external dependencies (pure functions)
- Deterministic (same input = same output)

**Deliverable:**
- Assessment module that transforms questions into RP-2.0 output

---

## Phase C: UI/Flow (Days 5-6)

**Objective:** Build the Decision Check™ consumer flow.

**Tasks:**
1. Create `/src/app/(app)/decision-check/start/page.tsx`
   - Step 1: Profile (name, email, decision type)
   - Step 2: Questions (6 standardized questions)
   - Submit → API call
   
2. Create `/src/app/(app)/decision-check/result/page.tsx`
   - Display assessment results
   - Show key measurements (Band, Persistence, Forward-Secured, etc.)
   - Download PDF button
   
3. Create `/src/app/(app)/decision-check/api/intake.ts`
   - Receive profile + answers
   - Call `assessDecision()`
   - Return assessment (or redirect with session data)
   
4. Create `/src/app/(app)/decision-check/api/report.ts`
   - Receive assessment ID
   - Generate PDF (reuse existing `report-pdf.tsx`)
   - Return PDF bytes

5. Simplify `/free-assessment/page.tsx`
   - Route users to `/decision-check/start` instead

**Output:**
- Complete Decision Check™ user flow
- From entry → profile → questions → results → PDF download
- All custom routing/session logic removed

**Deliverable:**
- A Business Owner can complete Decision Check™ and download a report

---

## Phase D: Polish & Deploy (Days 7-8)

**Objective:** Remove unnecessary infrastructure, test, deploy.

**Tasks:**
1. Delete unnecessary directories
   - `/advisor-portal/`
   - `/dashboard/`
   - `/diagnostic-portal/`
   - `/simulator/`, `/precision/`, `/pressuremap/`, `/download/`, `/tools/`, `/unlock/`
   
2. Remove unnecessary API routes
   - All advisors endpoints
   - All simulator endpoints
   - All data export endpoints
   
3. Clean up CSS/components
   - Remove dashboard-specific styling
   - Keep only Decision Check™ components
   
4. Test the complete flow
   - Create test profile (Business Owner)
   - Answer questions
   - Download report
   - Verify measurements are correct
   
5. Update home page to link to `/decision-check/start`

6. Deploy to runpayway.peoplestar.com

**Output:**
- Lean codebase focused on Decision Check™
- No dead code, no abandoned features
- Production-ready

**Deliverable:**
- Decision Check™ is live and working

---

# PART 5 — FIRST COMMIT

## Recommendation: Phase A Foundation

**Commit:** "standard: Organize RunPayway Income Structure Standard™"

**What to Include:**
1. Create `/src/lib/standard/` directory
2. Extract and organize:
   - `types.ts` (core types)
   - `constants.ts` (Bands, thresholds, persistence ranges)
   - `measurements.ts` (what each measurement means)
   - `rules.ts` (interpretation rules)
   - `index.ts` (clean exports)

3. Update `/src/lib/engine/v2/index.ts` to export from standard
4. Add test file: `/src/lib/standard/__tests__/standard.test.ts`

**Why First:**
- Unblocks the entire product
- Establishes single source of truth
- Foundation for assessment pipeline
- No breaking changes to existing flow
- Highest value-to-effort ratio

**Size:** ~400 lines of organized code
**Time:** 2-3 hours
**Risk:** None (refactoring only, logic unchanged)

**Verification:**
- Existing tests still pass
- Engine outputs unchanged
- Standard can be imported and used

---

# SUCCESS CRITERIA

**By end of Phase D, a Business Owner can:**

1. ✅ Go to `/decision-check/start`
2. ✅ Enter name, email, decide "Home Purchase"
3. ✅ Answer 6 standardized questions about their income
4. ✅ See their assessment (Band, score, key measurements)
5. ✅ Download a PDF report
6. ✅ Report shows:
   - Income Structure Measurements (from RP-2.0)
   - Structural Characteristics (from Standard layer)
   - Decision Relevance Analysis (how their structure affects home purchase)
   - Income Structure Summary (plain English)

**No other features required.**

---

# TIMELINE

| Phase | Duration | Status |
|-------|----------|--------|
| A: Foundation | 2 days | Ready to start |
| B: Assessment | 2 days | Blocked on A |
| C: UI/Flow | 2 days | Blocked on B |
| D: Polish | 2 days | Blocked on C |
| **Total** | **8 days** | **Start immediately** |

---

# CRITICAL NOTES

1. **No Database Required for MVP**
   - Assessments exist in session
   - User can download PDF
   - Phase 2 adds persistence

2. **RP-2.0 Engine is Production-Ready**
   - Do NOT modify engine logic
   - Do NOT add new engines
   - Use as-is

3. **Reuse Existing Report Generator**
   - `report-pdf.tsx` already works
   - Just call it from new route
   - Adapt input shape in result-transformer

4. **Decision Check™ ≠ Full Diagnostic**
   - Simple 6 questions (not 40+)
   - Specific decision focus (not general exploration)
   - Measured output only (no coaching)

5. **Optimize for Shipping**
   - Skip perfection
   - Ship Phase A → Phase B → Phase C → Phase D
   - Each phase is deployable
