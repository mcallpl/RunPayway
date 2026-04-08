"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PressureMapRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/dashboard"); }, [router]);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <p style={{ fontSize: 14, color: "rgba(14,26,43,0.52)" }}>Redirecting to Dashboard...</p>
    </div>
  );
}
