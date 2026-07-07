"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type WishlistItem = {
  id: string; // the product id
  product: any; // The full product object
};

type WishlistContextType = {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: any) => void;
  removeFromWishlist: (productId: string) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (isOpen: boolean) => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const { user, token } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767';

  useEffect(() => {
    if (user && token) {
      // Fetch server wishlist
      fetch(`${API_URL}/api/wishlist`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.items) {
          setWishlistItems(data.items);
        } else {
          setWishlistItems([]);
        }
      })
      .catch(err => console.error('Failed to load wishlist:', err));
    } else {
      // Load local guest wishlist
      const localWishlist = localStorage.getItem('rigstore_guest_wishlist');
      if (localWishlist) {
        setWishlistItems(JSON.parse(localWishlist));
      } else {
        setWishlistItems([]);
      }
    }
  }, [user, token]);

  const saveGuestWishlist = (newWishlist: WishlistItem[]) => {
    setWishlistItems(newWishlist);
    localStorage.setItem('rigstore_guest_wishlist', JSON.stringify(newWishlist));
  };

  const addToWishlist = async (product: any) => {
    if (user && token) {
      try {
        const res = await fetch(`${API_URL}/api/wishlist/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId: product.id })
        });
        if (res.ok) {
          // Re-fetch or manually add
          setWishlistItems(prev => {
            if (prev.find(item => item.product.id === product.id)) return prev;
            return [...prev, { id: product.id, product }];
          });
        }
      } catch (err) {
        console.error('Failed to add to wishlist:', err);
      }
    } else {
      const existing = wishlistItems.find((item) => item.product.id === product.id);
      if (!existing) {
        saveGuestWishlist([...wishlistItems, { id: product.id, product }]);
      }
    }
    setIsWishlistOpen(true);
  };

  const removeFromWishlist = async (productId: string) => {
    if (user && token) {
      try {
        const res = await fetch(`${API_URL}/api/wishlist/items/${productId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setWishlistItems(prev => prev.filter(item => item.product.id !== productId));
        }
      } catch (err) {
        console.error('Failed to remove from wishlist:', err);
      }
    } else {
      saveGuestWishlist(wishlistItems.filter((item) => item.product.id !== productId));
    }
  };

  // Sync event listener for backward compatibility
  useEffect(() => {
    const handleUpdate = () => {
      if (user && token) {
        fetch(`${API_URL}/api/wishlist`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
          if (data && data.items) setWishlistItems(data.items);
        });
      }
    };
    window.addEventListener('wishlistUpdated', handleUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleUpdate);
  }, [user, token]);

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isWishlistOpen, setIsWishlistOpen }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
}
