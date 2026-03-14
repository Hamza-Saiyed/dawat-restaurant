'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Store, Clock, Share2, Globe, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
      } else {
        toast.error('Failed to load settings');
      }
    } catch (e) {
      toast.error('Network Error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (section: string, field: string, value: any) => {
    setSettings((prev: any) => {
      // If it's a nested object like openingHours or socialLinks
      if (section && typeof prev[section] === 'object') {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        };
      }
      
      // Top level field
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Site settings updated successfully');
        setSettings(data.settings);
      } else {
        toast.error(data.error || 'Failed to save');
      }
    } catch (e) {
      toast.error('Network Error while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General Info', icon: Store },
    { id: 'hours', label: 'Opening Hours', icon: Clock },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'seo', label: 'SEO Config', icon: Globe },
    { id: 'hero', label: 'Hero Section', icon: LayoutDashboard },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#E6EDF3]">Site Settings</h1>
          <p className="text-[#8B949E] text-sm mt-1">Manage global website configurations and content.</p>
        </div>
        <button 
          onClick={saveSettings}
          disabled={isSaving}
          className="flex items-center px-4 py-2 bg-[#C9A84C] hover:bg-[#E2C068] disabled:opacity-70 text-[#0D0F14] text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col overflow-x-auto border-b border-[#30363D] md:border-b-0 custom-scrollbar pb-1 md:pb-0 gap-1 bg-[#161B22] border border-transparent md:border-[#21262D] rounded-xl p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 px-4 py-3 md:py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20'
                      : 'text-[#8B949E] hover:bg-[#1C2128] hover:text-[#E6EDF3] border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-[#161B22] border border-[#21262D] rounded-xl p-6 shadow-sm">
            
            {activeTab === 'general' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-lg font-semibold text-[#E6EDF3] border-b border-[#30363D] pb-3 mb-4">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#8B949E]">Restaurant Name</label>
                    <input 
                      type="text" 
                      value={settings.restaurantName || ''}
                      onChange={(e) => handleChange('', 'restaurantName', e.target.value)}
                      className="w-full bg-[#0D0F14] border border-[#30363D] rounded-lg p-2.5 text-sm text-[#E6EDF3] focus:ring-1 focus:ring-[#C9A84C]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#8B949E]">Contact Phone</label>
                    <input 
                      type="text" 
                      value={settings.phone || ''}
                      onChange={(e) => handleChange('', 'phone', e.target.value)}
                      className="w-full bg-[#0D0F14] border border-[#30363D] rounded-lg p-2.5 text-sm text-[#E6EDF3] focus:ring-1 focus:ring-[#C9A84C]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#8B949E]">Contact Email</label>
                    <input 
                      type="email" 
                      value={settings.email || ''}
                      onChange={(e) => handleChange('', 'email', e.target.value)}
                      className="w-full bg-[#0D0F14] border border-[#30363D] rounded-lg p-2.5 text-sm text-[#E6EDF3] focus:ring-1 focus:ring-[#C9A84C]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#8B949E]">Support WhatsApp</label>
                    <input 
                      type="text" 
                      value={settings.whatsappNumber || ''}
                      onChange={(e) => handleChange('', 'whatsappNumber', e.target.value)}
                      className="w-full bg-[#0D0F14] border border-[#30363D] rounded-lg p-2.5 text-sm text-[#E6EDF3] focus:ring-1 focus:ring-[#C9A84C]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#8B949E]">Physical Address</label>
                  <textarea 
                    value={settings.address || ''}
                    onChange={(e) => handleChange('', 'address', e.target.value)}
                    className="w-full bg-[#0D0F14] border border-[#30363D] rounded-lg p-2.5 text-sm text-[#E6EDF3] focus:ring-1 focus:ring-[#C9A84C] min-h-[80px]"
                  />
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-[#21262D] rounded-lg border border-[#30363D]">
                  <input
                    type="checkbox"
                    id="maintenance"
                    checked={settings.maintenanceMode || false}
                    onChange={(e) => handleChange('', 'maintenanceMode', e.target.checked)}
                    className="w-4 h-4 rounded border-[#484F58] bg-[#0D0F14] text-[#C9A84C] focus:ring-[#C9A84C]"
                  />
                  <div className="flex-1">
                    <label htmlFor="maintenance" className="text-sm font-medium text-[#E6EDF3] select-none cursor-pointer">
                      Enable Maintenance Mode
                    </label>
                    <p className="text-xs text-[#8B949E] mt-0.5">Temporarily hides the public website showing an under construction page.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hours' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-lg font-semibold text-[#E6EDF3] border-b border-[#30363D] pb-3 mb-4">Opening Hours</h2>
                <div className="space-y-4 max-w-lg">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                    <div key={day} className="flex items-center space-x-4">
                      <div className="w-24 text-sm font-medium text-[#E6EDF3] capitalize">{day}</div>
                      <input 
                        type="text" 
                        value={settings?.openingHours?.[day] || ''}
                        onChange={(e) => handleChange('openingHours', day, e.target.value)}
                        placeholder="e.g. 11:00 AM - 11:00 PM"
                        className="flex-1 bg-[#0D0F14] border border-[#30363D] rounded-lg p-2 text-sm text-[#E6EDF3] focus:ring-1 focus:ring-[#C9A84C]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-lg font-semibold text-[#E6EDF3] border-b border-[#30363D] pb-3 mb-4">Social Media Links</h2>
                <div className="space-y-4 max-w-xl">
                  {['instagram', 'facebook', 'twitter'].map((platform) => (
                    <div key={platform} className="space-y-2">
                      <label className="text-sm font-medium text-[#8B949E] capitalize">{platform} URL</label>
                      <input 
                        type="url" 
                        value={settings?.socialLinks?.[platform] || ''}
                        onChange={(e) => handleChange('socialLinks', platform, e.target.value)}
                        placeholder={`https://${platform}.com/dawat`}
                        className="w-full bg-[#0D0F14] border border-[#30363D] rounded-lg p-2.5 text-sm text-[#E6EDF3] focus:ring-1 focus:ring-[#C9A84C]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-lg font-semibold text-[#E6EDF3] border-b border-[#30363D] pb-3 mb-4">Search Engine Optimization</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#8B949E]">Meta Title</label>
                    <input 
                      type="text" 
                      value={settings.metaTitle || ''}
                      onChange={(e) => handleChange('', 'metaTitle', e.target.value)}
                      placeholder="Dawat Restaurant - Authentic Indian Cuisine"
                      className="w-full bg-[#0D0F14] border border-[#30363D] rounded-lg p-2.5 text-sm text-[#E6EDF3] focus:ring-1 focus:ring-[#C9A84C]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#8B949E]">Meta Description</label>
                    <textarea 
                      value={settings.metaDescription || ''}
                      onChange={(e) => handleChange('', 'metaDescription', e.target.value)}
                      className="w-full bg-[#0D0F14] border border-[#30363D] rounded-lg p-2.5 text-sm text-[#E6EDF3] focus:ring-1 focus:ring-[#C9A84C] min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hero' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-lg font-semibold text-[#E6EDF3] border-b border-[#30363D] pb-3 mb-4">Hero Section content</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#8B949E]">Headline</label>
                    <input 
                      type="text" 
                      value={settings?.heroSection?.headline || ''}
                      onChange={(e) => handleChange('heroSection', 'headline', e.target.value)}
                      className="w-full bg-[#0D0F14] border border-[#30363D] rounded-lg p-2.5 text-sm text-[#E6EDF3] focus:ring-1 focus:ring-[#C9A84C]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#8B949E]">Sub-headline (English)</label>
                    <input 
                      type="text" 
                      value={settings?.heroSection?.subheadline || ''}
                      onChange={(e) => handleChange('heroSection', 'subheadline', e.target.value)}
                      className="w-full bg-[#0D0F14] border border-[#30363D] rounded-lg p-2.5 text-sm text-[#E6EDF3] focus:ring-1 focus:ring-[#C9A84C]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#8B949E]">Sub-headline (Hindi)</label>
                    <input 
                      type="text" 
                      value={settings?.heroSection?.subheadlineHindi || ''}
                      onChange={(e) => handleChange('heroSection', 'subheadlineHindi', e.target.value)}
                      className="w-full bg-[#0D0F14] border border-[#30363D] rounded-lg p-2.5 text-sm text-[#E6EDF3] focus:ring-1 focus:ring-[#C9A84C]"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
