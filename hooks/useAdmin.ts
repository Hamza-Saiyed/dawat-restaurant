'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

export function useAdmin() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await fetch('/api/admin/auth/verify');
        const data = await res.json();
        
        if (data.authenticated) {
          setAdmin(data.admin);
        } else {
          setAdmin(null);
          // Only redirect if we are on an admin page that is not the login page
          if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
            router.push('/admin/login');
          }
        }
      } catch (error) {
        console.error('Failed to verify admin auth:', error);
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [pathname, router]);

  const logout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      setAdmin(null);
      router.push('/admin/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return { admin, isLoading, logout };
}
