<?php

declare(strict_types=1);

require_once __DIR__ . '/PositionSummary.php';

/**
 * RunPayway Phase 6 Output Logic v1.0
 *
 * Deterministic Artifact Generation Layer.
 * Takes the scoring engine output + calibration output and produces
 * the full report payload (19 fields, LOCKED specification).
 *
 * No deviation from specification.
 */
final class RunPaywayOutputV1
{
    public const OUTPUT_VERSION = '1.0';

    // ── dependency classification bands (LOCKED) ──────────────────────────
    private const DEPENDENCY_BANDS = [
        [80, 100, 'Structurally Supported'],
        [60, 79,  'Mixed Structural Support'],
        [40, 59,  'Attention-Weighted'],
        [0,  39,  'Attention-Dependent'],
    ];

    // ── structural pressure sensitivity labels (LOCKED) ───────────────────
    private const PRESSURE_LABELS = [
        [0,  24, 'Lower Sensitivity'],
        [25, 49, 'Moderate Sensitivity'],
        [50, 74, 'Elevated Sensitivity'],
        [75, 100, 'High Sensitivity'],
    ];

    // ── attention dependence impact labels (LOCKED) ───────────────────────
    private const ATTENTION_LABELS = [
        [0,  19, 'Lower Impact'],
        [20, 44, 'Moderate Impact'],
        [45, 69, 'Elevated Impact'],
        [70, 100, 'High Impact'],
    ];

    /**
     * Generate the full RunPayway report artifact.
     *
     * @param array  $scoringResult     Output from RunPaywayScoringV1::compute().
     * @param array  $calibrationResult Output from RunPaywayCalibrationV1::calibrate().
     * @param array  $responses         Associative array keyed q1-q12, values A/B/C/D.
     * @param string $assessmentId      Unique assessment identifier.
     * @param string $assessmentDate    Assessment date string.
     *
     * @return array LOCKED 19-field report payload.
     */
    public static function generate(
        array $scoringResult,
        array $calibrationResult,
        array $responses,
        string $assessmentId,
        string $assessmentDate,
    ): array {
        // ── extract scoring inputs ────────────────────────────────────────
        $displayScore  = (int) $scoringResult['display_score'];
        $corePct       = (float) $scoringResult['core_pct'];
        $modifiersPct  = (float) $scoringResult['modifiers_pct'];
        $stabilityPct  = (float) $scoringResult['stability_pct'];
        $engineVersion = (string) $scoringResult['engine_version'];

        // ── extract calibration inputs ────────────────────────────────────
        $calibrationVersion = (string) $calibrationResult['calibration_version'];
        $profileId          = (string) $calibrationResult['profile_id'];

        // ── extract context from profile_id ───────────────────────────────
        $industry    = self::extractProfileField($profileId, 'IND');
        $revenueModel = self::extractProfileField($profileId, 'REV');
        $role        = self::extractProfileField($profileId, 'ROLE');

        // ── normalise responses to uppercase ──────────────────────────────
        $norm = [];
        foreach ($responses as $key => $value) {
            $norm[strtolower($key)] = strtoupper((string) $value);
        }

        // ── 1. Payway Rating ──────────────────────────────────────────────
        $paywayRating = $displayScore;

        // ── 2. Dependency Classification ──────────────────────────────────
        $dependencyClassification = self::getDependencyClassification($displayScore);

        // ── 3. Structure Composition % ────────────────────────────────────
        [$structureSupported, $directInvolvement] = self::computeStructureComposition(
            $corePct,
            $modifiersPct,
            $stabilityPct,
        );

        // ── 4. Structural Pressure Sensitivity ────────────────────────────
        $pressureIndex = self::computePressureIndex($corePct, $modifiersPct, $stabilityPct);
        $pressureLabel = self::getPressureLabel($pressureIndex);

        // ── 5. Attention Dependence Impact ────────────────────────────────
        $attentionPct   = $directInvolvement;
        $attentionLabel = self::getAttentionLabel($attentionPct);

        // ── 6. Contract Disruption Impact ─────────────────────────────────
        $contractDisruptionLabel = self::getContractDisruptionLabel(
            $norm['q7'] ?? '',
            $norm['q3'] ?? '',
        );

        // ── 7. Client Turnover Impact ─────────────────────────────────────
        $clientTurnoverLabel = self::getClientTurnoverLabel(
            $norm['q5'] ?? '',
            $norm['q6'] ?? '',
        );

        // ── 8. Structural Direction Indicator ─────────────────────────────
        $structuralDirection = self::getStructuralDirection($corePct, $modifiersPct, $stabilityPct);

        // ── assemble output payload ──────────────────────────────────────
        $payload = [
            'payway_rating'                      => $paywayRating,
            'dependency_classification'          => $dependencyClassification,
            'structure_supported_composition_pct' => $structureSupported,
            'direct_involvement_composition_pct'  => $directInvolvement,
            'structural_pressure_index'          => $pressureIndex,
            'structural_pressure_label'          => $pressureLabel,
            'attention_dependence_pct'           => $attentionPct,
            'attention_dependence_label'         => $attentionLabel,
            'contract_disruption_impact_label'   => $contractDisruptionLabel,
            'client_turnover_impact_label'       => $clientTurnoverLabel,
            'structural_direction_indicator'     => $structuralDirection,
            'industry'                           => $industry,
            'revenue_model'                      => $revenueModel,
            'role'                               => $role,
            'profile_id'                         => $profileId,
            'engine_version'                     => $engineVersion,
            'calibration_version'                => $calibrationVersion,
            'assessment_id'                      => $assessmentId,
            'assessment_date'                    => $assessmentDate,
        ];

        // ── field #20: server-generated structural position text ─────────
        $payload['structural_position_text'] = PositionSummary::generate($payload);

        return $payload;
    }

    // ── helper: dependency classification ──────────────────────────────────

    /**
     * Map display_score (0-100) to its dependency classification label.
     */
    private static function getDependencyClassification(int $score): string
    {
        foreach (self::DEPENDENCY_BANDS as [$low, $high, $label]) {
            if ($score >= $low && $score <= $high) {
                return $label;
            }
        }
        return 'Attention-Dependent';
    }

    // ── helper: structure composition ──────────────────────────────────────

    /**
     * Compute structure_supported % and direct_involvement %.
     * Must sum to exactly 100.
     *
     * @return array{0: int, 1: int} [structure_supported, direct_involvement]
     */
    private static function computeStructureComposition(
        float $corePct,
        float $modifiersPct,
        float $stabilityPct,
    ): array {
        $c = $corePct;
        $m = $modifiersPct;
        $s = $stabilityPct;
        $total = $c + $m + $s;

        if ($total == 0.0) {
            return [0, 100];
        }

        $structureSupported = (int) round((($c + $s) / $total) * 100, 0, PHP_ROUND_HALF_UP);
        $directInvolvement  = 100 - $structureSupported;

        return [$structureSupported, $directInvolvement];
    }

    // ── helper: structural pressure index ─────────────────────────────────

    /**
     * Compute the structural pressure index (0-100).
     */
    private static function computePressureIndex(
        float $corePct,
        float $modifiersPct,
        float $stabilityPct,
    ): int {
        $raw = 0.50 * (100 - $modifiersPct)
             + 0.25 * (100 - $corePct)
             + 0.25 * (100 - $stabilityPct);

        $index = (int) round($raw, 0, PHP_ROUND_HALF_UP);

        // Clamp to 0-100
        if ($index < 0) {
            $index = 0;
        } elseif ($index > 100) {
            $index = 100;
        }

        return $index;
    }

    // ── helper: pressure label ────────────────────────────────────────────

    /**
     * Map pressure index to its sensitivity label.
     */
    private static function getPressureLabel(int $index): string
    {
        foreach (self::PRESSURE_LABELS as [$low, $high, $label]) {
            if ($index >= $low && $index <= $high) {
                return $label;
            }
        }
        return 'High Sensitivity';
    }

    // ── helper: attention dependence label ─────────────────────────────────

    /**
     * Map direct involvement % to its attention dependence impact label.
     */
    private static function getAttentionLabel(int $directInvolvementPct): string
    {
        foreach (self::ATTENTION_LABELS as [$low, $high, $label]) {
            if ($directInvolvementPct >= $low && $directInvolvementPct <= $high) {
                return $label;
            }
        }
        return 'High Impact';
    }

    // ── helper: contract disruption impact ─────────────────────────────────

    /**
     * Determine contract disruption impact from Q7 and Q3 (LOCKED logic).
     */
    private static function getContractDisruptionLabel(string $q7, string $q3): string
    {
        if (in_array($q7, ['A', 'B'], true) || in_array($q3, ['A', 'B'], true)) {
            return 'High Impact';
        }
        if ($q7 === 'C' && $q3 === 'C') {
            return 'Moderate Impact';
        }
        if ($q7 === 'D' && $q3 === 'D') {
            return 'Lower Impact';
        }
        return 'Elevated Impact';
    }

    // ── helper: client turnover impact ─────────────────────────────────────

    /**
     * Determine client turnover impact from Q5 and Q6 (LOCKED logic).
     */
    private static function getClientTurnoverLabel(string $q5, string $q6): string
    {
        if ($q5 === 'A') {
            return 'High Impact';
        }
        if ($q5 === 'B' && in_array($q6, ['A', 'B'], true)) {
            return 'Elevated Impact';
        }
        if (in_array($q5, ['C', 'D'], true) && in_array($q6, ['C', 'D'], true)) {
            return 'Lower Impact';
        }
        return 'Moderate Impact';
    }

    // ── helper: structural direction indicator ─────────────────────────────

    /**
     * Identify the primary constraint based on the lowest subscore.
     * Tie-breaking priority: core > modifiers > stability.
     */
    private static function getStructuralDirection(
        float $corePct,
        float $modifiersPct,
        float $stabilityPct,
    ): string {
        $min = min($corePct, $modifiersPct, $stabilityPct);

        // Priority: core > modifiers > stability (pick core first if tied)
        if ($corePct <= $min) {
            return 'Primary constraint is revenue mechanics (initiation, fulfillment, collection, stability).';
        }
        if ($modifiersPct <= $min) {
            return 'Primary constraint is exposure control (concentration, duration, timing, replacement).';
        }
        return 'Primary constraint is continuity resilience (transferability, monitoring, automation, absence tolerance).';
    }

    // ── helper: extract field from profile_id ──────────────────────────────

    /**
     * Extract a named field from the profile_id string.
     * Format: "CALv1|REV=...|ROLE=...|IND=..."
     */
    private static function extractProfileField(string $profileId, string $field): string
    {
        $parts = explode('|', $profileId);
        foreach ($parts as $part) {
            if (str_starts_with($part, $field . '=')) {
                return substr($part, strlen($field) + 1);
            }
        }
        return '';
    }
}
