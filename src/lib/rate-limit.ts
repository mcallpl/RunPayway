// RUNPAYWAY™ — Rate Limiter
// Simple in-memory IP-based rate limiting for API endpoints.
// Resets on server restart. Production-grade would use Redis.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetAt) store.delete(key);
    }
  }, 5 * 60 * 1000);
}

/**
 * Check if a request should be rate limited.
 * @param key Unique identifier (typically IP address)
 * @param maxRequests Maximum requests allowed in the window
 * @param windowMs Time window in milliseconds
 * @returns { allowed: boolean, remaining: number, resetAt: number }
 */
export function checkRateLimit(
  key: string,
  maxRequests = 20,
  windowMs = 60 * 1000,
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  entry.count += 1;

  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}

/**
 * Rate limit configurations for different endpoints.
 */
export const RATE_LIMITS = {
  scoring: { maxRequests: 10, windowMs: 60 * 1000 },     // 10 scores per minute
  contact: { maxRequests: 5, windowMs: 60 * 1000 },      // 5 contact submissions per minute
  monitoring: { maxRequests: 20, windowMs: 60 * 1000 },   // 20 monitoring ops per minute
  signIn: { maxRequests: 10, windowMs: 5 * 60 * 1000 },  // 10 sign-in attempts per 5 minutes
} as const;
