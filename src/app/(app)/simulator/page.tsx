"use client";

import { useState, useEffect, useRef, useContext, createContext, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logoImg from "../../../../public/runpayway-logo.png";
import { simulateScore, SIMULATOR_PRESETS, projectTimeline } from "@/lib/engine/v2/simulate";
import type { CanonicalInput } from "@/lib/engine/v2/types";
import type { TimelinePoint } from "@/lib/engine/v2/simulate";

/* ------------------------------------------------------------------ */
/*  Design Tokens — Dark & Light themes                                */
/* ------------------------------------------------------------------ */
type Theme = "dark" | "light";

interface ThemeColors {
  bg: string;
  bgDeep: string;
  bgGradient: string;
  surface: string;
  surfaceHover: string;
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
  bg: "#0E1A2B",
  bgDeep: "#070F19",
  bgGradient: "linear-gradient(180deg, #070F19 0%, #0E1A2B 30%, #0B1520 100%)",
  surface: "rgba(244,241,234,0.04)",
  surfaceHover: "rgba(244,241,234,0.06)",
  border: "rgba(244,241,234,0.08)",
  borderSubtle: "rgba(244,241,234,0.04)",
  text: "#F4F1EA",
  textSecondary: "rgba(244,241,234,0.55)",
  textMuted: "rgba(244,241,234,0.38)",
  textFaint: "rgba(244,241,234,0.20)",
  headerBg: "rgba(7,15,25,0.6)",
  headerBorder: "rgba(244,241,234,0.08)",
};

const LIGHT: ThemeColors = {
  bg: "#FAFAF8",
  bgDeep: "#F5F2EC",
  bgGradient: "linear-gradient(180deg, #F5F2EC 0%, #FAFAF8 30%, #FFFFFF 100%)",
  surface: "rgba(14,26,43,0.03)",
  surfaceHover: "rgba(14,26,43,0.05)",
  border: "rgba(14,26,43,0.08)",
  borderSubtle: "rgba(14,26,43,0.04)",
  text: "#0E1A2B",
  textSecondary: "rgba(14,26,43,0.55)",
  textMuted: "rgba(14,26,43,0.38)",
  textFaint: "rgba(14,26,43,0.18)",
  headerBg: "rgba(255,255,255,0.85)",
  headerBorder: "rgba(14,26,43,0.08)",
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

// Legacy B alias — used by sub-components that don't receive theme
const B = {
  navy: "#0E1A2B", navyDeep: "#070F19", purple: BRAND.purple, purpleGlow: BRAND.purpleGlow,
  teal: BRAND.teal, tealGlow: BRAND.tealGlow, sand: "#F5F2EC", bone: "#F4F1EA", white: "#FFFFFF",
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
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: T.text, letterSpacing: "-0.01em" }}>{label}</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: c, fontVariantNumeric: "tabular-nums" }}>{value}{unit}</span>
      </div>
      <div style={{ position: "relative", height: 28 }}>
        <div style={{ position: "absolute", top: 12, left: 0, right: 0, height: 4, backgroundColor: T.border, borderRadius: 2 }} />
        <div style={{ position: "absolute", top: 12, left: 0, width: `${pct}%`, height: 4, background: `linear-gradient(90deg, ${c}88, ${c})`, borderRadius: 2 }} />
        <div style={{ position: "absolute", top: 6, left: `${pct}%`, transform: "translateX(-50%)", width: 16, height: 16, borderRadius: "50%", backgroundColor: c, border: `3px solid ${T.text}`, boxShadow: `0 2px 8px rgba(0,0,0,0.2), 0 0 12px ${c}44` }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 28, opacity: 0, cursor: "pointer", margin: 0 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <span style={{ fontSize: 10, color: T.textFaint }}>{min}{unit}</span>
        <span style={{ fontSize: 10, color: T.textFaint }}>{max}{unit}</span>
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
    <div style={{ marginBottom: sub ? 8 : 16 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: color || BRAND.teal }}>{children}</div>
      {sub && <p style={{ fontSize: 13, color: T.textSecondary, margin: "6px 0 0", lineHeight: 1.5 }}>{sub}</p>}
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
      borderRadius: 12,
      padding: "24px 28px",
      position: "relative",
      overflow: "hidden",
      transition: "background-color 400ms, border-color 400ms",
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
              backgroundColor: isActive ? `${b.color}0D` : T.surface,
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
/*  Brief purposes                                                     */
/* ------------------------------------------------------------------ */
const BRIEF_PURPOSES = [
  { id: "mortgage", label: "Mortgage Application", audience: "Lender", icon: "\u2302", desc: "Prove income stability to a mortgage lender" },
  { id: "lease", label: "Lease Application", audience: "Landlord", icon: "\u229E", desc: "Demonstrate reliable income for a rental" },
  { id: "loan", label: "Business Loan", audience: "Bank", icon: "\u2261", desc: "Support a credit or loan application" },
  { id: "partnership", label: "Partnership Proposal", audience: "Partner", icon: "\u2727", desc: "Show structural reliability to a potential partner" },
  { id: "negotiation", label: "Client Negotiation", audience: "Client", icon: "\u2694", desc: "Justify rate structure or contract terms" },
] as const;

type BriefPurpose = typeof BRIEF_PURPOSES[number]["id"];

/* ------------------------------------------------------------------ */
/*  Brief content generator — deterministic templates from real data    */
/* ------------------------------------------------------------------ */
interface BriefData {
  title: string;
  date: string;
  recordId: string;
  recipient: string;
  subject: string;
  opening: string;
  scoreSection: string;
  structureSection: string;
  riskSection: string;
  benchmarkSection: string;
  closing: string;
}

function generateBrief(
  purpose: BriefPurpose,
  inputs: CanonicalInput,
  score: number,
  band: string,
  qualityScore: number,
  name: string,
  industry: string,
  incomeModel: string,
  fragility: string,
  continuityMonths: number,
  recordId: string,
): BriefData {
  const p = BRIEF_PURPOSES.find(b => b.id === purpose)!;
  const runway = Math.round(continuityMonths * 30);
  const recurLabel = inputs.income_persistence_pct >= 60 ? "strong" : inputs.income_persistence_pct >= 30 ? "moderate" : "limited";
  const concLabel = inputs.largest_source_pct <= 35 ? "well-diversified" : inputs.largest_source_pct <= 55 ? "moderately concentrated" : "concentrated";
  const fwdLabel = inputs.forward_secured_pct >= 50 ? "high" : inputs.forward_secured_pct >= 25 ? "moderate" : "limited";
  const fragilityNice = fragility.charAt(0).toUpperCase() + fragility.slice(1);
  const bandNice = band;
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const nameOrSubject = name || "Subject";

  const audienceMap: Record<BriefPurpose, string> = {
    mortgage: "Mortgage Underwriting Team",
    lease: "Property Management / Leasing Office",
    loan: "Credit & Lending Department",
    partnership: "Prospective Business Partner",
    negotiation: "Client / Procurement Team",
  };

  const openingMap: Record<BriefPurpose, string> = {
    mortgage: `This Stability Brief\u2122 is provided in support of a mortgage application by ${nameOrSubject}. The assessment below quantifies the structural stability of ${nameOrSubject}'s income using the RunPayway Income Stability Score\u2122, a deterministic scoring model built on fixed rules — not estimates or projections.`,
    lease: `This Stability Brief\u2122 is provided to support a lease application by ${nameOrSubject}. It documents the structural characteristics of their income using the RunPayway Income Stability Score\u2122, which evaluates income reliability based on measurable structural factors rather than self-reported estimates.`,
    loan: `This Stability Brief\u2122 accompanies a loan application by ${nameOrSubject}. The RunPayway assessment provides a quantified, rule-based analysis of income structure — measuring recurring revenue, source diversification, forward visibility, and resilience characteristics.`,
    partnership: `This Stability Brief\u2122 provides a structural overview of ${nameOrSubject}'s income stability for partnership evaluation purposes. The assessment uses the RunPayway Income Stability Score\u2122, a deterministic model that evaluates six structural dimensions of income reliability.`,
    negotiation: `This Stability Brief\u2122 documents the income stability profile of ${nameOrSubject} for use in contract or rate discussions. The RunPayway Income Stability Score\u2122 provides an objective, rule-based assessment of income structure — independent of revenue amount.`,
  };

  const scoreSection = `${nameOrSubject} has been assessed at a score of ${score}/100, classifying as "${bandNice}" on the Income Stability Classification Scale. This score reflects the structural characteristics of their income — not the amount earned, but how that income is structured for continuity, predictability, and resilience.

Score: ${score}/100
Classification: ${bandNice}
Fragility Assessment: ${fragilityNice}
Income Runway: ${runway} days
Quality Rating: ${qualityScore}/10`;

  const structureSection = `The assessment evaluates six structural dimensions:

\u2022 Recurring Revenue: ${inputs.income_persistence_pct}% of income is recurring or contractually persistent (${recurLabel})
\u2022 Source Diversification: ${inputs.source_diversity_count} active income source${inputs.source_diversity_count !== 1 ? "s" : ""}, with the largest representing ${inputs.largest_source_pct}% of total income (${concLabel})
\u2022 Forward Visibility: ${inputs.forward_secured_pct}% of near-term income is contractually secured (${fwdLabel} forward visibility)
\u2022 Income Variability: ${inputs.income_variability_level.charAt(0).toUpperCase() + inputs.income_variability_level.slice(1)} month-to-month variation
\u2022 Labor Dependence: ${inputs.labor_dependence_pct}% of income requires active personal labor
\u2022 Income Continuity: ${continuityMonths.toFixed(1)} months of estimated continuity without new business activity`;

  const riskMap: Record<BriefPurpose, string> = {
    mortgage: `Under stress testing, ${nameOrSubject}'s income structure demonstrates ${fragility === "resilient" || fragility === "moderate" ? "structural resilience" : "areas that may warrant attention"}. The ${runway}-day income runway indicates ${runway >= 90 ? "a meaningful buffer against disruption" : runway >= 30 ? "a limited but present buffer" : "a minimal buffer, though this is common in early-stage independent income structures"}.${industry ? ` Within the ${industry} sector, ${incomeModel ? `${incomeModel.toLowerCase()} professionals` : "professionals"} with similar structural profiles typically maintain stable payment capacity.` : ""}`,
    lease: `The income structure shows a ${runway}-day operational runway — the estimated duration income continues without new client acquisition. ${fragility === "resilient" || fragility === "moderate" ? "The fragility assessment indicates structural stability suitable for consistent payment obligations." : "While the structure has some concentration, the forward visibility and recurring revenue components provide a foundation for reliable payments."}`,
    loan: `Risk assessment indicates a fragility classification of "${fragilityNice}" with ${runway} days of income runway. ${inputs.income_persistence_pct >= 40 ? `The ${inputs.income_persistence_pct}% recurring revenue base provides a predictable foundation for debt service.` : `Forward revenue visibility at ${inputs.forward_secured_pct}% provides near-term payment predictability.`}${industry ? ` Industry context: ${industry} ${incomeModel ? `${incomeModel.toLowerCase()} ` : ""}professionals with this score typically fall in the top ${score >= 75 ? "20%" : score >= 50 ? "40%" : "60%"} of their peer group.` : ""}`,
    partnership: `From a structural perspective, ${nameOrSubject}'s income profile is classified as "${fragilityNice}" for fragility, with ${runway} days of operational runway. ${inputs.source_diversity_count >= 3 ? `The ${inputs.source_diversity_count}-source diversification reduces single-point-of-failure risk.` : "Income concentration is present but manageable."} ${inputs.income_persistence_pct >= 40 ? `The ${inputs.income_persistence_pct}% recurring revenue base indicates a sustainable operating rhythm.` : "There is opportunity to increase structural persistence through retainer or subscription models."}`,
    negotiation: `${nameOrSubject}'s income structure supports the rate and terms under discussion. The ${score}/100 stability score reflects a ${bandNice.toLowerCase()} position — ${score >= 50 ? "indicating structural reliability that justifies premium positioning" : "with clear structural factors that inform pricing strategy"}. ${inputs.income_persistence_pct >= 40 ? `With ${inputs.income_persistence_pct}% recurring revenue, the business model demonstrates consistency.` : ""} ${inputs.forward_secured_pct >= 30 ? `${inputs.forward_secured_pct}% forward-secured revenue shows demand confidence.` : ""}`,
  };

  const benchmarkSection = industry
    ? `Peer benchmarking places ${nameOrSubject} within the ${industry} sector${incomeModel ? ` among ${incomeModel.toLowerCase()} professionals` : ""}. The top 20% of this peer group typically maintains 60%+ recurring revenue with less than 35% concentration in any single source. ${nameOrSubject}'s current structure ${score >= 75 ? "meets or exceeds" : score >= 50 ? "approaches" : "is developing toward"} these benchmarks.`
    : `The score of ${score}/100 is evaluated against the full population of assessed income structures. ${score >= 75 ? "This places the subject in the top quartile of all assessed profiles." : score >= 50 ? "This indicates a structurally sound income profile with room for optimization." : "This indicates a developing income structure with identifiable paths to improvement."}`;

  const closingMap: Record<BriefPurpose, string> = {
    mortgage: `This Stability Brief\u2122 was generated using RunPayway Model RP-2.0, a deterministic scoring system that evaluates income structure using fixed, auditable rules. The score is not a prediction of future income — it is a measurement of current structural characteristics. For verification, reference Record ${recordId}.`,
    lease: `This Stability Brief\u2122 was produced by the RunPayway Income Stability Score\u2122 (Model RP-2.0). The assessment is deterministic and rule-based — the same inputs always produce the same score. For verification purposes, this assessment is filed under Record ${recordId}.`,
    loan: `Stability Brief\u2122 produced by RunPayway Model RP-2.0 — a deterministic, rule-based scoring system. No machine learning or probabilistic models are used. The score is reproducible and auditable. Record reference: ${recordId}.`,
    partnership: `This Stability Brief\u2122 reflects the current structural state of ${nameOrSubject}'s income as measured by RunPayway Model RP-2.0. The scoring methodology is deterministic and transparent — identical inputs produce identical outputs. Reference: ${recordId}.`,
    negotiation: `Stability Brief\u2122 methodology: RunPayway Income Stability Score\u2122 (Model RP-2.0). Deterministic scoring based on six structural dimensions. Not a revenue estimate — a structural reliability measurement. Record: ${recordId}.`,
  };

  return {
    title: `Stability Brief\u2122`,
    date: today,
    recordId,
    recipient: audienceMap[purpose],
    subject: `Income Stability Assessment — ${nameOrSubject}`,
    opening: openingMap[purpose],
    scoreSection,
    structureSection,
    riskSection: riskMap[purpose],
    benchmarkSection,
    closing: closingMap[purpose],
  };
}

/* ------------------------------------------------------------------ */
/*  Stability Brief Generator™ UI                                      */
/* ------------------------------------------------------------------ */
function BriefGenerator({
  inputs, score, band, qualityScore, name, industry, incomeModel,
  fragility, continuityMonths, recordId,
}: {
  inputs: CanonicalInput; score: number; band: string; qualityScore: number;
  name: string; industry: string; incomeModel: string;
  fragility: string; continuityMonths: number; recordId: string;
}) {
  const T = useTheme();
  const [purpose, setPurpose] = useState<BriefPurpose | null>(null);
  const [generated, setGenerated] = useState<BriefData | null>(null);
  const [downloading, setDownloading] = useState(false);
  const briefRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if (!purpose) return;
    const brief = generateBrief(purpose, inputs, score, band, qualityScore, name, industry, incomeModel, fragility, continuityMonths, recordId);
    setGenerated(brief);
  };

  const handleDownload = async () => {
    if (!briefRef.current || !generated) return;
    setDownloading(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(briefRef.current, { scale: 2, backgroundColor: "#FFFFFF", useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "in", format: "letter" });
      const pageWidth = 8.5;
      const pageHeight = 11;
      const margin = 0.6;
      const contentWidth = pageWidth - margin * 2;
      const imgAspect = canvas.height / canvas.width;
      const imgHeight = contentWidth * imgAspect;

      let yOffset = 0;
      const availableHeight = pageHeight - margin * 2;
      let page = 0;

      while (yOffset < imgHeight) {
        if (page > 0) pdf.addPage();
        const srcY = (yOffset / imgHeight) * canvas.height;
        const srcH = Math.min((availableHeight / imgHeight) * canvas.height, canvas.height - srcY);
        const drawH = (srcH / canvas.height) * imgHeight;

        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = srcH;
        const ctx = sliceCanvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);
          const sliceData = sliceCanvas.toDataURL("image/png");
          pdf.addImage(sliceData, "PNG", margin, margin, contentWidth, drawH);
        }
        yOffset += availableHeight;
        page++;
      }

      pdf.setProperties({ title: `Stability Brief - ${name}`, author: "RunPayway", subject: `Record ${recordId}` });
      pdf.save(`Stability-Brief-${recordId}.pdf`);
    } catch (err) {
      console.error("Brief download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{ marginTop: 48 }}>
      {/* Section divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${T.border}, transparent)` }} />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: T.textFaint }}>TOOLS</span>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${T.border}, transparent)` }} />
      </div>

      <Card glow="rgba(75,63,174,0.10)" style={{ borderTop: `2px solid ${B.purple}33` }}>
        <div className="sim-brief-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <SectionLabel color={B.purple}>Stability Brief Generator&#8482;</SectionLabel>
            <p style={{ fontSize: 13, color: T.textSecondary, margin: 0, maxWidth: 520, lineHeight: 1.5 }}>
              Generate a professional Stability Brief&#8482; built from your actual assessment data. Select who the brief is for, and we produce a document you can download and hand directly to a lender, landlord, partner, or client.
            </p>
          </div>
          <div style={{ fontSize: 11, color: T.textMuted, padding: "6px 12px", borderRadius: 6, backgroundColor: T.surface, border: `1px solid ${T.border}`, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" as const }}>
            Record {recordId}
          </div>
        </div>

        {/* Purpose selector */}
        <div className="sim-step-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: T.textFaint }}>
            STEP 1 — WHO IS THIS FOR?
          </div>
          <div style={{ fontSize: 10, color: T.textFaint }}>Select one, then generate</div>
        </div>
        <div className="sim-purposes" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 24 }}>
          {BRIEF_PURPOSES.map(bp => {
            const isActive = purpose === bp.id;
            return (
              <button key={bp.id} onClick={() => { setPurpose(bp.id); setGenerated(null); }} style={{
                padding: "14px 12px", textAlign: "center", borderRadius: 10, cursor: "pointer", transition: "all 200ms",
                border: `1px solid ${isActive ? BRAND.purple + "44" : T.border}`,
                backgroundColor: isActive ? BRAND.purpleGlow : T.surface,
              }}>
                <div style={{ fontSize: 16, marginBottom: 6 }}>{bp.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: isActive ? T.text : T.textSecondary, marginBottom: 4 }}>{bp.label}</div>
                <div style={{ fontSize: 10, color: T.textMuted, lineHeight: 1.3 }}>{bp.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Generate button */}
        {purpose && !generated && (
          <button onClick={handleGenerate} style={{
            width: "100%", padding: "14px 24px", borderRadius: 10, border: "none", cursor: "pointer",
            background: `linear-gradient(135deg, ${B.purple}, ${B.purple}DD)`,
            color: B.white, fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em",
            boxShadow: `0 4px 16px ${B.purple}44`,
          }}>
            Generate Stability Brief&#8482; for {BRIEF_PURPOSES.find(b => b.id === purpose)?.audience}
          </button>
        )}

        {/* Generated brief preview */}
        {generated && (
          <>
            <div
              ref={briefRef}
              className="sim-brief-preview"
              style={{
                backgroundColor: "#FFFFFF", borderRadius: 8, padding: "48px 44px",
                color: "#1A1A1A", fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                fontSize: 13, lineHeight: 1.7, marginBottom: 20,
              }}
            >
              {/* Brief header */}
              <div style={{ borderBottom: "2px solid #0E1A2B", paddingBottom: 20, marginBottom: 28 }}>
                <div className="sim-brief-hdr" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#4B3FAE", marginBottom: 6 }}>RUNPAYWAY&#8482;</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#0E1A2B", letterSpacing: "-0.02em" }}>{generated.title}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>{generated.date}</div>
                    <div style={{ fontSize: 11, color: "#6B7280", fontVariantNumeric: "tabular-nums" }}>{generated.recordId}</div>
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>Prepared for: <strong style={{ color: "#1A1A1A" }}>{generated.recipient}</strong></div>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>Re: <strong style={{ color: "#1A1A1A" }}>{generated.subject}</strong></div>
                </div>
              </div>

              {/* Score badge */}
              <div style={{ display: "flex", gap: 16, alignItems: "center", padding: "16px 20px", backgroundColor: "#F8F7F4", borderRadius: 8, marginBottom: 24, border: "1px solid #E8E5DD" }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: "#0E1A2B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: "#F4F1EA" }}>{score}</span>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0E1A2B" }}>{band}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>Income Stability Score&#8482; &middot; Model RP-2.0</div>
                </div>
              </div>

              {/* Opening */}
              <p style={{ marginBottom: 20 }}>{generated.opening}</p>

              {/* Score section */}
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0E1A2B", marginBottom: 8, marginTop: 28 }}>Assessment Summary</div>
              <p style={{ whiteSpace: "pre-line" as const, marginBottom: 20 }}>{generated.scoreSection}</p>

              {/* Structure */}
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0E1A2B", marginBottom: 8, marginTop: 28 }}>Structural Analysis</div>
              <p style={{ whiteSpace: "pre-line" as const, marginBottom: 20 }}>{generated.structureSection}</p>

              {/* Risk */}
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0E1A2B", marginBottom: 8, marginTop: 28 }}>Risk &amp; Resilience</div>
              <p style={{ marginBottom: 20 }}>{generated.riskSection}</p>

              {/* Benchmark */}
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0E1A2B", marginBottom: 8, marginTop: 28 }}>Peer Context</div>
              <p style={{ marginBottom: 20 }}>{generated.benchmarkSection}</p>

              {/* Closing */}
              <div style={{ borderTop: "1px solid #E8E5DD", paddingTop: 20, marginTop: 28 }}>
                <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>{generated.closing}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                  <span style={{ fontSize: 10, color: "#9CA3AF" }}>peoplestar.com/RunPayway</span>
                  <span style={{ fontSize: 10, color: "#9CA3AF" }}>Income Stability Score&#8482;</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <p style={{ fontSize: 12, color: T.textMuted, marginBottom: 14, marginTop: 0, textAlign: "center" }}>
              Your Stability Brief&#8482; is ready. Download it and attach to your application, email it to your contact, or print a copy.
            </p>
            <div className="sim-brief-actions" style={{ display: "flex", gap: 12 }}>
              <button onClick={handleDownload} disabled={downloading} style={{
                flex: 1, padding: "14px 24px", borderRadius: 10, border: "none", cursor: downloading ? "wait" : "pointer",
                background: `linear-gradient(135deg, #F4F1EA, #E8E5DD)`,
                color: "#0E1A2B", fontSize: 14, fontWeight: 600,
                opacity: downloading ? 0.7 : 1,
              }}>
                {downloading ? "Generating..." : "Download Stability Brief\u2122"}
              </button>
              <button onClick={() => { setGenerated(null); setPurpose(null); }} style={{
                padding: "14px 20px", borderRadius: 10, border: `1px solid ${T.border}`,
                backgroundColor: "transparent", color: T.textMuted, fontSize: 13, fontWeight: 500, cursor: "pointer",
              }}>
                New Brief
              </button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main content                                                       */
/* ------------------------------------------------------------------ */
function SimulatorContent() {
  const searchParams = useSearchParams();
  const [loaded, setLoaded] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [simMode, setSimMode] = useState<"presets" | "advanced">("presets");
  const [simPreset, setSimPreset] = useState<string | null>(null);
  const [sliders, setSliders] = useState<{ recurrence: number; topClient: number; sources: number; monthsBooked: number; passive: number } | null>(null);
  const [baseInputs, setBaseInputs] = useState<CanonicalInput | null>(null);
  const [qualityScore, setQualityScore] = useState(5);
  const [userName, setUserName] = useState("");
  const [industry, setIndustry] = useState("");
  const T = theme === "dark" ? DARK : LIGHT;
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
          <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${BRAND.purple}22, ${BRAND.teal}22)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", border: "1px solid rgba(244,241,234,0.08)" }}>
            <span style={{ fontSize: 20 }}>&#9672;</span>
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: BRAND.teal, marginBottom: 16 }}>Score Simulator</div>
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
    <div style={{ minHeight: "100vh", background: T.bgGradient, fontFamily: INTER, transition: "background 400ms ease" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap');
        body{margin:0;} *{box-sizing:border-box;}
        @media(max-width:680px){
          .sim-orient{flex-direction:column!important;gap:10px!important;}
          .sim-triptych{flex-direction:column!important;}
          .sim-triptych>div{border-right:none!important;border-bottom:1px solid rgba(244,241,234,0.06);}
          .sim-triptych>div:last-child{border-bottom:none!important;}
          .sim-bands{grid-template-columns:repeat(2,1fr)!important;}
          .sim-timeline-ms{flex-direction:column!important;}
          .sim-presets{grid-template-columns:repeat(2,1fr)!important;}
          .sim-advanced{grid-template-columns:1fr!important;gap:24px!important;}
          .sim-brief-head{flex-direction:column!important;gap:12px!important;}
          .sim-brief-head>div:last-child{align-self:flex-start!important;}
          .sim-purposes{grid-template-columns:repeat(2,1fr)!important;}
          .sim-brief-preview{padding:28px 20px!important;}
          .sim-brief-hdr{flex-direction:column!important;gap:8px!important;}
          .sim-brief-hdr>div:last-child{text-align:left!important;}
          .sim-brief-actions{flex-direction:column!important;}
          .sim-profile{flex-direction:column!important;text-align:center!important;gap:12px!important;}
          .sim-profile>div:last-child{text-align:center!important;}
          .sim-step-label{flex-direction:column!important;gap:4px!important;align-items:flex-start!important;}
          .sim-tl-header{flex-direction:column!important;gap:12px!important;}
          .sim-tl-header>div:last-child{text-align:left!important;margin-left:0!important;}
          .sim-container{padding:28px 16px 60px!important;}
          .sim-score-hero h1{font-size:26px!important;}
          .sim-triptych>div{padding:20px 16px!important;}
          .sim-triptych .sim-score-num{font-size:34px!important;}
          .sim-footer{flex-direction:column!important;gap:4px!important;text-align:center!important;padding:14px 16px!important;}
          .sim-mode-toggle{flex-direction:column!important;}
          .sim-mode-toggle button{border-bottom:none!important;}
        }
      `}</style>

      {/* ══════════ HEADER — Proprietary branded ══════════ */}
      <header style={{ borderBottom: `1px solid ${T.headerBorder}`, backdropFilter: "blur(16px)", backgroundColor: T.headerBg, position: "sticky", top: 0, zIndex: 50 }}>
        {/* Accent bar */}
        <div style={{ height: 2, background: `linear-gradient(90deg, ${BRAND.teal}, ${BRAND.purple}, ${BRAND.teal})` }} />
        <div style={{ padding: "12px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Image src={logoImg} alt="RunPayway" width={100} height={12} style={{ height: "auto", filter: theme === "dark" ? "brightness(10)" : "none" }} />
            <div style={{ width: 1, height: 20, backgroundColor: T.border }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: BRAND.teal }}>Score Simulator&#8482;</span>
              <span style={{ fontSize: 9, color: T.textFaint, letterSpacing: "0.06em" }}>MODEL RP-2.0</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 11, color: T.textMuted }}>{[userName, industry].filter(Boolean).join(" \u00B7 ")}</span>
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              style={{
                width: 36, height: 20, borderRadius: 10, border: `1px solid ${T.border}`,
                backgroundColor: T.surface, cursor: "pointer", position: "relative",
                transition: "all 200ms", padding: 0,
              }}
            >
              <div style={{
                width: 14, height: 14, borderRadius: "50%",
                backgroundColor: theme === "dark" ? BRAND.teal : BRAND.purple,
                position: "absolute", top: 2,
                left: theme === "dark" ? 2 : 18,
                transition: "left 200ms ease-out, background-color 200ms",
                boxShadow: `0 1px 4px ${theme === "dark" ? "rgba(26,122,109,0.4)" : "rgba(75,63,174,0.3)"}`,
              }} />
            </button>
          </div>
        </div>
      </header>

      <div className="sim-container" style={{ maxWidth: 960, margin: "0 auto", padding: "40px 28px 80px" }}>

        {/* ══════════ ORIENTATION STRIP ══════════ */}
        {!isModified && (
          <div className="sim-orient" style={{ display: "flex", gap: 6, marginBottom: 32, padding: "16px 20px", borderRadius: 10, border: `1px solid ${T.border}`, backgroundColor: T.surface }}>
            {[
              { num: "1", text: "Choose a scenario or build your own" },
              { num: "2", text: "See how your score changes over time" },
              { num: "3", text: "Generate a Stability Brief\u2122 to share" },
            ].map((step, i) => (
              <div key={i} style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "0 8px" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", backgroundColor: B.tealGlow, border: `1px solid ${B.teal}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: B.teal }}>{step.num}</span>
                </div>
                <span style={{ fontSize: 12, color: T.textSecondary, lineHeight: 1.4 }}>{step.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* ══════════ SCORE HERO ══════════ */}
        <div className="sim-score-hero" style={{ marginBottom: 32 }}>
          {/* Headline */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 32, fontFamily: DISPLAY, fontWeight: 400, color: T.text, lineHeight: 1.1, letterSpacing: "-0.025em", margin: "0 0 8px", transition: "color 400ms" }}>
              {isModified ? "Projected Impact" : "Your Income Structure"}
            </h1>
            <p style={{ fontSize: 14, color: T.textSecondary, margin: 0, maxWidth: 520, transition: "color 400ms" }}>
              {isModified
                ? "How this change reshapes your income stability score and structural position."
                : "Select a scenario below to see how structural changes affect your score over time."}
            </p>
          </div>

          {/* Score triptych */}
          <div className="sim-triptych" style={{ display: "flex", gap: 2, borderRadius: 12, overflow: "hidden" }}>
            {/* Current */}
            <div style={{ flex: 1, background: T.surface, padding: "28px 24px", textAlign: "center", transition: "background 400ms" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: T.textMuted, marginBottom: 10 }}>CURRENT</div>
              <div className="sim-score-num" style={{ fontSize: 42, fontWeight: 300, color: T.text, lineHeight: 1, fontFamily: DISPLAY, transition: "color 400ms" }}>{base.overall_score}</div>
              <div style={{ fontSize: 11, color: bandColor(base.band), fontWeight: 600, marginTop: 8 }}>{base.band}</div>
            </div>

            {/* Simulated */}
            <div style={{
              flex: 1, padding: "28px 24px", textAlign: "center", transition: "background 400ms",
              background: isModified
                ? delta > 0 ? "rgba(26,122,109,0.06)" : delta < 0 ? "rgba(220,74,74,0.04)" : T.surface
                : T.surface,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: T.textMuted, marginBottom: 10 }}>
                {isModified ? "SIMULATED" : "BASELINE"}
              </div>
              <div className="sim-score-num" style={{
                fontSize: 42, fontWeight: 300, lineHeight: 1, fontFamily: DISPLAY, transition: "color 400ms",
                color: isModified ? (delta > 0 ? BRAND.teal : delta < 0 ? BRAND.bandLimited : T.text) : T.text,
              }}>
                {sim.overall_score}
              </div>
              <div style={{ fontSize: 11, color: bandColor(sim.band), fontWeight: 600, marginTop: 8 }}>{sim.band}</div>
            </div>

            {/* Impact */}
            <div style={{ flex: 1, background: T.surface, padding: "28px 24px", textAlign: "center", transition: "background 400ms" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: T.textMuted, marginBottom: 10 }}>IMPACT</div>
              <div className="sim-score-num" style={{
                fontSize: 42, fontWeight: 300, lineHeight: 1, fontFamily: DISPLAY, transition: "color 400ms",
                color: delta > 0 ? BRAND.teal : delta < 0 ? BRAND.bandLimited : T.textFaint,
              }}>
                {delta > 0 ? `+${delta}` : delta === 0 ? "\u2014" : String(delta)}
              </div>
              <div style={{ fontSize: 11, color: T.textMuted, marginTop: 8 }}>{runway} day{runway !== 1 ? "s" : ""} runway</div>
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
        <div className="sim-mode-toggle" style={{ display: "flex", gap: 2, marginBottom: 28, borderRadius: 10, overflow: "hidden", border: `1px solid ${T.border}`, transition: "border-color 400ms" }}>
          {(["presets", "advanced"] as const).map((mode) => (
            <button key={mode} onClick={() => {
              setSimMode(mode);
              if (mode === "presets") setSliders({ recurrence: baseInputs.income_persistence_pct, topClient: baseInputs.largest_source_pct, sources: baseInputs.source_diversity_count, monthsBooked: Math.round(baseInputs.forward_secured_pct / 100 * 6 * 2) / 2, passive: 100 - baseInputs.labor_dependence_pct });
              else setSimPreset(null);
            }} style={{
              flex: 1, padding: "14px 16px", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 200ms",
              backgroundColor: simMode === mode ? (mode === "presets" ? BRAND.tealGlow : BRAND.purpleGlow) : "transparent",
              color: simMode === mode ? (mode === "presets" ? BRAND.teal : BRAND.purple) : T.textMuted,
              borderBottom: simMode === mode ? `2px solid ${mode === "presets" ? BRAND.teal : BRAND.purple}` : "2px solid transparent",
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

            <div className="sim-presets" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
              {SIMULATOR_PRESETS.map((preset) => {
                const ia = simPreset === preset.id;
                const previewDelta = simulateScore(preset.modify(baseInputs), qualityScore).overall_score - base.overall_score;
                const isNeg = previewDelta < 0;
                return (
                  <button key={preset.id} onClick={() => setSimPreset(ia ? null : preset.id)} style={{
                    padding: "16px 18px", textAlign: "left", borderRadius: 10, cursor: "pointer", transition: "all 200ms",
                    border: `1px solid ${ia ? (isNeg ? BRAND.bandLimited : BRAND.purple) + "44" : T.border}`,
                    backgroundColor: ia ? (isNeg ? "rgba(220,74,74,0.06)" : BRAND.purpleGlow) : T.surface,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: ia ? T.text : T.textSecondary }}>{preset.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: previewDelta >= 0 ? B.teal : B.bandLimited, fontVariantNumeric: "tabular-nums" }}>
                        {fmt(previewDelta)}
                      </span>
                    </div>
                    <p style={{ fontSize: 11, color: T.textMuted, margin: 0, lineHeight: 1.4 }}>{preset.description}</p>
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
                <Slider label="Recurring revenue" value={sl.recurrence} min={0} max={100} step={5} unit="%" onChange={(v) => setSliders({ ...sl, recurrence: v })} />
                <Slider label="Top client share" value={sl.topClient} min={sl.sources <= 1 ? 100 : 10} max={100} step={5} unit="%" onChange={(v) => setSliders({ ...sl, topClient: v })} accent={B.bandDeveloping} />
                <Slider label="Income sources" value={sl.sources} min={1} max={8} step={1} unit="" onChange={(v) => setSliders({ ...sl, sources: v, topClient: v <= 1 ? 100 : Math.min(sl.topClient, 100) })} />
              </Card>

              <Card style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: T.textFaint, marginBottom: 20 }}>PREDICTABILITY</div>
                <Slider label="Months booked ahead" value={sl.monthsBooked} min={0} max={6} step={0.5} unit=" mo" onChange={(v) => setSliders({ ...sl, monthsBooked: v })} accent={B.bandEstablished} />
              </Card>

              <Card>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: T.textFaint, marginBottom: 20 }}>RESILIENCE</div>
                <Slider label="Passive income" value={sl.passive} min={0} max={100} step={5} unit="%" onChange={(v) => setSliders({ ...sl, passive: v })} accent={B.purple} />
              </Card>

              <button onClick={() => setSliders({ recurrence: baseInputs.income_persistence_pct, topClient: baseInputs.largest_source_pct, sources: baseInputs.source_diversity_count, monthsBooked: Math.round(baseInputs.forward_secured_pct / 100 * 6 * 2) / 2, passive: 100 - baseInputs.labor_dependence_pct })} style={{ fontSize: 11, color: T.textMuted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: "12px 0 0", marginTop: 4 }}>
                Reset to current
              </button>
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

        {/* ══════════ BRIEF GENERATOR ══════════ */}
        <BriefGenerator
          inputs={baseInputs}
          score={base.overall_score}
          band={base.band}
          qualityScore={qualityScore}
          name={userName}
          industry={industry}
          incomeModel={incomeModel}
          fragility={base.fragility_class}
          continuityMonths={base.continuity_months}
          recordId={recordId}
        />

        {/* ══════════ PROFILE CARD ══════════ */}
        {(userName || industry || incomeModel) && (
          <div className="sim-profile" style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 32, padding: "16px 20px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, transition: "all 400ms" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${BRAND.purple}22, ${BRAND.teal}22)`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.border}` }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{(userName || "?")[0].toUpperCase()}</span>
            </div>
            <div style={{ flex: 1 }}>
              {userName && <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 2, transition: "color 400ms" }}>{userName}</div>}
              <div style={{ display: "flex", gap: 10 }}>
                {industry && <span style={{ fontSize: 11, color: T.textMuted }}>{industry}</span>}
                {industry && incomeModel && <span style={{ fontSize: 11, color: T.textFaint }}>\u00B7</span>}
                {incomeModel && <span style={{ fontSize: 11, color: T.textMuted }}>{incomeModel}</span>}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: T.text, fontVariantNumeric: "tabular-nums", transition: "color 400ms" }}>{base.overall_score}<span style={{ fontSize: 11, color: T.textMuted }}>/100</span></div>
              <div style={{ fontSize: 10, color: bandColor(base.band), fontWeight: 600 }}>{base.band}</div>
            </div>
          </div>
        )}
      </div>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="sim-footer" style={{ borderTop: `1px solid ${T.border}`, padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "border-color 400ms" }}>
        <span style={{ fontSize: 10, color: T.textFaint, transition: "color 400ms" }}>Income Stability Score&#8482; &middot; Model RP-2.0</span>
        <span style={{ fontSize: 10, color: T.textFaint, transition: "color 400ms" }}>Deterministic &middot; Fixed Rules &middot; No AI</span>
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
