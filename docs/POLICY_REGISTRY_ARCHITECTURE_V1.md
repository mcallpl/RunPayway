# Policy Registry Architecture V1

**Date:** June 22, 2026  
**Status:** Architecture Design (Ready for Implementation)  
**Purpose:** Governance-enforced, versioned policy management enabling institutional policy lifecycle

---

## Policy Lifecycle

```
DRAFT
  ↓ (internal review, refinement)
  
APPROVED  
  ↓ (validation complete, ready to deploy)
  
ACTIVE (only one per policy_id at a time)
  ↓ (operational, evaluations use this version)
  
RETIRED (superseded by new version)
  ↓ (historical archive, still queryable)
  
[END OF LIFE - 7 year retention]
```

---

## Key Principles

### 1. Immutability
- Once a policy version is published, it NEVER changes
- If a policy needs to change, create a NEW version
- Old versions remain accessible for replay and audit
- Ensures evaluations can always be reconstructed

### 2. Single Active Version
- Only ONE version of a policy can be ACTIVE at a time
- New evaluations use the active version
- Retiring a version requires activating a replacement
- No orphaned evaluations (policy version always exists)

### 3. Governance-Enforced
- No direct edits to active policies
- All changes require explicit approval workflow
- Change tracking mandatory
- Audit trail links approver to decision

### 4. Historical Accuracy
- Every evaluation points to exact policy version used
- Replays use original version (not current version)
- Historical queries show version at time of evaluation
- Enables perfect reconstruction

---

## Policy Registry Schema

### Core Tables

**policies** (metadata)
```sql
CREATE TABLE policies (
  policy_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  policy_type VARCHAR(64),  -- 'INCOME_STABILITY', etc.
  created_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(255)
);
```

**policy_versions** (immutable, versioned)
```sql
CREATE TABLE policy_versions (
  policy_id UUID NOT NULL,
  version INTEGER NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',  -- DRAFT, APPROVED, ACTIVE, RETIRED
  
  -- Definition
  source_definition TEXT NOT NULL,  -- Original DSL/JSON
  compiled_hash CHAR(64) NOT NULL,  -- SHA-256 of compiled form
  
  -- Lifecycle
  effective_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(255),
  approved_at TIMESTAMP,
  approved_by VARCHAR(255),
  activated_at TIMESTAMP,
  activated_by VARCHAR(255),
  
  PRIMARY KEY (policy_id, version),
  FOREIGN KEY (policy_id) REFERENCES policies(policy_id),
  CONSTRAINT immutable CHECK (created_at IS NOT NULL)
);

-- Unique active version per policy
CREATE UNIQUE INDEX idx_single_active 
  ON policy_versions(policy_id) 
  WHERE status = 'ACTIVE';

-- Prevent mutations
CREATE TRIGGER immutability_policy_versions
BEFORE UPDATE OR DELETE ON policy_versions
FOR EACH ROW EXECUTE FUNCTION raise_immutability_error();
```

**policy_changes** (governance record)
```sql
CREATE TABLE policy_changes (
  change_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID NOT NULL,
  
  -- Transition
  from_version INTEGER,  -- NULL if new policy
  to_version INTEGER NOT NULL,
  
  -- Description
  change_summary TEXT NOT NULL,
  change_details JSONB,  -- Structured diff if applicable
  
  -- Approval
  requested_by VARCHAR(255),
  requested_at TIMESTAMP,
  approver_id VARCHAR(255),
  approved_at TIMESTAMP,
  status VARCHAR(32),  -- PENDING, APPROVED, REJECTED
  approval_notes TEXT,
  
  -- Audit
  change_hash CHAR(64),  -- SHA-256
  audit_event_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (policy_id) REFERENCES policies(policy_id),
  FOREIGN KEY (audit_event_id) REFERENCES audit_events(audit_id),
  CONSTRAINT immutable CHECK (created_at IS NOT NULL)
);

CREATE TRIGGER immutability_policy_changes
BEFORE UPDATE OR DELETE ON policy_changes
FOR EACH ROW EXECUTE FUNCTION raise_immutability_error();
```

---

## Policy Promotion Workflow

### Step 1: Draft Policy Creation
```
User: "I want to create a new income stability policy"
Action: Create policy_versions row with status='DRAFT'

Example:
{
  "policy_id": "uuid",
  "version": 1,
  "status": "DRAFT",
  "source_definition": "... DSL ...",
  "created_by": "alice@company.com",
  "created_at": NOW()
}
```

### Step 2: Review & Validation
```
Internal review process (outside system):
- Peer review of policy logic
- Compliance check (fair lending, ECOA, etc.)
- Validation against requirements
- Testing in sandbox environment

No database state change yet.
```

### Step 3: Approval
```
Approver: "This policy is ready to go live"
Action: Update policy_versions set status='APPROVED'

Database update:
{
  "version": 1,
  "status": "APPROVED",
  "approved_by": "bob@company.com",
  "approved_at": NOW(),
  "compiled_hash": "sha256_of_compiled_policy"
}

Create audit event:
{
  "event_type": "POLICY_APPROVED",
  "policy_id": "uuid",
  "version": 1,
  "approved_by": "bob@company.com"
}
```

### Step 4: Activation
```
Operator: "Deploy this policy"
Action: Update policy_versions set status='ACTIVE' for this version
        Update prior active version to status='RETIRED'

Database update:
{
  "version": 1,
  "status": "ACTIVE",
  "activated_by": "charlie@company.com",
  "activated_at": NOW()
}

If prior version exists:
{
  "version": 0,
  "status": "RETIRED"
}

Create audit events:
{
  "event_type": "POLICY_ACTIVATED",
  "policy_id": "uuid",
  "version": 1,
  "activated_by": "charlie@company.com"
}
{
  "event_type": "POLICY_RETIRED",
  "policy_id": "uuid",
  "version": 0,
  "retired_by": "charlie@company.com",
  "reason": "Replaced by v1"
}
```

### Step 5: Retirement (Automatic on Replacement)
```
When a new version is activated, prior version automatically retires.
This is enforced by database trigger.

Constraint: Only one version can have status='ACTIVE' per policy_id
```

---

## No Breaking Changes Rule

### What You CAN Do (Safe Changes)
```
1. Add new conditions (output can be more specific)
2. Add new reason codes (more granularity)
3. Refactor internal logic (same output, different implementation)
4. Add comments/documentation
5. Fix bugs (output corrected, version bump)
```

### What You CANNOT Do (Breaking Changes)
```
1. Remove conditions (might change output for existing evaluations)
2. Remove reason codes (would break audit trail interpretation)
3. Change output type or semantics
4. Change classification (PASS/FAIL/REVIEW)
5. Modify input schema
```

**Enforcement:** Code review + approval workflow prevents breaking changes.

---

## Policy Query Examples

### Query 1: Which Policy Should We Use?
```sql
SELECT 
  p.policy_id,
  p.name,
  pv.version,
  pv.effective_date
FROM policies p
JOIN policy_versions pv ON p.policy_id = pv.policy_id
WHERE pv.status = 'ACTIVE';
```

**Response:** Use `policies.uuid` version X for new evaluations.

---

### Query 2: Policy History
```sql
SELECT 
  pv.version,
  pv.status,
  pv.effective_date,
  pv.created_by,
  pv.approved_by,
  pv.activated_by,
  COUNT(e.evaluation_id) as evaluation_count
FROM policy_versions pv
LEFT JOIN evaluations e ON e.policy_id = pv.policy_id 
  AND e.policy_version = pv.version
WHERE pv.policy_id = $1
GROUP BY pv.version, pv.status, pv.effective_date, 
         pv.created_by, pv.approved_by, pv.activated_by
ORDER BY pv.version DESC;
```

**Response:** Complete version history with usage counts.

---

### Query 3: Policy Change Audit Trail
```sql
SELECT 
  pc.change_id,
  pc.from_version,
  pc.to_version,
  pc.change_summary,
  pc.requested_by,
  pc.approver_id,
  pc.approved_at,
  pc.status
FROM policy_changes pc
WHERE pc.policy_id = $1
ORDER BY pc.approved_at DESC;
```

**Response:** Who requested what changes, who approved, when.

---

### Query 4: Evaluations Using Policy Version X
```sql
SELECT 
  COUNT(*) as total_evaluations,
  COUNT(DISTINCT e.subject_id) as unique_subjects,
  COUNT(DISTINCT e.cohort_key) as unique_cohorts,
  MIN(e.evaluation_timestamp) as first_evaluation,
  MAX(e.evaluation_timestamp) as last_evaluation
FROM evaluations e
WHERE e.policy_id = $1 
  AND e.policy_version = $2;
```

**Response:** Impact analysis before retirement.

---

## Governance Views

### active_policies
```sql
CREATE VIEW active_policies AS
SELECT 
  p.policy_id,
  p.name,
  pv.version,
  pv.effective_date,
  pv.activated_by,
  pv.activated_at
FROM policies p
JOIN policy_versions pv ON p.policy_id = pv.policy_id
WHERE pv.status = 'ACTIVE';
```

**Use:** "Which policies are live right now?"

### policy_versions_with_usage
```sql
CREATE VIEW policy_versions_with_usage AS
SELECT 
  pv.policy_id,
  pv.version,
  pv.status,
  pv.effective_date,
  COUNT(e.evaluation_id) as evaluation_count,
  MIN(e.evaluation_timestamp) as first_use,
  MAX(e.evaluation_timestamp) as last_use
FROM policy_versions pv
LEFT JOIN evaluations e ON e.policy_id = pv.policy_id 
  AND e.policy_version = pv.version
GROUP BY pv.policy_id, pv.version, pv.status, pv.effective_date;
```

**Use:** "How widely is each policy version used?"

### pending_approvals
```sql
CREATE VIEW pending_approvals AS
SELECT 
  pc.change_id,
  p.name as policy_name,
  pc.from_version,
  pc.to_version,
  pc.change_summary,
  pc.requested_by,
  pc.requested_at
FROM policy_changes pc
JOIN policies p ON pc.policy_id = p.policy_id
WHERE pc.status = 'PENDING'
ORDER BY pc.requested_at ASC;
```

**Use:** "What policies are waiting for approval?"

---

## Approval Workflow

### State Machine
```
REQUEST_CHANGE
  ↓ (Review & Test)
PENDING_APPROVAL
  ↓ (Decision)
APPROVED or REJECTED
  ↓ (If approved)
DEPLOY
  ↓ (If deploy)
ACTIVE
```

### Roles & Permissions

| Role | Permissions |
|------|-------------|
| Policy Developer | Create drafts, request changes |
| Policy Reviewer | Review drafts, propose improvements |
| Policy Approver | Approve policy changes |
| Operator | Activate approved policies |
| Auditor | Read-only access to all policy history |

### Approval API
```
POST /api/v1/policy/change
{
  "policy_id": "uuid",
  "from_version": 1,
  "to_version": 2,
  "change_summary": "Updated income threshold from $50k to $60k",
  "requested_by": "alice@company.com"
}
Response: change_id, status=PENDING

POST /api/v1/policy/change/:change_id/approve
{
  "approver_id": "bob@company.com",
  "approval_notes": "Validated against requirements"
}
Response: change_id, status=APPROVED

POST /api/v1/policy/activate
{
  "policy_id": "uuid",
  "version": 2,
  "activated_by": "charlie@company.com"
}
Response: success, prior version retired
```

---

## Policy Registry Success Criteria

1. **Immutability:** Cannot modify published policies
2. **Versioning:** Each change is a new version
3. **Active Uniqueness:** One active version per policy
4. **Auditability:** All changes logged
5. **Historical Access:** Old versions queryable
6. **Governance:** Approval workflow enforced
7. **Traceability:** Evaluations → exact policy version

---

## Future Enhancements

1. **Policy Diffing:** Show exact changes between versions
2. **A/B Testing:** Run two policy versions simultaneously (with tracking)
3. **Rollback:** Reactivate prior version (with audit trail)
4. **Policy Inheritance:** Template-based policy creation
5. **Policy Testing:** Automated test suite per version
6. **Impact Analysis:** Predict effect of new version on historical data

---

**This policy registry architecture enables institutional governance of evaluation logic with full auditability and deterministic reconstruction.**
