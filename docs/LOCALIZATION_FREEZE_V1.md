# Localization Freeze V1

**Effective Date:** June 22, 2026  
**Status:** Enterprise MVP Phase  
**Governance:** RunPayway Control Framework

---

## Executive Summary

RunPayway has transitioned from a multilingual consumer product to an **enterprise-focused deterministic policy execution engine**. This document establishes a strategic localization freeze that acknowledges the legacy consumer translation surface while prioritizing the enterprise MVP.

**English is the only active, supported language for the enterprise product.**

Non-English locales are preserved for future strategic review and potential re-activation, but must not drive current product development or maintenance overhead.

---

## Language File Status Classification

### ACTIVE Source of Truth
- **en.ts** (English)
  - Primary language for enterprise MVP
  - Single source of truth for product copy
  - All product decisions and governance-critical content authored in English
  - Required to pass TypeScript strict type checking
  - Subject to active maintenance and updates

### LEGACY_INACTIVE Preserves
- **es.ts** (Spanish)
  - Preserved from legacy consumer product
  - No active maintenance planned
  - No new translation keys should be added
  - No localization work prioritized
  - Retained for future strategic review if consumer product resurrects

- **hi.ts** (Hindi)
  - Preserved from legacy consumer product
  - No active maintenance planned
  - No new translation keys should be added
  - No localization work prioritized
  - Retained for future strategic review if consumer product resurrects

- **pt.ts** (Portuguese)
  - Preserved from legacy consumer product
  - No active maintenance planned
  - No new translation keys should be added
  - No localization work prioritized
  - Retained for future strategic review if consumer product resurrects

---

## Governance Rules

### What This Freeze Prohibits

1. **No new translation maintenance**
   - Translation keys in es.ts, hi.ts, pt.ts are frozen
   - Adding new keys to non-English files requires governance approval
   - Translating new en.ts keys to other languages is deferred

2. **Non-English content is not product authority**
   - Legacy consumer wording in Spanish, Hindi, Portuguese must not be treated as definitive product policy
   - English en.ts is the sole authoritative source
   - If locales conflict, English en.ts governs product behavior

3. **Type definitions remain strict**
   - i18n/types.ts continues to require all defined keys
   - No broad index signatures (`[key: string]: any`) to accommodate missing translations
   - Translation gaps must be resolved by adding keys to all locales or making keys optional (only for truly optional content)

### What This Freeze Permits

1. **Language files may be preserved**
   - es.ts, hi.ts, pt.ts remain in the repository
   - Files are not deleted until formal decision to sunset consumer product

2. **Future re-activation**
   - If RunPayway later pursues consumer multi-language strategy, these files can be updated
   - Requires explicit governance approval and product strategy alignment

3. **Bug fixes in legacy locales**
   - If a critical bug or security issue affects legacy files, it may be fixed
   - Must be minimal and not introduce new translation work

---

## Implementation Status

- **Repository Cleanup**: Language files preserved, not deleted
- **Routing**: No changes to language selection routing (if present)
- **User-Facing Language Selection**: No changes to UI language switcher (if present)
- **Type System**: Remains strict; no weakening to accommodate missing translations
- **Documentation**: This freeze is the single source of governance

---

## Transition Path: Legacy Terminology Cleanup

Once this localization freeze is documented and committed, the next phase may begin: removal of legacy product abstractions and academic terminology from documentation and comments.

That cleanup **must not begin until**:
1. ✓ This localization freeze is documented
2. ✓ This document is committed
3. ✓ Repository is green (typecheck, tests, build)

---

## Future Considerations

### To Re-Activate Localization

If RunPayway decides to pursue consumer localization or enterprise multi-language support:

1. File a governance request with rationale
2. Update this document to mark specific locales as `ACTIVE`
3. Establish translation maintenance process (human review, not automated)
4. Update type definitions if new keys are introduced
5. Coordinate with enterprise product strategy

### To Deprecate Locales

If RunPayway decides to fully remove non-English support:

1. Update this document to mark locales as `DEPRECATED`
2. Update routing/UI to disable language selection
3. Plan customer communication (if any users rely on legacy locales)
4. Delete es.ts, hi.ts, pt.ts in a dedicated cleanup commit
5. Update i18n/types.ts if locale-specific fallbacks existed

---

## Compliance Checklist

- [x] English (en.ts) is the only active supported language
- [x] Non-English locales classified as LEGACY_INACTIVE
- [x] No new translation work approved for non-English files
- [x] Type system remains strict (no broad `any` to hide missing keys)
- [x] Legacy consumer wording explicitly NOT product authority
- [x] Language files preserved (not deleted)
- [x] Routing unchanged (no language selection changes)
- [x] UI language selection unchanged (no user-facing changes)
- [x] Governance approval required for re-activation

---

## Document History

| Version | Date       | Author | Status    |
|---------|------------|--------|-----------|
| 1.0     | 2026-06-22 | Claude | ACTIVE    |

---

**End of Localization Freeze V1**
