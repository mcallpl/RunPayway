# RunPayway Accessibility Implementation Guide

**Version:** 1.0
**Standard:** WCAG 2.1 Level AA
**Last Updated:** April 9, 2026

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Accessibility Profiles](#accessibility-profiles)
3. [Granular Adjustment Controls](#granular-adjustment-controls)
4. [CSS Override Strategy](#css-override-strategy)
5. [Component Implementation](#component-implementation)
6. [State Management & Persistence](#state-management--persistence)
7. [Keyboard & Screen Reader Support](#keyboard--screen-reader-support)
8. [Integration Guide](#integration-guide)
9. [Compliance Checklist](#compliance-checklist)
10. [Design Tokens & Icons](#design-tokens--icons)

---

## Architecture Overview

The accessibility system consists of three layers:

```
┌─────────────────────────────────────────────┐
│  Layer 1: React Component                    │
│  AccessibilityWidget.tsx                     │
│  - Floating trigger button (bottom-left)     │
│  - Panel with Profiles + Adjustments tabs    │
│  - State management + localStorage           │
│  - Renders via createPortal into <body>      │
├─────────────────────────────────────────────┤
│  Layer 2: CSS Override Rules                 │
│  globals.css (appended block)                │
│  - Profile classes on <html>                 │
│  - Granular control classes on <html>        │
│  - All use !important to beat inline styles  │
│  - Widget exemption rules                    │
├─────────────────────────────────────────────┤
│  Layer 3: DOM Application                    │
│  applyToDOM() function                       │
│  - Adds/removes classes on <html>            │
│  - Injects <style> tag for compound zoom     │
│  - Counter-zooms the widget itself           │
└─────────────────────────────────────────────┘
```

### Key Decisions

- **Portal rendering**: Widget renders via `createPortal(widget, document.body)` to isolate it from app DOM and CSS cascade
- **Class-based overrides**: All visual changes applied via CSS classes on `<html>`, using `!important` to override inline styles
- **Compound zoom**: Font size and content scale both use CSS `zoom` on `<body>`, computed as `fontZoom * scaleZoom`
- **Profile vs. granular**: Activating a profile resets all granular controls. Changing any granular control deactivates the active profile.

---

## Accessibility Profiles

Seven one-click presets. Only one can be active at a time (radio behavior).

### 1. Seizure Safe

**Class:** `html.a11y-profile-seizure-safe`

**What it does:**
- Kills ALL animations and transitions on every element (`animation: none !important; transition: none !important`)
- Reduces contrast extremes (`filter: contrast(0.9)`)

**CSS:**
```css
html.a11y-profile-seizure-safe *,
html.a11y-profile-seizure-safe *::before,
html.a11y-profile-seizure-safe *::after {
  animation: none !important;
  transition: none !important;
}
html.a11y-profile-seizure-safe {
  filter: contrast(0.9) !important;
}
```

**Icon:** Lightning bolt with strike-through (disabled flash)

---

### 2. Vision Impaired

**Class:** `html.a11y-profile-vision-impaired`

**What it does:**
- Increases contrast (`filter: contrast(1.3)`)
- Zooms page to 115%
- Underlines and bolds all links

**CSS:**
```css
html.a11y-profile-vision-impaired {
  filter: contrast(1.3) !important;
  zoom: 1.15 !important;
}
html.a11y-profile-vision-impaired a {
  text-decoration: underline !important;
  font-weight: bold !important;
}
```

**Icon:** Eye with iris

---

### 3. ADHD Friendly

**Class:** `html.a11y-profile-adhd`

**What it does:**
- Stops all motion (sets animation/transition duration to 0.01ms)
- Desaturates colors (`filter: saturate(0.6)`)

**CSS:**
```css
html.a11y-profile-adhd *,
html.a11y-profile-adhd *::before,
html.a11y-profile-adhd *::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}
html.a11y-profile-adhd {
  filter: saturate(0.6) !important;
}
```

**Icon:** Clock face (focus/time)

---

### 4. Cognitive Disability

**Class:** `html.a11y-profile-cognitive`

**What it does:**
- Zooms page to 110%
- Increases line height to 1.8x
- Widens letter spacing to 0.03em
- Adds word spacing of 0.1em

**CSS:**
```css
html.a11y-profile-cognitive {
  zoom: 1.1 !important;
}
html.a11y-profile-cognitive * {
  line-height: 1.8 !important;
  letter-spacing: 0.03em !important;
  word-spacing: 0.1em !important;
}
```

**Icon:** Lightbulb (thought/clarity)

---

### 5. Keyboard Navigation

**Class:** `html.a11y-profile-keyboard`

**What it does:**
- Enhanced focus ring: 3px solid orange (#ff6600)
- 4px offset from element edge
- Orange glow shadow for visibility

**CSS:**
```css
html.a11y-profile-keyboard *:focus-visible {
  outline: 3px solid #ff6600 !important;
  outline-offset: 4px !important;
  box-shadow: 0 0 0 6px rgba(255, 102, 0, 0.25) !important;
}
```

**Icon:** Keyboard with keys

---

### 6. Screen Reader

**Class:** `html.a11y-profile-screenreader`

**What it does:**
- Makes skip-to-content links permanently visible
- Enhances landmark structure (primarily JS-driven via ARIA attributes)

**CSS:**
```css
html.a11y-profile-screenreader .skip-link {
  position: absolute !important;
  top: 8px !important;
  left: 8px !important;
  z-index: 100000 !important;
  padding: 12px 24px !important;
  background: #0E1A2B !important;
  color: #fff !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  text-decoration: underline !important;
  clip: auto !important;
  width: auto !important;
  height: auto !important;
  overflow: visible !important;
}
```

**Icon:** Headphones with sound waves

---

### 7. Older Adults

**Class:** `html.a11y-profile-older`

**What it does:**
- Zooms page to 112%
- Widens letter spacing to 0.02em
- Increases minimum touch target size to 52px

**CSS:**
```css
html.a11y-profile-older {
  zoom: 1.12 !important;
  letter-spacing: 0.02em !important;
}
html.a11y-profile-older button,
html.a11y-profile-older a,
html.a11y-profile-older [role="button"] {
  min-height: 52px !important;
}
```

**Icon:** Person figure with arms extended

---

## Granular Adjustment Controls

These are independent of profiles. Changing any granular control deactivates the active profile.

### Font Size

6 steps using CSS `zoom` on `<body>`:

| Step | Value | Zoom Factor | Label |
|------|-------|-------------|-------|
| -2   | 0.85  | 85%         | A-    |
| -1   | 0.92  | 92%         | A     |
| 0    | 1.00  | 100%        | A (default) |
| +1   | 1.10  | 110%        | A+    |
| +2   | 1.20  | 120%        | A++   |
| +3   | 1.35  | 135%        | A+++  |

Applied via injected `<style>` tag (not CSS class), because it compounds with content scale.

### Line Height

| Class | Value | Label |
|-------|-------|-------|
| `a11y-lh-compact` | 1.3 | Compact |
| *(no class)* | inherit | Default |
| `a11y-lh-relaxed` | 1.8 | Relaxed |
| `a11y-lh-spacious` | 2.2 | Spacious |

```css
html.a11y-lh-compact *  { line-height: 1.3 !important; }
html.a11y-lh-relaxed *  { line-height: 1.8 !important; }
html.a11y-lh-spacious * { line-height: 2.2 !important; }
```

### Letter Spacing

| Class | Value | Label |
|-------|-------|-------|
| `a11y-ls-tight` | -0.01em | Tight |
| *(no class)* | inherit | Default |
| `a11y-ls-wide` | 0.08em | Wide |

```css
html.a11y-ls-tight * { letter-spacing: -0.01em !important; }
html.a11y-ls-wide *  { letter-spacing: 0.08em !important; }
```

### Content Scale

4 options via CSS `zoom` on `<body>`, compounded with font size:

| Value | Zoom |
|-------|------|
| 90%   | 0.90 |
| 100%  | 1.00 |
| 110%  | 1.10 |
| 120%  | 1.20 |

**Compound formula:** `body { zoom: fontZoom * (contentScale / 100) }`

Applied via injected `<style id="a11y-zoom-style">` tag. The widget itself gets a counter-zoom: `[data-a11y-widget] { zoom: 1/combined }`.

### Color Modes

| Class | Effect | Method |
|-------|--------|--------|
| *(no class)* | Default | — |
| `a11y-color-dark` | Dark mode | `filter: invert(0.9) hue-rotate(180deg)` on `<html>`, re-invert media |
| `a11y-color-saturated` | Vivid/high saturation | `filter: saturate(2)` |
| `a11y-color-mono` | Grayscale | `filter: grayscale(1)` |

```css
html.a11y-color-dark {
  filter: invert(0.9) hue-rotate(180deg) !important;
}
html.a11y-color-dark img,
html.a11y-color-dark video,
html.a11y-color-dark svg,
html.a11y-color-dark canvas {
  filter: invert(1) hue-rotate(180deg) !important;
}
html.a11y-color-saturated { filter: saturate(2) !important; }
html.a11y-color-mono      { filter: grayscale(1) !important; }
```

### Text Color Override

| Class | Color | Label |
|-------|-------|-------|
| *(no class)* | inherit | Default |
| `a11y-text-light` | #f0f0f0 | Light |
| `a11y-text-dark` | #111111 | Dark |
| `a11y-text-blue` | #1a3a6b | Blue |

```css
html.a11y-text-light * { color: #f0f0f0 !important; }
html.a11y-text-dark *  { color: #111 !important; }
html.a11y-text-blue *  { color: #1a3a6b !important; }
```

---

## CSS Override Strategy

### Why `!important`

The RunPayway codebase uses inline `style={}` props on React components. Inline styles have higher specificity than any CSS class. The **only** way to override inline styles from CSS is `!important`.

### Specificity Chain

```
Inline style          → specificity: 1,0,0,0
html.a11y-* selector  → specificity: 0,0,1,1 (class + element)
!important             → overrides everything regardless of specificity
```

### Wildcard `*` Selectors

Used for broad coverage (line-height, letter-spacing, text-color). Performance impact is negligible in modern browsers.

### Widget Self-Exemption

The widget renders via `createPortal` into `document.body` and carries a `data-a11y-widget` attribute. CSS exemption rules prevent the widget from being affected by its own overrides:

```css
[data-a11y-widget] {
  filter: none !important;
}
html[class*="a11y-color-"] [data-a11y-widget],
html[class*="a11y-color-"] [data-a11y-widget] * {
  filter: none !important;
}
html[class*="a11y-text-"] [data-a11y-widget] *,
html[class*="a11y-profile-"] [data-a11y-widget] * {
  color: inherit !important;
  line-height: inherit !important;
  letter-spacing: inherit !important;
  word-spacing: inherit !important;
  animation: revert !important;
  transition: revert !important;
}
```

### Print Styles

```css
@media print {
  [data-a11y-widget] { display: none !important; }
}
```

---

## Component Implementation

### File: `AccessibilityWidget.tsx`

```
Location: src/components/AccessibilityWidget.tsx
Type: "use client" component
Rendering: createPortal into document.body
Dependencies: React only (no external packages)
```

### State Interface

```typescript
interface A11yState {
  profile: string | null;     // Active profile ID or null
  fontSize: number;           // -2 to +3 (0 = default)
  lineHeight: string;         // "default" | "compact" | "relaxed" | "spacious"
  letterSpacing: string;      // "default" | "tight" | "wide"
  contentScale: number;       // 90 | 100 | 110 | 120
  colorMode: string;          // "default" | "dark" | "saturated" | "mono"
  textColor: string;          // "default" | "light" | "dark" | "blue"
}
```

### DOM Application Function

```typescript
function applyToDOM(state: A11yState) {
  const html = document.documentElement;

  // 1. Preserve non-a11y classes on <html>
  const existing = html.className.split(" ").filter(c => c && !c.startsWith("a11y-"));
  const a11y: string[] = [];

  // 2. Build class list from state
  if (state.profile) a11y.push(`a11y-profile-${state.profile}`);
  if (state.lineHeight !== "default") a11y.push(`a11y-lh-${state.lineHeight}`);
  if (state.letterSpacing !== "default") a11y.push(`a11y-ls-${state.letterSpacing}`);
  if (state.colorMode !== "default") a11y.push(`a11y-color-${state.colorMode}`);
  if (state.textColor !== "default") a11y.push(`a11y-text-${state.textColor}`);

  // 3. Apply classes
  html.className = [...existing, ...a11y].join(" ");

  // 4. Compute compound zoom (font size + content scale)
  const fontZoomMap = { [-2]: 0.85, [-1]: 0.92, 0: 1, 1: 1.1, 2: 1.2, 3: 1.35 };
  const fontZoom = fontZoomMap[state.fontSize] || 1;
  const scaleZoom = state.contentScale / 100;
  const combined = fontZoom * scaleZoom;

  // 5. Inject/update zoom style tag
  let styleEl = document.getElementById("a11y-zoom-style");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "a11y-zoom-style";
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = combined !== 1
    ? `body { zoom: ${combined} !important; } [data-a11y-widget] { zoom: ${1 / combined} !important; }`
    : "";
}
```

### Profile vs. Granular Interaction Logic

```typescript
// Activating a profile resets all granular controls
const setProfile = (id: string) => {
  setState(prev => ({
    ...DEFAULT_STATE,
    profile: prev.profile === id ? null : id,
  }));
};

// Changing a granular control deactivates the active profile
const update = (partial: Partial<A11yState>) => {
  setState(prev => ({
    ...prev,
    ...partial,
    profile: null,  // deactivate profile on granular change
  }));
};
```

### Component Structure

```
<div data-a11y-widget>
  ├── <div aria-live="polite">          // Screen reader announcements
  ├── <button>                          // Floating trigger (bottom-left)
  └── <div role="dialog">              // Panel (when open)
       ├── Header
       │    ├── Title + WCAG badge
       │    ├── Close button
       │    └── Tab bar [Profiles | Adjustments]
       ├── Content (scrollable)
       │    ├── Profiles tab: 7 profile toggle cards
       │    └── Adjustments tab: 6 control groups
       ├── Footer
       │    ├── Reset All button
       │    └── Hide Widget button
       └── Keyboard shortcut hint
```

---

## State Management & Persistence

### localStorage Key

```
Key: "rp_a11y_prefs"
Value: JSON-serialized A11yState object
```

### Lifecycle

1. **On mount**: Read from `localStorage`, apply to DOM
2. **On state change**: Save to `localStorage`, apply to DOM
3. **On reset**: Write `DEFAULT_STATE` to `localStorage`, clear DOM classes

### Cookie Banner Coordination

The widget checks for `localStorage.getItem("rp_cookie_consent")`:
- **Not set** (banner visible): Widget trigger positioned at `bottom: 90px`
- **Set** (banner dismissed): Widget trigger positioned at `bottom: 24px`

A 1-second polling interval detects when the banner is dismissed and adjusts position.

---

## Keyboard & Screen Reader Support

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt+A` | Toggle widget panel open/closed (also restores hidden widget) |
| `Escape` | Close panel, return focus to trigger button |
| `Tab` | Navigate between controls (focus-trapped within panel) |
| `Shift+Tab` | Navigate backwards |
| `Enter/Space` | Activate buttons |

### Focus Management

- **On open**: Focus moves to first interactive element in panel
- **Focus trap**: Tab wraps from last to first element (and vice versa with Shift+Tab)
- **On close**: Focus returns to trigger button

### Screen Reader

- Trigger button: `aria-label="Accessibility settings"`, `aria-expanded={open}`
- Panel: `role="dialog"`, `aria-label="Accessibility settings"`, `aria-modal="true"`
- Profile buttons: `aria-pressed={active}`
- Control buttons: `aria-pressed={active}`, `aria-label` on font size steps
- Live region: `aria-live="polite"` announces profile changes

---

## Integration Guide

### Adding to a New Layout

```tsx
// 1. Import the component
import AccessibilityWidget from "@/components/AccessibilityWidget";

// 2. Place it at the end of your layout, before the closing wrapper
export default function Layout({ children }) {
  return (
    <div>
      <header>...</header>
      <main>{children}</main>
      <footer>...</footer>
      <AccessibilityWidget />   {/* <-- Add here */}
    </div>
  );
}
```

### Required CSS

Append the accessibility CSS override block to your global stylesheet. The full block is ~160 lines covering:
- 7 profile class rule sets
- 3 line-height classes
- 2 letter-spacing classes
- 3 color mode classes
- 3 text color classes
- Widget exemption rules
- Print hide rule

### Positioning

| Element | Position | Z-Index |
|---------|----------|---------|
| Widget trigger | `fixed, bottom: 24px, left: 24px` | 9998 |
| Widget panel | `fixed, bottom: 80px, left: 24px` | 9998 |
| Cookie banner | `fixed, bottom: 0` | 9999 |

---

## Compliance Checklist

### WCAG 2.1 Level AA Requirements Met

| Criterion | Description | Implementation |
|-----------|-------------|----------------|
| 1.1.1 | Non-text content has alt text | All SVG icons have descriptive labels |
| 1.3.1 | Info and relationships conveyed through structure | Semantic HTML, ARIA roles |
| 1.4.1 | Color not sole means of conveying info | Icons + text labels on all controls |
| 1.4.3 | Contrast ratio 4.5:1 minimum | Vision Impaired profile boosts contrast |
| 1.4.4 | Text resizable to 200% | Font size control goes to 135%, content scale to 120% |
| 1.4.10 | Content reflows at 320px | All layouts tested at 320px width |
| 1.4.12 | Text spacing adjustable | Line height, letter spacing controls |
| 2.1.1 | Keyboard accessible | Full keyboard navigation, Alt+A shortcut |
| 2.1.2 | No keyboard trap | Escape closes panel, Tab wraps naturally |
| 2.4.1 | Skip navigation | Skip-to-content link in all layouts |
| 2.4.3 | Focus order logical | Tab order follows visual layout |
| 2.4.7 | Focus visible | Enhanced focus indicators, Keyboard profile |
| 2.5.5 | Target size 44x44px minimum | Enforced via CSS, Older Adults profile ups to 52px |
| 3.2.1 | On focus, no context change | No auto-navigation on focus |
| 4.1.2 | Name, role, value exposed | ARIA attributes on all interactive elements |

### Seizure Prevention (WCAG 2.3)

- Seizure Safe profile eliminates all animation
- `prefers-reduced-motion` media query respected globally
- No content flashes more than 3 times per second

### Screen Reader Compatibility

- Tested landmarks: `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`
- `aria-label` on all sections and navigation elements
- `aria-live="polite"` for dynamic content announcements
- `role="dialog"` with `aria-modal` for the widget panel

---

## Design Tokens & Icons

### Colors Used in Widget

| Token | Hex | Usage |
|-------|-----|-------|
| Navy | `#0E1A2B` | Trigger button background, text |
| Purple | `#4B3FAE` | Active profile indicator, active controls |
| Teal | `#1F6D7A` | — |
| Muted | `#7B848E` | Descriptions, inactive labels |
| Border | `rgba(14,26,43,0.08)` | Card and control borders |
| Keyboard Focus | `#ff6600` | Enhanced focus ring (Keyboard profile) |

### Custom SVG Icons

All icons are inline SVGs at 18x18px viewBox, rendered inside 36x36px rounded badge containers. Stroke-based, no fills. Color changes on active state via `stroke` prop.

| Profile | Icon Description | SVG Concept |
|---------|-----------------|-------------|
| Seizure Safe | Lightning bolt with strike-through | Disabled flash |
| Vision Impaired | Eye with iris circle | Vision/sight |
| ADHD Friendly | Circle with clock hands | Focus/time |
| Cognitive | Lightbulb form | Thought/clarity |
| Keyboard Nav | Rectangle with key dots + space bar | Keyboard |
| Screen Reader | Headphones with connecting path | Audio/listening |
| Older Adults | Person figure with extended limbs | Accessibility person |

### Widget Trigger Icon

Universal accessibility symbol — person figure in circle, 22x22px SVG, white stroke on navy background.

---

## Security & Privacy

- **No external requests**: All accessibility logic runs client-side only
- **localStorage only**: Preferences stored in browser, never transmitted to server
- **No tracking**: Widget usage is not tracked or logged
- **No PII**: State contains only preference values, no user identifiers
- **Encryption**: Preferences are plain JSON in localStorage (non-sensitive data); all page transport encrypted via HTTPS

---

## Future Expansion

### Planned Enhancements

- **Reading guide**: Horizontal highlight bar that follows cursor (Cognitive profile)
- **Reading mask**: Dims everything except current paragraph (ADHD profile)
- **Dictionary/tooltip**: Hover-to-define for complex financial terms
- **Voice navigation**: Speech-to-command for hands-free operation
- **Custom color picker**: User-defined text/background color pairs
- **Multi-language labels**: Widget UI in user's selected language
- **Sync across devices**: Store preferences server-side for authenticated users

### Adding a New Profile

1. Add entry to `PROFILES` array in `AccessibilityWidget.tsx`
2. Add `ProfileIcon` SVG case for the new ID
3. Add CSS rules under `html.a11y-profile-{id}` in `globals.css`
4. No other changes needed — the state management and DOM application handle it automatically

### Adding a New Granular Control

1. Add field to `A11yState` interface and `DEFAULT_STATE`
2. Add `<ToggleRow>` in the Adjustments tab
3. Add CSS classes in `globals.css`
4. Add class mapping in `applyToDOM()` function
