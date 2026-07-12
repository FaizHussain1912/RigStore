"use client";

import React from 'react';
import { ShoppingCart, User as UserIcon, Heart, LogOut, LayoutDashboard, Settings, Phone, MapPin, Sun, Moon, Menu, X, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import MegaMenu from './MegaMenu';
import { useCart } from '../app/CartContext';
import { useAuth } from '../app/AuthContext';
import { useWishlist } from '../app/WishlistContext';
import { useToast } from '../app/ToastContext';
import Link from 'next/link';

export default function Navbar({ customLinks = [], generalSettings = {} }: { customLinks?: {label: string, url: string}[], generalSettings?: any }) {
  const { cart, setIsCartOpen } = useCart();
  const { user, token, logout, isAdmin, updateUser } = useAuth();
  const { wishlistItems, setIsWishlistOpen } = useWishlist();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = React.useState(false);
  
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  const [editName, setEditName] = React.useState('');
  const [isSubmittingProfile, setIsSubmittingProfile] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767';

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
    <nav className="border-b border-rig-border bg-rig-surface px-4 z-40 relative">
      <div className="container-dense flex justify-between items-center h-16">
        <div className="flex items-center gap-4 lg:gap-8">
          <button 
            className="lg:hidden p-2 text-rig-muted hover:text-rig-text focus:outline-none"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/" className="text-xl font-bold tracking-tighter text-rig-primary">
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
            {customLinks.map((link, idx) => (
              <Link key={idx} href={link.url || '#'} className="font-medium text-sm text-rig-muted hover:text-rig-text transition-colors">
                {link.label}
              </Link>
            ))}

            <Link href="/about" className="font-medium text-sm text-rig-muted hover:text-rig-text transition-colors">About Us</Link>
            <Link href="/contact" className="font-medium text-sm text-rig-muted hover:text-rig-text transition-colors">Contact</Link>
            
            <div className="hidden xl:flex items-center gap-4 ml-6 pl-6 border-l border-rig-border text-xs text-rig-muted">
              <div className="flex items-center gap-1.5 hover:text-rig-text transition-colors cursor-pointer">
                <Phone size={14} className="text-rig-primary" />
                <span>{generalSettings.navbarPhone || '0326-2147419'}</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-rig-text transition-colors cursor-pointer">
                <MapPin size={14} className="text-rig-primary" />
                <span>{generalSettings.navbarLocation || 'Karachi, Pakistan'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-rig-muted hover:text-rig-text transition-colors rounded-full focus:outline-none border border-transparent hover:border-rig-border"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button 
            onClick={() => setIsWishlistOpen(true)} 
            className="relative p-2 text-rig-muted hover:text-rig-text transition-colors focus:outline-none"
          >
            <Heart className="w-6 h-6" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-rig-muted hover:text-rig-text transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-rig-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          <div className="relative hidden lg:block">
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="p-2 text-rig-muted hover:text-rig-text transition-colors rounded-full border border-transparent hover:border-rig-border focus:outline-none"
            >
              <UserIcon className="w-6 h-6" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-rig-surface border border-rig-border overflow-hidden z-50">
                {user ? (
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-rig-border/50">
                      <p className="text-sm font-medium text-rig-text truncate">{user.name}</p>
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
                        setIsProfileModalOpen(true);
                      }} 
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rig-muted hover:bg-rig-background hover:text-rig-text"
                    >
                      <UserIcon className="w-4 h-4" /> My Profile
                    </button>
                    <Link onClick={() => setIsUserMenuOpen(false)} href="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-rig-muted hover:bg-rig-background hover:text-rig-text">
                      <LayoutDashboard className="w-4 h-4" /> My Orders
                    </Link>
                    <button 
                      onClick={() => { logout(); setIsUserMenuOpen(false); }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-rig-background"
                    >
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </div>
                ) : (
                  <div className="py-1">
                    <Link onClick={() => setIsUserMenuOpen(false)} href="/login" className="block px-4 py-2 text-sm text-rig-muted hover:bg-rig-background hover:text-rig-text">
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          
          {/* Menu Panel */}
          <div className="relative flex flex-col w-4/5 max-w-sm h-full bg-rig-surface border-r border-rig-border shadow-xl p-6 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="text-xl font-bold tracking-tighter text-rig-primary">
                RIG<span className="text-rig-text">STORE</span>
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-rig-muted hover:text-rig-text focus:outline-none">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex flex-col gap-6 overflow-y-auto pb-8">
              
              {/* Mobile Account Section */}
              {user ? (
                <div className="flex flex-col gap-3 pb-6 border-b border-rig-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rig-primary/10 flex items-center justify-center text-rig-primary">
                      <UserIcon size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-rig-text">{user.name}</p>
                      <p className="text-xs text-rig-muted">{user.email}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin" className="flex items-center gap-2 text-rig-muted hover:text-rig-text font-medium text-sm mt-2">
                      <Settings className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setEditName(user?.name || '');
                      setIsProfileModalOpen(true);
                    }} 
                    className="flex items-center gap-2 text-rig-muted hover:text-rig-text font-medium text-sm mt-1 w-full text-left"
                  >
                    <UserIcon className="w-4 h-4" /> My Profile
                  </button>
                  <Link onClick={() => setIsMobileMenuOpen(false)} href="/orders" className="flex items-center gap-2 text-rig-muted hover:text-rig-text font-medium text-sm mt-1">
                    <LayoutDashboard className="w-4 h-4" /> My Orders
                  </Link>
                  <button 
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 text-red-500 font-medium text-sm mt-1 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pb-6 border-b border-rig-border">
                  <Link onClick={() => setIsMobileMenuOpen(false)} href="/login" className="flex items-center gap-2 text-rig-muted hover:text-rig-text font-bold text-lg">
                    Sign in
                  </Link>
                  <Link onClick={() => setIsMobileMenuOpen(false)} href="/register" className="flex items-center gap-2 text-rig-muted hover:text-rig-text font-bold text-lg">
                    Create account
                  </Link>
                </div>
              )}

              <div className="flex flex-col pb-6 border-b border-rig-border">
                <button 
                  onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)} 
                  className="flex items-center justify-between text-lg font-bold text-rig-text w-full text-left"
                >
                  Categories
                  <ChevronDown className={`w-5 h-5 transition-transform ${isMobileCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isMobileCategoriesOpen && (
                  <div className="flex flex-col gap-4 mt-4 pl-4 border-l-2 border-rig-border">
                    <Link href="/category/processors" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-rig-muted hover:text-rig-text transition-colors">Processors</Link>
                    <Link href="/category/motherboards" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-rig-muted hover:text-rig-text transition-colors">Motherboards</Link>
                    <Link href="/category/gpus" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-rig-muted hover:text-rig-text transition-colors">Graphic Cards</Link>
                    <Link href="/category/memory" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-rig-muted hover:text-rig-text transition-colors">Memory (RAM)</Link>
                    <Link href="/category/storage" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-rig-muted hover:text-rig-text transition-colors">Storage</Link>
                    <Link href="/category/psus" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-rig-muted hover:text-rig-text transition-colors">Power Supplies</Link>
                    <Link href="/category/cases" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-rig-muted hover:text-rig-text transition-colors">Cases</Link>
                    <Link href="/category/coolers" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-rig-muted hover:text-rig-text transition-colors">Coolers</Link>
                    <Link href="/category/monitors" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-rig-muted hover:text-rig-text transition-colors">Monitors</Link>
                    <Link href="/category/laptops" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-rig-muted hover:text-rig-text transition-colors">Laptops</Link>
                    <Link href="/category/desktops" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-rig-muted hover:text-rig-text transition-colors">Desktops</Link>
                    <Link href="/category/headphones" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-rig-muted hover:text-rig-text transition-colors">Headphones</Link>
                    <Link href="/category/mice" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-rig-muted hover:text-rig-text transition-colors">Mice</Link>
                    <Link href="/category/keyboards" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-rig-muted hover:text-rig-text transition-colors">Keyboards</Link>
                    <Link href="/category/peripherals" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-rig-muted hover:text-rig-text transition-colors">Peripherals</Link>
                  </div>
                )}
              </div>
              
              <Link href="/builder" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-rig-text">PC Builder</Link>
              <Link href="/deals" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-black text-rig-primary hover:text-rose-400 transition-colors">
                🔥 PC Deals
              </Link>
              
              {customLinks.map((link, idx) => (
                <Link key={idx} href={link.url || '#'} onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-rig-text">
                  {link.label}
                </Link>
              ))}
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-rig-text">About Us</Link>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-rig-text">Contact</Link>
            </div>
          </div>
        </div>
      )}
      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-rig-surface border border-rig-border rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-rig-text">My Profile</h3>
                <button 
                  onClick={() => setIsProfileModalOpen(false)}
                  className="text-rig-muted hover:text-rig-text transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!confirmDelete ? (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-bold text-rig-muted block mb-2">Display Name</label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-rig-background border border-rig-border rounded-xl px-4 py-3 text-rig-text focus:outline-none focus:border-rig-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-rig-muted block mb-2">Email</label>
                    <input 
                      type="email" 
                      value={user?.email || ''}
                      disabled
                      className="w-full bg-rig-background/50 border border-rig-border/50 rounded-xl px-4 py-3 text-rig-muted cursor-not-allowed"
                    />
                    <p className="text-xs text-rig-muted mt-2">Email address cannot be changed.</p>
                  </div>
                  
                  <div className="pt-4 border-t border-rig-border flex gap-3">
                    <button 
                      onClick={handleUpdateProfile}
                      disabled={isSubmittingProfile}
                      className="flex-1 bg-rig-primary hover:bg-rig-primary/90 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-colors"
                    >
                      {isSubmittingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                      onClick={() => setConfirmDelete(true)}
                      className="px-6 py-3 border border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-xl font-bold transition-colors"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <h4 className="font-bold text-red-500 mb-2">Are you absolutely sure?</h4>
                    <p className="text-sm text-red-400">
                      This action cannot be undone. This will permanently delete your account, remove your data from our servers, and delete all of your order history.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 bg-rig-surface border border-rig-border hover:bg-rig-background text-rig-text py-3 rounded-xl font-bold transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleDeleteAccount}
                      disabled={isSubmittingProfile}
                      className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-colors"
                    >
                      {isSubmittingProfile ? 'Deleting...' : 'Yes, Delete Account'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
