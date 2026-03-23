"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoImg from "../../../../public/runpayway-logo.png";

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

function useMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return mobile;
}

/* ------------------------------------------------------------------ */
/*  Design tokens — strict scale (mirrors Coming Soon page)            */
/* ------------------------------------------------------------------ */

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  bone: "#F8F6F1",
  muted: "rgba(14,26,43,0.58)",
  light: "rgba(14,26,43,0.42)",
  border: "rgba(14,26,43,0.10)",
  borderLight: "rgba(14,26,43,0.06)",
  bandLimited: "#9B2C2C",
  bandDeveloping: "#92640A",
  bandEstablished: "#2B5EA7",
  bandHigh: "#1F6D7A",
};

// 7-step type scale: 11 · 13 · 15 · 17 · 20 · 32 · 72
const F = {
  label: { fontSize: 11, fontWeight: 700 as const, letterSpacing: "0.12em", textTransform: "uppercase" as const },
  small: { fontSize: 13, lineHeight: 1.55 },
  body: { fontSize: 15, lineHeight: 1.65 },
  lead: { fontSize: 17, lineHeight: 1.65 },
  h3: { fontSize: 20, fontWeight: 600 as const, lineHeight: 1.3 },
  h2: { fontSize: 32, fontWeight: 400 as const, letterSpacing: "-0.02em", lineHeight: 1.12 },
  score: { fontSize: 72, fontWeight: 600 as const, lineHeight: 1 },
};

const DISPLAY_FONT = "'DM Serif Display', Georgia, serif";

const SP = {
  section: { desktop: 96, mobile: 64 },
  maxW: 600,
  pad: { desktop: 40, mobile: 24 },
  cardPad: { desktop: "20px 24px", mobile: "16px 20px" },
  cardRadius: 10,
  gap: 16,
};

const STRIPE_FULL_REPORT = "https://buy.stripe.com/7sY8wHeNid726Bs8YV2Nq04";

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
  const mobile = useMobile();
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const scoreAnimated = useRef(false);

  const pad = mobile ? SP.pad.mobile : SP.pad.desktop;

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = sessionStorage.getItem("rp_record");
    if (!stored) { router.push("/diagnostic-portal"); return; }
    try {
      const parsed = JSON.parse(stored);
      if (!parsed || !parsed.record_id || typeof parsed.final_score !== "number") {
        router.push("/diagnostic-portal"); return;
      }
      setRecord(parsed);
    } catch { router.push("/diagnostic-portal"); }
  }, [router]);

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

  const [downloading, setDownloading] = useState(false);

  const v2 = (record as Record<string, unknown>)._v2 as Record<string, unknown> | undefined;
  const v2Constraints = v2?.constraints as { root_constraint: string } | undefined;
  const v2Benchmarks = v2?.benchmarks as { cluster_average_score: number } | undefined;
  const v2Scores = v2?.scores as { structure_score: number; stability_score: number; quality_adjustment: number } | undefined;

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

  const features = [
    { title: "Score Breakdown", desc: "See exactly how Structure + Stability + Quality combine into your score." },
    { title: "6 Structural Indicators", desc: "Each dimension scored out of 100 with a progress bar and level." },
    { title: "Cross-Factor Effects", desc: "See exactly which penalties and bonuses apply — and how many points each costs." },
    { title: "Fragility Classification", desc: "Brittle, Thin, Uneven, Supported, or Resilient. Know how easily your income could break." },
    { title: "Risk Scenarios", desc: "What happens if your biggest client leaves? If you can't work for 90 days? Each scenario scored." },
    { title: "Industry-Specific Action Plan", desc: "Specific steps for your industry, income model, and operating structure." },
    { title: "Advisor Discussion Guide", desc: "Talking points to share with your financial advisor, lender, or business partner." },
    { title: "Peer Comparison", desc: "Your score vs. actual peer averages — with numbers, not vague labels." },
  ];

  const issuedDate = ((record.issued_timestamp_utc as string) || (record.assessment_date_utc as string) || "").split("T")[0];
  const recordId = ((record.record_id as string) || "").slice(0, 8);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const el = document.getElementById("free-score-card");
      if (!el) return;

      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false, width: 816, height: el.scrollHeight, windowWidth: 816 });

      const pdf = new jsPDF({ orientation: "portrait", unit: "in", format: "letter" });
      pdf.setProperties({ title: `Income Stability Score Card — ${name}`, author: "RunPayway", subject: "Income Stability Score Card" });

      const imgW = 7.06;
      const imgH = (canvas.height / canvas.width) * imgW;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0.72, 0.72, imgW, imgH);

      pdf.save(`RunPayway-Score-Card-${recordId}.pdf`);
    } catch {
      alert("PDF generation failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');`}</style>

      {/* Hidden score card for PDF capture */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div id="free-score-card" style={{ width: 816, padding: 48, backgroundColor: "#FFFFFF", fontFamily: "Inter, -apple-system, sans-serif", boxSizing: "border-box" }}>
          {/* Top accent bar */}
          <div style={{ height: 3, background: "linear-gradient(90deg, #4B3FAE 0%, #1F6D7A 100%)", marginBottom: 32 }} />

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 4 }}>INCOME STABILITY SCORE™</div>
              <div style={{ fontSize: 10, color: "rgba(14,26,43,0.42)" }}>Model RP-2.0</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: "rgba(14,26,43,0.42)" }}>Score Card</div>
              <div style={{ fontSize: 10, color: "rgba(14,26,43,0.42)" }}>{issuedDate}</div>
            </div>
          </div>

          {/* Score */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 80, fontWeight: 600, color: B.navy, lineHeight: 1 }}>{score}</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: bandColor }} />
              <span style={{ fontSize: 18, fontWeight: 500, color: bandColor }}>{band}</span>
            </div>
            {percentileLabel && (
              <div style={{ fontSize: 13, color: "rgba(14,26,43,0.50)", marginTop: 8 }}>
                {percentileLabel} percentile among {industrySector} professionals{v2Benchmarks ? ` (peer average: ${v2Benchmarks.cluster_average_score})` : ""}
              </div>
            )}
          </div>

          {/* Score breakdown */}
          {v2Scores && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32, padding: "14px 20px", backgroundColor: "#F8F6F1", borderRadius: 6, justifyContent: "center" }}>
              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(14,26,43,0.42)", marginBottom: 4 }}>STRUCTURE</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: B.navy }}>{v2Scores.structure_score}</div>
              </div>
              <span style={{ fontSize: 12, color: "rgba(14,26,43,0.30)" }}>+</span>
              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(14,26,43,0.42)", marginBottom: 4 }}>STABILITY</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: B.navy }}>{v2Scores.stability_score}</div>
              </div>
              <span style={{ fontSize: 12, color: "rgba(14,26,43,0.30)" }}>{v2Scores.quality_adjustment >= 0 ? "+" : "−"}</span>
              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(14,26,43,0.42)", marginBottom: 4 }}>QUALITY</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: v2Scores.quality_adjustment < 0 ? B.bandLimited : B.teal }}>{Math.abs(v2Scores.quality_adjustment)}</div>
              </div>
              <span style={{ fontSize: 12, color: "rgba(14,26,43,0.30)" }}>=</span>
              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(14,26,43,0.42)", marginBottom: 4 }}>SCORE</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: B.navy }}>{score}</div>
              </div>
            </div>
          )}

          {/* Band scale */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(14,26,43,0.42)", marginBottom: 8 }}>WHERE YOU LAND</div>
            <div style={{ display: "flex", gap: 2, height: 8, marginBottom: 8 }}>
              {[
                { w: 30, color: B.bandLimited, t: "limited" },
                { w: 20, color: B.bandDeveloping, t: "developing" },
                { w: 25, color: B.bandEstablished, t: "established" },
                { w: 25, color: B.bandHigh, t: "high" },
              ].map((seg, i) => (
                <div key={i} style={{ width: `${seg.w}%`, backgroundColor: seg.color, borderRadius: i === 0 ? "3px 0 0 3px" : i === 3 ? "0 3px 3px 0" : 0, opacity: tier === seg.t ? 1 : 0.25 }} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 2 }}>
              {[
                { range: "0–29", label: "Limited", color: B.bandLimited, t: "limited" },
                { range: "30–49", label: "Developing", color: B.bandDeveloping, t: "developing" },
                { range: "50–74", label: "Established", color: B.bandEstablished, t: "established" },
                { range: "75–100", label: "High", color: B.bandHigh, t: "high" },
              ].map((b) => (
                <div key={b.range} style={{ flex: 1, opacity: tier === b.t ? 1 : 0.5 }}>
                  <div style={{ fontSize: 9, fontWeight: tier === b.t ? 700 : 500, color: b.color }}>{b.range}</div>
                  <div style={{ fontSize: 9, color: tier === b.t ? B.navy : "rgba(14,26,43,0.42)", fontWeight: tier === b.t ? 600 : 400 }}>{b.label} Stability</div>
                </div>
              ))}
            </div>
          </div>

          {/* Key insight */}
          <div style={{ backgroundColor: "#F8F6F1", borderLeft: `3px solid ${B.purple}`, borderRadius: 4, padding: "16px 20px", marginBottom: 32 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: B.teal, marginBottom: 6 }}>KEY INSIGHT</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: B.navy, lineHeight: 1.5 }}>{insightText}</div>
          </div>

          {/* Metadata */}
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 20, borderTop: "1px solid rgba(14,26,43,0.08)", marginBottom: 24 }}>
            {[["Prepared for", name], ["Industry", industrySector], ["Date", issuedDate], ["Record ID", recordId]].map(([l, v]) => (
              <div key={l}>
                <div style={{ fontSize: 9, color: "rgba(14,26,43,0.42)" }}>{l}</div>
                <div style={{ fontSize: 10, fontWeight: 500, color: B.navy }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Upgrade CTA */}
          <div style={{ textAlign: "center", padding: "20px 24px", backgroundColor: B.navy, borderRadius: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#F4F1EA", marginBottom: 4 }}>Get the full 5-page report — $99</div>
            <div style={{ fontSize: 11, color: "rgba(244,241,234,0.50)" }}>Structural indicators, risk scenarios, cross-factor effects, action plan, and advisor guide.</div>
          </div>

          {/* Disclaimer */}
          <div style={{ marginTop: 20, fontSize: 9, color: "rgba(14,26,43,0.30)", textAlign: "center", lineHeight: 1.5 }}>
            The Income Stability Score™ is a present-state assessment based on information provided by the user. It does not provide financial advice and does not predict future outcomes. RunPayway™ Model RP-2.0.
          </div>
        </div>
      </div>

      <div style={{ minHeight: "100vh", backgroundColor: "#FAFAFA" }}>

        {/* ══ Score Hero ══ */}
        <section style={{ background: "linear-gradient(135deg, #0E1A2B 0%, #1A1540 40%, #4B3FAE 70%, #1F6D7A 100%)", paddingTop: mobile ? 80 : 120, paddingBottom: mobile ? SP.section.mobile : SP.section.desktop, textAlign: "center" }}>
          <div style={{ maxWidth: SP.maxW, margin: "0 auto", padding: `0 ${pad}px` }}>
            <Image src={logoImg} alt="RunPayway" width={mobile ? 120 : 140} height={16} style={{ height: "auto", filter: "brightness(10)", marginBottom: mobile ? 32 : 40 }} />

            <div style={{ ...F.label, color: B.teal, marginBottom: 24 }}>Your Income Stability Score™</div>

            <div style={{ ...F.score, fontSize: mobile ? 64 : 72, color: "#F4F1EA", marginBottom: 16 }}>{animatedScore}</div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: bandColor }} />
              <span style={{ ...F.h3, fontSize: mobile ? 18 : 20, color: bandColor }}>{band}</span>
            </div>

            {percentileLabel && (
              <div style={{ ...F.body, color: "rgba(244,241,234,0.60)", marginTop: 8 }}>
                {percentileLabel} percentile among {industrySector} professionals{v2Benchmarks ? ` (peer average: ${v2Benchmarks.cluster_average_score})` : ""}
              </div>
            )}

            {/* Download score card */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              style={{
                marginTop: 28,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 40,
                padding: "0 24px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(244,241,234,0.70)",
                ...F.small,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 200ms ease, border-color 200ms ease",
                opacity: downloading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.10)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
            >
              {downloading ? "Generating..." : "Download Score Card (PDF)"}
            </button>
          </div>
        </section>

        {/* ══ Key Insight ══ */}
        <section style={{ backgroundColor: "#FFFFFF", paddingTop: mobile ? SP.section.mobile : SP.section.desktop, paddingBottom: mobile ? SP.section.mobile : SP.section.desktop }}>
          <div style={{ maxWidth: SP.maxW, margin: "0 auto", padding: `0 ${pad}px`, textAlign: "center" }}>
            <div style={{ ...F.label, color: B.teal, marginBottom: 16 }}>
              THE ONE THING HOLDING {name.toUpperCase()} BACK
            </div>
            <p style={{ ...F.lead, fontSize: mobile ? 16 : 17, fontWeight: 500, color: B.navy, margin: "0 0 24px" }}>
              {insightText}
            </p>
            <p style={{ ...F.body, color: B.muted, margin: 0 }}>
              Your full report explains exactly why, shows how it interacts with your other structural factors, and gives you a step-by-step plan to fix it.
            </p>
          </div>
        </section>

        {/* ══ What the Full Report Reveals ══ */}
        <section style={{ backgroundColor: B.sand, paddingTop: mobile ? SP.section.mobile : SP.section.desktop, paddingBottom: mobile ? SP.section.mobile : SP.section.desktop }}>
          <div style={{ maxWidth: SP.maxW, margin: "0 auto", padding: `0 ${pad}px` }}>
            <h2 style={{ ...F.h2, fontSize: mobile ? 24 : 32, fontFamily: DISPLAY_FONT, color: B.navy, textAlign: "center", marginBottom: 40 }}>
              What the full report reveals
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: SP.gap }}>
              {features.map((item, i) => (
                <FeatureCard key={item.title} title={item.title} desc={item.desc} index={i} mobile={mobile} />
              ))}
            </div>
          </div>
        </section>

        {/* ══ Testimonials ══ */}
        <section style={{ backgroundColor: "#FFFFFF", paddingTop: mobile ? SP.section.mobile : SP.section.desktop, paddingBottom: mobile ? SP.section.mobile : SP.section.desktop }}>
          <div style={{ maxWidth: SP.maxW, margin: "0 auto", padding: `0 ${pad}px` }}>
            <h2 style={{ ...F.h2, fontSize: mobile ? 22 : 28, fontFamily: DISPLAY_FONT, color: B.navy, textAlign: "center", marginBottom: 32 }}>
              What customers say
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: SP.gap }}>
              {TESTIMONIALS.map((t) => (
                <div key={t.name} style={{ padding: mobile ? SP.cardPad.mobile : SP.cardPad.desktop, backgroundColor: B.bone, borderRadius: SP.cardRadius, border: `1px solid ${B.borderLight}` }}>
                  <p style={{ ...F.body, color: B.navy, margin: "0 0 12px", fontStyle: "italic" }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ ...F.small, color: B.muted }}>
                    <strong>{t.name}</strong> &middot; {t.industry} &middot; Score: {t.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA — Upgrade ══ */}
        <section style={{ backgroundColor: B.navy, paddingTop: mobile ? SP.section.mobile : SP.section.desktop, paddingBottom: mobile ? SP.section.mobile : SP.section.desktop, textAlign: "center" }}>
          <div style={{ maxWidth: 520, margin: "0 auto", padding: `0 ${pad}px` }}>
            <div style={{ ...F.label, color: B.teal, marginBottom: 16 }}>FULL REPORT</div>
            <h2 style={{ ...F.h2, fontSize: mobile ? 24 : 32, fontFamily: DISPLAY_FONT, color: "#F4F1EA", marginBottom: 12 }}>
              Get the full 5-page report
            </h2>
            <p style={{ ...F.body, color: "rgba(244,241,234,0.65)", marginBottom: 8 }}>
              Your score is {score}. The full report shows you exactly why — and what to do about it.
            </p>

            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 8, marginBottom: 32 }}>
              <span style={{ fontSize: mobile ? 40 : 48, fontWeight: 600, color: "#F4F1EA" }}>$99</span>
              <span style={{ ...F.body, color: "rgba(244,241,234,0.50)" }}>one-time</span>
            </div>

            <a
              href={STRIPE_FULL_REPORT}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: mobile ? 52 : 56,
                padding: "0 40px",
                borderRadius: 12,
                background: "linear-gradient(135deg, #F4F1EA 0%, #EDECEA 100%)",
                color: B.navy,
                ...F.body,
                fontWeight: 600,
                textDecoration: "none",
                letterSpacing: "-0.01em",
                boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
                transition: "transform 200ms ease, box-shadow 200ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.30)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.25)"; }}
            >
              Get Full Report — $99
            </a>

            <p style={{ ...F.small, color: "rgba(244,241,234,0.40)", marginTop: 20 }}>
              If the report doesn&apos;t reveal at least one insight you didn&apos;t already know, email support@runpayway.com for a full refund.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  FeatureCard — with hover state                                     */
/* ------------------------------------------------------------------ */

function FeatureCard({ title, desc, index, mobile }: { title: string; desc: string; index: number; mobile: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
        padding: mobile ? SP.cardPad.mobile : SP.cardPad.desktop,
        backgroundColor: "#FFFFFF",
        borderRadius: SP.cardRadius,
        border: `1px solid ${B.borderLight}`,
        boxShadow: hovered ? "0 8px 24px rgba(14,26,43,0.06)" : "none",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "box-shadow 200ms ease, transform 200ms ease",
      }}
    >
      <div style={{ width: 28, height: 28, borderRadius: 8, background: index % 2 === 0 ? "rgba(75,63,174,0.08)" : "rgba(31,109,122,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: index % 2 === 0 ? B.purple : B.teal }} />
      </div>
      <div>
        <div style={{ ...F.body, fontWeight: 600, color: B.navy, marginBottom: 4 }}>{title}</div>
        <p style={{ ...F.small, color: B.muted, margin: 0 }}>{desc}</p>
      </div>
    </div>
  );
}
