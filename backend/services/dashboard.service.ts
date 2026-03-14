// Dashboard service — aggregation and analytics

import connectDB from '@/lib/mongodb';
import Reservation from '@/models/Reservation';
import MenuItem from '@/models/MenuItem';
import Contact from '@/models/Contact';
import Review from '@/models/Review';
import { CacheService } from './cache.service';
import { CACHE_TTL } from '@/backend/config/constants';

const CACHE_KEY = 'dashboard:stats';

export class DashboardService {
  async getDashboardData() {
    // Try cache first
    const cached = await CacheService.get(CACHE_KEY);
    if (cached) return cached;

    await connectDB();

    // Today's boundaries
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setDate(endOfDay.getDate() + 1);

    // 30 days ago boundary
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Parallel queries for max performance
    const [
      totalReservations,
      todayReservations,
      pendingReservations,
      approvedReservations,
      rejectedReservations,
      completedReservations,
      totalMenuItems,
      totalMessages,
      unreadMessages,
      totalReviews,
      pendingReviews,
      recentReservations,
      recentMessages,
      reservationTrendData,
    ] = await Promise.all([
      Reservation.countDocuments(),
      Reservation.countDocuments({ date: { $gte: today, $lt: endOfDay } }),
      Reservation.countDocuments({ status: 'pending' }),
      Reservation.countDocuments({ status: 'approved' }),
      Reservation.countDocuments({ status: 'rejected' }),
      Reservation.countDocuments({ status: 'completed' }),
      MenuItem.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ isRead: false }),
      Review.countDocuments(),
      Review.countDocuments({ status: 'pending' }),
      Reservation.find().sort({ createdAt: -1 }).limit(5).lean(),
      Contact.find().sort({ createdAt: -1 }).limit(3).lean(),
      Reservation.aggregate([
        { $match: { date: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Format trend data filling in empty days
    const reservationTrend = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(thirtyDaysAgo);
      d.setDate(d.getDate() + i);
      const dateString = d.toISOString().split('T')[0];
      const found = reservationTrendData.find((t: { _id: string; count: number }) => t._id === dateString);
      reservationTrend.push({
        date: dateString,
        count: found ? found.count : 0,
      });
    }

    // Days of week distribution
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const reservationsByDayData = await Reservation.aggregate([
      { $group: { _id: { $dayOfWeek: '$date' }, count: { $sum: 1 } } },
    ]);

    const reservationsByDay = dayNames.map((name, index) => {
      const dayData = reservationsByDayData.find((d: { _id: number; count: number }) => d._id === index + 1);
      return { day: name, count: dayData ? dayData.count : 0 };
    });

    const result = {
      stats: {
        totalReservations,
        todayReservations,
        pendingReservations,
        approvedReservations,
        rejectedReservations,
        completedReservations,
        totalMenuItems,
        totalMessages,
        unreadMessages,
        totalReviews,
        pendingReviews,
      },
      reservationTrend,
      reservationsByDay,
      recentReservations,
      recentMessages,
    };

    // Cache for 5 minutes
    await CacheService.set(CACHE_KEY, result, CACHE_TTL.DASHBOARD);

    return result;
  }
}
