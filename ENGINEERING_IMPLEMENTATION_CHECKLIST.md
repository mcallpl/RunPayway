# Engineering Implementation Checklist
## Interpretation Rule Matrix

**Status**: Ready to implement  
**Specification**: INTERPRETATION_SPECIFICATION_IMPLEMENTATION_READY.md  
**Blockers**: All resolved (see BLOCKERS_RESOLVED_SUMMARY.md)

---

## QUICK START

**You have everything you need to code.**

All function signatures, thresholds, algorithms, and test cases are specified.

Two engineers can implement this system identically.

---

## PHASE 1: CORE ENGINE (Weeks 1-2)

### Step 1.1: Create Data Structures

**File**: `src/lib/interpretation/data.ts` (or your language equivalent)

**What to create**:
- [ ] DEPENDENCY_MODIFIERS table (6 types × 4 constraints)
  - Location: INTERPRETATION_SPECIFICATION_IMPLEMENTATION_READY.md § 1.1
  - 24 entries; no variation allowed

- [ ] PRIMARY_INSIGHT_COVERS map (14 insight keys → variables)
  - Location: § 1.2
  - Maps primary insight output to covered variables

- [ ] THRESHOLD_TABLE (7 variables × 5 decision types × 3 severity levels)
  - Location: § 1.3
  - ALL numeric values specified
  - Decision-specific thresholds for each variable

- [ ] INDUSTRY_PATTERNS (19 industries × 6 dependency types)
  - Location: § 1.4
  - Start with 4 defined industries (Real Estate, Technology, Consulting, Healthcare)
  - Stub remaining 15 as empty strings

- [ ] DEPENDENCY_EXPLANATIONS (6 types × 19 industries)
  - Location: § 1.7
  - Templates for explaining each dependency type

- [ ] DECISION_FRAMEWORKS (5 decision types)
  - Location: § 1.9
  - 2-4 bullet points per decision type

- [ ] DECISION_RANKINGS (5 decision types)
  - Location: § 1.10.3
  - Ordered list of variables per decision type

**Testing**: Unit tests for each data structure; verify no null values, no undefined keys.

---

### Step 1.2: Implement Helper Functions

**File**: `src/lib/interpretation/helpers.ts`

**Functions to implement** (in order):
- [ ] GetDependencyModifier(dependency_type, constraint_type)
  - Spec: § 1.1
  - Returns: string from DEPENDENCY_MODIFIERS table
  - Test: Use test case 1 (Software Sales + Home Purchase)
  
- [ ] GetVariablesCoveredBy(primary_insight_key)
  - Spec: § 1.2
  - Returns: set of variables from PRIMARY_INSIGHT_COVERS
  - Test: Unit test each insight key

- [ ] GetThreshold(variable, decision_type, dependency_type)
  - Spec: § 1.3
  - Returns: numeric or categorical threshold from THRESHOLD_TABLE
  - Test: Verify all 7 variables work; verify fallback to 0.5

- [ ] GetIndustryPattern(industry, dependency_type)
  - Spec: § 1.4
  - Returns: string from INDUSTRY_PATTERNS
  - Test: Test all 4 defined industries; test undefined industries return ""

- [ ] GetMixedDescription(dependency_type, decision_type, metrics)
  - Spec: § 1.6
  - Returns: fallback insight when no primary rule fires
  - Test: Create edge case where no primary fires

- [ ] ExplainDependencyType(dependency_type, industry)
  - Spec: § 1.7
  - Returns: 1-2 sentence explanation
  - Test: Test each combination; test generic fallback

- [ ] DescribeIndustryPattern(industry, dependency_type)
  - Spec: § 1.8
  - Returns: formatted industry pattern (derived from GetIndustryPattern)
  - Test: Test formatting; test null pattern handling

- [ ] GetDecisionFramework(decision_type)
  - Spec: § 1.9
  - Returns: bullet point list
  - Test: Each of 5 decision types

- [ ] GetFragilityDescription(fragility_score)
  - Spec: § 1.10.1
  - Returns: 1-sentence description of fragility class
  - Test: Test each class (Brittle, Thin, Uneven, Supported, Resilient)

- [ ] GetVariabilityDescription(variability_level, dependency_type)
  - Spec: § 1.10.2
  - Returns: formatted variability description
  - Test: Test each level and dependency type

- [ ] GetDecisionRanking(decision_type)
  - Spec: § 1.10.3
  - Returns: ordered list of variables
  - Test: Verify ranking order for each decision type

**Quality Checklist**:
- [ ] No magic strings; use data structures
- [ ] No free-text generation (use templates)
- [ ] Handle missing inputs gracefully
- [ ] Return type matches spec exactly
- [ ] Consistent with test cases

---

### Step 1.3: Implement Insight Selection Algorithms

**File**: `src/lib/interpretation/insights.ts`

**Functions to implement**:

- [ ] SelectPrimaryInsight(decision_type, dependency_type, all_characteristics)
  - Spec: § 3.1 & § 3.2 (original matrix)
  - Algorithm:
    1. Check Tier 1: Severity Overrides
       - Fragility ≤ 0.25 → Fragility Warning
       - Concentration ≥ 0.85 → Extreme Concentration
       - Labor_Dependence ≥ 0.95 AND Decision IN (CareerChange, EducationInvestment) → Complete Labor Dependence
       - Variability > 0.75 AND Decision = InvestmentProperty → Extreme Variability
    2. If no match, check Tier 2: Decision-Specific Ranking
       - Get decision_ranking = GetDecisionRanking(decision_type)
       - For each variable, check if exceeds threshold
       - Return first match
    3. If no match, Tier 3: Fallback
       - Return GetMixedDescription()
  - Test: Test cases 1-10; verify exact insight keys match

- [ ] SelectSecondaryInsight(primary_insight, decision_type, dependency_type, all_characteristics)
  - Spec: § 3.2
  - Algorithm:
    1. Get covered_variables from primary insight
    2. Get remaining_ranking (decision ranking - covered)
    3. For each variable in remaining, check if exceeds secondary threshold
    4. Return first match
    5. If no match, return decision_ranking[0] of remaining
  - Test: Test cases 1-10; verify secondary doesn't duplicate primary

- [ ] SelectSupportingObservation(primary_insight, secondary_insight, decision_type, dependency_type, industry, all_characteristics)
  - Spec: § 3.3
  - Algorithm:
    1. Get covered_variables from both primary and secondary
    2. Try industry pattern (if not covered)
    3. Try peer comparison (if available, percentile < 40)
    4. Try forward visibility (if < 3 months and not covered)
    5. Try fragility (if uneven and not covered)
    6. Try positive signals (resilience, consistency)
    7. Try next ranked variable
    8. Return empty if none match
  - Test: Test cases 1-10; verify no duplication

**Quality Checklist**:
- [ ] Tier hierarchy respected (1 → 2 → 3)
- [ ] Exact threshold values used
- [ ] Decision ranking order respected
- [ ] Covered variables excluded from secondary
- [ ] Insight keys match PRIMARY_INSIGHT_COVERS

---

### Step 1.4: Build and Test Phase 1

**Testing**:
- [ ] Unit tests for all helper functions
- [ ] Unit tests for all insight algorithms
- [ ] Run test case 1 (Software Sales + Home Purchase) end-to-end
- [ ] Verify outputs match expected values in specification

**Code Quality**:
- [ ] No hard-coded values; use data structures
- [ ] No free-text generation (templates only)
- [ ] Type-safe (enums for types, proper return types)
- [ ] Comprehensive error handling
- [ ] Well-commented (especially threshold logic)

---

## PHASE 2: REPORT ASSEMBLY (Weeks 2-3)

### Step 2.1: Create Report Output Structure

**File**: `src/lib/interpretation/report.ts`

**What to create**:
- [ ] Report data structure (JSON schema)
  - Spec: § 4.3
  - 7 section fields (section_1 through section_7)
  - Metadata: rules_fired, thresholds_applied
  - Include decision_type, industry, dependency_type

- [ ] Section specifications (constants)
  - Spec: § 4.2
  - Max lengths per section
  - Allowed/prohibited word lists
  - For each of 7 sections

**Quality Checklist**:
- [ ] Schema matches specification exactly
- [ ] All fields documented
- [ ] Null handling specified

---

### Step 2.2: Implement Report Assembly

**File**: `src/lib/interpretation/report-assembly.ts`

**Function to implement**:

- [ ] AssembleReport(decision_type, dependency_type, industry, rp2_outputs)
  - Spec: § 7 (original matrix) + § 4
  - Algorithm:
    1. Section 1: Decision Context
       - Format: "Decision: [decision_type]"
    2. Section 2: Primary Insight
       - Source: SelectPrimaryInsight()
    3. Section 3: Income Dependency
       - Source: ExplainDependencyType()
    4. Section 4: Secondary Insight
       - Source: SelectSecondaryInsight()
       - May be empty
    5. Section 5: Supporting Observation
       - Source: SelectSupportingObservation()
       - May be empty
    6. Section 6: Industry Context
       - Source: DescribeIndustryPattern()
       - May be empty
    7. Section 7: Decision Framework
       - Source: GetDecisionFramework()
  - Return: Report object with all sections

**Quality Checklist**:
- [ ] All 7 sections in correct order
- [ ] Optional sections handled (may be empty)
- [ ] Metadata includes rules_fired and thresholds

---

### Step 2.3: Implement Constraint Validation

**File**: `src/lib/interpretation/constraints.ts`

**What to create**:
- [ ] ValidateMeasurementOnly(report_text)
  - Spec: § 4.4
  - Check for prohibited language:
    - NO: "ready", "suitable", "approved", "should", "must", "good", "bad", "likely", etc.
  - Return: list of violations (if any)

- [ ] ValidateLanguageGovernance(report_text)
  - Spec: Part 6 (original matrix) + § 4.2
  - Check for allowed patterns
  - Check for prohibited patterns per section
  - Return: list of violations

**Quality Checklist**:
- [ ] All prohibited words in list
- [ ] All allowed patterns documented
- [ ] Regex or word-list based validation
- [ ] Works per section (section-specific rules)

---

### Step 2.4: Run End-to-End Tests

**Testing**:
- [ ] Run all 10 test cases (specification § 6)
- [ ] Verify report output matches expected values
- [ ] Verify no constraint violations
- [ ] Verify all sections present/absent correctly

**Test Cases to Run**:
1. [ ] Software Sales + Home Purchase
2. [ ] Emergency Medicine Physician + Home Purchase
3. [ ] Financial Advisor + Education Investment
4. [ ] Independent Contractor + Business Launch
5. [ ] Real Estate Agent + Investment Property
6. [ ] W-2 Employee + Career Change
7. [ ] Freelancer + Home Purchase
8. [ ] Business Owner + Investment Property
9. [ ] Commission-Only Salesperson + Home Purchase
10. [ ] Unsupported Industry + Mixed Dependency

---

## PHASE 3: INDUSTRY LIBRARY (Weeks 3-4)

### Step 3.1: Write Industry Patterns

**Location**: INDUSTRY_PATTERNS table

**Status**:
- [ ] Real Estate (Transaction) ✅ (already defined)
- [ ] Technology (Employer) ✅ (already defined)
- [ ] Consulting (Client) ✅ (already defined)
- [ ] Healthcare (Employer/Mixed) ✅ (already defined)

**To do** (15 industries):
- [ ] Legal Services (all dependency types)
- [ ] Education (all dependency types)
- [ ] Insurance (all dependency types)
- [ ] Government (all dependency types)
- [ ] Manufacturing (all dependency types)
- [ ] Retail (all dependency types)
- [ ] Hospitality (all dependency types)
- [ ] Transportation (all dependency types)
- [ ] Construction (all dependency types)
- [ ] Media (all dependency types)
- [ ] Non-Profit (all dependency types)
- [ ] Agriculture (all dependency types)
- [ ] Finance (all dependency types)
- [ ] Sales (all dependency types)
- [ ] Freelance (all dependency types)

**Requirements per industry**:
- [ ] 1-2 sentence pattern for each dependency type
- [ ] Describe typical concentration/variability/labor-dependence
- [ ] Measurement-only language (no "should", "good", "bad")
- [ ] Industry-specific context

**Example Template**:
```
"[Industry] / [Dependency Type]":
  "Typical concentration: X-Y%. 
   Variability: A-B% due to [reason]. 
   Labor dependence: C-D%."
```

**Quality Checklist**:
- [ ] All 19 industries defined
- [ ] All 6 dependency types addressed (where applicable)
- [ ] Measurement-only language
- [ ] Industry expertise verified
- [ ] Consistent with test cases

---

### Step 3.2: Add Dependency Explanations

**Location**: DEPENDENCY_EXPLANATIONS table

**What to add**:
- [ ] Industry-specific explanations for Mixed dependency type
- [ ] Industry-specific variations for each of 6 types

**Example**:
```
"Mixed" / "Finance":
  "Your income combines W-2 salary base with AUM fees and commissions. 
   Salary is stable; AUM and commission vary with market and client assets."
```

---

### Step 3.3: Validate Against Language Governance

**For each industry pattern and explanation**:
- [ ] Run constraint validation
- [ ] Ensure no prohibited language
- [ ] Ensure measurement-only tone
- [ ] Verify factual accuracy

---

## PHASE 4: EDGE CASE TESTING

### Step 4.1: Test Edge Cases

**Spec**: § 5

**Edge cases to test**:
- [ ] Missing dependency_type (THROW error)
- [ ] Unsupported industry (skip industry pattern, continue)
- [ ] Multiple severe constraints (use tier-1 precedence)
- [ ] Conflicting signals (apply rules as written)
- [ ] Boundary cases (exactly at threshold)
- [ ] Weak industry pattern (omit from report)
- [ ] Mixed dependency (use "Mixed" mappings)
- [ ] Single-source W-2 (legitimate finding)
- [ ] Commission-heavy income (apply labor dependence rules)
- [ ] Business owner with one client (concentration rule fires)

**Testing approach**:
- [ ] Create test inputs for each edge case
- [ ] Verify system doesn't crash
- [ ] Verify output is meaningful
- [ ] Verify constraints still enforced

---

## PHASE 5: LAUNCH PREPARATION

### Step 5.1: Final Checklist

**Core Engine**:
- [ ] All 11 helper functions implemented
- [ ] All thresholds match specification
- [ ] All insight algorithms deterministic
- [ ] All 10 test cases pass

**Report Assembly**:
- [ ] 7-section report structure working
- [ ] Constraint validation enforced
- [ ] No prohibited language
- [ ] Optional sections omitted correctly

**Industry Library**:
- [ ] 4 core industries complete
- [ ] 15 remaining industries stubbed (empty strings acceptable)
- [ ] Language governance validated

**Testing**:
- [ ] All 10 test cases pass with expected outputs
- [ ] All edge cases handled
- [ ] No constraint violations in generated reports
- [ ] Two engineers can implement identically

### Step 5.2: Documentation

**Create**:
- [ ] API documentation for each function
- [ ] Report schema documentation
- [ ] Examples for common scenarios
- [ ] Troubleshooting guide

---

## REFERENCE DOCUMENTS

**Specification**: `INTERPRETATION_SPECIFICATION_IMPLEMENTATION_READY.md`
- 2,200+ lines
- Complete specification for all functions, thresholds, algorithms, tests

**Blocker Resolution**: `BLOCKERS_RESOLVED_SUMMARY.md`
- Before/after comparison
- How each blocker was resolved
- Verification checklist

**Original Architecture**: `INTERPRETATION_RULE_MATRIX.md`
- Original architectural guidance
- Examples and stress tests
- Industry patterns (4/19)

**Implementation Audit**: `IMPLEMENTATION_READINESS_AUDIT.md`
- Detailed analysis of what was missing
- Issue-by-issue breakdown
- Why specification was needed

---

## COMMON QUESTIONS

**Q: Where are the exact threshold values?**
A: INTERPRETATION_SPECIFICATION_IMPLEMENTATION_READY.md § 1.3 (GetThreshold function)

**Q: How do I know which insight to return?**
A: § 3 (Weighting Algorithm) specifies 3-tier hierarchy; apply in order.

**Q: What happens if no primary insight fires?**
A: § 1.6 (GetMixedDescription); fallback always returns a value.

**Q: Can sections be omitted from report?**
A: Sections 4, 5, 6 may be empty (omitted). Sections 1, 2, 3, 7 always present.

**Q: What's the difference between primary_severity and secondary_severity thresholds?**
A: primary_severity = when to fire primary insight (tier 1)
   secondary_severity = when to fire secondary insight (tier 2)

**Q: Do I need all 19 industries for launch?**
A: No. 4 industries required; 15 remaining can be stubbed (empty strings).

**Q: When is GetPeerPercentile called?**
A: Supporting observation selection (§ 3.3). Returns null until post-launch benchmarking enabled.

**Q: How do I test this?**
A: Use 10 test cases in § 6. Compare actual output to expected output.

---

## SUCCESS CRITERIA

**Implementation is complete when**:
- [ ] All 11 helper functions implemented and tested
- [ ] All 3 insight algorithms (primary, secondary, supporting) working
- [ ] Report assembly produces 7-section output
- [ ] All 10 test cases produce expected outputs
- [ ] Constraint validation catches prohibited language
- [ ] Two engineers code and produce identical results
- [ ] No blockers remain from audit

---

**Ready to code. Everything you need is in the specification.**

