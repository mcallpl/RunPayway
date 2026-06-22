# ADR-004: Immutable Audit Trail with Point-in-Time Policy Replay

**Status**: ACCEPTED  
**Date**: 2026-06-22  
**Author**: RunPayway Governance  

---

## Decision

Every evaluation produces an immutable audit record (audit_id). Historical evaluations can be replayed by re-executing original input against original policy version. Audit records cannot be modified or deleted.

---

## Context

**Regulatory Requirement**: Auditors must be able to validate historical decisions at any point in time.

**Challenge**: Policies evolve. If we re-run old evaluation against new policy, results may differ. How do we prove the original decision was correct?

**Solution**: Store policy version alongside each evaluation. Replay against original policy version.

---

## Design

### Audit Record
```typescript
{
  audit_id: "aud_xyz",
  evaluation_request_id: "eval_abc",
  input_hash: "sha256:...",        // SHA256(payload)
  policy_hash: "sha256:...",       // SHA256(policy)
  result_hash: "sha256:...",       // SHA256(result)
  evaluator_version: "1.0.0",
  replayable: true,
  created_at: "2026-06-22T10:30:00Z"
}
```

### Replay Process
```
1. Auditor queries: GET /api/replay/{audit_id}
2. System retrieves original input, policy, result
3. Re-executes: Executor.execute(input, policy)
4. Computes new result hash
5. Compares: original_result_hash vs. new_result_hash
6. Output: MATCH (deterministic) or MISMATCH (divergence)
```

### Hash Guarantees

**Determinism Proof**:
```
Input + Policy → Result
SHA256(Input) = SHA256(Input)   ✓
SHA256(Policy) = SHA256(Policy) ✓
→ SHA256(Result) = SHA256(Result) ✓

Therefore: Evaluation is deterministic
```

**Divergence Detection**:
```
If result_hash MISMATCH:
  Either:
  - Input changed (input_hash proves this)
  - Policy changed (policy_hash proves this)
  - Evaluator has bug (version mismatch detected)
```

---

## Immutability Enforcement

### Database Level
```sql
CREATE TABLE audit_records (
  audit_id TEXT PRIMARY KEY,
  input_hash TEXT,
  policy_hash TEXT,
  result_hash TEXT,
  created_at TIMESTAMP
);

-- No UPDATE allowed
-- No DELETE allowed
```

### ORM Level
```typescript
// Prisma: Only create() allowed, no update() or delete()
await prisma.auditRecord.create({ data: {...} });
```

### API Level
```typescript
// Only POST /api/replay (read-only operation)
// No PATCH or DELETE endpoints
```

### Operational Level
- 7-year retention mandate
- Encryption at rest
- Daily backup
- Regular audit of access attempts

---

## Alternatives Considered

### Alternative 1: Keep Latest Version Only
```
No audit trail, no replay capability
```

**Cons**: Violates regulatory requirements  
**REJECTED**

### Alternative 2: Store Multiple Policy Snapshots
```
Every evaluation stores full policy JSON
Replay using stored snapshot
```

**Pros**:
- Direct replay without lookup
- No external dependency

**Cons**:
- Storage overhead (policy JSON can be large)
- Duplication across evaluations

**Trade-off**: Acceptable if storage manageable

### Alternative 3: Policy Versioning + Hash (CHOSEN)
```
Evaluation stores: policy_id + policy_version
Replay looks up policy version from registry
Hash comparison proves determinism
```

**Pros**:
- Minimal storage overhead
- Policy registry is single source of truth
- Hash provides determinism proof

**Cons**:
- Requires policy registry lookup during replay
- Fails if policy version deleted (shouldn't happen)

RATIONALE: Policy registry is immutable by design (never delete policies). Replay is acceptable risk.

---

## Error Cases

### Replay Result: MATCH
→ Evaluation is deterministic, policy stable

### Replay Result: MISMATCH
→ Investigation required
- Check input_hash: Did payload change? (No → input is stable)
- Check policy_hash: Did policy change? (No → policy is stable)
- Check evaluator_version: Did code change? (Yes → evaluate change impact)

---

## 7-Year Retention

**Why 7 years?**
- Financial regulations (GLBA, Fair Lending laws)
- Statute of limitations for lawsuits
- FTC enforcement (typically 7 years)

**How enforced?**
- Database: Immutable table schema
- Backup: Encrypted 7-year archive
- Archival: After 7 years, move to cold storage (S3 Glacier)
- Deletion: Never

---

## Traceability

| Artifact | Link |
|----------|------|
| Requirement | REQ-002 (Auditability), REQ-003 (Replayability) |
| Standard | AUDIT_STANDARD.md |
| API | API_STANDARD.md |
| Hash Utility | /packages/audit/hash.ts |
| Database | Prisma schema |
| Tests | /tests/replay.test.ts |

---

## Approval

- **Date**: 2026-06-22
- **Approved by**: RunPayway Governance
- **CCB Vote**: Unanimous (4/4)

---

## References

- AUDIT_STANDARD.md
- ADR-005-Policy-Versioning.md
- API_STANDARD.md
