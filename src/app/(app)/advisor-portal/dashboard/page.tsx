"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logoBlue from "../../../../../public/runpayway-logo-blue.png";
import { C, mono, sans } from "@/lib/design-tokens";
import { WORKER_URL } from "@/lib/config";
import InlineAssessment from "./InlineAssessment";
import type { CanonicalAdvisorRecord, InterpretationResult } from "@/lib/engine/v2/schemas/canonical-record";

/* ── Industry list (matches engine profiles) ──────────── */
const INDUSTRIES = [
  "Real Estate",
  "Professional Services",
  "Agency / Client Services",
  "Private Practice / Coaching",
  "Creator / Media",
  "E-commerce / Product",
  "Investing / Asset Income",
  "Sales / Brokerage",
  "Technology",
  "Finance / Banking",
  "Insurance",
  "Healthcare",
  "Legal Services",
  "Construction / Trades",
  "Hospitality / Food Service",
  "Transportation / Logistics",
  "Manufacturing",
  "Education",
  "Nonprofit / Public Sector",
  "Agriculture",
  "Energy / Utilities",
] as const;


/* ── Types ─────────────────────────────────────────────── */
interface AdvisorClient {
  id: string;
  name: string;
  industry: string;
  score: number;
  band: string;
  topRisk: string;
  assessmentDate: string;
  notes: string;
  canonicalRecord?: CanonicalAdvisorRecord;
  interpretation?: InterpretationResult;
}

/* ── Helpers ───────────────────────────────────────────── */
function bandFromScore(s: number): string {
  if (s <= 0) return "Not assessed";
  if (s < 30) return "Limited Stability";
  if (s < 50) return "Developing Stability";
  if (s < 75) return "Established Stability";
  return "High Stability";
}

function bandColor(band: string): string {
  switch (band) {
    case "Limited Stability": return C.risk;
    case "Developing Stability": return C.moderate;
    case "Established Stability": return C.bandEstablished;
    case "High Stability": return C.teal;
    default: return C.textMuted;
  }
}

function talkingPoint(topRisk: string, industry: string): string {
  const points: Record<string, string> = {
    "Income Concentration": `In ${industry}, heavy reliance on one or two clients creates fragility. Ask about diversifying revenue sources.`,
    "Labor Dependence": `In ${industry}, income tied to hours worked limits growth. Discuss recurring revenue or productized services.`,
    "Forward Visibility": `In ${industry}, short-term visibility makes planning difficult. Explore retainers, contracts, or pipeline indicators.`,
    "Low Persistence": `In ${industry}, project-based income restarts from zero. Ask what percentage of this year's income was locked in on January 1.`,
    "Income Variability": `In ${industry}, month-to-month swings complicate planning. Ask about smoothing strategies or seasonal adjustments.`,
    "Source Diversity": `In ${industry}, relying on a single income type creates risk. Explore complementary revenue streams.`,
  };
  return points[topRisk] || "";
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ── Dashboard Header ────────────────────────────────────── */
function DashboardHeader({ mobile: m, reportsUsed, reportsTotal }: { mobile: boolean; reportsUsed: number; reportsTotal: number }) {
  return (
    <header style={{
      borderBottom: `1px solid ${C.border}`,
      backgroundColor: "rgba(247,246,243,0.97)",
      backdropFilter: "blur(12px)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        height: m ? 56 : 64,
        padding: m ? "0 16px" : "0 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: m ? 10 : 16, minWidth: 0 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <Image src={logoBlue} alt="RunPayway" width={m ? 100 : 140} height={16} style={{ height: "auto" }} />
          </Link>
          <div style={{ width: 1, height: 24, backgroundColor: C.border }} />
          <span style={{
            fontSize: 13, fontWeight: 700, letterSpacing: "0.10em",
            textTransform: "uppercase" as const, color: C.purple,
          }}>
            ADVISOR DASHBOARD
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: m ? 12 : 20 }}>
          {/* Usage meter */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: m ? 60 : 80, height: 6, borderRadius: 3,
              backgroundColor: "rgba(14,26,43,0.08)", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", borderRadius: 3,
                width: reportsTotal > 0 ? `${Math.min(100, (reportsUsed / reportsTotal) * 100)}%` : "0%",
                backgroundColor: reportsUsed >= reportsTotal ? C.risk : C.teal,
                transition: "width 300ms",
              }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, fontFamily: mono, whiteSpace: "nowrap" as const }}>
              {reportsUsed}/{reportsTotal}
            </span>
          </div>
          {!m && (
            <nav style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {[
                { href: "#book-overview", label: "Overview" },
                { href: "#client-list", label: "Clients" },
              ].map(link => (
                <a key={link.href} href={link.href} style={{
                  fontSize: 14, fontWeight: 500,
                  color: C.muted, textDecoration: "none",
                  minHeight: 44, display: "inline-flex", alignItems: "center",
                }}>
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

/* ── Component ─────────────────────────────────────────── */
export default function AdvisorDashboardPage() {
  const [mobile, setMobile] = useState(false);
  const [advisorCode, setAdvisorCode] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState("");
  const [loading, setLoading] = useState(true);

  /* Client data */
  const [clients, setClients] = useState<AdvisorClient[]>([]);
  const [sortAsc, setSortAsc] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /* Add client form */
  const [newName, setNewName] = useState("");
  const [newIndustry, setNewIndustry] = useState("");


  /* Notes editing */
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  /* Inline assessment */
  const [assessingId, setAssessingId] = useState<string | null>(null);

  /* Usage tracking — server-driven */
  const [reportsUsed, setReportsUsed] = useState(0);
  const [reportsTotal, setReportsTotal] = useState(15);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [quotaExhausted, setQuotaExhausted] = useState(false);

  /* ── Effects ── */
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("rp_advisor_code");

    // Load client data from localStorage
    const raw = localStorage.getItem("rp_advisor_clients");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setClients(parsed.map((c: AdvisorClient) => ({ ...c, notes: c.notes || "" })));
      } catch { /* corrupt data, ignore */ }
    }

    if (!stored) {
      setLoading(false);
      return;
    }

    // Validate code server-side
    fetch(`${WORKER_URL}/advisor/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ advisor_code: stored }),
    })
      .then(res => res.json())
      .then(data => {
        if (data?.valid) {
          setAdvisorCode(stored);
          setReportsUsed(data.reports_used || 0);
          setReportsTotal(data.reports_limit === -1 ? -1 : (data.reports_limit || 15));
        } else {
          localStorage.removeItem("rp_advisor_code");
          setValidationError(
            data?.reason === "expired" ? "Your subscription has expired."
            : data?.reason === "inactive" ? "Your account is no longer active."
            : "Invalid advisor code."
          );
        }
      })
      .catch(() => {
        // Network error — allow offline access with stored code
        setAdvisorCode(stored);
      })
      .finally(() => setLoading(false));
  }, []);

  const persistClients = (next: AdvisorClient[]) => {
    setClients(next);
    localStorage.setItem("rp_advisor_clients", JSON.stringify(next));
  };

  const handleActivate = async () => {
    const trimmed = codeInput.trim();
    if (!trimmed) return;
    setValidationError(null);
    setLoading(true);
    try {
      const res = await fetch(`${WORKER_URL}/advisor/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ advisor_code: trimmed }),
      });
      const data = await res.json();
      if (data?.valid) {
        localStorage.setItem("rp_advisor_code", trimmed);
        setAdvisorCode(trimmed);
        setReportsUsed(data.reports_used || 0);
        setReportsTotal(data.reports_limit === -1 ? -1 : (data.reports_limit || 15));
      } else {
        setValidationError(
          data?.reason === "expired" ? "This code has expired."
          : data?.reason === "not_found" ? "Code not recognized. Check your code and try again."
          : "Invalid advisor code."
        );
      }
    } catch {
      setValidationError("Unable to verify code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Client mutations ── */
  const addClient = () => {
    if (!newName.trim() || !newIndustry) return;
    const entry: AdvisorClient = {
      id: uid(),
      name: newName.trim(),
      industry: newIndustry,
      score: 0,
      band: "Not assessed",
      topRisk: "Not assessed",
      assessmentDate: new Date().toISOString().slice(0, 10),
      notes: "",
    };
    persistClients([...clients, entry]);
    setNewName("");
    setNewIndustry("");
  };



  const saveNotes = (id: string) => {
    const next = clients.map(c =>
      c.id === id ? { ...c, notes: notesDraft } : c
    );
    persistClients(next);
    setEditingNotesId(null);
    setNotesDraft("");
  };

  const removeClient = (id: string) => {
    persistClients(clients.filter(c => c.id !== id));
  };

  const canRunAssessment = (): boolean => {
    // Unlimited plan (reportsTotal === -1) can always run assessments
    if (reportsTotal === -1) return true;
    // Otherwise check if quota remaining
    return reportsUsed < reportsTotal;
  };

  const handleStartAssessment = (clientId: string) => {
    if (!canRunAssessment()) {
      setQuotaExhausted(true);
      return;
    }
    setQuotaExhausted(false);
    setAssessingId(assessingId === clientId ? null : clientId);
  };

  /* ── Derived analytics ── */
  const assessed = clients.filter(c => c.score > 0);
  const pending = clients.filter(c => c.score === 0);
  const avgScore = assessed.length ? Math.round(assessed.reduce((a, c) => a + c.score, 0) / assessed.length) : 0;
  const redZone = assessed.filter(c => c.score < 30).length;
  const improvable = assessed.filter(c => c.score < 85 && c.score >= 30).length;

  const sorted = [...clients].sort((a, b) => sortAsc ? a.score - b.score : b.score - a.score);

  /* Risk concentration */
  const riskCounts: Record<string, number> = {};
  assessed.forEach(c => {
    if (c.topRisk !== "Not assessed") riskCounts[c.topRisk] = (riskCounts[c.topRisk] || 0) + 1;
  });
  const topRiskEntry = Object.entries(riskCounts).sort((a, b) => b[1] - a[1])[0];

  /* Time analytics */
  const dates = clients.map(c => c.assessmentDate).sort();
  const oldest = dates[0] || null;
  const newest = dates[dates.length - 1] || null;
  let trend = "stable";
  if (assessed.length >= 6) {
    const first3 = assessed.slice(0, 3).reduce((a, c) => a + c.score, 0) / 3;
    const last3 = assessed.slice(-3).reduce((a, c) => a + c.score, 0) / 3;
    trend = last3 > first3 + 3 ? "improving" : last3 < first3 - 3 ? "declining" : "stable";
  }

  /* ── Shared styles ── */
  const pad = mobile ? "28px" : "48px";
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    fontSize: 16,
    fontFamily: sans,
    border: `1px solid ${C.borderSoft}`,
    borderRadius: 10,
    backgroundColor: C.panelFill,
    color: C.textPrimary,
    outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 600,
    color: C.textPrimary,
    fontFamily: sans,
    marginBottom: 6,
    display: "block",
  };
  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: "none" as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%235E6873' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 16px center",
    paddingRight: 40,
  };
  const cardBase: React.CSSProperties = {
    backgroundColor: C.white,
    borderRadius: 20,
    boxShadow: "0 10px 30px rgba(14,26,43,0.06)",
    border: `1px solid ${C.border}`,
  };
  const btnPrimary: React.CSSProperties = {
    fontSize: 13, fontWeight: 600, color: C.purple, backgroundColor: "rgba(75,63,174,0.06)",
    border: `1px solid rgba(75,63,174,0.15)`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontFamily: sans,
  };
  const btnTeal: React.CSSProperties = {
    fontSize: 13, fontWeight: 600, color: C.teal, backgroundColor: "rgba(31,109,122,0.06)",
    border: `1px solid rgba(31,109,122,0.15)`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontFamily: sans,
  };

  /* ── Loading state ── */
  if (loading) {
    return <div style={{ minHeight: "100vh", backgroundColor: C.panelFill }} />;
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* CODE GATE                                                */
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  if (!advisorCode) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: C.panelFill, fontFamily: sans, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 440, width: "100%", padding: mobile ? "40px 28px" : "60px 48px", textAlign: "center" }}>
          <Link href="/" style={{ display: "inline-flex", marginBottom: 32 }}>
            <Image src={logoBlue} alt="RunPayway" width={160} height={18} style={{ height: "auto" }} />
          </Link>
          <h1 style={{ fontSize: mobile ? 24 : 28, fontWeight: 700, color: C.navy, margin: "0 0 8px", fontFamily: sans }}>
            Advisor Dashboard
          </h1>
          <p style={{ fontSize: 16, color: C.textSecondary, margin: "0 0 32px", fontFamily: sans }}>
            Enter your advisor code to continue.
          </p>
          {validationError && (
            <p style={{ fontSize: 14, color: C.risk, margin: "0 0 16px", fontFamily: sans, fontWeight: 600 }}>
              {validationError}
            </p>
          )}
          <div style={{ display: "flex", gap: 10, flexDirection: mobile ? "column" : "row" }}>
            <input
              type="text"
              value={codeInput}
              onChange={e => setCodeInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleActivate()}
              placeholder="Advisor code"
              style={{ ...inputStyle, flex: 1, fontFamily: mono, fontSize: 14, letterSpacing: "0.03em", textAlign: "center" }}
            />
            <button onClick={handleActivate} style={{
              padding: "14px 28px", fontSize: 15, fontWeight: 600, fontFamily: sans, color: C.white,
              backgroundColor: C.purple, border: "none", borderRadius: 10, cursor: "pointer",
              boxShadow: "0 8px 24px rgba(75,63,174,0.18)",
            }}>
              Continue
            </button>
          </div>
          <p style={{ fontSize: 14, color: C.textMuted, margin: "24px 0 0", fontFamily: sans }}>
            Don&rsquo;t have a code?{" "}
            <Link href="/advisor-portal" style={{ color: C.purple, textDecoration: "none", fontWeight: 600 }}>
              Request access
            </Link>
          </p>
        </div>
      </div>
    );
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* INCOME INTELLIGENCE DASHBOARD                            */
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.panelFill, fontFamily: sans }}>
      <DashboardHeader mobile={mobile} reportsUsed={reportsUsed} reportsTotal={reportsTotal} />

      {/* ── BOOK OVERVIEW ── */}
      <section id="book-overview" style={{
        backgroundColor: C.navy, padding: mobile ? "48px 28px 40px" : "64px 48px 56px",
        scrollMarginTop: mobile ? 56 : 64,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.purple, marginBottom: 12 }}>
            BOOK OVERVIEW
          </div>
          <h1 style={{ fontSize: mobile ? 28 : 40, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", color: C.sandText, margin: "0 0 32px" }}>
            Income intelligence dashboard
          </h1>

          {clients.length === 0 ? (
            /* ── Empty state: clear first action ── */
            <div style={{
              padding: mobile ? "32px 24px" : "40px 36px", borderRadius: 16,
              backgroundColor: "rgba(255,255,255,0.05)", border: `1px solid ${C.sandBorder}`,
              textAlign: "center", maxWidth: 520,
            }}>
              <p style={{ fontSize: 18, fontWeight: 600, color: C.sandText, margin: "0 0 8px" }}>
                Get started
              </p>
              <p style={{ fontSize: 15, color: C.sandMuted, margin: "0 0 20px", lineHeight: 1.5 }}>
                Add a client below, then select &ldquo;Run Assessment&rdquo; on their card. The score, stability band, and top risk will populate automatically.
              </p>
              <a href="#add-client" style={{
                display: "inline-flex", alignItems: "center", padding: "12px 28px",
                fontSize: 15, fontWeight: 600, color: C.navy, backgroundColor: C.sandText,
                borderRadius: 10, textDecoration: "none",
              }}>
                Add your first client
              </a>
            </div>
          ) : (
            <div style={{
              display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: mobile ? 12 : 20,
            }}>
              {[
                { label: "Clients assessed", value: assessed.length.toString(), sub: `${clients.length} total` },
                { label: "Average score", value: assessed.length ? avgScore.toString() : "\u2014", sub: assessed.length ? bandFromScore(avgScore) : "No data" },
                { label: "Red zone", value: redZone.toString(), sub: redZone ? "Need attention" : "None" },
                { label: "Improvable", value: improvable.toString(), sub: "Could gain 15+ pts" },
              ].map((m, i) => (
                <div key={i} style={{
                  padding: mobile ? "20px 16px" : "24px 20px", borderRadius: 14,
                  backgroundColor: "rgba(255,255,255,0.05)", border: `1px solid ${C.sandBorder}`,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.sandMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: mobile ? 28 : 36, fontWeight: 700, color: C.sandText, fontFamily: mono, lineHeight: 1 }}>
                    {m.value}
                  </div>
                  <div style={{ fontSize: 13, color: C.sandMuted, marginTop: 6 }}>{m.sub}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: mobile ? `32px ${pad} 64px` : `40px ${pad} 96px` }}>

        {/* ── NEEDS ATTENTION (pending clients + alerts) ── */}
        {(pending.length > 0 || redZone > 0) && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: mobile ? 20 : 24, fontWeight: 700, color: C.navy, margin: "0 0 16px", fontFamily: sans }}>
              Needs attention
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pending.length > 0 && (
                <div style={{ ...cardBase, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.moderate, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: C.textPrimary }}>
                    <strong>{pending.length} client{pending.length > 1 ? "s" : ""}</strong> added but not yet assessed &mdash;{" "}
                    <a href="#client-list" style={{ color: C.purple, fontWeight: 600, textDecoration: "none" }}>run their assessments</a>
                  </span>
                </div>
              )}
              {redZone > 0 && (
                <div style={{ ...cardBase, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.risk, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: C.textPrimary }}><strong>{redZone} client{redZone > 1 ? "s" : ""}</strong> score below 30 &mdash; priority attention needed</span>
                </div>
              )}
              {improvable > 0 && (
                <div style={{ ...cardBase, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.teal, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: C.textPrimary }}><strong>{improvable} client{improvable > 1 ? "s" : ""}</strong> could improve 15+ points with one structural change</span>
                </div>
              )}
              {topRiskEntry && (
                <div style={{ ...cardBase, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.purple, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: C.textPrimary }}>Book&rsquo;s biggest risk concentration: <strong>{topRiskEntry[0]}</strong></span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── CLIENT LIST ── */}
        <section id="client-list" style={{ marginBottom: 40, scrollMarginTop: mobile ? 72 : 80 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <h2 style={{ fontSize: mobile ? 20 : 24, fontWeight: 700, color: C.navy, margin: 0, fontFamily: sans }}>
              Clients
            </h2>
            {clients.length > 1 && (
              <button onClick={() => setSortAsc(!sortAsc)} style={{
                ...btnPrimary, fontSize: 12,
              }}>
                Sort: {sortAsc ? "Lowest first" : "Highest first"}
              </button>
            )}
          </div>

          {clients.length === 0 ? (
            <div style={{ ...cardBase, padding: "40px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 16, color: C.textSecondary, margin: "0 0 4px" }}>No clients in your book yet.</p>
              <p style={{ fontSize: 14, color: C.textMuted, margin: 0 }}>Add a client below to get started.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {sorted.map(client => {
                const isExpanded = expandedId === client.id;
                const isEditingNotes = editingNotesId === client.id;
                const bc = bandColor(client.band);
                const tp = client.score > 0 && client.topRisk !== "Not assessed" ? talkingPoint(client.topRisk, client.industry) : "";

                return (
                  <div key={client.id} style={{ ...cardBase, padding: mobile ? "20px 20px" : "24px 28px" }}>
                    {/* Header row */}
                    <div style={{ display: "flex", alignItems: mobile ? "flex-start" : "center", gap: 16, flexWrap: "wrap" }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 12, backgroundColor: `${bc}12`, border: `2px solid ${bc}`,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        fontFamily: mono, fontSize: 16, fontWeight: 700, color: bc,
                      }}>
                        {client.score > 0 ? client.score : "\u2014"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 17, fontWeight: 700, color: C.navy }}>{client.name}</span>
                          <span style={{
                            fontSize: 12, fontWeight: 600, color: C.textSecondary, backgroundColor: C.panelFill,
                            borderRadius: 6, padding: "3px 10px", whiteSpace: "nowrap" as const,
                          }}>
                            {client.industry}
                          </span>
                          <span style={{
                            fontSize: 12, fontWeight: 700, color: bc, backgroundColor: `${bc}10`,
                            borderRadius: 6, padding: "3px 10px",
                          }}>
                            {client.band}
                          </span>
                        </div>
                        <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>
                          {client.topRisk !== "Not assessed" ? `Top risk: ${client.topRisk}` : "Not yet assessed"} &middot; {client.assessmentDate}
                        </div>
                      </div>
                    </div>

                    {/* Inline talking point — always visible for assessed clients */}
                    {(client.interpretation?.one_sentence_talking_point || tp) && (
                      <div style={{
                        marginTop: 12, padding: "12px 16px", borderRadius: 10,
                        backgroundColor: "rgba(75,63,174,0.03)", border: `1px solid rgba(75,63,174,0.06)`,
                      }}>
                        <p style={{ fontSize: 13, lineHeight: 1.5, color: C.textSecondary, margin: 0 }}>
                          <strong style={{ color: C.textPrimary }}>Talking point:</strong> {client.interpretation?.one_sentence_talking_point || tp}
                        </p>
                      </div>
                    )}

                    {/* Notes — always visible if present */}
                    {client.notes && !isEditingNotes && (
                      <div style={{ marginTop: 8, padding: "10px 16px", borderRadius: 10, backgroundColor: C.panelFill }}>
                        <p style={{ fontSize: 13, lineHeight: 1.5, color: C.textSecondary, margin: 0, fontStyle: "italic" }}>
                          {client.notes}
                        </p>
                      </div>
                    )}

                    {/* Quota exhausted warning */}
                    {quotaExhausted && (
                      <div style={{
                        marginTop: 12, padding: "12px 14px", borderRadius: 10,
                        backgroundColor: "rgba(155,44,44,0.05)", border: "1px solid rgba(155,44,44,0.12)",
                      }}>
                        <p style={{ fontSize: 13, color: "#9B2C2C", margin: 0, fontWeight: 500 }}>
                          You've used all {reportsTotal} assessments in your plan. Purchase more to continue.
                        </p>
                      </div>
                    )}

                    {/* Action row */}
                    <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap", alignItems: "center" }}>
                      {client.score > 0 && (
                        <button onClick={() => setExpandedId(isExpanded ? null : client.id)} style={btnPrimary}>
                          {isExpanded ? "Close" : "Full Meeting Prep"}
                        </button>
                      )}
                      <button
                        onClick={() => handleStartAssessment(client.id)}
                        disabled={quotaExhausted}
                        style={{...btnTeal, opacity: quotaExhausted ? 0.5 : 1, cursor: quotaExhausted ? "not-allowed" : "pointer"}}
                      >
                        {assessingId === client.id ? "Cancel" : (client.score > 0 ? "Reassess" : "Run Assessment")}
                      </button>
                      {quotaExhausted && (
                        <a href="/plans" style={{
                          fontSize: 13, fontWeight: 600, color: C.purple, backgroundColor: "rgba(75,63,174,0.06)",
                          border: "1px solid rgba(75,63,174,0.15)", borderRadius: 8, padding: "8px 16px",
                          textDecoration: "none", display: "inline-flex", alignItems: "center"
                        }}>
                          Buy More Assessments
                        </a>
                      )}
                      <button onClick={() => {
                        if (isEditingNotes) { saveNotes(client.id); } else { setEditingNotesId(client.id); setNotesDraft(client.notes); }
                      }} style={{
                        fontSize: 13, fontWeight: 500, color: C.textMuted, background: "none", border: "none",
                        cursor: "pointer", padding: "8px 4px", fontFamily: sans,
                        textDecoration: "underline", textUnderlineOffset: "2px",
                      }}>
                        {isEditingNotes ? "Save Note" : client.notes ? "Edit Note" : "Add Note"}
                      </button>
                      <button onClick={() => removeClient(client.id)} style={{
                        fontSize: 13, color: C.risk, background: "none", border: "none", cursor: "pointer",
                        padding: "8px 4px", fontFamily: sans, textDecoration: "underline", textUnderlineOffset: "2px",
                        opacity: 0.6,
                      }}>
                        Remove
                      </button>
                    </div>

                    {/* Notes editor */}
                    {isEditingNotes && (
                      <div style={{ marginTop: 10 }}>
                        <textarea
                          value={notesDraft}
                          onChange={e => setNotesDraft(e.target.value)}
                          placeholder="Add a note about this client..."
                          rows={3}
                          style={{
                            ...inputStyle, fontSize: 14, resize: "vertical" as const,
                            fontFamily: sans, lineHeight: 1.5,
                          }}
                        />
                      </div>
                    )}

                    {/* Inline assessment */}
                    {assessingId === client.id && (
                      <InlineAssessment
                        clientId={client.id}
                        clientName={client.name}
                        industry={client.industry}
                        advisorCode={advisorCode || ""}
                        mobile={mobile}
                        onComplete={(result) => {
                          const next = clients.map(c =>
                            c.id === client.id
                              ? {
                                  ...c,
                                  score: result.score,
                                  band: result.band,
                                  topRisk: result.topRisk,
                                  assessmentDate: new Date().toISOString().slice(0, 10),
                                  canonicalRecord: result.canonicalRecord,
                                  interpretation: result.interpretation,
                                }
                              : c
                          );
                          persistClients(next);
                          setAssessingId(null);
                          setReportsUsed(prev => prev + 1);
                        }}
                        onCancel={() => setAssessingId(null)}
                      />
                    )}

                    {/* Full meeting prep expanded */}
                    {isExpanded && (
                      <div style={{
                        marginTop: 12, padding: "16px 20px", borderRadius: 12,
                        backgroundColor: "rgba(75,63,174,0.03)", border: `1px solid rgba(75,63,174,0.08)`,
                      }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: C.purple, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          MEETING PREP &mdash; {client.name}
                        </p>
                        <p style={{ fontSize: 14, lineHeight: 1.6, color: C.textPrimary, margin: "0 0 12px" }}>
                          Score: <strong>{client.score}</strong> &middot; Band: <strong>{client.band}</strong> &middot; Top risk: <strong>{client.topRisk}</strong>
                        </p>
                        <p style={{ fontSize: 14, lineHeight: 1.6, color: C.textPrimary, margin: 0 }}>
                          {client.interpretation
                            ? client.interpretation.one_paragraph_meeting_prep
                            : <><strong>Recommended conversation:</strong> {talkingPoint(client.topRisk, client.industry)}</>
                          }
                        </p>
                        {client.canonicalRecord && (
                          <p style={{ fontSize: 11, color: C.textMuted, margin: "10px 0 0", fontFamily: mono }}>
                            Record {client.canonicalRecord.record_id} &middot; Model {client.canonicalRecord.model_version}
                          </p>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── ADD CLIENT ── */}
        <section id="add-client" style={{ marginBottom: 40, scrollMarginTop: mobile ? 72 : 80 }}>
          <h2 style={{ fontSize: mobile ? 20 : 24, fontWeight: 700, color: C.navy, margin: "0 0 16px", fontFamily: sans }}>
            Add client to book
          </h2>
          <div style={{ ...cardBase, padding: mobile ? "24px 20px" : "28px 28px" }}>
            <p style={{ fontSize: 14, color: C.textSecondary, margin: "0 0 16px" }}>
              Add a client by name and industry. Once added, select &ldquo;Run Assessment&rdquo; on their card to score their income structure.
            </p>
            <div style={{ display: "flex", gap: 12, flexDirection: mobile ? "column" : "row", alignItems: mobile ? "stretch" : "flex-end" }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Client name</label>
                <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Full name" style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Industry</label>
                <select value={newIndustry} onChange={e => setNewIndustry(e.target.value)} style={{ ...selectStyle, color: newIndustry ? C.textPrimary : C.textMuted }}>
                  <option value="" disabled>Select industry</option>
                  {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
              </div>
              <button onClick={addClient} style={{
                padding: "14px 24px", fontSize: 15, fontWeight: 600, fontFamily: sans, color: C.white,
                backgroundColor: C.purple, border: "none", borderRadius: 12, cursor: "pointer", whiteSpace: "nowrap" as const,
                boxShadow: "0 8px 24px rgba(75,63,174,0.18)",
              }}>
                Add Client
              </button>
            </div>
          </div>
        </section>

        {/* ── BOOK HEALTH ── */}
        {assessed.length >= 1 && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: mobile ? 20 : 24, fontWeight: 700, color: C.navy, margin: "0 0 16px", fontFamily: sans }}>
              Book health
            </h2>
            <div style={{ ...cardBase, padding: mobile ? "24px 20px" : "28px 28px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {oldest && (
                  <div style={{ fontSize: 15, color: C.textPrimary }}>
                    <span style={{ color: C.textMuted, fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.04em" }}>First assessment:</span>{" "}
                    {oldest}
                  </div>
                )}
                {newest && (
                  <div style={{ fontSize: 15, color: C.textPrimary }}>
                    <span style={{ color: C.textMuted, fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.04em" }}>Most recent:</span>{" "}
                    {newest}
                  </div>
                )}
                {assessed.length >= 6 && (
                  <div style={{ fontSize: 15, color: C.textPrimary }}>
                    <span style={{ color: C.textMuted, fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.04em" }}>Average score trend:</span>{" "}
                    <span style={{
                      fontWeight: 600,
                      color: trend === "improving" ? C.teal : trend === "declining" ? C.risk : C.textPrimary,
                    }}>
                      {trend === "improving" ? "Improving" : trend === "declining" ? "Declining" : "Stable"}
                    </span>
                  </div>
                )}
                <div style={{ fontSize: 15, color: C.textPrimary }}>
                  <span style={{ color: C.textMuted, fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.04em" }}>Reports used:</span>{" "}
                  {reportsUsed} of {reportsTotal}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── FOOTER ── */}
        <footer style={{ textAlign: "center", paddingTop: 16, paddingBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginBottom: 20 }}>
            <Link href="/methodology" style={{ fontSize: 14, fontWeight: 600, color: C.purple, textDecoration: "none", fontFamily: sans }}>
              Methodology
            </Link>
            <Link href="/contact" style={{ fontSize: 14, fontWeight: 600, color: C.purple, textDecoration: "none", fontFamily: sans }}>
              Need help? Contact us
            </Link>
          </div>
          <p style={{ fontSize: 13, color: C.textMuted, margin: 0, fontFamily: mono }}>
            RunPayway™ Advisor Portal &middot; Model RP-2.0
          </p>
        </footer>
      </div>
    </div>
  );
}
