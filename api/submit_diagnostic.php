<?php
require_once __DIR__ . '/lib/security.php';
setSecurityHeaders();
setCorsHeaders('POST');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

enforceRateLimit('submit_diagnostic', 10, 60);

require_once __DIR__ . '/db_connect.php';
require_once __DIR__ . '/lib/token_utils.php';
require_once __DIR__ . '/lib/audit_logger.php';
require_once __DIR__ . '/engine/CalibrationEngineV1.php';
require_once __DIR__ . '/engine/ScoringEngineV1.php';
require_once __DIR__ . '/engine/OutputLogicV1.php';
require_once __DIR__ . '/pdf/ReportGenerator.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON body']);
        exit;
    }

    // ── 1. Validate token ─────────────────────────────────────────────────────
    $token = trim($input['token'] ?? '');

    if ($token === '') {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Token is required']);
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
        // Auto-provision for mock/dev tokens (cs_test_ prefix)
        if (str_starts_with($token, 'cs_test_')) {
            // Bootstrap tables
            $conn->query("CREATE TABLE IF NOT EXISTS assessments (
                id INT AUTO_INCREMENT PRIMARY KEY, assessment_id VARCHAR(20) NOT NULL UNIQUE,
                payment_session_id VARCHAR(255) UNIQUE, prepared_for_name VARCHAR(255) NULL,
                delivery_email VARCHAR(255) NULL, industry VARCHAR(50) NULL, revenue_model VARCHAR(50) NULL, role VARCHAR(50) NULL,
                profile_id VARCHAR(255) NULL,
                responses_q1 CHAR(1) NULL, responses_q2 CHAR(1) NULL, responses_q3 CHAR(1) NULL, responses_q4 CHAR(1) NULL,
                responses_q5 CHAR(1) NULL, responses_q6 CHAR(1) NULL, responses_q7 CHAR(1) NULL, responses_q8 CHAR(1) NULL,
                responses_q9 CHAR(1) NULL, responses_q10 CHAR(1) NULL, responses_q11 CHAR(1) NULL, responses_q12 CHAR(1) NULL,
                score_exact DECIMAL(5,2) NULL, display_score TINYINT UNSIGNED NULL, band VARCHAR(30) NULL,
                core_weighted_int INT NULL, mod_weighted_int INT NULL, stab_weighted_int INT NULL, raw_int INT NULL, rmax_int INT NULL,
                output_payload JSON NULL, model_version VARCHAR(10) NOT NULL DEFAULT 'RP-1.0',
                engine_version VARCHAR(10) NOT NULL DEFAULT '1.0', calibration_version VARCHAR(10) NOT NULL DEFAULT '1.0',
                output_version VARCHAR(10) NOT NULL DEFAULT '1.0',
                report_status ENUM('pending','generated','failed') NOT NULL DEFAULT 'pending',
                delivery_status ENUM('available','accessed','expired') NOT NULL DEFAULT 'available',
                status VARCHAR(30) NOT NULL DEFAULT 'created',
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, assessment_date DATE NULL,
                INDEX idx_payment_session (payment_session_id), INDEX idx_status (status), INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
            $conn->query("CREATE TABLE IF NOT EXISTS access_grants (
                id INT AUTO_INCREMENT PRIMARY KEY, assessment_id VARCHAR(20) NOT NULL,
                token_hash VARCHAR(128) NOT NULL, issued_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                first_accessed_at DATETIME NULL, access_window_expires_at DATETIME NULL,
                final_expires_at DATETIME NOT NULL,
                status ENUM('active','window_active','expired') NOT NULL DEFAULT 'active',
                download_count INT NOT NULL DEFAULT 0,
                FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id),
                INDEX idx_token_hash (token_hash), INDEX idx_assessment_id (assessment_id), INDEX idx_status (status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
            $conn->query("CREATE TABLE IF NOT EXISTS audit_events (
                id INT AUTO_INCREMENT PRIMARY KEY, assessment_id VARCHAR(20) NULL,
                event_type VARCHAR(50) NOT NULL, metadata JSON NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_assessment_id (assessment_id), INDEX idx_event_type (event_type), INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

            // Auto-create assessment + access grant for dev token
            $dev_assessment_id = generateAssessmentId();
            $dev_expires = date('Y-m-d H:i:s', strtotime('+30 days'));

            $stmt = $conn->prepare("INSERT INTO assessments (assessment_id, payment_session_id, status) VALUES (?, ?, 'created')");
            $stmt->bind_param("ss", $dev_assessment_id, $token);
            $stmt->execute();
            $stmt->close();

            $stmt = $conn->prepare("INSERT INTO access_grants (assessment_id, token_hash, final_expires_at, status) VALUES (?, ?, ?, 'active')");
            $stmt->bind_param("sss", $dev_assessment_id, $token_hash, $dev_expires);
            $stmt->execute();
            $stmt->close();

            // Re-query the grant
            $stmt = $conn->prepare("SELECT ag.assessment_id, ag.status, ag.final_expires_at FROM access_grants ag WHERE ag.token_hash = ?");
            $stmt->bind_param("s", $token_hash);
            $stmt->execute();
            $grant = $stmt->get_result()->fetch_assoc();
            $stmt->close();
        }

        if (!$grant) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Invalid token']);
            exit;
        }
    }

    if (!in_array($grant['status'], ['active', 'window_active'], true)) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Access grant is no longer active']);
        exit;
    }

    if (strtotime($grant['final_expires_at']) < time()) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Access grant has expired']);
        exit;
    }

    $assessment_id = $grant['assessment_id'];

    // ── 2. Validate industry, revenue_model, role ─────────────────────────────
    $industry = strtoupper(trim($input['industry'] ?? ''));
    $revenue_model = strtoupper(trim($input['revenue_model'] ?? ''));
    $role = strtoupper(trim($input['role'] ?? ''));

    if ($industry === '' || $revenue_model === '' || $role === '') {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'industry, revenue_model, and role are required']);
        exit;
    }

    // ── 3. Validate all 12 responses ──────────────────────────────────────────
    $valid_answers = ['A', 'B', 'C', 'D'];
    $responses = [];

    // Accept responses as nested object {responses: {q1: "A", ...}} or flat {q1: "A", ...}
    $responseSource = $input['responses'] ?? $input;

    for ($i = 1; $i <= 12; $i++) {
        $key = 'q' . $i;
        $value = strtoupper(trim($responseSource[$key] ?? ''));

        if ($value === '' || !in_array($value, $valid_answers, true)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => "Invalid or missing response for $key. Must be A, B, C, or D.",
            ]);
            exit;
        }

        $responses[$key] = $value;
    }

    // Optional: prepared_for_name
    $prepared_for_name = trim($input['prepared_for_name'] ?? '');

    // ── 4. Run calibration engine ─────────────────────────────────────────────
    $calibration = RunPaywayCalibrationV1::calibrate($revenue_model, $role, $industry);

    // ── 5. Run scoring engine with calibrated weights ─────────────────────────
    $scoring = RunPaywayScoringV1::compute(
        $responses,
        $calibration['core_weight_int'],
        $calibration['mod_weight_int'],
        $calibration['stab_weight_int'],
        $calibration['rmax_int_calibrated']
    );

    // ── 6. Run output logic ───────────────────────────────────────────────────
    $today = date('Y-m-d');
    $output = RunPaywayOutputV1::generate(
        $scoring,
        $calibration,
        $responses,
        $assessment_id,
        $today
    );

    $output_json = json_encode($output);
    $profile_id = $calibration['profile_id'];

    // ── 7. Update assessments record with ALL fields ──────────────────────────
    $sql = "UPDATE assessments SET
                industry = ?,
                revenue_model = ?,
                role = ?,
                profile_id = ?,
                responses_q1 = ?, responses_q2 = ?, responses_q3 = ?, responses_q4 = ?,
                responses_q5 = ?, responses_q6 = ?, responses_q7 = ?, responses_q8 = ?,
                responses_q9 = ?, responses_q10 = ?, responses_q11 = ?, responses_q12 = ?,
                score_exact = ?,
                display_score = ?,
                band = ?,
                core_weighted_int = ?,
                mod_weighted_int = ?,
                stab_weighted_int = ?,
                raw_int = ?,
                rmax_int = ?,
                output_payload = ?,
                report_status = 'generated',
                status = 'report_generated',
                assessment_date = ?";

    // Append prepared_for_name if provided
    if ($prepared_for_name !== '') {
        $sql .= ", prepared_for_name = ?";
    }

    $sql .= " WHERE assessment_id = ?";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        error_log('submit_diagnostic: Prepare failed: ' . $conn->error);
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database error']);
        exit;
    }

    if ($prepared_for_name !== '') {
        $stmt->bind_param(
            "ssssssssssssssssdisissssssss",
            $industry,
            $revenue_model,
            $role,
            $profile_id,
            $responses['q1'], $responses['q2'], $responses['q3'], $responses['q4'],
            $responses['q5'], $responses['q6'], $responses['q7'], $responses['q8'],
            $responses['q9'], $responses['q10'], $responses['q11'], $responses['q12'],
            $scoring['score_exact'],
            $scoring['display_score'],
            $scoring['band'],
            $scoring['core_weighted_int'],
            $scoring['mod_weighted_int'],
            $scoring['stab_weighted_int'],
            $scoring['raw_int'],
            $scoring['rmax_int'],
            $output_json,
            $today,
            $prepared_for_name,
            $assessment_id
        );
    } else {
        $stmt->bind_param(
            "ssssssssssssssssdisisssssss",
            $industry,
            $revenue_model,
            $role,
            $profile_id,
            $responses['q1'], $responses['q2'], $responses['q3'], $responses['q4'],
            $responses['q5'], $responses['q6'], $responses['q7'], $responses['q8'],
            $responses['q9'], $responses['q10'], $responses['q11'], $responses['q12'],
            $scoring['score_exact'],
            $scoring['display_score'],
            $scoring['band'],
            $scoring['core_weighted_int'],
            $scoring['mod_weighted_int'],
            $scoring['stab_weighted_int'],
            $scoring['raw_int'],
            $scoring['rmax_int'],
            $output_json,
            $today,
            $assessment_id
        );
    }

    if (!$stmt->execute()) {
        error_log('submit_diagnostic: Update failed: ' . $stmt->error);
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to save assessment results']);
        exit;
    }
    $stmt->close();

    // ── 8. Generate PDF report ──────────────────────────────────────────────────
    try {
        $pdfGenerator = new ReportGenerator();
        $pdfPath = $pdfGenerator->generate($output, 'RP-1.0');
    } catch (Exception $pdfError) {
        // PDF generation failure is non-fatal — log but continue
        error_log('submit_diagnostic: PDF generation failed: ' . $pdfError->getMessage());
        $pdfPath = null;
    }

    // ── 9. Log audit events ─────────────────────────────────────────────────────
    logEvent($assessment_id, 'diagnostic_completed', [
        'industry' => $industry,
        'revenue_model' => $revenue_model,
        'role' => $role,
    ]);

    logEvent($assessment_id, 'scoring_computed', [
        'score_exact' => $scoring['score_exact'],
        'display_score' => $scoring['display_score'],
        'band' => $scoring['band'],
        'profile_id' => $profile_id,
    ]);

    logEvent($assessment_id, 'report_generated', [
        'engine_version' => $scoring['engine_version'],
        'calibration_version' => $calibration['calibration_version'],
        'output_version' => RunPaywayOutputV1::OUTPUT_VERSION,
        'pdf_generated' => $pdfPath !== null,
    ]);

    // ── 10. Return full output payload ──────────────────────────────────────────
    echo json_encode([
        'success' => true,
        'message' => 'Diagnostic completed and report generated',
        'assessment_id' => $assessment_id,
        'output' => $output,
    ]);

} catch (InvalidArgumentException $e) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} catch (Exception $e) {
    error_log('submit_diagnostic error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'An unexpected error occurred']);
}

$conn->close();
