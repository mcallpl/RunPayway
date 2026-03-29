"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { simulateScore, SIMULATOR_PRESETS } from "@/lib/engine/v2/simulate";
import SuiteHeader from "@/components/SuiteHeader";
import SuiteCTA from "@/components/SuiteCTA";
import { earnBadge } from "@/lib/gamification";
import type { CanonicalInput } from "@/lib/engine/v2/types";

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */
const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F7F6F3",
  bone: "#F8F6F1",
  white: "#FFFFFF",
  stone: "rgba(14,26,43,0.12)",
  taupe: "rgba(14,26,43,0.42)",
  muted: "rgba(14,26,43,0.58)",
  red: "#DC4A4A",
  yellow: "#D4A017",
  bandLimited: "#9B2C2C",
  bandDeveloping: "#92640A",
  bandEstablished: "#2B5EA7",
  bandHigh: "#1F6D7A",
};

const INTER = "'Inter', system-ui, -apple-system, sans-serif";

/* ------------------------------------------------------------------ */
/*  Zone card type                                                     */
/* ------------------------------------------------------------------ */
interface ZoneData {
  zone: "red" | "yellow" | "green";
  color: string;
  label: string;
  headline: string;
  description: string;
  recommendation: string;
  example: string;
  scoreLift: number;
  projectedScore: number;
  presetId: string | null;
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */
export default function PressureMapPage() {
  const router = useRouter();
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [expandedZone, setExpandedZone] = useState<"red" | "yellow" | "green" | null>(null);
  const [badgeEarned, setBadgeEarned] = useState(false);
  const [mobile, setMobile] = useState(false);

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
        if (parsed && parsed.record_id) setRecord(parsed);
      } catch { /* ignore */ }
    }
  }, []);

  // Show full UI even without data — just empty/sample state
  const hasData = !!record;

  // ── Extract data from record (or defaults) ──
  const score = (record?.final_score as number) || 0;
  const band = (record?.stability_band as string) || "";
  const v2 = record?._v2 as Record<string, unknown> | undefined;
  const ni = v2?.normalized_inputs as Record<string, number | string> | undefined;
  const pressureMap = record?.pressure_map as { pressure: string; tailwind: string; leverage_move: string; operating_structure: string; income_model: string; industry: string } | undefined;
  const constraints = v2?.constraints as { root_constraint: string; primary_constraint: string; secondary_constraint: string } | undefined;
  const sensitivity = v2?.sensitivity as { tests: Array<{ factor: string; lift: number; projected_score: number; delta_description: string }> } | undefined;

  const industry = ((record?.industry_sector as string) || "").replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  const structure = (record?.operating_structure as string) || "";
  const incomeModel = (record?.primary_income_model as string) || "";

  // ── Build canonical inputs for simulation ──
  const baseInputs: CanonicalInput | null = ni ? {
    income_persistence_pct: ni.income_persistence_pct as number,
    largest_source_pct: ni.largest_source_pct as number,
    source_diversity_count: ni.source_diversity_count as number,
    forward_secured_pct: ni.forward_secured_pct as number,
    income_variability_level: (ni.income_variability_level || "moderate") as CanonicalInput["income_variability_level"],
    labor_dependence_pct: ni.labor_dependence_pct as number,
  } : null;

  // ── Calculate lifts for each zone ──
  const getPresetLift = (presetId: string): { lift: number; projected: number } => {
    if (!baseInputs) return { lift: 0, projected: score };
    const qualityScore = ((v2?.quality as Record<string, number>)?.quality_score) ?? 5;
    const preset = SIMULATOR_PRESETS.find(p => p.id === presetId);
    if (!preset) return { lift: 0, projected: score };
    const result = simulateScore(preset.modify(baseInputs), qualityScore);
    return { lift: Math.max(0, result.overall_score - score), projected: result.overall_score };
  };

  // ── Determine primary constraint to map to red zone ──
  const rootConstraint = constraints?.root_constraint || "weak_forward_visibility";
  const constraintToPreset: Record<string, string> = {
    high_concentration: "add_client",
    weak_forward_visibility: "lock_forward",
    high_labor_dependence: "build_passive",
    low_persistence: "convert_retainer",
    low_source_diversity: "add_client",
    high_variability: "convert_retainer",
  };

  const constraintLabels: Record<string, string> = {
    high_concentration: "Too much income from one source",
    weak_forward_visibility: "Not enough income secured ahead of time",
    high_labor_dependence: "Income stops when you stop working",
    low_persistence: "Not enough recurring or repeating income",
    low_source_diversity: "Too few independent income sources",
    high_variability: "Income swings too much month to month",
  };

  const secondaryConstraint = constraints?.secondary_constraint || (rootConstraint === "weak_forward_visibility" ? "high_labor_dependence" : "weak_forward_visibility");

  // ── Build the 3 zone cards ──
  const redPresetId = constraintToPreset[rootConstraint] || "convert_retainer";
  const redLift = getPresetLift(redPresetId);

  const yellowPresetId = constraintToPreset[secondaryConstraint] || "lock_forward";
  const yellowLift = getPresetLift(yellowPresetId);

  const greenPresetId = rootConstraint === "high_labor_dependence" ? "lock_forward" : "build_passive";
  const greenLift = getPresetLift(greenPresetId);

  const zones: ZoneData[] = [
    {
      zone: "red",
      color: B.red,
      label: "RED ZONE",
      headline: constraintLabels[rootConstraint] || "Primary structural vulnerability",
      description: pressureMap?.pressure || "This is the area where your income is most exposed to disruption.",
      recommendation: pressureMap?.leverage_move || sensitivity?.tests?.[0]?.delta_description || "Address your primary structural weakness to see the biggest score improvement.",
      example: SIMULATOR_PRESETS.find(p => p.id === redPresetId)?.description || "",
      scoreLift: redLift.lift,
      projectedScore: redLift.projected,
      presetId: redPresetId,
    },
    {
      zone: "yellow",
      color: B.yellow,
      label: "YELLOW ZONE",
      headline: constraintLabels[secondaryConstraint] || "Secondary risk area",
      description: `This is a moderate risk that amplifies the damage of your primary vulnerability. Addressing it builds a second layer of protection.`,
      recommendation: sensitivity?.tests?.[1]?.delta_description || "Strengthen your secondary structural factor to reduce compounding risk.",
      example: SIMULATOR_PRESETS.find(p => p.id === yellowPresetId)?.description || "",
      scoreLift: yellowLift.lift,
      projectedScore: yellowLift.projected,
      presetId: yellowPresetId,
    },
    {
      zone: "green",
      color: B.teal,
      label: "GREEN ZONE",
      headline: pressureMap?.tailwind ? "What is already working in your favor" : "Building long-term resilience",
      description: pressureMap?.tailwind || "These are the areas where your income is most protected. The goal is to expand this zone.",
      recommendation: "Continue building passive and recurring income streams to lock in long-term stability.",
      example: SIMULATOR_PRESETS.find(p => p.id === greenPresetId)?.description || "",
      scoreLift: greenLift.lift,
      projectedScore: greenLift.projected,
      presetId: greenPresetId,
    },
  ];

  const bandColor = score >= 75 ? B.bandHigh : score >= 50 ? B.bandEstablished : score >= 30 ? B.bandDeveloping : B.bandLimited;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: B.white, fontFamily: INTER }}>
      <style>{`@keyframes zoneExpand { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <SuiteHeader current="pressuremap" />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: mobile ? "28px 16px 80px" : "48px 28px 80px" }}>

        {/* ── Hero ── */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: B.purple, marginBottom: 12 }}>RUNPAYWAY&#8482; STABILITY SUITE &mdash; PRESSUREMAP&#8482;</div>
          <h1 style={{ fontSize: mobile ? 24 : 32, fontWeight: 700, color: B.navy, marginBottom: 8, lineHeight: 1.2 }}>
            Where Your Income Is Vulnerable &mdash; And What To Do About It
          </h1>
          <p style={{ fontSize: 15, color: B.muted, maxWidth: 540, margin: "0 auto 20px", lineHeight: 1.65 }}>
            Your income scored <span style={{ fontWeight: 700, color: bandColor }}>{score}/100</span> ({band}).
            {industry ? ` As a ${structure.toLowerCase()} in ${industry}, ` : " "}
            tap each zone below to see your specific risks and the exact action to take.
          </p>

          {/* Zone indicator bar */}
          <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", maxWidth: 400, margin: "0 auto" }}>
            <div style={{ flex: 1, backgroundColor: B.red }} />
            <div style={{ flex: 1, backgroundColor: B.yellow }} />
            <div style={{ flex: 1, backgroundColor: B.teal }} />
          </div>
        </div>

        {/* ── 3 ACTION CARDS ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {zones.map((z) => {
            const isExpanded = expandedZone === z.zone;
            return (
              <div
                key={z.zone}
                onClick={() => {
                  setExpandedZone(isExpanded ? null : z.zone);
                  if (!isExpanded && !badgeEarned) {
                    earnBadge("pressuremap_viewer");
                    setBadgeEarned(true);
                  }
                }}
                style={{
                  borderRadius: 14,
                  border: `1px solid ${isExpanded ? z.color + "44" : "rgba(14,26,43,0.08)"}`,
                  borderLeft: `4px solid ${z.color}`,
                  backgroundColor: isExpanded ? `${z.color}08` : B.white,
                  padding: mobile ? "20px 16px" : "24px 28px",
                  cursor: "pointer",
                  transition: "all 250ms ease",
                  boxShadow: isExpanded ? `0 4px 20px ${z.color}15` : "none",
                }}
              >
                {/* Card header — always visible */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: z.color }} />
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: z.color }}>{z.label}</span>
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 600, color: B.navy, marginBottom: 6, lineHeight: 1.35 }}>{z.headline}</div>
                    <p style={{ fontSize: 13, color: B.muted, margin: 0, lineHeight: 1.55 }}>
                      {z.description.length > 120 && !isExpanded ? z.description.substring(0, 120) + "..." : z.description}
                    </p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                    {z.scoreLift > 0 && (
                      <div style={{ fontSize: 20, fontWeight: 700, color: B.teal, lineHeight: 1 }}>+{z.scoreLift}</div>
                    )}
                    <div style={{ fontSize: 11, color: B.muted, marginTop: 2 }}>points</div>
                    <div style={{ fontSize: 18, color: B.navy, marginTop: 8, transition: "transform 200ms", transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}>&darr;</div>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${z.color}22`, animation: "zoneExpand 300ms ease-out" }}>
                    {/* Recommendation */}
                    <div style={{ backgroundColor: `${z.color}0A`, borderRadius: 8, padding: "14px 18px", marginBottom: 14 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: z.color, marginBottom: 6 }}>RECOMMENDED ACTION</div>
                      <p style={{ fontSize: 14, color: B.navy, margin: 0, lineHeight: 1.6, fontWeight: 500 }}>{z.recommendation}</p>
                    </div>

                    {/* Example */}
                    {z.example && (
                      <div style={{ marginBottom: 14 }}>
                        <span style={{ fontSize: 12, color: B.muted, fontWeight: 600 }}>How: </span>
                        <span style={{ fontSize: 13, color: B.navy, lineHeight: 1.55 }}>{z.example}</span>
                      </div>
                    )}

                    {/* Impact preview */}
                    {z.scoreLift > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                          <span style={{ fontSize: 22, fontWeight: 700, color: B.navy }}>{score}</span>
                          <span style={{ fontSize: 14, color: B.taupe }}>&rarr;</span>
                          <span style={{ fontSize: 22, fontWeight: 700, color: B.teal }}>{z.projectedScore}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: B.teal, marginLeft: 4 }}>+{z.scoreLift}</span>
                        </div>
                        <div style={{ flex: 1, height: 8, backgroundColor: B.stone, borderRadius: 4, overflow: "hidden", position: "relative" }}>
                          {/* Base score (static) */}
                          <div style={{ position: "absolute", height: "100%", borderRadius: 4, backgroundColor: `${bandColor}66`, width: `${Math.min(100, score)}%` }} />
                          {/* Projected score (animated) */}
                          <div style={{ position: "absolute", height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${bandColor}, ${B.teal})`, width: `${Math.min(100, z.projectedScore)}%`, transition: "width 600ms cubic-bezier(0.22, 1, 0.36, 1)", boxShadow: `0 0 8px ${B.teal}44` }} />
                        </div>
                      </div>
                    )}

                    {/* CTA: Try in Simulator */}
                    {z.presetId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push("/simulator");
                        }}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 8,
                          padding: "10px 20px", borderRadius: 8,
                          backgroundColor: B.navy, color: B.white,
                          fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
                          transition: "background-color 200ms",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = B.purple; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = B.navy; }}
                      >
                        Try This in the Simulator &rarr;
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Combined impact ── */}
        <div style={{ marginTop: 28, padding: "20px 24px", borderRadius: 12, background: `linear-gradient(135deg, rgba(31,109,122,0.06) 0%, rgba(75,63,174,0.04) 100%)`, border: "1px solid rgba(14,26,43,0.08)" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: B.teal, marginBottom: 8 }}>YOUR GOAL</div>
          <p style={{ fontSize: 15, fontWeight: 600, color: B.navy, margin: "0 0 8px", lineHeight: 1.5 }}>
            Move as much of your income as possible from red zones to green zones.
          </p>
          <p style={{ fontSize: 13, color: B.muted, margin: 0, lineHeight: 1.55 }}>
            With just a few key changes, you can significantly improve your financial stability. Use the <Link href="/simulator" style={{ color: B.purple, fontWeight: 600, textDecoration: "none" }}>Stability Simulator</Link> to model each change and see your score update in real time.
          </p>
        </div>

        {/* ── Next step: Simulator ── */}
        <div
          onClick={() => router.push("/simulator")}
          style={{
            marginTop: 24, borderRadius: 12, overflow: "hidden", cursor: "pointer",
            background: `linear-gradient(135deg, ${B.navy} 0%, #161430 50%, ${B.teal} 100%)`,
            padding: mobile ? "18px 16px" : "20px 24px",
            transition: "box-shadow 250ms ease, transform 250ms ease",
          }}
          onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 8px 28px rgba(31,109,122,0.25)"; el.style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: B.teal, marginBottom: 6 }}>NEXT STEP</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#F4F1EA", marginBottom: 2 }}>Test these changes in the Stability Simulator</div>
              <p style={{ fontSize: 12, color: "rgba(244,241,234,0.50)", margin: 0 }}>Model each scenario and see your score update in real time.</p>
            </div>
            <span style={{ fontSize: 24, color: "#F4F1EA", opacity: 0.7, flexShrink: 0, marginLeft: 16 }}>&rarr;</span>
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{ marginTop: 40, marginBottom: 24 }}><SuiteCTA page="pressuremap" /></div>

        {/* ── Footer ── */}
        <div style={{ paddingTop: 16, borderTop: `1px solid ${B.stone}`, textAlign: "center" }}>
          <p style={{ fontSize: 11, color: B.taupe, margin: 0, lineHeight: 1.5, fontStyle: "italic" }}>
            RunPayway&#8482; Stability Suite &mdash; PressureMap&#8482;. A proprietary tool by PeopleStar Enterprises.
          </p>
        </div>
      </div>
    </div>
  );
}
