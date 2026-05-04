"use client";

export default function SectionFree() {
  return (
    <section style={{
      padding: "96px 24px",
      backgroundColor: "#FFFFFF",
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
              Your Income Stability Class: Limited Stability
            </h2>
            <p style={{
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: "1.6",
              color: "#6B7280",
              margin: "0 0 48px 0"
            }}>
              Your income is vulnerable due to reliance on a single income source.
            </p>

            <div style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "48px 40px",
              maxWidth: "600px",
              margin: "0 auto 48px",
              textAlign: "center"
            }}>
              <div style={{
                fontSize: "72px",
                fontWeight: 700,
                lineHeight: "1",
                color: "#DC2626",
                marginBottom: "16px"
              }}>
                31
              </div>

              <div style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#DC2626",
                marginBottom: "24px",
                lineHeight: "1.2"
              }}>
                Limited Stability
              </div>

              <p style={{
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "1.6",
                color: "#6B7280",
                margin: "0 0 32px 0"
              }}>
                This is your free classification. Your actual income stability goes much deeper.
              </p>

              <div style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #1F6D7A",
                borderRadius: "8px",
                padding: "24px",
                marginBottom: "32px"
              }}>
                <div style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1F6D7A",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  What's in the full report ($69)
                </div>
                <ul style={{
                  margin: "0",
                  padding: "0 0 0 20px",
                  listStyle: "disc"
                }}>
                  <li style={{ fontSize: "14px", color: "#6B7280", marginBottom: "8px", lineHeight: "1.6" }}>
                    <strong>Complete stability breakdown</strong> – All 6 factors analyzed in detail
                  </li>
                  <li style={{ fontSize: "14px", color: "#6B7280", marginBottom: "8px", lineHeight: "1.6" }}>
                    <strong>Risk assessment</strong> – Identify structural weaknesses affecting your stability
                  </li>
                  <li style={{ fontSize: "14px", color: "#6B7280", marginBottom: "8px", lineHeight: "1.6" }}>
                    <strong>Actionable plan</strong> – 3 specific decisions with timelines and impact scores
                  </li>
                  <li style={{ fontSize: "14px", color: "#6B7280", lineHeight: "1.6" }}>
                    <strong>Permanent record</strong> – Timestamped result you can share with advisors, lenders
                  </li>
                </ul>
              </div>

              <p style={{
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "1.6",
                color: "#6B7280",
                margin: "0"
              }}>
                One-time purchase. Use your results forever. No subscriptions, no hidden fees.
              </p>
            </div>

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
              Get Full Report Today — $69
            </button>

            <p style={{
              fontSize: "13px",
              fontWeight: 400,
              color: "#6B7280",
              margin: "12px 0 0 0",
              textAlign: "center"
            }}>
              ⏱️ Complete your assessment before you make major financial decisions
            </p>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden" style={{ padding: "64px 16px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center" }}>
            <h2 style={{
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: "1.2",
              color: "#0E1A2B",
              margin: "0 0 16px 0"
            }}>
              Your Income Stability Class: Limited Stability
            </h2>
            <p style={{
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "1.6",
              color: "#6B7280",
              margin: "0 0 32px 0"
            }}>
              Your income is vulnerable due to reliance on a single income source.
            </p>

            <div style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "32px 24px",
              marginBottom: "32px"
            }}>
              <div style={{
                fontSize: "48px",
                fontWeight: 700,
                lineHeight: "1",
                color: "#DC2626",
                marginBottom: "12px"
              }}>
                31
              </div>

              <div style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#DC2626",
                marginBottom: "20px",
                lineHeight: "1.2"
              }}>
                Limited Stability
              </div>

              <p style={{
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "1.6",
                color: "#6B7280",
                margin: "0 0 20px 0"
              }}>
                This is your free classification. Your actual income stability goes much deeper.
              </p>

              <div style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #1F6D7A",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "20px"
              }}>
                <div style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#1F6D7A",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  What's in the full report ($69)
                </div>
                <ul style={{
                  margin: "0",
                  padding: "0 0 0 16px",
                  listStyle: "disc"
                }}>
                  <li style={{ fontSize: "13px", color: "#6B7280", marginBottom: "6px", lineHeight: "1.5" }}>
                    <strong>Complete breakdown</strong> – All 6 factors analyzed in detail
                  </li>
                  <li style={{ fontSize: "13px", color: "#6B7280", marginBottom: "6px", lineHeight: "1.5" }}>
                    <strong>Risk assessment</strong> – Identify structural weaknesses
                  </li>
                  <li style={{ fontSize: "13px", color: "#6B7280", marginBottom: "6px", lineHeight: "1.5" }}>
                    <strong>Actionable plan</strong> – 3 specific decisions with timelines
                  </li>
                  <li style={{ fontSize: "13px", color: "#6B7280", lineHeight: "1.5" }}>
                    <strong>Permanent record</strong> – Share with advisors, lenders
                  </li>
                </ul>
              </div>

              <p style={{
                fontSize: "13px",
                fontWeight: 400,
                lineHeight: "1.6",
                color: "#6B7280",
                margin: "0"
              }}>
                One-time purchase. Use forever. No subscriptions, no hidden fees.
              </p>
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
              fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0px 6px 12px rgba(31, 109, 122, 0.25)"}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
            >
              Get Full Report Today — $69
            </button>

            <p style={{
              fontSize: "12px",
              fontWeight: 400,
              color: "#6B7280",
              margin: "12px 0 0 0",
              textAlign: "center"
            }}>
              ⏱️ Complete assessment before major decisions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
