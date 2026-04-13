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
/* SPEC CARDS                                                          */
/* ================================================================== */

const specs = [
  { title: "Methodology", href: "/methodology", desc: "How scoring works" },
  { title: "Model Version Policy", href: "/model-version-policy", desc: "Version stamping and immutability" },
  { title: "Interpretation Contract", href: "/interpretation-contract", desc: "How report language is selected" },
  { title: "Version Governance", href: "/version-governance", desc: "Model version management" },
  { title: "Assessment Registry", href: "/assessment-registry", desc: "Score verification and integrity" },
  { title: "Security Practices", href: "/security-practices", desc: "Data protection standards" },
];

function SpecCard({ title, href, desc, mobile }: { title: string; href: string; desc: string; mobile: boolean }) {
  return (
    <Link href={href} style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: mobile ? "18px 20px" : "20px 24px",
      background: C.white, borderRadius: 12, border: `1px solid ${border}`,
      textDecoration: "none", transition: "border-color 200ms, box-shadow 200ms",
      boxShadow: "0 1px 3px rgba(14,26,43,0.03)",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.boxShadow = "0 4px 12px rgba(31,109,122,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.boxShadow = "0 1px 3px rgba(14,26,43,0.03)"; }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 13, color: muted }}>{desc}</div>
      </div>
      <div style={{ fontSize: 18, color: C.teal, marginLeft: 16, flexShrink: 0 }}>&rarr;</div>
    </Link>
  );
}

/* ================================================================== */
/* PAGE                                                                */
/* ================================================================== */

export default function HowRunPaywayWorksPage() {
  const mobile = useMobile();
  const heroAnim = useInView();
  const s1 = useInView(); const s2 = useInView(); const s3 = useInView();
  const s4 = useInView(); const s5 = useInView(); const s6 = useInView();

  return (
    <div style={{ background: "#FAFAFA", fontFamily: sans }}>

      {/* HERO */}
      <header style={{ backgroundColor: C.sand, paddingTop: mobile ? 104 : 152, paddingBottom: mobile ? 56 : 88, paddingLeft: mobile ? 24 : 48, paddingRight: mobile ? 24 : 48 }}>
        <div ref={heroAnim.ref} style={{ maxWidth: 860, margin: "0 auto", textAlign: "center", opacity: heroAnim.visible ? 1 : 0, transform: heroAnim.visible ? "translateY(0)" : "translateY(10px)", transition: "opacity 500ms ease-out, transform 500ms ease-out" }}>
          <div style={{ fontSize: mobile ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>
            HOW IT WORKS
          </div>
          <h1 style={{ fontSize: mobile ? 38 : 64, fontWeight: 700, color: C.navy, letterSpacing: "-0.035em", lineHeight: 1.05, marginBottom: 24 }}>
            RunPayway in 60 Seconds
          </h1>
          <p style={{ fontSize: mobile ? 16 : 18, color: muted, lineHeight: 1.6, maxWidth: 680, margin: "0 auto" }}>
            A structural diagnostic for your income. Six questions. One deterministic score. A complete analysis of what holds your income together — and what could break it.
          </p>
        </div>
      </header>

      {/* CONTENT */}
      <section style={{ paddingTop: mobile ? 56 : 112, paddingBottom: mobile ? 56 : 112 }}>
        <div style={{ maxWidth: 820, margin: "0 auto", paddingLeft: mobile ? 24 : 24, paddingRight: mobile ? 24 : 24, display: "flex", flexDirection: "column" as const, gap: mobile ? 16 : 20 }}>

          {/* 1. What It Does */}
          <div ref={s1.ref}>
            <Section number="1." title="What It Does" mobile={mobile} visible={s1.visible}>
              <Bullet items={[
                "RunPayway measures how your income is structured — not how much you earn.",
                "Six questions capture six dimensions: how much repeats automatically, how concentrated it is, how many sources you have, how far ahead it's committed, how much it fluctuates, and how much depends on your daily effort.",
                "The result is a score from 0 to 100 and a stability band: Limited, Developing, Established, or High.",
                "Same inputs always produce the same score. No randomness. No subjective judgment.",
              ]} />
            </Section>
          </div>

          {/* 2. What You Get */}
          <div ref={s2.ref}>
            <Section number="2." title="What You Get" mobile={mobile} visible={s2.visible}>
              <P style={{ fontWeight: 600, color: C.navy, marginBottom: 8 }}>Free</P>
              <P>Your score, stability band, primary constraint, stress test, and industry context.</P>
              <P style={{ fontWeight: 600, color: C.navy, marginBottom: 8 }}>Full Diagnostic ($69)</P>
              <P>Complete structural report, dashboard with simulator, 12-week action roadmap, personalized action scripts, PressureMap intelligence, and ongoing access.</P>
              <P style={{ fontWeight: 600, color: C.navy, marginBottom: 8 }}>Annual Monitoring ($149)</P>
              <P style={{ marginBottom: 0 }}>Three reassessments per year to track how your structure evolves.</P>
            </Section>
          </div>

          {/* 3. How The Score Works */}
          <div ref={s3.ref}>
            <Section number="3." title="How The Score Works" mobile={mobile} visible={s3.visible}>
              <Bullet items={[
                "A 20-engine deterministic pipeline computes your score from your answers.",
                "No AI is used in scoring — only in the narrative analysis sections (clearly labeled).",
                "Every assessment is cryptographically hashed and verifiable via public endpoint.",
                "Your score is permanently tied to the model version under which it was issued.",
              ]} />
            </Section>
          </div>

          {/* 4. Industry Calibration */}
          <div ref={s4.ref}>
            <Section number="4." title="Industry Calibration" mobile={mobile} visible={s4.visible}>
              <Bullet items={[
                "19 industries have dedicated vocabulary, benchmarks, and tailored recommendations.",
                "Your report speaks the language of your industry — not generic financial terms.",
                "Peer benchmarks compare you against professionals in your sector.",
              ]} />
            </Section>
          </div>

          {/* 5. Your Data */}
          <div ref={s5.ref}>
            <Section number="5." title="Your Data" mobile={mobile} visible={s5.visible}>
              <Bullet items={[
                "No financial accounts connected. No credit checks. No documents required.",
                "Your assessment data is stored securely and can be verified by anyone you share your access code with.",
                "You control your data. Request deletion anytime.",
              ]} />
            </Section>
          </div>

          {/* 6. Specifications */}
          <div ref={s6.ref}>
            <Section number="6." title="Specifications" mobile={mobile} visible={s6.visible}>
              <P style={{ marginBottom: 16 }}>Full technical documentation for every aspect of the RunPayway system.</P>
              <div style={{
                display: "grid",
                gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
                gap: mobile ? 10 : 12,
              }}>
                {specs.map(s => (
                  <SpecCard key={s.href} title={s.title} href={s.href} desc={s.desc} mobile={mobile} />
                ))}
              </div>
            </Section>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <section style={{ backgroundColor: C.navy, paddingTop: mobile ? 88 : 128, paddingBottom: mobile ? 88 : 128, paddingLeft: mobile ? 24 : 48, paddingRight: mobile ? 24 : 48 }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: mobile ? 24 : 32, fontWeight: 600, color: C.sandText, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 16 }}>
            Get Your Score
          </h2>
          <p style={{ fontSize: mobile ? 16 : 18, color: "rgba(244,241,234,0.50)", lineHeight: 1.6, marginBottom: 32 }}>
            Six questions. Under two minutes. A complete structural analysis of your income.
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
        </div>
      </section>
    </div>
  );
}
