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

function useTablet() {
  const [t, setT] = useState(false);
  useEffect(() => { const c = () => setT(window.innerWidth > 768 && window.innerWidth <= 1024); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, []);
  return t;
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


/* ================================================================ */
/* SECTION 1 — HERO                                                  */
/* ================================================================ */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();

  return (
    <header ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 104 : 148, paddingBottom: m ? 48 : 72, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>
          ENTERPRISE ACCESS
        </div>
        <h1 style={{ fontSize: m ? 32 : 64, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.035em", color: C.navy, marginBottom: 24, ...fadeIn(visible, 50) }}>
          The governed standard for{m ? " " : <br />}complex-income measurement.
        </h1>
        <p style={{ fontSize: m ? 18 : 24, fontWeight: 400, lineHeight: 1.45, color: C.textSecondary, maxWidth: 680, margin: "0 auto 8px", ...fadeIn(visible, 100) }}>
          This is not consumer checkout pricing. Enterprise access is scoped to how your organization measures complex income.
        </p>
        <p style={{ fontSize: m ? 16 : 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, maxWidth: 620, margin: "0 auto 24px", ...fadeIn(visible, 120) }}>
          Request an enterprise briefing to scope access for your teams, systems, and connected systems.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap" as const, justifyContent: "center", gap: m ? 12 : 24, ...fadeIn(visible, 160) }}>
          {["Approved rules", "External-safe outputs", "Measured the same way every time"].map((item, i) => (
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
  const t = useTablet();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 56 : 96, paddingBottom: m ? 56 : 96, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 12, ...fadeIn(visible) }}>
          Governed access, not consumer checkout.
        </h2>
        <p style={{ fontSize: m ? 20 : 24, fontWeight: 600, lineHeight: 1.3, color: C.teal, marginBottom: 32, ...fadeIn(visible, 60) }}>
          Approved rules. Measured the same way every time.
        </p>
        <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 28, ...fadeIn(visible, 100) }}>
          RunPayway™ measures income structure under approved rules applied consistently every time. Enterprise access is scoped to what your organization needs:
        </p>
        <div style={{ display: m ? "flex" : "grid", flexDirection: m ? "column" as const : undefined, gridTemplateColumns: m ? undefined : "1fr 1fr 1fr", gap: 12, maxWidth: m ? 420 : 680, margin: "0 auto", ...fadeIn(visible, 160) }}>
          {[
            "Organizational use case",
            "Measurement volume",
            "Deployment scope",
          ].map((line, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: m ? "center" : "flex-start", backgroundColor: "rgba(14,26,43,0.02)", borderRadius: 12, padding: "16px 20px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M20 6 9 17l-5-5"/></svg>
              <span style={{ fontSize: 15, fontWeight: 600, color: C.navy, lineHeight: 1.4 }}>{line}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 3 — ENTERPRISE ACCESS FACTORS                             */
/* ================================================================ */

function PricingCards() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();

  const factors = [
    { title: "Use case and volume", items: ["Organizational use case", "Measurement volume", "Number of teams and systems"] },
    { title: "Integration and deployment", items: ["Integration needs", "Connected-system requirements", "Deployment scope"] },
    { title: "Governance and replay", items: ["Governance requirements", "Approved-rule management needs", "Replay and audit requirements"] },
  ];

  const check = (label: string) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
      <span style={{ color: C.teal, fontSize: 13, flexShrink: 0, marginTop: 2 }}>&#10003;</span>
      <span style={{ fontSize: 14, fontWeight: 400, lineHeight: 1.5, color: C.textSecondary }}>{label}</span>
    </div>
  );

  const cardBase: React.CSSProperties = {
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 28,
    border: `1px solid rgba(14,26,43,0.07)`,
    display: "flex",
    flexDirection: "column",
  };

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 48 : 96, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 26 : 36, fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.028em", color: C.navy, marginBottom: 12 }}>What shapes enterprise access</h2>
          <p style={{ fontSize: 17, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, maxWidth: 640, margin: "0 auto" }}>
            There are no published tiers and no checkout. Access is scoped to your organization during an enterprise briefing.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : t ? "1fr 1fr" : "1fr 1fr 1fr", gap: 20, alignItems: "stretch", ...fadeIn(visible, 100) }}>
          {factors.map((f, i) => (
            <div key={i} style={cardBase}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>{f.title}</div>
              <div style={{ borderTop: `1px solid rgba(14,26,43,0.06)`, paddingTop: 16, flex: 1 }}>
                {f.items.map((it) => check(it))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", marginTop: m ? 36 : 48, ...fadeIn(visible, 180) }}>
          <Link href="/organizations" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: 60, padding: "0 32px",
            borderRadius: 16, backgroundColor: C.navy, color: C.white,
            fontSize: 16, fontWeight: 600, textDecoration: "none",
            boxShadow: ctaShadow,
            transition: "transform 200ms, box-shadow 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.18)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = ctaShadow; }}>
            Request Enterprise Briefing
          </Link>
          <p style={{ fontSize: 14, fontWeight: 500, color: C.textMuted, textAlign: "center", marginTop: 14, marginBottom: 0 }}>
            For organizations, institutions, and platforms. We follow up within two business days.
          </p>
        </div>
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
  const t = useTablet();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 56 : 96, paddingBottom: m ? 56 : 96, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        <div style={{ padding: m ? "28px 24px" : "36px 40px", borderRadius: 20, ...fadeIn(visible) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: "rgba(244,241,234,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.sand} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", color: C.sand }}>SYSTEM INTEGRITY</span>
          </div>
          <h2 style={{ fontSize: m ? 24 : 32, fontWeight: 600, lineHeight: 1.12, letterSpacing: "-0.028em", color: C.sandText, marginBottom: 12 }}>
            Governed measurement, not a software subscription.
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.sandMuted, margin: 0 }}>
            RunPayway™ is the governed standard for complex-income measurement. Approved rules. Consistent, external-safe outputs. Every time.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 5 — WHAT ENTERPRISE ACCESS DELIVERS                       */
/* ================================================================ */

function OutcomesSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();

  const outcomeAccents = [C.teal, C.purple, C.navy];
  const outcomes = [
    { title: "Consistency", desc: "Complex income is measured the same way every time, across teams, systems, policies, and time." },
    { title: "Governance", desc: "Approved rules are versioned. Test measurement-rule changes before launch with the Measurement Impact Simulator." },
    { title: "Replay", desc: "Past measurements can be replayed and explained with Measurement Replay." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy }}>
            What enterprise access delivers
          </h2>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, ...fadeIn(visible, 100) }}>
          {outcomes.map((item, i) => (
            <div key={i} style={{ padding: m ? 28 : 32, borderRadius: 18, backgroundColor: C.white, boxShadow: cardShadow, marginBottom: m ? 16 : 0, borderLeft: `4px solid ${outcomeAccents[i]}` }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.navy, marginBottom: 12, lineHeight: 1.35 }}>{item.title}</div>
              <p style={{ fontSize: 16, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: m ? 40 : 56, ...fadeIn(visible, 180) }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 8 }}>Approved outputs, published to connected systems.</p>
          <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.6, maxWidth: explanatoryW, margin: "0 auto 24px" }}>
            RunPayway™ measures income structure according to approved rules and publishes approved outputs to connected systems. It does not make eligibility decisions, replace institutional policy, issue recommendations, or provide financial advice.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 6 — FAQ                                                   */
/* ================================================================ */

function FaqSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "Is this consumer checkout pricing?", a: "No. There are no published tiers, no checkout, and no consumer plans. Enterprise access is scoped during a briefing." },
    { q: "How is enterprise access priced?", a: "By organizational use case, measurement volume, integration needs, governance requirements, and deployment scope." },
    { q: "Can we test rule changes before launch?", a: "Yes. The Measurement Impact Simulator tests proposed measurement-rule changes against historical income cases before they go live." },
    { q: "Can we replay past measurements?", a: "Yes. Measurement Replay reconstructs the approved rule version, accepted inputs, and approved output so past measurements can be replayed and explained." },
    { q: "How are approved outputs delivered?", a: "Approved, external-safe outputs are published to your connected systems through governed integration." },
    { q: "Does RunPayway™ make decisions?", a: "No. RunPayway™ does not make eligibility decisions, replace institutional policy, issue recommendations, or provide financial advice." },
    { q: "Is a public numeric score exposed?", a: "No. RunPayway™ exposes external-safe classification language, not a public numeric score." },
    { q: "How do we get started?", a: "Request an enterprise briefing and we scope access to your organization." },
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
                <div style={{ maxHeight: isOpen ? 220 : 0, overflow: "hidden", transition: "max-height 300ms ease" }}>
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
/* SECTION 7 — FINAL CTA                                             */
/* ================================================================ */

function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 88 : 128, paddingBottom: m ? 88 : 128, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: explanatoryW, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 28 : 52, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.035em", color: C.sandText, marginBottom: 20, ...fadeIn(visible) }}>
          Measure complex income{m ? " " : <br />}the same way every time.
        </h2>
        <p style={{ fontSize: m ? 18 : 22, fontWeight: 400, lineHeight: 1.45, color: C.sandMuted, marginBottom: 32, ...fadeIn(visible, 80) }}>
          RunPayway™ measures income structure according to approved rules and publishes approved outputs to connected systems.
        </p>

        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", ...fadeIn(visible, 120) }}>
          <Link href="/organizations" style={{
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
            Request Enterprise Briefing
          </Link>
          <p style={{ fontSize: 14, fontWeight: 500, color: C.sandLight, marginTop: 16 }}>
            For organizations, institutions, and platforms.
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
