<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

require_once __DIR__ . '/db_connect.php';
require_once __DIR__ . '/lib/token_utils.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        exit;
    }

    // ── 1. Validate token ─────────────────────────────────────────────────────
    $token = trim($_GET['token'] ?? '');

    if ($token === '') {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Token is required']);
        exit;
    }

    $token_hash = hashToken($token);

    $stmt = $conn->prepare(
        "SELECT ag.assessment_id, ag.status, ag.final_expires_at
         FROM access_grants ag
         WHERE ag.token_hash = ?"
    );
    $stmt->bind_param("s", $token_hash);
    $stmt->execute();
    $grant = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$grant) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Invalid token']);
        exit;
    }

    if (!in_array($grant['status'], ['active', 'window_active'], true)) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Access grant is no longer active']);
        exit;
    }

    if (strtotime($grant['final_expires_at']) < time()) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Access grant has expired']);
        exit;
    }

    $assessment_id = $grant['assessment_id'];

    // ── 2. Get assessment ─────────────────────────────────────────────────────
    $stmt = $conn->prepare(
        "SELECT assessment_id, assessment_date, model_version, prepared_for_name,
                report_status, output_payload
         FROM assessments
         WHERE assessment_id = ?"
    );
    $stmt->bind_param("s", $assessment_id);
    $stmt->execute();
    $assessment = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$assessment) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Assessment not found']);
        exit;
    }

    // ── 3. Check report_status ────────────────────────────────────────────────
    if ($assessment['report_status'] !== 'generated') {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Report has not been generated yet',
            'report_status' => $assessment['report_status'],
        ]);
        exit;
    }

    // ── 4. Return report data ─────────────────────────────────────────────────
    $output_payload = json_decode($assessment['output_payload'], true);

    echo json_encode([
        'status' => 'success',
        'message' => 'Report retrieved',
        'assessment_id' => $assessment['assessment_id'],
        'assessment_date' => $assessment['assessment_date'],
        'model_version' => $assessment['model_version'],
        'prepared_for_name' => $assessment['prepared_for_name'],
        'output' => $output_payload,
    ]);

} catch (Exception $e) {
    error_log('get_report error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'An unexpected error occurred']);
}

$conn->close();
