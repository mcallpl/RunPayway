# Phase 5C Scope Lock (CORRECTED)
## Audit Ledger Persistence, Replay, and Determinism Verification

**Date:** June 22, 2026  
**Status:** Scope Lock (Pre-Implementation) — CORRECTED  
**Authorization:** Phase 5C: Audit Ledger Persistence & Replay Infrastructure  
**Hard Constraints:** No governance, no RBAC, no mutations, preserve immutability, SQLite-compatible schema

---

## Question 1: Exact Tables to be Created or Modified

**Tables to CREATE:**
1. `audit_events` — Immutable append-only audit trail with sequence-based chain ordering

**Tables to MODIFY:**
None. Evaluations table remains unchanged from Phase 5A.

**Tables NOT TOUCHED:**
- All existing tables (Organization, Policy, PolicyVersion, EvaluationRequest, EvaluationResult, AuditRecord, CohortPolicyBinding)
- evaluations (Phase 5A immutability preserved)
- policy_versions (Phase 5B registry preserved)

**Architectural Decision (Corrected):**
- audit_events table is the single source for audit linkage
- No audit_hash column added to evaluations
- Evaluations remain pure evaluation result records (immutable, unmodified)
- Audit trail linkage managed entirely within audit_events via sequence ordering

---

## Question 2: Fields in `audit_events` Table (SQLite-Compatible)

**Purpose:** Immutable append-only event log with deterministic chain integrity

**Field Definition:**

```
audit_events (
  audit_id (TEXT PRIMARY KEY)
    - UUID, uniquely identifies this event
    - indexed for queries
  
  sequence_number (INTEGER UNIQUE NOT NULL)
    - Deterministic ledger ordering
    - Auto-incrementing sequence: 1, 2, 3, ...
    - Enables deterministic "previous event" lookup
    - Indexed for range queries
  
  previous_hash (TEXT, nullable)
    - SHA-256 hash from preceding audit event
    - Computed from: sequence_number - 1 record's audit_hash
    - NULL if this is genesis event (sequence_number = 1)
    - Enables chain verification without query
  
  audit_hash (TEXT NOT NULL, indexed)
    - SHA-256 chain link (this event's hash)
    - Computed from canonical payload:
      SHA256(
        CONCAT(
          previous_hash OR '',
          event_type,
          subject_type,
          subject_id,
          evaluation_id (if applicable),
          policy_id (if applicable),
          policy_version (if applicable),
          CAST(event_timestamp AS TEXT),
          canonical_details_payload
        )
      )
    - Uniquely identifies this event in chain
  
  event_type (TEXT NOT NULL, indexed)
    - EVALUATION_CREATED
    - EVALUATION_REPLAYED
    - (future: POLICY_*, governance events reserved for Phase 6)
  
  event_timestamp (DATETIME NOT NULL)
    - When the event logically occurred
    - Nanosecond precision (application-level, stored as TEXT if needed)
    - Indexed for time-range queries
  
  created_at (DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)
    - When this audit event was persisted
    - Immutable insertion timestamp
    - Indexed for insertion-order queries
  
  actor_id (TEXT, nullable, indexed)
    - user_id, system_id, or NULL for auto events
    - Identifies who/what triggered the event
  
  subject_type (TEXT NOT NULL, indexed)
    - 'evaluation', 'policy', 'change'
    - Categorizes the subject
  
  subject_id (TEXT NOT NULL, indexed)
    - evaluation_id, policy_id, or change_id
    - Identifies the subject
  
  details (TEXT NOT NULL)
    - JSON serialized as TEXT (SQLite-compatible)
    - Flexible schema: event-specific metadata
    - Examples:
      * EVALUATION_CREATED: {
          evaluation_id, 
          policy_id, 
          policy_version, 
          payload_hash, 
          payload (full canonical input for replay),
          result_hash, 
          classification
        }
      * EVALUATION_REPLAYED: {
          evaluation_id, 
          replay_timestamp, 
          original_result_hash, 
          replay_result_hash, 
          match (boolean),
          discrepancies (if any)
        }
)
```

**JSON Storage Strategy (SQLite):**
- Prisma `Json` type: stores as TEXT in SQLite, handles serialization/deserialization
- Application layer: JSON.stringify() on INSERT, JSON.parse() on SELECT
- No JSONB (PostgreSQL-only), no complex queries on JSON fields

**Constraints:**
- No UPDATE allowed (immutable)
- No DELETE allowed (append-only)
- UNIQUE on sequence_number (ledger ordering deterministic)

**Indexes:**
- PRIMARY KEY on audit_id
- UNIQUE on sequence_number (ledger ordering)
- Index on event_type (query by event type)
- Index on subject_type + subject_id (query by subject)
- Index on actor_id (query by actor)
- Index on event_timestamp DESC (time-ordered queries)
- Index on created_at DESC (insertion-ordered queries)
- Index on audit_hash (chain verification)

**Rationale:**
- Append-only pattern ensures immutability
- Deterministic sequence_number enables reliable "previous event" lookup
- Both previous_hash and audit_hash fields make chain verification explicit and queryable
- Flexible TEXT/JSON details allow event type evolution without schema changes
- Chain hash enables tamper detection
- SQLite-compatible (no JSONB, no complex native types)

---

## Question 3: Will evaluations be Modified? If Yes, Exactly How and Why?

**Answer: NO**

**Evaluations Table Decision (Corrected):**

The evaluations table remains UNCHANGED from Phase 5A.

- No audit_hash column added
- No new columns or indexes
- Evaluations remain pure immutable result records
- Audit trail linkage managed entirely by audit_events table

**Why This Design:**

1. **Separation of Concerns:** Evaluations store evaluation results, audit_events store audit trail
2. **Immutability Clarity:** Evaluations are never modified (Phase 5A guarantee preserved)
3. **Linkage Independence:** Audit events can be created/managed without touching evaluation records
4. **Future Flexibility:** If audit scheme changes, evaluations remain untouched

**Audit Linkage Pattern:**

```
EVALUATION_CREATED event stores:
  - evaluation_id (links to evaluations table)
  - Full evaluation context in details.payload

Queries for audit trail:
  SELECT * FROM audit_events 
  WHERE subject_id = ? AND subject_type = 'evaluation'
  ORDER BY sequence_number DESC
```

---

## Question 4: How will the Audit Hash Chain be Computed?

**Chain Formula (Corrected):**

```
audit_hash = SHA256(
  CONCAT(
    previous_hash OR '',
    event_type,
    subject_type,
    subject_id,
    evaluation_id (if applicable) OR '',
    policy_id (if applicable) OR '',
    policy_version (if applicable) OR '',
    CAST(event_timestamp AS TEXT),
    canonical_details_payload
  )
)
```

**Detailed Computation:**

1. **previous_hash** (64 hex chars or empty string)
   - From immediately preceding audit_events record
   - Determined by: sequence_number - 1
   - Empty string if genesis event (sequence_number = 1)
   - Deterministic: same prior event always produces same prior hash

2. **event_type** (string, e.g., "EVALUATION_CREATED")
   - Identifies event category in chain
   - Prevents confusion if field order changes
   - Examples: EVALUATION_CREATED, EVALUATION_REPLAYED

3. **subject_type** (string, e.g., "evaluation")
   - Categorizes what kind of subject this is
   - Examples: evaluation, policy, change

4. **subject_id** (string, UUID or ID)
   - Specific subject identifier
   - Examples: evaluation_id, policy_id

5. **evaluation_id** (optional, empty string if N/A)
   - Included if event relates to specific evaluation
   - Empty string for non-evaluation events

6. **policy_id** (optional, empty string if N/A)
   - Included if event relates to specific policy
   - Empty string for evaluation-only events

7. **policy_version** (optional, empty string if N/A)
   - Included if event relates to specific policy version
   - Empty string for non-policy events

8. **CAST(event_timestamp AS TEXT)** (ISO 8601 or epoch timestamp)
   - String representation of event timestamp
   - Ensures deterministic ordering in chain
   - Prevents timestamp precision loss

9. **canonical_details_payload** (pre-computed hash or JSON)
   - For EVALUATION_CREATED: JSON hash of event details
   - For EVALUATION_REPLAYED: JSON hash of replay comparison
   - Pre-computed by application before audit_hash calculation
   - Includes all event-specific metadata

**Result:** SHA-256 hash (64 hex characters, lowercase)

**Implementation Pattern:**

```typescript
// Application-level computation (mirrors database if stored procedures used)
const computeAuditHash = (
  previousHash: string | null,
  eventType: string,
  subjectType: string,
  subjectId: string,
  evaluationId: string | null,
  policyId: string | null,
  policyVersion: number | null,
  eventTimestamp: string,
  detailsPayload: object
): string => {
  const canonicalPayload = [
    previousHash || '',
    eventType,
    subjectType,
    subjectId,
    evaluationId || '',
    policyId || '',
    policyVersion?.toString() || '',
    eventTimestamp,
    JSON.stringify(detailsPayload)
  ].join('|');
  
  return crypto.createHash('sha256')
    .update(canonicalPayload)
    .digest('hex');
};
```

---

## Question 5: How will previous_hash be Determined?

**Algorithm (Corrected via Sequence Number):**

```sql
-- Retrieve previous event via sequence_number
SELECT audit_hash
FROM audit_events
WHERE sequence_number = (current_sequence_number - 1)
LIMIT 1

-- If no result found (genesis event), use NULL/empty string
```

**Logic:**

1. Current event has sequence_number = N
2. Previous event has sequence_number = N - 1
3. Query audit_events WHERE sequence_number = N - 1
4. Return that event's audit_hash as previous_hash for current event
5. If N = 1 (genesis), previous_hash = NULL or empty string

**Edge Cases:**

- **First event (sequence_number = 1):** previous_hash = NULL or empty string
- **Concurrent inserts:** sequence_number auto-increment prevents collisions (database-enforced UNIQUE)
- **Out-of-order insertion:** Impossible; sequence_number is ledger ordering

**Performance:**

- Efficient: Uses indexed sequence_number lookup
- One index query per audit event (minimal overhead)
- No full-table scans

**Determinism Guarantee:**

The sequence_number field provides absolute ordering. No timestamp tie-breaks needed. Chain is fully deterministic regardless of wall-clock precision or concurrent operations.

---

## Question 6: How will Replay use Evaluation Payload/Result Hashes and Policy Version References?

**Replay Capability Assessment (CRITICAL CLARIFICATION):**

**Phase 5A Storage Limitation:**
- Evaluations table stores: payload_hash (SHA-256 digest)
- Evaluations table does NOT store: actual canonical payload
- Result: Hash verification possible, TRUE REPLAY requires payload

**Phase 5C Replay Design (Corrected):**

Replay has TWO capabilities:

### A. Determinism Verification (Hash-only, no re-execution)

```
Input: evaluation_id (UUID)

Step 1: Retrieve Evaluation Record
  SELECT * FROM evaluations WHERE evaluation_id = ?
  Returns: payload_hash, result_hash, classification, ...

Step 2: Verify Against Audit Trail
  SELECT details FROM audit_events 
  WHERE subject_id = evaluation_id AND event_type = 'EVALUATION_CREATED'
  Compare: audit_event.details.result_hash == evaluation.result_hash
  
Result: Confirms evaluation was logged consistently
```

### B. True Replay (Re-execution with Original Payload)

**Prerequisite:** Payload must be stored in audit_events

```
EVALUATION_CREATED event includes:
  details.payload = full canonical input payload (JSON)

Replay Algorithm:

Step 1: Retrieve Evaluation Record
  SELECT * FROM evaluations WHERE evaluation_id = ?
  
Step 2: Retrieve Audit Event with Original Payload
  SELECT details FROM audit_events
  WHERE subject_id = evaluation_id AND event_type = 'EVALUATION_CREATED'
  Extracts: details.payload, details.policy_id, details.policy_version

Step 3: Extract Composite Key
  policy_id = audit_event.details.policy_id
  policy_version = audit_event.details.policy_version

Step 4: Retrieve Original Policy Version
  SELECT source_definition FROM policy_versions
  WHERE policy_id = ? AND version = ?

Step 5: Re-Execute Policy
  result_replay = execute_policy(
    source_definition = policy_version.source_definition,
    payload = audit_event.details.payload
  )

Step 6: Compute Replay Result Hash
  result_hash_replay = SHA256(JSON.stringify(result_replay))

Step 7: Compare Result Hashes
  if (result_hash_replay == evaluation.result_hash) {
    determinism_status = PASS
  } else {
    determinism_status = FAIL
    discrepancies = differences between results
  }

Step 8: Log Replay Event
  INSERT INTO audit_events (
    event_type = 'EVALUATION_REPLAYED',
    subject_id = evaluation_id,
    subject_type = 'evaluation',
    details = {
      evaluation_id,
      original_result_hash,
      replay_result_hash,
      match = (determinism_status),
      discrepancies = (if any)
    },
    audit_hash = compute_audit_hash(...),
    previous_hash = (from prior sequence_number),
    sequence_number = (auto-increment)
  )

Step 9: Return Result
  {
    evaluation_id,
    original_result_hash,
    replay_result_hash,
    match: boolean,
    replay_timestamp,
    discrepancies: [] or null
  }
```

**Phase 5C Implementation Scope:**

- ✓ Determinism verification (hash-only) is READY
- ✓ True replay (with re-execution) REQUIRES payload storage in audit_events
- ✓ EVALUATION_CREATED event details.payload stores full canonical input
- ✓ All replay queries are read-only (no mutations)
- ✓ Replay events are logged in audit_events (append-only)

**Key Properties:**
- Policy version retrieved via composite key (deterministic)
- Original payload retrieved from audit_events (immutable)
- Result comparison proves determinism
- Entire replay process is read-only
- Replay event logged for audit trail (chain continues)

---

## Question 7: How will Determinism Verification Work without Mutating Completed Evaluations?

**Answer: Replay is Stateless Read-Only Process**

**Mechanism:**

1. **Evaluation Record is Immutable**
   - result_hash stored at creation time (Phase 5A)
   - Never updated (database-enforced immutability)
   - Can be re-read indefinitely

2. **Replay Process Creates New Audit Event (Only)**
   - Does NOT modify evaluation record
   - Creates new EVALUATION_REPLAYED event in audit_events
   - Logs original_hash vs replay_hash comparison
   - Extends chain: adds new event with updated previous_hash and audit_hash

3. **Verification Query (Read-Only)**
   ```sql
   SELECT 
     ae_created.details AS creation_details,
     ae_replayed.details AS replay_details,
     ae_replayed.details->>'match' AS determinism_verified
   FROM audit_events ae_created
   LEFT JOIN audit_events ae_replayed
     ON ae_replayed.subject_id = ae_created.subject_id
     AND ae_replayed.event_type = 'EVALUATION_REPLAYED'
   WHERE ae_created.subject_id = ? 
     AND ae_created.event_type = 'EVALUATION_CREATED'
   ```

4. **Statistical Verification (Read-Only)**
   ```sql
   SELECT 
     COUNT(*) AS total_replays,
     COUNT(CASE WHEN JSON_EXTRACT(details, '$.match') = true THEN 1 END) AS passed,
     COUNT(CASE WHEN JSON_EXTRACT(details, '$.match') = false THEN 1 END) AS failed,
     CAST(COUNT(CASE WHEN JSON_EXTRACT(details, '$.match') = false THEN 1 END) AS FLOAT) / COUNT(*) AS failure_rate
   FROM audit_events
   WHERE event_type = 'EVALUATION_REPLAYED'
   ```

**No Mutations Occur:**
- Original evaluation fields unchanged
- Only audit_events table receives new entries
- Evaluations table is never touched after initial creation

---

## Question 8: How will Phase 5C Preserve Phase 5A Evaluation Immutability?

**Preservation Strategy:**

1. **No Modifications to Evaluations Table**
   - evaluation result fields (result_hash, classification, violation_score) never updated
   - No audit_hash column added to evaluations (per corrected design)
   - evaluations.created_at remains the only timestamp
   - evaluations table structure frozen from Phase 5A

2. **Repository-Level Immutability Enforcement**
   - EvaluationRepository has NO update() method
   - EvaluationRepository has NO delete() method
   - Only create() method available (append-only)
   - All other operations are read-only queries

3. **Audit Trail Separation**
   - New EVALUATION_CREATED and EVALUATION_REPLAYED events added to audit_events
   - Existing evaluations' lack of audit linkage is historical fact (preserved)
   - No backfill, no mutation of old records
   - audit_events table is independent (evaluations never touched)

4. **Replay is Read-Only**
   - Retrieves evaluation record (SELECT only)
   - Never modifies it
   - Creates new audit events in audit_events table (separate table)
   - Does not touch evaluations table

**Result:** Phase 5A immutability contract fully preserved. Evaluations table is read-only after insertion.

---

## Question 9: How will Phase 5C Preserve Phase 5B Policy Registry Boundaries?

**Preservation Strategy:**

1. **Read-Only Access to policy_versions**
   - Replay queries policy_versions by composite key
   - No mutations to policy_versions
   - No policy lifecycle state transitions in Phase 5C
   - No approval/activation workflows

2. **No Policy Status Changes**
   - Phase 5B: policy_versions has no status field (governance-free)
   - Phase 5C: Does not add status field
   - No DRAFT, APPROVED, ACTIVE, RETIRED states introduced
   - Deterministic lookup only (by version number, not lifecycle state)

3. **No Policy Mutations**
   - Phase 5C creates audit events about evaluations only
   - Future governance events (POLICY_*) would be Phase 6 work
   - Phase 5C does not include policy change audit events
   - audit_events only logs EVALUATION_CREATED and EVALUATION_REPLAYED in Phase 5C

4. **Clean API Boundary**
   - PolicyRepository: unchanged, read-only queries only
   - No policy management endpoints added
   - No policy creation endpoints
   - No policy update endpoints

5. **Composite Key Respect**
   - Replay uses (policy_id, policy_version) exactly as Phase 5B defined
   - No implicit "current policy" concept
   - Deterministic by explicit version reference

**Result:** Phase 5B policy registry boundaries fully preserved. No governance leakage.

---

## Question 10: What is Explicitly Out of Scope?

### NOT IN PHASE 5C (Deferred to Phase 6 or Beyond):

❌ **Governance Workflows**
- No policy change request workflows
- No approval workflows
- No activation workflows
- Deferred to Phase 6a/6b

❌ **Policy Lifecycle State Machine**
- No status field added to policy_versions
- No DRAFT, APPROVED, ACTIVE, RETIRED states
- No "current policy" concept
- Deferred to Phase 6 activation layer

❌ **RBAC (Role-Based Access Control)**
- No role enforcement in Phase 5C
- No Developer/Reviewer/Approver roles
- No permission checks
- Deferred to Phase 6c

❌ **Policy Mutation Endpoints**
- No POST /api/v1/policy/create
- No PATCH /api/v1/policy/:id
- No policy management endpoints
- Deferred to Phase 6

❌ **Policy Lifecycle Audit Events**
- No POLICY_DRAFT_CREATED events
- No POLICY_APPROVED events
- No POLICY_ACTIVATED events
- No POLICY_RETIRED events
- Deferred to Phase 6

❌ **Changes to Evaluations Table**
- No audit_hash column
- No new columns
- No new indexes
- No schema modifications

### IN SCOPE (Phase 5C ONLY):

✓ audit_events table (immutable append-only, SQLite-compatible)
✓ Evaluation audit events: EVALUATION_CREATED (with full payload), EVALUATION_REPLAYED
✓ Deterministic sequence_number field (ledger ordering)
✓ Cryptographic chain: previous_hash + audit_hash (tamper detection)
✓ Replay endpoint (/api/v1/replay) — determinism verification + re-execution
✓ Determinism verification (result hash comparison)
✓ Read-only access to evaluations and policy_versions
✓ Tests for replay and determinism verification
✓ Read-only queries for audit trail inspection

---

## Question 11: Verification Gates

**All gates must pass before Phase 5C is considered complete:**

1. **Schema Validation**
   ```bash
   npx prisma validate
   ```
   Expected: "schema.prisma is valid 🚀"

2. **Client Generation**
   ```bash
   npx prisma generate
   ```
   Expected: "Generated Prisma Client successfully"

3. **Migration Deployment**
   ```bash
   npx prisma migrate deploy
   ```
   Expected: "All migrations have been successfully applied"

4. **Type Checking**
   ```bash
   npm run typecheck
   ```
   Expected: 0 errors

5. **MVP Tests**
   ```bash
   npx vitest run tests/mvp.test.ts
   ```
   Expected: 31/31 tests pass (no regression)

6. **Replay Tests**
   ```bash
   npx vitest run tests/replay.test.ts
   ```
   Expected: All replay and determinism tests pass

7. **Production Build**
   ```bash
   npm run build
   ```
   Expected: Build succeeds without errors

8. **Git Status**
   ```bash
   git status --short
   ```
   Expected: Clean (all changes committed)

**All 8 gates must pass. No exceptions.**

---

## Scope Lock Validation

**Consistency Checks:**

✓ SQLite-compatible schema (no JSONB, TEXT-based JSON storage)  
✓ Sequence-number-based ledger ordering (deterministic)  
✓ Explicit previous_hash and audit_hash fields (tamper detection explicit)  
✓ Full canonical payload stored in EVALUATION_CREATED details  
✓ Evaluations table unchanged (immutability fully preserved)  
✓ Audit trail linkage via audit_events only (separation of concerns)  
✓ Replay supports both hash verification and true re-execution  
✓ Immutability enforced by repository design (no update/delete methods)  
✓ Composite key usage respects Phase 5B policy boundaries  
✓ No governance/RBAC work (deferred to Phase 6)  
✓ No policy mutations (read-only access only)  
✓ No Phase 6 concepts (approval, activation, lifecycle)  
✓ Append-only audit trail (no deletions or mutations)  

**Architectural Compliance:**

✓ Matches ENTERPRISE_PLATFORM_ARCHITECTURE_V1.md audit ledger section  
✓ Matches AUDIT_ARCHITECTURE_V1.md immutability requirements  
✓ Matches IMPLEMENTATION_ROADMAP_PHASES_5_7.md Phase 5c definition  
✓ SQLite constraint compatibility verified  

---

## Hard Constraints Acknowledged

✓ No governance approval workflows  
✓ No activation workflows  
✓ No policy status fields added  
✓ No policy mutations  
✓ No RBAC implementation  
✓ No policy mutation endpoints  
✓ Existing evaluations not rewritten  
✓ Evaluation result fields never mutated  
✓ Evaluations table structure frozen  
✓ No audit_hash column added to evaluations  
✓ No prisma db push (migration-only)  
✓ No migrate reset  
✓ No direct SQLite queries outside approved architecture  
✓ No JSONB (SQLite incompatible)  
✓ No Phase 6 work  

---

## Correction Summary

**Issues Corrected from Original Scope Lock:**

### 1. SQLite Compatibility
- **Removed:** JSONB specification
- **Corrected to:** TEXT-based JSON storage (Prisma `Json` type)
- **Reason:** SQLite doesn't support JSONB; TEXT/JSON is compatible

### 2. Explicit Hash Chain Fields
- **Removed:** Single audit_hash field (insufficient for chain verification)
- **Added:** Both previous_hash AND audit_hash fields
- **Reason:** Makes chain linkage explicit, queryable, and tamper-detectable

### 3. Sequence-Based Ordering
- **Removed:** Timestamp-only + UUID tie-break ordering
- **Added:** Explicit sequence_number (INTEGER UNIQUE) field
- **Reason:** Guarantees deterministic ledger ordering without timestamp precision issues

### 4. Evaluations Table Immutability
- **Removed:** audit_hash column addition to evaluations
- **Confirmed:** Evaluations table remains unchanged from Phase 5A
- **Reason:** Separation of concerns; audit trail managed entirely in audit_events

### 5. Replay Capability Clarification
- **Addressed:** Phase 5A stores payload_hash but NOT actual payload
- **Solution:** Store full canonical payload in audit_events EVALUATION_CREATED details
- **Scope:** Both determinism verification (hash-only) AND true replay (with re-execution)

### 6. Immutability Enforcement
- **Clarified:** Repository-level enforcement (no update/delete methods)
- **Database:** Immutability via constraints and trigger (inherited from Phase 5A)
- **Result:** No mutations possible at either layer

---

## Authorization to Proceed

**This scope lock is corrected, validated, and frozen for implementation.**

Implementation will begin only after explicit user authorization.

No deviations from this corrected scope lock without written authorization.

All 11 questions answered and validated against architectural constraints.

**SCOPE LOCK STATUS: CORRECTED AND READY ✓**

---

**Awaiting explicit implementation authorization.**
