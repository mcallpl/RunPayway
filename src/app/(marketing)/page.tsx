"use client";

import { useState } from "react";
import SectionFree from "./sectionFree";
import Section2 from "./section2";
import Section3 from "./section3";
import SectionIntegrity from "./sectionIntegrity";
import SectionSampleReport from "./sectionSampleReport";
import SectionWhyNow from "./sectionWhyNow";
import SectionWhoUsesThis from "./sectionWhoUsesThis";
import Footer from "./footer";

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
      lineHeight: "1.5",
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
  const [solutionsDropdownOpen, setSolutionsDropdownOpen] = useState(false);

  return (
    <div className="w-full">
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      {/* HEADER */}
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
                onClick={() => setSolutionsDropdownOpen(!solutionsDropdownOpen)}
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
                aria-expanded={solutionsDropdownOpen}
              >
                Solutions
                <span style={{ fontSize: "11px", transition: "transform 150ms ease", transform: solutionsDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
              </button>

              {solutionsDropdownOpen && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: "0",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
                  minWidth: "280px",
                  marginTop: "8px",
                  zIndex: 100
                }}>
                  <a
                    href="/advisors"
                    style={{
                      display: "block",
                      padding: "16px 20px",
                      borderBottom: "1px solid #E5E7EB",
                      textDecoration: "none",
                      transition: "background-color 150ms ease",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F9FAFB"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#0E1A2B", marginBottom: "4px" }}>
                      For Advisors
                    </div>
                    <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: "1.5" }}>
                      Help clients assess income stability with verified assessments
                    </div>
                  </a>

                  <a
                    href="/organizations"
                    style={{
                      display: "block",
                      padding: "16px 20px",
                      textDecoration: "none",
                      transition: "background-color 150ms ease",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F9FAFB"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#0E1A2B", marginBottom: "4px" }}>
                      For Organizations
                    </div>
                    <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: "1.5" }}>
                      Assess income stability for hiring and workforce decisions
                    </div>
                  </a>
                </div>
              )}
            </div>

            <NavLink href="/plans">Plans</NavLink>
            <NavLink href="#learn">Learn</NavLink>
            <NavLink href="#about">About</NavLink>
          </nav>

          {/* Right Side */}
          <div style={{ display: "flex", gap: "28px", alignItems: "center", marginLeft: "auto" }}></div>
        </div>

        {/* Mobile */}
        <div className="lg:hidden flex h-full items-center justify-between" style={{ padding: "0 24px" }}>
          <a href="/RunPayway" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src="/RunPayway/logo.png" alt="RunPayway™" style={{ height: "41px", width: "auto" }} />
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "4px"
            }}
            aria-label="Menu"
          >
            <span style={{ display: "block", width: "24px", height: "2px", backgroundColor: "#0E1A2B" }}></span>
            <span style={{ display: "block", width: "24px", height: "2px", backgroundColor: "#0E1A2B" }}></span>
            <span style={{ display: "block", width: "24px", height: "2px", backgroundColor: "#0E1A2B" }}></span>
          </button>
        </div>
      </header>

      {/* HERO SECTION — PREMIUM */}
      <section style={{ backgroundColor: "#FFFFFF", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        {/* Desktop */}
        <div className="hidden lg:block">
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "144px 48px", display: "flex", gap: "80px", alignItems: "flex-start" }}>
            {/* Left Column */}
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontSize: "72px",
                fontWeight: 700,
                lineHeight: "1.15",
                letterSpacing: "-0.025em",
                color: "#0E1A2B",
                margin: "0 0 28px 0"
              }}>
                Check Your Income Stability — Free, Fast, and Easy
              </h1>

              <p style={{
                fontSize: "28px",
                fontWeight: 500,
                lineHeight: "1.5",
                color: "#5E6873",
                margin: "0 0 40px 0"
              }}>
                Know how your income holds up before making important financial decisions.
              </p>

              <button style={{
                fontSize: "18px",
                fontWeight: 600,
                lineHeight: "1.5",
                color: "#FFFFFF",
                backgroundColor: "#0E1A2B",
                padding: "18px 40px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                marginBottom: "28px",
                transition: "all 200ms ease",
                outline: "2px solid transparent",
                outlineOffset: "4px",
                fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                boxShadow: "0 8px 24px rgba(14, 26, 43, 0.12)"
              }}
              onFocus={(e) => e.currentTarget.style.outline = "2px solid #2F6BFF"}
              onBlur={(e) => e.currentTarget.style.outline = "2px solid transparent"}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14, 26, 43, 0.18)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14, 26, 43, 0.12)"; }}
              >
                Get Your Free Income Stability Check — Just 2 Minutes
              </button>

              <p style={{
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "1.6",
                color: "#5E6873",
                margin: "0"
              }}>
                ✓ Under 2 minutes · No documents required · Private
              </p>
            </div>

            {/* Right Column - Premium Score Card */}
            <div style={{ flex: 1, maxWidth: "520px" }}>
              <div style={{
                backgroundColor: "#FFFFFF",
                background: "linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)",
                border: "1px solid #E5E7EB",
                borderRadius: "16px",
                padding: "48px 40px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 12px rgba(14, 26, 43, 0.06), 0 16px 48px rgba(14, 26, 43, 0.08)"
              }}>
                <div style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.10em",
                  color: "#1F6D7A",
                  textTransform: "uppercase",
                  marginBottom: "24px"
                }}>
                  Income Stability Score™
                </div>

                <div style={{
                  fontSize: "64px",
                  fontWeight: 700,
                  lineHeight: "1",
                  color: "#0E1A2B",
                  marginBottom: "12px",
                  fontFamily: '"SF Mono", "Fira Code", "IBM Plex Mono", monospace'
                }}>
                  72
                </div>

                <div style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  lineHeight: "1.6",
                  color: "#0E1A2B",
                  marginBottom: "32px"
                }}>
                  Established Stability
                </div>

                <div style={{
                  width: "100%",
                  height: "8px",
                  backgroundColor: "#E5E7EB",
                  borderRadius: "4px",
                  marginBottom: "32px",
                  position: "relative",
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: "72%",
                    height: "100%",
                    background: "linear-gradient(90deg, #1F6D7A, #2A9B9F)",
                    borderRadius: "4px",
                    transition: "width 2s ease"
                  }}></div>
                </div>

                <div style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  lineHeight: "1.6",
                  color: "#5E6873",
                  marginTop: "auto",
                  paddingTop: "32px",
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
          <div style={{ padding: "80px 24px", maxWidth: "1200px", margin: "0 auto" }}>
            <h1 style={{
              fontSize: "48px",
              fontWeight: 700,
              lineHeight: "1.15",
              letterSpacing: "-0.025em",
              color: "#0E1A2B",
              margin: "0 0 20px 0"
            }}>
              Check Your Income Stability — Free, Fast, and Easy
            </h1>

            <p style={{
              fontSize: "20px",
              fontWeight: 500,
              lineHeight: "1.5",
              color: "#5E6873",
              margin: "0 0 32px 0"
            }}>
              Know how your income holds up before making important financial decisions.
            </p>

            <button style={{
              width: "100%",
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "1.5",
              color: "#FFFFFF",
              backgroundColor: "#0E1A2B",
              padding: "16px 32px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              marginBottom: "24px",
              transition: "all 150ms ease",
              fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}>
              Get Your Free Income Stability Check — Just 2 Minutes
            </button>

            <p style={{
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: "1.6",
              color: "#5E6873",
              margin: "0 0 40px 0"
            }}>
              ✓ Under 2 minutes · No documents required · Private
            </p>

            <div style={{
              backgroundColor: "#FFFFFF",
              background: "linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)",
              border: "1px solid #E5E7EB",
              borderRadius: "16px",
              padding: "40px 28px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 12px rgba(14, 26, 43, 0.06), 0 16px 48px rgba(14, 26, 43, 0.08)"
            }}>
              <div style={{
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.10em",
                color: "#1F6D7A",
                textTransform: "uppercase",
                marginBottom: "20px"
              }}>
                Income Stability Score™
              </div>

              <div style={{
                fontSize: "48px",
                fontWeight: 700,
                lineHeight: "1",
                color: "#0E1A2B",
                marginBottom: "12px",
                fontFamily: '"SF Mono", "Fira Code", "IBM Plex Mono", monospace'
              }}>
                72
              </div>

              <div style={{
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "1.6",
                color: "#0E1A2B",
                marginBottom: "24px"
              }}>
                Established Stability
              </div>

              <div style={{
                width: "100%",
                height: "8px",
                backgroundColor: "#E5E7EB",
                borderRadius: "4px",
                marginBottom: "24px",
                position: "relative",
                overflow: "hidden"
              }}>
                <div style={{
                  width: "72%",
                  height: "100%",
                  background: "linear-gradient(90deg, #1F6D7A, #2A9B9F)",
                  borderRadius: "4px",
                  transition: "width 2s ease"
                }}></div>
              </div>

              <div style={{
                fontSize: "12px",
                fontWeight: 500,
                lineHeight: "1.6",
                color: "#5E6873",
                paddingTop: "24px",
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

      <SectionWhyNow />
      <Section2 />
      <Section3 />
      <SectionSampleReport />
      <SectionFree />
      <SectionIntegrity />
      <SectionWhoUsesThis />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
