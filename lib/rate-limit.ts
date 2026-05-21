/**
 * Tiny in-memory rate limiter for login attempts.
 *
 * Note: state lives in process memory — it resets on restart and isn't shared
 * across serverless instances. Combined with the hidden admin path and a
 * strong password, it's a solid brute-force deterrent for a personal site.
 */

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_FAILURES = 6; // allowed failed attempts per window

const failures = new Map<string, number[]>();

function recent(key: string): number[] {
  const now = Date.now();
  return (failures.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
}

/** Check whether a key is currently locked out. */
export function checkLoginAttempts(key: string): {
  blocked: boolean;
  retryAfterMin: number;
} {
  const hits = recent(key);
  if (hits.length >= MAX_FAILURES) {
    const retryAfterMs = WINDOW_MS - (Date.now() - hits[0]);
    return { blocked: true, retryAfterMin: Math.ceil(retryAfterMs / 60000) };
  }
  return { blocked: false, retryAfterMin: 0 };
}

/** Record a failed login attempt. */
export function recordFailedLogin(key: string): void {
  const hits = recent(key);
  hits.push(Date.now());
  failures.set(key, hits);
}

/** Clear attempts after a successful login. */
export function resetLoginAttempts(key: string): void {
  failures.delete(key);
}
