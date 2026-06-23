# Phase 5C Scope Lock
## Audit Ledger Persistence, Replay, and Determinism Verification

**Date:** June 22, 2026  
**Status:** Scope Lock (Pre-Implementation)  
**Authorization:** Phase 5C: Audit Ledger Persistence & Replay Infrastructure  
**Hard Constraints:** No governance, no RBAC, no mutations, preserve immutability

---

## Question 1: Exact Tables to be Created or Modified

**Tables to CREATE:**
1. `audit_events` — Immutable append-only audit trail with chain hash links

**Tables to MODIFY:**
1. `evaluations` — ONLY to add audit_hash column (nullable, additive)
   - No existing evaluation data modified
   - New evaluations created in Phase 5C will include audit_hash
   - Existing Phase 5A/5B evaluations retain NULL audit_hash

**Tables NOT TOUCHED:**
- All existing tables (Organization, Policy, PolicyVersion, EvaluationRequest, EvaluationResult, AuditRecord, CohortPolicyBinding)

---

## Question 2: Fields in `audit_events` Table

**Purpose:** Immutable append-only event log with cryptographic chain integrity

**Field Definition:**

```
audit_events (
  audit_id (UUID, PRIMARY KEY, UNIQUE)
  
  event_type (VARCHAR(64), indexed)
    - EVALUATION_CREATED
    - EVALUATION_REPLAYED
    - (future: POLICY_*, governance events)
  
  event_timestamp (TIMESTAMP(6) WITH TZ, nanosecond precision)
  created_at (TIMESTAMP(6) WITH TZ, immutable, DEFAULT NOW())
  
  actor_id (VARCHAR(255), optional, indexed)
    - user_id, system_id, or NULL for auto events
  
  subject_type (VARCHAR(32), indexed)
    - 'evaluation', 'policy', 'change'
  
  subject_id (VARCHAR(255), indexed)
    - evaluation_id, policy_id, change_id
  
  details (JSONB, NOT NULL)
    - Flexible schema: event-specific metadata
    - Examples:
      * EVALUATION_CREATED: {evaluation_id, policy_id, policy_version, payload_hash, result_hash, classification}
      * EVALUATION_REPLAYED: {evaluation_id, replay_timestamp, original_result_hash, replay_result_hash, match}
  
  audit_hash (CHAR(64), NOT NULL, indexed)
    - SHA-256 chain link to prior event
    - Formula: SHA256(prev_audit_id + current_payload_hash + timestamp + event_type)
)
```

**Constraints:**
- No UPDATE allowed (immutable)
- No DELETE allowed (append-only)
- audit_hash uniquely identifies this event in chain

**Indexes:**
- PRIMARY KEY on audit_id
- Index on event_type (query by event type)
- Index on subject_type + subject_id (query by subject)
- Index on actor_id (query by actor)
- Index on event_timestamp DESC (time-ordered queries)
- Index on created_at DESC (insertion-ordered queries)
- Index on audit_hash (chain verification)

**Rationale:**
- Append-only pattern ensures immutability
- Flexible JSONB details allow event type evolution without schema changes
- Chain hash enables tamper detection
- Nanosecond precision supports ordering even with concurrent inserts

---

## Question 3: Will evaluations be Modified? If Yes, Exactly How and Why?

**Answer: YES, single additive column only**

**Modification:**
```sql
ALTER TABLE evaluations
ADD COLUMN audit_hash CHAR(64) NULLABLE
ADD INDEX idx_evaluations_audit_hash ON evaluations(audit_hash)
```

**Why:**
- Links evaluation to its corresponding audit_events entry
- Enables queries: "Show me all audit events for evaluation X"
- Enables verification: "Trace this evaluation's chain hash"

**Immutability Preservation:**
- Column is NULLABLE (existing Phase 5A evaluations unaffected)
- No existing data modified (only new column added)
- Phase 5A evaluations retain NULL audit_hash
- Phase 5C evaluations populated with audit_hash during EVALUATION_CREATED event
- audit_hash is immutable (no UPDATE access)

**NOT Modified:**
- ❌ evaluation_id (PK)
- ❌ subject_id
- ❌ cohort_key
- ❌ policy_id
- ❌ policy_version
- ❌ result_hash
- ❌ classification
- ❌ violation_score
- ❌ triggered_reason_codes
- ❌ Any existing immutable fields

---

## Question 4: How will the Audit Hash Chain be Computed?

**Chain Formula:**
```
audit_hash = SHA256(
  CONCAT(
    COALESCE(previous_audit_event.audit_id, ''),
    current_event_payload_hash,
    CAST(event_timestamp AS EPOCH_SECONDS),
    event_type
  )
)
```

**Detailed Computation:**

1. **previous_audit_event.audit_id** (string, 36 chars or empty)
   - UUID of the immediately preceding audit event in time
   - Empty string if this is the first event (genesis)
   - Deterministic: same prior event always produces same prior ID

2. **current_event_payload_hash** (SHA-256, 64 hex chars)
   - Pre-computed hash of event details object
   - Includes all relevant event metadata
   - Example for EVALUATION_CREATED:
     ```
     SHA256(
       JSON.stringify({
         evaluation_id,
         policy_id,
         policy_version,
         payload_hash,
         result_hash,
         classification
       })
     )
     ```

3. **CAST(event_timestamp AS EPOCH_SECONDS)** (numeric string)
   - Seconds since epoch (not nanoseconds, for consistency with DB timestamps)
   - Ensures time ordering in chain

4. **event_type** (string, e.g., "EVALUATION_CREATED")
   - Identifies event category in chain
   - Prevents confusion if field order changes

**Result:** SHA-256 hash (64 hex characters)

**Implementation Location:**
- PostgreSQL: SQL function `compute_audit_hash(prev_audit_id, payload_hash, timestamp, event_type)`
- Application: TypeScript utility `computeAuditHash()` (mirrors PostgreSQL)
- Both must produce identical output (tested via unit tests with known vectors)

---

## Question 5: How will previous_hash be Determined?

**Algorithm:**
```
SELECT audit_id
FROM audit_events
WHERE created_at < current_event_timestamp
  OR (created_at = current_event_timestamp AND audit_id < current_audit_id)
ORDER BY created_at DESC, audit_id DESC
LIMIT 1
```

**Logic:**
1. Query audit_events table in DESC order by created_at
2. Tie-breaker: If two events share same timestamp, use audit_id (lexicographic)
3. Return most recent event's audit_id
4. If no prior event exists, return NULL/empty string (genesis event)

**Edge Cases:**
- **First event:** NULL/empty string (no prior hash)
- **Concurrent events (same nanosecond):** Lexicographic UUID ordering ensures deterministic chain
- **Clock skew:** Handled by ordering on created_at (immutable insertion time)
- **Replay attempts:** Previous hash is immutable; replaying doesn't affect chain

**Performance:**
- Efficient: Uses indexed created_at DESC
- One query per audit event (minimal overhead)
- No full-table scan

---

## Question 6: How will Replay use Evaluation Payload/Result Hashes and Policy Version References?

**Replay Algorithm:**

```
Input: evaluation_id (UUID)

Step 1: Retrieve Evaluation Record
  SELECT * FROM evaluations
  WHERE evaluation_id = ?
  
  Returns: subject_id, cohort_key, policy_id, policy_version,
           payload_hash, result_hash, classification, ...

Step 2: Extract Composite Key
  policy_id = from_step_1.policy_id (UUID)
  policy_version = from_step_1.policy_version (INTEGER)

Step 3: Retrieve Original Policy Version
  SELECT source_definition, compiled_hash
  FROM policy_versions
  WHERE policy_id = ? AND version = ?
  
  Returns: Exact policy used in original evaluation

Step 4: Reconstruct Original Payload
  NOTE: payload is not stored in evaluations table
  OPTION A: Store payload in audit_events EVALUATION_CREATED details
  OPTION B: Retrieve from external system (application state)
  OPTION C: Accept payload as replay input parameter
  
  Decision: Use OPTION A
    - audit_events.details.EVALUATION_CREATED includes payload
    - Preserves complete immutable record of original input

Step 5: Re-Execute Policy
  result_replay = execute_policy(
    source_definition = policy_version.source_definition,
    payload = audit_event.details.payload
  )

Step 6: Compute Replay Result Hash
  result_hash_replay = SHA256(JSON.stringify(result_replay))

Step 7: Compare Result Hashes
  if (result_hash_replay == evaluation.result_hash) {
    status = PASS (determinism verified)
  } else {
    status = FAIL (determinism violated)
    discrepancies = differences between results
  }

Step 8: Log Replay Event
  INSERT INTO audit_events (
    event_type = 'EVALUATION_REPLAYED',
    subject_id = evaluation_id,
    details = {
      evaluation_id,
      original_result_hash,
      replay_result_hash,
      match = (hash_compare_result),
      discrepancies = (if any)
    },
    audit_hash = compute_audit_hash(...)
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

**Key Properties:**
- Uses stored payload_hash for validation (not actual payload)
- Policy version retrieved via composite key (deterministic)
- Result comparison proves determinism
- Entire process is read-only (no mutations)
- Replay event logged for audit trail

---

## Question 7: How will Determinism Verification Work without Mutating Completed Evaluations?

**Answer: Replay is Stateless Read-Only Process**

**Mechanism:**

1. **Evaluation Record is Immutable**
   - result_hash stored at creation time
   - Never updated
   - Can be re-read indefinitely

2. **Replay Process Creates New Audit Event**
   - Does NOT modify original evaluation
   - Creates EVALUATION_REPLAYED event
   - Logs original_hash vs replay_hash comparison

3. **Verification Query**
   ```sql
   SELECT 
     e.evaluation_id,
     ae_created.details->>'result_hash' AS original_result_hash,
     ae_replayed.details->>'replay_result_hash' AS replay_result_hash,
     ae_replayed.details->>'match' AS determinism_verified
   FROM evaluations e
   JOIN audit_events ae_created ON ae_created.subject_id = e.evaluation_id::text
     AND ae_created.event_type = 'EVALUATION_CREATED'
   LEFT JOIN audit_events ae_replayed ON ae_replayed.subject_id = e.evaluation_id::text
     AND ae_replayed.event_type = 'EVALUATION_REPLAYED'
   WHERE e.evaluation_id = ?
   ```

4. **Statistical Verification**
   ```sql
   SELECT 
     COUNT(*) AS total_replays,
     COUNT(CASE WHEN (ae.details->>'match')::boolean THEN 1 END) AS passed,
     COUNT(CASE WHEN NOT (ae.details->>'match')::boolean THEN 1 END) AS failed,
     COUNT(CASE WHEN NOT (ae.details->>'match')::boolean THEN 1 END)::float / COUNT(*) AS failure_rate
   FROM audit_events ae
   WHERE ae.event_type = 'EVALUATION_REPLAYED'
   ```

**No Mutations Occur:**
- Original evaluation fields unchanged
- Only audit_events table receives new entries
- audit_hash in evaluations is set at insert time (never updated)

---

## Question 8: How will Phase 5C Preserve Phase 5A Evaluation Immutability?

**Preservation Strategy:**

1. **No UPDATE Operations**
   - evaluation result fields (result_hash, classification, violation_score, etc.) never updated
   - evaluation.audit_hash set once at creation, never updated
   - Database trigger enforces immutability (inherited from Phase 5A)

2. **Additive Changes Only**
   - audit_hash column added (nullable for backwards compatibility)
   - No existing data rewritten
   - Phase 5A evaluations remain unchanged (audit_hash = NULL)
   - Phase 5C evaluations populated at insert time

3. **Audit Events are Append-Only**
   - New EVALUATION_CREATED events log the audit_hash
   - Existing evaluations' lack of audit_hash is historical fact (preserved)
   - No backfill, no mutation of old records

4. **Replay is Read-Only**
   - Retrieves evaluation record
   - Never modifies it
   - Creates new audit events only

5. **Immutability Enforcement**
   ```sql
   CREATE TRIGGER immutability_evaluations
   BEFORE UPDATE OR DELETE ON evaluations
   FOR EACH ROW
   EXECUTE FUNCTION raise_immutability_error();
   ```
   - Same trigger as Phase 5A (already in place)
   - Applies to all columns including new audit_hash

**Result:** Phase 5A immutability contract fully preserved.

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

3. **No Policy Mutations**
   - Phase 5C creates audit events about evaluations only
   - Future governance events (POLICY_*) would be Phase 6 work
   - Phase 5C does not include policy change audit events

4. **Clean API Boundary**
   - PolicyRepository: unchanged, read-only
   - PolicyLookupService: unchanged, deterministic lookup only
   - No policy management endpoints added

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

❌ **Access Control Audit Events**
- No AUDIT_TRAIL_ACCESSED events (would need RBAC)
- No POLICY_RETRIEVED events with authorization
- Deferred to Phase 6c

❌ **Policy Lifecycle Audit Events**
- No POLICY_DRAFT_CREATED events
- No POLICY_APPROVED events
- No POLICY_ACTIVATED events
- No POLICY_RETIRED events
- Deferred to Phase 6

❌ **Change Audit Events**
- No POLICY_CHANGE_REQUESTED events
- No POLICY_CHANGE_APPROVED events
- No POLICY_CHANGE_REJECTED events
- Deferred to Phase 6

### IN SCOPE (Phase 5C ONLY):

✓ audit_events table (immutable append-only)
✓ Evaluation audit events: EVALUATION_CREATED, EVALUATION_REPLAYED
✓ Audit hash chain (cryptographic integrity)
✓ Replay endpoint (/api/v1/replay)
✓ Determinism verification (result hash comparison)
✓ audit_hash column in evaluations (additive, nullable)
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

✓ Phase 5C scope aligns with PHASE_5C_IMPLEMENTATION_PLAN.md  
✓ Audit events table matches AUDIT_ARCHITECTURE_V1.md design  
✓ Replay mechanism respects Phase 5A evaluation immutability  
✓ Composite key usage respects Phase 5B policy boundaries  
✓ No governance/RBAC work (deferred to Phase 6)  
✓ No policy mutations (read-only access only)  
✓ No Phase 6 concepts (approval, activation, lifecycle)  
✓ Additive audit_hash column (no existing data rewritten)  
✓ Append-only audit trail (no deletions or mutations)  

**Architecture Compliance:**

✓ Matches ENTERPRISE_PLATFORM_ARCHITECTURE_V1.md audit ledger section  
✓ Matches AUDIT_ARCHITECTURE_V1.md immutability requirements  
✓ Matches IMPLEMENTATION_ROADMAP_PHASES_5_7.md Phase 5c definition  

---

## Hard Constraints Acknowledged

✓ No governance approval workflows  
✓ No activation workflows  
✓ No policy status fields added  
✓ No RBAC implementation  
✓ No policy mutation endpoints  
✓ Existing evaluations not rewritten  
✓ Evaluation result fields never mutated  
✓ No prisma db push (migration-only)  
✓ No migrate reset  
✓ No direct SQLite queries outside approved architecture  
✓ No Phase 6 work  

---

## Authorization to Proceed

**This scope lock is frozen and ready for implementation.**

Implementation will begin only after explicit user authorization.

No deviations from this scope lock without written authorization.

All 11 questions answered and validated against architecture documents.

**SCOPE LOCK STATUS: APPROVED ✓**

---

**Awaiting implementation authorization.**
