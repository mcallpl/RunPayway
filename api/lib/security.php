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
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $key = md5($ip . ':' . $endpoint);

    $rateLimitDir = sys_get_temp_dir() . '/runpayway_ratelimit';
    if (!is_dir($rateLimitDir)) {
        @mkdir($rateLimitDir, 0755, true);
    }

    $file = $rateLimitDir . '/' . $key;
    $now = time();

    // Read existing timestamps
    $timestamps = [];
    if (file_exists($file)) {
        $data = @file_get_contents($file);
        if ($data !== false) {
            $timestamps = array_filter(
                explode("\n", trim($data)),
                fn($ts) => $ts !== '' && (int)$ts > ($now - $windowSeconds)
            );
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
