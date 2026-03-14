import { NextRequest } from 'next/server';
import { asyncHandler } from '@/backend/utils/asyncHandler';
import { SettingsController } from '@/backend/controllers/settings.controller';

const controller = new SettingsController();

export const GET = asyncHandler(() => controller.get());
export const PUT = asyncHandler((req: NextRequest) => controller.update(req));
