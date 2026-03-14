import { NextRequest } from 'next/server';
import { asyncHandler } from '@/backend/utils/asyncHandler';
import { ReservationController } from '@/backend/controllers/reservation.controller';

const controller = new ReservationController();

export const GET = asyncHandler(async (req: NextRequest, context) => {
  const params = await context!.params;
  return controller.getById(req, params.id);
});

export const PATCH = asyncHandler(async (req: NextRequest, context) => {
  const params = await context!.params;
  return controller.updateStatus(req, params.id);
});

export const DELETE = asyncHandler(async (req: NextRequest, context) => {
  const params = await context!.params;
  return controller.delete(req, params.id);
});
