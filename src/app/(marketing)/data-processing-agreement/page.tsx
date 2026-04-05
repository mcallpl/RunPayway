"use client";

import { useState, useEffect, useRef } from "react";
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
const light = "rgba(14,26,43,0.52)";
const border = "#E5E7EB";

/* ================================================================== */
/* DATA                                                                */
/* ================================================================== */

const sections = [
  { title: "1. Definitions", items: [
    "\"Controller\" means the entity that determines the purposes and means of Processing Personal Data \u2014 the Customer.",
    "\"Processor\" means the entity that Processes Personal Data on behalf of the Controller \u2014 PeopleStar Enterprises, LLC (RunPayway\u2122).",
    "\"Personal Data\" means any information relating to an identified or identifiable natural person, as provided by the Customer through the RunPayway\u2122 platform.",
    "\"Processing\" means any operation performed on Personal Data, including collection, storage, use, scoring, and deletion.",
    "\"Sub-processor\" means any third party engaged by the Processor to Process Personal Data.",
  ]},
  { title: "2. Scope of Processing", items: [
    "RunPayway\u2122 processes the following categories of Personal Data: assessment inputs (structural income dimensions), email addresses, assessment titles, and industry sector classifications.",
    "Processing is performed solely for the purpose of generating the Income Stability Score\u2122, diagnostic reports, and Command Center functionality.",
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
      <header style={{ backgroundColor: C.white, position: "relative", overflow: "hidden", paddingTop: m ? 80 : 140, paddingBottom: m ? 56 : 100, paddingLeft: m ? 20 : 24, paddingRight: m ? 20 : 24 }}>
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div ref={hero.ref} style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1, opacity: hero.visible ? 1 : 0, transform: hero.visible ? "translateY(0)" : "translateY(10px)", transition: "opacity 500ms ease-out, transform 500ms ease-out" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.teal }}>Data Processing Agreement</span>
            <span style={{ fontSize: 10, fontWeight: 500, color: "rgba(244,241,234,0.40)", padding: "3px 8px", borderRadius: 4, border: "1px solid rgba(244,241,234,0.10)" }}>Enterprise</span>
          </div>
          <h1 style={{ fontSize: m ? 32 : 48, fontWeight: 600, color: C.navy, letterSpacing: "-0.03em", lineHeight: 1.08, marginBottom: 20 }}>
            Data Processing Agreement
          </h1>
          <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, maxWidth: 520, margin: "0 auto" }}>
            This agreement governs how RunPayway&#8482; processes Personal Data on behalf of enterprise customers under applicable data protection laws.
          </p>
        </div>
      </header>

      {/* CONTENT */}
      <section style={{ paddingTop: m ? 56 : 112, paddingBottom: m ? 56 : 112, paddingLeft: m ? 20 : 24, paddingRight: m ? 20 : 24 }}>
        <div ref={content.ref} style={{ maxWidth: 820, margin: "0 auto" }}>
          <p style={{ fontSize: 13, color: light, marginBottom: m ? 32 : 48, opacity: content.visible ? 1 : 0, transform: content.visible ? "translateY(0)" : "translateY(10px)", transition: "opacity 500ms ease-out, transform 500ms ease-out" }}>
            Effective Date: April 2, 2026 &middot; PeopleStar Enterprises, LLC &middot; Orange County, California, USA
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
              RunPayway&#8482; is a product of PeopleStar Enterprises, LLC. Model RP-2.0. This document is provided for informational purposes and does not constitute legal advice.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section style={{ backgroundColor: C.navy, paddingTop: m ? 56 : 80, paddingBottom: m ? 56 : 80, paddingLeft: m ? 20 : 24, paddingRight: m ? 20 : 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", width: 400, height: 400, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: m ? 24 : 32, fontWeight: 600, color: C.navy, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 12 }}>
            RunPayway&#8482;
          </div>
          <p style={{ fontSize: 14, color: "rgba(244,241,234,0.40)", lineHeight: 1.6, marginBottom: 16 }}>
            Structural income measurement system.
          </p>
          <p style={{ fontSize: 12, color: light, letterSpacing: "0.04em" }}>
            Model RP-2.0 &middot; Deterministic &middot; Version-controlled
          </p>
        </div>
      </section>
    </div>
  );
}
