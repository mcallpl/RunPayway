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
      transform: visible ? "translateY(0)" : "translateY(8px)",
      transition: `opacity 500ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
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
  textPrimary: "#131A22",
  textSecondary: "#5E6873",
  textMuted: "#7B848E",
  divider: "#E5E7EB",
  borderSoft: "#D9D6CF",
  sandText: "#F4F1EA",
  sandMuted: "rgba(244,241,234,0.55)",
  sandLight: "rgba(244,241,234,0.40)",
};

const innerW = 1100;
const narrowW = 720;
const sectionPx = (m: boolean) => m ? 20 : 40;
const sectionPy = (m: boolean) => m ? 56 : 80;

/* ================================================================ */
/* SECTION 1 — HERO                                                  */
/* ================================================================ */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <header ref={ref} style={{ backgroundColor: C.white, paddingTop: sectionPy(m) + 20, paddingBottom: sectionPy(m), paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontSize: m ? 36 : 56, fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.035em", color: C.navy, marginBottom: 24, fontFamily: '"Cormorant Garamond", "Georgia", serif' }}>
          How structural verification works
        </h1>
        <p style={{ fontSize: m ? 16 : 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, maxWidth: 620, margin: "0 auto 32px", ...fadeIn(visible, 80) }}>
          RunPayway™ evaluates income structure using a fixed verification methodology, then returns a version-stamped result generated under the same structural framework every time.
        </p>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 8, marginBottom: 32, ...fadeIn(visible, 140) }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: C.teal }}>
            THE SAME INPUTS PRODUCE THE SAME RESULT
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 16, ...fadeIn(visible, 180) }}>
          <Link href="/begin" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: m ? 56 : 60, width: m ? "100%" : "auto",
            padding: m ? "0 28px" : "0 32px",
            borderRadius: 8, backgroundColor: C.navy, color: C.white,
            fontSize: 15, fontWeight: 600, textDecoration: "none",
            transition: "background-color 150ms, transform 150ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.purple; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.navy; }}>
            Start Income Stability Verification →
          </Link>
          <p style={{ fontSize: 13, fontWeight: 500, color: C.textMuted }}>
            Under 2 minutes · Private by default · Version-stamped results
          </p>
        </div>
      </div>
    </header>
  );
}

/* ================================================================ */
/* SECTION 2 — WHAT THE FRAMEWORK EVALUATES                          */
/* ================================================================ */

function WhatTheFrameworkEvaluates() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const conditions = [
    "Income Concentration",
    "Source Diversity",
    "Forward Visibility",
    "Stability Pattern",
    "Continuity Strength",
    "Dependency Exposure",
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: sectionPy(m), paddingBottom: sectionPy(m), paddingLeft: sectionPx(m), paddingRight: sectionPx(m), borderTop: `1px solid ${C.divider}` }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        <div style={{ marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 12 }}>
            WHAT THE FRAMEWORK EVALUATES
          </div>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.028em", color: C.navy, marginBottom: 24, fontFamily: '"Cormorant Garamond", "Georgia", serif' }}>
            Structural conditions evaluated during verification
          </h2>
          <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary }}>
            RunPayway™ evaluates six structural conditions associated with income stability:
          </p>
        </div>

        <div style={{ display: m ? "flex" : "grid", gridTemplateColumns: "1fr 1fr 1fr", flexDirection: m ? "column" as const : undefined, gap: 24, marginBottom: m ? 32 : 40, ...fadeIn(visible, 100) }}>
          {conditions.map((cond, i) => (
            <div key={i} style={{ paddingBottom: 20, borderBottom: `1px solid ${C.divider}` }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: C.navy, lineHeight: 1.4, margin: 0 }}>{cond}</h3>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: m ? "column" : "row" as const, gap: 24, ...fadeIn(visible, 180) }}>
          <div style={{ flex: 1, paddingBottom: 16, borderBottom: `1px solid ${C.divider}` }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, margin: 0, lineHeight: 1.5 }}>No manual adjustments.</p>
          </div>
          <div style={{ flex: 1, paddingBottom: 16, borderBottom: `1px solid ${C.divider}` }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, margin: 0, lineHeight: 1.5 }}>No subjective interpretation.</p>
          </div>
          <div style={{ flex: 1, paddingBottom: 16, borderBottom: `1px solid ${C.divider}` }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, margin: 0, lineHeight: 1.5 }}>No predictive scoring.</p>
          </div>
        </div>

        <p style={{ fontSize: 13, fontWeight: 400, color: C.textMuted, marginTop: 24, lineHeight: 1.6, ...fadeIn(visible, 240) }}>
          The framework evaluates submitted structural inputs, not uploaded financial documents.
        </p>
      </div>
    </section>
  );
}

/* ================================================================ */
/* SECTION 3 — WHY STRUCTURE MATTERS                                 */
/* ================================================================ */

function WhyStructureMatters() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: sectionPy(m), paddingBottom: sectionPy(m), paddingLeft: sectionPx(m), paddingRight: sectionPx(m), borderTop: `1px solid ${C.divider}` }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.028em", color: C.navy, marginBottom: 32, fontFamily: '"Cormorant Garamond", "Georgia", serif', ...fadeIn(visible) }}>
          Similar income does not always mean similar stability
        </h2>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 20, ...fadeIn(visible, 80) }}>
          <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.7, color: C.textSecondary }}>
            Two individuals or organizations may report similar income levels while operating under fundamentally different structural conditions.
          </p>
          <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.7, color: C.textSecondary }}>
            One structure may rely heavily on a single client, contract, or revenue source.
          </p>
          <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.7, color: C.textSecondary }}>
            Another may operate across diversified recurring income with stronger continuity conditions.
          </p>
          <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.7, color: C.textSecondary }}>
            RunPayway™ evaluates those structural differences using the same fixed methodology every time.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ================================================================ */
/* SECTION 4 — DECISION CONTEXT                                      */
/* ================================================================ */

function DecisionContext() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const contexts = [
    "Mortgage qualification",
    "Business expansion",
    "Career transitions",
    "Investment decisions",
    "Retirement planning",
    "Self-employment growth",
    "Commission-based income",
    "Contract-dependent revenue",
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: sectionPy(m), paddingBottom: sectionPy(m), paddingLeft: sectionPx(m), paddingRight: sectionPx(m), borderTop: `1px solid ${C.divider}` }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.028em", color: C.navy, marginBottom: 32, fontFamily: '"Cormorant Garamond", "Georgia", serif', ...fadeIn(visible) }}>
          Structural visibility before major financial decisions
        </h2>
        <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 32, ...fadeIn(visible, 80) }}>
          Income structure may become especially important during periods involving:
        </p>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: m ? 0 : 32, ...fadeIn(visible, 140) }}>
          {contexts.map((ctx, i) => (
            <div key={i} style={{ paddingBottom: m ? 12 : 0 }}>
              <p style={{ fontSize: 15, fontWeight: 500, color: C.navy, margin: 0, lineHeight: 1.5 }}>{ctx}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginTop: 32, ...fadeIn(visible, 180) }}>
          RunPayway™ provides structural visibility before those decisions are made.
        </p>
      </div>
    </section>
  );
}

/* ================================================================ */
/* SECTION 5 — THE RESULT                                            */
/* ================================================================ */

function TheResult() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const items = [
    "Income Stability Score™",
    "Stability Classification™",
    "Structural Exposure Indicators™",
    "Industry Stability Context™",
    "Structural Scenario Analysis",
    "Structural Stability Priorities™",
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: sectionPy(m), paddingBottom: sectionPy(m), paddingLeft: sectionPx(m), paddingRight: sectionPx(m), borderTop: `1px solid ${C.divider}` }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.028em", color: C.navy, marginBottom: 32, fontFamily: '"Cormorant Garamond", "Georgia", serif', ...fadeIn(visible) }}>
          What the Full Structural Verification™ includes
        </h2>

        <div style={{ display: m ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: m ? "column" as const : undefined, gap: 24, marginBottom: 32, ...fadeIn(visible, 80) }}>
          {items.map((item, i) => (
            <div key={i} style={{ paddingBottom: 12, borderBottom: `1px solid ${C.divider}` }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: C.navy, margin: 0, lineHeight: 1.5 }}>{item}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, ...fadeIn(visible, 160) }}>
          The report is generated using the same methodological framework applied across all submitted profiles.
        </p>
      </div>
    </section>
  );
}

/* ================================================================ */
/* SECTION 6 — INDUSTRY CONTEXT                                      */
/* ================================================================ */

function IndustryContext() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const industries = [
    "Real Estate", "Healthcare", "Legal", "Consulting", "Sales",
    "Technology", "Financial Services", "Construction", "Hospitality",
    "Entertainment", "Transportation", "Retail", "Manufacturing",
    "Education", "Insurance", "Freelance / Contract", "Home Services",
    "Media", "Nonprofit"
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: sectionPy(m), paddingBottom: sectionPy(m), paddingLeft: sectionPx(m), paddingRight: sectionPx(m), borderTop: `1px solid ${C.divider}` }}>
      <div style={{ maxWidth: innerW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.028em", color: C.navy, marginBottom: 32, fontFamily: '"Cormorant Garamond", "Georgia", serif', ...fadeIn(visible) }}>
          Structural context across income environments
        </h2>
        <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 32, ...fadeIn(visible, 80) }}>
          The methodology remains consistent across all verification environments. Industry context provides additional structural reference conditions commonly associated with specific income patterns and revenue environments.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, ...fadeIn(visible, 140) }}>
          {industries.map((ind, i) => (
            <div key={i} style={{ paddingBottom: 12, borderBottom: `1px solid ${C.divider}` }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: C.navy, margin: 0, lineHeight: 1.4 }}>{ind}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================ */
/* SECTION 7 — VERIFICATION ENVIRONMENTS                             */
/* ================================================================ */

function VerificationEnvironments() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const envs = [
    "Individual Verification",
    "Advisor Verification",
    "Organizational Verification",
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: sectionPy(m), paddingBottom: sectionPy(m), paddingLeft: sectionPx(m), paddingRight: sectionPx(m), borderTop: `1px solid ${C.divider}` }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.028em", color: C.navy, marginBottom: 32, fontFamily: '"Cormorant Garamond", "Georgia", serif', ...fadeIn(visible) }}>
          Verification environments
        </h2>
        <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 32, ...fadeIn(visible, 80) }}>
          The same structural methodology operates across:
        </p>

        <div style={{ display: m ? "flex" : "grid", gridTemplateColumns: "1fr 1fr 1fr", flexDirection: m ? "column" as const : undefined, gap: 24, marginBottom: 32, ...fadeIn(visible, 140) }}>
          {envs.map((env, i) => (
            <div key={i} style={{ paddingBottom: 16, borderBottom: `1px solid ${C.divider}` }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: C.navy, margin: 0, lineHeight: 1.5 }}>{env}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, ...fadeIn(visible, 200) }}>
          The framework remains methodologically consistent across all verification environments.
        </p>
      </div>
    </section>
  );
}

/* ================================================================ */
/* SECTION 8 — SYSTEM INTEGRITY                                      */
/* ================================================================ */

function SystemIntegrity() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const statements = [
    "FIXED METHODOLOGY",
    "DETERMINISTIC RESULTS",
    "VERSION-STAMPED OUTPUTS",
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: sectionPy(m), paddingBottom: sectionPy(m), paddingLeft: sectionPx(m), paddingRight: sectionPx(m), borderTop: `1px solid rgba(255,255,255,0.1)` }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        <div style={{ display: m ? "flex" : "grid", gridTemplateColumns: "1fr 1fr 1fr", flexDirection: m ? "column" as const : undefined, gap: m ? 20 : 32, marginBottom: 40, ...fadeIn(visible) }}>
          {statements.map((stmt, i) => (
            <div key={i} style={{ paddingBottom: 16, borderBottom: `1px solid rgba(255,255,255,0.1)` }}>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: C.teal, margin: 0, lineHeight: 1.4 }}>{stmt}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: 20, ...fadeIn(visible, 80) }}>
          <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.7, color: C.sandText }}>
            RunPayway™ does not forecast future outcomes.
          </p>
          <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.7, color: C.sandText }}>
            It evaluates structural stability conditions under a fixed methodological framework.
          </p>
          <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.7, color: C.sandText }}>
            The same inputs produce the same result every time.
          </p>
        </div>
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
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: sectionPy(m), paddingBottom: sectionPy(m), paddingLeft: sectionPx(m), paddingRight: sectionPx(m), borderTop: `1px solid ${C.divider}` }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.028em", color: C.navy, marginBottom: 24, fontFamily: '"Cormorant Garamond", "Georgia", serif', ...fadeIn(visible) }}>
          Verify the structural stability of income before major financial decisions.
        </h2>
        <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 32, ...fadeIn(visible, 80) }}>
          Initial structural visibility is provided at no cost.<br />Full Structural Verification™ available for $69.
        </p>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 16, ...fadeIn(visible, 160) }}>
          <Link href="/begin" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: m ? 56 : 60, width: m ? "100%" : "auto",
            padding: m ? "0 28px" : "0 32px",
            borderRadius: 8, backgroundColor: C.navy, color: C.white,
            fontSize: 15, fontWeight: 600, textDecoration: "none",
            transition: "background-color 150ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.purple; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.navy; }}>
            Start Income Stability Verification →
          </Link>
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
        <WhatTheFrameworkEvaluates />
        <WhyStructureMatters />
        <DecisionContext />
        <TheResult />
        <IndustryContext />
        <VerificationEnvironments />
        <SystemIntegrity />
        <FinalCta />
      </main>
    </div>
  );
}
