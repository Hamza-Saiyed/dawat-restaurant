// Cache service — Redis caching abstraction with graceful fallback

import { redis } from '@/lib/redis';
import { logger } from '@/lib/logger';

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.warn('Cache GET failed, bypassing cache', { key, error: error instanceof Error ? error.message : 'Unknown' });
      return null;
    }
  }

  static async set(key: string, value: unknown, ttlSeconds: number = 3600): Promise<void> {
    try {
      await redis.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      logger.warn('Cache SET failed', { key, error: error instanceof Error ? error.message : 'Unknown' });
    }
  }

  static async delete(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      logger.warn('Cache DELETE failed', { key, error: error instanceof Error ? error.message : 'Unknown' });
    }
  }

  static async deletePattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      logger.warn('Cache DELETE PATTERN failed', { pattern, error: error instanceof Error ? error.message : 'Unknown' });
    }
  }

  static async exists(key: string): Promise<boolean> {
    try {
      return (await redis.exists(key)) === 1;
    } catch {
      return false;
    }
  }
}
