"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBadges, recordVisit, checkActionProgress, getStreaks, earnBadge, getEarnedCount, type Badge } from "@/lib/gamification";
import SuiteHeader from "@/components/SuiteHeader";
import SuiteCTA from "@/components/SuiteCTA";

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */
const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F7F6F3",
  bone: "#F8F6F1",
  white: "#FFFFFF",
  stone: "rgba(14,26,43,0.12)",
  taupe: "rgba(14,26,43,0.42)",
  muted: "rgba(14,26,43,0.58)",
  bandLimited: "#9B2C2C",
  bandDeveloping: "#92640A",
  bandEstablished: "#2B5EA7",
  bandHigh: "#1F6D7A",
};

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const DISPLAY = "'DM Serif Display', Georgia, serif";

interface AssessmentSummary {
  record_id: string;
  authorization_code?: string;
  model_version?: string;
  final_score: number;
  stability_band: string;
  assessment_date_utc: string;
  issued_timestamp_utc?: string;
}

interface ActionItem {
  id: string;
  label: string;
  description: string;
  impact: string;
  completed: boolean;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function bandColor(band: string): string {
  if (band.includes("High")) return B.bandHigh;
  if (band.includes("Established")) return B.bandEstablished;
  if (band.includes("Developing")) return B.bandDeveloping;
  return B.bandLimited;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return dateStr; }
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */
export default function DashboardPage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [currentRecord, setCurrentRecord] = useState<Record<string, unknown> | null>(null);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [mobile, setMobile] = useState(false);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);
  const [streakData, setStreakData] = useState<{ currentStreak: number; totalVisits: number }>({ currentStreak: 0, totalVisits: 0 });

  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    // Load assessment history from localStorage
    try {
      const records = JSON.parse(localStorage.getItem("rp_records") || "[]") as AssessmentSummary[];
      setAssessments(records.sort((a, b) => new Date(b.assessment_date_utc || b.issued_timestamp_utc || "").getTime() - new Date(a.assessment_date_utc || a.issued_timestamp_utc || "").getTime()));
    } catch { /* ignore */ }

    // Load current record for action plan
    let stored = sessionStorage.getItem("rp_record");
    if (!stored) stored = localStorage.getItem("rp_record");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCurrentRecord(parsed);

        // Build action items from v2 recommended_actions
        const v2 = parsed._v2 as Record<string, unknown> | undefined;
        const recommended = v2?.recommended_actions as Array<{ action_id: string; label: string; description: string; expected_impact: string }> | undefined;
        const savedActions = JSON.parse(localStorage.getItem("rp_action_progress") || "[]") as string[];

        if (recommended && recommended.length > 0) {
          setActions(recommended.slice(0, 5).map(a => ({
            id: a.action_id,
            label: a.label,
            description: a.description,
            impact: a.expected_impact,
            completed: savedActions.includes(a.action_id),
          })));
        } else {
          // Fallback actions based on constraints
          const constraints = v2?.constraints as { root_constraint: string } | undefined;
          const root = constraints?.root_constraint || "weak_forward_visibility";
          const fallbackActions: ActionItem[] = [
            { id: "fa-1", label: root === "high_concentration" ? "Add a new income source" : root === "high_labor_dependence" ? "Create a passive income stream" : "Lock in a retainer or recurring agreement", description: "Take the single highest-impact action for your structure.", impact: "High", completed: savedActions.includes("fa-1") },
            { id: "fa-2", label: "Reduce largest source dependency", description: "Ensure no single client represents more than 40% of your income.", impact: "Medium", completed: savedActions.includes("fa-2") },
            { id: "fa-3", label: "Secure forward commitments", description: "Get at least one client to commit to 3+ months of work.", impact: "Medium", completed: savedActions.includes("fa-3") },
          ];
          setActions(fallbackActions);
        }
      } catch { /* ignore */ }
    }

    // Initialize gamification
    setBadges(getBadges());
    setStreakData(getStreaks());

    // Record visit and check for new streak badges
    const visitBadges = recordVisit();
    // Earn first_report badge if we have any assessments
    const firstReport = earnBadge("first_report");

    const allNew = [...visitBadges];
    if (firstReport) allNew.push(firstReport);

    if (allNew.length > 0) {
      setNewBadge(allNew[0]);
      setBadges(getBadges());
      setStreakData(getStreaks());
      setTimeout(() => setNewBadge(null), 4000);
    }
  }, []);

  const toggleAction = (actionId: string) => {
    setActions(prev => {
      const updated = prev.map(a => a.id === actionId ? { ...a, completed: !a.completed } : a);
      const completedIds = updated.filter(a => a.completed).map(a => a.id);
      localStorage.setItem("rp_action_progress", JSON.stringify(completedIds));

      // Check for action badges
      const newBadges = checkActionProgress(completedIds.length, updated.length);
      if (newBadges.length > 0) {
        setNewBadge(newBadges[0]);
        setBadges(getBadges());
        setTimeout(() => setNewBadge(null), 4000);
      }

      return updated;
    });
  };

  // ── Derived values ──
  const latestScore = assessments.length > 0 ? assessments[0].final_score : (currentRecord?.final_score as number) || 0;
  const latestBand = assessments.length > 0 ? assessments[0].stability_band : (currentRecord?.stability_band as string) || "Limited Stability";
  const nextBandThreshold = latestScore < 30 ? 30 : latestScore < 50 ? 50 : latestScore < 75 ? 75 : 100;
  const nextBandLabel = latestScore < 30 ? "Developing" : latestScore < 50 ? "Established" : latestScore < 75 ? "High" : "Maximum";
  const gap = nextBandThreshold - latestScore;
  const progress = Math.min(100, (latestScore / nextBandThreshold) * 100);
  const completedActions = actions.filter(a => a.completed).length;
  const totalActions = actions.length;
  const actionProgress = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

  // Score history for mini chart
  const scoreHistory = assessments.length > 1
    ? assessments.slice().reverse().map(a => a.final_score)
    : [latestScore];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: B.sand, fontFamily: INTER }}>
      {/* ── Badge celebration toast ── */}
      {newBadge && (
        <div style={{
          position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)", zIndex: 100,
          padding: "14px 24px", borderRadius: 12, display: "flex", alignItems: "center", gap: 12,
          background: "linear-gradient(135deg, rgba(75,63,174,0.95) 0%, rgba(31,109,122,0.90) 100%)",
          color: "#FFFFFF", boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          animation: "badgeSlideIn 300ms ease-out", fontFamily: INTER,
        }}>
          <span style={{ fontSize: 28 }}>{newBadge.icon}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Badge Earned: {newBadge.label}!</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>{newBadge.description}</div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes badgeSlideIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
      `}</style>

      <SuiteHeader current="dashboard" />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: mobile ? "28px 16px 80px" : "48px 28px 80px" }}>

        {/* ══════════ SCORE HERO ══════════ */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 16 }}>RUNPAYWAY&#8482; STABILITY SUITE &mdash; DASHBOARD</div>

          <div style={{ display: "inline-flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
            <span style={{ fontSize: mobile ? 56 : 72, fontWeight: 300, color: B.navy, lineHeight: 1, fontFamily: DISPLAY }}>{latestScore}</span>
            <span style={{ fontSize: 20, fontWeight: 400, color: B.taupe }}>/100</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: bandColor(latestBand) }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: bandColor(latestBand) }}>{latestBand}</span>
          </div>
        </div>

        {/* ══════════ GOAL PROGRESS ══════════ */}
        <div style={{ backgroundColor: B.white, borderRadius: 14, border: "1px solid rgba(14,26,43,0.06)", padding: mobile ? "20px 16px" : "24px 28px", marginBottom: 20, boxShadow: "0 1px 4px rgba(14,26,43,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: B.navy }}>
              {gap > 0 ? `${gap} points to ${nextBandLabel} Stability` : "Highest band achieved!"}
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: bandColor(latestBand), fontFamily: DISPLAY }}>{latestScore}/{nextBandThreshold}</span>
          </div>
          <div style={{ height: 8, backgroundColor: "rgba(14,26,43,0.06)", borderRadius: 4, overflow: "hidden", marginBottom: 10 }}>
            <div style={{
              height: "100%", borderRadius: 4,
              background: `linear-gradient(90deg, ${bandColor(latestBand)}88, ${bandColor(latestBand)})`,
              width: `${progress}%`,
              transition: "width 600ms ease-out",
            }} />
          </div>
          {gap > 0 && gap <= 10 && (
            <p style={{ fontSize: 12, color: B.teal, fontWeight: 600, margin: 0 }}>
              You are close! A single structural change could move you to the next band.
            </p>
          )}
        </div>

        {/* ══════════ TWO-COLUMN: ACTIONS + SCORE HISTORY ══════════ */}
        <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 16, marginBottom: 20 }}>

          {/* Action Tracker */}
          <div style={{ flex: 1, backgroundColor: B.white, borderRadius: 14, border: "1px solid rgba(14,26,43,0.06)", padding: mobile ? "20px 16px" : "24px 28px", boxShadow: "0 1px 4px rgba(14,26,43,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: B.purple }}>ACTION PROGRESS</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: B.teal }}>{completedActions}/{totalActions} done</span>
            </div>

            {/* Progress ring */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
                <svg viewBox="0 0 36 36" style={{ width: 56, height: 56, transform: "rotate(-90deg)" }}>
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(14,26,43,0.06)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke={B.teal} strokeWidth="3" strokeDasharray={`${actionProgress} ${100 - actionProgress}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 400ms ease" }} />
                </svg>
                <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 13, fontWeight: 700, color: B.navy }}>{actionProgress}%</span>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: B.navy, marginBottom: 2 }}>
                  {completedActions === 0 ? "Get started!" : completedActions === totalActions ? "All actions complete!" : "Keep going!"}
                </div>
                <p style={{ fontSize: 12, color: B.muted, margin: 0 }}>
                  {completedActions === 0 ? "Check off actions as you complete them." : `${totalActions - completedActions} action${totalActions - completedActions !== 1 ? "s" : ""} remaining.`}
                </p>
              </div>
            </div>

            {/* Action items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {actions.map((a) => (
                <div
                  key={a.id}
                  onClick={() => toggleAction(a.id)}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px",
                    borderRadius: 8, cursor: "pointer",
                    backgroundColor: a.completed ? "rgba(31,109,122,0.04)" : "rgba(14,26,43,0.02)",
                    border: `1px solid ${a.completed ? "rgba(31,109,122,0.15)" : "rgba(14,26,43,0.06)"}`,
                    transition: "all 200ms",
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: 4, flexShrink: 0, marginTop: 1,
                    border: `2px solid ${a.completed ? B.teal : "rgba(14,26,43,0.20)"}`,
                    backgroundColor: a.completed ? B.teal : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 200ms",
                  }}>
                    {a.completed && <span style={{ color: B.white, fontSize: 12, fontWeight: 700 }}>&#10003;</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: a.completed ? B.teal : B.navy, textDecoration: a.completed ? "line-through" : "none" }}>{a.label}</div>
                    <span style={{ fontSize: 11, color: B.taupe }}>Impact: {a.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Score History */}
          <div style={{ flex: 1, backgroundColor: B.white, borderRadius: 14, border: "1px solid rgba(14,26,43,0.06)", padding: mobile ? "20px 16px" : "24px 28px", boxShadow: "0 1px 4px rgba(14,26,43,0.04)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: B.teal, marginBottom: 16 }}>SCORE HISTORY</div>

            {assessments.length <= 1 ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ fontSize: 40, fontWeight: 300, color: B.navy, fontFamily: DISPLAY, marginBottom: 8 }}>{latestScore}</div>
                <p style={{ fontSize: 13, color: B.muted, margin: "0 0 16px" }}>This is your first assessment. Retake in a few months to track progress.</p>
                <Link href="/diagnostic-portal" style={{ fontSize: 13, fontWeight: 600, color: B.purple, textDecoration: "none" }}>Take New Assessment &rarr;</Link>
              </div>
            ) : (
              <>
                {/* Mini chart */}
                <div style={{ position: "relative", height: 100, marginBottom: 16 }}>
                  <svg viewBox={`0 0 ${(scoreHistory.length - 1) * 100} 100`} style={{ width: "100%", height: "100%" }} preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={B.teal} stopOpacity="0.15" />
                        <stop offset="100%" stopColor={B.teal} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {scoreHistory.length > 1 && (() => {
                      const minS = Math.min(...scoreHistory) - 10;
                      const maxS = Math.max(...scoreHistory) + 10;
                      const range = Math.max(maxS - minS, 20);
                      const points = scoreHistory.map((s, i) => `${i * 100},${100 - ((s - minS) / range) * 100}`).join(" ");
                      const areaPoints = points + ` ${(scoreHistory.length - 1) * 100},100 0,100`;
                      return (
                        <>
                          <polygon points={areaPoints} fill="url(#scoreGrad)" />
                          <polyline points={points} fill="none" stroke={B.teal} strokeWidth="2" strokeLinejoin="round" />
                          {scoreHistory.map((s, i) => (
                            <circle key={i} cx={i * 100} cy={100 - ((s - minS) / range) * 100} r="4" fill={B.teal} stroke={B.white} strokeWidth="2" />
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                </div>

                {/* Assessment list */}
                {assessments.slice(0, 5).map((a, i) => {
                  const prevScore = i < assessments.length - 1 ? assessments[i + 1].final_score : null;
                  const diff = prevScore !== null ? a.final_score - prevScore : null;
                  return (
                    <div key={a.record_id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < assessments.length - 1 ? `1px solid rgba(14,26,43,0.04)` : "none" }}>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: B.navy }}>{formatDate(a.assessment_date_utc || a.issued_timestamp_utc || "")}</span>
                        <span style={{ fontSize: 11, color: B.taupe, marginLeft: 8 }}>{a.stability_band}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: bandColor(a.stability_band), fontFamily: DISPLAY }}>{a.final_score}</span>
                        {diff !== null && diff !== 0 && (
                          <span style={{ fontSize: 11, fontWeight: 600, color: diff > 0 ? B.teal : B.bandLimited }}>{diff > 0 ? `+${diff}` : diff}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* ══════════ BADGES & STREAKS ══════════ */}
        <div style={{ backgroundColor: B.white, borderRadius: 14, border: "1px solid rgba(14,26,43,0.06)", padding: mobile ? "20px 16px" : "24px 28px", marginBottom: 20, boxShadow: "0 1px 4px rgba(14,26,43,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: B.purple }}>ACHIEVEMENTS</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {streakData.currentStreak > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20, backgroundColor: "rgba(220,120,20,0.08)", border: "1px solid rgba(220,120,20,0.15)" }}>
                  <span style={{ fontSize: 12 }}>🔥</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#DC7814" }}>{streakData.currentStreak} day streak</span>
                </div>
              )}
              <span style={{ fontSize: 12, color: B.muted }}>{getEarnedCount().earned}/{getEarnedCount().total} earned</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: mobile ? "repeat(3, 1fr)" : "repeat(6, 1fr)", gap: 8 }}>
            {badges.map((badge) => (
              <div
                key={badge.id}
                title={badge.description}
                style={{
                  textAlign: "center", padding: "12px 8px", borderRadius: 10,
                  backgroundColor: badge.earnedAt ? "rgba(75,63,174,0.04)" : "rgba(14,26,43,0.02)",
                  border: `1px solid ${badge.earnedAt ? "rgba(75,63,174,0.12)" : "rgba(14,26,43,0.04)"}`,
                  opacity: badge.earnedAt ? 1 : 0.4,
                  transition: "all 200ms",
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 4 }}>{badge.icon}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: badge.earnedAt ? B.navy : B.taupe, lineHeight: 1.2 }}>{badge.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════ QUICK LINKS ══════════ */}
        <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 12 }}>
          {[
            { label: "View Full Report", desc: "Your complete Income Stability Report", href: "/review", color: B.navy },
            { label: "PressureMap", desc: "Interactive risk zones and actions", href: "/pressuremap", color: B.purple },
            { label: "Stability Simulator", desc: "Model changes and see score impact", href: "/simulator", color: B.teal },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{
              flex: 1, padding: "16px 20px", borderRadius: 12,
              backgroundColor: B.white, border: "1px solid rgba(14,26,43,0.06)",
              textDecoration: "none", transition: "box-shadow 200ms",
              boxShadow: "0 1px 4px rgba(14,26,43,0.04)",
              display: "block",
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: link.color, marginBottom: 4 }}>{link.label}</div>
              <p style={{ fontSize: 12, color: B.muted, margin: 0 }}>{link.desc}</p>
            </Link>
          ))}
        </div>

        {/* ── CTA ── */}
        <div style={{ marginTop: 32, marginBottom: 24 }}><SuiteCTA page="dashboard" /></div>

        {/* ── Footer ── */}
        <div style={{ paddingTop: 16, borderTop: `1px solid ${B.stone}`, textAlign: "center" }}>
          <p style={{ fontSize: 11, color: B.taupe, margin: 0, fontStyle: "italic" }}>
            RunPayway&#8482; Stability Suite &mdash; A proprietary tool by PeopleStar Enterprises.
          </p>
        </div>
      </div>
    </div>
  );
}
