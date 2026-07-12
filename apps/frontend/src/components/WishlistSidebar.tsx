"use client";

import React from 'react';
import { useWishlist } from '../app/WishlistContext';
import { useCart } from '../app/CartContext';
import { X, Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCurrency } from '../app/CurrencyContext';
import Link from 'next/link';

export default function WishlistSidebar() {
  const { wishlistItems, isWishlistOpen, setIsWishlistOpen, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const router = useRouter();

  if (!isWishlistOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-[90] transition-opacity" 
        onClick={() => setIsWishlistOpen(false)}
      />
      <div className="fixed right-0 top-0 h-full w-full md:w-[400px] bg-rig-surface border-l border-rig-border z-[100] shadow-2xl flex flex-col transform transition-transform">
        <div className="p-4 border-b border-rig-border flex justify-between items-center bg-rig-background">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Heart className="text-rig-primary fill-rig-primary" /> 
            Your Wishlist
          </h2>
          <button onClick={() => setIsWishlistOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-rig-muted hover:text-rig-text" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {wishlistItems.length === 0 ? (
            <div className="text-center text-rig-muted mt-10">Your wishlist is empty.</div>
          ) : (
            wishlistItems.map((item) => (
              <div key={item.id} className="flex gap-4 items-center bg-rig-background p-3 rounded-lg border border-rig-border">
                <Link href={`/product/${item.product.slug}`} onClick={() => setIsWishlistOpen(false)} className="w-16 h-16 bg-white/5 rounded flex items-center justify-center p-1 hover:opacity-80 transition-opacity">
                  <img src={item.product.imageUrl || '/images/gpu.png'} alt={item.product.name} className="w-full h-full object-contain" />
                </Link>
                <div className="flex-1">
                  <Link href={`/product/${item.product.slug}`} onClick={() => setIsWishlistOpen(false)}>
                    <h4 className="text-sm font-semibold leading-tight mb-1 line-clamp-2 hover:text-rig-primary transition-colors">{item.product.name}</h4>
                  </Link>
                  <div className="text-rig-primary font-bold text-sm">{formatPrice(item.product.basePrice)}</div>
                  <button 
                    onClick={() => {
                      addToCart(item.product);
                      removeFromWishlist(item.product.id);
                    }}
                    className="mt-2 text-xs flex items-center gap-1 text-rig-text hover:text-rig-primary transition-colors"
                  >
                    <ShoppingCart className="w-3 h-3" /> Move to Cart
                  </button>
                </div>
                <button onClick={() => removeFromWishlist(item.product.id)} className="p-2 text-rig-muted hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-rig-border bg-rig-background">
          <button 
            onClick={() => {
              setIsWishlistOpen(false);
              router.push('/wishlist');
            }}
            className="w-full bg-rig-surface hover:bg-white/10 border border-rig-border text-rig-text font-bold py-3 rounded transition-colors disabled:opacity-50"
          >
            View Full Wishlist
          </button>
        </div>
      </div>
    </>
  );
}
