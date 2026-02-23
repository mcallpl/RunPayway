<?php
require_once __DIR__ . '/lib/security.php';
setSecurityHeaders();
setCorsHeaders('POST');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

enforceOriginCheck();
enforceRateLimit('create_checkout', 10, 60);

require_once __DIR__ . '/db_connect.php';
require_once __DIR__ . '/stripe_config.php';

// Attempt to load Stripe SDK
$stripeAvailable = false;
$autoloadPath = __DIR__ . '/vendor/autoload.php';
if (file_exists($autoloadPath)) {
    require_once $autoloadPath;
    if (class_exists('\Stripe\Stripe')) {
        $stripeAvailable = true;
    }
}

// Frontend URL for success/cancel redirects
define('FRONTEND_URL', 'https://peoplestar.com/RunPayway');

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true);

    $prepared_for_name = trim($input['prepared_for_name'] ?? '');
    $delivery_email = trim($input['delivery_email'] ?? '');

    // Validate email format if provided
    if ($delivery_email !== '' && !filter_var($delivery_email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid email format']);
        exit;
    }

    // Only use Stripe if SDK is loaded AND keys are real (not placeholders)
    $stripeConfigured = $stripeAvailable
        && defined('STRIPE_SECRET_KEY')
        && strpos(STRIPE_SECRET_KEY, 'REPLACE') === false
        && strlen(STRIPE_SECRET_KEY) > 20;

    if ($stripeConfigured) {
        // ── Production: Use Stripe PHP SDK ──────────────────────────────────
        \Stripe\Stripe::setApiKey(STRIPE_SECRET_KEY);

        $sessionParams = [
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => STRIPE_CURRENCY,
                    'product_data' => [
                        'name' => PRODUCT_NAME,
                        'description' => 'One-time income structure diagnostic with downloadable report.',
                    ],
                    'unit_amount' => STRIPE_PRICE_AMOUNT,
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => FRONTEND_URL . '/assess/?token={CHECKOUT_SESSION_ID}',
            'cancel_url' => FRONTEND_URL . '/?cancelled=true',
            'metadata' => [
                'prepared_for_name' => $prepared_for_name,
                'delivery_email' => $delivery_email,
            ],
        ];

        // If email provided, prefill Stripe Checkout
        if ($delivery_email !== '') {
            $sessionParams['customer_email'] = $delivery_email;
        }

        $checkout_session = \Stripe\Checkout\Session::create($sessionParams);

        echo json_encode([
            'success' => true,
            'checkout_url' => $checkout_session->url,
            'session_id' => $checkout_session->id,
        ]);
    } else {
        // ── Development: Mock Stripe response ───────────────────────────────
        // Simulates a completed payment by creating DB records directly.
        // Install Stripe SDK (composer require stripe/stripe-php) for production.
        require_once __DIR__ . '/lib/token_utils.php';
        require_once __DIR__ . '/lib/audit_logger.php';

        // Auto-create tables if they don't exist (dev bootstrap)
        $conn->query("CREATE TABLE IF NOT EXISTS assessments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            assessment_id VARCHAR(20) NOT NULL UNIQUE,
            payment_session_id VARCHAR(255) UNIQUE,
            prepared_for_name VARCHAR(255) NULL,
            delivery_email VARCHAR(255) NULL,
            industry VARCHAR(50) NULL, revenue_model VARCHAR(50) NULL, role VARCHAR(50) NULL,
            profile_id VARCHAR(255) NULL,
            responses_q1 CHAR(1) NULL, responses_q2 CHAR(1) NULL, responses_q3 CHAR(1) NULL, responses_q4 CHAR(1) NULL,
            responses_q5 CHAR(1) NULL, responses_q6 CHAR(1) NULL, responses_q7 CHAR(1) NULL, responses_q8 CHAR(1) NULL,
            responses_q9 CHAR(1) NULL, responses_q10 CHAR(1) NULL, responses_q11 CHAR(1) NULL, responses_q12 CHAR(1) NULL,
            score_exact DECIMAL(5,2) NULL, display_score TINYINT UNSIGNED NULL, band VARCHAR(30) NULL,
            core_weighted_int INT NULL, mod_weighted_int INT NULL, stab_weighted_int INT NULL, raw_int INT NULL, rmax_int INT NULL,
            output_payload JSON NULL,
            model_version VARCHAR(10) NOT NULL DEFAULT 'RP-1.0',
            engine_version VARCHAR(10) NOT NULL DEFAULT '1.0',
            calibration_version VARCHAR(10) NOT NULL DEFAULT '1.0',
            output_version VARCHAR(10) NOT NULL DEFAULT '1.0',
            report_status ENUM('pending','generated','failed') NOT NULL DEFAULT 'pending',
            delivery_status ENUM('available','accessed','expired') NOT NULL DEFAULT 'available',
            status VARCHAR(30) NOT NULL DEFAULT 'created',
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            assessment_date DATE NULL,
            INDEX idx_payment_session (payment_session_id),
            INDEX idx_status (status),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
        $conn->query("CREATE TABLE IF NOT EXISTS access_grants (
            id INT AUTO_INCREMENT PRIMARY KEY,
            assessment_id VARCHAR(20) NOT NULL,
            token_hash VARCHAR(128) NOT NULL,
            issued_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            first_accessed_at DATETIME NULL,
            access_window_expires_at DATETIME NULL,
            final_expires_at DATETIME NOT NULL,
            status ENUM('active','window_active','expired') NOT NULL DEFAULT 'active',
            download_count INT NOT NULL DEFAULT 0,
            FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id),
            INDEX idx_token_hash (token_hash),
            INDEX idx_assessment_id (assessment_id),
            INDEX idx_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
        $conn->query("CREATE TABLE IF NOT EXISTS audit_events (
            id INT AUTO_INCREMENT PRIMARY KEY,
            assessment_id VARCHAR(20) NULL,
            event_type VARCHAR(50) NOT NULL,
            metadata JSON NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_assessment_id (assessment_id),
            INDEX idx_event_type (event_type),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
        $conn->query("CREATE TABLE IF NOT EXISTS contact_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            checkout_email VARCHAR(255) NULL,
            message TEXT NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        $mock_session_id = 'cs_test_' . bin2hex(random_bytes(16));

        // Use the mock session ID as the access token
        $token = $mock_session_id;
        $token_hash = hashToken($token);
        $assessment_id = generateAssessmentId();
        $final_expires_at = date('Y-m-d H:i:s', strtotime('+' . FINAL_EXPIRY_DAYS . ' days'));

        // Create assessment record
        $stmt = $conn->prepare(
            "INSERT INTO assessments (assessment_id, payment_session_id, prepared_for_name, delivery_email, status)
             VALUES (?, ?, ?, ?, 'paid_not_started')"
        );
        $stmt->bind_param("ssss", $assessment_id, $mock_session_id, $prepared_for_name, $delivery_email);
        $stmt->execute();
        $stmt->close();

        // Create access_grant record
        $stmt = $conn->prepare(
            "INSERT INTO access_grants (assessment_id, token_hash, final_expires_at, status)
             VALUES (?, ?, ?, 'active')"
        );
        $stmt->bind_param("sss", $assessment_id, $token_hash, $final_expires_at);
        $stmt->execute();
        $stmt->close();

        logEvent($assessment_id, 'mock_purchase', [
            'payment_session_id' => $mock_session_id,
        ]);

        echo json_encode([
            'success' => true,
            'checkout_url' => FRONTEND_URL . '/assess/?token=' . $token,
            'session_id' => $mock_session_id,
            '_dev_note' => 'Mock response — install stripe/stripe-php for production',
            '_db_tables' => $conn->error ?: 'tables_ok',
            '_assessment_id' => $assessment_id,
            '_version' => 'v3-bootstrap',
        ]);
    }

} catch (Exception $e) {
    error_log('create_checkout error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to create checkout session']);
}

$conn->close();
