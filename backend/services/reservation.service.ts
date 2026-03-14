// Reservation service — business logic layer

import { ReservationRepository } from '@/backend/repositories/reservation.repository';
import { EmailService } from './email.service';
import { ActivityLogService } from './activityLog.service';
import { AppError } from '@/backend/utils/asyncHandler';
import { logger } from '@/lib/logger';
import { isTodayOrFuture, isWithinMaxDays, isToday, timeToMinutes } from '@/backend/utils/dateUtils';
import { RESERVATION_RULES } from '@/backend/config/constants';
import { CreateReservationDto, ReservationQueryDto } from '@/backend/validators/reservation.validator';
import { IReservation } from '@/models/Reservation';
import { PaginatedResult } from '@/backend/utils/pagination';

export class ReservationService {
  async createReservation(data: CreateReservationDto, ipAddress: string): Promise<IReservation> {
    const bookingDate = new Date(data.date);

    // Rule 1: Date must be today or future
    if (!isTodayOrFuture(bookingDate)) {
      throw new AppError('Cannot book a reservation in the past', 400, 'PAST_DATE');
    }

    // Rule 2: Max 60 days in advance
    if (!isWithinMaxDays(bookingDate, RESERVATION_RULES.MAX_ADVANCE_DAYS)) {
      throw new AppError('Cannot book more than 60 days in advance', 400, 'TOO_FAR_AHEAD');
    }

    // Rule 3: Prevent duplicate bookings
    const isDuplicate = await ReservationRepository.checkDuplicate(data.phone, bookingDate, data.time);
    if (isDuplicate) {
      throw new AppError(
        'You already have a reservation at this date and time. Call us to modify it.',
        409,
        'DUPLICATE_RESERVATION'
      );
    }

    // Rule 4: Max guests
    if (data.guests > RESERVATION_RULES.MAX_GUESTS) {
      throw new AppError(`Maximum ${RESERVATION_RULES.MAX_GUESTS} guests per reservation. Call us for larger groups.`, 400, 'TOO_MANY_GUESTS');
    }

    // Rule 5: Restaurant hours check
    const timeMins = timeToMinutes(data.time);
    if (timeMins < RESERVATION_RULES.OPENING_HOUR * 60 && timeMins > 30) {
      throw new AppError('Restaurant is not open at this time. Hours: 11 AM – 1 AM', 400, 'OUTSIDE_HOURS');
    }

    // Rule 6: Same-day booking cutoff
    if (isToday(bookingDate)) {
      const now = new Date();
      const bookingTime = new Date(bookingDate);
      const [hours, minutes] = data.time.split(':').map(Number);
      bookingTime.setHours(hours, minutes, 0, 0);
      if (bookingTime.getTime() - now.getTime() < RESERVATION_RULES.MIN_ADVANCE_MINUTES * 60 * 1000) {
        throw new AppError('Please book at least 1 hour in advance for same-day reservations', 400, 'TOO_SOON');
      }
    }

    // Create reservation
    const reservation = await ReservationRepository.create({
      ...data,
      date: bookingDate,
      ipAddress,
      status: 'pending',
      source: 'website',
    } as Partial<IReservation>);

    // Send emails (non-blocking)
    EmailService.sendReservationConfirmation(reservation).catch(err =>
      logger.error('Failed to send confirmation email', { error: err.message, reservationId: (reservation._id as unknown as { toString(): string }).toString() })
    );
    EmailService.sendNewBookingNotification(reservation).catch(err =>
      logger.error('Failed to send restaurant notification', { error: err.message })
    );

    return reservation;
  }

  async updateStatus(
    id: string,
    status: 'approved' | 'rejected' | 'completed',
    adminNote: string | undefined,
    adminEmail: string
  ): Promise<IReservation> {
    const reservation = await ReservationRepository.findById(id);

    if (!reservation) {
      throw new AppError('Reservation not found', 404, 'NOT_FOUND');
    }

    // Status transition rules
    const validTransitions: Record<string, string[]> = {
      pending: ['approved', 'rejected'],
      approved: ['completed', 'rejected'],
      rejected: [],
      completed: [],
    };

    if (!validTransitions[reservation.status]?.includes(status)) {
      throw new AppError(
        `Cannot transition from ${reservation.status} to ${status}`,
        400,
        'INVALID_STATUS_TRANSITION'
      );
    }

    const updated = await ReservationRepository.updateStatus(id, status, adminNote, adminEmail);

    // Send approval email (non-blocking)
    if (status === 'approved' && updated?.email) {
      EmailService.sendReservationApproval(updated).catch(err =>
        logger.error('Failed to send approval email', { error: err.message })
      );
    }

    // Log admin activity (non-blocking)
    const actionMap: Record<string, string> = {
      approved: 'RESERVATION_APPROVED',
      rejected: 'RESERVATION_REJECTED',
      completed: 'RESERVATION_COMPLETED',
    };
    ActivityLogService.log({
      adminEmail,
      action: actionMap[status],
      resourceType: 'reservation',
      resourceId: id,
      details: { previousStatus: reservation.status, newStatus: status, adminNote },
    }).catch(() => {});

    return updated!;
  }

  async getReservations(query: ReservationQueryDto): Promise<PaginatedResult<IReservation>> {
    const { status, date, search, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const filter: Record<string, unknown> = {};

    if (status && status !== 'all') filter.status = status;

    if (date) {
      const d = new Date(date);
      const dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);
      filter.date = { $gte: dayStart, $lte: dayEnd };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { confirmationId: { $regex: search, $options: 'i' } },
      ];
    }

    return ReservationRepository.findWithPagination(filter, { page, limit, sortBy, sortOrder });
  }

  async getById(id: string): Promise<IReservation> {
    const reservation = await ReservationRepository.findByIdLean(id);
    if (!reservation) {
      throw new AppError('Reservation not found', 404, 'NOT_FOUND');
    }
    return reservation;
  }

  async delete(id: string, adminEmail: string): Promise<void> {
    const reservation = await ReservationRepository.findById(id);
    if (!reservation) {
      throw new AppError('Reservation not found', 404, 'NOT_FOUND');
    }

    await ReservationRepository.delete(id);

    ActivityLogService.log({
      adminEmail,
      action: 'RESERVATION_DELETED',
      resourceType: 'reservation',
      resourceId: id,
      details: { name: reservation.name, phone: reservation.phone },
    }).catch(() => {});
  }
}
