"use client";

export default function SectionPricingComparison() {
  return (
    <section style={{
      backgroundColor: "#F9FAFB",
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
              What's Included
            </h2>
            <p style={{
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: "1.6",
              color: "#6B7280",
              margin: "0"
            }}>
              Choose the right option for your needs
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px"
          }}>
            {/* FREE COLUMN */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "40px 32px",
              display: "flex",
              flexDirection: "column"
            }}>
              <div style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#0E1A2B",
                marginBottom: "8px"
              }}>
                Free Assessment
              </div>
              <div style={{
                fontSize: "16px",
                color: "#6B7280",
                marginBottom: "32px",
                lineHeight: "1.6"
              }}>
                Get started in 2 minutes
              </div>

              <ul style={{
                margin: "0",
                padding: "0",
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "16px"
              }}>
                {[
                  "Stability classification",
                  "Primary constraint identified",
                  "Quick overview of your situation",
                  "No documents required",
                  "Private and secure"
                ].map((item, idx) => (
                  <li key={idx} style={{
                    fontSize: "15px",
                    color: "#6B7280",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    lineHeight: "1.6"
                  }}>
                    <span style={{ color: "#16A34A", fontWeight: "bold", marginTop: "2px" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div style={{ flex: 1 }}></div>

              <div style={{
                marginTop: "32px",
                paddingTop: "32px",
                borderTop: "1px solid #E5E7EB"
              }}>
                <div style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#0E1A2B",
                  marginBottom: "16px"
                }}>
                  FREE
                </div>
                <button style={{
                  width: "100%",
                  fontSize: "16px",
                  fontWeight: 600,
                  lineHeight: "1.5",
                  color: "#FFFFFF",
                  backgroundColor: "#0E1A2B",
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
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0px 4px 12px rgba(14, 26, 43, 0.2)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
                >
                  Start Free Assessment
                </button>
              </div>
            </div>

            {/* PAID COLUMN */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "2px solid #1F6D7A",
              borderRadius: "8px",
              padding: "40px 32px",
              display: "flex",
              flexDirection: "column",
              position: "relative"
            }}>
              <div style={{
                position: "absolute",
                top: "-14px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#1F6D7A",
                color: "#FFFFFF",
                padding: "6px 16px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                whiteSpace: "nowrap"
              }}>
                Most Popular
              </div>

              <div style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#0E1A2B",
                marginBottom: "8px"
              }}>
                Full Report
              </div>
              <div style={{
                fontSize: "16px",
                color: "#6B7280",
                marginBottom: "32px",
                lineHeight: "1.6"
              }}>
                Complete analysis & action plan
              </div>

              <ul style={{
                margin: "0",
                padding: "0",
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "16px"
              }}>
                {[
                  "Everything in free assessment",
                  "Complete stability breakdown (6 factors)",
                  "Detailed risk assessment",
                  "3-step personalized action plan",
                  "Impact scores for each decision",
                  "Permanent timestamped record",
                  "Share with advisors & lenders"
                ].map((item, idx) => (
                  <li key={idx} style={{
                    fontSize: "15px",
                    color: "#6B7280",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    lineHeight: "1.6"
                  }}>
                    <span style={{ color: "#16A34A", fontWeight: "bold", marginTop: "2px" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div style={{ flex: 1 }}></div>

              <div style={{
                marginTop: "32px",
                paddingTop: "32px",
                borderTop: "1px solid #E5E7EB"
              }}>
                <div style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#0E1A2B",
                  marginBottom: "4px"
                }}>
                  $69
                </div>
                <div style={{
                  fontSize: "13px",
                  color: "#6B7280",
                  marginBottom: "16px"
                }}>
                  One-time purchase. No subscriptions.
                </div>
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
                  outline: "2px solid transparent",
                  outlineOffset: "4px",
                  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                }}
                onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"}
                onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0px 8px 16px rgba(31, 109, 122, 0.3)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
                >
                  Get Full Report for $69
                </button>
              </div>
            </div>
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
              What's Included
            </h2>
            <p style={{
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "1.6",
              color: "#6B7280",
              margin: "0"
            }}>
              Choose the right option
            </p>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}>
            {/* FREE CARD */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "28px 20px"
            }}>
              <div style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#0E1A2B",
                marginBottom: "6px"
              }}>
                Free Assessment
              </div>
              <div style={{
                fontSize: "14px",
                color: "#6B7280",
                marginBottom: "24px"
              }}>
                Get started in 2 minutes
              </div>

              <ul style={{
                margin: "0 0 24px 0",
                padding: "0",
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}>
                {[
                  "Stability classification",
                  "Primary constraint",
                  "Quick overview",
                  "No documents required",
                  "Private & secure"
                ].map((item, idx) => (
                  <li key={idx} style={{
                    fontSize: "13px",
                    color: "#6B7280",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                    lineHeight: "1.5"
                  }}>
                    <span style={{ color: "#16A34A", fontWeight: "bold", marginTop: "1px" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#0E1A2B",
                marginBottom: "12px"
              }}>
                FREE
              </div>
              <button style={{
                width: "100%",
                fontSize: "15px",
                fontWeight: 600,
                lineHeight: "1.5",
                color: "#FFFFFF",
                backgroundColor: "#0E1A2B",
                padding: "14px 24px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                transition: "all 150ms ease",
                fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0px 4px 12px rgba(14, 26, 43, 0.2)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
              >
                Start Free Assessment
              </button>
            </div>

            {/* PAID CARD */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "2px solid #1F6D7A",
              borderRadius: "8px",
              padding: "28px 20px",
              position: "relative"
            }}>
              <div style={{
                position: "absolute",
                top: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#1F6D7A",
                color: "#FFFFFF",
                padding: "4px 12px",
                borderRadius: "999px",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase"
              }}>
                Most Popular
              </div>

              <div style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#0E1A2B",
                marginBottom: "6px",
                marginTop: "6px"
              }}>
                Full Report
              </div>
              <div style={{
                fontSize: "14px",
                color: "#6B7280",
                marginBottom: "24px"
              }}>
                Complete analysis & action plan
              </div>

              <ul style={{
                margin: "0 0 24px 0",
                padding: "0",
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}>
                {[
                  "Everything in free",
                  "Complete breakdown (6 factors)",
                  "Detailed risk assessment",
                  "3-step action plan",
                  "Impact scores",
                  "Timestamped record",
                  "Share with advisors"
                ].map((item, idx) => (
                  <li key={idx} style={{
                    fontSize: "13px",
                    color: "#6B7280",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                    lineHeight: "1.5"
                  }}>
                    <span style={{ color: "#16A34A", fontWeight: "bold", marginTop: "1px" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#0E1A2B",
                marginBottom: "2px"
              }}>
                $69
              </div>
              <div style={{
                fontSize: "12px",
                color: "#6B7280",
                marginBottom: "16px"
              }}>
                One-time. No subscriptions.
              </div>
              <button style={{
                width: "100%",
                fontSize: "15px",
                fontWeight: 600,
                lineHeight: "1.5",
                color: "#FFFFFF",
                backgroundColor: "#1F6D7A",
                padding: "14px 24px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                transition: "all 150ms ease",
                fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0px 6px 12px rgba(31, 109, 122, 0.25)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
              >
                Get Full Report for $69
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
