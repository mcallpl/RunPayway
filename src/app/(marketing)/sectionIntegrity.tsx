"use client";

export default function SectionIntegrity() {
  return (
    <section style={{
      backgroundColor: "#FFFFFF",
      padding: "96px 24px",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* DESKTOP */}
      <div className="hidden lg:block">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "64px", textAlign: "center" }}>
            <h2 style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#0E1A2B",
              margin: "0 0 16px 0",
              lineHeight: "1.2"
            }}>
              System Integrity
            </h2>
            <p style={{
              fontSize: "18px",
              fontWeight: 400,
              color: "#6B7280",
              margin: "0",
              lineHeight: "1.6"
            }}>
              Fixed rules. Consistent results.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px"
          }}>
            {/* Model Section */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "48px 40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center"
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1F6D7A" strokeWidth="1.5" style={{ marginBottom: "24px" }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>

              <h3 style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#0E1A2B",
                margin: "0 0 12px 0",
                lineHeight: "1.2"
              }}>
                How it works
              </h3>

              <p style={{
                fontSize: "16px",
                fontWeight: 400,
                color: "#6B7280",
                margin: "0",
                lineHeight: "1.6"
              }}>
                Your results are determined by fixed inputs. Same income structure = same score. No algorithms. No guessing.
              </p>
            </div>

            {/* Record Section */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "48px 40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center"
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1F6D7A" strokeWidth="1.5" style={{ marginBottom: "24px" }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"></path>
              </svg>

              <h3 style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#0E1A2B",
                margin: "0 0 12px 0",
                lineHeight: "1.2"
              }}>
                Your privacy
              </h3>

              <p style={{
                fontSize: "16px",
                fontWeight: 400,
                color: "#6B7280",
                margin: "0",
                lineHeight: "1.6"
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
          <div style={{ marginBottom: "48px", textAlign: "center" }}>
            <h2 style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#0E1A2B",
              margin: "0 0 16px 0",
              lineHeight: "1.2"
            }}>
              System Integrity
            </h2>
            <p style={{
              fontSize: "16px",
              fontWeight: 400,
              color: "#6B7280",
              margin: "0",
              lineHeight: "1.6"
            }}>
              Fixed rules. Consistent results.
            </p>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px"
          }}>
            {/* Model Section */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "32px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center"
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1F6D7A" strokeWidth="1.5" style={{ marginBottom: "16px" }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>

              <h3 style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#0E1A2B",
                margin: "0 0 8px 0",
                lineHeight: "1.2"
              }}>
                How it works
              </h3>

              <p style={{
                fontSize: "14px",
                fontWeight: 400,
                color: "#6B7280",
                margin: "0",
                lineHeight: "1.6"
              }}>
                Your results are determined by fixed inputs. Same income structure = same score. No algorithms. No guessing.
              </p>
            </div>

            {/* Record Section */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "32px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center"
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1F6D7A" strokeWidth="1.5" style={{ marginBottom: "16px" }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"></path>
              </svg>

              <h3 style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#0E1A2B",
                margin: "0 0 8px 0",
                lineHeight: "1.2"
              }}>
                Your privacy
              </h3>

              <p style={{
                fontSize: "14px",
                fontWeight: 400,
                color: "#6B7280",
                margin: "0",
                lineHeight: "1.6"
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
