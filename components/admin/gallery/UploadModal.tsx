import { useState, useCallback } from 'react';
import Modal from '@/components/admin/ui/Modal';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const CATEGORIES = ['Restaurant Interior', 'Food & Dishes', 'Events', 'Team'];

export default function UploadModal({ isOpen, onClose, onSaved }: UploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [category, setCategory] = useState(CATEGORIES[1]);
  const [isUploading, setIsUploading] = useState(false);

  // Cleanup object URLs to avoid memory leaks
  const cleanup = useCallback(() => {
    previews.forEach(url => URL.revokeObjectURL(url));
  }, [previews]);

  const closeAndReset = () => {
    cleanup();
    setFiles([]);
    setPreviews([]);
    setCategory(CATEGORIES[1]);
    onClose();
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles];
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    
    setFiles(newFiles);
    setPreviews(prev => [...prev, ...newPreviews]);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
  });

  const removeFile = (index: number) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    
    URL.revokeObjectURL(newPreviews[index]); // Cleanup
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });
      formData.append('category', category);

      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (data.success) {
        toast.success(`Successfully uploaded ${files.length} images`);
        onSaved();
        closeAndReset();
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (error) {
      toast.error('Network error during upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeAndReset} title="Upload Gallery Images" maxWidth="max-w-2xl">
      <div className="space-y-6">
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-[#E6EDF3]">Default Category for Uploads</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#0D0F14] border border-[#30363D] rounded-lg p-2 text-sm text-[#E6EDF3] focus:ring-1 focus:ring-[#C9A84C]"
          >
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div 
          {...getRootProps()} 
          className={`flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-[#C9A84C] bg-[#C9A84C]/5' 
              : 'border-[#30363D] hover:border-[#484F58] bg-[#0D0F14]'
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className={`w-10 h-10 mb-3 ${isDragActive ? 'text-[#C9A84C]' : 'text-[#8B949E]'}`} />
          <p className="mb-1 text-sm text-[#E6EDF3] font-medium text-center px-4">
            Drag & drop images here, or click to select files
          </p>
          <p className="text-xs text-[#8B949E]">
            Supports JPG, PNG, WEBP (Multiple files allowed)
          </p>
        </div>

        {previews.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-[#E6EDF3]">Selected Files ({previews.length})</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-48 overflow-y-auto custom-scrollbar pr-2 py-1">
              {previews.map((preview, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-[#30363D] group">
                  <img src={preview} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                      className="p-1.5 bg-red-500 rounded-md text-white hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-[#21262D]">
          <button
            onClick={closeAndReset}
            disabled={isUploading}
            className="px-4 py-2 text-sm font-medium text-[#E6EDF3] bg-[#21262D] rounded-lg hover:bg-[#30363D] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading || files.length === 0}
            className="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-70 bg-[#C9A84C] hover:bg-[#E2C068] text-[#0D0F14]"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading {files.length}...
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4 mr-2" />
                Upload Images
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
