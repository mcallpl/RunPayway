<?php
declare(strict_types=1);

// ============================================
// Token Management Utilities for RunPayway
// ============================================

// Pepper for token hashing (added before SHA-256)
define('TOKEN_PEPPER', 'rP7x2mKqW9vLbN4jT8yFgH3cA6dE1sZu');

// Access grant expiry settings
define('FINAL_EXPIRY_DAYS', 30);
define('ACCESS_WINDOW_HOURS', 24);

/**
 * Generate a cryptographically secure random token.
 * Returns a 32-character hex string (128-bit entropy).
 */
function generateToken(): string {
    return bin2hex(random_bytes(16));
}

/**
 * Hash a token using SHA-256 with the pepper prepended.
 * Used for storing token hashes in the database (never store raw tokens).
 */
function hashToken(string $token): string {
    return hash('sha256', TOKEN_PEPPER . $token);
}

/**
 * Generate a unique assessment ID in the format RP-XXXXXX.
 * Uses 6 random digits (000000-999999).
 */
function generateAssessmentId(): string {
    $digits = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    return 'RP-' . $digits;
}

?>
