'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/ui/DataTable';
import EmptyState from '@/components/admin/ui/EmptyState';
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog';
import ReservationFilters from '@/components/admin/reservations/ReservationFilters';
import ReservationDetail from '@/components/admin/reservations/ReservationDetail';
import StatusBadge from '@/components/admin/reservations/StatusBadge';
import { Eye, Check, X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import { RefreshIndicator } from '@/components/admin/ui/RefreshIndicator';
import { useCallback, useRef } from 'react';



export default function ReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drawer & Dialog State
  const [selectedRes, setSelectedRes] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [resToDelete, setResToDelete] = useState<string | null>(null);

  // Mock counts, would normally fetch from API or derive
  const counts = {
    all: reservations.length,
    pending: reservations.filter(r => r.status === 'pending').length,
    approved: reservations.filter(r => r.status === 'approved').length,
    rejected: reservations.filter(r => r.status === 'rejected').length,
    completed: reservations.filter(r => r.status === 'completed').length,
  };

  const prevCountRef = useRef(0);

  const fetchReservations = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/reservations?status=${statusFilter}&search=${searchQuery}`);
      const data = await res.json();
      if (data.success) {
        // Detect new reservations
        const newTotal = data.data.length;
        if (prevCountRef.current > 0 && newTotal > prevCountRef.current) {
          toast.success(`${newTotal - prevCountRef.current} new reservation(s) received!`, {
            icon: '🔔',
            duration: 5000,
          });
        }
        prevCountRef.current = newTotal;
        setReservations(data.data);
      } else {

        toast.error('Failed to load reservations');
      }
    } catch (e) {
      toast.error('Network Error');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery]);

  // Sync selected reservation with refreshed data
  useEffect(() => {
    if (selectedRes && reservations.length > 0) {
      const updated = reservations.find((r: any) => r._id === selectedRes._id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(selectedRes)) {
        setSelectedRes(updated);
      }
    }
  }, [reservations, selectedRes]);


  const { lastUpdated, isRefreshing, refresh, pause, resume, isPaused } = useAutoRefresh({
    intervalMs: 20_000,
    onRefresh: fetchReservations,
    refreshOnFocus: true,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReservations();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchReservations]);


  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Reservation marked as ${newStatus}`);
        fetchReservations();
      } else {
        toast.error(data.error || 'Failed to update');
      }
    } catch (e) {
      toast.error('Update failed');
    }
  };

  const handleDelete = async () => {
    if (!resToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/reservations/${resToDelete}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Reservation deleted completely');
        fetchReservations();
      } else {
        toast.error(data.error);
      }
    } catch(e) {
      toast.error('Delete failed');
    } finally {
      setIsDeleting(false);
      setResToDelete(null);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Guest',
      render: (item: any) => (
        <div>
          <div className="font-medium text-[#E6EDF3]">{item.name}</div>
          <div className="text-xs text-[#8B949E] mt-0.5">{item.phone}</div>
        </div>
      )
    },
    {
      key: 'date',
      header: 'Date & Time',
      render: (item: any) => (
        <div>
          <div className="text-[#E6EDF3]">
            {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="text-xs text-[#8B949E] mt-0.5 flex items-center">
            {item.time} • {item.guests} Guests
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: any) => <StatusBadge status={item.status} />
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (item: any) => (
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => { setSelectedRes(item); setIsDrawerOpen(true); }}
            className="p-1.5 bg-[#21262D] text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#30363D] rounded-md transition-colors tooltip-wrapper"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {item.status === 'pending' && (
            <>
              <button 
                onClick={() => handleUpdateStatus(item._id, 'approved')}
                className="p-1.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-md transition-colors"
                title="Approve"
              >
                <Check className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleUpdateStatus(item._id, 'rejected')}
                className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-colors"
                title="Reject"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}

          <button 
            onClick={() => setResToDelete(item._id)}
            className="p-1.5 bg-red-500/5 text-red-400 opacity-50 hover:opacity-100 hover:bg-red-500/10 rounded-md transition-all ml-2"
            title="Delete Permanently"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#E6EDF3]">Reservations</h1>
          <p className="text-[#8B949E] text-sm mt-1">Manage incoming tables and special requests.</p>
        </div>
        
        <RefreshIndicator 
          lastUpdated={lastUpdated}
          isRefreshing={isRefreshing}
          isPaused={isPaused}
          onManualRefresh={refresh}
          onPause={pause}
          onResume={resume}
          intervalSeconds={20}
        />
      </div>


      <ReservationFilters 
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onExport={() => toast('Exporting CSV...', { icon: '⬇️' })}
        counts={counts}
      />

      <DataTable 
        data={reservations}
        columns={columns}
        keyExtractor={(item) => item._id}
        isLoading={isLoading}
        emptyState={
          <EmptyState 
            title="No reservations found" 
            description="There are no reservations matching your current filters."
            icon="search"
          />
        }
      />

      {/* Detail Drawer */}
      <ReservationDetail 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        reservation={selectedRes}
        onUpdate={fetchReservations}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog 
        isOpen={resToDelete !== null}
        onClose={() => setResToDelete(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Reservation"
        description="Are you sure you want to permanently delete this reservation? This action cannot be undone."
        confirmText="Yes, delete it"
      />
    </div>
  );
}
