# Public DTO Contract Artifacts (Static Reference)

This directory contains **static public DTO contract artifacts** for RunPayway™.
The files here are declarative reference material only. They describe the locked
public data contract; they do not implement it.

## Contents

- `base-public-dto.allowlist.ts` — static constants and metadata listing the
  fields that are permitted in the public DTO.
- `base-public-dto.denylist.ts` — static prohibited-field categories and pattern
  strings that must never appear in public output.
- `README.md` — this static reference document.

## Source of truth

The allowlist reflects the **Step 9H base public DTO contract**, revised by
**formal change control** so that `compared_with.size` is **optional /
deferred**. The allowed fields are:

Required (6):

1. `assessment_id`
2. `assessment_date`
3. `classification`
4. `primary_drivers`
5. `interpretation`
6. `compared_with.segment_label`

Optional / deferred (1):

7. `compared_with.size`

The only permitted `classification` values are `Stable`, `Volatile`, and
`Moderate`. No other field may be exposed in a public DTO.

### `compared_with.size` — optional / deferred

No truthful segment-population / cohort-size source exists today (peer
distribution data is percentage-based, not counts). Therefore:

- `compared_with.size` **may be omitted**. When omitted it must be **absent**
  from the DTO — never `null`, never `0`, never a placeholder.
- `compared_with.segment_label` **remains required**; `compared_with` is always
  present.
- `compared_with.size` may be populated **only** from a genuine
  segment-population / cohort-size source, as a **positive integer**.
- It must **never** be fabricated or derived from percentages, percentiles,
  score thresholds, `peer_band_distribution`, `peer_percentile`,
  `cluster_average_score`, `top_20_threshold`, `benchmark_note`, synthetic
  constants, methodology notes, or guessed values.
- Restoring `compared_with.size` to a required field is deferred to a future
  governed work order that adds a truthful cohort-size data source (Option B).

## About the denylist

The denylist contains **prohibited patterns only**. The terms it lists are not
field names, labels, enum values, or public terms — they appear solely as
prohibited pattern strings that mark a field as non-public. This includes
internal-only concepts that must never reach any public DTO, report, dashboard,
PDF, or API response.

## What this README is not

This README is **not** runtime documentation, **not** public product copy, and
**not** approved consumer language. Nothing in this directory is a source of
customer-facing text.

## What remains HOLD

The following are explicitly **not** part of these static artifacts and remain
on HOLD pending separate authorization:

- DTO implementation and interfaces
- Serializer implementation
- Route/API changes
- Interpretation language rules and any public copy
- `assessment_id` and `assessment_date` exact formats (currently TBD)
- Manifest or generated-content production
- Verification, tests, and CI integration

These artifacts describe the contract boundary only. Any implementation against
this contract requires its own authorized step.
