import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4">
      <Loader2 className="w-10 h-10 text-[#C9A84C] animate-spin" />
      <p className="text-[#8B949E] animate-pulse font-jost uppercase tracking-widest text-sm">
        Loading royal dashboard...
      </p>
    </div>
  );
}
