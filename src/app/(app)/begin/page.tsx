"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BeginPage() {
  const router = useRouter();

  useEffect(() => {
    // Create free session so diagnostic-portal and diagnostic allow entry
    const existing = sessionStorage.getItem("rp_purchase_session") || localStorage.getItem("rp_purchase_session");
    if (!existing) {
      const freeSession = JSON.stringify({ plan_key: "free", status: "paid" });
      sessionStorage.setItem("rp_purchase_session", freeSession);
      localStorage.setItem("rp_purchase_session", freeSession);
    } else if (!sessionStorage.getItem("rp_purchase_session")) {
      sessionStorage.setItem("rp_purchase_session", existing);
    }
    // Mark as free plan for upgrade detection
    localStorage.setItem("rp_previous_plan", "free");

    // Go straight to the diagnostic portal
    router.replace("/diagnostic-portal");
  }, [router]);

  return null;
}
