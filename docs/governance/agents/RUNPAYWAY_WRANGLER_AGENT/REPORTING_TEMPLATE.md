# RunPayway™ Wrangler Agent Reporting Template

**Status:** DRAFT: PENDING INDEPENDENT ACCEPTANCE REVIEW
**Version:** 1.0.0-draft (reporting template)
**Owner:** RunPayway™ Governance
**Applies To:** Reports produced by the RunPayway™ Wrangler Agent

---

## 0. How to Use This Template

This template defines the required structure of a RunPayway™ Wrangler Agent report. Every
section below is included in every Wrangler report. When a section does not apply, it is
retained with an explicit "None" or "Not applicable" rather than omitted. The mandatory
final-report self-check in Section 17 is run before the report is returned.

All reporting follows the operating charter in
`docs/governance/agents/RUNPAYWAY_WRANGLER_AGENT/WRANGLER_AGENT.md`, including the evidence
ladder, gate lexicon, and style requirements.

---

## 1. Scope Classification

State whether the work is read-only review, correction, bounded implementation, acceptance
review, acceptance-and-lock, or another named activity. State what is in scope and what is
explicitly out of scope.

## 2. Authorization Boundary

State the exact authority granted, the gate or phase it corresponds to, and the boundary at
which the agent must stop. State any authority that was not granted.

## 3. Baseline Verification

Record the pre-work repository state: branch, HEAD, local versus origin, working-tree
cleanliness, presence of any required commit, and any required final Acceptance Log entry.
State whether the baseline matched the authorization.

## 4. Files Inspected

List every file read or examined, with repository-relative paths.

## 5. Files Modified

List every file created or modified, with repository-relative paths. If none, state "None."
Confirm explicitly that no unauthorized file was changed.

## 6. Commands Executed by Classification

List commands grouped by the classification defined in the charter: read-only inspection,
test execution, repository modification, staging, commit, push, deployment, destructive or
rollback action. Confirm that no modifying command was hidden inside a read-only batch.

## 7. Findings

State the substantive findings. Separate repository findings from reporting or transcript
findings.

## 8. Evidence Basis

For each material claim, state the evidence-strength level used (direct observation, command
output, Git diff evidence, hash comparison, cryptographic verification, or inference) per the
charter ladder. Use the weakest accurate description.

## 9. Tests and Validation

Record any tests run, the exact result counts, and whether validation was isolated. State
what was not tested.

## 10. Category 1 Issues

List Category 1 issues (blocking or acceptance-preventing). If none, state "None."

## 11. Category 2 Issues

List Category 2 issues (non-blocking concerns). If none, state "None."

## 12. Deviations and Warnings

Record any deviation from plan, any warning, and any consent that is required and not yet
given (for example production-restart consent).

## 13. Repository Integrity

State whether the working tree is clean, whether protected files are unchanged, and whether
the Acceptance Log and its final entry are unchanged.

## 14. Gate Status

State the exact gate and phase status using the charter lexicon (for example "Gate 3 not
authorized and not begun"). Do not use vague substitutions.

## 15. Recommended Next Action

State the recommended next authorized action. A recommendation is not an authorization and
is labeled as a recommendation.

## 16. Final Determination

State the accurate final state. Do not declare unverified completion. Do not declare
acceptance or lock unless that authority was granted and exercised.

---

## 17. Mandatory Final-Report Self-Check

Before returning any report, confirm each item below and correct any failure before
returning:

- [ ] No duplicated sections.
- [ ] No repeated numbering.
- [ ] No repeated recommendations.
- [ ] No contradictory status statements.
- [ ] No missing section numbers.
- [ ] No unsupported future-work claims (see charter Section 8).
- [ ] No unverified completion claim.
- [ ] No misuse of "cryptographic" (a pure-addition or zero-deletion diff is Git diff
      evidence, not cryptographic verification).
- [ ] No U+2014 em dash characters in the report or in any new RunPayway™ copy it produced.
- [ ] Correct `RunPayway™` usage with the trademark symbol.
- [ ] Exact gate terminology per the charter lexicon (no vague substitutions).
- [ ] Transcript or output duplication is identified as a reporting defect and is not
      automatically treated as a repository defect.
