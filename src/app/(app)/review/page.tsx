"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAssessment } from "@/lib/monitoring";

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
  constraint_guidance_payload: string;
  structural_improvement_path_text: string;
  action_plan_payload: string;
  peer_stability_percentile: number;
  peer_stability_percentile_label: string;
  projected_final_score: number;
  projected_stability_band: string;
  registry_visibility: string;
}

// ============================================================
// BRAND
// ============================================================
const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  sandDk: "#EDE9E0",
  muted: "#6B7280",
  light: "#9CA3AF",
  gradient: "linear-gradient(135deg, #0E1A2B 0%, #4B3FAE 50%, #1F6D7A 100%)",
};

// ============================================================
// HELPERS
// ============================================================

function subjectName(r: AssessmentRecord): string {
  return r.assessment_title || "this income system";
}

function subjectPossessive(r: AssessmentRecord): string {
  const name = subjectName(r);
  if (name === "this income system") return "this income system\u2019s";
  return name.endsWith("s") ? `${name}\u2019` : `${name}\u2019s`;
}

function indicatorStrengthSummary(r: AssessmentRecord): string {
  const labels = [
    r.income_persistence_label,
    r.income_source_diversity_label,
    r.forward_revenue_visibility_label,
    r.income_variability_label,
    r.active_labor_dependence_label,
    r.exposure_concentration_label,
  ];
  const strong = labels.filter((l) => /high|very high/i.test(l)).length;
  const moderate = labels.filter((l) => /moderate/i.test(l)).length;
  if (strong >= 4) return "strength in many areas";
  if (strong >= 2) return "some areas of strength";
  if (moderate >= 3) return "moderate results in several areas";
  return "early-stage results with limited income that continues on its own";
}

function activeIncomeDependence(r: AssessmentRecord): string {
  if (r.active_income_level >= 75) return "income from active work";
  if (r.active_income_level >= 50) return "a mix of active and partly recurring income";
  return "a mix of active, partly recurring, and ongoing income";
}

function percentileExplanation(r: AssessmentRecord): string {
  const p = r.peer_stability_percentile;
  const label = r.peer_stability_percentile_label;
  const name = subjectName(r);
  if (p >= 75) return `A score at the ${label} percentile means ${name} is more stable than most income systems in the ${r.industry_sector} sector.`;
  if (p >= 50) return `A score at the ${label} percentile means ${name} is about as stable as the average income system in the ${r.industry_sector} sector.`;
  return `A score at the ${label} percentile means ${name} is less stable than most income systems in the ${r.industry_sector} sector.`;
}

function getIndustryBenchmark(finalScore: number, sectorAvg?: number, sectorTop20?: number) {
  const avgScore = sectorAvg ?? 48;
  const top20Range = sectorTop20 ?? 65;
  const distance = Math.max(0, top20Range - finalScore);
  return { avgScore, top20Range, distance };
}

const RISK_EXPOSURE: Record<string, { mechanism: string; impact: string }> = {
  "Income Continuity Without Active Labor": {
    mechanism: "Income depends on ongoing work. If work stops, income stops too.",
    impact: "A health issue, break, or slowdown could mean no income during that time.",
  },
  "Recurring Revenue Base": {
    mechanism: "Most income comes from one-time payments rather than repeating revenue.",
    impact: "Stability depends on always finding new clients or deals.",
  },
  "Forward Revenue Visibility": {
    mechanism: "Very little income is already scheduled or committed for future months.",
    impact: "Income may drop if there are gaps between jobs or clients.",
  },
  "Income Concentration": {
    mechanism: "Most income comes from one or very few sources.",
    impact: "Losing a main source could cause a big drop in income.",
  },
  "Income Source Count": {
    mechanism: "Income comes from very few independent sources.",
    impact: "Losing any one source could seriously affect total income.",
  },
  "Earnings Variability": {
    mechanism: "Monthly income changes a lot from month to month.",
    impact: "It is harder to plan or meet regular financial obligations.",
  },
};

// Rank all 6 factors from strongest to weakest (labels only — no raw values exposed)
function getRankedFactors(r: AssessmentRecord): { label: string; level: string }[] {
  const LEVEL_ORDER: Record<string, number> = { "Very High": 5, "High": 4, "Moderate": 3, "Low": 2, "Very Low": 1 };
  const factors = [
    { label: "Income Persistence", level: r.income_persistence_label, inverted: false },
    { label: "Income Source Diversity", level: r.income_source_diversity_label, inverted: false },
    { label: "Forward Revenue Visibility", level: r.forward_revenue_visibility_label, inverted: false },
    { label: "Monthly Income Consistency", level: r.income_variability_label, inverted: true },
    { label: "Active Labor Independence", level: r.active_labor_dependence_label, inverted: true },
    { label: "Source Diversification", level: r.exposure_concentration_label, inverted: true },
  ];
  return factors
    .map((f) => {
      const raw = LEVEL_ORDER[f.level] || 3;
      const strength = f.inverted ? 6 - raw : raw;
      const displayLevel = f.inverted
        ? (raw <= 2 ? "Strong" : raw === 3 ? "Moderate" : "Weak")
        : (raw >= 4 ? "Strong" : raw === 3 ? "Moderate" : "Weak");
      return { label: f.label, level: displayLevel, _strength: strength };
    })
    .sort((a, b) => b._strength - a._strength)
    .map(({ label, level }) => ({ label, level }));
}

// Identify key positive/negative factors for Page 1
function getKeyFactors(r: AssessmentRecord): { positive: string[]; risks: string[] } {
  const factors = [
    { label: "Income Persistence", value: r.income_persistence_label, inverted: false },
    { label: "Income Source Diversity", value: r.income_source_diversity_label, inverted: false },
    { label: "Forward Revenue Visibility", value: r.forward_revenue_visibility_label, inverted: false },
    { label: "Monthly Income Variability", value: r.income_variability_label, inverted: true },
    { label: "Active Labor Independence", value: r.active_labor_dependence_label, inverted: true },
    { label: "Source Concentration", value: r.exposure_concentration_label, inverted: true },
  ];
  const positive: string[] = [];
  const risks: string[] = [];
  for (const f of factors) {
    const isHigh = /high|very high/i.test(f.value);
    const isLow = /low|very low/i.test(f.value);
    if (f.inverted) {
      if (isLow) positive.push(f.label);
      else if (isHigh) risks.push(f.label);
    } else {
      if (isHigh) positive.push(f.label);
      else if (isLow) risks.push(f.label);
    }
  }
  // Backfill with moderates — ensure at least 3 in each column
  const used = new Set([...positive, ...risks]);
  if (positive.length < 3) {
    for (const f of factors) {
      if (/moderate/i.test(f.value) && !used.has(f.label) && positive.length < 3) {
        positive.push(f.label);
        used.add(f.label);
      }
    }
  }
  if (risks.length < 3) {
    for (const f of factors) {
      if (/moderate/i.test(f.value) && !used.has(f.label) && risks.length < 3) {
        risks.push(f.label);
        used.add(f.label);
      }
    }
  }
  return { positive: positive.slice(0, 3), risks: risks.slice(0, 3) };
}

// ============================================================
// REPORT SPACING TOKENS — purposeful, enterprise-grade
// ============================================================
const R = {
  pagePad:    40,
  headerMb:   24,
  sectionGap: 20,
  labelMb:    10,
  paraMb:     10,
  itemGap:    8,
  dividerMy:  18,
  footerMt:   20,
};

const T = {
  score:      { fontSize: 48, fontWeight: 700, lineHeight: 1 },
  pageTitle:  { fontSize: 14, fontWeight: 600, lineHeight: 1.3, letterSpacing: "0.1em", textTransform: "uppercase" as const },
  band:       { fontSize: 15, fontWeight: 600, lineHeight: 1.3 },
  body:       { fontSize: 12, fontWeight: 400, lineHeight: 1.6 },
  small:      { fontSize: 11, fontWeight: 400, lineHeight: 1.5 },
  label:      { fontSize: 10, fontWeight: 600, lineHeight: 1.3, letterSpacing: "0.12em", textTransform: "uppercase" as const },
  caption:    { fontSize: 10, fontWeight: 400, lineHeight: 1.5 },
  micro:      { fontSize: 9, fontWeight: 600, lineHeight: 1.3 },
};

// ============================================================
// LAYOUT COMPONENTS
// ============================================================

function ReportHeader({ record }: { record: AssessmentRecord }) {
  const ts = record.issued_timestamp_utc || record.assessment_date_utc;
  return (
    <div style={{ marginBottom: R.headerMb }}>
      <div style={{ height: 3, borderRadius: "6px 6px 0 0", overflow: "hidden", background: B.gradient, margin: `-${R.pagePad}px -${R.pagePad}px 0` }} />
      <div style={{ paddingTop: 12, paddingBottom: 10, borderBottom: `1px solid ${B.sandDk}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/runpayway-logo.png" alt="RunPayway" style={{ height: 14, width: "auto" }} />
            <span style={{ ...T.caption, color: B.light }}>Income Stability Assessment · Model RP-1.0</span>
          </div>
          <div style={{ ...T.caption, color: B.light }}>
            {record.record_id.slice(0, 8)}… · {ts}
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ ...T.label, color: B.muted, marginBottom: R.labelMb }}>{children}</div>
  );
}

function SectionDivider() {
  return <div style={{ height: 1, backgroundColor: B.navy, opacity: 0.08, marginTop: R.dividerMy, marginBottom: R.dividerMy }} />;
}

function ConfidentialityFooter({ record }: { record: AssessmentRecord }) {
  return (
    <div style={{ marginTop: "auto", paddingTop: R.paraMb, borderTop: `1px solid ${B.sandDk}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ ...T.caption, color: B.light, fontStyle: "italic" }}>
        Confidential — Prepared for {record.assessment_title || "Assessment Subject"}
      </span>
      <span style={{ ...T.caption, color: B.light }}>
        RunPayway™ · support@runpayway.com
      </span>
    </div>
  );
}

function ReportPage({ record, children }: { record: AssessmentRecord; children: React.ReactNode }) {
  return (
    <div className="report-page" style={{
      backgroundColor: "#ffffff",
      border: "1px solid #E5E7EB",
      borderRadius: 8,
      padding: R.pagePad,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      minHeight: 600,
    }}>
      <ReportHeader record={record} />
      <div style={{ flex: 1 }}>{children}</div>
      <ConfidentialityFooter record={record} />
    </div>
  );
}

// ============================================================
// PDF DOWNLOAD — Native jsPDF text rendering (enterprise-grade)
// ============================================================

async function downloadPDF(record: AssessmentRecord) {
  const { jsPDF } = await import("jspdf");
  const QRCode = (await import("qrcode")).default;

  const pdf = new jsPDF({ orientation: "portrait", unit: "in", format: "letter" });
  const TOTAL_PAGES = 4;

  // ── Metadata ──
  pdf.setProperties({
    title: `Income Stability Assessment — ${record.assessment_title || "Report"}`,
    author: "RunPayway",
    subject: "Income Stability Score Report",
    keywords: "income stability, assessment, RunPayway, structural analysis",
    creator: `RunPayway Model ${record.model_version || "RP-1.0"}`,
  });

  // ── Layout constants ──
  const PW = 8.5, PH = 11;
  const ML = 0.65, MR = 0.65, MT = 0.45, MB = 0.75;
  const CW = PW - ML - MR;
  const halfCW = (CW - 0.3) / 2;

  // ── Color tuples ──
  type RGB = [number, number, number];
  const C = {
    navy:   [14, 26, 43] as RGB,
    purple: [75, 63, 174] as RGB,
    teal:   [31, 109, 122] as RGB,
    muted:  [107, 114, 128] as RGB,
    light:  [156, 163, 175] as RGB,
    sand:   [244, 241, 234] as RGB,
    sandDk: [237, 233, 224] as RGB,
    white:  [255, 255, 255] as RGB,
    tealBg: [235, 246, 247] as RGB,
    grayBg: [245, 245, 247] as RGB,
  };

  // ── Cursor tracking ──
  let y = MT;

  // ── Typography helpers ──
  function setFont(style: string, size: number, color: RGB) {
    pdf.setFont("helvetica", style);
    pdf.setFontSize(size);
    pdf.setTextColor(color[0], color[1], color[2]);
  }

  function textLines(text: string, maxW: number, size: number, style: string): string[] {
    pdf.setFont("helvetica", style);
    pdf.setFontSize(size);
    return pdf.splitTextToSize(text, maxW);
  }

  function textHeight(lines: string[], size: number, lineH: number): number {
    return lines.length * (size / 72) * lineH;
  }

  function drawWrapped(text: string, x: number, yPos: number, maxW: number, size: number, style: string, color: RGB, lineH = 1.5): number {
    const lines = textLines(text, maxW, size, style);
    const spacing = (size / 72) * lineH;
    setFont(style, size, color);
    for (let i = 0; i < lines.length; i++) {
      pdf.text(lines[i], x, yPos + i * spacing);
    }
    return yPos + lines.length * spacing;
  }

  function drawRight(text: string, yPos: number, size: number, style: string, color: RGB) {
    setFont(style, size, color);
    pdf.text(text, PW - MR, yPos, { align: "right" });
  }

  // ── Drawing helpers ──
  function fillRect(x: number, yPos: number, w: number, h: number, color: RGB) {
    pdf.setFillColor(color[0], color[1], color[2]);
    pdf.rect(x, yPos, w, h, "F");
  }

  function drawGradientBar(yPos: number) {
    const h = 0.035;
    const seg = CW / 3;
    fillRect(ML, yPos, seg + 0.01, h, C.navy);
    fillRect(ML + seg, yPos, seg + 0.01, h, C.purple);
    fillRect(ML + seg * 2, yPos, seg, h, C.teal);
  }

  function drawDivider(yPos: number): number {
    pdf.setDrawColor(220, 222, 225);
    pdf.setLineWidth(0.004);
    pdf.line(ML, yPos, PW - MR, yPos);
    return yPos + 0.18;
  }

  function drawLabel(text: string, yPos: number): number {
    setFont("bold", 8, C.muted);
    pdf.text(text.toUpperCase(), ML, yPos);
    return yPos + 0.16;
  }

  function drawHeader(yPos: number): number {
    drawGradientBar(yPos);
    yPos += 0.055;

    // Logo text
    setFont("bold", 9.5, C.navy);
    pdf.text("RUNPAYWAY", ML, yPos + 0.12);
    const logoW = pdf.getTextWidth("RUNPAYWAY");
    setFont("normal", 5.5, C.navy);
    pdf.text("\u2122", ML + logoW, yPos + 0.08);
    setFont("normal", 7.5, C.light);
    pdf.text("Income Stability Assessment \u00B7 Model RP-1.0", ML + logoW + 0.15, yPos + 0.12);

    // Right: ID + timestamp
    const ts = record.issued_timestamp_utc || record.assessment_date_utc;
    drawRight(`${record.record_id.slice(0, 8)}\u2026 \u00B7 ${ts}`, yPos + 0.12, 7.5, "normal", C.light);

    yPos += 0.24;
    pdf.setDrawColor(...C.sandDk);
    pdf.setLineWidth(0.005);
    pdf.line(ML, yPos, PW - MR, yPos);
    return yPos + 0.2;
  }

  function drawPageFooter(pageNum: number) {
    const footerY = PH - MB + 0.15;

    // Confidentiality line
    pdf.setDrawColor(...C.sandDk);
    pdf.setLineWidth(0.004);
    pdf.line(ML, footerY - 0.12, PW - MR, footerY - 0.12);

    setFont("italic", 7, C.light);
    pdf.text(`Confidential \u2014 Prepared for ${record.assessment_title || "Assessment Subject"}`, ML, footerY);

    // Support contact
    setFont("normal", 7, C.light);
    pdf.text("support@runpayway.com", PW - MR, footerY, { align: "right" });

    // Page number
    setFont("normal", 7.5, C.light);
    pdf.text(`Page ${pageNum} of ${TOTAL_PAGES}`, PW / 2, footerY + 0.18, { align: "center" });
  }

  // ── Data preparation ──
  const subject = subjectName(record);
  const possessive = subjectPossessive(record);
  const keyFactors = getKeyFactors(record);
  const ranked = getRankedFactors(record);
  const bench = getIndustryBenchmark(record.final_score, record.sector_avg_score, record.sector_top_20_threshold);
  const riskData = RISK_EXPOSURE[record.primary_constraint_label] || RISK_EXPOSURE["Forward Revenue Visibility"];
  const evolutionSteps: string[] = JSON.parse(record.evolution_path_steps_payload);
  const sectorMechanisms: string[] = JSON.parse(record.sector_mechanisms_payload);
  const actionPlan: string[] = JSON.parse(record.action_plan_payload || "[]");
  const evoIdx = evolutionSteps.length > 1 ? Math.round((record.current_evolution_stage_position / 100) * (evolutionSteps.length - 1)) : 0;

  // ════════════════════════════════════════════════════════════
  // PAGE 1 — Executive Assessment
  // ════════════════════════════════════════════════════════════
  y = drawHeader(MT);

  // Executive summary
  y = drawWrapped(record.page_1_key_insight_text, ML, y, CW, 9.5, "normal", C.muted, 1.6);
  y += 0.18;

  // Score label
  y = drawLabel("Income Stability Score\u2122", y);

  // Large score number
  setFont("bold", 40, C.navy);
  pdf.text(String(record.final_score), ML, y + 0.05);
  y += 0.42;

  // Band
  setFont("bold", 13, C.teal);
  pdf.text(record.stability_band, ML, y);
  y += 0.22;

  // Metadata line
  const ts = record.issued_timestamp_utc || record.assessment_date_utc;
  setFont("normal", 8, C.light);
  pdf.text(`Assessment ID: ${record.record_id.slice(0, 8)}\u2026`, ML, y);
  pdf.text(`Generated: ${ts}`, ML + 2.0, y);
  pdf.text("Model: RP-1.0", ML + 4.5, y);
  y += 0.25;

  // Spectrum bar
  const barH = 0.08;
  const bandW = CW / 4;
  const barColors: RGB[] = [C.navy, [45, 45, 110], C.teal, [55, 155, 145]];
  for (let i = 0; i < 4; i++) {
    fillRect(ML + bandW * i, y, bandW, barH, barColors[i]);
  }
  // White dividers
  pdf.setDrawColor(255, 255, 255);
  pdf.setLineWidth(0.01);
  for (let d = 1; d < 4; d++) {
    pdf.line(ML + bandW * d, y, ML + bandW * d, y + barH);
  }

  // Score position marker
  const scorePos = Math.min(Math.max(record.final_score / 100, 0), 1);
  const markerX = ML + scorePos * CW;
  pdf.setFillColor(...C.white);
  pdf.setDrawColor(...C.navy);
  pdf.setLineWidth(0.015);
  pdf.circle(markerX, y + barH / 2, 0.04, "FD");

  y += barH + 0.08;

  // Band labels
  const bands = [
    { label: "Limited", range: "0\u201339" },
    { label: "Developing", range: "40\u201359" },
    { label: "Established", range: "60\u201379" },
    { label: "High", range: "80\u2013100" },
  ];
  for (let i = 0; i < bands.length; i++) {
    const b = bands[i];
    const isActive = b.label + " Stability" === record.stability_band;
    const cx = ML + bandW * i + bandW / 2;

    if (isActive) {
      pdf.setDrawColor(...C.navy);
      pdf.setLineWidth(0.012);
      pdf.rect(ML + bandW * i + 0.04, y - 0.04, bandW - 0.08, 0.32, "S");
    }

    setFont(isActive ? "bold" : "normal", 7.5, isActive ? C.navy : C.light);
    pdf.text(b.label, cx, y + 0.08, { align: "center" });
    setFont(isActive ? "bold" : "normal", 6.5, isActive ? C.navy : C.light);
    pdf.text(b.range, cx, y + 0.2, { align: "center" });
  }
  y += 0.38;

  // Percentile
  if (record.peer_stability_percentile_label) {
    setFont("bold", 9.5, C.navy);
    const percText = `${record.peer_stability_percentile_label} percentile`;
    pdf.text(percText, ML, y);
    const pw = pdf.getTextWidth(percText);
    setFont("normal", 9.5, C.muted);
    pdf.text(` within ${record.industry_sector}`, ML + pw, y);
    y += 0.18;
    y = drawWrapped(percentileExplanation(record), ML, y, CW, 8.5, "normal", C.muted, 1.5);
    y += 0.08;
  }

  y = drawDivider(y);

  // Profile
  y = drawLabel("Profile", y);

  const profileItems: [string, string][] = [];
  if (record.assessment_title) profileItems.push(["Assessment Title", record.assessment_title]);
  profileItems.push(
    ["Classification", record.classification],
    ["Structure", record.operating_structure],
    ["Income Model", record.primary_income_model],
    ["Revenue", record.revenue_structure],
    ["Sector", record.industry_sector],
  );

  let profileStartIdx = 0;
  if (record.assessment_title) {
    setFont("normal", 9, C.light);
    pdf.text("Assessment Title: ", ML, y);
    const lw = pdf.getTextWidth("Assessment Title: ");
    setFont("bold", 9, C.navy);
    pdf.text(record.assessment_title, ML + lw, y);
    y += 0.2;
    profileStartIdx = 1;
  }

  const profilePairs = profileItems.slice(profileStartIdx);
  for (let i = 0; i < profilePairs.length; i += 2) {
    const [lLabel, lVal] = profilePairs[i];
    setFont("normal", 9, C.light);
    pdf.text(`${lLabel}: `, ML, y);
    const lw = pdf.getTextWidth(`${lLabel}: `);
    setFont("bold", 9, C.navy);
    pdf.text(lVal, ML + lw, y);

    if (i + 1 < profilePairs.length) {
      const [rLabel, rVal] = profilePairs[i + 1];
      const rx = ML + halfCW + 0.3;
      setFont("normal", 9, C.light);
      pdf.text(`${rLabel}: `, rx, y);
      const rw = pdf.getTextWidth(`${rLabel}: `);
      setFont("bold", 9, C.navy);
      pdf.text(rVal, rx + rw, y);
    }
    y += 0.2;
  }

  y = drawDivider(y + 0.02);

  // Key Structural Factors
  y = drawLabel(`Key Structural Factors \u2014 ${subject}`, y);
  y += 0.04;

  const colX1 = ML;
  const colX2 = ML + halfCW + 0.3;

  // Positive column
  let posY = y;
  setFont("bold", 7.5, C.teal);
  pdf.text("POSITIVE FACTORS", colX1, posY);
  posY += 0.18;
  const posItems = keyFactors.positive.length > 0 ? keyFactors.positive : ["No strong positive factors identified"];
  for (const f of posItems) {
    pdf.setFillColor(...C.teal);
    pdf.circle(colX1 + 0.04, posY - 0.03, 0.025, "F");
    setFont("normal", 8.5, keyFactors.positive.length > 0 ? C.navy : C.light);
    pdf.text(f, colX1 + 0.12, posY);
    posY += 0.2;
  }

  // Risks column
  let riskY = y;
  setFont("bold", 7.5, C.muted);
  pdf.text("STRUCTURAL RISKS", colX2, riskY);
  riskY += 0.18;
  const riskItems = keyFactors.risks.length > 0 ? keyFactors.risks : ["No significant structural risks identified"];
  for (const f of riskItems) {
    pdf.setFillColor(...C.light);
    pdf.circle(colX2 + 0.04, riskY - 0.03, 0.025, "F");
    setFont("normal", 8.5, keyFactors.risks.length > 0 ? C.navy : C.light);
    pdf.text(f, colX2 + 0.12, riskY);
    riskY += 0.2;
  }

  // ════════════════════════════════════════════════════════════
  // PAGE 2 — Structural Analysis
  // ════════════════════════════════════════════════════════════
  pdf.addPage();
  y = drawHeader(MT);

  setFont("bold", 12, C.navy);
  pdf.text("STRUCTURAL ANALYSIS", ML, y);
  y += 0.25;

  y = drawWrapped(record.page_2_key_insight_text, ML, y, CW, 9.5, "normal", C.muted, 1.6);
  y += 0.18;

  // Income Structure Map
  y = drawLabel(`Income Structure Map \u2014 ${subject}`, y);
  y = drawWrapped(`${possessive} income comes from three types of sources.`, ML, y, CW, 8.5, "normal", C.muted, 1.5);
  y += 0.12;

  const incBars: { label: string; value: number; color: RGB }[] = [
    { label: "Active Income", value: record.active_income_level, color: C.muted },
    { label: "Semi-Persistent", value: record.semi_persistent_income_level, color: C.teal },
    { label: "Persistent", value: record.persistent_income_level, color: C.navy },
  ];
  for (const bar of incBars) {
    setFont("normal", 8.5, C.muted);
    pdf.text(bar.label, ML, y);
    setFont("bold", 8.5, C.navy);
    pdf.text(`${bar.value}%`, PW - MR, y, { align: "right" });
    y += 0.1;
    fillRect(ML, y, CW, 0.09, C.sand);
    const barW = Math.max(0.02, (bar.value / 100) * CW);
    fillRect(ML, y, barW, 0.09, bar.color);
    y += 0.2;
  }

  y = drawDivider(y + 0.06);

  // Structural Indicators
  y = drawLabel("Structural Indicators", y);
  const indicators: [string, string][] = [
    ["Income That Continues", record.income_persistence_label],
    ["Number of Income Sources", record.income_source_diversity_label],
    ["Income Already Scheduled", record.forward_revenue_visibility_label],
    ["Monthly Income Variability", record.income_variability_label],
    ["Dependence on Personal Work", record.active_labor_dependence_label],
    ["Dependence on One Source", record.exposure_concentration_label],
  ];
  for (let i = 0; i < indicators.length; i++) {
    const [label, value] = indicators[i];
    if (i % 2 === 0) {
      fillRect(ML, y - 0.1, CW, 0.28, C.sand);
    }
    setFont("normal", 8.5, C.muted);
    pdf.text(label, ML + 0.1, y);
    setFont("bold", 8.5, C.navy);
    pdf.text(value, PW - MR - 0.1, y, { align: "right" });
    y += 0.28;
  }

  y = drawDivider(y + 0.06);

  // Structural Priority Map — ALL 6 factors
  y = drawLabel(`Structural Priority Map \u2014 ${subject}`, y);
  y = drawWrapped(`Factors ranked from strongest to weakest based on ${possessive} assessment.`, ML, y, CW, 8, "normal", C.muted, 1.5);
  y += 0.1;

  for (let i = 0; i < ranked.length; i++) {
    const f = ranked[i];
    if (i === 0) fillRect(ML, y - 0.1, CW, 0.28, C.tealBg);
    else if (i === ranked.length - 1) fillRect(ML, y - 0.1, CW, 0.28, C.grayBg);

    const rankColor: RGB = i === 0 ? C.teal : i === ranked.length - 1 ? C.light : C.muted;
    setFont("bold", 8.5, rankColor);
    pdf.text(String(i + 1), ML + 0.1, y);
    setFont("normal", 8.5, C.navy);
    pdf.text(f.label, ML + 0.3, y);
    const levelColor: RGB = f.level === "Strong" ? C.teal : f.level === "Weak" ? C.muted : C.light;
    setFont("bold", 8, levelColor);
    pdf.text(f.level, PW - MR - 0.1, y, { align: "right" });
    y += 0.28;
  }

  // ════════════════════════════════════════════════════════════
  // PAGE 3 — Diagnosis & Benchmarks
  // ════════════════════════════════════════════════════════════
  pdf.addPage();
  y = drawHeader(MT);

  setFont("bold", 12, C.navy);
  pdf.text("DIAGNOSIS & BENCHMARKS", ML, y);
  y += 0.25;

  // System Diagnosis
  y = drawLabel(`System Diagnosis \u2014 ${subject}`, y);

  // Paragraph 1: classification
  const diag1 = `${subject} operates mainly as a ${record.labor_asset_position_label} income system in the ${record.industry_sector} sector.`;
  y = drawWrapped(diag1, ML, y, CW, 9.5, "normal", C.muted, 1.6);
  y += 0.08;

  // Paragraph 2: income mix
  const diag2 = `Income mainly comes from ${activeIncomeDependence(record)}. The system shows ${indicatorStrengthSummary(record)}.`;
  y = drawWrapped(diag2, ML, y, CW, 9.5, "normal", C.muted, 1.6);
  y += 0.08;

  // Paragraph 3: constraint
  const diag3 = `Because ${record.primary_constraint_label} is limited, stability depends on continuing to generate new work.`;
  y = drawWrapped(diag3, ML, y, CW, 9.5, "normal", C.muted, 1.6);
  y += 0.08;

  y = drawDivider(y);

  // Industry Benchmark
  y = drawLabel(`${record.industry_sector} Stability Benchmark`, y);
  const benchRows: [string, string, boolean][] = [
    [`Average ${record.industry_sector} Stability Score`, String(bench.avgScore), false],
    ["Top 20% Stability Range", `${bench.top20Range}+`, false],
    ["Your Score", String(record.final_score), true],
    ["Distance From Top Stability Tier", `${bench.distance} points`, false],
  ];

  // Table border
  pdf.setDrawColor(...C.sandDk);
  pdf.setLineWidth(0.005);
  const tableTop = y - 0.1;
  const rowH = 0.3;
  pdf.rect(ML, tableTop, CW, rowH * benchRows.length, "S");

  for (let i = 0; i < benchRows.length; i++) {
    const [label, value, highlight] = benchRows[i];
    const rowY = tableTop + i * rowH;
    if (i % 2 === 0) fillRect(ML + 0.003, rowY + 0.003, CW - 0.006, rowH - 0.003, C.sand);
    // Row divider
    if (i > 0) {
      pdf.setDrawColor(...C.sandDk);
      pdf.setLineWidth(0.003);
      pdf.line(ML, rowY, PW - MR, rowY);
    }
    setFont("normal", 8.5, C.muted);
    pdf.text(label, ML + 0.12, rowY + 0.19);
    setFont("bold", 9, highlight ? C.purple : C.navy);
    pdf.text(value, PW - MR - 0.12, rowY + 0.19, { align: "right" });
  }
  y = tableTop + benchRows.length * rowH + 0.18;

  // Drivers
  y = drawLabel(`Drivers Supporting ${possessive} Stability`, y);
  const drivers = [record.driver_1_label, record.driver_2_label, record.driver_3_label];
  let dx = ML;
  for (const d of drivers) {
    setFont("bold", 8, C.navy);
    const dw = pdf.getTextWidth(d) + 0.2;
    fillRect(dx, y - 0.07, dw, 0.24, C.sand);
    pdf.text(d, dx + 0.1, y + 0.05);
    dx += dw + 0.1;
  }
  y += 0.35;

  y = drawDivider(y);

  // Primary Constraint
  y = drawLabel(`Primary Structural Constraint \u2014 ${subject}`, y);
  setFont("bold", 10, C.navy);
  pdf.text(record.primary_constraint_label, ML, y);
  y += 0.22;
  y = drawWrapped(riskData.mechanism, ML, y, CW, 8.5, "normal", C.muted, 1.5);
  y += 0.06;
  y = drawWrapped(riskData.impact, ML, y, CW, 8.5, "normal", C.muted, 1.5);
  y += 0.12;

  // Projected Score (if available and different)
  if (record.projected_final_score && record.projected_final_score !== record.final_score) {
    y = drawDivider(y);
    y = drawLabel("Projected Score with Structural Improvements", y);
    setFont("bold", 9.5, C.muted);
    pdf.text("Current Score: ", ML, y);
    let projX = ML + pdf.getTextWidth("Current Score: ");
    setFont("bold", 9.5, C.navy);
    pdf.text(String(record.final_score), projX, y);

    setFont("bold", 9.5, C.muted);
    pdf.text("Projected Score: ", ML + 2.5, y);
    projX = ML + 2.5 + pdf.getTextWidth("Projected Score: ");
    setFont("bold", 9.5, C.teal);
    pdf.text(`${record.projected_final_score} (${record.projected_stability_band})`, projX, y);
    y += 0.25;
  }

  // ════════════════════════════════════════════════════════════
  // PAGE 4 — Improvement Path & Governance
  // ════════════════════════════════════════════════════════════
  pdf.addPage();
  y = drawHeader(MT);

  setFont("bold", 12, C.navy);
  pdf.text("IMPROVEMENT PATH & GOVERNANCE", ML, y);
  y += 0.25;

  y = drawWrapped(record.page_3_key_insight_text, ML, y, CW, 9.5, "normal", C.muted, 1.6);
  y += 0.12;

  // Improvement Opportunities
  y = drawLabel(`Improvement Opportunities \u2014 ${subject}`, y);
  y = drawWrapped(record.structural_improvement_path_text, ML, y, CW, 8.5, "normal", C.muted, 1.5);
  y += 0.12;

  // 90-Day Action Plan
  if (actionPlan.length > 0) {
    y = drawLabel(`90-Day Action Plan \u2014 ${subject}`, y);
    y = drawWrapped(
      `Three priority actions for ${subject} based on the primary constraint: ${record.primary_constraint_label}`,
      ML, y, CW, 8, "normal", C.muted, 1.5
    );
    y += 0.08;

    for (let i = 0; i < actionPlan.length; i++) {
      setFont("bold", 9, C.teal);
      pdf.text(`${i + 1}.`, ML, y);
      const actionLines = textLines(actionPlan[i], CW - 0.3, 8.5, "normal");
      setFont("normal", 8.5, C.navy);
      const spacing = (8.5 / 72) * 1.5;
      for (let j = 0; j < actionLines.length; j++) {
        pdf.text(actionLines[j], ML + 0.25, y + j * spacing);
      }
      y += actionLines.length * spacing + 0.06;
    }

    // Disclaimer
    y = drawWrapped(
      `These actions are based on structural patterns in ${record.industry_sector} for income systems where ${record.primary_constraint_label} is the primary limitation. They are illustrative structural examples and do not constitute financial, legal, or investment advice.`,
      ML, y + 0.02, CW, 7.5, "italic", C.light, 1.4
    );
    y += 0.06;
  }

  y = drawDivider(y);

  // Sector Evolution Path
  y = drawLabel("Sector Evolution Path", y);
  let evX = ML;
  for (let i = 0; i < evolutionSteps.length; i++) {
    const step = evolutionSteps[i];
    const active = i === evoIdx;
    const past = i < evoIdx;

    setFont("bold", 7.5, active || past ? C.white : C.light);
    const sw = pdf.getTextWidth(step) + 0.18;
    const bgColor: RGB = active ? C.navy : past ? C.teal : C.sand;
    fillRect(evX, y - 0.08, sw, 0.22, bgColor);
    pdf.text(step, evX + 0.09, y + 0.04);
    evX += sw + 0.04;

    if (i < evolutionSteps.length - 1) {
      setFont("normal", 8, C.light);
      pdf.text("\u2192", evX, y + 0.04);
      evX += 0.16;
    }
  }
  y += 0.28;
  setFont("normal", 8, C.muted);
  pdf.text("Current Stage: ", ML, y);
  const csw = pdf.getTextWidth("Current Stage: ");
  setFont("bold", 8, C.navy);
  pdf.text(record.current_evolution_stage_label, ML + csw, y);
  y += 0.2;

  // Sector Stability Mechanisms
  y = drawLabel("Sector Stability Mechanisms", y + 0.06);
  for (const m of sectorMechanisms) {
    setFont("normal", 8.5, C.muted);
    pdf.text(`\u2022  ${m}`, ML + 0.05, y);
    y += 0.17;
  }

  y = drawDivider(y + 0.06);

  // Methodology
  y = drawLabel("Methodology", y);
  y = drawWrapped(
    "The Income Stability Score\u2122 evaluates the structural stability of income at a specific point in time. Six structural factors are assessed under Model RP-1.0 using fixed, deterministic scoring criteria. The model does not evaluate investment performance, creditworthiness, or future financial outcomes.",
    ML, y, CW, 8, "normal", C.muted, 1.5
  );
  y += 0.06;

  // Disclosure
  y = drawDivider(y);
  y = drawLabel("Disclosure", y);
  y = drawWrapped(
    "This report is created by a fixed classification model. It is not financial advice. The Income Stability Score is not a credit score, not a measure of net worth, and not a prediction of future income.",
    ML, y, CW, 8, "normal", C.light, 1.5
  );
  y += 0.06;

  y = drawDivider(y);

  // Official Classification Record
  y = drawLabel("Official Classification Record", y);
  const recordFields: [string, string][] = [
    ["Record ID", record.record_id],
    ["Model", record.model_version || "RP-1.0 | Version 1.0"],
    ["Date", record.issued_timestamp_utc || record.assessment_date_utc],
    ["Score", `${record.final_score} \u2014 ${record.stability_band}`],
    ["Auth Code", record.authorization_code],
    ["Registry", record.registry_visibility === "public" ? "Publicly Listed" : "Private Record"],
  ];
  for (const [label, value] of recordFields) {
    setFont("normal", 8, C.light);
    pdf.text(label, ML, y);
    setFont("normal", 8, C.navy);
    pdf.setFont("courier", "normal");
    pdf.setFontSize(7.5);
    pdf.text(value, ML + 0.7, y);
    y += 0.17;
  }
  y += 0.06;

  // QR Code for verification
  const verifyUrl = `https://runpayway.com/verify?id=${record.record_id}&auth=${record.authorization_code}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 200, margin: 1, color: { dark: "#0E1A2B", light: "#ffffff" } });
    const qrSize = 0.8;
    const qrX = PW - MR - qrSize;
    pdf.addImage(qrDataUrl, "PNG", qrX, y - 0.05, qrSize, qrSize);

    setFont("normal", 8, C.muted);
    pdf.text("Verify this report at", ML, y + 0.1);
    setFont("bold", 8.5, C.navy);
    pdf.text("RunPayway\u2122.com/verify", ML, y + 0.26);
    setFont("normal", 7.5, C.muted);
    pdf.text("using the Record ID and Authorization Code,", ML, y + 0.42);
    pdf.text("or scan the QR code.", ML, y + 0.55);
  } catch {
    // Fallback if QR generation fails
    setFont("normal", 8, C.muted);
    pdf.text("Verify this report at ", ML, y);
    const vw = pdf.getTextWidth("Verify this report at ");
    setFont("bold", 8.5, C.navy);
    pdf.text("RunPayway\u2122.com/verify", ML + vw, y);
    y += 0.16;
    setFont("normal", 8, C.muted);
    pdf.text("using the Record ID and Authorization Code.", ML, y);
  }

  // Model reference footer
  y = PH - MB - 0.15;
  pdf.setDrawColor(...C.sandDk);
  pdf.setLineWidth(0.004);
  pdf.line(ML, y, PW - MR, y);
  y += 0.14;
  setFont("normal", 7.5, C.light);
  pdf.text("RunPayway\u2122 Structural Stability Model RP-1.0", PW / 2, y, { align: "center" });

  // ════════════════════════════════════════════════════════════
  // ALL PAGES — Add page footers (confidentiality + page numbers)
  // ════════════════════════════════════════════════════════════
  for (let p = 1; p <= TOTAL_PAGES; p++) {
    pdf.setPage(p);
    drawPageFooter(p);
  }

  // ── Save ──
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
  const monitoringTracked = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = sessionStorage.getItem("rp_record");
    if (!stored) { router.push("/diagnostic-portal"); return; }
    const parsed: AssessmentRecord = JSON.parse(stored);
    setRecord(parsed);

    // Persist record for Verify a Score lookup
    try {
      const records = JSON.parse(localStorage.getItem("rp_records") || "[]") as Array<Record<string, unknown>>;
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

    // Track monitoring assessment usage (once per load)
    if (!monitoringTracked.current) {
      monitoringTracked.current = true;
      try {
        const purchaseSession = sessionStorage.getItem("rp_purchase_session");
        if (purchaseSession) {
          const ps = JSON.parse(purchaseSession);
          if (ps.plan_key === "annual_monitoring" && ps.monitoring_access_code) {
            useAssessment(ps.monitoring_access_code, parsed.record_id);
          }
        }
      } catch { /* ignore */ }
    }
  }, [router]);

  if (!record) return null;

  const evolutionSteps: string[] = JSON.parse(record.evolution_path_steps_payload);
  const sectorMechanisms: string[] = JSON.parse(record.sector_mechanisms_payload);
  const riskData = RISK_EXPOSURE[record.primary_constraint_label] || RISK_EXPOSURE["Forward Revenue Visibility"];
  const subject = subjectName(record);
  const possessive = subjectPossessive(record);
  const keyFactors = getKeyFactors(record);
  const rankedFactors = getRankedFactors(record);
  const bench = getIndustryBenchmark(record.final_score, record.sector_avg_score, record.sector_top_20_threshold);
  const evoIdx = evolutionSteps.length > 1 ? Math.round((record.current_evolution_stage_position / 100) * (evolutionSteps.length - 1)) : 0;

  const handleDownload = async () => {
    setDownloading(true);
    try { await downloadPDF(record); } finally { setDownloading(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="no-print">
        <h1 style={{ fontSize: 20, fontWeight: 600, color: B.navy }}>Income Stability Assessment</h1>
        <p style={{ fontSize: 14, color: B.muted, marginTop: 4 }}>Model RP-1.0 | Version 1.0</p>
      </div>

      {/* ==================== PAGE 1 — Executive Assessment ==================== */}
      <ReportPage record={record}>
        {/* Executive summary */}
        <p style={{ ...T.body, color: B.muted, marginBottom: R.sectionGap }}>
          {record.page_1_key_insight_text}
        </p>

        {/* Score presentation */}
        <div style={{ marginBottom: R.sectionGap }}>
          <Label>Income Stability Score™</Label>
          <div style={{ ...T.score, color: B.navy }}>
            {record.final_score}
          </div>
          <div style={{ ...T.band, color: B.teal, marginTop: 6 }}>
            {record.stability_band}
          </div>

          {/* Metadata */}
          <div style={{ ...T.caption, color: B.light, marginTop: R.paraMb, display: "flex", flexWrap: "wrap", gap: "0 24px" }}>
            <span>Assessment ID: {record.record_id.slice(0, 8)}…</span>
            <span>Generated: {record.issued_timestamp_utc || record.assessment_date_utc}</span>
            <span>Model: RP-1.0</span>
          </div>
        </div>

        {/* Spectrum bar */}
        <div style={{ marginBottom: R.sectionGap }}>
          <div style={{ position: "relative", marginBottom: R.itemGap }}>
            <div style={{ height: 8, borderRadius: 99, background: B.gradient }} />
            {/* Score position marker */}
            <div style={{
              position: "absolute",
              left: `${Math.min(Math.max(record.final_score, 0), 100)}%`,
              top: -3,
              width: 14,
              height: 14,
              borderRadius: 99,
              backgroundColor: "#ffffff",
              border: `2px solid ${B.navy}`,
              transform: "translateX(-50%)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }} />
            {[40, 60, 80].map((pos) => (
              <div key={pos} style={{ position: "absolute", left: `${pos}%`, top: 0, width: 1, height: 8, backgroundColor: "rgba(255,255,255,0.4)" }} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {[
              { label: "Limited", range: "0\u201339" },
              { label: "Developing", range: "40\u201359" },
              { label: "Established", range: "60\u201379" },
              { label: "High", range: "80\u2013100" },
            ].map((b) => {
              const isActive = b.label + " Stability" === record.stability_band;
              return (
                <div key={b.label} style={{ textAlign: "center", padding: "4px 2px 3px", borderRadius: 4, border: isActive ? `1.5px solid ${B.navy}` : "1.5px solid transparent", backgroundColor: isActive ? "rgba(14,26,43,0.03)" : "transparent" }}>
                  <div style={{ ...T.micro, fontWeight: isActive ? 700 : T.micro.fontWeight, color: isActive ? B.navy : B.light }}>{b.label}</div>
                  <div style={{ fontSize: 8, fontWeight: isActive ? 600 : 400, color: isActive ? B.navy : B.light }}>{b.range}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Percentile */}
        {record.peer_stability_percentile_label && (
          <div style={{ marginBottom: R.sectionGap }}>
            <p style={{ ...T.body, color: B.muted }}>
              <span style={{ fontWeight: 500, color: B.navy }}>{record.peer_stability_percentile_label} percentile</span>{" "}within {record.industry_sector}
            </p>
            <p style={{ ...T.small, color: B.muted, marginTop: 6 }}>
              {percentileExplanation(record)}
            </p>
          </div>
        )}

        <SectionDivider />

        {/* Profile */}
        <Label>Profile</Label>
        <dl style={{ ...T.body, display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${R.itemGap}px 24px` }}>
          {record.assessment_title && (
            <div style={{ gridColumn: "1 / -1" }}>
              <dt style={{ display: "inline", color: B.light }}>Assessment Title: </dt>
              <dd style={{ display: "inline", fontWeight: 500, color: B.navy }}>{record.assessment_title}</dd>
            </div>
          )}
          {[
            ["Classification", record.classification],
            ["Structure", record.operating_structure],
            ["Income Model", record.primary_income_model],
            ["Revenue", record.revenue_structure],
            ["Sector", record.industry_sector],
          ].map(([l, v]) => (
            <div key={l}>
              <dt style={{ display: "inline", color: B.light }}>{l}: </dt>
              <dd style={{ display: "inline", fontWeight: 500, color: B.navy }}>{v}</dd>
            </div>
          ))}
        </dl>

        <SectionDivider />

        {/* Key Structural Factors */}
        <Label>Key Structural Factors — {subject}</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: R.sectionGap, marginTop: R.paraMb }}>
          <div>
            <div style={{ ...T.label, color: B.teal, marginBottom: R.labelMb }}>
              Positive Factors
            </div>
            <ul style={{ display: "flex", flexDirection: "column", gap: R.itemGap }}>
              {keyFactors.positive.map((f) => (
                <li key={f} style={{ ...T.small, color: B.navy, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 4, height: 4, borderRadius: 99, flexShrink: 0, backgroundColor: B.teal }} />
                  {f}
                </li>
              ))}
              {keyFactors.positive.length === 0 && (
                <li style={{ ...T.small, color: B.light }}>No strong positive factors identified</li>
              )}
            </ul>
          </div>
          <div>
            <div style={{ ...T.label, color: B.muted, marginBottom: R.labelMb }}>
              Structural Risks
            </div>
            <ul style={{ display: "flex", flexDirection: "column", gap: R.itemGap }}>
              {keyFactors.risks.map((f) => (
                <li key={f} style={{ ...T.small, color: B.navy, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 4, height: 4, borderRadius: 99, flexShrink: 0, backgroundColor: B.light }} />
                  {f}
                </li>
              ))}
              {keyFactors.risks.length === 0 && (
                <li style={{ ...T.small, color: B.light }}>No significant structural risks identified</li>
              )}
            </ul>
          </div>
        </div>
      </ReportPage>

      {/* ==================== PAGE 2 — Structural Analysis ==================== */}
      <ReportPage record={record}>
        <h2 style={{ ...T.pageTitle, color: B.navy, marginBottom: 4 }}>
          Structural Analysis
        </h2>
        <p style={{ ...T.body, color: B.muted, marginBottom: R.sectionGap }}>
          {record.page_2_key_insight_text}
        </p>

        {/* Income Structure Map — color-coded bars */}
        <Label>Income Structure Map — {subject}</Label>
        <p style={{ ...T.small, color: B.muted, marginBottom: R.paraMb }}>
          {possessive} income comes from three types of sources.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: R.paraMb }}>
          {[
            { label: "Active Income", value: record.active_income_level, color: B.muted },
            { label: "Semi-Persistent", value: record.semi_persistent_income_level, color: B.teal },
            { label: "Persistent", value: record.persistent_income_level, color: B.navy },
          ].map((bar) => (
            <div key={bar.label}>
              <div style={{ ...T.small, display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: B.muted }}>{bar.label}</span>
                <span style={{ fontWeight: 500, color: B.navy }}>{bar.value}%</span>
              </div>
              <div style={{ height: 10, borderRadius: 99, overflow: "hidden", backgroundColor: B.sand }}>
                <div style={{ height: "100%", borderRadius: 99, width: `${bar.value}%`, backgroundColor: bar.color }} />
              </div>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* Structural Indicators */}
        <Label>Structural Indicators</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: R.itemGap }}>
          {[
            ["Income That Continues", record.income_persistence_label],
            ["Number of Income Sources", record.income_source_diversity_label],
            ["Income Already Scheduled", record.forward_revenue_visibility_label],
            ["Monthly Income Variability", record.income_variability_label],
            ["Dependence on Personal Work", record.active_labor_dependence_label],
            ["Dependence on One Source", record.exposure_concentration_label],
          ].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", borderRadius: 6, backgroundColor: B.sand, padding: "8px 12px" }}>
              <span style={{ ...T.caption, color: B.muted }}>{l}</span>
              <span style={{ ...T.caption, fontWeight: 500, color: B.navy }}>{v}</span>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* Structural Priority Map — ALL 6 factors */}
        <Label>Structural Priority Map — {subject}</Label>
        <p style={{ ...T.caption, color: B.muted, marginBottom: R.paraMb }}>
          Factors ranked from strongest to weakest based on {possessive} assessment.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {rankedFactors.map((f, i) => (
            <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 10, borderRadius: 6, backgroundColor: i === 0 ? "rgba(31,109,122,0.06)" : i >= rankedFactors.length - 1 ? "rgba(14,26,43,0.03)" : "transparent", padding: "5px 10px" }}>
              <span style={{ ...T.caption, fontWeight: 600, color: i === 0 ? B.teal : i >= rankedFactors.length - 1 ? B.light : B.muted, minWidth: 14 }}>{i + 1}</span>
              <span style={{ ...T.small, color: B.navy, flex: 1 }}>{f.label}</span>
              <span style={{ ...T.caption, fontWeight: 500, color: f.level === "Strong" ? B.teal : f.level === "Weak" ? B.muted : B.light }}>{f.level}</span>
            </div>
          ))}
        </div>
      </ReportPage>

      {/* ==================== PAGE 3 — Diagnosis & Benchmarks ==================== */}
      <ReportPage record={record}>
        <h2 style={{ ...T.pageTitle, color: B.navy, marginBottom: 4 }}>
          Diagnosis &amp; Benchmarks
        </h2>

        {/* System Diagnosis */}
        <Label>System Diagnosis — {subject}</Label>
        <div style={{ ...T.body, color: B.muted, display: "flex", flexDirection: "column", gap: R.paraMb }}>
          <p>
            {subject} operates mainly as a <strong style={{ color: B.navy }}>{record.labor_asset_position_label}</strong> income
            system in the <strong style={{ color: B.navy }}>{record.industry_sector}</strong> sector.
          </p>
          <p>
            Income mainly comes from {activeIncomeDependence(record)}.
            The system shows {indicatorStrengthSummary(record)}.
          </p>
          <p>
            Because <strong style={{ color: B.navy }}>{record.primary_constraint_label}</strong> is limited,
            stability depends on continuing to generate new work.
          </p>
        </div>

        <SectionDivider />

        {/* Industry Benchmark */}
        <Label>{record.industry_sector} Stability Benchmark</Label>
        <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${B.sandDk}` }}>
          {[
            [`Average ${record.industry_sector} Stability Score`, String(bench.avgScore)],
            ["Top 20% Stability Range", `${bench.top20Range}+`],
            ["Your Score", String(record.final_score)],
            ["Distance From Top Stability Tier", `${bench.distance} points`],
          ].map(([label, value], i) => (
            <div key={label} style={{ ...T.small, display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: i % 2 === 0 ? B.sand : "white", padding: "8px 14px" }}>
              <span style={{ color: B.muted }}>{label}</span>
              <span style={{ fontWeight: 600, color: i === 2 ? B.purple : B.navy }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Drivers */}
        <div style={{ marginTop: R.sectionGap }}>
          <Label>Drivers Supporting {possessive} Stability</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: R.itemGap }}>
            {[record.driver_1_label, record.driver_2_label, record.driver_3_label].map((d) => (
              <span key={d} style={{ ...T.caption, fontWeight: 500, borderRadius: 6, backgroundColor: B.sand, color: B.navy, padding: "4px 10px" }}>{d}</span>
            ))}
          </div>
        </div>

        <SectionDivider />

        {/* Primary Constraint */}
        <Label>Primary Structural Constraint — {subject}</Label>
        <div style={{ ...T.body, fontWeight: 500, color: B.navy, marginBottom: R.itemGap }}>{record.primary_constraint_label}</div>
        <div style={{ ...T.small, color: B.muted, display: "flex", flexDirection: "column", gap: R.itemGap }}>
          <p>{riskData.mechanism}</p>
          <p>{riskData.impact}</p>
        </div>

        {/* Projected Score */}
        {record.projected_final_score && record.projected_final_score !== record.final_score && (
          <>
            <SectionDivider />
            <Label>Projected Score with Structural Improvements</Label>
            <div style={{ ...T.body, display: "flex", gap: 32 }}>
              <span style={{ color: B.muted }}>Current: <strong style={{ color: B.navy }}>{record.final_score}</strong></span>
              <span style={{ color: B.muted }}>Projected: <strong style={{ color: B.teal }}>{record.projected_final_score} ({record.projected_stability_band})</strong></span>
            </div>
          </>
        )}
      </ReportPage>

      {/* ==================== PAGE 4 — Improvement Path & Governance ==================== */}
      <ReportPage record={record}>
        <h2 style={{ ...T.pageTitle, color: B.navy, marginBottom: 4 }}>
          Improvement Path &amp; Governance
        </h2>
        <p style={{ ...T.body, color: B.muted, marginBottom: R.sectionGap }}>
          {record.page_3_key_insight_text}
        </p>

        {/* Improvement Opportunities */}
        <Label>Improvement Opportunities — {subject}</Label>
        <p style={{ ...T.small, color: B.muted, marginBottom: R.paraMb }}>
          {record.structural_improvement_path_text}
        </p>

        {/* 90-Day Action Plan */}
        {(() => {
          const actionPlan: string[] = JSON.parse(record.action_plan_payload || "[]");
          if (actionPlan.length === 0) return null;
          return (
            <div style={{ marginTop: R.sectionGap }}>
              <Label>90-Day Action Plan — {subject}</Label>
              <p style={{ ...T.caption, color: B.muted, marginBottom: R.paraMb }}>
                Three priority actions for {subject} based on the primary constraint: {record.primary_constraint_label}
              </p>
              <ol style={{ ...T.small, color: B.navy, margin: 0, paddingLeft: 0, listStyleType: "none", display: "flex", flexDirection: "column", gap: R.itemGap }}>
                {actionPlan.map((action, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ ...T.small, fontWeight: 600, color: B.teal, flexShrink: 0, minWidth: 18 }}>{i + 1}.</span>
                    <span style={{ ...T.small, color: B.navy }}>{action}</span>
                  </li>
                ))}
              </ol>
              <p style={{ ...T.caption, color: B.light, marginTop: R.paraMb, fontStyle: "italic" }}>
                These actions are based on structural patterns in {record.industry_sector} for income systems where {record.primary_constraint_label} is the primary limitation. They are illustrative structural examples and do not constitute financial, legal, or investment advice.
              </p>
            </div>
          );
        })()}

        <SectionDivider />

        {/* Sector evolution */}
        <div>
          <div style={{ ...T.label, color: B.muted, marginBottom: R.labelMb }}>
            Sector Evolution Path
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: R.itemGap }}>
            {evolutionSteps.map((step, i) => {
              const active = i === evoIdx;
              const past = i < evoIdx;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: R.itemGap }}>
                  <span
                    style={{
                      ...T.caption, fontWeight: 500,
                      padding: "4px 10px", borderRadius: 4,
                      backgroundColor: active ? B.navy : past ? B.teal : B.sand,
                      color: active || past ? "#ffffff" : B.light,
                    }}
                  >
                    {step}
                  </span>
                  {i < evolutionSteps.length - 1 && <span style={{ ...T.caption, color: B.light }}>&rarr;</span>}
                </div>
              );
            })}
          </div>
          <div style={{ ...T.caption, color: B.muted, marginTop: R.paraMb }}>
            Current Stage: <strong style={{ color: B.navy }}>{record.current_evolution_stage_label}</strong>
          </div>
        </div>

        {/* Sector mechanisms */}
        <div style={{ marginTop: R.sectionGap }}>
          <div style={{ ...T.label, color: B.muted, marginBottom: R.labelMb }}>
            Sector Stability Mechanisms
          </div>
          <ul style={{ ...T.small, color: B.muted, listStyleType: "disc", listStylePosition: "inside", display: "flex", flexDirection: "column", gap: 4 }}>
            {sectorMechanisms.map((m) => <li key={m}>{m}</li>)}
          </ul>
        </div>

        <SectionDivider />

        {/* Methodology */}
        <Label>Methodology</Label>
        <p style={{ ...T.caption, color: B.muted }}>
          The Income Stability Score™ evaluates the structural stability of income at a specific point in time.
          Six structural factors are assessed under Model RP-1.0 using fixed, deterministic scoring criteria.
          The model does not evaluate investment performance, creditworthiness, or future financial outcomes.
        </p>

        <SectionDivider />

        {/* Disclosure */}
        <Label>Disclosure</Label>
        <p style={{ ...T.caption, color: B.light }}>
          This report is created by a fixed classification model. It is not financial advice.
          The Income Stability Score is not a credit score, not a measure of net worth,
          and not a prediction of future income.
        </p>

        <SectionDivider />

        {/* Official Record */}
        <Label>Official Classification Record</Label>
        <dl style={{ ...T.small, display: "flex", flexDirection: "column", gap: R.itemGap, marginTop: R.paraMb }}>
          {[
            ["Record ID", record.record_id],
            ["Model", record.model_version || "RP-1.0 | Version 1.0"],
            ["Date", record.issued_timestamp_utc || record.assessment_date_utc],
            ["Score", `${record.final_score} — ${record.stability_band}`],
            ["Auth Code", record.authorization_code],
            ["Registry", record.registry_visibility === "public" ? "Publicly Listed" : "Private Record"],
          ].map(([l, v]) => (
            <div key={l} style={{ display: "flex" }}>
              <dt style={{ width: 80, flexShrink: 0, color: B.light }}>{l}</dt>
              <dd style={{ ...T.caption, fontFamily: "monospace", wordBreak: "break-all", color: B.navy }}>{v}</dd>
            </div>
          ))}
        </dl>

        {/* Verification */}
        <p style={{ ...T.caption, color: B.muted, marginTop: R.sectionGap }}>
          Verify this report at <span style={{ fontWeight: 500, color: B.navy }}>RunPayway™.com/verify</span> using the Record ID and Authorization Code.
        </p>

        {/* Model reference */}
        <div style={{ textAlign: "center", marginTop: R.footerMt, paddingTop: R.paraMb, borderTop: `1px solid ${B.sandDk}` }}>
          <div style={{ ...T.caption, color: B.light }}>RunPayway™ Structural Stability Model RP-1.0</div>
        </div>
      </ReportPage>

      {/* Download */}
      <div className="download-section no-print" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{ padding: "10px 24px", fontSize: 14, fontWeight: 500, color: "#ffffff", borderRadius: 6, border: "none", cursor: "pointer", backgroundColor: B.navy, opacity: downloading ? 0.6 : 1, transition: "background-color 180ms ease" }}
          onMouseEnter={(e) => !downloading && (e.currentTarget.style.backgroundColor = B.purple)}
          onMouseLeave={(e) => !downloading && (e.currentTarget.style.backgroundColor = B.navy)}>
          {downloading ? "Generating PDF..." : "Download Report"}
        </button>
        <p style={{ ...T.body, color: B.light }}>A copy of this report will be sent to your email.</p>
      </div>

      <div className="print-footer hidden print:block">RunPayway™ Income Stability Assessment — Model RP-1.0 | Version 1.0</div>
    </div>
  );
}
