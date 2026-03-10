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

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`py-16 md:py-24 ${className}`}>{children}</section>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl md:text-[32px] font-semibold leading-tight mb-6" style={{ color: B.navy }}>
      {children}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/* LEFT DIAGNOSTIC RAIL                                                */
/* ------------------------------------------------------------------ */
function LeftRail() {
  return (
    <aside className="hidden lg:block w-[220px] shrink-0">
      <div className="sticky top-8 space-y-8">
        {/* Assessment Nav */}
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-3" style={{ color: B.light }}>
            Assessment
          </div>
          <div className="space-y-2">
            {[
              ["/pricing", "Score"],
              ["/pricing", "Pricing"],
              ["/methodology", "Methodology"],
              ["/verify", "Registry"],
            ].map(([href, label]) => (
              <Link
                key={label}
                href={href}
                className="block text-[13px] font-medium hover:opacity-70 transition-opacity"
                style={{ color: B.muted }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Model */}
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: B.light }}>
            Model
          </div>
          <div className="text-[13px] font-medium" style={{ color: B.navy }}>RP-1.0</div>
          <div className="text-[11px]" style={{ color: B.light }}>Version 1.0</div>
        </div>

        {/* Scale */}
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-3" style={{ color: B.light }}>
            Income Stability Scale
          </div>
          <div className="space-y-1.5">
            {[
              ["0\u201339", "Limited"],
              ["40\u201359", "Developing"],
              ["60\u201379", "Established"],
              ["80\u2013100", "High"],
            ].map(([range, label]) => (
              <div key={range} className="flex items-center justify-between text-[11px]">
                <span style={{ color: B.light }}>{range}</span>
                <span className="font-medium" style={{ color: B.navy }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* RIGHT EVIDENCE PANEL                                                */
/* ------------------------------------------------------------------ */
function RightPanel() {
  return (
    <aside className="hidden lg:block w-[240px] shrink-0">
      <div className="sticky top-8">
        <div className="rounded-lg border p-5 space-y-5" style={{ borderColor: B.sandDk, backgroundColor: "#ffffff" }}>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: B.light }}>
            Example Income Stability Assessment
          </div>

          {/* Score */}
          <div>
            <div className="text-[10px]" style={{ color: B.light }}>Income Stability Score™</div>
            <div className="text-[42px] font-semibold leading-none mt-1" style={{ color: B.navy }}>21</div>
          </div>

          {/* Classification */}
          <div>
            <div className="text-[10px]" style={{ color: B.light }}>Classification</div>
            <div className="text-sm font-medium mt-0.5" style={{ color: B.navy }}>Limited Stability</div>
          </div>

          {/* Percentile */}
          <div>
            <div className="text-[10px]" style={{ color: B.light }}>Industry Percentile</div>
            <div className="text-sm font-medium mt-0.5" style={{ color: B.navy }}>11th Percentile</div>
          </div>

          {/* Constraint */}
          <div>
            <div className="text-[10px]" style={{ color: B.light }}>Primary Structural Constraint</div>
            <div className="text-sm font-medium mt-0.5" style={{ color: B.navy }}>Recurring Revenue Base</div>
          </div>

          {/* Drivers */}
          <div>
            <div className="text-[10px]" style={{ color: B.light }}>Structural Drivers</div>
            <ul className="mt-1 space-y-0.5">
              {["Earnings Variability", "Income Source Count", "Income Concentration"].map((d) => (
                <li key={d} className="text-[11px] font-medium" style={{ color: B.navy }}>{d}</li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t" style={{ borderColor: B.sandDk }}>
            <p className="text-[10px] leading-relaxed" style={{ color: B.light }}>
              Assessment delivered as a verified PDF record.
            </p>
            <p className="text-[10px] mt-2" style={{ color: B.light }}>
              Issued under Model RP-1.0
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* MAIN LANDING PAGE                                                   */
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
    <div>
      {/* Three-Zone Layout */}
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="flex gap-8">
          <LeftRail />

          {/* Primary Content Column */}
          <div className="flex-1 min-w-0 max-w-[640px] mx-auto lg:mx-0">

            {/* ============ HERO ============ */}
            <Section>
              <h1 className="text-[32px] md:text-[48px] font-semibold leading-[1.1] mb-6" style={{ color: B.navy }}>
                The Standard for Measuring Income Stability
              </h1>
              <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: B.muted }}>
                The <strong style={{ color: B.navy }}>Income Stability Score™</strong> determines
                the structural stability of income under Model RP-1.0.
              </p>
              <p className="text-base mb-8" style={{ color: B.muted }}>
                See how stable your income structure is today.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  href="/pricing"
                  className="inline-flex items-center px-6 py-3 text-sm font-medium rounded transition-opacity hover:opacity-90"
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
            </Section>

            <div className="border-t" style={{ borderColor: B.sandDk }} />

            {/* ============ STRUCTURAL ASSESSMENT OVERVIEW ============ */}
            <Section>
              <SectionTitle>Structural Assessment Overview</SectionTitle>
              <div className="rounded-lg border overflow-hidden" style={{ borderColor: B.sandDk }}>
                <div className="grid grid-cols-3 text-[10px] font-semibold uppercase tracking-wider px-4 py-3" style={{ backgroundColor: B.sand, color: B.muted }}>
                  <span>Assessment</span>
                  <span>Result</span>
                  <span>Delivery</span>
                </div>
                <div className="grid grid-cols-3 px-4 py-4 gap-y-1" style={{ backgroundColor: "#ffffff" }}>
                  <div>
                    <div className="text-[13px] font-medium" style={{ color: B.navy }}>6 Structural Income Factors</div>
                    <div className="text-[11px] mt-1" style={{ color: B.light }}>Measures how income behaves over time</div>
                  </div>
                  <div>
                    <div className="text-[13px] font-medium" style={{ color: B.navy }}>Income Stability Score™ (0–100)</div>
                    <div className="text-[11px] mt-1" style={{ color: B.light }}>Stability classification</div>
                  </div>
                  <div>
                    <div className="text-[13px] font-medium" style={{ color: B.navy }}>Instant PDF Assessment Record</div>
                    <div className="text-[11px] mt-1" style={{ color: B.light }}>Download + email copy</div>
                  </div>
                </div>
              </div>
            </Section>

            <div className="border-t" style={{ borderColor: B.sandDk }} />

            {/* ============ WHY INCOME STABILITY MATTERS ============ */}
            <Section>
              <SectionTitle>Why Income Stability Matters</SectionTitle>
              <div className="space-y-4 text-[15px] leading-relaxed" style={{ color: B.muted }}>
                <p>Income stability is not determined only by how much someone earns.</p>
                <p>
                  It depends on <strong style={{ color: B.navy }}>how income is structured</strong>.
                </p>
                <p>
                  Two people can earn the same income but have very different levels of stability depending on:
                </p>
                <ul className="space-y-2 pl-1">
                  {[
                    "how many income sources exist",
                    "whether revenue renews automatically",
                    "how concentrated income sources are",
                    "how reliably income continues over time",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: B.teal }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <p>
                  RunPayway evaluates these structural characteristics to determine
                  the <strong style={{ color: B.navy }}>Income Stability Score™</strong>.
                </p>
              </div>
            </Section>

            <div className="border-t" style={{ borderColor: B.sandDk }} />

            {/* ============ THREE DRIVERS ============ */}
            <Section>
              <SectionTitle>The Three Drivers of Income Stability</SectionTitle>
              <p className="text-[15px] leading-relaxed mb-8" style={{ color: B.muted }}>
                RunPayway evaluates income stability through three structural dimensions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    title: "Structure",
                    desc: "How income is organized",
                    detail: "Multiple sources increase stability",
                  },
                  {
                    title: "Concentration",
                    desc: "Dependence on few sources",
                    detail: "High concentration increases risk",
                  },
                  {
                    title: "Continuity",
                    desc: "How reliably income continues",
                    detail: "Recurring income increases reliability",
                  },
                ].map((d) => (
                  <div key={d.title} className="rounded-lg border p-5" style={{ borderColor: B.sandDk, backgroundColor: "#ffffff" }}>
                    <div className="text-[13px] font-semibold mb-2" style={{ color: B.navy }}>{d.title}</div>
                    <div className="text-[13px] mb-3" style={{ color: B.muted }}>{d.desc}</div>
                    <div className="text-[11px]" style={{ color: B.light }}>{d.detail}</div>
                  </div>
                ))}
              </div>
              <p className="text-[15px] mt-8" style={{ color: B.muted }}>
                These dimensions determine the <strong style={{ color: B.navy }}>Income Stability Score™</strong>.
              </p>
            </Section>

            <div className="border-t" style={{ borderColor: B.sandDk }} />

            {/* ============ EXAMPLE DIAGNOSTIC OUTPUT (mobile) ============ */}
            <Section className="lg:hidden">
              <SectionTitle>Example Diagnostic Output</SectionTitle>
              <div className="rounded-lg border p-5 space-y-4" style={{ borderColor: B.sandDk, backgroundColor: "#ffffff" }}>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: B.light }}>
                  Example Income Stability Assessment
                </div>
                <div>
                  <div className="text-[10px]" style={{ color: B.light }}>Income Stability Score™</div>
                  <div className="text-[42px] font-semibold leading-none mt-1" style={{ color: B.navy }}>21</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px]" style={{ color: B.light }}>Classification</div>
                    <div className="text-sm font-medium mt-0.5" style={{ color: B.navy }}>Limited Stability</div>
                  </div>
                  <div>
                    <div className="text-[10px]" style={{ color: B.light }}>Industry Percentile</div>
                    <div className="text-sm font-medium mt-0.5" style={{ color: B.navy }}>11th Percentile</div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px]" style={{ color: B.light }}>Primary Structural Constraint</div>
                  <div className="text-sm font-medium mt-0.5" style={{ color: B.navy }}>Recurring Revenue Base</div>
                </div>
                <div>
                  <div className="text-[10px]" style={{ color: B.light }}>Structural Drivers</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {["Earnings Variability", "Income Source Count", "Income Concentration"].map((d) => (
                      <span key={d} className="text-[11px] font-medium px-2 py-0.5 rounded" style={{ backgroundColor: B.sand, color: B.navy }}>{d}</span>
                    ))}
                  </div>
                </div>
                <p className="text-[10px]" style={{ color: B.light }}>Assessment delivered as a verified PDF record.</p>
              </div>
            </Section>

            {/* ============ INDUSTRY EXAMPLES ============ */}
            <Section>
              <SectionTitle>Common Characteristics of Higher Stability Income Systems</SectionTitle>
              <p className="text-[15px] leading-relaxed mb-2" style={{ color: B.muted }}>
                Income stability patterns vary across industries.
              </p>
              <p className="text-[15px] leading-relaxed mb-6" style={{ color: B.muted }}>
                Examples of structural characteristics commonly found in stronger income systems.
              </p>
              <p className="text-[11px] mb-8" style={{ color: B.light }}>
                (Industry examples rotate automatically)
              </p>

              {/* Industry tabs */}
              <div className="flex gap-2 mb-6">
                {INDUSTRY_EXAMPLES.map((ex, i) => (
                  <button
                    key={ex.industry}
                    onClick={() => setActiveIndustry(i)}
                    className="text-[11px] font-medium px-3 py-1.5 rounded transition-all"
                    style={{
                      backgroundColor: i === activeIndustry ? B.navy : B.sand,
                      color: i === activeIndustry ? "#ffffff" : B.muted,
                    }}
                  >
                    {ex.industry.split(" / ")[0].split(" (")[0]}
                  </button>
                ))}
              </div>

              <div className="rounded-lg border p-6" style={{ borderColor: B.sandDk, backgroundColor: "#ffffff" }}>
                <div className="text-base font-semibold mb-6" style={{ color: B.navy }}>
                  {example.industry}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: B.teal }}>
                      More Stable Systems Often Include
                    </div>
                    <ul className="space-y-2">
                      {example.stable.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-[13px]" style={{ color: B.muted }}>
                          <span className="mt-2 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: B.teal }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: B.light }}>
                      Common Instability Factors
                    </div>
                    <ul className="space-y-2">
                      {example.unstable.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-[13px]" style={{ color: B.muted }}>
                          <span className="mt-2 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: B.light }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Section>

            <div className="border-t" style={{ borderColor: B.sandDk }} />

            {/* ============ CLASSIFICATION SCALE ============ */}
            <Section>
              <SectionTitle>Income Stability Classification Scale</SectionTitle>
              <div className="rounded-lg border overflow-hidden" style={{ borderColor: B.sandDk }}>
                <div className="grid grid-cols-2 text-[10px] font-semibold uppercase tracking-wider px-4 py-3" style={{ backgroundColor: B.sand, color: B.muted }}>
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
                    className="grid grid-cols-2 px-4 py-3 text-[13px] border-t"
                    style={{ borderColor: B.sandDk, backgroundColor: i % 2 === 0 ? "#ffffff" : B.sand }}
                  >
                    <span className="font-semibold" style={{ color: B.navy }}>{range}</span>
                    <span style={{ color: B.muted }}>{label}</span>
                  </div>
                ))}
              </div>
              <p className="text-[13px] mt-4" style={{ color: B.light }}>
                The classification reflects income structure at the time of assessment under Model RP-1.0.
              </p>
            </Section>

            <div className="border-t" style={{ borderColor: B.sandDk }} />

            {/* ============ FINAL CTA ============ */}
            <Section>
              <SectionTitle>Measure how stable your income structure is today.</SectionTitle>
              <p className="text-[15px] mb-6" style={{ color: B.muted }}>
                Assessment time: <strong style={{ color: B.navy }}>under two minutes</strong>
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  href="/pricing"
                  className="inline-flex items-center px-6 py-3 text-sm font-medium rounded transition-opacity hover:opacity-90"
                  style={{ backgroundColor: B.navy, color: "#ffffff" }}
                >
                  Get Score
                </Link>
                <p className="text-[13px]" style={{ color: B.muted }}>
                  Instant <strong style={{ color: B.navy }}>PDF assessment record</strong>
                </p>
              </div>
            </Section>

            <div className="border-t" style={{ borderColor: B.sandDk }} />

            {/* ============ MODEL GOVERNANCE ============ */}
            <Section>
              <SectionTitle>Model Governance</SectionTitle>
              <div className="space-y-4 text-[15px] leading-relaxed" style={{ color: B.muted }}>
                <p>
                  The <strong style={{ color: B.navy }}>Income Stability Score™</strong> is generated
                  under <strong style={{ color: B.navy }}>Model RP-1.0</strong> using fixed scoring criteria.
                </p>
                <p>
                  If the methodology changes, a <strong style={{ color: B.navy }}>new model version</strong> is issued.
                </p>
                <p>
                  Previous assessments remain tied to the version used when they were generated.
                </p>
              </div>
            </Section>

            <div className="border-t" style={{ borderColor: B.sandDk }} />

            {/* ============ GLOBAL DISCLAIMER ============ */}
            <div className="py-12">
              <p className="text-[13px] leading-relaxed" style={{ color: B.light }}>
                The Income Stability Score™ is a structural income assessment based on information provided by the user.
                It does not provide financial advice and does not predict future financial outcomes.
              </p>
            </div>

          </div>

          <RightPanel />
        </div>
      </div>
    </div>
  );
}
