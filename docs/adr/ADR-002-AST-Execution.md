# ADR-002: Recursive AST Evaluation with Deterministic Operator Execution

**Status**: ACCEPTED  
**Date**: 2026-06-22  
**Author**: RunPayway Governance  

---

## Decision

Execute RP-DSL policies via recursive AST traversal with deterministic, pure operator implementations. Max recursion depth = 16 to prevent runaway evaluation.

---

## Context

AST-based RP-DSL must execute policies deterministically. This requires:
1. No external state (all inputs injected)
2. No side effects (pure functions)
3. Bounded evaluation (no infinite loops)
4. Type safety (operand validation)
5. Error handling (undefined behavior → ASNC)

**Key Questions**:
- How deep can policies be nested?
- How do we prevent runaway recursion?
- How do we handle missing data?
- How do we report evaluation errors?

---

## Alternatives Considered

### Alternative 1: Recursive Descent Parser (No Limits)
```
evaluate(AST, depth=∞)
  if node.type == "binary"
    left = evaluate(node.left, depth)
    right = evaluate(node.right, depth)
    return operator(left, right)
```

**Pros**:
- No artificial limits on policy complexity
- Theoretically allows arbitrary nesting

**Cons**:
- Risk of stack overflow (runaway recursion)
- Hard to audit deep policies
- Memory unbounded
- REJECTED

### Alternative 2: Iterative Evaluation (Stack-Based)
```
stack = [AST]
while stack not empty:
  node = stack.pop()
  if node.type == "leaf":
    push result to value_stack
  else:
    push node children to stack
```

**Pros**:
- No recursion limits
- More predictable memory usage

**Cons**:
- More complex implementation
- Harder to trace errors
- Still unbounded in theory
- REJECTED

### Alternative 3: Recursive with Max Depth = 16 (CHOSEN)
```typescript
evaluate(node, depth = 0) {
  if (depth > 16) throw Error("Max depth exceeded")
  depth++
  // ... recursive evaluation
}
```

**Pros**:
- Simple, understandable
- Bounded memory usage
- Easy to audit
- 16 levels supports all realistic policies
- Stack trace readable

**Cons**:
- Hard limit (can't evaluate very deep policies)
- Rationale: Policies deeper than 16 levels are unauditable anyway

RATIONALE: Financial policies should be understandable by auditors. Depth > 16 is a code smell. If a policy is that complex, it should be refactored into multiple rules.

---

## Reason Chosen

**Auditability**: Shallow policies are easier for humans and auditors to review.

**Determinism**: Bounded recursion prevents non-deterministic timeout behavior.

**Simplicity**: Easier implementation, easier debugging, easier testing.

**Practical Limit**: 16 levels supports:
- Level 1: AND/OR all rules
- Levels 2-15: Nested conditions (commission AND (volatility OR (obligations AND ratio)))
- Level 16: Leaf operators (GT, EQ, IN, etc.)

This is sufficient for all realistic financial policies.

---

## Impact

### Evaluation Execution
- **Time**: ~10–100ms for typical policy
- **Memory**: ~1MB stack allocation
- **Predictability**: Execution bounded and auditable

### Policy Design
- Policy authors must refactor deep policies
- Mitigation: Compiler warns if depth > 10 (soft limit)

### Testing
- Every operator unit tested
- Every path through evaluation tested
- Depth limits tested explicitly

### Error Handling
- Missing data → undefined → evaluation error → ASNC
- Type mismatch → evaluation error → ASNC
- Depth exceeded → evaluation error → ASNC

---

## Operator Specifications

### Deterministic Operators
- **AND**: (a, b) → a ∧ b (Boolean logic)
- **OR**: (a, b) → a ∨ b (Boolean logic)
- **NOT**: (a) → ¬a (Boolean logic)
- **GT**: (a, b) → a > b (numeric comparison)
- **EQ**: (a, b) → a == b (equality)
- **IN**: (a, list) → a ∈ list (membership)
- **SUM**: (array) → Σ array (summation)
- **RATIO**: (a, b) → a / b (division, error if b=0)

### Path Resolution
- Terminal nodes resolve paths into payload
- Missing path → undefined
- Undefined operand → error

### Operator Purity
- No side effects
- No external state
- No mutation
- Deterministic given identical inputs

---

## Traceability

| Artifact | Link |
|----------|------|
| Requirement | REQ-007 (AST execution), REQ-001 (Determinism) |
| Standard | RP_DSL_STANDARD.md |
| Implementation | /packages/rp-dsl/executor.ts |
| Operators | /packages/rp-dsl/operators.ts |
| Tests | /tests/executor.test.ts |

---

## Approval

- **Date**: 2026-06-22
- **Approved by**: RunPayway Governance
- **CCB Vote**: Unanimous (4/4)

---

## References

- ADR-001-RP-DSL.md
- RP_DSL_STANDARD.md
- ARCHITECTURE_STANDARD.md
