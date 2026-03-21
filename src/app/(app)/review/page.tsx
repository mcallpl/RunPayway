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
  navy: "#0F172A",      // Slate 900 — cooler, more modern anchor
  ink: "#1E293B",       // Slate 800 — secondary text
  sand: "#F8FAFC",      // Slate 50 — clean cool background
  bone: "#F1F5F9",      // Slate 100 — card backgrounds
  white: "#FFFFFF",
  stone: "#E2E8F0",     // Slate 200 — borders
  taupe: "#94A3B8",     // Slate 400 — labels and metadata
  muted: "#64748B",     // Slate 500 — body text
  purple: "#4B3FAE",    // Brand accent — kept
  teal: "#0F766E",      // Teal 700 — positive/support signal
  // Band colors
  bandLimited: "#DC2626",    // Red 600
  bandDeveloping: "#D97706", // Amber 600
  bandEstablished: "#2563EB",// Blue 600
  bandHigh: "#16A34A",       // Green 600
};

// ============================================================
// SPACING + TYPOGRAPHY TOKENS
// ============================================================
const R = {
  pagePad: 44,
  headerMb: 16,
  sectionGap: 16,
  labelMb: 7,
  paraMb: 10,
  itemGap: 8,
  dividerMy: 16,
  footerMt: 16,
};

const T = {
  score: { fontSize: 90, fontWeight: 600, lineHeight: 1 },
  pageTitle: { fontSize: 27, fontWeight: 600, lineHeight: 1.2, color: "#0E1A2B" },
  classification: { fontSize: 19, fontWeight: 500, lineHeight: 1.3 },
  overline: { fontSize: 10.5, fontWeight: 500, lineHeight: 1.3, letterSpacing: "0.14em", textTransform: "uppercase" as const },
  sectionLabel: { fontSize: 12.5, fontWeight: 600, lineHeight: 1.3 },
  cardHeading: { fontSize: 14, fontWeight: 600, lineHeight: 1.3 },
  body: { fontSize: 11.5, fontWeight: 400, lineHeight: 1.52 },
  small: { fontSize: 10.5, fontWeight: 400, lineHeight: 1.45 },
  meta: { fontSize: 10, fontWeight: 400, lineHeight: 1.4 },
  micro: { fontSize: 9.5, fontWeight: 500, lineHeight: 1.3 },
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
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: R.headerMb, paddingBottom: 12, borderBottom: `1px solid ${B.stone}` }}>
      <Image src={logoImg} alt="RunPayway" width={120} height={14} style={{ height: "auto" }} />
      <div style={{ textAlign: "right" }}>
        <div style={{ ...T.meta, color: B.taupe }}>Income Stability Score™</div>
        <div style={{ ...T.meta, color: B.taupe }}>Model RP-2.0</div>
      </div>
    </div>
  );
}

function Overline({ children }: { children: React.ReactNode }) {
  return <div style={{ ...T.overline, color: B.taupe, marginBottom: R.labelMb }}>{children}</div>;
}

function SectionDivider() {
  return <div style={{ height: 1, backgroundColor: B.stone, marginTop: R.dividerMy, marginBottom: R.dividerMy }} />;
}

function PageFooter({ section, page }: { section: string; page: number }) {
  return (
    <div className="report-page-footer" style={{ marginTop: "auto", paddingTop: 10, borderTop: `1px solid ${B.stone}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ ...T.meta, color: B.taupe }}>{section} · Page {page}</span>
        <span style={{ ...T.meta, color: B.taupe }}>Model RP-2.0 · runpayway.com/methodology</span>
      </div>
    </div>
  );
}

function MetricCard({ label, value, explanation, accent }: { label: string; value: React.ReactNode; explanation: string; accent?: string }) {
  return (
    <div style={{ flex: 1, backgroundColor: B.bone, border: `1px solid ${B.stone}`, borderLeft: accent ? `3px solid ${accent}` : `1px solid ${B.stone}`, borderRadius: 2, padding: "16px 18px" }}>
      <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 600, color: B.navy, marginBottom: 6 }}>{value}</div>
      <div style={{ ...T.small, color: B.muted, lineHeight: 1.5 }}>{explanation}</div>
    </div>
  );
}

function DiagnosisBlock({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: B.white, border: `1px solid ${B.stone}`, borderTop: `2px solid ${B.purple}`, borderRadius: 2, padding: "16px 20px" }}>
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
      {/* Top accent bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #4B3FAE 0%, #1F6D7A 100%)" }} />
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
      ? `${name} is producing income, but the structure is still highly exposed.`
      : tier === "developing"
        ? `${name} is producing income, but the setup is not yet well protected.`
        : tier === "established"
          ? `${name} has a working income structure with meaningful stability.`
          : `${name} has a strong, durable income structure.`,
    p1_body: tier === "limited"
      ? `${name} scored ${score} out of 100. This is a low structural stability result. Too much income still depends on ongoing work, and not enough is already secured ahead. That leaves the structure easy to weaken if work slows or a key source changes.`
      : tier === "developing"
        ? `${name} scored ${score} out of 100. Too much income still depends on ongoing work, and not enough is already lined up ahead of time. That makes the structure easier to disrupt than it needs to be.`
        : tier === "established"
          ? `${name} scored ${score} out of 100. The income structure has meaningful stability, but there is still room to strengthen forward visibility and reduce concentration.`
          : `${name} scored ${score} out of 100. The income structure is durable, with strong forward visibility and low dependence on any single source.`,
    p1_simple: tier === "limited"
      ? `${name} can generate income, but the structure does not yet hold up well under disruption. If work slows or a key source weakens, stability may drop quickly.`
      : tier === "developing"
        ? `${name} is generating income, but if work slows or a key source weakens, there is not enough built-in protection to keep things stable.`
        : tier === "established"
          ? `${name} has real structural stability. The main opportunity is to extend forward visibility and reduce remaining concentration.`
          : `${name} has strong structural stability. The focus should be on maintaining and protecting this position.`,
    p1_bottom: tier === "limited"
      ? "Bottom line: The income is there, but the structure is still fragile."
      : tier === "developing"
        ? `Bottom line: ${name} works, but it is still too exposed.`
        : tier === "established"
          ? `Bottom line: ${name} is stable, with room to strengthen further.`
          : `Bottom line: ${name} is well protected and durable.`,

    // Page 2
    p2_intro: `This page shows the main reasons behind the score. The question is not whether income exists today. The question is whether the structure can hold up when something changes.`,
    p2_helping: tier === "limited"
      ? ["Income is not coming from only one channel", "Month-to-month income is not fully erratic", "A small amount of income persistence is already present", "The structure is weak, but not starting from zero"]
      : tier === "developing"
        ? ["Income exists across more than one stream", "Month-to-month consistency is not fully unstable", "Some income persistence is already present", "The structure is not starting from zero"]
        : ["Meaningful recurring or continuing income is present", "Source diversification provides some protection", "Forward visibility extends beyond the immediate term", "The structure has real resilience"],
    p2_bottom: tier === "limited"
      ? "Bottom line: The structure is being held back most by too little income secured ahead and too much dependence on ongoing work."
      : `Bottom line: ${name} does not have enough income lined up ahead, and too much depends on ongoing work.`,
    p2_diagnosis: tier === "limited"
      ? `The clearest next improvement would come from securing more income ahead. A 15-point increase in income secured ahead is projected to raise the score from ${score} to ${Math.min(100, score + 5)}.`
      : `The fastest improvement would come from securing more income ahead. An increase of 15 percentage points in income secured ahead is projected to raise the score from ${score} to ${Math.min(100, score + 5)}.`,

    // Page 3
    p3_intro: tier === "limited"
      ? `This page shows where ${name} is most vulnerable. It does not predict the future — it shows what would weaken first if something changes.`
      : `This page shows where ${name} is most vulnerable. It does not predict the future — it shows what would weaken first if something changes.`,
    p3_continuity_body: tier === "limited"
      ? "Based on the current structure, very little income appears likely to continue for long if active work stops."
      : "Based on the current structure, only a limited share of income appears likely to continue if active work stops.",
    p3_simple: tier === "limited"
      ? "If work slows or a major source weakens, this structure may lose stability quickly. A stronger setup would hold up longer and with less disruption."
      : `If work slows or a major source weakens, ${name} may lose income faster than it should. A stronger setup would hold up better.`,
    p3_bottom: tier === "limited"
      ? "Bottom line: This structure is still highly sensitive to disruption."
      : `Bottom line: ${name} is still too easy to disrupt.`,
    p3_cards: tier === "limited"
      ? [
          { title: "What weakens first", copy: `Not the current income — but the lack of income already secured ahead to carry the structure through disruption.` },
          { title: "The hidden risk", copy: "Income can be active and still be structurally weak. That is the current pattern here: income is being produced, but the setup does not absorb disruption well." },
          { title: "Where things stand", copy: "This profile can produce income, but stability drops quickly when work slows or a major source weakens." },
        ]
      : [
          { title: "What weakens first", copy: `Not the current income — but the lack of income already lined up to carry ${name} through a disruption.` },
          { title: "The hidden risk", copy: `${name} can earn well and still be fragile. Income is productive, but the setup does not yet absorb disruption well.` },
          { title: "Where things stand", copy: `${name} can produce income, but if work stops or a major source weakens, stability drops quickly.` },
        ],
    p3_risk: tier === "limited"
      ? "The key risk: The structure loses stability too quickly when something changes."
      : `${name} still loses strength too easily when something changes.`,

    // Page 4
    p4_intro: tier === "limited"
      ? `The fastest way to raise this score is not to work more. It is to strengthen how the income is set up: more income secured ahead, less dependence on one source, and more income that continues without daily effort.`
      : `The fastest way to raise this score is not to work more. It is to change how ${name} is set up — more income lined up ahead, less dependence on one source, and more income that keeps going without daily effort.`,
    p4_current_band: tier === "limited"
      ? "The structure is active, but it is still too weak to absorb disruption well."
      : "The structure works, but it is not yet strong enough to absorb disruption well.",
    p4_simple: tier === "limited"
      ? `This profile needs more income secured before the month starts, less dependence on the largest source, and more income that keeps going through a slowdown.`
      : `${name} needs more income lined up before the month starts, less dependence on the biggest source, and more income that keeps going even during a slowdown.`,
    p4_bottom: tier === "limited"
      ? "Bottom line: Secure more income ahead first. Then reduce source concentration."
      : `Bottom line: Secure more income ahead and reduce how much ${name} depends on one source.`,
    p4_fastest: tier === "limited"
      ? "Fastest improvement: Securing more income ahead is the clearest and fastest way to raise this score."
      : `Fastest improvement for ${name}: Lining up more income ahead of time is the single clearest way to raise this score.`,

    // Page 5
    p5_heading: "Main takeaway",
    p5_body: tier === "limited"
      ? "The first need is not more output. It is a stronger structure. Income is being generated, but the setup needs more income secured ahead, less source dependence, and more continuity without daily effort."
      : `${name} does not need to earn more first. The income is there, but the setup needs to change — more income lined up ahead, less reliance on one source, and more income that continues on its own.`,
    p5_simple: tier === "limited"
      ? "Working harder alone will not fix this. The goal is to build a structure that holds up better when work slows or something changes."
      : `Working harder will not fix this. The goal is to set up ${name} so income holds up better — even when work slows or something changes.`,
    p5_bottom: tier === "limited"
      ? "Bottom line: Strengthen the structure behind the income, not just the output."
      : `Bottom line: Strengthen the setup behind ${name}, not just the output.`,
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
          <div style={{ ...T.overline, color: B.taupe, marginBottom: 10 }}>INCOME STABILITY CLASSIFICATION SCALE</div>
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

        <p style={{ ...T.body, color: B.muted, marginBottom: 16, maxWidth: 540 }}>
          {copy.p1_headline}
        </p>

        {/* Single most important insight — one line the customer remembers */}
        <div style={{ backgroundColor: B.white, border: `1px solid ${B.stone}`, borderLeft: `3px solid ${B.purple}`, borderRadius: 2, padding: "12px 16px", marginBottom: 16 }}>
          <p style={{ ...T.small, color: B.navy, margin: 0, fontWeight: 500 }}>
            {v2Constraints
              ? `The biggest structural weak point is ${constraintLabel[v2Constraints.root_constraint] ?? "limited forward visibility"}.`
              : "The biggest structural weak point is too little income secured ahead."}
            {v2Sensitivity?.tests?.[0]?.lift ? ` Improving ${v2Sensitivity.tests[0].delta_description.toLowerCase()} could add ${v2Sensitivity.tests[0].lift} points.` : ""}
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          <MetricCard accent={B.teal} label="Income Continuity" value={`${record.income_continuity_pct}%`} explanation="Portion of income likely to continue if active work stopped today." />
          <MetricCard accent={B.bandLimited} label="Stress Test" value={<>{record.final_score} <span style={{ color: B.taupe, fontWeight: 400 }}>→</span> {Math.max(0, record.risk_scenario_score)}</>} explanation="If your largest source disappeared, your score would fall to this level." />
          <MetricCard accent={B.purple} label="Main Constraint" value={v2Constraints ? (constraintLabel[v2Constraints.root_constraint] ?? "Too Little Income Secured Ahead") : "Too Little Income Secured Ahead"} explanation="The single biggest factor holding the score back." />
          {v2Fragility && (
            <MetricCard accent={bandColor} label="How Resilient" value={fragilityClassLabel[v2Fragility.fragility_class] ?? v2Fragility.fragility_class} explanation={failureModeLabel[v2Fragility.primary_failure_mode] ?? "How well the structure absorbs disruption."} />
          )}
        </div>

        {/* Confidence + Durability + Sub-scores — compact metadata line */}
        <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
          {v2Confidence && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: confidenceColor[v2Confidence.confidence_level] ?? B.muted }} />
              <span style={{ ...T.small, color: B.muted }}>Confidence: <span style={{ fontWeight: 600, color: B.navy }}>{v2Confidence.confidence_level.charAt(0).toUpperCase() + v2Confidence.confidence_level.slice(1)}</span></span>
            </div>
          )}
          {v2Quality && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ ...T.small, color: B.muted }}>Durability: <span style={{ fontWeight: 600, color: B.navy }}>{v2Quality.durability_grade.charAt(0).toUpperCase() + v2Quality.durability_grade.slice(1).replace(/_/g, " ")}</span></span>
            </div>
          )}
          {v2Scores && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ ...T.small, color: B.muted }}>Structure: <span style={{ fontWeight: 500 }}>{v2Scores.structure_score}/60</span> · Stability: <span style={{ fontWeight: 500 }}>{v2Scores.stability_score}/40</span></span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          {[["Industry", record.industry_sector], ["Date Issued", issuedDate], ["Record ID", record.record_id.slice(0, 8)]].map(([l, v]) => (
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
        <h1 style={{ ...T.pageTitle, marginBottom: 8 }}>Why This Score</h1>
        <p style={{ ...T.body, color: B.muted, marginBottom: 20, maxWidth: 520 }}>
          {copy.p2_intro}
        </p>

        <div style={{ display: "flex", gap: 20 }}>
          {/* Left: 5 driver bars */}
          <div style={{ flex: 2 }}>
            <Overline>WHAT DRIVES YOUR SCORE</Overline>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
              {[
                { label: "Continuity", level: indicatorLevel(record.income_persistence_label, false), pct: record.persistent_income_level + record.semi_persistent_income_level, desc: "How long income can keep coming in if you stop working for a period of time." },
                { label: "Income Secured Ahead", level: indicatorLevel(record.forward_revenue_visibility_label, false), pct: Math.min(record.forward_revenue_visibility_label === "High" || record.forward_revenue_visibility_label === "Very High" ? 70 : record.forward_revenue_visibility_label === "Moderate" ? 45 : 18, 100), desc: "How much upcoming income is already committed before the next month begins." },
                { label: "Source Diversification", level: indicatorLevel(record.income_source_diversity_label, false), pct: record.income_source_diversity_label === "High" || record.income_source_diversity_label === "Very High" ? 65 : record.income_source_diversity_label === "Moderate" ? 50 : 25, desc: "How many meaningful income sources support the structure." },
                { label: "Dependence on Work", level: indicatorLevel(record.active_labor_dependence_label, true), pct: record.active_income_level, desc: "How much income still depends on you continuing to work directly." },
                { label: "Dependence on One Source", level: indicatorLevel(record.exposure_concentration_label, true), pct: record.exposure_concentration_label === "High" || record.exposure_concentration_label === "Very High" ? 82 : record.exposure_concentration_label === "Moderate" ? 50 : 25, desc: "How much damage would be done if your largest source disappeared." },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <span style={{ ...T.sectionLabel, color: B.navy }}>{s.label}</span>
                    <span style={{ ...T.small, fontWeight: 600, color: s.level.color }}>{s.level.display}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, backgroundColor: B.stone, marginBottom: 4 }}>
                    <div style={{ height: "100%", borderRadius: 3, width: `${s.pct}%`, backgroundColor: B.navy }} />
                  </div>
                  <div style={{ ...T.meta, color: B.muted }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Constraint hierarchy */}
          <div style={{ flex: 1, backgroundColor: B.bone, border: `1px solid ${B.stone}`, borderRadius: 2, padding: "20px 22px" }}>
            <Overline>CONSTRAINT HIERARCHY</Overline>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {v2Constraints ? [
                { tag: "PRIMARY", key: v2Constraints.root_constraint },
                { tag: "SECONDARY", key: v2Constraints.primary_constraint },
                { tag: "CONTRIBUTING", key: v2Constraints.secondary_constraint },
              ].filter((c, i, arr) => arr.findIndex(x => x.key === c.key) === i).map((c) => (
                <div key={c.key} style={{ borderBottom: `1px solid ${B.stone}`, paddingBottom: 6 }}>
                  <div style={{ ...T.micro, color: B.purple }}>{c.tag}</div>
                  <div style={{ ...T.small, color: B.navy, fontWeight: 500, marginTop: 1 }}>{constraintLabel[c.key] ?? c.key}</div>
                  <div style={{ ...T.meta, color: B.muted, marginTop: 1 }}>{olExplanations?.[c.key.replace("weak_forward_visibility", "low_forward_secured").replace("high_concentration", "high_concentration").replace("high_labor_dependence", "high_labor_dependence")] ?? ""}</div>
                </div>
              )) : [
                { code: "PRIMARY", title: "Low Forward-Secured Income", text: olExplanations?.low_forward_secured || "Not enough future income is already lined up before the month begins." },
                { code: "SECONDARY", title: "High Source Dependence", text: olExplanations?.high_concentration || "The structure depends too much on the largest income source." },
                { code: "CONTRIBUTING", title: "Short Continuity Window", text: olExplanations?.short_continuity || "Income does not continue long enough without active work." },
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

        {/* Sensitivity ranking */}
        {v2Sensitivity && v2Sensitivity.tests.length > 0 && (
          <div style={{ marginTop: 16, marginBottom: 16 }}>
            <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 10 }}>Which changes help most</div>
            {v2Sensitivity.tests.slice(0, 4).map((t, i) => (
              <div key={t.factor} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ ...T.micro, color: B.purple, minWidth: 18 }}>{i + 1}.</span>
                <span style={{ ...T.small, color: B.navy, flex: 1 }}>{t.delta_description}</span>
                <span style={{ ...T.small, fontWeight: 600, color: t.lift > 0 ? B.teal : B.muted }}>+{t.lift} pts</span>
                {t.factor === v2Sensitivity.highest_lift_factor && <span style={{ ...T.meta, color: B.teal, fontWeight: 600, border: `1px solid ${B.teal}`, borderRadius: 3, padding: "1px 6px", fontSize: 9 }}>BEST</span>}
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
        <h1 style={{ ...T.pageTitle, marginBottom: 8 }}>What Could Go Wrong</h1>
        <p style={{ ...T.body, color: B.muted, marginBottom: 20, maxWidth: 520 }}>
          {copy.p3_intro}
        </p>

        {/* Two large cards: Stress Test + Continuity */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 3, backgroundColor: B.white, border: `1px solid ${B.stone}`, borderRadius: 2, padding: "20px 24px" }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 8 }}>LARGEST SOURCE STRESS TEST</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 600, color: B.navy }}>{record.final_score}</span>
              <span style={{ fontSize: 16, color: B.taupe }}>→</span>
              <span style={{ fontSize: 28, fontWeight: 600, color: B.bandLimited }}>{Math.max(0, record.risk_scenario_score)}</span>
            </div>
            <p style={{ ...T.small, color: B.muted, margin: 0 }}>
              This is a stress test, not a prediction. It shows that the current structure would weaken meaningfully if the largest income source were lost.
            </p>
          </div>
          <div style={{ flex: 2, backgroundColor: B.white, border: `1px solid ${B.stone}`, borderRadius: 2, padding: "20px 24px" }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 8 }}>CONTINUITY WINDOW</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: B.navy, marginBottom: 4 }}>
              Estimated: {continuityDisplay}
            </div>
            <p style={{ ...T.small, color: B.muted, margin: 0 }}>
              {copy.p3_continuity_body}
            </p>
          </div>
        </div>

        {/* Structural stress scenarios — top 3, compact list */}
        {v2Scenarios && v2Scenarios.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 10 }}>STRUCTURAL STRESS SCENARIOS</div>
            {[...v2Scenarios].sort((a, b) => b.score_drop - a.score_drop).slice(0, 3).map((s) => (
              <div key={s.scenario_id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "8px 0", borderBottom: `1px solid ${B.stone}` }}>
                <div style={{ ...T.micro, color: s.band_shift ? B.bandLimited : s.score_drop > 10 ? B.bandDeveloping : B.muted, minWidth: 70, paddingTop: 1 }}>{s.band_shift ? "BAND DROP" : s.score_drop > 10 ? "SIGNIFICANT" : "MODERATE"}</div>
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
              <div key={s.scenario_id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "8px 0", borderBottom: `1px solid ${B.stone}` }}>
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
        <Overline>INCOME STRUCTURE MIX</Overline>
        <div style={{ display: "flex", gap: 2, height: 10, marginBottom: 12, marginTop: 6 }}>
          <div style={{ width: `${record.active_income_level}%`, backgroundColor: B.navy, borderRadius: 1 }} />
          <div style={{ width: `${record.semi_persistent_income_level}%`, backgroundColor: B.taupe, borderRadius: 1 }} />
          <div style={{ width: `${record.persistent_income_level}%`, backgroundColor: B.teal, borderRadius: 1 }} />
        </div>
        <div style={{ display: "flex", gap: 24, marginBottom: 20 }}>
          {[
            { label: "Active Income", pct: record.active_income_level, color: B.ink },
            { label: "Recurring Income", pct: record.semi_persistent_income_level, color: B.taupe },
            { label: "Built-In Income", pct: record.persistent_income_level, color: B.teal },
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

        <p style={{ ...T.body, color: B.muted, margin: "0 0 16px", fontWeight: 500 }}>
          {copy.p3_risk}
        </p>

        <PageFooter section="What Could Go Wrong" page={3} />
      </ReportPage>


      {/* ---- PAGE 4 — What would improve it? ---- */}
      <ReportPage record={record}>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 8 }}>How to Improve</h1>
        <p style={{ ...T.body, color: B.muted, marginBottom: 20, maxWidth: 540 }}>
          {copy.p4_intro}
        </p>

        {/* Current Band / Next Target Band — compact side by side */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, backgroundColor: B.white, border: `1px solid ${B.stone}`, borderLeft: `3px solid ${bandColor}`, borderRadius: 2, padding: "16px 20px" }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>CURRENT BAND</div>
            <div style={{ ...T.cardHeading, color: bandColor }}>{record.stability_band} | {record.final_score}</div>
            <p style={{ ...T.meta, color: B.muted, margin: "6px 0 0" }}>{copy.p4_current_band}</p>
          </div>
          <div style={{ flex: 1, backgroundColor: B.white, border: `1px solid ${B.stone}`, borderLeft: `3px solid ${tier === "high" ? B.bandHigh : tier === "established" ? B.bandHigh : tier === "developing" ? B.bandEstablished : B.bandDeveloping}`, borderRadius: 2, padding: "16px 20px" }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>NEXT TARGET BAND</div>
            <div style={{ ...T.cardHeading, color: B.navy }}>{record.final_score < 30 ? "Developing Stability | 30+" : record.final_score < 50 ? "Established Stability | 50+" : record.final_score < 75 ? "High Stability | 75+" : "Maintain Current"}</div>
            <p style={{ ...T.meta, color: B.muted, margin: "6px 0 0" }}>{record.final_score < 75 ? "More income secured ahead, less source dependence, stronger continuity." : "Maintain and protect this position."}</p>
          </div>
        </div>

        {/* Top 3 projected improvements — compact */}
        {v2Lift && v2Lift.lift_scenarios.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 10 }}>PROJECTED IMPROVEMENTS</div>
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

        <p style={{ ...T.body, color: B.muted, margin: 0, fontWeight: 500 }}>
          {copy.p4_fastest}
        </p>

        <PageFooter section="How to Improve" page={4} />
      </ReportPage>


      {/* ---- PAGE 5 — What do I do next? ---- */}
      <ReportPage record={record}>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 16 }}>What to Do Next</h1>

        <p style={{ ...T.body, color: B.muted, marginBottom: 20, maxWidth: 540, lineHeight: 1.6 }}>
          {copy.p5_body}
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
        <Overline>90-DAY STRUCTURAL CHECKLIST</Overline>
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
            {(v2Triggers && v2Triggers.length > 0) || (olTriggers && olTriggers.length > 0) ? (
              <>
                <div style={{ height: 1, backgroundColor: B.stone, margin: "8px 0" }} />
                <div style={{ ...T.meta, color: B.muted, fontWeight: 500, marginBottom: 4 }}>Reassess when:</div>
                {(v2Triggers ?? []).slice(0, 3).map((t) => (
                  <div key={t.trigger_id} style={{ ...T.meta, color: B.ink, marginBottom: 3 }}>• {t.description}</div>
                ))}
                {(olTriggers ?? []).slice(0, 2).map((t) => (
                  <div key={t.trigger_id} style={{ ...T.meta, color: B.ink, marginBottom: 3 }}>• {t.display_text}</div>
                ))}
              </>
            ) : null}
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
