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
    <header ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 36 : 56, paddingBottom: m ? 36 : 56, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>About</div>
        <h1 style={{ fontSize: m ? 32 : 48, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", color: C.navy, marginBottom: 16, ...fadeIn(visible, 60) }}>
          The standard for measuring{m ? " " : <br />}income stability.
        </h1>
        <p style={{ fontSize: m ? 16 : 17, color: muted, lineHeight: 1.65, maxWidth: 520, margin: "0 auto", ...fadeIn(visible, 120) }}>
          RunPayway&#8482; produces the Income Stability Score&#8482; — a measurement of how well your income holds up when things change. Built for anyone whose paycheck isn&#8217;t automatically guaranteed.
        </p>
      </div>
    </header>
  );
}


/* ================================================================== */
/* SECTION 2 — WHAT / WHO / WHY (3 elevated cards)                     */
/* ================================================================== */

function WhatWhoWhy() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: "#F5F4F1", paddingTop: m ? 48 : 80, paddingBottom: m ? 48 : 80, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, ...fadeIn(visible) }}>

          {/* WHAT */}
          <div style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 24 : 28, boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 4px 16px rgba(14,26,43,0.03)", marginBottom: m ? 16 : 0, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: `${C.teal}20` }} />
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: `${C.teal}08`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6M15 19v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6M9 13V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v8" /></svg>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: C.teal, marginBottom: 10 }}>WHAT WE DO</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: C.navy, marginBottom: 12, lineHeight: 1.3 }}>Measure how well your income holds up.</div>
            <p style={{ fontSize: 15, color: muted, margin: 0, lineHeight: 1.6 }}>
              RunPayway™ evaluates six areas of how your income is built — not how much you earn. The result is a score from 0 to 100 that shows how your income handles disruption.
            </p>
          </div>

          {/* WHO */}
          <div style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 24 : 28, boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 4px 16px rgba(14,26,43,0.03)", marginBottom: m ? 16 : 0, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: `${C.purple}20` }} />
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: `${C.purple}08`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: C.purple, marginBottom: 10 }}>WHO IT&#8217;S FOR</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: C.navy, marginBottom: 12, lineHeight: 1.3 }}>Anyone whose income isn&#8217;t automatically guaranteed.</div>
            <p style={{ fontSize: 15, color: muted, margin: 0, lineHeight: 1.6 }}>
              Consultants, freelancers, business owners, commission earners, contractors, and professionals in any industry where income depends on ongoing decisions — not permanent contracts.
            </p>
          </div>

          {/* WHY */}
          <div style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 24 : 28, boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 4px 16px rgba(14,26,43,0.03)", position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: `${C.navy}20` }} />
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: `${C.navy}06`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: C.navy, marginBottom: 10 }}>WHY IT EXISTS</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: C.navy, marginBottom: 12, lineHeight: 1.3 }}>Nothing else measures this.</div>
            <p style={{ fontSize: 15, color: muted, margin: 0, lineHeight: 1.6 }}>
              Credit scores measure borrowing history. Income verification confirms past earnings. But nothing measured how well your income is actually built to last — until now.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3 — THE SYSTEM (dark, what makes it trustworthy)            */
/* ================================================================== */

function TheSystem() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 56 : 96, paddingBottom: m ? 56 : 96, paddingLeft: px(m), paddingRight: px(m), position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: m ? 300 : 500, height: m ? 300 : 500, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 880, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 24 : 32, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.sand, marginBottom: 12 }}>What makes this trustworthy.</h2>
          <p style={{ fontSize: m ? 16 : 17, color: "rgba(244,241,234,0.50)", lineHeight: 1.65 }}>The system is designed for institutional credibility — not marketing claims.</p>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: m ? 32 : 48, ...fadeIn(visible, 100) }}>
          {[
            { title: "Consistent", desc: "Same answers always produce the same score. No randomness. No variation.", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15", color: C.teal },
            { title: "Versioned", desc: "Every model version is locked. If the rules change, the model increments.", icon: "M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z", color: C.purple },
            { title: "Private", desc: "No bank connection. No credit pull. Your data is never sold or shared.", icon: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z", color: C.teal },
            { title: "No AI in scoring", desc: "Fixed rules produce fixed results. No machine learning. No subjective judgment.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", color: C.purple },
          ].map((item, i) => (
            <div key={i} style={{ padding: m ? 20 : 24, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.03)", borderLeft: `3px solid ${item.color}30`, marginBottom: m ? 12 : 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${item.color}12`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.sand, marginBottom: 6 }}>{item.title}</div>
              <p style={{ fontSize: 14, color: "rgba(244,241,234,0.50)", lineHeight: 1.55, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Positioning statement */}
        <div style={{ padding: m ? "18px 20px" : "20px 24px", borderRadius: 10, borderLeft: `3px solid ${C.teal}`, backgroundColor: "rgba(255,255,255,0.02)", ...fadeIn(visible, 200) }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.sand, margin: 0, lineHeight: 1.5 }}>
            RunPayway&#8482; is a measurement system — not a financial product. It defines how income stability is measured, not how decisions are made. The score belongs entirely to the individual who takes it.
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
          Now see how your income measures up.
        </h2>
        <p style={{ fontSize: 17, color: "rgba(244,241,234,0.45)", lineHeight: 1.65, marginBottom: 36, ...fadeIn(visible, 60) }}>
          Under 2 minutes. Every result generated from your inputs.
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

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">
      <main>
        <HeroSection />
        <WhatWhoWhy />
        <TheSystem />
        <FinalCta />
      </main>
    </div>
  );
}
