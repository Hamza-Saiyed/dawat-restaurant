import { NextRequest } from 'next/server';
import { asyncHandler } from '@/backend/utils/asyncHandler';
import { MenuController } from '@/backend/controllers/menu.controller';

const controller = new MenuController();

export const GET = asyncHandler((req: NextRequest) => controller.list(req));
export const POST = asyncHandler((req: NextRequest) => controller.create(req));
