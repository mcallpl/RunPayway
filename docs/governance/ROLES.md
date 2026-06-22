# RunPayway Governance Roles

**Status**: ACTIVE  
**Version**: 1.0.0  
**Last Updated**: 2026-06-22  
**Owner**: RunPayway Governance  

---

## Overview

RunPayway operates under a 5-role governance model. Currently, one person (CJ McCallister) fills all roles. As the organization grows, each role will be assigned separately.

**Principle**: Define roles now so governance scales smoothly.

---

## Role 1: Policy Author

**Purpose**: Write and test new policies

**Permissions**:
- [ ] Create policies in Sandbox
- [ ] Write RP-DSL policies
- [ ] Write and run tests locally
- [ ] Run policy compiler
- [ ] Submit policy for review (via PR)

**Constraints**:
- Cannot approve own policies
- Cannot deploy to Production
- Cannot modify Staging/Production policies
- Cannot bypass testing requirements

**Current Assignment**: CJ McCallister  
**On-Call**: As needed  

**Accountability**:
- Policy correctness (tests pass)
- Documentation (ADR, comments)
- Traceability (requirement IDs)

---

## Role 2: Policy Reviewer

**Purpose**: Code review of policies before promotion

**Permissions**:
- [ ] Read policies in all environments
- [ ] Run compiler against policies
- [ ] Execute tests locally
- [ ] Run evaluations in Sandbox
- [ ] Comment on PR / policy change
- [ ] Approve or reject for next stage

**Constraints**:
- Cannot approve own reviews (different person)
- Cannot deploy policies
- Cannot skip testing

**Current Assignment**: CJ McCallister (separate review session)  
**Separation of Duties**: Must be different session from Author  

**Accountability**:
- Code quality (no bugs, no injection risks)
- Compliance (no policy logic violations)
- Test coverage (100% of rules)

**Review Checklist**:
- [ ] Policy logic correct (business rules validated)
- [ ] RP-DSL syntax valid (compiler passes)
- [ ] Tests pass (unit, integration, regression)
- [ ] No security vulnerabilities (no injection, etc.)
- [ ] Requirement traceability (REQ-### referenced)
- [ ] ADR present and complete
- [ ] No hardcoded thresholds without justification

---

## Role 3: Policy Approver

**Purpose**: Final approval and production deployment authority

**Permissions**:
- [ ] Approve policies for Staging promotion
- [ ] Approve policies for Production promotion
- [ ] Deploy policies to Production
- [ ] Create release notes
- [ ] Sign off on releases
- [ ] Authorize rollback
- [ ] Manage cohort-policy bindings

**Constraints**:
- Cannot be Author or Reviewer for same policy
- Cannot skip compliance validations
- Cannot override security requirements
- Must maintain audit trail

**Current Assignment**: CJ McCallister (after Reviewer approval)  
**Separation of Duties**: Approver ≠ Author and Approver ≠ Reviewer  

**Accountability**:
- Production stability (no bad releases)
- Compliance (auditors approve decisions)
- Documentation (release notes complete)
- Risk management (rollback plan documented)

**Approval Checklist**:
- [ ] Reviewer signed off
- [ ] All tests passed in Staging
- [ ] Compliance audit passed
- [ ] Release notes prepared
- [ ] Rollback plan documented
- [ ] Stakeholders notified

---

## Role 4: Auditor

**Purpose**: Independent audit and compliance validation

**Permissions**:
- [ ] Read-only access to all audit records
- [ ] Query historical evaluations
- [ ] Run replay validation (MATCH/MISMATCH)
- [ ] Generate compliance reports
- [ ] Flag policy violations
- [ ] Request investigations
- [ ] Access all ADRs and documentation

**Constraints**:
- Cannot modify audit records
- Cannot deploy policies
- Cannot delete or redact records
- Cannot approve deployments
- No write access to any system

**Current Assignment**: TBD (external vendor recommended)  
**On-Call**: Continuous monitoring, quarterly deep audit  

**Accountability**:
- Regulatory compliance (SOC 2, GLBA, Fair Lending)
- Audit trail integrity (no tampering detected)
- Policy effectiveness (violations tracked, trends analyzed)

**Audit Responsibilities**:
- [ ] Daily: Monitor evaluation logs for anomalies
- [ ] Weekly: Compliance trend analysis
- [ ] Monthly: Policy effectiveness report
- [ ] Quarterly: Deep audit (full evaluation sample validation)
- [ ] Annually: External audit prep

---

## Role 5: Administrator

**Purpose**: System operations, security, and infrastructure

**Permissions**:
- [ ] Manage API keys and credentials
- [ ] Manage user accounts and access
- [ ] Configure backups and retention
- [ ] Monitor system health
- [ ] Manage encryption keys (AWS KMS)
- [ ] Emergency incident response
- [ ] Rotate secrets quarterly

**Constraints**:
- Cannot approve production policies
- Cannot modify audit records
- Cannot delete historical data
- Cannot bypass security controls

**Current Assignment**: CJ McCallister  
**On-Call**: 24/7 for critical incidents  

**Accountability**:
- System uptime (99.9% target)
- Security (no breaches, CVE remediation)
- Disaster recovery (backups verified weekly)
- Access controls (audit logging complete)

**Admin Checklist**:
- [ ] Backups verified daily
- [ ] API keys rotated quarterly
- [ ] CVE scans passed (weekly)
- [ ] Access logs reviewed (weekly)
- [ ] Incident response plan current
- [ ] Disaster recovery tested (quarterly)

---

## Approval Matrix

| Action | Author | Reviewer | Approver | Auditor | Admin |
|--------|--------|----------|----------|---------|-------|
| Create policy | ✓ | ✗ | ✗ | ✗ | ✗ |
| Review policy | ✗ | ✓ | ✗ | ✗ | ✗ |
| Approve deployment | ✗ | ✗ | ✓ | ✗ | ✗ |
| Deploy to Production | ✗ | ✗ | ✓ | ✗ | ✓ |
| Query audit records | ✗ | ✗ | ✗ | ✓ | ✗ |
| Manage users | ✗ | ✗ | ✗ | ✗ | ✓ |
| Manage API keys | ✗ | ✗ | ✗ | ✗ | ✓ |

---

## Current Role Assignments

| Role | Current | Backup | Transition Plan |
|------|---------|--------|-----------------|
| Policy Author | CJ McCallister | TBD | Hire at $750K ARR |
| Policy Reviewer | CJ McCallister | TBD | Hire at $1M ARR |
| Policy Approver | CJ McCallister | TBD | Hire CFO at $500K ARR |
| Auditor | TBD | Consulting firm | Hire full-time at $500K ARR |
| Administrator | CJ McCallister | TBD | Hire DevOps at $750K ARR |

---

## Transition Plan

### Phase 1: $0–250K ARR
- One person: CJ McCallister (all roles)
- External audit: Quarterly (consulting firm)
- Separation: Maintain via documented process

### Phase 2: $250K–500K ARR
- Hire Auditor (external FTE or vendor)
- Separation: Author ≠ Reviewer (different CJ sessions)
- CFO review: Quarterly business reviews

### Phase 3: $500K–1M ARR
- Hire dedicated Policy Reviewer
- Hire IT Administrator
- External compliance audit: Annual (SOC 2 Type II target)

### Phase 4: $1M–2M ARR
- Hire second Policy Approver
- Hire full-time Auditor
- Hire DevOps Engineer
- Internal compliance team: 2–3 people

### Phase 5: $2M+ ARR
- Dedicated Compliance Officer
- Internal audit team: 3–5 people
- Board-level governance
- External audit: Continuous (Big 4 firm)

---

## Conflict of Interest

**No one person should hold multiple decision-making roles for same policy change**:

- Author → Reviewer ✗ (must be different person or different session)
- Reviewer → Approver ✗ (must be different person)
- Approver → Auditor ✗ (Auditor validates Approver decisions)

**Current Exception**: Single person, mitigated by:
- Documented separation process (different sessions)
- External audit (Auditor is external)
- Requirement IDs (traceable decisions)
- Change management process (forces deliberation)

---

## Escalation Path

### Policy Question
Author → Reviewer → Approver

### Regulatory Question
Author/Reviewer → Auditor → Approver

### Security Question
Administrator → Auditor → Approver

### Emergency
Approver → Administrator (immediate action)
→ Auditor (post-action review)
→ ADR (document reasoning)

---

## Training & On-Boarding

New role assignees must complete:
- [ ] Read GOVERNANCE_STANDARD.md
- [ ] Read all 5 ADRs (ADR-001 through ADR-005)
- [ ] Read relevant standards (e.g., AUDIT_STANDARD for Auditor)
- [ ] Shadow current role holder (1 week)
- [ ] Complete checklist above (5 examples)
- [ ] Pass knowledge test (written)
- [ ] Auditor sign-off

---

## Performance Metrics

### Policy Author
- Defect rate (bugs found in review)
- Test coverage (100% target)
- Time to completion (days)

### Policy Reviewer
- Review thoroughness (issues caught)
- Approval rate (% approved without revision)
- Review cycle time (days)

### Policy Approver
- Deployment success rate (% no rollback)
- Production incident rate (issues per month)
- Approval cycle time (days)

### Auditor
- Compliance audit results (pass/fail)
- Policy effectiveness (trend analysis)
- Anomaly detection (violations flagged)

### Administrator
- System uptime (99.9% target)
- Backup success rate (100%)
- Security incident response time (hours)

---

## References

- GOVERNANCE_STANDARD.md
- CHANGE_MANAGEMENT_STANDARD.md
- SECURITY_STANDARD.md
