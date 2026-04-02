"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoBlue from "../../../../public/runpayway-logo-blue.png";
import { simulateScore, SIMULATOR_PRESETS } from "@/lib/engine/v2/simulate";
import type { CanonicalInput } from "@/lib/engine/v2/simulate";

/* ================================================================== */
/*  BRAND TOKENS — matches report + Command Center                     */
/* ================================================================== */
const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  bg: "#F8F6F6",
  surface: "#FEFEFE",
  stone: "rgba(14,26,43,0.06)",
  taupe: "rgba(14,26,43,0.36)",
  muted: "rgba(14,26,43,0.58)",
  faint: "rgba(14,26,43,0.20)",
  red: "#C53030",
  bandLimited: "#9B2C2C",
  bandDeveloping: "#92640A",
  bandEstablished: "#2B5EA7",
  bandHigh: "#1F6D7A",
};

const INTER = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
function bc(s: number): string { return s >= 75 ? B.bandHigh : s >= 50 ? B.bandEstablished : s >= 30 ? B.bandDeveloping : B.bandLimited; }

const STRIPE_FULL_REPORT = "https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05";

/* ================================================================== */
/*  MAIN                                                               */
/* ================================================================== */
export default function FreeScorePage() {
  const router = useRouter();
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const scoreAnimated = useRef(false);

  useEffect(() => { const c = () => setMobile(window.innerWidth <= 700); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = sessionStorage.getItem("rp_record");
    if (!stored) { router.push("/diagnostic-portal"); return; }
    try {
      const parsed = JSON.parse(stored);
      if (!parsed || !parsed.record_id || typeof parsed.final_score !== "number") { router.push("/diagnostic-portal"); return; }
      setRecord(parsed);
    } catch { router.push("/diagnostic-portal"); }
  }, [router]);

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

  if (!record) return null;

  const score = record.final_score as number;
  const band = record.stability_band as string;
  const name = (record.assessment_title as string) || "";
  const bandColor = bc(score);
  const tier = score >= 75 ? "high" : score >= 50 ? "established" : score >= 30 ? "developing" : "limited";

  const nextBandThreshold = score < 30 ? 30 : score < 50 ? 50 : score < 75 ? 75 : null;
  const nextBandName = score < 30 ? "Developing" : score < 50 ? "Established" : score < 75 ? "High" : null;
  const gap = nextBandThreshold ? nextBandThreshold - score : 0;

  const v2 = (record as Record<string, unknown>)._v2 as Record<string, unknown> | undefined;
  const rootConstraint = (v2?.constraints as { root_constraint: string })?.root_constraint || "weak_forward_visibility";
  const constraintPlain: Record<string, string> = {
    high_concentration: "Too much of your income flows through one source. If that source pauses, your entire structure feels it.",
    weak_forward_visibility: "Most of your income isn't locked in ahead of time. You're earning month-to-month without structural visibility.",
    high_labor_dependence: "Your income stops when you stop working. There's no structural layer that continues without you.",
    low_persistence: "Very little of your income repeats on its own. Each month, you're rebuilding from close to zero.",
    low_source_diversity: "Your income comes from too few places. One relationship changing could shift everything.",
    high_variability: "Your income swings too much month to month. The unpredictability itself is a structural weakness.",
  };
  const insightText = constraintPlain[rootConstraint] || "Your income structure has room to improve.";

  // Peer benchmark percentile (from v2 benchmarks)
  const benchmarks = v2?.benchmarks as { peer_percentile?: number; cluster_label?: string } | undefined;
  const peerPercentile = benchmarks?.peer_percentile ?? null;
  const peerCluster = benchmarks?.cluster_label ?? (record.industry_sector as string || "").replace(/_/g, " ");

  const humanMessage = tier === "high" ? "Your income is structurally sound." : tier === "established" ? "Solid foundation — but there are gaps." : tier === "developing" ? "You're building, but not protected yet." : "Your income structure needs attention.";

  // Best move preview
  const bestMove = (() => {
    const ni = v2?.normalized_inputs as Record<string, number | string> | undefined;
    if (!ni) return null;
    const inputs: CanonicalInput = {
      income_persistence_pct: (ni.income_persistence_pct as number) || 0, largest_source_pct: (ni.largest_source_pct as number) || 0,
      source_diversity_count: (ni.source_diversity_count as number) || 1, forward_secured_pct: (ni.forward_secured_pct as number) || 0,
      income_variability_level: ((ni.income_variability_level as string) || "moderate") as CanonicalInput["income_variability_level"],
      labor_dependence_pct: (ni.labor_dependence_pct as number) || 0,
    };
    const qScore = ((v2?.quality as Record<string, number>)?.quality_score) ?? 5;
    const baseScore = simulateScore(inputs, qScore).overall_score;
    let best = { label: "", lift: 0, newScore: 0 };
    for (const p of SIMULATOR_PRESETS.filter(p => !["lose_top_client", "cant_work_90_days"].includes(p.id))) {
      const res = simulateScore(p.modify(inputs), qScore);
      const lift = res.overall_score - baseScore;
      if (lift > best.lift) best = { label: p.label, lift, newScore: res.overall_score };
    }
    return best.lift > 0 ? best : null;
  })();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: B.bg, fontFamily: INTER }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: mobile ? "40px 20px 60px" : "64px 32px 80px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: mobile ? 32 : 48 }}>
          <Image src={logoBlue} alt="RunPayway" width={mobile ? 120 : 140} height={16} style={{ height: "auto", opacity: 0.8 }} />
        </div>

        {/* ── EMAIL GATE — capture before revealing score ── */}
        {!emailSubmitted && (
          <div style={{ padding: mobile ? "32px 24px" : "40px 40px", borderRadius: 16, backgroundColor: B.surface, border: `1px solid ${B.stone}`, textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.taupe, marginBottom: 16 }}>YOUR SCORE IS READY</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: B.navy, marginBottom: 8 }}>Enter your email to see your results</div>
            <p style={{ fontSize: 15, color: B.muted, margin: "0 0 24px" }}>We will send a copy of your score to this address. No spam.</p>
            <div style={{ display: "flex", gap: 8, maxWidth: 400, margin: "0 auto", flexDirection: mobile ? "column" : "row" }}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                onKeyDown={(e) => { if (e.key === "Enter" && email.includes("@")) setEmailSubmitted(true); }}
                style={{ flex: 1, padding: "13px 16px", fontSize: 15, border: `1px solid ${B.stone}`, borderRadius: 10, outline: "none", boxSizing: "border-box" as const, minHeight: 48 }} />
              <button onClick={() => { if (email.includes("@")) setEmailSubmitted(true); }}
                style={{ padding: "13px 24px", fontSize: 15, fontWeight: 600, color: "#F4F1EA", backgroundColor: B.navy, border: "none", borderRadius: 10, cursor: email.includes("@") ? "pointer" : "not-allowed", opacity: email.includes("@") ? 1 : 0.5, minHeight: 48 }}>
                Reveal Score
              </button>
            </div>
            <button onClick={() => setEmailSubmitted(true)} style={{ marginTop: 16, background: "none", border: "none", cursor: "pointer", fontSize: 13, color: B.taupe, textDecoration: "underline", textUnderlineOffset: 3 }}>
              Skip for now
            </button>
          </div>
        )}

        {/* ── SCORE CARD — matches report cover ── */}
        {emailSubmitted && <><div style={{ padding: mobile ? "32px 24px" : "40px 40px", borderRadius: 16, backgroundColor: B.surface, border: `1px solid ${B.stone}`, textAlign: "center", marginBottom: 32 }}>

          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.taupe, marginBottom: 16 }}>INCOME STABILITY SCORE&#8482;</div>

          {name && <div style={{ fontSize: 17, fontWeight: 500, color: B.navy, marginBottom: 4 }}>{name}</div>}
          <div style={{ fontSize: 12, color: B.taupe, marginBottom: 24 }}>Free Assessment &middot; Model RP-2.0</div>

          {/* Score ring */}
          <div style={{ position: "relative", width: mobile ? 140 : 170, height: mobile ? 140 : 170, margin: "0 auto 16px" }}>
            <svg width={mobile ? 140 : 170} height={mobile ? 140 : 170} style={{ transform: "rotate(-90deg)" }}>
              <circle cx={mobile ? 70 : 85} cy={mobile ? 70 : 85} r={mobile ? 58 : 70} fill="none" stroke={B.stone} strokeWidth={mobile ? 8 : 10} />
              <circle cx={mobile ? 70 : 85} cy={mobile ? 70 : 85} r={mobile ? 58 : 70} fill="none" stroke={bandColor} strokeWidth={mobile ? 8 : 10}
                strokeDasharray={2 * Math.PI * (mobile ? 58 : 70)} strokeDashoffset={2 * Math.PI * (mobile ? 58 : 70) - (animatedScore / 100) * 2 * Math.PI * (mobile ? 58 : 70)}
                strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.3s ease" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: mobile ? 40 : 48, fontWeight: 300, color: B.navy, letterSpacing: "-0.03em", lineHeight: 1 }}>{animatedScore}</span>
              <span style={{ fontSize: 12, fontWeight: 300, color: B.taupe }}>/100</span>
            </div>
          </div>

          {/* Band */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: bandColor }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: bandColor }}>{band}</span>
          </div>

          <div style={{ fontSize: 15, color: B.taupe, marginBottom: 8 }}>{humanMessage}</div>

          {nextBandName && <div style={{ fontSize: 13, color: B.teal, fontWeight: 600 }}>{gap} points to {nextBandName} Stability</div>}

          {peerPercentile !== null && (
            <div style={{ fontSize: 13, color: B.muted, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${B.stone}` }}>
              {peerPercentile >= 50
                ? `You're in the ${Math.round(peerPercentile)}th percentile for ${peerCluster}.`
                : `${Math.round(100 - peerPercentile)}% of ${peerCluster} professionals score higher.`}
            </div>
          )}
        </div>

        {/* ── ROOT CONSTRAINT — matches report key takeaway ── */}
        <div style={{ padding: mobile ? "20px 20px" : "24px 28px", borderRadius: 12, backgroundColor: B.surface, border: `1px solid ${B.stone}`, borderLeft: `3px solid ${B.purple}`, marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.purple, marginBottom: 8 }}>YOUR PRIMARY CONSTRAINT</div>
          <p style={{ fontSize: 15, color: B.navy, margin: "0 0 8px", lineHeight: 1.6, fontWeight: 500 }}>{insightText}</p>
          <p style={{ fontSize: 13, color: B.taupe, margin: 0, lineHeight: 1.5 }}>
            This is the single biggest factor holding your score down. The full report breaks down why, how it connects to your other structural factors, and what to do about it.
          </p>
        </div>

        {/* ── BEST MOVE PREVIEW — teaser only, no exact numbers ── */}
        {bestMove && (
          <div style={{ padding: mobile ? "20px 20px" : "24px 28px", borderRadius: 12, backgroundColor: B.surface, border: `1px solid ${B.stone}`, borderLeft: `3px solid ${B.teal}`, marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.teal, marginBottom: 8 }}>YOUR HIGHEST-IMPACT MOVE</div>
            <p style={{ fontSize: 15, color: B.navy, margin: "0 0 8px", lineHeight: 1.6, fontWeight: 500 }}>
              We identified a single structural change that could meaningfully raise your score.
            </p>
            <p style={{ fontSize: 13, color: B.taupe, margin: 0, lineHeight: 1.5 }}>
              The full report reveals exactly what it is, why it matters for your industry, and how to act on it — with two additional moves ranked by impact.
            </p>
          </div>
        )}

        {/* ── WHAT THE FULL REPORT TELLS YOU ── */}
        <div style={{ padding: mobile ? "24px 20px" : "28px 28px", borderRadius: 12, backgroundColor: B.surface, border: `1px solid ${B.stone}`, marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.taupe, marginBottom: 16 }}>WHAT THE FULL REPORT TELLS YOU</div>
          {[
            "Where your income is structurally exposed — and why",
            "The 3 highest-impact moves to raise your score, ranked",
            "How your structure compares to others in your industry",
            "What happens to your score if your top source disappears",
            "A 12-week action roadmap built for your specific situation",
            "Scripts you can use in real conversations with clients",
          ].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: B.purple, flexShrink: 0, marginTop: 7 }} />
              <span style={{ fontSize: 14, color: B.navy, lineHeight: 1.55 }}>{item}</span>
            </div>
          ))}
        </div>

        {/* ── CTA — clean, confident, guarantee inside ── */}
        <div style={{ padding: mobile ? "28px 24px" : "32px 36px", borderRadius: 16, backgroundColor: B.navy, textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.teal, marginBottom: 12 }}>FULL DIAGNOSTIC REPORT</div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: mobile ? 36 : 44, fontWeight: 300, color: "#F4F1EA" }}>$69</span>
            <span style={{ fontSize: 14, color: "rgba(244,241,234,0.40)" }}>one-time</span>
          </div>
          <p style={{ fontSize: 13, color: "rgba(244,241,234,0.40)", margin: "0 0 20px", lineHeight: 1.5 }}>
            Built from the answers you already gave. Instant delivery. No retake.
          </p>
          <a href={STRIPE_FULL_REPORT}
            style={{ display: "block", width: "100%", maxWidth: 360, margin: "0 auto 20px", height: 52, borderRadius: 10, backgroundColor: B.purple, color: "#FFFFFF", fontSize: 15, fontWeight: 600, textDecoration: "none", lineHeight: "52px", textAlign: "center" }}>
            Get Your Full Report →
          </a>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16, maxWidth: 360, margin: "0 auto" }}>
            <p style={{ fontSize: 12, color: "rgba(244,241,234,0.35)", margin: 0, lineHeight: 1.55 }}>
              If the report doesn&#8217;t reveal at least one insight you didn&#8217;t already know — full refund, no questions.
            </p>
          </div>
        </div>

        </>}

        {/* ── Footer ── */}
        <div style={{ textAlign: "center", paddingTop: 16, borderTop: `1px solid ${B.stone}` }}>
          <p style={{ fontSize: 11, color: B.taupe, margin: 0 }}>RunPayway&#8482; &middot; Model RP-2.0 &middot; Not financial advice.</p>
        </div>
      </div>
    </div>
  );
}
