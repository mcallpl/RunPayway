"use client";

import { useEffect, useState, useRef, Component, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoBlue from "../../../../public/runpayway-logo-blue.png";
import { useAssessmentServer } from "@/lib/monitoring";
import { generateTailoredCopy } from "@/lib/industry-tailoring";
import { generateReportPDF, type ReportPDFData } from "./report-pdf";
import { C, mono, sans, bandColor as bandColorFn } from "@/lib/design-tokens";

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
// BRAND — derived from shared design tokens
// ============================================================
const B = {
  navy: C.navy,
  ink: C.navy,
  sand: C.white,
  bone: C.white,
  white: C.white,
  stone: C.border,
  taupe: C.light,
  muted: C.muted,
  purple: C.purple,
  teal: C.teal,
  bandLimited: C.bandLimited,
  bandDeveloping: C.bandDeveloping,
  bandEstablished: C.bandEstablished,
  bandHigh: C.bandHigh,
};

// ============================================================
// SPACING + TYPOGRAPHY TOKENS
// ============================================================
const R = {
  pagePad: "48px 52px 36px",
  headerMb: 28,
  sectionGap: 36,
  sectionMb: 28,
  cardMb: 18,
  labelMb: 12,
  paraMb: 14,
  itemGap: 14,
  cardGap: 16,
  rowGap: 18,
  dividerMy: 28,
  footerMt: 20,
  cardPad: "20px 24px" as string,
};

// ── Card: derived from shared design tokens with report padding ──
const reportCardStyle: React.CSSProperties = {
  ...({
    borderRadius: 12,
    border: `1px solid ${C.softBorder}`,
    backgroundColor: C.white,
    boxShadow: "0 1px 3px rgba(14,26,43,0.04)",
  }),
  padding: R.cardPad,
};

const accentGradient = `linear-gradient(90deg, ${B.purple} 0%, ${B.teal} 100%)`;

// ── Typography: premium scale — lighter weights, bigger contrast ──
/*  REPORT TYPE SCALE — 6 levels (matches Command Center)
    Display: 48px — score on cover
    H1: 24px — page titles
    H2: 17px — section headings, key takeaway
    Body: 14px — primary readable text
    Small: 12px — secondary text, examples, metadata
    Label: 11px — uppercase overlines, tags
*/
const T = {
  score: { fontSize: 48, fontWeight: 300, lineHeight: 1, letterSpacing: "-0.03em" },
  pageTitle: { fontSize: 24, fontWeight: 600, lineHeight: 1.15, color: B.navy, letterSpacing: "-0.02em" },
  sectionTitle: { fontSize: 16, fontWeight: 600, lineHeight: 1.3, color: B.navy, letterSpacing: "-0.01em" },
  classification: { fontSize: 14, fontWeight: 500, lineHeight: 1.3 },
  overline: { fontSize: 11, fontWeight: 600, lineHeight: 1.3, letterSpacing: "0.12em", textTransform: "uppercase" as const },
  sectionLabel: { fontSize: 14, fontWeight: 600, lineHeight: 1.4, letterSpacing: "-0.01em" },
  cardHeading: { fontSize: 14, fontWeight: 600, lineHeight: 1.35 },
  cardHero: { fontSize: 24, fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.02em" },
  body: { fontSize: 14, fontWeight: 400, lineHeight: 1.75 },
  small: { fontSize: 12, fontWeight: 400, lineHeight: 1.65 },
  meta: { fontSize: 11, fontWeight: 400, lineHeight: 1.5 },
  micro: { fontSize: 11, fontWeight: 600, lineHeight: 1.3, letterSpacing: "0.04em" },
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
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: R.headerMb, paddingBottom: 16, borderBottom: "1px solid rgba(14,26,43,0.06)" }}>
      <Image src={logoBlue} alt="RunPayway&#8482;" width={110} height={13} style={{ height: "auto", opacity: 0.85 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 4, height: 4, borderRadius: 1, backgroundColor: "rgba(14,26,43,0.15)" }} />
        <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(14,26,43,0.30)", letterSpacing: "0.06em" }}>Income Stability Score&#8482; &middot; RP-2.0</div>
      </div>
    </div>
  );
}

function Overline({ children, large }: { children: React.ReactNode; large?: boolean }) {
  return large
    ? <div style={{ ...T.sectionTitle, color: B.navy, marginBottom: 12 }}>{children}</div>
    : <div style={{ ...T.overline, color: "rgba(14,26,43,0.34)", marginBottom: 8 }}>{children}</div>;
}

function SectionDivider() {
  return <div style={{ height: 1, backgroundColor: "rgba(14,26,43,0.05)", marginTop: R.dividerMy, marginBottom: R.dividerMy }} />;
}

function PageFooter({ section, page }: { section: string; page: number }) {
  return (
    <div className="report-page-footer" style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid rgba(14,26,43,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 400, color: "rgba(14,26,43,0.28)", letterSpacing: "0.02em" }}>Confidential &mdash; {section}</span>
        <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(14,26,43,0.28)", fontFamily: mono }}>Page {page} of 3</span>
        <span style={{ fontSize: 11, fontWeight: 400, color: "rgba(14,26,43,0.28)" }}>support@runpayway.com</span>
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
      fontFamily: sans,
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
  const totalPages = 4; // cover + 3 content pages
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
    B2: `Your income structure is taking shape. Here is the composition — ${record.active_income_level}% income that stops when you stop, ${record.persistent_income_level}% protected income.`,
    C1: `Your ${incomeModelDesc} structure in ${industrySector} has real protection. Here is the composition and where the remaining exposure sits.`,
    C2: `Established ${incomeModelDesc} structure. Here is how your income is composed — and the specific areas that still matter.`,
    D1: `Strong ${incomeModelDesc} structure with ${record.persistent_income_level}% protected income. Here is the full composition.`,
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
    labor_interruption: "Income stops when you stop working",
    visibility_gap: "Not enough income locked in ahead",
    durability_thinness: "Recurring income is fragile or cancelable",
  };
  const constraintLabel: Record<string, string> = {
    weak_forward_visibility: "Too little income locked in ahead",
    high_labor_dependence: "Too much depends on your daily work",
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

  const riskScenarioScore = Math.max(0, record.risk_scenario_score ?? score);
  const riskScenarioDrop = record.risk_scenario_drop ?? 0;
  const continuityText = record.income_continuity_months < 1 ? "Income stops almost immediately" : record.income_continuity_months < 3 ? "Limited runway before pressure" : "Some structural buffer in place";

  // ── Page navigation ──

  // ── Reassessment countdown ──
  const reassessDaysLeft = Math.max(0, Math.ceil((new Date(reassessDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  const handleDownload = () => {
    window.print();
  };

  const handleDownloadLegacy = async () => {
    if (downloading) return;
    setDownloading(true);
    setDownloadError(null);
    try {
      // Build access code
      const v2ni = (record._v2 as Record<string, unknown>)?.normalized_inputs as Record<string, number | string> | undefined;
      const v2q = ((record._v2 as Record<string, unknown>)?.quality as Record<string, number>)?.quality_score ?? 5;
      const accessCodePayload = v2ni ? btoa(JSON.stringify({
        p: v2ni.income_persistence_pct, c: v2ni.largest_source_pct, s: v2ni.source_diversity_count,
        f: v2ni.forward_secured_pct, v: v2ni.income_variability_level, l: v2ni.labor_dependence_pct,
        q: v2q, n: record.assessment_title || "", i: record.industry_sector || "", m: record.primary_income_model || "",
      })) : "";

      // Build ranked factors
      const rankedFactors = (v2Indicators || []).sort((a, b) => a.normalized_value - b.normalized_value).slice(0, 3).map((ind, i) => ({
        role: i === 0 ? "WEAKEST FACTOR" : i === 1 ? "MOST DANGEROUS" : "STRONGEST FACTOR",
        label: ind.label,
        level: ind.level,
        normalizedValue: ind.normalized_value / 100,
        explanation: "",
        roleColor: i === 0 ? B.bandLimited : i === 1 ? "#DC4A4A" : B.teal,
        levelColor: ind.level === "critical" || ind.level === "weak" ? B.bandLimited : ind.level === "moderate" ? B.bandDeveloping : B.teal,
      }));

      // Build scenarios
      const scenarios = (v2Scenarios || []).sort((a, b) => b.score_drop - a.score_drop).slice(0, 3).map(s => ({
        title: s.label, originalScore: s.original_score, scenarioScore: s.scenario_score,
        scoreDrop: s.score_drop, narrative: s.narrative, bandShift: s.band_shift,
        originalBand: s.original_band, scenarioBand: s.scenario_band,
      }));

      // Build action categories from lift scenarios
      const actionCategories = (v2Lift?.lift_scenarios || []).filter(s => s.lift > 0).sort((a, b) => b.lift - a.lift).slice(0, 3).map(s => ({
        tag: `STEP`, tagColor: B.purple,
        title: s.label, how: s.change_description || "",
        scoreChange: `+${s.lift} points`,
      }));

      // Build roadmap
      const roadmap = (v2ExecutionRoadmap || []).slice(0, 4).map(w => ({
        week: w.week, action: w.action, detail: w.detail, target: w.success_metric,
      }));

      // Fragility
      const fragilityClass = v2Fragility?.fragility_class || "uneven";
      const fragilityLabel = ({
        brittle: "One disruption could seriously damage your income",
        thin: "You can handle a small setback, but not two in a row",
        uneven: "Some parts are protected, others are not",
        supported: "Multiple layers of protection",
        resilient: "Can absorb a major hit and keep going",
      } as Record<string, string>)[fragilityClass] || fragilityClass;
      const fragilityColor = fragilityClass === "brittle" || fragilityClass === "thin" ? B.bandLimited : fragilityClass === "resilient" || fragilityClass === "supported" ? B.teal : B.navy;

      const pdfData: ReportPDFData = {
        assessmentTitle: record.assessment_title || "Assessment",
        issuedDate,
        formalDate,
        finalScore: score,
        stabilityBand: record.stability_band,
        bandColor,
        tier,
        coverBandDesc: coverBandDesc[tier],
        accessCode: accessCodePayload,
        diagnosticSentence: tailored.diagnosticSentence,
        plainEnglish: v2Explainability?.why_this_score || `Your income scores ${score}/100 for structural stability.`,
        whyNotHigher: v2Explainability?.why_not_higher,
        dominantConstraintText: dominantConstraintPlain[dominantConstraint] ? dominantConstraintPlain[dominantConstraint].charAt(0).toUpperCase() + dominantConstraintPlain[dominantConstraint].slice(1) + "." : "Structural gaps limit your score.",
        whatToChangeFirst: cleanConstraintText(v2Sensitivity?.tests?.[0]?.delta_description || "Address primary constraint"),
        whatThatWouldDo: v2Sensitivity?.tests?.[0] ? `${v2Sensitivity.tests[0].original_score} to ${v2Sensitivity.tests[0].projected_score} (+${v2Sensitivity.tests[0].lift})` : "Improvement available",
        nextBandName,
        distanceToNext,
        bandDistance,
        bandDistanceText: "",
        score,
        pressureMap: record.pressure_map ? {
          operatingStructure: (record.pressure_map as Record<string, string>).operating_structure || "",
          incomeModel: (record.pressure_map as Record<string, string>).income_model || "",
          industry: (record.pressure_map as Record<string, string>).industry || "",
          pressure: (record.pressure_map as Record<string, string>).pressure || "",
          tailwind: (record.pressure_map as Record<string, string>).tailwind || "",
          leverageMove: (record.pressure_map as Record<string, string>).leverage_move || "",
        } : undefined,
        killerLine: tailored.killerLine,
        activeIncome: record.active_income_level,
        semiPersistentIncome: record.semi_persistent_income_level,
        persistentIncome: record.persistent_income_level,
        riskScenarioScore: Math.max(0, record.risk_scenario_score),
        riskScenarioDrop: record.risk_scenario_drop,
        continuityDisplay,
        continuityText: record.income_continuity_months < 1 ? "Income stops almost immediately" : record.income_continuity_months < 3 ? "Very little runway" : "Some buffer before pressure",
        riskSeverityText: sourceDropSeverity,
        rankedFactors,
        strongestSupports: v2Explainability?.strongest_supports || [],
        strongestSuppressors: v2Explainability?.strongest_suppressors || [],
        fragilityDiagnostic: tailored.fragilityContext,
        scenarios,
        fragilityLabel,
        fragilityText: v2Explainability?.fragility_explanation || "",
        fragilityColor,
        failureMode: v2Fragility?.primary_failure_mode,
        actionCategories,
        combinedLift: v2Lift?.combined_top_two && v2Lift.combined_top_two.lift > 0 ? {
          projectedScore: v2Lift.combined_top_two.projected_score,
          lift: v2Lift.combined_top_two.lift,
          bandShift: v2Lift.combined_top_two.band_shift ? v2Lift.combined_top_two.projected_band : undefined,
        } : undefined,
        tradeoff: v2TradeoffNarratives?.[0] ? {
          actionLabel: v2TradeoffNarratives[0].action_label,
          upside: v2TradeoffNarratives[0].upside,
          downside: v2TradeoffNarratives[0].downside,
          recommendation: v2TradeoffNarratives[0].net_recommendation,
        } : undefined,
        avoidActions: [...(v2AvoidActions || []).map(a => `${a.label}: ${a.reason}`), ...(olAvoid || [])].slice(0, 3),
        roadmap,
        reassessDate,
        reassessDaysLeft,
        reassessTiming: tier === "limited" ? "2 months" : tier === "high" ? "6 months" : "3 months",
        triggers: (olTriggers || []).map(t => t.display_text),
      };

      const blob = await generateReportPDF(pdfData);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `RunPayway-Income-Stability-Report-${record.assessment_title || "Assessment"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setDownloadError("PDF generation failed. Try using Print (Ctrl+P) instead.");
    } finally {
      setDownloading(false);
    }
  };

  // ── Band color helper — uses shared design token ──
  const bandColor = bandColorFn(score);


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
  const pageNames = ["Cover", "Key Findings", "Stability Plan", "Stress Testing"];


  // ── Paginated page contents (shared between PDF container and on-screen view) ──
  const pageContents: ReactNode[] = [
    // Page 0: Cover — premium institutional with score ring
    <>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: mobile ? 420 : "auto", textAlign: "center", padding: mobile ? "0 12px" : "48px 0 32px" }}>

          {/* Logo */}
          <Image src={logoBlue} alt="RunPayway&#8482;" width={mobile ? 120 : 140} height={16} style={{ height: "auto", opacity: 0.8, marginBottom: mobile ? 24 : 36 }} />

          <div style={{ width: mobile ? 100 : 120, height: 1, backgroundColor: "rgba(14,26,43,0.10)", marginBottom: mobile ? 24 : 32 }} />

          <div style={{ fontSize: mobile ? 28 : 36, fontWeight: 300, color: B.navy, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 8 }}>Income Stability Report</div>
          <div style={{ fontSize: 12, fontWeight: 500, color: B.teal, letterSpacing: "0.06em", marginBottom: mobile ? 16 : 24 }}>STRUCTURAL ASSESSMENT &middot; CONFIDENTIAL</div>

          <div style={{ fontSize: mobile ? 17 : 22, fontWeight: 500, color: B.navy, marginBottom: 4 }}>{record.assessment_title}</div>
          <div style={{ fontSize: 12, color: "rgba(14,26,43,0.32)", marginBottom: mobile ? 20 : 28, letterSpacing: "0.02em" }}>{formalDate}</div>

          {/* Score ring — visual anchor */}
          <div style={{ position: "relative", width: mobile ? 140 : 170, height: mobile ? 140 : 170, marginBottom: 16 }}>
            <svg width={mobile ? 140 : 170} height={mobile ? 140 : 170} style={{ transform: "rotate(-90deg)" }}>
              <circle cx={mobile ? 70 : 85} cy={mobile ? 70 : 85} r={mobile ? 58 : 70} fill="none" stroke="rgba(14,26,43,0.06)" strokeWidth={mobile ? 8 : 10} />
              <circle cx={mobile ? 70 : 85} cy={mobile ? 70 : 85} r={mobile ? 58 : 70} fill="none" stroke={bandColor} strokeWidth={mobile ? 8 : 10}
                strokeDasharray={2 * Math.PI * (mobile ? 58 : 70)} strokeDashoffset={2 * Math.PI * (mobile ? 58 : 70) - (record.final_score / 100) * 2 * Math.PI * (mobile ? 58 : 70)}
                strokeLinecap="round" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: mobile ? 40 : 48, fontWeight: 300, color: B.navy, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: mono }}>{record.final_score}</span>
              <span style={{ fontSize: 12, fontWeight: 300, color: "rgba(14,26,43,0.25)", fontFamily: mono }}>/100</span>
            </div>
          </div>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: bandColor }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: bandColor }}>{record.stability_band}</div>
          </div>

          {nextBandName && <div style={{ fontSize: 12, color: B.teal, fontWeight: 500, marginBottom: mobile ? 16 : 24 }}><span style={{ fontFamily: mono }}>{distanceToNext}</span> points to {nextBandName} Stability</div>}
          {tier === "high" && <div style={{ fontSize: 12, color: B.teal, fontWeight: 500, marginBottom: mobile ? 16 : 24 }}>Highest stability band achieved</div>}

          <div style={{ width: mobile ? 60 : 80, height: 1, backgroundColor: "rgba(14,26,43,0.08)", marginBottom: mobile ? 16 : 24 }} />

          {/* Access code */}
          {(() => {
            const v2Cover = (record as Record<string, unknown>)._v2 as Record<string, unknown> | undefined;
            const niCover = v2Cover?.normalized_inputs as Record<string, number | string> | undefined;
            if (!niCover) return null;
            const payload = { p: niCover.income_persistence_pct, c: niCover.largest_source_pct, s: niCover.source_diversity_count, f: niCover.forward_secured_pct, v: niCover.income_variability_level, l: niCover.labor_dependence_pct, q: (v2Cover?.quality as Record<string, number>)?.quality_score ?? 5, n: record.assessment_title || "", i: record.industry_sector || "", m: record.primary_income_model || "" };
            const code = btoa(JSON.stringify(payload));
            return (
              <div style={{ maxWidth: mobile ? "90%" : 380 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(14,26,43,0.30)", letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 8 }}>COMMAND CENTER ACCESS</div>
                <div style={{ fontSize: 11, color: "rgba(14,26,43,0.35)", marginBottom: 8 }}>Enter at runpayway.com/dashboard to access your interactive tools.</div>
                <div style={{ border: "1px solid rgba(14,26,43,0.06)", borderRadius: 6, padding: "8px 14px", textAlign: "left" }}>
                  <div style={{ fontFamily: mono, fontSize: mobile ? 7.5 : 8.5, color: "rgba(14,26,43,0.68)", letterSpacing: "0.01em", wordBreak: "break-all" as const, lineHeight: 1.4 }}>{code}</div>
                </div>
              </div>
            );
          })()}

          <div style={{ fontSize: 11, color: "rgba(14,26,43,0.18)", marginTop: 24, letterSpacing: "0.06em" }}>Model RP-2.0 &middot; Confidential</div>
        </div>
    </>,

    // Page 1: Key Findings
    <>
        <ReportHeader />

        {/* ── SCORE HEADER — enterprise compact ── */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ ...T.overline, color: B.taupe, marginBottom: 8 }}>RUNPAYWAY&#8482; INCOME STABILITY SCORE&#8482;</div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: B.navy, letterSpacing: "-0.01em", margin: "0 0 4px" }}>{record.assessment_title || "Assessment"}</h1>
          <div style={{ fontSize: 11, color: B.taupe, marginBottom: 16 }}>{issuedDate} &middot; Model RP-2.0</div>

          <div style={{ marginBottom: 8 }}>
            <span style={{ ...T.score, color: B.navy, fontFamily: mono }}>{animatedScore}</span>
            <span style={{ fontSize: 16, fontWeight: 400, color: B.taupe, fontFamily: mono }}>/100</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: bandColor }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: bandColor }}>{record.stability_band}</div>
          </div>
          {nextBandName && <div style={{ fontSize: 12, color: B.teal, fontWeight: 600, marginTop: 8 }}><span style={{ fontFamily: mono }}>{distanceToNext}</span> points to {nextBandName} Stability</div>}
        </div>

        {/* ── KEY TAKEAWAY ── */}
        <div style={{ background: `linear-gradient(135deg, rgba(75,63,174,0.04) 0%, rgba(31,109,122,0.04) 100%)`, border: "1px solid rgba(14,26,43,0.08)", borderLeft: `3px solid ${B.purple}`, borderRadius: 6, padding: mobile ? "18px 16px" : "22px 28px", marginBottom: 24 }}>
          <div style={{ ...T.overline, color: B.purple, marginBottom: 8 }}>KEY TAKEAWAY</div>
          <p style={{ ...T.sectionTitle, color: B.navy, margin: "0 0 8px" }}>
            {tier === "high" ? "Your income is strong and well-protected."
              : tier === "established" ? "Your income is stable but exposed."
              : tier === "developing" ? "Your income is building, but not secure."
              : "Your income is structurally vulnerable."}
          </p>
          <p style={{ ...T.body, color: B.navy, margin: 0, lineHeight: 1.7 }}>
            {tier === "high"
              ? "Most disruptions would not threaten your financial security. This report confirms what is working and where to focus next."
              : tier === "established"
              ? "You have meaningful structure, but key vulnerabilities remain. This report identifies the gaps and shows you how to close them."
              : tier === "developing"
              ? "You have a foundation, but important gaps leave you exposed. This report shows exactly where the risks are and how to fix them."
              : "A single disruption could create serious financial pressure. This report gives you a clear path to build real protection."}
          </p>
        </div>

        {/* ── INCOME STRUCTURE — visual bar ── */}
        <div style={{ ...reportCardStyle, marginBottom: 16, padding: mobile ? "18px 16px" : "20px 28px" }}>
          <div style={{ ...T.overline, color: B.taupe, marginBottom: 12 }}>YOUR INCOME STRUCTURE</div>
          <div style={{ display: "flex", height: 32, borderRadius: 6, overflow: "hidden", border: "1px solid rgba(14,26,43,0.06)", marginBottom: 12 }}>
            {record.active_income_level > 0 && <div style={{ width: `${record.active_income_level}%`, backgroundColor: "rgba(197,48,48,0.15)", display: "flex", alignItems: "center", justifyContent: "center", borderRight: "2px solid #FFFFFF" }}>{record.active_income_level >= 12 && <span style={{ fontSize: 12, fontWeight: 600, color: B.bandLimited, fontFamily: mono }}>{record.active_income_level}%</span>}</div>}
            {record.semi_persistent_income_level > 0 && <div style={{ width: `${record.semi_persistent_income_level}%`, backgroundColor: "rgba(183,121,31,0.12)", display: "flex", alignItems: "center", justifyContent: "center", borderRight: "2px solid #FFFFFF" }}>{record.semi_persistent_income_level >= 12 && <span style={{ fontSize: 12, fontWeight: 600, color: B.bandDeveloping, fontFamily: mono }}>{record.semi_persistent_income_level}%</span>}</div>}
            {record.persistent_income_level > 0 && <div style={{ width: `${record.persistent_income_level}%`, backgroundColor: "rgba(31,109,122,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>{record.persistent_income_level >= 12 && <span style={{ fontSize: 12, fontWeight: 600, color: B.teal, fontFamily: mono }}>{record.persistent_income_level}%</span>}</div>}
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: B.bandLimited }} /><span style={{ ...T.small, color: B.navy }}><strong style={{ color: B.bandLimited, fontFamily: mono }}>{record.active_income_level}%</strong> stops when you stop</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: B.bandDeveloping }} /><span style={{ ...T.small, color: B.navy }}><strong style={{ color: B.bandDeveloping, fontFamily: mono }}>{record.semi_persistent_income_level}%</strong> recurring</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: B.teal }} /><span style={{ ...T.small, color: B.navy }}><strong style={{ color: B.teal, fontFamily: mono }}>{record.persistent_income_level}%</strong> protected</span></div>
          </div>
        </div>

        {/* ── PRESSUREMAP — structural intelligence ── */}
        {olSelectedScenarios && olSelectedScenarios.length > 0 && (
          <div style={{ ...reportCardStyle, marginBottom: 16, padding: mobile ? "18px 16px" : "20px 28px" }}>
            <div style={{ ...T.overline, color: B.teal, marginBottom: 12 }}>PRESSUREMAP&#8482; INTELLIGENCE</div>
            {olSelectedScenarios.slice(0, 3).map((sc, idx) => (
              <div key={idx} style={{ marginBottom: idx < Math.min(olSelectedScenarios.length, 3) - 1 ? 12 : 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: B.navy, marginBottom: 2 }}>{sc.label}</div>
                <p style={{ ...T.small, color: B.muted, margin: 0, lineHeight: 1.5 }}>{sc.why_it_matters}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── STRUCTURAL ASSESSMENT — tight, 2 sentences each ── */}
        <div style={{ ...reportCardStyle, marginBottom: 16 }}>
          <div style={{ ...T.overline, color: B.taupe, marginBottom: 12 }}>STRUCTURAL ASSESSMENT</div>
          <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 16 }}>
            <div style={{ flex: 1, padding: "16px 20px", borderRadius: 8, backgroundColor: "rgba(31,109,122,0.04)", border: "1px solid rgba(31,109,122,0.08)" }}>
              <div style={{ ...T.sectionLabel, color: B.teal, marginBottom: 8 }}>Structural Strength</div>
              <p style={{ ...T.body, color: B.navy, margin: 0, lineHeight: 1.65 }}>
                {tier === "high"
                  ? `Only ${record.active_income_level}% of your income requires daily effort. You have ${continuityDisplay} of runway if you stopped working entirely.`
                  : tier === "established"
                  ? `You have meaningful recurring income. ${100 - record.active_income_level}% of your earnings have some structural protection.`
                  : `You are earning income and building structure. ${record.semi_persistent_income_level + record.persistent_income_level}% has some repeating foundation.`}
              </p>
            </div>
            <div style={{ flex: 1, padding: "16px 20px", borderRadius: 8, backgroundColor: "rgba(197,48,48,0.03)", border: "1px solid rgba(197,48,48,0.06)" }}>
              <div style={{ ...T.sectionLabel, color: B.bandLimited, marginBottom: 8 }}>Primary Constraint</div>
              <p style={{ ...T.body, color: B.navy, margin: 0, lineHeight: 1.65 }}>
                {tier === "high"
                  ? `${dominantConstraintPlain[dominantConstraint] ? dominantConstraintPlain[dominantConstraint].charAt(0).toUpperCase() + dominantConstraintPlain[dominantConstraint].slice(1) + "." : "Specific structural gaps remain."} Addressing this pushes your score even higher.`
                  : `${record.active_income_level}% of income stops when you stop. ${dominantConstraintPlain[dominantConstraint] ? dominantConstraintPlain[dominantConstraint].charAt(0).toUpperCase() + dominantConstraintPlain[dominantConstraint].slice(1) + "." : "Key structural gaps remain."}`}
              </p>
            </div>
          </div>
        </div>

        <PageFooter section="Key Findings" page={1} />
    </>,

    // Page 2: Stability Plan — actions + roadmap + CTA to Command Center
    <>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 4 }}>Stability Plan</h1>
        <p style={{ ...T.small, color: B.muted, marginBottom: 16, lineHeight: 1.5 }}>
          Based on your score of <span style={{ fontFamily: mono }}>{score}/100</span>, these are your highest-impact changes. Full action plan and scripts in your Command Center.
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

          const stepColors = [B.purple, B.teal, B.navy];
          const steps = viable.slice(0, 3);

          return (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {steps.map((scenario, idx) => {
                  const concrete = liftConcrete[scenario.scenario_id];
                  const aiAction = idx === 0 ? aiPlan?.primary_action : idx === 1 ? aiPlan?.supporting_action : null;
                  const goal = aiAction || concrete?.goal || scenario.label;
                  const action = concrete?.action || scenario.change_description || "";
                  return (
                    <div key={scenario.scenario_id} style={{ ...reportCardStyle, padding: "12px 18px", borderLeft: `3px solid ${stepColors[idx]}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ ...T.overline, color: stepColors[idx], marginBottom: 2 }}>STEP {idx + 1}</div>
                        <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 2 }}>{goal}</div>
                        <p style={{ ...T.small, color: B.muted, margin: 0, lineHeight: 1.45 }}>{action.length > 100 ? action.substring(0, 100) + "..." : action}</p>
                      </div>
                      <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                        <div style={{ fontSize: 22, fontWeight: 300, color: stepColors[idx], lineHeight: 1, fontFamily: mono }}>+{scenario.lift}</div>
                        <div style={{ fontSize: 11, color: B.muted }}>pts</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ── COMBINED IMPACT — brief ── */}
        {v2Lift?.combined_top_two && v2Lift.combined_top_two.lift > 0 && (
          <div style={{ border: "1px solid rgba(14,26,43,0.08)", borderRadius: 6, padding: "12px 18px", marginBottom: 16 }}>
            <div style={{ ...T.sectionLabel, color: B.teal, marginBottom: 4 }}>Combined Impact</div>
            <p style={{ ...T.small, color: B.navy, margin: 0, lineHeight: 1.5 }}>
              Together, these changes would raise your score to <span style={{ fontWeight: 700, color: B.teal, fontFamily: mono }}>{v2Lift.combined_top_two.projected_score}</span> <span style={{ fontFamily: mono }}>(+{v2Lift.combined_top_two.lift})</span>.{v2Lift.combined_top_two.band_shift ? ` Moves to ${v2Lift.combined_top_two.projected_band}.` : ""}
            </p>
          </div>
        )}

        {/* ── WHAT TO AVOID ── */}
        {v2AvoidActions && (v2AvoidActions as string[]).length > 0 && (
          <div style={{ ...reportCardStyle, marginBottom: 16, padding: mobile ? "14px 16px" : "16px 24px" }}>
            <div style={{ ...T.overline, color: B.bandLimited, marginBottom: 8 }}>WHAT TO AVOID</div>
            {(v2AvoidActions as string[]).slice(0, 2).map((a: string, i: number) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: i < 1 ? 6 : 0 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: B.bandLimited, flexShrink: 0, marginTop: 7 }} />
                <span style={{ ...T.small, color: B.muted, lineHeight: 1.5 }}>{a}</span>
              </div>
            ))}
          </div>
        )}

        <PageFooter section="Stability Plan" page={2} />
    </>,

    // Page 3: Stress Testing & Command Center Access
    <>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 4 }}>Stress Testing</h1>
        <p style={{ ...T.small, color: B.muted, marginBottom: 16, lineHeight: 1.5 }}>
          How your score of <span style={{ fontFamily: mono }}>{score}</span> holds up under disruption.
        </p>

        {/* ── SCENARIOS ── */}
        {v2Scenarios && v2Scenarios.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            {v2Scenarios.slice(0, 3).map((sc: { title: string; original_score: number; scenario_score: number; score_drop: number; narrative?: string; band_shift?: boolean; original_band?: string; scenario_band?: string }, idx: number) => {
              const sBorders = [C.bandLimited, C.bandDeveloping, C.navy];
              return (
                <div key={idx} style={{ ...reportCardStyle, padding: "12px 18px", borderLeft: `3px solid ${sBorders[idx]}`, marginBottom: 8 }}>
                  <div style={{ ...T.overline, color: sBorders[idx], marginBottom: 2 }}>SCENARIO {idx + 1}</div>
                  <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 4 }}>{sc.title}</div>
                  <div style={{ ...T.small, color: B.muted, marginBottom: 2 }}>
                    Score drops by <span style={{ fontFamily: mono, fontWeight: 600 }}>{sc.score_drop}</span> points (<span style={{ fontFamily: mono }}>{sc.original_score} &rarr; {sc.scenario_score}</span>)
                  </div>
                  {sc.narrative && <p style={{ ...T.meta, color: B.teal, margin: "4px 0 0", lineHeight: 1.4 }}>{sc.narrative.length > 120 ? sc.narrative.substring(0, 120) + "..." : sc.narrative}</p>}
                </div>
              );
            })}
          </div>
        )}

        {/* ── FRAGILITY ASSESSMENT ── */}
        {v2Fragility && (() => {
          const frag = v2Fragility as { fragility_score: number; fragility_class: string; primary_failure_mode: string; secondary_failure_modes?: string[] };
          const fragColor = frag.fragility_class === "brittle" || frag.fragility_class === "thin" ? C.bandLimited : frag.fragility_class === "uneven" ? C.bandDeveloping : B.teal;
          const failureModeLabels: Record<string, string> = {
            concentration_collapse: "Concentration collapse — one source departure destabilizes the structure",
            labor_interruption: "Labor interruption — income stops when work stops",
            visibility_gap: "Visibility gap — not enough income committed ahead of time",
            durability_thinness: "Durability thinness — income agreements are short-term or easily canceled",
          };
          return (
            <div style={{ ...reportCardStyle, padding: mobile ? "18px 16px" : "20px 24px", marginBottom: 16 }}>
              <div style={{ ...T.overline, color: B.muted, marginBottom: 8 }}>STRUCTURAL FRAGILITY</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 300, color: fragColor, fontFamily: mono, lineHeight: 1 }}>{frag.fragility_score}</span>
                <span style={{ fontSize: 13, color: B.muted, fontFamily: mono }}>/100</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: fragColor }}>{frag.fragility_class.charAt(0).toUpperCase() + frag.fragility_class.slice(1)}</span>
              </div>
              {frag.primary_failure_mode && (
                <div style={{ marginTop: 4 }}>
                  <div style={{ ...T.small, color: B.muted, lineHeight: 1.5 }}>{failureModeLabels[frag.primary_failure_mode] || frag.primary_failure_mode}</div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ── REAL-WORLD IMPACT ── */}
        <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, ...reportCardStyle, padding: "14px 18px", borderLeft: `3px solid ${C.bandLimited}` }}>
            <div style={{ ...T.overline, color: C.bandLimited, marginBottom: 6 }}>IF BIGGEST SOURCE LEAVES</div>
            <div style={{ fontSize: 22, fontWeight: 300, color: B.navy, fontFamily: mono, marginBottom: 2 }}>{score} &rarr; {riskScenarioScore}</div>
            <div style={{ ...T.small, color: B.muted }}>Score drops by <span style={{ fontFamily: mono, fontWeight: 600 }}>{riskScenarioDrop}</span> points</div>
          </div>
          <div style={{ flex: 1, ...reportCardStyle, padding: "14px 18px", borderLeft: `3px solid ${C.bandDeveloping}` }}>
            <div style={{ ...T.overline, color: C.bandDeveloping, marginBottom: 6 }}>IF YOU STOP WORKING</div>
            <div style={{ fontSize: 22, fontWeight: 300, color: B.navy, fontFamily: mono, marginBottom: 2 }}>{continuityDisplay}</div>
            <div style={{ ...T.small, color: B.muted }}>{continuityText}</div>
          </div>
        </div>

        <SectionDivider />

        {/* ── COMMAND CENTER ACCESS ── */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ ...T.overline, color: B.purple, marginBottom: 8 }}>COMMAND CENTER ACCESS</div>
          <p style={{ ...T.small, color: B.navy, margin: "0 0 12px", lineHeight: 1.55 }}>
            Open at <span style={{ fontWeight: 600 }}>runpayway.com/dashboard</span> using the access code on your cover page.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
            {[
              "PressureMap\u2122 structural intelligence",
              "What-if simulator with lifetime access",
              "12-week execution roadmap",
              "Industry-specific benchmarks",
            ].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: B.teal, flexShrink: 0 }} />
                <span style={{ ...T.small, color: B.navy }}>{item}</span>
              </div>
            ))}
          </div>
          <div onClick={() => router.push("/dashboard")} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, border: `1px solid ${B.navy}`, color: B.navy, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Open Command Center &rarr;
          </div>
        </div>

        {/* ── METHODOLOGY ── */}
        <div style={{ paddingTop: 12, borderTop: `1px solid ${B.stone}` }}>
          <p style={{ ...T.meta, color: B.taupe, margin: 0, lineHeight: 1.5, fontStyle: "italic" }}>
            Scored by RunPayway&#8482; Model RP-2.0 — a deterministic system using fixed rules and weights. Same inputs always produce the same score. Not financial advice.
          </p>
        </div>

        <PageFooter section="Stress Testing" page={3} />
    </>,

  ];

  return (
    <ReportErrorBoundary>
    {/* Print stylesheet */}
    <style>{`
      @media print {
        @page {
          size: letter;
          margin: 0;
        }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
        html, body { margin: 0 !important; padding: 0 !important; background: white !important; }
        #paginated-view { display: none !important; }
        .print-report { display: block !important; }
        .print-report .print-page {
          width: 8.5in;
          height: 11in;
          padding: 0.6in 0.7in;
          margin: 0;
          page-break-after: always;
          page-break-inside: avoid;
          box-sizing: border-box;
          overflow: hidden;
          position: relative;
          font-family: ${sans};
          display: flex;
          flex-direction: column;
        }
        .print-report .print-page:last-child {
          page-break-after: auto;
        }
        .report-page-footer { margin-top: auto; }
        nav, footer, .no-print { display: none !important; }
        a { text-decoration: none !important; color: inherit !important; }
        button { background: none !important; border: none !important; padding: 0 !important; color: inherit !important; }
      }
      @media not print {
        .print-report { display: none !important; }
      }
    `}</style>

    {/* Hidden print container — fixed-size pages for exact PDF output */}
    <div className="print-report">
      {pageContents.map((content, i) => (
        <div key={i} className="print-page">
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
            <Link href="/dashboard" style={{ fontSize: 12, color: "#4B3FAE", textDecoration: "none", fontWeight: 600, padding: "6px 10px" }}>RunPayway&#8482; Command Center</Link>
            <div style={{ width: 1, height: 16, backgroundColor: "rgba(14,26,43,0.10)" }} />
            <button
              onClick={handleDownload}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 12, color: "rgba(14,26,43,0.50)",
                padding: "6px 10px", fontWeight: 500,
              }}
            >
              Print / PDF
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
