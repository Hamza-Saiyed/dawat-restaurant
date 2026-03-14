import { ReactNode } from 'react';
import { FileQuestion, SearchX, Database } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: 'search' | 'data' | 'document';
  className?: string;
}

export default function EmptyState({ 
  title, 
  description, 
  action, 
  icon = 'document',
  className = '' 
}: EmptyStateProps) {
  
  const getIcon = () => {
    switch (icon) {
      case 'search':
        return <SearchX className="w-12 h-12 text-[#484F58]" />;
      case 'data':
        return <Database className="w-12 h-12 text-[#484F58]" />;
      case 'document':
      default:
        return <FileQuestion className="w-12 h-12 text-[#484F58]" />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center border border-dashed border-[#30363D] rounded-xl bg-[#0D0F14]/50 ${className}`}>
      <div className="mb-4 p-4 bg-[#161B22] rounded-full">
        {getIcon()}
      </div>
      <h3 className="text-lg font-medium text-[#E6EDF3] mb-2">{title}</h3>
      <p className="text-sm text-[#8B949E] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
}
