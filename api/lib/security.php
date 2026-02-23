<?php
/**
 * RunPayway Security Layer
 *
 * Rate limiting, CORS, and security headers.
 */

// ── Security Headers ─────────────────────────────────────────────────────────
function setSecurityHeaders(): void {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
}

// ── CORS ─────────────────────────────────────────────────────────────────────
function setCorsHeaders(string $allowedMethod = 'POST'): void {
    $allowedOrigins = [
        'https://peoplestar.com',
        'https://www.peoplestar.com',
        'http://localhost:3000',
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $allowedOrigins, true)) {
        header("Access-Control-Allow-Origin: $origin");
    } elseif ($origin === '') {
        // No origin header (same-origin or non-browser request) — allow
        header('Access-Control-Allow-Origin: https://peoplestar.com');
    }

    header("Access-Control-Allow-Methods: $allowedMethod, OPTIONS");
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400');
}

// ── Rate Limiting (file-based, suitable for shared hosting) ──────────────────
function checkRateLimit(string $endpoint, int $maxRequests = 30, int $windowSeconds = 60): bool {
    try {
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $key = md5($ip . ':' . $endpoint);

        $rateLimitDir = sys_get_temp_dir() . '/runpayway_ratelimit';
        if (!is_dir($rateLimitDir)) {
            if (!@mkdir($rateLimitDir, 0755, true)) {
                return true; // Can't create dir — allow request
            }
        }

        $file = $rateLimitDir . '/' . $key;
        $now = time();
        $cutoff = $now - $windowSeconds;

        // Read existing timestamps
        $timestamps = [];
        if (file_exists($file)) {
            $data = @file_get_contents($file);
            if ($data !== false) {
                foreach (explode("\n", trim($data)) as $ts) {
                    if ($ts !== '' && (int)$ts > $cutoff) {
                        $timestamps[] = $ts;
                    }
                }
            }
        }

        // Check limit
        if (count($timestamps) >= $maxRequests) {
            return false; // Rate limited
        }

        // Record this request
        $timestamps[] = (string)$now;
        @file_put_contents($file, implode("\n", $timestamps));

        return true; // Allowed
    } catch (\Throwable $e) {
        // Rate limiting failure should never block requests
        return true;
    }
}

function enforceRateLimit(string $endpoint, int $maxRequests = 30, int $windowSeconds = 60): void {
    if (!checkRateLimit($endpoint, $maxRequests, $windowSeconds)) {
        http_response_code(429);
        header('Content-Type: application/json');
        header('Retry-After: ' . $windowSeconds);
        echo json_encode([
            'status' => 'error',
            'message' => 'Too many requests. Please try again later.',
        ]);
        exit;
    }
}

// ── CSRF: Origin/Referer Validation for POST requests ───────────────────────
function enforceOriginCheck(): void {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        return; // Preflight — skip
    }

    $allowedHosts = [
        'peoplestar.com',
        'www.peoplestar.com',
        'localhost',
    ];

    // Check Origin header first, then Referer
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $referer = $_SERVER['HTTP_REFERER'] ?? '';

    $sourceHost = '';
    if ($origin !== '') {
        $parsed = parse_url($origin);
        $sourceHost = $parsed['host'] ?? '';
    } elseif ($referer !== '') {
        $parsed = parse_url($referer);
        $sourceHost = $parsed['host'] ?? '';
    }

    // If no origin info at all (e.g., server-to-server, curl) — allow
    // This preserves dev/testing compatibility
    if ($sourceHost === '') {
        return;
    }

    if (!in_array($sourceHost, $allowedHosts, true)) {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'error',
            'message' => 'Forbidden: origin not allowed.',
        ]);
        exit;
    }
}
