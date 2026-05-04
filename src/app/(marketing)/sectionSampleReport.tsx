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
      title: "Executive Summary: Your Decision Impact",
      description: "Your score, classification, and the financial implications for your specific situation. This is the bottom line: what your income structure means for your next move.",
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
                strokeDashoffset={2 * Math.PI * 60 * (1 - 0.31)}
                strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${C.teal}40)` }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "44px", fontWeight: 300, fontFamily: mono, color: "#fff", lineHeight: 1, letterSpacing: "-0.04em" }}>31</span>
              <span style={{ fontSize: "12px", color: "rgba(244,241,234,0.40)", marginTop: "2px" }}>/100</span>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 14px", borderRadius: "100px", backgroundColor: `${C.risk}20`, marginBottom: "16px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: C.risk }} />
              <span style={{ fontSize: "13px", fontWeight: 600, color: C.risk }}>Limited Stability</span>
            </div>

            <div style={{ padding: "14px 16px", borderRadius: "0 14px 14px 0", backgroundColor: "rgba(255,255,255,0.07)", borderLeft: `4px solid ${C.risk}`, marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "rgba(244,241,234,0.45)", marginBottom: "6px" }}>MORTGAGE IMPACT</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>Reduces qualification by ~$85K</div>
              <p style={{ fontSize: "13px", color: "rgba(244,241,234,0.55)", lineHeight: 1.5, margin: "6px 0 0" }}>Your income concentration and forward visibility are the primary constraints lenders identify.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                { label: "RISK PROFILE", value: "High Vulnerability" },
                { label: "PRIMARY ISSUE", value: "80% from 1 client" }
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.10em", color: "rgba(244,241,234,0.30)", marginBottom: "4px" }}>{item.label}</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "rgba(244,241,234,0.75)" }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "What's Holding You Back (Financial Impact)",
      description: "The 5 specific risks in your income structure—and exactly how much each one could cost you in rates, qualification limits, or lost opportunity.",
      content: (
        <div style={{
          backgroundColor: C.white,
          borderRadius: "16px",
          overflow: "hidden"
        }}>
          <div style={{
            backgroundColor: C.navy,
            padding: "28px 40px",
            position: "relative"
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${C.risk}, ${C.moderate})` }} />
            <div style={{ fontSize: "20px", fontWeight: 600, color: "#fff", marginBottom: "6px" }}>Your 5 Critical Risks</div>
            <p style={{ fontSize: "13px", color: "rgba(244,241,234,0.50)", margin: 0 }}>Each quantified with direct financial impact.</p>
          </div>

          <div style={{ padding: "24px 40px" }}>
            {[
              { rank: "1", risk: "Income Concentration", severity: "CRITICAL", impact: "$85K mortgage reduction", detail: "80% from one client. If lost, you lose ability to qualify." },
              { rank: "2", risk: "No Forward Visibility", severity: "HIGH", impact: "~1.5% higher rate", detail: "Lenders prefer 12+ months locked. You have 60 days." },
              { rank: "3", risk: "Minimal Passive Income", severity: "HIGH", impact: "$120K+ qualification gap", detail: "0% recurring income = all earnings are active-dependent." },
              { rank: "4", risk: "Income Volatility", severity: "MODERATE", impact: "Longer approval process", detail: "Month-to-month variance = lender scrutiny + delay." },
              { rank: "5", risk: "No Financial Buffer", severity: "MODERATE", impact: "Vulnerability to disruption", detail: "Single income drop = immediate cash flow crisis." }
            ].map((r, i) => (
              <div key={i} style={{ marginBottom: i < 4 ? "20px" : 0, paddingBottom: i < 4 ? "20px" : 0, borderBottom: i < 4 ? "1px solid #E5E7EB" : "none" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "6px", backgroundColor: r.severity === "CRITICAL" ? C.risk : r.severity === "HIGH" ? C.moderate : C.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                    {r.rank}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px", gap: "12px" }}>
                      <span style={{ fontSize: "15px", fontWeight: 600, color: C.navy }}>{r.risk}</span>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: r.severity === "CRITICAL" ? C.risk : r.severity === "HIGH" ? C.moderate : C.teal, padding: "2px 8px", borderRadius: "4px", backgroundColor: r.severity === "CRITICAL" ? "rgba(199, 70, 52, 0.1)" : r.severity === "HIGH" ? "rgba(208, 162, 58, 0.1)" : "rgba(31, 109, 122, 0.1)", flexShrink: 0 }}>{r.severity}</span>
                    </div>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: C.risk, margin: "0 0 4px 0" }}>{r.impact}</p>
                    <p style={{ fontSize: "13px", color: C.textSecondary, margin: 0, lineHeight: 1.5 }}>{r.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            backgroundColor: C.sand,
            padding: "20px 40px",
            borderTop: "1px solid #DDD5CB"
          }}>
            <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.10em", color: C.navy, marginBottom: "6px" }}>TOTAL FINANCIAL IMPACT IF UNADDRESSED</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: C.risk }}>~$205K+ in lost qualification capacity + 1-3% rate penalty</div>
          </div>
        </div>
      )
    },
    {
      title: "Your 12-Month Implementation Roadmap",
      description: "Specific actions, timelines, and the exact financial benefit of each. Know what to do this week, month, and quarter—with quantified impact.",
      content: (
        <div style={{
          backgroundColor: C.white,
          borderRadius: "16px",
          overflow: "hidden"
        }}>
          <div style={{
            backgroundColor: C.navy,
            padding: "28px 40px",
            position: "relative"
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, #4B3FAE, ${C.teal})` }} />
            <div style={{ fontSize: "20px", fontWeight: 600, color: "#fff", marginBottom: "6px" }}>Your Path to Stability</div>
            <p style={{ fontSize: "13px", color: "rgba(244,241,234,0.50)", margin: 0 }}>Prioritized by impact and timeline.</p>
          </div>

          <div style={{ padding: "28px 40px" }}>
            {[
              {
                phase: "WEEKS 1-4 (Immediate)",
                actions: [
                  { task: "Document all income sources", impact: "Prepare for lender review", effort: "Low" },
                  { task: "Create 12-month projection", impact: "Show forward visibility", effort: "Low" },
                  { task: "Reach out to 3 potential clients", impact: "Begin diversification", effort: "Medium" }
                ]
              },
              {
                phase: "MONTHS 2-3 (Quick Wins)",
                actions: [
                  { task: "Secure 1 additional client/project", impact: "+8% income diversification, +12 score points", effort: "Medium" },
                  { task: "Convert 1 project to 6-month retainer", impact: "+$X/month recurring, +9 score points", effort: "Medium" },
                  { task: "Build 30-day emergency fund", impact: "Demonstrates financial stability", effort: "Low" }
                ]
              },
              {
                phase: "MONTHS 4-9 (Strategic Growth)",
                actions: [
                  { task: "Reduce dependency on primary client to 60%", impact: "+18 score points, reduces $85K qualification gap to $45K", effort: "High" },
                  { task: "Build recurring revenue to 25% of income", impact: "+15 score points, improves rate by ~0.5%", effort: "High" },
                  { task: "Establish product/service you can offer scaled", impact: "Long-term passive income foundation", effort: "High" }
                ]
              },
              {
                phase: "MONTHS 10-12 (Optimization)",
                actions: [
                  { task: "Review and lock forward contracts", impact: "Complete forward visibility, final +10 score points", effort: "Medium" },
                  { task: "Retake assessment", impact: "Measure progress toward 60+ score", effort: "Low" }
                ]
              }
            ].map((section, si) => (
              <div key={si} style={{ marginBottom: si < 3 ? "32px" : 0 }}>
                <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.10em", color: C.teal, marginBottom: "16px" }}>{section.phase}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {section.actions.map((a, ai) => (
                    <div key={ai} style={{ padding: "12px 16px", borderRadius: "8px", backgroundColor: C.sand, border: "1px solid #DDD5CB" }}>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: C.navy, marginBottom: "4px" }}>{a.task}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                        <span style={{ fontSize: "12px", color: C.textSecondary }}>{a.impact}</span>
                        <span style={{ fontSize: "11px", fontWeight: 600, color: C.textMuted, padding: "2px 8px", borderRadius: "4px", backgroundColor: "#fff", border: "1px solid #E5E7EB", flexShrink: 0 }}>{a.effort}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            backgroundColor: C.navy,
            padding: "24px 40px"
          }}>
            <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.10em", color: "rgba(244,241,234,0.35)", marginBottom: "8px" }}>PROJECTED OUTCOME (12 MONTHS)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              {[
                { label: "Current Score", value: "31", change: "" },
                { label: "Projected Score", value: "67", change: "+36 pts" },
                { label: "Mortgage Impact", value: "$215K+", change: "vs. ~$85K gap today" }
              ].map((m, i) => (
                <div key={i}>
                  <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", color: "rgba(244,241,234,0.35)", marginBottom: "4px" }}>{m.label}</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: mono, color: C.teal }}>{m.value}</div>
                  {m.change && <div style={{ fontSize: "11px", color: "rgba(244,241,234,0.50)", marginTop: "2px" }}>{m.change}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Professional Documentation (For Lenders/Advisors)",
      description: "A certified summary you can share with mortgage lenders, financial advisors, or business partners. Timestamped proof of your income analysis.",
      content: (
        <div style={{
          backgroundColor: C.white,
          borderRadius: "16px",
          overflow: "hidden"
        }}>
          <div style={{
            backgroundColor: C.navy,
            padding: "28px 40px",
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start"
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${C.teal}, #4B3FAE)` }} />
              <div style={{ fontSize: "14px", fontWeight: 600, color: C.teal, marginBottom: "8px" }}>INCOME STABILITY ASSESSMENT</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff" }}>Professional Summary</div>
            </div>
            <div style={{ textAlign: "right", fontSize: "11px", color: "rgba(244,241,234,0.40)" }}>
              <div>Timestamped</div>
              <div style={{ fontFamily: mono, marginTop: "4px" }}>May 2026</div>
            </div>
          </div>

          <div style={{ padding: "32px 40px" }}>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.10em", color: C.textMuted, marginBottom: "8px" }}>SUBJECT</div>
              <div style={{ fontSize: "16px", fontWeight: 600, color: C.navy, marginBottom: "12px" }}>Income Structure Analysis & Stability Certification</div>
              <p style={{ fontSize: "14px", lineHeight: 1.6, color: C.textSecondary, margin: 0 }}>
                This document certifies that the undersigned has completed a comprehensive income stability assessment using the RunPayway™ Income Stability Score™ (Model RP-2.0). The assessment evaluates income structure across 6 factors: Concentration, Source Diversity, Forward Visibility, Stability Pattern, Continuity, and Dependency.
              </p>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.10em", color: C.textMuted, marginBottom: "8px" }}>KEY FINDINGS</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {[
                  { label: "Stability Score", value: "31/100" },
                  { label: "Classification", value: "Limited Stability" },
                  { label: "Primary Constraint", value: "Income Concentration (80% from 1 source)" },
                  { label: "Risk Profile", value: "High Vulnerability to Disruption" }
                ].map((f, i) => (
                  <div key={i} style={{ padding: "12px 16px", backgroundColor: C.sand, borderRadius: "8px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: C.textMuted, marginBottom: "4px" }}>{f.label}</div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: C.navy }}>{f.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.10em", color: C.textMuted, marginBottom: "8px" }}>PROFESSIONAL USE</div>
              <p style={{ fontSize: "14px", lineHeight: 1.6, color: C.textSecondary, margin: 0 }}>
                This report is designed for use with financial advisors, mortgage lenders, business partners, and investors. It provides objective, data-driven assessment of income stability using fixed rules—same inputs always produce the same score. No algorithms, no AI predictions. Rules-based analysis you can rely on.
              </p>
            </div>

            <div style={{
              padding: "16px 20px",
              backgroundColor: "rgba(31, 109, 122, 0.08)",
              borderLeft: `4px solid ${C.teal}`,
              borderRadius: "0 8px 8px 0",
              fontSize: "12px",
              color: C.textSecondary,
              lineHeight: 1.6
            }}>
              This assessment is confidential, timestamped, and yours to use and share at your discretion. Your data is encrypted and never shared with third parties.
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Stress Testing: What If Scenarios",
      description: "See exactly how your income structure responds to real-world challenges. Understand your contingency position and resilience.",
      content: (
        <div style={{
          backgroundColor: C.white,
          borderRadius: "16px",
          overflow: "hidden"
        }}>
          <div style={{
            backgroundColor: C.navy,
            padding: "28px 40px",
            position: "relative"
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${C.risk}, ${C.moderate})` }} />
            <div style={{ fontSize: "20px", fontWeight: 600, color: "#fff", marginBottom: "6px" }}>When Crisis Hits</div>
            <p style={{ fontSize: "13px", color: "rgba(244,241,234,0.50)", margin: 0 }}>Real scenarios, real impact on your financial position.</p>
          </div>

          <div style={{ padding: "28px 40px" }}>
            {[
              {
                scenario: "Lose your primary client (80% of income)",
                severity: C.risk,
                severityLabel: "CRITICAL",
                outcomes: [
                  "Income drops to $X/month (from $X/month)",
                  "Cannot qualify for mortgage",
                  "Emergency fund depleted in 45 days",
                  "Must immediately secure replacement"
                ]
              },
              {
                scenario: "Unable to work for 90 days",
                severity: C.moderate,
                severityLabel: "HIGH",
                outcomes: [
                  "Passive/conditional income: $X/month continues",
                  "Active income: $0 for quarter",
                  "Emergency fund covers ~60 days",
                  "Dependent clients may churn"
                ]
              },
              {
                scenario: "Market downturn reduces project work by 40%",
                severity: C.moderate,
                severityLabel: "MODERATE",
                outcomes: [
                  "Income decreases to $X/month",
                  "Still qualify for mortgage, but tighter",
                  "Emergency fund lasts 120+ days",
                  "Primary client income unaffected"
                ]
              }
            ].map((s, i) => (
              <div key={i} style={{ marginBottom: i < 2 ? "24px" : 0, paddingBottom: i < 2 ? "24px" : 0, borderBottom: i < 2 ? "1px solid #E5E7EB" : "none" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                  <div style={{ padding: "6px 10px", borderRadius: "6px", backgroundColor: `${s.severity}15`, fontSize: "10px", fontWeight: 700, color: s.severity, flexShrink: 0 }}>{s.severityLabel}</div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: C.navy, flex: 1 }}>{s.scenario}</div>
                </div>
                <ul style={{ margin: "0 0 0 16px", padding: 0, fontSize: "13px", color: C.textSecondary, lineHeight: 1.7 }}>
                  {s.outcomes.map((o, oi) => (
                    <li key={oi} style={{ marginBottom: "6px" }}>{o}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{
            backgroundColor: C.sand,
            padding: "20px 40px",
            borderTop: "1px solid #DDD5CB"
          }}>
            <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.10em", color: C.navy, marginBottom: "6px" }}>YOUR RESILIENCE ASSESSMENT</div>
            <p style={{ fontSize: "14px", color: C.textSecondary, margin: 0, lineHeight: 1.6 }}>You have low financial resilience. Your income structure is vulnerable to disruption because 80% comes from a single source. Without emergency fund diversification, you have ~45 days before crisis. This is why the 12-month roadmap prioritizes diversification first.</p>
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
              Inside Your $69 Report
            </h2>
            <p style={{
              fontSize: "20px",
              fontWeight: 500,
              lineHeight: "1.6",
              color: C.textSecondary,
              margin: "0 0 32px 0"
            }}>
              A $289-quality comprehensive analysis. Click through all 5 pages to see exactly what you're getting—zero fluff, 100% actionable.
            </p>

            <div style={{
              maxWidth: "720px",
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
                Every metric, financial impact, and timeline below is personalized to <strong>your unique income structure</strong>. This is what you'll unlock for $69.
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
                Page {currentPage + 1} of {pages.length}: {pages[currentPage].title}
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
              Inside Your $69 Report
            </h2>
            <p style={{
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "1.5",
              color: C.textSecondary,
              margin: "0 0 20px 0"
            }}>
              $289-quality analysis. All 5 pages, personalized to you.
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
                Every metric below is personalized to your income. This is exactly what you'll get.
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
                Page {currentPage + 1} of {pages.length}: {pages[currentPage].title}
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
