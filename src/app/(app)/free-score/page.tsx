"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoBlue from "../../../../public/runpayway-logo-blue.png";
import { simulateScore, SIMULATOR_PRESETS } from "@/lib/engine/v2/simulate";
import type { CanonicalInput } from "@/lib/engine/v2/simulate";
import {
  C, T, mono, sans, sp, maxW, padX, cardStyle, ctaButton,
  bandColor as bandColorFn, bodySm, h2Style, h3Style,
} from "@/lib/design-tokens";

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

  useEffect(() => { const c = () => setMobile(window.innerWidth <= 768); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, []);

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
  const bColor = bandColorFn(score);
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
    <div style={{ minHeight: "100vh", backgroundColor: C.sand, fontFamily: sans }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: mobile ? `${sp(5)}px ${padX.mobile}px ${sp(7.5)}px` : `${sp(8)}px ${padX.desktop}px ${sp(10)}px` }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: mobile ? sp(4) : sp(6) }}>
          <Image src={logoBlue} alt="RunPayway" width={mobile ? 120 : 140} height={16} style={{ height: "auto", opacity: 0.8 }} />
        </div>

        {/* ── EMAIL GATE — capture before revealing score ── */}
        {!emailSubmitted && (
          <div style={{ ...cardStyle, padding: mobile ? `${sp(4)}px ${sp(3)}px` : `${sp(5)}px ${sp(5)}px`, textAlign: "center", marginBottom: sp(4) }}>
            <div style={{ ...T.label, fontSize: 11, color: C.light, marginBottom: sp(2) }}>YOUR SCORE IS READY</div>
            <div style={{ ...h3Style(mobile), color: C.navy, marginBottom: sp(1) }}>Enter your email to see your results</div>
            <p style={{ ...bodySm(mobile), color: C.muted, margin: `0 0 ${sp(3)}px` }}>We will send a copy of your score to this address. No spam.</p>
            <div style={{ display: "flex", gap: 8, maxWidth: 400, margin: "0 auto", flexDirection: mobile ? "column" : "row" }}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                onKeyDown={(e) => { if (e.key === "Enter" && email.includes("@")) setEmailSubmitted(true); }}
                style={{ flex: 1, padding: "13px 16px", fontSize: 15, fontFamily: sans, border: `1px solid ${C.border}`, borderRadius: 10, outline: "none", boxSizing: "border-box" as const, minHeight: 48 }} />
              <button onClick={() => { if (email.includes("@")) setEmailSubmitted(true); }}
                style={{ ...ctaButton, height: 48, padding: "0 24px", fontSize: 15, borderRadius: 10, cursor: email.includes("@") ? "pointer" : "not-allowed", opacity: email.includes("@") ? 1 : 0.5 }}>
                Reveal Score
              </button>
            </div>
            <button onClick={() => setEmailSubmitted(true)} style={{ marginTop: sp(2), background: "none", border: "none", cursor: "pointer", ...T.micro, color: C.light, textDecoration: "underline", textUnderlineOffset: 3 }}>
              Skip for now
            </button>
          </div>
        )}

        {/* ── SCORE CARD — matches report cover ── */}
        {emailSubmitted && <><div style={{ ...cardStyle, padding: mobile ? `${sp(4)}px ${sp(3)}px` : `${sp(5)}px ${sp(5)}px`, textAlign: "center", marginBottom: sp(4) }}>

          <div style={{ ...T.label, fontSize: 11, color: C.light, marginBottom: sp(2) }}>INCOME STABILITY SCORE&#8482;</div>

          {name && <div style={{ fontSize: 17, fontWeight: 500, color: C.navy, marginBottom: 4 }}>{name}</div>}
          <div style={{ fontSize: 12, color: C.light, marginBottom: sp(3) }}>Free Assessment &middot; Model RP-2.0</div>

          {/* Score ring */}
          <div style={{ position: "relative", width: mobile ? 140 : 170, height: mobile ? 140 : 170, margin: `0 auto ${sp(2)}px` }}>
            <svg width={mobile ? 140 : 170} height={mobile ? 140 : 170} style={{ transform: "rotate(-90deg)" }}>
              <circle cx={mobile ? 70 : 85} cy={mobile ? 70 : 85} r={mobile ? 58 : 70} fill="none" stroke={C.border} strokeWidth={mobile ? 8 : 10} />
              <circle cx={mobile ? 70 : 85} cy={mobile ? 70 : 85} r={mobile ? 58 : 70} fill="none" stroke={bColor} strokeWidth={mobile ? 8 : 10}
                strokeDasharray={2 * Math.PI * (mobile ? 58 : 70)} strokeDashoffset={2 * Math.PI * (mobile ? 58 : 70) - (animatedScore / 100) * 2 * Math.PI * (mobile ? 58 : 70)}
                strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.3s ease" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: mono, fontSize: mobile ? 40 : 48, fontWeight: 300, color: C.navy, letterSpacing: "-0.03em", lineHeight: 1 }}>{animatedScore}</span>
              <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 300, color: C.light }}>/100</span>
            </div>
          </div>

          {/* Band */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: bColor }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: bColor }}>{band}</span>
          </div>

          <div style={{ ...bodySm(mobile), color: C.light, marginBottom: 8 }}>{humanMessage}</div>

          {nextBandName && <div style={{ fontFamily: mono, fontSize: 13, color: C.teal, fontWeight: 600 }}>{gap} points to {nextBandName} Stability</div>}

          {peerPercentile !== null && (
            <div style={{ ...T.micro, color: C.muted, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
              {peerPercentile >= 50
                ? <span>You&#8217;re in the <span style={{ fontFamily: mono, fontWeight: 600 }}>{Math.round(peerPercentile)}th</span> percentile for {peerCluster}.</span>
                : <span><span style={{ fontFamily: mono, fontWeight: 600 }}>{Math.round(100 - peerPercentile)}%</span> of {peerCluster} professionals score higher.</span>}
            </div>
          )}
        </div>

        {/* ── ROOT CONSTRAINT — matches report key takeaway ── */}
        <div style={{ ...cardStyle, padding: mobile ? `${sp(2.5)}px ${sp(2.5)}px` : `${sp(3)}px ${sp(3.5)}px`, borderLeft: `3px solid ${C.purple}`, marginBottom: sp(3) }}>
          <div style={{ ...T.label, fontSize: 11, color: C.purple, marginBottom: sp(1) }}>YOUR PRIMARY CONSTRAINT</div>
          <p style={{ ...bodySm(mobile), color: C.navy, margin: `0 0 ${sp(1)}px`, fontWeight: 500 }}>{insightText}</p>
          <p style={{ ...T.micro, color: C.light, margin: 0, lineHeight: 1.5 }}>
            This is the single biggest factor holding your score down. The full report breaks down why, how it connects to your other structural factors, and what to do about it.
          </p>
        </div>

        {/* ── BEST MOVE PREVIEW — teaser only, no exact numbers ── */}
        {bestMove && (
          <div style={{ ...cardStyle, padding: mobile ? `${sp(2.5)}px ${sp(2.5)}px` : `${sp(3)}px ${sp(3.5)}px`, borderLeft: `3px solid ${C.teal}`, marginBottom: sp(3) }}>
            <div style={{ ...T.label, fontSize: 11, color: C.teal, marginBottom: sp(1) }}>YOUR HIGHEST-IMPACT MOVE</div>
            <p style={{ ...bodySm(mobile), color: C.navy, margin: `0 0 ${sp(1)}px`, fontWeight: 500 }}>
              We identified a single structural change that could meaningfully raise your score.
            </p>
            <p style={{ ...T.micro, color: C.light, margin: 0, lineHeight: 1.5 }}>
              The full report reveals exactly what it is, why it matters for your industry, and how to act on it — with two additional moves ranked by impact.
            </p>
          </div>
        )}

        {/* ── WHAT THE FULL REPORT TELLS YOU ── */}
        <div style={{ ...cardStyle, padding: mobile ? `${sp(3)}px ${sp(2.5)}px` : `${sp(3.5)}px ${sp(3.5)}px`, marginBottom: sp(4) }}>
          <div style={{ ...T.label, fontSize: 11, color: C.light, marginBottom: sp(2) }}>WHAT THE FULL REPORT TELLS YOU</div>
          {[
            "Where your income is structurally exposed — and why",
            "The 3 highest-impact moves to raise your score, ranked",
            "How your structure compares to others in your industry",
            "What happens to your score if your top source disappears",
            "A 12-week action roadmap built for your specific situation",
            "Scripts you can use in real conversations with clients",
          ].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.purple, flexShrink: 0, marginTop: 7 }} />
              <span style={{ ...T.meta, color: C.navy }}>{item}</span>
            </div>
          ))}
        </div>

        {/* ── CTA — clean, confident, guarantee inside ── */}
        <div style={{ padding: mobile ? `${sp(3.5)}px ${sp(3)}px` : `${sp(4)}px ${sp(4.5)}px`, borderRadius: 12, backgroundColor: C.navy, textAlign: "center", marginBottom: sp(3) }}>
          <div style={{ ...T.label, fontSize: 11, color: C.teal, marginBottom: sp(1.5) }}>FULL DIAGNOSTIC REPORT</div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontFamily: mono, fontSize: mobile ? 36 : 44, fontWeight: 300, color: C.sandText }}>$69</span>
            <span style={{ fontFamily: mono, ...T.meta, color: C.sandLight }}>one-time</span>
          </div>
          <p style={{ ...T.micro, color: C.sandLight, margin: `0 0 ${sp(2.5)}px`, lineHeight: 1.5 }}>
            Built from the answers you already gave. Instant delivery. No retake.
          </p>
          <a href={STRIPE_FULL_REPORT}
            style={{ display: "block", width: "100%", maxWidth: 360, margin: `0 auto ${sp(2.5)}px`, height: 52, borderRadius: 10, backgroundColor: C.purple, color: C.white, fontSize: 15, fontWeight: 600, textDecoration: "none", lineHeight: "52px", textAlign: "center" }}>
            Get Your Full Report →
          </a>
          <div style={{ borderTop: `1px solid ${C.sandBorder}`, paddingTop: sp(2), maxWidth: 360, margin: "0 auto" }}>
            <p style={{ fontSize: 12, color: C.sandLight, margin: 0, lineHeight: 1.55 }}>
              If the report doesn&#8217;t reveal at least one insight you didn&#8217;t already know — full refund, no questions.
            </p>
          </div>
        </div>

        </>}

        {/* ── Footer ── */}
        <div style={{ textAlign: "center", paddingTop: sp(2), borderTop: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 11, color: C.light, margin: 0 }}>RunPayway&#8482; &middot; Model RP-2.0 &middot; Not financial advice.</p>
        </div>
      </div>
    </div>
  );
}
