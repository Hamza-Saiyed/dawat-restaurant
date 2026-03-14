// Validation middleware — Zod schema validation wrapper

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ValidationError } from '@/backend/utils/asyncHandler';
import { sanitizeInput } from '@/backend/utils/sanitizeInput';

/**
 * Validate and sanitize request body against a Zod schema.
 * Throws ValidationError with field-level errors on failure.
 */
export async function validateBody<T>(
  req: NextRequest,
  schema: z.ZodSchema<T>
): Promise<T> {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    throw new ValidationError([
      { field: 'body', message: 'Invalid or missing JSON body' },
    ]);
  }

  // Sanitize input to prevent NoSQL injection
  const sanitizedBody = sanitizeInput(body);

  const result = schema.safeParse(sanitizedBody);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    throw new ValidationError(errors);
  }

  return result.data;
}

/**
 * Validate URL query/search parameters against a Zod schema.
 * Throws ValidationError with field-level errors on failure.
 */
export async function validateQuery<T>(
  req: NextRequest,
  schema: z.ZodSchema<T>
): Promise<T> {
  const params = Object.fromEntries(new URL(req.url).searchParams);
  const result = schema.safeParse(params);

  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    throw new ValidationError(errors);
  }

  return result.data;
}
