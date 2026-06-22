# RunPayway Data Model Standard v1.0

**Status**: ACTIVE  
**Version**: 1.0.0  
**Effective Date**: 2026-06-22  
**Owner**: RunPayway Governance  

---

## 1. Core Entities

### Organization
- Owns policies, cohort bindings, evaluation records
- Multi-tenant isolation
- Governance boundary

### Policy
- Immutable snapshot of rule set
- Identified by: policy_id + policy_version + policy_hash
- Linked to cohort via binding
- SemVer versioning

### CohortPolicyBinding
- Maps cohort_key → policy_id
- One binding per organization + cohort combination
- Active flag for soft-deletion
- Enables policy promotion without breaking existing cohorts

### StructuredFinancialPayload (REQ-006)
All inputs use this contract:

```typescript
{
  subject_id: string,
  cohort_key: string,
  decision_context: {
    type: "LENDING" | "UNDERWRITING" | "COMPLIANCE_REVIEW",
    product: "HOME_PURCHASE" | "AUTO_LOAN" | "PERSONAL_LOAN" | "OTHER",
    commitment_amount_cents?: number,
    commitment_duration_months?: number
  },
  income_structure: {
    income_sources: [
      {
        source_id: string,
        type: "SALARY" | "COMMISSION" | "BONUS" | "CONTRACT" | "BUSINESS" | "OTHER",
        amount_cents: number,
        frequency: "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "ANNUAL",
        duration_months_observed?: number,
        concentration_percent?: number,
        volatility_band?: "LOW" | "MODERATE" | "ELEVATED" | "HIGH"
      }
    ]
  },
  obligations?: {
    recurring_obligations: [
      {
        obligation_id: string,
        type: "HOUSING" | "AUTO" | "CREDIT" | "OTHER",
        amount_cents: number,
        frequency: "MONTHLY" | "ANNUAL"
      }
    ]
  }
}
```

### EvaluationRequest
- Captures raw input
- Links to policy version
- Stores input_hash for audit trail
- Immutable after creation

### EvaluationResult
- Deterministic output
- Status (PASS/FAIL/REVIEW/INPUT_ERROR/ASNC/etc.)
- Violation score (integer, accumulated)
- Reason codes (array of strings)
- Rule results (AST evaluation details)
- Result hash for replay validation

### AuditRecord
- Immutable by definition
- Fields: audit_id, input_hash, policy_hash, result_hash, evaluator_version, replayable
- 7-year retention
- No modification, no deletion
- Enables point-in-time replay

---

## 2. Unit Standards

**Currency**: Cents (integer)  
- Example: $100.50 = 10050 cents
- Prevents floating-point error
- All income, obligations in cents

**Time**: Months (integer)  
- Example: 3 years = 36 months
- All durations in months

**Percentages**: Decimal 0.0-100.0 (number)  
- Example: 35.5% = 35.5
- For concentration_percent, volatility assessment

**Frequency**: Enumerated string  
- WEEKLY, BIWEEKLY, MONTHLY, ANNUAL
- Never free-text

---

## 3. Normalization Rules

### Income Normalization
1. Validate each income source
2. Compute total income = SUM of all income_sources (in same frequency)
3. Normalize frequency to monthly: annual ÷ 12, weekly × 52 ÷ 12
4. Compute concentration_percent = (source_amount ÷ total_income) × 100
5. All normalized to monthly basis

### Obligation Normalization
1. Validate each obligation
2. Normalize frequency to monthly: annual ÷ 12
3. Compute total monthly obligations
4. All normalized to monthly basis

### Ratio Computation
```
Obligation Ratio = (Total Monthly Obligations ÷ Total Monthly Income) × 100
```

---

## 4. Validation Rules (REQ-006)

Every payload MUST pass:

- [ ] All required fields present
- [ ] All values match type schema
- [ ] All enums valid
- [ ] No null values (unless marked optional)
- [ ] Numeric values non-negative (except deltas)
- [ ] String fields non-empty
- [ ] Income sources >= 1 minimum
- [ ] No duplicate source_ids
- [ ] No duplicate obligation_ids
- [ ] subject_id non-empty
- [ ] cohort_key non-empty

**Rejection**: INPUT_ERROR if any validation fails

---

## 5. Immutability Guarantees

### Cannot Be Modified After Creation
- Organization: After linked to policy
- Policy: Never (version control only)
- CohortPolicyBinding: After active = true
- EvaluationRequest: Never
- EvaluationResult: Never
- AuditRecord: Never

### Can Be Soft-Deleted
- CohortPolicyBinding: Via active = false
- Policy: Via status (ACTIVE/DEPRECATED/SUPERSEDED)

### Cannot Be Hard-Deleted
- AuditRecord: Retention policy mandates 7-year storage

---

## 6. Audit Trail Capture

Every field that flows through evaluation:

```
Input → input_hash (SHA256)
Policy → policy_hash (SHA256)
Result → result_hash (SHA256)
```

These three hashes enable:
1. Replay validation: re-run input against policy, compare result_hash
2. Policy change detection: policy_hash changes detect version updates
3. Data integrity: input_hash detects payload tampering

---

## 7. Retention Policy

| Entity | Retention | Deletion Policy |
|--------|-----------|-----------------|
| Organization | Indefinite | Never |
| Policy | Indefinite | Never (DEPRECATED flag only) |
| CohortPolicyBinding | Indefinite | Never (soft-delete only) |
| EvaluationRequest | 7 years minimum | After 7 years, may archive |
| EvaluationResult | 7 years minimum | After 7 years, may archive |
| AuditRecord | 7 years minimum | After 7 years, may archive |

---

## 8. Compliance Framework

**SOC 2**: Immutable audit trail, access controls, retention policy  
**ISO 27001**: Data classification (Financial/PII), encryption, access logging  
**Financial Regulations**: Auditability, versioning, determinism  

---

## References

- ARCHITECTURE_STANDARD.md
- AUDIT_STANDARD.md
- API_STANDARD.md
