'use client';

import { useState, useEffect } from 'react';
import { Plus, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import UploadModal from '@/components/admin/gallery/UploadModal';
import GalleryGrid from '@/components/admin/gallery/GalleryGrid';
import EmptyState from '@/components/admin/ui/EmptyState';
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog';
import { SkeletonCard } from '@/components/admin/ui/Skeleton';

const CATEGORIES = ['All', 'Restaurant Interior', 'Food & Dishes', 'Events', 'Team'];

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Delete State
  const [itemToDelete, setItemToDelete] = useState<{ id: string, url: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchGallery = async () => {
    setIsLoading(true);
    try {
      const catParam = activeCategory !== 'All' ? `?category=${encodeURIComponent(activeCategory)}` : '';
      const res = await fetch(`/api/admin/gallery${catParam}`);
      const data = await res.json();
      if (data.success) {
        setImages(data.data);
      } else {

        toast.error('Failed to load gallery');
      }
    } catch (e) {
      toast.error('Network Error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [activeCategory]);

  const confirmDelete = (id: string, url: string) => {
    setItemToDelete({ id, url });
    setIsDeleteDialogOpen(true);
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/gallery/${itemToDelete.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setImages(images.filter(img => img._id !== itemToDelete.id)); // Optimistic UI local remove
      } else {
        toast.error(data.error || 'Failed to delete');
      }
    } catch (e) {
      toast.error('Network error during deletion');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#E6EDF3]">Gallery Management</h1>
          <p className="text-[#8B949E] text-sm mt-1">Upload and organize images displayed on the main website.</p>
        </div>
        <button 
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center px-4 py-2 bg-[#C9A84C] hover:bg-[#E2C068] text-[#0D0F14] text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Upload Images
        </button>
      </div>

      <div className="flex overflow-x-auto border-b border-[#30363D] custom-scrollbar mb-6 pb-0">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeCategory === cat
                ? 'border-[#C9A84C] text-[#C9A84C]'
                : 'border-transparent text-[#8B949E] hover:text-[#E6EDF3] hover:border-[#484F58]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-square bg-[#161B22] rounded-xl border border-[#21262D] animate-pulse"></div>
          ))}
        </div>
      ) : images.length > 0 ? (
        <div className="mb-4">
          <p className="text-[#8B949E] text-xs mb-4 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C9A84C] mr-2"></span>
            Drag and drop images to reorder them on the public gallery.
          </p>
          <GalleryGrid 
            initialImages={images} 
            onDeleteRequest={confirmDelete}
            onRefresh={fetchGallery}
          />
        </div>
      ) : (
        <EmptyState 
          title={`No images in ${activeCategory}`}
          description="Upload photos to feature them in this gallery section."
          icon="document"
          action={
            <button 
              onClick={() => setIsUploadOpen(true)}
              className="mt-4 flex flex-col items-center justify-center p-8 bg-[#161B22] hover:bg-[#1C2128] border-2 border-dashed border-[#30363D] hover:border-[#C9A84C] rounded-xl transition-colors group cursor-pointer w-full max-w-sm"
            >
              <div className="p-3 bg-[#0D0F14] rounded-full group-hover:bg-[#C9A84C]/10 transition-colors mb-3">
                <ImageIcon className="w-6 h-6 text-[#8B949E] group-hover:text-[#C9A84C]" />
              </div>
              <span className="text-[#E6EDF3] font-medium text-sm">Click here to upload files</span>
            </button>
          }
        />
      )}

      {/* Upload Modal */}
      <UploadModal 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSaved={fetchGallery}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={executeDelete}
        isLoading={isDeleting}
        title="Delete Image Permanently"
        description="Are you sure you want to delete this image? It will be permanently removed from Cloudinary and the database."
        confirmText="Yes, delete it"
      />
    </div>
  );
}
