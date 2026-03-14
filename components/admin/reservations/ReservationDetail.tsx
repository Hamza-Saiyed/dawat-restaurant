import { useState, useEffect } from 'react';
import Drawer from '@/components/admin/ui/Drawer';
import StatusBadge from './StatusBadge';
import { Mail, Phone, Calendar, Users, MapPin, Clock, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReservationDetailProps {
  reservation: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ReservationDetail({ reservation, isOpen, onClose, onUpdate }: ReservationDetailProps) {
  const [adminNote, setAdminNote] = useState(reservation?.adminNote || '');
  const [isUpdating, setIsUpdating] = useState(false);

  // Reset state when a new reservation is loaded
  useEffect(() => {
    if (reservation) setAdminNote(reservation.adminNote || '');
  }, [reservation]);

  if (!reservation) return null;

  const handleUpdateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/reservations/${reservation._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminNote })
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success(`Marked as ${newStatus}`);
        onUpdate();
      } else {
        toast.error(data.error || 'Update failed');
      }
    } catch (e) {
      toast.error('Network error. Update failed.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNote = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/reservations/${reservation._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNote })
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success('Admin note saved');
        onUpdate();
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const formattedDate = new Date(reservation.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Reservation Details">
      <div className="space-y-6">
        {/* Status Header */}
        <div className="bg-[#111318] p-4 rounded-xl border border-[#21262D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[#8B949E] text-xs font-mono mb-1">ID: {reservation.confirmationId}</p>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-semibold text-[#E6EDF3]">{reservation.name}</h2>
              <StatusBadge status={reservation.status} />
            </div>
            
          </div>
          
          <div className="flex flex-wrap gap-2">
            {reservation.status === 'pending' && (
              <>
                <button 
                  onClick={() => handleUpdateStatus('approved')}
                  disabled={isUpdating}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleUpdateStatus('rejected')}
                  disabled={isUpdating}
                  className="px-3 py-1.5 bg-[#21262D] hover:bg-red-500/20 text-red-500 hover:text-red-400 text-sm font-medium rounded-lg border border-[#30363D] hover:border-red-500/50 transition-colors"
                >
                  Reject
                </button>
              </>
            )}
            {reservation.status === 'approved' && (
              <button 
                onClick={() => handleUpdateStatus('completed')}
                disabled={isUpdating}
                className="px-3 py-1.5 bg-[#C9A84C] hover:bg-[#E2C068] text-[#0D0F14] text-sm font-medium rounded-lg transition-colors"
              >
                Mark Completed
              </button>
            )}
          </div>
        </div>

        {/* Details Grids */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#111318] p-4 rounded-xl border border-[#21262D]">
            <h3 className="text-[#8B949E] text-xs uppercase tracking-wider font-semibold mb-3">Guest Info</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Users className="w-4 h-4 text-[#8B949E] mt-0.5 mr-3 shrink-0" />
                <span className="text-[#E6EDF3] text-sm">{reservation.name}</span>
              </div>
              <div className="flex items-start">
                <Phone className="w-4 h-4 text-[#8B949E] mt-0.5 mr-3 shrink-0" />
                <span className="text-[#E6EDF3] text-sm">{reservation.phone}</span>
              </div>
              {reservation.email && (
                <div className="flex items-start">
                  <Mail className="w-4 h-4 text-[#8B949E] mt-0.5 mr-3 shrink-0" />
                  <span className="text-[#E6EDF3] text-sm">{reservation.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#111318] p-4 rounded-xl border border-[#21262D]">
            <h3 className="text-[#8B949E] text-xs uppercase tracking-wider font-semibold mb-3">Booking Details</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Calendar className="w-4 h-4 text-[#8B949E] mt-0.5 mr-3 shrink-0" />
                <span className="text-[#E6EDF3] text-sm">{formattedDate}</span>
              </div>
              <div className="flex items-start">
                <Clock className="w-4 h-4 text-[#8B949E] mt-0.5 mr-3 shrink-0" />
                <span className="text-[#E6EDF3] text-sm">{reservation.time}</span>
              </div>
              <div className="flex items-start">
                <Users className="w-4 h-4 text-[#8B949E] mt-0.5 mr-3 shrink-0" />
                <span className="text-[#E6EDF3] text-sm">{reservation.guests} Guests</span>
              </div>
              {reservation.occasion && (
                <div className="flex items-start">
                  <span className="w-4 h-4 text-[#8B949E] mt-0.5 mr-3 shrink-0 flex justify-center text-xs">🎉</span>
                  <span className="text-[#E6EDF3] text-sm">{reservation.occasion}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Special Requests */}
        {reservation.specialRequests && (
          <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/20">
            <h3 className="text-amber-500 text-xs text-amber-500/80 uppercase tracking-wider font-semibold mb-2">Special Requests</h3>
            <p className="text-[#E6EDF3] text-sm leading-relaxed">{reservation.specialRequests}</p>
          </div>
        )}

        {/* Admin Notes */}
        <div className="bg-[#111318] p-4 rounded-xl border border-[#21262D]">
          <h3 className="text-[#8B949E] text-xs uppercase tracking-wider font-semibold mb-3">Internal Notes</h3>
          <textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="Add a private note about this reservation..."
            className="w-full bg-[#0D0F14] border border-[#30363D] rounded-lg p-3 text-sm text-[#E6EDF3] placeholder-[#484F58] focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] min-h-[100px] mb-3"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSaveNote}
              disabled={isUpdating || adminNote === (reservation.adminNote || '')}
              className="flex items-center px-4 py-2 bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Note
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
