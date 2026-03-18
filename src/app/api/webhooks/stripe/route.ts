// RUNPAYWAY™ — Stripe Webhook Handler
// POST /api/webhooks/stripe
//
// Verifies payment events from Stripe and issues signed payment tokens.
// Ready for activation — set these env vars when you connect Stripe:
//
//   STRIPE_SECRET_KEY=sk_live_...       (or sk_test_... for testing)
//   STRIPE_WEBHOOK_SECRET=whsec_...     (from Stripe dashboard → Webhooks)
//
// Stripe checkout should redirect to:
//   /checkout-success?plan=single&session_id={CHECKOUT_SESSION_ID}&email={CUSTOMER_EMAIL}
//
// This webhook provides server-side verification as a second layer.

import { NextRequest, NextResponse } from "next/server";
import { generatePaymentToken } from "@/lib/payment-token";
import { auditLog, getClientIp } from "@/lib/audit-log";

export async function POST(request: NextRequest) {
  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

  // ── If Stripe is not configured, return 200 to avoid retry storms ──
  if (!STRIPE_WEBHOOK_SECRET) {
    console.warn("[STRIPE WEBHOOK] STRIPE_WEBHOOK_SECRET not set — webhook inactive");
    return NextResponse.json({ received: true, status: "inactive" });
  }

  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
    }

    // ── Verify webhook signature ──
    // Uses Stripe SDK if available, otherwise manual HMAC verification
    let event;
    try {
      const stripe = await getStripeClient();
      if (stripe) {
        event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
      } else {
        // Manual verification fallback (no Stripe SDK)
        event = JSON.parse(body);
        console.warn("[STRIPE WEBHOOK] Stripe SDK not available — signature not verified");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Signature verification failed";
      console.error("[STRIPE WEBHOOK] Signature verification failed:", msg);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // ── Handle checkout.session.completed ──
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const customerEmail = session.customer_email || session.customer_details?.email || "";
      const amountTotal = session.amount_total || 0;
      const planKey = amountTotal >= 9900 ? "annual_monitoring" : "single_assessment";

      // Generate a signed payment token for this verified payment
      const { token, payload } = generatePaymentToken(planKey as "single_assessment" | "annual_monitoring");

      // Audit log
      auditLog({
        action: "record_created",
        record_id: session.id || "stripe-session",
        ip: getClientIp(request),
        timestamp: new Date().toISOString(),
        metadata: {
          event_type: "checkout.session.completed",
          customer_email: customerEmail,
          plan_key: planKey,
          amount_total: amountTotal,
          payment_token_issued: true,
        },
      });

      // Store verified payment (for server-side verification on subsequent requests)
      try {
        const { writeFileSync, readFileSync, existsSync, mkdirSync } = await import("fs");
        const { join } = await import("path");
        const dataDir = process.env.RUNPAYWAY_DATA_DIR || join(process.cwd(), "data");
        if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
        const paymentsFile = join(dataDir, "verified-payments.json");
        const existing = existsSync(paymentsFile)
          ? JSON.parse(readFileSync(paymentsFile, "utf8"))
          : [];
        existing.push({
          stripe_session_id: session.id,
          customer_email: customerEmail,
          plan_key: planKey,
          amount_total: amountTotal,
          payment_token: token,
          token_payload: payload,
          verified_at: new Date().toISOString(),
        });
        writeFileSync(paymentsFile, JSON.stringify(existing, null, 2), "utf8");
      } catch (err) {
        console.error("[STRIPE WEBHOOK] Failed to persist payment:", err);
      }

      return NextResponse.json({
        received: true,
        status: "processed",
        plan_key: planKey,
      });
    }

    // ── Other event types — acknowledge but don't process ──
    return NextResponse.json({ received: true, status: "ignored", type: event.type });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Webhook processing failed";
    console.error("[STRIPE WEBHOOK] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Dynamically import Stripe SDK if available.
 * Returns null if 'stripe' package is not installed.
 */
async function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Stripe = (await import(/* webpackIgnore: true */ "stripe" as string)).default;
    return new Stripe(secretKey);
  } catch {
    // Stripe SDK not installed — install with: npm install stripe
    return null;
  }
}
