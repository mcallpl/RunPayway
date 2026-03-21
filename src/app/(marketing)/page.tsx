"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

/* Animated counter hook — counts from 0 to target when triggered */
function useAnimatedCounter(target: number, trigger: boolean, duration = 1200) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger, target, duration]);

  return value;
}

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#FAF9F7",
  sandDk: "#F4F1EA",
  offWhite: "#FEFDFB",
  muted: "#4B5563",
  light: "#9CA3AF",
  border: "#E6E9EF",
  gradient: "linear-gradient(135deg, #0E1A2B 0%, #1A1540 40%, #4B3FAE 70%, #1F6D7A 100%)",
};

/* ────────────────────────────────────────────────────────────────────
   DESIGN TOKENS — Enterprise spacing scale (8px base unit)
   Every value is deliberate. Nothing is arbitrary.
   ──────────────────────────────────────────────────────────────────── */
const S = {
  sectionY:     { desktop: 160, mobile: 88 },
  sectionYsm:   { desktop: 120, mobile: 72 },
  transitionY:  { desktop: 72, mobile: 48 },
  disclaimerY:  { desktop: 24, mobile: 16 },

  maxW:         1060,
  padX:         { desktop: 48, mobile: 24 },

  h1mb:         28,
  h2mb:         24,
  subtextMb:    56,
  paraMb:       24,
  labelMb:      16,

  cardPad:      { desktop: 36, mobile: 24 },
  cardRadius:   16,
  panelRadius:  20,
  gridGap:      24,
  gridGapSm:    16,

  ctaH:         56,
  ctaHsm:       46,
  ctaPadX:      32,
  ctaRadius:    14,

  lhHeading:    1.08,
  lhBody:       1.75,
  lhDense:      1.5,

  lsHeading:    "-0.025em",
  lsHero:       "-0.035em",
  lsLabel:      "0.14em",
};

const spaciousY = { desktop: 200, mobile: 100 };


/* ================================================================== */
/* FLOATING PARTICLES — Canvas-based background animation              */
/* ================================================================== */
function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; r: number; o: number }>>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };
    resize();

    /* Initialize particles */
    const count = 35;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.3,
      r: 1 + Math.random() * 1.5,
      o: 0.08 + Math.random() * 0.18,
    }));

    const animate = () => {
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      ctx.clearRect(0, 0, cw, ch);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;

        /* Wrap around edges */
        if (p.x < -10) p.x = cw + 10;
        if (p.x > cw + 10) p.x = -10;
        if (p.y < -10) p.y = ch + 10;
        if (p.y > ch + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.o})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}


/* ================================================================== */
/* ANIMATED SCORE RING — SVG with stroke-dasharray animation           */
/* ================================================================== */
function AnimatedScoreRing({ visible, mobile }: { visible: boolean; mobile: boolean }) {
  const score = 78;
  const radius = 70;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = (1 - score / 100) * circumference;
  const animatedScore = useAnimatedCounter(score, visible, 1500);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setShowLabel(true), 1600);
    return () => clearTimeout(timer);
  }, [visible]);

  const size = mobile ? 220 : 280;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={visible ? targetOffset : circumference}
            style={{
              transition: `stroke-dashoffset 2s cubic-bezier(0.22, 1, 0.36, 1)`,
            }}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={B.teal} />
              <stop offset="50%" stopColor={B.purple} />
              <stop offset="100%" stopColor="#7B6FE0" />
            </linearGradient>
          </defs>
        </svg>
        {/* Score number */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: mobile ? 52 : 64,
              fontWeight: 700,
              color: "#F4F1EA",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {animatedScore}
          </span>
        </div>
      </div>

      {/* Band label */}
      <div
        style={{
          textAlign: "center",
          marginTop: 16,
          opacity: showLabel ? 1 : 0,
          transform: showLabel ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 500ms ease-out, transform 500ms ease-out",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            borderRadius: 100,
            backgroundColor: "rgba(31,109,122,0.15)",
            border: "1px solid rgba(31,109,122,0.25)",
            marginBottom: 8,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: B.teal }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: B.teal, letterSpacing: "-0.01em" }}>
            High Stability
          </span>
        </div>
        <div style={{ fontSize: 13, color: "rgba(244,241,234,0.50)", fontWeight: 500 }}>
          72nd percentile
        </div>
      </div>
    </div>
  );
}


/* ================================================================== */
/* SECTION 1: HERO                                                     */
/* ================================================================== */
function HeroSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Hero"
      className="relative overflow-hidden"
      style={{
        background: B.gradient,
      }}
    >
      {/* Gradient mesh — layered radial gradients for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 70% 20%, rgba(75,63,174,0.25) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 20% 80%, rgba(31,109,122,0.18) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(75,63,174,0.08) 0%, transparent 50%)
          `,
        }}
      />

      {/* Animated shimmer overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.02) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 8s ease-in-out infinite",
        }}
      />

      {/* Floating particles canvas */}
      <FloatingParticles />

      {/* Ambient glows */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 900, height: 900, borderRadius: "50%",
          top: "-30%", right: "-15%",
          background: "radial-gradient(circle, rgba(75,63,174,0.18) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 700, height: 700, borderRadius: "50%",
          bottom: "-20%", left: "-10%",
          background: "radial-gradient(circle, rgba(31,109,122,0.12) 0%, transparent 60%)",
        }}
      />

      <div
        className="relative mx-auto"
        style={{
          maxWidth: S.maxW,
          paddingTop: mobile ? spaciousY.mobile + 24 : spaciousY.desktop + 40,
          paddingBottom: mobile ? spaciousY.mobile : spaciousY.desktop,
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
        }}
      >
        <div
          style={{
            display: mobile ? "block" : "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 64,
          }}
        >
          {/* LEFT SIDE — Text content */}
          <div style={{ flex: 1, textAlign: mobile ? "center" : "left" }}>
            {/* Eyebrow */}
            <div
              className="font-medium uppercase text-[11px] md:text-[12px]"
              style={{
                letterSpacing: S.lsLabel,
                color: "rgba(31,109,122,0.85)",
                marginBottom: S.h2mb,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 500ms ease-out, transform 500ms ease-out",
              }}
            >
              Income Stability Score&#8482;
            </div>

            {/* Headline */}
            <h1
              className="font-semibold"
              style={{
                fontSize: mobile ? 32 : 48,
                color: "#F4F1EA",
                lineHeight: S.lhHeading,
                letterSpacing: S.lsHero,
                marginBottom: S.h1mb,
                maxWidth: mobile ? undefined : 540,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 600ms ease-out 100ms, transform 600ms ease-out 100ms",
              }}
            >
              The fixed standard for measuring income structure stability.
            </h1>

            {/* Body */}
            <p
              className="text-[15px] md:text-[17px]"
              style={{
                color: "rgba(244,241,234,0.75)",
                lineHeight: S.lhBody,
                marginBottom: S.paraMb + 8,
                maxWidth: mobile ? undefined : 480,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 600ms ease-out 200ms, transform 600ms ease-out 200ms",
              }}
            >
              RunPayway&#8482; measures the structure behind your income &#8212; how much repeats, how concentrated it is, how far ahead it is secured, and how much continues without active work.
            </p>

            {/* CTA Button */}
            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 500ms ease-out 350ms, transform 500ms ease-out 350ms",
              }}
            >
              <Link
                href="/pricing"
                className="cta-tick inline-flex items-center justify-center font-semibold
                           focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  height: S.ctaH,
                  width: mobile ? "100%" : "auto",
                  paddingLeft: S.cardPad.desktop,
                  paddingRight: S.cardPad.desktop,
                  borderRadius: S.ctaRadius,
                  background: "linear-gradient(135deg, #F4F1EA 0%, #EDECEA 100%)",
                  color: B.navy,
                  fontSize: 15,
                  letterSpacing: "-0.01em",
                  border: "1px solid rgba(244,241,234,0.92)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 12px 32px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.15)",
                  transition: "background 180ms ease, transform 180ms ease, box-shadow 180ms ease",
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
                onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <span className="tick tick-navy" />
                <span className="cta-label">Get My Income Stability Score&#8482;</span>
                <span className="cta-arrow cta-arrow-navy" />
              </Link>

              <p
                className="text-[13px] md:text-[14px]"
                style={{ color: "rgba(244,241,234,0.50)", marginTop: 14, letterSpacing: "0.01em", textAlign: mobile ? "center" : "left" }}
              >
                Under 2 minutes &#183; Instant report &#183; No bank connection required
              </p>
            </div>
          </div>

          {/* RIGHT SIDE — Animated Score Ring */}
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              justifyContent: "center",
              marginTop: mobile ? 56 : 0,
              opacity: visible ? 1 : 0,
              transition: "opacity 800ms ease-out 400ms",
            }}
          >
            <AnimatedScoreRing visible={visible} mobile={mobile} />
          </div>
        </div>

        {/* Proof strip */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: mobile ? 12 : 24,
            marginTop: mobile ? 48 : 72,
            opacity: visible ? 1 : 0,
            transition: "opacity 600ms ease-out 600ms",
          }}
        >
          {["Same answers, same score", "No AI in scoring", "No bank connection", "Private by default"].map((item, i) => (
            <span
              key={item}
              className="text-[11px] md:text-[12px]"
              style={{
                color: "rgba(244,241,234,0.40)",
                fontWeight: 500,
                letterSpacing: "0.02em",
                display: "flex",
                alignItems: "center",
                gap: 0,
              }}
            >
              {i > 0 && <span style={{ color: "rgba(244,241,234,0.20)" }}></span>}
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0%, 100% { background-position: -200% 0; }
          50% { background-position: 200% 0; }
        }
      `}</style>
    </section>
  );
}


/* ================================================================== */
/* SECTION 2: COMPARISON                                               */
/* ================================================================== */
function ComparisonSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Comparison"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        {/* Title */}
        <h2
          className="text-[30px] md:text-[40px]"
          style={{
            color: B.navy,
            fontWeight: 600,
            lineHeight: S.lhHeading,
            letterSpacing: S.lsHeading,
            marginBottom: mobile ? 32 : 48,
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          What most scores miss
        </h2>

        {/* Comparison cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
            gap: S.gridGap,
            maxWidth: 820,
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: mobile ? 32 : 48,
          }}
        >
          {/* Credit Score card */}
          <div
            style={{
              backgroundColor: B.sand,
              borderRadius: S.cardRadius,
              padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
              border: `1px solid ${B.border}`,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease-out 100ms, transform 0.6s ease-out 100ms",
            }}
          >
            <div
              className="text-[11px] uppercase"
              style={{ color: B.muted, fontWeight: 500, letterSpacing: S.lsLabel, marginBottom: 14 }}
            >
              Credit Score
            </div>
            <p className="text-[15px] md:text-[16px]" style={{ color: "rgba(14,26,43,0.65)", lineHeight: 1.7 }}>
              Measures how reliably you repay debt.
            </p>
          </div>

          {/* Income Stability Score card */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: S.cardRadius,
              padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
              border: "1px solid rgba(75,63,174,0.15)",
              boxShadow: "0 4px 16px rgba(75,63,174,0.06)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease-out 200ms, transform 0.6s ease-out 200ms",
            }}
          >
            <div
              className="text-[11px] uppercase"
              style={{ color: B.teal, fontWeight: 500, letterSpacing: S.lsLabel, marginBottom: 14 }}
            >
              Income Stability Score&#8482;
            </div>
            <p className="text-[15px] md:text-[16px]" style={{ color: "rgba(14,26,43,0.75)", lineHeight: 1.7 }}>
              Measures how stable your income structure is.
            </p>
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
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.5s ease-out 300ms, transform 0.5s ease-out 300ms",
          }}
        >
          <p
            className="text-[15px] md:text-[17px]"
            style={{ color: "rgba(14,26,43,0.65)", lineHeight: S.lhBody, marginBottom: S.paraMb }}
          >
            A credit score does not show whether your income could survive the loss of a major source, how much is already lined up ahead, or how much would continue if active work stopped.
          </p>
          <p
            className="text-[17px] md:text-[19px]"
            style={{ color: B.navy, fontWeight: 500, lineHeight: S.lhDense, letterSpacing: "-0.01em" }}
          >
            RunPayway measures that gap.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3: WHO IT IS FOR                                            */
/* ================================================================== */
function WhoItIsForSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const industries = "Real Estate \u00b7 Finance \u00b7 Insurance \u00b7 Technology \u00b7 Healthcare \u00b7 Legal \u00b7 Consulting \u00b7 Sales \u00b7 Media \u00b7 Construction \u00b7 Retail \u00b7 Hospitality \u00b7 Transportation \u00b7 Manufacturing \u00b7 Education \u00b7 Nonprofit \u00b7 Agriculture \u00b7 Energy \u00b7 and more";

  return (
    <section
      ref={ref}
      aria-label="Who It Is For"
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? S.sectionYsm.mobile : S.sectionYsm.desktop,
        paddingBottom: mobile ? S.sectionYsm.mobile : S.sectionYsm.desktop,
        overflow: "hidden",
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
            transform: visible ? "translateY(0)" : "translateY(18px)",
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
            Built for income that does not fit simple scoring
          </h2>

          <p
            className="text-[16px] md:text-[18px]"
            style={{ color: "rgba(14,26,43,0.70)", lineHeight: S.lhBody }}
          >
            RunPayway is designed for business owners, self-employed professionals, commission earners, consultants, agency operators, private practitioners, creators, and anyone whose income depends on clients, contracts, or active effort.
          </p>
        </div>
      </div>

      {/* Industry trust marquee */}
      <div
        style={{
          marginTop: mobile ? 40 : 56,
          opacity: visible ? 1 : 0,
          transition: "opacity 600ms ease-out 300ms",
        }}
      >
        <p
          className="text-[12px] md:text-[13px]"
          style={{
            color: B.light,
            textAlign: "center",
            fontWeight: 500,
            letterSpacing: "0.04em",
            marginBottom: 16,
          }}
        >
          Built for professionals across 19 industries
        </p>
        <div style={{ overflow: "hidden", width: "100%" }}>
          <div
            style={{
              display: "flex",
              width: "max-content",
              animation: "marquee 35s linear infinite",
            }}
          >
            <span
              className="text-[14px] md:text-[15px]"
              style={{
                color: B.light,
                whiteSpace: "nowrap",
                paddingRight: 48,
                letterSpacing: "0.02em",
              }}
            >
              {industries}
            </span>
            <span
              className="text-[14px] md:text-[15px]"
              style={{
                color: B.light,
                whiteSpace: "nowrap",
                paddingRight: 48,
                letterSpacing: "0.02em",
              }}
            >
              {industries}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}


/* ================================================================== */
/* SECTION 4: WHAT YOUR REPORT INCLUDES                                */
/* ================================================================== */
function WhatYourReportIncludesSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const pages = [
    { title: "Your Score", desc: "Overall score, stability band, resilience profile, and confidence level." },
    { title: "Why You Scored There", desc: "The main drivers, the primary constraint, and what is helping or holding the score down." },
    { title: "Where the Structure Is Exposed", desc: "Stress scenarios, income mix, and the areas most vulnerable to disruption." },
    { title: "How to Improve", desc: "Projected improvements, prioritized next moves tailored to your industry." },
    { title: "What to Do Next", desc: "90-day checklist, reassessment triggers, and benchmark context." },
  ];

  return (
    <section
      ref={ref}
      aria-label="What Your Report Includes"
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
            transform: visible ? "translateY(0)" : "translateY(18px)",
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
            What your report includes
          </h2>
          <p
            className="text-[16px] md:text-[18px] mx-auto"
            style={{ color: "rgba(14,26,43,0.70)", lineHeight: S.lhBody, maxWidth: 640 }}
          >
            A 5-page structural diagnostic that shows your score, explains what drives it, identifies where the structure is exposed, and shows what to strengthen next.
          </p>
        </div>

        {/* Pages list */}
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
          }}
        >
          {pages.map((page, i) => (
            <div
              key={page.title}
              style={{
                display: "flex",
                alignItems: mobile ? "flex-start" : "center",
                gap: mobile ? 16 : 28,
                padding: mobile ? "20px 0" : "24px 0",
                borderLeft: `3px solid ${i === 0 && visible ? B.purple : visible ? "rgba(75,63,174,0.15)" : "transparent"}`,
                paddingLeft: mobile ? 16 : 24,
                borderBottom: "1px solid rgba(14,26,43,0.06)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(14px)",
                transition: `opacity 500ms ease-out ${100 + i * 80}ms, transform 500ms ease-out ${100 + i * 80}ms, border-color 300ms ease`,
              }}
            >
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
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  className="text-[16px] md:text-[17px] font-semibold"
                  style={{ color: B.navy, lineHeight: 1.3, marginBottom: 6 }}
                >
                  {page.title}
                </div>
                <p
                  className="text-[14px] md:text-[15px]"
                  style={{ color: "rgba(14,26,43,0.55)", lineHeight: 1.6 }}
                >
                  {page.desc}
                </p>
              </div>
            </div>
          ))}

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
/* SECTION 5: SAMPLE RESULT                                            */
/* ================================================================== */
function SampleResultSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  /* Animated counters */
  const scoreCount = useAnimatedCounter(78, visible, 1500);
  const continuityCount = useAnimatedCounter(38, visible, 1200);
  const stressFromCount = useAnimatedCounter(78, visible, 1200);
  const stressToCount = useAnimatedCounter(56, visible, 1200);

  /* 3D card tilt */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover() || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 3, y: -y * 3 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Sample Result"
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${B.navy} 0%, #1A1540 60%, #0E1A2B 100%)`,
        paddingTop: mobile ? spaciousY.mobile : spaciousY.desktop,
        paddingBottom: mobile ? spaciousY.mobile : spaciousY.desktop,
      }}
    >
      {/* Atmospheric glow */}
      <div className="absolute pointer-events-none" style={{ width: 600, height: 600, borderRadius: "50%", top: "10%", left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle, rgba(75,63,174,0.12) 0%, transparent 60%)" }} />

      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop, position: "relative" }}>
        {/* Header */}
        <h2
          className="text-[30px] md:text-[40px]"
          style={{
            color: "#F4F1EA",
            fontWeight: 600,
            letterSpacing: S.lsHeading,
            marginBottom: S.subtextMb,
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          A sample result
        </h2>

        {/* Preview card with 3D tilt */}
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease-out 100ms, transform 0.6s ease-out 100ms",
          }}
        >
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid rgba(14,26,43,0.08)",
              borderRadius: S.panelRadius,
              padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.3), 0 8px 20px rgba(0,0,0,0.15)",
              position: "relative",
              overflow: "hidden",
              transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
              transition: "transform 300ms ease-out",
            }}
          >
            {/* Top accent gradient bar */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: B.gradient }} />

            {/* Score header */}
            <div className="text-[10px] uppercase" style={{ color: B.light, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 10, marginTop: 8 }}>
              Income Stability Score&#8482;
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
              <span className="text-[40px]" style={{ fontWeight: 700, color: B.navy, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                {scoreCount}
              </span>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                borderRadius: 100,
                backgroundColor: "rgba(31,109,122,0.08)",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: B.teal }} />
                <span className="text-[14px]" style={{ fontWeight: 600, color: B.teal }}>High Stability</span>
              </div>
            </div>
            <div className="text-[12px]" style={{ color: B.muted, marginBottom: 24 }}>
              <span style={{ fontWeight: 600, color: B.navy }}>72nd percentile</span> within Professional Services
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(14,26,43,0.06)", marginBottom: 20 }} />

            {/* Key metrics row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: mobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
                gap: mobile ? 16 : 12,
                marginBottom: 24,
              }}
            >
              <div>
                <div className="text-[10px] uppercase" style={{ color: B.teal, fontWeight: 600, letterSpacing: "0.10em", marginBottom: 6 }}>Continuity</div>
                <div className="text-[16px] font-semibold" style={{ color: B.navy, fontVariantNumeric: "tabular-nums" }}>{continuityCount}%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase" style={{ color: B.teal, fontWeight: 600, letterSpacing: "0.10em", marginBottom: 6 }}>Stress Test</div>
                <div className="text-[16px] font-semibold" style={{ color: B.navy, fontVariantNumeric: "tabular-nums" }}>
                  {stressFromCount}<span className="text-[13px]" style={{ color: B.light, margin: "0 4px" }}>&rarr;</span><span style={{ color: "#DC2626" }}>{stressToCount}</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase" style={{ color: B.teal, fontWeight: 600, letterSpacing: "0.10em", marginBottom: 6 }}>How Resilient</div>
                <div className="text-[16px] font-semibold" style={{ color: B.navy }}>Supported</div>
              </div>
              <div>
                <div className="text-[10px] uppercase" style={{ color: B.teal, fontWeight: 600, letterSpacing: "0.10em", marginBottom: 6 }}>Confidence</div>
                <div className="text-[16px] font-semibold" style={{ color: B.navy }}>High</div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(14,26,43,0.06)", marginBottom: 20 }} />

            {/* Main Constraint */}
            <div className="text-[10px] uppercase" style={{ color: B.navy, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 8 }}>
              Main Constraint
            </div>
            <p className="text-[14px]" style={{ color: "rgba(14,26,43,0.70)", lineHeight: 1.6, marginBottom: 24 }}>
              Forward visibility could be stronger
            </p>

            {/* Best Improvement */}
            <div className="text-[10px] uppercase" style={{ color: B.teal, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 8 }}>
              Best Improvement
            </div>
            <p className="text-[14px]" style={{ color: "rgba(14,26,43,0.70)", lineHeight: 1.6, marginBottom: 24 }}>
              Extend committed income further ahead
            </p>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(14,26,43,0.06)", marginBottom: 20 }} />

            {/* Verification */}
            <div className="text-[10px] uppercase" style={{ color: B.light, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 6 }}>
              Verification
            </div>
            <p className="text-[13px]" style={{ color: "rgba(14,26,43,0.55)", lineHeight: 1.5 }}>
              Model RP-2.0 &#183; Verified
            </p>
          </div>
        </div>

        {/* Footer */}
        <p
          className="text-[13px] md:text-[14px]"
          style={{ color: "rgba(244,241,234,0.50)", textAlign: "center", marginTop: 32, maxWidth: 620, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}
        >
          Every report includes score breakdown, structural risks, stress scenarios, improvement paths, and reassessment triggers.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 6: HOW IT WORKS                                             */
/* ================================================================== */
function HowItWorksSection() {
  const { ref, visible } = useInViewBidi(0.15);
  const mobile = useMobile();

  const steps = [
    { num: "1", title: "Answer six questions", desc: "About how your income is structured today." },
    { num: "2", title: "The model runs", desc: "Model RP-2.0 calculates your score from fixed scoring rules. No AI. Same answers always produce the same result." },
    { num: "3", title: "Get your full report", desc: "Score, structural breakdown, stress scenarios, improvement paths, and reassessment triggers. Delivered instantly." },
  ];

  return (
    <section
      ref={ref}
      aria-label="How It Works"
      style={{
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        background: B.sand,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        {/* Header */}
        <div className="text-center" style={{ marginBottom: S.subtextMb }}>
          <h2
            className="text-[30px] md:text-[40px] font-semibold"
            style={{
              color: B.navy,
              lineHeight: S.lhHeading,
              letterSpacing: S.lsHeading,
              marginBottom: S.h2mb,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.5s ease-out 100ms, transform 0.5s ease-out 100ms",
            }}
          >
            How it works
          </h2>
          <p
            className="text-[16px] md:text-[18px] mx-auto"
            style={{
              color: "rgba(14,26,43,0.70)",
              maxWidth: 520,
              lineHeight: S.lhBody,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.5s ease-out 200ms, transform 0.5s ease-out 200ms",
            }}
          >
            Six questions. Under two minutes. Full structural diagnosis.
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

        {/* Footer */}
        <p
          className="text-[13px] md:text-[14px]"
          style={{ color: B.light, textAlign: "center", marginTop: 32, letterSpacing: "0.02em", fontWeight: 500 }}
        >
          Powered by Model RP-2.0
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 7: WHAT IT MEASURES                                         */
/* ================================================================== */
function WhatItMeasuresSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const dimensions = [
    { title: "Recurring or Continuing Income", desc: "How much income continues from existing sources without needing new acquisition." },
    { title: "Income Concentration", desc: "How much depends on your single largest source." },
    { title: "Source Diversity", desc: "How many meaningful income sources support the structure." },
    { title: "Forward Visibility", desc: "How far ahead income is already committed or scheduled." },
    { title: "Income Variability", desc: "How sharply income moves between strong and weak months." },
    { title: "Continuity Without Active Work", desc: "How much income would continue if active work stopped for 90 days." },
  ];

  return (
    <section
      ref={ref}
      aria-label="What It Measures"
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
            transform: visible ? "translateY(0)" : "translateY(18px)",
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
            What the model measures
          </h2>
          <p
            className="text-[16px] md:text-[18px] mx-auto"
            style={{ color: "rgba(14,26,43,0.70)", lineHeight: S.lhBody, maxWidth: 640 }}
          >
            Your score is built from six structural dimensions. Together, they show how stable your income is and how well it holds up under pressure.
          </p>
        </div>

        {/* 6 items in 2-column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
            gap: S.gridGap,
            maxWidth: 860,
            margin: "0 auto",
          }}
        >
          {dimensions.map((dim, i) => (
            <div
              key={dim.title}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: mobile ? 16 : 20,
                padding: mobile ? "16px 0" : "20px 0",
                borderBottom: "1px solid rgba(14,26,43,0.06)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(14px)",
                transition: `opacity 500ms ease-out ${80 + i * 60}ms, transform 500ms ease-out ${80 + i * 60}ms`,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: "rgba(75,63,174,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 600,
                  color: B.purple,
                  letterSpacing: "-0.02em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  className="text-[15px] md:text-[16px] font-semibold"
                  style={{ color: B.navy, lineHeight: 1.3, marginBottom: 6 }}
                >
                  {dim.title}
                </div>
                <p
                  className="text-[14px] md:text-[15px]"
                  style={{ color: "rgba(14,26,43,0.55)", lineHeight: 1.6 }}
                >
                  {dim.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p
          className="text-[13px] md:text-[14px]"
          style={{ color: B.light, textAlign: "center", marginTop: 32, letterSpacing: "0.02em", fontWeight: 500 }}
        >
          Official Scoring Framework &#183; Model RP-2.0
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 8: BY INCOME TYPE                                           */
/* ================================================================== */
function ByIncomeTypeSection() {
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
      aria-label="By Income Type"
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? S.sectionYsm.mobile : S.sectionYsm.desktop,
        paddingBottom: mobile ? S.sectionYsm.mobile : S.sectionYsm.desktop,
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
            transform: visible ? "translateY(0)" : "translateY(18px)",
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
            style={{ color: "rgba(14,26,43,0.70)", lineHeight: S.lhBody, marginBottom: 32 }}
          >
            The model stays fixed. The weak point changes by income type.
          </p>

          {/* Income type weak points */}
          <div style={{ textAlign: "left", maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            {types.map((item, i) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "14px 0",
                  borderBottom: "1px solid rgba(14,26,43,0.06)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(10px)",
                  transition: `opacity 500ms ease-out ${100 + i * 80}ms, transform 500ms ease-out ${100 + i * 80}ms`,
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
            style={{
              color: "rgba(14,26,43,0.55)",
              lineHeight: S.lhBody,
              marginTop: 32,
              fontStyle: "italic",
              opacity: visible ? 1 : 0,
              transition: "opacity 500ms ease-out 600ms",
            }}
          >
            Your report shows which dimension constrains your score and what to do about it.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 9: CLASSIFICATION                                           */
/* ================================================================== */
function ClassificationSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const bands = [
    { range: "0\u201329", label: "Limited Stability", desc: "Income structure is fragile and depends heavily on active work.", color: "#DC2626", width: 29 },
    { range: "30\u201349", label: "Developing Stability", desc: "Some support exists, but the structure is still exposed.", color: "#F59E0B", width: 20 },
    { range: "50\u201374", label: "High Stability", desc: "Income reflects meaningful stability and stronger protection.", color: B.teal, width: 25 },
    { range: "75\u2013100", label: "High Stability", desc: "Income structure is durable and less dependent on constant effort.", color: B.navy, width: 26 },
  ];

  return (
    <section
      ref={ref}
      aria-label="Classification"
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
            transform: visible ? "translateY(0)" : "translateY(18px)",
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
            Income Stability Classification Scale
          </h2>
          <p
            className="text-[16px] md:text-[18px] mx-auto"
            style={{ color: "rgba(14,26,43,0.70)", lineHeight: S.lhBody, maxWidth: 600 }}
          >
            Every score maps to a fixed stability band under Model RP-2.0.
          </p>
        </div>

        {/* Animated color bar */}
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
          }}
        >
          <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", height: 12, marginBottom: 32 }}>
            {bands.map((band, i) => (
              <div
                key={band.range}
                style={{
                  width: visible ? `${band.width}%` : "0%",
                  backgroundColor: band.color,
                  transition: `width 800ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 200}ms`,
                }}
              />
            ))}
          </div>

          {/* Band descriptions */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr 1fr",
              gap: mobile ? 20 : S.gridGap,
            }}
          >
            {bands.map((band, i) => (
              <div
                key={band.range}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(12px)",
                  transition: `opacity 500ms ease-out ${200 + i * 100}ms, transform 500ms ease-out ${200 + i * 100}ms`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: band.color, flexShrink: 0 }} />
                  <span className="text-[14px] font-semibold" style={{ color: B.navy }}>{band.range}</span>
                </div>
                <div className="text-[13px] font-semibold" style={{ color: B.navy, marginBottom: 4 }}>
                  {band.label}
                </div>
                <p className="text-[13px]" style={{ color: "rgba(14,26,43,0.55)", lineHeight: 1.5 }}>
                  {band.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <p
            className="text-[13px] md:text-[14px]"
            style={{ color: B.light, textAlign: "center", marginTop: 32, letterSpacing: "0.02em", fontWeight: 500 }}
          >
            Band thresholds are fixed under Model RP-2.0.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 10: PRICING                                                 */
/* ================================================================== */
function PricingSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Pricing"
      className="relative overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${B.navy} 0%, #1A1540 40%, ${B.purple} 100%)` }}
    >
      {/* Ambient glows */}
      <div style={{ position: "absolute", top: "-25%", left: "50%", width: 800, height: 800, borderRadius: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle, rgba(75,63,174,0.14) 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* Concentric halos */}
      <div className="absolute pointer-events-none" style={{ width: 320, height: 320, borderRadius: "50%", border: "1px solid rgba(244,241,234,0.06)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
      <div className="absolute pointer-events-none" style={{ width: 520, height: 520, borderRadius: "50%", border: "1px solid rgba(244,241,234,0.08)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
      <div className="absolute pointer-events-none" style={{ width: 720, height: 720, borderRadius: "50%", border: "1px solid rgba(244,241,234,0.04)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />

      <div
        className="relative mx-auto"
        style={{
          maxWidth: S.maxW,
          paddingTop: mobile ? spaciousY.mobile : spaciousY.desktop,
          paddingBottom: mobile ? spaciousY.mobile : spaciousY.desktop,
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
          textAlign: "center",
        }}
      >
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(18px)",
            transition: "opacity 520ms ease-out, transform 520ms ease-out",
          }}
        >
          {/* Heading */}
          <h2
            className="font-semibold text-[30px] md:text-[44px]"
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

          <p
            className="text-[16px] md:text-[18px]"
            style={{
              color: "rgba(244,241,234,0.80)",
              lineHeight: S.lhBody,
              maxWidth: 560,
              margin: `0 auto ${S.subtextMb}px auto`,
            }}
          >
            See how stable your income structure is, where it is exposed, and what would strengthen it.
          </p>
        </div>

        {/* Pricing cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
            gap: S.gridGap,
            maxWidth: 720,
            margin: "0 auto",
          }}
        >
          {/* Single Assessment */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: S.panelRadius,
              padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
              textAlign: "center",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 520ms ease-out 100ms, transform 520ms ease-out 100ms",
            }}
          >
            <div className="text-[11px] uppercase font-semibold" style={{ color: B.teal, letterSpacing: S.lsLabel, marginBottom: 12 }}>
              Single Assessment
            </div>
            <div className="text-[40px] font-bold" style={{ color: B.navy, lineHeight: 1, marginBottom: 16 }}>
              $39
            </div>
            <p className="text-[14px]" style={{ color: B.muted, lineHeight: 1.6, marginBottom: 28 }}>
              Full 5-page diagnostic &#183; Instant delivery &#183; One-time
            </p>
            <a
              href="https://buy.stripe.com/14A28j48E2socZQa2Z2Nq02"
              className="cta-tick inline-flex items-center justify-center font-semibold w-full
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F6D7A]"
              style={{
                height: S.ctaH,
                paddingLeft: S.ctaPadX,
                paddingRight: S.ctaPadX,
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
              <span className="cta-label">Get My Score</span>
              <span className="cta-arrow cta-arrow-white" />
            </a>
          </div>

          {/* Annual Monitoring */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: S.panelRadius,
              padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
              textAlign: "center",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 520ms ease-out 200ms, transform 520ms ease-out 200ms",
            }}
          >
            <div className="text-[11px] uppercase font-semibold" style={{ color: B.teal, letterSpacing: S.lsLabel, marginBottom: 12 }}>
              Annual Monitoring
            </div>
            <div className="text-[40px] font-bold" style={{ color: B.navy, lineHeight: 1, marginBottom: 16 }}>
              $99
            </div>
            <p className="text-[14px]" style={{ color: B.muted, lineHeight: 1.6, marginBottom: 28 }}>
              Three assessments over 12 months &#183; Track structural changes
            </p>
            <a
              href="https://buy.stripe.com/aFacMXdJe2so7Fw7UR2Nq03"
              className="cta-tick inline-flex items-center justify-center font-semibold w-full
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F6D7A]"
              style={{
                height: S.ctaH,
                paddingLeft: S.ctaPadX,
                paddingRight: S.ctaPadX,
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
              <span className="cta-label">Get Annual Monitoring</span>
              <span className="cta-arrow cta-arrow-white" />
            </a>
          </div>
        </div>

        {/* Trust strip */}
        <p
          className="text-[13px] md:text-[14px]"
          style={{ color: "rgba(244,241,234,0.50)", marginTop: 32, letterSpacing: "0.01em" }}
        >
          No bank connection required &#183; No credit pull &#183; Private by default
        </p>
        <p
          className="text-[13px] md:text-[14px]"
          style={{ color: "rgba(244,241,234,0.40)", marginTop: 8 }}
        >
          Average completion: under 2 minutes
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 11: TRUST / GOVERNANCE                                      */
/* ================================================================== */
function TrustSection({ trustOpen, setTrustOpen }: { trustOpen: number | null; setTrustOpen: (v: number | null) => void }) {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const panels = [
    {
      title: "Consistency",
      items: [
        "Fixed scoring framework under Model RP-2.0",
        "The same answers produce the same result",
        "AI does not determine assessment results",
        "Framework changes create a new model version",
      ],
    },
    {
      title: "Transparency",
      items: [
        "Defined measurement categories",
        "Published stability bands",
        "Sample report available for review",
        "Clear report sections and outputs",
      ],
    },
    {
      title: "Verification",
      items: [
        "Unique record ID on each report",
        "Verification support included",
        "Model version shown on every assessment",
        "Report authenticity can be checked online",
      ],
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="Trust and Governance"
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        {/* Header */}
        <h2
          className="text-[30px] md:text-[40px]"
          style={{
            color: B.navy,
            fontWeight: 600,
            lineHeight: S.lhHeading,
            letterSpacing: S.lsHeading,
            marginBottom: S.subtextMb,
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          Model governance
        </h2>

        {/* Accordion panels */}
        <div
          className="mx-auto"
          style={{
            maxWidth: 720,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out 80ms, transform 0.5s ease-out 80ms",
          }}
        >
          {panels.map((panel, i) => {
            const isOpen = trustOpen === i;
            return (
              <div
                key={panel.title}
                style={{
                  borderTop: "1px solid rgba(14,26,43,0.08)",
                  borderBottom: i === panels.length - 1 ? "1px solid rgba(14,26,43,0.08)" : "none",
                  backgroundColor: isOpen ? "rgba(75,63,174,0.03)" : "transparent",
                  transition: "background-color 180ms ease",
                }}
              >
                <button
                  onClick={() => setTrustOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left group"
                  style={{ padding: "26px 0", gap: 24 }}
                  aria-expanded={isOpen}
                >
                  <span
                    className="text-[17px] md:text-[20px] transition-colors duration-[180ms]"
                    style={{
                      color: isOpen ? B.navy : "rgba(14,26,43,0.80)",
                      fontWeight: 500,
                      lineHeight: 1.45,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {panel.title}
                  </span>
                  <svg
                    width="16" height="16" viewBox="0 0 16 16" fill="none"
                    className="shrink-0 transition-colors duration-[180ms]"
                    stroke="rgba(14,26,43,0.40)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    {!isOpen && <line x1="8" y1="2" x2="8" y2="14" />}
                    <line x1="2" y1="8" x2="14" y2="8" />
                  </svg>
                </button>
                <div
                  className="overflow-hidden transition-all duration-[220ms] ease-in-out"
                  style={{ maxHeight: isOpen ? 300 : 0, opacity: isOpen ? 1 : 0 }}
                >
                  <ul style={{ paddingTop: 4, paddingBottom: 24, paddingLeft: 0, listStyle: "none" }}>
                    {panel.items.map((item) => (
                      <li
                        key={item}
                        className="text-[15px] md:text-[16px]"
                        style={{
                          color: "rgba(14,26,43,0.65)",
                          lineHeight: 1.75,
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 12,
                          padding: "6px 0",
                        }}
                      >
                        <span style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: B.teal, marginTop: 9, flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 12: FAQ                                                     */
/* ================================================================== */
function FaqSection({ openFaq, setOpenFaq }: { openFaq: number | null; setOpenFaq: (v: number | null) => void }) {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const faqItems = [
    { q: "What does the Income Stability Score\u2122 measure?", a: "It measures how stable your income structure is based on recurring income, concentration, source diversity, forward visibility, variability, and continuity without active work." },
    { q: "How long does the assessment take?", a: "Most people complete it in under two minutes." },
    { q: "What is included in the report?", a: "A 5-page diagnostic including your score, structural breakdown, stress scenarios, projected improvements, industry-tailored actions, reassessment triggers, and peer benchmarks." },
    { q: "Can I retake the assessment?", a: "Yes. Retake after a meaningful structural change to see how your score has moved." },
    { q: "How is my data handled?", a: "No bank connection is required. Your data is private by default and handled according to our privacy and security policies." },
    { q: "Do I need exact financial records?", a: "No. The assessment works from informed estimates. More accurate inputs produce more precise results, but exact bookkeeping is not required." },
  ];

  return (
    <section
      ref={ref}
      aria-label="FAQ"
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
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <h2
            className="text-[30px] md:text-[40px]"
            style={{
              color: B.navy,
              fontWeight: 600,
              lineHeight: S.lhHeading,
              letterSpacing: S.lsHeading,
              marginBottom: S.subtextMb,
            }}
          >
            Frequently asked questions
          </h2>
        </div>

        {/* FAQ list */}
        <div
          className="mx-auto"
          style={{
            maxWidth: 820,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out 80ms, transform 0.5s ease-out 80ms",
          }}
        >
          {faqItems.map((item, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                style={{
                  borderTop: "1px solid rgba(14,26,43,0.08)",
                  borderBottom: i === faqItems.length - 1 ? "1px solid rgba(14,26,43,0.08)" : "none",
                  backgroundColor: isOpen ? "rgba(75,63,174,0.03)" : "transparent",
                  transition: "background-color 180ms ease",
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left group"
                  style={{ padding: "26px 0", gap: 24 }}
                  aria-expanded={isOpen}
                >
                  <span
                    className="text-[17px] md:text-[20px] transition-colors duration-[180ms]"
                    style={{
                      color: isOpen ? B.navy : "rgba(14,26,43,0.80)",
                      fontWeight: 500,
                      lineHeight: 1.45,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.q}
                  </span>
                  <svg
                    width="16" height="16" viewBox="0 0 16 16" fill="none"
                    className="shrink-0 transition-colors duration-[180ms]"
                    stroke="rgba(14,26,43,0.40)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    {!isOpen && <line x1="8" y1="2" x2="8" y2="14" />}
                    <line x1="2" y1="8" x2="14" y2="8" />
                  </svg>
                </button>
                <div
                  className="overflow-hidden transition-all duration-[220ms] ease-in-out"
                  style={{ maxHeight: isOpen ? 300 : 0, opacity: isOpen ? 1 : 0 }}
                >
                  <p
                    className="text-[15px] md:text-[16px]"
                    style={{
                      color: "rgba(14,26,43,0.65)",
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
            Get My Income Stability Score&#8482; &#8594;
          </Link>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 13: DISCLAIMER — compact footer-style line                  */
/* ================================================================== */
function DisclaimerSection() {
  const mobile = useMobile();

  return (
    <section
      aria-label="Global Disclaimer"
      style={{
        background: B.navy,
        paddingTop: mobile ? S.disclaimerY.mobile : S.disclaimerY.desktop,
        paddingBottom: mobile ? S.disclaimerY.mobile : S.disclaimerY.desktop,
      }}
    >
      <div
        style={{
          maxWidth: S.maxW,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
          textAlign: "center",
        }}
      >
        <p
          className="text-[12px] md:text-[13px]"
          style={{
            color: "rgba(244,241,234,0.35)",
            lineHeight: 1.6,
          }}
        >
          The Income Stability Score&#8482; is a structural income assessment based on information provided by the user. It is not financial advice, investment advice, credit underwriting, or a prediction of future financial outcomes.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* MAIN LANDING PAGE                                                   */
/* ================================================================== */
export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [trustOpen, setTrustOpen] = useState<number | null>(null);

  return (
    <div className="overflow-x-hidden">

      {/* ============ SECTION 1: HERO ============ */}
      <HeroSection />

      {/* ============ SECTION 2: COMPARISON ============ */}
      <ComparisonSection />

      {/* ============ SECTION 3: WHO IT IS FOR ============ */}
      <WhoItIsForSection />

      {/* ============ SECTION 4: WHAT YOUR REPORT INCLUDES ============ */}
      <WhatYourReportIncludesSection />

      {/* ============ SECTION 5: SAMPLE RESULT ============ */}
      <SampleResultSection />

      {/* ============ SECTION 6: HOW IT WORKS ============ */}
      <HowItWorksSection />

      {/* ============ SECTION 7: WHAT IT MEASURES ============ */}
      <WhatItMeasuresSection />

      {/* ============ SECTION 8: BY INCOME TYPE ============ */}
      <ByIncomeTypeSection />

      {/* ============ SECTION 9: CLASSIFICATION ============ */}
      <ClassificationSection />

      {/* ============ SECTION 10: PRICING ============ */}
      <PricingSection />

      {/* ============ SECTION 11: TRUST / GOVERNANCE ============ */}
      <TrustSection trustOpen={trustOpen} setTrustOpen={setTrustOpen} />

      {/* ============ SECTION 12: FAQ ============ */}
      <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />

      {/* ============ SECTION 13: DISCLAIMER ============ */}
      <DisclaimerSection />
    </div>
  );
}
