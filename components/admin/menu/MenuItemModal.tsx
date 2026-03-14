import { useState, useEffect } from 'react';
import Modal from '@/components/admin/ui/Modal';
import ImageUpload from './ImageUpload';
import { Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  item: any | null; // null means create mode
}

const CATEGORIES = [
  'Starters', 'Main Course', 'Breads', 'Rice & Biryani', 'Desserts', 'Beverages'
];

export default function MenuItemModal({ isOpen, onClose, onSaved, item }: MenuItemModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [nameHindi, setNameHindi] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [tags, setTags] = useState('');
  
  // Boolean Flags
  const [isVeg, setIsVeg] = useState(true);
  const [isSpicy, setIsSpicy] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  
  // Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (item) {
        setName(item.name || '');
        setNameHindi(item.nameHindi || '');
        setCategory(item.category || CATEGORIES[0]);
        setDescription(item.description || '');
        setPrice(item.price?.toString() || '');
        setDiscountPrice(item.discountPrice?.toString() || '');
        setTags(item.tags ? item.tags.join(', ') : '');
        setIsVeg(item.isVeg ?? true);
        setIsSpicy(item.isSpicy ?? false);
        setIsPopular(item.isPopular ?? false);
        setIsAvailable(item.isAvailable ?? true);
        setImagePreview(item.image || undefined);
        setImageFile(null);
        setRemoveImage(false);
      } else {
        // Reset form for create
        setName('');
        setNameHindi('');
        setCategory(CATEGORIES[0]);
        setDescription('');
        setPrice('');
        setDiscountPrice('');
        setTags('');
        setIsVeg(true);
        setIsSpicy(false);
        setIsPopular(false);
        setIsAvailable(true);
        setImagePreview(undefined);
        setImageFile(null);
        setRemoveImage(false);
      }
    }
  }, [isOpen, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('nameHindi', nameHindi);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('price', price);
      if (discountPrice) formData.append('discountPrice', discountPrice);
      formData.append('tags', tags);
      formData.append('isVeg', isVeg.toString());
      formData.append('isSpicy', isSpicy.toString());
      formData.append('isPopular', isPopular.toString());
      formData.append('isAvailable', isAvailable.toString());

      if (imageFile) {
        formData.append('image', imageFile);
      }
      if (removeImage) {
        formData.append('removeImage', 'true');
      }

      const url = item ? `/api/admin/menu/${item._id}` : '/api/admin/menu';
      const method = item ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData, // fetch automatically sets multipart/form-data with correct boundary
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Menu item ${item ? 'updated' : 'created'} successfully`);
        onSaved();
        onClose();
      } else {
        toast.error(data.error || 'Failed to save item');
      }
    } catch (error) {
      toast.error('Network error during save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (!file && item?.image) {
      setRemoveImage(true);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={item ? 'Edit Menu Item' : 'Add Menu Item'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-[#E6EDF3]">Item Name <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0D0F14] border border-[#30363D] rounded-lg p-2 text-sm text-[#E6EDF3] focus:ring-1 focus:ring-[#C9A84C]"
              placeholder="e.g. Butter Chicken"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-[#E6EDF3]">Hindi Name (Optional)</label>
            <input 
              type="text" 
              value={nameHindi}
              onChange={(e) => setNameHindi(e.target.value)}
              className="w-full bg-[#0D0F14] border border-[#30363D] rounded-lg p-2 text-sm text-[#E6EDF3] focus:ring-1 focus:ring-[#C9A84C]"
              placeholder="e.g. बटर चिकन"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-[#E6EDF3]">Category <span className="text-red-500">*</span></label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0D0F14] border border-[#30363D] rounded-lg p-2 text-sm text-[#E6EDF3] focus:ring-1 focus:ring-[#C9A84C]"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
              <label className="text-sm font-medium text-[#E6EDF3]">Price (₹) <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#0D0F14] border border-[#30363D] rounded-lg p-2 text-sm text-[#E6EDF3] focus:ring-1 focus:ring-[#C9A84C]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#E6EDF3]">Discount (₹)</label>
              <input 
                type="number" 
                min="0"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                className="w-full bg-[#0D0F14] border border-[#30363D] rounded-lg p-2 text-sm text-[#E6EDF3] focus:ring-1 focus:ring-[#C9A84C]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-[#E6EDF3]">Description</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#0D0F14] border border-[#30363D] rounded-lg p-2 text-sm text-[#E6EDF3] focus:ring-1 focus:ring-[#C9A84C] min-h-[80px]"
            placeholder="Brief description of the dish..."
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-2 pt-2 border-t border-[#21262D]">
          <label className="text-sm font-medium text-[#E6EDF3]">Item Image</label>
          <ImageUpload 
            currentImage={imagePreview}
            onImageChange={handleImageChange}
            onImageRemove={() => setRemoveImage(true)}
          />
        </div>

        {/* Tags & Flags */}
        <div className="space-y-4 pt-4 border-t border-[#21262D]">
          <div className="space-y-1">
            <label className="text-sm font-medium text-[#E6EDF3]">Tags (comma separated)</label>
            <input 
              type="text" 
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-[#0D0F14] border border-[#30363D] rounded-lg p-2 text-sm text-[#E6EDF3] focus:ring-1 focus:ring-[#C9A84C]"
              placeholder="e.g. Gluten-free, Contains Nuts, Chef's Special"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isVeg}
                onChange={(e) => setIsVeg(e.target.checked)}
                className="rounded border-[#30363D] text-[#C9A84C] focus:ring-[#C9A84C] bg-[#0D0F14]"
              />
              <span className="text-sm text-[#E6EDF3]">Vegetarian</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isSpicy}
                onChange={(e) => setIsSpicy(e.target.checked)}
                className="rounded border-[#30363D] text-[#C9A84C] focus:ring-[#C9A84C] bg-[#0D0F14]"
              />
              <span className="text-sm text-[#E6EDF3]">Spicy</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="rounded border-[#30363D] text-[#C9A84C] focus:ring-[#C9A84C] bg-[#0D0F14]"
              />
              <span className="text-sm text-[#E6EDF3]">Popular</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="rounded border-[#30363D] text-[#C9A84C] focus:ring-[#C9A84C] bg-[#0D0F14]"
              />
              <span className="text-sm text-[#E6EDF3]">Available</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-[#21262D]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-[#E6EDF3] bg-[#21262D] rounded-lg hover:bg-[#30363D] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-70 bg-[#C9A84C] hover:bg-[#E2C068] text-[#0D0F14]"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Item
              </>
            )}
          </button>
        </div>

      </form>
    </Modal>
  );
}
