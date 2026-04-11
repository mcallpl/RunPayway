// RunPayway™ — Central Configuration
// Every constant, URL, and plan definition in one place.

export const WORKER_URL = "https://runpayway-pressuremap.mcallpl.workers.dev";

export const PLANS = {
  free: { key: "free", assessments: 1, price_cents: 0, duration_months: null, label: "Free Score" },
  single_assessment: { key: "single_assessment", assessments: 1, price_cents: 6900, duration_months: null, label: "Full Diagnostic" },
  annual_monitoring: { key: "annual_monitoring", assessments: 3, price_cents: 14900, duration_months: 12, label: "Annual Monitoring" },
} as const;

export const MODEL_VERSION = "RP-2.0";

export const SITE_BASE_PATH = "/RunPayway";
