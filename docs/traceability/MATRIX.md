# RunPayway Traceability Matrix

**Purpose**: Map every requirement to its implementation, tests, and audit evidence  
**Status**: ACTIVE  
**Last Updated**: 2026-06-22  

---

## Matrix Format

```
REQUIREMENT
├── ADR (Architecture Decision Record)
├── Standard (Where rule is defined)
├── Implementation (Where rule is coded)
├── Tests (Where rule is validated)
└── Audit Evidence (Where result is recorded)
```

---

## REQ-001: Commission Concentration Threshold

| Artifact | Location | Status |
|----------|----------|--------|
| **Requirement** | REQUIREMENTS.md / REQ-001 | ACTIVE |
| **ADR** | docs/adr/ADR-001-RP-DSL.md | ACCEPTED |
| **Standard** | RP_DSL_STANDARD.md | ACTIVE |
| **Policy Rule** | packages/rp-dsl/seed-policy.ts (commission-concentration) | IMPLEMENTED |
| **Reason Code** | RP-INC-001 (35% threshold) | ACTIVE |
| **Test: Positive** | tests/commission-concentration.test.ts (35% triggers) | PASSING |
| **Test: Boundary** | tests/commission-concentration.test.ts (34.99%, 35.00%, 35.01%) | PASSING |
| **Test: Negative** | tests/commission-concentration.test.ts (10% doesn't trigger) | PASSING |
| **Audit Evidence** | evidence/test-results/req-001/ | COLLECTED |
| **Compiler Pass** | evidence/compiler-results/seed-policy.json | VALID |
| **Operator** | packages/rp-dsl/operators.ts (GTE operator) | DETERMINISTIC |
| **Approval** | docs/governance/releases/RP-REL-1.0.0.md | APPROVED |

**Traceability Verification**: ✓ All artifacts present and linked

---

## REQ-002: Immutable Audit Trail

| Artifact | Location | Status |
|----------|----------|--------|
| **Requirement** | REQUIREMENTS.md / REQ-002 | ACTIVE |
| **ADR** | docs/adr/ADR-004-Replay-Architecture.md | ACCEPTED |
| **Standard** | AUDIT_STANDARD.md | ACTIVE |
| **Implementation** | packages/audit/hash.ts | IMPLEMENTED |
| **Database Schema** | prisma/schema.prisma (audit_records table) | DEFINED |
| **API Endpoint** | src/app/api/v1/evaluate (audit capture) | IMPLEMENTED |
| **Encryption** | AES-256 (configured in deployment) | ACTIVE |
| **Retention Policy** | AUDIT_STANDARD.md (7 years) | ENFORCED |
| **Test: Immutability** | tests/audit.test.ts (no UPDATE/DELETE) | PASSING |
| **Test: Hash Stability** | tests/hash.test.ts (same input → same hash) | PASSING |
| **Audit Evidence** | evidence/audit-trail/ | COLLECTED |
| **Approval** | docs/governance/releases/RP-REL-1.0.0.md | APPROVED |

**Traceability Verification**: ✓ All artifacts present and linked

---

## REQ-003: Point-in-Time Replay

| Artifact | Location | Status |
|----------|----------|--------|
| **Requirement** | REQUIREMENTS.md / REQ-003 | ACTIVE |
| **ADR** | docs/adr/ADR-004-Replay-Architecture.md | ACCEPTED |
| **Standard** | AUDIT_STANDARD.md, API_STANDARD.md | ACTIVE |
| **API Endpoint** | src/app/api/v1/replay | IMPLEMENTED |
| **Executor** | packages/rp-dsl/executor.ts | DETERMINISTIC |
| **Hash Comparison** | packages/audit/hash.ts (verifyAuditHashes) | IMPLEMENTED |
| **Test: MATCH** | tests/replay.test.ts (identical result) | PASSING |
| **Test: MISMATCH** | tests/replay.test.ts (detect divergence) | PASSING |
| **Test: Determinism** | tests/executor.test.ts (same AST → same result) | PASSING |
| **Audit Evidence** | evidence/replay-validation/ | COLLECTED |
| **Approval** | docs/governance/releases/RP-REL-1.0.0.md | APPROVED |

**Traceability Verification**: ✓ All artifacts present and linked

---

## REQ-006: Strict Input Validation

| Artifact | Location | Status |
|----------|----------|--------|
| **Requirement** | REQUIREMENTS.md / REQ-006 | ACTIVE |
| **Standard** | DATA_MODEL_STANDARD.md | ACTIVE |
| **Zod Schemas** | packages/ingestion/schemas.ts | IMPLEMENTED |
| **StructuredFinancialPayload** | packages/domain/types.ts | DEFINED |
| **API Endpoint** | src/app/api/v1/evaluate (validation before execution) | IMPLEMENTED |
| **Test: Valid Payload** | tests/validation.test.ts (valid → success) | PASSING |
| **Test: Invalid Payload** | tests/validation.test.ts (invalid → INPUT_ERROR) | PASSING |
| **Test: Type Coercion** | tests/validation.test.ts (no coercion) | PASSING |
| **Audit Evidence** | evidence/test-results/req-006/ | COLLECTED |
| **Approval** | docs/governance/releases/RP-REL-1.0.0.md | APPROVED |

**Traceability Verification**: ✓ All artifacts present and linked

---

## REQ-007: AST-Based RP-DSL Execution

| Artifact | Location | Status |
|----------|----------|--------|
| **Requirement** | REQUIREMENTS.md / REQ-007 | ACTIVE |
| **ADR** | docs/adr/ADR-001-RP-DSL.md, ADR-002-AST-Execution.md | ACCEPTED |
| **Standard** | RP_DSL_STANDARD.md | ACTIVE |
| **AST Types** | packages/rp-dsl/ast.ts | DEFINED |
| **Operators** | packages/rp-dsl/operators.ts | IMPLEMENTED |
| **Executor** | packages/rp-dsl/executor.ts | IMPLEMENTED |
| **Test: Each Operator** | tests/operators.test.ts (all 13 operators) | PASSING |
| **Test: Depth Limit** | tests/executor.test.ts (max depth = 16) | PASSING |
| **Test: Type Safety** | tests/executor.test.ts (operand validation) | PASSING |
| **Audit Evidence** | evidence/test-results/req-007/ | COLLECTED |
| **Approval** | docs/governance/releases/RP-REL-1.0.0.md | APPROVED |

**Traceability Verification**: ✓ All artifacts present and linked

---

## REQ-008: Policy Compilation with Static Analysis

| Artifact | Location | Status |
|----------|----------|--------|
| **Requirement** | REQUIREMENTS.md / REQ-008 | ACTIVE |
| **ADR** | docs/adr/ADR-002-AST-Execution.md | ACCEPTED |
| **Standard** | RP_DSL_STANDARD.md | ACTIVE |
| **Compiler** | packages/rp-dsl/compiler.ts | IMPLEMENTED |
| **Test: Unsupported Operator** | tests/compiler.test.ts (REJECT) | PASSING |
| **Test: Missing Reason Code** | tests/compiler.test.ts (REJECT) | PASSING |
| **Test: Max Depth Exceeded** | tests/compiler.test.ts (REJECT) | PASSING |
| **Test: Unresolved Path** | tests/compiler.test.ts (REJECT) | PASSING |
| **Test: Valid Policy** | tests/compiler.test.ts (ACCEPT) | PASSING |
| **Audit Evidence** | evidence/compiler-results/ | COLLECTED |
| **Approval** | docs/governance/releases/RP-REL-1.0.0.md | APPROVED |

**Traceability Verification**: ✓ All artifacts present and linked

---

## REQ-009: Reason Code Governance

| Artifact | Location | Status |
|----------|----------|--------|
| **Requirement** | REQUIREMENTS.md / REQ-009 | ACTIVE |
| **ADR** | docs/adr/ADR-003-Reason-Codes.md | ACCEPTED |
| **Standard** | REASON_CODE_STANDARD.md | ACTIVE |
| **Registry** | packages/reason-codes/registry.ts | IMPLEMENTED |
| **Reason Code: RP-INC-001** | docs/governance/reason-codes.md | ACTIVE |
| **Reason Code: RP-INC-002** | docs/governance/reason-codes.md | ACTIVE |
| **Reason Code: RP-OBL-001** | docs/governance/reason-codes.md | ACTIVE |
| **Mapper** | packages/reason-codes/mapper.ts | IMPLEMENTED |
| **Test: Validation** | tests/reason-codes.test.ts (valid codes only) | PASSING |
| **Test: Mapping** | tests/reason-codes.test.ts (code → rule) | PASSING |
| **Audit Evidence** | evidence/policy-approvals/ | COLLECTED |
| **Approval** | docs/governance/releases/RP-REL-1.0.0.md | APPROVED |

**Traceability Verification**: ✓ All artifacts present and linked

---

## REQ-010: Deterministic Classification

| Artifact | Location | Status |
|----------|----------|--------|
| **Requirement** | REQUIREMENTS.md / REQ-010 | ACTIVE |
| **Standard** | RP_DSL_STANDARD.md, API_STANDARD.md | ACTIVE |
| **Implementation** | packages/rp-dsl/executor.ts (classifyScore function) | IMPLEMENTED |
| **Policy Rules** | packages/rp-dsl/seed-policy.ts (classification_rules) | DEFINED |
| **Classification Ranges** | 0–19 (PASS), 20–49 (REVIEW), 50+ (FAIL) | DEFINED |
| **Test: PASS** | tests/classification.test.ts (0–19 → PASS) | PASSING |
| **Test: REVIEW** | tests/classification.test.ts (20–49 → REVIEW) | PASSING |
| **Test: FAIL** | tests/classification.test.ts (50+ → FAIL) | PASSING |
| **Test: Boundaries** | tests/classification.test.ts (19, 20, 49, 50) | PASSING |
| **Audit Evidence** | evidence/test-results/req-010/ | COLLECTED |
| **Approval** | docs/governance/releases/RP-REL-1.0.0.md | APPROVED |

**Traceability Verification**: ✓ All artifacts present and linked

---

## How to Use This Matrix

**For Auditors**:
1. Start with requirement (REQ-###)
2. Follow traceability chain
3. Verify each artifact exists and passes
4. Confirm audit evidence collected
5. Sign off on requirement

**For Engineers**:
1. Implement feature (code change)
2. Create/update test (test evidence)
3. Reference requirement ID (REQ-###)
4. Link to ADR and standard
5. Collect audit evidence
6. Update matrix

**For Managers**:
1. Review matrix completion
2. Identify missing links
3. Ensure approvals obtained
4. Plan release based on completeness

---

## Verification Checklist

For every REQ-###:
- [ ] Requirement written (REQUIREMENTS.md)
- [ ] ADR present (docs/adr/ADR-###.md)
- [ ] Standard referenced (docs/standards/)
- [ ] Code implemented (packages/ or src/app/api/)
- [ ] Tests written and passing (tests/)
- [ ] Audit evidence collected (evidence/)
- [ ] Traceability matrix updated
- [ ] Policy Approver sign-off

---

## References

- REQUIREMENTS.md
- docs/adr/
- docs/standards/
- docs/governance/
