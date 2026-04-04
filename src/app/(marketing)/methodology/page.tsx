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

const C = { navy: "#0E1A2B", purple: "#4B3FAE", teal: "#1F6D7A", sand: "#F4F1EA", white: "#FFFFFF", border: "#E5E7EB" };
const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';
const muted = "rgba(14,26,43,0.55)";
const light = "rgba(14,26,43,0.38)";
const contentW = 1040;
const secPad = (m: boolean) => m ? 56 : 112;
const px = (m: boolean) => m ? 20 : 24;


/* ================================================================== */
/* SECTION 1 — HERO                                                    */
/* ================================================================== */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <header ref={ref} style={{ backgroundColor: C.navy, position: "relative", overflow: "hidden", paddingTop: m ? 80 : 140, paddingBottom: m ? 56 : 100, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 780, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 20, ...fadeIn(visible) }}>Methodology</div>
        <h1 style={{ fontSize: m ? 36 : 52, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.03em", color: "#F4F1EA", marginBottom: 28, ...fadeIn(visible, 80) }}>
          Fixed rules. Deterministic scoring.{m ? " " : <br />}Every result reproducible.
        </h1>
        <div style={{ maxWidth: 560, ...fadeIn(visible, 180) }}>
          <p style={{ fontSize: 17, color: "rgba(244,241,234,0.55)", lineHeight: 1.65, marginBottom: 12 }}>
            The Income Stability Score&#8482; is a deterministic structural assessment. The same inputs always produce the same score.
          </p>
          <p style={{ fontSize: 16, color: "rgba(244,241,234,0.40)", lineHeight: 1.6 }}>
            Every rule is versioned and auditable.
          </p>
        </div>
        <div style={{ marginTop: m ? 40 : 56, paddingTop: m ? 24 : 32, borderTop: "1px solid rgba(244,241,234,0.06)", ...fadeIn(visible, 300) }}>
          <p style={{ fontSize: 12, letterSpacing: "0.04em", color: "rgba(244,241,234,0.25)" }}>
            RunPayway&#8482; Structural Income Classification System &bull; Model RP-2.0 &bull; Deterministic &bull; Version-controlled &bull; Audit-reproducible
          </p>
        </div>
      </div>
    </header>
  );
}


/* ================================================================== */
/* SECTION 2 — SYSTEM DEFINITION                                       */
/* ================================================================== */

function SystemDefinition() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 24, ...fadeIn(visible) }}>What this system does</h2>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 28, ...fadeIn(visible, 80) }}>
          RunPayway&#8482; measures the structural resilience of income.
        </p>
        <div style={{ padding: "24px 28px", borderRadius: 14, backgroundColor: "#FAFAFA", border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.teal}`, ...fadeIn(visible, 160) }}>
          <p style={{ fontSize: 18, fontWeight: 500, color: C.navy, lineHeight: 1.5, margin: 0 }}>
            The Income Stability Score&#8482; measures how your income structure performs under disruption.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3 — WHAT THE MODEL MEASURES                                 */
/* ================================================================== */

function WhatTheModelMeasures() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 24, ...fadeIn(visible) }}>
          Not how much you earn.{m ? " " : <br />}How well it holds up.
        </h2>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 28, ...fadeIn(visible, 80) }}>
          Two people earning the same income can have completely different stability.
        </p>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 20, ...fadeIn(visible, 120) }}>The model evaluates how income is structured:</p>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 28, ...fadeIn(visible, 160) }}>
          {["how income recurs", "how concentrated it is", "how diversified it is", "how far forward it is secured", "how consistent it is over time", "how much continues without active work"].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
              <span style={{ fontSize: 16, color: C.navy }}>{item}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 17, fontWeight: 500, color: C.navy, ...fadeIn(visible, 240) }}>
          The result reflects structural durability — not income size.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 4 — THE SIX DIMENSIONS                                      */
/* ================================================================== */

function TheSixDimensions() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const dims = [
    { name: "Recurrence", tag: "Structure", desc: "Income that continues from existing agreements without new acquisition.", color: C.teal },
    { name: "Concentration", tag: "Stability", desc: "Reliance on a single source. Measures what percentage flows through the largest contributor.", color: "#C0392B" },
    { name: "Diversification", tag: "Structure", desc: "Number of independent income sources contributing meaningful share.", color: C.teal },
    { name: "Forward Visibility", tag: "Structure", desc: "Income secured ahead of time under signed or enforceable agreements.", color: C.teal },
    { name: "Earnings Consistency", tag: "Stability", desc: "Variation in income over the prior 12 months.", color: "#B58900" },
    { name: "Labor Independence", tag: "Stability", desc: "Income that continues without active work during interruption.", color: "#B58900" },
  ];
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 16, ...fadeIn(visible) }}>The dimensions</h2>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 8, ...fadeIn(visible, 60) }}>Six fixed dimensions are evaluated using versioned definitions.</p>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: m ? 36 : 56, ...fadeIn(visible, 100) }}>Each dimension is scored independently before interaction effects are applied.</p>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr", gap: 16, ...fadeIn(visible, 160) }}>
          {dims.map((d, i) => (
            <div key={i} style={{ padding: m ? 24 : 28, borderRadius: 14, border: `1px solid ${C.border}`, backgroundColor: "#FAFAFA", position: "relative" as const, overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: `${d.color}25` }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 17, fontWeight: 600, color: C.navy }}>{d.name}</span>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: d.color, padding: "3px 8px", borderRadius: 4, backgroundColor: `${d.color}08` }}>{d.tag}</span>
              </div>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.6, margin: 0 }}>{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 5 — SCORING FRAMEWORK                                       */
/* ================================================================== */

function ScoringFramework() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 24, ...fadeIn(visible) }}>The scoring framework</h2>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: m ? 32 : 48, ...fadeIn(visible, 80) }}>The model evaluates two blocks:</p>
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: m ? 32 : 48, ...fadeIn(visible, 140) }}>
          <div style={{ padding: m ? 24 : 28, borderRadius: 14, backgroundColor: C.white, border: `1px solid ${C.border}`, marginBottom: m ? 16 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${C.teal}08`, border: `1px solid ${C.teal}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round"><path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0H5m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4" /></svg>
              </div>
              <span style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>Structure Block</span>
            </div>
            {["Recurrence", "Diversification", "Forward Visibility"].map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
                <span style={{ fontSize: 15, color: C.navy }}>{d}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: m ? 24 : 28, borderRadius: 14, backgroundColor: C.white, border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${C.purple}08`, border: `1px solid ${C.purple}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <span style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>Stability Block</span>
            </div>
            {["Concentration", "Earnings Consistency", "Labor Independence"].map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.purple, flexShrink: 0 }} />
                <span style={{ fontSize: 15, color: C.navy }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 12, ...fadeIn(visible, 200) }}>
          Each dimension is scored independently using fixed rules. The model then combines these dimensions using a deterministic weighting framework.
        </p>
        <div style={{ padding: "18px 24px", borderRadius: 12, backgroundColor: C.white, border: `1px solid ${C.border}`, display: "inline-block", ...fadeIn(visible, 260) }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, margin: 0 }}>The same inputs always produce the same score.</p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 6 — INTERACTION EFFECTS                                     */
/* ================================================================== */

function InteractionEffects() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m), position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 500, height: 500, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#F4F1EA", marginBottom: 24, ...fadeIn(visible) }}>
          Weaknesses compound.{m ? " " : <br />}The model captures that.
        </h2>
        <p style={{ fontSize: 17, color: "rgba(244,241,234,0.55)", lineHeight: 1.65, marginBottom: 20, ...fadeIn(visible, 80) }}>
          Dimensions do not exist in isolation.
        </p>
        <p style={{ fontSize: 16, color: "rgba(244,241,234,0.45)", lineHeight: 1.65, marginBottom: 32, ...fadeIn(visible, 120) }}>
          High concentration combined with low forward visibility is structurally different from concentration with strong visibility.
        </p>
        <div style={{ padding: "24px 28px", borderRadius: 14, backgroundColor: "rgba(244,241,234,0.04)", border: "1px solid rgba(244,241,234,0.08)", marginBottom: 24, ...fadeIn(visible, 180) }}>
          <p style={{ fontSize: 16, color: "rgba(244,241,234,0.60)", lineHeight: 1.65, marginBottom: 12 }}>The model evaluates how dimensions interact.</p>
          <p style={{ fontSize: 16, color: "rgba(244,241,234,0.60)", lineHeight: 1.65, marginBottom: 12 }}>Compound weaknesses reduce the score.</p>
          <p style={{ fontSize: 16, color: "rgba(244,241,234,0.60)", lineHeight: 1.65, margin: 0 }}>Reinforcing strengths improve it.</p>
        </div>
        <p style={{ fontSize: 17, fontWeight: 500, color: "#F4F1EA", ...fadeIn(visible, 260) }}>
          This ensures the score reflects structural reality — not just an average of inputs.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 7 — CLASSIFICATION SYSTEM                                   */
/* ================================================================== */

function ClassificationSystem() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const bands = [
    { range: "0\u201329", label: "Limited Stability", desc: "A single disruption can materially change the structure.", color: "#9B2C2C" },
    { range: "30\u201349", label: "Developing Stability", desc: "The structure is not yet protected.", color: "#92640A" },
    { range: "50\u201374", label: "Established Stability", desc: "The structure absorbs most common disruptions.", color: "#2B5EA7" },
    { range: "75\u2013100", label: "High Stability", desc: "The structure is resilient under sustained pressure.", color: C.teal },
  ];
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 16, ...fadeIn(visible) }}>The classification</h2>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 8, ...fadeIn(visible, 60) }}>Each score maps to a fixed band.</p>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: m ? 36 : 56, ...fadeIn(visible, 100) }}>These thresholds do not change within a model version.</p>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr 1fr", gap: 16, ...fadeIn(visible, 160) }}>
          {bands.map((b, i) => (
            <div key={i} style={{ padding: m ? 24 : 28, borderRadius: 14, border: `1px solid ${C.border}`, backgroundColor: "#FAFAFA", position: "relative" as const, overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: b.color }} />
              <div style={{ fontSize: 18, fontFamily: mono, fontWeight: 500, color: b.color, marginBottom: 10 }}>{b.range}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 8 }}>{b.label}</div>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.55, margin: 0 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 8 — ARCHITECTURE                                            */
/* ================================================================== */

function Architecture() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 16, ...fadeIn(visible) }}>System architecture</h2>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: m ? 36 : 56, ...fadeIn(visible, 80) }}>The score and the diagnostic operate in separate layers.</p>
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: m ? 24 : 36, ...fadeIn(visible, 140) }}>
          {/* Deterministic Core */}
          <div style={{ padding: m ? 24 : 32, borderRadius: 16, backgroundColor: C.white, border: `1px solid ${C.border}`, marginBottom: m ? 16 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${C.teal}08`, border: `1px solid ${C.teal}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15" /></svg>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal }}>Layer 1</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>Deterministic Core</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: muted, lineHeight: 1.6, marginBottom: 16 }}>Produces the score from structural inputs only.</p>
            {["Score (0\u2013100)", "Classification band", "Structural constraint", "Stress testing"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
                <span style={{ fontSize: 15, color: C.navy }}>{item}</span>
              </div>
            ))}
          </div>
          {/* Outcome Layer */}
          <div style={{ padding: m ? 24 : 32, borderRadius: 16, backgroundColor: C.white, border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${C.purple}08`, border: `1px solid ${C.purple}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" /></svg>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.purple }}>Layer 2</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>Outcome Layer</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: muted, lineHeight: 1.6, marginBottom: 16 }}>Applies context to improve interpretation.</p>
            {["Industry scenarios", "Prioritized actions", "Plain-English explanations", "Benchmark comparisons"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.purple, flexShrink: 0 }} />
                <span style={{ fontSize: 15, color: C.navy }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Critical boundary */}
        <div style={{ padding: "20px 28px", borderRadius: 12, backgroundColor: C.white, border: `1px solid rgba(75,63,174,0.12)`, borderLeft: `4px solid ${C.purple}`, ...fadeIn(visible, 220) }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, margin: 0, lineHeight: 1.55 }}>
            The Outcome Layer cannot modify, influence, or override the Deterministic Core under any condition.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 9 — WHY THIS MATTERS                                        */
/* ================================================================== */

function WhyThisMatters() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 24, ...fadeIn(visible) }}>Why this matters</h2>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 8, ...fadeIn(visible, 80) }}>Income structures are not tested when they are stable.</p>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 28, ...fadeIn(visible, 120) }}>They are tested when conditions change.</p>
        <p style={{ fontSize: 18, fontWeight: 500, color: C.navy, lineHeight: 1.5, ...fadeIn(visible, 200) }}>
          RunPayway&#8482; measures how your structure responds before that happens.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 10 — WHAT THE MODEL DOES NOT DO                             */
/* ================================================================== */

function WhatTheModelDoesNotDo() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const items = [
    { title: "No bank connections", desc: "The system does not access financial accounts." },
    { title: "No machine learning in scoring", desc: "The score is produced using fixed rules, not probabilistic models." },
    { title: "No subjective judgment", desc: "Every assessment follows the same logic. No human override." },
    { title: "No predictive claims", desc: "The model does not forecast income or outcomes." },
    { title: "No artificial precision", desc: "Where exact comparison is not valid, results are categorized." },
  ];
  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>What the model does not do</h2>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 16, ...fadeIn(visible, 100) }}>
          {items.map((item, i) => (
            <div key={i} style={{ padding: "18px 24px", borderRadius: 12, backgroundColor: C.white, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 4 }}>{item.title}</div>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.55, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 11 — MEASUREMENT POSITIONING                                */
/* ================================================================== */

function MeasurementPositioning() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 56 : 80, paddingBottom: m ? 56 : 80, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 28 : 36, fontWeight: 600, lineHeight: 1.15, color: "#F4F1EA", marginBottom: 16, ...fadeIn(visible) }}>
          A measurement system — not a financial product.
        </h2>
        <p style={{ fontSize: 16, color: "rgba(244,241,234,0.50)", lineHeight: 1.65, marginBottom: 12, ...fadeIn(visible, 80) }}>
          RunPayway&#8482; is designed as a structural measurement system.
        </p>
        <p style={{ fontSize: 16, color: "rgba(244,241,234,0.50)", lineHeight: 1.65, marginBottom: 20, ...fadeIn(visible, 120) }}>
          It does not provide financial, legal, or investment advice.
        </p>
        <p style={{ fontSize: 17, fontWeight: 500, color: "#F4F1EA", ...fadeIn(visible, 180) }}>
          It defines how income stability is measured — not how decisions are made.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 12 — FINAL CTA                                              */
/* ================================================================== */

function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 32 : 44, fontWeight: 600, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.navy, marginBottom: 20, ...fadeIn(visible) }}>
          The model is fixed.{m ? " " : <br />}Now apply it to your own structure.
        </h2>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 36, ...fadeIn(visible, 80) }}>
          The assessment takes under 2 minutes. Every result is generated from your inputs using a versioned system.
        </p>
        <div style={{ ...fadeIn(visible, 180) }}>
          <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 56, padding: "0 48px", borderRadius: 12, backgroundColor: C.navy, color: C.white, fontSize: 17, fontWeight: 600, textDecoration: "none", transition: "background-color 200ms, box-shadow 200ms", boxShadow: "0 2px 12px rgba(14,26,43,0.10)" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#1a2540"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(14,26,43,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.navy; e.currentTarget.style.boxShadow = "0 2px 12px rgba(14,26,43,0.10)"; }}>
            Start Your Free Assessment
          </Link>
          <p style={{ fontSize: 13, color: light, marginTop: 16, letterSpacing: "0.03em" }}>Under 2 minutes &bull; Instant result &bull; $69 for full report</p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* PAGE EXPORT                                                         */
/* ================================================================== */

export default function MethodologyPage() {
  return (
    <div className="overflow-x-hidden">
      <main>
        <HeroSection />
        <SystemDefinition />
        <WhatTheModelMeasures />
        <TheSixDimensions />
        <ScoringFramework />
        <InteractionEffects />
        <ClassificationSystem />
        <Architecture />
        <WhyThisMatters />
        <WhatTheModelDoesNotDo />
        <MeasurementPositioning />
        <FinalCta />
      </main>
    </div>
  );
}
