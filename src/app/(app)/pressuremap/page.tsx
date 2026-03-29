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
  bg: "#FAFAFA",
  border: "rgba(14,26,43,0.08)",
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
/*  Typography helpers                                                  */
/* ------------------------------------------------------------------ */
const LABEL: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const BODY: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 400,
  lineHeight: 1.65,
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
  const bandLabel = band || baseResult.band;

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <div style={{ minHeight: "100vh", backgroundColor: B.bg, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SuiteHeader current="pressuremap" />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: mobile ? "28px 16px 60px" : "48px 28px 80px" }}>

        {/* ══════════ 1. HEADER ══════════ */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ ...LABEL, color: B.taupe, marginBottom: 8, letterSpacing: "0.14em" }}>
            RUNPAYWAY&#8482; PRESSUREMAP&#8482;
          </div>
          <h1 style={{ fontSize: mobile ? 26 : 34, fontWeight: 300, color: B.navy, letterSpacing: "-0.03em", lineHeight: 1.1, margin: "0 0 8px" }}>
            Your Income X-Ray
          </h1>
          <p style={{ ...BODY, color: B.muted, maxWidth: 540, margin: 0, fontSize: 14, lineHeight: 1.6 }}>
            {isDemo
              ? "Explore how the PressureMap works with sample data. Select a stability band below to see different income structures."
              : "A diagnostic of your income architecture \u2014 where it comes from, what would survive a disruption, and what vanishes the moment you stop."}
          </p>

          {/* Demo band selector */}
          {isDemo && (
            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              {SAMPLE_PROFILES.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => { setDemoProfile(i); setActiveSegment(null); }}
                  style={{
                    padding: "6px 14px", borderRadius: 6, fontSize: 12,
                    fontWeight: demoProfile === i ? 600 : 400,
                    color: demoProfile === i ? B.white : B.muted,
                    backgroundColor: demoProfile === i
                      ? (p.id === "limited" ? B.red : p.id === "developing" ? B.amber : p.id === "established" ? B.bandEstablished : B.teal)
                      : "transparent",
                    border: `1px solid ${demoProfile === i ? "transparent" : B.border}`,
                    cursor: "pointer", transition: "all 200ms",
                  }}
                >{p.bandShort}</button>
              ))}
            </div>
          )}
        </div>

        {/* Sample data banner */}
        {isDemo && (
          <div style={{
            padding: "10px 16px", borderRadius: 6,
            backgroundColor: `${B.purple}06`, border: `1px solid ${B.purple}15`,
            marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: B.purple }}>
              SAMPLE DATA &mdash; Enter your access code on the{" "}
              <Link href="/tools" style={{ color: B.purple, fontWeight: 600, textDecoration: "none" }}>Suite page</Link>
              {" "}to see your real numbers
            </span>
          </div>
        )}

        {/* ══════════ 2. SCORE + INCOME BAR (one card) ══════════ */}
        <div style={{
          border: `1px solid ${B.border}`, borderRadius: 10,
          backgroundColor: B.white, padding: mobile ? "20px 16px" : "24px 28px",
          marginBottom: 28,
        }}>
          <div style={{
            display: "flex",
            flexDirection: mobile ? "column" : "row",
            gap: mobile ? 24 : 32,
            alignItems: mobile ? "stretch" : "center",
          }}>

            {/* LEFT: Score + band */}
            <div style={{ minWidth: mobile ? "auto" : 160, flexShrink: 0 }}>
              <div style={{ ...LABEL, color: B.taupe, marginBottom: 10 }}>STABILITY SCORE</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 48, fontWeight: 300, color: B.navy, letterSpacing: "-0.03em", lineHeight: 1 }}>
                  <AnimatedNumber value={displayScore} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: bandColor }}>{bandLabel}</span>
              </div>
              {/* Band progress bar */}
              <div style={{ height: 5, backgroundColor: B.border, borderRadius: 3, overflow: "hidden", maxWidth: 160 }}>
                <div style={{
                  height: "100%", borderRadius: 3, backgroundColor: bandColor,
                  width: `${Math.min(100, displayScore)}%`,
                  transition: "width 600ms cubic-bezier(0.22, 1, 0.36, 1)",
                }} />
              </div>
            </div>

            {/* Divider */}
            <div style={{
              width: mobile ? "100%" : 1, height: mobile ? 1 : 64,
              backgroundColor: B.border, flexShrink: 0,
            }} />

            {/* RIGHT: Income bar */}
            <div style={{ flex: 1 }}>
              <div style={{ ...LABEL, color: B.taupe, marginBottom: 10 }}>INCOME COMPOSITION</div>
              {/* Horizontal bar */}
              <div style={{
                display: "flex", height: 32, borderRadius: 6, overflow: "hidden",
                border: `1px solid ${B.border}`,
              }}>
                {segments.map((seg) => {
                  if (seg.pct <= 0) return null;
                  return (
                    <div key={seg.id} style={{
                      width: `${seg.pct}%`,
                      backgroundColor: `${seg.color}20`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderRight: seg.id !== "persistent" ? `1px solid ${B.white}` : "none",
                    }}>
                      {seg.pct >= 10 && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: seg.color }}>{seg.pct}%</span>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Labels below each segment */}
              <div style={{ display: "flex", marginTop: 6 }}>
                {segments.map((seg) => {
                  if (seg.pct <= 0) return null;
                  return (
                    <div key={seg.id} style={{ width: `${seg.pct}%`, paddingRight: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: seg.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 10, fontWeight: 500, color: B.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {seg.pct < 15 ? `${seg.pct}%` : seg.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════ 3. ZONE DETAIL PANELS (always visible) ══════════ */}
        {segments.map((seg) => (
          <div key={seg.id} style={{
            marginBottom: 16,
            border: `1px solid ${B.border}`,
            borderLeft: `3px solid ${seg.color}`,
            borderRadius: 10,
            backgroundColor: B.white,
            padding: mobile ? "18px 16px" : "22px 24px",
          }}>
            {/* Zone header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ ...LABEL, color: seg.color, margin: 0 }}>{seg.label}</span>
                <span style={{ fontSize: 20, fontWeight: 300, color: seg.color }}>{seg.pct}%</span>
              </div>
            </div>

            {/* Risk statement */}
            <p style={{ ...BODY, color: B.navy, margin: "0 0 14px" }}>{seg.risk}</p>

            {/* IF YOU FIX THIS row */}
            {seg.lift > 0 && (
              <div style={{
                display: "flex", alignItems: "center", gap: mobile ? 10 : 16,
                padding: "12px 16px", borderRadius: 6,
                backgroundColor: B.bg, marginBottom: 14,
                flexWrap: mobile ? "wrap" : "nowrap",
              }}>
                <div style={{ ...LABEL, color: B.taupe, margin: 0, flexShrink: 0, fontSize: 9 }}>IF YOU FIX THIS</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 18, fontWeight: 300, color: B.navy }}>{displayScore}</span>
                  <span style={{ fontSize: 13, color: B.taupe }}>&rarr;</span>
                  <span style={{ fontSize: 18, fontWeight: 300, color: B.teal }}>{seg.projected}</span>
                </div>
                {/* Animated projection bar */}
                <div style={{ flex: 1, minWidth: 80 }}>
                  <div style={{ height: 5, backgroundColor: B.border, borderRadius: 3, overflow: "hidden", position: "relative" }}>
                    <div style={{
                      position: "absolute", height: "100%", borderRadius: 3,
                      backgroundColor: `${bandColor}30`, width: `${displayScore}%`,
                    }} />
                    <div style={{
                      position: "absolute", height: "100%", borderRadius: 3,
                      backgroundColor: B.teal,
                      width: `${seg.projected}%`,
                      transition: "width 800ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }} />
                  </div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: B.teal, flexShrink: 0 }}>+{seg.lift} pts</span>
              </div>
            )}

            {/* Action button */}
            {seg.presetId && (
              <button
                onClick={() => router.push("/simulator")}
                style={{
                  ...LABEL, fontSize: 11, letterSpacing: "0.08em",
                  color: B.purple, backgroundColor: "transparent",
                  border: `1px solid ${B.purple}22`, borderRadius: 6,
                  padding: "8px 16px", cursor: "pointer",
                  transition: "background-color 200ms",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = `${B.purple}08`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
              >
                Model in Simulator &rarr;
              </button>
            )}
          </div>
        ))}

        {/* ══════════ 4. KEY RISK METRICS ══════════ */}
        <div style={{
          display: "flex", gap: 12, marginTop: 28, marginBottom: 28,
          flexDirection: mobile ? "column" : "row",
        }}>
          {[
            {
              label: "If top source leaves",
              value: `\u2212${riskDrop} pts`,
              color: B.red,
            },
            {
              label: "Income runway",
              value: continuityMonths < 1 ? "< 1 mo" : `${continuityMonths} mo`,
              color: continuityMonths < 3 ? B.amber : B.teal,
            },
            {
              label: "Fragility",
              value: fragility?.fragility_class
                ? fragility.fragility_class.charAt(0).toUpperCase() + fragility.fragility_class.slice(1)
                : "\u2014",
              color: fragility?.fragility_class === "brittle" || fragility?.fragility_class === "thin" ? B.red : B.teal,
            },
          ].map((m) => (
            <div key={m.label} style={{
              flex: 1, padding: "16px 20px",
              border: `1px solid ${B.border}`, borderRadius: 10,
              backgroundColor: B.white,
            }}>
              <div style={{ ...LABEL, color: B.taupe, marginBottom: 8 }}>{m.label}</div>
              <div style={{ fontSize: 20, fontWeight: 300, color: m.color, letterSpacing: "-0.02em" }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* ══════════ 5. NEXT STEP CTA ══════════ */}
        <div
          onClick={() => router.push("/simulator")}
          style={{
            padding: "16px 20px", borderRadius: 10,
            border: `1px solid ${B.border}`, borderLeft: `3px solid ${B.teal}`,
            backgroundColor: B.white,
            cursor: "pointer", marginBottom: 32,
            transition: "box-shadow 200ms",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(31,109,122,0.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ ...LABEL, color: B.teal, marginBottom: 4, fontSize: 9, letterSpacing: "0.14em" }}>NEXT STEP</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: B.navy }}>Test these changes in the Stability Simulator</div>
            </div>
            <span style={{ fontSize: 20, color: B.teal }}>&rarr;</span>
          </div>
        </div>

        {/* ══════════ 6. SUITE CTA ══════════ */}
        <SuiteCTA page="pressuremap" />

        {/* ══════════ 7. FOOTER ══════════ */}
        <div style={{ marginTop: 32, paddingTop: 16, borderTop: `1px solid ${B.border}`, textAlign: "center" }}>
          <p style={{ fontSize: 10, color: B.taupe, margin: 0, fontStyle: "italic" }}>
            RunPayway&#8482; Stability Suite &mdash; PressureMap&#8482;. A proprietary tool by PeopleStar Enterprises.
          </p>
        </div>
      </div>
    </div>
  );
}
