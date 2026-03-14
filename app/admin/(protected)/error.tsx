'use client';

import { useEffect } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin Error Boundary:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full text-center px-4">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-2xl font-playfair text-[#E6EDF3] mb-2">Something went wrong!</h2>
      <p className="text-[#8B949E] max-w-md mx-auto mb-8">
        We encountered an error while loading this section. Our team has been notified.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#E2C068] text-[#0D0F14] font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
}
