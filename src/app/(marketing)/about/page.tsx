"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ================================================================ */
/* UTILITIES                                                         */
/* ================================================================ */

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
    reduced ? {} : {
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    };
}


/* ================================================================ */
/* DESIGN SYSTEM                                                     */
/* ================================================================ */

const C = {
  navy: "#0E1A2B",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  white: "#FFFFFF",
  textSecondary: "#5E6873",
  textMuted: "#7B848E",
  borderSoft: "#D9D6CF",
  sandText: "#F4F1EA",
  sandMuted: "rgba(244,241,234,0.55)",
  sandLight: "rgba(244,241,234,0.40)",
};

const innerW = 1120;
const narrowW = 720;
const explanatoryW = 640;
const sectionPx = (m: boolean, t?: boolean) => m ? 28 : t ? 56 : 48;

function useTablet() {
  const [t, setT] = useState(false);
  useEffect(() => { const c = () => setT(window.innerWidth > 768 && window.innerWidth <= 1024); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, []);
  return t;
}
const cardShadow = "0 10px 30px rgba(14,26,43,0.06)";


/* ================================================================ */
/* SECTION 1 — HERO                                                  */
/* ================================================================ */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();

  return (
    <header ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 104 : 148, paddingBottom: m ? 56 : 72, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t) }}>
      <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>
          ABOUT
        </div>
        <h1 style={{ fontSize: m ? 30 : 64, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.035em", color: C.navy, marginBottom: 24, ...fadeIn(visible, 50) }}>
          The Standard for Measuring{m ? " " : <br />}Income Stability
        </h1>
        <p style={{ fontSize: m ? 18 : 22, fontWeight: 400, lineHeight: 1.5, color: C.textSecondary, maxWidth: narrowW, margin: "0 auto 16px", ...fadeIn(visible, 100) }}>
          RunPayway™ produces the Income Stability Score™&mdash;a consistent, fixed measurement of how your income is built and how it holds under&nbsp;pressure.
        </p>
        <p style={{ fontSize: m ? 18 : 22, fontWeight: 600, color: C.teal, ...fadeIn(visible, 150) }}>
          Not how much you earn. How your income behaves under change.
        </p>
      </div>
    </header>
  );
}


/* ================================================================ */
/* SECTION 2 — DECLARATION                                           */
/* ================================================================ */

function Declaration() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto", display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
        <div style={{ marginBottom: m ? 32 : 0, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 44, fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.035em", color: C.navy }}>
            Income Has Always{m ? " " : <br />}Been Visible.{m ? " " : <br />}Its Structure Has Not.
          </h2>
        </div>
        <div style={{ ...fadeIn(visible, 100) }}>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 16 }}>
            Financial systems track:
          </p>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, marginBottom: 24 }}>
            {[
              "What you earn",
              "What you owe",
              "What you\u2019ve accumulated",
            ].map((line, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 4 }}><path d="M20 6L9 17l-5-5"/></svg>
                <span style={{ fontSize: 18, color: C.textSecondary, lineHeight: 1.6 }}>{line}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.6, color: C.navy, marginBottom: 24 }}>
            But not how income is built.
          </p>
          <p style={{ fontSize: 18, fontWeight: 600, color: C.navy, marginBottom: 8 }}>
            RunPayway™ is the first system built to measure it.
          </p>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.teal }}>
            This is the standard for income stability.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 3 — WHAT WE MEASURE                                      */
/* ================================================================ */

function WhatWeMeasure() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t) }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 24, ...fadeIn(visible) }}>
          What we measure &mdash; and&nbsp;why.
        </h2>
        <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 16, ...fadeIn(visible, 60) }}>
          Credit scores measure borrowing behavior. Advisors manage accumulated assets. But nobody measures how income itself is&nbsp;built.
        </p>
        <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 24, ...fadeIn(visible, 80) }}>
          RunPayway™ evaluates six key dimensions of income and produces a score from 0&ndash;100 that shows how it behaves under real-world conditions:
        </p>
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: m ? 12 : 16, marginBottom: 32, ...fadeIn(visible, 120) }}>
          {[
            { label: "Disruption", desc: "A client leaves or a contract ends", color: "#C74634" },
            { label: "Delay", desc: "Pipeline stalls or payments are late", color: "#D0A23A" },
            { label: "Dependency", desc: "Too much relies on one source", color: "#4B3FAE" },
            { label: "Inactivity", desc: "You step away or can\u2019t work", color: C.teal },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 18px", borderRadius: 12, backgroundColor: C.white, borderLeft: `4px solid ${item.color}`, marginBottom: m ? 8 : 0, boxShadow: "0 2px 8px rgba(14,26,43,0.04)" }}>
              <div>
                <span style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>{item.label}</span>
                <span style={{ fontSize: 15, color: C.textSecondary }}> &mdash; {item.desc}</span>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 16, fontWeight: 600, color: C.navy, ...fadeIn(visible, 180) }}>
          Every result is produced under fixed rules. Same inputs, same score. Every&nbsp;time.
        </p>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 4 — WHO IT'S FOR                                          */
/* ================================================================ */

function WhoItsFor() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto", display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
        <div style={{ marginBottom: m ? 32 : 0, ...fadeIn(visible) }}>
          <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>WHO IT&rsquo;S FOR</div>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy }}>
            For Income That Depends{m ? " " : <br />}on Decisions &mdash;{m ? " " : <br />}Not Guarantees.
          </h2>
        </div>
        <div style={{ ...fadeIn(visible, 100) }}>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 24 }}>
            RunPayway™ is designed for individuals whose income is not fixed:
          </p>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, marginBottom: 32 }}>
            {[
              "Consultants",
              "Business owners",
              "Freelancers",
              "Commission-based professionals",
              "Operators with variable income",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 4 }}><path d="M20 6L9 17l-5-5"/></svg>
                <span style={{ fontSize: 18, color: C.textSecondary, lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>
            If your income changes based on what you do, this applies to you.
          </p>
        </div>
      </div>
    </section>
  );
}




/* ================================================================ */
/* SECTION 6 — TRUST SYSTEM                                          */
/* ================================================================ */

function SystemIntegrity() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t), position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 880, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.sandText, marginBottom: 12 }}>
            System Integrity: Same Rules, Every Time
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.sandMuted }}>
            RunPayway™ is a fixed-system model&mdash;no machine learning, no advisor judgment, no randomness.
          </p>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 24, ...fadeIn(visible, 100) }}>
          {/* Guarantees */}
          <div style={{ padding: m ? 24 : 28, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.04)", borderLeft: `3px solid ${C.teal}`, marginBottom: m ? 16 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: `${C.teal}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: C.teal }}>WHAT THE MODEL GUARANTEES</div>
            </div>
            {[
              "Same inputs always produce the same score",
              "No human override in scoring",
              "Nothing outside your answers affects the result",
              "Every assessment stamped with model version",
              "Scores under the same version are directly comparable",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
                <span style={{ color: C.teal, fontSize: 14, flexShrink: 0, marginTop: 1 }}>&#10003;</span>
                <span style={{ fontSize: 15, color: "rgba(244,241,234,0.65)", lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Exclusions */}
          <div style={{ padding: m ? 24 : 28, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.04)", borderLeft: "3px solid rgba(244,241,234,0.10)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(244,241,234,0.50)" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(244,241,234,0.40)" }}>WHAT THE MODEL DOES NOT DO</div>
            </div>
            {[
              "Access bank accounts or financial data",
              "Use machine learning or probability-based models",
              "Apply subjective judgment at any stage",
              "Make predictive claims about future income",
              "Provide financial, legal, or investment advice",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
                <span style={{ color: "rgba(244,241,234,0.25)", fontSize: 14, flexShrink: 0, marginTop: 1 }}>&times;</span>
                <span style={{ fontSize: 15, color: "rgba(244,241,234,0.50)", lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 7 — POSITIONING                                           */
/* ================================================================ */

function Positioning() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t) }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 16, ...fadeIn(visible) }}>
          RunPayway™ is a measurement system &mdash;{m ? " " : <br />}not a financial product.
        </h2>
        <p style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.6, color: C.teal, marginBottom: 24, ...fadeIn(visible, 60) }}>
          It measures what others assume.
        </p>
        <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 16, ...fadeIn(visible, 100) }}>
          It does not:
        </p>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 32, ...fadeIn(visible, 140) }}>
          {[
            "Make decisions for you",
            "Provide financial advice",
            "Interpret outcomes",
          ].map((line, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(14,26,43,0.30)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 4 }}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              <span style={{ fontSize: 18, color: C.textSecondary, lineHeight: 1.6 }}>{line}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 16, fontWeight: 600, color: C.navy, ...fadeIn(visible, 200) }}>
          You own your score. You decide what to do with it.
        </p>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 8 — FINAL CTA                                             */
/* ================================================================ */

function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 88 : 128, paddingBottom: m ? 88 : 128, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t) }}>
      <div style={{ maxWidth: explanatoryW, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: m ? 18 : 22, fontWeight: 400, lineHeight: 1.45, color: C.sandMuted, marginBottom: 12, ...fadeIn(visible) }}>
          Your income already has a structure.
        </p>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.sandText, marginBottom: 32, ...fadeIn(visible, 60) }}>
          Now you can see how it behaves&mdash;{m ? " " : <br />}and decide what to do next.
        </h2>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", ...fadeIn(visible, 160) }}>
          <Link href="/begin" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: m ? 56 : 60, width: m ? "100%" : "auto",
            padding: m ? "0 28px" : "0 32px",
            borderRadius: 16, backgroundColor: C.white, color: C.navy,
            fontSize: 16, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 8px 24px rgba(14,26,43,0.08)",
            border: `1px solid ${C.borderSoft}`,
            transition: "transform 200ms, box-shadow 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.08)"; }}>
            Get Your Income Stability Score
          </Link>
          <p style={{ fontSize: 14, fontWeight: 500, color: C.sandLight, marginTop: 16 }}>
            $69 &middot; Score, scripts, roadmap, and lifetime access
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* PAGE EXPORT                                                       */
/* ================================================================ */

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">
      <main>
        <HeroSection />
        <Declaration />
        <WhatWeMeasure />
        <WhoItsFor />
        <SystemIntegrity />
        <Positioning />
        <FinalCta />
      </main>
    </div>
  );
}
