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
const sectionPx = (m: boolean) => m ? 20 : 48;
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
        <h1 style={{ fontSize: m ? 42 : 64, fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.035em", color: C.navy, marginBottom: 24, ...fadeIn(visible, 50) }}>
          The system behind your score.
        </h1>
        <p style={{ fontSize: m ? 18 : 22, fontWeight: 400, lineHeight: 1.5, color: C.textSecondary, maxWidth: 560, margin: "0 auto 16px", ...fadeIn(visible, 100) }}>
          RunPayway measures how your income is built — not how much you earn.
          Fixed rules. Same answers always produce the same result.
        </p>
        <p style={{ fontSize: m ? 15 : 16, fontWeight: 600, color: C.navy, marginBottom: 32, ...fadeIn(visible, 140) }}>
          No interpretation. No variation. No exceptions.
        </p>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", ...fadeIn(visible, 180) }}>
          <Link href="/begin" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: m ? 56 : 60, width: m ? "100%" : "auto",
            padding: m ? "0 28px" : "0 32px",
            borderRadius: 14, backgroundColor: C.navy, color: C.white,
            fontSize: 18, fontWeight: 600, textDecoration: "none",
            boxShadow: ctaShadow,
            transition: "transform 200ms, box-shadow 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
            Begin assessment
          </Link>
          <p style={{ fontSize: 14, fontWeight: 500, color: C.textMuted, marginTop: 16 }}>
            Under 2 minutes &bull; No financial accounts required &bull; Private by default
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
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, textAlign: "center", marginBottom: 24, ...fadeIn(visible) }}>
          A fixed method. Not a changing model.
        </h2>
        <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, textAlign: "center", marginBottom: 32, ...fadeIn(visible, 80) }}>
          Every RunPayway score is produced using the same rules, applied the same way, every time.
        </p>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, maxWidth: 480, margin: "0 auto 32px", ...fadeIn(visible, 140) }}>
          {[
            "No one adjusts your inputs.",
            "No system adapts your result.",
            "No interpretation is applied.",
          ].map((line, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 9 }} />
              <span style={{ fontSize: 18, color: C.textSecondary, lineHeight: 1.6 }}>{line}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 16, fontWeight: 600, color: C.navy, textAlign: "center", ...fadeIn(visible, 200) }}>
          If the inputs are the same, the score is the same.
        </p>
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
          <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>PROCESS</div>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 24 }}>
            Three steps. One standardized result.
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, maxWidth: explanatoryW, margin: "0 auto" }}>
            Each step follows fixed rules.{m ? " " : <br />}No judgment. No adjustments. No subjectivity.
          </p>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, maxWidth: 1020, margin: "0 auto", ...fadeIn(visible, 100) }}>
          {[
            {
              num: "01",
              title: "Describe how you earn",
              body: "You define how your income works — your sources, concentration, and what you depend on.",
              footer: "Under 2 minutes.\nNo bank connection.\nNo documents required.",
            },
            {
              num: "02",
              title: "Six dimensions scored",
              body: "Six structural factors are evaluated using fixed rules.\n\nThe model combines them into a single score from 0 to 100.",
              footer: "Same answers always produce the same result.",
            },
            {
              num: "03",
              title: "Your result",
              body: "You receive your score, stability level, and structural breakdown.",
              footer: "The diagnostic adds context — without ever changing the score.",
            },
          ].map((step, i) => (
            <div key={i} style={{ backgroundColor: C.white, borderRadius: 20, padding: m ? 28 : 32, boxShadow: cardShadow, marginBottom: m ? 20 : 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: mono, color: C.teal, marginBottom: 20 }}>{step.num}</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.navy, marginBottom: 16, lineHeight: 1.35 }}>{step.title}</div>
              <p style={{ fontSize: 16, color: C.textSecondary, lineHeight: 1.6, margin: "0 0 20px", whiteSpace: "pre-line" }}>{step.body}</p>
              <p style={{ fontSize: 14, fontWeight: 500, color: C.textMuted, lineHeight: 1.6, margin: 0, whiteSpace: "pre-line" }}>{step.footer}</p>
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

  const dimensions = [
    { name: "Recurring Income", tag: "Structure", desc: "How much income continues without new effort." },
    { name: "Source Reliance", tag: "Risk", desc: "How dependent you are on your largest source." },
    { name: "Number of Sources", tag: "Structure", desc: "How many independent income streams you have." },
    { name: "Income Locked In", tag: "Structure", desc: "How far ahead your income is already secured." },
    { name: "Month-to-Month Steadiness", tag: "Stability", desc: "How much your income fluctuates." },
    { name: "Income Without You", tag: "Stability", desc: "How much continues if you stop working." },
  ];

  const tagColor = (tag: string) => tag === "Risk" ? C.risk : tag === "Stability" ? C.moderate : C.teal;

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>MEASUREMENT</div>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 24 }}>
            Six dimensions define your income structure.
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, maxWidth: explanatoryW, margin: "0 auto" }}>
            Each dimension is scored independently — then combined into your final result.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 14 : 20, ...fadeIn(visible, 100) }}>
          {dimensions.map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: m ? "18px 16px" : "22px 24px", borderRadius: 16, backgroundColor: C.sand, border: `1px solid rgba(14,26,43,0.04)` }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: tagColor(d.tag), flexShrink: 0, marginTop: 8 }} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: C.navy, lineHeight: 1.35 }}>{d.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: tagColor(d.tag), padding: "2px 8px", borderRadius: 4, backgroundColor: `${tagColor(d.tag)}08` }}>{d.tag}</span>
                </div>
                <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.55, margin: 0 }}>{d.desc}</p>
              </div>
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
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 24 }}>
            The score and the diagnostic are separate.
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, maxWidth: explanatoryW, margin: "0 auto" }}>
            The score is fixed.{m ? " " : <br />}The diagnostic adds context — but never changes the result.
          </p>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: m ? 24 : 36, ...fadeIn(visible, 100) }}>
          {/* The Score */}
          <div style={{ padding: m ? 28 : 32, borderRadius: 20, backgroundColor: C.white, boxShadow: cardShadow, marginBottom: m ? 20 : 0 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: C.navy, marginBottom: 12 }}>The Score</div>
            <p style={{ fontSize: 16, color: C.textSecondary, lineHeight: 1.6, marginBottom: 20 }}>
              Calculated from your answers only. Nothing else influences it.
            </p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {["Score", "Stability level", "Primary structural risk", "Stress test outcome"].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, fontWeight: 500, color: C.navy }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* The Diagnostic */}
          <div style={{ padding: m ? 28 : 32, borderRadius: 20, backgroundColor: C.white, boxShadow: cardShadow }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: C.navy, marginBottom: 12 }}>The Diagnostic</div>
            <p style={{ fontSize: 16, color: C.textSecondary, lineHeight: 1.6, marginBottom: 20 }}>
              Adds interpretation without altering the score.
            </p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {["Industry context", "Scenario analysis", "What to do first"].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.purple, flexShrink: 0 }} />
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
          <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>SYSTEM INTEGRITY</div>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy }}>
            Built for consistency.{m ? " " : <br />}Not interpretation.
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: m ? 10 : 14, maxWidth: 480, margin: "0 auto 40px", ...fadeIn(visible, 100) }}>
          {[
            { label: "Model", value: "RP-2.0" },
            { label: "Ruleset", value: "Fixed" },
            { label: "Output", value: "Deterministic" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: m ? "16px 24px" : "20px 32px", borderRadius: 16, backgroundColor: C.sand, border: `1px solid rgba(14,26,43,0.04)` }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted }}>{item.label.toUpperCase()}</div>
              <div style={{ fontSize: m ? 20 : 24, fontWeight: 700, fontFamily: mono, color: C.navy }}>{item.value}</div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 16, fontWeight: 500, color: C.textMuted, textAlign: "center", lineHeight: 1.7, ...fadeIn(visible, 180) }}>
          No AI judgment.{m ? " " : <br />}No advisor input.{m ? " " : <br />}No variability over time.
        </p>
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
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy }}>
            Once measured, your income{m ? " " : <br />}is no longer a guess.
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column" as const, maxWidth: 680, margin: "0 auto", ...fadeIn(visible, 100) }}>
          {[
            "You see where your income holds — and where it breaks",
            "You understand what happens under real conditions",
            "You act before problems appear — not after",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "24px 0", borderBottom: i < 2 ? `1px solid rgba(14,26,43,0.06)` : "none" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 10 }} />
              <p style={{ fontSize: m ? 18 : 20, fontWeight: 600, color: C.navy, margin: 0, lineHeight: 1.35 }}>{item}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 16, fontWeight: 500, color: C.textMuted, textAlign: "center", marginTop: m ? 40 : 56, ...fadeIn(visible, 200) }}>
          Most people rely on income they have never evaluated.
        </p>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 8 — FINAL CTA                                             */
/* ================================================================ */

function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 88 : 128, paddingBottom: m ? 88 : 128, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: explanatoryW, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 34 : 52, fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.035em", color: C.sandText, marginBottom: 20, ...fadeIn(visible) }}>
          See how your income is built.
        </h2>
        <p style={{ fontSize: m ? 20 : 24, fontWeight: 400, lineHeight: 1.45, color: C.sandMuted, marginBottom: 32, ...fadeIn(visible, 80) }}>
          Measure your structure under a fixed system — before you rely on it.
        </p>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", ...fadeIn(visible, 160) }}>
          <Link href="/begin" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: m ? 56 : 60, width: m ? "100%" : "auto",
            padding: m ? "0 28px" : "0 32px",
            borderRadius: 14, backgroundColor: C.white, color: C.navy,
            fontSize: 18, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 8px 24px rgba(14,26,43,0.08)",
            border: `1px solid ${C.borderSoft}`,
            transition: "transform 200ms, box-shadow 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
            Get Your Structural Income Report
          </Link>
          <p style={{ fontSize: 14, fontWeight: 500, color: C.sandLight, marginTop: 16 }}>
            Under 2 minutes &bull; Instant result &bull; Private by default
          </p>
        </div>
      </div>
    </section>
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
        <FinalCta />
      </main>
    </div>
  );
}
