/* ------------------------------------------------------------------ */
/*  report-pdf.tsx — Vector PDF generation via jsPDF                   */
/*  RunPayway(TM) Income Stability Report (4 pages)                    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  DATA INTERFACE                                                     */
/* ------------------------------------------------------------------ */

export interface ReportPDFData {
  // Cover
  assessmentTitle: string;
  issuedDate: string;
  formalDate: string;
  finalScore: number;
  stabilityBand: string;
  bandColor: string;
  tier: string;
  coverBandDesc: string;
  accessCode: string;

  // Page 1 — Score & Diagnosis
  diagnosticSentence: string;
  plainEnglish: string;
  whyNotHigher?: string;
  dominantConstraintText: string;
  whatToChangeFirst: string;
  whatThatWouldDo: string;
  nextBandName: string | null;
  distanceToNext: number;
  bandDistance: string;
  bandDistanceText: string;
  score: number;
  pressureMap?: {
    operatingStructure: string;
    incomeModel: string;
    industry: string;
    pressure: string;
    tailwind: string;
    leverageMove: string;
  };

  // Page 2 — Income Structure
  killerLine: string;
  activeIncome: number;
  semiPersistentIncome: number;
  persistentIncome: number;
  riskScenarioScore: number;
  riskScenarioDrop: number;
  continuityDisplay: string;
  continuityText: string;
  riskSeverityText: string;
  rankedFactors: Array<{
    role: string;
    label: string;
    level: string;
    normalizedValue: number;
    explanation: string;
    roleColor: string;
    levelColor: string;
  }>;
  strongestSupports: string[];
  strongestSuppressors: string[];

  // Page 3 — Fragility & Pressure Test
  fragilityDiagnostic: string;
  scenarios: Array<{
    title: string;
    originalScore: number;
    scenarioScore: number;
    scoreDrop: number;
    narrative?: string;
    bandShift?: boolean;
    originalBand?: string;
    scenarioBand?: string;
  }>;
  fragilityLabel: string;
  fragilityText: string;
  fragilityColor: string;
  failureMode?: string;
  patternToWatch?: { pattern: string; consequence: string; reframe?: string };

  // Page 4 — Action Plan
  actionCategories: Array<{
    tag: string;
    tagColor: string;
    title: string;
    how: string;
    scoreChange: string;
  }>;
  combinedLift?: {
    projectedScore: number;
    lift: number;
    bandShift?: string;
    explanation?: string;
  };
  tradeoff?: {
    actionLabel: string;
    upside: string;
    downside: string;
    recommendation: string;
  };
  avoidActions: string[];
  roadmap: Array<{
    week: string;
    action: string;
    detail: string;
    target?: string;
  }>;
  reassessDate: string;
  reassessDaysLeft: number;
  reassessTiming: string;
  triggers: string[];
}

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                          */
/* ------------------------------------------------------------------ */

import type { jsPDF } from "jspdf";

const PAGE_W = 612;
const PAGE_H = 792;
const ML = 48;
const MR = 48;
const CW = 516;
const Y_START = 72;
const Y_LIMIT = 700;
const Y_FOOTER = 756;

/* ------------------------------------------------------------------ */
/*  SANITIZE — replace special chars before drawing                    */
/* ------------------------------------------------------------------ */

function sanitize(text: string): string {
  return text
    .replace(/\u2192/g, " to ")
    .replace(/\u2190/g, " to ")
    .replace(/\u2191/g, " up")
    .replace(/\u2193/g, " down")
    .replace(/\u2014/g, " - ")
    .replace(/\u2013/g, "-")
    .replace(/\u2018/g, "'")
    .replace(/\u2019/g, "'")
    .replace(/\u201C/g, '"')
    .replace(/\u201D/g, '"')
    .replace(/\u2122/g, "(TM)")
    .replace(/\u00B7/g, " - ")
    .replace(/\u2022/g, "-")
    .replace(/&amp;/g, "&")
    .replace(/&#8482;/g, "(TM)")
    .replace(/&middot;/g, " - ");
}

/* ------------------------------------------------------------------ */
/*  FONT LOADING                                                       */
/* ------------------------------------------------------------------ */

async function loadFonts(doc: jsPDF) {
  const files = [
    { vfsName: "Inter-Regular.ttf", fontName: "Inter", style: "normal" },
    { vfsName: "Inter-Medium.ttf", fontName: "Inter-Medium", style: "normal" },
    { vfsName: "Inter-SemiBold.ttf", fontName: "Inter-SemiBold", style: "normal" },
    { vfsName: "Inter-Bold.ttf", fontName: "Inter-Bold", style: "normal" },
  ];

  for (const f of files) {
    let resp: Response;
    try {
      resp = await fetch(`/RunPayway/fonts/${f.vfsName}`);
      if (!resp.ok) throw new Error();
    } catch {
      resp = await fetch(`/fonts/${f.vfsName}`);
    }
    const buf = await resp.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    doc.addFileToVFS(f.vfsName, base64);
    doc.addFont(f.vfsName, f.fontName, f.style);
  }
}

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function assertFitsOnPage(currentY: number, neededHeight: number, pageName: string) {
  if (currentY + neededHeight > Y_LIMIT) {
    throw new Error(
      `Page overflow on ${pageName}: y=${Math.round(currentY)}, need=${Math.round(neededHeight)}, limit=${Y_LIMIT}`
    );
  }
}

function drawCard(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  opts?: { bgColor?: string; borderLeftColor?: string; borderLeftWidth?: number }
) {
  const bg = opts?.bgColor || "#F8F6F1";
  doc.setFillColor(bg);
  doc.roundedRect(x, y, w, h, 3, 3, "F");

  doc.setDrawColor("#E8E5DE");
  doc.setLineWidth(0.5);
  doc.roundedRect(x, y, w, h, 3, 3, "S");

  if (opts?.borderLeftColor) {
    doc.setFillColor(opts.borderLeftColor);
    doc.rect(x, y + 2, opts.borderLeftWidth || 2.5, h - 4, "F");
  }
}

function drawFooter(doc: jsPDF, section: string, pageNum: number) {
  doc.setDrawColor("#E2E0DB");
  doc.setLineWidth(0.5);
  doc.line(ML, 740, ML + CW, 740);

  doc.setFont("Inter", "normal");
  doc.setFontSize(8);
  doc.setTextColor("#6B6155");
  doc.text(sanitize(`Confidential - ${section}`), ML, Y_FOOTER);

  doc.text(`Page ${pageNum} of 4`, PAGE_W / 2, Y_FOOTER, { align: "center" });

  doc.text("support@runpayway.com", ML + CW, Y_FOOTER, { align: "right" });
}

function drawHeader(doc: jsPDF) {
  doc.setFont("Inter-Bold", "normal");
  doc.setFontSize(8);
  doc.setTextColor("#0E1A2B");
  doc.text("RUNPAYWAY", ML, 40);
  const twW = doc.getTextWidth("RUNPAYWAY");
  doc.setFont("Inter", "normal");
  doc.setFontSize(8);
  doc.text("TM", ML + twW, 37);

  doc.setFont("Inter", "normal");
  doc.setFontSize(8);
  doc.setTextColor("#6B6155");
  doc.text("Income Stability Score  -  Model RP-2.0", ML + CW, 40, { align: "right" });

  doc.setDrawColor("#E2E0DB");
  doc.setLineWidth(0.5);
  doc.line(ML, 50, ML + CW, 50);
}

function drawWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number,
  opts?: {
    font?: string;
    style?: string;
    color?: string;
    lineHeight?: number;
    align?: "left" | "center" | "right";
  }
): number {
  doc.setFont(opts?.font || "Inter", opts?.style || "normal");
  doc.setFontSize(fontSize);
  doc.setTextColor(opts?.color || "#0E1A2B");
  const lh = opts?.lineHeight || 1.5;
  const lines = doc.splitTextToSize(sanitize(text), maxWidth);
  const lineSpacing = fontSize * lh;
  for (let i = 0; i < lines.length; i++) {
    const ly = y + i * lineSpacing;
    if (opts?.align) {
      const ax =
        opts.align === "center"
          ? x + maxWidth / 2
          : opts.align === "right"
            ? x + maxWidth
            : x;
      doc.text(lines[i], ax, ly, { align: opts.align });
    } else {
      doc.text(lines[i], x, ly);
    }
  }
  return y + lines.length * lineSpacing;
}

function measureWrappedHeight(
  doc: jsPDF,
  text: string,
  maxWidth: number,
  fontSize: number,
  font?: string,
  style?: string,
  lineHeight?: number
): number {
  doc.setFont(font || "Inter", style || "normal");
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(sanitize(text), maxWidth);
  return lines.length * fontSize * (lineHeight || 1.5);
}

/* ------------------------------------------------------------------ */
/*  PAGE 1 — COVER                                                     */
/* ------------------------------------------------------------------ */

function drawPage1Cover(doc: jsPDF, data: ReportPDFData) {
  let y = 140;

  // "RUNPAYWAY(TM)" centered
  doc.setFont("Inter-Bold", "normal");
  doc.setFontSize(11);
  doc.setTextColor("#0E1A2B");
  doc.text(sanitize("RUNPAYWAY"), PAGE_W / 2, y, { align: "center", charSpace: 2 });
  const rpW = doc.getTextWidth("RUNPAYWAY");
  doc.setFont("Inter", "normal");
  doc.setFontSize(7);
  doc.text("TM", PAGE_W / 2 + rpW / 2 + 2, y - 3);

  // Horizontal line
  y = 156;
  doc.setDrawColor("#E2E0DB");
  doc.setLineWidth(0.5);
  doc.line(PAGE_W / 2 - 90, y, PAGE_W / 2 + 90, y);

  // "Income Stability Report"
  y = 190;
  doc.setFont("Inter-Bold", "normal");
  doc.setFontSize(26);
  doc.setTextColor("#0E1A2B");
  doc.text(sanitize("Income Stability Report"), PAGE_W / 2, y, { align: "center" });

  // Subtitle
  y = 210;
  const subtitle = "A structural assessment of income resilience";
  y = drawWrappedText(doc, subtitle, PAGE_W / 2 - 200, y, 400, 10, {
    color: "#535D6B",
    align: "center",
  });

  // Assessment title (name)
  y = 250;
  doc.setFont("Inter-Medium", "normal");
  doc.setFontSize(18);
  doc.setTextColor("#0E1A2B");
  doc.text(sanitize(data.assessmentTitle), PAGE_W / 2, y, { align: "center" });

  // Formal date
  y = 266;
  doc.setFont("Inter", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor("#6B6155");
  doc.text(sanitize(data.formalDate), PAGE_W / 2, y, { align: "center" });

  // Score number
  y = 305;
  doc.setFont("Inter-Bold", "normal");
  doc.setFontSize(48);
  doc.setTextColor("#0E1A2B");
  doc.text(String(data.finalScore), PAGE_W / 2, y, { align: "center" });

  // "/100"
  y = 315;
  doc.setFont("Inter", "normal");
  doc.setFontSize(16);
  doc.setTextColor("#6B6155");
  const scoreW = doc.getTextWidth(String(data.finalScore));
  doc.setFont("Inter-Bold", "normal");
  doc.setFontSize(48);
  const scoreActualW = doc.getTextWidth(String(data.finalScore));
  doc.setFont("Inter", "normal");
  doc.setFontSize(16);
  doc.text("/100", PAGE_W / 2 + scoreActualW / 2 + 4, y);

  // Band color square + band name
  y = 338;
  doc.setFillColor(data.bandColor);
  doc.rect(PAGE_W / 2 - 50, y - 8, 5, 5, "F");
  doc.setFont("Inter-SemiBold", "normal");
  doc.setFontSize(13);
  doc.setTextColor(data.bandColor);
  doc.text(sanitize(data.stabilityBand), PAGE_W / 2 - 40, y);

  // Band description
  y = 358;
  drawWrappedText(doc, data.coverBandDesc, PAGE_W / 2 - 150, y, 300, 10, {
    color: "#535D6B",
    align: "center",
  });

  // Model line
  y = 400;
  doc.setFont("Inter", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor("#6B6155");
  doc.text(sanitize("Built from fixed structural questions under Model RP-2.0."), PAGE_W / 2, y, {
    align: "center",
  });

  // "STABILITY SIMULATOR(TM) ACCESS" overline
  y = 428;
  doc.setFont("Inter-Bold", "normal");
  doc.setFontSize(8);
  doc.setTextColor("#0E1A2B");
  doc.text(sanitize("STABILITY SIMULATOR(TM) ACCESS"), PAGE_W / 2, y, {
    align: "center",
    charSpace: 1,
  });

  // "Use this code at ..."
  y = 440;
  doc.setFont("Inter", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor("#535D6B");
  doc.text(sanitize("Use this code at runpayway.com/simulator"), PAGE_W / 2, y, {
    align: "center",
  });

  // Access code card
  y = 456;
  const codeText = sanitize(data.accessCode);
  doc.setFont("Courier", "normal");
  doc.setFontSize(7);
  const codeLines = doc.splitTextToSize(codeText, 380);
  const codeCardH = codeLines.length * 7 * 1.5 + 16;
  const codeCardX = PAGE_W / 2 - 200;
  drawCard(doc, codeCardX, y, 400, codeCardH);
  doc.setFont("Courier", "normal");
  doc.setFontSize(7);
  doc.setTextColor("#0E1A2B");
  for (let i = 0; i < codeLines.length; i++) {
    doc.text(codeLines[i], codeCardX + 10, y + 12 + i * 7 * 1.5);
  }

  // "Model RP-2.0 - 4 Pages" below card
  const afterCodeY = y + codeCardH + 24;
  doc.setFont("Inter", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor("#6B6155");
  doc.text(sanitize("Model RP-2.0 - 4 Pages"), PAGE_W / 2, afterCodeY, { align: "center" });

  drawFooter(doc, "Cover", 1);
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — SCORE & STRUCTURAL DIAGNOSIS                             */
/* ------------------------------------------------------------------ */

function drawPage2Score(doc: jsPDF, data: ReportPDFData) {
  drawHeader(doc);

  let y = Y_START;

  // Overline
  doc.setFont("Inter-Bold", "normal");
  doc.setFontSize(8);
  doc.setTextColor("#167B7D");
  doc.text(sanitize("INCOME STABILITY ASSESSMENT"), PAGE_W / 2, y, {
    align: "center",
    charSpace: 1.5,
  });

  // Assessment title
  y = 86;
  doc.setFont("Inter-Bold", "normal");
  doc.setFontSize(18);
  doc.setTextColor("#0E1A2B");
  doc.text(sanitize(data.assessmentTitle), PAGE_W / 2, y, { align: "center" });

  // Date + model
  y = 102;
  doc.setFont("Inter", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor("#6B6155");
  doc.text(sanitize(`${data.formalDate} - Model RP-2.0`), PAGE_W / 2, y, { align: "center" });

  // Score large
  y = 128;
  doc.setFont("Inter-Bold", "normal");
  doc.setFontSize(48);
  doc.setTextColor("#0E1A2B");
  doc.text(String(data.finalScore), PAGE_W / 2, y, { align: "center" });

  // "/100"
  y = 140;
  doc.setFont("Inter-Bold", "normal");
  doc.setFontSize(48);
  const sw2 = doc.getTextWidth(String(data.finalScore));
  doc.setFont("Inter", "normal");
  doc.setFontSize(16);
  doc.setTextColor("#6B6155");
  doc.text("/100", PAGE_W / 2 + sw2 / 2 + 4, y);

  // Band square + name
  y = 158;
  doc.setFillColor(data.bandColor);
  doc.rect(PAGE_W / 2 - 50, y - 8, 5, 5, "F");
  doc.setFont("Inter-SemiBold", "normal");
  doc.setFontSize(13);
  doc.setTextColor(data.bandColor);
  doc.text(sanitize(data.stabilityBand), PAGE_W / 2 - 40, y);

  // "X points from [Band]"
  y = 172;
  if (data.nextBandName) {
    doc.setFont("Inter", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor("#535D6B");
    doc.text(sanitize(`${data.distanceToNext} points from ${data.nextBandName}`), PAGE_W / 2, y, {
      align: "center",
    });
  }

  // Diagnostic sentence card
  y = 192;
  const diagH = measureWrappedHeight(doc, data.diagnosticSentence, CW - 32, 12, "Inter-Medium") + 20;
  assertFitsOnPage(y, diagH, "P2-diagnostic");
  drawCard(doc, ML, y, CW, diagH, { borderLeftColor: "#0E1A2B" });
  drawWrappedText(doc, data.diagnosticSentence, ML + 16, y + 14, CW - 32, 12, {
    font: "Inter-Medium",
    color: "#0E1A2B",
  });
  y += diagH + 12;

  // IN PLAIN ENGLISH card
  const peBodyH = measureWrappedHeight(doc, data.plainEnglish, CW - 32, 10.5) + 32;
  const peWhyH = data.whyNotHigher
    ? measureWrappedHeight(doc, `Why not higher: ${data.whyNotHigher}`, CW - 32, 9) + 8
    : 0;
  const peCardH = peBodyH + peWhyH;
  assertFitsOnPage(y, peCardH, "P2-plainEnglish");
  drawCard(doc, ML, y, CW, peCardH);
  const peInnerY = y + 12;
  doc.setFont("Inter-Bold", "normal");
  doc.setFontSize(8);
  doc.setTextColor("#6B6155");
  doc.text(sanitize("IN PLAIN ENGLISH"), ML + 12, peInnerY);
  let peTextY = peInnerY + 14;
  peTextY = drawWrappedText(doc, data.plainEnglish, ML + 12, peTextY, CW - 32, 10.5, {
    color: "#0E1A2B",
  });
  if (data.whyNotHigher) {
    peTextY += 4;
    drawWrappedText(doc, `Why not higher: ${data.whyNotHigher}`, ML + 12, peTextY, CW - 32, 9, {
      color: "#535D6B",
    });
  }
  y += peCardH + 12;

  // BIGGEST CONSTRAINT card
  const constraintTextH = measureWrappedHeight(doc, data.dominantConstraintText, CW - 32, 10.5);
  const changeH = measureWrappedHeight(doc, data.whatToChangeFirst, CW / 2 - 32, 10);
  const doH = measureWrappedHeight(doc, data.whatThatWouldDo, CW / 2 - 32, 10);
  const colH = Math.max(changeH + 24, doH + 24);
  const constraintCardH = 28 + constraintTextH + 8 + colH + 12;
  assertFitsOnPage(y, constraintCardH, "P2-constraint");
  drawCard(doc, ML, y, CW, constraintCardH, {
    borderLeftColor: "#7C5CBA",
    borderLeftWidth: 2.5,
  });
  let cy = y + 12;
  doc.setFont("Inter-Bold", "normal");
  doc.setFontSize(8);
  doc.setTextColor("#7C5CBA");
  doc.text(sanitize("THE SINGLE BIGGEST THING HOLDING YOUR SCORE DOWN"), ML + 12, cy);
  cy += 16;
  cy = drawWrappedText(doc, data.dominantConstraintText, ML + 12, cy, CW - 32, 10.5, {
    color: "#0E1A2B",
  });
  cy += 8;

  // Two columns
  const colW = (CW - 44) / 2;
  const leftX = ML + 12;
  const rightX = ML + 12 + colW + 20;

  doc.setFont("Inter-SemiBold", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor("#6B6155");
  doc.text(sanitize("What to change first"), leftX, cy);
  doc.text(sanitize("What that would do"), rightX, cy);
  cy += 12;
  drawWrappedText(doc, data.whatToChangeFirst, leftX, cy, colW, 10, { color: "#0E1A2B" });
  drawWrappedText(doc, data.whatThatWouldDo, rightX, cy, colW, 10, { color: "#0E1A2B" });
  y += constraintCardH + 12;

  // HOW FAR FROM STRONGER STABILITY card
  if (data.nextBandName) {
    const distCardH = 80;
    assertFitsOnPage(y, distCardH, "P2-distance");
    drawCard(doc, ML, y, CW, distCardH);
    let dy = y + 12;
    doc.setFont("Inter-Bold", "normal");
    doc.setFontSize(8);
    doc.setTextColor("#167B7D");
    doc.text(sanitize("HOW FAR FROM STRONGER STABILITY"), ML + 12, dy);
    dy += 20;

    // Large number
    doc.setFont("Inter-Bold", "normal");
    doc.setFontSize(22);
    doc.setTextColor("#0E1A2B");
    doc.text(String(data.distanceToNext), ML + 12, dy);
    const numW = doc.getTextWidth(String(data.distanceToNext));
    doc.setFont("Inter", "normal");
    doc.setFontSize(10);
    doc.setTextColor("#0E1A2B");
    doc.text(sanitize(` points to ${data.nextBandName}`), ML + 12 + numW, dy);
    dy += 16;

    // Progress bar
    const barW = CW - 24;
    const fillPct = Math.min(1, data.score / 100);
    doc.setFillColor(data.bandColor);
    doc.roundedRect(ML + 12, dy, barW * fillPct, 4, 2, 2, "F");
    doc.setFillColor("#E2E0DB");
    doc.roundedRect(ML + 12 + barW * fillPct, dy, barW * (1 - fillPct), 4, 2, 2, "F");
    dy += 12;

    // Distance text
    doc.setFont("Inter", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor("#535D6B");
    doc.text(sanitize(data.bandDistanceText), ML + 12, dy);

    y += distCardH + 12;
  }

  drawFooter(doc, "Score & Diagnosis", 2);
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — PRESSUREMAP + INCOME STRUCTURE                           */
/* ------------------------------------------------------------------ */

function drawPage3Income(doc: jsPDF, data: ReportPDFData) {
  drawHeader(doc);

  let y = Y_START;

  // PressureMap section (if exists)
  if (data.pressureMap) {
    doc.setFont("Inter-Bold", "normal");
    doc.setFontSize(8);
    doc.setTextColor("#167B7D");
    doc.text(sanitize("PRESSUREMAP(TM)"), ML, y, { charSpace: 1 });
    y += 14;

    // Context line
    const ctx = `${data.pressureMap.operatingStructure} - ${data.pressureMap.incomeModel} - ${data.pressureMap.industry}`;
    doc.setFont("Inter", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor("#535D6B");
    doc.text(sanitize(ctx), ML, y);
    y += 16;

    // Pressure sub-card
    const pressureH = measureWrappedHeight(doc, data.pressureMap.pressure, CW - 24, 9.5) + 24;
    assertFitsOnPage(y, pressureH, "P3-pressure");
    drawCard(doc, ML, y, CW, pressureH, { borderLeftColor: "#9B2C2C", borderLeftWidth: 2 });
    doc.setFont("Inter-Bold", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor("#9B2C2C");
    doc.text(sanitize("WHAT IS MOST LIKELY TO DISRUPT YOU RIGHT NOW"), ML + 12, y + 12);
    drawWrappedText(doc, data.pressureMap.pressure, ML + 12, y + 24, CW - 24, 9.5, {
      color: "#0E1A2B",
    });
    y += pressureH + 12;

    // Tailwind sub-card
    const tailwindH = measureWrappedHeight(doc, data.pressureMap.tailwind, CW - 24, 9.5) + 24;
    assertFitsOnPage(y, tailwindH, "P3-tailwind");
    drawCard(doc, ML, y, CW, tailwindH, { borderLeftColor: "#167B7D", borderLeftWidth: 2 });
    doc.setFont("Inter-Bold", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor("#167B7D");
    doc.text(sanitize("WHAT IS WORKING IN YOUR FAVOR"), ML + 12, y + 12);
    drawWrappedText(doc, data.pressureMap.tailwind, ML + 12, y + 24, CW - 24, 9.5, {
      color: "#0E1A2B",
    });
    y += tailwindH + 12;

    // Leverage sub-card
    const leverageH = measureWrappedHeight(doc, data.pressureMap.leverageMove, CW - 24, 9.5) + 24;
    assertFitsOnPage(y, leverageH, "P3-leverage");
    drawCard(doc, ML, y, CW, leverageH, { borderLeftColor: "#7C5CBA", borderLeftWidth: 2 });
    doc.setFont("Inter-Bold", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor("#7C5CBA");
    doc.text(sanitize("HIGHEST-LEVERAGE MOVE RIGHT NOW"), ML + 12, y + 12);
    drawWrappedText(doc, data.pressureMap.leverageMove, ML + 12, y + 24, CW - 24, 9.5, {
      color: "#0E1A2B",
    });
    y += leverageH + 8;

    // Footnote
    doc.setFont("Inter", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor("#6B6155");
    doc.text(sanitize("PressureMap reflects structural inputs only and is not financial advice."), ML, y);
    y += 16;

    // Divider
    doc.setDrawColor("#E2E0DB");
    doc.setLineWidth(0.5);
    doc.line(ML, y, ML + CW, y);
    y += 16;
  }

  // Killer line card
  const klH = measureWrappedHeight(doc, data.killerLine, CW - 32, 10.5, "Inter-Medium") + 20;
  assertFitsOnPage(y, klH, "P3-killerLine");
  drawCard(doc, ML, y, CW, klH, { borderLeftColor: "#0E1A2B" });
  drawWrappedText(doc, data.killerLine, ML + 16, y + 14, CW - 32, 10.5, {
    font: "Inter-Medium",
    color: "#0E1A2B",
    align: "center",
  });
  y += klH + 16;

  // "HOW YOUR INCOME ACTUALLY WORKS"
  doc.setFont("Inter-Bold", "normal");
  doc.setFontSize(14);
  doc.setTextColor("#0E1A2B");
  doc.text(sanitize("HOW YOUR INCOME ACTUALLY WORKS"), ML, y);
  y += 12;
  doc.setFont("Inter", "normal");
  doc.setFontSize(9);
  doc.setTextColor("#535D6B");
  doc.text(sanitize("A breakdown of persistence, structural risk, and continuity"), ML, y);
  y += 16;

  // Three-segment bar
  const barY = y;
  const barH = 5;
  const barW = CW;
  const activeW = barW * (data.activeIncome / 100);
  const semiW = barW * (data.semiPersistentIncome / 100);
  const persistW = barW * (data.persistentIncome / 100);

  if (activeW > 0) {
    doc.setFillColor("#0E1A2B");
    doc.roundedRect(ML, barY, activeW, barH, 2, 2, "F");
  }
  if (semiW > 0) {
    doc.setFillColor("#6B6155");
    doc.rect(ML + activeW, barY, semiW, barH, "F");
  }
  if (persistW > 0) {
    doc.setFillColor("#167B7D");
    doc.roundedRect(ML + activeW + semiW, barY, persistW, barH, 2, 2, "F");
  }
  y = barY + barH + 12;

  // Legend rows
  const legendItems = [
    { color: "#0E1A2B", label: `${data.activeIncome}% - Active income. Stops when work stops.` },
    { color: "#6B6155", label: `${data.semiPersistentIncome}% - Semi-persistent income. Continues for a limited period.` },
    { color: "#167B7D", label: `${data.persistentIncome}% - Persistent income. Continues regardless of immediate daily work.` },
  ];
  for (const item of legendItems) {
    doc.setFillColor(item.color);
    doc.rect(ML, y - 6, 8, 8, "F");
    doc.setFont("Inter", "normal");
    doc.setFontSize(9);
    doc.setTextColor("#0E1A2B");
    doc.text(sanitize(item.label), ML + 14, y);
    y += 14;
  }
  y += 8;

  // Two cards: risk scenario + continuity
  const cardW = (CW - 12) / 2;
  const riskCardH = 64;
  assertFitsOnPage(y, riskCardH, "P3-riskCards");

  // Left: if biggest source goes away
  drawCard(doc, ML, y, cardW, riskCardH);
  doc.setFont("Inter-Bold", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor("#6B6155");
  doc.text(sanitize("IF YOUR BIGGEST SOURCE GOES AWAY"), ML + 10, y + 14);
  doc.setFont("Inter-Bold", "normal");
  doc.setFontSize(18);
  doc.setTextColor("#0E1A2B");
  doc.text(`${data.score} to ${data.riskScenarioScore}`, ML + 10, y + 36, { align: "left" });
  doc.setFont("Inter", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor("#535D6B");
  doc.text(sanitize(data.riskSeverityText), ML + 10, y + 52);

  // Right: if you stop working
  const rightCardX = ML + cardW + 12;
  drawCard(doc, rightCardX, y, cardW, riskCardH);
  doc.setFont("Inter-Bold", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor("#6B6155");
  doc.text(sanitize("IF YOU STOP WORKING ENTIRELY"), rightCardX + 10, y + 14);
  doc.setFont("Inter-Bold", "normal");
  doc.setFontSize(18);
  doc.setTextColor("#0E1A2B");
  doc.text(sanitize(data.continuityDisplay), rightCardX + 10, y + 36);
  doc.setFont("Inter", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor("#535D6B");
  doc.text(sanitize(data.continuityText), rightCardX + 10, y + 52);
  y += riskCardH + 16;

  // Divider
  doc.setDrawColor("#E2E0DB");
  doc.setLineWidth(0.5);
  doc.line(ML, y, ML + CW, y);
  y += 12;

  // Factor cards (strongest/weakest) — show top 2 of each
  const strongest = data.rankedFactors.filter((f) => f.role === "Strongest Support").slice(0, 2);
  const weakest = data.rankedFactors.filter((f) => f.role === "Strongest Suppressor").slice(0, 2);
  const factors = [...strongest, ...weakest].slice(0, 3);

  for (const factor of factors) {
    const expH = measureWrappedHeight(doc, factor.explanation, CW - 32, 8.5);
    const fCardH = 40 + expH;
    assertFitsOnPage(y, fCardH, "P3-factor");
    drawCard(doc, ML, y, CW, fCardH, { borderLeftColor: factor.roleColor, borderLeftWidth: 2.5 });
    let fy = y + 10;
    doc.setFont("Inter", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor("#6B6155");
    doc.text(sanitize(factor.role.toUpperCase()), ML + 12, fy);
    fy += 12;
    doc.setFont("Inter-SemiBold", "normal");
    doc.setFontSize(10);
    doc.setTextColor("#0E1A2B");
    doc.text(sanitize(factor.label), ML + 12, fy);
    const labelW = doc.getTextWidth(sanitize(factor.label));
    doc.setFont("Inter", "normal");
    doc.setFontSize(9);
    doc.setTextColor(factor.levelColor);
    doc.text(sanitize(` - ${factor.level}`), ML + 12 + labelW, fy);
    fy += 10;

    // Progress bar
    const pbW = CW - 24;
    doc.setFillColor(factor.roleColor);
    doc.roundedRect(ML + 12, fy, pbW * factor.normalizedValue, 3, 1.5, 1.5, "F");
    doc.setFillColor("#E2E0DB");
    doc.roundedRect(
      ML + 12 + pbW * factor.normalizedValue,
      fy,
      pbW * (1 - factor.normalizedValue),
      3,
      1.5,
      1.5,
      "F"
    );
    fy += 8;

    drawWrappedText(doc, factor.explanation, ML + 12, fy, CW - 32, 8.5, { color: "#535D6B" });
    y += fCardH + 8;
  }
  y += 4;

  // Two columns: Working vs Holding Back
  const supColW = (CW - 16) / 2;
  const maxItems = Math.max(data.strongestSupports.length, data.strongestSuppressors.length);
  const listCardH = 20 + maxItems * 13;
  if (y + listCardH <= Y_LIMIT) {
    // Left: What's Working
    drawCard(doc, ML, y, supColW, listCardH);
    doc.setFont("Inter-Bold", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor("#167B7D");
    doc.text(sanitize("WHAT'S WORKING"), ML + 10, y + 12);
    let ly = y + 24;
    for (const item of data.strongestSupports.slice(0, 4)) {
      doc.setFont("Inter", "normal");
      doc.setFontSize(9);
      doc.setTextColor("#0E1A2B");
      doc.text(sanitize(`- ${item}`), ML + 10, ly);
      ly += 13;
    }

    // Right: Holding Back
    const rbX = ML + supColW + 16;
    drawCard(doc, rbX, y, supColW, listCardH);
    doc.setFont("Inter-Bold", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor("#9B2C2C");
    doc.text(sanitize("WHAT'S HOLDING YOU BACK"), rbX + 10, y + 12);
    ly = y + 24;
    for (const item of data.strongestSuppressors.slice(0, 4)) {
      doc.setFont("Inter", "normal");
      doc.setFontSize(9);
      doc.setTextColor("#0E1A2B");
      doc.text(sanitize(`- ${item}`), rbX + 10, ly);
      ly += 13;
    }
  }

  drawFooter(doc, "Income Structure", 3);
}

/* ------------------------------------------------------------------ */
/*  PAGE 4 — FRAGILITY + ACTION PLAN                                   */
/* ------------------------------------------------------------------ */

function drawPage4Actions(doc: jsPDF, data: ReportPDFData) {
  drawHeader(doc);

  let y = Y_START;

  // FRAGILITY diagnostic sentence
  const fragDiagH = measureWrappedHeight(doc, data.fragilityDiagnostic, CW - 32, 10, "Inter-Medium") + 16;
  assertFitsOnPage(y, fragDiagH, "P4-fragDiag");
  drawCard(doc, ML, y, CW, fragDiagH, { borderLeftColor: "#0E1A2B" });
  drawWrappedText(doc, data.fragilityDiagnostic, ML + 14, y + 12, CW - 32, 10, {
    font: "Inter-Medium",
    color: "#0E1A2B",
  });
  y += fragDiagH + 8;

  // Top 4 scenarios (compact)
  const scenariosToShow = data.scenarios.slice(0, 4);
  const borderColors = ["#9B2C2C", "#92640A", "#E2E0DB", "#E2E0DB"];
  for (let i = 0; i < scenariosToShow.length; i++) {
    const sc = scenariosToShow[i];
    const bandShiftNote = sc.bandShift ? `This would move the structure from ${sc.originalBand} to ${sc.scenarioBand}.` : "";
    const narrativeText = [sc.narrative, bandShiftNote].filter(Boolean).join(" ");
    const hasExtra = narrativeText.length > 0;
    const extraH = hasExtra ? measureWrappedHeight(doc, narrativeText, CW - 32, 8) : 0;
    const scH = 28 + (hasExtra ? extraH + 4 : 0);
    assertFitsOnPage(y, scH, `P4-scenario-${i}`);
    drawCard(doc, ML, y, CW, scH, { borderLeftColor: borderColors[i] || "#E2E0DB", borderLeftWidth: 2 });

    doc.setFont("Inter-SemiBold", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor("#0E1A2B");
    doc.text(sanitize(sc.title), ML + 12, y + 12);

    const scoreText = `${sc.originalScore} to ${sc.scenarioScore}`;
    doc.setFont("Inter", "normal");
    doc.setFontSize(9);
    doc.setTextColor("#535D6B");
    doc.text(sanitize(scoreText), ML + CW - 12, y + 12, { align: "right" });

    doc.setFont("Inter", "normal");
    doc.setFontSize(8);
    doc.setTextColor("#535D6B");
    doc.text(sanitize(`Decrease of ${sc.scoreDrop} points`), ML + CW - 12, y + 22, { align: "right" });

    if (hasExtra) {
      drawWrappedText(doc, narrativeText, ML + 12, y + 26, CW - 32, 8, { color: "#535D6B" });
    }
    y += scH + 6;
  }

  // Absorbency section
  doc.setFont("Inter-Bold", "normal");
  doc.setFontSize(8);
  doc.setTextColor("#6B6155");
  doc.text(sanitize("HOW MUCH CAN YOUR INCOME ABSORB?"), ML, y, { charSpace: 0.5 });
  y += 14;
  doc.setFont("Inter-SemiBold", "normal");
  doc.setFontSize(10);
  doc.setTextColor(data.fragilityColor);
  doc.text(sanitize(data.fragilityLabel), ML, y);
  y += 12;
  const fragTextH = measureWrappedHeight(doc, data.fragilityText, CW, 9);
  drawWrappedText(doc, data.fragilityText, ML, y, CW, 9, { color: "#535D6B" });
  y += fragTextH;
  if (data.failureMode) {
    y += 4;
    doc.setFont("Inter", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor("#535D6B");
    doc.text(sanitize(`Failure mode: ${data.failureMode}.`), ML, y);
    y += 12;
  } else {
    y += 8;
  }

  // Divider
  doc.setDrawColor("#E2E0DB");
  doc.setLineWidth(0.5);
  doc.line(ML, y, ML + CW, y);
  y += 12;

  // ACTION PLAN
  doc.setFont("Inter-Bold", "normal");
  doc.setFontSize(8);
  doc.setTextColor("#167B7D");
  doc.text(sanitize("HIGHEST-LEVERAGE ACTIONS"), ML, y, { charSpace: 1 });
  y += 14;

  // Action cards (max 2)
  const actionsToShow = data.actionCategories.slice(0, 2);
  for (const action of actionsToShow) {
    const howH = measureWrappedHeight(doc, action.how, CW - 32, 8.5);
    const aCardH = 36 + howH;
    assertFitsOnPage(y, aCardH, "P4-action");
    drawCard(doc, ML, y, CW, aCardH);

    let ay = y + 10;
    doc.setFont("Inter-Bold", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(action.tagColor);
    doc.text(sanitize(action.tag.toUpperCase()), ML + 12, ay);
    ay += 12;
    doc.setFont("Inter-SemiBold", "normal");
    doc.setFontSize(10);
    doc.setTextColor("#0E1A2B");
    doc.text(sanitize(action.title), ML + 12, ay);
    ay += 12;
    ay = drawWrappedText(doc, action.how, ML + 12, ay, CW - 32, 8.5, { color: "#535D6B" });
    doc.setFont("Inter", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor("#167B7D");
    doc.text(sanitize(action.scoreChange), ML + 12, ay + 2);

    y += aCardH + 8;
  }

  // COMBINED STRUCTURAL EFFECT
  if (data.combinedLift) {
    doc.setFont("Inter-Bold", "normal");
    doc.setFontSize(8);
    doc.setTextColor("#167B7D");
    doc.text(sanitize("COMBINED STRUCTURAL EFFECT"), ML, y, { charSpace: 0.5 });
    y += 12;
    doc.setFont("Inter-SemiBold", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor("#0E1A2B");
    doc.text(sanitize(`Projected score: ${data.combinedLift.projectedScore} (+${data.combinedLift.lift} points)`), ML, y);
    y += 12;
    if (data.combinedLift.explanation) {
      drawWrappedText(doc, data.combinedLift.explanation, ML, y, CW, 8.5, { color: "#535D6B" });
      y += measureWrappedHeight(doc, data.combinedLift.explanation, CW, 8.5) + 4;
    }
    if (data.combinedLift.bandShift) {
      doc.setFont("Inter-SemiBold", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor("#4B3FAE");
      doc.text(sanitize(`Band shift: ${data.combinedLift.bandShift}`), ML, y);
      y += 12;
    }
    y += 4;
  }

  // Tradeoff section (if exists)
  if (data.tradeoff) {
    const tColW = (CW - 44) / 2;
    const upsideH = measureWrappedHeight(doc, data.tradeoff.upside, tColW, 8);
    const costH = measureWrappedHeight(doc, data.tradeoff.downside, tColW, 8);
    const recH = measureWrappedHeight(doc, data.tradeoff.recommendation, CW - 32, 8.5);
    const tradeoffH = 28 + Math.max(upsideH, costH) + 8 + recH + 16;
    assertFitsOnPage(y, tradeoffH, "P4-tradeoff");
    drawCard(doc, ML, y, CW, tradeoffH);
    let ty = y + 10;
    doc.setFont("Inter-SemiBold", "normal");
    doc.setFontSize(9);
    doc.setTextColor("#0E1A2B");
    doc.text(sanitize(data.tradeoff.actionLabel), ML + 12, ty);
    ty += 14;

    doc.setFont("Inter-Bold", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor("#167B7D");
    doc.text("UPSIDE", ML + 12, ty);
    doc.setTextColor("#92640A");
    doc.text("COST", ML + 12 + tColW + 20, ty);
    ty += 10;
    drawWrappedText(doc, data.tradeoff.upside, ML + 12, ty, tColW, 8, { color: "#535D6B" });
    drawWrappedText(doc, data.tradeoff.downside, ML + 12 + tColW + 20, ty, tColW, 8, { color: "#535D6B" });
    ty += Math.max(upsideH, costH) + 8;

    // Divider inside card
    doc.setDrawColor("#E2E0DB");
    doc.setLineWidth(0.5);
    doc.line(ML + 12, ty - 4, ML + CW - 12, ty - 4);

    drawWrappedText(doc, data.tradeoff.recommendation, ML + 12, ty, CW - 32, 8.5, {
      font: "Inter-SemiBold",
      color: "#0E1A2B",
    });

    y += tradeoffH + 8;
  }

  // 30-DAY ROADMAP
  doc.setFont("Inter-Bold", "normal");
  doc.setFontSize(8);
  doc.setTextColor("#7C5CBA");
  doc.text(sanitize("30-DAY ROADMAP"), ML, y, { charSpace: 1 });
  y += 12;

  for (const row of data.roadmap.slice(0, 4)) {
    const detailH = measureWrappedHeight(doc, row.detail, CW - 80, 8);
    const rowH = Math.max(16, 12 + detailH);
    assertFitsOnPage(y, rowH, "P4-roadmap");

    doc.setFont("Inter-Bold", "normal");
    doc.setFontSize(8);
    doc.setTextColor("#7C5CBA");
    doc.text(sanitize(row.week), ML, y);

    doc.setFont("Inter-SemiBold", "normal");
    doc.setFontSize(9);
    doc.setTextColor("#0E1A2B");
    doc.text(sanitize(row.action), ML + 60, y);
    drawWrappedText(doc, row.detail, ML + 60, y + 10, CW - 80, 8, { color: "#535D6B" });
    if (row.target) {
      doc.setFont("Inter", "normal");
      doc.setFontSize(8);
      doc.setTextColor("#167B7D");
      doc.text(sanitize(row.target), ML + 60, y + 10 + detailH + 2);
    }
    y += rowH + 6;
  }
  y += 6;

  // WHEN TO RETAKE
  doc.setFont("Inter-Bold", "normal");
  doc.setFontSize(8);
  doc.setTextColor("#6B6155");
  doc.text(sanitize("WHEN TO RETAKE"), ML, y, { charSpace: 1 });
  y += 12;

  doc.setFont("Inter-SemiBold", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor("#0E1A2B");
  doc.text(sanitize(data.reassessDate), ML, y);
  y += 10;
  doc.setFont("Inter", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor("#535D6B");
  doc.text(sanitize(`${data.reassessDaysLeft} days from now - ${data.reassessTiming}`), ML, y);
  y += 16;

  // Fine print
  const finePrint =
    "This report was generated by RunPayway(TM) Model RP-2.0. It reflects structural inputs only and does not constitute " +
    "financial, legal, or investment advice. Scores are deterministic: the same answers always produce the same score. No external data is used.";
  const fpH = measureWrappedHeight(doc, finePrint, CW, 7.5);
  if (y + fpH <= Y_LIMIT) {
    drawWrappedText(doc, finePrint, ML, y, CW, 7.5, { color: "#6B6155", lineHeight: 1.4 });
  }

  drawFooter(doc, "Action Plan", 4);
}

/* ------------------------------------------------------------------ */
/*  MAIN EXPORT                                                        */
/* ------------------------------------------------------------------ */

export async function generateReportPDF(data: ReportPDFData): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "portrait" });

  await loadFonts(doc);

  // PAGE 1 - COVER
  drawPage1Cover(doc, data);

  // PAGE 2 - SCORE & DIAGNOSIS
  doc.addPage();
  drawPage2Score(doc, data);

  // PAGE 3 - INCOME STRUCTURE + PRESSUREMAP
  doc.addPage();
  drawPage3Income(doc, data);

  // PAGE 4 - FRAGILITY + ACTION PLAN
  doc.addPage();
  drawPage4Actions(doc, data);

  // Verify exactly 4 pages
  const pageCount = doc.getNumberOfPages();
  if (pageCount !== 4) {
    throw new Error(`Expected 4 pages, got ${pageCount}`);
  }

  return doc.output("blob");
}
