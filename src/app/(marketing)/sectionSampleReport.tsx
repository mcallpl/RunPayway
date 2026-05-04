"use client";

export default function SectionSampleReport() {
  const C = {
    navy: "#0E1A2B",
    teal: "#1F6D7A",
    sand: "#F4F1EA",
    white: "#FFFFFF",
    textSecondary: "#5E6873",
    textMuted: "#7B848E",
    green: "#2A6E49",
  };

  const pages = [
    {
      number: 1,
      title: "Executive Summary: Your Decision Impact",
      description: "Your stability score, classification, and what it means for your specific financial decision (mortgage, career change, investment). See the bottom line immediately.",
      includes: [
        "Your personalized stability score (0-100)",
        "Classification of your income structure",
        "Financial implications for your situation",
        "Comparison to what lenders/investors expect"
      ]
    },
    {
      number: 2,
      title: "What's Holding You Back (Risk Assessment)",
      description: "The specific risks in your income structure, ranked by severity, with financial impact quantified. Know exactly what to fix first.",
      includes: [
        "5 identified risks ranked by severity",
        "Financial impact of each risk",
        "Which risks affect major decisions (mortgage, rates, qualification)",
        "Total vulnerability assessment"
      ]
    },
    {
      number: 3,
      title: "Your 12-Month Implementation Roadmap",
      description: "Exact timeline showing what to do this month, quarter, and year. Each action includes effort level and expected impact on your score.",
      includes: [
        "Phase 1 (Weeks 1-4): Immediate actions",
        "Phase 2 (Months 2-3): Quick wins",
        "Phase 3 (Months 4-9): Strategic improvements",
        "Phase 4 (Months 10-12): Optimization & measurement",
        "Projected score improvement and timeline"
      ]
    },
    {
      number: 4,
      title: "Professional Documentation",
      description: "A timestamped, certified summary you can share with mortgage lenders, financial advisors, business partners, or investors.",
      includes: [
        "Official summary letter",
        "Your key findings & classification",
        "Timestamped certification",
        "Ready to share with professionals"
      ]
    },
    {
      number: 5,
      title: "Stress Testing & Scenarios",
      description: "See how your income structure responds to real challenges. Understand your financial resilience and contingency position.",
      includes: [
        "3-5 real-world scenarios (loss of income, unexpected changes)",
        "Impact assessment for each scenario",
        "Financial runway in each situation",
        "Resilience profile & vulnerability areas"
      ]
    }
  ];

  return (
    <section style={{
      backgroundColor: "#FFFFFF",
      padding: "120px 24px",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* DESKTOP */}
        <div className="hidden lg:block">
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <h2 style={{
              fontSize: "48px",
              fontWeight: 700,
              lineHeight: "1.2",
              letterSpacing: "-0.020em",
              color: C.navy,
              margin: "0 0 20px 0"
            }}>
              What You Get for $69
            </h2>
            <p style={{
              fontSize: "20px",
              fontWeight: 500,
              lineHeight: "1.6",
              color: C.textSecondary,
              margin: "0"
            }}>
              A comprehensive 5-page personalized report with everything you need to understand and improve your income stability.
            </p>
          </div>

          {/* Report Pages Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "32px",
            marginBottom: "80px"
          }}>
            {pages.map((page, idx) => (
              <div key={idx} style={{
                backgroundColor: C.white,
                border: "1px solid #DDD5CB",
                borderRadius: "16px",
                padding: "40px 36px",
                boxShadow: "0 2px 8px rgba(14, 26, 43, 0.04)",
                transition: "all 200ms ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(14, 26, 43, 0.08)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(14, 26, 43, 0.04)";
                e.currentTarget.style.transform = "translateY(0)";
              }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: C.teal,
                  color: "#fff",
                  fontSize: "18px",
                  fontWeight: 700,
                  marginBottom: "20px"
                }}>
                  {page.number}
                </div>

                <h3 style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: C.navy,
                  margin: "0 0 12px 0",
                  lineHeight: "1.3"
                }}>
                  {page.title}
                </h3>

                <p style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "1.6",
                  color: C.textSecondary,
                  margin: "0 0 20px 0"
                }}>
                  {page.description}
                </p>

                <div style={{ marginBottom: "0" }}>
                  <div style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.10em",
                    color: C.teal,
                    textTransform: "uppercase",
                    marginBottom: "12px"
                  }}>
                    Includes
                  </div>
                  <ul style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                  }}>
                    {page.includes.map((item, i) => (
                      <li key={i} style={{
                        fontSize: "13px",
                        color: C.textSecondary,
                        lineHeight: "1.5",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px"
                      }}>
                        <span style={{
                          color: C.teal,
                          fontWeight: 600,
                          flexShrink: 0,
                          marginTop: "2px"
                        }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Guarantee Section */}
          <div style={{
            backgroundColor: C.sand,
            border: `2px solid ${C.teal}`,
            borderRadius: "16px",
            padding: "48px 56px",
            textAlign: "center",
            marginBottom: "64px"
          }}>
            <div style={{
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: C.teal,
              textTransform: "uppercase",
              marginBottom: "16px"
            }}>
              100% Money-Back Guarantee
            </div>
            <h3 style={{
              fontSize: "28px",
              fontWeight: 700,
              color: C.navy,
              margin: "0 0 16px 0",
              lineHeight: "1.3"
            }}>
              Your Report Includes These 5 Pages, Personalized to Your Income
            </h3>
            <p style={{
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "1.7",
              color: C.textSecondary,
              margin: "0 0 24px 0"
            }}>
              If your report doesn't deliver these 5 sections, customized to your unique income structure, <strong>we'll refund you immediately.</strong> No questions. No hassle.
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "12px",
              maxWidth: "800px",
              margin: "0 auto"
            }}>
              {pages.map((page, i) => (
                <div key={i} style={{
                  padding: "12px 16px",
                  backgroundColor: C.white,
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB"
                }}>
                  <div style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: C.teal,
                    marginBottom: "4px"
                  }}>Page {page.number}</div>
                  <div style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: C.navy,
                    lineHeight: "1.4"
                  }}>
                    {page.title.split(":")[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center" }}>
            <button style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "56px",
              padding: "0 40px",
              borderRadius: "12px",
              backgroundColor: C.teal,
              color: "#FFFFFF",
              fontSize: "16px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 200ms ease",
              boxShadow: "0 8px 24px rgba(31, 109, 122, 0.16)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(31, 109, 122, 0.24)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(31, 109, 122, 0.16)";
            }}>
              Get Full Report for $69
            </button>
            <p style={{
              fontSize: "13px",
              color: C.textSecondary,
              marginTop: "12px",
              marginBottom: "0"
            }}>
              One-time purchase · No subscriptions · Money-back guarantee
            </p>
          </div>
        </div>

        {/* MOBILE */}
        <div className="lg:hidden">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{
              fontSize: "32px",
              fontWeight: 700,
              lineHeight: "1.2",
              color: C.navy,
              margin: "0 0 16px 0"
            }}>
              What You Get for $69
            </h2>
            <p style={{
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "1.5",
              color: C.textSecondary,
              margin: "0"
            }}>
              5 pages of personalized analysis and actionable guidance.
            </p>
          </div>

          {/* Report Pages Stacked */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginBottom: "56px"
          }}>
            {pages.map((page, idx) => (
              <div key={idx} style={{
                backgroundColor: C.white,
                border: "1px solid #DDD5CB",
                borderRadius: "16px",
                padding: "28px 24px"
              }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  backgroundColor: C.teal,
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: 700,
                  marginBottom: "16px"
                }}>
                  {page.number}
                </div>

                <h3 style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: C.navy,
                  margin: "0 0 10px 0",
                  lineHeight: "1.3"
                }}>
                  {page.title}
                </h3>

                <p style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: "1.5",
                  color: C.textSecondary,
                  margin: "0 0 16px 0"
                }}>
                  {page.description}
                </p>

                <div>
                  <div style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.10em",
                    color: C.teal,
                    textTransform: "uppercase",
                    marginBottom: "10px"
                  }}>
                    Includes
                  </div>
                  <ul style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px"
                  }}>
                    {page.includes.map((item, i) => (
                      <li key={i} style={{
                        fontSize: "12px",
                        color: C.textSecondary,
                        lineHeight: "1.5",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "6px"
                      }}>
                        <span style={{
                          color: C.teal,
                          fontWeight: 600,
                          flexShrink: 0,
                          marginTop: "1px"
                        }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Guarantee Section Mobile */}
          <div style={{
            backgroundColor: C.sand,
            border: `2px solid ${C.teal}`,
            borderRadius: "16px",
            padding: "32px 24px",
            textAlign: "center",
            marginBottom: "48px"
          }}>
            <div style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.10em",
              color: C.teal,
              textTransform: "uppercase",
              marginBottom: "12px"
            }}>
              100% Money-Back Guarantee
            </div>
            <h3 style={{
              fontSize: "20px",
              fontWeight: 700,
              color: C.navy,
              margin: "0 0 12px 0",
              lineHeight: "1.3"
            }}>
              Your Report Delivers All 5 Pages
            </h3>
            <p style={{
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "1.6",
              color: C.textSecondary,
              margin: "0 0 16px 0"
            }}>
              If it doesn't, <strong>we'll refund you immediately.</strong> No questions.
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px"
            }}>
              {pages.map((page, i) => (
                <div key={i} style={{
                  padding: "10px 12px",
                  backgroundColor: C.white,
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB"
                }}>
                  <div style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: C.teal,
                    marginBottom: "2px"
                  }}>Page {page.number}</div>
                  <div style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: C.navy,
                    lineHeight: "1.3"
                  }}>
                    {page.title.split(":")[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Mobile */}
          <div style={{ textAlign: "center" }}>
            <button style={{
              width: "100%",
              height: "52px",
              borderRadius: "12px",
              backgroundColor: C.teal,
              color: "#FFFFFF",
              fontSize: "15px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 150ms ease",
              boxShadow: "0 6px 20px rgba(31, 109, 122, 0.16)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(31, 109, 122, 0.24)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(31, 109, 122, 0.16)";
            }}>
              Get Full Report for $69
            </button>
            <p style={{
              fontSize: "12px",
              color: C.textSecondary,
              textAlign: "center",
              marginTop: "10px",
              marginBottom: "0"
            }}>
              Money-back guarantee · No subscriptions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
