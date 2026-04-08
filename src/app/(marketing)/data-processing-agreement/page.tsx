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
/* DATA                                                                */
/* ================================================================== */

const sections = [
  { title: "1. Definitions", items: [
    "\"Controller\" means the entity that determines the purposes and means of Processing Personal Data — the Customer.",
    "\"Processor\" means the entity that Processes Personal Data on behalf of the Controller — PeopleStar Enterprises, INC. (RunPayway\u2122).",
    "\"Personal Data\" means any information relating to an identified or identifiable natural person, as provided by the Customer through the RunPayway\u2122 platform.",
    "\"Processing\" means any operation performed on Personal Data, including collection, storage, use, scoring, and deletion.",
    "\"Sub-processor\" means any third party engaged by the Processor to Process Personal Data.",
  ]},
  { title: "2. Scope of Processing", items: [
    "RunPayway\u2122 processes the following categories of Personal Data: assessment inputs (structural income dimensions), email addresses, assessment titles, and industry sector classifications.",
    "Processing is performed solely for the purpose of generating the Income Stability Score\u2122, diagnostic reports, and Dashboard functionality.",
    "No financial account data, bank credentials, credit data, or transaction history is collected or processed.",
    "All scoring is deterministic under Model RP-2.0. No Personal Data is used for model training, profiling, or automated decision-making beyond the assessment itself.",
  ]},
  { title: "3. Obligations of the Processor", items: [
    "Process Personal Data only on documented instructions from the Controller, unless required by law.",
    "Ensure that persons authorized to Process Personal Data have committed to confidentiality.",
    "Implement appropriate technical and organizational security measures, including encrypted data transmission and secure processing.",
    "Not engage another Processor without prior written authorization of the Controller.",
    "Assist the Controller in responding to data subject access, rectification, erasure, and portability requests.",
    "Delete or return all Personal Data at the end of the service relationship, at the Controller's choice.",
    "Make available to the Controller all information necessary to demonstrate compliance.",
  ]},
  { title: "4. Sub-processors", items: [
    "RunPayway\u2122 uses the following sub-processors: Stripe (payment processing), Resend (email delivery), Cloudflare (CDN and worker functions), GoDaddy (hosting).",
    "The Controller is notified of any intended changes to sub-processors and may object within 30 days.",
    "Each sub-processor is bound by data protection obligations no less protective than those in this agreement.",
  ]},
  { title: "5. Data Security", items: [
    "All data in transit is encrypted using TLS 1.2 or higher.",
    "Assessment records include SHA-256 integrity hashes for tamper detection.",
    "Access to Personal Data is limited to authorized personnel on a need-to-know basis.",
    "The platform does not store passwords. Monitoring Portal authentication uses email and a hashed 4-digit PIN.",
    "No Personal Data is sold, rented, or shared with third parties for marketing purposes.",
  ]},
  { title: "6. Data Subject Rights", items: [
    "Data subjects may request access to, rectification of, or deletion of their Personal Data at any time.",
    "Requests can be submitted through the RunPayway\u2122 privacy request form or by email at privacy@peoplestar.com.",
    "The Processor will respond to data subject requests within 30 days.",
  ]},
  { title: "7. Data Retention", items: [
    "Assessment records are retained for the duration of the service relationship plus 12 months, unless deletion is requested earlier.",
    "Monitoring session data is retained for the duration of the subscription period plus 90 days.",
    "Audit logs are retained for 24 months for compliance purposes.",
  ]},
  { title: "8. International Transfers", items: [
    "Personal Data is processed and stored in the United States.",
    "For transfers outside the United States, appropriate safeguards are implemented in accordance with applicable data protection laws.",
  ]},
  { title: "9. Breach Notification", items: [
    "In the event of a Personal Data breach, the Processor will notify the Controller without undue delay and no later than 72 hours after becoming aware of the breach.",
    "Notification will include the nature of the breach, categories of data affected, and measures taken to address the breach.",
  ]},
  { title: "10. Governing Law", items: [
    "This Data Processing Agreement is governed by the laws of the State of California, United States.",
    "For enterprise customers subject to GDPR, the Standard Contractual Clauses (SCCs) are incorporated by reference.",
  ]},
];

/* ================================================================== */
/* PAGE                                                                */
/* ================================================================== */

export default function DataProcessingAgreementPage() {
  const hero = useInView();
  const content = useInView();
  const m = useMobile();

  return (
    <div style={{ background: "#FAFAFA", fontFamily: sans }}>

      {/* HERO */}
      <header style={{ backgroundColor: C.sand, paddingTop: m ? 104 : 152, paddingBottom: m ? 56 : 88, paddingLeft: m ? 20 : 48, paddingRight: m ? 20 : 48 }}>
        <div ref={hero.ref} style={{ maxWidth: 860, margin: "0 auto", textAlign: "center", opacity: hero.visible ? 1 : 0, transform: hero.visible ? "translateY(0)" : "translateY(10px)", transition: "opacity 500ms ease-out, transform 500ms ease-out" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal }}>DATA PROCESSING AGREEMENT</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: muted, padding: "3px 10px", borderRadius: 6, border: `1px solid rgba(14,26,43,0.10)`, backgroundColor: "rgba(14,26,43,0.03)" }}>Enterprise</span>
          </div>
          <h1 style={{ fontSize: m ? 38 : 64, fontWeight: 700, color: C.navy, letterSpacing: "-0.035em", lineHeight: 1.05, marginBottom: 16 }}>
            Data Processing Agreement
          </h1>
          <p style={{ fontSize: m ? 15 : 16, fontWeight: 600, color: C.navy, marginBottom: 24 }}>
            Effective Date: April 2, 2026
          </p>
          <p style={{ fontSize: m ? 16 : 18, color: muted, lineHeight: 1.6, maxWidth: 640, margin: "0 auto" }}>
            This Data Processing Agreement (DPA) outlines how RunPayway&#8482; processes Personal Data on behalf of enterprise customers in compliance with applicable data protection laws.
          </p>
        </div>
      </header>

      {/* CONTENT */}
      <section style={{ paddingTop: m ? 56 : 112, paddingBottom: m ? 56 : 112, paddingLeft: m ? 20 : 24, paddingRight: m ? 20 : 24 }}>
        <div ref={content.ref} style={{ maxWidth: 820, margin: "0 auto" }}>
          <p style={{ fontSize: 13, color: light, marginBottom: m ? 32 : 48, opacity: content.visible ? 1 : 0, transform: content.visible ? "translateY(0)" : "translateY(10px)", transition: "opacity 500ms ease-out, transform 500ms ease-out" }}>
            PeopleStar Enterprises, INC. &middot; Orange County, California, USA
          </p>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: m ? 16 : 20 }}>
            {sections.map((section, si) => (
              <div key={section.title} style={{
                background: C.white, borderRadius: 16, border: `1px solid ${border}`,
                padding: m ? "28px 24px" : "36px 40px",
                boxShadow: "0 1px 4px rgba(14,26,43,0.03)",
                opacity: content.visible ? 1 : 0, transform: content.visible ? "translateY(0)" : "translateY(10px)",
                transition: `opacity 500ms ease-out ${80 + si * 40}ms, transform 500ms ease-out ${80 + si * 40}ms`,
              }}>
                <h2 style={{ fontSize: m ? 18 : 20, fontWeight: 600, color: C.navy, letterSpacing: "-0.02em", marginBottom: 18, lineHeight: 1.3 }}>{section.title}</h2>
                {section.items.map((item, ii) => (
                  <div key={ii} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: ii < section.items.length - 1 ? 12 : 0 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 8 }} />
                    <p style={{ fontSize: 14, color: muted, margin: 0, lineHeight: 1.75 }}>{item}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${border}`, paddingTop: 28, marginTop: m ? 32 : 48, opacity: content.visible ? 1 : 0, transition: "opacity 500ms ease-out 600ms" }}>
            <p style={{ fontSize: 14, color: light, lineHeight: 1.65, marginBottom: 12 }}>
              For enterprise inquiries or to execute this agreement, contact us through our contact page.
            </p>
            <p style={{ fontSize: 13, color: light }}>
              RunPayway&#8482; is a product of PeopleStar Enterprises, INC.. Model RP-2.0. This document is provided for informational purposes and does not constitute legal advice.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section style={{ backgroundColor: C.navy, paddingTop: m ? 88 : 128, paddingBottom: m ? 88 : 128, paddingLeft: m ? 20 : 48, paddingRight: m ? 20 : 48 }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.sandText, marginBottom: 16 }}>
            Contact Us for Data Protection Inquiries
          </h2>
          <p style={{ fontSize: m ? 16 : 18, color: "rgba(244,241,234,0.50)", lineHeight: 1.6, marginBottom: 32, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            For any data protection requests or concerns, please reach out through the RunPayway&#8482; contact form or by email at privacy@peoplestar.com.
          </p>
          <Link href="/contact" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: m ? 56 : 60, width: m ? "100%" : "auto",
            padding: m ? "0 28px" : "0 32px",
            borderRadius: 16, backgroundColor: C.white, color: C.navy,
            fontSize: 16, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 8px 24px rgba(14,26,43,0.08)",
            border: "1px solid rgba(244,241,234,0.45)",
            transition: "transform 200ms, box-shadow 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(244,241,234,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.08)"; }}>
            Contact Us
          </Link>
          <p style={{ fontSize: 13, color: "rgba(244,241,234,0.30)", marginTop: 24, letterSpacing: "0.04em" }}>
            Income Stability Score&#8482; &middot; Powered by Structural Stability Model RP-2.0
          </p>
        </div>
      </section>
    </div>
  );
}
