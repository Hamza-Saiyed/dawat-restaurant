import { Plus, CheckCircle, Image as ImageIcon, Settings } from 'lucide-react';
import Link from 'next/link';

export default function QuickActions() {
  const actions = [
    {
      title: 'Approve Bookings',
      desc: 'Review pending requests',
      icon: CheckCircle,
      href: '/admin/reservations?filter=pending',
      color: 'emerald'
    },
    {
      title: 'Add Menu Item',
      desc: 'Create new dish',
      icon: Plus,
      href: '/admin/menu?action=new',
      color: 'amber'
    },
    {
      title: 'Upload Gallery',
      desc: 'Add new photos',
      icon: ImageIcon,
      href: '/admin/gallery?action=upload',
      color: 'indigo'
    },
    {
      title: 'Site Settings',
      desc: 'Update opening hours',
      icon: Settings,
      href: '/admin/settings',
      color: 'zinc'
    }
  ];

  return (
    <div className="bg-[#161B22]/80 backdrop-blur-md border border-[#21262D] rounded-xl overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-[#21262D]">
        <h3 className="text-[#E6EDF3] font-medium">Quick Actions</h3>
        <p className="text-[#8B949E] text-xs mt-1">Shortcuts to common tasks</p>
      </div>

      <div className="flex-1 p-4 grid grid-cols-2 gap-3">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          
          // Color mapping
          const colorStyles = {
            emerald: 'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30',
            amber: 'bg-[#C9A84C]/10 text-[#C9A84C] group-hover:bg-[#C9A84C]/20 group-hover:border-[#C9A84C]/30',
            indigo: 'bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30',
            zinc: 'bg-[#21262D] text-[#8B949E] group-hover:bg-[#30363D] group-hover:border-[#484F58]',
          }[action.color];

          return (
            <Link 
              key={idx} 
              href={action.href}
              className={`p-3 border border-transparent rounded-lg transition-all group flex flex-col justify-center ${colorStyles}`}
            >
              <Icon className="w-5 h-5 mb-2" />
              <div className="text-xs font-semibold text-[#E6EDF3] mb-0.5">{action.title}</div>
              <div className="text-[10px] opacity-70 leading-tight">{action.desc}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
