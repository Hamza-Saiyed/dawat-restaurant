// Dashboard controller — handles admin dashboard analytics

import { NextRequest, NextResponse } from 'next/server';
import { DashboardService } from '@/backend/services/dashboard.service';
import { requireAuth } from '@/backend/middlewares/auth.middleware';
import { ApiResponse } from '@/backend/utils/apiResponse';


const service = new DashboardService();

export class DashboardController {
  /** GET /api/admin/dashboard */
  async get(req: NextRequest): Promise<NextResponse> {
    await requireAuth(req);
    const data = await service.getDashboardData();

    return ApiResponse.success(data);
  }
}

