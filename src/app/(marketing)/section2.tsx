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
      padding: "96px 48px",
      background: "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)",
      fontFamily: "Inter, system-ui, sans-serif"
    }}>
      {/* DESKTOP */}
      <div className="hidden lg:block" style={{ maxWidth: "1260px", margin: "0 auto" }}>
        {/* Header */}
        <h2 style={{
          fontSize: "56px",
          lineHeight: 1.1,
          fontWeight: 700,
          letterSpacing: "-0.035em",
          color: "#0E1A2B",
          marginBottom: "16px",
          margin: "0 0 16px 0"
        }}>
          What the model evaluates
        </h2>
        <p style={{
          fontSize: "24px",
          lineHeight: 1.45,
          color: "#6B7280",
          marginBottom: "40px",
          margin: "0 0 40px 0"
        }}>
          A fixed set of inputs determines the result.
        </p>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          columnGap: "32px",
          rowGap: "28px",
          marginBottom: "40px"
        }}>
          {cards.map((card, idx) => (
            <div key={idx} style={{
              minHeight: "210px",
              padding: "40px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E6E8EB",
              borderRadius: "14px",
              boxShadow: "0px 12px 30px rgba(16, 24, 40, 0.05)"
            }}>
              <div style={{
                fontSize: "24px",
                lineHeight: 1.25,
                fontWeight: 700,
                color: "#0E1A2B",
                marginBottom: "24px"
              }}>
                {card.title}
              </div>
              <div style={{
                width: "100%",
                height: "1px",
                backgroundColor: "#E5E7EB",
                marginBottom: "24px"
              }}></div>
              <p style={{
                fontSize: "20px",
                lineHeight: 1.45,
                color: "#6B7280",
                margin: 0
              }}>
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* System Bar */}
        <div style={{
          marginTop: "40px",
          minHeight: "88px",
          padding: "0 40px",
          background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
          border: "1px solid #E6E8EB",
          borderRadius: "12px",
          boxShadow: "0px 10px 24px rgba(16, 24, 40, 0.04)",
          display: "flex",
          alignItems: "center",
          gap: "0"
        }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#0E1A2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginRight: "32px" }} aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <polyline points="9 12 12 15 15 9"></polyline>
          </svg>
          <span style={{
            fontSize: "18px",
            lineHeight: 1.4,
            color: "#0E1A2B",
            fontWeight: 700
          }}>
            Model RP-2.0
          </span>
          <div style={{
            width: "1px",
            height: "28px",
            background: "#D1D5DB",
            margin: "0 32px"
          }}></div>
          <span style={{
            fontSize: "18px",
            lineHeight: 1.4,
            color: "#0E1A2B"
          }}>
            Fixed rules
          </span>
          <div style={{
            width: "1px",
            height: "28px",
            background: "#D1D5DB",
            margin: "0 32px"
          }}></div>
          <span style={{
            fontSize: "18px",
            lineHeight: 1.4,
            color: "#0E1A2B"
          }}>
            Same inputs produce same result
          </span>
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden" style={{ maxWidth: "100%" }}>
        {/* Header */}
        <h2 style={{
          fontSize: "40px",
          lineHeight: 1.15,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: "#0E1A2B",
          margin: "0 0 16px 0",
          paddingLeft: "20px",
          paddingRight: "20px"
        }}>
          What the model evaluates
        </h2>
        <p style={{
          fontSize: "18px",
          lineHeight: 1.4,
          color: "#6B7280",
          margin: "0 0 32px 0",
          paddingLeft: "20px",
          paddingRight: "20px"
        }}>
          A fixed set of inputs determines the result.
        </p>

        {/* Stack */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          marginBottom: "32px",
          paddingLeft: "20px",
          paddingRight: "20px"
        }}>
          {cards.map((card, idx) => (
            <div key={idx} style={{
              minHeight: "180px",
              padding: "32px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E6E8EB",
              borderRadius: "14px",
              boxShadow: "0px 12px 30px rgba(16, 24, 40, 0.05)"
            }}>
              <div style={{
                fontSize: "20px",
                lineHeight: 1.25,
                fontWeight: 700,
                color: "#0E1A2B",
                marginBottom: "16px"
              }}>
                {card.title}
              </div>
              <div style={{
                width: "100%",
                height: "1px",
                backgroundColor: "#E5E7EB",
                marginBottom: "16px"
              }}></div>
              <p style={{
                fontSize: "16px",
                lineHeight: 1.4,
                color: "#6B7280",
                margin: 0
              }}>
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
          minHeight: "auto",
          padding: "24px 32px",
          background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
          border: "1px solid #E6E8EB",
          borderRadius: "12px",
          boxShadow: "0px 10px 24px rgba(16, 24, 40, 0.04)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0E1A2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginRight: "16px" }} aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <polyline points="9 12 12 15 15 9"></polyline>
            </svg>
            <span style={{
              fontSize: "16px",
              lineHeight: 1.4,
              color: "#0E1A2B",
              fontWeight: 700
            }}>
              Model RP-2.0
            </span>
          </div>
          <span style={{
            fontSize: "14px",
            lineHeight: 1.4,
            color: "#6B7280"
          }}>
            Fixed rules · Same inputs produce same result
          </span>
        </div>
      </div>
    </section>
  );
}
