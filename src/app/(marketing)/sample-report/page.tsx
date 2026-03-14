"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Shared hooks                                                       */
/* ------------------------------------------------------------------ */

function useMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return mobile;
}

function useInView(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F7F6F3",
  sandDk: "#EDECEA",
  muted: "#6B7280",
  light: "#9CA3AF",
  gradient: "linear-gradient(135deg, #0E1A2B 0%, #4B3FAE 50%, #1F6D7A 100%)",
};

/* ------------------------------------------------------------------ */
/*  Sample data                                                        */
/* ------------------------------------------------------------------ */

const SAMPLE = {
  recordId: "a7e2f1b3-94c1-4d8e-b7a2-3f1e5d9c6b8a",
  date: "2026-03-10",
  model: "RP-1.0",
  score: 78,
  band: "Established Stability",
  authCode: "RP-78-A7E2-2026",
  title: "Jordan Ellis — Ellis Advisory Group",
  classification: "Established Stability",
  structure: "LLC — Single Operator",
  incomeModel: "Fee-for-Service",
  revenue: "Project-Based",
  sector: "Professional Services",
  percentile: "72nd",
  activeIncome: 65,
  semiPersistent: 25,
  persistent: 10,
  constraint: "Income Persistence",
  constraintMechanism: "Most income requires ongoing active effort to generate. When active work pauses, income pauses with it.",
  constraintImpact: "Systems dependent on active labor face higher score volatility if conditions change.",
  improvementText: "Shifting 10–15% of income from project-based to recurring service agreements would improve persistence scores. Structuring intellectual property or productized offerings could create asset-based revenue.",
  indicators: [
    ["Income That Continues", "Moderate"],
    ["Number of Income Sources", "Multiple"],
    ["Income Already Scheduled", "Some"],
    ["Monthly Income Stability", "Variable"],
    ["Dependence on Personal Work", "High"],
    ["Dependence on One Source", "Low"],
  ] as [string, string][],
  positiveFactors: ["Multiple income sources", "Some recurring revenue", "Forward commitments present"],
  risks: ["High active labor dependence", "Limited persistent income"],
  drivers: ["Client Diversification", "Recurring Engagements", "Service Expansion"],
  evolutionSteps: ["Project-Based", "Recurring Services", "Managed Services", "Asset-Based"],
  currentStage: "Project-Based → Recurring Services",
  currentStageIndex: 1,
  sectorMechanisms: [
    "Retainer-based client relationships",
    "Productized service packages",
    "Licensing intellectual property or frameworks",
  ],
  benchAvg: 62,
  benchTop20: "80+",
  benchDistance: "2 points",
};

/* ------------------------------------------------------------------ */
/*  Report section label                                               */
/* ------------------------------------------------------------------ */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 600,
        textTransform: "uppercase" as const,
        letterSpacing: "0.12em",
        color: B.light,
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section divider                                                    */
/* ------------------------------------------------------------------ */

function Divider() {
  return <div style={{ height: 1, background: "rgba(14,26,43,0.06)", margin: "24px 0" }} />;
}

/* ------------------------------------------------------------------ */
/*  Report page wrapper                                                */
/* ------------------------------------------------------------------ */

function ReportPageCard({
  pageNumber,
  pageTitle,
  children,
  mobile,
  visible,
  delay,
}: {
  pageNumber: number;
  pageTitle: string;
  children: React.ReactNode;
  mobile: boolean;
  visible: boolean;
  delay: number;
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 18,
        border: "1px solid rgba(14,26,43,0.08)",
        padding: mobile ? "28px 24px 32px" : "40px 44px 48px",
        boxShadow: "0 24px 80px rgba(14,26,43,0.08), 0 4px 16px rgba(14,26,43,0.03)",
        position: "relative",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 700ms ease, transform 700ms ease",
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Gradient accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 24,
          right: 24,
          height: 3,
          borderRadius: "0 0 3px 3px",
          background: B.gradient,
        }}
      />

      {/* Report header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: mobile ? 18 : 20, color: B.navy, fontWeight: 600 }}>
            Income Stability Assessment
          </div>
          <div style={{ fontSize: 13, color: B.purple, fontWeight: 500, letterSpacing: "0.04em", marginTop: 4 }}>
            Model <strong>RP-1.0</strong>
          </div>
        </div>
        <div style={{ fontSize: 10, color: B.light, lineHeight: 1.6, textAlign: "right" as const }}>
          <div>A7E2F1B3</div>
          <div>2026-03-10</div>
        </div>
      </div>
      <div style={{ height: 1, background: "rgba(14,26,43,0.06)", margin: "16px 0 24px" }} />

      {/* Page label */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "4px 12px",
          borderRadius: 6,
          background: "rgba(75,63,174,0.06)",
          marginBottom: 20,
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 700, color: B.purple }}>PAGE {pageNumber}</span>
        <span style={{ fontSize: 10, fontWeight: 600, color: B.navy }}>{pageTitle}</span>
      </div>

      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function SampleReportPage() {
  const mobile = useMobile();
  const heroAnim = useInView();
  const page1Anim = useInView();
  const page2Anim = useInView();
  const page3Anim = useInView();
  const ctaAnim = useInView();

  return (
    <div style={{ background: "#FFFFFF" }}>
      {/* ============================================================ */}
      {/*  Hero                                                        */}
      {/* ============================================================ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: B.gradient,
          paddingTop: mobile ? 72 : 100,
          paddingBottom: mobile ? 72 : 100,
        }}
      >
        {/* Grain overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            mixBlendMode: "soft-light",
            pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        />

        <div
          ref={heroAnim.ref}
          className="mx-auto"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 820,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            textAlign: "center",
            opacity: heroAnim.visible ? 1 : 0,
            transform: heroAnim.visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 700ms ease, transform 700ms ease",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 100,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              marginBottom: 28,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.70)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Sample Report
            </span>
          </div>

          <h1
            style={{
              fontSize: mobile ? 30 : 44,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: 24,
            }}
          >
            What Your Report Looks Like
          </h1>

          <p
            style={{
              fontSize: mobile ? 16 : 18,
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.7,
              maxWidth: 640,
              margin: "0 auto 20px",
            }}
          >
            Every assessment produces a three-page institutional report — your classification, structural breakdown, and a clear path to improve.
          </p>

          <p
            style={{
              fontSize: mobile ? 14 : 16,
              color: "rgba(255,255,255,0.50)",
              lineHeight: 1.75,
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            Below is a complete sample report generated by Structural Stability Model RP-1.0 for a Professional Services income system.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Page 1 — Executive Assessment                               */}
      {/* ============================================================ */}
      <section
        style={{
          paddingTop: mobile ? 56 : 80,
          paddingBottom: mobile ? 24 : 40,
          background: B.sand,
        }}
      >
        <div
          className="mx-auto"
          style={{
            maxWidth: 860,
            paddingLeft: mobile ? 20 : 40,
            paddingRight: mobile ? 20 : 40,
          }}
        >
          {/* Page 1 explainer */}
          <div
            ref={page1Anim.ref}
            style={{
              marginBottom: mobile ? 28 : 40,
              opacity: page1Anim.visible ? 1 : 0,
              transform: page1Anim.visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 600ms ease, transform 600ms ease",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
              Report Overview
            </div>
            <h2 style={{ fontSize: mobile ? 24 : 32, fontWeight: 700, color: B.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>
              Page 1: Executive Assessment
            </h2>
            <p style={{ fontSize: mobile ? 14 : 16, color: B.muted, lineHeight: 1.75, maxWidth: 600 }}>
              The first page delivers your Income Stability Score™, stability classification, percentile ranking within your industry sector, profile summary, and the key structural factors influencing your score.
            </p>
          </div>

          {/* Report card */}
          <ReportPageCard pageNumber={1} pageTitle="Executive Assessment" mobile={mobile} visible={page1Anim.visible} delay={200}>
            {/* Key insight */}
            <p style={{ fontSize: 13, color: B.muted, lineHeight: 1.7, marginBottom: 20 }}>
              This assessment evaluates the structural stability of income systems using six deterministic factors under Model RP-1.0. Score reflects current income architecture, not future outcomes.
            </p>

            {/* Score + percentile */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
              <div style={{ padding: "12px 20px", borderRadius: 10, backgroundColor: B.sand, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 28, color: B.navy, fontWeight: 700, lineHeight: 1 }}>{SAMPLE.score}</div>
                <div>
                  <div style={{ fontSize: 12, color: B.purple, fontWeight: 600 }}>{SAMPLE.band}</div>
                  <div style={{ fontSize: 10, color: B.light, marginTop: 2 }}>Income Stability Score™</div>
                </div>
              </div>
              <div style={{ padding: "12px 20px", borderRadius: 10, backgroundColor: B.sand, display: "flex", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, color: B.muted }}>
                    <span style={{ fontWeight: 600, color: B.navy }}>{SAMPLE.percentile} percentile</span> within {SAMPLE.sector}
                  </div>
                  <div style={{ fontSize: 10, color: B.light, marginTop: 2 }}>
                    Exceeds 72% of assessed income systems in this sector.
                  </div>
                </div>
              </div>
            </div>

            {/* Spectrum bar */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ position: "relative", marginBottom: 6 }}>
                <div style={{ height: 8, borderRadius: 999, background: B.gradient }} />
                {[40, 60, 80].map((pos) => (
                  <div key={pos} style={{ position: "absolute", left: `${pos}%`, top: 0, width: 1, height: 8, backgroundColor: "rgba(255,255,255,0.4)" }} />
                ))}
                {/* Score marker */}
                <div style={{ position: "absolute", left: `${SAMPLE.score}%`, top: -3, transform: "translateX(-50%)" }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #fff", background: B.purple, boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
                {[
                  { label: "Limited", range: "0–39" },
                  { label: "Developing", range: "40–59" },
                  { label: "Established", range: "60–79" },
                  { label: "High", range: "80–100" },
                ].map((b) => (
                  <div key={b.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, fontWeight: 600, color: b.label + " Stability" === SAMPLE.band ? B.navy : B.light }}>{b.label}</div>
                    <div style={{ fontSize: 8, color: B.light }}>{b.range}</div>
                  </div>
                ))}
              </div>
            </div>

            <Divider />

            {/* Assessment Title */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 500, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "rgba(14,26,43,0.55)", marginBottom: 4 }}>
                Assessment Title
              </div>
              <div style={{ fontWeight: 600, fontSize: 16, color: B.navy }}>{SAMPLE.title}</div>
            </div>

            {/* Profile */}
            <Label>Profile</Label>
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: "8px 24px" }}>
              {[
                ["Classification", SAMPLE.classification],
                ["Structure", SAMPLE.structure],
                ["Income Model", SAMPLE.incomeModel],
                ["Revenue", SAMPLE.revenue],
                ["Sector", SAMPLE.sector],
              ].map(([l, v]) => (
                <div key={l}>
                  <span style={{ fontSize: 11, color: B.light }}>{l}: </span>
                  <span style={{ fontSize: 11, color: B.navy, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>

            <Divider />

            {/* Key Structural Factors */}
            <Label>Key Structural Factors</Label>
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 600, color: B.teal, letterSpacing: "0.08em", marginBottom: 8 }}>Positive Factors</div>
                {SAMPLE.positiveFactors.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: B.teal, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: B.navy }}>{f}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 600, color: B.muted, letterSpacing: "0.08em", marginBottom: 8 }}>Structural Risks</div>
                {SAMPLE.risks.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: B.light, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: B.navy }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </ReportPageCard>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Page 2 — Structural Analysis                                */}
      {/* ============================================================ */}
      <section
        style={{
          paddingTop: mobile ? 48 : 72,
          paddingBottom: mobile ? 24 : 40,
          background: B.sand,
        }}
      >
        <div
          className="mx-auto"
          style={{
            maxWidth: 860,
            paddingLeft: mobile ? 20 : 40,
            paddingRight: mobile ? 20 : 40,
          }}
        >
          <div
            ref={page2Anim.ref}
            style={{
              marginBottom: mobile ? 28 : 40,
              opacity: page2Anim.visible ? 1 : 0,
              transform: page2Anim.visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 600ms ease, transform 600ms ease",
            }}
          >
            <h2 style={{ fontSize: mobile ? 24 : 32, fontWeight: 700, color: B.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>
              Page 2: Structural Analysis
            </h2>
            <p style={{ fontSize: mobile ? 14 : 16, color: B.muted, lineHeight: 1.75, maxWidth: 600 }}>
              The second page breaks down the composition of your income sources, evaluates six structural indicators, provides a system diagnosis, and benchmarks your score against your industry sector.
            </p>
          </div>

          <ReportPageCard pageNumber={2} pageTitle="Structural Analysis" mobile={mobile} visible={page2Anim.visible} delay={200}>
            <p style={{ fontSize: 13, color: B.muted, lineHeight: 1.7, marginBottom: 24 }}>
              This page breaks down the composition of income sources and structural indicators driving the overall stability score.
            </p>

            {/* Income Structure Map */}
            <Label>Income Structure Map</Label>
            <p style={{ fontSize: 11, color: B.muted, marginBottom: 12 }}>
              Jordan Ellis — Ellis Advisory Group&apos;s income comes from three types of sources.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
              {[
                { l: "Active Income", desc: "Earned by doing work", v: SAMPLE.activeIncome, c: B.muted },
                { l: "Semi-Persistent", desc: "Repeats for a while, then stops", v: SAMPLE.semiPersistent, c: B.teal },
                { l: "Persistent", desc: "Continues with little work", v: SAMPLE.persistent, c: B.navy },
              ].map((bar) => (
                <div key={bar.l}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <div>
                      <span style={{ fontSize: 11, color: B.muted }}>{bar.l}</span>
                      <span style={{ fontSize: 10, color: B.light, marginLeft: 8 }}>{bar.desc}</span>
                    </div>
                    <span style={{ fontSize: 11, color: B.navy, fontWeight: 600 }}>{bar.v}%</span>
                  </div>
                  <div style={{ height: 10, borderRadius: 999, backgroundColor: B.sandDk, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 999, width: `${bar.v}%`, backgroundColor: bar.c, transition: "width 0.8s ease" }} />
                  </div>
                </div>
              ))}
            </div>

            <Divider />

            {/* Structural Indicators */}
            <Label>Structural Indicators</Label>
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 8 }}>
              {SAMPLE.indicators.map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", borderRadius: 8, backgroundColor: B.sand }}>
                  <span style={{ fontSize: 10, color: B.muted }}>{l}</span>
                  <span style={{ fontSize: 10, color: B.navy, fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>

            <Divider />

            {/* System Diagnosis */}
            <Label>System Diagnosis</Label>
            <div style={{ fontSize: 12, color: B.muted, lineHeight: 1.7 }}>
              <p style={{ marginBottom: 8 }}>
                This system operates mainly as a <strong style={{ color: B.navy }}>Labor-Dependent</strong> income system in the <strong style={{ color: B.navy }}>Professional Services</strong> sector.
              </p>
              <p>
                Income mainly comes from active project work. The system shows moderate diversification but limited persistent revenue streams. Because <strong style={{ color: B.navy }}>Income Persistence</strong> is limited, stability depends on continuing to generate new work.
              </p>
            </div>

            <Divider />

            {/* Industry Benchmark */}
            <Label>Industry Stability Benchmark</Label>
            <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${B.sandDk}` }}>
              {[
                ["Average Professional Services Score", String(SAMPLE.benchAvg), false],
                ["Top 20% Stability Range", SAMPLE.benchTop20, false],
                ["Your Score", String(SAMPLE.score), true],
                ["Distance From Top Tier", SAMPLE.benchDistance, false],
              ].map(([l, v, highlight], i) => (
                <div key={l as string} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", backgroundColor: i % 2 === 0 ? B.sand : "#fff" }}>
                  <span style={{ fontSize: 11, color: B.muted }}>{l as string}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: highlight ? B.purple : B.navy }}>{v as string}</span>
                </div>
              ))}
            </div>

            {/* Drivers */}
            <div style={{ marginTop: 16 }}>
              <Label>Drivers Supporting Stability</Label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {SAMPLE.drivers.map((d) => (
                  <span key={d} style={{ fontSize: 10, fontWeight: 500, padding: "4px 10px", borderRadius: 6, backgroundColor: B.sand, color: B.navy }}>{d}</span>
                ))}
              </div>
            </div>
          </ReportPageCard>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Page 3 — Improvement Path & Governance                     */}
      {/* ============================================================ */}
      <section
        style={{
          paddingTop: mobile ? 48 : 72,
          paddingBottom: mobile ? 64 : 96,
          background: B.sand,
        }}
      >
        <div
          className="mx-auto"
          style={{
            maxWidth: 860,
            paddingLeft: mobile ? 20 : 40,
            paddingRight: mobile ? 20 : 40,
          }}
        >
          <div
            ref={page3Anim.ref}
            style={{
              marginBottom: mobile ? 28 : 40,
              opacity: page3Anim.visible ? 1 : 0,
              transform: page3Anim.visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 600ms ease, transform 600ms ease",
            }}
          >
            <h2 style={{ fontSize: mobile ? 24 : 32, fontWeight: 700, color: B.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>
              Page 3: Improvement Path &amp; Governance
            </h2>
            <p style={{ fontSize: mobile ? 14 : 16, color: B.muted, lineHeight: 1.75, maxWidth: 600 }}>
              The third page identifies your primary structural constraint, presents sector-specific improvement opportunities, maps your evolution path, and provides the official classification record with verification credentials.
            </p>
          </div>

          <ReportPageCard pageNumber={3} pageTitle="Improvement Path & Governance" mobile={mobile} visible={page3Anim.visible} delay={200}>
            <p style={{ fontSize: 13, color: B.muted, lineHeight: 1.7, marginBottom: 24 }}>
              Structural actions that may move this income system toward higher stability classification.
            </p>

            {/* Primary Constraint */}
            <Label>Primary Structural Constraint</Label>
            <div style={{ fontSize: 13, color: B.navy, fontWeight: 600, marginBottom: 6 }}>{SAMPLE.constraint}</div>
            <div style={{ fontSize: 12, color: B.muted, lineHeight: 1.7, marginBottom: 4 }}>{SAMPLE.constraintMechanism}</div>
            <div style={{ fontSize: 12, color: B.muted, lineHeight: 1.7 }}>{SAMPLE.constraintImpact}</div>

            <Divider />

            {/* Improvement Opportunities */}
            <Label>Improvement Opportunities</Label>
            <p style={{ fontSize: 12, color: B.muted, lineHeight: 1.7, marginBottom: 16 }}>
              {SAMPLE.improvementText}
            </p>

            {/* Sector evolution */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 600, color: B.muted, letterSpacing: "0.08em", marginBottom: 10 }}>
                Sector Evolution Path
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                {SAMPLE.evolutionSteps.map((step, i) => (
                  <div key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 500,
                      padding: "4px 10px",
                      borderRadius: 6,
                      backgroundColor: i === 0 ? B.teal : i === SAMPLE.currentStageIndex ? B.navy : B.sand,
                      color: i <= SAMPLE.currentStageIndex ? "#fff" : B.light,
                    }}>
                      {step}
                    </span>
                    {i < SAMPLE.evolutionSteps.length - 1 && <span style={{ fontSize: 10, color: B.light }}>&rarr;</span>}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 10, color: B.muted, marginTop: 8 }}>
                Current Stage: <strong style={{ color: B.navy }}>{SAMPLE.currentStage}</strong>
              </div>
            </div>

            {/* Sector mechanisms */}
            <div style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 600, color: B.muted, letterSpacing: "0.08em", marginBottom: 6 }}>
                Sector Stability Mechanisms
              </div>
              <ul style={{ fontSize: 11, color: B.muted, listStyleType: "disc", paddingLeft: 16, lineHeight: 1.8 }}>
                {SAMPLE.sectorMechanisms.map((m) => <li key={m}>{m}</li>)}
              </ul>
            </div>

            <Divider />

            {/* Methodology */}
            <Label>Methodology</Label>
            <p style={{ fontSize: 10, color: B.muted, lineHeight: 1.7, marginBottom: 4 }}>
              The Income Stability Score™ evaluates the structural stability of income at a specific point in time. Six structural factors are assessed under Model RP-1.0 using fixed, deterministic scoring criteria. The model does not evaluate investment performance, creditworthiness, or future financial outcomes.
            </p>

            <Divider />

            {/* Disclosure */}
            <Label>Disclosure</Label>
            <p style={{ fontSize: 10, color: B.light, lineHeight: 1.7 }}>
              This report is created by a fixed classification model. It is not financial advice. The Income Stability Score is not a credit score, not a measure of net worth, and not a prediction of future income.
            </p>

            <Divider />

            {/* Official Record */}
            <Label>Official Classification Record</Label>
            <div style={{ display: "grid", gap: 4, marginTop: 4 }}>
              {[
                ["Record ID", SAMPLE.recordId],
                ["Model", SAMPLE.model],
                ["Date", SAMPLE.date],
                ["Score", `${SAMPLE.score} — ${SAMPLE.band}`],
                ["Auth Code", SAMPLE.authCode],
                ["Registry", "Publicly Listed"],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", flexDirection: mobile ? "column" : "row" }}>
                  <span style={{ fontSize: 10, width: mobile ? "auto" : 80, flexShrink: 0, color: B.light }}>{l}</span>
                  <span style={{ fontSize: 10, fontFamily: "monospace", wordBreak: "break-all", color: B.navy }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Verification */}
            <p style={{ fontSize: 10, color: B.muted, marginTop: 12, lineHeight: 1.6 }}>
              Verify this report at <span style={{ fontWeight: 500, color: B.navy }}>RunPayway.com/verify</span> using the Record ID and Authorization Code.
            </p>

            {/* Model reference */}
            <div style={{ textAlign: "center", marginTop: 20, paddingTop: 12, borderTop: `1px solid ${B.sandDk}` }}>
              <div style={{ fontSize: 10, color: B.light }}>RunPayway Structural Stability Model RP-1.0</div>
            </div>
          </ReportPageCard>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA                                                         */}
      {/* ============================================================ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: B.gradient,
          paddingTop: mobile ? 72 : 100,
          paddingBottom: mobile ? 72 : 100,
        }}
      >
        {/* Grain overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            mixBlendMode: "soft-light",
            pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        />

        {/* Concentric halos */}
        {[220, 380, 560].map((size, i) => (
          <div
            key={size}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: size,
              height: size,
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              border: `1px solid rgba(255,255,255,${0.06 - i * 0.015})`,
              pointerEvents: "none",
            }}
          />
        ))}

        <div
          ref={ctaAnim.ref}
          className="mx-auto"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 680,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            textAlign: "center",
            opacity: ctaAnim.visible ? 1 : 0,
            transform: ctaAnim.visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 700ms ease, transform 700ms ease",
          }}
        >
          <h2
            style={{
              fontSize: mobile ? 26 : 38,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            Get Your Own Report
          </h2>

          <p
            style={{
              fontSize: mobile ? 14 : 16,
              color: "rgba(255,255,255,0.60)",
              lineHeight: 1.75,
              maxWidth: 520,
              margin: "0 auto 36px",
            }}
          >
            Complete the assessment in a few minutes and receive your full three-page Income Stability Assessment instantly — your score, structural breakdown, and improvement path.
          </p>

          <Link
            href="/pricing"
            className="inline-flex items-center justify-center font-semibold"
            style={{
              height: mobile ? 52 : 56,
              paddingLeft: mobile ? 28 : 36,
              paddingRight: mobile ? 28 : 36,
              borderRadius: 14,
              background: "#FFFFFF",
              color: B.navy,
              fontSize: mobile ? 15 : 16,
              letterSpacing: "-0.01em",
              border: "none",
              boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
              transition: "transform 180ms ease, box-shadow 180ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.24)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)";
            }}
          >
            Get My Income Stability Score →
          </Link>

          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.30)", marginTop: 32, letterSpacing: "0.02em" }}>
            Powered by Structural Stability Model RP-1.0
          </p>
        </div>
      </section>
    </div>
  );
}
