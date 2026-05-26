# RunPayway™ Navigation Governance

**Scalable Navigation Architecture for 100+ Pages**

Navigation structure should guide users through institutional content without feeling prescriptive or limiting future growth. This document defines principles for header/footer design that scale.

---

## CORE NAVIGATION PHILOSOPHY

Navigation is not decoration. It is information architecture.

RunPayway™ navigation should:

- **Be minimal** — Only essentials visible without scrolling
- **Be clear** — No mystery about where links go
- **Be institutional** — Feel like an established framework, not a startup
- **Be consistent** — Same structure across all pages
- **Scale gracefully** — Accommodate 100+ pages without degrading UX
- **Prioritize user decision-making** — Help users find what they need to make decisions

---

## PRIMARY NAVIGATION (HEADER)

### Structure Principles

**Minimal by Default**
- Target range: 4–6 primary navigation items maximum
- Each item should represent a major content cluster, not a single page
- Avoid proliferation of links; group related content under items
- Logo always links to homepage

**Current Primary Navigation:**
1. **Home** — Destination: `/`
2. **How It Works** — Destination: `/how-it-works` (Methodology explanation)
3. **Methodology** — Destination: `/methodology` (Future, detailed methodology)
4. **Learn** — Destination: `/learn` (Concept hub; expandable via dropdown if needed)
5. **Contact** — Destination: `/contact` (Contact form or page)

**This is not fixed.** If new major content clusters emerge, they can be added via governance review.

### Header Behavior

**Desktop (1024px+):**
- Sticky header (stays visible on scroll)
- Logo + Primary navigation items (left/center alignment)
- CTA button (right side)
- Height: 80-100px with comfortable padding
- All navigation items visible without dropdown (initially)

**Tablet (768px - 1023px):**
- Sticky header, slightly reduced padding
- Logo + 3-4 most important items visible
- Hamburger menu reveals secondary items if needed
- CTA button remains visible or moves to menu

**Mobile (<768px):**
- Sticky header with logo + hamburger menu
- All navigation items in expandable menu
- CTA button in menu or sticky at bottom
- Hamburger menu toggles on tap

### Navigation Item Behavior

**Active State:**
- Underline or subtle color change (Navy hover color)
- Shows current page section
- Applied to primary navigation item matching current page

**Hover State (Desktop):**
- Subtle color change to Purple
- No animation required; instant color change
- Text remains same weight

**Focus State (Accessibility):**
- Visible outline for keyboard navigation
- Use system outline or clear focus indicator

**Dropdowns (Optional Future):**
- If /learn expands to multiple subcategories, can add dropdown
- Dropdown appears on hover (desktop) or tap (mobile)
- Items in dropdown follow same formatting as primary nav
- Dropdowns close on blur or tap outside

### CTA Button Position

**Desktop:**
- Right side of header
- Button label: "Get Started" or "Schedule Demo" (governance + product decision)
- Uses PrimaryButton component (Navy, Purple hover)
- Same height as header (approximately 50-60px)

**Mobile:**
- Option 1: In hamburger menu as prominent item
- Option 2: Sticky button at bottom of screen
- Whichever approach minimizes distraction

### Scaling Navigation

**When new major content clusters emerge:**
- Document the new cluster and its size (estimated pages)
- Propose header navigation update
- Get approval from product + design leadership
- Update this document
- Test at all breakpoints
- Deploy with baseline screenshot update

**Rule:** Avoid adding navigation items reactively. Plan for scale.

---

## FOOTER GOVERNANCE

### Structure Principles

**Minimal and Functional**
- Footer provides secondary navigation and legal compliance
- Not a dumping ground for links
- Content organized in logical columns
- Clear visual hierarchy

### Footer Layout

**Desktop (1024px+):**
- 3-4 column layout
- Column max-width: 200px
- Consistent spacing between columns (80px)
- Copyright and social icons at bottom
- Footer background: Light gray (#F9FAFB) or Navy with Sand text (optional)

**Tablet (768px - 1023px):**
- 2-column layout
- Columns may expand width slightly
- Same spacing principles
- Copyright and social at bottom

**Mobile (<768px):**
- Single column layout
- Each footer section expandable (optional accordion on mobile)
- Links stack vertically
- Copyright and social at very bottom

### Footer Columns (Recommended Structure)

**Column 1: Company**
- About
- Contact
- Careers (if applicable)
- Blog (if applicable)

**Column 2: Product**
- How It Works
- Methodology
- Verification Environments (Individual, Advisor, Organization)
- API Documentation (if applicable)

**Column 3: Resources**
- Learn (concepts)
- Use Cases
- FAQ
- Documentation

**Column 4: Legal**
- Privacy Policy
- Terms of Service
- Security
- Compliance (if applicable)

### Footer Link Rules

**DO:**
- Use descriptive link text ("How It Works" not "Learn More")
- Organize links logically by column
- Link to actual pages (no `href="#"`)
- Keep links current (remove dead links immediately)
- Use consistent capitalization (Title Case for link text)

**DO NOT:**
- Create links to non-existent pages
- Use vague link labels ("Click Here," "More")
- Exceed 4 columns without design review
- Add decorative elements (icons, images)
- Use footer for marketing promotions

### Footer Contact Information

**Email Display:**
- Show email address as link (if preferred)
- Format: support@runpayway.com or similar
- Make it clickable (mailto: link)

**Phone (Optional):**
- If displayed, use clickable phone link (tel:)
- Mobile: phone link converts to native dialer

**Social Icons (Optional):**
- LinkedIn only (primary professional platform)
- Twitter (optional secondary)
- No Facebook, Instagram, TikTok links (off-brand)
- Use simple icon design (monochrome, 20-24px)
- Icons link to actual profiles, not fake accounts

### Footer Copyright

**Standard Format:**
```
© [YEAR] RunPayway™. All rights reserved.
```

**Auto-update Year:**
- JavaScript auto-updates current year
- Never hardcode year (outdates immediately)

### Footer Background & Typography

**Light Theme Footer (Default):**
- Background: #F9FAFB (light gray)
- Text: #0E1A2B (Navy)
- Links: Navy, Purple on hover
- Same typography rules as header

**Dark Theme Footer (Optional):**
- Background: #0E1A2B (Navy)
- Text: #F4F1EA (Sand)
- Links: Sand, Sand light on hover
- Sufficient contrast maintained

---

## NAVIGATION GOVERNANCE RULES

### Rules That Don't Change

1. **Logo always links to home** — Never exception
2. **Header must be sticky** — Helps users navigate when scrolled down
3. **Footer must include copyright** — Legal requirement
4. **All links must be live** — No `href="#"`
5. **Navigation must be keyboard accessible** — WCAG compliance
6. **Mobile navigation must be clear** — Hamburger menu or tabs

### Rules That Can Evolve

1. **Primary nav item count** — Target 4-6, but can adjust with approval
2. **Navigation item order** — Can change as content grows
3. **Footer column count** — 3-4 is standard, can adjust
4. **Social icon selection** — LinkedIn required, others optional
5. **Header height** — 80-100px range, can adjust slightly
6. **CTA button text** — Can change based on campaign/season

### Governance Decision Process

**For navigation changes:**
1. Document the proposed change and reason
2. Sketch impact on all breakpoints
3. Test on real devices if possible
4. Get approval from product + design leadership
5. Update this document
6. Make change across all pages
7. Update baseline screenshots
8. Deploy together

---

## HEADER/FOOTER COMPONENT USAGE

### MarketingHeader Component

```tsx
<MarketingHeader
  items={[
    { label: "Home", href: "/" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Learn", href: "/learn" },
    { label: "Contact", href: "/contact" },
  ]}
  cta={{ label: "Get Started", href: "/begin" }}
  currentPath={pathname}
/>
```

**Component responsibilities:**
- Render logo (always links to /)
- Render nav items with active state
- Show CTA button
- Handle mobile hamburger menu
- Sticky on scroll
- Maintain responsive behavior

### MarketingFooter Component

```tsx
<MarketingFooter
  columns={[
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ]
    },
    // ... other columns
  ]}
  copyright="© 2026 RunPayway™. All rights reserved."
/>
```

**Component responsibilities:**
- Render column structure
- Stack responsively (2-col on tablet, 1-col on mobile)
- Show copyright with auto-updated year
- Optional social icons
- Maintain spacing tokens

---

## ACTIVE STATES & NAVIGATION CONTEXT

### Current Page Active State

**How to determine:**
- Compare `pathname` (current URL) with link `href`
- If match, apply active styling

**Active styling:**
- Underline below link text (1-2px)
- Or subtle color change to Purple
- Text weight remains same (don't bold)

**Example:**
```tsx
const isActive = pathname === "/how-it-works";
<a
  href="/how-it-works"
  style={{
    borderBottom: isActive ? "2px solid #4B3FAE" : "none",
    color: isActive ? "#4B3FAE" : "#0E1A2B",
  }}
>
  How It Works
</a>
```

### Breadcrumb Navigation (Optional)

**When to use:**
- Deep content hierarchies (e.g., /learn/[category]/[concept])
- Multi-level use cases
- Advisor/organization management sections

**Format:**
```
Home > Learn > Income Stability
```

**Styling:**
- Small text (14px)
- Gray color (#7B848E)
- Links are Navy with Purple hover
- Separator: forward slash (/)

---

## SITE MAP & NAVIGATION HIERARCHY

### Current Content Hierarchy (Expected)

```
Home (/)
├── How It Works (/how-it-works)
├── Methodology (/methodology) [future]
├── Learn (/learn)
│   ├── Income Stability
│   ├── Income Structure
│   ├── Structural Verification
│   └── [other concepts]
├── Use Cases (/use-cases)
│   ├── Mortgage Qualification
│   ├── Career Transitions
│   └── [other use cases]
├── Verify (/verify)
│   ├── Individual
│   ├── Advisor
│   └── Organization
└── Contact (/contact)
```

**As site grows:**
- Learn section may have subsections
- Use Cases may expand significantly
- Verify may have additional paths
- New major sections may be added

**Navigation response:**
- Single dropdown under /learn (if many concepts)
- Single dropdown under /use-cases (if many use cases)
- Keep primary nav count at 4-6 items

---

## MOBILE NAVIGATION PATTERN

### Hamburger Menu Structure

**Default (Closed):**
- Logo left
- Hamburger icon right
- CTA button above/below menu or in menu

**Expanded (Open):**
- Full-screen overlay (typical mobile pattern)
- Logo at top (logo clickable to close menu and go home)
- Primary nav items vertically stacked
- Dropdowns expandable
- CTA button prominent (top or bottom)
- Close button or tap-outside to close

**UX Rules:**
- Menu expands smoothly (not jarring)
- Tapping link navigates AND closes menu
- Tapping link doesn't navigate? Menu stays open to user interaction
- Escape key closes menu (accessibility)
- Focus trap within menu (accessibility)

---

## FUTURE NAVIGATION SCALING

**As RunPayway™ grows to 100+ pages:**

1. **Don't add everything to header** — Keep primary nav at 4-6 items
2. **Use dropdowns strategically** — Organize content under main items
3. **Create content hubs** — /learn, /use-cases, /verify are content hubs, not single pages
4. **Plan information architecture** — Decide URL structure before building 20 new pages
5. **Test navigation frequently** — User testing at each major site expansion
6. **Update baseline screenshots** — Navigation changes are layout changes

**Approval process:**
- Navigation changes require product + design review
- Changes must be tested on real devices
- Documentation must be updated
- Baseline screenshots must be regenerated

---

## NAVIGATION PRINCIPLES SUMMARY

| Principle | Implementation | Why |
|-----------|----------------|-----|
| Minimal | 4-6 primary nav items | Users aren't overwhelmed; site stays focused |
| Clear | Descriptive link text | Users know where links go |
| Consistent | Same header/footer all pages | Users develop mental model |
| Scalable | Dropdowns for growth | Can accommodate 100+ pages |
| Institutional | Calm, professional styling | Reflects RunPayway™ authority |
| Accessible | Keyboard navigation, focus states | Users with assistive tech can navigate |

---

**Last Updated:** 2026-05-25  
**Authority:** RunPayway™ Governance  
**Status:** Active (Changes require product + design review)
