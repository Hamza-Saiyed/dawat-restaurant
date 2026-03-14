// Gallery repository — database query layer

import connectDB from '@/lib/mongodb';
import GalleryImage, { IGalleryImage } from '@/models/GalleryImage';

export class GalleryRepository {
  static async findAll(category?: string): Promise<IGalleryImage[]> {
    await connectDB();
    const query = category && category !== 'all' ? { category } : {};
    return GalleryImage.find(query).sort({ sortOrder: 1, uploadedAt: -1 }).lean() as unknown as IGalleryImage[];
  }

  static async findById(id: string): Promise<IGalleryImage | null> {
    await connectDB();
    return GalleryImage.findById(id);
  }

  static async create(data: Partial<IGalleryImage>): Promise<IGalleryImage> {
    await connectDB();
    return GalleryImage.create(data);
  }

  static async update(id: string, data: Partial<IGalleryImage>): Promise<IGalleryImage | null> {
    await connectDB();
    return GalleryImage.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  static async delete(id: string): Promise<IGalleryImage | null> {
    await connectDB();
    return GalleryImage.findByIdAndDelete(id);
  }

  static async getHighestSortOrder(): Promise<number> {
    await connectDB();
    const lastImage = await GalleryImage.findOne().sort({ sortOrder: -1 }).select('sortOrder').lean();
    return lastImage ? (lastImage as IGalleryImage).sortOrder + 1 : 0;
  }

  static async bulkUpdateOrder(items: Array<{ _id: string; sortOrder: number }>): Promise<void> {
    await connectDB();
    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { sortOrder: item.sortOrder } },
      },
    }));

    if (bulkOps.length > 0) {
      await GalleryImage.bulkWrite(bulkOps);
    }
  }
}
