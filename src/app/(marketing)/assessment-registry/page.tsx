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
            Record Registration and Verification
          </h1>
          <p style={{ fontSize: mobile ? 16 : 18, color: muted, lineHeight: 1.6, maxWidth: 680, margin: "0 auto" }}>
            A registered RunPayway&#8482; assessment record can be confirmed with its identifier and authorization code.
          </p>
        </div>
      </header>

      {/* CONTENT */}
      <section style={{ paddingTop: mobile ? 56 : 112, paddingBottom: mobile ? 56 : 112 }}>
        <div style={{ maxWidth: 820, margin: "0 auto", paddingLeft: mobile ? 24 : 24, paddingRight: mobile ? 24 : 24, display: "flex", flexDirection: "column" as const, gap: mobile ? 16 : 20 }}>

          {/* 1. What Gets Registered */}
          <div ref={s1.ref}>
            <Section number="1." title="What Gets Registered" mobile={mobile} visible={s1.visible}>
              <P>When an assessment is registered, it produces a record stamped with the model version and assessment date under which it was issued. Each registered record carries an opaque assessment identifier and an authorization code for verification.</P>
              <P style={{ marginBottom: 0 }}>These fields form the canonical record. Once written, a record's assessment content is retained as issued; a new assessment produces a new record rather than altering an existing one.</P>
            </Section>
          </div>

          {/* 2. Integrity Verification */}
          <div ref={s2.ref}>
            <Section number="2." title="Record Integrity" mobile={mobile} visible={s2.visible}>
              <P>Records are written to the registry once and retained as issued. The application does not edit the assessment content of a record after it is written; a new assessment creates a new record rather than altering an existing one.</P>
              <P style={{ marginBottom: 0 }}>Some issuance paths also store a SHA-256 checksum of the assessment inputs, which gives those records an additional content fingerprint. A record's lifecycle status can change, for example from Active to Superseded, while its assessment content is retained as issued.</P>
            </Section>
          </div>

          {/* 3. Public Verification */}
          <div ref={s3.ref}>
            <Section number="3." title="Public Verification" mobile={mobile} visible={s3.visible}>
              <P>Any record can be looked up at <Code>/verify</Code> using the assessment identifier and authorization code. No login is required.</P>
              <P>This confirms that the identifier and authorization code correspond to a registered record and returns the assessment date on which it was issued. It does not recompute the assessment, verify a signature, or require sharing the underlying assessment inputs.</P>
              <P style={{ marginBottom: 0 }}>Lookup is available to any party the authorization code is shared with, including connected systems, lenders, platforms, and partners. The party that holds the code controls who can confirm that the record is registered.</P>
            </Section>
          </div>

          {/* 4. Record Lifecycle */}
          <div ref={s4.ref}>
            <Section number="4." title="Record Lifecycle" mobile={mobile} visible={s4.visible}>
              <P><strong>Active</strong> is the most recent assessment. Only one assessment per profile can be Active at any time.</P>
              <P><strong>Superseded</strong> marks a prior assessment that has been replaced by a newer one. Superseded records remain fully verifiable but are marked as historical.</P>
              <P style={{ marginBottom: 0 }}>When a new assessment is issued for a profile, the previous record transitions to Superseded automatically.</P>
            </Section>
          </div>

          {/* 5. Data Storage */}
          <div ref={s5.ref}>
            <Section number="5." title="Data Storage" mobile={mobile} visible={s5.visible}>
              <P>Records are stored on secure production infrastructure. A local copy is available in the browser for offline access.</P>
              <P style={{ marginBottom: 0 }}>The server record is authoritative. If the local copy and server copy disagree, the server copy is correct.</P>
            </Section>
          </div>

          {/* 6. Access Codes */}
          <div ref={s6.ref}>
            <Section number="6." title="Access Codes" mobile={mobile} visible={s6.visible}>
              <P>Each assessment generates an access code that can be shared with authorized recipients. Access codes provide a portable, self-contained snapshot of the approved assessment output.</P>
              <Bullet items={[
                "Access codes do not expire",
                "Access codes provide read-only access to the approved assessment output",
                "The same assessment always produces the same code",
              ]} />
              <P style={{ marginBottom: 0 }}>The approved output can be shared through any channel, including email, secure message, or print, without expiration.</P>
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
            Every measurement is verifiable. Every record is tamper-evident. No black boxes.
          </p>
          <Link href="/organizations" style={{
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
            For organizations
          </Link>
          <p style={{ fontSize: 14, fontWeight: 500, color: "rgba(244,241,234,0.40)", marginTop: 16 }}>
            Governed measurement | Approved, external-safe outputs | Private by default
          </p>
          <p style={{ fontSize: 13, color: "rgba(244,241,234,0.30)", marginTop: 24, letterSpacing: "0.04em" }}>
            RUNPAYWAY&#8482; ASSESSMENT REGISTRY
          </p>
        </div>
      </section>
    </div>
  );
}
