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

  // If no API key is configured, skip auth (static deployment / dev mode)
  if (!configuredKey) {
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
  if (a.length !== b.length) {
    // Still do a comparison to avoid leaking length info via timing
    let result = a.length ^ b.length;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ (b.charCodeAt(i % b.length) || 0);
    }
    return result === 0;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
