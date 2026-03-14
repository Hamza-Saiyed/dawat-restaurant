'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/ui/DataTable';
import EmptyState from '@/components/admin/ui/EmptyState';
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog';
import Drawer from '@/components/admin/ui/Drawer';
import SearchInput from '@/components/admin/ui/SearchInput';
import Badge from '@/components/admin/ui/Badge';
import { Eye, Check, X, Trash2, Star, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import { RefreshIndicator } from '@/components/admin/ui/RefreshIndicator';
import { useCallback } from 'react';


export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/reviews?status=${statusFilter}&search=${searchQuery}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
      } else {

        toast.error('Failed to load reviews');
      }
    } catch (e) {
      toast.error('Network Error');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery]);

  const { lastUpdated, isRefreshing, refresh, pause, resume, isPaused } = useAutoRefresh({
    intervalMs: 60_000,
    onRefresh: fetchReviews,
    refreshOnFocus: true,
  });

  useEffect(() => {
    const timer = setTimeout(() => fetchReviews(), 300);
    return () => clearTimeout(timer);
  }, [fetchReviews]);


  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Review ${newStatus}`);
        fetchReviews();
        if (selectedReview && selectedReview._id === id) {
          setSelectedReview(data.data);
        }
      } else {

        toast.error(data.error || 'Update failed');
      }
    } catch (e) {
      toast.error('Network error');
    }
  };

  const executeDelete = async () => {
    if (!reviewToDelete) return;
    try {
      const res = await fetch(`/api/admin/reviews/${reviewToDelete}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Review deleted');
        fetchReviews();
      } else {
        toast.error(data.error);
      }
    } catch(e) {
      toast.error('Delete failed');
    } finally {
      setIsDeleteDialogOpen(false);
      setReviewToDelete(null);
    }
  };

  const columns = [
    {
      key: 'reviewer',
      header: 'Reviewer',
      render: (item: any) => (
        <div>
          <div className="font-medium text-[#E6EDF3] flex items-center">
            {item.name}
            {item.isSpam && <span title="Flagged as potential spam"><ShieldAlert className="w-3 h-3 text-red-500 ml-2" /></span>}
          </div>
          <div className="text-xs text-[#8B949E] mt-0.5">{new Date(item.createdAt).toLocaleDateString()}</div>
        </div>
      )
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (item: any) => (
        <div className="flex items-center text-[#C9A84C]">
          <span>{item.rating}</span>
          <Star className="w-3 h-3 ml-1 fill-current" />
        </div>
      )
    },
    {
      key: 'reviewText',
      header: 'Preview',
      render: (item: any) => (
        <div className="max-w-[300px] truncate text-[#8B949E] text-sm">
          {item.reviewText}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: any) => <Badge variant={item.status} dot>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Badge>
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (item: any) => (
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => { setSelectedReview(item); setIsDrawerOpen(true); }}
            className="p-1.5 bg-[#21262D] text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#30363D] rounded-md transition-colors tooltip-wrapper"
            title="Read Full Review"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {item.status === 'pending' && (
            <>
              <button 
                onClick={() => updateStatus(item._id, 'approved')}
                className="p-1.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-md transition-colors"
                title="Approve"
              >
                <Check className="w-4 h-4" />
              </button>
              <button 
                onClick={() => updateStatus(item._id, 'rejected')}
                className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-colors"
                title="Reject"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}

          <button 
            onClick={() => { setReviewToDelete(item._id); setIsDeleteDialogOpen(true); }}
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
          <h1 className="text-2xl font-semibold text-[#E6EDF3]">Reviews Moderation</h1>
          <p className="text-[#8B949E] text-sm mt-1">Approve, reject, or delete customer reviews displayed on the site.</p>
        </div>
        
        <RefreshIndicator 
          lastUpdated={lastUpdated}
          isRefreshing={isRefreshing}
          isPaused={isPaused}
          onManualRefresh={refresh}
          onPause={pause}
          onResume={resume}
          intervalSeconds={60}
        />
      </div>


      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 pt-2">
        <div className="flex overflow-x-auto border-b border-[#30363D] custom-scrollbar flex-1 mr-4">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors capitalize ${
                statusFilter === status
                  ? 'border-[#C9A84C] text-[#C9A84C]'
                  : 'border-transparent text-[#8B949E] hover:text-[#E6EDF3] hover:border-[#484F58]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        
        <div className="w-full sm:w-64 shrink-0 pb-1">
          <SearchInput 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search reviews..."
          />
        </div>
      </div>

      <DataTable 
        data={reviews}
        columns={columns}
        keyExtractor={(item) => item._id}
        isLoading={isLoading}
        emptyState={
          <EmptyState 
            title="No reviews found" 
            description="You have no reviews matching these filters right now."
            icon="search"
          />
        }
      />

      {/* Review Detail Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Review Details">
        {selectedReview && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-[#E6EDF3]">{selectedReview.name}</h3>
                <p className="text-[#8B949E] text-sm">{selectedReview.email}</p>
              </div>
              <Badge variant={selectedReview.status}>{selectedReview.status.toUpperCase()}</Badge>
            </div>
            
            <div className="flex items-center text-[#C9A84C] bg-[#161B22] p-3 rounded-lg border border-[#30363D] w-fit">
              <span className="font-bold mr-2">{selectedReview.rating}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < selectedReview.rating ? 'fill-[#C9A84C] text-[#C9A84C]' : 'text-[#30363D]'}`} />
                ))}
              </div>
            </div>

            <div className="bg-[#111318] p-4 rounded-xl border border-[#21262D]">
              <h4 className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-2">Review Content</h4>
              <p className="text-[#E6EDF3] text-sm leading-relaxed whitespace-pre-wrap">{selectedReview.reviewText}</p>
            </div>

            {selectedReview.moderatedBy && (
              <div className="text-xs text-[#8B949E]">
                Moderated by {selectedReview.moderatedBy} on {new Date(selectedReview.moderatedAt).toLocaleString()}
              </div>
            )}

            {selectedReview.status === 'pending' && (
              <div className="flex gap-3 pt-6 border-t border-[#21262D]">
                <button 
                  onClick={() => updateStatus(selectedReview._id, 'approved')}
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
                >
                  Approve Review
                </button>
                <button 
                  onClick={() => updateStatus(selectedReview._id, 'rejected')}
                  className="flex-1 py-2 bg-[#21262D] hover:bg-red-500/20 text-red-500 border border-[#30363D] hover:border-red-500/50 font-medium rounded-lg transition-colors"
                >
                  Reject Review
                </button>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <ConfirmDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={executeDelete}
        title="Delete Review"
        description="Are you sure you want to permanently delete this review?"
        confirmText="Yes, delete it"
      />
    </div>
  );
}
