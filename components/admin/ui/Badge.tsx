import { ReactNode } from 'react';

type BadgeVariant = 'pending' | 'approved' | 'rejected' | 'completed' | 'info' | 'default';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

export default function Badge({ children, variant = 'default', className = '', dot = false }: BadgeProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'pending':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'approved':
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'info':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      default:
        return 'bg-[#21262D] text-[#8B949E] border-[#30363D]';
    }
  };

  const getDotColor = () => {
    switch (variant) {
      case 'pending': return 'bg-amber-500';
      case 'approved':
      case 'completed': return 'bg-emerald-500';
      case 'rejected': return 'bg-red-500';
      case 'info': return 'bg-indigo-500';
      default: return 'bg-[#8B949E]';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getVariantClasses()} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getDotColor()}`} />
      )}
      {children}
    </span>
  );
}
