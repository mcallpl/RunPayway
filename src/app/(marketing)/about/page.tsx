"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  C, T, mono, sans, sp, maxW, secPad, px,
  h1, h2Style, h3Style, body, bodySm, cardStyle, ctaButtonLight,
  canHover,
} from "@/lib/design-tokens";

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

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

const fadeIn = (v: boolean, delay = 0) => ({
  opacity: v ? 1 : 0,
  transform: v ? "translateY(0)" : "translateY(16px)",
  transition: `opacity 600ms ease-out ${delay}ms, transform 600ms ease-out ${delay}ms`,
});


/* ================================================================== */
/* 1. HERO                                                             */
/* ================================================================== */
function Hero() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 120 : 180, paddingBottom: m ? 80 : 120, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: maxW, margin: "0 auto", textAlign: "center" }}>
        <div style={{ ...fadeIn(visible) }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 28 }}>
            <span style={{ ...T.label, color: C.teal }}>About</span>
            <span style={{ fontSize: 11, fontFamily: mono, fontWeight: 500, color: C.sandLight, padding: "3px 8px", borderRadius: 4, border: `1px solid ${C.sandBorder}` }}>RP-2.0</span>
          </div>
          <h1 style={{ ...h1(m), color: C.sandText, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 24 }}>
            A structural measurement{!m && <br />} system for income stability.
          </h1>
          <p style={{ ...body(m), color: C.sandMuted, maxWidth: 560, margin: "0 auto" }}>
            RunPayway&#8482; produces the Income Stability Score&#8482; — a deterministic structural assessment that measures how well your income holds up when conditions change.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 2. WHAT IS THE INCOME STABILITY SCORE                               */
/* ================================================================== */
function WhatIsISS() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ marginBottom: sp(2), ...fadeIn(visible) }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", color: C.light, fontFamily: mono }}>01</span>
        </div>
        <div style={{ ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.navy, letterSpacing: "-0.02em", marginBottom: 20 }}>
            The Income Stability Score&#8482;
          </h2>
          <p style={{ ...body(m), color: C.muted, marginBottom: 20 }}>
            A number between <span style={{ fontFamily: mono }}>0</span> and <span style={{ fontFamily: mono }}>100</span> that measures the structural durability of your income. It answers one question: if conditions changed, how well would your income hold up?
          </p>
          <p style={{ ...body(m), color: C.muted, marginBottom: 20 }}>
            Unlike credit scores, which measure borrowing history, or income verification, which confirms what you earned last month, the Income Stability Score&#8482; examines the architecture of how you earn — how many sources, how predictable, how much continues without active work, and how far forward it is committed.
          </p>
          <p style={{ ...body(m), color: C.muted }}>
            The result is a deterministic structural assessment. The same inputs always produce the same score. Every score maps to a fixed classification band under Model RP-2.0.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 3. WHO IT'S FOR                                                     */
/* ================================================================== */
function WhoItsFor() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const bullets = [
    "Independent contractors and freelancers",
    "Commission-based professionals",
    "Small business owners",
    "Consultants and advisors",
    "Anyone with multiple income sources",
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ marginBottom: sp(2), ...fadeIn(visible) }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", color: C.light, fontFamily: mono }}>02</span>
        </div>
        <div style={{ ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.navy, letterSpacing: "-0.02em", marginBottom: 20 }}>
            Who it&#8217;s for.
          </h2>
          <p style={{ ...body(m), color: C.muted, marginBottom: 28 }}>
            Anyone whose income does not arrive in a fixed paycheck. Business owners, self-employed professionals, consultants, contractors, agents, and anyone with variable or multi-source income.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {bullets.map((b, i) => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 12, ...fadeIn(visible, 100 + i * 60) }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
                <span style={{ ...body(m), color: C.muted, margin: 0 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 4. GOVERNANCE                                                       */
/* ================================================================== */
function Governance() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ marginBottom: sp(2), ...fadeIn(visible) }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", color: C.light, fontFamily: mono }}>03</span>
        </div>
        <div style={{ ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.navy, letterSpacing: "-0.02em", marginBottom: 20 }}>
            Model governance.
          </h2>
          <p style={{ ...body(m), color: C.muted, marginBottom: 20 }}>
            Every version of the scoring model is locked and versioned. The current version is Model RP-2.0. If any rule, weight, threshold, or classification boundary changes, the model increments to a new version number.
          </p>
          <p style={{ ...body(m), color: C.muted, marginBottom: 20 }}>
            A score generated under Model RP-2.0 can always be compared to another score generated under Model RP-2.0. The rules are identical. If the rules change, it becomes a new model — and every assessment is stamped with the version that produced it.
          </p>
          <p style={{ ...body(m), color: C.muted }}>
            Every assessment includes SHA-256 hashes that verify the report was produced by the stated model version and has not been modified. This is how institutional trust works: not through promises, but through verifiable, versioned outputs.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 5. VERIFICATION                                                     */
/* ================================================================== */
function Verification() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ marginBottom: sp(2), ...fadeIn(visible) }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", color: C.sandLight, fontFamily: mono }}>04</span>
        </div>
        <div style={{ ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.sandText, letterSpacing: "-0.02em", marginBottom: 20 }}>
            Every score is verifiable.
          </h2>
          <p style={{ ...body(m), color: C.sandMuted, marginBottom: 20 }}>
            Every assessment includes a SHA-256 hash, a model version stamp, and an immutable timestamp. These three elements prove the assessment was produced by Model RP-2.0 and has not been altered.
          </p>
          <p style={{ ...body(m), color: C.sandLight, marginBottom: 32 }}>
            Share your score with a lender, employer, or financial advisor. They can verify it independently.
          </p>

          <div style={{ display: "flex", gap: m ? 8 : 16, flexWrap: "wrap" as const, justifyContent: "center" }}>
            {["SHA-256 Hash", "Model Version Stamp", "Immutable Timestamp", "QR Verification"].map((badge, i) => (
              <div key={badge} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "8px 16px", borderRadius: 100,
                backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${C.sandBorder}`,
                ...fadeIn(visible, 200 + i * 60),
              }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: C.teal }} />
                <span style={{ ...T.micro, fontWeight: 600, color: C.sandMuted }}>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 6. WHO BUILT IT                                                     */
/* ================================================================== */
function Origin() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ marginBottom: sp(2), ...fadeIn(visible) }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", color: C.light, fontFamily: mono }}>05</span>
        </div>
        <div style={{ ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.navy, letterSpacing: "-0.02em", marginBottom: 20 }}>
            Why this exists.
          </h2>
          <div style={{ borderLeft: `2px solid ${C.teal}`, paddingLeft: m ? sp(3) : sp(4) }}>
            <p style={{ ...body(m), color: C.muted, marginBottom: 20 }}>
              Credit scores measure borrowing history. Income verification confirms what you earned last month. But nothing measured the structural durability of how you earn — until now.
            </p>
            <p style={{ ...body(m), color: C.muted, marginBottom: 20 }}>
              RunPayway&#8482; was built to give professionals a clear, verifiable way to understand the stability of their income. The score is private by default, requires no bank connection or credit pull, and belongs entirely to the individual who takes it.
            </p>
            <p style={{ ...body(m), color: C.muted }}>
              The model is designed for anyone whose income does not fit neatly into a fixed paycheck — business owners, self-employed professionals, consultants, contractors, agents, and anyone with variable or multi-source income.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 7. MODEL BADGE                                                      */
/* ================================================================== */
function ModelBadge() {
  const m = useMobile();

  return (
    <section style={{ backgroundColor: C.white, paddingTop: m ? 48 : 64, paddingBottom: m ? 48 : 64, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: maxW, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: m ? 16 : 32, flexWrap: "wrap" as const }}>
          {[
            { label: "Model RP-2.0", sub: "Current version" },
            { label: "Deterministic", sub: "Fixed scoring rules" },
            { label: "19 Industries", sub: "Full sector coverage" },
            { label: "Verifiable", sub: "Integrity on every record" },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: "center", minWidth: m ? 100 : 140 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, fontFamily: mono, marginBottom: 4 }}>{item.label}</div>
              <div style={{ ...T.micro, color: C.light }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 8. CTA                                                              */
/* ================================================================== */
function Cta() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: maxW, margin: "0 auto", textAlign: "center" }}>
        <div style={{ ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.sandText, letterSpacing: "-0.02em", marginBottom: 20 }}>
            Now that you know who built it{!m && <br />} &#8212; see your score.
          </h2>
          <p style={{ ...body(m), color: C.sandMuted, maxWidth: 440, margin: "0 auto 40px" }}>
            The free assessment takes under 2 minutes. No bank connection. No credit pull.
          </p>
          <Link href="/begin" style={{
            ...ctaButtonLight,
            height: m ? 48 : 56, paddingLeft: 36, paddingRight: 36, borderRadius: 10,
            backgroundColor: C.white, color: C.navy,
          }}>
            Start Your Free Assessment
          </Link>
          <div style={{ marginTop: 20, ...T.meta, color: C.sandLight }}>
            Under 2 minutes &#183; Instant result &#183; <span style={{ fontFamily: mono }}>$69</span> for the full report
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* EXPORT                                                              */
/* ================================================================== */
export default function AboutPage() {
  return (
    <div style={{ fontFamily: sans, overflowX: "hidden" }}>
      <Hero />
      <WhatIsISS />
      <WhoItsFor />
      <Governance />
      <Verification />
      <Origin />
      <ModelBadge />
      <Cta />
    </div>
  );
}
