"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { trackPurchaseClick } from "@/lib/analytics";

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
  purple: "#4B3FAE",
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

const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';
const innerW = 1120;
const narrowW = 720;
const explanatoryW = 640;
const sectionPx = (m: boolean) => m ? 20 : 48;
const cardShadow = "0 10px 30px rgba(14,26,43,0.06)";
const ctaShadow = "0 8px 24px rgba(14,26,43,0.12)";
const STRIPE = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL || "https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05";
const STRIPE_ANNUAL = process.env.NEXT_PUBLIC_STRIPE_ANNUAL_URL || "https://buy.stripe.com/14A14fbB67MIcZQ3EB2Nq06";


/* ================================================================ */
/* SECTION 1 — HERO                                                  */
/* ================================================================ */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <header ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 104 : 152, paddingBottom: m ? 56 : 88, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>
          PRICING
        </div>
        <h1 style={{ fontSize: m ? 38 : 56, fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.035em", color: C.navy, marginBottom: 24, ...fadeIn(visible, 50) }}>
          Start with the score.{m ? " " : <br />}Unlock what changes it.
        </h1>
        <p style={{ fontSize: m ? 18 : 20, fontWeight: 400, lineHeight: 1.55, color: C.textSecondary, maxWidth: 580, margin: "0 auto 16px", ...fadeIn(visible, 100) }}>
          RunPayway reveals how your income is built — and whether it holds under pressure.
        </p>
        <p style={{ fontSize: m ? 16 : 17, fontWeight: 500, color: C.navy, lineHeight: 1.55, marginBottom: 0, ...fadeIn(visible, 140) }}>
          The score is free. The diagnostic shows what determines it.
        </p>
        <p style={{ fontSize: 14, fontWeight: 500, color: C.textMuted, marginTop: 20, ...fadeIn(visible, 180) }}>
          No financial accounts. No credit pull. Private by default.
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
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, textAlign: "center", marginBottom: 24, ...fadeIn(visible) }}>
          The system stays fixed.{m ? " " : <br />}Your level of visibility changes.
        </h2>
        <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, textAlign: "center", marginBottom: 24, ...fadeIn(visible, 80) }}>
          Every user is evaluated using the same model.
        </p>
        <p style={{ fontSize: 17, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, textAlign: "center", marginBottom: 32, ...fadeIn(visible, 120) }}>
          What changes is how deeply you can see:
        </p>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, maxWidth: 420, margin: "0 auto 32px", ...fadeIn(visible, 160) }}>
          {[
            "what defines your score",
            "what limits your structure",
            "what moves it forward",
          ].map((line, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 9 }} />
              <span style={{ fontSize: 17, color: C.textSecondary, lineHeight: 1.6 }}>{line}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 16, fontWeight: 600, color: C.navy, textAlign: "center", ...fadeIn(visible, 200) }}>
          The rules do not change. Your access does.
        </p>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 3 — PRICING CARDS                                         */
/* ================================================================ */

function PricingCards() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const check = (text: string, color = C.teal) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
      <span style={{ color, fontSize: 14, flexShrink: 0, marginTop: 2 }}>&#10003;</span>
      <span style={{ fontSize: 15, lineHeight: 1.55, color: "inherit" }}>{text}</span>
    </div>
  );

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto" }}>
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, alignItems: "start", ...fadeIn(visible) }}>

          {/* ─── FREE SCORE ─── */}
          <div style={{ backgroundColor: C.white, borderRadius: 18, padding: m ? 28 : 32, boxShadow: cardShadow, display: "flex", flexDirection: "column" as const, marginBottom: m ? 20 : 0, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: C.teal }} />
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal, marginTop: 4, marginBottom: 20 }}>
              Income Stability Score&#8482;
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 48, fontWeight: 600, fontFamily: mono, color: C.navy, lineHeight: 1 }}>$0</span>
            </div>
            <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 24 }}>always available</div>
            <p style={{ fontSize: 15, fontWeight: 500, color: C.navy, lineHeight: 1.5, marginBottom: 24 }}>
              Your baseline measurement. No cost. No commitment.
            </p>
            <div style={{ marginBottom: 28, flex: 1, color: C.textSecondary }}>
              {check("Structural Income Score (0\u2013100)")}
              {check("Stability classification")}
              {check("Primary structural risk")}
              {check("Distance to next level")}
              {check("Industry-relative position")}
            </div>
            <Link href="/begin" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: 56, borderRadius: 14,
              backgroundColor: C.white, color: C.navy,
              border: `1px solid ${C.borderSoft}`,
              fontSize: 16, fontWeight: 600, textDecoration: "none",
              transition: "background-color 200ms",
            }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.sand; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; }}>
              Get Your Free Score
            </Link>
            <p style={{ fontSize: 13, color: C.textMuted, textAlign: "center", marginTop: 12, marginBottom: 0 }}>
              Takes under 2 minutes. No account. No financial access.
            </p>
            <p style={{ fontSize: 13, fontWeight: 600, color: C.navy, textAlign: "center", marginTop: 10, marginBottom: 0 }}>
              Most people have never measured this.
            </p>
          </div>

          {/* ─── DIAGNOSTIC (PRIMARY) ─── */}
          <div style={{ backgroundColor: C.white, borderRadius: 18, padding: m ? 28 : 32, display: "flex", flexDirection: "column" as const, position: "relative" as const, overflow: "hidden", boxShadow: "0 12px 40px rgba(14,26,43,0.10)", transform: m ? "none" : "scale(1.03)", border: `1px solid rgba(14,26,43,0.08)` }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${C.purple}, ${C.teal})` }} />
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.purple, marginTop: 4, marginBottom: 20 }}>
              RunPayway&#8482; Diagnostic
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 48, fontWeight: 600, fontFamily: mono, color: C.navy, lineHeight: 1 }}>$69</span>
            </div>
            <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 20 }}>one-time access</div>
            <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, lineHeight: 1.55, marginBottom: 12 }}>
              See exactly what defines your score — and what changes it.
            </p>
            <p style={{ fontSize: 14, fontWeight: 500, color: C.teal, marginBottom: 24 }}>
              This is where most users realize what they&rsquo;ve been missing.
            </p>
            <div style={{ marginBottom: 20, flex: 1, color: C.textSecondary }}>
              {check("Identify where your income holds — and where it breaks")}
              {check("See what actually limits your stability")}
              {check("Get exact scripts tied to your situation")}
              {check("Follow a 12-week plan built from your inputs")}
              {check("Know the single move that shifts your structure fastest")}
              {check("Test changes before you make them")}
            </div>

            {/* What changes after unlock */}
            <div style={{ borderTop: `1px solid rgba(14,26,43,0.06)`, paddingTop: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", color: C.navy, marginBottom: 12 }}>WHAT CHANGES AFTER YOU UNLOCK THIS</div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                {[
                  "You stop guessing what matters",
                  "You stop reacting to income drops",
                  "You start improving structure intentionally",
                ].map((line, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.purple, flexShrink: 0, marginTop: 7 }} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: C.textSecondary, lineHeight: 1.45 }}>{line}</span>
                  </div>
                ))}
              </div>
            </div>

            <a href={STRIPE} onClick={() => trackPurchaseClick("diagnostic_69")} style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: 60, borderRadius: 14,
              backgroundColor: C.navy, color: C.white,
              fontSize: 18, fontWeight: 600, textDecoration: "none",
              boxShadow: ctaShadow,
              transition: "transform 200ms, box-shadow 200ms",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
              Unlock Full Diagnostic &mdash; $69
            </a>
            <p style={{ fontSize: 14, fontWeight: 500, color: C.textMuted, textAlign: "center", marginTop: 14, marginBottom: 0 }}>
              One payment. Lifetime access.
            </p>
            <p style={{ fontSize: 14, fontWeight: 600, color: C.teal, textAlign: "center", marginTop: 8, marginBottom: 0 }}>
              If it doesn&rsquo;t reveal something new, you don&rsquo;t pay.
            </p>
          </div>

          {/* ─── MONITORING ─── */}
          <div style={{ backgroundColor: C.navy, borderRadius: 18, padding: m ? 28 : 32, display: "flex", flexDirection: "column" as const, position: "relative" as const, overflow: "hidden", marginTop: m ? 20 : 0 }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal, marginTop: 4, marginBottom: 20 }}>
              RunPayway&#8482; Monitoring
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 48, fontWeight: 600, fontFamily: mono, color: C.sandText, lineHeight: 1 }}>$149</span>
              <span style={{ fontSize: 14, color: C.sandLight, marginLeft: 8 }}>/year</span>
            </div>
            <div style={{ fontSize: 14, color: C.sandLight, marginBottom: 20 }}>ongoing visibility</div>
            <p style={{ fontSize: 15, fontWeight: 500, color: C.sandMuted, lineHeight: 1.55, marginBottom: 12 }}>
              Track how your income structure evolves over time.
            </p>
            <p style={{ fontSize: 14, fontWeight: 500, color: C.teal, marginBottom: 24 }}>
              Because structure changes — even when income doesn&rsquo;t.
            </p>
            <div style={{ marginBottom: 20, flex: 1, color: "rgba(244,241,234,0.60)" }}>
              {check("Reassess your structure across the year", C.teal)}
              {check("Track how your score actually moves", C.teal)}
              {check("See what improved — and what didn\u2019t", C.teal)}
              {check("Compare your structure over time", C.teal)}
              {check("Maintain continuous visibility", C.teal)}
            </div>

            {/* Best for */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", color: C.sandLight, marginBottom: 12 }}>BEST FOR</div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
                {["Self-employed", "Variable income earners", "Anyone actively improving structure"].map((line, i) => (
                  <span key={i} style={{ fontSize: 14, fontWeight: 500, color: C.sandMuted, lineHeight: 1.45 }}>{line}</span>
                ))}
              </div>
            </div>

            <a href={STRIPE_ANNUAL} onClick={() => trackPurchaseClick("monitoring_149")} style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: 56, borderRadius: 14,
              backgroundColor: C.white, color: C.navy,
              fontSize: 16, fontWeight: 600, textDecoration: "none",
              transition: "transform 200ms, box-shadow 200ms",
              boxShadow: "0 2px 8px rgba(244,241,234,0.10)",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
              Start Monitoring &mdash; $149/year
            </a>
            <p style={{ fontSize: 13, color: C.sandMuted, textAlign: "center", marginTop: 12, marginBottom: 0 }}>
              Includes full diagnostic access.
            </p>
          </div>
        </div>

        {/* Cross-card strip */}
        <p style={{ fontSize: 14, fontWeight: 500, color: C.textMuted, textAlign: "center", marginTop: m ? 32 : 44, lineHeight: 1.6 }}>
          Every user is evaluated using the same fixed system.{m ? " " : <br />}Only your level of visibility changes.
        </p>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 4 — POSITIONING STRIP                                     */
/* ================================================================ */

function PositioningStrip() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, textAlign: "center", marginBottom: 24, ...fadeIn(visible) }}>
          This is not a subscription to software.
        </h2>
        <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, textAlign: "center", marginBottom: 32, ...fadeIn(visible, 80) }}>
          RunPayway is a measurement system.
        </p>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 16, maxWidth: 480, margin: "0 auto", ...fadeIn(visible, 140) }}>
          {[
            { bold: "The score", rest: "tells you where you stand." },
            { bold: "The diagnostic", rest: "shows what determines it." },
            { bold: "Monitoring", rest: "tracks how it changes." },
          ].map((line, i) => (
            <p key={i} style={{ fontSize: 17, color: C.textSecondary, lineHeight: 1.6, margin: 0, textAlign: "center" }}>
              <strong style={{ fontWeight: 600, color: C.navy }}>{line.bold}</strong> {line.rest}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 5 — WHAT YOU'RE ACTUALLY BUYING                           */
/* ================================================================ */

function OutcomesSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const outcomes = [
    { title: "Clarity", desc: "You see how your income behaves under pressure." },
    { title: "Structure", desc: "You understand what defines your stability." },
    { title: "Control", desc: "You know exactly what to change — and in what order." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy }}>
            What the diagnostic actually gives you
          </h2>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, ...fadeIn(visible, 100) }}>
          {outcomes.map((item, i) => (
            <div key={i} style={{ padding: m ? 28 : 32, borderRadius: 18, backgroundColor: C.white, boxShadow: cardShadow, marginBottom: m ? 16 : 0 }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.navy, marginBottom: 12, lineHeight: 1.35 }}>{item.title}</div>
              <p style={{ fontSize: 16, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Price justification */}
        <div style={{ textAlign: "center", marginTop: m ? 40 : 56, ...fadeIn(visible, 180) }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 8 }}>One decision can cost more than this.</p>
          <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.6, maxWidth: explanatoryW, margin: "0 auto" }}>
            Understanding your income structure before acting prevents mistakes that cost far more than the diagnostic.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 6 — SAMPLE REPORT CTA                                     */
/* ================================================================ */

function SampleReportCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 56 : 96, paddingBottom: m ? 56 : 96, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 24 : 32, fontWeight: 600, lineHeight: 1.12, letterSpacing: "-0.028em", color: C.navy, marginBottom: 24, ...fadeIn(visible) }}>
          See how the system reads income
        </h2>
        <Link href="/sample-report" style={{
          fontSize: 16, fontWeight: 600, color: C.teal, textDecoration: "none",
          display: "inline-flex", alignItems: "center", gap: 6, minHeight: 44,
          transition: "opacity 200ms",
          ...fadeIn(visible, 80),
        }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.7"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
          View a sample report &rarr;
        </Link>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 7 — FAQ                                                   */
/* ================================================================ */

function FaqSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "What do I get for free?", a: "A complete structural score and classification. No cost. No account required." },
    { q: "What does the $69 Diagnostic unlock?", a: "A full breakdown of what defines your score — and the exact actions that change it." },
    { q: "What is the Negotiation Playbook?", a: "Scripts based on your actual income structure, designed to improve stability." },
    { q: "How are roadmap milestones personalized?", a: "They are generated directly from your inputs — not templates or assumptions." },
    { q: "What does Monitoring include?", a: "Multiple assessments, change tracking, and visibility over time." },
    { q: "How is the score calculated?", a: "Using fixed rules applied consistently to your answers." },
    { q: "Do you access my bank or credit?", a: "No. RunPayway does not connect to financial accounts." },
    { q: "What if the diagnostic doesn\u2019t reveal anything new?", a: "You receive a full refund." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 24 : 32, fontWeight: 600, lineHeight: 1.12, letterSpacing: "-0.028em", color: C.navy, textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>
          Questions
        </h2>
        <div style={{ ...fadeIn(visible, 80) }}>
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} style={{ borderTop: `1px solid ${C.borderSoft}` }}>
                <button onClick={() => setOpenFaq(isOpen ? null : i)} aria-expanded={isOpen}
                  style={{ width: "100%", padding: "20px 0", minHeight: 48, display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: m ? 16 : 17, fontWeight: 500, color: C.navy, paddingRight: 16, lineHeight: 1.4 }}>{faq.q}</span>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, transition: "transform 200ms", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}>
                    <path d="M3 8h10" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M8 3v10" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                <div style={{ maxHeight: isOpen ? 200 : 0, overflow: "hidden", transition: "max-height 300ms ease" }}>
                  <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.65, margin: 0, paddingBottom: 24 }}>{faq.a}</p>
                </div>
              </div>
            );
          })}
          <div style={{ borderTop: `1px solid ${C.borderSoft}` }} />
        </div>
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
          Your income already has a structure.
        </h2>
        <p style={{ fontSize: m ? 20 : 24, fontWeight: 400, lineHeight: 1.45, color: C.sandMuted, marginBottom: 32, ...fadeIn(visible, 80) }}>
          Now you can see it clearly — and decide what to do next.
        </p>

        {/* Ladder */}
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 16, maxWidth: 360, margin: "0 auto 40px", textAlign: "left", ...fadeIn(visible, 120) }}>
          {[
            { bold: "Start with the score.", rest: "See where you stand." },
            { bold: "Unlock the diagnostic.", rest: "Understand what determines it." },
            { bold: "Track it over time.", rest: "See how your structure evolves." },
          ].map((line, i) => (
            <p key={i} style={{ fontSize: 15, color: C.sandMuted, lineHeight: 1.55, margin: 0 }}>
              <strong style={{ fontWeight: 600, color: C.sandText }}>{line.bold}</strong><br />{line.rest}
            </p>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", ...fadeIn(visible, 200) }}>
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
            Begin your assessment
          </Link>
          <p style={{ fontSize: 14, fontWeight: 500, color: C.sandLight, marginTop: 16 }}>
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

export default function PricingPage() {
  return (
    <div className="overflow-x-hidden">
      <main>
        <HeroSection />
        <Declaration />
        <PricingCards />
        <PositioningStrip />
        <OutcomesSection />
        <SampleReportCta />
        <FaqSection />
        <FinalCta />
      </main>
    </div>
  );
}
