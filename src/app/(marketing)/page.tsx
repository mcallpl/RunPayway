"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import logoWhite from "../../../public/runpayway-logo-white.png";

/* ================================================================== */
/* UTILITIES                                                           */
/* ================================================================== */

const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

function useInView(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const c = () => setM(window.innerWidth <= bp);
    c();
    window.addEventListener("resize", c);
    return () => window.removeEventListener("resize", c);
  }, [bp]);
  return m;
}

function useAnimatedCounter(target: number, trigger: boolean, duration = 1500) {
  const [value, setValue] = useState(0);
  const animated = useRef(false);
  const rafId = useRef(0);
  useEffect(() => {
    if (!trigger || animated.current) return;
    animated.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) rafId.current = requestAnimationFrame(step);
    };
    rafId.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId.current);
  }, [trigger, target, duration]);
  return value;
}

/* ================================================================== */
/* DESIGN TOKENS                                                       */
/* ================================================================== */

const C = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  sandBg: "#F7F6F3",
  white: "#FFFFFF",
  muted: "rgba(14,26,43,0.55)",
  light: "rgba(14,26,43,0.38)",
  border: "rgba(14,26,43,0.08)",
  heroGradient: "linear-gradient(145deg, #0E1A2B 0%, #161430 35%, #3D2F9C 65%, #1F6D7A 100%)",
};

const sp = (n: number) => n * 8;

const T = {
  h1:    { desktop: { fontSize: 52, fontWeight: 600, lineHeight: 1.08 }, mobile: { fontSize: 30, fontWeight: 600, lineHeight: 1.1 } },
  h2:    { desktop: { fontSize: 32, fontWeight: 600, lineHeight: 1.15 }, mobile: { fontSize: 26, fontWeight: 600, lineHeight: 1.15 } },
  h3:    { desktop: { fontSize: 20, fontWeight: 600, lineHeight: 1.3 },  mobile: { fontSize: 18, fontWeight: 600, lineHeight: 1.3 } },
  bodyLg:{ desktop: { fontSize: 20, fontWeight: 400, lineHeight: 1.45 }, mobile: { fontSize: 18, fontWeight: 400, lineHeight: 1.5 } },
  body:  { desktop: { fontSize: 16, fontWeight: 400, lineHeight: 1.65 }, mobile: { fontSize: 16, fontWeight: 400, lineHeight: 1.6 } },
  label: { fontSize: 14, fontWeight: 500, lineHeight: 1.45 },
  meta:  { fontSize: 13, fontWeight: 500, lineHeight: 1.4 },
  score: { desktop: { fontSize: 64, fontWeight: 600, lineHeight: 1 }, mobile: { fontSize: 48, fontWeight: 600, lineHeight: 1 } },
  price: { desktop: { fontSize: 48, fontWeight: 600, lineHeight: 1 }, mobile: { fontSize: 40, fontWeight: 600, lineHeight: 1 } },
  nav:   { fontSize: 15, fontWeight: 500 },
  cta:   { fontSize: 15, fontWeight: 600 },
};

const maxW = 1200;
const readW = 740;
const heroW = 660;
const padX = { desktop: 40, mobile: 20 };
const sectionGap = { desktop: sp(12), mobile: sp(9) };

const h1 = (m: boolean) => m ? T.h1.mobile : T.h1.desktop;
const h2 = (m: boolean) => m ? T.h2.mobile : T.h2.desktop;
const h3 = (m: boolean) => m ? T.h3.mobile : T.h3.desktop;
const bodyLg = (m: boolean) => m ? T.bodyLg.mobile : T.bodyLg.desktop;
const body = (m: boolean) => m ? T.body.mobile : T.body.desktop;
const score = (m: boolean) => m ? T.score.mobile : T.score.desktop;
const price = (m: boolean) => m ? T.price.mobile : T.price.desktop;
const px = (m: boolean) => m ? padX.mobile : padX.desktop;
const secY = (m: boolean) => m ? sectionGap.mobile : sectionGap.desktop;

const fadeIn = (visible: boolean, delay = 0) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(16px)",
  transition: `opacity 600ms ease-out ${delay}ms, transform 600ms ease-out ${delay}ms`,
});


/* ================================================================== */
/* STICKY NAV                                                          */
/* ================================================================== */
function StickyNav() {
  const m = useMobile();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      backdropFilter: "blur(16px)",
      backgroundColor: scrolled ? "rgba(14,26,43,0.88)" : "rgba(14,26,43,0.4)",
      borderBottom: scrolled ? "1px solid rgba(244,241,234,0.08)" : "1px solid transparent",
      transition: "background-color 300ms, border-color 300ms",
      height: m ? 64 : 80, display: "flex", alignItems: "center",
      padding: `0 ${px(m)}px`,
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center" }}>
          <Image src={logoWhite} alt="RunPayway™" width={120} height={14} style={{ height: "auto" }} />
        </Link>
        {!m && (
          <div style={{ display: "flex", alignItems: "center", gap: sp(3.5) }}>
            {[
              { label: "Methodology", href: "/methodology" },
              { label: "Sample Report", href: "/sample-report" },
              { label: "Pricing", href: "/pricing" },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{ ...T.nav, color: "rgba(244,241,234,0.55)", textDecoration: "none", transition: "color 200ms" }}
                onMouseEnter={(e) => { if (canHover()) e.currentTarget.style.color = "#F4F1EA"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(244,241,234,0.55)"; }}
              >{link.label}</Link>
            ))}
            <Link href="/pricing" style={{
              ...T.cta, color: C.navy, textDecoration: "none",
              padding: `${sp(1)}px ${sp(2.5)}px`, borderRadius: 6,
              background: `linear-gradient(135deg, ${C.sand}, #E8E5DD)`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}>Check Your Score</Link>
          </div>
        )}
        {m && (
          <Link href="/pricing" style={{
            ...T.cta, color: C.navy, textDecoration: "none",
            padding: `${sp(0.75)}px ${sp(2)}px`, borderRadius: 5,
            background: `linear-gradient(135deg, ${C.sand}, #E8E5DD)`,
            display: "inline-flex", alignItems: "center",
          }}>Check Your Score</Link>
        )}
      </div>
    </nav>
  );
}


/* ================================================================== */
/* HERO                                                                */
/* ================================================================== */
function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const animatedScore = useAnimatedCounter(48, visible, 1500);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setShowLabel(true), 1600);
    return () => clearTimeout(t);
  }, [visible]);

  const ringSize = m ? 200 : 260;
  const radius = 70;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = (1 - 48 / 100) * circumference;

  return (
    <section ref={ref} aria-label="Hero" style={{ background: C.heroGradient }}>
      <div style={{
        maxWidth: maxW, margin: "0 auto",
        paddingTop: m ? sp(14) : sp(16),
        paddingBottom: m ? sp(9) : sp(12),
        paddingLeft: px(m), paddingRight: px(m),
      }}>
        <div style={{
          display: m ? "block" : "flex",
          alignItems: "center", justifyContent: "space-between", gap: sp(8),
        }}>
          {/* Left — text */}
          <div style={{ maxWidth: heroW, textAlign: m ? "center" : "left" }}>
            <div style={{
              ...fadeIn(visible),
              ...T.label, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const,
              color: C.teal, marginBottom: sp(3),
            }}>
              Income Stability Score&#8482;
            </div>

            <h1 style={{
              ...fadeIn(visible, 100),
              ...h1(m), color: C.sand, letterSpacing: "-0.02em", marginBottom: sp(2.5),
            }}>
              Measure how stable your income structure actually is.
            </h1>

            <p style={{
              ...fadeIn(visible, 200),
              ...bodyLg(m), color: "rgba(244,241,234,0.50)", marginBottom: sp(4.5),
              maxWidth: m ? undefined : 480,
            }}>
              A fixed structural assessment based on how your income is built — not how much you make.
            </p>

            <div style={fadeIn(visible, 300)}>
              <Link
                href="/pricing"
                className="cta-tick inline-flex items-center justify-center"
                style={{
                  height: sp(7), width: m ? "100%" : "auto",
                  paddingLeft: sp(4.5), paddingRight: sp(4.5),
                  borderRadius: sp(1.25),
                  background: `linear-gradient(135deg, ${C.sand} 0%, #EDECEA 100%)`,
                  color: C.navy, ...T.cta, letterSpacing: "-0.01em",
                  border: `1px solid rgba(244,241,234,0.92)`,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 24px rgba(0,0,0,0.20)",
                  transition: "transform 180ms ease, box-shadow 180ms ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.4), 0 12px 32px rgba(0,0,0,0.25)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 24px rgba(0,0,0,0.20)"; }}
              >
                <span className="tick tick-navy" />
                <span className="cta-label">Get My Free Score</span>
                <span className="cta-arrow cta-arrow-navy" />
              </Link>

              <p style={{ ...T.meta, color: "rgba(244,241,234,0.42)", marginTop: sp(2.5) }}>
                Six questions &bull; Under two minutes &bull; No bank connection &bull; No credit pull
              </p>
            </div>
          </div>

          {/* Right — score ring */}
          <div style={{
            flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center",
            marginTop: m ? sp(7) : 0,
            ...fadeIn(visible, 400),
          }}>
            <div style={{ position: "relative", width: ringSize, height: ringSize }}>
              <svg width={ringSize} height={ringSize} viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} />
                <circle cx="80" cy="80" r={radius} fill="none" stroke="url(#scoreGrad)" strokeWidth={strokeWidth}
                  strokeLinecap="round" strokeDasharray={circumference}
                  strokeDashoffset={visible ? targetOffset : circumference}
                  style={{ transition: "stroke-dashoffset 2s cubic-bezier(0.22, 1, 0.36, 1)" }}
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={C.teal} /><stop offset="50%" stopColor={C.purple} /><stop offset="100%" stopColor="#7B6FE0" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ ...score(m), color: C.sand, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
                  {animatedScore}
                </span>
              </div>
            </div>

            <div style={{
              textAlign: "center", marginTop: sp(2),
              opacity: showLabel ? 1 : 0, transform: showLabel ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 500ms ease-out, transform 500ms ease-out",
            }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: sp(1),
                padding: `${sp(0.75)}px ${sp(2)}px`, borderRadius: 100,
                backgroundColor: "rgba(146,100,10,0.15)", border: "1px solid rgba(146,100,10,0.25)",
                marginBottom: sp(1),
              }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: "#92640A" }} />
                <span style={{ ...T.label, fontWeight: 600, color: "#92640A" }}>Developing Stability</span>
              </div>
              <div style={{ ...T.meta, color: "rgba(244,241,234,0.45)", marginBottom: sp(2) }}>12 points to Established</div>
              <div style={{ display: "flex", flexDirection: "column", gap: sp(0.75), textAlign: "left" }}>
                <span style={{ ...T.meta, color: "rgba(244,241,234,0.42)" }}>Primary constraint: Income concentration</span>
                <span style={{ ...T.meta, color: "rgba(244,241,234,0.42)" }}>Stress test: Largest source removed &#8594; projected 21</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* HERO VIDEO                                                          */
/* ================================================================== */
function HeroVideo() {
  const m = useMobile();
  const [videoSrc, setVideoSrc] = useState("");
  const [dismissed, setDismissed] = useState(false);
  const [closing, setClosing] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const base = window.location.pathname.startsWith("/RunPayway") ? "/RunPayway" : "";
    setVideoSrc(`${base}/hero-video.mp4`);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setCollapsed(true); setTimeout(() => setDismissed(true), 400); }, 600);
  };

  if (dismissed) return null;

  return (
    <section aria-label="Brand video" style={{
      backgroundColor: "#000", lineHeight: 0, position: "relative", overflow: "hidden",
      maxHeight: collapsed ? 0 : 2000, opacity: collapsed ? 0 : 1,
      transition: collapsed ? "max-height 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms ease" : "none",
    }}>
      <button type="button" onClick={handleClose} aria-label="Close video" style={{
        position: "absolute", top: m ? 12 : 20, right: m ? 12 : 24, zIndex: 10,
        width: 44, height: 44, borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.20)", backgroundColor: "rgba(0,0,0,0.50)",
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        color: "rgba(255,255,255,0.70)", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background-color 200ms ease", padding: 0,
      }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.70)"; e.currentTarget.style.color = "rgba(255,255,255,0.95)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.50)"; e.currentTarget.style.color = "rgba(255,255,255,0.70)"; }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" />
        </svg>
      </button>

      {closing && (
        <>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", backgroundColor: C.navy, zIndex: 5, animation: "curtainTop 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", backgroundColor: C.navy, zIndex: 5, animation: "curtainBottom 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards" }} />
        </>
      )}

      {videoSrc && (
        <video autoPlay muted loop playsInline preload="auto" style={{ width: "100%", height: "auto", display: "block" }}>
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
    </section>
  );
}


/* ================================================================== */
/* HOW IT WORKS                                                        */
/* ================================================================== */
function HowItWorksSection() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const steps = [
    { num: "01", title: "Answer six structural questions", desc: "About how your income is built — sources, concentration, visibility, and continuity.", trust: "No bank connection" },
    { num: "02", title: "Receive your score instantly", desc: "Your score out of 100, your stability band, and the primary constraint holding it down.", trust: "No credit pull" },
    { num: "03", title: "Unlock the full diagnostic", desc: "A tailored report, disruption analysis, action plan, and simulator to test changes before you make them.", trust: "Private by default" },
  ];

  return (
    <section ref={ref} aria-label="How it works" style={{
      background: C.sandBg,
      paddingTop: m ? sp(10) : sp(16),
      paddingBottom: m ? sp(10) : sp(16),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        {/* Heading — big, bold, breathing */}
        <div style={{ marginBottom: m ? sp(8) : sp(12), ...fadeIn(visible) }}>
          <h2 style={{
            fontSize: m ? 36 : 56, fontWeight: 600, lineHeight: 1.08,
            color: C.navy, letterSpacing: "-0.03em",
            maxWidth: 700,
          }}>
            Three steps.<br />
            No financial data required.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr", gap: m ? sp(4) : sp(5) }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{
              background: C.white,
              borderRadius: sp(1.5),
              padding: m ? sp(4) : sp(5),
              boxShadow: "0 2px 4px rgba(14,26,43,0.04), 0 12px 40px rgba(14,26,43,0.06)",
              display: "flex", flexDirection: "column",
              ...fadeIn(visible, 150 + i * 120),
            }}>
              {/* Step number — large, teal, standalone */}
              <div style={{
                fontSize: m ? 40 : 52, fontWeight: 600, color: C.teal,
                letterSpacing: "-0.03em", lineHeight: 1,
                marginBottom: sp(3),
              }}>{s.num}</div>

              {/* Title — bold, tight */}
              <h3 style={{
                fontSize: m ? 20 : 24, fontWeight: 600, color: C.navy,
                lineHeight: 1.2, letterSpacing: "-0.02em",
                marginBottom: sp(2),
              }}>{s.title}</h3>

              {/* Description — lighter, generous line height */}
              <p style={{
                ...body(m), color: C.muted, margin: 0, flex: 1,
              }}>{s.desc}</p>

              {/* Trust line — separated, quiet */}
              <div style={{
                marginTop: sp(4),
                paddingTop: sp(3),
                borderTop: `1px solid ${C.border}`,
                display: "flex", alignItems: "center", gap: sp(1),
              }}>
                <span style={{ color: C.teal, fontSize: 14 }}>&#x2713;</span>
                <span style={{ ...T.label, color: C.light }}>{s.trust}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust strip — generous space above */}
        <div style={{
          marginTop: m ? sp(8) : sp(12),
          paddingTop: sp(4),
          borderTop: `1px solid ${C.border}`,
          ...fadeIn(visible, 500),
        }}>
          <p style={{ ...T.meta, color: C.light, textAlign: m ? "left" : "center" }}>
            Same answers always produce the same score &bull; Deterministic scoring &bull; Methodology published
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* WHAT THIS SCORE MEASURES                                            */
/* ================================================================== */
function WhatItMeasures() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const dims = [
    { num: "01", label: "Recurring Income", accent: C.teal, metric: "0%", metricLabel: "recurring",
      title: "Recurring income proportion",
      desc: "What percentage of your income renews automatically through retainers, subscriptions, or standing contracts." },
    { num: "02", label: "Concentration", accent: C.purple, metric: "55%", metricLabel: "one client",
      title: "Income concentration",
      desc: "How much of your income depends on a single source. Higher concentration increases structural risk." },
    { num: "03", label: "Visibility", accent: "#D4940A", metric: "<30", metricLabel: "days booked",
      title: "Forward income visibility",
      desc: "How far into the future your income is already committed — booked, contracted, or otherwise secured." },
    { num: "04", label: "Continuity", accent: "#DC4A4A", metric: "100%", metricLabel: "labor",
      title: "Income continuity without active labor",
      desc: "How long income continues if you stop working. Measures dependence on daily effort." },
  ];

  return (
    <section ref={ref} aria-label="What this score measures" style={{
      background: C.white,
      paddingTop: secY(m), paddingBottom: secY(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ maxWidth: 560, marginBottom: sp(5), ...fadeIn(visible) }}>
          <div style={{ ...T.meta, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: C.teal, marginBottom: sp(1.5) }}>
            Four Dimensions of Stability
          </div>
          <h2 style={{ ...h2(m), color: C.navy, marginBottom: sp(2.5) }}>What this score measures.</h2>
          <p style={{ ...body(m), color: C.muted }}>
            Six questions are used to evaluate four structural dimensions of income stability.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: sp(2.5) }}>
          {dims.map((d, i) => {
            const hovered = hoverIdx === i;
            return (
              <div key={d.label}
                onMouseEnter={() => canHover() && setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                style={{
                  background: C.navy, borderRadius: sp(1.5),
                  padding: m ? sp(3.5) : sp(4), position: "relative", overflow: "hidden",
                  transform: hovered ? "translateY(-3px)" : "translateY(0)",
                  boxShadow: hovered ? "0 12px 40px rgba(14,26,43,0.20)" : "0 4px 16px rgba(14,26,43,0.08)",
                  transition: "transform 250ms ease, box-shadow 250ms ease",
                  ...fadeIn(visible, 100 + i * 80),
                }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: d.accent, opacity: hovered ? 1 : 0.5, transition: "opacity 250ms" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: sp(2) }}>
                  <div style={{ display: "flex", alignItems: "center", gap: sp(1.25) }}>
                    <span style={{ ...h3(m), fontWeight: 600, color: d.accent }}>{d.num}</span>
                    <span style={{ ...T.meta, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.42)" }}>{d.label}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ ...h3(m), fontWeight: 600, color: d.accent }}>{d.metric}</div>
                    <div style={{ ...T.meta, color: "rgba(244,241,234,0.42)", textTransform: "uppercase" as const, marginTop: 2 }}>{d.metricLabel}</div>
                  </div>
                </div>
                <h3 style={{ ...h3(m), fontWeight: 500, color: C.sand, marginBottom: sp(1.25) }}>{d.title}</h3>
                <p style={{ ...body(m), color: "rgba(244,241,234,0.45)", margin: 0 }}>{d.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* HOW THE SCORE WORKS (Authority)                                     */
/* ================================================================== */
function AuthorityBlock() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const items = [
    { label: "Fixed structural inputs", desc: "Derived from your submitted income structure — not financial accounts" },
    { label: "Deterministic scoring", desc: "Same answers always produce the same score" },
    { label: "Measures stability, not wealth", desc: "Focuses on how income holds up under disruption" },
    { label: "No financial access required", desc: "No bank connection, no credit pull" },
    { label: "Methodology published", desc: "Scoring logic, dimensions, and interpretation are transparent" },
  ];

  return (
    <section ref={ref} aria-label="How the score works" style={{
      background: C.sandBg,
      paddingTop: secY(m), paddingBottom: secY(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: readW, margin: "0 auto" }}>
        <div style={{ marginBottom: sp(5), ...fadeIn(visible) }}>
          <h2 style={{ ...h2(m), color: C.navy, marginBottom: sp(2.5) }}>A fixed model. Not an opinion.</h2>
        </div>

        <div style={fadeIn(visible, 150)}>
          {items.map((item) => (
            <div key={item.label} style={{ display: "flex", gap: sp(2), alignItems: "flex-start", padding: `${sp(2)}px 0`, borderTop: `1px solid ${C.border}` }}>
              <span style={{ color: C.teal, fontSize: 14, lineHeight: "24px", flexShrink: 0 }}>&#x2713;</span>
              <div>
                <div style={{ ...T.label, fontWeight: 600, color: C.navy, marginBottom: 2 }}>{item.label}</div>
                <div style={{ ...body(m), color: C.muted }}>{item.desc}</div>
              </div>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${C.border}` }} />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: sp(3), marginTop: sp(3.5), ...fadeIn(visible, 300) }}>
          <span style={{ ...T.meta, color: C.light, fontWeight: 500 }}>Model Version: RP-2.0</span>
          <span style={{ ...T.meta, color: C.light, fontWeight: 500 }}>Assessment Type: Structural Income Stability Diagnostic</span>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* WHAT YOU GET                                                        */
/* ================================================================== */
function WhatYouGet() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const reportItems = [
    "Score and stability band",
    "Plain-English interpretation",
    "PressureMap analysis",
    "Ranked disruption scenarios",
    "Industry-tailored action plan",
    "Best first improvement",
    "30-day roadmap",
  ];

  return (
    <section ref={ref} aria-label="What you get" style={{
      background: C.navy,
      paddingTop: secY(m), paddingBottom: secY(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: sp(5), ...fadeIn(visible) }}>
          <h2 style={{ ...h2(m), color: C.sand, marginBottom: sp(2.5) }}>
            A complete structural diagnostic generated from your submitted inputs.
          </h2>
        </div>

        <div style={{ display: m ? "flex" : "grid", gridTemplateColumns: "1fr 1.3fr", gap: sp(5), flexDirection: "column" }}>
          <div style={fadeIn(visible, 100)}>
            <div style={{ ...T.meta, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.42)", marginBottom: sp(2.5) }}>
              Your report includes
            </div>
            {reportItems.map((item, i) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: sp(1.5), padding: `${sp(1.5)}px 0`, borderBottom: i < reportItems.length - 1 ? "1px solid rgba(244,241,234,0.06)" : "none" }}>
                <span style={{ color: C.teal, fontSize: 13, flexShrink: 0 }}>&#x2713;</span>
                <span style={{ ...body(m), color: "rgba(244,241,234,0.65)" }}>{item}</span>
              </div>
            ))}
          </div>

          <div style={fadeIn(visible, 250)}>
            <div style={{ border: "1px solid rgba(244,241,234,0.08)", borderRadius: sp(1.5), padding: m ? sp(3) : sp(4), background: "rgba(244,241,234,0.02)" }}>
              <div style={{ ...T.meta, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: C.teal, marginBottom: sp(1) }}>
                Stability Simulator
              </div>
              <p style={{ ...T.label, color: "rgba(244,241,234,0.42)", marginBottom: sp(2.5) }}>Included with your diagnostic.</p>
              <p style={{ ...body(m), color: "rgba(244,241,234,0.50)", marginBottom: sp(3) }}>
                Test how structural changes may affect your score before you make them.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: sp(1.5) }}>
                {["Model one change at a time", "See projected impact", "Compare current vs simulated score", "Identify which change moves your score most"].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: sp(1) }}>
                    <span style={{ color: C.teal, fontSize: 13, flexShrink: 0 }}>&#x2713;</span>
                    <span style={{ ...T.label, color: "rgba(244,241,234,0.45)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* WHY THIS MATTERS                                                    */
/* ================================================================== */
function WhyNowSection() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} aria-label="Why this matters" style={{
      background: C.white, paddingTop: secY(m), paddingBottom: secY(m),
      paddingLeft: px(m), paddingRight: px(m), textAlign: "center",
    }}>
      <div style={{ maxWidth: readW, margin: "0 auto", ...fadeIn(visible) }}>
        <h2 style={{ ...h2(m), color: C.navy, marginBottom: sp(2.5) }}>Income looks strongest right before pressure arrives.</h2>
        <p style={{ ...bodyLg(m), color: C.muted, marginBottom: sp(2) }}>
          Most income problems are not visible in revenue alone.<br />
          They surface when one source changes, one month slips, or one contract ends.
        </p>
        <p style={{ ...body(m), color: C.muted, marginBottom: sp(4) }}>
          This score is designed to reveal structural weakness before it becomes financial pain.
        </p>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: sp(3) }}>
          <p style={{ ...T.label, color: C.light, fontStyle: "italic", margin: 0 }}>
            The median small business holds just 27 days of cash buffer.
            <span style={{ ...T.meta, fontStyle: "normal", marginLeft: sp(1) }}>&mdash; JPMorgan Chase Institute</span>
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* PROOF (Testimonials)                                                */
/* ================================================================== */
function ProofSection() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const testimonials = [
    { quote: "The score made it obvious that too much of my income came from one source. The report gave me a clearer next step than my own planning notes had.", name: "Sarah M.", role: "Real Estate Agent", score: 28 },
    { quote: "The value was not the number alone. It was seeing which structural weakness mattered most and what a single change would do to the score.", name: "James R.", role: "Software Contractor", score: 44 },
    { quote: "The report helped me separate revenue from stability. I had been treating them like the same thing.", name: "Priya K.", role: "Management Consultant", score: 61 },
  ];

  return (
    <section ref={ref} aria-label="Proof" style={{
      background: C.navy, paddingTop: secY(m), paddingBottom: secY(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: sp(5), ...fadeIn(visible) }}>
          <h2 style={{ ...h2(m), color: C.sand }}>What the assessment revealed.</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: sp(2.5) }}>
          {testimonials.map((t, i) => (
            <div key={t.name} style={{
              backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: sp(1), padding: m ? sp(3.5) : sp(4),
              display: "flex", flexDirection: "column",
              ...fadeIn(visible, 150 + i * 100),
            }}>
              <p style={{ ...body(m), color: "rgba(244,241,234,0.70)", fontStyle: "italic", margin: `0 0 ${sp(2.5)}px`, flex: 1 }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ borderTop: "1px solid rgba(244,241,234,0.06)", paddingTop: sp(2) }}>
                <div style={{ ...T.label, fontWeight: 600, color: C.sand, marginBottom: 2 }}>{t.name}</div>
                <div style={{ ...T.meta, color: "rgba(244,241,234,0.42)" }}>{t.role} &middot; Score: {t.score}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* TRUST STRIP                                                         */
/* ================================================================== */
function TrustStrip() {
  const m = useMobile();
  return (
    <section aria-label="Trust" style={{
      background: C.sandBg, paddingTop: m ? sp(4) : sp(5), paddingBottom: m ? sp(4) : sp(5),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: m ? `${sp(1)}px ${sp(2.5)}px` : `${sp(1)}px ${sp(4.5)}px`, maxWidth: maxW, margin: "0 auto" }}>
        {["Methodology published", "Model version controlled", "Deterministic scoring", "Private by default"].map((item) => (
          <span key={item} style={{ ...T.label, color: C.muted, fontWeight: 500 }}>{item}</span>
        ))}
      </div>
    </section>
  );
}


/* ================================================================== */
/* PRICING                                                             */
/* ================================================================== */
function PricingSection() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} aria-label="Pricing" style={{
      background: C.navy, paddingTop: secY(m), paddingBottom: secY(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: sp(3), ...fadeIn(visible) }}>
          <h2 style={{ ...h2(m), color: C.sand, marginBottom: sp(2.5) }}>Know your structure before it breaks</h2>
          <p style={{ ...bodyLg(m), color: "rgba(244,241,234,0.70)", marginBottom: sp(4) }}>
            Built for people whose income does not arrive on autopilot.
          </p>
        </div>

        <div style={{ textAlign: "center", marginBottom: sp(5), ...fadeIn(visible, 100) }}>
          <div style={{ ...T.meta, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.42)", marginBottom: sp(1.5) }}>
            Used by professionals in
          </div>
          <p style={{ ...T.label, color: "rgba(244,241,234,0.45)", lineHeight: 1.8, maxWidth: 640, margin: "0 auto" }}>
            Real estate &bull; Consulting &bull; Software contracting &bull; Insurance &bull; Mortgage &bull; Creative services &bull; Solo legal &bull; Financial advisory
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: sp(2.5), maxWidth: 720, margin: "0 auto", ...fadeIn(visible, 200) }}>
          {/* Free */}
          <div style={{ background: C.white, borderRadius: sp(1.5), padding: m ? sp(3.5) : sp(4), border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 16px 48px rgba(0,0,0,0.18)" }}>
            <div style={{ ...T.label, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: C.teal, marginBottom: sp(2) }}>
              Income Stability Score&#8482;
            </div>
            <div style={{ ...price(m), color: C.navy, marginBottom: sp(2) }}>$0</div>
            <div style={{ marginBottom: sp(3) }}>
              {["Score out of 100", "Stability band", "Primary structural constraint", "One recommended direction"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: sp(1), marginBottom: sp(0.75) }}>
                  <span style={{ color: C.teal, fontSize: 13, flexShrink: 0 }}>&#x2713;</span>
                  <span style={{ ...body(m), color: C.muted }}>{item}</span>
                </div>
              ))}
            </div>
            <Link href="/pricing" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "100%", height: sp(7), borderRadius: sp(1),
              backgroundColor: C.white, color: C.navy, ...T.cta,
              textDecoration: "none", border: `1px solid ${C.navy}`,
              transition: "background-color 180ms ease, color 180ms ease",
            }}
              onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.backgroundColor = C.navy; e.currentTarget.style.color = C.white; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.white; e.currentTarget.style.color = C.navy; }}
            >Get My Free Score</Link>
          </div>

          {/* Paid */}
          <div style={{ background: C.white, borderRadius: sp(1.5), padding: m ? sp(3.5) : sp(4), border: "1px solid rgba(75,63,174,0.15)", boxShadow: "0 20px 56px rgba(75,63,174,0.15), 0 8px 24px rgba(0,0,0,0.10)" }}>
            <div style={{ ...T.label, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: C.teal, marginBottom: sp(2) }}>
              RunPayway&#8482; Diagnostic Report
            </div>
            <div style={{ ...price(m), color: C.navy, marginBottom: sp(2) }}>$69</div>
            <div style={{ marginBottom: sp(3) }}>
              {["Industry-tailored 4-page diagnostic", "PressureMap analysis", "Plain-English interpretation", "Ranked disruption scenarios", "Best first improvement", "30-day action roadmap", "Stability Simulator access", "Email delivery"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: sp(1), marginBottom: sp(0.75) }}>
                  <span style={{ color: C.purple, fontSize: 13, flexShrink: 0 }}>&#x2713;</span>
                  <span style={{ ...body(m), color: C.muted }}>{item}</span>
                </div>
              ))}
            </div>
            <a href={process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL || "https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05"} style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "100%", height: sp(7), borderRadius: sp(1),
              background: C.heroGradient, color: C.white, ...T.cta,
              textDecoration: "none", boxShadow: "0 8px 24px rgba(75,63,174,0.25)",
              transition: "transform 180ms ease, box-shadow 180ms ease",
            }}
              onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(75,63,174,0.35)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(75,63,174,0.25)"; }}
            >Get Diagnostic Report — $69</a>
            <p style={{ ...T.meta, color: C.light, textAlign: "center", marginTop: sp(1.5), marginBottom: 0 }}>30-day satisfaction guarantee</p>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: sp(5), ...fadeIn(visible, 350) }}>
          <div style={{ display: "inline-block", padding: `${sp(2)}px ${sp(4)}px`, borderRadius: sp(1.5), border: "1px solid rgba(244,241,234,0.10)" }}>
            <p style={{ ...body(m), color: "rgba(244,241,234,0.65)", margin: 0, fontWeight: 500 }}>
              If the report does not deliver meaningful new insight into your income structure, request a full refund within 30 days.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* FAQ                                                                 */
/* ================================================================== */
function FaqSection({ openFaq, setOpenFaq }: { openFaq: number | null; setOpenFaq: (v: number | null) => void }) {
  const { ref, visible } = useInView();
  const m = useMobile();

  const faqs = [
    { q: "What does this measure?", a: "Income structure stability — not revenue, not wealth." },
    { q: "What does it not measure?", a: "Net worth, creditworthiness, or financial outcomes." },
    { q: "Why should I trust this score?", a: "It is based on fixed structural inputs and deterministic scoring. The same inputs always produce the same result." },
    { q: "How is this different from revenue or credit tools?", a: "Revenue measures how much you earn. Credit measures repayment behavior. This measures how stable your income structure is under disruption." },
    { q: "What do I get for free?", a: "Your score, band, primary constraint, and one recommended direction." },
    { q: "What does the $69 report include?", a: "Full diagnostic, disruption analysis, action plan, and simulator access." },
    { q: "Is my information confidential?", a: "Yes. No bank connections. No external data access. Private by default." },
    { q: "Can I retake the assessment?", a: "Yes. You can retake it anytime to reflect changes in your structure." },
  ];

  return (
    <section ref={ref} aria-label="FAQ" style={{
      background: C.sandBg, paddingTop: secY(m), paddingBottom: secY(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <h2 style={{ ...h2(m), color: C.navy, textAlign: "center", marginBottom: sp(5), ...fadeIn(visible) }}>
          Frequently asked questions
        </h2>

        <div style={fadeIn(visible, 150)}>
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            const panelId = `faq-panel-${i}`;
            const btnId = `faq-btn-${i}`;
            return (
              <div key={i} style={{ borderTop: `1px solid ${C.border}`, backgroundColor: isOpen ? "rgba(75,63,174,0.02)" : "transparent", transition: "background-color 200ms ease" }}>
                <button id={btnId} onClick={() => setOpenFaq(isOpen ? null : i)} aria-expanded={isOpen} aria-controls={panelId}
                  style={{ width: "100%", padding: `${sp(2.5)}px ${sp(2)}px`, minHeight: 48, display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ ...h3(m), fontWeight: 500, color: C.navy, paddingRight: sp(2) }}>{faq.q}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }} aria-hidden="true">
                    <path d="M3 8h10" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" />
                    {!isOpen && <path d="M8 3v10" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" />}
                  </svg>
                </button>
                <div id={panelId} role="region" aria-labelledby={btnId} style={{ maxHeight: isOpen ? 300 : 0, overflow: "hidden", transition: "max-height 300ms ease" }}>
                  <p style={{ ...body(m), color: C.muted, margin: 0, padding: `0 ${sp(2)}px ${sp(2.5)}px` }}>{faq.a}</p>
                </div>
              </div>
            );
          })}
          <div style={{ borderTop: `1px solid ${C.border}` }} />
        </div>

        <div style={{ textAlign: "center", marginTop: sp(5), ...fadeIn(visible, 300) }}>
          <Link href="/pricing" style={{ ...T.cta, color: C.purple, textDecoration: "underline", textUnderlineOffset: 4 }}>
            Get My Free Score &#8594;
          </Link>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* FINAL CTA                                                           */
/* ================================================================== */
function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} aria-label="Final CTA" style={{
      background: C.navy, paddingTop: secY(m), paddingBottom: secY(m),
      paddingLeft: px(m), paddingRight: px(m), textAlign: "center",
    }}>
      <div style={{ maxWidth: 540, margin: "0 auto", ...fadeIn(visible) }}>
        <Link href="/pricing" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          height: sp(7), padding: `0 ${sp(5)}px`, borderRadius: sp(1.25),
          background: `linear-gradient(135deg, ${C.sand}, #E8E5DD)`,
          color: C.navy, ...T.cta, textDecoration: "none",
          boxShadow: "0 4px 20px rgba(0,0,0,0.20)",
          transition: "transform 180ms ease, box-shadow 180ms ease",
        }}
          onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.25)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.20)"; }}
        >
          Get My Free Score &#8594;
        </Link>
      </div>
    </section>
  );
}


/* ================================================================== */
/* DISCLAIMER                                                          */
/* ================================================================== */
function DisclaimerSection() {
  const m = useMobile();
  return (
    <section aria-label="Disclaimer" style={{
      background: C.navy, paddingTop: m ? sp(5) : sp(6), paddingBottom: m ? sp(5) : sp(6),
      paddingLeft: px(m), paddingRight: px(m), borderTop: "1px solid rgba(244,241,234,0.06)",
    }}>
      <p style={{ ...T.meta, color: "rgba(244,241,234,0.42)", textAlign: "center", maxWidth: 640, margin: "0 auto", lineHeight: 1.6 }}>
        The Income Stability Score&#8482; is a structural income assessment based on information provided by the user.
        It does not provide financial advice, investment advice, credit underwriting, or prediction of future outcomes.
      </p>
    </section>
  );
}


/* ================================================================== */
/* PAGE EXPORT                                                         */
/* ================================================================== */
const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What does this measure?", acceptedAnswer: { "@type": "Answer", text: "Income structure stability — not revenue, not wealth." } },
    { "@type": "Question", name: "What does it not measure?", acceptedAnswer: { "@type": "Answer", text: "Net worth, creditworthiness, or financial outcomes." } },
    { "@type": "Question", name: "Why should I trust this score?", acceptedAnswer: { "@type": "Answer", text: "It is based on fixed structural inputs and deterministic scoring. The same inputs always produce the same result." } },
    { "@type": "Question", name: "How is this different from revenue or credit tools?", acceptedAnswer: { "@type": "Answer", text: "Revenue measures how much you earn. Credit measures repayment behavior. This measures how stable your income structure is under disruption." } },
    { "@type": "Question", name: "What do I get for free?", acceptedAnswer: { "@type": "Answer", text: "Your score, band, primary constraint, and one recommended direction." } },
    { "@type": "Question", name: "What does the $69 report include?", acceptedAnswer: { "@type": "Answer", text: "Full diagnostic, disruption analysis, action plan, and simulator access." } },
    { "@type": "Question", name: "Is my information confidential?", acceptedAnswer: { "@type": "Answer", text: "Yes. No bank connections. No external data access. Private by default." } },
    { "@type": "Question", name: "Can I retake the assessment?", acceptedAnswer: { "@type": "Answer", text: "Yes. You can retake it anytime to reflect changes in your structure." } },
  ],
};

const PRODUCT_SCHEMA = {
  "@context": "https://schema.org", "@type": "Product",
  name: "RunPayway Income Stability Score",
  description: "A fixed structural assessment that measures how stable your income structure is — not how much you make.",
  brand: { "@type": "Brand", name: "RunPayway" },
  offers: [
    { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Income Stability Score", description: "Score, band, primary constraint, and one recommended direction." },
    { "@type": "Offer", price: "69", priceCurrency: "USD", name: "RunPayway Diagnostic Report", description: "Full diagnostic, disruption analysis, action plan, and simulator access." },
  ],
};

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_SCHEMA) }} />
      <StickyNav />
      <HeroSection />
      <HeroVideo />
      <HowItWorksSection />
      <WhatItMeasures />
      <AuthorityBlock />
      <WhatYouGet />
      <WhyNowSection />
      <ProofSection />
      <TrustStrip />
      <PricingSection />
      <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
      <FinalCta />
      <DisclaimerSection />
    </div>
  );
}
