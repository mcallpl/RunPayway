"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getEarnedCount, getStreaks } from "@/lib/gamification";

/* ================================================================== */
/* DESIGN TOKENS                                                       */
/* ================================================================== */

const C = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  sandBg: "#F7F6F3",
  white: "#FFFFFF",
  muted: "rgba(14,26,43,0.55)",
  light: "rgba(14,26,43,0.38)",
  border: "rgba(14,26,43,0.08)",
  heroGradient: "linear-gradient(145deg, #0E1A2B 0%, #161430 35%, #3D2F9C 65%, #1F6D7A 100%)",
};

const sp = (n: number) => n * 8;

const T = {
  h1: { desktop: { fontSize: 44, fontWeight: 600, lineHeight: 1.08 }, mobile: { fontSize: 28, fontWeight: 600, lineHeight: 1.12 } },
  h2: { desktop: { fontSize: 24, fontWeight: 600, lineHeight: 1.2 }, mobile: { fontSize: 20, fontWeight: 600, lineHeight: 1.2 } },
  bodyLg: { desktop: { fontSize: 18, fontWeight: 400, lineHeight: 1.55 }, mobile: { fontSize: 16, fontWeight: 400, lineHeight: 1.55 } },
  body: { desktop: { fontSize: 16, fontWeight: 400, lineHeight: 1.65 }, mobile: { fontSize: 15, fontWeight: 400, lineHeight: 1.6 } },
  label: { fontSize: 11, fontWeight: 700, lineHeight: 1.3, letterSpacing: "0.12em" },
  meta: { fontSize: 13, fontWeight: 500, lineHeight: 1.4 },
  cta: { fontSize: 15, fontWeight: 600 },
};

const maxW = 1200;
const readW = 740;
const px = (m: boolean) => m ? 20 : 40;
const h1 = (m: boolean) => m ? T.h1.mobile : T.h1.desktop;
const h2 = (m: boolean) => m ? T.h2.mobile : T.h2.desktop;
const bodyLg = (m: boolean) => m ? T.bodyLg.mobile : T.bodyLg.desktop;
const body = (m: boolean) => m ? T.body.mobile : T.body.desktop;

/* ================================================================== */
/* TOOL CARD                                                           */
/* ================================================================== */

function ToolCard({ href, color, number, title, subtitle, features, cta, recommended, mobile }: {
  href: string; color: string; number: string; title: string; subtitle: string;
  features: string[]; cta: string; recommended?: boolean; mobile: boolean;
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => router.push(href)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1, minWidth: mobile ? "100%" : 280,
        backgroundColor: C.white,
        borderRadius: 16,
        border: `1px solid ${hovered ? color + "44" : C.border}`,
        padding: mobile ? "28px 20px" : "32px 28px",
        cursor: "pointer",
        transition: "all 300ms ease",
        boxShadow: hovered ? `0 12px 40px ${color}12` : "0 1px 3px rgba(14,26,43,0.04)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column" as const,
      }}
    >
      {recommended && (
        <div style={{
          position: "absolute", top: 16, right: 16,
          ...T.label, fontSize: 9, textTransform: "uppercase" as const,
          color: C.white, backgroundColor: color,
          padding: "4px 12px", borderRadius: 20,
        }}>
          START HERE
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: sp(3) }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: `linear-gradient(135deg, ${color}12 0%, ${color}06 100%)`,
          border: `1px solid ${color}18`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 18, fontWeight: 700, color, letterSpacing: "-0.02em" }}>{number}</span>
        </div>
        <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${color}18 0%, transparent 100%)` }} />
      </div>

      <div style={{ ...h2(mobile), color: C.navy, marginBottom: sp(1) }}>{title}</div>
      <p style={{ ...body(mobile), color: C.muted, margin: `0 0 ${sp(2.5)}px`, flex: 1 }}>{subtitle}</p>

      <div style={{ display: "flex", flexDirection: "column" as const, gap: sp(1), marginBottom: sp(3) }}>
        {features.map((f) => (
          <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: color, flexShrink: 0, marginTop: 7 }} />
            <span style={{ ...T.meta, color: C.navy }}>{f}</span>
          </div>
        ))}
      </div>

      <div style={{
        padding: "12px 20px", borderRadius: 10, textAlign: "center" as const,
        backgroundColor: hovered ? color : `${color}08`,
        color: hovered ? C.white : color,
        ...T.cta, letterSpacing: "-0.01em",
        transition: "all 300ms ease",
        border: `1px solid ${color}18`,
      }}>
        {cta}
      </div>
    </div>
  );
}

/* ================================================================== */
/* MAIN PAGE                                                           */
/* ================================================================== */

export default function ToolsHubPage() {
  const [score, setScore] = useState<number | null>(null);
  const [band, setBand] = useState("");
  const [userName, setUserName] = useState("");
  const [mobile, setMobile] = useState(false);
  const [badgeCount, setBadgeCount] = useState({ earned: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const [accessCode, setAccessCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [codeSuccess, setCodeSuccess] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    let stored = sessionStorage.getItem("rp_record");
    if (!stored) stored = localStorage.getItem("rp_record");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setScore(parsed.final_score ?? null);
        setBand(parsed.stability_band ?? "");
        setUserName(parsed.assessment_title ?? "");
        setCodeSuccess(true);
      } catch { /* ignore */ }
    }
    setBadgeCount(getEarnedCount());
    setStreak(getStreaks().currentStreak);
  }, []);

  const handleCodeSubmit = () => {
    setCodeError(null);
    const trimmed = accessCode.trim();
    if (!trimmed) { setCodeError("Paste the Access Code from your report cover page."); return; }
    try {
      const decoded = JSON.parse(atob(trimmed));
      if (typeof decoded.p !== "number" || typeof decoded.c !== "number" || typeof decoded.l !== "number") {
        setCodeError("Invalid code. Copy the full Access Code from your report.");
        return;
      }
      const record = {
        record_id: `sim-${Date.now()}`,
        authorization_code: "",
        model_version: "RP-2.0",
        assessment_date_utc: new Date().toISOString(),
        issued_timestamp_utc: new Date().toISOString(),
        final_score: 0,
        stability_band: "",
        assessment_title: decoded.n || "",
        classification: "",
        operating_structure: "",
        primary_income_model: decoded.m || "",
        industry_sector: decoded.i || "",
        _v2: {
          normalized_inputs: {
            income_persistence_pct: decoded.p,
            largest_source_pct: decoded.c,
            source_diversity_count: decoded.s,
            forward_secured_pct: decoded.f,
            income_variability_level: decoded.v || "moderate",
            labor_dependence_pct: decoded.l,
          },
          quality: { quality_score: decoded.q || 5 },
        },
      };
      sessionStorage.setItem("rp_record", JSON.stringify(record));
      sessionStorage.setItem("rp_sim_code", trimmed);
      setUserName(decoded.n || "");
      setCodeSuccess(true);
      setScore(null);
    } catch {
      setCodeError("Invalid code. Make sure you copied the entire Access Code.");
    }
  };

  const hasData = codeSuccess;

  return (
    <>
      {/* ══════════ HERO SECTION ══════════ */}
      <div style={{ background: C.heroGradient, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", pointerEvents: "none" }} />

        <div style={{ maxWidth: maxW, margin: "0 auto", padding: `${sp(8)}px ${px(mobile)}px ${sp(10)}px`, textAlign: "center", position: "relative", zIndex: 2 }}>
          <div style={{ ...T.label, color: C.teal, textTransform: "uppercase" as const, marginBottom: sp(2.5) }}>RUNPAYWAY&#8482; STABILITY SUITE</div>
          <h1 style={{ ...h1(mobile), color: C.sand, marginBottom: sp(2), letterSpacing: "-0.03em" }}>
            Your Premium Financial Tools
          </h1>
          <p style={{ ...bodyLg(mobile), color: "rgba(244,241,234,0.55)", maxWidth: 540, margin: `0 auto ${sp(4)}px`, letterSpacing: "-0.01em" }}>
            {hasData
              ? `${userName ? `${userName}, your` : "Your"} tools are loaded and ready. Explore your risks, model improvements, and track progress.`
              : "Three premium tools that turn your Income Stability Report into a living action plan. Enter your access code to load your personalized data."}
          </p>

          {/* ── ACCESS CODE INPUT ── */}
          {!hasData && (
            <div style={{ maxWidth: 480, margin: `0 auto ${sp(3)}px`, textAlign: "left" }}>
              <div style={{ backgroundColor: "rgba(244,241,234,0.06)", border: "1px solid rgba(244,241,234,0.12)", borderRadius: 14, padding: mobile ? "20px 16px" : "24px 28px", backdropFilter: "blur(8px)" }}>
                <div style={{ ...T.label, color: C.teal, textTransform: "uppercase" as const, marginBottom: sp(1.5) }}>ENTER YOUR ACCESS CODE</div>
                <p style={{ fontSize: 13, color: "rgba(244,241,234,0.45)", margin: `0 0 ${sp(2)}px`, lineHeight: 1.5 }}>
                  Your Access Code is on the cover page of your report. It loads all three tools with your data.
                </p>
                <textarea
                  value={accessCode}
                  onChange={(e) => { setAccessCode(e.target.value); setCodeError(null); }}
                  placeholder="Paste your access code here"
                  spellCheck={false}
                  autoComplete="off"
                  rows={3}
                  style={{
                    width: "100%", padding: "12px 14px", fontSize: 12, fontFamily: "monospace",
                    color: "#F4F1EA", backgroundColor: "rgba(244,241,234,0.04)",
                    border: "1px solid rgba(244,241,234,0.10)", borderRadius: 8,
                    outline: "none", boxSizing: "border-box" as const, resize: "none" as const, lineHeight: 1.4,
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = C.purple; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(244,241,234,0.10)"; }}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleCodeSubmit(); } }}
                />
                {codeError && <div style={{ fontSize: 13, color: "#DC4A4A", marginTop: 8 }}>{codeError}</div>}
                <button
                  onClick={handleCodeSubmit}
                  style={{
                    marginTop: sp(1.5), width: "100%", height: 48, borderRadius: 10,
                    background: `linear-gradient(135deg, ${C.teal} 0%, ${C.purple} 100%)`,
                    color: C.white, ...T.cta, border: "none", cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(26,122,109,0.25)",
                  }}
                >
                  Load My Data
                </button>
              </div>
              <p style={{ fontSize: 12, color: "rgba(244,241,234,0.30)", marginTop: sp(1.5), textAlign: "center" }}>
                No code yet? You can still explore the tools below &mdash; they will show empty until loaded.
              </p>
            </div>
          )}

          {/* Score bar — shown when data is loaded */}
          {hasData && score !== null && score > 0 && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: mobile ? sp(2) : sp(3.5), padding: `${sp(2)}px ${sp(4)}px`, borderRadius: 14, backgroundColor: "rgba(244,241,234,0.06)", border: "1px solid rgba(244,241,234,0.10)", backdropFilter: "blur(8px)" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 600, color: C.sand, lineHeight: 1 }}>{score}</div>
                <div style={{ ...T.label, fontSize: 9, color: "rgba(244,241,234,0.40)", marginTop: 4 }}>SCORE</div>
              </div>
              <div style={{ width: 1, height: 36, background: "rgba(244,241,234,0.10)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ ...T.meta, fontWeight: 600, color: C.teal }}>{band}</div>
                <div style={{ ...T.label, fontSize: 9, color: "rgba(244,241,234,0.40)", marginTop: 4 }}>BAND</div>
              </div>
              {badgeCount.earned > 0 && (
                <>
                  <div style={{ width: 1, height: 36, background: "rgba(244,241,234,0.10)" }} />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ ...T.meta, fontWeight: 700, color: C.teal }}>{badgeCount.earned}/{badgeCount.total}</div>
                    <div style={{ ...T.label, fontSize: 9, color: "rgba(244,241,234,0.40)", marginTop: 4 }}>BADGES</div>
                  </div>
                </>
              )}
              {streak > 0 && (
                <>
                  <div style={{ width: 1, height: 36, background: "rgba(244,241,234,0.10)" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 16 }}>&#128293;</span>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ ...T.meta, fontWeight: 700, color: "#F0960A" }}>{streak}</div>
                      <div style={{ ...T.label, fontSize: 9, color: "rgba(244,241,234,0.40)", marginTop: 4 }}>STREAK</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {hasData && (score === null || score === 0) && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 24px", borderRadius: 20, backgroundColor: "rgba(26,122,109,0.12)", border: "1px solid rgba(26,122,109,0.20)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: C.teal }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: C.teal }}>Data loaded{userName ? ` for ${userName}` : ""} &mdash; your tools are ready</span>
            </div>
          )}
        </div>
      </div>

      {/* ══════════ TOOL CARDS ══════════ */}
      <section style={{ maxWidth: maxW, margin: "0 auto", padding: `${sp(8)}px ${px(mobile)}px ${sp(6)}px` }}>
        <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: sp(2.5), marginBottom: sp(6) }}>
          <ToolCard
            mobile={mobile}
            href="/pressuremap"
            color={C.purple}
            number="1"
            title="PressureMap&#8482;"
            subtitle="Your income is not equally vulnerable everywhere. PressureMap reveals the exact fault lines &mdash; the specific areas where one disruption could cascade into real financial pressure."
            features={[
              "3 interactive risk zones (Red, Yellow, Green)",
              "AI-powered recommendations tailored to your structure",
              "Live score preview showing each fix's impact",
              "One-click launch into the Simulator to test changes",
            ]}
            cta="Explore Your Risk Zones &rarr;"
            recommended
          />
          <ToolCard
            mobile={mobile}
            href="/simulator"
            color={C.teal}
            number="2"
            title="Stability Simulator"
            subtitle="What would happen if you secured a retainer? Added a new client? Shifted 20% to passive? The Simulator answers instantly &mdash; with real-time projections."
            features={[
              "Score updates in real time as you drag each slider",
              "6 pre-built scenarios ranked by effort and impact",
              "Forward projections at 3, 6, and 12 months",
              "Stress tests: lose top client, can't work 90 days",
            ]}
            cta="Launch Simulator &rarr;"
          />
          <ToolCard
            mobile={mobile}
            href="/dashboard"
            color="#DC7814"
            number="3"
            title="Progress Dashboard"
            subtitle="Knowing your score is step one. Improving it is the journey. Track actions, earn badges, and watch your score climb over time."
            features={[
              "Action checklist from your report's recommendations",
              "Score history chart across multiple assessments",
              "12 achievement badges earned by taking real action",
              "Daily streaks and goal progress toward next band",
            ]}
            cta="View Your Progress &rarr;"
          />
        </div>

        {/* ── CTA for non-customers ── */}
        {!hasData && (
          <div style={{ textAlign: "center", padding: `${sp(6)}px ${sp(3)}px`, borderRadius: 16, background: `linear-gradient(135deg, rgba(75,63,174,0.06) 0%, rgba(31,109,122,0.04) 100%)`, border: `1px solid ${C.border}`, marginBottom: sp(6) }}>
            <div style={{ ...T.label, color: C.purple, textTransform: "uppercase" as const, marginBottom: sp(2) }}>UNLOCK YOUR STABILITY SUITE</div>
            <h2 style={{ ...h2(mobile), color: C.navy, marginBottom: sp(1.5) }}>Get Your Income Stability Report</h2>
            <p style={{ ...body(mobile), color: C.muted, maxWidth: readW, margin: `0 auto ${sp(3)}px`, lineHeight: 1.65 }}>
              Your report generates a personalized access code that pre-loads all three tools with your data. No generic advice &mdash; every recommendation, simulation, and action step is built from your specific income structure.
            </p>
            <Link href="/pricing" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              height: 52, padding: "0 36px", borderRadius: 12,
              background: `linear-gradient(135deg, ${C.navy} 0%, ${C.purple} 100%)`,
              color: C.white, ...T.cta, letterSpacing: "-0.01em",
              boxShadow: "0 4px 20px rgba(14,26,43,0.15)",
              textDecoration: "none",
            }}>
              Get Started &mdash; From $69 &rarr;
            </Link>
          </div>
        )}

        {/* ── Recommended flow ── */}
        <div style={{ padding: mobile ? "24px 20px" : "28px 32px", borderRadius: 14, backgroundColor: C.white, border: `1px solid ${C.border}`, boxShadow: "0 1px 3px rgba(14,26,43,0.04)", marginBottom: sp(6) }}>
          <div style={{ ...T.label, color: C.teal, textTransform: "uppercase" as const, marginBottom: sp(2) }}>RECOMMENDED FLOW</div>
          <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: mobile ? sp(2) : sp(3), alignItems: mobile ? "flex-start" : "center" }}>
            {[
              { step: "1", text: "Explore your PressureMap&#8482; zones to understand where you are most vulnerable", color: C.purple },
              { step: "2", text: "Test improvements in the Simulator to see which changes have the most impact", color: C.teal },
              { step: "3", text: "Track your actions on the Dashboard and watch your stability score climb", color: "#DC7814" },
            ].map((s, i) => (
              <div key={s.step} style={{ display: "flex", alignItems: "flex-start", gap: sp(1.5), flex: 1 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: `${s.color}10`, border: `1.5px solid ${s.color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.step}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ ...T.meta, color: C.navy, margin: 0, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: s.text }} />
                </div>
                {i < 2 && !mobile && <span style={{ fontSize: 18, color: C.light, flexShrink: 0, marginLeft: sp(1) }}>&rarr;</span>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
