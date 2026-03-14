// Review validators

import { z } from 'zod';

export const ReviewUpdateSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  adminNote: z.string().max(500).optional(),
  isSpam: z.boolean().optional(),
});

export const ReviewQuerySchema = z.object({
  status: z.enum(['all', 'pending', 'approved', 'rejected']).optional(),
  search: z.string().max(100).optional(),
});

export type UpdateReviewDto = z.infer<typeof ReviewUpdateSchema>;
export type ReviewQueryDto = z.infer<typeof ReviewQuerySchema>;
