"use client";

export default function SectionSampleReport() {
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

  return (
    <section style={{
      backgroundColor: "#FFFFFF",
      padding: "96px 24px",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* DESKTOP */}
        <div className="hidden lg:block">
          <div style={{ textAlign: "center", marginBottom: "72px" }}>
            <h2 style={{
              fontSize: "32px",
              fontWeight: 700,
              lineHeight: "1.2",
              color: C.navy,
              margin: "0 0 16px 0"
            }}>
              This Is What You Get for $69
            </h2>
            <p style={{
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: "1.6",
              color: C.textSecondary,
              margin: "0 0 24px 0"
            }}>
              A four-page professional report showing your complete income stability breakdown, risks, and actionable plan
            </p>
            <div style={{
              maxWidth: "640px",
              margin: "0 auto",
              padding: "20px 28px",
              backgroundColor: C.sand,
              border: "1px solid #E5E7EB",
              borderRadius: "12px"
            }}>
              <p style={{
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "1.6",
                color: C.navy,
                margin: "0"
              }}>
                This sample shows the format and structure of your report. Your actual report uses your real data to generate a personalized score, breakdown, and recommendations tailored to your unique income structure.
              </p>
            </div>
          </div>

          {/* PAGE 1: SCORE */}
          <div style={{ marginBottom: "48px" }}>
            <div style={{
              backgroundColor: C.white,
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(14,26,43,0.08)"
            }}>
              {/* Header */}
              <div style={{
                padding: "18px 32px",
                borderBottom: "1px solid #E5E7EB",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: C.navy }}>RunPayway™</span>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: C.teal }}>Income Stability Report</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "12px", color: C.textMuted }}>SAMPLE</span>
                </div>
              </div>

              {/* Score section */}
              <div style={{
                padding: "40px 32px",
                backgroundColor: C.navy,
                background: `linear-gradient(135deg, ${C.navy} 0%, #0a0f18 100%)`,
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

                {/* Score details */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 14px", borderRadius: "100px", backgroundColor: `${C.teal}18`, marginBottom: "16px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: C.teal }} />
                    <span style={{ fontSize: "13px", fontWeight: 600, color: C.teal }}>Stability Classification</span>
                  </div>

                  <div style={{ padding: "14px 16px", borderRadius: "0 14px 14px 0", backgroundColor: "rgba(255,255,255,0.07)", borderLeft: `4px solid ${C.teal}`, marginBottom: "20px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "rgba(244,241,234,0.45)", marginBottom: "6px" }}>KEY INSIGHT</div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>Personalized to your income structure</div>
                    <p style={{ fontSize: "13px", color: "rgba(244,241,234,0.55)", lineHeight: 1.5, margin: "6px 0 0" }}>Based on your specific answers and financial situation.</p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                    {[
                      { label: "STRUCTURAL TYPE", value: "[Your Type]" },
                      { label: "MODEL", value: "RP-2.0" },
                      { label: "ACCESS CODE", value: "[Unique]" }
                    ].map((item, i) => (
                      <div key={i}>
                        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.10em", color: "rgba(244,241,234,0.30)", marginBottom: "4px" }}>{item.label}</div>
                        <div style={{ fontSize: "13px", fontWeight: 600, fontFamily: mono, color: "rgba(244,241,234,0.75)" }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scale bar */}
              <div style={{ padding: "20px 32px", backgroundColor: C.sand }}>
                <div style={{ position: "relative", height: "12px", borderRadius: "999px", overflow: "hidden", marginBottom: "16px" }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: "999px", display: "flex" }}>
                    <div style={{ width: "29%", backgroundColor: `${C.risk}30` }} />
                    <div style={{ width: "21%", backgroundColor: `${C.moderate}30` }} />
                    <div style={{ width: "25%", backgroundColor: `${C.teal}30` }} />
                    <div style={{ width: "25%", backgroundColor: `${C.green}30` }} />
                  </div>
                  <div style={{ position: "absolute", left: "50%", top: "-1px", width: "4px", height: "14px", borderRadius: "2px", backgroundColor: C.navy, transform: "translateX(-50%)", boxShadow: "0 1px 4px rgba(14,26,43,0.20)" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", fontSize: "11px" }}>
                  {[
                    { label: "Limited", color: C.risk },
                    { label: "Developing", color: C.moderate },
                    { label: "Established", color: C.teal },
                    { label: "High", color: C.green }
                  ].map((band, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div style={{ fontWeight: 600, color: band.color }}>{band.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PAGE 2: KEY FINDINGS */}
          <div style={{ marginBottom: "48px" }}>
            <div style={{
              backgroundColor: C.white,
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(14,26,43,0.08)"
            }}>
              {/* Header */}
              <div style={{
                backgroundColor: C.navy,
                padding: "28px 32px",
                position: "relative"
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${C.teal}, #4B3FAE)` }} />
                <div style={{ fontSize: "20px", fontWeight: 600, color: "#fff", marginBottom: "12px" }}>Key Structural Findings</div>
                <div style={{ borderLeft: `3px solid ${C.teal}`, padding: "12px 16px", borderRadius: "0 10px 10px 0", backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <p style={{ fontSize: "15px", fontWeight: 500, color: "rgba(244,241,234,0.80)", margin: 0, lineHeight: 1.5 }}>
                    Your income analyzed across key stability factors.
                  </p>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "28px 32px" }}>
                {/* Income breakdown */}
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.10em", color: C.textMuted, marginBottom: "12px" }}>HOW YOUR INCOME BEHAVES</div>
                  <div style={{ display: "flex", height: "12px", borderRadius: "999px", overflow: "hidden", marginBottom: "12px" }}>
                    <div style={{ width: "45%", backgroundColor: C.risk }} />
                    <div style={{ width: "25%", backgroundColor: C.moderate }} />
                    <div style={{ width: "30%", backgroundColor: C.teal }} />
                  </div>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    {[
                      { label: "Active Income", color: C.risk },
                      { label: "Conditional Income", color: C.moderate },
                      { label: "Recurring Income", color: C.teal }
                    ].map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "2px", backgroundColor: s.color }} />
                        <span style={{ fontSize: "12px", color: C.textSecondary }}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strength + Constraint */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {[
                    { label: "STRONGEST FACTOR", text: "Your income pattern", color: C.teal },
                    { label: "PRIMARY CONSTRAINT", text: "Your income structure", color: C.risk }
                  ].map((item, i) => (
                    <div key={i} style={{ padding: "16px 20px", borderRadius: "12px", backgroundColor: C.sand, border: `1px solid ${item.color}15` }}>
                      <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.10em", color: item.color, marginBottom: "6px" }}>{item.label}</div>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: C.navy, margin: 0, lineHeight: 1.5 }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PAGE 3: ACTION PLAN */}
          <div style={{ marginBottom: "48px" }}>
            <div style={{
              backgroundColor: C.white,
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(14,26,43,0.08)"
            }}>
              {/* Header */}
              <div style={{
                backgroundColor: C.navy,
                padding: "28px 32px",
                position: "relative"
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, #4B3FAE, ${C.teal})` }} />
                <div style={{ fontSize: "20px", fontWeight: 600, color: "#fff", marginBottom: "6px" }}>What Moves Your Score</div>
                <p style={{ fontSize: "13px", color: "rgba(244,241,234,0.50)", margin: 0 }}>Prioritized actions based on your situation.</p>
              </div>

              {/* Actions */}
              <div style={{ padding: "20px 32px" }}>
                {[
                  { num: "01", action: "First Priority", desc: "Tailored to your income structure" },
                  { num: "02", action: "Second Priority", desc: "Personalized recommendation" },
                  { num: "03", action: "Third Priority", desc: "Custom action based on your data" }
                ].map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "16px 0", borderBottom: i < 2 ? "1px solid #E5E7EB" : "none" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: C.navy, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>{a.num}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "15px", fontWeight: 600, color: C.navy, marginBottom: "4px" }}>{a.action}</div>
                      <div style={{ fontSize: "13px", color: C.textSecondary }}>{a.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Impact */}
              <div style={{
                backgroundColor: C.navy,
                padding: "24px 32px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.10em", color: "rgba(244,241,234,0.35)", marginBottom: "12px" }}>WHEN ACTIONED</div>
                <div style={{ fontSize: "16px", fontWeight: 600, color: C.teal }}>Your score improves based on your specific changes</div>
              </div>
            </div>
          </div>

          {/* PAGE 4: STRESS TEST */}
          <div style={{ marginBottom: "48px" }}>
            <div style={{
              backgroundColor: C.white,
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(14,26,43,0.08)"
            }}>
              {/* Header */}
              <div style={{
                backgroundColor: C.navy,
                padding: "28px 32px",
                position: "relative"
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${C.risk}, ${C.moderate})` }} />
                <div style={{ fontSize: "20px", fontWeight: 600, color: "#fff", marginBottom: "6px" }}>Stress Testing Your Income</div>
                <p style={{ fontSize: "13px", color: "rgba(244,241,234,0.50)", margin: 0 }}>How your structure responds under real conditions.</p>
              </div>

              {/* Scenarios */}
              <div style={{ padding: "16px 32px" }}>
                {[
                  { scenario: "First Scenario", severity: "High", color: C.risk },
                  { scenario: "Second Scenario", severity: "Medium", color: C.moderate },
                  { scenario: "Third Scenario", severity: "Low-Medium", color: C.teal }
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", margin: "0 -16px", borderRadius: "8px", backgroundColor: `${s.color}06`, borderBottom: i < 2 ? `1px solid #E5E7EB` : "none" }}>
                    <span style={{ fontSize: "15px", fontWeight: 500, color: C.navy }}>{s.scenario}</span>
                    <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em", color: s.color, padding: "3px 10px", borderRadius: "6px", backgroundColor: `${s.color}10`, flexShrink: 0 }}>{s.severity}</span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div style={{
                backgroundColor: C.navy,
                padding: "24px 32px"
              }}>
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "#fff", marginBottom: "6px" }}>Your Resilience Profile</div>
                  <p style={{ fontSize: "13px", color: "rgba(244,241,234,0.55)", lineHeight: 1.6, margin: 0 }}>
                    Personalized analysis shows how your income holds under different conditions.
                  </p>
                </div>
                <div style={{ padding: "14px 16px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.10em", color: C.risk, marginBottom: "4px" }}>KEY FINDING</div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>Based on your unique income structure</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center" }}>
            <button style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "56px",
              padding: "0 32px",
              borderRadius: "12px",
              backgroundColor: C.navy,
              color: "#FFFFFF",
              fontSize: "16px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 150ms ease",
              boxShadow: "0 8px 24px rgba(14,26,43,0.12)",
              fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.16)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.12)";
            }}>
              Get Your Full Report Today — $69
            </button>
          </div>
        </div>

        {/* MOBILE */}
        <div className="lg:hidden">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: "1.2",
              color: C.navy,
              margin: "0 0 12px 0"
            }}>
              This Is What You Get for $69
            </h2>
            <p style={{
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "1.5",
              color: C.textSecondary,
              margin: "0 0 20px 0"
            }}>
              Four-page professional report with complete breakdown and action plan
            </p>
            <div style={{
              padding: "16px 16px",
              backgroundColor: C.sand,
              border: "1px solid #E5E7EB",
              borderRadius: "8px"
            }}>
              <p style={{
                fontSize: "12px",
                fontWeight: 500,
                lineHeight: "1.5",
                color: C.navy,
                margin: "0"
              }}>
                Your report is personalized to your unique income structure.
              </p>
            </div>
          </div>

          {/* PAGE 1 MOBILE */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{
              backgroundColor: C.white,
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(14,26,43,0.08)"
            }}>
              <div style={{
                padding: "12px 16px",
                borderBottom: "1px solid #E5E7EB",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px"
              }}>
                <span style={{ fontWeight: 600, color: C.navy }}>RunPayway™</span>
                <span style={{ fontWeight: 600, color: C.textMuted }}>SAMPLE</span>
              </div>
              <div style={{
                backgroundColor: C.navy,
                padding: "24px 16px",
                position: "relative",
                textAlign: "center"
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, ${C.teal}, #4B3FAE)` }} />
                <div style={{ width: "80px", height: "80px", margin: "0 auto 12px", position: "relative" }}>
                  <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                    <circle cx="40" cy="40" r="36" fill="none" stroke={C.teal} strokeWidth="5"
                      strokeDasharray={2 * Math.PI * 36}
                      strokeDashoffset={2 * Math.PI * 36 * (1 - 0.65)}
                      strokeLinecap="round" />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "24px", fontWeight: 300, color: "#fff" }}>XX</span>
                    <span style={{ fontSize: "10px", color: "rgba(244,241,234,0.40)" }}>/100</span>
                  </div>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 10px", borderRadius: "100px", backgroundColor: `${C.teal}18`, marginBottom: "12px" }}>
                  <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: C.teal }} />
                  <span style={{ fontSize: "11px", fontWeight: 600, color: C.teal }}>Personalized</span>
                </div>
              </div>
            </div>
          </div>

          {/* PAGE 2 MOBILE */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{
              backgroundColor: C.white,
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(14,26,43,0.08)"
            }}>
              <div style={{
                backgroundColor: C.navy,
                padding: "16px 12px"
              }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "6px" }}>Key Findings</div>
              </div>
              <div style={{ padding: "12px" }}>
                <div style={{ display: "flex", height: "8px", borderRadius: "999px", overflow: "hidden", marginBottom: "12px" }}>
                  <div style={{ width: "45%", backgroundColor: C.risk }} />
                  <div style={{ width: "25%", backgroundColor: C.moderate }} />
                  <div style={{ width: "30%", backgroundColor: C.teal }} />
                </div>
                <div style={{ fontSize: "11px", color: C.textSecondary, lineHeight: 1.5 }}>
                  <strong style={{ color: C.navy }}>Categories:</strong> Active, Conditional, Recurring
                </div>
              </div>
            </div>
          </div>

          {/* PAGE 3 MOBILE */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{
              backgroundColor: C.white,
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(14,26,43,0.08)"
            }}>
              <div style={{
                backgroundColor: C.navy,
                padding: "16px 12px"
              }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>Actionable Priorities</div>
              </div>
              <div style={{ padding: "12px" }}>
                {[
                  { num: "01", action: "Priority 1" },
                  { num: "02", action: "Priority 2" },
                  { num: "03", action: "Priority 3" }
                ].map((a, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 2 ? "1px solid #E5E7EB" : "none" }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: C.navy }}>{a.action}</span>
                    <span style={{ fontSize: "11px", color: C.textMuted }}>Personalized</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PAGE 4 MOBILE */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{
              backgroundColor: C.white,
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(14,26,43,0.08)"
            }}>
              <div style={{
                backgroundColor: C.navy,
                padding: "16px 12px"
              }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>Stress Testing</div>
              </div>
              <div style={{ padding: "12px" }}>
                {[
                  { scenario: "Scenario 1", severity: "High" },
                  { scenario: "Scenario 2", severity: "Medium" },
                  { scenario: "Scenario 3", severity: "Low-Medium" }
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 2 ? "1px solid #E5E7EB" : "none" }}>
                    <span style={{ fontSize: "11px", color: C.navy }}>{s.scenario}</span>
                    <span style={{ fontSize: "10px", fontWeight: 600, color: C.textMuted }}>{s.severity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center" }}>
            <button style={{
              width: "100%",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: C.navy,
              color: "#FFFFFF",
              fontSize: "15px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 150ms ease",
              fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(14,26,43,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}>
              Get Your Full Report — $69
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
