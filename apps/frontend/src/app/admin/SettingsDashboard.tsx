import React, { useState } from 'react';
import { Store, Truck, MapPin, Tag, CreditCard, Mail, Bell, Shield, MessageSquare, BarChart } from 'lucide-react';

interface SettingsDashboardProps {
  siteSettings: any;
  updateSetting: (key: string, field: string, value: any) => void;
  handleSaveSettings: () => void;
  savingSettings: boolean;
}

export default function SettingsDashboard({ siteSettings, updateSetting, handleSaveSettings, savingSettings }: SettingsDashboardProps) {
  const [activeTab, setActiveTab] = useState('General');
  const [isAddingCity, setIsAddingCity] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [addingAreaToCityIndex, setAddingAreaToCityIndex] = useState<number | null>(null);
  const [newAreaName, setNewAreaName] = useState('');

  const tabs = [
    { name: 'General', icon: Store },
    { name: 'Shipping & Delivery', icon: Truck },
    { name: 'Delivery Areas', icon: MapPin },
    { name: 'Coupons & Discounts', icon: Tag },
    { name: 'Payments', icon: CreditCard },
    { name: 'Emails & Marketing', icon: Mail },
    { name: 'Notifications', icon: Bell },
    { name: 'Security', icon: Shield },
    { name: 'AI Chatbot', icon: MessageSquare },
    { name: 'Stats Strip', icon: BarChart },
  ];

  const generalSettings = siteSettings?.GENERAL_SETTINGS || {};

  const updateGeneralSetting = (field: string, value: any) => {
    updateSetting('GENERAL_SETTINGS', field, value);
  };

  const aiSettings = siteSettings?.AI_CHATBOT_SETTINGS || {};
  const updateAiSetting = (field: string, value: any) => {
    updateSetting('AI_CHATBOT_SETTINGS', field, value);
  };

  const deliveryAreas = siteSettings?.DELIVERY_AREAS_SETTINGS || [];
  
  const handleAddCitySubmit = () => {
    if (newCityName.trim()) {
      updateSetting('DELIVERY_AREAS_SETTINGS', '', [...deliveryAreas, { city: newCityName.trim(), areas: [] }]);
      setNewCityName('');
      setIsAddingCity(false);
    }
  };

  const handleRemoveCity = (cityIndex: number) => {
    if (confirm('Are you sure you want to remove this city?')) {
      const updated = deliveryAreas.filter((_: any, i: number) => i !== cityIndex);
      updateSetting('DELIVERY_AREAS_SETTINGS', '', updated);
    }
  };

  const handleAddAreaSubmit = (cityIndex: number) => {
    if (newAreaName.trim()) {
      const updated = [...deliveryAreas];
      updated[cityIndex].areas.push(newAreaName.trim());
      updateSetting('DELIVERY_AREAS_SETTINGS', '', updated);
      setNewAreaName('');
      setAddingAreaToCityIndex(null);
    }
  };

  const handleRemoveArea = (cityIndex: number, areaIndex: number) => {
    const updated = [...deliveryAreas];
    updated[cityIndex].areas = updated[cityIndex].areas.filter((_: any, i: number) => i !== areaIndex);
    updateSetting('DELIVERY_AREAS_SETTINGS', '', updated);
  };

  return (
    <div className="w-full bg-rig-surface text-rig-text rounded-2xl flex flex-col md:flex-row font-sans min-h-[700px]">
      
      {/* Sidebar */}
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-rig-border p-4 flex flex-row md:flex-col gap-2 overflow-x-auto hide-scroll-on-desktop md:overflow-visible">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === tab.name
                ? 'bg-rig-background shadow-sm text-rig-text border border-rig-border'
                : 'text-rig-muted hover:text-rig-text hover:bg-rig-background border border-transparent'
            }`}
          >
            <tab.icon size={18} className={activeTab === tab.name ? "text-rig-primary" : "text-rig-muted"} />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-3xl">
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-rig-text">{activeTab}</h2>
            <p className="text-sm text-rig-muted mt-1">Manage your store preferences and integrations</p>
          </div>

          {activeTab === 'General' ? (
            <div className="space-y-8 bg-rig-background border border-rig-border rounded-2xl p-4 sm:p-8 shadow-sm">
              
              {/* Store Details */}
              <div>
                <h3 className="text-lg font-bold text-rig-text mb-6 border-b border-rig-border pb-2">Store Details</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-rig-muted block">Store Name</label>
                    <input 
                      value={generalSettings.storeName || ''}
                      onChange={(e) => updateGeneralSetting('storeName', e.target.value)}
                      placeholder="e.g. RigStore"
                      className="w-full bg-rig-surface border border-rig-border rounded-xl px-4 py-3 text-rig-text font-medium outline-none focus:border-rig-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-rig-muted block">Support Email</label>
                    <input 
                      value={generalSettings.supportEmail || ''}
                      onChange={(e) => updateGeneralSetting('supportEmail', e.target.value)}
                      placeholder="support@rigstore.com"
                      className="w-full bg-rig-surface border border-rig-border rounded-xl px-4 py-3 text-rig-text font-medium outline-none focus:border-rig-primary transition-colors"
                    />
                    <p className="text-xs text-rig-muted mt-1">This email will be used to send order confirmations and customer support replies.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-rig-muted block">Navbar Phone Number</label>
                    <input 
                      value={generalSettings.navbarPhone ?? '0326-2147419'}
                      onChange={(e) => updateGeneralSetting('navbarPhone', e.target.value)}
                      placeholder="0326-2147419"
                      className="w-full bg-rig-surface border border-rig-border rounded-xl px-4 py-3 text-rig-text font-medium outline-none focus:border-rig-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-rig-muted block">Navbar Location</label>
                    <input 
                      value={generalSettings.navbarLocation ?? 'Karachi, Pakistan'}
                      onChange={(e) => updateGeneralSetting('navbarLocation', e.target.value)}
                      placeholder="Karachi, Pakistan"
                      className="w-full bg-rig-surface border border-rig-border rounded-xl px-4 py-3 text-rig-text font-medium outline-none focus:border-rig-primary transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Store Currency */}
              <div>
                <h3 className="text-lg font-bold text-rig-text mb-6 border-b border-rig-border pb-2">Store Currency</h3>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-rig-muted block">Currency</label>
                  <select 
                    value={generalSettings.currency || 'PKR'}
                    onChange={(e) => updateGeneralSetting('currency', e.target.value)}
                    className="w-full bg-rig-surface border border-rig-border rounded-xl px-4 py-3 text-rig-text font-medium outline-none focus:border-rig-primary transition-colors cursor-pointer appearance-none"
                  >
                    <option value="PKR">PKR (Rs) - Pakistani Rupee</option>
                    <option value="USD">USD ($) - US Dollar</option>
                  </select>
                </div>
              </div>

              {/* Global Promos & Settings */}
              <div>
                <h3 className="text-lg font-bold text-rig-text mb-6 border-b border-rig-border pb-2">Global Promos & Settings</h3>
                <div className="p-6 border-2 border-dashed border-rig-border rounded-xl text-center text-rig-muted font-medium text-sm">
                  Promo settings have been moved to the Customizations tab.
                </div>
              </div>



            </div>
          ) : activeTab === 'Shipping & Delivery' ? (
             <div className="bg-rig-background border border-rig-border rounded-2xl p-4 sm:p-8 shadow-sm">
                <h3 className="text-lg font-bold text-rig-text mb-6 border-b border-rig-border pb-2">Shipping Configuration</h3>
                <div className="space-y-6 max-w-xl">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-rig-muted block">Flat Shipping Rate</label>
                    <input 
                      type="number"
                      value={generalSettings.shippingRate || 0}
                      onChange={(e) => updateGeneralSetting('shippingRate', parseInt(e.target.value) || 0)}
                      placeholder="e.g. 500"
                      className="w-full bg-rig-surface border border-rig-border rounded-xl px-4 py-3 text-rig-text font-medium outline-none focus:border-rig-primary transition-colors"
                    />
                    <p className="text-xs text-rig-muted mt-1">This flat rate will be added to the customer's total at checkout.</p>
                  </div>
                </div>
             </div>
          ) : activeTab === 'AI Chatbot' ? (
            <div className="bg-rig-background border border-rig-border rounded-2xl p-4 sm:p-8 shadow-sm">
               <h3 className="text-lg font-bold text-rig-text mb-6 border-b border-rig-border pb-2">AI Chatbot Configuration</h3>
               <div className="space-y-6 max-w-xl">
                 
                 <div className="flex items-center justify-between p-4 bg-rig-surface border border-rig-border rounded-xl">
                   <div>
                     <div className="font-bold text-rig-text">Enable AI Chatbot</div>
                     <div className="text-sm text-rig-muted">Show the floating chat widget on the website.</div>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input type="checkbox" className="sr-only peer" checked={aiSettings.enabled || false} onChange={(e) => updateAiSetting('enabled', e.target.checked)} />
                     <div className="w-11 h-6 bg-rig-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rig-primary"></div>
                   </label>
                 </div>

                 <div className="space-y-2">
                   <label className="text-sm font-bold text-rig-muted block">Gemini API Key</label>
                   <input 
                     type="password"
                     value={aiSettings.apiKey || ''}
                     onChange={(e) => updateAiSetting('apiKey', e.target.value)}
                     placeholder="AIzaSy..."
                     className="w-full bg-rig-surface border border-rig-border rounded-xl px-4 py-3 text-rig-text font-medium outline-none focus:border-rig-primary transition-colors"
                   />
                   <p className="text-xs text-rig-muted mt-1">Get your free API key from Google AI Studio.</p>
                 </div>

                 <div className="space-y-2">
                   <label className="text-sm font-bold text-rig-muted block">Bot Name</label>
                   <input 
                     type="text"
                     value={aiSettings.botName || 'RigBot'}
                     onChange={(e) => updateAiSetting('botName', e.target.value)}
                     placeholder="e.g. RigBot"
                     className="w-full bg-rig-surface border border-rig-border rounded-xl px-4 py-3 text-rig-text font-medium outline-none focus:border-rig-primary transition-colors"
                   />
                 </div>

                 <div className="space-y-2">
                   <label className="text-sm font-bold text-rig-muted block">Welcome Message</label>
                   <textarea 
                     value={aiSettings.welcomeMessage || 'Hi there! I am your AI assistant. How can I help you today?'}
                     onChange={(e) => updateAiSetting('welcomeMessage', e.target.value)}
                     className="w-full bg-rig-surface border border-rig-border rounded-xl px-4 py-3 text-rig-text font-medium outline-none focus:border-rig-primary transition-colors h-24 resize-none"
                   />
                 </div>

               </div>
            </div>
          ) : activeTab === 'Delivery Areas' ? (
            <div className="bg-rig-background border border-rig-border rounded-2xl p-4 sm:p-8 shadow-sm">
               <div className="flex items-center justify-between mb-6 border-b border-rig-border pb-4">
                 <h3 className="text-lg font-bold text-rig-text">Delivery Areas</h3>
                 {!isAddingCity && (
                   <button onClick={() => setIsAddingCity(true)} className="bg-rig-primary px-4 py-2 rounded-lg text-white font-bold text-sm hover:bg-rig-primary/90 transition-colors">
                     + Add City
                   </button>
                 )}
               </div>

               {isAddingCity && (
                 <div className="mb-6 bg-rig-surface border border-rig-border p-4 rounded-xl flex items-center gap-3">
                   <input
                     autoFocus
                     type="text"
                     value={newCityName}
                     onChange={(e) => setNewCityName(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleAddCitySubmit()}
                     placeholder="Enter city name (e.g. Karachi)"
                     className="flex-1 bg-rig-background border border-rig-border rounded-lg px-4 py-2 text-sm text-rig-text focus:outline-none focus:border-rig-primary"
                   />
                   <button onClick={handleAddCitySubmit} className="bg-rig-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-rig-primary/90">
                     Save
                   </button>
                   <button onClick={() => { setIsAddingCity(false); setNewCityName(''); }} className="text-rig-muted hover:text-rig-text text-sm font-medium px-2">
                     Cancel
                   </button>
                 </div>
               )}
               
               {deliveryAreas.length === 0 ? (
                 <div className="text-center text-rig-muted py-8">
                   No cities added yet. Add a city to start configuring delivery areas.
                 </div>
               ) : (
                 <div className="space-y-6">
                   {deliveryAreas.map((cityObj: any, cityIndex: number) => (
                     <div key={cityIndex} className="bg-rig-surface border border-rig-border rounded-xl p-4">
                       <div className="flex items-center justify-between mb-4">
                         <h4 className="font-bold text-lg text-rig-text flex items-center gap-2">
                           <MapPin size={18} className="text-rig-primary" /> {cityObj.city}
                         </h4>
                         <div className="flex gap-2">
                           {addingAreaToCityIndex !== cityIndex && (
                             <button onClick={() => setAddingAreaToCityIndex(cityIndex)} className="text-xs bg-rig-background border border-rig-border px-3 py-1.5 rounded-lg text-rig-text hover:bg-rig-border/50">
                               + Add Area
                             </button>
                           )}
                           <button onClick={() => handleRemoveCity(cityIndex)} className="text-xs bg-red-500/10 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-500/20">
                             Remove
                           </button>
                         </div>
                       </div>
                       
                       {addingAreaToCityIndex === cityIndex && (
                         <div className="mb-4 bg-rig-background border border-rig-border p-3 rounded-lg flex items-center gap-3">
                           <input
                             autoFocus
                             type="text"
                             value={newAreaName}
                             onChange={(e) => setNewAreaName(e.target.value)}
                             onKeyDown={(e) => e.key === 'Enter' && handleAddAreaSubmit(cityIndex)}
                             placeholder="Enter area name"
                             className="flex-1 bg-transparent text-sm text-rig-text focus:outline-none"
                           />
                           <button onClick={() => handleAddAreaSubmit(cityIndex)} className="text-rig-primary font-bold text-sm">Save</button>
                           <button onClick={() => { setAddingAreaToCityIndex(null); setNewAreaName(''); }} className="text-rig-muted text-sm">Cancel</button>
                         </div>
                       )}

                       <div className="flex flex-wrap gap-2">
                         {cityObj.areas && cityObj.areas.length > 0 ? (
                           cityObj.areas.map((area: string, areaIndex: number) => (
                             <div key={areaIndex} className="bg-rig-background border border-rig-border px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                               <span className="text-rig-muted">{area}</span>
                               <button onClick={() => handleRemoveArea(cityIndex, areaIndex)} className="text-red-500 hover:text-red-400 font-bold ml-1">×</button>
                             </div>
                           ))
                         ) : (
                           <div className="text-sm text-rig-muted italic">No areas added for {cityObj.city}.</div>
                         )}
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          ) : (
            <div className="bg-rig-background border border-rig-border rounded-2xl p-12 shadow-sm text-center">
              <div className="w-16 h-16 bg-rig-surface rounded-2xl flex items-center justify-center mx-auto mb-4 text-rig-muted border border-rig-border">
                <Store size={32} />
              </div>
              <h3 className="text-xl font-bold text-rig-text mb-2">Module Not Enabled</h3>
              <p className="text-rig-muted max-w-md mx-auto">
                The {activeTab} module is currently not enabled in your plan. Contact support to upgrade.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
