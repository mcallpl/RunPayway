<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/db_connect.php';

$results = [];

// Check DB connection
$results['db_connected'] = !$conn->connect_error;

// Check tables exist
$tables = ['assessments', 'access_grants', 'audit_log'];
foreach ($tables as $table) {
    $r = $conn->query("SHOW TABLES LIKE '$table'");
    $results['table_' . $table] = $r && $r->num_rows > 0;
}

// Count rows
foreach ($tables as $table) {
    if ($results['table_' . $table]) {
        $r = $conn->query("SELECT COUNT(*) as cnt FROM $table");
        $row = $r ? $r->fetch_assoc() : null;
        $results['count_' . $table] = $row ? (int)$row['cnt'] : 'error';
    }
}

// Check last error
$results['last_db_error'] = $conn->error ?: 'none';

echo json_encode($results, JSON_PRETTY_PRINT);
$conn->close();
