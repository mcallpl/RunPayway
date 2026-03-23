"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  light: "#9CA3AF",
  gradient: "linear-gradient(135deg, #0E1A2B 0%, #4B3FAE 50%, #1F6D7A 100%)",
};

const PLAN_INFO: Record<string, { title: string; price: string }> = {
  monitoring: { title: "Annual Monitoring", price: "$199" },
  single: { title: "Complete Assessment", price: "$99" },
};

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "single";
  const stripeSessionId = searchParams.get("session_id") || "";
  const customerEmail = searchParams.get("email") || searchParams.get("customer_email") || "";
  const [ready, setReady] = useState(false);

  const info = PLAN_INFO[plan] || PLAN_INFO.single;

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
        setReady(true);
      })
      .catch(() => {
        sessionStorage.setItem("rp_purchase_session", JSON.stringify(session));
        localStorage.setItem("rp_purchase_session", JSON.stringify(session));
        setReady(true);
      });
  }, [plan, stripeSessionId, customerEmail]);

  // Redirect after token is stored
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => {
      router.push(plan === "monitoring" ? "/create-account" : "/diagnostic-portal");
    }, 3000);
    return () => clearTimeout(timer);
  }, [ready, router, plan]);

  return (
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
      <div style={{ textAlign: "center", maxWidth: 400, padding: "0 24px" }}>
        {/* Spinner */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.15)",
            borderTopColor: "#ffffff",
            margin: "0 auto 28px",
            animation: "spin 0.8s linear infinite",
          }}
        />

        {/* Label */}
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            marginBottom: 16,
          }}
        >
          PREPARING YOUR ASSESSMENT
        </div>

        {/* Product name */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 8,
          }}
        >
          {info.title}
        </div>

        {/* Price */}
        <div
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.5)",
            marginBottom: 32,
          }}
        >
          {info.price}
        </div>

        {/* Status text */}
        <div
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.35)",
            lineHeight: 1.6,
          }}
        >
          Setting up your Income Stability Assessment&trade;...
        </div>

        {/* Back to pricing link */}
        <Link
          href="/pricing"
          style={{
            display: "inline-block",
            marginTop: 48,
            fontSize: 13,
            color: "rgba(255,255,255,0.25)",
            textDecoration: "none",
            transition: "color 180ms ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.25)"; }}
        >
          &larr; Back to pricing
        </Link>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
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
