// Review controller — handles review moderation

import { NextRequest, NextResponse } from 'next/server';
import { ReviewService } from '@/backend/services/review.service';
import { requireAuth } from '@/backend/middlewares/auth.middleware';
import { ApiResponse } from '@/backend/utils/apiResponse';


const service = new ReviewService();

export class ReviewController {
  /** GET /api/admin/reviews */
  async list(req: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const reviews = await service.getReviews(status, search);
    return ApiResponse.success(reviews);
  }


  /** PATCH /api/admin/reviews/[id] */
  async update(req: NextRequest, id: string): Promise<NextResponse> {
    const admin = await requireAuth(req);
    const data = await req.json();

    const review = await service.updateReview(id, data, admin.email);
    return ApiResponse.success(review, 'Review updated successfully');
  }


  /** DELETE /api/admin/reviews/[id] */
  async delete(req: NextRequest, id: string): Promise<NextResponse> {
    const admin = await requireAuth(req);
    await service.deleteReview(id, admin.email);
    return ApiResponse.success(null, 'Review deleted');
  }
}

