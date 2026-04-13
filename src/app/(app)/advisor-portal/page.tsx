"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SuiteHeader from "@/components/SuiteHeader";
import { C, mono, sans } from "@/lib/design-tokens";
import { WORKER_URL } from "@/lib/config";

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

const CLIENT_OPTIONS = ["1\u201310", "11\u201350", "51\u2013200", "200+"] as const;

const RISK_OPTIONS = [
  "Concentration",
  "Labor dependence",
  "Forward visibility",
  "Income persistence",
  "Variability",
  "Source diversity",
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
  notes?: string;
}

/* ── Helpers ───────────────────────────────────────────── */
function bandFromScore(s: number): string {
  if (s <= 0) return "Pending";
  if (s < 30) return "Limited";
  if (s < 50) return "Developing";
  if (s < 75) return "Established";
  return "High";
}

function bandColor(band: string): string {
  switch (band) {
    case "Limited": return C.risk;
    case "Developing": return C.moderate;
    case "Established": return C.bandEstablished;
    case "High": return C.teal;
    default: return C.textMuted;
  }
}

function conversationStarter(name: string, score: number, band: string, topRisk: string, industry: string): string {
  const riskActions: Record<string, string> = {
    Concentration: `Ask about diversifying revenue sources. In ${industry}, heavy reliance on one or two clients or channels creates fragility. Explore what a second revenue line could look like.`,
    "Labor dependence": `Discuss ways to decouple income from hours worked. In ${industry}, building recurring revenue or productized services reduces personal labor risk.`,
    "Forward visibility": `Explore pipeline predictability. In ${industry}, short-term visibility makes planning difficult. Ask about retainers, contracts, or lead indicators they track.`,
    "Income persistence": `Talk about income durability. In ${industry}, project-based income restarts from zero. Ask what percentage of this year's income was already locked in on January 1.`,
    Variability: `Address income volatility. In ${industry}, month-to-month swings complicate planning. Ask about smoothing strategies — reserves, payment schedules, or seasonal adjustments.`,
    "Source diversity": `Focus on source mix. In ${industry}, relying on a single income type creates risk. Explore adding complementary revenue streams.`,
    Pending: "Complete the assessment first to unlock conversation recommendations.",
  };
  const action = riskActions[topRisk] || riskActions["Pending"];
  if (band === "Pending") return `${name} has not been assessed yet. Run the Income Stability Score assessment to generate insights.`;
  return `Before your meeting with ${name}: Their score is ${score}, in the ${band} range. Their biggest risk is ${topRisk}. Recommended conversation: ${action}`;
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ── Component ─────────────────────────────────────────── */
export default function AdvisorPortalPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState(false);
  const [advisorCode, setAdvisorCode] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState("");

  /* Registration form */
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regFirm, setRegFirm] = useState("");
  const [regClientCount, setRegClientCount] = useState("");
  const [regIndustry, setRegIndustry] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  /* Client data */
  const [clients, setClients] = useState<AdvisorClient[]>([]);
  const [sortAsc, setSortAsc] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /* Add client form */
  const [newName, setNewName] = useState("");
  const [newIndustry, setNewIndustry] = useState("");

  /* Update score form */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editScore, setEditScore] = useState("");
  const [editRisk, setEditRisk] = useState("");

  /* ── Effects ── */
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("rp_advisor_code");
    if (stored) setAdvisorCode(stored);
    const raw = localStorage.getItem("rp_advisor_clients");
    if (raw) {
      try { setClients(JSON.parse(raw)); } catch { /* corrupt data, ignore */ }
    }
  }, []);

  const persistClients = (next: AdvisorClient[]) => {
    setClients(next);
    localStorage.setItem("rp_advisor_clients", JSON.stringify(next));
  };

  /* ── Registration submit ── */
  const handleSubmit = async () => {
    setRegError(null);
    if (!regName.trim() || !regEmail.trim() || !regFirm.trim() || !regClientCount || !regIndustry) {
      setRegError("Please fill out all fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${WORKER_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "advisor_portal_request",
          name: regName.trim(),
          email: regEmail.trim(),
          firm: regFirm.trim(),
          client_count: regClientCount,
          industry: regIndustry,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSubmitted(true);
    } catch {
      setRegError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleActivate = () => {
    const trimmed = codeInput.trim();
    if (!trimmed) return;
    localStorage.setItem("rp_advisor_code", trimmed);
    setAdvisorCode(trimmed);
  };

  /* ── Client mutations ── */
  const addClient = () => {
    if (!newName.trim() || !newIndustry) return;
    const entry: AdvisorClient = {
      id: uid(),
      name: newName.trim(),
      industry: newIndustry,
      score: 0,
      band: "Pending",
      topRisk: "Pending",
      assessmentDate: new Date().toISOString().slice(0, 10),
    };
    persistClients([...clients, entry]);
    setNewName("");
    setNewIndustry("");
  };

  const updateScore = (id: string) => {
    const s = parseInt(editScore, 10);
    if (isNaN(s) || s < 0 || s > 100 || !editRisk) return;
    const next = clients.map(c =>
      c.id === id ? { ...c, score: s, band: bandFromScore(s), topRisk: editRisk, assessmentDate: new Date().toISOString().slice(0, 10) } : c
    );
    persistClients(next);
    setEditingId(null);
    setEditScore("");
    setEditRisk("");
  };

  const removeClient = (id: string) => {
    persistClients(clients.filter(c => c.id !== id));
  };

  /* ── Derived analytics ── */
  const assessed = clients.filter(c => c.score > 0);
  const avgScore = assessed.length ? Math.round(assessed.reduce((a, c) => a + c.score, 0) / assessed.length) : 0;
  const redZone = assessed.filter(c => c.score < 30).length;
  const improvable = assessed.filter(c => c.score < 85 && c.score >= 30).length;

  const sorted = [...clients].sort((a, b) => sortAsc ? a.score - b.score : b.score - a.score);

  /* Risk concentration */
  const riskCounts: Record<string, number> = {};
  assessed.forEach(c => {
    if (c.topRisk !== "Pending") riskCounts[c.topRisk] = (riskCounts[c.topRisk] || 0) + 1;
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

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* STATE 1: NOT ACTIVATED                                  */
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  if (!advisorCode) {
    const valueItems = [
      "Run Income Stability Score\u2122 assessments during client meetings",
      "See book-level analytics \u2014 average score, risk distribution, opportunities",
      "Get conversation starters before every meeting",
      "Track client progress across reassessments",
      "Identify which clients need attention this quarter",
      "Volume pricing available \u00b7 No subscription \u00b7 No minimum",
    ];

    return (
      <div style={{ minHeight: "100vh", backgroundColor: C.panelFill, fontFamily: sans }}>
        <SuiteHeader current="advisor-portal" />

        {/* Hero */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: mobile ? "48px 28px 32px" : "72px 48px 48px", textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.purple, marginBottom: 16, fontFamily: sans }}>
            ADVISOR PORTAL
          </div>
          <h1 style={{ fontSize: mobile ? 32 : 48, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.035em", color: C.navy, margin: "0 0 16px", fontFamily: sans }}>
            Income intelligence across your entire book.
          </h1>
          <p style={{ fontSize: mobile ? 17 : 20, lineHeight: 1.5, color: C.textSecondary, maxWidth: 640, margin: "0 auto", fontFamily: sans }}>
            Run assessments for your clients. See their scores, risks, and opportunities &mdash; all in one place.
          </p>
        </section>

        {/* Form card */}
        <section style={{ maxWidth: 720, margin: "0 auto", padding: mobile ? `0 ${pad} 64px` : `0 ${pad} 96px` }}>
          <div style={{ ...cardBase, padding: mobile ? "32px 28px" : "44px" }}>
            <h2 style={{ fontSize: mobile ? 24 : 28, fontWeight: 700, color: C.navy, margin: "0 0 12px", fontFamily: sans }}>
              Request advisor access
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: C.textSecondary, margin: "0 0 28px", fontFamily: sans }}>
              RunPayway&#8482; Advisor Access lets you run Income Stability Score&#8482; assessments for your clients, view their results, and use the data in your planning conversations.
            </p>

            {/* Value list */}
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}>
              {valueItems.map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14, fontSize: 15, lineHeight: 1.5, color: C.textPrimary, fontFamily: sans }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                    <circle cx="9" cy="9" r="9" fill="rgba(31,109,122,0.10)" />
                    <path d="M5.5 9.5l2 2 5-5" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            {submitted ? (
              <div style={{ padding: "28px 24px", borderRadius: 14, backgroundColor: "rgba(31,109,122,0.06)", border: "1px solid rgba(31,109,122,0.15)", textAlign: "center" }}>
                <p style={{ fontSize: 17, fontWeight: 600, color: C.teal, margin: "0 0 6px", fontFamily: sans }}>Your request has been received.</p>
                <p style={{ fontSize: 15, color: C.textSecondary, margin: 0, fontFamily: sans }}>We&rsquo;ll be in touch within two business days.</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div>
                    <label style={labelStyle}>Name</label>
                    <input type="text" value={regName} onChange={e => setRegName(e.target.value)} placeholder="Full name" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="you@firm.com" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Firm / Practice Name</label>
                    <input type="text" value={regFirm} onChange={e => setRegFirm(e.target.value)} placeholder="Your firm or practice" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Number of Clients</label>
                    <select value={regClientCount} onChange={e => setRegClientCount(e.target.value)} style={{ ...selectStyle, color: regClientCount ? C.textPrimary : C.textMuted }}>
                      <option value="" disabled>Select range</option>
                      {CLIENT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Primary Industry Served</label>
                    <select value={regIndustry} onChange={e => setRegIndustry(e.target.value)} style={{ ...selectStyle, color: regIndustry ? C.textPrimary : C.textMuted }}>
                      <option value="" disabled>Select industry</option>
                      {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                  </div>
                </div>

                {regError && <p style={{ fontSize: 14, color: C.risk, margin: "14px 0 0", fontFamily: sans }}>{regError}</p>}

                <button onClick={handleSubmit} disabled={submitting} style={{
                  width: "100%", marginTop: 24, padding: "16px 24px", fontSize: 17, fontWeight: 600, fontFamily: sans,
                  color: C.white, backgroundColor: C.purple, border: "none", borderRadius: 12, cursor: submitting ? "default" : "pointer",
                  opacity: submitting ? 0.7 : 1, transition: "opacity 150ms", boxShadow: "0 8px 24px rgba(75,63,174,0.18)",
                }}>
                  {submitting ? "Submitting\u2026" : "Request Advisor Access"}
                </button>
              </>
            )}

            {/* Activate code */}
            <div style={{ marginTop: 36, paddingTop: 28, borderTop: `1px solid ${C.border}` }}>
              <p style={{ fontSize: 15, color: C.textSecondary, margin: "0 0 14px", fontFamily: sans }}>Already have an advisor code?</p>
              <div style={{ display: "flex", gap: 10, alignItems: mobile ? "stretch" : "center", flexDirection: mobile ? "column" : "row" }}>
                <input type="text" value={codeInput} onChange={e => setCodeInput(e.target.value)} placeholder="Advisor code" style={{ ...inputStyle, flex: 1, fontFamily: mono, fontSize: 14, letterSpacing: "0.03em" }} />
                <button onClick={handleActivate} style={{
                  padding: "14px 24px", fontSize: 15, fontWeight: 600, fontFamily: sans, color: C.purple,
                  backgroundColor: "rgba(75,63,174,0.06)", border: `1px solid rgba(75,63,174,0.18)`, borderRadius: 10, cursor: "pointer", whiteSpace: "nowrap" as const,
                }}>
                  Activate
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* STATE 2: ACTIVATED — INCOME INTELLIGENCE DASHBOARD      */
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.panelFill, fontFamily: sans }}>
      <SuiteHeader current="advisor-portal" />

      {/* ── SECTION 1: BOOK OVERVIEW ── */}
      <section style={{
        backgroundColor: C.navy, padding: mobile ? "48px 28px 40px" : "64px 48px 56px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.purple, marginBottom: 12 }}>
            BOOK OVERVIEW
          </div>
          <h1 style={{ fontSize: mobile ? 28 : 40, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", color: C.sandText, margin: "0 0 32px" }}>
            Income intelligence dashboard
          </h1>

          {clients.length === 0 ? (
            <p style={{ fontSize: 17, color: C.sandMuted, margin: 0, fontFamily: sans }}>
              Add your first client to see book-level insights.
            </p>
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

        {/* ── SECTION 2: OPPORTUNITY ALERTS ── */}
        {assessed.length >= 3 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: mobile ? 20 : 24, fontWeight: 700, color: C.navy, margin: "0 0 16px", fontFamily: sans }}>
              Opportunity alerts
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
                  <span style={{ fontSize: 15, color: C.textPrimary }}>Your book&rsquo;s biggest risk concentration is <strong>{topRiskEntry[0]}</strong></span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── SECTION 3: CLIENT LIST ── */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <h2 style={{ fontSize: mobile ? 20 : 24, fontWeight: 700, color: C.navy, margin: 0, fontFamily: sans }}>
              Client list
            </h2>
            {clients.length > 1 && (
              <button onClick={() => setSortAsc(!sortAsc)} style={{
                fontSize: 13, fontWeight: 600, color: C.purple, backgroundColor: "rgba(75,63,174,0.06)",
                border: `1px solid rgba(75,63,174,0.15)`, borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontFamily: sans,
              }}>
                Sort: {sortAsc ? "Lowest first" : "Highest first"}
              </button>
            )}
          </div>

          {clients.length === 0 ? (
            <div style={{ ...cardBase, padding: "40px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 16, color: C.textSecondary, margin: 0 }}>No clients yet. Add your first client below.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {sorted.map(client => {
                const isExpanded = expandedId === client.id;
                const isEditing = editingId === client.id;
                const bc = bandColor(client.band);
                return (
                  <div key={client.id} style={{ ...cardBase, padding: mobile ? "20px 20px" : "24px 28px" }}>
                    {/* Header row */}
                    <div style={{ display: "flex", alignItems: mobile ? "flex-start" : "center", gap: 16, flexWrap: "wrap" }}>
                      {/* Score indicator */}
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
                          {client.topRisk !== "Pending" ? `Top risk: ${client.topRisk}` : "Assessment pending"} &middot; {client.assessmentDate}
                        </div>
                      </div>
                    </div>

                    {/* Action row */}
                    <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
                      <button onClick={() => setExpandedId(isExpanded ? null : client.id)} style={{
                        fontSize: 13, fontWeight: 600, color: C.purple, backgroundColor: "rgba(75,63,174,0.06)",
                        border: `1px solid rgba(75,63,174,0.15)`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontFamily: sans,
                      }}>
                        {isExpanded ? "Close" : "Meeting Prep"}
                      </button>
                      {client.band === "Pending" ? (
                        <button onClick={() => { setEditingId(isEditing ? null : client.id); setEditScore(""); setEditRisk(""); }} style={{
                          fontSize: 13, fontWeight: 600, color: C.teal, backgroundColor: "rgba(31,109,122,0.06)",
                          border: `1px solid rgba(31,109,122,0.15)`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontFamily: sans,
                        }}>
                          {isEditing ? "Cancel" : "Update Score"}
                        </button>
                      ) : (
                        <Link href="/begin" style={{
                          fontSize: 13, fontWeight: 600, color: C.teal, backgroundColor: "rgba(31,109,122,0.06)",
                          border: `1px solid rgba(31,109,122,0.15)`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontFamily: sans,
                          textDecoration: "none", display: "inline-block",
                        }}>
                          Reassess
                        </Link>
                      )}
                      <button onClick={() => removeClient(client.id)} style={{
                        fontSize: 13, color: C.textMuted, background: "none", border: "none", cursor: "pointer", padding: "8px 4px", fontFamily: sans,
                        textDecoration: "underline", textUnderlineOffset: "2px",
                      }}>
                        Remove
                      </button>
                    </div>

                    {/* Meeting prep expanded */}
                    {isExpanded && (
                      <div style={{
                        marginTop: 14, padding: "16px 20px", borderRadius: 12,
                        backgroundColor: "rgba(75,63,174,0.03)", border: `1px solid rgba(75,63,174,0.08)`,
                      }}>
                        <p style={{ fontSize: 14, lineHeight: 1.6, color: C.textPrimary, margin: 0 }}>
                          {conversationStarter(client.name, client.score, client.band, client.topRisk, client.industry)}
                        </p>
                      </div>
                    )}

                    {/* Update score form */}
                    {isEditing && (
                      <div style={{
                        marginTop: 14, padding: "16px 20px", borderRadius: 12,
                        backgroundColor: "rgba(31,109,122,0.03)", border: `1px solid rgba(31,109,122,0.08)`,
                      }}>
                        <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 12px" }}>
                          Run the assessment with your client now. When complete, enter their results below.
                        </p>
                        <div style={{ display: "flex", gap: 10, flexDirection: mobile ? "column" : "row", alignItems: mobile ? "stretch" : "flex-end" }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ ...labelStyle, fontSize: 12 }}>Score (0\u2013100)</label>
                            <input type="number" min="0" max="100" value={editScore} onChange={e => setEditScore(e.target.value)} placeholder="e.g. 42" style={{ ...inputStyle, fontSize: 14 }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ ...labelStyle, fontSize: 12 }}>Top Risk</label>
                            <select value={editRisk} onChange={e => setEditRisk(e.target.value)} style={{ ...selectStyle, fontSize: 14, color: editRisk ? C.textPrimary : C.textMuted }}>
                              <option value="" disabled>Select risk</option>
                              {RISK_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                          </div>
                          <button onClick={() => updateScore(client.id)} style={{
                            padding: "14px 20px", fontSize: 14, fontWeight: 600, fontFamily: sans, color: C.white,
                            backgroundColor: C.teal, border: "none", borderRadius: 10, cursor: "pointer", whiteSpace: "nowrap" as const,
                          }}>
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── SECTION 4: ADD NEW CLIENT ── */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: mobile ? 20 : 24, fontWeight: 700, color: C.navy, margin: "0 0 16px", fontFamily: sans }}>
            Add new client
          </h2>
          <div style={{ ...cardBase, padding: mobile ? "24px 20px" : "28px 28px" }}>
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
                Run Assessment &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: BOOK HEALTH OVER TIME ── */}
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
              </div>
            </div>
          </section>
        )}

        {/* ── BOTTOM ── */}
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
            RunPayway&#8482; Advisor Portal &middot; Model RP-2.0
          </p>
        </footer>
      </div>
    </div>
  );
}
