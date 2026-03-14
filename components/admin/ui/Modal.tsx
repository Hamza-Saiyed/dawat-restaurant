import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }: ModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Prevent scrolling on body when modal is open
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

  if (!isMounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className={`relative w-full ${maxWidth} bg-[#161B22] border border-[#30363D] rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all`}>
        <div className="flex items-center justify-between p-5 border-b border-[#21262D]">
          <h3 className="text-lg font-semibold text-[#E6EDF3]">{title}</h3>
          <button 
            onClick={onClose}
            className="text-[#8B949E] hover:text-[#E6EDF3] transition-colors p-1 rounded-md hover:bg-[#21262D]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
