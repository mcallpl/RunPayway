# Model Version History & Governance

**Owner**: RunPayway Model Review Board  
**Last Updated**: June 2, 2025  
**Scope**: All Structural Stability Model™ versions (RP-1.0, RP-2.0, RP-3.0+)

---

## Version Timeline

### RP-1.0 (Legacy, Deprecated)

**Status**: End of Life (deprecated 2024)  
**Support Level**: Historical reports only (read-only)  
**Sunset Date**: 2025-12-31  
**Reason**: Replaced by RP-2.0 (improved accuracy, better explainability)

**Key Characteristics**:
- Simpler 5-factor model
- Less granular band classification
- Fewer reason codes
- No sensitivity analysis
- No risk scenarios

**Why Deprecated**: RP-2.0 provides significantly better diagnostic value with same input complexity

**Historical Assessments**: All RP-1.0 assessments remain immutable and verifiable (see Backward Compatibility section)

---

### RP-2.0 (Current, Production)

**Status**: Production, Locked  
**Release Date**: 2024-Q1  
**Current Version**: 2.0.0 (locked)  
**Support Level**: Full (all features, ongoing maintenance)

**Key Characteristics**:
- 6-factor deterministic scoring
- 20-phase pipeline
- 4-level band classification with sub-bands
- Comprehensive reason codes
- Sensitivity analysis
- Risk scenarios
- Peer benchmarking
- Fragility assessment
- Action plan generation

**Production Guarantees**:
- ✅ Outputs immutable (once created, never changed retroactively)
- ✅ Deterministic (same inputs always → same outputs)
- ✅ Backward compatible with RP-1.0 adapters (via `/lib/v2-to-v1-adapter.ts`)
- ✅ Auditable (hash-based integrity verification)
- ✅ Versioned (all assessments store `model_version: "RP-2.0"`)

**Documentation**: See `/docs/SCORING_MODEL_RP_2_0.md`

---

### RP-2.1 (Planned Enhancement, Q3 2025)

**Status**: Planning phase  
**Target Release**: Q3 2025 (July-Sept)  
**Scope**: Incremental improvements, no breaking changes

**Proposed Changes**:
1. **Better Extended Input Integration**
   - Use contract terms, cancellation risk, platform dependency more deeply
   - Improve concentration resilience scoring
   - More accurate forward visibility estimates

2. **Refined Interaction Effects**
   - Validate current penalties/bonuses against real data
   - Adjust cross-factor interaction logic
   - Better fragility detection

3. **Improved Confidence Intervals**
   - Calculate confidence based on data completeness
   - Show uncertainty bounds (±5 points)
   - Flag low-confidence assessments

4. **Industry Contextualization**
   - Validate model accuracy across 19 industries
   - Publish industry-specific research
   - Adjust interpretation (not scoring) by industry

**Backward Compatibility**: RP-2.1 outputs include `model_version: "RP-2.1"`, but scoring logic remains ~90% identical to RP-2.0

**Migration Path**: 
- New assessments use RP-2.1 automatically
- RP-2.0 assessments remain immutable (can be re-run under RP-2.1 if user requests, but original is preserved)
- No retroactive changes to existing assessments

**Validation Required Before Release**:
- ✅ Regression tests pass (scores change < 5% from RP-2.0)
- ✅ Extended inputs improve accuracy materially (≥3 point improvement)
- ✅ Industry validation shows no systematic bias by sector

---

### RP-3.0 (Future, 12+ months)

**Status**: Concept phase  
**Target Release**: 2026+ (after 12+ months of RP-2.0 data)  
**Scope**: Next-generation model with data-driven improvements

**Vision**:
- **Data-Driven**: Built on historical income outcomes
- **Predictive**: Can quantify probability of income stability over time
- **Adaptive**: Learns interaction effects from real data
- **Transparent**: Still explainable, not a black box
- **Optional ML**: Machine learning only if it improves interpretability, not at cost of explainability

**Research Required**:
1. **Data Collection** (6-12 months)
   - Collect historical income data from 100+ RP-2.0 users
   - Follow up on actual income outcomes over 2+ years
   - Document failures and successes

2. **Validation** (4-8 weeks)
   - Regression analysis on historical data
   - Identify actual factor importance (vs. assumed)
   - Detect new interaction effects
   - Measure prediction accuracy

3. **Model Development** (4-6 weeks)
   - Build RP-3.0 model from validated data
   - Test alternative algorithms
   - Maintain explainability

4. **Academic Publication** (ongoing)
   - Publish findings in peer-reviewed journal
   - Present at conferences
   - Get external validation

**Decision Gate Before RP-3.0 Release**:
- Historical data shows RP-2.0 is predictive of actual income stability?
- RP-3.0 model improves accuracy by ≥10 points on validation set?
- Model remains fully explainable (not a black box)?
- Independent researchers can verify results?

If all gates pass → Release RP-3.0  
If any gate fails → Continue using RP-2.0 or extend RP-2.1

---

## Version Compatibility Rules

### Rule 1: Outputs Are Immutable

Once an assessment is created under RP-2.0, its output is **forever frozen**:

```
RP-2.0 Assessment Created: 2025-06-02
  score: 72
  band: Established
  
Even if RP-2.1 released and score would be 75:
  Original assessment: still shows 72
  model_version: "RP-2.0" (unchangeable)
  Verification hash: validates against RP-2.0 code
```

**Why**: Institutional trust. Reports must be stable. A score can't change retroactively.

**Implication**: If you share report today (score 72), it will always show 72, even if technology improves later.

---

### Rule 2: Same Inputs → Same Outputs (Forever)

For any version, determinism is guaranteed:

```
Input:
  q1: A
  q2: C
  q3: B
  q4: D
  q5: D
  q6: A
  
RP-2.0 Output (2025-01-01): score 58, band Developing
RP-2.0 Output (2025-06-02): score 58, band Developing
RP-2.0 Output (2026-01-01): score 58, band Developing

GUARANTEED. No variance.
```

**Implication**: Model code is locked. No tweaks. No "fixes" that change outputs.

---

### Rule 3: Version Selection at Assessment Time

When creating an assessment, system chooses latest supported version:

```
Today (2025-06-02): Create assessment
  → System selects RP-2.0 (current production)
  → Assessment stores: model_version: "RP-2.0"
  → Forever identified with RP-2.0

After RP-2.1 released (2025-09-01): Create assessment
  → System selects RP-2.1 (new current)
  → Assessment stores: model_version: "RP-2.1"
  → Forever identified with RP-2.1

RP-2.0 and RP-2.1 assessments can coexist.
  User can request re-run under different version.
  Original version is always preserved.
```

---

### Rule 4: Backward Compatibility

New versions must support reading/interpreting old assessments:

```
RP-2.1 can:
  ✅ Read RP-2.0 assessments
  ✅ Display RP-2.0 reports
  ✅ Verify RP-2.0 integrity hashes
  ✅ Re-run inputs under RP-2.1 (if user requests)

RP-2.1 cannot:
  ❌ Modify RP-2.0 assessments
  ❌ Change RP-2.0 scores
  ❌ Recompute RP-2.0 outputs
```

---

### Rule 5: Version Sunset Schedule

```
RP-1.0:
  Current: EOL (deprecated)
  Reads until: 2025-12-31
  Sunset: Jan 2026 (can no longer be retrieved)
  Reason: RP-2.0 vastly superior

RP-2.0:
  Current: Production (2024-present)
  Supported: ≥ 2026 (minimum 2 years)
  Sunset: TBD (not before 2026, likely 2027+)
  Reason: Core model, needs long support

RP-2.1:
  Current: Not yet released
  Supported: After release + 2 years minimum
  
RP-3.0:
  Current: Research phase
  Release: 2026+ (if validated)
  Supported: 2+ years minimum
```

**Implication**: Any assessment you create will be readable & valid for minimum 2 years.

---

## Migration & Support

### For Users (No Action Required)

```
If you have RP-2.0 assessment:
  → It remains valid forever
  → Can still be verified
  → Can request re-run under RP-2.1 for updated analysis
  → Original RP-2.0 is preserved

If you want to compare versions:
  → Run same inputs under RP-2.1
  → Shows both RP-2.0 and RP-2.1 results side-by-side
  → Helps understand what improved
```

### For Advisors

```
If you shared RP-2.0 assessment with client:
  → Link remains valid forever
  → Score does not change
  → Can create new RP-2.1 assessment for updated analysis
  → Never worry about reports going stale
```

### For Institutions

```
If you have RP-2.0 license:
  → Rights to use RP-2.0 remain unchanged
  → Can upgrade to RP-2.1 (if better for use case)
  → Can run both models in parallel (compare)
  → RP-2.0 still supported ≥ 2 years
```

---

## Report Immutability Guarantee

### Every Assessment Creates An Immutable Record

```
assessment_id: 550e8400-e29b-41d4-a716-446655440000
model_version: "RP-2.0"
created_at: 2025-06-02T14:30:00Z
model_code_hash: sha256(rp-2.0.ts source)
input_hash: sha256(questions + profile)
output_hash: sha256(score + band + factors)
record_hash: sha256(inputs + outputs)

These hashes PROVE:
  ✅ Inputs haven't been modified
  ✅ Model code was RP-2.0 at creation time
  ✅ Outputs are authentic
  ✅ No retroactive changes made
```

### Verification Process

```
Later, verify assessment:
  1. Retrieve assessment by ID
  2. Recompute input_hash from original questions
  3. Recompute model_code_hash from RP-2.0 source
  4. Recompute output_hash from original score/band
  5. Recompute record_hash from inputs + outputs
  
  If all hashes match: ✅ Assessment is authentic
  If any hash differs: ❌ Assessment was modified (impossible under this system)
```

---

## Change Control Process

### For Any Version Change (including RP-2.1 or RP-3.0)

**Step 1: Proposal**
- Model Review Board proposes change
- Documents rationale + expected impact
- Identifies affected assessments

**Step 2: Impact Analysis**
- Run regression tests (ensure determinism)
- Compare old vs. new outputs on sample data
- Identify if changes break backward compatibility

**Step 3: Testing**
- 100+ test cases covering edge cases
- Validate interaction effects
- Verify fragility detection

**Step 4: Approval**
- Board votes on change
- External validation if major change
- Documents in DECISION_LOG.md

**Step 5: Release**
- New version deployed to staging
- 2-week validation period
- Deploy to production (new assessments use new version)
- Old assessments remain on old version

**Step 6: Documentation**
- Update MODEL_VERSION_HISTORY.md
- Publish change notes
- Notify users of changes

---

## Historical Record Preservation

### All Historical Assessments Are Protected

```
RP-1.0 Assessments (2023-2024):
  Status: Read-only, immutable
  Count: ~5,000 assessments
  Action: Preserved until 2025-12-31
  Then: Archived (immutable records kept for legal/compliance)

RP-2.0 Assessments (2024-present):
  Status: Production, immutable
  Count: Growing
  Action: Supported for ≥ 2 years
  Archive: Permanent (institutional record)
```

### Use Case: Advisor Reviews Old Client Assessment

```
Advisor in 2026 wants to review client's 2024 RP-2.0 assessment:
  1. System retrieves assessment (original version stored)
  2. Displays: "Assessed Jun 2024 under RP-2.0"
  3. Score, band, report: exactly as created in 2024
  4. Offers option: "Create RP-2.1 assessment for updated analysis"
  5. Can compare old vs. new side-by-side
```

---

## Research & Validation Roadmap

### Phase 1: RP-2.0 Validation (Ongoing)

**Objective**: Prove RP-2.0 works as designed

**Activities**:
- [ ] 100+ regression tests (1 week, Week 1)
- [ ] Bias audit across demographics (2 weeks, Weeks 2-3)
- [ ] Accuracy validation by profile type (4 weeks, Weeks 4-7)
- [ ] Industry-specific validation (6 weeks, Weeks 8-13)
- [ ] Publish methodology white paper (2 weeks, Weeks 3-4)

**Deliverables**:
- White paper: "RP-2.0 Methodology & Validation"
- Bias report: "Fairness audit across demographics"
- Industry research: "Accuracy by sector"

---

### Phase 2: RP-2.1 Enhancement (Q3 2025)

**Objective**: Incremental improvements to accuracy

**Activities**:
- [ ] Analyze extended input usage patterns (1 week)
- [ ] Refine interaction effect weights (2 weeks)
- [ ] Validate improvements on sample data (2 weeks)
- [ ] Release RP-2.1 (1 week)

**Success Criteria**:
- ✅ 90%+ of RP-2.0 scores within 5 points of RP-2.1
- ✅ Extended inputs improve accuracy by ≥3 points
- ✅ No systematic bias introduced

---

### Phase 3: RP-3.0 Research (2026+)

**Objective**: Data-driven next-gen model

**Activities**:
- [ ] Collect historical income data (6-12 months)
- [ ] Follow up on actual outcomes (2+ years)
- [ ] Regression analysis to identify factor weights (4 weeks)
- [ ] Test predictive accuracy (4 weeks)
- [ ] Publish peer-reviewed paper (ongoing)

**Success Criteria**:
- ✅ Can prove RP-2.0 predicts future income stability
- ✅ RP-3.0 improves accuracy by ≥10 points vs. RP-2.0
- ✅ Model remains fully explainable
- ✅ Independent validation published

---

## Decision Hierarchy for Model Changes

### Level 1: Bug Fixes (No Board Approval Needed)

**Examples**:
- Fix calculation error in a phase
- Correct validation logic
- Remove duplicate processing

**Process**:
1. Identify bug
2. Create fix + regression tests
3. Deploy immediately
4. Document in DECISION_LOG.md

**Note**: Bug fix creates new version (e.g., RP-2.0.1), old version still supported

---

### Level 2: Minor Enhancements (Board Approval Needed)

**Examples**:
- Adjust interaction effect penalty from -3 to -2
- Improve confidence score calculation
- Add new reason code

**Process**:
1. Board proposal with impact analysis
2. ≥50% board approval
3. Regression testing (ensure backward compat)
4. Document in DECISION_LOG.md
5. Release as new version (RP-2.1)

---

### Level 3: Major Model Changes (Board + External Review)

**Examples**:
- Change scoring algorithm fundamentally
- Redefine band thresholds
- Add new factors

**Process**:
1. Board proposal with research
2. External academic review
3. ≥75% board approval
4. Extensive testing & validation
5. Peer review & publication
6. Release as new major version (RP-3.0)

---

## Support Timeline

| Version | Current? | Reads? | Supported Until | Status |
|---------|----------|--------|-----------------|--------|
| RP-1.0 | No | Yes (until 2025-12-31) | 2025-12-31 | EOL |
| RP-2.0 | Yes | Yes | 2026+ (min 2 years) | Production |
| RP-2.1 | No (planned) | Yes (after release) | TBD | Planned |
| RP-3.0 | No (research) | Yes (after release) | TBD | Research |

---

**This document is the source of truth for model versioning and historical preservation.**

Key principle: **Historical assessments are immutable. New versions don't retroactively change past results.**
