import { AlertTriangle, Loader2 } from 'lucide-react';
import Modal from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = true,
  isLoading = false
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col sm:flex-row gap-4 mb-6 pt-2">
        <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isDangerous ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[#8B949E] text-sm leading-relaxed">{description}</p>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4 border-t border-[#21262D]">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-[#E6EDF3] bg-[#21262D] rounded-lg hover:bg-[#30363D] transition-colors disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-70 ${
            isDangerous 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-[#C9A84C] hover:bg-[#E2C068] text-[#0D0F14]'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            confirmText
          )}
        </button>
      </div>
    </Modal>
  );
}
