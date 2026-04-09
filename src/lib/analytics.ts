// RUNPAYWAY™ — Lightweight Analytics
// Tracks page views and key funnel events without third-party scripts.
// Events are sent to a Cloudflare Worker endpoint for aggregation.
// Pixel events (GA4, Meta, LinkedIn) are fired alongside custom analytics.

import { trackGA4Event, trackMetaEvent, trackLinkedInConversion } from "@/components/AnalyticsPixels";

const ANALYTICS_ENDPOINT = "https://runpayway-pressuremap.mcallpl.workers.dev/analytics";

interface AnalyticsEvent {
  event: string;
  page?: string;
  referrer?: string;
  industry?: string;
  score?: number;
  plan?: string;
  timestamp: string;
}

let sessionId: string | null = null;

function getSessionId(): string {
  if (sessionId) return sessionId;
  sessionId = Math.random().toString(36).substring(2, 10);
  return sessionId;
}

function send(event: AnalyticsEvent) {
  try {
    const payload = {
      ...event,
      session: getSessionId(),
      url: typeof window !== "undefined" ? window.location.pathname : "",
    };
    // Use sendBeacon for reliability (fires even on page unload)
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(ANALYTICS_ENDPOINT, JSON.stringify(payload));
    } else {
      fetch(ANALYTICS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Silent — analytics should never break the app
  }
}

/** Track a page view */
export function trackPageView(page?: string) {
  send({
    event: "page_view",
    page: page || (typeof window !== "undefined" ? window.location.pathname : ""),
    referrer: typeof document !== "undefined" ? document.referrer : "",
    timestamp: new Date().toISOString(),
  });
}

/** Track assessment start (user clicks "Get My Score" or begins diagnostic) */
export function trackAssessmentStart(industry?: string) {
  send({
    event: "assessment_start",
    industry,
    timestamp: new Date().toISOString(),
  });
}

/** Track assessment complete (score generated) */
export function trackAssessmentComplete(score: number, industry?: string) {
  send({
    event: "assessment_complete",
    score,
    industry,
    timestamp: new Date().toISOString(),
  });
  // Fire pixel events for assessment completion
  trackGA4Event("assessment_complete", { score, industry });
  trackMetaEvent("CompleteRegistration", { value: score, content_name: industry });
}

/** Track purchase initiation (clicked Stripe link) */
export function trackPurchaseClick(plan: string) {
  send({
    event: "purchase_click",
    plan,
    timestamp: new Date().toISOString(),
  });
  // Fire pixel events for purchase intent
  trackGA4Event("purchase_click", { plan });
  trackMetaEvent("InitiateCheckout", { content_name: plan });
}

/** Track any custom event */
export function trackEvent(event: string, data?: Record<string, string | number>) {
  send({
    event,
    ...data,
    timestamp: new Date().toISOString(),
  } as AnalyticsEvent);
}
