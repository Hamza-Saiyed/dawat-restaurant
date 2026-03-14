'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Trash2, GripVertical, CheckCircle, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface GalleryImage {
  _id: string;
  url: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

interface GalleryGridProps {
  initialImages: GalleryImage[];
  onDeleteRequest: (id: string, url: string) => void;
  onRefresh: () => void;
}

export default function GalleryGrid({ initialImages, onDeleteRequest, onRefresh }: GalleryGridProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      // Optimistic update
      setImages(prev => prev.map(img => img._id === id ? { ...img, isActive: !currentStatus } : img));
      
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      
      const data = await res.json();
      if (!data.success) {
        // Revert on failure
        setImages(initialImages);
        toast.error('Failed to update status');
      } else {
        toast.success(currentStatus ? 'Image hidden from website' : 'Image visible on website');
      }
    } catch (e) {
      setImages(initialImages);
      toast.error('Network error');
    }
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    
    if (sourceIndex === destIndex) return;

    // Optimistically reorder array locally
    const newItems = Array.from(images);
    const [reorderedItem] = newItems.splice(sourceIndex, 1);
    newItems.splice(destIndex, 0, reorderedItem);
    
    setImages(newItems);

    try {
      // Send new array to server for bulk update
      const res = await fetch('/api/admin/gallery/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: newItems.map(item => ({ _id: item._id })) })
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Gallery reordered successfully');
      } else {
        setImages(initialImages); // Revert
        toast.error('Failed to save new order');
      }
    } catch (e) {
      setImages(initialImages); // Revert
      toast.error('Network error saving order');
    }
  };

  if (images.length === 0) {
    return null; // Let the parent show the EmptyState
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="gallery-grid" direction="horizontal" isDropDisabled={false}>
        {(provided) => (
          <div 
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            style={{ display: 'grid' }} // Keep grid layout for the droppable area
          >
            {images.map((image, index) => (
              <Draggable key={image._id} draggableId={image._id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`relative aspect-square rounded-xl overflow-hidden border ${
                      snapshot.isDragging ? 'border-[#C9A84C] shadow-2xl z-50 ring-2 ring-[#C9A84C] scale-105' : 'border-[#30363D]'
                    } bg-[#161B22] group transition-transform duration-200`}
                    // react-beautiful-dnd needs inline styles applied to the wrapper for positioning to work
                    style={provided.draggableProps.style}
                  >
                    <img 
                      src={image.url} 
                      alt={`Gallery ${index}`} 
                      className={`w-full h-full object-cover transition-all ${
                        !image.isActive ? 'grayscale opacity-50' : ''
                      }`} 
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 left-2">
                       {image.isActive ? (
                         <span className="bg-black/60 backdrop-blur-md text-emerald-400 p-1 rounded-md text-xs inline-flex shadow-sm">
                           <CheckCircle className="w-3 h-3" />
                         </span>
                       ) : (
                         <span className="bg-black/60 backdrop-blur-md text-amber-500 p-1 rounded-md text-xs inline-flex shadow-sm">
                           <EyeOff className="w-3 h-3" />
                         </span>
                       )}
                    </div>

                    {/* Category Label */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-6 pointer-events-none">
                      <p className="text-xs font-medium text-white truncate drop-shadow-md">
                        {image.category}
                      </p>
                    </div>

                    {/* Actions Overlay */}
                    <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-3 transition-opacity ${snapshot.isDragging ? '!opacity-0' : ''}`}>
                      
                      {/* Drag Handle */}
                      <div 
                        {...provided.dragHandleProps}
                        className="p-2 bg-[#21262D] rounded-lg text-[#E6EDF3] hover:text-[#C9A84C] hover:bg-[#30363D] cursor-grab active:cursor-grabbing transition-colors tooltip-wrapper"
                        title="Drag to reorder"
                      >
                        <GripVertical className="w-5 h-5" />
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => toggleActive(image._id, image.isActive)}
                          className="p-2 bg-[#21262D] rounded-lg text-[#E6EDF3] hover:text-amber-500 hover:bg-[#30363D] transition-colors tooltip-wrapper"
                          title={image.isActive ? "Hide from website" : "Show on website"}
                        >
                          {image.isActive ? <EyeOff className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        
                        <button 
                          onClick={() => onDeleteRequest(image._id, image.url)}
                          className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors tooltip-wrapper"
                          title="Delete image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
