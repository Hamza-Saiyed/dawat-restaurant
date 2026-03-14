// Gallery service — business logic layer

import { GalleryRepository } from '@/backend/repositories/gallery.repository';
import { CacheService } from './cache.service';
import { ActivityLogService } from './activityLog.service';
import { AppError } from '@/backend/utils/asyncHandler';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import { CACHE_TTL } from '@/backend/config/constants';
import { IGalleryImage } from '@/models/GalleryImage';

const CACHE_KEY = 'gallery:all';

export class GalleryService {
  async getAllImages(category?: string): Promise<IGalleryImage[]> {
    const cacheKey = category && category !== 'all' ? `gallery:${category}` : CACHE_KEY;

    const cached = await CacheService.get<IGalleryImage[]>(cacheKey);
    if (cached) return cached;

    const images = await GalleryRepository.findAll(category);
    await CacheService.set(cacheKey, images, CACHE_TTL.GALLERY);
    return images;
  }

  async uploadImages(
    files: File[],
    category: string,
    adminEmail?: string
  ): Promise<IGalleryImage[]> {
    if (!files || files.length === 0) {
      throw new AppError('No images provided', 400, 'NO_IMAGES');
    }

    let currentOrder = await GalleryRepository.getHighestSortOrder();
    const uploaded: IGalleryImage[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await uploadImage(buffer, 'dawat-restaurant/gallery');

      const image = await GalleryRepository.create({
        imageUrl: uploadResult.url,
        publicId: uploadResult.publicId,
        category: category as IGalleryImage['category'],
        sortOrder: currentOrder++,
        isActive: true,
      });

      uploaded.push(image);
    }

    await this.invalidateCache();

    if (adminEmail) {
      ActivityLogService.log({
        adminEmail,
        action: 'GALLERY_IMAGE_UPLOADED',
        resourceType: 'gallery',
        details: { count: uploaded.length, category },
      }).catch(() => {});
    }

    return uploaded;
  }

  async updateImage(id: string, data: Partial<IGalleryImage>, adminEmail?: string): Promise<IGalleryImage> {
    const image = await GalleryRepository.update(id, data);
    if (!image) throw new AppError('Image not found', 404, 'NOT_FOUND');
    await this.invalidateCache();
    return image;
  }

  async deleteImage(id: string, adminEmail?: string): Promise<void> {
    const image = await GalleryRepository.findById(id);
    if (!image) throw new AppError('Image not found', 404, 'NOT_FOUND');

    if (image.publicId) {
      await deleteImage(image.publicId);
    }

    await GalleryRepository.delete(id);
    await this.invalidateCache();

    if (adminEmail) {
      ActivityLogService.log({
        adminEmail,
        action: 'GALLERY_IMAGE_DELETED',
        resourceType: 'gallery',
        resourceId: id,
      }).catch(() => {});
    }
  }

  async reorderImages(items: Array<{ _id: string }>, adminEmail?: string): Promise<void> {
    const reorderData = items.map((item, index) => ({ _id: item._id, sortOrder: index }));
    await GalleryRepository.bulkUpdateOrder(reorderData);
    await this.invalidateCache();

    if (adminEmail) {
      ActivityLogService.log({
        adminEmail,
        action: 'GALLERY_REORDERED',
        resourceType: 'gallery',
        details: { itemCount: items.length },
      }).catch(() => {});
    }
  }

  private async invalidateCache(): Promise<void> {
    await CacheService.deletePattern('gallery:*');
  }
}
