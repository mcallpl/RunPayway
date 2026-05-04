"use client";

export default function SectionIntegrity() {
  const TealColor = "#1F6D7A";
  const NavyColor = "#0E1A2B";

  const GearIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="8" stroke={TealColor} strokeWidth="2"/>
      <path d="M24 6V2M24 46V42M42 24H46M2 24H6M36.97 11.03L40.55 7.45M7.45 40.55L11.03 36.97M36.97 36.97L40.55 40.55M7.45 7.45L11.03 11.03" stroke={TealColor} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const LockIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect x="12" y="20" width="24" height="20" rx="2" stroke={TealColor} strokeWidth="2"/>
      <path d="M16 20V14C16 10.13 19.13 7 23 7C26.87 7 30 10.13 30 14V20" stroke={TealColor} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="24" cy="32" r="2" fill={TealColor}/>
    </svg>
  );

  return (
    <section style={{
      backgroundColor: "#FFFFFF",
      padding: "120px 24px",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* DESKTOP */}
      <div className="hidden lg:block">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <h2 style={{
              fontSize: "48px",
              fontWeight: 700,
              lineHeight: "1.2",
              letterSpacing: "-0.020em",
              color: NavyColor,
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
              Fixed rules. Consistent results. Your privacy protected.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "48px",
            maxWidth: "1000px",
            margin: "0 auto"
          }}>
            {/* How It Works */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
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
                marginBottom: "28px",
                display: "flex",
                justifyContent: "center"
              }}>
                <GearIcon />
              </div>
              <h3 style={{
                fontSize: "20px",
                fontWeight: 700,
                color: NavyColor,
                margin: "0 0 16px 0",
                lineHeight: "1.3"
              }}>
                How It Works
              </h3>
              <p style={{
                fontSize: "15px",
                fontWeight: 400,
                lineHeight: "1.7",
                color: "#5E6873",
                margin: "0 0 16px 0"
              }}>
                Your results are determined by fixed rules, not AI or predictions. Same income structure = same score, every time.
              </p>
              <div style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "#1F6D7A",
                padding: "12px 16px",
                backgroundColor: "rgba(31, 109, 122, 0.06)",
                borderRadius: "8px",
                borderLeft: "3px solid #1F6D7A"
              }}>
                <strong>Income structure:</strong> Your mix of active/passive income, number of revenue sources, and how predictable they are.
              </div>
            </div>

            {/* Your Privacy */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
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
                marginBottom: "28px",
                display: "flex",
                justifyContent: "center"
              }}>
                <LockIcon />
              </div>
              <h3 style={{
                fontSize: "20px",
                fontWeight: 700,
                color: NavyColor,
                margin: "0 0 16px 0",
                lineHeight: "1.3"
              }}>
                Your Privacy
              </h3>
              <p style={{
                fontSize: "15px",
                fontWeight: 400,
                lineHeight: "1.7",
                color: "#5E6873",
                margin: "0"
              }}>
                Your data is private and encrypted. Your results are yours alone. We don't sell, share, or monetize your information.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{
              fontSize: "32px",
              fontWeight: 700,
              lineHeight: "1.2",
              color: NavyColor,
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
              Fixed rules. Consistent results. Your privacy protected.
            </p>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px"
          }}>
            {/* How It Works */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "16px",
              padding: "32px 24px",
              textAlign: "center"
            }}>
              <div style={{
                marginBottom: "20px",
                display: "flex",
                justifyContent: "center"
              }}>
                <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="8" stroke={TealColor} strokeWidth="2"/>
                  <path d="M24 6V2M24 46V42M42 24H46M2 24H6M36.97 11.03L40.55 7.45M7.45 40.55L11.03 36.97M36.97 36.97L40.55 40.55M7.45 7.45L11.03 11.03" stroke={TealColor} strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: "18px",
                fontWeight: 700,
                color: NavyColor,
                margin: "0 0 12px 0",
                lineHeight: "1.3"
              }}>
                How It Works
              </h3>
              <p style={{
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "1.6",
                color: "#5E6873",
                margin: "0 0 12px 0"
              }}>
                Your results are determined by fixed rules, not AI or predictions. Same income structure = same score, every time.
              </p>
              <div style={{
                fontSize: "12px",
                fontWeight: 500,
                color: "#1F6D7A",
                padding: "10px 12px",
                backgroundColor: "rgba(31, 109, 122, 0.06)",
                borderRadius: "6px",
                borderLeft: "2px solid #1F6D7A"
              }}>
                <strong>Income structure:</strong> Your mix of active/passive income, number of sources, and predictability.
              </div>
            </div>

            {/* Your Privacy */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "16px",
              padding: "32px 24px",
              textAlign: "center"
            }}>
              <div style={{
                marginBottom: "20px",
                display: "flex",
                justifyContent: "center"
              }}>
                <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                  <rect x="12" y="20" width="24" height="20" rx="2" stroke={TealColor} strokeWidth="2"/>
                  <path d="M16 20V14C16 10.13 19.13 7 23 7C26.87 7 30 10.13 30 14V20" stroke={TealColor} strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="24" cy="32" r="2" fill={TealColor}/>
                </svg>
              </div>
              <h3 style={{
                fontSize: "18px",
                fontWeight: 700,
                color: NavyColor,
                margin: "0 0 12px 0",
                lineHeight: "1.3"
              }}>
                Your Privacy
              </h3>
              <p style={{
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "1.6",
                color: "#5E6873",
                margin: "0"
              }}>
                Your data is private and encrypted. Your results are yours alone. We don't sell, share, or monetize your information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
