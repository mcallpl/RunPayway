"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logoWhite from "../../../../public/runpayway-logo-white.png";
import { getEarnedCount, getStreaks } from "@/lib/gamification";

/* ================================================================== */
/* DESIGN TOKENS — matches landing page                                */
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
  bandLimited: "#9B2C2C",
  bandDeveloping: "#92640A",
  bandEstablished: "#2B5EA7",
  bandHigh: "#1F6D7A",
};

const sp = (n: number) => n * 8;

const T = {
  h1: { desktop: { fontSize: 44, fontWeight: 600, lineHeight: 1.08 }, mobile: { fontSize: 28, fontWeight: 600, lineHeight: 1.12 } },
  h2: { desktop: { fontSize: 28, fontWeight: 600, lineHeight: 1.2 }, mobile: { fontSize: 22, fontWeight: 600, lineHeight: 1.2 } },
  h3: { desktop: { fontSize: 20, fontWeight: 600, lineHeight: 1.3 }, mobile: { fontSize: 18, fontWeight: 600, lineHeight: 1.3 } },
  bodyLg: { desktop: { fontSize: 18, fontWeight: 400, lineHeight: 1.55 }, mobile: { fontSize: 16, fontWeight: 400, lineHeight: 1.55 } },
  body: { desktop: { fontSize: 16, fontWeight: 400, lineHeight: 1.65 }, mobile: { fontSize: 15, fontWeight: 400, lineHeight: 1.6 } },
  label: { fontSize: 11, fontWeight: 700, lineHeight: 1.3, letterSpacing: "0.12em" },
  meta: { fontSize: 13, fontWeight: 500, lineHeight: 1.4 },
  cta: { fontSize: 15, fontWeight: 600 },
};

const maxW = 1080;
const padX = { desktop: 40, mobile: 20 };

const h1 = (m: boolean) => m ? T.h1.mobile : T.h1.desktop;
const h2 = (m: boolean) => m ? T.h2.mobile : T.h2.desktop;
const bodyLg = (m: boolean) => m ? T.bodyLg.mobile : T.bodyLg.desktop;
const body = (m: boolean) => m ? T.body.mobile : T.body.desktop;
const px = (m: boolean) => m ? padX.mobile : padX.desktop;

function bandColor(score: number): string {
  if (score >= 75) return C.bandHigh;
  if (score >= 50) return C.bandEstablished;
  if (score >= 30) return C.bandDeveloping;
  return C.bandLimited;
}

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
      {/* Recommended badge */}
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

      {/* Number accent */}
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

      {/* Title */}
      <div style={{ ...h2(mobile), color: C.navy, marginBottom: sp(1) }}>{title}</div>
      <p style={{ ...body(mobile), color: C.muted, margin: `0 0 ${sp(2.5)}px`, flex: 1 }}>{subtitle}</p>

      {/* Features */}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: sp(1), marginBottom: sp(3) }}>
        {features.map((f) => (
          <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: color, flexShrink: 0, marginTop: 7 }} />
            <span style={{ ...T.meta, color: C.navy }}>{f}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
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
  const router = useRouter();
  const [score, setScore] = useState<number | null>(null);
  const [band, setBand] = useState("");
  const [userName, setUserName] = useState("");
  const [mobile, setMobile] = useState(false);
  const [badgeCount, setBadgeCount] = useState({ earned: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

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
      } catch { /* ignore */ }
    }
    setBadgeCount(getEarnedCount());
    setStreak(getStreaks().currentStreak);
  }, []);

  const nextBandThreshold = score !== null ? (score < 30 ? 30 : score < 50 ? 50 : score < 75 ? 75 : 100) : 100;
  const nextBandLabel = score !== null ? (score < 30 ? "Developing" : score < 50 ? "Established" : score < 75 ? "High" : null) : null;
  const gap = score !== null ? nextBandThreshold - score : null;

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>

      {/* ══════════ HERO SECTION — matches landing page gradient ══════════ */}
      <div ref={heroRef} style={{
        background: C.heroGradient,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Grain overlay */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", pointerEvents: "none" }} />

        {/* Header */}
        <header style={{ padding: `${sp(2.5)}px ${px(mobile)}px`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: sp(2) }}>
            <Image src={logoWhite} alt="RunPayway" width={mobile ? 120 : 140} height={16} style={{ height: "auto", opacity: 0.95 }} />
            <div style={{ width: 1, height: 24, background: "rgba(244,241,234,0.15)" }} />
            <span style={{ ...T.label, color: C.teal, textTransform: "uppercase" as const }}>Stability Suite</span>
          </div>
          <Link href="/review" style={{ ...T.meta, color: "rgba(244,241,234,0.55)", textDecoration: "none" }}>&larr; Back to Report</Link>
        </header>

        {/* Hero content */}
        <div style={{ maxWidth: maxW, margin: "0 auto", padding: `${sp(8)}px ${px(mobile)}px ${sp(10)}px`, textAlign: "center", position: "relative", zIndex: 2 }}>
          <div style={{ ...T.label, color: C.teal, textTransform: "uppercase" as const, marginBottom: sp(2.5) }}>RUNPAYWAY&#8482; STABILITY SUITE</div>

          <h1 style={{ ...h1(mobile), color: C.sand, marginBottom: sp(2), letterSpacing: "-0.03em" }}>
            Your Premium Financial Tools
          </h1>

          <p style={{ ...bodyLg(mobile), color: "rgba(244,241,234,0.60)", maxWidth: 560, margin: `0 auto ${sp(4)}px`, letterSpacing: "-0.01em" }}>
            {score !== null
              ? `${userName ? `${userName}, your` : "Your"} report unlocked three premium tools built to transform your score from insight into action. Each one is pre-loaded with your data.`
              : "Three premium tools that turn your Income Stability Report into a living action plan. Get your report to unlock personalized access."}
          </p>

          {/* Score bar */}
          {score !== null && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: mobile ? sp(2) : sp(3.5), padding: `${sp(2)}px ${sp(4)}px`, borderRadius: 14, backgroundColor: "rgba(244,241,234,0.06)", border: "1px solid rgba(244,241,234,0.10)", backdropFilter: "blur(8px)" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 600, color: C.sand, lineHeight: 1 }}>{score}</div>
                <div style={{ ...T.label, fontSize: 9, color: "rgba(244,241,234,0.40)", marginTop: 4 }}>SCORE</div>
              </div>
              <div style={{ width: 1, height: 36, background: "rgba(244,241,234,0.10)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ ...T.meta, fontWeight: 600, color: bandColor(score) }}>{band}</div>
                <div style={{ ...T.label, fontSize: 9, color: "rgba(244,241,234,0.40)", marginTop: 4 }}>BAND</div>
              </div>
              {gap !== null && nextBandLabel && (
                <>
                  <div style={{ width: 1, height: 36, background: "rgba(244,241,234,0.10)" }} />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ ...T.meta, fontWeight: 700, color: C.purple, filter: "brightness(1.4)" }}>{gap} pts</div>
                    <div style={{ ...T.label, fontSize: 9, color: "rgba(244,241,234,0.40)", marginTop: 4 }}>TO {nextBandLabel.toUpperCase()}</div>
                  </div>
                </>
              )}
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
        </div>
      </div>

      {/* ══════════ TOOL CARDS — white background section ══════════ */}
      <div style={{ backgroundColor: C.sandBg }}>
        <div style={{ maxWidth: maxW, margin: "0 auto", padding: `${sp(6)}px ${px(mobile)}px ${sp(8)}px` }}>

          {/* 3 cards */}
          <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: sp(2.5), marginBottom: sp(5) }}>
            <ToolCard
              mobile={mobile}
              href={score !== null ? "/pressuremap" : "/pricing"}
              color={C.purple}
              number="1"
              title="PressureMap&#8482;"
              subtitle="Your income is not equally vulnerable everywhere. PressureMap reveals the exact fault lines — the specific areas where one disruption could cascade into real financial pressure. Stop guessing where you are exposed. See it mapped out, zone by zone, with the precise action to fix each one."
              features={[
                "3 interactive zones: Red (critical), Yellow (moderate), Green (protected)",
                "AI-powered recommendations tailored to your industry and income model",
                "Live score preview showing exactly how each fix impacts your number",
                "One-click launch into the Simulator to test before you commit",
              ]}
              cta={score !== null ? "Explore Your Risk Zones &rarr;" : "Get Your Report to Unlock &rarr;"}
              recommended
            />
            <ToolCard
              mobile={mobile}
              href={score !== null ? "/simulator" : "/pricing"}
              color={C.teal}
              number="2"
              title="Stability Simulator"
              subtitle="What would happen if you secured a retainer? Added a new client? Shifted 20% of income to passive? The Simulator answers these questions instantly — pre-loaded with your actual assessment data. No guesswork. Just clear, real-time projections of what each structural change would do to your score."
              features={[
                "Score updates in real time as you drag each slider",
                "6 pre-built scenarios ranked by effort, speed, and impact",
                "Forward projections at 3, 6, and 12 months with compounding effects",
                "Built-in stress tests: what happens if you lose your top client or can't work for 90 days",
              ]}
              cta={score !== null ? "Launch Simulator &rarr;" : "Get Your Report to Unlock &rarr;"}
            />
            <ToolCard
              mobile={mobile}
              href={score !== null ? "/dashboard" : "/pricing"}
              color="#DC7814"
              number="3"
              title="Progress Dashboard"
              subtitle="Knowing your score is step one. Improving it is the journey. The Dashboard turns your report's recommendations into a trackable action plan — complete with check-off items, achievement badges, streak tracking, and a visual record of every assessment you have taken. Watch your score climb over time."
              features={[
                "Personalized action checklist pulled from your report's recommendations",
                "Score history chart across multiple assessments",
                "12 achievement badges earned by taking real action",
                "Daily visit streaks and goal progress toward the next stability band",
              ]}
              cta={score !== null ? "View Your Progress &rarr;" : "Get Your Report to Unlock &rarr;"}
            />
          </div>

          {/* Non-customer CTA */}
          {score === null && (
            <div style={{ textAlign: "center", padding: `${sp(5)}px ${sp(3)}px`, borderRadius: 16, background: `linear-gradient(135deg, rgba(75,63,174,0.06) 0%, rgba(31,109,122,0.04) 100%)`, border: `1px solid ${C.border}`, marginBottom: sp(4) }}>
              <div style={{ ...T.label, color: C.purple, textTransform: "uppercase" as const, marginBottom: sp(2) }}>UNLOCK YOUR STABILITY SUITE</div>
              <h2 style={{ ...h2(mobile), color: C.navy, marginBottom: sp(1.5) }}>Get Your Income Stability Report</h2>
              <p style={{ ...body(mobile), color: C.muted, maxWidth: 480, margin: `0 auto ${sp(3)}px`, lineHeight: 1.65 }}>
                Your report generates a personalized access code that pre-loads all three tools with your data. No generic advice — every recommendation, simulation, and action step is built from your specific income structure.
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

          {/* Recommended flow */}
          <div style={{ padding: mobile ? "24px 20px" : "28px 32px", borderRadius: 14, backgroundColor: C.white, border: `1px solid ${C.border}`, boxShadow: "0 1px 3px rgba(14,26,43,0.04)", marginBottom: sp(4) }}>
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

          {/* Back to report */}
          <div style={{ textAlign: "center", marginBottom: sp(4) }}>
            <Link href="/review" style={{ ...T.meta, color: C.muted, textDecoration: "none" }}>&larr; Back to Your Income Stability Report</Link>
          </div>

          {/* Footer */}
          <div style={{ paddingTop: sp(2), borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
            <p style={{ fontSize: 12, color: C.light, margin: 0, lineHeight: 1.5 }}>
              RunPayway&#8482; Stability Suite &mdash; Premium tools available exclusively to report customers. A proprietary product by PeopleStar Enterprises.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
