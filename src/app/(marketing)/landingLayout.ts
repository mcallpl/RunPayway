/* ================================================================ */
/* LANDING PAGE LAYOUT SYSTEM                                        */
/* Spacing, sizing, and responsive breakpoints                     */
/* ================================================================ */

export const landingLayout = {
  /* Container sizing */
  maxWidth: 1100,
  maxWidthMobile: 375,
  minWidthDesktop: 1024,
  breakpoint: 768,

  /* Horizontal padding (gutters) */
  gutter: {
    desktop: 40,
    tablet: 32,
    mobile: 20,
  },

  /* Section vertical padding */
  sectionPadding: {
    desktop: 80,
    tablet: 60,
    mobile: 56,
  },

  /* Grid gaps */
  gap: {
    tight: 16,      // Between inline elements
    normal: 24,     // Between cards
    loose: 32,      // Between major card groups
    section: 48,    // Between sections
  },

  /* Border radius values */
  borderRadius: {
    sm: 8,          // Buttons, compact elements
    md: 12,         // Cards, standard elements
    lg: 20,         // Large featured elements
  },

  /* Shadows */
  shadows: {
    none: "none",
    card: "0 4px 16px rgba(14,26,43,0.08)",
    button: "0 8px 24px rgba(14,26,43,0.12)",
    elevated: "0 12px 32px rgba(14,26,43,0.16)",
    hover: "0 16px 40px rgba(14,26,43,0.20)",
    dark: "0 10px 30px rgba(0,0,0,0.20)",
  },

  /* Transitions & animations */
  transitions: {
    fast: "200ms cubic-bezier(0.22, 1, 0.36, 1)",
    normal: "300ms cubic-bezier(0.22, 1, 0.36, 1)",
    slow: "600ms cubic-bezier(0.22, 1, 0.36, 1)",
  },

  /* Hover effects */
  hoverTransform: {
    button: "translateY(-2px)",
    card: "translateY(-4px)",
  },

  /* Typography sizing (responsive) */
  typography: {
    heroDisplay: {
      desktop: 56,
      mobile: 40,
    },
    h2: {
      desktop: 40,
      mobile: 28,
    },
    h3: {
      desktop: 20,
      mobile: 18,
    },
    body: {
      desktop: 15,
      mobile: 14,
    },
  },

  /* CTA Button sizing */
  buttons: {
    primary: {
      height: 48,
      paddingX: 32,
      fontSize: 15,
      borderRadius: 8,
    },
    large: {
      height: 56,
      paddingX: 40,
      fontSize: 16,
      borderRadius: 8,
    },
    small: {
      height: 40,
      paddingX: 20,
      fontSize: 13,
      borderRadius: 6,
    },
  },

  /* Icon sizing */
  icons: {
    small: 24,
    medium: 32,
    large: 48,
    xlarge: 64,
    stroke: 2,
  },

  /* Grid system */
  grid: {
    desktop: {
      cols2: "repeat(2, 1fr)",
      cols3: "repeat(3, 1fr)",
      colsAuto: "repeat(auto-fit, minmax(280px, 1fr))",
    },
    mobile: {
      cols1: "1fr",
    },
  },

  /* Responsive breakpoints */
  breakpoints: {
    xs: 375,
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
  },

  /* Z-index scale */
  zIndex: {
    base: 0,
    dropdown: 100,
    sticky: 500,
    fixed: 1000,
    modal: 2000,
    tooltip: 3000,
  },
} as const;

/* Helper function to get responsive value */
export const responsive = (mobile: number, desktop: number) => ({
  mobile,
  desktop,
});

/* Helper function to apply layout styles */
export function applyLayoutStyles(width: number) {
  const isMobile = width <= landingLayout.breakpoints.md;
  return {
    maxWidth: landingLayout.maxWidth,
    margin: "0 auto",
    padding: isMobile
      ? `0 ${landingLayout.gutter.mobile}px`
      : `0 ${landingLayout.gutter.desktop}px`,
  };
}

/* Selector styles */
export const selectorStyles = {
  container: {
    backgroundColor: "#FFFFFF",
    borderBottom: "1px solid #EAEAEA",
    position: "sticky" as const,
    top: 0,
    zIndex: landingLayout.zIndex.sticky,
    padding: "16px 40px",
  },
  buttonGroup: {
    display: "flex" as const,
    gap: 12,
    flex: 1,
  },
  button: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer" as const,
    transition: landingLayout.transitions.fast,
    border: "none",
    minHeight: 60,
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    gap: 4,
    textAlign: "center" as const,
  },
} as const;

export default landingLayout;
