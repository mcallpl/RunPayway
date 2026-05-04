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
                This report provides your classification based on your income structure. See where you stand and what needs to change.
              </p>

              <p style={{
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "1.6",
                color: "#6B7280",
                margin: "0"
              }}>
                To get a full breakdown of your stability, risk assessment, and personalized steps for improvement, unlock the full report for just $69.
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
              Unlock Your Full Report for $69
            </button>
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
                margin: "0 0 16px 0"
              }}>
                This report provides your classification based on your income structure. See where you stand and what needs to change.
              </p>

              <p style={{
                fontSize: "13px",
                fontWeight: 400,
                lineHeight: "1.6",
                color: "#6B7280",
                margin: "0"
              }}>
                To get a full breakdown of your stability, risk assessment, and personalized steps for improvement, unlock the full report for just $69.
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
              Unlock Your Full Report for $69
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
