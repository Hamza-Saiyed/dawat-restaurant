// Menu validators

import { z } from 'zod';
import { MENU_CATEGORIES } from '@/backend/config/constants';

export const MenuItemCreateSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  nameHindi: z.string().max(100).optional().or(z.literal('')),
  category: z.enum(MENU_CATEGORIES as unknown as [string, ...string[]]),
  description: z.string().min(3).max(200).trim(),
  price: z.coerce.number().positive().max(10000),
  discountPrice: z.coerce.number().positive().optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
  isVeg: z.preprocess(v => v === 'true' || v === true, z.boolean()).default(true),
  isSpicy: z.preprocess(v => v === 'true' || v === true, z.boolean()).default(false),
  isPopular: z.preprocess(v => v === 'true' || v === true, z.boolean()).default(false),
  isAvailable: z.preprocess(v => v === 'true' || v === true, z.boolean()).default(true),
  tags: z.union([
    z.array(z.string()).max(5),
    z.string().transform(s => s ? s.split(',').map(t => t.trim()).filter(Boolean) : []),
  ]).optional().default([]),
  allergens: z.union([
    z.array(z.string()),
    z.string().transform(s => s ? s.split(',').map(t => t.trim()).filter(Boolean) : []),
  ]).optional().default([]),
});

export const MenuItemUpdateSchema = MenuItemCreateSchema.partial();

export type CreateMenuItemDto = z.infer<typeof MenuItemCreateSchema>;
export type UpdateMenuItemDto = z.infer<typeof MenuItemUpdateSchema>;
