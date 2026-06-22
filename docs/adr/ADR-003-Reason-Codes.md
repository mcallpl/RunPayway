# ADR-003: Deterministic Reason Code Mapping to AST Nodes

**Status**: ACCEPTED  
**Date**: 2026-06-22  
**Author**: RunPayway Governance  

---

## Decision

Map every policy violation to an immutable reason code (RP-*-###) linked to a specific AST node. Reason codes are never free-text; they are fixed identifiers with normative labels.

---

## Context

**Regulatory Requirement**: Auditors must trace every evaluation decision to a specific policy rule with clear, deterministic justification.

**Problem**: Free-text explanations are:
- Non-deterministic (different text for same violation)
- Hard to audit (unbounded variations)
- Not reproducible on replay
- Expensive to validate

**Solution**: Map violations to fixed reason codes that are immutable and auditable.

---

## Alternatives Considered

### Alternative 1: Free-Text Explanations
```json
{
  "violations": [
    "Commission income at 42%, threshold is 35%, exceeds by 7%"
  ]
}
```

**Cons**:
- Non-deterministic output
- Not comparable across evaluations
- Hard to audit at scale
- REJECTED

### Alternative 2: Numeric Violation IDs
```json
{
  "violations": [1001, 1002]
}
```

**Pros**:
- Compact, deterministic

**Cons**:
- No meaning without lookup table
- Hard to debug without documentation
- REJECTED

### Alternative 3: Standardized Reason Codes (CHOSEN)
```json
{
  "reason_codes": ["RP-INC-001", "RP-INC-002"]
}
```

**Pros**:
- Deterministic (fixed set of codes)
- Auditable (every code versioned)
- Traceable (code → rule → policy)
- Replayable (same code produced on replay)
- Standardizable (naming convention clear)

RATIONALE: Financial institutions use reason codes extensively (e.g., loan denial reasons). This is familiar to regulators and auditors.

---

## Reason Chosen

**Auditability**: Reason codes create a deterministic mapping from violation → policy rule → AST node.

**Immutability**: Reason codes never change (version control only, no breaking changes).

**Compliance**: Financial regulators expect reason codes for fair lending, equal credit opportunity act compliance.

---

## Implementation

### Reason Code Format
```
RP-[CATEGORY]-[NUMBER]

Examples:
RP-INC-001  (Income concentration)
RP-INC-002  (Income volatility)
RP-OBL-001  (Obligation ratio)
```

### Mapping
```
Policy Rule
  ↓
AST Node (condition)
  ↓
Reason Code
  ↓
Violation Score
```

### Registry
```typescript
const reasonCodeRegistry = {
  "RP-INC-001": {
    code: "RP-INC-001",
    label: "Commission income concentration threshold exceeded",
    severity: "ELEVATED"
  }
}
```

### Never-Changing Contract
- RP-INC-001 will always mean commission concentration >= 35%
- Label will never change (determinism)
- If policy changes, create new code (e.g., RP-INC-003)
- Old code marked DEPRECATED, never deleted

---

## Evaluation Output

Every evaluation includes reason codes:

```json
{
  "evaluation_id": "eval_xyz",
  "status": "REVIEW",
  "reason_codes": ["RP-INC-001", "RP-OBL-001"],
  "violation_score": 55
}
```

**Auditor Interpretation**:
- RP-INC-001 triggered → commission concentration rule violated
- RP-OBL-001 triggered → obligation ratio rule violated
- Violation score 55 → 50+ = FAIL classification

---

## Traceability

| Artifact | Link |
|----------|------|
| Requirement | REQ-011 (Reason code mapping) |
| Standard | REASON_CODE_STANDARD.md |
| Registry | /packages/reason-codes/registry.ts |
| Mapper | /packages/reason-codes/mapper.ts |
| Tests | /tests/reason-codes.test.ts |

---

## Approval

- **Date**: 2026-06-22
- **Approved by**: RunPayway Governance
- **CCB Vote**: Unanimous (4/4)

---

## References

- REASON_CODE_STANDARD.md
- ADR-001-RP-DSL.md
- RP_DSL_STANDARD.md
