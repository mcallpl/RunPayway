"use client";

import { useState } from "react";
import Section2 from "./section2";
import Section3 from "./section3";
import Section4 from "./section4";
import Footer from "./footer";

// Global styles for WCAG 2.1 AA compliance
const globalStyles = `
  button:focus-visible,
  a:focus-visible {
    outline: 2px solid #2F6BFF;
    outline-offset: 4px;
  }
`;

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    style={{
      fontSize: "14px",
      fontWeight: "500",
      color: "#0E1A2B",
      textDecoration: "none",
      lineHeight: "1",
      whiteSpace: "nowrap",
      padding: "8px 4px",
      transition: "color 150ms ease, outline 150ms ease",
      cursor: "pointer",
      outline: "2px solid transparent",
      outlineOffset: "4px",
      borderRadius: "4px"
    }}
    onMouseEnter={(e) => e.currentTarget.style.color = "#2F6BFF"}
    onMouseLeave={(e) => e.currentTarget.style.color = "#0E1A2B"}
    onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"}
    onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}
  >
    {children}
  </a>
);

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="w-full">
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      {/* HEADER - WCAG 2.1 AA COMPLIANT */}
      <header style={{ position: "sticky", top: "0", zIndex: "50", backgroundColor: "#FFFFFF", borderBottom: "1px solid #E5E7EB", boxShadow: "0px 1px 0px rgba(0,0,0,0.04)", height: "72px", width: "100%", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
        {/* Desktop */}
        <div className="hidden lg:flex h-full items-center" style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 48px", justifyContent: "space-between" }}>
          {/* Logo */}
          <a href="/RunPayway" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: "0", marginRight: "80px", outline: "2px solid transparent", outlineOffset: "4px", borderRadius: "4px", transition: "outline 150ms ease" }} onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"} onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}>
            <img src="/RunPayway/logo.png" alt="RunPayway™" style={{ height: "56px", width: "auto" }} />
          </a>

          {/* Center Navigation */}
          <nav style={{ display: "flex", gap: "28px", alignItems: "center", flex: "1" }} aria-label="Main navigation">
            <NavLink href="#how-it-works">How It Works</NavLink>
            <NavLink href="#methodology">Methodology</NavLink>
            <NavLink href="#use-cases">Use Cases</NavLink>

            <div style={{ position: "relative" }}>
              <button
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#0E1A2B",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "8px 4px",
                  transition: "color 150ms ease, outline 150ms ease",
                  outline: "2px solid transparent",
                  outlineOffset: "4px",
                  borderRadius: "4px"
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#2F6BFF"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#0E1A2B"}
                onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"}
                onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}
                aria-haspopup="menu"
              >
                Solutions
                <span style={{ fontSize: "11px" }}>▼</span>
              </button>
            </div>

            <NavLink href="/plans">Plans</NavLink>
            <NavLink href="#learn">Learn</NavLink>
            <NavLink href="#about">About</NavLink>
          </nav>

          {/* Right Side */}
          <div style={{ display: "flex", gap: "28px", alignItems: "center", marginLeft: "auto" }}>
            <NavLink href="#sign-in">Sign In</NavLink>
            <button
              style={{
                height: "40px",
                padding: "0 24px",
                background: "#0E1A2B",
                color: "#FFFFFF",
                borderRadius: "6px",
                fontWeight: "600",
                fontSize: "14px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
                boxShadow: "0px 6px 14px rgba(14, 26, 43, 0.18)",
                transition: "all 150ms ease",
                outline: "2px solid transparent",
                outlineOffset: "4px"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0px 14px 32px rgba(10, 37, 64, 0.32)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0px)"; e.currentTarget.style.boxShadow = "0px 6px 14px rgba(14, 26, 43, 0.18)"; }}
              onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(0px)"; e.currentTarget.style.boxShadow = "0px 6px 14px rgba(10, 37, 64, 0.2)"; }}
              onFocus={(e) => e.currentTarget.style.outline = "2px solid #FFFFFF"}
              onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}
              aria-label="Start income verification"
            >
              Start Verification
            </button>
          </div>
        </div>

        {/* Mobile */}
        <div className="lg:hidden flex h-full items-center justify-between" style={{ padding: "0 24px" }}>
          <a href="/RunPayway" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src="/RunPayway/logo.png" alt="RunPayway™" style={{ height: "41px", width: "auto" }} />
          </a>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              padding: "8px",
              outline: "2px solid transparent",
              outlineOffset: "4px",
              borderRadius: "4px",
              transition: "outline 150ms ease"
            }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"}
            onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span style={{ display: "block", width: "24px", height: "2px", backgroundColor: "#0E1A2B" }}></span>
            <span style={{ display: "block", width: "24px", height: "2px", backgroundColor: "#0E1A2B" }}></span>
            <span style={{ display: "block", width: "24px", height: "2px", backgroundColor: "#0E1A2B" }}></span>
          </button>
        </div>
      </header>

      {/* HERO SECTION - PER MASTER SPEC */}
      <section style={{ backgroundColor: "#FFFFFF", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        {/* Desktop */}
        <div className="hidden lg:block">
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "96px 48px", display: "flex", gap: "88px", alignItems: "flex-start" }}>
            {/* Left Column */}
            <div style={{ flex: 1 }}>
              {/* Headline */}
              <h1 style={{
                fontSize: "48px",
                fontWeight: 700,
                lineHeight: "1.2",
                color: "#0E1A2B",
                margin: "0 0 16px 0"
              }}>
                Verify your income stability before making major financial decisions.
              </h1>

              {/* Subheadline */}
              <p style={{
                fontSize: "24px",
                fontWeight: 400,
                lineHeight: "1.5",
                color: "#6B7280",
                margin: "0 0 16px 0"
              }}>
                RunPayway™ defines whether your income stability holds before you commit.
              </p>

              {/* CTA Button */}
              <button style={{
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "1.5",
                color: "#FFFFFF",
                backgroundColor: "#0E1A2B",
                padding: "16px 28px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                marginBottom: "16px",
                transition: "all 150ms ease",
                outline: "2px solid transparent",
                outlineOffset: "4px",
                fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              }}
              onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"}
              onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0px 4px 12px rgba(14, 26, 43, 0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0px)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                Start Your Income Verification Now
              </button>

              {/* Support Text */}
              <p style={{
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "1.5",
                color: "#6B7280",
                margin: "0"
              }}>
                Under 2 minutes · No documents required · Private
              </p>
            </div>

            {/* Right Column - Score Card */}
            <div style={{ flex: 1, maxWidth: "500px" }}>
              <div style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                padding: "40px 32px",
                display: "flex",
                flexDirection: "column"
              }}>
                {/* Score Title */}
                <div style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  lineHeight: "1.2",
                  color: "#0E1A2B",
                  marginBottom: "28px"
                }}>
                  Income Stability Score™
                </div>

                {/* Score Number */}
                <div style={{
                  fontSize: "72px",
                  fontWeight: 700,
                  lineHeight: "1",
                  color: "#0E1A2B",
                  marginBottom: "16px"
                }}>
                  72
                </div>

                {/* Stability Label */}
                <div style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  lineHeight: "1.5",
                  color: "#0E1A2B",
                  marginBottom: "24px"
                }}>
                  Established Stability
                </div>

                {/* Progress Bar */}
                <div style={{
                  width: "100%",
                  height: "12px",
                  backgroundColor: "#E5E7EB",
                  borderRadius: "6px",
                  marginBottom: "24px",
                  position: "relative",
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: "72%",
                    height: "100%",
                    backgroundColor: "#2563EB",
                    borderRadius: "6px",
                    transition: "width 2s ease"
                  }}></div>
                </div>

                {/* Model Footer */}
                <div style={{
                  fontSize: "12px",
                  fontWeight: 400,
                  lineHeight: "1.5",
                  color: "#6B7280",
                  marginTop: "auto",
                  paddingTop: "20px",
                  borderTop: "1px solid #E5E7EB"
                }}>
                  <span style={{ fontWeight: 600, color: "#0E1A2B" }}>Model RP-2.0</span>
                  <span style={{ color: "#D1D5DB", margin: "0 8px" }}>·</span>
                  Same inputs produce same result
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="lg:hidden">
          <div style={{ padding: "64px 24px", maxWidth: "1200px", margin: "0 auto" }}>
            {/* Headline */}
            <h1 style={{
              fontSize: "36px",
              fontWeight: 700,
              lineHeight: "1.2",
              color: "#0E1A2B",
              margin: "0 0 16px 0"
            }}>
              Verify your income stability before making major financial decisions.
            </h1>

            {/* Subheadline */}
            <p style={{
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: "1.5",
              color: "#6B7280",
              margin: "0 0 16px 0"
            }}>
              RunPayway™ defines whether your income stability holds before you commit.
            </p>

            {/* CTA Button */}
            <button style={{
              width: "100%",
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "1.5",
              color: "#FFFFFF",
              backgroundColor: "#0E1A2B",
              padding: "16px 28px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              marginBottom: "16px",
              transition: "all 150ms ease",
              fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}>
              Start Your Income Verification Now
            </button>

            {/* Support Text */}
            <p style={{
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "1.5",
              color: "#6B7280",
              margin: "0 0 28px 0"
            }}>
              Under 2 minutes · No documents required · Private
            </p>

            {/* Score Card Mobile */}
            <div style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              padding: "32px 24px",
              display: "flex",
              flexDirection: "column"
            }}>
              {/* Score Title */}
              <div style={{
                fontSize: "18px",
                fontWeight: 600,
                lineHeight: "1.2",
                color: "#0E1A2B",
                marginBottom: "20px"
              }}>
                Income Stability Score™
              </div>

              {/* Score Number */}
              <div style={{
                fontSize: "56px",
                fontWeight: 700,
                lineHeight: "1",
                color: "#0E1A2B",
                marginBottom: "12px"
              }}>
                72
              </div>

              {/* Stability Label */}
              <div style={{
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "1.5",
                color: "#0E1A2B",
                marginBottom: "20px"
              }}>
                Established Stability
              </div>

              {/* Progress Bar */}
              <div style={{
                width: "100%",
                height: "10px",
                backgroundColor: "#E5E7EB",
                borderRadius: "5px",
                marginBottom: "20px",
                position: "relative",
                overflow: "hidden"
              }}>
                <div style={{
                  width: "72%",
                  height: "100%",
                  backgroundColor: "#2563EB",
                  borderRadius: "5px"
                }}></div>
              </div>

              {/* Model Footer */}
              <div style={{
                fontSize: "12px",
                fontWeight: 400,
                lineHeight: "1.5",
                color: "#6B7280",
                marginTop: "auto",
                paddingTop: "16px",
                borderTop: "1px solid #E5E7EB"
              }}>
                <span style={{ fontWeight: 600, color: "#0E1A2B" }}>Model RP-2.0</span>
                <span style={{ color: "#D1D5DB", margin: "0 8px" }}>·</span>
                Same inputs produce same result
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div style={{
        height: "1px",
        backgroundColor: "#E5E7EB",
        margin: "40px 0"
      }}></div>

      {/* TRUST STRIP */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "96px 48px", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        <div style={{ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto" }}>
          {/* Headline */}
          <p style={{ fontSize: "20px", lineHeight: "1.5", fontWeight: "700", color: "#0E1A2B", textAlign: "center", margin: "0 0 64px 0", maxWidth: "700px", marginLeft: "auto", marginRight: "auto" }}>
            Trusted by organizations and professionals for verified income stability.
          </p>

          {/* Trust Items */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "64px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1F6D7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L5 5v7c0 6 7 9 7 9s7-3 7-9V5l-7-3z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#0E1A2B", margin: "0" }}>
                Independent verification
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1F6D7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
                <circle cx="12" cy="16" r="1" />
              </svg>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#0E1A2B", margin: "0" }}>
                No documents required
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1F6D7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#0E1A2B", margin: "0" }}>
                Instant results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTIONS */}
      <Section2 />
      <Section3 />
      <Section4 />

      {/* SYSTEM INTEGRITY */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "96px 48px", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        <div style={{ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ marginBottom: "64px" }}>
            <h2 style={{ fontSize: "32px", fontWeight: "700", color: "#0E1A2B", margin: "0 0 16px 0", lineHeight: "1.2" }}>System integrity</h2>
            <p style={{ fontSize: "18px", fontWeight: "400", color: "#6B7280", margin: "0", lineHeight: "1.5" }}>Fixed rules. Consistent results.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
            {/* Model Card */}
            <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "32px 28px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0E1A2B", margin: "0 0 24px 0" }}>Model</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#0E1A2B", margin: "0 0 4px 0" }}>Fixed rules applied</h4>
                  <p style={{ fontSize: "14px", color: "#6B7280", margin: "0", lineHeight: "1.5" }}>Rules are locked for all results.</p>
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#0E1A2B", margin: "0 0 4px 0" }}>No discretion</h4>
                  <p style={{ fontSize: "14px", color: "#6B7280", margin: "0", lineHeight: "1.5" }}>Rules are identical for all users.</p>
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#0E1A2B", margin: "0 0 4px 0" }}>Same inputs produce same result</h4>
                  <p style={{ fontSize: "14px", color: "#6B7280", margin: "0", lineHeight: "1.5" }}>Consistency is guaranteed.</p>
                </div>
              </div>
            </div>

            {/* Record Card */}
            <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "32px 28px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0E1A2B", margin: "0 0 24px 0" }}>Record</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#0E1A2B", margin: "0 0 4px 0" }}>Timestamped result</h4>
                  <p style={{ fontSize: "14px", color: "#6B7280", margin: "0", lineHeight: "1.5" }}>Every result is timestamped to the second.</p>
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#0E1A2B", margin: "0 0 4px 0" }}>Permanent record ID</h4>
                  <p style={{ fontSize: "14px", color: "#6B7280", margin: "0", lineHeight: "1.5" }}>Unique ID assigned for permanent retrieval.</p>
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#0E1A2B", margin: "0 0 4px 0" }}>Results are not modified</h4>
                  <p style={{ fontSize: "14px", color: "#6B7280", margin: "0", lineHeight: "1.5" }}>Prior results never modified or deleted.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
