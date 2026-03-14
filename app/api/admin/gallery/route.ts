import { NextRequest } from 'next/server';
import { asyncHandler } from '@/backend/utils/asyncHandler';
import { GalleryController } from '@/backend/controllers/gallery.controller';

const controller = new GalleryController();

export const GET = asyncHandler((req: NextRequest) => controller.list(req));
export const POST = asyncHandler((req: NextRequest) => controller.upload(req));
