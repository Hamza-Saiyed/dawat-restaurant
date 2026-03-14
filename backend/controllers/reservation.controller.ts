// Reservation controller — handles reservation CRUD

import { NextRequest, NextResponse } from 'next/server';
import { ReservationService } from '@/backend/services/reservation.service';
import { validateBody, validateQuery } from '@/backend/middlewares/validate.middleware';
import { createRateLimit, getClientIP } from '@/backend/middlewares/rateLimit.middleware';
import { requireAuth } from '@/backend/middlewares/auth.middleware';
import { ReservationCreateSchema, ReservationUpdateStatusSchema, ReservationQuerySchema } from '@/backend/validators/reservation.validator';
import { ApiResponse } from '@/backend/utils/apiResponse';


const service = new ReservationService();

export class ReservationController {
  /** POST /api/reservations — public reservation creation */
  async create(req: NextRequest): Promise<NextResponse> {
    // Rate limit
    const rateLimitResult = await createRateLimit('reservation-create')(req);
    if (rateLimitResult) return rateLimitResult;

    // Validate
    const data = await validateBody(req, ReservationCreateSchema);
    const ip = getClientIP(req);

    // Create
    const reservation = await service.createReservation(data, ip);

    return ApiResponse.created(
      { confirmationId: reservation.confirmationId },
      'Reservation successfully created'
    );
  }


  /** GET /api/reservations — public list (limited) */
  async listPublic(req: NextRequest): Promise<NextResponse> {
    const query = await validateQuery(req, ReservationQuerySchema);
    const result = await service.getReservations(query);

    return ApiResponse.success(result.data);
  }


  /** GET /api/admin/reservations — admin list with pagination */
  async listAdmin(req: NextRequest): Promise<NextResponse> {
    await requireAuth(req);

    const { searchParams } = new URL(req.url);
    const query = {
      status: (searchParams.get('status') as 'all' | 'pending' | 'approved' | 'rejected' | 'completed') || undefined,
      date: searchParams.get('date') || undefined,
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      sortBy: (searchParams.get('sortBy') as 'createdAt' | 'date' | 'name' | 'guests') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    };

    const result = await service.getReservations(query);

    return ApiResponse.success(result.data, 'Reservations fetched', {
      total: result.meta.total,
      page: result.meta.page,
      limit: result.meta.limit,
      totalPages: result.meta.totalPages,
    });
  }


  /** GET /api/admin/reservations/[id] */
  async getById(req: NextRequest, id: string): Promise<NextResponse> {
    await requireAuth(req);
    const reservation = await service.getById(id);
    return ApiResponse.success(reservation);
  }


  /** PATCH /api/admin/reservations/[id] */
  async updateStatus(req: NextRequest, id: string): Promise<NextResponse> {
    const admin = await requireAuth(req);
    const data = await validateBody(req, ReservationUpdateStatusSchema);

    const reservation = await service.updateStatus(
      id,
      data.status,
      data.adminNote,
      admin.email
    );

    return ApiResponse.success(reservation, 'Status updated successfully');
  }


  /** DELETE /api/admin/reservations/[id] */
  async delete(req: NextRequest, id: string): Promise<NextResponse> {
    const admin = await requireAuth(req);
    await service.delete(id, admin.email);
    return ApiResponse.success(null, 'Reservation deleted');
  }
}

