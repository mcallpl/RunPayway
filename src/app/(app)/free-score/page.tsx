"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { bandColor as bandColorFn } from "@/lib/design-tokens";
import EmailCapture from "@/components/EmailCapture";

/* ================================================================== */
/* DESIGN SYSTEM                                                       */
/* ================================================================== */

const C = {
  navy: "#1C1635",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  white: "#FFFFFF",
  border: "rgba(14,26,43,0.08)",
};

const sans = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const muted = "rgba(14,26,43,0.62)";
const light = "rgba(14,26,43,0.40)";

const STRIPE = "https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05";

/* ================================================================== */
/* COPY BY BAND                                                        */
/* ================================================================== */

const CLASS_DESCRIPTIONS: Record<string, string> = {
  "Limited Stability":
    "One disruption could seriously impact your income.",
  "Developing Stability":
    "Your income isn't protected yet.",
  "Established Stability":
    "You're stable — but there's room to strengthen.",
  "High Stability":
    "Your structure holds up well under pressure.",
};

const UPGRADE_HEADLINES: Record<string, string> = {
  "Limited Stability": "See exactly why — before disruption hits.",
  "Developing Stability": "Find what to fix first.",
  "Established Stability": "Discover your strongest leverage points.",
  "High Stability": "Know what's protecting you.",
};

/* ================================================================== */
/* MAIN                                                                */
/* ================================================================== */

export default function FreeScorePage() {
  const router = useRouter();
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const c = () => setMobile(window.innerWidth <= 768);
    c();
    window.addEventListener("resize", c);
    return () => window.removeEventListener("resize", c);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    let stored = sessionStorage.getItem("rp_record");
    if (!stored) {
      stored = localStorage.getItem("rp_record");
      if (stored) sessionStorage.setItem("rp_record", stored);
    }
    if (!stored) { router.push("/diagnostic-portal"); return; }
    try {
      const parsed = JSON.parse(stored);
      if (!parsed || !parsed.record_id || typeof parsed.final_score !== "number") {
        router.push("/diagnostic-portal");
        return;
      }
      setRecord(parsed);
    } catch { router.push("/diagnostic-portal"); }
  }, [router]);

  if (!record) return null;

  const band = record.stability_band as string;
  const score = record.final_score as number;
  const bColor = bandColorFn(score);
  const classDesc = CLASS_DESCRIPTIONS[band] || "Your income structure has been evaluated.";
  const upgradeHeadline = UPGRADE_HEADLINES[band] || "Your structure has room to improve.";

  const secPad = mobile ? 32 : 48;
  const cardPad = mobile ? "28px 24px" : "40px 44px";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.sand, fontFamily: sans }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: mobile ? "40px 28px 64px" : "72px 24px 96px" }}>

        {/* ── STABILITY CLASS REVEAL ── */}
        <section style={{
          backgroundColor: C.white, borderRadius: 20, padding: cardPad,
          border: `1px solid ${C.border}`,
          textAlign: "center",
          marginBottom: secPad,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.10em",
            textTransform: "uppercase" as const, color: light, marginBottom: 32,
          }}>
            Your Income Stability Class™
          </div>

          {/* Class badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            backgroundColor: `${bColor}14`,
            border: `1px solid ${bColor}35`,
            borderRadius: 100,
            padding: "10px 24px",
            marginBottom: 24,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: bColor, flexShrink: 0 }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: bColor, letterSpacing: "0.01em" }}>{band}</span>
          </div>

          <p style={{
            fontSize: mobile ? 15 : 16, color: muted, lineHeight: 1.7,
            maxWidth: 380, margin: "0 auto 28px",
          }}>
            {classDesc}
          </p>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
            <p style={{ fontSize: 12, color: light, margin: 0 }}>
              RunPayway™ &middot; Model RP-2.0 &middot; Deterministic scoring
            </p>
          </div>
        </section>

        {/* ── FULL REPORT UPGRADE ── */}
        <section style={{
          backgroundColor: C.navy, borderRadius: 20,
          padding: mobile ? "32px 24px" : "44px 44px",
          textAlign: "center",
          marginBottom: secPad,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.10em",
            textTransform: "uppercase" as const, color: C.teal, marginBottom: 16,
          }}>
            Full Report &mdash; $69
          </div>
          <div style={{
            fontSize: mobile ? 20 : 24, fontWeight: 700, color: C.sand,
            marginBottom: 12, lineHeight: 1.25, letterSpacing: "-0.02em",
          }}>
            {upgradeHeadline}
          </div>
          <p style={{
            fontSize: 15, color: "rgba(244,241,234,0.60)",
            lineHeight: 1.65, marginBottom: 32, maxWidth: 380, margin: "0 auto 32px",
          }}>
            You've got your stability class. Now unlock what's limiting it and what moves it.
          </p>

          <div style={{
            fontSize: 13, fontWeight: 600, color: C.teal, marginBottom: 20,
            paddingBottom: 20, borderBottom: "1px solid rgba(31,109,122,0.30)",
          }}>
            You'll unlock:
          </div>

          <div style={{
            display: "flex", flexDirection: "column" as const, gap: 12,
            textAlign: "left", maxWidth: 340, margin: "0 auto 36px",
          }}>
            {[
              "Exact score (0–100)",
              "Your top constraint — ranked by impact",
              "Stress test: What if your largest source disappeared",
              "Targeted 12-week action plan",
              "Ready-to-use scripts for income conversations",
              "Lifetime dashboard with scenario simulator",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{
                  width: 5, height: 5, borderRadius: "50%",
                  backgroundColor: C.teal, flexShrink: 0, marginTop: 8,
                }} />
                <span style={{ fontSize: 14, color: "rgba(244,241,234,0.65)", lineHeight: 1.55 }}>
                  {item}
                </span>
              </div>
            ))}
          </div>

          <a
            href={STRIPE}
            style={{
              display: "block", width: "100%", maxWidth: 340, margin: "0 auto 16px",
              height: 54, borderRadius: 12,
              backgroundColor: C.purple, color: C.white,
              fontSize: 16, fontWeight: 600, textDecoration: "none",
              lineHeight: "54px", textAlign: "center" as const,
              transition: "background-color 200ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#3d32a0"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.purple; }}
          >
            Get Your Full Report &mdash; $69
          </a>
          <p style={{ fontSize: 13, color: "rgba(31,109,122,0.75)", margin: 0 }}>
            If it doesn&#8217;t reveal something new, full refund.
          </p>
        </section>

        {/* ── EMAIL CAPTURE (secondary CTA) ── */}
        <section style={{
          backgroundColor: "rgba(31,109,122,0.06)", borderRadius: 16,
          padding: mobile ? "28px 24px" : "32px 36px",
          border: `1px solid ${C.teal}20`,
          marginBottom: secPad, textAlign: "center",
        }}>
          <div style={{
            fontSize: 12, fontWeight: 600, color: C.navy,
            marginBottom: 16, lineHeight: 1.3,
          }}>
            Not ready to upgrade?
          </div>
          <p style={{
            fontSize: 13, color: "rgba(14,26,43,0.60)",
            lineHeight: 1.5, marginBottom: 20,
          }}>
            Get income stability insights delivered to your inbox. We'll send you practical tips based on your stability class.
          </p>
          <div style={{ padding: mobile ? "16px 0" : "16px 0" }}>
            <EmailCapture variant="inline" source="free_score_page" />
          </div>
        </section>

        {/* Footer */}
        <div style={{ textAlign: "center", paddingTop: 24, borderTop: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 11, color: light, margin: 0 }}>
            RunPayway™ &middot; Model RP-2.0 &middot; Not financial advice.
          </p>
        </div>

      </div>
    </div>
  );
}
