<?php

declare(strict_types=1);

/**
 * RunPayway PDF Report Generator
 *
 * Generates the official RunPayway Report as a PDF using TCPDF.
 * Matches the Phase 2 report layout specification.
 *
 * Requires TCPDF library installed via Composer or manual include.
 * composer require tecnickcom/tcpdf
 */

// Attempt to load TCPDF
$tcpdfAutoload = __DIR__ . '/../vendor/autoload.php';
if (file_exists($tcpdfAutoload)) {
    require_once $tcpdfAutoload;
}

class ReportGenerator
{
    private string $reportsDir;

    public function __construct()
    {
        $this->reportsDir = __DIR__ . '/../reports/';
        if (!is_dir($this->reportsDir)) {
            mkdir($this->reportsDir, 0755, true);
        }
    }

    /**
     * Generate a PDF report from the output payload.
     *
     * @param  array  $payload   The 19-field output payload from OutputLogicV1
     * @param  string $modelVersion  Model version string (e.g., 'RP-1.0')
     * @return string Path to the generated PDF file
     * @throws \RuntimeException If TCPDF is not available
     */
    public function generate(array $payload, string $modelVersion = 'RP-1.0'): string
    {
        if (!class_exists('TCPDF')) {
            throw new \RuntimeException(
                'TCPDF library is not installed. Run: composer require tecnickcom/tcpdf'
            );
        }

        $assessmentId = $payload['assessment_id'] ?? 'UNKNOWN';
        $filename = "RunPayway-Report-{$assessmentId}.pdf";
        $filepath = $this->reportsDir . $filename;

        // Create PDF instance
        $pdf = new \TCPDF('P', 'mm', 'A4', true, 'UTF-8', false);

        // Set document metadata
        $pdf->SetCreator('RunPayway');
        $pdf->SetAuthor('PeopleStar Enterprises, Inc.');
        $pdf->SetTitle("RunPayway Report - {$assessmentId}");
        $pdf->SetSubject('Income Structure Diagnostic Report');

        // Remove default header/footer
        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);

        // Set margins
        $pdf->SetMargins(20, 20, 20);
        $pdf->SetAutoPageBreak(true, 25);

        // Add first page
        $pdf->AddPage();

        // ── Colors ──────────────────────────────────────────────────────────
        $navy = [10, 22, 40];       // #0A1628
        $gray600 = [107, 114, 128]; // #6B7280
        $gray400 = [156, 163, 175]; // #9CA3AF
        $gray200 = [229, 231, 235]; // #E5E7EB
        $white = [255, 255, 255];

        // Band colors
        $bandColors = [
            'Structurally Supported'   => [16, 185, 129],  // emerald
            'Mixed Structural Support'  => [59, 130, 246],  // blue
            'Attention-Weighted'        => [245, 158, 11],  // amber
            'Attention-Dependent'       => [239, 68, 68],   // red
        ];

        // ── Header ──────────────────────────────────────────────────────────
        $pdf->SetFont('helvetica', '', 9);
        $pdf->SetTextColor(...$gray400);
        $pdf->Cell(0, 6, 'INCOME STRUCTURE DIAGNOSTIC', 0, 1, 'L');

        $pdf->SetFont('helvetica', 'B', 22);
        $pdf->SetTextColor(...$navy);
        $pdf->Cell(0, 12, 'RunPayway Report', 0, 1, 'L');

        $pdf->Ln(4);

        // ── Meta Information ────────────────────────────────────────────────
        $assessmentDate = $payload['assessment_date'] ?? date('Y-m-d');
        $industry = str_replace('_', ' ', $payload['industry'] ?? '');
        $revenueModel = str_replace('_', ' ', $payload['revenue_model'] ?? '');
        $role = str_replace('_', ' ', $payload['role'] ?? '');

        $pdf->SetFont('helvetica', '', 8);
        $pdf->SetTextColor(...$gray400);

        $colWidth = 42.5;
        $y = $pdf->GetY();

        $pdf->SetXY(20, $y);
        $pdf->Cell($colWidth, 4, 'Assessment ID', 0, 0, 'L');
        $pdf->Cell($colWidth, 4, 'Date', 0, 0, 'L');
        $pdf->Cell($colWidth, 4, 'Model', 0, 0, 'L');
        $pdf->Cell($colWidth, 4, 'Calibration Profile', 0, 1, 'L');

        $pdf->SetFont('helvetica', 'B', 9);
        $pdf->SetTextColor(...$navy);

        $pdf->SetXY(20, $pdf->GetY());
        $pdf->Cell($colWidth, 5, $assessmentId, 0, 0, 'L');
        $pdf->Cell($colWidth, 5, $assessmentDate, 0, 0, 'L');
        $pdf->Cell($colWidth, 5, $modelVersion, 0, 0, 'L');

        $pdf->SetFont('helvetica', '', 8);
        $profileText = ucwords($industry) . ' / ' . ucwords($revenueModel) . ' / ' . ucwords($role);
        $pdf->Cell($colWidth, 5, $profileText, 0, 1, 'L');

        $pdf->Ln(4);

        // Divider
        $pdf->SetDrawColor(...$gray200);
        $pdf->Line(20, $pdf->GetY(), 190, $pdf->GetY());
        $pdf->Ln(6);

        // ── Payway Rating ───────────────────────────────────────────────────
        $rating = (int)($payload['payway_rating'] ?? 0);
        $bandLabel = $payload['dependency_classification'] ?? 'Attention-Dependent';
        $bandColor = $bandColors[$bandLabel] ?? [239, 68, 68];

        $pdf->SetFont('helvetica', '', 9);
        $pdf->SetTextColor(...$gray400);
        $pdf->Cell(0, 5, 'PAYWAY RATING', 0, 1, 'L');
        $pdf->Ln(2);

        // Rating box
        $boxX = 20;
        $boxY = $pdf->GetY();
        $pdf->SetFillColor(...$bandColor);
        $pdf->SetTextColor(...$white);
        $pdf->SetFont('helvetica', 'B', 36);
        $pdf->SetXY($boxX, $boxY);
        $pdf->Cell(40, 30, (string)$rating, 0, 0, 'C', true);

        // Band label
        $pdf->SetXY($boxX + 48, $boxY + 4);
        $pdf->SetTextColor(...$bandColor);
        $pdf->SetFont('helvetica', 'B', 16);
        $pdf->Cell(0, 8, $bandLabel, 0, 1, 'L');

        // Scale bar
        $scaleY = $boxY + 18;
        $scaleX = $boxX + 48;
        $scaleW = 120;
        $segmentW = $scaleW / 4;

        $scaleColors = [
            [239, 68, 68],   // red
            [245, 158, 11],  // amber
            [59, 130, 246],  // blue
            [16, 185, 129],  // emerald
        ];

        foreach ($scaleColors as $i => $color) {
            $pdf->SetFillColor(...$color);
            $pdf->Rect($scaleX + ($i * $segmentW), $scaleY, $segmentW, 3, 'F');
        }

        // Score marker
        $markerX = $scaleX + ($rating / 100) * $scaleW;
        $pdf->SetFillColor(...$navy);
        $pdf->SetXY($markerX - 1.5, $scaleY + 4);
        $pdf->Cell(3, 3, '', 0, 0, 'C', true);

        // Scale labels
        $pdf->SetFont('helvetica', '', 6);
        $pdf->SetTextColor(...$gray400);
        $pdf->SetXY($scaleX, $scaleY + 8);
        $pdf->Cell($segmentW, 3, '0', 0, 0, 'L');
        $pdf->Cell($segmentW, 3, '40', 0, 0, 'L');
        $pdf->Cell($segmentW, 3, '60', 0, 0, 'L');
        $pdf->Cell($segmentW, 3, '80       100', 0, 1, 'L');

        $pdf->SetY($boxY + 36);
        $pdf->Ln(2);

        // Divider
        $pdf->SetDrawColor(...$gray200);
        $pdf->Line(20, $pdf->GetY(), 190, $pdf->GetY());
        $pdf->Ln(6);

        // ── Structural Revenue Composition ──────────────────────────────────
        $structPct = (int)($payload['structure_supported_composition_pct'] ?? 0);
        $directPct = (int)($payload['direct_involvement_composition_pct'] ?? 0);

        $pdf->SetFont('helvetica', '', 9);
        $pdf->SetTextColor(...$gray400);
        $pdf->Cell(0, 5, 'STRUCTURAL REVENUE COMPOSITION', 0, 1, 'L');
        $pdf->Ln(4);

        // Structural bar
        $pdf->SetFont('helvetica', '', 9);
        $pdf->SetTextColor(...$navy);
        $pdf->Cell(100, 5, 'Structural Revenue', 0, 0, 'L');
        $pdf->SetFont('helvetica', 'B', 9);
        $pdf->Cell(0, 5, $structPct . '%', 0, 1, 'R');

        $barY = $pdf->GetY();
        $pdf->SetFillColor(...$gray200);
        $pdf->Rect(20, $barY, 170, 4, 'F');
        $pdf->SetFillColor(...$navy);
        $pdf->Rect(20, $barY, 170 * ($structPct / 100), 4, 'F');
        $pdf->Ln(8);

        // Direct bar
        $pdf->SetFont('helvetica', '', 9);
        $pdf->SetTextColor(...$gray600);
        $pdf->Cell(100, 5, 'Direct Involvement', 0, 0, 'L');
        $pdf->SetFont('helvetica', 'B', 9);
        $pdf->Cell(0, 5, $directPct . '%', 0, 1, 'R');

        $barY = $pdf->GetY();
        $pdf->SetFillColor(...$gray200);
        $pdf->Rect(20, $barY, 170, 4, 'F');
        $pdf->SetFillColor(...$gray600);
        $pdf->Rect(20, $barY, 170 * ($directPct / 100), 4, 'F');
        $pdf->Ln(8);

        // Divider
        $pdf->SetDrawColor(...$gray200);
        $pdf->Line(20, $pdf->GetY(), 190, $pdf->GetY());
        $pdf->Ln(6);

        // ── Structural Exposure Profile ─────────────────────────────────────
        $pdf->SetFont('helvetica', '', 9);
        $pdf->SetTextColor(...$gray400);
        $pdf->Cell(0, 5, 'STRUCTURAL EXPOSURE PROFILE', 0, 1, 'L');
        $pdf->Ln(4);

        $indicators = [
            ['Structural Pressure Sensitivity', $payload['structural_pressure_label'] ?? '', 'Index: ' . ($payload['structural_pressure_index'] ?? 0) . '/100'],
            ['Attention Dependence Impact', $payload['attention_dependence_label'] ?? '', null],
            ['Contract Disruption Impact', $payload['contract_disruption_impact_label'] ?? '', null],
            ['Client Turnover Impact', $payload['client_turnover_impact_label'] ?? '', null],
        ];

        foreach ($indicators as $ind) {
            $y = $pdf->GetY();
            $pdf->SetDrawColor(...$gray200);
            $pdf->Rect(20, $y, 170, 10, 'D');

            $pdf->SetXY(22, $y + 2);
            $pdf->SetFont('helvetica', 'B', 8);
            $pdf->SetTextColor(...$navy);
            $pdf->Cell(90, 5, $ind[0], 0, 0, 'L');

            if ($ind[2]) {
                $pdf->SetFont('helvetica', '', 7);
                $pdf->SetTextColor(...$gray400);
                $pdf->Cell(30, 5, $ind[2], 0, 0, 'R');
            } else {
                $pdf->Cell(30, 5, '', 0, 0, 'R');
            }

            // Severity badge
            $label = $ind[1];
            $badgeColor = $this->getSeverityColor($label);
            $pdf->SetFont('helvetica', 'B', 7);
            $pdf->SetTextColor(...$badgeColor);
            $pdf->Cell(40, 5, strtoupper($label), 0, 0, 'R');

            $pdf->SetY($y + 12);
        }

        $pdf->Ln(2);

        // Divider
        $pdf->SetDrawColor(...$gray200);
        $pdf->Line(20, $pdf->GetY(), 190, $pdf->GetY());
        $pdf->Ln(6);

        // ── Structural Direction Indicator ──────────────────────────────────
        $pdf->SetFont('helvetica', '', 9);
        $pdf->SetTextColor(...$gray400);
        $pdf->Cell(0, 5, 'STRUCTURAL DIRECTION INDICATOR', 0, 1, 'L');
        $pdf->Ln(3);

        $pdf->SetFont('helvetica', '', 9);
        $pdf->SetTextColor(...$navy);
        $direction = $payload['structural_direction_indicator'] ?? '';
        $pdf->MultiCell(170, 5, $direction, 0, 'L');

        $pdf->Ln(8);

        // ── Disclaimer ──────────────────────────────────────────────────────
        $pdf->SetDrawColor(...$gray200);
        $pdf->Line(20, $pdf->GetY(), 190, $pdf->GetY());
        $pdf->Ln(4);

        $pdf->SetFont('helvetica', '', 6.5);
        $pdf->SetTextColor(...$gray400);
        $disclaimer = 'Disclaimer: RunPayway is a structural classification tool. The Payway Rating is a deterministic output based on user inputs and a fixed scoring model. It does not constitute financial, legal, tax, or investment advice. Results are not personalized, AI-generated, or manually reviewed. The accuracy of results depends on the accuracy of inputs provided. RunPayway does not predict, forecast, or guarantee any financial outcome.';
        $pdf->MultiCell(170, 3.5, $disclaimer, 0, 'L');

        $pdf->Ln(3);

        // Version stamps
        $engineVersion = $payload['engine_version'] ?? '1.0';
        $calibVersion = $payload['calibration_version'] ?? '1.0';
        $pdf->SetFont('helvetica', '', 6);
        $pdf->SetTextColor(...$gray400);
        $versionText = "Model: {$modelVersion}  |  Engine: E-{$engineVersion}  |  Calibration: C-{$calibVersion}  |  Output: O-1.0";
        $pdf->Cell(0, 4, $versionText, 0, 1, 'L');

        $pdf->Ln(1);
        $pdf->Cell(0, 4, '© 2026 RunPayway — Operated by PeopleStar Enterprises, Inc.', 0, 1, 'L');

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

    /**
     * Map severity label to color for PDF rendering.
     */
    private function getSeverityColor(string $label): array
    {
        $label = strtolower($label);
        if (str_contains($label, 'lower')) {
            return [16, 185, 129]; // emerald
        }
        if (str_contains($label, 'moderate')) {
            return [59, 130, 246]; // blue
        }
        if (str_contains($label, 'elevated')) {
            return [245, 158, 11]; // amber
        }
        return [239, 68, 68]; // red (high)
    }
}
