"use client";

import { useEffect, useState, useRef, Component, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoImg from "../../../../public/runpayway-logo.png";
import { useAssessmentServer } from "@/lib/monitoring";

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
const R = {
  pagePad: 48,
  headerMb: 24,
  sectionGap: 28,
  labelMb: 12,
  paraMb: 16,
  itemGap: 14,
  dividerMy: 24,
  footerMt: 24,
};

const T = {
  score: { fontSize: 80, fontWeight: 600, lineHeight: 1 },
  pageTitle: { fontSize: 26, fontWeight: 600, lineHeight: 1.25, color: "#0E1A2B" },
  classification: { fontSize: 17, fontWeight: 500, lineHeight: 1.3 },
  overline: { fontSize: 10.5, fontWeight: 600, lineHeight: 1.3, letterSpacing: "0.12em", textTransform: "uppercase" as const },
  sectionLabel: { fontSize: 13, fontWeight: 600, lineHeight: 1.4 },
  cardHeading: { fontSize: 14, fontWeight: 600, lineHeight: 1.4 },
  body: { fontSize: 12.5, fontWeight: 400, lineHeight: 1.65 },
  small: { fontSize: 11.5, fontWeight: 400, lineHeight: 1.55 },
  meta: { fontSize: 10.5, fontWeight: 400, lineHeight: 1.5 },
  micro: { fontSize: 10, fontWeight: 500, lineHeight: 1.3 },
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
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: R.headerMb, paddingBottom: 14, borderBottom: "1px solid rgba(14,26,43,0.08)" }}>
      <Image src={logoImg} alt="RunPayway" width={120} height={14} style={{ height: "auto" }} />
      <div style={{ textAlign: "right" }}>
        <div style={{ ...T.meta, color: B.taupe }}>Income Stability Score™</div>
        <div style={{ ...T.meta, color: B.taupe }}>Model RP-2.0</div>
      </div>
    </div>
  );
}

function Overline({ children }: { children: React.ReactNode }) {
  return <div style={{ ...T.overline, color: B.teal, marginBottom: R.labelMb }}>{children}</div>;
}

function SectionDivider() {
  return <div style={{ height: 1, backgroundColor: "rgba(14,26,43,0.08)", marginTop: R.dividerMy, marginBottom: R.dividerMy }} />;
}

function PageFooter({ section, page }: { section: string; page: number }) {
  return (
    <div className="report-page-footer" style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid rgba(14,26,43,0.08)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ ...T.meta, color: B.taupe }}>{section} · Page {page}</span>
        <span style={{ ...T.meta, color: B.taupe }}>Model RP-2.0 · runpayway.com/methodology</span>
      </div>
    </div>
  );
}

function MetricCard({ label, value, explanation }: { label: string; value: React.ReactNode; explanation: string; accent?: string }) {
  return (
    <div style={{ flex: 1, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "20px 22px" }}>
      <div style={{ ...T.overline, color: B.teal, marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 600, color: B.navy, marginBottom: 10, lineHeight: 1.3 }}>{value}</div>
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
    <div style={{ backgroundColor: B.sand, borderTop: `1px solid ${B.stone}`, borderBottom: `1px solid ${B.stone}`, padding: "14px 18px", marginTop: 12, marginBottom: 12 }}>
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
function QRCodeImage({ recordId, authCode }: { recordId: string; authCode?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = authCode
      ? `https://peoplestar.com/RunPayway/verify?id=${recordId}&auth=${authCode}`
      : `https://peoplestar.com/RunPayway/verify?id=${recordId}`;
    import("qrcode").then((QRCode) => {
      QRCode.toCanvas(canvas, url, {
        width: 72,
        margin: 0,
        color: { dark: "#0E1A2B", light: "#FFFFFF" },
      });
    }).catch(() => {});
  }, [recordId, authCode]);

  return <canvas ref={canvasRef} width={72} height={72} style={{ width: 72, height: 72, borderRadius: 4 }} />;
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

  const pages = document.querySelectorAll(".report-page");
  if (!pages.length) return;

  const pdf = new jsPDF({ orientation: "portrait", unit: "in", format: "letter" });
  pdf.setProperties({
    title: `Income Stability Assessment — ${record.assessment_title || "Report"}`,
    author: "RunPayway",
    subject: "Income Stability Score Report",
    keywords: "income stability, assessment, RunPayway, income analysis",
    creator: `RunPayway Model ${record.model_version || "RP-1.0"}`,
  });

  const { captureW, scale: S, pageW: PW, pageH: PH, margin: M, footer: FT, contentW: CW, canvasW, pxPerInch, sliceH } = PDF;

  let pdfPageCount = 0;

  for (let i = 0; i < pages.length; i++) {
    const el = pages[i] as HTMLElement;

    const saved = {
      width: el.style.width,
      maxWidth: el.style.maxWidth,
      border: el.style.border,
      borderRadius: el.style.borderRadius,
      boxSizing: el.style.boxSizing,
      overflow: el.style.overflow,
    };
    el.style.width = `${captureW}px`;
    el.style.maxWidth = `${captureW}px`;
    el.style.boxSizing = "border-box";
    el.style.border = "none";
    el.style.borderRadius = "0";
    el.style.overflow = "visible";

    const htmlFooter = el.querySelector(".report-page-footer") as HTMLElement | null;
    if (htmlFooter) htmlFooter.style.display = "none";

    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    const canvas = await html2canvas(el, {
      scale: S,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: captureW,
      height: el.scrollHeight,
      windowWidth: captureW,
    });

    Object.assign(el.style, saved);
    if (htmlFooter) htmlFooter.style.display = "";

    const totalCanvasH = canvas.height;
    let currentY = 0;

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
  const monitoringTracked = useRef(false);
  const emailSent = useRef(false);
  const scoreAnimated = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = sessionStorage.getItem("rp_record");
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

  // ── Tier-aware copy ──
  const copy = {
    // Page 1
    p1_headline: tier === "limited"
      ? `${name} scored ${score} out of 100. That means the income is active, but not yet strongly protected. If work slows down or a major income source changes, stability could drop quickly.`
      : tier === "developing"
        ? `${name} scored ${score} out of 100. That means the income is active, but not yet strongly protected. If work slows down or a major income source changes, stability could drop quickly.`
        : tier === "established"
          ? `${name} scored ${score} out of 100. The income structure has real stability. The main opportunity now is to lock in more income ahead of time and reduce how much depends on any single source.`
          : `${name} scored ${score} out of 100. The income structure is strong and durable, with good forward visibility and healthy diversification across sources.`,

    // Page 2
    p2_intro: `This page shows the main reasons behind the score. The question is not whether income exists today. The question is whether the structure can hold up when something changes.`,

    // Page 3
    p3_intro: tier === "limited"
      ? `This page shows where ${name} is most vulnerable. It does not predict the future — it shows what would weaken first if something changes.`
      : `This page shows where ${name} is most vulnerable. It does not predict the future — it shows what would weaken first if something changes.`,

    // Page 4
    p4_intro: tier === "limited"
      ? `The fastest way to raise this score is not to work more. It is to strengthen how the income is set up: more income secured ahead, less dependence on one source, and more income that continues without daily effort.`
      : `The fastest way to raise this score is not to work more. It is to change how ${name} is set up — more income lined up ahead, less dependence on one source, and more income that keeps going without daily effort.`,

    // Page 5
    p5_heading: "Main takeaway",
    p5_body: tier === "limited"
      ? "The first need is not more output. It is a stronger structure. Income is being generated, but the setup needs more income secured ahead, less source dependence, and more continuity without daily effort."
      : `${name} does not need to earn more first. The income is there, but the setup needs to change — more income lined up ahead, less reliance on one source, and more income that continues on its own.`,
    p5_reassess: "Retake after real structural improvement is active, not after a short-term earnings spike.",
  };

  // ── V2 engine data ──
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

  // ── Outcome layer (industry-specific data) ──
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
  const pageTitles = ["Your Score", "Why This Score", "What Could Go Wrong", "How to Improve", "What to Do Next"];
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, maxWidth: PDF.captureW, margin: "0 auto", padding: "0 0 40px" }}>

      {/* ---- PAGE 1 — Where do I stand? ---- */}
      <ReportPage record={record}>
        <ReportHeader />
        <Overline>YOUR INCOME STABILITY REPORT</Overline>
        <h1 style={{ ...T.pageTitle, marginBottom: 28 }}>Your Score</h1>

        <div style={{ marginBottom: 24 }}>
          <div style={{ ...T.score, color: B.navy }}>{animatedScore}</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: bandColor }} />
            <div style={{ ...T.classification, color: bandColor }}>{record.stability_band}</div>
          </div>
          {record.peer_stability_percentile_label && (
            <div style={{ ...T.small, color: B.muted, marginTop: 6 }}>
              {record.peer_stability_percentile_label} percentile among {(record.industry_sector || "").replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())} professionals
            </div>
          )}
        </div>

        {/* Classification Scale */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...T.overline, color: B.taupe, marginBottom: 10 }}>WHERE YOU LAND</div>
          <div style={{ display: "flex", gap: 2, height: 8, marginBottom: 10 }}>
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

        <p style={{ ...T.body, color: B.muted, marginBottom: 20, maxWidth: 540 }}>
          {copy.p1_headline}
        </p>

        {/* Single most important insight — one line the customer remembers */}
        <div style={{ backgroundColor: B.white, border: `1px solid ${B.stone}`, borderLeft: `3px solid ${B.purple}`, borderRadius: 4, padding: "16px 20px", marginBottom: 20 }}>
          <p style={{ ...T.body, color: B.navy, margin: 0, fontWeight: 500, lineHeight: 1.6 }}>
            {v2Constraints
              ? `The main thing holding ${name} back right now: ${constraintLabel[v2Constraints.root_constraint] ?? "not enough recurring or committed income"}.`
              : `The main thing holding ${name} back right now: not enough recurring or committed income.`}
            {v2Sensitivity?.tests?.[0]?.lift ? ` Fixing this could raise the score by about ${v2Sensitivity.tests[0].lift} points.` : ""}
          </p>
        </div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 20 }}>
          <MetricCard label="INCOME THAT WOULD CONTINUE IF YOU STOPPED WORKING TODAY" value={`${record.income_continuity_pct}%`} explanation={`Only a small portion of ${name} would likely keep coming in if active work stopped today.`} />
          <MetricCard label="BIGGEST SOURCE STRESS TEST" value={<>{record.final_score} <span style={{ color: B.taupe, fontWeight: 400 }}>→</span> {Math.max(0, record.risk_scenario_score)}</>} explanation="If the largest income source disappeared, the score would likely fall to this level. That means too much still depends on one source." />
          <MetricCard label="MAIN REASON THE SCORE IS HELD BACK" value={v2Constraints ? (constraintLabel[v2Constraints.root_constraint] ?? "Not enough recurring income") : "Not enough recurring income"} explanation="Too much of the income still depends on work that must keep being produced." />
          <MetricCard label="OVERALL DURABILITY" value={tier === "high" ? "Strong" : tier === "established" ? "Moderate" : "Needs strengthening"} explanation="The structure has some support, but not enough protection yet against disruption." />
        </div>


        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, paddingTop: 16, borderTop: "1px solid rgba(14,26,43,0.08)" }}>
          {[["Assessment Title", name], ["Industry", (record.industry_sector || "").replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())], ["Date Issued", issuedDate], ["Record ID", record.record_id.slice(0, 8)]].map(([l, v]) => (
            <div key={l}>
              <div style={{ ...T.meta, color: B.taupe }}>{l}</div>
              <div style={{ ...T.small, fontWeight: 500, color: B.navy }}>{v}</div>
            </div>
          ))}
        </div>

        <p style={{ ...T.meta, color: B.taupe, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
          The Income Stability Score is a present-state income stability assessment based on information provided by the user. It does not provide financial advice and does not predict future financial outcomes.
        </p>

        <PageFooter section="Your Score" page={1} />
      </ReportPage>


      {/* ---- PAGE 2 — Why did I get this score? ---- */}
      <ReportPage record={record}>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 12 }}>Why You Got This Score</h1>
        <p style={{ ...T.body, color: B.muted, marginBottom: 24, maxWidth: 540 }}>
          This page shows why {name} received this score. It looks at five parts of the income structure and how well they hold up if something changes.
        </p>

        <div style={{ display: "flex", gap: 20 }}>
          {/* Left: 5 driver bars */}
          <div style={{ flex: 2 }}>
            <Overline>WHAT IS DRIVING YOUR SCORE</Overline>
            <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 24 }}>
              {[
                { label: "How Long Income Would Continue", level: indicatorLevel(record.income_persistence_label, false), pct: record.persistent_income_level + record.semi_persistent_income_level, desc: "Right now, income would not continue for very long if work stopped." },
                { label: "Income Already Secured Ahead of Time", level: indicatorLevel(record.forward_revenue_visibility_label, false), pct: Math.min(record.forward_revenue_visibility_label === "High" || record.forward_revenue_visibility_label === "Very High" ? 70 : record.forward_revenue_visibility_label === "Moderate" ? 45 : 18, 100), desc: "Some income is already lined up before the next month begins, but not enough yet." },
                { label: "Number of Meaningful Income Sources", level: indicatorLevel(record.income_source_diversity_label, false), pct: record.income_source_diversity_label === "High" || record.income_source_diversity_label === "Very High" ? 65 : record.income_source_diversity_label === "Moderate" ? 50 : 25, desc: "There is more than one income source, but the structure still relies too much on a limited number of them." },
                { label: "How Much Income Depends on Daily Work", level: indicatorLevel(record.active_labor_dependence_label, true), pct: record.active_income_level, desc: "A large share of the income still depends on work that must keep being done directly." },
                { label: "How Much Depends on One Main Source", level: indicatorLevel(record.exposure_concentration_label, true), pct: record.exposure_concentration_label === "High" || record.exposure_concentration_label === "Very High" ? 82 : record.exposure_concentration_label === "Moderate" ? 50 : 25, desc: "The structure is still too vulnerable to a problem with the single largest source." },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <span style={{ ...T.sectionLabel, color: B.navy }}>{s.label}</span>
                    <span style={{ ...T.small, fontWeight: 600, color: s.level.color }}>{s.level.display}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, backgroundColor: B.stone, marginBottom: 4 }}>
                    <div style={{ height: "100%", borderRadius: 3, width: `${s.pct}%`, backgroundColor: B.navy }} />
                  </div>
                  <div style={{ ...T.small, color: B.muted, marginTop: 2 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Constraint hierarchy */}
          <div style={{ flex: 1, backgroundColor: B.bone, border: `1px solid ${B.stone}`, borderRadius: 2, padding: "20px 22px" }}>
            <Overline>WHAT IS HOLDING YOUR SCORE BACK</Overline>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {v2Constraints ? [
                { tag: "MAIN ISSUE", key: v2Constraints.root_constraint },
                { tag: "SECOND ISSUE", key: v2Constraints.primary_constraint },
                { tag: "ALSO AFFECTING", key: v2Constraints.secondary_constraint },
              ].filter((c, i, arr) => arr.findIndex(x => x.key === c.key) === i).map((c) => (
                <div key={c.key} style={{ borderBottom: `1px solid ${B.stone}`, paddingBottom: 6 }}>
                  <div style={{ ...T.micro, color: B.purple }}>{c.tag}</div>
                  <div style={{ ...T.small, color: B.navy, fontWeight: 500, marginTop: 1 }}>{constraintLabel[c.key] ?? c.key}</div>
                  <div style={{ ...T.meta, color: B.muted, marginTop: 1 }}>{olExplanations?.[c.key.replace("weak_forward_visibility", "low_forward_secured").replace("high_concentration", "high_concentration").replace("high_labor_dependence", "high_labor_dependence")] ?? ""}</div>
                </div>
              )) : [
                { code: "MAIN ISSUE", title: "Low Forward-Secured Income", text: olExplanations?.low_forward_secured || "Not enough future income is already lined up before the month begins." },
                { code: "SECOND ISSUE", title: "High Source Dependence", text: olExplanations?.high_concentration || "The structure depends too much on the largest income source." },
                { code: "ALSO AFFECTING", title: "Short Continuity Window", text: olExplanations?.short_continuity || "Income does not continue long enough without active work." },
              ].map((rc) => (
                <div key={rc.code} style={{ borderBottom: `1px solid ${B.stone}`, paddingBottom: 6 }}>
                  <div style={{ ...T.micro, color: B.purple }}>{rc.code}</div>
                  <div style={{ ...T.small, color: B.navy, fontWeight: 500, marginTop: 1 }}>{rc.title}</div>
                  <div style={{ ...T.meta, color: B.muted, marginTop: 1 }}>{rc.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fastest ways to raise your score */}
        {v2Sensitivity && v2Sensitivity.tests.length > 0 && (
          <div style={{ marginTop: 24, marginBottom: 20 }}>
            <Overline>FASTEST WAYS TO RAISE YOUR SCORE</Overline>
            <p style={{ ...T.body, color: B.muted, marginBottom: 16, maxWidth: 520 }}>
              These changes would likely help {name} the most, ranked from strongest impact to lowest.
            </p>
            {v2Sensitivity.tests.slice(0, 4).map((t, i) => (
              <div key={t.factor} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", marginBottom: 8, backgroundColor: i === 0 ? "rgba(15,118,110,0.04)" : "transparent", borderRadius: 6, border: i === 0 ? "1px solid rgba(15,118,110,0.12)" : "1px solid transparent" }}>
                <span style={{ fontSize: 18, fontWeight: 600, color: i === 0 ? B.teal : B.taupe, minWidth: 24 }}>{i + 1}</span>
                <span style={{ ...T.body, color: B.navy, flex: 1 }}>{t.delta_description}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: t.lift > 0 ? B.teal : B.muted }}>+{t.lift}</span>
                <span style={{ ...T.small, color: B.muted }}>points</span>
              </div>
            ))}
          </div>
        )}

        {/* Interaction effects — single line if present */}
        {v2Interactions && v2Interactions.effects.length > 0 && v2Interactions.net_adjustment !== 0 && (
          <p style={{ ...T.small, color: B.muted, marginBottom: 16, fontStyle: "italic" }}>
            Score adjusted by <span style={{ fontWeight: 600, color: v2Interactions.net_adjustment > 0 ? B.teal : B.bandLimited }}>{v2Interactions.net_adjustment > 0 ? "+" : ""}{v2Interactions.net_adjustment} points</span> due to structural interactions.
          </p>
        )}

        <PageFooter section="Why This Score" page={2} />
      </ReportPage>


      {/* ---- PAGE 3 — Where is the structure exposed? ---- */}
      <ReportPage record={record}>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 12 }}>Your Biggest Risks</h1>
        <p style={{ ...T.body, color: B.muted, marginBottom: 24, maxWidth: 540 }}>
          This page shows what could hurt {name} the most if the income structure were tested.
        </p>

        {/* Two large cards: Stress Test + Continuity */}
        <div style={{ display: "flex", gap: 20, marginBottom: 28 }}>
          <div style={{ flex: 3, backgroundColor: B.white, border: `1px solid ${B.stone}`, borderRadius: 2, padding: "20px 24px" }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 8 }}>LARGEST SOURCE STRESS TEST</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 600, color: B.navy }}>{record.final_score}</span>
              <span style={{ fontSize: 16, color: B.taupe }}>→</span>
              <span style={{ fontSize: 28, fontWeight: 600, color: B.bandLimited }}>{Math.max(0, record.risk_scenario_score)}</span>
            </div>
            <p style={{ ...T.small, color: B.muted, margin: 0 }}>
              If the largest income source disappeared tomorrow, the score would likely fall to {Math.max(0, record.risk_scenario_score)}. This shows that the structure still depends too heavily on that one source.
            </p>
          </div>
          <div style={{ flex: 2, backgroundColor: B.white, border: `1px solid ${B.stone}`, borderRadius: 2, padding: "20px 24px" }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 8 }}>CONTINUITY WINDOW</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: B.navy, marginBottom: 4 }}>
              Estimated: {continuityDisplay}
            </div>
            <p style={{ ...T.small, color: B.muted, margin: 0 }}>
              Based on the current structure, income would likely continue for about {continuityDisplay} if active work stopped. Longer is better.
            </p>
          </div>
        </div>

        {/* Structural stress scenarios — top 3, compact list */}
        {v2Scenarios && v2Scenarios.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <Overline>WHAT COULD HURT YOUR SCORE MOST</Overline>
            {[...v2Scenarios].sort((a, b) => b.score_drop - a.score_drop).slice(0, 3).map((s) => (
              <div key={s.scenario_id} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "10px 0", borderBottom: `1px solid ${B.stone}` }}>
                <div style={{ ...T.micro, color: s.band_shift ? B.bandLimited : s.score_drop > 10 ? B.bandDeveloping : B.muted, minWidth: 70, paddingTop: 1 }}>{s.band_shift ? "SEVERE" : s.score_drop > 10 ? "HIGH" : "MEDIUM"}</div>
                <div style={{ flex: 1 }}>
                  <span style={{ ...T.small, color: B.navy, fontWeight: 600 }}>{s.label}</span>
                  <span style={{ ...T.meta, color: B.muted, marginLeft: 8 }}>{s.description}</span>
                </div>
                <div style={{ ...T.micro, color: B.navy, flexShrink: 0 }}>
                  {s.original_score} → {s.scenario_score} <span style={{ color: B.bandLimited }}>(-{s.score_drop})</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Industry scenarios — top 2, compact list */}
        {olScenarios && olScenarios.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 10 }}>
              INDUSTRY SCENARIOS{olIndustryLabel ? ` · ${olIndustryLabel.toUpperCase()}` : ""}
            </div>
            {olScenarios.slice(0, 2).map((s) => (
              <div key={s.scenario_id} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "10px 0", borderBottom: `1px solid ${B.stone}` }}>
                <div style={{ ...T.micro, color: s.severity === "critical" ? B.bandLimited : s.severity === "high" ? B.bandDeveloping : B.muted, minWidth: 60, paddingTop: 1 }}>{s.severity.toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <span style={{ ...T.small, color: B.navy, fontWeight: 600 }}>{s.label}</span>
                  <span style={{ ...T.meta, color: B.muted, marginLeft: 8 }}>{s.description}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Income Structure Mix */}
        <Overline>HOW THE INCOME IS CURRENTLY BUILT</Overline>
        <div style={{ display: "flex", gap: 2, height: 10, marginBottom: 12, marginTop: 6 }}>
          <div style={{ width: `${record.active_income_level}%`, backgroundColor: B.navy, borderRadius: 1 }} />
          <div style={{ width: `${record.semi_persistent_income_level}%`, backgroundColor: B.taupe, borderRadius: 1 }} />
          <div style={{ width: `${record.persistent_income_level}%`, backgroundColor: B.teal, borderRadius: 1 }} />
        </div>
        <div style={{ display: "flex", gap: 24, marginBottom: 20 }}>
          {[
            { label: "Earned by working", pct: record.active_income_level, color: B.ink },
            { label: "Comes back regularly", pct: record.semi_persistent_income_level, color: B.taupe },
            { label: "Continues on its own", pct: record.persistent_income_level, color: B.teal },
          ].map((seg) => (
            <div key={seg.label} style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 1, backgroundColor: seg.color }} />
                <span style={{ ...T.small, fontWeight: 500, color: B.navy }}>{seg.label} — {seg.pct}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Peer band distribution */}
        {v2Benchmarks && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 8 }}>WHERE YOUR PEERS LAND</div>
            <div style={{ display: "flex", gap: 2, height: 8, marginBottom: 8 }}>
              {[
                { pct: v2Benchmarks.peer_band_distribution.limited, color: B.bandLimited, t: "limited" },
                { pct: v2Benchmarks.peer_band_distribution.developing, color: B.bandDeveloping, t: "developing" },
                { pct: v2Benchmarks.peer_band_distribution.established, color: B.bandEstablished, t: "established" },
                { pct: v2Benchmarks.peer_band_distribution.high, color: B.bandHigh, t: "high" },
              ].map((seg, i) => (
                <div key={i} style={{ width: `${seg.pct}%`, backgroundColor: seg.color, borderRadius: i === 0 ? "3px 0 0 3px" : i === 3 ? "0 3px 3px 0" : 0, opacity: tier === seg.t ? 1 : 0.3 }} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
              {[
                { pct: v2Benchmarks.peer_band_distribution.limited, label: "Limited", color: B.bandLimited },
                { pct: v2Benchmarks.peer_band_distribution.developing, label: "Developing", color: B.bandDeveloping },
                { pct: v2Benchmarks.peer_band_distribution.established, label: "Established", color: B.bandEstablished },
                { pct: v2Benchmarks.peer_band_distribution.high, label: "High", color: B.bandHigh },
              ].map((seg) => (
                <div key={seg.label} style={{ flex: 1, ...T.meta, color: B.muted }}><span style={{ color: seg.color, fontWeight: 600 }}>{seg.pct}%</span> {seg.label}</div>
              ))}
            </div>

            {/* Outlier dimensions — top 3 */}
            {v2Benchmarks.outlier_dimensions.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                {v2Benchmarks.outlier_dimensions.slice(0, 3).map((d) => (
                  <div key={d.factor} style={{ ...T.meta, color: B.ink, display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span>{d.factor}</span>
                    <span style={{ fontWeight: 600, color: d.direction === "above" ? B.teal : B.bandLimited }}>
                      {d.magnitude === "significant" ? "▲▲" : "▲"} {d.direction} peers
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}


        <PageFooter section="What Could Go Wrong" page={3} />
      </ReportPage>


      {/* ---- PAGE 4 — What would improve it? ---- */}
      <ReportPage record={record}>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 12 }}>How to Raise Your Score</h1>
        <p style={{ ...T.body, color: B.muted, marginBottom: 24, maxWidth: 540 }}>
          The fastest way to raise this score is not just to work more. It is to improve how {name} is set up — with more income secured ahead of time, less dependence on one source, and more income that continues without daily effort.
        </p>

        {/* Current Band / Next Target Band — compact side by side */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, backgroundColor: B.white, border: `1px solid ${B.stone}`, borderLeft: `3px solid ${bandColor}`, borderRadius: 2, padding: "16px 20px" }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>CURRENT BAND</div>
            <div style={{ ...T.cardHeading, color: bandColor }}>{record.stability_band} | {record.final_score}</div>
            <p style={{ ...T.meta, color: B.muted, margin: "6px 0 0" }}>{tier === "limited" || tier === "developing" ? "The income works now, but it is not yet strong enough to absorb disruption well." : "Stable, with room to strengthen further."}</p>
          </div>
          <div style={{ flex: 1, backgroundColor: B.white, border: `1px solid ${B.stone}`, borderLeft: `3px solid ${tier === "high" ? B.bandHigh : tier === "established" ? B.bandHigh : tier === "developing" ? B.bandEstablished : B.bandDeveloping}`, borderRadius: 2, padding: "16px 20px" }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>NEXT TARGET BAND</div>
            <div style={{ ...T.cardHeading, color: B.navy }}>{record.final_score < 30 ? "Developing Stability | 30+" : record.final_score < 50 ? "Established Stability | 50+" : record.final_score < 75 ? "High Stability | 75+" : "Maintain Current"}</div>
            <p style={{ ...T.meta, color: B.muted, margin: "6px 0 0" }}>{record.final_score < 75 ? "This next level means better protection, better visibility ahead, and less vulnerability to sudden change." : "Maintain and protect this position."}</p>
          </div>
        </div>

        {/* Top 3 projected improvements — compact */}
        {v2Lift && v2Lift.lift_scenarios.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 12 }}>IF YOU MADE THESE CHANGES</div>
            {v2Lift.lift_scenarios.filter(s => s.lift > 0).sort((a, b) => b.lift - a.lift).slice(0, 3).map((s, i) => (
              <div key={s.scenario_id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: `1px solid ${B.stone}` }}>
                <span style={{ ...T.micro, color: B.purple, minWidth: 18 }}>{i + 1}.</span>
                <span style={{ ...T.small, color: B.navy, fontWeight: 600, flex: 1 }}>{s.label}</span>
                <span style={{ ...T.small, color: B.navy }}>
                  {s.original_score} → <span style={{ color: B.teal, fontWeight: 600 }}>{s.projected_score}</span>
                  <span style={{ color: B.teal, marginLeft: 4 }}>+{s.lift}</span>
                </span>
                {s.band_shift && <span style={{ ...T.meta, color: B.teal, fontWeight: 500 }}>→ {s.projected_band}</span>}
              </div>
            ))}
            {/* Combined improvement line */}
            {v2Lift.combined_top_two && v2Lift.combined_top_two.lift > 0 && (
              <div style={{ ...T.small, color: B.muted, marginTop: 10, fontStyle: "italic" }}>
                Combined: score would reach <span style={{ fontWeight: 600, color: B.teal }}>{v2Lift.combined_top_two.projected_score}</span> (+{v2Lift.combined_top_two.lift} points){v2Lift.combined_top_two.band_shift && <span style={{ color: B.teal }}> — reaches {v2Lift.combined_top_two.projected_band}</span>}
              </div>
            )}
          </div>
        )}

        {/* 4 priority actions — compact list */}
        {olActions && olActions.length > 0 && (
          <div style={{ ...T.meta, color: B.teal, fontWeight: 500, marginBottom: 8 }}>
            Tailored for {olIndustryLabel ? `${olIndustryLabel} · ` : ""}{olFamilyLabel ?? "your income model"}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {(olActions && olActions.length > 0
            ? olActions.slice(0, 4).map((a, i) => ({
                rank: `Priority ${i + 1}`,
                title: a.label,
                copy: a.description,
                why: a.why_now,
              }))
            : [
                { rank: "Priority 1", title: "Increase Income Secured Ahead", copy: "Create more income that is already committed before the month begins. Examples include retainers, multi-month agreements, advance bookings, pre-sold packages, or recurring contracts.", why: "" },
                { rank: "Priority 2", title: "Reduce Dependence on the Largest Source", copy: "Reduce how much the structure depends on the largest source by strengthening one or more dependable secondary sources.", why: "" },
                { rank: "Priority 3", title: "Convert One-Time Work into Ongoing Revenue", copy: "Shift part of one-time work into income that repeats or renews where the business model allows.", why: "" },
                { rank: "Priority 4", title: "Extend How Long Income Continues", copy: "Build more income that can continue for a period of time even when daily work slows or stops.", why: "" },
              ]
          ).map((action) => (
            <div key={action.rank} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ ...T.micro, color: B.purple, minWidth: 60, paddingTop: 2 }}>{action.rank}</div>
              <div>
                <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 3 }}>{action.title}</div>
                <p style={{ ...T.small, color: B.muted, margin: 0 }}>{action.copy}</p>
                {action.why && <p style={{ ...T.meta, color: B.teal, margin: "4px 0 0", fontStyle: "italic" }}>{action.why}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* What NOT to do — compact dash list */}
        {((v2AvoidActions && v2AvoidActions.length > 0) || (olAvoid && olAvoid.length > 0)) && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>WHAT NOT TO DO</div>
            {(v2AvoidActions ?? []).map((a) => (
              <div key={a.action_id} style={{ ...T.meta, color: B.ink, display: "flex", gap: 6, marginBottom: 4 }}>
                <span style={{ color: B.taupe }}>—</span>
                <span><span style={{ fontWeight: 500 }}>{a.label}:</span> {a.reason}</span>
              </div>
            ))}
            {(olAvoid ?? []).map((text) => (
              <div key={text} style={{ ...T.meta, color: B.ink, display: "flex", gap: 6, marginBottom: 4 }}>
                <span style={{ color: B.taupe }}>—</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        )}


        <PageFooter section="How to Improve" page={4} />
      </ReportPage>


      {/* ---- PAGE 5 — What do I do next? ---- */}
      <ReportPage record={record}>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 16 }}>What to Do Next</h1>

        <p style={{ ...T.body, color: B.muted, marginBottom: 24, maxWidth: 540, lineHeight: 1.6 }}>
          {name} does not need to get bigger first. It needs to get stronger. The goal is to line up more income ahead of time, rely less on one source, and build more income that continues on its own.
        </p>

        {/* Two columns: 5 actions + 4 avoid — side by side */}
        <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 8 }}>What to do next</div>
            {[
              "Secure at least one multi-month or forward-committed revenue arrangement",
              "Reduce dependence on the single largest source",
              "Convert part of active-work income into repeatable income",
              "Build a longer period of income continuity before reassessment",
              "Reassess only after real structural change is in place",
            ].map((item, i) => (
              <div key={i} style={{ ...T.small, color: B.ink, display: "flex", gap: 8, marginBottom: 5 }}>
                <span style={{ color: B.purple, fontWeight: 600, flexShrink: 0 }}>{i + 1}.</span>{item}
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 8 }}>What not to prioritize yet</div>
            {[
              "Working more without improving the structure underneath it",
              "Short bursts of output that do not improve durability",
              "Temporary spikes that disappear when work stops",
              "Metrics that do not improve continuity or income secured ahead",
            ].map((item) => (
              <div key={item} style={{ ...T.small, color: B.muted, display: "flex", gap: 8, marginBottom: 5 }}>
                <span style={{ color: B.taupe }}>—</span>{item}
              </div>
            ))}
          </div>
        </div>

        {/* 90-Day Checklist */}
        <Overline>YOUR 90-DAY ACTION PLAN</Overline>
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 20 }}>
          {[
            "Create one offer, agreement, or revenue stream that secures income ahead for more than one month.",
            "Identify the largest source and reduce how much the structure depends on it.",
            "Add one recurring, retained, or repeatable income component.",
            "Improve visibility into next month's income before the month begins.",
            "Reassess only after the structural changes are active, not just planned.",
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: `1px solid ${B.stone}` }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", border: `1.5px solid ${B.stone}`, flexShrink: 0, marginTop: 2 }} />
              <span style={{ ...T.small, color: B.ink }}>{row}</span>
            </div>
          ))}
        </div>

        {/* Bottom cards: Reassessment + Verification */}
        <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
          <div style={{ flex: 1, backgroundColor: B.bone, border: `1px solid ${B.stone}`, borderRadius: 2, padding: "18px 20px" }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>WHEN TO REASSESS</div>
            <div style={{ ...T.cardHeading, color: B.navy, marginBottom: 2 }}>{reassessDate}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: B.purple, marginBottom: 6 }}>{reassessDaysLeft} days from now</div>
            <p style={{ ...T.meta, color: B.muted, margin: "0 0 8px", lineHeight: 1.5 }}>{copy.p5_reassess}</p>
          </div>
          <div style={{ flex: 1, backgroundColor: B.bone, border: `1px solid ${B.stone}`, borderRadius: 2, padding: "18px 20px" }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 4 }}>VERIFICATION</div>
            <div style={{ ...T.meta, color: B.ink, display: "flex", flexDirection: "column", gap: 2 }}>
              <div>Record ID: <span style={{ fontFamily: "monospace", fontSize: 9 }}>{record.record_id.slice(0, 8)}</span></div>
              <div>Registry Status: Private Record</div>
              <div>Model: {record.model_version || "RP-2.0"}</div>
              <div>Verification: peoplestar.com/RunPayway/verify</div>
            </div>
          </div>
        </div>

        {/* Benchmark context — only if data available */}
        {(v2Benchmarks || olBenchmark) && (
          <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
            <div style={{ flex: 1, backgroundColor: B.bone, border: `1px solid ${B.stone}`, borderRadius: 2, padding: "16px 18px" }}>
              <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>HOW YOU COMPARE</div>
              {v2Benchmarks && (
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <div style={{ ...T.small, color: B.ink }}>Peer average: <span style={{ fontWeight: 600 }}>{v2Benchmarks.cluster_average_score}</span></div>
                  <div style={{ ...T.small, color: B.ink }}>Top 20% threshold: <span style={{ fontWeight: 600 }}>{v2Benchmarks.top_20_threshold}</span></div>
                  <div style={{ ...T.small, color: B.ink }}>Your percentile: <span style={{ fontWeight: 600, color: B.purple }}>{record.peer_stability_percentile_label || `${v2Benchmarks.peer_percentile}th`}</span></div>
                </div>
              )}
              {olBenchmark && <p style={{ ...T.meta, color: B.muted, margin: "8px 0 0", fontStyle: "italic" }}>{olBenchmark.framing_text}</p>}
            </div>
            {olBenchmark && (olBenchmark.common_strengths?.length > 0 || olBenchmark.common_weaknesses?.length > 0) && (
              <div style={{ flex: 1, backgroundColor: B.bone, border: `1px solid ${B.stone}`, borderRadius: 2, padding: "16px 18px" }}>
                <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>TYPICAL PATTERNS IN YOUR PEER GROUP</div>
                {olBenchmark.common_strengths?.length > 0 && (
                  <>
                    <div style={{ ...T.meta, color: B.teal, fontWeight: 500, marginBottom: 2 }}>Common strengths:</div>
                    {olBenchmark.common_strengths.slice(0, 3).map((s) => (
                      <div key={s} style={{ ...T.meta, color: B.muted, marginBottom: 2 }}>— {s}</div>
                    ))}
                  </>
                )}
                {olBenchmark.common_weaknesses?.length > 0 && (
                  <>
                    <div style={{ ...T.meta, color: B.bandDeveloping, fontWeight: 500, marginTop: 6, marginBottom: 2 }}>Common gaps:</div>
                    {olBenchmark.common_weaknesses.slice(0, 3).map((w) => (
                      <div key={w} style={{ ...T.meta, color: B.muted, marginBottom: 2 }}>— {w}</div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <p style={{ ...T.meta, color: B.taupe, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
          The Income Stability Score is a present-state income stability assessment based on information provided by the user. It does not provide financial advice and does not predict future financial outcomes. This report reflects a present-state structural interpretation under the RunPayway framework.
        </p>

        <PageFooter section="What to Do Next" page={5} />
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

        {/* Share Result Card */}
        <div style={{ padding: "20px 24px", borderRadius: 12, border: `1px solid ${B.stone}`, backgroundColor: B.white }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, color: B.taupe, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 6 }}>INCOME STABILITY SCORE™</div>
              <div style={{ fontSize: 36, fontWeight: 600, color: B.navy, lineHeight: 1 }}>{record.final_score}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: bandColor }} />
                <span style={{ fontSize: 14, fontWeight: 500, color: bandColor }}>{record.stability_band}</span>
              </div>
              <div style={{ fontSize: 12, color: B.muted, marginTop: 8 }}>{name}</div>
              <div style={{ fontSize: 11, color: B.taupe, marginTop: 2 }}>Assessed {issuedDate} · Model RP-2.0</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <Image src={logoImg} alt="RunPayway" width={90} height={11} style={{ height: "auto", marginBottom: 8 }} />
              <div style={{ fontSize: 10, color: B.taupe }}>runpayway.com/verify</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button
              onClick={() => {
                const text = `${name} — Income Stability Score™: ${record.final_score} (${record.stability_band}). Assessed under Model RP-2.0. Verify at peoplestar.com/RunPayway/verify?id=${record.record_id}`;
                navigator.clipboard.writeText(text).then(() => {
                  setLinkCopied(true);
                  setTimeout(() => setLinkCopied(false), 3000);
                });
              }}
              style={{ padding: "8px 14px", fontSize: 12, fontWeight: 500, color: B.navy, borderRadius: 8, border: `1px solid ${B.stone}`, cursor: "pointer", backgroundColor: B.bone, transition: "all 150ms ease" }}
            >
              Copy Result Summary
            </button>
          </div>
        </div>

        {downloadError && (
          <div style={{ padding: "10px 16px", borderRadius: 10, backgroundColor: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.12)" }}>
            <p style={{ fontSize: 13, color: "#DC2626", margin: 0 }}>PDF download failed: {downloadError}. Try refreshing the page.</p>
          </div>
        )}

        {/* Share Report Summary */}
        <div style={{ padding: "8px 12px", borderRadius: 12, border: `1px solid ${B.stone}`, backgroundColor: B.bone }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: B.navy, marginBottom: 4 }}>Share Report Summary</div>
          <p style={{ fontSize: 12, color: B.muted, margin: "0 0 10px 0", lineHeight: 1.5 }}>
            Send the report summary and verification link to an advisor, planner, consultant, or reviewer.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="email"
              placeholder="Recipient's email address"
              value={advisorEmail}
              onChange={(e) => setAdvisorEmail(e.target.value)}
              style={{ flex: 1, padding: "8px 12px", fontSize: 13, borderRadius: 12, border: `1px solid ${B.stone}`, outline: "none", color: B.navy }}
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
                      modelVersion: record.model_version || "RP-1.0",
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
              style={{ padding: "10px 18px", fontSize: 13, fontWeight: 600, color: "#ffffff", borderRadius: 12, border: "none", cursor: advisorSent ? "default" : "pointer", backgroundColor: advisorSent ? B.purple : B.purple, opacity: advisorSending || (!advisorEmail.includes("@")) ? 0.6 : 1, transition: "all 180ms ease", whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(75,63,174,0.20)" }}>
              {advisorSent ? "Sent" : advisorSending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>

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
