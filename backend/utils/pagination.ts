// Pagination utility for MongoDB queries
import mongoose from 'mongoose';

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export async function paginate<T>(
  model: mongoose.Model<T>,
  filter: Record<string, unknown>,
  options: PaginationOptions,
  select?: string
): Promise<PaginatedResult<T>> {
  const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = options;

  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [data, total] = await Promise.all([
    model
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(select || '')
      .lean(),
    model.countDocuments(filter),
  ]);

  return {
    data: data as T[],
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      hasNextPage: page < (Math.ceil(total / limit) || 1),
      hasPrevPage: page > 1,
    },
  };
}

/**
 * Parse pagination params from query string with defaults.
 */
export function parsePaginationParams(searchParams: URLSearchParams): PaginationOptions {
  return {
    page: Math.max(1, parseInt(searchParams.get('page') || '1', 10)),
    limit: Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10))),
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
  };
}
