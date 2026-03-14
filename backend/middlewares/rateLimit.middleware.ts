// Rate limiting middleware with Redis backend (falls back to in-memory)

import { NextRequest } from 'next/server';
import { redis } from '@/lib/redis';
import { logger } from '@/lib/logger';
import { RATE_LIMITS } from '@/backend/config/constants';
import { ApiResponse } from '@/backend/utils/apiResponse';

// In-memory fallback store
const memoryStore = new Map<string, { count: number; resetTime: number }>();

// Cleanup old entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    Array.from(memoryStore.entries()).forEach(([key, record]) => {
      if (now > record.resetTime) {
        memoryStore.delete(key);
      }
    });
  }, 60 * 1000);
}

/**
 * Get client IP from request headers.
 */
function getClientIP(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';
}

/**
 * Creates a rate limiter function for the specified type.
 * Returns null if request is allowed, or a 429 NextResponse if blocked.
 */
export function createRateLimit(type: keyof typeof RATE_LIMITS) {
  const config = RATE_LIMITS[type];

  return async (req: NextRequest) => {
    const ip = getClientIP(req);
    const key = `${config.keyPrefix}${ip}`;

    try {
      // Try Redis first
      const count = await redis.incr(key);

      if (count === 1) {
        // First request in window — set TTL
        await redis.expire(key, Math.ceil(config.windowMs / 1000));
      }

      if (count > config.max) {
        const ttl = await redis.ttl(key);
        logger.warn('Rate limit exceeded', {
          type,
          ip,
          count,
          max: config.max,
        });
        return ApiResponse.tooManyRequests(config.message, ttl > 0 ? ttl : undefined);
      }

      return null; // Allowed
    } catch {
      // Redis unavailable — fall back to in-memory
      return memoryRateLimit(key, config, ip, type);
    }
  };
}

function memoryRateLimit(
  key: string,
  config: typeof RATE_LIMITS[keyof typeof RATE_LIMITS],
  ip: string,
  type: string,
) {
  const now = Date.now();
  const record = memoryStore.get(key);

  if (!record || now > record.resetTime) {
    memoryStore.set(key, { count: 1, resetTime: now + config.windowMs });
    return null; // Allowed
  }

  record.count++;

  if (record.count > config.max) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    logger.warn('Rate limit exceeded (memory fallback)', {
      type,
      ip,
      count: record.count,
      max: config.max,
    });
    return ApiResponse.tooManyRequests(config.message, retryAfter > 0 ? retryAfter : undefined);
  }

  return null; // Allowed
}

export { getClientIP };
