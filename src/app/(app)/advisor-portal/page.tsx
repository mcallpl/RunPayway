"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SuiteHeader from "@/components/SuiteHeader";
import { C, mono, sans } from "@/lib/design-tokens";

const CLIENT_OPTIONS = ["1–10", "11–50", "51–200", "200+"] as const;

export default function AdvisorPortalPage() {
  const [mobile, setMobile] = useState(false);
  const [advisorCode, setAdvisorCode] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState("");

  // Registration form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [firm, setFirm] = useState("");
  const [clientCount, setClientCount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("rp_advisor_code");
    if (stored) setAdvisorCode(stored);
  }, []);

  const handleSubmit = async () => {
    setError(null);
    if (!name.trim() || !email.trim() || !firm.trim() || !clientCount) {
      setError("Please fill out all fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("https://runpayway-api.cjmcallister.workers.dev/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "advisor_portal_request",
          name: name.trim(),
          email: email.trim(),
          firm: firm.trim(),
          client_count: clientCount,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleActivate = () => {
    const trimmed = codeInput.trim();
    if (!trimmed) return;
    localStorage.setItem("rp_advisor_code", trimmed);
    setAdvisorCode(trimmed);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    fontSize: 16,
    fontFamily: sans,
    border: `1px solid ${C.borderSoft}`,
    borderRadius: 10,
    backgroundColor: C.panelFill,
    color: C.textPrimary,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 600,
    color: C.textPrimary,
    fontFamily: sans,
    marginBottom: 6,
    display: "block",
  };

  const valueItems = [
    "Send branded assessment links to any client",
    "View client scores and income breakdowns",
    "Track client progress across reassessments",
    "Export data for planning conversations",
    "Flat per-report pricing — no subscription required",
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.panelFill, fontFamily: sans }}>
      <SuiteHeader current="advisor-portal" />

      {/* Hero */}
      <section style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: mobile ? "48px 28px 32px" : "72px 48px 48px",
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: C.purple,
          marginBottom: 16,
          fontFamily: sans,
        }}>
          ADVISOR PORTAL
        </div>
        <h1 style={{
          fontSize: mobile ? 32 : 48,
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: "-0.035em",
          color: C.navy,
          margin: "0 0 16px",
          fontFamily: sans,
        }}>
          Manage your clients&rsquo; income stability.
        </h1>
        <p style={{
          fontSize: mobile ? 17 : 20,
          lineHeight: 1.5,
          color: C.textSecondary,
          maxWidth: 640,
          margin: "0 auto",
          fontFamily: sans,
        }}>
          Send assessments, track scores, and identify opportunities across your book.
        </p>
      </section>

      {/* Main content */}
      <section style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: mobile ? "0 28px 64px" : "0 48px 96px",
      }}>
        {advisorCode ? (
          /* State 2: Has advisor code */
          <div style={{
            backgroundColor: C.white,
            borderRadius: 20,
            padding: mobile ? "32px 28px" : "44px",
            boxShadow: "0 10px 30px rgba(14,26,43,0.06)",
            border: `1px solid ${C.border}`,
            textAlign: "center",
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: "rgba(75,63,174,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h2 style={{
              fontSize: mobile ? 22 : 26,
              fontWeight: 700,
              color: C.navy,
              margin: "0 0 12px",
              fontFamily: sans,
            }}>
              Your advisor portal is being configured.
            </h2>
            <p style={{
              fontSize: 17,
              lineHeight: 1.55,
              color: C.textSecondary,
              margin: "0 0 24px",
              fontFamily: sans,
            }}>
              We&rsquo;ll notify you when it&rsquo;s ready.
            </p>
            <div style={{
              display: "inline-block",
              padding: "10px 20px",
              borderRadius: 10,
              backgroundColor: C.panelFill,
              fontFamily: mono,
              fontSize: 14,
              color: C.textPrimary,
              letterSpacing: "0.04em",
              marginBottom: 24,
            }}>
              {advisorCode}
            </div>
            <div>
              <Link href="/dashboard" style={{
                fontSize: 15,
                fontWeight: 600,
                color: C.purple,
                textDecoration: "none",
                fontFamily: sans,
              }}>
                &larr; Back to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          /* State 1: Not registered */
          <div style={{
            backgroundColor: C.white,
            borderRadius: 20,
            padding: mobile ? "32px 28px" : "44px",
            boxShadow: "0 10px 30px rgba(14,26,43,0.06)",
            border: `1px solid ${C.border}`,
          }}>
            <h2 style={{
              fontSize: mobile ? 24 : 28,
              fontWeight: 700,
              color: C.navy,
              margin: "0 0 12px",
              fontFamily: sans,
            }}>
              Request advisor access
            </h2>
            <p style={{
              fontSize: 16,
              lineHeight: 1.6,
              color: C.textSecondary,
              margin: "0 0 28px",
              fontFamily: sans,
            }}>
              RunPayway&#8482; Advisor Access lets you run Income Stability Score&#8482; assessments for your clients, view their results, and use the data in your planning conversations.
            </p>

            {/* Value list */}
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}>
              {valueItems.map((item, i) => (
                <li key={i} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  marginBottom: 14,
                  fontSize: 15,
                  lineHeight: 1.5,
                  color: C.textPrimary,
                  fontFamily: sans,
                }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                    <circle cx="9" cy="9" r="9" fill="rgba(31,109,122,0.10)" />
                    <path d="M5.5 9.5l2 2 5-5" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            {submitted ? (
              <div style={{
                padding: "28px 24px",
                borderRadius: 14,
                backgroundColor: "rgba(31,109,122,0.06)",
                border: `1px solid rgba(31,109,122,0.15)`,
                textAlign: "center",
              }}>
                <p style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: C.teal,
                  margin: "0 0 6px",
                  fontFamily: sans,
                }}>
                  Your request has been received.
                </p>
                <p style={{
                  fontSize: 15,
                  color: C.textSecondary,
                  margin: 0,
                  fontFamily: sans,
                }}>
                  We&rsquo;ll be in touch within two business days.
                </p>
              </div>
            ) : (
              <>
                {/* Form */}
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div>
                    <label style={labelStyle}>Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Full name"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@firm.com"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Firm / Practice Name</label>
                    <input
                      type="text"
                      value={firm}
                      onChange={e => setFirm(e.target.value)}
                      placeholder="Your firm or practice"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Number of Clients</label>
                    <select
                      value={clientCount}
                      onChange={e => setClientCount(e.target.value)}
                      style={{
                        ...inputStyle,
                        appearance: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%235E6873' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 16px center",
                        paddingRight: 40,
                        color: clientCount ? C.textPrimary : C.textMuted,
                      }}
                    >
                      <option value="" disabled>Select range</option>
                      {CLIENT_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {error && (
                  <p style={{
                    fontSize: 14,
                    color: C.risk,
                    margin: "14px 0 0",
                    fontFamily: sans,
                  }}>
                    {error}
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    width: "100%",
                    marginTop: 24,
                    padding: "16px 24px",
                    fontSize: 17,
                    fontWeight: 600,
                    fontFamily: sans,
                    color: C.white,
                    backgroundColor: C.purple,
                    border: "none",
                    borderRadius: 12,
                    cursor: submitting ? "default" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                    transition: "opacity 150ms",
                    boxShadow: "0 8px 24px rgba(75,63,174,0.18)",
                  }}
                >
                  {submitting ? "Submitting..." : "Request Advisor Access"}
                </button>
              </>
            )}

            {/* Advisor code section */}
            <div style={{
              marginTop: 36,
              paddingTop: 28,
              borderTop: `1px solid ${C.border}`,
            }}>
              <p style={{
                fontSize: 15,
                color: C.textSecondary,
                margin: "0 0 14px",
                fontFamily: sans,
              }}>
                Already have advisor access? Enter your advisor code below.
              </p>
              <div style={{
                display: "flex",
                gap: 10,
                alignItems: mobile ? "stretch" : "center",
                flexDirection: mobile ? "column" : "row",
              }}>
                <input
                  type="text"
                  value={codeInput}
                  onChange={e => setCodeInput(e.target.value)}
                  placeholder="Advisor code"
                  style={{
                    ...inputStyle,
                    flex: 1,
                    fontFamily: mono,
                    fontSize: 14,
                    letterSpacing: "0.03em",
                  }}
                />
                <button
                  onClick={handleActivate}
                  style={{
                    padding: "14px 24px",
                    fontSize: 15,
                    fontWeight: 600,
                    fontFamily: sans,
                    color: C.purple,
                    backgroundColor: "rgba(75,63,174,0.06)",
                    border: `1px solid rgba(75,63,174,0.18)`,
                    borderRadius: 10,
                    cursor: "pointer",
                    whiteSpace: "nowrap" as const,
                    transition: "background-color 150ms",
                  }}
                >
                  Activate
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: mobile ? "0 28px 72px" : "0 48px 96px",
        textAlign: "center",
      }}>
        <p style={{
          fontSize: 16,
          color: C.textSecondary,
          margin: "0 0 16px",
          fontFamily: sans,
        }}>
          New to RunPayway&#8482;? See how the scoring works.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          <Link href="/learn/how-to-measure-income-stability" style={{
            fontSize: 15,
            fontWeight: 600,
            color: C.purple,
            textDecoration: "none",
            fontFamily: sans,
          }}>
            How It Works &rarr;
          </Link>
          <Link href="/methodology" style={{
            fontSize: 15,
            fontWeight: 600,
            color: C.purple,
            textDecoration: "none",
            fontFamily: sans,
          }}>
            Methodology &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
