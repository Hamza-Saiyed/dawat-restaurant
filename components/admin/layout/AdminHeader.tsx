'use client';

import { useAdmin, AdminUser } from '@/hooks/useAdmin';
import { useTheme } from '@/hooks/useTheme';
import { Search, Bell, ExternalLink, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { navItems } from './AdminSidebar';

export default function AdminHeader({ admin }: { admin: AdminUser }) {
  const { theme } = useTheme();
  const pathname = usePathname();
  
  const isDark = theme === 'dark';
  const headerBg = isDark ? 'bg-[#161B22]/80' : 'bg-[#FFFFFF]/80';
  const borderColor = isDark ? 'border-[#21262D]' : 'border-[#D0D7DE]';
  const textColor = isDark ? 'text-[#E6EDF3]' : 'text-[#1F2328]';
  const mutedText = isDark ? 'text-[#8B949E]' : 'text-[#656D76]';
  const inputBg = isDark ? 'bg-[#0D0F14]' : 'bg-[#F6F8FA]';

  // Format breadcrumbs based on pathname
  const pathParts = pathname.split('/').filter(Boolean);
  
  // Find current active root nav item to show in header or title
  const activeNavItem = navItems.find((item) => pathname.startsWith(item.href)) || { label: 'Admin' };

  return (
    <header className={`sticky top-0 z-10 w-full ${headerBg} backdrop-blur-md border-b ${borderColor} px-4 py-3 md:px-8 md:py-4 flex items-center justify-between`}>
      {/* Left side spacer for mobile menu button or breadcrumbs */}
      <div className="flex items-center flex-1 pl-12 md:pl-0">
        <div className="hidden sm:flex items-center space-x-2 text-sm">
          <span className={`${mutedText}`}>Dashboard</span>
          <ChevronRight className={`w-4 h-4 ${mutedText}`} />
          <span className={`font-semibold ${textColor}`}>{activeNavItem.label}</span>
          
          {pathParts.length > 2 && (
            <>
              <ChevronRight className={`w-4 h-4 ${mutedText}`} />
              <span className={mutedText}>Detailed View</span>
            </>
          )}
        </div>
        <h1 className={`sm:hidden font-semibold ${textColor}`}>{activeNavItem.label}</h1>
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Search */}
        <div className={`hidden lg:flex items-center ${inputBg} border ${borderColor} rounded-full px-3 py-1.5 focus-within:ring-1 focus-within:ring-[#C9A84C] focus-within:border-[#C9A84C] transition-all`}>
          <Search className={`w-4 h-4 ${mutedText}`} />
          <input 
            type="text" 
            placeholder="Search bookings or menu..." 
            className={`bg-transparent border-none focus:outline-none focus:ring-0 text-sm w-48 xl:w-64 px-2 ${textColor}`}
          />
        </div>

        {/* Notifications */}
        <button className={`relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${mutedText} hover:${textColor}`}>
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-current pointer-events-none"></span>
        </button>

        {/* View Site */}
        <a 
          href="/" 
          target="_blank" 
          rel="noopener noreferrer"
          className={`hidden sm:flex items-center space-x-1.5 text-sm font-medium ${mutedText} hover:text-[#C9A84C] transition-colors`}
        >
          <span>View Site</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
}
