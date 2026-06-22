# RunPayway RP-DSL Standard v1.0

**Status**: ACTIVE  
**Version**: 1.0.0  
**Effective Date**: 2026-06-22  
**Owner**: RunPayway Governance  

---

## 1. Overview

RP-DSL (RunPayway Domain Specific Language) is an AST-based policy language for financial decision logic.

**Characteristics**:
- Deterministic (no randomness, no external state)
- Recursive (AST-based)
- Type-safe (Zod validation upstream)
- Auditable (every node traced)
- Replayable (identical input = identical output)

---

## 2. Core Operators (REQ-007)

### Comparison Operators
| Operator | Arity | Input Types | Output | Example |
|----------|-------|-------------|--------|---------|
| GT | 2 | number, number | boolean | income > 50000 |
| GTE | 2 | number, number | boolean | commission_pct >= 35 |
| LT | 2 | number, number | boolean | age < 65 |
| LTE | 2 | number, number | boolean | ratio <= 0.45 |
| EQ | 2 | any, any | boolean | status == "ACTIVE" |

### Logical Operators
| Operator | Arity | Input Types | Output | Example |
|----------|-------|-------------|--------|---------|
| AND | 2+ | boolean, boolean, ... | boolean | A AND B AND C |
| OR | 2+ | boolean, boolean, ... | boolean | A OR B OR C |
| NOT | 1 | boolean | boolean | NOT condition |

### Membership Operators
| Operator | Arity | Input Types | Output | Example |
|----------|-------|-------------|--------|---------|
| IN | 2+ | value, list, list, ... | boolean | status IN [ACTIVE, PENDING] |
| EXISTS | 1 | any | boolean | field != null |

### Aggregation Operators
| Operator | Arity | Input Types | Output | Example |
|----------|-------|-------------|--------|---------|
| SUM | 1 | array[number] | number | SUM(income_sources.amounts) |
| COUNT | 1 | array | number | COUNT(obligations) |
| RATIO | 2 | number, number | number | obligations ÷ income |

### Domain Operators
| Operator | Arity | Input Types | Output | Example |
|----------|-------|-------------|--------|---------|
| BAND | 3 | number, min, max | boolean | value IN [min, max] |
| CLASSIFY | 1+ | ranges | string | classification based on score |
| REASON | varies | condition, code, contribution | code | if condition, emit code |

---

## 3. Forbidden Operations (REQ-007)

**Strict prohibition**:
- [ ] Randomness (Math.random(), uuid, timestamps)
- [ ] External API calls
- [ ] Database queries during evaluation
- [ ] Mutations or side effects
- [ ] AI/ML inference
- [ ] Unbounded loops or recursion
- [ ] System time (unless injected as parameter)
- [ ] Network access
- [ ] File I/O

---

## 4. AST Node Types

```typescript
type ASTNode = 
  | BinaryOp
  | UnaryOp
  | TerminalNode
  | AggregateOp
  | ClassifyOp
  | ReasonOp
```

### TerminalNode
```typescript
{
  type: "terminal",
  kind: "path" | "literal" | "constant",
  value: any,
  path?: "income_structure.income_sources[1].concentration_percent"
}
```

### BinaryOp
```typescript
{
  type: "binary",
  operator: "GT" | "GTE" | ... ,
  left: ASTNode,
  right: ASTNode
}
```

### UnaryOp
```typescript
{
  type: "unary",
  operator: "NOT",
  operand: ASTNode
}
```

### AggregateOp
```typescript
{
  type: "aggregate",
  operator: "SUM" | "COUNT" | "RATIO",
  inputs: ASTNode[]
}
```

### ClassifyOp
```typescript
{
  type: "classify",
  operator: "CLASSIFY",
  ranges: [
    { min: 0, max: 19, classification: "PASS" },
    { min: 20, max: 49, classification: "REVIEW" },
    { min: 50, max: 1000, classification: "FAIL" }
  ]
}
```

---

## 5. Path Resolution

Paths resolve into StructuredFinancialPayload:

```
income_structure.income_sources[1].concentration_percent
↓
payload.income_structure.income_sources[1].concentration_percent
```

**Missing path behavior**:
- Unresolved path → undefined
- Undefined in operation → operation error
- Operation error → evaluation fails → ASNC

---

## 6. Type Safety

All operands must satisfy type constraints:

| Operator | Arg 1 | Arg 2 | Arg N |
|----------|-------|-------|-------|
| GT | number | number | - |
| EQ | any | any | - |
| IN | any | array | array... |
| SUM | array[number] | - | - |
| RATIO | number | number | - |

Type mismatch → ExecutionError → ASNC

---

## 7. Compilation Requirements (REQ-009)

**Safety Compiler MUST**:
- [ ] Reject unsupported operators
- [ ] Reject missing reason codes
- [ ] Detect cycles (not applicable to DAG)
- [ ] Reject max depth > 16
- [ ] Reject unresolved payload paths
- [ ] Reject non-deterministic operations
- [ ] Validate all path expressions
- [ ] Validate all classification ranges

**Output**:
```json
{
  "valid": true/false,
  "policy_hash": "sha256:...",
  "errors": ["error1", "error2"],
  "warnings": ["warning1"]
}
```

---

## 8. Determinism Guarantee

Given:
- Input payload P
- Policy version V
- Execution time T

Then:
- Execution(P, V, T) = Execution(P, V, T + 1000ms)
- No external state affects outcome
- Binary-identical result hash

---

## 9. Examples

### Commission Concentration Rule
```json
{
  "rule_id": "commission-concentration",
  "condition": {
    "type": "binary",
    "operator": "GTE",
    "left": {
      "type": "terminal",
      "kind": "path",
      "path": "income_structure.income_sources[1].concentration_percent"
    },
    "right": {
      "type": "terminal",
      "kind": "literal",
      "value": 35
    }
  },
  "reason_code": "RP-INC-001",
  "violation_contribution": 25
}
```

### Obligation Ratio Rule
```json
{
  "rule_id": "obligation-ratio",
  "condition": {
    "type": "binary",
    "operator": "GT",
    "left": {
      "type": "binary",
      "operator": "RATIO",
      "left": { "aggregate SUM of obligations" },
      "right": { "aggregate SUM of income" }
    },
    "right": {
      "type": "terminal",
      "kind": "literal",
      "value": 0.45
    }
  },
  "reason_code": "RP-OBL-001",
  "violation_contribution": 30
}
```

---

## 10. Evolution Policy

**Version 1.0.0**: Initial operators, no free-text support

**Future versions**:
- Version 1.1.0: New operators (must not break 1.0.0 policies)
- Version 2.0.0: Breaking changes (new major version)

---

## References

- ARCHITECTURE_STANDARD.md
- ADR-001-RP-DSL.md
- ADR-002-AST-Execution.md
