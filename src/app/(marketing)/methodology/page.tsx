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

const C = { navy: "#1C1635", purple: "#4B3FAE", teal: "#1F6D7A", sand: "#F4F1EA", white: "#FFFFFF", border: "#E5E7EB" };
const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';
const muted = "rgba(14,26,43,0.68)";
const light = "rgba(14,26,43,0.62)";
const contentW = 1040;
const px = (m: boolean) => m ? 20 : 24;


/* ================================================================== */
/* SECTION 1 — HERO                                                    */
/* ================================================================== */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <header ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 40 : 64, paddingBottom: m ? 40 : 56, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>Methodology</div>
        <h1 style={{ fontSize: m ? 32 : 48, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", color: C.navy, marginBottom: 16, ...fadeIn(visible, 60) }}>
          Fixed rules. Versioned logic.{m ? " " : <br />}Every result reproducible.
        </h1>
        <p style={{ fontSize: m ? 16 : 17, color: muted, lineHeight: 1.65, maxWidth: 520, margin: "0 auto", ...fadeIn(visible, 120) }}>
          The Income Stability Score&#8482; is produced by a deterministic model. No AI. No subjective judgment. Same inputs always produce the same score.
        </p>
      </div>
    </header>
  );
}


/* ================================================================== */
/* SECTION 2 — THE DIMENSIONS (with visualization)                     */
/* ================================================================== */

function WhatMakesItDifferent() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: "#F5F4F1", paddingTop: m ? 60 : 104, paddingBottom: m ? 60 : 104, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 64, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 24 : 32, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 12 }}>What makes this different from other assessments.</h2>
          <p style={{ fontSize: m ? 16 : 17, color: muted, lineHeight: 1.65, maxWidth: 560, margin: "0 auto" }}>
            Most financial tools measure what happened. RunPayway measures how your income is built — and whether that structure survives change.
          </p>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: m ? 48 : 72, ...fadeIn(visible, 100) }}>
          {[
            { title: "Not a credit score", desc: "Credit scores measure borrowing history. This measures how income holds under disruption. Different inputs. Different purpose.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", color: C.teal },
            { title: "Not a forecast", desc: "The model does not predict what will happen. It measures how your current structure would respond if conditions changed today.", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", color: C.purple },
            { title: "Not subjective", desc: "No advisor, no algorithm, no interpretation layer touches the score. Fixed rules produce fixed results. Every time.", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15", color: C.navy },
          ].map((item, i) => (
            <div key={i} style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 24 : 28, boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 4px 16px rgba(14,26,43,0.03)", marginBottom: m ? 16 : 0, position: "relative" as const, overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: `${item.color}20` }} />
              <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: `${item.color}08`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.navy, marginBottom: 10, lineHeight: 1.3 }}>{item.title}</div>
              <p style={{ fontSize: 15, color: muted, margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Versioning + Classification side by side */}
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 20, ...fadeIn(visible, 200) }}>
          {/* Versioning */}
          <div style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 24 : 28, boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 4px 16px rgba(14,26,43,0.03)", marginBottom: m ? 16 : 0, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: `${C.purple}20` }} />
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: C.purple, marginBottom: 20 }}>HOW VERSIONING WORKS</div>
            {[
              { label: "Model is locked", desc: "Every version is immutable once deployed.", icon: "M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" },
              { label: "Scores are comparable", desc: "Same version = directly comparable results.", icon: "M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6M15 19v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6M9 13V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v8" },
              { label: "Changes increment", desc: "Any rule change creates a new model version.", icon: "M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" },
              { label: "Every result is stamped", desc: "The model version is permanently recorded.", icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 18 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: `${C.purple}06`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 2 }}>{item.label}</div>
                  <p style={{ fontSize: 14, color: muted, margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Classification */}
          <div style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 24 : 28, boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 4px 16px rgba(14,26,43,0.03)", position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, #9B2C2C, #92640A, #2B5EA7, ${C.teal})` }} />
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: C.teal, marginBottom: 20 }}>FOUR BANDS &bull; FIXED THRESHOLDS</div>
            {[
              { range: "0\u201329", label: "Limited", desc: "A single disruption can materially change the structure.", color: "#9B2C2C" },
              { range: "30\u201349", label: "Developing", desc: "Not yet structurally protected.", color: "#92640A" },
              { range: "50\u201374", label: "Established", desc: "Absorbs most common disruptions.", color: "#2B5EA7" },
              { range: "75\u2013100", label: "High", desc: "Resilient under sustained pressure.", color: C.teal },
            ].map((b, i) => (
              <div key={i} style={{ display: "flex", gap: m ? 10 : 14, alignItems: "flex-start", padding: m ? "10px 12px" : "12px 14px", borderRadius: 10, backgroundColor: `${b.color}04`, marginBottom: i < 3 ? 8 : 0 }}>
                <div style={{ width: 40, height: 24, borderRadius: 6, backgroundColor: `${b.color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontFamily: mono, fontWeight: 700, color: b.color }}>{b.range}</span>
                </div>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: b.color }}>{b.label}</span>
                  <span style={{ fontSize: 14, color: muted }}> — {b.desc}</span>
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
/* SECTION 4 — INTEGRITY (dark)                                        */
/* ================================================================== */

function Integrity() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 60 : 104, paddingBottom: m ? 60 : 104, paddingLeft: px(m), paddingRight: px(m), position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: m ? 300 : 500, height: m ? 300 : 500, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 880, margin: "0 auto", position: "relative", zIndex: 1 }}>

        <div style={{ textAlign: "center", marginBottom: m ? 40 : 64, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 24 : 32, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.sand, marginBottom: 12 }}>System integrity.</h2>
          <p style={{ fontSize: m ? 16 : 17, color: "rgba(244,241,234,0.50)", lineHeight: 1.65 }}>What the model guarantees — and what it deliberately does not do.</p>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: m ? 36 : 56, ...fadeIn(visible, 100) }}>
          {/* Guarantees */}
          <div style={{ padding: m ? 24 : 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.03)", borderLeft: `3px solid ${C.teal}`, marginBottom: m ? 16 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: `${C.teal}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: C.teal }}>THE MODEL GUARANTEES</div>
            </div>
            {[
              "Same inputs always produce the same score",
              "No human override in scoring",
              "No contextual input alters the result",
              "Every assessment stamped with model version",
              "Scores under the same version are directly comparable",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
                <span style={{ color: C.teal, fontSize: 14, flexShrink: 0, marginTop: 1 }}>&#10003;</span>
                <span style={{ fontSize: 15, color: "rgba(244,241,234,0.65)", lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Exclusions */}
          <div style={{ padding: m ? 24 : 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.03)", borderLeft: "3px solid rgba(244,241,234,0.10)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(244,241,234,0.50)" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(244,241,234,0.40)" }}>THE MODEL DOES NOT</div>
            </div>
            {[
              "Access bank accounts or financial data",
              "Use machine learning or probabilistic models in scoring",
              "Apply subjective judgment at any stage",
              "Make predictive claims about future income",
              "Provide financial, legal, or investment advice",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
                <span style={{ color: "rgba(244,241,234,0.25)", fontSize: 14, flexShrink: 0, marginTop: 1 }}>&times;</span>
                <span style={{ fontSize: 15, color: "rgba(244,241,234,0.50)", lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Boundary statement */}
        <div style={{ padding: m ? "18px 20px" : "18px 24px", borderRadius: 10, borderLeft: `3px solid ${C.teal}`, backgroundColor: "rgba(255,255,255,0.02)", ...fadeIn(visible, 200) }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.sand, margin: 0, lineHeight: 1.5 }}>
            RunPayway&#8482; is a measurement system — not a financial product. It defines how income stability is measured, not how decisions are made.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 5 — FINAL CTA (dark)                                        */
/* ================================================================== */

function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 60 : 104, paddingBottom: m ? 64 : 112, paddingLeft: px(m), paddingRight: px(m), borderTop: "1px solid rgba(244,241,234,0.04)" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 26 : 40, fontWeight: 500, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.sand, marginBottom: 16, ...fadeIn(visible) }}>
          The model is fixed.{m ? " " : <br />}Now apply it to your own structure.
        </h2>
        <p style={{ fontSize: 17, color: "rgba(244,241,234,0.45)", lineHeight: 1.65, marginBottom: 36, ...fadeIn(visible, 60) }}>
          Under 2 minutes. Every result generated from your inputs using a versioned system.
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

export default function MethodologyPage() {
  return (
    <div className="overflow-x-hidden">
      <main>
        <HeroSection />
        <WhatMakesItDifferent />
        <Integrity />
        <FinalCta />
      </main>
    </div>
  );
}
