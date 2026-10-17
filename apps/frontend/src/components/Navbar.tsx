"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingCart, User as UserIcon, Heart, LogOut, LayoutDashboard, Settings, 
  Phone, MapPin, Sun, Moon, Menu, X, ChevronDown, AlertCircle, Search, 
  ArrowLeftRight, KeyRound, Check
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import MegaMenu from './MegaMenu';
import { useCart } from '../app/CartContext';
import { useAuth } from '../app/AuthContext';
import { useWishlist } from '../app/WishlistContext';
import { useCompare } from '../app/CompareContext';
import { useToast } from '../app/ToastContext';
import Link from 'next/link';

export default function Navbar({ customLinks = [], generalSettings = {} }: { customLinks?: {label: string, url: string}[], generalSettings?: any }) {
  const { cart, setIsCartOpen } = useCart();
  const { user, token, logout, isAdmin, updateUser } = useAuth();
  const { wishlistItems, setIsWishlistOpen } = useWishlist();
  const { compareList } = useCompare();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const router = useRouter();
  
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = React.useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  const [profileTab, setProfileTab] = React.useState<'PROFILE' | 'PASSWORD'>('PROFILE');
  const [editName, setEditName] = React.useState('');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [isSubmittingProfile, setIsSubmittingProfile] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;
  const compareCount = compareList.length;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767';

  // Live search debouncing
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await fetch(`${API_URL}/api/products/search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.slice(0, 6));
          setShowSearchDropdown(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, API_URL]);

  // Click outside search listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowSearchDropdown(false);
    setIsMobileMenuOpen(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleUpdateProfile = async () => {
    if (!editName.trim() || !token) return;
    setIsSubmittingProfile(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: editName })
      });
      if (res.ok) {
        const data = await res.json();
        updateUser(data.user);
        toast('Profile updated successfully!', 'success');
        setIsProfileModalOpen(false);
      } else {
        const err = await res.json().catch(()=>null);
        toast(err?.error || 'Failed to update profile', 'error');
      }
    } catch (err) {
      toast('Network error', 'error');
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !token) return;
    setIsSubmittingProfile(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      if (res.ok) {
        toast('Password changed successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setIsProfileModalOpen(false);
      } else {
        const err = await res.json().catch(()=>null);
        toast(err?.error || 'Failed to change password', 'error');
      }
    } catch (err) {
      toast('Network error', 'error');
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!token) return;
    setIsSubmittingProfile(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast('Account deleted successfully.', 'success');
        setIsProfileModalOpen(false);
        logout();
      } else {
        const err = await res.json().catch(()=>null);
        toast(err?.error || 'Failed to delete account', 'error');
      }
    } catch (err) {
      toast('Network error', 'error');
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  return (
    <nav className="border-b border-rig-border bg-rig-surface px-4 sm:px-8 z-40 relative">
      <div className="w-full flex justify-between items-center h-16 gap-4">
        
        {/* Left: Logo & Links */}
        <div className="flex items-center gap-6 lg:gap-8 shrink-0">
          <button 
            className="lg:hidden p-2 text-rig-muted hover:text-rig-text focus:outline-none"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <Link href="/" className="text-2xl font-black tracking-tighter text-rig-primary shrink-0">
            RIG<span className="text-rig-text">STORE</span>
          </Link>

          <div className="hidden lg:flex gap-6 items-center">
            <MegaMenu />
            <Link href="/builder" prefetch={true} className="text-sm font-black text-rig-primary hover:text-rose-400 transition-colors">
              PC BUILDER
            </Link>
            <Link href="/deals" prefetch={true} className="text-sm font-black text-rig-primary hover:text-rose-400 transition-colors">
              PC DEALS
            </Link>
            
            {/* Dynamic Custom Links from Admin */}
            {customLinks.slice(0, 2).map((link, idx) => (
              <Link key={idx} href={link.url || '#'} className="font-medium text-sm text-rig-muted hover:text-rig-text transition-colors">
                {link.label}
              </Link>
            ))}

            <Link href="/track" className="font-medium text-sm text-rig-primary hover:text-rose-400 transition-colors">Track</Link>
            <Link href="/about" className="font-medium text-sm text-rig-muted hover:text-rig-text transition-colors">About</Link>
            <Link href="/contact" className="font-medium text-sm text-rig-muted hover:text-rig-text transition-colors">Contact</Link>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-2 relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (searchResults.length > 0) setShowSearchDropdown(true); }}
              placeholder="Search processors, GPUs, RAM, laptops..."
              className="w-full bg-rig-background border border-rig-border rounded-full pl-10 pr-4 py-2 text-xs text-rig-text placeholder:text-rig-muted focus:outline-none focus:border-rig-primary transition-colors"
            />
            <Search className="w-4 h-4 text-rig-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {isSearching && (
              <div className="w-3.5 h-3.5 border-2 border-rig-primary border-t-transparent rounded-full animate-spin absolute right-3.5 top-1/2 -translate-y-1/2"></div>
            )}
          </form>

          {/* Search Dropdown Results */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-rig-surface border border-rig-border shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2 border-b border-rig-border/50 text-[11px] font-bold text-rig-muted uppercase tracking-wider flex justify-between">
                <span>Products Found</span>
                <span>{searchResults.length} Results</span>
              </div>
              <div className="divide-y divide-rig-border/30 max-h-80 overflow-y-auto">
                {searchResults.map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.slug}`}
                    onClick={() => setShowSearchDropdown(false)}
                    className="flex items-center gap-3 p-3 hover:bg-rig-background transition-colors group"
                  >
                    <div className="w-10 h-10 bg-rig-background rounded p-1 border border-rig-border shrink-0 flex items-center justify-center">
                      <img src={item.imageUrl || '/images/gpu.png'} alt={item.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-rig-text group-hover:text-rig-primary truncate transition-colors">{item.name}</p>
                      <p className="text-[10px] text-rig-muted capitalize">{item.brand} • {item.category?.name}</p>
                    </div>
                    <div className="text-xs font-black text-rig-primary shrink-0">
                      Rs {item.basePrice.toLocaleString()}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="p-2 bg-rig-background/50 border-t border-rig-border text-center">
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="text-xs font-bold text-rig-primary hover:underline"
                >
                  View all results for "{searchQuery}" →
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          
          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-rig-muted hover:text-rig-text transition-colors rounded-full focus:outline-none"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Compare Button */}
          <Link 
            href="/compare"
            title="Compare Hardware"
            className="relative p-2 text-rig-muted hover:text-rig-text transition-colors focus:outline-none"
          >
            <ArrowLeftRight className="w-5 h-5" />
            {compareCount > 0 && (
              <span className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {compareCount}
              </span>
            )}
          </Link>

          {/* Wishlist Button */}
          <button 
            onClick={() => setIsWishlistOpen(true)} 
            className="relative p-2 text-rig-muted hover:text-rig-text transition-colors focus:outline-none"
            aria-label="Open Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-rig-muted hover:text-rig-text transition-colors"
            aria-label="Open Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-rig-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {/* User Account Menu */}
          <div className="relative hidden lg:block">
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="p-2 text-rig-muted hover:text-rig-text transition-colors rounded-full border border-transparent hover:border-rig-border focus:outline-none"
              aria-label="User Account"
            >
              <UserIcon className="w-5 h-5" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl shadow-xl bg-rig-surface border border-rig-border overflow-hidden z-50">
                {user ? (
                  <div className="py-1">
                    <div className="px-4 py-2.5 border-b border-rig-border/50">
                      <p className="text-sm font-bold text-rig-text truncate">{user.name}</p>
                      <p className="text-xs text-rig-muted truncate">{user.email}</p>
                    </div>
                    {isAdmin && (
                      <Link onClick={() => setIsUserMenuOpen(false)} href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-rig-muted hover:bg-rig-background hover:text-rig-text">
                        <Settings className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <button 
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setEditName(user?.name || '');
                        setProfileTab('PROFILE');
                        setIsProfileModalOpen(true);
                      }} 
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rig-muted hover:bg-rig-background hover:text-rig-text"
                    >
                      <UserIcon className="w-4 h-4" /> My Profile
                    </button>
                    <Link onClick={() => setIsUserMenuOpen(false)} href="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-rig-muted hover:bg-rig-background hover:text-rig-text">
                      <LayoutDashboard className="w-4 h-4" /> My Orders
                    </Link>
                    <Link onClick={() => setIsUserMenuOpen(false)} href="/compare" className="flex items-center gap-2 px-4 py-2 text-sm text-rig-muted hover:bg-rig-background hover:text-rig-text">
                      <ArrowLeftRight className="w-4 h-4" /> Compare Rigs
                    </Link>
                    <button 
                      onClick={() => { logout(); setIsUserMenuOpen(false); }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 border-t border-rig-border/50 mt-1"
                    >
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </div>
                ) : (
                  <div className="py-2">
                    <Link onClick={() => setIsUserMenuOpen(false)} href="/login" className="block px-4 py-2 text-sm font-semibold text-rig-text hover:bg-rig-background">
                      Sign in
                    </Link>
                    <Link onClick={() => setIsUserMenuOpen(false)} href="/register" className="block px-4 py-2 text-sm text-rig-muted hover:bg-rig-background hover:text-rig-text">
                      Create account
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          
          <div className="relative flex flex-col w-4/5 max-w-sm h-full bg-rig-surface border-r border-rig-border shadow-xl p-6 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-6">
              <Link href="/" className="text-xl font-bold tracking-tighter text-rig-primary">
                RIG<span className="text-rig-text">STORE</span>
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-rig-muted hover:text-rig-text focus:outline-none">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="mb-6 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-rig-background border border-rig-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-rig-text focus:outline-none focus:border-rig-primary"
              />
              <Search className="w-4 h-4 text-rig-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>

            <div className="flex flex-col gap-5 overflow-y-auto pb-8">
              {/* Account Quick Status */}
              {user ? (
                <div className="flex flex-col gap-2.5 pb-5 border-b border-rig-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rig-primary/10 flex items-center justify-center text-rig-primary">
                      <UserIcon size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-rig-text">{user.name}</p>
                      <p className="text-xs text-rig-muted">{user.email}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin" className="flex items-center gap-2 text-rig-muted hover:text-rig-text text-sm mt-1">
                      <Settings className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setEditName(user?.name || '');
                      setProfileTab('PROFILE');
                      setIsProfileModalOpen(true);
                    }} 
                    className="flex items-center gap-2 text-rig-muted hover:text-rig-text text-sm text-left"
                  >
                    <UserIcon className="w-4 h-4" /> My Profile
                  </button>
                  <Link onClick={() => setIsMobileMenuOpen(false)} href="/orders" className="flex items-center gap-2 text-rig-muted hover:text-rig-text text-sm">
                    <LayoutDashboard className="w-4 h-4" /> My Orders
                  </Link>
                  <button 
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 text-red-500 text-sm text-left"
                  >
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pb-5 border-b border-rig-border">
                  <Link onClick={() => setIsMobileMenuOpen(false)} href="/login" className="text-rig-primary font-bold text-base">
                    Sign in
                  </Link>
                  <Link onClick={() => setIsMobileMenuOpen(false)} href="/register" className="text-rig-muted hover:text-rig-text text-sm">
                    Create account
                  </Link>
                </div>
              )}

              {/* Navigation Links */}
              <div className="flex flex-col pb-4 border-b border-rig-border">
                <button 
                  onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)} 
                  className="flex items-center justify-between text-base font-bold text-rig-text w-full py-1 text-left"
                >
                  Categories
                  <ChevronDown className={`w-4 h-4 transition-transform ${isMobileCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isMobileCategoriesOpen && (
                  <div className="flex flex-col gap-3 mt-3 pl-3 border-l-2 border-rig-border">
                    <Link href="/category/all" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold text-rig-primary">View All Hardware</Link>
                    <Link href="/category/processors" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-rig-muted hover:text-rig-text">Processors</Link>
                    <Link href="/category/motherboards" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-rig-muted hover:text-rig-text">Motherboards</Link>
                    <Link href="/category/gpus" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-rig-muted hover:text-rig-text">Graphic Cards</Link>
                    <Link href="/category/memory" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-rig-muted hover:text-rig-text">Memory (RAM)</Link>
                    <Link href="/category/storage" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-rig-muted hover:text-rig-text">Storage</Link>
                    <Link href="/category/psus" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-rig-muted hover:text-rig-text">Power Supplies</Link>
                    <Link href="/category/cases" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-rig-muted hover:text-rig-text">Cases</Link>
                    <Link href="/category/coolers" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-rig-muted hover:text-rig-text">Coolers</Link>
                    <Link href="/category/monitors" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-rig-muted hover:text-rig-text">Monitors</Link>
                    <Link href="/category/laptops" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-rig-muted hover:text-rig-text">Laptops</Link>
                    <Link href="/category/peripherals" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-rig-muted hover:text-rig-text">Peripherals</Link>
                  </div>
                )}
              </div>
              
              <Link href="/builder" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-rig-text">PC Builder</Link>
              <Link href="/deals" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-black text-rig-primary">🔥 PC Deals</Link>
              <Link href="/compare" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-rig-text flex items-center justify-between">
                <span>Compare Hardware</span>
                {compareCount > 0 && <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">{compareCount}</span>}
              </Link>
              <Link href="/track" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-rig-text">Track Order</Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-rig-muted hover:text-rig-text">About Us</Link>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-rig-muted hover:text-rig-text">Contact</Link>
            </div>
          </div>
        </div>
      )}

      {/* User Profile & Password Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-rig-surface border border-rig-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4">
                  <button 
                    onClick={() => setProfileTab('PROFILE')}
                    className={`font-bold text-sm pb-1 border-b-2 transition-colors ${profileTab === 'PROFILE' ? 'border-rig-primary text-rig-text' : 'border-transparent text-rig-muted hover:text-rig-text'}`}
                  >
                    Profile Details
                  </button>
                  <button 
                    onClick={() => setProfileTab('PASSWORD')}
                    className={`font-bold text-sm pb-1 border-b-2 transition-colors flex items-center gap-1.5 ${profileTab === 'PASSWORD' ? 'border-rig-primary text-rig-text' : 'border-transparent text-rig-muted hover:text-rig-text'}`}
                  >
                    <KeyRound size={14} /> Change Password
                  </button>
                </div>
                <button 
                  onClick={() => setIsProfileModalOpen(false)}
                  className="text-rig-muted hover:text-rig-text transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {profileTab === 'PROFILE' ? (
                !confirmDelete ? (
                  <div className="space-y-5">
                    <div>
                      <label className="text-xs font-bold text-rig-muted block mb-1.5 uppercase tracking-wider">Display Name</label>
                      <input 
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-rig-background border border-rig-border rounded-xl px-4 py-2.5 text-sm text-rig-text focus:outline-none focus:border-rig-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-rig-muted block mb-1.5 uppercase tracking-wider">Email Address</label>
                      <input 
                        type="email" 
                        value={user?.email || ''}
                        disabled
                        className="w-full bg-rig-background/50 border border-rig-border/50 rounded-xl px-4 py-2.5 text-sm text-rig-muted cursor-not-allowed"
                      />
                    </div>
                    
                    <div className="pt-4 border-t border-rig-border flex gap-3">
                      <button 
                        onClick={handleUpdateProfile}
                        disabled={isSubmittingProfile}
                        className="flex-1 bg-rig-primary hover:bg-rig-primary/90 disabled:opacity-50 text-white py-2.5 rounded-xl font-bold text-sm transition-colors"
                      >
                        {isSubmittingProfile ? 'Saving...' : 'Save Profile'}
                      </button>
                      <button 
                        onClick={() => setConfirmDelete(true)}
                        className="px-4 py-2.5 border border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-xl font-bold text-sm transition-colors"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                      <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
                      <h4 className="font-bold text-red-500 mb-1">Delete your account?</h4>
                      <p className="text-xs text-red-400">
                        This action will permanently delete your account and clear order history.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setConfirmDelete(false)}
                        className="flex-1 bg-rig-surface border border-rig-border text-rig-text py-2.5 rounded-xl font-bold text-sm"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleDeleteAccount}
                        disabled={isSubmittingProfile}
                        className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-2.5 rounded-xl font-bold text-sm"
                      >
                        {isSubmittingProfile ? 'Deleting...' : 'Yes, Delete'}
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-rig-muted block mb-1.5 uppercase tracking-wider">Current Password</label>
                    <input 
                      type="password" 
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-rig-background border border-rig-border rounded-xl px-4 py-2.5 text-sm text-rig-text focus:outline-none focus:border-rig-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-rig-muted block mb-1.5 uppercase tracking-wider">New Password (min 6 chars)</label>
                    <input 
                      type="password" 
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-rig-background border border-rig-border rounded-xl px-4 py-2.5 text-sm text-rig-text focus:outline-none focus:border-rig-primary"
                    />
                  </div>
                  <div className="pt-3 border-t border-rig-border">
                    <button 
                      type="submit"
                      disabled={isSubmittingProfile}
                      className="w-full bg-rig-primary hover:bg-rig-primary/90 disabled:opacity-50 text-white py-2.5 rounded-xl font-bold text-sm transition-colors"
                    >
                      {isSubmittingProfile ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
