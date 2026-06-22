# RunPayway Governance Standard v1.0

**Status**: ACTIVE  
**Version**: 1.0.0  
**Effective Date**: 2026-06-22  
**Owner**: RunPayway Governance  

---

## 1. Governance Model

RunPayway operates under a 5-role governance model, even if initially one person fills all roles.

**Principle**: Architecture scales; governance scales. Define roles now.

---

## 2. Roles & Responsibilities

### Role 1: Policy Author
**Responsibility**: Write and test policies

**Permissions**:
- [ ] Create policies in Sandbox
- [ ] Write AST in RP-DSL
- [ ] Write policy tests
- [ ] Run local compiler
- [ ] Submit for review

**Constraints**:
- [ ] Cannot approve own policies
- [ ] Cannot deploy to Production
- [ ] Cannot modify Staging or Production policies

---

### Role 2: Policy Reviewer
**Responsibility**: Code review of policies

**Permissions**:
- [ ] Read policies in all environments
- [ ] Run compiler against policies
- [ ] Run policy tests
- [ ] Execute evaluations in Sandbox
- [ ] Comment on policy changes
- [ ] Approve or reject for next stage

**Constraints**:
- [ ] Cannot approve own reviews
- [ ] Cannot deploy policies

---

### Role 3: Policy Approver
**Responsibility**: Four-eyes approval for production deployment

**Permissions**:
- [ ] Approve policies for Staging promotion
- [ ] Approve policies for Production promotion
- [ ] Deploy policies to Production
- [ ] Create release notes
- [ ] Sign off on releases
- [ ] Authorize rollback

**Constraints**:
- [ ] Cannot be Author or Reviewer for same policy
- [ ] Cannot skip testing requirement
- [ ] Cannot override compliance rules

---

### Role 4: Auditor
**Responsibility**: Independent audit of evaluations and compliance

**Permissions**:
- [ ] Read-only access to all audit records
- [ ] Query historical evaluations
- [ ] Run replay validation
- [ ] Generate compliance reports
- [ ] Flag policy violations
- [ ] Request investigations

**Constraints**:
- [ ] Cannot modify audit records
- [ ] Cannot deploy policies
- [ ] Cannot delete or redact records

---

### Role 5: Administrator
**Responsibility**: System operations and security

**Permissions**:
- [ ] Manage API keys
- [ ] Manage user accounts
- [ ] Configure backups and retention
- [ ] Monitor system health
- [ ] Manage encryption keys
- [ ] Emergency incident response

**Constraints**:
- [ ] Cannot approve production policies
- [ ] Cannot modify audit records
- [ ] Cannot delete historical data

---

## 3. Policy Promotion Workflow

### Stage 1: Sandbox
- Policy Author writes and tests locally
- Tests must pass (100% rule coverage)
- No evaluations affect customers

### Stage 2: Staging
- Policy Author submits for review
- Policy Reviewer reviews and tests
- Reviewer must approve (different person)
- Compliance validation runs
- Sample evaluations executed and logged

### Stage 3: Production
- Policy Approver reviews Staging results
- Requires Reviewer approval + Approver sign-off
- Policy Approver deploys
- Audit record captures deployment
- Monitored for first 24 hours

---

## 4. Approval Requirements

### For Staging Promotion
- [ ] Policy Reviewer sign-off (different person from Author)
- [ ] All tests pass
- [ ] Compiler validation passes
- [ ] No critical security issues
- [ ] Documentation complete

### For Production Promotion
- [ ] Policy Approver approval (different person from Author + Reviewer)
- [ ] Staging validation complete
- [ ] Release notes prepared
- [ ] Rollback plan documented
- [ ] Audit trail captured

---

## 5. Change Management

**Every change requires**:
- ADR (Architecture Decision Record)
- Requirement ID (REQ-###)
- Test evidence
- Approval by Policy Approver
- Release notes
- Audit record

**No exceptions**:
- No hotfixes without approval
- No emergency deployments without ADR
- No policy changes without version bump

---

## 6. Escalation & Incident Response

### Incident Levels
- **Level 1**: Minor policy bug (test failure)
  - Patch, test, promote normally
  
- **Level 2**: Incorrect evaluation result (sample data doesn't match expected)
  - Halt production changes
  - Investigate via replay
  - Root cause analysis
  - Policy fix + ADR
  - Re-test before promotion
  
- **Level 3**: Data integrity issue (audit record modified)
  - Immediate investigation by Administrator
  - Isolate affected records
  - Auditor review
  - Compliance notification

---

## 7. Audit Rights

**Auditors have right to**:
- Query any historical evaluation
- Run replay validation
- Review policy versions
- Analyze reason code usage
- Generate compliance reports
- Request investigations
- Access change logs

**Auditors do NOT have right to**:
- Modify or delete audit records
- Deploy policies
- Override compliance rules

---

## 8. Documentation Requirements

Every policy change must include:
- [ ] RP-DSL code
- [ ] Vitest tests (positive, negative, boundary)
- [ ] ADR explaining decision
- [ ] Requirement traceability
- [ ] Release notes
- [ ] Compliance justification

---

## 9. Quarterly Review

Every quarter:
- Review reason code usage
- Assess policy effectiveness
- Update governance procedures
- Training on new standards
- Compliance audit
- Release planning

---

## 10. Role Assignment (Current)

**Until organizational growth**:
- Policy Author: CJ McCallister
- Policy Reviewer: CJ McCallister (separate review session)
- Policy Approver: CJ McCallister (after review approval)
- Auditor: TBD (external vendor recommended)
- Administrator: CJ McCallister

**Transition plan**:
- Hire first Auditor at $500K ARR
- Hire second Policy Reviewer at $1M ARR
- Hire dedicated Policy Approver at $2M ARR

---

## References

- ARCHITECTURE_STANDARD.md
- CHANGE_MANAGEMENT_STANDARD.md
- AUDIT_STANDARD.md
