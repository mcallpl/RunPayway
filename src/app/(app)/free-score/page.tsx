"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoImg from "../../../../public/runpayway-logo.png";

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  bone: "#F8F6F1",
  muted: "rgba(14,26,43,0.58)",
  light: "rgba(14,26,43,0.42)",
  bandLimited: "#9B2C2C",
  bandDeveloping: "#92640A",
  bandEstablished: "#2B5EA7",
  bandHigh: "#1F6D7A",
};

const STRIPE_FULL_REPORT = "https://buy.stripe.com/14A28j48E2socZQa2Z2Nq02";

const DISPLAY_FONT = "'DM Serif Display', Georgia, serif";

/* ------------------------------------------------------------------ */
/*  Testimonial data (placeholder — replace with real quotes)          */
/* ------------------------------------------------------------------ */

const TESTIMONIALS = [
  { quote: "I had no idea 92% of my income depended on one client. The stress test was a wake-up call.", name: "Sarah M.", industry: "Real Estate", score: 28 },
  { quote: "The cross-factor breakdown showed me exactly why my score was being penalized. No other tool does that.", name: "James R.", industry: "Technology", score: 44 },
  { quote: "I shared the advisor guide with my accountant. She said it was more useful than most reports she sees.", name: "Priya K.", industry: "Consulting", score: 61 },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function FreeScorePage() {
  const router = useRouter();
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const scoreAnimated = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = sessionStorage.getItem("rp_record");
    if (!stored) { router.push("/diagnostic-portal"); return; }
    try {
      const parsed = JSON.parse(stored);
      if (!parsed || !parsed.record_id || typeof parsed.final_score !== "number") {
        router.push("/diagnostic-portal");
        return;
      }
      setRecord(parsed);
    } catch {
      router.push("/diagnostic-portal");
    }
  }, [router]);

  // Score animation
  useEffect(() => {
    if (!record || scoreAnimated.current) return;
    scoreAnimated.current = true;
    const target = record.final_score as number;
    const duration = 1500;
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
  const name = (record.assessment_title as string) || "Your income";
  const percentileLabel = record.peer_stability_percentile_label as string;
  const industrySector = ((record.industry_sector as string) || "").replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());

  const tier: "limited" | "developing" | "established" | "high" =
    score >= 75 ? "high" : score >= 50 ? "established" : score >= 30 ? "developing" : "limited";

  const bandColor = tier === "high" ? B.bandHigh : tier === "established" ? B.bandEstablished : tier === "developing" ? B.bandDeveloping : B.bandLimited;

  // V2 data for the one key insight
  const v2 = (record as Record<string, unknown>)._v2 as Record<string, unknown> | undefined;
  const v2Constraints = v2?.constraints as { root_constraint: string } | undefined;
  const v2Benchmarks = v2?.benchmarks as { cluster_average_score: number } | undefined;

  const constraintPlain: Record<string, string> = {
    high_concentration: "Too much of your income depends on one source.",
    weak_forward_visibility: "Not enough of your income is locked in ahead of time.",
    high_labor_dependence: "Too much of your income stops when you stop working.",
    low_persistence: "Not enough of your income repeats on its own.",
    low_source_diversity: "Your income comes from too few sources.",
    high_variability: "Your income swings too much month to month.",
  };
  const rootConstraint = v2Constraints?.root_constraint || "weak_forward_visibility";
  const insightText = constraintPlain[rootConstraint] || "Your income structure has room to improve.";

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');`}</style>
      <div style={{ minHeight: "100vh", backgroundColor: "#FAFAFA" }}>

        {/* ══ Score Hero ══ */}
        <section style={{ background: "linear-gradient(135deg, #0E1A2B 0%, #1A1540 40%, #4B3FAE 70%, #1F6D7A 100%)", paddingTop: 100, paddingBottom: 80, textAlign: "center" }}>
          <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>
            <Image src={logoImg} alt="RunPayway" width={140} height={16} style={{ height: "auto", filter: "brightness(10)", marginBottom: 40 }} />

            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: B.teal, marginBottom: 24 }}>
              Your Income Stability Score
            </div>

            <div style={{ fontSize: 96, fontWeight: 600, color: "#F4F1EA", lineHeight: 1, marginBottom: 16 }}>
              {animatedScore}
            </div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: bandColor }} />
              <span style={{ fontSize: 20, fontWeight: 500, color: bandColor }}>{band}</span>
            </div>

            {percentileLabel && (
              <div style={{ fontSize: 15, color: "rgba(244,241,234,0.60)", marginTop: 8 }}>
                {percentileLabel} percentile among {industrySector} professionals{v2Benchmarks ? ` (peer average: ${v2Benchmarks.cluster_average_score})` : ""}
              </div>
            )}
          </div>
        </section>

        {/* ══ Key Insight (the one free takeaway) ══ */}
        <section style={{ backgroundColor: "#FFFFFF", paddingTop: 56, paddingBottom: 56 }}>
          <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: B.teal, marginBottom: 16 }}>
              THE ONE THING HOLDING {name.toUpperCase()} BACK
            </div>
            <p style={{ fontSize: 18, fontWeight: 500, color: B.navy, lineHeight: 1.55, margin: "0 0 24px" }}>
              {insightText}
            </p>
            <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.65, margin: 0 }}>
              Your full report explains exactly why, shows how it interacts with your other structural factors, and gives you a step-by-step plan to fix it.
            </p>
          </div>
        </section>

        {/* ══ What You're Missing ══ */}
        <section style={{ backgroundColor: B.sand, paddingTop: 64, paddingBottom: 64 }}>
          <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>
            <h2 style={{ fontSize: 28, fontFamily: DISPLAY_FONT, fontWeight: 400, letterSpacing: "-0.02em", color: B.navy, textAlign: "center", marginBottom: 36 }}>
              What the full report reveals
            </h2>

            {[
              { title: "Score Breakdown", desc: "See exactly how Structure + Stability + Quality combine into your score." },
              { title: "6 Structural Indicators", desc: "Income persistence, source diversity, forward visibility, earnings stability, labor independence, concentration resilience — each scored." },
              { title: "Cross-Factor Effects", desc: "When two weak areas overlap, your score drops more. See exactly which penalties and bonuses apply to you." },
              { title: "Fragility Classification", desc: "Is your income Brittle, Thin, Uneven, Supported, or Resilient? Know how easily it could break." },
              { title: "Risk Scenarios", desc: "What happens if your biggest client leaves? If you can't work for 90 days? Each scenario scored." },
              { title: "Industry-Specific Action Plan", desc: "Not generic advice. Specific steps for your industry, income model, and operating structure." },
              { title: "Advisor Discussion Guide", desc: "Talking points and questions to share with your financial advisor, lender, or business partner." },
              { title: "Peer Comparison", desc: "Your score vs. actual peer averages in your industry — with numbers, not vague labels." },
            ].map((item, i) => (
              <div key={item.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 20, padding: "16px 20px", backgroundColor: "#FFFFFF", borderRadius: 10, border: "1px solid rgba(14,26,43,0.06)" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: i % 2 === 0 ? "rgba(75,63,174,0.08)" : "rgba(31,109,122,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: i % 2 === 0 ? B.purple : B.teal }} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: B.navy, marginBottom: 4 }}>{item.title}</div>
                  <p style={{ fontSize: 13, color: B.muted, lineHeight: 1.55, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ Testimonials ══ */}
        <section style={{ backgroundColor: "#FFFFFF", paddingTop: 64, paddingBottom: 64 }}>
          <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>
            <h2 style={{ fontSize: 24, fontFamily: DISPLAY_FONT, fontWeight: 400, letterSpacing: "-0.02em", color: B.navy, textAlign: "center", marginBottom: 32 }}>
              What customers say
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {TESTIMONIALS.map((t) => (
                <div key={t.name} style={{ padding: "20px 24px", backgroundColor: B.bone, borderRadius: 10, border: "1px solid rgba(14,26,43,0.06)" }}>
                  <p style={{ fontSize: 14, color: B.navy, lineHeight: 1.6, margin: "0 0 12px", fontStyle: "italic" }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ fontSize: 12, color: B.muted }}>
                    <strong>{t.name}</strong> &middot; {t.industry} &middot; Score: {t.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA — Upgrade to Full Report ══ */}
        <section style={{ backgroundColor: B.navy, paddingTop: 64, paddingBottom: 64, textAlign: "center" }}>
          <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: B.teal, marginBottom: 16 }}>
              FULL REPORT
            </div>
            <h2 style={{ fontSize: 32, fontFamily: DISPLAY_FONT, fontWeight: 400, letterSpacing: "-0.02em", color: "#F4F1EA", marginBottom: 12 }}>
              Get the full 5-page report
            </h2>
            <p style={{ fontSize: 16, color: "rgba(244,241,234,0.65)", lineHeight: 1.65, marginBottom: 8 }}>
              Your score is {score}. The full report shows you exactly why — and what to do about it.
            </p>

            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 8, marginBottom: 24 }}>
              <span style={{ fontSize: 48, fontWeight: 600, color: "#F4F1EA" }}>$99</span>
              <span style={{ fontSize: 15, color: "rgba(244,241,234,0.50)" }}>one-time</span>
            </div>

            <a
              href={STRIPE_FULL_REPORT}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 56,
                padding: "0 40px",
                borderRadius: 12,
                background: "linear-gradient(135deg, #F4F1EA 0%, #EDECEA 100%)",
                color: B.navy,
                fontSize: 16,
                fontWeight: 600,
                textDecoration: "none",
                letterSpacing: "-0.01em",
                boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
                transition: "transform 200ms ease, box-shadow 200ms ease",
              }}
            >
              Get Full Report — $99
            </a>

            <p style={{ fontSize: 13, color: "rgba(244,241,234,0.40)", marginTop: 16, lineHeight: 1.6 }}>
              If the report doesn&apos;t reveal at least one insight you didn&apos;t already know, email support@runpayway.com for a full refund.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
