'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/ui/DataTable';
import EmptyState from '@/components/admin/ui/EmptyState';
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog';
import Drawer from '@/components/admin/ui/Drawer';
import SearchInput from '@/components/admin/ui/SearchInput';
import { Eye, Mail, Trash2, Reply, Archive, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import { RefreshIndicator } from '@/components/admin/ui/RefreshIndicator';
import { useCallback } from 'react';


export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'archived'
  const [searchQuery, setSearchQuery] = useState('');

  // Drawers & Modals
  const [selectedMsg, setSelectedMsg] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [msgToDelete, setMsgToDelete] = useState<string | null>(null);

  // Form
  const [adminNote, setAdminNote] = useState('');

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/messages?filter=${filter}&search=${searchQuery}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      } else {

        toast.error('Failed to load messages');
      }
    } catch (e) {
      toast.error('Network Error');
    } finally {
      setIsLoading(false);
    }
  }, [filter, searchQuery]);

  const { lastUpdated, isRefreshing, refresh, pause, resume, isPaused } = useAutoRefresh({
    intervalMs: 15_000,
    onRefresh: fetchMessages,
    refreshOnFocus: true,
  });

  useEffect(() => {
    const timer = setTimeout(() => fetchMessages(), 300);
    return () => clearTimeout(timer);
  }, [fetchMessages]);

  const unreadCount = messages.filter(m => !m.isRead).length;

  useEffect(() => {
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) Messages | Dawat Admin`;
    } else {
      document.title = 'Messages | Dawat Admin';
    }
    return () => {
      document.title = 'Dawat Admin';
    };
  }, [unreadCount]);


  const openMessage = async (msg: any) => {
    setSelectedMsg(msg);
    setAdminNote(msg.adminNote || '');
    setIsDrawerOpen(true);
    
    // Mark as read immediately if unread
    if (!msg.isRead) {
      try {
        await fetch(`/api/admin/messages/${msg._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isRead: true })
        });
        // Optimistic local update
        setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: true } : m));
        setSelectedMsg({ ...msg, isRead: true });
      } catch (e) {
        console.error("Failed to mark as read");
      }
    }
  };

  const saveNote = async () => {
    if (!selectedMsg) return;
    try {
      const res = await fetch(`/api/admin/messages/${selectedMsg._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNote })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Note saved');
        fetchMessages();
      }
    } catch (e) {
      toast.error('Failed to save note');
    }
  };

  const updateMessage = async (id: string, updates: any) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        toast.success('Message updated');
        fetchMessages();
        if (selectedMsg && selectedMsg._id === id) {
          setSelectedMsg({ ...selectedMsg, ...updates });
        }
      }
    } catch (e) {
      toast.error('Update failed');
    }
  };

  const executeDelete = async () => {
    if (!msgToDelete) return;
    try {
      const res = await fetch(`/api/admin/messages/${msgToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Message deleted');
        fetchMessages();
      }
    } catch(e) {
      toast.error('Delete failed');
    } finally {
      setIsDeleteDialogOpen(false);
      setMsgToDelete(null);
      if (selectedMsg && selectedMsg._id === msgToDelete) setIsDrawerOpen(false);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Sender',
      render: (item: any) => (
        <div>
          <div className={`font-medium ${!item.isRead ? 'text-[#E6EDF3] font-bold' : 'text-[#8B949E]'}`}>
            {item.name}
          </div>
          <div className="text-xs text-[#8B949E] mt-0.5">{item.email}</div>
        </div>
      )
    },
    {
      key: 'subject',
      header: 'Subject & Preview',
      render: (item: any) => (
        <div className="max-w-md">
          <div className={`text-sm truncate ${!item.isRead ? 'text-[#E6EDF3] font-semibold' : 'text-[#8B949E]'}`}>
            {item.subject}
          </div>
          <div className="text-xs text-[#656D76] truncate mt-0.5">{item.message}</div>
        </div>
      )
    },
    {
      key: 'createdAt',
      header: 'Received',
      render: (item: any) => (
        <div className="text-[#8B949E] text-sm">
          {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (item: any) => (
        <div className="flex items-center space-x-2 border-l border-[#30363D] pl-4">
          <button 
            onClick={() => openMessage(item)}
            className="p-1.5 bg-[#21262D] text-[#8B949E] hover:text-[#C9A84C] hover:bg-[#30363D] rounded-md transition-colors tooltip-wrapper"
            title="Read Message"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => updateMessage(item._id, { isArchived: !item.isArchived })}
            className={`p-1.5 rounded-md transition-colors tooltip-wrapper ${
              item.isArchived 
                ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' 
                : 'bg-[#21262D] text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#30363D]'
            }`}
            title={item.isArchived ? "Unarchive" : "Archive"}
          >
            <Archive className="w-4 h-4" />
          </button>

          <button 
            onClick={() => { setMsgToDelete(item._id); setIsDeleteDialogOpen(true); }}
            className="p-1.5 bg-red-500/5 text-red-400 opacity-50 hover:opacity-100 hover:bg-red-500/10 rounded-md transition-all ml-1"
            title="Delete"
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
          <h1 className="text-2xl font-semibold text-[#E6EDF3]">Inbox</h1>
          <p className="text-[#8B949E] text-sm mt-1">Manage contact inquiries and customer messages.</p>
        </div>
        
        <RefreshIndicator 
          lastUpdated={lastUpdated}
          isRefreshing={isRefreshing}
          isPaused={isPaused}
          onManualRefresh={refresh}
          onPause={pause}
          onResume={resume}
          intervalSeconds={15}
        />
      </div>


      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 pt-2">
        <div className="flex overflow-x-auto border-b border-[#30363D] custom-scrollbar flex-1 mr-4">
          {[
            { id: 'all', label: 'All Messages' },
            { id: 'unread', label: 'Unread' },
            { id: 'archived', label: 'Archived' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                filter === tab.id
                  ? 'border-[#C9A84C] text-[#C9A84C]'
                  : 'border-transparent text-[#8B949E] hover:text-[#E6EDF3] hover:border-[#484F58]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="w-full sm:w-64 shrink-0 pb-1">
          <SearchInput 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search inbox..."
          />
        </div>
      </div>

      <DataTable 
        data={messages}
        columns={columns}
        keyExtractor={(item) => item._id}
        isLoading={isLoading}
        rowHeaderClass="bg-[#0D0F14] border-b border-[#30363D]"
        emptyState={
          <EmptyState 
            title="Inbox Zero" 
            description="You have no messages matching these criteria."
            icon="document"
          />
        }
      />

      {/* Message Reader Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Read Message">
        {selectedMsg && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#21262D]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#21262D] border border-[#30363D] flex items-center justify-center text-[#E6EDF3] font-semibold">
                  {selectedMsg.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-[#E6EDF3] leading-tight">{selectedMsg.name}</h3>
                  <a href={`mailto:${selectedMsg.email}`} className="text-sm text-[#C9A84C] hover:underline">
                    {selectedMsg.email}
                  </a>
                </div>
              </div>
              <div className="text-right flex flex-col items-end text-xs text-[#8B949E]">
                <span>{new Date(selectedMsg.createdAt).toLocaleDateString()}</span>
                <span>{new Date(selectedMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-[#E6EDF3] text-lg mb-4">{selectedMsg.subject}</h4>
              <div className="bg-[#111318] p-5 rounded-xl border border-[#21262D] text-[#E6EDF3] text-sm leading-relaxed whitespace-pre-wrap">
                {selectedMsg.message}
              </div>
            </div>

            <div className="pt-6 border-t border-[#21262D]">
              <h4 className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-2">Admin Notes (Internal)</h4>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add private investigation notes..."
                className="w-full bg-[#0D0F14] border border-[#30363D] rounded-lg p-3 text-sm text-[#E6EDF3] focus:ring-1 focus:ring-[#C9A84C] min-h-[100px] mb-3"
              />
              <div className="flex justify-between items-center">
                <button
                  onClick={() => updateMessage(selectedMsg._id, { isReplied: !selectedMsg.isReplied })}
                  className={`flex items-center space-x-2 text-sm ${selectedMsg.isReplied ? 'text-emerald-500' : 'text-[#8B949E] hover:text-[#E6EDF3]'}`}
                >
                  <Reply className="w-4 h-4" />
                  <span>{selectedMsg.isReplied ? 'Marked as Replied' : 'Mark as Replied'}</span>
                </button>
                <button
                  onClick={saveNote}
                  className="px-4 py-2 bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] text-sm font-medium rounded-lg transition-colors"
                >
                  Save Note
                </button>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end pt-4">
                <a 
                  href={`mailto:${selectedMsg.email}?subject=RE: ${encodeURIComponent(selectedMsg.subject)}`}
                  className="flex items-center px-4 py-2 bg-[#C9A84C] hover:bg-[#E2C068] text-[#0D0F14] text-sm font-medium rounded-lg transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Reply in Email App
                </a>
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={executeDelete}
        title="Delete Message"
        description="Are you sure you want to permanently delete this message?"
        confirmText="Yes, delete it"
      />
    </div>
  );
}
