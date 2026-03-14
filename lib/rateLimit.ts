// Simple in-memory rate limiter for login/API requests
const attempts = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limit requests by IP
 * @param ip Client IP address
 * @param maxAttempts Maximum attempts allowed
 * @param windowMs Time window in milliseconds
 * @returns boolean true if allowed, false if limit exceeded
 */
export function rateLimit(ip: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const record = attempts.get(ip);
  
  if (!record || now > record.resetTime) {
    attempts.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxAttempts) {
    return false;
  }
  
  record.count++;
  return true;
}

/**
 * Clean up expired rate limit records periodically to prevent memory leaks
 */
export function cleanupRateLimits() {
  const now = Date.now();
  Array.from(attempts.entries()).forEach(([ip, record]) => {
    if (now > record.resetTime) {
      attempts.delete(ip);
    }
  });
}

// Run cleanup every 15 minutes roughly
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimits, 15 * 60 * 1000);
}
