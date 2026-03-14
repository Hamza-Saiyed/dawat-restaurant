// Reservation repository — database query layer

import connectDB from '@/lib/mongodb';
import Reservation, { IReservation } from '@/models/Reservation';
import { PaginationOptions, PaginatedResult } from '@/backend/utils/pagination';

export class ReservationRepository {
  static async create(data: Partial<IReservation>): Promise<IReservation> {
    await connectDB();
    return Reservation.create(data);
  }

  static async findById(id: string): Promise<IReservation | null> {
    await connectDB();
    return Reservation.findById(id);
  }

  static async findByIdLean(id: string): Promise<IReservation | null> {
    await connectDB();
    return Reservation.findById(id).lean();
  }

  static async checkDuplicate(phone: string, date: Date, time: string): Promise<boolean> {
    await connectDB();
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const existing = await Reservation.findOne({
      phone,
      date: { $gte: dayStart, $lte: dayEnd },
      time,
      status: { $in: ['pending', 'approved'] },
    });
    return !!existing;
  }

  static async updateStatus(
    id: string,
    status: string,
    adminNote: string | undefined,
    adminEmail: string
  ): Promise<IReservation | null> {
    await connectDB();
    const updateData: Record<string, unknown> = {
      status,
      updatedBy: adminEmail,
    };
    if (adminNote !== undefined) updateData.adminNote = adminNote;
    if (status === 'approved') {
      updateData.approvedAt = new Date();
      updateData.approvedBy = adminEmail;
    }

    return Reservation.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  }

  static async findWithPagination(
    filter: Record<string, unknown>,
    options: PaginationOptions
  ): Promise<PaginatedResult<IReservation>> {
    await connectDB();
    const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [data, total] = await Promise.all([
      Reservation.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Reservation.countDocuments(filter),
    ]);

    return {
      data: data as IReservation[],
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
        hasNextPage: page < (Math.ceil(total / limit) || 1),
        hasPrevPage: page > 1,
      },
    };
  }

  static async delete(id: string): Promise<IReservation | null> {
    await connectDB();
    return Reservation.findByIdAndDelete(id);
  }

  static async countByStatus(): Promise<Record<string, number>> {
    await connectDB();
    const results = await Reservation.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const counts: Record<string, number> = { pending: 0, approved: 0, rejected: 0, completed: 0 };
    results.forEach((r) => { counts[r._id] = r.count; });
    return counts;
  }

  static async getRecentReservations(limit: number = 5): Promise<IReservation[]> {
    await connectDB();
    return Reservation.find().sort({ createdAt: -1 }).limit(limit).lean() as unknown as IReservation[];
  }
}
