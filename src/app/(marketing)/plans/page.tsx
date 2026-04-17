import type { Metadata } from "next";
import Link from "next/link";
import { C, sans } from "@/lib/design-tokens";

export const metadata: Metadata = {
  title: "Plans — RunPayway™",
  description:
    "RunPayway™ plans for individuals, advisors, and organizations. Find the right option for how you earn or how you work.",
};

export default function PlansPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.white, fontFamily: sans }}>
      <style>{`
        .plans-card {
          transition: box-shadow 220ms ease, transform 220ms ease;
        }
        .plans-card:hover {
          box-shadow: 0 12px 40px rgba(14,26,43,0.12);
          transform: translateY(-3px);
        }
        .plans-card-cta {
          transition: opacity 200ms ease;
        }
        .plans-card-cta:hover {
          opacity: 0.86;
        }

        /* ── iPad landscape (≤1024px): tighten outer padding ── */
        @media (max-width: 1024px) {
          .plans-hero    { padding-left: 32px !important; padding-right: 32px !important; }
          .plans-cards   { padding-left: 24px !important; padding-right: 24px !important; }
          .plans-faq     { padding-left: 32px !important; padding-right: 32px !important; }
        }

        /* ── iPad portrait (≤860px): stack cards, center column ── */
        @media (max-width: 860px) {
          .plans-grid {
            flex-direction: column !important;
            max-width: 520px !important;
            width: 100% !important;
            margin-left: auto !important;
            margin-right: auto !important;
            margin-top: -28px !important;
          }
        }

        /* ── Mobile (≤600px): full-width cards, compact padding ── */
        @media (max-width: 600px) {
          .plans-hero {
            padding-left: 20px !important;
            padding-right: 20px !important;
            padding-top: 64px !important;
            padding-bottom: 56px !important;
          }
          .plans-cards {
            padding-left: 16px !important;
            padding-right: 16px !important;
            padding-bottom: 56px !important;
          }
          .plans-grid {
            max-width: 100% !important;
            gap: 14px !important;
            margin-top: -18px !important;
          }
          .plans-card-body {
            padding: 24px 20px 22px !important;
          }
          .plans-faq {
            padding-left: 20px !important;
            padding-right: 20px !important;
            padding-top: 40px !important;
            padding-bottom: 48px !important;
          }
        }
      `}</style>

      {/* ── Hero ── */}
      <section
        className="plans-hero"
        style={{
          backgroundColor: C.navy,
          paddingTop: 100,
          paddingBottom: 88,
          paddingLeft: 48,
          paddingRight: 48,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${C.teal}, ${C.purple})`,
          }}
        />

        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 16px",
              borderRadius: 100,
              backgroundColor: "rgba(31,109,122,0.15)",
              marginBottom: 24,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: C.teal }}>
              PLANS
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(26px, 5vw, 46px)",
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: C.sandText,
              marginBottom: 18,
            }}
          >
            Who are you here as?
          </h1>

          <p
            style={{
              fontSize: "clamp(15px, 2.2vw, 18px)",
              fontWeight: 400,
              lineHeight: 1.65,
              color: C.sandMuted,
              maxWidth: 460,
              margin: "0 auto",
            }}
          >
            RunPayway™ works differently depending on how you use it.
            Pick the option that fits how you earn — or how you work.
          </p>
        </div>
      </section>

      {/* ── Cards ── */}
      <section
        className="plans-cards"
        style={{
          backgroundColor: C.white,
          paddingTop: 0,
          paddingBottom: 96,
          paddingLeft: 48,
          paddingRight: 48,
        }}
      >
        <div
          className="plans-grid"
          style={{
            maxWidth: 1020,
            margin: "0 auto",
            display: "flex",
            gap: 22,
            alignItems: "stretch",
            marginTop: -48,
          }}
        >

          {/* ── Individual ── */}
          <div
            className="plans-card plans-card-body"
            style={{
              flex: 1,
              backgroundColor: C.white,
              borderRadius: 20,
              border: `1px solid ${C.borderSoft}`,
              boxShadow: "0 8px 32px rgba(14,26,43,0.07)",
              padding: "36px 32px 32px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, marginBottom: 14 }}>
              FOR INDIVIDUALS
            </div>

            <div style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, lineHeight: 1.2, marginBottom: 10 }}>
              Your Income Stability Score
            </div>

            <p style={{ fontSize: 15, lineHeight: 1.6, color: C.textSecondary, marginBottom: 24, flex: 1 }}>
              Six questions. Under two minutes. Your score, what&apos;s at risk,
              and a 12-week plan built for your specific income structure.
            </p>

            <div style={{ borderTop: `1px solid ${C.borderSoft}`, paddingTop: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: "0.08em", marginBottom: 12 }}>
                WHAT YOU GET
              </div>
              {[
                "Income Stability Score (0–100)",
                "6-dimension breakdown with band",
                "Ranked constraints — what's holding you back",
                "12-week action plan for your industry",
                "Advisor & lender scripts",
                "Full PDF report + dashboard",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 9 }}>
                  <span style={{
                    width: 16, height: 16, borderRadius: "50%",
                    backgroundColor: "rgba(31,109,122,0.10)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: 1,
                  }}>
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5.5L4 7.5L8 3" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.45 }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 36, fontWeight: 700, color: C.textPrimary, letterSpacing: "-0.03em" }}>$69</span>
              <span style={{ fontSize: 14, color: C.textMuted, marginLeft: 6 }}>one-time &middot; instant</span>
            </div>

            <Link href="/pricing" className="plans-card-cta" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: 50, borderRadius: 12,
              backgroundColor: C.teal, color: C.white,
              fontSize: 15, fontWeight: 600, textDecoration: "none",
            }}>
              See Individual Plans &rarr;
            </Link>
          </div>

          {/* ── Advisors ── */}
          <div
            className="plans-card plans-card-body"
            style={{
              flex: 1,
              backgroundColor: C.navy,
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 8px 32px rgba(14,26,43,0.18)",
              padding: "36px 32px 32px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 3,
              background: `linear-gradient(90deg, ${C.teal}, ${C.purple})`,
            }} />

            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, marginBottom: 14 }}>
              FOR ADVISORS
            </div>

            <div style={{ fontSize: 22, fontWeight: 700, color: C.sandText, lineHeight: 1.2, marginBottom: 10 }}>
              Income Intelligence for Your Clients
            </div>

            <p style={{ fontSize: 15, lineHeight: 1.6, color: C.sandMuted, marginBottom: 24, flex: 1 }}>
              Run assessments on behalf of clients, receive structured income
              data, and access white-label report delivery — all from a single
              advisor portal.
            </p>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(244,241,234,0.30)", letterSpacing: "0.08em", marginBottom: 12 }}>
                WHAT YOU GET
              </div>
              {[
                "Per-report pricing — no seat fees",
                "Run assessments on behalf of clients",
                "Structured income data export",
                "White-label PDF delivery",
                "Client dashboard access",
                "Volume discounts available",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 9 }}>
                  <span style={{
                    width: 16, height: 16, borderRadius: "50%",
                    backgroundColor: "rgba(31,109,122,0.18)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: 1,
                  }}>
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5.5L4 7.5L8 3" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span style={{ fontSize: 14, color: C.sandMuted, lineHeight: 1.45 }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 36, fontWeight: 700, color: C.sandText, letterSpacing: "-0.03em" }}>$15–25</span>
              <span style={{ fontSize: 14, color: C.sandMuted, marginLeft: 6 }}>per report &middot; volume pricing</span>
            </div>

            <Link href="/advisor-portal" className="plans-card-cta" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: 50, borderRadius: 12,
              backgroundColor: C.teal, color: C.white,
              fontSize: 15, fontWeight: 600, textDecoration: "none",
            }}>
              See Advisor Plans &rarr;
            </Link>
          </div>

          {/* ── Organizations ── */}
          <div
            className="plans-card plans-card-body"
            style={{
              flex: 1,
              backgroundColor: C.panelFill,
              borderRadius: 20,
              border: `1px solid ${C.borderSoft}`,
              boxShadow: "0 8px 32px rgba(14,26,43,0.04)",
              padding: "36px 32px 32px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: C.purple, marginBottom: 14 }}>
              FOR ORGANIZATIONS
            </div>

            <div style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, lineHeight: 1.2, marginBottom: 10 }}>
              Enterprise &amp; Workforce Access
            </div>

            <p style={{ fontSize: 15, lineHeight: 1.6, color: C.textSecondary, marginBottom: 24, flex: 1 }}>
              Organization-wide income intelligence is in development.
              Register your interest and we&apos;ll brief you when enterprise
              access is ready.
            </p>

            <div style={{ borderTop: `1px solid ${C.borderSoft}`, paddingTop: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: "0.08em", marginBottom: 12 }}>
                PLANNED CAPABILITIES
              </div>
              {[
                "Bulk assessment deployment",
                "Team-level income analytics",
                "HR & benefits integration",
                "Custom scoring baselines",
                "Dedicated account support",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 9 }}>
                  <span style={{
                    width: 16, height: 16, borderRadius: "50%",
                    backgroundColor: "rgba(75,63,174,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: 1,
                  }}>
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5.5L4 7.5L8 3" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.45 }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: C.textMuted, letterSpacing: "-0.01em" }}>
                Pricing in development
              </span>
            </div>

            <Link href="/organizations" className="plans-card-cta" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: 50, borderRadius: 12,
              backgroundColor: "transparent", color: C.purple,
              fontSize: 15, fontWeight: 600, textDecoration: "none",
              border: `1.5px solid ${C.purple}`,
            }}>
              Register Interest &rarr;
            </Link>
          </div>

        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        className="plans-faq"
        style={{
          backgroundColor: C.panelFill,
          borderTop: `1px solid ${C.borderSoft}`,
          paddingTop: 56,
          paddingBottom: 64,
          paddingLeft: 48,
          paddingRight: 48,
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary, marginBottom: 28, letterSpacing: "-0.02em" }}>
            Common questions
          </h2>

          {[
            {
              q: "I'm an individual — can I still share my report with an advisor?",
              a: "Yes. Your PDF report is yours to share. Advisors can also run assessments through their own portal if they want structured data access.",
            },
            {
              q: "Do advisors need clients to take the assessment themselves?",
              a: "No. Advisors can enter information on behalf of clients and receive the structured output directly, without the client touching the assessment.",
            },
            {
              q: "Is there a free version?",
              a: "The assessment is $69 for individuals. There is no free tier — the score is only meaningful with full scoring, and partial results would be misleading.",
            },
          ].map(({ q, a }) => (
            <div key={q} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${C.borderSoft}` }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary, marginBottom: 8, lineHeight: 1.4 }}>
                {q}
              </div>
              <div style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.65 }}>{a}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
