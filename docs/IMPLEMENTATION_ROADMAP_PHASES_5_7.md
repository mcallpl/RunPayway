# Implementation Roadmap: Phases 5-7

**Date:** June 22, 2026  
**Status:** Ready for Execution  
**Duration:** Estimated 8-12 weeks  
**Scope:** Transform RunPayway from Deterministic Engine to Enterprise Evaluation Platform

---

## Phase 5: Persistence Architecture (Weeks 1-4)

**Objective:** Build production-grade persistence enabling full auditability and deterministic reconstruction.

---

### Phase 5a: Core Evaluation Persistence

**Goal:** Persistent immutable storage of evaluation records.

**Files Impacted:**
- NEW: `src/lib/persistence/evaluation-store.ts`
- NEW: `src/lib/persistence/schema.sql`
- MODIFY: `src/app/api/v1/evaluate/route.ts` (add persistence call)
- NEW: `src/lib/persistence/migrations.ts` (schema management)

**Implementation Steps:**
1. Create PostgreSQL schema (evaluations table)
2. Implement immutability triggers
3. Create index strategy for query performance
4. Build evaluation storage service
5. Integrate storage into evaluate endpoint
6. Add hash computation (audit trail)

**Risk Level:** MEDIUM
- Database dependency introduced
- Must be bulletproof (data never lost)
- Performance critical (every evaluation)

**Verification Gates:**
- [ ] Schema deploys without errors
- [ ] Immutability triggers work (UPDATE fails)
- [ ] Evaluation INSERT completes < 50ms
- [ ] Replay queries work
- [ ] Hashing deterministic

**Completion Criteria:**
- Evaluate endpoint persists records
- Records queryable by evaluation_id
- Hashes verifiable
- No data loss under load

---

### Phase 5b: Policy Registry Persistence

**Goal:** Versioned, immutable policy storage with governance state.

**Files Impacted:**
- NEW: `src/lib/persistence/policy-store.ts`
- NEW: `src/lib/persistence/policy-registry.ts`
- MODIFY: `src/app/api/v1/evaluate/route.ts` (lookup active policy)
- NEW: `src/app/api/v1/policy/register.ts` (new policy endpoint)
- NEW: `src/app/api/v1/policy/list.ts` (query endpoint)

**Implementation Steps:**
1. Create policy_versions table
2. Create policies table (metadata)
3. Implement unique active version constraint
4. Build policy lookup service
5. Build policy registration service
6. Integrate policy lookup into evaluate endpoint
7. Create policy query endpoints

**Risk Level:** MEDIUM
- Must enforce single active version
- All evaluations must link to exact version
- Policy versioning must be bulletproof

**Verification Gates:**
- [ ] Policy schema deploys
- [ ] Only one ACTIVE version per policy
- [ ] Policy version immutable (UPDATE fails)
- [ ] Evaluate uses correct policy version
- [ ] Replay can access original version

**Completion Criteria:**
- Policies can be created, versioned, activated
- Evaluations reference correct policy version
- Historical queries work
- Policy rollback possible (new version)

---

### Phase 5c: Audit Ledger Persistence

**Goal:** Append-only, immutable audit trail for regulatory compliance.

**Files Impacted:**
- NEW: `src/lib/persistence/audit-store.ts`
- NEW: `src/lib/persistence/audit-ledger.ts`
- MODIFY: `src/app/api/v1/evaluate/route.ts` (log evaluation)
- MODIFY: `src/app/api/v1/replay/route.ts` (log replay)
- NEW: `src/app/api/v1/audit/trail.ts` (query endpoint)

**Implementation Steps:**
1. Create audit_events table (append-only)
2. Implement hash chain cryptography (see PERSISTENCE_SCHEMA_V1.md compute_audit_hash function)
3. Create immutability enforcement
4. Build audit logging service
5. Integrate audit logging into evaluate, replay endpoints
6. Create audit query endpoints
7. Implement audit event types (EVALUATION_CREATED, REPLAY, POLICY_*, etc.)

**Replay Policy Retrieval Detail:**
When replaying an evaluation:
1. Retrieve evaluation record: `SELECT * FROM evaluations WHERE evaluation_id = $1`
2. Extract composite key: `policy_id` (UUID) + `policy_version` (INTEGER)
3. Look up policy version: `SELECT * FROM policy_versions WHERE policy_id = $1 AND version = $2`
4. Use policy_versions.source_definition for re-execution
5. Compare result hashes to verify determinism
6. Log EVALUATION_REPLAYED audit event with chain hash

**Risk Level:** MEDIUM-HIGH
- Audit trail must be complete and trustworthy
- Hash chain must be cryptographically sound
- Cannot lose audit events

**Verification Gates:**
- [ ] Audit schema deploys
- [ ] DELETE/UPDATE blocked (immutability)
- [ ] Hash chain verifiable
- [ ] All events logged (sampling shows 100%)
- [ ] Queries performant (< 500ms)

**Completion Criteria:**
- Every evaluation logged
- Every replay logged
- Hash chain intact
- Audit trail queryable
- 7-year retention configured

---

### Phase 5d: Persistence Integration & Load Testing

**Goal:** Validate entire persistence layer under realistic load.

**Files Impacted:**
- NEW: `tests/persistence.integration.test.ts`
- NEW: `tests/load-test-persistence.ts`
- MODIFY: Configuration for database pooling

**Implementation Steps:**
1. Integration tests (full flow: evaluate → persist → replay)
2. Load testing (100 eval/sec for 1 hour)
3. Failover testing (database restart during load)
4. Backup/restore validation
5. Performance tuning (indexes, query plans)
6. Monitoring setup (query latency, storage growth)

**Risk Level:** MEDIUM
- Need realistic production-like testing
- Load testing may reveal issues

**Verification Gates:**
- [ ] All integration tests pass
- [ ] Load test sustained 100 eval/sec
- [ ] No data loss under failure
- [ ] Backup/restore works
- [ ] Performance acceptable

**Completion Criteria:**
- Production-ready persistence layer
- Monitoring in place
- Backup strategy validated
- No known issues

---

## Phase 6: Enterprise Governance Layer (Weeks 5-7)

**Objective:** Governance-enforced policy lifecycle and change tracking.

---

### Phase 6a: Policy Lifecycle Management

**Goal:** Enforce policy state machine (DRAFT → APPROVED → ACTIVE → RETIRED).

**Files Impacted:**
- NEW: `src/lib/governance/policy-lifecycle.ts`
- NEW: `src/app/api/v1/policy/create.ts` (create draft)
- NEW: `src/app/api/v1/policy/approve.ts` (approve)
- NEW: `src/app/api/v1/policy/activate.ts` (activate)
- MODIFY: `src/lib/persistence/policy-registry.ts` (state enforcement)

**Implementation Steps:**
1. Implement state machine (DRAFT → APPROVED → ACTIVE → RETIRED)
2. Build policy creation endpoint
3. Build policy approval endpoint
4. Build policy activation endpoint
5. Enforce single active version (database constraint + app logic)
6. Create policy history view
7. Implement audit trail integration

**Risk Level:** LOW-MEDIUM
- State machine logic straightforward
- Database constraints enforce immutability

**Verification Gates:**
- [ ] State transitions work
- [ ] Invalid transitions rejected
- [ ] Only one ACTIVE version
- [ ] Audit trail logged
- [ ] History queryable

**Completion Criteria:**
- Policy lifecycle enforced
- Audit trail complete
- Views working
- No invalid states possible

---

### Phase 6b: Change Request & Approval Workflow

**Goal:** Structured approval process for policy changes.

**Files Impacted:**
- NEW: `src/lib/governance/change-request.ts`
- NEW: `src/app/api/v1/policy/request-change.ts`
- NEW: `src/app/api/v1/policy/approve-change.ts`
- NEW: `src/app/api/v1/policy/changes/list.ts`
- NEW: `src/lib/persistence/policy_changes.ts` (table)

**Implementation Steps:**
1. Create policy_changes table
2. Implement change request workflow
3. Build change request endpoint
4. Build change approval endpoint
5. Implement change tracking (what changed, why)
6. Create audit events for changes
7. Generate change summaries/diffs

**Risk Level:** LOW
- Workflow logic straightforward
- Similar to policy lifecycle

**Verification Gates:**
- [ ] Change requests tracked
- [ ] Approvals recorded
- [ ] Audit logged
- [ ] Queries work
- [ ] History complete

**Completion Criteria:**
- Change workflow operational
- Approval history available
- Audit trail linked
- No policy changes without request/approval

---

### Phase 6c: Role-Based Access Control (RBAC)

**Goal:** Enforce governance roles (Developer, Reviewer, Approver, Operator, Auditor).

**Files Impacted:**
- NEW: `src/lib/governance/rbac.ts`
- MODIFY: All policy endpoints (add permission checks)
- MODIFY: All audit endpoints (add permission checks)
- NEW: `src/middleware/enforce-roles.ts`

**Implementation Steps:**
1. Define roles and permissions
2. Build RBAC middleware
3. Apply RBAC to policy endpoints
4. Apply RBAC to audit endpoints
5. Log all access attempts (audit trail)
6. Implement role assignment (admin endpoint)

**Risk Level:** MEDIUM
- Security-critical
- Must not allow unauthorized access

**Verification Gates:**
- [ ] Unauthorized requests rejected
- [ ] Correct roles allowed
- [ ] All access logged
- [ ] Audit trail complete
- [ ] Role changes tracked

**Completion Criteria:**
- Roles enforced
- Audit trail complete
- No privilege escalation possible
- Access control tested

---

## Phase 7: Institutional Readiness (Weeks 8-10)

**Objective:** Design and implement minimum architecture for regulatory, audit, and enterprise requirements.

---

### Phase 7a: Regulatory Compliance Evidence

**Goal:** Generate evidence needed for regulatory inquiries.

**Files Impacted:**
- NEW: `src/lib/compliance/regulatory-queries.ts`
- NEW: `src/app/api/v1/compliance/evaluation-evidence.ts`
- NEW: `src/app/api/v1/compliance/policy-evidence.ts`
- NEW: `src/app/api/v1/compliance/determinism-report.ts`

**Implementation Steps:**
1. Build regulatory query templates
2. Implement "all decisions for borrower type X in period Y"
3. Implement "policy version history with approvals"
4. Implement "determinism verification report"
5. Create compliance evidence export (CSV/JSON)
6. Implement data integrity verification

**Risk Level:** MEDIUM
- Must generate accurate, verifiable evidence
- Regulatory liability if wrong

**Verification Gates:**
- [ ] Queries return accurate results
- [ ] Evidence linked to audit trail
- [ ] Hashes verifiable
- [ ] Export format standard
- [ ] Documentation complete

**Completion Criteria:**
- Regulatory queries work
- Evidence exportable
- Verified against raw data
- Auditor can verify independently

---

### Phase 7b: Auditor Readiness

**Goal:** Provide auditors with tools to verify system integrity.

**Files Impacted:**
- NEW: `src/lib/compliance/auditor-tools.ts`
- NEW: `src/app/api/v1/audit/verify-chain.ts` (hash chain verification)
- NEW: `src/app/api/v1/audit/replay-verification.ts` (determinism proof)
- NEW: `src/app/api/v1/audit/completeness-check.ts` (no missing events)

**Implementation Steps:**
1. Implement hash chain verification
2. Implement determinism verification (all replays match)
3. Implement event completeness check (no gaps)
4. Create audit report generator
5. Implement data export (queryable by auditor)
6. Create verification documentation

**Risk Level:** MEDIUM
- Auditors will verify this
- Must withstand scrutiny

**Verification Gates:**
- [ ] Chain verification works
- [ ] Determinism check comprehensive
- [ ] Completeness check finds missing events
- [ ] Reports accurate
- [ ] External auditor can verify

**Completion Criteria:**
- Auditor tools complete
- All verification methods working
- Documentation clear
- Independent verification possible

---

### Phase 7c: Lender & Enterprise APIs

**Goal:** Provide clients with decision evidence and audit trails.

**Files Impacted:**
- NEW: `src/app/api/v1/client/evaluation-details.ts`
- NEW: `src/app/api/v1/client/decision-evidence.ts`
- NEW: `src/app/api/v1/client/audit-trail.ts`
- NEW: `src/lib/client/response-formatting.ts`

**Implementation Steps:**
1. Implement client evaluation endpoint (with evidence)
2. Implement client decision evidence endpoint
3. Implement client audit trail endpoint
4. Define client API schema
5. Implement rate limiting and access control
6. Create client documentation

**Risk Level:** LOW
- Data already internal
- Just formatting for clients

**Verification Gates:**
- [ ] APIs return correct data
- [ ] Evidence linked to evaluations
- [ ] Audit trail queryable
- [ ] Access control working
- [ ] Documentation complete

**Completion Criteria:**
- Client APIs operational
- Evidence accessible
- Audit trails available
- Rate limiting in place

---

### Phase 7d: Institutional Onboarding & Compliance

**Goal:** Complete institutional readiness for regulatory, audit, and operational deployment.

**Files Impacted:**
- NEW: `docs/COMPLIANCE_EVIDENCE_GUIDE.md`
- NEW: `docs/REGULATORY_INQUIRIES.md`
- NEW: `docs/AUDITOR_VERIFICATION.md`
- NEW: `docs/CLIENT_INTEGRATION.md`
- NEW: `docs/OPERATIONAL_PROCEDURES.md`

**Implementation Steps:**
1. Create regulatory compliance guide
2. Create auditor verification guide
3. Create client integration guide
4. Create operational procedures manual
5. Create incident response procedures
6. Create backup/recovery procedures
7. Conduct compliance review

**Risk Level:** LOW
- Documentation only
- But critical for operations

**Verification Gates:**
- [ ] Documentation complete
- [ ] Procedures tested
- [ ] Compliance sign-off obtained
- [ ] Operational team trained
- [ ] Incident response validated

**Completion Criteria:**
- Ready for institutional deployment
- All stakeholder concerns addressed
- Procedures validated
- Compliance team satisfied

---

## Cross-Phase Considerations

### Testing Strategy

**Unit Tests (Every Phase):**
- Schema: immutability, uniqueness constraints
- Persistence: CRUD operations
- Governance: state machine, workflow
- Compliance: evidence accuracy

**Integration Tests (Every Phase):**
- Full flow: Request → Persist → Query
- Policy lifecycle: Create → Approve → Activate → Retire
- Audit trail: Event → Log → Query → Verify

**Load Tests (Phase 5d, 6c):**
- 100 evaluations/sec sustained
- Hash computation overhead < 50ms
- Query response < 500ms p99

**Compliance Tests (Phase 7):**
- Regulatory evidence accuracy
- Auditor verification tools
- Hash chain integrity
- Determinism proof

### Database Migration Strategy

**Phase 5a:**
- Create schema (fresh database)
- Backup before changes

**Phase 5c:**
- Migrate existing evaluations to audit_events (one-time)
- Verify hash chain integrity

**Phase 6:**
- Create policy_versions from current policies
- Mark all as RETIRED (conservatively)
- Create new ACTIVE version as current

**Phase 7:**
- No schema changes
- Backup for regulatory hold

### Monitoring & Observability

**Metrics to Track (All Phases):**
- Evaluation insertion latency
- Query performance (95th, 99th percentile)
- Audit event logging latency
- Policy activation timing
- Hash computation time
- Database connection pool health
- Storage growth rate

**Alerts to Set:**
- Evaluation insertion > 100ms
- Audit logging > 100ms
- Policy activation failure
- Hash verification failure
- Audit chain broken
- Backup failed

---

## Phase Dependencies

```
Phase 5a (Evaluation Persistence)
    ↓
Phase 5b (Policy Registry) — depends on 5a
    ↓
Phase 5c (Audit Ledger) — depends on 5a, 5b
    ↓
Phase 5d (Integration & Load Testing) — depends on 5a, 5b, 5c
    ↓
Phase 6a (Policy Lifecycle) — depends on 5b, 5d
    ↓
Phase 6b (Change Requests) — depends on 6a
    ↓
Phase 6c (RBAC) — depends on 6a, 6b
    ↓
Phase 7a (Regulatory Evidence) — depends on 5c, 6c
    ↓
Phase 7b (Auditor Tools) — depends on 7a
    ↓
Phase 7c (Lender APIs) — depends on 7a
    ↓
Phase 7d (Institutional Readiness) — depends on 7a, 7b, 7c
```

---

## Success Criteria (Full Roadmap)

### At Phase 5d Completion:
- ✓ Persistence layer production-ready
- ✓ All evaluations persist immutably
- ✓ Audit events logged
- ✓ Replay fully functional
- ✓ Load-tested and performant

### At Phase 6c Completion:
- ✓ Policy governance enforced
- ✓ Change workflow operational
- ✓ RBAC preventing unauthorized access
- ✓ Audit trail comprehensive

### At Phase 7d Completion:
- ✓ Regulatory evidence generation working
- ✓ Auditor verification tools complete
- ✓ Client APIs operational
- ✓ Institutional deployment ready

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Database performance degradation | Load testing early, index tuning |
| Data loss | Backup strategy, replication, WAL logging |
| Schema migration issues | Careful planning, rollback procedures |
| Regulatory non-compliance | Compliance reviews at each phase |
| Access control breaches | RBAC testing, security review |
| Audit trail tampering | Cryptographic verification, monitoring |

---

## Timeline Summary

| Phase | Duration | Key Deliverable |
|-------|----------|-----------------|
| 5a | Week 1-2 | Evaluation persistence |
| 5b | Week 2-3 | Policy registry |
| 5c | Week 3-4 | Audit ledger |
| 5d | Week 4-5 | Load testing, production readiness |
| 6a | Week 5-6 | Policy lifecycle governance |
| 6b | Week 6-7 | Change request workflow |
| 6c | Week 7 | RBAC enforcement |
| 7a | Week 8 | Regulatory evidence |
| 7b | Week 8-9 | Auditor tools |
| 7c | Week 9 | Lender/enterprise APIs |
| 7d | Week 10 | Institutional readiness |

**Total: 10 weeks (can be parallelized to 8-9 weeks)**

---

## Go-Live Readiness Checklist

**Before Phase 5a:**
- [ ] Database infrastructure provisioned
- [ ] Backup/recovery procedures documented
- [ ] Monitoring/alerting configured
- [ ] Team trained on new architecture

**Before Phase 7d:**
- [ ] All tests passing (unit, integration, load)
- [ ] Compliance review complete
- [ ] Regulatory guidance incorporated
- [ ] Auditor sign-off obtained
- [ ] Operational procedures validated
- [ ] Client integration documented
- [ ] Incident response tested

**At Go-Live:**
- [ ] Cut over to new persistence layer
- [ ] Validate data integrity
- [ ] Monitor for issues
- [ ] Stand-by incident response team

---

**This roadmap transforms RunPayway into an enterprise-grade evaluation platform with institutional credibility, regulatory evidence generation, and deterministic auditability.**

**Estimated effort: 8-10 weeks for experienced team.**  
**All phases preserve frozen deterministic engine and reason codes.**
