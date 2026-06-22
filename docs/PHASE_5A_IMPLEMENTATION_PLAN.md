# Phase 5a Implementation Plan
## Evaluation Persistence Infrastructure

**Date:** June 22, 2026  
**Status:** Awaiting Approval  
**Scope:** Database schema, migrations, data access layer, persistence services, endpoint integration

---

## Executive Summary

Phase 5a establishes enterprise-grade immutable evaluation persistence. This plan details:
- 8 files to create (schema, migrations, services, tests)
- 3 files to modify (API endpoints, configuration)
- Strict dependency ordering to avoid circular imports
- Verification gates at each checkpoint

**Timeline:** ~5 business days (based on Implementation Roadmap Phases 5-7)

---

## Files to Create

### 1. Prisma Schema (`prisma/schema.prisma`)

**Purpose:** Define immutable evaluation, policy version, and audit event tables

**Dependencies:** None (first artifact)

**Content Summary:**
- evaluations table (immutable, append-only)
- policy_versions table (immutable, versioned)
- audit_events table (immutable, append-only)
- policy_changes table (governance tracking)
- Views: active_policies, evaluation_audit_trail, policy_history

**Key Constraints:**
- No UPDATE/DELETE allowed (enforced via CHECK constraints + triggers)
- Composite PK: policy_versions(policy_id, version)
- Composite FK: evaluations(policy_id, policy_version) → policy_versions
- Unique active version per policy_id

**Lines of Code:** ~250 lines

---

### 2. Prisma Migration (`prisma/migrations/001_create_persistence_tables.sql`)

**Purpose:** Generate initial database schema from Prisma schema

**Dependencies:** Schema definition (1)

**Content Summary:**
- CREATE TABLE evaluations with indexes
- CREATE TABLE policy_versions with unique active constraint
- CREATE TABLE audit_events with hash chain support
- CREATE TABLE policy_changes with audit linking
- CREATE FUNCTION raise_immutability_error() for triggers
- CREATE TRIGGER immutability_* for each table

**Key Implementation Details:**
- Hash indexes for result_hash and audit_hash lookups
- Composite indexes for performance (policy_id, policy_version)
- Nanosecond timestamp precision
- JSONB details column for audit flexibility

**Lines of Code:** ~200 lines

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

### 4. Audit Hash Utilities (`src/lib/persistence/audit-hash.ts`)

**Purpose:** Cryptographic hash chain computation matching PostgreSQL compute_audit_hash()

**Dependencies:** Database client (3), Node crypto module

**Exports:**
- computeAuditHash(prevAuditId, eventPayloadHash, timestamp, eventType): CHAR(64)
- verifyAuditHashChain(auditEvents): boolean
- hashPayload(payload): CHAR(64)
- hashResult(result): CHAR(64)

**Implementation:**
- Uses Node crypto.createHash('sha256')
- Matches PostgreSQL SHA256 formula exactly
- Deterministic (same inputs → same hash)
- Can verify chain offline

**Lines of Code:** ~120 lines

---

### 5. Evaluation Repository (`src/lib/persistence/evaluation-repository.ts`)

**Purpose:** Read/write interface for evaluation records (immutable append-only)

**Dependencies:** Database client (3), Audit hash utilities (4)

**Exports:**
```typescript
interface EvaluationRepository {
  // Write operations (append-only)
  create(evaluation: CreateEvaluationInput): Promise<Evaluation>
  
  // Read operations
  findById(evaluationId: string): Promise<Evaluation | null>
  findBySubjectId(subjectId: string, limit?: number): Promise<Evaluation[]>
  findByCohortKey(cohortKey: string, limit?: number): Promise<Evaluation[]>
  findByPolicyId(policyId: string, version?: number): Promise<Evaluation[]>
  
  // Replay support
  findByEvaluationIdForReplay(evaluationId: string): Promise<EvaluationWithPolicy | null>
}
```

**Implementation Details:**
- create() computes hashes before insert
- No update/delete methods (immutability)
- Transactions for consistency
- Index-aware query construction

**Lines of Code:** ~180 lines

---

### 6. Policy Version Repository (`src/lib/persistence/policy-version-repository.ts`)

**Purpose:** Versioned, immutable policy storage with lifecycle state machine

**Dependencies:** Database client (3)

**Exports:**
```typescript
interface PolicyVersionRepository {
  // Write operations (create versions only, never update)
  createVersion(policy: CreatePolicyVersionInput): Promise<PolicyVersion>
  
  // Lifecycle transitions
  approve(policyId: string, version: number): Promise<PolicyVersion>
  activate(policyId: string, version: number): Promise<PolicyVersion>  // Deactivates prior
  retire(policyId: string, version: number): Promise<PolicyVersion>
  
  // Read operations
  findByCompositeKey(policyId: string, version: number): Promise<PolicyVersion | null>
  findActive(policyId: string): Promise<PolicyVersion | null>
  findByStatus(status: PolicyStatus): Promise<PolicyVersion[]>
  listVersions(policyId: string): Promise<PolicyVersion[]>
}
```

**Implementation Details:**
- create() only allows DRAFT status
- No direct updates to source_definition
- Unique active version enforced at DB level + app level
- Composite key queries for historical lookups

**Lines of Code:** ~160 lines

---

### 7. Audit Event Repository (`src/lib/persistence/audit-event-repository.ts`)

**Purpose:** Append-only audit trail with cryptographic chain integrity

**Dependencies:** Database client (3), Audit hash utilities (4)

**Exports:**
```typescript
interface AuditEventRepository {
  // Write operations (append-only)
  create(event: CreateAuditEventInput): Promise<AuditEvent>
  
  // Read operations
  findByEvaluationId(evaluationId: string): Promise<AuditEvent[]>
  findBySubjectId(subjectId: string, limit?: number): Promise<AuditEvent[]>
  findByActorId(actorId: string): Promise<AuditEvent[]>
  findByEventType(eventType: string): Promise<AuditEvent[]>
  
  // Verification
  verifyChainIntegrity(startFromAuditId?: string): Promise<boolean>
}
```

**Implementation Details:**
- create() computes audit_hash as SHA256(priorAuditId + eventPayload)
- Fetches prior event's audit_id for chain computation
- Stores references (hashes, IDs) not full duplicated data
- Chain verification as separate read operation

**Lines of Code:** ~170 lines

---

### 8. Evaluation Persistence Service (`src/lib/persistence/evaluation-persistence.ts`)

**Purpose:** Orchestrate evaluation creation with coordinated persistence across tables

**Dependencies:** All repositories (5, 6, 7), Audit hash utilities (4)

**Exports:**
```typescript
interface EvaluationPersistenceService {
  persistEvaluation(
    payload: StructuredFinancialPayload,
    policyId: string,
    evaluationResult: EvaluationResult
  ): Promise<PersistedEvaluation>
}

interface PersistedEvaluation {
  evaluation_id: string
  audit_hash: string
  created_at: string
}
```

**Implementation Details:**
- Orchestrates: Evaluation insert → Audit event insert → Chain verification
- Transactional: all or nothing
- Computes hashes in application (matches DB functions)
- Returns evaluation_id + audit_hash for immediate API response
- Audit hash enables later chain verification

**Lines of Code:** ~150 lines

---

### 9. Integration Tests (`tests/persistence.test.ts`)

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
  - Log audit event
  - Return evaluation_id + audit_hash in response
- Handle persistence errors gracefully

**Current Behavior:** Returns immediate result only  
**New Behavior:** Persists result, returns evaluation_id + audit_hash

**Risk Level:** Medium (API contract change, but documented in ENTERPRISE_PLATFORM_ARCHITECTURE_V1.md)

**Lines Modified:** ~40 lines

---

### 2. `src/app/api/v1/replay/route.ts`

**Purpose:** Integrate replay payload/policy lookup from persistent storage

**Changes:**
- Import EvaluationRepository, PolicyVersionRepository
- Accept evaluation_id parameter
- Query: evaluations table via composite key (policy_id, policy_version)
- Retrieve original policy from policy_versions table
- Re-execute policy
- Log EVALUATION_REPLAYED audit event
- Return result comparison

**Current Behavior:** (May not exist or work without persistence)  
**New Behavior:** Full determinism verification via persistent record

**Risk Level:** Medium (new/extended functionality)

**Lines Modified:** ~50 lines

---

### 3. `prisma/.env` (or `.env.local`)

**Purpose:** Database connection string configuration

**Changes:**
- Add/update DATABASE_URL pointing to PostgreSQL instance
- Format: `postgresql://user:password@host:port/dbname`

**Risk Level:** Low (configuration only, not code)

**Lines Modified:** 1 line

---

## Migration Order & Dependency Graph

```
┌─────────────────────────────────────────────────┐
│ Phase 5a Implementation Dependency Graph       │
└─────────────────────────────────────────────────┘

Step 1: Foundation (no dependencies)
├─ Prisma Schema (1)
│   └─ DATABASE_URL configured
│
Step 2: Database (depends on 1)
├─ Prisma Migration (2)
│   └─ Creates all tables, indexes, triggers
│   └─ Verifies immutability constraints
│
Step 3: Client & Utilities (parallel)
├─ Database Client (3)
│   └─ Exports singleton PrismaClient
│
├─ Audit Hash Utilities (4)
│   └─ Crypto functions (no DB calls)
│
Step 4: Repositories (depend on 3, 4)
├─ Evaluation Repository (5)
│   └─ Depends on: DB Client (3), Audit Hash (4)
│
├─ Policy Version Repository (6)
│   └─ Depends on: DB Client (3)
│
├─ Audit Event Repository (7)
│   └─ Depends on: DB Client (3), Audit Hash (4)
│
Step 5: Service Layer (depends on 3, 4, 5, 6, 7)
├─ Evaluation Persistence Service (8)
│   └─ Depends on: All repositories (5, 6, 7)
│   └─ Orchestrates: Evaluation + Audit + Hash chain
│
Step 6: Endpoint Integration (depends on 8)
├─ Modify evaluate endpoint (API change)
│   └─ Depends on: Persistence Service (8)
│
├─ Modify replay endpoint (API change)
│   └─ Depends on: Evaluation + Policy repos (5, 6)
│
Step 7: Testing & Verification (depends on all)
├─ Integration tests (9)
│   └─ Depends on: All services + endpoints
│
Step 8: Verification Gates
├─ Typecheck
├─ MVP tests
├─ Build
├─ Persistence tests
├─ Replay validation
└─ Git clean
```

---

## Implementation Sequence

**Execution order (respects dependencies):**

1. **Day 1 Morning:**
   - Define Prisma schema (1)
   - Set DATABASE_URL (3)

2. **Day 1 Afternoon:**
   - Generate migration from schema (2)
   - Verify DB tables created
   - Test immutability constraints manually

3. **Day 2 Morning:**
   - Implement DB Client (3)
   - Implement Audit Hash utilities (4)
   - Unit test hash computation

4. **Day 2 Afternoon:**
   - Implement Evaluation Repository (5)
   - Implement Policy Version Repository (6)
   - Unit test queries

5. **Day 3 Morning:**
   - Implement Audit Event Repository (7)
   - Test chain computation
   - Verify chain linkage

6. **Day 3 Afternoon:**
   - Implement Evaluation Persistence Service (8)
   - Integration test: end-to-end persistence
   - Test audit chain integrity

7. **Day 4 Morning:**
   - Modify evaluate endpoint (integrate persistence)
   - Test API response includes evaluation_id + audit_hash
   - MVP test suite passes

8. **Day 4 Afternoon:**
   - Modify replay endpoint (query persistent policy)
   - Test determinism verification
   - Replay validation passes

9. **Day 5:**
   - Write comprehensive integration tests (9)
   - Run all verification gates
   - Commit and prepare Phase 5b

---

## Verification Checkpoints

### Checkpoint 1: Schema & Migration (Day 1)
**Gate:** Database tables created without errors

**Verification:**
```bash
npx prisma migrate deploy
npx prisma db push --skip-generate
```

**Success Criteria:**
- evaluations table exists with immutability trigger
- policy_versions table has unique active version index
- audit_events table has chain support
- All indexes created
- No migration errors

---

### Checkpoint 2: Repositories & Services (Day 3)
**Gate:** Typecheck + unit tests

**Verification:**
```bash
npm run typecheck
npm run test -- src/lib/persistence
```

**Success Criteria:**
- TypeScript: 0 errors
- Evaluation repository queries work
- Audit hash computation matches PostgreSQL formula
- Policy version lifecycle transitions work

---

### Checkpoint 3: Endpoint Integration (Day 4)
**Gate:** MVP tests + evaluate/replay endpoints work

**Verification:**
```bash
npm run typecheck
npx vitest run tests/mvp.test.ts
npm run test -- tests/persistence.test.ts
```

**Success Criteria:**
- POST /api/v1/evaluate returns evaluation_id + audit_hash
- Response includes all audit fields
- MVP engine tests still pass (no regression)
- Replay returns correct policy version

---

### Checkpoint 4: Persistence Tests (Day 5)
**Gate:** Comprehensive integration tests pass

**Verification:**
```bash
npx vitest run tests/persistence.test.ts
npm run build
git status --short
```

**Success Criteria:**
- Immutability tests pass (UPDATE/DELETE fail)
- Audit chain integrity verified
- Replay determinism verified
- Build succeeds
- All changes staged/committed

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

1. ✓ **Schema:** Prisma schema defines all 4 tables with constraints
2. ✓ **Migration:** Database tables created with immutability enforced
3. ✓ **Repositories:** All 3 repositories (Evaluation, Policy, Audit) work correctly
4. ✓ **Services:** EvaluationPersistenceService orchestrates end-to-end
5. ✓ **API Integration:** evaluate + replay endpoints use persistent storage
6. ✓ **Immutability:** Attempted UPDATE/DELETE fail with error
7. ✓ **Audit Chain:** audit_hash links to prior event, chain verifiable
8. ✓ **Replay:** Original policy retrieved via composite key, re-execution deterministic
9. ✓ **Tests:** All integration tests pass
10. ✓ **Verification Gates:**
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
