"use client";

export default function MobileSection1() {
  return (
    <div style={{ backgroundColor: "#F8FAFC" }}>
      {/* HEADER */}
      <header style={{
        height: "64px",
        padding: "0 20px",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}>
        <svg width="32" height="32" viewBox="0 0 100 40">
          <text x="0" y="28" fontSize="24" fontWeight="700" fill="#0E1A2B" fontFamily="Inter, sans-serif">RP</text>
          <path d="M 65 10 Q 75 20 65 30" stroke="#2F6BFF" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0E1A2B" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </header>

      {/* HERO SECTION */}
      <section style={{
        padding: "32px 20px 40px 20px",
        background: "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)",
      }}>
        <div style={{
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          color: "#2F6BFF",
          marginBottom: "16px",
          textTransform: "uppercase",
        }}>
          STRUCTURAL STABILITY MODEL RP-2.0
        </div>

        <h1 style={{
          fontSize: "34px",
          fontWeight: 700,
          lineHeight: 1.2,
          color: "#0E1A2B",
          margin: "0 0 16px 0",
        }}>
          Major financial decisions require income verification.
        </h1>

        <p style={{
          fontSize: "16px",
          fontWeight: 500,
          color: "#0E1A2B",
          margin: "0 0 10px 0",
        }}>
          <span style={{ color: "#2F6BFF", fontWeight: 600 }}>RunPayway™</span> defines whether income stability holds before commitment.
        </p>

        <p style={{
          fontSize: "15px",
          fontWeight: 400,
          color: "#6B7280",
          margin: "0 0 24px 0",
        }}>
          Without verification, income risk remains undefined.
        </p>

        <button style={{
          width: "100%",
          height: "52px",
          borderRadius: "12px",
          fontSize: "16px",
          fontWeight: 600,
          color: "#FFFFFF",
          background: "linear-gradient(135deg, #0E1A2B 0%, #0A2540 100%)",
          border: "none",
          boxShadow: "0px 10px 24px rgba(10, 37, 64, 0.28)",
          cursor: "pointer",
          marginBottom: "20px",
        }}>
          Start Verification →
        </button>

        <div style={{ marginBottom: "24px" }}>
          <p style={{
            fontSize: "13px",
            color: "#0E1A2B",
            fontWeight: 500,
            margin: "0 0 2px 0",
          }}>
            Before financial commitment
          </p>
          <div style={{
            fontSize: "13px",
            color: "#6B7280",
            margin: 0,
          }}>
            Answer 6 inputs <span style={{ color: "#10B981" }}>•</span> Immediate result
          </div>
        </div>

        {/* SCORE CARD */}
        <div style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0px 10px 30px rgba(16, 24, 40, 0.08)",
          marginBottom: "32px",
        }}>
          <div style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "#6B7280",
            marginBottom: "8px",
          }}>
            Income Stability Score™
          </div>

          <div style={{
            display: "flex",
            alignItems: "baseline",
            marginBottom: "12px",
          }}>
            <span style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "#0E1A2B",
            }}>72</span>
            <span style={{
              fontSize: "20px",
              fontWeight: 500,
              color: "#9CA3AF",
              marginLeft: "4px",
            }}>/100</span>
          </div>

          <div style={{
            height: "1px",
            backgroundColor: "#E5E7EB",
            marginBottom: "16px",
          }} />

          <div style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#2F6BFF",
            marginBottom: "6px",
          }}>
            Established Stability
          </div>

          <p style={{
            fontSize: "14px",
            color: "#6B7280",
            margin: "0 0 16px 0",
          }}>
            Determines whether income holds under disruption.
          </p>

          <div style={{ marginBottom: "8px", position: "relative" }}>
            <div style={{
              height: "6px",
              backgroundColor: "#E5E7EB",
              borderRadius: "999px",
              overflow: "hidden",
            }}>
              <div style={{
                width: "60%",
                height: "100%",
                background: "linear-gradient(90deg, #2F6BFF 0%, #1D4ED8 100%)",
                borderRadius: "999px",
              }} />
            </div>
            <div style={{
              position: "absolute",
              left: "calc(60% - 7px)",
              top: "-4px",
              width: "14px",
              height: "14px",
              backgroundColor: "#2F6BFF",
              borderRadius: "50%",
            }} />
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            marginBottom: "16px",
          }}>
            <span style={{ color: "#2F6BFF", fontWeight: 500 }}>Protected</span>
            <span style={{ color: "#9CA3AF" }}>Recurring</span>
            <span style={{ color: "#9CA3AF" }}>At Risk</span>
          </div>

          <div style={{
            fontSize: "12px",
            color: "#9CA3AF",
            display: "flex",
            justifyContent: "space-between",
          }}>
            <span>Model RP-2.0</span>
            <span>Same inputs produce same result</span>
          </div>
        </div>

        {/* ARROW */}
        <div style={{ textAlign: "center", margin: "24px 0 16px 0" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F6BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="12 5 12 19 5 12"></polyline>
            <polyline points="12 19 19 12"></polyline>
          </svg>
        </div>

        {/* TRUST TEXT */}
        <p style={{
          fontSize: "14px",
          fontWeight: 500,
          color: "#374151",
          textAlign: "center",
          margin: "0 auto 24px",
          maxWidth: "280px",
        }}>
          Trusted by organizations and professionals for verified income stability.
        </p>

        {/* ICON ROW */}
        <div style={{
          display: "flex",
          justifyContent: "space-around",
          gap: "12px",
        }}>
          <div style={{ textAlign: "center", flex: 1 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2F6BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z"></path>
              <polyline points="16 12 12 8 8 12"></polyline>
            </svg>
            <div style={{
              fontSize: "12px",
              color: "#374151",
              marginTop: "8px",
              lineHeight: 1.3,
            }}>
              Independent<br />verification
            </div>
          </div>

          <div style={{ textAlign: "center", flex: 1 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2F6BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <div style={{
              fontSize: "12px",
              color: "#374151",
              marginTop: "8px",
              lineHeight: 1.3,
            }}>
              No documents<br />required
            </div>
          </div>

          <div style={{ textAlign: "center", flex: 1 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polyline>
            </svg>
            <div style={{
              fontSize: "12px",
              color: "#374151",
              marginTop: "8px",
              lineHeight: 1.3,
            }}>
              Instant<br />results
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
