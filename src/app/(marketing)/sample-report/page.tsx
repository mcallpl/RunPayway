"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

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
  // New features
  continuityPct: 38,
  continuityMonths: 4,
  continuityText: "If active work stopped today, approximately 38% of Jordan Ellis's income would continue for an estimated 4 months. The majority of income requires ongoing active work to sustain.",
  riskScenarioDrop: 22,
  riskScenarioScore: 56,
  riskScenarioBand: "Developing Stability",
  riskScenarioText: "If Jordan Ellis's largest income source were lost, the score would decline significantly — by approximately 22 points to 56, moving from Established Stability to Developing Stability.",
  productRecs: [
    { category: "Disability & Income Protection", urgency: "High", rationale: "Income is moderately dependent on active work. Disability insurance would safeguard against disruption from health events." },
    { category: "Revenue Model Restructuring", urgency: "High", rationale: "Most income comes from one-time transactions. Advisory on transitioning to retainer models would build a predictable revenue base." },
    { category: "Business Diversification Advisory", urgency: "Medium", rationale: "High revenue concentration creates outsized risk. Strategic advisory on client acquisition would reduce this exposure." },
  ],
  advisorTalkingPoints: [
    "The client has built meaningful stability (78/100), but specific structural gaps prevent reaching the top tier. Focus on the primary constraint: Income Persistence.",
    "Approximately 38% of income would continue without active work — this is progress, but leaves significant exposure to disruption.",
    "The 90-day action plan targets the highest-leverage structural change. Walking through these steps together creates accountability.",
  ],
  advisorQuestions: [
    "If you couldn't work for 90 days, what percentage of your current income would continue arriving?",
    "Are there any services you provide that could be packaged into a recurring or subscription model?",
    "What would happen to your income if your largest single client or contract ended tomorrow?",
  ],
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
  const { t } = useLanguage();
  const heroAnim = useInView();
  const page1Anim = useInView();
  const page2Anim = useInView();
  const page3Anim = useInView();
  const page4Anim = useInView();

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
              {t.sampleReport.heroTag}
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
            {t.sampleReport.heroTitle}
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
            {t.sampleReport.heroDesc}
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
            {t.sampleReport.heroNote}
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
          background: `linear-gradient(180deg, rgba(14,26,43,0.06) 0%, rgba(14,26,43,0.02) 8%, ${B.sand} 20%)`,
        }}
      >
        <div
          className="mx-auto"
          style={{
            maxWidth: 860,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
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
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: B.navy, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>1</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {t.sampleReport.clarityTag}
              </div>
            </div>
            <h2 style={{ fontSize: mobile ? 24 : 32, fontWeight: 700, color: B.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>
              {t.sampleReport.page1Title}
            </h2>
            <p style={{ fontSize: mobile ? 14 : 16, color: B.muted, lineHeight: 1.75, maxWidth: 600 }}>
              {t.sampleReport.page1Desc}
            </p>
          </div>

          {/* Report card */}
          <ReportPageCard pageNumber={1} pageTitle={t.sampleReport.page1Title} mobile={mobile} visible={page1Anim.visible} delay={200}>
            {/* Key insight */}
            <p style={{ fontSize: 13, color: B.muted, lineHeight: 1.7, marginBottom: 20 }}>
              {t.sampleReport.page1Insight}
            </p>

            {/* Score + percentile */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
              <div style={{ padding: "12px 20px", borderRadius: 10, backgroundColor: B.sand, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 28, color: B.navy, fontWeight: 700, lineHeight: 1 }}>{SAMPLE.score}</div>
                <div>
                  <div style={{ fontSize: 12, color: B.purple, fontWeight: 600 }}>{SAMPLE.band}</div>
                  <div style={{ fontSize: 10, color: B.light, marginTop: 2 }}>Income Stability Score&trade;</div>
                </div>
              </div>
              <div style={{ padding: "12px 20px", borderRadius: 10, backgroundColor: B.sand, display: "flex", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, color: B.muted }}>
                    <span style={{ fontWeight: 600, color: B.navy }}>{SAMPLE.percentile} percentile</span> within {SAMPLE.sector}
                  </div>
                  <div style={{ fontSize: 10, color: B.light, marginTop: 2 }}>
                    {t.sampleReport.percentileExceeds}
                  </div>
                </div>
              </div>
            </div>

            {/* Income Continuity Estimate — NEW */}
            <div style={{
              borderRadius: 10,
              backgroundColor: B.sand,
              padding: "14px 18px",
              marginBottom: 20,
            }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: B.navy }}>{SAMPLE.continuityPct}%</span>
                <span style={{ fontSize: 11, color: B.muted }}>income continues without active work</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: B.teal }}>{SAMPLE.continuityMonths} months</span>
                <span style={{ fontSize: 10, color: B.muted }}>estimated continuity</span>
              </div>
              <p style={{ fontSize: 10, color: B.muted, margin: 0, lineHeight: 1.5 }}>
                {SAMPLE.continuityText}
              </p>
            </div>

            {/* Spectrum bar */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ position: "relative", marginBottom: 6 }}>
                <div style={{ height: 8, borderRadius: 999, background: B.gradient }} />
                {[40, 60, 80].map((pos) => (
                  <div key={pos} style={{ position: "absolute", left: `${pos}%`, top: 0, width: 1, height: 8, backgroundColor: "rgba(255,255,255,0.4)" }} />
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
                {[
                  { label: "Limited", range: "0–39" },
                  { label: "Developing", range: "40–59" },
                  { label: "Established", range: "60–79" },
                  { label: "High", range: "80–100" },
                ].map((b) => {
                  const isActive = b.label + " Stability" === SAMPLE.band;
                  return (
                    <div key={b.label} style={{ textAlign: "center", padding: "4px 2px 3px", borderRadius: 4, border: isActive ? `1.5px solid ${B.navy}` : "1.5px solid transparent", backgroundColor: isActive ? "rgba(14,26,43,0.03)" : "transparent" }}>
                      <div style={{ fontSize: 9, fontWeight: isActive ? 700 : 600, color: isActive ? B.navy : B.light }}>{b.label}</div>
                      <div style={{ fontSize: 8, color: isActive ? B.navy : B.light, fontWeight: isActive ? 600 : 400 }}>{b.range}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Divider />

            {/* Assessment Title */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 500, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "rgba(14,26,43,0.55)", marginBottom: 4 }}>
                {t.sampleReport.assessmentTitle}
              </div>
              <div style={{ fontWeight: 600, fontSize: 16, color: B.navy }}>{SAMPLE.title}</div>
            </div>

            {/* Profile */}
            <Label>{t.sampleReport.profile}</Label>
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: "8px 24px" }}>
              {[
                [t.sampleReport.classification, SAMPLE.classification],
                [t.sampleReport.structure, SAMPLE.structure],
                [t.sampleReport.incomeModel, SAMPLE.incomeModel],
                [t.sampleReport.revenue, SAMPLE.revenue],
                [t.sampleReport.sector, SAMPLE.sector],
              ].map(([l, v]) => (
                <div key={l}>
                  <span style={{ fontSize: 11, color: B.light }}>{l}: </span>
                  <span style={{ fontSize: 11, color: B.navy, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>

            <Divider />

            {/* Key Structural Factors */}
            <Label>{t.sampleReport.keyFactors}</Label>
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 600, color: B.teal, letterSpacing: "0.08em", marginBottom: 8 }}>{t.sampleReport.positiveFactors}</div>
                {SAMPLE.positiveFactors.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: B.teal, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: B.navy }}>{f}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 600, color: B.muted, letterSpacing: "0.08em", marginBottom: 8 }}>{t.sampleReport.structuralRisks}</div>
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
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
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
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: B.purple, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>2</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {t.sampleReport.understandingTag}
              </div>
            </div>
            <h2 style={{ fontSize: mobile ? 24 : 32, fontWeight: 700, color: B.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>
              {t.sampleReport.page2Title}
            </h2>
            <p style={{ fontSize: mobile ? 14 : 16, color: B.muted, lineHeight: 1.75, maxWidth: 600 }}>
              {t.sampleReport.page2Desc}
            </p>
          </div>

          <ReportPageCard pageNumber={2} pageTitle={t.sampleReport.page2Title} mobile={mobile} visible={page2Anim.visible} delay={200}>
            <p style={{ fontSize: 13, color: B.muted, lineHeight: 1.7, marginBottom: 24 }}>
              {t.sampleReport.page2Insight}
            </p>

            {/* Income Structure Map */}
            <Label>{t.sampleReport.incomeStructureMap}</Label>
            <p style={{ fontSize: 11, color: B.muted, marginBottom: 12 }}>
              {t.sampleReport.incomeSourcesNote}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
              {[
                { l: t.sampleReport.activeIncome, desc: t.sampleReport.activeIncomeDesc, v: SAMPLE.activeIncome, c: B.muted },
                { l: t.sampleReport.semiPersistent, desc: t.sampleReport.semiPersistentDesc, v: SAMPLE.semiPersistent, c: B.teal },
                { l: t.sampleReport.persistent, desc: t.sampleReport.persistentDesc, v: SAMPLE.persistent, c: B.navy },
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
            <Label>{t.sampleReport.structuralIndicators}</Label>
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 8 }}>
              {SAMPLE.indicators.map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", borderRadius: 8, backgroundColor: B.sand }}>
                  <span style={{ fontSize: 10, color: B.muted }}>{l}</span>
                  <span style={{ fontSize: 10, color: B.navy, fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Fade overlay — remaining content locked */}
            <div style={{ position: "relative", height: 100, overflow: "hidden", marginTop: 16 }}>
              <Divider />
              <Label>{t.sampleReport.priorityMapLabel}</Label>
              <div style={{ fontSize: 12, color: B.muted, lineHeight: 1.7 }}>
                {t.sampleReport.priorityMapTeaser}
              </div>
              <div style={{ position: "absolute", bottom: 0, left: -20, right: -20, height: 80, background: "linear-gradient(transparent, #ffffff)" }} />
            </div>

            {/* Locked sections hint */}
            <div style={{ textAlign: "center", paddingTop: 8 }}>
              <p style={{ fontSize: 12, color: B.light, fontStyle: "italic" }}>
                {t.sampleReport.priorityMapLocked}
              </p>
            </div>
          </ReportPageCard>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Page 3 — Diagnosis & Benchmarks                             */}
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
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
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
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: B.teal, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>3</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {t.sampleReport.awarenessTag}
              </div>
            </div>
            <h2 style={{ fontSize: mobile ? 24 : 32, fontWeight: 700, color: B.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>
              {t.sampleReport.page3Title}
            </h2>
            <p style={{ fontSize: mobile ? 14 : 16, color: B.muted, lineHeight: 1.75, maxWidth: 600 }}>
              {t.sampleReport.page3Desc}
            </p>
          </div>

          {/* Partially visible report card — 40% shown, rest fades out */}
          <div
            style={{
              position: "relative",
              background: "#FFFFFF",
              borderRadius: 18,
              border: "1px solid rgba(14,26,43,0.08)",
              padding: mobile ? "28px 24px 32px" : "40px 44px 48px",
              boxShadow: "0 24px 80px rgba(14,26,43,0.08), 0 4px 16px rgba(14,26,43,0.03)",
              overflow: "hidden",
              opacity: page3Anim.visible ? 1 : 0,
              transform: page3Anim.visible ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 700ms ease 200ms, transform 700ms ease 200ms",
            }}
          >
            {/* Header bar */}
            <div style={{ height: 3, borderRadius: 6, background: B.gradient, marginBottom: 16 }} />

            {/* Visible content — top 40% */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: B.light, marginBottom: 6 }}>{t.sampleReport.systemDiagnosis}</div>
              <div style={{ fontSize: 12, color: B.muted, lineHeight: 1.7, marginBottom: 16 }}>{t.sampleReport.systemDiagnosisText}</div>
              <div style={{ height: 1, background: "rgba(14,26,43,0.08)", marginBottom: 14 }} />

              <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: B.light, marginBottom: 6 }}>{t.sampleReport.industryBenchmark}</div>
            </div>

            {/* Blurred content — bottom 60% fades out */}
            <div style={{ position: "relative" }}>
              <div style={{ filter: "blur(4px)", opacity: 0.30, pointerEvents: "none", userSelect: "none" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                  {[
                    ["Your Score", "78"],
                    ["Sector Average", "62"],
                    ["Top 20%", "80+"],
                    ["Distance to Top 20%", "2 points"],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 12px", borderRadius: 6, backgroundColor: B.sand }}>
                      <span style={{ fontSize: 10, color: B.muted }}>{label}</span>
                      <span style={{ fontSize: 10, color: B.navy, fontWeight: 600 }}>{value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ height: 1, background: "rgba(14,26,43,0.08)", marginBottom: 14 }} />

                <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: B.light, marginBottom: 6 }}>Primary Structural Constraint</div>
                <div style={{ fontSize: 14, color: B.navy, fontWeight: 600, marginBottom: 4 }}>Income Persistence</div>
                <div style={{ fontSize: 11, color: B.muted, lineHeight: 1.7 }}>Most income requires ongoing active effort to generate. When active work pauses, income pauses with it.</div>
              </div>

              {/* Fade-to-white overlay */}
              <div style={{ position: "absolute", bottom: 0, left: -20, right: -20, height: "70%", background: "linear-gradient(transparent 0%, rgba(255,255,255,0.5) 30%, #ffffff 100%)", pointerEvents: "none" }} />
            </div>

            {/* Subtle locked hint — no CTA */}
            <div style={{ textAlign: "center", paddingTop: 8 }}>
              <p style={{ fontSize: 12, color: B.light, fontStyle: "italic" }}>
                {t.sampleReport.page3Locked}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Page 4 — Improvement Path & Governance                      */}
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
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
          }}
        >
          {/* Page 4 — Locked */}
          <div
            ref={page4Anim.ref}
            style={{
              marginBottom: mobile ? 28 : 40,
              opacity: page4Anim.visible ? 1 : 0,
              transform: page4Anim.visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 600ms ease, transform 600ms ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>4</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {t.sampleReport.agencyTag}
              </div>
            </div>
            <h2 style={{ fontSize: mobile ? 24 : 32, fontWeight: 700, color: B.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>
              {t.sampleReport.page4Title}
            </h2>
            <p style={{ fontSize: mobile ? 14 : 16, color: B.muted, lineHeight: 1.75, maxWidth: 600 }}>
              {t.sampleReport.page4Desc}
            </p>
          </div>

          {/* Locked report card */}
          <div
            style={{
              position: "relative",
              background: "#FFFFFF",
              borderRadius: 18,
              border: "1px solid rgba(14,26,43,0.08)",
              padding: mobile ? "28px 24px 32px" : "40px 44px 48px",
              boxShadow: "0 24px 80px rgba(14,26,43,0.08), 0 4px 16px rgba(14,26,43,0.03)",
              overflow: "hidden",
              minHeight: 280,
              opacity: page4Anim.visible ? 1 : 0,
              transform: page4Anim.visible ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 700ms ease 200ms, transform 700ms ease 200ms",
            }}
          >
            {/* Blurred preview content — mirrors actual Page 4 structure */}
            <div style={{ filter: "blur(5px)", opacity: 0.35, pointerEvents: "none", userSelect: "none" }}>
              {/* Header bar */}
              <div style={{ height: 3, borderRadius: 6, background: B.gradient, marginBottom: 16 }} />

              {/* Primary Constraint */}
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: B.light, marginBottom: 6 }}>Primary Structural Constraint</div>
              <div style={{ fontSize: 14, color: B.navy, fontWeight: 600, marginBottom: 4 }}>Income Persistence</div>
              <div style={{ fontSize: 11, color: B.muted, lineHeight: 1.7, marginBottom: 6 }}>Most income requires ongoing active effort to generate. When active work pauses, income pauses with it.</div>
              <div style={{ fontSize: 11, color: B.muted, lineHeight: 1.7, marginBottom: 16 }}>Without structural changes, a 90-day work stoppage would result in significant income disruption.</div>
              <div style={{ height: 1, background: "rgba(14,26,43,0.08)", marginBottom: 14 }} />

              {/* Improvement Opportunities */}
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: B.light, marginBottom: 6 }}>Improvement Opportunities</div>
              <div style={{ fontSize: 11, color: B.muted, lineHeight: 1.7, marginBottom: 12 }}>Shifting 10–15% of income from project-based to recurring service agreements would improve persistence scores.</div>

              {/* 90-Day Action Plan */}
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: B.light, marginBottom: 6 }}>90-Day Action Plan</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: B.navy }}>1. Convert two existing project clients to monthly retainer agreements.</div>
                <div style={{ fontSize: 11, color: B.navy }}>2. Package one repeatable service as a subscription offering.</div>
                <div style={{ fontSize: 11, color: B.navy }}>3. Establish 90-day forward pipeline visibility through advance booking.</div>
              </div>
              <div style={{ height: 1, background: "rgba(14,26,43,0.08)", marginBottom: 14 }} />

              {/* Evolution Path */}
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: B.light, marginBottom: 6 }}>Sector Evolution Path</div>
              <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                {["Project-Based", "Retainer Mix", "Recurring Core", "Subscription-Led"].map((s, i) => (
                  <span key={s} style={{ fontSize: 9, padding: "3px 8px", borderRadius: 4, background: i === 1 ? B.navy : B.sand, color: i === 1 ? "#fff" : B.light }}>{s}</span>
                ))}
              </div>
              <div style={{ height: 1, background: "rgba(14,26,43,0.08)", marginBottom: 14 }} />

              {/* Official Record */}
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: B.light, marginBottom: 6 }}>Official Classification Record</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ fontSize: 10, color: B.muted }}>Record ID: a7e2f1b3-94c1-4d8e-b2f6-...</div>
                <div style={{ fontSize: 10, color: B.muted }}>Model: RP-1.0 | Score: 78 — Established Stability</div>
                <div style={{ fontSize: 10, color: B.muted }}>Auth Code: RPAC-7E2F-1B3A | Registry: Publicly Listed</div>
              </div>
            </div>

            {/* Lock overlay with CTA */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(2px)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: B.navy, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
                {t.sampleReport.fullReportLabel}
              </div>
              <p style={{ fontSize: 15, color: B.muted, textAlign: "center", maxWidth: 360, lineHeight: 1.6, marginBottom: 24 }}>
                {t.sampleReport.fullReportDesc}
              </p>
              <Link
                href="/pricing"
                className="cta-tick inline-flex items-center justify-center font-semibold"
                style={{
                  height: 52,
                  paddingLeft: 28,
                  paddingRight: 28,
                  borderRadius: 12,
                  background: B.purple,
                  color: "#FFFFFF",
                  fontSize: 15,
                  letterSpacing: "-0.01em",
                  border: "none",
                  boxShadow: "0 6px 16px rgba(75,63,174,0.25)",
                  transition: "background 180ms ease, transform 180ms ease",
                  width: mobile ? "90%" : "auto",
                  maxWidth: mobile ? 320 : undefined,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#3D33A0";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = B.purple;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span className="tick tick-white" />
                <span className="cta-label">{t.sampleReport.fullReportCta}</span>
                <span className="cta-arrow cta-arrow-white" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  New Features Preview — what the full report includes        */}
      {/* ============================================================ */}
      <section style={{ paddingTop: mobile ? 48 : 72, paddingBottom: mobile ? 48 : 72, background: "#FFFFFF" }}>
        <div className="mx-auto" style={{ maxWidth: 860, paddingLeft: mobile ? 24 : 40, paddingRight: mobile ? 24 : 40 }}>
          <div style={{ textAlign: "center", marginBottom: mobile ? 40 : 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
              Beyond the Score
            </div>
            <h2 style={{ fontSize: mobile ? 24 : 32, fontWeight: 700, color: B.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>
              Every Report Also Includes
            </h2>
            <p style={{ fontSize: mobile ? 14 : 16, color: B.muted, lineHeight: 1.75, maxWidth: 560, margin: "0 auto" }}>
              Actionable tools designed for advisors, clients, and decision-makers — not just a score.
            </p>
          </div>

          {/* Feature grid */}
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr", gap: 20 }}>
            {/* Risk Scenario */}
            <div style={{ borderRadius: 14, border: "1px solid rgba(14,26,43,0.06)", padding: "24px 20px", background: "#FFFFFF" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: B.teal, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>Risk Scenario</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: B.navy }}>{SAMPLE.score}</span>
                <span style={{ fontSize: 14, color: B.light }}>&rarr;</span>
                <span style={{ fontSize: 28, fontWeight: 700, color: "#DC2626" }}>{SAMPLE.riskScenarioScore}</span>
              </div>
              <p style={{ fontSize: 11, color: B.muted, lineHeight: 1.6 }}>
                Shows what happens if your largest income source is lost. Quantifies concentration risk.
              </p>
            </div>

            {/* Advisor Discussion Guide */}
            <div style={{ borderRadius: 14, border: "1px solid rgba(14,26,43,0.06)", padding: "24px 20px", background: "#FFFFFF" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: B.purple, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>Advisor Discussion Guide</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
                {SAMPLE.advisorTalkingPoints.slice(0, 2).map((tp, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: B.teal, flexShrink: 0 }}>{i + 1}.</span>
                    <span style={{ fontSize: 10, color: B.muted, lineHeight: 1.5 }}>{tp.slice(0, 80)}…</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: B.muted, lineHeight: 1.6 }}>
                Structured talking points, client questions, and red flags for the advisor-client meeting.
              </p>
            </div>

            {/* Service Recommendations */}
            <div style={{ borderRadius: 14, border: "1px solid rgba(14,26,43,0.06)", padding: "24px 20px", background: "#FFFFFF" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: B.navy, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>Service Recommendations</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
                {SAMPLE.productRecs.map((rec, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, color: B.navy, fontWeight: 500 }}>{rec.category}</span>
                    <span style={{ fontSize: 8, fontWeight: 600, padding: "2px 6px", borderRadius: 3, backgroundColor: rec.urgency === "High" ? B.teal : B.light, color: "#fff" }}>{rec.urgency}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: B.muted, lineHeight: 1.6 }}>
                Product and service categories ranked by urgency based on the structural assessment.
              </p>
            </div>
          </div>

          {/* Additional features row */}
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr", gap: 20, marginTop: 20 }}>
            {[
              { icon: "📊", title: "Structural Radar Chart", desc: "SVG visualization of all 6 factors showing the shape of your income structure at a glance." },
              { icon: "📋", title: "Client Action Summary", desc: "One-page tearsheet with score, top 3 actions, and QR verification — designed to share." },
              { icon: "🔐", title: "QR-Verified Record", desc: "Every report includes a QR code linking to instant verification of the official assessment record." },
            ].map((feat) => (
              <div key={feat.title} style={{ borderRadius: 14, border: "1px solid rgba(14,26,43,0.06)", padding: "20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{feat.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: B.navy, marginBottom: 4 }}>{feat.title}</div>
                  <p style={{ fontSize: 11, color: B.muted, lineHeight: 1.6, margin: 0 }}>{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom brand strip */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: B.gradient,
          paddingTop: mobile ? 56 : 80,
          paddingBottom: mobile ? 56 : 80,
        }}
      >
        {/* Concentric halos */}
        {[140, 240, 360].map((size, i) => (
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

        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ fontSize: mobile ? 22 : 28, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: 8 }}>
            RunPayway&trade;
          </div>
          <div style={{ fontSize: mobile ? 14 : 16, color: "rgba(255,255,255,0.60)", marginBottom: 20 }}>
            {t.sampleReport.closingSubtitle}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.30)", letterSpacing: "0.02em" }}>
            {t.sampleReport.poweredBy}
          </div>
        </div>
      </section>
    </div>
  );
}
