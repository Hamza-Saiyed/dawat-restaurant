// Sanitization middleware — NoSQL injection prevention

import { NextRequest } from 'next/server';
import { sanitizeInput } from '@/backend/utils/sanitizeInput';

/**
 * Sanitize request body from a NextRequest.
 * Parses JSON and strips MongoDB operators.
 */
export async function sanitizeRequestBody(req: NextRequest): Promise<Record<string, unknown>> {
  try {
    const body = await req.json();
    return sanitizeInput(body) as Record<string, unknown>;
  } catch {
    return {};
  }
}
