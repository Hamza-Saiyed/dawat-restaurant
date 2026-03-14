// Contact form validators

import { z } from 'zod';

export const ContactCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  email: z.string().email('Please enter a valid email').trim(),
  phone: z.string().optional().or(z.literal('')),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200).trim(),
  message: z.string().min(20, 'Message must be at least 20 characters').max(2000).trim(),
});

export const ContactUpdateSchema = z.object({
  isRead: z.boolean().optional(),
  isReplied: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  adminNote: z.string().max(500).optional(),
});

export const ContactQuerySchema = z.object({
  filter: z.enum(['all', 'unread', 'archived']).optional(),
  search: z.string().max(100).optional(),
});

export type CreateContactDto = z.infer<typeof ContactCreateSchema>;
export type UpdateContactDto = z.infer<typeof ContactUpdateSchema>;
export type ContactQueryDto = z.infer<typeof ContactQuerySchema>;
