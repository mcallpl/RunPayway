"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  light: "#9CA3AF",
  gradient: "linear-gradient(135deg, #0E1A2B 0%, #4B3FAE 50%, #1F6D7A 100%)",
};

const STEPS = [
  "Payment confirmed",
  "Activating assessment",
  "Preparing your diagnostic",
  "Redirecting to assessment portal",
];

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "single";
  const [step, setStep] = useState(0);

  // Store purchase session
  useEffect(() => {
    sessionStorage.setItem(
      "rp_purchase_session",
      JSON.stringify({
        plan_key: plan === "monitoring" ? "annual_monitoring" : "single_assessment",
        price_cents: plan === "monitoring" ? 9900 : 3900,
        currency: "USD",
        intended_assessment_count: plan === "monitoring" ? 3 : 1,
        status: "paid",
        checkout_provider: "stripe",
      })
    );
  }, [plan]);

  // Step animation
  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= STEPS.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Redirect after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(plan === "monitoring" ? "/create-account" : "/diagnostic-portal");
    }, 4000);
    return () => clearTimeout(timer);
  }, [router, plan]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 420, padding: "0 24px" }}>
        {/* Success check */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: B.teal,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: "0 8px 24px rgba(31,109,122,0.25)",
          }}
        >
          <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
            <path d="M2 11L10 19L26 3" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: B.navy,
            letterSpacing: "-0.02em",
            marginBottom: 8,
          }}
        >
          Payment Successful
        </h1>
        <p
          style={{
            fontSize: 15,
            color: B.light,
            lineHeight: 1.6,
            marginBottom: 36,
          }}
        >
          {plan === "monitoring"
            ? "Annual Monitoring activated — 3 assessments over 12 months."
            : "Single Assessment activated — your diagnostic is ready."}
        </p>

        {/* Processing steps */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            textAlign: "left",
            marginBottom: 36,
          }}
        >
          {STEPS.map((label, i) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 0",
                borderBottom: i < STEPS.length - 1 ? "1px solid rgba(14,26,43,0.04)" : "none",
                opacity: i <= step ? 1 : 0.25,
                transition: "opacity 400ms ease",
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: i < step ? B.teal : i === step ? B.purple : "rgba(14,26,43,0.08)",
                  transition: "background 400ms ease",
                  flexShrink: 0,
                }}
              >
                {i < step ? (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : i === step ? (
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#fff",
                    }}
                  />
                ) : null}
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: i <= step ? 500 : 400,
                  color: i <= step ? B.navy : B.light,
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: 3,
            borderRadius: 2,
            background: "rgba(14,26,43,0.06)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 2,
              background: B.gradient,
              animation: "checkoutProgress 3.6s ease-in-out forwards",
            }}
          />
        </div>

        <p
          style={{
            fontSize: 12,
            color: B.light,
            marginTop: 16,
          }}
        >
          Powered by Stripe Secure Checkout
        </p>

        <style>{`
          @keyframes checkoutProgress {
            0% { width: 0%; }
            25% { width: 30%; }
            50% { width: 60%; }
            75% { width: 85%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
          <div style={{ fontSize: 14, color: B.light }}>Loading...</div>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
