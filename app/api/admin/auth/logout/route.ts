import { NextRequest } from 'next/server';
import { asyncHandler } from '@/backend/utils/asyncHandler';
import { AuthController } from '@/backend/controllers/auth.controller';

const controller = new AuthController();

export const POST = asyncHandler((req: NextRequest) => controller.logout(req));
