"use client";

export default function SectionWhoUsesThis() {
  return (
    <section style={{
      backgroundColor: "#F4F1EA",
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
              Who Recommends This
            </h2>
            <p style={{
              fontSize: "20px",
              fontWeight: 500,
              lineHeight: "1.6",
              color: "#5E6873",
              margin: "0"
            }}>
              Professionals use RunPayway™ to give clients concrete clarity
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "48px"
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
                padding: "48px 40px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #DDD5CB",
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(14, 26, 43, 0.04)"
              }}>
                <div style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#1F6D7A",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "16px"
                }}>
                  {item.role}
                </div>
                <p style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  lineHeight: "1.7",
                  color: "#5E6873",
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
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
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
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "1.6",
              color: "#5E6873",
              margin: "0"
            }}>
              Professionals use it to give clients clarity
            </p>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px"
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
                padding: "32px 24px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #DDD5CB",
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(14, 26, 43, 0.04)"
              }}>
                <div style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#1F6D7A",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "12px"
                }}>
                  {item.role}
                </div>
                <p style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  lineHeight: "1.6",
                  color: "#5E6873",
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
