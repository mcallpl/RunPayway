// RunPayway — Input sanitization utilities

export function stripHtml(str) {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").trim();
}

export function sanitizeString(str, maxLength = 500) {
  if (typeof str !== "string") return "";
  return stripHtml(str).slice(0, maxLength);
}

export function sanitizeEmail(email) {
  if (typeof email !== "string") return "";
  const cleaned = email.toLowerCase().trim().slice(0, 254);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned) ? cleaned : "";
}

export function sanitizeNumber(val, min = 0, max = 100, fallback = 0) {
  const n = Number(val);
  return isNaN(n) ? fallback : Math.max(min, Math.min(max, n));
}

export function sanitizeInteger(val, min = 0, max = 100, fallback = 0) {
  return Math.round(sanitizeNumber(val, min, max, fallback));
}
