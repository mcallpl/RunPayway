# RunPayway API Standard v1.0

**Status**: ACTIVE  
**Version**: 1.0.0  
**Effective Date**: 2026-06-22  
**Owner**: RunPayway Governance  

---

## 1. API Versioning

**Current Version**: v1  
**URL Prefix**: `/api/v1/`

All endpoints must be versioned. No breaking changes without major version bump.

---

## 2. Core Endpoints

### POST /api/v1/evaluate

**Purpose**: Execute policy evaluation (REQ-007)

**Request** (REQ-006):
```json
{
  "organization_id": "string",
  "cohort_key": "string",
  "payload": {
    "subject_id": "string",
    "cohort_key": "string",
    "decision_context": { ... },
    "income_structure": { ... },
    "obligations": { ... }
  }
}
```

**Response (REQ-002, REQ-003)**:
```json
{
  "evaluation_id": "string",
  "status": "PASS|FAIL|REVIEW|INPUT_ERROR|ASNC|POLICY_BINDING_ERROR|EXECUTION_TIMEOUT",
  "compliance_classification": "string",
  "violation_score": 0,
  "reason_codes": ["RP-INC-001", ...],
  "rule_results": [
    {
      "operator": "GTE",
      "operands": ["concentration_percent", "35"],
      "condition_met": true,
      "violation_contribution": 25
    }
  ],
  "audit": {
    "audit_id": "string",
    "input_hash": "sha256:...",
    "policy_hash": "sha256:...",
    "result_hash": "sha256:...",
    "evaluator_version": "1.0.0",
    "replayable": true
  }
}
```

**Status Codes**:
- 200: Success (all statuses)
- 400: Malformed request
- 401: Unauthorized
- 404: Organization or cohort not found
- 500: Server error

**No Advisory Language**: No recommendations, no guidance, no narrative explanations.

---

### POST /api/v1/replay

**Purpose**: Re-execute historical evaluation (REQ-003)

**Request**:
```json
{
  "audit_id": "string"
}
```

**Response**:
```json
{
  "audit_id": "string",
  "replay_status": "MATCH|MISMATCH",
  "original_result_hash": "sha256:...",
  "replay_result_hash": "sha256:...",
  "evaluator_version": "1.0.0",
  "replay_timestamp": "2026-06-22T10:30:00Z"
}
```

**Status Codes**:
- 200: Replay executed
- 400: Invalid audit_id
- 404: Audit record not found
- 500: Replay failed

**Determinism Guarantee**: If MATCH, evaluation is deterministic. If MISMATCH, policy version or input differs.

---

## 3. Error Responses

All errors return consistent format:

```json
{
  "error": true,
  "code": "ERROR_CODE",
  "message": "Human-readable message",
  "details": {}
}
```

**Error Codes**:
- `INPUT_ERROR`: Payload validation failed
- `POLICY_BINDING_ERROR`: Cohort not bound to policy
- `POLICY_NOT_FOUND`: Policy version missing
- `ASNC`: Policy compilation failed
- `EXECUTION_TIMEOUT`: Evaluation exceeded time limit
- `UNAUTHORIZED`: Missing or invalid auth
- `NOT_FOUND`: Resource not found
- `SERVER_ERROR`: Internal error

---

## 4. Authentication

**Method**: API Key (header: X-API-Key)  
**Scope**: Per-organization  
**Rotation**: Quarterly minimum  

---

## 5. Rate Limiting

- **Per API Key**: 1000 requests/minute
- **Per Organization**: 10,000 requests/minute
- **Global**: 100,000 requests/minute

Response includes:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1624353600
```

---

## 6. Logging & Monitoring

Every request logged:
- Timestamp
- Organization ID
- Cohort key
- Input hash
- Response status
- Latency
- Evaluator version

Audit records immutable after creation.

---

## 7. Response Headers

All responses include:
```
Content-Type: application/json
X-Evaluator-Version: 1.0.0
X-Audit-ID: [audit_id or null]
X-Request-ID: [unique request id]
```

---

## 8. Contract Guarantees

| Guarantee | Enforcement |
|-----------|-------------|
| Determinism | Binary-identical result for identical input + policy |
| Immutability | No result modification after creation |
| Auditability | Every evaluation logged and archived |
| Replayability | Point-in-time re-execution guaranteed |
| No Advisory | No recommendations, guidance, or free-text explanation |

---

## 9. Backwards Compatibility

**Policy**: Maintain compatibility across minor versions within major version.

Breaking changes (major version bump):
- New required fields
- Removed endpoints
- Changed status codes
- Changed hash algorithms

Non-breaking changes (minor version bump):
- New optional fields
- New optional endpoints
- New reason codes
- New status values

---

## 10. Deprecation Policy

Deprecated features:
- Must function for 12 months
- Warning in response headers
- Documented in changelog
- Scheduled removal date

---

## References

- ARCHITECTURE_STANDARD.md
- DATA_MODEL_STANDARD.md
- AUDIT_STANDARD.md
