// Review repository — database query layer

import connectDB from '@/lib/mongodb';
import Review, { IReview } from '@/models/Review';

export class ReviewRepository {
  static async findAll(filter: Record<string, unknown> = {}): Promise<IReview[]> {
    await connectDB();
    return Review.find(filter).sort({ createdAt: -1 }).lean() as unknown as IReview[];
  }

  static async findById(id: string): Promise<IReview | null> {
    await connectDB();
    return Review.findById(id);
  }

  static async update(id: string, data: Partial<IReview>): Promise<IReview | null> {
    await connectDB();
    return Review.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  static async delete(id: string): Promise<IReview | null> {
    await connectDB();
    return Review.findByIdAndDelete(id);
  }

  static async countByStatus(): Promise<Record<string, number>> {
    await connectDB();
    const results = await Review.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const counts: Record<string, number> = { pending: 0, approved: 0, rejected: 0 };
    results.forEach((r) => { counts[r._id] = r.count; });
    return counts;
  }

  static async countAll(): Promise<number> {
    await connectDB();
    return Review.countDocuments();
  }

  static async countPending(): Promise<number> {
    await connectDB();
    return Review.countDocuments({ status: 'pending' });
  }
}
