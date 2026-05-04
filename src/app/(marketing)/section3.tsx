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
            marginBottom: "80px"
          }}>
            {/* LEFT CARD */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "16px",
              padding: "40px 32px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: "420px"
            }}>
              {/* Icon Circle */}
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "999px",
                backgroundColor: "rgba(220, 38, 38, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                flexShrink: 0
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>

              {/* Label */}
              <div style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#DC2626",
                textAlign: "center",
                marginBottom: "24px",
                lineHeight: 1.2
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
                marginBottom: "12px"
              }}>
                31
              </div>

              {/* Stability Label */}
              <div style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#DC2626",
                textAlign: "center",
                marginBottom: "24px"
              }}>
                Limited Stability
              </div>

              {/* Divider */}
              <div style={{
                height: "1px",
                backgroundColor: "#E5E7EB",
                width: "100%",
                marginBottom: "24px"
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
              padding: "40px 32px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: "420px"
            }}>
              {/* Icon Circle */}
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "999px",
                backgroundColor: "rgba(22, 163, 74, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                flexShrink: 0
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
                fontSize: "32px",
                fontWeight: 700,
                color: "#16A34A",
                textAlign: "center",
                marginBottom: "24px",
                lineHeight: 1.2
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
                marginBottom: "12px"
              }}>
                74
              </div>

              {/* Stability Label */}
              <div style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#16A34A",
                textAlign: "center",
                marginBottom: "24px"
              }}>
                Established Stability
              </div>

              {/* Divider */}
              <div style={{
                height: "1px",
                backgroundColor: "#E5E7EB",
                width: "100%",
                marginBottom: "24px"
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

            {/* CONNECTOR SYSTEM */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "0",
              right: "0",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none"
            }}>
              {/* Horizontal Dashed Line */}
              <div style={{
                position: "absolute",
                width: "100%",
                height: "1px",
                borderTop: "1px dashed #D1D5DB",
                left: 0,
                right: 0
              }}></div>

              {/* Center Circle with VS */}
              <div style={{
                position: "absolute",
                width: "88px",
                height: "88px",
                borderRadius: "999px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10
              }}>
                <p style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#0E1A2B",
                  margin: 0,
                  textAlign: "center"
                }}>
                  VS
                </p>
              </div>
            </div>

            {/* VERTICAL DASHED LINE FROM CENTER */}
            <div style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translateX(-50%)",
              width: "1px",
              height: "60px",
              borderLeft: "1px dashed #E5E7EB"
            }}></div>
          </div>

          {/* Bottom Text and Arrow */}
          <div style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            <p style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "#6B7280",
              margin: 0,
              lineHeight: 1.6
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
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "32px" }}>
          {/* LEFT CARD */}
          <div style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "14px",
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "999px",
              backgroundColor: "rgba(220, 38, 38, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#DC2626",
              textAlign: "center",
              marginBottom: "16px"
            }}>
              1 INCOME SOURCE
            </div>
            <div style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "#DC2626",
              textAlign: "center",
              marginBottom: "8px",
              lineHeight: 1
            }}>
              31
            </div>
            <div style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#DC2626",
              textAlign: "center",
              marginBottom: "16px"
            }}>
              Limited Stability
            </div>
            <div style={{
              height: "1px",
              backgroundColor: "#E5E7EB",
              width: "100%",
              marginBottom: "16px"
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
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "999px",
              backgroundColor: "rgba(22, 163, 74, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#16A34A",
              textAlign: "center",
              marginBottom: "16px"
            }}>
              MULTIPLE INCOME SOURCES
            </div>
            <div style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "#16A34A",
              textAlign: "center",
              marginBottom: "8px",
              lineHeight: 1
            }}>
              74
            </div>
            <div style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#16A34A",
              textAlign: "center",
              marginBottom: "16px"
            }}>
              Established Stability
            </div>
            <div style={{
              height: "1px",
              backgroundColor: "#E5E7EB",
              width: "100%",
              marginBottom: "16px"
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

        {/* Bottom Text and Arrow */}
        <div style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px"
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          <p style={{
            fontSize: "12px",
            fontWeight: 400,
            color: "#6B7280",
            margin: 0,
            lineHeight: 1.6
          }}>
            Structure determines outcome
          </p>
        </div>
      </div>
    </section>
  );
}
