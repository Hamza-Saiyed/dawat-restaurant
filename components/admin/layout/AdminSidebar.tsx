'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Playfair_Display } from 'next/font/google';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  UtensilsCrossed, 
  ImageIcon, 
  Star, 
  MessageSquare, 
  Settings,
  Menu,
  X,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { useAdmin, AdminUser } from '@/hooks/useAdmin';
import { useTheme } from '@/hooks/useTheme';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import { useCallback, useEffect } from 'react';


const playfair = Playfair_Display({ subsets: ['latin'] });

export const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/reservations', icon: CalendarCheck, label: 'Reservations', badge: 'pending count' }, // Simplified badge logic for now
  { href: '/admin/menu', icon: UtensilsCrossed, label: 'Menu' },
  { href: '/admin/gallery', icon: ImageIcon, label: 'Gallery' },
  { href: '/admin/reviews', icon: Star, label: 'Reviews' },
  { href: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminSidebar({ admin }: { admin: AdminUser }) {
  const pathname = usePathname();
  const { logout } = useAdmin();
  const { theme, toggleTheme } = useTheme();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [badges, setBadges] = useState<{
    pendingReservations: number;
    unreadMessages: number;
    pendingReviews: number;
  }>({
    pendingReservations: 0,
    unreadMessages: 0,
    pendingReviews: 0,
  });

  const fetchBadges = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/dashboard/badges');
      const data = await res.json();
      if (data.success) {
        setBadges(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch badges:', error);
    }
  }, []);

  useAutoRefresh({
    intervalMs: 30_000,
    onRefresh: fetchBadges,
    refreshOnFocus: true,
  });

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);


  // Styling based on theme
  const isDark = theme === 'dark';
  const sidebarBg = isDark ? 'bg-[#111318]' : 'bg-[#FFFFFF]';
  const borderColor = isDark ? 'border-[#21262D]' : 'border-[#D0D7DE]';
  const textColorPrimary = isDark ? 'text-[#E6EDF3]' : 'text-[#1F2328]';
  const textColorMuted = isDark ? 'text-[#8B949E]' : 'text-[#656D76]';
  const hoverBg = isDark ? 'hover:bg-[#1C2128]' : 'hover:bg-[#F6F8FA]';
  const activeBg = isDark ? 'bg-[#C9A84C]/10' : 'bg-[#C9A84C]/10';

  const NavContent = () => (
    <div className="flex flex-col h-full overflow-y-auto w-full">
      <div className={`p-6 border-b ${borderColor} flex items-center justify-between`}>
        <div>
          <h2 className={`${playfair.className} text-2xl text-[#C9A84C] tracking-wide`}>
            DAWAT
          </h2>
          <p className={`text-xs uppercase tracking-widest ${textColorMuted} mt-1 font-semibold`}>
            Admin Panel
          </p>
        </div>
        <button 
          className="md:hidden text-[#8B949E] hover:text-[#C9A84C]"
          onClick={() => setIsMobileOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors group ${
                isActive 
                  ? `${activeBg} border-l-2 border-[#C9A84C] ${isDark ? 'text-[#C9A84C]' : 'text-[#A07830]'}` 
                  : `border-l-2 border-transparent ${textColorMuted} ${hoverBg} hover:text-[#C9A84C]`
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#C9A84C]' : 'text-inherit group-hover:text-[#C9A84C]'}`} />
                <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </div>
              
              {/* Badge Rendering */}
              {item.label === 'Reservations' && badges.pendingReservations > 0 && (
                <span className="bg-amber-500 text-[#0D0F14] text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {badges.pendingReservations}
                </span>
              )}
              {item.label === 'Messages' && badges.unreadMessages > 0 && (
                <span className="bg-[#C9A84C] text-[#0D0F14] text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {badges.unreadMessages}
                </span>
              )}
              {item.label === 'Reviews' && badges.pendingReviews > 0 && (
                <span className="bg-[#8B949E] text-[#0D0F14] text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {badges.pendingReviews}
                </span>
              )}
            </Link>

          );
        })}
      </nav>

      <div className={`p-4 border-t ${borderColor}`}>
        <div className={`flex items-center justify-between px-4 py-3 rounded-lg ${hoverBg} mb-2`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#0D0F14] font-bold text-sm">
              {admin.name?.charAt(0) || admin.email.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className={`text-sm font-medium ${textColorPrimary} truncate`}>
                {admin.name || 'Admin User'}
              </p>
              <p className={`text-xs ${textColorMuted} truncate uppercase`}>
                {admin.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <button 
            onClick={toggleTheme}
            className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg w-full ${textColorMuted} ${hoverBg} transition-colors text-sm font-medium`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          <button 
            onClick={logout}
            className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg w-full text-red-400 ${isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'} transition-colors text-sm font-medium`}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col w-64 ${sidebarBg} border-r ${borderColor} h-screen sticky top-0 flex-shrink-0 z-20`}>
        <NavContent />
      </aside>

      {/* Mobile Menu Button - positioned top left globally if needed, or done via Header */}
      <div className="md:hidden fixed z-40 top-4 left-4 border border-[#21262D] rounded-md bg-[#161B22] p-2 text-[#E6EDF3] shadow-lg">
        <button onClick={() => setIsMobileOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          
          {/* Drawer content */}
          <aside className={`relative w-72 max-w-[80vw] ${sidebarBg} shadow-2xl flex flex-col h-full transform transition-transform duration-300`}>
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
}
