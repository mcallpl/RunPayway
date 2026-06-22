# Phase 5c Implementation Plan
## Audit Ledger Persistence — audit_events Table & Replay Endpoint

**Date:** June 22, 2026  
**Status:** Planning (Phase 5b must complete first)  
**Scope:** Append-only audit trail, cryptographic hash chain, replay validation

---

## Executive Summary

Phase 5c adds institutional audit infrastructure with determinism verification. This plan details:
- 1 table (audit_events append-only)
- 2 repositories (AuditEventRepository, enhanced EvaluationRepository for replay)
- 2 services (AuditService, ReplayService)
- 2 endpoints modified (evaluate endpoint adds audit logging, replay endpoint implements determinism verification)
- Hash chain integrity for tamper detection

**Timeline:** ~2-3 business days

**Depends On:** Phase 5a (evaluations table) + Phase 5b (policy_versions table) both complete

---

## Files to Create

### 1. Prisma Schema Updates (`prisma/schema.prisma`)

**Purpose:** Add audit_events table

**Dependencies:** Phase 5a + 5b (evaluations, policy_versions tables exist)

**Content Summary:**
- audit_events table (append-only, immutable)

**Key Constraints:**
- No UPDATE/DELETE allowed
- PK: audit_id (UUID)
- Indexes on event_type, subject_id, actor_id, event_timestamp

**Key Fields:**
```
audit_id (UUID, PK)
event_type (VARCHAR: EVALUATION_CREATED|EVALUATION_REPLAYED|POLICY_APPROVED|...)
event_timestamp (TIMESTAMP(6) with TZ, nanosecond precision)
created_at (timestamp, immutable)
actor_id (VARCHAR, optional, user/system principal)
subject_type (VARCHAR: evaluation|policy|user)
subject_id (VARCHAR, evaluation_id or policy_id)
details (JSONB, flexible event data)
audit_hash (CHAR(64), SHA-256 chain link)
```

**Lines of Code:** ~60 lines

---

### 2. Prisma Migration (`prisma/migrations/003_create_audit_events_table.sql`)

**Purpose:** Create audit_events table with immutability and chain support

**Dependencies:** Migrations 001 + 002 (evaluations and policy tables exist)

**Content Summary:**
- CREATE TABLE audit_events
- CREATE FUNCTION raise_immutability_error() (if not exists)
- CREATE TRIGGER immutability_audit_events
- CREATE INDEXES on event_type, subject_id, actor_id, event_timestamp, audit_hash

**Key Implementation Details:**
- Hash indexes for audit_hash lookups
- Compound indexes for common queries
- JSONB column for flexible event data
- Nanosecond timestamp precision

**Lines of Code:** ~80 lines

---

### 3. Audit Hash Utilities (`src/lib/persistence/audit-hash-utils.ts`)

**Purpose:** Cryptographic hash chain computation for audit events

**Dependencies:** Node crypto module, no DB calls yet

**Exports:**
```typescript
interface AuditHashUtils {
  // Compute audit_hash with chain link
  computeAuditHash(
    priorAuditId: string | null,
    eventPayload: object,
    eventTimestamp: Date,
    eventType: string
  ): Promise<string>  // SHA-256
  
  // Verify chain integrity offline
  verifyChain(
    auditEvents: AuditEvent[]
  ): boolean
  
  // Hash event payload
  hashEventPayload(payload: object): string
}
```

**Implementation:**
- Uses Node crypto.createHash('sha256')
- Matches PostgreSQL compute_audit_hash() formula exactly
- Formula: SHA256(priorAuditId + eventPayloadHash + timestamp_epoch + eventType)
- Deterministic (same inputs → same hash)

**Lines of Code:** ~100 lines

---

### 4. Audit Event Repository (`src/lib/persistence/audit-event-repository.ts`)

**Purpose:** Append-only audit event persistence and queries

**Dependencies:** Database client (Phase 5a), Audit hash utilities (3)

**Exports:**
```typescript
interface AuditEventRepository {
  // Write operations (append-only)
  create(event: CreateAuditEventInput): Promise<AuditEvent>
  
  // Read operations
  findByEvaluationId(evaluationId: string): Promise<AuditEvent[]>
  findByPolicyId(policyId: string): Promise<AuditEvent[]>
  findByActorId(actorId: string): Promise<AuditEvent[]>
  findByEventType(eventType: string): Promise<AuditEvent[]>
  
  // Verification
  getPriorEvent(beforeAuditId: string): Promise<AuditEvent | null>
  verifyChainFrom(startAuditId: string): Promise<boolean>
}
```

**Implementation Details:**
- create() computes audit_hash linking to prior event
- Fetches prior event's audit_id for chain computation
- Stores references (hashes, classifications) not full duplicated data
- No update/delete methods (immutability)

**Lines of Code:** ~150 lines

---

### 5. Replay Service (`src/lib/persistence/replay-service.ts`)

**Purpose:** Determinism verification through evaluation replay

**Dependencies:** EvaluationRepository, PolicyRepository (Phase 5a/5b), AuditEventRepository (4)

**Exports:**
```typescript
interface ReplayService {
  replayEvaluation(evaluationId: string): Promise<ReplayResult>
}

interface ReplayResult {
  evaluation_id: string
  original_result_hash: string
  replay_result_hash: string
  match: boolean  // true = deterministic
  replay_timestamp: string
  discrepancies?: string[]
}
```

**Implementation Details:**
1. Query evaluations table by evaluation_id
2. Extract: policy_id + policy_version
3. Query policy_versions table (composite key)
4. Get original payload_hash from evaluations
5. Re-execute policy against original payload
6. Compare result hashes
7. Log EVALUATION_REPLAYED audit event
8. Return match status

**Determinism Guarantee:**
- Same policy version + same payload → same result (always)
- Composite key ensures exact policy version used
- Hash comparison proves consistency

**Lines of Code:** ~120 lines

---

### 6. Audit Service (`src/lib/persistence/audit-service.ts`)

**Purpose:** Coordinate audit event creation and chain integrity

**Dependencies:** AuditEventRepository (4), Audit hash utilities (3)

**Exports:**
```typescript
interface AuditService {
  // Log evaluation creation
  logEvaluationCreated(
    evaluationId: string,
    payload: object,
    policy: object
  ): Promise<AuditEvent>
  
  // Log evaluation replay
  logEvaluationReplayed(
    evaluationId: string,
    replayResult: ReplayResult
  ): Promise<AuditEvent>
  
  // Verify chain integrity
  verifyChainIntegrity(): Promise<{
    valid: boolean
    errors?: string[]
  }>
}
```

**Implementation Details:**
- Wraps AuditEventRepository
- Computes audit_hash during create()
- Ensures all audit events logged
- Chain verification as separate operation

**Lines of Code:** ~100 lines

---

### 7. Integration Tests (`tests/audit-persistence.test.ts`)

**Purpose:** Verify audit table operations, chain integrity, and replay

**Dependencies:** All services above

**Test Coverage:**
```
Audit Event Creation:
  - Create event → immutable record created
  - Each event gets audit_hash computed
  - Chain links to prior event
  
Immutability:
  - UPDATE to audit_events fails ✗
  - DELETE from audit_events fails ✗
  
Chain Integrity:
  - audit_hash links to prior event.audit_id
  - Chain verifiable offline
  - Tampering detected
  
Replay Functionality:
  - Retrieve evaluation by ID
  - Get exact policy version via composite key
  - Re-execute → same result hash (PASS)
  - Log EVALUATION_REPLAYED audit event
  
Determinism:
  - Same input + policy → same result (always)
  - Result hash immutable
  - Replay proves consistency
```

**Lines of Code:** ~250 lines

---

## Files to Modify

### 1. `src/app/api/v1/evaluate/route.ts`

**Purpose:** Log EVALUATION_CREATED audit event

**Changes:**
- Import AuditService
- After persisting evaluation:
  - Call auditService.logEvaluationCreated()
  - Store returned audit_hash in evaluation record
  - Return audit_hash in response

**Current Behavior:** Persists evaluation, returns evaluation_id  
**New Behavior:** Also logs audit event, returns audit_hash

**Note:** Requires coordination between Evaluation and Audit services

**Risk Level:** Medium (transaction safety required)

**Lines Modified:** ~20 lines

---

### 2. `src/app/api/v1/replay/route.ts`

**Purpose:** Implement replay endpoint with determinism verification

**Changes:**
- Accept evaluation_id parameter
- Import ReplayService
- Call replayService.replayEvaluation(evaluationId)
- Return match status and result comparison
- Log EVALUATION_REPLAYED audit event

**Current Behavior:** May not exist or be stubbed  
**New Behavior:** Full determinism verification

**Response:**
```json
{
  "evaluation_id": "uuid",
  "match": true,
  "original_result_hash": "sha256",
  "replay_result_hash": "sha256",
  "replay_timestamp": "iso8601"
}
```

**Risk Level:** Medium (full endpoint implementation)

**Lines Modified:** ~50 lines

---

### 3. `src/lib/persistence/evaluation-persistence.ts`

**Purpose:** Enhanced to coordinate with audit events

**Changes:**
- Add optional auditService parameter
- After persisting evaluation, call auditService
- Store audit_hash returned from audit service
- Update evaluation record with audit_hash

**Note:** Phase 5a version didn't do this; Phase 5c extends it

**Risk Level:** Low (additive, no breaking changes)

**Lines Modified:** ~15 lines

---

## Migration Order & Dependency Graph

```
┌──────────────────────────────────────────────┐
│ Phase 5c Dependency Graph                    │
└──────────────────────────────────────────────┘

Prerequisites:
  - Phase 5a evaluations table
  - Phase 5b policy_versions table

Step 1: Schema Update (no dependencies)
├─ Prisma Schema (1) — add audit_events
│
Step 2: Database (depends on 1)
├─ Prisma Migration 003 (2) — create audit_events
│   └─ Adds audit_events table, indexes
│
Step 3: Utilities (no DB dependencies)
├─ Audit Hash Utilities (3)
│   └─ Crypto functions for chain computation
│
Step 4: Repository (depends on 2, 3)
├─ Audit Event Repository (4)
│   └─ Append-only read/write operations
│
Step 5: Services (depends on 4, Phase 5a/5b)
├─ Replay Service (5)
│   └─ Determinism verification
│
├─ Audit Service (6)
│   └─ Event logging coordination
│
Step 6: Endpoint Integration (depends on 5, 6)
├─ Modify evaluate endpoint
│   └─ Add audit logging
│
├─ Modify replay endpoint
│   └─ Implement determinism verification
│
Step 7: Testing (depends on all)
├─ Integration tests (7)
│   └─ Audit, chain, replay functionality
│
Step 8: Verification Gates
├─ Typecheck
├─ MVP tests
├─ Build
├─ Audit tests
└─ Git clean
```

---

## Implementation Sequence

**Execution order (respects dependencies):**

1. **Day 1 Morning:**
   - Update Prisma schema — add audit_events table (1)
   - Verify table structure

2. **Day 1 Afternoon:**
   - Generate migration from schema (2)
   - Verify audit_events table created
   - Test immutability constraints

3. **Day 2 Morning:**
   - Implement Audit Hash Utilities (3)
   - Unit test hash computation and chain
   - Verify formula matches PostgreSQL compute_audit_hash()

4. **Day 2 Afternoon:**
   - Implement Audit Event Repository (4)
   - Unit test create, query operations
   - Unit test chain linkage

5. **Day 3 Morning:**
   - Implement Replay Service (5)
   - Implement Audit Service (6)
   - Integration test: replay works end-to-end

6. **Day 3 Afternoon:**
   - Modify evaluate endpoint (audit logging)
   - Modify replay endpoint (determinism verification)
   - Update EvaluationPersistenceService coordination
   - MVP tests pass

7. **After Day 3:**
   - Write integration tests (7)
   - Run verification gates
   - Commit and prepare Phase 5d

---

## Verification Checkpoints

### Checkpoint 1: Schema & Migration (Day 1)
**Gate:** audit_events table created without errors

**Verification:**
```bash
npx prisma migrate deploy
npx prisma db push --skip-generate
```

**Success Criteria:**
- audit_events table exists
- Immutability trigger created
- Indexes on event_type, subject_id, actor_id created
- No errors

---

### Checkpoint 2: Hash Utils & Repository (Day 2)
**Gate:** Typecheck + hash and audit tests pass

**Verification:**
```bash
npm run typecheck
npm run test -- src/lib/persistence/audit-hash-utils.test.ts
npm run test -- src/lib/persistence/audit-event-repository.test.ts
```

**Success Criteria:**
- TypeScript: 0 errors
- Hash computation matches PostgreSQL formula
- Chain linkage works
- Append-only operations work

---

### Checkpoint 3: Replay & Services (Day 3)
**Gate:** Replay and audit services work

**Verification:**
```bash
npm run typecheck
npm run test -- src/lib/persistence/replay-service.test.ts
npm run test -- src/lib/persistence/audit-service.test.ts
```

**Success Criteria:**
- Replay retrieves evaluation + policy
- Result hash comparison works
- Determinism verified
- Audit events logged

---

### Checkpoint 4: Endpoint Integration (Day 3)
**Gate:** Full endpoint integration works

**Verification:**
```bash
npm run typecheck
npx vitest run tests/mvp.test.ts
npm run test -- tests/audit-persistence.test.ts
```

**Success Criteria:**
- Evaluate endpoint logs audit events
- Replay endpoint returns determinism status
- MVP tests pass
- Full chain of custody works

---

### Checkpoint 5: Build & Verification (End of Day 3)
**Gate:** Full build success

**Verification:**
```bash
npm run build
git status --short
```

**Success Criteria:**
- Build succeeds
- All changes committed
- Audit chain verifiable
- Ready for Phase 5d

---

## Success Criteria

Phase 5c is complete when:

1. ✓ **Schema:** audit_events table created
2. ✓ **Repository:** AuditEventRepository works (append-only)
3. ✓ **Services:** ReplayService and AuditService work
4. ✓ **Immutability:** UPDATE/DELETE fail on audit_events
5. ✓ **Chain Integrity:** audit_hash links to prior event
6. ✓ **Hash Chain:** Formula matches PostgreSQL exactly
7. ✓ **Replay:** Evaluations can be re-executed for verification
8. ✓ **Determinism:** Result hashes match (PASS status)
9. ✓ **Audit Logging:** Every evaluation logs EVALUATION_CREATED event
10. ✓ **Replay Logging:** Every replay logs EVALUATION_REPLAYED event
11. ✓ **Endpoints Modified:** evaluate + replay endpoints use audit infrastructure
12. ✓ **Tests:** All audit persistence tests pass
13. ✓ **Verification Gates:**
    - npm run typecheck = 0 errors
    - npx vitest run tests/mvp.test.ts = all pass
    - npm run build = success
    - npx vitest run tests/audit-persistence.test.ts = all pass
    - git status --short = clean

---

## What Phase 5c Does NOT Include

- ❌ Policy lifecycle events (POLICY_APPROVED, POLICY_ACTIVATED)
- ❌ Policy change audit events (POLICY_CHANGE_REQUESTED)
- ❌ Policy approval workflow
- ❌ Governance enforcement
- ❌ RBAC enforcement (Phase 6c)
- ❌ Access control audit events (Phase 6c)

These are Phase 5d, 6a, 6b, and 6c work respectively.

---

## Assumptions

1. Phase 5a (evaluations table) is complete and working
2. Phase 5b (policy_versions table) is complete and working
3. PostgreSQL 14+ with pgcrypto extension for crypto functions
4. Node crypto.createHash('sha256') available (built-in)
5. JSONB column support in PostgreSQL

---

## Next Phase

Upon Phase 5c completion:
- Phase 5d: Load testing and integration validation
- Phase 6a/6b: Governance layer (policy lifecycle, approval workflow)
- Phase 6c: Role-based access control and audit events

---

**This plan is frozen pending Phase 5b completion and audit approval.**
