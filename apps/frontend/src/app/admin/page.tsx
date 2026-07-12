'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useCurrency } from '../CurrencyContext';
import LiveTrackingDashboard from './LiveTrackingDashboard';
import SettingsDashboard from './SettingsDashboard';
import { LayoutDashboard, Users, PackageSearch, Package, DollarSign, TrendingUp, AlertCircle, Plus, Edit, Trash2, Eye, Printer, Download, Search, Settings, Save, X, Filter, Box, ArrowUpRight, Copy } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const { user, token, isAdmin } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [inventorySearchTerm, setInventorySearchTerm] = useState('');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState('');
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [activeSettingsTab, setActiveSettingsTab] = useState('PROMO_BANNER');
  const [savingSettings, setSavingSettings] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean, title: string, message: string, onConfirm: () => void} | null>(null);
  const [viewOrderDetails, setViewOrderDetails] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '', sku: '', slug: '', brand: '', basePrice: 0, categoryId: '', 
    description: '', imageUrl: '', totalStock: 0, specs: '{}', compatibility: '{}'
  });
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('adminActiveTab');
      if (savedTab) setActiveTab(savedTab);
      
      const savedSettingsTab = localStorage.getItem('adminActiveSettingsTab');
      if (savedSettingsTab) setActiveSettingsTab(savedSettingsTab);
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') localStorage.setItem('adminActiveTab', tab);
  };

  const handleSettingsTabChange = (tab: string) => {
    setActiveSettingsTab(tab);
    if (typeof window !== 'undefined') localStorage.setItem('adminActiveSettingsTab', tab);
  };

  useEffect(() => {
    if (user && !isAdmin) {
      router.push('/');
      return;
    }

    if (!token) return;

    fetchData();
  }, [user, token, isAdmin, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'OVERVIEW') {
        const res = await fetch(`${API_URL}/api/admin/stats`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setStats(await res.json());
      } else if (activeTab === 'ORDERS') {
        const res = await fetch(`${API_URL}/api/admin/orders`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setOrders(await res.json());
      } else if (activeTab === 'INVENTORY') {
        const res = await fetch(`${API_URL}/api/admin/inventory`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setInventory(await res.json());
        const catRes = await fetch(`${API_URL}/api/admin/categories`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (catRes.ok) setCategories(await catRes.json());
      } else if (activeTab === 'USERS') {
        const res = await fetch(`${API_URL}/api/admin/users`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setUsers(await res.json());
      } else if (activeTab === 'PRODUCTS') {
        const res = await fetch(`${API_URL}/api/admin/products`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setProducts(await res.json());
        const catRes = await fetch(`${API_URL}/api/admin/categories`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (catRes.ok) setCategories(await catRes.json());
      } else if (activeTab === 'CUSTOMIZATION') {
        const res = await fetch(`${API_URL}/api/admin/settings`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setSiteSettings(await res.json());
        const catRes = await fetch(`${API_URL}/api/admin/categories`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (catRes.ok) setCategories(await catRes.json());
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(siteSettings)
      });
      if (!res.ok) toast('Failed to save settings', 'error');
      else toast('Settings saved successfully!', 'success');
    } catch (error) {
      console.error(error);
      toast('Error saving settings', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const updateSetting = (key: string, field: string, value: any) => {
    if (field === '') {
      setSiteSettings((prev: any) => ({
        ...prev,
        [key]: value
      }));
      return;
    }
    setSiteSettings((prev: any) => ({
      ...prev,
      [key]: {
        ...(prev?.[key] || {}),
        [field]: value
      }
    }));
  };

  const updateHomeBanner = (index: number, field: string, value: any) => {
    setSiteSettings((prev: any) => {
      const banners = Array.isArray(prev?.HOME_BANNER) ? [...prev.HOME_BANNER] : 
                      (prev?.HOME_BANNER && typeof prev?.HOME_BANNER === 'object' ? [prev.HOME_BANNER] : []);
      if (!banners[index]) banners[index] = {};
      banners[index] = { ...banners[index], [field]: value };
      return { ...prev, HOME_BANNER: banners };
    });
  };

  const updateBentoBlock = (index: number, field: string, value: any) => {
    setSiteSettings((prev: any) => {
      const blocks = Array.isArray(prev?.BENTO_GRID) ? [...prev.BENTO_GRID] : [];
      // Initialize if we don't have 5 blocks
      while (blocks.length < 5) {
        blocks.push({});
      }
      if (!blocks[index]) blocks[index] = {};
      blocks[index] = { ...blocks[index], [field]: value };
      return { ...prev, BENTO_GRID: blocks };
    });
  };

  const updateNavbarLink = (index: number, field: string, value: any) => {
    setSiteSettings((prev: any) => {
      const links = Array.isArray(prev?.HOMEPAGE_SIDEBAR) ? [...prev.HOMEPAGE_SIDEBAR] : [];
      if (!links[index]) links[index] = {};
      links[index] = { ...links[index], [field]: value };
      return { ...prev, HOMEPAGE_SIDEBAR: links };
    });
  };

  const addNavbarLink = () => {
    setSiteSettings((prev: any) => {
      const links = Array.isArray(prev?.HOMEPAGE_SIDEBAR) ? [...prev.HOMEPAGE_SIDEBAR] : [];
      links.push({ label: '', url: '' });
      return { ...prev, HOMEPAGE_SIDEBAR: links };
    });
  };

  const removeNavbarLink = (index: number) => {
    setSiteSettings((prev: any) => {
      const links = Array.isArray(prev?.HOMEPAGE_SIDEBAR) ? [...prev.HOMEPAGE_SIDEBAR] : [];
      links.splice(index, 1);
      return { ...prev, HOMEPAGE_SIDEBAR: links };
    });
  };

  const addHomeBanner = () => {
    setSiteSettings((prev: any) => {
      const banners = Array.isArray(prev?.HOME_BANNER) ? [...prev.HOME_BANNER] : 
                      (prev?.HOME_BANNER && typeof prev?.HOME_BANNER === 'object' ? [prev.HOME_BANNER] : []);
      banners.push({
        tagline: 'New Tagline',
        title1: 'New Title',
        title2: 'Highlighted Text',
        description: 'Banner description',
        priceText: 'Rs. 0',
        skuText: 'SKU: XXX'
      });
      return { ...prev, HOME_BANNER: banners };
    });
  };

  const removeHomeBanner = (index: number) => {
    setSiteSettings((prev: any) => {
      const banners = Array.isArray(prev?.HOME_BANNER) ? [...prev.HOME_BANNER] : [];
      banners.splice(index, 1);
      return { ...prev, HOME_BANNER: banners };
    });
  };

  const addTeamMember = () => {
    setSiteSettings((prev: any) => {
      const members = Array.isArray(prev?.TEAM_MEMBERS) ? [...prev.TEAM_MEMBERS] : [];
      members.push({
        name: 'New Member',
        initials: 'NM',
        role: 'Role',
        bgColor: '#3b82f6'
      });
      return { ...prev, TEAM_MEMBERS: members };
    });
  };

  const removeTeamMember = (index: number) => {
    setSiteSettings((prev: any) => {
      const members = Array.isArray(prev?.TEAM_MEMBERS) ? [...prev.TEAM_MEMBERS] : [];
      members.splice(index, 1);
      return { ...prev, TEAM_MEMBERS: members };
    });
  };

  const updateTeamMember = (index: number, field: string, value: any) => {
    setSiteSettings((prev: any) => {
      const members = Array.isArray(prev?.TEAM_MEMBERS) ? [...prev.TEAM_MEMBERS] : [];
      members[index] = { ...members[index], [field]: value };
      return { ...prev, TEAM_MEMBERS: members };
    });
  };


  const handleDeleteOrder = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Order',
      message: 'Are you sure you want to delete this order? This action cannot be undone.',
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          const res = await fetch(`${API_URL}/api/admin/orders/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            setOrders(orders.filter(o => o.id !== id));
            toast('Order deleted successfully', 'success');
          } else {
            const data = await res.json();
            toast(data.error || 'Failed to delete order', 'error');
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  const handlePrintOrder = (order: any) => {
    
    const itemsHtml = order.items?.map((item: any) => `
      <tr>
        <td>${item.product.name}</td>
        <td class="center">${item.quantity}</td>
        <td class="right">Rs ${(item.priceAtSale || item.product.basePrice || 0).toLocaleString()}</td>
        <td class="right bold">Rs ${((item.priceAtSale || item.product.basePrice || 0) * item.quantity).toLocaleString()}</td>
      </tr>
    `).join('') || '';

    const itemsSubtotal = order.items.reduce((sum: number, item: any) => sum + ((item.priceAtSale || item.product?.basePrice || 0) * item.quantity), 0);
    const shippingFee = order.totalAmount - itemsSubtotal;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            @page { margin: 0; size: A4; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              margin: 0; padding: 50px 60px; color: #333; font-size: 13px;
              -webkit-print-color-adjust: exact; print-color-adjust: exact;
            }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; }
            .brand { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
            .brand svg { width: 32px; height: 32px; color: #f97316; }
            .brand-text { font-size: 26px; font-weight: 800; color: #ef4444; margin: 0; letter-spacing: -0.5px; }
            .brand-sub { font-size: 11px; color: #64748b; margin: 0; }
            
            .qr-code { text-align: center; }
            .qr-code img { width: 80px; height: 80px; }
            .qr-text { font-size: 9px; color: #64748b; margin-top: 4px; font-weight: 500; }

            .invoice-title { font-size: 14px; font-weight: 800; color: #475569; letter-spacing: 1px; margin-bottom: 40px; }
            
            .info-section { display: flex; justify-content: space-between; margin-bottom: 50px; }
            .info-block { width: 45%; }
            .info-heading { font-size: 11px; font-weight: 800; color: #64748b; margin-bottom: 12px; }
            .info-row { margin-bottom: 8px; color: #475569; font-size: 12px; }
            .info-row strong { color: #0f172a; font-weight: 600; width: 120px; display: inline-block; }
            
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th { text-align: left; padding: 12px 8px; border-top: 2px solid #cbd5e1; border-bottom: 2px solid #cbd5e1; font-size: 11px; font-weight: 800; color: #475569; }
            th.center { text-align: center; }
            th.right, td.right { text-align: right; }
            td { padding: 16px 8px; border-bottom: 1px solid #f1f5f9; font-size: 12px; color: #334155; font-weight: 600; }
            td.bold { font-weight: 800; color: #0f172a; }

            .totals-section { display: flex; justify-content: space-between; margin-top: 20px; }
            .notes { width: 50%; font-size: 12px; color: #0f172a; font-weight: 700; }
            .notes span { color: #64748b; font-weight: 600; }
            .totals { width: 40%; }
            .total-row { display: flex; justify-content: flex-end; margin-bottom: 10px; gap: 40px; color: #64748b; font-size: 13px; font-weight: 500; }
            .total-row span:last-child { color: #475569; min-width: 80px; text-align: right; }
            .grand-total { font-weight: 800; font-size: 15px; color: #0f172a; margin-top: 20px; padding-top: 15px; display: flex; justify-content: flex-end; gap: 40px; }
            .grand-total span:last-child { color: #ef4444; min-width: 80px; text-align: right; }

            .footer { position: fixed; bottom: 40px; left: 60px; right: 60px; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; font-weight: 500; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <h1 class="brand-text">RigStore</h1>
              </div>
              <p class="brand-sub">Karachi, Pakistan | Support: 0316-2975195</p>
            </div>
            <div class="qr-code">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=RigStore-Order-${order.id}" alt="QR" />
              <div class="qr-text">Scan to Save Digital Copy</div>
            </div>
          </div>
          
          <div class="invoice-title">PACKING / INVOICE SLIP</div>
          
          <div class="info-section">
            <div class="info-block">
              <div class="info-heading">ORDER INFO</div>
              <div class="info-row"><strong>Order ID:</strong> ${(order.id || '').toUpperCase().slice(0, 8)}</div>
              <div class="info-row"><strong>Date:</strong> ${format(new Date(order.createdAt), 'MMMM d, yyyy')}</div>
              <div class="info-row"><strong>Payment Method:</strong> ${order.paymentMethod || 'Cash on Delivery'}</div>
            </div>
            <div class="info-block">
              <div class="info-heading">DELIVER TO</div>
              <div class="info-row"><strong>Name:</strong> ${order.user.name}</div>
              <div class="info-row"><strong>Phone:</strong> ${order.phone || 'N/A'}</div>
              <div class="info-row"><strong>Address:</strong> ${order.address || 'N/A'}</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>ITEM</th>
                <th class="center">QTY</th>
                <th class="right">PRICE</th>
                <th class="right">SUBTOTAL</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div class="totals-section">
            <div class="notes">Note: <span>${order.note || 'order'}</span></div>
            <div class="totals">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>Rs ${itemsSubtotal.toLocaleString()}</span>
              </div>
              <div class="total-row">
                <span>Shipping Fee:</span>
                <span>Rs ${shippingFee.toLocaleString()}</span>
              </div>
              <div class="grand-total">
                <span>Grand Total:</span>
                <span>Rs ${order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <span>https://rigstore.com/admin</span>
            <span>1/1</span>
          </div>

          <script>
            window.onload = () => {
              window.print();
            };
          </script>
        </body>
      </html>
    `;
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      
      // Cleanup after printing is done
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 10000); // 10s gives enough time for the print dialog to finish
    }
  };

  const updateStock = async (inventoryId: string, newStock: number) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/inventory/${inventoryId}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ totalStock: newStock })
      });
      if (res.ok) {
        setInventory(inventory.map(i => i.id === inventoryId ? { ...i, totalStock: newStock } : i));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditProduct = (p: any) => {
    setCurrentProduct(p);
    setFormData({
      name: p.name || '', 
      sku: p.sku || '', 
      slug: p.slug || '', 
      brand: p.brand || '', 
      basePrice: p.basePrice || 0, 
      categoryId: p.categoryId || '',
      description: p.description || '', 
      imageUrl: p.imageUrl || '', 
      totalStock: p.inventory?.totalStock || 0,
      specs: typeof p.specs === 'object' ? JSON.stringify(p.specs, null, 2) : (p.specs || '{}'), 
      compatibility: typeof p.compatibility === 'object' ? JSON.stringify(p.compatibility, null, 2) : (p.compatibility || '{}')
    });
    setShowProductForm(true);
  };

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setFormData({
      name: '', sku: '', slug: '', brand: '', basePrice: 0, categoryId: categories[0]?.id || '', 
      description: '', imageUrl: '', totalStock: 0, specs: '{}', compatibility: '{}'
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            setProducts(products.filter(p => p.id !== id));
            toast('Product deleted successfully', 'success');
          } else {
            const data = await res.json();
            toast(data.error || 'Failed to delete product', 'error');
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = currentProduct ? 'PUT' : 'POST';
      const url = currentProduct ? `${API_URL}/api/admin/products/${currentProduct.id}` : `${API_URL}/api/admin/products`;
      
      const payload = {
        ...formData,
        specs: JSON.parse(formData.specs || '{}'),
        compatibility: JSON.parse(formData.compatibility || '{}')
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowProductForm(false);
        fetchData();
        toast('Product saved successfully!', 'success');
      } else {
        const data = await res.json();
        toast(data.error || 'Failed to save product', 'error');
      }
    } catch (error) {
      console.error(error);
      toast('Invalid JSON in specs or compatibility, or network error.', 'error');
    }
  };

  const filteredOrders = orders.filter(o => {
    const term = orderSearchTerm.toLowerCase();
    const matchesSearch = !term || 
      o.id.toLowerCase().includes(term) || 
      o.user.name.toLowerCase().includes(term) ||
      o.user.email.toLowerCase().includes(term);
    const matchesStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportOrdersCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer Name', 'Customer Email', 'Items', 'Total', 'Status'];
    const rows = filteredOrders.map(o => [
      o.id,
      format(new Date(o.createdAt), 'MMM dd, yyyy'),
      o.user.name,
      o.user.email,
      o.items?.reduce((acc: number, i: any) => acc + i.quantity, 0) || 0,
      o.totalAmount,
      o.status
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + "\n" + rows.map(e => e.join(',')).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "rigstore_orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProducts = products.filter(p => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term || 
      p.name.toLowerCase().includes(term) || 
      p.sku.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term);
    const matchesCategory = !selectedCategoryFilter || p.categoryId === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (!isAdmin) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-rig-background">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-rig-surface border-b md:border-b-0 md:border-r border-rig-border flex flex-col shrink-0">
        <div className="p-6 border-b border-rig-border hidden md:block">
          <h2 className="text-xl font-bold text-rig-primary tracking-tight">RIGSTORE ADMIN</h2>
        </div>
        <nav className="flex flex-row md:flex-col p-4 space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto hide-scroll-on-desktop">
          <button onClick={() => handleTabChange('OVERVIEW')} className={`shrink-0 md:w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors font-medium ${activeTab === 'OVERVIEW' ? 'bg-rig-primary/10 text-rig-primary' : 'text-rig-muted hover:text-rig-text hover:bg-rig-background'}`}>
            <LayoutDashboard className="w-5 h-5" /> Overview
          </button>
          <button onClick={() => handleTabChange('ORDERS')} className={`shrink-0 md:w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors font-medium ${activeTab === 'ORDERS' ? 'bg-rig-primary/10 text-rig-primary' : 'text-rig-muted hover:text-rig-text hover:bg-rig-background'}`}>
            <Package className="w-5 h-5" /> Orders
          </button>
          <button onClick={() => handleTabChange('INVENTORY')} className={`shrink-0 md:w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors font-medium ${activeTab === 'INVENTORY' ? 'bg-rig-primary/10 text-rig-primary' : 'text-rig-muted hover:text-rig-text hover:bg-rig-background'}`}>
            <PackageSearch className="w-5 h-5" /> Inventory
          </button>
          <button onClick={() => {handleTabChange('PRODUCTS'); setShowProductForm(false);}} className={`shrink-0 md:w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors font-medium ${activeTab === 'PRODUCTS' ? 'bg-rig-primary/10 text-rig-primary' : 'text-rig-muted hover:text-rig-text hover:bg-rig-background'}`}>
            <Package className="w-5 h-5" /> Products
          </button>
          <button onClick={() => handleTabChange('USERS')} className={`shrink-0 md:w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors font-medium ${activeTab === 'USERS' ? 'bg-rig-primary/10 text-rig-primary' : 'text-rig-muted hover:text-rig-text hover:bg-rig-background'}`}>
            <Users className="w-5 h-5" /> Customers
          </button>
          <button onClick={() => handleTabChange('CUSTOMIZATION')} className={`shrink-0 md:w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors font-medium ${activeTab === 'CUSTOMIZATION' ? 'bg-rig-primary/10 text-rig-primary' : 'text-rig-muted hover:text-rig-text hover:bg-rig-background'}`}>
            <Settings className="w-5 h-5" /> Customization
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">{activeTab.charAt(0) + activeTab.slice(1).toLowerCase()}</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-rig-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === 'OVERVIEW' && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-panel p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><DollarSign className="w-6 h-6" /></div>
                    <span className="text-sm font-medium text-green-400 flex items-center"><TrendingUp className="w-4 h-4 mr-1" /> +12%</span>
                  </div>
                  <h3 className="text-rig-muted text-sm font-medium">Total Revenue</h3>
                  <div className="text-3xl font-bold text-rig-text mt-1">{formatPrice(stats.totalRevenue)}</div>
                </div>
                <div className="glass-panel p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl"><Package className="w-6 h-6" /></div>
                  </div>
                  <h3 className="text-rig-muted text-sm font-medium">Total Orders</h3>
                  <div className="text-3xl font-bold text-rig-text mt-1">{stats.totalOrders}</div>
                </div>
                <div className="glass-panel p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl"><AlertCircle className="w-6 h-6" /></div>
                  </div>
                  <h3 className="text-rig-muted text-sm font-medium">Pending Orders</h3>
                  <div className="text-3xl font-bold text-rig-text mt-1">{stats.pendingOrders}</div>
                </div>
                <div className="glass-panel p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-500/10 text-green-400 rounded-xl"><Users className="w-6 h-6" /></div>
                  </div>
                  <h3 className="text-rig-muted text-sm font-medium">Total Customers</h3>
                  <div className="text-3xl font-bold text-rig-text mt-1">{stats.totalUsers}</div>
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'ORDERS' && (
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rig-muted w-4 h-4" />
                      <input 
                        type="text" 
                        placeholder="Search by order ID, email, or name..." 
                        value={orderSearchTerm}
                        onChange={e => setOrderSearchTerm(e.target.value)}
                        className="w-full bg-rig-background border border-rig-border rounded-lg pl-10 pr-4 py-2 text-rig-text outline-none focus:border-rig-primary transition-colors text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 sm:pb-0 hide-scroll-on-desktop">
                      {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(status => (
                        <button
                          key={status}
                          onClick={() => setOrderStatusFilter(status)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border ${
                            orderStatusFilter === status 
                              ? 'bg-rig-primary text-rig-text border-rig-primary' 
                              : 'bg-rig-surface text-rig-muted hover:text-rig-text border-rig-border'
                          }`}
                        >
                          {status.charAt(0) + status.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={exportOrdersCSV}
                    className="bg-rig-surface border border-rig-border hover:bg-rig-surface text-rig-text px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm whitespace-nowrap"
                  >
                    <Download size={16} /> Export CSV
                  </button>
                </div>

                <div className="glass-panel rounded-2xl overflow-x-auto">
                  <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-rig-background border-b border-rig-border">
                      <tr>
                        <th className="p-4 font-bold text-rig-muted text-xs tracking-wider uppercase">Order</th>
                        <th className="p-4 font-bold text-rig-muted text-xs tracking-wider uppercase">Date</th>
                        <th className="p-4 font-bold text-rig-muted text-xs tracking-wider uppercase">Customer</th>
                        <th className="p-4 font-bold text-rig-muted text-xs tracking-wider uppercase text-center">Items</th>
                        <th className="p-4 font-bold text-rig-muted text-xs tracking-wider uppercase">Status</th>
                        <th className="p-4 font-bold text-rig-muted text-xs tracking-wider uppercase">Total</th>
                        <th className="p-4 font-bold text-rig-muted text-xs tracking-wider uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rig-border/50">
                      {filteredOrders.length === 0 ? (
                        <tr><td colSpan={7} className="p-8 text-center text-rig-muted">No orders found.</td></tr>
                      ) : (
                        filteredOrders.map(order => (
                          <tr key={order.id} className="hover:bg-rig-background/50 transition-colors">
                            <td className="p-4 font-mono font-bold text-sm text-rig-text">{(order.id || '').toUpperCase().slice(0, 8)}</td>
                            <td className="p-4 text-sm text-rig-muted">{format(new Date(order.createdAt), 'M/d/yyyy')}</td>
                            <td className="p-4">
                              <div className="font-bold text-rig-text text-sm flex items-center gap-2">
                                {order.user.name} <span className="bg-rig-surface border border-rig-border text-[10px] px-1.5 py-0.5 rounded text-rig-muted font-normal">CUSTOMER</span>
                              </div>
                              <div className="text-xs text-rig-muted mt-0.5">{order.user.email}</div>
                              {order.cancelRequested && order.status !== 'CANCELLED' && (
                                <div className="mt-2 text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded inline-block max-w-[200px] truncate" title={order.cancelReason || 'No reason provided'}>
                                  Cancellation Requested: {order.cancelReason || 'No reason provided'}
                                </div>
                              )}
                            </td>
                            <td className="p-4 text-center font-medium text-sm text-rig-text">
                              {order.items?.reduce((acc: number, i: any) => acc + i.quantity, 0) || 0}
                            </td>
                            <td className="p-4">
                              <select 
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                className={`text-xs font-bold px-3 py-1.5 rounded-full outline-none cursor-pointer appearance-none text-center min-w-[100px] ${
                                  order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20' :
                                  order.status === 'PROCESSING' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' :
                                  order.status === 'SHIPPED' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20' :
                                  order.status === 'DELIVERED' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                                  'bg-rig-surface text-rig-muted border border-rig-border'
                                }`}
                              >
                                <option className="bg-rig-background text-rig-text" value="PENDING">PENDING</option>
                                <option className="bg-rig-background text-rig-text" value="PROCESSING">PROCESSING</option>
                                <option className="bg-rig-background text-rig-text" value="SHIPPED">SHIPPED</option>
                                <option className="bg-rig-background text-rig-text" value="DELIVERED">DELIVERED</option>
                                <option className="bg-rig-background text-rig-text" value="CANCELLED">CANCELLED</option>
                              </select>
                            </td>
                            <td className="p-4 font-bold text-sm text-rig-text">{formatPrice(order.totalAmount)}</td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button 
                                  onClick={() => setViewOrderDetails(order)}
                                  className="p-2 text-rig-muted hover:text-rig-text rounded transition-colors"
                                  title="View Details"
                                >
                                  <Eye size={18} />
                                </button>
                                <button 
                                  onClick={() => handlePrintOrder(order)}
                                  className="p-2 text-rig-muted hover:text-rig-text rounded transition-colors"
                                  title="Print Packing Slip"
                                >
                                  <Printer size={18} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                  title="Delete Order"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* INVENTORY TAB */}
            {activeTab === 'INVENTORY' && (() => {
              const filteredInventory = inventory.filter(inv => {
                const matchesSearch = inv.product.name.toLowerCase().includes(inventorySearchTerm.toLowerCase()) || 
                                      inv.product.sku.toLowerCase().includes(inventorySearchTerm.toLowerCase()) || 
                                      inv.product.brand.toLowerCase().includes(inventorySearchTerm.toLowerCase());
                const matchesCategory = inventoryCategoryFilter === '' || inv.product.categoryId === inventoryCategoryFilter;
                return matchesSearch && matchesCategory;
              });

              return (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
                    <input 
                      type="text" 
                      placeholder="Search by Name, SKU, Brand..." 
                      value={inventorySearchTerm}
                      onChange={e => setInventorySearchTerm(e.target.value)}
                      className="bg-rig-background border border-rig-border rounded-lg px-4 py-2 text-rig-text w-full sm:w-64 outline-none focus:border-rig-primary transition-colors"
                    />
                    <select 
                      value={inventoryCategoryFilter} 
                      onChange={e => setInventoryCategoryFilter(e.target.value)}
                      className="bg-rig-background border border-rig-border rounded-lg px-4 py-2 text-rig-text outline-none focus:border-rig-primary transition-colors cursor-pointer"
                    >
                      <option value="">All Categories</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div className="glass-panel rounded-2xl overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-rig-background border-b border-rig-border">
                        <tr>
                          <th className="p-4 font-semibold text-rig-muted text-sm">Product</th>
                          <th className="p-4 font-semibold text-rig-muted text-sm">SKU</th>
                          <th className="p-4 font-semibold text-rig-muted text-sm">Price</th>
                          <th className="p-4 font-semibold text-rig-muted text-sm">Stock Level</th>
                          <th className="p-4 font-semibold text-rig-muted text-sm text-right">Update Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-rig-border/50">
                        {filteredInventory.length === 0 ? (
                          <tr><td colSpan={5} className="p-8 text-center text-rig-muted">No items found.</td></tr>
                        ) : (
                          filteredInventory.map(inv => (
                            <tr key={inv.id} className="hover:bg-rig-background/50 transition-colors">
                              <td className="p-4">
                                <div className="font-medium text-rig-text line-clamp-1">{inv.product.name}</div>
                                <div className="text-xs text-rig-muted">{inv.product.brand}</div>
                              </td>
                              <td className="p-4 font-mono text-sm">{inv.product.sku}</td>
                              <td className="p-4">{formatPrice(inv.product.basePrice)}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${inv.totalStock > 20 ? 'bg-green-500' : inv.totalStock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                  <span className="text-sm font-medium">{inv.totalStock} units</span>
                                </div>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <input 
                                    type="number" 
                                    className="bg-rig-surface border border-rig-border rounded px-2 py-1 w-20 text-sm text-rig-text"
                                    defaultValue={inv.totalStock}
                                    onBlur={(e) => updateStock(inv.id, parseInt(e.target.value))}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            {/* USERS TAB */}
            {activeTab === 'USERS' && (
              <div className="glass-panel rounded-2xl overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-rig-background border-b border-rig-border">
                    <tr>
                      <th className="p-4 font-semibold text-rig-muted text-sm">Name</th>
                      <th className="p-4 font-semibold text-rig-muted text-sm">Email</th>
                      <th className="p-4 font-semibold text-rig-muted text-sm">Role</th>
                      <th className="p-4 font-semibold text-rig-muted text-sm">Joined</th>
                      <th className="p-4 font-semibold text-rig-muted text-sm text-right">Total Orders</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rig-border/50">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-rig-background/50 transition-colors">
                        <td className="p-4 font-medium text-rig-text">{u.name}</td>
                        <td className="p-4 text-sm text-rig-muted">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'ADMIN' ? 'bg-rig-primary/20 text-rig-primary' : 'bg-rig-surface text-rig-muted'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-rig-muted">{format(new Date(u.createdAt), 'MMM dd, yyyy')}</td>
                        <td className="p-4 text-right font-bold">{u._count.orders}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === 'PRODUCTS' && (
              <div>
                {!showProductForm ? (
                  <>
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                      <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
                        <input 
                          type="text" 
                          placeholder="Search by Name, SKU, Brand..." 
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="bg-rig-background border border-rig-border rounded-lg px-4 py-2 text-rig-text w-full sm:w-64 outline-none focus:border-rig-primary transition-colors"
                        />
                        <select 
                          value={selectedCategoryFilter} 
                          onChange={e => setSelectedCategoryFilter(e.target.value)}
                          className="bg-rig-background border border-rig-border rounded-lg px-4 py-2 text-rig-text outline-none focus:border-rig-primary transition-colors"
                        >
                          <option value="">All Categories</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <button 
                        onClick={handleAddProduct}
                        className="bg-rig-primary hover:bg-rig-primary/90 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shrink-0"
                      >
                        <Plus size={18} /> Add Product
                      </button>
                    </div>
                    <div className="glass-panel rounded-2xl overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-rig-background border-b border-rig-border">
                          <tr>
                            <th className="p-4 font-semibold text-rig-muted text-sm">Product</th>
                            <th className="p-4 font-semibold text-rig-muted text-sm">Category</th>
                            <th className="p-4 font-semibold text-rig-muted text-sm">Price</th>
                            <th className="p-4 font-semibold text-rig-muted text-sm">Stock</th>
                            <th className="p-4 font-semibold text-rig-muted text-sm text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-rig-border/50">
                          {filteredProducts.map(p => (
                            <tr key={p.id} className="hover:bg-rig-background/50 transition-colors">
                              <td className="p-4">
                                <div className="font-medium text-rig-text line-clamp-1">{p.name}</div>
                                <div className="text-xs text-rig-muted">{p.sku} | {p.brand}</div>
                              </td>
                              <td className="p-4 text-sm">{p.category?.name}</td>
                              <td className="p-4 font-bold">{formatPrice(p.basePrice)}</td>
                              <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${p.inventory?.totalStock > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                  {p.inventory?.totalStock || 0}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => handleEditProduct(p)} className="p-2 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20 transition-colors">
                                    <Edit size={16} />
                                  </button>
                                  <button onClick={() => handleDeleteProduct(p.id)} className="p-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 transition-colors">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="glass-panel rounded-2xl p-6">
                    <h2 className="text-2xl font-bold mb-6">{currentProduct ? 'Edit Product' : 'Add New Product'}</h2>
                    <form onSubmit={handleSaveProduct} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-rig-muted">Name</label>
                          <input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-rig-background border border-rig-border rounded-lg px-3 py-2 text-rig-text" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-rig-muted">Slug</label>
                          <input required value={formData.slug || ''} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-rig-background border border-rig-border rounded-lg px-3 py-2 text-rig-text" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-rig-muted">SKU</label>
                          <input required value={formData.sku || ''} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full bg-rig-background border border-rig-border rounded-lg px-3 py-2 text-rig-text" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-rig-muted">Brand</label>
                          <input required value={formData.brand || ''} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full bg-rig-background border border-rig-border rounded-lg px-3 py-2 text-rig-text" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-rig-muted">Base Price (Rs.)</label>
                          <input required type="number" step="0.01" value={formData.basePrice === 0 ? '0' : formData.basePrice || ''} onChange={e => setFormData({...formData, basePrice: parseFloat(e.target.value) || 0})} className="w-full bg-rig-background border border-rig-border rounded-lg px-3 py-2 text-rig-text" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-rig-muted">Total Stock</label>
                          <input required type="number" value={formData.totalStock === 0 ? '0' : formData.totalStock || ''} onChange={e => setFormData({...formData, totalStock: parseInt(e.target.value) || 0})} className="w-full bg-rig-background border border-rig-border rounded-lg px-3 py-2 text-rig-text" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-rig-muted">Category</label>
                          <select required value={formData.categoryId || ''} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full bg-rig-background border border-rig-border rounded-lg px-3 py-2 text-rig-text outline-none">
                            <option value="">Select Category</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-rig-muted">Image URL (Optional)</label>
                          <input value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-rig-background border border-rig-border rounded-lg px-3 py-2 text-rig-text" />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-rig-muted">Description</label>
                        <textarea rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-rig-background border border-rig-border rounded-lg px-3 py-2 text-rig-text" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-rig-muted">Specs (JSON)</label>
                          <textarea rows={6} value={formData.specs || ''} onChange={e => setFormData({...formData, specs: e.target.value})} className="w-full bg-rig-background border border-rig-border rounded-lg px-3 py-2 text-rig-text font-mono text-sm" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-rig-muted">Compatibility (JSON)</label>
                          <textarea rows={6} value={formData.compatibility || ''} onChange={e => setFormData({...formData, compatibility: e.target.value})} className="w-full bg-rig-background border border-rig-border rounded-lg px-3 py-2 text-rig-text font-mono text-sm" />
                        </div>
                      </div>

                      <div className="flex justify-end gap-4 pt-4 border-t border-rig-border">
                        <button type="button" onClick={() => setShowProductForm(false)} className="px-4 py-2 rounded-lg text-rig-muted hover:text-rig-text transition-colors">Cancel</button>
                        <button type="submit" className="bg-rig-primary hover:bg-rig-primary/90 text-white px-6 py-2 rounded-lg font-bold transition-colors">Save Product</button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}



            {/* CUSTOMIZATION TAB */}
            {activeTab === 'CUSTOMIZATION' && (
              <div className="flex flex-col md:flex-row gap-8 bg-rig-surface border border-rig-border rounded-2xl overflow-hidden min-h-[600px]">
                
                {/* Secondary Sidebar */}
                <div className="w-full md:w-64 bg-rig-background border-r border-rig-border p-4 flex flex-col gap-1">
                  {[
                    { id: 'HOMEPAGE_SIDEBAR', label: 'Navbar Links' },
                    { id: 'FOOTER_SETTINGS', label: 'Footer Settings' },
                    { id: 'HOME_BANNER', label: 'Home Banner' },
                    { id: 'PROMO_BANNER', label: 'Promo Banner' },
                    { id: 'INSTAGRAM_FEED', label: 'Instagram Feed' },
                    { id: 'BENTO_GRID', label: 'Bento Grid' },
                    { id: 'SITE_REVIEWS', label: 'Site Reviews' },
                    { id: 'TEAM_MEMBERS', label: 'Team Members' },
                    { id: 'LIVE_TRACKING', label: 'Live Tracking' },
                    { id: 'GENERAL_SETTINGS', label: 'General Settings' },
                  ].map(item => (
                    <button 
                      key={item.id}
                      onClick={() => handleSettingsTabChange(item.id)}
                      className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                        activeSettingsTab === item.id 
                          ? 'bg-rig-primary/10 text-rig-text' 
                          : 'text-rig-muted hover:text-rig-text hover:bg-rig-surface'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Settings Content */}
                <div className="flex-1 p-8 overflow-y-auto">
                  <div className={['LIVE_TRACKING', 'GENERAL_SETTINGS'].includes(activeSettingsTab) ? 'w-full' : 'max-w-4xl'}>
                    <h2 className="text-2xl font-bold mb-6 text-rig-text border-b border-rig-border pb-4">
                      {activeSettingsTab === 'HOMEPAGE_SIDEBAR' ? 'Navbar Links' : activeSettingsTab === 'FOOTER_SETTINGS' ? 'Footer Settings' : activeSettingsTab.replace('_', ' ')}
                    </h2>
                    
                    {activeSettingsTab === 'HOMEPAGE_SIDEBAR' && (() => {
                      const links = Array.isArray(siteSettings?.HOMEPAGE_SIDEBAR) ? siteSettings.HOMEPAGE_SIDEBAR : [];
                      
                      return (
                        <div className="space-y-6">
                          <p className="text-sm text-rig-muted mb-4">
                            Add custom category links to your top navigation bar. These will appear between 'PC Builder' and 'About Us'.
                          </p>
                          
                          {links.map((link: any, index: number) => (
                            <div key={index} className="bg-rig-background border border-rig-border p-4 rounded-xl flex items-center gap-4">
                              <div className="flex-1 space-y-1">
                                <label className="text-xs font-medium text-rig-muted">Category (Label)</label>
                                <select 
                                  value={link.label || ''} 
                                  onChange={e => {
                                    const selectedCat = categories.find(c => c.name === e.target.value);
                                    updateNavbarLink(index, 'label', e.target.value);
                                    if (selectedCat) {
                                      updateNavbarLink(index, 'url', `/category/${selectedCat.slug}`);
                                    }
                                  }}
                                  className="w-full bg-rig-surface border border-rig-border rounded-lg px-3 py-2 text-sm text-rig-text outline-none focus:border-rig-primary cursor-pointer appearance-none"
                                >
                                  <option value="">Select Category</option>
                                  {categories.map(c => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex-1 space-y-1">
                                <label className="text-xs font-medium text-rig-muted">URL (Auto-populated)</label>
                                <input 
                                  value={link.url || ''} 
                                  onChange={e => updateNavbarLink(index, 'url', e.target.value)} 
                                  placeholder="e.g. /category/laptops"
                                  className="w-full bg-rig-surface border border-rig-border rounded-lg px-3 py-2 text-sm text-rig-text outline-none focus:border-rig-primary" 
                                />
                              </div>
                              <div className="pt-5">
                                <button 
                                  onClick={() => removeNavbarLink(index)}
                                  className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          ))}
                          
                          <button 
                            onClick={addNavbarLink}
                            className="w-full border border-dashed border-rig-border hover:border-rig-primary text-rig-muted hover:text-rig-text bg-transparent hover:bg-rig-surface py-3 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium text-sm"
                          >
                            <Plus size={18} /> Add New Link
                          </button>
                        </div>
                      );
                    })()}

                    {activeSettingsTab === 'HOME_BANNER' && (() => {
                      const banners = Array.isArray(siteSettings?.HOME_BANNER) ? siteSettings.HOME_BANNER : 
                                     (siteSettings?.HOME_BANNER && typeof siteSettings?.HOME_BANNER === 'object' ? [siteSettings.HOME_BANNER] : []);
                      
                      return (
                        <div className="space-y-8">
                          {banners.map((banner: any, index: number) => (
                            <div key={index} className="bg-rig-background border border-rig-border p-6 rounded-xl relative">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-rig-text">Banner {index + 1}</h3>
                                <button 
                                  onClick={() => removeHomeBanner(index)}
                                  className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-full transition-colors"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                              <div className="space-y-6">
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-rig-muted">Flash Tagline</label>
                                  <input 
                                    value={banner.tagline || ''} 
                                    onChange={e => updateHomeBanner(index, 'tagline', e.target.value)} 
                                    placeholder="e.g. Flash Drop Active"
                                    className="w-full bg-rig-surface border border-rig-border rounded-lg px-4 py-2.5 text-rig-text outline-none focus:border-rig-primary" 
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-rig-muted">Main Title (Line 1)</label>
                                  <input 
                                    value={banner.title1 || ''} 
                                    onChange={e => updateHomeBanner(index, 'title1', e.target.value)} 
                                    placeholder="e.g. NVIDIA GeForce"
                                    className="w-full bg-rig-surface border border-rig-border rounded-lg px-4 py-2.5 text-rig-text outline-none focus:border-rig-primary" 
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-rig-muted">Main Title (Line 2 - Highlighted)</label>
                                  <input 
                                    value={banner.title2 || ''} 
                                    onChange={e => updateHomeBanner(index, 'title2', e.target.value)} 
                                    placeholder="e.g. RTX 4090 SUPRIM X"
                                    className="w-full bg-rig-surface border border-rig-border rounded-lg px-4 py-2.5 text-rig-text outline-none focus:border-rig-primary" 
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-rig-muted">Description</label>
                                  <textarea 
                                    rows={3}
                                    value={banner.description || ''} 
                                    onChange={e => updateHomeBanner(index, 'description', e.target.value)} 
                                    className="w-full bg-rig-surface border border-rig-border rounded-lg px-4 py-2.5 text-rig-text outline-none focus:border-rig-primary" 
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <label className="text-sm font-medium text-rig-muted">Price Text</label>
                                    <input 
                                      value={banner.priceText || ''} 
                                      onChange={e => updateHomeBanner(index, 'priceText', e.target.value)} 
                                      className="w-full bg-rig-surface border border-rig-border rounded-lg px-4 py-2.5 text-rig-text outline-none focus:border-rig-primary" 
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-sm font-medium text-rig-muted">SKU Text</label>
                                    <input 
                                      value={banner.skuText || ''} 
                                      onChange={e => updateHomeBanner(index, 'skuText', e.target.value)} 
                                      className="w-full bg-rig-surface border border-rig-border rounded-lg px-4 py-2.5 text-rig-text outline-none focus:border-rig-primary" 
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          <button 
                            onClick={addHomeBanner}
                            className="w-full border border-dashed border-rig-border hover:border-rig-primary text-rig-muted hover:text-rig-text bg-transparent hover:bg-rig-surface py-4 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium"
                          >
                            <Plus size={20} /> Add New Banner
                          </button>
                        </div>
                      );
                    })()}

                    {activeSettingsTab === 'PROMO_BANNER' && (
                      <div className="space-y-6">
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-rig-muted">Banner Visibility</label>
                          <select 
                            value={siteSettings?.PROMO_BANNER?.visible ? 'true' : 'false'}
                            onChange={e => updateSetting('PROMO_BANNER', 'visible', e.target.value === 'true')}
                            className="w-full bg-rig-background border border-rig-border rounded-lg px-4 py-2.5 text-rig-text outline-none focus:border-rig-primary"
                          >
                            <option value="true">Show Promo Banner</option>
                            <option value="false">Hide Promo Banner</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-rig-muted">Banner Text</label>
                          <input 
                            value={siteSettings?.PROMO_BANNER?.text || ''} 
                            onChange={e => updateSetting('PROMO_BANNER', 'text', e.target.value)} 
                            placeholder="e.g. Free shipping on all orders over Rs. 5000!"
                            className="w-full bg-rig-background border border-rig-border rounded-lg px-4 py-2.5 text-rig-text outline-none focus:border-rig-primary" 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-rig-muted">Light Mode Background Color</label>
                            <div className="flex gap-2">
                              <input 
                                value={siteSettings?.PROMO_BANNER?.bgColorLight || '#4f46e5'} 
                                onChange={e => updateSetting('PROMO_BANNER', 'bgColorLight', e.target.value)} 
                                type="color"
                                className="h-10 w-12 bg-rig-background border border-rig-border rounded-lg px-1 py-1 outline-none cursor-pointer" 
                              />
                              <input 
                                value={siteSettings?.PROMO_BANNER?.bgColorLight || '#4f46e5'} 
                                onChange={e => updateSetting('PROMO_BANNER', 'bgColorLight', e.target.value)} 
                                className="flex-1 bg-rig-background border border-rig-border rounded-lg px-4 py-2 text-rig-text outline-none focus:border-rig-primary" 
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-rig-muted">Dark Mode Background Color</label>
                            <div className="flex gap-2">
                              <input 
                                value={siteSettings?.PROMO_BANNER?.bgColorDark || '#e11d48'} 
                                onChange={e => updateSetting('PROMO_BANNER', 'bgColorDark', e.target.value)} 
                                type="color"
                                className="h-10 w-12 bg-rig-background border border-rig-border rounded-lg px-1 py-1 outline-none cursor-pointer" 
                              />
                              <input 
                                value={siteSettings?.PROMO_BANNER?.bgColorDark || '#e11d48'} 
                                onChange={e => updateSetting('PROMO_BANNER', 'bgColorDark', e.target.value)} 
                                className="flex-1 bg-rig-background border border-rig-border rounded-lg px-4 py-2 text-rig-text outline-none focus:border-rig-primary" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSettingsTab === 'BENTO_GRID' && (() => {
                      const blocks = Array.isArray(siteSettings?.BENTO_GRID) && siteSettings?.BENTO_GRID.length === 5 
                        ? siteSettings.BENTO_GRID 
                        : [
                            { title: 'Upgrade to RTX 4090', subtitle: 'Experience ultra-high performance gaming and rendering with the ultimate GeForce GPU.', buttonText: 'Shop Now', link: '/category/gpus', bgColorLight: '#ffffff', bgColorDark: '#111111', buttonBgColorLight: '#4f46e5', buttonBgColorDark: '#e11d48', buttonTextColorLight: '#ffffff', buttonTextColorDark: '#ffffff', tagline: '⚡ FLAGSHIP PERFORMANCE', icon: 'zap' },
                            { title: 'Processors', subtitle: 'Intel Core 14th Gen & AMD Ryzen 7000', buttonText: 'Explore', link: '/category/processors', bgColorLight: '#ffffff', bgColorDark: '#0a0a0a', buttonBgColorLight: '#4f46e5', buttonBgColorDark: '#e11d48', buttonTextColorLight: '#ffffff', buttonTextColorDark: '#ffffff', icon: 'cpu' },
                            { title: 'Monitors', subtitle: 'High Refresh Rate Displays', buttonText: 'LEARN MORE', link: '/category/monitors', bgColorLight: '#ffffff', bgColorDark: '#111111', buttonBgColorLight: 'transparent', buttonBgColorDark: 'transparent', buttonTextColorLight: '#4f46e5', buttonTextColorDark: '#e11d48', icon: 'monitor' },
                            { title: 'Storage', subtitle: 'Gen4 & Gen5 NVMe SSDs', buttonText: 'EXPLORE', link: '/category/storage', bgColorLight: '#ffffff', bgColorDark: '#0a0a0a', buttonBgColorLight: 'transparent', buttonBgColorDark: 'transparent', buttonTextColorLight: '#4f46e5', buttonTextColorDark: '#e11d48', icon: 'hard-drive' },
                            { title: 'Gaming Laptops', subtitle: 'Portable powerhouses for gaming on the go.', buttonText: 'Browse Laptops', link: '/category/laptops', bgColorLight: '#ffffff', bgColorDark: '#111111', buttonBgColorLight: '#4f46e5', buttonBgColorDark: '#e11d48', buttonTextColorLight: '#ffffff', buttonTextColorDark: '#ffffff', icon: 'laptop' }
                          ];
                          
                      const blockNames = ["Left Tall Block", "Top Wide Block", "Top Small Block", "Bottom Small Block", "Bottom Wide Block"];

                      return (
                        <div className="space-y-8">
                          <p className="text-sm text-rig-muted mb-4">
                            Configure the 5 blocks of your Bento Grid. Colors use hex codes (e.g. #fff1e6).
                          </p>
                          {blocks.map((block: any, index: number) => (
                            <div key={index} className="bg-rig-background border border-rig-border p-6 rounded-xl">
                              <h3 className="text-lg font-bold text-rig-text mb-4">{blockNames[index]}</h3>
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <label className="text-sm font-medium text-rig-muted">Title</label>
                                    <input 
                                      value={block.title || ''} 
                                      onChange={e => updateBentoBlock(index, 'title', e.target.value)} 
                                      className="w-full bg-rig-surface border border-rig-border rounded-lg px-4 py-2 text-rig-text outline-none focus:border-rig-primary" 
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-sm font-medium text-rig-muted">Subtitle</label>
                                    <input 
                                      value={block.subtitle || ''} 
                                      onChange={e => updateBentoBlock(index, 'subtitle', e.target.value)} 
                                      className="w-full bg-rig-surface border border-rig-border rounded-lg px-4 py-2 text-rig-text outline-none focus:border-rig-primary" 
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <label className="text-sm font-medium text-rig-muted">Button Text</label>
                                    <input 
                                      value={block.buttonText || ''} 
                                      onChange={e => updateBentoBlock(index, 'buttonText', e.target.value)} 
                                      className="w-full bg-rig-surface border border-rig-border rounded-lg px-4 py-2 text-rig-text outline-none focus:border-rig-primary" 
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-sm font-medium text-rig-muted">Link URL</label>
                                    <input 
                                      value={block.link || ''} 
                                      onChange={e => updateBentoBlock(index, 'link', e.target.value)} 
                                      className="w-full bg-rig-surface border border-rig-border rounded-lg px-4 py-2 text-rig-text outline-none focus:border-rig-primary" 
                                    />
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-3 gap-4 p-4 border border-rig-border rounded-xl bg-rig-surface/50">
                                    <div className="col-span-3 pb-2 border-b border-rig-border/50">
                                      <h4 className="text-xs font-bold text-rig-text uppercase tracking-wider">Light Theme Colors</h4>
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-xs font-medium text-rig-muted">Background</label>
                                      <div className="flex gap-1">
                                        <input type="color" value={block.bgColorLight || '#ffffff'} onChange={e => updateBentoBlock(index, 'bgColorLight', e.target.value)} className="h-8 w-8 bg-rig-surface border border-rig-border rounded cursor-pointer" />
                                        <input value={block.bgColorLight || '#ffffff'} onChange={e => updateBentoBlock(index, 'bgColorLight', e.target.value)} className="flex-1 bg-rig-surface border border-rig-border rounded px-2 text-xs text-rig-text outline-none focus:border-rig-primary" />
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-xs font-medium text-rig-muted">Button Bg</label>
                                      <div className="flex gap-1">
                                        <input type="color" value={block.buttonBgColorLight === 'transparent' ? '#000000' : (block.buttonBgColorLight || '#4f46e5')} onChange={e => updateBentoBlock(index, 'buttonBgColorLight', e.target.value)} className={`h-8 w-8 bg-rig-surface border border-rig-border rounded cursor-pointer ${block.buttonBgColorLight === 'transparent' ? 'opacity-0' : ''}`} />
                                        <input value={block.buttonBgColorLight || '#4f46e5'} onChange={e => updateBentoBlock(index, 'buttonBgColorLight', e.target.value)} className="flex-1 bg-rig-surface border border-rig-border rounded px-2 text-xs text-rig-text outline-none focus:border-rig-primary" />
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-xs font-medium text-rig-muted">Button Text</label>
                                      <div className="flex gap-1">
                                        <input type="color" value={block.buttonTextColorLight || '#ffffff'} onChange={e => updateBentoBlock(index, 'buttonTextColorLight', e.target.value)} className="h-8 w-8 bg-rig-surface border border-rig-border rounded cursor-pointer" />
                                        <input value={block.buttonTextColorLight || '#ffffff'} onChange={e => updateBentoBlock(index, 'buttonTextColorLight', e.target.value)} className="flex-1 bg-rig-surface border border-rig-border rounded px-2 text-xs text-rig-text outline-none focus:border-rig-primary" />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-3 gap-4 p-4 border border-rig-border rounded-xl bg-rig-surface/50">
                                    <div className="col-span-3 pb-2 border-b border-rig-border/50">
                                      <h4 className="text-xs font-bold text-rig-text uppercase tracking-wider">Dark Theme Colors</h4>
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-xs font-medium text-rig-muted">Background</label>
                                      <div className="flex gap-1">
                                        <input type="color" value={block.bgColorDark || '#111111'} onChange={e => updateBentoBlock(index, 'bgColorDark', e.target.value)} className="h-8 w-8 bg-rig-surface border border-rig-border rounded cursor-pointer" />
                                        <input value={block.bgColorDark || '#111111'} onChange={e => updateBentoBlock(index, 'bgColorDark', e.target.value)} className="flex-1 bg-rig-surface border border-rig-border rounded px-2 text-xs text-rig-text outline-none focus:border-rig-primary" />
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-xs font-medium text-rig-muted">Button Bg</label>
                                      <div className="flex gap-1">
                                        <input type="color" value={block.buttonBgColorDark === 'transparent' ? '#000000' : (block.buttonBgColorDark || '#e11d48')} onChange={e => updateBentoBlock(index, 'buttonBgColorDark', e.target.value)} className={`h-8 w-8 bg-rig-surface border border-rig-border rounded cursor-pointer ${block.buttonBgColorDark === 'transparent' ? 'opacity-0' : ''}`} />
                                        <input value={block.buttonBgColorDark || '#e11d48'} onChange={e => updateBentoBlock(index, 'buttonBgColorDark', e.target.value)} className="flex-1 bg-rig-surface border border-rig-border rounded px-2 text-xs text-rig-text outline-none focus:border-rig-primary" />
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-xs font-medium text-rig-muted">Button Text</label>
                                      <div className="flex gap-1">
                                        <input type="color" value={block.buttonTextColorDark || '#ffffff'} onChange={e => updateBentoBlock(index, 'buttonTextColorDark', e.target.value)} className="h-8 w-8 bg-rig-surface border border-rig-border rounded cursor-pointer" />
                                        <input value={block.buttonTextColorDark || '#ffffff'} onChange={e => updateBentoBlock(index, 'buttonTextColorDark', e.target.value)} className="flex-1 bg-rig-surface border border-rig-border rounded px-2 text-xs text-rig-text outline-none focus:border-rig-primary" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {index === 0 && (
                                  <div className="space-y-1">
                                    <label className="text-sm font-medium text-rig-muted">Tagline (Left block only)</label>
                                    <input 
                                      value={block.tagline || ''} 
                                      onChange={e => updateBentoBlock(index, 'tagline', e.target.value)} 
                                      className="w-full bg-rig-surface border border-rig-border rounded-lg px-4 py-2 text-rig-text outline-none focus:border-rig-primary" 
                                    />
                                  </div>
                                )}
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-rig-muted">Icon Name (lucide-react)</label>
                                  <select 
                                    value={block.icon || 'zap'} 
                                    onChange={e => updateBentoBlock(index, 'icon', e.target.value)} 
                                    className="w-full bg-rig-surface border border-rig-border rounded-lg px-4 py-2 text-rig-text outline-none focus:border-rig-primary"
                                  >
                                    <option value="zap">Zap</option>
                                    <option value="cpu">CPU</option>
                                    <option value="hard-drive">Storage</option>
                                    <option value="monitor">Monitor</option>
                                    <option value="laptop">Laptop</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}

                    {activeSettingsTab === 'TEAM_MEMBERS' && (() => {
                      const members = Array.isArray(siteSettings?.TEAM_MEMBERS) ? siteSettings.TEAM_MEMBERS : 
                                      [{ name: 'Faiz Hussain', initials: 'FH', role: 'Founder', bgColor: '#2563eb' }];
                      
                      return (
                        <div className="space-y-8">
                          {members.map((member: any, index: number) => (
                            <div key={index} className="bg-rig-background border border-rig-border p-6 rounded-xl relative">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                  <div 
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-rig-text font-bold"
                                    style={{ backgroundColor: member.bgColor || '#2563eb' }}
                                  >
                                    {member.initials || 'NM'}
                                  </div>
                                  <h3 className="text-lg font-bold text-rig-text">{member.name || `Member ${index + 1}`}</h3>
                                </div>
                                <button 
                                  onClick={() => removeTeamMember(index)}
                                  className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-full transition-colors"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-rig-muted">Name</label>
                                  <input 
                                    value={member.name || ''} 
                                    onChange={e => updateTeamMember(index, 'name', e.target.value)} 
                                    className="w-full bg-rig-surface border border-rig-border rounded-lg px-4 py-2.5 text-rig-text outline-none focus:border-rig-primary" 
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-rig-muted">Initials</label>
                                  <input 
                                    value={member.initials || ''} 
                                    onChange={e => updateTeamMember(index, 'initials', e.target.value)} 
                                    className="w-full bg-rig-surface border border-rig-border rounded-lg px-4 py-2.5 text-rig-text outline-none focus:border-rig-primary" 
                                    maxLength={3}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-rig-muted">Role</label>
                                  <input 
                                    value={member.role || ''} 
                                    onChange={e => updateTeamMember(index, 'role', e.target.value)} 
                                    className="w-full bg-rig-surface border border-rig-border rounded-lg px-4 py-2.5 text-rig-text outline-none focus:border-rig-primary" 
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-rig-muted">Avatar Color</label>
                                  <div className="flex gap-2">
                                    <input 
                                      type="color"
                                      value={member.bgColor || '#2563eb'} 
                                      onChange={e => updateTeamMember(index, 'bgColor', e.target.value)} 
                                      className="h-11 w-14 bg-rig-surface border border-rig-border rounded-lg px-1 py-1 cursor-pointer" 
                                    />
                                    <input 
                                      value={member.bgColor || ''} 
                                      onChange={e => updateTeamMember(index, 'bgColor', e.target.value)} 
                                      className="flex-1 bg-rig-surface border border-rig-border rounded-lg px-4 py-2.5 text-rig-text outline-none focus:border-rig-primary" 
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          <button 
                            onClick={addTeamMember}
                            className="w-full border border-dashed border-rig-border hover:border-rig-primary text-rig-muted hover:text-rig-text bg-transparent hover:bg-rig-surface py-4 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium"
                          >
                            <Plus size={20} /> Add New Member
                          </button>
                        </div>
                      );
                    })()}

                    {activeSettingsTab === 'FOOTER_SETTINGS' && (() => {
                      const footer = siteSettings?.FOOTER_SETTINGS || {};
                      const productLinks = Array.isArray(footer.productLinks) && footer.productLinks.length > 0
                        ? footer.productLinks 
                        : [
                            { label: "Laptops", url: "/category/laptops" },
                            { label: "Processors", url: "/category/processors" },
                            { label: "Graphic Cards", url: "/category/gpus" },
                            { label: "LCD/LED Monitors", url: "/category/monitors" },
                            { label: "Storage & SSDs", url: "/category/storage" },
                            { label: "Accessories", url: "/category/accessories" },
                          ];
                      
                      const desc = footer.description ?? "Welcome to RigStore. Online computer hardware store in Pakistan. Buy Custom PCs, Processors, Graphic Cards, and Gaming accessories at the best prices in Pakistan.";
                      const address = footer.address ?? "FL 4/20, Main Rashid Minhas Road, Gulshan-e-Iqbal Block-5, Karachi, Pakistan.";
                      const contact = footer.contactNumber ?? "+92 316 2975195";
                      const email = footer.email ?? "support@rigstore.pk";
                      
                      const updateFooter = (field: string, value: any) => {
                        updateSetting('FOOTER_SETTINGS', field, value);
                      };

                      const updateProductLink = (index: number, field: string, value: any) => {
                        const newLinks = [...productLinks];
                        if (!newLinks[index]) newLinks[index] = {};
                        newLinks[index] = { ...newLinks[index], [field]: value };
                        updateFooter('productLinks', newLinks);
                      };

                      const addProductLink = () => {
                        updateFooter('productLinks', [...productLinks, { label: '', url: '' }]);
                      };

                      const removeProductLink = (index: number) => {
                        const newLinks = [...productLinks];
                        newLinks.splice(index, 1);
                        updateFooter('productLinks', newLinks);
                      };

                      return (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-bold text-rig-muted mb-2 block">Description text</label>
                              <textarea 
                                value={desc} 
                                onChange={(e) => updateFooter('description', e.target.value)}
                                placeholder="Welcome to RigStore..."
                                className="w-full bg-rig-surface border border-rig-border rounded-xl px-4 py-3 text-rig-text font-medium outline-none focus:border-rig-primary transition-colors h-24 resize-none"
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-bold text-rig-muted mb-2 block">Address</label>
                                <input 
                                  value={address} 
                                  onChange={(e) => updateFooter('address', e.target.value)}
                                  className="w-full bg-rig-surface border border-rig-border rounded-xl px-4 py-3 text-rig-text font-medium outline-none focus:border-rig-primary transition-colors"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-bold text-rig-muted mb-2 block">Contact Number</label>
                                <input 
                                  value={contact} 
                                  onChange={(e) => updateFooter('contactNumber', e.target.value)}
                                  className="w-full bg-rig-surface border border-rig-border rounded-xl px-4 py-3 text-rig-text font-medium outline-none focus:border-rig-primary transition-colors"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-bold text-rig-muted mb-2 block">Email</label>
                                <input 
                                  value={email} 
                                  onChange={(e) => updateFooter('email', e.target.value)}
                                  className="w-full bg-rig-surface border border-rig-border rounded-xl px-4 py-3 text-rig-text font-medium outline-none focus:border-rig-primary transition-colors"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-bold mb-4 text-rig-text">Product Links Column</h3>
                            <div className="space-y-3">
                              {productLinks.map((link: any, idx: number) => (
                                <div key={idx} className="flex gap-4 items-start bg-rig-background p-4 rounded-xl border border-rig-border">
                                  <div className="flex-1 space-y-4">
                                    <input 
                                      placeholder="Label (e.g. Laptops)"
                                      value={link.label || ''}
                                      onChange={(e) => updateProductLink(idx, 'label', e.target.value)}
                                      className="w-full bg-rig-surface border border-rig-border rounded-lg px-4 py-2 text-rig-text font-medium outline-none focus:border-rig-primary transition-colors"
                                    />
                                    <input 
                                      placeholder="URL (e.g. /category/laptops)"
                                      value={link.url || ''}
                                      onChange={(e) => updateProductLink(idx, 'url', e.target.value)}
                                      className="w-full bg-rig-surface border border-rig-border rounded-lg px-4 py-2 text-rig-text font-medium outline-none focus:border-rig-primary transition-colors text-sm"
                                    />
                                  </div>
                                  <button 
                                    onClick={() => removeProductLink(idx)}
                                    className="p-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                                  >
                                    <Trash2 size={20} />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <button 
                              onClick={addProductLink}
                              className="mt-4 w-full border border-dashed border-rig-border hover:border-rig-primary text-rig-muted hover:text-rig-text bg-transparent hover:bg-rig-surface py-3 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium"
                            >
                              <Plus size={20} /> Add Product Link
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    {['INSTAGRAM_FEED', 'SITE_REVIEWS'].includes(activeSettingsTab) && (
                      <div className="flex flex-col items-center justify-center py-20 text-rig-muted border-2 border-dashed border-rig-border rounded-xl">
                        <Settings className="w-10 h-10 mb-4 opacity-50" />
                        <p>This module is coming soon in the next update.</p>
                      </div>
                    )}
                    
                    {activeSettingsTab === 'LIVE_TRACKING' && (
                      <div className="w-full mt-4">
                        <LiveTrackingDashboard 
                          siteSettings={siteSettings}
                          updateSetting={updateSetting}
                          handleSaveSettings={handleSaveSettings}
                          savingSettings={savingSettings}
                        />
                      </div>
                    )}

                    {activeSettingsTab === 'GENERAL_SETTINGS' && (
                      <div className="w-full mt-4">
                        <SettingsDashboard 
                          siteSettings={siteSettings} 
                          updateSetting={updateSetting}
                          handleSaveSettings={handleSaveSettings}
                          savingSettings={savingSettings}
                        />
                      </div>
                    )}

                    <div className="mt-10 flex justify-end">
                      <button 
                        onClick={handleSaveSettings}
                        disabled={savingSettings || !siteSettings}
                        className="bg-rig-primary hover:bg-rig-primary/90 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-bold transition-colors"
                      >
                        {savingSettings ? 'Saving...' : 'Save Settings'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* View Details Modal */}
      {viewOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-rig-surface border border-rig-border rounded-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-rig-text">Order Details</h3>
                  <p className="text-sm text-rig-muted">{(viewOrderDetails.id || '').toUpperCase()}</p>
                </div>
                <button 
                  onClick={() => setViewOrderDetails(null)}
                  className="text-rig-muted hover:text-rig-text transition-colors text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-rig-background rounded-xl p-4 border border-rig-border">
                  <h4 className="font-bold text-rig-text mb-3 text-sm tracking-wider uppercase">Items List</h4>
                  <div className="space-y-3">
                    {viewOrderDetails.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center gap-4 text-sm">
                        <div className="flex items-center gap-3">
                          <span className="bg-rig-primary/20 text-rig-primary px-2 py-0.5 rounded font-bold">{item.quantity}x</span>
                          <span className="text-rig-text font-medium">{item.product.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-rig-muted font-bold whitespace-nowrap">{formatPrice(item.priceAtSale || item.product.basePrice || 0)}</span>
                          <div className="text-xs text-rig-muted mt-1">Total: {formatPrice((item.priceAtSale || item.product.basePrice || 0) * item.quantity)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-rig-background rounded-xl p-4 border border-rig-border">
                    <h4 className="font-bold text-rig-text mb-2 tracking-wider uppercase text-xs">Customer Details</h4>
                    <p className="text-rig-muted mb-1"><strong className="text-rig-text">Name:</strong> {viewOrderDetails.user.name}</p>
                    <p className="text-rig-muted mb-1"><strong className="text-rig-text">Email:</strong> {viewOrderDetails.user.email}</p>
                    <p className="text-rig-muted"><strong className="text-rig-text">Phone:</strong> {viewOrderDetails.phone || 'N/A'}</p>
                  </div>
                  <div className="bg-rig-background rounded-xl p-4 border border-rig-border flex flex-col">
                    <h4 className="font-bold text-rig-text mb-2 tracking-wider uppercase text-xs">Order Summary</h4>
                    <p className="text-rig-muted mb-1"><strong className="text-rig-text">Date:</strong> {format(new Date(viewOrderDetails.createdAt), 'MMM dd, yyyy')}</p>
                    <p className="text-rig-muted mb-1"><strong className="text-rig-text">Status:</strong> {viewOrderDetails.status}</p>
                    <div className="border-t border-rig-border/50 mt-auto pt-4 flex justify-between items-center text-lg">
                      <p className="text-rig-muted"><strong className="text-rig-text">Total:</strong> {formatPrice(viewOrderDetails.totalAmount)}</p>
                    </div>
                  </div>
                </div>
                
                {viewOrderDetails.cancelRequested && viewOrderDetails.status !== 'CANCELLED' && (
                  <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                    <h4 className="font-bold text-red-500 mb-2 tracking-wider uppercase text-xs">Cancellation Requested</h4>
                    <p className="text-red-400/90 text-sm italic">"{viewOrderDetails.cancelReason || 'No reason provided by the customer.'}"</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => setViewOrderDetails(null)}
                  className="px-6 py-2 rounded-lg font-bold bg-rig-primary hover:bg-rig-primary/90 text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDialog?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-rig-surface border border-rig-border rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-rig-text mb-2">{confirmDialog.title}</h3>
              <p className="text-rig-muted mb-6">{confirmDialog.message}</p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setConfirmDialog(null)}
                  className="px-4 py-2 rounded-lg font-medium text-rig-muted hover:text-rig-text hover:bg-rig-background transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDialog.onConfirm}
                  className="px-4 py-2 rounded-lg font-bold bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
