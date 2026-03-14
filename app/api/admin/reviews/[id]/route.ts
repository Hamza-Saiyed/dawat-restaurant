import { NextRequest } from 'next/server';
import { asyncHandler } from '@/backend/utils/asyncHandler';
import { ReviewController } from '@/backend/controllers/review.controller';

const controller = new ReviewController();

export const PATCH = asyncHandler(async (req: NextRequest, context) => {
  const params = await context!.params;
  return controller.update(req, params.id);
});

export const DELETE = asyncHandler(async (req: NextRequest, context) => {
  const params = await context!.params;
  return controller.delete(req, params.id);
});
