interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'completed' | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig: Record<string, { label: string; colorClass: string; dotColorClass: string }> = {
    pending:   { label: 'Pending',   colorClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20', dotColorClass: 'bg-amber-500' },
    approved:  { label: 'Approved',  colorClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', dotColorClass: 'bg-emerald-500' },
    rejected:  { label: 'Rejected',  colorClass: 'bg-red-500/10 text-red-500 border-red-500/20', dotColorClass: 'bg-red-500' },
    completed: { label: 'Completed', colorClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', dotColorClass: 'bg-indigo-500' },
  };

  const config = statusConfig[status.toLowerCase()] || { 
    label: status, 
    colorClass: 'bg-[#21262D] text-[#8B949E] border-[#30363D]', 
    dotColorClass: 'bg-[#8B949E]' 
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.colorClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dotColorClass}`} />
      {config.label}
    </span>
  );
}
