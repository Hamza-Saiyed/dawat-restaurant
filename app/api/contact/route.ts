import { NextRequest } from 'next/server';
import { asyncHandler } from '@/backend/utils/asyncHandler';
import { ContactController } from '@/backend/controllers/contact.controller';

const controller = new ContactController();

export const POST = asyncHandler((req: NextRequest) => controller.create(req));
