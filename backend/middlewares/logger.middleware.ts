// Request/response logging middleware

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * Log an HTTP request with method, URL, status, and duration.
 */
export function logRequest(
  req: NextRequest,
  status: number,
  duration: number
): void {
  const logData = {
    method: req.method,
    url: req.url,
    status,
    duration: `${duration}ms`,
    ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
    userAgent: req.headers.get('user-agent')?.slice(0, 100),
  };

  if (status >= 500) {
    logger.error('HTTP Request', logData);
  } else if (status >= 400) {
    logger.warn('HTTP Request', logData);
  } else {
    logger.info('HTTP Request', logData);
  }
}
