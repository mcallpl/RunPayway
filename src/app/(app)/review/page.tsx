"use client";

import { useEffect, useState, useRef, Component, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoImg from "../../../../public/runpayway-logo.png";
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
  pagePad: 40,
  headerMb: 16,
  sectionGap: 24,
  sectionMb: 20,
  cardMb: 16,
  labelMb: 8,
  paraMb: 12,
  itemGap: 12,
  cardGap: 12,
  rowGap: 16,
  dividerMy: 20,
  footerMt: 16,
  cardPad: "16px 20px" as string,
};

// ── Reusable card style ──
const cardStyle: React.CSSProperties = {
  backgroundColor: B.bone,
  border: "1px solid rgba(14,26,43,0.06)",
  borderRadius: 4,
  padding: R.cardPad,
};

const accentGradient = `linear-gradient(90deg, ${B.purple} 0%, ${B.teal} 100%)`;

// ── Typography: 7-step scale optimized for print clarity ──
const T = {
  score: { fontSize: 72, fontWeight: 600, lineHeight: 1 },                                          // The big number
  pageTitle: { fontSize: 24, fontWeight: 600, lineHeight: 1.2, color: B.navy },                     // Page titles
  sectionTitle: { fontSize: 15, fontWeight: 600, lineHeight: 1.3, color: B.navy },                  // Major section headers (H2)
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

function ReportPage({ children, noPad }: { record?: AssessmentRecord; children: React.ReactNode; noPad?: boolean }) {
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
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: accentGradient }} />
      {children}
    </div>
  );
}

// ── QR Code component ──
function QRCodeImage({ recordId, authCode, score, band, date, model }: { recordId: string; authCode?: string; score?: number; band?: string; date?: string; model?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [simUrl, setSimUrl] = useState("/simulator");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const params = new URLSearchParams();
    try {
      const stored = sessionStorage.getItem("rp_record");
      if (stored) {
        const rec = JSON.parse(stored);
        const v2 = rec._v2;
        if (v2?.normalized_inputs) {
          const ni = v2.normalized_inputs;
          params.set("p", String(ni.income_persistence_pct));
          params.set("c", String(ni.largest_source_pct));
          params.set("src", String(ni.source_diversity_count));
          params.set("f", String(ni.forward_secured_pct));
          params.set("v", ni.income_variability_level);
          params.set("l", String(ni.labor_dependence_pct));
          params.set("q", String(v2.quality?.quality_score ?? 5));
        }
        if (score !== undefined) params.set("s", String(score));
        if (band) params.set("b", band);
        if (rec.assessment_title) params.set("n", encodeURIComponent(rec.assessment_title));
        if (rec.industry_sector) params.set("ind", encodeURIComponent(rec.industry_sector));
        if (rec.primary_income_model) params.set("mod", encodeURIComponent(rec.primary_income_model));
      }
    } catch { /* fallback */ }
    params.set("id", recordId);
    const url = `https://peoplestar.com/RunPayway/simulator?${params.toString()}`;
    // Use full URL for click link — basePath not auto-prepended on raw <a> tags
    setSimUrl(`https://peoplestar.com/RunPayway/simulator?${params.toString()}`);
    import("qrcode").then((QRCode) => {
      QRCode.toCanvas(canvas, url, {
        width: 140,
        margin: 2,
        color: { dark: "#0E1A2B", light: "#FFFFFF" },
        errorCorrectionLevel: "M",
      });
    }).catch(() => {});
  }, [recordId, authCode, score, band]);

  return (
    <a href={simUrl} style={{ display: "block", cursor: "pointer" }} title="Open Score Simulator">
      <canvas ref={canvasRef} width={140} height={140} style={{ width: 80, height: 80 }} />
    </a>
  );
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
    alert("Download libraries failed to load. Please check your connection and try again.");
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
  const [expandedScript, setExpandedScript] = useState<string | null>(null);
  const [scriptCopied, setScriptCopied] = useState<string | null>(null);
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

  // ── Strategic insight data (RP-2.1) ──
  const v2SurprisingInsights = v2?.surprising_insights ?? null;
  const v2TradeoffNarratives = v2?.tradeoff_narratives ?? null;
  const v2OneThingThatMatters = v2?.one_thing_that_matters ?? null;
  const v2PredictiveWarnings = v2?.predictive_warnings ?? null;
  const v2ScriptTemplates = v2?.script_templates ?? null;
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
          <div style={{ flexShrink: 0, textAlign: "center", maxWidth: 120 }}>
            <QRCodeImage recordId={record.record_id} authCode={record.authorization_code} score={record.final_score} band={record.stability_band} date={issuedDate} model={record.model_version || "RP-2.0"} />
            <div style={{ ...T.overline, color: B.purple, marginTop: 6, fontSize: 8 }}>SIMULATOR &amp; STABILITY BRIEF&#8482;</div>
            <div style={{ ...T.meta, color: B.muted, marginTop: 2, lineHeight: 1.4 }}>Tap or scan to model scenarios and generate briefs</div>
          </div>
        </div>

        <h1 style={{ ...T.pageTitle, marginBottom: 12 }}>Your Score</h1>

        <div style={{ marginBottom: 20 }}>
          <div style={{ marginBottom: 12 }}><span style={{ ...T.score, color: B.navy }}>{animatedScore}</span><span style={{ fontSize: 24, fontWeight: 400, color: B.taupe }}>/100</span></div>
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

        {/* What this score means — with your actual numbers */}
        <div style={{ ...cardStyle, marginBottom: 16 }}>
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
              <div style={{ ...cardStyle, marginBottom: 12 }}>
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
          <div style={{ flex: 3, ...cardStyle }}>
            <Overline>IF YOUR BIGGEST SOURCE DISAPPEARED</Overline>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
              <span style={{ ...T.cardHero, color: B.navy }}>{record.final_score}<span style={{ ...T.meta, color: B.taupe }}>/100</span></span>
              <span style={{ ...T.sectionLabel, color: B.taupe }}>→</span>
              <span style={{ ...T.cardHero, color: B.bandLimited }}>{Math.max(0, record.risk_scenario_score)}<span style={{ ...T.meta, color: B.taupe }}>/100</span></span>
            </div>
            <p style={{ ...T.small, color: B.muted, margin: 0 }}>
              {record.risk_scenario_drop}-point drop on the 0–100 scale.{record.risk_scenario_drop > score * 0.4 ? " Severe dependency." : ""}
            </p>
          </div>
          <div style={{ flex: 2, ...cardStyle }}>
            <Overline>HOW LONG INCOME LASTS WITHOUT WORK</Overline>
            <div style={{ ...T.cardHero, color: B.navy, marginBottom: 8 }}>{continuityDisplay}</div>
            <p style={{ ...T.small, color: B.muted, margin: 0 }}>
              {record.income_continuity_months < 1 ? `Critically short for a ${structureDesc}.` : record.income_continuity_months < 3 ? `Limited runway.` : record.income_continuity_months < 6 ? `Moderate runway.` : `Strong window.`}
            </p>
          </div>
        </div>

        <SectionDivider />

        {/* Peer comparison */}
        {v2Benchmarks && v2Benchmarks.outlier_dimensions.length > 0 && (
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            <div style={{ ...T.overline, color: B.teal, marginBottom: 8 }}>{isHighScorer ? `YOU OUTPERFORM ${100 - (peerPercentileValue ?? 50)}% OF ${(olIndustryLabel || industrySector).toUpperCase()} PROFESSIONALS` : `HOW YOU COMPARE TO PEERS${olIndustryLabel ? ` IN ${olIndustryLabel.toUpperCase()}` : ""}`}</div>
            <div style={{ display: "flex", gap: 16, marginBottom: 10, padding: "8px 0", borderBottom: `1px solid ${B.stone}` }}>
              <div style={{ ...T.small, color: B.navy }}>Your Score: <span style={{ fontWeight: 700, ...T.sectionLabel }}>{score}/100</span></div>
              <div style={{ ...T.small, color: B.muted }}>Peer Average: <span style={{ fontWeight: 700, ...T.sectionLabel, color: B.navy }}>{v2Benchmarks.cluster_average_score}/100</span></div>
              <div style={{ ...T.small, color: B.muted }}>Top 20%: <span style={{ fontWeight: 700, ...T.sectionLabel, color: B.teal }}>{v2Benchmarks.top_20_threshold}/100</span></div>
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
                    <span style={{ ...T.meta, color: B.muted }}>You: <span style={{ fontWeight: 600, color: B.navy }}>{Math.round(d.user_value)}/100</span></span>
                    <span style={{ ...T.meta, color: B.muted }}>Peers: <span style={{ fontWeight: 600 }}>{Math.round(d.peer_average)}/100</span></span>
                    <span style={{ ...T.micro, color: d.direction === "above" ? B.teal : B.bandLimited, fontWeight: 600 }}>{d.direction === "above" ? "▲" : "▼"} {d.direction}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <PageFooter section="How Your Income Is Built" page={2} />
      </ReportPage>

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
                      {s.original_score}/100 → <span style={{ color: B.bandLimited }}>{s.scenario_score}/100</span>
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

        {/* Surprising Insights — aha moments between confrontation and foresight */}
        {v2SurprisingInsights && v2SurprisingInsights.length > 0 && (
          <>
          <SectionDivider />
          <Overline large>What You Might Not Realize</Overline>
          {v2SurprisingInsights.map((insight, i) => (
            <div key={i} style={{ ...cardStyle, borderLeft: `3px solid ${B.purple}`, marginBottom: 10 }}>
              <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 6 }}>{insight.headline}</div>
              <p style={{ ...T.small, color: B.muted, margin: "0 0 6px", lineHeight: 1.55 }}>{insight.explanation}</p>
              <div style={{ ...T.meta, color: B.taupe, fontStyle: "italic" }}>{insight.data_point}</div>
            </div>
          ))}
          </>
        )}

        {/* Predictive Warnings — static, in PDF */}
        {v2PredictiveWarnings && v2PredictiveWarnings.length > 0 && (
          <>
          <SectionDivider />
          <Overline large>What You Are Likely to Do Wrong Next</Overline>
          {v2PredictiveWarnings.map((w, i) => (
            <div key={i} style={{ backgroundColor: "rgba(155,44,44,0.03)", border: "1px solid rgba(155,44,44,0.08)", borderLeft: `3px solid ${B.bandLimited}`, borderRadius: 4, padding: R.cardPad, marginBottom: 8 }}>
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
        <h1 style={{ ...T.pageTitle, marginBottom: 16 }}>Your Income Deep Dive</h1>

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
                <div key={ind.key} style={{ flex: "1 1 calc(33.33% - 8px)", minWidth: 190, ...cardStyle }}>
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
              <div style={{ flex: 1, ...cardStyle }}>
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
              <div style={{ flex: 1, ...cardStyle }}>
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
              <div style={{ flex: 1, ...cardStyle }}>
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
                    {e.points > 0 ? "+" : ""}{e.points} score pts
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ ...T.small, color: B.muted, marginBottom: 16 }}>
            Net effect on your score: <span style={{ fontWeight: 600, color: v2Interactions.net_adjustment >= 0 ? B.teal : B.bandLimited }}>{v2Interactions.net_adjustment > 0 ? "+" : ""}{v2Interactions.net_adjustment} of 100</span>
          </div>
          </>
        )}

        {/* Surprising Insights moved to Page 3 */}

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
            <div style={{ ...T.cardHeading, color: bandColor }}>{record.stability_band} | {record.final_score}/100</div>
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
                      <div>
                        <span style={{ ...T.sectionLabel, color: B.navy }}>{title}</span>
                        {s.change_description && <div style={{ ...T.meta, color: B.muted }}>{s.change_description}{s.band_shift ? ` — moves you to ${s.projected_band}` : ""}</div>}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <span style={{ ...T.small, color: B.teal, fontWeight: 600 }}>+{s.lift}</span>
                      <span style={{ ...T.meta, color: B.muted }}>→ {s.projected_score}/100</span>
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
                <span style={{ ...T.meta, color: B.navy, fontWeight: 600, minWidth: 36, textAlign: "right" }}>{record.final_score}/100</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ ...T.meta, color: B.muted, minWidth: 50 }}>After</span>
                <div style={{ flex: 1, height: 8, backgroundColor: "rgba(14,26,43,0.06)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(100, v2Lift.combined_top_two.projected_score)}%`, backgroundColor: B.teal, borderRadius: 4 }} />
                </div>
                <span style={{ ...T.meta, color: B.teal, fontWeight: 600, minWidth: 36, textAlign: "right" }}>{v2Lift.combined_top_two.projected_score}/100</span>
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
            ? olActions.slice(0, 3).map((a, i) => {
                // Blend OL narrative with v2 engine specifics (timeframe/target/tradeoff)
                const v2Match = v2?.recommended_actions?.find(ra => ra.category === a.action_id || ra.label.toLowerCase().includes(a.label.toLowerCase().split(" ")[0]));
                return {
                  rank: `${i + 1}`,
                  title: a.label,
                  copy: a.description,
                  why: a.why_now,
                  effect: a.expected_effect,
                  timeframe: (v2Match as Record<string, string>)?.timeframe ?? "",
                  target: (v2Match as Record<string, string>)?.target ?? "",
                  tradeoff: (v2Match as Record<string, string>)?.tradeoff ?? "",
                };
              })
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

        {/* What NOT to do — inline with actions */}
        {((v2AvoidActions && v2AvoidActions.length > 0) || (olAvoid && olAvoid.length > 0)) && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ ...T.sectionLabel, color: B.bandLimited, marginBottom: 8 }}>What to avoid</div>
            {(v2AvoidActions ?? []).slice(0, 2).map((a) => (
              <div key={a.action_id} style={{ ...T.small, color: B.muted, marginBottom: 4 }}>— <span style={{ fontWeight: 500 }}>{a.label}:</span> {a.reason}</div>
            ))}
            {(olAvoid ?? []).slice(0, 2).map((text) => (
              <div key={text} style={{ ...T.small, color: B.muted, marginBottom: 4 }}>— {text}</div>
            ))}
          </div>
        )}

        <SectionDivider />

        {/* Tradeoffs — merged from former Page 6 */}
        {v2TradeoffNarratives && v2TradeoffNarratives.length > 0 && (
          <div style={{ marginBottom: R.sectionMb }}>
            <Overline large>Tradeoffs to Understand</Overline>
            {v2TradeoffNarratives.map((t, i) => (
              <div key={i} style={{ ...cardStyle, marginBottom: 8 }}>
                <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 6 }}>{t.action_label}</div>
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ flex: 1 }}><div style={{ ...T.meta, color: B.teal, fontWeight: 600, marginBottom: 4 }}>THE UPSIDE</div><p style={{ ...T.meta, color: B.muted, margin: 0, lineHeight: 1.5 }}>{t.upside}</p></div>
                  <div style={{ flex: 1 }}><div style={{ ...T.meta, color: B.bandDeveloping, fontWeight: 600, marginBottom: 4 }}>THE COST</div><p style={{ ...T.meta, color: B.muted, margin: 0, lineHeight: 1.5 }}>{t.downside}</p></div>
                </div>
                <div style={{ borderTop: `1px solid ${B.stone}`, marginTop: 8, paddingTop: 6 }}><p style={{ ...T.meta, color: B.navy, margin: 0, fontWeight: 500 }}>{t.net_recommendation}</p></div>
              </div>
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
                    <button onClick={() => { navigator.clipboard.writeText(script.script); setScriptCopied(script.id); setTimeout(() => setScriptCopied(null), 2000); }} style={{ marginTop: 10, padding: "6px 14px", fontSize: 11, fontWeight: 600, color: scriptCopied === script.id ? B.teal : B.purple, borderRadius: 6, border: `1px solid ${scriptCopied === script.id ? B.teal : B.purple}`, cursor: "pointer", backgroundColor: scriptCopied === script.id ? "rgba(31,109,122,0.06)" : "rgba(75,63,174,0.04)", transition: "all 150ms ease" }}>
                      {scriptCopied === script.id ? "Copied" : "Copy to clipboard"}
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
          <div style={{ flex: 1, ...cardStyle }}>
            <Overline>WHEN TO REASSESS</Overline>
            <div style={{ ...T.cardHeading, color: B.navy, marginBottom: 2 }}>{reassessDate}</div>
            <div style={{ ...T.cardHeading, color: B.purple, marginBottom: 6 }}>{reassessDaysLeft} days from now</div>
            <p style={{ ...T.meta, color: B.muted, margin: 0, lineHeight: 1.5 }}>Retake after real structural improvement is active, not after a short-term earnings spike.</p>
          </div>
          <div style={{ flex: 1, ...cardStyle }}>
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
            {downloading ? "Generating…" : "Download Report"}
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
            <p style={{ fontSize: 13, color: "#DC2626", margin: 0 }}>Download failed: {downloadError}. Try refreshing the page.</p>
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
              <span style={{ fontSize: 13, color: B.muted }}>Email delivery unavailable — download your report above</span>
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
