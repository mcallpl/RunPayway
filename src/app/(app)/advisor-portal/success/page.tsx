"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoBlue from "../../../../../public/runpayway-logo-blue.png";
import { C, mono, sans } from "@/lib/design-tokens";
import { WORKER_URL, ADVISOR_PLANS } from "@/lib/config";

/* ── Inner component (needs Suspense boundary for useSearchParams) ── */
function SuccessInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [advisorCode, setAdvisorCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const sessionId = params.get("session_id") || "";
    const email = params.get("email") || "";
    const plan = params.get("plan") || "advisor_starter";

    if (!sessionId || !email) {
      setErrorMsg("Missing payment information. Please try again or contact support.");
      setStatus("error");
      return;
    }

    // Validate tier
    if (!(plan in ADVISOR_PLANS)) {
      setErrorMsg("Invalid plan. Please contact support.");
      setStatus("error");
      return;
    }

    // Create advisor account
    fetch(`${WORKER_URL}/advisor/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        tier: plan,
        stripe_session_id: sessionId,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to create account");
        return res.json();
      })
      .then(data => {
        if (data?.advisor_code) {
          setAdvisorCode(data.advisor_code);
          localStorage.setItem("rp_advisor_code", data.advisor_code);
          setStatus("success");
        } else {
          throw new Error("No advisor code returned");
        }
      })
      .catch(err => {
        setErrorMsg(err.message || "Something went wrong. Please contact support.");
        setStatus("error");
      });
  }, [params, router]);

  const plan = params.get("plan") || "advisor_starter";
  const planInfo = ADVISOR_PLANS[plan as keyof typeof ADVISOR_PLANS];

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: C.panelFill, fontFamily: sans,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        maxWidth: 520, width: "100%", padding: mobile ? "40px 28px" : "60px 48px",
        textAlign: "center",
      }}>
        <Link href="/" style={{ display: "inline-flex", marginBottom: 36 }}>
          <Image src={logoBlue} alt="RunPayway" width={160} height={18} style={{ height: "auto" }} />
        </Link>

        {status === "loading" && (
          <>
            <div style={{
              width: 48, height: 48, borderRadius: 24, margin: "0 auto 24px",
              border: `3px solid ${C.border}`, borderTopColor: C.purple,
              animation: "spin 0.8s linear infinite",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ fontSize: 17, color: C.textSecondary }}>Setting up your advisor account...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{
              width: 56, height: 56, borderRadius: 28, margin: "0 auto 24px",
              backgroundColor: "rgba(199,70,52,0.08)", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke={C.risk} strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: C.navy, margin: "0 0 8px" }}>Something went wrong</h1>
            <p style={{ fontSize: 16, color: C.textSecondary, margin: "0 0 24px" }}>{errorMsg}</p>
            <Link href="/contact" style={{
              fontSize: 15, fontWeight: 600, color: C.purple, textDecoration: "none",
            }}>
              Contact support
            </Link>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{
              width: 56, height: 56, borderRadius: 28, margin: "0 auto 24px",
              backgroundColor: "rgba(31,109,122,0.08)", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke={C.teal} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h1 style={{ fontSize: mobile ? 24 : 28, fontWeight: 700, color: C.navy, margin: "0 0 8px" }}>
              Welcome to RunPayway™ Advisor
            </h1>
            <p style={{ fontSize: 16, color: C.textSecondary, margin: "0 0 32px" }}>
              Your {planInfo?.label || "Advisor"} account is ready.
            </p>

            {/* Advisor code display */}
            <div style={{
              padding: "24px 28px", borderRadius: 16,
              backgroundColor: C.white, border: `1px solid ${C.border}`,
              boxShadow: "0 10px 30px rgba(14,26,43,0.06)",
              marginBottom: 24,
            }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.textMuted, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                YOUR ADVISOR CODE
              </p>
              <p style={{
                fontSize: 28, fontWeight: 700, fontFamily: mono, color: C.navy,
                margin: "0 0 12px", letterSpacing: "0.06em",
              }}>
                {advisorCode}
              </p>
              <p style={{ fontSize: 14, color: C.textSecondary, margin: 0, lineHeight: 1.5 }}>
                Save this code. You&rsquo;ll use it to access your dashboard.
              </p>
            </div>

            <button
              onClick={() => router.push("/advisor-portal/dashboard")}
              style={{
                width: "100%", padding: "16px 24px", fontSize: 17, fontWeight: 600,
                fontFamily: sans, color: C.white, backgroundColor: C.purple,
                border: "none", borderRadius: 12, cursor: "pointer",
                boxShadow: "0 8px 24px rgba(75,63,174,0.18)",
              }}
            >
              Continue to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Page wrapper with Suspense ── */
export default function AdvisorSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", backgroundColor: "#F8F6F1" }} />
    }>
      <SuccessInner />
    </Suspense>
  );
}
