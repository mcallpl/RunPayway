"use client";

export default function Section4() {
  return (
    <section style={{
      padding: "96px 24px",
      backgroundColor: "#FFFFFF",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* DESKTOP */}
      <div className="hidden lg:block">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Header */}
          <h2 style={{
            fontSize: "32px",
            fontWeight: 700,
            lineHeight: "1.2",
            color: "#0E1A2B",
            textAlign: "center",
            margin: "0 0 16px 0"
          }}>
            Your result is ready.
          </h2>
          <p style={{
            fontSize: "18px",
            fontWeight: 400,
            lineHeight: "1.5",
            color: "#6B7280",
            textAlign: "center",
            margin: "0 0 48px 0"
          }}>
            Full verification defines your income stability.
          </p>

          {/* Two Column Layout */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            marginBottom: "48px"
          }}>
            {/* FREE TIER */}
            <div style={{
              backgroundColor: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              padding: "40px 32px"
            }}>
              <div style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#1F6D7A",
                textTransform: "uppercase",
                marginBottom: "16px"
              }}>
                What you get free
              </div>
              <div style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#0E1A2B",
                marginBottom: "32px"
              }}>
                FREE
              </div>
              <ul style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "16px"
              }}>
                <li style={{
                  fontSize: "15px",
                  fontWeight: 400,
                  color: "#6B7280",
                  lineHeight: "1.5"
                }}>
                  <span style={{ fontWeight: 600, color: "#0E1A2B" }}>Stability classification</span><br />
                  Your income stability class
                </li>
                <li style={{
                  fontSize: "15px",
                  fontWeight: 400,
                  color: "#6B7280",
                  lineHeight: "1.5"
                }}>
                  <span style={{ fontWeight: 600, color: "#0E1A2B" }}>Primary constraint</span><br />
                  What limits your stability
                </li>
                <li style={{
                  fontSize: "15px",
                  fontWeight: 400,
                  color: "#6B7280",
                  lineHeight: "1.5"
                }}>
                  <span style={{ fontWeight: 600, color: "#0E1A2B" }}>Decision definition</span><br />
                  What to change, impact on score
                </li>
              </ul>
            </div>

            {/* DIVIDER */}
            <div style={{
              position: "relative",
              backgroundColor: "#FFFFFF",
              border: "2px solid #1F6D7A",
              borderRadius: "12px",
              padding: "40px 32px"
            }}>
              {/* Recommended Badge */}
              <div style={{
                position: "absolute",
                top: "-12px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#1F6D7A",
                color: "#FFFFFF",
                padding: "4px 16px",
                borderRadius: "999px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                whiteSpace: "nowrap"
              }}>
                Recommended
              </div>

              <div style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#1F6D7A",
                textTransform: "uppercase",
                marginBottom: "16px"
              }}>
                Complete verification
              </div>
              <div style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#0E1A2B",
                marginBottom: "8px"
              }}>
                $69
              </div>
              <div style={{
                fontSize: "13px",
                fontWeight: 400,
                color: "#6B7280",
                marginBottom: "32px"
              }}>
                One-time purchase
              </div>

              <ul style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                marginBottom: "32px"
              }}>
                <li style={{
                  fontSize: "15px",
                  fontWeight: 400,
                  color: "#6B7280",
                  lineHeight: "1.5"
                }}>
                  <span style={{ fontWeight: 600, color: "#0E1A2B" }}>Full stability report</span><br />
                  Complete analysis and breakdown
                </li>
                <li style={{
                  fontSize: "15px",
                  fontWeight: 400,
                  color: "#6B7280",
                  lineHeight: "1.5"
                }}>
                  <span style={{ fontWeight: 600, color: "#0E1A2B" }}>Risk assessment</span><br />
                  Identify all structural risks
                </li>
                <li style={{
                  fontSize: "15px",
                  fontWeight: 400,
                  color: "#6B7280",
                  lineHeight: "1.5"
                }}>
                  <span style={{ fontWeight: 600, color: "#0E1A2B" }}>Action plan</span><br />
                  Steps to improve stability
                </li>
              </ul>

              <button style={{
                width: "100%",
                height: "52px",
                backgroundColor: "#1F6D7A",
                color: "#FFFFFF",
                fontSize: "16px",
                fontWeight: 600,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                transition: "all 150ms ease",
                outline: "2px solid transparent",
                outlineOffset: "4px"
              }}
              onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"}
              onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0px 8px 16px rgba(31, 109, 122, 0.3)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
              >
                Start Complete Verification
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>

          {/* System Integrity Footer */}
          <div style={{
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "1.5",
            color: "#6B7280",
            textAlign: "center"
          }}>
            <span style={{ fontWeight: 600, color: "#0E1A2B" }}>Model RP-2.0</span>
            <span style={{ color: "#D1D5DB", margin: "0 8px" }}>·</span>
            Same inputs produce same result
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden" style={{ padding: "64px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Header */}
          <h2 style={{
            fontSize: "28px",
            fontWeight: 700,
            lineHeight: "1.2",
            color: "#0E1A2B",
            textAlign: "center",
            margin: "0 0 16px 0"
          }}>
            Your result is ready.
          </h2>
          <p style={{
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "1.5",
            color: "#6B7280",
            textAlign: "center",
            margin: "0 0 32px 0"
          }}>
            Full verification defines your income stability.
          </p>

          {/* Stacked Cards */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginBottom: "32px"
          }}>
            {/* FREE TIER */}
            <div style={{
              backgroundColor: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              padding: "28px 20px"
            }}>
              <div style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#1F6D7A",
                textTransform: "uppercase",
                marginBottom: "12px"
              }}>
                What you get free
              </div>
              <div style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#0E1A2B",
                marginBottom: "20px"
              }}>
                FREE
              </div>
              <ul style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}>
                <li style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#6B7280",
                  lineHeight: "1.5"
                }}>
                  <span style={{ fontWeight: 600, color: "#0E1A2B" }}>Stability class</span><br />
                  Your income stability classification
                </li>
                <li style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#6B7280",
                  lineHeight: "1.5"
                }}>
                  <span style={{ fontWeight: 600, color: "#0E1A2B" }}>Primary constraint</span><br />
                  What limits your stability
                </li>
                <li style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#6B7280",
                  lineHeight: "1.5"
                }}>
                  <span style={{ fontWeight: 600, color: "#0E1A2B" }}>Decision impact</span><br />
                  What to change, score impact
                </li>
              </ul>
            </div>

            {/* FULL TIER */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "2px solid #1F6D7A",
              borderRadius: "12px",
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
                padding: "3px 12px",
                borderRadius: "999px",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase"
              }}>
                Recommended
              </div>

              <div style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#1F6D7A",
                textTransform: "uppercase",
                marginBottom: "12px",
                marginTop: "8px"
              }}>
                Complete verification
              </div>
              <div style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#0E1A2B",
                marginBottom: "4px"
              }}>
                $69
              </div>
              <div style={{
                fontSize: "12px",
                fontWeight: 400,
                color: "#6B7280",
                marginBottom: "20px"
              }}>
                One-time purchase
              </div>

              <ul style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginBottom: "20px"
              }}>
                <li style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#6B7280",
                  lineHeight: "1.5"
                }}>
                  <span style={{ fontWeight: 600, color: "#0E1A2B" }}>Full report</span><br />
                  Complete analysis and breakdown
                </li>
                <li style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#6B7280",
                  lineHeight: "1.5"
                }}>
                  <span style={{ fontWeight: 600, color: "#0E1A2B" }}>Risk assessment</span><br />
                  All structural risks identified
                </li>
                <li style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#6B7280",
                  lineHeight: "1.5"
                }}>
                  <span style={{ fontWeight: 600, color: "#0E1A2B" }}>Action plan</span><br />
                  Steps to improve stability
                </li>
              </ul>

              <button style={{
                width: "100%",
                height: "48px",
                backgroundColor: "#1F6D7A",
                color: "#FFFFFF",
                fontSize: "15px",
                fontWeight: 600,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                transition: "all 150ms ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0px 6px 12px rgba(31, 109, 122, 0.25)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
              >
                Start Verification
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>

          {/* System Integrity Footer */}
          <div style={{
            fontSize: "11px",
            fontWeight: 400,
            lineHeight: "1.5",
            color: "#6B7280",
            textAlign: "center"
          }}>
            <span style={{ fontWeight: 600, color: "#0E1A2B" }}>Model RP-2.0</span>
            <span style={{ color: "#D1D5DB", margin: "0 6px" }}>·</span>
            Same inputs produce same result
          </div>
        </div>
      </div>
    </section>
  );
}
