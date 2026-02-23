<?php

declare(strict_types=1);

/**
 * Deterministic Structural Position Summary Generator
 *
 * Generates the combined Structural Position text containing:
 * 1. Structural Identity line (bold)
 * 2. 2-3 sentence concise explanation
 * 3. Primary Structural Constraint sentence
 *
 * This text is stored in the output_payload and reused identically
 * on both the web report and PDF. No client-side re-generation.
 */
final class PositionSummary
{
    /**
     * Map pressure_label to lowercase disruption sensitivity term.
     */
    private static function getPressureBandLower(string $pressureLabel): string
    {
        $label = strtolower($pressureLabel);
        if (str_contains($label, 'lower')) {
            return 'lower';
        }
        if (str_contains($label, 'moderate')) {
            return 'moderate';
        }
        if (str_contains($label, 'elevated')) {
            return 'elevated';
        }
        return 'high';
    }

    /**
     * Generate the deterministic structural position text.
     *
     * @param array $payload The output payload (19+ field).
     * @return string Combined structural position text.
     */
    public static function generate(array $payload): string
    {
        $dependencyClass = $payload['dependency_classification'] ?? 'Attention-Dependent';
        $pressureLabel = $payload['structural_pressure_label'] ?? 'Moderate Sensitivity';
        $pressureBand = self::getPressureBandLower($pressureLabel);

        // 1. Structural Identity line
        $identity = "Structural Identity: {$dependencyClass} with {$pressureBand} disruption sensitivity.";

        // 2. Concise explanation (max 3 sentences based on score ranges)
        $rating = (int) ($payload['payway_rating'] ?? 0);
        $sPct = (int) ($payload['structure_supported_composition_pct'] ?? 0);
        $explanation = [];

        // Revenue continuation assessment
        if ($sPct <= 39) {
            $explanation[] = 'Revenue continuation is highly presence-dependent, with minimal structural support sustaining income when direct involvement is removed.';
        } elseif ($sPct <= 59) {
            $explanation[] = 'Revenue continuation is partially system-supported, with meaningful reliance on direct involvement to maintain income levels.';
        } elseif ($sPct <= 79) {
            $explanation[] = 'Revenue continuation is mostly system-supported, with residual dependence on direct involvement for a portion of income.';
        } else {
            $explanation[] = 'Revenue continuation is strongly system-supported and minimally dependent on direct involvement.';
        }

        // Pressure sensitivity context
        if (str_contains(strtolower($pressureLabel), 'lower')) {
            $explanation[] = 'Structural pressure sensitivity is low under normal disruption conditions.';
        } elseif (str_contains(strtolower($pressureLabel), 'moderate')) {
            $explanation[] = 'Structural pressure sensitivity is moderate; continuity can degrade under disruption without reinforcement.';
        } else {
            $explanation[] = 'Structural pressure sensitivity is elevated; continuity is disruption-sensitive without strong structural controls.';
        }

        // 3. Primary Structural Constraint with Direction Guard prefix
        $constraint = $payload['structural_direction_indicator'] ?? '';
        $constraintLine = '';
        if ($constraint !== '') {
            $prefix = '';
            if ($rating >= 80) {
                $prefix = 'Within structurally supported range, ';
            } elseif ($rating <= 39) {
                $prefix = 'Within attention-dependent range, ';
            }
            // Lowercase first char of constraint when prefixed
            $constraintText = $prefix !== ''
                ? $prefix . lcfirst($constraint)
                : $constraint;
            $constraintLine = "Primary Structural Constraint: {$constraintText}";
        }

        // Assemble
        $parts = [$identity];
        $parts[] = implode(' ', $explanation);
        if ($constraintLine !== '') {
            $parts[] = $constraintLine;
        }

        return implode("\n\n", $parts);
    }
}
