'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/ui/DataTable';
import EmptyState from '@/components/admin/ui/EmptyState';
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog';
import MenuItemModal from '@/components/admin/menu/MenuItemModal';
import SearchInput from '@/components/admin/ui/SearchInput';
import { Plus, Edit2, Trash2, StopCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import { RefreshIndicator } from '@/components/admin/ui/RefreshIndicator';
import { useCallback } from 'react';


const CATEGORIES = ['All', 'Starters', 'Main Course', 'Breads', 'Rice & Biryani', 'Desserts', 'Beverages'];

export default function MenuPage() {
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  
  // Delete state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const catParam = categoryFilter !== 'All' ? `?category=${categoryFilter}` : '';
      const res = await fetch(`/api/admin/menu${catParam}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      } else {

        toast.error('Failed to load menu items');
      }
    } catch (e) {
      toast.error('Network error');
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter]);

  const { lastUpdated, isRefreshing, refresh, pause, resume, isPaused } = useAutoRefresh({
    intervalMs: 120_000,
    onRefresh: fetchItems,
    refreshOnFocus: true,
  });

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);


  useEffect(() => {
    // Client-side search filtering
    if (!searchQuery) {
      setFilteredItems(items);
    } else {
      const lowerQ = searchQuery.toLowerCase();
      setFilteredItems(items.filter(item => 
        item.name.toLowerCase().includes(lowerQ) || 
        (item.nameHindi && item.nameHindi.includes(lowerQ)) ||
        (item.description && item.description.toLowerCase().includes(lowerQ))
      ));
    }
  }, [searchQuery, items]);

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/menu/${itemToDelete}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        fetchItems();
      } else {
        toast.error(data.error || 'Failed to delete');
      }
    } catch(e) {
      toast.error('Network error');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const columns = [
    {
      key: 'image',
      header: 'Item',
      sortable: false,
      render: (item: any) => (
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-lg bg-[#21262D] overflow-hidden shrink-0 border border-[#30363D]">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#484F58]">
                <span>No Img</span>
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold text-[#E6EDF3] flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} title={item.isVeg ? 'Veg' : 'Non-Veg'} />
              {item.name}
            </div>
            {item.nameHindi && <div className="text-xs text-[#8B949E] mt-0.5">{item.nameHindi}</div>}
          </div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
    },
    {
      key: 'price',
      header: 'Price',
      render: (item: any) => (
        <div className="font-medium text-[#E6EDF3]">
          ₹{item.price}
          {item.discountPrice && (
             <span className="text-xs text-emerald-500 ml-2">(-₹{item.price - item.discountPrice})</span>
          )}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: any) => (
        <div className="flex flex-col gap-1">
          {item.isAvailable ? (
            <span className="inline-flex items-center text-xs text-emerald-500">
              <CheckCircle className="w-3 h-3 mr-1" /> Available
            </span>
          ) : (
            <span className="inline-flex items-center text-xs text-amber-500">
              <StopCircle className="w-3 h-3 mr-1" /> Unavailable
            </span>
          )}
          {item.isPopular && <span className="text-[10px] text-[#C9A84C] uppercase tracking-wider font-semibold">★ Popular</span>}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (item: any) => (
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handleEdit(item)}
            className="p-1.5 bg-[#21262D] text-[#8B949E] hover:text-[#C9A84C] hover:bg-[#30363D] rounded-md transition-colors"
            title="Edit Item"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => confirmDelete(item._id)}
            className="p-1.5 bg-red-500/5 text-red-400 opacity-50 hover:opacity-100 hover:bg-red-500/10 rounded-md transition-all ml-2"
            title="Delete Item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#E6EDF3]">Menu Management</h1>
          <p className="text-[#8B949E] text-sm mt-1">Add, edit, and organize restaurant offerings.</p>
        </div>
        <div className="flex items-center gap-4">
          <RefreshIndicator 
            lastUpdated={lastUpdated}
            isRefreshing={isRefreshing}
            isPaused={isPaused}
            onManualRefresh={refresh}
            onPause={pause}
            onResume={resume}
            intervalSeconds={120}
          />
          <button 
            onClick={handleCreate}
            className="flex items-center px-4 py-2 bg-[#C9A84C] hover:bg-[#E2C068] text-[#0D0F14] text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </button>
        </div>
      </div>


      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 relative">
        {/* Category Tabs */}
        <div className="flex overflow-x-auto border-b border-[#30363D] custom-scrollbar flex-1 mr-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                categoryFilter === cat
                  ? 'border-[#C9A84C] text-[#C9A84C]'
                  : 'border-transparent text-[#8B949E] hover:text-[#E6EDF3] hover:border-[#484F58]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {/* Search */}
        <div className="w-full md:w-64 shrink-0 pb-1">
          <SearchInput 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search menu..."
          />
        </div>
      </div>

      <DataTable 
        data={filteredItems}
        columns={columns}
        keyExtractor={(item) => item._id}
        isLoading={isLoading}
        emptyState={
          <EmptyState 
            title="No menu items found" 
            description={searchQuery ? "No items match your search query." : "Start by adding a new item to your menu."}
            icon="data"
          />
        }
      />

      {/* Editor Modal */}
      <MenuItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchItems}
        item={editingItem}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={executeDelete}
        isLoading={isDeleting}
        title="Delete Menu Item"
        description="Are you sure you want to permanently delete this menu item? It will be removed from the front-end menu immediately."
        confirmText="Yes, delete item"
      />
    </div>
  );
}
