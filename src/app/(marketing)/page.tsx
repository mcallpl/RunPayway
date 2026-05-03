"use client";

import { useState } from "react";

const C = {
  navy: "#0E1A2B",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  green: "#2E7D32",
  red: "#C62828",
  white: "#FFFFFF",
  divider: "#E6E8EB",
  textPrimary: "#131A22",
  textSecondary: "#5E6873",
  textMuted: "#7B848E",
  borderSoft: "#D9D6CF",
};

const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';

interface PreviewState {
  concentration: "lower" | "moderate" | "strong";
  sources: "lower" | "moderate" | "strong";
  visibility: "lower" | "moderate" | "strong";
  variability: "lower" | "moderate" | "strong";
  continuity: "lower" | "moderate" | "strong";
  dependency: "lower" | "moderate" | "strong";
}

function calculatePreviewScore(state: PreviewState): { score: number; class: string; direction: string } {
  const values = Object.values(state);
  const strongCount = values.filter(v => v === "strong").length;
  const moderateCount = values.filter(v => v === "moderate").length;

  const baseScore = 50 + strongCount * 8 - (6 - strongCount - moderateCount) * 12;
  const score = Math.max(0, Math.min(100, baseScore));

  let classification = "At Risk";
  if (score >= 70) classification = "Established Stability";
  else if (score >= 55) classification = "Developing Stability";

  const direction = strongCount >= 4 ? "Improving" : strongCount <= 2 ? "Declining" : "Stable";

  return { score: Math.round(score), class: classification, direction };
}

function ControlButton({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: C.teal, letterSpacing: "0.08em", marginBottom: 8 }}>
        {label}
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              flex: 1,
              padding: "10px 12px",
              backgroundColor: value === opt ? C.navy : "#F8F6F1",
              color: value === opt ? C.white : C.textPrimary,
              border: `1px solid ${value === opt ? C.navy : C.borderSoft}`,
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 150ms",
            }}
          >
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

function PreviewCard({ state }: { state: PreviewState }) {
  const { score, class: classification, direction } = calculatePreviewScore(state);

  return (
    <div
      style={{
        backgroundColor: C.navy,
        borderRadius: 16,
        padding: "32px 28px",
        color: C.sand,
        boxShadow: "0 12px 32px rgba(14,26,43,0.16)",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 600, color: C.teal, letterSpacing: "0.08em", marginBottom: 20 }}>
        PREVIEW RESULT
      </div>

      <div style={{ fontSize: 56, fontWeight: 700, fontFamily: mono, lineHeight: 1, marginBottom: 12 }}>
        {score}
      </div>

      <div style={{ fontSize: 16, fontWeight: 600, color: C.sand, marginBottom: 20 }}>
        {classification}
      </div>

      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: direction === "Improving" ? C.green : direction === "Declining" ? C.red : C.teal,
          marginBottom: 16,
        }}
      >
        {direction}
      </div>

      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: C.teal,
          marginBottom: 8,
          letterSpacing: "0.08em",
        }}
      >
        PRIMARY STRUCTURAL CONSTRAINT
      </div>
      <div style={{ fontSize: 13, color: "rgba(244,241,234,0.70)", lineHeight: 1.5, marginBottom: 20 }}>
        {state.concentration === "lower" && "Income concentration limits diversification"}
        {state.visibility === "lower" && "Forward visibility creates planning gap"}
        {state.variability === "strong" && "Income consistency supports structure"}
        {state.dependency === "lower" && "Activity independence supports continuity"}
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.10)", paddingTop: 16 }}>
        <p style={{ fontSize: 12, color: "rgba(244,241,234,0.40)", margin: 0, lineHeight: 1.5 }}>
          Preview only. Verified results are calculated inside the locked RunPayway™ model.
        </p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [previewState, setPreviewState] = useState<PreviewState>({
    concentration: "moderate",
    sources: "moderate",
    visibility: "moderate",
    variability: "moderate",
    continuity: "moderate",
    dependency: "moderate",
  });

  const handlePreviewChange = (key: keyof PreviewState, value: string) => {
    setPreviewState((prev) => ({ ...prev, [key]: value as any }));
  };

  return (
    <div style={{ backgroundColor: C.white }}>
      {/* SECTION 1: HERO */}
      <section style={{ padding: "96px 40px", backgroundColor: C.white }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "24px", alignItems: "center" }}>
            {/* Left column (1-7) */}
            <div style={{ gridColumn: "span 7" }}>
              <h1
                style={{
                  fontSize: 56,
                  fontWeight: 600,
                  lineHeight: 1.1,
                  letterSpacing: "-0.04em",
                  color: C.navy,
                  marginBottom: 40,
                }}
              >
                Income structure determines whether decisions survive.
              </h1>

              <p
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: C.textSecondary,
                  lineHeight: 1.6,
                  marginBottom: 24,
                }}
              >
                Applied before financial commitment, where income stability must hold.
              </p>

              <p
                style={{
                  fontSize: 15,
                  color: C.textMuted,
                  lineHeight: 1.6,
                  marginBottom: 40,
                }}
              >
                If income structure fails, the decision fails.
              </p>

              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "16px 32px",
                  backgroundColor: C.navy,
                  color: C.white,
                  border: "none",
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Start Verification
                <span style={{ fontSize: 14 }}>→</span>
              </button>

              <p style={{ fontSize: 13, color: C.textMuted, marginTop: 16, letterSpacing: "0.05em" }}>
                Takes less than a minute · No documents required · Private
              </p>
            </div>

            {/* Right column (8-12) - Score Card */}
            <div style={{ gridColumn: "span 5" }}>
              <div
                style={{
                  backgroundColor: C.navy,
                  borderRadius: 20,
                  padding: "40px 32px",
                  color: C.sand,
                  boxShadow: "0 12px 32px rgba(14,26,43,0.16)",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: C.teal, letterSpacing: "0.08em", marginBottom: 24 }}>
                  INCOME STABILITY SCORE™
                </div>

                <div style={{ fontSize: 64, fontWeight: 700, fontFamily: mono, lineHeight: 1, marginBottom: 8 }}>
                  72
                </div>

                <div style={{ fontSize: 16, fontWeight: 600, color: C.sand, marginBottom: 24 }}>/ 100</div>

                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: C.teal,
                    display: "inline-block",
                    padding: "8px 16px",
                    backgroundColor: "rgba(31,109,122,0.15)",
                    borderRadius: 10,
                    marginBottom: 24,
                  }}
                >
                  Established Stability
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 24,
                    height: 10,
                    borderRadius: "999px",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ flex: "0.40", backgroundColor: C.teal }} />
                  <div style={{ flex: "0.35", backgroundColor: "#D0A23A" }} />
                  <div style={{ flex: "0.25", backgroundColor: C.red }} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 24 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.teal }}>Protected</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#D0A23A" }}>Recurring</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.red }}>At Risk</span>
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.10)", paddingTop: 16 }}>
                  <p style={{ fontSize: 13, color: "rgba(244,241,234,0.40)", margin: 0, lineHeight: 1.5 }}>
                    Model RP-2.0 · Same inputs produce same result
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CONSEQUENCE */}
      <section style={{ padding: "96px 40px", backgroundColor: "#F8F6F1" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 40,
              fontWeight: 600,
              color: C.navy,
              marginBottom: 40,
              letterSpacing: "-0.03em",
            }}
          >
            Decisions made without structural verification fail under stress.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
            {[
              "You are approved → then denied during final underwriting",
              "Income appears strong → but fails under disruption",
              "You commit → then discover instability too late",
            ].map((text, i) => (
              <div key={i} style={{ padding: 24, backgroundColor: C.white, borderRadius: 12, border: `1px solid ${C.borderSoft}`, boxShadow: "0 4px 16px rgba(14,26,43,0.08)" }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: C.navy, lineHeight: 1.6, margin: 0 }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: INPUT DEFINITIONS */}
      <section style={{ padding: "96px 40px", backgroundColor: C.white }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 40,
              fontWeight: 600,
              color: C.navy,
              marginBottom: 16,
              letterSpacing: "-0.03em",
            }}
          >
            Six structural inputs
          </h2>

          <p
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: C.navy,
              marginBottom: 48,
              lineHeight: 1.6,
            }}
          >
            Income classification is determined by these 6 factors.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40, marginBottom: 40 }}>
            {[
              {
                num: "1",
                name: "Concentration",
                desc: "Reliance on primary income. Diversification reduces risk.",
              },
              {
                num: "2",
                name: "Source Diversity",
                desc: "Distribution across sources. Multiple channels improve stability.",
              },
              {
                num: "3",
                name: "Forward Visibility",
                desc: "Income already secured. Certainty over planning horizon.",
              },
              {
                num: "4",
                name: "Stability Pattern",
                desc: "Consistency over time. Variability introduces structural risk.",
              },
              {
                num: "5",
                name: "Continuity",
                desc: "Income without activity. Passive revenue improves structure.",
              },
              {
                num: "6",
                name: "Dependency",
                desc: "Reliance on effort. Lower dependency improves resilience.",
              },
            ].map((input, i) => (
              <div
                key={i}
                style={{
                  padding: 24,
                  backgroundColor: "#F8F6F1",
                  borderRadius: 12,
                  border: `1px solid ${C.borderSoft}`,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: C.teal,
                    letterSpacing: "0.08em",
                    marginBottom: 12,
                  }}
                >
                  INPUT {input.num}
                </div>
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: C.navy,
                    marginBottom: 12,
                    margin: 0,
                  }}
                >
                  {input.name}
                </p>
                <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>
                  {input.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: C.navy, borderRadius: 12, padding: 24 }}>
            <p style={{ fontSize: 13, color: C.sand, margin: 0, lineHeight: 1.6 }}>
              Model RP-2.0 · Fixed rules · Same inputs produce same result
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: LIVE PREVIEW */}
      <section style={{ padding: "96px 40px", backgroundColor: "#F8F6F1" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 40,
              fontWeight: 600,
              color: C.navy,
              marginBottom: 16,
              letterSpacing: "-0.03em",
            }}
          >
            See how structure affects stability.
          </h2>

          <p
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: C.textSecondary,
              marginBottom: 48,
              lineHeight: 1.6,
            }}
          >
            Adjust the profile below. This preview shows directional movement only.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "flex-start" }}>
            {/* Controls */}
            <div style={{ backgroundColor: C.white, borderRadius: 12, padding: 32, border: `1px solid ${C.borderSoft}` }}>
              <ControlButton
                label="CONCENTRATION"
                value={previewState.concentration}
                options={["lower", "moderate", "strong"]}
                onChange={(v) => handlePreviewChange("concentration", v)}
              />
              <ControlButton
                label="SOURCES"
                value={previewState.sources}
                options={["lower", "moderate", "strong"]}
                onChange={(v) => handlePreviewChange("sources", v)}
              />
              <ControlButton
                label="FORWARD VISIBILITY"
                value={previewState.visibility}
                options={["lower", "moderate", "strong"]}
                onChange={(v) => handlePreviewChange("visibility", v)}
              />
              <ControlButton
                label="STABILITY PATTERN"
                value={previewState.variability}
                options={["lower", "moderate", "strong"]}
                onChange={(v) => handlePreviewChange("variability", v)}
              />
              <ControlButton
                label="CONTINUITY"
                value={previewState.continuity}
                options={["lower", "moderate", "strong"]}
                onChange={(v) => handlePreviewChange("continuity", v)}
              />
              <ControlButton
                label="ACTIVITY DEPENDENCY"
                value={previewState.dependency}
                options={["lower", "moderate", "strong"]}
                onChange={(v) => handlePreviewChange("dependency", v)}
              />
            </div>

            {/* Preview Output */}
            <PreviewCard state={previewState} />
          </div>

          <div style={{ marginTop: 40, textAlign: "center" }}>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "16px 32px",
                backgroundColor: C.navy,
                color: C.white,
                border: "none",
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Generate My Verified Result
            </button>
            <p style={{ fontSize: 13, color: C.textMuted, marginTop: 16, letterSpacing: "0.05em" }}>
              Preview updates instantly. Verified results are timestamped and record-locked.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: STRUCTURAL PROOF */}
      <section style={{ padding: "96px 40px", backgroundColor: C.white }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 40,
              fontWeight: 600,
              color: C.navy,
              marginBottom: 48,
              letterSpacing: "-0.03em",
            }}
          >
            Structure determines outcome
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
            <div
              style={{
                backgroundColor: "#F8F6F1",
                borderRadius: 20,
                padding: "40px 32px",
                border: `1px solid ${C.borderSoft}`,
                boxShadow: "0 12px 32px rgba(14,26,43,0.16)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 64, fontWeight: 700, fontFamily: mono, lineHeight: 1, marginBottom: 12, color: C.red }}>
                31
              </div>
              <div style={{ fontSize: 20, fontWeight: 600, color: C.red, marginBottom: 16 }}>
                Limited Stability
              </div>
              <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>
                One income source
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#F8F6F1",
                borderRadius: 20,
                padding: "40px 32px",
                border: `1px solid ${C.borderSoft}`,
                boxShadow: "0 12px 32px rgba(14,26,43,0.16)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 64, fontWeight: 700, fontFamily: mono, lineHeight: 1, marginBottom: 12, color: C.green }}>
                74
              </div>
              <div style={{ fontSize: 20, fontWeight: 600, color: C.green, marginBottom: 16 }}>
                Established Stability
              </div>
              <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>
                Multiple income sources
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: TRIGGER STRIP */}
      <section style={{ padding: "96px 40px", backgroundColor: C.navy, textAlign: "center", color: C.sand }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 24,
              fontWeight: 600,
              lineHeight: 1.5,
              marginBottom: 16,
            }}
          >
            Most users discover a structural weakness they didn't know existed.
          </p>
          <p
            style={{
              fontSize: 18,
              fontWeight: 400,
              lineHeight: 1.6,
              color: "rgba(244,241,234,0.70)",
            }}
          >
            Verification reveals the constraint before the decision is made.
          </p>
        </div>
      </section>

      {/* SECTION 7: PRICING */}
      <section style={{ padding: "96px 40px", backgroundColor: C.white }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
            {/* FREE */}
            <div
              style={{
                padding: 40,
                backgroundColor: "#F8F6F1",
                borderRadius: 12,
                border: `1px solid ${C.borderSoft}`,
              }}
            >
              <p style={{ fontSize: 12, fontWeight: 600, color: C.teal, letterSpacing: "0.08em", marginBottom: 16 }}>
                FREE
              </p>
              <ul style={{ fontSize: 15, color: C.textSecondary, lineHeight: 2, margin: "0 0 24px 20px", padding: 0 }}>
                <li>Stability classification</li>
                <li>Primary constraint</li>
              </ul>
              <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 0, fontStyle: "italic" }}>
                Not sufficient for full decision verification
              </p>
            </div>

            {/* $69 */}
            <div
              style={{
                padding: 40,
                backgroundColor: C.white,
                borderRadius: 12,
                border: `2px solid ${C.teal}`,
                boxShadow: "0 12px 32px rgba(14,26,43,0.16)",
              }}
            >
              <p style={{ fontSize: 12, fontWeight: 600, color: C.teal, letterSpacing: "0.08em", marginBottom: 16 }}>
                $69 — FULL VERIFICATION
              </p>
              <ul style={{ fontSize: 15, color: C.textSecondary, lineHeight: 2, margin: "0 0 24px 20px", padding: 0 }}>
                <li>Income Stability Score™ (exact value)</li>
                <li>Full structural breakdown</li>
                <li>Decision alignment (PASS / FAIL)</li>
                <li>Permanent Record ID</li>
                <li>Timestamped output</li>
                <li>Complete report</li>
              </ul>
              <button
                style={{
                  width: "100%",
                  padding: "16px 32px",
                  backgroundColor: C.navy,
                  color: C.white,
                  border: "none",
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  marginBottom: 24,
                }}
              >
                Complete Verification
              </button>

              {/* Proof Panel */}
              <div
                style={{
                  padding: 20,
                  backgroundColor: "#F8F6F1",
                  borderRadius: 8,
                  border: `1px solid ${C.borderSoft}`,
                }}
              >
                <p style={{ fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 8 }}>
                  Record ID: RP-2026-004921
                </p>
                <p style={{ fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 8 }}>
                  Timestamp: 2026-05-03 21:04 UTC
                </p>
                <p style={{ fontSize: 12, fontWeight: 600, color: C.green }}>
                  Decision: Mortgage → Supported
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: C.navy,
              borderRadius: 12,
              padding: 24,
              marginTop: 48,
              textAlign: "center",
              color: C.sand,
            }}
          >
            <p style={{ fontSize: 13, color: C.sand, margin: 0, lineHeight: 1.6 }}>
              Applied before financial commitment, where income stability must hold.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 8: SYSTEM INTEGRITY */}
      <section style={{ padding: "96px 40px", backgroundColor: "#F8F6F1" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: C.navy, marginBottom: 24 }}>
                Fixed rules applied
              </h3>
              <ul style={{ fontSize: 15, color: C.textSecondary, lineHeight: 2, margin: 0, padding: "0 0 0 20px" }}>
                <li>No discretion</li>
                <li>Same inputs produce same result</li>
                <li>Rules apply uniformly</li>
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: C.navy, marginBottom: 24 }}>
                Permanence & Auditability
              </h3>
              <ul style={{ fontSize: 15, color: C.textSecondary, lineHeight: 2, margin: 0, padding: "0 0 0 20px" }}>
                <li>Timestamped result</li>
                <li>Permanent record ID</li>
                <li>Results are not modified</li>
              </ul>
            </div>
          </div>

          <div
            style={{
              backgroundColor: C.navy,
              borderRadius: 12,
              padding: 24,
              marginTop: 48,
              textAlign: "center",
              color: C.sand,
            }}
          >
            <p style={{ fontSize: 13, color: C.sand, margin: 0 }}>
              Model RP-2.0 · Version locked
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 9: FINAL CTA */}
      <section style={{ padding: "96px 40px", backgroundColor: C.navy, textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 40,
              fontWeight: 600,
              color: C.sand,
              marginBottom: 24,
              letterSpacing: "-0.03em",
            }}
          >
            Verify your income structure before you commit.
          </h2>
          <p
            style={{
              fontSize: 18,
              fontWeight: 400,
              color: "rgba(244,241,234,0.70)",
              lineHeight: 1.6,
              marginBottom: 40,
            }}
          >
            Once the decision is made, it's too late to fix the structure.
          </p>

          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "16px 32px",
              backgroundColor: C.teal,
              color: C.navy,
              border: "none",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Start Verification
            <span style={{ fontSize: 14 }}>→</span>
          </button>

          <p style={{ fontSize: 13, color: "rgba(244,241,234,0.60)", marginTop: 16, letterSpacing: "0.05em" }}>
            Free · Private · Immediate result
          </p>
        </div>
      </section>
    </div>
  );
}
