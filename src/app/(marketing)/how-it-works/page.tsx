"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ================================================================ */
/* UTILITIES                                                         */
/* ================================================================ */

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
    reduced ? {} : {
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    };
}


/* ================================================================ */
/* DESIGN SYSTEM                                                     */
/* ================================================================ */

const C = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  white: "#FFFFFF",
  textSecondary: "#5E6873",
  textMuted: "#7B848E",
  borderSoft: "#D9D6CF",
  risk: "#C74634",
  moderate: "#D0A23A",
  sandText: "#F4F1EA",
  sandMuted: "rgba(244,241,234,0.55)",
  sandLight: "rgba(244,241,234,0.40)",
};

const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';
const innerW = 1120;
const narrowW = 720;
const explanatoryW = 640;
const sectionPx = (m: boolean) => m ? 24 : 48;
const cardShadow = "0 10px 30px rgba(14,26,43,0.06)";
const ctaShadow = "0 8px 24px rgba(14,26,43,0.12)";


/* ================================================================ */
/* SECTION 1 — HERO                                                  */
/* ================================================================ */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <header ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 104 : 152, paddingBottom: m ? 56 : 88, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>
          HOW IT WORKS
        </div>
        <h1 style={{ fontSize: m ? 32 : 64, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.035em", color: C.navy, marginBottom: 16, ...fadeIn(visible, 50) }}>
          The system behind your score.
        </h1>
        <p style={{ fontSize: m ? 18 : 28, fontWeight: 400, lineHeight: 1.4, color: C.textSecondary, maxWidth: 620, margin: "0 auto 24px", ...fadeIn(visible, 80) }}>
          How your income is built&mdash;and how it holds under pressure.
        </p>
        <p style={{ fontSize: m ? 16 : 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, maxWidth: 560, margin: "0 auto 32px", ...fadeIn(visible, 120) }}>
          RunPayway{"\u2122"} measures how your income behaves under real conditions. Same answers always produce the same result.
        </p>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", ...fadeIn(visible, 180) }}>
          <Link href="/begin" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: m ? 56 : 60, width: m ? "100%" : "auto",
            padding: m ? "0 28px" : "0 32px",
            borderRadius: 16, backgroundColor: C.navy, color: C.white,
            fontSize: 16, fontWeight: 600, textDecoration: "none",
            boxShadow: ctaShadow,
            transition: "transform 200ms, box-shadow 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.18)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = ctaShadow; }}>
            Get Your Income Stability Score
          </Link>
          <p style={{ fontSize: 14, fontWeight: 500, color: C.textMuted, marginTop: 16 }}>
            Under 2 minutes | Instant result | Private by default
          </p>
        </div>
      </div>
    </header>
  );
}


/* ================================================================ */
/* SECTION 2 — DECLARATION                                           */
/* ================================================================ */

function Declaration() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 12, ...fadeIn(visible) }}>
          Same rules. No exceptions.
        </h2>
        <p style={{ fontSize: m ? 20 : 24, fontWeight: 600, lineHeight: 1.3, color: C.teal, marginBottom: 32, ...fadeIn(visible, 60) }}>
          Same rules. Every time.
        </p>
        <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 24, ...fadeIn(visible, 100) }}>
          RunPayway{"\u2122"} uses fixed rules applied the same way each time.
        </p>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, maxWidth: 380, margin: "0 auto", ...fadeIn(visible, 140) }}>
          {[
            "No human judgment.",
            "No algorithm changes.",
          ].map((line, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 5 }}><path d="M20 6L9 17l-5-5"/></svg>
              <span style={{ fontSize: 18, fontWeight: 500, color: C.textSecondary, lineHeight: 1.6 }}>{line}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 3 — PROCESS OVERVIEW                                      */
/* ================================================================ */

function ProcessOverview() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.teal, marginBottom: 16 }}>
            Three steps. One standardized result.
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, maxWidth: explanatoryW, margin: "0 auto" }}>
            No judgment, no adjustments — consistent clarity, every time.
          </p>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, maxWidth: 1020, margin: "0 auto", ...fadeIn(visible, 100) }}>
          {[
            {
              num: "01",
              title: "Describe how you earn",
              body: "Tell us how your income works\u2014sources, concentration, and dependency.",
              footer: "No bank connection, no documents, under 2 minutes.",
            },
            {
              num: "02",
              title: "Six dimensions scored",
              body: "Six key factors are evaluated with fixed rules. The model combines them into one result.",
              footer: "Same answers always produce the same result.",
            },
            {
              num: "03",
              title: "Your result",
              body: "Your score, stability level, and income breakdown. The diagnostic adds context without changing the score.",
              footer: "",
            },
          ].map((step, i) => (
            <div key={i} style={{ backgroundColor: C.white, borderRadius: 20, padding: m ? 28 : 36, boxShadow: cardShadow, marginBottom: m ? 24 : 0, textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 700, fontFamily: mono, color: C.teal, marginBottom: 16 }}>{step.num}</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.navy, marginBottom: 12, lineHeight: 1.35 }}>{step.title}</div>
              <p style={{ fontSize: 16, color: C.textSecondary, lineHeight: 1.6, margin: "0 0 16px" }}>{step.body}</p>
              {step.footer && <p style={{ fontSize: 14, fontWeight: 500, color: C.textMuted, lineHeight: 1.6, margin: 0 }}>{step.footer}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 4 — WHAT IS MEASURED                                      */
/* ================================================================ */

function WhatIsMeasured() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const themes = [
    {
      title: "How it\u2019s earned",
      desc: "Where your income comes from and how it\u2019s distributed.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
      accent: C.teal,
    },
    {
      title: "How it holds",
      desc: "Whether it continues under pressure or disappears with disruption.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
      accent: C.purple,
    },
    {
      title: "How it depends on you",
      desc: "What happens to your income if you step away.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
      accent: C.navy,
    },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 24 }}>
            Six key dimensions. One result.
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, maxWidth: explanatoryW, margin: "0 auto" }}>
            Your income is evaluated across six fixed factors &mdash; covering how it&rsquo;s built, how it holds, and what happens if something changes.
          </p>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, maxWidth: 860, margin: "0 auto", ...fadeIn(visible, 100) }}>
          {themes.map((t, i) => (
            <div key={i} style={{ padding: m ? 28 : 32, borderRadius: 20, backgroundColor: C.white, boxShadow: cardShadow, textAlign: "center", marginBottom: m ? 16 : 0, borderLeft: `4px solid ${t.accent}` }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: `${C.teal}08`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                {t.icon}
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.navy, marginBottom: 8, lineHeight: 1.35 }}>{t.title}</div>
              <p style={{ fontSize: 16, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 5 — SCORE VS DIAGNOSTIC                                   */
/* ================================================================ */

function ScoreVsDiagnostic() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 16 }}>
            The Score and the Diagnostic are Separate.
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, maxWidth: explanatoryW, margin: "0 auto 8px" }}>
            The score is consistent &mdash; same inputs, same result. Calculated from your answers only. No changes. No exceptions.
          </p>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, maxWidth: explanatoryW, margin: "0 auto" }}>
            The diagnostic provides industry context and recommendations without altering your score.
          </p>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: m ? 24 : 36, ...fadeIn(visible, 100) }}>
          {/* The Score */}
          <div style={{ padding: m ? 28 : 32, borderRadius: 20, backgroundColor: "rgba(31,109,122,0.02)", boxShadow: cardShadow, marginBottom: m ? 20 : 0, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: C.teal }} />
            <div style={{ fontSize: 20, fontWeight: 600, color: C.navy, marginBottom: 12 }}>The Score</div>
            <p style={{ fontSize: 16, color: C.textSecondary, lineHeight: 1.6, marginBottom: 20 }}>
              Calculated from your answers only. Nothing else influences it.
            </p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {["Score", "Stability level", "Primary structural risk", "Stress test outcome"].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M20 6L9 17l-5-5"/></svg>
                  <span style={{ fontSize: 15, fontWeight: 500, color: C.navy }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* The Diagnostic */}
          <div style={{ padding: m ? 28 : 32, borderRadius: 20, backgroundColor: "rgba(75,63,174,0.02)", boxShadow: cardShadow, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: C.purple }} />
            <div style={{ fontSize: 20, fontWeight: 600, color: C.navy, marginBottom: 12 }}>The Diagnostic</div>
            <p style={{ fontSize: 16, color: C.textSecondary, lineHeight: 1.6, marginBottom: 20 }}>
              Adds interpretation without altering the score.
            </p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {["Industry context", "Scenario analysis", "What to do first"].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M20 6L9 17l-5-5"/></svg>
                  <span style={{ fontSize: 15, fontWeight: 500, color: C.navy }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hard line */}
        <div style={{ padding: m ? "16px 20px" : "20px 28px", borderRadius: 14, backgroundColor: C.white, border: `1px solid rgba(14,26,43,0.06)`, ...fadeIn(visible, 180) }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: C.navy, margin: 0, lineHeight: 1.5, textAlign: "center" }}>
            The diagnostic can never override, adjust, or influence your score under any condition.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 6 — SYSTEM INTEGRITY                                      */
/* ================================================================ */

function SystemIntegrity() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 12 }}>
            Built for consistency.
          </h2>
          <p style={{ fontSize: m ? 20 : 24, fontWeight: 400, lineHeight: 1.4, color: C.textSecondary }}>
            Not for judgment. Not for change.
          </p>
        </div>

        {/* Highlighted consistency statement */}
        <div style={{ maxWidth: 560, margin: "0 auto 40px", padding: m ? "24px 20px" : "28px 32px", borderRadius: 18, borderLeft: `4px solid ${C.navy}`, backgroundColor: C.sand, ...fadeIn(visible, 80) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: `${C.navy}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", color: C.navy }}>CONSISTENCY</span>
          </div>
          <p style={{ fontSize: 18, fontWeight: 500, color: C.navy, margin: 0, lineHeight: 1.5 }}>
            RunPayway™ produces fixed outputs, applying fixed rules.
          </p>
        </div>

      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 7 — SHIFT MOMENT                                          */
/* ================================================================ */

function ShiftMoment() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 16 }}>
            Once measured, your income{m ? " " : <br />}is no longer a guess.
          </h2>
          <p style={{ fontSize: m ? 18 : 22, fontWeight: 400, lineHeight: 1.5, color: C.textSecondary }}>
            You know where your income holds&mdash;and where it&rsquo;s exposed.
          </p>
        </div>

        {/* Accent callout */}
        <div style={{ maxWidth: 640, margin: "0 auto", padding: m ? "24px 20px" : "28px 36px", borderRadius: 18, borderLeft: `4px solid ${C.teal}`, backgroundColor: C.white, boxShadow: cardShadow, ...fadeIn(visible, 100) }}>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
            {[
              "You see where your income holds \u2014 and where it\u2019s exposed",
              "You understand what happens under real conditions",
              "You act before problems appear — not after",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 4 }}><path d="M20 6L9 17l-5-5"/></svg>
                <p style={{ fontSize: m ? 16 : 18, fontWeight: 600, color: C.navy, margin: 0, lineHeight: 1.4 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 8 — BEFORE YOU BEGIN                                      */
/* ================================================================ */

function BeforeYouBegin() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 24 }}>
            No documents needed.{m ? " " : <br />}No bank connection.
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, maxWidth: explanatoryW, margin: "0 auto" }}>
            But you&rsquo;ll get the most accurate result if you&rsquo;ve thought about:
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: 16, maxWidth: 560, margin: "0 auto 32px", ...fadeIn(visible, 100) }}>
          {[
            "How many places your income comes from",
            "Whether any single source accounts for most of it",
            "How much of your income is already committed or recurring",
            "What would change if your biggest source went away tomorrow",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 5 }}><path d="M20 6L9 17l-5-5"/></svg>
              <span style={{ fontSize: 17, fontWeight: 500, color: C.navy, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 16, fontWeight: 500, color: C.textMuted, textAlign: "center", lineHeight: 1.6, maxWidth: 520, margin: "0 auto", ...fadeIn(visible, 180) }}>
          You don&rsquo;t need exact numbers. Reasonable estimates work.{m ? " " : <br />}The system is built for it.
        </p>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 9 — FINAL CTA                                             */
/* ================================================================ */

function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 88 : 128, paddingBottom: m ? 88 : 128, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: explanatoryW, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 28 : 52, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.035em", color: C.sandText, marginBottom: 32, ...fadeIn(visible) }}>
          See how your income is built.
        </h2>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", ...fadeIn(visible, 160) }}>
          <Link href="/begin" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: m ? 56 : 60, width: m ? "100%" : "auto",
            padding: m ? "0 28px" : "0 32px",
            borderRadius: 16, backgroundColor: C.white, color: C.navy,
            fontSize: 16, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 8px 24px rgba(14,26,43,0.08)",
            border: `1px solid ${C.borderSoft}`,
            transition: "transform 200ms, box-shadow 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.08)"; }}>
            Get Your Income Stability Score
          </Link>
          <p style={{ fontSize: 14, fontWeight: 500, color: C.sandLight, marginTop: 16 }}>
            Under 2 minutes | Instant result | Private by default
          </p>
          <Link href="/methodology" style={{ fontSize: 14, fontWeight: 600, color: C.teal, textDecoration: "none", marginTop: 16, display: "inline-block" }}>
            Read our full methodology &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* STICKY CTA                                                        */
/* ================================================================ */

function StickyCta() {
  const m = useMobile();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 600);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  if (!scrolled) return null;
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
      height: 72,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "0 20px",
      paddingBottom: "max(12px, env(safe-area-inset-bottom))",
      backgroundColor: "rgba(14,26,43,0.96)",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      boxShadow: "0 -4px 24px rgba(14,26,43,0.12)",
    }}>
      <Link href="/begin" style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: 48, width: m ? "100%" : "auto", minWidth: m ? 0 : 360,
        padding: m ? 0 : "0 32px",
        borderRadius: 12, backgroundColor: C.white, color: C.navy,
        fontSize: 16, fontWeight: 600, textDecoration: "none",
      }}>
        Get Your Income Stability Score
      </Link>
    </div>
  );
}


/* ================================================================ */
/* PAGE EXPORT                                                       */
/* ================================================================ */

export default function HowItWorksPage() {
  return (
    <div className="overflow-x-hidden">
      <main>
        <HeroSection />
        <Declaration />
        <ProcessOverview />
        <WhatIsMeasured />
        <ScoreVsDiagnostic />
        <SystemIntegrity />
        <ShiftMoment />
        <BeforeYouBegin />
        <FinalCta />
      </main>
    </div>
  );
}
