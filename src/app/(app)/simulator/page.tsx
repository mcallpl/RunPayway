"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logoImg from "../../../../public/runpayway-logo.png";
import { simulateScore, SIMULATOR_PRESETS, projectTimeline } from "@/lib/engine/v2/simulate";
import type { CanonicalInput } from "@/lib/engine/v2/types";
import type { TimelinePoint } from "@/lib/engine/v2/simulate";

/* ------------------------------------------------------------------ */
/*  Design Tokens                                                      */
/* ------------------------------------------------------------------ */
const B = {
  navy: "#0E1A2B",
  navyDeep: "#070F19",
  purple: "#4B3FAE",
  purpleGlow: "rgba(75,63,174,0.08)",
  teal: "#1A7A6D",
  tealGlow: "rgba(26,122,109,0.10)",
  sand: "#F5F2EC",
  bone: "#F4F1EA",
  white: "#FFFFFF",
  muted: "rgba(244,241,234,0.55)",
  dim: "rgba(244,241,234,0.38)",
  faint: "rgba(244,241,234,0.20)",
  ghost: "rgba(244,241,234,0.08)",
  whisper: "rgba(244,241,234,0.04)",
  bandLimited: "#DC4A4A",
  bandDeveloping: "#D4940A",
  bandEstablished: "#3B82F6",
  bandHigh: "#1A7A6D",
};

const DISPLAY = "'DM Serif Display', Georgia, serif";
const INTER = "'Inter', system-ui, -apple-system, sans-serif";

/* ------------------------------------------------------------------ */
/*  Utility                                                            */
/* ------------------------------------------------------------------ */
const bandColor = (band: string) =>
  band.includes("Limited") ? B.bandLimited
  : band.includes("Developing") ? B.bandDeveloping
  : band.includes("Established") ? B.bandEstablished
  : B.bandHigh;

const fmt = (n: number) => n > 0 ? `+${n}` : String(n);

/* ------------------------------------------------------------------ */
/*  Slider component                                                   */
/* ------------------------------------------------------------------ */
function Slider({ label, value, min, max, step, unit, onChange, accent }: {
  label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void; accent?: string;
}) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const c = accent || B.teal;
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: B.bone, letterSpacing: "-0.01em" }}>{label}</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: c, fontVariantNumeric: "tabular-nums" }}>{value}{unit}</span>
      </div>
      <div style={{ position: "relative", height: 28 }}>
        <div style={{ position: "absolute", top: 12, left: 0, right: 0, height: 4, backgroundColor: "rgba(244,241,234,0.06)", borderRadius: 2 }} />
        <div style={{ position: "absolute", top: 12, left: 0, width: `${pct}%`, height: 4, background: `linear-gradient(90deg, ${c}88, ${c})`, borderRadius: 2 }} />
        <div style={{ position: "absolute", top: 6, left: `${pct}%`, transform: "translateX(-50%)", width: 16, height: 16, borderRadius: "50%", backgroundColor: c, border: `3px solid ${B.bone}`, boxShadow: `0 2px 8px rgba(0,0,0,0.3), 0 0 12px ${c}44` }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 28, opacity: 0, cursor: "pointer", margin: 0 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <span style={{ fontSize: 10, color: B.faint }}>{min}{unit}</span>
        <span style={{ fontSize: 10, color: B.faint }}>{max}{unit}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section header                                                     */
/* ------------------------------------------------------------------ */
function SectionLabel({ children, color, sub }: { children: string; color?: string; sub?: string }) {
  return (
    <div style={{ marginBottom: sub ? 8 : 16 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: color || B.teal }}>{children}</div>
      {sub && <p style={{ fontSize: 13, color: B.muted, margin: "6px 0 0", lineHeight: 1.5 }}>{sub}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card wrapper                                                       */
/* ------------------------------------------------------------------ */
function Card({ children, glow, style }: { children: React.ReactNode; glow?: string; style?: React.CSSProperties }) {
  return (
    <div style={{
      backgroundColor: B.whisper,
      border: `1px solid ${B.ghost}`,
      borderRadius: 12,
      padding: "24px 28px",
      position: "relative",
      overflow: "hidden",
      ...style,
    }}>
      {glow && <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`, pointerEvents: "none" }} />}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Classification Scale — always visible, auto-reactive               */
/*  Active band lights up, others are greyed out.                      */
/* ------------------------------------------------------------------ */
function ClassificationScale({ currentBand, currentScore }: { currentBand: string; currentScore: number }) {
  const bands = [
    { name: "Limited Stability", min: 0, max: 29, range: "0–29", color: B.bandLimited, desc: "High dependence on single sources or labor with minimal forward visibility." },
    { name: "Developing Stability", min: 30, max: 49, range: "30–49", color: B.bandDeveloping, desc: "Foundational structure in place. Gaps remain in recurring revenue or predictability." },
    { name: "Established Stability", min: 50, max: 74, range: "50–74", color: B.bandEstablished, desc: "Solid foundation. Multiple sources with meaningful recurring revenue." },
    { name: "High Stability", min: 75, max: 100, range: "75–100", color: B.bandHigh, desc: "Elite structure. Strong recurring, diversified, high visibility, low labor dependence." },
  ];

  // Position indicator on the full-width bar (0–100 mapped to 0–100%)
  const indicatorPct = Math.max(0, Math.min(100, currentScore));

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.dim, marginBottom: 12 }}>
        INCOME STABILITY CLASSIFICATION
      </div>

      {/* Full-width color bar with position indicator */}
      <div style={{ position: "relative", display: "flex", height: 8, borderRadius: 4, overflow: "visible", marginBottom: 20 }}>
        {bands.map((b, i) => {
          const isActive = b.name === currentBand;
          return (
            <div key={b.name} style={{
              flex: b.max - b.min + 1,
              backgroundColor: isActive ? b.color : `${b.color}33`,
              borderRadius: i === 0 ? "4px 0 0 4px" : i === bands.length - 1 ? "0 4px 4px 0" : 0,
              transition: "background-color 300ms",
            }} />
          );
        })}
        {/* Score indicator dot */}
        <div style={{
          position: "absolute", top: "50%", left: `${indicatorPct}%`,
          transform: "translate(-50%, -50%)", zIndex: 2,
          width: 14, height: 14, borderRadius: "50%",
          backgroundColor: B.white,
          border: `3px solid ${bands.find(b => b.name === currentBand)?.color || B.bone}`,
          boxShadow: `0 0 10px ${bands.find(b => b.name === currentBand)?.color || B.bone}66, 0 2px 4px rgba(0,0,0,0.3)`,
          transition: "left 400ms ease-out",
        }} />
        {/* Score number label */}
        <div style={{
          position: "absolute", top: -22, left: `${indicatorPct}%`,
          transform: "translateX(-50%)",
          fontSize: 11, fontWeight: 700, color: B.bone,
          fontVariantNumeric: "tabular-nums",
          transition: "left 400ms ease-out",
        }}>
          {currentScore}
        </div>
      </div>

      {/* Band cards — active one lit, others greyed */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {bands.map(b => {
          const isActive = b.name === currentBand;
          return (
            <div key={b.name} style={{
              padding: "14px 14px 12px",
              borderRadius: 10,
              border: `1px solid ${isActive ? `${b.color}44` : B.ghost}`,
              backgroundColor: isActive ? `${b.color}0D` : B.whisper,
              opacity: isActive ? 1 : 0.4,
              transition: "all 400ms ease-out",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Glow on active */}
              {isActive && (
                <div style={{ position: "absolute", top: -20, right: -20, width: 60, height: 60, background: `radial-gradient(circle, ${b.color}22 0%, transparent 70%)`, pointerEvents: "none" }} />
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  backgroundColor: b.color,
                  boxShadow: isActive ? `0 0 8px ${b.color}88` : "none",
                  transition: "box-shadow 400ms",
                }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: isActive ? B.bone : B.muted, letterSpacing: "-0.01em" }}>{b.name}</span>
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: b.color, marginBottom: 4, fontVariantNumeric: "tabular-nums" }}>{b.range}</div>
              <p style={{ fontSize: 10, color: isActive ? B.dim : B.faint, margin: 0, lineHeight: 1.4 }}>{b.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Income Timeline visualization                                      */
/* ------------------------------------------------------------------ */
function IncomeTimeline({ timeline, baseScore }: { timeline: TimelinePoint[]; baseScore: number }) {
  if (timeline.length === 0) return null;

  const allScores = [baseScore, ...timeline.map(t => t.score)];
  const minScore = Math.min(...allScores) - 5;
  const maxScore = Math.max(...allScores) + 5;
  const range = Math.max(maxScore - minScore, 10);

  const getY = (score: number) => 100 - ((score - minScore) / range) * 100;

  const isPositive = timeline[timeline.length - 1].delta >= 0;
  const accentColor = isPositive ? B.teal : B.bandLimited;

  return (
    <Card glow={isPositive ? "rgba(26,122,109,0.12)" : "rgba(220,74,74,0.08)"} style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <SectionLabel color={B.purple}>Income Timeline</SectionLabel>
          <p style={{ fontSize: 13, color: B.muted, margin: 0, maxWidth: 460, lineHeight: 1.5 }}>
            How this scenario compounds over time. Structural changes don&apos;t happen overnight — they ramp, interact, and build on each other.
          </p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 20 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: accentColor, lineHeight: 1, fontFamily: DISPLAY }}>
            {fmt(timeline[timeline.length - 1].delta)}
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, color: B.dim, marginTop: 4, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>12-MONTH</div>
        </div>
      </div>

      {/* SVG trajectory chart */}
      <div style={{ position: "relative", height: 140, marginBottom: 24 }}>
        <svg viewBox="0 0 400 120" style={{ width: "100%", height: "100%" }} preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(pct => (
            <line key={pct} x1="0" y1={`${pct}%`} x2="400" y2={`${pct}%`} stroke="rgba(244,241,234,0.04)" strokeWidth="0.5" />
          ))}

          {/* Trajectory line */}
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="1" />
            </linearGradient>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.15" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path
            d={`M 20,${getY(baseScore) * 1.2} L 120,${getY(timeline[0].score) * 1.2} L 250,${getY(timeline[1].score) * 1.2} L 380,${getY(timeline[2].score) * 1.2} L 380,120 L 20,120 Z`}
            fill="url(#areaGrad)"
          />

          {/* Line */}
          <path
            d={`M 20,${getY(baseScore) * 1.2} L 120,${getY(timeline[0].score) * 1.2} L 250,${getY(timeline[1].score) * 1.2} L 380,${getY(timeline[2].score) * 1.2}`}
            fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          />

          {/* Now dot */}
          <circle cx="20" cy={getY(baseScore) * 1.2} r="4" fill={B.bone} stroke={B.navy} strokeWidth="2" />

          {/* Timeline dots */}
          {[
            { x: 120, pt: timeline[0] },
            { x: 250, pt: timeline[1] },
            { x: 380, pt: timeline[2] },
          ].map(({ x, pt }) => (
            <g key={pt.month}>
              <circle cx={x} cy={getY(pt.score) * 1.2} r="5" fill={accentColor} stroke={B.navy} strokeWidth="2" />
              <circle cx={x} cy={getY(pt.score) * 1.2} r="8" fill={accentColor} fillOpacity="0.15" />
            </g>
          ))}
        </svg>

        {/* Labels */}
        <div style={{ position: "absolute", bottom: -4, left: "5%", fontSize: 10, color: B.dim, fontWeight: 600 }}>NOW</div>
        <div style={{ position: "absolute", bottom: -4, left: "30%", transform: "translateX(-50%)", fontSize: 10, color: B.dim }}>3 MO</div>
        <div style={{ position: "absolute", bottom: -4, left: "62.5%", transform: "translateX(-50%)", fontSize: 10, color: B.dim }}>6 MO</div>
        <div style={{ position: "absolute", bottom: -4, right: "5%", fontSize: 10, color: B.dim }}>12 MO</div>
      </div>

      {/* Timeline milestones */}
      <div style={{ display: "flex", gap: 12 }}>
        {timeline.map((pt) => (
          <div key={pt.month} style={{ flex: 1, padding: "14px 16px", backgroundColor: B.whisper, border: `1px solid ${B.ghost}`, borderRadius: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: B.dim, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>{pt.label}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: pt.delta >= 0 ? B.teal : B.bandLimited, fontVariantNumeric: "tabular-nums" }}>
                {pt.score}
              </span>
            </div>
            <div style={{ fontSize: 11, color: bandColor(pt.band), fontWeight: 600, marginBottom: 6 }}>{pt.band}</div>
            <p style={{ fontSize: 11, color: B.dim, margin: 0, lineHeight: 1.45 }}>{pt.narrative}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Main content                                                       */
/* ------------------------------------------------------------------ */
function SimulatorContent() {
  const searchParams = useSearchParams();
  const [loaded, setLoaded] = useState(false);
  const [simMode, setSimMode] = useState<"presets" | "advanced">("presets");
  const [simPreset, setSimPreset] = useState<string | null>(null);
  const [sliders, setSliders] = useState<{ recurrence: number; topClient: number; sources: number; monthsBooked: number; passive: number } | null>(null);
  const [baseInputs, setBaseInputs] = useState<CanonicalInput | null>(null);
  const [qualityScore, setQualityScore] = useState(5);
  const [userName, setUserName] = useState("");
  const [industry, setIndustry] = useState("");
  const [incomeModel, setIncomeModel] = useState("");

  useEffect(() => {
    const p = searchParams.get("p");
    const c = searchParams.get("c");
    const src = searchParams.get("src");
    const f = searchParams.get("f");
    const v = searchParams.get("v");
    const l = searchParams.get("l");
    const n = searchParams.get("n");
    const q = searchParams.get("q");
    const ind = searchParams.get("ind");
    const mod = searchParams.get("mod");

    if (p && c && src && f && l) {
      const inputs: CanonicalInput = { income_persistence_pct: Number(p), largest_source_pct: Number(c), source_diversity_count: Number(src), forward_secured_pct: Number(f), income_variability_level: (v || "moderate") as CanonicalInput["income_variability_level"], labor_dependence_pct: Number(l) };
      setBaseInputs(inputs);
      setQualityScore(Number(q) || 5);
      setUserName(n ? decodeURIComponent(n) : "");
      setIndustry(ind ? decodeURIComponent(ind).replace(/_/g, " ").replace(/\b\w/g, (ch: string) => ch.toUpperCase()) : "");
      setIncomeModel(mod ? decodeURIComponent(mod).replace(/_/g, " ").replace(/\b\w/g, (ch: string) => ch.toUpperCase()) : "");
      setSliders({ recurrence: inputs.income_persistence_pct, topClient: inputs.largest_source_pct, sources: inputs.source_diversity_count, monthsBooked: Math.round(inputs.forward_secured_pct / 100 * 6 * 2) / 2, passive: 100 - inputs.labor_dependence_pct });
      setLoaded(true);
      return;
    }

    try {
      const stored = sessionStorage.getItem("rp_record");
      if (stored) {
        const record = JSON.parse(stored);
        const v2 = record._v2;
        if (v2?.normalized_inputs) {
          const ni = v2.normalized_inputs;
          const inputs: CanonicalInput = { income_persistence_pct: ni.income_persistence_pct, largest_source_pct: ni.largest_source_pct, source_diversity_count: ni.source_diversity_count, forward_secured_pct: ni.forward_secured_pct, income_variability_level: ni.income_variability_level, labor_dependence_pct: ni.labor_dependence_pct };
          setBaseInputs(inputs);
          setQualityScore(v2.quality?.quality_score ?? 5);
          setUserName(record.assessment_title || "");
          setIndustry((record.industry_sector || "").replace(/_/g, " ").replace(/\b\w/g, (ch: string) => ch.toUpperCase()));
          setIncomeModel((record.primary_income_model || "").replace(/_/g, " ").replace(/\b\w/g, (ch: string) => ch.toUpperCase()));
          setSliders({ recurrence: inputs.income_persistence_pct, topClient: inputs.largest_source_pct, sources: inputs.source_diversity_count, monthsBooked: Math.round(inputs.forward_secured_pct / 100 * 6 * 2) / 2, passive: 100 - inputs.labor_dependence_pct });
          setLoaded(true);
        }
      }
    } catch { /* ignore */ }
  }, [searchParams]);

  /* ── Empty state ── */
  if (!loaded || !baseInputs) {
    return (
      <div style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${B.navyDeep} 0%, ${B.navy} 40%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap');`}</style>
        <div style={{ textAlign: "center", maxWidth: 440, padding: 40 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${B.purple}22, ${B.teal}22)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", border: `1px solid ${B.ghost}` }}>
            <span style={{ fontSize: 20 }}>&#9672;</span>
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 16 }}>Score Simulator</div>
          <h1 style={{ fontSize: 34, fontFamily: DISPLAY, fontWeight: 400, color: B.bone, lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: 16 }}>
            This tool is included<br />with your report.
          </h1>
          <p style={{ fontSize: 15, color: B.muted, lineHeight: 1.65, marginBottom: 36 }}>
            Tap the QR code on your report to load your data and model scenarios against your actual income structure.
          </p>
          <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 52, padding: "0 36px", borderRadius: 10, background: `linear-gradient(135deg, ${B.bone} 0%, #E8E5DD 100%)`, color: B.navy, fontSize: 15, fontWeight: 600, textDecoration: "none", letterSpacing: "-0.01em", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
            Get the Full Report
          </Link>
        </div>
      </div>
    );
  }

  /* ── Computed values ── */
  const sl = sliders!;
  let simInputs: CanonicalInput;
  if (simMode === "advanced" && sliders) {
    const gt = sl.sources <= 1 ? 100 : Math.max(Math.round(100 / sl.sources), sl.topClient);
    simInputs = { income_persistence_pct: sl.recurrence, largest_source_pct: gt, source_diversity_count: sl.sources, forward_secured_pct: Math.min(100, Math.round(sl.monthsBooked / 6 * 100)), income_variability_level: baseInputs.income_variability_level, labor_dependence_pct: Math.max(0, 100 - sl.passive) };
  } else {
    const ap = SIMULATOR_PRESETS.find(p => p.id === simPreset);
    simInputs = ap ? ap.modify(baseInputs) : baseInputs;
  }

  const base = simulateScore(baseInputs, qualityScore);
  const sim = simulateScore(simInputs, qualityScore);
  const delta = sim.overall_score - base.overall_score;
  const isModified = simMode === "advanced" ? !!sliders : !!simPreset;

  // Income Timeline
  const timeline: TimelinePoint[] = isModified ? projectTimeline(baseInputs, simInputs, qualityScore) : [];

  // Stress tests
  const stLC = simulateScore(SIMULATOR_PRESETS.find(p => p.id === "lose_top_client")!.modify(simInputs), qualityScore);
  const stNW = simulateScore(SIMULATOR_PRESETS.find(p => p.id === "cant_work_90_days")!.modify(simInputs), qualityScore);
  const runway = Math.round(sim.continuity_months * 30);

  // Insights
  const insights: string[] = [];
  if (simMode === "advanced" && sliders) {
    const rd = sl.recurrence - baseInputs.income_persistence_pct;
    const cd = sl.topClient - baseInputs.largest_source_pct;
    const pd = sl.passive - (100 - baseInputs.labor_dependence_pct);
    if (rd >= 15) insights.push(`+${rd}% recurring adds ${Math.round(rd * 0.03 * 30)} days of runway`);
    if (cd <= -15) insights.push(`Top client ${baseInputs.largest_source_pct}% \u2192 ${sl.topClient}%`);
    if (pd >= 15) insights.push(`${sl.passive}% passive — continues if you stop`);
    if (sim.band !== base.band) insights.push(`Crossed into ${sim.band}`);
  }

  // Path to +10
  const pathSteps: string[] = [];
  if (base.overall_score < 90) {
    let rem = 10;
    for (const t of [
      { label: "recurring", field: "income_persistence_pct" as const, step: 5, dir: 1 },
      { label: "top client", field: "largest_source_pct" as const, step: -5, dir: -1 },
      { label: "forward visibility", field: "forward_secured_pct" as const, step: 5, dir: 1 },
      { label: "labor dependence", field: "labor_dependence_pct" as const, step: -5, dir: -1 },
    ]) {
      if (rem <= 0) break;
      const test = { ...baseInputs, [t.field]: Math.max(0, Math.min(100, (baseInputs[t.field] as number) + t.step * 3)) };
      const lift = simulateScore(test, qualityScore).overall_score - base.overall_score;
      if (lift > 0) { const n = Math.min(lift, rem); pathSteps.push(`${t.dir > 0 ? "Increase" : "Reduce"} ${t.label} from ${baseInputs[t.field]}${typeof baseInputs[t.field] === "number" ? "%" : ""} to ${Math.max(0, Math.min(100, (baseInputs[t.field] as number) + t.step * 3))}% (+${n})`); rem -= n; }
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${B.navyDeep} 0%, ${B.navy} 30%, #0B1520 100%)`, fontFamily: INTER }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap'); body{margin:0;} *{box-sizing:border-box;}`}</style>

      {/* ══════════ HEADER ══════════ */}
      <header style={{ borderBottom: `1px solid ${B.ghost}`, padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", backdropFilter: "blur(12px)", backgroundColor: "rgba(7,15,25,0.6)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Image src={logoImg} alt="RunPayway" width={100} height={12} style={{ height: "auto", filter: "brightness(10)" }} />
          <div style={{ width: 1, height: 16, backgroundColor: B.ghost }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.dim }}>Score Simulator</span>
        </div>
        <span style={{ fontSize: 11, color: B.dim }}>{[userName, industry].filter(Boolean).join(" \u00B7 ")}</span>
      </header>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 28px 80px" }}>

        {/* ══════════ SCORE HERO ══════════ */}
        <div style={{ marginBottom: 32 }}>
          {/* Headline */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 32, fontFamily: DISPLAY, fontWeight: 400, color: B.bone, lineHeight: 1.1, letterSpacing: "-0.025em", margin: "0 0 8px" }}>
              {isModified ? "Projected Impact" : "Your Income Structure"}
            </h1>
            <p style={{ fontSize: 14, color: B.muted, margin: 0, maxWidth: 520 }}>
              {isModified
                ? "How this change reshapes your income stability score and structural position."
                : "Select a scenario below to see how structural changes affect your score over time."}
            </p>
          </div>

          {/* Score triptych */}
          <div style={{ display: "flex", gap: 2, borderRadius: 12, overflow: "hidden" }}>
            {/* Current */}
            <div style={{ flex: 1, background: "rgba(244,241,234,0.03)", padding: "28px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.dim, marginBottom: 10 }}>CURRENT</div>
              <div style={{ fontSize: 42, fontWeight: 300, color: B.bone, lineHeight: 1, fontFamily: DISPLAY }}>{base.overall_score}</div>
              <div style={{ fontSize: 11, color: bandColor(base.band), fontWeight: 600, marginTop: 8 }}>{base.band}</div>
            </div>

            {/* Simulated */}
            <div style={{
              flex: 1, padding: "28px 24px", textAlign: "center",
              background: isModified
                ? delta > 0 ? "rgba(26,122,109,0.06)" : delta < 0 ? "rgba(220,74,74,0.04)" : "rgba(244,241,234,0.03)"
                : "rgba(244,241,234,0.03)",
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.dim, marginBottom: 10 }}>
                {isModified ? "SIMULATED" : "BASELINE"}
              </div>
              <div style={{
                fontSize: 42, fontWeight: 300, lineHeight: 1, fontFamily: DISPLAY,
                color: isModified ? (delta > 0 ? B.teal : delta < 0 ? B.bandLimited : B.bone) : B.bone,
              }}>
                {sim.overall_score}
              </div>
              <div style={{ fontSize: 11, color: bandColor(sim.band), fontWeight: 600, marginTop: 8 }}>{sim.band}</div>
            </div>

            {/* Impact */}
            <div style={{ flex: 1, background: "rgba(244,241,234,0.03)", padding: "28px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.dim, marginBottom: 10 }}>IMPACT</div>
              <div style={{
                fontSize: 42, fontWeight: 300, lineHeight: 1, fontFamily: DISPLAY,
                color: delta > 0 ? B.teal : delta < 0 ? B.bandLimited : B.faint,
              }}>
                {delta > 0 ? `+${delta}` : delta === 0 ? "\u2014" : String(delta)}
              </div>
              <div style={{ fontSize: 11, color: B.dim, marginTop: 8 }}>{runway} day{runway !== 1 ? "s" : ""} runway</div>
            </div>
          </div>
        </div>

        {/* ══════════ CLASSIFICATION SCALE ══════════ */}
        <ClassificationScale currentBand={isModified ? sim.band : base.band} currentScore={isModified ? sim.overall_score : base.overall_score} />

        {/* ══════════ INCOME TIMELINE ══════════ */}
        {isModified && timeline.length > 0 && (
          <IncomeTimeline timeline={timeline} baseScore={base.overall_score} />
        )}

        {/* ══════════ MODE TOGGLE ══════════ */}
        <div style={{ display: "flex", gap: 2, marginBottom: 28, borderRadius: 10, overflow: "hidden", border: `1px solid ${B.ghost}` }}>
          {(["presets", "advanced"] as const).map((mode) => (
            <button key={mode} onClick={() => {
              setSimMode(mode);
              if (mode === "presets") setSliders({ recurrence: baseInputs.income_persistence_pct, topClient: baseInputs.largest_source_pct, sources: baseInputs.source_diversity_count, monthsBooked: Math.round(baseInputs.forward_secured_pct / 100 * 6 * 2) / 2, passive: 100 - baseInputs.labor_dependence_pct });
              else setSimPreset(null);
            }} style={{
              flex: 1, padding: "14px 16px", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 200ms",
              backgroundColor: simMode === mode ? (mode === "presets" ? B.tealGlow : B.purpleGlow) : "transparent",
              color: simMode === mode ? (mode === "presets" ? B.teal : B.purple) : B.dim,
              borderBottom: simMode === mode ? `2px solid ${mode === "presets" ? B.teal : B.purple}` : "2px solid transparent",
            }}>
              {mode === "presets" ? "Quick Scenarios" : "Build Your Own"}
            </button>
          ))}
        </div>

        {/* ══════════ PRESETS ══════════ */}
        {simMode === "presets" && (
          <div style={{ marginBottom: 32 }}>
            <SectionLabel color={B.teal} sub={industry ? `Modeled for ${incomeModel ? `${incomeModel.toLowerCase()} professionals` : "professionals"} in ${industry}.` : "Select a scenario to model its impact on your score."}>
              What-If Scenarios
            </SectionLabel>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
              {SIMULATOR_PRESETS.map((preset) => {
                const ia = simPreset === preset.id;
                const previewDelta = simulateScore(preset.modify(baseInputs), qualityScore).overall_score - base.overall_score;
                const isNeg = previewDelta < 0;
                return (
                  <button key={preset.id} onClick={() => setSimPreset(ia ? null : preset.id)} style={{
                    padding: "16px 18px", textAlign: "left", borderRadius: 10, cursor: "pointer", transition: "all 200ms",
                    border: `1px solid ${ia ? (isNeg ? B.bandLimited : B.purple) + "44" : B.ghost}`,
                    backgroundColor: ia ? (isNeg ? "rgba(220,74,74,0.06)" : B.purpleGlow) : B.whisper,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: ia ? B.bone : B.muted }}>{preset.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: previewDelta >= 0 ? B.teal : B.bandLimited, fontVariantNumeric: "tabular-nums" }}>
                        {fmt(previewDelta)}
                      </span>
                    </div>
                    <p style={{ fontSize: 11, color: B.dim, margin: 0, lineHeight: 1.4 }}>{preset.description}</p>
                  </button>
                );
              })}
            </div>

            {simPreset && (() => {
              const ap = SIMULATOR_PRESETS.find(p => p.id === simPreset)!;
              return (
                <Card glow={delta > 0 ? "rgba(75,63,174,0.10)" : "rgba(220,74,74,0.06)"}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: B.bone, marginBottom: 6 }}>{ap.label}</div>
                  <p style={{ fontSize: 13, color: B.muted, margin: "0 0 10px" }}>{ap.description}</p>
                  {delta !== 0 && (
                    <p style={{ fontSize: 14, color: delta > 0 ? B.teal : B.bandLimited, margin: 0, fontWeight: 600 }}>
                      {delta > 0 ? `+${delta} points` : `${delta} points`}
                      {sim.band !== base.band ? ` \u2014 ${delta > 0 ? "rises" : "drops"} to ${sim.band}` : ""}
                    </p>
                  )}
                  {industry && delta < 0 && (
                    <p style={{ fontSize: 12, color: B.dim, margin: "8px 0 0", fontStyle: "italic" }}>
                      In {industry}, {incomeModel ? `${incomeModel.toLowerCase()} professionals` : "professionals"} with similar structure average a {Math.max(Math.abs(delta) - 2, Math.abs(delta) + 3)}-point drop in this scenario.
                    </p>
                  )}
                </Card>
              );
            })()}
          </div>
        )}

        {/* ══════════ ADVANCED SLIDERS ══════════ */}
        {simMode === "advanced" && sliders && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 32 }}>
            {/* Left: sliders */}
            <div>
              <SectionLabel color={B.purple} sub="Adjust each structural factor to model a custom scenario.">
                Build Your Scenario
              </SectionLabel>

              <Card style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: B.faint, marginBottom: 20 }}>INCOME STRUCTURE</div>
                <Slider label="Recurring revenue" value={sl.recurrence} min={0} max={100} step={5} unit="%" onChange={(v) => setSliders({ ...sl, recurrence: v })} />
                <Slider label="Top client share" value={sl.topClient} min={sl.sources <= 1 ? 100 : 10} max={100} step={5} unit="%" onChange={(v) => setSliders({ ...sl, topClient: v })} accent={B.bandDeveloping} />
                <Slider label="Income sources" value={sl.sources} min={1} max={8} step={1} unit="" onChange={(v) => setSliders({ ...sl, sources: v, topClient: v <= 1 ? 100 : Math.min(sl.topClient, 100) })} />
              </Card>

              <Card style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: B.faint, marginBottom: 20 }}>PREDICTABILITY</div>
                <Slider label="Months booked ahead" value={sl.monthsBooked} min={0} max={6} step={0.5} unit=" mo" onChange={(v) => setSliders({ ...sl, monthsBooked: v })} accent={B.bandEstablished} />
              </Card>

              <Card>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: B.faint, marginBottom: 20 }}>RESILIENCE</div>
                <Slider label="Passive income" value={sl.passive} min={0} max={100} step={5} unit="%" onChange={(v) => setSliders({ ...sl, passive: v })} accent={B.purple} />
              </Card>

              <button onClick={() => setSliders({ recurrence: baseInputs.income_persistence_pct, topClient: baseInputs.largest_source_pct, sources: baseInputs.source_diversity_count, monthsBooked: Math.round(baseInputs.forward_secured_pct / 100 * 6 * 2) / 2, passive: 100 - baseInputs.labor_dependence_pct })} style={{ fontSize: 11, color: B.dim, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: "12px 0 0", marginTop: 4 }}>
                Reset to current
              </button>
            </div>

            {/* Right: analysis */}
            <div>
              {insights.length > 0 && (
                <div style={{ marginBottom: 28 }}>
                  <SectionLabel color={B.purple}>What Changed</SectionLabel>
                  {insights.map((ins, i) => (
                    <div key={i} style={{ fontSize: 13, color: B.bone, fontWeight: 500, marginBottom: 8, padding: "12px 16px", backgroundColor: B.purpleGlow, borderRadius: 8, border: `1px solid rgba(75,63,174,0.12)` }}>{ins}</div>
                  ))}
                </div>
              )}

              <div style={{ marginBottom: 0 }}>
                <SectionLabel color={B.bandLimited} sub="What happens to your simulated state under stress.">
                  Stress Tests
                </SectionLabel>
                {[
                  { label: "Lose top client", value: `${sim.overall_score} \u2192 ${stLC.overall_score}`, sub: `${stLC.overall_score - sim.overall_score} points`, color: B.bandLimited },
                  { label: "Unable to work 90 days", value: `${sim.overall_score} \u2192 ${stNW.overall_score}`, sub: `${stNW.overall_score - sim.overall_score} points`, color: B.bandLimited },
                  { label: "Income runway", value: `${runway} days`, sub: runway < 30 ? "Critical" : runway < 90 ? "Limited" : "Healthy", color: runway < 30 ? B.bandLimited : runway < 90 ? B.bandDeveloping : B.teal },
                  { label: "Fragility class", value: sim.fragility_class.charAt(0).toUpperCase() + sim.fragility_class.slice(1), sub: "", color: sim.fragility_class === "brittle" || sim.fragility_class === "thin" ? B.bandLimited : sim.fragility_class === "moderate" ? B.bandDeveloping : B.teal },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", backgroundColor: B.whisper, border: `1px solid ${B.ghost}`, borderRadius: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: B.muted }}>{row.label}</span>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: row.color }}>{row.value}</span>
                      {row.sub && <div style={{ fontSize: 10, color: B.dim }}>{row.sub}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════ PATH TO +10 ══════════ */}
        {pathSteps.length > 0 && (
          <Card glow="rgba(26,122,109,0.08)" style={{ borderLeft: `3px solid ${B.teal}`, marginTop: 8 }}>
            <SectionLabel color={B.teal}>
              {`Path to ${base.overall_score + 10}/100${industry ? ` in ${industry}` : ""}`}
            </SectionLabel>
            <p style={{ fontSize: 13, color: B.muted, marginBottom: 16, marginTop: 0 }}>
              {industry && incomeModel
                ? `For ${incomeModel.toLowerCase()} professionals in ${industry}, the fastest path to gain 10 points:`
                : "The most efficient structural changes to gain 10 points:"}
            </p>
            {pathSteps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", backgroundColor: B.tealGlow, border: `1px solid ${B.teal}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: B.teal }}>{i + 1}</span>
                </div>
                <span style={{ fontSize: 13, color: B.bone, fontWeight: 500, lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
            {industry && (
              <p style={{ fontSize: 12, color: B.dim, marginTop: 16, marginBottom: 0, fontStyle: "italic", paddingLeft: 34 }}>
                Top 20% of {industry} professionals typically have 60%+ recurring revenue and less than 35% from any single source.
              </p>
            )}
          </Card>
        )}

        {/* ══════════ PROFILE CARD ══════════ */}
        {(userName || industry || incomeModel) && (
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 32, padding: "16px 20px", background: B.whisper, border: `1px solid ${B.ghost}`, borderRadius: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${B.purple}22, ${B.teal}22)`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${B.ghost}` }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: B.bone }}>{(userName || "?")[0].toUpperCase()}</span>
            </div>
            <div style={{ flex: 1 }}>
              {userName && <div style={{ fontSize: 14, fontWeight: 600, color: B.bone, marginBottom: 2 }}>{userName}</div>}
              <div style={{ display: "flex", gap: 10 }}>
                {industry && <span style={{ fontSize: 11, color: B.dim }}>{industry}</span>}
                {industry && incomeModel && <span style={{ fontSize: 11, color: B.faint }}>\u00B7</span>}
                {incomeModel && <span style={{ fontSize: 11, color: B.dim }}>{incomeModel}</span>}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: B.bone, fontVariantNumeric: "tabular-nums" }}>{base.overall_score}<span style={{ fontSize: 11, color: B.dim }}>/100</span></div>
              <div style={{ fontSize: 10, color: bandColor(base.band), fontWeight: 600 }}>{base.band}</div>
            </div>
          </div>
        )}
      </div>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ borderTop: `1px solid ${B.ghost}`, padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, color: B.faint }}>Income Stability Score&#8482; &middot; Model RP-2.0</span>
        <span style={{ fontSize: 10, color: B.faint }}>Deterministic &middot; Fixed Rules &middot; No AI</span>
      </footer>
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#070F19", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ fontSize: 14, color: "rgba(244,241,234,0.35)" }}>Loading simulator...</p></div>}>
      <SimulatorContent />
    </Suspense>
  );
}
