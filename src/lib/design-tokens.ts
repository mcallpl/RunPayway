// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Shared Design Tokens
// Single source of truth for all page styling.
// Matches landing page design language: RP-2.0 brand system.
// ═══════════════════════════════════════════════════════════════

// ─── COLORS ─────────────────────────────────────────────────

export const C = {
  navy: "#1C1635",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  white: "#FFFFFF",
  amber: "#C49A6C",
  muted: "rgba(14,26,43,0.68)",
  light: "rgba(14,26,43,0.52)",
  border: "rgba(14,26,43,0.08)",
  softBorder: "#EAEAEA",

  // Band colors
  bandLimited: "#9B2C2C",
  bandDeveloping: "#92640A",
  bandEstablished: "#2B5EA7",
  bandHigh: "#1F6D7A",

  // Dark palette (for navy sections)
  sandText: "#F4F1EA",
  sandMuted: "rgba(244,241,234,0.65)",
  sandLight: "rgba(244,241,234,0.50)",
  sandBorder: "rgba(255,255,255,0.08)",
} as const;

// ─── TYPOGRAPHY ─────────────────────────────────────────────

export const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';
export const sans = "'Inter', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";

export const T = {
  h1: {
    desktop: { fontSize: 56, fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.02em" },
    mobile: { fontSize: 36, fontWeight: 600, lineHeight: 1.12, letterSpacing: "-0.02em" },
  },
  h2: {
    desktop: { fontSize: 40, fontWeight: 600, lineHeight: 1.18, letterSpacing: "-0.02em" },
    mobile: { fontSize: 28, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.02em" },
  },
  h3: {
    desktop: { fontSize: 24, fontWeight: 500, lineHeight: 1.28 },
    mobile: { fontSize: 20, fontWeight: 500, lineHeight: 1.3 },
  },
  body: {
    desktop: { fontSize: 18, fontWeight: 400, lineHeight: 1.65, letterSpacing: "-0.01em" },
    mobile: { fontSize: 16, fontWeight: 400, lineHeight: 1.6 },
  },
  bodySm: {
    desktop: { fontSize: 16, fontWeight: 400, lineHeight: 1.6 },
    mobile: { fontSize: 15, fontWeight: 400, lineHeight: 1.6 },
  },
  meta: { fontSize: 14, fontWeight: 400, lineHeight: 1.45 } as const,
  micro: { fontSize: 13, fontWeight: 400, lineHeight: 1.45 } as const,
  label: { fontSize: 14, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const } as const,
} as const;

// ─── SPACING ────────────────────────────────────────────────

export const sp = (n: number) => n * 8;

export const maxW = 1080;
export const padX = { desktop: 40, mobile: 20 };
export const textMax = 720;

export const secPad = (m: boolean) => m ? sp(12) : sp(17.5);
export const px = (m: boolean) => m ? padX.mobile : padX.desktop;

// ─── RESPONSIVE HELPERS ─────────────────────────────────────

export const h1 = (m: boolean) => m ? T.h1.mobile : T.h1.desktop;
export const h2Style = (m: boolean) => m ? T.h2.mobile : T.h2.desktop;
export const h3Style = (m: boolean) => m ? T.h3.mobile : T.h3.desktop;
export const body = (m: boolean) => m ? T.body.mobile : T.body.desktop;
export const bodySm = (m: boolean) => m ? T.bodySm.mobile : T.bodySm.desktop;

// ─── COMPONENT STYLES ───────────────────────────────────────

export const cardStyle = {
  borderRadius: 12,
  border: `1px solid ${C.softBorder}`,
  backgroundColor: C.white,
  boxShadow: "0 1px 3px rgba(14,26,43,0.04)",
} as const;

export const ctaButton = {
  display: "inline-flex" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  height: 56,
  padding: "0 40px",
  borderRadius: 8,
  backgroundColor: C.navy,
  color: C.white,
  fontSize: 16,
  fontWeight: 600,
  textDecoration: "none" as const,
  border: "none",
  cursor: "pointer" as const,
  transition: "background-color 200ms ease",
} as const;

export const ctaButtonLight = {
  ...ctaButton,
  backgroundColor: C.white,
  color: C.navy,
} as const;

// ─── NAV STYLES ─────────────────────────────────────────────

export const navStyle = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  backgroundColor: "rgba(14,26,43,0.92)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
} as const;

// ─── UTILITIES ──────────────────────────────────────────────

export const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

export function bandColor(score: number): string {
  return score >= 75 ? C.bandHigh : score >= 50 ? C.bandEstablished : score >= 30 ? C.bandDeveloping : C.bandLimited;
}
