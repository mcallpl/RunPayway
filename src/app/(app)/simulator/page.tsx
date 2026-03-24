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
  muted: "rgba(14,26,43,0.55)",
  light: "rgba(14,26,43,0.38)",
  stone: "rgba(14,26,43,0.08)",
  bandLimited: "#9B2C2C",
  bandDeveloping: "#92640A",
  bandHigh: "#1A7A6D",
};

const DISPLAY_FONT = "'DM Serif Display', Georgia, serif";

/* ------------------------------------------------------------------ */
/*  Slider                                                             */
/* ------------------------------------------------------------------ */
function Slider({ label, value, min, max, step, unit, onChange }: {
  label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void;
}) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#F4F1EA" }}>{label}</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: B.teal }}>{value}{unit}</span>
      </div>
      <div style={{ position: "relative", height: 28 }}>
        <div style={{ position: "absolute", top: 12, left: 0, right: 0, height: 4, backgroundColor: "rgba(244,241,234,0.10)", borderRadius: 2 }} />
        <div style={{ position: "absolute", top: 12, left: 0, width: `${pct}%`, height: 4, backgroundColor: B.teal, borderRadius: 2 }} />
        <div style={{ position: "absolute", top: 6, left: `${pct}%`, transform: "translateX(-50%)", width: 16, height: 16, borderRadius: "50%", backgroundColor: B.teal, border: "3px solid #F4F1EA", boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 28, opacity: 0, cursor: "pointer", margin: 0 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <span style={{ fontSize: 11, color: "rgba(244,241,234,0.25)" }}>{min}{unit}</span>
        <span style={{ fontSize: 11, color: "rgba(244,241,234,0.25)" }}>{max}{unit}</span>
      </div>
    </div>
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

  useEffect(() => {
    const p = searchParams.get("p");
    const c = searchParams.get("c");
    const src = searchParams.get("src");
    const f = searchParams.get("f");
    const v = searchParams.get("v");
    const l = searchParams.get("l");
    const n = searchParams.get("n");
    const q = searchParams.get("q");

    if (p && c && src && f && l) {
      const inputs: CanonicalInput = { income_persistence_pct: Number(p), largest_source_pct: Number(c), source_diversity_count: Number(src), forward_secured_pct: Number(f), income_variability_level: (v || "moderate") as CanonicalInput["income_variability_level"], labor_dependence_pct: Number(l) };
      setBaseInputs(inputs);
      setQualityScore(Number(q) || 5);
      setUserName(n ? decodeURIComponent(n) : "");
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
          setSliders({ recurrence: inputs.income_persistence_pct, topClient: inputs.largest_source_pct, sources: inputs.source_diversity_count, monthsBooked: Math.round(inputs.forward_secured_pct / 100 * 6 * 2) / 2, passive: 100 - inputs.labor_dependence_pct });
          setLoaded(true);
        }
      }
    } catch { /* ignore */ }
  }, [searchParams]);

  // Empty state
  if (!loaded || !baseInputs) {
    return (
      <div style={{ minHeight: "100vh", background: B.navy, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');`}</style>
        <div style={{ textAlign: "center", maxWidth: 400, padding: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 20 }}>Score Simulator</div>
          <h1 style={{ fontSize: 32, fontFamily: DISPLAY_FONT, fontWeight: 400, color: "#F4F1EA", lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: 16 }}>
            Scan your report to begin.
          </h1>
          <p style={{ fontSize: 15, color: "rgba(244,241,234,0.45)", lineHeight: 1.6, marginBottom: 32 }}>
            The QR code on your report loads your data into this simulator. Or take the assessment first.
          </p>
          <a href="/pricing" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 48, padding: "0 32px", borderRadius: 8, background: "linear-gradient(135deg, #F4F1EA 0%, #E8E5DD 100%)", color: B.navy, fontSize: 15, fontWeight: 600, textDecoration: "none", letterSpacing: "-0.01em" }}>
            Get Your Score
          </a>
        </div>
      </div>
    );
  }

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
  const stLC = simulateScore(SIMULATOR_PRESETS.find(p => p.id === "lose_top_client")!.modify(simInputs), qualityScore);
  const stNW = simulateScore(SIMULATOR_PRESETS.find(p => p.id === "cant_work_90_days")!.modify(simInputs), qualityScore);
  const runway = Math.round(sim.continuity_months * 30);

  const insights: string[] = [];
  if (simMode === "advanced" && sliders) {
    const rd = sl.recurrence - baseInputs.income_persistence_pct;
    const cd = sl.topClient - baseInputs.largest_source_pct;
    const pd = sl.passive - (100 - baseInputs.labor_dependence_pct);
    if (rd >= 15) insights.push(`+${rd}% recurring adds ${Math.round(rd * 0.03 * 30)} days of runway`);
    if (cd <= -15) insights.push(`Top client ${baseInputs.largest_source_pct}% → ${sl.topClient}%`);
    if (pd >= 15) insights.push(`${sl.passive}% passive — continues if you stop`);
    if (sim.band !== base.band) insights.push(`Crossed into ${sim.band}`);
  }

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
      if (lift > 0) { const n = Math.min(lift, rem); pathSteps.push(`${t.dir > 0 ? "Increase" : "Reduce"} ${t.label} from ${baseInputs[t.field]}% to ${Math.max(0, Math.min(100, (baseInputs[t.field] as number) + t.step * 3))}% (+${n})`); rem -= n; }
    }
  }

  const bandColor = (band: string) => band.includes("Limited") ? B.bandLimited : band.includes("Developing") ? B.bandDeveloping : B.bandHigh;

  return (
    <div style={{ minHeight: "100vh", background: B.navy }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');`}</style>

      {/* ── HEADER ── */}
      <div style={{ borderBottom: "1px solid rgba(244,241,234,0.06)", padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Image src={logoImg} alt="RunPayway" width={100} height={12} style={{ height: "auto", filter: "brightness(10)" }} />
          <div style={{ width: 1, height: 16, backgroundColor: "rgba(244,241,234,0.12)" }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.35)" }}>Score Simulator</span>
        </div>
        {userName && <span style={{ fontSize: 12, color: "rgba(244,241,234,0.30)" }}>{userName}</span>}
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "40px 28px 60px" }}>

        {/* ── SCORE HERO ── */}
        <div style={{ display: "flex", gap: 0, marginBottom: 32, borderRadius: 8, overflow: "hidden" }}>
          <div style={{ flex: 1, background: "rgba(244,241,234,0.04)", padding: "28px 24px", textAlign: "center", borderRight: "1px solid rgba(244,241,234,0.06)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.30)", marginBottom: 8 }}>CURRENT</div>
            <div style={{ fontSize: 36, fontWeight: 600, color: "#F4F1EA", lineHeight: 1 }}>{base.overall_score}<span style={{ fontSize: 14, fontWeight: 400, color: "rgba(244,241,234,0.30)" }}>/100</span></div>
            <div style={{ fontSize: 12, color: bandColor(base.band), fontWeight: 600, marginTop: 6 }}>{base.band}</div>
          </div>
          <div style={{ flex: 1, background: "rgba(244,241,234,0.04)", padding: "28px 24px", textAlign: "center", borderRight: "1px solid rgba(244,241,234,0.06)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.30)", marginBottom: 8 }}>{isModified ? "SIMULATED" : "BASELINE"}</div>
            <div style={{ fontSize: 36, fontWeight: 600, color: delta > 0 ? B.teal : delta < 0 ? B.bandLimited : "#F4F1EA", lineHeight: 1 }}>{sim.overall_score}<span style={{ fontSize: 14, fontWeight: 400, color: "rgba(244,241,234,0.30)" }}>/100</span></div>
            <div style={{ fontSize: 12, color: bandColor(sim.band), fontWeight: 600, marginTop: 6 }}>{sim.band}</div>
          </div>
          <div style={{ flex: 1, background: "rgba(244,241,234,0.04)", padding: "28px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.30)", marginBottom: 8 }}>IMPACT</div>
            <div style={{ fontSize: 36, fontWeight: 600, color: delta > 0 ? B.teal : delta < 0 ? B.bandLimited : "rgba(244,241,234,0.25)", lineHeight: 1 }}>{delta > 0 ? `+${delta}` : delta === 0 ? "—" : String(delta)}</div>
            <div style={{ fontSize: 12, color: "rgba(244,241,234,0.35)", marginTop: 6 }}>{runway} days runway</div>
          </div>
        </div>

        {/* ── MODE TOGGLE ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {(["presets", "advanced"] as const).map((mode) => (
            <button key={mode} onClick={() => { setSimMode(mode); if (mode === "presets") setSliders({ recurrence: baseInputs.income_persistence_pct, topClient: baseInputs.largest_source_pct, sources: baseInputs.source_diversity_count, monthsBooked: Math.round(baseInputs.forward_secured_pct / 100 * 6 * 2) / 2, passive: 100 - baseInputs.labor_dependence_pct }); else setSimPreset(null); }} style={{ flex: 1, padding: "12px 16px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: `1px solid ${simMode === mode ? B.teal : "rgba(244,241,234,0.10)"}`, backgroundColor: simMode === mode ? "rgba(26,122,109,0.10)" : "transparent", color: simMode === mode ? B.teal : "rgba(244,241,234,0.45)", cursor: "pointer", transition: "all 150ms" }}>
              {mode === "presets" ? "Quick Scenarios" : "Customize Your Scenario"}
            </button>
          ))}
        </div>

        {/* ── PRESETS ── */}
        {simMode === "presets" && (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              {SIMULATOR_PRESETS.map((preset) => {
                const ia = simPreset === preset.id;
                return (<button key={preset.id} onClick={() => setSimPreset(ia ? null : preset.id)} style={{ padding: "10px 18px", fontSize: 12, fontWeight: 600, borderRadius: 6, border: `1px solid ${ia ? B.purple : "rgba(244,241,234,0.10)"}`, cursor: "pointer", backgroundColor: ia ? "rgba(75,63,174,0.15)" : "transparent", color: ia ? "#F4F1EA" : "rgba(244,241,234,0.45)", transition: "all 150ms" }}>{preset.label}</button>);
              })}
            </div>
            {simPreset && (() => { const ap = SIMULATOR_PRESETS.find(p => p.id === simPreset)!; return (
              <div style={{ backgroundColor: "rgba(75,63,174,0.08)", border: "1px solid rgba(75,63,174,0.15)", borderRadius: 8, padding: "16px 20px", marginBottom: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#F4F1EA", marginBottom: 4 }}>{ap.label}</div>
                <p style={{ fontSize: 13, color: "rgba(244,241,234,0.50)", margin: 0 }}>{ap.description}</p>
                {delta !== 0 && (<p style={{ fontSize: 13, color: delta > 0 ? B.teal : B.bandLimited, margin: "8px 0 0", fontWeight: 600 }}>{delta > 0 ? `+${delta} points${sim.band !== base.band ? ` — moves to ${sim.band}` : ""}` : `${delta} points${sim.band !== base.band ? ` — drops to ${sim.band}` : ""}`}</p>)}
              </div>
            ); })()}
          </>
        )}

        {/* ── ADVANCED SLIDERS ── */}
        {simMode === "advanced" && sliders && (
          <div style={{ display: "flex", gap: 32 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 20 }}>Adjust Your Income Structure</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.20)", marginBottom: 12 }}>INCOME STRUCTURE</div>
              <Slider label="Recurring revenue" value={sl.recurrence} min={0} max={100} step={5} unit="%" onChange={(v) => setSliders({ ...sl, recurrence: v })} />
              <Slider label="Top client share" value={sl.topClient} min={sl.sources <= 1 ? 100 : 10} max={100} step={5} unit="%" onChange={(v) => setSliders({ ...sl, topClient: v })} />
              <Slider label="Income sources" value={sl.sources} min={1} max={8} step={1} unit="" onChange={(v) => setSliders({ ...sl, sources: v, topClient: v <= 1 ? 100 : Math.min(sl.topClient, 100) })} />
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.20)", marginTop: 8, marginBottom: 12 }}>PREDICTABILITY</div>
              <Slider label="Months booked ahead" value={sl.monthsBooked} min={0} max={6} step={0.5} unit=" mo" onChange={(v) => setSliders({ ...sl, monthsBooked: v })} />
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.20)", marginTop: 8, marginBottom: 12 }}>RESILIENCE</div>
              <Slider label="Passive income" value={sl.passive} min={0} max={100} step={5} unit="%" onChange={(v) => setSliders({ ...sl, passive: v })} />
              <button onClick={() => setSliders({ recurrence: baseInputs.income_persistence_pct, topClient: baseInputs.largest_source_pct, sources: baseInputs.source_diversity_count, monthsBooked: Math.round(baseInputs.forward_secured_pct / 100 * 6 * 2) / 2, passive: 100 - baseInputs.labor_dependence_pct })} style={{ fontSize: 11, color: "rgba(244,241,234,0.30)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0, marginTop: 8 }}>Reset to current</button>
            </div>
            <div style={{ flex: 1 }}>
              {insights.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.purple, marginBottom: 12 }}>WHAT CHANGED</div>
                  {insights.map((ins, i) => (<div key={i} style={{ fontSize: 13, color: "#F4F1EA", fontWeight: 500, marginBottom: 8, padding: "10px 14px", backgroundColor: "rgba(75,63,174,0.08)", borderRadius: 6 }}>{ins}</div>))}
                </div>
              )}
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.25)", marginBottom: 12 }}>STRESS TESTS ON SIMULATED STATE</div>
              {[
                { label: "Lose top client", value: `${sim.overall_score}/100 → ${stLC.overall_score}/100`, color: B.bandLimited },
                { label: "Unable to work 90 days", value: `${sim.overall_score}/100 → ${stNW.overall_score}/100`, color: B.bandLimited },
                { label: "Income runway", value: `${runway} days`, color: runway < 30 ? B.bandLimited : runway < 90 ? B.bandDeveloping : B.teal },
                { label: "Fragility", value: sim.fragility_class, color: sim.fragility_class === "brittle" || sim.fragility_class === "thin" ? B.bandLimited : B.teal },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", backgroundColor: "rgba(244,241,234,0.03)", border: "1px solid rgba(244,241,234,0.06)", borderRadius: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "rgba(244,241,234,0.55)" }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PATH TO +10 ── */}
        {pathSteps.length > 0 && (
          <div style={{ background: "rgba(26,122,109,0.06)", border: "1px solid rgba(26,122,109,0.12)", borderLeft: `3px solid ${B.teal}`, borderRadius: 8, padding: "20px 24px", marginTop: 32 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 10 }}>PATH TO {base.overall_score + 10}/100</div>
            <p style={{ fontSize: 13, color: "rgba(244,241,234,0.45)", marginBottom: 12 }}>The most efficient changes to gain 10 points:</p>
            {pathSteps.map((step, i) => (<div key={i} style={{ fontSize: 13, color: "#F4F1EA", fontWeight: 500, marginBottom: 6 }}>{i + 1}. {step}</div>))}
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: "1px solid rgba(244,241,234,0.06)", padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "rgba(244,241,234,0.25)" }}>Income Stability Score&#8482; &middot; Model RP-2.0</span>
        <a href="/pricing" style={{ fontSize: 13, fontWeight: 600, color: B.teal, textDecoration: "none" }}>Get your score &#8594;</a>
      </div>
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0E1A2B", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ fontSize: 14, color: "rgba(244,241,234,0.35)" }}>Loading simulator...</p></div>}>
      <SimulatorContent />
    </Suspense>
  );
}
