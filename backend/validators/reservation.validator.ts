// Reservation validators

import { z } from 'zod';
import { VALID_TIME_SLOTS } from '@/backend/config/constants';

export const ReservationCreateSchema = z.object({
  name: z.string().min(2, 'Name too short').max(100).trim(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number (10 digits, start with 6-9)'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  guests: z.coerce.number().int().min(1, 'At least 1 guest').max(20, 'Max 20 guests'),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date'),
  time: z.enum(VALID_TIME_SLOTS as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Invalid time slot' }),
  }),
  occasion: z
    .enum(['Birthday', 'Anniversary', 'Business Dinner', 'Family Gathering', 'Date Night', 'Other', ''])
    .optional(),
  specialRequests: z.string().max(500).optional().or(z.literal('')),
});

export const ReservationUpdateStatusSchema = z.object({
  status: z.enum(['approved', 'rejected', 'completed']),
  adminNote: z.string().max(500).optional(),
});

export const ReservationQuerySchema = z.object({
  status: z.enum(['all', 'pending', 'approved', 'rejected', 'completed']).optional(),
  date: z.string().optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  sortBy: z.enum(['createdAt', 'date', 'name', 'guests']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateReservationDto = z.infer<typeof ReservationCreateSchema>;
export type UpdateReservationStatusDto = z.infer<typeof ReservationUpdateStatusSchema>;
export type ReservationQueryDto = z.infer<typeof ReservationQuerySchema>;
