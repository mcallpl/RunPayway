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
const muted = "rgba(14,26,43,0.68)";
const light = "rgba(14,26,43,0.52)";
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
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 20, ...fadeIn(visible) }}>How It Works</div>
        <h1 style={{ fontSize: m ? 32 : 48, fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.03em", color: "#F4F1EA", marginBottom: 28, ...fadeIn(visible, 80) }}>
          The system behind your score.
        </h1>
        <div style={{ maxWidth: 560, ...fadeIn(visible, 180) }}>
          <p style={{ fontSize: 16, color: "rgba(244,241,234,0.55)", lineHeight: 1.65, marginBottom: 12 }}>
            RunPayway&#8482; measures how your income is structured — not how much you earn.
          </p>
          <p style={{ fontSize: 16, color: "rgba(244,241,234,0.40)", lineHeight: 1.6 }}>
            The model is fixed, versioned, and deterministic. Identical inputs always produce identical outputs.
          </p>
        </div>
        <div style={{ marginTop: m ? 40 : 56, paddingTop: m ? 24 : 32, borderTop: "1px solid rgba(244,241,234,0.06)", ...fadeIn(visible, 300) }}>
          <p style={{ fontSize: 12, letterSpacing: "0.04em", color: "rgba(244,241,234,0.45)" }}>
            RunPayway&#8482; Structural Income Classification System &bull; Model RP-2.0 &bull; Deterministic &bull; Version-controlled &bull; Audit-reproducible
          </p>
        </div>
      </div>
    </header>
  );
}


/* ================================================================== */
/* SECTION 2 — SYSTEM OVERVIEW                                         */
/* ================================================================== */

function SystemOverview() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 26 : 36, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 24, ...fadeIn(visible) }}>What the system measures.</h2>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 16, ...fadeIn(visible, 80) }}>
          Income is typically evaluated by amount.
        </p>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 28, ...fadeIn(visible, 140) }}>
          RunPayway&#8482; evaluates how income is built — and how it holds under disruption.
        </p>
        <div style={{ padding: "20px 28px", borderRadius: 14, backgroundColor: "#FAFAFA", border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.teal}`, ...fadeIn(visible, 220) }}>
          <p style={{ fontSize: 18, fontWeight: 500, color: C.navy, margin: 0, lineHeight: 1.5 }}>It measures structure before outcomes change.</p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3 — THE PROCESS                                             */
/* ================================================================== */

function TheProcess() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const steps: { num: string; title: string; body: string; detail: string | null; notes: string[]; warning?: string }[] = [
    { num: "01", title: "Structural intake", body: "You complete a structured assessment across six defined dimensions.", detail: "Each dimension isolates a specific aspect of how income is built.", notes: ["No financial documents required.", "No bank connection."] },
    { num: "02", title: "Deterministic scoring", body: "Each dimension is evaluated independently using fixed definitions.", detail: "The model then combines these evaluations into a single score from 0 to 100.", notes: ["Same inputs always produce the same score."] },
    { num: "03", title: "Issued result", body: "The system produces a standardized output:", detail: null, notes: ["Score", "Stability band", "Primary constraint", "Stress test", "Distance to next band"] },
    { num: "04", title: "Diagnostic expansion", body: "The diagnostic layer applies context to expand explanation clarity.", detail: null, notes: ["Structural interpretation", "Scenario relevance", "Action prioritization"], warning: "This layer does not influence the score." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ width: 48, height: 1, backgroundColor: C.border, margin: m ? "0 auto 36px" : "0 auto 56px" }} />
        <h2 style={{ fontSize: m ? 26 : 36, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 16, ...fadeIn(visible) }}>The process.</h2>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 8, ...fadeIn(visible, 60) }}>Each stage operates under fixed evaluation rules.</p>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: m ? 40 : 64, ...fadeIn(visible, 100) }}>No interpretation layer exists within scoring.</p>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: m ? 28 : 40 }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: m ? "block" : "flex", gap: 32, ...fadeIn(visible, 140 + i * 60) }}>
              <div style={{ flexShrink: 0, minWidth: 80, marginBottom: m ? 12 : 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: C.white, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, fontFamily: mono, color: C.teal }}>{step.num}</span>
                </div>
              </div>
              <div style={{ flex: 1, padding: m ? "20px 20px" : "24px 28px", borderRadius: 14, backgroundColor: C.white, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: C.navy, marginBottom: 12 }}>{step.title}</div>
                <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: step.detail ? 8 : 16 }}>{step.body}</p>
                {step.detail && <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 16 }}>{step.detail}</p>}
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                  {step.notes.map((note, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: C.navy }}>{note}</span>
                    </div>
                  ))}
                </div>
                {step.warning && (
                  <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 8, backgroundColor: `${C.purple}04`, borderLeft: `3px solid ${C.purple}` }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: C.purple, margin: 0 }}>{step.warning}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 4 — THE DIMENSIONS                                          */
/* ================================================================== */

function TheDimensions() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const dims = [
    { name: "Recurrence", desc: "Measures the proportion of income that renews without new acquisition.", color: C.teal },
    { name: "Concentration", desc: "Measures reliance on the largest income source.", color: "#C0392B" },
    { name: "Diversification", desc: "Measures the number of independent income sources contributing meaningfully.", color: C.teal },
    { name: "Forward Visibility", desc: "Measures how much income is secured ahead of time.", color: C.teal },
    { name: "Earnings Consistency", desc: "Measures variability in income over time.", color: "#B58900" },
    { name: "Labor Independence", desc: "Measures how much income continues without active work.", color: "#B58900" },
  ];
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 26 : 36, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 16, ...fadeIn(visible) }}>The dimensions.</h2>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 8, ...fadeIn(visible, 60) }}>Six structural dimensions are evaluated using fixed definitions.</p>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: m ? 36 : 56, ...fadeIn(visible, 100) }}>Each dimension contributes independently before interaction analysis produces the final score.</p>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr", gap: 16, ...fadeIn(visible, 160) }}>
          {dims.map((d, i) => (
            <div key={i} style={{ padding: m ? 24 : 28, borderRadius: 14, border: `1px solid ${C.border}`, backgroundColor: "#FAFAFA", position: "relative" as const, overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: `${d.color}25` }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: d.color, flexShrink: 0 }} />
                <span style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>{d.name}</span>
              </div>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.6, margin: 0 }}>{d.desc}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 14, color: light, textAlign: "center", marginTop: 28, letterSpacing: "0.03em", ...fadeIn(visible, 240) }}>
          Cross-dimensional interaction determines final structural integrity.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 5 — OUTPUT SUMMARY                                          */
/* ================================================================== */

function OutputSummary() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const outputs = [
    { label: "Score (0\u2013100)", desc: "Scalar measure of structural integrity.", icon: "M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6M15 19v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6M9 13V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v8" },
    { label: "Stability Band", desc: "Classification based on score range.", icon: "M7 21a4 4 0 0 1-4-4V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12a4 4 0 0 1-4 4zm0 0h12a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 0 1 2.828 0l2.829 2.829a2 2 0 0 1 0 2.828l-8.486 8.485M7 17h.01" },
    { label: "Primary Constraint", desc: "Most limiting structural factor.", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
    { label: "Stress Test", desc: "Impact of losing the largest income source.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { label: "Distance to Next Band", desc: "Points required to reach the next classification.", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
  ];
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ width: 48, height: 1, backgroundColor: C.border, margin: m ? "0 auto 36px" : "0 auto 56px" }} />
        <h2 style={{ fontSize: m ? 26 : 36, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 16, ...fadeIn(visible) }}>What your score produces.</h2>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: m ? 32 : 48, ...fadeIn(visible, 80) }}>Every assessment produces a standardized output.</p>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, ...fadeIn(visible, 140) }}>
          {outputs.map((o, i) => (
            <div key={i} style={{ padding: m ? "16px 18px" : "18px 24px", borderRadius: 14, backgroundColor: C.white, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: `${C.teal}08`, border: `1px solid ${C.teal}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={o.icon} /></svg>
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: m ? "flex-start" : "center", justifyContent: "space-between", gap: 12, flexDirection: m ? "column" : "row" }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>{o.label}</span>
                <span style={{ fontSize: 14, color: muted }}>{o.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 6 — CLASSIFICATION PREVIEW                                  */
/* ================================================================== */

function ClassificationPreview() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const bands = [
    { range: "0\u201329", label: "Limited Stability", desc: "Highly vulnerable to disruption.", color: "#9B2C2C" },
    { range: "30\u201349", label: "Developing Stability", desc: "Not structurally protected.", color: "#92640A" },
    { range: "50\u201374", label: "Established Stability", desc: "Stable under typical conditions.", color: "#2B5EA7" },
    { range: "75\u2013100", label: "High Stability", desc: "Resilient under significant disruption.", color: C.teal },
  ];
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 26 : 36, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 16, ...fadeIn(visible) }}>The classification.</h2>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: m ? 36 : 56, ...fadeIn(visible, 80) }}>Each band defines what your structure can absorb under disruption.</p>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr 1fr", gap: 16, ...fadeIn(visible, 140) }}>
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
/* SECTION 7 — ARCHITECTURE OVERVIEW                                   */
/* ================================================================== */

function ArchitectureOverview() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m), position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 500, height: 500, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: contentW, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: m ? 26 : 36, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#F4F1EA", marginBottom: 16, ...fadeIn(visible) }}>The architecture.</h2>
        <p style={{ fontSize: 16, color: "rgba(244,241,234,0.55)", lineHeight: 1.65, marginBottom: 8, ...fadeIn(visible, 60) }}>The system operates in two distinct layers.</p>
        <p style={{ fontSize: 16, color: "rgba(244,241,234,0.40)", lineHeight: 1.65, marginBottom: m ? 36 : 56, ...fadeIn(visible, 100) }}>The boundary between them is fixed and auditable.</p>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: m ? 24 : 36, ...fadeIn(visible, 160) }}>
          <div style={{ padding: m ? 24 : 32, borderRadius: 16, backgroundColor: "rgba(244,241,234,0.04)", border: "1px solid rgba(244,241,234,0.06)", marginBottom: m ? 16 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${C.teal}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15" /></svg>
              </div>
              <span style={{ fontSize: 16, fontWeight: 600, color: "#F4F1EA" }}>Deterministic Core</span>
            </div>
            <p style={{ fontSize: 14, color: "rgba(244,241,234,0.50)", lineHeight: 1.6, marginBottom: 16 }}>Produces the score using structural inputs only.</p>
            {["Score", "Band", "Constraint", "Stress test"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: "rgba(244,241,234,0.70)" }}>{item}</span>
              </div>
            ))}
            <p style={{ fontSize: 14, fontWeight: 500, color: "#F4F1EA", margin: "16px 0 0" }}>No contextual input can alter the result.</p>
          </div>

          <div style={{ padding: m ? 24 : 32, borderRadius: 16, backgroundColor: "rgba(244,241,234,0.04)", border: "1px solid rgba(244,241,234,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${C.purple}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" /></svg>
              </div>
              <span style={{ fontSize: 16, fontWeight: 600, color: "#F4F1EA" }}>Outcome Layer</span>
            </div>
            <p style={{ fontSize: 14, color: "rgba(244,241,234,0.50)", lineHeight: 1.6, marginBottom: 16 }}>Enhances interpretation using context.</p>
            {["Industry patterns", "Scenario framing", "Action prioritization"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.purple, flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: "rgba(244,241,234,0.70)" }}>{item}</span>
              </div>
            ))}
            <p style={{ fontSize: 14, fontWeight: 500, color: "#F4F1EA", margin: "16px 0 0" }}>Does not modify the score.</p>
          </div>
        </div>

        <div style={{ padding: "20px 28px", borderRadius: 12, backgroundColor: "rgba(244,241,234,0.04)", border: "1px solid rgba(75,63,174,0.15)", borderLeft: `4px solid ${C.purple}`, ...fadeIn(visible, 240) }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: "#F4F1EA", margin: 0, lineHeight: 1.55 }}>
            The Outcome Layer cannot modify, influence, or override the Deterministic Core under any condition.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 8 — FINAL CTA                                               */
/* ================================================================== */

function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 26 : 36, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 20, ...fadeIn(visible) }}>
          You&#8217;ve seen how the system works.{m ? " " : <br />}Now apply it to your structure.
        </h2>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 36, ...fadeIn(visible, 80) }}>
          The assessment takes under 2 minutes. Every dimension scored. Every result reproducible.
        </p>
        <div style={{ ...fadeIn(visible, 180) }}>
          <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 56, padding: "0 48px", borderRadius: 12, backgroundColor: C.navy, color: C.white, fontSize: 16, fontWeight: 600, textDecoration: "none", transition: "background-color 200ms, box-shadow 200ms", boxShadow: "0 2px 12px rgba(14,26,43,0.10)" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#1a2540"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(14,26,43,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.navy; e.currentTarget.style.boxShadow = "0 2px 12px rgba(14,26,43,0.10)"; }}>
            Start Your Free Assessment
          </Link>
          <p style={{ fontSize: 13, color: light, marginTop: 16, letterSpacing: "0.03em" }}>Under 2 minutes &bull; Instant result &bull; Private by default</p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* PAGE EXPORT                                                         */
/* ================================================================== */

export default function HowItWorksPage() {
  return (
    <div className="overflow-x-hidden">
      <main>
        <HeroSection />
        <SystemOverview />
        <TheProcess />
        <TheDimensions />
        <OutputSummary />
        <ClassificationPreview />
        <ArchitectureOverview />
        <FinalCta />
      </main>
    </div>
  );
}
