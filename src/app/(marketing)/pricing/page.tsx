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

const C = { navy: "#1C1635", purple: "#4B3FAE", teal: "#1F6D7A", sand: "#F4F1EA", white: "#FFFFFF", border: "#E5E7EB" };
const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';
const muted = "rgba(14,26,43,0.68)";
const light = "rgba(14,26,43,0.62)";
const contentW = 1040;
const px = (m: boolean) => m ? 20 : 24;
const STRIPE = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL || "https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05";
const STRIPE_ANNUAL = process.env.NEXT_PUBLIC_STRIPE_ANNUAL_URL || "/checkout-placeholder?plan=monitoring";


/* ================================================================== */
/* SECTION 1 — HERO                                                    */
/* ================================================================== */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <header ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 40 : 64, paddingBottom: m ? 40 : 56, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>Pricing</div>
        <h1 style={{ fontSize: m ? 32 : 48, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", color: C.navy, marginBottom: 16, ...fadeIn(visible, 60) }}>
          The score is free.{m ? " " : <br />}The diagnostic shows what to change.
        </h1>
        <p style={{ fontSize: m ? 16 : 17, color: muted, lineHeight: 1.65, maxWidth: 480, margin: "0 auto", ...fadeIn(visible, 120) }}>
          No bank connection. No credit pull. Full refund if it doesn&#8217;t reveal something new.
        </p>
      </div>
    </header>
  );
}


/* ================================================================== */
/* SECTION 2 — PRICING CARDS                                           */
/* ================================================================== */

function PricingCards() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const check = (text: string, color = C.teal) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 16 }}>
      <span style={{ color, fontSize: 14, flexShrink: 0, marginTop: 2 }}>&#10003;</span>
      <span style={{ fontSize: 15, lineHeight: 1.55, color: "inherit" }}>{text}</span>
    </div>
  );

  return (
    <section ref={ref} style={{ backgroundColor: "#F5F4F1", paddingTop: m ? 60 : 104, paddingBottom: m ? 60 : 104, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, alignItems: "start", ...fadeIn(visible) }}>

          {/* FREE */}
          <div style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 24 : 32, boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 4px 16px rgba(14,26,43,0.03)", display: "flex", flexDirection: "column" as const, marginBottom: m ? 16 : 0, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: C.teal }} />
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal, marginTop: 4, marginBottom: 20 }}>
              Income Stability Score&#8482;
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 48, fontWeight: 600, fontFamily: mono, color: C.navy, lineHeight: 1 }}>$0</span>
            </div>
            <div style={{ fontSize: 14, color: light, marginBottom: 28 }}>always free</div>
            <div style={{ marginBottom: 28, flex: 1, color: muted }}>
              {check("Score (0\u2013100)")}
              {check("Stability band classification")}
              {check("Primary structural constraint")}
              {check("Distance to next band")}
              {check("Industry percentile benchmark")}
            </div>
            <Link href="/begin" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 52, borderRadius: 12, backgroundColor: C.white, color: C.navy, border: `1px solid ${C.navy}`, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "background-color 200ms" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#f5f4f1"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; }}>
              Get My Free Score
            </Link>
            <p style={{ fontSize: 13, color: light, textAlign: "center", marginTop: 12, marginBottom: 0 }}>
              Under 2 minutes. No account required.
            </p>
          </div>

          {/* DIAGNOSTIC — PRIMARY */}
          <div style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 24 : 32, display: "flex", flexDirection: "column" as const, position: "relative" as const, overflow: "hidden", boxShadow: "0 2px 8px rgba(14,26,43,0.06), 0 8px 32px rgba(14,26,43,0.05)", transform: m ? "none" : "scale(1.03)" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.purple}, ${C.teal})` }} />
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.purple, marginTop: 4, marginBottom: 20 }}>
              RunPayway&#8482; Diagnostic
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 48, fontWeight: 600, fontFamily: mono, color: C.navy, lineHeight: 1 }}>$69</span>
            </div>
            <div style={{ fontSize: 14, color: light, marginBottom: 20 }}>one-time</div>
            <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, lineHeight: 1.55, marginBottom: 24 }}>
              See exactly why your score is what it is — and what changes it.
            </p>
            <div style={{ marginBottom: 28, flex: 1, color: muted }}>
              {check("Negotiation Playbook — scripts with your data and objection handlers")}
              {check("12-week roadmap with dynamic milestones from your numbers")}
              {check("PressureMap\u2122 — income zones and structural vulnerability")}
              {check("What-If Simulator and Goal Mode")}
              {check("Weekly priority briefing with share and copy")}
              {check("Lifetime Command Center access")}
            </div>
            <a href={STRIPE} style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: 56, borderRadius: 12,
              background: `linear-gradient(135deg, ${C.navy} 0%, #251e42 100%)`,
              color: C.white, fontSize: 16, fontWeight: 600, textDecoration: "none",
              boxShadow: "0 2px 8px rgba(28,22,53,0.15), 0 8px 32px rgba(28,22,53,0.10)",
              border: "1px solid rgba(255,255,255,0.08)",
              transition: "transform 200ms, box-shadow 200ms",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(28,22,53,0.20), 0 12px 48px rgba(28,22,53,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(28,22,53,0.15), 0 8px 32px rgba(28,22,53,0.10)"; }}>
              Unlock Full Diagnostic &mdash; $69
            </a>
            <p style={{ fontSize: 14, fontWeight: 500, color: C.teal, textAlign: "center", marginTop: 14, marginBottom: 0 }}>
              If it doesn&#8217;t reveal something new, full refund.
            </p>
          </div>

          {/* MONITORING */}
          <div style={{ backgroundColor: C.navy, borderRadius: 16, padding: m ? 24 : 32, display: "flex", flexDirection: "column" as const, position: "relative" as const, overflow: "hidden", marginTop: m ? 16 : 0 }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal, marginTop: 4, marginBottom: 20 }}>
              RunPayway&#8482; Monitoring
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 48, fontWeight: 600, fontFamily: mono, color: C.sand, lineHeight: 1 }}>$149</span>
              <span style={{ fontSize: 14, color: "rgba(244,241,234,0.40)", marginLeft: 8 }}>/year</span>
            </div>
            <div style={{ fontSize: 15, color: "rgba(244,241,234,0.45)", marginBottom: 24 }}>Track how your structure evolves over time.</div>
            <div style={{ marginBottom: 28, flex: 1, color: "rgba(244,241,234,0.60)" }}>
              {check("3 full assessments within 12 months", C.teal)}
              {check("Score history timeline", C.teal)}
              {check("Factor-level change tracking", C.teal)}
              {check("Benchmark evolution over time", C.teal)}
              {check("Monitoring portal access", C.teal)}
            </div>
            <Link href={STRIPE_ANNUAL} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 52, borderRadius: 12, backgroundColor: C.white, color: C.navy, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "transform 200ms, box-shadow 200ms", boxShadow: "0 2px 8px rgba(244,241,234,0.10)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
              Start Monitoring &mdash; $149/yr
            </Link>
            <p style={{ fontSize: 13, color: "rgba(244,241,234,0.50)", textAlign: "center", marginTop: 12, marginBottom: 0 }}>
              Full Command Center access included.
            </p>
          </div>
        </div>

        {/* Sample report link */}
        <div style={{ textAlign: "center", marginTop: m ? 24 : 36 }}>
          <Link href="/sample-report" style={{ fontSize: 15, fontWeight: 500, color: C.teal, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, minHeight: 44, transition: "opacity 200ms" }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.7"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
            View a sample report &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3 — FAQ                                                     */
/* ================================================================== */

function FaqSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = [
    { q: "What do I get for free?", a: "Your Income Stability Score\u2122 from 0 to 100, your stability band classification, the primary structural constraint suppressing your score, distance to the next band, and your industry percentile benchmark. Takes under 2 minutes. No account required." },
    { q: "What does the $69 Diagnostic unlock?", a: "Everything in the free score, plus: a Negotiation Playbook with word-for-word scripts personalized to your industry and constraint, objection handlers and success signals for each conversation, a 12-week roadmap with dynamic milestones calculated from your actual numbers, a PressureMap\u2122 showing your three income zones, a weekly priority briefing that updates every time you return, a What-If Simulator to model changes before you commit, and lifetime access to the Command Center." },
    { q: "What is the Negotiation Playbook?", a: "The Playbook generates ready-to-use conversation scripts based on your specific constraint, industry, and structural data. Each script includes who to talk to, when to use it, the exact words to say, how to handle pushback, and what a successful response looks like. Your actual percentages are embedded in each script \u2014 not a template." },
    { q: "How are the roadmap milestones personalized?", a: "Each milestone references your actual starting numbers. Instead of \u2018diversify your income,\u2019 you see \u2018Concentration drops from 72% to below 57%.\u2019 Score checkpoints at every stage show your projected score after each step. The milestones update as you complete steps." },
    { q: "What does Monitoring include?", a: "Three full assessments within 12 months. Score history timeline showing your progression. Factor-level delta tracking between assessments. Benchmark evolution against peers over time. Email and PIN authentication for your monitoring portal. Full Command Center access included with every assessment." },
    { q: "How is the score calculated?", a: "A deterministic model evaluates six structural dimensions of your income: recurrence, concentration, diversification, forward visibility, earnings consistency, and labor independence. The model is fixed and versioned \u2014 same inputs always produce the same score. No AI, no machine learning, no subjective interpretation." },
    { q: "Do you access my bank accounts or credit?", a: "No. There is no bank connection, no credit pull, and no access to any financial accounts. Your score is calculated entirely from the structural information you provide. Your data is never sold or shared." },
    { q: "What if the diagnostic doesn\u2019t reveal anything new?", a: "Full refund. If the diagnostic does not surface at least one structural insight you did not already know, you get your money back. No conditions, no questions." },
  ];
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 60 : 104, paddingBottom: m ? 60 : 104, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 24 : 32, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>Questions</h2>
        <div style={{ ...fadeIn(visible, 80) }}>
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                <button onClick={() => setOpenFaq(isOpen ? null : i)} aria-expanded={isOpen}
                  style={{ width: "100%", padding: "20px 0", minHeight: 48, display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: m ? 16 : 17, fontWeight: 500, color: C.navy, paddingRight: 16, lineHeight: 1.4 }}>{faq.q}</span>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, transition: "transform 200ms", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}>
                    <path d="M3 8h10" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M8 3v10" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                <div style={{ maxHeight: isOpen ? 400 : 0, overflow: "hidden", transition: "max-height 300ms ease" }}>
                  <p style={{ fontSize: 15, color: muted, lineHeight: 1.65, margin: 0, paddingBottom: 24 }}>{faq.a}</p>
                </div>
              </div>
            );
          })}
          <div style={{ borderTop: `1px solid ${C.border}` }} />
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 4 — FINAL CTA                                               */
/* ================================================================== */

function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 64 : 112, paddingBottom: m ? 64 : 112, paddingLeft: px(m), paddingRight: px(m), position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: m ? 300 : 500, height: m ? 300 : 500, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: m ? 26 : 40, fontWeight: 500, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.sand, marginBottom: 16, ...fadeIn(visible) }}>
          Your income already has a structure.{m ? " " : <br />}Now you can see it clearly.
        </h2>
        <p style={{ fontSize: 17, color: "rgba(244,241,234,0.45)", lineHeight: 1.65, marginBottom: 36, ...fadeIn(visible, 60) }}>
          Start with the free score. Unlock the diagnostic when you&#8217;re ready to act.
        </p>
        <div style={{ ...fadeIn(visible, 140) }}>
          <Link href="/begin" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: 56, padding: m ? "0 28px" : "0 44px", width: m ? "100%" : "auto", maxWidth: m ? 360 : "none",
            borderRadius: 12,
            background: `linear-gradient(135deg, ${C.white} 0%, rgba(244,241,234,0.95) 100%)`,
            color: C.navy, fontSize: m ? 15 : 16, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 2px 12px rgba(244,241,234,0.15), 0 8px 32px rgba(244,241,234,0.08)",
            border: "1px solid rgba(244,241,234,0.45)",
            transition: "transform 200ms, box-shadow 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(244,241,234,0.20), 0 12px 48px rgba(244,241,234,0.10)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(244,241,234,0.15), 0 8px 32px rgba(244,241,234,0.08)"; }}>
            Start Your Free Assessment
          </Link>
          <p style={{ fontSize: 14, color: "rgba(244,241,234,0.45)", marginTop: 14, letterSpacing: "0.02em" }}>
            Under 2 minutes &bull; Instant result &bull; Private by default
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* PAGE EXPORT                                                         */
/* ================================================================== */

export default function PricingPage() {
  return (
    <div className="overflow-x-hidden">
      <main>
        <HeroSection />
        <PricingCards />
        <FaqSection />
        <FinalCta />
      </main>
    </div>
  );
}
