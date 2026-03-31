"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { simulateScore, SIMULATOR_PRESETS } from "@/lib/engine/v2/simulate";
import type { CanonicalInput } from "@/lib/engine/v2/simulate";

/* ================================================================== */
/*  DESIGN TOKENS — Locked                                             */
/* ================================================================== */
const C = {
  bg: "#F1EEE7",
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
function nextBandInfo(s: number): { name: string; gap: number } | null {
  if (s >= 75) return null;
  if (s >= 50) return { name: "High Stability", gap: 75 - s };
  if (s >= 30) return { name: "Established Stability", gap: 50 - s };
  return { name: "Developing Stability", gap: 30 - s };
}
function distToMax(s: number): number { return Math.max(0, 100 - s); }

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
function ControlModule({ title, impact, description, effects, children }: {
  title: string; impact: string; description: string; effects: string[];
  children: React.ReactNode;
}) {
  return (
    <div style={{
      backgroundColor: C.card, border: `1px solid ${C.divider}`,
      borderRadius: 8, padding: 20, marginBottom: 24,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <span style={TY.h3}>{title}</span>
        <span style={{ ...TY.label, color: C.teal, fontWeight: 600, flexShrink: 0, marginLeft: 12 }}>{impact}</span>
      </div>
      <p style={{ ...TY.body, marginBottom: 16, maxWidth: 480 }}>{description}</p>
      <div style={{ marginBottom: 16 }}>{children}</div>
      <div>
        <span style={{ ...TY.label, marginBottom: 4, display: "block" }}>Expected Effect</span>
        {effects.map(e => (
          <div key={e} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
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
/*  ACCESS CODE GATE                                                   */
/* ================================================================== */
function AccessCodeGate({ onLoad }: { onLoad: (rec: Record<string, unknown>) => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    const trimmed = code.trim();
    if (!trimmed) { setError("Paste your Access Code."); return; }
    try {
      const d = JSON.parse(atob(trimmed));
      if (typeof d.p !== "number" || typeof d.c !== "number" || typeof d.l !== "number") { setError("Invalid code."); return; }
      const nr: Record<string, unknown> = {
        record_id: `sim-${Date.now()}`, authorization_code: "", model_version: "RP-2.0",
        assessment_date_utc: new Date().toISOString(), issued_timestamp_utc: new Date().toISOString(),
        final_score: 0, stability_band: "", assessment_title: d.n || "",
        classification: "", operating_structure: "", primary_income_model: d.m || "",
        industry_sector: d.i || "",
        _v2: {
          normalized_inputs: {
            income_persistence_pct: d.p, largest_source_pct: d.c, source_diversity_count: d.s,
            forward_secured_pct: d.f, income_variability_level: d.v || "moderate", labor_dependence_pct: d.l,
          },
          quality: { quality_score: d.q || 5 },
        },
      };
      sessionStorage.setItem("rp_record", JSON.stringify(nr));
      onLoad(nr);
    } catch { setError("Invalid code. Copy the full code from your report."); }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, fontFamily: INTER, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        backgroundColor: C.card, border: `1px solid ${C.divider}`, borderRadius: 8,
        padding: 32, maxWidth: 440, width: "100%", margin: "0 24px",
      }}>
        <div style={{ ...TY.label, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 12 }}>PASTE ACCESS CODE</div>
        <p style={{ ...TY.body, marginBottom: 16 }}>Enter the code from your Income Stability Report to load your simulation data.</p>
        <input
          type="text" value={code} onChange={e => setCode(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleSubmit(); }}
          placeholder="Paste code here"
          style={{
            width: "100%", padding: "12px 16px", fontSize: 14, fontFamily: "monospace",
            border: `1px solid ${error ? C.oxblood : C.divider}`, borderRadius: 6,
            outline: "none", boxSizing: "border-box", marginBottom: 12, backgroundColor: C.card,
          }}
        />
        {error && <p style={{ fontSize: 12, color: C.oxblood, margin: "0 0 12px" }}>{error}</p>}
        <button onClick={handleSubmit} style={{
          width: "100%", padding: "10px 0", borderRadius: 6,
          backgroundColor: C.btnPrimary, color: "#FFFFFF", fontSize: 14, fontWeight: 600,
          border: "none", cursor: "pointer", transition: "background 150ms ease",
        }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.btnHover; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.btnPrimary; }}
        >
          Load Simulation
        </button>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  MAIN PAGE                                                          */
/* ================================================================== */
export default function SimulatorPage() {
  const router = useRouter();
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [noData, setNoData] = useState(false);
  const [mobile, setMobile] = useState(false);
  const baseRef = useRef<CanonicalInput | null>(null);
  const qScoreRef = useRef(5);

  const [inputs, setInputs] = useState<CanonicalInput>({
    income_persistence_pct: 25, largest_source_pct: 60, source_diversity_count: 2,
    forward_secured_pct: 15, income_variability_level: "moderate", labor_dependence_pct: 70,
  });

  useEffect(() => {
    const c = () => setMobile(window.innerWidth <= 900);
    c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c);
  }, []);

  const loadRecord = useCallback((parsed: Record<string, unknown>) => {
    setRecord(parsed);
    setNoData(false);
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
  }, []);

  useEffect(() => {
    let stored = sessionStorage.getItem("rp_record");
    if (!stored) stored = localStorage.getItem("rp_record");
    if (!stored) { setNoData(true); return; }
    try { loadRecord(JSON.parse(stored)); } catch { setNoData(true); }
  }, [loadRecord]);

  const updateInput = useCallback(<K extends keyof CanonicalInput>(key: K, val: CanonicalInput[K]) => {
    setInputs(prev => ({ ...prev, [key]: val }));
  }, []);

  const resetToActual = useCallback(() => {
    if (baseRef.current) setInputs({ ...baseRef.current });
  }, []);

  // Access code gate
  if (noData && !record) return <AccessCodeGate onLoad={loadRecord} />;
  if (!record) return null;

  // Live simulation
  const result = simulateScore(inputs, qScoreRef.current);
  const simScore = result.overall_score;
  const simBand = result.band;
  const fragClass = result.fragility_class;
  const contMonths = result.continuity_months;

  // Base score for delta
  const baseResult = baseRef.current ? simulateScore(baseRef.current, qScoreRef.current) : result;
  const baseScore = baseRef.current ? baseResult.overall_score : simScore;
  const delta = simScore - baseScore;
  const hasChanges = delta !== 0;

  // Structural breakdown
  const activeP = inputs.labor_dependence_pct;
  const persistentP = inputs.income_persistence_pct;
  const semiP = Math.max(0, 100 - activeP - persistentP);

  // Root constraint detection
  const factors = [
    { key: "concentration", val: inputs.largest_source_pct, threshold: 40, label: "High concentration" },
    { key: "persistence", val: 100 - inputs.income_persistence_pct, threshold: 50, label: "Low persistence" },
    { key: "forward", val: 100 - inputs.forward_secured_pct, threshold: 60, label: "Weak forward visibility" },
    { key: "labor", val: inputs.labor_dependence_pct, threshold: 50, label: "High labor dependence" },
    { key: "diversity", val: inputs.source_diversity_count <= 2 ? 80 : inputs.source_diversity_count <= 3 ? 40 : 0, threshold: 30, label: "Low source diversity" },
  ];
  const sorted = [...factors].sort((a, b) => b.val - a.val);
  const rootConstraint = sorted[0];
  const secondaryConstraint = sorted[1]?.val > sorted[1]?.threshold ? sorted[1] : null;

  // Constraint copy
  const constraintCopy: Record<string, { line1: string; line2: string; consequence: string }> = {
    concentration: {
      line1: `${inputs.largest_source_pct}% of your income flows through one source.`,
      line2: `Losing it would eliminate ${inputs.largest_source_pct}% of total revenue.`,
      consequence: "Loss of your primary source would create immediate structural pressure.",
    },
    persistence: {
      line1: `Only ${inputs.income_persistence_pct}% of your income repeats automatically.`,
      line2: `${100 - inputs.income_persistence_pct}% must be re-earned each month.`,
      consequence: "Any disruption to active work immediately reduces total income.",
    },
    forward: {
      line1: `Only ${inputs.forward_secured_pct}% of next quarter is committed.`,
      line2: `${100 - inputs.forward_secured_pct}% has no forward guarantee.`,
      consequence: "Revenue visibility is too short to absorb a pipeline gap.",
    },
    labor: {
      line1: `${inputs.labor_dependence_pct}% of your income requires daily active work.`,
      line2: `Only ${100 - inputs.labor_dependence_pct}% continues without you.`,
      consequence: "A work stoppage of any duration creates immediate income loss.",
    },
    diversity: {
      line1: `Income flows from only ${inputs.source_diversity_count} source${inputs.source_diversity_count === 1 ? "" : "s"}.`,
      line2: "Structural resilience requires broader distribution.",
      consequence: "Losing any single source creates outsized impact on total income.",
    },
  };
  const rootCopy = constraintCopy[rootConstraint.key] || constraintCopy.concentration;

  // Stress scenario
  const stressPreset = SIMULATOR_PRESETS.find(p => p.id === "lose_top_client")!;
  const stressScore = simulateScore(stressPreset.modify(inputs), qScoreRef.current).overall_score;
  const stressDrop = simScore - stressScore;

  // Distance
  const nextInfo = nextBandInfo(simScore);
  const toMax = distToMax(simScore);

  // Impact items
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

  // Fastest next move
  const growthPresets = SIMULATOR_PRESETS.filter(p => !["lose_top_client", "cant_work_90_days"].includes(p.id));
  let bestNext = { label: "", lift: 0 };
  for (const p of growthPresets) {
    const r2 = simulateScore(p.modify(inputs), qScoreRef.current);
    const lift = r2.overall_score - simScore;
    if (lift > bestNext.lift) bestNext = { label: p.label, lift };
  }

  // Impact range per control
  const impactRange = (key: keyof CanonicalInput, lo: number, hi: number) => {
    const sLo = simulateScore({ ...inputs, [key]: lo }, qScoreRef.current).overall_score;
    const sHi = simulateScore({ ...inputs, [key]: hi }, qScoreRef.current).overall_score;
    const diff = Math.abs(sHi - sLo);
    if (diff === 0) return "\u2014";
    return `\u00B1${Math.ceil(diff / 2)} pts`;
  };

  // "What This Means" summary
  const wtmLines: string[] = [];
  if (simScore >= 60) wtmLines.push("Your structure is stable under normal conditions.");
  else if (simScore >= 40) wtmLines.push("Your structure handles routine months but is exposed to disruptions.");
  else wtmLines.push("Your structure is vulnerable to common disruptions.");
  if (inputs.largest_source_pct >= 40) wtmLines.push("It remains sensitive to concentration.");
  if (inputs.labor_dependence_pct >= 60) wtmLines.push("High labor dependence limits resilience.");
  if (bestNext.lift >= 5) wtmLines.push("One change would materially improve resilience.");
  else if (bestNext.lift > 0) wtmLines.push("Incremental improvements are available.");

  // Instability driver line
  const drivers: string[] = [];
  if (inputs.largest_source_pct >= 40) drivers.push("concentration");
  if (inputs.labor_dependence_pct >= 50) drivers.push("labor dependence");
  if (inputs.income_persistence_pct <= 30) drivers.push("low persistence");
  if (inputs.forward_secured_pct <= 25) drivers.push("weak forward visibility");
  const driverLine = drivers.length > 0
    ? `${Math.round(activeP + (100 - persistentP) * 0.3)}% of instability is driven by ${drivers.join(" and ")}.`
    : null;

  // Simulation output summary
  const simSummary = hasChanges
    ? delta > 0
      ? `Selected changes improve stability${inputs.largest_source_pct >= 40 ? " but do not eliminate concentration risk" : ""}.`
      : "Selected changes reduce structural stability."
    : "No simulation changes applied.";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, fontFamily: INTER }}>
      <title>Simulator | Command Center | RunPayway</title>

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
        padding: mobile ? "0 16px" : "0 32px", maxWidth: 1120, margin: "0 auto",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div>
          <div style={{ ...TY.h2, fontSize: 16 }}>Command Center</div>
          <div style={{ ...TY.label, fontSize: 11, marginTop: 1 }}>Live Structural Simulation</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: mobile ? 8 : 16 }}>
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
              ...TY.body, fontWeight: 500, color: C.secondary, padding: "8px 12px",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = C.text; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.secondary; }}
          >
            Reset
          </button>
          <button onClick={() => router.push("/dashboard")}
            style={{
              padding: "8px 16px", borderRadius: 6,
              backgroundColor: C.btnPrimary, color: "#FFFFFF",
              fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
              transition: "background 150ms ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.btnHover; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.btnPrimary; }}
          >
            Command Center
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div style={{
        maxWidth: 1120, margin: "0 auto", padding: mobile ? "32px 16px" : "48px 32px",
        display: mobile ? "block" : "grid",
        gridTemplateColumns: mobile ? "1fr" : "7fr 5fr",
        gap: 24, alignItems: "start",
      }}>

        {/* ══════════ LEFT — CONTROL PANEL ══════════ */}
        <div>
          <div style={{ ...TY.h2, marginBottom: 16 }}>Structural Adjustments</div>

          <ControlModule
            title="Income Persistence"
            impact={impactRange("income_persistence_pct", 0, 100)}
            description="Percentage of income that repeats without re-selling each period."
            effects={["Increased recurring base", "Reduced rebuilding pressure"]}
          >
            <Slider value={inputs.income_persistence_pct} min={0} max={100} step={5}
              onChange={v => updateInput("income_persistence_pct", v)} suffix="%"
              labels={{ left: "None repeats", right: "Fully recurring" }} />
          </ControlModule>

          <ControlModule
            title="Income Concentration"
            impact={impactRange("largest_source_pct", 10, 100)}
            description="Share of total income from your single largest source."
            effects={["Reduced single-point failure", "Lower source-loss impact"]}
          >
            <Slider value={inputs.largest_source_pct} min={10} max={100} step={5}
              onChange={v => updateInput("largest_source_pct", v)} suffix="%"
              labels={{ left: "Spread evenly", right: "One source dominant" }} />
          </ControlModule>

          <ControlModule
            title="Source Diversification"
            impact={impactRange("source_diversity_count", 1, 8)}
            description="Number of meaningfully contributing income sources."
            effects={["Broader income base", "Reduced single-source exposure"]}
          >
            <Slider value={inputs.source_diversity_count} min={1} max={8} step={1}
              onChange={v => updateInput("source_diversity_count", v)}
              labels={{ left: "1 source", right: "8 sources" }} />
          </ControlModule>

          <ControlModule
            title="Forward Revenue Visibility"
            impact={impactRange("forward_secured_pct", 0, 100)}
            description="Percentage of next quarter committed through contracts or retainers."
            effects={["Increased planning certainty", "Reduced pipeline risk"]}
          >
            <Slider value={inputs.forward_secured_pct} min={0} max={100} step={5}
              onChange={v => updateInput("forward_secured_pct", v)} suffix="%"
              labels={{ left: "Nothing locked in", right: "Fully committed" }} />
          </ControlModule>

          <ControlModule
            title="Labor Dependence"
            impact={impactRange("labor_dependence_pct", 0, 100)}
            description="Percentage of income requiring your active daily work to continue."
            effects={["Income continues during disruptions", "Reduced capacity risk"]}
          >
            <Slider value={inputs.labor_dependence_pct} min={0} max={100} step={5}
              onChange={v => updateInput("labor_dependence_pct", v)} suffix="%"
              labels={{ left: "Income persists", right: "Stops when you stop" }} />
          </ControlModule>

          <ControlModule
            title="Earnings Variability"
            impact={impactRange("income_variability_level", 0, 3)}
            description="Monthly income fluctuation level."
            effects={["More predictable cash flow", "Easier planning"]}
          >
            <VariabilityToggle value={inputs.income_variability_level}
              onChange={v => updateInput("income_variability_level", v)} />
          </ControlModule>
        </div>

        {/* ══════════ RIGHT — LIVE OUTPUT ══════════ */}
        <div style={{ position: mobile ? "static" : "sticky", top: 112 }}>

          {/* Status */}
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
                ...TY.label, fontSize: 11, color: C.secondary, textDecoration: "underline", textUnderlineOffset: 3,
              }}>
                Revert to Actual
              </button>
            )}
          </div>

          {/* 1. SCORE BLOCK */}
          <div style={{
            backgroundColor: C.card, border: `1px solid ${C.divider}`,
            borderRadius: 8, padding: 24, marginBottom: 24,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
              {/* Ring */}
              <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
                <ScoreRing score={simScore} size={120} />
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 44, fontWeight: 600, color: C.text, lineHeight: 1, letterSpacing: "-0.03em" }}>{simScore}</span>
                </div>
              </div>
              {/* Score details */}
              <div style={{ flex: 1, paddingTop: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: C.bronze }} />
                  <span style={{ ...TY.h3 }}>{simBand}</span>
                </div>
                {hasChanges && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 14, color: C.label }}>{baseScore}</span>
                    <span style={{ fontSize: 12, color: C.label }}>&rarr;</span>
                    <span style={{ fontSize: 16, fontWeight: 600, color: C.text }}>{simScore}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: delta > 0 ? C.teal : C.oxblood }}>
                      {delta > 0 ? "+" : ""}{delta}
                    </span>
                  </div>
                )}
                <div style={{ fontSize: 12, color: C.label, marginBottom: 2 }}>{toMax} points to Maximum</div>
              </div>
            </div>

            {/* Metrics row */}
            <div style={{ display: "flex", gap: 0, marginTop: 20, borderTop: `1px solid ${C.divider}`, paddingTop: 16 }}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ ...TY.label, fontSize: 10, marginBottom: 4 }}>RUNWAY</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: C.text }}>{contMonths.toFixed(1)} <span style={{ fontSize: 12, fontWeight: 400, color: C.label }}>mo</span></div>
              </div>
              <div style={{ width: 1, backgroundColor: C.divider }} />
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ ...TY.label, fontSize: 10, marginBottom: 4 }}>TOP SOURCE RISK</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: stressDrop >= 15 ? C.oxblood : C.text }}>&minus;{stressDrop}</div>
              </div>
              <div style={{ width: 1, backgroundColor: C.divider }} />
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ ...TY.label, fontSize: 10, marginBottom: 4 }}>FRAGILITY</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text, textTransform: "capitalize" as const }}>{fragClass}</div>
              </div>
            </div>
          </div>

          {/* 2. ROOT CONSTRAINT */}
          <div style={{
            backgroundColor: C.card, borderLeft: `3px solid ${C.oxblood}`,
            border: `1px solid ${C.divider}`, borderLeftWidth: 3, borderLeftColor: C.oxblood,
            borderRadius: 8, padding: 20, marginBottom: 24,
          }}>
            <div style={{ ...TY.label, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: C.oxblood, marginBottom: 10 }}>ROOT CONSTRAINT</div>
            <p style={{ fontSize: 14, fontWeight: 500, color: C.text, margin: "0 0 2px", lineHeight: 1.5 }}>{rootCopy.line1}</p>
            <p style={{ fontSize: 14, color: C.secondary, margin: "0 0 12px", lineHeight: 1.5 }}>{rootCopy.line2}</p>
            <p style={{ fontSize: 13, color: C.secondary, margin: "0 0 12px", lineHeight: 1.5, fontStyle: "italic" }}>{rootCopy.consequence}</p>
            {secondaryConstraint && (
              <div style={{ ...TY.label, fontSize: 11, color: C.label }}>Secondary: {secondaryConstraint.label}</div>
            )}
          </div>

          {/* 3. STRUCTURAL BREAKDOWN */}
          <div style={{
            backgroundColor: C.card, border: `1px solid ${C.divider}`,
            borderRadius: 8, padding: 20, marginBottom: 24,
          }}>
            <div style={{ ...TY.label, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 12 }}>STRUCTURAL BREAKDOWN</div>

            {/* Labels above bar */}
            <div style={{ display: "flex", marginBottom: 6 }}>
              <div style={{ width: `${activeP}%`, minWidth: activeP > 5 ? "auto" : 0 }}>
                {activeP > 5 && <span style={{ ...TY.label, fontSize: 10, color: C.slate }}>Active {activeP}%</span>}
              </div>
              <div style={{ width: `${semiP}%`, minWidth: semiP > 5 ? "auto" : 0 }}>
                {semiP > 5 && <span style={{ ...TY.label, fontSize: 10, color: C.teal }}>Semi {semiP}%</span>}
              </div>
              <div style={{ width: `${persistentP}%`, minWidth: persistentP > 5 ? "auto" : 0 }}>
                {persistentP > 5 && <span style={{ ...TY.label, fontSize: 10, color: C.bronze }}>Persistent {persistentP}%</span>}
              </div>
            </div>

            <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ width: `${activeP}%`, backgroundColor: C.slate, transition: "width 300ms ease" }} />
              <div style={{ width: `${semiP}%`, backgroundColor: C.teal, transition: "width 300ms ease" }} />
              <div style={{ width: `${persistentP}%`, backgroundColor: C.bronze, transition: "width 300ms ease" }} />
            </div>

            {driverLine && (
              <p style={{ fontSize: 12, color: C.secondary, margin: 0, lineHeight: 1.5 }}>{driverLine}</p>
            )}
          </div>

          {/* 4. IMPACT SUMMARY */}
          {impactItems.length > 0 && (
            <div style={{
              backgroundColor: C.card, border: `1px solid ${C.divider}`,
              borderRadius: 8, padding: 20, marginBottom: 24,
            }}>
              <div style={{ ...TY.label, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 10 }}>WHAT CHANGED</div>
              {impactItems.map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: item.includes("\u2191") ? C.teal : C.oxblood }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* 5. STRESS SCENARIO */}
          <div style={{
            backgroundColor: C.card, borderLeft: `3px solid ${C.oxblood}`,
            border: `1px solid ${C.divider}`, borderLeftWidth: 3, borderLeftColor: C.oxblood,
            borderRadius: 8, padding: 20, marginBottom: 24,
          }}>
            <div style={{ ...TY.label, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: C.oxblood, marginBottom: 8 }}>STRESS SCENARIO</div>
            <p style={{ fontSize: 13, color: C.secondary, margin: "0 0 8px", lineHeight: 1.5 }}>
              If your largest income source is removed:
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ ...TY.label, color: C.secondary }}>Projected Score</span>
              <span style={{ fontSize: 22, fontWeight: 600, color: C.oxblood }}>{stressScore}</span>
              <span style={{ ...TY.label, color: C.oxblood }}>(&minus;{stressDrop})</span>
            </div>
          </div>

          {/* 6. SIMULATION OUTPUT */}
          {hasChanges && (
            <div style={{
              backgroundColor: C.card, border: `1px solid ${C.divider}`,
              borderRadius: 8, padding: 20, marginBottom: 24,
            }}>
              <div style={{ ...TY.label, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 10 }}>SIMULATION OUTPUT</div>
              <p style={{ fontSize: 13, color: C.secondary, margin: "0 0 16px", lineHeight: 1.5 }}>{simSummary}</p>
              <div style={{ textAlign: "center", padding: "12px 0", backgroundColor: C.bg, borderRadius: 6 }}>
                <div style={{ ...TY.label, fontSize: 10, marginBottom: 4 }}>PROJECTED SCORE</div>
                <span style={{ fontSize: 32, fontWeight: 600, color: C.text }}>{simScore}</span>
              </div>
            </div>
          )}

          {/* 7. DISTANCE PANEL */}
          <div style={{
            backgroundColor: C.card, border: `1px solid ${C.divider}`,
            borderRadius: 8, padding: 20, marginBottom: 24,
          }}>
            <div style={{ ...TY.label, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 10 }}>DISTANCE TO NEXT BAND</div>
            {nextInfo ? (
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 600, color: C.text }}>{nextInfo.gap}</span>
                <span style={{ fontSize: 14, color: C.secondary }}>points to {nextInfo.name}</span>
              </div>
            ) : (
              <div style={{ fontSize: 14, fontWeight: 500, color: C.teal, marginBottom: 8 }}>Highest stability band reached.</div>
            )}

            {bestNext.lift > 0 && (
              <div style={{ borderTop: `1px solid ${C.divider}`, paddingTop: 12, marginTop: 4 }}>
                <div style={{ ...TY.label, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 6 }}>FASTEST NEXT MOVE</div>
                <p style={{ fontSize: 13, color: C.text, margin: "0 0 4px", fontWeight: 500, lineHeight: 1.5 }}>{bestNext.label}</p>
                <span style={{ ...TY.label, color: C.teal, fontWeight: 600 }}>+{bestNext.lift} pts</span>
              </div>
            )}
          </div>

          {/* 8. WHAT THIS MEANS */}
          <div style={{
            backgroundColor: C.card, border: `1px solid ${C.divider}`,
            borderRadius: 8, padding: 20,
          }}>
            <div style={{ ...TY.label, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 10 }}>WHAT THIS MEANS</div>
            {wtmLines.map(line => (
              <div key={line} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                <div style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: C.slate, flexShrink: 0, marginTop: 6 }} />
                <span style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{line}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
