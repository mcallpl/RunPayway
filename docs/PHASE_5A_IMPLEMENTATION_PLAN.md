# Phase 5a Implementation Plan (CORRECTED)
## Core Evaluation Persistence — evaluations Table Only

**Date:** June 22, 2026  
**Status:** Corrected Per Audit (PHASE_5A_PLAN_AUDIT.md)  
**Scope:** Immutable evaluation record persistence, no policy registry, no audit ledger

---

## Executive Summary

Phase 5a focuses exclusively on **evaluations table persistence**. Policy registry and audit ledger are Phase 5b and 5c respectively.

Phase 5a deliverables:
- 1 table (evaluations)
- 1 repository (EvaluationRepository)
- 1 service (EvaluationPersistenceService)
- 1 file modified (evaluate endpoint)
- Strict evaluation-table-only scope

**Timeline:** ~2-3 business days (focused, single-table scope)

---

## Files to Create

### 1. Prisma Schema (`prisma/schema.prisma`)

**Purpose:** Define immutable evaluations table ONLY (no policy_versions, audit_events, policy_changes)

**Dependencies:** None (first artifact)

**Content Summary:**
- evaluations table (immutable, append-only)

**Key Constraints:**
- No UPDATE/DELETE allowed (enforced via CHECK constraints + triggers)
- PK: evaluation_id (UUID)
- FK: policy_id (UUID) only (points to policies table, created in Phase 5b)
- Immutability enforced

**Key Fields:**
```
evaluation_id (UUID, PK)
subject_id (string, indexed)
cohort_key (string, indexed)
policy_id (UUID, indexed)
policy_version (INTEGER) — reference, no FK yet (Phase 5b creates policy_versions table)
policy_hash (SHA-256)
evaluation_timestamp (nanosecond)
payload_hash (SHA-256)
result_hash (SHA-256)
classification (PASS|FAIL|REVIEW)
triggered_reason_codes (TEXT array)
violation_score (INTEGER)
audit_hash (SHA-256, placeholder/null for now)
created_at (timestamp)
```

**Lines of Code:** ~80 lines

---

### 2. Prisma Migration (`prisma/migrations/001_create_evaluations_table.sql`)

**Purpose:** Create evaluations table with immutability enforcement

**Dependencies:** Schema definition (1)

**Content Summary:**
- CREATE TABLE evaluations with indexes
- CREATE FUNCTION raise_immutability_error() for triggers
- CREATE TRIGGER immutability_evaluations

**Key Implementation Details:**
- Hash indexes for result_hash lookups
- Indexes on subject_id, cohort_key, evaluation_timestamp for queries
- Nanosecond timestamp precision
- No policy_versions or audit_events tables yet

**Lines of Code:** ~80 lines

---

### 3. Database Utilities (`src/lib/persistence/db-client.ts`)

**Purpose:** Centralized database client configuration and pool management

**Dependencies:** None (parallel with schema)

**Exports:**
- prisma: PrismaClient instance with logging
- withTransaction: Helper for transactional operations
- withErrorHandling: Wrapper for consistent error handling

**Key Properties:**
- Single Prisma instance (singleton pattern)
- Connection pooling configured
- Query logging in development
- Immutability enforcement at client level (no update/delete methods exported)

**Lines of Code:** ~80 lines

---

### 4. Hash Utilities (`src/lib/persistence/hash-utils.ts`)

**Purpose:** Payload and result hash computation (not audit chain yet)

**Dependencies:** Node crypto module

**Exports:**
- hashPayload(payload): CHAR(64)
- hashResult(result): CHAR(64)

**Implementation:**
- Uses Node crypto.createHash('sha256')
- Deterministic (same inputs → same hash)
- Phase 5c adds audit chain hashing

**Lines of Code:** ~40 lines

---

### 5. Evaluation Repository (`src/lib/persistence/evaluation-repository.ts`)

**Purpose:** Read/write interface for evaluation records (immutable append-only)

**Dependencies:** Database client (3), Hash utilities (4)

**Exports:**
```typescript
interface EvaluationRepository {
  // Write operations (append-only)
  create(evaluation: CreateEvaluationInput): Promise<Evaluation>
  
  // Read operations
  findById(evaluationId: string): Promise<Evaluation | null>
  findBySubjectId(subjectId: string, limit?: number): Promise<Evaluation[]>
  findByCohortKey(cohortKey: string, limit?: number): Promise<Evaluation[]>
}
```

**Implementation Details:**
- create() computes hashes before insert
- No update/delete methods (immutability)
- Stores evaluation records immutably
- No policy_version lookup (Phase 5b adds that)
- No audit logging (Phase 5c adds that)

**Lines of Code:** ~100 lines

---

### 6. Evaluation Persistence Service (`src/lib/persistence/evaluation-persistence.ts`)

**Purpose:** Persist evaluation to evaluations table (simple, single-table orchestration)

**Dependencies:** EvaluationRepository (5), Hash utilities (4)

**Exports:**
```typescript
interface EvaluationPersistenceService {
  persistEvaluation(
    payload: StructuredFinancialPayload,
    policyId: string,
    policyVersion: number,
    evaluationResult: EvaluationResult
  ): Promise<PersistedEvaluation>
}

interface PersistedEvaluation {
  evaluation_id: string
  created_at: string
}
```

**Implementation Details:**
- Accepts evaluation result from engine
- Computes payload_hash, result_hash
- Writes to evaluations table
- Returns evaluation_id
- No audit event creation (Phase 5c)
- No policy lookup (Phase 5b)
- Simple, focused, single-table operation

**Lines of Code:** ~80 lines

---

### 7. Integration Tests (`tests/persistence.test.ts`)

**Purpose:** Verify immutability, audit chain, replay capability, and determinism

**Dependencies:** All services (5-8), MVP engine

**Test Coverage:**
```
Evaluation Persistence:
  - Create evaluation → immutable record created
  - Multiple evaluations → all persisted
  - Audit event created for each
  - audit_hash computed and linked
  
Immutability:
  - UPDATE to evaluation_id fails ✗
  - DELETE from evaluations fails ✗
  - Direct SQL UPDATE blocked ✗
  
Policy Version Lifecycle:
  - Create DRAFT version
  - Approve → APPROVED
  - Activate → ACTIVE (prior deactivated)
  - Retire → RETIRED
  - Cannot modify ACTIVE without new version
  
Audit Chain:
  - audit_hash links to prior event
  - Chain integrity verified
  - Tampering detected
  
Replay:
  - Retrieve original evaluation + policy
  - Re-execute → same result hash
  - PASS determinism check
```

**Lines of Code:** ~300 lines

---

## Files to Modify

### 1. `src/app/api/v1/evaluate/route.ts`

**Purpose:** Integrate evaluation persistence into POST /api/v1/evaluate endpoint

**Changes:**
- Import EvaluationPersistenceService
- After successful policy execution:
  - Call persistEvaluation()
  - Return evaluation_id in response
- Handle persistence errors gracefully

**Current Behavior:** Returns immediate result only  
**New Behavior:** Persists result, returns evaluation_id

**Risk Level:** Low (simple addition, no API contract breaking)

**Lines Modified:** ~20 lines

---

### 2. `prisma/.env` (or `.env.local`)

**Purpose:** Database connection string configuration

**Changes:**
- Add/update DATABASE_URL pointing to PostgreSQL instance
- Format: `postgresql://user:password@host:port/dbname`

**Risk Level:** Low (configuration only, not code)

**Lines Modified:** 1 line

---

## Migration Order & Dependency Graph

```
┌──────────────────────────────────────────────────┐
│ Phase 5a Dependency Graph (Simplified)          │
└──────────────────────────────────────────────────┘

Step 1: Foundation (no dependencies)
├─ Prisma Schema (1) — evaluations table ONLY
│   └─ DATABASE_URL configured
│
Step 2: Database (depends on 1)
├─ Prisma Migration (2) — evaluations table
│   └─ Creates evaluations table, indexes, triggers
│   └─ Verifies immutability constraints
│
Step 3: Utilities (no DB dependencies)
├─ Database Client (3)
│   └─ Exports singleton PrismaClient
│
├─ Hash Utilities (4)
│   └─ Payload/result hash functions (no DB)
│
Step 4: Repository Layer (depends on 3, 4)
├─ Evaluation Repository (5)
│   └─ Depends on: DB Client (3), Hash Utils (4)
│   └─ Single-table read/write
│
Step 5: Service Layer (depends on 5)
├─ Evaluation Persistence Service (6)
│   └─ Depends on: Evaluation Repository (5)
│   └─ Simple single-table orchestration
│
Step 6: Endpoint Integration (depends on 6)
├─ Modify evaluate endpoint
│   └─ Depends on: Persistence Service (6)
│   └─ Add persistence call, return evaluation_id
│
Step 7: Testing & Verification (depends on all)
├─ Integration tests (7)
│   └─ Depends on: Services + endpoints
│
Step 8: Verification Gates
├─ Typecheck
├─ MVP tests
├─ Build
├─ Persistence tests
└─ Git clean
```

---

## Implementation Sequence

**Execution order (respects dependencies):**

1. **Day 1 Morning:**
   - Define Prisma schema — evaluations table ONLY (1)
   - Set DATABASE_URL in .env (2)

2. **Day 1 Afternoon:**
   - Generate migration from schema (2)
   - Verify evaluations table created
   - Test immutability constraints manually

3. **Day 2 Morning:**
   - Implement DB Client (3)
   - Implement Hash utilities (4)
   - Unit test hash computation

4. **Day 2 Afternoon:**
   - Implement Evaluation Repository (5)
   - Unit test queries (create, findById, findBySubjectId)
   - No policy or audit repository

5. **Day 3 Morning:**
   - Implement Evaluation Persistence Service (6)
   - Integration test: end-to-end persistence
   - Test immutability (UPDATE/DELETE fail)

6. **Day 3 Afternoon:**
   - Modify evaluate endpoint (integrate persistence)
   - Test API response includes evaluation_id
   - MVP test suite passes
   - No replay endpoint changes

7. **After Day 3:**
   - Write comprehensive integration tests (7)
   - Run all verification gates
   - Commit and await Phase 5b authorization

---

## Verification Checkpoints

### Checkpoint 1: Schema & Migration (Day 1)
**Gate:** evaluations table created without errors

**Verification:**
```bash
npx prisma migrate deploy
npx prisma db push --skip-generate
```

**Success Criteria:**
- evaluations table exists with immutability trigger
- All indexes created (subject_id, cohort_key, result_hash, evaluation_timestamp)
- No migration errors
- Only 1 table (evaluations) created in Phase 5a

---

### Checkpoint 2: Repository & Service (Day 2-3)
**Gate:** Typecheck + unit tests

**Verification:**
```bash
npm run typecheck
npm run test -- src/lib/persistence
```

**Success Criteria:**
- TypeScript: 0 errors
- Evaluation repository queries work (create, findById, findBySubjectId)
- Hash computation works (payload_hash, result_hash)
- No policy or audit repository created

---

### Checkpoint 3: Endpoint Integration (Day 3)
**Gate:** MVP tests + evaluate endpoint works

**Verification:**
```bash
npm run typecheck
npx vitest run tests/mvp.test.ts
npm run test -- tests/persistence.test.ts
```

**Success Criteria:**
- POST /api/v1/evaluate returns evaluation_id
- Evaluations persisted to database
- MVP engine tests still pass (no regression)
- No replay endpoint changes

---

### Checkpoint 4: Immutability & Build (End of Day 3)
**Gate:** Comprehensive tests + build success

**Verification:**
```bash
npx vitest run tests/persistence.test.ts
npm run build
git status --short
```

**Success Criteria:**
- Immutability tests pass (UPDATE/DELETE fail)
- Create evaluation works end-to-end
- Build succeeds
- All changes staged/committed
- No policy_versions or audit_events tables created

---

## Risk Assessment & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Prisma schema has syntax errors | Blocks all work | Review schema against PostgreSQL docs before deployment |
| Circular imports (repositories) | Build fails | Use factory pattern in DB client; never import repositories into each other |
| Nanosecond precision lost in ORM | Hash mismatch | Store as TIMESTAMP(6) in DB; use native SQL for hash chain computation |
| Immutability triggers fail | Data can be modified | Test triggers manually with direct SQL before application integration |
| Hash computation mismatch | Determinism fails | Implement both PostgreSQL and Node versions; unit test against known vectors |
| API contract breaks | External clients fail | Only add fields to response, never remove; maintain backward compatibility |
| Transaction failures on persist | Partial data | Use advisory locks; ensure all-or-nothing semantics |

---

## Success Criteria

Phase 5a is complete when:

1. ✓ **Schema:** Prisma schema defines evaluations table ONLY
2. ✓ **Migration:** evaluations table created with immutability enforced
3. ✓ **Repository:** EvaluationRepository works correctly (read/write)
4. ✓ **Service:** EvaluationPersistenceService persists to evaluations table
5. ✓ **API Integration:** evaluate endpoint uses persistent storage, returns evaluation_id
6. ✓ **Immutability:** Attempted UPDATE/DELETE fail with error
7. ✓ **No Policy Work:** policy_versions table NOT created
8. ✓ **No Audit Work:** audit_events table NOT created
9. ✓ **No Replay Changes:** replay endpoint NOT modified
10. ✓ **Tests:** Integration tests pass
11. ✓ **Verification Gates:**
    - npm run typecheck = 0 errors
    - npx vitest run tests/mvp.test.ts = all pass
    - npm run build = success
    - npx vitest run tests/persistence.test.ts = all pass
    - git status --short = clean

---

## Assumptions

1. **PostgreSQL 14+** available and configured
2. **Prisma** already installed (in package.json)
3. **Deterministic engine** (MVP) works and is frozen
4. **Database credentials** configured via DATABASE_URL
5. **Node crypto module** available (built-in)
6. **No concurrent transactions** policy needed for Phase 5a (add in Phase 5d)

---

## Next Steps

Upon approval:

1. Implement files 1-9 in order
2. Run verification checkpoints after each phase
3. Commit after each day's work
4. Phase 5b (Policy Registry) begins after Phase 5a succeeds

---

**This plan is frozen pending approval. Do not modify without explicit authorization.**
