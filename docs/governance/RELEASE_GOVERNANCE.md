# RunPayway Release Governance

**Status**: ACTIVE  
**Version**: 1.0.0  
**Last Updated**: 2026-06-22  
**Owner**: RunPayway Governance  

---

## Release Cycle

- **Frequency**: Weekly (every Thursday)
- **Code Freeze**: Wednesday 5 PM ET
- **Testing Window**: Thursday 9 AM–1 PM ET
- **Deployment**: Thursday 2 PM ET

---

## Release ID Format

```
RP-REL-{major}.{minor}.{patch}

Example: RP-REL-1.0.0
```

**Version Scheme**: SemVer (major.minor.patch)

---

## Release Checklist

### Pre-Release (Wednesday)

- [ ] All PRs merged to main
- [ ] Code freeze: No new merges after 5 PM ET
- [ ] Branch preparation: Create release branch
- [ ] Version bump: Update version number

### Testing Window (Thursday 9 AM–1 PM)

- [ ] Run full test suite (unit + integration)
- [ ] Run policy compiler (all policies valid)
- [ ] Run replay validation (determinism verified)
- [ ] Run security scan (dependencies, secrets)
- [ ] Generate test report
- [ ] All tests: Must pass 100%

### Release Decision (Thursday 1–2 PM)

- [ ] Test results review
- [ ] Build artifact verification
- [ ] Change log accuracy
- [ ] Rollback plan documented
- [ ] CCB final sign-off
- [ ] Policy Approver approval

### Deployment (Thursday 2 PM)

- [ ] Deploy to Production
- [ ] Health check: All endpoints respond
- [ ] Smoke test: Key functionality works
- [ ] Audit record: Deployment logged
- [ ] Notification: Stakeholders informed

### Post-Deployment (Thursday–Friday)

- [ ] Monitor: First 24 hours close watch
- [ ] Metrics: Performance baseline established
- [ ] Incident response: On-call coverage active
- [ ] Documentation: Release notes published

---

## Release Contents

Every release must document:

### RP-REL-1.0.0 (Example)

**Released**: 2026-06-22  
**Released By**: CJ McCallister (Policy Approver)  

**Summary**:
Initial MVP release of RunPayway deterministic policy execution engine

**Policies Changed**:
- policy_mortgage_mixed_income v1.0.0 (NEW)

**Reason Codes Added**:
- RP-INC-001 (Commission concentration)
- RP-INC-002 (Commission volatility)
- RP-OBL-001 (Obligation ratio)

**APIs**:
- POST /api/v1/evaluate (NEW)
- POST /api/v1/replay (NEW)

**Tests**:
- Total: 87 tests
- Passed: 87 (100%)
- Failed: 0
- Coverage: 98%

**Compiler Output**:
- Policies validated: 1
- Policy errors: 0
- Warnings: 0

**Approvals**:
- Policy Reviewer: ✓ Approved
- Policy Approver: ✓ Approved
- Auditor: ✓ No issues

**Breaking Changes**:
- None (initial release)

**Known Issues**:
- None

**Performance**:
- Average evaluation: 45ms
- Max evaluation: 120ms
- Throughput: 1200 evals/sec

**Metrics**:
- Uptime: 100% (no downtime)
- Error rate: 0%
- P95 latency: 78ms

---

## Release Approval Template

```markdown
# Release Approval: RP-REL-{VERSION}

## Approval By
- [ ] Policy Reviewer: {name}, {date}, signature
- [ ] Policy Approver: {name}, {date}, signature
- [ ] Auditor: {name}, {date}, signature
- [ ] Administrator: {name}, {date}, signature

## Pre-Release Checklist
- [ ] All tests passing (87/87)
- [ ] Compiler: All policies valid
- [ ] Security scan: No vulnerabilities
- [ ] Changelog complete
- [ ] Documentation updated
- [ ] Rollback plan documented

## Post-Deployment Checklist
- [ ] Deploy successful (all endpoints responding)
- [ ] Smoke tests passed
- [ ] Audit records captured
- [ ] Metrics established
- [ ] On-call coverage active
- [ ] Stakeholders notified

## Approval Decision
- [ ] APPROVED (proceed to production)
- [ ] APPROVED WITH CONDITIONS (see notes)
- [ ] REJECTED (see issues)

## Notes
[Any additional comments]

## Signature
Policy Approver: _____________________________ Date: _________
Auditor: _____________________________ Date: _________
```

---

## Change Types by Release Cycle

### Standard Changes (Can be routine)
- Patch updates (bug fixes)
- Non-policy code refactoring
- Documentation updates
- Performance optimizations

**Approval**: Policy Reviewer + Policy Approver  
**Cycle**: Standard weekly release

### Normal Changes (Require more scrutiny)
- New policies
- New features
- Policy updates
- New reason codes

**Approval**: Policy Reviewer + Policy Approver + Auditor  
**Cycle**: Standard weekly release  
**Soak Time**: 24 hours in Staging

### Emergency Changes (Bypass normal cycle if needed)
- Security vulnerabilities
- Critical production bugs
- Regulatory compliance issues

**Approval**: Policy Approver + Auditor (minimum)  
**Cycle**: Immediate deployment  
**Post-Action**: Full ADR + postmortem within 24 hours

---

## Rollback Procedure

**Trigger Conditions**:
1. Critical data corruption
2. All evaluations returning ERROR
3. Security breach detected
4. Regulatory non-compliance discovered

**Rollback Process** (< 1 hour):
1. Policy Approver decides to rollback
2. Administrator executes rollback (revert to previous version)
3. Health check: All endpoints responding
4. Smoke tests: Key functionality working
5. Notifica stakeholders
6. Auditor logs rollback
7. Post-mortem: 24-hour deadline

**Rollback Approval**: Policy Approver only (no need to wait for full CCB)  
**Documentation**: ADR created within 24 hours

---

## Release Notes Template

```markdown
# RunPayway Release Notes: RP-REL-{VERSION}

## Overview
[1-2 sentence summary of release]

## What's New
- [Feature 1]
- [Feature 2]
- [Policy change 1]

## Bug Fixes
- [Bug 1]: Fixed issue where [description]
- [Bug 2]: Fixed issue where [description]

## Breaking Changes
- [If any, describe migration path]

## Performance
- Average evaluation: Xms (was Yms, improvement: Z%)
- Throughput: X evals/sec (was Y)
- P95 latency: Xms (was Yms)

## Upgrade Instructions
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Known Issues
- [Issue 1]: Workaround: [description]
- [Issue 2]: Status: Assigned to [person], ETA [date]

## Support
- Issues: Contact support@runpayway.com
- Security: Report to security@runpayway.com
- Documentation: https://runpayway.com/docs

## Acknowledgments
Thanks to [contributors]

---

Released: {DATE}  
Release Manager: {NAME}
```

---

## Monitoring Post-Release

**Metrics to Watch** (first 24 hours):
- Error rate (should stay < 0.1%)
- P95 latency (should match baseline)
- Throughput (should match baseline)
- Audit record integrity (all records stored)
- Replay validation (MATCH rate > 99.9%)

**Escalation Path**:
1. Alert triggers → On-call engineer notified
2. Investigate (< 15 minutes)
3. If critical → Page Policy Approver + Auditor
4. If needed → Initiate rollback

---

## Release Calendar (Q3 2026)

| Release | Date | Version | Type |
|---------|------|---------|------|
| Initial | 2026-06-22 | 1.0.0 | Standard |
| Patch 1 | 2026-06-29 | 1.0.1 | Standard (if bugs found) |
| Minor | 2026-07-20 | 1.1.0 | Normal (new features) |

---

## References

- CHANGE_MANAGEMENT_STANDARD.md
- GOVERNANCE_STANDARD.md
- ROLES.md
