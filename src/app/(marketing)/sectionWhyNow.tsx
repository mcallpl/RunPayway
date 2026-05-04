"use client";

export default function SectionWhyNow() {
  return (
    <section style={{
      backgroundColor: "#FFFFFF",
      padding: "96px 24px",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* DESKTOP */}
        <div className="hidden lg:block">
          <div style={{ textAlign: "center", marginBottom: "72px" }}>
            <h2 style={{
              fontSize: "32px",
              fontWeight: 700,
              lineHeight: "1.2",
              color: "#0E1A2B",
              margin: "0 0 16px 0"
            }}>
              When Do You Need This?
            </h2>
            <p style={{
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: "1.6",
              color: "#6B7280",
              margin: "0"
            }}>
              Income stability matters most when you're making major financial decisions
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "40px"
          }}>
            {[
              {
                icon: "🏠",
                title: "Applying for a Mortgage",
                description: "Lenders evaluate income stability before approving loans. Understand your position before applying."
              },
              {
                icon: "💼",
                title: "Changing Careers",
                description: "Know your financial runway before making a major job change. See how a new income structure affects your stability."
              },
              {
                icon: "💰",
                title: "Seeking Credit or Investment",
                description: "Creditors and investors want proof of income stability. Get concrete evidence of how your income is structured."
              }
            ].map((item, idx) => (
              <div key={idx} style={{
                padding: "32px 28px",
                backgroundColor: "#F9FAFB",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                textAlign: "center"
              }}>
                <div style={{
                  fontSize: "40px",
                  marginBottom: "16px"
                }}>
                  {item.icon}
                </div>
                <h3 style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#0E1A2B",
                  margin: "0 0 12px 0"
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: "15px",
                  fontWeight: 400,
                  lineHeight: "1.6",
                  color: "#6B7280",
                  margin: "0"
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* MOBILE */}
        <div className="lg:hidden">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: "1.2",
              color: "#0E1A2B",
              margin: "0 0 16px 0"
            }}>
              When Do You Need This?
            </h2>
            <p style={{
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "1.6",
              color: "#6B7280",
              margin: "0"
            }}>
              Major financial decisions require clarity
            </p>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}>
            {[
              {
                icon: "🏠",
                title: "Applying for a Mortgage",
                description: "Lenders evaluate income stability before approving loans. Understand your position before applying."
              },
              {
                icon: "💼",
                title: "Changing Careers",
                description: "Know your financial runway before making a major job change."
              },
              {
                icon: "💰",
                title: "Seeking Credit or Investment",
                description: "Creditors and investors want proof of income stability."
              }
            ].map((item, idx) => (
              <div key={idx} style={{
                padding: "24px 20px",
                backgroundColor: "#F9FAFB",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                textAlign: "center"
              }}>
                <div style={{
                  fontSize: "32px",
                  marginBottom: "12px"
                }}>
                  {item.icon}
                </div>
                <h3 style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#0E1A2B",
                  margin: "0 0 8px 0"
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: "1.5",
                  color: "#6B7280",
                  margin: "0"
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
