# RunPayway™ Design System

**Institutional Design Standard for 100+ Pages**

This document is the authoritative source for RunPayway™ visual and structural consistency. All pages must comply with these standards.

---

## CORE PHILOSOPHY

RunPayway™ must feel like:

- A financial verification standard
- An institutional framework
- A deterministic methodology
- A structural measurement system
- An infrastructure layer

NOT:

- A consumer app
- Startup SaaS
- Trendy fintech
- "AI product" styled
- Marketing-driven design

---

## COLORS

### Primary Palette (LOCKED)

| Name | Hex | Purpose |
|------|-----|---------|
| Structural Navy | #0E1A2B | Primary text, headlines, buttons |
| Diagnostic Purple | #4B3FAE | Hover states, accents, secondary CTAs |
| Structural Teal | #1F6D7A | Section labels, metadata, institutional markers |
| Warm Sand | #F4F1EA | Section backgrounds, premium feel |
| White | #FFFFFF | Primary background |

### Secondary Palette (LOCKED)

| Name | Hex | Purpose |
|------|-----|---------|
| Divider Gray | #E5E7EB | Institutional dividers, borders |
| Text Secondary | #5E6873 | Body text, secondary content |
| Text Muted | #7B848E | Tertiary text, hints, metadata |
| Text Dark | #131A22 | Darkest text (headlines) |

### Dark Mode Text

| Name | Value | Purpose |
|------|-------|---------|
| Sand Text | #F4F1EA | Primary text on navy sections |
| Sand Muted | rgba(244,241,234,0.55) | Secondary text on navy |
| Sand Light | rgba(244,241,234,0.40) | Tertiary text on navy |

**NO CUSTOM COLORS.** All pages use locked palette only.

---

## SPACING SYSTEM

### Spacing Tokens (LOCKED)

```
--space-xs:   8px    (sp(1))
--space-sm:   16px   (sp(2))
--space-md:   24px   (sp(3))
--space-lg:   32px   (sp(4))
--space-xl:   40px   (sp(5))
--space-2xl:  48px   (sp(6))
--space-3xl:  80px   (section padding)
```

### Section Rhythm (LOCKED)

- **Section vertical padding:** 80px (desktop), 56px (mobile)
- **Content max-width:** 1100px
- **Reading max-width:** 720px
- **Hero text max-width:** 680px

### Layout Padding (LOCKED)

- **Desktop horizontal:** 40px
- **Mobile horizontal:** 20px

**RULE:** All spacing must use tokens. No arbitrary px values.

---

## TYPOGRAPHY

### Font Stack (LOCKED)

- **Headlines (H1, H2):** Cormorant Garamond, Georgia, serif
- **UI, body, nav:** Inter, -apple-system, sans-serif

### Typography Scale (LOCKED)

| Use | Size | Weight | Line Height | Letter Spacing |
|-----|------|--------|-------------|----------------|
| H1 (Hero) | 56px | 600 | 1.1 | -0.035em |
| H2 (Section) | 40px | 600 | 1.2 | -0.028em |
| H3 (Subsection) | 20px | 600 | 1.3 | -0.01em |
| Body | 16px | 400 | 1.6 | normal |
| Body Large | 18px | 500 | 1.6 | normal |
| Small | 14px | 400 | 1.5 | normal |
| Meta Label | 12px | 700 | 1.5 | 0.08em (uppercase) |
| Micro | 11px | 400 | 1.4 | normal |

**RULE:** No custom font sizes. Use scale only.

---

## COMPONENTS (REQUIRED REUSABLE PRIMITIVES)

All pages must use locked components from `/components/system/`:

### SectionContainer

Wraps all major content sections. Manages background, padding, max-width.

```tsx
<SectionContainer variant="light" spacing="default">
  {children}
</SectionContainer>
```

**Variants:** `light` (white), `sand` (#F4F1EA), `navy` (#0E1A2B)  
**Spacing:** `default` (80px), `compact` (56px)

### SectionLabel

Uppercase section identifier. Teal, 12px, uppercase.

```tsx
<SectionLabel>WHAT THE FRAMEWORK EVALUATES</SectionLabel>
```

### PageHero

Page header with headline, subheadline, body, CTA.

```tsx
<PageHero
  headline="How structural verification works"
  body="RunPayway™ evaluates..."
  cta={{ label: "Start Assessment", href: "/begin" }}
  supportingText="Under 2 minutes · Private · Version-stamped"
/>
```

### InstitutionalDivider

1px divider. Light (#E5E7EB) or dark (rgba white on navy).

```tsx
<InstitutionalDivider variant="light" />
```

### PrimaryButton

Navy background, white text. Purple hover.

```tsx
<PrimaryButton href="/begin">Start Assessment</PrimaryButton>
```

### TextBlock

Reusable text with type (body, bodylg, small, micro) and color (primary, secondary, muted).

```tsx
<TextBlock type="body" color="secondary">
  Supporting text here
</TextBlock>
```

**RULE:** Pages may NOT create custom button or text styles. Use system components.

---

## LAYOUT STRUCTURE (LOCKED)

### Page Width

- **Hero content width:** 720px (centered)
- **Body content width:** 1100px (centered)
- **Reading content width:** 680px (for long-form text)

### Section Rhythm

All pages follow this rhythm:

1. Hero (white, centered content, 720px max)
2. Section 1 (sand or light, 1100px content)
3. Section 2 (alternate color)
4. ...sections alternate light/sand/navy
5. Footer (white, standard layout)

**Each section is bordered top with #E5E7EB divider.**

### Header/Footer (REQUIRED)

Every page must include:

```tsx
<MarketingHeader />
{children}
<MarketingFooter />
```

Header is sticky, 104px, contains logo + nav.
Footer contains links and copyright.

---

## INTERACTION & MOTION (LOCKED)

### Transition Timing

```
--transition-fast: 150ms
--transition-standard: 180ms
--transition-slow: 220ms
```

### Hover States (LOCKED)

- **Navy button hover:** Change to Purple (#4B3FAE)
- **Text link hover:** Change to Navy or Purple
- **Cards:** DO NOT FLOAT. Subtle color changes only.

### Animation Rules (LOCKED)

- **Max duration:** 220ms (opacity + subtle translate only)
- **NO bounce, NO elastic, NO scaling**
- **NO floating cards, NO parallax**
- **Opacity transitions preferred**

Users should barely notice animation. Motion should feel stable and infrastructural.

---

## ANTI-PATTERNS (FORBIDDEN)

❌ **NEVER USE:**

- Gradients (any kind)
- Glassmorphism effects
- Glow effects or neon
- Oversized shadows (> 0 4px 16px)
- Floating/levitating cards
- Parallax scrolling
- Animated backgrounds
- Oversized rounded corners (> 8px typically)
- Startup metric cards
- Playful, cartoon iconography
- Neon or highly saturated colors
- Dense SaaS dashboards
- Feature grid cards
- Marketing CTA explosions
- Testimonial carousels
- Exaggerated animations (bounce, elastic, scale)
- Auto-playing video
- Attention-seeking motion
- Visual clutter

❌ **NEVER START:**

- Custom spacing systems
- Arbitrary margin/padding outside tokens
- New button styles outside system
- New color palette entries
- Custom divider logic
- Alternative section wrappers
- Random typography sizes

---

## GRID SYSTEM (LOCKED)

### Content Grid

For multi-column layouts, use CSS Grid with locked gap sizes:

- **3-column:** `grid-template-columns: repeat(3, 1fr); gap: 24px;`
- **2-column:** `grid-template-columns: 1fr 1fr; gap: 32px;`
- **Responsive:** Collapse to 1 column below 768px

Example:

```tsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 24,
  maxWidth: 1100,
  margin: '0 auto',
}}>
  {items.map(item => <Card key={item.id}>{item}</Card>)}
</div>
```

---

## RESPONSIVE BREAKPOINTS (LOCKED)

- **Desktop:** 1024px+
- **Tablet:** 768px - 1023px
- **Mobile:** < 768px

Behavior at breakpoints:

| Element | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Section padding | 40px | 32px | 20px |
| Section py | 80px | 56px | 56px |
| Max-width | 1100px | 900px | full |
| H1 size | 56px | 48px | 36px |
| Columns | 3 | 2 | 1 |
| Hero width | 720px | 600px | full |

---

## HEADING HIERARCHY (LOCKED)

Every page follows this hierarchy:

- **H1 (Page headline):** 56px Cormorant, Navy, centered
- **H2 (Section headline):** 40px Cormorant, Navy, sometimes centered
- **H3 (Subsection):** 20px Inter, Navy
- **Labels:** 12px Inter uppercase, Teal, 0.08em tracking

Never skip heading levels. Never use color for emphasis—use weight.

---

## CTA BUTTON STANDARDS (LOCKED)

### Primary CTA

- **Height:** 60px
- **Padding:** 0 32px
- **Background:** Navy (#0E1A2B)
- **Text:** White, 15px, weight 600
- **Border:** None
- **Radius:** 8px
- **Hover:** Background to Purple (#4B3FAE)
- **Transition:** 150ms ease
- **Icon:** Arrow (→) optional, 14px size

### Secondary CTA (on dark sections)

- **Background:** Transparent
- **Text:** White, 15px, weight 600
- **Border:** 2px solid white
- **Hover:** Background to white, text to navy (optional)

### Rules

- **One primary CTA per section max** (unless in footer)
- **No gradient buttons**
- **No shadow effects on buttons**
- **Always 60px height** (use height token consistently)
- **Min width 180px** for comfortable clicking

---

## DIVIDER RULES (LOCKED)

- **Light dividers:** 1px solid #E5E7EB (between white sections)
- **Dark dividers:** 1px solid rgba(255,255,255,0.1) (on navy sections)
- **Never oversized** (always 1px)
- **Structural only—no decorative dividers**
- **Top border of new section preferred** over bottom border of previous

---

## DOCUMENTATION REQUIREMENT

Every new page must include in code comments:

```tsx
/**
 * Page: [Name]
 * Design System Compliance:
 * ✓ Uses SectionContainer, SectionLabel, TextBlock from /components/system/
 * ✓ All spacing via tokens (--space-xs through --space-3xl)
 * ✓ Typography from locked scale (H1-H3, body, small, micro)
 * ✓ Colors from locked palette (Navy, Purple, Teal, Sand, Gray)
 * ✓ No custom spacing, colors, components
 * ✓ Responsive breakpoints: 768px, 1024px
 * ✓ Animations < 220ms, opacity-only preferred
 */
```

---

## GOVERNANCE

This document is immutable.

All violations require explicit approval from:
- Design system maintainer
- Product stakeholder

Pages must pass:
- `/scripts/verify-page.js` (content check)
- `/scripts/screenshot-page.js` (visual consistency check)
- Design system compliance audit

---

## FUTURE PAGES CHECKLIST

Before building any new page:

- [ ] Read this document end-to-end
- [ ] Use components from `/components/system/` only
- [ ] Use spacing tokens only
- [ ] Use typography scale only
- [ ] Use locked color palette only
- [ ] No custom styles outside system
- [ ] Test at 768px, 1024px breakpoints
- [ ] Run predeploy scripts
- [ ] Verify no anti-patterns appear
- [ ] Add design system compliance comment
- [ ] Screenshot compare against expectations

---

**Last Updated:** 2026-05-25  
**Authority:** RunPayway™ Design Governance  
**Status:** LOCKED (Changes require explicit approval)
