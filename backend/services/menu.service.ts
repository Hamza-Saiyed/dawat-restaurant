// Menu service — business logic layer

import { MenuRepository } from '@/backend/repositories/menu.repository';
import { CacheService } from './cache.service';
import { ActivityLogService } from './activityLog.service';
import { AppError } from '@/backend/utils/asyncHandler';
import { logger } from '@/lib/logger';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import { CACHE_TTL } from '@/backend/config/constants';
import { IMenuItem } from '@/models/MenuItem';

const CACHE_KEY_ALL = 'menu:all';
const CACHE_KEY_CATEGORY = (cat: string) => `menu:category:${cat}`;

export class MenuService {
  async getAllMenuItems(category?: string): Promise<IMenuItem[]> {
    const cacheKey = category && category !== 'all' ? CACHE_KEY_CATEGORY(category) : CACHE_KEY_ALL;

    // Try cache first
    const cached = await CacheService.get<IMenuItem[]>(cacheKey);
    if (cached) {
      logger.debug('Menu served from cache', { cacheKey });
      return cached;
    }

    const items = await MenuRepository.findAll(category);

    // Store in cache
    await CacheService.set(cacheKey, items, CACHE_TTL.MENU);

    return items;
  }

  async createMenuItem(
    data: Record<string, unknown>,
    imageFile?: File | null,
    adminEmail?: string
  ): Promise<IMenuItem> {
    let imageUrl = '';
    let imagePublicId = '';

    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const upload = await uploadImage(buffer, 'dawat-restaurant/menu');
      imageUrl = upload.url;
      imagePublicId = upload.publicId;
    }

    const item = await MenuRepository.create({
      ...data,
      image: imageUrl,
      imagePublicId,
    } as Partial<IMenuItem>);

    await this.invalidateCache();

    if (adminEmail) {
      ActivityLogService.log({
        adminEmail,
        action: 'MENU_ITEM_CREATED',
        resourceType: 'menu',
        resourceId: (item._id as unknown as { toString(): string }).toString(),
        details: { name: item.name, category: item.category, price: item.price },
      }).catch(() => {});
    }

    return item;
  }

  async updateMenuItem(
    id: string,
    data: Record<string, unknown>,
    imageFile?: File | null,
    removeImage?: boolean,
    adminEmail?: string
  ): Promise<IMenuItem> {
    const existing = await MenuRepository.findById(id);
    if (!existing) throw new AppError('Menu item not found', 404, 'NOT_FOUND');

    const updateData: Record<string, unknown> = { ...data };

    // Handle image
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const upload = await uploadImage(buffer, 'dawat-restaurant/menu');
      updateData.image = upload.url;
      updateData.imagePublicId = upload.publicId;

      if (existing.imagePublicId) {
        deleteImage(existing.imagePublicId); // Non-blocking
      }
    } else if (removeImage) {
      updateData.image = '';
      updateData.imagePublicId = '';
      if (existing.imagePublicId) {
        deleteImage(existing.imagePublicId);
      }
    }

    const updated = await MenuRepository.update(id, updateData as Partial<IMenuItem>);
    await this.invalidateCache();

    if (adminEmail) {
      ActivityLogService.log({
        adminEmail,
        action: 'MENU_ITEM_UPDATED',
        resourceType: 'menu',
        resourceId: id,
        details: { changes: Object.keys(data) },
      }).catch(() => {});
    }

    return updated!;
  }

  async deleteMenuItem(id: string, adminEmail?: string): Promise<void> {
    const item = await MenuRepository.findById(id);
    if (!item) throw new AppError('Menu item not found', 404, 'NOT_FOUND');

    if (item.imagePublicId) {
      await deleteImage(item.imagePublicId);
    }

    await MenuRepository.delete(id);
    await this.invalidateCache();

    if (adminEmail) {
      ActivityLogService.log({
        adminEmail,
        action: 'MENU_ITEM_DELETED',
        resourceType: 'menu',
        resourceId: id,
        details: { name: item.name },
      }).catch(() => {});
    }
  }

  private async invalidateCache(): Promise<void> {
    await CacheService.deletePattern('menu:*');
  }
}
