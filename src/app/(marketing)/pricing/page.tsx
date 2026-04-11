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
const sectionPx = (m: boolean) => m ? 24 : 48;
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
    <header ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 104 : 148, paddingBottom: m ? 48 : 72, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>
          PRICING
        </div>
        <h1 style={{ fontSize: m ? 32 : 64, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.035em", color: C.navy, marginBottom: 24, ...fadeIn(visible, 50) }}>
          Start with the score.{m ? " " : <br />}Understand what defines it.
        </h1>
        <p style={{ fontSize: m ? 18 : 24, fontWeight: 400, lineHeight: 1.45, color: C.textSecondary, maxWidth: 680, margin: "0 auto 8px", ...fadeIn(visible, 100) }}>
          RunPayway reveals how your income is built&mdash;and whether it holds under pressure.
        </p>
        <p style={{ fontSize: m ? 16 : 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, maxWidth: 620, margin: "0 auto 24px", ...fadeIn(visible, 120) }}>
          The score is a fixed result. The diagnostic reveals what defines it.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap" as const, justifyContent: "center", gap: m ? 12 : 24, ...fadeIn(visible, 160) }}>
          {["No financial accounts", "No credit pull", "Private by default"].map((item, i) => (
            <span key={i} style={{ fontSize: 14, fontWeight: 600, color: C.textMuted }}>{item}</span>
          ))}
        </div>
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
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 56 : 96, paddingBottom: m ? 56 : 96, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 12, ...fadeIn(visible) }}>
          No interpretation. No exceptions.
        </h2>
        <p style={{ fontSize: m ? 20 : 24, fontWeight: 600, lineHeight: 1.3, color: C.teal, marginBottom: 32, ...fadeIn(visible, 60) }}>
          Same rules. Every time.
        </p>
        <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 28, ...fadeIn(visible, 100) }}>
          RunPayway measures your income under fixed rules applied consistently every time. What changes is how deeply you can see:
        </p>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, maxWidth: 420, margin: "0 auto", ...fadeIn(visible, 160) }}>
          {[
            "What defines your score",
            "What limits your score",
            "What moves it forward",
          ].map((line, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", justifyContent: "center" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 9 }} />
              <span style={{ fontSize: 17, fontWeight: 500, color: C.navy, lineHeight: 1.6 }}>{line}</span>
            </div>
          ))}
        </div>
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
      <span style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.55, color: "inherit" }}>{text}</span>
    </div>
  );

  /* Card renderers */
  const freeCard = (order?: number) => (
    <div style={{ backgroundColor: C.white, borderRadius: 18, padding: m ? 28 : 32, border: `1px solid rgba(14,26,43,0.06)`, display: "flex", flexDirection: "column" as const, order: m ? order : undefined }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 20 }}>
        Income Stability Score&#8482;
      </div>
      <div style={{ marginBottom: 4 }}>
        <span style={{ fontSize: 32, fontWeight: 700, fontFamily: mono, color: C.navy, lineHeight: 1 }}>$0</span>
      </div>
      <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 20 }}>Always available</div>
      <p style={{ fontSize: 15, fontWeight: 400, color: C.navy, lineHeight: 1.5, marginBottom: 24 }}>
        Your baseline measurement. No cost. No commitment.
      </p>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", color: C.textMuted, marginBottom: 14 }}>WHAT YOU GET FOR FREE</div>
      <div style={{ marginBottom: 28, flex: 1, color: C.textSecondary }}>
        {check("Structural Income Score (0\u2013100)")}
        {check("Stability classification")}
        {check("Primary structural risk")}
        {check("Distance to next level")}
        {check("Industry-relative position")}
      </div>
      <Link href="/begin" style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: 60, borderRadius: 16,
        backgroundColor: C.white, color: C.navy,
        border: `1.5px solid ${C.teal}`,
        fontSize: 16, fontWeight: 600, textDecoration: "none",
        transition: "background-color 200ms, border-color 200ms",
      }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = `${C.teal}08`; e.currentTarget.style.borderColor = C.teal; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; e.currentTarget.style.borderColor = C.teal; }}>
        Get Your Free Score
      </Link>
      <p style={{ fontSize: 13, color: C.textMuted, textAlign: "center", marginTop: 12, marginBottom: 0 }}>
        Under 2 minutes &bull; No account required
      </p>
    </div>
  );

  const diagnosticCard = (order?: number) => (
    <div style={{ backgroundColor: C.white, borderRadius: 18, padding: m ? 36 : 36, display: "flex", flexDirection: "column" as const, position: "relative" as const, overflow: "hidden", boxShadow: "0 20px 48px rgba(14,26,43,0.12)", border: `1.5px solid rgba(14,26,43,0.18)`, order: m ? order : undefined }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: C.teal }} />

      {/* Most used tag */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5"/></svg>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.teal }}>Most used</span>
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.navy, marginBottom: 20 }}>
        RunPayway&#8482; Dashboard
      </div>
      <div style={{ marginBottom: 4 }}>
        <span style={{ fontSize: 36, fontWeight: 700, fontFamily: mono, color: C.navy, lineHeight: 1 }}>$69</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 500, color: C.textMuted, marginBottom: 20 }}>One-time access</div>
      <p style={{ fontSize: 16, fontWeight: 500, color: C.teal, marginBottom: 20 }}>
        This is where the system becomes actionable.
      </p>

      <div style={{ borderTop: `1px solid rgba(14,26,43,0.06)`, paddingTop: 20, marginBottom: 20 }} />

      <div style={{ marginBottom: 20, flex: 1, color: C.textSecondary }}>
        {check("Identify where your income holds\u2014and where it breaks")}
        {check("See what actually limits your stability")}
        {check("Know the single move that creates the biggest impact")}
        {check("Test changes before you make them")}
      </div>

      {/* What changes after unlock */}
      <div style={{ borderTop: `1px solid rgba(14,26,43,0.06)`, paddingTop: 20, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", color: C.navy, marginBottom: 12 }}>WHAT CHANGES AFTER YOU UNLOCK THIS</div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
          {[
            "You stop guessing what matters",
            "You act before problems appear",
            "You improve your income with intent",
          ].map((line, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 7 }} />
              <span style={{ fontSize: 14, fontWeight: 400, color: C.textSecondary, lineHeight: 1.45 }}>{line}</span>
            </div>
          ))}
        </div>
      </div>

      <a href={STRIPE} onClick={() => trackPurchaseClick("diagnostic_69")} style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: 60, borderRadius: 16, width: "100%",
        backgroundColor: C.navy, color: C.white,
        fontSize: 16, fontWeight: 600, textDecoration: "none",
        boxShadow: ctaShadow,
        transition: "transform 200ms, box-shadow 200ms",
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.18)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = ctaShadow; }}>
        Unlock Dashboard &mdash; $69
      </a>
      <p style={{ fontSize: 14, fontWeight: 500, color: C.textMuted, textAlign: "center", marginTop: 14, marginBottom: 0 }}>
        One payment. Lifetime access.
      </p>
      <p style={{ fontSize: 14, fontWeight: 600, color: C.teal, textAlign: "center", marginTop: 8, marginBottom: 0 }}>
        If it doesn&rsquo;t reveal something new, you don&rsquo;t pay.
      </p>
    </div>
  );

  const monitoringCard = (order?: number) => (
    <div style={{ backgroundColor: C.white, borderRadius: 18, padding: m ? 28 : 32, border: `1px solid rgba(14,26,43,0.06)`, display: "flex", flexDirection: "column" as const, order: m ? order : undefined }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.navy, marginBottom: 20 }}>
        RunPayway&#8482; Monitoring
      </div>
      <div style={{ marginBottom: 4 }}>
        <span style={{ fontSize: 32, fontWeight: 700, fontFamily: mono, color: C.navy, lineHeight: 1 }}>$149</span>
        <span style={{ fontSize: 14, color: C.textMuted, marginLeft: 8 }}>/ year</span>
      </div>
      <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 20 }}>Reassess your score three times a year</div>
      <div style={{ marginBottom: 20, flex: 1, color: C.textSecondary }}>
        {check("Track your score across the year")}
        {check("Track how your score moves")}
        {check("See what improved\u2014and what didn\u2019t")}
        {check("Track your progress over time")}
        {check("Maintain continuous visibility")}
      </div>

      {/* Best for */}
      <div style={{ borderTop: `1px solid rgba(14,26,43,0.06)`, paddingTop: 20, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", color: C.textMuted, marginBottom: 12 }}>BEST FOR</div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
          {["Self-employed professionals", "Variable income earners", "Anyone actively improving their income stability"].map((line, i) => (
            <span key={i} style={{ fontSize: 14, fontWeight: 400, color: C.textSecondary, lineHeight: 1.45 }}>{line}</span>
          ))}
        </div>
      </div>

      <a href={STRIPE_ANNUAL} onClick={() => trackPurchaseClick("monitoring_149")} style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: 60, borderRadius: 16,
        backgroundColor: C.navy, color: C.white,
        fontSize: 16, fontWeight: 600, textDecoration: "none",
        boxShadow: ctaShadow,
        transition: "transform 200ms, box-shadow 200ms",
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.18)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = ctaShadow; }}>
        Start Monitoring &mdash; $149/year
      </a>
      <p style={{ fontSize: 13, color: C.textMuted, textAlign: "center", marginTop: 12, marginBottom: 0 }}>
        Includes full Dashboard access.
      </p>
    </div>
  );

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 48 : 96, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto" }}>
        <div style={{
          display: m ? "flex" : "grid",
          flexDirection: m ? "column" as const : undefined,
          gridTemplateColumns: m ? undefined : "1fr 1.2fr 1fr",
          gap: 24,
          alignItems: "stretch",
          ...fadeIn(visible),
        }}>
          {m ? (
            <>
              {diagnosticCard(1)}
              {freeCard(2)}
              {monitoringCard(3)}
            </>
          ) : (
            <>
              {freeCard()}
              {diagnosticCard()}
              {monitoringCard()}
            </>
          )}
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
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 56 : 96, paddingBottom: m ? 56 : 96, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        {/* Highlighted system integrity block */}
        <div style={{ padding: m ? "28px 24px" : "36px 40px", borderRadius: 20, borderLeft: `4px solid ${C.navy}`, backgroundColor: C.sand, ...fadeIn(visible) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: `${C.navy}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", color: C.navy }}>SYSTEM INTEGRITY</span>
          </div>
          <h2 style={{ fontSize: m ? 24 : 32, fontWeight: 600, lineHeight: 1.12, letterSpacing: "-0.028em", color: C.navy, marginBottom: 12 }}>
            This is not a subscription to software.
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, margin: 0 }}>
            RunPayway is a measurement system &mdash; fixed rules. Consistent results. Every time.
          </p>
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
            What the Dashboard gives you
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

        {/* Price justification + sample report */}
        <div style={{ textAlign: "center", marginTop: m ? 40 : 56, ...fadeIn(visible, 180) }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 8 }}>One decision can cost more than this.</p>
          <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.6, maxWidth: explanatoryW, margin: "0 auto 24px" }}>
            Understanding how your income works before acting prevents mistakes that cost far more than $69.
          </p>
          <Link href="/sample-report" style={{
            fontSize: 15, fontWeight: 600, color: C.teal, textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 6, minHeight: 44,
            transition: "opacity 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.7"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
            See how the system reads income &rarr;
          </Link>
        </div>
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
    { q: "What does the $69 unlock?", a: "The Dashboard — a full breakdown of what defines your score, personalized scripts, a 12-week roadmap, and the exact actions that change it." },
    { q: "What is the Negotiation Playbook?", a: "Scripts based on how your income actually works, designed to improve stability." },
    { q: "How are roadmap milestones personalized?", a: "They are generated directly from your inputs — not templates or assumptions." },
    { q: "What does Monitoring include?", a: "Multiple assessments, change tracking, and visibility over time." },
    { q: "How is the score calculated?", a: "Using fixed rules applied consistently to your answers." },
    { q: "Do you access my bank or credit?", a: "No. RunPayway does not connect to financial accounts." },
    { q: "What if it doesn\u2019t reveal anything new?", a: "You receive a full refund." },
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
                  <span style={{ fontSize: m ? 16 : 17, fontWeight: 600, color: C.teal, paddingRight: 16, lineHeight: 1.4 }}>{faq.q}</span>
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

        <div style={{ textAlign: "center", marginTop: m ? 36 : 48 }}>
          <Link href="/sample-report" style={{
            fontSize: 15, fontWeight: 600, color: C.teal, textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 6, minHeight: 44,
            transition: "opacity 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.7"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
            See How the System Reads Income &rarr;
          </Link>
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
        <h2 style={{ fontSize: m ? 28 : 52, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.035em", color: C.sandText, marginBottom: 20, ...fadeIn(visible) }}>
          Know your income{m ? " " : <br />}before you rely on it.
        </h2>
        <p style={{ fontSize: m ? 18 : 22, fontWeight: 400, lineHeight: 1.45, color: C.sandMuted, marginBottom: 32, ...fadeIn(visible, 80) }}>
          Measure how your income is built&mdash;and whether it holds when it matters.
        </p>

        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", ...fadeIn(visible, 120) }}>
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
            Get Your Structural Income Report
          </Link>
          <p style={{ fontSize: 14, fontWeight: 500, color: C.sandLight, marginTop: 16 }}>
            Under 2 minutes | Instant result | Private by default
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
        <FaqSection />
        <FinalCta />
      </main>
    </div>
  );
}
