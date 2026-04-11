"use client";

import { useState, useEffect } from "react";

/* ================================================================ */
/* RUNPAYWAY — Email Capture Component                               */
/* Premium inline signup for the Structural Income Brief.            */
/* ================================================================ */

const C = {
  navy: "#0E1A2B",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  sandMuted: "rgba(244,241,234,0.55)",
  risk: "#C74634",
};

import { WORKER_URL } from "@/lib/config";

const STORAGE_KEY = "rp_brief_signup";
const CONTACT_URL = `${WORKER_URL}/contact`;

interface EmailCaptureProps {
  variant?: "inline" | "standalone";
  source?: string;
}

export default function EmailCapture({ variant = "standalone", source = "homepage" }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Check if already signed up
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) setStatus("success");
    } catch { /* SSR safe */ }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@") || !trimmed.includes(".")) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(CONTACT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Structural Income Brief",
          email: trimmed,
          subject: "structural_income_brief",
          message: `Brief signup from ${source}.`,
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      localStorage.setItem(STORAGE_KEY, trimmed);
      setStatus("success");
      setEmail("");
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  // Success state
  if (status === "success") {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: variant === "inline" ? "flex-start" : "center",
        gap: 10,
        padding: variant === "inline" ? "8px 0" : "16px 0",
      }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="10" fill={C.teal} />
          <path d="M6 10.5L8.5 13L14 7.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{
          fontSize: variant === "inline" ? 14 : 16,
          fontWeight: 500,
          color: variant === "inline" ? C.sandMuted : C.sand,
        }}>
          You&rsquo;re in. Watch for your first brief.
        </span>
      </div>
    );
  }

  const isInline = variant === "inline";
  const isHorizontal = isInline || !mobile;

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: isInline ? 520 : 560 }}>
      <div style={{
        display: "flex",
        flexDirection: isHorizontal ? "row" : "column",
        gap: isHorizontal ? 0 : 12,
        borderRadius: isHorizontal ? 12 : 0,
        overflow: isHorizontal ? "hidden" : "visible",
        border: status === "error" ? `1.5px solid ${C.risk}` : isHorizontal ? `1px solid rgba(244,241,234,0.12)` : "none",
      }}>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
          placeholder="Enter your email"
          required
          aria-label="Email address for the Structural Income Brief"
          style={{
            flex: 1,
            minWidth: 0,
            height: isInline ? 44 : 52,
            padding: isInline ? "0 16px" : "0 20px",
            backgroundColor: C.navy,
            color: C.sand,
            border: isHorizontal ? "none" : `1px solid ${status === "error" ? C.risk : "rgba(244,241,234,0.12)"}`,
            borderRadius: isHorizontal ? 0 : 12,
            fontSize: isInline ? 14 : 16,
            fontWeight: 400,
            outline: "none",
            fontFamily: "inherit",
            letterSpacing: "-0.01em",
          }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            height: isInline ? 44 : 52,
            padding: isInline ? "0 20px" : "0 28px",
            backgroundColor: C.teal,
            color: "#fff",
            border: isHorizontal ? "none" : "none",
            borderRadius: isHorizontal ? 0 : 12,
            fontSize: isInline ? 13 : 15,
            fontWeight: 600,
            cursor: status === "loading" ? "wait" : "pointer",
            whiteSpace: "nowrap",
            fontFamily: "inherit",
            letterSpacing: "0.01em",
            transition: "background-color 200ms, opacity 200ms",
            opacity: status === "loading" ? 0.7 : 1,
            animation: status === "loading" ? "emailCapturePulse 1.5s ease-in-out infinite" : "none",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => { if (status !== "loading") (e.currentTarget as HTMLElement).style.backgroundColor = "#185c66"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = C.teal; }}
        >
          {status === "loading" ? "Sending..." : isInline ? "Get the Brief" : "Get the Structural Income Brief"}
        </button>
      </div>
      {status === "error" && errorMsg && (
        <p style={{ fontSize: 13, color: C.risk, marginTop: 8, marginBottom: 0 }}>{errorMsg}</p>
      )}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes emailCapturePulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.5; }
        }
        input::placeholder { color: rgba(244,241,234,0.35); }
      ` }} />
    </form>
  );
}
