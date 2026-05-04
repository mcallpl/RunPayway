"use client";

export default function Section2() {
  const items = [
    { title: "Concentration", description: "Relying on one income source is a risk" },
    { title: "Source Diversity", description: "More income sources equal more stability" },
    { title: "Forward Visibility", description: "How much of your income is secured for the future?" },
    { title: "Stability Pattern", description: "Income consistency over time matters" },
    { title: "Continuity", description: "Can you sustain income without active work?" },
    { title: "Dependency", description: "How much of your income depends on active effort?" },
  ];

  return (
    <section style={{
      backgroundColor: "#FFFFFF",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* DESKTOP */}
      <div className="hidden lg:block" style={{ padding: "96px 48px" }}>
        <div style={{ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto" }}>
          <h2 style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#0E1A2B",
            margin: "0 0 16px 0",
            lineHeight: "1.2"
          }}>
            What the model evaluates
          </h2>
          <p style={{
            fontSize: "18px",
            fontWeight: 400,
            lineHeight: "1.6",
            color: "#6B7280",
            margin: "0 0 48px 0"
          }}>
            A fixed set of inputs determines the result.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
            rowGap: "48px",
            marginBottom: "48px"
          }}>
            {items.map((item, idx) => (
              <div key={idx} style={{
                padding: "24px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px"
              }}>
                <div style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#0E1A2B",
                  marginBottom: "12px"
                }}>
                  {item.title}
                </div>
                <p style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "1.6",
                  color: "#6B7280",
                  margin: 0
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            textAlign: "center",
            marginBottom: "48px"
          }}>
            <a href="#" style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#1F6D7A",
              textDecoration: "none",
              cursor: "pointer",
              transition: "color 150ms ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#0E1A2B"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#1F6D7A"}
            >
              Unlock Full Report to See Your Complete Breakdown and Actionable Steps →
            </a>
          </div>

          <div style={{
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "1.6",
            color: "#6B7280",
            textAlign: "center"
          }}>
            <span style={{ fontWeight: 600, color: "#0E1A2B" }}>Model RP-2.0</span>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden" style={{ padding: "64px 24px", backgroundColor: "#FFFFFF" }}>
        <div style={{ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto" }}>
          <h2 style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#0E1A2B",
            margin: "0 0 16px 0",
            lineHeight: "1.2"
          }}>
            What the model evaluates
          </h2>
          <p style={{
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "1.6",
            color: "#6B7280",
            margin: "0 0 32px 0"
          }}>
            A fixed set of inputs determines the result.
          </p>

          <div style={{ marginBottom: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {items.map((item, idx) => (
              <div key={idx} style={{
                padding: "20px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px"
              }}>
                <div style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#0E1A2B",
                  marginBottom: "8px"
                }}>
                  {item.title}
                </div>
                <p style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: "1.6",
                  color: "#6B7280",
                  margin: 0
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            textAlign: "center",
            marginBottom: "32px"
          }}>
            <a href="#" style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#1F6D7A",
              textDecoration: "none",
              cursor: "pointer",
              transition: "color 150ms ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#0E1A2B"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#1F6D7A"}
            >
              Unlock Full Report to See Your Complete Breakdown and Actionable Steps →
            </a>
          </div>

          <div style={{
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "1.6",
            color: "#6B7280",
            textAlign: "center"
          }}>
            <span style={{ fontWeight: 600, color: "#0E1A2B" }}>Model RP-2.0</span>
          </div>
        </div>
      </div>
    </section>
  );
}
