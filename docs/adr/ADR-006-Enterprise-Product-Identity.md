# ADR-006: Enterprise Product Identity

**Status**: DRAFT FOR HUMAN ADMINISTRATOR REVIEW
**Date**: 2026-07-10
**Author**: RunPayway Governance

---

## Context

RunPayway™ has accumulated governance history in which the controlling public
product model was framed as a consumer-facing measurement experience. That
framing is recorded in Acceptance Log Entry 10 (WO-E Product Model Alignment
Decision Planning, which accepted migration of the full public product surface
to the locked Commitment Pressure model) and in Entry 11 with its locked
reference document `docs/governance/TWO_LANE_BUILD_CONTEXT.md` (the two-lane
build-context rule, whose Lane 1 is a Consumer/Public lane).

Subsequent enterprise architecture work (see
`docs/ENTERPRISE_PLATFORM_ARCHITECTURE_V1.md`,
`docs/ENTERPRISE_ARCHITECTURE_AUDIT_V1.md`,
`docs/AUDIT_ARCHITECTURE_V1.md`,
`docs/POLICY_REGISTRY_ARCHITECTURE_V1.md`, and
`docs/PERSISTENCE_SCHEMA_V1.md`) plus the locked ADR-001 through ADR-005 and the
nine locked standards describe RunPayway as deterministic measurement and
compliance infrastructure. The current direction is that RunPayway™ is not a
consumer product but Enterprise Complex-Income Measurement Infrastructure and the
governed standard for complex-income measurement.

This ADR records the enterprise-only product identity, reconciles the earlier
consumer-oriented acceptance entries with the current direction, reclassifies
WO-F, preserves valid WO-F safeguards, and fixes the governed status of
Commitment Pressure without making an unsupported permanent vocabulary decision.

This ADR is a governance decision record only. It is a draft presented for Human
Administrator review. It is not accepted and it is not locked.

---

## Decision

RunPayway™ is recorded as Enterprise Complex-Income Measurement Infrastructure
and as the governed standard for complex-income measurement, enterprise and
organization-facing across product, architecture, implementation, positioning,
and commercial direction. The consumer product framing is superseded as the
controlling product model. The specific canonical decisions follow.

### A. Product identity

RunPayway™ is Enterprise Complex-Income Measurement Infrastructure.

### B. Category direction

RunPayway™ is the governed standard for complex-income measurement.

### C. Market orientation

RunPayway™ is enterprise and organization-facing.

### D. Consumer product framing

SUPERSEDED as the controlling product model. Historical consumer framing may
remain only as historical audit context, as a prohibited-exposure safeguard, as
a separately governed compatibility obligation, or as an explicitly retained
technical concept. It must not remain the controlling product model.

### E. Entry 10

SUPERSEDED IN PART. The consumer public-migration objective (migration of the
full public product surface to a consumer-facing public product model) is
superseded. The valid prohibited-exposure and boundary-safety safeguards
established under and around Entry 10 are preserved. Entry 10 itself remains a
locked historical record and is not rewritten by this ADR.

### F. Entry 11 and TWO_LANE_BUILD_CONTEXT.md

RECLASSIFIED AS HISTORICAL GOVERNANCE CONTEXT AND SAFEGUARD REFERENCE. The
consumer lane no longer controls product direction. The document remains
preserved for audit history and for boundary discipline (its denied-field and
prohibited-exposure lists retain safeguard value). Entry 11 remains a locked
historical record and is not rewritten by this ADR.

### G. WO-F

RECLASSIFIED AS AN ENTERPRISE EXTERNAL-BOUNDARY SAFEGUARD WORKSTREAM. The already
accepted increments (Entries 12 through 16: the runtime public DTO enforcement
foundation, the conservative classification mapping, the Step 9H boundary
revision, the B1e source-decision gate, and the pure internal public DTO adapter)
remain valid. The public consumer-emission objective does not remain active. S-C
(the public consumer-emission surface) remains blocked and unauthorized. S-C may
be reopened only through separate future change control.

### H. Commitment Pressure

Governing formulation: Commitment Pressure is no longer the controlling public
product model. Its continued internal, technical, historical, or compatibility
use must be determined under the governed enterprise measurement standard. It
must not be publicly exposed unless separately and expressly authorized.

Formal status: INTERNAL PENDING DEFINITION.

Standing guardrail: PROHIBITED FROM PUBLIC EXPOSURE WITHOUT EXPRESS
AUTHORIZATION.

This ADR does not declare Commitment Pressure permanently retired, does not
declare it permanently required, and does not declare it the new enterprise
measurement standard.

### I. Seven-field public DTO

RETAINED as an accepted prohibited-exposure and external-boundary safety
contract. The locked seven-field boundary (assessment_id, assessment_date,
classification, primary_drivers, interpretation, compared_with.segment_label, and
the optional or deferred compared_with.size) is retained as a boundary-safety
contract. It is not an active consumer product and it does not authorize S-C
emission.

### J. Enterprise ADRs and standards

ADR-001 through ADR-005 and the locked standards under `docs/standards/` remain
preserved and controlling within their accepted scopes. This ADR does not modify
them.

### K. Implementation authority

ADR-006 does not itself authorize WO-G implementation. Implementation requires
separate Gate 2 authorization after this ADR is accepted and locked.

---

## Product Identity

RunPayway™ is Enterprise Complex-Income Measurement Infrastructure: a
deterministic, governed measurement system for complex-income situations,
delivered to enterprises and organizations rather than to individual consumers.

## Enterprise and Organization Orientation

RunPayway™ is enterprise and organization-facing in product, architecture,
implementation, positioning, and commercial direction. Enterprise and
infrastructure concepts (deterministic policy execution, policy gateway, RP-DSL,
audit and replay, immutable ledger, policy versioning, reason codes) are the
governing frame, consistent with the locked enterprise ADRs and standards.

## Measurement-Category Direction

RunPayway™ is positioned as the governed standard for complex-income
measurement. The normative content of that standard is not defined by this ADR.
It is proposed for definition under WO-G (see
`docs/governance/WO-G-MEASUREMENT-STANDARD.md`) subject to separate Gate 2
authorization.

## Supersession and Reconciliation

This ADR supersedes the consumer product framing as the controlling product
model and reconciles the earlier acceptance record as follows: Entry 10 is
superseded in part (consumer public-migration objective superseded, safeguards
preserved); Entry 11 and `TWO_LANE_BUILD_CONTEXT.md` are reclassified as
historical governance context and safeguard reference; WO-F is reclassified as an
enterprise external-boundary safeguard workstream with its accepted increments
preserved and S-C blocked. No prior locked acceptance entry is rewritten,
deleted, or renumbered. Reconciliation is recorded forward through this ADR and
through the proposed Entry 17 acceptance language.

## Relationship to Entry 10

See Decision E. The consumer public-migration objective of Entry 10 is
superseded. The prohibited-exposure and boundary-safety safeguards are preserved.
Entry 10 remains a locked historical record.

## Relationship to Entry 11

See Decision F. Entry 11 is reclassified as historical governance context and
safeguard reference. Entry 11 remains a locked historical record.

## Relationship to TWO_LANE_BUILD_CONTEXT.md

See Decision F. `docs/governance/TWO_LANE_BUILD_CONTEXT.md` is reclassified as
historical governance context and safeguard reference. Its Consumer/Public lane
no longer controls product direction. Its denied-field, prohibited-exposure, and
boundary-discipline content is preserved for audit history and boundary
discipline. The document is not modified by this ADR.

## WO-F Disposition

See Decision G. WO-F is reclassified as an enterprise external-boundary safeguard
workstream. Accepted increments (Entries 12 through 16) remain valid. The public
consumer-emission objective is not active. S-C remains blocked and unauthorized
and may be reopened only through separate future change control.

## Commitment Pressure Disposition

See Decision H. Formal status: INTERNAL PENDING DEFINITION. Standing guardrail:
PROHIBITED FROM PUBLIC EXPOSURE WITHOUT EXPRESS AUTHORIZATION. No permanent
vocabulary decision (retired, required, or new standard) is made by this ADR.

## Preserved Enterprise ADRs and Standards

ADR-001 (RP-DSL), ADR-002 (AST Execution), ADR-003 (Reason Codes), ADR-004
(Replay Architecture), and ADR-005 (Policy Versioning) remain ACCEPTED and
controlling within their accepted scopes. The nine locked standards under
`docs/standards/` (ARCHITECTURE, DATA_MODEL, API, RP_DSL, REASON_CODE, AUDIT,
GOVERNANCE, SECURITY, CHANGE_MANAGEMENT) remain LOCKED per
`docs/GOVERNANCE_FREEZE_V1.md`. This ADR does not modify any of them.

---

## Consequences

1. The enterprise-only product identity becomes the recorded governing direction
   once this ADR is accepted and locked.
2. Consumer product framing ceases to be the controlling product model and
   survives only in the four retained roles named in Decision D.
3. WO-F is understood going forward as a boundary-safety workstream, not a
   consumer-product delivery workstream.
4. Commitment Pressure carries a durable public-exposure prohibition and an
   INTERNAL PENDING DEFINITION status until the enterprise measurement standard
   resolves it.
5. The seven-field public DTO remains a safety boundary contract with no active
   emission surface.
6. WO-G is proposed as the next enterprise workstream to define the measurement
   standard and pin engine conformance, subject to separate authorization.
7. No product code, schema, persistence, database, dependency, marketing, or
   public-emission surface changes as a result of this ADR.

---

## Explicit Exclusions

This ADR does not authorize or perform any of the following:

1. Any product-code change.
2. Any Prisma, schema, persistence, or database change.
3. Any environment or dependency change.
4. Any marketing change or public-emission change.
5. Any public DTO change or verify-public change.
6. Any modification to an existing accepted or locked governance artifact
   (including Entries 1 through 16, ADR-001 through ADR-005, the locked
   standards, `TWO_LANE_BUILD_CONTEXT.md`, and the WO-F contract files).
7. Any S-C public consumer-emission activity.
8. Any permanent Commitment Pressure vocabulary decision.
9. Any WO-G implementation.
10. Any staging, commit, push, deployment, or live validation.
11. Any append of Entry 17 (proposed language is presented for Human
    Administrator review only).

---

## Non-Authorization Statement

This ADR is a draft governance decision record presented for Human Administrator
review. It authorizes no implementation, no Prisma or database action, no
schema, persistence, environment, dependency, marketing, or public-emission
work, and no staging, commit, push, or deployment. Creating this draft is not
acceptance and is not lock.

## Acceptance-and-Lock Requirement

This ADR takes effect only when the Human Administrator accepts and locks it
through the canonical Acceptance Log via a separately authorized Entry 17 append
using exact language the Human Administrator supplies or expressly approves.
Until that acceptance-and-lock step occurs, this ADR is DRAFT FOR HUMAN
ADMINISTRATOR REVIEW and has no controlling force. WO-G implementation requires
its own separate Gate 2 authorization after this ADR is accepted and locked.

---

## References

- `docs/governance/ACCEPTANCE_LOG.md` (Entries 10, 11, 12 through 16)
- `docs/governance/TWO_LANE_BUILD_CONTEXT.md`
- `docs/governance/WO-G-MEASUREMENT-STANDARD.md` (proposed next workstream)
- `docs/GOVERNANCE_FREEZE_V1.md`
- `docs/adr/ADR-001-RP-DSL.md` through `docs/adr/ADR-005-Policy-Versioning.md`
- `docs/standards/CHANGE_MANAGEMENT_STANDARD.md`
- `src/contracts/public-dto/README.md`
