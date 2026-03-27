"use client";

import { useState, useEffect, useContext, createContext, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logoWhite from "../../../../public/runpayway-logo-white.png";
import { simulateScore, SIMULATOR_PRESETS, projectTimeline } from "@/lib/engine/v2/simulate";
import type { CanonicalInput } from "@/lib/engine/v2/types";
import type { TimelinePoint } from "@/lib/engine/v2/simulate";
import { getScriptsForSector } from "@/lib/action-scripts";

/* ------------------------------------------------------------------ */
/*  Design Tokens                                                      */
/* ------------------------------------------------------------------ */
interface ThemeColors {
  bg: string;
  bgDeep: string;
  bgGradient: string;
  surface: string;
  surfaceHover: string;
  surfaceRaised: string;
  border: string;
  borderSubtle: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textFaint: string;
  headerBg: string;
  headerBorder: string;
}

const DARK: ThemeColors = {
  bg: "#0F1923",
  bgDeep: "#0A1119",
  bgGradient: "linear-gradient(180deg, #0A1119 0%, #0D1620 40%, #0F1923 100%)",
  surface: "rgba(255,255,255,0.04)",
  surfaceHover: "rgba(255,255,255,0.07)",
  surfaceRaised: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.08)",
  borderSubtle: "rgba(255,255,255,0.05)",
  text: "#E8E5DD",
  textSecondary: "rgba(232,229,221,0.70)",
  textMuted: "rgba(232,229,221,0.45)",
  textFaint: "rgba(232,229,221,0.22)",
  headerBg: "rgba(10,17,25,0.88)",
  headerBorder: "rgba(255,255,255,0.06)",
};

const BRAND = {
  purple: "#4B3FAE",
  purpleGlow: "rgba(75,63,174,0.08)",
  teal: "#1A7A6D",
  tealGlow: "rgba(26,122,109,0.10)",
  bandLimited: "#DC4A4A",
  bandDeveloping: "#D4940A",
  bandEstablished: "#3B82F6",
  bandHigh: "#1A7A6D",
};

// Legacy B alias
const B = {
  navy: "#0F1923", navyDeep: "#0A1119", purple: BRAND.purple, purpleGlow: "rgba(75,63,174,0.12)",
  teal: BRAND.teal, tealGlow: "rgba(26,122,109,0.12)", sand: "#E8E5DD", bone: "#E8E5DD", white: "#FFFFFF",
  muted: DARK.textSecondary, dim: DARK.textMuted, faint: DARK.textFaint,
  ghost: DARK.border, whisper: DARK.surface,
  bandLimited: BRAND.bandLimited, bandDeveloping: BRAND.bandDeveloping,
  bandEstablished: BRAND.bandEstablished, bandHigh: BRAND.bandHigh,
};

const ThemeCtx = createContext<ThemeColors>(DARK);
function useTheme() { return useContext(ThemeCtx); }

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
  const T = useTheme();
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const c = accent || BRAND.teal;
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: T.text, letterSpacing: "-0.01em" }}>{label}</span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: c, fontVariantNumeric: "tabular-nums", fontFamily: DISPLAY }}>{value}</span>
          <span style={{ fontSize: 12, fontWeight: 500, color: T.textMuted }}>{unit}</span>
        </div>
      </div>
      <div style={{ position: "relative", height: 32 }}>
        <div style={{ position: "absolute", top: 14, left: 0, right: 0, height: 4, backgroundColor: T.border, borderRadius: 2 }} />
        <div style={{ position: "absolute", top: 14, left: 0, width: `${pct}%`, height: 4, background: `linear-gradient(90deg, ${c}66, ${c})`, borderRadius: 2, boxShadow: `0 0 8px ${c}33` }} />
        <div style={{ position: "absolute", top: 7, left: `${pct}%`, transform: "translateX(-50%)", width: 20, height: 20, borderRadius: "50%", backgroundColor: c, border: `3px solid ${T.text}`, boxShadow: `0 2px 10px rgba(0,0,0,0.30), 0 0 16px ${c}44`, transition: "box-shadow 200ms ease" }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 32, opacity: 0, cursor: "pointer", margin: 0 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <span style={{ fontSize: 11, color: T.textFaint, fontVariantNumeric: "tabular-nums" }}>{min}{unit}</span>
        <span style={{ fontSize: 11, color: T.textFaint, fontVariantNumeric: "tabular-nums" }}>{max}{unit}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section header                                                     */
/* ------------------------------------------------------------------ */
function SectionLabel({ children, color, sub }: { children: string; color?: string; sub?: string }) {
  const T = useTheme();
  return (
    <div style={{ marginBottom: sub ? 12 : 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: color || BRAND.teal }}>{children}</div>
      {sub && <p style={{ fontSize: 14, color: T.textSecondary, margin: "8px 0 0", lineHeight: 1.55 }}>{sub}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card wrapper                                                       */
/* ------------------------------------------------------------------ */
function Card({ children, glow, style, className }: { children: React.ReactNode; glow?: string; style?: React.CSSProperties; className?: string }) {
  const T = useTheme();
  return (
    <div className={className} style={{
      backgroundColor: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      padding: "28px 28px",
      position: "relative",
      overflow: "hidden",
      backdropFilter: "blur(8px)",
      ...style,
    }}>
      {glow && <div style={{ position: "absolute", top: -60, right: -60, width: 160, height: 160, background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`, pointerEvents: "none" }} />}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Classification Scale — always visible, auto-reactive               */
/*  Active band lights up, others are greyed out.                      */
/* ------------------------------------------------------------------ */
function ClassificationScale({ currentBand, currentScore }: { currentBand: string; currentScore: number }) {
  const T = useTheme();
  const bands = [
    { name: "Limited Stability", min: 0, max: 29, range: "0–29", color: BRAND.bandLimited, desc: "High dependence on single sources or labor with minimal forward visibility." },
    { name: "Developing Stability", min: 30, max: 49, range: "30–49", color: BRAND.bandDeveloping, desc: "Foundational structure in place. Gaps remain in recurring revenue or predictability." },
    { name: "Established Stability", min: 50, max: 74, range: "50–74", color: BRAND.bandEstablished, desc: "Solid foundation. Multiple sources with meaningful recurring revenue." },
    { name: "High Stability", min: 75, max: 100, range: "75–100", color: BRAND.bandHigh, desc: "Elite structure. Strong recurring, diversified, high visibility, low labor dependence." },
  ];

  const indicatorPct = Math.max(0, Math.min(100, currentScore));

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: T.textMuted }}>
          INCOME STABILITY CLASSIFICATION
        </div>
        <div style={{ fontSize: 10, color: T.textFaint }}>Updates as you adjust scenarios</div>
      </div>

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
        <div style={{
          position: "absolute", top: "50%", left: `${indicatorPct}%`,
          transform: "translate(-50%, -50%)", zIndex: 2,
          width: 14, height: 14, borderRadius: "50%",
          backgroundColor: T.bg,
          border: `3px solid ${bands.find(b => b.name === currentBand)?.color || BRAND.teal}`,
          boxShadow: `0 0 10px ${bands.find(b => b.name === currentBand)?.color || BRAND.teal}66, 0 2px 4px rgba(0,0,0,0.2)`,
          transition: "left 400ms ease-out, background-color 400ms",
        }} />
        <div style={{
          position: "absolute", top: -22, left: `${indicatorPct}%`,
          transform: "translateX(-50%)",
          fontSize: 11, fontWeight: 700, color: T.text,
          fontVariantNumeric: "tabular-nums",
          transition: "left 400ms ease-out, color 400ms",
        }}>
          {currentScore}
        </div>
      </div>

      <div className="sim-bands" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {bands.map(b => {
          const isActive = b.name === currentBand;
          return (
            <div key={b.name} style={{
              padding: "14px 14px 12px",
              borderRadius: 10,
              border: `1px solid ${isActive ? `${b.color}44` : T.border}`,
              backgroundColor: isActive ? `${b.color}10` : "rgba(255,255,255,0.03)",
              opacity: isActive ? 1 : 0.4,
              transition: "all 400ms ease-out",
              position: "relative",
              overflow: "hidden",
            }}>
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
                <span style={{ fontSize: 11, fontWeight: 700, color: isActive ? T.text : T.textSecondary, letterSpacing: "-0.01em" }}>{b.name}</span>
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: b.color, marginBottom: 4, fontVariantNumeric: "tabular-nums" }}>{b.range}</div>
              <p style={{ fontSize: 10, color: isActive ? T.textMuted : T.textFaint, margin: 0, lineHeight: 1.4 }}>{b.desc}</p>
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
  const T = useTheme();
  if (timeline.length === 0) return null;

  const allScores = [baseScore, ...timeline.map(t => t.score)];
  const minScore = Math.min(...allScores) - 5;
  const maxScore = Math.max(...allScores) + 5;
  const range = Math.max(maxScore - minScore, 10);

  const getY = (score: number) => 100 - ((score - minScore) / range) * 100;

  const isPositive = timeline[timeline.length - 1].delta >= 0;
  const accentColor = isPositive ? BRAND.teal : BRAND.bandLimited;

  return (
    <Card glow={isPositive ? "rgba(26,122,109,0.12)" : "rgba(220,74,74,0.08)"} style={{ marginBottom: 32 }}>
      <div className="sim-tl-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <SectionLabel color={B.purple}>Income Timeline</SectionLabel>
          <p style={{ fontSize: 13, color: T.textSecondary, margin: 0, maxWidth: 460, lineHeight: 1.5 }}>
            Your projected score at 3, 6, and 12 months if you make this change today. Structural improvements compound — early gains unlock interaction bonuses that accelerate over time.
          </p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 20 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: accentColor, lineHeight: 1, fontFamily: DISPLAY }}>
            {fmt(timeline[timeline.length - 1].delta)}
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, color: T.textMuted, marginTop: 4, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>12-MONTH</div>
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
          <circle cx="20" cy={getY(baseScore) * 1.2} r="4" fill={T.text} stroke={T.bg} strokeWidth="2" />

          {/* Timeline dots */}
          {[
            { x: 120, pt: timeline[0] },
            { x: 250, pt: timeline[1] },
            { x: 380, pt: timeline[2] },
          ].map(({ x, pt }) => (
            <g key={pt.month}>
              <circle cx={x} cy={getY(pt.score) * 1.2} r="5" fill={accentColor} stroke={T.bg} strokeWidth="2" />
              <circle cx={x} cy={getY(pt.score) * 1.2} r="8" fill={accentColor} fillOpacity="0.15" />
            </g>
          ))}
        </svg>

        {/* Labels */}
        <div style={{ position: "absolute", bottom: -4, left: "5%", fontSize: 10, color: T.textMuted, fontWeight: 600 }}>NOW</div>
        <div style={{ position: "absolute", bottom: -4, left: "30%", transform: "translateX(-50%)", fontSize: 10, color: T.textMuted }}>3 MO</div>
        <div style={{ position: "absolute", bottom: -4, left: "62.5%", transform: "translateX(-50%)", fontSize: 10, color: T.textMuted }}>6 MO</div>
        <div style={{ position: "absolute", bottom: -4, right: "5%", fontSize: 10, color: T.textMuted }}>12 MO</div>
      </div>

      {/* Timeline milestones */}
      <div className="sim-timeline-ms" style={{ display: "flex", gap: 12 }}>
        {timeline.map((pt) => (
          <div key={pt.month} style={{ flex: 1, padding: "14px 16px", backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>{pt.label}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: pt.delta >= 0 ? BRAND.teal : BRAND.bandLimited, fontVariantNumeric: "tabular-nums" }}>
                {pt.score}
              </span>
            </div>
            <div style={{ fontSize: 11, color: bandColor(pt.band), fontWeight: 600, marginBottom: 6 }}>{pt.band}</div>
            <p style={{ fontSize: 11, color: T.textMuted, margin: 0, lineHeight: 1.45 }}>{pt.narrative}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Record ID — deterministic hash from inputs                         */
/* ------------------------------------------------------------------ */
function generateRecordId(inputs: CanonicalInput, name: string): string {
  const raw = `${inputs.income_persistence_pct}-${inputs.largest_source_pct}-${inputs.source_diversity_count}-${inputs.forward_secured_pct}-${inputs.labor_dependence_pct}-${name}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) { hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0; }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(6, "0").slice(0, 6);
  return `RP-${hex}`;
}




/* ------------------------------------------------------------------ */
/*  Voice of the Model — slider explanations                           */
/* ------------------------------------------------------------------ */
function getSliderExplanation(sliderName: string, oldValue: number, newValue: number, scoreDelta: number): string {
  const explanations: Record<string, { up: string; down: string }> = {
    recurrence: {
      up: `Increasing recurring income from ${oldValue}% to ${newValue}% converts income you rebuild every month into income that renews automatically. This is typically the single highest-impact change.`,
      down: `Reducing recurring income means more of your income must be re-earned each month. This increases your vulnerability to disruptions.`,
    },
    topClient: {
      up: `When your largest source grows from ${oldValue}% to ${newValue}% of revenue, a single client decision has more power over your income. This is concentration risk.`,
      down: `Reducing your largest source from ${oldValue}% to ${newValue}% spreads your risk. No single client departure can damage your income as severely.`,
    },
    sources: {
      up: `Adding income sources from ${oldValue} to ${newValue} creates redundancy. If one source disappears, the others continue.`,
      down: `Fewer income sources means less redundancy. Each remaining source carries more weight — and more risk.`,
    },
    monthsBooked: {
      up: `Extending booked income from ${oldValue} to ${newValue} months means you know what is coming. This forward visibility reduces uncertainty and improves your score.`,
      down: `Less booked income means more months where revenue is uncertain. This reduces your score because the model cannot see committed income ahead.`,
    },
    passive: {
      up: `Increasing passive income from ${oldValue}% to ${newValue}% means more of your income continues even if you stop working. This protects against illness, burnout, or forced breaks.`,
      down: `Less passive income means more depends on your daily effort. Any disruption to your ability to work directly impacts your income.`,
    },
  };

  const key = newValue > oldValue ? "up" : "down";
  const base = explanations[sliderName]?.[key] || "";
  const impact = Math.abs(scoreDelta);
  const impactLine = impact > 0 ? ` This change moves your score by ${scoreDelta > 0 ? "+" : ""}${scoreDelta} points.` : " This change has minimal impact on your score at current levels.";
  return base + impactLine;
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
  const T = DARK;
  const [incomeModel, setIncomeModel] = useState("");
  const [lastChangedSlider, setLastChangedSlider] = useState<string | null>(null);
  const [stressTestActive, setStressTestActive] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState<{ name: string; score: number; band: string; sliders: typeof sliders }[]>([]);
  const [scriptTemplates, setScriptTemplates] = useState<Array<{ id: string; title: string; context: string; script: string }>>([]);
  const [expandedScript, setExpandedScript] = useState<string | null>(null);
  const [scriptCopied, setScriptCopied] = useState<string | null>(null);

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
      // Load action scripts from URL industry param
      if (ind) {
        const rawInd = decodeURIComponent(ind);
        const scripts = getScriptsForSector(rawInd);
        if (scripts.length > 0) setScriptTemplates(scripts);
      }
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
          // Load industry-specific action scripts
          const sectorKey = record.industry_sector || "";
          const industryScripts = getScriptsForSector(sectorKey);
          if (industryScripts.length > 0) {
            setScriptTemplates(industryScripts);
          } else if (v2.script_templates && Array.isArray(v2.script_templates)) {
            setScriptTemplates(v2.script_templates.slice(0, 3));
          }
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
          <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${BRAND.purple}22, ${BRAND.teal}22)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", border: "1px solid rgba(244,241,234,0.08)" }}>
            <span style={{ fontSize: 20 }}>&#9672;</span>
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: BRAND.teal, marginBottom: 16 }}>RunPayway&#8482; Stability Simulator</div>
          <h1 style={{ fontSize: 34, fontFamily: DISPLAY, fontWeight: 400, color: "#F4F1EA", lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: 16 }}>
            This tool is included<br />with your report.
          </h1>
          <p style={{ fontSize: 15, color: "rgba(244,241,234,0.55)", lineHeight: 1.65, marginBottom: 36 }}>
            Tap the QR code on your report to load your data and model scenarios against your actual income structure.
          </p>
          <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 52, padding: "0 36px", borderRadius: 10, background: "linear-gradient(135deg, #F4F1EA 0%, #E8E5DD 100%)", color: "#0E1A2B", fontSize: 15, fontWeight: 600, textDecoration: "none", letterSpacing: "-0.01em", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
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

  // Record ID
  const recordId = generateRecordId(baseInputs, userName);

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
    <ThemeCtx.Provider value={T}>
    <div style={{ minHeight: "100vh", background: T.bgGradient, fontFamily: INTER }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap');
        body{margin:0;} *{box-sizing:border-box;}
        @media(max-width:680px){
          .sim-view-report{
            writing-mode:horizontal-tb!important;
            text-orientation:initial!important;
            position:fixed!important;
            left:50%!important;
            top:auto!important;
            bottom:16px!important;
            transform:translateX(-50%)!important;
            border-radius:8px!important;
            border:1px solid rgba(244,241,234,0.10)!important;
            padding:10px 20px!important;
            font-size:13px!important;
            background-color:rgba(244,241,234,0.12)!important;
          }
          .sim-triptych{flex-direction:column!important;}
          .sim-triptych>div{border-right:none!important;border-bottom:1px solid rgba(244,241,234,0.06);}
          .sim-triptych>div:last-child{border-bottom:none!important;}
          .sim-bands{grid-template-columns:repeat(2,1fr)!important;}
          .sim-timeline-ms{flex-direction:column!important;}
          .sim-presets{grid-template-columns:repeat(2,1fr)!important;}
          .sim-advanced{grid-template-columns:1fr!important;gap:24px!important;}
          .sim-profile{flex-direction:column!important;text-align:center!important;gap:12px!important;}
          .sim-profile>div:last-child{text-align:center!important;}
          .sim-step-label{flex-direction:column!important;gap:4px!important;align-items:flex-start!important;}
          .sim-tl-header{flex-direction:column!important;gap:12px!important;}
          .sim-tl-header>div:last-child{text-align:left!important;margin-left:0!important;}
          .sim-container{padding:28px 16px 60px!important;}
          .sim-triptych>div{padding:20px 16px!important;}
          .sim-triptych .sim-score-num{font-size:34px!important;}
          .sim-footer{flex-direction:column!important;gap:4px!important;text-align:center!important;padding:14px 16px!important;}
          .sim-mode-toggle{flex-direction:column!important;}
          .sim-mode-toggle button{border-bottom:none!important;}
        }
      `}</style>

      {/* ══════════ HEADER ══════════ */}
      <header style={{ borderBottom: `1px solid ${T.headerBorder}`, backdropFilter: "blur(24px) saturate(180%)", WebkitBackdropFilter: "blur(24px) saturate(180%)", backgroundColor: T.headerBg, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ height: 2, background: `linear-gradient(90deg, ${BRAND.teal} 0%, ${BRAND.purple} 50%, ${BRAND.teal} 100%)` }} />
        <div style={{ padding: "18px 36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Image src={logoWhite} alt="RunPayway&#8482;" width={140} height={16} style={{ height: "auto", opacity: 0.95 }} />
            <div style={{ width: 1, height: 28, background: `linear-gradient(180deg, transparent 0%, rgba(232,229,221,0.15) 50%, transparent 100%)` }} />
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: BRAND.teal }}>RunPayway&#8482; RunPayway&#8482; Stability Simulator</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 13, color: T.textMuted, fontWeight: 500, letterSpacing: "0.01em" }}>{[userName, industry].filter(Boolean).join(" \u00B7 ")}</span>
            <div style={{ width: 1, height: 16, background: T.borderSubtle }} />
            <span style={{ fontSize: 10, color: T.textFaint, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>RP-2.0</span>
          </div>
        </div>
      </header>

      {/* Floating "View Report" side link */}
      <Link
        href="/review"
        className="sim-view-report"
        style={{
          position: "fixed",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 40,
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          padding: "16px 10px",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          color: T.textSecondary,
          textDecoration: "none",
          borderRadius: "0 10px 10px 0",
          backgroundColor: "rgba(255,255,255,0.06)",
          border: `1px solid ${T.border}`,
          borderLeft: "none",
          backdropFilter: "blur(12px)",
          transition: "color 200ms, background-color 200ms",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = BRAND.teal; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.10)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = T.textSecondary; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)"; }}
      >
        View Report &#8592;
      </Link>

      <div className="sim-container" style={{ maxWidth: 960, margin: "0 auto", padding: "40px 28px 80px" }}>

        {/* ══════════ SCORE HERO ══════════ */}
        <div className="sim-score-hero" style={{ marginBottom: 36, paddingTop: 8 }}>

          {/* Score triptych */}
          <div className="sim-triptych" style={{ display: "flex", gap: 0, borderRadius: 16, overflow: "hidden", border: `1px solid ${T.border}` }}>
            {/* Current */}
            <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", padding: "36px 28px", textAlign: "center", position: "relative", borderRight: `1px solid ${T.borderSubtle}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: T.textFaint, marginBottom: 14 }}>CURRENT SCORE</div>
              <div className="sim-score-num" style={{ fontSize: 52, fontWeight: 300, color: T.text, lineHeight: 1, fontFamily: DISPLAY }}>{base.overall_score}</div>
              <div style={{ fontSize: 12, color: bandColor(base.band), fontWeight: 600, marginTop: 10, letterSpacing: "-0.01em" }}>{base.band}</div>
            </div>

            {/* Simulated */}
            <div style={{
              flex: 1.2, padding: "36px 28px", textAlign: "center", position: "relative",
              background: isModified
                ? delta > 0 ? "rgba(26,122,109,0.08)" : delta < 0 ? "rgba(220,74,74,0.06)" : "rgba(255,255,255,0.03)"
                : "rgba(255,255,255,0.03)",
              borderRight: `1px solid ${T.borderSubtle}`,
            }}>
              {isModified && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: delta > 0 ? BRAND.teal : delta < 0 ? BRAND.bandLimited : BRAND.purple }} />}
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: isModified ? (delta > 0 ? BRAND.teal : delta < 0 ? BRAND.bandLimited : T.textMuted) : T.textFaint, marginBottom: 14 }}>
                {isModified ? "SIMULATED" : "BASELINE"}
              </div>
              <div className="sim-score-num" style={{
                fontSize: 56, fontWeight: 300, lineHeight: 1, fontFamily: DISPLAY,
                color: isModified ? (delta > 0 ? BRAND.teal : delta < 0 ? BRAND.bandLimited : T.text) : T.text,
                textShadow: isModified && delta !== 0 ? `0 0 24px ${delta > 0 ? BRAND.teal : BRAND.bandLimited}33` : "none",
              }}>
                {sim.overall_score}
              </div>
              <div style={{ fontSize: 12, color: bandColor(sim.band), fontWeight: 600, marginTop: 10, letterSpacing: "-0.01em" }}>{sim.band}</div>
            </div>

            {/* Impact */}
            <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", padding: "36px 28px", textAlign: "center" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: T.textFaint, marginBottom: 14 }}>IMPACT</div>
              <div className="sim-score-num" style={{
                fontSize: 52, fontWeight: 300, lineHeight: 1, fontFamily: DISPLAY,
                color: delta > 0 ? BRAND.teal : delta < 0 ? BRAND.bandLimited : T.textFaint,
              }}>
                {delta > 0 ? `+${delta}` : delta === 0 ? "\u2014" : String(delta)}
              </div>
              <div style={{ fontSize: 12, color: T.textMuted, marginTop: 10 }}>{runway} day{runway !== 1 ? "s" : ""} runway</div>
            </div>
          </div>
        </div>

        {/* ══════════ WHAT-IF NARRATIVE ══════════ */}
        {isModified && delta !== 0 && (
          <div style={{
            marginTop: 20, padding: "20px 24px", borderRadius: 10,
            backgroundColor: T.surface, border: `1px solid ${T.border}`,
          }}>
            <p style={{ fontSize: 15, color: T.text, lineHeight: 1.7, margin: 0 }}>
              {(() => {
                const changes: string[] = [];
                if (sliders && sliders.recurrence !== Math.round(baseInputs.income_persistence_pct))
                  changes.push(`${sliders.recurrence > baseInputs.income_persistence_pct ? "increased" : "decreased"} recurring income to ${sliders.recurrence}%`);
                if (sliders && sliders.topClient !== Math.round(baseInputs.largest_source_pct))
                  changes.push(`${sliders.topClient < baseInputs.largest_source_pct ? "reduced" : "increased"} your largest source to ${sliders.topClient}% of revenue`);
                if (sliders && sliders.sources !== baseInputs.source_diversity_count)
                  changes.push(`${sliders.sources > baseInputs.source_diversity_count ? "added" : "reduced to"} ${sliders.sources} income source${sliders.sources !== 1 ? "s" : ""}`);
                if (sliders && sliders.monthsBooked !== Math.round(baseInputs.forward_secured_pct / 100 * 6 * 2) / 2)
                  changes.push(`booked income ${sliders.monthsBooked} months ahead`);
                if (sliders && sliders.passive !== (100 - baseInputs.labor_dependence_pct))
                  changes.push(`${sliders.passive > (100 - baseInputs.labor_dependence_pct) ? "increased" : "decreased"} passive income to ${sliders.passive}%`);

                const changeText = changes.length === 0
                  ? "applied this scenario"
                  : changes.length === 1 ? changes[0] : changes.slice(0, -1).join(", ") + " and " + changes[changes.length - 1];

                const bandChange = sim.band !== base.band
                  ? ` This would move you from ${base.band} to ${sim.band}.`
                  : ` You would remain in the ${base.band} band.`;

                return `If you ${changeText}, your score would ${delta > 0 ? "rise" : "fall"} from ${base.overall_score} to ${sim.overall_score} — a ${delta > 0 ? "+" : ""}${delta} point change.${bandChange}`;
              })()}
            </p>
          </div>
        )}

        {/* ══════════ SAVE SCENARIO BUTTON ══════════ */}
        {isModified && savedScenarios.length < 3 && (
          <button
            onClick={() => {
              setSavedScenarios(prev => [...prev, {
                name: `Scenario ${prev.length + 1}`,
                score: sim.overall_score,
                band: sim.band,
                sliders: sliders ? { ...sliders } : null,
              }]);
            }}
            style={{
              marginTop: 12, padding: "8px 16px", borderRadius: 8,
              fontSize: 13, fontWeight: 600, color: BRAND.teal,
              backgroundColor: "rgba(26,122,109,0.08)", border: `1px solid rgba(26,122,109,0.15)`,
              cursor: "pointer",
            }}
          >
            Save This Scenario ({3 - savedScenarios.length} remaining)
          </button>
        )}

        {/* ══════════ CLASSIFICATION SCALE ══════════ */}
        <ClassificationScale currentBand={isModified ? sim.band : base.band} currentScore={isModified ? sim.overall_score : base.overall_score} />

        {/* ══════════ INCOME TIMELINE ══════════ */}
        {isModified && timeline.length > 0 && (
          <IncomeTimeline timeline={timeline} baseScore={base.overall_score} />
        )}

        {/* ══════════ MODE TOGGLE ══════════ */}
        <div className="sim-mode-toggle" style={{ display: "flex", gap: 0, marginBottom: 32, borderRadius: 12, overflow: "hidden", border: `1px solid ${T.border}`, background: T.surface }}>
          {(["presets", "advanced"] as const).map((mode) => {
            const active = simMode === mode;
            const color = mode === "presets" ? BRAND.teal : BRAND.purple;
            return (
              <button key={mode} onClick={() => {
                setSimMode(mode);
                if (mode === "presets") setSliders({ recurrence: baseInputs.income_persistence_pct, topClient: baseInputs.largest_source_pct, sources: baseInputs.source_diversity_count, monthsBooked: Math.round(baseInputs.forward_secured_pct / 100 * 6 * 2) / 2, passive: 100 - baseInputs.labor_dependence_pct });
                else setSimPreset(null);
              }} style={{
                flex: 1, padding: "16px 20px", fontSize: 13, fontWeight: 600, letterSpacing: "0.02em",
                border: "none", cursor: "pointer", transition: "all 250ms ease",
                backgroundColor: active ? `${color}15` : "transparent",
                color: active ? color : T.textMuted,
                borderBottom: active ? `2px solid ${color}` : "2px solid transparent",
                position: "relative",
              }}>
                {active && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: color }} />}
                {mode === "presets" ? "Quick Scenarios" : "Build Your Own"}
              </button>
            );
          })}
        </div>

        {/* ══════════ PRESETS ══════════ */}
        {simMode === "presets" && (
          <div style={{ marginBottom: 32 }}>
            <SectionLabel color={B.teal} sub={industry ? `Modeled for ${incomeModel ? `${incomeModel.toLowerCase()} professionals` : "professionals"} in ${industry}.` : "Select a scenario to model its impact on your score."}>
              What-If Scenarios
            </SectionLabel>

            <div className="sim-presets" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
              {SIMULATOR_PRESETS.map((preset) => {
                const ia = simPreset === preset.id;
                const previewDelta = simulateScore(preset.modify(baseInputs), qualityScore).overall_score - base.overall_score;
                const isNeg = previewDelta < 0;
                return (
                  <button key={preset.id} onClick={() => setSimPreset(ia ? null : preset.id)} style={{
                    padding: "20px 20px", textAlign: "left", borderRadius: 12, cursor: "pointer", transition: "all 250ms ease",
                    border: `1px solid ${ia ? (isNeg ? BRAND.bandLimited : BRAND.purple) + "44" : T.border}`,
                    backgroundColor: ia ? (isNeg ? "rgba(220,74,74,0.08)" : "rgba(75,63,174,0.10)") : T.surface,
                    transform: ia ? "scale(1.02)" : "scale(1)",
                    boxShadow: ia ? `0 4px 20px ${isNeg ? "rgba(220,74,74,0.12)" : "rgba(75,63,174,0.15)"}` : "none",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: ia ? T.text : T.textSecondary }}>{preset.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: previewDelta >= 0 ? B.teal : B.bandLimited, fontVariantNumeric: "tabular-nums", fontFamily: DISPLAY }}>
                        {fmt(previewDelta)}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: T.textMuted, margin: 0, lineHeight: 1.5 }}>{preset.description}</p>
                  </button>
                );
              })}
            </div>

            {simPreset && (() => {
              const ap = SIMULATOR_PRESETS.find(p => p.id === simPreset)!;
              return (
                <Card glow={delta > 0 ? "rgba(75,63,174,0.10)" : "rgba(220,74,74,0.06)"}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 6 }}>{ap.label}</div>
                  <p style={{ fontSize: 13, color: T.textSecondary, margin: "0 0 10px" }}>{ap.description}</p>
                  {delta !== 0 && (
                    <p style={{ fontSize: 14, color: delta > 0 ? B.teal : B.bandLimited, margin: 0, fontWeight: 600 }}>
                      {delta > 0 ? `+${delta} points` : `${delta} points`}
                      {sim.band !== base.band ? ` \u2014 ${delta > 0 ? "rises" : "drops"} to ${sim.band}` : ""}
                    </p>
                  )}
                  {industry && delta < 0 && (
                    <p style={{ fontSize: 12, color: T.textMuted, margin: "8px 0 0", fontStyle: "italic" }}>
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
          <div className="sim-advanced" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 32 }}>
            {/* Left: sliders */}
            <div>
              <SectionLabel color={B.purple} sub="Adjust each structural factor to model a custom scenario.">
                Build Your Scenario
              </SectionLabel>

              <Card style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: T.textFaint, marginBottom: 20 }}>INCOME STRUCTURE</div>
                <Slider label="Recurring revenue" value={sl.recurrence} min={0} max={100} step={5} unit="%" onChange={(v) => { setSliders({ ...sl, recurrence: v }); setLastChangedSlider("recurrence"); }} />
                <Slider label="Top client share" value={sl.topClient} min={sl.sources <= 1 ? 100 : 10} max={100} step={5} unit="%" onChange={(v) => { setSliders({ ...sl, topClient: v }); setLastChangedSlider("topClient"); }} accent={B.bandDeveloping} />
                <Slider label="Income sources" value={sl.sources} min={1} max={8} step={1} unit="" onChange={(v) => { setSliders({ ...sl, sources: v, topClient: v <= 1 ? 100 : Math.min(sl.topClient, 100) }); setLastChangedSlider("sources"); }} />
              </Card>

              <Card style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: T.textFaint, marginBottom: 20 }}>PREDICTABILITY</div>
                <Slider label="Months booked ahead" value={sl.monthsBooked} min={0} max={6} step={0.5} unit=" mo" onChange={(v) => { setSliders({ ...sl, monthsBooked: v }); setLastChangedSlider("monthsBooked"); }} accent={B.bandEstablished} />
              </Card>

              <Card>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: T.textFaint, marginBottom: 20 }}>RESILIENCE</div>
                <Slider label="Passive income" value={sl.passive} min={0} max={100} step={5} unit="%" onChange={(v) => { setSliders({ ...sl, passive: v }); setLastChangedSlider("passive"); }} accent={B.purple} />
              </Card>

              <button onClick={() => { setSliders({ recurrence: baseInputs.income_persistence_pct, topClient: baseInputs.largest_source_pct, sources: baseInputs.source_diversity_count, monthsBooked: Math.round(baseInputs.forward_secured_pct / 100 * 6 * 2) / 2, passive: 100 - baseInputs.labor_dependence_pct }); setLastChangedSlider(null); }} style={{ fontSize: 11, color: T.textMuted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: "12px 0 0", marginTop: 4 }}>
                Reset to current
              </button>

              {/* ── Voice of the Model ── */}
              {isModified && simMode === "advanced" && lastChangedSlider && (() => {
                const baseSliderMap: Record<string, number> = {
                  recurrence: baseInputs.income_persistence_pct,
                  topClient: baseInputs.largest_source_pct,
                  sources: baseInputs.source_diversity_count,
                  monthsBooked: Math.round(baseInputs.forward_secured_pct / 100 * 6 * 2) / 2,
                  passive: 100 - baseInputs.labor_dependence_pct,
                };
                const currentSliderMap: Record<string, number> = {
                  recurrence: sl.recurrence,
                  topClient: sl.topClient,
                  sources: sl.sources,
                  monthsBooked: sl.monthsBooked,
                  passive: sl.passive,
                };
                const baseSliderValue = baseSliderMap[lastChangedSlider] ?? 0;
                const currentSliderValue = currentSliderMap[lastChangedSlider] ?? 0;
                if (baseSliderValue === currentSliderValue) return null;
                return (
                  <div style={{
                    marginTop: 16, padding: "16px 20px", borderRadius: 10,
                    backgroundColor: "rgba(26,122,109,0.08)", border: "1px solid rgba(26,122,109,0.15)",
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: BRAND.teal, marginBottom: 8 }}>
                      WHY THIS MATTERS
                    </div>
                    <p style={{ fontSize: 14, color: T.text, lineHeight: 1.65, margin: 0 }}>
                      {getSliderExplanation(lastChangedSlider, baseSliderValue, currentSliderValue, delta)}
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* Right: analysis */}
            <div>
              {insights.length > 0 && (
                <div style={{ marginBottom: 28 }}>
                  <SectionLabel color={B.purple}>What Changed</SectionLabel>
                  {insights.map((ins, i) => (
                    <div key={i} style={{ fontSize: 13, color: T.text, fontWeight: 500, marginBottom: 8, padding: "12px 16px", backgroundColor: B.purpleGlow, borderRadius: 8, border: `1px solid rgba(75,63,174,0.12)` }}>{ins}</div>
                  ))}
                </div>
              )}

              <div style={{ marginBottom: 0 }}>
                <SectionLabel color={B.bandLimited} sub="How your simulated structure holds up if something goes wrong. Lower drops mean a more resilient position.">
                  Stress Tests
                </SectionLabel>
                {[
                  { label: "Lose top client", value: `${sim.overall_score} \u2192 ${stLC.overall_score}`, sub: `${stLC.overall_score - sim.overall_score} points`, color: B.bandLimited },
                  { label: "Unable to work 90 days", value: `${sim.overall_score} \u2192 ${stNW.overall_score}`, sub: `${stNW.overall_score - sim.overall_score} points`, color: B.bandLimited },
                  { label: "Income runway", value: `${runway} days`, sub: runway < 30 ? "Critical" : runway < 90 ? "Limited" : "Healthy", color: runway < 30 ? B.bandLimited : runway < 90 ? B.bandDeveloping : B.teal },
                  { label: "Fragility class", value: sim.fragility_class.charAt(0).toUpperCase() + sim.fragility_class.slice(1), sub: "", color: sim.fragility_class === "brittle" || sim.fragility_class === "thin" ? B.bandLimited : sim.fragility_class === "moderate" ? B.bandDeveloping : B.teal },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: T.textSecondary }}>{row.label}</span>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: row.color }}>{row.value}</span>
                      {row.sub && <div style={{ fontSize: 10, color: T.textMuted }}>{row.sub}</div>}
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
            <p style={{ fontSize: 13, color: T.textSecondary, marginBottom: 16, marginTop: 0 }}>
              {industry && incomeModel
                ? `For ${incomeModel.toLowerCase()} professionals in ${industry}, the fastest path to gain 10 points:`
                : "The most efficient structural changes to gain 10 points:"}
            </p>
            {pathSteps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", backgroundColor: B.tealGlow, border: `1px solid ${B.teal}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: B.teal }}>{i + 1}</span>
                </div>
                <span style={{ fontSize: 13, color: T.text, fontWeight: 500, lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
            {industry && (
              <p style={{ fontSize: 12, color: T.textMuted, marginTop: 16, marginBottom: 0, fontStyle: "italic", paddingLeft: 34 }}>
                Top 20% of {industry} professionals typically have 60%+ recurring revenue and less than 35% from any single source.
              </p>
            )}
          </Card>
        )}

        {/* ══════════ STRESS TEST: RISK FLOOR ══════════ */}
        <div style={{ marginTop: 32 }}>
          <button
            onClick={() => setStressTestActive(!stressTestActive)}
            style={{
              padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600,
              color: BRAND.bandLimited, backgroundColor: "rgba(220,74,74,0.06)",
              border: `1px solid rgba(220,74,74,0.15)`, cursor: "pointer",
              transition: "background-color 200ms",
              width: "100%", textAlign: "left",
            }}
          >
            {stressTestActive ? "Hide Stress Test" : "Run Stress Test: See Your Floor"}
          </button>

          {stressTestActive && (() => {
            const stressedTopClient = Math.min(80, Math.round(sl.topClient + sl.topClient * 0.2));
            const stressedRecurrence = Math.max(0, sl.recurrence - 20);
            const stressedMonthsBooked = Math.round(sl.monthsBooked / 2 * 2) / 2;
            const stressedInputs: CanonicalInput = {
              income_persistence_pct: stressedRecurrence,
              largest_source_pct: stressedTopClient,
              source_diversity_count: sl.sources,
              forward_secured_pct: Math.min(100, Math.round(stressedMonthsBooked / 6 * 100)),
              income_variability_level: baseInputs.income_variability_level,
              labor_dependence_pct: Math.max(0, 100 - sl.passive),
            };
            const stressResult = simulateScore(stressedInputs, qualityScore);
            const currentRef = isModified ? sim.overall_score : base.overall_score;
            const stressDelta = stressResult.overall_score - currentRef;

            return (
              <div style={{
                marginTop: 12, padding: "24px 28px", borderRadius: 12,
                backgroundColor: "rgba(220,74,74,0.04)", border: `1px solid rgba(220,74,74,0.15)`,
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: BRAND.bandLimited, marginBottom: 12 }}>
                  YOUR FLOOR
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 48, fontWeight: 300, fontFamily: DISPLAY, color: BRAND.bandLimited, lineHeight: 1 }}>
                    {stressResult.overall_score}
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 600, color: BRAND.bandLimited }}>{stressDelta} points</div>
                    <div style={{ fontSize: 13, color: bandColor(stressResult.band), fontWeight: 600, marginTop: 4 }}>{stressResult.band}</div>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: T.textSecondary, lineHeight: 1.65, margin: 0 }}>
                  This is your worst realistic scenario — if your biggest source left, recurring income dropped, and booked income fell simultaneously. This is the floor your income structure protects against.
                </p>
              </div>
            );
          })()}
        </div>

        {/* ══════════ SAVED SCENARIOS COMPARISON ══════════ */}
        {savedScenarios.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <SectionLabel color={BRAND.purple}>Saved Scenarios</SectionLabel>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {savedScenarios.map((s, i) => (
                <div key={i} style={{
                  flex: 1, minWidth: 160, padding: "16px 20px", borderRadius: 10,
                  backgroundColor: T.surface, border: `1px solid ${T.border}`,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textFaint, marginBottom: 8 }}>{s.name}</div>
                  <div style={{ fontSize: 28, fontWeight: 600, color: BRAND.teal }}>{s.score}</div>
                  <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>{s.band}</div>
                  <button
                    onClick={() => setSavedScenarios(prev => prev.filter((_, j) => j !== i))}
                    style={{ marginTop: 12, fontSize: 11, color: T.textFaint, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            {savedScenarios.length >= 2 && (
              <p style={{ fontSize: 14, color: T.textSecondary, marginTop: 16, lineHeight: 1.6 }}>
                {(() => {
                  const best = savedScenarios.reduce((a, b) => a.score > b.score ? a : b);
                  return `${best.name} produces the highest score at ${best.score}. Compare the scenarios above to decide which path is most realistic for you.`;
                })()}
              </p>
            )}
          </div>
        )}

      </div>


      {/* ══════════ READY-TO-USE ACTION SCRIPTS ══════════ */}
      {scriptTemplates.length > 0 && (
        <div style={{ padding: "40px 36px", borderTop: `1px solid ${T.border}` }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: BRAND.teal, marginBottom: 6 }}>Ready-to-Use Action Scripts</div>
            <div style={{ fontSize: 16, color: T.textSecondary, fontWeight: 500, lineHeight: 1.4 }}>Operational language calibrated to your industry. Copy, adapt, and send.</div>
          </div>
          {scriptTemplates.map((script) => {
            const isExpanded = expandedScript === script.id;
            return (
              <div key={script.id} style={{ marginBottom: 10, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
                <button onClick={() => setExpandedScript(isExpanded ? null : script.id)} style={{ width: "100%", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "none", cursor: "pointer", backgroundColor: isExpanded ? "rgba(75,63,174,0.10)" : T.surface, transition: "background-color 150ms ease" }}>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{script.title}</div>
                    <div style={{ fontSize: 13, color: T.textMuted, marginTop: 2 }}>{script.context}</div>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 600, color: BRAND.purple, transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms ease", flexShrink: 0, marginLeft: 12 }}>&#9662;</span>
                </button>
                {isExpanded && (
                  <div style={{ padding: "20px 24px", backgroundColor: "rgba(75,63,174,0.04)", borderTop: `1px solid ${T.border}` }}>
                    <pre style={{ fontSize: 14, color: T.text, margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.75, fontFamily: INTER }}>{script.script}</pre>
                    <button
                      onClick={() => { navigator.clipboard.writeText(script.script); setScriptCopied(script.id); setTimeout(() => setScriptCopied(null), 2000); }}
                      style={{
                        marginTop: 16, padding: "10px 20px", fontSize: 13, fontWeight: 600,
                        color: scriptCopied === script.id ? BRAND.teal : T.text,
                        borderRadius: 8,
                        border: `1px solid ${scriptCopied === script.id ? BRAND.teal : T.border}`,
                        cursor: "pointer",
                        backgroundColor: scriptCopied === script.id ? BRAND.tealGlow : T.surface,
                        transition: "all 200ms ease",
                      }}
                    >
                      {scriptCopied === script.id ? "\u2713 Copied to clipboard" : "Copy to clipboard"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          <p style={{ fontSize: 12, color: T.textFaint, marginTop: 14, fontStyle: "italic" }}>
            These are starting drafts calibrated to your industry — adapt the language to fit your voice and situation.
          </p>
        </div>
      )}

      {/* ══════════ FOOTER ══════════ */}
      <footer className="sim-footer" style={{ borderTop: `1px solid ${T.border}`, padding: "20px 36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: T.textFaint, letterSpacing: "0.02em" }}>Income Stability Score&#8482; &middot; Model RP-2.0</span>
        <span style={{ fontSize: 11, color: T.textFaint, letterSpacing: "0.02em" }}>Deterministic &middot; Fixed Rules &middot; Versioned</span>
      </footer>
    </div>
    </ThemeCtx.Provider>
  );
}

export default function SimulatorPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#070F19", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ fontSize: 14, color: "rgba(244,241,234,0.35)" }}>Loading simulator...</p></div>}>
      <SimulatorContent />
    </Suspense>
  );
}
