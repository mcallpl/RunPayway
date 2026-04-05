"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  C, T, mono, sans, sp, maxW, secPad, px,
  h1, h2Style, h3Style, body, bodySm, cardStyle, ctaButtonLight,
} from "@/lib/design-tokens";

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

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

const fadeIn = (v: boolean, delay = 0) => ({
  opacity: v ? 1 : 0,
  transform: v ? "translateY(0)" : "translateY(16px)",
  transition: `opacity 600ms ease-out ${delay}ms, transform 600ms ease-out ${delay}ms`,
});


/* ================================================================== */
/* HERO                                                                */
/* ================================================================== */
function Hero() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 80 : 140, paddingBottom: m ? 56 : 100, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: maxW, margin: "0 auto", textAlign: "center" }}>
        <div style={{ ...fadeIn(visible) }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 28 }}>
            <span style={{ ...T.label, color: C.teal }}>New Releases</span>
          </div>
          <h1 style={{ ...h1(m), color: C.navy, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 24 }}>
            What we&#8217;ve shipped.{!m && <br />} What&#8217;s next.
          </h1>
          <p style={{ ...body(m), color: C.muted, maxWidth: 520, margin: "0 auto" }}>
            RunPayway&#8482; is actively developed. Every update is versioned, tested, and deployed without disrupting existing assessments.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SHIPPED — What's live now                                           */
/* ================================================================== */
function Shipped() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const releases = [
    {
      version: "v2",
      date: "Q1 2026",
      title: "Structural Stability Model",
      status: "live",
      items: [
        "Deterministic scoring with fixed, versioned rules",
        "Six structural dimensions with cross-dimension interaction analysis",
        "4-page diagnostic report with PressureMap\u2122 intelligence",
        "Command Center with lifetime simulator access",
        "Industry-specific benchmarks and stress scenarios",
        "Integrity verification on every assessment record",
        "Consolidated scoring architecture — one model, one source of truth",
      ],
    },
    {
      version: "v2",
      date: "Q1 2026",
      title: "Outcome Layer — Context Precision",
      status: "live",
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
      title: "Command Center Launch",
      status: "live",
      items: [
        "PressureMap\u2122 structural intelligence",
        "What-if simulator with real-time score projection",
        "12-week execution roadmap",
        "Industry-specific benchmarks",
        "Score sharing with QR verification",
      ],
    },
    {
      version: "SM-1.0",
      date: "Q2 2026",
      title: "Stability Monitoring — Longitudinal Tracking",
      status: "live",
      items: [
        "Score History Timeline — visual progression across assessments",
        "Factor-level delta tracking between first and latest assessment",
        "Benchmark evolution — peer percentile movement over time",
        "Score delta summary with total change calculation",
        "Email + PIN authentication for Monitoring Portal",
      ],
    },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ marginBottom: sp(2), ...fadeIn(visible) }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", color: C.light, fontFamily: mono }}>01</span>
        </div>
        <div style={{ marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>
            Shipped.
          </h2>
          <p style={{ ...body(m), color: C.muted, maxWidth: 480 }}>
            Everything currently live in production.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: m ? 16 : 20 }}>
          {releases.map((r, i) => (
            <div key={r.version} style={{
              ...cardStyle, padding: m ? "24px 20px" : "32px 28px", borderRadius: 12,
              ...fadeIn(visible, 100 + i * 80),
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" as const }}>
                <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.purple }}>{r.version}</span>
                <span style={{ fontSize: 12, color: C.light }}>{r.date}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.teal, backgroundColor: "rgba(31,109,122,0.08)", padding: "3px 10px", borderRadius: 100 }}>Live</span>
              </div>
              <h3 style={{ ...h3Style(m), color: C.navy, marginBottom: 12 }}>{r.title}</h3>
              <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 6 }}>
                {r.items.map(item => (
                  <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 7 }} />
                    <span style={{ fontSize: 14, color: C.muted, lineHeight: 1.5 }}>{item}</span>
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
/* ROADMAP — What's coming                                             */
/* ================================================================== */
function Roadmap() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const upcoming = [
    {
      timeline: "Q3 2026",
      title: "Espa\u00f1ol Language Support",
      desc: "Full assessment, report, and simulator localized for Spanish-speaking markets.",
      status: "in development",
    },
    {
      timeline: "Q4 2026",
      title: "Portugu\u00eas & \u0939\u093F\u0928\u094D\u0926\u0940 Language Support",
      desc: "Full localization for Brazil and India markets.",
      status: "planned",
    },
    {
      timeline: "2026",
      title: "Enterprise API & Advisor License",
      desc: "Programmatic access to the scoring engine for financial advisors, lenders, and workforce platforms. White-label reporting available.",
      status: "planned",
    },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ marginBottom: sp(2), ...fadeIn(visible) }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", color: C.light, fontFamily: mono }}>02</span>
        </div>
        <div style={{ marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>
            Roadmap.
          </h2>
          <p style={{ ...body(m), color: C.muted, maxWidth: 480 }}>
            What we&#8217;re building next. Timelines are targets, not promises.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {upcoming.map((item, i) => (
            <div key={item.title} style={{
              padding: m ? "20px 0" : "24px 0",
              borderBottom: i < upcoming.length - 1 ? `1px solid ${C.softBorder}` : "none",
              ...fadeIn(visible, 100 + i * 80),
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" as const }}>
                <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 600, color: C.purple }}>{item.timeline}</span>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: item.status === "in development" ? C.amber : C.light,
                  backgroundColor: item.status === "in development" ? "rgba(196,154,108,0.10)" : C.sand,
                  padding: "3px 10px", borderRadius: 100,
                }}>
                  {item.status === "in development" ? "In Development" : "Planned"}
                </span>
              </div>
              <h3 style={{ fontSize: m ? 18 : 20, fontWeight: 600, color: C.navy, marginBottom: 6 }}>{item.title}</h3>
              <p style={{ ...bodySm(m), color: C.muted, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* CTA                                                                 */
/* ================================================================== */
function Cta() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: maxW, margin: "0 auto", textAlign: "center" }}>
        <div style={{ ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.sandText, letterSpacing: "-0.02em", marginBottom: 20 }}>
            The platform is live.{!m && <br />} Your assessment is waiting.
          </h2>
          <p style={{ ...body(m), color: C.sandMuted, maxWidth: 440, margin: "0 auto 40px" }}>
            Start with the free score. The full diagnostic is there when you want it.
          </p>
          <Link href="/begin" style={{
            ...ctaButtonLight,
            height: m ? 48 : 56, paddingLeft: 36, paddingRight: 36, borderRadius: 10,
            backgroundColor: C.white, color: C.navy,
          }}>
            Start Your Free Assessment
          </Link>
          <div style={{ marginTop: 20, ...T.meta, color: C.sandLight }}>
            Under 2 minutes &#183; Instant result &#183; <span style={{ fontFamily: mono }}>$69</span> for the full report
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* EXPORT                                                              */
/* ================================================================== */
export default function NewReleasesPage() {
  return (
    <div style={{ fontFamily: sans, overflowX: "hidden" }}>
      <Hero />
      <Shipped />
      <Roadmap />
      <Cta />
    </div>
  );
}
