import { NextRequest } from 'next/server';
import { asyncHandler } from '@/backend/utils/asyncHandler';
import { ContactController } from '@/backend/controllers/contact.controller';

const controller = new ContactController();

export const GET = asyncHandler(async (req: NextRequest, context) => {
  const params = await context!.params;
  return controller.getById(req, params.id);
});

export const PATCH = asyncHandler(async (req: NextRequest, context) => {
  const params = await context!.params;
  return controller.update(req, params.id);
});

export const DELETE = asyncHandler(async (req: NextRequest, context) => {
  const params = await context!.params;
  return controller.delete(req, params.id);
});
