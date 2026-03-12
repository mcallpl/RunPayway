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
    industry: "Professional Services: Moving From Project Work to Recurring Revenue",
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
    industry: "Private Practice: Increasing Revenue Continuity",
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
    industry: "Agency Owners: Reducing Client Concentration Risk",
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

const FAQ_ITEMS = [
  {
    q: "What does the Income Stability Score™ measure?",
    a: "The score evaluates the structural stability of your income system across six factors — including income persistence, source diversity, and forward revenue visibility. It measures how your income is structured, not how much you earn.",
  },
  {
    q: "How long does the assessment take?",
    a: "The assessment consists of six structured questions and takes under two minutes to complete. Your score and full PDF report are generated instantly upon completion.",
  },
  {
    q: "Is this financial advice?",
    a: "No. The Income Stability Score™ is a structural analytical tool. It does not evaluate investment performance, creditworthiness, or future financial outcomes, and should not be interpreted as financial, tax, legal, or investment advice.",
  },
  {
    q: "Can I retake the assessment?",
    a: "Yes. With the Annual Monitoring plan, you receive three assessments over 12 months to track how your income structure evolves. Single assessments can be purchased at any time.",
  },
  {
    q: "What is included in the report?",
    a: "Your report includes your Income Stability Score™, stability classification, structural indicators, income structure map, system diagnosis, industry benchmark comparison, improvement path, and an official PDF assessment record issued under Model RP-1.0.",
  },
  {
    q: "How is my data handled?",
    a: "Your assessment data is processed securely and used only to generate your report. Payment is handled through Stripe Secure Checkout. We do not sell or share your personal information.",
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
      {/* Input Layer label */}
      <div
        className="text-[9px] font-semibold uppercase tracking-[0.2em] mb-2 transition-all duration-500"
        style={{ color: B.light, opacity: visible ? 1 : 0 }}
      >
        Input Layer
      </div>

      {/* Stage 1: Six Factors */}
      <div
        className="rounded-lg border px-8 py-5 text-center transition-all duration-700 w-full"
        style={{
          maxWidth: 320,
          borderColor: B.sandDk,
          backgroundColor: "#ffffff",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
        }}
      >
        <div className="text-[15px] font-semibold" style={{ color: B.navy }}>Six Structural Factors</div>
      </div>

      {/* Connector 1 */}
      <div
        className="transition-all duration-500 delay-300"
        style={{
          width: 2,
          height: 48,
          backgroundColor: B.navy,
          opacity: visible ? 0.2 : 0,
        }}
      />

      {/* Driver Layer label */}
      <div
        className="text-[9px] font-semibold uppercase tracking-[0.2em] mb-2 transition-all duration-500 delay-400"
        style={{ color: B.light, opacity: visible ? 1 : 0 }}
      >
        Driver Layer
      </div>

      {/* Stage 2: Three Drivers */}
      <div
        className="grid grid-cols-3 gap-3 sm:gap-4 w-full"
        style={{ maxWidth: 540 }}
      >
        {["Income Structure", "Income Concentration", "Income Continuity"].map((d, i) => (
          <div
            key={d}
            className="rounded-lg border px-3 sm:px-4 py-4 text-center transition-all duration-600"
            style={{
              borderColor: B.sandDk,
              backgroundColor: "#ffffff",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transitionDelay: `${500 + i * 120}ms`,
            }}
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
          backgroundColor: B.navy,
          opacity: visible ? 0.2 : 0,
        }}
      />

      {/* Output Layer label */}
      <div
        className="text-[9px] font-semibold uppercase tracking-[0.2em] mb-2 transition-all duration-500"
        style={{ color: "rgba(255,255,255,0.5)", opacity: visible ? 1 : 0, transitionDelay: "900ms" }}
      >
        Output
      </div>

      {/* Stage 3: Score Output */}
      <div
        className="rounded-2xl px-12 py-7 text-center transition-all duration-700"
        style={{
          background: B.gradient,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          boxShadow: visible ? "0 10px 40px rgba(75, 63, 174, 0.28)" : "none",
          transitionDelay: "1000ms",
        }}
      >
        <div className="text-[20px] sm:text-[22px] font-semibold" style={{ color: "#ffffff" }}>
          Income Stability Score™
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MODEL GOVERNANCE — scroll-reveal section                             */
/* ------------------------------------------------------------------ */
function ModelGovernance() {
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

  const blocks = [
    {
      title: "Scope of the Model",
      lines: [
        <>The Income Stability Score™ evaluates the structural stability of income at a specific point in time based on <strong style={{ color: B.navy }}>Model RP-1.0</strong>.</>,
        "The model assesses structural characteristics of income systems and does not evaluate investment performance, creditworthiness, or future financial outcomes.",
      ],
    },
    {
      title: "Point-in-Time Assessment",
      lines: [
        "The Income Stability Score™ reflects income structure at the time the assessment is completed.",
        "Changes to income sources, revenue continuity, or income concentration may affect the score over time.",
      ],
    },
    {
      title: "Analytical Use",
      lines: [
        "The Income Stability Score™ is designed as a structural analytical tool intended to help individuals better understand the stability characteristics of their income systems.",
        "The score should not be interpreted as financial, tax, legal, or investment advice.",
      ],
    },
  ];

  return (
    <section ref={ref} className="max-w-[1100px] mx-auto px-5 sm:px-6" style={{ paddingTop: 96, paddingBottom: 64 }}>
      {/* Divider line — draws left to right */}
      <div className="mx-auto" style={{ maxWidth: 680, marginBottom: 40 }}>
        <div
          style={{
            height: 1,
            backgroundColor: B.sandDk,
            transformOrigin: "left",
            transform: visible ? "scaleX(1)" : "scaleX(0)",
            transition: "transform 0.6s ease-out",
          }}
        />
      </div>

      {/* Title */}
      <h2
        className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight text-center"
        style={{
          color: B.navy,
          marginBottom: 40,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.4s ease",
          transitionDelay: "100ms",
        }}
      >
        Model Governance
      </h2>

      {/* Governance blocks */}
      <div className="mx-auto text-left" style={{ maxWidth: 680 }}>
        {blocks.map((block, i) => (
          <div
            key={block.title}
            style={{
              marginBottom: i < blocks.length - 1 ? 32 : 0,
              opacity: visible ? 1 : 0,
              transition: "opacity 0.4s ease",
              transitionDelay: `${200 + i * 100}ms`,
            }}
          >
            <h3
              className="text-[16px] font-semibold"
              style={{ color: B.navy, marginBottom: 10 }}
            >
              {block.title}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {block.lines.map((line, j) => (
                <p key={j} className="text-[15px] leading-relaxed" style={{ color: B.muted }}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SAMPLE REPORT PREVIEW — 3-page tabbed preview                        */
/* ------------------------------------------------------------------ */
function SampleReportPreview() {
  const [activePage, setActivePage] = useState(0);
  const pages = ["Executive Assessment", "Structural Analysis", "Improvement Path"];

  return (
    <section style={{ paddingTop: 0, paddingBottom: 0 }}>
      {/* Teal background panel with subtle geometric art */}
      <div
        style={{
          backgroundColor: B.navy,
          paddingTop: 100,
          paddingBottom: 64,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle topographic / contour line art overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.06,
            pointerEvents: "none",
          }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <defs>
              <pattern id="topo" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                <circle cx="100" cy="100" r="20" fill="none" stroke="#ffffff" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="40" fill="none" stroke="#ffffff" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="60" fill="none" stroke="#ffffff" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="#ffffff" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="100" fill="none" stroke="#ffffff" strokeWidth="0.5" />
                <circle cx="0" cy="0" r="30" fill="none" stroke="#ffffff" strokeWidth="0.5" />
                <circle cx="0" cy="0" r="60" fill="none" stroke="#ffffff" strokeWidth="0.5" />
                <circle cx="0" cy="0" r="90" fill="none" stroke="#ffffff" strokeWidth="0.5" />
                <circle cx="200" cy="200" r="25" fill="none" stroke="#ffffff" strokeWidth="0.5" />
                <circle cx="200" cy="200" r="55" fill="none" stroke="#ffffff" strokeWidth="0.5" />
                <circle cx="200" cy="200" r="85" fill="none" stroke="#ffffff" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#topo)" />
          </svg>
        </div>

        {/* Subtle radial glow */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            height: "60%",
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="max-w-[1100px] mx-auto px-5 sm:px-6 text-center relative" style={{ zIndex: 1 }}>
          {/* Headline — inside teal */}
          <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight" style={{ color: "#ffffff", marginBottom: 16 }}>
            What You Will Receive
          </h2>
          <p className="text-base leading-relaxed mx-auto" style={{ color: "rgba(255,255,255,0.8)", marginBottom: 20, maxWidth: 620 }}>
            Every assessment generates a structured PDF report containing your complete Income Stability analysis.
          </p>
          <p className="text-[13px] mx-auto" style={{ color: "rgba(255,255,255,0.55)", marginBottom: 48, maxWidth: 620 }}>
            Sample report based on a fictional income profile scored under Model RP-1.0.
          </p>
          {/* Page tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {pages.map((label, i) => (
              <button
                key={label}
                onClick={() => setActivePage(i)}
                className="px-4 py-2 text-[12px] font-medium rounded-md transition-all"
                style={{
                  backgroundColor: activePage === i ? "#ffffff" : "rgba(255,255,255,0.15)",
                  color: activePage === i ? B.navy : "rgba(255,255,255,0.85)",
                }}
              >
                Page {i + 1}: {label}
              </button>
            ))}
          </div>

          {/* Report card container */}
          <div
            className="mx-auto rounded-xl text-left"
            style={{
              maxWidth: 680,
              backgroundColor: "#ffffff",
              boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
              overflow: "hidden",
            }}
          >
        {/* Gradient top bar */}
        <div style={{ height: 3, background: B.gradient }} />

        {/* Report header */}
        <div className="px-6 sm:px-8 pt-5 pb-3 border-b flex items-center justify-between" style={{ borderColor: B.sandDk }}>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold tracking-wider" style={{ color: B.navy }}>RUNPAYWAY™</span>
            <span className="text-[9px]" style={{ color: B.light }}>Income Stability Assessment · Model RP-1.0</span>
          </div>
          <span className="text-[9px]" style={{ color: B.light }}>Sample Report</span>
        </div>

        {/* Page content */}
        <div className="px-6 sm:px-8 py-6 sm:py-8">
          {/* PAGE 1 — Executive Assessment */}
          {activePage === 0 && (
            <div>
              {/* Page insight */}
              <p className="text-[11px] leading-relaxed mb-5" style={{ color: B.muted }}>
                This income system scores 78 under Model RP-1.0, placing it in the Established Stability classification band. The score reflects a resilient income structure with diversified sources and moderate forward revenue visibility.
              </p>

              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: B.muted }}>Income Stability Score™</div>
              <div className="text-[52px] font-bold leading-none" style={{ color: B.navy }}>78</div>
              <div className="text-[14px] font-semibold mt-1 mb-4" style={{ color: B.teal }}>Established Stability</div>

              {/* Spectrum */}
              <div className="relative mb-1">
                <div className="rounded-full" style={{ height: 8, background: B.gradient }} />
                {[40, 60, 80].map((pos) => (
                  <div key={pos} style={{ position: "absolute", left: `${pos}%`, top: 0, width: 1, height: 8, backgroundColor: "rgba(255,255,255,0.4)" }} />
                ))}
                <div style={{ position: "absolute", left: "78%", top: -3, width: 2, height: 14, backgroundColor: B.navy, borderRadius: 1 }} />
              </div>
              <div className="grid grid-cols-4 gap-0.5 mb-4">
                {["Limited", "Developing", "Established", "High"].map((b) => (
                  <div key={b} className="text-center text-[8px]" style={{ color: b === "Established" ? B.navy : B.light, fontWeight: b === "Established" ? 600 : 400 }}>{b}</div>
                ))}
              </div>

              {/* Percentile */}
              <div className="mb-4">
                <p className="text-[11px]" style={{ color: B.muted }}>
                  <span className="font-medium" style={{ color: B.navy }}>72nd percentile</span> within Professional Services
                </p>
                <p className="text-[10px] mt-1 leading-relaxed" style={{ color: B.muted }}>
                  A score at the 72nd percentile means this income system is more stable than most income systems in the Professional Services sector.
                </p>
              </div>

              {/* Metadata */}
              <div className="flex gap-5 text-[9px] mb-5" style={{ color: B.light }}>
                <span>Assessment ID: a7e2f1b3…</span>
                <span>Generated: 2026-03-10</span>
                <span>Model: RP-1.0</span>
              </div>

              <div style={{ height: 1, backgroundColor: B.navy, opacity: 0.08, marginBottom: 20 }} />

              {/* Profile */}
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: B.muted }}>Profile</div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-[12px] mb-5">
                {[
                  ["Assessment Title", "Sample Professional"],
                  ["Classification", "Individual"],
                  ["Structure", "Independent Consultant"],
                  ["Income Model", "Contract-Based"],
                  ["Revenue", "Recurring & One-Time Mix"],
                  ["Sector", "Professional Services"],
                ].map(([l, v]) => (
                  <div key={l}>
                    <span style={{ color: B.light }}>{l}: </span>
                    <span className="font-medium" style={{ color: B.navy }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ height: 1, backgroundColor: B.navy, opacity: 0.08, marginBottom: 20 }} />

              {/* Key factors */}
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: B.muted }}>Key Structural Factors Affecting Your Score</div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: B.teal }}>Positive Factors</div>
                  {["Income Persistence", "Monthly Income Stability", "Active Labor Independence"].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-[11px] mb-1.5" style={{ color: B.navy }}>
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: B.teal }} />
                      {f}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: B.muted }}>Structural Risks</div>
                  {["Forward Revenue Visibility", "Income Source Diversity"].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-[11px] mb-1.5" style={{ color: B.navy }}>
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: B.light }} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PAGE 2 — Structural Analysis */}
          {activePage === 1 && (
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.1em] mb-1" style={{ color: B.navy }}>Structural Analysis</div>
              <p className="text-[11px] leading-relaxed mb-5" style={{ color: B.muted }}>
                This income system is classified as Asset-Balanced on the labor–asset spectrum under the RunPayway structural framework. Income is generated through a mix of active and semi-persistent sources.
              </p>

              {/* Income Structure Map */}
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: B.muted }}>Income Structure Map</div>
              <p className="text-[10px] mb-2" style={{ color: B.muted }}>Sample Professional&#39;s income comes from three types of sources.</p>
              <div className="space-y-2.5 mb-1">
                {[
                  { label: "Active Income", desc: "Earned by doing work", value: 40, color: B.muted },
                  { label: "Semi-Persistent", desc: "Repeats for a while, then stops", value: 35, color: B.teal },
                  { label: "Persistent", desc: "Continues with little work", value: 25, color: B.navy },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span style={{ color: B.muted }}>{bar.label}</span>
                      <span className="font-medium" style={{ color: B.navy }}>{bar.value}%</span>
                    </div>
                    <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: B.sand }}>
                      <div className="h-full rounded-full" style={{ width: `${bar.value}%`, backgroundColor: bar.color }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ height: 1, backgroundColor: B.navy, opacity: 0.08, margin: "16px 0" }} />

              {/* Structural Indicators */}
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: B.muted }}>Structural Indicators</div>
              <div className="grid grid-cols-2 gap-1.5 mb-1">
                {[
                  ["Income That Continues", "Moderate"],
                  ["Number of Income Sources", "Moderate"],
                  ["Income Already Scheduled", "Low"],
                  ["Monthly Income Stability", "High"],
                  ["Dependence on Personal Work", "Moderate"],
                  ["Dependence on One Source", "Low"],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between rounded-md px-3 py-2" style={{ backgroundColor: B.sand }}>
                    <span className="text-[10px]" style={{ color: B.muted }}>{l}</span>
                    <span className="text-[10px] font-medium" style={{ color: B.navy }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ height: 1, backgroundColor: B.navy, opacity: 0.08, margin: "16px 0" }} />

              {/* System Diagnosis */}
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: B.muted }}>System Diagnosis</div>
              <div className="text-[11px] leading-relaxed space-y-1.5 mb-1" style={{ color: B.muted }}>
                <p>Sample Professional operates mainly as an <strong style={{ color: B.navy }}>Asset-Balanced</strong> income system in the <strong style={{ color: B.navy }}>Professional Services</strong> sector.</p>
                <p>Income mainly comes from a mix of active and partly recurring income. The system shows some areas of strength.</p>
                <p>Because <strong style={{ color: B.navy }}>Forward Revenue Visibility</strong> is limited, stability depends on continuing to generate new work.</p>
              </div>

              <div style={{ height: 1, backgroundColor: B.navy, opacity: 0.08, margin: "16px 0" }} />

              {/* Industry Benchmark */}
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: B.muted }}>Industry Stability Benchmark</div>
              <div className="rounded-lg overflow-hidden border" style={{ borderColor: B.sandDk }}>
                {[
                  ["Average Professional Services Score", "48"],
                  ["Top 20% Stability Range", "65+"],
                  ["Sample Score", "78"],
                  ["Distance From Top Tier", "0 points"],
                ].map(([label, value], i) => (
                  <div key={label} className="flex justify-between items-center px-4 py-2 text-[11px]"
                    style={{ backgroundColor: i % 2 === 0 ? B.sand : "white" }}>
                    <span style={{ color: B.muted }}>{label}</span>
                    <span className="font-semibold" style={{ color: i === 2 ? B.purple : B.navy }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Drivers */}
              <div className="mt-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: B.muted }}>Drivers Supporting Stability</div>
                <div className="flex flex-wrap gap-1.5">
                  {["Income Persistence", "Earnings Variability", "Recurring Revenue Base"].map((d) => (
                    <span key={d} className="text-[10px] font-medium px-2 py-0.5 rounded-md" style={{ backgroundColor: B.sand, color: B.navy }}>{d}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PAGE 3 — Improvement Path & Governance */}
          {activePage === 2 && (
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.1em] mb-1" style={{ color: B.navy }}>Improvement Path &amp; Governance</div>
              <p className="text-[11px] leading-relaxed mb-5" style={{ color: B.muted }}>
                The structural income map illustrates the distribution of active, semi-persistent, and persistent income within this system. Increasing forward revenue visibility would have the greatest impact on structural stability.
              </p>

              {/* Primary Constraint */}
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: B.muted }}>Primary Structural Constraint</div>
              <div className="text-xs font-medium mb-1" style={{ color: B.navy }}>Forward Revenue Visibility</div>
              <p className="text-[11px] leading-relaxed mb-1" style={{ color: B.muted }}>Very little income is already scheduled or committed for future months.</p>
              <p className="text-[11px] leading-relaxed" style={{ color: B.muted }}>Income may drop if there are gaps between jobs or clients.</p>

              <div style={{ height: 1, backgroundColor: B.navy, opacity: 0.08, margin: "16px 0" }} />

              {/* Improvement Opportunities */}
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: B.muted }}>Improvement Opportunities</div>
              <p className="text-[11px] leading-relaxed mb-3" style={{ color: B.muted }}>
                These examples illustrate structural patterns within the sector and do not constitute financial, legal, or investment advice. Consider transitioning project-based engagements to retainer arrangements and building recurring revenue streams to increase forward visibility.
              </p>

              {/* Sector Evolution */}
              <div className="text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: B.muted }}>Sector Evolution Path</div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {["Project-Based", "Retainer Clients", "Recurring Revenue", "Platform Income"].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: i === 2 ? B.navy : i < 2 ? B.teal : B.sand,
                        color: i <= 2 ? "#ffffff" : B.light,
                      }}
                    >
                      {step}
                    </span>
                    {i < 3 && <span className="text-[10px]" style={{ color: B.light }}>&rarr;</span>}
                  </div>
                ))}
              </div>
              <p className="text-[10px] mb-3" style={{ color: B.muted }}>
                Current Stage: <strong style={{ color: B.navy }}>Recurring Revenue</strong>
              </p>

              {/* Sector Stability Mechanisms */}
              <div className="text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: B.muted }}>Sector Stability Mechanisms</div>
              <ul className="text-[11px] space-y-1 mb-1" style={{ color: B.muted }}>
                {[
                  "retainer and recurring service agreements",
                  "multi-year consulting contracts",
                  "performance-based revenue sharing",
                  "intellectual property licensing",
                  "training and certification programs",
                ].map((m) => (
                  <li key={m} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: B.light }} />
                    {m}
                  </li>
                ))}
              </ul>

              <div style={{ height: 1, backgroundColor: B.navy, opacity: 0.08, margin: "16px 0" }} />

              {/* Methodology */}
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: B.muted }}>Methodology</div>
              <p className="text-[10px] leading-relaxed" style={{ color: B.muted }}>
                The Income Stability Score™ evaluates the structural stability of income at a specific point in time.
                Six structural factors are assessed under Model RP-1.0 using fixed, deterministic scoring criteria.
                The model does not evaluate investment performance, creditworthiness, or future financial outcomes.
              </p>

              <div style={{ height: 1, backgroundColor: B.navy, opacity: 0.08, margin: "16px 0" }} />

              {/* Disclosure */}
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: B.muted }}>Disclosure</div>
              <p className="text-[10px] leading-relaxed" style={{ color: B.light }}>
                This report is created by a fixed classification model. It is not financial advice.
                The Income Stability Score is not a credit score, not a measure of net worth,
                and not a prediction of future income.
              </p>

              <div style={{ height: 1, backgroundColor: B.navy, opacity: 0.08, margin: "16px 0" }} />

              {/* Official Record */}
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: B.muted }}>Official Classification Record</div>
              <div className="space-y-1 text-[11px]">
                {[
                  ["Record ID", "a7e2f1b3-9c4d-4e8a-b2f6-8d3e1a7c9b04"],
                  ["Model", "RP-1.0 | Version 1.0"],
                  ["Date", "2026-03-10"],
                  ["Score", "78 — Established Stability"],
                  ["Auth Code", "e4a2b8c1d9f0a3e7b6c8d2f1a4e9b7c3d5f0a2e8b1c6d4f3a7e0b9c2d8f5a1"],
                  ["Registry", "Private Record"],
                ].map(([l, v]) => (
                  <div key={l} className="flex gap-3">
                    <span className="w-20 shrink-0" style={{ color: B.light }}>{l}</span>
                    <span className="font-mono text-[10px] break-all" style={{ color: B.navy }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Verification */}
              <p className="text-[10px] mt-3 leading-relaxed" style={{ color: B.muted }}>
                Verify this report at <span className="font-medium" style={{ color: B.navy }}>RunPayway.com/verify</span> using the Record ID and Authorization Code.
              </p>

              <div className="text-center mt-5 pt-3 border-t" style={{ borderColor: B.sandDk }}>
                <div className="text-[10px]" style={{ color: B.light }}>RunPayway Structural Stability Model RP-1.0</div>
              </div>
            </div>
          )}
        </div>
      </div>

          {/* Page indicator dots */}
          <div className="flex justify-center gap-2 mt-6">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setActivePage(i)}
                className="rounded-full transition-all"
                style={{
                  width: activePage === i ? 20 : 6,
                  height: 6,
                  backgroundColor: activePage === i ? "#ffffff" : "rgba(255,255,255,0.3)",
                }}
              />
            ))}
          </div>

          <p className="text-[13px] mt-8" style={{ color: "rgba(255,255,255,0.7)" }}>
            3-page PDF report delivered instantly after assessment
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* HERO SECTION — Financial Platform Interface                          */
/* ------------------------------------------------------------------ */
function HeroSection() {
  const [score, setScore] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const target = 78;
          const duration = 800;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setScore(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  // Score position on band (78 out of 100)
  const scorePosition = 78;

  return (
    <section
      ref={heroRef}
      style={{
        backgroundColor: B.navy,
        paddingTop: 120,
        paddingBottom: 110,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, #0E1A2B 0%, #131F30 50%, #0E1A2B 100%)",
          pointerEvents: "none",
        }}
      />

      <div className="max-w-[1200px] mx-auto px-5 sm:px-6" style={{ position: "relative", zIndex: 1 }}>
        <div className="flex flex-col lg:flex-row items-start" style={{ gap: 120 }}>
          {/* Left column — copy + CTA (540px) */}
          <div style={{ maxWidth: 540, flexShrink: 0 }} className="w-full">
            <h1
              className="text-[36px] md:text-[56px] leading-[1.15]"
              style={{ color: "#ffffff", fontWeight: 600, marginBottom: 24 }}
            >
              How Stable Is Your Income?
            </h1>
            <p
              className="text-[18px] md:text-[22px] leading-[1.5]"
              style={{ color: "rgba(255,255,255,0.85)", fontWeight: 400, marginBottom: 18 }}
            >
              Get your Income Stability Score&#8482; in under 2 minutes.
            </p>
            <p
              className="text-[15px] md:text-[16px]"
              style={{ color: "rgba(255,255,255,0.6)", fontWeight: 400, marginBottom: 28 }}
            >
              Scores range from 0&ndash;100. Higher scores indicate stronger income stability.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center transition-all"
              style={{
                backgroundColor: B.purple,
                color: "#ffffff",
                fontWeight: 500,
                fontSize: 16,
                height: 52,
                paddingLeft: 28,
                paddingRight: 28,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(75, 63, 174, 0.3)",
                width: "auto",
                maxWidth: 320,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "brightness(1.1)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(75, 63, 174, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "brightness(1)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(75, 63, 174, 0.3)";
              }}
            >
              Get My Income Stability Score
            </Link>
            <p
              className="text-[13px] md:text-[14px]"
              style={{ color: "#9AA4B2", marginTop: 12 }}
            >
              Takes under 2 minutes &mdash; Instant results
            </p>
          </div>

          {/* Right column — diagnostic score instrument (420px) */}
          <div className="w-full flex justify-center lg:justify-end" style={{ maxWidth: 420, position: "relative" }}>
            {/* Radial glow behind instrument */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 500,
                height: 500,
                borderRadius: "50%",
                background: `radial-gradient(circle, rgba(75, 63, 174, 0.07) 0%, transparent 70%)`,
                pointerEvents: "none",
              }}
            />

            {/* Metric card */}
            <div
              className="w-full hero-report-surface"
              style={{
                backgroundColor: "#F4F1EA",
                borderRadius: 14,
                border: "1px solid #E5E2DB",
                padding: 40,
                boxShadow: "0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)",
                position: "relative",
                zIndex: 1,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                maxWidth: 420,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)";
              }}
            >
              {/* Title */}
              <div
                className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: B.navy, marginBottom: 24, opacity: 0.7 }}
              >
                Your Income Stability Score
              </div>

              {/* Large score */}
              <div
                className="text-[72px] md:text-[80px] leading-none"
                style={{ color: B.navy, fontWeight: 600, marginBottom: 6 }}
              >
                {score}
              </div>

              {/* Classification */}
              <div
                className="text-[16px] font-medium"
                style={{ color: B.teal, marginBottom: 28 }}
              >
                Established Stability
              </div>

              {/* Band progression scale */}
              <div style={{ marginBottom: 8, position: "relative" }}>
                {/* Gradient bar */}
                <div
                  className="rounded-full"
                  style={{
                    height: 8,
                    background: `linear-gradient(90deg, ${B.navy} 0%, ${B.purple} 50%, ${B.teal} 100%)`,
                    position: "relative",
                  }}
                >
                  {/* Score position indicator */}
                  <div
                    style={{
                      position: "absolute",
                      left: `${hasAnimated ? scorePosition : 0}%`,
                      top: -4,
                      width: 3,
                      height: 16,
                      backgroundColor: B.navy,
                      borderRadius: 2,
                      transition: "left 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
              </div>

              {/* Band labels */}
              <div className="grid grid-cols-4 gap-0.5" style={{ marginBottom: 0 }}>
                {["Fragile", "Early", "Established", "High"].map((label) => (
                  <div key={label} className="text-center">
                    <div className="text-[9px] font-medium" style={{ color: B.navy, opacity: 0.6 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
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
  const [openIndustry, setOpenIndustry] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="overflow-x-hidden">

      {/* ============ 1. HERO — Financial Platform ============ */}
      <HeroSection />

      {/* ============ TRUST STRIP ============ */}
      <section style={{ backgroundColor: "#F4F1EA", borderTop: "1px solid #E5E2DB", borderBottom: "1px solid #E5E2DB" }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6" style={{ paddingTop: 16, paddingBottom: 16 }}>
          {/* Desktop: horizontal row / Mobile: 2×2 grid */}
          <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-y-4 gap-x-6 sm:gap-x-12">
            {[
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "RunPayway Model RP-1.0" },
              { icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z", label: "Deterministic Scoring" },
              { icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z", label: "Instant PDF Report" },
              { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", label: "Secure Payment via Stripe" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col sm:flex-row items-center sm:items-center gap-1.5 sm:gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={B.navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85 }}>
                  <path d={item.icon} />
                </svg>
                <span className="text-[13px] sm:text-[14px] font-medium text-center sm:text-left" style={{ color: B.navy }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subtle blend into page background */}
      <div style={{ height: 80, background: "linear-gradient(to bottom, #FAFAFA, #FAFAFA)" }} />

      {/* ============ HOW IT WORKS — Process Strip ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6 text-center" style={{ paddingTop: 40, paddingBottom: 120 }}>
        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight" style={{ color: B.navy, marginBottom: 16 }}>
          How It Works
        </h2>
        <p className="text-base leading-relaxed mx-auto" style={{ color: B.muted, marginBottom: 64, maxWidth: 560 }}>
          Three steps to your Income Stability Score™ report.
        </p>

        {/* Steps with connecting line */}
        <div className="relative" style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* Horizontal connector line (desktop only) */}
          <div
            className="hidden md:block absolute"
            style={{
              top: 36,
              left: "16.67%",
              right: "16.67%",
              height: 1,
              backgroundColor: B.sandDk,
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {[
              {
                step: "01",
                title: "Select Your Plan",
                desc: "Choose a single assessment or annual monitoring package.",
              },
              {
                step: "02",
                title: "Complete Six Factors",
                desc: "Answer six structured questions about your income system. Under two minutes.",
              },
              {
                step: "03",
                title: "Receive Your Report",
                desc: "Get your Income Stability Score™ and full PDF assessment record instantly.",
              },
            ].map((item, i) => (
              <div key={item.step} className="flex flex-col items-center text-center relative">
                {/* Step number circle */}
                <div
                  className="flex items-center justify-center rounded-full relative z-10 mb-6"
                  style={{
                    width: 72,
                    height: 72,
                    backgroundColor: i === 2 ? B.navy : "#ffffff",
                    border: i === 2 ? "none" : `1.5px solid ${B.sandDk}`,
                    boxShadow: i === 2 ? "0 4px 20px rgba(14, 26, 43, 0.15)" : "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <span
                    className="text-[22px] font-semibold"
                    style={{ color: i === 2 ? "#ffffff" : B.navy }}
                  >
                    {item.step}
                  </span>
                </div>

                {/* Content card */}
                <div
                  className="rounded-lg w-full"
                  style={{
                    backgroundColor: i === 2 ? B.sand : "#ffffff",
                    border: `1px solid ${B.sandDk}`,
                    padding: "24px 20px",
                  }}
                >
                  <div className="text-[15px] font-semibold mb-2" style={{ color: B.navy }}>{item.title}</div>
                  <p className="text-[13px] leading-relaxed" style={{ color: B.muted }}>{item.desc}</p>
                </div>

                {/* Mobile arrow between steps */}
                {i < 2 && (
                  <div className="md:hidden flex justify-center mt-4 -mb-4">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3v10m0 0l-3-3m3 3l3-3" stroke={B.light} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INCOME STABILITY CLASSIFICATION — Unified Section ============ */}
      <section style={{ backgroundColor: "#ffffff", paddingTop: 16, paddingBottom: 120 }}>
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
          {/* Header */}
          <div className="text-center" style={{ marginBottom: 48 }}>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: B.light }}>
              Official Scoring Framework · Model RP-1.0
            </div>
            <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight" style={{ color: B.navy, marginBottom: 16 }}>
              Income Stability Classification Scale
            </h2>
            <p className="text-base leading-relaxed mx-auto" style={{ color: B.muted, maxWidth: 600 }}>
              The Income Stability Score™ places every income structure on a standardized 0–100 scale and classifies it into one of four stability tiers.
            </p>
          </div>

          {/* Spectrum bar with tick marks */}
          <div className="mx-auto" style={{ maxWidth: 880, marginBottom: 0 }}>
            <div style={{ position: "relative" }}>
              <div className="rounded-t-lg" style={{ height: 12, background: B.gradient }} />
              {/* Tier separators */}
              {[39, 59, 79].map((pos) => (
                <div
                  key={pos}
                  style={{
                    position: "absolute",
                    left: `${pos}%`,
                    top: 0,
                    width: 2,
                    height: 12,
                    backgroundColor: "rgba(255,255,255,0.5)",
                  }}
                />
              ))}
              {/* Tick labels */}
              <div className="flex justify-between px-1" style={{ marginTop: 4 }}>
                {[0, 20, 40, 60, 80, 100].map((tick) => (
                  <span key={tick} className="text-[9px] font-medium" style={{ color: B.light }}>{tick}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Four tier cards — directly connected to spectrum bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ maxWidth: 880, margin: "16px auto 0" }}>
            {[
              { range: "0\u201339", label: "Limited", summary: "Fragile", desc: "Income heavily dependent on active work. Income stops when work stops. No structural support.", color: "#DC2626" },
              { range: "40\u201359", label: "Developing", summary: "Partial", desc: "Some recurring elements exist but income still depends primarily on active effort. Early structural support.", color: "#F59E0B" },
              { range: "60\u201379", label: "Established", summary: "Resilient", desc: "Diversified sources with meaningful forward visibility. Can absorb disruption without income loss.", color: B.teal },
              { range: "80\u2013100", label: "High", summary: "Durable", desc: "Income continues with minimal active effort. Multiple persistent revenue sources provide structural durability.", color: B.navy },
            ].map((tier, i) => (
              <div
                key={tier.label}
                style={{
                  backgroundColor: "#ffffff",
                  borderLeft: `1px solid ${B.sandDk}`,
                  borderRight: i === 3 ? `1px solid ${B.sandDk}` : "none",
                  borderBottom: `1px solid ${B.sandDk}`,
                  padding: "24px 20px 28px",
                }}
              >
                {/* Color indicator + range */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-sm" style={{ width: 4, height: 32, backgroundColor: tier.color }} />
                  <div>
                    <div className="text-[26px] font-bold leading-none" style={{ color: B.navy }}>{tier.range}</div>
                  </div>
                </div>

                {/* Tier label */}
                <div className="text-[15px] font-semibold mb-1" style={{ color: tier.color }}>
                  {tier.label} Stability
                </div>

                {/* One-word summary */}
                <div className="text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: B.light }}>
                  {tier.summary} income structure
                </div>

                {/* Description */}
                <p className="text-[12px] leading-[1.7]" style={{ color: B.muted }}>
                  {tier.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Model reference */}
          <div className="text-center" style={{ marginTop: 40 }}>
            <p className="text-[12px] font-medium" style={{ color: B.muted }}>
              Classifications are fixed under <strong style={{ color: B.navy }}>Model RP-1.0</strong> and reflect income structure at the time the assessment is completed.
            </p>
            <p className="text-[11px] mt-2" style={{ color: B.light }}>
              Band thresholds are deterministic and do not change between assessments.
            </p>
          </div>
        </div>
      </section>

      {/* ============ SIX FACTORS — Model Understanding ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6 text-center" style={{ paddingTop: 96, paddingBottom: 120 }}>
        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight" style={{ color: B.navy, marginBottom: 16 }}>
          Six Structural Factors Determine Income Stability
        </h2>
        <p className="text-base leading-relaxed mx-auto" style={{ color: B.muted, marginBottom: 24, maxWidth: 620 }}>
          The Income Stability Score™ evaluates six structural dimensions across two pillars to determine overall stability.
        </p>

        {/* Pillar weight indicators */}
        <div className="flex justify-center gap-8 mb-12">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: B.navy }} />
            <span className="text-[12px] font-medium" style={{ color: B.muted }}>Structure Pillar — 60% weight</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: B.teal }} />
            <span className="text-[12px] font-medium" style={{ color: B.muted }}>Stability Pillar — 40% weight</span>
          </div>
        </div>

        {/* Two-pillar layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-left" style={{ maxWidth: 920, margin: "0 auto" }}>

          {/* STRUCTURE PILLAR */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="rounded" style={{ width: 4, height: 20, backgroundColor: B.navy }} />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: B.navy }}>Structure Pillar</div>
                <div className="text-[10px]" style={{ color: B.light }}>How income is built and organized</div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { key: "01", title: "Recurring Income Proportion", desc: "The share of income that renews automatically — without renegotiation or finding new clients." },
                { key: "03", title: "Number of Income Sources", desc: "Total active, independent sources contributing to income. More sources create structural redundancy." },
                { key: "04", title: "Forward Revenue Visibility", desc: "How much future income is already committed, contracted, or scheduled. Reduces uncertainty." },
              ].map((factor) => (
                <div
                  key={factor.key}
                  className="rounded-lg overflow-hidden flex"
                  style={{ backgroundColor: "#ffffff", border: `1px solid ${B.sandDk}` }}
                >
                  {/* Left accent */}
                  <div style={{ width: 4, backgroundColor: B.navy, flexShrink: 0 }} />
                  <div className="flex-1 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="flex items-center justify-center text-[12px] font-bold rounded"
                        style={{ width: 28, height: 28, backgroundColor: B.sand, color: B.navy }}
                      >
                        {factor.key}
                      </span>
                      <span className="text-[14px] font-semibold" style={{ color: B.navy }}>{factor.title}</span>
                    </div>
                    <p className="text-[13px] leading-relaxed" style={{ color: B.muted }}>{factor.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STABILITY PILLAR */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="rounded" style={{ width: 4, height: 20, backgroundColor: B.teal }} />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: B.teal }}>Stability Pillar</div>
                <div className="text-[10px]" style={{ color: B.light }}>How income holds up under pressure</div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { key: "02", title: "Income Concentration", desc: "How dependent income is on a small number of sources. High concentration increases exposure to disruption." },
                { key: "05", title: "Earnings Variability", desc: "Month-to-month consistency of income. Lower variability means more predictable cash flow." },
                { key: "06", title: "Income Continuity Without Active Labor", desc: "Whether income continues when you stop working. The key differentiator between fragile and durable income." },
              ].map((factor) => (
                <div
                  key={factor.key}
                  className="rounded-lg overflow-hidden flex"
                  style={{ backgroundColor: "#ffffff", border: `1px solid ${B.sandDk}` }}
                >
                  {/* Left accent */}
                  <div style={{ width: 4, backgroundColor: B.teal, flexShrink: 0 }} />
                  <div className="flex-1 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="flex items-center justify-center text-[12px] font-bold rounded"
                        style={{ width: 28, height: 28, backgroundColor: B.sand, color: B.teal }}
                      >
                        {factor.key}
                      </span>
                      <span className="text-[14px] font-semibold" style={{ color: B.navy }}>{factor.title}</span>
                    </div>
                    <p className="text-[13px] leading-relaxed" style={{ color: B.muted }}>{factor.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-[13px] mx-auto" style={{ color: B.light, marginTop: 48, maxWidth: 640 }}>
          All six factors are evaluated within Model RP-1.0. Pillar weights are fixed and deterministic.
        </p>
      </section>

      {/* ============ STRUCTURAL STABILITY MODEL ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6" style={{ paddingTop: 96, paddingBottom: 120 }}>
        <div className="text-center" style={{ marginBottom: 72 }}>
          <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight" style={{ color: B.navy, marginBottom: 28 }}>
            Structural Stability Model (RP-1.0)
          </h2>
          <p className="text-base" style={{ color: B.muted }}>
            How the Income Stability Score™ is structurally determined.
          </p>
        </div>
        <StabilityModelDiagram />
        <p className="text-[13px] text-center mx-auto" style={{ color: B.light, marginTop: 72, maxWidth: 640 }}>
          The Structural Stability Model evaluates six income factors across three core drivers to produce the Income Stability Score™.
        </p>
      </section>

      {/* ============ SAMPLE REPORT PREVIEW ============ */}
      <SampleReportPreview />

      {/* ============ INDUSTRY PATTERNS — Real-World Context ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6 text-center" style={{ paddingTop: 96, paddingBottom: 120 }}>
        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight" style={{ color: B.navy, marginBottom: 16 }}>
          How Income Structures Become More Stable
        </h2>
        <p className="text-base leading-relaxed mx-auto" style={{ color: B.muted, marginBottom: 40, maxWidth: 640 }}>
          High-stability income systems tend to share common structural characteristics, regardless of profession.
        </p>
        <p className="text-[13px] mx-auto" style={{ color: B.light, marginBottom: 32, maxWidth: 640 }}>
          Explore structural patterns that increase income stability.
        </p>

        <div className="flex flex-col gap-3 text-left" style={{ maxWidth: 720, margin: "0 auto" }}>
          {INDUSTRY_EXAMPLES.map((ex, i) => {
            const isOpen = openIndustry === i;
            const colors = [B.navy, B.purple, B.teal];
            const cardColor = colors[i];
            return (
              <div
                key={ex.industry}
                className="rounded-lg border overflow-hidden transition-all"
                style={{ borderColor: isOpen ? cardColor : B.sandDk, backgroundColor: "#ffffff" }}
              >
                <button
                  onClick={() => setOpenIndustry(isOpen ? null : i)}
                  className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 transition-colors"
                  style={{ backgroundColor: isOpen ? cardColor : "#ffffff" }}
                >
                  <span className="text-[14px] sm:text-[15px] font-semibold" style={{ color: isOpen ? "#ffffff" : B.navy }}>
                    {ex.industry}
                  </span>
                  <svg
                    width="20" height="20" viewBox="0 0 20 20" fill="none"
                    className="shrink-0 transition-transform duration-300"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    <path d="M5 8l5 5 5-5" stroke={isOpen ? "#ffffff" : B.light} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div
                  className="transition-all duration-300 ease-in-out overflow-hidden"
                  style={{ maxHeight: isOpen ? 400 : 0, opacity: isOpen ? 1 : 0 }}
                >
                  <div className="px-5 sm:px-6 py-5 sm:py-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: B.teal, marginBottom: 12 }}>
                          More Stable Income Systems Often Include
                        </div>
                        <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {ex.stable.map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-[13px] sm:text-[14px]" style={{ color: B.muted }}>
                              <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: B.teal }} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: B.light, marginBottom: 12 }}>
                          Common Sources of Instability
                        </div>
                        <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {ex.unstable.map((item) => (
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
              </div>
            );
          })}
        </div>
      </section>


      {/* ============ FAQ ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6" style={{ paddingTop: 96, paddingBottom: 120 }}>
        <div className="text-center" style={{ marginBottom: 56 }}>
          <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight" style={{ color: B.navy, marginBottom: 16 }}>
            Frequently Asked Questions
          </h2>
          <p className="text-base leading-relaxed mx-auto" style={{ color: B.muted, maxWidth: 560 }}>
            Common questions about the Income Stability Score™ and assessment process.
          </p>
        </div>
        <div className="mx-auto" style={{ maxWidth: 680 }}>
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="border-b"
                style={{ borderColor: B.sandDk }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full py-5 flex items-center justify-between gap-4 text-left"
                >
                  <span className="text-[15px] font-medium" style={{ color: B.navy }}>
                    {item.q}
                  </span>
                  <svg
                    width="18" height="18" viewBox="0 0 18 18" fill="none"
                    className="shrink-0 transition-transform duration-200"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    <path d="M4.5 7l4.5 4 4.5-4" stroke={B.light} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ maxHeight: isOpen ? 200 : 0, opacity: isOpen ? 1 : 0 }}
                >
                  <p className="text-[14px] leading-relaxed pb-5" style={{ color: B.muted }}>
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ FINAL CTA — Action ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6 text-center" style={{ paddingTop: 120, paddingBottom: 120 }}>
        <h2 className="text-[26px] sm:text-[32px] md:text-[38px] font-semibold leading-tight" style={{ color: B.navy, marginBottom: 28 }}>
          See Where Your Income Structure Falls
        </h2>
        <p className="text-base leading-relaxed" style={{ color: B.muted, marginBottom: 20 }}>
          Complete the structural assessment and receive your Income Stability Score™ report instantly.
        </p>
        <p className="text-[13px]" style={{ color: B.light, marginBottom: 40 }}>
          Assessment based on Model RP-1.0 structural scoring.
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center px-8 py-4 text-[15px] font-medium rounded transition-opacity hover:opacity-90"
          style={{ backgroundColor: B.purple, color: "#ffffff" }}
        >
          Get Score
        </Link>
        {/* Process indicator */}
        <div className="flex flex-col items-center gap-2 mt-6" style={{ color: B.muted }}>
          <span className="text-[13px]">1. Complete Six Structural Factors</span>
          <span className="text-[13px]">2. See your Income Stability Score™</span>
          <span className="text-[13px]">3. Receive your PDF assessment report</span>
        </div>
        {/* Proof points */}
        <div className="flex flex-col items-center gap-1 mt-6">
          <p className="text-[13px]" style={{ color: B.muted }}>
            Assessment time: <strong style={{ color: B.navy }}>under two minutes</strong>
          </p>
          <p className="text-[13px]" style={{ color: B.muted }}>
            Instant <strong style={{ color: B.navy }}>PDF assessment record</strong>
          </p>
        </div>
      </section>

      {/* ============ MODEL GOVERNANCE ============ */}
      <ModelGovernance />

      {/* ============ DISCLAIMER ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6 text-center" style={{ paddingTop: 32, paddingBottom: 64 }}>
        <p className="text-[13px] leading-relaxed mx-auto" style={{ color: B.light, maxWidth: 680 }}>
          The Income Stability Score™ is a structural income assessment based on information provided by the user. It does not provide financial advice and does not predict future financial outcomes.
        </p>
      </section>
    </div>
  );
}
