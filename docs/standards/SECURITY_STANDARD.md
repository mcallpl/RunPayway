# RunPayway Security Standard v1.0

**Status**: ACTIVE  
**Version**: 1.0.0  
**Effective Date**: 2026-06-22  
**Owner**: RunPayway Governance  

---

## 1. Data Classification

| Classification | Examples | Protection |
|----------------|----------|-----------|
| **Public** | API documentation, policy names | No encryption required |
| **Internal** | System logs, performance metrics | Encrypt at rest |
| **Financial** | Income amounts, obligation data, evaluations | Encrypt at rest + in transit, 7-year retention |
| **PII** | subject_id, names (if included) | Encrypt at rest + in transit, audit all access |
| **Audit** | Audit records, evaluation trails | Immutable, encrypt at rest, 7-year retention |

---

## 2. Encryption

### At Rest
- **Algorithm**: AES-256 (NIST approved)
- **Database**: SQLite with transparent encryption
- **Key Storage**: AWS KMS (Hardware Security Module)
- **Backup**: Encrypted with separate key

### In Transit
- **Protocol**: TLS 1.3 minimum
- **Certificates**: Valid domain certificate
- **Pinning**: Optional for high-security deployments
- **API Keys**: Never in query params, Authorization header only

---

## 3. Authentication

### API Key Management
- **Format**: `rp_org_{org_id}_{random_32_bytes}`
- **Rotation**: Quarterly minimum, immediate if compromised
- **Storage**: AWS Secrets Manager
- **Access Logging**: Every API key use logged to audit

### Multi-Factor Authentication (MFA)
- **Required for**: Administrator, Policy Approver roles
- **Method**: TOTP (Google Authenticator, Authy)
- **Enforcement**: Strict, no exceptions

---

## 4. Access Control

### Role-Based Access Control (RBAC)
- Every user assigned one primary role
- Permissions enforced at API layer
- Audit logging for all access attempts
- Denial logged and escalated if repeated

### Database Access
- No direct SQL queries
- ORM (Prisma) enforced
- Parameterized queries (SQL injection prevention)
- Row-level security: organizations isolated

---

## 5. Injection Prevention

### SQL Injection
- Parameterized queries (Prisma)
- No string concatenation in queries
- Input validation via Zod
- Review: Quarterly penetration test

### Command Injection
- No child_process calls
- No shell commands
- No eval() or Function() constructor
- RP-DSL sandboxed to operators only

### XSS Prevention
- React escaping (automatic)
- Content Security Policy headers
- No innerHTML, use textContent
- JSON responses (no HTML templates)

---

## 6. Data Validation

### Input Validation (REQ-006)
- Zod schema validation
- Reject invalid early
- Type checking
- Enum validation
- Length limits

### RP-DSL Validation (REQ-009)
- Safety Compiler before execution
- Disallow non-deterministic operations
- No external API calls
- No database queries
- Unbound loop detection

---

## 7. Audit Logging

Every security event logged:
- Successful authentication
- Failed authentication attempts
- API key rotation
- Role changes
- Policy approvals
- Data access (Auditor queries)
- Configuration changes

**Retention**: Indefinite (immutable)  
**Access**: Administrator and Auditor only

---

## 8. Vulnerability Management

### Dependency Management
- Quarterly security audit of dependencies
- Automated CVE scanning (Dependabot)
- Patch immediately for critical vulnerabilities
- Document patches in CHANGE_MANAGEMENT

### Code Review
- All code reviewed by second person
- Security checklist:
  - [ ] No hardcoded secrets
  - [ ] No SQL injection risk
  - [ ] No command injection risk
  - [ ] No XSS risk
  - [ ] Proper error handling
  - [ ] Audit logging present

### Penetration Testing
- Annual external penetration test
- Address findings within 30 days
- Document remediation in ADRs
- Share results with auditors

---

## 9. Compliance Frameworks

### SOC 2 Type II
- **Scope**: Entire RunPayway system
- **Audit**: Annual
- **Focus**: Security, availability, processing integrity
- **Evidence**: Audit records, code reviews, test results

### ISO 27001
- **Scope**: Information security management
- **Audit**: Every 3 years
- **Certification**: Target: 2027
- **Evidence**: Policies, procedures, risk assessments

### GLBA (Gramm-Leach-Bliley Act)
- **Compliance**: Financial data protection
- **Requirements**: Encryption, audit logging, access controls
- **Enforcement**: FTC (if acting as advisor)

### FCRA (Fair Credit Reporting Act)
- **Compliance**: If used for credit decisions
- **Requirements**: Accuracy, dispute procedures, adverse action notices
- **Enforcement**: CFPB (Consumer Financial Protection Bureau)

---

## 10. Incident Response Plan

### Incident Classification
- **Level 1**: Low impact (e.g., failed API call)
  - Log, monitor, resolve
  
- **Level 2**: Medium impact (e.g., policy bug)
  - Investigate, fix, deploy patch
  
- **Level 3**: High impact (e.g., data breach)
  - Immediate response team activation
  - Isolate affected systems
  - Preserve evidence
  - Notify auditors and regulators if required

### Response Steps
1. Detect (monitoring, user report)
2. Assess (severity, scope, impact)
3. Contain (isolate affected systems)
4. Investigate (root cause analysis)
5. Remediate (fix vulnerability)
6. Communicate (stakeholders, auditors)
7. Document (ADR, postmortem)

---

## 11. Disaster Recovery

### Backup Policy
- **Frequency**: Daily encrypted backups
- **Retention**: 7 years (then archival)
- **Verification**: Weekly backup restore test
- **Location**: Geographically separated storage

### Recovery Time Objectives (RTO)
- **Database failure**: 1 hour
- **API failure**: 15 minutes
- **Total system failure**: 4 hours

### Recovery Point Objectives (RPO)
- **Data loss**: Maximum 24 hours
- **Audit records**: Zero acceptable loss

---

## 12. Security Checklist

Deploy only after:
- [ ] All dependencies scanned for CVEs
- [ ] Code reviewed by second person
- [ ] Security checklist completed
- [ ] No hardcoded secrets
- [ ] All inputs validated
- [ ] Audit logging present
- [ ] Encryption verified
- [ ] Access controls tested
- [ ] Penetration test passed (annual)
- [ ] Compliance audit passed

---

## References

- GOVERNANCE_STANDARD.md
- AUDIT_STANDARD.md
- CHANGE_MANAGEMENT_STANDARD.md
