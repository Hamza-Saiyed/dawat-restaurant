import { NextRequest } from 'next/server';
import { asyncHandler } from '@/backend/utils/asyncHandler';
import { MenuController } from '@/backend/controllers/menu.controller';

const controller = new MenuController();

export const PUT = asyncHandler(async (req: NextRequest, context) => {
  const params = await context!.params;
  return controller.update(req, params.id);
});

export const DELETE = asyncHandler(async (req: NextRequest, context) => {
  const params = await context!.params;
  return controller.delete(req, params.id);
});
