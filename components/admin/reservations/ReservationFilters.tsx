import { Search, Download, Filter } from 'lucide-react';

interface ReservationFiltersProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExport: () => void;
  counts: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
    completed: number;
  };
}

export default function ReservationFilters({
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  onExport,
  counts
}: ReservationFiltersProps) {
  
  const tabs = [
    { id: 'all', label: 'All Bookings', count: counts.all },
    { id: 'pending', label: 'Pending', count: counts.pending },
    { id: 'approved', label: 'Approved', count: counts.approved },
    { id: 'completed', label: 'Completed', count: counts.completed },
    { id: 'rejected', label: 'Rejected', count: counts.rejected },
  ];

  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#8B949E]" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-[#30363D] rounded-lg bg-[#0D0F14] text-[#E6EDF3] placeholder-[#484F58] focus:outline-none focus:ring-1 focus:ring-[#C9A84C] text-sm transition-colors"
            placeholder="Search name, phone, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Export & other actions */}
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-4 py-2 border border-[#30363D] rounded-lg text-sm font-medium text-[#E6EDF3] bg-[#161B22] hover:bg-[#21262D] transition-colors">
            <Filter className="w-4 h-4 mr-2 text-[#8B949E]" />
            More Filters
          </button>
          
          <button 
            onClick={onExport}
            className="flex items-center px-4 py-2 border border-[#30363D] rounded-lg text-sm font-medium text-[#E6EDF3] bg-[#161B22] hover:bg-[#21262D] transition-colors"
          >
            <Download className="w-4 h-4 mr-2 text-[#8B949E]" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-[#30363D] custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              statusFilter === tab.id
                ? 'border-[#C9A84C] text-[#C9A84C]'
                : 'border-transparent text-[#8B949E] hover:text-[#E6EDF3] hover:border-[#484F58]'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              statusFilter === tab.id 
                ? 'bg-[#C9A84C]/10 text-[#C9A84C]' 
                : 'bg-[#21262D] text-[#8B949E]'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
