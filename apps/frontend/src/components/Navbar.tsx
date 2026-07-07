"use client";

import React from 'react';
import { ShoppingCart, User as UserIcon, Heart, LogOut, LayoutDashboard, Settings, Phone, MapPin, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import MegaMenu from './MegaMenu';
import { useCart } from '../app/CartContext';
import { useAuth } from '../app/AuthContext';
import { useWishlist } from '../app/WishlistContext';
import Link from 'next/link';

export default function Navbar({ customLinks = [] }: { customLinks?: {label: string, url: string}[] }) {
  const { cart, setIsCartOpen } = useCart();
  const { user, token, logout, isAdmin } = useAuth();
  const { wishlistItems, setIsWishlistOpen } = useWishlist();
  const { theme, setTheme } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

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
            <Link href="/builder" className="font-medium text-sm text-rig-muted hover:text-rig-text transition-colors">PC Builder</Link>
            
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
                <span>0326-2147419</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-rig-text transition-colors cursor-pointer">
                <MapPin size={14} className="text-rig-primary" />
                <span>Karachi, Pakistan</span>
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

              <Link href="/category/laptops" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-rig-text">Laptops</Link>
              <Link href="/category/processors" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-rig-text">Processors</Link>
              <Link href="/category/gpus" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-rig-text">Graphic Cards</Link>
              <Link href="/category/monitors" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-rig-text">Monitors</Link>
              <Link href="/category/storage" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-rig-text">Storage</Link>
              
              <Link href="/builder" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-rig-text mt-4 pt-4 border-t border-rig-border">PC Builder</Link>
              
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
    </nav>
  );
}
