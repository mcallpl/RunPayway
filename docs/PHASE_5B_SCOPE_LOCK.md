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

**Purpose:** Immutable, versioned policy storage with lifecycle metadata

**Field Definition:**

```
policy_versions (
  policy_id (UUID, composite FK → policies.policy_id)
  version (INTEGER)
  
  status (VARCHAR(32): DRAFT|APPROVED|ACTIVE|RETIRED, default DRAFT)
  
  source_definition (TEXT, immutable after creation)
  compiled_hash (CHAR(64), SHA-256)
  
  effective_date (DATE, optional)
  
  created_at (TIMESTAMP, default NOW(), immutable)
  created_by (VARCHAR(255))
  
  approved_at (TIMESTAMP, optional, Phase 6 - NOT SET IN PHASE 5B)
  approved_by (VARCHAR(255), optional, Phase 6 - NOT SET IN PHASE 5B)
)
```

**Constraints:**
- Composite PRIMARY KEY: (policy_id, version)
- FOREIGN KEY: policy_id → policies.policy_id
- No UPDATE allowed (immutable)
- No DELETE allowed (immutable)
- Unique ACTIVE version per policy_id (UNIQUE INDEX WHERE status='ACTIVE')

**Indexes:**
- Composite PK index (policy_id, version)
- Unique active version constraint: UNIQUE(policy_id) WHERE status='ACTIVE'
- Index on status for active policy lookups
- Index on created_at for time-based queries

**Rationale:**
- Composite key enables exact policy version retrieval for replay (Phase 5c)
- Immutability enforced at DB level
- Single active version constraint prevents ambiguity
- Status field enables lifecycle (even though transitions not in Phase 5b)
- Hashes stored for determinism verification (Phase 5c)

---

## Question 4: Composite Key Structure

**Composite Primary Key:**

```sql
PRIMARY KEY (policy_id UUID, version INTEGER)
```

**Usage Pattern:**
- Lookup specific version: `SELECT * FROM policy_versions WHERE policy_id = $1 AND version = $2`
- Lookup active version: `SELECT * FROM policy_versions WHERE policy_id = $1 AND status = 'ACTIVE'`
- List all versions: `SELECT * FROM policy_versions WHERE policy_id = $1 ORDER BY version DESC`

**Why Composite?**
- Same policy_id can have multiple versions (v1, v2, v3, ...)
- Evaluation record stores BOTH policy_id + policy_version
- Enables deterministic replay: retrieve exact policy version used
- Prevents accidental polymorphism (two rows with same policy_id, different versions confusing)

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

These are stored as VALUES, but no FK constraint yet.
```

**Phase 5b Change:**
```
Add composite FK constraint to evaluations:
  FOREIGN KEY (policy_id, policy_version) 
    REFERENCES policy_versions(policy_id, version)
```

**Mapping in Practice:**

1. **Evaluate endpoint** (Phase 5a code, unchanged):
   - Executes policy
   - Persists evaluation with policy_id + policy_version
   
2. **New PolicyLookupService** (Phase 5b):
   - Query: `SELECT * FROM policy_versions WHERE policy_id = ? AND version = ?`
   - Returns: Full policy definition for that version
   - Used by evaluate endpoint to get active policy
   
3. **Replay endpoint** (Phase 5c, not in this phase):
   - Retrieves evaluation record
   - Extracts policy_id + policy_version
   - Calls: `SELECT * FROM policy_versions WHERE policy_id = ? AND version = ?`
   - Re-executes with original policy version

**FK Constraint Validation:**
- Insert to evaluations will fail if referenced policy_version doesn't exist
- Prevents orphaned evaluations
- Database enforces referential integrity

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

### NOT IN PHASE 5B:

❌ **Governance Workflow**
- No approval endpoint
- No approval state machine
- No rejection workflow
- No change request workflow
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

❌ **Activation Workflow**
- No activation endpoint
- No promotion from APPROVED to ACTIVE
- No retirement workflow
- No state transitions
- Deferred to Phase 6a/6b

❌ **RBAC**
- No role-based access control
- No Developer/Reviewer/Approver roles
- Deferred to Phase 6c

❌ **Policy Creation/Mutation Endpoints**
- No POST /api/v1/policy/create
- No PATCH /api/v1/policy/:id
- No policy state management endpoints
- Only database schema + read-only lookups

### IN SCOPE (Phase 5b ONLY):

✓ Policies table (metadata)
✓ Policy_versions table (versioned policies)
✓ Composite key (policy_id, version)
✓ PolicyRepository (read-only queries)
✓ PolicyLookupService (for evaluate endpoint)
✓ Composite FK constraint from evaluations
✓ Integration path for policy lookup
✓ Tests for policy queries and composite keys

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

## Scope Lock Validation

**Consistency Checks:**

✓ Phase 5B scope aligns with PHASE_5B_IMPLEMENTATION_PLAN.md  
✓ Composite key matches PERSISTENCE_SCHEMA_V1.md definition  
✓ No governance work (deferred to Phase 6)  
✓ No audit work (deferred to Phase 5c)  
✓ Evaluations table only modified with FK constraint  
✓ All tables immutable (enforced at DB level)  
✓ Migration-governed approach maintained  
✓ Prisma ORM governance maintained  

**Architecture Compliance:**

✓ Matches ENTERPRISE_PLATFORM_ARCHITECTURE_V1.md policy registry section  
✓ Matches POLICY_REGISTRY_ARCHITECTURE_V1.md schema design  
✓ Matches IMPLEMENTATION_ROADMAP_PHASES_5_7.md Phase 5b definition  

---

## Authorization to Proceed

**This scope lock is frozen and approved for implementation.**

Implementation will begin immediately after user confirmation.

No deviations from this scope lock without explicit authorization.

All 8 questions answered and validated against architecture documents.

**Ready for Phase 5B coding phase.**

---

**Scope Lock Status: APPROVED ✓**
