'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Playfair_Display } from 'next/font/google';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'] });

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        toast.success('Login successful!');
        // Force full page reload so middleware sees the fresh auth cookie
        window.location.href = '/admin/dashboard';
      } else {
        toast.error(result.message || 'Login failed');
      }

    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0F14] flex items-center justify-center relative overflow-hidden font-sans">
      <Toaster position="top-right" />
      {/* Animated background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#C9A84C]/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C9A84C]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

      <div className="w-full max-w-4xl max-h-[800px] h-[600px] bg-[#161B22]/80 backdrop-blur-xl border border-[#21262D] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative z-10 mx-4">
        
        {/* Left Side: Brand */}
        <div className="hidden md:flex md:w-5/12 bg-[#111318] p-10 flex-col justify-between border-r border-[#21262D] relative overflow-hidden">
          <div className="absolute inset-0 bg-[#C9A84C]/5 mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <h1 className={`${playfair.className} text-4xl text-[#C9A84C] tracking-wide mb-2`}>
              DAWAT
            </h1>
            <div className="h-px w-12 bg-[#C9A84C]/50 mb-4"></div>
            <p className="text-[#8B949E] text-sm tracking-widest uppercase">
              Admin Portal
            </p>
          </div>
          
          <div className="relative z-10">
            <h2 className={`${playfair.className} text-2xl text-[#E6EDF3] leading-snug mb-4`}>
              Authentic North Indian Taste
            </h2>
            <p className="text-[#8B949E] text-sm leading-relaxed">
              Securely manage reservations, menus, and customer experiences from your command center.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#E6EDF3] mb-2">Welcome Back</h2>
              <p className="text-[#8B949E] text-sm">Please sign in to access the dashboard.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#8B949E] mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  // placeholder="admin@dawatrestaurant.com"
                  className={`w-full bg-[#0D0F14] border ${errors.email ? 'border-red-500/50' : 'border-[#21262D] focus:border-[#C9A84C]'} rounded-lg px-4 py-3 text-[#E6EDF3] placeholder-[#484F58] focus:outline-none focus:ring-1 focus:ring-[#C9A84C] transition-colors duration-200`}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-[#8B949E]" htmlFor="password">
                    Password
                  </label>
                  <a href="#" className="text-xs text-[#C9A84C] hover:text-[#E2C068] transition-colors">
                    Forgot password?
                  </a>
                </div>
                <input
                  {...register('password')}
                  id="password"
                  type="password"
                  // placeholder="••••••••"
                  className={`w-full bg-[#0D0F14] border ${errors.password ? 'border-red-500/50' : 'border-[#21262D] focus:border-[#C9A84C]'} rounded-lg px-4 py-3 text-[#E6EDF3] placeholder-[#484F58] focus:outline-none focus:ring-1 focus:ring-[#C9A84C] transition-colors duration-200`}
                />
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#21262D] bg-[#0D0F14] text-[#C9A84C] focus:ring-[#C9A84C] focus:ring-offset-[#161B22]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#8B949E]">
                  Remember me for 7 days
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#C9A84C] hover:bg-[#E2C068] text-[#0D0F14] font-semibold rounded-lg px-4 py-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:ring-offset-2 focus:ring-offset-[#161B22] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Signing in...
                  </>
                ) : (
                  'Login to Dashboard'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
