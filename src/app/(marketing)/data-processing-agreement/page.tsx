"use client";

import { useEffect, useRef, useState } from "react";
import {
  C, T, mono, sans, sp, maxW, secPad, px,
  h1, h2Style, body, bodySm,
} from "@/lib/design-tokens";

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

export default function DataProcessingAgreementPage() {
  const hero = useInView();
  const content = useInView();
  const m = useMobile();

  const sections = [
    {
      title: "1. Definitions",
      items: [
        "\"Controller\" means the entity that determines the purposes and means of Processing Personal Data — the Customer.",
        "\"Processor\" means the entity that Processes Personal Data on behalf of the Controller — PeopleStar Enterprises, LLC (RunPayway\u2122).",
        "\"Personal Data\" means any information relating to an identified or identifiable natural person, as provided by the Customer through the RunPayway\u2122 platform.",
        "\"Processing\" means any operation performed on Personal Data, including collection, storage, use, scoring, and deletion.",
        "\"Sub-processor\" means any third party engaged by the Processor to Process Personal Data.",
      ],
    },
    {
      title: "2. Scope of Processing",
      items: [
        "RunPayway\u2122 processes the following categories of Personal Data: assessment inputs (structural income dimensions), email addresses, assessment titles, and industry sector classifications.",
        "Processing is performed solely for the purpose of generating the Income Stability Score\u2122, diagnostic reports, and Command Center functionality.",
        "No financial account data, bank credentials, credit data, or transaction history is collected or processed.",
        "All scoring is deterministic under Model RP-2.0. No Personal Data is used for model training, profiling, or automated decision-making beyond the assessment itself.",
      ],
    },
    {
      title: "3. Obligations of the Processor",
      items: [
        "Process Personal Data only on documented instructions from the Controller, unless required by law.",
        "Ensure that persons authorized to Process Personal Data have committed to confidentiality.",
        "Implement appropriate technical and organizational security measures, including encrypted data transmission and secure processing.",
        "Not engage another Processor without prior written authorization of the Controller.",
        "Assist the Controller in responding to data subject access, rectification, erasure, and portability requests.",
        "Delete or return all Personal Data at the end of the service relationship, at the Controller's choice.",
        "Make available to the Controller all information necessary to demonstrate compliance.",
      ],
    },
    {
      title: "4. Sub-processors",
      items: [
        "RunPayway\u2122 uses the following sub-processors: Stripe (payment processing), Resend (email delivery), Cloudflare (CDN and worker functions), GoDaddy (hosting).",
        "The Controller is notified of any intended changes to sub-processors and may object within 30 days.",
        "Each sub-processor is bound by data protection obligations no less protective than those in this agreement.",
      ],
    },
    {
      title: "5. Data Security",
      items: [
        "All data in transit is encrypted using TLS 1.2 or higher.",
        "Assessment records include SHA-256 integrity hashes for tamper detection.",
        "Access to Personal Data is limited to authorized personnel on a need-to-know basis.",
        "The platform does not store passwords. Monitoring Portal authentication uses email and a hashed 4-digit PIN.",
        "No Personal Data is sold, rented, or shared with third parties for marketing purposes.",
      ],
    },
    {
      title: "6. Data Subject Rights",
      items: [
        "Data subjects may request access to, rectification of, or deletion of their Personal Data at any time.",
        "Requests can be submitted through the RunPayway\u2122 privacy request form or by email at privacy@peoplestar.com.",
        "The Processor will respond to data subject requests within 30 days.",
      ],
    },
    {
      title: "7. Data Retention",
      items: [
        "Assessment records are retained for the duration of the service relationship plus 12 months, unless deletion is requested earlier.",
        "Monitoring session data is retained for the duration of the subscription period plus 90 days.",
        "Audit logs are retained for 24 months for compliance purposes.",
      ],
    },
    {
      title: "8. International Transfers",
      items: [
        "Personal Data is processed and stored in the United States.",
        "For transfers outside the United States, appropriate safeguards are implemented in accordance with applicable data protection laws.",
      ],
    },
    {
      title: "9. Breach Notification",
      items: [
        "In the event of a Personal Data breach, the Processor will notify the Controller without undue delay and no later than 72 hours after becoming aware of the breach.",
        "Notification will include the nature of the breach, categories of data affected, and measures taken to address the breach.",
      ],
    },
    {
      title: "10. Governing Law",
      items: [
        "This Data Processing Agreement is governed by the laws of the State of California, United States.",
        "For enterprise customers subject to GDPR, the Standard Contractual Clauses (SCCs) are incorporated by reference.",
      ],
    },
  ];

  return (
    <div style={{ fontFamily: sans, overflowX: "hidden" }}>
      {/* Hero */}
      <section ref={hero.ref} style={{ backgroundColor: C.navy, paddingTop: m ? 120 : 180, paddingBottom: m ? 80 : 120, paddingLeft: px(m), paddingRight: px(m) }}>
        <div style={{ maxWidth: maxW, margin: "0 auto", textAlign: "center" }}>
          <div style={{ ...fadeIn(hero.visible) }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 28 }}>
              <span style={{ ...T.label, color: C.teal }}>Data Processing Agreement</span>
              <span style={{ fontSize: 11, fontFamily: mono, fontWeight: 500, color: C.sandLight, padding: "3px 8px", borderRadius: 4, border: `1px solid ${C.sandBorder}` }}>Enterprise</span>
            </div>
            <h1 style={{ ...h1(m), color: C.sandText, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 24 }}>
              Data Processing Agreement
            </h1>
            <p style={{ ...body(m), color: C.sandMuted, maxWidth: 520, margin: "0 auto" }}>
              This agreement governs how RunPayway&#8482; processes Personal Data on behalf of enterprise customers under applicable data protection laws.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section ref={content.ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ marginBottom: 32, ...fadeIn(content.visible) }}>
            <p style={{ ...T.meta, color: C.light }}>
              Effective Date: April 2, 2026 &middot; PeopleStar Enterprises, LLC &middot; Orange County, California, USA
            </p>
          </div>

          {sections.map((section, si) => (
            <div key={section.title} style={{ marginBottom: 40, ...fadeIn(content.visible, 80 + si * 40) }}>
              <h2 style={{ fontSize: m ? 18 : 20, fontWeight: 600, color: C.navy, marginBottom: 16 }}>{section.title}</h2>
              {section.items.map((item, ii) => (
                <div key={ii} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 8 }} />
                  <p style={{ ...bodySm(m), color: C.muted, margin: 0, lineHeight: 1.65 }}>{item}</p>
                </div>
              ))}
            </div>
          ))}

          <div style={{ borderTop: `1px solid ${C.softBorder}`, paddingTop: 24, marginTop: 40, ...fadeIn(content.visible, 600) }}>
            <p style={{ ...T.meta, color: C.light, lineHeight: 1.6 }}>
              For enterprise inquiries or to execute this agreement, contact us at privacy@peoplestar.com or through our contact page.
            </p>
            <p style={{ ...T.micro, color: C.light, marginTop: 12 }}>
              RunPayway&#8482; is a product of PeopleStar Enterprises, LLC. Model RP-2.0. This document is provided for informational purposes and does not constitute legal advice.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
