# Phase 5b Implementation Plan
## Policy Registry Persistence — policies & policy_versions Tables

**Date:** June 22, 2026  
**Status:** Planning (Phase 5a must complete first)  
**Scope:** Immutable policy versioning, composite key support, read-only lookup

---

## Executive Summary

Phase 5b adds enterprise policy registry to the persistent evaluations layer. This plan details:
- 2 tables (policies metadata, policy_versions versioned)
- 1 repository (PolicyRepository — read-only operations)
- 1 service (PolicyLookupService — for evaluate endpoint)
- 1 file modified (evaluate endpoint — use persistent policy lookup)
- No governance workflow yet (deferred to Phase 6a/6b)

**Timeline:** ~2-3 business days (focused scope)

**Depends On:** Phase 5a evaluations table (must exist first)

---

## Files to Create

### 1. Prisma Schema Updates (`prisma/schema.prisma`)

**Purpose:** Add policies and policy_versions tables

**Dependencies:** Phase 5a evaluations table (FK reference)

**Content Summary:**
- policies table (metadata, immutable)
- policy_versions table (versioned, immutable)

**Key Constraints:**
- No UPDATE/DELETE allowed
- Composite PK: policy_versions(policy_id, version)
- Unique active version per policy_id (index)
- FK: policy_versions.policy_id → policies.policy_id
- FK: evaluations.policy_id + evaluations.policy_version → policy_versions(policy_id, version)

**Key Fields — policies:**
```
policy_id (UUID, PK)
name (VARCHAR, UNIQUE)
description (TEXT, optional)
policy_type (VARCHAR, e.g., 'INCOME_STABILITY')
created_at (timestamp, immutable)
created_by (VARCHAR, optional)
```

**Key Fields — policy_versions:**
```
policy_id (UUID)
version (INTEGER)
status (VARCHAR: DRAFT|APPROVED|ACTIVE|RETIRED)
source_definition (TEXT, DSL/JSON)
compiled_hash (SHA-256)
effective_date (DATE, optional)
created_at (timestamp, immutable)
created_by (VARCHAR)
approved_at (timestamp, optional, Phase 6a)
approved_by (VARCHAR, optional, Phase 6a)
```

**Lines of Code:** ~120 lines

---

### 2. Prisma Migration (`prisma/migrations/002_create_policy_tables.sql`)

**Purpose:** Create policies and policy_versions tables

**Dependencies:** Migration 001 (evaluations table)

**Content Summary:**
- CREATE TABLE policies
- CREATE TABLE policy_versions
- CREATE UNIQUE INDEX for active version
- CREATE FUNCTION raise_immutability_error() (if not exists)
- CREATE TRIGGER immutability_policy_versions

**Key Implementation Details:**
- Composite indexes for queries (policy_id, version)
- Index on status for active version lookup
- Nanosecond timestamp precision
- Foreign key from evaluations table

**Lines of Code:** ~100 lines

---

### 3. Policy Repository (`src/lib/persistence/policy-repository.ts`)

**Purpose:** Read-only interface for policy queries (no lifecycle transitions yet)

**Dependencies:** Database client (Phase 5a)

**Exports:**
```typescript
interface PolicyRepository {
  // Composite key lookup (for replay)
  findByCompositeKey(
    policyId: string, 
    version: number
  ): Promise<PolicyVersion | null>
  
  // Active policy lookup (for new evaluations)
  findActive(policyId: string): Promise<PolicyVersion | null>
  
  // List all versions of a policy
  listVersions(policyId: string): Promise<PolicyVersion[]>
  
  // Metadata lookup
  findPolicyById(policyId: string): Promise<Policy | null>
}
```

**Implementation Details:**
- Composite key queries for historical lookups
- Index-aware query construction
- No write methods (create/update/delete deferred)
- Determinism support: exact policy version retrieval

**Lines of Code:** ~120 lines

---

### 4. Policy Lookup Service (`src/lib/persistence/policy-lookup.ts`)

**Purpose:** Service for policy resolution in evaluate flow

**Dependencies:** PolicyRepository (3)

**Exports:**
```typescript
interface PolicyLookupService {
  // Get active policy for evaluations
  getActivePolicyForEvaluation(policyId: string): Promise<PolicyVersion>
  
  // Get specific policy version for replay
  getPolicyForReplay(policyId: string, version: number): Promise<PolicyVersion>
}
```

**Implementation Details:**
- Caches active policy lookup (Phase 5d optimization)
- Composite key queries for exact version
- Error handling for missing policies
- No lifecycle state changes

**Lines of Code:** ~80 lines

---

### 5. Integration Tests (`tests/policy-persistence.test.ts`)

**Purpose:** Verify policy table operations and composite key lookups

**Dependencies:** All services above

**Test Coverage:**
```
Policy Creation (Phase 6a work, manual seed for now):
  - Policies table structure
  - policy_versions table structure
  - Composite key uniqueness
  
Policy Lookup:
  - Find by composite key (policy_id, version)
  - Find active policy
  - List versions
  - Query performance
  
Immutability:
  - UPDATE to policy fails ✗
  - DELETE from policy_versions fails ✗
  
Determinism:
  - Same composite key → same policy version
  - Version never changes once created
  
Integration:
  - Evaluation FK references policy (when Phase 5a and 5b integrated)
```

**Lines of Code:** ~200 lines

---

## Files to Modify

### 1. `src/app/api/v1/evaluate/route.ts`

**Purpose:** Replace hardcoded policy with persistent policy lookup

**Changes:**
- Import PolicyLookupService
- Replace static policy with: `getActivePolicyForEvaluation(policyId)`
- Use looked-up policy_version in evaluation record
- No other endpoint behavior changes

**Current Behavior:** Uses in-memory hardcoded policy  
**New Behavior:** Queries policy_versions table for active policy

**Risk Level:** Low (simple lookup substitution)

**Lines Modified:** ~15 lines

---

### 2. `prisma/.env`

**Purpose:** Ensure DATABASE_URL still set (no change needed)

**Risk Level:** None (already configured in Phase 5a)

---

## Migration Order & Dependency Graph

```
┌────────────────────────────────────────────────┐
│ Phase 5b Dependency Graph                      │
└────────────────────────────────────────────────┘

Prerequisite: Phase 5a evaluations table exists

Step 1: Schema Update (no dependencies)
├─ Prisma Schema (1) — add policies + policy_versions
│
Step 2: Database (depends on 1)
├─ Prisma Migration 002 (2) — create policy tables
│   └─ Adds policies and policy_versions tables
│   └─ Adds composite FK to evaluations
│
Step 3: Repository (depends on 2)
├─ Policy Repository (3)
│   └─ Read-only queries only
│   └─ Composite key lookups
│
Step 4: Service (depends on 3)
├─ Policy Lookup Service (4)
│   └─ Wraps repository for evaluate flow
│
Step 5: Endpoint Integration (depends on 4)
├─ Modify evaluate endpoint
│   └─ Replace hardcoded policy with PolicyLookupService
│
Step 6: Testing (depends on all)
├─ Integration tests (5)
│   └─ Policy lookup, composite key, immutability
│
Step 7: Verification Gates
├─ Typecheck
├─ MVP tests
├─ Build
├─ Policy tests
└─ Git clean
```

---

## Implementation Sequence

**Execution order (respects dependencies):**

1. **Day 1 Morning:**
   - Update Prisma schema — add policies + policy_versions tables (1)
   - Verify composite key structure

2. **Day 1 Afternoon:**
   - Generate migration from schema (2)
   - Verify policy tables created
   - Test composite key constraints

3. **Day 2 Morning:**
   - Implement Policy Repository (3)
   - Unit test composite key queries
   - Unit test active policy lookup

4. **Day 2 Afternoon:**
   - Implement Policy Lookup Service (4)
   - Integration test: policy queries work end-to-end
   - No lifecycle transitions yet

5. **Day 3 Morning:**
   - Modify evaluate endpoint (use PolicyLookupService)
   - Test policy_version reference in evaluation records
   - MVP tests pass

6. **Day 3 Afternoon:**
   - Write integration tests (5)
   - Run verification gates
   - Commit and await Phase 5c authorization

---

## Verification Checkpoints

### Checkpoint 1: Schema & Migration (Day 1)
**Gate:** Policy tables created without errors

**Verification:**
```bash
npx prisma migrate deploy
npx prisma db push --skip-generate
```

**Success Criteria:**
- policies table exists
- policy_versions table exists with composite PK
- Unique active version constraint created
- FK from policy_versions to policies
- No errors

---

### Checkpoint 2: Repository (Day 2)
**Gate:** Typecheck + policy queries work

**Verification:**
```bash
npm run typecheck
npm run test -- src/lib/persistence/policy-repository.test.ts
```

**Success Criteria:**
- TypeScript: 0 errors
- Composite key queries work
- Active policy lookup works
- No write methods created yet

---

### Checkpoint 3: Endpoint Integration (Day 3)
**Gate:** Evaluate endpoint uses persistent policies

**Verification:**
```bash
npm run typecheck
npx vitest run tests/mvp.test.ts
npm run test -- tests/policy-persistence.test.ts
```

**Success Criteria:**
- Evaluate endpoint uses PolicyLookupService
- Evaluations reference policy_version from database
- MVP tests pass
- Policy lookups work

---

### Checkpoint 4: Build & Verification (End of Day 3)
**Gate:** Full build success

**Verification:**
```bash
npm run build
git status --short
```

**Success Criteria:**
- Build succeeds
- All changes committed
- No governance/lifecycle work included
- Ready for Phase 5c

---

## Success Criteria

Phase 5b is complete when:

1. ✓ **Schema:** policies and policy_versions tables created
2. ✓ **Composite Key:** (policy_id, version) uniqueness enforced
3. ✓ **Repository:** PolicyRepository works (read-only)
4. ✓ **Service:** PolicyLookupService resolves policies
5. ✓ **Endpoint:** Evaluate uses persistent policy lookup
6. ✓ **Immutability:** UPDATE/DELETE fail on policy tables
7. ✓ **Composite Keys:** Replay can retrieve exact policy version
8. ✓ **No Governance:** No lifecycle transitions (approve/activate/retire)
9. ✓ **Tests:** All policy persistence tests pass
10. ✓ **Verification Gates:**
    - npm run typecheck = 0 errors
    - npx vitest run tests/mvp.test.ts = all pass
    - npm run build = success
    - npx vitest run tests/policy-persistence.test.ts = all pass
    - git status --short = clean

---

## What Phase 5b Does NOT Include

- ❌ Policy creation endpoints
- ❌ Policy approval workflow
- ❌ Policy activation/retirement
- ❌ Governance state machine
- ❌ Audit logging (Phase 5c)
- ❌ RBAC enforcement (Phase 6c)

These are Phase 5c, 6a, 6b, and 6c work respectively.

---

## Assumptions

1. Phase 5a (evaluations table) is complete and working
2. PostgreSQL 14+ available with composite key support
3. Prisma schema editor supports composite primary keys
4. Manual policy seeding for testing (governance workflow in Phase 6)

---

## Next Phase

Upon Phase 5b completion:
- Phase 5c: Audit ledger (audit_events table, replay endpoint, chain hashing)
- Phase 5d: Load testing and integration validation
- Phase 6a/6b: Governance layer (approval workflow, lifecycle transitions)

---

**This plan is frozen pending Phase 5a completion and audit approval.**
