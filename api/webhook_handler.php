<?php
header('Content-Type: application/json');

require_once __DIR__ . '/db_connect.php';
require_once __DIR__ . '/stripe_config.php';
require_once __DIR__ . '/lib/token_utils.php';
require_once __DIR__ . '/lib/audit_logger.php';

// Attempt to load Stripe SDK
$stripeAvailable = false;
$autoloadPath = __DIR__ . '/vendor/autoload.php';
if (file_exists($autoloadPath)) {
    require_once $autoloadPath;
    if (class_exists('\Stripe\Webhook')) {
        $stripeAvailable = true;
    }
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        exit;
    }

    // Read raw body
    $payload = file_get_contents('php://input');

    if (empty($payload)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Empty request body']);
        exit;
    }

    // ── Verify webhook signature ────────────────────────────────────────────
    $event = null;

    if ($stripeAvailable) {
        // Production: Verify Stripe signature
        $sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload, $sig_header, STRIPE_WEBHOOK_SECRET
            );
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid webhook signature']);
            exit;
        }

        $event_type = $event->type;
        $session = $event->data->object;
    } else {
        // Development: Parse raw JSON (no signature verification)
        $eventData = json_decode($payload, true);

        if (!$eventData || !isset($eventData['type'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid event payload']);
            exit;
        }

        $event_type = $eventData['type'];
        $session = $eventData['data']['object'] ?? null;
    }

    // Only handle checkout.session.completed
    if ($event_type !== 'checkout.session.completed') {
        echo json_encode(['success' => true, 'message' => 'Event type ignored: ' . $event_type]);
        exit;
    }

    if (!$session) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing session data']);
        exit;
    }

    // Extract session data (works with both Stripe object and array)
    $payment_session_id = is_array($session) ? ($session['id'] ?? '') : ($session->id ?? '');
    $metadata = is_array($session) ? ($session['metadata'] ?? []) : ($session->metadata ?? []);

    $prepared_for_name = is_array($metadata)
        ? ($metadata['prepared_for_name'] ?? null)
        : ($metadata->prepared_for_name ?? null);
    $delivery_email = is_array($metadata)
        ? ($metadata['delivery_email'] ?? null)
        : ($metadata->delivery_email ?? null);

    if (empty($payment_session_id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing payment session ID']);
        exit;
    }

    // ── Idempotency check ───────────────────────────────────────────────────
    $stmt = $conn->prepare("SELECT assessment_id FROM assessments WHERE payment_session_id = ?");
    $stmt->bind_param("s", $payment_session_id);
    $stmt->execute();
    $existing = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($existing) {
        // Already processed — return existing info
        echo json_encode([
            'success' => true,
            'message' => 'Payment already processed (idempotent)',
            'assessment_id' => $existing['assessment_id'],
        ]);
        exit;
    }

    // ── Generate assessment ID (unique) ─────────────────────────────────────
    $assessment_id = generateAssessmentId();

    $attempts = 0;
    while ($attempts < 10) {
        $stmt = $conn->prepare("SELECT id FROM assessments WHERE assessment_id = ?");
        $stmt->bind_param("s", $assessment_id);
        $stmt->execute();
        $collision = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        if (!$collision) {
            break;
        }
        $assessment_id = generateAssessmentId();
        $attempts++;
    }

    if ($attempts >= 10) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to generate unique assessment ID']);
        exit;
    }

    // ── Generate access token ───────────────────────────────────────────────
    $token = generateToken();
    $token_hash = hashToken($token);
    $final_expires_at = date('Y-m-d H:i:s', strtotime('+' . FINAL_EXPIRY_DAYS . ' days'));

    // ── Create assessment record ────────────────────────────────────────────
    $stmt = $conn->prepare(
        "INSERT INTO assessments (assessment_id, payment_session_id, prepared_for_name, delivery_email, status)
         VALUES (?, ?, ?, ?, 'created')"
    );
    $stmt->bind_param("ssss", $assessment_id, $payment_session_id, $prepared_for_name, $delivery_email);

    if (!$stmt->execute()) {
        error_log('webhook_handler: Failed to insert assessment: ' . $stmt->error);
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to create assessment']);
        exit;
    }
    $stmt->close();

    // ── Create access_grant record ──────────────────────────────────────────
    $stmt = $conn->prepare(
        "INSERT INTO access_grants (assessment_id, token_hash, final_expires_at, status)
         VALUES (?, ?, ?, 'active')"
    );
    $stmt->bind_param("sss", $assessment_id, $token_hash, $final_expires_at);

    if (!$stmt->execute()) {
        error_log('webhook_handler: Failed to insert access_grant: ' . $stmt->error);
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to create access grant']);
        exit;
    }
    $stmt->close();

    // ── Log audit events ────────────────────────────────────────────────────
    logEvent($assessment_id, 'purchase', [
        'payment_session_id' => $payment_session_id,
    ]);
    logEvent($assessment_id, 'assessment_created', [
        'final_expires_at' => $final_expires_at,
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Assessment created',
        'assessment_id' => $assessment_id,
        'token' => $token,
        'final_expires_at' => $final_expires_at,
    ]);

} catch (Exception $e) {
    error_log('webhook_handler error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Webhook processing failed']);
}

$conn->close();
