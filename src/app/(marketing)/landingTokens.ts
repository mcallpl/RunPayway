/* ================================================================ */
/* LANDING PAGE DESIGN TOKENS                                        */
/* Premium design system for $200K+ desktop landing page             */
/* ================================================================ */

/* PREMIUM TYPOGRAPHY SCALE */
export const T = {
  /* Hero Display — Section entry points */
  heroDisplay: {
    fontSize: 56,
    fontWeight: 600,
    letterSpacing: "-0.04em",
    lineHeight: 1.1,
  },

  /* Section Headline (H2) — Major sections */
  h2: {
    fontSize: 40,
    fontWeight: 600,
    letterSpacing: "-0.03em",
    lineHeight: 1.2,
    marginBottom: 40,
  },

  /* Card/Subsection Headline (H3) */
  h3: {
    fontSize: 20,
    fontWeight: 600,
    letterSpacing: "-0.01em",
    lineHeight: 1.3,
    marginBottom: 16,
  },

  /* Body text — Primary readable content */
  body: {
    fontSize: 15,
    fontWeight: 400,
    lineHeight: 1.6,
    color: "#5E6873",
  },

  /* Body Large — Subheadings, emphasis */
  bodyLg: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.6,
  },

  /* Small — Secondary content, stats */
  small: {
    fontSize: 13,
    fontWeight: 400,
    lineHeight: 1.5,
    color: "#5E6873",
  },

  /* Meta/Label — Uppercase metadata, badges */
  meta: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "#1F6D7A",
  },

  /* Micro — Smallest text, fine print */
  micro: {
    fontSize: 11,
    fontWeight: 400,
    lineHeight: 1.4,
    color: "#7B848E",
  },
} as const;

/* COLOR PALETTE */
export const COLORS = {
  /* Primary */
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",

  /* Backgrounds */
  white: "#FFFFFF",
  sand: "#F4F1EA",
  panelFill: "#F8F6F1",

  /* Text */
  textPrimary: "#131A22",
  textSecondary: "#5E6873",
  textMuted: "#7B848E",

  /* UI Elements */
  borderSoft: "#D9D6CF",
  divider: "#EAEAEA",

  /* Status */
  risk: "#C74634",
  moderate: "#D0A23A",
  established: "#1F6D7A",
  protected: "#2A6E49",

  /* Dark section text */
  sandText: "#F4F1EA",
  sandMuted: "rgba(244,241,234,0.55)",
  sandLight: "rgba(244,241,234,0.40)",
  sandBorder: "rgba(255,255,255,0.08)",
} as const;

/* COLOR APPLICATION RULES */
export const colorRules = {
  /* Text */
  text: COLORS.textPrimary,
  textSecondary: COLORS.textSecondary,
  textOnDark: COLORS.sandText,

  /* Backgrounds */
  bgLight: COLORS.white,
  bgMuted: COLORS.panelFill,
  bgDark: COLORS.navy,

  /* Interactive */
  ctaPrimary: COLORS.navy,
  ctaSecondary: COLORS.teal,
  accent: COLORS.teal,

  /* Borders */
  border: COLORS.borderSoft,
  divider: COLORS.divider,

  /* Hover/Focus */
  hover: COLORS.purple,
  focus: COLORS.purple,
} as const;

/* SPACING SCALE (8px grid) */
export const sp = (n: number) => `${n * 8}px`;

export const spacing = {
  xs: "8px",   // sp(1)
  sm: "16px",  // sp(2)
  md: "24px",  // sp(3)
  lg: "32px",  // sp(4)
  xl: "40px",  // sp(5)
  xxl: "48px", // sp(6)
  section: "80px",  // Section vertical padding (desktop)
  sectionMobile: "56px", // Section vertical padding (mobile)
} as const;

/* LAYOUT SYSTEM */
export const layout = {
  /* Container widths */
  maxWidth: 1100,
  maxWidthMobile: 375,

  /* Padding */
  paddingDesktop: 40,
  paddingMobile: 20,

  /* Section padding */
  sectionPaddingDesktop: 80,
  sectionPaddingMobile: 56,

  /* Grid gaps */
  gap: {
    tight: "16px",
    normal: "24px",
    loose: "32px",
    section: "48px",
  },

  /* Border radius */
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 20,
  },
} as const;

/* SHADOWS */
export const shadows = {
  none: "none",
  card: "0 4px 16px rgba(14,26,43,0.08)",
  button: "0 8px 24px rgba(14,26,43,0.12)",
  elevated: "0 12px 32px rgba(14,26,43,0.16)",
  hover: "0 16px 40px rgba(14,26,43,0.20)",
} as const;

/* TRANSITIONS */
export const transitions = {
  fast: "200ms cubic-bezier(0.22, 1, 0.36, 1)",
  normal: "300ms cubic-bezier(0.22, 1, 0.36, 1)",
  slow: "600ms cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

/* PREMIUM UTILITIES */
export const premium = {
  /* Card base styling */
  cardStyle: {
    backgroundColor: COLORS.white,
    borderRadius: `${layout.borderRadius.md}px`,
    border: `1px solid ${COLORS.borderSoft}`,
    boxShadow: shadows.card,
    transition: `box-shadow ${transitions.normal}, transform ${transitions.normal}`,
  },

  /* Button base styling */
  buttonStyle: {
    borderRadius: `${layout.borderRadius.sm}px`,
    fontWeight: 600,
    fontSize: 15,
    letterSpacing: "-0.01em",
    transition: `all ${transitions.fast}`,
    cursor: "pointer",
  },

  /* CTA button primary */
  ctaButtonPrimary: {
    backgroundColor: COLORS.navy,
    color: COLORS.white,
    border: "none",
    boxShadow: shadows.button,
  },

  /* CTA button secondary (on dark) */
  ctaButtonSecondary: {
    backgroundColor: "transparent",
    color: COLORS.white,
    border: `2px solid ${COLORS.white}`,
    boxShadow: "none",
  },
} as const;

/* ICON SPECIFICATIONS */
export const iconSpecs = {
  size: {
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
  },
  stroke: 2,
  color: {
    default: COLORS.navy,
    active: COLORS.teal,
    muted: "rgba(14,26,43,0.5)",
  },
} as const;

/* EXPORT COMPLETE DESIGN TOKEN OBJECT */
export const landingDesignTokens = {
  typography: T,
  colors: COLORS,
  colorRules,
  spacing,
  layout,
  shadows,
  transitions,
  premium,
  iconSpecs,
} as const;
