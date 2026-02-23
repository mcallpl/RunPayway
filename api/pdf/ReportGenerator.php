<?php

declare(strict_types=1);

/**
 * RunPayway PDF Report Generator
 *
 * Generates the official RunPayway Report as a 1-page PDF using TCPDF.
 *
 * Locked section order:
 * 1. Header Bar (logo left, title/ID/date right)
 * 2. Payway Rating (dominant)
 * 3. Pillar Breakdown (3-column grid)
 * 4. Structural Signal Composition
 * 5. Structural Pressure Sensitivity
 * 6. Impact Determinants
 * 7. Calibration Profile (institutional bordered block)
 * 8. Footer
 *
 * Page: Letter 8.5x11, L18 R18 T16 B18
 */

$tcpdfAutoload = __DIR__ . '/../vendor/autoload.php';
if (file_exists($tcpdfAutoload)) {
    require_once $tcpdfAutoload;
}

require_once __DIR__ . '/../engine/PositionSummary.php';

class ReportGenerator
{
    private string $reportsDir;

    // ── Colors ──────────────────────────────────────────────────────────
    private const NAVY      = [10, 22, 40];       // #0A1628
    private const HERO_BG   = [11, 22, 35];       // #0B1623
    private const GRAY_600  = [107, 114, 128];
    private const GRAY_400  = [156, 163, 175];
    private const GRAY_200  = [229, 231, 235];
    private const WHITE     = [255, 255, 255];
    private const SLATE_50  = [248, 250, 252];

    private const BAND_DEFS = [
        ['min' => 0,  'max' => 39,  'label' => 'Attention-Dependent',     'color' => [239, 68, 68]],
        ['min' => 40, 'max' => 59,  'label' => 'Attention-Weighted',      'color' => [245, 158, 11]],
        ['min' => 60, 'max' => 79,  'label' => 'Mixed Structural Support', 'color' => [59, 130, 246]],
        ['min' => 80, 'max' => 100, 'label' => 'Structurally Supported',   'color' => [16, 185, 129]],
    ];

    public function __construct()
    {
        $this->reportsDir = __DIR__ . '/../reports/';
        if (!is_dir($this->reportsDir)) {
            mkdir($this->reportsDir, 0755, true);
        }
    }

    /**
     * Generate a PDF report from the output payload.
     */
    public function generate(array $payload, string $modelVersion = 'RP-1.0', string $reportTitle = ''): string
    {
        if (!class_exists('TCPDF')) {
            throw new \RuntimeException(
                'TCPDF library is not installed. Run: composer require tecnickcom/tcpdf'
            );
        }

        $assessmentId = $payload['assessment_id'] ?? 'UNKNOWN';
        $filename = "RunPayway-Report-{$assessmentId}.pdf";
        $filepath = $this->reportsDir . $filename;

        $pdf = new \TCPDF('P', 'mm', 'LETTER', true, 'UTF-8', false);

        $pdf->SetCreator('RunPayway');
        $pdf->SetAuthor('PeopleStar Enterprises, Inc.');
        $pdf->SetTitle("RunPayway Report - {$assessmentId}");
        $pdf->SetSubject('Income Structure Diagnostic Report');
        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);
        $pdf->SetMargins(18, 16, 18);
        $pdf->SetAutoPageBreak(true, 18);

        $pdf->AddPage();

        $contentW = 215.9 - 18 - 18; // Letter width minus margins

        // ════════════════════════════════════════════════════════════════
        // Section 1: HEADER BAR (logo left, title/ID/date right)
        // ════════════════════════════════════════════════════════════════

        $displayTitle = trim($reportTitle) !== '' ? trim($reportTitle) : 'RunPayway Structural Report';
        // Truncate to prevent wrapping
        if (strlen($displayTitle) > 50) {
            $displayTitle = substr($displayTitle, 0, 47) . '...';
        }

        $assessmentDate = $payload['assessment_date'] ?? date('Y-m-d');

        // Logo (left)
        $logoPath = __DIR__ . '/../reports/logo.png';
        $headerY = $pdf->GetY();
        if (file_exists($logoPath)) {
            $pdf->Image($logoPath, 18, $headerY, 40, 0, '', '', '', false, 300);
        }

        // Title + ID + Date (right-aligned)
        $pdf->SetXY(18 + $contentW - 80, $headerY);
        $pdf->SetFont('helvetica', 'B', 10);
        $pdf->SetTextColor(...self::NAVY);
        $pdf->Cell(80, 5, $displayTitle, 0, 1, 'R');

        $pdf->SetXY(18 + $contentW - 80, $pdf->GetY());
        $pdf->SetFont('helvetica', '', 7.5);
        $pdf->SetTextColor(...self::GRAY_400);
        $pdf->Cell(80, 4, $assessmentId, 0, 1, 'R');

        $pdf->SetXY(18 + $contentW - 80, $pdf->GetY());
        $pdf->Cell(80, 4, $assessmentDate, 0, 1, 'R');

        $pdf->SetY(max($pdf->GetY(), $headerY + 14));
        $pdf->Ln(4);

        // ════════════════════════════════════════════════════════════════
        // Section 2: PAYWAY RATING (navy hero)
        // ════════════════════════════════════════════════════════════════
        $rating = (int)($payload['payway_rating'] ?? 0);
        $bandLabel = $payload['dependency_classification'] ?? 'Attention-Dependent';

        $heroY = $pdf->GetY();
        $heroH = 44;
        $pdf->SetFillColor(...self::HERO_BG);
        $pdf->Rect(18, $heroY, $contentW, $heroH, 'F');

        // Micro label
        $pdf->SetXY(18, $heroY + 3);
        $pdf->SetFont('helvetica', '', 7);
        $pdf->SetTextColor(200, 200, 200);
        $pdf->Cell($contentW, 4, 'PAYWAY RATING', 0, 1, 'C');

        // Score
        $pdf->SetXY(18, $heroY + 8);
        $pdf->SetFont('helvetica', 'B', 48);
        $pdf->SetTextColor(...self::WHITE);
        $pdf->Cell($contentW, 18, (string)$rating, 0, 1, 'C');

        // Band label
        $pdf->SetXY(18, $heroY + 26);
        $pdf->SetFont('helvetica', 'B', 11);
        $pdf->SetTextColor(235, 235, 235);
        $pdf->Cell($contentW, 5, $bandLabel, 0, 1, 'C');

        // Segmented band bar
        $this->drawSegmentedBandBar($pdf, $rating, 18, $heroY + 34, $contentW);

        $pdf->SetY($heroY + $heroH + 3);

        // ════════════════════════════════════════════════════════════════
        // Section 3: PILLAR BREAKDOWN (3-column grid)
        // ════════════════════════════════════════════════════════════════
        $this->drawSectionHeader($pdf, 'PILLAR BREAKDOWN');

        $structPct = (int)($payload['structure_supported_composition_pct'] ?? 0);
        $pressureIndex = (int)($payload['structural_pressure_index'] ?? 0);
        $pressureLabel = $payload['structural_pressure_label'] ?? '';
        $attDepPct = (int)($payload['attention_dependence_pct'] ?? 0);
        $attDepLabel = $payload['attention_dependence_label'] ?? '';

        $colW = ($contentW - 4) / 3; // 3 cols with 2px gaps
        $gridY = $pdf->GetY();

        // Column 1: Signal Composition
        $pdf->SetFillColor(...self::SLATE_50);
        $pdf->Rect(18, $gridY, $colW, 18, 'F');
        $pdf->SetXY(20, $gridY + 2);
        $pdf->SetFont('helvetica', '', 6.5);
        $pdf->SetTextColor(...self::GRAY_400);
        $pdf->Cell($colW - 4, 3, 'SIGNAL COMPOSITION', 0, 1, 'L');
        $pdf->SetXY(20, $gridY + 5);
        $pdf->SetFont('helvetica', 'B', 16);
        $pdf->SetTextColor(...self::NAVY);
        $pdf->Cell($colW - 4, 7, $structPct . '%', 0, 1, 'L');
        $pdf->SetXY(20, $gridY + 13);
        $pdf->SetFont('helvetica', '', 7);
        $pdf->SetTextColor(...self::GRAY_600);
        $pdf->Cell($colW - 4, 3, 'Structural share', 0, 1, 'L');

        // Column 2: Pressure Sensitivity
        $col2X = 18 + $colW + 2;
        $pdf->SetFillColor(...self::SLATE_50);
        $pdf->Rect($col2X, $gridY, $colW, 18, 'F');
        $pdf->SetXY($col2X + 2, $gridY + 2);
        $pdf->SetFont('helvetica', '', 6.5);
        $pdf->SetTextColor(...self::GRAY_400);
        $pdf->Cell($colW - 4, 3, 'PRESSURE SENSITIVITY', 0, 1, 'L');
        $pdf->SetXY($col2X + 2, $gridY + 5);
        $pdf->SetFont('helvetica', 'B', 16);
        $pdf->SetTextColor(...self::NAVY);
        $pdf->Cell($colW - 4, 7, $pressureIndex . '%', 0, 1, 'L');
        $pdf->SetXY($col2X + 2, $gridY + 13);
        $pdf->SetFont('helvetica', '', 7);
        $pdf->SetTextColor(...self::GRAY_600);
        $pdf->Cell($colW - 4, 3, $pressureLabel, 0, 1, 'L');

        // Column 3: Attention Dependence
        $col3X = 18 + ($colW + 2) * 2;
        $pdf->SetFillColor(...self::SLATE_50);
        $pdf->Rect($col3X, $gridY, $colW, 18, 'F');
        $pdf->SetXY($col3X + 2, $gridY + 2);
        $pdf->SetFont('helvetica', '', 6.5);
        $pdf->SetTextColor(...self::GRAY_400);
        $pdf->Cell($colW - 4, 3, 'ATTENTION DEPENDENCE', 0, 1, 'L');
        $pdf->SetXY($col3X + 2, $gridY + 5);
        $pdf->SetFont('helvetica', 'B', 16);
        $pdf->SetTextColor(...self::NAVY);
        $pdf->Cell($colW - 4, 7, $attDepPct . '%', 0, 1, 'L');
        $pdf->SetXY($col3X + 2, $gridY + 13);
        $pdf->SetFont('helvetica', '', 7);
        $pdf->SetTextColor(...self::GRAY_600);
        $pdf->Cell($colW - 4, 3, $attDepLabel, 0, 1, 'L');

        $pdf->SetY($gridY + 20);
        $pdf->Ln(2);
        $this->drawDivider($pdf, $contentW);

        // ════════════════════════════════════════════════════════════════
        // Section 4: STRUCTURAL SIGNAL COMPOSITION
        // ════════════════════════════════════════════════════════════════
        $directPct = (int)($payload['direct_involvement_composition_pct'] ?? 0);

        $this->drawSectionHeader($pdf, 'STRUCTURAL SIGNAL COMPOSITION');

        // Structural bar
        $pdf->SetFont('helvetica', '', 9);
        $pdf->SetTextColor(...self::NAVY);
        $pdf->Cell($contentW - 20, 4, 'Structural Pillars Share (Core + Stability)', 0, 0, 'L');
        $pdf->SetFont('helvetica', 'B', 9);
        $pdf->Cell(20, 4, $structPct . '%', 0, 1, 'R');

        $barY = $pdf->GetY();
        $pdf->SetFillColor(...self::GRAY_200);
        $pdf->Rect(18, $barY, $contentW, 2.5, 'F');
        $pdf->SetFillColor(...self::NAVY);
        $pdf->Rect(18, $barY, $contentW * ($structPct / 100), 2.5, 'F');
        $pdf->SetY($barY + 4);

        // Direct bar
        $pdf->SetFont('helvetica', '', 9);
        $pdf->SetTextColor(...self::GRAY_600);
        $pdf->Cell($contentW - 20, 4, 'Direct-Involvement Share (Modifiers)', 0, 0, 'L');
        $pdf->SetFont('helvetica', 'B', 9);
        $pdf->Cell(20, 4, $directPct . '%', 0, 1, 'R');

        $barY = $pdf->GetY();
        $pdf->SetFillColor(...self::GRAY_200);
        $pdf->Rect(18, $barY, $contentW, 2.5, 'F');
        $pdf->SetFillColor(...self::GRAY_600);
        $pdf->Rect(18, $barY, $contentW * ($directPct / 100), 2.5, 'F');
        $pdf->SetY($barY + 4);

        // Clarification
        $pdf->SetFont('helvetica', '', 7);
        $pdf->SetTextColor(...self::GRAY_400);
        $pdf->MultiCell($contentW, 3, 'Percentages describe distribution of measured structural signal across pillars; not revenue allocation and not structural magnitude.', 0, 'L');

        $pdf->Ln(2);
        $this->drawDivider($pdf, $contentW);

        // ════════════════════════════════════════════════════════════════
        // Section 5: STRUCTURAL PRESSURE SENSITIVITY
        // ════════════════════════════════════════════════════════════════
        $this->drawSectionHeader($pdf, 'STRUCTURAL PRESSURE SENSITIVITY');

        $pdf->SetFont('helvetica', 'B', 12);
        $pdf->SetTextColor(...self::NAVY);
        $pdf->Cell($contentW, 5, $pressureLabel . ' (' . $pressureIndex . '%)', 0, 1, 'L');

        $pdf->SetFont('helvetica', '', 8);
        $pdf->SetTextColor(...self::GRAY_600);
        $pdf->Cell($contentW, 4, 'Higher values indicate greater vulnerability under operational pressure.', 0, 1, 'L');

        $pdf->Ln(2);
        $this->drawDivider($pdf, $contentW);

        // ════════════════════════════════════════════════════════════════
        // Section 6: IMPACT DETERMINANTS
        // ════════════════════════════════════════════════════════════════
        $this->drawSectionHeader($pdf, 'IMPACT DETERMINANTS');

        $conLabel = $this->stripSuffix($payload['contract_disruption_impact_label'] ?? '');
        $cliLabel = $this->stripSuffix($payload['client_turnover_impact_label'] ?? '');

        $pdf->SetFont('helvetica', '', 9);
        $pdf->SetTextColor(...self::NAVY);
        $pdf->Cell(55, 4, 'Contract Disruption Impact', 0, 0, 'L');
        $pdf->SetFont('helvetica', '', 8);
        $pdf->SetTextColor(...self::GRAY_400);
        $pdf->Cell(5, 4, chr(0x97), 0, 0, 'C'); // em dash
        $pdf->SetFont('helvetica', '', 9);
        $pdf->SetTextColor(...self::GRAY_600);
        $pdf->Cell($contentW - 60, 4, $conLabel, 0, 1, 'L');

        $pdf->SetFont('helvetica', '', 9);
        $pdf->SetTextColor(...self::NAVY);
        $pdf->Cell(55, 4, 'Client Turnover Impact', 0, 0, 'L');
        $pdf->SetFont('helvetica', '', 8);
        $pdf->SetTextColor(...self::GRAY_400);
        $pdf->Cell(5, 4, chr(0x97), 0, 0, 'C');
        $pdf->SetFont('helvetica', '', 9);
        $pdf->SetTextColor(...self::GRAY_600);
        $pdf->Cell($contentW - 60, 4, $cliLabel, 0, 1, 'L');

        $pdf->Ln(2);
        $this->drawDivider($pdf, $contentW);

        // ════════════════════════════════════════════════════════════════
        // Section 7: CALIBRATION PROFILE (institutional bordered block)
        // ════════════════════════════════════════════════════════════════
        $this->drawSectionHeader($pdf, 'CALIBRATION PROFILE (BOUNDED CONTEXT)');

        $industry = ucwords(str_replace('_', ' ', $payload['industry'] ?? ''));
        $revenueModel = ucwords(str_replace('_', ' ', $payload['revenue_model'] ?? ''));
        $role = ucwords(str_replace('_', ' ', $payload['role'] ?? ''));
        $profileId = $payload['profile_id'] ?? '';
        $engineVer = $payload['engine_version'] ?? '1.0';
        $calibVer = $payload['calibration_version'] ?? '1.0';

        // Bordered block
        $blockY = $pdf->GetY();
        $blockH = 28;
        $pdf->SetDrawColor(...self::GRAY_200);
        $pdf->Rect(18, $blockY, $contentW, $blockH, 'D');

        // 4-column field grid
        $fieldW = $contentW / 4;
        $pdf->SetXY(20, $blockY + 2);
        $pdf->SetFont('helvetica', '', 6.5);
        $pdf->SetTextColor(...self::GRAY_400);
        $pdf->Cell($fieldW, 3, 'Industry', 0, 0, 'L');
        $pdf->Cell($fieldW, 3, 'Revenue Model', 0, 0, 'L');
        $pdf->Cell($fieldW, 3, 'Role', 0, 0, 'L');
        $pdf->Cell($fieldW, 3, 'Profile ID', 0, 1, 'L');

        $pdf->SetXY(20, $blockY + 5);
        $pdf->SetFont('helvetica', 'B', 8.5);
        $pdf->SetTextColor(...self::NAVY);
        $pdf->Cell($fieldW, 4, $industry, 0, 0, 'L');
        $pdf->Cell($fieldW, 4, $revenueModel, 0, 0, 'L');
        $pdf->Cell($fieldW, 4, $role, 0, 0, 'L');
        $pdf->SetFont('helvetica', '', 8.5);
        $pdf->Cell($fieldW, 4, $profileId, 0, 1, 'L');

        // Divider inside block
        $pdf->SetXY(20, $blockY + 11);
        $pdf->SetDrawColor(...self::GRAY_200);
        $pdf->Line(20, $blockY + 11, 18 + $contentW - 2, $blockY + 11);

        // Disclosure text
        $pdf->SetXY(20, $blockY + 13);
        $pdf->SetFont('helvetica', '', 7);
        $pdf->SetTextColor(...self::GRAY_600);
        $pdf->MultiCell($contentW - 4, 3, 'Calibrated to selected industry, revenue model, and role using bounded group-level emphasis. Core structural logic remains unchanged.', 0, 'L');

        // Engine versions
        $pdf->SetXY(20, $blockY + 22);
        $pdf->SetFont('helvetica', '', 7);
        $pdf->SetTextColor(...self::GRAY_400);
        $pdf->Cell(35, 3, 'Engine: ' . $engineVer, 0, 0, 'L');
        $pdf->Cell(45, 3, 'Calibration: ' . $calibVer, 0, 1, 'L');

        $pdf->SetY($blockY + $blockH + 3);

        // ════════════════════════════════════════════════════════════════
        // Section 8: FOOTER
        // ════════════════════════════════════════════════════════════════

        // Deterministic statement
        $pdf->SetFont('helvetica', '', 7.5);
        $pdf->SetTextColor(...self::GRAY_600);
        $pdf->Cell($contentW, 4, 'Results reflect deterministic scoring based solely on submitted structural inputs.', 0, 1, 'L');
        $pdf->Ln(1);

        // Disclaimer
        $pdf->SetFont('helvetica', '', 6.5);
        $pdf->SetTextColor(...self::GRAY_400);
        $disclaimer = 'Disclaimer: RunPayway is a structural classification tool. The Payway Rating is a deterministic output based on user inputs and a fixed scoring model. It does not constitute financial, legal, tax, or investment advice. Results are not personalized, AI-generated, or manually reviewed. The accuracy of results depends on the accuracy of inputs provided. RunPayway does not predict, forecast, or guarantee any financial outcome.';
        $pdf->MultiCell($contentW, 3, $disclaimer, 0, 'L');
        $pdf->Ln(2);

        // Bottom: copyright left, logo + domain right
        $pdf->SetFont('helvetica', '', 6.5);
        $pdf->SetTextColor(...self::GRAY_400);
        $pdf->Cell($contentW / 2, 3.5, chr(169) . ' 2026 RunPayway — Operated by PeopleStar Enterprises, Inc.', 0, 0, 'L');

        $bottomY = $pdf->GetY();
        if (file_exists($logoPath)) {
            $pdf->Image($logoPath, 18 + $contentW - 40, $bottomY - 2, 35, 0, '', '', '', false, 300);
        }
        $pdf->SetXY(18 + $contentW - 40, $bottomY + (file_exists($logoPath) ? 6 : 0));
        $pdf->SetFont('helvetica', '', 6.5);
        $pdf->SetTextColor(...self::GRAY_400);
        $pdf->Cell(40, 3.5, 'RunPayway.com', 0, 0, 'R');

        // Output PDF
        $pdf->Output($filepath, 'F');

        return $filepath;
    }

    /**
     * Get a filepath for a previously generated report.
     */
    public function getReportPath(string $assessmentId): string
    {
        return $this->reportsDir . "RunPayway-Report-{$assessmentId}.pdf";
    }

    /**
     * Check if a report PDF exists.
     */
    public function reportExists(string $assessmentId): bool
    {
        return file_exists($this->getReportPath($assessmentId));
    }

    // ── Helper: Section header ──────────────────────────────────────────

    private function drawSectionHeader(\TCPDF $pdf, string $title): void
    {
        $pdf->SetFont('helvetica', 'B', 8);
        $pdf->SetTextColor(...self::GRAY_400);
        $pdf->Cell(0, 5, $title, 0, 1, 'L');
        $pdf->Ln(1);
    }

    // ── Helper: Divider line ────────────────────────────────────────────

    private function drawDivider(\TCPDF $pdf, float $contentW): void
    {
        $pdf->SetDrawColor(...self::GRAY_200);
        $pdf->Line(18, $pdf->GetY(), 18 + $contentW, $pdf->GetY());
        $pdf->Ln(3);
    }

    // ── Helper: Segmented band bar (no pointer, no badge) ───────────────

    private function drawSegmentedBandBar(\TCPDF $pdf, int $score, float $x, float $y, float $totalW): void
    {
        $barMargin = 20;
        $barW = $totalW - ($barMargin * 2);
        $barX = $x + $barMargin;
        $segW = $barW / 4;
        $barH = 3;

        $activeBandIdx = 0;
        foreach (self::BAND_DEFS as $i => $b) {
            if ($score >= $b['min'] && $score <= $b['max']) {
                $activeBandIdx = $i;
                break;
            }
        }

        foreach (self::BAND_DEFS as $i => $b) {
            $segX = $barX + ($i * $segW);

            if ($i === $activeBandIdx) {
                $pdf->SetFillColor(...$b['color']);
            } else {
                $pdf->SetFillColor(60, 70, 90);
            }

            $gap = ($i < 3) ? 1 : 0;
            $pdf->Rect($segX, $y, $segW - $gap, $barH, 'F');
        }

        // Range labels
        $pdf->SetFont('helvetica', '', 5.5);
        foreach (self::BAND_DEFS as $i => $b) {
            $segX = $barX + ($i * $segW);
            $pdf->SetXY($segX, $y + $barH + 1);

            if ($i === $activeBandIdx) {
                $pdf->SetTextColor(...self::WHITE);
            } else {
                $pdf->SetTextColor(120, 130, 150);
            }

            $pdf->Cell($segW, 3, $b['min'] . '-' . $b['max'], 0, 0, 'C');
        }
    }

    // ── Helper: Strip "Impact"/"Sensitivity" suffix ─────────────────────

    private function stripSuffix(string $label): string
    {
        $label = preg_replace('/ Impact$/', '', $label);
        $label = preg_replace('/ Sensitivity$/', '', $label);
        return $label;
    }
}
