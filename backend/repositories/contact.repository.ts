// Contact/Messages repository — database query layer

import connectDB from '@/lib/mongodb';
import Contact, { IContact } from '@/models/Contact';

export class ContactRepository {
  static async create(data: Partial<IContact>): Promise<IContact> {
    await connectDB();
    return Contact.create(data);
  }

  static async findAll(filter: Record<string, unknown> = {}): Promise<IContact[]> {
    await connectDB();
    return Contact.find(filter).sort({ createdAt: -1 }).lean() as unknown as IContact[];
  }

  static async findById(id: string): Promise<IContact | null> {
    await connectDB();
    return Contact.findById(id);
  }

  static async findByIdLean(id: string): Promise<IContact | null> {
    await connectDB();
    return Contact.findById(id).lean();
  }

  static async update(id: string, data: Partial<IContact>): Promise<IContact | null> {
    await connectDB();
    return Contact.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  static async delete(id: string): Promise<IContact | null> {
    await connectDB();
    return Contact.findByIdAndDelete(id);
  }

  static async countAll(): Promise<number> {
    await connectDB();
    return Contact.countDocuments();
  }

  static async countUnread(): Promise<number> {
    await connectDB();
    return Contact.countDocuments({ isRead: false });
  }

  static async getRecentMessages(limit: number = 3): Promise<IContact[]> {
    await connectDB();
    return Contact.find().sort({ createdAt: -1 }).limit(limit).lean() as unknown as IContact[];
  }
}
