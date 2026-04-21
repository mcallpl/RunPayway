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
          transition: background 200ms ease, opacity 200ms ease, box-shadow 200ms ease;
        }
        .plans-card-cta:hover {
          opacity: 0.88;
        }
        .plans-cta-outline:hover {
          background: rgba(75,63,174,0.06) !important;
        }

        /* ── iPad landscape (≤1024px) ── */
        @media (max-width: 1024px) {
          .plans-hero  { padding-left: 32px !important; padding-right: 32px !important; }
          .plans-cards { padding-left: 24px !important; padding-right: 24px !important; }
          .plans-faq   { padding-left: 32px !important; padding-right: 32px !important; }
          .plans-trust { padding-left: 32px !important; padding-right: 32px !important; }
        }

        /* ── Tablet landscape (860-1024px): 2 columns ── */
        @media (max-width: 1024px) and (min-width: 861px) {
          .plans-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        /* ── Tablet portrait (≤860px): single column ── */
        @media (max-width: 860px) {
          .plans-grid {
            display: flex !important;
            flex-direction: column !important;
            max-width: 520px !important;
            width: 100% !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
        }

        /* ── Mobile (≤600px) ── */
        @media (max-width: 600px) {
          .plans-hero {
            padding-left: 20px !important;
            padding-right: 20px !important;
            padding-top: 64px !important;
            padding-bottom: 40px !important;
          }
          .plans-cards {
            padding-left: 16px !important;
            padding-right: 16px !important;
            padding-top: 32px !important;
            padding-bottom: 48px !important;
          }
          .plans-grid {
            max-width: 100% !important;
            gap: 14px !important;
          }
          .plans-card-body {
            padding: 24px 20px 22px !important;
          }
          .plans-trust {
            padding-left: 20px !important;
            padding-right: 20px !important;
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
          paddingTop: 96,
          paddingBottom: 52,
          paddingLeft: 48,
          paddingRight: 48,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, ${C.teal}, ${C.purple})`,
        }} />

        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "5px 16px", borderRadius: 100,
            backgroundColor: "rgba(31,109,122,0.15)", marginBottom: 24,
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: C.teal }}>
              PLANS
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 700,
            lineHeight: 1.06,
            letterSpacing: "-0.033em",
            color: C.sandText,
            marginBottom: 16,
          }}>
            Find your plan.
          </h1>

          <p style={{
            fontSize: "clamp(15px, 2.2vw, 17px)",
            fontWeight: 400,
            lineHeight: 1.65,
            color: C.sandMuted,
            maxWidth: 420,
            margin: "0 auto",
          }}>
            RunPayway™ works differently depending on how you use it.
            Pick the option that fits.
          </p>
        </div>
      </section>

      {/* ── Cards ── */}
      <section
        className="plans-cards"
        style={{
          backgroundColor: C.white,
          paddingTop: 48,
          paddingBottom: 80,
          paddingLeft: 48,
          paddingRight: 48,
        }}
      >
        <div
          className="plans-grid"
          style={{
            maxWidth: 1020,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 22,
            alignItems: "stretch",
          }}
        >

          {/* ── Free tier ── */}
          <div
            className="plans-card plans-card-body"
            style={{
              backgroundColor: C.white,
              borderRadius: 20,
              border: `1px solid ${C.borderSoft}`,
              padding: "36px 32px 32px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, marginBottom: 14 }}>
              FREE
            </div>

            <div style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, lineHeight: 1.2, marginBottom: 10 }}>
              Your Stability Class
            </div>

            <p style={{ fontSize: 15, lineHeight: 1.6, color: C.textSecondary, marginBottom: 24, flex: 1 }}>
              See your stability class in 2 minutes. Find out what's holding you back.
            </p>

            <div style={{ borderTop: `1px solid ${C.borderSoft}`, paddingTop: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: "0.08em", marginBottom: 12 }}>
                WHAT YOU GET
              </div>
              {[
                "Stability class (Limited / Developing / Established / High)",
                "Primary structural risk",
                "Distance to next class",
                "Industry context",
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

            <Link href="/begin" className="plans-card-cta" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: 50, borderRadius: 12,
              backgroundColor: "transparent", color: C.teal,
              fontSize: 15, fontWeight: 600, textDecoration: "none",
              border: `1.5px solid ${C.teal}`,
            }}>
              Get My Stability Class — Free
            </Link>
          </div>

          {/* ── Individual — featured ── */}
          <div
            className="plans-card plans-card-body"
            style={{
              backgroundColor: C.white,
              borderRadius: 20,
              border: `1.5px solid ${C.teal}`,
              boxShadow: "0 8px 40px rgba(31,109,122,0.12)",
              padding: "36px 32px 32px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Featured bar */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 3,
              backgroundColor: C.teal,
            }} />

            {/* Most popular badge */}
            <div style={{
              position: "absolute", top: 20, right: 20,
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
              color: C.white, backgroundColor: C.teal,
              padding: "3px 10px", borderRadius: 100,
            }}>
              MOST POPULAR
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, marginBottom: 14 }}>
              FOR INDIVIDUALS
            </div>

            <div style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, lineHeight: 1.2, marginBottom: 10 }}>
              Your Income Stability Score™
            </div>

            <p style={{ fontSize: 15, lineHeight: 1.6, color: C.textSecondary, marginBottom: 24, flex: 1 }}>
              Your score, what&apos;s limiting it, a 12-week plan, and scripts for your industry — delivered instantly.
            </p>

            <div style={{ borderTop: `1px solid ${C.borderSoft}`, paddingTop: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: "0.08em", marginBottom: 12 }}>
                WHAT YOU GET
              </div>
              {[
                "Income Stability Score™ (0–100)",
                "6-dimension breakdown with band",
                "Ranked constraints — what to fix first",
                "12-week action plan for your industry",
                "Advisor & lender scripts",
                "Full PDF report",
                "Dashboard access",
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

            <a
              href="https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05"
              className="plans-card-cta"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                height: 50, borderRadius: 12,
                backgroundColor: C.teal, color: C.white,
                fontSize: 15, fontWeight: 600, textDecoration: "none",
                boxShadow: "0 4px 16px rgba(31,109,122,0.28)",
              }}
            >
              Get Your Full Report &mdash; $69
            </a>
          </div>

          {/* ── Individual Annual ── */}
          <div
            className="plans-card plans-card-body"
            style={{
              backgroundColor: C.white,
              borderRadius: 20,
              border: `1.5px solid ${C.purple}`,
              boxShadow: "0 8px 40px rgba(75,63,174,0.10)",
              padding: "36px 32px 32px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 3,
              backgroundColor: C.purple,
            }} />

            <div style={{
              position: "absolute", top: 20, right: 20,
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
              color: C.white, backgroundColor: C.purple,
              padding: "3px 10px", borderRadius: 100,
            }}>
              BEST VALUE
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: C.purple, marginBottom: 14 }}>
              FOR INDIVIDUALS
            </div>

            <div style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, lineHeight: 1.2, marginBottom: 6 }}>
              Annual Plan
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: C.textPrimary, letterSpacing: "-0.02em" }}>$149</span>
              <span style={{ fontSize: 14, color: C.textMuted, fontWeight: 500 }}>/year &middot; 3 reports</span>
            </div>

            <p style={{ fontSize: 13, lineHeight: 1.5, color: C.teal, fontWeight: 600, marginBottom: 16 }}>
              Save $58 vs. buying individually
            </p>

            <p style={{ fontSize: 15, lineHeight: 1.6, color: C.textSecondary, marginBottom: 24, flex: 1 }}>
              Three checkpoints throughout the year. Watch your stability improve with every decision.
            </p>

            <div style={{ borderTop: `1px solid ${C.borderSoft}`, paddingTop: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: "0.08em", marginBottom: 12 }}>
                WHAT YOU GET
              </div>
              {[
                "3 full Income Stability Score™ reports",
                "Everything in the one-time report",
                "All 3 reports saved in your dashboard",
                "Score history — track your progress",
                "Priority email support",
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

            {/* TODO: replace href with Stripe annual plan checkout URL */}
            <a
              href="https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05"
              className="plans-card-cta"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                height: 50, borderRadius: 12,
                backgroundColor: C.purple, color: C.white,
                fontSize: 15, fontWeight: 600, textDecoration: "none",
                boxShadow: "0 4px 16px rgba(75,63,174,0.24)",
                marginBottom: 14,
              }}
            >
              Get Annual Plan &mdash; $149 / year
            </a>

            <p style={{ textAlign: "center", fontSize: 13, color: C.textMuted, margin: 0 }}>
              Already subscribed?{" "}
              <Link href="/sign-in" style={{ fontWeight: 600, color: C.navy, textDecoration: "none" }}>
                Sign in to your dashboard
              </Link>
            </p>
          </div>

          {/* ── Advisors ── */}
          <div
            className="plans-card plans-card-body"
            style={{
              backgroundColor: C.navy,
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 8px 32px rgba(14,26,43,0.18)",
              padding: "36px 32px 32px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, marginBottom: 14 }}>
              FOR ADVISORS
            </div>

            <div style={{ fontSize: 22, fontWeight: 700, color: C.sandText, lineHeight: 1.2, marginBottom: 10 }}>
              Income Intelligence for Your Clients
            </div>

            <p style={{ fontSize: 15, lineHeight: 1.6, color: C.sandMuted, marginBottom: 24, flex: 1 }}>
              Help your clients see their income clearly. Deliver structured insights without the overhead.
            </p>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(244,241,234,0.30)", letterSpacing: "0.08em", marginBottom: 12 }}>
                WHAT YOU GET
              </div>
              {[
                "Assessments included in your plan",
                "Assess clients without their involvement",
                "Structured income data export",
                "White-label PDF delivery",
                "Book-level analytics + client notes",
                "Starter, Professional, and Enterprise tiers",
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

            <div style={{
              marginBottom: 20, display: "flex", alignItems: "center", gap: 10,
              padding: "11px 14px", borderRadius: 10, backgroundColor: "rgba(31,109,122,0.12)",
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <rect x="2" y="4" width="12" height="9" rx="2" stroke={C.teal} strokeWidth="1.5" />
                <path d="M5 4V3a3 3 0 0 1 6 0v1" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.teal }}>
                Subscription plans &middot; No per-report fees
              </span>
            </div>

            <Link href="/advisor-portal" className="plans-card-cta" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: 50, borderRadius: 12,
              backgroundColor: C.teal, color: C.white,
              fontSize: 15, fontWeight: 600, textDecoration: "none",
            }}>
              Open Advisor Portal &rarr;
            </Link>
          </div>

          {/* ── Organizations ── */}
          <div
            className="plans-card plans-card-body"
            style={{
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
              Join the waitlist and we&apos;ll brief you when enterprise
              access is ready.
            </p>

            <div style={{ borderTop: `1px solid ${C.borderSoft}`, paddingTop: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: "0.08em", marginBottom: 12 }}>
                WHAT YOU GET
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

            <div style={{
              marginBottom: 20, display: "flex", alignItems: "center", gap: 10,
              padding: "11px 14px", borderRadius: 10, backgroundColor: "rgba(75,63,174,0.06)",
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <path d="M8 2v4l2.5 2.5" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="8" cy="8" r="6" stroke={C.purple} strokeWidth="1.5" />
              </svg>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.purple }}>
                Custom pricing &middot; Early access available
              </span>
            </div>

            <Link href="/organizations" className="plans-card-cta plans-cta-outline" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: 50, borderRadius: 12,
              backgroundColor: "transparent", color: C.purple,
              fontSize: 15, fontWeight: 600, textDecoration: "none",
              border: `1.5px solid ${C.purple}`,
            }}>
              Join the Waitlist &rarr;
            </Link>
          </div>

        </div>
      </section>

      {/* ── Trust strip ── */}
      <section
        className="plans-trust"
        style={{
          paddingTop: 0,
          paddingBottom: 48,
          paddingLeft: 48,
          paddingRight: 48,
          backgroundColor: C.white,
        }}
      >
        <div style={{
          maxWidth: 1020, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, flexWrap: "wrap",
        }}>
          {[
            "No documents required",
            "Results in under 2 minutes",
            "No AI in scoring",
          ].map((text, i, arr) => (
            <span key={text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="7" cy="7" r="6" fill="rgba(31,109,122,0.10)" />
                <path d="M4.5 7.2L6.2 9L9.5 5.5" stroke={C.teal} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 500 }}>{text}</span>
              {i < arr.length - 1 && (
                <span style={{ color: C.borderSoft, marginLeft: 4, marginRight: 4, fontSize: 13 }}>&middot;</span>
              )}
            </span>
          ))}
          <span style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 4 }}>
            <span style={{ color: C.borderSoft, fontSize: 13 }}>&middot;</span>
            <Link href="/contact" style={{ fontSize: 13, color: C.textMuted, fontWeight: 500, textDecoration: "none", borderBottom: `1px solid ${C.borderSoft}` }}>
              Questions? Contact us
            </Link>
          </span>
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
          <h2 style={{
            fontSize: 18, fontWeight: 700, color: C.textPrimary,
            marginBottom: 28, letterSpacing: "-0.02em",
          }}>
            Common questions
          </h2>

          {[
            {
              q: "I'm an individual — can I still share my report with an advisor?",
              a: "Yes. Your PDF report is yours to share. Advisors can also run assessments through their own portal if they want structured data access directly.",
            },
            {
              q: "Do advisors need clients to take the assessment themselves?",
              a: "No. Advisors can enter information on behalf of clients and receive the structured output directly, without the client touching the assessment.",
            },
            {
              q: "Is there a free version?",
              a: "There is no free tier. The score is only meaningful with all six dimensions evaluated — partial scoring would produce a number without the context that makes it actionable.",
            },
            {
              q: "What's the difference between the one-time report and the annual plan?",
              a: "The one-time report ($69) gives you the full Income Stability Score™ once — best for a single decision point. The annual plan ($149/year) gives you 3 reports across the year, all saved in your dashboard with score history. If your income structure changes — new clients, a new role, a financial decision — you can reassess without paying again.",
            },
            {
              q: "How is advisor pricing different from individual pricing?",
              a: "Individuals purchase a single assessment or an annual plan for themselves. Advisors subscribe to a plan — assessments are included in the plan, with no per-report fees. Tiers range from Starter (15 assessments/quarter) to Professional (50/month) to Enterprise (unlimited, seat-based). The two are separate products with separate portals.",
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
