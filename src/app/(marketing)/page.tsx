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
      "multiple active clients",
      "recurring retainers",
      "scheduled future work",
      "renewable service agreements",
    ],
    unstable: [
      "dependence on one major client",
      "one-off project income",
      "limited future pipeline visibility",
    ],
  },
  {
    industry: "Healthcare (Private Practice)",
    stable: [
      "recurring patient visits",
      "ongoing treatment programs",
      "multiple service lines",
      "team-based care delivery",
    ],
    unstable: [
      "dependence on a small number of procedures",
      "revenue tied only to the provider\u2019s schedule",
    ],
  },
  {
    industry: "Small Business / Agency Owners",
    stable: [
      "recurring customer relationships",
      "subscription or service contracts",
      "diversified revenue sources",
    ],
    unstable: [
      "dependence on a few major customers",
      "project-based revenue cycles",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* HERO REPORT PREVIEW — dimensional tilted document                   */
/* ------------------------------------------------------------------ */
function HeroReportPreview() {
  return (
    <div className="relative mx-auto" style={{ maxWidth: 420, perspective: "1200px" }}>
      {/* Background document layers */}
      <div
        className="absolute rounded-lg"
        style={{
          width: "100%", height: "100%",
          top: 12, left: 6,
          backgroundColor: "#EDEAE4",
          transform: "rotateY(-4deg) rotateX(2deg)",
          opacity: 0.4,
          border: "1px solid #E5E2DC",
        }}
      />
      <div
        className="absolute rounded-lg"
        style={{
          width: "100%", height: "100%",
          top: 6, left: 3,
          backgroundColor: "#F0EDE7",
          transform: "rotateY(-3deg) rotateX(1.5deg)",
          opacity: 0.6,
          border: "1px solid #E8E5DF",
        }}
      />

      {/* Main document */}
      <div
        className="relative rounded-lg border p-6 sm:p-8"
        style={{
          backgroundColor: "#FFFEFA",
          borderColor: "#E5E2DC",
          transform: "rotateY(-2deg) rotateX(1deg)",
          boxShadow: "8px 16px 40px rgba(14, 26, 43, 0.08), 2px 4px 12px rgba(14, 26, 43, 0.04)",
        }}
      >
        {/* Document header */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b" style={{ borderColor: B.sandDk }}>
          <span className="text-[10px] font-semibold tracking-[0.1em]" style={{ color: B.navy }}>RUNPAYWAY™</span>
          <span className="text-[9px]" style={{ color: B.light }}>Model RP-1.0</span>
        </div>

        {/* Score module */}
        <div className="mb-6">
          <div className="text-[9px] font-semibold uppercase tracking-wider mb-1" style={{ color: B.light }}>
            Your Score
          </div>
          <div className="text-[52px] font-semibold leading-none" style={{ color: B.navy }}>72</div>
          <div className="flex items-center gap-2 mt-2">
            <span
              className="text-[10px] font-semibold px-2.5 py-1 rounded"
              style={{ backgroundColor: B.purple, color: "#ffffff" }}
            >
              Stable
            </span>
            <span className="text-[10px]" style={{ color: B.teal }}>+4 vs last quarter</span>
          </div>
        </div>

        {/* Band classification */}
        <div className="grid grid-cols-4 gap-1 mb-6">
          {[
            { label: "Weak", active: false },
            { label: "Limited", active: false },
            { label: "Stable", active: true },
            { label: "Elite", active: false },
          ].map((band) => (
            <div
              key={band.label}
              className="text-center py-2 rounded text-[9px] font-medium"
              style={{
                backgroundColor: band.active ? B.purple : B.sand,
                color: band.active ? "#ffffff" : B.light,
              }}
            >
              {band.label}
            </div>
          ))}
        </div>

        {/* Structural Drivers */}
        <div className="mb-5">
          <div className="text-[9px] font-semibold uppercase tracking-wider mb-2" style={{ color: B.light }}>
            Structural Drivers
          </div>
          <div className="space-y-1.5">
            {["Income variability", "Income source count", "Income concentration", "Recurring revenue base"].map((d) => (
              <div key={d} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: B.teal }} />
                <span className="text-[11px]" style={{ color: B.muted }}>{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Constraint */}
        <div className="mb-5 p-3 rounded" style={{ backgroundColor: B.sand }}>
          <div className="text-[9px] font-semibold uppercase tracking-wider mb-1" style={{ color: B.light }}>
            Primary Structural Constraint
          </div>
          <div className="text-[12px] font-medium" style={{ color: B.navy }}>Revenue concentration</div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: B.sandDk }}>
          <div>
            <div className="text-[9px]" style={{ color: B.light }}>Industry Percentile</div>
            <div className="text-[14px] font-semibold" style={{ color: B.navy }}>68th percentile</div>
          </div>
          <div className="flex items-center gap-1">
            {["Weak", "Limited", "Stable", "Elite"].map((b, i) => (
              <div
                key={b}
                className="w-8 h-1.5 rounded-full"
                style={{ backgroundColor: i <= 2 ? B.teal : B.sandDk }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PREMIUM REPORT PREVIEW — full diagnostic board                      */
/* ------------------------------------------------------------------ */
function PremiumReportPreview() {
  return (
    <div className="rounded-lg border overflow-hidden" style={{ borderColor: B.sandDk, backgroundColor: "#ffffff" }}>
      {/* Report header */}
      <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 border-b" style={{ borderColor: B.sandDk }}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold tracking-[0.1em]" style={{ color: B.navy }}>RUNPAYWAY™</span>
          <span className="text-[10px]" style={{ color: B.light }}>Income Stability Assessment · Model RP-1.0</span>
        </div>
      </div>

      <div className="px-6 sm:px-8 py-6 sm:py-8">
        {/* Score + Classification row */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-12 mb-8">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: B.teal }}>
              Income Stability Score™
            </div>
            <div className="text-[60px] font-semibold leading-none" style={{ color: B.navy }}>72</div>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: "Limited", range: "0\u201339", active: false },
                { label: "Developing", range: "40\u201359", active: false },
                { label: "Established", range: "60\u201379", active: true },
                { label: "High", range: "80\u2013100", active: false },
              ].map((band) => (
                <div
                  key={band.label}
                  className="text-center py-3 rounded-lg"
                  style={{
                    backgroundColor: band.active ? B.purple : B.sand,
                    color: band.active ? "#ffffff" : B.light,
                  }}
                >
                  <div className="text-[11px] font-semibold">{band.label}</div>
                  <div className="text-[9px] mt-0.5 opacity-80">{band.range}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drivers + Constraint row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: B.light }}>
              Structural Drivers
            </div>
            <div className="space-y-2">
              {["Income variability", "Income source count", "Income concentration", "Recurring revenue base"].map((d) => (
                <div key={d} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: B.teal }} />
                  <span className="text-[13px]" style={{ color: B.muted }}>{d}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: B.light }}>
              Primary Structural Constraint
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: B.sand }}>
              <div className="text-[14px] font-medium" style={{ color: B.navy }}>Revenue concentration</div>
              <div className="text-[11px] mt-1" style={{ color: B.muted }}>
                High dependence on a single income source
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row — Percentile + Trend */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t" style={{ borderColor: B.sandDk }}>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: B.light }}>
              Industry Percentile
            </div>
            <div className="text-[24px] font-semibold" style={{ color: B.navy }}>68th percentile</div>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center gap-2">
              {["Limited", "Developing", "Established", "High"].map((b, i) => (
                <div
                  key={b}
                  className="h-2 rounded-full"
                  style={{
                    width: 40,
                    backgroundColor: i <= 2 ? B.teal : B.sandDk,
                  }}
                />
              ))}
            </div>
            <div className="text-[10px] mt-1.5 text-right" style={{ color: B.teal }}>+4 vs previous period</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MAIN LANDING PAGE — single-column narrative                         */
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
    <div className="max-w-[1100px] mx-auto px-6">

      {/* ============ HERO ============ */}
      <section style={{ paddingTop: 72, paddingBottom: 96 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <div>
            <h1 className="font-semibold leading-[1.08] mb-4" style={{ color: B.navy, fontSize: 56 }}>
              The Standard for Measuring Income Stability
            </h1>
            {/* Institutional descriptor */}
            <div className="mb-8 pb-4 border-b" style={{ borderColor: B.sandDk }}>
              <div className="text-[13px] font-medium" style={{ color: B.purple }}>Income Stability Score™</div>
              <div className="text-[13px]" style={{ color: B.light }}>Structural Income Diagnostic</div>
              <div className="text-[13px]" style={{ color: B.light }}>Model RP-1.0 | Version 1.0</div>
            </div>
            <p className="text-base leading-relaxed mb-2" style={{ color: B.muted }}>
              The <strong style={{ color: B.navy }}>Income Stability Score™</strong> determines the structural stability of income under Model RP-1.0.
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

          {/* Right — report preview */}
          <div className="hidden lg:block">
            <HeroReportPreview />
          </div>
        </div>
      </section>

      {/* ============ STRUCTURAL ASSESSMENT OVERVIEW ============ */}
      <section style={{ paddingTop: 96, paddingBottom: 96 }}>
        <h2 className="font-semibold leading-tight mb-10" style={{ color: B.navy, fontSize: 34 }}>
          Structural Assessment Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              label: "Assessment",
              title: "6 Structural Income Factors",
              desc: "Measures how income behaves over time",
            },
            {
              label: "Result",
              title: "Income Stability Score™ (0\u2013100)",
              desc: "Stability classification",
            },
            {
              label: "Delivery",
              title: "Instant PDF Assessment Record",
              desc: "Download + email copy",
            },
          ].map((card) => (
            <div key={card.label} className="rounded-lg border p-6" style={{ borderColor: B.sandDk, backgroundColor: "#ffffff" }}>
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: B.light }}>
                {card.label}
              </div>
              <div className="text-[15px] font-medium mb-2" style={{ color: B.navy }}>{card.title}</div>
              <div className="text-[13px]" style={{ color: B.muted }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ WHY INCOME STABILITY MATTERS ============ */}
      <section style={{ paddingTop: 96, paddingBottom: 96 }}>
        <h2 className="font-semibold leading-tight mb-10" style={{ color: B.navy, fontSize: 34 }}>
          Why Income Stability Matters
        </h2>
        <div className="space-y-5 text-base leading-relaxed" style={{ color: B.muted, maxWidth: 680 }}>
          <p>Income stability is not determined only by how much someone earns.</p>
          <p>It depends on <strong style={{ color: B.navy }}>how income is structured</strong>.</p>
          <p>Two people can earn the same income but have very different levels of stability depending on:</p>
          <ul className="space-y-3 pl-1">
            {[
              "how many income sources exist",
              "whether revenue renews automatically",
              "how concentrated income sources are",
              "how reliably income continues over time",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: B.teal }} />
                {item}
              </li>
            ))}
          </ul>
          <p>RunPayway evaluates these structural characteristics to determine the <strong style={{ color: B.navy }}>Income Stability Score™</strong>.</p>
        </div>
      </section>

      {/* ============ THREE DRIVERS ============ */}
      <section style={{ paddingTop: 96, paddingBottom: 96 }}>
        <h2 className="font-semibold leading-tight mb-4" style={{ color: B.navy, fontSize: 34 }}>
          The Three Drivers of Income Stability
        </h2>
        <p className="text-base leading-relaxed mb-10" style={{ color: B.muted }}>
          RunPayway evaluates income stability through three structural dimensions.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: "Structure", desc: "How income is organized", detail: "Multiple sources increase stability" },
            { title: "Concentration", desc: "Dependence on few sources", detail: "High concentration increases risk" },
            { title: "Continuity", desc: "How reliably income continues", detail: "Recurring income increases reliability" },
          ].map((d) => (
            <div key={d.title} className="rounded-lg border p-6" style={{ borderColor: B.sandDk, backgroundColor: "#ffffff" }}>
              <div className="text-[15px] font-semibold mb-3" style={{ color: B.navy }}>{d.title}</div>
              <div className="text-[14px] mb-3" style={{ color: B.muted }}>{d.desc}</div>
              <div className="text-[12px]" style={{ color: B.light }}>{d.detail}</div>
            </div>
          ))}
        </div>
        <p className="text-base mt-10" style={{ color: B.muted }}>
          These dimensions determine the <strong style={{ color: B.navy }}>Income Stability Score™</strong>.
        </p>
      </section>

      {/* ============ PREMIUM REPORT PREVIEW ============ */}
      <section style={{ paddingTop: 96, paddingBottom: 96 }}>
        <PremiumReportPreview />
      </section>

      {/* ============ INDUSTRY EXAMPLES ============ */}
      <section style={{ paddingTop: 96, paddingBottom: 96 }}>
        <h2 className="font-semibold leading-tight mb-4" style={{ color: B.navy, fontSize: 34 }}>
          Common Characteristics of Higher Stability Income Systems
        </h2>
        <p className="text-base leading-relaxed mb-2" style={{ color: B.muted }}>
          Income stability patterns vary across industries.
        </p>
        <p className="text-base leading-relaxed mb-4" style={{ color: B.muted }}>
          Examples of structural characteristics commonly found in stronger income systems.
        </p>
        <p className="text-[12px] mb-10" style={{ color: B.light }}>
          (Industry examples rotate automatically)
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {INDUSTRY_EXAMPLES.map((ex, i) => (
            <button
              key={ex.industry}
              onClick={() => setActiveIndustry(i)}
              className="text-[12px] font-medium px-4 py-2 rounded transition-all"
              style={{
                backgroundColor: i === activeIndustry ? B.navy : B.sand,
                color: i === activeIndustry ? "#ffffff" : B.muted,
              }}
            >
              {ex.industry.split(" / ")[0].split(" (")[0]}
            </button>
          ))}
        </div>

        <div className="rounded-lg border p-6 sm:p-8" style={{ borderColor: B.sandDk, backgroundColor: "#ffffff" }}>
          <div className="text-lg font-semibold mb-8" style={{ color: B.navy }}>
            {example.industry}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: B.teal }}>
                More Stable Systems Often Include
              </div>
              <ul className="space-y-2.5">
                {example.stable.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px]" style={{ color: B.muted }}>
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
                  <li key={item} className="flex items-start gap-2.5 text-[14px]" style={{ color: B.muted }}>
                    <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: B.light }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CLASSIFICATION SCALE ============ */}
      <section style={{ paddingTop: 96, paddingBottom: 96 }}>
        <h2 className="font-semibold leading-tight mb-10" style={{ color: B.navy, fontSize: 34 }}>
          Income Stability Classification Scale
        </h2>
        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: B.sand }}>
          <div className="grid grid-cols-2 text-[10px] font-semibold uppercase tracking-wider px-6 py-4" style={{ color: B.muted }}>
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
              className="grid grid-cols-2 px-6 py-4 text-[15px]"
              style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : B.sand }}
            >
              <span className="font-semibold" style={{ color: B.navy }}>{range}</span>
              <span style={{ color: B.muted }}>{label}</span>
            </div>
          ))}
        </div>
        <p className="text-[13px] mt-5" style={{ color: B.light }}>
          The classification reflects income structure at the time of assessment under Model RP-1.0.
        </p>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section style={{ paddingTop: 96, paddingBottom: 96 }}>
        <h2 className="font-semibold leading-tight mb-4" style={{ color: B.navy, fontSize: 34 }}>
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

      {/* ============ MODEL GOVERNANCE ============ */}
      <section style={{ paddingTop: 96, paddingBottom: 72 }}>
        <h2 className="font-semibold leading-tight mb-6" style={{ color: B.navy, fontSize: 34 }}>
          Model Governance
        </h2>
        <div className="space-y-4 text-base leading-relaxed" style={{ color: B.muted, maxWidth: 680 }}>
          <p>The <strong style={{ color: B.navy }}>Income Stability Score™</strong> is generated under <strong style={{ color: B.navy }}>Model RP-1.0</strong> using fixed scoring criteria.</p>
          <p>If the methodology changes, a <strong style={{ color: B.navy }}>new model version</strong> is issued.</p>
          <p>Previous assessments remain tied to the version used when they were generated.</p>
        </div>
      </section>

      {/* ============ DISCLAIMER ============ */}
      <section style={{ paddingTop: 48, paddingBottom: 72 }}>
        <p className="text-[13px] leading-relaxed" style={{ color: B.light }}>
          The Income Stability Score™ is a structural income assessment based on information provided by the user. It does not provide financial advice and does not predict future financial outcomes.
        </p>
      </section>
    </div>
  );
}
