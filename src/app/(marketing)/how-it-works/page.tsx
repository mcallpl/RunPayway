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
const light = "rgba(14,26,43,0.52)";
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
    <header ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 36 : 56, paddingBottom: m ? 36 : 56, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>How It Works</div>
        <h1 style={{ fontSize: m ? 32 : 48, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", color: C.navy, marginBottom: 16, ...fadeIn(visible, 60) }}>
          The system behind your score.
        </h1>
        <p style={{ fontSize: m ? 16 : 17, color: muted, lineHeight: 1.65, maxWidth: 520, margin: "0 auto", ...fadeIn(visible, 120) }}>
          RunPayway&#8482; measures how your income is structured — not how much you earn. Fixed model. Deterministic output. Same inputs always produce the same score.
        </p>
      </div>
    </header>
  );
}


/* ================================================================== */
/* SECTION 2 — HOW IT WORKS (process + dimensions merged)              */
/* ================================================================== */

function TheSystemSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: "#F5F4F1", paddingTop: m ? 48 : 80, paddingBottom: m ? 48 : 80, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>

        {/* 3-step process — tight, no cards */}
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 64, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 24 : 32, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 12 }}>Three steps. One standardized result.</h2>
          <p style={{ fontSize: m ? 16 : 17, color: muted, lineHeight: 1.65 }}>Each stage operates under fixed evaluation rules. No interpretation layer exists within scoring.</p>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: m ? 48 : 80, ...fadeIn(visible, 100) }}>
          {[
            { num: "01", title: "Structural intake", desc: "You describe how your income is organized — sources, contracts, concentration, and dependencies. Under 2 minutes. No bank connection. No financial documents." },
            { num: "02", title: "Deterministic scoring", desc: "Six structural dimensions are evaluated independently using fixed definitions. The model combines them into a single score from 0 to 100. Same inputs always produce the same result." },
            { num: "03", title: "Standardized output", desc: "Score, stability band, primary constraint, stress test, and distance to next band. The diagnostic adds structural interpretation, scenario framing, and action prioritization." },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 24 : 28, boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 4px 16px rgba(14,26,43,0.03)", marginBottom: m ? 16 : 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, fontFamily: mono, color: C.teal, marginBottom: 12 }}>{s.num}</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: C.navy, marginBottom: 10, lineHeight: 1.3 }}>{s.title}</div>
              <p style={{ fontSize: 15, color: muted, margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* 6 dimensions */}
        <div style={{ textAlign: "center", marginBottom: m ? 32 : 48, ...fadeIn(visible, 200) }}>
          <h2 style={{ fontSize: m ? 24 : 32, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 12 }}>Six structural dimensions.</h2>
          <p style={{ fontSize: m ? 16 : 17, color: muted, lineHeight: 1.65 }}>Each is scored independently before interaction effects determine the final score.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr", gap: 12, ...fadeIn(visible, 280) }}>
          {[
            { name: "Recurrence", desc: "Income that renews without new acquisition.", color: C.teal },
            { name: "Concentration", desc: "Reliance on the largest income source.", color: "#C0392B" },
            { name: "Diversification", desc: "Number of independent sources contributing.", color: C.teal },
            { name: "Forward Visibility", desc: "Income secured ahead of time.", color: C.teal },
            { name: "Earnings Consistency", desc: "Variation in income over time.", color: "#B58900" },
            { name: "Labor Independence", desc: "Income that continues without active work.", color: "#B58900" },
          ].map((d, i) => (
            <div key={i} style={{ backgroundColor: C.white, borderRadius: 12, padding: m ? "16px 16px" : "18px 20px", boxShadow: "0 1px 2px rgba(14,26,43,0.03)", position: "relative" as const, overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, backgroundColor: `${d.color}30` }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: d.color, flexShrink: 0 }} />
                <span style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>{d.name}</span>
              </div>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.55, margin: 0 }}>{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3 — ARCHITECTURE (dark)                                     */
/* ================================================================== */

function Architecture() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 56 : 96, paddingBottom: m ? 56 : 96, paddingLeft: px(m), paddingRight: px(m), position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: m ? 300 : 500, height: m ? 300 : 500, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 880, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 24 : 32, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.sand, marginBottom: 12 }}>Two layers. One fixed boundary.</h2>
          <p style={{ fontSize: m ? 16 : 17, color: "rgba(244,241,234,0.50)", lineHeight: 1.65 }}>The score and the diagnostic operate in separate layers. The boundary is fixed and auditable.</p>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: m ? 24 : 36, ...fadeIn(visible, 100) }}>
          <div style={{ padding: m ? 24 : 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.03)", marginBottom: m ? 16 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: `${C.teal}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: mono, color: C.teal }}>01</span>
              </div>
              <span style={{ fontSize: 16, fontWeight: 600, color: C.sand }}>Deterministic Core</span>
            </div>
            <p style={{ fontSize: 15, color: "rgba(244,241,234,0.50)", lineHeight: 1.6, marginBottom: 16 }}>Produces the score from structural inputs only.</p>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
              {["Score", "Band", "Constraint", "Stress test"].map((item, i) => (
                <span key={i} style={{ fontSize: 13, color: "rgba(244,241,234,0.55)", padding: "4px 10px", borderRadius: 6, backgroundColor: "rgba(255,255,255,0.04)" }}>{item}</span>
              ))}
            </div>
          </div>

          <div style={{ padding: m ? 24 : 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: `${C.purple}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: mono, color: C.purple }}>02</span>
              </div>
              <span style={{ fontSize: 16, fontWeight: 600, color: C.sand }}>Outcome Layer</span>
            </div>
            <p style={{ fontSize: 15, color: "rgba(244,241,234,0.50)", lineHeight: 1.6, marginBottom: 16 }}>Applies context to improve interpretation.</p>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
              {["Industry patterns", "Scenario framing", "Action prioritization"].map((item, i) => (
                <span key={i} style={{ fontSize: 13, color: "rgba(244,241,234,0.55)", padding: "4px 10px", borderRadius: 6, backgroundColor: "rgba(255,255,255,0.04)" }}>{item}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: m ? "14px 16px" : "16px 20px", borderRadius: 10, borderLeft: `3px solid ${C.purple}`, backgroundColor: "rgba(255,255,255,0.02)", ...fadeIn(visible, 200) }}>
          <p style={{ fontSize: 15, fontWeight: 500, color: C.sand, margin: 0, lineHeight: 1.5 }}>
            The Outcome Layer cannot modify, influence, or override the Deterministic Core under any condition.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 4 — FINAL CTA (dark)                                        */
/* ================================================================== */

function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 56 : 96, paddingBottom: m ? 64 : 112, paddingLeft: px(m), paddingRight: px(m), borderTop: "1px solid rgba(244,241,234,0.04)" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 26 : 40, fontWeight: 500, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.sand, marginBottom: 16, ...fadeIn(visible) }}>
          Now apply the system{m ? " " : <br />}to your own structure.
        </h2>
        <p style={{ fontSize: 17, color: "rgba(244,241,234,0.45)", lineHeight: 1.65, marginBottom: 36, ...fadeIn(visible, 60) }}>
          Under 2 minutes. Every dimension scored. Every result reproducible.
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

export default function HowItWorksPage() {
  return (
    <div className="overflow-x-hidden">
      <main>
        <HeroSection />
        <TheSystemSection />
        <Architecture />
        <FinalCta />
      </main>
    </div>
  );
}
