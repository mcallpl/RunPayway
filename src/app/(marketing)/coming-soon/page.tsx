"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ================================================================== */
/* UTILITIES                                                           */
/* ================================================================== */

function useInView(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) { setVisible(true); return; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => { const c = () => setM(window.innerWidth <= bp); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, [bp]);
  return m;
}

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => { setR(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  return r;
}

function useFadeIn() {
  const reduced = useReducedMotion();
  return (visible: boolean, delay = 0): React.CSSProperties =>
    reduced ? {} : { opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)", transition: `opacity 500ms ease-out ${delay}ms, transform 500ms ease-out ${delay}ms` };
}

/* ================================================================== */
/* DESIGN SYSTEM                                                       */
/* ================================================================== */

const C = { navy: "#0E1A2B", purple: "#4B3FAE", teal: "#1F6D7A", sand: "#F4F1EA", white: "#FFFFFF", border: "#E5E7EB" };
const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';
const muted = "rgba(14,26,43,0.68)";
const light = "rgba(14,26,43,0.62)";
const contentW = 1040;
function useTablet() {
  const [t, setT] = useState(false);
  useEffect(() => { const c = () => setT(window.innerWidth > 768 && window.innerWidth <= 1024); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, []);
  return t;
}
const px = (m: boolean, t?: boolean) => m ? 28 : t ? 56 : 48;


/* ================================================================== */
/* SECTION 1 — HERO                                                    */
/* ================================================================== */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();
  return (
    <header ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 104 : 152, paddingBottom: m ? 56 : 88, paddingLeft: px(m, t), paddingRight: px(m, t) }}>
      <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>WHAT&apos;S NEW</div>
        <h1 style={{ fontSize: m ? 28 : 40, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.035em", color: C.navy, marginBottom: 16, ...fadeIn(visible, 50) }}>
          What&apos;s New
        </h1>
        <p style={{ fontSize: m ? 16 : 18, color: muted, lineHeight: 1.6, maxWidth: 600, margin: "0 auto 16px", ...fadeIn(visible, 100) }}>
          Every update is versioned, tested, and deployed without disrupting existing assessments.
        </p>
      </div>
    </header>
  );
}


/* ================================================================== */
/* SECTION 2 — SHIPPED                                                 */
/* ================================================================== */

function Shipped() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();

  const releases = [
    {
      version: "RP-2.0",
      date: "Q1 2026",
      title: "Income Stability Model",
      icon: "M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6M15 19v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6M9 13V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v8",
      color: C.teal,
      items: [
        "Consistent scoring with fixed, versioned rules",
        "Six key dimensions with cross-dimension interaction analysis",
        "4-page full report with PressureMap\u2122 intelligence",
        "Integrity verification on every assessment record",
        "Consolidated scoring architecture — one model, one source of truth",
      ],
    },
    {
      version: "OL-1.0",
      date: "Q1 2026",
      title: "Outcome Layer — Context Precision",
      icon: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
      color: C.purple,
      items: [
        "Industry-specific scenario selection and action ordering",
        "Tailored risk patterns by income model",
        "Sector-specific stress scenarios",
        "Explanation language precision by operating context",
        "Peer benchmarking by sector",
      ],
    },
    {
      version: "CC-1.0",
      date: "Q1 2026",
      title: "Dashboard Launch",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      color: C.teal,
      items: [
        "PressureMap\u2122 structural intelligence",
        "What-if simulator with real-time score projection",
        "12-week execution roadmap with industry scripts",
        "Industry-specific benchmarks",
        "Goal Mode — reverse path modeling to target band",
      ],
    },
    {
      version: "SM-1.0",
      date: "Q2 2026",
      title: "Stability Monitoring",
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
      color: C.purple,
      items: [
        "Score History Timeline \u2014 visual progression across assessments",
        "Factor-level delta tracking between assessments",
        "Benchmark evolution \u2014 peer percentile movement over time",
        "Email + PIN authentication for Monitoring Portal",
        "3 assessments over 12 months",
      ],
    },
    {
      version: "GV-1.0",
      date: "Q2 2026",
      title: "Enterprise Compliance & B2B Readiness",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      color: C.teal,
      items: [
        "SOC 2 Type II and ISO 27001 framework alignment documentation",
        "GDPR readiness \u2014 DPIA, expanded data subject rights, DPO roadmap",
        "CCPA/CPRA strengthening \u2014 sensitive PI declaration, CPRA-specific rights",
        "Enterprise licensing framework in Terms of Use",
        "Advisors and Organizations pages with request access forms",
        "Compliance FAQ category with SOC 2, ISO 27001, GDPR, CCPA entries",
      ],
    },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 56 : 96, paddingBottom: m ? 56 : 96, paddingLeft: px(m, t), paddingRight: px(m, t) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 64, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.teal, marginBottom: 12 }}>Shipped</h2>
          <p style={{ fontSize: m ? 16 : 18, color: muted, lineHeight: 1.6 }}>Everything currently live in production.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: m ? 16 : 20 }}>
          {releases.map((r, i) => (
            <div key={i} style={{
              backgroundColor: C.white, borderRadius: 16, padding: m ? 24 : 32,
              boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 4px 16px rgba(14,26,43,0.03)",
              position: "relative" as const, overflow: "hidden",
              ...fadeIn(visible, 100 + i * 80),
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: `${r.color}40` }} />

              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: `${r.color}08`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={r.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={r.icon} /></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const }}>
                    <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: r.color }}>{r.version}</span>
                    <span style={{ fontSize: 12, color: light }}>{r.date}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", color: C.teal, backgroundColor: `${C.teal}08`, padding: "2px 8px", borderRadius: 100 }}>LIVE</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: C.navy, marginTop: 2, lineHeight: 1.3 }}>{r.title}</div>
                </div>
              </div>

              {/* Items */}
              <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 8 }}>
                {r.items.map((item, j) => (
                  <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: C.teal, fontSize: 13, flexShrink: 0, marginTop: 2 }}>&#10003;</span>
                    <span style={{ fontSize: 14, color: muted, lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3 — ROADMAP                                                 */
/* ================================================================== */

function RoadmapSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();

  const upcoming = [
    {
      timeline: "Q3 2026",
      title: "Espa\u00f1ol Language Support",
      desc: "Full assessment, report, and simulator localized for Spanish-speaking markets.",
      status: "development" as const,
      icon: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 0 1 6.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129",
    },
    {
      timeline: "Q4 2026",
      title: "Portugu\u00eas & \u0939\u093F\u0928\u094D\u0926\u0940 Support",
      desc: "Full localization for Brazil and India markets.",
      status: "planned" as const,
      icon: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 0 1 6.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129",
    },
    {
      timeline: "2026",
      title: "Enterprise API & Advisor License",
      desc: "Programmatic API access to the scoring engine for financial advisors, lenders, and workforce platforms. White-label reporting and batch assessment. Advisor and enterprise access currently available by request.",
      status: "development" as const,
      icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: "#F8F6F1", paddingTop: m ? 56 : 96, paddingBottom: m ? 56 : 96, paddingLeft: px(m, t), paddingRight: px(m, t) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 64, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 12 }}>Roadmap</h2>
          <p style={{ fontSize: m ? 16 : 18, fontWeight: 500, color: C.navy, marginBottom: 8 }}>What We&rsquo;re Building Next</p>
          <p style={{ fontSize: m ? 15 : 16, color: muted, lineHeight: 1.6 }}>Timelines are targets, not promises.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: m ? 16 : 20, maxWidth: 800, margin: "0 auto" }}>
          {upcoming.map((item, i) => {
            const isDev = item.status === "development";
            return (
              <div key={i} style={{
                backgroundColor: C.white, borderRadius: 14, padding: m ? 24 : 28,
                boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 4px 16px rgba(14,26,43,0.03)",
                borderLeft: `4px solid ${isDev ? C.purple : C.navy}`,
                position: "relative" as const, overflow: "hidden",
                ...fadeIn(visible, 100 + i * 80),
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: isDev ? `${C.purple}25` : "rgba(14,26,43,0.06)" }} />
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: isDev ? `${C.purple}08` : "rgba(14,26,43,0.03)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isDev ? C.purple : light} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" as const }}>
                      <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 600, color: isDev ? C.purple : light }}>{item.timeline}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 600, letterSpacing: "0.04em",
                        color: isDev ? C.purple : light,
                        backgroundColor: isDev ? `${C.purple}08` : "rgba(14,26,43,0.04)",
                        padding: "2px 8px", borderRadius: 100,
                      }}>
                        {isDev ? "IN DEVELOPMENT" : "PLANNED"}
                      </span>
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 600, color: C.navy, marginBottom: 6, lineHeight: 1.3 }}>{item.title}</div>
                    <p style={{ fontSize: 15, color: muted, margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 4 — CTA                                                     */
/* ================================================================== */

function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 88 : 128, paddingBottom: m ? 88 : 128, paddingLeft: px(m, t), paddingRight: px(m, t) }}>
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.sand, marginBottom: 16, ...fadeIn(visible) }}>
          The Platform Is Live.{m ? " " : <br />}Your assessment is waiting.
        </h2>
        <p style={{ fontSize: m ? 16 : 18, color: "rgba(244,241,234,0.50)", lineHeight: 1.6, marginBottom: 32, ...fadeIn(visible, 60) }}>
          See your stability class free. The full report is $69.
        </p>
        <div style={{ display: "flex", flexDirection: m ? "column" : "row", alignItems: "center", gap: m ? 12 : 16, justifyContent: "center", ...fadeIn(visible, 120) }}>
          <Link href="/begin" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: m ? 56 : 60, padding: m ? "0 28px" : "0 32px", width: m ? "100%" : "auto",
            borderRadius: 16,
            backgroundColor: C.white, color: C.navy,
            fontSize: 16, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 8px 24px rgba(14,26,43,0.08)",
            border: "1px solid rgba(244,241,234,0.45)",
            transition: "transform 200ms, box-shadow 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(244,241,234,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.08)"; }}>
            Get My Stability Class — Free
          </Link>
          <a href="https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: m ? 56 : 60, padding: m ? "0 28px" : "0 32px", width: m ? "100%" : "auto",
            borderRadius: 16,
            backgroundColor: C.navy, color: C.white,
            fontSize: 16, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 8px 24px rgba(14,26,43,0.12)",
            border: `1px solid ${C.navy}`,
            transition: "transform 200ms, box-shadow 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(244,241,234,0.18)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.12)"; }}>
            Get Your Full Report — $69
          </a>
        </div>
        <p style={{ fontSize: 14, fontWeight: 500, color: "rgba(244,241,234,0.40)", marginTop: 20, textAlign: "center" }}>
          Free analysis under 2 minutes | Paid report includes roadmap & scripts
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* EXPORT                                                              */
/* ================================================================== */

export default function NewReleasesPage() {
  return (
    <div className="overflow-x-hidden">
      <main>
        <HeroSection />
        <Shipped />
        <RoadmapSection />
        <FinalCta />
      </main>
    </div>
  );
}
