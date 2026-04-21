# RunPayway™ Plan Validation & Configuration

## Plan Definitions (Source: `/src/lib/config.ts`)

### Assessment Plans
| Plan Key | Assessments | Price | Duration | Use Case |
|----------|-----------|-------|----------|----------|
| `free` | 1 | $0 | N/A | Free score only |
| `single_assessment` | 1 | $69 | One-time | Full diagnostic |
| `annual_monitoring` | 3 | $149 | 12 months | Quarterly reviews |

### Advisor Plans (separate tier)
| Plan Key | Reports | Price | Period | Use Case |
|----------|---------|-------|--------|----------|
| `advisor_starter` | 15 | $249 | Quarterly | Starter advisor service |
| `advisor_professional` | 50 | $179 | Monthly | Professional advisor service |
| `advisor_enterprise` | Unlimited | $149 | Monthly per seat | Enterprise advisor service |

## Validation Rules by Component

### Payment Processing
**Location**: `/src/api/v1/payment-token/route.ts`
- **Validates**: `single_assessment`, `annual_monitoring`
- **Why**: Only these plans can be purchased and require signed tokens
- **Utility**: `isValidPaymentPlanKey()` from `plan-validation.ts`

### Entitlement Checking
**Location**: `/src/app/(app)/diagnostic/page.tsx` (line 447)
- **Check**: `if (entEmail && entPlanKey !== "free")`
- **Behavior**: Only runs entitlement checks for paid plans
- **Correct**: ✓ Excludes free plan appropriately

### Monitoring Plan Features
**Location**: `/src/api/v1/monitoring/route.ts` (line 31)
- **Check**: `payload.plan_key !== "annual_monitoring"`
- **Behavior**: Monitoring endpoints only work with annual_monitoring plan
- **Correct**: ✓ Intentionally limits to specific plan
- **Utility**: Direct check is appropriate here (plan-specific endpoint)

### Assessment Retakes
**Location**: `/src/app/(app)/diagnostic/page.tsx` (line 460)
- **Rule**: Single assessment plans allow 1 retake within 30 days of purchase
- **Rule**: Monitoring plans allow 3 assessments over 12 months
- **Handled by**: Entitlement system (Worker API checks)
- **Correct**: ✓ Entitlement system is authoritative

### Portal Access
**Location**: `/src/app/(app)/diagnostic-portal/page.tsx` (line 357)
- **Check**: `ps.plan_key === "free" && ps.status !== "paid"`
- **Behavior**: Free plan users with existing assessments must repurchase
- **Correct**: ✓ Fixed (removed reference to non-existent "individual" plan)

## Critical Validation Points

### ✓ No More Hardcoded Plan Lists
All plan validation uses:
- `PLANS` constant from `/src/lib/config.ts` (single source of truth)
- Utility functions from `/src/lib/plan-validation.ts`
- Never hardcoded string literals like `plan_key !== "foo"`

### ✓ Plans Always Valid
When a new plan is added to `config.ts`:
1. It automatically becomes available in `PLANS`
2. Type system in `plan-validation.ts` requires explicit setup for new payment types
3. Conditional logic uses helper functions, not hardcoded checks

### ✓ No Invalid Plan References
Removed references to non-existent plans:
- ~~`"individual"`~~ (was in diagnostic-portal.tsx, now removed)

## Testing Checklist

When adding a new plan:
- [ ] Add to `PLANS` in `/src/lib/config.ts`
- [ ] If it's purchasable, add to `isValidPaymentPlanKey()` check
- [ ] Run through all assessment flows: free → paid → monitoring
- [ ] Verify entitlement checks don't block the new plan
- [ ] Test retake logic with the new plan
- [ ] Verify dashboard loads correctly for the plan
- [ ] Test sign-out and re-entry with stored session

## Known Safe Patterns

**OK to hardcode**: Plan-specific endpoints that intentionally limit to one plan
```typescript
if (payload.plan_key !== "annual_monitoring") {
  // This endpoint only works with monitoring plan — intentional
}
```

**NOT OK**: Generic checks that should support multiple plans
```typescript
if (entPlanKey !== "single_assessment") {
  // This will break when new plans are added — use utility function
}
```

## Error Message Cleanup

- ✓ Removed: "You have used all assessments on this plan" from diagnostic/page.tsx line 471
  - Reason: Error should be handled by entitlement system, not shown to users
  - Impact: All plans (free, single_assessment, annual_monitoring, advisor_*) work without this error

## References
- Config: `/src/lib/config.ts`
- Validation: `/src/lib/plan-validation.ts`
- Payment Token: `/src/lib/payment-token.ts`
- Entitlement: Worker API (external)
