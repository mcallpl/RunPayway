"use client";

import { useEffect, useState, useRef, Component, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoBlue from "../../../../public/runpayway-logo-blue.png";
import { useAssessmentServer } from "@/lib/monitoring";
import { generateTailoredCopy } from "@/lib/industry-tailoring";

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
        <span style={{ fontSize: 9.5, fontWeight: 500, color: B.taupe }}>Page {page} of 3</span>
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
  const totalPages = 4; // cover + 3 pages
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

  // Protect against accidental navigation — back button and tab close
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    const onPopState = () => {
      // Push state back to prevent back navigation
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

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

    // Keep rp_record in localStorage permanently for report recovery
    // Do NOT delete rp_purchase_session or rp_profile — customer may need to return

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
  const aiPlan = v2?.ai_action_plan as Record<string, string> | undefined;

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

  // ── Industry-tailored copy (no API — deterministic) ──
  const v2ni = v2?.normalized_inputs as Record<string, number | string> | undefined;
  const tailored = generateTailoredCopy({
    industry: industrySector,
    structure: structureDesc,
    incomeModel: incomeModelDesc,
    score,
    tier,
    activeIncome: record.active_income_level,
    concentration: (v2ni?.largest_source_pct as number) || record.risk_scenario_drop,
    recurrence: (v2ni?.income_persistence_pct as number) || 0,
    forwardVisibility: (v2ni?.forward_secured_pct as number) || 0,
    laborDependence: (v2ni?.labor_dependence_pct as number) || 0,
    continuityMonths: record.income_continuity_months,
    dominantConstraint,
  });

  const cleanScenarioTitle = (title: string): string => {
    const map: Record<string, string> = {
      "Active Labor Interrupted": "You are unable to work for an extended period",
      "Platform Dependency Shock": "A major income source changes terms or access",
      "Forward Commitments Delayed": "Expected income arrives later than planned",
      "Client Concentration Loss": "Your largest client stops paying",
      "Market Contraction": "Demand in your industry drops significantly",
      "High Volatility Month": "You have a slow month with no backup revenue",
      "Key Client Loss": "You lose a key client or contract",
      "Revenue Model Disruption": "Your primary income model stops working",
      "Seasonal Revenue Gap": "Seasonal slowdown cuts your income",
      "Pricing Pressure": "What you can charge drops due to market pressure",
      "Recurring Stream Degrades": "A repeating income stream weakens or stops",
      "Referral Pipeline Dries": "New business or referrals dry up",
      "Contract Non Renewal": "A major contract is not renewed",
      "Scope Reduction": "A client cuts the scope of your work",
      "Regulatory Disruption": "A regulatory change affects how you earn",
    };
    for (const [key, val] of Object.entries(map)) {
      if (title.toLowerCase().includes(key.toLowerCase().split(" ")[0].toLowerCase())) return val;
    }
    return title.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2");
  };

  const cleanConstraintText = (text: string): string => {
    return text
      .replace(/-?\d+\s*labor[_\s]dependence[_\s]?%?/gi, "Reduce labor dependence")
      .replace(/-?\d+\s*income[_\s]persistence[_\s]?%?/gi, "Increase recurring income")
      .replace(/-?\d+\s*largest[_\s]source[_\s]?%?/gi, "Reduce largest source concentration")
      .replace(/-?\d+\s*forward[_\s]secured[_\s]?%?/gi, "Increase forward visibility")
      .replace(/labor_dependence_pct/gi, "labor dependence")
      .replace(/income_persistence_pct/gi, "recurring income")
      .replace(/largest_source_pct/gi, "largest source share")
      .replace(/forward_secured_pct/gi, "forward visibility")
      .replace(/source_diversity_count/gi, "number of income sources");
  };

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

  const handleDownload = () => {
    window.print();
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
  const pageNames = ["Cover", "Key Findings", "Action Plan", "Stress Test"];


  // ── Paginated page contents (shared between PDF container and on-screen view) ──
  const pageContents: ReactNode[] = [
    // Page 0: Cover
    <>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: mobile ? 420 : "auto", textAlign: "center", padding: mobile ? "0 8px" : "60px 0 40px" }}>
          <Image src={logoBlue} alt="RunPayway&#8482;" width={mobile ? 140 : 180} height={21} style={{ height: "auto", marginBottom: mobile ? 20 : 44 }} />
          <div style={{ width: mobile ? "80%" : "60%", height: 1, backgroundColor: B.stone, marginBottom: mobile ? 20 : 48 }} />

          <div style={{ ...T.pageTitle, fontSize: mobile ? 22 : 30, fontWeight: 700, marginBottom: 4 }}>Income Stability Report</div>
          <div style={{ ...T.sectionTitle, fontSize: mobile ? 16 : 20, fontWeight: 600, color: B.teal, marginBottom: 6 }}>Your Path to Financial Resilience</div>
          <div style={{ ...T.small, color: B.muted, marginBottom: mobile ? 16 : 10 }}>Your Personalized Income Stability Score</div>

          <div style={{ fontSize: mobile ? 18 : 22, fontWeight: 500, color: B.navy, marginBottom: 4 }}>{record.assessment_title}</div>
          <div style={{ ...T.meta, color: B.muted, marginBottom: mobile ? 12 : 20 }}>{formalDate}</div>
          <div style={{ ...T.meta, color: B.taupe, marginBottom: mobile ? 16 : 28 }}>RunPayway&#8482; &mdash; Structural Assessment for Sustainable Income</div>

          {/* Score block */}
          <div style={{ marginBottom: 12 }}>
            <span style={{ ...T.score, fontSize: mobile ? 56 : 64, color: B.navy }}>{record.final_score}</span>
            <span style={{ fontSize: mobile ? 18 : 24, fontWeight: 400, color: B.taupe }}>/100</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: bandColor }} />
            <div style={{ ...T.classification, color: bandColor }}>Stability Level: {record.stability_band}</div>
          </div>
          {nextBandName && (
            <div style={{ ...T.body, color: B.teal, fontWeight: 600, marginBottom: mobile ? 16 : 28 }}>Improvement Potential: {distanceToNext} points to {nextBandName} Stability</div>
          )}
          {tier === "high" && (
            <div style={{ ...T.body, color: B.teal, fontWeight: 600, marginBottom: mobile ? 16 : 28 }}>You are in the highest stability band.</div>
          )}

          {/* Simulator access code */}
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

          <div style={{ ...T.meta, color: B.taupe, marginTop: 24 }}>Model RP-2.0 &middot; 3 Pages &middot; Confidential</div>
        </div>
    </>,

    // Page 1: Key Findings
    <>
        <ReportHeader />

        {/* ── SCORE HEADER ── */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ ...T.overline, color: B.teal, marginBottom: 12, letterSpacing: "0.14em" }}>RUNPAYWAY&#8482; INCOME STABILITY SCORE&#8482;</div>
          <h1 style={{ ...T.pageTitle, marginBottom: 6 }}>{record.assessment_title || "Assessment"}</h1>
          <div style={{ ...T.meta, color: B.taupe, marginBottom: 20 }}>
            {issuedDate} &middot; Model RP-2.0
          </div>

          <div style={{ marginBottom: 8 }}>
            <span style={{ ...T.score, color: B.navy }}>{animatedScore}</span>
            <span style={{ fontSize: 24, fontWeight: 400, color: B.taupe }}>/100</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: bandColor }} />
            <div style={{ ...T.classification, color: bandColor }}>Stability Level: {record.stability_band}</div>
          </div>
          {nextBandName && <div style={{ ...T.body, color: B.teal, fontWeight: 600, marginTop: 6 }}>Improvement Potential: {distanceToNext} points to {nextBandName} Stability</div>}
        </div>

        {/* ── KEY TAKEAWAY ── */}
        <div style={{ background: `linear-gradient(135deg, rgba(75,63,174,0.04) 0%, rgba(31,109,122,0.04) 100%)`, border: "1px solid rgba(14,26,43,0.08)", borderLeft: `3px solid ${B.purple}`, borderRadius: 6, padding: mobile ? "18px 16px" : "24px 28px", marginBottom: 20 }}>
          <div style={{ ...T.overline, color: B.purple, marginBottom: 10, letterSpacing: "0.12em" }}>KEY TAKEAWAY</div>
          <p style={{ ...T.sectionTitle, color: B.navy, margin: "0 0 10px", fontSize: 17 }}>
            {tier === "high" ? "Your income is strong and well-protected."
              : tier === "established" ? "Your income is stable but at risk."
              : tier === "developing" ? "Your income is building, but not secure yet."
              : "Your income is structurally vulnerable right now."}
          </p>
          <p style={{ ...T.body, color: B.navy, margin: 0, lineHeight: 1.7 }}>
            {tier === "high"
              ? "You have built meaningful structural resilience, and most common disruptions would not threaten your financial security. This report confirms what is working and shows you how to maintain and extend your position. By continuing to optimize, you can lock in long-term financial peace of mind."
              : tier === "established"
              ? "You currently have a moderate level of income stability, but there are key vulnerabilities that could disrupt your financial security. This report gives you actionable steps to improve your stability and future-proof your income. By taking action, you can increase predictability, reduce risk, and build a solid foundation for financial peace of mind."
              : tier === "developing"
              ? "You have a foundation to build on, but important gaps remain that leave you exposed to disruptions. This report identifies exactly where the risks are and gives you a clear, actionable path to strengthen your position. With focused changes, you can significantly improve your financial security."
              : "Most of your earnings depend on active effort, and a single disruption could create serious financial pressure. This report identifies exactly where the risks are and gives you a clear path to build real protection. By taking the steps outlined here, you can transform your income into a more predictable, resilient structure."}
          </p>
        </div>

        {/* ── IN PLAIN ENGLISH — GOOD NEWS / BAD NEWS ── */}
        <div style={{ ...cardStyle, marginBottom: 14 }}>
          <div style={{ ...T.overline, color: B.taupe, marginBottom: 12 }}>IN PLAIN ENGLISH</div>

          {/* The Good News */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ ...T.sectionLabel, color: B.teal, marginBottom: 6 }}>The Good News:</div>
            <p style={{ ...T.body, color: B.navy, margin: "0 0 6px", lineHeight: 1.65 }}>
              {tier === "high"
                ? `Most of your income continues even during disruptions. Only ${record.active_income_level}% requires your daily active effort, and you have ${continuityDisplay} of runway if you stopped working entirely.`
                : tier === "established"
                ? `You have some predictable income, but ${record.active_income_level}% of your income is tied to active contracts or projects. When these end, so does your money.`
                : tier === "developing"
                ? `You are earning income and have some early structure in place, but ${record.active_income_level}% of it is still tied to active work. When that work ends, so does your money.`
                : `You are earning income, but ${record.active_income_level}% of it requires your active effort every day. If you stop working, your income stops almost immediately.`}
            </p>
            <p style={{ ...T.small, color: B.muted, margin: "0 0 4px", lineHeight: 1.5 }}>
              <span style={{ fontWeight: 600 }}>What That Means:</span>{" "}
              {tier === "high"
                ? "Your income can absorb a lost client, a slow month, or an unexpected break without creating financial crisis."
                : tier === "established"
                ? "If you lose a client or a project, your income could drop quickly — but you have enough structure to absorb small setbacks."
                : "If you lose a client or a project ends, your income could drop quickly with limited buffer to fall back on."}
            </p>
            <p style={{ ...T.small, color: B.teal, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
              <span style={{ fontWeight: 600 }}>The Opportunity:</span>{" "}
              {tier === "high"
                ? "You have the foundation to lock in long-term financial resilience with a few targeted optimizations."
                : "You have the power to make changes that will secure a more stable income."}
            </p>
          </div>

          {/* The Bad News */}
          <div>
            <div style={{ ...T.sectionLabel, color: B.bandLimited, marginBottom: 6 }}>The Bad News:</div>
            <p style={{ ...T.body, color: B.navy, margin: 0, lineHeight: 1.65 }}>
              {tier === "high"
                ? `Even with strong stability, ${dominantConstraintPlain[dominantConstraint] || "specific structural gaps remain"}. Addressing this would push your score even higher and protect against the few scenarios that could still affect you.`
                : tier === "established"
                ? `Without enough predictable income sources like retainers or subscriptions, you are still exposed to uncertain income and could be caught off-guard if clients stop paying or projects end. Your biggest vulnerability: ${dominantConstraintPlain[dominantConstraint] || "structural gaps that limit your score"}.`
                : `Your income structure has significant gaps. ${dominantConstraintPlain[dominantConstraint] ? dominantConstraintPlain[dominantConstraint].charAt(0).toUpperCase() + dominantConstraintPlain[dominantConstraint].slice(1) + "." : "Key structural weaknesses are limiting your financial security."} Without changes, you are exposed to disruptions that could create real financial pressure.`}
            </p>
          </div>
        </div>

        {/* ── STABILITY SUITE CTA — LINK TO TOOLS HUB ── */}
        <div
          onClick={() => router.push("/tools")}
          style={{ ...cardStyle, marginTop: 12, borderLeft: `3px solid ${B.purple}`, background: `linear-gradient(135deg, rgba(75,63,174,0.04) 0%, rgba(31,109,122,0.04) 100%)`, cursor: "pointer", transition: "box-shadow 200ms ease" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(75,63,174,0.12)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ ...T.sectionLabel, color: B.purple, marginBottom: 4 }}>RunPayway&#8482; Stability Suite</div>
              <p style={{ ...T.small, color: B.muted, margin: 0, lineHeight: 1.5 }}>
                Access your premium tools — PressureMap&#8482;, Stability Simulator, and Progress Dashboard — to take action on this report.
              </p>
            </div>
            <div style={{ fontSize: 24, color: B.purple, flexShrink: 0, marginLeft: 16 }}>&rarr;</div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: B.purple }} />
              <span style={{ ...T.meta, color: B.taupe }}>PressureMap</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: B.teal }} />
              <span style={{ ...T.meta, color: B.taupe }}>Simulator</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: "#DC7814" }} />
              <span style={{ ...T.meta, color: B.taupe }}>Dashboard</span>
            </div>
          </div>
        </div>

        <PageFooter section="Key Findings &amp; Financial Landscape" page={1} />
    </>,

    // Page 2: Action Plan & Roadmap
    <>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 4 }}>Your RunPayway&#8482; Stability Plan</h1>
        <p style={{ fontSize: 16, color: B.muted, maxWidth: 540, marginBottom: 6 }}>Take Action Now to Secure Your Future</p>
        <p style={{ ...T.small, color: B.muted, marginBottom: 20, lineHeight: 1.6 }}>
          Based on your Income Stability Score&#8482; of {score}/100, these are the highest-impact changes you can make to strengthen your financial resilience.
        </p>

        {/* ── 3 ACTION STEPS ── */}
        {v2Lift && v2Lift.lift_scenarios.length > 0 && (() => {
          const viable = v2Lift.lift_scenarios.filter(s => s.lift > 0).sort((a, b) => b.lift - a.lift);

          const liftConcrete: Record<string, { goal: string; action: string; example: string }> = {
            reduce_labor_dependence: { goal: "Reduce how much income requires your daily effort", action: "Convert active services into retainers, productized packages, or licensed deliverables that generate revenue without your direct involvement.", example: `If you are a ${structureDesc}, instead of billing hourly, offer fixed monthly service packages or licensing your expertise.` },
            reduce_active_dependence: { goal: "Reduce how much income requires your daily effort", action: "Convert active services into retainers, productized packages, or licensed deliverables.", example: `If you are a ${structureDesc}, offer ongoing support packages instead of one-time project work.` },
            extend_forward_visibility: { goal: "Lock in revenue before each month starts", action: "Move clients to retainers, prepaid packages, recurring service plans, or standing agreements.", example: `Instead of waiting for new ${incomeModelDesc} work each month, offer clients a monthly retainer for ongoing access to your services.` },
            improve_forward_secured: { goal: "Lock in revenue before each month starts", action: "Offer long-term contracts or monthly retainers to your clients.", example: `If you are a ${structureDesc}, instead of project-based work, offer ongoing support or consulting packages.` },
            reduce_concentration: { goal: "Reduce dependence on your largest income source", action: "Add one new client, contract, or revenue stream that could reach 15%+ of your income within 90 days.", example: "The goal is not to replace your best client, but to add weight elsewhere so no single source dominates." },
            reduce_largest_source: { goal: "Spread your income across more sources", action: "Identify adjacent services or client types you can serve to reduce dependency on your largest source.", example: "Add a new client segment or product line that operates on a different cycle." },
            increase_persistence: { goal: "Shift income to recurring revenue that renews automatically", action: "Introduce subscriptions, maintenance contracts, licensing fees, or membership models.", example: "Offer clients a monthly subscription to your services rather than single projects." },
            increase_persistent_revenue: { goal: "Build income that repeats without re-selling", action: "Identify projects that can be turned into long-term agreements or subscription-based services.", example: "Create a membership or retainer model where revenue renews automatically unless cancelled." },
            strengthen_persistence: { goal: "Build income that repeats without re-selling", action: "Convert one-time work into recurring arrangements.", example: "Offer ongoing maintenance, support packages, or subscription access to your work." },
            add_income_sources: { goal: "Add more independent income sources", action: "Identify one adjacent service, product, or client type that operates on a different cycle.", example: "Develop a digital product, course, or licensing arrangement as a secondary income stream." },
            diversify_sources: { goal: "Spread income across more independent sources", action: "Add at least one new meaningful income stream.", example: "Create passive income through royalties, online courses, or digital products." },
            reduce_variability: { goal: "Smooth out month-to-month income swings", action: "Shift project-based work toward retainers or phased billing with quarterly or annual pricing.", example: "Offer clients predictable monthly billing in exchange for a longer commitment." },
            increase_continuity: { goal: "Build backup revenue that does not require you to constantly work", action: "Develop passive income through things like royalties, online courses, or digital products.", example: "Create digital content or license your work to generate money passively." },
            extend_continuity: { goal: "Extend how long income would last if you stopped working", action: "Build at least one income stream that would keep producing for 3+ months independently.", example: "Choose a side project or digital product you can create quickly and launch." },
          };

          const stepLabels = ["Step 1", "Step 2", "Step 3"];
          const stepColors = [B.purple, B.teal, B.navy];
          const steps = viable.slice(0, 3);

          return (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {steps.map((scenario, idx) => {
                  const concrete = liftConcrete[scenario.scenario_id];
                  const aiAction = idx === 0 ? aiPlan?.primary_action : idx === 1 ? aiPlan?.supporting_action : null;
                  const aiHow = idx === 0 ? aiPlan?.primary_how : idx === 1 ? aiPlan?.supporting_how : null;
                  const goal = aiAction || concrete?.goal || scenario.label;
                  const action = aiHow || concrete?.action || scenario.change_description || "";
                  const example = concrete?.example || "";
                  return (
                    <div key={scenario.scenario_id} style={{ ...cardStyle, padding: "18px 22px", borderLeft: `3px solid ${stepColors[idx]}` }}>
                      <div style={{ ...T.overline, color: stepColors[idx], marginBottom: 6, letterSpacing: "0.12em" }}>{stepLabels[idx]}: {goal.length > 50 ? goal.substring(0, 50) + "..." : goal}</div>
                      <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 8 }}>{goal}</div>
                      <div style={{ marginBottom: 6 }}>
                        <span style={{ ...T.small, color: B.muted, fontWeight: 600 }}>Action: </span>
                        <span style={{ ...T.small, color: B.navy, lineHeight: 1.6 }}>{action}</span>
                      </div>
                      {example && (
                        <div style={{ marginBottom: 8 }}>
                          <span style={{ ...T.small, color: B.muted, fontWeight: 600 }}>Example: </span>
                          <span style={{ ...T.small, color: B.navy, lineHeight: 1.6 }}>{example}</span>
                        </div>
                      )}
                      <div style={{ ...T.small, color: B.teal, fontWeight: 600, marginTop: 4 }}>
                        Impact: This will increase your score by +{scenario.lift} points{scenario.band_shift ? `, moving you to ${scenario.projected_band}` : ""}, improving your stability and reducing income fluctuation.
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ── IF YOU DID BOTH / ALL ── */}
        {v2Lift?.combined_top_two && v2Lift.combined_top_two.lift > 0 && (
          <div style={{ background: `linear-gradient(135deg, rgba(31,109,122,0.06) 0%, rgba(75,63,174,0.04) 100%)`, border: "1px solid rgba(14,26,43,0.08)", borderRadius: 6, padding: "16px 20px", marginBottom: 20 }}>
            <div style={{ ...T.sectionLabel, color: B.teal, marginBottom: 6 }}>Combined Impact</div>
            <p style={{ ...T.body, color: B.navy, margin: 0, lineHeight: 1.65 }}>
              By implementing the top changes together, your score would rise to approximately <span style={{ fontWeight: 700, color: B.teal }}>{v2Lift.combined_top_two.projected_score}</span> (+{v2Lift.combined_top_two.lift} points).{v2Lift.combined_top_two.band_shift ? ` This would move you to ${v2Lift.combined_top_two.projected_band}.` : ""}
            </p>
          </div>
        )}

        <SectionDivider />

        {/* ── YOUR PERSONALIZED ROADMAP FOR ACTION ── */}
        <div style={{ marginBottom: 16 }}>
          <Overline large>Your Personalized Roadmap for Action</Overline>
          <p style={{ ...T.body, color: B.navy, margin: "0 0 16px", lineHeight: 1.65, fontWeight: 500 }}>
            Commit to Your Financial Future: Now that you have your personalized plan, it is time to commit to making it happen. Take small steps toward implementing these recommendations, and you will see progress over time.
          </p>

          {v2ExecutionRoadmap && v2ExecutionRoadmap.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {v2ExecutionRoadmap.slice(0, 4).map((w, i) => (
                <div key={i} style={{ ...cardStyle, padding: "16px 20px", borderLeft: `3px solid ${i === 0 ? B.purple : i === 1 ? B.teal : i === 2 ? B.navy : B.bandDeveloping}` }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ ...T.micro, color: i === 0 ? B.purple : i === 1 ? B.teal : i === 2 ? B.navy : B.bandDeveloping, minWidth: mobile ? 60 : 70, flexShrink: 0 }}>{w.week}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 4 }}>{w.action}</div>
                      <p style={{ ...T.small, color: B.muted, margin: 0, lineHeight: 1.55 }}>{w.detail}</p>
                      {w.success_metric && <p style={{ ...T.meta, color: B.teal, margin: "6px 0 0", fontWeight: 600 }}>Goal: {w.success_metric}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { week: "Week 1", title: "Start with Predictable Revenue", detail: "Look at your current clients and identify who would benefit from an ongoing arrangement. Offer them long-term retainers or monthly service packages.", goal: "Secure 1 retainer or recurring agreement by the end of the week." },
                { week: "Week 2–3", title: "Transition to Recurring Revenue", detail: "Convert at least 15% of your services to subscription-based or recurring models. Start with services you know clients will need continuously.", goal: "Secure 1 recurring client or subscription package." },
                { week: "Week 4", title: "Build Backup Revenue", detail: "Begin creating passive or semi-passive income sources like online courses, digital products, templates, or content that can be licensed.", goal: "Launch 1 passive income project or side revenue stream." },
              ].map((w, i) => (
                <div key={i} style={{ ...cardStyle, padding: "16px 20px", borderLeft: `3px solid ${i === 0 ? B.purple : i === 1 ? B.teal : B.navy}` }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ ...T.micro, color: i === 0 ? B.purple : i === 1 ? B.teal : B.navy, minWidth: mobile ? 60 : 70, flexShrink: 0 }}>{w.week}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 4 }}>{w.title}</div>
                      <p style={{ ...T.small, color: B.muted, margin: 0, lineHeight: 1.55 }}>{w.detail}</p>
                      <p style={{ ...T.meta, color: B.teal, margin: "6px 0 0", fontWeight: 600 }}>Goal: {w.goal}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── WHAT TO AVOID ── */}
        {((v2AvoidActions && v2AvoidActions.length > 0) || (olAvoid && olAvoid.length > 0)) && (
          <div style={{ ...cardStyle, marginBottom: 14, borderLeft: `3px solid ${B.bandLimited}` }}>
            <div style={{ ...T.overline, color: B.bandLimited, marginBottom: 8 }}>WHAT TO AVOID</div>
            {(v2AvoidActions ?? []).slice(0, 2).map((a) => (
              <div key={a.action_id} style={{ ...T.small, color: B.muted, marginBottom: 4 }}>&mdash; <span style={{ fontWeight: 500 }}>{a.label}:</span> {a.reason}</div>
            ))}
            {(olAvoid ?? []).slice(0, 2).map((text) => (
              <div key={text} style={{ ...T.small, color: B.muted, marginBottom: 4 }}>&mdash; {text}</div>
            ))}
          </div>
        )}

        <PageFooter section="RunPayway&#8482; Stability Plan" page={2} />
    </>,

    // Page 3: Stress Test & Value
    <>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 4 }}>Stress Testing + Real-World Impact</h1>
        <p style={{ fontSize: 16, color: B.muted, maxWidth: 540, marginBottom: 6 }}>What happens when things go wrong — and how to prepare.</p>
        <p style={{ ...T.small, color: B.muted, marginBottom: 20, lineHeight: 1.6 }}>
          These are the specific disruptions your income is most exposed to — and what you can do about each one.
        </p>

        {/* ── STRESS TEST SCENARIOS ── */}
        {v2Scenarios && v2Scenarios.length > 0 && (() => {
          const scenarioPlain: Record<string, string> = {
            active_labor_interrupted: "Stopping Work for a While",
            platform_dependency_shock: "A Major Income Source Changes Terms",
            forward_commitments_delayed: "Payment Delays or Income Gaps",
            client_concentration_loss: "Losing a Client or Project",
            market_contraction: "Market Downturn Reduces Demand",
            regulatory_disruption: "Regulatory Changes Affect Your Income",
            revenue_model_disruption: "Your Income Model Stops Working",
            high_volatility_month: "A Slow Month with No Backup",
            seasonal_revenue_gap: "Seasonal Slowdown Hits",
            key_client_loss: "Losing a Key Client or Contract",
            pricing_pressure: "Pricing Pressure from the Market",
            recurring_stream_degrades: "Recurring Income Weakens",
            referral_pipeline_dries: "New Business Dries Up",
            contract_non_renewal: "A Major Contract Not Renewed",
            scope_reduction: "Client Cuts Your Scope",
          };

          const scenarioSolutions: Record<string, string> = {
            active_labor_interrupted: "Build recurring revenue to make sure money comes in, even if you are not actively working.",
            platform_dependency_shock: "Diversify your income sources so no single platform or client controls your earnings.",
            forward_commitments_delayed: "Develop passive income that does not rely on immediate payments or new client acquisition.",
            client_concentration_loss: "Secure long-term retainers from more clients to reduce dependency on any single one.",
            market_contraction: "Build income streams that are less sensitive to market cycles, like subscriptions or recurring contracts.",
            regulatory_disruption: "Diversify your income model so regulatory changes in one area do not affect all your earnings.",
            revenue_model_disruption: "Develop alternative income channels so you are not dependent on a single model.",
            high_volatility_month: "Build a financial buffer through recurring revenue and passive income streams.",
            seasonal_revenue_gap: "Smooth out seasonal income by securing annual contracts or building counter-cyclical revenue.",
            key_client_loss: "Reduce client concentration by adding new revenue sources and retainer agreements.",
            pricing_pressure: "Add value-based pricing and recurring models that are less vulnerable to price competition.",
            recurring_stream_degrades: "Diversify your recurring revenue across multiple streams and client types.",
            referral_pipeline_dries: "Build direct client acquisition channels alongside referral-based business.",
            contract_non_renewal: "Maintain a pipeline of potential clients and build recurring income alongside contract work.",
            scope_reduction: "Negotiate multi-year agreements and diversify across more clients.",
          };

          const sorted = [...v2Scenarios].sort((a, b) => b.score_drop - a.score_drop);
          const top = sorted.slice(0, 3);
          const liftScenarios = v2Lift?.lift_scenarios?.filter(s => s.lift > 0)?.sort((a, b) => b.lift - a.lift) ?? [];

          return (
            <div style={{ marginBottom: 20 }}>
              {top.map((s, idx) => {
                const title = scenarioPlain[s.scenario_id] || cleanScenarioTitle(s.label);
                const solution = scenarioSolutions[s.scenario_id] || "Take steps to diversify and protect your income structure.";
                const matchedLift = liftScenarios[idx];
                const borderColor = idx === 0 ? B.bandLimited : idx === 1 ? B.bandDeveloping : B.navy;
                return (
                  <div key={s.scenario_id} style={{ ...cardStyle, padding: "18px 22px", marginBottom: 12, borderLeft: `3px solid ${borderColor}` }}>
                    <div style={{ ...T.overline, color: borderColor, marginBottom: 6, letterSpacing: "0.1em" }}>SCENARIO {idx + 1}: {title.toUpperCase()}</div>
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ ...T.small, color: B.bandLimited, fontWeight: 600 }}>Risk: </span>
                      <span style={{ ...T.small, color: B.navy, lineHeight: 1.6 }}>
                        If this happens, your income will drop by {s.score_drop} points ({s.original_score} to {s.scenario_score}).
                        {s.band_shift ? ` This would drop you from ${s.original_band} to ${s.scenario_band}.` : ""}
                      </span>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ ...T.small, color: B.teal, fontWeight: 600 }}>Solution: </span>
                      <span style={{ ...T.small, color: B.navy, lineHeight: 1.6 }}>{solution}</span>
                    </div>
                    {matchedLift && (
                      <div>
                        <span style={{ ...T.small, color: B.purple, fontWeight: 600 }}>Impact: </span>
                        <span style={{ ...T.small, color: B.navy }}>This will increase your score by +{matchedLift.lift} points.</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}

        <SectionDivider />

        {/* ── HOW MUCH CAN YOUR INCOME ABSORB ── */}
        {v2Fragility && (
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 8 }}>HOW MUCH CAN YOUR INCOME ABSORB?</div>
            <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 16, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ ...T.sectionLabel, color: v2Fragility.fragility_class === "brittle" || v2Fragility.fragility_class === "thin" ? B.bandLimited : v2Fragility.fragility_class === "resilient" || v2Fragility.fragility_class === "supported" ? B.teal : B.navy, marginBottom: 6 }}>
                  {fragilityClassLabel[v2Fragility.fragility_class] || ((v2Fragility.fragility_class || "").charAt(0).toUpperCase() + (v2Fragility.fragility_class || "").slice(1))}
                </div>
                <p style={{ ...T.small, color: B.muted, margin: 0, lineHeight: 1.55 }}>
                  {v2Explainability?.fragility_explanation || ({
                    brittle: "A single disruption could cause your score to collapse. There is no structural buffer.",
                    thin: "You can absorb a minor hit, but two disruptions close together would create serious pressure.",
                    uneven: "Some parts of your income are protected, others are fully exposed.",
                    supported: "Your income can absorb most common disruptions without dropping to a lower band.",
                    resilient: "Your income can absorb a major hit and keep going.",
                  })[v2Fragility.fragility_class] || ""}
                </p>
              </div>
              <div style={{ flex: mobile ? undefined : 1 }}>
                <div style={{ ...T.meta, color: B.taupe, fontWeight: 600, marginBottom: 4 }}>Primary Vulnerability</div>
                <p style={{ ...T.small, color: B.navy, margin: "0 0 8px" }}>
                  {dominantConstraintPlain[dominantConstraint] ? dominantConstraintPlain[dominantConstraint].charAt(0).toUpperCase() + dominantConstraintPlain[dominantConstraint].slice(1) + "." : "Structural gaps that limit resilience."}
                </p>
                <div style={{ ...T.meta, color: B.taupe, fontWeight: 600, marginBottom: 4 }}>Your Next Steps</div>
                <p style={{ ...T.small, color: B.navy, margin: 0, lineHeight: 1.5 }}>
                  {v2Lift?.lift_scenarios?.[0] ? cleanConstraintText(v2Lift.lift_scenarios[0].change_description || v2Lift.lift_scenarios[0].label) : "Start shifting income to more predictable, recurring sources."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── REAL-WORLD EXAMPLES ── */}
        <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 14, marginBottom: 20 }}>
          <div style={{ flex: 1, ...cardStyle, borderLeft: `3px solid ${B.bandLimited}` }}>
            <Overline>IF YOUR BIGGEST SOURCE GOES AWAY</Overline>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
              <span style={{ ...T.cardHero, color: B.navy }}>{record.final_score}</span>
              <span style={{ ...T.sectionLabel, color: B.taupe }}>&rarr;</span>
              <span style={{ ...T.cardHero, color: B.bandLimited }}>{Math.max(0, record.risk_scenario_score)}</span>
            </div>
            <p style={{ ...T.small, color: B.muted, margin: 0 }}>
              Without long-term contracts, losing your top source could drop your score by {record.risk_scenario_drop} points. With retainers and recurring income, your score stays strong and steady.
            </p>
          </div>
          <div style={{ flex: 1, ...cardStyle, borderLeft: `3px solid ${B.bandDeveloping}` }}>
            <Overline>IF YOU STOP WORKING ENTIRELY</Overline>
            <div style={{ ...T.cardHero, color: B.navy, marginBottom: 6 }}>{continuityDisplay}</div>
            <p style={{ ...T.small, color: B.muted, margin: 0 }}>
              Stopping work for any reason could create immediate pressure. By creating backup revenue and shifting to predictable income, your score remains stable.
            </p>
          </div>
        </div>

        <SectionDivider />

        {/* ── WHY THIS REPORT IS WORTH $149 ── */}
        <div style={{ background: `linear-gradient(135deg, rgba(14,26,43,0.03) 0%, rgba(75,63,174,0.03) 100%)`, border: "1px solid rgba(14,26,43,0.08)", borderRadius: 6, padding: mobile ? "18px 16px" : "24px 28px", marginBottom: 16 }}>
          <div style={{ ...T.sectionTitle, color: B.navy, marginBottom: 10, fontSize: 16 }}>Why This Report is Worth $149</div>
          <p style={{ ...T.body, color: B.navy, margin: "0 0 12px", lineHeight: 1.7 }}>
            This is not just a snapshot of your current income. This report provides you with actionable steps, personalized recommendations, and the tools you need to future-proof your income. You have clear guidance, interactive tools, and an ongoing plan that will empower you to take immediate action and create stability in your financial life.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: B.teal, flexShrink: 0 }} />
              <span style={{ ...T.small, color: B.navy }}>Commit to the steps in this report today.</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: B.teal, flexShrink: 0 }} />
              <span style={{ ...T.small, color: B.navy }}>Track your progress using your PressureMap&#8482; and Simulator, and revisit your plan every few months.</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: B.teal, flexShrink: 0 }} />
              <span style={{ ...T.small, color: B.navy }}>Reassess in {tier === "limited" ? "2" : tier === "high" ? "6" : "3"} months to see how much your score has improved.</span>
            </div>
          </div>
        </div>

        {/* ── RETAKE TIMING ── */}
        <div style={{ ...cardStyle, marginBottom: 14 }}>
          <Overline>WHEN TO RETAKE THIS ASSESSMENT</Overline>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
            <div style={{ ...T.cardHeading, color: B.navy }}>{reassessDate}</div>
            <div style={{ ...T.small, color: B.purple, fontWeight: 600 }}>{reassessDaysLeft} days from now</div>
          </div>
          <p style={{ ...T.meta, color: B.muted, margin: 0, lineHeight: 1.5 }}>Retake after real structural change — a new retainer signed, a source added, a dependency reduced. Typically {tier === "limited" ? "2" : tier === "high" ? "6" : "3"} months.</p>
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

        {/* ── METHODOLOGY FOOTER ── */}
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${B.stone}` }}>
          <p style={{ ...T.meta, color: B.taupe, margin: 0, lineHeight: 1.5, fontStyle: "italic" }}>
            This is a proprietary financial diagnostic tool developed by PeopleStar Enterprises. Scored by RunPayway&#8482; Model RP-2.0 — a deterministic system using fixed rules and weights. Same inputs always produce the same score. This is a present-state structural assessment, not financial advice.
          </p>
        </div>

        <PageFooter section="Stress Testing &amp; Real-World Impact" page={3} />
    </>,


  ];

  return (
    <ReportErrorBoundary>
    {/* Print stylesheet */}
    <style>{`
      @media print {
        @page {
          size: letter;
          margin: 0.5in 0.6in;
        }
        body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        #paginated-view { display: none !important; }
        .print-report { display: block !important; }
        .print-report .print-page {
          page-break-after: always;
          page-break-inside: avoid;
          padding: 0;
          margin: 0;
        }
        .print-report .print-page:last-child {
          page-break-after: auto;
        }
        nav, footer, .no-print { display: none !important; }
      }
      @media not print {
        .print-report { display: none !important; }
      }
    `}</style>

    {/* Hidden print container — shows ALL pages when printing */}
    <div className="print-report">
      {pageContents.map((content, i) => (
        <div key={i} className="print-page" style={{ backgroundColor: "#FFFFFF", padding: "0", maxWidth: "100%" }}>
          {content}
        </div>
      ))}
    </div>

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
        {/* Tool links + Download PDF */}
        {!mobile && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <a href="/tools" style={{ fontSize: 12, color: "#4B3FAE", textDecoration: "none", fontWeight: 600, padding: "6px 10px" }}>Stability Suite</a>
            <div style={{ width: 1, height: 16, backgroundColor: "rgba(14,26,43,0.10)" }} />
            <button
              onClick={handleDownload}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 12, color: "rgba(14,26,43,0.50)",
                padding: "6px 10px", fontWeight: 500,
              }}
            >
              PDF
            </button>
          </div>
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
