<?php

declare(strict_types=1);

/**
 * RunPayway Phase 5 Calibration Engine v1.0
 *
 * Applies group-level weight adjustments based on Industry, Revenue Model,
 * and Role. Does NOT change Phase 4 scoring logic -- only adjusts the
 * weights that get passed into the scoring engine.
 */
final class RunPaywayCalibrationV1
{
    // ── version ──────────────────────────────────────────────────────────
    public const CALIBRATION_VERSION = '1.0';

    // ── base weights (Phase 4) ───────────────────────────────────────────
    public const BASE_CORE = 150;
    public const BASE_MOD  = 100;
    public const BASE_STAB = 75;

    // ── guardrails ───────────────────────────────────────────────────────
    public const CORE_MIN = 150;
    public const CORE_MAX = 180;
    public const MOD_MIN  = 90;
    public const MOD_MAX  = 130;
    public const STAB_MIN = 70;
    public const STAB_MAX = 100;

    // ── revenue model profiles (LOCKED) ──────────────────────────────────
    private const REVENUE_PROFILES = [
        'TRANSACTIONAL'         => ['core' => 155, 'mod' => 115, 'stab' => 80],
        'COMMISSION'            => ['core' => 160, 'mod' => 120, 'stab' => 80],
        'PROJECT_FIXED'         => ['core' => 165, 'mod' => 110, 'stab' => 85],
        'CONTRACT_FIXED'        => ['core' => 165, 'mod' => 105, 'stab' => 90],
        'RETAINER_SUBSCRIPTION' => ['core' => 170, 'mod' => 105, 'stab' => 95],
        'USAGE_BASED'           => ['core' => 170, 'mod' => 110, 'stab' => 95],
        'LICENSING_ROYALTY'     => ['core' => 165, 'mod' => 100, 'stab' => 95],
        'HYBRID'                => ['core' => 155, 'mod' => 105, 'stab' => 85],
        'ASSET_LEASE'           => ['core' => 165, 'mod' => 100, 'stab' => 100],
    ];

    // ── role deltas (LOCKED) ─────────────────────────────────────────────
    private const ROLE_DELTAS = [
        'OWNER'                => ['core' => +5, 'mod' =>  0, 'stab' => +5],
        'MANAGING_PARTNER'     => ['core' => +5, 'mod' =>  0, 'stab' => +5],
        'LICENSED_AGENT'       => ['core' =>  0, 'mod' => +5, 'stab' =>  0],
        'CONSULTANT'           => ['core' => +5, 'mod' =>  0, 'stab' =>  0],
        'SALES_PRODUCER'       => ['core' =>  0, 'mod' => +5, 'stab' => +5],
        'EXEC_OPERATOR'        => ['core' =>  0, 'mod' =>  0, 'stab' => +5],
        'DELIVERY_SPECIALIST'  => ['core' =>  0, 'mod' =>  0, 'stab' => +5],
        'CREATOR'              => ['core' => +5, 'mod' =>  0, 'stab' =>  0],
        'FRANCHISE_OPERATOR'   => ['core' =>  0, 'mod' => +5, 'stab' =>  0],
        'PASSIVE_OWNER'        => ['core' => -5, 'mod' =>  0, 'stab' => +5],
    ];

    // ── industry micro adjustments (LOCKED) ──────────────────────────────
    private const INDUSTRY_DELTAS = [
        'TECH_SAAS'              => ['core' =>  0, 'mod' =>  0, 'stab' => +5],
        'REAL_ESTATE'            => ['core' =>  0, 'mod' => +5, 'stab' =>  0],
        'FINANCIAL_SERVICES'     => ['core' => +5, 'mod' =>  0, 'stab' =>  0],
        'LEGAL_SERVICES'         => ['core' => +5, 'mod' =>  0, 'stab' =>  0],
        'HEALTHCARE_SERVICES'    => ['core' => +5, 'mod' =>  0, 'stab' =>  0],
        'HOME_FIELD_SERVICES'    => ['core' =>  0, 'mod' => +5, 'stab' =>  0],
        'MANUFACTURING'          => ['core' =>  0, 'mod' =>  0, 'stab' => +5],
        'RETAIL_ECOMMERCE'       => ['core' =>  0, 'mod' => +5, 'stab' =>  0],
        'MEDIA_CONTENT'          => ['core' => +5, 'mod' =>  0, 'stab' =>  0],
        'CONSTRUCTION'           => ['core' =>  0, 'mod' => +5, 'stab' =>  0],
        'EDUCATION_TRAINING'     => ['core' => +5, 'mod' =>  0, 'stab' =>  0],
        'PROFESSIONAL_SERVICES'  => ['core' => +5, 'mod' =>  0, 'stab' =>  0],
    ];

    /**
     * Calibrate weights for the given revenue model, role, and industry.
     *
     * @param  string $revenueModel  Revenue model key (case-insensitive)
     * @param  string $role          Role key (case-insensitive)
     * @param  string $industry      Industry key (case-insensitive)
     * @return array{
     *     calibration_version: string,
     *     profile_id: string,
     *     core_weight_int: int,
     *     mod_weight_int: int,
     *     stab_weight_int: int,
     *     rmax_int_calibrated: int
     * }
     * @throws \InvalidArgumentException If revenue model is not recognised
     */
    public static function calibrate(
        string $revenueModel,
        string $role,
        string $industry,
    ): array {
        // 1. Normalise inputs
        $revenueModel = strtoupper($revenueModel);
        $role         = strtoupper($role);
        $industry     = strtoupper($industry);

        // 2. Validate revenue model
        if (!isset(self::REVENUE_PROFILES[$revenueModel])) {
            throw new \InvalidArgumentException(
                sprintf('Unknown revenue model: "%s"', $revenueModel),
            );
        }

        // 3. Start with revenue model base profile
        $core = self::REVENUE_PROFILES[$revenueModel]['core'];
        $mod  = self::REVENUE_PROFILES[$revenueModel]['mod'];
        $stab = self::REVENUE_PROFILES[$revenueModel]['stab'];

        // 4. Apply role deltas (if role exists)
        if (isset(self::ROLE_DELTAS[$role])) {
            $core += self::ROLE_DELTAS[$role]['core'];
            $mod  += self::ROLE_DELTAS[$role]['mod'];
            $stab += self::ROLE_DELTAS[$role]['stab'];
        }

        // 5. Apply industry micro adjustment (if industry exists)
        if (isset(self::INDUSTRY_DELTAS[$industry])) {
            $core += self::INDUSTRY_DELTAS[$industry]['core'];
            $mod  += self::INDUSTRY_DELTAS[$industry]['mod'];
            $stab += self::INDUSTRY_DELTAS[$industry]['stab'];
        }

        // 6. Clamp to guardrails
        $core = self::clamp($core, self::CORE_MIN, self::CORE_MAX);
        $mod  = self::clamp($mod,  self::MOD_MIN,  self::MOD_MAX);
        $stab = self::clamp($stab, self::STAB_MIN, self::STAB_MAX);

        // 7. Enforce structural ordering: core >= mod >= stab
        if ($mod > $core) {
            $mod = $core;
        }
        if ($stab > $mod) {
            $stab = $mod;
        }

        // 8. Compute rmax
        $rmax = 16 * ($core + $mod + $stab);

        // 9. Generate profile_id
        $profileId = sprintf(
            'CALv1|REV=%s|ROLE=%s|IND=%s',
            $revenueModel,
            $role,
            $industry,
        );

        return [
            'calibration_version' => self::CALIBRATION_VERSION,
            'profile_id'          => $profileId,
            'core_weight_int'     => $core,
            'mod_weight_int'      => $mod,
            'stab_weight_int'     => $stab,
            'rmax_int_calibrated' => $rmax,
        ];
    }

    /**
     * Clamp an integer value between a minimum and maximum.
     */
    private static function clamp(int $value, int $min, int $max): int
    {
        if ($value < $min) {
            return $min;
        }
        if ($value > $max) {
            return $max;
        }
        return $value;
    }
}
