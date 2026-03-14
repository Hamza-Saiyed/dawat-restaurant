// ActivityLog repository — database query layer

import connectDB from '@/lib/mongodb';
import ActivityLog, { IActivityLog } from '@/models/ActivityLog';

export class ActivityLogRepository {
  static async create(data: Partial<IActivityLog>): Promise<IActivityLog> {
    await connectDB();
    return ActivityLog.create(data);
  }

  static async findRecent(limit: number = 50): Promise<IActivityLog[]> {
    await connectDB();
    return ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean() as unknown as IActivityLog[];
  }

  static async findByAdmin(adminEmail: string, limit: number = 50): Promise<IActivityLog[]> {
    await connectDB();
    return ActivityLog.find({ adminEmail })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean() as unknown as IActivityLog[];
  }

  static async findByResource(resourceType: string, resourceId: string): Promise<IActivityLog[]> {
    await connectDB();
    return ActivityLog.find({ resourceType, resourceId })
      .sort({ createdAt: -1 })
      .lean() as unknown as IActivityLog[];
  }
}
