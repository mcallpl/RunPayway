"use client";

import { useEffect, useState, useRef, Component, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoImg from "../../../../public/runpayway-logo.png";
import { useAssessmentServer } from "@/lib/monitoring";
import { simulateScore, SIMULATOR_PRESETS, computeProgressionTiers } from "@/lib/engine/v2/simulate";
import type { CanonicalInput } from "@/lib/engine/v2/types";

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
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "#0E1A2B", marginBottom: 12 }}>
            Something went wrong loading your report
          </h2>
          <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24, maxWidth: 400 }}>
            Your assessment was saved. Please try refreshing the page. If the problem persists, contact support@runpayway.com.
          </p>
          <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 24 }}>{this.state.error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: "10px 24px", fontSize: 14, fontWeight: 500, color: "#fff", backgroundColor: "#0E1A2B", border: "none", borderRadius: 10, cursor: "pointer" }}
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
  pagePad: 40,
  headerMb: 16,
  sectionGap: 24,
  labelMb: 8,
  paraMb: 12,
  itemGap: 12,
  dividerMy: 20,
  footerMt: 16,
};

// ── Typography: 7-step scale optimized for print clarity ──
const T = {
  score: { fontSize: 72, fontWeight: 600, lineHeight: 1 },                                          // The big number
  pageTitle: { fontSize: 24, fontWeight: 600, lineHeight: 1.2, color: "#0E1A2B" },                  // Page titles
  sectionTitle: { fontSize: 15, fontWeight: 600, lineHeight: 1.3, color: "#0E1A2B" },               // Major section headers (H2)
  classification: { fontSize: 16, fontWeight: 500, lineHeight: 1.3 },                               // Band label
  overline: { fontSize: 9.5, fontWeight: 700, lineHeight: 1.3, letterSpacing: "0.12em", textTransform: "uppercase" as const },  // Card/metadata labels
  sectionLabel: { fontSize: 12, fontWeight: 600, lineHeight: 1.4 },                                 // Bold inline labels
  cardHeading: { fontSize: 13, fontWeight: 600, lineHeight: 1.35 },                                 // Card titles
  cardHero: { fontSize: 22, fontWeight: 600, lineHeight: 1.1 },                                     // Card hero numbers
  body: { fontSize: 11.5, fontWeight: 400, lineHeight: 1.65 },                                      // Paragraph text
  small: { fontSize: 10.5, fontWeight: 400, lineHeight: 1.55 },                                     // Secondary text
  meta: { fontSize: 10, fontWeight: 400, lineHeight: 1.5 },                                         // Fine print (bumped for print)
  micro: { fontSize: 9, fontWeight: 700, lineHeight: 1.3 },                                         // Severity tags (bumped for print)
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
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: R.headerMb, paddingBottom: 14, borderBottom: "1px solid rgba(14,26,43,0.12)" }}>
      <Image src={logoImg} alt="RunPayway" width={120} height={14} style={{ height: "auto" }} />
      <div style={{ textAlign: "right" }}>
        <div style={{ ...T.meta, color: B.taupe }}>Income Stability Score™</div>
        <div style={{ ...T.meta, color: B.taupe }}>Model RP-2.0</div>
      </div>
    </div>
  );
}

function Overline({ children, large }: { children: React.ReactNode; large?: boolean }) {
  return large
    ? <div style={{ ...T.sectionTitle, color: B.navy, marginBottom: R.labelMb }}>{children}</div>
    : <div style={{ ...T.overline, color: B.teal, marginBottom: 6 }}>{children}</div>;
}

function SectionDivider() {
  return <div style={{ height: 1, backgroundColor: "rgba(14,26,43,0.08)", marginTop: R.dividerMy, marginBottom: R.dividerMy }} />;
}

function PageFooter({ section, page }: { section: string; page: number }) {
  return (
    <div className="report-page-footer" style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid rgba(14,26,43,0.12)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ ...T.meta, color: B.taupe }}>{section} · Page {page}</span>
        <span style={{ ...T.meta, color: B.taupe }}>Model RP-2.0 · runpayway.com/methodology</span>
      </div>
    </div>
  );
}

function MetricCard({ label, value, explanation }: { label: string; value: React.ReactNode; explanation: string; accent?: string }) {
  return (
    <div style={{ flex: 1, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "16px 20px" }}>
      <div style={{ ...T.overline, color: B.teal, marginBottom: 6 }}>{label}</div>
      <div style={{ ...T.sectionTitle, marginBottom: 6 }}>{value}</div>
      <div style={{ ...T.small, color: B.muted, lineHeight: 1.55 }}>{explanation}</div>
    </div>
  );
}

function DiagnosisBlock({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderLeft: `3px solid ${B.purple}`, borderRadius: 4, padding: "18px 22px" }}>
      {children}
    </div>
  );
}

function SimpleTermsBox({ title, copy, takeaway }: { title: string; copy: string; takeaway: string }) {
  return (
    <div style={{ backgroundColor: B.sand, borderTop: `1px solid ${B.stone}`, borderBottom: `1px solid ${B.stone}`, padding: "16px 20px", marginTop: 12, marginBottom: 12 }}>
      <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>{title}</div>
      <p style={{ ...T.body, color: B.navy, margin: "0 0 8px", maxWidth: 520, lineHeight: 1.55 }}>{copy}</p>
      <p style={{ ...T.small, color: B.muted, margin: 0, fontStyle: "italic" }}>{takeaway}</p>
    </div>
  );
}

function ReportPage({ children, noPad }: { record: AssessmentRecord; children: React.ReactNode; noPad?: boolean }) {
  return (
    <div className="report-page" style={{
      width: PDF.captureW,
      maxWidth: "100%",
      backgroundColor: B.sand,
      border: "none",
      borderRadius: 0,
      padding: noPad ? 0 : R.pagePad,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      overflow: "visible",
      position: "relative",
    }}>
      {/* Top accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #4B3FAE 0%, #1F6D7A 100%)" }} />
      {children}
    </div>
  );
}

// ── QR Code component ──
function QRCodeImage({ recordId, authCode, score, band, date, model }: { recordId: string; authCode?: string; score?: number; band?: string; date?: string; model?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const params = new URLSearchParams();
    params.set("id", recordId);
    if (authCode) params.set("auth", authCode);
    if (score !== undefined) params.set("s", String(score));
    if (band) params.set("b", band);
    if (date) params.set("d", date);
    if (model) params.set("m", model);
    const url = `https://peoplestar.com/RunPayway/verify?${params.toString()}`;
    import("qrcode").then((QRCode) => {
      QRCode.toCanvas(canvas, url, {
        width: 140,
        margin: 2,
        color: { dark: "#0E1A2B", light: "#FFFFFF" },
        errorCorrectionLevel: "M",
      });
    }).catch(() => {});
  }, [recordId, authCode]);

  return <canvas ref={canvasRef} width={140} height={140} style={{ width: 80, height: 80 }} />;
}

// ============================================================
// PDF DOWNLOAD
// ============================================================

function findSafeCutRow(
  canvas: HTMLCanvasElement,
  targetY: number,
  searchRange: number,
): number {
  const width = canvas.width;
  const minY = Math.max(0, targetY - searchRange);
  const maxY = targetY;
  const searchHeight = maxY - minY;
  if (searchHeight <= 0) return targetY;

  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.getImageData(0, minY, width, searchHeight);
  const pixels = imageData.data;
  const sampleStep = Math.max(1, Math.floor(width / 80));
  const threshold = 4;

  for (let offset = 0; offset < searchHeight; offset++) {
    const localRow = searchHeight - 1 - offset;
    let nonWhiteCount = 0;
    const rowStart = localRow * width * 4;

    for (let x = 0; x < width; x += sampleStep) {
      const idx = rowStart + x * 4;
      if (pixels[idx] < 245 || pixels[idx + 1] < 245 || pixels[idx + 2] < 245) {
        nonWhiteCount++;
        if (nonWhiteCount > threshold) break;
      }
    }

    if (nonWhiteCount <= threshold) {
      return minY + localRow;
    }
  }

  return targetY;
}

async function downloadPDF(record: AssessmentRecord) {
  let html2canvas: typeof import("html2canvas").default;
  let jsPDF: typeof import("jspdf").jsPDF;

  try {
    html2canvas = (await import("html2canvas")).default;
    jsPDF = (await import("jspdf")).jsPDF;
  } catch {
    alert("PDF generation libraries failed to load. Please check your connection and try again.");
    return;
  }

  // Capture entire report as one continuous flow — no artificial page breaks
  const reportContainer = document.getElementById("report-container");
  if (!reportContainer) return;

  const pdf = new jsPDF({ orientation: "portrait", unit: "in", format: "letter" });
  pdf.setProperties({
    title: `Income Stability Assessment — ${record.assessment_title || "Report"}`,
    author: "RunPayway",
    subject: "Income Stability Score Report",
    keywords: "income stability, assessment, RunPayway, income analysis",
    creator: `RunPayway Model ${record.model_version || "RP-2.0"}`,
  });

  const { captureW, scale: S, pageW: PW, pageH: PH, margin: M, footer: FT, contentW: CW, canvasW, pxPerInch, sliceH } = PDF;

  // Hide all HTML page footers (PDF adds its own) and interactive-only sections
  const htmlFooters = reportContainer.querySelectorAll(".report-page-footer") as NodeListOf<HTMLElement>;
  htmlFooters.forEach((f) => { f.style.display = "none"; });
  const noPrintEls = reportContainer.querySelectorAll(".no-print") as NodeListOf<HTMLElement>;
  noPrintEls.forEach((el) => { el.style.display = "none"; });

  // Temporarily style for capture
  const savedContainerStyle = {
    maxWidth: reportContainer.style.maxWidth,
    gap: (reportContainer as HTMLElement).style.gap,
  };
  reportContainer.style.maxWidth = `${captureW}px`;
  (reportContainer as HTMLElement).style.gap = "0px";

  const pages = reportContainer.querySelectorAll(".report-page") as NodeListOf<HTMLElement>;
  const savedPageStyles: Array<Record<string, string>> = [];
  pages.forEach((el, i) => {
    savedPageStyles[i] = { width: el.style.width, maxWidth: el.style.maxWidth, border: el.style.border, borderRadius: el.style.borderRadius, boxSizing: el.style.boxSizing, overflow: el.style.overflow };
    el.style.width = `${captureW}px`;
    el.style.maxWidth = `${captureW}px`;
    el.style.boxSizing = "border-box";
    el.style.border = "none";
    el.style.borderRadius = "0";
    el.style.overflow = "visible";
  });

  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  const canvas = await html2canvas(reportContainer as HTMLElement, {
    scale: S,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    width: captureW,
    height: reportContainer.scrollHeight,
    windowWidth: captureW,
  });

  // Restore styles
  pages.forEach((el, i) => { Object.assign(el.style, savedPageStyles[i]); });
  htmlFooters.forEach((f) => { f.style.display = ""; });
  noPrintEls.forEach((el) => { el.style.display = ""; });
  reportContainer.style.maxWidth = savedContainerStyle.maxWidth;
  (reportContainer as HTMLElement).style.gap = savedContainerStyle.gap;

  const totalCanvasH = canvas.height;
  let currentY = 0;
  let pdfPageCount = 0;

  while (currentY < totalCanvasH) {
    if (pdfPageCount > 0) pdf.addPage();
    pdfPageCount++;

    let cutY: number;
    const idealCutY = currentY + sliceH;

    if (idealCutY >= totalCanvasH) {
      cutY = totalCanvasH;
    } else {
      cutY = findSafeCutRow(canvas, idealCutY, 200);
    }

    const srcH = Math.max(1, cutY - currentY);

    const strip = document.createElement("canvas");
    strip.width = canvasW;
    strip.height = srcH;
    const ctx = strip.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasW, srcH);
    ctx.drawImage(canvas, 0, currentY, canvasW, srcH, 0, 0, canvasW, srcH);

    const imgH = srcH / pxPerInch;
    pdf.addImage(strip.toDataURL("image/png"), "PNG", M, M, CW, imgH);

    currentY = cutY;
  }

  for (let p = 1; p <= pdfPageCount; p++) {
    pdf.setPage(p);

    pdf.setDrawColor(220, 218, 212);
    pdf.setLineWidth(0.004);
    pdf.line(M, PH - FT + 0.05, PW - M, PH - FT + 0.05);

    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(7);
    pdf.setTextColor(156, 163, 175);
    pdf.text(
      `Confidential — Prepared for ${record.assessment_title || "Assessment Subject"}`,
      M,
      PH - FT + 0.2,
    );

    pdf.setFont("helvetica", "normal");
    pdf.text("support@runpayway.com", PW - M, PH - FT + 0.2, { align: "right" });

    pdf.setFontSize(7.5);
    pdf.setTextColor(156, 163, 175);
    pdf.text(`Page ${p} of ${pdfPageCount}`, PW / 2, PH - FT + 0.35, { align: "center" });
  }

  const shortId = record.record_id.slice(0, 8);
  pdf.save(`RunPayway-Income-Stability-Report-${shortId}.pdf`);
}


// ============================================================
// MAIN PAGE
// ============================================================

export default function ReviewPage() {
  const router = useRouter();
  const [record, setRecord] = useState<AssessmentRecord | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [linkCopied, setLinkCopied] = useState(false);
  const [advisorEmail, setAdvisorEmail] = useState("");
  const [advisorSending, setAdvisorSending] = useState(false);
  const [advisorSent, setAdvisorSent] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const [simPreset, setSimPreset] = useState<string | null>(null);
  const [expandedScript, setExpandedScript] = useState<string | null>(null);
  const monitoringTracked = useRef(false);
  const emailSent = useRef(false);
  const scoreAnimated = useRef(false);

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
    const duration = 1500;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setAnimatedScore(Math.round(eased * target));
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
  const actionPlan: string[] = safeJsonParse(record.action_plan_payload, []);
  const constraintGuidance: string[] = safeJsonParse(record.constraint_guidance_payload, []);
  const evolutionSteps: string[] = safeJsonParse(record.evolution_path_steps_payload, []);
  const advisorGuide: { talking_points: string[]; client_questions: string[]; red_flags: string[]; next_steps: string[] } = safeJsonParse(record.advisor_discussion_guide_payload, { talking_points: [], client_questions: [], red_flags: [], next_steps: [] });

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
      ? "As a contractor, losing your primary client would be devastating. Secure at least 2–3 active contracts at all times."
      : opStructure.includes("employee")
      ? "As a salaried employee, your income depends entirely on one employer. Building a secondary income stream is critical."
      : profileClass.includes("business")
      ? "Your business revenue is too concentrated. No single client should represent more than 30% of total revenue."
      : "Your income is too concentrated in one source. Diversify to protect against sudden loss.",
    forward_visibility: incomeModel.includes("commission") || incomeModel.includes("project")
      ? `With ${incomeModelDesc} income, future earnings are unpredictable. Lock in advance commitments, retainers, or pipeline guarantees.`
      : opStructure.includes("contractor")
      ? "As a contractor, secure multi-month engagements or retainer agreements instead of rolling month-to-month."
      : profileClass.includes("business")
      ? "Your business needs more contracted or recurring revenue locked in before each month begins."
      : "Too little of your income is committed before the month starts. Lock in recurring or pre-committed income.",
    labor_dependence: opStructure.includes("employee")
      ? "As an employee, 100% of your income stops if you stop working. Build passive or semi-passive income alongside your salary."
      : incomeModel.includes("consulting") || incomeModel.includes("client")
      ? "Your consulting income requires constant client delivery. Productize your expertise into courses, templates, or licensing."
      : profileClass.includes("business")
      ? "Your business is still owner-dependent. Build systems, recurring revenue, or delegated delivery so income continues without you."
      : "Too much income requires your daily effort. Shift toward streams that produce without constant work.",
    low_continuity: incomeModel.includes("commission")
      ? "Commission income stops immediately when deals stop closing. Build a base of recurring or residual commissions."
      : opStructure.includes("contractor")
      ? "Contract income has a short shelf life. Negotiate longer-term contracts or build retainer relationships."
      : "Your income would stop too quickly if active work paused. Build streams that continue producing independently.",
    few_sources: profileClass.includes("business")
      ? "Your business relies on too few revenue channels. Add a new client segment, product line, or service tier."
      : opStructure.includes("contractor")
      ? "You need more active clients. Each new contract that contributes at least 10% of income strengthens the structure."
      : "Your income comes from too few sources. Adding even one more meaningful source significantly reduces risk.",
  };

  // ── Tier-aware copy ──
  const copy = {
    p1_headline: ({
      A1: `You scored ${score} out of 100 as a ${structureDesc} in ${industrySector}. Most of the income protection you need is not in place yet. This report shows you exactly where you are exposed and what to do first.`,
      A2: `You scored ${score} out of 100 as a ${structureDesc} in ${industrySector}. Your income is active but not protected. If conditions change, you have very little cushion.`,
      A3: `You scored ${score} out of 100 as a ${structureDesc} in ${industrySector}. You have some early protection, but you are still below a stable range. This report shows you what to fix first.`,
      B1: `You scored ${score} out of 100 as a ${structureDesc} in ${industrySector}. Your income is developing but not yet protected enough. The next gains come from building protection, not earning more.`,
      B2: `You scored ${score} out of 100 as a ${structureDesc} in ${industrySector}. You are making progress, but your income still needs stronger protection before it can handle disruption.`,
      C1: `You scored ${score} out of 100 as a ${structureDesc} in ${industrySector}. You have real stability. This report shows the remaining gaps and how to close them.`,
      C2: `You scored ${score} out of 100 as a ${structureDesc} in ${industrySector}. Your income is established and relatively stable. This report shows where to refine.`,
      D1: `You scored ${score} out of 100 as a ${structureDesc} in ${industrySector}. Your income is strong with substantial protection in place. This report shows how to maintain it.`,
      D2: `You scored ${score} out of 100 as a ${structureDesc} in ${industrySector}. Your income is exceptionally well-protected. This report shows how to keep it that way.`,
    })[subTier],
    p5_reassess: "Retake after real structural improvement is active, not after a short-term earnings spike.",
  };

  // ── V2 engine data (must be before band-sensitive copy) ──
  const v2 = record._v2;
  const v2Fragility = v2?.fragility ?? null;
  const v2Confidence = v2?.confidence ?? null;
  const v2Quality = v2?.quality ?? null;
  const v2Sensitivity = v2?.sensitivity ?? null;
  const v2Interactions = v2?.interactions ?? null;
  const v2Constraints = v2?.constraints ?? null;
  const v2Scenarios = v2?.scenarios ?? null;
  const v2Lift = v2?.score_lift_projection ?? null;
  const v2AvoidActions = v2?.avoid_actions ?? null;
  const v2Triggers = v2?.reassessment_triggers ?? null;
  const v2Benchmarks = v2?.benchmarks ?? null;
  const v2Scores = v2?.scores ?? null;

  // ── Strategic insight data (RP-2.1) ──
  const v2SurprisingInsights = v2?.surprising_insights ?? null;
  const v2TradeoffNarratives = v2?.tradeoff_narratives ?? null;
  const v2OneThingThatMatters = v2?.one_thing_that_matters ?? null;
  const v2ReusableFramework = v2?.reusable_framework ?? null;
  const v2PredictiveWarnings = v2?.predictive_warnings ?? null;
  const v2BehavioralInsights = v2?.behavioral_insights ?? null;
  const v2ExecutionRoadmap = v2?.execution_roadmap ?? null;
  const v2ScriptTemplates = v2?.script_templates ?? null;
  const v2NormalizedInputs = v2?.normalized_inputs ?? null;

  // ── Outcome layer ──
  const ol = v2?.outcome_layer;
  const olActions = ol?.ranked_action_map ?? null;
  const olAvoid = ol?.avoid_actions ?? null;
  const olExplanations = ol?.explanation_translation_layer ?? null;
  const olTriggers = ol?.reassessment_trigger_set ?? null;
  const olStrongerPatterns = ol?.stronger_structure_patterns ?? null;
  const olScenarios = ol?.selected_scenarios ?? null;
  const olFamilyLabel = ol?.income_model_family?.family_label ?? null;
  const olIndustryLabel = ol?.industry_refinement_profile?.industry_label ?? null;
  const olBenchmark = ol?.benchmark_context_layer ?? null;

  // ── Deep engine data for rich personalization ──
  const v2Explainability = v2?.explainability as { why_this_score?: string; why_not_higher?: string; strongest_supports?: string[]; strongest_suppressors?: string[]; best_lift_explanation?: string; fragility_explanation?: string } | undefined;
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

  const peerPercentileValue = record.peer_stability_percentile ?? (v2Benchmarks?.peer_percentile ?? 50);
  const peerInterpretation: string =
    peerPercentileValue <= 10 ? "far below benchmark" :
    peerPercentileValue <= 30 ? "below benchmark" :
    peerPercentileValue <= 60 ? "around benchmark" :
    peerPercentileValue <= 85 ? "above benchmark" : "well above benchmark";

  const durabilityValue: Record<string, string> = {
    A1: "Very weak protection", A2: "Weak protection", A3: "Limited protection",
    B1: "Needs stronger protection", B2: "Partly protected",
    C1: "Moderately protected", C2: "Meaningfully protected",
    D1: "Strong protection", D2: "Very strong protection",
  };

  const durabilityBody: Record<string, string> = {
    A1: "The structure has very little protection in place if conditions change.",
    A2: "The structure has some support, but not enough to absorb disruption well.",
    A3: "Some support exists, but the structure is still below a stable level of protection.",
    B1: "The structure is improving, but it is still vulnerable in important areas.",
    B2: "The structure has a foundation, but stronger protection is still needed.",
    C1: "The structure has real support, but not enough protection yet against meaningful disruption.",
    C2: "The structure is relatively stable, though some vulnerabilities still matter.",
    D1: "The structure is strong and holds up well under most common disruptions.",
    D2: "The structure is highly durable and well-protected across the benchmark.",
  };

  const p2Intro: Record<string, string> = {
    A1: `Here is how ${name}'s ${incomeModelDesc} income in ${industrySector} actually works — where it comes from, how it flows, and where it breaks.`,
    A2: `This is the structural breakdown of ${name}'s income. As a ${structureDesc} with ${revenueDesc}, here is what the data shows.`,
    A3: `${name} has early structure. Here is the composition of the ${incomeModelDesc} income in ${industrySector} — and where the gaps are.`,
    B1: `The ${incomeModelDesc} income in ${industrySector} is developing. Here is the breakdown — what is working and what is exposed.`,
    B2: `${name}'s income structure is taking shape. Here is the composition — ${record.active_income_level}% active, ${record.persistent_income_level}% persistent.`,
    C1: `${name}'s ${incomeModelDesc} structure in ${industrySector} has real protection. Here is the composition and where the remaining exposure sits.`,
    C2: `Established ${incomeModelDesc} structure. Here is how the income is composed — and the specific areas that still matter.`,
    D1: `Strong ${incomeModelDesc} structure with ${record.persistent_income_level}% persistent income. Here is the full composition.`,
    D2: `Exceptionally well-built. Here is the structural detail behind the ${score}/100 score.`,
  };

  const p2Interpretation: Record<string, string> = {
    A1: `The main issue: ${dominantConstraintPlain[dominantConstraint]}. With ${record.income_continuity_pct}% continuity and a ${record.risk_scenario_drop}-point stress test drop, the ${incomeModelDesc} structure could collapse quickly under pressure.`,
    A2: `The main issue — ${dominantConstraintPlain[dominantConstraint]} — must be addressed before anything else. As a ${structureDesc}, this is the priority.`,
    A3: `Some structure is forming, but the ${incomeModelDesc} setup is still below stable. Focus: strengthen continuity and balance.`,
    B1: `The main issue — ${dominantConstraintPlain[dominantConstraint]} — still limits protection. As a ${structureDesc} in ${industrySector}, the next step is turning progress into durability.`,
    B2: `Stronger protection is needed. The ${record.risk_scenario_drop}-point stress test drop and ${record.income_continuity_pct}% continuity show where the ${incomeModelDesc} structure is still exposed.`,
    C1: `${dominantConstraintPlain[dominantConstraint].charAt(0).toUpperCase() + dominantConstraintPlain[dominantConstraint].slice(1)} still limits full protection. The ${record.risk_scenario_drop}-point stress test drop shows remaining exposure in this ${incomeModelDesc} structure.`,
    C2: `The structure is established. Remaining gains come from reducing concentration risk and extending continuity in this ${incomeModelDesc} setup.`,
    D1: `Well-protected. Focus on preserving strength and reducing the remaining ${record.risk_scenario_drop}-point stress test exposure.`,
    D2: `Exceptionally strong. Maintain discipline and avoid unnecessary fragility in this ${incomeModelDesc} structure.`,
  };

  const p2BottomLine: Record<string, string> = {
    A1: `${name} needs protection first, not more output. As a ${structureDesc}, build structural safeguards before scaling.`,
    A2: `${name} needs stronger protection. The ${incomeModelDesc} structure cannot absorb disruption yet.`,
    A3: `${name} has a starting structure. Turn it into something stable by addressing ${dominantConstraintPlain[dominantConstraint]}.`,
    B1: `${name} is developing. The next gains come from protection, not more output.`,
    B2: `${name} is progressing. Strengthen the structure so the ${incomeModelDesc} income holds up under pressure.`,
    C1: `${name} has real stability. Strengthen protection to lock it in.`,
    C2: `${name} is established. Refine and harden what is already working.`,
    D1: `${name} is strong. Preserve resilience and close the remaining gaps.`,
    D2: `${name} is exceptionally strong. Maintain discipline.`,
  };

  const p2WorkingBody: string = ["A1", "A2"].includes(subTier) ? `Not starting from zero. As a ${structureDesc} with ${incomeModelDesc} income, this is an early base to build from.` : ["A3"].includes(subTier) ? `A base exists in the ${incomeModelDesc} structure, but still below a stable range.` : subTier === "B1" ? `The ${incomeModelDesc} structure is building, but important weaknesses remain.` : subTier === "B2" ? `Parts of the ${incomeModelDesc} structure support stability. Stronger protection is still needed.` : ["C1", "C2"].includes(subTier) ? `The ${incomeModelDesc} structure is working. Next gains come from strengthening what exists.` : `Protection is substantial in this ${incomeModelDesc} structure. Focus: refinement.`;

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

  const p4CurrentBandBody: Record<string, string> = {
    A1: `The ${incomeModelDesc} structure is fragile. As a ${structureDesc}, build protection first.`,
    A2: `The ${incomeModelDesc} structure needs stronger protection before it can absorb disruption.`,
    A3: `Some early ${incomeModelDesc} structure exists but is still below stable for a ${structureDesc}.`,
    B1: `The ${incomeModelDesc} structure is developing but not yet strong enough for a ${structureDesc} in ${industrySector}.`,
    B2: `The ${incomeModelDesc} structure has a foundation. Stronger protection is needed.`,
    C1: `The ${incomeModelDesc} structure is stable but not yet fully protected.`,
    C2: `Established ${incomeModelDesc} structure with limited vulnerabilities remaining.`,
    D1: `Strong ${incomeModelDesc} structure. Only limited refinements needed.`,
    D2: `Exceptionally strong. Refinement, not repair.`,
  };

  const p4TargetBandBody: string = (() => {
    if (tier === "high") return "The focus now is not a new band. It is preserving strength and reducing remaining weak points.";
    const distanceNote = bandDistance === "CLOSE" ? " A few practical changes could make this realistic." : bandDistance === "MODERATE" ? " This is achievable with sustained structural improvement." : " This will take sustained effort, but each step reduces vulnerability.";
    if (tier === "limited") return "The next level means moving from fragile or early-stage structure into something more stable and better protected." + distanceNote;
    if (tier === "developing") return "The next level means moving from a developing structure into one with clearer stability and stronger protection." + distanceNote;
    return "The next level means moving from established stability into a more resilient and well-protected structure." + distanceNote;
  })();

  const p4CombinedLine: string = (() => {
    if (tier === "high") return "These changes would further strengthen an already strong structure.";
    if (bandDistance === "CLOSE") return `A few practical changes could move ${name} into ${score < 30 ? "Developing" : score < 50 ? "Established" : "High"} Stability. Near-term improvement is realistic.`;
    if (bandDistance === "FAR" && tier === "limited") return "These changes would be a meaningful first step. More than one round of improvement may be needed, but each step materially reduces vulnerability.";
    if (bandDistance === "FAR" && tier === "developing") return `These changes would strengthen protection meaningfully. The next band is achievable, but will take sustained effort.`;
    if (bandDistance === "FAR") return "These changes would create meaningful progress toward stronger protection.";
    // MODERATE
    if (tier === "limited") return "These changes would create real progress, even if more work would still be needed to move fully out of Limited Stability.";
    if (tier === "developing") return `Together, these changes would create meaningful progress toward Established Stability.`;
    return `Together, these changes could move ${name} deeper into stability and strengthen protection against disruption.`;
  })();

  const p5Intro: Record<string, string> = {
    A1: `As a ${structureDesc} in ${industrySector}, ${name} needs basic protection first: secure income ahead of time, reduce single-source reliance, and build income that continues if work stops.`,
    A2: `${name} needs structural protection before growth. As a ${structureDesc} with ${incomeModelDesc} income, focus on durability.`,
    A3: `${name} has early structure. As a ${structureDesc} in ${industrySector}, the next step is turning ${incomeModelDesc} income into something stable.`,
    B1: `${name} needs to strengthen the developing ${incomeModelDesc} structure so it handles disruption in ${industrySector}.`,
    B2: `${name} needs stronger protection, better continuity, and less concentration risk in this ${incomeModelDesc} setup.`,
    C1: `As a ${structureDesc} in ${industrySector}, the priority is strengthening protection and forward visibility.`,
    C2: `Refine the established ${incomeModelDesc} structure to become more durable and less exposed.`,
    D1: `Preserve strength, reduce residual vulnerabilities, and maintain continuity in this ${incomeModelDesc} structure.`,
    D2: `Maintain discipline and long-term resilience. The ${incomeModelDesc} structure is strong — protect it.`,
  };

  const p5CompareInterpretation: string = (() => {
    const pct = peerPercentileValue;
    const avg = v2Benchmarks?.cluster_average_score ?? 42;
    const top20 = v2Benchmarks?.top_20_threshold ?? 65;
    if (score < avg && pct <= 10) return `This score is well below the peer average of ${avg} and far from the top 20% benchmark of ${top20}. Strengthening the structure would close this gap meaningfully.`;
    if (score < avg && pct <= 30) return `This score is below the peer average of ${avg}. Reaching the peer average is a realistic near-term target, with the top 20% benchmark of ${top20} as a longer-term goal.`;
    if (score < avg) return `This score is approaching the peer average of ${avg}. A few structural improvements could move it above average.`;
    if (score >= top20) return `This score is above both the peer average of ${avg} and the top 20% benchmark of ${top20}. The focus now is maintaining this position.`;
    if (score >= avg) return `This score is above the peer average of ${avg}, but there is still room to reach the top 20% benchmark of ${top20}.`;
    return `This score is around the peer average of ${avg}.`;
  })();

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
    brittle: "Brittle", thin: "Thin", uneven: "Uneven", supported: "Supported", resilient: "Resilient",
  };
  const confidenceColor: Record<string, string> = {
    high: B.teal, moderate: B.bandEstablished, guarded: B.bandDeveloping, low: B.bandLimited,
  };

  // ── Continuity display ──
  const continuityDisplay = record.income_continuity_months < 0.5
    ? "Less than 1 week"
    : record.income_continuity_months < 1
      ? "Less than 1 month"
      : `${record.income_continuity_months} month${record.income_continuity_months !== 1 ? "s" : ""}`;

  // ── Page navigation ──
  const pageTitles = ["Your Score", "How Your Income Is Built", isHighScorer ? "What Could Erode Your Stability" : "Your Biggest Risks", "Your Income Deep Dive", isHighScorer ? "How to Protect Your Position" : "Your Action Plan"];
  const toggleSection = (page: number) => setCollapsed((prev) => ({ ...prev, [page]: !prev[page] }));

  // ── Reassessment countdown ──
  const reassessDaysLeft = Math.max(0, Math.ceil((new Date(reassessDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      await downloadPDF(record);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "PDF generation failed";
      setDownloadError(msg);
    } finally {
      setDownloading(false);
    }
  };

  // ── Band color helper ──
  const bandColor = tier === "high" ? B.bandHigh : tier === "established" ? B.bandEstablished : tier === "developing" ? B.bandDeveloping : B.bandLimited;

  // ── Indicator helpers ──
  function indicatorLevel(label: string, inverted: boolean): { display: string; color: string } {
    const isHigh = /high|very high/i.test(label);
    const isLow = /low|very low/i.test(label);
    if (inverted) {
      if (isHigh) return { display: "High", color: B.bandLimited };
      if (isLow) return { display: "Low", color: B.teal };
      return { display: "Moderate", color: B.ink };
    }
    if (isHigh) return { display: "High", color: B.teal };
    if (isLow) return { display: "Low", color: B.bandLimited };
    return { display: "Moderate", color: B.ink };
  }

  return (
    <ReportErrorBoundary>
    <div id="report-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, maxWidth: PDF.captureW, margin: "0 auto", padding: "0 0 40px" }}>

      {/* ════════════════════════════════════════════════════════
          PAGE 1 — YOUR SCORE (Anchor: clean, confident, contextual)
          ════════════════════════════════════════════════════════ */}
      <ReportPage record={record}>
        <ReportHeader />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <Overline>YOUR INCOME STABILITY REPORT</Overline>
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <QRCodeImage recordId={record.record_id} authCode={record.authorization_code} score={record.final_score} band={record.stability_band} date={issuedDate} model={record.model_version || "RP-2.0"} />
            <div style={{ ...T.meta, color: B.taupe, marginTop: 4 }}>Scan to verify</div>
          </div>
        </div>

        <h1 style={{ ...T.pageTitle, marginBottom: 12 }}>Your Score</h1>

        <div style={{ marginBottom: 20 }}>
          <div style={{ ...T.score, color: B.navy, marginBottom: 12 }}>{animatedScore}</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: bandColor }} />
            <div style={{ ...T.classification, color: bandColor }}>{record.stability_band}</div>
          </div>
          {/* Peer percentile shown on Page 2 with full context */}
        </div>

        {/* Band scale */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...T.overline, color: B.taupe, marginBottom: 8 }}>WHERE YOU LAND</div>
          <div style={{ display: "flex", gap: 2, height: 8, marginBottom: 8 }}>
            {[
              { w: 30, color: B.bandLimited },
              { w: 20, color: B.bandDeveloping },
              { w: 25, color: B.bandEstablished },
              { w: 25, color: B.bandHigh },
            ].map((seg, i) => (
              <div key={i} style={{ width: `${seg.w}%`, backgroundColor: seg.color, borderRadius: i === 0 ? "3px 0 0 3px" : i === 3 ? "0 3px 3px 0" : 0, opacity: (tier === "limited" && i === 0) || (tier === "developing" && i === 1) || (tier === "established" && i === 2) || (tier === "high" && i === 3) ? 1 : 0.25 }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {[
              { range: "0–29", label: "Limited Stability", color: B.bandLimited, tier: "limited" as const },
              { range: "30–49", label: "Developing Stability", color: B.bandDeveloping, tier: "developing" as const },
              { range: "50–74", label: "Established Stability", color: B.bandEstablished, tier: "established" as const },
              { range: "75–100", label: "High Stability", color: B.bandHigh, tier: "high" as const },
            ].map((band) => (
              <div key={band.range} style={{ flex: 1, opacity: tier === band.tier ? 1 : 0.5 }}>
                <div style={{ ...T.micro, color: band.color, fontWeight: tier === band.tier ? 700 : 500 }}>{band.range}</div>
                <div style={{ ...T.meta, color: tier === band.tier ? B.navy : B.taupe, fontWeight: tier === band.tier ? 600 : 400 }}>{band.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Score breakdown removed from Page 1 — math doesn't add up without
            showing interaction penalties. Full breakdown shown on Page 3 where
            cross-factor effects are explained in context. */}

        <p style={{ ...T.body, color: B.muted, marginBottom: 12, maxWidth: 540 }}>
          {copy.p1_headline}
        </p>

        {/* What this score means for your daily life */}
        <div style={{ backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "16px 20px", marginBottom: 16 }}>
          <div style={{ ...T.overline, color: B.taupe, marginBottom: 8 }}>WHAT THIS MEANS FOR YOU</div>
          <p style={{ ...T.body, color: B.navy, margin: 0, lineHeight: 1.65 }}>
            {isHighScorer ? ({
              C1: `Your income survives most common disruptions — a slow quarter, a lost mid-tier client. But a ${record.risk_scenario_drop}-point stress test drop means a major hit (top client loss, industry shift) would still damage you.`,
              C2: `Your income holds up under pressure. You have ${record.income_continuity_months} months of runway and no single-source dependency. The remaining gaps are specific, not structural.`,
              D1: `Your income can absorb a lost client, an illness, or a market downturn without crisis. ${record.income_continuity_months}+ months of continuity. Focus on maintaining what you have built.`,
              D2: `Top ${100 - peerPercentileValue}% of ${industrySector} professionals. ${record.income_continuity_months}+ months of continuity, diversified sources, strong forward visibility. Very few scenarios threaten you.`,
            })[subTier] || `Your income has structural protection. The priority is strengthening specific weak points, not rebuilding.` : ({
              A1: `If your main income source changed tomorrow, you have ${continuityDisplay} of runway. That is not enough. You are one bad month away from a cash crisis.`,
              A2: `Your income is active but fragile. A lost client, a slow month, or 2 weeks off work could become a financial emergency. You have ${continuityDisplay} of runway.`,
              A3: `You have a starting foundation, but a ${record.risk_scenario_drop}-point stress test drop means one unexpected change — a lost client, a contract pause — sets you back hard.`,
              B1: `Your income is developing. You could absorb a minor hit, but losing your biggest client would drop your score by ${record.risk_scenario_drop} points. The gap to stable is ${nextBandThreshold - score} points — closable.`,
              B2: `You are ${nextBandThreshold - score} points from the next band. Your income handles small bumps but a sustained disruption — 60+ days of reduced income — would create real pressure.`,
            })[subTier] || `Your income is developing. ${nextBandThreshold - score} points from the next band.`}
          </p>
        </div>

        {/* Single key insight — merged constraint advice + fix-one-thing */}
        <div style={{ backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderLeft: `3px solid ${B.purple}`, borderRadius: 4, padding: "16px 20px", marginBottom: 16 }}>
          <div style={{ ...T.overline, color: B.purple, marginBottom: 8 }}>THE ONE THING THAT MATTERS MOST</div>
          <p style={{ ...T.body, color: B.navy, margin: 0, fontWeight: 500, lineHeight: 1.6 }}>
            {v2OneThingThatMatters || (profileConstraintAdvice[dominantConstraint] || `The main thing holding ${name} back: ${dominantConstraintPlain[dominantConstraint]}.`) + (v2Sensitivity?.tests?.[0]?.lift ? ` Fixing this could raise the score by about ${v2Sensitivity.tests[0].lift} points.` : "")}
          </p>
        </div>

        {/* Score trend — shown only if previous assessments exist */}
        {(() => {
          try {
            const allRecords = JSON.parse(localStorage.getItem("rp_records") || "[]") as Array<{ record_id: string; final_score: number; stability_band: string; assessment_date_utc: string }>;
            const previous = allRecords.filter(r => r.record_id !== record.record_id && typeof r.final_score === "number").sort((a, b) => (b.assessment_date_utc || "").localeCompare(a.assessment_date_utc || ""));
            if (previous.length === 0) return null;
            const last = previous[0];
            const diff = record.final_score - last.final_score;
            return (
              <div style={{ backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "16px 20px", marginBottom: 12 }}>
                <div style={{ ...T.overline, color: B.teal, marginBottom: 6 }}>SCORE TREND</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ ...T.sectionLabel, color: B.navy }}>{last.final_score}</span>
                  <span style={{ ...T.meta, color: B.taupe }}>→</span>
                  <span style={{ ...T.sectionLabel, color: B.navy }}>{record.final_score}</span>
                  <span style={{ ...T.small, fontWeight: 600, color: diff > 0 ? B.teal : diff < 0 ? B.bandLimited : B.muted }}>{diff > 0 ? `+${diff}` : diff === 0 ? "no change" : String(diff)} points</span>
                </div>
                <p style={{ ...T.meta, color: B.muted, margin: "4px 0 0" }}>Compared with your previous assessment{last.assessment_date_utc ? ` from ${last.assessment_date_utc.split("T")[0]}` : ""}.</p>
              </div>
            );
          } catch { return null; }
        })()}

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, paddingTop: 16, borderTop: "1px solid rgba(14,26,43,0.12)" }}>
          {[["Prepared for", name], ["Industry", industrySector], ["Date Issued", issuedDate], ["Record ID", record.record_id.slice(0, 8)]].map(([l, v]) => (
            <div key={l}>
              <div style={{ ...T.meta, color: B.taupe }}>{l}</div>
              <div style={{ ...T.small, fontWeight: 500, color: B.navy }}>{v}</div>
            </div>
          ))}
        </div>

        <p style={{ ...T.meta, color: B.taupe, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
          The Income Stability Score™ is a present-state income stability assessment based on information provided by the user. It does not provide financial advice and does not predict future financial outcomes.
        </p>

        <PageFooter section="Your Score" page={1} />
      </ReportPage>


      {/* ════════════════════════════════════════════════════════
          PAGE 2 — HOW YOUR INCOME IS BUILT (Understand: the x-ray)
          ════════════════════════════════════════════════════════ */}
      <ReportPage record={record}>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 12 }}>How Your Income Is Built</h1>
        <p style={{ ...T.body, color: B.muted, marginBottom: 20, maxWidth: 540 }}>
          {p2Intro[subTier]}
        </p>

        {/* Income Structure Bar */}
        <Overline large>Income Structure</Overline>
        <div style={{ display: "flex", gap: 2, height: 10, marginBottom: 12, marginTop: 4 }}>
          <div style={{ width: `${record.active_income_level}%`, backgroundColor: B.navy, borderRadius: 1 }} />
          <div style={{ width: `${record.semi_persistent_income_level}%`, backgroundColor: B.taupe, borderRadius: 1 }} />
          <div style={{ width: `${record.persistent_income_level}%`, backgroundColor: B.teal, borderRadius: 1 }} />
        </div>
        <div style={{ display: "flex", gap: 24, marginBottom: 12 }}>
          {[
            { label: "Requires your daily work", pct: record.active_income_level, color: B.ink },
            { label: "Comes back on its own", pct: record.semi_persistent_income_level, color: B.taupe },
            { label: "Keeps coming even if you stop", pct: record.persistent_income_level, color: B.teal },
          ].map((seg) => (
            <div key={seg.label} style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 1, backgroundColor: seg.color }} />
                <span style={{ ...T.small, fontWeight: 500, color: B.navy }}>{seg.label} — {seg.pct}%</span>
              </div>
            </div>
          ))}
        </div>
        <p style={{ ...T.meta, color: B.muted, marginBottom: 16, fontStyle: "italic" }}>
          {record.active_income_level >= 80 ? `${record.active_income_level}% of your income disappears the moment you stop working. That is not a business — that is a job without benefits.` : record.active_income_level >= 50 ? `${record.active_income_level}% of your income requires your daily effort. If you get sick, take a break, or lose momentum — that income stops.` : `${100 - record.active_income_level}% of your income continues without your daily effort. That is real structural protection.`}
        </p>

        {/* Stress Test + Continuity cards */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 3, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "16px 20px" }}>
            <Overline>IF YOUR BIGGEST SOURCE DISAPPEARED</Overline>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
              <span style={{ ...T.cardHero, color: B.navy }}>{record.final_score}</span>
              <span style={{ ...T.sectionLabel, color: B.taupe }}>→</span>
              <span style={{ ...T.cardHero, color: B.bandLimited }}>{Math.max(0, record.risk_scenario_score)}</span>
            </div>
            <p style={{ ...T.small, color: B.muted, margin: 0 }}>
              {record.risk_scenario_drop}-point drop.{record.risk_scenario_drop > score * 0.4 ? " Severe dependency." : ""}
            </p>
          </div>
          <div style={{ flex: 2, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "16px 20px" }}>
            <Overline>HOW LONG INCOME LASTS WITHOUT WORK</Overline>
            <div style={{ ...T.cardHero, color: B.navy, marginBottom: 8 }}>{continuityDisplay}</div>
            <p style={{ ...T.small, color: B.muted, margin: 0 }}>
              {record.income_continuity_months < 1 ? `Critically short for a ${structureDesc}.` : record.income_continuity_months < 3 ? `Limited runway.` : record.income_continuity_months < 6 ? `Moderate runway.` : `Strong window.`}
            </p>
          </div>
        </div>

        <SectionDivider />

        {/* What's working — single column (biggest weakness already on Page 1) */}
        <div style={{ marginBottom: 20 }}>
          <Overline large>What Is Working</Overline>
          <p style={{ ...T.body, color: B.muted, margin: 0 }}>{p2WorkingBody}</p>
        </div>

        {/* Peer comparison */}
        {v2Benchmarks && v2Benchmarks.outlier_dimensions.length > 0 && (
          <div style={{ backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "16px 20px", marginBottom: 16 }}>
            <div style={{ ...T.overline, color: B.teal, marginBottom: 8 }}>{isHighScorer ? `YOU OUTPERFORM ${100 - (peerPercentileValue ?? 50)}% OF ${(olIndustryLabel || industrySector).toUpperCase()} PROFESSIONALS` : `HOW YOU COMPARE TO PEERS${olIndustryLabel ? ` IN ${olIndustryLabel.toUpperCase()}` : ""}`}</div>
            <div style={{ display: "flex", gap: 16, marginBottom: 10, padding: "8px 0", borderBottom: `1px solid ${B.stone}` }}>
              <div style={{ ...T.small, color: B.navy }}>Your Score: <span style={{ fontWeight: 700, ...T.sectionLabel }}>{score}</span></div>
              <div style={{ ...T.small, color: B.muted }}>Peer Average: <span style={{ fontWeight: 700, ...T.sectionLabel, color: B.navy }}>{v2Benchmarks.cluster_average_score}</span></div>
              <div style={{ ...T.small, color: B.muted }}>Top 20%: <span style={{ fontWeight: 700, ...T.sectionLabel, color: B.teal }}>{v2Benchmarks.top_20_threshold}</span></div>
            </div>
            {v2Benchmarks.outlier_dimensions.slice(0, 3).map((d) => {
              const peerLabel: Record<string, string> = {
                income_persistence: "Income that continues if work stops",
                forward_revenue_visibility: "Income secured ahead of time",
                concentration_resilience: "Reliance on one source",
                income_source_diversity: "Number of income sources",
                source_diversification: "Number of income sources",
                labor_dependence: "Dependence on daily work",
                active_labor_dependence: "Dependence on daily work",
                earnings_stability: "Month-to-month earnings stability",
                income_variability: "Month-to-month earnings stability",
                forward_visibility: "Income secured ahead of time",
                income_continuity: "Income that continues if work stops",
                source_concentration: "Reliance on one source",
              };
              const label = peerLabel[d.factor.toLowerCase().replace(/ /g, "_")] ?? d.factor;
              return (
                <div key={d.factor} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 0 6px" }}>
                  <span style={{ ...T.small, fontWeight: 500, color: B.navy }}>{label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ ...T.meta, color: B.muted }}>You: <span style={{ fontWeight: 600, color: B.navy }}>{Math.round(d.user_value)}</span></span>
                    <span style={{ ...T.meta, color: B.muted }}>Peers: <span style={{ fontWeight: 600 }}>{Math.round(d.peer_average)}</span></span>
                    <span style={{ ...T.micro, color: d.direction === "above" ? B.teal : B.bandLimited, fontWeight: 600 }}>{d.direction === "above" ? "▲" : "▼"} {d.direction}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <PageFooter section="How Your Income Is Built" page={2} />
      </ReportPage>

      {/* ── SIMULATOR + RUNWAY — after structure is understood ── */}
      {v2NormalizedInputs && (() => {
        const baseInputs: CanonicalInput = {
          income_persistence_pct: v2NormalizedInputs.income_persistence_pct,
          largest_source_pct: v2NormalizedInputs.largest_source_pct,
          source_diversity_count: v2NormalizedInputs.source_diversity_count,
          forward_secured_pct: v2NormalizedInputs.forward_secured_pct,
          income_variability_level: v2NormalizedInputs.income_variability_level as "low" | "moderate" | "high" | "extreme",
          labor_dependence_pct: v2NormalizedInputs.labor_dependence_pct,
        };
        const qualityScore = v2Quality?.quality_score ?? 5;
        const activePreset = SIMULATOR_PRESETS.find(p => p.id === simPreset);
        const simInputs = activePreset ? activePreset.modify(baseInputs) : baseInputs;
        const simResult = simulateScore(simInputs, qualityScore);
        const scoreDelta = simResult.overall_score - score;
        const runwayDays = Math.round(record.income_continuity_months * 30);
        const target90Days = Math.max(0, 90 - runwayDays);
        // How to close the gap: persistence adds 0.9 days per %, forward adds 1.2 days per %
        const gapMonths = Math.max(0, 3 - record.income_continuity_months);
        const persistenceGapPct = Math.min(Math.round(gapMonths / 0.03), 100 - baseInputs.income_persistence_pct);
        const clientsToConvert = Math.max(1, Math.ceil(persistenceGapPct / 15));

        return (
          <div className="report-page" style={{ width: PDF.captureW, maxWidth: "100%", backgroundColor: B.sand, padding: R.pagePad, boxSizing: "border-box" }}>
            <Overline large>What If? Score Simulator</Overline>
            <p style={{ ...T.small, color: B.muted, marginBottom: 12 }}>
              Now that you understand your structure — explore what happens if things change.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {SIMULATOR_PRESETS.map((preset) => {
                const isActive = simPreset === preset.id;
                return (
                  <button key={preset.id} onClick={() => setSimPreset(isActive ? null : preset.id)} style={{ padding: "8px 14px", fontSize: 11, fontWeight: 600, borderRadius: 6, border: `1px solid ${isActive ? B.purple : B.stone}`, cursor: "pointer", transition: "all 150ms ease", backgroundColor: isActive ? "rgba(75,63,174,0.08)" : "#fff", color: isActive ? B.purple : B.navy }}>
                    {preset.label}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 16, marginBottom: 16, padding: "20px 24px", backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4 }}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>CURRENT</div>
                <div style={{ ...T.cardHero, color: B.navy }}>{score}</div>
                <div style={{ ...T.meta, color: B.muted }}>{record.stability_band}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", color: B.taupe, fontSize: 20 }}>→</div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>{simPreset ? "SIMULATED" : "SELECT A SCENARIO"}</div>
                <div style={{ ...T.cardHero, color: scoreDelta > 0 ? B.teal : scoreDelta < 0 ? B.bandLimited : B.navy }}>{simResult.overall_score}</div>
                <div style={{ ...T.meta, color: B.muted }}>{simResult.band}</div>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>IMPACT</div>
                <div style={{ ...T.cardHero, color: scoreDelta > 0 ? B.teal : scoreDelta < 0 ? B.bandLimited : B.muted }}>
                  {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta === 0 ? "—" : String(scoreDelta)}
                </div>
                <div style={{ ...T.meta, color: B.muted }}>Fragility: {simResult.fragility_class}</div>
              </div>
            </div>
            {activePreset && (
              <div style={{ backgroundColor: "rgba(75,63,174,0.04)", borderRadius: 4, padding: "12px 16px", marginBottom: 16 }}>
                <div style={{ ...T.sectionLabel, color: B.purple, marginBottom: 4 }}>{activePreset.label}</div>
                <p style={{ ...T.small, color: B.muted, margin: 0 }}>{activePreset.description}</p>
                {scoreDelta !== 0 && (
                  <p style={{ ...T.small, color: scoreDelta > 0 ? B.teal : B.bandLimited, margin: "6px 0 0", fontWeight: 600 }}>
                    {scoreDelta > 0 ? `This move would improve your score by ${scoreDelta} points${simResult.band !== record.stability_band ? ` and move you to ${simResult.band}` : ""}.` : `This would drop your score by ${Math.abs(scoreDelta)} points${simResult.band !== record.stability_band ? ` — dropping you to ${simResult.band}` : ""}.`}
                  </p>
                )}
              </div>
            )}
            <SectionDivider />
            <Overline large>Income Runway</Overline>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "16px 20px", textAlign: "center" }}>
                <div style={{ ...T.overline, color: B.taupe, marginBottom: 8 }}>IF YOU STOP WORKING TODAY</div>
                <div style={{ fontSize: 40, fontWeight: 600, lineHeight: 1.1, color: runwayDays < 30 ? B.bandLimited : runwayDays < 90 ? B.bandDeveloping : B.teal, marginBottom: 4 }}>{runwayDays}</div>
                <div style={{ ...T.sectionLabel, color: B.navy }}>days of income</div>
                <p style={{ ...T.meta, color: B.muted, marginTop: 8, lineHeight: 1.5 }}>
                  {runwayDays < 14 ? "Crisis-level. Any disruption becomes an emergency." : runwayDays < 30 ? "Less than one month of runway." : runwayDays < 90 ? "Moderate — not enough for a real transition." : "Strong runway."}
                </p>
              </div>
              <div style={{ flex: 1, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "16px 20px" }}>
                <div style={{ ...T.overline, color: B.taupe, marginBottom: 8 }}>TO REACH 90 DAYS</div>
                {runwayDays >= 90 ? (
                  <><div style={{ ...T.cardHero, color: B.teal, marginBottom: 8 }}>Already there</div><p style={{ ...T.small, color: B.muted, margin: 0 }}>Focus on maintaining this buffer.</p></>
                ) : (
                  <><div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 8 }}>You need {target90Days} more days</div><p style={{ ...T.small, color: B.muted, margin: 0, lineHeight: 1.55 }}>{persistenceGapPct > 0 ? `Increase recurring revenue by ~${persistenceGapPct}% (convert ${clientsToConvert} client${clientsToConvert > 1 ? "s" : ""} to retainers) or lock in ${Math.round(gapMonths / 0.04)}% more forward revenue.` : "Reduce labor dependence and extend contract terms to close the gap."}</p></>
                )}
              </div>
            </div>
          </div>
        );
      })()}


      {/* ════════════════════════════════════════════════════════
          PAGE 3 — YOUR BIGGEST RISKS
          ════════════════════════════════════════════════════════ */}
      <ReportPage record={record}>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 12 }}>{isHighScorer ? "What Could Erode Your Stability" : "Your Biggest Risks"}</h1>
        <p style={{ ...T.body, color: B.muted, marginBottom: 24, maxWidth: 540 }}>
          {isHighScorer
            ? `You have built real stability. These are the scenarios that could weaken what you have built.${olIndustryLabel ? ` Assessed for ${olIndustryLabel}.` : ""}`
            : `${p3Intro[subTier]}${olIndustryLabel ? ` These risks are specific to ${olIndustryLabel}.` : ""}`}
        </p>

        {/* Stress scenarios — top 3 */}
        {v2Scenarios && v2Scenarios.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <Overline large>What Could Hurt Your Score Most</Overline>
            {[...v2Scenarios].sort((a, b) => b.score_drop - a.score_drop).slice(0, 3).map((s) => {
              const scenarioPlain: Record<string, string> = {
                active_labor_interrupted: "You are unable to work for an extended period",
                platform_dependency_shock: "An income channel you rely on changes its terms or access",
                forward_commitments_delayed: "Income you were expecting gets delayed",
                client_concentration_loss: "Your largest client leaves or stops paying",
                market_contraction: "Demand in your industry drops significantly",
                regulatory_disruption: "A regulatory or policy change affects your work",
                revenue_model_disruption: "Your primary way of earning income stops working",
                high_volatility_month: "You have a month where income drops sharply",
                seasonal_revenue_gap: "A seasonal slowdown reduces your income",
                key_client_loss: "You lose a key client or contract",
                pricing_pressure: "What you can charge drops due to market pressure",
                recurring_stream_degrades: "A repeating income stream weakens or ends",
                referral_pipeline_dries: "New business or referrals slow down significantly",
                contract_non_renewal: "A major contract is not renewed",
                scope_reduction: "A client significantly reduces the scope of your work",
              };
              const title = scenarioPlain[s.scenario_id] ?? s.label
                .replace(/^Active Labor Interrupted$/i, "You are unable to work for an extended period")
                .replace(/^Platform Dependency Shock$/i, "An income channel you rely on changes its terms or access")
                .replace(/^Forward Commitments Delayed$/i, "Income you were expecting gets delayed")
                .replace(/^High Volatility Month$/i, "You have a month where income drops sharply")
                .replace(/^Client Concentration Loss$/i, "Your largest client leaves or stops paying")
                .replace(/^Market Contraction$/i, "Demand in your industry drops significantly")
                .replace(/^Revenue Model Disruption$/i, "Your primary way of earning income stops working")
                .replace(/^Seasonal Revenue Gap$/i, "A seasonal slowdown reduces your income")
                .replace(/^Key Client Loss$/i, "You lose a key client or contract")
                .replace(/^Regulatory Disruption$/i, "A regulatory or policy change affects your work")
                .replace(/^Pricing Pressure$/i, "What you can charge drops due to market pressure")
                .replace(/^Recurring Stream Degrades$/i, "A repeating income stream weakens or ends")
                .replace(/^Referral Pipeline Dries$/i, "New business or referrals slow down significantly")
                .replace(/^Contract Non.?Renewal$/i, "A major contract is not renewed")
                .replace(/^Scope Reduction$/i, "A client significantly reduces the scope of your work");
              const safeTitle = (/^[A-Z][a-z]+ [A-Z]/.test(title) && !title.includes("You ") && !title.includes("A ") && !title.includes("Your "))
                ? title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()
                : title;
              const severity = s.band_shift ? "SEVERE" : (s.scenario_score <= 0 || s.score_drop > score * 0.5) ? "SEVERE" : s.score_drop > 8 ? "HIGH" : s.score_drop > 3 ? "MODERATE" : "LOW";
              const sevColor = severity === "SEVERE" ? B.bandLimited : severity === "HIGH" ? B.bandDeveloping : B.muted;
              return (
                <div key={s.scenario_id} style={{ padding: "12px 0", borderBottom: `1px solid ${B.stone}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ ...T.micro, color: sevColor, minWidth: 60 }}>{severity}</span>
                      <span style={{ ...T.sectionLabel, color: B.navy }}>{safeTitle}</span>
                    </div>
                    <span style={{ ...T.small, color: B.navy, flexShrink: 0 }}>
                      {s.original_score} → <span style={{ color: B.bandLimited }}>{s.scenario_score}</span>
                    </span>
                  </div>
                  {/* Why this risk matters — from outcome layer */}
                  {(() => {
                    const olMatch = olSelectedScenarios?.find(os => s.scenario_id.toLowerCase().includes(os.scenario_id.toLowerCase().replace("rs-", "").replace(/-/g, "_")) || os.label.toLowerCase() === s.label?.toLowerCase());
                    return olMatch?.why_it_matters ? (
                      <div style={{ paddingLeft: 70 }}>
                        <p style={{ ...T.meta, color: B.muted, margin: "4px 0 0", lineHeight: 1.5 }}>{olMatch.why_it_matters}</p>
                      </div>
                    ) : s.band_shift ? (
                      <div style={{ paddingLeft: 70 }}>
                        <p style={{ ...T.meta, color: B.bandLimited, margin: 0, fontWeight: 500 }}>Would drop to {s.scenario_band} band.</p>
                      </div>
                    ) : null;
                  })()}
                </div>
              );
            })}
          </div>
        )}

        {/* Urgency — right after scenarios while fear is fresh */}
        <div style={{ backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderLeft: `3px solid ${B.bandLimited}`, borderRadius: 4, padding: "16px 20px", marginBottom: 16 }}>
          <p style={{ ...T.body, color: B.navy, margin: 0, fontWeight: 500 }}>
            {isHighScorer
              ? `Your ${record.risk_scenario_drop}-point stress test exposure does not fix itself. The structural advantages you have today erode if you stop maintaining them.`
              : `If nothing changes in 90 days, these risks remain. Your ${continuityDisplay} runway does not grow on its own. Every month without a structural change is a month where one disruption could set you back.`}
          </p>
        </div>

        {/* Predictive Warnings — static, in PDF */}
        {v2PredictiveWarnings && v2PredictiveWarnings.length > 0 && (
          <>
          <SectionDivider />
          <Overline large>What You Are Likely to Do Wrong Next</Overline>
          <p style={{ ...T.small, color: B.muted, marginBottom: 12 }}>
            Based on your structure, these are the mistakes people in your position typically make.
          </p>
          {v2PredictiveWarnings.map((w, i) => (
            <div key={i} style={{ backgroundColor: "rgba(155,44,44,0.03)", border: "1px solid rgba(155,44,44,0.08)", borderLeft: `3px solid ${B.bandLimited}`, borderRadius: 4, padding: "14px 18px", marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ ...T.sectionLabel, color: B.navy }}>{w.headline}</div>
                <span style={{ ...T.micro, color: B.bandLimited }}>{w.timeframe}</span>
              </div>
              <p style={{ ...T.small, color: B.muted, margin: 0, lineHeight: 1.55 }}>{w.explanation}</p>
            </div>
          ))}
          </>
        )}

        <PageFooter section={isHighScorer ? "What Could Erode Your Stability" : "Your Biggest Risks"} page={3} />
      </ReportPage>


      {/* ════════════════════════════════════════════════════════
          PAGE 4 — YOUR INCOME DEEP DIVE
          ════════════════════════════════════════════════════════ */}
      <ReportPage record={record}>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 12 }}>Your Income Deep Dive</h1>
        <p style={{ ...T.body, color: B.muted, marginBottom: 24, maxWidth: 540 }}>
          Your score is built from six things we measure about your income. Here is how each one looks, plus how strong, reliable, and well-built your income is overall.
        </p>

        {/* Structural Indicators — 6 dimensions */}
        {v2?.indicators && v2.indicators.length > 0 && (
          <div style={{ marginBottom: 24 }}>
          <Overline large>The Six Things That Determine Your Score</Overline>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {v2.indicators.map((ind) => {
              const levelColor = /high|very high/i.test(ind.level) ? B.teal : /low|very low/i.test(ind.level) ? B.bandLimited : B.muted;
              const indicatorLabel: Record<string, string> = {
                income_persistence: "Income Persistence",
                source_diversity: "Source Diversification",
                income_source_diversity: "Source Diversification",
                forward_secured: "Forward Revenue Visibility",
                forward_revenue_visibility: "Forward Revenue Visibility",
                income_variability: "Earnings Stability",
                labor_dependence: "Labor Independence",
                active_labor_dependence: "Labor Independence",
                concentration_resilience: "Source Independence",
                exposure_concentration: "Source Independence",
              };
              return (
                <div key={ind.key} style={{ flex: "1 1 calc(33.33% - 8px)", minWidth: 190, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ ...T.small, fontWeight: 600, color: B.navy, flex: 1, lineHeight: 1.3 }}>{indicatorLabel[ind.key] ?? ind.label}</span>
                    <span style={{ ...T.micro, color: levelColor, flexShrink: 0 }}>{ind.level.toUpperCase()}</span>
                  </div>
                  <div style={{ height: 5, backgroundColor: "rgba(14,26,43,0.06)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min(100, ind.normalized_value)}%`, backgroundColor: levelColor, borderRadius: 2 }} />
                  </div>
                  <div style={{ ...T.meta, color: B.muted, marginTop: 4 }}>{Math.round(ind.normalized_value)} / 100</div>
                </div>
              );
            })}
          </div>
          </div>
        )}

        {/* Fragility + Confidence + Durability */}
        {(v2Fragility || v2Confidence || v2Quality) && (
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            {v2Fragility && (
              <div style={{ flex: 1, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "16px 20px" }}>
                <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>HOW EASILY IT COULD BREAK</div>
                <div style={{ ...T.cardHeading, color: v2Fragility.fragility_class === "brittle" || v2Fragility.fragility_class === "thin" ? B.bandLimited : v2Fragility.fragility_class === "resilient" || v2Fragility.fragility_class === "supported" ? B.teal : B.navy, marginBottom: 6 }}>
                  {(v2Fragility.fragility_class || "").charAt(0).toUpperCase() + (v2Fragility.fragility_class || "").slice(1)}
                </div>
                <div style={{ ...T.meta, color: B.muted }}>
                  {({
                    brittle: "A single disruption — lost client, slow month — could cause a score collapse.",
                    thin: "Can absorb a minor hit (one slow month), but not two in a row.",
                    uneven: "Protected in some dimensions, exposed in others. Vulnerable to targeted disruption.",
                    supported: "Can absorb most common disruptions without band change.",
                    resilient: "Can absorb a major client loss or 90-day work stoppage.",
                  })[v2Fragility.fragility_class] ?? ""}
                </div>
                {v2Fragility.primary_failure_mode && (
                  <div style={{ ...T.meta, color: B.muted, marginTop: 4 }}>
                    Primary risk: {({
                      concentration_collapse: "single-source dependency",
                      labor_interruption: "income stops when work stops",
                      visibility_gap: "no forward-committed income",
                      durability_thinness: "recurring income is fragile",
                    })[v2Fragility.primary_failure_mode] ?? v2Fragility.primary_failure_mode}
                  </div>
                )}
              </div>
            )}
            {v2Confidence && (
              <div style={{ flex: 1, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "16px 20px" }}>
                <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>HOW RELIABLE THIS SCORE IS</div>
                <div style={{ ...T.cardHeading, color: v2Confidence.confidence_level === "high" ? B.teal : v2Confidence.confidence_level === "low" ? B.bandLimited : B.navy, marginBottom: 6 }}>
                  {(v2Confidence.confidence_level || "").charAt(0).toUpperCase() + (v2Confidence.confidence_level || "").slice(1)} Confidence
                </div>
                <div style={{ ...T.meta, color: B.muted }}>
                  {v2Confidence.confidence_level === "high" ? "Inputs consistent. Score reliable." :
                   v2Confidence.confidence_level === "moderate" ? "Mostly consistent, minor gaps." :
                   v2Confidence.confidence_level === "guarded" ? "Some input inconsistencies." :
                   "Limited precision. Reassess with more data."}
                </div>
              </div>
            )}
            {v2Quality && (
              <div style={{ flex: 1, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "16px 20px" }}>
                <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>HOW WELL-BUILT IT IS</div>
                <div style={{ ...T.cardHeading, color: B.navy, marginBottom: 6 }}>{(v2Quality.durability_grade || "").replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}</div>
                <div style={{ ...T.meta, color: B.muted }}>
                  Quality: {v2Quality.quality_score}/10 ({v2Quality.quality_score >= 7 ? "strong" : v2Quality.quality_score >= 4 ? "moderate" : "weak"})
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cross-factor effects */}
        {v2Interactions && v2Interactions.effects.length > 0 && (
          <>
          <Overline large>How Your Strengths and Weaknesses Interact</Overline>
          <p style={{ ...T.small, color: B.muted, marginBottom: 12 }}>
            When two weak areas overlap, your score drops more. When two strong areas overlap, it gets a boost.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {v2Interactions.effects.filter(e => e.condition_met !== false).map((e) => {
              const effectLabel: Record<string, string> = {
                "CF-01": "High concentration + low forward visibility",
                "CF-02": "High labor dependence + low persistence",
                "CF-03": "Multiple sources but still concentrated",
                "CF-04": "Recurring income but high cancellation risk",
                "CF-05": "Forward visibility but mostly cancelable",
                "CF-06": "Few sources + extreme variability",
                "CF-B01": "Strong forward visibility + low concentration",
                "CF-B02": "High persistence + low labor dependence",
              };
              return (
                <div key={e.code} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", backgroundColor: e.type === "bonus" ? "rgba(31,109,122,0.06)" : "rgba(155,44,44,0.04)", borderRadius: 4 }}>
                  <span style={{ ...T.small, color: B.navy }}>{effectLabel[e.code] ?? e.trigger_condition}</span>
                  <span style={{ ...T.sectionLabel, color: e.points > 0 ? B.teal : B.bandLimited }}>
                    {e.points > 0 ? "+" : ""}{e.points} pts
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ ...T.small, color: B.muted, marginBottom: 16 }}>
            Net: <span style={{ fontWeight: 600, color: v2Interactions.net_adjustment >= 0 ? B.teal : B.bandLimited }}>{v2Interactions.net_adjustment > 0 ? "+" : ""}{v2Interactions.net_adjustment} points</span>
          </div>
          </>
        )}

        {/* What You Might Not Realize — Surprising Insights (moved from Page 2 for analytical context) */}
        {v2SurprisingInsights && v2SurprisingInsights.length > 0 && (
          <>
          <SectionDivider />
          <Overline large>What You Might Not Realize</Overline>
          {v2SurprisingInsights.map((insight, i) => (
            <div key={i} style={{ backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderLeft: `3px solid ${B.purple}`, borderRadius: 4, padding: "16px 20px", marginBottom: 10 }}>
              <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 6 }}>{insight.headline}</div>
              <p style={{ ...T.small, color: B.muted, margin: "0 0 6px", lineHeight: 1.55 }}>{insight.explanation}</p>
              <div style={{ ...T.meta, color: B.taupe, fontStyle: "italic" }}>{insight.data_point}</div>
            </div>
          ))}
          </>
        )}

        {/* Income System Map — visual summary of the six normalized inputs */}
        {v2NormalizedInputs && (() => {
          const ni = v2NormalizedInputs;
          const strengthColor = (pct: number) => pct >= 60 ? B.teal : pct >= 30 ? B.navy : B.bandLimited;
          return (
            <>
            <SectionDivider />
            <Overline large>Your Income System Map</Overline>
            <p style={{ ...T.meta, color: B.muted, marginBottom: 12 }}>These are independent structural dimensions — not slices of a pie. A single dollar of income can be recurring, forward-secured, and passive simultaneously.</p>

            {/* Sources row */}
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
              <div style={{ ...T.small, fontWeight: 600, color: B.navy, minWidth: 100 }}>Sources</div>
              <div style={{ flex: 1, display: "flex", gap: 4 }}>
                {Array.from({ length: Math.min(6, ni.source_diversity_count) }, (_, i) => (
                  <div key={i} style={{ height: 24, flex: i === 0 ? ni.largest_source_pct : Math.round((100 - ni.largest_source_pct) / Math.max(1, ni.source_diversity_count - 1)), borderRadius: 3, backgroundColor: i === 0 ? (ni.largest_source_pct >= 60 ? B.bandLimited : B.navy) : B.teal, minWidth: 20 }} />
                ))}
              </div>
              <div style={{ ...T.small, color: B.muted, minWidth: 100, textAlign: "right" }}>{ni.source_diversity_count} source{ni.source_diversity_count !== 1 ? "s" : ""}</div>
            </div>

            {/* Three structural strength bars */}
            {[
              { label: "Recurring", pct: ni.income_persistence_pct, desc: "repeats without re-selling" },
              { label: "Forward-secured", pct: ni.forward_secured_pct, desc: "committed before month starts" },
              { label: "Passive", pct: 100 - ni.labor_dependence_pct, desc: "continues without daily work" },
            ].map((dim) => (
              <div key={dim.label} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <div style={{ ...T.small, fontWeight: 600, color: B.navy, minWidth: 100 }}>{dim.label}</div>
                <div style={{ flex: 1, height: 8, backgroundColor: "rgba(14,26,43,0.06)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${dim.pct}%`, backgroundColor: strengthColor(dim.pct), borderRadius: 4, transition: "width 300ms ease" }} />
                </div>
                <div style={{ ...T.small, color: strengthColor(dim.pct), fontWeight: 600, minWidth: 40, textAlign: "right" }}>{dim.pct}%</div>
              </div>
            ))}
            <div style={{ ...T.meta, color: B.taupe, marginTop: 4, marginBottom: 12 }}>
              {ni.largest_source_pct >= 60 ? `${ni.largest_source_pct}% from your largest source — high concentration risk.` : `Largest source at ${ni.largest_source_pct}% — reasonably distributed.`}
            </div>

            {/* Risk flags */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[
                { label: "Concentration Risk", active: ni.largest_source_pct >= 50 },
                { label: "Labor Risk", active: ni.labor_dependence_pct >= 70 },
                { label: "Visibility Risk", active: ni.forward_secured_pct <= 20 },
              ].filter(r => r.active).map((risk) => (
                <span key={risk.label} style={{ ...T.micro, color: B.bandLimited, padding: "3px 8px", borderRadius: 10, backgroundColor: "rgba(155,44,44,0.06)", border: "1px solid rgba(155,44,44,0.12)" }}>{risk.label}</span>
              ))}
            </div>
            </>
          );
        })()}

        {/* High scorer: brief peer position note (full comparison on Page 2) */}
        {isHighScorer && v2Benchmarks && (
          <div style={{ ...T.small, color: B.muted, marginBottom: 16 }}>
            {score >= (v2Benchmarks.top_20_threshold ?? 65)
              ? `You outperform ${100 - (peerPercentileValue ?? 50)}% of ${industrySector} professionals. The remaining gaps are refinements — see the action plan for specifics.`
              : `You are ${(v2Benchmarks.top_20_threshold ?? 65) - score} points from the top 20%. The action plan shows exactly how to close that gap.`}
          </div>
        )}

        {/* Bottom line */}
        <div style={{ backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderLeft: `3px solid ${B.purple}`, borderRadius: 4, padding: "16px 20px" }}>
          <div style={{ ...T.overline, color: B.teal, marginBottom: 8 }}>BOTTOM LINE</div>
          <p style={{ ...T.body, color: B.navy, margin: "0 0 8px", fontWeight: 500 }}>
            {p2BottomLine[subTier]}
          </p>
          <p style={{ ...T.small, color: B.muted, margin: 0 }}>
            {p2Interpretation[subTier]}
          </p>
        </div>

        <PageFooter section="Your Income Deep Dive" page={4} />
      </ReportPage>


      {/* ════════════════════════════════════════════════════════
          PAGE 5 — YOUR ACTION PLAN (Act: empowerment)
          ════════════════════════════════════════════════════════ */}
      <ReportPage record={record}>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 12 }}>{isHighScorer ? "How to Protect Your Position" : "Your Action Plan"}</h1>
        <p style={{ ...T.body, color: B.muted, marginBottom: 24, maxWidth: 540 }}>
          {isHighScorer
            ? `As a ${structureDesc} in ${industrySector}, you have built real stability. The priority now is to lock it in, close the remaining gaps, and maintain your position.`
            : `As a ${structureDesc} in ${industrySector} with ${incomeModelDesc} income, the fastest way to raise your score is to change how your money comes in — not just earn more.`}
        </p>

        {/* Current Band → Next Target Band */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderLeft: `3px solid ${bandColor}`, borderRadius: 4, padding: "16px 20px" }}>
            <Overline>CURRENT BAND</Overline>
            <div style={{ ...T.cardHeading, color: bandColor }}>{record.stability_band} | {record.final_score}</div>
          </div>
          <div style={{ flex: 1, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderLeft: `3px solid ${tier === "high" ? B.bandHigh : tier === "established" ? B.bandHigh : tier === "developing" ? B.bandEstablished : B.bandDeveloping}`, borderRadius: 4, padding: "16px 20px" }}>
            <Overline>NEXT TARGET BAND</Overline>
            <div style={{ ...T.cardHeading, color: B.navy }}>{record.final_score < 30 ? "Developing Stability | 30+" : record.final_score < 50 ? "Established Stability | 50+" : record.final_score < 75 ? "High Stability | 75+" : "Maintain Current"}</div>
          </div>
        </div>

        {/* Top 3 improvements + progress bar */}
        {v2Lift && v2Lift.lift_scenarios.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Overline large>{isHighScorer ? "How to Strengthen Further" : "If You Made These Changes"}</Overline>
            {v2Lift.lift_scenarios.filter(s => s.lift > 0).sort((a, b) => b.lift - a.lift).slice(0, 3).map((s, i) => {
              const liftPlain: Record<string, string> = {
                reduce_labor_dependence: "Reduce how much income depends on daily work",
                extend_forward_visibility: "Secure more income before next month begins",
                reduce_concentration: "Reduce reliance on the largest source",
                increase_persistence: "Build more income that repeats or continues without daily work",
                increase_persistent_revenue: "Build more income that repeats or continues without daily work",
                add_income_sources: "Add more dependable income sources",
                reduce_variability: "Reduce month-to-month income swings",
                increase_continuity: "Increase how long income would continue if work stopped",
                extend_continuity: "Increase how long income would continue if work stopped",
                diversify_sources: "Spread income across more independent sources",
                reduce_active_dependence: "Reduce how much income depends on daily work",
                improve_forward_secured: "Secure more income before next month begins",
                strengthen_persistence: "Build more income that continues without daily work",
                reduce_largest_source: "Reduce reliance on the largest source",
              };
              const title = liftPlain[s.scenario_id] ?? s.label
                .replace(/Extend Forward Visibility/i, "Secure more income before next month begins")
                .replace(/Reduce Labor Dependence/i, "Reduce how much income depends on daily work")
                .replace(/Reduce Concentration/i, "Reduce reliance on the largest source")
                .replace(/Increase Persist.*Revenue/i, "Build more income that repeats or continues without daily work");
              return (
                <div key={s.scenario_id} style={{ padding: "10px 0", borderBottom: `1px solid ${B.stone}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ ...T.sectionTitle, color: B.purple, minWidth: 20 }}>{i + 1}</span>
                      <span style={{ ...T.sectionLabel, color: B.navy }}>{title}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <span style={{ ...T.small, color: B.teal, fontWeight: 600 }}>+{s.lift} points</span>
                      <span style={{ ...T.meta, color: B.muted }}>→ {s.projected_score}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {v2Lift.combined_top_two && v2Lift.combined_top_two.lift > 0 && (
            <div style={{ marginTop: 12, marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <span style={{ ...T.meta, color: B.muted, minWidth: 50 }}>Now</span>
                <div style={{ flex: 1, height: 8, backgroundColor: "rgba(14,26,43,0.06)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${record.final_score}%`, backgroundColor: B.navy, borderRadius: 4 }} />
                </div>
                <span style={{ ...T.meta, color: B.navy, fontWeight: 600, minWidth: 24, textAlign: "right" }}>{record.final_score}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ ...T.meta, color: B.muted, minWidth: 50 }}>After</span>
                <div style={{ flex: 1, height: 8, backgroundColor: "rgba(14,26,43,0.06)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(100, v2Lift.combined_top_two.projected_score)}%`, backgroundColor: B.teal, borderRadius: 4 }} />
                </div>
                <span style={{ ...T.meta, color: B.teal, fontWeight: 600, minWidth: 24, textAlign: "right" }}>{v2Lift.combined_top_two.projected_score}</span>
              </div>
            </div>
            )}
          </div>
        )}

        <SectionDivider />

        {/* Priority actions — from outcome layer or fallback */}
        <Overline large>{isHighScorer ? `How to Maintain Your Position in ${industrySector}` : `Your Next Steps as a ${structureDesc} in ${industrySector}`}</Overline>
        {olActions && olActions.length > 0 && (
          <div style={{ ...T.meta, color: B.teal, fontWeight: 500, marginBottom: 8 }}>
            Tailored for {olIndustryLabel ? `${olIndustryLabel} · ` : ""}{olFamilyLabel ?? "your income model"}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {(olActions && olActions.length > 0
            ? olActions.slice(0, 3).map((a, i) => ({
                rank: `${i + 1}`,
                title: a.label,
                copy: a.description,
                why: a.why_now,
                effect: a.expected_effect,
                timeframe: "",
                target: "",
                tradeoff: "",
              }))
            : (v2?.recommended_actions && v2.recommended_actions.length > 0)
            ? v2.recommended_actions.slice(0, 4).map((a, i) => ({
                rank: `${i + 1}`,
                title: a.label,
                copy: a.description,
                why: "",
                effect: a.expected_impact,
                timeframe: (a as Record<string, string>).timeframe ?? "",
                target: (a as Record<string, string>).target ?? "",
                tradeoff: (a as Record<string, string>).tradeoff ?? "",
              }))
            : (() => {
                const priorities = isHighScorer ? [
                  { key: "forward_visibility", title: "Maintain forward revenue visibility", copy: "Review your committed revenue quarterly. Ensure at least 60% of next quarter's income is already locked in." },
                  { key: "source_concentration", title: "Monitor client concentration", copy: "No single client should exceed 25% of revenue. Review your client mix monthly and diversify proactively." },
                  { key: "labor_dependence", title: "Protect income continuity", copy: "Ensure your passive and repeatable income streams are growing, not shrinking. Review annually." },
                  { key: "low_continuity", title: "Extend your runway", copy: "Your continuity window is your safety margin. Every quarter, ask: could I sustain 6 months without new business?" },
                ] : [
                  { key: "forward_visibility", title: "This week: start locking in future income", copy: `Reach out to your top 3 clients or prospects about converting to retainers, multi-month contracts, or advance commitments. Your forward visibility is your biggest gap right now.` },
                  { key: "source_concentration", title: "This month: add a second meaningful income source", copy: `Your stress test shows a ${record.risk_scenario_drop}-point drop if your biggest source disappears. Identify one new client, product, or revenue stream that could reach 10%+ of your income within 90 days.` },
                  { key: "labor_dependence", title: "This quarter: build one income stream that doesn't need you daily", copy: `${record.active_income_level}% of your income requires your daily effort. Pick one service, product, or arrangement you can convert into recurring or passive revenue this quarter.` },
                  { key: "low_continuity", title: "This quarter: extend how long income lasts without work", copy: `Your income would continue for about ${continuityDisplay} if you stopped. Build at least one stream that would keep producing for 3+ months independently.` },
                ];
                const sorted = [
                  ...priorities.filter(p => p.key === dominantConstraint),
                  ...priorities.filter(p => p.key !== dominantConstraint),
                ];
                return sorted.map((p, i) => ({ rank: `${i + 1}`, title: p.title, copy: p.copy, why: "", effect: "", timeframe: "", target: "", tradeoff: "" }));
              })()
          ).map((action) => (
            <div key={action.rank} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ ...T.sectionLabel, color: B.purple, minWidth: 18 }}>{action.rank}.</span>
              <div style={{ flex: 1 }}>
                <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 2 }}>{action.title}</div>
                <p style={{ ...T.small, color: B.muted, margin: 0 }}>{action.copy}</p>
                {action.why && <p style={{ ...T.meta, color: B.teal, margin: "4px 0 0", fontWeight: 500 }}>Why now: {action.why}</p>}
                {(action as Record<string, string>).effect && <p style={{ ...T.meta, color: B.muted, margin: "2px 0 0" }}>Expected effect: {(action as Record<string, string>).effect}</p>}
                {(action as Record<string, string>).timeframe && <p style={{ ...T.meta, color: B.purple, margin: "4px 0 0", fontWeight: 500 }}>Timeline: {(action as Record<string, string>).timeframe}</p>}
                {(action as Record<string, string>).target && <p style={{ ...T.meta, color: B.navy, margin: "2px 0 0", fontWeight: 500 }}>Target: {(action as Record<string, string>).target}</p>}
                {(action as Record<string, string>).tradeoff && (
                  <p style={{ ...T.meta, color: B.muted, margin: "4px 0 0", fontStyle: "italic" }}>Tradeoff: {(action as Record<string, string>).tradeoff}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tradeoffs & Strategy — RP-2.1 */}
        {v2TradeoffNarratives && v2TradeoffNarratives.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Overline large>Tradeoffs to Understand</Overline>
            <p style={{ ...T.small, color: B.muted, marginBottom: 12 }}>
              Real strategy means understanding consequences, not just following suggestions. Here is what each move actually costs — and why it is still worth it.
            </p>
            {v2TradeoffNarratives.map((t, i) => (
              <div key={i} style={{ backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "14px 18px", marginBottom: 8 }}>
                <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 6 }}>{t.action_label}</div>
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...T.meta, color: B.teal, fontWeight: 600, marginBottom: 4 }}>THE UPSIDE</div>
                    <p style={{ ...T.meta, color: B.muted, margin: 0, lineHeight: 1.5 }}>{t.upside}</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...T.meta, color: B.bandDeveloping, fontWeight: 600, marginBottom: 4 }}>THE COST</div>
                    <p style={{ ...T.meta, color: B.muted, margin: 0, lineHeight: 1.5 }}>{t.downside}</p>
                  </div>
                </div>
                <div style={{ borderTop: `1px solid ${B.stone}`, marginTop: 8, paddingTop: 6 }}>
                  <p style={{ ...T.meta, color: B.navy, margin: 0, fontWeight: 500 }}>{t.net_recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* What NOT to do — from avoid_actions */}
        {((v2AvoidActions && v2AvoidActions.length > 0) || (olAvoid && olAvoid.length > 0)) && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 8 }}>What to avoid</div>
            {(v2AvoidActions ?? []).slice(0, 2).map((a) => (
              <div key={a.action_id} style={{ ...T.small, color: B.muted, marginBottom: 4 }}>— <span style={{ fontWeight: 500 }}>{a.label}:</span> {a.reason}</div>
            ))}
            {(olAvoid ?? []).slice(0, 2).map((text) => (
              <div key={text} style={{ ...T.small, color: B.muted, marginBottom: 4 }}>— {text}</div>
            ))}
          </div>
        )}

        {/* Industry-specific reassessment triggers */}
        {olTriggers && olTriggers.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 8 }}>When to reassess</div>
            {olTriggers.slice(0, 3).map((t) => (
              <div key={t.trigger_id} style={{ ...T.small, color: B.muted, display: "flex", gap: 8, marginBottom: 4 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: B.purple, marginTop: 6, flexShrink: 0 }} />
                {t.display_text}
              </div>
            ))}
          </div>
        )}

        {/* Advisor Discussion Guide — plain language */}
        <SectionDivider />
        <Overline large>Share With Your Advisor</Overline>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
          {[
            `Score: ${score}/100 (${record.stability_band}). ${peerPercentileValue ? `${record.peer_stability_percentile_label} percentile in ${industrySector}.` : ""}`,
            `Primary risk: ${dominantConstraintPlain[dominantConstraint]}. Stress test shows a ${record.risk_scenario_drop}-point drop if the biggest source is lost.`,
            `Income runway: ${continuityDisplay} without active work. ${record.active_income_level}% of income requires daily effort.`,
          ].map((tp, i) => (
            <div key={i} style={{ ...T.small, color: B.muted, display: "flex", gap: 8 }}>
              <span style={{ color: B.purple, fontWeight: 600, flexShrink: 0 }}>{i + 1}.</span>{tp}
            </div>
          ))}
        </div>

        {/* Scripts — browser-only (copy-to-clipboard doesn't work in PDF) */}
        {v2ScriptTemplates && v2ScriptTemplates.length > 0 && (
          <div className="no-print">
          <SectionDivider />
          <Overline large>Ready-to-Use Scripts</Overline>
          <p style={{ ...T.small, color: B.muted, marginBottom: 12 }}>
            Do not just know what to do — have the words to do it. Copy, customize, and send.
          </p>
          {v2ScriptTemplates.map((script) => {
            const isExpanded = expandedScript === script.id;
            return (
              <div key={script.id} style={{ marginBottom: 8, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, overflow: "hidden" }}>
                <button onClick={() => setExpandedScript(isExpanded ? null : script.id)} style={{ width: "100%", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "none", cursor: "pointer", backgroundColor: isExpanded ? "rgba(75,63,174,0.04)" : B.bone, transition: "background-color 150ms ease" }}>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ ...T.sectionLabel, color: B.navy }}>{script.title}</div>
                    <div style={{ ...T.meta, color: B.muted }}>{script.context}</div>
                  </div>
                  <span style={{ ...T.sectionLabel, color: B.purple, transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 150ms ease" }}>▾</span>
                </button>
                {isExpanded && (
                  <div style={{ padding: "16px 20px", backgroundColor: "#fff", borderTop: `1px solid ${B.stone}` }}>
                    <pre style={{ ...T.small, color: B.navy, margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.7, fontFamily: "inherit" }}>{script.script}</pre>
                    <button onClick={() => navigator.clipboard.writeText(script.script)} style={{ marginTop: 10, padding: "6px 14px", fontSize: 11, fontWeight: 600, color: B.purple, borderRadius: 6, border: `1px solid ${B.purple}`, cursor: "pointer", backgroundColor: "rgba(75,63,174,0.04)" }}>
                      Copy to clipboard
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          </div>
        )}

        {/* Reassessment + Verification */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "16px 20px" }}>
            <Overline>WHEN TO REASSESS</Overline>
            <div style={{ ...T.cardHeading, color: B.navy, marginBottom: 2 }}>{reassessDate}</div>
            <div style={{ ...T.cardHeading, color: B.purple, marginBottom: 6 }}>{reassessDaysLeft} days from now</div>
            <p style={{ ...T.meta, color: B.muted, margin: 0, lineHeight: 1.5 }}>{copy.p5_reassess}</p>
          </div>
          <div style={{ flex: 1, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "16px 20px" }}>
            <Overline>VERIFICATION</Overline>
            <div style={{ ...T.meta, color: B.ink, display: "flex", flexDirection: "column", gap: 2 }}>
              <div>Record ID: <span style={{ fontFamily: "monospace", fontSize: 9 }}>{record.record_id.slice(0, 8)}</span></div>
              <div>Registry Status: Private Record</div>
              <div>Model: {record.model_version || "RP-2.0"}</div>
              <div>Verification: peoplestar.com/RunPayway/verify</div>
            </div>
          </div>
        </div>

        <p style={{ ...T.meta, color: B.taupe, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
          The Income Stability Score™ is a present-state income stability assessment based on information provided by the user. It does not provide financial advice and does not predict future financial outcomes. This report reflects a present-state structural interpretation under the RunPayway™ framework.
        </p>

        <PageFooter section={isHighScorer ? "How to Protect Your Position" : "Your Action Plan"} page={5} />
      </ReportPage>


      {/* Old Page 6 dead code — clean removal */}
      {false && (
      <div>

        {/* ── LIVE SIMULATOR ── */}
        {v2NormalizedInputs && (() => {
          const baseInputs: CanonicalInput = {
            income_persistence_pct: v2NormalizedInputs.income_persistence_pct,
            largest_source_pct: v2NormalizedInputs.largest_source_pct,
            source_diversity_count: v2NormalizedInputs.source_diversity_count,
            forward_secured_pct: v2NormalizedInputs.forward_secured_pct,
            income_variability_level: v2NormalizedInputs.income_variability_level as "low" | "moderate" | "high" | "extreme",
            labor_dependence_pct: v2NormalizedInputs.labor_dependence_pct,
          };
          const qualityScore = v2Quality?.quality_score ?? 5;
          const activePreset = SIMULATOR_PRESETS.find(p => p.id === simPreset);
          const simInputs = activePreset ? activePreset.modify(baseInputs) : baseInputs;
          const simResult = simulateScore(simInputs, qualityScore);
          const scoreDelta = simResult.overall_score - score;
          const progressionTiers = computeProgressionTiers(score, baseInputs, qualityScore);

          return (
            <>
            <Overline large>Score Simulator</Overline>
            <p style={{ ...T.small, color: B.muted, marginBottom: 12 }}>
              Click a scenario to see how it would change your score in real time.
            </p>

            {/* Preset buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {SIMULATOR_PRESETS.map((preset) => {
                const isActive = simPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setSimPreset(isActive ? null : preset.id)}
                    style={{
                      padding: "8px 14px", fontSize: 11, fontWeight: 600, borderRadius: 6, border: `1px solid ${isActive ? B.purple : B.stone}`, cursor: "pointer", transition: "all 150ms ease",
                      backgroundColor: isActive ? "rgba(75,63,174,0.08)" : "#fff",
                      color: isActive ? B.purple : B.navy,
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Simulation result */}
            <div style={{ display: "flex", gap: 16, marginBottom: 20, padding: "20px 24px", backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4 }}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>CURRENT SCORE</div>
                <div style={{ ...T.cardHero, color: B.navy }}>{score}</div>
                <div style={{ ...T.meta, color: B.muted }}>{record.stability_band}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", color: B.taupe, fontSize: 20 }}>→</div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>{simPreset ? "SIMULATED SCORE" : "NO CHANGES"}</div>
                <div style={{ ...T.cardHero, color: scoreDelta > 0 ? B.teal : scoreDelta < 0 ? B.bandLimited : B.navy }}>{simResult.overall_score}</div>
                <div style={{ ...T.meta, color: B.muted }}>{simResult.band}</div>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>CHANGE</div>
                <div style={{ ...T.cardHero, color: scoreDelta > 0 ? B.teal : scoreDelta < 0 ? B.bandLimited : B.muted }}>
                  {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta === 0 ? "—" : String(scoreDelta)}
                </div>
                <div style={{ ...T.meta, color: B.muted }}>Fragility: {simResult.fragility_class}</div>
              </div>
            </div>

            {activePreset && (
              <div style={{ backgroundColor: "rgba(75,63,174,0.04)", borderRadius: 4, padding: "12px 16px", marginBottom: 20 }}>
                <div style={{ ...T.sectionLabel, color: B.purple, marginBottom: 4 }}>{activePreset.label}</div>
                <p style={{ ...T.small, color: B.muted, margin: 0 }}>{activePreset.description}</p>
                {scoreDelta !== 0 && (
                  <p style={{ ...T.small, color: scoreDelta > 0 ? B.teal : B.bandLimited, margin: "6px 0 0", fontWeight: 600 }}>
                    {scoreDelta > 0 ? `This move would improve your score by ${scoreDelta} points${simResult.band !== record.stability_band ? ` and move you to ${simResult.band}` : ""}.` : `This would drop your score by ${Math.abs(scoreDelta)} points${simResult.band !== record.stability_band ? ` — dropping you to ${simResult.band}` : ""}.`}
                  </p>
                )}
              </div>
            )}

            <SectionDivider />

            {/* ── INCOME RUNWAY CALCULATOR ── */}
            <Overline large>Income Runway Calculator</Overline>
            {(() => {
              const runwayDays = Math.round(record.income_continuity_months * 30);
              const target90Days = 90 - runwayDays;
              const persistenceNeeded = Math.max(0, Math.round((90 / 30 - record.income_continuity_months) / 0.03));
              return (
                <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                  <div style={{ flex: 1, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "16px 20px", textAlign: "center" }}>
                    <div style={{ ...T.overline, color: B.taupe, marginBottom: 8 }}>IF YOU STOP WORKING TODAY</div>
                    <div style={{ fontSize: 40, fontWeight: 600, lineHeight: 1.1, color: runwayDays < 30 ? B.bandLimited : runwayDays < 90 ? B.bandDeveloping : B.teal, marginBottom: 4 }}>{runwayDays}</div>
                    <div style={{ ...T.sectionLabel, color: B.navy }}>days of income</div>
                    <p style={{ ...T.meta, color: B.muted, marginTop: 8, lineHeight: 1.5 }}>
                      {runwayDays < 14 ? "This is a crisis-level runway. Any disruption becomes an emergency." : runwayDays < 30 ? "Less than one month. A single slow period could force difficult decisions." : runwayDays < 90 ? "Moderate runway, but not enough for a real transition or recovery." : "Strong runway. You could handle a significant disruption."}
                    </p>
                  </div>
                  <div style={{ flex: 1, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "16px 20px" }}>
                    <div style={{ ...T.overline, color: B.taupe, marginBottom: 8 }}>TO REACH 90 DAYS</div>
                    {runwayDays >= 90 ? (
                      <>
                      <div style={{ ...T.cardHero, color: B.teal, marginBottom: 8 }}>Already there</div>
                      <p style={{ ...T.small, color: B.muted, margin: 0 }}>You have 90+ days of income runway. Focus on maintaining this buffer.</p>
                      </>
                    ) : (
                      <>
                      <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 8 }}>You need {target90Days} more days</div>
                      <p style={{ ...T.small, color: B.muted, margin: 0, lineHeight: 1.55 }}>
                        Increase recurring revenue by ~{Math.min(persistenceNeeded, 100 - baseInputs.income_persistence_pct)}% to close the gap. This means converting {Math.ceil(persistenceNeeded / 15)} more client{Math.ceil(persistenceNeeded / 15) > 1 ? "s" : ""} to retainers or building {Math.ceil(persistenceNeeded / 20)} passive income stream{Math.ceil(persistenceNeeded / 20) > 1 ? "s" : ""}.
                      </p>
                      </>
                    )}
                  </div>
                </div>
              );
            })()}

            <SectionDivider />

            {/* ── SCORE IMPROVEMENT ROADMAP ── */}
            <Overline large>Score Progression Roadmap</Overline>
            <p style={{ ...T.small, color: B.muted, marginBottom: 12 }}>
              Here is exactly what it takes to reach each level — and the maximum score possible with your income model.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {progressionTiers.map((tier) => {
                const tierColor = tier.target_score >= 75 ? B.bandHigh : tier.target_score >= 50 ? B.bandEstablished : tier.target_score >= 30 ? B.bandDeveloping : B.bandLimited;
                return (
                  <div key={tier.target_score} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 16px", backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderLeft: `3px solid ${tierColor}`, borderRadius: 4 }}>
                    <div style={{ minWidth: 50, textAlign: "center" }}>
                      <div style={{ ...T.cardHero, color: tierColor, fontSize: 20 }}>{tier.target_score}</div>
                      <div style={{ ...T.meta, color: B.muted }}>+{tier.current_gap}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 2 }}>{tier.target_band}</div>
                      <p style={{ ...T.small, color: B.muted, margin: 0 }}>{tier.what_to_do}</p>
                      {tier.achievable && <span style={{ ...T.meta, color: B.teal, fontWeight: 600 }}>Achievable with focused effort</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            </>
          );
        })()}

        {/* ── PREDICTIVE WARNINGS ── */}
        {v2PredictiveWarnings && v2PredictiveWarnings.length > 0 && (
          <>
          <SectionDivider />
          <Overline large>What You Are Likely to Do Wrong Next</Overline>
          <p style={{ ...T.small, color: B.muted, marginBottom: 12 }}>
            Based on your structure, these are the mistakes people in your position typically make in the coming months.
          </p>
          {v2PredictiveWarnings.map((w, i) => (
            <div key={i} style={{ backgroundColor: "rgba(155,44,44,0.03)", border: "1px solid rgba(155,44,44,0.08)", borderLeft: `3px solid ${B.bandLimited}`, borderRadius: 4, padding: "14px 18px", marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ ...T.sectionLabel, color: B.navy }}>{w.headline}</div>
                <span style={{ ...T.micro, color: B.bandLimited }}>{w.timeframe}</span>
              </div>
              <p style={{ ...T.small, color: B.muted, margin: 0, lineHeight: 1.55 }}>{w.explanation}</p>
            </div>
          ))}
          </>
        )}

        {/* ── BEHAVIORAL INSIGHTS ── */}
        {v2BehavioralInsights && v2BehavioralInsights.length > 0 && (
          <>
          <SectionDivider />
          <Overline large>What Your Structure Says About Your Decisions</Overline>
          <p style={{ ...T.small, color: B.muted, marginBottom: 12 }}>
            Your income structure reveals patterns in how you make decisions. Understanding these patterns is the first step to changing them.
          </p>
          {v2BehavioralInsights.map((b, i) => (
            <div key={i} style={{ backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "16px 20px", marginBottom: 10 }}>
              <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 6 }}>{b.pattern}</div>
              <p style={{ ...T.small, color: B.muted, margin: "0 0 8px", lineHeight: 1.55 }}>{b.consequence}</p>
              <div style={{ borderTop: `1px solid ${B.stone}`, paddingTop: 8 }}>
                <div style={{ ...T.meta, color: B.teal, fontWeight: 600, marginBottom: 2 }}>HOW TO REFRAME</div>
                <p style={{ ...T.small, color: B.navy, margin: 0, fontWeight: 500 }}>{b.reframe}</p>
              </div>
            </div>
          ))}
          </>
        )}

        {/* ── VISUAL INCOME MAP ── */}
        {v2NormalizedInputs && (() => {
          const ni = v2NormalizedInputs;
          const riskLevel = (val: number, threshold: number) => {
            return val >= threshold ? B.bandLimited : val >= threshold * 0.6 ? B.bandDeveloping : B.teal;
          };
          return (
            <>
            <SectionDivider />
            <Overline large>Your Income System Map</Overline>
            <p style={{ ...T.small, color: B.muted, marginBottom: 16 }}>
              A visual overview of how your income flows, where dependencies exist, and where risk concentrates.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 20 }}>
              {/* Row 1: Sources */}
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 8 }}>
                {Array.from({ length: Math.min(6, ni.source_diversity_count) }, (_, i) => (
                  <div key={i} style={{ width: 60, height: 40, borderRadius: 4, backgroundColor: i === 0 ? riskLevel(ni.largest_source_pct, 60) : B.teal, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(14,26,43,0.08)" }}>
                    <span style={{ ...T.meta, color: "#fff", fontWeight: 600 }}>{i === 0 ? `${ni.largest_source_pct}%` : ""}</span>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center", ...T.meta, color: B.taupe, marginBottom: 4 }}>{ni.source_diversity_count} income source{ni.source_diversity_count !== 1 ? "s" : ""} → {ni.largest_source_pct}% from largest</div>

              {/* Row 2: Flow indicators */}
              <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 8 }}>
                {[
                  { label: "Recurring", value: `${ni.income_persistence_pct}%`, color: riskLevel(100 - ni.income_persistence_pct, 70) },
                  { label: "Forward", value: `${ni.forward_secured_pct}%`, color: riskLevel(100 - ni.forward_secured_pct, 70) },
                  { label: "Passive", value: `${100 - ni.labor_dependence_pct}%`, color: riskLevel(ni.labor_dependence_pct, 70) },
                ].map((item) => (
                  <div key={item.label} style={{ textAlign: "center", padding: "8px 16px", borderRadius: 4, backgroundColor: B.bone, border: `2px solid ${item.color}`, minWidth: 80 }}>
                    <div style={{ ...T.sectionLabel, color: item.color }}>{item.value}</div>
                    <div style={{ ...T.meta, color: B.muted }}>{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Row 3: Risk indicators */}
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                {[
                  { label: "Concentration Risk", active: ni.largest_source_pct >= 50 },
                  { label: "Labor Risk", active: ni.labor_dependence_pct >= 70 },
                  { label: "Visibility Risk", active: ni.forward_secured_pct <= 20 },
                  { label: "Variability Risk", active: ni.income_variability_level === "high" || ni.income_variability_level === "extreme" },
                ].filter(r => r.active).map((risk) => (
                  <span key={risk.label} style={{ ...T.micro, color: B.bandLimited, padding: "4px 10px", borderRadius: 10, backgroundColor: "rgba(155,44,44,0.06)", border: "1px solid rgba(155,44,44,0.12)" }}>
                    {risk.label}
                  </span>
                ))}
                {ni.largest_source_pct < 50 && ni.labor_dependence_pct < 70 && ni.forward_secured_pct > 20 && ni.income_variability_level !== "high" && ni.income_variability_level !== "extreme" && (
                  <span style={{ ...T.micro, color: B.teal, padding: "4px 10px", borderRadius: 10, backgroundColor: "rgba(31,109,122,0.06)", border: "1px solid rgba(31,109,122,0.12)" }}>
                    No critical risk flags
                  </span>
                )}
              </div>
            </div>
            </>
          );
        })()}

        {/* ── EXECUTION ROADMAP ── */}
        {v2ExecutionRoadmap && v2ExecutionRoadmap.length > 0 && (
          <>
          <SectionDivider />
          <Overline large>Your 6-Week Execution Plan</Overline>
          <p style={{ ...T.small, color: B.muted, marginBottom: 12 }}>
            Here is exactly what to do for the next 6 weeks. Each step builds on the last. Follow this and you will see measurable structural improvement.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 20 }}>
            {v2ExecutionRoadmap.map((week, i) => (
              <div key={i} style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: i < v2ExecutionRoadmap.length - 1 ? `1px solid ${B.stone}` : "none" }}>
                <div style={{ minWidth: 70, flexShrink: 0 }}>
                  <div style={{ ...T.sectionLabel, color: B.purple }}>{week.week}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 4 }}>{week.action}</div>
                  <p style={{ ...T.small, color: B.muted, margin: "0 0 6px", lineHeight: 1.55 }}>{week.detail}</p>
                  <div style={{ ...T.meta, color: B.teal, fontWeight: 500 }}>Success metric: {week.success_metric}</div>
                </div>
              </div>
            ))}
          </div>
          </>
        )}

        {/* ── SCRIPTS & TEMPLATES ── */}
        {v2ScriptTemplates && v2ScriptTemplates.length > 0 && (
          <>
          <SectionDivider />
          <Overline large>Ready-to-Use Scripts</Overline>
          <p style={{ ...T.small, color: B.muted, marginBottom: 12 }}>
            Do not just know what to do — have the words to do it. These scripts are tailored to your situation. Copy, customize, and send.
          </p>
          {v2ScriptTemplates.map((script) => {
            const isExpanded = expandedScript === script.id;
            return (
              <div key={script.id} style={{ marginBottom: 8, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, overflow: "hidden" }}>
                <button
                  onClick={() => setExpandedScript(isExpanded ? null : script.id)}
                  style={{ width: "100%", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "none", cursor: "pointer", backgroundColor: isExpanded ? "rgba(75,63,174,0.04)" : B.bone, transition: "background-color 150ms ease" }}
                >
                  <div style={{ textAlign: "left" }}>
                    <div style={{ ...T.sectionLabel, color: B.navy }}>{script.title}</div>
                    <div style={{ ...T.meta, color: B.muted }}>{script.context}</div>
                  </div>
                  <span style={{ ...T.sectionLabel, color: B.purple, transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 150ms ease" }}>▾</span>
                </button>
                {isExpanded && (
                  <div style={{ padding: "16px 20px", backgroundColor: "#fff", borderTop: `1px solid ${B.stone}` }}>
                    <pre style={{ ...T.small, color: B.navy, margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.7, fontFamily: "inherit" }}>{script.script}</pre>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(script.script);
                      }}
                      style={{ marginTop: 10, padding: "6px 14px", fontSize: 11, fontWeight: 600, color: B.purple, borderRadius: 6, border: `1px solid ${B.purple}`, cursor: "pointer", backgroundColor: "rgba(75,63,174,0.04)" }}
                    >
                      Copy to clipboard
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          </>
        )}

      </div>
      )}


      {/* ================================================================
          POST-REPORT ACTION PANEL — APP UI, NOT REPORT CONTENT
          ================================================================ */}
      <div className="download-section no-print" style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
        {/* Primary actions — horizontal row */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={handleDownload}
            disabled={downloading}
            style={{ padding: "12px 24px", fontSize: 14, fontWeight: 600, color: "#ffffff", borderRadius: 12, border: "none", cursor: "pointer", backgroundColor: B.navy, opacity: downloading ? 0.6 : 1, transition: "background-color 180ms ease, transform 180ms ease", flex: 1, minWidth: 180, boxShadow: "0 4px 12px rgba(14,26,43,0.15)" }}
            onMouseEnter={(e) => !downloading && (e.currentTarget.style.backgroundColor = B.purple)}
            onMouseLeave={(e) => !downloading && (e.currentTarget.style.backgroundColor = B.navy)}>
            {downloading ? "Generating PDF…" : "Download Report"}
          </button>

          <button
            onClick={() => {
              const url = `https://peoplestar.com/RunPayway/verify?id=${record.record_id}&auth=${record.authorization_code}`;
              navigator.clipboard.writeText(url).then(() => {
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 3000);
              });
            }}
            style={{ padding: "12px 18px", fontSize: 13, fontWeight: 500, color: linkCopied ? B.purple : B.navy, borderRadius: 12, border: `1px solid ${linkCopied ? B.purple : B.stone}`, cursor: "pointer", backgroundColor: linkCopied ? "rgba(31,109,122,0.06)" : "#ffffff", transition: "all 180ms ease" }}>
            {linkCopied ? "Link Copied" : "Copy Verification Link"}
          </button>

          <button
            onClick={() => {
              const nextDate = new Date(record.issued_timestamp_utc || record.assessment_date_utc);
              nextDate.setMonth(nextDate.getMonth() + (record.final_score < 40 ? 2 : record.final_score >= 80 ? 6 : 3));
              const dateStr = nextDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
              const endDate = new Date(nextDate.getTime() + 30 * 60000);
              const endStr = endDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
              const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("RunPayway™ Income Stability Reassessment")}&dates=${dateStr}/${endStr}&details=${encodeURIComponent(`Time to reassess your Income Stability Score™.\n\nPrevious score: ${record.final_score} (${record.stability_band})\nPrimary focus: ${record.primary_constraint_label}\n\nTake your assessment at https://runpayway.com/pricing`)}`;
              window.open(url, "_blank");
            }}
            style={{ padding: "12px 18px", fontSize: 13, fontWeight: 500, color: B.navy, borderRadius: 12, border: `1px solid ${B.stone}`, cursor: "pointer", backgroundColor: "#ffffff", transition: "all 180ms ease" }}>
            Add Reassessment to Calendar
          </button>
        </div>

        {/* Shareable Score Card */}
        <div id="shareable-score-card" style={{ borderRadius: 16, border: "1px solid rgba(14,26,43,0.08)", overflow: "hidden" }}>
          {/* Card header */}
          <div style={{ background: "linear-gradient(135deg, #0E1A2B 0%, #1a2d45 100%)", padding: "28px 28px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(244,241,234,0.50)", letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 8 }}>INCOME STABILITY SCORE™</div>
                <div style={{ fontSize: 48, fontWeight: 600, color: "#F4F1EA", lineHeight: 1 }}>{record.final_score}</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: bandColor }} />
                  <span style={{ fontSize: 15, fontWeight: 500, color: bandColor }}>{record.stability_band}</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <Image src={logoImg} alt="RunPayway" width={100} height={12} style={{ height: "auto", marginBottom: 8, filter: "brightness(10)" }} />
                <div style={{ fontSize: 10, color: "rgba(244,241,234,0.40)" }}>Verified Assessment</div>
              </div>
            </div>
          </div>
          {/* Card body */}
          <div style={{ padding: "20px 28px 24px", backgroundColor: "#FFFFFF" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              {[
                ["Prepared for", name],
                ["Industry", (record.industry_sector || "").replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())],
                ["Assessed", issuedDate],
              ].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontSize: 10, color: B.taupe, marginBottom: 2 }}>{l}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: B.navy }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ height: 1, backgroundColor: "rgba(14,26,43,0.08)", marginBottom: 16 }} />
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: B.taupe, marginBottom: 2 }}>Peer Percentile</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: B.purple }}>{record.peer_stability_percentile_label || "—"}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: B.taupe, marginBottom: 2 }}>Model Version</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: B.navy }}>RP-2.0</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: B.taupe, marginBottom: 2 }}>Record ID</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: B.navy, fontFamily: "monospace" }}>{record.record_id.slice(0, 8)}</div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: B.taupe, marginBottom: 16 }}>
              Verify this score at peoplestar.com/RunPayway/verify
            </div>
            {/* Share actions */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={() => {
                  const text = `${name} — Income Stability Score™: ${record.final_score} (${record.stability_band}). ${record.peer_stability_percentile_label ? `${record.peer_stability_percentile_label} percentile. ` : ""}Assessed ${issuedDate} under Model RP-2.0. Verify at peoplestar.com/RunPayway/verify?id=${record.record_id}&auth=${record.authorization_code}`;
                  navigator.clipboard.writeText(text).then(() => {
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 3000);
                  });
                }}
                style={{ padding: "10px 16px", fontSize: 12, fontWeight: 600, color: B.navy, borderRadius: 10, border: `1px solid ${B.stone}`, cursor: "pointer", backgroundColor: B.bone, transition: "all 150ms ease", flex: 1 }}
              >
                {linkCopied ? "Copied to clipboard" : "Copy score summary"}
              </button>
              <button
                onClick={() => {
                  const url = `https://peoplestar.com/RunPayway/verify?id=${record.record_id}&auth=${record.authorization_code}`;
                  navigator.clipboard.writeText(url).then(() => {
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 3000);
                  });
                }}
                style={{ padding: "10px 16px", fontSize: 12, fontWeight: 600, color: B.navy, borderRadius: 10, border: `1px solid ${B.stone}`, cursor: "pointer", backgroundColor: B.bone, transition: "all 150ms ease", flex: 1 }}
              >
                Copy verification link
              </button>
              <button
                onClick={async () => {
                  const el = document.getElementById("shareable-score-card");
                  if (!el) return;
                  const sendSection = el.querySelector("[data-send-section]") as HTMLElement | null;
                  if (sendSection) sendSection.style.display = "none";
                  try {
                    const html2canvas = (await import("html2canvas")).default;
                    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
                    if (sendSection) sendSection.style.display = "";
                    const link = document.createElement("a");
                    link.download = `RunPayway-Score-Card-${record.record_id.slice(0, 8)}.png`;
                    link.href = canvas.toDataURL("image/png");
                    link.click();
                  } catch {
                    if (sendSection) sendSection.style.display = "";
                  }
                }}
                style={{ padding: "10px 16px", fontSize: 12, fontWeight: 600, color: "#FFFFFF", borderRadius: 10, border: "none", cursor: "pointer", backgroundColor: B.navy, transition: "all 150ms ease", flex: 1 }}
              >
                Download score card
              </button>
            </div>
          </div>
          {/* Send to someone */}
          <div data-send-section style={{ padding: "16px 28px 20px", backgroundColor: B.bone, borderTop: "1px solid rgba(14,26,43,0.06)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: B.navy, marginBottom: 4 }}>Send to a lender, partner, or advisor</div>
            <p style={{ fontSize: 11, color: B.muted, margin: "0 0 10px 0", lineHeight: 1.5 }}>
              They will receive your score summary and a verification link.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="email"
                placeholder="Recipient's email address"
                value={advisorEmail}
                onChange={(e) => setAdvisorEmail(e.target.value)}
                style={{ flex: 1, padding: "10px 14px", fontSize: 13, borderRadius: 10, border: `1px solid ${B.stone}`, outline: "none", color: B.navy, backgroundColor: "#FFFFFF" }}
              />
              <button
                disabled={advisorSending || advisorSent || !advisorEmail.includes("@")}
                onClick={async () => {
                  setAdvisorSending(true);
                  try {
                    const res = await fetch("/api/v1/send-report", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        recipientEmail: advisorEmail.trim(),
                        assessmentTitle: record.assessment_title,
                        finalScore: record.final_score,
                        stabilityBand: record.stability_band,
                        recordId: record.record_id,
                        modelVersion: record.model_version || "RP-2.0",
                        issuedTimestamp: record.issued_timestamp_utc || record.assessment_date_utc,
                        industrySector: record.industry_sector,
                        classification: record.classification,
                        primaryConstraintLabel: record.primary_constraint_label,
                        bandInterpretationText: record.band_interpretation_text,
                        peerPercentileLabel: record.peer_stability_percentile_label,
                      }),
                    });
                    if (res.ok) { setAdvisorSent(true); }
                  } catch { /* silent */ }
                  finally { setAdvisorSending(false); }
                }}
                style={{ padding: "10px 20px", fontSize: 13, fontWeight: 600, color: "#ffffff", borderRadius: 10, border: "none", cursor: advisorSent ? "default" : "pointer", backgroundColor: B.purple, opacity: advisorSending || (!advisorEmail.includes("@")) ? 0.6 : 1, transition: "all 180ms ease", whiteSpace: "nowrap" }}>
                {advisorSent ? "Sent" : advisorSending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>

        {downloadError && (
          <div style={{ padding: "10px 16px", borderRadius: 10, backgroundColor: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.12)" }}>
            <p style={{ fontSize: 13, color: "#DC2626", margin: 0 }}>PDF download failed: {downloadError}. Try refreshing the page.</p>
          </div>
        )}

        {/* Email delivery status */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {emailStatus === "sending" && (
            <>
              <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: B.taupe, animation: "pulse 1.2s infinite" }} />
              <span style={{ fontSize: 13, color: B.muted }}>Sending report to your email...</span>
            </>
          )}
          {emailStatus === "sent" && (
            <>
              <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: B.purple }} />
              <span style={{ fontSize: 13, color: B.purple, fontWeight: 500 }}>Report sent to your email</span>
            </>
          )}
          {emailStatus === "error" && (
            <>
              <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: B.muted }} />
              <span style={{ fontSize: 13, color: B.muted }}>Email delivery unavailable — download PDF above</span>
            </>
          )}
        </div>

        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
      </div>

      {/* ── Print stylesheet + dark mode ── */}
      <style>{`
        @page {
          size: letter;
          margin: 0.5in;
        }
        @media print {
          .no-print, .download-section { display: none !important; }
          .report-page {
            break-inside: avoid;
            page-break-inside: avoid;
            page-break-after: always;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 0.5in !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: auto !important;
            color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .report-page:last-child {
            page-break-after: auto;
          }
          body { background: white !important; }
        }
        @media (prefers-color-scheme: dark) {
          .report-page {
            background-color: #ffffff !important;
          }
        }
      `}</style>
    </div>
    </ReportErrorBoundary>
  );
}
