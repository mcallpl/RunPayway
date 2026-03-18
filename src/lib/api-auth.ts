// RUNPAYWAY™ — API Authentication Module
// Validates API key from x-api-key header or Authorization: Bearer <key>

/**
 * Validates an API key from the request headers.
 *
 * Checks `x-api-key` header first, then `Authorization: Bearer <key>`.
 * If no API key is configured in the environment (e.g., static deployment),
 * authentication is skipped gracefully.
 *
 * @returns true if the request is authorized, false otherwise
 */
export function validateApiKey(request: Request): boolean {
  const configuredKey = process.env.RUNPAYWAY_API_KEY;

  // If no API key is configured, allow only in development
  if (!configuredKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("[SECURITY] RUNPAYWAY_API_KEY is not set in production — rejecting all API requests");
      return false;
    }
    return true;
  }

  // Check x-api-key header
  const apiKeyHeader = request.headers.get("x-api-key");
  if (apiKeyHeader && timingSafeEqual(apiKeyHeader, configuredKey)) {
    return true;
  }

  // Check Authorization: Bearer <key>
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    const parts = authHeader.split(" ");
    if (
      parts.length === 2 &&
      parts[0].toLowerCase() === "bearer" &&
      timingSafeEqual(parts[1], configuredKey)
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Constant-time string comparison to prevent timing attacks.
 */
function timingSafeEqual(a: string, b: string): boolean {
  // Pad to equal length to prevent length-leak via timing
  const maxLen = Math.max(a.length, b.length);
  let result = a.length ^ b.length; // non-zero if lengths differ → always false
  for (let i = 0; i < maxLen; i++) {
    result |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return result === 0;
}
