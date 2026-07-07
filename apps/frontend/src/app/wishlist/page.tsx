'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';
import { ShoppingCart, Trash2, Heart } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { user, token } = useAuth();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767';

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetchWishlist();
  }, [token]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/wishlist`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWishlistItems(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/wishlist/items/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setWishlistItems(prev => prev.filter(item => item.product.id !== productId));
        window.dispatchEvent(new Event('wishlistUpdated'));
      }
    } catch (error) {
      console.error('Failed to remove from wishlist', error);
    }
  };

  if (loading) {
    return (
      <main className="container-dense py-12">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-rig-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container-dense py-12">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        <div className="glass-panel p-12 text-center rounded-2xl flex flex-col items-center justify-center">
          <Heart className="w-16 h-16 text-rig-muted mb-4" />
          <h2 className="text-xl font-bold mb-2">Sign in to save items</h2>
          <p className="text-rig-muted mb-6">You need to be logged in to view and save items to your wishlist.</p>
          <Link href="/login" className="bg-rig-primary text-white px-6 py-3 rounded-lg hover:bg-rig-primary-dark transition-colors font-semibold">
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container-dense py-12">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Heart className="text-red-500 fill-red-500" /> My Wishlist
      </h1>
      
      {wishlistItems.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl">
          <Heart className="w-16 h-16 text-rig-muted mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-rig-muted mb-6">Explore our catalog and find the perfect components for your rig.</p>
          <Link href="/" className="bg-rig-primary text-white px-6 py-3 rounded-lg hover:bg-rig-primary-dark transition-colors font-semibold">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="glass-panel p-4 rounded-xl flex flex-col relative group">
              <button 
                onClick={() => removeFromWishlist(item.product.id)}
                className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 z-10"
                title="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="aspect-square relative mb-4 rounded-lg overflow-hidden bg-rig-surface">
                <img 
                  src={item.product.imageUrl || '/images/gpu.png'} 
                  alt={item.product.name} 
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="flex flex-col flex-grow">
                <div className="text-xs font-semibold text-rig-primary tracking-wider uppercase mb-1">
                  {item.product.brand}
                </div>
                <h3 className="text-lg font-bold text-rig-text mb-2 line-clamp-2">
                  {item.product.name}
                </h3>
                <div className="mt-auto">
                  <div className="text-2xl font-bold text-rig-secondary mb-4">
                    Rs. {item.product.basePrice.toLocaleString()}
                  </div>
                  <button 
                    onClick={() => addToCart(item.product)}
                    className="w-full bg-rig-surface hover:bg-rig-primary text-white py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors border border-rig-border hover:border-rig-primary font-medium group/btn"
                  >
                    <ShoppingCart className="w-4 h-4 text-rig-primary group-hover/btn:text-rig-text transition-colors" />
                    Move to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
