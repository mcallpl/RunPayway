"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getEarnedCount, getStreaks } from "@/lib/gamification";
import SuiteHeader from "@/components/SuiteHeader";
import SuiteCTA from "@/components/SuiteCTA";

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
const maxW = 1200;
const px = (m: boolean) => m ? 20 : 40;

const TY = {
  h1: (m: boolean): React.CSSProperties => ({ fontSize: m ? 28 : 44, fontWeight: 600, lineHeight: m ? 1.12 : 1.08 }),
  h2: (m: boolean): React.CSSProperties => ({ fontSize: m ? 20 : 24, fontWeight: 600, lineHeight: 1.2 }),
  bodyLg: (m: boolean): React.CSSProperties => ({ fontSize: m ? 16 : 18, fontWeight: 400, lineHeight: 1.55 }),
  body: (m: boolean): React.CSSProperties => ({ fontSize: m ? 15 : 16, fontWeight: 400, lineHeight: 1.65 }),
  label: { fontSize: 11, fontWeight: 700, lineHeight: 1.3, letterSpacing: "0.12em" } as React.CSSProperties,
  meta: { fontSize: 13, fontWeight: 500, lineHeight: 1.4 } as React.CSSProperties,
  cta: { fontSize: 15, fontWeight: 600 } as React.CSSProperties,
};

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
    <div onClick={() => router.push(href)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ flex: 1, minWidth: mobile ? "100%" : 280, backgroundColor: C.white, borderRadius: 16, border: `1px solid ${hovered ? color + "44" : C.border}`, padding: mobile ? "28px 20px" : "32px 28px", cursor: "pointer", transition: "all 300ms ease", boxShadow: hovered ? `0 12px 40px ${color}12` : "0 1px 3px rgba(14,26,43,0.04)", transform: hovered ? "translateY(-6px)" : "translateY(0)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {recommended && <div style={{ position: "absolute", top: 16, right: 16, ...TY.label, fontSize: 9, textTransform: "uppercase", color: C.white, backgroundColor: color, padding: "4px 12px", borderRadius: 20 }}>START HERE</div>}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: sp(3) }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${color}12 0%, ${color}06 100%)`, border: `1px solid ${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 18, fontWeight: 700, color }}>{number}</span>
        </div>
        <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${color}18 0%, transparent 100%)` }} />
      </div>
      <div style={{ ...TY.h2(mobile), color: C.navy, marginBottom: sp(1) }}>{title}</div>
      <p style={{ ...TY.body(mobile), color: C.muted, margin: `0 0 ${sp(2.5)}px`, flex: 1 }}>{subtitle}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: sp(1), marginBottom: sp(3) }}>
        {features.map((f) => (
          <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: color, flexShrink: 0, marginTop: 7 }} />
            <span style={{ ...TY.meta, color: C.navy }}>{f}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: "12px 20px", borderRadius: 10, textAlign: "center", backgroundColor: hovered ? color : `${color}08`, color: hovered ? C.white : color, ...TY.cta, transition: "all 300ms ease", border: `1px solid ${color}18` }}>{cta}</div>
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
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 768);
    check(); window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    let stored = sessionStorage.getItem("rp_record");
    if (!stored) stored = localStorage.getItem("rp_record");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.final_score > 0) {
          // Customer has data — redirect to Dashboard (the real hub)
          router.replace("/dashboard");
          return;
        }
        setScore(parsed.final_score ?? null); setBand(parsed.stability_band ?? "");
        setUserName(parsed.assessment_title ?? ""); setCodeSuccess(true);
      } catch { /* ignore */ }
    }
    setBadgeCount(getEarnedCount()); setStreak(getStreaks().currentStreak);
  }, []);

  const handleCodeSubmit = () => {
    setCodeError(null);
    const trimmed = accessCode.trim();
    if (!trimmed) { setCodeError("Paste the Access Code from your report cover page."); return; }
    try {
      const decoded = JSON.parse(atob(trimmed));
      if (typeof decoded.p !== "number" || typeof decoded.c !== "number" || typeof decoded.l !== "number") { setCodeError("Invalid code."); return; }
      const record = { record_id: `sim-${Date.now()}`, authorization_code: "", model_version: "RP-2.0", assessment_date_utc: new Date().toISOString(), issued_timestamp_utc: new Date().toISOString(), final_score: 0, stability_band: "", assessment_title: decoded.n || "", classification: "", operating_structure: "", primary_income_model: decoded.m || "", industry_sector: decoded.i || "", _v2: { normalized_inputs: { income_persistence_pct: decoded.p, largest_source_pct: decoded.c, source_diversity_count: decoded.s, forward_secured_pct: decoded.f, income_variability_level: decoded.v || "moderate", labor_dependence_pct: decoded.l }, quality: { quality_score: decoded.q || 5 } } };
      sessionStorage.setItem("rp_record", JSON.stringify(record));
      sessionStorage.setItem("rp_sim_code", trimmed);
      setUserName(decoded.n || ""); setUnlocking(true); setScore(null);
      setTimeout(() => { router.replace("/dashboard"); }, 1200);
    } catch { setCodeError("Invalid code. Make sure you copied the entire Access Code."); }
  };

  const hasData = codeSuccess;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.sandBg, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @keyframes unlockPulse { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes unlockSpin { from { transform: rotate(-180deg) scale(0.5); opacity: 0; } to { transform: rotate(0) scale(1); opacity: 1; } }
        @keyframes unlockFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <SuiteHeader current="suite" />

      {/* ══════════ HERO ══════════ */}
      <div style={{ background: C.heroGradient, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", pointerEvents: "none" }} />
        <div style={{ maxWidth: maxW, margin: "0 auto", padding: `${sp(8)}px ${px(mobile)}px ${sp(10)}px`, textAlign: "center", position: "relative", zIndex: 2 }}>
          <div style={{ ...TY.label, color: C.teal, textTransform: "uppercase", marginBottom: sp(2.5) }}>RUNPAYWAY&#8482; STABILITY SUITE</div>
          <h1 style={{ ...TY.h1(mobile), color: C.sand, marginBottom: sp(2), letterSpacing: "-0.03em" }}>Your Premium Financial Tools</h1>
          <p style={{ ...TY.bodyLg(mobile), color: "rgba(244,241,234,0.55)", maxWidth: 540, margin: `0 auto ${sp(4)}px` }}>
            {hasData ? `${userName ? `${userName}, your` : "Your"} tools are loaded and ready.` : "Enter your access code to load your personalized data. Or explore the tools below."}
          </p>

          {!hasData && (
            <div style={{ maxWidth: 480, margin: `0 auto`, textAlign: "left" }}>
              <div style={{ backgroundColor: "rgba(244,241,234,0.06)", border: "1px solid rgba(244,241,234,0.12)", borderRadius: 14, padding: mobile ? "20px 16px" : "24px 28px", backdropFilter: "blur(8px)" }}>
                <div style={{ ...TY.label, color: C.teal, textTransform: "uppercase", marginBottom: sp(1.5) }}>ENTER YOUR ACCESS CODE</div>
                <p style={{ fontSize: 13, color: "rgba(244,241,234,0.45)", margin: `0 0 ${sp(2)}px`, lineHeight: 1.5 }}>From the cover page of your report. Loads all three tools.</p>
                <textarea value={accessCode} onChange={(e) => { setAccessCode(e.target.value); setCodeError(null); }} placeholder="Paste your access code here" spellCheck={false} autoComplete="off" rows={3}
                  style={{ width: "100%", padding: "12px 14px", fontSize: 12, fontFamily: "monospace", color: "#F4F1EA", backgroundColor: "rgba(244,241,234,0.04)", border: "1px solid rgba(244,241,234,0.10)", borderRadius: 8, outline: "none", boxSizing: "border-box", resize: "none", lineHeight: 1.4 }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = C.purple; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(244,241,234,0.10)"; }}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleCodeSubmit(); } }}
                />
                {codeError && <div style={{ fontSize: 13, color: "#DC4A4A", marginTop: 8 }}>{codeError}</div>}
                <button onClick={handleCodeSubmit} style={{ marginTop: sp(1.5), width: "100%", height: 48, borderRadius: 10, background: `linear-gradient(135deg, ${C.teal} 0%, ${C.purple} 100%)`, color: C.white, ...TY.cta, border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(26,122,109,0.25)" }}>Load My Data</button>
              </div>
            </div>
          )}

          {/* Unlock animation */}
          {unlocking && (
            <div style={{ animation: "unlockPulse 1200ms ease-out" }}>
              <div style={{ width: 56, height: 56, margin: "0 auto 16px", borderRadius: "50%", background: `linear-gradient(135deg, ${C.teal} 0%, ${C.purple} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px ${C.teal}44`, animation: "unlockSpin 800ms ease-out" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F4F1EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.sand, animation: "unlockFadeIn 600ms ease-out 400ms both" }}>
                Unlocking your Stability Suite...
              </div>
            </div>
          )}

          {hasData && !unlocking && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 24px", borderRadius: 20, backgroundColor: "rgba(26,122,109,0.12)", border: "1px solid rgba(26,122,109,0.20)", animation: "unlockFadeIn 400ms ease-out" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: C.teal }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: C.teal }}>Data loaded{userName ? ` for ${userName}` : ""} — your tools are ready</span>
            </div>
          )}
        </div>
      </div>

      {/* ══════════ TOOL CARDS ══════════ */}
      <section style={{ maxWidth: maxW, margin: "0 auto", padding: `${sp(8)}px ${px(mobile)}px ${sp(6)}px` }}>
        <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: sp(2.5), marginBottom: sp(6) }}>
          <ToolCard mobile={mobile} href="/pressuremap" color={C.purple} number="1" title="PressureMap&#8482;"
            subtitle="Your income is not equally vulnerable everywhere. PressureMap reveals the exact fault lines — where one disruption could cascade into real financial pressure."
            features={["3 interactive risk zones (Red, Yellow, Green)", "AI-powered recommendations tailored to your structure", "Live score preview showing each fix's impact", "One-click launch into the Simulator to test changes"]}
            cta="Explore Your Risk Zones &rarr;" recommended />
          <ToolCard mobile={mobile} href="/simulator" color={C.teal} number="2" title="Stability Simulator"
            subtitle="What would happen if you secured a retainer? Added a new client? Shifted 20% to passive? The Simulator answers instantly — with real-time projections."
            features={["Score updates in real time as you drag each slider", "6 pre-built scenarios ranked by effort and impact", "Forward projections at 3, 6, and 12 months", "Stress tests: lose top client, can't work 90 days"]}
            cta="Launch Simulator &rarr;" />
          <ToolCard mobile={mobile} href="/dashboard" color="#DC7814" number="3" title="Progress Dashboard"
            subtitle="Knowing your score is step one. Improving it is the journey. Track actions, earn badges, and watch your score climb over time."
            features={["Action checklist from your report's recommendations", "Score history chart across multiple assessments", "12 achievement badges earned by taking real action", "Daily streaks and goal progress toward next band"]}
            cta="View Your Progress &rarr;" />
        </div>

        {/* Recommended flow */}
        <div style={{ padding: mobile ? "24px 20px" : "28px 32px", borderRadius: 14, backgroundColor: C.white, border: `1px solid ${C.border}`, marginBottom: sp(6) }}>
          <div style={{ ...TY.label, color: C.teal, textTransform: "uppercase", marginBottom: sp(2) }}>RECOMMENDED FLOW</div>
          <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: mobile ? sp(2) : sp(3), alignItems: mobile ? "flex-start" : "center" }}>
            {[{ step: "1", text: "Explore your PressureMap&#8482; zones", color: C.purple }, { step: "2", text: "Test improvements in the Simulator", color: C.teal }, { step: "3", text: "Track actions on the Dashboard", color: "#DC7814" }].map((s, i) => (
              <div key={s.step} style={{ display: "flex", alignItems: "center", gap: sp(1.5), flex: 1 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: `${s.color}10`, border: `1.5px solid ${s.color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.step}</span>
                </div>
                <p style={{ ...TY.meta, color: C.navy, margin: 0 }} dangerouslySetInnerHTML={{ __html: s.text }} />
                {i < 2 && !mobile && <span style={{ fontSize: 18, color: C.light, flexShrink: 0, marginLeft: sp(1) }}>&rarr;</span>}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginBottom: sp(6) }}><SuiteCTA page="suite" /></div>

        {/* Footer */}
        <div style={{ paddingTop: sp(2), borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: C.light, margin: 0 }}>RunPayway&#8482; Stability Suite — Premium tools by PeopleStar Enterprises.</p>
        </div>
      </section>
    </div>
  );
}
