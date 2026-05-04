"use client";

export default function Section2() {
  const items = [
    { title: "Concentration", description: "Reliance on primary income" },
    { title: "Source Diversity", description: "Distribution across sources" },
    { title: "Forward Visibility", description: "Income already secured" },
    { title: "Stability Pattern", description: "Consistency over time" },
    { title: "Continuity", description: "Income without activity" },
    { title: "Dependency", description: "Dependence on effort" },
  ];

  return (
    <section style={{
      backgroundColor: "#FFFFFF",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* DESKTOP */}
      <div className="hidden lg:block" style={{ padding: "96px 48px" }}>
        <div style={{ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto" }}>
          {/* Header */}
          <h2 style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#0E1A2B",
            margin: "0 0 24px 0",
            lineHeight: "1.2"
          }}>
            What the model evaluates
          </h2>
          <p style={{
            fontSize: "18px",
            fontWeight: 400,
            lineHeight: "1.5",
            color: "#6B7280",
            margin: "0 0 40px 0"
          }}>
            A fixed set of inputs determines the result.
          </p>

          {/* Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            rowGap: "48px",
            marginBottom: "48px"
          }}>
            {items.map((item, idx) => (
              <div key={idx} style={{
                padding: "24px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "12px"
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
                  lineHeight: "1.5",
                  color: "#6B7280",
                  margin: 0
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Text */}
          <div style={{
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "1.5",
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
          {/* Header */}
          <h2 style={{
            fontSize: "28px",
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
            lineHeight: "1.5",
            color: "#6B7280",
            margin: "0 0 28px 0"
          }}>
            A fixed set of inputs determines the result.
          </p>

          {/* Stacked Cards */}
          <div style={{ marginBottom: "28px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {items.map((item, idx) => (
              <div key={idx} style={{
                padding: "20px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "12px"
              }}>
                <div style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#0E1A2B",
                  marginBottom: "8px"
                }}>
                  {item.title}
                </div>
                <p style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: "1.5",
                  color: "#6B7280",
                  margin: 0
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Text */}
          <div style={{
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "1.5",
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
