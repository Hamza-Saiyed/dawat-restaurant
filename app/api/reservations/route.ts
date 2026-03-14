import { NextRequest } from 'next/server';
import { asyncHandler } from '@/backend/utils/asyncHandler';
import { ReservationController } from '@/backend/controllers/reservation.controller';

const controller = new ReservationController();

export const POST = asyncHandler((req: NextRequest) => controller.create(req));
export const GET = asyncHandler((req: NextRequest) => controller.listPublic(req));
