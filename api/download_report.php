<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

require_once __DIR__ . '/db_connect.php';
require_once __DIR__ . '/lib/token_utils.php';
require_once __DIR__ . '/lib/audit_logger.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        header('Content-Type: application/json');
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        exit;
    }

    // ── 1. Validate token ─────────────────────────────────────────────────────
    $token = trim($_GET['token'] ?? '');

    if ($token === '') {
        header('Content-Type: application/json');
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Token is required']);
        exit;
    }

    $token_hash = hashToken($token);

    $stmt = $conn->prepare(
        "SELECT ag.id AS grant_id, ag.assessment_id, ag.status, ag.final_expires_at,
                ag.first_accessed_at, ag.access_window_expires_at, ag.download_count
         FROM access_grants ag
         WHERE ag.token_hash = ?"
    );
    $stmt->bind_param("s", $token_hash);
    $stmt->execute();
    $grant = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$grant) {
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Invalid token']);
        exit;
    }

    if (strtotime($grant['final_expires_at']) < time()) {
        header('Content-Type: application/json');
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Access grant has expired']);
        exit;
    }

    $assessment_id = $grant['assessment_id'];
    $grant_id = $grant['grant_id'];

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
        header('Content-Type: application/json');
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Assessment not found']);
        exit;
    }

    if ($assessment['report_status'] !== 'generated') {
        header('Content-Type: application/json');
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Report has not been generated yet',
            'report_status' => $assessment['report_status'],
        ]);
        exit;
    }

    // ── 3. Handle access window logic ─────────────────────────────────────────
    $now = date('Y-m-d H:i:s');

    if ($grant['status'] === 'expired') {
        header('Content-Type: application/json');
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Download access has expired']);
        exit;
    }

    if ($grant['first_accessed_at'] === null) {
        // First download: set first_accessed_at, open the 24-hour window
        $window_expires = date('Y-m-d H:i:s', strtotime('+' . ACCESS_WINDOW_HOURS . ' hours'));

        $stmt = $conn->prepare(
            "UPDATE access_grants
             SET first_accessed_at = ?, access_window_expires_at = ?,
                 status = 'window_active', download_count = download_count + 1
             WHERE id = ?"
        );
        $stmt->bind_param("ssi", $now, $window_expires, $grant_id);
        $stmt->execute();
        $stmt->close();

        logEvent($assessment_id, 'report_first_accessed', [
            'access_window_expires_at' => $window_expires,
        ]);

    } elseif ($grant['status'] === 'window_active') {
        // Check if window has expired
        if (strtotime($grant['access_window_expires_at']) < time()) {
            // Window expired — update status and deny
            $stmt = $conn->prepare("UPDATE access_grants SET status = 'expired' WHERE id = ?");
            $stmt->bind_param("i", $grant_id);
            $stmt->execute();
            $stmt->close();

            header('Content-Type: application/json');
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Download window has expired']);
            exit;
        }

        // Still within window — allow download, increment count
        $stmt = $conn->prepare(
            "UPDATE access_grants SET download_count = download_count + 1 WHERE id = ?"
        );
        $stmt->bind_param("i", $grant_id);
        $stmt->execute();
        $stmt->close();

    } elseif ($grant['status'] === 'active') {
        // Active but first_accessed_at is set (edge case) — treat as window_active
        $window_expires = date('Y-m-d H:i:s', strtotime('+' . ACCESS_WINDOW_HOURS . ' hours'));

        $stmt = $conn->prepare(
            "UPDATE access_grants
             SET access_window_expires_at = ?, status = 'window_active',
                 download_count = download_count + 1
             WHERE id = ?"
        );
        $stmt->bind_param("si", $window_expires, $grant_id);
        $stmt->execute();
        $stmt->close();
    }

    logEvent($assessment_id, 'report_downloaded', [
        'download_count' => ($grant['download_count'] ?? 0) + 1,
    ]);

    // ── 4. Return report data ─────────────────────────────────────────────────
    // TODO: Once PDF generator is implemented, serve actual PDF file here.
    // For now, return JSON with the report data and a note about PDF.
    //
    // When PDF is ready, replace with:
    //   header('Content-Type: application/pdf');
    //   header('Content-Disposition: attachment; filename="RunPayway-Report-' . $assessment_id . '.pdf"');
    //   header('Cache-Control: no-store');
    //   readfile($pdf_path);

    header('Content-Type: application/json');
    header('Cache-Control: no-store');

    $output_payload = json_decode($assessment['output_payload'], true);

    echo json_encode([
        'status' => 'success',
        'message' => 'Report data retrieved. PDF download coming soon.',
        'assessment_id' => $assessment['assessment_id'],
        'assessment_date' => $assessment['assessment_date'],
        'model_version' => $assessment['model_version'],
        'prepared_for_name' => $assessment['prepared_for_name'],
        'output' => $output_payload,
        '_pdf_note' => 'PDF generator not yet implemented. This endpoint will serve a PDF file when ready.',
    ]);

} catch (Exception $e) {
    error_log('download_report error: ' . $e->getMessage());
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'An unexpected error occurred']);
}

$conn->close();
