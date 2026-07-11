# WO-G: Enterprise Complex-Income Measurement Standard and Engine Conformance

**Status:** DRAFT FOR HUMAN ADMINISTRATOR REVIEW

This document defines a proposed enterprise workstream. It is a draft presented
for Human Administrator review. It is not accepted, it is not locked, and it
opens no implementation. Creating this draft is not acceptance and is not lock.
WO-G implementation requires separate Gate 2 authorization after acceptance and
lock. Any change to this document requires formal change control and Human
Administrator approval.

---

## 1. Work Order Identity

**Work Order:** WO-G
**Name:** Enterprise Complex-Income Measurement Standard and Engine Conformance
**Governing ADR:** ADR-006 Enterprise Product Identity (draft, pending
acceptance and lock)
**Predecessor context:** WO-F (reclassified as an enterprise external-boundary
safeguard workstream)

## 2. Status

DRAFT FOR HUMAN ADMINISTRATOR REVIEW. Proposed and defined only. Not accepted,
not opened for implementation, not locked.

## 3. Purpose

Define the normative enterprise complex-income measurement standard and pin the
existing RP-2.0 engine behavior through a pure, Prisma-free conformance harness
before persistence, enterprise APIs, audit storage, policy registry, or evidence
packaging are expanded. The purpose of the first slice is to capture and lock
current engine behavior as a conformance baseline without changing runtime
behavior.

## 4. Governing Authority

WO-G is governed by and depends upon:

1. ADR-006 Enterprise Product Identity (must be accepted and locked before WO-G
   implementation is authorized).
2. The locked enterprise ADRs ADR-001 through ADR-005.
3. The nine locked standards under `docs/standards/`, including
   `CHANGE_MANAGEMENT_STANDARD.md`.
4. `docs/GOVERNANCE_FREEZE_V1.md`.
5. The existing RP-2.0 scoring model documentation
   (`docs/SCORING_MODEL_RP_2_0.md`, `docs/Scoring_and_Classification.md`).
6. The canonical Acceptance Log (`docs/governance/ACCEPTANCE_LOG.md`).

A draft architecture document does not override an accepted or locked authority.

## 5. Enterprise Value

A normative, versioned measurement standard plus a pinned conformance baseline
gives enterprise and organization customers a governed, auditable, deterministic
definition of complex-income measurement. It establishes the reference against
which future engine changes, enterprise APIs, audit storage, and evidence
packaging can be validated, consistent with RunPayway™ as the governed standard
for complex-income measurement.

## 6. Dependency Position

WO-G is upstream of persistence expansion, enterprise API expansion, audit
storage expansion, policy-registry expansion, and evidence packaging. Those
downstream expansions must not begin under WO-G until the measurement standard
and conformance baseline exist. WO-G is downstream of ADR-006 acceptance and
lock.

## 7. Current Engine Evidence

The RP-2.0 engine already exists in the repository at `src/lib/engine/v2` and is
documented in `docs/SCORING_MODEL_RP_2_0.md` and
`docs/Scoring_and_Classification.md`. The RP-DSL primitives live under
`packages/rp-dsl`. The first slice references this existing engine read-only and
records its current behavior; it does not modify it.

## 8. First Bounded Slice

The first future WO-G Gate 2 implementation slice is limited to:

1. One new normative measurement-standard document.
2. One new pure conformance test surface.
3. Read-only reference to the existing RP-2.0 engine.
4. No runtime behavior modification.
5. No persistence.
6. No database.
7. No Prisma.
8. No API route change.
9. No protected WO-F file change.
10. No marketing change.
11. No deployment requirement.

This WO-G definition does not create either the standard document or the test
surface during the current governance-artifact Gate 2.

## 9. Candidate Exact Paths

- Candidate standard path: `docs/COMPLEX_INCOME_MEASUREMENT_STANDARD_V1.md`
- Candidate test surface: `tests/conformance/`

Both are candidates only. Neither is created by this WO-G definition. Both are
confirmed absent at the time of drafting.

## 10. Permitted Actions for the Future Implementation Slice

When separately authorized under a future Gate 2, the first slice may:

1. Create one normative measurement-standard document at the candidate standard
   path (or a Human-Administrator-approved equivalent).
2. Create one pure conformance test surface under the candidate test directory.
3. Read the existing RP-2.0 engine to capture its current behavior as
   conformance expectations.
4. Run the new conformance tests in isolation.
5. Record conformance evidence.

All permitted actions are read-only with respect to existing runtime code and
additive with respect to the two new files or directories only.

## 11. Explicit Exclusions

WO-G excludes:

1. Any modification to `src/lib/engine/v2` in the first slice.
2. Any modification to `packages/rp-dsl`.
3. Any modification to `src/lib/persistence`.
4. Any modification to `prisma/`.
5. Any API route modification.
6. Any public DTO modification.
7. Any `verify-public` modification.
8. Any WO-F file.
9. Any marketing file.
10. The deferred RunPayway™ placeholder defect.
11. Prisma test remediation.
12. Full-suite PASS claims.
13. Staging, commit, deployment, or product implementation during governance
    drafting.

## 12. Prisma and Database Restrictions

The first slice performs no Prisma work, no schema work, no persistence work, and
no database work. The conformance harness must be pure and Prisma-free. It must
not import, initialize, or touch Prisma, any database client, any migration, or
any persistence layer. The known 42 environment-blocked Prisma test failures
remain out of scope and are not remediated by WO-G.

## 13. Isolation from WO-F

WO-G must not modify any WO-F file. The WO-F accepted safeguards remain intact:
`src/app/api/verify-public/route.ts` (accepted B2a leakage-removal state), the
five files under `src/contracts/public-dto/`, and the boundary test files under
`tests/boundaries/` (`public-dto-enforcer.test.ts`, `public-dto-adapter.test.ts`,
and `cpc-serialization-guard.test.ts`). WO-G does not reopen S-C, does not create a
public consumer-emission surface, and does not alter the seven-field public DTO
boundary.

## 14. Validation Requirements

The first-slice validation requires:

1. Confirmation that only the two new artifacts (one standard document, one
   conformance test surface) were created.
2. Confirmation that no existing runtime code, WO-F file, Prisma file, schema
   file, persistence file, API route, public DTO, or marketing file changed.
3. Execution of only the new pure conformance tests.
4. `git diff --check` clean.
5. No full test suite run and no full-suite PASS claim.

## 15. Test Classification Requirements

The new conformance tests must be classified as pure conformance tests: no
Prisma, no database, no network, no persistence, no filesystem side effects
beyond reading source. They must be runnable in isolation from the
environment-blocked Prisma suite and must not be counted toward or represented as
a full-suite pass.

## 16. Stop Conditions

The future first-slice implementation must stop if:

1. Any change to `src/lib/engine/v2`, `packages/rp-dsl`, `src/lib/persistence`,
   or `prisma/` would be required.
2. Any API route, public DTO, `verify-public`, or WO-F file would need
   modification.
3. Any Prisma or database action would be required.
4. Any marketing or public-emission change would be required.
5. Runtime behavior would be modified.
6. ADR-006 is not yet accepted and locked.
7. Separate Gate 2 implementation authorization has not been granted.
8. Any file outside the two authorized new artifacts would change.

## 17. Expected Completion Evidence

Expected evidence at the end of the first slice:

1. One normative measurement-standard document present at the approved path.
2. One pure conformance test surface present under the approved directory.
3. Passing conformance-test output for the new tests only, run in isolation.
4. A verification statement that no runtime code, WO-F file, Prisma file, schema
   file, persistence file, API route, public DTO, or marketing file changed.
5. `git diff --check` clean.

## 18. Gate Requirements

WO-G proceeds only through governed gates:

1. Gate 2 (implementation of the first slice) requires separate, explicit Human
   Administrator authorization granted after ADR-006 is accepted and locked.
2. Gate 3 (staging, commit, push, deployment, live validation) is separate from
   Gate 2 and is not authorized by this document.
3. Each gate requires its own Human Administrator authorization and its own
   acceptance-and-lock step.

## 19. Deployment Classification

The first slice is a documentation-plus-pure-test slice with no deployment
requirement. It changes no runtime behavior and requires no staging, commit,
push, or deployment to be complete. Any deployment is a separate Gate 3 decision
outside this workstream definition.

## 20. Acceptance-and-Lock Requirement

WO-G takes effect only when the Human Administrator accepts and opens it through
the canonical Acceptance Log via a separately authorized Entry 17 append using
exact language the Human Administrator supplies or expressly approves. Until that
acceptance-and-lock step occurs, WO-G is DRAFT FOR HUMAN ADMINISTRATOR REVIEW and
opens no work. Even after WO-G is accepted and opened, the first implementation
slice requires its own separate Gate 2 authorization.
