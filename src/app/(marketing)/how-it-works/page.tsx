"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import MarketingHeader from "@/components/MarketingHeader";
import MarketingFooter from "@/components/MarketingFooter";

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
          How RunPayway™ works
        </h1>
        <p style={{ fontSize: m ? 16 : 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, maxWidth: 620, margin: "0 auto 32px", ...fadeIn(visible, 80) }}>
          RunPayway™ measures income structure under approved rules, then returns an approved, external-safe output generated the same way every time.
        </p>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 8, marginBottom: 32, ...fadeIn(visible, 140) }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: C.teal }}>
            MEASURED THE SAME WAY EVERY TIME
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 16, ...fadeIn(visible, 180) }}>
          <Link href="/organizations" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: m ? 56 : 60, width: m ? "100%" : "auto",
            padding: m ? "0 28px" : "0 32px",
            borderRadius: 8, backgroundColor: C.navy, color: C.white,
            fontSize: 15, fontWeight: 600, textDecoration: "none",
            transition: "background-color 150ms, transform 150ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.purple; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.navy; }}>
            Request Enterprise Briefing →
          </Link>
          <p style={{ fontSize: 13, fontWeight: 500, color: C.textMuted }}>
            Governed measurement · Approved rules · External-safe outputs
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
            STEP 1 · DEFINE THE INCOME STRUCTURE
          </div>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.028em", color: C.navy, marginBottom: 24, fontFamily: '"Cormorant Garamond", "Georgia", serif' }}>
            Define the income structure
          </h2>
          <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary }}>
            RunPayway™ measures the structural conditions that define how income is built:
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
          Apply the same approved rules every time
        </h2>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 20, ...fadeIn(visible, 80) }}>
          <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.7, color: C.textSecondary }}>
            Two organizations may report similar income levels while operating under fundamentally different structural conditions.
          </p>
          <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.7, color: C.textSecondary }}>
            One structure may rely heavily on a single client, contract, or revenue source.
          </p>
          <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.7, color: C.textSecondary }}>
            Another may operate across diversified recurring income with stronger continuity conditions.
          </p>
          <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.7, color: C.textSecondary }}>
            RunPayway™ measures those structural differences using the same approved rules every time, so outputs stay consistent across teams, systems, and policies.
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
    "Stable: room to absorb change in its sources",
    "Moderate: relies on stability across key sources",
    "Volatile: depends heavily on continued source strength",
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: sectionPy(m), paddingBottom: sectionPy(m), paddingLeft: sectionPx(m), paddingRight: sectionPx(m), borderTop: `1px solid ${C.divider}` }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.028em", color: C.navy, marginBottom: 32, fontFamily: '"Cormorant Garamond", "Georgia", serif', ...fadeIn(visible) }}>
          Produce an external-safe classification
        </h2>
        <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 32, ...fadeIn(visible, 80) }}>
          RunPayway™ produces a governed, external-safe classification of how dependent the income structure is on its sources:
        </p>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: m ? 0 : 32, ...fadeIn(visible, 140) }}>
          {contexts.map((ctx, i) => (
            <div key={i} style={{ paddingBottom: m ? 12 : 0 }}>
              <p style={{ fontSize: 15, fontWeight: 500, color: C.navy, margin: 0, lineHeight: 1.5 }}>{ctx}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginTop: 32, ...fadeIn(visible, 180) }}>
          The classification is external-safe. No public numeric score is exposed, and it can be published to connected systems.
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
    "Test proposed rule changes",
    "Run against historical income cases",
    "See the output delta before launch",
    "Review affected segments",
    "Check connected-system impact",
    "Approve or roll back",
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: sectionPy(m), paddingBottom: sectionPy(m), paddingLeft: sectionPx(m), paddingRight: sectionPx(m), borderTop: `1px solid ${C.divider}` }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.028em", color: C.navy, marginBottom: 32, fontFamily: '"Cormorant Garamond", "Georgia", serif', ...fadeIn(visible) }}>
          Test measurement-rule changes before launch
        </h2>

        <div style={{ display: m ? "flex" : "grid", gridTemplateColumns: "1fr 1fr", flexDirection: m ? "column" as const : undefined, gap: 24, marginBottom: 32, ...fadeIn(visible, 80) }}>
          {items.map((item, i) => (
            <div key={i} style={{ paddingBottom: 12, borderBottom: `1px solid ${C.divider}` }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: C.navy, margin: 0, lineHeight: 1.5 }}>{item}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, ...fadeIn(visible, 160) }}>
          The Measurement Impact Simulator shows what would change before a new approved rule affects any connected system.
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
    "Measurement ID",
    "Accepted inputs",
    "Approved rule version",
    "Measurement path",
    "Approved output",
    "Replay verification",
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: sectionPy(m), paddingBottom: sectionPy(m), paddingLeft: sectionPx(m), paddingRight: sectionPx(m), borderTop: `1px solid ${C.divider}` }}>
      <div style={{ maxWidth: innerW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.028em", color: C.navy, marginBottom: 32, fontFamily: '"Cormorant Garamond", "Georgia", serif', ...fadeIn(visible) }}>
          Replay past measurements
        </h2>
        <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 32, ...fadeIn(visible, 80) }}>
          Measurement Replay reconstructs a past measurement from what produced it, so it can be replayed and explained:
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
    "Approved output schema",
    "External-safe output boundary",
    "Connected-system publishing",
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: sectionPy(m), paddingBottom: sectionPy(m), paddingLeft: sectionPx(m), paddingRight: sectionPx(m), borderTop: `1px solid ${C.divider}` }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.028em", color: C.navy, marginBottom: 32, fontFamily: '"Cormorant Garamond", "Georgia", serif', ...fadeIn(visible) }}>
          Publish approved outputs to connected systems
        </h2>
        <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 32, ...fadeIn(visible, 80) }}>
          Approved outputs are published to your connected systems through governed integration:
        </p>

        <div style={{ display: m ? "flex" : "grid", gridTemplateColumns: "1fr 1fr 1fr", flexDirection: m ? "column" as const : undefined, gap: 24, marginBottom: 32, ...fadeIn(visible, 140) }}>
          {envs.map((env, i) => (
            <div key={i} style={{ paddingBottom: 16, borderBottom: `1px solid ${C.divider}` }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: C.navy, margin: 0, lineHeight: 1.5 }}>{env}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, ...fadeIn(visible, 200) }}>
          Connected systems consume approved outputs without exposing internal measurement logic.
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
    "APPROVED RULES",
    "DETERMINISTIC OUTPUTS",
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
            RunPayway™ does not make eligibility decisions, replace institutional policy, issue recommendations, or provide financial advice.
          </p>
          <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.7, color: C.sandText }}>
            It measures income structure according to approved rules and does not forecast future outcomes.
          </p>
          <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.7, color: C.sandText }}>
            The same inputs are measured the same way every time.
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
          One governed standard for complex-income measurement.
        </h2>
        <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 32, ...fadeIn(visible, 80) }}>
          RunPayway™ measures income structure according to approved rules and publishes approved outputs to connected systems.
        </p>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 16, ...fadeIn(visible, 160) }}>
          <Link href="/organizations" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: m ? 56 : 60, width: m ? "100%" : "auto",
            padding: m ? "0 28px" : "0 32px",
            borderRadius: 8, backgroundColor: C.navy, color: C.white,
            fontSize: 15, fontWeight: 600, textDecoration: "none",
            transition: "background-color 150ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.purple; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.navy; }}>
            Request Enterprise Briefing →
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
      <MarketingHeader />
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
      <MarketingFooter />
    </div>
  );
}
