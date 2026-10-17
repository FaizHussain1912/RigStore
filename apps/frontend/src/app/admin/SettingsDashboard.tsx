import React, { useState, useEffect } from 'react';
import { Store, Truck, MapPin, Tag, CreditCard, Mail, Bell, Shield, MessageSquare, BarChart, Plus, Trash2, CheckCircle2, AlertCircle, RefreshCw, X } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';

interface SettingsDashboardProps {
  siteSettings: any;
  updateSetting: (key: string, field: string, value: any) => void;
  handleSaveSettings: () => void;
  savingSettings: boolean;
}

export default function SettingsDashboard({ siteSettings, updateSetting, handleSaveSettings, savingSettings }: SettingsDashboardProps) {
  const { token } = useAuth();
  const { toast } = useToast();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767';

  const [activeTab, setActiveTab] = useState('General');
  const [isAddingCity, setIsAddingCity] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [addingAreaToCityIndex, setAddingAreaToCityIndex] = useState<number | null>(null);
  const [newAreaName, setNewAreaName] = useState('');

  // Coupons State
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [submittingCoupon, setSubmittingCoupon] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minOrderAmount: 0,
    maxDiscount: '',
    expiresAt: ''
  });

  const tabs = [
    { name: 'General', icon: Store },
    { name: 'Shipping & Delivery', icon: Truck },
    { name: 'Delivery Areas', icon: MapPin },
    { name: 'Coupons & Discounts', icon: Tag },
    { name: 'Payments', icon: CreditCard },
    { name: 'AI Chatbot', icon: MessageSquare },
    { name: 'Emails & Marketing', icon: Mail },
    { name: 'Notifications', icon: Bell },
    { name: 'Security', icon: Shield },
    { name: 'Stats Strip', icon: BarChart },
  ];

  const generalSettings = siteSettings?.GENERAL_SETTINGS || {};
  const updateGeneralSetting = (field: string, value: any) => {
    updateSetting('GENERAL_SETTINGS', field, value);
  };

  const paymentSettings = siteSettings?.PAYMENT_SETTINGS || {};
  const updatePaymentSetting = (field: string, value: any) => {
    updateSetting('PAYMENT_SETTINGS', field, value);
  };

  const aiSettings = siteSettings?.AI_CHATBOT_SETTINGS || {};
  const updateAiSetting = (field: string, value: any) => {
    updateSetting('AI_CHATBOT_SETTINGS', field, value);
  };

  const deliveryAreas = siteSettings?.DELIVERY_AREAS_SETTINGS || [];

  // Fetch Coupons when tab is opened
  useEffect(() => {
    if (activeTab === 'Coupons & Discounts' && token) {
      fetchCoupons();
    }
  }, [activeTab, token]);

  const fetchCoupons = async () => {
    setLoadingCoupons(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/coupons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setCoupons(await res.json());
      }
    } catch (err) {
      console.error('Fetch coupons error:', err);
    } finally {
      setLoadingCoupons(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) {
      toast('Coupon code is required', 'error');
      return;
    }
    setSubmittingCoupon(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/coupons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          code: newCoupon.code.trim().toUpperCase(),
          discountType: newCoupon.discountType,
          discountValue: parseFloat(String(newCoupon.discountValue)) || 0,
          minOrderAmount: parseFloat(String(newCoupon.minOrderAmount)) || 0,
          maxDiscount: newCoupon.maxDiscount ? parseFloat(String(newCoupon.maxDiscount)) : null,
          expiresAt: newCoupon.expiresAt ? new Date(newCoupon.expiresAt).toISOString() : null
        })
      });

      if (res.ok) {
        toast('Coupon created successfully!', 'success');
        setShowAddCoupon(false);
        setNewCoupon({
          code: '',
          discountType: 'PERCENTAGE',
          discountValue: 10,
          minOrderAmount: 0,
          maxDiscount: '',
          expiresAt: ''
        });
        fetchCoupons();
      } else {
        const data = await res.json().catch(() => null);
        toast(data?.error || 'Failed to create coupon', 'error');
      }
    } catch (err) {
      toast('Network error creating coupon', 'error');
    } finally {
      setSubmittingCoupon(false);
    }
  };

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon "${code}"?`)) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/coupons/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast(`Coupon ${code} deleted`, 'success');
        setCoupons(coupons.filter(c => c.id !== id));
      } else {
        toast('Failed to delete coupon', 'error');
      }
    } catch (err) {
      toast('Error deleting coupon', 'error');
    }
  };
  
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
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-rig-border p-4 flex flex-row md:flex-col gap-2 overflow-x-auto hide-scroll-on-desktop md:overflow-visible shrink-0">
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
            <p className="text-sm text-rig-muted mt-1">Manage your store preferences, marketing promotions, and checkout configurations.</p>
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

            </div>
          ) : activeTab === 'Shipping & Delivery' ? (
             <div className="bg-rig-background border border-rig-border rounded-2xl p-4 sm:p-8 shadow-sm">
                <h3 className="text-lg font-bold text-rig-text mb-6 border-b border-rig-border pb-2">Shipping Configuration</h3>
                <div className="space-y-6 max-w-xl">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-rig-muted block">Flat Shipping Rate (Rs.)</label>
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
          ) : activeTab === 'Coupons & Discounts' ? (
            <div className="space-y-6 bg-rig-background border border-rig-border rounded-2xl p-4 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-rig-border pb-4">
                <div>
                  <h3 className="text-lg font-bold text-rig-text">Discount Codes & Coupons</h3>
                  <p className="text-xs text-rig-muted mt-0.5">Manage active promo codes available for customers at checkout</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={fetchCoupons} 
                    className="p-2 bg-rig-surface border border-rig-border hover:border-rig-primary rounded-xl text-rig-muted hover:text-rig-text transition-colors"
                    title="Refresh coupons"
                  >
                    <RefreshCw size={16} className={loadingCoupons ? "animate-spin" : ""} />
                  </button>
                  <button 
                    onClick={() => setShowAddCoupon(!showAddCoupon)}
                    className="bg-rig-primary hover:bg-rig-primary/90 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors text-sm shadow-sm"
                  >
                    <Plus size={16} /> Create Coupon
                  </button>
                </div>
              </div>

              {/* Add Coupon Form */}
              {showAddCoupon && (
                <form onSubmit={handleCreateCoupon} className="bg-rig-surface border border-rig-border p-6 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center border-b border-rig-border pb-3">
                    <h4 className="font-bold text-rig-text text-sm uppercase tracking-wider">New Coupon Setup</h4>
                    <button type="button" onClick={() => setShowAddCoupon(false)} className="text-rig-muted hover:text-rig-text">
                      <X size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-rig-muted">Coupon Code *</label>
                      <input 
                        required
                        placeholder="e.g. SUMMER25"
                        value={newCoupon.code}
                        onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                        className="w-full bg-rig-background border border-rig-border rounded-xl px-3 py-2 text-sm text-rig-text font-mono font-bold outline-none focus:border-rig-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-rig-muted">Discount Type</label>
                      <select 
                        value={newCoupon.discountType}
                        onChange={e => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                        className="w-full bg-rig-background border border-rig-border rounded-xl px-3 py-2 text-sm text-rig-text outline-none focus:border-rig-primary"
                      >
                        <option value="PERCENTAGE">Percentage (%) Off</option>
                        <option value="FIXED">Fixed Amount (Rs.) Off</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-rig-muted">
                        Discount Value {newCoupon.discountType === 'PERCENTAGE' ? '(%)' : '(Rs.)'} *
                      </label>
                      <input 
                        required
                        type="number"
                        step="0.01"
                        placeholder={newCoupon.discountType === 'PERCENTAGE' ? '10' : '500'}
                        value={newCoupon.discountValue}
                        onChange={e => setNewCoupon({ ...newCoupon, discountValue: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-rig-background border border-rig-border rounded-xl px-3 py-2 text-sm text-rig-text outline-none focus:border-rig-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-rig-muted">Min Order Amount (Rs.)</label>
                      <input 
                        type="number"
                        placeholder="0 for none"
                        value={newCoupon.minOrderAmount}
                        onChange={e => setNewCoupon({ ...newCoupon, minOrderAmount: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-rig-background border border-rig-border rounded-xl px-3 py-2 text-sm text-rig-text outline-none focus:border-rig-primary"
                      />
                    </div>
                    {newCoupon.discountType === 'PERCENTAGE' && (
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-rig-muted">Max Discount Cap (Rs., optional)</label>
                        <input 
                          type="number"
                          placeholder="e.g. 2000"
                          value={newCoupon.maxDiscount}
                          onChange={e => setNewCoupon({ ...newCoupon, maxDiscount: e.target.value })}
                          className="w-full bg-rig-background border border-rig-border rounded-xl px-3 py-2 text-sm text-rig-text outline-none focus:border-rig-primary"
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-rig-muted">Expiry Date (optional)</label>
                      <input 
                        type="date"
                        value={newCoupon.expiresAt}
                        onChange={e => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
                        className="w-full bg-rig-background border border-rig-border rounded-xl px-3 py-2 text-sm text-rig-text outline-none focus:border-rig-primary"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setShowAddCoupon(false)} 
                      className="px-4 py-2 text-xs font-medium text-rig-muted hover:text-rig-text"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={submittingCoupon}
                      className="bg-rig-primary hover:bg-rig-primary/90 text-white px-5 py-2 rounded-xl text-xs font-bold disabled:opacity-50 transition-colors"
                    >
                      {submittingCoupon ? 'Saving...' : 'Add Coupon'}
                    </button>
                  </div>
                </form>
              )}

              {/* Coupons List */}
              {loadingCoupons ? (
                <div className="flex justify-center py-12">
                  <div className="w-6 h-6 border-2 border-rig-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : coupons.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-rig-border rounded-xl text-rig-muted">
                  <Tag className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="font-semibold text-sm">No coupons found</p>
                  <p className="text-xs mt-1">Create your first coupon using the button above.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-rig-border">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-rig-surface border-b border-rig-border">
                      <tr>
                        <th className="p-3 text-xs uppercase font-bold text-rig-muted">Code</th>
                        <th className="p-3 text-xs uppercase font-bold text-rig-muted">Discount</th>
                        <th className="p-3 text-xs uppercase font-bold text-rig-muted">Min Order</th>
                        <th className="p-3 text-xs uppercase font-bold text-rig-muted">Expiry</th>
                        <th className="p-3 text-xs uppercase font-bold text-rig-muted text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rig-border/50">
                      {coupons.map((coupon) => (
                        <tr key={coupon.id} className="hover:bg-rig-surface/40 transition-colors">
                          <td className="p-3">
                            <span className="font-mono font-bold bg-rig-primary/10 text-rig-primary border border-rig-primary/20 px-2.5 py-1 rounded-md text-xs">
                              {coupon.code}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-rig-text">
                            {coupon.discountType === 'PERCENTAGE'
                              ? `${coupon.discountValue}% OFF`
                              : `Rs. ${coupon.discountValue.toLocaleString()} FLAT`}
                            {coupon.maxDiscount && (
                              <span className="block text-[11px] text-rig-muted font-normal">Max: Rs. {coupon.maxDiscount.toLocaleString()}</span>
                            )}
                          </td>
                          <td className="p-3 text-rig-muted text-xs">
                            {coupon.minOrderAmount > 0 ? `Rs. ${coupon.minOrderAmount.toLocaleString()}` : 'None'}
                          </td>
                          <td className="p-3 text-rig-muted text-xs">
                            {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                              className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete coupon"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : activeTab === 'Payments' ? (
            <div className="space-y-6 bg-rig-background border border-rig-border rounded-2xl p-4 sm:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-rig-text mb-4 border-b border-rig-border pb-2">Payment Methods Setup</h3>
              
              {/* Cash on Delivery */}
              <div className="bg-rig-surface border border-rig-border p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-rig-text">Cash on Delivery (COD)</h4>
                    <p className="text-xs text-rig-muted">Allow customers nationwide to pay in cash upon package arrival.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={paymentSettings.codEnabled ?? true} 
                      onChange={(e) => updatePaymentSetting('codEnabled', e.target.checked)} 
                    />
                    <div className="w-11 h-6 bg-rig-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rig-primary"></div>
                  </label>
                </div>
              </div>

              {/* Bank Transfer / Digital Wallet */}
              <div className="bg-rig-surface border border-rig-border p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-rig-border pb-4">
                  <div>
                    <h4 className="font-bold text-rig-text">Direct Bank Transfer / IBFT / Raast</h4>
                    <p className="text-xs text-rig-muted">Show bank account info on checkout for direct wire transfer.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={paymentSettings.bankTransferEnabled ?? true} 
                      onChange={(e) => updatePaymentSetting('bankTransferEnabled', e.target.checked)} 
                    />
                    <div className="w-11 h-6 bg-rig-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rig-primary"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-rig-muted">Account Title</label>
                    <input 
                      value={paymentSettings.accountTitle || 'RigStore Official'}
                      onChange={(e) => updatePaymentSetting('accountTitle', e.target.value)}
                      placeholder="e.g. RigStore Computers"
                      className="w-full bg-rig-background border border-rig-border rounded-xl px-3 py-2 text-sm text-rig-text outline-none focus:border-rig-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-rig-muted">Bank Name</label>
                    <input 
                      value={paymentSettings.bankName || 'Meezan Bank Ltd'}
                      onChange={(e) => updatePaymentSetting('bankName', e.target.value)}
                      placeholder="e.g. Meezan Bank, EasyPaisa, SadaPay"
                      className="w-full bg-rig-background border border-rig-border rounded-xl px-3 py-2 text-sm text-rig-text outline-none focus:border-rig-primary"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-rig-muted">Account Number / IBAN</label>
                    <input 
                      value={paymentSettings.accountNumber || 'PK36MEZN0001020304050607'}
                      onChange={(e) => updatePaymentSetting('accountNumber', e.target.value)}
                      placeholder="PK00 XXXX 0000 0000 0000 0000"
                      className="w-full bg-rig-background border border-rig-border rounded-xl px-3 py-2 text-sm font-mono text-rig-text outline-none focus:border-rig-primary"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-rig-muted">Payment Instructions Note</label>
                    <textarea 
                      rows={2}
                      value={paymentSettings.paymentNotes || 'Please send your payment screenshot to WhatsApp support 0316-2975195 with your Order ID.'}
                      onChange={(e) => updatePaymentSetting('paymentNotes', e.target.value)}
                      className="w-full bg-rig-background border border-rig-border rounded-xl px-3 py-2 text-sm text-rig-text outline-none focus:border-rig-primary resize-none"
                    />
                  </div>
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
              <h3 className="text-xl font-bold text-rig-text mb-2">{activeTab}</h3>
              <p className="text-rig-muted max-w-md mx-auto text-sm">
                This section is integrated and managed automatically according to your store configuration.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
