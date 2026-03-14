// Standardized API response builder
import { NextResponse } from 'next/server';

interface ResponseMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

interface FieldError {
  field: string;
  message: string;
}

export const ApiResponse = {
  success(data?: unknown, message?: string, meta?: ResponseMeta): NextResponse {
    return NextResponse.json(
      {
        success: true,
        message: message || 'Success',
        data: data ?? null,
        ...(meta ? { meta } : {}),
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  },

  created(data?: unknown, message?: string): NextResponse {
    return NextResponse.json(
      {
        success: true,
        message: message || 'Created successfully',
        data: data ?? null,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  },

  noContent(): NextResponse {
    return new NextResponse(null, { status: 204 });
  },

  error(message: string, code?: string, status?: number): NextResponse {
    return NextResponse.json(
      {
        success: false,
        message,
        code: code || 'ERROR',
        timestamp: new Date().toISOString(),
      },
      { status: status || 500 }
    );
  },

  validationError(errors: FieldError[]): NextResponse {
    return NextResponse.json(
      {
        success: false,
        message: 'Validation failed',
        errors,
        code: 'VALIDATION_ERROR',
        timestamp: new Date().toISOString(),
      },
      { status: 422 }
    );
  },

  unauthorized(message?: string): NextResponse {
    return NextResponse.json(
      {
        success: false,
        message: message || 'Authentication required',
        code: 'UNAUTHORIZED',
        timestamp: new Date().toISOString(),
      },
      { status: 401 }
    );
  },

  forbidden(message?: string): NextResponse {
    return NextResponse.json(
      {
        success: false,
        message: message || 'Insufficient permissions',
        code: 'FORBIDDEN',
        timestamp: new Date().toISOString(),
      },
      { status: 403 }
    );
  },

  notFound(resource?: string): NextResponse {
    return NextResponse.json(
      {
        success: false,
        message: resource ? `${resource} not found` : 'Resource not found',
        code: 'NOT_FOUND',
        timestamp: new Date().toISOString(),
      },
      { status: 404 }
    );
  },

  tooManyRequests(message?: string, retryAfter?: number): NextResponse {
    const headers: Record<string, string> = {};
    if (retryAfter) {
      headers['Retry-After'] = String(retryAfter);
    }
    return NextResponse.json(
      {
        success: false,
        message: message || 'Rate limit exceeded',
        code: 'TOO_MANY_REQUESTS',
        timestamp: new Date().toISOString(),
      },
      { status: 429, headers }
    );
  },

  serverError(message?: string): NextResponse {
    return NextResponse.json(
      {
        success: false,
        message: message || 'Internal server error',
        code: 'SERVER_ERROR',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  },
};
