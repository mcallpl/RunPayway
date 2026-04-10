"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { C, sans } from "@/lib/design-tokens";

/* ================================================================== */
/* UTILITIES                                                           */
/* ================================================================== */

function useMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => { const c = () => setM(window.innerWidth <= bp); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, [bp]);
  return m;
}

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

/* ================================================================== */
/* TOKENS                                                              */
/* ================================================================== */

const muted = "rgba(14,26,43,0.68)";
const light = "rgba(14,26,43,0.62)";
const border = "#E5E7EB";

/* ================================================================== */
/* CONTENT COMPONENTS                                                  */
/* ================================================================== */

function Section({ number, title, children, mobile, visible }: { number: string; title: string; children: React.ReactNode; mobile: boolean; visible: boolean }) {
  return (
    <div style={{
      background: C.white, borderRadius: 16, border: `1px solid ${border}`,
      padding: mobile ? "28px 24px" : "36px 40px",
      boxShadow: "0 1px 4px rgba(14,26,43,0.03)",
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)",
      transition: "opacity 500ms ease-out, transform 500ms ease-out",
    }}>
      <h2 style={{ fontSize: mobile ? 18 : 20, fontWeight: 600, color: C.navy, letterSpacing: "-0.02em", marginBottom: 18, lineHeight: 1.3 }}>
        <span style={{ color: C.purple, marginRight: 8, fontWeight: 500 }}>{number}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p style={{ fontSize: 14, color: muted, lineHeight: 1.75, marginBottom: 12, ...style }}>{children}</p>;
}

function Bullet({ items }: { items: string[] }) {
  return (
    <ul style={{ padding: 0, margin: "0 0 12px", listStyle: "none" }}>
      {items.map((item) => (
        <li key={item} style={{ fontSize: 14, color: muted, lineHeight: 1.75, paddingLeft: 20, position: "relative" }}>
          <span style={{ position: "absolute", left: 0, top: 10, width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal }} />
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ================================================================== */
/* PAGE                                                                */
/* ================================================================== */

export default function InterpretationContractPage() {
  const mobile = useMobile();
  const heroAnim = useInView();
  const s1 = useInView(); const s2 = useInView(); const s3 = useInView(); const s4 = useInView();
  const s5 = useInView(); const s6 = useInView(); const s7 = useInView();

  return (
    <div style={{ background: "#FAFAFA", fontFamily: sans }}>

      {/* HERO */}
      <header style={{ backgroundColor: C.sand, paddingTop: mobile ? 104 : 152, paddingBottom: mobile ? 56 : 88, paddingLeft: mobile ? 24 : 48, paddingRight: mobile ? 24 : 48 }}>
        <div ref={heroAnim.ref} style={{ maxWidth: 860, margin: "0 auto", textAlign: "center", opacity: heroAnim.visible ? 1 : 0, transform: heroAnim.visible ? "translateY(0)" : "translateY(10px)", transition: "opacity 500ms ease-out, transform 500ms ease-out" }}>
          <div style={{ fontSize: mobile ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>
            Interpretation Contract
          </div>
          <h1 style={{ fontSize: mobile ? 38 : 64, fontWeight: 700, color: C.navy, letterSpacing: "-0.035em", lineHeight: 1.05, marginBottom: 24 }}>
            How Your Report Language Is Determined
          </h1>
          <p style={{ fontSize: mobile ? 16 : 18, color: muted, lineHeight: 1.6, maxWidth: 680, margin: "0 auto" }}>
            Every word in your assessment is selected by deterministic rules. Same inputs produce the same interpretation, every time.
          </p>
        </div>
      </header>

      {/* CONTENT */}
      <section style={{ paddingTop: mobile ? 56 : 112, paddingBottom: mobile ? 56 : 112 }}>
        <div style={{ maxWidth: 820, margin: "0 auto", paddingLeft: mobile ? 24 : 24, paddingRight: mobile ? 24 : 24, display: "flex", flexDirection: "column" as const, gap: mobile ? 16 : 20 }}>

          {/* 1. The Determinism Guarantee */}
          <div ref={s1.ref}>
            <Section number="1." title="The Determinism Guarantee" mobile={mobile} visible={s1.visible}>
              <P>Every narrative in your report is generated by pure functions — no randomness, no AI judgment in selection.</P>
              <P>Same structural inputs always produce the same constraint identification, the same risk scenarios, the same action priorities, and the same explainability narrative.</P>
              <P style={{ marginBottom: 0 }}>The only AI-generated sections (PressureMap, Plain English, Action Plan) are clearly labeled and run through Claude with industry-specific vocabulary constraints.</P>
            </Section>
          </div>

          {/* 2. Constraint Hierarchy Selection */}
          <div ref={s2.ref}>
            <Section number="2." title="Constraint Hierarchy Selection" mobile={mobile} visible={s2.visible}>
              <P>Your primary constraint (the biggest factor limiting your score) is identified by Engine 09 in the RP-2.0 pipeline.</P>
              <P>7 constraints are ranked: forward visibility, labor dependence, concentration, persistence, variability, durability, continuity.</P>
              <P>The ranking uses factor scores, interaction effects, and quality signals — not subjective assessment.</P>
              <P style={{ marginBottom: 0 }}>Your root constraint determines: the primary narrative, the top recommended action, and the first stress scenario shown.</P>
            </Section>
          </div>

          {/* 3. Scenario Selection Rules */}
          <div ref={s3.ref}>
            <Section number="3." title="Scenario Selection Rules" mobile={mobile} visible={s3.visible}>
              <P>24 deterministic scenarios exist in the scenario registry.</P>
              <P>4-6 are selected per assessment based on:</P>
              <Bullet items={[
                "Your income model family (12 families)",
                "Your industry profile (21 industries)",
                "Your fragility classification",
                "Your intake signals",
              ]} />
              <P style={{ marginBottom: 0 }}>Selection is pure function: same profile + same scores = same scenarios, always.</P>
            </Section>
          </div>

          {/* 4. Industry Vocabulary Application */}
          <div ref={s4.ref}>
            <Section number="4." title="Industry Vocabulary Application" mobile={mobile} visible={s4.visible}>
              <P>19 industries have dedicated vocabulary covering:</P>
              <Bullet items={[
                "Nouns, scenarios, actions, constraint explanations",
                "Behavior descriptions and improvement directions",
              ]} />
              <P>When your industry is identified, all report surfaces use that industry's specific language — not generic terms.</P>
              <P style={{ marginBottom: 0 }}>A real estate agent sees "property management fees." An insurance professional sees "renewal commissions." The same structural concept, rendered in the vocabulary you recognize.</P>
            </Section>
          </div>

          {/* 5. Explainability Engine */}
          <div ref={s5.ref}>
            <Section number="5." title="Explainability Engine" mobile={mobile} visible={s5.visible}>
              <P>Engine 15 generates 12 narrative components:</P>
              <Bullet items={[
                "Why this score, why not higher",
                "Strongest supports, strongest suppressors",
                "Surprising insights, tradeoff narratives",
                "One thing that matters, reusable framework",
                "Predictive warnings and behavioral insights",
              ]} />
              <P>Each is derived from your scores, constraints, interactions, sensitivity, fragility, quality, benchmarks, and profile.</P>
              <P style={{ marginBottom: 0 }}>No component is randomly selected or rotated. The same assessment always produces the same explanation.</P>
            </Section>
          </div>

          {/* 6. AI-Generated Sections (Labeled) */}
          <div ref={s6.ref}>
            <Section number="6." title="AI-Generated Sections (Labeled)" mobile={mobile} visible={s6.visible}>
              <P>Three sections use Claude (Anthropic) for generation:</P>
              <Bullet items={[
                "PressureMap\u2122",
                "Plain English Interpretation",
                "Action Plan",
              ]} />
              <P>These are the only non-deterministic components. They are clearly labeled as AI-generated.</P>
              <P>Claude receives your industry vocabulary context, constraint data, and score — and generates narrative within those constraints.</P>
              <P style={{ marginBottom: 0 }}>If AI generation fails, the report uses deterministic template text from the engine.</P>
            </Section>
          </div>

          {/* 7. Action Priority Ordering */}
          <div ref={s7.ref}>
            <Section number="7." title="Action Priority Ordering" mobile={mobile} visible={s7.visible}>
              <P>Engine 16 generates 5-7 recommended actions ranked by:</P>
              <Bullet items={[
                "Constraint severity",
                "Sensitivity lift",
                "Fragility impact",
                "Profile compatibility",
              ]} />
              <P>2-3 avoid actions are generated from fragility analysis.</P>
              <P>An 8-week execution roadmap sequences actions by effort and compound impact.</P>
              <P style={{ marginBottom: 0 }}>Ordering is deterministic: same constraints produce the same action sequence.</P>
            </Section>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <section style={{ backgroundColor: C.navy, paddingTop: mobile ? 88 : 128, paddingBottom: mobile ? 88 : 128, paddingLeft: mobile ? 24 : 48, paddingRight: mobile ? 24 : 48 }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: mobile ? 24 : 32, fontWeight: 600, color: C.sandText, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 16 }}>
            Deterministic by design.
          </h2>
          <p style={{ fontSize: mobile ? 16 : 18, color: "rgba(244,241,234,0.50)", lineHeight: 1.6, marginBottom: 32 }}>
            Your report language is a contract, not a suggestion. Same inputs, same interpretation, every time.
          </p>
          <Link href="/begin" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: mobile ? 56 : 60, width: mobile ? "100%" : "auto",
            padding: mobile ? "0 28px" : "0 32px",
            borderRadius: 16, backgroundColor: C.white, color: C.navy,
            fontSize: 16, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 8px 24px rgba(14,26,43,0.08)",
            border: "1px solid rgba(244,241,234,0.45)",
            transition: "transform 200ms, box-shadow 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(244,241,234,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.08)"; }}>
            Start Your Free Assessment
          </Link>
          <p style={{ fontSize: 14, fontWeight: 500, color: "rgba(244,241,234,0.40)", marginTop: 16 }}>
            Under 2 minutes | Instant result | Private by default
          </p>
          <p style={{ fontSize: 13, color: "rgba(244,241,234,0.30)", marginTop: 24, letterSpacing: "0.04em" }}>
            RUNPAYWAY\u2122 &mdash; Interpretation Contract v1.0
          </p>
        </div>
      </section>
    </div>
  );
}
