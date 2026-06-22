# Audit Architecture V1

**Date:** June 22, 2026  
**Status:** Architecture Design (Ready for Implementation)  
**Purpose:** Institutional-grade audit trail enabling regulatory compliance and determinism verification

---

## Audit Philosophy

**The audit system transforms RunPayway from a tool into an institution.**

Every decision must be:
- **Traceable:** Why did we make this decision?
- **Verifiable:** Can we prove we made it the same way every time?
- **Auditable:** Can an external auditor reconstruct the exact decision?
- **Defensible:** If challenged, can we prove we acted consistently and fairly?

---

## Audit Event Types

### 1. Evaluation Events

**EVALUATION_CREATED**
```json
{
  "event_type": "EVALUATION_CREATED",
  "evaluation_id": "uuid",
  "subject_id": "string",
  "cohort_key": "string",
  "policy_id": "uuid",
  "policy_version": 3,
  "policy_hash": "sha256_hash",
  "payload_hash": "sha256_hash",
  "result_hash": "sha256_hash",
  "classification": "PASS",
  "timestamp": "ISO8601_nanoseconds"
}
```

**Storage Strategy:** audit_events.details stores event references and evidence metadata (hashes, classifications), not full duplicated evaluation records. Full data lives in evaluations table; audit_events maintains chain integrity and event history.

**When:** Every evaluation created (required for audit trail)  
**Logged by:** Evaluation service  
**Impact:** Creates audit trail entry with chain link to prior event

**EVALUATION_REPLAYED**
```json
{
  "event_type": "EVALUATION_REPLAYED",
  "evaluation_id": "uuid",
  "replay_timestamp": "ISO8601_nanoseconds",
  "original_policy_hash": "sha256",
  "replay_policy_hash": "sha256",
  "result_match": true,
  "discrepancies": null
}
```

**When:** Replay endpoint called  
**Logged by:** Replay service  
**Impact:** Proves determinism or detects issues

---

### 2. Policy Lifecycle Events

**POLICY_DRAFT_CREATED**
```json
{
  "event_type": "POLICY_DRAFT_CREATED",
  "policy_id": "uuid",
  "version": 1,
  "created_by": "user_id",
  "source_hash": "sha256",
  "summary": "Initial policy definition"
}
```

**POLICY_APPROVED**
```json
{
  "event_type": "POLICY_APPROVED",
  "policy_id": "uuid",
  "version": 1,
  "approved_by": "user_id",
  "approved_at": "ISO8601_nanoseconds",
  "approval_summary": "Reviewed and validated against requirements",
  "compiled_hash": "sha256"
}
```

**POLICY_ACTIVATED**
```json
{
  "event_type": "POLICY_ACTIVATED",
  "policy_id": "uuid",
  "version": 1,
  "activated_by": "user_id",
  "activated_at": "ISO8601_nanoseconds",
  "prior_active_version": 0,
  "effective_date": "2026-06-22"
}
```

**POLICY_RETIRED**
```json
{
  "event_type": "POLICY_RETIRED",
  "policy_id": "uuid",
  "version": 1,
  "retired_by": "user_id",
  "retired_at": "ISO8601_nanoseconds",
  "reason": "Replaced by v2",
  "evaluation_count_on_this_version": 15000
}
```

---

### 3. Governance Events

**POLICY_CHANGE_REQUESTED**
```json
{
  "event_type": "POLICY_CHANGE_REQUESTED",
  "policy_id": "uuid",
  "from_version": 1,
  "to_version": 2,
  "change_summary": "Updated income threshold from $50k to $60k",
  "requested_by": "user_id",
  "requested_at": "ISO8601_nanoseconds",
  "justification": "Market analysis shows new threshold appropriate"
}
```

**POLICY_CHANGE_APPROVED**
```json
{
  "event_type": "POLICY_CHANGE_APPROVED",
  "policy_id": "uuid",
  "change_id": "uuid",
  "approved_by": "user_id",
  "approved_at": "ISO8601_nanoseconds",
  "approval_notes": "Verified against compliance requirements"
}
```

**POLICY_CHANGE_REJECTED**
```json
{
  "event_type": "POLICY_CHANGE_REJECTED",
  "policy_id": "uuid",
  "change_id": "uuid",
  "rejected_by": "user_id",
  "rejected_at": "ISO8601_nanoseconds",
  "rejection_reason": "Threshold change violates fair lending guidelines"
}
```

---

### 4. Access & Security Events

**AUDIT_TRAIL_ACCESSED**
```json
{
  "event_type": "AUDIT_TRAIL_ACCESSED",
  "accessed_by": "user_id",
  "accessed_at": "ISO8601_nanoseconds",
  "query_type": "subject_evaluation_history",
  "subject_id": "string",
  "records_returned": 42,
  "access_authorized": true
}
```

**POLICY_RETRIEVED**
```json
{
  "event_type": "POLICY_RETRIEVED",
  "policy_id": "uuid",
  "version": 1,
  "retrieved_by": "user_id",
  "retrieved_at": "ISO8601_nanoseconds",
  "purpose": "compliance_review"
}
```

---

## Audit Ledger Properties

### Immutability
- Append-only: New events can be added; existing events NEVER modified
- Timestamp: Immutable once written
- Chain hash: Cryptographic link to prior event prevents tampering

### Completeness
- Every evaluation logged
- Every replay logged
- Every policy change logged
- Every access logged

### Queryability
- By evaluation_id (full audit trail for one decision)
- By subject_id (all decisions for one subject)
- By policy_id (all changes to one policy)
- By actor_id (all actions by one user)
- By timestamp (events in date range)

### Chain Integrity
```
Audit Event 1:
  - audit_hash = SHA256(null + event1_details)
  
Audit Event 2:
  - audit_hash = SHA256(audit_event_1.audit_id + event2_details)
  
Audit Event 3:
  - audit_hash = SHA256(audit_event_2.audit_id + event3_details)

... forming an unbreakable chain
```

**Verification:** To prove no tampering, recalculate all hashes:
```
for each event in audit_ledger:
  expected_hash = SHA256(prior_event.audit_id + current_event.details)
  assert current_event.audit_hash == expected_hash
```

---

## Audit Trail Queries

### Query 1: Complete Evaluation Audit Trail
**Question:** "Show me every fact about evaluation X"

```sql
SELECT 
  ae.event_type,
  ae.details,
  ae.actor_id,
  ae.event_timestamp,
  ae.audit_hash
FROM audit_events ae
WHERE ae.subject_id = 'evaluation_uuid'
ORDER BY ae.event_timestamp ASC;
```

**Returns:**
1. EVALUATION_CREATED (input, policy, output hashes)
2. (Optional) EVALUATION_REPLAYED (if verified)
3. Policy metadata linked in EVALUATION_CREATED details

**Use Case:** Regulator asks "Why did you deny applicant X?"
**Response:** Complete chain showing:
  - Policy applied
  - Input evaluated
  - Reason codes triggered
  - Result calculated
  - Verification (replay) confirms determinism

---

### Query 2: Policy Change Audit Trail
**Question:** "Show me all changes to Policy Y and who approved them"

```sql
SELECT 
  pc.from_version,
  pc.to_version,
  pc.change_summary,
  pc.approver_id,
  pc.approved_at,
  COUNT(e.evaluation_id) as evaluations_using_this_version
FROM policy_changes pc
LEFT JOIN evaluations e ON e.policy_id = pc.policy_id 
  AND e.policy_version = pc.to_version
WHERE pc.policy_id = 'policy_uuid'
GROUP BY pc.policy_id, pc.from_version, pc.to_version
ORDER BY pc.approved_at DESC;
```

**Use Case:** Compliance review asks "When did you change the income threshold and why?"
**Response:** Complete governance trail showing:
  - Before/after versions
  - Who approved
  - When activated
  - How many evaluations use each version

---

### Query 3: Subject Decision History
**Question:** "Show me all decisions for subject Z"

```sql
SELECT 
  e.evaluation_id,
  e.evaluation_timestamp,
  e.classification,
  e.triggered_reason_codes,
  e.violation_score,
  pv.version as policy_version,
  COUNT(ae.audit_id) as audit_events
FROM evaluations e
JOIN policy_versions pv ON e.policy_id = pv.policy_id 
  AND e.policy_version = pv.version
LEFT JOIN audit_events ae ON ae.subject_id = e.evaluation_id::text
WHERE e.subject_id = 'subject_id'
GROUP BY e.evaluation_id, e.evaluation_timestamp, e.classification, 
         e.triggered_reason_codes, e.violation_score, pv.version
ORDER BY e.evaluation_timestamp DESC;
```

**Use Case:** Applicant disputes a decision
**Response:** Complete decision history showing:
  - Each evaluation
  - Policy version used
  - Reason codes triggered
  - Consistent application (or justification for difference)

---

### Query 4: Determinism Verification
**Question:** "Is the system applying policies consistently?"

```sql
SELECT 
  p.policy_id,
  p.version,
  e.classification,
  ar.result_match,
  COUNT(*) as evaluation_count,
  SUM(CASE WHEN ar.result_match = true THEN 1 ELSE 0 END) as replays_passed,
  SUM(CASE WHEN ar.result_match = false THEN 1 ELSE 0 END) as replays_failed
FROM evaluations e
LEFT JOIN policy_versions p ON e.policy_id = p.policy_id
LEFT JOIN audit_events ar ON ar.subject_id = e.evaluation_id::text 
  AND ar.event_type = 'EVALUATION_REPLAYED'
GROUP BY p.policy_id, p.version, e.classification
ORDER BY p.policy_id, p.version DESC;
```

**Use Case:** Auditor verifies determinism
**Response:** Statistical proof that:
  - All replays pass (or evidence of failures)
  - System is consistent
  - No drift over time

---

## Audit Retention

### By Regulatory Requirement

| Requirement | Retention | Notes |
|-------------|-----------|-------|
| FINRA (Fair Lending) | 6 years | Minimum; recommend 7 |
| SEC (if applicable) | 6 years | Broker/dealer requirement |
| Dodd-Frank (ECOA) | 1 year | Plus pattern data 5 years |
| FCRA (Credit) | 7 years | Consumer-facing decisions |
| Tax (if applicable) | 7 years | Decision evidence |

**Recommendation:** 7-year minimum retention for all audit events

### Storage Schedule (Audit Events)
- **Hot Storage:** 0-3 years (PostgreSQL, full ACID, real-time queries, all indexes)
- **Warm Storage:** 3-7 years (Compressed archive, compliance queries, key indexes)
- **Cold Storage:** 7+ years (Tape backup, immutable, regulatory hold)

### Retention Implementation
```sql
-- Hot storage (< 3 years): Full database, all indexes
-- Warm storage (3-7 years): Compressed archive, key indexes
-- Cold storage (> 7 years): Tape backup, immutable

-- Automated procedure
CREATE PROCEDURE archive_old_audit_events() AS
BEGIN
  INSERT INTO audit_events_archive 
  SELECT * FROM audit_events 
  WHERE created_at < NOW() - INTERVAL '3 years';
  
  DELETE FROM audit_events 
  WHERE created_at < NOW() - INTERVAL '3 years';
  
  -- Backup to tape
  BACKUP TABLE audit_events_archive TO TAPE;
END;
```

---

## Audit Query Performance

### Expected Latencies

| Query | Typical | P99 | Notes |
|-------|---------|-----|-------|
| Single evaluation trail | < 100ms | < 300ms | Indexed lookup |
| Policy change history | < 200ms | < 500ms | Aggregate with joins |
| Subject decision history | < 300ms | < 800ms | Multiple lookups |
| Determinism verification | 5-30s | 60s+ | Large dataset scan |

**Optimization:**
- Denormalized views for common queries
- Materialized views (updated hourly) for statistics
- Read replicas for audit queries
- Time-based partitioning (yearly) for old data

---

## Audit Event Schema

```json
{
  "audit_id": "UUID",
  "event_type": "string",
  "event_timestamp": "ISO8601 with nanosecond precision",
  "created_at": "ISO8601 (immutable creation time)",
  
  "actor_id": "string or null (user/system principal)",
  "subject_type": "string (evaluation|policy|user|change)",
  "subject_id": "string",
  
  "details": {
    // Event-specific fields
    // JSON allows flexible schema evolution
    // All numeric values immutable
    // All strings immutable
  },
  
  "audit_hash": "SHA-256 chain link"
}
```

---

## Compliance Evidence Generation

### For Regulators
Query: "Show all decisions for borrower type X in time period Y"
```sql
SELECT 
  e.evaluation_id,
  e.subject_id,
  e.classification,
  e.triggered_reason_codes,
  e.evaluation_timestamp,
  pv.version,
  pv.source_definition
FROM evaluations e
JOIN policy_versions pv ON ...
WHERE pv.source_definition LIKE '%borrower_type%'
  AND e.evaluation_timestamp BETWEEN start_date AND end_date
ORDER BY e.subject_id, e.evaluation_timestamp;
```

### For Auditors
Query: "Verify determinism for policy X"
```sql
-- Generate replay report
-- Show all replays passed or failed
-- Calculate pass rate
-- Link to policy version hash
-- Enable external verification
```

### For Enterprises
Query: "Show us our evaluation patterns"
```sql
-- Approval rate by cohort
-- Reason code frequency
-- Violation score distribution
-- Policy version usage over time
```

---

## Success Criteria

The audit system is production-ready when:

1. **Completeness:** Every evaluation logged
2. **Immutability:** Audit events cannot be modified
3. **Integrity:** Chain hashes verify correctly
4. **Performance:** Queries answer in < 1 second
5. **Compliance:** 7-year retention configured
6. **Auditability:** External verification possible
7. **Transparency:** All queries answerable with evidence

---

**This audit architecture transforms RunPayway into an auditable institution capable of defending every decision with complete, verifiable evidence.**
