# RunPayway Two-Lane Build-Context Rule

**Status:** Governance reference document. Reference-only.

This document records the accepted two-lane build-context rule that governs all future
RunPayway work. It is not consumer product copy, not runtime documentation, and not an
implementation authority. It authorizes no remediation and opens no workstream. Any change
to this document requires formal change control and Human Administrator approval.

Authority basis: the Product Model Alignment Decision (WO-E, Acceptance Log Entry 10) and
the accepted Refinement Impact Audit. The Human Administrator accepted Option A as the
target and Option B as the mechanism: RunPayway's full public product surface should migrate
to the locked Commitment Pressure model as the single public product model, executed in
bounded, separately authorized remediation phases.

---

## The Rule

RunPayway has two governed lanes that must not be mixed:

1. Consumer/Public Lane
2. Enterprise/Infrastructure Lane

Vocabulary, concepts, and framing from one lane must not leak into the other except where a
separate governed workstream explicitly authorizes a specific surface and language.

---

## Lane 1 — Consumer/Public

The consumer/public lane is governed by the locked Commitment Pressure model.

Consumer/public surfaces **must use**:

- Commitment Pressure as the public measurement object
- Stable / Moderate / Volatile as the only public classification values
- Measurement / Interpretation / Primary Drivers / Implications as the core public explanation structure
- Compared With as the public comparison language
- the locked seven-field DTO boundary

Consumer/public surfaces **must not expose**:

- numeric scores
- Income Stability Score™
- action-plan/advice/coaching/recommendation language
- CPC
- Commitment Pressure Classification™
- reason codes
- RP-DSL
- AST
- audit/replay language
- version hashes
- policy internals
- direct AssessmentRecord fields
- database objects
- final_score
- stability_band
- model_version
- record_id

For reference, the locked seven-field public DTO boundary is:

- assessment_id
- assessment_date
- classification ("Stable" | "Volatile" | "Moderate")
- primary_drivers
- interpretation
- compared_with.segment_label
- compared_with.size

---

## Lane 2 — Enterprise/Infrastructure

The enterprise/infrastructure lane may frame RunPayway as deterministic compliance
infrastructure for financial platforms.

It may include enterprise-only concepts such as:

- deterministic policy execution
- Policy Gateway
- RP-DSL
- no-code risk/compliance policy control
- single API integration
- audit/replay
- immutable ledger
- policy versioning
- reason codes
- enterprise risk/compliance workflows
- anti-AI determinism frame

### Boundary rule

Enterprise/infrastructure vocabulary must not be inserted into consumer public copy, public
DTOs, consumer report/PDF surfaces, consumer dashboards, or public API responses unless a
separate governed enterprise-facing workstream explicitly authorizes the specific surface and
language.

---

## Additional Guardrails

1. CPC / Commitment Pressure Classification™ remains internal/enterprise-only and must never
   appear in consumer public copy, DTOs, public APIs, AssessmentRecord, or `_v2`.
2. Prediction-adjacent phrasing such as "forward-looking" and "stability tracker" may be
   considered only in enterprise positioning and must not enter consumer public copy.
3. "Income-stability module" must remain distinct from the retired public Income Stability
   Score™ model.
4. WO-F consumer migration sequencing remains unchanged by this rule.
5. This document does not open an enterprise-positioning workstream.

---

## Non-Authorization Clause

This document is durable reference guidance only. It records the two-lane rule; it does not
authorize any product-code change, DTO change, API change, route change, schema change,
methodology-page change, public-copy change, remediation, deployment, or Step 7B action. It
does not itself constitute acceptance and lock in the canonical acceptance log; that is a
separate Human Administrator acceptance-and-lock step. Any future change requires formal
change control and Human Administrator approval.
