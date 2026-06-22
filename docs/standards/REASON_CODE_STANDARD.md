# RunPayway Reason Code Standard v1.0

**Status**: ACTIVE  
**Version**: 1.0.0  
**Effective Date**: 2026-06-22  
**Owner**: RunPayway Governance  

---

## 1. Overview

Reason codes (RC) are deterministic, immutable identifiers that map policy violations to specific AST nodes.

**Characteristics**:
- Unique globally
- Versioned never (no breaking changes to code)
- Never deleted (only deprecated)
- Always active or deprecated
- Mapped to exactly one rule

---

## 2. Reason Code Format

**Pattern**: `RP-[CATEGORY]-[NUMBER]`

Example: `RP-INC-001`

- `RP`: RunPayway prefix
- `INC`: Category (INC = Income, OBL = Obligations, etc.)
- `001`: Sequential number within category

---

## 3. Reason Code Governance

Every reason code requires:

| Field | Type | Required | Example |
|-------|------|----------|---------|
| code | string | Yes | RP-INC-001 |
| status | enum | Yes | ACTIVE \| DEPRECATED \| SUPERSEDED |
| version | SemVer | Yes | 1.0.0 |
| category | string | Yes | INCOME |
| description | string | Yes | Commission income concentration threshold exceeded |
| severity | enum | Yes | LOW \| MODERATE \| ELEVATED \| CRITICAL |
| created_at | ISO8601 | Yes | 2026-06-22T00:00:00Z |
| owner | string | Yes | RunPayway Governance |
| rule_id | string | Yes | commission-concentration |
| violation_contribution | number | Yes | 25 |
| deprecation_reason | string | No | Superseded by RP-INC-003 |
| deprecation_date | ISO8601 | No | 2026-12-22T00:00:00Z |

---

## 4. Active Reason Codes (v1.0.0)

### RP-INC-001
```
Status: ACTIVE
Version: 1.0.0
Category: INCOME
Description: Commission income concentration threshold exceeded
Severity: ELEVATED
Created: 2026-06-22
Owner: RunPayway Governance
Rule ID: commission-concentration
Condition: commission_pct >= 35%
Violation Contribution: 25
```

### RP-INC-002
```
Status: ACTIVE
Version: 1.0.0
Category: INCOME
Description: Commission income volatility band threshold triggered
Severity: ELEVATED
Created: 2026-06-22
Owner: RunPayway Governance
Rule ID: commission-volatility
Condition: volatility_band IN [ELEVATED, HIGH]
Violation Contribution: 20
```

### RP-OBL-001
```
Status: ACTIVE
Version: 1.0.0
Category: OBLIGATIONS
Description: Recurring obligation ratio threshold triggered
Severity: ELEVATED
Created: 2026-06-22
Owner: RunPayway Governance
Rule ID: obligation-ratio
Condition: obligations ÷ income > 45%
Violation Contribution: 30
```

---

## 5. Lifecycle Management

### Creation
1. Propose new reason code
2. Map to specific policy rule (AST node)
3. Document violation contribution
4. Governance review (Policy Approver)
5. Activate with version 1.0.0

### Deprecation
1. Reason code status → DEPRECATED
2. Note deprecation_reason
3. Set deprecation_date (60 days minimum notice)
4. Maintain in registry (never delete)
5. Existing evaluations unaffected

### Supersession
1. Old reason code: SUPERSEDED
2. New reason code: ACTIVE
3. All new evaluations use new code
4. Historical evaluations preserve old code
5. Audit trail shows supersession

---

## 6. Mapping to Policy Rules

Every reason code maps to exactly one rule:

```
RP-INC-001 → commission-concentration rule
  ↓
  If condition met → violation_contribution = 25
  ↓
  Accumulate to total violation score
  ↓
  Classification: 20-49 → REVIEW
```

---

## 7. No Free-Text Explanation

**Determinism constraint**:
- Reason codes are fixed identifiers
- Labels are normative (not advisory)
- No variable explanations
- No "your commission is X%, threshold is Y%" in output

**Reason**: Free text is non-deterministic and not auditable across versions.

---

## 8. Registry Storage

Stored in `/packages/reason-codes/registry.ts`:

```typescript
export const reasonCodeRegistry: Record<string, ReasonCode> = {
  "RP-INC-001": {
    code: "RP-INC-001",
    label: "Commission income concentration threshold triggered",
    severity: "ELEVATED"
  },
  // ...
}
```

All reason codes immutable after activation.

---

## 9. Validation

**Compiler requirement** (REQ-009):
- Every policy rule must reference valid reason code
- Code must exist in registry
- Code must be ACTIVE (not DEPRECATED)
- Missing code → ASNC compilation error

---

## 10. Audit Trail

Every evaluation output includes:

```json
{
  "reason_codes": ["RP-INC-001", "RP-OBL-001"],
  "audit": {
    "policy_hash": "sha256:...",
    "reason_code_version": "1.0.0"
  }
}
```

Enables point-in-time replay with same reason codes.

---

## References

- ARCHITECTURE_STANDARD.md
- RP_DSL_STANDARD.md
- ADR-003-Reason-Codes.md
