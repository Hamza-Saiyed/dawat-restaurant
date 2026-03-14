// Redis connection configuration

export const redisConfig = {
  url: process.env.REDIS_URL || '',
  options: {
    maxRetriesPerRequest: 3,
    retryStrategy: (times: number) => {
      if (times > 3) {
        return null; // Stop retrying
      }
      return Math.min(times * 200, 1000); // Exponential backoff
    },
    lazyConnect: true,
  },
};

export function isRedisConfigured(): boolean {
  return !!process.env.REDIS_URL;
}
