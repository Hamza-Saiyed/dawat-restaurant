import { NextRequest } from 'next/server';
import { asyncHandler } from '@/backend/utils/asyncHandler';
import { GalleryController } from '@/backend/controllers/gallery.controller';

const controller = new GalleryController();

export const PUT = asyncHandler((req: NextRequest) => controller.reorder(req));
