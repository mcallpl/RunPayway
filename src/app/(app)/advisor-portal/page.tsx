"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logoBlue from "../../../../public/runpayway-logo-blue.png";
import { C, mono, sans } from "@/lib/design-tokens";
import { STRIPE_ADVISOR_STARTER, STRIPE_ADVISOR_PROFESSIONAL, STRIPE_ADVISOR_ENTERPRISE } from "@/lib/config";

/* ── Advisor Header ──────────────────────────────────────── */
function AdvisorHeader({ mobile: m }: { mobile: boolean }) {
  return (
    <header style={{
      borderBottom: `1px solid ${C.border}`,
      backgroundColor: "rgba(247,246,243,0.97)",
      backdropFilter: "blur(12px)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        height: m ? 56 : 64,
        padding: m ? "0 16px" : "0 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: m ? 10 : 16, minWidth: 0 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <Image src={logoBlue} alt="RunPayway" width={m ? 100 : 140} height={16} style={{ height: "auto" }} />
          </Link>
          <div style={{ width: 1, height: 24, backgroundColor: C.border }} />
          <span style={{
            fontSize: 13, fontWeight: 700, letterSpacing: "0.10em",
            textTransform: "uppercase" as const, color: C.purple,
          }}>
            ADVISOR PORTAL
          </span>
        </div>
        <nav style={{ display: "flex", alignItems: "center", gap: m ? 12 : 20 }}>
          <Link href="/advisor-portal/dashboard" style={{
            fontSize: m ? 13 : 14, fontWeight: 600, color: C.purple,
            textDecoration: "none", minHeight: 44,
            display: "inline-flex", alignItems: "center",
          }}>
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function AdvisorPortalPage() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const pad = mobile ? "28px" : "48px";
  const cardBase: React.CSSProperties = {
    backgroundColor: C.white,
    borderRadius: 20,
    boxShadow: "0 10px 30px rgba(14,26,43,0.06)",
    border: `1px solid ${C.border}`,
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.panelFill, fontFamily: sans }}>
      <AdvisorHeader mobile={mobile} />

      {/* Hero */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: mobile ? "48px 28px 32px" : "72px 48px 48px", textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.purple, marginBottom: 16, fontFamily: sans }}>
          FOR ADVISORS
        </div>
        <h1 style={{ fontSize: mobile ? 32 : 48, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.035em", color: C.navy, margin: "0 0 16px", fontFamily: sans }}>
          Know how your client&rsquo;s income is built{mobile ? " " : <br />}before the next meeting.
        </h1>
        <p style={{ fontSize: mobile ? 17 : 20, lineHeight: 1.5, color: C.textSecondary, maxWidth: 600, margin: "0 auto 36px", fontFamily: sans }}>
          RunPayway™ gives you a standardized income structure assessment for every client. Score, top risk, and talking points &mdash; in under two minutes.
        </p>
        <a href="#pricing" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          padding: "16px 36px", fontSize: 17, fontWeight: 600, fontFamily: sans,
          color: C.white, backgroundColor: C.purple, borderRadius: 12,
          textDecoration: "none", boxShadow: "0 8px 24px rgba(75,63,174,0.18)",
        }}>
          See Plans &rarr;
        </a>
      </section>

      {/* What you get — concrete outputs, not activities */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: mobile ? `0 ${pad} 48px` : `0 ${pad} 72px` }}>
        <h2 style={{ fontSize: mobile ? 24 : 28, fontWeight: 700, color: C.navy, margin: "0 0 24px", textAlign: "center", fontFamily: sans }}>
          What every assessment produces
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
          gap: mobile ? 12 : 16,
        }}>
          {[
            { label: "Income Stability Score", desc: "0\u2013100 standardized score based on six structural factors. Same inputs, same result, every time." },
            { label: "Stability Band", desc: "Limited, Developing, Established, or High Stability. Instantly classifies where your client stands." },
            { label: "Top Structural Risk", desc: "The single biggest factor limiting your client\u2019s income stability \u2014 concentration, labor dependence, visibility, or variability." },
            { label: "Meeting-Ready Talking Points", desc: "Industry-specific conversation guidance based on your client\u2019s actual score and risk profile. Ready before you walk in." },
          ].map((item, i) => (
            <div key={i} style={{
              ...cardBase, padding: mobile ? "20px 20px" : "24px 28px",
            }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: C.navy, margin: "0 0 6px", fontFamily: sans }}>
                {item.label}
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.5, color: C.textSecondary, margin: 0, fontFamily: sans }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works — three steps */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: mobile ? `0 ${pad} 48px` : `0 ${pad} 72px` }}>
        <h2 style={{ fontSize: mobile ? 24 : 28, fontWeight: 700, color: C.navy, margin: "0 0 24px", textAlign: "center", fontFamily: sans }}>
          Under two minutes. Three steps.
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr",
          gap: mobile ? 12 : 16,
        }}>
          {[
            { num: "1", title: "Add a client", desc: "Enter their name and industry. That\u2019s all you need to start." },
            { num: "2", title: "Classify and answer", desc: "Four classification fields and six questions about your client\u2019s income structure. No documents required." },
            { num: "3", title: "Get the result", desc: "Score, band, top risk, and a talking point appear instantly on the client card. Assessment is permanently recorded." },
          ].map((step, i) => (
            <div key={i} style={{ textAlign: "center", padding: mobile ? "20px 16px" : "28px 24px" }}>
              <div style={{
                width: 40, height: 40, borderRadius: 20, margin: "0 auto 12px",
                backgroundColor: "rgba(75,63,174,0.08)", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, fontWeight: 700, color: C.purple, fontFamily: mono,
              }}>
                {step.num}
              </div>
              <p style={{ fontSize: 16, fontWeight: 700, color: C.navy, margin: "0 0 6px", fontFamily: sans }}>
                {step.title}
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.5, color: C.textSecondary, margin: 0, fontFamily: sans }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ maxWidth: 1120, margin: "0 auto", padding: mobile ? `0 ${pad} 64px` : `0 ${pad} 96px`, scrollMarginTop: mobile ? 72 : 80 }}>
        <h2 style={{ fontSize: mobile ? 28 : 36, fontWeight: 700, color: C.navy, textAlign: "center", margin: "0 0 12px", fontFamily: sans, letterSpacing: "-0.02em" }}>
          Simple pricing. No per-report fees.
        </h2>
        <p style={{ fontSize: 17, color: C.textSecondary, textAlign: "center", margin: "0 auto 40px", maxWidth: 520, fontFamily: sans }}>
          Assessments, dashboard, and all advisor tools included. No per-report fees.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)",
          gap: mobile ? 16 : 20,
        }}>
          {([
            {
              name: "Starter",
              price: "$83",
              interval: "/ mo",
              billing: "billed $249/quarter",
              reports: "15 assessments / quarter",
              who: "Solo advisors adding income structure to their client process.",
              features: ["Income Stability Score™ per client", "Stability band + top risk", "Meeting prep talking points", "Book-level analytics", "Client notes"],
              href: STRIPE_ADVISOR_STARTER,
              highlight: false,
            },
            {
              name: "Professional",
              price: "$179",
              interval: "/ mo",
              billing: "billed monthly",
              reports: "50 assessments / month",
              who: "Growing practices that assess clients regularly across a full book.",
              features: ["Everything in Starter", "Priority support", "Quarterly usage reporting"],
              href: STRIPE_ADVISOR_PROFESSIONAL,
              highlight: true,
            },
            {
              name: "Enterprise",
              price: "$149",
              interval: "/ seat/mo",
              billing: "billed monthly per seat",
              reports: "Unlimited assessments",
              who: "RIAs, broker-dealers, and firms standardizing income risk across teams.",
              features: ["Everything in Professional", "Unlimited assessments per seat", "Multi-advisor seat management", "White-label reporting", "Dedicated onboarding + SLA"],
              href: STRIPE_ADVISOR_ENTERPRISE || "/contact",
              highlight: false,
            },
          ] as const).map((tier) => (
            <div key={tier.name} style={{
              ...cardBase,
              padding: mobile ? "28px 24px" : "36px 32px",
              border: tier.highlight ? `2px solid ${C.purple}` : `1px solid ${C.border}`,
              position: "relative" as const,
            }}>
              {tier.highlight && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const,
                  color: C.white, backgroundColor: C.purple, borderRadius: 6, padding: "4px 14px",
                }}>
                  MOST POPULAR
                </div>
              )}
              <h3 style={{ fontSize: 20, fontWeight: 700, color: C.navy, margin: "0 0 8px", fontFamily: sans }}>
                {tier.name}
              </h3>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 2, flexWrap: "nowrap" as const, whiteSpace: "nowrap" as const }}>
                <span style={{ fontSize: 36, fontWeight: 700, color: C.navy, fontFamily: mono, letterSpacing: "-0.02em", flexShrink: 0 }}>
                  {tier.price}
                </span>
                <span style={{ fontSize: 13, color: C.textMuted, flexShrink: 0 }}>{tier.interval}</span>
              </div>
              <p style={{ fontSize: 12, color: C.textMuted, margin: "0 0 8px" }}>
                {tier.billing}
              </p>
              <p style={{ fontSize: 14, color: C.teal, fontWeight: 600, margin: "0 0 8px" }}>
                {tier.reports}
              </p>
              <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 20px", lineHeight: 1.4 }}>
                {tier.who}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
                {tier.features.map((f, i) => (
                  <li key={i} style={{ fontSize: 14, color: C.textPrimary, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M3.5 7.5l2 2 5-5" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span dangerouslySetInnerHTML={{ __html: f }} />
                  </li>
                ))}
              </ul>
              <a href={tier.href || "/contact"} style={{
                display: "block", textAlign: "center", padding: "14px 20px",
                fontSize: 15, fontWeight: 600, fontFamily: sans, borderRadius: 10,
                textDecoration: "none", transition: "opacity 150ms",
                color: tier.highlight ? C.white : C.purple,
                backgroundColor: tier.highlight ? C.purple : "rgba(75,63,174,0.06)",
                border: tier.highlight ? "none" : `1px solid rgba(75,63,174,0.15)`,
                boxShadow: tier.highlight ? "0 8px 24px rgba(75,63,174,0.18)" : "none",
              }}>
                {tier.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </a>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 14, color: C.textMuted, textAlign: "center", marginTop: 24, fontFamily: sans }}>
          Already have an advisor code?{" "}
          <Link href="/advisor-portal/dashboard" style={{ color: C.purple, fontWeight: 600, textDecoration: "none" }}>
            Sign in to your dashboard
          </Link>
        </p>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "16px 20px 48px" }}>
        <p style={{ fontSize: 13, color: C.textMuted, margin: 0, fontFamily: mono }}>
          RunPayway™ Advisor Portal &middot; Model RP-2.0
        </p>
      </footer>
    </div>
  );
}
