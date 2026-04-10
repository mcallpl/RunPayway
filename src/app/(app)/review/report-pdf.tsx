/* ================================================================== */
/*  report-pdf.tsx — Fixed 4-page print document                      */
/*  jsPDF absolute coordinates, measured text, hard overflow failure   */
/*  RunPayway(TM) Dashboard · Income Stability Report · RP-2.0      */
/* ================================================================== */

export interface ReportPDFData {
  assessmentTitle: string;
  issuedDate: string;
  formalDate: string;
  finalScore: number;
  stabilityBand: string;
  bandColor: string;
  tier: string;
  coverBandDesc: string;
  accessCode: string;
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
    role: string; label: string; level: string;
    normalizedValue: number; explanation: string;
    roleColor: string; levelColor: string;
  }>;
  strongestSupports: string[];
  strongestSuppressors: string[];
  fragilityDiagnostic: string;
  scenarios: Array<{
    title: string; originalScore: number; scenarioScore: number;
    scoreDrop: number; narrative?: string; bandShift?: boolean;
    originalBand?: string; scenarioBand?: string;
  }>;
  fragilityLabel: string;
  fragilityText: string;
  fragilityColor: string;
  failureMode?: string;
  patternToWatch?: { pattern: string; consequence: string; reframe?: string };
  actionCategories: Array<{
    tag: string; tagColor: string; title: string;
    how: string; scoreChange: string;
  }>;
  combinedLift?: {
    projectedScore: number; lift: number;
    bandShift?: string; explanation?: string;
    progressText?: string;
  };
  tradeoff?: {
    actionLabel: string; upside: string;
    downside: string; recommendation: string;
  };
  avoidActions: string[];
  roadmap: Array<{
    week: string; action: string;
    detail: string; target?: string;
  }>;
  reassessDate: string;
  reassessDaysLeft: number;
  reassessTiming: string;
  triggers: string[];
  vocabulary?: {
    scenarios: Record<string, string>;
    constraints: Record<string, string>;
    nouns: Record<string, string>;
    actions: Record<string, string>;
  };
}

/* ================================================================== */
/*  CONSTANTS                                                          */
/* ================================================================== */

import type { jsPDF } from "jspdf";
// QR code removed for RP-2.0

const W = 612;
const ML = 48;
const CW = 516;
const Y0 = 72;
const YL = 700;
const YF = 756;
const CX = W / 2; // center x

/* ================================================================== */
/*  SANITIZE                                                           */
/* ================================================================== */

function S(t: string): string {
  return (t || "")
    .replace(/\u2192|\u2190/g, " to ")
    .replace(/\u2191/g, " up").replace(/\u2193/g, " down")
    .replace(/\u2014/g, " - ").replace(/\u2013/g, "-")
    .replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2122/g, "(TM)").replace(/\u00B7/g, " - ")
    .replace(/\u2022/g, "-").replace(/&#8482;/g, "(TM)")
    .replace(/&amp;/g, "&").replace(/&middot;/g, " - ");
}

/* ================================================================== */
/*  FONT LOADING                                                       */
/* ================================================================== */

let fontsLoaded = false;

async function loadFonts(doc: jsPDF) {
  const fonts = [
    { file: "Inter-Regular.ttf", name: "Inter", style: "normal" },
    { file: "Inter-Medium.ttf", name: "InterM", style: "normal" },
    { file: "Inter-SemiBold.ttf", name: "InterSB", style: "normal" },
    { file: "Inter-Bold.ttf", name: "InterB", style: "normal" },
  ];
  try {
    for (const f of fonts) {
      let r: Response;
      try { r = await fetch(`/RunPayway/fonts/${f.file}`); if (!r.ok) throw 0; }
      catch { r = await fetch(`/fonts/${f.file}`); }
      const b = new Uint8Array(await r.arrayBuffer());
      let s = ""; for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
      doc.addFileToVFS(f.file, btoa(s));
      doc.addFont(f.file, f.name, f.style);
    }
    fontsLoaded = true;
  } catch (e) {
    console.error("Font loading failed, using Helvetica fallback:", e);
    fontsLoaded = false;
  }
}

/** Safe font setter — falls back to Helvetica if Inter not loaded */
function sf(doc: jsPDF, font: string) {
  if (fontsLoaded) {
    doc.setFont(font, "normal");
  } else {
    const style = font === "InterB" || font === "InterSB" ? "bold" : "normal";
    doc.setFont("helvetica", style);
  }
}

/* ================================================================== */
/*  HELPERS: truncate, cleanTitle, cleanConstraint                     */
/* ================================================================== */

/** Truncate at last word boundary before maxChars */
function truncate(text: string, maxChars: number): string {
  const clean = S(text);
  if (clean.length <= maxChars) return clean;
  const cut = clean.substring(0, maxChars);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > maxChars * 0.6 ? cut.substring(0, lastSpace) : cut) + "...";
}

/** Map backend scenario titles to plain English, with optional industry vocabulary */
function cleanTitle(title: string, vocabScenarios?: Record<string, string>): string {
  // If vocabulary scenarios are available, try to match against them first
  if (vocabScenarios) {
    const titleLower = title.toLowerCase();
    const vocabMap: Record<string, string> = {
      "lose_top_client": "Client Concentration Loss|Key Client Loss|Contract Non Renewal",
      "cant_work_90_days": "Active Labor Interrupted",
      "market_slowdown": "Market Contraction|Seasonal Revenue Gap|Pricing Pressure",
      "pipeline_dries_up": "Referral Pipeline Dries|Recurring Stream Degrades",
    };
    for (const [vocabKey, patterns] of Object.entries(vocabMap)) {
      if (vocabScenarios[vocabKey]) {
        for (const pattern of patterns.split("|")) {
          if (titleLower.includes(pattern.toLowerCase().split(" ")[0])) {
            return vocabScenarios[vocabKey];
          }
        }
      }
    }
  }

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
  // Check exact match first
  if (map[title]) return map[title];
  // Check partial match
  for (const [key, val] of Object.entries(map)) {
    if (title.toLowerCase().includes(key.toLowerCase().split(" ")[0])) return val;
  }
  // Clean up camelCase/snake_case
  return title.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2");
}

/** Clean raw constraint field names into readable text */
function cleanConstraint(text: string): string {
  return text
    .replace(/-?\d+\s*labor[_\s]dependence[_\s]?%?/gi, "Reduce labor dependence by 15 percentage points")
    .replace(/-?\d+\s*income[_\s]persistence[_\s]?%?/gi, "Increase recurring income by 15 percentage points")
    .replace(/-?\d+\s*largest[_\s]source[_\s]?%?/gi, "Reduce largest source concentration")
    .replace(/-?\d+\s*forward[_\s]secured[_\s]?%?/gi, "Increase forward visibility")
    .replace(/labor_dependence_pct/gi, "labor dependence")
    .replace(/income_persistence_pct/gi, "recurring income")
    .replace(/largest_source_pct/gi, "largest source share")
    .replace(/forward_secured_pct/gi, "forward visibility")
    .replace(/source_diversity_count/gi, "number of income sources");
}

/* ================================================================== */
/*  PRIMITIVES                                                         */
/* ================================================================== */

/** Measure wrapped text height in pt */
function mh(doc: jsPDF, text: string, w: number, sz: number, font = "Inter", lh = 1.45): number {
  sf(doc, font); doc.setFontSize(sz);
  return doc.splitTextToSize(S(text), w).length * sz * lh;
}

/** Draw wrapped text, return NEXT y. maxLines caps rendered lines. */
function dt(doc: jsPDF, text: string, x: number, y: number, w: number, sz: number,
  opts?: { font?: string; color?: string; lh?: number; align?: "left"|"center"|"right"; maxLines?: number }): number {
  const font = opts?.font || "Inter";
  const color = opts?.color || "#1C1635";
  const lh = opts?.lh || 1.45;
  sf(doc, font); doc.setFontSize(sz); doc.setTextColor(color);
  let lines: string[] = doc.splitTextToSize(S(text), w);
  if (opts?.maxLines && lines.length > opts.maxLines) {
    lines = lines.slice(0, opts.maxLines);
    const last = lines[lines.length - 1];
    if (last && !last.endsWith("...")) {
      lines[lines.length - 1] = last.replace(/\s+\S*$/, "") + "...";
    }
  }
  const sp = sz * lh;
  for (let i = 0; i < lines.length; i++) {
    const ly = y + i * sp;
    const ax = opts?.align === "center" ? x + w / 2 : opts?.align === "right" ? x + w : x;
    doc.text(lines[i], ax, ly, opts?.align ? { align: opts.align } : undefined);
  }
  return y + lines.length * sp;
}

/** Draw filled rounded rect card */
function card(doc: jsPDF, x: number, y: number, w: number, h: number,
  leftColor?: string, leftW = 2.5) {
  doc.setFillColor("#F8F6F1");
  doc.roundedRect(x, y, w, h, 3, 3, "F");
  doc.setDrawColor("#E8E5DE"); doc.setLineWidth(0.5);
  doc.roundedRect(x, y, w, h, 3, 3, "S");
  if (leftColor) { doc.setFillColor(leftColor); doc.rect(x, y + 2, leftW, h - 4, "F"); }
}

/** Draw page footer */
function footer(doc: jsPDF, section: string, page: number) {
  doc.setDrawColor("#E2E0DB"); doc.setLineWidth(0.5);
  doc.line(ML, 740, ML + CW, 740);
  sf(doc, "Inter"); doc.setFontSize(8); doc.setTextColor("#6B6155");
  doc.text(S(`Confidential - ${section}`), ML, YF);
  doc.text(`Page ${page} of 4`, CX, YF, { align: "center" });
  doc.text("peoplestar.com/RunPayway/contact", ML + CW, YF, { align: "right" });
}

/** Draw interior page header — score badge top right */
function header(doc: jsPDF, score?: number, band?: string, bandColor?: string) {
  sf(doc, "InterB"); doc.setFontSize(8); doc.setTextColor("#1C1635");
  doc.text("RUNPAYWAY(TM)", ML, 40);

  // Score badge top right
  if (score !== undefined) {
    sf(doc, "InterB"); doc.setFontSize(18); doc.setTextColor("#1C1635");
    doc.text(String(score), ML + CW, 38, { align: "right" });
    const scoreW = doc.getTextWidth(String(score));
    sf(doc, "Inter"); doc.setFontSize(8); doc.setTextColor("#6B6155");
    doc.text("/100", ML + CW, 46, { align: "right" });
    if (band && bandColor) {
      doc.setFillColor(bandColor);
      doc.rect(ML + CW - scoreW - 16, 33, 4, 4, "F");
    }
  } else {
    sf(doc, "Inter"); doc.setFontSize(8); doc.setTextColor("#6B6155");
    doc.text("Model RP-2.0", ML + CW, 40, { align: "right" });
  }
  doc.setDrawColor("#E2E0DB"); doc.setLineWidth(0.5);
  doc.line(ML, 50, ML + CW, 50);
}

/** Overline label */
function label(doc: jsPDF, text: string, x: number, y: number, color = "#6B6155") {
  sf(doc, "InterB"); doc.setFontSize(8);
  doc.setTextColor(color); doc.text(S(text), x, y);
}

/** Overflow check — logs warning but does not throw */
function check(y: number, h: number, tag: string) {
  if (y + h > YL) {
    console.warn(`PDF layout warning: ${tag} may overflow (y=${Math.round(y)}, h=${Math.round(h)}, limit=${YL})`);
  }
}

function fits(y: number, h: number): boolean {
  return y + h <= YL;
}

/* ================================================================== */
/*  PAGE 1 — COVER                                                     */
/* ================================================================== */

async function page1(doc: jsPDF, d: ReportPDFData) {
  // ── TOP BAR — thin accent line ──
  doc.setFillColor("#1C1635");
  doc.rect(0, 0, W, 3, "F");

  // ── LEFT-ALIGNED HEADER BLOCK ──
  let y = 56;
  sf(doc, "InterB"); doc.setFontSize(8); doc.setTextColor("#1C1635");
  doc.text("RUNPAYWAY(TM)", ML, y, { charSpace: 1.5 });
  sf(doc, "Inter"); doc.setFontSize(8); doc.setTextColor("#6B6155");
  doc.text("Income Stability Score(TM)  -  Model RP-2.0", ML + CW, y, { align: "right" });

  // Thin line
  y += 12;
  doc.setDrawColor("#E2E0DB"); doc.setLineWidth(0.5);
  doc.line(ML, y, ML + CW, y);

  // ── REPORT TITLE — large, left-aligned ──
  y += 40;
  sf(doc, "InterB"); doc.setFontSize(32); doc.setTextColor("#1C1635");
  doc.text("Income Stability", ML, y);
  y += 36;
  doc.text("Report", ML, y);

  // ── SUBTITLE ──
  y += 20;
  sf(doc, "InterSB"); doc.setFontSize(14); doc.setTextColor("#1F6D7A");
  doc.text("Your Path to Financial Resilience", ML, y);
  y += 16;
  sf(doc, "Inter"); doc.setFontSize(10.5); doc.setTextColor("#535D6B");
  doc.text("Your Personalized Income Stability Score™", ML, y);

  // ── THIN LINE ──
  y += 20;
  doc.setDrawColor("#E2E0DB"); doc.setLineWidth(0.5);
  doc.line(ML, y, ML + 160, y);

  // ── PREPARED FOR ──
  y += 24;
  sf(doc, "Inter"); doc.setFontSize(9); doc.setTextColor("#6B6155");
  doc.text("Prepared for", ML, y);
  y += 14;
  sf(doc, "InterSB"); doc.setFontSize(16); doc.setTextColor("#1C1635");
  doc.text(S(d.assessmentTitle), ML, y);
  y += 14;
  sf(doc, "Inter"); doc.setFontSize(9.5); doc.setTextColor("#6B6155");
  doc.text(S(d.formalDate), ML, y);

  // ── SCORE BLOCK — right side, vertically centered with name ──
  const scoreBlockY = y - 28;
  sf(doc, "InterB"); doc.setFontSize(56); doc.setTextColor("#1C1635");
  doc.text(String(d.finalScore), ML + CW, scoreBlockY + 20, { align: "right" });
  sf(doc, "Inter"); doc.setFontSize(14); doc.setTextColor("#6B6155");
  doc.text("/100", ML + CW, scoreBlockY + 36, { align: "right" });
  doc.setFillColor(d.bandColor);
  doc.rect(ML + CW - 4, scoreBlockY + 42, 4, 4, "F");
  sf(doc, "InterSB"); doc.setFontSize(11); doc.setTextColor(d.bandColor);
  doc.text(S(`Stability Level: ${d.stabilityBand}`), ML + CW, scoreBlockY + 56, { align: "right" });

  // Improvement potential
  if (d.nextBandName) {
    sf(doc, "InterSB"); doc.setFontSize(9.5); doc.setTextColor("#1F6D7A");
    doc.text(S(`Improvement Potential: ${d.distanceToNext} points to ${d.nextBandName}`), ML + CW, scoreBlockY + 68, { align: "right" });
  }

  // ── BAND DESCRIPTION ──
  y += 32;
  doc.setDrawColor("#E2E0DB"); doc.setLineWidth(0.5);
  doc.line(ML, y, ML + CW, y);
  y += 16;
  dt(doc, d.coverBandDesc, ML, y, CW, 10.5, { color: "#535D6B" });
  y += mh(doc, d.coverBandDesc, CW, 10.5);

  // ── MODEL + METHODOLOGY ──
  y += 24;
  sf(doc, "Inter"); doc.setFontSize(8.5); doc.setTextColor("#6B6155");
  doc.text("Built from fixed structural questions under Model RP-2.0.", ML, y);
  y += 10;
  doc.text("Deterministic scoring. Same answers always produce the same score.", ML, y);

  // ── SIMULATOR ACCESS ──
  y += 28;
  sf(doc, "InterB"); doc.setFontSize(8); doc.setTextColor("#1C1635");
  doc.text("RUNPAYWAY(TM) STABILITY SUITE ACCESS", ML, y, { charSpace: 0.5 });
  y += 12;
  sf(doc, "Inter"); doc.setFontSize(8.5); doc.setTextColor("#535D6B");
  doc.text("Use this code at runpayway.com/dashboard to access your Dashboard tools.", ML, y);
  y += 14;
  // Access code card — full width (no QR for RP-2.0)
  doc.setFont("Courier", "normal"); doc.setFontSize(6.5);
  const codeLines: string[] = doc.splitTextToSize(S(d.accessCode), CW - 20);
  const codeH = codeLines.length * 9 + 10;
  card(doc, ML, y, CW, codeH);

  // Access code text
  doc.setFont("Courier", "normal"); doc.setFontSize(6.5); doc.setTextColor("#1C1635");
  for (let i = 0; i < codeLines.length; i++) {
    doc.text(codeLines[i], ML + 10, y + 8 + i * 9);
  }

  // ── FOOTER ──
  sf(doc, "Inter"); doc.setFontSize(8); doc.setTextColor("#6B6155");
  doc.text("Model RP-2.0  -  4 Pages  -  Confidential", ML, YF);
  doc.text("peoplestar.com/RunPayway/contact", ML + CW, YF, { align: "right" });
}

/* ================================================================== */
/*  PAGE 2 — KEY FINDINGS                                              */
/* ================================================================== */

function page2(doc: jsPDF, d: ReportPDFData) {
  header(doc, d.finalScore, d.stabilityBand, d.bandColor);
  let y = Y0;

  // Page title
  sf(doc, "InterB"); doc.setFontSize(14); doc.setTextColor("#1C1635");
  doc.text("Key Findings", ML, y);

  y += 18;
  sf(doc, "Inter"); doc.setFontSize(9); doc.setTextColor("#6B6155");
  const metaLine = `${S(d.assessmentTitle)} - ${S(d.formalDate)} - Stability Level: ${S(d.stabilityBand)}${d.nextBandName ? ` - ${d.distanceToNext} points to ${d.nextBandName}` : ""}`;
  doc.text(metaLine, ML, y);

  y += 16;

  // Key Takeaway card
  const ktH = mh(doc, d.diagnosticSentence, CW - 28, 11, "InterM") + 28;
  check(y, ktH, "P2-kt");
  card(doc, ML, y, CW, ktH, "#4B3FAE");
  label(doc, "KEY TAKEAWAY", ML + 10, y + 12, "#4B3FAE");
  dt(doc, d.diagnosticSentence, ML + 14, y + 24, CW - 28, 11, { font: "InterM" });
  y += ktH + 12;

  // In Plain English — Good News / Bad News
  label(doc, "IN PLAIN ENGLISH", ML, y);
  y += 14;

  // Good News
  label(doc, "THE GOOD NEWS", ML + 10, y, "#1F6D7A");
  y += 12;
  y = dt(doc, d.plainEnglish, ML + 10, y, CW - 20, 10, { maxLines: 3 });
  y += 8;

  // Bad News
  label(doc, "THE BAD NEWS", ML + 10, y, "#9B2C2C");
  y += 12;
  y = dt(doc, d.dominantConstraintText, ML + 10, y, CW - 20, 10, { maxLines: 3 });
  y += 12;

  // RunPayway Command Center CTA
  doc.setDrawColor("#E2E0DB"); doc.setLineWidth(0.5);
  doc.line(ML, y, ML + CW, y);
  y += 12;
  // Dark gradient card
  doc.setFillColor("#1C1635");
  doc.roundedRect(ML, y, CW, 44, 3, 3, "F");
  label(doc, "RUNPAYWAY(TM) STABILITY SUITE", ML + 10, y + 12, "#1F6D7A");
  sf(doc, "InterSB"); doc.setFontSize(10); doc.setTextColor("#F4F1EA");
  doc.text("See exactly where your income is vulnerable", ML + 10, y + 24);
  sf(doc, "Inter"); doc.setFontSize(8); doc.setTextColor("#8A8278");
  doc.text("Income X-Ray  -  Scenario Lab  -  Action Plan  |  runpayway.com/dashboard", ML + 10, y + 36);
  y += 44;

  footer(doc, "Key Findings", 2);
}

/* ================================================================== */
/*  PAGE 3 — STABILITY PLAN + ROADMAP                                  */
/* ================================================================== */

function page3(doc: jsPDF, d: ReportPDFData) {
  header(doc, d.finalScore, d.stabilityBand, d.bandColor);
  let y = Y0;

  sf(doc, "InterB"); doc.setFontSize(14); doc.setTextColor("#1C1635");
  doc.text("Stability Plan", ML, y);
  y += 14;
  sf(doc, "Inter"); doc.setFontSize(9); doc.setTextColor("#535D6B");
  doc.text("Based on your score, these are your highest-impact changes.", ML, y);
  y += 16;

  // Action steps — max 3, compact cards with priority labels instead of points
  const stepColors = ["#4B3FAE", "#1F6D7A", "#1C1635"];
  const stepLabels = ["STEP 1 — HIGHEST IMPACT", "STEP 2", "STEP 3"];
  const actions = d.actionCategories.slice(0, 3);
  for (let i = 0; i < actions.length; i++) {
    const a = actions[i];
    const h = 42;
    if (!fits(y, h)) break;
    card(doc, ML, y, CW, h, stepColors[i]);
    label(doc, stepLabels[i], ML + 10, y + 10, stepColors[i]);
    sf(doc, "InterSB"); doc.setFontSize(9.5); doc.setTextColor("#1C1635");
    doc.text(truncate(a.title, 65), ML + 10, y + 21);
    sf(doc, "Inter"); doc.setFontSize(8); doc.setTextColor("#535D6B");
    doc.text(truncate(a.how, 85), ML + 10, y + 31);
    y += h + 5;
  }

  // Combined lift — framed as band progress
  if (d.combinedLift && fits(y, 20)) {
    sf(doc, "InterSB"); doc.setFontSize(8.5); doc.setTextColor("#1F6D7A");
    doc.text(S("Where These Steps Take You"), ML, y);
    y += 10;
    sf(doc, "Inter"); doc.setFontSize(8.5); doc.setTextColor("#1C1635");
    const cText = d.combinedLift.progressText || `Together, these changes would raise your score from ${d.combinedLift.projectedScore - d.combinedLift.lift} to ${d.combinedLift.projectedScore}.`;
    doc.text(S(truncate(cText, 100)), ML, y);
    y += 14;
  }

  // What Becomes Possible
  if (fits(y, 40)) {
    const nextTier = d.tier === "limited" ? "developing" : d.tier === "developing" ? "established" : d.tier === "established" ? "high" : null;
    const unlocksByTier: Record<string, string[]> = {
      developing: ["Walk away from bad deals — you're no longer one disruption from crisis", "Plan more than 30 days ahead — make decisions for next quarter, not just this week"],
      established: ["Negotiate from strength — set rates and hold firm", "Take smart risks — your base absorbs the gap while you grow", "Time off without panic — your income keeps coming when you stop"],
      high: ["Charge premium rates — choose only the best opportunities", "Build something worth more — stable income makes your business more valuable", "Full financial leverage — lenders and partners treat you differently"],
    };
    const items = nextTier ? unlocksByTier[nextTier] : unlocksByTier.high;
    const nextLabel = nextTier === "developing" ? "Developing Stability" : nextTier === "established" ? "Established Stability" : "High Stability";
    label(doc, `WHAT BECOMES POSSIBLE${nextTier ? ` AT ${nextLabel.toUpperCase()}` : ""}`, ML, y, "#1F6D7A");
    y += 10;
    sf(doc, "Inter"); doc.setFontSize(8); doc.setTextColor("#535D6B");
    for (const item of (items || []).slice(0, 3)) {
      if (!fits(y, 10)) break;
      doc.text(S(`\u2713  ${truncate(item, 90)}`), ML, y);
      y += 10;
    }
    y += 4;
  }

  // Divider
  if (fits(y, 10)) {
    doc.setDrawColor("#E2E0DB"); doc.setLineWidth(0.5);
    doc.line(ML, y, ML + CW, y); y += 10;
  }

  // Roadmap
  if (fits(y, 30)) {
    label(doc, "30-DAY ROADMAP", ML, y, "#4B3FAE");
    y += 12;

    for (const row of d.roadmap.slice(0, 4)) {
      if (!fits(y, 18)) break;
      sf(doc, "InterB"); doc.setFontSize(7); doc.setTextColor("#4B3FAE");
      doc.text(truncate(row.week, 12), ML, y);
      sf(doc, "InterSB"); doc.setFontSize(8.5); doc.setTextColor("#1C1635");
      doc.text(truncate(row.action, 50), ML + 56, y);
      sf(doc, "Inter"); doc.setFontSize(7.5); doc.setTextColor("#535D6B");
      doc.text(truncate(row.detail, 75), ML + 56, y + 9);
      y += 20;
    }
  }

  // Avoid actions
  if (d.avoidActions.length > 0 && fits(y, 24)) {
    label(doc, "WHAT TO AVOID", ML, y, "#9B2C2C");
    y += 10;
    for (const a of d.avoidActions.slice(0, 2)) {
      if (!fits(y, 10)) break;
      sf(doc, "Inter"); doc.setFontSize(8); doc.setTextColor("#535D6B");
      doc.text(S(`- ${truncate(a, 90)}`), ML, y);
      y += 10;
    }
  }

  footer(doc, "RunPayway(TM) Stability Plan", 3);
}

/* ================================================================== */
/*  PAGE 4 — STRESS TEST + VALUE                                       */
/* ================================================================== */

function page4(doc: jsPDF, d: ReportPDFData) {
  header(doc, d.finalScore, d.stabilityBand, d.bandColor);
  let y = Y0;

  sf(doc, "InterB"); doc.setFontSize(12.5); doc.setTextColor("#1C1635");
  doc.text("Stress Testing", ML, y);
  y += 14;
  sf(doc, "Inter"); doc.setFontSize(9); doc.setTextColor("#535D6B");
  doc.text("What happens when things go wrong - and how to prepare.", ML, y);
  y += 16;

  // 3 scenario cards with risk + solution
  const scenarios = d.scenarios.slice(0, 3);
  const sBorders = ["#9B2C2C", "#92640A", "#1C1635"];
  for (let i = 0; i < scenarios.length; i++) {
    const sc = scenarios[i];
    const h = 48;
    check(y, h, `P4-sc${i}`);
    card(doc, ML, y, CW, h, sBorders[i]);
    label(doc, `SCENARIO ${i + 1}: ${truncate(cleanTitle(sc.title, d.vocabulary?.scenarios), 45).toUpperCase()}`, ML + 10, y + 10, sBorders[i]);
    sf(doc, "Inter"); doc.setFontSize(8.5); doc.setTextColor("#1C1635");
    doc.text(S(`Risk: Score drops by ${sc.scoreDrop} points (${sc.originalScore} to ${sc.scenarioScore})`), ML + 10, y + 22);
    if (sc.bandShift) {
      sf(doc, "Inter"); doc.setFontSize(7.5); doc.setTextColor("#9B2C2C");
      doc.text(S(`Drops from ${sc.originalBand} to ${sc.scenarioBand}`), ML + 10, y + 32);
    }
    if (sc.narrative) {
      sf(doc, "Inter"); doc.setFontSize(8); doc.setTextColor("#1F6D7A");
      doc.text(truncate(sc.narrative, 85), ML + 10, y + (sc.bandShift ? 42 : 34));
    }
    y += h + 6;
  }

  // Absorbency
  check(y, 44, "P4-absorb");
  card(doc, ML, y, CW, 44);
  label(doc, "HOW MUCH CAN YOUR INCOME ABSORB?", ML + 10, y + 10);
  sf(doc, "InterSB"); doc.setFontSize(10); doc.setTextColor(d.fragilityColor);
  doc.text(truncate(d.fragilityLabel, 60), ML + 10, y + 22);
  sf(doc, "Inter"); doc.setFontSize(9); doc.setTextColor("#535D6B");
  doc.text(truncate(d.fragilityText, 80), ML + 10, y + 34);
  y += 44 + 8;

  // Real-world impact cards
  const cw2 = (CW - 12) / 2;
  if (y + 52 <= YL) {
    card(doc, ML, y, cw2, 52, "#9B2C2C");
    label(doc, d.vocabulary?.nouns?.top_client ? `IF YOUR ${truncate(d.vocabulary.nouns.top_client.split(/,| or /)[0], 22).toUpperCase()} LEAVES` : "IF BIGGEST SOURCE GOES AWAY", ML + 8, y + 10);
    sf(doc, "InterB"); doc.setFontSize(16); doc.setTextColor("#1C1635");
    doc.text(`${d.score} to ${d.riskScenarioScore}`, ML + 8, y + 28);
    sf(doc, "Inter"); doc.setFontSize(8.5); doc.setTextColor("#535D6B");
    doc.text(S(`-${d.riskScenarioDrop} points`), ML + 8, y + 40);

    const rx = ML + cw2 + 12;
    card(doc, rx, y, cw2, 52, "#92640A");
    label(doc, "IF YOU STOP WORKING", rx + 8, y + 10);
    sf(doc, "InterB"); doc.setFontSize(16); doc.setTextColor("#1C1635");
    doc.text(S(d.continuityDisplay), rx + 8, y + 28);
    sf(doc, "Inter"); doc.setFontSize(8.5); doc.setTextColor("#535D6B");
    doc.text(truncate(d.continuityText, 50), rx + 8, y + 40);
    y += 52 + 10;
  }

  // Why This Report Delivers Real Value
  if (y + 50 <= YL) {
    doc.setDrawColor("#E2E0DB"); doc.setLineWidth(0.5);
    doc.line(ML, y, ML + CW, y); y += 10;
    sf(doc, "InterB"); doc.setFontSize(10); doc.setTextColor("#1C1635");
    doc.text("Why This Report Delivers Real Value", ML, y);
    y += 12;
    const valueText = "This report provides actionable steps, personalized recommendations, and the RunPayway(TM) Dashboard to future-proof your income. Clear guidance, interactive tools, and an ongoing plan to create lasting financial stability.";
    y = dt(doc, valueText, ML, y, CW, 9, { color: "#535D6B", maxLines: 3 });
    y += 8;
  }

  // Retake
  if (y + 24 <= YL) {
    label(doc, "WHEN TO RETAKE", ML, y);
    y += 10;
    sf(doc, "InterSB"); doc.setFontSize(9.5); doc.setTextColor("#1C1635");
    doc.text(S(`${d.reassessDate} (${d.reassessDaysLeft} days from now)`), ML, y);
    y += 14;
  }

  // ── ACCESS CODE — duplicated on back page for convenience ──
  if (y + 60 <= YL) {
    doc.setDrawColor("#E2E0DB"); doc.setLineWidth(0.5);
    doc.line(ML, y, ML + CW, y); y += 12;
    label(doc, "DASHBOARD ACCESS", ML, y, "#1C1635");
    y += 10;
    sf(doc, "Inter"); doc.setFontSize(8); doc.setTextColor("#535D6B");
    doc.text("Use this code at runpayway.com/dashboard to access your Dashboard.", ML, y);
    y += 12;
    card(doc, ML, y, CW, 28);
    doc.setFont("Courier", "normal"); doc.setFontSize(6); doc.setTextColor("#1C1635");
    const backCodeLines: string[] = doc.splitTextToSize(S(d.accessCode), CW - 20);
    for (let i = 0; i < Math.min(backCodeLines.length, 2); i++) {
      doc.text(backCodeLines[i], ML + 10, y + 10 + i * 8);
    }
    y += 32;
  }

  // Fine print
  if (y + 20 <= YL) {
    const fp = "RunPayway(TM) - a proprietary income diagnostic developed by PeopleStar Enterprises, INC. Model RP-2.0. Not financial advice. Same answers always produce the same score.";
    dt(doc, fp, ML, y, CW, 7.5, { color: "#6B6155", lh: 1.3 });
  }

  footer(doc, "Stress Testing & Dashboard Access", 4);
}

/* ================================================================== */
/*  MAIN EXPORT                                                        */
/* ================================================================== */

export async function generateReportPDF(data: ReportPDFData): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "portrait" });

  await loadFonts(doc);

  await page1(doc, data);
  doc.addPage(); page2(doc, data);
  doc.addPage(); page3(doc, data);
  doc.addPage(); page4(doc, data);

  // HARD VERIFICATION
  const n = doc.getNumberOfPages();
  if (n !== 4) throw new Error(`FATAL: PDF has ${n} pages, expected exactly 4`);

  return doc.output("blob");
}
