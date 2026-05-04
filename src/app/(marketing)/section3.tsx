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
            fontSize: "32px",
            fontWeight: 700,
            lineHeight: "1.2",
            color: "#0E1A2B",
            textAlign: "center",
            margin: "0 0 16px 0"
          }}>
            Same income. Different outcome.
          </h2>

          {/* Subheadline */}
          <p style={{
            fontSize: "18px",
            fontWeight: 400,
            lineHeight: "1.5",
            color: "#6B7280",
            textAlign: "center",
            margin: "0 0 24px 0"
          }}>
            Income level does not determine stability—structure does.
          </p>

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
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              {/* Label */}
              <div style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#DC2626",
                textAlign: "center",
                marginBottom: "24px",
                lineHeight: "1.2"
              }}>
                1 INCOME SOURCE
              </div>

              {/* Score */}
              <div style={{
                fontSize: "72px",
                fontWeight: 700,
                lineHeight: "1",
                color: "#DC2626",
                textAlign: "center",
                marginBottom: "12px"
              }}>
                31
              </div>

              {/* Stability Label */}
              <div style={{
                fontSize: "16px",
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
                margin: "0",
                textAlign: "center"
              }}>
                Income depends on <span style={{ fontWeight: 600 }}>one source.</span>
              </p>
            </div>

            {/* DASHED LINE BETWEEN CARDS */}
            <div style={{
              position: "absolute",
              top: "0",
              left: "50%",
              height: "100%",
              width: "1px",
              borderLeft: "2px dashed #D1D5DB",
              transform: "translateX(-50%)"
            }}></div>

            {/* RIGHT CARD */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "16px",
              padding: "40px 32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              {/* Label */}
              <div style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#16A34A",
                textAlign: "center",
                marginBottom: "24px",
                lineHeight: "1.2"
              }}>
                MULTIPLE INCOME SOURCES
              </div>

              {/* Score */}
              <div style={{
                fontSize: "72px",
                fontWeight: 700,
                lineHeight: "1",
                color: "#16A34A",
                textAlign: "center",
                marginBottom: "12px"
              }}>
                74
              </div>

              {/* Stability Label */}
              <div style={{
                fontSize: "16px",
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
                margin: "0",
                textAlign: "center"
              }}>
                Income is <span style={{ fontWeight: 600 }}>distributed.</span>
              </p>
            </div>

            {/* CONNECTOR - VS CIRCLE */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              zIndex: 10
            }}>
              {/* Center Circle with VS */}
              <div style={{
                width: "88px",
                height: "88px",
                borderRadius: "999px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px"
              }}>
                <p style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#0E1A2B",
                  margin: "0",
                  textAlign: "center"
                }}>
                  VS
                </p>
              </div>

              {/* Vertical Line Below Circle */}
              <div style={{
                width: "1px",
                height: "60px",
                backgroundColor: "#E5E7EB"
              }}></div>
            </div>
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
              margin: "0",
              lineHeight: "1.6"
            }}>
              Structure determines outcome
            </p>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden" style={{ padding: "64px 16px" }}>
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
            Same income. Different outcome.
          </h2>

          {/* Subheadline */}
          <p style={{
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "1.5",
            color: "#6B7280",
            textAlign: "center",
            margin: "0 0 32px 0"
          }}>
            Income level does not determine stability—structure does.
          </p>

          {/* Stacked Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "32px" }}>
            {/* LEFT CARD */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "16px",
              padding: "32px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}>
              <div style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#DC2626",
                textAlign: "center",
                marginBottom: "16px",
                lineHeight: "1.2"
              }}>
                1 INCOME SOURCE
              </div>
              <div style={{
                fontSize: "56px",
                fontWeight: 700,
                color: "#DC2626",
                textAlign: "center",
                marginBottom: "8px",
                lineHeight: "1"
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
                fontSize: "14px",
                fontWeight: 400,
                color: "#6B7280",
                margin: "0",
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
              padding: "32px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}>
              <div style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#16A34A",
                textAlign: "center",
                marginBottom: "16px",
                lineHeight: "1.2"
              }}>
                MULTIPLE INCOME SOURCES
              </div>
              <div style={{
                fontSize: "56px",
                fontWeight: 700,
                color: "#16A34A",
                textAlign: "center",
                marginBottom: "8px",
                lineHeight: "1"
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
                fontSize: "14px",
                fontWeight: 400,
                color: "#6B7280",
                margin: "0",
                textAlign: "center"
              }}>
                Income is <span style={{ fontWeight: 600 }}>distributed.</span>
              </p>
            </div>
          </div>

          {/* VS Circle Mobile */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px"
          }}>
            <div style={{
              width: "72px",
              height: "72px",
              borderRadius: "999px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <p style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#0E1A2B",
                margin: "0"
              }}>
                VS
              </p>
            </div>
          </div>

          {/* Bottom Text and Arrow */}
          <div style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px"
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            <p style={{
              fontSize: "13px",
              fontWeight: 400,
              color: "#6B7280",
              margin: "0",
              lineHeight: "1.6"
            }}>
              Structure determines outcome
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
