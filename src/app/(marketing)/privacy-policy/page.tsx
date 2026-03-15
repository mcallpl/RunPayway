"use client";

import { useState, useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Shared hooks                                                       */
/* ------------------------------------------------------------------ */

function useMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return mobile;
}

function useInView(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F7F6F3",
  sandDk: "#EDECEA",
  muted: "#6B7280",
  light: "#9CA3AF",
  gradient: "linear-gradient(135deg, #0E1A2B 0%, #4B3FAE 50%, #1F6D7A 100%)",
};

/* ------------------------------------------------------------------ */
/*  Section component                                                  */
/* ------------------------------------------------------------------ */

function Section({
  number,
  title,
  children,
  mobile,
  visible,
}: {
  number?: string;
  title: string;
  children: React.ReactNode;
  mobile: boolean;
  visible: boolean;
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        border: "1px solid rgba(14,26,43,0.06)",
        padding: mobile ? "28px 24px" : "36px 36px",
        boxShadow: "0 2px 8px rgba(14,26,43,0.04)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 600ms ease, transform 600ms ease",
      }}
    >
      <h2
        style={{
          fontSize: mobile ? 17 : 19,
          fontWeight: 700,
          color: B.navy,
          letterSpacing: "-0.02em",
          marginBottom: 16,
          lineHeight: 1.3,
        }}
      >
        {number && <span style={{ color: B.purple, marginRight: 8 }}>{number}</span>}
        {title}
      </h2>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Text helpers                                                       */
/* ------------------------------------------------------------------ */

function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ fontSize: 15, color: B.muted, lineHeight: 1.75, marginBottom: 12, ...style }}>
      {children}
    </p>
  );
}

function Bullet({ items }: { items: string[] }) {
  return (
    <ul style={{ padding: 0, margin: "0 0 12px", listStyle: "none" }}>
      {items.map((item) => (
        <li
          key={item}
          style={{
            fontSize: 15,
            color: B.muted,
            lineHeight: 1.75,
            paddingLeft: 20,
            position: "relative",
          }}
        >
          <span style={{ position: "absolute", left: 0, color: B.purple, fontSize: 11, lineHeight: "26px" }}>●</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function SubHead({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 14, fontWeight: 700, color: B.navy, marginBottom: 10, marginTop: 16 }}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PrivacyPolicyPage() {
  const mobile = useMobile();
  const heroAnim = useInView();

  // Create refs for each section
  const sectionRefs = Array.from({ length: 15 }, () => useInView());

  return (
    <div style={{ background: B.sand }}>
      {/* ============================================================ */}
      {/*  Hero                                                        */}
      {/* ============================================================ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: B.gradient,
          paddingTop: mobile ? 72 : 100,
          paddingBottom: mobile ? 72 : 100,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            mixBlendMode: "soft-light",
            pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        />

        <div
          ref={heroAnim.ref}
          className="mx-auto"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 820,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            textAlign: "center",
            opacity: heroAnim.visible ? 1 : 0,
            transform: heroAnim.visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 700ms ease, transform 700ms ease",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 100,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              marginBottom: 28,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.70)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Legal
            </span>
          </div>

          <h1
            style={{
              fontSize: mobile ? 30 : 44,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            Privacy Policy
          </h1>

          <p style={{ fontSize: mobile ? 15 : 17, color: "rgba(255,255,255,0.60)", lineHeight: 1.7, marginBottom: 8 }}>
            RunPayway™ · Income Stability Score™
          </p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.40)" }}>
            Structural Stability Model RP-1.0 | Version 1.0
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Content                                                     */}
      {/* ============================================================ */}
      <section style={{ paddingTop: mobile ? 48 : 72, paddingBottom: mobile ? 64 : 96 }}>
        <div
          className="mx-auto"
          style={{
            maxWidth: 780,
            paddingLeft: mobile ? 20 : 40,
            paddingRight: mobile ? 20 : 40,
            display: "flex",
            flexDirection: "column",
            gap: mobile ? 20 : 24,
          }}
        >
          {/* Effective date + entity info */}
          <div ref={sectionRefs[0].ref}>
            <Section title="RunPayway™" mobile={mobile} visible={sectionRefs[0].visible}>
              <P>Effective Date: April 1, 2026</P>
              <P style={{ fontWeight: 600, color: B.navy, marginBottom: 4 }}>Operated by PeopleStar Enterprises, Inc.</P>
              <P>
                24312 Airporter Way<br />
                Laguna Niguel, California 92677<br />
                United States
              </P>
              <P>
                <span style={{ fontWeight: 600, color: B.navy }}>Privacy Contact</span><br />
                privacy@runpayway.com
              </P>
              <P style={{ marginBottom: 0 }}>
                PeopleStar Enterprises, Inc. acts as the data controller for personal information processed through the RunPayway™ platform.
              </P>
            </Section>
          </div>

          {/* 1. Overview */}
          <div ref={sectionRefs[1].ref}>
            <Section number="1." title="Overview" mobile={mobile} visible={sectionRefs[1].visible}>
              <P>This Privacy Policy describes how RunPayway™ collects, uses, stores, and protects information in connection with the Income Stability Score™ and related services.</P>
              <P>This policy applies to information collected through:</P>
              <Bullet items={[
                "the RunPayway™ website",
                "Income Stability Score™ assessments",
                "account creation",
                "subscription management",
                "inquiry submissions",
                "registry verification services",
              ]} />
              <P style={{ marginBottom: 0 }}>RunPayway™ collects only the information reasonably necessary to provide the Income Stability Score™ assessment and operate the platform.</P>
            </Section>
          </div>

          {/* 2. Information Collected */}
          <div ref={sectionRefs[2].ref}>
            <Section number="2." title="Information Collected" mobile={mobile} visible={sectionRefs[2].visible}>
              <SubHead>A. Categories of Personal Information Collected</SubHead>
              <P>RunPayway™ may collect the following categories of personal information:</P>
              <Bullet items={[
                "Identifiers — name and email address",
                "Account information — login credentials and account identifiers",
                "Billing information — subscription and payment transaction details",
                "Assessment inputs — user-provided responses used to generate the Income Stability Score™",
                "Technical information — IP address, device type, browser type",
                "Usage and session data — timestamps, session identifiers, routing data, and error logs",
              ]} />
              <P>Assessment responses are user-provided inputs used solely to generate the Income Stability Score™ and associated diagnostic report.</P>

              <SubHead>B. Automatically Collected Information</SubHead>
              <P>Certain technical information may be collected automatically during use of the RunPayway™ platform, including:</P>
              <Bullet items={[
                "IP address",
                "device type",
                "browser type",
                "timestamps",
                "session identifiers",
                "routing data",
                "error logs",
              ]} />
              <P>This information supports platform security, fraud prevention, and operational integrity.</P>

              <SubHead>C. Payment Information</SubHead>
              <P>Payments are processed through Stripe.</P>
              <P>RunPayway™ does not store full payment card numbers.</P>
              <P style={{ marginBottom: 0 }}>Stripe may collect and process payment information in accordance with Stripe&apos;s Privacy Policy: https://stripe.com/privacy</P>
            </Section>
          </div>

          {/* 3. Purpose of Processing */}
          <div ref={sectionRefs[3].ref}>
            <Section number="3." title="Purpose of Processing" mobile={mobile} visible={sectionRefs[3].visible}>
              <P>Personal information may be used to:</P>
              <Bullet items={[
                "generate the Income Stability Score™",
                "deliver assessment results",
                "maintain user accounts",
                "process payments",
                "administer subscriptions",
                "respond to user-submitted inquiries",
                "conduct enterprise or partnership follow-up discussions initiated by the user",
                "maintain registry verification",
                "improve system integrity and security",
                "comply with legal obligations",
              ]} />
              <P style={{ marginBottom: 0 }}>RunPayway™ does not sell personal information for monetary consideration and does not share personal information for cross-context behavioral advertising.</P>
            </Section>
          </div>

          {/* 4. Service Providers */}
          <div ref={sectionRefs[4].ref}>
            <Section number="4." title="Service Providers and Data Sharing" mobile={mobile} visible={sectionRefs[4].visible}>
              <P>RunPayway™ may share information with service providers that perform operational services on our behalf, including:</P>
              <Bullet items={[
                "payment processing",
                "hosting infrastructure",
                "email delivery",
                "security monitoring",
              ]} />
              <P style={{ marginBottom: 0 }}>These providers process information solely to support the operation of RunPayway™ and are contractually restricted from using personal information for their own purposes.</P>
            </Section>
          </div>

          {/* 5. Consent-Based Contact */}
          <div ref={sectionRefs[5].ref}>
            <Section number="5." title="Consent-Based Contact Following User Submission" mobile={mobile} visible={sectionRefs[5].visible}>
              <P>If you submit an inquiry, create an account, purchase an assessment, or request enterprise information, you consent to be contacted by RunPayway™ in response to that submission.</P>
              <P>Contact may relate to:</P>
              <Bullet items={[
                "assessment results",
                "billing or subscription administration",
                "enterprise or partnership discussions",
                "service-related updates",
              ]} />
              <P>Such communication is limited to responding to your submission and administering the requested service.</P>
              <P>Optional marketing communications, if offered separately, will include an opt-out mechanism.</P>
              <P style={{ marginBottom: 0 }}>RunPayway™ does not provide financial advisory outreach.</P>
            </Section>
          </div>

          {/* 6. Data Retention */}
          <div ref={sectionRefs[6].ref}>
            <Section number="6." title="Data Retention" mobile={mobile} visible={sectionRefs[6].visible}>
              <P>Personal information is retained only for as long as reasonably necessary to fulfill the purposes described in this policy, unless a longer retention period is required or permitted by law.</P>
              <P>Assessment results are stored as time-stamped digital records associated with the model version under which the assessment was generated.</P>
              <P>Account and billing records may be retained to comply with financial, tax, and legal obligations.</P>
              <P style={{ marginBottom: 0 }}>Retention periods vary depending on the category of information and applicable law.</P>
            </Section>
          </div>

          {/* 7. Data Security */}
          <div ref={sectionRefs[7].ref}>
            <Section number="7." title="Data Security" mobile={mobile} visible={sectionRefs[7].visible}>
              <P>RunPayway™ implements reasonable administrative, technical, and organizational safeguards designed to protect personal information.</P>
              <P style={{ marginBottom: 0 }}>However, no method of transmission over the Internet or electronic storage can guarantee absolute security.</P>
            </Section>
          </div>

          {/* 8. Public Registry */}
          <div ref={sectionRefs[8].ref}>
            <Section number="8." title="Public Registry Verification" mobile={mobile} visible={sectionRefs[8].visible}>
              <P>RunPayway™ provides a registry verification mechanism that confirms record consistency only.</P>
              <P>Registry responses may display:</P>
              <Bullet items={[
                "Record ID",
                "Income Stability Score™ value",
                "stability classification band",
                "model version",
                "timestamp",
              ]} />
              <P>Registry verification does not display:</P>
              <Bullet items={[
                "assessment responses",
                "component-level scoring",
                "personal identifying information",
              ]} />
            </Section>
          </div>

          {/* 9. Privacy Rights */}
          <div ref={sectionRefs[9].ref}>
            <Section number="9." title="Privacy Rights" mobile={mobile} visible={sectionRefs[9].visible}>
              <P>Depending on your jurisdiction, you may have the right to:</P>
              <Bullet items={[
                "request access to personal information",
                "request correction of inaccurate personal information",
                "request deletion of personal information",
                "request limitation of processing",
              ]} />
              <P>Privacy rights requests must be submitted through the designated privacy request form available on the RunPayway™ website.</P>
              <P>Requests may also be submitted by email: privacy@runpayway.com</P>
              <P>Identity verification may be required before processing a request.</P>
              <P style={{ marginBottom: 0 }}>Verified requests will be responded to within applicable legal timeframes.</P>
            </Section>
          </div>

          {/* 10. California Privacy Notice */}
          <div ref={sectionRefs[10].ref}>
            <Section number="10." title="California Privacy Notice" mobile={mobile} visible={sectionRefs[10].visible}>
              <P>If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA), as amended by the California Privacy Rights Act (CPRA), including:</P>
              <Bullet items={[
                "the right to know what personal information is collected",
                "the right to request deletion",
                "the right to request correction",
                "the right to opt out of the sale or sharing of personal information",
                "the right to non-discrimination",
              ]} />
              <P>RunPayway™ does not sell personal information and does not share personal information for cross-context behavioral advertising.</P>
              <P style={{ marginBottom: 0 }}>Requests must be submitted through the designated privacy request form or by email to: privacy@runpayway.com</P>
            </Section>
          </div>

          {/* 11. Cookies & Tracking */}
          <div ref={sectionRefs[11].ref}>
            <Section number="11." title="Cookies & Tracking" mobile={mobile} visible={sectionRefs[11].visible}>
              <P>RunPayway™ uses cookies and similar technologies for:</P>
              <Bullet items={[
                "session authentication",
                "security",
                "platform functionality",
                "performance monitoring",
              ]} />
              <P>RunPayway™ primarily uses essential cookies required for authentication and system operation. Performance cookies may be used to monitor system reliability.</P>
              <P>RunPayway™ does not use cookies for behavioral advertising.</P>
              <P>Users may control cookies through their browser settings. Disabling cookies may affect certain site functionality.</P>
              <P style={{ marginBottom: 0 }}>RunPayway™ does not respond to browser &quot;Do Not Track&quot; signals.</P>
            </Section>
          </div>

          {/* 12. Children's Privacy */}
          <div ref={sectionRefs[12].ref}>
            <Section number="12." title="Children's Privacy" mobile={mobile} visible={sectionRefs[12].visible}>
              <P>RunPayway™ is not intended for individuals under 18 years of age.</P>
              <P style={{ marginBottom: 0 }}>RunPayway™ does not knowingly collect personal information from minors.</P>
            </Section>
          </div>

          {/* 13. International Users */}
          <div ref={sectionRefs[13].ref}>
            <Section number="13." title="International Users" mobile={mobile} visible={sectionRefs[13].visible}>
              <P>RunPayway™ operates from the United States.</P>
              <P style={{ marginBottom: 0 }}>Information may be processed and stored in the United States and may be subject to U.S. law.</P>
            </Section>
          </div>

          {/* 14. Changes to This Policy */}
          <div ref={sectionRefs[14].ref}>
            <Section number="14." title="Changes to This Policy" mobile={mobile} visible={sectionRefs[14].visible}>
              <P>This Privacy Policy may be updated periodically.</P>
              <P style={{ marginBottom: 0 }}>Material changes will be published with an updated effective date.</P>
            </Section>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Closing brand bar                                           */}
      {/* ============================================================ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: B.gradient,
          paddingTop: mobile ? 56 : 72,
          paddingBottom: mobile ? 56 : 72,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            mixBlendMode: "soft-light",
            pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        />

        {[180, 320, 480].map((size, i) => (
          <div
            key={size}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: size,
              height: size,
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              border: `1px solid rgba(255,255,255,${0.06 - i * 0.015})`,
              pointerEvents: "none",
            }}
          />
        ))}

        <div
          className="mx-auto"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 600,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: mobile ? 22 : 28, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: 8 }}>
            RunPayway™
          </div>
          <div style={{ fontSize: mobile ? 15 : 17, color: "rgba(255,255,255,0.60)", marginBottom: 24 }}>
            Income Stability Score™
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.30)", letterSpacing: "0.02em" }}>
            Powered by Structural Stability Model RP-1.0
          </p>
        </div>
      </section>
    </div>
  );
}
