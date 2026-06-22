# Terminology Cleanup Impact Report

**Date:** June 22, 2026  
**Status:** Analysis Complete — No Changes Made  
**Scope:** Enterprise MVP codebase search

---

## Executive Summary

**Major Finding:** Most legacy terminology has already been removed from active codebase. Instances found are primarily:
1. In planning/documentation files (TERMINOLOGY_CLEANUP_PLAN_V1.md, LOCALIZATION_FREEZE_V1.md)
2. In governance/standard documents (ADRs, standards/)
3. In type definitions that remain necessary (ASNC enum)

**Recommendation:** Phase 1 can proceed quickly (low impact). Phase 2 & 3 are less critical than initially assessed.

---

## Search Results Summary

| Term | Total Count | Docs | Source Code | Tests | Assessment |
|------|-------------|------|-------------|-------|------------|
| CAFM | 11 | 11 | 0 | 0 | META (in cleanup plan) |
| ASNC | 17 | 6 | 3 | 0 | **KEEP** (active enum) |
| Version Space | 6 | 1 | 0 | 0 | META (in cleanup plan) |
| Basis Set | 5 | 1 | 0 | 0 | META (in cleanup plan) |
| Cognitive Mass | 5 | 1 | 0 | 0 | META (in cleanup plan) |
| Cognitive Attribution | 0 | 0 | 0 | 0 | NOT FOUND |
| Projection Model | 0 | 0 | 0 | 0 | NOT FOUND |
| **TOTAL** | **44** | **20** | **3** | **0** | |

---

## Files Affected

### HIGH COUNT — But Already Documented
- **docs/TERMINOLOGY_CLEANUP_PLAN_V1.md** (29+ instances)
  - Self-referential: This file documents the terms to be removed
  - Contains examples, taxonomy, risk assessment
  - Status: This is meta-documentation; no action needed

- **docs/LOCALIZATION_FREEZE_V1.md** (2 instances)
  - Context statements about CAFM transition
  - Status: Already committed governance doc; minimal change

### GOVERNANCE DOCUMENTS — Standards/ADRs
- **docs/adr/ADR-002-AST-Execution.md** (6 instances of ASNC)
  - ASNC used as error state in execution flow
  - Contextual references to policy compilation errors
  - **Assessment: MEDIUM** (part of formal standards; architectural significance)

- **docs/standards/API_STANDARD.md** (3 instances of ASNC)
  - API status field definition
  - Describes ASNC as "Policy compilation failed"
  - **Assessment: HIGH** (affects API contract; external visibility)

- **docs/standards/ARCHITECTURE_STANDARD.md** (2 instances of ASNC)
  - Execution flow diagram showing ASNC endpoint
  - Error state table
  - **Assessment: MEDIUM** (governance reference)

- **docs/standards/DATA_MODEL_STANDARD.md** (1 instance of ASNC)
  - Output schema lists ASNC in status enum
  - **Assessment: MEDIUM** (formal specification)

- **docs/standards/REASON_CODE_STANDARD.md** (1 instance of ASNC)
  - Mentions ASNC compilation error consequence
  - **Assessment: MEDIUM** (governance reference)

- **docs/standards/RP_DSL_STANDARD.md** (2 instances of ASNC)
  - Error handling → ASNC mapping
  - Determinism verification
  - **Assessment: MEDIUM** (DSL standard reference)

### SOURCE CODE — Active Implementation
- **packages/domain/types.ts** (1 instance)
  ```typescript
  export enum EvaluationStatus {
    PASS = "PASS",
    FAIL = "FAIL",
    REVIEW = "REVIEW",
    INPUT_ERROR = "INPUT_ERROR",
    ASNC = "ASNC",              // Line 100
    POLICY_BINDING_ERROR = "POLICY_BINDING_ERROR",
    EXECUTION_TIMEOUT = "EXECUTION_TIMEOUT",
  }
  ```
  - **Type:** Enum definition
  - **Impact:** HIGH (used throughout evaluation pipeline)
  - **Cascade:** ~40+ files reference EvaluationStatus.ASNC
  - **Assessment:** CRITICAL (core type definition)

- **src/app/api/v1/evaluate/route.ts** (2 instances)
  ```typescript
  code: "ASNC",        // Line 70, 131
  status = EvaluationStatus.ASNC;  // Line 147
  ```
  - **Type:** API route handler
  - **Impact:** HIGH (external-facing API behavior)
  - **Assessment:** CRITICAL (public API contract)

- **src/app/api/v1/replay/route.ts** (1 instance)
  ```typescript
  code: "ASNC",        // Line 116
  ```
  - **Type:** API route handler
  - **Impact:** HIGH (external-facing API)
  - **Assessment:** CRITICAL (public API contract)

---

## Terminology Classification & Replacement Strategy

### 1. CAFM (11 instances)
**Current Status:** Only in cleanup documentation  
**Type:** Consumer product branding  
**Replacement Strategy:**
- In planning docs: Change to "Income Stability Score™ Assessment Engine"
- In governance: "Structural Assessment Model"
- Context: "deterministic policy evaluation"

**Risk Level:** LOW  
**Rationale:** Not in active source code; already transitioned to enterprise terminology  
**Effort:** 0.5 hours

---

### 2. ASNC (17 instances — SPECIAL CASE)
**Current Status:** Active enum; core system status code  
**Type:** System status identifier (Assessment → Status → Not Suitable for Classification? Or Assessment Not Signed/Confirmed?)

**Decision Point:** DO NOT REMOVE ASNC
- ASNC is an operational status code, not a conceptual abstraction
- It represents a distinct evaluation outcome (policy compilation failed)
- Changing it would affect:
  - API contracts (public status field)
  - Database records (historical data)
  - Client integrations (status checking logic)
  - Type system (enum definition)

**Alternative Consideration:**
If ASNC must be renamed for governance reasons, recommend:
- Rename to: `POLICY_COMPILATION_ERROR` (more descriptive)
- Or: `SCHEMA_MISMATCH` (if that's the actual root cause)
- Or: Keep as `ASNC` but add comment explaining non-legacy meaning

**Current Recommendation:** KEEP AS-IS  
**Risk Level:** HIGH if changed  
**Effort if changed:** 8-12 hours (cascades across API, types, tests, docs)

---

### 3. Basis Set (5 instances)
**Current Status:** Only in cleanup plan documentation  
**Type:** Mathematical abstraction  
**Replacement Strategy:**
- "Input dimensions" → "Assessment inputs" or "Input factors"
- "Basis vector" → "Input variable" or "Input parameter"
- "Basis transformation" → "Input normalization"

**Risk Level:** LOW  
**Rationale:** Already removed from active codebase; only appears in plan docs  
**Effort:** 0.5 hours

---

### 4. Cognitive Mass (5 instances)
**Current Status:** Only in cleanup plan documentation  
**Type:** Academic interpretation framework  
**Replacement Strategy:**
- "Cognitive load" → "Operational clarity" or "Understandability"
- "Cognitive friction" → "Operational efficiency"
- "Interpretive overhead" → "Output complexity" or remove entirely

**Risk Level:** LOW  
**Rationale:** Non-operational terminology; only in planning docs  
**Effort:** 0.5 hours

---

### 5. Version Space (6 instances)
**Current Status:** Only in cleanup plan documentation  
**Type:** ML model-selection framework  
**Replacement Strategy:**
- "Version space" → "Policy selection space" or "Algorithm search space"
- "Hypothesis space" → "Policy variation space"
- "Version search" → "Policy optimization"

**Risk Level:** LOW  
**Rationale:** Not in active code; historical reference only  
**Effort:** 0.25 hours

---

### 6. Cognitive Attribution (0 instances)
**Status:** NOT FOUND in codebase  
**Recommendation:** No action needed

---

### 7. Projection Model (0 instances)
**Status:** NOT FOUND in codebase  
**Recommendation:** No action needed

---

## Risk Assessment by File

### CRITICAL RISK (Source Code — Core Types/APIs)
| File | Term | Instance Count | Impact | Effort | Recommendation |
|------|------|---|--------|--------|-----------------|
| packages/domain/types.ts | ASNC (enum) | 1 | Changes EvaluationStatus enum; cascades to 40+ files | 8-12h | **DO NOT CHANGE** (operational code) |
| src/app/api/v1/evaluate/route.ts | ASNC (API response) | 2 | Public API contract; affects clients | 4-6h | **DO NOT CHANGE** (external API) |
| src/app/api/v1/replay/route.ts | ASNC (API response) | 1 | Public API contract; affects clients | 2-3h | **DO NOT CHANGE** (external API) |

### MEDIUM RISK (Governance/Standards — Architectural Reference)
| File | Term | Instance Count | Impact | Effort | Recommendation |
|------|------|---|--------|--------|-----------------|
| docs/standards/API_STANDARD.md | ASNC | 2 | Documents API contract | 0.5h | IF changing ASNC: update spec |
| docs/standards/ARCHITECTURE_STANDARD.md | ASNC | 2 | References execution flow | 0.5h | IF changing ASNC: update flow |
| docs/adr/ADR-002-AST-Execution.md | ASNC | 6 | Historical record of design | 0.5h | Update if ASNC renamed |

### LOW RISK (Documentation — Planning/Governance)
| File | Term | Instance Count | Impact | Effort | Recommendation |
|------|------|---|--------|--------|-----------------|
| docs/TERMINOLOGY_CLEANUP_PLAN_V1.md | CAFM, Basis Set, Cognitive Mass, Version Space | 29+ | Meta-documentation | 0.5h | Can update; already documents cleanup |
| docs/LOCALIZATION_FREEZE_V1.md | CAFM | 2 | Context statements | 0.25h | Minor update OK |

---

## Execution Recommendation

### Phase 1: Documentation Cleanup (LOW RISK) ✓ RECOMMENDED
**Files:** docs/LOCALIZATION_FREEZE_V1.md, docs/TERMINOLOGY_CLEANUP_PLAN_V1.md  
**Changes:** Replace CAFM with "Income Stability Score™ Engine"  
**Effort:** 1 hour  
**Risk:** LOW  
**Blockers:** None  
**Status:** READY TO EXECUTE

### Phase 2: Standards Documentation (MEDIUM RISK) ✓ CONDITIONAL
**Files:** docs/standards/*.md, docs/adr/*.md  
**Changes:** Update references IF ASNC is being renamed; otherwise leave as-is  
**Effort:** 1-2 hours (only if Phase 3 proceeds)  
**Risk:** MEDIUM (affects external stakeholders reading standards)  
**Dependency:** Decision on ASNC (keep vs. rename)  
**Status:** HOLD pending ASNC decision

### Phase 3: Source Code Changes (CRITICAL RISK) ✗ NOT RECOMMENDED
**Files:** packages/domain/types.ts, src/app/api/v1/*.ts  
**Changes:** Rename ASNC enum and all references  
**Effort:** 8-12 hours  
**Risk:** HIGH (breaks API contracts, type safety, existing clients)  
**Database Impact:** Historical records contain ASNC status; migration required  
**Deprecation Path:** Would need API versioning, client notification, deprecation window  
**Status:** **ADVISE AGAINST** without explicit business justification

---

## Findings & Analysis

### What Was Already Cleaned
✓ Most legacy terminology already removed from active execution engine  
✓ Type system uses deterministic terminology  
✓ Policy execution is term-correct  
✓ Reason codes properly named  
✓ Governance framework properly documented

### What Remains
- **ASNC:** A necessary system status code (not a legacy abstraction)
- **Documentation:** Self-referential planning docs (low-risk to update)
- **Standards:** References to error states (low-risk to update)

### Key Insight
The "legacy terminology" identified in initial planning is mostly:
1. In the planning document itself (meta-discussion)
2. In governance standards that describe system behavior
3. Necessary operational codes (ASNC status)

**The codebase has largely already transitioned to enterprise terminology.**

---

## Recommendations Summary

| Phase | Action | Risk | Effort | Status |
|-------|--------|------|--------|--------|
| 1 | Update docs (CAFM → Engine) | LOW | 1h | ✓ READY |
| 2 | Update standards (conditional) | MEDIUM | 1-2h | ⏳ HOLD |
| 3 | Rename ASNC (avoid unless critical) | HIGH | 8-12h | ✗ ADVISE AGAINST |

**Recommended Next Step:** Execute Phase 1 (documentation cleanup).  
**Before Phase 3:** Obtain explicit business justification for API contract changes.

---

## Assumptions & Caveats

- Search excluded node_modules, build artifacts, legacy branches
- ASNC assumed to be operational status (not legacy concept)
- "Cognitive mass" and "basis set" assumed to be legacy abstractions (not active concepts)
- Risk ratings assume no external API versioning currently in place
- Database migration not assessed (would be required if ASNC renamed)

---

**Report Complete**  
*No files were modified during this analysis.*
