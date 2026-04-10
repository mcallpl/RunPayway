"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchSimulationBatch } from "@/lib/worker-api";
import type { SimulationResult, CanonicalInputs } from "@/lib/worker-api";
import { bandColor as bandColorFn } from "@/lib/design-tokens";
import { getVocabulary } from "@/lib/industry-vocabulary";
import EmailCapture from "@/components/EmailCapture";

/* ================================================================== */
/* DESIGN SYSTEM (LOCKED)                                              */
/* ================================================================== */

const C = {
  navy: "#1C1635",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  white: "#FFFFFF",
  border: "rgba(14,26,43,0.08)",
};

const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';
const sans = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const muted = "rgba(14,26,43,0.68)";
const light = "rgba(14,26,43,0.62)";

const STRIPE = "https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05";

/* ================================================================== */
/* CONSTRAINT LABELS                                                   */
/* ================================================================== */

const CONSTRAINT_LABELS: Record<string, string> = {
  high_concentration: "Income Concentration",
  weak_forward_visibility: "Forward Visibility",
  high_labor_dependence: "Labor Dependence",
  low_persistence: "Low Recurrence",
  low_source_diversity: "Source Diversification",
  high_variability: "Earnings Variability",
  weak_durability: "Structural Durability",
  shallow_continuity: "Income Continuity",
};

const CONSTRAINT_EXPLANATIONS: Record<string, string> = {
  high_concentration: "Too much of your income depends on a single source. If that source changes, most of your structure is affected.",
  weak_forward_visibility: "Most of your income is not committed ahead of time. You are earning month-to-month without structural visibility.",
  high_labor_dependence: "Your income requires your active daily work. If you stop, income stops with you.",
  low_persistence: "Very little of your income renews automatically. Each period requires new acquisition.",
  low_source_diversity: "Your income flows through too few sources. A single change can shift the entire structure.",
  high_variability: "Your income fluctuates significantly between periods. The inconsistency itself is a structural weakness.",
  weak_durability: "The agreements supporting your income may not hold under pressure.",
  shallow_continuity: "Your income runway is critically short. If active work stops, income drops to near zero.",
};

const BEHAVIOR_DESCRIPTIONS: Record<string, string> = {
  high_concentration: "Your income stability is anchored to a primary source. Other components support the structure but do not fully offset that reliance. Stability depends on that source remaining consistent.",
  weak_forward_visibility: "Your income is structurally present but not secured ahead of time. Each period begins without confirmed revenue. The structure relies on continued demand arriving on schedule.",
  high_labor_dependence: "Your income is directly tied to active effort. The structure does not generate revenue independently. Stability depends on your capacity to continue working without interruption.",
  low_persistence: "Your income does not carry forward between periods. Each cycle starts from a low base. The structure rebuilds rather than compounds.",
  low_source_diversity: "Your income is concentrated across too few relationships. The structure lacks the distribution needed to absorb a loss in any one area.",
  high_variability: "Your income moves unpredictably between periods. The structure does not smooth earnings across time. Planning and investment capacity are limited by inconsistency.",
  weak_durability: "Your income structure depends on agreements that may not sustain pressure. The underlying contracts or arrangements have limited structural strength.",
  shallow_continuity: "Your income has no meaningful runway. If circumstances change, the structure provides almost no buffer before income drops.",
};

const IMPROVEMENT_DIRECTIONS: Record<string, string[]> = {
  high_concentration: ["Reduce reliance on your largest income source", "Increase the number of contributing income streams", "Strengthen forward income commitments"],
  weak_forward_visibility: ["Secure income commitments further ahead of time", "Convert short-term arrangements to longer agreements", "Build recurring revenue that does not require re-selling each period"],
  high_labor_dependence: ["Build income streams that continue without your active work", "Convert active delivery into recurring arrangements", "Develop assets that generate revenue independently"],
  low_persistence: ["Increase the proportion of income that renews automatically", "Convert project-based work to retainer or subscription models", "Build at least one income stream with built-in recurrence"],
  low_source_diversity: ["Add at least one independent income source", "Reduce the share of income from your largest source", "Build revenue from sources that are not correlated"],
  high_variability: ["Stabilize income timing through longer commitments", "Build a base of recurring revenue to smooth fluctuations", "Reduce dependence on lumpy or seasonal income"],
  weak_durability: ["Strengthen the contractual basis of your income", "Convert informal arrangements to signed agreements", "Extend the duration and enforceability of key relationships"],
  shallow_continuity: ["Build any form of income that continues without active work", "Secure at least one forward commitment", "Develop a revenue source with structural persistence"],
};

const INDUSTRY_CONTEXT: Record<string, string> = {
  "Real Estate": "In real estate, income often concentrates around transactions and a small number of clients. This creates variability and reliance on deal flow timing. Your structure reflects this pattern, where stability depends on a limited number of contributors.",
  "Consulting / Professional Services": "In professional services, income typically depends on active utilization and retained client relationships. When workload softens or a key client leaves, revenue resets around available work rather than continuing automatically.",
  "Finance / Banking": "In finance, compensation often combines a fixed base with performance-linked components. The variable portion can weaken faster than expected when conditions shift, creating more structural exposure than the total figure suggests.",
  "Technology": "In technology, high compensation can mask a narrow structure. When income depends heavily on a single employer or equity position, a change in that relationship affects a disproportionate share of total earnings.",
  "Healthcare": "In healthcare, consistent pay can obscure limited structural flexibility. When income depends on one system or one reimbursement model, a change in that environment can affect the entire earnings base.",
  "Sales / Brokerage": "In sales, compensation moves in cycles tied to pipeline and deal timing. Between closings, the structure carries exposure. Stability depends on consistent deal flow rather than structural protection.",
  "Insurance": "In insurance, the balance between new production and renewal income determines structural resilience. When new business slows, the structure depends on how much recurring revenue has been built underneath.",
  "Legal Services": "In legal services, income often depends on active billable hours and a concentrated client base. When case flow softens, the structure provides limited cushion between active engagement and income.",
  "Construction / Trades": "In trades, project-based income can look solid while the next phase of work is not fully secured. Gaps between projects reveal the structural exposure that active work conceals.",
  "Media / Entertainment": "In creative work, projects and bookings can generate strong periods without creating structural continuity. Between engagements, there is typically no built-in carry.",
  "Education": "In education, income is often tied to one institution with limited structural flexibility. Predictability and resilience are not identical when the structure depends on a single system.",
  "default": "Your income structure reflects patterns common across independent professionals. Stability depends on how income is distributed, how much persists automatically, and how far forward it is secured.",
};

/* ================================================================== */
/* UPGRADE HEADLINES BY BAND                                           */
/* ================================================================== */

const UPGRADE_HEADLINES: Record<string, string> = {
  "Limited Stability": "Your structure is exposed.",
  "Developing Stability": "Your structure is not yet protected.",
  "Established Stability": "Your structure is stable \u2014 but not protected.",
  "High Stability": "Your structure is strong \u2014 but still dependent.",
};

/* ================================================================== */
/* MAIN                                                                */
/* ================================================================== */

export default function FreeScorePage() {
  const router = useRouter();
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [mobile, setMobile] = useState(false);
  const scoreAnimated = useRef(false);
  const [stressResult, setStressResult] = useState<SimulationResult | null>(null);
  const [stressLoading, setStressLoading] = useState(true);

  useEffect(() => { const c = () => setMobile(window.innerWidth <= 640); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Check sessionStorage first, fall back to localStorage
    let stored = sessionStorage.getItem("rp_record");
    if (!stored) {
      stored = localStorage.getItem("rp_record");
      if (stored) sessionStorage.setItem("rp_record", stored);
    }
    if (!stored) { router.push("/diagnostic-portal"); return; }
    try {
      const parsed = JSON.parse(stored);
      if (!parsed || !parsed.record_id || typeof parsed.final_score !== "number") { router.push("/diagnostic-portal"); return; }
      setRecord(parsed);
    } catch { router.push("/diagnostic-portal"); }
  }, [router]);

  // Prevent accidental navigation — warn before leaving (but not if user clicked a link)
  const intentionalNav = useRef(false);
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!intentionalNav.current) e.preventDefault();
    };
    const markIntentional = () => { intentionalNav.current = true; };
    // Any link/anchor click is intentional
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.closest("a[href]")) markIntentional();
    });
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  useEffect(() => {
    if (!record || scoreAnimated.current) return;
    scoreAnimated.current = true;
    const target = record.final_score as number;
    const duration = 1800;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [record]);

  /* Poll sessionStorage for background personalization data */
  useEffect(() => {
    if (!record) return;
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (attempts > 5) { clearInterval(interval); return; }
      try {
        const updated = JSON.parse(sessionStorage.getItem("rp_record") || "{}");
        const hook = (updated._v2 as Record<string, unknown> | undefined)?.personalized;
        const currentHook = (record._v2 as Record<string, unknown> | undefined)?.personalized;
        if (hook && !currentHook) {
          setRecord(updated);
        }
      } catch { /* */ }
    }, 2000);
    return () => clearInterval(interval);
  }, [record]);

  /* Stress test — must be before any early return to preserve hook order */
  useEffect(() => {
    if (!record) return;
    const v2s = record._v2 as Record<string, unknown> | undefined;
    const nis = v2s?.normalized_inputs as Record<string, number | string> | undefined;
    const stressInputs: CanonicalInputs = nis ? {
      income_persistence_pct: (nis.income_persistence_pct as number) || 0,
      largest_source_pct: (nis.largest_source_pct as number) || 0,
      source_diversity_count: (nis.source_diversity_count as number) || 1,
      forward_secured_pct: (nis.forward_secured_pct as number) || 0,
      income_variability_level: ((nis.income_variability_level as string) || "moderate"),
      labor_dependence_pct: (nis.labor_dependence_pct as number) || 0,
    } : { income_persistence_pct: 25, largest_source_pct: 60, source_diversity_count: 2, forward_secured_pct: 15, income_variability_level: "moderate" as const, labor_dependence_pct: 70 };
    const qs = ((v2s?.quality as Record<string, number>)?.quality_score) ?? 5;
    setStressLoading(true);
    fetchSimulationBatch(stressInputs, [{ id: "stress", preset_id: "lose_top_client" }], qs)
      .then(results => { setStressResult(results.stress ?? null); setStressLoading(false); })
      .catch(err => { console.error("Stress test failed:", err); setStressLoading(false); });
  }, [record]);

  if (!record) return null;

  /* ── Derived data ── */
  const score = record.final_score as number;
  const band = record.stability_band as string;
  const bColor = bandColorFn(score);
  const industry = (record.industry_sector as string) || "";

  const nextBandThreshold = score < 30 ? 30 : score < 50 ? 50 : score < 75 ? 75 : null;
  const nextBandName = score < 30 ? "Developing Stability" : score < 50 ? "Established Stability" : score < 75 ? "High Stability" : null;
  const gap = nextBandThreshold ? nextBandThreshold - score : 0;

  const v2 = record._v2 as Record<string, unknown> | undefined;
  const rootConstraint = (v2?.constraints as { root_constraint: string })?.root_constraint || "weak_forward_visibility";
  const vocab = getVocabulary(industry);
  const constraintLabel = CONSTRAINT_LABELS[rootConstraint] || rootConstraint.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  const projectedDrop = stressResult?.overall_score ?? score;
  const projectedBand = stressResult?.band ?? band;

  const constraintExplanation = vocab.constraints[rootConstraint] || CONSTRAINT_EXPLANATIONS[rootConstraint] || "Your income has a limiting factor that increases exposure.";
  const behaviorText = vocab.behaviors[rootConstraint] || BEHAVIOR_DESCRIPTIONS[rootConstraint] || "Your income has dependencies that affect how it responds to change.";
  const improvements = vocab.improvements[rootConstraint] || IMPROVEMENT_DIRECTIONS[rootConstraint] || ["Strengthen your weakest structural dimension", "Increase income diversification", "Build forward commitments"];

  /* Industry context */
  const industryText = vocab.industry_context;

  /* AI explanation — deterministic template based on inputs */
  const explanationText = (() => {
    const lines: string[] = [];
    if (score >= 75) {
      lines.push("Your income structure is resilient under significant disruption.");
      lines.push("Multiple dimensions contribute to stability, though no structure is without dependency.");
    } else if (score >= 50) {
      lines.push("Your income structure is stable, but not fully protected.");
      lines.push(`It is supported by multiple factors, but ${constraintLabel.toLowerCase()} limits the overall score.`);
      lines.push("This creates reliability under normal conditions, but increased exposure if conditions change.");
    } else if (score >= 30) {
      lines.push("Your income structure is developing but not yet structurally protected.");
      lines.push(`The primary limitation is ${constraintLabel.toLowerCase()}, which creates meaningful exposure.`);
      lines.push("Targeted structural changes could move the score into a more stable range.");
    } else {
      lines.push("Your income structure is highly vulnerable to disruption.");
      lines.push(`${constraintLabel} is the most pressing limitation, but multiple dimensions need attention.`);
      lines.push("Small structural changes at this level can produce significant score improvement.");
    }
    lines.push("Improving the primary constraint would have the largest single impact on your score.");
    return lines;
  })();

  const personalizedInsight = (v2?.personalized as Record<string, string> | undefined)?.email_hook || "";

  const upgradeHeadline = UPGRADE_HEADLINES[band] || "Your structure has room to improve.";

  const secPad = mobile ? 32 : 48;
  const cardPad = mobile ? "24px 20px" : "28px 32px";

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.sand, fontFamily: sans }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: mobile ? "32px 16px 48px" : "64px 24px 80px" }}>

        {/* ── SECTION 1: SCORE BLOCK ── */}
        <section style={{
          backgroundColor: C.white, borderRadius: 16, padding: cardPad,
          border: `1px solid ${C.border}`, textAlign: "center",
          marginBottom: secPad,
        }}>
          <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: light, marginBottom: 24 }}>
            Your Income Stability Score&#8482;
          </div>

          {/* Score ring */}
          <div style={{ position: "relative", width: mobile ? 150 : 180, height: mobile ? 150 : 180, margin: "0 auto 16px" }}>
            <svg width={mobile ? 150 : 180} height={mobile ? 150 : 180} style={{ transform: "rotate(-90deg)" }}>
              <circle cx={mobile ? 75 : 90} cy={mobile ? 75 : 90} r={mobile ? 62 : 74} fill="none" stroke={C.border} strokeWidth={10} />
              <circle cx={mobile ? 75 : 90} cy={mobile ? 75 : 90} r={mobile ? 62 : 74} fill="none" stroke={bColor} strokeWidth={10}
                strokeDasharray={2 * Math.PI * (mobile ? 62 : 74)} strokeDashoffset={2 * Math.PI * (mobile ? 62 : 74) - (animatedScore / 100) * 2 * Math.PI * (mobile ? 62 : 74)}
                strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.3s ease" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: mono, fontSize: mobile ? 44 : 52, fontWeight: 300, color: C.navy, lineHeight: 1 }}>{animatedScore}</span>
              <span style={{ fontFamily: mono, fontSize: 13, color: light, marginTop: 2 }}>/100</span>
            </div>
          </div>

          {/* Band */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: bColor }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: bColor }}>{band}</span>
          </div>

          {nextBandName && (
            <div style={{ fontSize: 14, color: muted, marginBottom: 8 }}>
              <span style={{ fontFamily: mono, fontWeight: 600, color: C.teal }}>{gap}</span> points to {nextBandName}
            </div>
          )}

          {/* Model strip */}
          <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 20, paddingTop: 16 }}>
            <p style={{ fontSize: 12, color: light, letterSpacing: "0.02em", margin: 0 }}>
              Model RP-2.0 &bull; Version 2.0 &bull; Deterministic &bull; Same inputs &rarr; same score
            </p>
          </div>
        </section>

        {/* ── INSIGHT HOOK (personalized, async) ── */}
        {personalizedInsight && (
          <section style={{
            marginBottom: secPad,
            padding: cardPad,
            borderLeft: `3px solid ${C.teal}`,
            backgroundColor: C.white,
            borderRadius: "0 12px 12px 0",
            border: `1px solid ${C.border}`,
            borderLeftWidth: 3,
            borderLeftColor: C.teal,
            animation: "fadeIn 600ms ease",
          }}>
            <p style={{ fontSize: 17, color: C.navy, fontWeight: 500, lineHeight: 1.55, margin: 0 }}>
              {personalizedInsight}
            </p>
          </section>
        )}

        {/* ── SECTION 2: AI EXPLANATION ── */}
        <section style={{ marginBottom: secPad }}>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {explanationText.map((line, i) => (
              <p key={i} style={{ fontSize: 16, color: i === explanationText.length - 1 ? C.navy : muted, fontWeight: i === explanationText.length - 1 ? 500 : 400, lineHeight: 1.65, margin: 0 }}>
                {line}
              </p>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: PRIMARY CONSTRAINT ── */}
        <section style={{
          backgroundColor: C.white, borderRadius: 12, padding: cardPad,
          border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.purple}`,
          marginBottom: secPad,
        }}>
          <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.purple, marginBottom: 12 }}>
            Primary Structural Constraint: {constraintLabel}
          </div>
          <p style={{ fontSize: 16, color: C.navy, fontWeight: 500, lineHeight: 1.6, marginBottom: 8 }}>
            This is the strongest limiting factor affecting your score.
          </p>
          <p style={{ fontSize: 14, color: muted, lineHeight: 1.6, margin: 0 }}>
            {constraintExplanation}
          </p>
        </section>

        {/* ── SECTION 4: STRUCTURAL BEHAVIOR ── */}
        <section style={{ marginBottom: secPad }}>
          <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: light, marginBottom: 12 }}>
            Structural Behavior
          </div>
          <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, margin: 0 }}>
            {behaviorText}
          </p>
        </section>

        {/* ── SECTION 5: STRESS TEST ── */}
        <section style={{
          backgroundColor: C.white, borderRadius: 12, padding: cardPad,
          border: `1px solid ${C.border}`,
          marginBottom: secPad,
        }}>
          <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: "#9B2C2C", marginBottom: 16 }}>
            Stress Test
          </div>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, lineHeight: 1.55, marginBottom: 20 }}>
            If this changes, your structure shifts.
          </p>
          <p style={{ fontSize: 14, color: muted, lineHeight: 1.6, marginBottom: 20 }}>
            If your largest income source is removed:
          </p>

          <div style={{
            padding: "16px 20px", borderRadius: 10,
            backgroundColor: "rgba(155,44,44,0.04)", border: "1px solid rgba(155,44,44,0.08)",
            marginBottom: 20,
          }}>
            {stressLoading ? (
              <div style={{ textAlign: "center", padding: "8px 0", color: muted, fontSize: 14 }}>Calculating...</div>
            ) : (
            <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
              <span style={{ fontSize: 14, color: muted }}>Projected Score</span>
              <span style={{ fontSize: 24, fontWeight: 300, fontFamily: mono, color: "#9B2C2C" }}>{projectedDrop}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 14, color: muted }}>New Classification</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#9B2C2C" }}>{projectedBand}</span>
            </div>
            </>
            )}
          </div>

          <p style={{ fontSize: 14, color: muted, lineHeight: 1.6, marginBottom: 12 }}>
            Your structure does not distribute income widely enough to absorb this loss.
          </p>
          <p style={{ fontSize: 14, color: light, lineHeight: 1.55, margin: 0, fontStyle: "italic" }}>
            This does not affect your income today. It defines how your income responds to change.
          </p>
        </section>

        {/* ── SECTION 6: IMPROVEMENT DIRECTION ── */}
        <section style={{ marginBottom: secPad }}>
          <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>
            Improvement Direction
          </div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
            {improvements.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 8 }} />
                <span style={{ fontSize: 14, color: C.navy, lineHeight: 1.55 }}>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 7: INDUSTRY CONTEXT ── */}
        {industry && (
          <section style={{
            backgroundColor: C.white, borderRadius: 12, padding: cardPad,
            border: `1px solid ${C.border}`,
            marginBottom: secPad,
          }}>
            <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: light, marginBottom: 12 }}>
              Industry Context
            </div>
            <p style={{ fontSize: 14, color: muted, lineHeight: 1.65, margin: 0 }}>
              {industryText}
            </p>
          </section>
        )}

        {/* ── SECTION 8: UPGRADE BLOCK ── */}
        <section style={{
          backgroundColor: C.navy, borderRadius: 16,
          padding: mobile ? "32px 24px" : "40px 36px",
          textAlign: "center", marginBottom: secPad,
        }}>
          <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>
            Full Diagnostic Report
          </div>
          <div style={{ fontSize: mobile ? 20 : 24, fontWeight: 600, color: C.sand, marginBottom: 12, lineHeight: 1.3 }}>
            {upgradeHeadline}
          </div>
          <p style={{ fontSize: 16, fontWeight: 500, color: "rgba(244,241,234,0.70)", lineHeight: 1.55, marginBottom: 8 }}>
            See exactly what would break your income — before it happens.
          </p>
          <p style={{ fontSize: 14, color: "rgba(244,241,234,0.50)", lineHeight: 1.6, marginBottom: 28 }}>
            Most people discover their biggest structural risk after it hits. This shows it before.
          </p>

          {(() => {
            const personalizedWhy = (v2?.personalized as Record<string, string> | undefined)?.why_this_score || "";
            if (personalizedWhy) {
              const sentences = personalizedWhy.split(/(?<=\.)\s+/);
              const firstSentence = sentences[0] || "";
              const rest = sentences.slice(1).join(" ");
              return (
                <div style={{ textAlign: "left", maxWidth: 400, margin: "0 auto 28px" }}>
                  <p style={{ fontSize: 14, color: "rgba(244,241,234,0.75)", lineHeight: 1.6, margin: "0 0 8px" }}>
                    From your diagnostic:
                  </p>
                  <p style={{ fontSize: 15, color: "rgba(244,241,234,0.90)", lineHeight: 1.6, margin: "0 0 4px", fontWeight: 500 }}>
                    {firstSentence}
                  </p>
                  {rest && (
                    <p style={{ fontSize: 14, color: "rgba(244,241,234,0.60)", lineHeight: 1.6, margin: 0, filter: "blur(4px)", WebkitFilter: "blur(4px)", userSelect: "none" }}>
                      {rest}
                    </p>
                  )}
                  <p style={{ fontSize: 13, color: C.teal, fontWeight: 600, marginTop: 12, marginBottom: 0 }}>
                    Your full analysis continues in the diagnostic report.
                  </p>
                </div>
              );
            }
            // Fallback: original bullet list
            return (
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, textAlign: "left", maxWidth: 400, margin: "0 auto 28px" }}>
                {["Structural breakdown", "Score drivers", "Ranked risk scenarios", "Impact modeling", "Improvement path", "12-week roadmap", "Dashboard access"].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: "rgba(244,241,234,0.60)" }}>{item}</span>
                  </div>
                ))}
              </div>
            );
          })()}

          <a href={STRIPE} style={{
            display: "block", width: "100%", maxWidth: 380, margin: "0 auto 16px",
            height: 52, borderRadius: 10,
            backgroundColor: C.purple, color: C.white,
            fontSize: 16, fontWeight: 600, textDecoration: "none",
            lineHeight: "52px", textAlign: "center",
            transition: "background-color 200ms",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#3d32a0"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.purple; }}
          >
            Unlock Full Diagnostic &mdash; $69
          </a>
          <p style={{ fontSize: 13, color: C.teal, margin: 0 }}>
            If it doesn&#8217;t reveal something new, full refund.
          </p>
        </section>

        {/* ── SECTION 8B: EMAIL CAPTURE — post free score ── */}
        <section style={{
          backgroundColor: C.white, borderRadius: 12, padding: mobile ? "28px 24px" : "32px 36px",
          border: `1px solid ${C.border}`,
          marginBottom: secPad, textAlign: "center",
        }}>
          <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 12 }}>
            Income Analysis
          </div>
          <div style={{ fontSize: mobile ? 18 : 20, fontWeight: 600, color: C.navy, marginBottom: 8, lineHeight: 1.3 }}>
            Get your full income structure analysis delivered to your inbox
          </div>
          <p style={{ fontSize: 14, color: muted, lineHeight: 1.6, marginBottom: 24, maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
            A detailed look at what your score means for your specific industry and operating structure.
          </p>
          <div style={{
            padding: mobile ? "20px 16px" : "20px 24px",
            borderRadius: 12,
            backgroundColor: C.navy,
          }}>
            <EmailCapture variant="inline" source="free_score_page" />
          </div>
        </section>

        {/* ── SECTION 9: DASHBOARD PREVIEW ── */}
        <section style={{
          backgroundColor: C.white, borderRadius: 12, padding: cardPad,
          border: `1px solid ${C.border}`,
          marginBottom: secPad,
        }}>
          <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 12 }}>
            Dashboard
          </div>
          <div style={{ fontSize: 18, fontWeight: 500, color: C.navy, marginBottom: 8 }}>
            Where your structure gets improved.
          </div>
          <p style={{ fontSize: 14, color: muted, lineHeight: 1.6, marginBottom: 20 }}>
            Test changes. Measure impact. Improve your score.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 10 }}>
            {["PressureMap\u2122", "What-If Simulator", "Scenario Engine", "Execution Roadmap"].map((mod, i) => (
              <div key={i} style={{
                padding: "12px 16px", borderRadius: 8,
                backgroundColor: "#fafaf8", border: `1px solid ${C.border}`,
              }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: C.navy }}>{mod}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div style={{ textAlign: "center", paddingTop: 24, borderTop: `1px solid ${C.border}`, marginTop: 32 }}>
          <p style={{ fontSize: 11, color: light, margin: 0 }}>RunPayway&#8482; &middot; Model RP-2.0 &middot; Not financial advice.</p>
        </div>
      </div>
    </div>
  );
}
