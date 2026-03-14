'use client';

import { Suspense, useEffect } from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import { useTheme } from '@/hooks/useTheme';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import { Loader2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin, isLoading } = useAdmin();
  const { theme } = useTheme();

  useEffect(() => {
    // Ensure the body has the admin theme class correctly applied
    document.body.className = theme === 'dark' ? 'bg-[#0D0F14] text-[#E6EDF3]' : 'bg-[#F6F8FA] text-[#1F2328]';
    return () => {
      // Cleanup when unmounting admin layout completely
      document.body.className = '';
    };
  }, [theme]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0F14] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
      </div>
    );
  }

  // If not admin, the hook already redirects to login
  if (!admin) {
    return null;
  }

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-200`}>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: theme === 'dark' ? '#161B22' : '#FFFFFF',
            color: theme === 'dark' ? '#E6EDF3' : '#1F2328',
            border: `1px solid ${theme === 'dark' ? '#21262D' : '#D0D7DE'}`,
          },
        }}
      />
      
      {/* Sidebar - hidden on mobile unless toggled, handled internally via state/context conceptually 
          or simpler: just hide on mobile completely and use a drawer instead for mobile */}
      <AdminSidebar admin={admin} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader admin={admin} />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
            </div>
          }>
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
