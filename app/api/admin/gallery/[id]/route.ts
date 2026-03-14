import { NextRequest } from 'next/server';
import { asyncHandler } from '@/backend/utils/asyncHandler';
import { GalleryController } from '@/backend/controllers/gallery.controller';

const controller = new GalleryController();

export const PATCH = asyncHandler(async (req: NextRequest, context) => {
  const params = await context!.params;
  return controller.update(req, params.id);
});

export const DELETE = asyncHandler(async (req: NextRequest, context) => {
  const params = await context!.params;
  return controller.delete(req, params.id);
});
