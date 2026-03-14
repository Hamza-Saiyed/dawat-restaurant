interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-[#21262D] rounded ${className}`}></div>
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} 
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`p-6 rounded-xl border border-[#21262D] bg-[#161B22] ${className}`}>
      <Skeleton className="h-10 w-10 mb-4 rounded-full" />
      <Skeleton className="h-6 w-1/3 mb-2" />
      <Skeleton className="h-8 w-1/2" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4, className = '' }) {
  return (
    <div className={`border border-[#21262D] rounded-xl overflow-hidden bg-[#161B22] ${className}`}>
      <div className="bg-[#111318] p-4 flex gap-4 border-b border-[#21262D]">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      <div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex gap-4 border-b border-[#21262D] last:border-0">
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
