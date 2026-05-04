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
      background: "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* DESKTOP */}
      <div className="hidden lg:block" style={{ padding: "96px 0" }}>
        <div style={{ maxWidth: "1260px", margin: "0 auto", padding: "0 48px" }}>
          {/* Header */}
          <h2 style={{
            fontSize: "56px",
            lineHeight: 1.1,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            color: "#0E1A2B",
            margin: "0 0 16px 0"
          }}>
            What the model evaluates
          </h2>
          <p style={{
            fontSize: "24px",
            lineHeight: 1.45,
            color: "#6B7280",
            margin: "0 0 48px 0"
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
            {items.map((item, idx) => (
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
                  {item.title}
                </div>
                <div style={{
                  height: "1px",
                  background: "#E5E7EB",
                  marginBottom: "24px"
                }}></div>
                <p style={{
                  fontSize: "20px",
                  lineHeight: 1.45,
                  color: "#6B7280",
                  margin: 0
                }}>
                  {item.description}
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
            alignItems: "center"
          }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#0E1A2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginRight: "32px" }} aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <polyline points="9 12 12 15 15 9"></polyline>
            </svg>
            <span style={{
              fontSize: "18px",
              lineHeight: 1.4,
              fontWeight: 700,
              color: "#0E1A2B"
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
      </div>

      {/* MOBILE */}
      <div className="lg:hidden" style={{ padding: "56px 20px" }}>
        {/* Header */}
        <h2 style={{
          fontSize: "34px",
          lineHeight: 1.15,
          fontWeight: 700,
          letterSpacing: "-0.025em",
          color: "#0E1A2B",
          margin: "0 0 16px 0"
        }}>
          What the model evaluates
        </h2>
        <p style={{
          fontSize: "18px",
          lineHeight: 1.5,
          fontWeight: 400,
          color: "#6B7280",
          margin: "0 0 32px 0"
        }}>
          A fixed set of inputs determines the result.
        </p>

        {/* Stacked List */}
        <div style={{ marginBottom: "32px" }}>
          {items.map((item, idx) => (
            <div key={idx}>
              <div style={{
                paddingTop: "18px",
                paddingBottom: "18px"
              }}>
                <div style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#0E1A2B",
                  marginBottom: "6px"
                }}>
                  {item.title}
                </div>
                <p style={{
                  fontSize: "16px",
                  lineHeight: 1.45,
                  color: "#6B7280",
                  margin: 0
                }}>
                  {item.description}
                </p>
              </div>
              {idx < items.length - 1 && (
                <div style={{
                  height: "1px",
                  background: "#E5E7EB",
                  marginTop: "18px"
                }}></div>
              )}
            </div>
          ))}
        </div>

        {/* System Bar */}
        <div style={{
          marginTop: "32px",
          padding: "18px 20px",
          borderRadius: "12px",
          background: "linear-gradient(180deg, #FFFFFF 0%, #F3F4F6 100%)",
          border: "1px solid #E5E7EB"
        }}>
          <p style={{
            fontSize: "15px",
            lineHeight: 1.4,
            color: "#0E1A2B",
            margin: 0
          }}>
            <span style={{ fontWeight: 600 }}>Model RP-2.0</span> • Fixed rules • Same inputs produce same result
          </p>
        </div>
      </div>
    </section>
  );
}
