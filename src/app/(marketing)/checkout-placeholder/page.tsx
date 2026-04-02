"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { C, mono, sans } from "@/lib/design-tokens";

const PLANS: Record<string, { name: string; price: string; priceCents: number; assessments: number; period?: string }> = {
  single: {
    name: "RunPayway\u2122 Diagnostic Report",
    price: "$69",
    priceCents: 6900,
    assessments: 1,
  },
  monitoring: {
    name: "RunPayway\u2122 Stability Monitoring",
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
    <div className="max-w-[520px] mx-auto px-6 py-24" style={{ fontFamily: sans }}>
      {/* Header */}
      <div className="mb-12">
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-3" style={{ color: C.light }}>
          Checkout
        </div>
        <h1 className="text-2xl font-semibold" style={{ color: C.navy }}>
          Confirm Your Assessment
        </h1>
      </div>

      {/* Plan Card */}
      <div
        className="rounded-lg border p-8"
        style={{
          borderColor: planKey === "monitoring" ? C.purple : C.softBorder,
          borderWidth: planKey === "monitoring" ? "2px" : "1px",
          backgroundColor: C.white,
        }}
      >
        <div className="space-y-6">
          {/* Plan */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: C.light }}>
              Plan
            </div>
            <div className="text-base font-semibold mt-1" style={{ color: C.navy }}>
              {plan.name}
            </div>
          </div>

          {/* Price */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: C.light }}>
              Price
            </div>
            <div className="text-[36px] font-semibold leading-none mt-1" style={{ color: C.navy, fontFamily: mono }}>
              {plan.price}
            </div>
          </div>

          {/* Details */}
          {planKey === "monitoring" && (
            <div className="rounded-md px-4 py-3" style={{ backgroundColor: C.sand }}>
              <div className="space-y-1">
                <div className="flex justify-between text-[13px]">
                  <span style={{ color: C.muted }}>Assessments allowed</span>
                  <span className="font-medium" style={{ color: C.navy, fontFamily: mono }}>{plan.assessments}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span style={{ color: C.muted }}>Monitoring period</span>
                  <span className="font-medium" style={{ color: C.navy }}>{plan.period}</span>
                </div>
              </div>
            </div>
          )}

          {planKey === "single" && (
            <div className="rounded-md px-4 py-3" style={{ backgroundColor: C.sand }}>
              <div className="flex justify-between text-[13px]">
                <span style={{ color: C.muted }}>Assessments allowed</span>
                <span className="font-medium" style={{ color: C.navy, fontFamily: mono }}>{plan.assessments}</span>
              </div>
            </div>
          )}

          {/* Stripe placeholder notice */}
          <div className="pt-4 border-t" style={{ borderColor: C.softBorder }}>
            <p className="text-[11px] leading-relaxed" style={{ color: C.light }}>
              In production, you will be redirected to Stripe Secure Checkout. This is a placeholder
              for development.
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={handleContinue}
            className="w-full py-3 text-[13px] font-medium rounded transition-opacity hover:opacity-90"
            style={{ backgroundColor: planKey === "monitoring" ? C.purple : C.navy, color: C.white }}
          >
            Continue to Assessment
          </button>

          {/* Confidence statement */}
          <p className="text-[10px] leading-relaxed text-center" style={{ color: C.light, marginTop: 16 }}>
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
          <div className="text-sm" style={{ color: C.light }}>Loading...</div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
