"use client";

export default function Section2() {
  const cards = [
    { title: "Concentration", description: "Reliance on primary income" },
    { title: "Source Diversity", description: "Distribution across sources" },
    { title: "Forward Visibility", description: "Income already secured" },
    { title: "Stability Pattern", description: "Consistency over time" },
    { title: "Continuity", description: "Income without activity" },
    { title: "Dependency", description: "Dependence on effort" },
  ];

  return (
    <section style={{
      padding: "96px 24px 96px 24px",
      background: "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)",
      fontFamily: "Inter, system-ui, sans-serif"
    }}>
      {/* DESKTOP */}
      <div className="hidden lg:block" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <h2 style={{ fontSize: "40px", fontWeight: 700, lineHeight: 1.2, color: "#0E1A2B", margin: "0 0 12px 0" }}>
          What the model evaluates
        </h2>
        <p style={{ fontSize: "18px", fontWeight: 400, color: "#6B7280", margin: "0 0 40px 0" }}>
          A fixed set of inputs determines the result.
        </p>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", columnGap: "24px", rowGap: "24px", marginBottom: "48px" }}>
          {cards.map((card, idx) => (
            <div key={idx} style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid #E5E7EB",
              boxShadow: "0px 6px 18px rgba(16, 24, 40, 0.06)"
            }}>
              <div style={{ fontSize: "18px", fontWeight: 600, color: "#0E1A2B", marginBottom: "12px" }}>
                {card.title}
              </div>
              <div style={{ height: "1px", backgroundColor: "#E5E7EB", marginBottom: "12px" }}></div>
              <p style={{ fontSize: "14px", fontWeight: 400, color: "#6B7280", margin: 0 }}>
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* System Bar */}
        <div style={{
          marginTop: "48px",
          backgroundColor: "#F1F5F9",
          borderRadius: "16px",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: "24px"
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0E1A2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <polyline points="9 12 12 15 15 9"></polyline>
          </svg>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#374151", margin: 0 }}>
            Model RP-2.0 <span style={{ color: "#9CA3AF" }}>•</span> Fixed rules <span style={{ color: "#9CA3AF" }}>•</span> Same inputs produce same result
          </span>
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden" style={{ maxWidth: "100%" }}>
        {/* Header */}
        <h2 style={{ fontSize: "32px", fontWeight: 700, lineHeight: 1.2, color: "#0E1A2B", margin: "0 0 12px 0", paddingLeft: "20px", paddingRight: "20px" }}>
          What the model evaluates
        </h2>
        <p style={{ fontSize: "16px", fontWeight: 400, color: "#6B7280", margin: "0 0 32px 0", paddingLeft: "20px", paddingRight: "20px" }}>
          A fixed set of inputs determines the result.
        </p>

        {/* Stack */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "32px", paddingLeft: "20px", paddingRight: "20px" }}>
          {cards.map((card, idx) => (
            <div key={idx} style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid #E5E7EB",
              boxShadow: "0px 6px 18px rgba(16, 24, 40, 0.06)"
            }}>
              <div style={{ fontSize: "18px", fontWeight: 600, color: "#0E1A2B", marginBottom: "12px" }}>
                {card.title}
              </div>
              <div style={{ height: "1px", backgroundColor: "#E5E7EB", marginBottom: "12px" }}></div>
              <p style={{ fontSize: "14px", fontWeight: 400, color: "#6B7280", margin: 0 }}>
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* System Bar Mobile */}
        <div style={{
          marginTop: "32px",
          marginLeft: "20px",
          marginRight: "20px",
          backgroundColor: "#F1F5F9",
          borderRadius: "16px",
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          alignItems: "flex-start"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0E1A2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <polyline points="9 12 12 15 15 9"></polyline>
            </svg>
            <span style={{ fontSize: "14px", fontWeight: 500, color: "#374151", margin: 0 }}>
              Model RP-2.0 <span style={{ color: "#9CA3AF" }}>•</span> Fixed rules <span style={{ color: "#9CA3AF" }}>•</span> Same inputs produce same result
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
