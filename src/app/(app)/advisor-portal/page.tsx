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
            <Image src={logoBlue} alt="RunPayway™" width={m ? 100 : 140} height={16} style={{ height: "auto" }} />
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

/* ── Check icon ──────────────────────────────────────────── */
function Check({ color = C.teal }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3.5 7.5l2 2 5-5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function AdvisorPortalPage() {
  const [mobile, setMobile] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

  const FAQS = [
    {
      q: "Can I run assessments without the client present?",
      a: "Yes. You enter the income structure information on behalf of your client. No client login, no email required. The result is recorded on your dashboard immediately.",
    },
    {
      q: "What happens when I reach my assessment limit?",
      a: "You'll see a usage indicator in your dashboard. When you're at capacity, you can upgrade your plan at any time — assessments resume immediately after upgrade.",
    },
    {
      q: "Can I upgrade or change plans mid-cycle?",
      a: "Yes. Upgrades take effect immediately and are prorated. Downgrades take effect at the next billing cycle.",
    },
    {
      q: "Is client data stored?",
      a: "Assessment inputs and results are stored securely in your advisor account. No personal identifying information is required — assessments are based on income structure, not identity.",
    },
    {
      q: "What does white-label reporting mean for Enterprise?",
      a: "Enterprise clients can deliver PDF reports under their own firm branding. RunPayway™ attribution is removed from client-facing documents.",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.panelFill, fontFamily: sans }}>
      <AdvisorHeader mobile={mobile} />

      {/* ── Hero ────────────────────────────────────────────── */}
      <section style={{
        maxWidth: 1200, margin: "0 auto",
        padding: mobile ? "48px 28px 40px" : "80px 48px 56px",
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 12, fontWeight: 700, letterSpacing: "0.12em",
          textTransform: "uppercase", color: C.purple, marginBottom: 16,
        }}>
          FOR ADVISORS
        </div>
        <h1 style={{
          fontSize: mobile ? 32 : 48, fontWeight: 700,
          lineHeight: 1.05, letterSpacing: "-0.035em",
          color: C.navy, margin: "0 0 18px",
        }}>
          Know how your client&rsquo;s income is built{mobile ? " " : <br />}before the next meeting.
        </h1>
        <p style={{
          fontSize: mobile ? 17 : 20, lineHeight: 1.55,
          color: C.textSecondary, maxWidth: 580,
          margin: "0 auto 36px",
        }}>
          RunPayway™ gives every client a standardized income structure score.
          Score, top risk, and meeting-ready talking points &mdash; in under two minutes.
        </p>
        <a href="#pricing" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          padding: "16px 40px", fontSize: 17, fontWeight: 600,
          color: C.white, backgroundColor: C.purple, borderRadius: 12,
          textDecoration: "none", boxShadow: "0 8px 24px rgba(75,63,174,0.20)",
        }}>
          View Pricing &rarr;
        </a>
      </section>

      {/* ── How it works — workflow first ───────────────────── */}
      <section style={{
        maxWidth: 900, margin: "0 auto",
        padding: mobile ? `0 ${pad} 48px` : `0 ${pad} 72px`,
      }}>
        <h2 style={{
          fontSize: mobile ? 24 : 28, fontWeight: 700,
          color: C.navy, margin: "0 0 8px", textAlign: "center",
        }}>
          Three steps. Under two minutes.
        </h2>
        <p style={{
          fontSize: 15, color: C.textSecondary, textAlign: "center",
          margin: "0 auto 28px", maxWidth: 440, lineHeight: 1.55,
        }}>
          No documents. No client login. Nothing to install.
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr",
          gap: mobile ? 12 : 16,
        }}>
          {[
            {
              num: "1",
              title: "Add a client",
              desc: "Enter their name and industry. That\u2019s all you need to start.",
            },
            {
              num: "2",
              title: "Evaluate income structure",
              desc: "Four classification fields and six structural factors. No documents or client presence required.",
            },
            {
              num: "3",
              title: "Get the result",
              desc: "Score, band, top risk, and talking points appear instantly. Assessment is permanently recorded on the client card.",
            },
          ].map((step) => (
            <div key={step.num} style={{
              ...cardBase,
              padding: mobile ? "24px 20px" : "28px 24px",
              textAlign: "center",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 20, margin: "0 auto 14px",
                backgroundColor: "rgba(75,63,174,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, fontWeight: 700, color: C.purple, fontFamily: mono,
              }}>
                {step.num}
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: C.navy, margin: "0 0 6px" }}>
                {step.title}
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: C.textSecondary, margin: 0 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What every assessment produces ──────────────────── */}
      <section style={{
        maxWidth: 900, margin: "0 auto",
        padding: mobile ? `0 ${pad} 48px` : `0 ${pad} 72px`,
      }}>
        <h2 style={{
          fontSize: mobile ? 24 : 28, fontWeight: 700,
          color: C.navy, margin: "0 0 8px", textAlign: "center",
        }}>
          What every assessment produces
        </h2>
        <p style={{
          fontSize: 15, color: C.textSecondary, textAlign: "center",
          margin: "0 auto 28px", maxWidth: 440, lineHeight: 1.55,
        }}>
          The same four outputs, every time. Consistent enough to compare across your book.
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
          gap: mobile ? 12 : 16,
        }}>
          {[
            {
              label: "Income Stability Score",
              desc: "0\u2013100 standardized score based on six structural factors. Same inputs, same result, every time.",
            },
            {
              label: "Stability Band",
              desc: "Limited, Developing, Established, or High Stability. Instantly classifies where your client stands relative to their income type.",
            },
            {
              label: "Top Structural Risk",
              desc: "The single biggest factor limiting your client\u2019s income stability \u2014 concentration, labor dependence, visibility, or variability.",
            },
            {
              label: "Meeting-Ready Talking Points",
              desc: "Industry-specific conversation guidance based on your client\u2019s actual score and risk profile. Ready before you walk in.",
            },
          ].map((item) => (
            <div key={item.label} style={{ ...cardBase, padding: mobile ? "20px" : "24px 28px" }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: C.navy, margin: "0 0 6px" }}>
                {item.label}
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: C.textSecondary, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────── */}
      <section id="pricing" style={{
        maxWidth: 1120, margin: "0 auto",
        padding: mobile ? `0 ${pad} 48px` : `0 ${pad} 72px`,
        scrollMarginTop: mobile ? 72 : 80,
      }}>
        <h2 style={{
          fontSize: mobile ? 28 : 36, fontWeight: 700,
          color: C.navy, textAlign: "center",
          margin: "0 0 12px", letterSpacing: "-0.02em",
        }}>
          Simple pricing. No per-report fees.
        </h2>
        <p style={{
          fontSize: 17, color: C.textSecondary,
          textAlign: "center", margin: "0 auto 40px",
          maxWidth: 480, lineHeight: 1.55,
        }}>
          Assessments and all advisor tools are included in every plan.
          Pay for your tier, not each report.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)",
          gap: mobile ? 16 : 20,
          paddingTop: 16,
        }}>
          {([
            {
              name: "Starter",
              price: "$83",
              interval: "/ mo",
              billing: "billed $249/quarter",
              reports: "15 assessments / quarter",
              who: "Solo advisors adding income structure to their client process.",
              features: [
                "Income Stability Score™ per client",
                "Stability band + top structural risk",
                "Meeting prep talking points",
                "Book-level analytics dashboard",
                "Client notes + assessment history",
              ],
              cta: "Get Started",
              href: STRIPE_ADVISOR_STARTER,
              highlight: false,
            },
            {
              name: "Professional",
              price: "$179",
              interval: "/ mo",
              billing: "billed monthly",
              reports: "50 assessments / month",
              who: "Growing practices assessing clients regularly across a full book.",
              features: [
                "Everything in Starter",
                "50 assessments per month",
                "Advanced practice analytics",
                "Client income trend reporting",
                "Priority support",
                "Quarterly usage review",
              ],
              cta: "Get Started",
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
              features: [
                "Everything in Professional",
                "Unlimited assessments per seat",
                "Multi-advisor seat management",
                "White-label PDF reporting",
                "Dedicated onboarding + SLA",
                "Custom contract available",
              ],
              cta: "Contact Sales",
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
                  position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                  color: C.white, backgroundColor: C.purple,
                  borderRadius: 6, padding: "4px 14px",
                  whiteSpace: "nowrap" as const,
                }}>
                  MOST POPULAR
                </div>
              )}
              <h3 style={{ fontSize: 20, fontWeight: 700, color: C.navy, margin: "0 0 8px" }}>
                {tier.name}
              </h3>
              <div style={{
                display: "flex", alignItems: "baseline", gap: 4,
                marginBottom: 2, whiteSpace: "nowrap" as const,
              }}>
                <span style={{
                  fontSize: 36, fontWeight: 700, color: C.navy,
                  fontFamily: mono, letterSpacing: "-0.02em",
                }}>
                  {tier.price}
                </span>
                <span style={{ fontSize: 13, color: C.textMuted }}>{tier.interval}</span>
              </div>
              <p style={{ fontSize: 12, color: C.textMuted, margin: "0 0 8px" }}>
                {tier.billing}
              </p>
              <p style={{ fontSize: 14, color: C.teal, fontWeight: 600, margin: "0 0 8px" }}>
                {tier.reports}
              </p>
              <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 20px", lineHeight: 1.45 }}>
                {tier.who}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
                {tier.features.map((f) => (
                  <li key={f} style={{
                    fontSize: 14, color: C.textPrimary,
                    marginBottom: 9, display: "flex", alignItems: "flex-start", gap: 8,
                  }}>
                    <span style={{ marginTop: 1 }}><Check /></span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a href={tier.href || "/contact"} style={{
                display: "block", textAlign: "center", padding: "14px 20px",
                fontSize: 15, fontWeight: 600, borderRadius: 10,
                textDecoration: "none", transition: "opacity 150ms",
                color: tier.highlight ? C.white : C.purple,
                backgroundColor: tier.highlight ? C.purple : "rgba(75,63,174,0.06)",
                border: tier.highlight ? "none" : `1px solid rgba(75,63,174,0.15)`,
                boxShadow: tier.highlight ? "0 8px 24px rgba(75,63,174,0.18)" : "none",
              }}>
                {tier.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Trust signals */}
        <div style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center",
          gap: mobile ? "10px 20px" : "10px 32px",
          marginTop: 32, marginBottom: 16,
        }}>
          {[
            "Assessment data encrypted at rest",
            "No client identity required",
            "No documents stored",
            "Cancel any time",
          ].map((item, i, arr) => (
            <span key={item} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <Check color="rgba(31,109,122,0.7)" />
              <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 500 }}>{item}</span>
              {!mobile && i < arr.length - 1 && (
                <span style={{ color: C.borderSoft, marginLeft: 10, fontSize: 13 }}>&middot;</span>
              )}
            </span>
          ))}
        </div>

        <p style={{ fontSize: 14, color: C.textMuted, textAlign: "center", marginTop: 8 }}>
          Already have an account?{" "}
          <Link href="/advisor-portal/dashboard" style={{ color: C.purple, fontWeight: 600, textDecoration: "none" }}>
            Sign in to your dashboard
          </Link>
          {" "}&middot;{" "}
          <Link href="/contact" style={{ color: C.purple, fontWeight: 600, textDecoration: "none" }}>
            Talk to us about Enterprise
          </Link>
        </p>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section style={{
        maxWidth: 720, margin: "0 auto",
        padding: mobile ? `0 ${pad} 64px` : `0 ${pad} 96px`,
      }}>
        <h2 style={{
          fontSize: mobile ? 22 : 26, fontWeight: 700,
          color: C.navy, margin: "0 0 24px", textAlign: "center",
        }}>
          Common questions
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{
              borderRadius: 12,
              border: `1px solid ${openFaq === i ? "rgba(75,63,174,0.15)" : C.border}`,
              backgroundColor: openFaq === i ? "rgba(75,63,174,0.02)" : C.white,
              overflow: "hidden",
              transition: "border-color 200ms ease, background 200ms ease",
            }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%", display: "flex", alignItems: "center",
                  justifyContent: "space-between", gap: 16,
                  padding: "18px 24px", border: "none",
                  background: "transparent", cursor: "pointer", textAlign: "left",
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: C.navy, lineHeight: 1.35 }}>
                  {faq.q}
                </span>
                <svg
                  width="16" height="16" viewBox="0 0 16 16" fill="none"
                  style={{
                    flexShrink: 0,
                    transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 240ms cubic-bezier(0.22,1,0.36,1)",
                    opacity: 0.45,
                  }}
                >
                  <path d="M3 6l5 5 5-5" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 24px 20px" }}>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: C.textSecondary, margin: 0 }}>
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer style={{
        borderTop: `1px solid ${C.border}`,
        padding: "20px 24px 40px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 13, color: C.textMuted, margin: 0 }}>
          &copy; {new Date().getFullYear()} RunPayway™ &middot;{" "}
          <Link href="/privacy-policy" style={{ color: C.textMuted, textDecoration: "none" }}>Privacy</Link>
          {" "}&middot;{" "}
          <Link href="/terms-of-use" style={{ color: C.textMuted, textDecoration: "none" }}>Terms</Link>
          {" "}&middot;{" "}
          <Link href="/contact" style={{ color: C.textMuted, textDecoration: "none" }}>Contact</Link>
        </p>
      </footer>
    </div>
  );
}
