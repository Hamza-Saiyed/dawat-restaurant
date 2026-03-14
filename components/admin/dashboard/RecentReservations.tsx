import Badge from '@/components/admin/ui/Badge';
import { ChevronRight, Filter } from 'lucide-react';
import Link from 'next/link';

interface ReservationProps {
  _id: string;
  name: string;
  guests: number;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
}

interface RecentReservationsProps {
  reservations: ReservationProps[];
}

export default function RecentReservations({ reservations }: RecentReservationsProps) {
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const isToday = new Date().toDateString() === date.toDateString();
    
    if (isToday) return 'Today';
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-[#161B22]/80 backdrop-blur-md border border-[#21262D] rounded-xl overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-[#21262D] flex items-center justify-between">
        <div>
          <h3 className="text-[#E6EDF3] font-medium">Recent Bookings</h3>
          <p className="text-[#8B949E] text-xs mt-1">Latest 5 incoming reservations</p>
        </div>
        <Link 
          href="/admin/reservations" 
          className="text-xs flex items-center text-[#C9A84C] hover:text-[#E2C068] transition-colors"
        >
          View all <ChevronRight className="w-3 h-3 ml-1" />
        </Link>
      </div>

      <div className="flex-1 overflow-x-auto">
        {reservations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-[#8B949E]">
            <Filter className="w-8 h-8 mb-3 opacity-20" />
            <p className="text-sm">No recent bookings found</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left text-[#8B949E]">
            <thead className="text-xs text-[#656D76] uppercase bg-[#111318]/50">
              <tr>
                <th className="px-5 py-3 font-medium">Guest</th>
                <th className="px-5 py-3 font-medium">Details</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21262D]">
              {reservations.map((res) => (
                <tr key={res._id} className="hover:bg-[#1C2128] transition-colors">
                  <td className="px-5 py-3 pt-4">
                    <div className="font-medium text-[#E6EDF3]">{res.name}</div>
                    <div className="text-xs mt-0.5">{res.guests} Guests</div>
                  </td>
                  <td className="px-5 py-3 pt-4">
                    <div className="text-[#E6EDF3]">{formatDate(res.date)}</div>
                    <div className="text-xs mt-0.5">{res.time}</div>
                  </td>
                  <td className="px-5 py-3 pt-4">
                    <Badge variant={res.status} dot>
                      {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
