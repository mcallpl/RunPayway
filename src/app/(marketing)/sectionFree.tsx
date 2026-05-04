"use client";

export default function SectionFree() {
  return (
    <section style={{
      padding: "120px 24px",
      backgroundColor: "#FFFFFF",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* DESKTOP */}
      <div className="hidden lg:block">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <h2 style={{
              fontSize: "48px",
              fontWeight: 700,
              lineHeight: "1.2",
              letterSpacing: "-0.020em",
              color: "#0E1A2B",
              margin: "0 0 20px 0"
            }}>
              Your result is ready.
            </h2>
            <p style={{
              fontSize: "20px",
              fontWeight: 500,
              lineHeight: "1.6",
              color: "#5E6873",
              margin: "0"
            }}>
              Full verification defines your income stability.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "56px"
          }}>
            {/* FREE TIER */}
            <div style={{
              backgroundColor: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "16px",
              padding: "48px 40px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 2px 8px rgba(14, 26, 43, 0.04)"
            }}>
              <div style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "#1F6D7A",
                textTransform: "uppercase",
                marginBottom: "20px"
              }}>
                What you get free
              </div>
              <div style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#0E1A2B",
                marginBottom: "40px"
              }}>
                FREE
              </div>
              <ul style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                marginBottom: "40px"
              }}>
                <li style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#5E6873",
                  lineHeight: "1.7"
                }}>
                  <span style={{ fontWeight: 700, color: "#0E1A2B", display: "block", marginBottom: "4px" }}>Stability classification</span>
                  Your income stability class
                </li>
                <li style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#5E6873",
                  lineHeight: "1.7"
                }}>
                  <span style={{ fontWeight: 700, color: "#0E1A2B", display: "block", marginBottom: "4px" }}>Primary constraint</span>
                  What limits your stability
                </li>
                <li style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#5E6873",
                  lineHeight: "1.7"
                }}>
                  <span style={{ fontWeight: 700, color: "#0E1A2B", display: "block", marginBottom: "4px" }}>Decision definition</span>
                  What to change, impact on score
                </li>
              </ul>
            </div>

            {/* PAID TIER — PREMIUM */}
            <div style={{
              position: "relative",
              backgroundColor: "#FFFFFF",
              border: "2px solid #1F6D7A",
              borderRadius: "16px",
              padding: "48px 40px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 12px rgba(31, 109, 122, 0.08), 0 12px 32px rgba(31, 109, 122, 0.12)"
            }}>
              {/* Recommended Badge */}
              <div style={{
                position: "absolute",
                top: "-14px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#1F6D7A",
                color: "#FFFFFF",
                padding: "6px 18px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 12px rgba(31, 109, 122, 0.2)"
              }}>
                Recommended
              </div>

              <div style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "#1F6D7A",
                textTransform: "uppercase",
                marginBottom: "20px"
              }}>
                Complete verification
              </div>
              <div style={{
                fontSize: "40px",
                fontWeight: 700,
                color: "#0E1A2B",
                marginBottom: "8px"
              }}>
                $69
              </div>
              <div style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#5E6873",
                marginBottom: "40px"
              }}>
                One-time purchase
              </div>

              <ul style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                marginBottom: "48px"
              }}>
                <li style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#5E6873",
                  lineHeight: "1.7"
                }}>
                  <span style={{ fontWeight: 700, color: "#0E1A2B", display: "block", marginBottom: "4px" }}>Full stability report</span>
                  Complete analysis and breakdown
                </li>
                <li style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#5E6873",
                  lineHeight: "1.7"
                }}>
                  <span style={{ fontWeight: 700, color: "#0E1A2B", display: "block", marginBottom: "4px" }}>Risk assessment</span>
                  Identify all structural risks
                </li>
                <li style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#5E6873",
                  lineHeight: "1.7"
                }}>
                  <span style={{ fontWeight: 700, color: "#0E1A2B", display: "block", marginBottom: "4px" }}>Action plan</span>
                  Steps to improve stability
                </li>
              </ul>

              <button style={{
                width: "100%",
                height: "56px",
                backgroundColor: "#1F6D7A",
                color: "#FFFFFF",
                fontSize: "16px",
                fontWeight: 600,
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                transition: "all 200ms ease",
                outline: "2px solid transparent",
                outlineOffset: "4px",
                boxShadow: "0 8px 24px rgba(31, 109, 122, 0.16)"
              }}
              onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"}
              onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(31, 109, 122, 0.24)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(31, 109, 122, 0.16)";
              }}>
                Get Full Report for $69
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>

          {/* System Integrity Footer */}
          <div style={{
            fontSize: "13px",
            fontWeight: 500,
            lineHeight: "1.6",
            color: "#5E6873",
            textAlign: "center",
            marginTop: "80px"
          }}>
            <span style={{ fontWeight: 700, color: "#0E1A2B" }}>Model RP-2.0</span>
            <span style={{ color: "#D1D5DB", margin: "0 8px" }}>·</span>
            Same inputs produce same result
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden" style={{ padding: "64px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{
              fontSize: "32px",
              fontWeight: 700,
              lineHeight: "1.2",
              color: "#0E1A2B",
              margin: "0 0 16px 0"
            }}>
              Your result is ready.
            </h2>

            <p style={{
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "1.6",
              color: "#5E6873",
              margin: "0"
            }}>
              Full verification defines your income stability.
            </p>
          </div>

          {/* Stacked Cards */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            marginBottom: "56px"
          }}>
            {/* FREE TIER */}
            <div style={{
              backgroundColor: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "16px",
              padding: "32px 24px"
            }}>
              <div style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.12em",
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
                marginBottom: "24px"
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
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#5E6873",
                  lineHeight: "1.6"
                }}>
                  <span style={{ fontWeight: 700, color: "#0E1A2B", display: "block", marginBottom: "4px" }}>Stability class</span>
                  Your income stability classification
                </li>
                <li style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#5E6873",
                  lineHeight: "1.6"
                }}>
                  <span style={{ fontWeight: 700, color: "#0E1A2B", display: "block", marginBottom: "4px" }}>Primary constraint</span>
                  What limits your stability
                </li>
                <li style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#5E6873",
                  lineHeight: "1.6"
                }}>
                  <span style={{ fontWeight: 700, color: "#0E1A2B", display: "block", marginBottom: "4px" }}>Decision impact</span>
                  What to change, score impact
                </li>
              </ul>
            </div>

            {/* PAID TIER */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "2px solid #1F6D7A",
              borderRadius: "16px",
              padding: "32px 24px",
              position: "relative"
            }}>
              <div style={{
                position: "absolute",
                top: "-12px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#1F6D7A",
                color: "#FFFFFF",
                padding: "4px 14px",
                borderRadius: "999px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase"
              }}>
                Recommended
              </div>

              <div style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "#1F6D7A",
                textTransform: "uppercase",
                marginBottom: "12px",
                marginTop: "8px"
              }}>
                Complete verification
              </div>
              <div style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#0E1A2B",
                marginBottom: "4px"
              }}>
                $69
              </div>
              <div style={{
                fontSize: "12px",
                fontWeight: 500,
                color: "#5E6873",
                marginBottom: "24px"
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
                marginBottom: "28px"
              }}>
                <li style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#5E6873",
                  lineHeight: "1.6"
                }}>
                  <span style={{ fontWeight: 700, color: "#0E1A2B", display: "block", marginBottom: "4px" }}>Full report</span>
                  Complete analysis and breakdown
                </li>
                <li style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#5E6873",
                  lineHeight: "1.6"
                }}>
                  <span style={{ fontWeight: 700, color: "#0E1A2B", display: "block", marginBottom: "4px" }}>Risk assessment</span>
                  All structural risks identified
                </li>
                <li style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#5E6873",
                  lineHeight: "1.6"
                }}>
                  <span style={{ fontWeight: 700, color: "#0E1A2B", display: "block", marginBottom: "4px" }}>Action plan</span>
                  Steps to improve stability
                </li>
              </ul>

              <button style={{
                width: "100%",
                height: "52px",
                backgroundColor: "#1F6D7A",
                color: "#FFFFFF",
                fontSize: "15px",
                fontWeight: 600,
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                transition: "all 150ms ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(31, 109, 122, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}>
                Get Full Report for $69
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>

          {/* System Integrity Footer */}
          <div style={{
            fontSize: "12px",
            fontWeight: 500,
            lineHeight: "1.6",
            color: "#5E6873",
            textAlign: "center"
          }}>
            <span style={{ fontWeight: 700, color: "#0E1A2B" }}>Model RP-2.0</span>
            <span style={{ color: "#D1D5DB", margin: "0 6px" }}>·</span>
            Same inputs produce same result
          </div>
        </div>
      </div>
    </section>
  );
}
