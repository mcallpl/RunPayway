"use client";

export default function SectionWhoUsesThis() {
  const TealColor = "#1F6D7A";
  const NavyColor = "#0E1A2B";

  const AdvisorIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="18" cy="12" r="5" stroke={TealColor} strokeWidth="2.5"/>
      <path d="M10 22C10 18.13 13.13 15 17 15C20.87 15 24 18.13 24 22V28H10V22Z" stroke={TealColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="32" cy="16" r="6" stroke={TealColor} strokeWidth="2.5"/>
      <path d="M22 28C22 23.58 25.58 20 30 20C34.42 20 38 23.58 38 28V36H22V28Z" stroke={TealColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const HomeIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path d="M8 22L24 10L40 22V38C40 39.1 39.1 40 38 40H10C8.9 40 8 39.1 8 38V22Z" stroke={TealColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 40V28H28V40" stroke={TealColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="18" y="22" width="12" height="8" stroke={TealColor} strokeWidth="2.5" fill="none"/>
    </svg>
  );

  const DocumentIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path d="M14 6H34C35.1 6 36 6.9 36 8V40C36 41.1 35.1 42 34 42H14C12.9 42 12 41.1 12 40V8C12 6.9 12.9 6 14 6Z" stroke={TealColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 14H30M18 22H30M18 30H26" stroke={TealColor} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );

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
              color: NavyColor,
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
                Icon: AdvisorIcon,
                role: "Financial Advisors",
                use: "Help clients understand income structure before major decisions"
              },
              {
                Icon: HomeIcon,
                role: "Mortgage Brokers",
                use: "Provide borrowers with proof of income stability for lender review"
              },
              {
                Icon: DocumentIcon,
                role: "Accountants & CPAs",
                use: "Quantify income risk and recommend structural improvements"
              }
            ].map((item, idx) => (
              <div key={idx} style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #DDD5CB",
                borderRadius: "16px",
                padding: "48px 40px",
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(14, 26, 43, 0.04)",
                transition: "all 200ms ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(14, 26, 43, 0.08)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(14, 26, 43, 0.04)";
                e.currentTarget.style.transform = "translateY(0)";
              }}>
                <div style={{
                  marginBottom: "32px",
                  display: "flex",
                  justifyContent: "center"
                }}>
                  <item.Icon />
                </div>
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: NavyColor,
                  margin: "0 0 16px 0",
                  lineHeight: "1.3"
                }}>
                  {item.role}
                </h3>
                <p style={{
                  fontSize: "15px",
                  fontWeight: 400,
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
          <div style={{ textAlign: "center", marginBottom: "56px", padding: "0 16px" }}>
            <h2 style={{
              fontSize: "32px",
              fontWeight: 700,
              lineHeight: "1.2",
              color: NavyColor,
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
              Professionals use RunPayway™ to give clients concrete clarity
            </p>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            padding: "0 16px"
          }}>
            {[
              {
                Icon: AdvisorIcon,
                role: "Financial Advisors",
                use: "Help clients understand income structure before major decisions"
              },
              {
                Icon: HomeIcon,
                role: "Mortgage Brokers",
                use: "Provide borrowers with proof of income stability for lender review"
              },
              {
                Icon: DocumentIcon,
                role: "Accountants & CPAs",
                use: "Quantify income risk and recommend structural improvements"
              }
            ].map((item, idx) => (
              <div key={idx} style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #DDD5CB",
                borderRadius: "16px",
                padding: "32px 24px",
                textAlign: "center"
              }}>
                <div style={{
                  marginBottom: "24px",
                  display: "flex",
                  justifyContent: "center"
                }}>
                  <svg width="40" height="40" viewBox="0 0 48 48" fill="none" style={{ transform: "scale(0.83)" }}>
                    <item.Icon />
                  </svg>
                </div>
                <h3 style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: NavyColor,
                  margin: "0 0 12px 0",
                  lineHeight: "1.3"
                }}>
                  {item.role}
                </h3>
                <p style={{
                  fontSize: "14px",
                  fontWeight: 400,
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
