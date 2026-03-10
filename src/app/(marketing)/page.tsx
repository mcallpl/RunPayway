"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  sandDk: "#EDE9E0",
  muted: "#6B7280",
  light: "#9CA3AF",
};

const INDUSTRY_EXAMPLES = [
  {
    industry: "Consulting / Professional Services",
    stable: [
      "multiple income sources",
      "recurring revenue",
      "forward income commitments",
      "income beyond personal labor",
    ],
    unstable: [
      "reliance on a single source",
      "one-time transactions",
      "unpredictable revenue cycles",
    ],
  },
  {
    industry: "Healthcare (Private Practice)",
    stable: [
      "multiple income sources",
      "recurring revenue",
      "forward income commitments",
      "income beyond personal labor",
    ],
    unstable: [
      "reliance on a single source",
      "one-time transactions",
      "unpredictable revenue cycles",
    ],
  },
  {
    industry: "Small Business / Agency Owners",
    stable: [
      "multiple income sources",
      "recurring revenue",
      "forward income commitments",
      "income beyond personal labor",
    ],
    unstable: [
      "reliance on a single source",
      "one-time transactions",
      "unpredictable revenue cycles",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* SECTION ANCHOR — cognitive navigation label                          */
/* ------------------------------------------------------------------ */
function SectionAnchor({ label }: { label: string }) {
  return (
    <div
      className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] mb-4 sm:mb-6"
      style={{ color: B.teal }}
    >
      {label}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EXAMPLE DIAGNOSTIC OUTPUT — floating diagnostic panel               */
/* ------------------------------------------------------------------ */
function ExampleDiagnosticOutput() {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: "#FFFEFA",
        boxShadow: "0 8px 40px rgba(14, 26, 43, 0.08), 0 2px 12px rgba(14, 26, 43, 0.04)",
        border: `1px solid ${B.sandDk}`,
      }}
    >
      {/* Report header */}
      <div className="px-5 sm:px-8 pt-5 sm:pt-8 pb-4 border-b" style={{ borderColor: B.sandDk }}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold tracking-[0.1em]" style={{ color: B.navy }}>RUNPAYWAY™</span>
          <span className="text-[10px]" style={{ color: B.light }}>Model RP-1.0</span>
        </div>
      </div>

      <div className="px-5 sm:px-8 py-5 sm:py-8">
        {/* Score */}
        <div className="mb-6">
          <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: B.teal }}>
            Income Stability Score™
          </div>
          <div className="text-[42px] sm:text-[56px] font-semibold leading-none" style={{ color: B.navy }}>72</div>
        </div>

        {/* Classification */}
        <div className="mb-6">
          <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: B.light }}>
            Classification
          </div>
          <div className="text-[15px] sm:text-[16px] font-medium" style={{ color: B.navy }}>Established Stability</div>
        </div>

        {/* Primary Constraint */}
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: B.sand }}>
          <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: B.light }}>
            Primary Structural Constraint
          </div>
          <div className="text-[14px] font-medium" style={{ color: B.navy }}>Revenue Concentration</div>
        </div>

        {/* Drivers */}
        <div className="mb-6">
          <div className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: B.light }}>
            Structural Drivers
          </div>
          <div className="space-y-2">
            {["Income variability", "Income source count", "Income concentration", "Recurring revenue base"].map((d) => (
              <div key={d} className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: B.teal }} />
                <span className="text-[13px]" style={{ color: B.muted }}>{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Percentile */}
        <div className="pt-5 border-t" style={{ borderColor: B.sandDk }}>
          <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: B.light }}>
            Industry Percentile
          </div>
          <div className="text-[20px] sm:text-[24px] font-semibold" style={{ color: B.navy }}>68th percentile</div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MODEL FRAMEWORK AUTHORITY BAND                                       */
/* ------------------------------------------------------------------ */
function ModelFrameworkBand() {
  return (
    <section style={{ backgroundColor: B.navy }}>
      <div className="max-w-[1100px] mx-auto px-5 sm:px-6 py-5 sm:py-0 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 sm:gap-0" style={{ minHeight: 80 }}>
        {/* Left zone */}
        <div className="text-center sm:text-left">
          <div className="text-[9px] font-semibold uppercase tracking-[0.14em]" style={{ color: "rgba(255,255,255,0.40)" }}>
            RUNPAYWAY™
          </div>
          <div className="text-[13px] sm:text-[14px] font-semibold tracking-wide" style={{ color: "rgba(255,255,255,0.92)" }}>
            Model Framework
          </div>
        </div>

        {/* Separator */}
        <div className="hidden sm:block h-10" style={{ width: 1, backgroundColor: "rgba(255,255,255,0.10)" }} />

        {/* Center zone */}
        <div className="text-center">
          <div className="text-[13px] sm:text-[14px] font-medium" style={{ color: "rgba(255,255,255,0.88)" }}>
            Income Stability Score™
          </div>
          <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.40)" }}>
            Structural Income Diagnostic
          </div>
        </div>

        {/* Separator */}
        <div className="hidden sm:block h-10" style={{ width: 1, backgroundColor: "rgba(255,255,255,0.10)" }} />

        {/* Right zone */}
        <div className="text-center sm:text-right">
          <div className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.88)" }}>
            Model RP-1.0
          </div>
          <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.40)" }}>
            Registry Status: Active
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* MAIN LANDING PAGE                                                    */
/* ------------------------------------------------------------------ */
export default function LandingPage() {
  const [activeIndustry, setActiveIndustry] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndustry((prev) => (prev + 1) % INDUSTRY_EXAMPLES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const example = INDUSTRY_EXAMPLES[activeIndustry];

  return (
    <div className="overflow-x-hidden">

      {/* ============ 1. HERO ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6 pt-10 sm:pt-[72px] pb-14 sm:pb-24">
        <div style={{ maxWidth: 680 }}>
          <h1 className="text-[32px] sm:text-[44px] md:text-[56px] font-semibold leading-[1.08] mb-6" style={{ color: B.navy }}>
            The Standard for Measuring Income Stability
          </h1>
          <p className="text-base leading-relaxed mb-2" style={{ color: B.muted }}>
            The <strong style={{ color: B.navy }}>Income Stability Score™</strong> provides a structural determination of income stability under Model RP-1.0.
          </p>
          <p className="text-base leading-relaxed mb-8" style={{ color: B.muted }}>
            See how stable your income structure is today.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <Link
              href="/pricing"
              className="inline-flex items-center px-7 py-3.5 text-sm font-medium rounded transition-opacity hover:opacity-90"
              style={{ backgroundColor: B.navy, color: "#ffffff" }}
            >
              Get Score
            </Link>
            <div className="space-y-1">
              <p className="text-[13px]" style={{ color: B.muted }}>
                Assessment time: <strong style={{ color: B.navy }}>Under two minutes</strong>
              </p>
              <p className="text-[13px]" style={{ color: B.muted }}>
                Instant <strong style={{ color: B.navy }}>PDF assessment record</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. EXAMPLE DIAGNOSTIC OUTPUT ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6 py-14 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left — text */}
          <div className="order-2 lg:order-1">
            <SectionAnchor label="What the Report Shows" />
            <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight mb-4" style={{ color: B.navy }}>
              Example Diagnostic Output
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: B.muted }}>
              Each diagnostic generates an official PDF assessment record.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center px-7 py-3.5 text-sm font-medium rounded transition-opacity hover:opacity-90"
              style={{ backgroundColor: B.navy, color: "#ffffff" }}
            >
              Get Your Score
            </Link>
          </div>
          {/* Right — diagnostic card */}
          <div className="order-1 lg:order-2">
            <ExampleDiagnosticOutput />
          </div>
        </div>
      </section>

      {/* ============ 3. WHAT RUNPAYWAY MEASURES ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6 py-14 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left — visual: six factors */}
          <div>
            <div className="rounded-lg border p-5 sm:p-8" style={{ borderColor: B.sandDk, backgroundColor: "#ffffff" }}>
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-4" style={{ color: B.light }}>
                Six Structural Factors
              </div>
              <div className="space-y-3">
                {[
                  "Recurring income proportion",
                  "Income concentration",
                  "Number of income sources",
                  "Forward revenue visibility",
                  "Earnings variability",
                  "Income continuity without active labor",
                ].map((factor, i) => (
                  <div key={factor} className="flex items-center gap-3">
                    <span
                      className="w-6 h-6 rounded flex items-center justify-center text-[11px] font-semibold shrink-0"
                      style={{ backgroundColor: B.sand, color: B.navy }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-[13px] sm:text-[14px]" style={{ color: B.muted }}>{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Right — text */}
          <div>
            <SectionAnchor label="The Measurement" />
            <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight mb-6" style={{ color: B.navy }}>
              What RunPayway Measures
            </h2>
            <div className="space-y-5 text-base leading-relaxed" style={{ color: B.muted }}>
              <p>Most people judge income by how much they earn.</p>
              <p>RunPayway measures <strong style={{ color: B.navy }}>how stable that income actually is</strong>.</p>
              <p>Two people can earn the same income and still have very different levels of stability.</p>
              <p>RunPayway evaluates income sources, concentration, and continuity to determine the <strong style={{ color: B.navy }}>Income Stability Score™</strong>.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ AUTHORITY BAND ============ */}
      <ModelFrameworkBand />

      {/* ============ 4. THREE DRIVERS ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6 py-14 sm:py-24">
        <SectionAnchor label="How Stability Is Determined" />
        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight mb-4" style={{ color: B.navy }}>
          The Three Drivers of Income Stability
        </h2>
        <p className="text-base leading-relaxed mb-10" style={{ color: B.muted }}>
          RunPayway evaluates income stability through three structural drivers.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: "Structure", desc: "How income is sourced and organized." },
            { title: "Concentration", desc: "How dependent income is on a small number of sources." },
            { title: "Continuity", desc: "How reliably income continues over time." },
          ].map((d) => (
            <div key={d.title} className="rounded-lg border p-6" style={{ borderColor: B.sandDk, backgroundColor: "#ffffff" }}>
              <div className="text-[15px] font-semibold mb-3" style={{ color: B.navy }}>{d.title}</div>
              <div className="text-[14px] leading-relaxed" style={{ color: B.muted }}>{d.desc}</div>
            </div>
          ))}
        </div>
        <p className="text-base mt-10" style={{ color: B.muted }}>
          These structural drivers determine the final <strong style={{ color: B.navy }}>Income Stability Score™</strong>.
        </p>
      </section>

      {/* ============ 5. INDUSTRY STABILITY CHARACTERISTICS ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6 py-14 sm:py-24">
        <SectionAnchor label="Industry Context" />
        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight mb-8 sm:mb-10" style={{ color: B.navy }}>
          Common Characteristics of Higher Stability Income Systems
        </h2>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {INDUSTRY_EXAMPLES.map((ex, i) => (
            <button
              key={ex.industry}
              onClick={() => setActiveIndustry(i)}
              className="text-[11px] sm:text-[12px] font-medium px-3 sm:px-4 py-2 rounded transition-all"
              style={{
                backgroundColor: i === activeIndustry ? B.navy : B.sand,
                color: i === activeIndustry ? "#ffffff" : B.muted,
              }}
            >
              {ex.industry.split(" / ")[0].split(" (")[0]}
            </button>
          ))}
        </div>

        <div className="rounded-lg border p-5 sm:p-8" style={{ borderColor: B.sandDk, backgroundColor: "#ffffff" }}>
          <div className="text-base sm:text-lg font-semibold mb-6 sm:mb-8" style={{ color: B.navy }}>
            {example.industry}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: B.teal }}>
                More Stable Systems Often Include
              </div>
              <ul className="space-y-2.5">
                {example.stable.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13px] sm:text-[14px]" style={{ color: B.muted }}>
                    <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: B.teal }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: B.light }}>
                Common Instability Factors
              </div>
              <ul className="space-y-2.5">
                {example.unstable.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13px] sm:text-[14px]" style={{ color: B.muted }}>
                    <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: B.light }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 6. CLASSIFICATION SCALE ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6 py-14 sm:py-24">
        <SectionAnchor label="How Scores Are Classified" />
        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight mb-8 sm:mb-10" style={{ color: B.navy }}>
          Income Stability Classification Scale
        </h2>
        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: B.sand }}>
          <div className="grid grid-cols-2 text-[10px] font-semibold uppercase tracking-wider px-5 sm:px-6 py-4" style={{ color: B.muted }}>
            <span>Score Range</span>
            <span>Classification</span>
          </div>
          {[
            ["0\u201339", "Limited Stability"],
            ["40\u201359", "Developing Stability"],
            ["60\u201379", "Established Stability"],
            ["80\u2013100", "High Stability"],
          ].map(([range, label], i) => (
            <div
              key={range}
              className="grid grid-cols-2 px-5 sm:px-6 py-4 text-[14px] sm:text-[15px]"
              style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : B.sand }}
            >
              <span className="font-semibold" style={{ color: B.navy }}>{range}</span>
              <span style={{ color: B.muted }}>{label}</span>
            </div>
          ))}
        </div>
        <p className="text-[13px] mt-5" style={{ color: B.light }}>
          The classification reflects income structure at the time the assessment is completed under Model RP-1.0.
        </p>
      </section>

      {/* ============ 7. FINAL CTA ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6 py-14 sm:py-24">
        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight mb-4" style={{ color: B.navy }}>
          Measure how stable your income structure is today.
        </h2>
        <p className="text-base mb-8" style={{ color: B.muted }}>
          Assessment time: <strong style={{ color: B.navy }}>under two minutes</strong>
        </p>
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <Link
            href="/pricing"
            className="inline-flex items-center px-7 py-3.5 text-sm font-medium rounded transition-opacity hover:opacity-90"
            style={{ backgroundColor: B.navy, color: "#ffffff" }}
          >
            Get Score
          </Link>
          <p className="text-[13px]" style={{ color: B.muted }}>
            Instant <strong style={{ color: B.navy }}>PDF assessment record</strong>
          </p>
        </div>
      </section>

      {/* ============ 8. MODEL GOVERNANCE ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6 pt-14 sm:pt-24 pb-10 sm:pb-[72px]">
        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight mb-6" style={{ color: B.navy }}>
          Model Governance
        </h2>
        <div className="space-y-4 text-base leading-relaxed" style={{ color: B.muted, maxWidth: 680 }}>
          <p>The <strong style={{ color: B.navy }}>Income Stability Score™</strong> is generated under <strong style={{ color: B.navy }}>Model RP-1.0</strong> using fixed scoring criteria.</p>
          <p>If the methodology changes, a <strong style={{ color: B.navy }}>new model version</strong> is issued.</p>
          <p>Previous assessments remain tied to the model version used when they were generated.</p>
        </div>
      </section>

      {/* ============ DISCLAIMER ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6 pt-8 sm:pt-12 pb-10 sm:pb-[72px]">
        <p className="text-[13px] leading-relaxed" style={{ color: B.light }}>
          The Income Stability Score™ is a structural income assessment based on information provided by the user. It does not provide financial advice and does not predict future financial outcomes.
        </p>
      </section>
    </div>
  );
}
