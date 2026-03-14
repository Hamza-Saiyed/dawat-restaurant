// Redis client singleton with graceful fallback

import Redis from 'ioredis';
import { logger } from './logger';

let redis: Redis;

function createRedisClient(): Redis {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    logger.warn('REDIS_URL not configured — caching disabled, using no-op Redis client');
    // Return a mock client that silently fails all operations
    return createNoopRedisClient();
  }

  const client = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times: number) => {
      if (times > 3) {
        logger.error('Redis connection failed after 3 retries');
        return null; // Stop retrying
      }
      return Math.min(times * 200, 1000); // Exponential backoff
    },
    lazyConnect: true,
  });

  client.on('connect', () => logger.info('✅ Redis connected'));
  client.on('error', (err) => logger.error('Redis error', { error: err.message }));
  client.on('close', () => logger.warn('Redis connection closed'));

  // Attempt to connect
  client.connect().catch((err) => {
    logger.error('Redis initial connection failed', { error: err.message });
  });

  return client;
}

/**
 * Creates a no-op Redis client that silently returns nulls/defaults.
 * Used when Redis is not configured — ensures the app doesn't crash.
 */
function createNoopRedisClient(): Redis {
  const handler: ProxyHandler<Redis> = {
    get(_target, prop) {
      // Return no-op async functions for common Redis methods
      if (typeof prop === 'string') {
        const asyncNoopMethods = ['get', 'setex', 'set', 'del', 'keys', 'exists', 'incr', 'expire', 'ttl', 'ping'];
        if (asyncNoopMethods.includes(prop)) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return async (..._rest: unknown[]) => {
            if (prop === 'get') return null;
            if (prop === 'keys') return [];
            if (prop === 'exists') return 0;
            if (prop === 'incr') return 1;
            if (prop === 'ttl') return -1;
            if (prop === 'ping') return 'PONG';
            return 'OK';
          };
        }
        if (prop === 'on' || prop === 'connect' || prop === 'disconnect') {
          return () => {};
        }
        if (prop === 'status') {
          return 'close';
        }
      }
      return undefined;
    },
  };
  return new Proxy({} as Redis, handler);
}

// Singleton pattern
if (process.env.NODE_ENV === 'production') {
  redis = createRedisClient();
} else {
  const globalWithRedis = global as typeof globalThis & { _redis?: Redis };
  if (!globalWithRedis._redis) {
    globalWithRedis._redis = createRedisClient();
  }
  redis = globalWithRedis._redis;
}

export { redis };
