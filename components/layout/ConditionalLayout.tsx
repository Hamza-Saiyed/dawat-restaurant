'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import { Toaster } from 'react-hot-toast';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    // Admin routes: render children only, no Navbar/Footer/WhatsApp 
    // The admin layout.tsx handles its own chrome
    return <>{children}</>;
  }

  // Public routes: render with full site chrome
  return (
    <div className="bg-dark text-foreground">
      <Navbar />
      {children}
      <WhatsAppButton />
      <Footer />
      <Toaster 
        position="bottom-center" 
        toastOptions={{ className: 'bg-dark-card text-foreground border border-gold/30' }} 
      />
    </div>
  );
}
