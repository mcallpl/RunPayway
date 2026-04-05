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
    <header ref={ref} style={{ backgroundColor: C.white, position: "relative", overflow: "hidden", paddingTop: m ? 72 : 140, paddingBottom: m ? 56 : 100, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 20, ...fadeIn(visible) }}>Sample Report</div>
        <h1 style={{ fontSize: m ? 32 : 52, fontWeight: 700, lineHeight: 1.06, letterSpacing: "-0.03em", color: C.navy, marginBottom: 24, ...fadeIn(visible, 80) }}>
          See exactly what the diagnostic reveals — before you buy.
        </h1>
        <p style={{ fontSize: m ? 16 : 18, color: muted, lineHeight: 1.65, marginBottom: 20, ...fadeIn(visible, 160) }}>
          Four pages. Generated from your structure. Every number is real. The same inputs always produce the same result.
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: m ? 16 : 24, flexWrap: "wrap" as const, ...fadeIn(visible, 240) }}>
          {[
            { label: "Score", value: "72", color: "#2B5EA7" },
            { label: "Band", value: "Established", color: "#2B5EA7" },
            { label: "Constraint", value: "Concentration", color: "#E57373" },
            { label: "Pages", value: "4", color: C.teal },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.10em", color: "rgba(244,241,234,0.35)", marginBottom: 4 }}>{s.label.toUpperCase()}</div>
              <div style={{ fontSize: 16, fontWeight: 600, fontFamily: mono, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
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
  const [expandedPage, setExpandedPage] = useState<number | null>(null);

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>The Report</div>
          <h2 style={{ fontSize: m ? 28 : 44, fontWeight: 500, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.navy, marginBottom: 14 }}>Four pages. Each one earns its place.</h2>
          <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, maxWidth: 560 }}>Nothing decorative. Every section reflects how your income is actually built.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: m ? 32 : 44 }}>

          {/* PAGE 01 — Cover & Score */}
          <div style={{ ...fadeIn(visible, 100) }}>
            <button onClick={() => setExpandedPage(expandedPage === 1 ? null : 1)} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, background: "none", border: "none", cursor: "pointer", padding: 0, minHeight: 44 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: `${C.teal}08`, border: `1px solid ${C.teal}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 600, fontFamily: mono, color: C.teal }}>01</span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 600, color: C.navy }}>Cover &amp; Score</span>
              <span style={{ fontSize: 14, color: light, marginLeft: 4 }}>{expandedPage === 1 ? "▲" : "▼"}</span>
            </button>
            <div style={{ backgroundColor: C.navy, borderRadius: 16, padding: m ? 32 : 56, textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "50%", left: "50%", width: m ? 250 : 400, height: m ? 250 : 400, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}10 0%, transparent 70%)`, pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.45)", marginBottom: 28 }}>Income Stability Score&#8482;</div>
                <div style={{ position: "relative", width: m ? 150 : 180, height: m ? 150 : 180, margin: "0 auto 24px" }}>
                  <div style={{ position: "absolute", inset: -16, borderRadius: "50%", background: "radial-gradient(circle, rgba(43,94,167,0.12) 0%, transparent 60%)", pointerEvents: "none" }} />
                  <ScoreRing score={animatedScore} size={m ? 150 : 180} stroke={10} color="#2B5EA7" />
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: m ? 48 : 56, fontWeight: 300, fontFamily: mono, color: C.sand, lineHeight: 1, letterSpacing: "-0.04em" }}>{animatedScore}</span>
                    <span style={{ fontSize: 14, color: "rgba(244,241,234,0.40)", marginTop: 4 }}>/100</span>
                  </div>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 100, backgroundColor: "rgba(43,94,167,0.12)", border: "1px solid rgba(43,94,167,0.15)", marginBottom: 12 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: "#2B5EA7" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#2B5EA7", letterSpacing: "0.02em" }}>Established Stability</span>
                </div>
                <div style={{ fontSize: 15, color: "rgba(244,241,234,0.50)" }}>3 points to High Stability</div>
              </div>
            </div>
            {expandedPage === 1 && (
              <div style={{ padding: m ? "16px 0" : "20px 0", animation: "fadeSlideIn 300ms ease-out" }}>
                <p style={{ fontSize: 15, color: muted, lineHeight: 1.65 }}>Your score, stability band, distance to the next band, and your Command Center access code. This page establishes the baseline — the single number everything else builds from.</p>
              </div>
            )}
          </div>

          {/* PAGE 02 — Key Findings */}
          <div style={{ ...fadeIn(visible, 180) }}>
            <button onClick={() => setExpandedPage(expandedPage === 2 ? null : 2)} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, background: "none", border: "none", cursor: "pointer", padding: 0, minHeight: 44 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: `${C.teal}08`, border: `1px solid ${C.teal}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 600, fontFamily: mono, color: C.teal }}>02</span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 600, color: C.navy }}>Key Findings</span>
              <span style={{ fontSize: 14, color: light, marginLeft: 4 }}>{expandedPage === 2 ? "▲" : "▼"}</span>
            </button>
            <div style={{ backgroundColor: "#FAFAFA", borderRadius: 16, padding: m ? 24 : 36, border: `1px solid ${C.border}` }}>
              {/* Key Takeaway */}
              <div style={{ padding: m ? "18px 16px" : "20px 24px", borderRadius: 12, borderLeft: `4px solid ${C.purple}`, backgroundColor: C.white, marginBottom: 24, boxShadow: "0 1px 4px rgba(14,26,43,0.03)" }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.10em", color: C.purple, marginBottom: 8, textTransform: "uppercase" as const }}>Key Takeaway</div>
                <p style={{ fontSize: 17, fontWeight: 500, color: C.navy, margin: 0, lineHeight: 1.5 }}>
                  Your structure is stable — but one client puts most of it at risk.
                </p>
              </div>

              {/* Income Structure Bar */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 14 }}>Income Structure</div>
                <div style={{ display: "flex", height: 14, borderRadius: 7, overflow: "hidden", marginBottom: 12 }}>
                  <div style={{ width: "55%", backgroundColor: "rgba(192,57,43,0.25)" }} />
                  <div style={{ width: "20%", backgroundColor: "rgba(181,137,0,0.25)", borderLeft: `2px solid ${C.white}` }} />
                  <div style={{ width: "25%", backgroundColor: "rgba(31,109,122,0.30)", borderLeft: `2px solid ${C.white}` }} />
                </div>
                <div style={{ display: "flex", gap: m ? 12 : 24, fontSize: 14, color: muted, flexWrap: "wrap" as const }}>
                  <span>Active: <strong style={{ color: C.navy, fontFamily: mono }}>55%</strong></span>
                  <span>Semi-persistent: <strong style={{ color: C.navy, fontFamily: mono }}>20%</strong></span>
                  <span>Persistent: <strong style={{ color: C.navy, fontFamily: mono }}>25%</strong></span>
                </div>
              </div>

              {/* Strength + Risk */}
              <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ padding: m ? "16px 14px" : "18px 20px", borderRadius: 12, backgroundColor: C.white, border: `1px solid ${C.border}`, marginBottom: m ? 10 : 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: C.teal }} />
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: C.teal, textTransform: "uppercase" as const }}>Strongest factor</span>
                  </div>
                  <p style={{ fontSize: 15, color: C.navy, margin: 0, lineHeight: 1.55 }}>Low variability — earnings are consistent month to month.</p>
                </div>
                <div style={{ padding: m ? "16px 14px" : "18px 20px", borderRadius: 12, backgroundColor: C.white, border: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: "#C0392B" }} />
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#C0392B", textTransform: "uppercase" as const }}>Root constraint</span>
                  </div>
                  <p style={{ fontSize: 15, color: C.navy, margin: 0, lineHeight: 1.55 }}>High concentration — one source carries most of the structure.</p>
                </div>
              </div>
            </div>
            {expandedPage === 2 && (
              <div style={{ padding: m ? "16px 0" : "20px 0", animation: "fadeSlideIn 300ms ease-out" }}>
                <p style={{ fontSize: 15, color: muted, lineHeight: 1.65 }}>Plain-English explanation of your structure. What makes it strong, what makes it fragile, and the single constraint doing the most damage to your score.</p>
              </div>
            )}
          </div>

          {/* PAGE 03 — Stability Plan */}
          <div style={{ ...fadeIn(visible, 260) }}>
            <button onClick={() => setExpandedPage(expandedPage === 3 ? null : 3)} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, background: "none", border: "none", cursor: "pointer", padding: 0, minHeight: 44 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: `${C.teal}08`, border: `1px solid ${C.teal}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 600, fontFamily: mono, color: C.teal }}>03</span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 600, color: C.navy }}>Stability Plan</span>
              <span style={{ fontSize: 14, color: light, marginLeft: 4 }}>{expandedPage === 3 ? "▲" : "▼"}</span>
            </button>
            <div style={{ backgroundColor: "#FAFAFA", borderRadius: 16, padding: m ? 24 : 36, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 17, fontWeight: 600, color: C.navy, marginBottom: 20 }}>Ranked by impact. Ordered for execution.</div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 24 }}>
                {[
                  { action: "Reduce concentration", lift: "+11", priority: "High", color: "#C0392B" },
                  { action: "Extend forward visibility", lift: "+8", priority: "High", color: "#C0392B" },
                  { action: "Add recurring revenue stream", lift: "+5", priority: "Medium", color: "#B58900" },
                ].map((a, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: m ? "14px 14px" : "14px 18px", borderRadius: 10, backgroundColor: C.white, border: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: `${a.color}08`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: a.color }}>{i + 1}</span>
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 500, color: C.navy }}>{a.action}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, fontFamily: mono, color: C.teal }}>{a.lift}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: a.color, padding: "3px 10px", borderRadius: 6, backgroundColor: `${a.color}08` }}>{a.priority}</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Projected path */}
              <div style={{ padding: m ? "16px 14px" : "18px 20px", borderRadius: 12, backgroundColor: C.white, border: `1px solid ${C.teal}15` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, color: muted }}>If all three are implemented</span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontSize: 14, fontFamily: mono, color: light }}>72</span>
                    <span style={{ fontSize: 12, color: light }}>&rarr;</span>
                    <span style={{ fontSize: 22, fontWeight: 300, fontFamily: mono, color: C.teal }}>96</span>
                  </div>
                </div>
              </div>
            </div>
            {expandedPage === 3 && (
              <div style={{ padding: m ? "16px 0" : "20px 0", animation: "fadeSlideIn 300ms ease-out" }}>
                <p style={{ fontSize: 15, color: muted, lineHeight: 1.65 }}>Your highest-leverage actions ranked by how many points they add to your score. Each includes a description, effort level, and a 12-week execution timeline in your Command Center.</p>
              </div>
            )}
          </div>

          {/* PAGE 04 — Stress Testing */}
          <div style={{ ...fadeIn(visible, 340) }}>
            <button onClick={() => setExpandedPage(expandedPage === 4 ? null : 4)} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, background: "none", border: "none", cursor: "pointer", padding: 0, minHeight: 44 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: `${C.teal}08`, border: `1px solid ${C.teal}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 600, fontFamily: mono, color: C.teal }}>04</span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 600, color: C.navy }}>Stress Testing</span>
              <span style={{ fontSize: 14, color: light, marginLeft: 4 }}>{expandedPage === 4 ? "▲" : "▼"}</span>
            </button>
            <div style={{ backgroundColor: "#FAFAFA", borderRadius: 16, padding: m ? 24 : 36, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 17, fontWeight: 600, color: C.navy, marginBottom: 20 }}>What breaks your structure — and how fast</div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                {[
                  { scenario: "Your largest client stops paying", drop: -28, projected: 44, severity: "Severe", color: "#C0392B" },
                  { scenario: "You cannot work for 90 days", drop: -19, projected: 53, severity: "Significant", color: "#C0392B" },
                  { scenario: "Forward commitments delayed 3 months", drop: -8, projected: 64, severity: "Moderate", color: "#B58900" },
                ].map((s, i) => (
                  <div key={i} style={{ padding: m ? "16px 14px" : "18px 20px", borderRadius: 12, backgroundColor: C.white, border: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: s.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 15, fontWeight: 500, color: C.navy }}>{s.scenario}</span>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: s.color, padding: "3px 10px", borderRadius: 6, backgroundColor: `${s.color}08`, flexShrink: 0 }}>{s.severity}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{ fontSize: 14, fontFamily: mono, color: light }}>72</span>
                      <span style={{ fontSize: 12, color: light }}>&rarr;</span>
                      <span style={{ fontSize: 20, fontWeight: 300, fontFamily: mono, color: s.color }}>{s.projected}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, fontFamily: mono, color: s.color }}>{s.drop}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {expandedPage === 4 && (
              <div style={{ padding: m ? "16px 0" : "20px 0", animation: "fadeSlideIn 300ms ease-out" }}>
                <p style={{ fontSize: 15, color: muted, lineHeight: 1.65 }}>Real-world disruption scenarios with exact score drops. Shows not just whether your structure is stable, but what specific event would break it — and by how much.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
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
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: m ? 72 : 120, paddingLeft: px(m), paddingRight: px(m), position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: m ? 300 : 500, height: m ? 300 : 500, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: contentW, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Beyond the report */}
        <div style={{ textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>Beyond the report</div>
          <h2 style={{ fontSize: m ? 28 : 44, fontWeight: 500, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.sand, marginBottom: 14 }}>
            The report shows the diagnosis.{m ? " " : <br />}The Command Center lets you change it.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(244,241,234,0.50)", lineHeight: 1.65 }}>Every tool runs on your actual structure — not estimates.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 12, maxWidth: 880, margin: "0 auto", marginBottom: m ? 56 : 80, ...fadeIn(visible, 120) }}>
          {[
            { label: "PressureMap\u2122", desc: "See where your income is vulnerable and where it is protected — by zone." },
            { label: "What-If Simulator", desc: "Model structural changes before you commit. See the exact score impact." },
            { label: "12-Week Roadmap", desc: "Sequenced action plan with industry-specific scripts and success criteria." },
            { label: "Goal Mode", desc: "Pick a target band. See the minimum structural moves required to reach it." },
          ].map((mod, i) => (
            <div key={i} style={{ padding: m ? "18px 16px" : "22px 24px", borderRadius: 12, backgroundColor: "rgba(244,241,234,0.03)", border: "1px solid rgba(244,241,234,0.06)" }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.sand, marginBottom: 6 }}>{mod.label}</div>
              <p style={{ fontSize: 14, color: "rgba(244,241,234,0.50)", lineHeight: 1.6, margin: 0 }}>{mod.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", ...fadeIn(visible, 220) }}>
          <div style={{ width: 48, height: 1, background: `linear-gradient(90deg, transparent, ${C.teal}30, transparent)`, margin: "0 auto 40px" }} />
          <h2 style={{ fontSize: m ? 24 : 36, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.sand, marginBottom: 16 }}>
            Your report will look like this —{m ? " " : <br />}but every number will be yours.
          </h2>
          <p style={{ fontSize: 17, color: "rgba(244,241,234,0.45)", lineHeight: 1.65, marginBottom: 36 }}>
            Start with the free score. Unlock the full diagnostic when you&#8217;re ready to act.
          </p>
          <div>
            <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 56, padding: m ? "0 28px" : "0 48px", width: m ? "100%" : "auto", maxWidth: m ? 360 : "none", borderRadius: 12, backgroundColor: C.white, color: C.navy, fontSize: m ? 15 : 16, fontWeight: 600, textDecoration: "none", transition: "background-color 200ms, box-shadow 200ms", boxShadow: "0 2px 16px rgba(244,241,234,0.10)" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#E8E5DE"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; }}>
              Start Your Free Assessment
            </Link>
            <p style={{ fontSize: 13, color: "rgba(244,241,234,0.35)", marginTop: 14, letterSpacing: "0.02em" }}>
              Under 2 minutes &bull; Instant result &bull; $69 for full diagnostic
            </p>
          </div>
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
