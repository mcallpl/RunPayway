"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  cream: "#F4F1EA",
  light: "#9CA3AF",
  gradient: "linear-gradient(135deg, #0E1A2B 0%, #1A1540 40%, #4B3FAE 70%, #1F6D7A 100%)",
};

const DISPLAY_FONT = "'DM Serif Display', Georgia, serif";

const PLAN_INFO: Record<string, { title: string; price: string }> = {
  monitoring: { title: "Annual Monitoring", price: "$199" },
  single: { title: "Complete Assessment", price: "$99" },
};

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "single";
  const stripeSessionId = searchParams.get("session_id") || "";
  const customerEmail = searchParams.get("email") || searchParams.get("customer_email") || "";
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hasExistingRecord, setHasExistingRecord] = useState(false);

  const info = PLAN_INFO[plan] || PLAN_INFO.single;

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  // Store purchase session and obtain signed payment token from server
  useEffect(() => {
    const planKey = plan === "monitoring" ? "annual_monitoring" : "single_assessment";
    const session = {
      plan_key: planKey,
      price_cents: plan === "monitoring" ? 19900 : 9900,
      currency: "USD",
      intended_assessment_count: plan === "monitoring" ? 3 : 1,
      status: "paid",
      checkout_provider: "stripe",
      stripe_session_id: stripeSessionId,
      customer_email: customerEmail,
      payment_token: "",
      token_timestamp: "",
      token_nonce: "",
      token_expires_at: "",
    };

    fetch("/api/v1/payment-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan_key: planKey }),
    })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.token) {
          session.payment_token = data.token;
          session.token_timestamp = data.timestamp;
          session.token_nonce = data.nonce;
          session.token_expires_at = data.expires_at;
        }
        sessionStorage.setItem("rp_purchase_session", JSON.stringify(session));
        localStorage.setItem("rp_purchase_session", JSON.stringify(session));
        // Check if this is a free-to-paid upgrade
        // Only count as upgrade if the PREVIOUS session was a free plan
        try {
          const prevSession = localStorage.getItem("rp_previous_plan");
          const existingRecord = sessionStorage.getItem("rp_record") || localStorage.getItem("rp_record");
          if (prevSession === "free" && existingRecord) {
            sessionStorage.setItem("rp_record", existingRecord);
            setHasExistingRecord(true);
          } else {
            // Not an upgrade — clear old record for fresh assessment
            sessionStorage.removeItem("rp_record");
            localStorage.removeItem("rp_record");
          }
        } catch {
          sessionStorage.removeItem("rp_record");
          localStorage.removeItem("rp_record");
        }
        // Store current plan for future upgrade detection
        localStorage.setItem("rp_previous_plan", planKey);
        setReady(true);
      })
      .catch(() => {
        sessionStorage.setItem("rp_purchase_session", JSON.stringify(session));
        localStorage.setItem("rp_purchase_session", JSON.stringify(session));
        try {
          const prevSession = localStorage.getItem("rp_previous_plan");
          const existingRecord = sessionStorage.getItem("rp_record") || localStorage.getItem("rp_record");
          if (prevSession === "free" && existingRecord) {
            sessionStorage.setItem("rp_record", existingRecord);
            setHasExistingRecord(true);
          } else {
            sessionStorage.removeItem("rp_record");
            localStorage.removeItem("rp_record");
          }
        } catch {
          sessionStorage.removeItem("rp_record");
          localStorage.removeItem("rp_record");
        }
        localStorage.setItem("rp_previous_plan", planKey);
        setReady(true);
      });
  }, [plan, stripeSessionId, customerEmail]);

  // No auto-redirect — user clicks "Begin Assessment" when ready

  const steps = hasExistingRecord ? [
    { num: "1", title: "Payment confirmed", desc: `${info.title} — ${info.price}`, done: true },
    { num: "2", title: "Assessment already completed", desc: "Your answers are saved. No need to retake.", done: true },
    { num: "3", title: "View your full report", desc: "All 5 pages, unlocked instantly.", done: false },
  ] : [
    { num: "1", title: "Payment confirmed", desc: `${info.title} — ${info.price}`, done: true },
    { num: "2", title: "Set up your profile", desc: "Industry, income model, and operating structure.", done: false },
    { num: "3", title: "Take the assessment", desc: "Under two minutes, then your full 5-page report.", done: false },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: B.gradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');
        @keyframes rp-spin { to { transform: rotate(360deg); } }
        @keyframes rp-pulse { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
      `}</style>

      {/* Radial glow */}
      <div style={{ position: "absolute", top: "30%", left: "50%", width: 800, height: 800, transform: "translate(-50%, -50%)", background: "radial-gradient(circle, rgba(75,63,174,0.20) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 480,
          padding: "60px 24px",
          textAlign: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
        }}
      >
        {/* Checkmark */}
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(31,109,122,0.15)", border: "2px solid rgba(31,109,122,0.30)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px" }}>
          <span style={{ fontSize: 24, color: B.teal }}>&#10003;</span>
        </div>

        {/* Overline */}
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 16 }}>
          Purchase Confirmed
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: 28, fontFamily: DISPLAY_FONT, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.15, color: B.cream, marginBottom: 36 }}>
          {hasExistingRecord ? "Your full report is ready." : "Your full assessment is ready to begin."}
        </h1>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 36, textAlign: "left" }}>
          {steps.map((step, i) => (
            <div
              key={step.num}
              style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                padding: "16px 0",
                borderBottom: "1px solid rgba(244,241,234,0.08)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.5s ease-out ${300 + i * 150}ms, transform 0.5s ease-out ${300 + i * 150}ms`,
              }}
            >
              <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: i === 0 ? "rgba(31,109,122,0.20)" : "rgba(244,241,234,0.06)", border: `1px solid ${i === 0 ? "rgba(31,109,122,0.30)" : "rgba(244,241,234,0.10)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {i === 0
                  ? <span style={{ fontSize: 12, color: B.teal }}>&#10003;</span>
                  : <span style={{ fontSize: 12, fontWeight: 700, color: B.cream }}>{step.num}</span>
                }
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: B.cream, marginBottom: 2 }}>{step.title}</div>
                <div style={{ fontSize: 13, color: "rgba(244,241,234,0.45)", lineHeight: 1.5 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA — user clicks when ready */}
        {ready ? (
          <Link
            href={hasExistingRecord ? "/unlock" : plan === "monitoring" ? "/create-account" : "/diagnostic-portal"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              maxWidth: 360,
              height: 52,
              borderRadius: 12,
              background: "linear-gradient(135deg, #F4F1EA 0%, #EDECEA 100%)",
              color: B.navy,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "-0.01em",
              boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
              transition: "transform 200ms ease, box-shadow 200ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.30)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.25)"; }}
          >
            {hasExistingRecord ? "View Full Report" : "Begin Assessment"}
          </Link>
        ) : (
          <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: B.cream, animation: `rp-pulse 1.4s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
          </div>
        )}

        <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
          {["Under 2 minutes", "No bank connection", "Model RP-2.0"].map((badge) => (
            <span key={badge} style={{ fontSize: 11, color: "rgba(244,241,234,0.30)", letterSpacing: "0.02em" }}>{badge}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: B.navy,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.15)",
              borderTopColor: "#ffffff",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
