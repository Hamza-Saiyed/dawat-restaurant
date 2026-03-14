'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Users, 
  Calendar, 
  Clock, 
  Coffee, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import StatsCard from '@/components/admin/dashboard/StatsCard';
import ReservationChart from '@/components/admin/dashboard/ReservationChart';
import RecentReservations from '@/components/admin/dashboard/RecentReservations';
import RecentMessages from '@/components/admin/dashboard/RecentMessages';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import { SkeletonCard, Skeleton } from '@/components/admin/ui/Skeleton';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import { RefreshIndicator } from '@/components/admin/ui/RefreshIndicator';
import { useCallback } from 'react';


interface DashboardStats {
  totalReservations: number;
  todayReservations: number;
  pendingReservations: number;
  approvedReservations: number;
  rejectedReservations: number;
  completedReservations: number;
  totalMenuItems: number;
  totalMessages: number;
  unreadMessages: number;
  totalReviews: number;
  pendingReviews: number;
}

interface DashboardData {
  stats: DashboardStats;
  reservationTrend: { date: string; count: number }[];
  reservationsByDay: { day: string; count: number }[];
  recentReservations: any[];
  recentMessages: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      const json = await res.json();
      
      if (json.success) {
        setData(json.data);
      } else {

        setError(json.error || 'Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('A network error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { lastUpdated, isRefreshing, refresh, pause, resume, isPaused } = useAutoRefresh({
    intervalMs: 30_000,
    onRefresh: fetchData,
    refreshOnFocus: true,
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex flex-col items-center justify-center text-center h-64">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-red-500 mb-2">Error Loading Dashboard</h3>
        <p className="text-[#8B949E] text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] text-sm rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-semibold text-[#E6EDF3]">Reservations Overview</h2>
          <p className="text-[#8B949E] text-sm mt-1">Metrics and recent activity across your restaurant</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <RefreshIndicator 
            lastUpdated={lastUpdated}
            isRefreshing={isRefreshing}
            isPaused={isPaused}
            onManualRefresh={refresh}
            onPause={pause}
            onResume={resume}
            intervalSeconds={30}
          />
          
          {/* Date Filter - visual only for now */}
          <div className="flex bg-[#161B22] border border-[#21262D] rounded-lg p-1 text-sm">
            <button className="px-3 py-1.5 rounded-md text-[#E6EDF3] bg-[#21262D] shadow-sm font-medium">Last 30 Days</button>
            <button className="px-3 py-1.5 rounded-md text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1C2128] transition-colors">This Month</button>
            <button className="px-3 py-1.5 rounded-md text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1C2128] transition-colors">All Time</button>
          </div>
        </div>
      </div>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : data && (
          <>
            <StatsCard 
              title="Total Bookings" 
              value={data.stats.totalReservations} 
              icon={Calendar} 
              trend={12} 
              trendLabel="vs last 30 days"
            />
            <StatsCard 
              title="Today's Bookings" 
              value={data.stats.todayReservations} 
              icon={Clock} 
            />
            <StatsCard 
              title="Pending Approval" 
              value={data.stats.pendingReservations} 
              icon={AlertCircle} 
            />
            <StatsCard 
              title="Menu Items" 
              value={data.stats.totalMenuItems} 
              icon={Coffee} 
            />
            <StatsCard 
              title="Pending Reviews" 
              value={data.stats.pendingReviews} 
              icon={Users} 
            />
            <StatsCard 
              title="Unread Messages" 
              value={data.stats.unreadMessages} 
              icon={MessageSquare} 
            />
          </>
        )}
      </div>

      {/* Charts Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[360px] lg:col-span-2 rounded-xl" />
          <Skeleton className="h-[360px] lg:col-span-1 rounded-xl" />
        </div>
      ) : data && (
        <ReservationChart trendData={data.reservationTrend} dayData={data.reservationsByDay} />
      )}

      {/* Bottom Row Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-1 h-[400px]">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-xl" />
          ) : data && (
            <RecentReservations reservations={data.recentReservations} />
          )}
        </div>
        
        <div className="col-span-1 lg:col-span-1 h-[400px]">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-xl" />
          ) : data && (
            <RecentMessages messages={data.recentMessages} />
          )}
        </div>
        
        <div className="col-span-1 lg:col-span-1 h-[400px]">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
