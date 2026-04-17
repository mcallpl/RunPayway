"use client";

import Link from "next/link";

const C = {
  navy: "#1C1635",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  white: "#FFFFFF",
  muted: "rgba(14,26,43,0.55)",
  border: "rgba(14,26,43,0.08)",
};

const ANGLES: Record<string, { label: string; headline: string; body: string; cta: string }> = {
  suite: {
    label: "TAKE CONTROL",
    headline: "Stop Guessing. Start Building.",
    body: "Every day without a plan is a day your income stays vulnerable. Your report gives you the exact roadmap — and these tools make it actionable. The longer you wait, the more you leave to chance.",
    cta: "Get Your Report — From $69",
  },
  pressuremap: {
    label: "YOUR INCOME IS EXPOSED",
    headline: "You Just Saw the Risks. Now Fix Them.",
    body: "Your PressureMap™ shows where your income is most exposed. Your report tells you exactly what to do about each one.",
    cta: "Get Your Personalized Report — From $69",
  },
  simulator: {
    label: "THESE NUMBERS ARE REAL",
    headline: "You Saw What Could Change. Make It Happen.",
    body: "The Simulator showed you exactly how much your score could improve. Without a report, those projections stay theoretical. Your report turns them into a step-by-step plan with real deadlines and real accountability.",
    cta: "Turn Projections Into Action — From $69",
  },
  dashboard: {
    label: "PROGRESS REQUIRES A STARTING POINT",
    headline: "You Cannot Track What You Have Not Measured.",
    body: "Your dashboard tracks how your score changes over time. It starts when you take the assessment.",
    cta: "Establish Your Baseline — From $69",
  },
};

export default function SuiteCTA({ page }: { page: "suite" | "pressuremap" | "simulator" | "dashboard" }) {
  const angle = ANGLES[page];

  return (
    <div style={{
      textAlign: "center",
      padding: "48px 24px",
      borderRadius: 16,
      background: "linear-gradient(135deg, rgba(75,63,174,0.06) 0%, rgba(31,109,122,0.04) 100%)",
      border: `1px solid ${C.border}`,
      maxWidth: 640,
      margin: "0 auto",
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
        textTransform: "uppercase" as const,
        color: C.purple, marginBottom: 16,
      }}>
        {angle.label}
      </div>
      <h2 style={{
        fontSize: 24, fontWeight: 600, color: C.navy,
        lineHeight: 1.2, marginBottom: 12,
      }}>
        {angle.headline}
      </h2>
      <p style={{
        fontSize: 15, color: C.muted, lineHeight: 1.65,
        maxWidth: 500, margin: "0 auto 24px",
      }}>
        {angle.body}
      </p>
      <Link href="/pricing" style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        height: 52, padding: "0 36px", borderRadius: 12,
        background: `linear-gradient(135deg, ${C.navy} 0%, ${C.purple} 100%)`,
        color: C.white, fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em",
        boxShadow: "0 4px 20px rgba(14,26,43,0.15)",
        textDecoration: "none",
      }}>
        {angle.cta} &rarr;
      </Link>
    </div>
  );
}
