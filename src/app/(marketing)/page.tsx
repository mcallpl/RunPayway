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
/* REPORT PREVIEW CAROUSEL — App Store-style stacked report screens     */
/* ------------------------------------------------------------------ */

function ReportPageShell({ children, insight }: { children: React.ReactNode; insight: string }) {
  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="px-4 py-2.5 border-b flex items-center justify-between shrink-0" style={{ borderColor: B.sandDk }}>
        <div className="flex items-center gap-2">
          <span className="text-[7px] font-bold tracking-[0.08em]" style={{ color: B.navy }}>RUNPAYWAY™</span>
          <span className="text-[6px]" style={{ color: B.light }}>Income Stability Assessment · Model RP-1.0</span>
        </div>
        <span className="text-[6px]" style={{ color: B.light }}>c754ee23… · 2026-03-10</span>
      </div>
      {/* Insight bar */}
      <div className="mx-4 mt-3 mb-2 rounded" style={{ backgroundColor: B.sand }}>
        <div className="flex items-stretch">
          <div className="w-[3px] rounded-l shrink-0" style={{ backgroundColor: B.teal }} />
          <p className="text-[6px] italic leading-relaxed px-2.5 py-2" style={{ color: B.muted }}>{insight}</p>
        </div>
      </div>
      {/* Body */}
      <div className="flex-1 px-4 pb-3 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function ReportScreen1() {
  return (
    <ReportPageShell insight="This income system scores 58 under Model RP-1.0, placing it in the Developing Stability classification band.">
      <div className="flex gap-4">
        <div className="flex-1">
          <p className="text-[6px] mb-1.5" style={{ color: B.muted }}>This report shows how reliable an income system is over time.</p>
          <div className="text-[6px] font-bold uppercase tracking-wider mb-0.5" style={{ color: B.teal }}>
            RUNPAYWAY STABILITY SCORE™
          </div>
          <div className="text-[28px] font-bold leading-none" style={{ color: B.navy }}>58</div>
          <div className="text-[8px] font-semibold" style={{ color: B.navy }}>Developing Stability</div>
          <p className="text-[5px] mt-0.5" style={{ color: B.light }}>Score Range: 0–100 · Higher = more reliable income over time</p>
          <div className="mt-2">
            <p className="text-[6px] mb-1" style={{ color: B.muted }}><strong style={{ color: B.navy }}>56th percentile</strong> within Consulting / Professional Services</p>
          </div>
          {/* Band pills */}
          <div className="flex gap-1 mt-2">
            {[
              { label: "High", range: "80–100", active: false },
              { label: "Estab.", range: "60–79", active: false },
              { label: "Devel.", range: "40–59", active: true },
              { label: "Limited", range: "0–39", active: false },
            ].map((b) => (
              <div
                key={b.label}
                className="flex-1 rounded text-center py-1"
                style={{
                  backgroundColor: b.active ? B.purple : B.sand,
                  color: b.active ? "#fff" : B.light,
                }}
              >
                <div className="text-[6px] font-semibold">{b.label}</div>
                <div className="text-[5px]">{b.range}</div>
              </div>
            ))}
          </div>
          {/* Profile */}
          <div className="mt-2 pt-1.5 border-t" style={{ borderColor: B.sandDk }}>
            <div className="text-[6px] font-bold uppercase tracking-wider mb-1" style={{ color: B.muted }}>Profile</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[5.5px]" style={{ color: B.muted }}>
              <span>Assessment Title: <strong style={{ color: B.navy }}>Morris Consulting Q3</strong></span>
              <span>Structure: <strong style={{ color: B.navy }}>Business Owner / Firm</strong></span>
              <span>Classification: <strong style={{ color: B.navy }}>Business Entity</strong></span>
              <span>Revenue: <strong style={{ color: B.navy }}>Mixed Revenue Structure</strong></span>
            </div>
          </div>
        </div>
        {/* Indicators sidebar */}
        <div className="w-[72px] shrink-0 rounded-lg p-2" style={{ backgroundColor: B.sand }}>
          <div className="text-[6px] font-bold uppercase tracking-wider mb-1.5" style={{ color: B.muted }}>Indicators</div>
          <div className="text-[5px] mb-0.5" style={{ color: B.light }}>Band</div>
          <div className="text-[7px] font-bold mb-1" style={{ color: B.navy }}>Developing Stability</div>
          <div className="text-[5px] mb-0.5" style={{ color: B.light }}>Score</div>
          <div className="text-[9px] font-bold mb-1.5" style={{ color: B.navy }}>58</div>
          <div className="border-t pt-1" style={{ borderColor: B.sandDk }}>
            {[
              ["Continues", "Moderate"],
              ["Sources", "Moderate"],
              ["Scheduled", "High"],
              ["Stability", "Moderate"],
              ["Work Dep.", "Moderate"],
              ["Concentration", "Low"],
            ].map(([k, v]) => (
              <div key={k} className="mb-0.5">
                <div className="text-[4.5px]" style={{ color: B.light }}>{k}</div>
                <div className="text-[6px] font-semibold" style={{ color: B.navy }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ReportPageShell>
  );
}

function ReportScreen2() {
  return (
    <ReportPageShell insight="This income system is classified as Transitional on the labor–asset spectrum under the RunPayway structural framework.">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="text-[7px] font-bold uppercase tracking-wider mb-1" style={{ color: B.muted }}>Income Structure Map</div>
          <p className="text-[6px] mb-2" style={{ color: B.muted }}>Morris Consulting Q3&apos;s income comes from three types of sources.</p>
          {/* Bars */}
          {[
            { label: "Active Income", sub: "Earned by doing work", pct: 50, color: B.navy },
            { label: "Semi-Persistent", sub: "Repeats for a while, then stops", pct: 62, color: B.teal },
            { label: "Persistent", sub: "Continues with little work", pct: 50, color: `${B.navy}` },
          ].map((bar) => (
            <div key={bar.label} className="mb-1.5">
              <div className="flex justify-between text-[6px]">
                <span style={{ color: B.navy, fontWeight: 600 }}>{bar.label}</span>
                <span style={{ color: B.muted }}>{bar.pct}%</span>
              </div>
              <div className="text-[5px] mb-0.5" style={{ color: B.teal }}>{bar.sub}</div>
              <div className="h-[5px] rounded-full" style={{ backgroundColor: B.sandDk }}>
                <div className="h-full rounded-full" style={{ width: `${bar.pct}%`, background: `linear-gradient(90deg, ${B.navy}, ${B.teal})` }} />
              </div>
            </div>
          ))}

          {/* Structural Indicators */}
          <div className="mt-2 pt-1.5 border-t" style={{ borderColor: B.sandDk }}>
            <div className="text-[6px] font-bold uppercase tracking-wider mb-1" style={{ color: B.muted }}>Structural Indicators</div>
            <div className="grid grid-cols-2 gap-1">
              {[
                ["Income That Continues", "Moderate"],
                ["Number of Income Sources", "Moderate"],
                ["Income Already Scheduled", "High"],
                ["Monthly Income Stability", "Moderate"],
                ["Dependence on Your Personal Work", "Moderate"],
                ["Dependence on One Client or Source", "Low"],
              ].map(([label, val]) => (
                <div key={label} className="flex items-center justify-between rounded px-1.5 py-1" style={{ backgroundColor: B.sand }}>
                  <span className="text-[5px]" style={{ color: B.muted }}>{label}</span>
                  <span className="text-[5.5px] font-semibold" style={{ color: B.navy }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Work-Asset Spectrum */}
          <div className="mt-2 pt-1.5 border-t" style={{ borderColor: B.sandDk }}>
            <div className="text-[6px] font-bold uppercase tracking-wider mb-1" style={{ color: B.muted }}>Work–Asset Spectrum</div>
            <div className="flex gap-1">
              {[
                { label: "Work-Dependent", active: false },
                { label: "Transitional", active: true },
                { label: "Asset-Supported", active: false },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex-1 text-center rounded py-1"
                  style={{
                    backgroundColor: s.active ? B.purple : B.sand,
                    color: s.active ? "#fff" : B.light,
                  }}
                >
                  <div className="text-[5.5px] font-semibold">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Indicators sidebar */}
        <div className="w-[72px] shrink-0 rounded-lg p-2" style={{ backgroundColor: B.sand }}>
          <div className="text-[6px] font-bold uppercase tracking-wider mb-1.5" style={{ color: B.muted }}>Indicators</div>
          <div className="text-[5px] mb-0.5" style={{ color: B.light }}>Band</div>
          <div className="text-[7px] font-bold mb-1" style={{ color: B.navy }}>Developing Stability</div>
          <div className="text-[5px] mb-0.5" style={{ color: B.light }}>Score</div>
          <div className="text-[9px] font-bold mb-1.5" style={{ color: B.navy }}>58</div>
          <div className="border-t pt-1" style={{ borderColor: B.sandDk }}>
            {[
              ["Continues", "Moderate"],
              ["Sources", "Moderate"],
              ["Scheduled", "High"],
              ["Stability", "Moderate"],
              ["Work Dep.", "Moderate"],
              ["Concentration", "Low"],
            ].map(([k, v]) => (
              <div key={k} className="mb-0.5">
                <div className="text-[4.5px]" style={{ color: B.light }}>{k}</div>
                <div className="text-[6px] font-semibold" style={{ color: B.navy }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ReportPageShell>
  );
}

function ReportScreen3() {
  return (
    <ReportPageShell insight="Within the Consulting / Professional Services peer benchmark group, this income system falls in the Developing Stability band.">
      <div className="flex gap-4">
        <div className="flex-1">
          {/* Risk Exposure */}
          <div className="rounded-lg border p-3 mb-2" style={{ borderColor: B.sandDk }}>
            <div className="text-[7px] font-bold uppercase tracking-wider mb-1.5" style={{ color: B.muted }}>Risk Exposure</div>
            <div className="text-[5.5px] font-bold uppercase tracking-wider mb-0.5" style={{ color: B.teal }}>Primary Risk</div>
            <div className="text-[7px] font-semibold mb-1.5" style={{ color: B.navy }}>Income Continuity Without Active Labor</div>
            <div className="text-[5.5px] font-bold uppercase tracking-wider mb-0.5" style={{ color: B.teal }}>How It Works</div>
            <p className="text-[5.5px] mb-1.5" style={{ color: B.muted }}>Income depends on ongoing work. If work stops, income stops too.</p>
            <div className="text-[5.5px] font-bold uppercase tracking-wider mb-0.5" style={{ color: B.teal }}>Impact on Stability</div>
            <p className="text-[5.5px]" style={{ color: B.muted }}>A health issue, break, or slowdown could mean no income during that time.</p>
          </div>
          {/* Main Constraint */}
          <div className="mb-2">
            <div className="text-[6px] font-bold uppercase tracking-wider mb-0.5" style={{ color: B.muted }}>Main Constraint</div>
            <div className="text-[7px] font-semibold" style={{ color: B.navy }}>Income Continuity Without Active Labor</div>
          </div>
          {/* Priority */}
          <div className="mb-2">
            <div className="text-[6px] font-bold uppercase tracking-wider mb-0.5" style={{ color: B.muted }}>Priority</div>
            <div className="text-[7px] font-semibold" style={{ color: B.navy }}>Increase Income Persistence</div>
          </div>
          {/* Stability Trajectory */}
          <div className="rounded-lg p-3" style={{ backgroundColor: B.sand }}>
            <div className="text-[6px] font-bold uppercase tracking-wider mb-1.5" style={{ color: B.muted }}>Stability Trajectory</div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-[5px]" style={{ color: B.light }}>Current Score</div>
                <div className="text-[18px] font-bold" style={{ color: B.navy }}>58</div>
                <div className="text-[5px]" style={{ color: B.muted }}>Developing Stability</div>
              </div>
              <div className="text-[12px]" style={{ color: B.light }}>→</div>
              <div className="text-center">
                <div className="text-[5px]" style={{ color: B.light }}>Potential Score</div>
                <div className="text-[18px] font-bold" style={{ color: B.teal }}>61</div>
                <div className="text-[5px]" style={{ color: B.muted }}>Established Stability</div>
              </div>
            </div>
          </div>
        </div>
        {/* Indicators sidebar */}
        <div className="w-[72px] shrink-0 rounded-lg p-2" style={{ backgroundColor: B.sand }}>
          <div className="text-[6px] font-bold uppercase tracking-wider mb-1.5" style={{ color: B.muted }}>Indicators</div>
          <div className="text-[5px] mb-0.5" style={{ color: B.light }}>Band</div>
          <div className="text-[7px] font-bold mb-1" style={{ color: B.navy }}>Developing Stability</div>
          <div className="text-[5px] mb-0.5" style={{ color: B.light }}>Score</div>
          <div className="text-[9px] font-bold mb-1.5" style={{ color: B.navy }}>58</div>
          <div className="border-t pt-1" style={{ borderColor: B.sandDk }}>
            {[
              ["Continues", "Moderate"],
              ["Sources", "Moderate"],
              ["Scheduled", "High"],
              ["Stability", "Moderate"],
              ["Work Dep.", "Moderate"],
              ["Concentration", "Low"],
            ].map(([k, v]) => (
              <div key={k} className="mb-0.5">
                <div className="text-[4.5px]" style={{ color: B.light }}>{k}</div>
                <div className="text-[6px] font-semibold" style={{ color: B.navy }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ReportPageShell>
  );
}

function ReportCarousel() {
  const [active, setActive] = useState(0);
  const screens = [ReportScreen1, ReportScreen2, ReportScreen3];
  const labels = ["Score Overview", "Income Structure", "Risk & Trajectory"];

  useEffect(() => {
    const timer = setInterval(() => setActive((p) => (p + 1) % screens.length), 5000);
    return () => clearInterval(timer);
  }, [screens.length]);

  return (
    <div className="relative" style={{ perspective: 1200 }}>
      {/* Stacked screens */}
      <div className="relative" style={{ width: "100%", aspectRatio: "4 / 3.2" }}>
        {screens.map((Screen, i) => {
          const offset = ((i - active) + screens.length) % screens.length;
          const isActive = offset === 0;
          const isBehind1 = offset === 1;
          const isBehind2 = offset === 2;
          return (
            <div
              key={i}
              className="absolute inset-0 rounded-xl overflow-hidden transition-all duration-700 ease-out cursor-pointer"
              style={{
                backgroundColor: "#ffffff",
                border: `1px solid ${B.sandDk}`,
                boxShadow: isActive
                  ? "0 16px 48px rgba(14, 26, 43, 0.12), 0 4px 12px rgba(14, 26, 43, 0.06)"
                  : "0 4px 16px rgba(14, 26, 43, 0.06)",
                transform: isActive
                  ? "translateY(0) scale(1)"
                  : isBehind1
                  ? "translateY(16px) scale(0.94)"
                  : "translateY(30px) scale(0.88)",
                opacity: isBehind2 ? 0.4 : isBehind1 ? 0.7 : 1,
                zIndex: isActive ? 30 : isBehind1 ? 20 : 10,
                pointerEvents: isActive ? "auto" : "none",
              }}
              onClick={() => setActive((active + 1) % screens.length)}
            >
              <Screen />
            </div>
          );
        })}
      </div>

      {/* Dot nav + labels */}
      <div className="flex items-center justify-center gap-3 mt-4">
        {labels.map((label, i) => (
          <button
            key={label}
            onClick={() => setActive(i)}
            className="flex items-center gap-1.5 transition-all"
            style={{ opacity: i === active ? 1 : 0.4 }}
          >
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: i === active ? 20 : 6,
                height: 6,
                backgroundColor: i === active ? B.navy : B.light,
              }}
            />
            <span className="text-[10px] font-medium hidden sm:inline" style={{ color: i === active ? B.navy : B.light }}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

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
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6" style={{ paddingTop: 48, paddingBottom: 72 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h1 className="text-[32px] sm:text-[44px] md:text-[56px] font-semibold leading-[1.08]" style={{ color: B.navy, marginBottom: 24 }}>
              The Standard for Measuring Income Stability
            </h1>
            <p className="text-base leading-relaxed" style={{ color: B.muted, marginBottom: 8 }}>
              The <strong style={{ color: B.navy }}>Income Stability Score™</strong> determines the structural stability of income under Model RP-1.0.
            </p>
            <p className="text-base leading-relaxed" style={{ color: B.muted, marginBottom: 48 }}>
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
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <p className="text-[13px]" style={{ color: B.muted }}>
                  Assessment time: <strong style={{ color: B.navy }}>Under two minutes</strong>
                </p>
                <p className="text-[13px]" style={{ color: B.muted }}>
                  Instant <strong style={{ color: B.navy }}>PDF assessment record</strong>
                </p>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <ReportCarousel />
          </div>
        </div>
      </section>

      {/* ============ 2. SCORE CURIOSITY — Orientation ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight" style={{ color: B.navy, marginBottom: 48 }}>
          Where Would Your Income Stability Likely Fall?
        </h2>
        {/* Stability spectrum — visually dominant */}
        <div style={{ maxWidth: 640 }}>
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

      {/* ============ 3. EXAMPLE DIAGNOSTIC OUTPUT — Product Preview ============ */}
      <section
        style={{
          background: `linear-gradient(135deg, ${B.navy} 0%, ${B.purple} 50%, ${B.navy} 100%)`,
          paddingTop: 72,
          paddingBottom: 72,
        }}
      >
        <div className="max-w-[680px] mx-auto px-5 sm:px-6">
          <div className="text-center" style={{ marginBottom: 48 }}>
            <h2 className="text-[24px] sm:text-[30px] font-semibold" style={{ color: "#ffffff", marginBottom: 12 }}>
              Your Complete Assessment Report
            </h2>
            <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.55)" }}>
              Six pages of structural income analysis, delivered instantly as a PDF.
            </p>
          </div>

          <ReportCarousel />

          {/* Supporting text + CTA */}
          <p className="text-[13px] text-center" style={{ color: "rgba(255,255,255,0.55)", marginTop: 48 }}>
            Each diagnostic generates an official PDF assessment record.
          </p>
          <div className="text-center" style={{ marginTop: 24 }}>
            <Link
              href="/pricing"
              className="inline-flex items-center px-7 py-3.5 text-sm font-medium rounded transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#ffffff", color: B.navy }}
            >
              Get Your Score
            </Link>
          </div>
        </div>
      </section>

      {/* ============ 4. SIX FACTORS — Model Understanding ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6" style={{ paddingTop: 72, paddingBottom: 72 }}>
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
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight" style={{ color: B.navy, marginBottom: 48 }}>
          What High-Stability Income Systems Do Differently
        </h2>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2" style={{ marginBottom: 24 }}>
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
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6" style={{ paddingTop: 72, paddingBottom: 72 }}>
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
        <div className="flex items-center gap-3" style={{ maxWidth: 480, marginBottom: 24 }}>
          <div className="flex-1 h-2 rounded-full" style={{ background: B.gradient }} />
          <div className="text-[11px] font-semibold uppercase tracking-wider shrink-0" style={{ color: B.teal }}>
            More Stable
          </div>
        </div>
        <p className="text-[14px] leading-relaxed" style={{ color: B.muted, maxWidth: 640 }}>
          Income systems become more stable as income moves from active sources toward persistent sources.
        </p>
      </section>

      {/* ============ 8. CLASSIFICATION SCALE — Score Classification ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight" style={{ color: B.navy, marginBottom: 48 }}>
          Income Stability Classification Scale
        </h2>
        {/* Spectrum bar — visually dominant */}
        <div className="rounded-full" style={{ height: 12, background: B.gradient, maxWidth: 640, marginBottom: 24 }} />
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
        <p className="text-[13px]" style={{ color: B.light, marginTop: 24 }}>
          The classification reflects income structure at the time the assessment is completed under Model RP-1.0.
        </p>
      </section>

      {/* ============ 9. FINAL CTA — Action ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight" style={{ color: B.navy, marginBottom: 12 }}>
          Measure your Income Stability Score™
        </h2>
        <p className="text-base leading-relaxed" style={{ color: B.muted, marginBottom: 8 }}>
          Complete the structural income assessment and receive your Income Stability Score™ report.
        </p>
        <p className="text-base" style={{ color: B.muted, marginBottom: 48 }}>
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

      {/* ============ 10. MODEL GOVERNANCE ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6" style={{ paddingTop: 72, paddingBottom: 48 }}>
        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight" style={{ color: B.navy, marginBottom: 24 }}>
          Model Governance
        </h2>
        <div className="text-base leading-relaxed" style={{ color: B.muted, maxWidth: 680, display: "flex", flexDirection: "column", gap: 16 }}>
          <p>The <strong style={{ color: B.navy }}>Income Stability Score™</strong> is generated under <strong style={{ color: B.navy }}>Model RP-1.0</strong> using fixed scoring criteria.</p>
          <p>If the methodology changes, a <strong style={{ color: B.navy }}>new model version</strong> is issued.</p>
          <p>Previously generated assessments remain tied to the model version used when they were created.</p>
        </div>
      </section>

      {/* ============ DISCLAIMER ============ */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-6" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <p className="text-[13px] leading-relaxed" style={{ color: B.light }}>
          The Income Stability Score™ is a structural income assessment based on information provided by the user. It does not provide financial advice and does not predict future financial outcomes.
        </p>
      </section>
    </div>
  );
}
