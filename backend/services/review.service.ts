// Review service — business logic layer

import { ReviewRepository } from '@/backend/repositories/review.repository';
import { ActivityLogService } from './activityLog.service';
import { AppError } from '@/backend/utils/asyncHandler';
import { IReview } from '@/models/Review';

export class ReviewService {
  async getReviews(status?: string, search?: string): Promise<IReview[]> {
    const filter: Record<string, unknown> = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { reviewText: { $regex: search, $options: 'i' } },
      ];
    }

    return ReviewRepository.findAll(filter);
  }

  async updateReview(
    id: string,
    data: Partial<IReview>,
    adminEmail: string
  ): Promise<IReview> {
    const existing = await ReviewRepository.findById(id);
    if (!existing) throw new AppError('Review not found', 404, 'NOT_FOUND');

    const updateData: Partial<IReview> & Record<string, unknown> = { ...data };

    // Track moderation
    if (data.status) {
      updateData.moderatedAt = new Date();
      updateData.moderatedBy = adminEmail;

      if (data.status === 'approved') {
        updateData.approvedAt = new Date();
        updateData.approvedBy = adminEmail;
      }
    }

    const updated = await ReviewRepository.update(id, updateData);
    if (!updated) throw new AppError('Failed to update review', 500, 'UPDATE_FAILED');

    // Log activity
    const actionMap: Record<string, string> = {
      approved: 'REVIEW_APPROVED',
      rejected: 'REVIEW_REJECTED',
    };
    if (data.status && actionMap[data.status]) {
      ActivityLogService.log({
        adminEmail,
        action: actionMap[data.status],
        resourceType: 'review',
        resourceId: id,
        details: { previousStatus: existing.status, newStatus: data.status },
      }).catch(() => {});
    }

    return updated;
  }

  async deleteReview(id: string, adminEmail: string): Promise<void> {
    const review = await ReviewRepository.findById(id);
    if (!review) throw new AppError('Review not found', 404, 'NOT_FOUND');

    await ReviewRepository.delete(id);

    ActivityLogService.log({
      adminEmail,
      action: 'REVIEW_DELETED',
      resourceType: 'review',
      resourceId: id,
      details: { customerName: review.customerName },
    }).catch(() => {});
  }
}
