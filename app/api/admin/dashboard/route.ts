import { NextRequest } from 'next/server';
import { asyncHandler } from '@/backend/utils/asyncHandler';
import { DashboardController } from '@/backend/controllers/dashboard.controller';

const controller = new DashboardController();

export const GET = asyncHandler((req: NextRequest) => controller.get(req));
