// Activity log service — admin audit trail

import { ActivityLogRepository } from '@/backend/repositories/activityLog.repository';
import { logger } from '@/lib/logger';

interface LogActivityInput {
  adminId?: string;
  adminEmail: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export class ActivityLogService {
  /**
   * Log an admin activity. Non-blocking — failures are logged but never throw.
   */
  static async log(input: LogActivityInput): Promise<void> {
    try {
      await ActivityLogRepository.create({
        adminEmail: input.adminEmail,
        action: input.action,
        resourceType: input.resourceType,
        resourceId: input.resourceId,
        details: input.details,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      });

      logger.info('Activity logged', {
        action: input.action,
        adminEmail: input.adminEmail,
        resourceType: input.resourceType,
        resourceId: input.resourceId,
      });
    } catch (error) {
      logger.error('Failed to log activity', {
        action: input.action,
        error: error instanceof Error ? error.message : 'Unknown',
      });
      // Never throw — activity logging should never block the main operation
    }
  }

  static async getRecentLogs(limit: number = 50) {
    return ActivityLogRepository.findRecent(limit);
  }

  static async getLogsByAdmin(adminEmail: string, limit: number = 50) {
    return ActivityLogRepository.findByAdmin(adminEmail, limit);
  }
}
