"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Shared hooks                                                       */
/* ------------------------------------------------------------------ */

const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

function useInView(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return mobile;
}

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1A7A6D",
  sand: "#F5F2EC",
  offWhite: "#FAFAF8",
  muted: "rgba(14,26,43,0.55)",
  light: "rgba(14,26,43,0.38)",
  border: "rgba(14,26,43,0.08)",
  gradient: "linear-gradient(145deg, #0E1A2B 0%, #161430 35%, #3D2F9C 65%, #1A7A6D 100%)",
  bandLimited: "#9B2C2C",
  bandDeveloping: "#92640A",
  bandEstablished: "#2B5EA7",
  bandHigh: "#1A7A6D",
};

const S = {
  sectionY: { desktop: 120, mobile: 72 },
  sectionYsm: { desktop: 80, mobile: 48 },
  transitionY: { desktop: 48, mobile: 32 },
  disclaimerY: { desktop: 20, mobile: 14 },
  maxW: 1060,
  padX: { desktop: 48, mobile: 24 },
  h1mb: 20,
  h2mb: 16,
  subtextMb: 48,
  paraMb: 16,
  labelMb: 12,
  cardPad: { desktop: 32, mobile: 24 },
  cardRadius: 8,
  panelRadius: 12,
  gridGap: 16,
  gridGapSm: 12,
  ctaH: 52,
  ctaHsm: 44,
  ctaPadX: 28,
  ctaRadius: 10,
  lhHeading: 1.08,
  lhBody: 1.6,
  lhDense: 1.45,
  lsHeading: "-0.025em",
  lsHero: "-0.03em",
  lsLabel: "0.10em",
};

const DISPLAY_FONT = "'DM Serif Display', Georgia, serif";


/* ================================================================== */
/* 1. HERO — Dark gradient                                             */
/* ================================================================== */
function Hero() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Methodology Hero"
      style={{
        background: B.gradient,
        position: "relative",
        overflow: "hidden",
        paddingTop: mobile ? 96 : 160,
        paddingBottom: mobile ? 72 : 120,
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');`}</style>
      {/* Dual atmospheric glows */}
      <div style={{ position: "absolute", top: "25%", left: "50%", transform: "translate(-50%, -50%)", width: mobile ? 500 : 900, height: mobile ? 500 : 900, borderRadius: "50%", background: "radial-gradient(circle, rgba(75,63,174,0.18) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-20%", right: "-15%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(26,122,109,0.10) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div
        style={{
          maxWidth: S.maxW,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: 720,
            marginLeft: "auto",
            marginRight: "auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          <div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 4, background: "rgba(75,63,174,0.15)", border: "1px solid rgba(75,63,174,0.25)", marginBottom: 20 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: S.lsLabel, textTransform: "uppercase" as const, color: "rgba(244,241,234,0.50)" }}>Model RP-2.0 &middot; Methodology</span>
          </div>
          <h1
            style={{
              fontSize: mobile ? 32 : 52,
              color: "#F4F1EA",
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHero,
              lineHeight: S.lhHeading,
              marginBottom: S.h1mb,
            }}
          >
            Engineered for precision.<br />Built on fixed rules.
          </h1>
          <p
            style={{
              fontSize: mobile ? 15 : 17,
              color: "rgba(244,241,234,0.55)",
              lineHeight: S.lhBody,
              maxWidth: 540,
              margin: "0 auto 32px",
            }}
          >
            The Income Stability Score&#8482; is a deterministic structural assessment. Every rule is fixed, every result is reproducible. Same inputs always produce the same score.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" as const }}>
            {["20-engine pipeline", "Deterministic", "Fixed rules", "Versioned"].map((t) => (
              <span key={t} style={{ fontSize: 12, color: "rgba(244,241,234,0.30)", letterSpacing: "0.02em" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 2. PURPOSE — White background                                       */
/* ================================================================== */
function Purpose() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Purpose"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div
        style={{
          maxWidth: S.maxW,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
        }}
      >
        <div style={{ display: mobile ? "block" : "flex", gap: 64, alignItems: "flex-start", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(14px)", transition: "opacity 0.6s ease-out, transform 0.6s ease-out" }}>
          <div style={{ flex: 1, marginBottom: mobile ? 32 : 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: S.lsLabel, textTransform: "uppercase" as const, color: B.teal, marginBottom: 12 }}>What It Measures</div>
            <h2 style={{ fontSize: mobile ? 28 : 42, color: B.navy, fontFamily: DISPLAY_FONT, fontWeight: 400, letterSpacing: S.lsHeading, lineHeight: S.lhHeading, marginBottom: S.h2mb }}>
              Not how much you earn. How well it holds up when something changes.
            </h2>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: mobile ? 15 : 16, color: B.muted, lineHeight: S.lhBody, marginBottom: S.paraMb }}>
              The Income Stability Score&#8482; quantifies structural resilience — the architecture of your income, not the amount. Two people earning the same number can have completely different stability profiles.
            </p>
            <p style={{ fontSize: mobile ? 15 : 16, color: B.muted, lineHeight: S.lhBody, margin: 0 }}>
              The model evaluates recurrence, concentration, forward visibility, variability, labor dependence, and income quality — then applies cross-factor interaction rules that capture how weaknesses compound.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 3. SIX DIMENSIONS — Sand background                                 */
/* ================================================================== */
function SixDimensions() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const dimensions = [
    {
      num: "01",
      title: "Repeatable Income",
      desc: "How much of your income comes back without needing to be rebuilt each time.",
      accent: B.teal,
    },
    {
      num: "02",
      title: "Reliance on One Source",
      desc: "How much depends on your single largest client, channel, or source of work.",
      accent: B.purple,
    },
    {
      num: "03",
      title: "Number of Income Sources",
      desc: "How many independent, meaningful sources support the income structure.",
      accent: B.teal,
    },
    {
      num: "04",
      title: "Income Secured Ahead of Time",
      desc: "How much upcoming income is already committed before the month begins.",
      accent: B.purple,
    },
    {
      num: "05",
      title: "Month-to-Month Stability",
      desc: "How consistent the income is from one month to the next.",
      accent: B.teal,
    },
    {
      num: "06",
      title: "Income That Continues Without Daily Work",
      desc: "How much income would keep coming in if active work stopped.",
      accent: B.purple,
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="Six Dimensions"
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div
        style={{
          maxWidth: S.maxW,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
        }}
      >
        <div style={{ maxWidth: 560, marginBottom: mobile ? 32 : 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: S.lsLabel, textTransform: "uppercase" as const, color: B.teal, marginBottom: 12, opacity: visible ? 1 : 0, transition: "opacity 400ms ease-out" }}>The Six Dimensions</div>
          <h2 style={{ fontSize: mobile ? 28 : 42, color: B.navy, fontFamily: DISPLAY_FONT, fontWeight: 400, letterSpacing: S.lsHeading, lineHeight: S.lhHeading, marginBottom: 12, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
            Six structural measures. Fixed rules. No subjectivity.
          </h2>
          <p style={{ fontSize: mobile ? 15 : 16, color: B.muted, lineHeight: S.lhBody, opacity: visible ? 1 : 0, transition: "opacity 600ms ease-out 100ms" }}>
            Each dimension is scored independently and combined into your 0&#8211;100 result.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr", gap: S.gridGap }}>
          {dimensions.map((dim, i) => (
            <div key={dim.num} style={{ background: B.navy, borderRadius: S.cardRadius, padding: mobile ? S.cardPad.mobile : S.cardPad.desktop, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(14px)", transition: `opacity 0.5s ease-out ${i * 60}ms, transform 0.5s ease-out ${i * 60}ms` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: B.teal, letterSpacing: "0.06em" }}>{dim.num}</span>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.35)" }}>{dim.title.split(" ").slice(0, 2).join(" ")}</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: "#F4F1EA", lineHeight: 1.3, letterSpacing: "-0.01em", marginBottom: 10 }}>{dim.title}</h3>
              <p style={{ fontSize: 13, color: "rgba(244,241,234,0.50)", lineHeight: 1.55, margin: 0 }}>{dim.desc}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 12, color: B.light, marginTop: 24, letterSpacing: "0.02em", opacity: visible ? 1 : 0, transition: "opacity 0.5s ease-out 500ms" }}>
          All six dimensions are fixed and versioned under Model RP-2.0.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 4. SCORING FRAMEWORK — White background                             */
/* ================================================================== */
function ScoringFramework() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      aria-label="Scoring Framework"
      style={{
        backgroundColor: B.offWhite,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, margin: "0 auto" }}>
        <div style={{ display: mobile ? "block" : "flex", gap: 64, alignItems: "flex-start", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(14px)", transition: "opacity 0.6s ease-out, transform 0.6s ease-out" }}>

          {/* Left: explanation */}
          <div style={{ flex: 1, marginBottom: mobile ? 32 : 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: S.lsLabel, textTransform: "uppercase" as const, color: B.teal, marginBottom: 12 }}>The Scoring Engine</div>
            <h2 style={{ fontSize: mobile ? 28 : 42, color: B.navy, fontFamily: DISPLAY_FONT, fontWeight: 400, letterSpacing: S.lsHeading, lineHeight: S.lhHeading, marginBottom: S.h2mb }}>
              Two blocks. One score. Zero subjectivity.
            </h2>
            <p style={{ fontSize: mobile ? 15 : 16, color: B.muted, lineHeight: S.lhBody, margin: 0 }}>
              The 20-engine pipeline evaluates your income across two structural blocks, applies cross-factor interaction rules, and produces a single 0&#8211;100 score. Every rule is fixed. The same inputs always produce the same result.
            </p>
          </div>

          {/* Right: visual diagram */}
          <div style={{ flex: 1 }}>
            {/* Structure block */}
            <div style={{ background: B.navy, borderRadius: S.cardRadius, padding: mobile ? S.cardPad.mobile : "28px 28px", marginBottom: 12, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: B.teal }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: B.teal }}>Structure Block</span>
                <span style={{ fontSize: 11, color: "rgba(244,241,234,0.30)" }}>60 of 100</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 8 }}>
                {["Recurring revenue", "Source diversification", "Forward visibility", "Concentration resilience"].map((f) => (
                  <div key={f} style={{ fontSize: 13, color: "rgba(244,241,234,0.55)", display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: B.teal, flexShrink: 0 }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Stability block */}
            <div style={{ background: B.navy, borderRadius: S.cardRadius, padding: mobile ? S.cardPad.mobile : "28px 28px", marginBottom: 12, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: B.purple }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: B.purple }}>Stability Block</span>
                <span style={{ fontSize: 11, color: "rgba(244,241,234,0.30)" }}>40 of 100</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 8 }}>
                {["Labor independence", "Earnings stability", "Income continuity", "Quality adjustment"].map((f) => (
                  <div key={f} style={{ fontSize: 13, color: "rgba(244,241,234,0.55)", display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: B.purple, flexShrink: 0 }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Result arrow */}
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: S.lsLabel, textTransform: "uppercase" as const, color: B.light }}>Structure + Stability + Interactions = Score</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 5. INTERACTION EFFECTS — Sand background                            */
/* ================================================================== */
function InteractionEffects() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const effects = [
    { type: "PENALTY", label: "High concentration + low visibility", desc: "If your top source is 70%+ AND less than 20% is secured ahead of time, both weaknesses compound. The combined risk is worse than the sum.", points: "-8", color: B.bandLimited },
    { type: "PENALTY", label: "High labor + low persistence", desc: "If 75%+ requires daily work AND less than 25% recurs, your income has no safety net. A single disruption cascades.", points: "-7", color: B.bandLimited },
    { type: "BONUS", label: "High persistence + low labor", desc: "If 60%+ recurs AND less than 35% requires daily work, your income compounds. You have real structural independence.", points: "+4", color: B.teal },
    { type: "BONUS", label: "Strong visibility + low concentration", desc: "If 45%+ is committed ahead AND no source exceeds 35%, your income is both predictable and diversified.", points: "+3", color: B.teal },
  ];

  return (
    <section
      ref={ref}
      aria-label="Interaction Effects"
      style={{
        backgroundColor: B.navy,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, margin: "0 auto" }}>
        <div style={{ display: mobile ? "block" : "flex", gap: 64, alignItems: "flex-start", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(14px)", transition: "opacity 0.6s ease-out, transform 0.6s ease-out" }}>

          {/* Left: explanation */}
          <div style={{ flex: 1, marginBottom: mobile ? 32 : 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: S.lsLabel, textTransform: "uppercase" as const, color: B.teal, marginBottom: 12 }}>Cross-Factor Intelligence</div>
            <h2 style={{ fontSize: mobile ? 28 : 42, color: "#F4F1EA", fontFamily: DISPLAY_FONT, fontWeight: 400, letterSpacing: S.lsHeading, lineHeight: S.lhHeading, marginBottom: S.h2mb }}>
              Your weaknesses compound. So do your strengths.
            </h2>
            <p style={{ fontSize: mobile ? 15 : 16, color: "rgba(244,241,234,0.55)", lineHeight: S.lhBody, marginBottom: S.paraMb }}>
              Most tools score factors independently. RunPayway detects when two factors interact — when a weakness in one area makes another area more dangerous, or when two strengths reinforce each other.
            </p>
            <p style={{ fontSize: 12, color: "rgba(244,241,234,0.30)", letterSpacing: "0.02em", margin: 0 }}>
              All interaction rules are fixed, versioned, and documented in the model manifest.
            </p>
          </div>

          {/* Right: interaction examples */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
            {effects.map((ex, i) => (
              <div key={ex.label} style={{
                background: ex.type === "PENALTY" ? "rgba(155,44,44,0.08)" : "rgba(26,122,109,0.08)",
                border: `1px solid ${ex.type === "PENALTY" ? "rgba(155,44,44,0.15)" : "rgba(26,122,109,0.15)"}`,
                borderRadius: S.cardRadius,
                padding: mobile ? "16px 20px" : "20px 24px",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transition: `opacity 0.5s ease-out ${200 + i * 80}ms, transform 0.5s ease-out ${200 + i * 80}ms`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: ex.color }}>{ex.type}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#F4F1EA" }}>{ex.label}</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: ex.color }}>{ex.points}</span>
                </div>
                <p style={{ fontSize: 13, color: "rgba(244,241,234,0.50)", lineHeight: 1.55, margin: 0 }}>{ex.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 6. CLASSIFICATION BANDS — White background                          */
/* ================================================================== */
function ClassificationBands() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const bands = [
    {
      range: "0\u201329",
      label: "Limited Stability",
      color: B.bandLimited,
      desc: "The income structure is vulnerable and not yet protected against disruption.",
      width: "30%",
    },
    {
      range: "30\u201349",
      label: "Developing Stability",
      color: B.bandDeveloping,
      desc: "The structure is developing but still needs stronger protection in key areas.",
      width: "20%",
    },
    {
      range: "50\u201374",
      label: "Established Stability",
      color: B.bandEstablished,
      desc: "The structure has real stability but is not yet fully protected against disruption.",
      width: "25%",
    },
    {
      range: "75\u2013100",
      label: "High Stability",
      color: B.bandHigh,
      desc: "The structure is strong, well-protected, and resilient against most disruptions.",
      width: "25%",
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="Classification Bands"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div
        style={{
          maxWidth: S.maxW,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: S.subtextMb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <h2
            className="text-[28px] md:text-[36px]"
            style={{
              color: B.navy,
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHeading,
              marginBottom: 12,
            }}
          >
            Income Stability Classification Scale
          </h2>
          <p
            className="text-[15px] md:text-[17px]"
            style={{
              color: B.muted,
              lineHeight: S.lhBody,
              maxWidth: 560,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Every score maps to a fixed stability band.
          </p>
        </div>

        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          {/* Animated horizontal bar */}
          <div
            style={{
              display: "flex",
              borderRadius: 8,
              overflow: "hidden",
              height: mobile ? 12 : 16,
              marginBottom: 48,
            }}
          >
            {bands.map((band, i) => (
              <div
                key={band.label}
                style={{
                  width: band.width,
                  backgroundColor: band.color,
                  transform: visible ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "left center",
                  transition: `transform 0.6s cubic-bezier(0.22,1,0.36,1) ${300 + i * 150}ms`,
                }}
              />
            ))}
          </div>

          {/* 4-column grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: mobile ? "1fr" : "repeat(4, 1fr)",
              gap: mobile ? 20 : S.gridGap,
            }}
          >
            {bands.map((band, i) => (
              <div
                key={band.label}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(14px)",
                  transition: `opacity 0.5s ease-out ${400 + i * 100}ms, transform 0.5s ease-out ${400 + i * 100}ms`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: band.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    className="text-[13px]"
                    style={{ fontWeight: 600, color: B.navy }}
                  >
                    {band.range}
                  </span>
                </div>
                <h3
                  className="text-[14px]"
                  style={{
                    fontWeight: 600,
                    color: band.color,
                    marginBottom: 6,
                    marginTop: 0,
                  }}
                >
                  {band.label}
                </h3>
                <p
                  className="text-[13px]"
                  style={{ color: B.muted, lineHeight: 1.6, margin: 0 }}
                >
                  {band.desc}
                </p>
              </div>
            ))}
          </div>

          <p
            className="text-[13px]"
            style={{
              color: B.light,
              textAlign: "center",
              marginTop: 40,
              letterSpacing: "0.02em",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.5s ease-out 800ms",
            }}
          >
            Band thresholds are fixed under Model RP-2.0.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 7. INDUSTRY CONTEXT — Sand background                               */
/* ================================================================== */
function IndustryContext() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Industry Context"
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div
        style={{
          maxWidth: S.maxW,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
        }}
      >
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: S.lsLabel, textTransform: "uppercase" as const, color: B.teal, marginBottom: 12 }}>Personalization Layer</div>
          <h2 style={{ fontSize: mobile ? 28 : 42, color: B.navy, fontFamily: DISPLAY_FONT, fontWeight: 400, letterSpacing: S.lsHeading, lineHeight: S.lhHeading, marginBottom: S.h2mb }}>
            Same score. Your context.
          </h2>
          <p style={{ fontSize: mobile ? 15 : 16, color: B.muted, lineHeight: S.lhBody, marginBottom: S.paraMb }}>
            Your 0&#8211;100 score is deterministic and industry-agnostic. But the report wraps it in context specific to your income model, industry, and operating structure — including personalized risk scenarios, predictive warnings calibrated to your sector, peer benchmarking against actual industry data, and action plans with scripts tailored to how you earn.
          </p>
          <p style={{ fontSize: mobile ? 15 : 16, color: B.muted, lineHeight: S.lhBody, margin: 0 }}>
            This personalization layer enriches interpretation and execution without altering the underlying score. A real estate agent and a SaaS founder with identical inputs get the same score — but different scenarios, different scripts, and different peer comparisons.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 8. INTEGRITY AND VERIFICATION — White background                    */
/* ================================================================== */
function Integrity() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  const [open, setOpen] = useState<number | null>(null);

  const panels = [
    {
      title: "Deterministic consistency",
      dotColor: B.teal,
      items: [
        "Same inputs always produce the same score — no variability, no subjective interpretation",
        "20-engine pipeline with fixed scoring rules under Model RP-2.0",
        "Cross-factor interaction rules are versioned and documented",
        "Any change to the framework creates a new model version — prior scores remain valid under their original model",
      ],
    },
    {
      title: "Verification and record integrity",
      dotColor: B.purple,
      items: [
        "Every assessment is stamped with a unique record ID and SHA-256 integrity hash",
        "Model version, factor version, and scenario version recorded on every report",
        "QR code verification links every report to its authenticated record",
        "Reports can be independently verified at runpayway.com/verify",
      ],
    },
    {
      title: "Scope and limitations",
      dotColor: B.navy,
      items: [
        "The score reflects income structure at the time of assessment — it is a present-state diagnostic",
        "It does not predict future financial outcomes or market conditions",
        "It is not financial advice, credit underwriting, or investment guidance",
        "Reassessment is recommended when any structural factor shifts by more than 15%",
      ],
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="Assessment Integrity"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div
        style={{
          maxWidth: S.maxW,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: S.lsLabel, textTransform: "uppercase" as const, color: B.teal, marginBottom: 12 }}>Trust Architecture</div>
            <h2 style={{ fontSize: mobile ? 28 : 42, color: B.navy, fontFamily: DISPLAY_FONT, fontWeight: 400, letterSpacing: S.lsHeading, lineHeight: S.lhHeading, marginBottom: S.h2mb }}>
              Every score is verifiable.<br />Every rule is fixed.
            </h2>
            <p style={{ fontSize: mobile ? 15 : 16, color: B.muted, lineHeight: S.lhBody, maxWidth: 520, margin: "0 auto" }}>
              No subjective judgment. No probabilistic modeling. The 20-engine pipeline produces identical results for identical inputs — and every assessment is cryptographically stamped.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {panels.map((panel, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={panel.title}
                  style={{
                    backgroundColor: B.sand,
                    borderRadius: S.cardRadius,
                    border: `1px solid ${isOpen ? B.border : "rgba(14,26,43,0.06)"}`,
                    overflow: "hidden",
                    transition: "border-color 0.25s ease",
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(10px)",
                    animationDelay: `${i * 80}ms`,
                  }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: mobile ? "18px 20px" : "22px 28px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: panel.dotColor,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        className="text-[15px]"
                        style={{ fontWeight: 600, color: B.navy }}
                      >
                        {panel.title}
                      </span>
                    </div>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      style={{
                        flexShrink: 0,
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.25s ease",
                      }}
                    >
                      <path
                        d="M4.5 6.75L9 11.25L13.5 6.75"
                        stroke={B.light}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <div
                    style={{
                      maxHeight: isOpen ? 300 : 0,
                      opacity: isOpen ? 1 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.35s ease, opacity 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        padding: mobile
                          ? "0 20px 20px 42px"
                          : "0 28px 24px 50px",
                      }}
                    >
                      {panel.items.map((item, j) => (
                        <div
                          key={j}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            marginBottom:
                              j < panel.items.length - 1 ? 10 : 0,
                          }}
                        >
                          <div
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: "50%",
                              backgroundColor: B.light,
                              flexShrink: 0,
                              marginTop: 8,
                            }}
                          />
                          <p
                            className="text-[14px]"
                            style={{
                              color: B.muted,
                              lineHeight: 1.6,
                              margin: 0,
                            }}
                          >
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 9. CTA — Dark gradient                                              */
/* ================================================================== */
function CtaSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  const [hovered, setHovered] = useState(false);

  return (
    <section
      ref={ref}
      aria-label="Call to Action"
      style={{
        background: B.gradient,
        position: "relative",
        overflow: "hidden",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "50%",
          width: 600,
          height: 600,
          transform: "translateX(-50%)",
          background:
            "radial-gradient(circle, rgba(31,109,122,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: S.maxW,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: 600,
            marginLeft: "auto",
            marginRight: "auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          <h2
            className="text-[32px] md:text-[40px]"
            style={{
              color: "#F4F1EA",
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHero,
              lineHeight: S.lhHeading,
              marginBottom: 20,
            }}
          >
            Now that you know how it works &#8212; see your score.
          </h2>
          <p
            className="text-[15px] md:text-[16px]"
            style={{
              color: "rgba(244,241,234,0.70)",
              lineHeight: S.lhBody,
              marginBottom: 12,
            }}
          >
            Your free score shows where you stand. The full report shows what to do about it &#8212; $99.
          </p>
          <p
            className="text-[13px]"
            style={{
              color: "rgba(244,241,234,0.40)",
              lineHeight: 1.6,
              marginBottom: 40,
            }}
          >
            If the report doesn&#8217;t reveal at least one insight you didn&#8217;t already know, full refund.
          </p>

          <Link
            href="/begin"
            onMouseEnter={() => canHover() && setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: mobile ? S.ctaHsm : S.ctaH,
              paddingLeft: S.ctaPadX,
              paddingRight: S.ctaPadX,
              borderRadius: S.ctaRadius,
              backgroundColor: "#F4F1EA",
              color: B.navy,
              fontSize: mobile ? 14 : 15,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              textDecoration: "none",
              transition:
                "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
              transform: hovered ? "translateY(-2px)" : "translateY(0)",
              boxShadow: hovered
                ? "0 8px 32px rgba(0,0,0,0.25)"
                : "0 2px 8px rgba(0,0,0,0.12)",
            }}
          >
            Get My Free Score
          </Link>

          <p
            className="text-[12px]"
            style={{
              color: "rgba(244,241,234,0.40)",
              marginTop: 24,
              letterSpacing: "0.02em",
            }}
          >
            Free to start &middot; Under 2 minutes &middot; No bank connection
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* MAIN EXPORT                                                         */
/* ================================================================== */
export default function MethodologyPage() {
  return (
    <div>
      <Hero />
      <Purpose />
      <SixDimensions />
      <ScoringFramework />
      <InteractionEffects />
      <ClassificationBands />
      <IndustryContext />
      <Integrity />
      <CtaSection />
    </div>
  );
}
