# RunPayway Requirements Master List

**Status**: ACTIVE  
**Version**: 1.0.0  
**Last Updated**: 2026-06-22  

---

## FUNCTIONAL REQUIREMENTS (REQ-001 through REQ-010)

### REQ-001: Commission Concentration Threshold
**Description**: If commission income is >= 35% of total income, trigger violation  
**Status**: ACTIVE  
**Version**: 1.0.0  
**Rationale**: Concentration of income in commission creates lending risk  
**Test Evidence**: `/evidence/test-results/req-001/`  
**Implemented By**:
- Policy: /packages/rp-dsl/seed-policy.ts (commission-concentration rule)
- Reason Code: RP-INC-001
- Test: /tests/commission-concentration.test.ts

**Traceability**:
```
REQ-001 → ADR-001 → RP-DSL-STANDARD → compiler.ts → executor.ts → RP-INC-001 → replay.test.ts
```

---

### REQ-002: Immutable Audit Trail
**Description**: Every evaluation produces an immutable audit record (7-year retention)  
**Status**: ACTIVE  
**Version**: 1.0.0  
**Rationale**: Regulatory compliance (SOC 2, GLBA, Fair Lending)  
**Implementation**:
- Audit table: Immutable (no UPDATE/DELETE)
- Hash function: /packages/audit/hash.ts
- Encryption: AES-256 at rest
- Retention: 7 years minimum

**Traceability**:
```
REQ-002 → ADR-004 → AUDIT_STANDARD → schema.prisma → hash.ts
```

---

### REQ-003: Point-in-Time Replay
**Description**: Any historical evaluation can be re-executed with original policy version  
**Status**: ACTIVE  
**Version**: 1.0.0  
**Rationale**: Enable auditors to validate historical decisions  
**Implementation**:
- Audit record stores: policy_hash, input_hash, result_hash
- Replay endpoint: /api/v1/replay
- Hash comparison: MATCH or MISMATCH

**Traceability**:
```
REQ-003 → ADR-004 → API_STANDARD → executor.ts → hash.ts
```

---

### REQ-004: Stateless Evaluation
**Description**: No persistent state during evaluation; all state injected via input  
**Status**: ACTIVE  
**Version**: 1.0.0  
**Rationale**: Determinism requires no external dependencies  
**Constraints**:
- No database queries during execution
- No external API calls
- No system time (unless injected)
- No mutations

**Traceability**:
```
REQ-004 → ARCHITECTURE_STANDARD → executor.ts → operators.ts
```

---

### REQ-005: Version Control of Policies
**Description**: Policies immutable once created; changes → new version (SemVer)  
**Status**: ACTIVE  
**Version**: 1.0.0  
**Rationale**: Enable point-in-time policy replay; prevent in-place mutations  
**Implementation**:
- Policy identified by: policy_id + policy_version + policy_hash
- Storage: Immutable database rows
- Binding: Cohorts bound to specific version

**Traceability**:
```
REQ-005 → ADR-005 → DATA_MODEL_STANDARD → schema.prisma
```

---

### REQ-006: Strict Input Validation (Zod)
**Description**: All payloads validated against StructuredFinancialPayload schema  
**Status**: ACTIVE  
**Version**: 1.0.0  
**Rationale**: Reject invalid data early; prevent downstream errors  
**Implementation**:
- Zod schema: /packages/ingestion/schemas.ts
- Error handling: INPUT_ERROR response
- No type coercion

**Traceability**:
```
REQ-006 → DATA_MODEL_STANDARD → schemas.ts → evaluate endpoint
```

---

### REQ-007: AST-Based RP-DSL Execution
**Description**: Execute policies via AST traversal with deterministic operators  
**Status**: ACTIVE  
**Version**: 1.0.0  
**Rationale**: Deterministic evaluation + auditability  
**Operators**:
- Comparison: GT, GTE, LT, LTE, EQ
- Logical: AND, OR, NOT
- Membership: IN, EXISTS
- Aggregation: SUM, COUNT, RATIO
- Domain: BAND, CLASSIFY, REASON

**Implementation**:
- AST: /packages/rp-dsl/ast.ts
- Executor: /packages/rp-dsl/executor.ts
- Operators: /packages/rp-dsl/operators.ts

**Traceability**:
```
REQ-007 → ADR-001, ADR-002 → RP_DSL_STANDARD → executor.ts → operators.ts
```

---

### REQ-008: Policy Compilation with Static Analysis
**Description**: Compiler validates policies before execution (detect errors early)  
**Status**: ACTIVE  
**Version**: 1.0.0  
**Rationale**: Prevent runtime errors; ensure policy quality  
**Validations**:
- Unsupported operators: REJECT
- Missing reason codes: REJECT
- Max depth > 16: REJECT
- Unresolved paths: REJECT
- Non-deterministic ops: REJECT

**Implementation**:
- Compiler: /packages/rp-dsl/compiler.ts
- Output: CompilerResult with errors/warnings

**Traceability**:
```
REQ-008 → ADR-002 → RP_DSL_STANDARD → compiler.ts
```

---

### REQ-009: Reason Code Governance
**Description**: Every violation mapped to immutable reason code (RP-*-###)  
**Status**: ACTIVE  
**Version**: 1.0.0  
**Rationale**: Deterministic, auditable violation categorization  
**Active Codes**:
- RP-INC-001: Commission concentration >= 35%
- RP-INC-002: Commission volatility band ELEVATED/HIGH
- RP-OBL-001: Obligation ratio > 45%

**Implementation**:
- Registry: /packages/reason-codes/registry.ts
- Mapper: /packages/reason-codes/mapper.ts

**Traceability**:
```
REQ-009 → ADR-003 → REASON_CODE_STANDARD → registry.ts → mapper.ts
```

---

### REQ-010: Deterministic Classification
**Description**: Violation score → classification (PASS/REVIEW/FAIL) deterministically  
**Status**: ACTIVE  
**Version**: 1.0.0  
**Rationale**: Consistent decision logic  
**Classification**:
- 0–19: PASS
- 20–49: REVIEW
- 50+: FAIL

**Implementation**:
- Executor: classifyScore() function
- Policy: classification_rules in seed-policy.ts

**Traceability**:
```
REQ-010 → executor.ts → seed-policy.ts → evaluate endpoint
```

---

## NON-FUNCTIONAL REQUIREMENTS (REQ-011 through REQ-020)

### REQ-011: Reason Code Mapping to AST Nodes
**Description**: Every reason code linked to exactly one policy rule (AST node)  
**Status**: ACTIVE  
**Metric**: 100% of rules mapped

**Implementation**:
- Mapping: /packages/reason-codes/mapper.ts
- Validation: CompileResult.valid

---

### REQ-012: Evaluation Latency < 100ms
**Description**: Typical policy evaluation completes in < 100ms  
**Status**: ACTIVE  
**Metric**: P95 latency < 100ms

**Implementation**:
- Executor: Recursive AST traversal (O(n) where n = AST nodes)
- Benchmark: /tests/performance.test.ts

---

### REQ-013: Policy Compilation < 50ms
**Description**: Policy compilation completes in < 50ms  
**Status**: ACTIVE  
**Metric**: P95 latency < 50ms

**Implementation**:
- Compiler: Static analysis only (no execution)
- Benchmark: /tests/compiler-performance.test.ts

---

### REQ-014: System Throughput >= 1000 evals/sec
**Description**: Single instance handles 1000+ evaluations per second  
**Status**: ACTIVE  
**Metric**: Load test validates throughput

---

### REQ-015: Audit Query < 1s for point-in-time replay
**Description**: Replay latency < 1 second  
**Status**: ACTIVE  
**Metric**: P95 latency < 1s

---

## COMPLIANCE REQUIREMENTS (REQ-021 through REQ-030)

### REQ-021: SOC 2 Type II Compliance
**Description**: System maintains SOC 2 Type II certification  
**Status**: ACTIVE  
**Audit**: Annual

**Controls**:
- Security: Encryption, access controls, API keys
- Availability: Backups, disaster recovery, monitoring
- Processing Integrity: Determinism, audit trail, validation
- Confidentiality: Encryption at rest, TLS in transit
- Privacy: Data retention, audit logging

---

### REQ-022: ISO 27001 Readiness
**Description**: System controls mapped to ISO 27001 requirements  
**Status**: ACTIVE  
**Target**: Certification by 2027

---

### REQ-023: Fair Lending Compliance
**Description**: No protected classes (race, color, religion, etc.) in policy  
**Status**: ACTIVE  
**Validation**: Policy review before deployment

---

### REQ-024: GLBA (Gramm-Leach-Bliley) Compliance
**Description**: Financial data protection per GLBA  
**Status**: ACTIVE  
**Requirements**:
- Encryption at rest and in transit
- Access controls, audit logging
- 7-year data retention

---

### REQ-025: FCRA (Fair Credit Reporting Act) Readiness
**Description**: If used for credit decisions, comply with FCRA  
**Status**: ACTIVE  
**Requirements**:
- Accuracy of evaluation
- Adverse action notices (if declining)
- Dispute procedures

---

## SECURITY REQUIREMENTS (REQ-031 through REQ-040)

### REQ-031: Encryption at Rest (AES-256)
**Description**: All data encrypted with AES-256  
**Status**: ACTIVE

---

### REQ-032: Encryption in Transit (TLS 1.3)
**Description**: All network traffic encrypted with TLS 1.3  
**Status**: ACTIVE

---

### REQ-033: API Key Rotation Quarterly
**Description**: API keys rotated minimum quarterly  
**Status**: ACTIVE

---

### REQ-034: Role-Based Access Control (RBAC)
**Description**: System implements 5-role RBAC model  
**Status**: ACTIVE  
**Roles**: Policy Author, Reviewer, Approver, Auditor, Administrator

---

### REQ-035: Audit Logging of All Access
**Description**: Every audit record access logged  
**Status**: ACTIVE

---

## OPERATIONAL REQUIREMENTS (REQ-041 through REQ-050)

### REQ-041: Daily Encrypted Backups
**Description**: Database backed up daily with encryption  
**Status**: ACTIVE

---

### REQ-042: 7-Year Data Retention
**Description**: All evaluation records retained minimum 7 years  
**Status**: ACTIVE

---

### REQ-043: Quarterly Security Audit
**Description**: Security audit performed quarterly  
**Status**: ACTIVE

---

### REQ-044: Annual Penetration Test
**Description**: External penetration test conducted annually  
**Status**: ACTIVE

---

### REQ-045: Incident Response Plan
**Description**: Documented incident response procedures  
**Status**: ACTIVE

---

## Traceability Cross-Reference

| REQ | ADR | Standard | Code | Test |
|-----|-----|----------|------|------|
| REQ-001 | ADR-001 | RP_DSL_STANDARD | seed-policy.ts | commission.test.ts |
| REQ-002 | ADR-004 | AUDIT_STANDARD | hash.ts | audit.test.ts |
| REQ-003 | ADR-004 | AUDIT_STANDARD | hash.ts | replay.test.ts |
| REQ-004 | ARCH | ARCHITECTURE | executor.ts | executor.test.ts |
| REQ-005 | ADR-005 | DATA_MODEL | schema.prisma | versioning.test.ts |
| REQ-006 | DATA | DATA_MODEL | schemas.ts | validation.test.ts |
| REQ-007 | ADR-001, 002 | RP_DSL | executor.ts | executor.test.ts |
| REQ-008 | ADR-002 | RP_DSL | compiler.ts | compiler.test.ts |
| REQ-009 | ADR-003 | REASON_CODE | registry.ts | reason-codes.test.ts |
| REQ-010 | ARCH | RP_DSL | executor.ts | classification.test.ts |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-06-22 | RunPayway Governance | Initial requirements |

