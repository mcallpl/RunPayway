"use client";
import { useEffect } from "react";

const WORKER_URL = "https://runpayway-pressuremap.mcallpl.workers.dev/error-report";

export function reportError(data: { error_message: string; error_stack?: string; component?: string }) {
  try {
    const payload = { ...data, page_url: typeof window !== "undefined" ? window.location.href : "", user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "" };
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(WORKER_URL, blob);
    } else {
      fetch(WORKER_URL, { method: "POST", body: blob, keepalive: true }).catch(() => {});
    }
  } catch { /* reporting should never throw */ }
}

export default function ErrorReporter() {
  useEffect(() => {
    const onError = (e: ErrorEvent) => { reportError({ error_message: e.message || "Unknown", error_stack: e.error?.stack || "", component: "window.onerror" }); };
    const onRejection = (e: PromiseRejectionEvent) => { reportError({ error_message: e.reason?.message || String(e.reason) || "Unhandled rejection", error_stack: e.reason?.stack || "", component: "unhandledrejection" }); };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => { window.removeEventListener("error", onError); window.removeEventListener("unhandledrejection", onRejection); };
  }, []);
  return null;
}
