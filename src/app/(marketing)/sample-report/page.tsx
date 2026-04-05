"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ================================================================== */
/* UTILITIES                                                           */
/* ================================================================== */

function useInView(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) { setVisible(true); return; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => { const c = () => setM(window.innerWidth <= bp); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, [bp]);
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

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => { setR(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  return r;
}

function useFadeIn() {
  const reduced = useReducedMotion();
  return (visible: boolean, delay = 0): React.CSSProperties =>
    reduced ? {} : { opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)", transition: `opacity 500ms ease-out ${delay}ms, transform 500ms ease-out ${delay}ms` };
}

/* ================================================================== */
/* DESIGN SYSTEM                                                       */
/* ================================================================== */

const C = { navy: "#1C1635", purple: "#4B3FAE", teal: "#1F6D7A", sand: "#F4F1EA", white: "#FFFFFF", border: "#E5E7EB" };
const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';
const muted = "rgba(14,26,43,0.68)";
const light = "rgba(14,26,43,0.52)";
const contentW = 1040;
const secPad = (m: boolean) => m ? 56 : 112;
const px = (m: boolean) => m ? 20 : 24;

function ScoreRing({ score, size, stroke = 8, color }: { score: number; size: number; stroke?: number; color: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(244,241,234,0.10)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)", filter: `drop-shadow(0 0 4px ${color}40)` }} />
    </svg>
  );
}


/* ================================================================== */
/* SECTION 1 — HERO                                                    */
/* ================================================================== */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <header ref={ref} style={{ backgroundColor: C.white, position: "relative", overflow: "hidden", paddingTop: m ? 36 : 56, paddingBottom: m ? 36 : 56, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 20, ...fadeIn(visible) }}>Sample Report</div>
        <h1 style={{ fontSize: m ? 32 : 48, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", color: C.navy, marginBottom: 16, ...fadeIn(visible, 60) }}>
          See exactly what the diagnostic reveals — before you buy.
        </h1>
        <p style={{ fontSize: m ? 16 : 17, color: muted, lineHeight: 1.65, maxWidth: 520, margin: "0 auto", ...fadeIn(visible, 120) }}>
          Four pages generated from your structure. Every number is real. The same inputs always produce the same result.
        </p>
      </div>
    </header>
  );
}


/* ================================================================== */
/* SECTION 2 — REPORT WALKTHROUGH                                      */
/* ================================================================== */

function ReportWalkthrough() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const animatedScore = useAnimatedCounter(72, visible, 1800);

  return (
    <section ref={ref} style={{ backgroundColor: "#F5F4F1", paddingTop: m ? 48 : 80, paddingBottom: m ? 48 : 80, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 24 : 32, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 12 }}>Four pages. Each one earns its place.</h2>
          <p style={{ fontSize: m ? 16 : 17, color: muted, lineHeight: 1.65 }}>Nothing decorative. Every section reflects how your income is actually built.</p>
        </div>

        {/* 4 report pages — clean grid, no accordions */}
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 16 : 20, ...fadeIn(visible, 100) }}>

          {/* PAGE 01 — Cover & Score */}
          <div style={{ backgroundColor: C.navy, borderRadius: 16, padding: m ? 28 : 36, textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", color: "rgba(244,241,234,0.40)", marginBottom: 4 }}>PAGE 01</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: C.sand, marginBottom: 20 }}>Cover &amp; Score</div>
            <div style={{ position: "relative", width: m ? 120 : 140, height: m ? 120 : 140, margin: "0 auto 16px" }}>
              <ScoreRing score={animatedScore} size={m ? 120 : 140} stroke={8} color="#2B5EA7" />
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: m ? 36 : 42, fontWeight: 300, fontFamily: mono, color: C.sand, lineHeight: 1 }}>{animatedScore}</span>
                <span style={{ fontSize: 12, color: "rgba(244,241,234,0.35)", marginTop: 4 }}>/100</span>
              </div>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 100, backgroundColor: "rgba(43,94,167,0.12)", marginBottom: 12 }}>
              <div style={{ width: 5, height: 5, borderRadius: 2, backgroundColor: "#2B5EA7" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#2B5EA7" }}>Established Stability</span>
            </div>
            <p style={{ fontSize: 14, color: "rgba(244,241,234,0.40)", margin: 0 }}>Score, band, distance to next level, access code.</p>
          </div>

          {/* PAGE 02 — Key Findings */}
          <div style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 24 : 32, boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 4px 16px rgba(14,26,43,0.03)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, marginBottom: 4 }}>PAGE 02</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: C.navy, marginBottom: 16 }}>Key Findings</div>
            <div style={{ borderLeft: `3px solid ${C.purple}`, padding: "12px 14px", borderRadius: "0 8px 8px 0", backgroundColor: "#FAFAFA", marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: C.purple, marginBottom: 4 }}>KEY TAKEAWAY</div>
              <p style={{ fontSize: 15, fontWeight: 500, color: C.navy, margin: 0, lineHeight: 1.45 }}>Your structure is stable — but one client puts most of it at risk.</p>
            </div>
            <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ width: "55%", backgroundColor: "rgba(192,57,43,0.25)" }} />
              <div style={{ width: "20%", backgroundColor: "rgba(181,137,0,0.25)", borderLeft: `2px solid ${C.white}` }} />
              <div style={{ width: "25%", backgroundColor: "rgba(31,109,122,0.30)", borderLeft: `2px solid ${C.white}` }} />
            </div>
            <p style={{ fontSize: 14, color: muted, margin: 0 }}>Structure breakdown, strengths, and root constraint.</p>
          </div>

          {/* PAGE 03 — Stability Plan */}
          <div style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 24 : 32, boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 4px 16px rgba(14,26,43,0.03)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, marginBottom: 4 }}>PAGE 03</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: C.navy, marginBottom: 16 }}>Stability Plan</div>
            {[
              { action: "Reduce concentration", lift: "+11" },
              { action: "Extend forward visibility", lift: "+8" },
              { action: "Add recurring stream", lift: "+5" },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? `1px solid rgba(14,26,43,0.05)` : "none" }}>
                <span style={{ fontSize: 14, color: C.navy }}>{a.action}</span>
                <span style={{ fontSize: 14, fontWeight: 600, fontFamily: mono, color: C.teal }}>{a.lift}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 14, paddingTop: 12, borderTop: `1px solid rgba(14,26,43,0.06)` }}>
              <span style={{ fontSize: 13, color: light }}>Projected</span>
              <span style={{ fontSize: 20, fontWeight: 300, fontFamily: mono, color: C.teal }}>72 &rarr; 96</span>
            </div>
          </div>

          {/* PAGE 04 — Stress Testing */}
          <div style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 24 : 32, boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 4px 16px rgba(14,26,43,0.03)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, marginBottom: 4 }}>PAGE 04</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: C.navy, marginBottom: 16 }}>Stress Testing</div>
            {[
              { scenario: "Top client leaves", score: "44", drop: "-28", color: "#C0392B" },
              { scenario: "Can\u2019t work 90 days", score: "53", drop: "-19", color: "#C0392B" },
              { scenario: "Commitments delayed", score: "64", drop: "-8", color: "#B58900" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? `1px solid rgba(14,26,43,0.05)` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: C.navy }}>{s.scenario}</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontSize: 14, fontFamily: mono, color: s.color }}>{s.score}</span>
                  <span style={{ fontSize: 12, fontFamily: mono, color: s.color }}>{s.drop}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3 — WHAT COMES WITH IT + CTA                                */
/* ================================================================== */

function WhatYouGetAndCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 64 : 112, paddingBottom: m ? 64 : 112, paddingLeft: px(m), paddingRight: px(m), position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: m ? 300 : 500, height: m ? 300 : 500, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: m ? 26 : 40, fontWeight: 500, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.sand, marginBottom: 16, ...fadeIn(visible) }}>
          Your report will look like this —{m ? " " : <br />}but every number will be yours.
        </h2>
        <p style={{ fontSize: 17, color: "rgba(244,241,234,0.45)", lineHeight: 1.65, marginBottom: 36, ...fadeIn(visible, 60) }}>
          Start with the free score. Unlock the full diagnostic when you&#8217;re ready to act.
        </p>
        <div style={{ ...fadeIn(visible, 120) }}>
          <Link href="/pricing" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: 56, padding: m ? "0 28px" : "0 44px", width: m ? "100%" : "auto", maxWidth: m ? 360 : "none",
            borderRadius: 12,
            background: `linear-gradient(135deg, ${C.white} 0%, rgba(244,241,234,0.95) 100%)`,
            color: C.navy, fontSize: m ? 15 : 16, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 2px 12px rgba(244,241,234,0.15), 0 8px 32px rgba(244,241,234,0.08)",
            border: "1px solid rgba(244,241,234,0.30)",
            transition: "transform 200ms, box-shadow 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(244,241,234,0.20), 0 12px 48px rgba(244,241,234,0.10)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(244,241,234,0.15), 0 8px 32px rgba(244,241,234,0.08)"; }}>
            Start Your Free Assessment
          </Link>
          <p style={{ fontSize: 14, color: "rgba(244,241,234,0.30)", marginTop: 14, letterSpacing: "0.02em" }}>
            Under 2 minutes &bull; Instant result &bull; Private by default
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* PAGE EXPORT                                                         */
/* ================================================================== */

export default function SampleReportPage() {
  return (
    <div className="overflow-x-hidden">
      <main>
        <HeroSection />
        <ReportWalkthrough />
        <WhatYouGetAndCta />
      </main>
    </div>
  );
}
