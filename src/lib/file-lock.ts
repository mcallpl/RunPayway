// RUNPAYWAY™ — File-based locking for concurrent write safety
// Uses exclusive-create flag (wx) to atomically acquire locks

import { writeFileSync, unlinkSync, statSync } from "fs";

const STALE_THRESHOLD_MS = 30_000; // 30s — assume lock is stale after this
const RETRY_DELAY_MS = 50;
const MAX_RETRIES = 100; // 5 seconds max wait

function isLockStale(lockPath: string): boolean {
  try {
    const stat = statSync(lockPath);
    return Date.now() - stat.mtimeMs > STALE_THRESHOLD_MS;
  } catch {
    return true; // file doesn't exist or can't stat — treat as stale
  }
}

function tryRemoveStaleLock(lockPath: string): void {
  if (isLockStale(lockPath)) {
    try {
      unlinkSync(lockPath);
    } catch {
      // another process may have already removed it
    }
  }
}

/**
 * Acquire an exclusive file lock. Retries with delay if locked.
 * Throws after timeout if lock cannot be acquired.
 */
export async function acquireFileLock(
  lockPath: string,
  timeoutMs: number = MAX_RETRIES * RETRY_DELAY_MS,
): Promise<void> {
  const maxAttempts = Math.ceil(timeoutMs / RETRY_DELAY_MS);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      // wx = exclusive create — fails atomically if file exists
      writeFileSync(lockPath, String(process.pid), { flag: "wx" });
      return; // lock acquired
    } catch (err: unknown) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code !== "EEXIST") throw err; // unexpected error

      // Lock file exists — check if stale
      tryRemoveStaleLock(lockPath);

      // Wait before retry
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    }
  }

  throw new Error(`Failed to acquire file lock: ${lockPath} (timeout after ${timeoutMs}ms)`);
}

/**
 * Release a file lock. Safe to call even if lock doesn't exist.
 */
export function releaseFileLock(lockPath: string): void {
  try {
    unlinkSync(lockPath);
  } catch {
    // lock may have been removed by another process or stale cleanup
  }
}
