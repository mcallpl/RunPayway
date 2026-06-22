# ADR-005: Immutable Policy Versioning with SemVer and Content Hashing

**Status**: ACCEPTED  
**Date**: 2026-06-22  
**Author**: RunPayway Governance  

---

## Decision

Policies are versioned immutably using SemVer (major.minor.patch) and identified by three attributes:
1. policy_id (unique name)
2. policy_version (SemVer)
3. policy_hash (SHA256 content hash)

Once created, a policy version can never be modified. New changes create new versions.

---

## Context

**Problem**: Financial policies must be frozen per evaluation. If policies can be changed in place, historical evaluations become unverifiable.

**Solution**: Treat policies as immutable versioned artifacts (like code releases). Every change → new version.

---

## Policy Identification Triple

```typescript
interface Policy {
  policy_id: "policy_mortgage_mixed_income"    // Unique name
  policy_version: "1.0.0"                      // SemVer
  policy_hash: "sha256:..."                    // Content hash
}
```

**Uniqueness**: policy_id + policy_version uniquely identifies a policy  
**Integrity**: policy_hash verifies content hasn't been tampered with

---

## Versioning Scheme

### MAJOR.MINOR.PATCH

- **MAJOR**: Breaking changes (new rules, changed thresholds)
  - Example: 1.0.0 → 2.0.0 (changed commission threshold 35% → 40%)
  - All new evaluations use new version
  - Historical evaluations keep old version

- **MINOR**: Non-breaking additions (new optional rules)
  - Example: 1.0.0 → 1.1.0 (added bonus income rule)
  - All new evaluations use new version
  - Historical evaluations keep old version

- **PATCH**: Bug fixes (no logic change, only bug corrections)
  - Example: 1.0.0 → 1.0.1 (fixed calculation error)
  - Ideally minimal impact
  - All new evaluations use new version

### Rationale

Financial systems are conservative. Every version change should be intentional and documented. SemVer provides clear semantics to operators.

---

## Policy Lifecycle

### Creation (v1.0.0)
```
1. Author writes RP-DSL policy
2. Compiler validates (static analysis)
3. Tests pass (100% coverage)
4. Policy Reviewer approves
5. Policy stored immutable: policy_id=x, version=1.0.0, hash=abc123
```

### Modification (→ v1.0.1)
```
1. Bug discovered in v1.0.0
2. Author creates v1.0.1 with fix
3. Retest (full regression)
4. Policy Reviewer approves
5. New version stored: policy_id=x, version=1.0.1, hash=def456
6. v1.0.0 remains unchanged (immutable)
```

### Deprecation (→ DEPRECATED)
```
1. Author creates v1.1.0 with new rules
2. v1.0.1 marked status = "DEPRECATED"
3. All new cohorts use v1.1.0
4. Existing cohorts stay on v1.0.1 (no retroactive changes)
5. v1.0.1 archived after 6-month deprecation notice
```

---

## Cohort Binding

Cohorts are bound to specific policy versions:

```typescript
interface CohortPolicyBinding {
  organization_id: "org_1"
  cohort_key: "mortgage_software_sales_mixed_income"
  policy_id: "policy_mortgage_mixed_income"
  policy_version: "1.0.0"  // Specific version, never auto-upgraded
  active: true
}
```

**Key**: Binding is to a specific version. When policy is updated:
1. New version created (e.g., v1.0.1)
2. Old binding stays on v1.0.0
3. Policy Approver must explicitly update binding to v1.0.1 (if desired)

**Benefit**: No automatic policy changes surprise customers. All changes intentional.

---

## Alternatives Considered

### Alternative 1: In-Place Mutation
```
policy_id = "policy_mortgage"
policy_version = "latest"  // Always current
Update policy in place
```

**Cons**:
- Audit trail lost (can't replay original decision)
- Regulatory non-compliance
- REJECTED

### Alternative 2: Semantic Versioning Only
```
policy_id + policy_version = unique
But no content hash verification
```

**Cons**:
- Can't prove content hasn't changed
- Vulnerable to database tampering
- REJECTED

### Alternative 3: Content Hash Only
```
policy_hash = "sha256:..."  // Unique identifier
No policy_id or version
```

**Cons**:
- No human-readable naming
- Hard to manage multiple versions
- REJECTED

### Alternative 4: SemVer + Content Hash (CHOSEN)
```
policy_id: human-readable name
policy_version: SemVer for ordering
policy_hash: content integrity verification
```

**Pros**:
- Human-readable (policy_id)
- Ordered (SemVer)
- Verified (policy_hash)
- Fully auditable

RATIONALE: Combines benefits of human readability, version ordering, and content integrity.

---

## Storage

### Immutability at Database Level
```sql
CREATE TABLE policies (
  id TEXT PRIMARY KEY,
  policy_id TEXT NOT NULL,
  policy_version TEXT NOT NULL,
  policy_hash TEXT NOT NULL,
  rules JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  status ENUM('ACTIVE', 'DEPRECATED', 'SUPERSEDED'),
  UNIQUE(policy_id, policy_version),
  UNIQUE(policy_hash)
);

-- No UPDATE of existing rows
-- Only INSERT new versions
-- Only soft-delete via status flag
```

### Enforcement
- Application code: No update() on policies table
- Code review: ADR-005 documents reasoning
- Tests: Integration test verifies immutability

---

## Promotion Workflow

```
Author creates policy v1.0.0
  ↓
Policy Reviewer approves
  ↓
Deploy to Staging (v1.0.0)
  ↓
Policy Approver approves Staging results
  ↓
Deploy to Production (v1.0.0)
  ↓
All evaluations use v1.0.0
  ↓
Bug discovered
  ↓
Author creates v1.0.1
  ↓
[Same review/approval workflow]
  ↓
Policy Approver upgrades cohort binding to v1.0.1
  ↓
New evaluations use v1.0.1, old ones preserved on v1.0.0
```

---

## Traceability

| Artifact | Link |
|----------|------|
| Requirement | REQ-005 (Version control), REQ-002 (Auditability) |
| Standard | ARCHITECTURE_STANDARD.md, DATA_MODEL_STANDARD.md |
| Data Model | Prisma Policy table |
| Database | /prisma/schema.prisma |
| Tests | /tests/versioning.test.ts |

---

## Approval

- **Date**: 2026-06-22
- **Approved by**: RunPayway Governance
- **CCB Vote**: Unanimous (4/4)

---

## References

- ADR-004-Replay-Architecture.md
- CHANGE_MANAGEMENT_STANDARD.md
- DATA_MODEL_STANDARD.md
