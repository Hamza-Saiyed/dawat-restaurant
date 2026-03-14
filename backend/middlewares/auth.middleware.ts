// Auth middleware — JWT verification for API routes

import { NextRequest } from 'next/server';
import { verifyToken, getTokenFromRequest, TokenPayload } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { AppError } from '@/backend/utils/asyncHandler';

export interface AdminPayload {
  id: string;
  email: string;
  role: string;
  name: string;
}

/**
 * Verify JWT token from cookie and return admin payload.
 * Throws AppError if not authenticated.
 */
export async function requireAuth(req: NextRequest): Promise<AdminPayload> {
  const token = getTokenFromRequest(req);

  if (!token) {
    throw new AppError('Authentication required', 401, 'AUTH_REQUIRED');
  }

  const payload = await verifyToken(token);

  if (!payload) {
    throw new AppError('Invalid or expired token', 401, 'INVALID_TOKEN');
  }

  // Verify admin still exists and is active
  await connectDB();
  const admin = await Admin.findById(payload.adminId).select('name email role isActive').lean();

  if (!admin) {
    throw new AppError('Admin account not found', 401, 'ACCOUNT_NOT_FOUND');
  }

  if (!admin.isActive) {
    throw new AppError('Admin account disabled', 401, 'ACCOUNT_DISABLED');
  }

  return {
    id: (admin._id as unknown as { toString(): string }).toString(),
    email: admin.email,
    role: admin.role,
    name: admin.name,
  };
}

/**
 * Role-based access control. Verifies auth and checks role permissions.
 */
export function requireRole(...roles: string[]) {
  return async (req: NextRequest): Promise<AdminPayload> => {
    const admin = await requireAuth(req);

    if (!roles.includes(admin.role)) {
      throw new AppError('Insufficient permissions', 403, 'FORBIDDEN');
    }

    return admin;
  };
}
