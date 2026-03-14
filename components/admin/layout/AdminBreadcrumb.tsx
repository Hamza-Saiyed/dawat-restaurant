import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminBreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function AdminBreadcrumb({ items }: AdminBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6 overflow-x-auto pb-2 -mb-2">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center flex-nowrap shrink-0">
            {isLast ? (
              <span className="font-semibold text-[#E6EDF3] dark:text-[#1F2328] truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <>
                <Link 
                  href={item.href || '#'} 
                  className="text-[#8B949E] hover:text-[#C9A84C] transition-colors truncate max-w-[150px]"
                >
                  {item.label}
                </Link>
                <ChevronRight className="w-4 h-4 text-[#484F58] mx-2 shrink-0" />
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}
