// RUNPAYWAY™ Income Stability Score™ Diagnostic System
// Model RP-1.0 | Version 1.0 — Storage Backend Factory

import type { StorageBackend } from "./types";
import { JsonStorageBackend } from "./storage-json";

export function createStorageBackend(): StorageBackend {
  // Phase 1: JSON file backend
  // Phase 2: PostgreSQL backend (based on STORAGE_BACKEND env var)
  return new JsonStorageBackend();
}
