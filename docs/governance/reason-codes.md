# Reason Code Governance Registry

**Status**: ACTIVE  
**Version**: 1.0.0  
**Last Updated**: 2026-06-22  

---

## Reason Code: RP-INC-001

**Status**: ACTIVE  
**Version**: 1.0.0  
**Category**: INCOME  
**Created**: 2026-06-22  
**Owner**: RunPayway Governance  

**Description**:  
Commission income concentration threshold exceeded

**Definition**:  
Commission income >= 35% of total income

**Severity**: ELEVATED  
**Violation Contribution**: 25 points  

**Rule ID**: commission-concentration  
**Policy**: Mortgage Mixed Income Policy v1.0.0  
**Reason**: Concentration of income in commission creates lending risk  

**Audit Trail**:
- Created: 2026-06-22 by RunPayway Governance
- No modifications (immutable)
- No deprecation planned

**Test Coverage**:
- Positive test: 35% commission → RP-INC-001 triggered
- Boundary test: 34.99% → not triggered, 35.00% → triggered, 35.01% → triggered
- Negative test: 10% commission → not triggered

---

## Reason Code: RP-INC-002

**Status**: ACTIVE  
**Version**: 1.0.0  
**Category**: INCOME  
**Created**: 2026-06-22  
**Owner**: RunPayway Governance  

**Description**:  
Commission income volatility band threshold triggered

**Definition**:  
volatility_band IN [ELEVATED, HIGH]

**Severity**: ELEVATED  
**Violation Contribution**: 20 points  

**Rule ID**: commission-volatility  
**Policy**: Mortgage Mixed Income Policy v1.0.0  
**Reason**: High volatility in commission income creates repayment uncertainty  

**Audit Trail**:
- Created: 2026-06-22 by RunPayway Governance
- No modifications (immutable)
- No deprecation planned

**Test Coverage**:
- Positive test: volatility_band=ELEVATED → RP-INC-002 triggered
- Positive test: volatility_band=HIGH → RP-INC-002 triggered
- Negative test: volatility_band=LOW → not triggered
- Negative test: volatility_band=MODERATE → not triggered

---

## Reason Code: RP-OBL-001

**Status**: ACTIVE  
**Version**: 1.0.0  
**Category**: OBLIGATIONS  
**Created**: 2026-06-22  
**Owner**: RunPayway Governance  

**Description**:  
Recurring obligation ratio threshold triggered

**Definition**:  
(Total Monthly Obligations ÷ Total Monthly Income) > 45%

**Severity**: ELEVATED  
**Violation Contribution**: 30 points  

**Rule ID**: obligation-ratio  
**Policy**: Mortgage Mixed Income Policy v1.0.0  
**Reason**: High obligation-to-income ratio indicates limited repayment capacity  

**Audit Trail**:
- Created: 2026-06-22 by RunPayway Governance
- No modifications (immutable)
- No deprecation planned

**Test Coverage**:
- Positive test: ratio=46% → RP-OBL-001 triggered
- Boundary test: ratio=44.99% → not triggered, 45.00% → not triggered, 45.01% → triggered
- Negative test: ratio=30% → not triggered

---

## Reason Code Lifecycle

### Active Codes (Current)
- RP-INC-001 (v1.0.0)
- RP-INC-002 (v1.0.0)
- RP-OBL-001 (v1.0.0)

### Deprecated Codes
None yet

### Superseded Codes
None yet

---

## Adding New Reason Codes

**Process**:
1. Author requests new reason code in ADR
2. Policy Reviewer reviews definition
3. Policy Approver approves
4. Code allocated: RP-[CATEGORY]-[NUMBER]
5. Stored in registry (never deleted)
6. New code version = 1.0.0
7. Mapped to specific policy rule (AST node)

**Example**:
```
REQ-100: New rule for business income volatility
  ↓
ADR-010: New reason code for business volatility
  ↓
RP-INC-003: Business income volatility threshold
  ↓
Mapped to: business-volatility rule in policy v1.1.0
  ↓
Policy Approver approves
  ↓
Code active, evaluations use it
```

---

## Never Delete

**Reason Codes Are Immutable**:
- Created codes never change
- Created codes never delete
- Only status can change (ACTIVE → DEPRECATED)
- Historical evaluations preserve original codes
- Audit trail intact forever

---

## Monitoring & Metrics

**Reason Code Usage Metrics** (quarterly):
- Which codes triggered most frequently?
- Which codes indicate potential policy gaps?
- Are codes evenly distributed, or are some over-represented?

**Example Report**:
```
Q3 2026 Reason Code Usage:
- RP-INC-001: 42% of evaluations (commission concentration)
- RP-OBL-001: 31% of evaluations (obligation ratio)
- RP-INC-002: 18% of evaluations (volatility)

Observation: Commission concentration triggering most.
Action: Review policy threshold (may be too strict)?
```

---

## References

- REASON_CODE_STANDARD.md
- ADR-003-Reason-Codes.md
- REQUIREMENTS.md (REQ-009)
