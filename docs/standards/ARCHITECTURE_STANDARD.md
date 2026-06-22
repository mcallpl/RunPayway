# RunPayway Architecture Standard v1.0

**Status**: ACTIVE  
**Version**: 1.0.0  
**Effective Date**: 2026-06-22  
**Owner**: RunPayway Governance  

---

## 1. System Classification

RunPayway is a **deterministic financial policy execution engine** for regulated environments.

**Classification**: Level 5 Enterprise Compliance Infrastructure

**Purpose**: Execute version-controlled business logic deterministically, produce audit-grade outputs, enable point-in-time replay.

---

## 2. Architectural Principles

### 2.1 Determinism (REQ-001)
- Identical inputs + identical policy version = binary-identical outputs
- No randomness, no external state, no timing dependencies
- All inputs injected; all outputs deterministic

### 2.2 Auditability (REQ-002)
- Every evaluation produces immutable audit record
- Input hash, policy hash, result hash stored
- 7-year retention minimum
- No modification, no deletion

### 2.3 Replayability (REQ-003)
- Any historical evaluation can be re-executed
- Uses original policy version
- Result hash must match original
- Supports point-in-time validation

### 2.4 Statelessness (REQ-004)
- No persistent state during evaluation
- All state injected via input
- No database mutations during execution
- Clean separation: read → evaluate → write

### 2.5 Version Control (REQ-005)
- Every policy snapshot is immutable
- Policies identified by: policy_id + policy_version + policy_hash
- Cohort bindings reference specific policy version
- No in-place mutation

---

## 3. System Layers

### Layer 1: Schema Registry & Normalization Pipe
**Purpose**: Strict, coercion-free ingestion

**Requirements**: 
- REQ-006: Validate all inputs against Zod schemas
- Reject invalid payloads with INPUT_ERROR
- No type coercion
- All units normalized to base units (cents for currency)

**Responsibility**: `/packages/ingestion/schemas.ts`

---

### Layer 2: AST-based Execution Engine
**Purpose**: High-performance recursive policy evaluation

**Requirements**:
- REQ-007: Execute RP-DSL policies via AST traversal
- Support deterministic operators: AND, OR, NOT, GT, GTE, LT, LTE, EQ, IN, EXISTS, SUM, RATIO, COUNT, BAND, CLASSIFY, REASON
- Enforce max depth of 16 (prevent runaway recursion)
- Disallow: randomness, external API calls, database access, mutations, AI inference, unbounded loops, system time (unless injected)

**Responsibility**: `/packages/rp-dsl/executor.ts`, `/packages/rp-dsl/operators.ts`

---

### Layer 3: Versioned Policy Registry
**Purpose**: Immutable storage of policy snapshots

**Requirements**:
- REQ-008: Store every policy version as immutable record
- Use SemVer for policy_version (major.minor.patch)
- Generate deterministic policy_hash from policy JSON
- Enable point-in-time policy lookup

**Responsibility**: Prisma schema `Policy` table

---

### Layer 4: Policy Safety Compiler
**Purpose**: Static analysis before execution

**Requirements**:
- REQ-009: Reject unsupported operators
- Reject missing reason-code mappings
- Reject cycles in AST
- Reject max depth > 16
- Reject unresolved payload paths
- Reject non-deterministic operations

**Responsibility**: `/packages/rp-dsl/compiler.ts`

---

### Layer 5: Automated Testing Harness
**Purpose**: CI/CD integration for policy validation

**Requirements**:
- REQ-010: Test coverage for every policy rule
- Positive test, negative test, boundary test for each threshold
- All tests must pass before policy promotion
- Test results stored in /evidence/test-results/

**Responsibility**: `/tests/*.test.ts`, CI/CD pipeline

---

### Layer 6: Governance & Deployment Workflow
**Purpose**: RBAC-controlled promotion path

**Requirements**:
- Sandbox → Staging → Production
- Four-eyes approval required for production
- Policy Author, Reviewer, Approver roles required
- Change log maintained for every promotion

**Responsibility**: `/docs/governance/ROLES.md`

---

### Layer 7: Audit & Lineage System
**Purpose**: Immutable event logs with cohort-policy binding

**Requirements**:
- Every evaluation produces audit record
- input_hash, policy_hash, result_hash stored
- Cohort-policy binding captured
- Point-in-time decision replay enabled
- 7-year retention

**Responsibility**: Prisma schema `AuditRecord` table

---

### Layer 8: Explainability Registry
**Purpose**: Codebook mapping reason codes to AST nodes

**Requirements**:
- REQ-011: Every reason code mapped to specific policy rule
- Deterministic mapping maintained
- No free-text explanations (determinism)
- Reason code labels are normative

**Responsibility**: `/packages/reason-codes/registry.ts`

---

## 4. Data Flow

```
Raw Input
    ↓
[Zod Validation] → INPUT_ERROR if invalid
    ↓
StructuredFinancialPayload
    ↓
[Policy Lookup] → POLICY_BINDING_ERROR if not found
    ↓
[Policy Compiler] → ASNC if policy invalid
    ↓
[AST Executor] → Evaluation
    ↓
[Reason Code Mapper] → Reason Codes + Violation Score
    ↓
[Classification] → Compliance Classification
    ↓
[Hash Computation] → Audit Record
    ↓
EvaluationResult (Deterministic JSON)
    ↓
[Store in DB] → Audit Trail
```

---

## 5. Failure Modes & Status Codes

| Status | Meaning | Recovery |
|--------|---------|----------|
| PASS | Evaluation successful, no violations | None |
| FAIL | Evaluation successful, violations found | Review policy or update payload |
| REVIEW | Evaluation successful, manual review needed | Manual assessment required |
| INPUT_ERROR | Payload validation failed | Fix input; resubmit |
| ASNC | Policy compilation failed | Fix policy; redeploy |
| POLICY_BINDING_ERROR | Cohort not bound to policy | Bind cohort; retry |
| EXECUTION_TIMEOUT | Execution exceeded timeout | Simplify policy; retry |

---

## 6. Security & Compliance

**Data Classification**: Financial, PII  
**Encryption**: At rest (SQLite + file encryption), in transit (TLS)  
**Access Control**: RBAC by role (see GOVERNANCE_STANDARD.md)  
**Audit Logging**: Immutable, 7-year retention  
**Compliance Frameworks**: SOC 2, ISO 27001, Financial Regulations  

---

## 7. Performance Targets

- **Evaluation**: < 100ms for typical policy
- **Compilation**: < 50ms
- **Replay**: < 100ms
- **Throughput**: 1000+ evaluations/second per instance
- **Audit Query**: < 1s for point-in-time replay

---

## 8. Implementation Constraints

**Do NOT**:
- Add advisory or recommendation features
- Use probabilistic logic or ensemble methods
- Make external API calls during evaluation
- Query database during execution
- Use system time (unless injected as parameter)
- Generate free-text explanations
- Create mutable state during evaluation

**Do**:
- Enforce determinism
- Maintain audit trail
- Version control policies
- Enable replayability
- Validate all inputs
- Document all decisions (ADRs)
- Trace all code to requirements

---

## References

- ADR-001-RP-DSL.md
- ADR-002-AST-Execution.md
- ADR-003-Reason-Codes.md
- ADR-004-Replay-Architecture.md
- ADR-005-Policy-Versioning.md
- DATA_MODEL_STANDARD.md
- API_STANDARD.md
