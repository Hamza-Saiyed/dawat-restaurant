// Global error handler middleware

import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { AppError, ValidationError } from '@/backend/utils/asyncHandler';
import { ApiResponse } from '@/backend/utils/apiResponse';

/**
 * Handle an error and return an appropriate API response.
 * Used as a fallback handler for uncaught errors.
 */
export function handleError(error: unknown): NextResponse {
  if (error instanceof ValidationError) {
    return ApiResponse.validationError(error.validationErrors);
  }

  if (error instanceof AppError) {
    return ApiResponse.error(error.message, error.code, error.statusCode);
  }

  // Mongoose validation error
  if (error instanceof Error && error.name === 'ValidationError') {
    logger.warn('Mongoose validation error', { message: error.message });
    return ApiResponse.error('Database validation failed', 'DB_VALIDATION_ERROR', 400);
  }

  // Mongoose cast error (e.g. invalid ObjectId)
  if (error instanceof Error && error.name === 'CastError') {
    logger.warn('Invalid ID format', { message: error.message });
    return ApiResponse.error('Invalid ID format', 'INVALID_ID', 400);
  }

  // MongoDB duplicate key error
  if (error instanceof Error && 'code' in error && (error as { code: number }).code === 11000) {
    logger.warn('Duplicate key error', { message: error.message });
    return ApiResponse.error('Duplicate entry', 'DUPLICATE_KEY', 409);
  }

  // Unknown error
  logger.error('Unhandled error', {
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
  });

  return ApiResponse.serverError();
}
