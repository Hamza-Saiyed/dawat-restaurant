import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (file: File | null) => void;
  onImageRemove?: () => void;
}

export default function ImageUpload({ currentImage, onImageChange, onImageRemove }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) {
      const file = acceptedFiles[0];
      setPreview(URL.createObjectURL(file));
      onImageChange(file);
    }
  }, [onImageChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImageChange(null);
    if (onImageRemove) onImageRemove();
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative w-full aspect-video sm:w-64 sm:aspect-square rounded-xl overflow-hidden border border-[#30363D] group">
          <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <button
              onClick={handleRemove}
              type="button"
              className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div 
          {...getRootProps()} 
          className={`flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-[#C9A84C] bg-[#C9A84C]/5' 
              : 'border-[#30363D] hover:border-[#484F58] bg-[#0D0F14]'
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className={`w-8 h-8 mb-3 ${isDragActive ? 'text-[#C9A84C]' : 'text-[#8B949E]'}`} />
          <p className="mb-1 text-sm text-[#E6EDF3] font-medium">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-[#8B949E]">
            SVG, PNG, JPG or WEBP (MAX. 800x400px)
          </p>
        </div>
      )}
    </div>
  );
}
