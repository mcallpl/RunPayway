# RunPayway™ Complex-Income Measurement Standard

**Document Identifier:** COMPLEX_INCOME_MEASUREMENT_STANDARD_V1
**Version:** 1.0.0-draft (structural frame only)
**Status:** DRAFT STRUCTURAL FRAME: NOT A COMPLETED MEASUREMENT STANDARD
**Date:** 2026-07-10
**Author:** RunPayway Governance
**Work Order:** WO-G Slice 1 (Measurement-Standard Structural Frame and RP-2.0 Historical Characterization Baseline)

---

## 1. Nature of This Document

This document is a minimal governed **structural frame** for the future
RunPayway™ Complex-Income Measurement Standard. It is not the completed standard.
It establishes identity, governing authority, scope boundaries, deferral
statements, versioning, and a companion-test reference only. It defines no
measurement semantics.

## 2. Governing Authority

This document is governed by and subordinate to:

1. **ADR-006 Enterprise Product Identity**, accepted and locked.
2. **WO-G Enterprise Complex-Income Measurement Standard and Engine Conformance**
   (`docs/governance/WO-G-MEASUREMENT-STANDARD.md`), accepted and opened.
3. **Acceptance Log Entry 17** (`docs/governance/ACCEPTANCE_LOG.md`), the
   canonical record accepting and locking ADR-006 and opening WO-G.
4. **RunPayway Governance Freeze v1.0** (`docs/GOVERNANCE_FREEZE_V1.md`) and the
   nine locked standards and ADR-001 through ADR-005 preserved thereunder.

A draft structural frame does not override any accepted or locked authority. Any
change to this document requires formal change control and Human Administrator
approval.

## 3. Purpose

RunPayway™ is Enterprise Complex-Income Measurement Infrastructure and the
governed standard for complex-income measurement. The normative content of that
standard is not yet defined. This document exists to hold a governed, versioned
place for that standard so that future authorized slices can populate it under
change control, and to bind a first historical characterization baseline for
governance review.

## 4. Scope

**In scope for this frame:** document identity, governing-authority references,
scope boundaries, deferral statements, versioning and change-control rules, and a
reference to the companion characterization test.

**Out of scope for this frame:** any measurement semantics, equations, scoring
rules, classification vocabulary, interpretation language, public output, or
consumer output. None of these are defined, adopted, or implied here.

## 5. Measurement Semantics Deferred

The measurement semantics of the RunPayway™ Complex-Income Measurement Standard
remain **deferred**. They are not defined by this document and will be defined
only through future separately authorized work under WO-G and formal change
control. Nothing in this document may be read as establishing measurement
semantics.

## 6. Commitment Pressure Status

Commitment Pressure remains **INTERNAL PENDING DEFINITION** per ADR-006 Decision
H and is **PROHIBITED FROM PUBLIC EXPOSURE WITHOUT EXPRESS AUTHORIZATION**. This
document does not define, infer, adopt, operationalize, or expose Commitment
Pressure, and does not declare it retired, required, or the enterprise
measurement standard.

## 7. No Public Vocabulary or Public-Emission Contract

This document establishes no public vocabulary and no public-emission contract.
It defines no public measurement classifications, no public interpretation
language, and no consumer outputs. It authorizes no emission surface.

## 8. Isolation from WO-F and Public DTO Projections

This document is isolated from WO-F. The WO-F public DTO vocabulary and its
Stable / Moderate / Volatile public projection are not governing inputs to this
document and are not treated here as the enterprise measurement standard. The
locked seven-field public DTO remains solely an external-boundary safety contract
per ADR-006 Decision I and is neither modified nor referenced as a measurement
authority. No S-C emission is created or authorized.

## 9. Companion Characterization Test

The companion test is `tests/conformance/engine-baseline.conformance.test.ts`.

> The companion test records one deterministic RP-2.0 engine output as a
> historical characterization baseline for governance review. It does not, by
> itself, adopt the engine's score, band, reason-code vocabulary, calculation
> semantics, or output structure as the normative RunPayway™ enterprise
> measurement standard.

The current RP-2.0 engine's score, band, and reason-code behavior is recorded as
historical characterization evidence only. It is not declared the authoritative
measurement standard of record.

## 10. Versioning and Change Control

This document is versioned `1.0.0-draft` as a structural frame. Any change to
its content, and any future population of measurement semantics, requires formal
change control and Human Administrator approval, consistent with
`docs/GOVERNANCE_FREEZE_V1.md` and the locked CHANGE_MANAGEMENT_STANDARD. Version
increments and their authority must be recorded through the governed acceptance
process; this document does not self-authorize its own expansion.

## 11. Non-Authorization Statement

Creating this document authorizes no implementation, no measurement-semantics
definition, no Commitment Pressure definition or exposure, no public vocabulary,
no public emission, no WO-F change, no persistence, database, schema, API,
marketing, or deployment work, and no staging, commit, push, or deployment. It
opens no later gate.
