<?php
declare(strict_types=1);

// ============================================
// Audit Event Logger for RunPayway
// ============================================

require_once __DIR__ . '/../db_connect.php';

/**
 * Log an audit event to the audit_events table.
 *
 * @param string|null $assessmentId  The assessment ID (RP-XXXXXX) or null for system events.
 * @param string      $eventType     The type of event (e.g., 'assessment.created', 'report.generated').
 * @param array|null  $metadata      Optional key-value metadata to store as JSON.
 * @return int|false  The inserted row ID, or false on failure.
 */
function logEvent(?string $assessmentId, string $eventType, ?array $metadata = null): int|false {
    $metadataJson = $metadata !== null ? json_encode($metadata) : null;

    return dbInsert(
        "INSERT INTO audit_events (assessment_id, event_type, metadata) VALUES (?, ?, ?)",
        [$assessmentId, $eventType, $metadataJson]
    );
}

?>
