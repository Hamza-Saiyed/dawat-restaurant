import { NextRequest } from 'next/server';
import { asyncHandler } from '@/backend/utils/asyncHandler';
import { ReviewController } from '@/backend/controllers/review.controller';

const controller = new ReviewController();

export const GET = asyncHandler((req: NextRequest) => controller.list(req));
