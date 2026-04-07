// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Shared Design Tokens
// Single source of truth for all page styling.
// Matches landing page design language: RP-2.0 brand system.
// ═══════════════════════════════════════════════════════════════

// ─── COLORS ─────────────────────────────────────────────────

export const C = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  white: "#FFFFFF",
  amber: "#C49A6C",

  // Text hierarchy
  textPrimary: "#131A22",
  textSecondary: "#5E6873",
  textMuted: "#7B848E",
  borderSoft: "#D9D6CF",
  panelFill: "#F8F6F1",

  // Legacy aliases (used by non-landing pages)
  muted: "rgba(14,26,43,0.68)",
  light: "rgba(14,26,43,0.62)",
  border: "rgba(14,26,43,0.08)",
  softBorder: "#EAEAEA",

  // Band colors
  bandLimited: "#C74634",
  bandDeveloping: "#D0A23A",
  bandEstablished: "#2B5EA7",
  bandHigh: "#1F6D7A",

  // Status accents
  risk: "#C74634",
  moderate: "#D0A23A",
  established: "#1F6D7A",
  protected: "#2A6E49",

  // Dark palette (for navy sections)
  sandText: "#F4F1EA",
  sandMuted: "rgba(244,241,234,0.55)",
  sandLight: "rgba(244,241,234,0.40)",
  sandBorder: "rgba(255,255,255,0.08)",
} as const;

// ─── TYPOGRAPHY ─────────────────────────────────────────────

export const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';
export const sans = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export const T = {
  heroDisplay: {
    desktop: { fontSize: 72, fontWeight: 700, lineHeight: 0.98, letterSpacing: "-0.045em" },
    mobile: { fontSize: 48, fontWeight: 700, lineHeight: 0.98, letterSpacing: "-0.045em" },
  },
  h1: {
    desktop: { fontSize: 52, fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.035em" },
    mobile: { fontSize: 34, fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.035em" },
  },
  h2: {
    desktop: { fontSize: 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em" },
    mobile: { fontSize: 28, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em" },
  },
  h3: {
    desktop: { fontSize: 24, fontWeight: 600, lineHeight: 1.28 },
    mobile: { fontSize: 20, fontWeight: 600, lineHeight: 1.3 },
  },
  bodyLg: {
    desktop: { fontSize: 24, fontWeight: 400, lineHeight: 1.45 },
    mobile: { fontSize: 20, fontWeight: 400, lineHeight: 1.45 },
  },
  body: {
    desktop: { fontSize: 18, fontWeight: 400, lineHeight: 1.6 },
    mobile: { fontSize: 18, fontWeight: 400, lineHeight: 1.6 },
  },
  bodySm: {
    desktop: { fontSize: 16, fontWeight: 400, lineHeight: 1.6 },
    mobile: { fontSize: 15, fontWeight: 400, lineHeight: 1.6 },
  },
  label: { fontSize: 16, fontWeight: 600, lineHeight: 1.35 } as const,
  eyebrow: { fontSize: 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const } as const,
  meta: { fontSize: 14, fontWeight: 500, lineHeight: 1.45 } as const,
  micro: { fontSize: 13, fontWeight: 400, lineHeight: 1.45 } as const,
} as const;

// ─── SPACING ────────────────────────────────────────────────

export const sp = (n: number) => n * 8;

export const maxW = 1200;
export const innerW = 1120;
export const padX = { desktop: 48, mobile: 20 };
export const textMax = 720;
export const heroMax = 860;
export const explanatoryMax = 640;

export const secPad = (m: boolean) => m ? 72 : 120;
export const px = (m: boolean) => m ? padX.mobile : padX.desktop;

// ─── RESPONSIVE HELPERS ─────────────────────────────────────

export const heroDisplay = (m: boolean) => m ? T.heroDisplay.mobile : T.heroDisplay.desktop;
export const h1 = (m: boolean) => m ? T.h1.mobile : T.h1.desktop;
export const h2Style = (m: boolean) => m ? T.h2.mobile : T.h2.desktop;
export const h3Style = (m: boolean) => m ? T.h3.mobile : T.h3.desktop;
export const bodyLg = (m: boolean) => m ? T.bodyLg.mobile : T.bodyLg.desktop;
export const body = (m: boolean) => m ? T.body.mobile : T.body.desktop;
export const bodySm = (m: boolean) => m ? T.bodySm.mobile : T.bodySm.desktop;

// ─── COMPONENT STYLES ───────────────────────────────────────

export const cardStyle = {
  borderRadius: 20,
  border: `1px solid rgba(14,26,43,0.08)`,
  backgroundColor: C.white,
  boxShadow: "0 10px 30px rgba(14,26,43,0.06)",
} as const;

export const ctaButton = {
  display: "inline-flex" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  height: 60,
  padding: "0 32px",
  borderRadius: 14,
  backgroundColor: C.navy,
  color: C.white,
  fontSize: 18,
  fontWeight: 600,
  textDecoration: "none" as const,
  border: "none",
  cursor: "pointer" as const,
  boxShadow: "0 8px 24px rgba(14,26,43,0.12)",
  transition: "transform 200ms, box-shadow 200ms",
} as const;

export const ctaButtonLight = {
  ...ctaButton,
  backgroundColor: C.white,
  color: C.navy,
  boxShadow: "0 8px 24px rgba(14,26,43,0.08)",
  border: `1px solid ${C.borderSoft}`,
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
  return score >= 75 ? C.protected : score >= 50 ? C.bandEstablished : score >= 30 ? C.moderate : C.risk;
}
