'use client';

import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

export function useTheme() {
  // Start with dark mode as default for admin panel
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user has a saved preference, otherwise default is 'dark'
    const savedTheme = localStorage.getItem('admin-theme') as Theme | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Default applies dark
      applyTheme('dark');
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    // We toggle a data attribute rather than class to keep Tailwind isolated 
    // for just the admin section if we need to. Otherwise we just toggle the standard class.
    if (newTheme === 'dark') {
      root.classList.add('darkAdmin');
      root.classList.remove('lightAdmin');
    } else {
      root.classList.add('lightAdmin');
      root.classList.remove('darkAdmin');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('admin-theme', newTheme);
    applyTheme(newTheme);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return { theme: 'dark' as Theme, toggleTheme: () => {} };
  }

  return { theme, toggleTheme };
}
