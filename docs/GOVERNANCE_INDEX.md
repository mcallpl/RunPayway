# RunPayway™ Governance Index

**Complete Map of Institutional Governance System**

This is the entry point for understanding RunPayway™'s governance architecture. It explains how all governance documents relate and which to read first.

---

## GOVERNANCE LAYERS (3-Tier Authority)

### PRIMARY LAYER: Visual System
**Immutable visual infrastructure for 100+ pages**

| Document | Purpose | Size | Read First? |
|----------|---------|------|-----------|
| DESIGN_GOVERNANCE.md | Enforcement rules, anti-patterns, authority hierarchy, platform architecture framing | 19KB | YES |
| DESIGN_SYSTEM.md | Color palette, spacing tokens, typography scale, components, motion, layout | 10KB | YES |

**Controls:**
- Color palette (locked 5 colors)
- Spacing tokens (locked 7 sizes)
- Typography scale (locked 6 sizes)
- Component system (6 reusable primitives)
- Motion timings (3 standard durations)
- Anti-patterns (forbidden approaches)
- Responsive breakpoints (768px, 1024px)

**Rule:** Pages use locked components from `/components/system/` and tokens from `designTokens.ts`. Zero custom styling for layout/structure.

---

### SECONDARY LAYER: Strategic Guidance
**Institutional guidance for page strategy, tone, and semantics**

| Document | Purpose | Size | Read When? |
|----------|---------|------|-----------|
| PAGE_BLUEPRINTS.md | 5 decision-state page archetypes with guidance for structure, tone, trust requirements | 12KB | Planning new page |
| CONTENT_GOVERNANCE.md | Tone philosophy, canonical vocabulary, banned language, voice principles | 14KB | Writing copy |
| NAVIGATION_GOVERNANCE.md | Header/footer architecture, scalable navigation patterns, mobile behavior | 13KB | Building nav pages |
| SEMANTIC_ARCHITECTURE.md | Entity hierarchy, glossary authority, canonical terminology, internal linking strategy | 18KB | Planning information architecture |

**Controls:**
- Page strategy (which blueprint applies)
- Content tone and vocabulary
- Navigation consistency
- Semantic authority and entity relationships
- Internal linking discipline

**Rule:** Pages must match approved blueprints, use canonical vocabulary, maintain navigation patterns, and align with semantic architecture.

---

### OPERATIONAL LAYER: Verification & Compliance
**Tools and processes that gate deployment**

| Document/Tool | Purpose | Type | Required? |
|-----------|---------|------|-----------|
| PRE_BUILD_CHECKLIST.md | 7-section mandatory checklist before any page merge | Document | YES |
| /scripts/verify-page.js | Verifies page structure and content | Script | YES |
| /scripts/screenshot-page.js | Captures baseline screenshots (desktop + mobile) | Script | YES |
| /scripts/check-route.js | Quick route accessibility check | Script | YES |
| /scripts/predeploy-check.js | Full pre-deployment validation | Script | YES |
| /visual-baselines/* | Approved baseline screenshots | Directory | YES |

**Controls:**
- Build readiness verification
- Page compliance confirmation
- Visual regression detection
- Route health checks
- Baseline screenshot comparison

**Rule:** All verification scripts must pass before deployment. No exceptions.

---

## HOW TO USE THIS GOVERNANCE

### I'm Building a New Page

1. **Read PAGE_BLUEPRINTS.md** — Which archetype applies?
2. **Read CONTENT_GOVERNANCE.md** — What tone and vocabulary?
3. **Read DESIGN_SYSTEM.md** — What components and tokens?
4. **Read PRE_BUILD_CHECKLIST.md** — What must pass before merge?

**Then:**
- Build page using locked components and tokens
- Verify with `npm run verify -- /route`
- Screenshot with `npm run screenshot -- /route`
- Check baseline match
- Complete PRE_BUILD_CHECKLIST.md
- Create PR with checklist in description

### I'm Updating a Component

1. **Check DESIGN_SYSTEM.md** — Is this a locked component?
2. **Check DESIGN_GOVERNANCE.md** — What are the rules?
3. **Run `npm run predeploy`** — Does build pass?
4. **Screenshot comparison** — Does baseline still match?

**Important:** Component updates affect all pages. Changes require design governance approval.

### I'm Writing Copy for a Page

1. **Read CONTENT_GOVERNANCE.md** — What vocabulary and tone?
2. **Search for banned language** — None allowed
3. **Use canonical terms** — From approved list only
4. **Read SEMANTIC_ARCHITECTURE.md** — What internal links apply?

**Goal:** Copy feels composed, analytical, institutionally confident. No hype, no vague language.

### I'm Planning Navigation

1. **Read NAVIGATION_GOVERNANCE.md** — What's the pattern?
2. **Primary nav items:** 4-6 maximum (target)
3. **Footer columns:** Company, Product, Resources, Legal
4. **Header consistency:** All pages use `<MarketingHeader />`
5. **Footer consistency:** All pages use `<MarketingFooter />`

**Goal:** Navigation is minimal, clear, consistent across all pages.

### I'm Planning Information Architecture

1. **Read SEMANTIC_ARCHITECTURE.md** — What's the entity hierarchy?
2. **Identify primary territories** — Income Stability, Structural Verification, etc.
3. **Plan internal linking** — Which pages link to which?
4. **Establish canonical vocabulary** — What terms are locked?
5. **Schema markup** — What entity role does this page have?

**Goal:** RunPayway™ owns semantic territory. Each page has clear role in hierarchy.

---

## GOVERNANCE PHILOSOPHY

### What This System Does

✓ **Prevents visual entropy** — Pages feel cohesive as system grows to 100+
✓ **Enables scalability** — New pages compose from proven patterns
✓ **Protects institutional voice** — Copy tone is consistent
✓ **Maintains semantic authority** — Content strategy is coordinated
✓ **Guides judgment** — Rules are thoughtful, not mechanical
✓ **Allows evolution** — System improves over time with approval

### What This System Doesn't Do

✗ **Lock pages forever** — Thoughtful refinement is allowed
✗ **Prevent all variation** — Variation within constraints is fine
✗ **Eliminate design decisions** — Pages still require strategic thinking
✗ **Make design mechanical** — Components enable composition, not copy/paste
✗ **Prevent growth** — System explicitly accommodates 100+ pages

---

## AUTHORITY HIERARCHY RULES

**When governance documents conflict:**

1. Check PRIMARY authority (DESIGN_SYSTEM.md, DESIGN_GOVERNANCE.md)
2. If unresolved, check SECONDARY authority (PAGE_BLUEPRINTS.md, etc.)
3. Use OPERATIONAL tools to verify compliance
4. If still unclear, escalate to governance review

**Key principle:** Platform architecture decisions override individual page preferences.

---

## CHANGE MANAGEMENT

### Adding New Governance

**If a new rule is needed:**
1. Document the problem and proposed solution
2. Get approval from design + product leadership
3. Add to appropriate governance document (PRIMARY, SECONDARY, or OPERATIONAL)
4. Communicate change to team
5. Implement on next page build

**Approval authority:** Design system maintainer + product leadership

### Updating Existing Governance

**If existing rule needs refinement:**
1. Document why the change is needed
2. Show impact analysis (which pages affected?)
3. Get approval from design + product leadership
4. Update documentation
5. Audit existing pages for compliance
6. Update baseline screenshots if needed

**Approval authority:** Design system maintainer + product leadership

### Deprecating Rules

**If a rule is no longer needed:**
1. Document why it's no longer relevant
2. Plan transition (if any)
3. Get approval from design + product leadership
4. Update documentation
5. Archive old rules (don't delete)

**Approval authority:** Design system maintainer + product leadership

---

## QUICK REFERENCE

### Design System Essentials

| Asset | Location | Purpose |
|-------|----------|---------|
| Color Palette | DESIGN_SYSTEM.md | 5 locked colors (Navy, Purple, Teal, Sand, White) |
| Spacing Tokens | designTokens.ts | 7 sizes (8px to 80px) |
| Typography | DESIGN_SYSTEM.md | 6 scale (11px to 56px) |
| Components | /components/system/ | SectionContainer, SectionLabel, PageHero, etc. |
| Transitions | DESIGN_SYSTEM.md | 3 timings (150ms, 180ms, 220ms) |
| Breakpoints | DESIGN_SYSTEM.md | 768px, 1024px |

### Page Blueprints

| Archetype | Use Case | Example |
|-----------|----------|---------|
| Trust Establishment | Methodology, authority | How It Works |
| Concept Clarification | Learning, definitions | /learn/income-stability |
| Decision Support | Use cases | /use-cases/mortgage-qualification |
| Verification Environment | User roles | /verify/individual |
| Structural Comparison | Comparisons | Income structure comparison |

### Semantic Territories

| Territory | Authority Page | Related Pages |
|-----------|----------------|----|
| Income Stability | /learn/income-stability | All use cases, methodology |
| Structural Verification | /how-it-works | /methodology, all use cases |
| Income Structure | /learn/income-structure | All use cases, concepts |
| Deterministic Results | /how-it-works | All methodology pages |
| Structural Risk | /learn/* (distributed) | All use cases, decisions |

### Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| Build | `npm run build` | Compile project |
| Verify | `npm run verify -- /route` | Check page structure |
| Screenshot | `npm run screenshot -- /route` | Capture desktop + mobile |
| Check Route | `npm run check:route -- /route` | Quick accessibility check |
| Pre-Deploy | `npm run predeploy` | Full validation suite |

---

## READING ORDER

**For governance setup (one-time):**
1. This file (GOVERNANCE_INDEX.md)
2. DESIGN_GOVERNANCE.md (authority structure, philosophy)
3. DESIGN_SYSTEM.md (visual specifications)
4. PAGE_BLUEPRINTS.md (page strategy)

**For each new page build:**
1. PAGE_BLUEPRINTS.md (identify archetype)
2. CONTENT_GOVERNANCE.md (tone and vocabulary)
3. PRE_BUILD_CHECKLIST.md (what to verify)
4. DESIGN_SYSTEM.md (reference as needed)

**For understanding semantics:**
1. SEMANTIC_ARCHITECTURE.md (entity hierarchy)
2. NAVIGATION_GOVERNANCE.md (how pages connect)
3. CONTENT_GOVERNANCE.md (approved vocabulary)

---

## CONTACT & ESCALATION

**For governance questions:**
- Design governance maintainer: Check DESIGN_GOVERNANCE.md
- Content tone questions: Check CONTENT_GOVERNANCE.md
- Page strategy questions: Check PAGE_BLUEPRINTS.md
- Navigation questions: Check NAVIGATION_GOVERNANCE.md

**For exceptions or changes:**
- Escalate to design + product leadership
- Document reason and impact
- Proposal must be approved before implementation

---

**Last Updated:** 2026-05-25  
**Authority:** RunPayway™ Governance  
**Status:** Complete and active
