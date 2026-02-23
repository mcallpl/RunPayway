"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Incomplete Diagnostic Return Guard
 *
 * Monitors user inactivity on non-diagnostic portal pages and prompts
 * them to return to the in-progress diagnostic.
 *
 * Behavior (LOCKED):
 * - Only activates when paid=true AND progress<100 AND NOT on /assess page
 * - 5s inactivity → modal
 * - 15s total inactivity → auto-redirect (if not snoozed)
 * - "Not now" → 60s snooze
 * - progress=100 → permanently disabled
 */
export default function ReturnGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const inactivityStart = useRef<ReturnType<typeof setTimeout> | null>(null);
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const snoozeUntil = useRef(0);
  const disabled = useRef(false);

  const isAssessPage = pathname?.includes("/assess");

  const getDiagnosticUrl = useCallback(() => {
    const token = sessionStorage.getItem("rp_diagnostic_token") || "";
    return `/assess/?token=${encodeURIComponent(token)}`;
  }, []);

  const shouldGuard = useCallback(() => {
    if (disabled.current) return false;
    if (isAssessPage) return false;
    const paid = sessionStorage.getItem("rp_diagnostic_paid");
    const progress = parseInt(
      sessionStorage.getItem("rp_diagnostic_progress") || "0",
      10
    );
    if (paid !== "true") return false;
    if (progress >= 100) {
      disabled.current = true;
      return false;
    }
    if (Date.now() < snoozeUntil.current) return false;
    return true;
  }, [isAssessPage]);

  const clearTimers = useCallback(() => {
    if (inactivityStart.current) {
      clearTimeout(inactivityStart.current);
      inactivityStart.current = null;
    }
    if (redirectTimer.current) {
      clearTimeout(redirectTimer.current);
      redirectTimer.current = null;
    }
  }, []);

  const startTimers = useCallback(() => {
    clearTimers();
    if (!shouldGuard()) return;

    // 5s inactivity → show modal
    inactivityStart.current = setTimeout(() => {
      if (!shouldGuard()) return;
      setShowModal(true);

      // 10s more (15s total) → auto-redirect
      redirectTimer.current = setTimeout(() => {
        // Re-check snooze and progress before redirecting
        const progress = parseInt(
          sessionStorage.getItem("rp_diagnostic_progress") || "0",
          10
        );
        if (progress >= 100 || Date.now() < snoozeUntil.current) return;
        router.push(getDiagnosticUrl());
      }, 10_000);
    }, 5_000);
  }, [shouldGuard, clearTimers, router, getDiagnosticUrl]);

  const resetOnActivity = useCallback(() => {
    setShowModal(false);
    clearTimers();
    startTimers();
  }, [clearTimers, startTimers]);

  useEffect(() => {
    if (!shouldGuard()) {
      setShowModal(false);
      clearTimers();
      return;
    }

    const events: (keyof WindowEventMap)[] = [
      "scroll",
      "mousemove",
      "keydown",
      "click",
      "touchstart",
    ];

    events.forEach((evt) => window.addEventListener(evt, resetOnActivity));
    startTimers();

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, resetOnActivity));
      clearTimers();
    };
  }, [pathname, shouldGuard, startTimers, clearTimers, resetOnActivity]);

  // Periodically check if progress hit 100 (e.g. from another tab)
  useEffect(() => {
    const interval = setInterval(() => {
      const progress = parseInt(
        sessionStorage.getItem("rp_diagnostic_progress") || "0",
        10
      );
      if (progress >= 100) {
        disabled.current = true;
        setShowModal(false);
        clearTimers();
      }
    }, 2_000);
    return () => clearInterval(interval);
  }, [clearTimers]);

  const handleReturn = () => {
    clearTimers();
    router.push(getDiagnosticUrl());
  };

  const handleNotNow = () => {
    snoozeUntil.current = Date.now() + 60_000;
    setShowModal(false);
    clearTimers();
    // After snooze expires, restart timing fresh
    setTimeout(() => {
      startTimers();
    }, 60_000);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-6">
      <div className="bg-white max-w-md w-full p-8 text-center">
        <h2 className="text-lg font-semibold text-navy-900 mb-3">
          Diagnostic in progress
        </h2>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Return to finish and generate your formal report.
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleReturn}
            className="bg-navy-900 text-white py-3 px-6 font-medium hover:bg-navy-800 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-900 focus:ring-offset-2"
          >
            Return to Diagnostic
          </button>
          <button
            type="button"
            onClick={handleNotNow}
            className="text-sm text-gray-500 hover:text-navy-900 transition-colors py-2"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
