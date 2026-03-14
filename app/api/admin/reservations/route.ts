import { NextRequest } from 'next/server';
import { asyncHandler } from '@/backend/utils/asyncHandler';
import { ReservationController } from '@/backend/controllers/reservation.controller';

const controller = new ReservationController();

export const GET = asyncHandler((req: NextRequest) => controller.listAdmin(req));
