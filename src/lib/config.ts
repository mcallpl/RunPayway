// RunPayway™ — Central Configuration
// Every constant, URL, and plan definition in one place.

export const WORKER_URL = "https://runpayway-pressuremap.mcallpl.workers.dev";

export const PLANS = {
  free: { key: "free", assessments: 1, price_cents: 0, duration_months: null, label: "Free Score" },
  single_assessment: { key: "single_assessment", assessments: 1, price_cents: 6900, duration_months: null, label: "Full Diagnostic" },
  annual_monitoring: { key: "annual_monitoring", assessments: 3, price_cents: 14900, duration_months: 12, label: "Annual Monitoring" },
} as const;

export const ADVISOR_PLANS = {
  advisor_starter:      { key: "advisor_starter",      reports: 15,  price_cents: 24900, period_months: 3,  label: "Starter",      interval: "quarter" },
  advisor_professional: { key: "advisor_professional",  reports: 50,  price_cents: 17900, period_months: 1,  label: "Professional", interval: "month" },
  advisor_enterprise:   { key: "advisor_enterprise",    reports: -1,  price_cents: 14900, period_months: 1,  label: "Enterprise",   interval: "seat/month" },
} as const;

// Stripe Checkout hosted links
export const STRIPE_ADVISOR_STARTER = process.env.NEXT_PUBLIC_STRIPE_ADVISOR_STARTER || "https://buy.stripe.com/00wdR148EffabVMfnj2Nq07";
export const STRIPE_ADVISOR_PROFESSIONAL = process.env.NEXT_PUBLIC_STRIPE_ADVISOR_PROFESSIONAL || "https://buy.stripe.com/dRm7sD8oU8QM4tk3EB2Nq08";
export const STRIPE_ADVISOR_ENTERPRISE = process.env.NEXT_PUBLIC_STRIPE_ADVISOR_ENTERPRISE || "https://buy.stripe.com/fZu5kv8oU5EA1h82Ax2Nq09";

export const MODEL_VERSION = "RP-2.0";

export const SITE_BASE_PATH = "/RunPayway";
