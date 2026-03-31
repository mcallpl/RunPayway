"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { simulateScore, SIMULATOR_PRESETS } from "@/lib/engine/v2/simulate";
import type { CanonicalInput } from "@/lib/engine/v2/simulate";

/* ================================================================== */
/*  DESIGN TOKENS — Locked per spec                                    */
/* ================================================================== */
const C = {
  bg: "#F4F1EA",
  card: "#FFFFFF",
  text: "#0B0F14",
  secondary: "#4A5568",
  divider: "#E3E8EF",
  bronze: "#B08D57",
  teal: "#1F6D7A",
  slate: "#5C6B7A",
  oxblood: "#7A1F2B",
  btnPrimary: "#0E1A2B",
  btnHover: "#142338",
  label: "#8A94A6",
  stressBg: "#F6EDEE",
};

const INTER = "'Inter', system-ui, -apple-system, sans-serif";

/* ================================================================== */
/*  TYPOGRAPHY                                                         */
/* ================================================================== */
const TY = {
  h1: { fontSize: 28, fontWeight: 600, color: C.text, lineHeight: 1.2 } as const,
  h2: { fontSize: 18, fontWeight: 600, color: C.text, lineHeight: 1.3 } as const,
  h3: { fontSize: 14, fontWeight: 600, color: C.text, letterSpacing: "0.2px", lineHeight: 1.4 } as const,
  body: { fontSize: 14, fontWeight: 400, color: C.secondary, lineHeight: 1.5 } as const,
  label: { fontSize: 12, fontWeight: 500, color: C.label, lineHeight: 1.4 } as const,
};

/* ================================================================== */
/*  BAND HELPERS                                                       */
/* ================================================================== */
function bandName(s: number): string {
  return s >= 75 ? "High Stability" : s >= 50 ? "Established Stability" : s >= 30 ? "Developing Stability" : "Limited Stability";
}
function nextBandInfo(s: number): { name: string; gap: number } | null {
  if (s >= 75) return null;
  if (s >= 50) return { name: "High Stability", gap: 75 - s };
  if (s >= 30) return { name: "Established Stability", gap: 50 - s };
  return { name: "Developing Stability", gap: 30 - s };
}

/* ================================================================== */
/*  SLIDER COMPONENT                                                   */
/* ================================================================== */
function Slider({ value, min, max, step, onChange, suffix, labels }: {
  value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; suffix?: string;
  labels?: { left: string; right: string };
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div style={{ position: "relative", height: 32, display: "flex", alignItems: "center" }}>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            width: "100%", height: 4, appearance: "none", WebkitAppearance: "none",
            background: `linear-gradient(to right, ${C.teal} 0%, ${C.teal} ${pct}%, ${C.divider} ${pct}%, ${C.divider} 100%)`,
            borderRadius: 2, outline: "none", cursor: "pointer",
          }}
        />
        <div style={{
          position: "absolute", top: -24, left: `calc(${pct}% - 16px)`,
          ...TY.label, fontSize: 11, fontWeight: 600, color: C.teal,
          minWidth: 32, textAlign: "center",
        }}>
          {value}{suffix || ""}
        </div>
      </div>
      {labels && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
          <span style={{ ...TY.label, fontSize: 11 }}>{labels.left}</span>
          <span style={{ ...TY.label, fontSize: 11 }}>{labels.right}</span>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  VARIABILITY TOGGLE                                                 */
/* ================================================================== */
const VAR_LEVELS: CanonicalInput["income_variability_level"][] = ["low", "moderate", "high", "extreme"];
const VAR_LABELS: Record<string, string> = { low: "Low", moderate: "Moderate", high: "High", extreme: "Extreme" };

function VariabilityToggle({ value, onChange }: {
  value: CanonicalInput["income_variability_level"];
  onChange: (v: CanonicalInput["income_variability_level"]) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 0, borderRadius: 6, overflow: "hidden", border: `1px solid ${C.divider}` }}>
      {VAR_LEVELS.map(lvl => (
        <button key={lvl} onClick={() => onChange(lvl)}
          style={{
            flex: 1, padding: "8px 0", fontSize: 12, fontWeight: value === lvl ? 600 : 400,
            backgroundColor: value === lvl ? C.btnPrimary : C.card,
            color: value === lvl ? "#FFFFFF" : C.secondary,
            border: "none", cursor: "pointer",
            borderRight: lvl !== "extreme" ? `1px solid ${C.divider}` : "none",
            transition: "background 100ms ease, color 100ms ease",
          }}
        >
          {VAR_LABELS[lvl]}
        </button>
      ))}
    </div>
  );
}

/* ================================================================== */
/*  CONTROL MODULE                                                     */
/* ================================================================== */
interface ControlModuleProps {
  title: string;
  impact: string;
  description: string;
  effects: string[];
  children: React.ReactNode;
}
function ControlModule({ title, impact, description, effects, children }: ControlModuleProps) {
  return (
    <div style={{
      backgroundColor: C.card, border: `1px solid ${C.divider}`,
      borderRadius: 8, padding: 20, marginBottom: 24,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <span style={TY.h3}>{title}</span>
        <span style={{ ...TY.label, color: C.teal, fontWeight: 600, flexShrink: 0, marginLeft: 12 }}>{impact}</span>
      </div>
      <p style={{ ...TY.body, marginBottom: 16 }}>{description}</p>
      <div style={{ marginBottom: 16 }}>{children}</div>
      <div>
        <span style={{ ...TY.label, marginBottom: 6, display: "block" }}>Expected Effect</span>
        {effects.map(e => (
          <div key={e} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: C.slate, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: C.secondary }}>{e}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  SCORE RING                                                         */
/* ================================================================== */
function ScoreRing({ score, size }: { score: number; size: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.divider} strokeWidth={4} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.bronze} strokeWidth={4}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 400ms cubic-bezier(0.22,1,0.36,1)" }} />
    </svg>
  );
}

/* ================================================================== */
/*  MAIN PAGE                                                          */
/* ================================================================== */
export default function SimulatorPage() {
  const router = useRouter();
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [mobile, setMobile] = useState(false);
  const baseRef = useRef<CanonicalInput | null>(null);
  const qScoreRef = useRef(5);

  // Simulation state
  const [inputs, setInputs] = useState<CanonicalInput>({
    income_persistence_pct: 25, largest_source_pct: 60, source_diversity_count: 2,
    forward_secured_pct: 15, income_variability_level: "moderate", labor_dependence_pct: 70,
  });

  useEffect(() => {
    const c = () => setMobile(window.innerWidth <= 900);
    c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c);
  }, []);

  useEffect(() => {
    let stored = sessionStorage.getItem("rp_record");
    if (!stored) stored = localStorage.getItem("rp_record");
    if (!stored) { router.push("/diagnostic-portal"); return; }
    try {
      const parsed = JSON.parse(stored);
      setRecord(parsed);
      const v2 = parsed?._v2 as Record<string, unknown> | undefined;
      const ni = v2?.normalized_inputs as Record<string, number | string> | undefined;
      const q = ((v2?.quality as Record<string, number>)?.quality_score) ?? 5;
      qScoreRef.current = q;
      if (ni) {
        const base: CanonicalInput = {
          income_persistence_pct: (ni.income_persistence_pct as number) || 0,
          largest_source_pct: (ni.largest_source_pct as number) || 0,
          source_diversity_count: (ni.source_diversity_count as number) || 1,
          forward_secured_pct: (ni.forward_secured_pct as number) || 0,
          income_variability_level: ((ni.income_variability_level as string) || "moderate") as CanonicalInput["income_variability_level"],
          labor_dependence_pct: (ni.labor_dependence_pct as number) || 0,
        };
        baseRef.current = { ...base };
        setInputs(base);
      }
    } catch { router.push("/diagnostic-portal"); }
  }, [router]);

  const updateInput = useCallback(<K extends keyof CanonicalInput>(key: K, val: CanonicalInput[K]) => {
    setInputs(prev => ({ ...prev, [key]: val }));
  }, []);

  const resetToActual = useCallback(() => {
    if (baseRef.current) setInputs({ ...baseRef.current });
  }, []);

  if (!record) return null;

  // Live simulation
  const result = simulateScore(inputs, qScoreRef.current);
  const simScore = result.overall_score;
  const simBand = result.band;

  // Base score for delta
  const baseResult = baseRef.current ? simulateScore(baseRef.current, qScoreRef.current) : result;
  const baseScore = baseRef.current ? baseResult.overall_score : simScore;
  const delta = simScore - baseScore;
  const hasChanges = delta !== 0;

  // Structural breakdown
  const activeP = inputs.labor_dependence_pct;
  const persistentP = inputs.income_persistence_pct;
  const semiP = Math.max(0, 100 - activeP - persistentP);

  // Stress scenario — lose top client
  const stressPreset = SIMULATOR_PRESETS.find(p => p.id === "lose_top_client")!;
  const stressResult = simulateScore(stressPreset.modify(inputs), qScoreRef.current);
  const stressScore = stressResult.overall_score;

  // Distance to next band
  const nextInfo = nextBandInfo(simScore);

  // Impact summary — what changed vs base
  const impactItems: string[] = [];
  if (baseRef.current) {
    if (inputs.income_persistence_pct > baseRef.current.income_persistence_pct) impactItems.push("Persistence \u2191");
    if (inputs.income_persistence_pct < baseRef.current.income_persistence_pct) impactItems.push("Persistence \u2193");
    if (inputs.largest_source_pct < baseRef.current.largest_source_pct) impactItems.push("Concentration \u2193");
    if (inputs.largest_source_pct > baseRef.current.largest_source_pct) impactItems.push("Concentration \u2191");
    if (inputs.source_diversity_count > baseRef.current.source_diversity_count) impactItems.push("Diversification \u2191");
    if (inputs.source_diversity_count < baseRef.current.source_diversity_count) impactItems.push("Diversification \u2193");
    if (inputs.forward_secured_pct > baseRef.current.forward_secured_pct) impactItems.push("Forward visibility \u2191");
    if (inputs.forward_secured_pct < baseRef.current.forward_secured_pct) impactItems.push("Forward visibility \u2193");
    if (inputs.labor_dependence_pct < baseRef.current.labor_dependence_pct) impactItems.push("Labor dependence \u2193");
    if (inputs.labor_dependence_pct > baseRef.current.labor_dependence_pct) impactItems.push("Labor dependence \u2191");
    const varOrder = { low: 0, moderate: 1, high: 2, extreme: 3 };
    if (varOrder[inputs.income_variability_level] < varOrder[baseRef.current.income_variability_level]) impactItems.push("Variability \u2193");
    if (varOrder[inputs.income_variability_level] > varOrder[baseRef.current.income_variability_level]) impactItems.push("Variability \u2191");
  }

  // Fastest next move — find highest single-preset lift
  const growthPresets = SIMULATOR_PRESETS.filter(p => !["lose_top_client", "cant_work_90_days"].includes(p.id));
  let bestNext = { label: "", lift: 0 };
  for (const p of growthPresets) {
    const r2 = simulateScore(p.modify(inputs), qScoreRef.current);
    const lift = r2.overall_score - simScore;
    if (lift > bestNext.lift) bestNext = { label: p.label, lift };
  }

  // Impact range per control
  const impactRange = (key: keyof CanonicalInput, lo: number, hi: number) => {
    const testLo = { ...inputs, [key]: lo };
    const testHi = { ...inputs, [key]: hi };
    const sLo = simulateScore(testLo, qScoreRef.current).overall_score;
    const sHi = simulateScore(testHi, qScoreRef.current).overall_score;
    const diff = Math.abs(sHi - sLo);
    if (diff === 0) return "—";
    return `\u00B1${Math.ceil(diff / 2)} pts`;
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, fontFamily: INTER }}>
      <title>Simulator | Command Center | RunPayway</title>

      {/* Slider thumb styling */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 16px; height: 16px; border-radius: 50%;
          background: ${C.btnPrimary}; border: 2px solid ${C.card};
          box-shadow: 0 1px 4px rgba(0,0,0,0.15); cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px; height: 16px; border-radius: 50%;
          background: ${C.btnPrimary}; border: 2px solid ${C.card};
          box-shadow: 0 1px 4px rgba(0,0,0,0.15); cursor: pointer;
        }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
        height: 64, borderBottom: `1px solid ${C.divider}`, backgroundColor: C.card,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", maxWidth: 1120, margin: "0 auto",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div>
          <div style={{ ...TY.h2, fontSize: 16 }}>Command Center</div>
          <div style={{ ...TY.label, fontSize: 11, marginTop: 1 }}>Live Structural Simulation</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {hasChanges && (
            <span style={{
              ...TY.label, fontSize: 13, fontWeight: 600,
              color: delta > 0 ? C.teal : delta < 0 ? C.oxblood : C.secondary,
            }}>
              {delta > 0 ? "+" : ""}{delta}
            </span>
          )}
          <button onClick={resetToActual}
            style={{
              background: "none", border: "none", cursor: "pointer",
              ...TY.body, fontWeight: 500, color: C.secondary,
              padding: "8px 12px",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = C.text; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.secondary; }}
          >
            Reset Simulation
          </button>
          <button onClick={() => router.push("/dashboard")}
            style={{
              padding: "8px 20px", borderRadius: 6,
              backgroundColor: C.btnPrimary, color: "#FFFFFF",
              fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
              transition: "background 150ms ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.btnHover; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.btnPrimary; }}
          >
            Back to Command Center
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div style={{
        maxWidth: 1120, margin: "0 auto", padding: "48px 32px",
        display: mobile ? "block" : "grid",
        gridTemplateColumns: mobile ? "1fr" : "7fr 5fr",
        gap: 24, alignItems: "start",
      }}>

        {/* ══════════ LEFT — CONTROL PANEL ══════════ */}
        <div>
          <div style={{ ...TY.h2, marginBottom: 16 }}>Structural Adjustments</div>

          {/* Persistence */}
          <ControlModule
            title="Income Persistence"
            impact={impactRange("income_persistence_pct", 0, 100)}
            description="What percentage of your income repeats automatically without re-selling or re-negotiating each period."
            effects={["Increased recurring revenue base", "Reduced monthly rebuilding pressure"]}
          >
            <Slider value={inputs.income_persistence_pct} min={0} max={100} step={5}
              onChange={v => updateInput("income_persistence_pct", v)} suffix="%"
              labels={{ left: "None repeats", right: "Fully recurring" }} />
          </ControlModule>

          {/* Concentration */}
          <ControlModule
            title="Income Concentration"
            impact={impactRange("largest_source_pct", 10, 100)}
            description="How much of your total income flows through your single largest source. Lower concentration means less single-point-of-failure risk."
            effects={["Reduced dependency on one client", "Lower impact from source loss"]}
          >
            <Slider value={inputs.largest_source_pct} min={10} max={100} step={5}
              onChange={v => updateInput("largest_source_pct", v)} suffix="%"
              labels={{ left: "Spread evenly", right: "One source dominant" }} />
          </ControlModule>

          {/* Source Diversity */}
          <ControlModule
            title="Source Diversification"
            impact={impactRange("source_diversity_count", 1, 8)}
            description="The number of meaningfully contributing income sources. More sources create structural resilience against individual losses."
            effects={["Broader income base", "Reduced single-source exposure"]}
          >
            <Slider value={inputs.source_diversity_count} min={1} max={8} step={1}
              onChange={v => updateInput("source_diversity_count", v)}
              labels={{ left: "1 source", right: "8 sources" }} />
          </ControlModule>

          {/* Forward Visibility */}
          <ControlModule
            title="Forward Revenue Visibility"
            impact={impactRange("forward_secured_pct", 0, 100)}
            description="What percentage of next quarter's income is already committed through signed contracts, retainers, or prepaid agreements."
            effects={["Increased planning certainty", "Reduced month-to-month guessing"]}
          >
            <Slider value={inputs.forward_secured_pct} min={0} max={100} step={5}
              onChange={v => updateInput("forward_secured_pct", v)} suffix="%"
              labels={{ left: "Nothing locked in", right: "Fully committed" }} />
          </ControlModule>

          {/* Labor Dependence */}
          <ControlModule
            title="Labor Dependence"
            impact={impactRange("labor_dependence_pct", 0, 100)}
            description="What percentage of your income requires your active, daily work to continue. Lower dependence means income that persists without you."
            effects={["Income continues during disruptions", "Reduced personal capacity risk"]}
          >
            <Slider value={inputs.labor_dependence_pct} min={0} max={100} step={5}
              onChange={v => updateInput("labor_dependence_pct", v)} suffix="%"
              labels={{ left: "Income persists", right: "Stops when you stop" }} />
          </ControlModule>

          {/* Variability */}
          <ControlModule
            title="Earnings Variability"
            impact={impactRange("income_variability_level", 0, 3)}
            description="How much your monthly income fluctuates. Lower variability means more predictable cash flow month to month."
            effects={["More predictable cash flow", "Easier financial planning"]}
          >
            <VariabilityToggle value={inputs.income_variability_level}
              onChange={v => updateInput("income_variability_level", v)} />
          </ControlModule>
        </div>

        {/* ══════════ RIGHT — LIVE OUTPUT ══════════ */}
        <div style={{ position: mobile ? "static" : "sticky", top: 112 }}>

          {/* Simulation Status */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{
              ...TY.label, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
              color: hasChanges ? C.teal : C.label,
            }}>
              {hasChanges ? "SIMULATION ACTIVE" : "CURRENT STATE"}
            </span>
            {hasChanges && (
              <button onClick={resetToActual} style={{
                background: "none", border: "none", cursor: "pointer",
                ...TY.label, fontSize: 11, color: C.secondary, textDecoration: "underline",
                textUnderlineOffset: 3,
              }}>
                Revert to Actual
              </button>
            )}
          </div>

          {/* 1. SCORE BLOCK */}
          <div style={{
            backgroundColor: C.card, border: `1px solid ${C.divider}`,
            borderRadius: 8, padding: 24, marginBottom: 24, textAlign: "center",
          }}>
            <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto 16px" }}>
              <ScoreRing score={simScore} size={140} />
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 56, fontWeight: 600, color: C.text, lineHeight: 1, letterSpacing: "-0.03em" }}>
                  {simScore}
                </span>
              </div>
            </div>

            {hasChanges && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 16, color: C.label }}>{baseScore}</span>
                <span style={{ fontSize: 14, color: C.label }}>&rarr;</span>
                <span style={{ fontSize: 20, fontWeight: 600, color: C.text }}>{simScore}</span>
                <span style={{
                  fontSize: 16, fontWeight: 600,
                  color: delta > 0 ? C.teal : C.oxblood,
                }}>
                  {delta > 0 ? "+" : ""}{delta}
                </span>
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: C.bronze }} />
              <span style={{ ...TY.h3, color: C.text }}>{simBand}</span>
            </div>
          </div>

          {/* 2. STRUCTURAL BREAKDOWN */}
          <div style={{
            backgroundColor: C.card, border: `1px solid ${C.divider}`,
            borderRadius: 8, padding: 20, marginBottom: 24,
          }}>
            <div style={{ ...TY.label, marginBottom: 12 }}>STRUCTURAL BREAKDOWN</div>
            <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ width: `${activeP}%`, backgroundColor: C.slate, transition: "width 300ms ease" }} />
              <div style={{ width: `${semiP}%`, backgroundColor: C.teal, transition: "width 300ms ease" }} />
              <div style={{ width: `${persistentP}%`, backgroundColor: C.bronze, transition: "width 300ms ease" }} />
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: C.slate }} />
                <span style={{ ...TY.label, fontSize: 11 }}>Active {activeP}%</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: C.teal }} />
                <span style={{ ...TY.label, fontSize: 11 }}>Semi-persistent {semiP}%</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: C.bronze }} />
                <span style={{ ...TY.label, fontSize: 11 }}>Persistent {persistentP}%</span>
              </div>
            </div>
          </div>

          {/* 3. IMPACT SUMMARY */}
          {impactItems.length > 0 && (
            <div style={{
              backgroundColor: C.card, border: `1px solid ${C.divider}`,
              borderRadius: 8, padding: 20, marginBottom: 24,
            }}>
              <div style={{ ...TY.label, marginBottom: 12 }}>WHAT CHANGED</div>
              {impactItems.map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: item.includes("\u2191") ? C.teal : C.oxblood }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* 4. STRESS SCENARIO */}
          <div style={{
            backgroundColor: C.stressBg, borderLeft: `3px solid ${C.oxblood}`,
            borderRadius: 8, padding: 20, marginBottom: 24,
          }}>
            <div style={{ ...TY.label, color: C.oxblood, marginBottom: 8 }}>STRESS SCENARIO</div>
            <p style={{ fontSize: 13, color: C.secondary, margin: "0 0 8px", lineHeight: 1.5 }}>
              If your largest income source is removed:
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ ...TY.label, color: C.secondary }}>Projected Score</span>
              <span style={{ fontSize: 22, fontWeight: 600, color: C.oxblood }}>{stressScore}</span>
              <span style={{ ...TY.label, color: C.oxblood }}>({simScore - stressScore > 0 ? "-" : ""}{simScore - stressScore} pts)</span>
            </div>
          </div>

          {/* 5. DISTANCE PANEL */}
          <div style={{
            backgroundColor: C.card, border: `1px solid ${C.divider}`,
            borderRadius: 8, padding: 20, marginBottom: 24,
          }}>
            <div style={{ ...TY.label, marginBottom: 12 }}>DISTANCE TO NEXT BAND</div>
            {nextInfo ? (
              <>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 28, fontWeight: 600, color: C.text }}>{nextInfo.gap}</span>
                  <span style={{ fontSize: 14, color: C.secondary }}>points to {nextInfo.name}</span>
                </div>
                {hasChanges && baseRef.current && (
                  <div style={{ ...TY.label, color: C.teal, marginBottom: 12 }}>
                    {delta > 0 ? `${delta} pts closer after simulation` : delta < 0 ? `${Math.abs(delta)} pts further after simulation` : "No change"}
                  </div>
                )}
              </>
            ) : (
              <div style={{ fontSize: 14, fontWeight: 500, color: C.teal }}>
                You are in the highest stability band.
              </div>
            )}

            {bestNext.lift > 0 && (
              <div style={{ borderTop: `1px solid ${C.divider}`, paddingTop: 12, marginTop: 4 }}>
                <div style={{ ...TY.label, marginBottom: 6 }}>FASTEST NEXT MOVE</div>
                <p style={{ fontSize: 13, color: C.text, margin: "0 0 4px", fontWeight: 500, lineHeight: 1.5 }}>
                  {bestNext.label}
                </p>
                <span style={{ ...TY.label, color: C.teal, fontWeight: 600 }}>+{bestNext.lift} pts</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
