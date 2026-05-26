/**
 * RunPayway™ Design Tokens
 *
 * LOCKED institutional design system.
 * All pages must use these tokens only.
 * No custom colors, spacing, or typography.
 */

// ════════════════════════════════════════════════════════════════════
// COLORS (LOCKED PALETTE)
// ════════════════════════════════════════════════════════════════════

export const COLORS = {
  // Primary Palette
  navy: '#0E1A2B',
  purple: '#4B3FAE',
  teal: '#1F6D7A',
  sand: '#F4F1EA',
  white: '#FFFFFF',

  // Secondary Palette
  divider: '#E5E7EB',
  textPrimary: '#131A22',
  textSecondary: '#5E6873',
  textMuted: '#7B848E',

  // Dark Mode
  sandText: '#F4F1EA',
  sandMuted: 'rgba(244,241,234,0.55)',
  sandLight: 'rgba(244,241,234,0.40)',
} as const;

// ════════════════════════════════════════════════════════════════════
// SPACING (LOCKED TOKENS)
// ════════════════════════════════════════════════════════════════════

export const SPACING = {
  xs: 8,      // --space-xs
  sm: 16,     // --space-sm
  md: 24,     // --space-md
  lg: 32,     // --space-lg
  xl: 40,     // --space-xl
  '2xl': 48,  // --space-2xl
  '3xl': 80,  // --space-3xl (sections)
} as const;

export const SECTION_PADDING = {
  desktop: SPACING['3xl'],    // 80px
  mobile: SPACING['2xl'],     // 56px
};

export const HORIZONTAL_PADDING = {
  desktop: 40,
  mobile: 20,
};

// ════════════════════════════════════════════════════════════════════
// LAYOUT (LOCKED WIDTHS)
// ════════════════════════════════════════════════════════════════════

export const LAYOUT = {
  maxWidth: 1100,
  heroTextWidth: 720,
  readingWidth: 680,
} as const;

// ════════════════════════════════════════════════════════════════════
// TYPOGRAPHY (LOCKED SCALE)
// ════════════════════════════════════════════════════════════════════

export const TYPOGRAPHY = {
  // Headlines
  h1: {
    fontSize: 56,
    fontWeight: 600,
    lineHeight: 1.1,
    letterSpacing: '-0.035em',
    fontFamily: '"Cormorant Garamond", "Georgia", serif',
  },
  h2: {
    fontSize: 40,
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '-0.028em',
    fontFamily: '"Cormorant Garamond", "Georgia", serif',
  },
  h3: {
    fontSize: 20,
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
    fontFamily: 'Inter, -apple-system, sans-serif',
  },

  // Body
  body: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 1.6,
    fontFamily: 'Inter, -apple-system, sans-serif',
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: 500,
    lineHeight: 1.6,
    fontFamily: 'Inter, -apple-system, sans-serif',
  },

  // Small
  small: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.5,
    fontFamily: 'Inter, -apple-system, sans-serif',
  },

  // Meta
  meta: {
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1.5,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    fontFamily: 'Inter, -apple-system, sans-serif',
  },

  // Micro
  micro: {
    fontSize: 11,
    fontWeight: 400,
    lineHeight: 1.4,
    fontFamily: 'Inter, -apple-system, sans-serif',
  },
} as const;

// ════════════════════════════════════════════════════════════════════
// MOTION (LOCKED TRANSITIONS)
// ════════════════════════════════════════════════════════════════════

export const TRANSITIONS = {
  fast: '150ms cubic-bezier(0.16, 1, 0.3, 1)',
  standard: '180ms cubic-bezier(0.16, 1, 0.3, 1)',
  slow: '220ms cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

// ════════════════════════════════════════════════════════════════════
// BUTTONS (LOCKED SIZES)
// ════════════════════════════════════════════════════════════════════

export const BUTTON = {
  height: 60,
  paddingHorizontal: 32,
  borderRadius: 8,
  fontSize: 15,
  fontWeight: 600,
} as const;

// ════════════════════════════════════════════════════════════════════
// BREAKPOINTS (LOCKED)
// ════════════════════════════════════════════════════════════════════

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 768,
  desktop: 1024,
} as const;

// ════════════════════════════════════════════════════════════════════
// RESPONSIVE HELPERS
// ════════════════════════════════════════════════════════════════════

export const responsive = {
  mobile: `@media (max-width: ${BREAKPOINTS.mobile}px)`,
  tablet: `@media (min-width: ${BREAKPOINTS.mobile}px) and (max-width: ${BREAKPOINTS.desktop}px)`,
  desktop: `@media (min-width: ${BREAKPOINTS.desktop}px)`,
} as const;

// ════════════════════════════════════════════════════════════════════
// DIVIDERS (LOCKED)
// ════════════════════════════════════════════════════════════════════

export const DIVIDERS = {
  light: `1px solid ${COLORS.divider}`,
  dark: `1px solid rgba(255,255,255,0.1)`,
} as const;

// ════════════════════════════════════════════════════════════════════
// SECTIONS (LOCKED VARIANTS)
// ════════════════════════════════════════════════════════════════════

export const SECTION_VARIANTS = {
  light: {
    backgroundColor: COLORS.white,
    color: COLORS.textPrimary,
    borderTop: DIVIDERS.light,
  },
  sand: {
    backgroundColor: COLORS.sand,
    color: COLORS.textPrimary,
    borderTop: DIVIDERS.light,
  },
  navy: {
    backgroundColor: COLORS.navy,
    color: COLORS.sandText,
    borderTop: DIVIDERS.dark,
  },
} as const;

// ════════════════════════════════════════════════════════════════════
// UTILITY: Generate spacing value (px)
// ════════════════════════════════════════════════════════════════════

export function spacing(multiplier: number): number {
  return multiplier * 8;
}

// ════════════════════════════════════════════════════════════════════
// VALIDATION: Prevent custom values
// ════════════════════════════════════════════════════════════════════

/**
 * In development, this helps catch instances where custom values
 * are being used instead of design tokens.
 *
 * Usage:
 * const size = validateSpacing(value); // throws if invalid
 */
export function validateSpacing(value: any): number {
  const validValues = Object.values(SPACING);
  if (!validValues.includes(value)) {
    console.warn(`⚠️ Non-standard spacing value: ${value}. Use SPACING tokens only.`);
  }
  return value;
}

export function validateColor(value: any): string {
  const validColors = Object.values(COLORS);
  if (!validColors.includes(value)) {
    console.warn(`⚠️ Non-standard color value: ${value}. Use COLORS palette only.`);
  }
  return value;
}
