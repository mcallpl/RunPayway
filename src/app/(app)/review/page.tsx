"use client";

import { useEffect, useState, useRef, Component, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoBlue from "../../../../public/runpayway-logo-blue.png";
import { useAssessmentServer } from "@/lib/monitoring";
// Simulator moved to standalone /simulator page — accessed via QR code

// ============================================================
// ERROR BOUNDARY
// ============================================================
class ReportErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: "" };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message || "Unknown error" };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", padding: 40, textAlign: "center" }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: B.navy, marginBottom: R.paraMb }}>
            Something went wrong loading your report
          </h2>
          <p style={{ ...T.body, color: B.muted, marginBottom: R.sectionGap, maxWidth: 400 }}>
            Your assessment was saved. Please try refreshing the page. If the problem persists, visit our contact page.
          </p>
          <p style={{ ...T.meta, color: B.taupe, marginBottom: R.sectionGap }}>{this.state.error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: "10px 24px", ...T.body, fontWeight: 500, color: B.white, backgroundColor: B.navy, border: "none", borderRadius: 4, cursor: "pointer" }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================
// SAFE JSON PARSE
// ============================================================
function safeJsonParse<T>(json: string | undefined | null, fallback: T): T {
  if (!json) return fallback;
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
    if (fallback !== null && typeof fallback === "object" && !Array.isArray(fallback) && (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

interface AssessmentRecord {
  record_id: string;
  authorization_code: string;
  model_version: string;
  assessment_date_utc: string;
  issued_timestamp_utc: string;
  final_score: number;
  stability_band: string;
  assessment_title: string;
  classification: string;
  operating_structure: string;
  primary_income_model: string;
  revenue_structure: string;
  industry_sector: string;
  band_interpretation_text: string;
  primary_constraint_label: string;
  primary_constraint_text: string;
  primary_constraint_key: string;
  driver_1_label: string;
  driver_1_text: string;
  driver_2_label: string;
  driver_2_text: string;
  driver_3_label: string;
  driver_3_text: string;
  structural_priority_label: string;
  structural_priority_text: string;
  page_1_key_insight_text: string;
  page_2_key_insight_text: string;
  page_3_key_insight_text: string;
  page_4_key_insight_text: string;
  page_5_key_insight_text: string;
  page_6_key_insight_text: string;
  labor_asset_position_label: string;
  labor_asset_framework_text: string;
  labor_asset_marker_position: number;
  active_income_level: number;
  semi_persistent_income_level: number;
  persistent_income_level: number;
  income_persistence_label: string;
  income_source_diversity_label: string;
  forward_revenue_visibility_label: string;
  income_variability_label: string;
  active_labor_dependence_label: string;
  exposure_concentration_label: string;
  stability_spectrum_position: number;
  peer_benchmark_group_label: string;
  peer_benchmark_text: string;
  peer_position_marker: number;
  evolution_path_title: string;
  evolution_path_steps_payload: string;
  current_evolution_stage_label: string;
  current_evolution_stage_position: number;
  sector_mechanisms_payload: string;
  sector_avg_score: number;
  sector_top_20_threshold: number;
  peer_band_distribution_payload: string;
  constraint_guidance_payload: string;
  structural_improvement_path_text: string;
  action_plan_payload: string;
  peer_stability_percentile: number;
  peer_stability_percentile_label: string;
  projected_final_score: number;
  projected_stability_band: string;
  improvement_estimate_text: string;
  registry_visibility: string;
  income_continuity_pct: number;
  income_continuity_months: number;
  income_continuity_text: string;
  risk_scenario_score: number;
  risk_scenario_band: string;
  risk_scenario_drop: number;
  risk_scenario_text: string;
  advisor_discussion_guide_payload: string;
  product_recommendations_payload: string;
  _v2?: {
    scores?: { overall_score: number; structure_score: number; stability_score: number; quality_adjustment: number };
    fragility?: { fragility_score: number; fragility_class: string; primary_failure_mode: string; secondary_failure_modes: string[]; deductions: { trigger: string; points: number; condition_met: boolean }[] };
    confidence?: { confidence_score: number; confidence_level: string; deductions: { reason: string; points: number }[] };
    quality?: { quality_score: number; durability_grade: string; adjustments: { factor: string; delta: number; reason: string }[] };
    sensitivity?: { tests: { factor: string; delta_description: string; original_score: number; projected_score: number; lift: number; rank: number }[]; highest_lift_factor: string; bottleneck_factor: string; low_return_factor: string };
    interactions?: { effects: { code: string; type: string; points: number; trigger_condition: string; factors_involved: string[] }[]; total_penalty: number; total_bonus: number; net_adjustment: number };
    constraints?: { root_constraint: string; primary_constraint: string; secondary_constraint: string; dependent_constraint: string | null; hidden_unlock: string | null };
    scenarios?: { scenario_id: string; label: string; description: string; original_score: number; scenario_score: number; score_drop: number; original_band: string; scenario_band: string; band_shift: boolean; narrative: string }[];
    score_lift_projection?: { lift_scenarios: { scenario_id: string; label: string; change_description: string; original_score: number; projected_score: number; lift: number; projected_band: string; band_shift: boolean }[]; combined_top_two: { label: string; change_description: string; projected_score: number; lift: number; projected_band: string; band_shift: boolean }; highest_single_lift: { label: string; lift: number; projected_score: number } };
    recommended_actions?: { action_id: string; priority: number; label: string; description: string; category: string; expected_impact: string; blocked_until?: string; sequencing_note?: string }[];
    avoid_actions?: { action_id: string; label: string; reason: string }[];
    reassessment_triggers?: { trigger_id: string; condition: string; threshold: string; current_value: string; description: string }[];
    benchmarks?: { peer_percentile: number; cluster_average_score: number; top_20_threshold: number; peer_band_distribution: { limited: number; developing: number; established: number; high: number }; outlier_dimensions: { factor: string; user_value: number; peer_average: number; direction: string; magnitude: string }[] };
    indicators?: { key: string; label: string; raw_value: number; normalized_value: number; level: string }[];
    surprising_insights?: { headline: string; explanation: string; data_point: string }[];
    tradeoff_narratives?: { action_label: string; upside: string; downside: string; net_recommendation: string }[];
    one_thing_that_matters?: string;
    reusable_framework?: string[];
    predictive_warnings?: { headline: string; explanation: string; timeframe: string }[];
    behavioral_insights?: { pattern: string; consequence: string; reframe: string }[];
    execution_roadmap?: { week: string; action: string; detail: string; success_metric: string }[];
    script_templates?: { id: string; title: string; context: string; script: string }[];
    normalized_inputs?: { income_persistence_pct: number; largest_source_pct: number; source_diversity_count: number; forward_secured_pct: number; income_variability_level: string; labor_dependence_pct: number };
    outcome_layer?: {
      income_model_family: { family_id: string; family_label: string };
      industry_refinement_profile: { industry_id: string; industry_label: string } | null;
      selected_scenarios: { scenario_id: string; label: string; description: string; severity: string; why_it_matters: string }[];
      stronger_structure_patterns: string[];
      ranked_action_map: { rank: number; action_id: string; label: string; description: string; why_now: string; expected_effect: string }[];
      avoid_actions: string[];
      reassessment_trigger_set: { trigger_id: string; condition: string; display_text: string }[];
      explanation_translation_layer: Record<string, string>;
      benchmark_context_layer: { framing_text: string; peer_group_label: string; typical_score_range: { low: number; mid: number; high: number }; common_strengths: string[]; common_weaknesses: string[] } | null;
    };
  };
}

// ============================================================
// BRAND — Refined Institutional Design System
// ============================================================
const B = {
  navy: "#0E1A2B",
  ink: "#0E1A2B",
  sand: "#FFFFFF",
  bone: "#F8F6F1",
  white: "#FFFFFF",
  stone: "rgba(14,26,43,0.12)",
  taupe: "rgba(14,26,43,0.42)",
  muted: "rgba(14,26,43,0.58)",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  bandLimited: "#9B2C2C",
  bandDeveloping: "#92640A",
  bandEstablished: "#2B5EA7",
  bandHigh: "#1F6D7A",
};

// ============================================================
// SPACING + TYPOGRAPHY TOKENS
// ============================================================
// ── Spacing: strict 4px grid ──
const R = {
  pagePad: "52px 56px 40px",     // top right/left bottom — premium margins
  headerMb: 20,
  sectionGap: 32,
  sectionMb: 24,
  cardMb: 16,
  labelMb: 10,
  paraMb: 12,
  itemGap: 12,
  cardGap: 14,
  rowGap: 16,
  dividerMy: 24,
  footerMt: 16,
  cardPad: "18px 22px" as string,
};

// ── Reusable card style ──
const cardStyle: React.CSSProperties = {
  backgroundColor: B.bone,
  border: "1px solid rgba(14,26,43,0.06)",
  borderRadius: 6,
  padding: R.cardPad,
};

const accentGradient = `linear-gradient(90deg, ${B.purple} 0%, ${B.teal} 100%)`;

// ── Typography: 7-step scale optimized for print clarity ──
const T = {
  score: { fontSize: 64, fontWeight: 700, lineHeight: 1 },
  pageTitle: { fontSize: 26, fontWeight: 700, lineHeight: 1.2, color: B.navy },
  sectionTitle: { fontSize: 18, fontWeight: 700, lineHeight: 1.3, color: B.navy },
  classification: { fontSize: 16, fontWeight: 600, lineHeight: 1.3 },
  overline: { fontSize: 10, fontWeight: 700, lineHeight: 1.3, letterSpacing: "0.12em", textTransform: "uppercase" as const },
  sectionLabel: { fontSize: 13, fontWeight: 600, lineHeight: 1.4 },
  cardHeading: { fontSize: 15, fontWeight: 600, lineHeight: 1.35 },
  cardHero: { fontSize: 22, fontWeight: 700, lineHeight: 1.1 },
  body: { fontSize: 12.5, fontWeight: 400, lineHeight: 1.7 },
  small: { fontSize: 11.5, fontWeight: 400, lineHeight: 1.6 },
  meta: { fontSize: 10.5, fontWeight: 400, lineHeight: 1.5 },
  micro: { fontSize: 10, fontWeight: 700, lineHeight: 1.3 },
};

// ── PDF page dimensions ──
const PDF = {
  captureW: 816,
  scale: 2,
  pageW: 8.5,
  pageH: 11,
  margin: 0.72,
  footer: 0.68,
  get contentW() { return this.pageW - 2 * this.margin; },
  get contentH() { return this.pageH - this.margin - this.footer; },
  get canvasW() { return this.captureW * this.scale; },
  get pxPerInch() { return this.canvasW / this.contentW; },
  get sliceH() { return Math.floor(this.contentH * this.pxPerInch); },
  get previewH() { return Math.round(this.captureW * (this.pageH / this.pageW)); },
};

// ============================================================
// LAYOUT COMPONENTS
// ============================================================

function ReportHeader() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: R.headerMb, paddingBottom: 12, borderBottom: "1px solid rgba(14,26,43,0.10)" }}>
      <Image src={logoBlue} alt="RunPayway&#8482;" width={110} height={13} style={{ height: "auto" }} />
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: B.taupe, letterSpacing: "0.02em" }}>Income Stability Score™ · Model RP-2.0</div>
      </div>
    </div>
  );
}

function Overline({ children, large }: { children: React.ReactNode; large?: boolean }) {
  return large
    ? <div style={{ ...T.sectionTitle, color: B.navy, marginBottom: 10 }}>{children}</div>
    : <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>{children}</div>;
}

function SectionDivider() {
  return <div style={{ height: 1, backgroundColor: "rgba(14,26,43,0.06)", marginTop: R.dividerMy, marginBottom: R.dividerMy }} />;
}

function PageFooter({ section, page }: { section: string; page: number }) {
  return (
    <div className="report-page-footer" style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid rgba(14,26,43,0.08)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 9.5, fontWeight: 400, color: B.taupe }}>Confidential — {section}</span>
        <span style={{ fontSize: 9.5, fontWeight: 500, color: B.taupe }}>Page {page} of 4</span>
        <span style={{ fontSize: 9.5, fontWeight: 400, color: B.taupe }}>support@runpayway.com</span>
      </div>
    </div>
  );
}

function ReportPage({ children, noPad }: { record?: AssessmentRecord; children: React.ReactNode; noPad?: boolean }) {
  return (
    <div className="report-page" style={{
      width: PDF.captureW,
      maxWidth: "100%",
      backgroundColor: "#FFFFFF",
      border: "none",
      borderRadius: 0,
      padding: noPad ? 0 : R.pagePad,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      overflow: "visible",
      position: "relative",
      fontFamily: "'Inter', sans-serif",
    }}>
      {children}
    </div>
  );
}


// ============================================================
// PDF DOWNLOAD
// ============================================================

// PDF generation handled by report-pdf.tsx vector renderer


// ============================================================
// MAIN PAGE
// ============================================================

export default function ReviewPage() {
  const router = useRouter();
  const [record, setRecord] = useState<AssessmentRecord | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [animatedScore, setAnimatedScore] = useState(0);
  const [expandedScript, setExpandedScript] = useState<string | null>(null);
  const [scriptCopied, setScriptCopied] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [mobile, setMobile] = useState(false);
  const monitoringTracked = useRef(false);
  const totalPages = 5; // cover + 4 pages
  const emailSent = useRef(false);
  const scoreAnimated = useRef(false);
  const pageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
    if (pageContainerRef.current) {
      pageContainerRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  // Keyboard navigation for pages
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); setCurrentPage(p => Math.min(totalPages - 1, p + 1)); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); setCurrentPage(p => Math.max(0, p - 1)); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Scroll to top of page container on page change
  useEffect(() => {
    pageContainerRef.current?.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo(0, 0);
    let stored = sessionStorage.getItem("rp_record");
    if (!stored) {
      stored = localStorage.getItem("rp_record");
      if (stored) sessionStorage.setItem("rp_record", stored);
    }
    if (!stored) { router.push("/diagnostic-portal"); return; }

    let parsed: AssessmentRecord;
    try {
      parsed = JSON.parse(stored);
    } catch {
      router.push("/diagnostic-portal");
      return;
    }

    if (!parsed || !parsed.record_id || typeof parsed.final_score !== "number") {
      router.push("/diagnostic-portal");
      return;
    }

    setRecord(parsed);

    try {
      const records = safeJsonParse<Array<Record<string, unknown>>>(localStorage.getItem("rp_records"), []);
      if (!records.some((r) => r.record_id === parsed.record_id)) {
        records.push({
          record_id: parsed.record_id,
          authorization_code: parsed.authorization_code,
          model_version: parsed.model_version,
          final_score: parsed.final_score,
          stability_band: parsed.stability_band,
          assessment_date_utc: parsed.assessment_date_utc,
          issued_timestamp_utc: parsed.issued_timestamp_utc,
        });
        localStorage.setItem("rp_records", JSON.stringify(records));
      }
    } catch { /* ignore */ }

    // Clean up localStorage session data now that the report is delivered
    try {
      localStorage.removeItem("rp_purchase_session");
      localStorage.removeItem("rp_profile");
    } catch { /* ignore */ }

    if (!monitoringTracked.current) {
      monitoringTracked.current = true;
      try {
        const purchaseSession = sessionStorage.getItem("rp_purchase_session");
        if (purchaseSession) {
          const ps = JSON.parse(purchaseSession);
          if (ps.plan_key === "annual_monitoring" && ps.monitoring_access_code) {
            void useAssessmentServer(ps.monitoring_access_code, parsed.record_id);
          }
        }
      } catch { /* ignore */ }
    }

    if (!emailSent.current) {
      emailSent.current = true;
      try {
        const purchaseRaw = sessionStorage.getItem("rp_purchase_session");
        const profileRaw = sessionStorage.getItem("rp_profile");
        const email =
          (purchaseRaw ? safeJsonParse<Record<string, string>>(purchaseRaw, {}).customer_email : null) ||
          (profileRaw ? safeJsonParse<Record<string, string>>(profileRaw, {}).recipient_email : null);
        if (email) {
          setEmailStatus("sending");
          fetch("/api/v1/send-report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              recipientEmail: email,
              assessmentTitle: parsed.assessment_title,
              finalScore: parsed.final_score,
              stabilityBand: parsed.stability_band,
              recordId: parsed.record_id,
              modelVersion: parsed.model_version,
              issuedTimestamp: parsed.issued_timestamp_utc,
              industrySector: parsed.industry_sector,
              classification: parsed.classification,
              primaryConstraintLabel: parsed.primary_constraint_label,
              bandInterpretationText: parsed.band_interpretation_text,
              peerPercentileLabel: parsed.peer_stability_percentile_label,
              riskScenarioDrop: parsed.risk_scenario_drop,
            }),
          })
            .then((res) => res.ok ? setEmailStatus("sent") : setEmailStatus("error"))
            .catch(() => setEmailStatus("error"));
        }
      } catch { /* ignore email errors */ }
    }
  }, [router]);

  // ── Score count-up animation ──
  useEffect(() => {
    if (!record || scoreAnimated.current) return;
    scoreAnimated.current = true;
    const target = record.final_score;
    const duration = 600;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setAnimatedScore(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [record]);

  if (!record) return null;

  // ── Derived values ──
  const score = record.final_score;
  const tier: "limited" | "developing" | "established" | "high" =
    score >= 75 ? "high" : score >= 50 ? "established" : score >= 30 ? "developing" : "limited";
  const isHighScorer = score >= 50; // Established or High — needs preservation framing, not repair framing

  const subTier: "A1" | "A2" | "A3" | "B1" | "B2" | "C1" | "C2" | "D1" | "D2" =
    score <= 9 ? "A1" : score <= 19 ? "A2" : score <= 29 ? "A3" :
    score <= 39 ? "B1" : score <= 49 ? "B2" :
    score <= 59 ? "C1" : score <= 74 ? "C2" :
    score <= 89 ? "D1" : "D2";

  const name = record.assessment_title || "This income profile";
  const issuedDate = (record.issued_timestamp_utc || record.assessment_date_utc).split("T")[0];
  const reassessDate = (() => {
    const d = new Date(record.issued_timestamp_utc || record.assessment_date_utc);
    d.setMonth(d.getMonth() + (tier === "limited" ? 2 : tier === "high" ? 6 : 3));
    return d.toISOString().split("T")[0];
  })();

  // ── Profile context for dynamic personalization ──
  const profileClass = (record.classification || "").toLowerCase();
  const opStructure = (record.operating_structure || "").toLowerCase();
  const incomeModel = (record.primary_income_model || "").toLowerCase();
  const revStructure = (record.revenue_structure || "").toLowerCase();
  const industrySector = (record.industry_sector || "").replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());

  // Dynamic labels based on profile
  const profileNoun = profileClass.includes("business") ? "business" : profileClass.includes("team") ? "team" : "individual";
  const structureDesc = opStructure.includes("employee") || opStructure.includes("w-2") ? "salaried employee"
    : opStructure.includes("contractor") || opStructure.includes("independent") ? "independent contractor"
    : opStructure.includes("business owner") || opStructure.includes("firm") ? "business owner"
    : opStructure.includes("partnership") ? "partnership"
    : opStructure.includes("nonprofit") ? "nonprofit operator"
    : "professional";

  const incomeModelDesc = incomeModel.includes("salary") ? "salary-based"
    : incomeModel.includes("commission") ? "commission-driven"
    : incomeModel.includes("contract") ? "contract-based"
    : incomeModel.includes("retainer") || incomeModel.includes("subscription") ? "retainer/subscription-based"
    : incomeModel.includes("project") ? "project-based"
    : incomeModel.includes("consulting") || incomeModel.includes("client") ? "consulting/client-services"
    : incomeModel.includes("product") ? "product-sales"
    : incomeModel.includes("creator") || incomeModel.includes("media") ? "creator/media"
    : incomeModel.includes("rental") || incomeModel.includes("real estate") ? "rental/real-estate"
    : incomeModel.includes("franchise") ? "franchise"
    : incomeModel.includes("hybrid") || incomeModel.includes("multiple") ? "hybrid/multi-source"
    : "mixed-income";

  const revenueDesc = revStructure.includes("one-time") ? "mostly one-time payments"
    : revStructure.includes("repeat") ? "repeat-client revenue"
    : revStructure.includes("monthly") ? "monthly recurring revenue"
    : revStructure.includes("contracted") ? "contracted multi-month revenue"
    : revStructure.includes("long-term") ? "long-term recurring income"
    : revStructure.includes("mixed") ? "a mixed revenue structure"
    : "variable revenue";

  // Dynamic constraint advice based on profile
  const profileConstraintAdvice: Record<string, string> = {
    source_concentration: opStructure.includes("contractor") || opStructure.includes("independent")
      ? "Based on your assessment profile, as a contractor, losing your primary client would significantly impact your income. Maintaining at least 2–3 active contracts reduces this exposure."
      : opStructure.includes("employee")
      ? "Based on your assessment profile, as a salaried employee, your income depends entirely on one employer. Building a secondary income stream strengthens your structure."
      : profileClass.includes("business")
      ? "Based on your assessment profile, your business revenue is too concentrated. As a general guideline, reducing reliance on any single client strengthens the overall structure."
      : "Based on your assessment profile, your income is too concentrated in one source. Diversifying helps protect against sudden loss.",
    forward_visibility: incomeModel.includes("commission") || incomeModel.includes("project")
      ? `Based on your assessment profile, with ${incomeModelDesc} income, future earnings are unpredictable. Lock in advance commitments, retainers, or pipeline guarantees.`
      : opStructure.includes("contractor")
      ? "Based on your assessment profile, as a contractor, secure multi-month engagements or retainer agreements instead of rolling month-to-month."
      : profileClass.includes("business")
      ? "Based on your assessment profile, your business needs more contracted or recurring revenue locked in before each month begins."
      : "Based on your assessment profile, too little of your income is committed before the month starts. Lock in recurring or pre-committed income.",
    labor_dependence: opStructure.includes("employee")
      ? "Based on your assessment profile, as an employee, 100% of your income stops if you stop working. Building passive or semi-passive income alongside your salary can help."
      : incomeModel.includes("consulting") || incomeModel.includes("client")
      ? "Based on your assessment profile, your consulting income requires constant client delivery. Productizing your expertise into courses, templates, or licensing can reduce this dependency."
      : profileClass.includes("business")
      ? "Based on your assessment profile, your business is still owner-dependent. Building systems, recurring revenue, or delegated delivery so income continues without you strengthens the structure."
      : "Based on your assessment profile, too much income requires your daily effort. Shifting toward streams that produce without constant work improves stability.",
    low_continuity: incomeModel.includes("commission")
      ? "Based on your assessment profile, commission income stops immediately when deals stop closing. Building a base of recurring or residual commissions adds runway."
      : opStructure.includes("contractor")
      ? "Based on your assessment profile, contract income has a short shelf life. Negotiating longer-term contracts or building retainer relationships extends continuity."
      : "Based on your assessment profile, your income would stop too quickly if active work paused. Building streams that continue producing independently adds protection.",
    few_sources: profileClass.includes("business")
      ? "Based on your assessment profile, your business relies on too few revenue channels. Adding a new client segment, product line, or service tier broadens the base."
      : opStructure.includes("contractor")
      ? "Based on your assessment profile, you need more active clients. Each new contract that contributes at least 10% of income strengthens the structure."
      : "Based on your assessment profile, your income comes from too few sources. Adding even one more meaningful source significantly reduces risk.",
  };


  // ── V2 engine data (must be before band-sensitive copy) ──
  const v2 = record._v2;
  const v2Fragility = v2?.fragility ?? null;
  const v2Sensitivity = v2?.sensitivity ?? null;
  const v2Interactions = v2?.interactions ?? null;
  const v2Constraints = v2?.constraints ?? null;
  const v2Scenarios = v2?.scenarios ?? null;
  const v2Lift = v2?.score_lift_projection ?? null;
  const v2AvoidActions = v2?.avoid_actions ?? null;
  const v2Benchmarks = v2?.benchmarks ?? null;

  // ── Strategic insight data (RP-2.1) ──
  const v2SurprisingInsights = v2?.surprising_insights ?? null;
  const v2TradeoffNarratives = v2?.tradeoff_narratives ?? null;
  const v2OneThingThatMatters = v2?.one_thing_that_matters ?? null;
  const v2PredictiveWarnings = v2?.predictive_warnings ?? null;
  const v2NormalizedInputs = v2?.normalized_inputs ?? null;

  // ── Outcome layer ──
  const ol = v2?.outcome_layer;
  const olActions = ol?.ranked_action_map ?? null;
  const olAvoid = ol?.avoid_actions ?? null;
  const olExplanations = ol?.explanation_translation_layer ?? null;
  const olTriggers = ol?.reassessment_trigger_set ?? null;
  const olFamilyLabel = ol?.income_model_family?.family_label ?? null;
  const olIndustryLabel = ol?.industry_refinement_profile?.industry_label ?? null;

  // ── Deep engine data for rich personalization ──
  const v2Explainability = v2?.explainability as { why_this_score?: string; why_not_higher?: string; strongest_supports?: string[]; strongest_suppressors?: string[]; best_lift_explanation?: string; fragility_explanation?: string; interaction_summary?: string } | undefined;
  const v2BehavioralInsights = v2?.behavioral_insights as Array<{ pattern: string; consequence: string; reframe: string }> | undefined;
  const v2ExecutionRoadmap = v2?.execution_roadmap as Array<{ week: string; action: string; detail: string; success_metric: string }> | undefined;
  const v2Indicators = v2?.indicators as Array<{ key: string; label: string; raw_value: number; normalized_value: number; level: string }> | undefined;
  const olSelectedScenarios = ol?.selected_scenarios as Array<{ scenario_id: string; label: string; description: string; severity: string; why_it_matters: string }> | undefined;

  // ── Outcome layer explanations override profileConstraintAdvice when available ──
  if (olExplanations) {
    const constraintKeyMap: Record<string, string> = {
      source_concentration: "high_concentration",
      forward_visibility: "low_forward_secured",
      labor_dependence: "high_labor_dependence",
      low_continuity: "short_continuity",
      few_sources: "low_source_diversity",
    };
    for (const [constraint, olKey] of Object.entries(constraintKeyMap)) {
      if (olExplanations[olKey]) {
        profileConstraintAdvice[constraint] = olExplanations[olKey];
      }
    }
    if (olExplanations.high_variability && !profileConstraintAdvice.high_variability) {
      profileConstraintAdvice.high_variability = olExplanations.high_variability;
    }
  }

  // ── LAYER 2: Dominant constraint ──
  const dominantConstraintKey = v2Constraints?.root_constraint ?? "weak_forward_visibility";
  const dominantConstraint: "source_concentration" | "forward_visibility" | "labor_dependence" | "low_continuity" | "few_sources" =
    dominantConstraintKey === "high_concentration" ? "source_concentration" :
    dominantConstraintKey === "weak_forward_visibility" ? "forward_visibility" :
    dominantConstraintKey === "high_labor_dependence" ? "labor_dependence" :
    dominantConstraintKey === "low_persistence" ? "low_continuity" :
    dominantConstraintKey === "low_source_diversity" ? "few_sources" :
    "forward_visibility";

  const dominantConstraintPlain: Record<string, string> = {
    source_concentration: "too much reliance on one source",
    forward_visibility: "not enough income secured ahead of time",
    labor_dependence: "too much of the income still depends on daily work",
    low_continuity: "too little income would continue if work stopped",
    few_sources: "the income structure is still too narrow",
  };

  // ── LAYER 3: Distance to next band ──
  const nextBandThreshold = score < 30 ? 30 : score < 50 ? 50 : score < 75 ? 75 : 100;
  const nextBandName = score < 30 ? "Developing" : score < 50 ? "Established" : score < 75 ? "High" : null;
  const distanceToNext = nextBandThreshold - score;
  const bandDistance: "CLOSE" | "MODERATE" | "FAR" | "TOP_BAND" =
    tier === "high" ? "TOP_BAND" :
    distanceToNext <= 4 ? "CLOSE" :
    distanceToNext <= 14 ? "MODERATE" : "FAR";

  // ── LAYER 4: Metric severity ──
  const continuitySeverity: string =
    record.income_continuity_months < 1 ? "very short" :
    record.income_continuity_months < 3 ? "limited" :
    record.income_continuity_months < 6 ? "moderate" :
    record.income_continuity_months < 12 ? "meaningful" : "strong";

  const sourceDropSeverity: "collapse" | "severe" | "significant" | "moderate" | "minor" =
    record.risk_scenario_score <= 0 ? "collapse" :
    record.risk_scenario_drop > score * 0.6 ? "severe" :
    record.risk_scenario_drop > score * 0.3 ? "significant" :
    record.risk_scenario_drop > 5 ? "moderate" : "minor";

  const peerPercentileValue: number | null = record.peer_stability_percentile ?? (v2Benchmarks?.peer_percentile ?? null);
  const peerInterpretation: string | null = peerPercentileValue === null ? null :
    peerPercentileValue <= 10 ? "far below benchmark" :
    peerPercentileValue <= 30 ? "below benchmark" :
    peerPercentileValue <= 60 ? "around benchmark" :
    peerPercentileValue <= 85 ? "above benchmark" : "well above benchmark";


  const p2Intro: Record<string, string> = {
    A1: `Here is how your ${incomeModelDesc} income in ${industrySector} actually works — where it comes from, how it flows, and where it breaks.`,
    A2: `This is the structural breakdown of your income. As a ${structureDesc} with ${revenueDesc}, here is what the data shows.`,
    A3: `You have early structure. Here is the composition of your ${incomeModelDesc} income in ${industrySector} — and where the gaps are.`,
    B1: `Your ${incomeModelDesc} income in ${industrySector} is developing. Here is the breakdown — what is working and what is exposed.`,
    B2: `Your income structure is taking shape. Here is the composition — ${record.active_income_level}% active, ${record.persistent_income_level}% persistent.`,
    C1: `Your ${incomeModelDesc} structure in ${industrySector} has real protection. Here is the composition and where the remaining exposure sits.`,
    C2: `Established ${incomeModelDesc} structure. Here is how your income is composed — and the specific areas that still matter.`,
    D1: `Strong ${incomeModelDesc} structure with ${record.persistent_income_level}% persistent income. Here is the full composition.`,
    D2: `Exceptionally well-built. Here is the structural detail behind the ${score}/100 score.`,
  };

  const p3Intro: Record<string, string> = {
    A1: `As a ${structureDesc} in ${industrySector} with ${incomeModelDesc} income, these are the biggest threats to your structure right now.`,
    A2: `These are the scenarios that would hurt your ${incomeModelDesc} income most given the current weak structure.`,
    A3: `These risks are specific to your ${incomeModelDesc} setup in ${industrySector} while the structure is still below stable.`,
    B1: `These risks show where your ${incomeModelDesc} structure in ${industrySector} is still exposed.`,
    B2: `These are the scenarios that could set back your developing ${incomeModelDesc} structure.`,
    C1: `Even with real stability, these scenarios could still weaken your ${incomeModelDesc} income in ${industrySector}.`,
    C2: `Despite an established structure, these risks still matter for your ${incomeModelDesc} setup.`,
    D1: `From a position of strength, these are the limited risks that could still affect your ${incomeModelDesc} income.`,
    D2: `These are the only remaining risks for your highly resilient ${incomeModelDesc} structure.`,
  };




  // ── Consumer-friendly label maps ──
  const failureModeLabel: Record<string, string> = {
    concentration_collapse: "Too much weight on a single source",
    labor_interruption: "Income stops when active work stops",
    visibility_gap: "Not enough income is secured ahead",
    durability_thinness: "Recurring income is fragile or cancelable",
  };
  const constraintLabel: Record<string, string> = {
    weak_forward_visibility: "Too little income secured ahead",
    high_labor_dependence: "Too much dependence on active work",
    high_concentration: "Too much dependence on one source",
    low_persistence: "Not enough recurring income",
    high_variability: "Too much earnings variability",
    weak_durability: "Income quality is too fragile",
    shallow_continuity: "Continuity window is too short",
  };
  const fragilityClassLabel: Record<string, string> = {
    brittle: "One disruption could seriously damage your income", thin: "You can handle a small setback, but not two in a row", uneven: "Some parts of your income are protected, others are not", supported: "Your income has multiple layers of protection", resilient: "Your income can absorb a major hit and keep going",
  };
  const confidenceColor: Record<string, string> = {
    high: B.teal, moderate: B.bandEstablished, guarded: B.bandDeveloping, low: B.bandLimited,
  };

  // ── Plain English dimension name mapping ──
  const dimensionNameMap: Record<string, string> = {
    "Income Persistence": "How much income repeats without new sales",
    "Source Diversification": "How spread out your income sources are",
    "Source Independence": "How much depends on your biggest source",
    "Forward Revenue Visibility": "How much income is already booked ahead",
    "Labor Independence": "How much continues if you stop working",
    "Earnings Stability": "How consistent your income is month to month",
  };
  const plainDimension = (name: string): string => dimensionNameMap[name] ?? name;

  // ── Score context helper for dimension scores ──
  const scoreContext = (val: number): string =>
    val < 30 ? "(below average — this is a weak point)" :
    val < 50 ? "(developing — room to improve)" :
    val < 75 ? "(solid — this is working for you)" :
    "(strong — this is a strength)";

  // ── Peer comparison direction helper ──
  const peerDirectionLabel = (direction: string): string =>
    direction === "above" ? "Above your peers — this is a strength" :
    "Below your peers — this is an area to improve";

  // ── Continuity display ──
  const continuityDisplay = record.income_continuity_months < 0.5
    ? "Less than 1 week"
    : record.income_continuity_months < 1
      ? "Less than 1 month"
      : `${record.income_continuity_months} month${record.income_continuity_months !== 1 ? "s" : ""}`;

  // ── Page navigation ──

  // ── Reassessment countdown ──
  const reassessDaysLeft = Math.max(0, Math.ceil((new Date(reassessDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      const { generateReportPDF } = await import("./report-pdf");
      const { ReportPDFData } = await import("./report-pdf") as { ReportPDFData: unknown };
      void ReportPDFData; // type-only, suppress unused

      // Build access code
      const v2d = (record as Record<string, unknown>)._v2 as Record<string, unknown> | undefined;
      const nid = v2d?.normalized_inputs as Record<string, number | string> | undefined;
      const accessCodePayload = nid ? btoa(JSON.stringify({ p: nid.income_persistence_pct, c: nid.largest_source_pct, s: nid.source_diversity_count, f: nid.forward_secured_pct, v: nid.income_variability_level, l: nid.labor_dependence_pct, q: (v2d?.quality as Record<string, number>)?.quality_score ?? 5, n: record.assessment_title || "", i: record.industry_sector || "", m: record.primary_income_model || "" })) : "";

      // Build diagnostic sentence
      const diagSentence = (() => {
        if (tier === "high") return "Your income is not invulnerable. But it is built to absorb a hit without forcing a crisis. That is rare.";
        if (tier === "established") return "Your income is not fragile. But it still depends on a narrow set of conditions staying exactly as they are.";
        if (dominantConstraint === "labor_dependence") return "Your income is not weak because you earn too little. It is weak because too much of it stops when your daily effort stops.";
        if (dominantConstraint === "source_concentration") return "Your income is not weak because it is small. It is weak because too much of it depends on one source continuing to pay.";
        if (dominantConstraint === "forward_visibility") return "Your income is not unstable because you lack skill. It is unstable because you cannot see far enough ahead to plan around a disruption.";
        if (dominantConstraint === "low_continuity") return "Your income is not insecure because of what you earn. It is insecure because almost none of it would continue if you had to stop working tomorrow.";
        if (dominantConstraint === "few_sources") return "Your income is not at risk because of how much you earn. It is at risk because losing any one source would change everything.";
        return "Your income has structural weaknesses that are not visible in your day-to-day earnings. This report makes them visible.";
      })();

      // Build plain English
      const plainEng = v2Explainability?.why_this_score || (() => {
        const ctx = olFamilyLabel ? `As a ${olFamilyLabel.toLowerCase()}${olIndustryLabel ? ` in ${olIndustryLabel}` : ""}, ` : "";
        return isHighScorer ? `${ctx}your income has structural protection. The priority is strengthening specific weak points, not rebuilding.` : `${ctx}your income is developing. ${nextBandName ? `${distanceToNext} points from ${nextBandName}.` : ""}`;
      })();

      // Build killer line for page 2
      const killerLn = record.active_income_level + record.semi_persistent_income_level >= 80
        ? `${record.active_income_level + record.semi_persistent_income_level}% of your income still requires you to keep re-earning it.`
        : record.active_income_level >= 50
          ? `${record.active_income_level}% of your income is earned once and stops. It does not repeat, renew, or survive interruption.`
          : `${100 - record.active_income_level}% of your income continues without your daily effort. That is uncommon structural protection.`;

      // Build fragility diagnostic
      const fragDiag = (() => {
        const fc = v2Fragility?.fragility_class;
        if (fc === "brittle") return "A single disruption — one lost client, one slow month — could force a structural crisis. That is not a risk scenario. That is your current exposure.";
        if (fc === "thin") return "You can likely absorb one mild setback. Two close together would create pressure fast.";
        if (fc === "uneven") return "Parts of your income are well-protected. Other parts are not. That unevenness is where risk hides.";
        if (fc === "supported") return "Most common disruptions would not break your structure. But the scenarios below show where your limits are.";
        if (fc === "resilient") return "Your income can take a serious hit. The scenarios below show the few things that could still cause real damage.";
        return "Your income has specific structural exposures. The scenarios below show exactly where they are.";
      })();

      // Build ranked factors
      const sortedIndicators = v2Indicators ? [...v2Indicators].sort((a, b) => a.normalized_value - b.normalized_value) : [];
      const weakest = sortedIndicators[0];
      const strongest = sortedIndicators[sortedIndicators.length - 1];
      const rankedF: Array<{ role: string; label: string; level: string; normalizedValue: number; explanation: string; roleColor: string; levelColor: string }> = [];
      const getLevelColor = (level: string) => level === "critical" || level === "weak" ? B.bandLimited : level === "moderate" ? B.bandDeveloping : level === "strong" ? B.bandEstablished : B.bandHigh;
      if (strongest && weakest && strongest.key !== weakest.key) {
        rankedF.push({ role: "STRONGEST FACTOR", label: strongest.label, level: strongest.level, normalizedValue: strongest.normalized_value, explanation: "This is what is holding your structure together.", roleColor: B.teal, levelColor: getLevelColor(strongest.level) });
      }
      if (weakest) {
        rankedF.push({ role: "WEAKEST FACTOR", label: weakest.label, level: weakest.level, normalizedValue: weakest.normalized_value, explanation: "This is the biggest structural gap in your income.", roleColor: B.bandLimited, levelColor: getLevelColor(weakest.level) });
      }

      // Build scenarios
      const scenarioPlain: Record<string, string> = {
        active_labor_interrupted: "You take two weeks off and have no backup revenue",
        platform_dependency_shock: "One income source changes its terms or access",
        forward_commitments_delayed: "New work arrives later than expected",
        client_concentration_loss: "A major client pauses or ends work",
        market_contraction: "Demand in your industry drops for two or more months",
        high_volatility_month: "You have a slow month with no backup revenue",
        key_client_loss: "You lose a key client or contract",
        recurring_stream_degrades: "A repeating income stream weakens or stops",
        referral_pipeline_dries: "New business or referrals dry up for a stretch",
        contract_non_renewal: "A major contract is not renewed",
        scope_reduction: "A client cuts the scope of your work significantly",
        revenue_model_disruption: "Your primary way of earning income stops working",
        pricing_pressure: "What you can charge drops due to market pressure",
        regulatory_disruption: "A regulatory or policy change affects how you earn",
        seasonal_revenue_gap: "A seasonal slowdown cuts your income for weeks",
      };
      const sortedScenarios = v2Scenarios ? [...v2Scenarios].sort((a, b) => b.score_drop - a.score_drop).slice(0, 4) : [];
      const scenariosData = sortedScenarios.map(s => {
        const olMatch = olSelectedScenarios?.find(os => s.scenario_id.toLowerCase().includes(os.scenario_id.toLowerCase().replace("rs-", "").replace(/-/g, "_")) || os.label.toLowerCase() === s.label?.toLowerCase());
        return {
          title: scenarioPlain[s.scenario_id] ?? s.label,
          originalScore: s.original_score,
          scenarioScore: s.scenario_score,
          scoreDrop: s.score_drop,
          narrative: olMatch?.why_it_matters || s.narrative,
          bandShift: s.band_shift,
          originalBand: s.original_band,
          scenarioBand: s.scenario_band,
        };
      });

      // Build action categories
      const liftConcrete: Record<string, { title: string; how: string }> = {
        reduce_labor_dependence: { title: "Reduce how much income requires your daily effort", how: "Convert active services into retainers, productized packages, or licensed deliverables." },
        reduce_active_dependence: { title: "Reduce how much income requires your daily effort", how: "Convert active services into retainers, productized packages, or licensed deliverables." },
        extend_forward_visibility: { title: "Lock in revenue before each month starts", how: "Move clients to retainers, prepaid packages, or standing agreements." },
        improve_forward_secured: { title: "Lock in revenue before each month starts", how: "Move clients to retainers, prepaid packages, or standing agreements." },
        reduce_concentration: { title: "Reduce dependence on your largest income source", how: "Add one new client or revenue stream that could reach 15%+ of income within 90 days." },
        reduce_largest_source: { title: "Reduce dependence on your largest income source", how: "Add one new client or revenue stream that could reach 15%+ of income within 90 days." },
        increase_persistence: { title: "Build income that repeats without re-selling", how: "Introduce subscriptions, maintenance contracts, or membership models." },
        increase_persistent_revenue: { title: "Build income that repeats without re-selling", how: "Introduce subscriptions, maintenance contracts, or membership models." },
        strengthen_persistence: { title: "Build income that repeats without re-selling", how: "Introduce subscriptions, maintenance contracts, or membership models." },
        add_income_sources: { title: "Add more independent income sources", how: "Identify one adjacent service or client type on a different cycle." },
        diversify_sources: { title: "Spread income across more sources", how: "Identify one adjacent service or client type on a different cycle." },
        reduce_variability: { title: "Smooth out month-to-month income swings", how: "Shift to retainers or phased billing with quarterly or annual pricing." },
        increase_continuity: { title: "Extend how long income lasts if you stop working", how: "Build one stream that produces for 3+ months independently." },
        extend_continuity: { title: "Extend how long income lasts if you stop working", how: "Build one stream that produces for 3+ months independently." },
      };
      const viable = v2Lift ? v2Lift.lift_scenarios.filter((s: { lift: number }) => s.lift > 0).sort((a: { lift: number }, b: { lift: number }) => b.lift - a.lift) : [];
      const fastest = viable[0];
      const easiest = viable.length > 1 ? viable[viable.length - 1] : null;
      const actionCats: Array<{ tag: string; tagColor: string; title: string; how: string; scoreChange: string }> = [];
      if (fastest) {
        const c = liftConcrete[fastest.scenario_id];
        actionCats.push({ tag: "FASTEST IMPROVEMENT", tagColor: B.purple, title: c?.title ?? fastest.label, how: c?.how ?? fastest.change_description ?? "", scoreChange: `${fastest.original_score} → ${fastest.projected_score} (+${fastest.lift})` });
      }
      if (easiest && easiest.scenario_id !== fastest?.scenario_id) {
        const c = liftConcrete[easiest.scenario_id];
        actionCats.push({ tag: "EASIEST TO START", tagColor: B.teal, title: c?.title ?? easiest.label, how: c?.how ?? easiest.change_description ?? "", scoreChange: `${easiest.original_score} → ${easiest.projected_score} (+${easiest.lift})` });
      }

      // Fragility details
      const fragLabel = fragilityClassLabel[v2Fragility?.fragility_class || ""] || "";
      const fragText = v2Explainability?.fragility_explanation || (() => {
        const fc = v2Fragility?.fragility_class;
        if (fc === "brittle") return "A single disruption could cause your score to collapse. There is no structural buffer.";
        if (fc === "thin") return "You can absorb a minor hit. But two close together would create serious pressure.";
        if (fc === "uneven") return "Some parts are well-protected. Others are fully exposed.";
        if (fc === "supported") return "Your income can absorb most common disruptions without dropping a band.";
        if (fc === "resilient") return "Your income can absorb a major client loss or a 90-day work stoppage.";
        return "";
      })();
      const fragColor = v2Fragility?.fragility_class === "brittle" || v2Fragility?.fragility_class === "thin" ? B.bandLimited : v2Fragility?.fragility_class === "resilient" || v2Fragility?.fragility_class === "supported" ? B.teal : B.navy;
      const failMode = v2Fragility?.primary_failure_mode ? ({
        concentration_collapse: "too much income depends on one source",
        labor_interruption: "income stops when your work stops",
        visibility_gap: "no income is secured ahead of time",
        durability_thinness: "repeating income is fragile and could end",
      } as Record<string, string>)[v2Fragility.primary_failure_mode] ?? v2Fragility.primary_failure_mode : undefined;

      const blob = await generateReportPDF({
        assessmentTitle: record.assessment_title || "Assessment",
        issuedDate,
        formalDate,
        finalScore: record.final_score,
        stabilityBand: record.stability_band,
        bandColor,
        tier,
        coverBandDesc: coverBandDesc[tier] || "",
        accessCode: accessCodePayload,
        diagnosticSentence: diagSentence,
        plainEnglish: plainEng,
        whyNotHigher: v2Explainability?.why_not_higher,
        dominantConstraintText: dominantConstraintPlain[dominantConstraint] ? dominantConstraintPlain[dominantConstraint].charAt(0).toUpperCase() + dominantConstraintPlain[dominantConstraint].slice(1) + "." : "A structural weakness is limiting your score.",
        whatToChangeFirst: v2Sensitivity?.tests?.[0]?.delta_description || (v2Lift?.highest_single_lift?.label ? `${v2Lift.highest_single_lift.label}.` : `Reduce ${dominantConstraintPlain[dominantConstraint]}.`),
        whatThatWouldDo: v2Sensitivity?.tests?.[0] ? `${v2Sensitivity.tests[0].original_score} → ${v2Sensitivity.tests[0].projected_score} (+${v2Sensitivity.tests[0].lift} points)` : v2Lift?.highest_single_lift ? `${score} → ${v2Lift.highest_single_lift.projected_score} (+${v2Lift.highest_single_lift.lift} points)` : "Estimated improvement available.",
        nextBandName,
        distanceToNext,
        bandDistance,
        bandDistanceText: bandDistance === "CLOSE" ? "You are close. One structural change could move you into the next band." : bandDistance === "MODERATE" ? "This gap is closeable. The constraint above is the fastest path." : bandDistance === "TOP_BAND" ? "You are in the highest stability band." : "This will take more than one change — but the constraint above is where to start.",
        score,
        pressureMap: record.pressure_map ? { operatingStructure: record.pressure_map.operating_structure || "", incomeModel: record.pressure_map.income_model || "", industry: record.pressure_map.industry || "", pressure: record.pressure_map.pressure, tailwind: record.pressure_map.tailwind, leverageMove: record.pressure_map.leverage_move } : undefined,
        killerLine: killerLn,
        activeIncome: record.active_income_level,
        semiPersistentIncome: record.semi_persistent_income_level,
        persistentIncome: record.persistent_income_level,
        riskScenarioScore: Math.max(0, record.risk_scenario_score),
        riskScenarioDrop: record.risk_scenario_drop,
        continuityDisplay,
        continuityText: record.income_continuity_months < 1 ? "Your income stops almost immediately." : record.income_continuity_months < 3 ? "Very little runway before income pressure begins." : record.income_continuity_months < 6 ? "Some runway, but not enough to absorb a serious disruption." : "Meaningful buffer before income pressure begins.",
        riskSeverityText: record.risk_scenario_drop > score * 0.4 ? "That is a severe dependency on a single source." : "",
        rankedFactors: rankedF,
        strongestSupports: v2Explainability?.strongest_supports?.slice(0, 2) || [],
        strongestSuppressors: v2Explainability?.strongest_suppressors?.slice(0, 2) || [],
        fragilityDiagnostic: fragDiag,
        scenarios: scenariosData,
        fragilityLabel: fragLabel,
        fragilityText: fragText,
        fragilityColor: fragColor,
        failureMode: failMode,
        patternToWatch: v2BehavioralInsights?.[0] ? { pattern: v2BehavioralInsights[0].pattern, consequence: v2BehavioralInsights[0].consequence, reframe: v2BehavioralInsights[0].reframe } : undefined,
        actionCategories: actionCats,
        combinedLift: v2Lift?.combined_top_two && v2Lift.combined_top_two.lift > 0 ? { projectedScore: v2Lift.combined_top_two.projected_score, lift: v2Lift.combined_top_two.lift, bandShift: v2Lift.combined_top_two.band_shift ? v2Lift.combined_top_two.projected_band : undefined, explanation: v2Explainability?.best_lift_explanation } : undefined,
        tradeoff: v2TradeoffNarratives?.[0] ? { actionLabel: v2TradeoffNarratives[0].action_label, upside: v2TradeoffNarratives[0].upside, downside: v2TradeoffNarratives[0].downside, recommendation: v2TradeoffNarratives[0].net_recommendation } : undefined,
        avoidActions: [...(v2AvoidActions ?? []).slice(0, 1).map((a: { label: string; reason: string }) => `${a.label}: ${a.reason}`), ...(olAvoid ?? []).slice(0, 1)],
        roadmap: (v2ExecutionRoadmap ?? []).slice(0, 4).map(w => ({ week: w.week, action: w.action, detail: w.detail, target: w.success_metric })),
        reassessDate,
        reassessDaysLeft,
        reassessTiming: `Typically ${tier === "limited" ? "2" : tier === "high" ? "6" : "3"} months.`,
        triggers: (olTriggers ?? []).slice(0, 3).map((t: { display_text: string }) => t.display_text),
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `RunPayway-Income-Stability-Report-${record.record_id.slice(0, 8)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "PDF generation failed";
      setDownloadError(msg);
    } finally {
      setDownloading(false);
    }
  };

  // ── Band color helper ──
  const bandColor = tier === "high" ? B.bandHigh : tier === "established" ? B.bandEstablished : tier === "developing" ? B.bandDeveloping : B.bandLimited;


  // ── Formal date for cover page ──
  const formalDate = (() => {
    const d = new Date(record.issued_timestamp_utc || record.assessment_date_utc);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  })();

  // ── Page summary sentences ──
  const coverBandDesc: Record<string, string> = {
    limited: "Your income is highly vulnerable to disruption right now.",
    developing: "Some structure is in place, but important weaknesses still remain.",
    established: "Your income has meaningful structural protection in place.",
    high: "Your income is well-protected against most disruptions.",
  };

  const p1Summary: Record<string, string> = {
    limited: "Your income is structurally vulnerable right now — but this report shows you exactly how to fix it.",
    developing: "Your income has some structure, but important weaknesses still remain.",
    established: "Your income is well-protected. This report shows the remaining gaps and how to close them.",
    high: "Your income is strong. This report confirms what is working and where to focus next.",
  };

  const p3Summary: Record<string, string> = {
    limited: "Most of your income depends on your active effort every day. Here is exactly how it breaks down.",
    developing: "Most of your income depends on your active effort every day. Here is exactly how it breaks down.",
    established: "Your income has multiple layers of protection. Here is the detailed composition.",
    high: "Your income has multiple layers of protection. Here is the detailed composition.",
  };

  // ── Page names for navigation ──
  const pageNames = ["Cover", "Your Score", "Your Income", "Pressure Test", "Action Plan"];


  // ── Paginated page contents (shared between PDF container and on-screen view) ──
  const pageContents: ReactNode[] = [
    // Page 0: Cover
    <>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: mobile ? 420 : "auto", textAlign: "center", padding: mobile ? "0 8px" : "60px 0 40px" }}>
          <Image src={logoBlue} alt="RunPayway&#8482;" width={mobile ? 140 : 180} height={21} style={{ height: "auto", marginBottom: mobile ? 20 : 44 }} />
          <div style={{ width: mobile ? "80%" : "60%", height: 1, backgroundColor: B.stone, marginBottom: mobile ? 20 : 48 }} />

          <div style={{ ...T.pageTitle, fontSize: mobile ? 22 : 30, fontWeight: 700, marginBottom: 4 }}>Income Stability Report</div>
          <div style={{ ...T.small, color: B.muted, marginBottom: mobile ? 16 : 10 }}>Structural assessment of how your income holds up under disruption, concentration, and interruption.</div>

          <div style={{ fontSize: mobile ? 18 : 22, fontWeight: 500, color: B.navy, marginBottom: 4 }}>{record.assessment_title}</div>
          <div style={{ ...T.meta, color: B.muted, marginBottom: mobile ? 20 : 38 }}>{formalDate}</div>

          {/* Score block */}
          <div style={{ marginBottom: 12 }}>
            <span style={{ ...T.score, fontSize: mobile ? 56 : 64, color: B.navy }}>{record.final_score}</span>
            <span style={{ fontSize: mobile ? 18 : 24, fontWeight: 400, color: B.taupe }}>/100</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: bandColor }} />
            <div style={{ ...T.classification, color: bandColor }}>{record.stability_band}</div>
          </div>
          <div style={{ ...T.small, color: B.muted, marginBottom: mobile ? 16 : 28, maxWidth: 340, lineHeight: 1.5 }}>{coverBandDesc[tier]}</div>

          {/* Methodology footer */}
          <div style={{ ...T.meta, color: B.taupe, marginBottom: mobile ? 20 : 36 }}>Built from fixed structural questions under Model RP-2.0.</div>

          {/* Simulator access code — encoded data for client-side decode */}
          {(() => {
            const v2 = (record as Record<string, unknown>)._v2 as Record<string, unknown> | undefined;
            const ni = v2?.normalized_inputs as Record<string, number | string> | undefined;
            if (!ni) return null;
            const payload = {
              p: ni.income_persistence_pct,
              c: ni.largest_source_pct,
              s: ni.source_diversity_count,
              f: ni.forward_secured_pct,
              v: ni.income_variability_level,
              l: ni.labor_dependence_pct,
              q: (v2?.quality as Record<string, number>)?.quality_score ?? 5,
              n: record.assessment_title || "",
              i: record.industry_sector || "",
              m: record.primary_income_model || "",
            };
            const code = btoa(JSON.stringify(payload));
            return (
              <>
                <div style={{ ...T.overline, color: B.navy, marginBottom: 6, letterSpacing: 1, fontSize: mobile ? 10 : 11 }}>STABILITY SIMULATOR&#8482; ACCESS</div>
                <div style={{ ...T.meta, color: B.muted, marginBottom: 8, fontSize: mobile ? 11 : 12 }}>Enter this code at runpayway.com/simulator to model changes.</div>
                <div style={{ display: "inline-flex", flexDirection: "column", gap: 4, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "12px 20px", textAlign: "left", maxWidth: mobile ? "90%" : 420 }}>
                  <div style={{ ...T.meta, color: B.taupe, fontSize: 10 }}>Access Code</div>
                  <div style={{ fontFamily: "monospace", fontSize: mobile ? 8 : 9, color: B.navy, letterSpacing: "0.01em", wordBreak: "break-all" as const, lineHeight: 1.4 }}>{code}</div>
                </div>
              </>
            );
          })()}

          <div style={{ ...T.meta, color: B.taupe, marginTop: 24 }}>Model RP-2.0 · 4 Pages</div>
        </div>
    </>,

    // Page 1: Your Score
    <>
        <ReportHeader />

        {/* ── 1. STATE THE SCORE ── */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ ...T.overline, color: B.teal, marginBottom: 12, letterSpacing: "0.14em" }}>INCOME STABILITY ASSESSMENT</div>
          <h1 style={{ ...T.pageTitle, marginBottom: 6 }}>{record.assessment_title || "Assessment"}</h1>
          <div style={{ ...T.meta, color: B.taupe, marginBottom: 24 }}>
            {issuedDate} &middot; Model RP-2.0
          </div>

          <div style={{ marginBottom: 8 }}>
            <span style={{ ...T.score, color: B.navy }}>{animatedScore}</span>
            <span style={{ fontSize: 24, fontWeight: 400, color: B.taupe }}>/100</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: bandColor }} />
            <div style={{ ...T.classification, color: bandColor }}>{record.stability_band}</div>
          </div>
          {nextBandName && <div style={{ ...T.meta, color: B.muted, marginTop: 6 }}>{distanceToNext} points from {nextBandName} Stability</div>}
        </div>

        {/* ── 2. KILLER DIAGNOSTIC SENTENCE ── */}
        <div style={{ backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderLeft: `2px solid ${B.navy}`, borderRadius: 6, padding: mobile ? "16px 16px" : "24px 28px", marginBottom: 20, textAlign: "center" }}>
          <p style={{ ...T.body, color: B.navy, margin: 0, lineHeight: 1.7, fontSize: mobile ? 15 : 15, fontWeight: 500 }}>
            {(() => {
              if (tier === "high") return "Your income is not invulnerable. But it is built to absorb a hit without forcing a crisis. That is rare.";
              if (tier === "established") return "Your income is not fragile. But it still depends on a narrow set of conditions staying exactly as they are.";
              if (dominantConstraint === "labor_dependence") return "Your income is not weak because you earn too little. It is weak because too much of it stops when your daily effort stops.";
              if (dominantConstraint === "source_concentration") return "Your income is not weak because it is small. It is weak because too much of it depends on one source continuing to pay.";
              if (dominantConstraint === "forward_visibility") return "Your income is not unstable because you lack skill. It is unstable because you cannot see far enough ahead to plan around a disruption.";
              if (dominantConstraint === "low_continuity") return "Your income is not insecure because of what you earn. It is insecure because almost none of it would continue if you had to stop working tomorrow.";
              if (dominantConstraint === "few_sources") return "Your income is not at risk because of how much you earn. It is at risk because losing any one source would change everything.";
              return "Your income has structural weaknesses that are not visible in your day-to-day earnings. This report makes them visible.";
            })()}
          </p>
        </div>

        {/* ── 3. IN PLAIN ENGLISH — WHY THE SCORE IS WHERE IT IS ── */}
        <div style={{ ...cardStyle, marginBottom: 14 }}>
          <div style={{ ...T.overline, color: B.taupe, marginBottom: 8 }}>IN PLAIN ENGLISH</div>
          <p style={{ ...T.body, color: B.navy, margin: 0, lineHeight: 1.65 }}>
            {v2Explainability?.why_this_score || (() => {
              const ctx = olFamilyLabel ? `As a ${olFamilyLabel.toLowerCase()}${olIndustryLabel ? ` in ${olIndustryLabel}` : ""}, ` : "";
              return isHighScorer ? ({
                C1: `${ctx}your income survives most common disruptions — a slow quarter, a lost mid-tier client. But a ${record.risk_scenario_drop}-point stress test drop means a major hit would still damage your structure.`,
                C2: `${ctx}your income holds up under pressure. You have ${record.income_continuity_months} months of runway and no single-source dependency. The remaining gaps are specific, not structural.`,
                D1: `${ctx}your income can absorb a lost client, an illness, or a market downturn without crisis. ${record.income_continuity_months}+ months of continuity. Focus on maintaining what you have built.`,
                D2: `${ctx}${record.income_continuity_months}+ months of continuity, diversified sources, strong forward visibility. Very few scenarios threaten your structure.`,
              })[subTier] || `${ctx}your income has structural protection. The priority is strengthening specific weak points, not rebuilding.` : ({
                A1: `${ctx}if your main income source changed tomorrow, you have ${continuityDisplay} of runway. This leaves very little margin for unexpected disruptions.`,
                A2: `${ctx}your income is active but structurally exposed. A lost client, a slow month, or 2 weeks off work could create significant financial pressure. You have ${continuityDisplay} of runway.`,
                A3: `${ctx}you have a starting foundation, but a ${record.risk_scenario_drop}-point stress test drop means one unexpected change sets you back hard.`,
                B1: `${ctx}your income is developing. You could absorb a minor hit, but losing your biggest source would drop your score by ${record.risk_scenario_drop} points. You are ${nextBandThreshold - score} points away from Established Stability. That gap is realistic to close.`,
                B2: `${ctx}you are ${nextBandThreshold - score} points from the next band. Your income handles small bumps but a sustained disruption — 60+ days of reduced income — would create real pressure.`,
              })[subTier] || `${ctx}your income is developing. ${nextBandThreshold - score} points from the next band.`;
            })()}
          </p>
          {v2Explainability?.why_not_higher && (
            <p style={{ ...T.small, color: B.muted, margin: "8px 0 0", lineHeight: 1.55 }}>
              <span style={{ fontWeight: 600 }}>Why not higher:</span> {v2Explainability.why_not_higher}
            </p>
          )}
        </div>

        {/* ── 4. BIGGEST THING HOLDING IT DOWN ── */}
        <div style={{ backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderLeft: `3px solid ${B.purple}`, borderRadius: 4, padding: "16px 20px", marginBottom: 14 }}>
          <div style={{ ...T.overline, color: B.purple, marginBottom: 8 }}>THE SINGLE BIGGEST THING HOLDING YOUR SCORE DOWN</div>
          <p style={{ ...T.body, color: B.navy, margin: "0 0 12px", lineHeight: 1.6 }}>
            {dominantConstraintPlain[dominantConstraint] ? dominantConstraintPlain[dominantConstraint].charAt(0).toUpperCase() + dominantConstraintPlain[dominantConstraint].slice(1) + "." : "A structural weakness is limiting your score."}
          </p>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" as const }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ ...T.meta, color: B.taupe, fontWeight: 600, marginBottom: 4 }}>What to change first</div>
              <div style={{ ...T.body, color: B.navy, margin: 0 }}>
                {v2Sensitivity?.tests?.[0]?.delta_description || (v2Lift?.highest_single_lift?.label ? `${v2Lift.highest_single_lift.label}.` : `Reduce ${dominantConstraintPlain[dominantConstraint]}.`)}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ ...T.meta, color: B.taupe, fontWeight: 600, marginBottom: 4 }}>What that would do</div>
              <div style={{ ...T.body, color: B.navy, margin: 0 }}>
                {v2Sensitivity?.tests?.[0] ? `${v2Sensitivity.tests[0].original_score} → ${v2Sensitivity.tests[0].projected_score} (+${v2Sensitivity.tests[0].lift} points)` : v2Lift?.highest_single_lift ? `${score} → ${v2Lift.highest_single_lift.projected_score} (+${v2Lift.highest_single_lift.lift} points)` : `Estimated improvement available.`}
              </div>
            </div>
          </div>
        </div>

        {/* ── 5. HOW FAR FROM STRONGER STABILITY ── */}
        {nextBandName && (
          <div style={{ ...cardStyle, marginBottom: 14 }}>
            <div style={{ ...T.overline, color: B.teal, marginBottom: 8 }}>HOW FAR FROM STRONGER STABILITY</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: B.navy }}>{distanceToNext}</span>
              <span style={{ ...T.body, color: B.navy }}>points to {nextBandName} Stability</span>
            </div>
            <div style={{ display: "flex", gap: 2, height: 6, marginBottom: 8 }}>
              <div style={{ width: `${score}%`, backgroundColor: bandColor, borderRadius: "3px 0 0 3px" }} />
              <div style={{ width: `${distanceToNext}%`, backgroundColor: B.stone, borderRadius: "0 3px 3px 0" }} />
            </div>
            <p style={{ ...T.small, color: B.muted, margin: 0, lineHeight: 1.55 }}>
              {bandDistance === "CLOSE" ? "You are close. One structural change could move you into the next band."
                : bandDistance === "MODERATE" ? "This gap is closeable. The constraint above is the fastest path."
                : "This will take more than one change — but the constraint above is where to start."}
            </p>
          </div>
        )}
        {tier === "high" && (
          <div style={{ ...cardStyle, marginBottom: 14 }}>
            <div style={{ ...T.overline, color: B.teal, marginBottom: 8 }}>STABILITY POSITION</div>
            <p style={{ ...T.body, color: B.navy, margin: 0, lineHeight: 1.6 }}>You are in the highest stability band. The remaining pages show what is working, what could still improve, and how to maintain this position.</p>
          </div>
        )}

        {/* ── PRESSUREMAP™ — YOUR STRUCTURE + CURRENT CONDITIONS ── */}
        {record.pressure_map && (
          <div style={{ ...cardStyle, marginTop: 12, borderLeft: `3px solid ${B.purple}`, background: "rgba(75,63,174,0.02)" }}>
            <div style={{ marginBottom: 12 }}>
              <Overline>PressureMap&#8482;</Overline>
              <p style={{ ...T.meta, color: B.muted, margin: "4px 0 0", lineHeight: 1.4 }}>
                Your structure as a {record.pressure_map.operating_structure?.toLowerCase()}{record.pressure_map.income_model ? ` earning through ${record.pressure_map.income_model.toLowerCase()}` : ""}{record.pressure_map.industry ? ` in ${record.pressure_map.industry}` : ""} — matched against current conditions.
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ ...T.overline, color: "#DC4A4A", marginBottom: 4, fontSize: 10 }}>WHAT IS MOST LIKELY TO DISRUPT YOU RIGHT NOW</div>
              <p style={{ ...T.small, color: B.navy, lineHeight: 1.6, margin: 0 }}>{record.pressure_map.pressure}</p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ ...T.overline, color: B.teal, marginBottom: 4, fontSize: 10 }}>WHAT IS WORKING IN YOUR FAVOR</div>
              <p style={{ ...T.small, color: B.navy, lineHeight: 1.6, margin: 0 }}>{record.pressure_map.tailwind}</p>
            </div>

            <div>
              <div style={{ ...T.overline, color: B.purple, marginBottom: 4, fontSize: 10 }}>HIGHEST-LEVERAGE MOVE RIGHT NOW</div>
              <p style={{ ...T.small, color: B.navy, lineHeight: 1.6, margin: 0 }}>{record.pressure_map.leverage_move}</p>
            </div>

            <div style={{ marginTop: 12, paddingTop: 8, borderTop: `1px solid ${B.stone}` }}>
              <p style={{ ...T.meta, color: B.taupe, margin: 0, fontStyle: "italic", lineHeight: 1.4 }}>
                PressureMap&#8482; reflects current conditions applied to your structural profile. It does not affect your score.
              </p>
            </div>
          </div>
        )}

        <PageFooter section="Your Score &amp; Structural Diagnosis" page={1} />
    </>,

    // Page 2: Income Structure
    <>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 8 }}>How Your Income Actually Works</h1>
        <p style={{ fontSize: 16, color: B.muted, maxWidth: 540, marginBottom: 20 }}>Where your income actually comes from, what repeats, and what disappears the moment you stop.</p>

        {/* ── KILLER LINE ── */}
        <div style={{ backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderLeft: `2px solid ${B.navy}`, borderRadius: 6, padding: mobile ? "14px 16px" : "20px 24px", marginBottom: 20, textAlign: "center" }}>
          <p style={{ ...T.body, color: B.navy, margin: 0, lineHeight: 1.7, fontSize: mobile ? 15 : 16, fontWeight: 500 }}>
            {record.active_income_level + record.semi_persistent_income_level >= 80
              ? `${record.active_income_level + record.semi_persistent_income_level}% of your income still requires you to keep re-earning it.`
              : record.active_income_level >= 50
                ? `${record.active_income_level}% of your income is earned once and stops. It does not repeat, renew, or survive interruption.`
                : `${100 - record.active_income_level}% of your income continues without your daily effort. That is uncommon structural protection.`}
          </p>
        </div>

        {/* ── INCOME STRUCTURE BAR ── */}
        <Overline large>How Your Income Breaks Down</Overline>
        <div style={{ display: "flex", gap: 2, height: 8, marginBottom: 12, marginTop: 4 }}>
          <div style={{ width: `${record.active_income_level}%`, backgroundColor: B.navy, borderRadius: 1 }} />
          <div style={{ width: `${record.semi_persistent_income_level}%`, backgroundColor: B.taupe, borderRadius: 1 }} />
          <div style={{ width: `${record.persistent_income_level}%`, backgroundColor: B.teal, borderRadius: 1 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {[
            { label: "Earned once, stops when you stop", pct: record.active_income_level, color: B.ink },
            { label: "Repeats on its own (retainers, subscriptions, contracts)", pct: record.semi_persistent_income_level, color: B.taupe },
            { label: "Survives interruption entirely", pct: record.persistent_income_level, color: B.teal },
          ].map((seg) => (
            <div key={seg.label}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 1, backgroundColor: seg.color, flexShrink: 0 }} />
                <span style={{ ...T.small, fontWeight: 500, color: B.navy }}>{seg.pct}% — {seg.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── STRUCTURAL EXPOSURE ── */}
        <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 14, marginBottom: 20 }}>
          <div style={{ flex: mobile ? undefined : 3, ...cardStyle }}>
            <Overline>IF YOUR BIGGEST SOURCE GOES AWAY</Overline>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
              <span style={{ ...T.cardHero, color: B.navy }}>{record.final_score}<span style={{ ...T.meta, color: B.taupe }}>/100</span></span>
              <span style={{ ...T.sectionLabel, color: B.taupe }}>→</span>
              <span style={{ ...T.cardHero, color: B.bandLimited }}>{Math.max(0, record.risk_scenario_score)}<span style={{ ...T.meta, color: B.taupe }}>/100</span></span>
            </div>
            <p style={{ ...T.small, color: B.muted, margin: 0 }}>
              {record.risk_scenario_drop}-point drop.{record.risk_scenario_drop > score * 0.4 ? " That is a severe dependency on a single source." : ""}
            </p>
          </div>
          <div style={{ flex: mobile ? undefined : 2, ...cardStyle }}>
            <Overline>IF YOU STOP WORKING ENTIRELY</Overline>
            <div style={{ ...T.cardHero, color: B.navy, marginBottom: 8 }}>{continuityDisplay}</div>
            <p style={{ ...T.small, color: B.muted, margin: 0 }}>
              {record.income_continuity_months < 1 ? "Your income stops almost immediately." : record.income_continuity_months < 3 ? "Very little runway before income pressure begins." : record.income_continuity_months < 6 ? "Some runway, but not enough to absorb a serious disruption." : "Meaningful buffer before income pressure begins."}
            </p>
          </div>
        </div>

        <SectionDivider />

        {/* ── STRUCTURAL INDICATORS — RANKED HIERARCHY ── */}
        {v2Indicators && v2Indicators.length > 0 && (() => {
          const sorted = [...v2Indicators].sort((a, b) => a.normalized_value - b.normalized_value);
          const weakest = sorted[0];
          const strongest = sorted[sorted.length - 1];
          const mostDangerous = sorted.find(ind => ind.level === "critical") || sorted.find(ind => ind.level === "weak") || weakest;
          const rankItems: { role: string; roleColor: string; ind: typeof weakest; explanation: string }[] = [];

          if (strongest && strongest.key !== weakest.key) {
            rankItems.push({
              role: "STRONGEST FACTOR",
              roleColor: B.teal,
              ind: strongest,
              explanation: "This is what is holding your structure together.",
            });
          }
          rankItems.push({
            role: "WEAKEST FACTOR",
            roleColor: B.bandLimited,
            ind: weakest,
            explanation: "This is the biggest structural gap in your income.",
          });
          if (mostDangerous && mostDangerous.key !== weakest.key) {
            rankItems.push({
              role: "MOST DANGEROUS FACTOR",
              roleColor: "#DC4A4A",
              ind: mostDangerous,
              explanation: "This is the factor most likely to cause damage if conditions change.",
            });
          }

          return (
            <div style={{ marginBottom: 20 }}>
              <Overline large>What The Structure Reveals</Overline>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {rankItems.map(({ role, roleColor, ind, explanation }) => {
                  const levelColor = ind.level === "critical" || ind.level === "weak" ? B.bandLimited : ind.level === "moderate" ? B.bandDeveloping : ind.level === "strong" ? B.bandEstablished : B.bandHigh;
                  return (
                    <div key={role} style={{ ...cardStyle, padding: "12px 16px", borderLeft: `3px solid ${roleColor}` }}>
                      <div style={{ ...T.overline, color: roleColor, marginBottom: 6, fontSize: 10 }}>{role}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ ...T.sectionLabel, color: B.navy }}>{ind.label}</span>
                        <span style={{ ...T.micro, color: levelColor, textTransform: "capitalize" }}>{ind.level}</span>
                      </div>
                      <div style={{ height: 4, backgroundColor: B.stone, borderRadius: 2, marginBottom: 6 }}>
                        <div style={{ height: 4, backgroundColor: levelColor, borderRadius: 2, width: `${ind.normalized_value}%`, transition: "width 600ms ease" }} />
                      </div>
                      <p style={{ ...T.meta, color: B.muted, margin: 0, lineHeight: 1.4 }}>{explanation}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ── WHAT'S WORKING / WHAT'S HOLDING YOU BACK ── */}
        {v2Explainability && (v2Explainability.strongest_supports?.length || v2Explainability.strongest_suppressors?.length) && (
          <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 14, marginBottom: 16 }}>
            {v2Explainability.strongest_supports && v2Explainability.strongest_supports.length > 0 && (
              <div style={{ flex: 1, ...cardStyle, borderLeft: `3px solid ${B.teal}` }}>
                <div style={{ ...T.overline, color: B.teal, marginBottom: 8 }}>WHAT&apos;S WORKING</div>
                {v2Explainability.strongest_supports.slice(0, 2).map((s, i) => (
                  <p key={i} style={{ ...T.small, color: B.navy, margin: i > 0 ? "6px 0 0" : 0, lineHeight: 1.5 }}>{s}</p>
                ))}
              </div>
            )}
            {v2Explainability.strongest_suppressors && v2Explainability.strongest_suppressors.length > 0 && (
              <div style={{ flex: 1, ...cardStyle, borderLeft: `3px solid ${B.bandLimited}` }}>
                <div style={{ ...T.overline, color: B.bandLimited, marginBottom: 8 }}>WHAT&apos;S HOLDING YOU BACK</div>
                {v2Explainability.strongest_suppressors.slice(0, 2).map((s, i) => (
                  <p key={i} style={{ ...T.small, color: B.navy, margin: i > 0 ? "6px 0 0" : 0, lineHeight: 1.5 }}>{s}</p>
                ))}
              </div>
            )}
          </div>
        )}

        <PageFooter section="How Your Income Actually Works" page={2} />
    </>,

    // Page 3: Risks
    <>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 8 }}>Fragility &amp; Pressure Test</h1>
        <p style={{ fontSize: 16, color: B.muted, maxWidth: 540, marginBottom: 16 }}>The specific disruptions your income structure is most exposed to — ranked by how much damage they would do.</p>

        {/* ── HARD DIAGNOSTIC SENTENCE ── */}
        <div style={{ backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderLeft: `2px solid ${B.navy}`, borderRadius: 6, padding: mobile ? "14px 16px" : "20px 24px", marginBottom: 20, textAlign: "center" }}>
          <p style={{ ...T.body, color: B.navy, margin: 0, lineHeight: 1.7, fontSize: mobile ? 15 : 16, fontWeight: 500 }}>
            {(() => {
              const fc = v2Fragility?.fragility_class;
              if (fc === "brittle") return "A single disruption — one lost client, one slow month — could force a structural crisis. That is not a risk scenario. That is your current exposure.";
              if (fc === "thin") return "You can likely absorb one mild setback. Two close together would create pressure fast.";
              if (fc === "uneven") return "Parts of your income are well-protected. Other parts are not. That unevenness is where risk hides.";
              if (fc === "supported") return "Most common disruptions would not break your structure. But the scenarios below show where your limits are.";
              if (fc === "resilient") return "Your income can take a serious hit. The scenarios below show the few things that could still cause real damage.";
              return "Your income has specific structural exposures. The scenarios below show exactly where they are.";
            })()}
          </p>
        </div>

        {/* ── RANKED RISK SCENARIOS ── */}
        {v2Scenarios && v2Scenarios.length > 0 && (() => {
          const scenarioPlain: Record<string, string> = {
            active_labor_interrupted: "You take two weeks off and have no backup revenue",
            platform_dependency_shock: "One income source changes its terms or access",
            forward_commitments_delayed: "New work arrives later than expected",
            client_concentration_loss: "A major client pauses or ends work",
            market_contraction: "Demand in your industry drops for two or more months",
            regulatory_disruption: "A regulatory or policy change affects how you earn",
            revenue_model_disruption: "Your primary way of earning income stops working",
            high_volatility_month: "You have a slow month with no backup revenue",
            seasonal_revenue_gap: "A seasonal slowdown cuts your income for weeks",
            key_client_loss: "You lose a key client or contract",
            pricing_pressure: "What you can charge drops due to market pressure",
            recurring_stream_degrades: "A repeating income stream weakens or stops",
            referral_pipeline_dries: "New business or referrals dry up for a stretch",
            contract_non_renewal: "A major contract is not renewed",
            scope_reduction: "A client cuts the scope of your work significantly",
          };
          const sorted = [...v2Scenarios].sort((a, b) => b.score_drop - a.score_drop);
          const top = sorted.slice(0, 4);

          return (
            <div style={{ marginBottom: 20 }}>
              <Overline large>Ranked By Damage</Overline>
              {top.map((s, idx) => {
                const title = scenarioPlain[s.scenario_id] ?? s.label
                  .replace(/^Active Labor Interrupted$/i, "You take two weeks off and have no backup revenue")
                  .replace(/^Platform Dependency Shock$/i, "One income source changes its terms or access")
                  .replace(/^Forward Commitments Delayed$/i, "New work arrives later than expected")
                  .replace(/^High Volatility Month$/i, "You have a slow month with no backup revenue")
                  .replace(/^Client Concentration Loss$/i, "A major client pauses or ends work")
                  .replace(/^Market Contraction$/i, "Demand in your industry drops for two or more months")
                  .replace(/^Revenue Model Disruption$/i, "Your primary way of earning income stops working")
                  .replace(/^Seasonal Revenue Gap$/i, "A seasonal slowdown cuts your income for weeks")
                  .replace(/^Key Client Loss$/i, "You lose a key client or contract")
                  .replace(/^Regulatory Disruption$/i, "A regulatory or policy change affects how you earn")
                  .replace(/^Pricing Pressure$/i, "What you can charge drops due to market pressure")
                  .replace(/^Recurring Stream Degrades$/i, "A repeating income stream weakens or stops")
                  .replace(/^Referral Pipeline Dries$/i, "New business or referrals dry up for a stretch")
                  .replace(/^Contract Non.?Renewal$/i, "A major contract is not renewed")
                  .replace(/^Scope Reduction$/i, "A client cuts the scope of your work significantly");
                const safeTitle = (/^[A-Z][a-z]+ [A-Z]/.test(title) && !title.includes("You ") && !title.includes("A ") && !title.includes("Your ") && !title.includes("One ") && !title.includes("New "))
                  ? title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()
                  : title;
                const borderColor = idx === 0 ? B.bandLimited : idx === 1 ? B.bandDeveloping : "rgba(14,26,43,0.12)";
                const olMatch = olSelectedScenarios?.find(os => s.scenario_id.toLowerCase().includes(os.scenario_id.toLowerCase().replace("rs-", "").replace(/-/g, "_")) || os.label.toLowerCase() === s.label?.toLowerCase());
                const narrativeText = olMatch?.why_it_matters || s.narrative;
                return (
                  <div key={s.scenario_id} style={{ ...cardStyle, padding: "16px 20px", marginBottom: 10, borderLeft: `3px solid ${borderColor}` }}>
                    <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", justifyContent: "space-between", alignItems: mobile ? "flex-start" : "center", gap: mobile ? 4 : 0, marginBottom: 4 }}>
                      <span style={{ ...T.sectionLabel, color: B.navy }}>{safeTitle}</span>
                      <span style={{ ...T.small, color: B.navy, flexShrink: 0 }}>
                        {s.original_score} → <span style={{ color: B.bandLimited }}>{s.scenario_score}</span> <span style={{ color: B.muted }}>(−{s.score_drop})</span>
                      </span>
                    </div>
                    {narrativeText && <p style={{ ...T.meta, color: B.muted, margin: "4px 0 0", lineHeight: 1.5 }}>{narrativeText}</p>}
                    {s.band_shift && <p style={{ ...T.meta, color: B.bandLimited, margin: "4px 0 0", fontWeight: 500 }}>This would drop you from {s.original_band} to {s.scenario_band}.</p>}
                  </div>
                );
              })}
            </div>
          );
        })()}

        <SectionDivider />

        {/* ── FRAGILITY — HOW MUCH CAN YOU ABSORB ── */}
        {v2Fragility && (
          <div style={{ ...cardStyle, marginTop: 8, marginBottom: 16 }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>HOW MUCH CAN YOUR INCOME ABSORB?</div>
            <div style={{ ...T.cardHeading, color: v2Fragility.fragility_class === "brittle" || v2Fragility.fragility_class === "thin" ? B.bandLimited : v2Fragility.fragility_class === "resilient" || v2Fragility.fragility_class === "supported" ? B.teal : B.navy, marginBottom: 6 }}>
              {fragilityClassLabel[v2Fragility.fragility_class] || ((v2Fragility.fragility_class || "").charAt(0).toUpperCase() + (v2Fragility.fragility_class || "").slice(1))}
            </div>
            <p style={{ ...T.small, color: B.muted, margin: 0, lineHeight: 1.55 }}>
              {v2Explainability?.fragility_explanation || ((() => {
                return ({
                  brittle: "A single disruption — one lost client, one slow month — could cause your score to collapse. There is no structural buffer.",
                  thin: "You can absorb a minor hit. But two disruptions close together — a lost client followed by a slow month — would create serious pressure.",
                  uneven: "Some parts of your income are well-protected. Others are fully exposed. The danger is that the exposed part gets hit first.",
                  supported: "Your income can absorb most common disruptions without dropping to a lower band. The remaining risks are specific, not structural.",
                  resilient: "Your income can absorb a major client loss or a 90-day work stoppage without structural crisis.",
                })[v2Fragility.fragility_class] ?? "";
              })())}
            </p>
            {v2Fragility.primary_failure_mode && (
              <p style={{ ...T.meta, color: B.muted, margin: "6px 0 0" }}>
                Most likely failure point: {({
                  concentration_collapse: "too much income depends on one source",
                  labor_interruption: "income stops when your work stops",
                  visibility_gap: "no income is secured ahead of time",
                  durability_thinness: "repeating income is fragile and could end",
                })[v2Fragility.primary_failure_mode] ?? v2Fragility.primary_failure_mode}.
              </p>
            )}
          </div>
        )}

        {/* ── PATTERN TO WATCH ── */}
        {v2BehavioralInsights && v2BehavioralInsights.length > 0 && (
          <div style={{ ...cardStyle, marginBottom: 16, borderLeft: `3px solid ${B.bandDeveloping}` }}>
            <div style={{ ...T.overline, color: B.bandDeveloping, marginBottom: 6 }}>PATTERN TO WATCH</div>
            <p style={{ ...T.small, color: B.navy, margin: 0, lineHeight: 1.55, fontWeight: 500 }}>{v2BehavioralInsights[0].pattern}</p>
            <p style={{ ...T.meta, color: B.muted, margin: "4px 0 0", lineHeight: 1.5 }}>{v2BehavioralInsights[0].consequence}</p>
            {v2BehavioralInsights[0].reframe && (
              <p style={{ ...T.meta, color: B.teal, margin: "4px 0 0", lineHeight: 1.5, fontWeight: 500 }}>{v2BehavioralInsights[0].reframe}</p>
            )}
          </div>
        )}

        <PageFooter section="Fragility &amp; Pressure Test" page={3} />
    </>,

    // Page 4: Action Plan
    <>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 8 }}>Your Highest-Leverage Action Plan</h1>
        <p style={{ fontSize: 16, color: B.muted, maxWidth: 540, marginBottom: 20 }}>Not just what could improve — how to decide which change to make first.</p>

        {/* ── DECISION FRAMEWORK — CATEGORIZED IMPROVEMENTS ── */}
        {v2Lift && v2Lift.lift_scenarios.length > 0 && (() => {
          const viable = v2Lift.lift_scenarios.filter(s => s.lift > 0).sort((a, b) => b.lift - a.lift);
          if (viable.length === 0) return null;

          // Concrete action descriptions per scenario type
          const liftConcrete: Record<string, { title: string; how: string }> = {
            reduce_labor_dependence: { title: "Reduce how much income requires your daily effort", how: "Convert active services into retainers, productized packages, or licensed deliverables that generate revenue without your direct involvement each time." },
            reduce_active_dependence: { title: "Reduce how much income requires your daily effort", how: "Convert active services into retainers, productized packages, or licensed deliverables that generate revenue without your direct involvement each time." },
            extend_forward_visibility: { title: "Lock in revenue before each month starts", how: "Move clients to retainers, prepaid packages, recurring service plans, or standing agreements. Even partial forward commitments reduce structural exposure." },
            improve_forward_secured: { title: "Lock in revenue before each month starts", how: "Move clients to retainers, prepaid packages, recurring service plans, or standing agreements. Even partial forward commitments reduce structural exposure." },
            reduce_concentration: { title: "Reduce dependence on your largest income source", how: "Add one new client, contract, or revenue stream that could reach 15%+ of your income within 90 days. The goal is not to replace, but to rebalance." },
            reduce_largest_source: { title: "Reduce dependence on your largest income source", how: "Add one new client, contract, or revenue stream that could reach 15%+ of your income within 90 days. The goal is not to replace, but to rebalance." },
            increase_persistence: { title: "Build income that repeats without re-selling", how: "Introduce subscriptions, maintenance contracts, licensing fees, or membership models where revenue renews automatically unless cancelled." },
            increase_persistent_revenue: { title: "Build income that repeats without re-selling", how: "Introduce subscriptions, maintenance contracts, licensing fees, or membership models where revenue renews automatically unless cancelled." },
            strengthen_persistence: { title: "Build income that repeats without re-selling", how: "Introduce subscriptions, maintenance contracts, licensing fees, or membership models where revenue renews automatically unless cancelled." },
            add_income_sources: { title: "Add more independent income sources", how: "Identify one adjacent service, product, or client type that operates on a different cycle or serves a different market from your primary source." },
            diversify_sources: { title: "Spread income across more independent sources", how: "Identify one adjacent service, product, or client type that operates on a different cycle or serves a different market from your primary source." },
            reduce_variability: { title: "Smooth out month-to-month income swings", how: "Shift project-based work toward retainers or phased billing. Offer clients quarterly or annual pricing in exchange for commitment." },
            increase_continuity: { title: "Extend how long income would last if you stopped working", how: "Build at least one income stream that would keep producing for 3+ months independently — recurring contracts, digital products, or licensing arrangements." },
            extend_continuity: { title: "Extend how long income would last if you stopped working", how: "Build at least one income stream that would keep producing for 3+ months independently — recurring contracts, digital products, or licensing arrangements." },
          };

          // Categorize: fastest = highest lift, easiest = smallest change_description or lowest lift barrier
          const fastest = viable[0];
          const easiest = viable.length > 1 ? viable[viable.length - 1] : null;
          const mostDurable = viable.find(s => s.scenario_id.includes("persist") || s.scenario_id.includes("continuity") || s.scenario_id.includes("labor"));

          const categories: { tag: string; tagColor: string; scenario: typeof fastest }[] = [
            { tag: "FASTEST IMPROVEMENT", tagColor: B.purple, scenario: fastest },
          ];
          if (easiest && easiest.scenario_id !== fastest.scenario_id) {
            categories.push({ tag: "EASIEST TO START", tagColor: B.teal, scenario: easiest });
          }
          if (mostDurable && mostDurable.scenario_id !== fastest.scenario_id && mostDurable.scenario_id !== easiest?.scenario_id) {
            categories.push({ tag: "MOST DURABLE CHANGE", tagColor: B.navy, scenario: mostDurable });
          }

          return (
            <div style={{ marginBottom: 20 }}>
              <Overline large>How To Decide What To Change</Overline>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {categories.map(({ tag, tagColor, scenario }) => {
                  const concrete = liftConcrete[scenario.scenario_id];
                  const title = concrete?.title ?? scenario.label;
                  const how = concrete?.how ?? scenario.change_description ?? "";
                  return (
                    <div key={tag} style={{ ...cardStyle, padding: "16px 20px", borderLeft: `3px solid ${tagColor}` }}>
                      <div style={{ ...T.overline, color: tagColor, marginBottom: 6, fontSize: 10 }}>{tag}</div>
                      <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 4 }}>{title}</div>
                      {how && <p style={{ ...T.small, color: B.muted, margin: "0 0 8px", lineHeight: 1.55 }}>{how}</p>}
                      <div style={{ ...T.small, color: B.teal, fontWeight: 500 }}>
                        {scenario.original_score} → {scenario.projected_score} (+{scenario.lift} points){scenario.band_shift ? ` — moves you to ${scenario.projected_band}` : ""}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ── IF YOU DID BOTH ── */}
        {v2Lift?.combined_top_two && v2Lift.combined_top_two.lift > 0 && (
          <div style={{ ...cardStyle, marginBottom: 14, borderLeft: `3px solid ${B.teal}` }}>
            <div style={{ ...T.overline, color: B.teal, marginBottom: 6 }}>IF YOU DID BOTH</div>
            <p style={{ ...T.small, color: B.navy, margin: 0, lineHeight: 1.55 }}>
              Combining the top two changes would raise your score to approximately <span style={{ fontWeight: 700 }}>{v2Lift.combined_top_two.projected_score}</span> (+{v2Lift.combined_top_two.lift} points).{v2Lift.combined_top_two.band_shift ? ` This would move you to ${v2Lift.combined_top_two.projected_band}.` : ""}
            </p>
            {v2Explainability?.best_lift_explanation && (
              <p style={{ ...T.meta, color: B.muted, margin: "6px 0 0", lineHeight: 1.5 }}>{v2Explainability.best_lift_explanation}</p>
            )}
          </div>
        )}

        <SectionDivider />

        {/* ── TRADEOFFS ── */}
        {v2TradeoffNarratives && v2TradeoffNarratives.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Overline large>Tradeoffs to Understand</Overline>
            {v2TradeoffNarratives.slice(0, 1).map((t, i) => (
              <div key={i} style={{ ...cardStyle, marginBottom: 8 }}>
                <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 6 }}>{t.action_label}</div>
                <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: mobile ? 12 : 8 }}>
                  <div style={{ flex: mobile ? undefined : 1 }}><div style={{ ...T.meta, color: B.teal, fontWeight: 600, marginBottom: 4 }}>THE UPSIDE</div><p style={{ ...T.meta, color: B.muted, margin: 0, lineHeight: 1.5 }}>{t.upside}</p></div>
                  <div style={{ flex: mobile ? undefined : 1 }}><div style={{ ...T.meta, color: B.bandDeveloping, fontWeight: 600, marginBottom: 4 }}>THE COST</div><p style={{ ...T.meta, color: B.muted, margin: 0, lineHeight: 1.5 }}>{t.downside}</p></div>
                </div>
                <div style={{ borderTop: `1px solid ${B.stone}`, marginTop: 8, paddingTop: 6 }}><p style={{ ...T.meta, color: B.navy, margin: 0, fontWeight: 500 }}>{t.net_recommendation}</p></div>
              </div>
            ))}
          </div>
        )}

        {/* ── WHAT TO AVOID ── */}
        {((v2AvoidActions && v2AvoidActions.length > 0) || (olAvoid && olAvoid.length > 0)) && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ ...T.sectionLabel, color: B.bandLimited, marginBottom: 8 }}>What to avoid</div>
            {(v2AvoidActions ?? []).slice(0, 1).map((a) => (
              <div key={a.action_id} style={{ ...T.small, color: B.muted, marginBottom: 4 }}>— <span style={{ fontWeight: 500 }}>{a.label}:</span> {a.reason}</div>
            ))}
            {(olAvoid ?? []).slice(0, 1).map((text) => (
              <div key={text} style={{ ...T.small, color: B.muted, marginBottom: 4 }}>— {text}</div>
            ))}
          </div>
        )}

        {/* ── WEEK-BY-WEEK ROADMAP ── */}
        {v2ExecutionRoadmap && v2ExecutionRoadmap.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <SectionDivider />
            <Overline large>Week-by-Week Roadmap</Overline>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {v2ExecutionRoadmap.slice(0, 4).map((w, i) => (
                <div key={i} style={{ ...cardStyle, padding: "14px 18px" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ ...T.micro, color: B.purple, minWidth: mobile ? 60 : 70, flexShrink: 0 }}>{w.week}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...T.small, fontWeight: 600, color: B.navy, marginBottom: 2 }}>{w.action}</div>
                      <p style={{ ...T.meta, color: B.muted, margin: 0, lineHeight: 1.5 }}>{w.detail}</p>
                      {w.success_metric && <p style={{ ...T.meta, color: B.teal, margin: "4px 0 0", fontWeight: 500 }}>Target: {w.success_metric}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RETAKE TIMING ── */}
        <SectionDivider />
        <div style={{ ...cardStyle, marginBottom: 14 }}>
          <Overline>WHEN TO RETAKE THIS ASSESSMENT</Overline>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
            <div style={{ ...T.cardHeading, color: B.navy }}>{reassessDate}</div>
            <div style={{ ...T.small, color: B.purple, fontWeight: 600 }}>{reassessDaysLeft} days from now</div>
          </div>
          <p style={{ ...T.meta, color: B.muted, margin: 0, lineHeight: 1.5 }}>Retake after real structural change — a new retainer signed, a source added, a dependency reduced. Not after a good month. Typically {tier === "limited" ? "2" : tier === "high" ? "6" : "3"} months.</p>
          {olTriggers && olTriggers.length > 0 && (
            <div style={{ marginTop: 8 }}>
              {olTriggers.slice(0, 3).map((t) => (
                <div key={t.trigger_id} style={{ ...T.meta, color: B.muted, display: "flex", gap: 6, marginBottom: 2 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: B.purple, marginTop: 6, flexShrink: 0 }} />
                  {t.display_text}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── COMPACT METHODOLOGY FOOTER ── */}
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${B.stone}` }}>
          <p style={{ ...T.meta, color: B.taupe, margin: 0, lineHeight: 1.5, fontStyle: "italic" }}>
            Scored by Model RP-2.0 — a deterministic system using fixed rules and weights. No machine learning, no financial account access, no subjective judgment. Same inputs always produce the same score. Full methodology at runpayway.com/methodology. This is a present-state structural assessment, not financial advice.
          </p>
        </div>

        <PageFooter section="Your Highest-Leverage Action Plan" page={4} />
    </>,

  ];

  return (
    <ReportErrorBoundary>
    {/* On-screen paginated view */}
    <div id="paginated-view" style={{ maxWidth: PDF.captureW, margin: "0 auto", padding: "0 0 80px" }}>
      <div ref={pageContainerRef} style={{ minHeight: "60vh" }}>
        <div className="report-page" style={{ backgroundColor: "#FFFFFF", borderRadius: mobile ? 0 : 8, padding: mobile ? "24px 16px" : "32px 36px", border: mobile ? "none" : "1px solid rgba(14,26,43,0.06)", boxShadow: mobile ? "none" : "0 2px 12px rgba(14,26,43,0.04)" }}>
          {pageContents[currentPage]}
        </div>
      </div>

      {/* Fixed bottom navigation bar */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        backgroundColor: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(14,26,43,0.08)",
        padding: mobile ? "10px 12px" : "12px 24px",
        zIndex: 100,
        display: "flex", justifyContent: "center", alignItems: "center", gap: mobile ? 8 : 24,
      }}>
        {/* Download PDF — hide on mobile to save space */}
        {!mobile && (
          <button
            onClick={handleDownload}
            disabled={downloading}
            style={{
              background: "none", border: "none", cursor: downloading ? "default" : "pointer",
              fontSize: 13, color: "rgba(14,26,43,0.58)",
              padding: "8px 12px", fontWeight: 500,
            }}
          >
            {downloading ? "Generating..." : "Download PDF"}
          </button>
        )}

        {/* Left arrow */}
        <button
          onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
          disabled={currentPage === 0}
          style={{
            background: "none", border: "none", cursor: currentPage === 0 ? "default" : "pointer",
            fontSize: mobile ? 16 : 18, color: currentPage === 0 ? "rgba(14,26,43,0.15)" : "#0E1A2B",
            padding: mobile ? "8px 8px" : "8px 12px",
          }}
          aria-label="Previous page"
        >
          ←
        </button>

        {/* Page dots */}
        <div style={{ display: "flex", gap: mobile ? 6 : 8, alignItems: "center" }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              style={{
                width: currentPage === i ? (mobile ? 18 : 24) : (mobile ? 6 : 8),
                height: mobile ? 6 : 8,
                borderRadius: 4,
                backgroundColor: currentPage === i ? "#0E1A2B" : "rgba(14,26,43,0.15)",
                border: "none",
                cursor: "pointer",
                transition: "all 200ms ease",
                padding: 0,
              }}
              aria-label={`Go to page ${i === 0 ? "Cover" : i}`}
            />
          ))}
        </div>

        {/* Page label */}
        <span style={{ fontSize: mobile ? 12 : 13, color: "#0E1A2B", fontWeight: 500 }}>{pageNames[currentPage]}</span>

        {/* Right arrow */}
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={currentPage === totalPages - 1}
          style={{
            background: "none", border: "none", cursor: currentPage === totalPages - 1 ? "default" : "pointer",
            fontSize: mobile ? 16 : 18, color: currentPage === totalPages - 1 ? "rgba(14,26,43,0.15)" : "#0E1A2B",
            padding: mobile ? "8px 8px" : "8px 12px",
          }}
          aria-label="Next page"
        >
          →
        </button>
      </div>
    </div>
    </ReportErrorBoundary>
  );
}
