"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoBlue from "../../../../public/logo.png";
import { C, sans } from "@/lib/design-tokens";

/* ------------------------------------------------------------------ */
/*  Question definitions                                               */
/* ------------------------------------------------------------------ */

const QUESTIONS = [
  {
    key: "classification",
    label: "Who is this assessment for?",
    options: ["Individual", "Business", "Team"],
  },
  {
    key: "operating_structure",
    label: "How is your income primarily structured?",
    options: [
      "Employee",
      "Self-employed",
      "Business owner",
      "Contractor / Freelancer",
      "Commission-based professional",
      "Agency / Firm owner",
      "Team-based income structure",
      "Mixed",
    ],
  },
  {
    key: "primary_income_model",
    label: "What best describes how you primarily earn income?",
    options: [
      "Salary or wages",
      "Commission",
      "Client services",
      "Retainers / recurring contracts",
      "Product sales",
      "Licensing / royalties",
      "Subscription / membership revenue",
      "Rental income",
      "Mixed",
    ],
  },
  {
    key: "revenue_structure",
    label: "How do you usually get paid?",
    options: [
      "Mostly fixed and predictable",
      "Mostly variable but recurring",
      "Mostly project-based",
      "Mostly transactional",
      "Seasonal or cyclical",
      "Mixed",
    ],
  },
  {
    key: "forward_visibility_horizon",
    label: "How far ahead is your income meaningfully secured today?",
    options: [
      "Less than 30 days",
      "1\u20133 months",
      "3\u20136 months",
      "6\u201312 months",
      "More than 12 months",
    ],
  },
  {
    key: "work_interruption_sensitivity",
    label: "If you could not actively work for 60\u201390 days, what would happen to your income?",
    options: [
      "It would drop sharply",
      "It would decline somewhat",
      "Much of it would continue",
      "Most of it would continue",
    ],
  },
  {
    key: "current_priority",
    label: "What matters most to you right now?",
    options: [
      "More predictability",
      "Better monthly consistency",
      "Less reliance on one source",
      "More income secured ahead of time",
      "More income that continues without daily work",
      "Better positioning to share with lenders, landlords, partners, or advisors",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 15,
  fontWeight: 600,
  color: C.navy,
  marginBottom: 8,
  lineHeight: 1.4,
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PrecisionPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Verify assessment record exists
    const stored = sessionStorage.getItem("rp_record");
    if (!stored) {
      router.push("/diagnostic-portal");
      return;
    }
    setTimeout(() => setVisible(true), 100);
  }, [router]);

  const allAnswered = QUESTIONS.every((q) => answers[q.key]);

  const handleContinue = () => {
    if (!allAnswered) return;

    // Save precision answers to the assessment record
    const stored = sessionStorage.getItem("rp_record");
    if (stored) {
      try {
        const record = JSON.parse(stored);
        record.precision = answers;
        // Also update profile fields that the engine uses
        const profile = JSON.parse(sessionStorage.getItem("rp_profile") || "{}");
        profile.classification = answers.classification;
        profile.operating_structure = answers.operating_structure;
        profile.primary_income_model = answers.primary_income_model;
        profile.revenue_structure = answers.revenue_structure;
        profile.forward_visibility_horizon = answers.forward_visibility_horizon;
        profile.work_interruption_sensitivity = answers.work_interruption_sensitivity;
        profile.current_priority = answers.current_priority;
        sessionStorage.setItem("rp_record", JSON.stringify(record));
        sessionStorage.setItem("rp_profile", JSON.stringify(profile));
        localStorage.setItem("rp_profile", JSON.stringify(profile));
      } catch { /* proceed anyway */ }
    }

    // Navigate to review (paid report)
    router.push("/review");
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: C.sand,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "60px 24px 80px",
      opacity: visible ? 1 : 0,
      transition: "opacity 400ms ease",
      fontFamily: sans,
    }}>
      <div style={{ maxWidth: 560, width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Image src={logoBlue} alt="RunPayway\u2122" width={140} height={16} style={{ height: "auto", marginBottom: 24 }} />
          <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: sans, color: C.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>
            Make your report more precise.
          </h1>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, marginBottom: 8, maxWidth: 440, margin: "0 auto 8px" }}>
            Add a few details about how your income works. These do not change your score — they tailor the diagnostic to your actual situation.
          </p>
          <p style={{ fontSize: 14, color: C.light, lineHeight: 1.5 }}>
            No bank connection. No credit pull. No document upload. About 60 seconds.
          </p>
        </div>

        {/* Questions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {QUESTIONS.map((q) => (
            <div key={q.key}>
              <label style={labelStyle}>{q.label}</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {q.options.map((opt) => {
                  const selected = answers[q.key] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.key]: opt }))}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "12px 16px",
                        fontSize: 14,
                        fontWeight: selected ? 600 : 400,
                        color: selected ? C.navy : C.muted,
                        backgroundColor: selected ? "rgba(75,63,174,0.06)" : C.white,
                        border: `1px solid ${selected ? C.purple : C.border}`,
                        borderRadius: 8,
                        cursor: "pointer",
                        transition: "all 150ms ease",
                        lineHeight: 1.4,
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <button
            disabled={!allAnswered}
            onClick={handleContinue}
            style={{
              width: "100%",
              maxWidth: 400,
              height: 52,
              borderRadius: 12,
              background: allAnswered
                ? `linear-gradient(135deg, ${C.purple} 0%, ${C.teal} 100%)`
                : C.border,
              color: allAnswered ? C.white : C.light,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              border: "none",
              cursor: allAnswered ? "pointer" : "not-allowed",
              boxShadow: allAnswered ? "0 8px 24px rgba(75,63,174,0.30)" : "none",
              transition: "all 300ms ease",
            }}
          >
            Continue to Full Report \u2192
          </button>
          <p style={{ fontSize: 13, color: C.light, marginTop: 12 }}>
            Your report will be tailored to your answers. Same score. More precise diagnostic.
          </p>
        </div>
      </div>
    </div>
  );
}
