"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import logoImg from "../../../../public/runpayway-logo.png";
import { simulateScore, SIMULATOR_PRESETS } from "@/lib/engine/v2/simulate";
import type { CanonicalInput } from "@/lib/engine/v2/types";

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */
const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1A7A6D",
  sand: "#F5F2EC",
  bone: "#F8F6F1",
  white: "#FFFFFF",
  stone: "rgba(14,26,43,0.12)",
  taupe: "rgba(14,26,43,0.42)",
  muted: "rgba(14,26,43,0.55)",
  light: "rgba(14,26,43,0.38)",
  bandLimited: "#9B2C2C",
  bandDeveloping: "#92640A",
  bandEstablished: "#2B5EA7",
  bandHigh: "#1A7A6D",
};

const T = {
  pageTitle: { fontSize: 24, fontWeight: 600, lineHeight: 1.2, color: B.navy },
  sectionTitle: { fontSize: 15, fontWeight: 600, lineHeight: 1.3, color: B.navy },
  overline: { fontSize: 9.5, fontWeight: 700, lineHeight: 1.3, letterSpacing: "0.12em", textTransform: "uppercase" as const },
  sectionLabel: { fontSize: 12, fontWeight: 600, lineHeight: 1.4 },
  cardHero: { fontSize: 22, fontWeight: 600, lineHeight: 1.1 },
  body: { fontSize: 11.5, fontWeight: 400, lineHeight: 1.65 },
  small: { fontSize: 10.5, fontWeight: 400, lineHeight: 1.55 },
  meta: { fontSize: 10, fontWeight: 400, lineHeight: 1.5 },
};

const cardStyle: React.CSSProperties = {
  backgroundColor: B.bone,
  border: "1px solid rgba(14,26,43,0.06)",
  borderRadius: 4,
  padding: "16px 20px",
};

/* ------------------------------------------------------------------ */
/*  Slider component                                                   */
/* ------------------------------------------------------------------ */
function Slider({ label, value, min, max, step, unit, onChange }: {
  label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void;
}) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: B.navy }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: B.purple }}>{value}{unit}</span>
      </div>
      <div style={{ position: "relative", height: 24 }}>
        <div style={{ position: "absolute", top: 10, left: 0, right: 0, height: 4, backgroundColor: "rgba(14,26,43,0.08)", borderRadius: 2 }} />
        <div style={{ position: "absolute", top: 10, left: 0, width: `${pct}%`, height: 4, backgroundColor: B.purple, borderRadius: 2 }} />
        <div style={{ position: "absolute", top: 5, left: `${pct}%`, transform: "translateX(-50%)", width: 14, height: 14, borderRadius: "50%", backgroundColor: B.purple, border: "2px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 24, opacity: 0, cursor: "pointer", margin: 0 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 11, color: B.light }}>{min}{unit}</span>
        <span style={{ fontSize: 11, color: B.light }}>{max}{unit}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
function SimulatorContent() {
  const searchParams = useSearchParams();
  const [loaded, setLoaded] = useState(false);
  const [simMode, setSimMode] = useState<"presets" | "advanced">("presets");
  const [simPreset, setSimPreset] = useState<string | null>(null);
  const [sliders, setSliders] = useState<{
    recurrence: number; topClient: number; sources: number; monthsBooked: number; passive: number;
  } | null>(null);

  // Parse inputs from URL params or sessionStorage
  const [baseInputs, setBaseInputs] = useState<CanonicalInput | null>(null);
  const [qualityScore, setQualityScore] = useState(5);
  const [userName, setUserName] = useState("");
  const [userScore, setUserScore] = useState(0);
  const [userBand, setUserBand] = useState("");

  useEffect(() => {
    // Try URL params first (from QR code)
    const p = searchParams.get("p");
    const c = searchParams.get("c");
    const src = searchParams.get("src");
    const f = searchParams.get("f");
    const v = searchParams.get("v");
    const l = searchParams.get("l");
    const s = searchParams.get("s");
    const b = searchParams.get("b");
    const n = searchParams.get("n");
    const q = searchParams.get("q");

    if (p && c && src && f && l) {
      const inputs: CanonicalInput = {
        income_persistence_pct: Number(p),
        largest_source_pct: Number(c),
        source_diversity_count: Number(src),
        forward_secured_pct: Number(f),
        income_variability_level: (v || "moderate") as CanonicalInput["income_variability_level"],
        labor_dependence_pct: Number(l),
      };
      setBaseInputs(inputs);
      setQualityScore(Number(q) || 5);
      setUserScore(Number(s) || 0);
      setUserBand(b || "");
      setUserName(n ? decodeURIComponent(n) : "");
      setSliders({ recurrence: inputs.income_persistence_pct, topClient: inputs.largest_source_pct, sources: inputs.source_diversity_count, monthsBooked: Math.round(inputs.forward_secured_pct / 100 * 6 * 2) / 2, passive: 100 - inputs.labor_dependence_pct });
      setLoaded(true);
      return;
    }

    // Fallback: try sessionStorage record
    try {
      const stored = sessionStorage.getItem("rp_record");
      if (stored) {
        const record = JSON.parse(stored);
        const v2 = record._v2;
        if (v2?.normalized_inputs) {
          const ni = v2.normalized_inputs;
          const inputs: CanonicalInput = {
            income_persistence_pct: ni.income_persistence_pct,
            largest_source_pct: ni.largest_source_pct,
            source_diversity_count: ni.source_diversity_count,
            forward_secured_pct: ni.forward_secured_pct,
            income_variability_level: ni.income_variability_level,
            labor_dependence_pct: ni.labor_dependence_pct,
          };
          setBaseInputs(inputs);
          setQualityScore(v2.quality?.quality_score ?? 5);
          setUserScore(record.final_score || 0);
          setUserBand(record.stability_band || "");
          setUserName(record.assessment_title || "");
          setSliders({ recurrence: inputs.income_persistence_pct, topClient: inputs.largest_source_pct, sources: inputs.source_diversity_count, monthsBooked: Math.round(inputs.forward_secured_pct / 100 * 6 * 2) / 2, passive: 100 - inputs.labor_dependence_pct });
          setLoaded(true);
        }
      }
    } catch { /* ignore */ }
  }, [searchParams]);

  if (!loaded || !baseInputs) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", padding: 40, textAlign: "center" }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: B.navy, marginBottom: 12 }}>Score Simulator</h2>
        <p style={{ fontSize: 14, color: B.muted, marginBottom: 24, maxWidth: 400 }}>
          Scan the QR code on your report to load your data, or take the assessment first.
        </p>
        <a href="/pricing" style={{ padding: "12px 24px", fontSize: 14, fontWeight: 600, color: "#fff", backgroundColor: B.navy, border: "none", borderRadius: 8, textDecoration: "none" }}>
          Get Your Score
        </a>
      </div>
    );
  }

  const sl = sliders!;
  let simInputs: CanonicalInput;
  if (simMode === "advanced" && sliders) {
    const guardedTopClient = sl.sources <= 1 ? 100 : Math.max(Math.round(100 / sl.sources), sl.topClient);
    simInputs = {
      income_persistence_pct: sl.recurrence,
      largest_source_pct: guardedTopClient,
      source_diversity_count: sl.sources,
      forward_secured_pct: Math.min(100, Math.round(sl.monthsBooked / 6 * 100)),
      income_variability_level: baseInputs.income_variability_level,
      labor_dependence_pct: Math.max(0, 100 - sl.passive),
    };
  } else {
    const activePreset = SIMULATOR_PRESETS.find(p => p.id === simPreset);
    simInputs = activePreset ? activePreset.modify(baseInputs) : baseInputs;
  }

  const baseResult = simulateScore(baseInputs, qualityScore);
  const simResult = simulateScore(simInputs, qualityScore);
  const scoreDelta = simResult.overall_score - baseResult.overall_score;
  const isModified = simMode === "advanced" ? !!sliders : !!simPreset;

  const stressLoseClient = simulateScore(SIMULATOR_PRESETS.find(p => p.id === "lose_top_client")!.modify(simInputs), qualityScore);
  const stressNoWork = simulateScore(SIMULATOR_PRESETS.find(p => p.id === "cant_work_90_days")!.modify(simInputs), qualityScore);
  const simRunwayDays = Math.round(simResult.continuity_months * 30);

  // Dynamic insights
  const insights: string[] = [];
  if (simMode === "advanced" && sliders) {
    const rd = sl.recurrence - baseInputs.income_persistence_pct;
    const cd = sl.topClient - baseInputs.largest_source_pct;
    const pd = sl.passive - (100 - baseInputs.labor_dependence_pct);
    if (rd >= 15) insights.push(`+${rd}% recurring adds ${Math.round(rd * 0.03 * 30)} days of runway`);
    if (cd <= -15) insights.push(`Top client ${baseInputs.largest_source_pct}% → ${sl.topClient}%: +${Math.abs(Math.round(cd * 0.15))} resilience`);
    if (pd >= 15) insights.push(`${sl.passive}% passive — continues if you stop`);
    if (simResult.band !== baseResult.band) insights.push(`Crossed into ${simResult.band}`);
  }

  // Path to +10
  const pathSteps: string[] = [];
  if (baseResult.overall_score < 90) {
    const tries = [
      { label: "recurring", field: "income_persistence_pct" as const, step: 5, dir: 1 },
      { label: "top client", field: "largest_source_pct" as const, step: -5, dir: -1 },
      { label: "forward visibility", field: "forward_secured_pct" as const, step: 5, dir: 1 },
      { label: "labor dependence", field: "labor_dependence_pct" as const, step: -5, dir: -1 },
    ];
    let rem = 10;
    for (const t of tries) {
      if (rem <= 0) break;
      const test = { ...baseInputs, [t.field]: Math.max(0, Math.min(100, (baseInputs[t.field] as number) + t.step * 3)) };
      const tr = simulateScore(test, qualityScore);
      const lift = tr.overall_score - baseResult.overall_score;
      if (lift > 0) { const n = Math.min(lift, rem); pathSteps.push(`${t.dir > 0 ? "Increase" : "Reduce"} ${t.label} from ${baseInputs[t.field]}% to ${Math.max(0, Math.min(100, (baseInputs[t.field] as number) + t.step * 3))}% (+${n})`); rem -= n; }
    }
  }

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 28px 60px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, paddingBottom: 16, borderBottom: "1px solid rgba(14,26,43,0.08)" }}>
        <Image src={logoImg} alt="RunPayway" width={120} height={14} style={{ height: "auto" }} />
        <div style={{ textAlign: "right" }}>
          <div style={{ ...T.meta, color: B.taupe }}>Score Simulator</div>
          {userName && <div style={{ ...T.meta, color: B.taupe }}>{userName}</div>}
        </div>
      </div>

      <h1 style={{ ...T.pageTitle, marginBottom: 8 }}>Income Decision Engine</h1>
      <p style={{ ...T.body, color: B.muted, marginBottom: 24, maxWidth: 480 }}>
        Model your income structure in real time. Adjust the sliders or click a scenario to see how changes affect your score.
      </p>

      {/* Score display */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, ...cardStyle, padding: "20px 24px" }}>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>CURRENT</div>
          <div style={{ ...T.cardHero, color: B.navy }}>{baseResult.overall_score}<span style={{ ...T.meta, color: B.taupe }}>/100</span></div>
          <div style={{ ...T.meta, color: B.muted }}>{baseResult.band}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", color: B.taupe, fontSize: 20 }}>→</div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>{isModified ? "SIMULATED" : "BASELINE"}</div>
          <div style={{ ...T.cardHero, color: scoreDelta > 0 ? B.teal : scoreDelta < 0 ? B.bandLimited : B.navy }}>{simResult.overall_score}<span style={{ ...T.meta, color: B.taupe }}>/100</span></div>
          <div style={{ ...T.meta, color: B.muted }}>{simResult.band}</div>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>IMPACT</div>
          <div style={{ ...T.cardHero, color: scoreDelta > 0 ? B.teal : scoreDelta < 0 ? B.bandLimited : B.muted }}>
            {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta === 0 ? "—" : String(scoreDelta)}
          </div>
          <div style={{ ...T.meta, color: B.muted }}>{simRunwayDays} days runway</div>
        </div>
      </div>

      {/* Mode toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <button onClick={() => { setSimMode("presets"); setSliders({ recurrence: baseInputs.income_persistence_pct, topClient: baseInputs.largest_source_pct, sources: baseInputs.source_diversity_count, monthsBooked: Math.round(baseInputs.forward_secured_pct / 100 * 6 * 2) / 2, passive: 100 - baseInputs.labor_dependence_pct }); }} style={{ flex: 1, padding: "12px 16px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: `1px solid ${simMode === "presets" ? B.purple : B.stone}`, backgroundColor: simMode === "presets" ? "rgba(75,63,174,0.06)" : "#fff", color: simMode === "presets" ? B.purple : B.navy, cursor: "pointer" }}>
          Quick Scenarios
        </button>
        <button onClick={() => { setSimMode("advanced"); setSimPreset(null); }} style={{ flex: 1, padding: "12px 16px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: `1px solid ${simMode === "advanced" ? B.purple : B.stone}`, backgroundColor: simMode === "advanced" ? "rgba(75,63,174,0.06)" : "#fff", color: simMode === "advanced" ? B.purple : B.navy, cursor: "pointer" }}>
          Customize Your Scenario
        </button>
      </div>

      {/* Presets */}
      {simMode === "presets" && (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {SIMULATOR_PRESETS.map((preset) => {
              const isActive = simPreset === preset.id;
              return (
                <button key={preset.id} onClick={() => setSimPreset(isActive ? null : preset.id)} style={{ padding: "10px 16px", fontSize: 12, fontWeight: 600, borderRadius: 6, border: `1px solid ${isActive ? B.purple : B.stone}`, cursor: "pointer", backgroundColor: isActive ? "rgba(75,63,174,0.08)" : "#fff", color: isActive ? B.purple : B.navy }}>
                  {preset.label}
                </button>
              );
            })}
          </div>
          {simPreset && (() => {
            const activePreset = SIMULATOR_PRESETS.find(p => p.id === simPreset)!;
            return (
              <div style={{ backgroundColor: "rgba(75,63,174,0.04)", borderRadius: 4, padding: "14px 18px", marginBottom: 24 }}>
                <div style={{ ...T.sectionLabel, color: B.purple, marginBottom: 4 }}>{activePreset.label}</div>
                <p style={{ ...T.small, color: B.muted, margin: 0 }}>{activePreset.description}</p>
                {scoreDelta !== 0 && (
                  <p style={{ ...T.small, color: scoreDelta > 0 ? B.teal : B.bandLimited, margin: "8px 0 0", fontWeight: 600 }}>
                    {scoreDelta > 0 ? `+${scoreDelta} points${simResult.band !== baseResult.band ? ` — moves to ${simResult.band}` : ""}` : `${scoreDelta} points${simResult.band !== baseResult.band ? ` — drops to ${simResult.band}` : ""}`}
                  </p>
                )}
              </div>
            );
          })()}
        </>
      )}

      {/* Advanced sliders */}
      {simMode === "advanced" && sliders && (
        <div style={{ display: "flex", gap: 32, marginBottom: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ ...T.overline, color: B.teal, marginBottom: 16 }}>ADJUST YOUR INCOME STRUCTURE</div>
            <div style={{ ...T.meta, color: B.taupe, fontWeight: 600, marginBottom: 10 }}>INCOME STRUCTURE</div>
            <Slider label="Recurring revenue" value={sl.recurrence} min={0} max={100} step={5} unit="%" onChange={(v) => setSliders({ ...sl, recurrence: v })} />
            <Slider label="Top client share" value={sl.topClient} min={sl.sources <= 1 ? 100 : 10} max={100} step={5} unit="%" onChange={(v) => setSliders({ ...sl, topClient: v })} />
            <Slider label="Income sources" value={sl.sources} min={1} max={8} step={1} unit="" onChange={(v) => setSliders({ ...sl, sources: v, topClient: v <= 1 ? 100 : Math.min(sl.topClient, 100) })} />
            <div style={{ ...T.meta, color: B.taupe, fontWeight: 600, marginTop: 8, marginBottom: 10 }}>PREDICTABILITY</div>
            <Slider label="Months booked ahead" value={sl.monthsBooked} min={0} max={6} step={0.5} unit=" mo" onChange={(v) => setSliders({ ...sl, monthsBooked: v })} />
            <div style={{ ...T.meta, color: B.taupe, fontWeight: 600, marginTop: 8, marginBottom: 10 }}>RESILIENCE</div>
            <Slider label="Passive income" value={sl.passive} min={0} max={100} step={5} unit="%" onChange={(v) => setSliders({ ...sl, passive: v })} />
            <button onClick={() => setSliders({ recurrence: baseInputs.income_persistence_pct, topClient: baseInputs.largest_source_pct, sources: baseInputs.source_diversity_count, monthsBooked: Math.round(baseInputs.forward_secured_pct / 100 * 6 * 2) / 2, passive: 100 - baseInputs.labor_dependence_pct })} style={{ ...T.meta, color: B.muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0, marginTop: 8 }}>
              Reset to current
            </button>
          </div>
          <div style={{ flex: 1 }}>
            {insights.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ ...T.overline, color: B.purple, marginBottom: 10 }}>WHAT CHANGED</div>
                {insights.map((ins, i) => (
                  <div key={i} style={{ ...T.small, color: B.navy, fontWeight: 500, marginBottom: 6, padding: "8px 12px", backgroundColor: "rgba(75,63,174,0.04)", borderRadius: 4 }}>{ins}</div>
                ))}
              </div>
            )}
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 10 }}>STRESS TESTS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", backgroundColor: B.bone, borderRadius: 4 }}>
                <span style={{ ...T.small, color: B.navy }}>Lose top client</span>
                <span style={{ ...T.small, fontWeight: 600, color: B.bandLimited }}>{simResult.overall_score}/100 → {stressLoseClient.overall_score}/100</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", backgroundColor: B.bone, borderRadius: 4 }}>
                <span style={{ ...T.small, color: B.navy }}>Unable to work 90 days</span>
                <span style={{ ...T.small, fontWeight: 600, color: B.bandLimited }}>{simResult.overall_score}/100 → {stressNoWork.overall_score}/100</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", backgroundColor: B.bone, borderRadius: 4 }}>
                <span style={{ ...T.small, color: B.navy }}>Income runway</span>
                <span style={{ ...T.small, fontWeight: 600, color: simRunwayDays < 30 ? B.bandLimited : simRunwayDays < 90 ? B.bandDeveloping : B.teal }}>{simRunwayDays} days</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", backgroundColor: B.bone, borderRadius: 4 }}>
                <span style={{ ...T.small, color: B.navy }}>Fragility</span>
                <span style={{ ...T.small, fontWeight: 600, color: simResult.fragility_class === "brittle" || simResult.fragility_class === "thin" ? B.bandLimited : B.teal }}>{simResult.fragility_class}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Path to +10 */}
      {pathSteps.length > 0 && (
        <div style={{ ...cardStyle, borderLeft: `3px solid ${B.teal}`, marginBottom: 24 }}>
          <div style={{ ...T.overline, color: B.teal, marginBottom: 8 }}>PATH TO {baseResult.overall_score + 10}/100</div>
          <p style={{ ...T.small, color: B.muted, marginBottom: 10 }}>The most efficient changes to gain 10 points:</p>
          {pathSteps.map((step, i) => (
            <div key={i} style={{ ...T.small, color: B.navy, fontWeight: 500, marginBottom: 4 }}>{i + 1}. {step}</div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ borderTop: "1px solid rgba(14,26,43,0.08)", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ ...T.meta, color: B.taupe }}>Income Stability Score&#8482; &middot; Model RP-2.0</span>
        <a href="/pricing" style={{ fontSize: 13, fontWeight: 600, color: B.purple, textDecoration: "none" }}>Get your score →</a>
      </div>
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <Suspense fallback={<div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}><p style={{ fontSize: 14, color: "rgba(14,26,43,0.55)" }}>Loading simulator...</p></div>}>
      <SimulatorContent />
    </Suspense>
  );
}
