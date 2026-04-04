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
    reduced ? {} : { opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(8px)", transition: `opacity 400ms ease-out ${delay}ms, transform 400ms ease-out ${delay}ms` };
}

/* ================================================================== */
/* DESIGN SYSTEM (LOCKED)                                              */
/* ================================================================== */

const C = { navy: "#0E1A2B", purple: "#4B3FAE", teal: "#1F6D7A", sand: "#F4F1EA", white: "#FFFFFF", border: "#E5E7EB" };
const muted = "rgba(14,26,43,0.55)";
const light = "rgba(14,26,43,0.38)";
const contentW = 1040;
const secPad = (m: boolean) => m ? 48 : 96;
const px = (m: boolean) => m ? 20 : 24;


/* ================================================================== */
/* SECTION 1 — HERO                                                    */
/* ================================================================== */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <header ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 80 : 120, paddingBottom: m ? 48 : 80, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>
          About RunPayway&#8482;
        </div>
        <h1 style={{ fontSize: m ? 36 : 48, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.sand, marginBottom: 20, ...fadeIn(visible, 80) }}>
          The standard for measuring income structure.
        </h1>
        <p style={{ fontSize: 16, color: "rgba(244,241,234,0.55)", lineHeight: 1.65, ...fadeIn(visible, 160) }}>
          RunPayway&#8482; produces the Income Stability Score&#8482; — a deterministic structural assessment of how income holds under change.
        </p>
      </div>
    </header>
  );
}


/* ================================================================== */
/* SECTION 2 — ONE-LINE DEFINITION                                     */
/* ================================================================== */

function OneLineDefinition() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 40 : 64, paddingBottom: m ? 40 : 64, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", ...fadeIn(visible) }}>
        <p style={{ fontSize: m ? 18 : 22, fontWeight: 500, color: C.navy, lineHeight: 1.5, margin: 0 }}>
          The Income Stability Score&#8482; measures how your income structure performs under disruption.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3 — WHAT THE SCORE MEASURES                                 */
/* ================================================================== */

function WhatTheScoreMeasures() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.navy, marginBottom: 20, ...fadeIn(visible) }}>
          What the score measures
        </h2>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 16, ...fadeIn(visible, 60) }}>
          A number from 0 to 100 that evaluates the structural durability of your income.
        </p>
        <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, lineHeight: 1.65, marginBottom: 24, ...fadeIn(visible, 100) }}>
          It answers one question: if conditions change, how well does your income hold up?
        </p>

        <div style={{ marginBottom: 24, ...fadeIn(visible, 140) }}>
          <p style={{ fontSize: 15, color: light, lineHeight: 1.65, marginBottom: 8 }}>
            Unlike credit scores, which measure borrowing history, or income verification, which confirms past earnings,
          </p>
          <p style={{ fontSize: 15, color: muted, lineHeight: 1.65, marginBottom: 16 }}>
            RunPayway&#8482; evaluates how income is built:
          </p>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {["how many sources contribute", "how predictable it is", "how much continues without active work", "how far forward it is secured"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
                <span style={{ fontSize: 15, color: C.navy }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...fadeIn(visible, 200) }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, marginBottom: 4 }}>The result is a deterministic structural assessment.</p>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.navy }}>The same inputs always produce the same score.</p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 4 — WHO THIS APPLIES TO                                     */
/* ================================================================== */

function WhoThisAppliesTo() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.navy, marginBottom: 20, ...fadeIn(visible) }}>
          Who this applies to
        </h2>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 24, ...fadeIn(visible, 60) }}>
          Anyone whose income is not structurally guaranteed.
        </p>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, ...fadeIn(visible, 120) }}>
          {[
            "Independent contractors and freelancers",
            "Commission-based professionals",
            "Small business owners",
            "Consultants and advisors",
            "Anyone with multiple income sources",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
              <span style={{ fontSize: 15, color: C.navy }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 5 — WHY THIS MATTERS                                        */
/* ================================================================== */

function WhyThisMatters() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.navy, marginBottom: 20, ...fadeIn(visible) }}>
          Why this matters
        </h2>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 8, ...fadeIn(visible, 80) }}>
          Income is not tested when it is stable.
        </p>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 24, ...fadeIn(visible, 120) }}>
          It is tested when conditions change.
        </p>
        <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, lineHeight: 1.55, ...fadeIn(visible, 180) }}>
          RunPayway&#8482; measures how your structure responds before that happens.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 6 — MODEL STRUCTURE                                         */
/* ================================================================== */

function ModelStructure() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.navy, marginBottom: 20, ...fadeIn(visible) }}>
          The model is fixed and versioned
        </h2>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 16, ...fadeIn(visible, 60) }}>
          Every version of the scoring model is locked.
        </p>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 24, ...fadeIn(visible, 100) }}>
          If any rule, threshold, or classification changes, the model increments to a new version.
        </p>
        <div style={{ padding: "16px 20px", borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: C.white, marginBottom: 16, ...fadeIn(visible, 140) }}>
          <p style={{ fontSize: 15, color: muted, lineHeight: 1.6, margin: "0 0 8px" }}>
            Scores produced under the same version are directly comparable.
          </p>
          <p style={{ fontSize: 15, color: muted, lineHeight: 1.6, margin: 0 }}>
            If the rules change, it becomes a different model.
          </p>
        </div>
        <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, ...fadeIn(visible, 180) }}>
          Each assessment is stamped with the model version that produced it.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 7 — VERIFIABILITY                                           */
/* ================================================================== */

function Verifiability() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.navy, marginBottom: 20, ...fadeIn(visible) }}>
          Every score is verifiable
        </h2>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 20, ...fadeIn(visible, 60) }}>
          Each assessment includes:
        </p>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 24, ...fadeIn(visible, 100) }}>
          {["SHA-256 hash", "Model version stamp", "Immutable timestamp", "QR verification"].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
              <span style={{ fontSize: 15, color: C.navy }}>{item}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 15, color: muted, lineHeight: 1.65, marginBottom: 24, ...fadeIn(visible, 140) }}>
          These elements confirm the score was produced by the stated model and has not been altered.
        </p>
        <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, ...fadeIn(visible, 180) }}>
          This is how institutional trust is established — through verifiable outputs, not claims.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 8 — WHERE IT CAN BE USED                                    */
/* ================================================================== */

function WhereItCanBeUsed() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.navy, marginBottom: 20, ...fadeIn(visible) }}>
          Where it can be used
        </h2>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 24, ...fadeIn(visible, 60) }}>
          The score can be shared and verified independently.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 12, ...fadeIn(visible, 120) }}>
          {[
            "Lenders and underwriters",
            "Employers and hiring managers",
            "Financial advisors",
            "Business partners",
          ].map((item, i) => (
            <div key={i} style={{ padding: "14px 18px", borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: C.white }}>
              <span style={{ fontSize: 15, color: C.navy }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 9 — WHY THIS EXISTS                                         */
/* ================================================================== */

function WhyThisExists() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.navy, marginBottom: 20, ...fadeIn(visible) }}>
          Why this exists
        </h2>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 8, ...fadeIn(visible, 60) }}>
          Credit scores measure borrowing history.
        </p>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 16, ...fadeIn(visible, 80) }}>
          Income verification confirms past earnings.
        </p>
        <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, lineHeight: 1.65, marginBottom: 24, ...fadeIn(visible, 120) }}>
          But nothing measured the structural durability of how income is built.
        </p>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 24, ...fadeIn(visible, 160) }}>
          RunPayway&#8482; was created to define that standard.
        </p>
        <div style={{ padding: "16px 20px", borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: "#FAFAFA", ...fadeIn(visible, 200) }}>
          <p style={{ fontSize: 15, color: muted, lineHeight: 1.6, marginBottom: 4 }}>
            The score is private by default. No bank connection. No credit pull.
          </p>
          <p style={{ fontSize: 15, fontWeight: 500, color: C.navy, margin: 0 }}>
            It belongs entirely to the individual who takes it.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 10 — SYSTEM PRINCIPLES                                      */
/* ================================================================== */

function SystemPrinciples() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.navy, textAlign: "center", marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>
          System principles
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 16, ...fadeIn(visible, 100) }}>
          {[
            { title: "Versioned", desc: "Locked scoring model." },
            { title: "Deterministic", desc: "Same inputs \u2192 same score." },
            { title: "Multi-industry", desc: "Applies across income types." },
            { title: "Verifiable", desc: "Every result can be confirmed." },
          ].map((p, i) => (
            <div key={i} style={{ textAlign: "center", padding: m ? 16 : 24 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 6 }}>{p.title}</div>
              <p style={{ fontSize: 13, color: muted, lineHeight: 1.55, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 11 — FINAL CTA                                              */
/* ================================================================== */

function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 64 : 96, paddingBottom: m ? 64 : 96, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.sand, marginBottom: 16, ...fadeIn(visible) }}>
          Now apply the system to your own structure.
        </h2>
        <p style={{ fontSize: 16, color: "rgba(244,241,234,0.55)", lineHeight: 1.65, marginBottom: 32, ...fadeIn(visible, 80) }}>
          The assessment takes under 2 minutes. Every result is generated from your inputs.
        </p>
        <div style={{ ...fadeIn(visible, 160) }}>
          <Link href="/pricing" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: 52, padding: "0 40px", borderRadius: 10,
            backgroundColor: C.white, color: C.navy,
            fontSize: 16, fontWeight: 600, textDecoration: "none",
            transition: "background-color 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#E8E5DE"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; }}>
            Start Your Free Assessment
          </Link>
          <p style={{ fontSize: 13, color: "rgba(244,241,234,0.38)", marginTop: 14 }}>
            Under 2 minutes &bull; Instant result &bull; $69 for full report
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* PAGE EXPORT                                                         */
/* ================================================================== */

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">
      <main>
        <HeroSection />
        <OneLineDefinition />
        <WhatTheScoreMeasures />
        <WhoThisAppliesTo />
        <WhyThisMatters />
        <ModelStructure />
        <Verifiability />
        <WhereItCanBeUsed />
        <WhyThisExists />
        <SystemPrinciples />
        <FinalCta />
      </main>
    </div>
  );
}
