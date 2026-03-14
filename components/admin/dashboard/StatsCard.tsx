import { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: number; // percentage, positive or negative
  trendLabel?: string;
  isCurrency?: boolean;
}

export default function StatsCard({ title, value, icon: Icon, trend, trendLabel, isCurrency }: StatsCardProps) {
  return (
    <div className="bg-[#161B22]/80 backdrop-blur-md border border-[#21262D] rounded-xl p-5 hover:border-[#C9A84C]/50 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-[#21262D] rounded-lg group-hover:bg-[#C9A84C]/10 transition-colors">
          <Icon className="w-5 h-5 text-[#8B949E] group-hover:text-[#C9A84C] transition-colors" />
        </div>
        
        {trend !== undefined && (
          <div className={`flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded-full ${
            trend > 0 ? 'bg-emerald-500/10 text-emerald-500' : 
            trend < 0 ? 'bg-red-500/10 text-red-500' : 
            'bg-[#21262D] text-[#8B949E]'
          }`}>
            {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : trend < 0 ? <ArrowDownRight className="w-3 h-3" /> : null}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-[#8B949E] text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-semibold text-[#E6EDF3] tracking-tight">
          {isCurrency ? `₹${value}` : value}
        </p>
        {trendLabel && (
          <p className="text-[#484F58] text-xs mt-2">{trendLabel}</p>
        )}
      </div>
    </div>
  );
}
