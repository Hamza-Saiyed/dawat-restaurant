import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

export default function Drawer({ isOpen, onClose, title, children, width = 'w-full sm:w-[480px] md:w-[600px]' }: DrawerProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Prevent scrolling on body when drawer is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isMounted) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      )}
      
      <div 
        className={`fixed inset-y-0 right-0 z-50 ${width} bg-[#161B22] border-l border-[#30363D] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-[#21262D]">
          <h3 className="text-xl font-semibold text-[#E6EDF3]">{title}</h3>
          <button 
            onClick={onClose}
            className="text-[#8B949E] hover:text-[#E6EDF3] transition-colors p-1.5 rounded-md hover:bg-[#21262D]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {children}
        </div>
      </div>
    </>
  );
}
