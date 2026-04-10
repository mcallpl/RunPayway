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
const light = "rgba(14,26,43,0.62)";const border = "#E5E7EB";

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

export default function VersionGovernancePage() {
  const mobile = useMobile();
  const heroAnim = useInView();
  const s1 = useInView(); const s2 = useInView(); const s3 = useInView(); const s4 = useInView();
  const s5 = useInView(); const s6 = useInView(); const s7 = useInView(); const s8 = useInView();

  return (
    <div style={{ background: "#FAFAFA", fontFamily: sans }}>

      {/* HERO */}
      <header style={{ backgroundColor: C.sand, paddingTop: mobile ? 104 : 152, paddingBottom: mobile ? 56 : 88, paddingLeft: mobile ? 24 : 48, paddingRight: mobile ? 24 : 48 }}>
        <div ref={heroAnim.ref} style={{ maxWidth: 860, margin: "0 auto", textAlign: "center", opacity: heroAnim.visible ? 1 : 0, transform: heroAnim.visible ? "translateY(0)" : "translateY(10px)", transition: "opacity 500ms ease-out, transform 500ms ease-out" }}>
          <div style={{ fontSize: mobile ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>
            VERSION GOVERNANCE
          </div>
          <h1 style={{ fontSize: mobile ? 38 : 64, fontWeight: 700, color: C.navy, letterSpacing: "-0.035em", lineHeight: 1.05, marginBottom: 24 }}>
            Model Version Management
          </h1>
          <p style={{ fontSize: mobile ? 16 : 18, color: muted, lineHeight: 1.6, maxWidth: 680, margin: "0 auto" }}>
            How scoring models are versioned, upgraded, and retired. Your assessment is permanently tied to the model under which it was issued.
          </p>
        </div>
      </header>

      {/* CONTENT */}
      <section style={{ paddingTop: mobile ? 56 : 112, paddingBottom: mobile ? 56 : 112 }}>
        <div style={{ maxWidth: 820, margin: "0 auto", paddingLeft: mobile ? 24 : 24, paddingRight: mobile ? 24 : 24, display: "flex", flexDirection: "column" as const, gap: mobile ? 16 : 20 }}>

          {/* 1. Current Model Versions */}
          <div ref={s1.ref}>
            <Section number="1." title="Current Model Versions" mobile={mobile} visible={s1.visible}>
              <P>Model RP-2.0 is the active scoring model. All new assessments are issued under this version unless a successor has been formally released.</P>
              <P>Five version components are tracked independently:</P>
              <Bullet items={[
                "Model (RP-2.0) \u2014 the core scoring algorithm and dimension structure.",
                "Factor Weights (F-2.0) \u2014 the relative importance assigned to each scoring factor.",
                "Scenario Templates (S-2.0) \u2014 the constraint scenarios used to stress-test financial resilience.",
                "Benchmark Data (B-2.0) \u2014 the reference dataset used for percentile and band calibration.",
                "Explanation Templates (E-2.0) \u2014 the narrative engine that generates plain-English score explanations.",
              ]} />
              <P>Each assessment record contains a model_manifest with all five version stamps. SHA-256 integrity hashes bind the record to its exact model version, ensuring cryptographic proof of which model produced the result.</P>
            </Section>
          </div>

          {/* 2. Version Immutability */}
          <div ref={s2.ref}>
            <Section number="2." title="Version Immutability" mobile={mobile} visible={s2.visible}>
              <P>Once an assessment is issued under RP-2.0, it stays under RP-2.0 permanently. The score, band, constraint hierarchy, and all derived data are immutable.</P>
              <P>Re-running the same inputs through RP-2.0 always produces the same output. The model is deterministic within a given version.</P>
              <P style={{ marginBottom: 0 }}>No retroactive adjustment, reweighting, or recalculation is applied to existing records. Your score is locked to the model that produced it.</P>
            </Section>
          </div>

          {/* 3. Version Upgrade Policy */}
          <div ref={s3.ref}>
            <Section number="3." title="Version Upgrade Policy" mobile={mobile} visible={s3.visible}>
              <P>When a new model version is released (e.g., RP-2.1 or RP-3.0), all new assessments use the new model. Existing assessments remain on their issued version.</P>
              <P>Users with active entitlements receive one bonus assessment under the new model version &mdash; automatically granted on their next entitlement check.</P>
              <P style={{ marginBottom: 0 }}>The bonus allows direct comparison: your RP-2.0 score vs your RP-3.0 score with the same inputs. This gives you a clear view of how the new model evaluates your financial position differently.</P>
            </Section>
          </div>

          {/* 4. Backward Compatibility */}
          <div ref={s4.ref}>
            <Section number="4." title="Backward Compatibility" mobile={mobile} visible={s4.visible}>
              <P>Scores from different model versions are not directly comparable. A score of 62 under RP-2.0 and a score of 62 under RP-3.0 may reflect different underlying evaluations.</P>
              <P>The assessment record includes the model version so any display or analysis can account for version differences. The verification endpoint returns the model version alongside the score.</P>
              <P style={{ marginBottom: 0 }}>Band thresholds (0&ndash;29, 30&ndash;49, 50&ndash;74, 75&ndash;100) are expected to remain stable across versions, but this is not guaranteed. If thresholds change, the new thresholds apply only to assessments issued under the new version.</P>
            </Section>
          </div>

          {/* 5. Change Classification */}
          <div ref={s5.ref}>
            <Section number="5." title="Change Classification" mobile={mobile} visible={s5.visible}>
              <Bullet items={[
                "Patch (RP-2.0 \u2192 RP-2.0.1): Bug fixes, no scoring impact. Existing records unaffected. No new version stamp required.",
                "Minor (RP-2.0 \u2192 RP-2.1): Weight adjustments, new interaction rules, benchmark updates. Score may change for same inputs. New version stamp issued.",
                "Major (RP-2.0 \u2192 RP-3.0): Structural changes to dimensions, band thresholds, or scoring methodology. Full re-assessment recommended.",
              ]} />
              <P style={{ marginBottom: 0 }}>Patch changes are applied transparently. Minor and major changes trigger a formal version increment and are announced before taking effect.</P>
            </Section>
          </div>

          {/* 6. Deprecation Timeline */}
          <div ref={s6.ref}>
            <Section number="6." title="Deprecation Timeline" mobile={mobile} visible={s6.visible}>
              <P>A model version remains supported for a minimum of 12 months after a successor is released.</P>
              <P>&ldquo;Supported&rdquo; means:</P>
              <Bullet items={[
                "Verification endpoints continue to validate records issued under the version.",
                "Assessment records remain accessible and downloadable.",
                "Integrity hashes remain verifiable against the original model manifest.",
              ]} />
              <P>After deprecation, records are archived but no longer actively verified. The data is retained, but the verification endpoint will return a status indicating the model version is deprecated.</P>
              <P style={{ marginBottom: 0 }}>Users are notified 90 days before deprecation via email (if email is on file). Deprecation notices are also posted on the platform status page.</P>
            </Section>
          </div>

          {/* 7. Migration Path */}
          <div ref={s7.ref}>
            <Section number="7." title="Migration Path" mobile={mobile} visible={s7.visible}>
              <P>No automatic migration of scores between versions. Your RP-2.0 score is your RP-2.0 score. It does not convert to an RP-3.0 equivalent.</P>
              <P>To get a score under a new model, take a new assessment &mdash; using your bonus entitlement or purchasing a new one.</P>
              <P>The comparative reassessment engine (Engine 19) can compare your new score against your prior score, showing factor-by-factor deltas. This highlights exactly which dimensions shifted and by how much.</P>
              <P style={{ marginBottom: 0 }}>Access codes issued under RP-2.0 continue to work regardless of the active model version. A code is tied to the record, not to the model.</P>
            </Section>
          </div>

          {/* 8. Audit Trail */}
          <div ref={s8.ref}>
            <Section number="8." title="Audit Trail" mobile={mobile} visible={s8.visible}>
              <P>Every model version change is logged with: version identifier, change description, effective date, and reason for change. This log is maintained internally and available upon request for compliance purposes.</P>
              <P>The model_manifest hash in each assessment record provides cryptographic proof of which model version was used. This hash can be independently verified without access to the underlying data.</P>
              <P style={{ marginBottom: 0 }}>Third parties can verify the model version of any assessment via the public verification endpoint. The response includes the full version stamp and the integrity hash for independent validation.</P>
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
            Every score is permanently bound to the model that produced it. No silent changes. No retroactive adjustments.
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
            RUNPAYWAY.COM
          </p>
        </div>
      </section>
    </div>
  );
}
