/**
 * Fetch with timeout — rejects if response doesn't arrive within timeoutMs.
 */
export function fetchWithTimeout(url: string, opts: RequestInit, timeoutMs = 15000): Promise<Response> {
  return Promise.race([
    fetch(url, opts),
    new Promise<Response>((_, reject) => setTimeout(() => reject(new Error("Timeout")), timeoutMs)),
  ]);
}

/**
 * Fetch with exponential backoff retry.
 * Retries on 5xx and 429 (rate limit). Does not retry 4xx client errors.
 */
export async function fetchWithRetry(
  url: string, opts: RequestInit,
  { maxRetries = 3, baseDelayMs = 1000, timeoutMs = 15000 } = {}
): Promise<Response> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await fetchWithTimeout(url, opts, timeoutMs);
      if (res.ok || (res.status >= 400 && res.status < 500 && res.status !== 429)) return res;
      lastError = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
    if (attempt < maxRetries - 1) await new Promise(r => setTimeout(r, baseDelayMs * Math.pow(2, attempt)));
  }
  throw lastError || new Error("fetchWithRetry exhausted");
}
