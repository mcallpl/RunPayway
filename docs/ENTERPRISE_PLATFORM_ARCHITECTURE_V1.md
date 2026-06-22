# Enterprise Platform Architecture V1

**Date:** June 22, 2026  
**Status:** Architecture Design (Ready for Implementation)  
**Scope:** Transformation from Deterministic Engine → Enterprise Evaluation Platform  
**Target Users:** Lenders, Advisors, Enterprises, Compliance Teams, Auditors

---

## Strategic Context

### What We Built
A verified deterministic evaluation engine:
- ✓ Deterministic execution (same input → same output, always)
- ✓ Policy-driven logic (no black boxes)
- ✓ Reason code traceability (every decision auditable)
- ✓ Replay capability (reconstruct any evaluation)
- ✓ Audit hashing (tamper detection)

### What We're Building
An enterprise evaluation platform:
- Production-grade persistence
- Institutional audit trails
- Policy lifecycle governance
- Regulatory evidence generation
- Long-term institutional defensibility

### The Shift
```
Before: "Can we deterministically evaluate income stability?"
After:  "Can we operate like Moody's, FICO, and underwriting systems?"
```

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│         Enterprise Evaluation Platform                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Policy     │  │  Evaluation  │  │    Audit     │ │
│  │   Registry   │  │   Platform   │  │    Ledger    │ │
│  │              │  │              │  │              │ │
│  │ • Versions   │  │ • Execute    │  │ • Immutable  │ │
│  │ • Lifecycle  │  │ • Persist    │  │ • Linked     │ │
│  │ • Promotion  │  │ • Verify     │  │ • Timestamped│ │
│  │ • Retirement │  │ • Replay     │  │ • Hashed     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│         ↓                  ↓                  ↓        │
│  ┌──────────────────────────────────────────────────┐ │
│  │    Persistence Layer (Database)                 │ │
│  │                                                  │ │
│  │ • Evaluation Records (immutable)                │ │
│  │ • Policy Versions (versioned, immutable)        │ │
│  │ • Audit Events (append-only)                    │ │
│  │ • Governance History (versioned)                │ │
│  └──────────────────────────────────────────────────┘ │
│         ↓                                              │
│  ┌──────────────────────────────────────────────────┐ │
│  │    Deterministic Execution Engine (Verified)    │ │
│  │                                                  │ │
│  │ • Policy Execution (frozen, verified)           │ │
│  │ • Reason Code Registry (frozen, verified)       │ │
│  │ • Replay (frozen, verified)                     │ │
│  │ • Audit Hashing (frozen, verified)              │ │
│  └──────────────────────────────────────────────────┘ │
│                                                       │
└─────────────────────────────────────────────────────────┘
```

---

## Core Responsibilities

### 1. Evaluation Platform

**Purpose:** Accept evaluation requests, execute against policies, persist results.

**Responsibilities:**
- Accept evaluation payload
- Validate against schema
- Select appropriate policy version
- Execute deterministically
- Compute audit hash
- Persist evaluation record
- Return evaluation_id + immediate result

**Key Properties:**
- Deterministic (same input → same evaluation_id + result)
- Traceable (reason codes logged)
- Auditable (hash verifiable)
- Replayable (can reconstruct from record)

**API Surface:**
```
POST /api/v1/evaluate
  Input: StructuredFinancialPayload
  Output: {
    evaluation_id,
    status,
    result,
    triggered_reason_codes,
    classification,
    issued_timestamp,
    audit_hash
  }
```

### 2. Policy Registry

**Purpose:** Maintain authoritative policy versions and governance state.

**Responsibilities:**
- Store policy definitions (immutable per version)
- Track policy versions
- Enforce lifecycle (Draft → Approved → Active → Retired)
- Link evaluations to exact policy version used
- Enable policy rollback/historical query
- Support policy promotion workflow

**Key Properties:**
- Immutable versions (once published, never modified)
- Audit trail (who approved, when, why)
- Active flag (only one active version at a time per policy)
- Historical linkage (every evaluation points to exact policy version)

**Not This:**
- Do NOT allow direct edits to active policies
- Do NOT allow policy mutations after activation
- Do NOT allow breaking changes without versioning

### 3. Audit Ledger

**Purpose:** Create institution-grade audit trail for compliance.

**Responsibilities:**
- Log every evaluation event
- Log every replay event
- Log every policy lifecycle change
- Append-only (no modification or deletion)
- Hash-linked where appropriate
- Timestamped with nanosecond precision
- Enable regulatory inquiries

**Key Properties:**
- Immutable append-only
- Linked to evaluations, policies, users
- Cryptographic hashing (SHA-256 or better)
- Compliance-grade retention (regulatory hold)

**Serves:**
- Regulators (evidence of consistent application)
- Auditors (evaluation reconstruction)
- Lenders (decision evidence)
- Internal teams (compliance proof)

### 4. Replay Infrastructure

**Purpose:** Institutional-grade evidence that evaluations are deterministic.

**Responsibilities:**
- Accept original evaluation_id
- Retrieve original payload + policy
- Re-execute policy against payload
- Compare result hashes
- Report: PASS or REPLAY_MISMATCH with precise reason
- Serve as regulatory defense

**Key Properties:**
- Deterministic (always same result)
- Verifiable (hash comparison)
- Auditable (replay event logged)
- Historical (original policy version accessible)

**Regulatory Value:**
- Proof of consistency
- Defense against accusation of bias
- Reconstruction of historical decisions
- Compliance with fair lending requirements

---

## Data Model — High Level

### Evaluation Record (Immutable)
```
evaluation_id (UUID, primary key)
subject_id (string, indexed)
cohort_key (string, indexed)
policy_id (UUID, composite key component)
policy_version (INTEGER, composite key component → policy_versions)
policy_hash (SHA-256 of policy)
evaluation_timestamp (nanosecond precision)
payload_hash (SHA-256 of input)
result_hash (SHA-256 of output)
classification (PASS|FAIL|REVIEW|...)
triggered_reason_codes (array of code IDs)
violation_score (integer)
audit_hash (SHA-256 chain link)
created_at (immutable timestamp)
```

### Policy Version (Immutable)
```
policy_id (UUID)
version (integer, unique per policy_id)
effective_date (timestamp)
status (DRAFT|APPROVED|ACTIVE|RETIRED)
compiled_hash (SHA-256 of compiled policy)
source_definition (original DSL)
approved_by (user_id)
approved_at (timestamp)
created_at (immutable timestamp)
```

### Audit Event (Immutable, Append-Only)
```
audit_id (UUID, primary key)
event_type (EVALUATION|REPLAY|POLICY_PUBLISH|POLICY_RETIRE|...)
timestamp (nanosecond precision)
actor_id (user_id or system)
subject_id (evaluation_id or policy_id)
details (JSON: what changed, why)
audit_hash (SHA-256 chain link to prior event)
created_at (immutable timestamp)
```

### Policy Change Record (Versioned, Audited)
```
change_id (UUID)
policy_id (UUID)
from_version (integer)
to_version (integer)
change_summary (string)
approver_id (user_id)
approved_at (timestamp)
change_hash (SHA-256)
audit_event_id (foreign key → Audit)
created_at (immutable timestamp)
```

---

## Key Architectural Properties

### 1. Immutability
- Once written, records cannot be modified or deleted
- Enforced at database level (no UPDATE after insert)
- Enforced at API level (reject any mutation attempts)
- Enables regulatory compliance (FINRA, ECOA, fair lending)

### 2. Determinism
- Same input → Same evaluation_id + result (always)
- Replay always produces identical result
- Audit trail proves consistency
- Regulatory defense mechanism

### 3. Auditability
- Every decision has reason codes
- Every reason code is traceable to policy version
- Every policy change is audited
- Chain of custody maintained (audit hashing)

### 4. Governance
- Policy lifecycle enforced
- No breaking changes without versioning
- Approval workflow required
- Change tracking mandatory

### 5. Institutional Readiness
- Regulatory evidence generation
- Fair lending compliance
- Audit defensibility
- Long-term institutional adoption

---

## Compliance Requirements Met

### For Regulators
- ✓ Proof of consistent application (audit ledger)
- ✓ Historical reconstruction (replay capability)
- ✓ Policy versioning (governance trail)
- ✓ Decision traceability (reason codes)

### For Auditors
- ✓ Immutable records (tamper-proof)
- ✓ Complete audit trail (append-only)
- ✓ Cryptographic verification (hash chains)
- ✓ Historical policy access (versioning)

### For Lenders
- ✓ Evidence of evaluation (persistent record)
- ✓ Decision justification (reason codes)
- ✓ Policy transparency (versioned registry)
- ✓ Dispute resolution (replay capability)

### For Enterprises
- ✓ Institutional credibility (audit evidence)
- ✓ Risk management (auditable decisions)
- ✓ Compliance readiness (governance layer)
- ✓ Long-term defensibility (determinism proof)

---

## Operational Model

### Evaluation Flow
```
1. Accept evaluation request (StructuredFinancialPayload)
2. Validate payload schema
3. Look up active policy version
4. Execute policy deterministically
5. Compute evaluation hash
6. Persist evaluation record (immutable)
7. Log audit event (append-only)
8. Return evaluation_id + result
9. Enable later replay/verification
```

### Policy Lifecycle
```
DRAFT
  ↓ (internal review)
REVIEW
  ↓ (approval required)
APPROVED
  ↓ (deploy when ready)
ACTIVE (only one per policy at a time)
  ↓ (cannot be modified; must create new version to change)
RETIRED (historical archive; still queryable)
```

### Replay Workflow
```
1. Accept evaluation_id
2. Retrieve evaluation record
3. Retrieve policy version used in evaluation
4. Re-execute policy against original payload
5. Compare result hashes
6. Log replay event (audit trail)
7. Return: PASS or REPLAY_MISMATCH with reason
```

---

## Non-Functional Requirements

### Performance
- Evaluation latency: < 200ms p99
- Audit event logging: async, < 50ms overhead
- Replay: < 500ms p99
- Policy lookup: cached, < 10ms

### Durability
- Write-ahead logging on evaluation records
- Replication for audit ledger (RPO = 0, RTO < 5 min)
- Backup retention: 7 years (regulatory hold)

### Scalability
- Horizontal scaling for evaluation platform
- Read replicas for audit queries
- Partitioning strategy for multi-year data

### Security
- Encryption at rest (evaluation records)
- Encryption in transit (TLS 1.3)
- Role-based access (auditors can read, not write)
- Audit logging of all access attempts

---

## Implementation Assumptions

### Database
- PostgreSQL 14+ (ACID guarantees)
- JSONB support (audit_details storage)
- Hash indexes for record lookups
- Foreign key constraints enforced

### Engine
- Deterministic execution already verified (Phase 1-4)
- Policy execution frozen and correct
- Reason code registry authoritative
- Replay endpoint exists and works

### Team
- Can design schema and indexes
- Can implement immutability enforcement
- Can build governance workflow
- Can implement audit logging

---

## Success Criteria

The platform is production-ready when:

1. **Persistence works:**
   - Evaluation records persist and never change
   - Policy versions versioned correctly
   - Audit events immutably logged

2. **Auditability works:**
   - Audit ledger complete and queryable
   - Hash chains verifiable
   - Regulatory queries answerable

3. **Governance works:**
   - Policy lifecycle enforced
   - No direct mutations to active policies
   - Change tracking complete

4. **Replay works:**
   - Original evaluation reconstructed exactly
   - Result hashes match
   - PASS consistently verified

5. **Institutional readiness:**
   - Regulator evidence available
   - Auditor evidence available
   - Lender evidence available
   - Enterprise evidence available

---

## Next Steps

1. **Design Persistence Schema** (Phase 5a)
2. **Design Audit Architecture** (Phase 5b)
3. **Design Policy Registry** (Phase 5c)
4. **Design Governance Layer** (Phase 6)
5. **Design Institutional Readiness** (Phase 7)
6. **Build Implementation Roadmap** (Phases 5-7)

Each with detailed specifications, files impacted, risk levels, and verification gates.

---

## Document History

| Version | Date       | Status |
|---------|------------|--------|
| 1.0     | 2026-06-22 | ACTIVE |

**This is the foundational architecture for RunPayway's transformation to an enterprise evaluation platform.**
