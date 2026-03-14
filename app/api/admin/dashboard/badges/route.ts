// app/api/admin/dashboard/badges/route.ts

import { asyncHandler } from '@/backend/utils/asyncHandler'
import { requireAuth } from '@/backend/middlewares/auth.middleware'
import { ApiResponse } from '@/backend/utils/apiResponse'
import Reservation from '@/models/Reservation'
import Contact from '@/models/Contact'
import Review from '@/models/Review'
import dbConnect from '@/lib/mongodb'

export const GET = asyncHandler(async (req) => {
  await requireAuth(req)
  await dbConnect()

  const [pendingReservations, unreadMessages, pendingReviews] = await Promise.all([
    Reservation.countDocuments({ status: 'pending' }),
    Contact.countDocuments({ isRead: false }),
    Review.countDocuments({ status: 'pending' }),
  ])

  return ApiResponse.success({
    pendingReservations,
    unreadMessages,
    pendingReviews,
  })
})
