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
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function Section({
  number,
  title,
  children,
  mobile,
  visible,
}: {
  number: string;
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
        <span style={{ color: B.purple, marginRight: 8 }}>{number}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

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

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function TermsOfUsePage() {
  const mobile = useMobile();
  const heroAnim = useInView();

  const s1 = useInView();
  const s2 = useInView();
  const s3 = useInView();
  const s4 = useInView();
  const s5 = useInView();
  const s6 = useInView();
  const s7 = useInView();
  const s8 = useInView();
  const s9 = useInView();
  const s10 = useInView();
  const s11 = useInView();
  const s12 = useInView();
  const s13 = useInView();
  const s14 = useInView();
  const s15 = useInView();
  const s16 = useInView();
  const s17 = useInView();
  const s18 = useInView();
  const s19 = useInView();
  const s20 = useInView();

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
            Terms of Use
          </h1>

          <p style={{ fontSize: mobile ? 15 : 17, color: "rgba(255,255,255,0.60)", lineHeight: 1.7, marginBottom: 8 }}>
            RunPayway™ · Income Stability Score™
          </p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.40)", marginBottom: 8 }}>
            Structural Stability Model RP-1.0 | Version 1.0
          </p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.40)" }}>
            Effective Date: April 1, 2026
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
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            display: "flex",
            flexDirection: "column",
            gap: mobile ? 20 : 24,
          }}
        >
          {/* 1 */}
          <div ref={s1.ref}>
            <Section number="1." title="Acceptance of Terms" mobile={mobile} visible={s1.visible}>
              <P>By creating an account, purchasing an assessment, submitting an inquiry, or affirmatively indicating acceptance during checkout, you agree to these Terms of Use.</P>
              <P style={{ marginBottom: 0 }}>If you do not agree to these Terms, you may not access or use the RunPayway™ service.</P>
            </Section>
          </div>

          {/* 2 */}
          <div ref={s2.ref}>
            <Section number="2." title="Service Description" mobile={mobile} visible={s2.visible}>
              <P>RunPayway™ provides access to the Income Stability Score™, a structural income stability measurement generated under Structural Stability Model RP-1.0.</P>
              <P>The Income Stability Score™ is a descriptive, point-in-time structural assessment based on user-provided information.</P>
              <P style={{ marginBottom: 0 }}>RunPayway™ is not a registered investment adviser and does not provide financial advice, investment advice, tax advice, or legal advice.</P>
            </Section>
          </div>

          {/* 3 */}
          <div ref={s3.ref}>
            <Section number="3." title="Eligibility" mobile={mobile} visible={s3.visible}>
              <P>You must be at least 18 years old to use this service.</P>
              <P>You represent that all information submitted through the RunPayway™ platform is accurate to the best of your knowledge.</P>
              <P style={{ marginBottom: 0 }}>Users are responsible for the accuracy and completeness of information submitted through the assessment process. RunPayway™ does not independently verify user-provided inputs.</P>
            </Section>
          </div>

          {/* 4 */}
          <div ref={s4.ref}>
            <Section number="4." title="No Financial Advisory Relationship" mobile={mobile} visible={s4.visible}>
              <P>Use of the Income Stability Score™ does not create:</P>
              <Bullet items={[
                "a fiduciary relationship",
                "an advisory relationship",
                "an investment advisory engagement",
                "a client relationship",
              ]} />
              <P style={{ marginBottom: 0 }}>The Income Stability Score™ is not a recommendation, endorsement, or suitability determination.</P>
            </Section>
          </div>

          {/* 5 */}
          <div ref={s5.ref}>
            <Section number="5." title="Structural Measurement Limitation" mobile={mobile} visible={s5.visible}>
              <P>The Income Stability Score™:</P>
              <Bullet items={[
                "measures structural income characteristics only",
                "does not predict future financial performance",
                "does not evaluate income amount or wealth",
                "does not assess creditworthiness",
              ]} />
              <P style={{ marginBottom: 0 }}>The Income Stability Score™ reflects information provided at the time of submission.</P>
            </Section>
          </div>

          {/* 6 */}
          <div ref={s6.ref}>
            <Section number="6." title="Deterministic Model Framework" mobile={mobile} visible={s6.visible}>
              <P>The Income Stability Score™ is generated under Structural Stability Model RP-1.0 using predefined scoring criteria.</P>
              <P>Scoring methodology is version-controlled.</P>
              <P>Under the same model version, identical responses are intended to produce identical results.</P>
              <P style={{ marginBottom: 0 }}>No machine learning or probabilistic adjustments are used under Model RP-1.0.</P>
            </Section>
          </div>

          {/* 7 */}
          <div ref={s7.ref}>
            <Section number="7." title="Payment Terms" mobile={mobile} visible={s7.visible}>
              <P>All fees are listed in U.S. dollars.</P>
              <P>Income Stability Score™ assessments are billed either:</P>
              <Bullet items={[
                "as a one-time assessment fee, or",
                "as an annual subscription for reassessment access",
              ]} />
              <P>Subscriptions renew automatically at the stated annual rate unless canceled prior to the next billing cycle.</P>
              <P>No refunds are issued after score generation.</P>
              <P style={{ marginBottom: 0 }}>If a technical error prevents score generation, RunPayway™ may review the transaction.</P>
            </Section>
          </div>

          {/* 8 */}
          <div ref={s8.ref}>
            <Section number="8." title="Consent-Based Contact Following User Submission" mobile={mobile} visible={s8.visible}>
              <P>If you submit an inquiry, create an account, purchase an assessment, or request enterprise information, you consent to be contacted by RunPayway™ in response to that submission.</P>
              <P>Contact may relate to:</P>
              <Bullet items={[
                "assessment results",
                "account administration",
                "billing and subscription management",
                "enterprise or partnership discussions",
                "service-related updates",
              ]} />
              <P>Such contact is limited to responding to your submission and administering the requested service.</P>
              <P>Optional marketing communications, if offered separately, will include an opt-out mechanism.</P>
              <P style={{ marginBottom: 0 }}>RunPayway™ does not provide financial advisory outreach.</P>
            </Section>
          </div>

          {/* 9 */}
          <div ref={s9.ref}>
            <Section number="9." title="Intellectual Property" mobile={mobile} visible={s9.visible}>
              <P>Structural Stability Model RP-1.0, the Income Stability Score™ framework, scoring methodology, and all related platform content are proprietary intellectual property of RunPayway™.</P>
              <P>The Income Stability Score™ and related reports are provided for individual or internal informational use unless otherwise authorized in writing by RunPayway™.</P>
              <P>You may not:</P>
              <Bullet items={[
                "reverse engineer scoring logic",
                "extract scoring weights or model parameters",
                "replicate or reproduce the methodology",
                "use the Income Stability Score™ for commercial redistribution without authorization",
                "access the service through automated scraping, bots, or data extraction tools",
              ]} />
              <P style={{ marginBottom: 0 }}>All rights reserved.</P>
            </Section>
          </div>

          {/* 10 */}
          <div ref={s10.ref}>
            <Section number="10." title="Registry Verification" mobile={mobile} visible={s10.visible}>
              <P>Registry verification confirms record consistency only.</P>
              <P>Verification confirms that a registry record exists and has not been altered since issuance.</P>
              <P style={{ marginBottom: 0 }}>Verification does not validate the accuracy of user-provided information used to generate the assessment.</P>
            </Section>
          </div>

          {/* 11 */}
          <div ref={s11.ref}>
            <Section number="11." title="Service Availability" mobile={mobile} visible={s11.visible}>
              <P>RunPayway™ may modify, suspend, or discontinue portions of the service at any time for maintenance, security, or operational reasons.</P>
              <P style={{ marginBottom: 0 }}>Reasonable efforts may be made to maintain service availability, but uninterrupted operation is not guaranteed.</P>
            </Section>
          </div>

          {/* 12 */}
          <div ref={s12.ref}>
            <Section number="12." title="Limitation of Liability" mobile={mobile} visible={s12.visible}>
              <P>To the maximum extent permitted by law:</P>
              <P>RunPayway™ shall not be liable for indirect, incidental, consequential, special, exemplary, or punitive damages arising from use of the Income Stability Score™.</P>
              <P>Total liability for any claim shall not exceed the amount paid for the assessment giving rise to the claim.</P>
              <P style={{ marginBottom: 0 }}>This limitation applies regardless of the legal theory asserted.</P>
            </Section>
          </div>

          {/* 13 */}
          <div ref={s13.ref}>
            <Section number="13." title="Disclaimer of Warranties" mobile={mobile} visible={s13.visible}>
              <P>The Income Stability Score™ and related services are provided &quot;as is&quot; and &quot;as available.&quot;</P>
              <P>RunPayway™ disclaims all warranties, express or implied, including:</P>
              <Bullet items={[
                "merchantability",
                "fitness for a particular purpose",
                "non-infringement",
                "accuracy",
              ]} />
              <P style={{ marginBottom: 0 }}>No guarantee is made regarding financial outcomes or suitability for specific decisions.</P>
            </Section>
          </div>

          {/* 14 */}
          <div ref={s14.ref}>
            <Section number="14." title="Indemnification" mobile={mobile} visible={s14.visible}>
              <P>You agree to indemnify and hold harmless RunPayway™, its affiliates, officers, and agents from any claims, liabilities, damages, or expenses arising from:</P>
              <Bullet items={[
                "your use of the service",
                "your violation of these Terms",
                "your submission of inaccurate information",
              ]} />
            </Section>
          </div>

          {/* 15 */}
          <div ref={s15.ref}>
            <Section number="15." title="Force Majeure" mobile={mobile} visible={s15.visible}>
              <P style={{ marginBottom: 0 }}>RunPayway™ shall not be liable for delays or failures resulting from events beyond its reasonable control.</P>
            </Section>
          </div>

          {/* 16 */}
          <div ref={s16.ref}>
            <Section number="16." title="Data & Snapshot Records" mobile={mobile} visible={s16.visible}>
              <P>Completed assessments generate time-stamped digital snapshot records.</P>
              <P>Snapshots reflect user-provided information at the time of submission.</P>
              <P style={{ marginBottom: 0 }}>RunPayway™ does not guarantee long-term archival beyond stated retention policies.</P>
            </Section>
          </div>

          {/* 17 */}
          <div ref={s17.ref}>
            <Section number="17." title="Dispute Resolution & Arbitration" mobile={mobile} visible={s17.visible}>
              <P>Any dispute arising from these Terms or use of the Income Stability Score™ shall be resolved through binding arbitration on an individual basis.</P>
              <P>You waive any right to participate in class actions or representative proceedings.</P>
              <P style={{ marginBottom: 0 }}>If arbitration is deemed unenforceable, any permitted court action shall be brought exclusively in the courts located in California, United States.</P>
            </Section>
          </div>

          {/* 18 */}
          <div ref={s18.ref}>
            <Section number="18." title="Governing Law" mobile={mobile} visible={s18.visible}>
              <P style={{ marginBottom: 0 }}>These Terms are governed by the laws of the State of California, United States.</P>
            </Section>
          </div>

          {/* 19 */}
          <div ref={s19.ref}>
            <Section number="19." title="Contact" mobile={mobile} visible={s19.visible}>
              <P style={{ marginBottom: 0 }}>Questions regarding these Terms may be submitted through the RunPayway™ contact form available on the website.</P>
            </Section>
          </div>

          {/* 20 */}
          <div ref={s20.ref}>
            <Section number="20." title="Modifications to Terms" mobile={mobile} visible={s20.visible}>
              <P>These Terms may be updated periodically.</P>
              <P>Material changes will be published with an updated effective date.</P>
              <P>Changes to scoring methodology will result in a new model version.</P>
              <P style={{ marginBottom: 0 }}>No silent changes are made to scoring logic.</P>
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
