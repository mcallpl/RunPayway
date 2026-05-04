"use client";

export default function SectionFree() {
  const TealColor = "#1F6D7A";
  const NavyColor = "#0E1A2B";

  const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17L4 12" stroke={TealColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

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
              color: NavyColor,
              margin: "0 0 20px 0"
            }}>
              Your Result is Ready
            </h2>
            <p style={{
              fontSize: "20px",
              fontWeight: 500,
              lineHeight: "1.6",
              color: "#5E6873",
              margin: "0"
            }}>
              See what you get instantly, and what unlocks with the full report.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: "56px"
          }}>
            {/* FREE TIER */}
            <div style={{
              backgroundColor: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "16px",
              padding: "40px 32px",
              display: "flex",
              flexDirection: "column",
              opacity: 0.85
            }}>
              <div style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: TealColor,
                textTransform: "uppercase",
                marginBottom: "16px"
              }}>
                Instant Result
              </div>
              <div style={{
                fontSize: "28px",
                fontWeight: 700,
                color: NavyColor,
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
                gap: "14px",
                marginBottom: "auto"
              }}>
                {[
                  "Your stability classification",
                  "Primary income constraint",
                  "One key improvement area"
                ].map((item, idx) => (
                  <li key={idx} style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#5E6873",
                    lineHeight: "1.6",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px"
                  }}>
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* PAID TIER — PREMIUM */}
            <div style={{
              position: "relative",
              backgroundColor: "#FFFFFF",
              border: "2px solid " + TealColor,
              borderRadius: "16px",
              padding: "48px 40px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 8px 32px rgba(31, 109, 122, 0.12), 0 2px 8px rgba(31, 109, 122, 0.06)"
            }}>
              {/* Recommended Badge */}
              <div style={{
                position: "absolute",
                top: "-14px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: TealColor,
                color: "#FFFFFF",
                padding: "6px 20px",
                borderRadius: "999px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
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
                color: TealColor,
                textTransform: "uppercase",
                marginBottom: "16px"
              }}>
                Complete Analysis
              </div>
              <div style={{
                fontSize: "40px",
                fontWeight: 700,
                color: NavyColor,
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
                gap: "14px",
                marginBottom: "auto"
              }}>
                {[
                  "Everything in free +",
                  "Complete 6-factor breakdown",
                  "Detailed risk assessment",
                  "3-step personalized action plan",
                  "Impact scores for each action",
                  "Permanent timestamped record"
                ].map((item, idx) => (
                  <li key={idx} style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#0E1A2B",
                    lineHeight: "1.6",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px"
                  }}>
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button style={{
                width: "100%",
                height: "56px",
                backgroundColor: TealColor,
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
                boxShadow: "0 8px 24px rgba(31, 109, 122, 0.16)",
                marginTop: "32px"
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
            <span style={{ fontWeight: 700, color: NavyColor }}>Model RP-2.0</span>
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
              color: NavyColor,
              margin: "0 0 16px 0"
            }}>
              Your Result is Ready
            </h2>

            <p style={{
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "1.6",
              color: "#5E6873",
              margin: "0"
            }}>
              See what you get instantly, and what unlocks with the full report.
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
              padding: "32px 24px",
              opacity: 0.85
            }}>
              <div style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: TealColor,
                textTransform: "uppercase",
                marginBottom: "12px"
              }}>
                Instant Result
              </div>
              <div style={{
                fontSize: "24px",
                fontWeight: 700,
                color: NavyColor,
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
                gap: "12px"
              }}>
                {[
                  "Your stability classification",
                  "Primary income constraint",
                  "One key improvement area"
                ].map((item, idx) => (
                  <li key={idx} style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#5E6873",
                    lineHeight: "1.6",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px"
                  }}>
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* PAID TIER */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "2px solid " + TealColor,
              borderRadius: "16px",
              padding: "32px 24px",
              position: "relative"
            }}>
              <div style={{
                position: "absolute",
                top: "-12px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: TealColor,
                color: "#FFFFFF",
                padding: "4px 16px",
                borderRadius: "999px",
                fontSize: "10px",
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
                color: TealColor,
                textTransform: "uppercase",
                marginBottom: "12px",
                marginTop: "8px"
              }}>
                Complete Analysis
              </div>
              <div style={{
                fontSize: "28px",
                fontWeight: 700,
                color: NavyColor,
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
                gap: "12px",
                marginBottom: "28px"
              }}>
                {[
                  "Everything in free +",
                  "Complete 6-factor breakdown",
                  "Detailed risk assessment",
                  "3-step personalized action plan",
                  "Impact scores for each action",
                  "Permanent timestamped record"
                ].map((item, idx) => (
                  <li key={idx} style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: NavyColor,
                    lineHeight: "1.6",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px"
                  }}>
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button style={{
                width: "100%",
                height: "52px",
                backgroundColor: TealColor,
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
            <span style={{ fontWeight: 700, color: NavyColor }}>Model RP-2.0</span>
            <span style={{ color: "#D1D5DB", margin: "0 6px" }}>·</span>
            Same inputs produce same result
          </div>
        </div>
      </div>
    </section>
  );
}
