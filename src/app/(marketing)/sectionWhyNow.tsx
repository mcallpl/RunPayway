"use client";

export default function SectionWhyNow() {
  const TealColor = "#1F6D7A";

  const MortgageIcon = () => (
    <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
      <path d="M24 8L8 20V38H40V20L24 8Z" stroke={TealColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M24 8V20" stroke={TealColor} strokeWidth="2" strokeLinecap="round"/>
      <path d="M18 26H30V32H18Z" stroke={TealColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="20" y="28" width="2" height="4" fill={TealColor}/>
      <rect x="26" y="28" width="2" height="4" fill={TealColor}/>
    </svg>
  );

  const CareerIcon = () => (
    <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
      <path d="M12 32L18 24L24 28L32 16L38 24" stroke={TealColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="18" cy="24" r="2" fill={TealColor}/>
      <circle cx="32" cy="16" r="2" fill={TealColor}/>
      <path d="M8 40H40" stroke={TealColor} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const CreditIcon = () => (
    <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
      <rect x="8" y="10" width="32" height="28" rx="2" stroke={TealColor} strokeWidth="2"/>
      <path d="M12 18H36M12 24H36M12 30H28" stroke={TealColor} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="24" cy="24" r="10" stroke={TealColor} strokeWidth="2" opacity="0.3"/>
      <path d="M24 20V28M20 24H28" stroke={TealColor} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  return (
    <section style={{
      backgroundColor: "#FFFFFF",
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
              When Do You Need This?
            </h2>
            <p style={{
              fontSize: "20px",
              fontWeight: 500,
              lineHeight: "1.6",
              color: "#5E6873",
              margin: "0"
            }}>
              Income stability matters most when you're making major financial decisions
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "48px",
            marginBottom: "72px"
          }}>
            {[
              {
                Icon: MortgageIcon,
                title: "Applying for a Mortgage",
                description: "Lenders evaluate income stability before approving loans. Understand your position before applying."
              },
              {
                Icon: CareerIcon,
                title: "Changing Careers",
                description: "Know your financial runway before making a major job change. See how a new income structure affects your stability."
              },
              {
                Icon: CreditIcon,
                title: "Seeking Credit or Investment",
                description: "Creditors and investors want proof of income stability. Get concrete evidence of how your income is structured."
              }
            ].map((item, idx) => (
              <div key={idx} style={{
                padding: "48px 40px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "16px",
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
                  marginBottom: "28px",
                  display: "flex",
                  justifyContent: "center"
                }}>
                  <item.Icon />
                </div>
                <h3 style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#0E1A2B",
                  margin: "0 0 16px 0",
                  lineHeight: "1.3"
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: "15px",
                  fontWeight: 400,
                  lineHeight: "1.7",
                  color: "#5E6873",
                  margin: "0"
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Reassurance callout */}
          <div style={{
            maxWidth: "760px",
            margin: "0 auto",
            padding: "40px 48px",
            backgroundColor: "#F4F1EA",
            border: "1px solid #DDD5CB",
            borderRadius: "16px",
            textAlign: "center"
          }}>
            <p style={{
              fontSize: "17px",
              fontWeight: 600,
              lineHeight: "1.7",
              color: "#0E1A2B",
              margin: "0"
            }}>
              Whether you're self-employed, freelancing, running a business, or have multiple income sources—this works for any independent income structure.
            </p>
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
              When Do You Need This?
            </h2>
            <p style={{
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "1.6",
              color: "#5E6873",
              margin: "0"
            }}>
              Major financial decisions require clarity
            </p>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            marginBottom: "40px"
          }}>
            {[
              {
                Icon: MortgageIcon,
                title: "Applying for a Mortgage",
                description: "Lenders evaluate income stability before approving loans. Understand your position before applying."
              },
              {
                Icon: CareerIcon,
                title: "Changing Careers",
                description: "Know your financial runway before making a major job change."
              },
              {
                Icon: CreditIcon,
                title: "Seeking Credit or Investment",
                description: "Creditors and investors want proof of income stability."
              }
            ].map((item, idx) => (
              <div key={idx} style={{
                padding: "32px 24px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "16px",
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(14, 26, 43, 0.04)"
              }}>
                <div style={{
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "center"
                }}>
                  <div style={{ transform: "scale(0.85)" }}>
                    <item.Icon />
                  </div>
                </div>
                <h3 style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "#0E1A2B",
                  margin: "0 0 12px 0",
                  lineHeight: "1.3"
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: "1.6",
                  color: "#5E6873",
                  margin: "0"
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Reassurance callout mobile */}
          <div style={{
            padding: "32px 24px",
            backgroundColor: "#F4F1EA",
            border: "1px solid #DDD5CB",
            borderRadius: "16px",
            textAlign: "center"
          }}>
            <p style={{
              fontSize: "15px",
              fontWeight: 600,
              lineHeight: "1.6",
              color: "#0E1A2B",
              margin: "0"
            }}>
              Whether you're self-employed, freelancing, running a business, or have multiple income sources—this works for any independent income structure.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
