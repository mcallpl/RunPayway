<?php
/**
 * Database Setup Script for RunPayway
 * Visit: https://yourhost.com/RunPayway/api/setup_db.php?key=runpayway2026
 */
header('Content-Type: text/html; charset=utf-8');

if (($_GET['key'] ?? '') !== 'runpayway2026') {
    http_response_code(403);
    die('Forbidden');
}

echo "<pre style='font-family:monospace;background:#1a1a2e;color:#e0e0e0;padding:30px;'>\n";
echo "=== RUNPAYWAY DATABASE SETUP ===\n\n";

// Connect without database
$conn = new mysqli('localhost', 'mcallpl', 'amazing123');
if ($conn->connect_error) {
    die("MySQL Connection FAILED: " . $conn->connect_error . "\n");
}
echo "[OK] Connected to MySQL\n";

// Show available databases
$result = $conn->query("SHOW DATABASES");
echo "\nAvailable databases:\n";
$dbs = [];
while ($row = $result->fetch_row()) {
    echo "  - " . $row[0] . "\n";
    $dbs[] = $row[0];
}

// Try to find the runpayway database
$db_names = ['runpayway', 'mcallpl_runpayway'];
$found_db = null;
foreach ($db_names as $name) {
    if (in_array($name, $dbs)) {
        $found_db = $name;
        break;
    }
}

if ($found_db) {
    echo "\n[OK] Found database: $found_db\n";
} else {
    echo "\n[!!] No 'runpayway' database found. Attempting to create...\n";

    // Try creating
    foreach (['runpayway', 'mcallpl_runpayway'] as $name) {
        $result = @$conn->query("CREATE DATABASE `$name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        if ($result) {
            echo "[OK] Created database: $name\n";
            $found_db = $name;
            break;
        } else {
            echo "[FAIL] Cannot create '$name': " . $conn->error . "\n";
        }
    }
}

if (!$found_db) {
    echo "\n[ACTION REQUIRED]\n";
    echo "You need to create the database via GoDaddy cPanel:\n";
    echo "1. Log into GoDaddy > My Products > Hosting > Manage\n";
    echo "2. Click 'cPanel Admin'\n";
    echo "3. Go to 'MySQL Databases'\n";
    echo "4. Create New Database: runpayway\n";
    echo "   (GoDaddy will prefix it as 'mcallpl_runpayway')\n";
    echo "5. Add User: mcallpl to database mcallpl_runpayway with ALL PRIVILEGES\n";
    echo "6. Re-visit this URL\n";
    echo "</pre>";
    exit;
}

// Select database and run schema
$conn->select_db($found_db);
echo "\n[OK] Selected database: $found_db\n";
echo "\nRunning schema...\n\n";

$schema_file = __DIR__ . '/schema.sql';
if (!file_exists($schema_file)) {
    die("[ERROR] schema.sql not found!\n");
}

// Run each CREATE TABLE individually for reliability
$tables = [
    'assessments' => "CREATE TABLE IF NOT EXISTS assessments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        assessment_id VARCHAR(20) NOT NULL UNIQUE,
        payment_session_id VARCHAR(255) UNIQUE,
        prepared_for_name VARCHAR(255) NULL,
        delivery_email VARCHAR(255) NULL,
        industry VARCHAR(50) NULL,
        revenue_model VARCHAR(50) NULL,
        role VARCHAR(50) NULL,
        profile_id VARCHAR(255) NULL,
        responses_q1 CHAR(1) NULL, responses_q2 CHAR(1) NULL,
        responses_q3 CHAR(1) NULL, responses_q4 CHAR(1) NULL,
        responses_q5 CHAR(1) NULL, responses_q6 CHAR(1) NULL,
        responses_q7 CHAR(1) NULL, responses_q8 CHAR(1) NULL,
        responses_q9 CHAR(1) NULL, responses_q10 CHAR(1) NULL,
        responses_q11 CHAR(1) NULL, responses_q12 CHAR(1) NULL,
        score_exact DECIMAL(5,2) NULL,
        display_score TINYINT UNSIGNED NULL,
        band VARCHAR(30) NULL,
        core_weighted_int INT NULL, mod_weighted_int INT NULL,
        stab_weighted_int INT NULL, raw_int INT NULL, rmax_int INT NULL,
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

    'access_grants' => "CREATE TABLE IF NOT EXISTS access_grants (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

    'audit_events' => "CREATE TABLE IF NOT EXISTS audit_events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        assessment_id VARCHAR(20) NULL,
        event_type VARCHAR(50) NOT NULL,
        metadata JSON NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_assessment_id (assessment_id),
        INDEX idx_event_type (event_type),
        INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

    'contact_messages' => "CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        checkout_email VARCHAR(255) NULL,
        message TEXT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
];

foreach ($tables as $name => $sql) {
    if ($conn->query($sql)) {
        echo "[OK] Table '$name' ready\n";
    } else {
        echo "[ERROR] Table '$name': " . $conn->error . "\n";
    }
}

// Verify tables
$result = $conn->query("SHOW TABLES");
echo "\nTables in $found_db:\n";
$table_count = 0;
while ($row = $result->fetch_row()) {
    echo "  ✓ " . $row[0] . "\n";
    $table_count++;
}
echo "\nTotal tables: $table_count\n";

// If the database name is different from 'runpayway', update db_connect.php
if ($found_db !== 'runpayway') {
    echo "\n[INFO] Database name is '$found_db' (not 'runpayway')\n";
    echo "[INFO] Updating db_connect.php with correct database name...\n";

    $db_connect_path = __DIR__ . '/db_connect.php';
    $content = file_get_contents($db_connect_path);
    $content = str_replace("'runpayway'", "'$found_db'", $content);
    file_put_contents($db_connect_path, $content);
    echo "[OK] db_connect.php updated to use '$found_db'\n";
}

// Test tables
echo "\n=== TESTING TABLES ===\n";

$tables_to_check = ['assessments', 'access_grants', 'audit_events', 'contact_messages'];
foreach ($tables_to_check as $table) {
    $result = $conn->query("SELECT COUNT(*) as cnt FROM $table");
    if ($result) {
        $row = $result->fetch_assoc();
        echo "[OK] $table accessible (count: " . $row['cnt'] . ")\n";
    } else {
        echo "[WARN] $table query failed: " . $conn->error . "\n";
    }
}

echo "\n=== DEPLOYMENT COMPLETE ===\n";
echo "Your API is ready.\n";
echo "\nEndpoints:\n";
$endpoints = [
    'setup_db.php',
    'db_connect.php',
    'stripe_config.php',
    'lib/token_utils.php',
    'lib/audit_logger.php',
];
foreach ($endpoints as $ep) {
    echo "  $ep\n";
}

$conn->close();
echo "</pre>";
