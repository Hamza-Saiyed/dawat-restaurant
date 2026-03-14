// Settings validators

import { z } from 'zod';

const DayHoursSchema = z.object({
  open: z.string().optional(),
  close: z.string().optional(),
  isClosed: z.boolean().optional(),
});

export const SettingsUpdateSchema = z.object({
  restaurantName: z.string().min(1).max(100).optional(),
  tagline: z.string().max(200).optional(),
  phone: z.string().max(20).optional(),
  whatsapp: z.string().max(20).optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().max(500).optional(),
  openingHours: z.object({
    monday: DayHoursSchema.optional(),
    tuesday: DayHoursSchema.optional(),
    wednesday: DayHoursSchema.optional(),
    thursday: DayHoursSchema.optional(),
    friday: DayHoursSchema.optional(),
    saturday: DayHoursSchema.optional(),
    sunday: DayHoursSchema.optional(),
  }).optional(),
  socialLinks: z.object({
    instagram: z.string().url().optional().or(z.literal('')),
    facebook: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    youtube: z.string().url().optional().or(z.literal('')),
  }).optional(),
  heroSection: z.object({
    title: z.string().max(100).optional(),
    subtitle: z.string().max(200).optional(),
    backgroundImageUrl: z.string().optional(),
    backgroundImagePublicId: z.string().optional(),
  }).optional(),
  seo: z.object({
    metaTitle: z.string().max(100).optional(),
    metaDescription: z.string().max(300).optional(),
    keywords: z.string().max(500).optional(),
  }).optional(),
  isMaintenanceMode: z.boolean().optional(),
}).partial();

export type UpdateSettingsDto = z.infer<typeof SettingsUpdateSchema>;
