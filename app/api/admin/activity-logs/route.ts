// NEW: Admin activity logs endpoint

import { NextRequest } from 'next/server';
import { asyncHandler } from '@/backend/utils/asyncHandler';
import { requireAuth } from '@/backend/middlewares/auth.middleware';
import { ActivityLogService } from '@/backend/services/activityLog.service';
import { NextResponse } from 'next/server';

export const GET = asyncHandler(async (req: NextRequest) => {
  await requireAuth(req);

  const { searchParams } = new URL(req.url);
  const limit = Math.min(100, parseInt(searchParams.get('limit') || '50'));
  const adminFilter = searchParams.get('admin') || undefined;

  const logs = adminFilter
    ? await ActivityLogService.getLogsByAdmin(adminFilter, limit)
    : await ActivityLogService.getRecentLogs(limit);

  return NextResponse.json({ success: true, logs });
});
