"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* Guard for hover-capable devices — prevents stuck states on iOS */
const canHover = () => typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

/* Shared hook: triggers visibility when element enters viewport.
   Checks on mount so elements already in view appear immediately. */
function useInView(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* Already in view on mount? Fire immediately */
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* Bidirectional variant — does NOT disconnect, so visible toggles on/off as you scroll */
function useInViewBidi(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* Runtime mobile detection — bypasses CSS entirely */
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

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F7F6F3",
  sandDk: "#EDECEA",
  muted: "#6B7280",
  light: "#9CA3AF",
  gradient: "linear-gradient(135deg, #0E1A2B 0%, #4B3FAE 50%, #1F6D7A 100%)",
};

/* ────────────────────────────────────────────────────────────────────
   DESIGN TOKENS — Enterprise spacing scale (8px base unit)
   Every value is deliberate. Nothing is arbitrary.
   ──────────────────────────────────────────────────────────────────── */
const S = {
  /* Section vertical rhythm — consistent everywhere */
  sectionY:     { desktop: 160, mobile: 88 },
  sectionYsm:   { desktop: 120, mobile: 72 },
  transitionY:  { desktop: 72, mobile: 48 },
  disclaimerY:  { desktop: 64, mobile: 48 },

  /* Container */
  maxW:         1060,
  padX:         { desktop: 48, mobile: 24 },

  /* Typography rhythm */
  h1mb:         28,
  h2mb:         24,
  subtextMb:    56,
  paraMb:       24,
  labelMb:      16,

  /* Component spacing */
  cardPad:      { desktop: 36, mobile: 24 },
  cardRadius:   16,
  panelRadius:  20,
  gridGap:      24,
  gridGapSm:    16,

  /* CTA buttons */
  ctaH:         56,
  ctaHsm:       46,
  ctaPadX:      32,
  ctaRadius:    14,

  /* Line heights */
  lhHeading:    1.08,
  lhBody:       1.75,
  lhDense:      1.5,

  /* Letter spacing */
  lsHeading:    "-0.025em",
  lsHero:       "-0.035em",
  lsLabel:      "0.14em",
};


/* ================================================================== */
/* SECTION 2: HERO                                                     */
/* ================================================================== */
function HeroSection() {
  const [score, setScore] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const mobile = useMobile();

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const trigger = () => {
      if (hasAnimated) return;
      setHasAnimated(true);
      setTimeout(() => setCardVisible(true), 300);
      setTimeout(() => {
        const target = 78;
        const duration = 1000;
        const start = performance.now();
        const animate = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setScore(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }, 800);
    };
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) { trigger(); return; }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { trigger(); obs.disconnect(); } },
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasAnimated]);

  return (
    <section
      ref={heroRef}
      aria-label="Hero"
      className="relative overflow-hidden"
      style={{ background: "#ffffff" }}
    >
      {/* Subtle gradient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 1000, height: 1000, borderRadius: "50%",
          top: "-20%", right: "-10%",
          background: "radial-gradient(circle, rgba(75,63,174,0.06) 0%, rgba(75,63,174,0.02) 40%, transparent 70%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 800, height: 800, borderRadius: "50%",
          bottom: "-15%", left: "-8%",
          background: "radial-gradient(circle, rgba(31,109,122,0.05) 0%, rgba(31,109,122,0.015) 40%, transparent 70%)",
        }}
      />

      <div
        className="relative mx-auto"
        style={{ maxWidth: 1200, paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop, paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop, paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}
      >
        <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", alignItems: mobile ? "stretch" : "center", gap: mobile ? 24 : 64 }}>
          {/* Left — Copy + CTA */}
          <div className="flex-1 lg:max-w-[560px]" style={{ textAlign: "center" }}>
            {/* Eyebrow */}
            <div
              className="font-medium uppercase text-[11px] md:text-[12px]"
              style={{
                letterSpacing: S.lsLabel,
                color: B.teal,
                marginBottom: S.h2mb,
                opacity: hasAnimated ? 1 : 0,
                transform: hasAnimated ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 500ms ease-out, transform 500ms ease-out",
              }}
            >
              Income Stability Score&#8482;
            </div>

            <h1
              className="font-semibold"
              style={{
                fontSize: mobile ? 32 : 52,
                color: B.navy,
                lineHeight: S.lhHeading,
                letterSpacing: S.lsHero,
                marginBottom: S.h1mb,
                maxWidth: mobile ? undefined : 520,
                marginLeft: "auto",
                marginRight: "auto",
                opacity: hasAnimated ? 1 : 0,
                transform: hasAnimated ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 600ms ease-out 100ms, transform 600ms ease-out 100ms",
              }}
            >
              The fixed standard for measuring income structure stability.
            </h1>

            <p
              className="text-[15px] md:text-[17px]"
              style={{
                color: "rgba(14,26,43,0.65)",
                lineHeight: S.lhBody,
                marginBottom: S.paraMb,
                maxWidth: mobile ? undefined : 480,
                marginLeft: "auto",
                marginRight: "auto",
                opacity: hasAnimated ? 1 : 0,
                transform: hasAnimated ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 600ms ease-out 200ms, transform 600ms ease-out 200ms",
              }}
            >
              RunPayway&#8482; measures how stable or fragile your income structure is. It evaluates recurring or continuing income, concentration, forward visibility, variability, and dependence on active work, then converts the result into a fixed 0&#8211;100 score under Model RP-2.0.
            </p>

            <p
              className="text-[16px] md:text-[18px]"
              style={{
                color: "rgba(14,26,43,0.55)",
                lineHeight: S.lhBody,
                maxWidth: mobile ? undefined : 460,
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: S.h1mb,
                fontWeight: 500,
                opacity: hasAnimated ? 1 : 0,
                transform: hasAnimated ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 600ms ease-out 280ms, transform 600ms ease-out 280ms",
              }}
            >
              One assessment. One score. Full structural diagnosis.
            </p>

            {/* CTA Button */}
            <div
              style={{
                opacity: hasAnimated ? 1 : 0,
                transform: hasAnimated ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 500ms ease-out 450ms, transform 500ms ease-out 450ms",
              }}
            >
              <Link
                href="/pricing"
                className="cta-tick inline-flex items-center justify-center font-semibold
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F6D7A]"
                style={{
                  height: S.ctaH,
                  width: mobile ? "100%" : "auto",
                  paddingLeft: S.cardPad.desktop,
                  paddingRight: S.cardPad.desktop,
                  borderRadius: S.ctaRadius,
                  background: B.purple,
                  color: "#ffffff",
                  fontSize: 15,
                  letterSpacing: "-0.01em",
                  border: "1px solid rgba(75,63,174,0.90)",
                  boxShadow: "0 8px 24px rgba(75,63,174,0.25)",
                  transition: "background 180ms ease, transform 180ms ease, box-shadow 180ms ease",
                }}
                onMouseEnter={(e) => {
                  if (!canHover()) return;
                  const el = e.currentTarget;
                  el.style.background = "#3D33A0";
                  el.style.transform = "translateY(-1px)";
                  el.style.boxShadow = "0 12px 32px rgba(75,63,174,0.35)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.background = B.purple;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "0 8px 24px rgba(75,63,174,0.25)";
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <span className="tick tick-white" />
                <span className="cta-label">Get My Income Stability Score&#8482;</span>
                <span className="cta-arrow cta-arrow-white" />
              </Link>

              <p
                className="text-[13px] md:text-[14px]"
                style={{ color: "rgba(14,26,43,0.42)", marginTop: 14, letterSpacing: "0.01em", textAlign: "center" }}
              >
                Average completion: under 2 minutes &#183; Instant report
              </p>
            </div>
          </div>

          {/* Right — Floating Score Gauge */}
          <div className="flex-1 flex justify-center" style={{ position: "relative", minHeight: mobile ? 280 : 400 }}>
            {(() => {
              const C = 260;
              const VB = 520;
              const R = 190;
              const circum = 2 * Math.PI * R;
              const scorePercent = 0.78;
              const bands = [0.29, 0.49, 0.74];
              const endAngle = -90 + 360 * scorePercent;
              const endRad = endAngle * Math.PI / 180;
              const endX = C + Math.cos(endRad) * R;
              const endY = C + Math.sin(endRad) * R;
              const tickOuterR = R + 14;
              const scaleLabels = [
                { value: 30, angle: -90 + 360 * 0.30 },
                { value: 50, angle: -90 + 360 * 0.50 },
                { value: 75, angle: -90 + 360 * 0.75 },
              ];

              return (
                <>
                  <svg className="absolute pointer-events-none" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: mobile ? 340 : 480, height: mobile ? 340 : 480 }} viewBox={`0 0 ${VB} ${VB}`} fill="none">

                    {/* Tick marks */}
                    {Array.from({ length: 100 }, (_, i) => {
                      const angle = (i * 3.6 - 90) * Math.PI / 180;
                      const isLong = i % 10 === 0;
                      const isMid = i % 5 === 0 && !isLong;
                      const isBand = bands.some(b => Math.round(b * 100) === i);
                      const oR = tickOuterR;
                      const iR = isBand ? oR - 16 : isLong ? oR - 12 : isMid ? oR - 8 : oR - 5;
                      const inScored = i <= 78;
                      const opacity = isBand ? 0.22 : isLong ? (inScored ? 0.16 : 0.10) : isMid ? (inScored ? 0.09 : 0.06) : (inScored ? 0.05 : 0.03);
                      return (
                        <line key={i}
                          x1={C + Math.cos(angle) * oR} y1={C + Math.sin(angle) * oR}
                          x2={C + Math.cos(angle) * iR} y2={C + Math.sin(angle) * iR}
                          stroke={isBand ? "#1F6D7A" : "#0E1A2B"} strokeWidth={isBand ? 1.2 : isLong ? 1 : 0.5} opacity={opacity}
                        />
                      );
                    })}

                    {/* Full-circle track */}
                    <circle cx={C} cy={C} r={R} stroke="#0E1A2B" strokeWidth="1" opacity="0.04" />

                    {/* Score arc — animated draw-in */}
                    <circle
                      cx={C} cy={C} r={R}
                      stroke="url(#heroScoreArc)" strokeWidth="2.5" strokeLinecap="round"
                      opacity="0.32"
                      strokeDasharray={`${circum * scorePercent} ${circum * (1 - scorePercent)}`}
                      strokeDashoffset={hasAnimated ? 0 : circum * scorePercent}
                      transform={`rotate(-90 ${C} ${C})`}
                      style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.6s" }}
                    />

                    {/* Score endpoint marker */}
                    <circle cx={endX} cy={endY} r="3.5" fill="#4B3FAE"
                      opacity={hasAnimated ? 0.35 : 0}
                      style={{ transition: "opacity 400ms ease 2.2s" }}
                    />
                    <circle cx={endX} cy={endY} r="1.5" fill="#ffffff"
                      opacity={hasAnimated ? 0.8 : 0}
                      style={{ transition: "opacity 400ms ease 2.2s" }}
                    />

                    {/* Band boundary notches on arc */}
                    {bands.map((b) => {
                      const a = (-90 + 360 * b) * Math.PI / 180;
                      return (
                        <line key={b}
                          x1={C + Math.cos(a) * (R - 5)} y1={C + Math.sin(a) * (R - 5)}
                          x2={C + Math.cos(a) * (R + 5)} y2={C + Math.sin(a) * (R + 5)}
                          stroke="#1F6D7A" strokeWidth="0.75" opacity="0.14"
                        />
                      );
                    })}

                    {/* Scale labels */}
                    {scaleLabels.map(({ value, angle: a }) => {
                      const rad = a * Math.PI / 180;
                      const labelR = tickOuterR + 16;
                      const inScored = value <= 78;
                      return (
                        <g key={value}>
                          <line
                            x1={C + Math.cos(rad) * tickOuterR} y1={C + Math.sin(rad) * tickOuterR}
                            x2={C + Math.cos(rad) * (tickOuterR + 6)} y2={C + Math.sin(rad) * (tickOuterR + 6)}
                            stroke="#0E1A2B" strokeWidth="0.5" opacity={inScored ? 0.10 : 0.05}
                          />
                          <text
                            x={C + Math.cos(rad) * labelR} y={C + Math.sin(rad) * labelR}
                            textAnchor="middle" dominantBaseline="central"
                            fontSize="9" fontWeight="500" letterSpacing="0.02em"
                            fill="#0E1A2B"
                            opacity={inScored ? 0.20 : 0.10}
                            fontFamily="system-ui, -apple-system, sans-serif"
                          >{value}</text>
                        </g>
                      );
                    })}

                    {/* Structural rings */}
                    <circle cx={C} cy={C} r="152" stroke="url(#heroRingMid)" strokeWidth="0.5" opacity="0.06" />
                    <circle cx={C} cy={C} r="114" stroke="url(#heroRingInner)" strokeWidth="0.5" opacity="0.05" />
                    <circle cx={C} cy={C} r="76" stroke="#1F6D7A" strokeWidth="0.5" opacity="0.04" />

                    {/* Bullseye target fills */}
                    <circle cx={C} cy={C} r="152" fill="url(#heroBullseyeOuter)" opacity="0.015" />
                    <circle cx={C} cy={C} r="114" fill="url(#heroBullseyeMid)" opacity="0.018" />
                    <circle cx={C} cy={C} r="76" fill="url(#heroBullseyeInner)" opacity="0.022" />
                    <circle cx={C} cy={C} r="38" fill="#4B3FAE" opacity="0.028" />

                    {/* Crosshairs */}
                    <line x1={C} y1={C - 75} x2={C} y2={C - 45} stroke="#0E1A2B" strokeWidth="0.5" opacity="0.06" />
                    <line x1={C} y1={C + 45} x2={C} y2={C + 75} stroke="#0E1A2B" strokeWidth="0.5" opacity="0.06" />
                    <line x1={C - 75} y1={C} x2={C - 45} y2={C} stroke="#0E1A2B" strokeWidth="0.5" opacity="0.06" />
                    <line x1={C + 45} y1={C} x2={C + 75} y2={C} stroke="#0E1A2B" strokeWidth="0.5" opacity="0.06" />

                    {/* Gradient definitions */}
                    <defs>
                      <linearGradient id="heroScoreArc" gradientUnits="userSpaceOnUse" x1={C} y1={C - R} x2={C - R} y2={C + R * 0.5}>
                        <stop offset="0%" stopColor="#0E1A2B" />
                        <stop offset="35%" stopColor="#2A2670" />
                        <stop offset="60%" stopColor="#4B3FAE" />
                        <stop offset="85%" stopColor="#2B5A6E" />
                        <stop offset="100%" stopColor="#1F6D7A" />
                      </linearGradient>
                      <linearGradient id="heroRingMid" gradientUnits="userSpaceOnUse" x1={C - 152} y1={C} x2={C + 152} y2={C}>
                        <stop offset="0%" stopColor="#0E1A2B" />
                        <stop offset="50%" stopColor="#4B3FAE" />
                        <stop offset="100%" stopColor="#0E1A2B" />
                      </linearGradient>
                      <linearGradient id="heroRingInner" gradientUnits="userSpaceOnUse" x1={C - 114} y1={C} x2={C + 114} y2={C}>
                        <stop offset="0%" stopColor="#4B3FAE" />
                        <stop offset="50%" stopColor="#1F6D7A" />
                        <stop offset="100%" stopColor="#4B3FAE" />
                      </linearGradient>
                      <radialGradient id="heroBullseyeOuter" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#4B3FAE" />
                        <stop offset="100%" stopColor="#0E1A2B" />
                      </radialGradient>
                      <radialGradient id="heroBullseyeMid" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#4B3FAE" />
                        <stop offset="60%" stopColor="#2A2670" />
                        <stop offset="100%" stopColor="#1F6D7A" />
                      </radialGradient>
                      <radialGradient id="heroBullseyeInner" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#4B3FAE" />
                        <stop offset="100%" stopColor="#4B3FAE" stopOpacity="0.5" />
                      </radialGradient>
                    </defs>
                  </svg>
                </>
              );
            })()}

            {/* Score typography — centered in bullseye */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) ${cardVisible ? "translateY(0)" : "translateY(24px)"}`,
                textAlign: "center",
                opacity: cardVisible ? 1 : 0,
                transition: "opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)",
                whiteSpace: "nowrap",
              }}
            >
              <div
                className="font-medium uppercase text-[10px] md:text-[11px]"
                style={{
                  letterSpacing: "0.16em",
                  color: "rgba(14,26,43,0.35)",
                  marginBottom: 24,
                }}
              >
                Your Income Stability Score&#8482;
              </div>

              <div
                className="font-semibold leading-none"
                style={{
                  fontSize: mobile ? 64 : 148,
                  background: `linear-gradient(145deg, ${B.navy} 0%, #2A2670 30%, ${B.purple} 55%, #2B5A6E 80%, ${B.teal} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.05em",
                  marginBottom: 6,
                  fontFeatureSettings: "'tnum'",
                }}
              >
                {score}
              </div>

              <div
                className="text-[17px] sm:text-[20px] md:text-[24px] font-medium"
                style={{ color: B.purple, letterSpacing: "-0.01em" }}
              >
                Established Stability
              </div>
            </div>
          </div>
        </div>

        {/* Proof strip */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: mobile ? 12 : 24,
            marginTop: mobile ? 40 : 56,
            opacity: hasAnimated ? 1 : 0,
            transition: "opacity 600ms ease-out 600ms",
          }}
        >
          {["Model RP-2.0", "Deterministic scoring", "No bank connection", "Private by default"].map((item, i) => (
            <span
              key={item}
              className="text-[11px] md:text-[12px]"
              style={{
                color: "rgba(14,26,43,0.40)",
                fontWeight: 500,
                letterSpacing: "0.02em",
                display: "flex",
                alignItems: "center",
                gap: i > 0 ? 0 : 0,
              }}
            >
              {i > 0 && <span style={{ marginRight: mobile ? 0 : 0, color: "rgba(14,26,43,0.15)" }}>{mobile ? "" : ""}</span>}
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3: FAST COMPARISON                                          */
/* ================================================================== */
function FastComparison() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Fast Comparison"
      className="relative overflow-hidden"
      style={{
        backgroundColor: B.navy,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glows */}
      <div style={{ position: "absolute", top: "-18%", right: "-10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(31,109,122,0.04) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-12%", left: "-6%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(75,63,174,0.03) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1, paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        {/* Title */}
        <h2
          className="text-[30px] md:text-[40px]"
          style={{
            color: "#F4F1EA",
            fontWeight: 600,
            letterSpacing: S.lsHeading,
            marginBottom: mobile ? 32 : 48,
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          What most scores measure &#8212; and what they miss
        </h2>

        {/* Comparison panel */}
        <div
          className="mx-auto"
          style={{
            maxWidth: 820,
            marginBottom: mobile ? 32 : 48,
            position: "relative",
            borderRadius: S.panelRadius + 1,
            padding: 1,
            overflow: "hidden",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out 100ms, transform 0.5s ease-out 100ms",
          }}
        >
          {/* Animated gradient border */}
          <div style={{
            position: "absolute",
            inset: -40,
            background: "conic-gradient(from 0deg, #0E1A2B, #4B3FAE, #1F6D7A, #4B3FAE, #0E1A2B)",
            animation: "borderGlow 60s linear infinite",
            opacity: 0.20,
          }} />
          {/* Inner panel */}
          <div
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
              gap: 0,
              borderRadius: S.panelRadius,
              overflow: "hidden",
              border: "1px solid rgba(75,63,174,0.18)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            {/* Credit Score side */}
            <div style={{ padding: mobile ? "28px 24px 32px" : "36px 36px 40px", backgroundColor: "rgba(255,255,255,0.03)" }}>
              <div
                className="text-[11px] uppercase"
                style={{ color: "rgba(244,241,234,0.40)", fontWeight: 500, letterSpacing: S.lsLabel, marginBottom: 14 }}
              >
                Credit Score
              </div>
              <div
                className="text-[20px] md:text-[22px]"
                style={{ color: "rgba(244,241,234,0.70)", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 12 }}
              >
                Credit Score
              </div>
              <p className="text-[15px] md:text-[16px]" style={{ color: "rgba(244,241,234,0.55)", fontWeight: 400, lineHeight: 1.7 }}>
                Measures how reliably you repay debt.
              </p>
            </div>

            {/* Income Stability Score side */}
            <div style={{ padding: mobile ? "28px 24px 32px" : "36px 36px 40px", backgroundColor: "rgba(75,63,174,0.12)", borderLeft: mobile ? "none" : "1px solid rgba(75,63,174,0.20)", borderTop: mobile ? "1px solid rgba(75,63,174,0.20)" : "none" }}>
              <div
                className="text-[11px] uppercase"
                style={{ color: B.teal, fontWeight: 500, letterSpacing: S.lsLabel, marginBottom: 14 }}
              >
                Income Stability Score&#8482;
              </div>
              <div
                className="text-[20px] md:text-[22px]"
                style={{ color: "#F4F1EA", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 12 }}
              >
                Income Stability Score&#8482;
              </div>
              <p className="text-[15px] md:text-[16px]" style={{ color: "rgba(244,241,234,0.85)", fontWeight: 400, lineHeight: 1.7 }}>
                Measures how stable your income structure is.
              </p>
            </div>
          </div>
        </div>

        {/* Body copy */}
        <div
          style={{
            maxWidth: 620,
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out 200ms, transform 0.5s ease-out 200ms",
          }}
        >
          <p
            className="text-[15px] md:text-[17px]"
            style={{ color: "rgba(244,241,234,0.70)", fontWeight: 400, lineHeight: 1.75, marginBottom: 16 }}
          >
            A credit score does not show whether your income could survive the loss of a major source, how much income is already lined up ahead, or how much would continue if active work stopped.
          </p>
          <p
            className="text-[17px] md:text-[19px]"
            style={{ color: "rgba(244,241,234,0.95)", fontWeight: 500, lineHeight: 1.5, letterSpacing: "-0.01em" }}
          >
            RunPayway&#8482; measures that gap.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 4: WHO IT IS FOR                                            */
/* ================================================================== */
function WhoItIsFor() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Who It Is For"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        <div
          style={{
            maxWidth: 680,
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 520ms ease-out, transform 520ms ease-out",
          }}
        >
          <h2
            className="text-[30px] md:text-[40px]"
            style={{
              color: B.navy,
              fontWeight: 600,
              lineHeight: S.lhHeading,
              letterSpacing: S.lsHeading,
              marginBottom: S.h2mb,
            }}
          >
            Built for people whose income does not fit simple financial scoring
          </h2>

          <p
            className="text-[16px] md:text-[18px]"
            style={{ color: "rgba(14,26,43,0.70)", lineHeight: S.lhBody, marginBottom: S.paraMb }}
          >
            RunPayway&#8482; is built for business owners, self-employed professionals, commission earners, consultants, agency operators, private practice operators, creators, and people with mixed or uneven income structures.
          </p>
          <p
            className="text-[16px] md:text-[18px]"
            style={{ color: "rgba(14,26,43,0.70)", lineHeight: S.lhBody }}
          >
            If your income depends on clients, contracts, retained relationships, booked work, or active effort, this assessment is designed for you.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 5: WHY IT MATTERS                                           */
/* ================================================================== */
function WhyItMatters() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Why It Matters"
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        <div
          style={{
            maxWidth: 680,
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 520ms ease-out, transform 520ms ease-out",
          }}
        >
          <h2
            className="text-[30px] md:text-[40px]"
            style={{
              color: B.navy,
              fontWeight: 600,
              lineHeight: S.lhHeading,
              letterSpacing: S.lsHeading,
              marginBottom: S.h2mb,
            }}
          >
            Income can look strong and still be exposed
          </h2>

          <p
            className="text-[16px] md:text-[18px]"
            style={{ color: "rgba(14,26,43,0.70)", lineHeight: S.lhBody, marginBottom: S.paraMb }}
          >
            Two people can earn similar income and carry very different income risk.
          </p>
          <p
            className="text-[16px] md:text-[18px]"
            style={{ color: "rgba(14,26,43,0.70)", lineHeight: S.lhBody, marginBottom: S.paraMb }}
          >
            One may have recurring or continuing revenue, stronger source spread, and income already committed ahead. Another may rely on a few sources, short visibility, and constant active effort.
          </p>
          <p
            className="text-[16px] md:text-[18px]"
            style={{ color: "rgba(14,26,43,0.70)", lineHeight: S.lhBody, fontWeight: 500 }}
          >
            RunPayway&#8482; helps you see that difference before it becomes a financial problem.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 6: WHAT YOU RECEIVE                                         */
/* ================================================================== */
function WhatYouReceive() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const groups = [
    {
      label: "Diagnosis",
      items: [
        { title: "Executive Diagnostic", desc: "Your overall score, stability band, and top-level result." },
        { title: "Why the Score Is Not Higher", desc: "The main factors holding the score down." },
        { title: "Structural Breakdown", desc: "Recurring income, concentration, forward visibility, variability, continuity, and labor dependence." },
        { title: "Main Structural Constraint", desc: "The core weakness affecting the structure most." },
      ],
    },
    {
      label: "Stress Analysis",
      items: [
        { title: "Fragility Profile", desc: "What is most exposed and what is most likely to break first." },
        { title: "Stress Scenarios", desc: "How the score changes if pressure hits the structure." },
      ],
    },
    {
      label: "Improvement Path",
      items: [
        { title: "Best Improvement Opportunity", desc: "The structural move most likely to improve the score fastest." },
        { title: "Reassessment Triggers", desc: "What should change before a retake is meaningful." },
      ],
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="What You Receive"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: S.subtextMb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 520ms ease-out, transform 520ms ease-out",
          }}
        >
          <h2
            className="text-[30px] md:text-[40px]"
            style={{
              color: B.navy,
              fontWeight: 600,
              lineHeight: S.lhHeading,
              letterSpacing: S.lsHeading,
              marginBottom: S.h2mb,
            }}
          >
            What you receive
          </h2>
          <p
            className="text-[16px] md:text-[18px] mx-auto"
            style={{ color: "rgba(14,26,43,0.70)", lineHeight: S.lhBody, maxWidth: 640 }}
          >
            RunPayway&#8482; does more than assign a score. It shows why the score is what it is and what to strengthen next.
          </p>
        </div>

        {/* Groups */}
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 520ms ease-out 100ms, transform 520ms ease-out 100ms",
          }}
        >
          {groups.map((group) => (
            <div key={group.label} style={{ marginBottom: 40 }}>
              <div
                className="text-[11px] font-semibold uppercase"
                style={{
                  letterSpacing: S.lsLabel,
                  color: B.teal,
                  marginBottom: 16,
                }}
              >
                {group.label}
              </div>
              {group.items.map((item) => (
                <div
                  key={item.title}
                  style={{
                    padding: "20px 0",
                    borderBottom: "1px solid rgba(14,26,43,0.06)",
                  }}
                >
                  <div
                    className="text-[16px] md:text-[17px] font-semibold"
                    style={{ color: B.navy, lineHeight: 1.3, marginBottom: 6 }}
                  >
                    {item.title}
                  </div>
                  <p
                    className="text-[14px] md:text-[15px]"
                    style={{ color: "rgba(14,26,43,0.55)", lineHeight: 1.6 }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          ))}

          {/* Final item */}
          <div style={{ padding: "20px 0", borderBottom: "1px solid rgba(14,26,43,0.06)" }}>
            <div
              className="text-[16px] md:text-[17px] font-semibold"
              style={{ color: B.navy, lineHeight: 1.3, marginBottom: 6 }}
            >
              Verification &amp; Authenticity
            </div>
            <p
              className="text-[14px] md:text-[15px]"
              style={{ color: "rgba(14,26,43,0.55)", lineHeight: 1.6 }}
            >
              Report authenticity under Model RP-2.0.
            </p>
          </div>

          {/* Link */}
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Link
              href="/sample-report"
              className="text-[15px] font-semibold"
              style={{
                color: B.purple,
                textDecoration: "underline",
                textUnderlineOffset: 4,
                letterSpacing: "-0.01em",
                transition: "color 180ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#3D33A0"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = B.purple; }}
            >
              View the sample report &#8594;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 7: HOW IT WORKS                                             */
/* ================================================================== */
function HowItWorks() {
  const { ref, visible } = useInViewBidi(0.15);
  const mobile = useMobile();

  const steps = [
    { num: "1", title: "Answer Six Questions", desc: "You answer six questions about how your income is set up." },
    { num: "2", title: "Run the Model", desc: "Model RP-2.0 converts those answers into a score, band, sub-scores, and structural findings." },
    { num: "3", title: "Get the Full Report", desc: "You receive your score, key risks, primary structural constraint, stress scenarios, improvement path, and reassessment triggers instantly." },
  ];

  return (
    <section
      ref={ref}
      aria-label="How It Works"
      style={{
        paddingTop: mobile ? S.sectionYsm.mobile : S.sectionYsm.desktop,
        paddingBottom: mobile ? S.sectionYsm.mobile : S.sectionYsm.desktop,
        background: B.sand,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        {/* Header */}
        <div className="text-center" style={{ marginBottom: S.subtextMb }}>
          <h2
            className="text-[26px] sm:text-[34px] md:text-[40px] font-bold leading-tight"
            style={{
              color: B.navy,
              marginBottom: S.h2mb,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s ease-out 100ms, transform 0.5s ease-out 100ms",
            }}
          >
            How it works
          </h2>
          <p
            className="text-base leading-relaxed mx-auto"
            style={{
              color: B.muted,
              maxWidth: 520,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s ease-out 200ms, transform 0.5s ease-out 200ms",
            }}
          >
            RunPayway&#8482; turns six answers into a fixed structural income assessment.
          </p>
        </div>

        {/* 3 step cards */}
        <div
          style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: S.gridGap, maxWidth: 960, margin: "0 auto" }}
        >
          {steps.map((step, i) => {
            const delay = 300 + i * 120;
            return (
              <article
                key={step.num}
                className="text-center"
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: S.cardRadius,
                  padding: mobile ? `${S.cardPad.mobile}px` : `${S.cardPad.desktop}px`,
                  border: "1px solid rgba(14,26,43,0.06)",
                  boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 8px 24px rgba(14,26,43,0.03)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 600ms ease-out ${delay}ms, transform 600ms ease-out ${delay}ms, box-shadow 400ms ease, border-color 400ms ease`,
                }}
                onMouseEnter={(e) => {
                  if (!canHover()) return;
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(14,26,43,0.08), 0 16px 48px rgba(75,63,174,0.08)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.borderColor = "rgba(75,63,174,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(14,26,43,0.04), 0 8px 24px rgba(14,26,43,0.03)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(14,26,43,0.06)";
                }}
              >
                <div
                  className="inline-flex items-center justify-center font-semibold"
                  style={{
                    width: 44, height: 44, borderRadius: 12,
                    backgroundColor: B.purple, color: "#ffffff", fontSize: 17,
                    marginBottom: 24,
                    boxShadow: "0 4px 12px rgba(75,63,174,0.25)",
                  }}
                >
                  {step.num}
                </div>
                <div className="text-[18px] md:text-[20px] font-semibold" style={{ color: B.navy, marginBottom: S.labelMb - 2 }}>
                  {step.title}
                </div>
                <p className="text-[14px] md:text-[15px]" style={{ color: B.muted, lineHeight: S.lhBody }}>
                  {step.desc}
                </p>
              </article>
            );
          })}
        </div>

        {/* Model reference */}
        <div className="text-center" style={{ marginTop: S.subtextMb }}>
          <p
            className="text-[12px] font-medium"
            style={{
              color: B.light,
              opacity: visible ? 1 : 0,
              transition: "opacity 0.5s ease-out 700ms",
            }}
          >
            Powered by RunPayway&#8482; Model RP-2.0
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 8: WHAT WE MEASURE                                          */
/* ================================================================== */
function FactorRow({ num, name, desc, mobile }: {
  num: number; name: string; desc: string; mobile: boolean;
}) {
  const { ref, visible } = useInView(0.25);

  return (
    <div ref={ref}>
      <div
        style={{
          display: "flex",
          alignItems: mobile ? "flex-start" : "center",
          gap: mobile ? 16 : 28,
          padding: mobile ? "20px 0" : "24px 0",
          borderBottom: "1px solid rgba(14,26,43,0.06)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : "translateX(-16px)",
          transition: "opacity 450ms ease-out, transform 450ms ease-out",
        }}
      >
        {/* Number */}
        <div
          style={{
            flexShrink: 0,
            width: mobile ? 28 : 36,
            fontSize: mobile ? 14 : 16,
            fontWeight: 600,
            color: B.light,
            letterSpacing: "-0.02em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {String(num).padStart(2, "0")}
        </div>

        {/* Name + description */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            className="text-[16px] md:text-[17px] font-semibold"
            style={{ color: B.navy, lineHeight: 1.3, marginBottom: 4 }}
          >
            {name}
          </div>
          <div
            className="text-[14px] md:text-[15px]"
            style={{ color: "rgba(14,26,43,0.50)", lineHeight: 1.55 }}
          >
            {desc}
          </div>
        </div>
      </div>
    </div>
  );
}

function WhatWeMeasure() {
  const { ref: sectionRef, visible } = useInView();
  const mobile = useMobile();

  const factors = [
    { name: "Recurring or Continuing Income", desc: "How much income continues from existing sources without needing new client acquisition." },
    { name: "Income Concentration", desc: "How much of your income depends on your single largest source." },
    { name: "Source Diversity", desc: "How many meaningful income sources support your structure." },
    { name: "Forward Visibility", desc: "How far ahead income is already committed, booked, retained, or scheduled with reasonable certainty." },
    { name: "Income Variability", desc: "How sharply income moves between strong months and weak months." },
    { name: "Income Without Active Work", desc: "How much income would continue if active work stopped for 90 days." },
  ];

  return (
    <section
      ref={sectionRef}
      aria-label="What We Measure"
      className="relative"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        {/* Header */}
        <div
          className="text-center"
          style={{
            marginBottom: S.subtextMb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}
        >
          <h2
            className="text-[34px] md:text-[48px] font-bold"
            style={{ color: B.navy, letterSpacing: S.lsHeading, marginBottom: S.h2mb, lineHeight: S.lhHeading }}
          >
            What we measure
          </h2>
          <p
            className="text-[17px] md:text-[18px] mx-auto"
            style={{ color: "rgba(14,26,43,0.55)", lineHeight: S.lhBody, maxWidth: 580 }}
          >
            Your score is built from six fixed inputs. Together, they show how stable your income structure is and how well it holds up under pressure.
          </p>
        </div>

        {/* Factor rows */}
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {factors.map((f, i) => (
            <FactorRow
              key={f.name}
              num={i + 1}
              name={f.name}
              desc={f.desc}
              mobile={mobile}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center" style={{ marginTop: S.subtextMb }}>
          <p className="text-[12px] font-medium" style={{ color: B.light }}>
            Official Scoring Framework &#183; Model RP-2.0
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 9: SAMPLE OUTPUT                                            */
/* ================================================================== */
function SampleOutput() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Sample Result"
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        {/* Header */}
        <h2
          className="text-[32px] md:text-[40px]"
          style={{
            color: B.navy,
            fontWeight: 600,
            letterSpacing: S.lsHeading,
            marginBottom: S.subtextMb,
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          A sample result
        </h2>

        {/* Preview card */}
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease-out 100ms, transform 0.6s ease-out 100ms",
          }}
        >
          <div style={{
            backgroundColor: "#ffffff",
            border: "1px solid rgba(14,26,43,0.08)",
            borderRadius: S.panelRadius,
            padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
            boxShadow: "0 16px 48px rgba(14,26,43,0.08), 0 4px 12px rgba(14,26,43,0.04)",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Top accent */}
            <div style={{ position: "absolute", top: 0, left: 20, right: 20, height: 3, borderRadius: "0 0 3px 3px", background: B.gradient }} />

            {/* Score */}
            <div className="text-[10px] uppercase" style={{ color: B.light, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 10, marginTop: 8 }}>
              Income Stability Score&#8482;
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
              <span className="text-[40px]" style={{ fontWeight: 700, color: B.navy, lineHeight: 1 }}>78</span>
              <span className="text-[15px]" style={{ fontWeight: 600, color: B.teal }}>Established Stability</span>
            </div>
            <div className="text-[12px]" style={{ color: B.muted, marginBottom: 24 }}>
              <span style={{ fontWeight: 600, color: B.navy }}>72nd percentile</span> within Professional Services
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(14,26,43,0.06)", marginBottom: 20 }} />

            {/* Income Continuity */}
            <div className="text-[10px] uppercase" style={{ color: B.teal, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 8 }}>
              Income Continuity
            </div>
            <p className="text-[14px]" style={{ color: "rgba(14,26,43,0.70)", lineHeight: 1.6, marginBottom: 6 }}>
              38% of income continues without active work
            </p>
            <p className="text-[14px]" style={{ color: "rgba(14,26,43,0.70)", lineHeight: 1.6, marginBottom: 24 }}>
              Estimated continuity window: 4 months
            </p>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(14,26,43,0.06)", marginBottom: 20 }} />

            {/* Stress Scenario */}
            <div className="text-[10px] uppercase" style={{ color: B.navy, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 10 }}>
              Stress Scenario
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span className="text-[24px]" style={{ fontWeight: 700, color: B.navy }}>78</span>
              <span className="text-[14px]" style={{ color: B.light }}>&rarr;</span>
              <span className="text-[24px]" style={{ fontWeight: 700, color: "#DC2626" }}>56</span>
            </div>
            <p className="text-[13px]" style={{ color: "rgba(14,26,43,0.55)", lineHeight: 1.6, marginBottom: 24 }}>
              If the largest income source were removed, the score would drop 22 points.
            </p>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(14,26,43,0.06)", marginBottom: 20 }} />

            {/* Main Structural Constraint */}
            <div className="text-[10px] uppercase" style={{ color: B.navy, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 8 }}>
              Main Constraint
            </div>
            <p className="text-[14px]" style={{ color: "rgba(14,26,43,0.70)", lineHeight: 1.6, marginBottom: 24 }}>
              Forward visibility
            </p>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(14,26,43,0.06)", marginBottom: 20 }} />

            {/* Best Improvement */}
            <div className="text-[10px] uppercase" style={{ color: B.teal, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 8 }}>
              Best Improvement
            </div>
            <p className="text-[14px]" style={{ color: "rgba(14,26,43,0.70)", lineHeight: 1.6, marginBottom: 24 }}>
              Extend forward commitments
            </p>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(14,26,43,0.06)", marginBottom: 20 }} />

            {/* How Resilient */}
            <div className="text-[10px] uppercase" style={{ color: B.navy, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 8 }}>
              How Resilient
            </div>
            <p className="text-[14px]" style={{ color: "rgba(14,26,43,0.70)", lineHeight: 1.6, marginBottom: 24 }}>
              Supported
            </p>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(14,26,43,0.06)", marginBottom: 20 }} />

            {/* Confidence */}
            <div className="text-[10px] uppercase" style={{ color: B.navy, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 8 }}>
              Confidence
            </div>
            <p className="text-[14px]" style={{ color: "rgba(14,26,43,0.70)", lineHeight: 1.6, marginBottom: 24 }}>
              High
            </p>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(14,26,43,0.06)", marginBottom: 20 }} />

            {/* Verification */}
            <div className="text-[10px] uppercase" style={{ color: B.light, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 6 }}>
              Verification
            </div>
            <p className="text-[13px]" style={{ color: "rgba(14,26,43,0.55)", lineHeight: 1.5 }}>
              Model RP-2.0
            </p>
          </div>
        </div>

        {/* Footer */}
        <p
          className="text-[13px] md:text-[14px]"
          style={{ color: B.muted, textAlign: "center", marginTop: 32, maxWidth: 560, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}
        >
          Every report includes score breakdown, structural risks, stress scenarios, improvement paths, and model-backed next steps.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 10: CLASSIFICATION SCALE                                    */
/* ================================================================== */
function ClassificationScale() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  const [activeTierIdx, setActiveTierIdx] = useState(2);

  const tiers = [
    { range: "0\u201329", label: "Limited", desc: "Your income structure is fragile and depends heavily on active work.", color: "#DC2626", sliderPos: 15, sampleScore: 20 },
    { range: "30\u201349", label: "Developing", desc: "Some support exists, but the structure is still exposed.", color: "#F59E0B", sliderPos: 40, sampleScore: 40 },
    { range: "50\u201374", label: "Established", desc: "Your income reflects meaningful stability and stronger protection.", color: B.teal, sliderPos: 62, sampleScore: 62 },
    { range: "75\u2013100", label: "High", desc: "Your income structure is durable and less dependent on constant effort.", color: B.navy, sliderPos: 88, sampleScore: 88 },
  ];

  const active = tiers[activeTierIdx];

  return (
    <section
      ref={ref}
      aria-label="Income Stability Classification Scale"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        {/* Header */}
        <div
          className="text-center"
          style={{
            marginBottom: S.subtextMb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 520ms ease-out, transform 520ms ease-out",
          }}
        >
          <h2
            className="text-[26px] sm:text-[34px] md:text-[40px] font-bold leading-tight"
            style={{ color: B.navy, marginBottom: S.h2mb }}
          >
            Income Stability Classification Scale
          </h2>
          <p className="text-base leading-relaxed mx-auto" style={{ color: B.muted, maxWidth: 640 }}>
            Every income structure receives a score from 0 to 100 and is placed into a fixed stability band under Model RP-2.0.
          </p>
        </div>

        {/* Spectrum bar */}
        <div className="mx-auto" style={{ maxWidth: 880, marginBottom: 0 }}>
          <div style={{ position: "relative" }}>
            <div style={{ height: 14, borderRadius: "10px 10px 0 0", background: B.gradient, boxShadow: "0 2px 12px rgba(14,26,43,0.12)" }} />
            {/* Tier separators — at 29, 49, 74 */}
            {[29, 49, 74].map((pos) => (
              <div
                key={pos}
                style={{
                  position: "absolute",
                  left: `${pos}%`,
                  top: 0,
                  width: 2,
                  height: 14,
                  backgroundColor: "rgba(255,255,255,0.45)",
                }}
              />
            ))}
            {/* Score marker */}
            <div style={{ position: "absolute", left: `${active.sliderPos}%`, top: -4, width: 22, height: 22, borderRadius: 999, border: "3px solid #fff", backgroundColor: active.color, transform: "translateX(-50%)", boxShadow: `0 2px 8px ${active.color}59`, transition: "left 400ms cubic-bezier(0.4,0,0.2,1), background-color 400ms ease, box-shadow 400ms ease" }} />
            {/* Tick labels */}
            <div className="flex justify-between px-1" style={{ marginTop: 6 }}>
              {[0, 20, 40, 60, 80, 100].map((tick) => (
                <span key={tick} className="text-[9px] font-medium" style={{ color: B.light }}>{tick}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Four tier cards */}
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(4, 1fr)", gap: S.gridGap, maxWidth: 880, margin: `${S.h1mb}px auto 0` }}>
          {tiers.map((tier, idx) => {
            const isActive = idx === activeTierIdx;
            return (
              <div
                key={tier.label}
                style={{
                  backgroundColor: isActive ? "#ffffff" : "rgba(255,255,255,0.7)",
                  backdropFilter: isActive ? "none" : "blur(8px)",
                  borderRadius: 14,
                  border: isActive ? `1.5px solid ${tier.color}` : "1px solid rgba(14,26,43,0.06)",
                  padding: "28px 22px 30px",
                  position: "relative" as const,
                  cursor: "pointer",
                  boxShadow: isActive
                    ? `0 4px 20px ${tier.color}1F, 0 12px 40px ${tier.color}0F`
                    : "0 1px 4px rgba(14,26,43,0.03), 0 4px 16px rgba(14,26,43,0.02)",
                  transform: isActive ? "translateY(-2px)" : "translateY(0)",
                  transition: "all 400ms cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={() => {
                  if (!canHover()) return;
                  setActiveTierIdx(idx);
                }}
              >
                {/* Active tier badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 10px",
                    borderRadius: 999,
                    backgroundColor: isActive ? `${tier.color}14` : "transparent",
                    marginBottom: 14,
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(-4px)",
                    transition: "opacity 300ms ease, transform 300ms ease, background-color 300ms ease",
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: tier.color }} />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.1em]" style={{ color: tier.color }}>
                    Sample: {tier.sampleScore}
                  </span>
                </div>

                {/* Color accent + range */}
                <div className="flex items-center gap-3 mb-3">
                  <div style={{ width: 4, height: 36, borderRadius: 4, backgroundColor: tier.color }} />
                  <div className="text-[26px] font-bold leading-none" style={{ color: B.navy }}>{tier.range}</div>
                </div>

                {/* Tier label */}
                <div className="text-[15px] font-semibold mb-1" style={{ color: tier.color }}>
                  {tier.label} Stability
                </div>

                {/* Description */}
                <p className="text-[12px] leading-[1.7]" style={{ color: B.muted }}>
                  {tier.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center" style={{ marginTop: S.subtextMb }}>
          <p className="text-[12px] font-medium" style={{ color: B.muted }}>
            Band thresholds are fixed under Model RP-2.0. The same answers produce the same score every time.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 11: BY INCOME TYPE                                          */
/* ================================================================== */
function ByIncomeType() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const types = [
    "Project-based: weak point is usually continuity and forward visibility.",
    "Commission-based: weak point is usually concentration and earnings variability.",
    "Private practice: weak point is usually interruption sensitivity.",
    "Agency: weak point is usually dependence on a small number of major clients.",
    "Creator and hybrid: weak point is usually platform dependence and uneven continuity.",
  ];

  return (
    <section
      ref={ref}
      aria-label="Stability by Income Type"
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        <div
          style={{
            maxWidth: 680,
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 520ms ease-out, transform 520ms ease-out",
          }}
        >
          <h2
            className="text-[30px] md:text-[40px]"
            style={{
              color: B.navy,
              fontWeight: 600,
              lineHeight: S.lhHeading,
              letterSpacing: S.lsHeading,
              marginBottom: S.h2mb,
            }}
          >
            Stability differs across income models
          </h2>
          <p
            className="text-[16px] md:text-[18px]"
            style={{ color: "rgba(14,26,43,0.70)", lineHeight: S.lhBody, marginBottom: S.subtextMb }}
          >
            The model stays fixed. The weak point changes by income type.
          </p>

          <div style={{ textAlign: "left", maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            {types.map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "14px 0",
                  borderBottom: "1px solid rgba(14,26,43,0.06)",
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: B.teal, marginTop: 8, flexShrink: 0 }} />
                <p className="text-[15px] md:text-[16px]" style={{ color: "rgba(14,26,43,0.65)", lineHeight: 1.6 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>

          <p
            className="text-[15px] md:text-[16px]"
            style={{ color: "rgba(14,26,43,0.70)", lineHeight: S.lhBody, marginTop: 32, fontWeight: 500 }}
          >
            RunPayway&#8482; applies the same model across income structures while identifying the pressures that matter most in each case.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 12: TRUST / GOVERNANCE                                      */
/* ================================================================== */
function ModelGovernance() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Model Governance"
      style={{
        backgroundColor: B.purple,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1, paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop, textAlign: "center" }}>
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.48s ease-out, transform 0.48s ease-out",
          }}
        >
          <h2
            className="text-[32px] md:text-[40px]"
            style={{
              color: "#F4F1EA",
              fontWeight: 600,
              lineHeight: S.lhHeading,
              letterSpacing: S.lsHeading,
              marginBottom: S.h2mb,
            }}
          >
            Model governance
          </h2>

          <div style={{ maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
            <p className="text-[16px] md:text-[18px]" style={{ color: "rgba(244,241,234,0.75)", fontWeight: 400, lineHeight: S.lhBody, marginBottom: S.paraMb }}>
              The rules behind the score are fixed under Model RP-2.0.
            </p>
            <p className="text-[16px] md:text-[18px]" style={{ color: "rgba(244,241,234,0.75)", fontWeight: 400, lineHeight: S.lhBody, marginBottom: S.paraMb }}>
              The same answers produce the same score, sub-scores, band, and structural outputs every time.
            </p>
            <p className="text-[16px] md:text-[18px]" style={{ color: "rgba(244,241,234,0.75)", fontWeight: 500, lineHeight: S.lhBody, marginBottom: S.paraMb }}>
              RunPayway&#8482; does not use AI to calculate assessment results.
            </p>
            <p className="text-[16px] md:text-[18px]" style={{ color: "rgba(244,241,234,0.75)", fontWeight: 400, lineHeight: S.lhBody, marginBottom: S.paraMb }}>
              Scoring, penalties, scenarios, and classifications are generated from fixed model rules active at the time of assessment.
            </p>
            <p className="text-[16px] md:text-[18px]" style={{ color: "rgba(244,241,234,0.75)", fontWeight: 400, lineHeight: S.lhBody }}>
              If the scoring framework changes, it becomes a new version.
            </p>
          </div>
        </div>

        {/* Governance reference panel */}
        <article
          style={{
            marginTop: S.subtextMb,
            width: "100%",
            maxWidth: 420,
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "left",
            backgroundColor: "#ffffff",
            border: "1px solid rgba(14,26,43,0.10)",
            borderRadius: S.panelRadius,
            padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
            boxShadow: "0 16px 44px rgba(0,0,0,0.08)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.48s ease-out 80ms, transform 0.48s ease-out 80ms",
          }}
        >
          {/* Top accent */}
          <div style={{ width: "100%", height: 2, background: `linear-gradient(90deg, ${B.purple} 0%, transparent 60%)`, borderRadius: 2, marginBottom: 16 }} />

          {/* Panel header */}
          <div
            className="text-[12px] uppercase"
            style={{ color: B.teal, fontWeight: 500, letterSpacing: S.lsLabel, marginBottom: 10 }}
          >
            Model Version
          </div>

          {/* Version value */}
          <div
            className="text-[24px] md:text-[28px]"
            style={{ color: B.navy, fontWeight: 600, letterSpacing: "0.01em", marginBottom: 14 }}
          >
            RP-2.0
          </div>

          {/* Supporting line */}
          <p className="text-[15px]" style={{ color: "rgba(14,26,43,0.55)", fontWeight: 400, lineHeight: 1.6 }}>
            The scoring framework used for this assessment.
          </p>
        </article>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 13: PRICING / CTA                                           */
/* ================================================================== */
function PricingCta() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Get Your Income Stability Score"
      className="relative navy-grain"
      style={{ background: `linear-gradient(180deg, ${B.navy} 0%, #1A1540 40%, ${B.purple} 100%)` }}
    >
      {/* Ambient glows */}
      <div style={{ position: "absolute", top: "-25%", left: "50%", width: 800, height: 800, borderRadius: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle, rgba(75,63,174,0.14) 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* Concentric scoring halos */}
      <div className="absolute pointer-events-none" style={{ width: 320, height: 320, borderRadius: "50%", border: "1px solid rgba(244,241,234,0.06)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
      <div className="absolute pointer-events-none" style={{ width: 520, height: 520, borderRadius: "50%", border: "1px solid rgba(244,241,234,0.08)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
      <div className="absolute pointer-events-none" style={{ width: 720, height: 720, borderRadius: "50%", border: "1px solid rgba(244,241,234,0.04)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />

      <div
        className="relative mx-auto text-center"
        style={{
          maxWidth: S.maxW,
          paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
          paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
        }}
      >
        <div
          className="mx-auto md:px-0 sm:px-8 px-6"
          style={{
            maxWidth: 700,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 520ms ease-out, transform 520ms ease-out",
          }}
        >
          {/* Heading */}
          <h2
            className="font-semibold text-[34px] md:text-[44px] lg:text-[52px]"
            style={{
              color: "#F4F1EA",
              lineHeight: S.lhHeading,
              letterSpacing: S.lsHero,
              maxWidth: 640,
              margin: `0 auto ${S.h2mb}px auto`,
            }}
          >
            Measure the structure behind your income
          </h2>

          {/* Supporting line */}
          <p
            className="text-[17px] md:text-[19px] lg:text-[20px]"
            style={{
              color: "rgba(244,241,234,0.80)",
              lineHeight: S.lhBody,
              maxWidth: 560,
              margin: `0 auto ${S.subtextMb}px auto`,
            }}
          >
            See how stable your income structure is, where it is exposed, and what would strengthen it.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link
              href="/pricing"
              className="cta-tick inline-flex items-center justify-center font-semibold
                         focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                height: S.ctaH,
                minWidth: mobile ? 0 : 320,
                width: mobile ? "100%" : "auto",
                paddingLeft: S.ctaPadX,
                paddingRight: S.ctaPadX,
                borderRadius: S.ctaRadius,
                background: "linear-gradient(135deg, #F4F1EA 0%, #EDECEA 100%)",
                color: B.navy,
                fontSize: 16,
                letterSpacing: "-0.01em",
                border: "1px solid rgba(244,241,234,0.92)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 12px 32px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.15)",
                transition: "background-color 180ms ease, border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease",
              }}
              onMouseEnter={(e) => {
                if (!canHover()) return;
                const el = e.currentTarget;
                el.style.background = "linear-gradient(135deg, #EDECEA 0%, #E5E2DA 100%)";
                el.style.transform = "translateY(-2px)";
                el.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.5), 0 16px 40px rgba(0,0,0,0.30), 0 2px 8px rgba(0,0,0,0.18)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = "linear-gradient(135deg, #F4F1EA 0%, #EDECEA 100%)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.5), 0 12px 32px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.15)";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <span className="tick tick-navy" />
              <span className="cta-label">Get My Income Stability Score&#8482;</span>
              <span className="cta-arrow cta-arrow-navy" />
            </Link>
          </div>

          {/* Pricing anchor */}
          <p
            style={{
              fontWeight: 500,
              fontSize: 16,
              color: "rgba(244,241,234,0.85)",
              marginTop: 14,
              marginBottom: 4,
            }}
          >
            Single Assessment &#8212; $39
          </p>

          {/* Subline */}
          <p
            className="text-[14px] md:text-[15px]"
            style={{
              color: "rgba(244,241,234,0.66)",
              lineHeight: 1.6,
            }}
          >
            Fixed score &#183; Full structural diagnostic &#183; Instant report
          </p>

          {/* Microcopy */}
          <p
            className="text-[13px] md:text-[14px]"
            style={{
              color: "rgba(244,241,234,0.50)",
              lineHeight: 1.6,
              marginTop: 8,
            }}
          >
            Average completion: under 2 minutes
          </p>

          {/* Reassurance */}
          <p
            className="text-[11px] md:text-[12px]"
            style={{
              color: "rgba(244,241,234,0.40)",
              lineHeight: 1.6,
              marginTop: 12,
              letterSpacing: "0.04em",
            }}
          >
            No bank connection required &#183; No credit pull &#183; Private by default
          </p>
        </div>
      </div>

      {/* Mobile overrides */}
      <style>{`
        @media (max-width: 768px) {
          section[aria-label="Get Your Income Stability Score"] > div:last-of-type {
            padding-top: 80px !important;
            padding-bottom: 80px !important;
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
          section[aria-label="Get Your Income Stability Score"] a {
            min-width: 0 !important;
            width: 100% !important;
            height: 52px !important;
          }
        }
      `}</style>
    </section>
  );
}


/* ================================================================== */
/* SECTION 14: FAQ                                                     */
/* ================================================================== */
function FaqSection({ openFaq, setOpenFaq }: { openFaq: number | null; setOpenFaq: (v: number | null) => void }) {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const faqItems = [
    { q: "What does the Income Stability Score\u2122 measure?", a: "It measures how stable your income structure is based on recurring or continuing income, concentration, source diversity, forward visibility, income variability, and continuity without active labor." },
    { q: "How long does the assessment take?", a: "Most users complete it in under two minutes." },
    { q: "What is included in the report?", a: "Your report includes your score, stability band, structural breakdown, primary structural constraint, fragility profile, stress scenarios, improvement path, reassessment triggers, and verification status." },
    { q: "Can I retake the assessment?", a: "Yes. You can retake it after a meaningful structural change to your income setup." },
    { q: "How is my data handled?", a: "No bank connection is required. Your assessment data is private by default and handled according to our privacy and security policies." },
    { q: "Do I need exact financial records?", a: "No. The assessment is designed to work from informed estimates. More accurate inputs produce more precise results, but exact bookkeeping is not required." },
  ];

  return (
    <section
      ref={ref}
      aria-label="FAQ"
      className="relative overflow-hidden navy-grain"
      style={{
        backgroundColor: B.navy,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      {/* Ambient glows */}
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(75,63,174,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-15%", left: "-8%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(31,109,122,0.05) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1, paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        {/* Header */}
        <div
          style={{
            textAlign: mobile ? "left" : "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <h2
            style={{
              textAlign: mobile ? "left" : "center",
              fontSize: mobile ? 32 : 40,
              color: "#F4F1EA",
              fontWeight: 600,
              lineHeight: S.lhHeading,
              letterSpacing: S.lsHeading,
              marginBottom: S.subtextMb,
            }}
          >
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ list */}
        <div
          className="mx-auto"
          style={{
            maxWidth: 820,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.5s ease-out 80ms, transform 0.5s ease-out 80ms",
          }}
        >
          {faqItems.map((item, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.10)",
                  borderBottom: i === faqItems.length - 1 ? "1px solid rgba(255,255,255,0.10)" : "none",
                  backgroundColor: isOpen ? "rgba(75,63,174,0.04)" : "transparent",
                  transition: "border-color 180ms ease, background-color 180ms ease",
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left group"
                  style={{ padding: "26px 0", gap: 24 }}
                  aria-expanded={isOpen}
                >
                  <span
                    className="text-[17px] md:text-[20px] group-hover:!text-[#F4F1EA] transition-colors duration-[180ms]"
                    style={{
                      color: isOpen ? "#F4F1EA" : "rgba(244,241,234,0.88)",
                      fontWeight: 500,
                      lineHeight: 1.45,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.q}
                  </span>
                  {/* Plus/minus indicator */}
                  <svg
                    width="16" height="16" viewBox="0 0 16 16" fill="none"
                    className="shrink-0 transition-colors duration-[180ms] group-hover:!stroke-[rgba(244,241,234,0.9)]"
                    stroke="rgba(244,241,234,0.72)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    {!isOpen && <line x1="8" y1="2" x2="8" y2="14" />}
                    <line x1="2" y1="8" x2="14" y2="8" />
                  </svg>
                </button>
                {/* Answer area */}
                <div
                  className="overflow-hidden transition-all duration-[220ms] ease-in-out"
                  style={{ maxHeight: isOpen ? 300 : 0, opacity: isOpen ? 1 : 0 }}
                >
                  <p
                    className="text-[15px] md:text-[16px]"
                    style={{
                      color: "rgba(244,241,234,0.76)",
                      fontWeight: 400,
                      lineHeight: 1.75,
                      maxWidth: 680,
                      paddingTop: 14,
                      paddingRight: mobile ? 16 : 48,
                      paddingBottom: 20,
                    }}
                  >
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA link */}
        <div style={{ textAlign: "center", marginTop: S.subtextMb }}>
          <Link
            href="/pricing"
            className="text-[15px] font-semibold"
            style={{ color: "rgba(244,241,234,0.85)", textDecoration: "underline", textUnderlineOffset: 4, letterSpacing: "-0.01em" }}
          >
            Get My Income Stability Score&#8482; &#8594;
          </Link>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 15: DISCLAIMER                                              */
/* ================================================================== */
function Disclaimer() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Global Disclaimer"
      className="relative overflow-hidden"
      style={{ background: B.navy }}
    >
      <div
        className="relative mx-auto"
        style={{
          maxWidth: S.maxW,
          paddingTop: mobile ? S.disclaimerY.mobile : S.disclaimerY.desktop,
          paddingBottom: mobile ? S.disclaimerY.mobile : S.disclaimerY.desktop,
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 360ms ease-out, transform 360ms ease-out",
        }}
      >
        {/* Structural divider */}
        <div
          style={{
            height: 1,
            width: "100%",
            background: "linear-gradient(90deg, transparent, rgba(244,241,234,0.12), transparent)",
            marginBottom: 36,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />

        {/* Label */}
        <h2
          className="font-semibold uppercase text-[11px] md:text-[12px]"
          style={{
            color: "#ffffff",
            letterSpacing: S.lsLabel,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          Global Disclaimer
        </h2>

        {/* Disclosure text */}
        <div style={{ maxWidth: 720, marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
          <p
            className="text-[14px] md:text-[15px]"
            style={{
              color: "rgba(244,241,234,0.55)",
              lineHeight: S.lhBody,
              marginBottom: 10,
            }}
          >
            The Income Stability Score&#8482; is a fixed structural income assessment based on information provided by the user.
          </p>
          <p
            className="text-[14px] md:text-[15px]"
            style={{
              color: "rgba(244,241,234,0.55)",
              lineHeight: 1.7,
            }}
          >
            It is not financial advice, investment advice, credit underwriting, or a prediction of future financial outcomes.
          </p>
        </div>
      </div>

      {/* Mobile overrides */}
      <style>{`
        @media (max-width: 768px) {
          section[aria-label="Global Disclaimer"] > div:nth-child(2) {
            padding-top: 48px !important;
            padding-bottom: 48px !important;
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          section[aria-label="Global Disclaimer"] [style*="transition"] {
            transition: opacity 360ms ease-out !important;
          }
        }
      `}</style>
    </section>
  );
}


/* ================================================================== */
/* MAIN LANDING PAGE                                                   */
/* ================================================================== */
export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="overflow-x-hidden">

      {/* ============ SECTION 2: HERO ============ */}
      <HeroSection />

      {/* ============ SECTION 3: FAST COMPARISON ============ */}
      <FastComparison />

      {/* ============ SECTION 4: WHO IT IS FOR ============ */}
      <WhoItIsFor />

      {/* ============ SECTION 5: WHY IT MATTERS ============ */}
      <WhyItMatters />

      {/* ============ SECTION 6: WHAT YOU RECEIVE ============ */}
      <WhatYouReceive />

      {/* ============ SECTION 7: HOW IT WORKS ============ */}
      <HowItWorks />

      {/* ============ SECTION 8: WHAT WE MEASURE ============ */}
      <WhatWeMeasure />

      {/* ============ SECTION 9: SAMPLE OUTPUT ============ */}
      <SampleOutput />

      {/* ============ SECTION 10: CLASSIFICATION SCALE ============ */}
      <ClassificationScale />

      {/* ============ SECTION 11: BY INCOME TYPE ============ */}
      <ByIncomeType />

      {/* ============ SECTION 12: MODEL GOVERNANCE ============ */}
      <ModelGovernance />

      {/* ============ SECTION 13: PRICING / CTA ============ */}
      <PricingCta />

      {/* ============ SECTION 14: FAQ ============ */}
      <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />

      {/* ============ SECTION 15: DISCLAIMER ============ */}
      <Disclaimer />
    </div>
  );
}
