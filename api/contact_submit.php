<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

require_once __DIR__ . '/db_connect.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON body']);
        exit;
    }

    // ── Validate required fields ──────────────────────────────────────────────
    $email = trim($input['email'] ?? '');
    $message = trim($input['message'] ?? '');
    $checkout_email = trim($input['checkout_email'] ?? '');

    if ($email === '') {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Email is required']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid email format']);
        exit;
    }

    if ($message === '') {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Message is required']);
        exit;
    }

    // Validate checkout_email format if provided
    if ($checkout_email !== '' && !filter_var($checkout_email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid checkout email format']);
        exit;
    }

    // ── Insert into contact_messages ──────────────────────────────────────────
    $stmt = $conn->prepare(
        "INSERT INTO contact_messages (email, checkout_email, message) VALUES (?, ?, ?)"
    );

    $checkout_email_val = $checkout_email !== '' ? $checkout_email : null;
    $stmt->bind_param("sss", $email, $checkout_email_val, $message);

    if (!$stmt->execute()) {
        error_log('contact_submit: Insert failed: ' . $stmt->error);
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to submit message']);
        exit;
    }

    $stmt->close();

    echo json_encode([
        'status' => 'success',
        'message' => 'Message submitted successfully',
    ]);

} catch (Exception $e) {
    error_log('contact_submit error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'An unexpected error occurred']);
}

$conn->close();
