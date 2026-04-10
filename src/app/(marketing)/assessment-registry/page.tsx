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

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code style={{ fontSize: 13, fontFamily: "monospace", backgroundColor: "rgba(14,26,43,0.05)", padding: "2px 6px", borderRadius: 4 }}>
      {children}
    </code>
  );
}

/* ================================================================== */
/* PAGE                                                                */
/* ================================================================== */

export default function AssessmentRegistryPage() {
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
            ASSESSMENT REGISTRY
          </div>
          <h1 style={{ fontSize: mobile ? 38 : 64, fontWeight: 700, color: C.navy, letterSpacing: "-0.035em", lineHeight: 1.05, marginBottom: 16 }}>
            Score Verification &amp; Record Integrity
          </h1>
          <p style={{ fontSize: mobile ? 16 : 18, color: muted, lineHeight: 1.6, maxWidth: 680, margin: "0 auto" }}>
            Every assessment issued by RunPayway is registered, hashed, and independently verifiable.
          </p>
        </div>
      </header>

      {/* CONTENT */}
      <section style={{ paddingTop: mobile ? 56 : 112, paddingBottom: mobile ? 56 : 112 }}>
        <div style={{ maxWidth: 820, margin: "0 auto", paddingLeft: mobile ? 24 : 24, paddingRight: mobile ? 24 : 24, display: "flex", flexDirection: "column" as const, gap: mobile ? 16 : 20 }}>

          {/* 1. What Gets Registered */}
          <div ref={s1.ref}>
            <Section number="1." title="What Gets Registered" mobile={mobile} visible={s1.visible}>
              <P>Every assessment produces a record containing the following fields:</P>
              <Bullet items={[
                "assessment_id \u2014 a UUID uniquely identifying this assessment",
                "authorization_code \u2014 the first 16 characters of the SHA-256 record hash",
                "model_version \u2014 the scoring model version used to produce the result",
                "assessment_date \u2014 the timestamp when the assessment was completed",
                "final_score \u2014 the numeric score (0\u2013100) assigned by the engine",
                "stability_band \u2014 the categorical band (Volatile, Exposed, Stable, Resilient)",
                "registry_status \u2014 either Active (current) or Superseded (replaced by a newer assessment)",
              ]} />
              <P style={{ marginBottom: 0 }}>These fields form the canonical record. Every other piece of assessment data is derived from or linked to this record.</P>
            </Section>
          </div>

          {/* 2. Integrity Verification */}
          <div ref={s2.ref}>
            <Section number="2." title="Integrity Verification" mobile={mobile} visible={s2.visible}>
              <P>Four SHA-256 hashes protect each assessment record:</P>
              <Bullet items={[
                "input_hash \u2014 computed from the canonical inputs provided by the user",
                "output_hash \u2014 computed from the scores produced by the engine",
                "manifest_hash \u2014 computed from the model versions active at assessment time",
                "record_hash \u2014 computed from the combination of all three hashes above",
              ]} />
              <P>The authorization_code is derived from the record_hash. It serves as a compact, shareable proof of authenticity.</P>
              <P style={{ marginBottom: 0 }}>Changing any input, score, or model version would produce a different hash \u2014 making tampering detectable. If a record has been altered after issuance, the hashes will not match and verification will fail.</P>
            </Section>
          </div>

          {/* 3. Public Verification */}
          <div ref={s3.ref}>
            <Section number="3." title="Public Verification" mobile={mobile} visible={s3.visible}>
              <P>Any record can be verified at <Code>/verify</Code> using the record_id and authorization_code. No login is required.</P>
              <P>The verification endpoint confirms:</P>
              <Bullet items={[
                "The score is authentic and has not been modified since issuance",
                "The model version used to generate the assessment",
                "The date the assessment was completed",
                "The stability band assigned to the result",
              ]} />
              <P style={{ marginBottom: 0 }}>Verification is available to employers, lenders, partners, or anyone the user shares their code with. The user controls who sees their results by choosing who to share the code with.</P>
            </Section>
          </div>

          {/* 4. Record Lifecycle */}
          <div ref={s4.ref}>
            <Section number="4." title="Record Lifecycle" mobile={mobile} visible={s4.visible}>
              <P><strong>Active</strong> \u2014 the most recent assessment for this profile. Only one assessment per profile can be Active at any time.</P>
              <P><strong>Superseded</strong> \u2014 a prior assessment that has been replaced by a newer one under the same profile. When a new assessment is completed, the previous Active record transitions to Superseded.</P>
              <P style={{ marginBottom: 0 }}>Superseded records remain fully verifiable but are marked as historical. The verification endpoint will indicate that the record is no longer the most recent assessment for that profile.</P>
            </Section>
          </div>

          {/* 5. Storage Architecture */}
          <div ref={s5.ref}>
            <Section number="5." title="Storage Architecture" mobile={mobile} visible={s5.visible}>
              <P>Records are persisted in Cloudflare D1, the production database. D1 serves as the authoritative source of truth for all assessment records.</P>
              <P>A secondary copy is stored in the user&apos;s browser via localStorage for offline access. This allows users to view their most recent assessment without an internet connection.</P>
              <P style={{ marginBottom: 0 }}>The server record is authoritative. If the browser copy and server copy disagree, the server copy is correct. The browser copy exists purely for convenience and is overwritten on the next sync.</P>
            </Section>
          </div>

          {/* 6. Access Codes */}
          <div ref={s6.ref}>
            <Section number="6." title="Access Codes" mobile={mobile} visible={s6.visible}>
              <P>Each assessment generates a deterministic access code. The access code is a Base64-encoded JSON payload containing the core metrics from the assessment.</P>
              <P>Access codes can be shared with others, pasted into the dashboard, and used to reconstruct the full assessment view. They provide a portable, self-contained snapshot of the assessment results.</P>
              <Bullet items={[
                "Access codes do not expire \u2014 a shared code works indefinitely",
                "Access codes do not grant write access \u2014 only read access to the assessment results",
                "Access codes are deterministic \u2014 the same assessment always produces the same code",
              ]} />
              <P style={{ marginBottom: 0 }}>This design means users can share their results via any channel \u2014 email, text, printed QR code \u2014 without worrying about expiration or permissions.</P>
            </Section>
          </div>

          {/* 7. Badge Verification */}
          <div ref={s7.ref}>
            <Section number="7." title="Badge Verification" mobile={mobile} visible={s7.visible}>
              <P>Assessments can be displayed as embeddable badges via the <Code>/api/badge/[code]</Code> endpoint. Badges render as SVG images showing the score, band, and a verification link.</P>
              <P>The embed variant at <Code>/api/badge/[code]/embed</Code> returns HTML suitable for embedding on external websites. This allows users to display a verified RunPayway badge on their personal site, portfolio, or LinkedIn profile.</P>
              <P style={{ marginBottom: 0 }}>Badges are generated on demand from the access code \u2014 they are not stored as static assets. This ensures the badge always reflects the data encoded in the access code.</P>
            </Section>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <section style={{ backgroundColor: C.navy, paddingTop: mobile ? 88 : 128, paddingBottom: mobile ? 88 : 128, paddingLeft: mobile ? 24 : 48, paddingRight: mobile ? 24 : 48 }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: mobile ? 24 : 32, fontWeight: 600, color: C.sandText, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 16 }}>
            Transparent by design.
          </h2>
          <p style={{ fontSize: mobile ? 16 : 18, color: "rgba(244,241,234,0.50)", lineHeight: 1.6, marginBottom: 32 }}>
            Every score is verifiable. Every record is tamper-evident. No black boxes.
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
            RUNPAYWAY ASSESSMENT REGISTRY
          </p>
        </div>
      </section>
    </div>
  );
}
