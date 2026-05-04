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
              margin: "0"
            }}>
              A four-page professional report showing your complete income stability breakdown, risks, and actionable plan
            </p>
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
                  <span style={{ fontSize: "12px", color: C.textMuted }}>2026-03-15</span>
                  <span style={{ fontSize: "11px", fontWeight: 600, fontFamily: mono, color: C.textMuted, padding: "3px 8px", borderRadius: "6px", backgroundColor: "rgba(14,26,43,0.04)" }}>RP-7X2K</span>
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
                      strokeDashoffset={2 * Math.PI * 60 * (1 - 0.72)}
                      strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${C.teal}40)` }} />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "44px", fontWeight: 300, fontFamily: mono, color: "#fff", lineHeight: 1, letterSpacing: "-0.04em" }}>72</span>
                    <span style={{ fontSize: "12px", color: "rgba(244,241,234,0.40)", marginTop: "2px" }}>/100</span>
                  </div>
                </div>

                {/* Score details */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 14px", borderRadius: "100px", backgroundColor: `${C.teal}18`, marginBottom: "16px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: C.teal }} />
                    <span style={{ fontSize: "13px", fontWeight: 600, color: C.teal }}>Established Stability</span>
                  </div>

                  <div style={{ padding: "14px 16px", borderRadius: "0 14px 14px 0", backgroundColor: "rgba(255,255,255,0.07)", borderLeft: `4px solid ${C.teal}`, marginBottom: "20px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "rgba(244,241,234,0.45)", marginBottom: "6px" }}>NEXT LEVEL</div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>3 points to High Stability (75+)</div>
                    <p style={{ fontSize: "13px", color: "rgba(244,241,234,0.55)", lineHeight: 1.5, margin: "6px 0 0" }}>Converting one client to retainer would close this gap.</p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                    {[
                      { label: "STRUCTURAL TYPE", value: "Uneven" },
                      { label: "MODEL", value: "RP-2.0" },
                      { label: "ACCESS CODE", value: "RP-7X2K" }
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
                  <div style={{ position: "absolute", left: "72%", top: "-1px", width: "4px", height: "14px", borderRadius: "2px", backgroundColor: C.navy, transform: "translateX(-50%)", boxShadow: "0 1px 4px rgba(14,26,43,0.20)" }} />
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
                    Your income is stable—but one source carries most of the risk.
                  </p>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "28px 32px" }}>
                {/* Income breakdown */}
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.10em", color: C.textMuted, marginBottom: "12px" }}>HOW YOUR INCOME BEHAVES</div>
                  <div style={{ display: "flex", height: "12px", borderRadius: "999px", overflow: "hidden", marginBottom: "12px" }}>
                    <div style={{ width: "55%", backgroundColor: C.risk }} />
                    <div style={{ width: "20%", backgroundColor: C.moderate }} />
                    <div style={{ width: "25%", backgroundColor: C.teal }} />
                  </div>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    {[
                      { label: "Stops if you stop", value: "55%", color: C.risk },
                      { label: "Continues temporarily", value: "20%", color: C.moderate },
                      { label: "Protected", value: "25%", color: C.teal }
                    ].map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "2px", backgroundColor: s.color }} />
                        <span style={{ fontSize: "12px", color: C.textSecondary }}>{s.label}: <strong style={{ fontFamily: mono, fontWeight: 600, color: C.navy }}>{s.value}</strong></span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strength + Constraint */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {[
                    { label: "STRONGEST FACTOR", text: "Income remains steady month to month", color: C.teal },
                    { label: "PRIMARY CONSTRAINT", text: "Too much reliance on a single source", color: C.risk }
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
                <p style={{ fontSize: "13px", color: "rgba(244,241,234,0.50)", margin: 0 }}>Targeted actions based on your current structure.</p>
              </div>

              {/* Actions */}
              <div style={{ padding: "20px 32px" }}>
                {[
                  { num: "01", action: "Spread income sources", desc: "Reduce reliance on a single source", lift: "+11" },
                  { num: "02", action: "Extend income visibility", desc: "Secure commitments further ahead", lift: "+8" },
                  { num: "03", action: "Introduce recurring income", desc: "Convert one-time work into repeating income", lift: "+5" }
                ].map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "16px 0", borderBottom: i < 2 ? "1px solid #E5E7EB" : "none" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: C.navy, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, fontFamily: mono, color: "#fff", flexShrink: 0 }}>{a.num}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px", gap: "12px" }}>
                        <span style={{ fontSize: "15px", fontWeight: 600, color: C.navy }}>{a.action}</span>
                        <span style={{ fontSize: "16px", fontWeight: 700, fontFamily: mono, color: C.teal, flexShrink: 0 }}>{a.lift}</span>
                      </div>
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
                <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.10em", color: "rgba(244,241,234,0.35)", marginBottom: "12px" }}>IF IMPLEMENTED TOGETHER</div>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "12px" }}>
                  <span style={{ fontSize: "28px", fontWeight: 300, fontFamily: mono, color: "rgba(244,241,234,0.40)" }}>72</span>
                  <span style={{ fontSize: "16px", color: "rgba(244,241,234,0.25)" }}>→</span>
                  <span style={{ fontSize: "44px", fontWeight: 700, fontFamily: mono, color: C.teal }}>96</span>
                </div>
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
                  { scenario: "Largest source removed", severity: "Severe", color: C.risk },
                  { scenario: "Unable to work for 90 days", severity: "Significant", color: C.moderate },
                  { scenario: "Forward commitments delayed", severity: "Moderate", color: C.teal }
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
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "#fff", marginBottom: "6px" }}>Stability type: Uneven</div>
                  <p style={{ fontSize: "13px", color: "rgba(244,241,234,0.55)", lineHeight: 1.6, margin: 0 }}>
                    Some parts of your income are protected. Others depend on a small number of sources.
                  </p>
                </div>
                <div style={{ padding: "14px 16px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.10em", color: C.risk, marginBottom: "4px" }}>KEY VULNERABILITY</div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>Loss of a primary income source</div>
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
              margin: "0"
            }}>
              Four-page professional report with complete breakdown and action plan
            </p>
          </div>

          {/* PAGE 1 MOBILE */}
          <div style={{ marginBottom: "32px" }}>
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
                <span style={{ fontWeight: 600, fontFamily: mono, color: C.textMuted }}>RP-7X2K</span>
              </div>
              <div style={{
                backgroundColor: C.navy,
                padding: "28px 16px",
                position: "relative",
                textAlign: "center"
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, ${C.teal}, #4B3FAE)` }} />
                <div style={{ width: "100px", height: "100px", margin: "0 auto 16px", position: "relative" }}>
                  <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                    <circle cx="50" cy="50" r="44" fill="none" stroke={C.teal} strokeWidth="6"
                      strokeDasharray={2 * Math.PI * 44}
                      strokeDashoffset={2 * Math.PI * 44 * (1 - 0.72)}
                      strokeLinecap="round" />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "32px", fontWeight: 300, fontFamily: mono, color: "#fff" }}>72</span>
                    <span style={{ fontSize: "10px", color: "rgba(244,241,234,0.40)" }}>/100</span>
                  </div>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 10px", borderRadius: "100px", backgroundColor: `${C.teal}18`, marginBottom: "12px" }}>
                  <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: C.teal }} />
                  <span style={{ fontSize: "11px", fontWeight: 600, color: C.teal }}>Established</span>
                </div>
              </div>
            </div>
          </div>

          {/* PAGE 2 MOBILE */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{
              backgroundColor: C.white,
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(14,26,43,0.08)"
            }}>
              <div style={{
                backgroundColor: C.navy,
                padding: "20px 16px"
              }}>
                <div style={{ fontSize: "16px", fontWeight: 600, color: "#fff", marginBottom: "8px" }}>Key Findings</div>
                <p style={{ fontSize: "12px", color: "rgba(244,241,234,0.80)", margin: 0 }}>Your income is stable—but one source carries most risk.</p>
              </div>
              <div style={{ padding: "16px" }}>
                <div style={{ display: "flex", height: "8px", borderRadius: "999px", overflow: "hidden", marginBottom: "12px" }}>
                  <div style={{ width: "55%", backgroundColor: C.risk }} />
                  <div style={{ width: "20%", backgroundColor: C.moderate }} />
                  <div style={{ width: "25%", backgroundColor: C.teal }} />
                </div>
                <div style={{ fontSize: "11px", color: C.textSecondary, lineHeight: 1.5 }}>
                  <strong style={{ color: C.navy }}>Strongest:</strong> Income steady month to month<br />
                  <strong style={{ color: C.navy }}>Constraint:</strong> Reliance on single source
                </div>
              </div>
            </div>
          </div>

          {/* PAGE 3 MOBILE */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{
              backgroundColor: C.white,
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(14,26,43,0.08)"
            }}>
              <div style={{
                backgroundColor: C.navy,
                padding: "20px 16px"
              }}>
                <div style={{ fontSize: "16px", fontWeight: 600, color: "#fff", marginBottom: "2px" }}>What Moves Your Score</div>
              </div>
              <div style={{ padding: "16px" }}>
                {[
                  { num: "01", action: "Spread sources", lift: "+11" },
                  { num: "02", action: "Extend visibility", lift: "+8" },
                  { num: "03", action: "Add recurring", lift: "+5" }
                ].map((a, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? "1px solid #E5E7EB" : "none" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: C.navy }}>{a.action}</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, fontFamily: mono, color: C.teal }}>{a.lift}</span>
                  </div>
                ))}
              </div>
              <div style={{
                backgroundColor: C.navy,
                padding: "12px 16px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "10px", color: "rgba(244,241,234,0.35)", marginBottom: "6px" }}>ALL TOGETHER</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span style={{ fontSize: "18px", fontFamily: mono, color: "rgba(244,241,234,0.40)" }}>72</span>
                  <span style={{ fontSize: "12px", color: "rgba(244,241,234,0.25)" }}>→</span>
                  <span style={{ fontSize: "24px", fontWeight: 700, fontFamily: mono, color: C.teal }}>96</span>
                </div>
              </div>
            </div>
          </div>

          {/* PAGE 4 MOBILE */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{
              backgroundColor: C.white,
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(14,26,43,0.08)"
            }}>
              <div style={{
                backgroundColor: C.navy,
                padding: "20px 16px"
              }}>
                <div style={{ fontSize: "16px", fontWeight: 600, color: "#fff" }}>Stress Testing</div>
              </div>
              <div style={{ padding: "16px" }}>
                {[
                  { scenario: "Largest removed", severity: "Severe", color: C.risk },
                  { scenario: "90 days unable", severity: "Significant", color: C.moderate },
                  { scenario: "Commitments delayed", severity: "Moderate", color: C.teal }
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? "1px solid #E5E7EB" : "none" }}>
                    <span style={{ fontSize: "12px", color: C.navy }}>{s.scenario}</span>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: s.color }}>{s.severity}</span>
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
