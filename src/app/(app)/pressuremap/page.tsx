"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { simulateScore, SIMULATOR_PRESETS } from "@/lib/engine/v2/simulate";
import SuiteHeader from "@/components/SuiteHeader";
import SuiteCTA from "@/components/SuiteCTA";
import AnimatedNumber from "@/components/AnimatedNumber";
import type { CanonicalInput } from "@/lib/engine/v2/types";
import { SAMPLE_PROFILES, IS_SAMPLE } from "@/lib/sample-data";

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */
const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  white: "#FFFFFF",
  stone: "rgba(14,26,43,0.08)",
  taupe: "rgba(14,26,43,0.36)",
  muted: "rgba(14,26,43,0.52)",
  red: "#C53030",
  amber: "#B7791F",
  bandLimited: "#9B2C2C",
  bandDeveloping: "#92640A",
  bandEstablished: "#2B5EA7",
  bandHigh: "#1F6D7A",
};

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */
export default function PressureMapPage() {
  const router = useRouter();
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [activeSegment, setActiveSegment] = useState<"active" | "semi" | "persistent" | null>(null);
  const [mobile, setMobile] = useState(false);
  const [demoProfile, setDemoProfile] = useState(1); // index into SAMPLE_PROFILES

  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    let stored = sessionStorage.getItem("rp_record");
    if (!stored) stored = localStorage.getItem("rp_record");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed) setRecord(parsed);
      } catch { /* ignore */ }
    }
  }, []);

  // ── Use real data or sample profile ──
  const isDemo = IS_SAMPLE(record);
  const r = isDemo ? SAMPLE_PROFILES[demoProfile].record : record!;

  const score = (r.final_score as number) || 0;
  const band = (r.stability_band as string) || "";
  const v2 = r._v2 as Record<string, unknown> | undefined;
  const ni = v2?.normalized_inputs as Record<string, number | string> | undefined;
  const constraints = v2?.constraints as { root_constraint: string; secondary_constraint?: string } | undefined;
  const fragility = v2?.fragility as { fragility_score: number; fragility_class: string; primary_failure_mode: string } | undefined;

  const activeIncome = (r.active_income_level as number) || 65;
  const semiIncome = (r.semi_persistent_income_level as number) || 20;
  const persistentIncome = (r.persistent_income_level as number) || 15;
  const riskDrop = (r.risk_scenario_drop as number) || 0;
  const continuityMonths = (r.income_continuity_months as number) || 0;

  // ── Build canonical inputs for simulation ──
  const baseInputs: CanonicalInput = ni ? {
    income_persistence_pct: ni.income_persistence_pct as number,
    largest_source_pct: ni.largest_source_pct as number,
    source_diversity_count: ni.source_diversity_count as number,
    forward_secured_pct: ni.forward_secured_pct as number,
    income_variability_level: (ni.income_variability_level || "moderate") as CanonicalInput["income_variability_level"],
    labor_dependence_pct: ni.labor_dependence_pct as number,
  } : { income_persistence_pct: 25, largest_source_pct: 60, source_diversity_count: 2, forward_secured_pct: 15, income_variability_level: "moderate" as const, labor_dependence_pct: 70 };

  const qualityScore = ((v2?.quality as Record<string, number>)?.quality_score) ?? 5;
  const baseResult = simulateScore(baseInputs, qualityScore);
  const displayScore = score > 0 ? score : baseResult.overall_score;

  // ── Compute projected scores for each zone fix ──
  const getPresetResult = (presetId: string) => {
    const preset = SIMULATOR_PRESETS.find(p => p.id === presetId);
    if (!preset) return { score: displayScore, lift: 0 };
    const result = simulateScore(preset.modify(baseInputs), qualityScore);
    return { score: result.overall_score, lift: Math.max(0, result.overall_score - displayScore) };
  };

  // ── Zone data — driven by real assessment data ──
  const rootConstraint = constraints?.root_constraint || "weak_forward_visibility";
  const constraintPreset: Record<string, string> = {
    high_concentration: "add_client",
    weak_forward_visibility: "lock_forward",
    high_labor_dependence: "build_passive",
    low_persistence: "convert_retainer",
    low_source_diversity: "add_client",
    high_variability: "convert_retainer",
  };

  const redPreset = constraintPreset[rootConstraint] || "convert_retainer";
  const redResult = getPresetResult(redPreset);

  const greenPreset = rootConstraint === "high_labor_dependence" ? "lock_forward" : "build_passive";
  const greenResult = getPresetResult(greenPreset);

  // ── Segment data ──
  const segments = [
    {
      id: "active" as const,
      label: "Income That Stops",
      pct: activeIncome,
      color: B.red,
      bgColor: `${B.red}12`,
      description: "Stops the moment you stop working.",
      risk: `${activeIncome}% of your income resets to zero the moment you stop. A single disruption — illness, burnout, lost client — immediately affects ${activeIncome}% of your earnings.`,
      action: SIMULATOR_PRESETS.find(p => p.id === redPreset)?.label || "Reduce active income dependency",
      actionDetail: SIMULATOR_PRESETS.find(p => p.id === redPreset)?.description || "",
      lift: redResult.lift,
      projected: redResult.score,
      presetId: redPreset,
    },
    {
      id: "semi" as const,
      label: "Recurring For Now",
      pct: semiIncome,
      color: B.amber,
      bgColor: `${B.amber}10`,
      description: "Repeats for now — retainers, subscriptions, short contracts.",
      risk: semiIncome < 20
        ? `Only ${semiIncome}% of your income has any repeating structure. Most of your revenue must be re-earned every month.`
        : `${semiIncome}% of your income repeats, but it is cancelable. This provides a buffer, not a foundation.`,
      action: "Convert recurring-for-now income to fully recurring",
      actionDetail: "Extend contract lengths, add auto-renewal clauses, convert monthly retainers to quarterly or annual agreements.",
      lift: 0,
      projected: displayScore,
      presetId: null,
    },
    {
      id: "persistent" as const,
      label: "Protected Income",
      pct: persistentIncome,
      color: B.teal,
      bgColor: `${B.teal}10`,
      description: "Keeps going without you — royalties, licensing, passive revenue.",
      risk: persistentIncome >= 30
        ? `${persistentIncome}% of your income keeps going without you. This is structural protection that most professionals do not have.`
        : `Only ${persistentIncome}% of your income would continue if you stopped working. Building this zone is the single most durable improvement you can make.`,
      action: greenResult.lift > 0 ? (SIMULATOR_PRESETS.find(p => p.id === greenPreset)?.label || "Build protected income") : "Build protected income streams",
      actionDetail: SIMULATOR_PRESETS.find(p => p.id === greenPreset)?.description || "Create income that keeps going without you.",
      lift: greenResult.lift,
      projected: greenResult.score,
      presetId: greenPreset,
    },
  ];

  const bandColor = displayScore >= 75 ? B.bandHigh : displayScore >= 50 ? B.bandEstablished : displayScore >= 30 ? B.bandDeveloping : B.bandLimited;
  const previewScore = activeSegment ? segments.find(s => s.id === activeSegment)?.projected || displayScore : displayScore;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAFA", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SuiteHeader current="pressuremap" />
      <style>{`@keyframes segmentExpand { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 500px; } }`}</style>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: mobile ? "28px 16px 60px" : "48px 28px 80px" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", color: B.taupe, textTransform: "uppercase" as const, marginBottom: 8 }}>RUNPAYWAY&#8482; PRESSUREMAP&#8482;</div>
          <h1 style={{ fontSize: mobile ? 24 : 32, fontWeight: 300, color: B.navy, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 8 }}>Your Income Structure</h1>
          <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.6, maxWidth: 520, margin: 0 }}>
            {isDemo
              ? "Explore how the PressureMap works with sample data. Select a stability band below to see different income structures."
              : "This is how your income actually works — where it comes from, what repeats, and what disappears the moment you stop. Click each zone to see the risk and the fix."}
          </p>

          {/* ── Demo band selector ── */}
          {isDemo && (
            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" as const }}>
              {SAMPLE_PROFILES.map((p, i) => (
                <button key={p.id} onClick={() => { setDemoProfile(i); setActiveSegment(null); }}
                  style={{
                    padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: demoProfile === i ? 600 : 400,
                    color: demoProfile === i ? B.white : B.muted,
                    backgroundColor: demoProfile === i ? (p.id === "limited" ? B.red : p.id === "developing" ? B.amber : p.id === "established" ? B.bandEstablished : B.teal) : "transparent",
                    border: `1px solid ${demoProfile === i ? "transparent" : B.stone}`,
                    cursor: "pointer", transition: "all 200ms",
                  }}
                >{p.bandShort}</button>
              ))}
            </div>
          )}
        </div>

        {/* ── Sample data banner ── */}
        {isDemo && (
          <div style={{ padding: "10px 16px", borderRadius: 6, backgroundColor: `${B.purple}06`, border: `1px solid ${B.purple}15`, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: B.purple }}>SAMPLE DATA — Enter your access code on the <a href="/tools" style={{ color: B.purple, fontWeight: 600, textDecoration: "none" }}>Suite page</a> to see your real numbers</span>
          </div>
        )}

        {/* ── SCORE GAUGE — animates on hover ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 32, padding: "20px 24px", border: `1px solid ${B.stone}`, borderRadius: 10 }}>
          <div style={{ textAlign: "center", minWidth: 80 }}>
            <div style={{ fontSize: 42, fontWeight: 300, color: B.navy, letterSpacing: "-0.03em", lineHeight: 1, transition: "color 300ms ease" }}>
              <AnimatedNumber value={previewScore} />
            </div>
            <div style={{ fontSize: 10, color: B.taupe, fontWeight: 500, marginTop: 4 }}>
              {activeSegment ? "PROJECTED" : "CURRENT"}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: bandColor }}>{band || baseResult.band}</span>
              {activeSegment && segments.find(s => s.id === activeSegment)?.lift ? (
                <span style={{ fontSize: 12, fontWeight: 600, color: B.teal }}>+{segments.find(s => s.id === activeSegment)?.lift} points</span>
              ) : null}
            </div>
            <div style={{ height: 6, backgroundColor: B.stone, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 3, backgroundColor: bandColor, width: `${Math.min(100, previewScore)}%`, transition: "width 500ms cubic-bezier(0.22, 1, 0.36, 1)" }} />
            </div>
          </div>
        </div>

        {/* ══════════ INCOME STRUCTURE BAR — THE MAP ══════════ */}
        <div style={{ marginBottom: 12, fontSize: 11, fontWeight: 600, color: B.taupe, letterSpacing: "0.10em", textTransform: "uppercase" as const }}>YOUR INCOME MAP</div>
        <div style={{ display: "flex", height: mobile ? 48 : 56, borderRadius: 8, overflow: "hidden", marginBottom: 8, cursor: "pointer", border: `1px solid ${B.stone}` }}>
          {segments.map((seg) => {
            if (seg.pct <= 0) return null;
            const isActive = activeSegment === seg.id;
            return (
              <div
                key={seg.id}
                onClick={() => setActiveSegment(isActive ? null : seg.id)}
                onMouseEnter={() => !mobile && setActiveSegment(seg.id)}
                onMouseLeave={() => !mobile && setActiveSegment(null)}
                style={{
                  width: `${seg.pct}%`,
                  backgroundColor: isActive ? seg.color : `${seg.color}22`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background-color 300ms ease, transform 100ms ease",
                  transform: isActive ? "scaleY(1.08)" : "scaleY(1)",
                  position: "relative",
                }}
              >
                <span style={{ fontSize: seg.pct < 15 ? 10 : 13, fontWeight: 600, color: isActive ? "#FFFFFF" : seg.color, transition: "color 300ms ease" }}>
                  {seg.pct}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: mobile ? 12 : 20, marginBottom: 32, flexWrap: "wrap" as const }}>
          {segments.map((seg) => (
            <div key={seg.id} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }} onClick={() => setActiveSegment(activeSegment === seg.id ? null : seg.id)}>
              <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: seg.color }} />
              <span style={{ fontSize: 12, color: activeSegment === seg.id ? B.navy : B.muted, fontWeight: activeSegment === seg.id ? 600 : 400, transition: "all 200ms" }}>{seg.label}</span>
            </div>
          ))}
        </div>

        {/* ══════════ ZONE DETAIL PANELS ══════════ */}
        {segments.map((seg) => {
          const isOpen = activeSegment === seg.id;
          if (!isOpen) return null;
          return (
            <div key={seg.id} style={{ marginBottom: 24, border: `1px solid ${seg.color}25`, borderLeft: `3px solid ${seg.color}`, borderRadius: 10, padding: mobile ? "20px 16px" : "24px 28px", backgroundColor: B.white, animation: "segmentExpand 300ms ease-out" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: seg.color, textTransform: "uppercase" as const, marginBottom: 4 }}>{seg.label} — {seg.pct}%</div>
                  <div style={{ fontSize: 13, color: B.muted }}>{seg.description}</div>
                </div>
                <button onClick={() => setActiveSegment(null)} style={{ background: "none", border: "none", fontSize: 18, color: B.taupe, cursor: "pointer", padding: "0 4px" }}>&times;</button>
              </div>

              {/* Risk */}
              <div style={{ padding: "14px 16px", borderRadius: 8, backgroundColor: `${seg.color}06`, marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.10em", color: seg.color, marginBottom: 6 }}>WHAT THIS MEANS</div>
                <p style={{ fontSize: 13, color: B.navy, margin: 0, lineHeight: 1.65 }}>{seg.risk}</p>
              </div>

              {/* Action */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.10em", color: B.teal, marginBottom: 6 }}>THE FIX</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: B.navy, marginBottom: 4 }}>{seg.action}</div>
                <p style={{ fontSize: 12, color: B.muted, margin: 0, lineHeight: 1.55 }}>{seg.actionDetail}</p>
              </div>

              {/* Before/After */}
              {seg.lift > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 8, border: `1px solid ${B.stone}`, marginBottom: 14 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: B.taupe }}>Now</div>
                    <div style={{ fontSize: 22, fontWeight: 300, color: B.navy }}>{displayScore}</div>
                  </div>
                  <div style={{ fontSize: 16, color: B.taupe }}>&rarr;</div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: B.teal }}>After</div>
                    <div style={{ fontSize: 22, fontWeight: 300, color: B.teal }}>{seg.projected}</div>
                  </div>
                  <div style={{ flex: 1, marginLeft: 8 }}>
                    <div style={{ height: 6, backgroundColor: B.stone, borderRadius: 3, overflow: "hidden", position: "relative" }}>
                      <div style={{ position: "absolute", height: "100%", borderRadius: 3, backgroundColor: `${bandColor}44`, width: `${displayScore}%` }} />
                      <div style={{ position: "absolute", height: "100%", borderRadius: 3, backgroundColor: B.teal, width: `${seg.projected}%`, transition: "width 600ms cubic-bezier(0.22, 1, 0.36, 1)" }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: B.teal }}>+{seg.lift}</span>
                </div>
              )}

              {/* Simulator CTA */}
              {seg.presetId && (
                <button onClick={() => router.push("/simulator")} style={{ fontSize: 13, fontWeight: 600, color: B.purple, background: "none", border: `1px solid ${B.purple}22`, borderRadius: 6, padding: "8px 16px", cursor: "pointer", transition: "all 200ms" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = `${B.purple}08`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                >
                  Model this change in the Simulator &rarr;
                </button>
              )}
            </div>
          );
        })}

        {/* ── Key metrics ── */}
        {score > 0 && (
          <div style={{ display: "flex", gap: 12, marginBottom: 32, flexDirection: mobile ? "column" : "row" }}>
            {[
              { label: "If top source leaves", value: `−${riskDrop} pts`, color: B.red },
              { label: "Income runway", value: continuityMonths < 1 ? "< 1 month" : `${continuityMonths} months`, color: continuityMonths < 3 ? B.amber : B.teal },
              { label: "Fragility", value: fragility?.fragility_class ? fragility.fragility_class.charAt(0).toUpperCase() + fragility.fragility_class.slice(1) : "—", color: fragility?.fragility_class === "brittle" || fragility?.fragility_class === "thin" ? B.red : B.teal },
            ].map((m) => (
              <div key={m.label} style={{ flex: 1, padding: "14px 18px", border: `1px solid ${B.stone}`, borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: B.taupe, fontWeight: 500, marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 18, fontWeight: 300, color: m.color, letterSpacing: "-0.02em" }}>{m.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── Next step ── */}
        <div onClick={() => router.push("/simulator")} style={{ padding: "16px 20px", borderRadius: 8, border: `1px solid ${B.stone}`, borderLeft: `3px solid ${B.teal}`, cursor: "pointer", marginBottom: 32, transition: "box-shadow 200ms" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(31,109,122,0.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", color: B.teal, textTransform: "uppercase" as const, marginBottom: 3 }}>NEXT STEP</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: B.navy }}>Test these changes in the Stability Simulator</div>
            </div>
            <span style={{ fontSize: 18, color: B.teal }}>&rarr;</span>
          </div>
        </div>

        {/* ── CTA ── */}
        <SuiteCTA page="pressuremap" />

        {/* ── Footer ── */}
        <div style={{ marginTop: 32, paddingTop: 16, borderTop: `1px solid ${B.stone}`, textAlign: "center" }}>
          <p style={{ fontSize: 10, color: B.taupe, margin: 0, fontStyle: "italic" }}>RunPayway&#8482; Stability Suite &mdash; PressureMap&#8482;. A proprietary tool by PeopleStar Enterprises.</p>
        </div>
      </div>
    </div>
  );
}
