# Persistence Schema V1

**Date:** June 22, 2026  
**Status:** Schema Design (Ready for Implementation)  
**Database:** PostgreSQL 14+ (ACID, JSONB, Foreign Keys)  
**Primary Constraint:** Immutability, Auditability, Determinism

---

## Table Definitions

### 1. evaluations

**Purpose:** Immutable store of all evaluation executions.

```sql
CREATE TABLE evaluations (
  -- Identity
  evaluation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Subject & Cohort
  subject_id VARCHAR(255) NOT NULL,
  cohort_key VARCHAR(255) NOT NULL,
  
  -- Policy Reference
  policy_id UUID NOT NULL,
  policy_version INTEGER NOT NULL,
  policy_hash CHAR(64) NOT NULL,  -- SHA-256
  
  -- Timing
  evaluation_timestamp TIMESTAMP(6) WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP(6) WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Input/Output Hashing
  payload_hash CHAR(64) NOT NULL,  -- SHA-256 of input
  result_hash CHAR(64) NOT NULL,   -- SHA-256 of output
  
  -- Results
  classification VARCHAR(32) NOT NULL,  -- PASS, FAIL, REVIEW, etc.
  violation_score INTEGER NOT NULL DEFAULT 0,
  triggered_reason_codes TEXT[] NOT NULL DEFAULT '{}',  -- Array of code IDs
  
  -- Audit/Chain
  audit_hash CHAR(64) NOT NULL,  -- SHA-256 chain link
  
  -- Constraints
  CONSTRAINT fk_policy FOREIGN KEY (policy_id, policy_version) 
    REFERENCES policy_versions(policy_id, version),
  CONSTRAINT immutable_record CHECK (created_at IS NOT NULL)
);

-- Indexes for query performance
CREATE INDEX idx_evaluations_subject_id ON evaluations(subject_id);
CREATE INDEX idx_evaluations_cohort_key ON evaluations(cohort_key);
CREATE INDEX idx_evaluations_evaluation_timestamp ON evaluations(evaluation_timestamp DESC);
CREATE INDEX idx_evaluations_policy_id ON evaluations(policy_id, policy_version);
CREATE INDEX idx_evaluations_created_at ON evaluations(created_at DESC);

-- Hash index for lookups by hash
CREATE INDEX idx_evaluations_result_hash ON evaluations USING HASH (result_hash);

-- Prevent any updates or deletes (immutability)
CREATE TRIGGER immutability_evaluations
BEFORE UPDATE OR DELETE ON evaluations
FOR EACH ROW
EXECUTE FUNCTION raise_immutability_error();
```

**Immutability Enforcement:**
```sql
CREATE OR REPLACE FUNCTION raise_immutability_error()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Table evaluations is immutable. Cannot modify or delete records.';
END;
$$ LANGUAGE plpgsql;
```

**Retention Strategy:**
- FINRA requirement: 6+ years
- Recommendation: 7 years minimum
- Archive to cold storage after 3 years
- SQL: `SELECT * FROM evaluations WHERE created_at < NOW() - INTERVAL '3 years'` → Archive

---

### 2. policy_versions

**Purpose:** Immutable versioned store of policies with governance metadata.

```sql
CREATE TABLE policy_versions (
  -- Identity
  policy_id UUID NOT NULL,
  version INTEGER NOT NULL,
  
  -- Definition & Hash
  source_definition TEXT NOT NULL,  -- Original DSL
  compiled_hash CHAR(64) NOT NULL,  -- SHA-256 of compiled form
  
  -- Lifecycle
  status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',  -- DRAFT, APPROVED, ACTIVE, RETIRED
  effective_date DATE,
  
  -- Governance
  approved_by VARCHAR(255),  -- User ID or system
  approved_at TIMESTAMP(6) WITH TIME ZONE,
  
  -- Audit
  created_at TIMESTAMP(6) WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by VARCHAR(255) NOT NULL,
  
  -- Constraints
  PRIMARY KEY (policy_id, version),
  CONSTRAINT status_valid CHECK (status IN ('DRAFT', 'APPROVED', 'ACTIVE', 'RETIRED')),
  CONSTRAINT immutable_policy CHECK (created_at IS NOT NULL)
);

-- Indexes
CREATE INDEX idx_policy_versions_status ON policy_versions(status);
CREATE INDEX idx_policy_versions_effective_date ON policy_versions(effective_date DESC);
CREATE INDEX idx_policy_versions_created_at ON policy_versions(created_at DESC);

-- Unique active version per policy
CREATE UNIQUE INDEX idx_single_active_version 
  ON policy_versions(policy_id) 
  WHERE status = 'ACTIVE';

-- Prevent updates/deletes (immutability)
CREATE TRIGGER immutability_policy_versions
BEFORE UPDATE OR DELETE ON policy_versions
FOR EACH ROW
EXECUTE FUNCTION raise_immutability_error();
```

**Special Constraint:** Only ONE active version per policy_id at a time.

**Workflow:**
```
1. Policy created with status = DRAFT
2. Reviewed (still DRAFT)
3. Approved: status = APPROVED
4. Deployed: status = ACTIVE (only this one per policy)
5. Retired: status = RETIRED (when new version becomes ACTIVE)
```

---

### 3. audit_events

**Purpose:** Append-only immutable audit trail.

```sql
CREATE TABLE audit_events (
  -- Identity
  audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Event Type
  event_type VARCHAR(64) NOT NULL,  -- EVALUATION, REPLAY, POLICY_PUBLISH, POLICY_RETIRE, etc.
  
  -- Timing
  event_timestamp TIMESTAMP(6) WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP(6) WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Actor
  actor_id VARCHAR(255),  -- User ID, system principal, or NULL for system events
  
  -- Subject Reference
  subject_type VARCHAR(32),  -- 'evaluation', 'policy', 'user', etc.
  subject_id VARCHAR(255),   -- evaluation_id, policy_id, etc.
  
  -- Details & Audit
  details JSONB NOT NULL,  -- Flexible: {action, reason, old_value, new_value, etc.}
  audit_hash CHAR(64) NOT NULL,  -- SHA-256 chain link to prior event
  
  -- Immutability
  CONSTRAINT immutable_audit CHECK (created_at IS NOT NULL)
);

-- Indexes
CREATE INDEX idx_audit_events_event_type ON audit_events(event_type);
CREATE INDEX idx_audit_events_subject_type ON audit_events(subject_type, subject_id);
CREATE INDEX idx_audit_events_actor_id ON audit_events(actor_id);
CREATE INDEX idx_audit_events_event_timestamp ON audit_events(event_timestamp DESC);
CREATE INDEX idx_audit_events_created_at ON audit_events(created_at DESC);

-- Hash chain index
CREATE INDEX idx_audit_events_audit_hash ON audit_events USING HASH (audit_hash);

-- Append-only: no updates or deletes
CREATE TRIGGER immutability_audit_events
BEFORE UPDATE OR DELETE ON audit_events
FOR EACH ROW
EXECUTE FUNCTION raise_immutability_error();
```

**Audit Hash Chain:**
```
audit_event_N.audit_hash = SHA256(audit_event_(N-1).audit_id + audit_event_N.details)
```

This creates a cryptographic chain that prevents tampering with history without detection.

---

### 4. policy_changes

**Purpose:** Governance track of policy modifications and approvals.

```sql
CREATE TABLE policy_changes (
  -- Identity
  change_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID NOT NULL,
  
  -- Version Transition
  from_version INTEGER,  -- NULL if creating new policy
  to_version INTEGER NOT NULL,
  
  -- Summary
  change_summary TEXT NOT NULL,
  
  -- Approval
  approver_id VARCHAR(255) NOT NULL,
  approved_at TIMESTAMP(6) WITH TIME ZONE NOT NULL,
  
  -- Hash
  change_hash CHAR(64) NOT NULL,  -- SHA-256 of this change
  
  -- Link to Audit
  audit_event_id UUID,  -- Foreign key → audit_events
  
  -- Timing
  created_at TIMESTAMP(6) WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT fk_audit FOREIGN KEY (audit_event_id) REFERENCES audit_events(audit_id),
  CONSTRAINT immutable_change CHECK (created_at IS NOT NULL)
);

-- Indexes
CREATE INDEX idx_policy_changes_policy_id ON policy_changes(policy_id);
CREATE INDEX idx_policy_changes_approver_id ON policy_changes(approver_id);
CREATE INDEX idx_policy_changes_approved_at ON policy_changes(approved_at DESC);

-- Immutability
CREATE TRIGGER immutability_policy_changes
BEFORE UPDATE OR DELETE ON policy_changes
FOR EACH ROW
EXECUTE FUNCTION raise_immutability_error();
```

**Use Case:** "Show me all changes to Policy X and who approved them."

---

## Views (Derived, Read-Only)

### evaluation_audit_trail

```sql
CREATE VIEW evaluation_audit_trail AS
SELECT 
  e.evaluation_id,
  e.subject_id,
  e.cohort_key,
  e.classification,
  e.triggered_reason_codes,
  e.evaluation_timestamp,
  ae.event_type,
  ae.actor_id,
  ae.details,
  ae.created_at
FROM evaluations e
LEFT JOIN audit_events ae ON ae.subject_id = e.evaluation_id::text 
  AND ae.subject_type = 'evaluation'
ORDER BY e.evaluation_timestamp DESC, ae.created_at DESC;
```

**Use Case:** "Show me the complete audit trail for evaluation X."

### active_policies

```sql
CREATE VIEW active_policies AS
SELECT 
  policy_id,
  version,
  effective_date,
  source_definition,
  compiled_hash
FROM policy_versions
WHERE status = 'ACTIVE';
```

**Use Case:** "Which policy version should we use for new evaluations?"

### policy_history

```sql
CREATE VIEW policy_history AS
SELECT 
  p.policy_id,
  p.version,
  p.status,
  p.effective_date,
  pc.change_summary,
  pc.approver_id,
  pc.approved_at,
  COUNT(e.evaluation_id) as evaluation_count
FROM policy_versions p
LEFT JOIN policy_changes pc ON pc.to_version = p.version
LEFT JOIN evaluations e ON e.policy_id = p.policy_id 
  AND e.policy_version = p.version
GROUP BY p.policy_id, p.version, p.status, p.effective_date, 
         pc.change_summary, pc.approver_id, pc.approved_at
ORDER BY p.policy_id, p.version DESC;
```

**Use Case:** "Show me version history with approval details and usage counts."

---

## Constraints & Immutability

### Hash Chain Algorithm

The audit_hash field maintains a cryptographic chain for tamper detection:

```sql
-- Hash chain computation function
CREATE OR REPLACE FUNCTION compute_audit_hash(
  prev_audit_id UUID,
  event_payload_hash CHAR(64),
  event_timestamp TIMESTAMP(6) WITH TIME ZONE,
  event_type VARCHAR(64)
) RETURNS CHAR(64) AS $$
SELECT encode(
  digest(
    concat(
      COALESCE(prev_audit_id::text, ''),
      event_payload_hash,
      extract(epoch from event_timestamp)::text,
      event_type
    ),
    'sha256'
  ),
  'hex'
) AS audit_hash;
$$ LANGUAGE SQL;

-- Usage: Each audit event computes hash as:
-- audit_hash = SHA256(prior_audit_id + current_payload_hash + timestamp + event_type)
-- This creates an unbreakable chain where tampering any event would break all subsequent hashes.
```

**Verification:** To detect tampering, recalculate all hashes and verify each matches stored value.

### Database-Level Enforcement

1. **Immutable Triggers:** All tables have `BEFORE UPDATE OR DELETE` triggers that raise exceptions
2. **Primary Keys:** Never reused, ever
3. **Foreign Keys:** Cascading deletes disabled (prevent accidents)
4. **Check Constraints:** Status enums, timestamp NOT NULL
5. **Hash Chain:** Each audit event links to prior event via hash computation

### Application-Level Enforcement

1. **No UPDATE statements:** Ever
2. **No DELETE statements:** Ever
3. **No TRUNCATE operations:** Ever
4. **Read-only replicas for audit queries**
5. **Write-only primary replica for evaluation logging**

### Operational Enforcement

1. **Backups:** Immutable backup storage
2. **Archive:** Move old data to cold storage (read-only)
3. **Compliance:** 7-year retention minimum (FINRA)
4. **Audit:** All access logged (audit_events table)

---

## Indexing Strategy

### For Evaluation Queries
```sql
-- "Find all evaluations for subject X"
CREATE INDEX idx_evaluations_subject_id ON evaluations(subject_id);

-- "Find evaluations in cohort Y"
CREATE INDEX idx_evaluations_cohort_key ON evaluations(cohort_key);

-- "Find recent evaluations"
CREATE INDEX idx_evaluations_created_at ON evaluations(created_at DESC);

-- "Verify result hash (replay detection)"
CREATE INDEX idx_evaluations_result_hash ON evaluations USING HASH (result_hash);
```

### For Policy Queries
```sql
-- "Which policies are active?"
CREATE UNIQUE INDEX idx_single_active_version 
  ON policy_versions(policy_id) WHERE status = 'ACTIVE';

-- "Policy history"
CREATE INDEX idx_policy_versions_status ON policy_versions(status);
```

### For Audit Queries
```sql
-- "Show me all evaluation events"
CREATE INDEX idx_audit_events_event_type ON audit_events(event_type);

-- "Audit trail for evaluation X"
CREATE INDEX idx_audit_events_subject_type 
  ON audit_events(subject_type, subject_id);

-- "Who made changes and when"
CREATE INDEX idx_audit_events_actor_id ON audit_events(actor_id);
```

---

## Performance Considerations

### Write Performance
- Evaluation inserts: Lock-free (immutable append)
- Audit events: Async logging (< 50ms overhead)
- Index maintenance: Automatic, tuned for append-only workload

### Read Performance
- Subject lookups: O(log n) via index
- Replay queries: Cached policy version lookups
- Audit queries: Time-based partitioning (future optimization)

### Scalability
- Horizontal: Read replicas for audit queries
- Vertical: Index tuning, connection pooling
- Partitioning: By evaluation_timestamp (future, yearly partitions)

---

## Retention & Archive Strategy

### Hot Storage (PostgreSQL, < 3 years)
- Full ACID properties
- Immediate replay available
- Real-time audit trail access
- Indexing optimized

### Warm Storage (Archive table, 3-7 years)
- Read-only snapshots
- Compressed storage
- Index maintained for compliance queries
- Tape backup

### Cold Storage (Tape archive, 7+ years)
- Regulatory hold compliance
- Immutable (no modification possible)
- Emergency retrieval only

```sql
-- Archive procedure (run annually)
INSERT INTO evaluations_archive 
SELECT * FROM evaluations 
WHERE created_at < NOW() - INTERVAL '3 years'
AND NOT EXISTS (
  SELECT 1 FROM audit_events 
  WHERE subject_id = evaluations.evaluation_id::text
  AND created_at > NOW() - INTERVAL '3 years'
);

DELETE FROM evaluations 
WHERE created_at < NOW() - INTERVAL '3 years';
```

---

## Migration Checklist

When deploying this schema:

- [ ] Create all tables with constraints
- [ ] Create all indexes
- [ ] Create all views
- [ ] Create immutability triggers
- [ ] Create archive procedures
- [ ] Test immutability (verify UPDATE/DELETE fail)
- [ ] Test uniqueness constraints
- [ ] Backup existing evaluation records (if migrating)
- [ ] Verify hash chain integrity
- [ ] Load test (expected throughput)
- [ ] Verify audit logging works
- [ ] Document backup strategy

---

## Success Criteria

The schema is production-ready when:

1. **Immutability:** UPDATE/DELETE fail with error
2. **Auditability:** Every event is logged
3. **Performance:** Evaluation insert < 50ms p99
4. **Compliance:** 7-year retention configured
5. **Verification:** Replay queries work exactly
6. **Chain:** Audit hash chain verifiable

---

**This schema enables enterprise-grade evaluation storage with regulatory compliance and determinism verification.**
