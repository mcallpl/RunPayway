# RunPayway Audit Standard v1.0

**Status**: ACTIVE  
**Version**: 1.0.0  
**Effective Date**: 2026-06-22  
**Owner**: RunPayway Governance  

---

## 1. Audit Trail Requirements (REQ-002)

Every evaluation MUST produce an immutable audit record.

**Immutability Guarantee**:
- Records cannot be modified after creation
- Records cannot be deleted
- Records cannot be redacted
- Records survive system failures
- Records survive version upgrades

---

## 2. Audit Record Structure

```typescript
interface AuditRecord {
  audit_id: string;              // Unique identifier
  evaluation_request_id: string; // Links to evaluation
  input_hash: string;            // SHA256(payload)
  policy_hash: string;           // SHA256(policy)
  result_hash: string;           // SHA256(result)
  evaluator_version: string;     // e.g., "1.0.0"
  replayable: boolean;           // Always true
  created_at: ISO8601;           // Timestamp
  organization_id: string;       // Tenant isolation
}
```

---

## 3. Hash Computation

**Input Hash**:
```
SHA256(JSON.stringify(payload, null, 0))
```
Canonical JSON: sorted keys, no whitespace, no trailing commas

**Policy Hash**:
```
SHA256(policy_json)
```
Computed at compilation time

**Result Hash**:
```
SHA256(JSON.stringify(result, null, 0))
```
Includes: status, classification, violation_score, reason_codes, rule_results

**Guarantee**: Identical input + identical policy = identical result hash

---

## 4. Point-in-Time Replay (REQ-003)

Enable re-execution of any historical evaluation:

1. Retrieve audit_id from historical record
2. Look up evaluation_request and policy_id + policy_version
3. Re-execute: evaluate(payload, policy_version)
4. Compare: new_result_hash vs. original_result_hash
5. Output: MATCH or MISMATCH

**MATCH**: Evaluation is deterministic, policy is stable  
**MISMATCH**: Policy or evaluator changed (requires investigation)

---

## 5. Data Storage

**Location**: SQLite (portable, auditable, encrypted)  
**Table**: `audit_records`  
**Access**: Read-only after insert  
**Backup**: Daily encrypted backup to cold storage

---

## 6. Retention Policy

| Data Type | Retention | Minimum | Deletion |
|-----------|-----------|---------|----------|
| Audit Records | 7 years | Regulatory requirement | Archival after 7+ years |
| Evaluation Requests | 7 years | Regulatory requirement | Archival after 7+ years |
| Evaluation Results | 7 years | Regulatory requirement | Archival after 7+ years |
| Policies | Indefinite | Version control | Never |
| Organizations | Indefinite | Business requirement | Never |

**Compliance**: SOC 2, ISO 27001, Financial Regulations (Fair Lending, Equal Credit Opportunity Act)

---

## 7. Access Control

**Who Can Query Audit Records**:
- Auditor role
- System Administrator
- Policy Owner (own organization only)
- Never: end users

**Audit Logging**:
- Every audit record access logged
- Query timestamp, user, organization
- Immutable access log
- 7-year retention

---

## 8. Compliance Certifications

### SOC 2 Type II
- [ ] Integrity: Audit records not modified
- [ ] Confidentiality: Encrypted at rest and in transit
- [ ] Availability: Daily backups, redundant storage
- [ ] Change Management: ADRs document all changes
- [ ] Access Controls: RBAC by role

### ISO 27001
- [ ] A.8.2: Information Security: Zod validation, type safety
- [ ] A.9: Access Control: RBAC, API keys
- [ ] A.12: Operational Security: Determinism, no injection points
- [ ] A.13: Communications Security: TLS, encryption at rest
- [ ] A.14: System Acquisition, Development: ADRs, code review

### Financial Regulations
- [ ] Fair Lending: Non-discriminatory algorithms (no protected classes)
- [ ] Audit Trail: Every decision logged with reason codes
- [ ] Replayability: Historical decisions can be validated
- [ ] Model Risk Management: Policies frozen per version, no ad-hoc changes
- [ ] Data Integrity: No modification, no deletion after creation

---

## 9. Audit Query Examples

### Example 1: Historical Evaluation
```
GET /api/audit/evaluation/{eval_id}
→ Original input, policy, result, reason codes
→ Proves what decision was made and why
```

### Example 2: Cohort Compliance Check
```
GET /api/audit/cohort/{cohort_id}?start_date=...&end_date=...
→ All evaluations for cohort in date range
→ Distribution of classifications, reason codes
→ Compliance trend analysis
```

### Example 3: Policy Impact Analysis
```
GET /api/audit/policy/{policy_id}/{version}
→ All evaluations that used this policy version
→ Average violation scores, reason code frequency
→ Policy effectiveness measurement
```

### Example 4: Replay Validation
```
POST /api/replay/{audit_id}
→ Re-execute original evaluation
→ Compare result hash: MATCH or MISMATCH
→ Proves determinism or detects policy drift
```

---

## 10. Audit Evidence Checklist

Every release must have:

- [ ] Compiler output (all policies compiled successfully)
- [ ] Test results (all tests pass, 100% coverage of rules)
- [ ] Policy approvals (all policies reviewed and approved)
- [ ] Release notes (what changed, why)
- [ ] Replay validation (sample evaluations replay correctly)
- [ ] Signature (Release Manager approval)
- [ ] Timestamp (Release date)

---

## 11. Mutation Prevention

**Immutability enforced by**:
1. **Database**: audit_records table no UPDATE/DELETE permissions
2. **ORM**: Prisma no update() on audit_records
3. **API**: No PATCH/DELETE endpoints for audit records
4. **Code Review**: ADR-004 explains replay architecture
5. **Tests**: Integration tests verify immutability

---

## 12. Encryption

**At Rest**:
- SQLite database encrypted (AES-256)
- Backup files encrypted
- Encryption key: AWS KMS or similar

**In Transit**:
- TLS 1.3 minimum
- Certificate pinning (optional)
- API keys in Authorization header only

**Key Management**:
- Rotate quarterly
- Secure storage (AWS Secrets Manager)
- Access logged

---

## References

- ARCHITECTURE_STANDARD.md
- DATA_MODEL_STANDARD.md
- GOVERNANCE_STANDARD.md
- ADR-004-Replay-Architecture.md
