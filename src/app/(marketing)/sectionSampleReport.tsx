"use client";

export default function SectionSampleReport() {
  return (
    <section style={{
      backgroundColor: "#FFFFFF",
      padding: "96px 24px",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* DESKTOP */}
      <div className="hidden lg:block">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2 style={{
              fontSize: "32px",
              fontWeight: 700,
              lineHeight: "1.2",
              color: "#0E1A2B",
              margin: "0 0 16px 0"
            }}>
              This is What You Get for $69
            </h2>

            <p style={{
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: "1.6",
              color: "#6B7280",
              margin: "0 0 12px 0"
            }}>
              A complete, personalized 4-page report analyzing your income stability from every angle.
            </p>

            <p style={{
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "1.6",
              color: "#1F6D7A",
              margin: "0 0 48px 0"
            }}>
              One-time purchase. Yours forever.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "32px",
            marginBottom: "64px"
          }}>
            {/* Page 1: Executive Summary */}
            <div style={{
              backgroundColor: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "40px 32px"
            }}>
              <div style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#1F6D7A",
                textTransform: "uppercase",
                marginBottom: "24px"
              }}>
                Page 1
              </div>

              <div style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#0E1A2B",
                marginBottom: "32px",
                lineHeight: "1.2"
              }}>
                Executive Summary
              </div>

              <div style={{
                fontSize: "64px",
                fontWeight: 700,
                color: "#DC2626",
                marginBottom: "16px",
                lineHeight: "1"
              }}>
                31
              </div>

              <div style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#DC2626",
                marginBottom: "24px"
              }}>
                Limited Stability
              </div>

              <div style={{
                height: "1px",
                backgroundColor: "#E5E7EB",
                marginBottom: "24px"
              }}></div>

              <div style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#0E1A2B",
                marginBottom: "8px"
              }}>
                Your Profile
              </div>

              <p style={{
                fontSize: "13px",
                color: "#6B7280",
                margin: "0",
                lineHeight: "1.6"
              }}>
                Stability class, primary constraint, risk profile
              </p>
            </div>

            {/* Page 2: Full Stability Analysis */}
            <div style={{
              backgroundColor: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "40px 32px"
            }}>
              <div style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#1F6D7A",
                textTransform: "uppercase",
                marginBottom: "24px"
              }}>
                Page 2
              </div>

              <div style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#0E1A2B",
                marginBottom: "32px",
                lineHeight: "1.2"
              }}>
                Full Stability Analysis
              </div>

              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px"
              }}>
                {[
                  { title: "Concentration", score: 72 },
                  { title: "Source Diversity", score: 45 },
                  { title: "Forward Visibility", score: 68 }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#0E1A2B",
                      marginBottom: "6px"
                    }}>
                      {item.title}
                    </div>
                    <div style={{
                      width: "100%",
                      height: "6px",
                      backgroundColor: "#E5E7EB",
                      borderRadius: "3px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${item.score}%`,
                        height: "100%",
                        backgroundColor: item.score >= 70 ? "#16A34A" : item.score >= 50 ? "#F97316" : "#DC2626",
                        borderRadius: "3px"
                      }}></div>
                    </div>
                    <div style={{
                      fontSize: "12px",
                      color: "#6B7280",
                      marginTop: "4px"
                    }}>
                      {item.score}/100
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Page 3: Risk Assessment */}
            <div style={{
              backgroundColor: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "40px 32px"
            }}>
              <div style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#1F6D7A",
                textTransform: "uppercase",
                marginBottom: "24px"
              }}>
                Page 3
              </div>

              <div style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#0E1A2B",
                marginBottom: "32px",
                lineHeight: "1.2"
              }}>
                Risk Assessment
              </div>

              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px"
              }}>
                {[
                  { name: "Income Concentration", severity: "High", color: "#DC2626" },
                  { name: "Passive Income Gap", severity: "Moderate", color: "#F97316" },
                  { name: "Forward Visibility", severity: "Low-Moderate", color: "#F97316" }
                ].map((risk, idx) => (
                  <div key={idx} style={{
                    paddingBottom: "16px",
                    borderBottom: idx < 2 ? "1px solid #E5E7EB" : "none"
                  }}>
                    <div style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#0E1A2B",
                      marginBottom: "6px"
                    }}>
                      {risk.name}
                    </div>
                    <div style={{
                      fontSize: "12px",
                      color: risk.color,
                      fontWeight: 600
                    }}>
                      {risk.severity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Page 4: Action Plan */}
            <div style={{
              backgroundColor: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "40px 32px"
            }}>
              <div style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#1F6D7A",
                textTransform: "uppercase",
                marginBottom: "24px"
              }}>
                Page 4
              </div>

              <div style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#0E1A2B",
                marginBottom: "32px",
                lineHeight: "1.2"
              }}>
                Action Plan
              </div>

              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px"
              }}>
                {[
                  { decision: "Secondary Income", timeline: "6-12 months", impact: "+10" },
                  { decision: "Forward Visibility", timeline: "3-6 months", impact: "+5" },
                  { decision: "Reduce Effort", timeline: "9-18 months", impact: "+3" }
                ].map((item, idx) => (
                  <div key={idx} style={{
                    paddingBottom: "16px",
                    borderBottom: idx < 2 ? "1px solid #E5E7EB" : "none"
                  }}>
                    <div style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#0E1A2B",
                      marginBottom: "4px"
                    }}>
                      {item.decision}
                    </div>
                    <div style={{
                      fontSize: "12px",
                      color: "#6B7280",
                      marginBottom: "6px"
                    }}>
                      {item.timeline}
                    </div>
                    <div style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#16A34A"
                    }}>
                      Impact: {item.impact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <button style={{
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "1.5",
              color: "#FFFFFF",
              backgroundColor: "#1F6D7A",
              padding: "16px 32px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              transition: "all 150ms ease",
              outline: "2px solid transparent",
              outlineOffset: "4px",
              fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}
            onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"}
            onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0px 8px 16px rgba(31, 109, 122, 0.3)"}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
            >
              Get Your Full Report Today
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: "1.2",
              color: "#0E1A2B",
              margin: "0 0 16px 0"
            }}>
              This is What You Get for $69
            </h2>

            <p style={{
              fontSize: "15px",
              fontWeight: 400,
              lineHeight: "1.6",
              color: "#6B7280",
              margin: "0 0 8px 0"
            }}>
              A complete, personalized 4-page report analyzing your income stability.
            </p>

            <p style={{
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "1.6",
              color: "#1F6D7A",
              margin: "0 0 32px 0"
            }}>
              One-time purchase. Yours forever.
            </p>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            marginBottom: "48px"
          }}>
            {/* Page 1: Executive Summary */}
            <div style={{
              backgroundColor: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "28px 20px"
            }}>
              <div style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#1F6D7A",
                textTransform: "uppercase",
                marginBottom: "16px"
              }}>
                Page 1
              </div>

              <div style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#0E1A2B",
                marginBottom: "20px"
              }}>
                Executive Summary
              </div>

              <div style={{
                fontSize: "40px",
                fontWeight: 700,
                color: "#DC2626",
                marginBottom: "12px",
                lineHeight: "1"
              }}>
                31
              </div>

              <div style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#DC2626",
                marginBottom: "16px"
              }}>
                Limited Stability
              </div>

              <div style={{
                height: "1px",
                backgroundColor: "#E5E7EB",
                marginBottom: "16px"
              }}></div>

              <div style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#0E1A2B",
                marginBottom: "6px"
              }}>
                Your Profile
              </div>

              <p style={{
                fontSize: "12px",
                color: "#6B7280",
                margin: "0",
                lineHeight: "1.6"
              }}>
                Stability class, primary constraint, risk profile
              </p>
            </div>

            {/* Page 2: Full Stability Analysis */}
            <div style={{
              backgroundColor: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "28px 20px"
            }}>
              <div style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#1F6D7A",
                textTransform: "uppercase",
                marginBottom: "16px"
              }}>
                Page 2
              </div>

              <div style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#0E1A2B",
                marginBottom: "20px"
              }}>
                Full Stability Analysis
              </div>

              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}>
                {[
                  { title: "Concentration", score: 72 },
                  { title: "Source Diversity", score: 45 },
                  { title: "Forward Visibility", score: 68 }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#0E1A2B",
                      marginBottom: "4px"
                    }}>
                      {item.title}
                    </div>
                    <div style={{
                      width: "100%",
                      height: "4px",
                      backgroundColor: "#E5E7EB",
                      borderRadius: "2px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${item.score}%`,
                        height: "100%",
                        backgroundColor: item.score >= 70 ? "#16A34A" : item.score >= 50 ? "#F97316" : "#DC2626",
                        borderRadius: "2px"
                      }}></div>
                    </div>
                    <div style={{
                      fontSize: "11px",
                      color: "#6B7280",
                      marginTop: "2px"
                    }}>
                      {item.score}/100
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Page 3: Risk Assessment */}
            <div style={{
              backgroundColor: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "28px 20px"
            }}>
              <div style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#1F6D7A",
                textTransform: "uppercase",
                marginBottom: "16px"
              }}>
                Page 3
              </div>

              <div style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#0E1A2B",
                marginBottom: "20px"
              }}>
                Risk Assessment
              </div>

              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px"
              }}>
                {[
                  { name: "Income Concentration", severity: "High", color: "#DC2626" },
                  { name: "Passive Income Gap", severity: "Moderate", color: "#F97316" },
                  { name: "Forward Visibility", severity: "Low-Moderate", color: "#F97316" }
                ].map((risk, idx) => (
                  <div key={idx} style={{
                    paddingBottom: "12px",
                    borderBottom: idx < 2 ? "1px solid #E5E7EB" : "none"
                  }}>
                    <div style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#0E1A2B",
                      marginBottom: "4px"
                    }}>
                      {risk.name}
                    </div>
                    <div style={{
                      fontSize: "11px",
                      color: risk.color,
                      fontWeight: 600
                    }}>
                      {risk.severity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Page 4: Action Plan */}
            <div style={{
              backgroundColor: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "28px 20px"
            }}>
              <div style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#1F6D7A",
                textTransform: "uppercase",
                marginBottom: "16px"
              }}>
                Page 4
              </div>

              <div style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#0E1A2B",
                marginBottom: "20px"
              }}>
                Action Plan
              </div>

              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px"
              }}>
                {[
                  { decision: "Secondary Income", timeline: "6-12 months", impact: "+10" },
                  { decision: "Forward Visibility", timeline: "3-6 months", impact: "+5" },
                  { decision: "Reduce Effort", timeline: "9-18 months", impact: "+3" }
                ].map((item, idx) => (
                  <div key={idx} style={{
                    paddingBottom: "12px",
                    borderBottom: idx < 2 ? "1px solid #E5E7EB" : "none"
                  }}>
                    <div style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#0E1A2B",
                      marginBottom: "2px"
                    }}>
                      {item.decision}
                    </div>
                    <div style={{
                      fontSize: "11px",
                      color: "#6B7280",
                      marginBottom: "4px"
                    }}>
                      {item.timeline}
                    </div>
                    <div style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#16A34A"
                    }}>
                      Impact: {item.impact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <button style={{
              width: "100%",
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "1.5",
              color: "#FFFFFF",
              backgroundColor: "#1F6D7A",
              padding: "16px 32px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              transition: "all 150ms ease",
              fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0px 6px 12px rgba(31, 109, 122, 0.25)"}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
            >
              Get Your Full Report Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
