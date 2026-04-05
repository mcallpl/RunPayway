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
/* SECTION 2 — THE MODEL (what it measures + how it's versioned)       */
/* ================================================================== */

function TheModel() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: "#F5F4F1", paddingTop: m ? 48 : 80, paddingBottom: m ? 48 : 80, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>

        {/* What it measures */}
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 64, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 24 : 32, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 12 }}>What the model evaluates.</h2>
          <p style={{ fontSize: m ? 16 : 17, color: muted, lineHeight: 1.65, maxWidth: 560, margin: "0 auto" }}>
            Not how much you earn. How well it holds up. Two people with identical income can have completely different structural stability.
          </p>
        </div>

        {/* 6 dimensions — compact, data-forward */}
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 12, marginBottom: m ? 48 : 72, ...fadeIn(visible, 100) }}>
          {[
            { name: "Recurrence", question: "How much renews without new acquisition?", tag: "Structure", color: C.teal },
            { name: "Concentration", question: "How much depends on the largest source?", tag: "Stability", color: "#C0392B" },
            { name: "Diversification", question: "How many independent sources contribute?", tag: "Structure", color: C.teal },
            { name: "Forward Visibility", question: "How much is secured ahead of time?", tag: "Structure", color: C.teal },
            { name: "Earnings Consistency", question: "How much does income vary over time?", tag: "Stability", color: "#B58900" },
            { name: "Labor Independence", question: "How much continues without active work?", tag: "Stability", color: "#B58900" },
          ].map((d, i) => (
            <div key={i} style={{ backgroundColor: C.white, borderRadius: 12, padding: m ? "16px 16px" : "18px 22px", boxShadow: "0 1px 3px rgba(14,26,43,0.03)", display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: d.color, flexShrink: 0, marginTop: 7 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>{d.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: d.color, padding: "2px 6px", borderRadius: 4, backgroundColor: `${d.color}08` }}>{d.tag}</span>
                </div>
                <p style={{ fontSize: 14, color: muted, margin: 0, lineHeight: 1.5 }}>{d.question}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Scoring + Versioning — side by side */}
        <div style={{ textAlign: "center", marginBottom: m ? 32 : 48, ...fadeIn(visible, 180) }}>
          <h2 style={{ fontSize: m ? 24 : 32, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 12 }}>How scores are produced.</h2>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 20, ...fadeIn(visible, 240) }}>
          {/* Scoring */}
          <div style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 24 : 28, boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 4px 16px rgba(14,26,43,0.03)", marginBottom: m ? 16 : 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: C.teal, marginBottom: 16 }}>SCORING</div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
              {[
                "Each dimension scored independently using fixed rules",
                "Interaction effects applied — compound weaknesses reduce the score, reinforcing strengths improve it",
                "Final score 0\u2013100 with band classification",
                "Primary constraint identified — the single factor doing the most damage",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, fontFamily: mono, color: C.teal, flexShrink: 0, marginTop: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: 14, color: C.navy, lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Versioning */}
          <div style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 24 : 28, boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 4px 16px rgba(14,26,43,0.03)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: C.purple, marginBottom: 16 }}>VERSIONING</div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
              {[
                { label: "Model is locked", desc: "Every version of the scoring model is immutable once deployed." },
                { label: "Scores are comparable", desc: "Results under the same version are directly comparable." },
                { label: "Changes increment", desc: "If any rule, threshold, or classification changes, the model increments to a new version." },
                { label: "Each assessment is stamped", desc: "The model version that produced the result is recorded permanently." },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 2 }}>{item.label}</div>
                  <p style={{ fontSize: 14, color: muted, margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Classification bands */}
        <div style={{ marginTop: m ? 48 : 72, ...fadeIn(visible, 300) }}>
          <div style={{ textAlign: "center", marginBottom: m ? 24 : 36 }}>
            <h2 style={{ fontSize: m ? 24 : 32, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 8 }}>Four bands. Fixed thresholds.</h2>
            <p style={{ fontSize: 15, color: muted }}>These do not change within a model version.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 12 }}>
            {[
              { range: "0\u201329", label: "Limited", desc: "A single disruption can materially change the structure.", color: "#9B2C2C" },
              { range: "30\u201349", label: "Developing", desc: "Structure is not yet protected.", color: "#92640A" },
              { range: "50\u201374", label: "Established", desc: "Absorbs most common disruptions.", color: "#2B5EA7" },
              { range: "75\u2013100", label: "High", desc: "Resilient under sustained pressure.", color: C.teal },
            ].map((b, i) => (
              <div key={i} style={{ backgroundColor: C.white, borderRadius: 12, padding: m ? "16px 14px" : "18px 20px", boxShadow: "0 1px 2px rgba(14,26,43,0.03)", position: "relative" as const, overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, backgroundColor: b.color }} />
                <div style={{ fontSize: 16, fontFamily: mono, fontWeight: 500, color: b.color, marginBottom: 6 }}>{b.range}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 4 }}>{b.label}</div>
                <p style={{ fontSize: 13, color: muted, lineHeight: 1.45, margin: 0 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3 — INTEGRITY (dark: determinism, boundaries, exclusions)   */
/* ================================================================== */

function Integrity() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 56 : 96, paddingBottom: m ? 56 : 96, paddingLeft: px(m), paddingRight: px(m), position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: m ? 300 : 500, height: m ? 300 : 500, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 880, margin: "0 auto", position: "relative", zIndex: 1 }}>

        <div style={{ textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 24 : 32, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.sand, marginBottom: 12 }}>System integrity.</h2>
          <p style={{ fontSize: m ? 16 : 17, color: "rgba(244,241,234,0.50)", lineHeight: 1.65 }}>What the model guarantees — and what it deliberately does not do.</p>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: m ? 32 : 48, ...fadeIn(visible, 100) }}>
          {/* Guarantees */}
          <div style={{ padding: m ? 24 : 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.03)", marginBottom: m ? 16 : 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: C.teal, marginBottom: 20 }}>THE MODEL GUARANTEES</div>
            {[
              "Same inputs always produce the same score",
              "No human override in scoring",
              "No contextual input alters the result",
              "Every assessment stamped with model version",
              "Scores under the same version are directly comparable",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                <span style={{ color: C.teal, fontSize: 13, flexShrink: 0, marginTop: 2 }}>&#10003;</span>
                <span style={{ fontSize: 14, color: "rgba(244,241,234,0.65)", lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Exclusions */}
          <div style={{ padding: m ? 24 : 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.03)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(244,241,234,0.40)", marginBottom: 20 }}>THE MODEL DOES NOT</div>
            {[
              "Access bank accounts or financial data",
              "Use machine learning or probabilistic models in scoring",
              "Apply subjective judgment at any stage",
              "Make predictive claims about future income",
              "Provide financial, legal, or investment advice",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                <span style={{ color: "rgba(244,241,234,0.30)", fontSize: 13, flexShrink: 0, marginTop: 2 }}>&mdash;</span>
                <span style={{ fontSize: 14, color: "rgba(244,241,234,0.50)", lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Boundary statement */}
        <div style={{ padding: m ? "14px 16px" : "16px 20px", borderRadius: 10, borderLeft: `3px solid ${C.teal}`, backgroundColor: "rgba(255,255,255,0.02)", ...fadeIn(visible, 200) }}>
          <p style={{ fontSize: 15, fontWeight: 500, color: C.sand, margin: 0, lineHeight: 1.5 }}>
            RunPayway&#8482; is a measurement system — not a financial product. It defines how income stability is measured, not how decisions are made.
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

export default function MethodologyPage() {
  return (
    <div className="overflow-x-hidden">
      <main>
        <HeroSection />
        <TheModel />
        <Integrity />
        <FinalCta />
      </main>
    </div>
  );
}
