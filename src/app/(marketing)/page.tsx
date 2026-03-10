"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

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
/* STRUCTURAL STABILITY MODEL — pipeline diagram                        */
/* ------------------------------------------------------------------ */
function StabilityModelDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center">
      {/* Stage 1: Six Factors */}
      <div
        className="rounded-lg border px-8 py-5 text-center transition-all duration-700 w-full"
        style={{
          maxWidth: 320,
          borderColor: B.sandDk,
          backgroundColor: "#ffffff",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
        }}
      >
        <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: B.light }}>Input</div>
        <div className="text-[15px] font-semibold" style={{ color: B.navy }}>Six Structural Factors</div>
      </div>

      {/* Connector 1 */}
      <div
        className="transition-all duration-500 delay-300"
        style={{
          width: 2,
          height: 48,
          background: B.gradient,
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Stage 2: Three Drivers */}
      <div
        className="grid grid-cols-3 gap-3 sm:gap-4 transition-all duration-700 delay-500 w-full"
        style={{
          maxWidth: 540,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
        }}
      >
        {["Structure", "Concentration", "Continuity"].map((d) => (
          <div
            key={d}
            className="rounded-lg border px-3 sm:px-4 py-4 text-center"
            style={{ borderColor: B.sandDk, backgroundColor: "#ffffff" }}
          >
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: B.light }}>Driver</div>
            <div className="text-[13px] sm:text-[14px] font-semibold" style={{ color: B.navy }}>{d}</div>
          </div>
        ))}
      </div>

      {/* Connector 2 */}
      <div
        className="transition-all duration-500 delay-700"
        style={{
          width: 2,
          height: 48,
          background: B.gradient,
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Stage 3: Score Output */}
      <div
        className="rounded-xl px-10 py-6 text-center transition-all duration-700 delay-1000"
        style={{
          background: B.gradient,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.95)",
          boxShadow: visible ? "0 8px 32px rgba(75, 63, 174, 0.25)" : "none",
        }}
      >
        <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>
          Output
        </div>
        <div className="text-[18px] sm:text-[20px] font-semibold" style={{ color: "#ffffff" }}>
          Income Stability Score™
        </div>
      </div>
    </div>
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

      {/* ============ 1. HERO — Curiosity ============ */}
      <section
        className="text-center"
        style={{
          backgroundColor: "#ffffff",
          paddingTop: 48,
          paddingBottom: 72,
        }}
      >
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
          <h1 className="text-[32px] sm:text-[44px] md:text-[56px] font-semibold leading-[1.08] mx-auto" style={{ color: B.navy, marginBottom: 24, maxWidth: 720 }}>
            The Standard for Measuring Income Stability
          </h1>
          <p className="text-base leading-relaxed mx-auto" style={{ color: B.muted, marginBottom: 8, maxWidth: 560 }}>
            The <strong style={{ color: B.navy }}>Income Stability Score™</strong> determines the structural stability of income under Model RP-1.0.
          </p>
          <p className="text-base leading-relaxed mx-auto" style={{ color: B.muted, marginBottom: 48, maxWidth: 560 }}>
            See how stable your income structure is today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/pricing"
              className="inline-flex items-center px-7 py-3.5 text-sm font-medium rounded transition-opacity hover:opacity-90"
              style={{ backgroundColor: B.navy, color: "#ffffff" }}
            >
              Get Score
            </Link>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, textAlign: "left" }}>
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

      {/* Subtle blend from white hero into page background */}
      <div style={{ height: 96, background: "linear-gradient(to bottom, #ffffff, #FAFAFA)" }} />

      {/* ============ 2. SCORE CURIOSITY — Orientation ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6 text-center" style={{ paddingTop: 0, paddingBottom: 72 }}>
        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight" style={{ color: B.navy, marginBottom: 48 }}>
          Where Would Your Income Stability Likely Fall?
        </h2>
        {/* Stability spectrum — visually dominant */}
        <div className="mx-auto" style={{ maxWidth: 640 }}>
          <div
            className="rounded-full"
            style={{ height: 16, background: B.gradient, marginBottom: 24 }}
          />
          <div className="grid grid-cols-4 gap-1">
            {[
              { label: "Limited", range: "0\u201339" },
              { label: "Developing", range: "40\u201359" },
              { label: "Established", range: "60\u201379" },
              { label: "High", range: "80\u2013100" },
            ].map((band) => (
              <div key={band.label} className="text-center">
                <div className="text-[12px] sm:text-[14px] font-semibold" style={{ color: B.navy }}>{band.label}</div>
                <div className="text-[10px] sm:text-[12px]" style={{ color: B.light }}>{band.range}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 4. SIX FACTORS — Model Understanding ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6 text-center" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight" style={{ color: B.navy, marginBottom: 48 }}>
          Six Structural Assessment Factors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { key: "01", title: "Recurring Income Proportion", desc: "Proportion of income that renews without renegotiation." },
            { key: "02", title: "Income Concentration", desc: "Dependence on a small number of income sources." },
            { key: "03", title: "Number of Income Sources", desc: "Total active sources contributing to income." },
            { key: "04", title: "Forward Revenue Visibility", desc: "Committed or scheduled future income." },
            { key: "05", title: "Earnings Variability", desc: "Month-to-month consistency of income." },
            { key: "06", title: "Income Continuity Without Active Labor", desc: "Income that continues without direct personal effort." },
          ].map((factor) => (
            <div
              key={factor.key}
              className="rounded-lg border"
              style={{ borderColor: B.sandDk, backgroundColor: "#ffffff" }}
            >
              {/* Data module header */}
              <div className="px-5 py-3 border-b" style={{ borderColor: B.sandDk }}>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold" style={{ color: B.light }}>{factor.key}</span>
                  <span style={{ height: 12, width: 1, backgroundColor: B.sandDk }} />
                  <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: B.light }}>Factor</span>
                </div>
              </div>
              <div className="px-5 py-4">
                <div className="text-[14px] font-semibold" style={{ color: B.navy, marginBottom: 8 }}>{factor.title}</div>
                <div className="text-[13px] leading-relaxed" style={{ color: B.muted }}>{factor.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ 5. STRUCTURAL STABILITY MODEL — Model Understanding (computation) ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <div className="text-center" style={{ marginBottom: 48 }}>
          <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight" style={{ color: B.navy, marginBottom: 12 }}>
            Structural Stability Model
          </h2>
          <p className="text-base" style={{ color: B.muted }}>
            How the <strong style={{ color: B.navy }}>Income Stability Score™</strong> is determined.
          </p>
        </div>
        <StabilityModelDiagram />
      </section>

      {/* ============ 6. INDUSTRY PATTERNS — Real-World Context ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6 text-center" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight" style={{ color: B.navy, marginBottom: 48 }}>
          What High-Stability Income Systems Do Differently
        </h2>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2" style={{ marginBottom: 24 }}>
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

        <div className="rounded-lg border" style={{ borderColor: B.sandDk, backgroundColor: "#ffffff" }}>
          {/* Panel header */}
          <div className="px-5 sm:px-8 py-4 border-b" style={{ borderColor: B.sandDk }}>
            <div className="text-[14px] sm:text-[15px] font-semibold" style={{ color: B.navy }}>
              {example.industry}
            </div>
          </div>
          <div className="px-5 sm:px-8 py-6 sm:py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: B.teal, marginBottom: 16 }}>
                  More Stable Income Systems Often Include
                </div>
                <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {example.stable.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[13px] sm:text-[14px]" style={{ color: B.muted }}>
                      <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: B.teal }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: B.light, marginBottom: 16 }}>
                  Common Sources of Instability
                </div>
                <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
        </div>
      </section>

      {/* ============ 7. INCOME STRUCTURE MAP ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6 text-center" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight" style={{ color: B.navy, marginBottom: 48 }}>
          Income Structure Map
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ marginBottom: 24 }}>
          {[
            { label: "Active Income", desc: "Requires direct personal effort to generate.", color: B.navy },
            { label: "Semi-Persistent Income", desc: "Continues for a period but requires periodic renewal.", color: B.purple },
            { label: "Persistent Income", desc: "Continues without active effort or renegotiation.", color: B.teal },
          ].map((tier) => (
            <div
              key={tier.label}
              className="rounded-lg border"
              style={{ borderColor: B.sandDk, backgroundColor: "#ffffff" }}
            >
              <div className="px-5 py-3 border-b flex items-center gap-3" style={{ borderColor: B.sandDk }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tier.color }} />
                <div className="text-[14px] font-semibold" style={{ color: B.navy }}>{tier.label}</div>
              </div>
              <div className="px-5 py-4">
                <div className="text-[13px] leading-relaxed" style={{ color: B.muted }}>{tier.desc}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Stability arrow */}
        <div className="flex items-center gap-3 mx-auto" style={{ maxWidth: 480, marginBottom: 24 }}>
          <div className="flex-1 h-2 rounded-full" style={{ background: B.gradient }} />
          <div className="text-[11px] font-semibold uppercase tracking-wider shrink-0" style={{ color: B.teal }}>
            More Stable
          </div>
        </div>
        <p className="text-[14px] leading-relaxed mx-auto" style={{ color: B.muted, maxWidth: 640 }}>
          Income systems become more stable as income moves from active sources toward persistent sources.
        </p>
      </section>

      {/* ============ 8. CLASSIFICATION SCALE — Score Classification ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6 text-center" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight" style={{ color: B.navy, marginBottom: 48 }}>
          Income Stability Classification Scale
        </h2>
        {/* Spectrum bar — visually dominant */}
        <div className="rounded-full mx-auto" style={{ height: 12, background: B.gradient, maxWidth: 640, marginBottom: 24 }} />
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
        <p className="text-[13px] mx-auto" style={{ color: B.light, marginTop: 24, maxWidth: 640 }}>
          The classification reflects income structure at the time the assessment is completed under Model RP-1.0.
        </p>
      </section>

      {/* ============ 9. FINAL CTA — Action ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6 text-center" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight" style={{ color: B.navy, marginBottom: 12 }}>
          Measure your Income Stability Score™
        </h2>
        <p className="text-base leading-relaxed" style={{ color: B.muted, marginBottom: 8 }}>
          Complete the structural income assessment and receive your Income Stability Score™ report.
        </p>
        <p className="text-base" style={{ color: B.muted, marginBottom: 48 }}>
          Assessment time: <strong style={{ color: B.navy }}>under two minutes</strong>
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
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

      {/* ============ 10. MODEL GOVERNANCE ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6 text-center" style={{ paddingTop: 72, paddingBottom: 48 }}>
        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight" style={{ color: B.navy, marginBottom: 24 }}>
          Model Governance
        </h2>
        <div className="text-base leading-relaxed mx-auto" style={{ color: B.muted, maxWidth: 680, display: "flex", flexDirection: "column", gap: 16 }}>
          <p>The <strong style={{ color: B.navy }}>Income Stability Score™</strong> is generated under <strong style={{ color: B.navy }}>Model RP-1.0</strong> using fixed scoring criteria.</p>
          <p>If the methodology changes, a <strong style={{ color: B.navy }}>new model version</strong> is issued.</p>
          <p>Previously generated assessments remain tied to the model version used when they were created.</p>
        </div>
      </section>

      {/* ============ DISCLAIMER ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6 text-center" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <p className="text-[13px] leading-relaxed mx-auto" style={{ color: B.light, maxWidth: 680 }}>
          The Income Stability Score™ is a structural income assessment based on information provided by the user. It does not provide financial advice and does not predict future financial outcomes.
        </p>
      </section>
    </div>
  );
}
