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
const muted = "rgba(14,26,43,0.55)";
const light = "rgba(14,26,43,0.38)";
const contentW = 1040;
const secPad = (m: boolean) => m ? 56 : 112;
const px = (m: boolean) => m ? 20 : 24;


/* ================================================================== */
/* SECTION 1 — HERO                                                    */
/* ================================================================== */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <header ref={ref} style={{ backgroundColor: C.navy, position: "relative", overflow: "hidden", paddingTop: m ? 80 : 140, paddingBottom: m ? 56 : 100, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-30%", left: "-15%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${C.teal}05 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 780, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 20, ...fadeIn(visible) }}>About RunPayway&#8482;</div>
        <h1 style={{ fontSize: m ? 36 : 52, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.03em", color: "#F4F1EA", marginBottom: 28, ...fadeIn(visible, 80) }}>
          The standard for measuring income structure.
        </h1>
        <p style={{ fontSize: 17, color: "rgba(244,241,234,0.55)", lineHeight: 1.65, maxWidth: 560, ...fadeIn(visible, 180) }}>
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
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 48 : 72, paddingBottom: m ? 48 : 72, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", ...fadeIn(visible) }}>
        <div style={{ padding: "28px 36px", borderRadius: 16, backgroundColor: C.white, border: `1px solid ${C.border}`, display: "inline-block", boxShadow: "0 1px 4px rgba(14,26,43,0.03)" }}>
          <p style={{ fontSize: m ? 18 : 24, fontWeight: 500, color: C.navy, lineHeight: 1.4, margin: 0 }}>
            The Income Stability Score&#8482; measures how your income structure performs under disruption.
          </p>
        </div>
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
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 24, ...fadeIn(visible) }}>What the score measures</h2>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 16, ...fadeIn(visible, 60) }}>A number from 0 to 100 that evaluates the structural durability of your income.</p>
        <p style={{ fontSize: 18, fontWeight: 500, color: C.navy, lineHeight: 1.55, marginBottom: 28, ...fadeIn(visible, 100) }}>It answers one question: if conditions change, how well does your income hold up?</p>

        <div style={{ marginBottom: 28, ...fadeIn(visible, 140) }}>
          <p style={{ fontSize: 15, color: light, lineHeight: 1.65, marginBottom: 8 }}>Unlike credit scores, which measure borrowing history, or income verification, which confirms past earnings,</p>
          <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 20 }}>RunPayway&#8482; evaluates how income is built:</p>
          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 10 }}>
            {["how many sources contribute", "how predictable it is", "how much continues without active work", "how far forward it is secured"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, backgroundColor: "#FAFAFA", border: `1px solid ${C.border}` }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
                <span style={{ fontSize: 15, color: C.navy }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "20px 28px", borderRadius: 14, backgroundColor: "#FAFAFA", border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.teal}`, ...fadeIn(visible, 220) }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, marginBottom: 4 }}>The result is a deterministic structural assessment.</p>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, margin: 0 }}>The same inputs always produce the same score.</p>
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
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 24, ...fadeIn(visible) }}>Who this applies to</h2>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 28, ...fadeIn(visible, 60) }}>Anyone whose income is not structurally guaranteed.</p>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, ...fadeIn(visible, 120) }}>
          {["Independent contractors and freelancers", "Commission-based professionals", "Small business owners", "Consultants and advisors", "Anyone with multiple income sources"].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderRadius: 12, backgroundColor: C.white, border: `1px solid ${C.border}` }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: C.teal, flexShrink: 0 }} />
              <span style={{ fontSize: 16, color: C.navy }}>{item}</span>
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
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m), position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 500, height: 500, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#F4F1EA", marginBottom: 24, ...fadeIn(visible) }}>Why this matters</h2>
        <p style={{ fontSize: 17, color: "rgba(244,241,234,0.55)", lineHeight: 1.65, marginBottom: 8, ...fadeIn(visible, 80) }}>Income is not tested when it is stable.</p>
        <p style={{ fontSize: 17, color: "rgba(244,241,234,0.55)", lineHeight: 1.65, marginBottom: 28, ...fadeIn(visible, 120) }}>It is tested when conditions change.</p>
        <p style={{ fontSize: 18, fontWeight: 500, color: "#F4F1EA", lineHeight: 1.5, ...fadeIn(visible, 200) }}>
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
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 24, ...fadeIn(visible) }}>The model is fixed and versioned</h2>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 16, ...fadeIn(visible, 60) }}>Every version of the scoring model is locked.</p>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 28, ...fadeIn(visible, 100) }}>If any rule, threshold, or classification changes, the model increments to a new version.</p>
        <div style={{ padding: "24px 28px", borderRadius: 14, backgroundColor: "#FAFAFA", border: `1px solid ${C.border}`, marginBottom: 20, ...fadeIn(visible, 160) }}>
          <p style={{ fontSize: 16, color: muted, lineHeight: 1.6, marginBottom: 8 }}>Scores produced under the same version are directly comparable.</p>
          <p style={{ fontSize: 16, color: muted, lineHeight: 1.6, margin: 0 }}>If the rules change, it becomes a different model.</p>
        </div>
        <div style={{ padding: "18px 24px", borderRadius: 12, backgroundColor: C.white, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.teal}`, display: "inline-block", ...fadeIn(visible, 220) }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, margin: 0 }}>Each assessment is stamped with the model version that produced it.</p>
        </div>
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
  const items = [
    { label: "SHA-256 hash", icon: "M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" },
    { label: "Model version stamp", icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" },
    { label: "Immutable timestamp", icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
    { label: "QR verification", icon: "M4 4h4v4H4V4zm12 0h4v4h-4V4zM4 16h4v4H4v-4zm16 0v4h-4v-4h4zM14 4v4h-4V4h4zm-4 8h4v4h-4v-4zm8-4v4h-4V8h4z" },
  ];
  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 24, ...fadeIn(visible) }}>Every score is verifiable</h2>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 28, ...fadeIn(visible, 60) }}>Each assessment includes:</p>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 28, ...fadeIn(visible, 120) }}>
          {items.map((item, i) => (
            <div key={i} style={{ padding: "18px 16px", borderRadius: 14, backgroundColor: C.white, border: `1px solid ${C.border}`, textAlign: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: `${C.teal}08`, border: `1px solid ${C.teal}10`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{item.label}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 20, ...fadeIn(visible, 180) }}>
          These elements confirm the score was produced by the stated model and has not been altered.
        </p>
        <p style={{ fontSize: 17, fontWeight: 500, color: C.navy, ...fadeIn(visible, 240) }}>
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
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 24, ...fadeIn(visible) }}>Where it can be used</h2>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 28, ...fadeIn(visible, 60) }}>The score can be shared and verified independently.</p>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 14, ...fadeIn(visible, 120) }}>
          {[
            { title: "Lenders and underwriters", icon: "M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0H5m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4" },
            { title: "Employers and hiring managers", icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" },
            { title: "Financial advisors", icon: "M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6M15 19v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6M9 13V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v8" },
            { title: "Business partners", icon: "M21 13.255A23.193 23.193 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2m4 6h.01M5 20h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 22px", borderRadius: 14, border: `1px solid ${C.border}`, backgroundColor: "#FAFAFA" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: `${C.navy}06`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
              </div>
              <span style={{ fontSize: 16, fontWeight: 500, color: C.navy }}>{item.title}</span>
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
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 24, ...fadeIn(visible) }}>Why this exists</h2>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 8, ...fadeIn(visible, 60) }}>Credit scores measure borrowing history.</p>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 20, ...fadeIn(visible, 80) }}>Income verification confirms past earnings.</p>
        <p style={{ fontSize: 18, fontWeight: 500, color: C.navy, lineHeight: 1.55, marginBottom: 28, ...fadeIn(visible, 140) }}>
          But nothing measured the structural durability of how income is built.
        </p>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 28, ...fadeIn(visible, 180) }}>RunPayway&#8482; was created to define that standard.</p>
        <div style={{ padding: "24px 28px", borderRadius: 14, backgroundColor: C.white, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.teal}`, boxShadow: "0 1px 4px rgba(14,26,43,0.03)", ...fadeIn(visible, 240) }}>
          <p style={{ fontSize: 16, color: muted, lineHeight: 1.6, marginBottom: 8 }}>The score is private by default. No bank connection. No credit pull.</p>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, margin: 0 }}>It belongs entirely to the individual who takes it.</p>
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
  const principles = [
    { title: "Versioned", desc: "Locked scoring model.", icon: "M7 21a4 4 0 0 1-4-4V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12a4 4 0 0 1-4 4zm0 0h12a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 0 1 2.828 0l2.829 2.829a2 2 0 0 1 0 2.828l-8.486 8.485M7 17h.01" },
    { title: "Deterministic", desc: "Same inputs \u2192 same score.", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15" },
    { title: "Multi-industry", desc: "Applies across income types.", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
    { title: "Verifiable", desc: "Every result can be confirmed.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  ];
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>System principles</h2>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 16, ...fadeIn(visible, 100) }}>
          {principles.map((p, i) => (
            <div key={i} style={{ textAlign: "center", padding: m ? 20 : 28, borderRadius: 14, backgroundColor: "#FAFAFA", border: `1px solid ${C.border}` }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: `${C.navy}06`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={p.icon} /></svg>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 6 }}>{p.title}</div>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.55, margin: 0 }}>{p.desc}</p>
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
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: px(m), paddingRight: px(m), position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 500, height: 500, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: m ? 32 : 44, fontWeight: 600, lineHeight: 1.12, letterSpacing: "-0.02em", color: "#F4F1EA", marginBottom: 20, ...fadeIn(visible) }}>
          Now apply the system to your own structure.
        </h2>
        <p style={{ fontSize: 17, color: "rgba(244,241,234,0.50)", lineHeight: 1.65, marginBottom: 36, ...fadeIn(visible, 80) }}>
          The assessment takes under 2 minutes. Every result is generated from your inputs.
        </p>
        <div style={{ ...fadeIn(visible, 180) }}>
          <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 56, padding: "0 48px", borderRadius: 12, backgroundColor: C.white, color: C.navy, fontSize: 17, fontWeight: 600, textDecoration: "none", transition: "background-color 200ms, box-shadow 200ms", boxShadow: "0 2px 16px rgba(244,241,234,0.10)" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#E8E5DE"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(244,241,234,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; e.currentTarget.style.boxShadow = "0 2px 16px rgba(244,241,234,0.10)"; }}>
            Start Your Free Assessment
          </Link>
          <p style={{ fontSize: 13, color: "rgba(244,241,234,0.30)", marginTop: 16, letterSpacing: "0.03em" }}>Under 2 minutes &bull; Instant result &bull; $69 for full report</p>
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
