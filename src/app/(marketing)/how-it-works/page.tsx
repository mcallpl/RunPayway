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
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>How It Works</div>
        <h1 style={{ fontSize: m ? 32 : 48, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", color: C.navy, marginBottom: 16, ...fadeIn(visible, 60) }}>
          The system behind your score.
        </h1>
        <p style={{ fontSize: m ? 16 : 17, color: muted, lineHeight: 1.65, maxWidth: 520, margin: "0 auto", ...fadeIn(visible, 120) }}>
          RunPayway&#8482; measures how your income is built — not how much you earn. Fixed rules. Same answers always produce the same score.
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
    <section ref={ref} style={{ backgroundColor: "#F5F4F1", paddingTop: m ? 60 : 104, paddingBottom: m ? 60 : 104, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>

        {/* 3-step process — tight, no cards */}
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 64, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 24 : 32, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 12 }}>Three steps. One standardized result.</h2>
          <p style={{ fontSize: m ? 16 : 17, color: muted, lineHeight: 1.65 }}>Each step follows fixed rules. No one interprets or adjusts your score.</p>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: m ? 48 : 80, ...fadeIn(visible, 100) }}>
          {[
            { num: "01", title: "Describe how you earn", desc: "You tell us how your income works — your sources, contracts, how spread out they are, and what you depend on. Under 2 minutes. No bank connection. No financial documents.", icon: "M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z", color: C.teal },
            { num: "02", title: "Six dimensions scored", desc: "Six areas of your income are evaluated using fixed rules. The model combines them into a single score from 0 to 100. Same answers always produce the same result.", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15", color: C.purple },
            { num: "03", title: "Your result", desc: "Score, stability level, your biggest risk, stress test, and how close you are to the next level. The diagnostic adds context for your industry, scenarios, and what to do first.", icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2", color: C.navy },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 24 : 28, boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 4px 16px rgba(14,26,43,0.03)", marginBottom: m ? 16 : 0, position: "relative" as const, overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: `${s.color}20` }} />
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: `${s.color}08`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon} /></svg>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: mono, color: s.color }}>{s.num}</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.navy, marginBottom: 10, lineHeight: 1.3 }}>{s.title}</div>
              <p style={{ fontSize: 15, color: muted, margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* 6 dimensions */}
        <div style={{ textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible, 200) }}>
          <h2 style={{ fontSize: m ? 24 : 32, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 12 }}>Six things we measure.</h2>
          <p style={{ fontSize: m ? 16 : 17, color: muted, lineHeight: 1.65 }}>Each area is scored on its own, then combined into your final score.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr", gap: 14, ...fadeIn(visible, 280) }}>
          {[
            { name: "Recurring Income", desc: "How much of your income keeps coming back without finding new work.", color: C.teal, tag: "Structure" },
            { name: "Source Reliance", desc: "How much you depend on your single largest source.", color: "#C0392B", tag: "Risk" },
            { name: "Number of Sources", desc: "How many independent income sources you have.", color: C.teal, tag: "Structure" },
            { name: "Income Locked In", desc: "How far ahead your income is already secured.", color: C.teal, tag: "Structure" },
            { name: "Month-to-Month Steadiness", desc: "How much your income changes from month to month.", color: "#B58900", tag: "Stability" },
            { name: "Income Without You", desc: "How much keeps coming if you stop working.", color: "#B58900", tag: "Stability" },
          ].map((d, i) => (
            <div key={i} style={{ backgroundColor: C.white, borderRadius: 12, padding: m ? "16px 16px" : "18px 20px", boxShadow: "0 1px 3px rgba(14,26,43,0.03)", position: "relative" as const, overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: `${d.color}25` }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>{d.name}</span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: d.color, padding: "2px 6px", borderRadius: 4, backgroundColor: `${d.color}08` }}>{d.tag}</span>
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
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 60 : 104, paddingBottom: m ? 60 : 104, paddingLeft: px(m), paddingRight: px(m), position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: m ? 300 : 500, height: m ? 300 : 500, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 880, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 64, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 24 : 32, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.sand, marginBottom: 12 }}>Your score and your diagnostic are separate.</h2>
          <p style={{ fontSize: m ? 16 : 17, color: "rgba(244,241,234,0.50)", lineHeight: 1.65 }}>The score is calculated by fixed rules. The diagnostic adds context — but never changes the score.</p>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: m ? 24 : 36, ...fadeIn(visible, 100) }}>
          <div style={{ padding: m ? 24 : 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.03)", borderLeft: `3px solid ${C.teal}`, marginBottom: m ? 16 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${C.teal}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15" /></svg>
              </div>
              <span style={{ fontSize: 17, fontWeight: 600, color: C.sand }}>The Score</span>
            </div>
            <p style={{ fontSize: 15, color: "rgba(244,241,234,0.55)", lineHeight: 1.6, marginBottom: 16 }}>Calculated from your answers only. Nothing else can change it.</p>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
              {["Score", "Stability level", "Biggest risk", "Stress test"].map((item, i) => (
                <span key={i} style={{ fontSize: 13, fontWeight: 500, color: "rgba(244,241,234,0.60)", padding: "5px 12px", borderRadius: 6, backgroundColor: "rgba(255,255,255,0.05)" }}>{item}</span>
              ))}
            </div>
          </div>

          <div style={{ padding: m ? 24 : 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.03)", borderLeft: `3px solid ${C.purple}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${C.purple}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" /></svg>
              </div>
              <span style={{ fontSize: 17, fontWeight: 600, color: C.sand }}>The Diagnostic</span>
            </div>
            <p style={{ fontSize: 15, color: "rgba(244,241,234,0.55)", lineHeight: 1.6, marginBottom: 16 }}>Adds industry context and recommendations. Does not change the score.</p>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
              {["Industry context", "What-if scenarios", "What to do first"].map((item, i) => (
                <span key={i} style={{ fontSize: 13, fontWeight: 500, color: "rgba(244,241,234,0.60)", padding: "5px 12px", borderRadius: 6, backgroundColor: "rgba(255,255,255,0.05)" }}>{item}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: m ? "14px 16px" : "16px 20px", borderRadius: 10, borderLeft: `3px solid ${C.purple}`, backgroundColor: "rgba(255,255,255,0.02)", ...fadeIn(visible, 200) }}>
          <p style={{ fontSize: 15, fontWeight: 500, color: C.sand, margin: 0, lineHeight: 1.5 }}>
            The diagnostic can never change, influence, or override your score under any condition.
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
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 60 : 104, paddingBottom: m ? 64 : 112, paddingLeft: px(m), paddingRight: px(m), borderTop: "1px solid rgba(244,241,234,0.04)" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 26 : 40, fontWeight: 500, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.sand, marginBottom: 16, ...fadeIn(visible) }}>
          Now see what your income looks like{m ? " " : <br />}under the same system.
        </h2>
        <p style={{ fontSize: 17, color: "rgba(244,241,234,0.45)", lineHeight: 1.65, marginBottom: 36, ...fadeIn(visible, 60) }}>
          Under 2 minutes. Six areas scored. Same answers always give the same result.
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
