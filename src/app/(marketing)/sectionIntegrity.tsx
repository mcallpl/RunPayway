"use client";

export default function SectionIntegrity() {
  return (
    <section style={{
      backgroundColor: "#F9FAFB",
      padding: "120px 24px",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* DESKTOP */}
        <div className="hidden lg:block">
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <h2 style={{
              fontSize: "48px",
              fontWeight: 700,
              lineHeight: "1.2",
              letterSpacing: "-0.020em",
              color: "#0E1A2B",
              margin: "0 0 20px 0"
            }}>
              System Integrity
            </h2>
            <p style={{
              fontSize: "20px",
              fontWeight: 500,
              lineHeight: "1.6",
              color: "#5E6873",
              margin: "0"
            }}>
              Fixed rules. Consistent results.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "56px",
            maxWidth: "960px",
            margin: "0 auto"
          }}>
            {[
              {
                icon: "⚙️",
                title: "How it works",
                text: "Your results are determined by fixed inputs. Same income structure = same score. No algorithms. No guessing."
              },
              {
                icon: "🔐",
                title: "Your privacy",
                text: "Your data is private and encrypted. Your results are yours alone. We don't sell, share, or monetize your information."
              }
            ].map((item, i) => (
              <div key={i} style={{
                padding: "48px 40px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(14, 26, 43, 0.04)"
              }}>
                <div style={{
                  fontSize: "40px",
                  marginBottom: "24px",
                  display: "flex",
                  justifyContent: "center"
                }}>
                  {item.icon}
                </div>
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#0E1A2B",
                  margin: "0 0 16px 0",
                  textAlign: "center"
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: "15px",
                  fontWeight: 400,
                  lineHeight: "1.7",
                  color: "#5E6873",
                  margin: "0",
                  textAlign: "center"
                }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* MOBILE */}
        <div className="lg:hidden">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{
              fontSize: "32px",
              fontWeight: 700,
              lineHeight: "1.2",
              color: "#0E1A2B",
              margin: "0 0 16px 0"
            }}>
              System Integrity
            </h2>
            <p style={{
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "1.6",
              color: "#5E6873",
              margin: "0"
            }}>
              Fixed rules. Consistent results.
            </p>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}>
            {[
              {
                icon: "⚙️",
                title: "How it works",
                text: "Your results are determined by fixed inputs. Same income structure = same score."
              },
              {
                icon: "🔐",
                title: "Your privacy",
                text: "Your data is private and encrypted. We don't sell or share your information."
              }
            ].map((item, i) => (
              <div key={i} style={{
                padding: "32px 24px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(14, 26, 43, 0.04)"
              }}>
                <div style={{
                  fontSize: "36px",
                  marginBottom: "16px",
                  display: "flex",
                  justifyContent: "center"
                }}>
                  {item.icon}
                </div>
                <h3 style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "#0E1A2B",
                  margin: "0 0 12px 0",
                  textAlign: "center"
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: "1.6",
                  color: "#5E6873",
                  margin: "0",
                  textAlign: "center"
                }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
