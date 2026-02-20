<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

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

    if ($stripeAvailable) {
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

        $mock_session_id = 'cs_test_' . bin2hex(random_bytes(16));

        // Use the mock session ID as the access token
        $token = $mock_session_id;
        $token_hash = hashToken($token);
        $assessment_id = generateAssessmentId();
        $final_expires_at = date('Y-m-d H:i:s', strtotime('+' . FINAL_EXPIRY_DAYS . ' days'));

        // Create assessment record
        $stmt = $conn->prepare(
            "INSERT INTO assessments (assessment_id, payment_session_id, prepared_for_name, delivery_email, status)
             VALUES (?, ?, ?, ?, 'created')"
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
        ]);
    }

} catch (Exception $e) {
    error_log('create_checkout error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to create checkout session']);
}

$conn->close();
