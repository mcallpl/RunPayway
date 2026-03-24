"use client";

import Link from "next/link";

/* ── Shared simulator teaser — CSS-rendered mini UI preview ── */

const DISPLAY = "'DM Serif Display', Georgia, serif";
const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1A7A6D",
};

export default function SimulatorTeaser({ variant = "default" }: { variant?: "default" | "compact" | "dark-on-light" }) {
  const isDarkOnLight = variant === "dark-on-light";
  const isCompact = variant === "compact";

  return (
    <div style={{
      background: B.navy,
      borderRadius: 16,
      padding: isCompact ? "24px 24px 20px" : "32px 32px 28px",
      position: "relative",
      overflow: "hidden",
      border: isDarkOnLight ? "1px solid rgba(14,26,43,0.08)" : "1px solid rgba(244,241,234,0.06)",
      boxShadow: isDarkOnLight ? "0 8px 32px rgba(14,26,43,0.12)" : "none",
    }}>
      {/* Accent bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${B.teal}, ${B.purple}, ${B.teal})` }} />

      {/* Ambient glow */}
      <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, background: `radial-gradient(circle, rgba(75,63,174,0.12) 0%, transparent 70%)`, pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isCompact ? 16 : 20 }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.teal }}>Score Simulator&#8482;</div>
          <div style={{ fontSize: 8, color: "rgba(244,241,234,0.25)", letterSpacing: "0.06em", marginTop: 2 }}>MODEL RP-2.0</div>
        </div>
        <div style={{ fontSize: 8, color: "rgba(244,241,234,0.20)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>LIVE PREVIEW</div>
      </div>

      {/* Mini score triptych */}
      <div style={{ display: "flex", gap: 2, borderRadius: 8, overflow: "hidden", marginBottom: isCompact ? 12 : 16 }}>
        {[
          { label: "CURRENT", value: "48", color: "#F4F1EA" },
          { label: "SIMULATED", value: "62", color: B.teal },
          { label: "IMPACT", value: "+14", color: B.teal },
        ].map(col => (
          <div key={col.label} style={{ flex: 1, background: "rgba(244,241,234,0.04)", padding: isCompact ? "10px 8px" : "14px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.10em", color: "rgba(244,241,234,0.25)", marginBottom: 4 }}>{col.label}</div>
            <div style={{ fontSize: isCompact ? 18 : 22, fontWeight: 300, color: col.color, fontFamily: DISPLAY, lineHeight: 1 }}>{col.value}</div>
          </div>
        ))}
      </div>

      {/* Mini classification bar */}
      <div style={{ display: "flex", height: 4, borderRadius: 2, overflow: "hidden", marginBottom: isCompact ? 12 : 16 }}>
        <div style={{ flex: 30, backgroundColor: "rgba(220,74,74,0.25)" }} />
        <div style={{ flex: 20, backgroundColor: "rgba(212,148,10,0.25)" }} />
        <div style={{ flex: 25, backgroundColor: "rgba(59,130,246,0.6)" }} />
        <div style={{ flex: 25, backgroundColor: "rgba(26,122,109,0.25)" }} />
        {/* Indicator dot */}
        <div style={{ position: "absolute", left: `calc(32px + ${isCompact ? "50%" : "52%"})`, marginTop: isCompact ? 82 : 102 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#FFFFFF", border: `2px solid ${B.teal}`, boxShadow: `0 0 6px rgba(26,122,109,0.4)`, transform: "translateX(-50%)" }} />
        </div>
      </div>

      {/* Mini timeline curve */}
      {!isCompact && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.10em", color: "rgba(75,63,174,0.60)", marginBottom: 8, textTransform: "uppercase" as const }}>INCOME TIMELINE</div>
          <svg viewBox="0 0 300 50" style={{ width: "100%", height: 40 }}>
            <defs>
              <linearGradient id="teaserGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={B.teal} stopOpacity="0.3" />
                <stop offset="100%" stopColor={B.teal} stopOpacity="1" />
              </linearGradient>
              <linearGradient id="teaserArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={B.teal} stopOpacity="0.12" />
                <stop offset="100%" stopColor={B.teal} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M 10,38 L 80,30 L 180,20 L 290,10" fill="none" stroke="url(#teaserGrad)" strokeWidth="2" strokeLinecap="round" />
            <path d="M 10,38 L 80,30 L 180,20 L 290,10 L 290,50 L 10,50 Z" fill="url(#teaserArea)" />
            <circle cx="10" cy="38" r="3" fill="#F4F1EA" stroke={B.navy} strokeWidth="1.5" />
            <circle cx="80" cy="30" r="3" fill={B.teal} stroke={B.navy} strokeWidth="1.5" />
            <circle cx="180" cy="20" r="3" fill={B.teal} stroke={B.navy} strokeWidth="1.5" />
            <circle cx="290" cy="10" r="3" fill={B.teal} stroke={B.navy} strokeWidth="1.5" />
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
            {["NOW", "3 MO", "6 MO", "12 MO"].map(l => (
              <span key={l} style={{ fontSize: 7, color: "rgba(244,241,234,0.20)", fontWeight: 600 }}>{l}</span>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <Link href="/pricing" style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: isCompact ? "10px 16px" : "12px 20px",
        borderRadius: 8,
        background: "linear-gradient(135deg, rgba(244,241,234,0.08), rgba(244,241,234,0.04))",
        border: "1px solid rgba(244,241,234,0.10)",
        textDecoration: "none",
        gap: 8,
      }}>
        <span style={{ fontSize: isCompact ? 11 : 12, fontWeight: 600, color: "#F4F1EA", letterSpacing: "-0.01em" }}>
          Included with your report
        </span>
        <span style={{ fontSize: 12, color: "rgba(244,241,234,0.35)" }}>&rarr;</span>
      </Link>
    </div>
  );
}
