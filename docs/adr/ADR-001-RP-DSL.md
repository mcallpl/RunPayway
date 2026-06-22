# ADR-001: Adopt AST-Based Domain Specific Language (RP-DSL)

**Status**: ACCEPTED  
**Date**: 2026-06-22  
**Author**: RunPayway Governance  

---

## Decision

Use an Abstract Syntax Tree (AST)-based Domain Specific Language (RP-DSL) for all financial policy expression, replacing any text-based or free-form policy formats.

---

## Context

RunPayway must execute financial policies deterministically and auditably. Financial regulators require:

1. **Auditability**: Every decision must be traceable to specific policy rules
2. **Determinism**: Identical inputs must always produce identical outputs
3. **Versionability**: Policies must be versioned and frozen per evaluation
4. **Explainability**: Specific reasons must be tied to specific violations
5. **Replayability**: Historical decisions must be re-executable with identical results

**Constraints**:
- No randomness or external state
- No free-text explanations (non-deterministic)
- No ad-hoc rule changes (must version control)
- Must compile safely before execution
- Must enable point-in-time replay

**Stakeholder Concerns**:
- Business: "Can we quickly add new rules?"  
  Answer: Yes, via new policy version
- Compliance: "Can auditors understand the rules?"  
  Answer: Yes, via AST node → reason code mapping
- Engineering: "Can this scale?"  
  Answer: Yes, AST is O(log n) depth, max 16

---

## Alternatives Considered

### Alternative 1: Free-Form Text Policies
```
"If commission is >= 35%, flag as review"
```

**Pros**:
- Easy to write for non-technical people
- Flexible, no syntax constraints

**Cons**:
- Non-deterministic (different interpretations)
- Hard to audit (ambiguous meaning)
- Impossible to replay
- No versioning, no compilation
- REJECTED

### Alternative 2: JSON-Based Rules Engine
```json
{
  "rules": [
    { "field": "commission", "operator": "gte", "value": 35, "action": "review" }
  ]
}
```

**Pros**:
- Structured, machine-readable
- Slightly easier to parse than AST

**Cons**:
- Limited expressiveness (no complex logic)
- Hard to compose rules (AND/OR/NOT)
- No recursive evaluation
- Shallow reasoning about violations
- REJECTED

### Alternative 3: AST-Based DSL (CHOSEN)
```typescript
{
  "type": "binary",
  "operator": "GTE",
  "left": { "type": "terminal", "kind": "path", "path": "commission_pct" },
  "right": { "type": "terminal", "kind": "literal", "value": 35 }
}
```

**Pros**:
- Fully deterministic (AST evaluation is mathematical)
- Arbitrarily composable (nested AND/OR/NOT)
- Auditable (every node traceable)
- Replayable (identical AST → identical output)
- Versionable (JSON serialization)
- Compilable (static analysis before execution)

**Cons**:
- Steeper learning curve
- Requires code review expertise
- Larger JSON payloads

RATIONALE: Determinism and auditability are non-negotiable for financial systems. AST trades slight complexity for absolute clarity.

---

## Reason Chosen

Financial regulators (CFPB, OCC, Fed) require:
1. Explainability: "Why was this decision made?" → AST traces to specific node
2. Non-discrimination: "Did you use protected classes?" → AST audit trail proves no
3. Reproducibility: "Replay this decision" → Identical input + policy = identical output

**AST-based RP-DSL provides all three** with maximal determinism and auditability.

---

## Impact

### Components Affected
- Policy execution engine (new)
- Policy compiler (new)
- Audit trail (must capture AST evaluation)
- Test harness (must test every operator)
- Documentation (new DSL specification)

### Performance
- Evaluation: ~10–100ms for typical policy (acceptable)
- Compilation: ~50ms per policy (acceptable)
- Memory: ~10KB per policy AST (acceptable)

### Risk Mitigation
- **Policy errors**: Mitigated by compiler (static analysis)
- **Operator bugs**: Mitigated by unit tests for each operator
- **Depth runaway**: Mitigated by max depth = 16 limit
- **Non-determinism**: Mitigated by operator purity guarantees

### Cost
- Engineering: ~4 weeks to build compiler + executor + tests
- Maintenance: Low (DSL is stable after 1.0.0)
- Training: Medium (need DSL education for policy authors)

---

## Traceability

| Artifact | Link |
|----------|------|
| Requirement | REQ-007 (Execute RP-DSL policies) |
| Standard | RP_DSL_STANDARD.md |
| Operator Registry | /packages/rp-dsl/operators.ts |
| Compiler | /packages/rp-dsl/compiler.ts |
| Tests | /tests/rp-dsl.test.ts |
| Reason Codes | REASON_CODE_STANDARD.md |

---

## Approval

- **Date**: 2026-06-22
- **Approved by**: RunPayway Governance
- **CCB Vote**: Unanimous (4/4)

---

## References

- RP_DSL_STANDARD.md
- ARCHITECTURE_STANDARD.md
- ADR-002-AST-Execution.md
