# Phase 5B Scope Lock
## Policy Registry Persistence - Exact Implementation Boundaries

**Date:** June 22, 2026  
**Status:** Scope Lock (Pre-Implementation)  
**Authorization:** Phase 5B: Policy Registry Persistence

---

## Question 1: Exact Tables to be Created or Modified

**Tables to CREATE:**
1. `policies` - New table (metadata layer)
2. `policy_versions` - New table (immutable versioned policies)

**Tables to MODIFY:**
1. `evaluations` - ONLY to add composite FK constraint (policy_id, policy_version) → policy_versions
   - No other fields added to evaluations
   - No new indexes
   - No schema redesign beyond FK addition

**Tables NOT TOUCHED:**
- All existing tables (Organization, CohortPolicyBinding, EvaluationRequest, EvaluationResult, AuditRecord)

---

## Question 2: Fields in `policies` Table

**Purpose:** Metadata container; immutable after creation

**Field Definition:**

```
policies (
  policy_id (UUID, PRIMARY KEY)
  name (VARCHAR(255), UNIQUE)
  description (TEXT, optional)
  policy_type (VARCHAR(64), e.g., 'INCOME_STABILITY')
  created_at (TIMESTAMP, default NOW(), immutable)
  created_by (VARCHAR(255), optional)
)
```

**Constraints:**
- No UPDATE allowed (immutable)
- No DELETE allowed (immutable)
- policy_id uniqueness enforced

**Indexes:**
- Primary key index (automatic)
- Unique index on name

**Rationale:**
- Lightweight metadata container for policy identity
- Separates metadata from versioned logic (policy_versions)
- Enables FK relationship from policy_versions and evaluations

---

## Question 3: Fields in `policy_versions` Table

**Purpose:** Immutable, versioned policy storage (persistence only, no governance)

**Field Definition:**

```
policy_versions (
  policy_id (UUID, composite FK → policies.policy_id)
  version (INTEGER)
  
  source_definition (TEXT, immutable after creation)
  compiled_hash (CHAR(64), SHA-256)
  
  effective_date (DATE, optional)
  
  created_at (TIMESTAMP, default NOW(), immutable)
  created_by (VARCHAR(255), optional)
)
```

**Constraints:**
- Composite PRIMARY KEY: (policy_id, version)
- FOREIGN KEY: policy_id → policies.policy_id
- No UPDATE allowed (immutable)
- No DELETE allowed (immutable)

**Indexes:**
- Composite PK index (policy_id, version)
- Index on created_at for time-based queries

**Rationale:**
- Composite key enables exact policy version retrieval for deterministic replay (Phase 5c)
- Immutability enforced at DB level
- Minimal schema: identity, definition, hashes for verification
- NO status field (governance deferred to Phase 6)
- NO approval fields (governance deferred to Phase 6)
- NO lifecycle state machine (governance deferred to Phase 6)
- Hashes stored for determinism verification (Phase 5c)

---

## Question 4: Composite Key Structure

**Composite Primary Key:**

```sql
PRIMARY KEY (policy_id UUID, version INTEGER)
```

**Query Patterns in Phase 5B:**
- Lookup specific version: `SELECT * FROM policy_versions WHERE policy_id = $1 AND version = $2`
- List all versions: `SELECT * FROM policy_versions WHERE policy_id = $1 ORDER BY version DESC`
- Lookup latest version: `SELECT * FROM policy_versions WHERE policy_id = $1 ORDER BY version DESC LIMIT 1`

**Why Composite?**
- Same policy_id can have multiple versions (v1, v2, v3, ...)
- Evaluation record stores BOTH policy_id + policy_version (immutable reference)
- Enables deterministic replay: retrieve exact policy version executed
- Allows historical queries: see all policy versions for an evaluation

**Foreign Key Constraint:**
```sql
FOREIGN KEY (policy_id, policy_version) 
  REFERENCES policy_versions(policy_id, version)
```

This ensures evaluations can ONLY reference policies that actually exist.

---

## Question 5: How Will evaluations.policy_id + evaluations.policy_version Map Forward?

**Current State (Phase 5a):**
```
evaluations table has:
  policy_id (UUID)
  policy_version (INTEGER)

These are stored as immutable references, no FK yet.
```

**Phase 5b Change:**
```
Add composite FK constraint to evaluations:
  FOREIGN KEY (policy_id, policy_version) 
    REFERENCES policy_versions(policy_id, version)
```

**Deterministic Lookup Pattern:**

1. **Evaluate endpoint** (Phase 5a - unchanged):
   - Executes policy (source_definition from some policy source)
   - Persists evaluation with policy_id + policy_version
   
2. **PolicyRepository** (Phase 5b):
   - Query: `SELECT * FROM policy_versions WHERE policy_id = ? AND version = ?`
   - Returns: Full policy definition (source_definition, compiled_hash) for that exact version
   - No lifecycle state required (deterministic by identity only)
   
3. **Lookup latest version** (optional in Phase 5b):
   - Query: `SELECT * FROM policy_versions WHERE policy_id = ? ORDER BY version DESC LIMIT 1`
   - Returns: Most recent version
   - No "ACTIVE" status required (deterministic by version ordering)
   
4. **Replay endpoint** (Phase 5c, not in this phase):
   - Retrieves evaluation record
   - Extracts policy_id + policy_version
   - Calls: `SELECT * FROM policy_versions WHERE policy_id = ? AND version = ?`
   - Re-executes with original policy version (deterministic reconstruction)

**FK Constraint Validation:**
- Insert to evaluations will fail if referenced policy_version doesn't exist
- Prevents orphaned evaluations (referential integrity)
- Database enforces consistency

---

## Question 6: Does Phase 5B Require Evaluations Table Redesign?

**Answer: NO (only additive FK constraint)**

**Evaluations table changes:**
- Add composite FOREIGN KEY constraint only
- No new columns
- No new indexes
- No schema redesign

**Constraint to add:**
```sql
ALTER TABLE evaluations
ADD CONSTRAINT fk_policy_version
FOREIGN KEY (policy_id, policy_version)
REFERENCES policy_versions(policy_id, version);
```

**Why this is safe:**
- Constraint is purely additive (no data movement)
- Phase 5a already stores policy_id + policy_version
- No NULL values expected (already required in Phase 5a)
- Constraint only adds validation; doesn't change storage

**Migration approach:**
- Create policy_versions table first
- Add constraint to evaluations after
- Both in single migration for atomicity

---

## Question 7: What is Explicitly Out of Scope?

### NOT IN PHASE 5B (Governance & Lifecycle - Deferred to Phase 6):

❌ **Status Field**
- No `status` column in policy_versions
- No DRAFT|APPROVED|ACTIVE|RETIRED encoding
- Deferred to Phase 6 (not needed for Phase 5b persistence)

❌ **Approval Workflow**
- No `approved_at` field
- No `approved_by` field
- No approval state machine
- No rejection workflow
- No change request workflow
- Deferred to Phase 6a/6b

❌ **Activation Workflow**
- No activation concept
- No "ACTIVE" version constraint
- No "single active version per policy_id" enforcement
- No promotion from APPROVED to ACTIVE
- No retirement workflow
- Deferred to Phase 6a/6b

❌ **Audit Infrastructure**
- No audit_events table
- No audit_hash column
- No audit chain
- No audit logging
- Deferred to Phase 5c

❌ **Replay Infrastructure**
- No replay endpoint
- No determinism verification
- No result hash comparison
- Deferred to Phase 5c

❌ **RBAC**
- No role-based access control
- No Developer/Reviewer/Approver roles
- No permission enforcement
- Deferred to Phase 6c

❌ **Policy Creation/Mutation Endpoints**
- No POST /api/v1/policy/create
- No PATCH /api/v1/policy/:id
- No policy state management endpoints
- Only database schema + read-only lookups

### IN SCOPE (Phase 5b ONLY):

✓ Policies table (metadata, immutable)
✓ Policy_versions table (versioned policies, immutable, governance-free)
✓ Composite key (policy_id, version) for deterministic lookup
✓ PolicyRepository (read-only queries only)
✓ PolicyLookupService (deterministic lookup by explicit policy_id + version)
✓ Composite FK constraint from evaluations (referential integrity)
✓ Integration path: evaluations → policy_versions via composite key
✓ Tests for policy queries and composite key integrity
✓ Deterministic version lookup (by version number, not lifecycle state)

---

## Question 8: Verification Gates

**After Phase 5B implementation, must pass:**

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

6. **Production Build**
   ```bash
   npm run build
   ```
   Expected: Build succeeds without errors

7. **Git Status**
   ```bash
   git status --short
   ```
   Expected: Clean (all changes committed)

**All 7 gates must pass before Phase 5B is considered complete.**

---

## Scope Lock Validation - REVISED (Governance Leakage Corrected)

**Consistency Checks:**

✓ Phase 5b scope aligns with PHASE_5B_IMPLEMENTATION_PLAN.md  
✓ Composite key matches PERSISTENCE_SCHEMA_V1.md definition  
✓ NO status field (governance removed - Phase 6 work)  
✓ NO approval fields (governance removed - Phase 6 work)  
✓ NO lifecycle state machine (governance removed - Phase 6 work)  
✓ NO "ACTIVE" version constraint (governance removed - Phase 6 work)  
✓ Deterministic lookup only (by policy_id + version)  
✓ No governance workflow (deferred to Phase 6a/6b)  
✓ No audit work (deferred to Phase 5c)  
✓ Evaluations table only modified with FK constraint  
✓ All tables immutable (enforced at DB level)  
✓ Migration-governed approach maintained  
✓ Prisma ORM governance maintained  

**Governance Leakage Corrected:**

Previously included (now removed):
- ❌ status field (DRAFT|APPROVED|ACTIVE|RETIRED)
- ❌ approved_at field
- ❌ approved_by field
- ❌ lifecycle state machine language

Now corrected to:
- ✓ Persistence-only schema (policy identity + versions)
- ✓ Deterministic lookup (by explicit policy_id + version)
- ✓ No governance concepts encoded
- ✓ Clean Phase 5b boundary

**Architecture Compliance:**

✓ Matches ENTERPRISE_PLATFORM_ARCHITECTURE_V1.md policy registry section  
✓ Matches POLICY_REGISTRY_ARCHITECTURE_V1.md schema design (Phase 6 activation/approval removed)  
✓ Matches IMPLEMENTATION_ROADMAP_PHASES_5_7.md Phase 5b definition (persistence only)  
✓ CORRECTED: No governance/lifecycle leakage into Phase 5b  

---

## Correction Summary

**Governance Leakage Removed:**

The original scope lock included governance/lifecycle fields that belong to Phase 6, not Phase 5b:
- status (DRAFT|APPROVED|ACTIVE|RETIRED) → REMOVED
- approved_at → REMOVED
- approved_by → REMOVED
- Lifecycle state machine concepts → REMOVED
- "Single active version per policy_id" constraint → REMOVED

**Corrected to Phase 5b Persistence-Only:**

Policy_versions now contains ONLY:
- policy_id (UUID, identity)
- version (INTEGER, identity)
- source_definition (TEXT, the actual policy)
- compiled_hash (CHAR(64), for verification)
- effective_date (DATE, optional)
- created_at (TIMESTAMP, immutable)
- created_by (VARCHAR, optional)

**Lookup Pattern Corrected to Deterministic:**

Phase 5b lookup is now deterministic by identity, not by lifecycle state:
- Query specific version: `WHERE policy_id = ? AND version = ?`
- Query latest version: `WHERE policy_id = ? ORDER BY version DESC LIMIT 1`
- No "ACTIVE" version lookup (Phase 6 work)
- No "current policy" concept (Phase 6 work)

---

## Authorization to Proceed

**This scope lock is corrected and frozen for implementation.**

Implementation will begin immediately after user confirmation.

No deviations from this corrected scope lock without explicit authorization.

All 8 questions answered and validated against architecture documents.

Governance/lifecycle leakage removed. Phase 5b boundary clean.

**Ready for Phase 5B coding phase.**

---

**Scope Lock Status: CORRECTED AND APPROVED ✓**
