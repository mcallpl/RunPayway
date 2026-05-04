"use client";

import { useState } from "react";

export default function Footer() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      title: "INDIVIDUALS",
      links: [
        { label: "Get My Stability Class", href: "#" },
        { label: "Full Report ($69)", href: "#" },
        { label: "How It Works", href: "#" },
        { label: "What Your Score Means", href: "#" }
      ]
    },
    {
      title: "PROFESSIONALS",
      links: [
        { label: "For Advisors", href: "#" },
        { label: "For Organizations", href: "#" },
        { label: "Use Cases", href: "#" },
        { label: "Industries", href: "#" }
      ]
    },
    {
      title: "SYSTEM",
      links: [
        { label: "Methodology", href: "#" },
        { label: "Model Integrity", href: "#" },
        { label: "Learn", href: "#" },
        { label: "Definitions", href: "#" }
      ]
    },
    {
      title: "COMPANY",
      links: [
        { label: "About", href: "#" },
        { label: "Contact", href: "#" }
      ]
    }
  ];

  return (
    <footer style={{
      backgroundColor: "#F4F1EA",
      paddingTop: "96px",
      paddingBottom: "64px",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* DESKTOP */}
      <div className="hidden lg:block">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>

          {/* SECTION 1 - CTA BLOCK */}
          <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center", marginBottom: "64px" }}>
            <h2 style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#0E1A2B",
              margin: "0 0 12px 0",
              lineHeight: 1.2
            }}>
              Verification precedes commitment.
            </h2>
            <p style={{
              fontSize: "15px",
              color: "#6B7280",
              margin: "0 0 20px 0",
              fontWeight: 400
            }}>
              See how your income holds before your next decision.
            </p>

            <button style={{
              height: "52px",
              padding: "0 28px",
              backgroundColor: "#0E1A2B",
              color: "#FFFFFF",
              fontSize: "15px",
              fontWeight: 600,
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginBottom: "16px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}>
              Start Verification
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>

            {/* Support row */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              alignItems: "center",
              flexWrap: "wrap"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1F6D7A" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span style={{ fontSize: "13px", color: "#6B7280" }}>Under 2 minutes</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1F6D7A" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                <span style={{ fontSize: "13px", color: "#6B7280" }}>No documents</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1F6D7A" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span style={{ fontSize: "13px", color: "#6B7280" }}>Private</span>
              </div>
            </div>
          </div>

          {/* SECTION 2 - DIVIDER */}
          <div style={{
            height: "1px",
            backgroundColor: "#E5E7EB",
            margin: "40px 0"
          }}></div>

          {/* SECTION 3 - NAV GRID */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "48px",
            marginBottom: "64px"
          }}>
            {sections.map((section) => (
              <div key={section.title}>
                <div style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#0E1A2B",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "16px"
                }}>
                  {section.title}
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {section.links.map((link) => (
                    <li key={link.label} style={{ marginBottom: "12px" }}>
                      <a href={link.href} style={{
                        fontSize: "15px",
                        color: "#6B7280",
                        textDecoration: "none",
                        fontWeight: 400,
                        transition: "color 200ms ease"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#1F6D7A"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "#6B7280"}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* SECTION 4 - LEGAL ROW */}
          <div style={{
            textAlign: "center",
            marginBottom: "64px"
          }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <a href="#" style={{ fontSize: "13px", color: "#6B7280", textDecoration: "none", fontWeight: 400 }}>Privacy Policy</a>
              <span style={{ fontSize: "13px", color: "#E5E7EB" }}>·</span>
              <a href="#" style={{ fontSize: "13px", color: "#6B7280", textDecoration: "none", fontWeight: 400 }}>Terms of Use</a>
              <span style={{ fontSize: "13px", color: "#E5E7EB" }}>·</span>
              <a href="#" style={{ fontSize: "13px", color: "#6B7280", textDecoration: "none", fontWeight: 400 }}>Security Practices</a>
              <span style={{ fontSize: "13px", color: "#E5E7EB" }}>·</span>
              <a href="#" style={{ fontSize: "13px", color: "#6B7280", textDecoration: "none", fontWeight: 400 }}>Accessibility (WCAG 2.1 AA)</a>
            </div>
          </div>

          {/* SECTION 5 - AUTHORITY BLOCK */}
          <div style={{
            backgroundColor: "#FFFFFF",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "40px",
            border: "1px solid #E5E7EB"
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F6D7A" strokeWidth="2" style={{ flexShrink: 0, marginTop: "2px" }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#0E1A2B", marginBottom: "4px" }}>
                  RunPayway™ — Income Stability Score™
                </div>
                <div style={{ fontSize: "13px", color: "#6B7280", marginBottom: "6px" }}>
                  Structural Stability Model RP-2.0
                </div>
                <div style={{ fontSize: "13px", color: "#6B7280" }}>
                  Same inputs produce the same result.
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6 - FINAL LINE */}
          <div style={{
            textAlign: "center",
            fontSize: "13px",
            color: "#6B7280",
            fontWeight: 400
          }}>
            © 2026 RunPayway™ · PeopleStar Enterprises, LLC · Orange County, CA, USA
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden">
        <div style={{ padding: "0 24px" }}>

          {/* SECTION 1 - CTA BLOCK */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2 style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#0E1A2B",
              margin: "0 0 10px 0",
              lineHeight: 1.2
            }}>
              Verification precedes commitment.
            </h2>
            <p style={{
              fontSize: "14px",
              color: "#6B7280",
              margin: "0 0 16px 0",
              fontWeight: 400
            }}>
              See how your income holds before your next decision.
            </p>

            <button style={{
              width: "100%",
              height: "52px",
              backgroundColor: "#0E1A2B",
              color: "#FFFFFF",
              fontSize: "15px",
              fontWeight: 600,
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}>
              Start Verification
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>

            {/* Support row */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              alignItems: "center",
              flexWrap: "wrap",
              fontSize: "12px",
              color: "#6B7280"
            }}>
              <span>✓ Under 2 minutes</span>
              <span>✓ No documents</span>
              <span>✓ Private</span>
            </div>
          </div>

          {/* SECTION 2 - DIVIDER */}
          <div style={{
            height: "1px",
            backgroundColor: "#E5E7EB",
            margin: "32px 0"
          }}></div>

          {/* SECTION 3 - ACCORDION NAV */}
          <div style={{ marginBottom: "32px" }}>
            {sections.map((section) => (
              <div key={section.title}>
                <button
                  onClick={() => toggleSection(section.title)}
                  style={{
                    width: "100%",
                    height: "56px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "transparent",
                    border: "none",
                    borderBottom: "1px solid #E5E7EB",
                    cursor: "pointer",
                    padding: "0",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#0E1A2B",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                  }}
                >
                  {section.title}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{
                    transform: expandedSection === section.title ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 200ms ease"
                  }}>
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>

                {expandedSection === section.title && (
                  <div style={{ paddingLeft: "0", paddingBottom: "16px" }}>
                    {section.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        style={{
                          display: "block",
                          fontSize: "14px",
                          color: "#6B7280",
                          textDecoration: "none",
                          fontWeight: 400,
                          paddingBottom: "12px",
                          paddingTop: "12px"
                        }}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* SECTION 4 - LEGAL */}
          <div style={{
            textAlign: "center",
            marginBottom: "32px"
          }}>
            <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "8px" }}>
              <a href="#" style={{ color: "#6B7280", textDecoration: "none" }}>Privacy Policy</a>
              {" · "}
              <a href="#" style={{ color: "#6B7280", textDecoration: "none" }}>Terms of Use</a>
              {" · "}
              <a href="#" style={{ color: "#6B7280", textDecoration: "none" }}>Security Practices</a>
            </div>
            <div style={{ fontSize: "12px", color: "#6B7280" }}>
              <a href="#" style={{ color: "#6B7280", textDecoration: "none" }}>Accessibility (WCAG 2.1 AA)</a>
            </div>
          </div>

          {/* SECTION 5 - AUTHORITY BLOCK */}
          <div style={{
            backgroundColor: "#FFFFFF",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "32px",
            border: "1px solid #E5E7EB"
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F6D7A" strokeWidth="2" style={{ flexShrink: 0, marginTop: "2px" }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#0E1A2B", marginBottom: "3px" }}>
                  RunPayway™ — Income Stability Score™
                </div>
                <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "4px" }}>
                  Structural Stability Model RP-2.0
                </div>
                <div style={{ fontSize: "12px", color: "#6B7280" }}>
                  Same inputs produce the same result.
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6 - FINAL LINE */}
          <div style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#6B7280",
            fontWeight: 400,
            lineHeight: 1.4
          }}>
            © 2026 RunPayway™ · PeopleStar Enterprises, LLC · Orange County, CA, USA
          </div>
        </div>
      </div>
    </footer>
  );
}
