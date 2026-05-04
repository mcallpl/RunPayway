"use client";

export default function Section3() {
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
            fontSize: "40px",
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "#0E1A2B",
            textAlign: "center",
            margin: "0 0 16px 0"
          }}>
            Same income. Different outcome.
          </h2>
          <p style={{
            fontSize: "18px",
            fontWeight: 400,
            color: "#6B7280",
            textAlign: "center",
            margin: "0 0 24px 0"
          }}>
            Income level does not determine stability. Structure does.
          </p>

          {/* Info Pill */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "48px"
          }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              borderRadius: "999px",
              backgroundColor: "#F3F4F6"
            }}>
              <span style={{ fontSize: "14px", color: "#6B7280" }}>$</span>
              <span style={{
                fontSize: "14px",
                color: "#374151"
              }}>
                Both examples: $150K annual income
              </span>
            </div>
          </div>

          {/* Two Column Layout */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            position: "relative",
            marginBottom: "40px"
          }}>
            {/* LEFT CARD */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "16px",
              padding: "32px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "380px"
            }}>
              {/* Icon Circle */}
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "999px",
                backgroundColor: "rgba(220,38,38,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px"
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>

              {/* Label */}
              <div style={{
                fontSize: "12px",
                letterSpacing: "0.12em",
                fontWeight: 600,
                color: "#DC2626",
                textAlign: "center",
                marginBottom: "12px",
                textTransform: "uppercase"
              }}>
                1 INCOME SOURCE
              </div>

              {/* Score */}
              <div style={{
                fontSize: "72px",
                fontWeight: 700,
                lineHeight: 1,
                color: "#DC2626",
                textAlign: "center",
                marginBottom: "8px"
              }}>
                31
              </div>

              {/* Stability Label */}
              <div style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#DC2626",
                textAlign: "center",
                marginBottom: "20px"
              }}>
                Limited Stability
              </div>

              {/* Divider */}
              <div style={{
                height: "1px",
                backgroundColor: "#E5E7EB",
                marginBottom: "20px"
              }}></div>

              {/* Description */}
              <p style={{
                fontSize: "16px",
                fontWeight: 400,
                color: "#6B7280",
                margin: 0,
                textAlign: "center"
              }}>
                Income depends on <span style={{ fontWeight: 600 }}>one source.</span>
              </p>
            </div>

            {/* RIGHT CARD */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "16px",
              padding: "32px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "380px"
            }}>
              {/* Icon Circle */}
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "999px",
                backgroundColor: "rgba(22,163,74,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px"
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>

              {/* Label */}
              <div style={{
                fontSize: "12px",
                letterSpacing: "0.12em",
                fontWeight: 600,
                color: "#16A34A",
                textAlign: "center",
                marginBottom: "12px",
                textTransform: "uppercase"
              }}>
                MULTIPLE INCOME SOURCES
              </div>

              {/* Score */}
              <div style={{
                fontSize: "72px",
                fontWeight: 700,
                lineHeight: 1,
                color: "#16A34A",
                textAlign: "center",
                marginBottom: "8px"
              }}>
                74
              </div>

              {/* Stability Label */}
              <div style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#16A34A",
                textAlign: "center",
                marginBottom: "20px"
              }}>
                Established Stability
              </div>

              {/* Divider */}
              <div style={{
                height: "1px",
                backgroundColor: "#E5E7EB",
                marginBottom: "20px"
              }}></div>

              {/* Description */}
              <p style={{
                fontSize: "16px",
                fontWeight: 400,
                color: "#6B7280",
                margin: 0,
                textAlign: "center"
              }}>
                Income is <span style={{ fontWeight: 600 }}>distributed.</span>
              </p>
            </div>

            {/* CENTER CONNECTOR */}
            <div style={{
              position: "absolute",
              top: "0",
              left: "50%",
              transform: "translateX(-50%)",
              width: "1px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none"
            }}>
              {/* Dashed Line */}
              <div style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderLeft: "1px dashed #D1D5DB"
              }}></div>

              {/* Horizontal Dashed Line */}
              <div style={{
                position: "absolute",
                top: "50%",
                left: "-9999px",
                width: "19998px",
                height: "1px",
                borderTop: "1px dashed #D1D5DB"
              }}></div>

              {/* Circle Badge */}
              <div style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                width: "88px",
                height: "88px",
                borderRadius: "999px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px",
                textAlign: "center",
                zIndex: 10
              }}>
                <p style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#6B7280",
                  lineHeight: 1.3,
                  margin: 0
                }}>
                  Structure determines outcome
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Indicator */}
          <div style={{
            textAlign: "center",
            marginTop: "48px"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 8px", display: "block" }}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            <p style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "#6B7280",
              margin: 0
            }}>
              Structure determines outcome
            </p>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden" style={{ padding: "64px 16px" }}>
        {/* Header */}
        <h2 style={{
          fontSize: "28px",
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
          color: "#0E1A2B",
          textAlign: "center",
          margin: "0 0 10px 0"
        }}>
          Same income. Different outcome.
        </h2>
        <p style={{
          fontSize: "15px",
          fontWeight: 400,
          color: "#6B7280",
          textAlign: "center",
          margin: "0 0 18px 0"
        }}>
          Income level does not determine stability. Structure does.
        </p>

        {/* Info Pill */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "28px"
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 12px",
            borderRadius: "999px",
            backgroundColor: "#F3F4F6"
          }}>
            <span style={{ fontSize: "12px", color: "#6B7280" }}>$</span>
            <span style={{
              fontSize: "12px",
              color: "#374151"
            }}>
              Both: $150K
            </span>
          </div>
        </div>

        {/* Stacked Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "28px" }}>
          {/* LEFT CARD */}
          <div style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "14px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "999px",
              backgroundColor: "rgba(220,38,38,0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px"
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div style={{
              fontSize: "10px",
              letterSpacing: "0.1em",
              fontWeight: 600,
              color: "#DC2626",
              textAlign: "center",
              marginBottom: "8px",
              textTransform: "uppercase"
            }}>
              1 Income Source
            </div>
            <div style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "#DC2626",
              textAlign: "center",
              marginBottom: "4px",
              lineHeight: 1
            }}>
              31
            </div>
            <div style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#DC2626",
              textAlign: "center",
              marginBottom: "14px"
            }}>
              Limited Stability
            </div>
            <div style={{
              height: "1px",
              backgroundColor: "#E5E7EB",
              marginBottom: "14px"
            }}></div>
            <p style={{
              fontSize: "13px",
              fontWeight: 400,
              color: "#6B7280",
              margin: 0,
              textAlign: "center"
            }}>
              Income depends on <span style={{ fontWeight: 600 }}>one source.</span>
            </p>
          </div>

          {/* RIGHT CARD */}
          <div style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "14px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "999px",
              backgroundColor: "rgba(22,163,74,0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px"
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div style={{
              fontSize: "10px",
              letterSpacing: "0.1em",
              fontWeight: 600,
              color: "#16A34A",
              textAlign: "center",
              marginBottom: "8px",
              textTransform: "uppercase"
            }}>
              Multiple Sources
            </div>
            <div style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "#16A34A",
              textAlign: "center",
              marginBottom: "4px",
              lineHeight: 1
            }}>
              74
            </div>
            <div style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#16A34A",
              textAlign: "center",
              marginBottom: "14px"
            }}>
              Established Stability
            </div>
            <div style={{
              height: "1px",
              backgroundColor: "#E5E7EB",
              marginBottom: "14px"
            }}></div>
            <p style={{
              fontSize: "13px",
              fontWeight: 400,
              color: "#6B7280",
              margin: 0,
              textAlign: "center"
            }}>
              Income is <span style={{ fontWeight: 600 }}>distributed.</span>
            </p>
          </div>
        </div>

        {/* Bottom Indicator */}
        <div style={{
          textAlign: "center"
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 5px", display: "block" }}>
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          <p style={{
            fontSize: "12px",
            fontWeight: 400,
            color: "#6B7280",
            margin: 0
          }}>
            Structure determines outcome
          </p>
        </div>
      </div>
    </section>
  );
}
