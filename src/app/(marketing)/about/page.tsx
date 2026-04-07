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
const sectionPx = (m: boolean) => m ? 20 : 48;
const cardShadow = "0 10px 30px rgba(14,26,43,0.06)";


/* ================================================================ */
/* SECTION 1 — HERO                                                  */
/* ================================================================ */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <header ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 104 : 148, paddingBottom: m ? 56 : 72, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>
          ABOUT
        </div>
        <h1 style={{ fontSize: m ? 38 : 64, fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.035em", color: C.navy, marginBottom: 24, ...fadeIn(visible, 50) }}>
          The standard for measuring{m ? " " : <br />}Structural Income.
        </h1>
        <p style={{ fontSize: m ? 18 : 22, fontWeight: 400, lineHeight: 1.5, color: C.textSecondary, maxWidth: narrowW, margin: "0 auto 16px", ...fadeIn(visible, 100) }}>
          RunPayway&#8482; produces the Income Stability Score&#8482; — a fixed measurement of how income is built and how it holds under pressure.
        </p>
        <p style={{ fontSize: m ? 16 : 18, fontWeight: 600, color: C.navy, ...fadeIn(visible, 150) }}>
          Not how much you earn. How your income behaves.
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
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto", display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
        <div style={{ marginBottom: m ? 32 : 0, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 44, fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.035em", color: C.navy }}>
            Income has always{m ? " " : <br />}been visible.{m ? " " : <br />}Its structure has not.
          </h2>
        </div>
        <div style={{ ...fadeIn(visible, 100) }}>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 24 }}>
            Financial systems measure:
          </p>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, marginBottom: 32 }}>
            {[
              "what you earn",
              "what you owe",
              "what you\u2019ve accumulated",
            ].map((line, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 9 }} />
                <span style={{ fontSize: 18, color: C.textSecondary, lineHeight: 1.6 }}>{line}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 32 }}>
            But not how income is built.
          </p>
          <p style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>
            RunPayway defines that measurement.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 3 — WHAT WE DO                                            */
/* ================================================================ */

function WhatWeDo() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>
          WHAT WE DO
        </div>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 24, ...fadeIn(visible, 50) }}>
          Measure how income holds under change.
        </h2>
        <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 24, ...fadeIn(visible, 100) }}>
          RunPayway evaluates six structural dimensions of income — not the amount.
        </p>
        <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 24, ...fadeIn(visible, 120) }}>
          The result is a score from 0 to 100 that shows how income behaves under real conditions:
        </p>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 32, ...fadeIn(visible, 150) }}>
          {["disruption", "delay", "dependency", "inactivity"].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 9 }} />
              <span style={{ fontSize: 18, color: C.textSecondary, lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 16, fontWeight: 600, color: C.navy, ...fadeIn(visible, 200) }}>
          Every result is produced under fixed rules.
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
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto", display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
        <div style={{ marginBottom: m ? 32 : 0, ...fadeIn(visible) }}>
          <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>WHO IT&rsquo;S FOR</div>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy }}>
            For income that depends{m ? " " : <br />}on decisions —{m ? " " : <br />}not guarantees.
          </h2>
        </div>
        <div style={{ ...fadeIn(visible, 100) }}>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 24 }}>
            RunPayway is built for individuals whose income is not fixed:
          </p>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, marginBottom: 32 }}>
            {[
              "consultants",
              "business owners",
              "freelancers",
              "commission-based professionals",
              "operators with variable income",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 9 }} />
                <span style={{ fontSize: 18, color: C.textSecondary, lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>
            If your income changes based on what you do, this applies.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 5 — WHY IT EXISTS                                         */
/* ================================================================ */

function WhyItExists() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 80 : 140, paddingBottom: m ? 80 : 140, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>
          WHY IT EXISTS
        </div>
        <h2 style={{ fontSize: m ? 28 : 44, fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.035em", color: C.navy, marginBottom: 32, ...fadeIn(visible, 50) }}>
          A missing measurement.
        </h2>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 16, marginBottom: 32, ...fadeIn(visible, 100) }}>
          {[
            "Credit scores measure borrowing behavior.",
            "Advisors manage accumulated assets.",
            "Income is tracked — but not evaluated structurally.",
          ].map((line, i) => (
            <p key={i} style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, margin: 0 }}>{line}</p>
          ))}
        </div>
        <p style={{ fontSize: 16, fontWeight: 600, color: C.navy, ...fadeIn(visible, 180) }}>
          RunPayway measures how income is built — and whether it holds.
        </p>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 6 — TRUST SYSTEM                                          */
/* ================================================================ */

function TrustSystem() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const pillars = [
    { title: "Consistent", desc: "Same inputs always produce the same score. No variation." },
    { title: "Versioned", desc: "Each model is fixed. If rules change, the version changes." },
    { title: "Private", desc: "No bank connection. No credit pull. No data sharing." },
    { title: "Deterministic", desc: "No AI in scoring. No subjective judgment. Fixed rules only." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy }}>
            Designed for consistency —{m ? " " : <br />}not interpretation.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 24, ...fadeIn(visible, 100) }}>
          {pillars.map((item, i) => (
            <div key={i} style={{ padding: 24, borderRadius: 12, border: `1px solid rgba(14,26,43,0.06)` }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 8 }}>{item.title}</div>
              <p style={{ fontSize: 15, fontWeight: 400, color: C.textSecondary, lineHeight: 1.55, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
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
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 24, ...fadeIn(visible) }}>
          A measurement system —{m ? " " : <br />}not a financial product.
        </h2>
        <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 24, ...fadeIn(visible, 80) }}>
          RunPayway defines how income stability is measured.
        </p>
        <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 24, ...fadeIn(visible, 100) }}>
          It does not:
        </p>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 32, ...fadeIn(visible, 140) }}>
          {[
            "provide financial advice",
            "make decisions",
            "interpret outcomes",
          ].map((line, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 9 }} />
              <span style={{ fontSize: 18, color: C.textSecondary, lineHeight: 1.6 }}>{line}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 16, fontWeight: 600, color: C.navy, ...fadeIn(visible, 200) }}>
          The score belongs entirely to the individual.
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
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 88 : 128, paddingBottom: m ? 88 : 128, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: explanatoryW, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 34 : 52, fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.035em", color: C.sandText, marginBottom: 20, ...fadeIn(visible) }}>
          Your income already{m ? " " : <br />}has a structure.
        </h2>
        <p style={{ fontSize: m ? 20 : 24, fontWeight: 400, lineHeight: 1.45, color: C.sandMuted, marginBottom: 32, ...fadeIn(visible, 80) }}>
          Now you can see how it behaves — and decide what to do next.
        </p>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", ...fadeIn(visible, 160) }}>
          <Link href="/begin" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: m ? 56 : 60, width: m ? "100%" : "auto",
            padding: m ? "0 28px" : "0 32px",
            borderRadius: 14, backgroundColor: C.white, color: C.navy,
            fontSize: 18, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 8px 24px rgba(14,26,43,0.08)",
            border: `1px solid ${C.borderSoft}`,
            transition: "transform 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
            Begin assessment
          </Link>
          <p style={{ fontSize: 14, fontWeight: 400, color: C.sandLight, marginTop: 16 }}>
            Under 2 minutes &bull; Instant result &bull; Private by default
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
        <WhatWeDo />
        <WhoItsFor />
        <WhyItExists />
        <TrustSystem />
        <Positioning />
        <FinalCta />
      </main>
    </div>
  );
}
