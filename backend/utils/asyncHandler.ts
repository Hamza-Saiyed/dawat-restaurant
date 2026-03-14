// Async error handler wrapper + custom error classes
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { ApiResponse } from './apiResponse';
import mongoose from 'mongoose';


/**
 * Custom application error with status code and machine-readable code.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'SERVER_ERROR'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Validation error with field-level error details.
 */
export class ValidationError extends AppError {
  constructor(
    public validationErrors: Array<{ field: string; message: string }>
  ) {
    super('Validation failed', 422, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

/**
 * Wraps an async route handler to catch errors automatically.
 * Eliminates try/catch boilerplate in every controller method.
 */
export function asyncHandler(
  fn: (req: NextRequest, context?: { params: Promise<Record<string, string>> }) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: { params: Promise<Record<string, string>> }): Promise<NextResponse> => {
    const start = Date.now();
    try {
      const response = await fn(req, context);
      const duration = Date.now() - start;
      logger.info('HTTP Request', {
        method: req.method,
        url: req.url,
        status: response.status,
        duration: `${duration}ms`,
        ip: req.headers.get('x-forwarded-for') || 'unknown',
      });
      return response;
    } catch (error) {
      const duration = Date.now() - start;

      if (error instanceof ValidationError) {
        logger.warn('Validation error', {
          url: req.url,
          method: req.method,
          errors: error.validationErrors,
          duration: `${duration}ms`,
        });
        return ApiResponse.validationError(error.validationErrors);
      }

      // Handle Mongoose Validation Error
      if (error instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message,
        }));
        logger.warn('Mongoose Validation error', { url: req.url, errors });
        return ApiResponse.validationError(errors);
      }

      // Handle Mongoose Cast Error (Invalid ID)
      if (error instanceof mongoose.Error.CastError) {
        logger.warn('Mongoose Cast error', { 
          url: req.url, 
          model: (error as any).modelName, 
          value: (error as any).value 
        });
        return ApiResponse.notFound(`${(error as any).modelName || 'Resource'}`);
      }



      if (error instanceof AppError) {
        logger.warn('Application error', {
          url: req.url,
          method: req.method,
          message: error.message,
          code: error.code,
          statusCode: error.statusCode,
          duration: `${duration}ms`,
        });
        return ApiResponse.error(error.message, error.code, error.statusCode);
      }

      logger.error('Unhandled error in route handler', {
        url: req.url,
        method: req.method,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        duration: `${duration}ms`,
      });

      return ApiResponse.serverError();
    }
  };
}
