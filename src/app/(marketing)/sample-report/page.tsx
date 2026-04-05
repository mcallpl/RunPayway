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
const light = "rgba(14,26,43,0.62)";
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
    <header ref={ref} style={{ backgroundColor: C.white, position: "relative", overflow: "hidden", paddingTop: m ? 40 : 64, paddingBottom: m ? 40 : 56, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 20, ...fadeIn(visible) }}>Sample Report</div>
        <h1 style={{ fontSize: m ? 32 : 48, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", color: C.navy, marginBottom: 16, ...fadeIn(visible, 60) }}>
          See exactly what the diagnostic reveals — before you buy.
        </h1>
        <p style={{ fontSize: m ? 16 : 17, color: muted, lineHeight: 1.65, maxWidth: 520, margin: "0 auto", ...fadeIn(visible, 120) }}>
          Four pages generated from your answers. Every number is real. Same answers always produce the same result.
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
    <section ref={ref} style={{ backgroundColor: "#F5F4F1", paddingTop: m ? 60 : 104, paddingBottom: m ? 60 : 104, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 64, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 24 : 32, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 12 }}>Four pages. Each one earns its place.</h2>
          <p style={{ fontSize: m ? 16 : 17, color: muted, lineHeight: 1.65 }}>Nothing decorative. Every section shows something real about how your income works.</p>
        </div>

        {/* 4 report pages — clean grid, no accordions */}
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 16 : 20, ...fadeIn(visible, 100) }}>

          {/* PAGE 01 — Cover & Score */}
          <div style={{ backgroundColor: C.navy, borderRadius: 16, padding: m ? 28 : 36, textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, #2B5EA7, ${C.teal})` }} />
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(43,94,167,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2B5EA7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6M15 19v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6M9 13V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v8" /></svg>
              </div>
              <div style={{ textAlign: "left" as const }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(244,241,234,0.40)" }}>PAGE 01</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: C.sand }}>Cover &amp; Score</div>
              </div>
            </div>
            <div style={{ position: "relative", width: m ? 120 : 140, height: m ? 120 : 140, margin: "0 auto 16px" }}>
              <ScoreRing score={animatedScore} size={m ? 120 : 140} stroke={8} color="#2B5EA7" />
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: m ? 36 : 42, fontWeight: 300, fontFamily: mono, color: C.sand, lineHeight: 1 }}>{animatedScore}</span>
                <span style={{ fontSize: 12, color: "rgba(244,241,234,0.50)", marginTop: 4 }}>/100</span>
              </div>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 100, backgroundColor: "rgba(43,94,167,0.12)", marginBottom: 12 }}>
              <div style={{ width: 5, height: 5, borderRadius: 2, backgroundColor: "#2B5EA7" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#2B5EA7" }}>Established Stability</span>
            </div>
            <p style={{ fontSize: 14, color: "rgba(244,241,234,0.40)", margin: 0 }}>Score, band, distance to next level, access code.</p>
          </div>

          {/* PAGE 02 — Key Findings */}
          <div style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 24 : 32, boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 4px 16px rgba(14,26,43,0.03)", position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: `${C.purple}20` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${C.purple}08`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" /></svg>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: C.teal }}>PAGE 02</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: C.navy }}>Key Findings</div>
              </div>
            </div>

            {/* Key Takeaway */}
            <div style={{ borderLeft: `3px solid ${C.purple}`, padding: "14px 16px", borderRadius: "0 8px 8px 0", backgroundColor: "#FAFAFA", marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: C.purple, marginBottom: 4 }}>KEY TAKEAWAY</div>
              <p style={{ fontSize: 15, fontWeight: 500, color: C.navy, margin: 0, lineHeight: 1.45 }}>Your income is stable — but one client puts most of it at risk.</p>
            </div>

            {/* Income structure bar */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: light, marginBottom: 8, letterSpacing: "0.04em" }}>HOW YOUR INCOME IS BUILT</div>
              <div style={{ display: "flex", height: 14, borderRadius: 7, overflow: "hidden", marginBottom: 10 }}>
                <div style={{ width: "55%", backgroundColor: "rgba(192,57,43,0.30)" }} />
                <div style={{ width: "20%", backgroundColor: "rgba(181,137,0,0.30)", borderLeft: `2px solid ${C.white}` }} />
                <div style={{ width: "25%", backgroundColor: "rgba(31,109,122,0.35)", borderLeft: `2px solid ${C.white}` }} />
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
                {[
                  { label: "Stops if you stop", value: "55%", color: "#C0392B" },
                  { label: "Keeps coming for a while", value: "20%", color: "#B58900" },
                  { label: "Protected", value: "25%", color: C.teal },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: s.color }} />
                    <span style={{ fontSize: 13, color: muted }}>{s.label}: <strong style={{ fontFamily: mono, color: C.navy }}>{s.value}</strong></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strength + Constraint */}
            <div style={{ display: "flex", gap: 10, flexDirection: m ? "column" as const : "row" as const }}>
              <div style={{ flex: 1, padding: "12px 14px", borderRadius: 10, backgroundColor: "#FAFAFA" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: 2, backgroundColor: C.teal }} />
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: C.teal }}>STRONGEST</span>
                </div>
                <p style={{ fontSize: 14, color: C.navy, margin: 0, lineHeight: 1.45 }}>Steady month to month — income doesn't swing much.</p>
              </div>
              <div style={{ flex: 1, padding: "12px 14px", borderRadius: 10, backgroundColor: "#FAFAFA" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: 2, backgroundColor: "#C0392B" }} />
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: "#C0392B" }}>BIGGEST RISK</span>
                </div>
                <p style={{ fontSize: 14, color: C.navy, margin: 0, lineHeight: 1.45 }}>Too much from one source — if it goes, most of your income goes with it.</p>
              </div>
            </div>
          </div>

          {/* PAGE 03 — Stability Plan */}
          <div style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 24 : 32, boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 4px 16px rgba(14,26,43,0.03)", position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: `${C.teal}20` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${C.teal}08`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" /></svg>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: C.teal }}>PAGE 03</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: C.navy }}>Stability Plan</div>
              </div>
            </div>

            {/* Ranked actions with visual weight */}
            {[
              { num: 1, action: "Spread out your income", desc: "Reduce how much depends on one source", lift: "+11", effort: "High", color: "#C0392B" },
              { num: 2, action: "Lock in income further ahead", desc: "Secure commitments beyond the current quarter", lift: "+8", effort: "High", color: "#C0392B" },
              { num: 3, action: "Add repeating income", desc: "Convert project work into something that recurs", lift: "+5", effort: "Medium", color: "#B58900" },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 0", borderBottom: i < 2 ? `1px solid rgba(14,26,43,0.05)` : "none" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: `${a.color}08`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: a.color }}>{a.num}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>{a.action}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, fontFamily: mono, color: C.teal, flexShrink: 0, marginLeft: 8 }}>{a.lift}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, color: muted }}>{a.desc}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", color: a.color, padding: "2px 6px", borderRadius: 4, backgroundColor: `${a.color}08`, flexShrink: 0 }}>{a.effort}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Projected outcome */}
            <div style={{ marginTop: 16, padding: "14px 16px", borderRadius: 10, backgroundColor: `${C.teal}06`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: C.teal, marginBottom: 2 }}>IF ALL THREE IMPLEMENTED</div>
                <span style={{ fontSize: 13, color: muted }}>Combined projected impact</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 14, fontFamily: mono, color: light }}>72</span>
                <span style={{ fontSize: 12, color: light }}>&rarr;</span>
                <span style={{ fontSize: 24, fontWeight: 300, fontFamily: mono, color: C.teal }}>96</span>
              </div>
            </div>
          </div>

          {/* PAGE 04 — Stress Testing */}
          <div style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 24 : 32, boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 4px 16px rgba(14,26,43,0.03)", position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: "rgba(192,57,43,0.20)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(192,57,43,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: C.teal }}>PAGE 04</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: C.navy }}>Stress Testing</div>
              </div>
            </div>

            {/* Scenario cards with visual score drops */}
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
              {[
                { scenario: "Your largest client stops paying", projected: 44, drop: -28, severity: "Severe", color: "#C0392B" },
                { scenario: "You cannot work for 90 days", projected: 53, drop: -19, severity: "Significant", color: "#C0392B" },
                { scenario: "Upcoming work gets delayed 3 months", projected: 64, drop: -8, severity: "Moderate", color: "#B58900" },
              ].map((s, i) => (
                <div key={i} style={{ padding: "14px 16px", borderRadius: 10, backgroundColor: "#FAFAFA" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: s.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, fontWeight: 500, color: C.navy }}>{s.scenario}</span>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", color: s.color, padding: "2px 8px", borderRadius: 4, backgroundColor: `${s.color}08`, flexShrink: 0 }}>{s.severity}</span>
                  </div>
                  {/* Score drop bar */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: "rgba(14,26,43,0.04)", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 3, backgroundColor: s.color, width: `${s.projected}%`, opacity: 0.5 }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4, flexShrink: 0 }}>
                      <span style={{ fontSize: 18, fontWeight: 300, fontFamily: mono, color: s.color }}>{s.projected}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, fontFamily: mono, color: s.color }}>{s.drop}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Fragility summary */}
            <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 8, borderLeft: `3px solid #C0392B`, backgroundColor: "rgba(192,57,43,0.03)" }}>
              <p style={{ fontSize: 13, color: muted, margin: 0, lineHeight: 1.5 }}>
                <strong style={{ color: C.navy }}>Stability type: Uneven.</strong> Some parts of your income are protected, others are not. Biggest vulnerability: losing a key client.
              </p>
            </div>
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
          Start with the free score. Unlock the full diagnostic when you're ready to act.
        </p>
        <div style={{ ...fadeIn(visible, 120) }}>
          <Link href="/pricing" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: 56, padding: m ? "0 28px" : "0 44px", width: m ? "100%" : "auto", maxWidth: m ? 360 : "none",
            borderRadius: 12,
            background: `linear-gradient(135deg, ${C.white} 0%, rgba(244,241,234,0.95) 100%)`,
            color: C.navy, fontSize: m ? 15 : 16, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 2px 12px rgba(244,241,234,0.15), 0 8px 32px rgba(244,241,234,0.08)",
            border: "1px solid rgba(244,241,234,0.45)",
            transition: "transform 200ms, box-shadow 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(244,241,234,0.20), 0 12px 48px rgba(244,241,234,0.10)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(244,241,234,0.15), 0 8px 32px rgba(244,241,234,0.08)"; }}>
            Start Your Free Assessment
          </Link>
          <p style={{ fontSize: 14, color: "rgba(244,241,234,0.45)", marginTop: 14, letterSpacing: "0.02em" }}>
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
