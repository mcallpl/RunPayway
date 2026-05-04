"use client";

export default function SectionWhoUsesThis() {
  return (
    <section style={{
      backgroundColor: "#F9FAFB",
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
              Who Recommends This
            </h2>
            <p style={{
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: "1.6",
              color: "#6B7280",
              margin: "0"
            }}>
              Professionals use RunPayway™ to give clients concrete clarity
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "40px"
          }}>
            {[
              {
                role: "Financial Advisors",
                use: "Help clients understand income structure before major decisions"
              },
              {
                role: "Mortgage Brokers",
                use: "Provide borrowers with proof of income stability for lender review"
              },
              {
                role: "Accountants & CPAs",
                use: "Quantify income risk and recommend structural improvements to clients"
              }
            ].map((item, idx) => (
              <div key={idx} style={{
                padding: "32px 28px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "12px"
              }}>
                <div style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#1F6D7A",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "12px"
                }}>
                  {item.role}
                </div>
                <p style={{
                  fontSize: "15px",
                  fontWeight: 400,
                  lineHeight: "1.6",
                  color: "#6B7280",
                  margin: "0"
                }}>
                  {item.use}
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
              Who Recommends This
            </h2>
            <p style={{
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "1.6",
              color: "#6B7280",
              margin: "0"
            }}>
              Professionals use it to give clients clarity
            </p>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}>
            {[
              {
                role: "Financial Advisors",
                use: "Help clients understand income structure before major decisions"
              },
              {
                role: "Mortgage Brokers",
                use: "Provide borrowers with proof of income stability"
              },
              {
                role: "Accountants & CPAs",
                use: "Quantify income risk and recommend improvements"
              }
            ].map((item, idx) => (
              <div key={idx} style={{
                padding: "24px 20px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "12px"
              }}>
                <div style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#1F6D7A",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "8px"
                }}>
                  {item.role}
                </div>
                <p style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: "1.5",
                  color: "#6B7280",
                  margin: "0"
                }}>
                  {item.use}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
