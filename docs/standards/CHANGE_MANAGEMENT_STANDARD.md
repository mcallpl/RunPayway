# RunPayway Change Management Standard v1.0

**Status**: ACTIVE  
**Version**: 1.0.0  
**Effective Date**: 2026-06-22  
**Owner**: RunPayway Governance  

---

## 1. Change Control Board (CCB)

**Members**:
- Policy Approver (chair)
- Auditor (compliance review)
- Administrator (technical feasibility)
- Policy Reviewer (quality assurance)

**Frequency**: Weekly for planned changes, immediate for incidents

---

## 2. Change Classification

### Type 1: Standard Changes
**Examples**: Patch updates, bug fixes, non-policy code refactoring

**Process**:
1. Code review by Policy Reviewer
2. Full test suite pass
3. Deploy to Staging (automated)
4. CCB review (15 minutes, minimal discussion)
5. Approval or rejection
6. Deploy to Production if approved

**Approval**: CCB majority (3 of 4)

### Type 2: Normal Changes
**Examples**: New policies, new features, policy updates

**Process**:
1. Author creates ADR (Architecture Decision Record)
2. Requirement ID assigned (REQ-###)
3. Code review by Policy Reviewer
4. Full test suite pass (100% rule coverage)
5. Staging promotion with 24-hour soak
6. CCB review (detailed, ~1 hour)
7. Approval or rejection
8. Deploy to Production if approved

**Approval**: CCB unanimous (4 of 4)

### Type 3: Emergency Changes
**Examples**: Security vulnerability, critical production bug

**Process**:
1. Author creates brief emergency ADR
2. Administrator or Approver notifies CCB
3. Immediate CCB call (same day)
4. Abbreviated review (30 minutes)
5. Deploy to Production if approved
6. Full ADR + postmortem within 24 hours
7. CCB review of postmortem within 3 days

**Approval**: Policy Approver + Auditor minimum (may skip others in true emergency)

---

## 3. Architecture Decision Records (ADRs)

Every change requires an ADR.

**Location**: `/docs/adr/`  
**Naming**: `ADR-###-{slug}.md`  
**Status**: PROPOSED → ACCEPTED → SUPERSEDED

**Template**:

```markdown
# ADR-### {Decision Title}

## Decision
[One sentence describing what was decided]

## Context
[Why this decision was necessary]
- Problem statement
- Constraints
- Stakeholder concerns

## Alternatives Considered
- [Alternative 1]
  - Pros: ...
  - Cons: ...
- [Alternative 2]
  - Pros: ...
  - Cons: ...

## Reason Chosen
[Why this alternative was selected over others]

## Impact
- Affected components
- Performance implications
- Cost implications
- Risk mitigation

## Traceability
- Requirement: REQ-###
- Policy: POL-###
- Tests: TEST-###
- Reason Codes: RP-*-###

## Approval
- Date: YYYY-MM-DD
- Approved by: [Name + Role]
- CCB Vote: [unanimous/majority/other]

## References
[Links to related ADRs, standards, code]
```

---

## 4. Requirement IDs (REQ-###)

Trace from requirements → implementation → tests.

**Categories**:

| ID Range | Category | Examples |
|----------|----------|----------|
| REQ-001–010 | Functional | Evaluation, audit, replay |
| REQ-011–020 | Non-functional | Performance, determinism |
| REQ-021–030 | Compliance | SOC 2, GLBA, audit trail |
| REQ-031–040 | Security | Encryption, access control |
| REQ-041–050 | Operational | Monitoring, backup, disaster recovery |

**Traceability**:
```
REQ-001 (Commission concentration threshold)
  ↓
ADR-001-Commission-Threshold.md
  ↓
POL-001-Mortgage-Mixed-Income.md
  ↓
AST node in seed-policy.ts
  ↓
TEST-001-Commission-Concentration.test.ts
  ↓
RP-INC-001 (reason code)
```

---

## 5. Policy Changes

### Updating Existing Policy
1. Create new policy version (1.0.0 → 1.0.1 for patch, 1.1.0 for minor)
2. Write ADR explaining change
3. New tests for new/modified rules
4. Full regression testing (all existing rules still work)
5. CCB review
6. Deploy to Staging (24-hour soak)
7. CCB final approval
8. Deploy to Production

### Creating New Policy
1. Write ADR
2. Assign requirement IDs
3. Write RP-DSL policy
4. Write comprehensive tests
5. Map reason codes
6. Policy Reviewer approval
7. CCB approval
8. Deploy following Normal Change process

### Deprecating Policy
1. Write ADR explaining deprecation
2. Mark policy status = DEPRECATED in registry
3. Set deprecation_date (60 days minimum)
4. All new evaluations use updated policy
5. Historical evaluations preserve old policy
6. After deprecation_date, may archive old policy

---

## 6. Code Review Checklist

Every code change reviewed against:

- [ ] **Determinism**: No randomness, no external state
- [ ] **Auditability**: Audit logging present
- [ ] **Traceability**: ADR, REQ-#, test evidence
- [ ] **Security**: No injection vulnerabilities, secrets scanning pass
- [ ] **Tests**: 100% coverage of new code, all tests pass
- [ ] **Compliance**: No hardcoded policy logic, data validation present
- [ ] **Documentation**: ADR complete, code comments minimal
- [ ] **Performance**: No regressions, benchmarks pass

---

## 7. Test Evidence Requirements

Every change must include test evidence:

```
/evidence/test-results/
  └── {change-id}/
      ├── unit-tests.txt
      ├── integration-tests.txt
      ├── compiler-output.txt
      ├── coverage-report.html
      └── replay-validation.json
```

**Coverage targets**:
- Unit tests: 100% of new code
- Integration tests: All API endpoints
- Policy tests: Every rule (positive, negative, boundary)
- Compiler tests: All operators, all validations

---

## 8. Release Management

### Release Cycle
- **Frequency**: Weekly (or as-needed for emergencies)
- **Timing**: Every Thursday 2 PM ET
- **Freeze**: Wednesday 5 PM ET (no new PRs)
- **Validation**: Thursday 9 AM–1 PM ET

### Release Checklist
- [ ] All PRs merged to main
- [ ] All tests pass
- [ ] All compiler validations pass
- [ ] Release notes prepared
- [ ] ADRs for all changes complete
- [ ] CCB final sign-off
- [ ] Audit records captured
- [ ] Version number bumped (SemVer)
- [ ] Tag created: `v{major}.{minor}.{patch}`
- [ ] Deploy to Production

### Release ID Format
```
RP-REL-{date}-{number}

Example: RP-REL-2026-06-22-001
```

**Contains**:
- Release ID
- Date
- Policies changed (policy_id, policy_version)
- Reason codes changed (new, deprecated, superseded)
- Tests passed (count)
- Approvals (who, when)
- Changelog (what changed, why)

---

## 9. Rollback Procedure

If production issue detected:

1. **Severity Assessment** (within 15 min)
   - Impact: How many evaluations affected?
   - Data integrity: Are audit records safe?
   - Compliance: Regulatory exposure?

2. **Rollback Decision** (within 30 min)
   - If severity critical: Rollback immediately
   - If severity high: Investigate alternative fix
   - If severity medium: Fix and redeploy
   - If severity low: Schedule fix for next release

3. **Rollback Execution** (within 1 hour)
   - Revert to last known-good commit
   - Deploy to Production
   - Notify Auditor
   - Capture rollback in audit trail

4. **Postmortem** (within 24 hours)
   - Root cause analysis
   - Corrective action plan
   - ADR documenting what failed
   - CCB review of prevention measures

---

## 10. Documentation Requirements

Every release documented:
- [ ] Release notes (what changed, why)
- [ ] ADRs (decisions made)
- [ ] Requirements (REQ-### traceability)
- [ ] Test evidence (results, coverage)
- [ ] Approval signatures (CCB members)
- [ ] Audit timestamp (when deployed)

---

## 11. Frequency of Review

- **Weekly**: Standard changes approved
- **Monthly**: CCB reviews change patterns, metrics
- **Quarterly**: Full governance audit
- **Annually**: External compliance audit, penetration test

---

## References

- GOVERNANCE_STANDARD.md
- ARCHITECTURE_STANDARD.md
- SECURITY_STANDARD.md
- AUDIT_STANDARD.md
