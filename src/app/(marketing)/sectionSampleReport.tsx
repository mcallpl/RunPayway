"use client";

import { useState } from "react";

export default function SectionSampleReport() {
  const [currentPage, setCurrentPage] = useState(0);

  const C = {
    navy: "#0E1A2B",
    teal: "#1F6D7A",
    sand: "#F4F1EA",
    white: "#FFFFFF",
    textSecondary: "#5E6873",
    textMuted: "#7B848E",
    risk: "#C74634",
    moderate: "#D0A23A",
    green: "#2A6E49",
  };

  const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';

  const pages = [
    {
      title: "Your Income Stability Score",
      description: "Your personalized score and classification based on your income structure. This is the foundation of your report—a single number that summarizes your financial position.",
      content: (
        <div style={{
          padding: "48px 40px",
          backgroundColor: C.navy,
          background: `linear-gradient(135deg, ${C.navy} 0%, #0a0f18 100%)`,
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          gap: "48px",
          position: "relative"
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${C.teal}, #4B3FAE)` }} />

          {/* Score ring */}
          <div style={{ position: "relative", width: "140px", height: "140px", flexShrink: 0 }}>
            <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <circle cx="70" cy="70" r="60" fill="none" stroke={C.teal} strokeWidth="8"
                strokeDasharray={2 * Math.PI * 60}
                strokeDashoffset={2 * Math.PI * 60 * (1 - 0.65)}
                strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${C.teal}40)` }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "44px", fontWeight: 300, fontFamily: mono, color: "#fff", lineHeight: 1, letterSpacing: "-0.04em" }}>XX</span>
              <span style={{ fontSize: "12px", color: "rgba(244,241,234,0.40)", marginTop: "2px" }}>/100</span>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 14px", borderRadius: "100px", backgroundColor: `${C.teal}18`, marginBottom: "16px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: C.teal }} />
              <span style={{ fontSize: "13px", fontWeight: 600, color: C.teal }}>Your Classification</span>
            </div>

            <div style={{ padding: "14px 16px", borderRadius: "0 14px 14px 0", backgroundColor: "rgba(255,255,255,0.07)", borderLeft: `4px solid ${C.teal}`, marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "rgba(244,241,234,0.45)", marginBottom: "6px" }}>PERSONALIZED TO YOU</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>Based on your unique income structure</div>
              <p style={{ fontSize: "13px", color: "rgba(244,241,234,0.55)", lineHeight: 1.5, margin: "6px 0 0" }}>Generated from your specific answers and financial situation.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                { label: "MODEL", value: "RP-2.0" },
                { label: "TYPE", value: "Your Type" }
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.10em", color: "rgba(244,241,234,0.30)", marginBottom: "4px" }}>{item.label}</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, fontFamily: mono, color: "rgba(244,241,234,0.75)" }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Key Structural Findings",
      description: "A breakdown of how your income is distributed and what factors are strongest/weakest. This page answers: What's working? What's the main constraint?",
      content: (
        <div style={{
          backgroundColor: C.navy,
          borderRadius: "16px",
          overflow: "hidden"
        }}>
          <div style={{
            backgroundColor: C.navy,
            padding: "28px 40px",
            position: "relative"
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${C.teal}, #4B3FAE)` }} />
            <div style={{ fontSize: "20px", fontWeight: 600, color: "#fff", marginBottom: "12px" }}>How Your Income Breaks Down</div>
            <div style={{ borderLeft: `3px solid ${C.teal}`, padding: "12px 16px", borderRadius: "0 10px 10px 0", backgroundColor: "rgba(255,255,255,0.04)" }}>
              <p style={{ fontSize: "15px", fontWeight: 500, color: "rgba(244,241,234,0.80)", margin: 0, lineHeight: 1.5 }}>
                Your income is analyzed across three categories: what stops if you stop working, what continues temporarily, and what's protected.
              </p>
            </div>
          </div>

          <div style={{ padding: "28px 40px", backgroundColor: "#FFFFFF" }}>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.10em", color: C.textMuted, marginBottom: "12px" }}>INCOME DISTRIBUTION</div>
              <div style={{ display: "flex", height: "12px", borderRadius: "999px", overflow: "hidden", marginBottom: "12px" }}>
                <div style={{ width: "45%", backgroundColor: C.risk }} />
                <div style={{ width: "25%", backgroundColor: C.moderate }} />
                <div style={{ width: "30%", backgroundColor: C.teal }} />
              </div>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {[
                  { label: "Active Income", value: "45%", color: C.risk },
                  { label: "Conditional Income", value: "25%", color: C.moderate },
                  { label: "Recurring Income", value: "30%", color: C.teal }
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "2px", backgroundColor: s.color }} />
                    <span style={{ fontSize: "12px", color: C.textSecondary }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                { label: "YOUR STRENGTH", text: "Income remains steady month to month", color: C.teal },
                { label: "YOUR CONSTRAINT", text: "Reliance on a small number of sources", color: C.risk }
              ].map((item, i) => (
                <div key={i} style={{ padding: "16px 20px", borderRadius: "12px", backgroundColor: C.sand, border: `1px solid ${item.color}15` }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.10em", color: item.color, marginBottom: "6px" }}>{item.label}</div>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: C.navy, margin: 0, lineHeight: 1.5 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Personalized Action Plan",
      description: "Three specific, prioritized actions to improve your stability score. Each action shows the estimated impact on your score and timeline.",
      content: (
        <div style={{
          backgroundColor: C.navy,
          borderRadius: "16px",
          overflow: "hidden"
        }}>
          <div style={{
            backgroundColor: C.navy,
            padding: "28px 40px",
            position: "relative"
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, #4B3FAE, ${C.teal})` }} />
            <div style={{ fontSize: "20px", fontWeight: 600, color: "#fff", marginBottom: "6px" }}>How to Improve Your Score</div>
            <p style={{ fontSize: "13px", color: "rgba(244,241,234,0.50)", margin: 0 }}>Prioritized actions tailored to your income structure.</p>
          </div>

          <div style={{ padding: "20px 40px", backgroundColor: "#FFFFFF" }}>
            {[
              { num: "01", action: "Spread Income Sources", desc: "Reduce concentration risk", impact: "+11 pts", difficulty: "High" },
              { num: "02", action: "Extend Forward Visibility", desc: "Secure longer-term commitments", impact: "+8 pts", difficulty: "Medium" },
              { num: "03", action: "Build Recurring Revenue", desc: "Convert project work to retainers", impact: "+5 pts", difficulty: "Medium" }
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "16px 0", borderBottom: i < 2 ? "1px solid #E5E7EB" : "none" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: C.navy, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, fontFamily: mono, color: "#fff", flexShrink: 0 }}>{a.num}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px", gap: "12px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 600, color: C.navy }}>{a.action}</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, fontFamily: mono, color: C.teal, flexShrink: 0 }}>{a.impact}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "13px", color: C.textSecondary }}>{a.desc}</span>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: C.textMuted, padding: "2px 8px", borderRadius: "4px", backgroundColor: "#F0F0F0", flexShrink: 0 }}>{a.difficulty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            backgroundColor: C.navy,
            padding: "24px 40px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.10em", color: "rgba(244,241,234,0.35)", marginBottom: "12px" }}>POTENTIAL OUTCOME</div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "12px" }}>
              <span style={{ fontSize: "24px", fontFamily: mono, color: "rgba(244,241,234,0.40)" }}>72</span>
              <span style={{ fontSize: "14px", color: "rgba(244,241,234,0.25)" }}>→</span>
              <span style={{ fontSize: "36px", fontWeight: 700, fontFamily: mono, color: C.teal }}>93</span>
            </div>
            <p style={{ fontSize: "12px", color: "rgba(244,241,234,0.30)", marginTop: "8px", marginBottom: 0 }}>Your potential score if all three actions are implemented</p>
          </div>
        </div>
      )
    },
    {
      title: "Stress Test Results",
      description: "How your income structure responds under real-world challenges. This page shows your financial resilience and identifies key vulnerabilities.",
      content: (
        <div style={{
          backgroundColor: C.navy,
          borderRadius: "16px",
          overflow: "hidden"
        }}>
          <div style={{
            backgroundColor: C.navy,
            padding: "28px 40px",
            position: "relative"
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${C.risk}, ${C.moderate})` }} />
            <div style={{ fontSize: "20px", fontWeight: 600, color: "#fff", marginBottom: "6px" }}>How You Handle Real Challenges</div>
            <p style={{ fontSize: "13px", color: "rgba(244,241,234,0.50)", margin: 0 }}>Three scenarios that test your income stability.</p>
          </div>

          <div style={{ padding: "16px 40px", backgroundColor: "#FFFFFF" }}>
            {[
              { scenario: "Largest income source lost", severity: "Critical", color: C.risk },
              { scenario: "90 days unable to work", severity: "Significant", color: C.moderate },
              { scenario: "Planned income delayed", severity: "Moderate", color: C.teal }
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", margin: "0 -16px", borderRadius: "8px", backgroundColor: `${s.color}06`, borderBottom: i < 2 ? `1px solid #E5E7EB` : "none" }}>
                <span style={{ fontSize: "15px", fontWeight: 500, color: C.navy }}>{s.scenario}</span>
                <span style={{ fontSize: "11px", fontWeight: 700, color: s.color, padding: "3px 10px", borderRadius: "6px", backgroundColor: `${s.color}10`, flexShrink: 0 }}>{s.severity}</span>
              </div>
            ))}
          </div>

          <div style={{
            backgroundColor: C.navy,
            padding: "24px 40px"
          }}>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "#fff", marginBottom: "6px" }}>Your Resilience Type: Moderate</div>
              <p style={{ fontSize: "13px", color: "rgba(244,241,234,0.55)", lineHeight: 1.6, margin: 0 }}>
                Your structure handles some challenges well, but concentrated income sources create vulnerability. Focus on diversification.
              </p>
            </div>
            <div style={{ padding: "14px 16px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.10em", color: C.risk, marginBottom: "4px" }}>PRIMARY RISK</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>Over-reliance on 1-2 income sources</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const goToPage = (index: number) => {
    if (index >= 0 && index < pages.length) {
      setCurrentPage(index);
    }
  };

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
              color: C.navy,
              margin: "0 0 20px 0"
            }}>
              Your Personalized Report
            </h2>
            <p style={{
              fontSize: "20px",
              fontWeight: 500,
              lineHeight: "1.6",
              color: C.textSecondary,
              margin: "0 0 32px 0"
            }}>
              A comprehensive 4-page analysis of your income stability. Click through to see exactly what you receive for $69.
            </p>

            <div style={{
              maxWidth: "680px",
              margin: "0 auto",
              padding: "24px 32px",
              backgroundColor: C.sand,
              border: "1px solid #DDD5CB",
              borderRadius: "12px"
            }}>
              <p style={{
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "1.6",
                color: C.navy,
                margin: "0"
              }}>
                Every report is personalized to your unique income structure. These pages show the actual format and depth of analysis you'll receive.
              </p>
            </div>
          </div>

          {/* Interactive Report Card */}
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            {/* Page Title & Description */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{
                fontSize: "28px",
                fontWeight: 700,
                color: C.navy,
                margin: "0 0 12px 0"
              }}>
                Page {currentPage + 1}: {pages[currentPage].title}
              </h3>
              <p style={{
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "1.7",
                color: C.textSecondary,
                margin: "0"
              }}>
                {pages[currentPage].description}
              </p>
            </div>

            {/* Report Card */}
            <div style={{
              backgroundColor: C.white,
              borderRadius: "16px",
              overflow: "hidden",
              marginBottom: "48px",
              boxShadow: "0 8px 32px rgba(14, 26, 43, 0.12), 0 2px 8px rgba(14, 26, 43, 0.06)"
            }}>
              {pages[currentPage].content}
            </div>

            {/* Navigation */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "24px"
            }}>
              {/* Previous Button */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 0}
                style={{
                  padding: "12px 24px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: currentPage === 0 ? "#D1D5DB" : C.navy,
                  backgroundColor: "transparent",
                  border: `1px solid ${currentPage === 0 ? "#E5E7EB" : C.navy}`,
                  borderRadius: "8px",
                  cursor: currentPage === 0 ? "not-allowed" : "pointer",
                  transition: "all 200ms ease",
                  opacity: currentPage === 0 ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (currentPage > 0) {
                    e.currentTarget.style.backgroundColor = C.navy;
                    e.currentTarget.style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = C.navy;
                }}
              >
                ← Previous
              </button>

              {/* Page Indicator */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flex: 1,
                justifyContent: "center"
              }}>
                {pages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToPage(index)}
                    style={{
                      width: index === currentPage ? "32px" : "12px",
                      height: "12px",
                      borderRadius: "6px",
                      backgroundColor: index === currentPage ? C.teal : "#E5E7EB",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 200ms ease"
                    }}
                    title={`Go to page ${index + 1}`}
                  />
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === pages.length - 1}
                style={{
                  padding: "12px 24px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: currentPage === pages.length - 1 ? "#D1D5DB" : C.navy,
                  backgroundColor: "transparent",
                  border: `1px solid ${currentPage === pages.length - 1 ? "#E5E7EB" : C.navy}`,
                  borderRadius: "8px",
                  cursor: currentPage === pages.length - 1 ? "not-allowed" : "pointer",
                  transition: "all 200ms ease",
                  opacity: currentPage === pages.length - 1 ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (currentPage < pages.length - 1) {
                    e.currentTarget.style.backgroundColor = C.navy;
                    e.currentTarget.style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = C.navy;
                }}
              >
                Next →
              </button>
            </div>

            {/* Final CTA */}
            <div style={{
              textAlign: "center",
              marginTop: "64px"
            }}>
              <button style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "56px",
                padding: "0 40px",
                borderRadius: "12px",
                backgroundColor: C.teal,
                color: "#FFFFFF",
                fontSize: "16px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                transition: "all 200ms ease",
                boxShadow: "0 8px 24px rgba(31, 109, 122, 0.16)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(31, 109, 122, 0.24)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(31, 109, 122, 0.16)";
              }}>
                Get Full Report for $69
              </button>
              <p style={{
                fontSize: "13px",
                color: C.textSecondary,
                marginTop: "12px",
                marginBottom: "0"
              }}>
                One-time purchase · No subscriptions
              </p>
            </div>
          </div>
        </div>

        {/* MOBILE */}
        <div className="lg:hidden">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{
              fontSize: "32px",
              fontWeight: 700,
              lineHeight: "1.2",
              color: C.navy,
              margin: "0 0 16px 0"
            }}>
              Your Personalized Report
            </h2>
            <p style={{
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "1.5",
              color: C.textSecondary,
              margin: "0 0 24px 0"
            }}>
              See all 4 pages of your personalized income stability analysis.
            </p>

            <div style={{
              padding: "20px 20px",
              backgroundColor: C.sand,
              border: "1px solid #DDD5CB",
              borderRadius: "12px"
            }}>
              <p style={{
                fontSize: "13px",
                fontWeight: 500,
                lineHeight: "1.5",
                color: C.navy,
                margin: "0"
              }}>
                Every report is personalized to your unique income structure.
              </p>
            </div>
          </div>

          {/* Interactive Report Card Mobile */}
          <div>
            {/* Page Title & Description */}
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{
                fontSize: "20px",
                fontWeight: 700,
                color: C.navy,
                margin: "0 0 8px 0"
              }}>
                Page {currentPage + 1}: {pages[currentPage].title}
              </h3>
              <p style={{
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "1.6",
                color: C.textSecondary,
                margin: "0"
              }}>
                {pages[currentPage].description}
              </p>
            </div>

            {/* Report Card Mobile */}
            <div style={{
              backgroundColor: C.white,
              borderRadius: "16px",
              overflow: "hidden",
              marginBottom: "32px",
              boxShadow: "0 8px 32px rgba(14, 26, 43, 0.12), 0 2px 8px rgba(14, 26, 43, 0.06)"
            }}>
              <div style={{ transform: "scale(0.85)", transformOrigin: "top left", width: "117.65%" }}>
                {pages[currentPage].content}
              </div>
            </div>

            {/* Page Dots */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "28px"
            }}>
              {pages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  style={{
                    width: index === currentPage ? "28px" : "10px",
                    height: "10px",
                    borderRadius: "5px",
                    backgroundColor: index === currentPage ? C.teal : "#E5E7EB",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 200ms ease"
                  }}
                />
              ))}
            </div>

            {/* Navigation Buttons Mobile */}
            <div style={{
              display: "flex",
              gap: "12px",
              marginBottom: "32px"
            }}>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 0}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: currentPage === 0 ? "#D1D5DB" : C.navy,
                  backgroundColor: "transparent",
                  border: `1px solid ${currentPage === 0 ? "#E5E7EB" : C.navy}`,
                  borderRadius: "8px",
                  cursor: currentPage === 0 ? "not-allowed" : "pointer",
                  opacity: currentPage === 0 ? 0.5 : 1
                }}
              >
                Previous
              </button>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === pages.length - 1}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: currentPage === pages.length - 1 ? "#D1D5DB" : C.navy,
                  backgroundColor: "transparent",
                  border: `1px solid ${currentPage === pages.length - 1 ? "#E5E7EB" : C.navy}`,
                  borderRadius: "8px",
                  cursor: currentPage === pages.length - 1 ? "not-allowed" : "pointer",
                  opacity: currentPage === pages.length - 1 ? 0.5 : 1
                }}
              >
                Next
              </button>
            </div>

            {/* Final CTA Mobile */}
            <div>
              <button style={{
                width: "100%",
                height: "52px",
                borderRadius: "12px",
                backgroundColor: C.teal,
                color: "#FFFFFF",
                fontSize: "15px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                transition: "all 150ms ease",
                boxShadow: "0 6px 20px rgba(31, 109, 122, 0.16)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(31, 109, 122, 0.24)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(31, 109, 122, 0.16)";
              }}>
                Get Full Report for $69
              </button>
              <p style={{
                fontSize: "12px",
                color: C.textSecondary,
                textAlign: "center",
                marginTop: "10px",
                marginBottom: "0"
              }}>
                One-time purchase · No subscriptions
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
