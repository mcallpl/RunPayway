# RunPayway™ Pre-Build Checklist

**Mandatory Verification Before Any Page Build**

This checklist is the institutional gate between development and deployment. Every new page must pass all items before merge.

---

## PURPOSE

The pre-build checklist ensures:

1. **Design consistency** — Page uses system components and tokens
2. **Institutional voice** — Copy uses approved vocabulary and tone
3. **Information clarity** — Page follows approved blueprint and navigation patterns
4. **Semantic authority** — Content aligns with semantic architecture
5. **Visual integrity** — No regression from baselines
6. **Technical readiness** — Build succeeds and verifies pass

---

## CHECKLIST

### SECTION 1: DESIGN SYSTEM COMPLIANCE (5 items)

- [ ] **1.1 — Components Only**
  - Page uses components from `/components/system/` only
  - No custom buttons, dividers, sections, or wrappers
  - No custom CSS for layout or structure
  - Verify: Grep codebase for custom `className` styling (layout-only)

- [ ] **1.2 — Design Tokens Only**
  - All colors imported from `COLORS` token object
  - All spacing from `SPACING` token object
  - All typography from `TYPOGRAPHY` token object
  - All transitions from `TRANSITIONS` token object
  - No hardcoded px, hex colors, or font sizes
  - Verify: No inline styles with numeric values (except data-driven)

- [ ] **1.3 — Anti-Patterns Absent**
  - No gradients
  - No glassmorphism or transparency effects
  - No glow effects or excessive shadows
  - No floating cards or scale transforms
  - No parallax or animated backgrounds
  - No excessive rounded corners (> 8px)
  - No bounce or elastic animations
  - No auto-playing video
  - Verify: Visual inspection and code review

- [ ] **1.4 — Responsive Behavior**
  - Mobile layout valid at 768px breakpoint
  - Tablet layout valid at 768px-1024px
  - Desktop layout valid at 1024px+
  - No horizontal scroll on any breakpoint
  - Text readability maintained at all sizes
  - Verify: Test at 320px, 768px, 1024px, 1440px widths

- [ ] **1.5 — Header and Footer**
  - Page includes `<MarketingHeader />` at top
  - Page includes `<MarketingFooter />` at bottom
  - Header rendered correctly with navigation
  - Footer rendered correctly with links and copyright
  - Header and footer match baseline screenshot
  - Verify: Visual comparison against baseline

### SECTION 2: CONTENT GOVERNANCE (4 items)

- [ ] **2.1 — Canonical Vocabulary Only**
  - Uses approved terms: "income stability," "structural verification," "deterministic results," etc.
  - No generic finance language: "financial stability," "financial health," etc.
  - No motivational language: "unlock potential," "transform financial future," etc.
  - No AI-centered language in marketing copy
  - Verify: Search codebase for banned terms list

- [ ] **2.2 — Banned Language Absent**
  - No "revolutionary," "game-changing," "cutting-edge," "disrupting"
  - No "limited time," "act now," "don't miss out"
  - No "trusted by thousands" or vague authority signaling
  - No exclamation marks outside CTA sections
  - Verify: Manual copy review

- [ ] **2.3 — Tone is Institutional**
  - Copy feels composed and analytical
  - Authority without arrogance
  - Restrained, not hype-driven
  - Structurally precise about what we do
  - Human-readable and accessible
  - Verify: Read aloud, compare tone to CONTENT_GOVERNANCE.md examples

- [ ] **2.4 — CTA Copy is Clear**
  - CTAs are action-specific: "Get Assessment," "Schedule Review," "Begin Analysis"
  - Not vague: "Click Here," "Learn More," "Discover"
  - CTAs match page blueprint posture (exploratory vs. action-oriented)
  - Button text matches content strategy
  - Verify: Review all CTA buttons against blueprint

### SECTION 3: PAGE ARCHITECTURE (4 items)

- [ ] **3.1 — Blueprint Match**
  - Page matches one of 5 approved blueprints:
    - Trust Establishment (methodology, authority)
    - Concept Clarification (learning, definitions)
    - Decision Support (use cases)
    - Verification Environment (roles)
    - Structural Comparison (comparisons)
  - User mindset aligns with blueprint definition
  - Trust requirement scope appropriate
  - Verify: Document in PR description which blueprint applies

- [ ] **3.2 — Section Sequence Appropriate**
  - Sections follow blueprint guidance
  - Hero section present (if required by blueprint)
  - CTA section present and appropriately positioned
  - Content flows logically
  - Mobile section reflow is sensible at 768px
  - Verify: Outline page structure vs. blueprint

- [ ] **3.3 — Internal Linking Discipline**
  - Links to related concepts are contextual
  - Anchor text includes link target concept
  - No keyword stuffing or artificial link density
  - Links are live (not `href="#"`)
  - Verify: Review all internal links for relevance

- [ ] **3.4 — Navigation Patterns**
  - Page navigation consistent with NAVIGATION_GOVERNANCE.md
  - Header nav items match approved list (4-6 primary items)
  - Footer column structure matches standard (Company, Product, Resources, Legal)
  - Active state shows current page
  - Mobile hamburger menu functional
  - Verify: Visual comparison, navigation testing

### SECTION 4: SEMANTIC ARCHITECTURE (3 items)

- [ ] **4.1 — Entity Roles Clear**
  - Page establishes clear entity role (Concept, Use Case, Role, Topic, etc.)
  - Semantic relationships to other pages are explicit
  - Internal linking supports semantic hierarchy
  - Metadata/schema markup is appropriate
  - Verify: Check page in context of SEMANTIC_ARCHITECTURE.md hierarchy

- [ ] **4.2 — Semantic Clarity**
  - No mixing of canonical and non-canonical terminology
  - Definitions are precise and consistent
  - Related concepts are explicitly linked
  - No vague generalities
  - Verify: Compare page copy against SEMANTIC_ARCHITECTURE.md terminology

- [ ] **4.3 — SEO Entity Role**
  - Page serves defined SEO/entity role (topic authority, decision support, etc.)
  - Schema markup (if applicable) matches entity type
  - Content supports subject authority signals
  - URL structure aligns with semantic architecture
  - Verify: Review page purpose against SEMANTIC_ARCHITECTURE.md

### SECTION 5: VISUAL VERIFICATION (3 items)

- [ ] **5.1 — Screenshots Match Baseline**
  - Run: `npm run screenshot -- /[route]`
  - Compare screenshots to `/visual-baselines/`
  - Desktop (1200x800) matches baseline (within 2% pixel tolerance)
  - Mobile (375x812) matches baseline (within 2% pixel tolerance)
  - If different: Document reason and update baseline with approval
  - Verify: Visual comparison tool results

- [ ] **5.2 — No Visual Regression**
  - Section spacing is consistent
  - Typography hierarchy is maintained
  - Colors match palette exactly
  - Button styles match component
  - Dividers are 1px and consistent
  - Verify: Manual visual inspection

- [ ] **5.3 — Accessibility Standards**
  - Color contrast meets WCAG AA standard (4.5:1 minimum)
  - Links are keyboard accessible
  - Focus states are visible
  - Alt text provided for images
  - Verify: Accessibility audit tool or manual testing

### SECTION 6: BUILD & DEPLOYMENT (4 items)

- [ ] **6.1 — Build Succeeds**
  - Run: `npm run build`
  - Build completes without errors
  - Build completes without warnings (or documented exceptions)
  - Bundle size is reasonable
  - Verify: Check build output

- [ ] **6.2 — Verification Scripts Pass**
  - Run: `npm run verify -- /[route]`
  - Header present and correct
  - Footer present and correct
  - Navigation links are live
  - Essential copy present
  - Verify: Script output shows all ✓

- [ ] **6.3 — Route is Accessible**
  - Run: `npm run check:route -- /[route]`
  - HTTP status code is 200
  - Page title is present
  - Content loads (> 100 characters)
  - Verify: Script output confirms accessibility

- [ ] **6.4 — Git Status is Clean**
  - Run: `git status`
  - Only source files changed (no build artifacts)
  - No temporary test files
  - package.json changes are intentional
  - .env or secrets files are NOT included
  - Verify: Check git status output

### SECTION 7: DOCUMENTATION (2 items)

- [ ] **7.1 — PR Description Includes Checklist**
  - PR title is descriptive
  - PR description includes this checklist
  - Each item is checked or marked with explanation
  - Blueprint selection is documented
  - Verify: Review PR body

- [ ] **7.2 — Code Comments (if needed)**
  - Design system compliance documented (if notable)
  - Custom patterns explained (if any exceptions approved)
  - No "why we did this" comments (design is locked)
  - Verify: Code review for clarity

---

## HOW TO USE THIS CHECKLIST

### Before Development
1. Read the appropriate page blueprint
2. Plan page structure per blueprint guidance
3. Identify which checklist items apply (most apply to all pages)

### During Development
1. Use design tokens and components (not custom styles)
2. Use approved vocabulary (not banned language)
3. Follow navigation and semantic patterns
4. Test responsive behavior throughout development

### Before Committing
1. Run all verification scripts: `npm run verify`, `npm run screenshot`, `npm run check:route`
2. Check visual baseline: `npm run screenshot -- /[route]` and compare
3. Build and verify: `npm run build`
4. Check git status: `git status`

### In PR Description
1. Copy this checklist
2. Check items as you verify them
3. Document blueprint selection
4. Explain any baseline changes
5. Describe what changed and why

### Before Merge
1. Code reviewer confirms all items are checked
2. Visual review confirms baseline match (or approval for intentional changes)
3. All build scripts pass
4. Git status is clean
5. Merge and deploy

---

## EXCEPTION PROCESS

**If a page cannot pass an item:**

1. **Document the issue** — Which item? Why can't it pass?
2. **Determine if it's a real exception** — Is the item actually required for this page?
3. **Propose a solution** — Can the item be fixed? Or is an exception needed?
4. **Get explicit approval** — Design governance + product leadership
5. **Document the exception** — Include in PR description and code comments
6. **Update governance if needed** — If this reveals a system limitation, update the documentation

**Note:** Most items should always pass. Exceptions are rare and require approval.

---

## CHECKLIST VARIANTS

### For Content/Learn Pages
- May have lighter design requirements (simpler layouts)
- Still require canonical vocabulary
- Still require semantic clarity
- Still require proper baseline screenshots

### For Use Case Pages
- Still require all items
- Decision Support blueprint applies
- Content density may vary
- CTA posture is action-oriented (vs. exploratory)

### For Methodology/Authority Pages
- Still require all items
- Trust Establishment blueprint applies
- Content may be denser
- Semantic clarity is especially important

### For Simple Pages
- All items still apply
- Some items may be simpler (e.g., "Header and Footer" for simple pages)
- No exceptions just because page is simple

---

## ENFORCEMENT

**This checklist is not optional.**

- PRs without checklist completion cannot merge
- Deployment is blocked if any item fails
- Visual baseline mismatches require explicit approval
- Build failures must be resolved before merge
- Verification script failures must be resolved before merge

**Governance enforcement:**
- Design system violations block deployment
- Content governance violations block deployment
- Architecture violations block deployment
- Accessibility violations block deployment

---

**Last Updated:** 2026-05-25  
**Authority:** RunPayway™ Governance  
**Status:** Active (Mandatory for all page builds)
