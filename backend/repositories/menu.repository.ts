// Menu repository — database query layer

import connectDB from '@/lib/mongodb';
import MenuItem, { IMenuItem } from '@/models/MenuItem';

export class MenuRepository {
  static async findAll(category?: string): Promise<IMenuItem[]> {
    await connectDB();
    const query = category && category !== 'all' ? { category } : {};
    return MenuItem.find(query).sort({ category: 1, sortOrder: 1, name: 1 }).lean() as unknown as IMenuItem[];
  }

  static async findById(id: string): Promise<IMenuItem | null> {
    await connectDB();
    return MenuItem.findById(id);
  }

  static async create(data: Partial<IMenuItem>): Promise<IMenuItem> {
    await connectDB();
    return MenuItem.create(data);
  }

  static async update(id: string, data: Partial<IMenuItem>): Promise<IMenuItem | null> {
    await connectDB();
    return MenuItem.findByIdAndUpdate(
      id,
      { $set: { ...data, updatedAt: new Date() } },
      { new: true }
    );
  }

  static async delete(id: string): Promise<IMenuItem | null> {
    await connectDB();
    return MenuItem.findByIdAndDelete(id);
  }

  static async countAll(): Promise<number> {
    await connectDB();
    return MenuItem.countDocuments();
  }
}
