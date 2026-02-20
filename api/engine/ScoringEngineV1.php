<?php

declare(strict_types=1);

/**
 * RunPayway Phase 4 Scoring Engine v1.0
 *
 * LOCKED deterministic scoring system. No deviation from specification.
 *
 * Answer value map:  A=0, B=1, C=3, D=4  (no 2-point score)
 *
 * Variable groups:
 *   Core Revenue Flow : Q1-Q4
 *   Modifiers         : Q5-Q8
 *   Stability         : Q9-Q12
 *
 * Base integer weights (before calibration):
 *   Core=150, Modifiers=100, Stability=75
 */
final class RunPaywayScoringV1
{
    public const ENGINE_VERSION = '1.0';

    public const ANSWER_MAP = [
        'A' => 0,
        'B' => 1,
        'C' => 3,
        'D' => 4,
    ];

    public const BANDS = [
        [80, 100, 'Structurally Supported'],
        [60, 79,  'Mixed Structural Support'],
        [40, 59,  'Attention-Weighted'],
        [0,  39,  'Attention-Dependent'],
    ];

    private const CORE_QUESTIONS     = ['q1', 'q2', 'q3', 'q4'];
    private const MODIFIER_QUESTIONS = ['q5', 'q6', 'q7', 'q8'];
    private const STABILITY_QUESTIONS = ['q9', 'q10', 'q11', 'q12'];

    /**
     * Compute the RunPayway score from 12 validated responses.
     *
     * @param array    $responses  Associative array keyed q1-q12, values A/B/C/D.
     * @param int      $coreWeight Calibrated core weight (default 150).
     * @param int      $modWeight  Calibrated modifier weight (default 100).
     * @param int      $stabWeight Calibrated stability weight (default 75).
     * @param int|null $rmaxInt    Override for R_max_int; null = auto-calculate.
     *
     * @return array Scoring result envelope.
     *
     * @throws \InvalidArgumentException On missing or invalid responses.
     */
    public static function compute(
        array $responses,
        int $coreWeight = 150,
        int $modWeight = 100,
        int $stabWeight = 75,
        ?int $rmaxInt = null
    ): array {
        // --- 1. Validate all 12 responses present, each A/B/C/D ---------------
        $allKeys = array_merge(self::CORE_QUESTIONS, self::MODIFIER_QUESTIONS, self::STABILITY_QUESTIONS);
        $validAnswers = array_keys(self::ANSWER_MAP);

        foreach ($allKeys as $key) {
            if (!array_key_exists($key, $responses)) {
                throw new \InvalidArgumentException(
                    sprintf('Missing required response: %s. All 12 responses (q1-q12) are required.', $key)
                );
            }

            $value = $responses[$key];

            if (!is_string($value) || !in_array($value, $validAnswers, true)) {
                throw new \InvalidArgumentException(
                    sprintf(
                        'Invalid response for %s: expected one of A, B, C, D — received %s.',
                        $key,
                        is_string($value) ? "\"$value\"" : gettype($value)
                    )
                );
            }
        }

        // --- 2. Map responses to numeric values --------------------------------
        $mapped = [];
        foreach ($allKeys as $key) {
            $mapped[$key] = self::ANSWER_MAP[$responses[$key]];
        }

        // --- 3. Compute weighted subtotals -------------------------------------
        $coreWeightedInt = 0;
        foreach (self::CORE_QUESTIONS as $key) {
            $coreWeightedInt += $mapped[$key] * $coreWeight;
        }

        $modWeightedInt = 0;
        foreach (self::MODIFIER_QUESTIONS as $key) {
            $modWeightedInt += $mapped[$key] * $modWeight;
        }

        $stabWeightedInt = 0;
        foreach (self::STABILITY_QUESTIONS as $key) {
            $stabWeightedInt += $mapped[$key] * $stabWeight;
        }

        $rawInt = $coreWeightedInt + $modWeightedInt + $stabWeightedInt;

        // --- 4. Compute R_max_int ----------------------------------------------
        // 4 questions per group * max answer value (4) * weight
        $computedRmax = (4 * 4 * $coreWeight) + (4 * 4 * $modWeight) + (4 * 4 * $stabWeight);
        $rmax = $rmaxInt ?? $computedRmax;

        // --- 5. ScoreExact (2 decimal places) ----------------------------------
        $scoreExact = round(($rawInt / $rmax) * 100, 2);

        // --- 6. DisplayScore (integer, round half up) --------------------------
        $displayScore = (int) round($scoreExact, 0, PHP_ROUND_HALF_UP);

        // --- 7. Clamp 0-100 ----------------------------------------------------
        if ($displayScore < 0) {
            $displayScore = 0;
        } elseif ($displayScore > 100) {
            $displayScore = 100;
        }

        // --- 8. Determine band from DisplayScore -------------------------------
        $band = self::determineBand($displayScore);

        // --- 5b. Subscore percentages ------------------------------------------
        $corePct      = round(($coreWeightedInt / (4 * 4 * $coreWeight)) * 100, 2);
        $modifiersPct = round(($modWeightedInt  / (4 * 4 * $modWeight))  * 100, 2);
        $stabilityPct = round(($stabWeightedInt / (4 * 4 * $stabWeight)) * 100, 2);

        // --- 6. Return envelope ------------------------------------------------
        return [
            'engine_version'   => self::ENGINE_VERSION,
            'score_exact'      => $scoreExact,
            'display_score'    => $displayScore,
            'band'             => $band,
            'core_weighted_int' => $coreWeightedInt,
            'mod_weighted_int'  => $modWeightedInt,
            'stab_weighted_int' => $stabWeightedInt,
            'raw_int'          => $rawInt,
            'rmax_int'         => $rmax,
            'core_pct'         => $corePct,
            'modifiers_pct'    => $modifiersPct,
            'stability_pct'    => $stabilityPct,
        ];
    }

    /**
     * Map a display score (0-100) to its band label.
     */
    private static function determineBand(int $displayScore): string
    {
        foreach (self::BANDS as [$low, $high, $label]) {
            if ($displayScore >= $low && $displayScore <= $high) {
                return $label;
            }
        }

        // Fallback — should never be reached after clamping.
        return 'Attention-Dependent';
    }
}
