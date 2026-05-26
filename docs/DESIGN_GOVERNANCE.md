# RunPayway™ Design Governance

**Preventing Visual Entropy Across 100+ Pages**

This document establishes institutional design governance to prevent drift, inconsistency, and visual regression as RunPayway™ grows.

---

## THE PROBLEM

Without explicit governance, multi-page systems accumulate:

- **Spacing drift** — sections get different padding
- **Typography drift** — headlines become inconsistent sizes
- **Color variance** — custom colors creep in
- **Component sprawl** — each page invents custom buttons, dividers, layouts
- **Responsive chaos** — different breakpoints on different pages
- **Motion inconsistency** — animations vary in duration and style
- **Startup aesthetic** — designs drift toward trendy SaaS/fintech look

**Result:** Pages feel like they belong to different products.

---

## THE SOLUTION: INSTITUTIONAL DESIGN SYSTEM

**All design decisions are locked.**

Every color, spacing value, typography size, component, button, divider, transition, and layout rule is pre-defined.

Pages don't make design decisions—they implement specifications.

---

## AUTHORITY STRUCTURE

### Design System (Authoritative)

`/docs/DESIGN_SYSTEM.md` is the source of truth.

- Locked color palette (5 colors)
- Locked spacing tokens (7 sizes)
- Locked typography scale (6 sizes)
- Locked component system (6 primitives)
- Locked motion rules (3 timings)
- Locked layout widths (3 sizes)

**NO EXCEPTIONS.**

### Reusable Components (`/components/system/`)

All UI elements come from this directory.

- SectionContainer
- SectionLabel
- PageHero
- InstitutionalDivider
- PrimaryButton
- TextBlock

**Pages may NOT:**

- Create custom button styles
- Invent dividers
- Build alternate layouts
- Use custom spacing
- Define new typography
- Mix in custom colors

### Design Tokens (`/components/system/designTokens.ts`)

All tokens imported from here.

- COLORS
- SPACING
- TYPOGRAPHY
- TRANSITIONS
- BREAKPOINTS
- LAYOUT

**Pages may NOT:**

- Define colors inline
- Use hardcoded px values
- Create custom font sizes
- Invent motion durations

---

## ANTI-PATTERNS (FORBIDDEN)

Any page violating these rules blocks deployment.

### Visual Anti-Patterns

❌ **Gradients** — Any color blend or gradient. Navy, purple, teal, sand, white, or divider gray only.

❌ **Glassmorphism** — Blur, frosted glass, transparency effects. No semi-transparent overlays over images.

❌ **Glow Effects** — Box-shadow glow, text-shadow, filter brightness. Only clean dividers allowed.

❌ **Oversized Shadows** — Shadows > `0 4px 16px rgba(14,26,43,0.08)`. Shadows must be minimal.

❌ **Floating Cards** — Cards that appear to levitate or scale on hover. Color changes only.

❌ **Parallax Scrolling** — Images that move at different speeds than content.

❌ **Animated Backgrounds** — Background animations, moving gradients, or animated SVGs.

❌ **Excessive Rounded Corners** — border-radius > 8px (except special cases, pre-approved).

❌ **Neon or Saturated Colors** — Colors outside locked palette. Every custom color is a violation.

### Component Anti-Patterns

❌ **Custom Buttons** — If it's a button, it uses PrimaryButton component. No custom styles.

❌ **Custom Dividers** — Use InstitutionalDivider. No custom divider logic.

❌ **Custom Section Wrappers** — Use SectionContainer. No custom section styling.

❌ **Ad Hoc Spacing** — No margin/padding outside SPACING tokens.

❌ **Typography Improvisation** — No custom font sizes outside TYPOGRAPHY scale.

❌ **Color Mixing** — No colors outside locked palette.

### Motion Anti-Patterns

❌ **Bounce Animations** — cubic-bezier easing with bounce behavior.

❌ **Elastic Motion** — Springy, overshooting easing curves.

❌ **Scale Transforms** — transform: scale() on any element.

❌ **Floating Motion** — transform: translateY() on hover (subtle 4-8px only).

❌ **Long Animations** — Duration > 220ms.

❌ **Auto-Playing Video** — Video that plays without user interaction.

❌ **Attention-Seeking Motion** — Animations designed to grab attention rather than guide interaction.

### Layout Anti-Patterns

❌ **Custom Max-Width** — Content wider than 1100px.

❌ **Text Wider Than 720px** — Reading text should never exceed 720px.

❌ **Arbitrary Padding** — All padding must use SPACING tokens.

❌ **Custom Breakpoints** — Mobile/tablet/desktop are locked at 768px and 1024px.

❌ **Responsive Chaos** — Different structure at different breakpoints (other than reflow to 1 column).

### Code Anti-Patterns

❌ **Inline Styles for System Values** — Use design tokens, not hardcoded colors/spacing.

❌ **Custom Components Without Approval** — All UI comes from /components/system/.

❌ **Comments Explaining "Why We Did This"** — Design is locked. Document compliance, not decisions.

❌ **Theming Systems** — No dark mode variants, no alternate color schemes, no design switches.

❌ **CSS Overrides** — No `!important`, no specificity hacks. Use system components.

---

## REQUIRED COMPLIANCE CHECKLIST

Every new page must pass:

### Design System Compliance

- [ ] Uses SectionContainer, SectionLabel, PageHero from `/components/system/`
- [ ] Uses TextBlock for all body text
- [ ] Uses PrimaryButton for CTAs
- [ ] Uses InstitutionalDivider for dividers
- [ ] All spacing from SPACING tokens
- [ ] All colors from COLORS palette
- [ ] All typography from TYPOGRAPHY scale
- [ ] No custom styles outside system

### Visual Compliance

- [ ] No gradients
- [ ] No glassmorphism
- [ ] No glow effects
- [ ] No oversized shadows
- [ ] No floating cards
- [ ] No parallax
- [ ] No animated backgrounds
- [ ] Buttons are Navy (or Sand on dark) with Purple hover
- [ ] Dividers are 1px #E5E7EB (light) or rgba white (dark)
- [ ] Section spacing is 80px (desktop) / 56px (mobile)

### Motion Compliance

- [ ] All transitions < 220ms
- [ ] No bounce, no elastic, no scale
- [ ] Opacity + subtle translate only
- [ ] Hover states are color changes only

### Layout Compliance

- [ ] Content max-width 1100px
- [ ] Hero text max-width 720px
- [ ] Reading text max-width 680px
- [ ] Section padding 40px (desktop) / 20px (mobile)
- [ ] Responsive at 768px and 1024px breakpoints

### Header/Footer Compliance

- [ ] Page includes `<MarketingHeader />`
- [ ] Page includes `<MarketingFooter />`
- [ ] Logo links to `/`
- [ ] Navigation links are live (not `href="#"`)

---

## DEPLOYMENT GATES

Pages are blocked from deployment if:

1. **Design system violations detected** — Custom colors, spacing, typography
2. **Anti-pattern violations found** — Gradients, glow, floating cards, etc.
3. **Component violations found** — Custom buttons, dividers, or sections
4. **Visual regression detected** — Screenshot comparison shows drift
5. **Compliance checklist incomplete** — Missing required structure

---

## GOVERNANCE PROCESS

### Approving Custom Styles

If a page genuinely requires custom styling outside the system:

1. **Document the request** — Why can't system components solve this?
2. **Propose the change** — What component would need to be added?
3. **Get approval** — Design system maintainer + product stakeholder
4. **Update system** — Add the new component to `/components/system/`
5. **Update documentation** — Add to DESIGN_SYSTEM.md
6. **Deploy to all pages** — Make change available to entire system

**This prevents:** One-off exceptions, isolated custom code, hidden technical debt.

### Updating the Design System

The design system is not fixed, but changes are institutional events.

**To propose a change:**

1. Create issue explaining why (not just how)
2. Show impact analysis (which pages affected?)
3. Get explicit approval (design + product + eng)
4. Update DESIGN_SYSTEM.md
5. Update components in `/components/system/`
6. Audit all pages for compliance
7. Deploy changes to all pages

---

## MEASUREMENTS OF SUCCESS

### Institutional Consistency

After this system:

- Every page feels like it belongs to RunPayway™
- Users see consistent color, spacing, typography across all pages
- Visual quality increases with each new page (reusing proven patterns)
- Pages load faster (component reuse reduces bundle)

### Prevention Metrics

This system prevents:

- ❌ Spacing drift (all pages use 7 tokens)
- ❌ Typography drift (all pages use 6 scales)
- ❌ Color variance (all pages use 5 colors)
- ❌ Component sprawl (all pages use 6 components)
- ❌ Motion chaos (all pages use 3 transitions)
- ❌ Startup aesthetic (anti-patterns are forbidden)

### Long-Term Value

As RunPayway™ grows to 100+ pages:

- **Design consistency increases**, not decreases
- **New pages take less time** (composition over invention)
- **Maintenance is simpler** (single source of truth)
- **Visual quality is guaranteed** (governance prevents decay)
- **Institutional authority increases** (coherent, professional aesthetic)

---

## DOCUMENTATION REQUIREMENT

Every new page must include:

```tsx
/**
 * Page: [Page Name]
 * Route: /[route]
 *
 * DESIGN SYSTEM COMPLIANCE CERTIFIED
 * ✓ Components: SectionContainer, SectionLabel, TextBlock, PrimaryButton, InstitutionalDivider
 * ✓ Spacing: SPACING tokens only
 * ✓ Typography: TYPOGRAPHY scale only
 * ✓ Colors: COLORS palette only
 * ✓ Layout: Responsive at 768px, 1024px
 * ✓ Motion: Transitions < 220ms, opacity-only
 * ✓ Anti-patterns: None detected
 *
 * Reviewed: [Date]
 * Approved: [Name]
 */
```

---

## ENFORCEMENT

### Automated Checks

Every deploy runs:

- `npm run predeploy` — Build + cleanup + verify
- Screenshot comparison — Detects visual drift
- Component audit — Ensures system components only
- Color audit — Confirms palette compliance

### Verification Script Requirements

All verification scripts (`verify-page.js`, `screenshot-page.js`, `check-route.js`) must:

1. **Auto-detect dev server port** — Never hardcode `localhost:3000`
   - First check port 3000
   - If unavailable, check port 3001
   - If unavailable, check port 3002
   - If none available, return clear error message

2. **Error messaging** — If dev server not detected:
   ```
   Error: Could not connect to dev server
   Make sure to run: npm run dev
   ```

3. **Port detection function** — All scripts use `detectPort()`:
   ```javascript
   async function detectPort() {
     const http = require('http');
     for (let port of [3000, 3001, 3002]) {
       try {
         await new Promise((resolve, reject) => {
           const req = http.get(`http://localhost:${port}/`, (res) => {
             resolve(port);
           });
           req.on('error', reject);
           req.setTimeout(500);
         });
         return port;
       } catch {
         continue;
       }
     }
     throw new Error('Dev server not found. Run: npm run dev');
   }
   ```

### Manual Review

Every page is reviewed for:

- Compliance with DESIGN_SYSTEM.md
- Anti-pattern violations
- Component consistency
- Visual integrity

### Script Maintenance Rules

**RULE:** No verification script may hardcode `localhost:3000`.

**RULE:** If a script hardcodes any port, it blocks deployment.

**RULE:** All scripts must use port detection or fail with clear error message.

---

## ESCALATION

If a page cannot comply with the design system:

1. **Document the problem** — Why can't system solve this?
2. **Request waiver** — Justify the exception
3. **Propose system enhancement** — How should system change?
4. **Get approval** — Design + product + eng sign off
5. **Update documentation** — Prevent future confusion

Waivers are rare and documented.

---

## FINAL RULE

**The design system is not:**

- A starting point
- A suggestion
- A framework to improve upon
- A source of inspiration

**The design system is:**

- The specification
- The law
- The institutional standard
- The authority

Pages implement it. They do not innovate within it.

---

**Last Updated:** 2026-05-25  
**Authority:** RunPayway™ Product & Design Leadership  
**Status:** LOCKED (Changes require institutional approval)
