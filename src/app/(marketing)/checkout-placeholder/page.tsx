"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  sandDk: "#EDE9E0",
  muted: "#6B7280",
  light: "#9CA3AF",
};

const PLANS: Record<string, { name: string; price: string; priceCents: number; assessments: number; period?: string }> = {
  single: {
    name: "Diagnostic Report",
    price: "$69",
    priceCents: 6900,
    assessments: 1,
  },
  monitoring: {
    name: "Stability Monitoring",
    price: "$149",
    priceCents: 14900,
    assessments: 3,
    period: "12 months",
  },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planKey = searchParams.get("plan") || "single";
  const plan = PLANS[planKey] || PLANS.single;

  const handleContinue = () => {
    // In production, this would create a purchase_session and redirect to Stripe.
    // For now, simulate paid status and redirect to diagnostic portal.
    sessionStorage.setItem(
      "rp_purchase_session",
      JSON.stringify({
        plan_key: planKey === "monitoring" ? "annual_monitoring" : "single_assessment",
        price_cents: plan.priceCents,
        currency: "USD",
        intended_assessment_count: plan.assessments,
        status: "paid",
        checkout_provider: "placeholder",
      })
    );
    router.push(planKey === "monitoring" ? "/create-account" : "/diagnostic-portal");
  };

  return (
    <div className="max-w-[520px] mx-auto px-6 py-24">
      {/* Header */}
      <div className="mb-12">
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-3" style={{ color: B.light }}>
          Checkout
        </div>
        <h1 className="text-2xl font-semibold" style={{ color: B.navy }}>
          Confirm Your Assessment
        </h1>
      </div>

      {/* Plan Card */}
      <div
        className="rounded-lg border p-8"
        style={{
          borderColor: planKey === "monitoring" ? B.purple : B.sandDk,
          borderWidth: planKey === "monitoring" ? "2px" : "1px",
          backgroundColor: "#ffffff",
        }}
      >
        <div className="space-y-6">
          {/* Plan */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: B.light }}>
              Plan
            </div>
            <div className="text-base font-semibold mt-1" style={{ color: B.navy }}>
              {plan.name}
            </div>
          </div>

          {/* Price */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: B.light }}>
              Price
            </div>
            <div className="text-[36px] font-semibold leading-none mt-1" style={{ color: B.navy }}>
              {plan.price}
            </div>
          </div>

          {/* Details */}
          {planKey === "monitoring" && (
            <div className="rounded-md px-4 py-3" style={{ backgroundColor: B.sand }}>
              <div className="space-y-1">
                <div className="flex justify-between text-[13px]">
                  <span style={{ color: B.muted }}>Assessments allowed</span>
                  <span className="font-medium" style={{ color: B.navy }}>{plan.assessments}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span style={{ color: B.muted }}>Monitoring period</span>
                  <span className="font-medium" style={{ color: B.navy }}>{plan.period}</span>
                </div>
              </div>
            </div>
          )}

          {planKey === "single" && (
            <div className="rounded-md px-4 py-3" style={{ backgroundColor: B.sand }}>
              <div className="flex justify-between text-[13px]">
                <span style={{ color: B.muted }}>Assessments allowed</span>
                <span className="font-medium" style={{ color: B.navy }}>{plan.assessments}</span>
              </div>
            </div>
          )}

          {/* Stripe placeholder notice */}
          <div className="pt-4 border-t" style={{ borderColor: B.sandDk }}>
            <p className="text-[11px] leading-relaxed" style={{ color: B.light }}>
              In production, you will be redirected to Stripe Secure Checkout. This is a placeholder
              for development.
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={handleContinue}
            className="w-full py-3 text-[13px] font-medium rounded transition-opacity hover:opacity-90"
            style={{ backgroundColor: planKey === "monitoring" ? B.purple : B.navy, color: "#ffffff" }}
          >
            Continue to Assessment
          </button>

          {/* Confidence statement */}
          <p className="text-[10px] leading-relaxed text-center" style={{ color: B.light, marginTop: 16 }}>
            Every assessment is backed by a deterministic scoring model. Identical inputs always produce identical results. Your score reflects your income structure exactly as reported.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPlaceholderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-sm" style={{ color: B.light }}>Loading...</div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
