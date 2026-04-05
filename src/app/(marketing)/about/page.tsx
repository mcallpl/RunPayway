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
    <header ref={ref} style={{ backgroundColor: C.white, position: "relative", overflow: "hidden", paddingTop: m ? 36 : 56, paddingBottom: m ? 36 : 56, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 20, ...fadeIn(visible) }}>About</div>
        <h1 style={{ fontSize: m ? 36 : 52, fontWeight: 700, lineHeight: 1.06, letterSpacing: "-0.03em", color: C.navy, marginBottom: 32, ...fadeIn(visible, 80) }}>
          The standard for measuring{m ? " " : <br />}income structure.
        </h1>
        <p style={{ fontSize: m ? 16 : 18, color: muted, lineHeight: 1.65, maxWidth: 560, margin: "0 auto 14px", ...fadeIn(visible, 180) }}>
          RunPayway&#8482; produces the Income Stability Score&#8482; — a deterministic structural assessment of how income holds under change.
        </p>
        <p style={{ fontSize: 15, color: light, lineHeight: 1.6, maxWidth: 560, margin: "0 auto", ...fadeIn(visible, 240) }}>
          Built for anyone whose income is not structurally guaranteed.
        </p>
      </div>
    </header>
  );
}


/* ================================================================== */
/* SECTION 2 — ONE-LINE DEFINITION                                     */
/* ================================================================== */

function OneLineDefinition() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: "#F5F4F1", paddingTop: m ? 56 : 88, paddingBottom: m ? 56 : 88, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", ...fadeIn(visible) }}>
        <div style={{ padding: m ? "24px 20px" : "32px 40px", borderRadius: 16, backgroundColor: C.white, boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 4px 16px rgba(14,26,43,0.03)", display: "inline-block" }}>
          <p style={{ fontSize: m ? 18 : 24, fontWeight: 500, color: C.navy, lineHeight: 1.4, margin: 0 }}>
            The Income Stability Score&#8482; measures how your income structure performs under disruption.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3 — WHAT THE SCORE MEASURES                                 */
/* ================================================================== */

function WhatTheScoreMeasures() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 64 : 128, paddingBottom: m ? 64 : 128, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 28, ...fadeIn(visible) }}>What the score measures</h2>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 16, ...fadeIn(visible, 60) }}>A number from 0 to 100 that evaluates the structural durability of your income.</p>
        <p style={{ fontSize: m ? 18 : 20, fontWeight: 500, color: C.navy, lineHeight: 1.5, marginBottom: 32, ...fadeIn(visible, 100) }}>It answers one question: if conditions change, how well does your income hold up?</p>

        <div style={{ marginBottom: 32, ...fadeIn(visible, 140) }}>
          <p style={{ fontSize: 15, color: light, lineHeight: 1.65, marginBottom: 12 }}>Unlike credit scores, which measure borrowing history, or income verification, which confirms past earnings,</p>
          <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 24 }}>RunPayway&#8482; evaluates how income is built:</p>
          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 10 }}>
            {["How many sources contribute", "How predictable it is", "How much continues without active work", "How far forward it is secured"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: m ? "14px 14px" : "14px 18px", borderRadius: 10, backgroundColor: "#FAFAFA", boxShadow: "0 1px 2px rgba(14,26,43,0.03)" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
                <span style={{ fontSize: 15, color: C.navy }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: m ? "20px 20px" : "24px 28px", borderRadius: 14, backgroundColor: "#FAFAFA", borderLeft: `3px solid ${C.teal}`, boxShadow: "0 1px 3px rgba(14,26,43,0.03)", ...fadeIn(visible, 220) }}>
          <p style={{ fontSize: 17, fontWeight: 500, color: C.navy, marginBottom: 6 }}>The result is a deterministic structural assessment.</p>
          <p style={{ fontSize: 17, fontWeight: 500, color: C.navy, margin: 0 }}>The same inputs always produce the same score.</p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 4 — WHY THIS EXISTS                                         */
/* ================================================================== */

function WhyThisExists() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 72 : 140, paddingBottom: m ? 72 : 140, paddingLeft: px(m), paddingRight: px(m), position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: m ? 300 : 500, height: m ? 300 : 500, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.sand, marginBottom: 32, ...fadeIn(visible) }}>Why this exists</h2>
        <p style={{ fontSize: 17, color: "rgba(244,241,234,0.55)", lineHeight: 1.65, marginBottom: 8, ...fadeIn(visible, 60) }}>Credit scores measure borrowing history.</p>
        <p style={{ fontSize: 17, color: "rgba(244,241,234,0.55)", lineHeight: 1.65, marginBottom: 24, ...fadeIn(visible, 100) }}>Income verification confirms past earnings.</p>
        <p style={{ fontSize: m ? 18 : 22, fontWeight: 500, color: C.sand, lineHeight: 1.4, marginBottom: 32, ...fadeIn(visible, 160) }}>
          But nothing measured the structural durability of how income is built.
        </p>
        <p style={{ fontSize: 17, color: "rgba(244,241,234,0.55)", lineHeight: 1.65, marginBottom: 32, ...fadeIn(visible, 200) }}>
          Income is not tested when it is stable. It is tested when conditions change. RunPayway&#8482; was created to measure how your structure responds — before that happens.
        </p>
        <div style={{ padding: m ? "20px 20px" : "24px 28px", borderRadius: 14, backgroundColor: "rgba(255,255,255,0.03)", borderLeft: `3px solid ${C.teal}`, ...fadeIn(visible, 260) }}>
          <p style={{ fontSize: 16, color: "rgba(244,241,234,0.50)", lineHeight: 1.6, marginBottom: 8 }}>The score is private by default. No bank connection. No credit pull.</p>
          <p style={{ fontSize: 17, fontWeight: 500, color: C.sand, margin: 0 }}>It belongs entirely to the individual who takes it.</p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 5 — MODEL STRUCTURE                                         */
/* ================================================================== */

function ModelStructure() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 64 : 128, paddingBottom: m ? 64 : 128, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 28, ...fadeIn(visible) }}>The model is fixed and versioned</h2>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 16, ...fadeIn(visible, 60) }}>Every version of the scoring model is locked.</p>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 32, ...fadeIn(visible, 100) }}>If any rule, threshold, or classification changes, the model increments to a new version.</p>
        <div style={{ padding: m ? "20px 20px" : "24px 28px", borderRadius: 14, backgroundColor: "#FAFAFA", boxShadow: "0 1px 3px rgba(14,26,43,0.03)", marginBottom: 24, ...fadeIn(visible, 160) }}>
          <p style={{ fontSize: 16, color: muted, lineHeight: 1.6, marginBottom: 8 }}>Scores produced under the same version are directly comparable.</p>
          <p style={{ fontSize: 16, color: muted, lineHeight: 1.6, margin: 0 }}>If the rules change, it becomes a different model.</p>
        </div>
        <div style={{ padding: m ? "16px 20px" : "18px 24px", borderRadius: 12, backgroundColor: "#FAFAFA", borderLeft: `3px solid ${C.teal}`, boxShadow: "0 1px 3px rgba(14,26,43,0.03)", display: "inline-block", ...fadeIn(visible, 220) }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, margin: 0 }}>Each assessment is stamped with the model version that produced it.</p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 6 — FINAL CTA                                               */
/* ================================================================== */

function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 72 : 140, paddingBottom: m ? 72 : 140, paddingLeft: px(m), paddingRight: px(m), position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: m ? 300 : 500, height: m ? 300 : 500, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: m ? 28 : 44, fontWeight: 500, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.sand, marginBottom: 20, ...fadeIn(visible) }}>
          Now apply the system{m ? " " : <br />}to your own structure.
        </h2>
        <p style={{ fontSize: 17, color: "rgba(244,241,234,0.45)", lineHeight: 1.65, marginBottom: 40, ...fadeIn(visible, 80) }}>
          The assessment takes under 2 minutes. Every result is generated from your inputs.
        </p>
        <div style={{ ...fadeIn(visible, 180) }}>
          <Link href="/pricing" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: 56, padding: m ? "0 28px" : "0 48px", width: m ? "100%" : "auto", maxWidth: m ? 360 : "none",
            borderRadius: 12, background: `linear-gradient(135deg, ${C.white} 0%, rgba(244,241,234,0.95) 100%)`,
            color: C.navy, fontSize: m ? 15 : 16, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 2px 12px rgba(244,241,234,0.15), 0 8px 32px rgba(244,241,234,0.08)",
            border: "1px solid rgba(244,241,234,0.30)",
            transition: "transform 200ms, box-shadow 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(244,241,234,0.20), 0 12px 48px rgba(244,241,234,0.10)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(244,241,234,0.15), 0 8px 32px rgba(244,241,234,0.08)"; }}>
            Start Your Free Assessment
          </Link>
          <p style={{ fontSize: 14, color: "rgba(244,241,234,0.35)", marginTop: 16, letterSpacing: "0.02em" }}>Under 2 minutes &bull; Instant result &bull; Private by default</p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* PAGE EXPORT                                                         */
/* ================================================================== */

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">
      <main>
        <HeroSection />
        <OneLineDefinition />
        <WhatTheScoreMeasures />
        <WhyThisExists />
        <ModelStructure />
        <FinalCta />
      </main>
    </div>
  );
}
