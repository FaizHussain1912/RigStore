"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type CartItem = {
  id: string;
  sku: string;
  name: string;
  brand: string;
  basePrice: number;
  quantity: number;
  image?: string;
  productId?: string; // Reference for backend
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isLoadingCart: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const { user, token } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767';

  // Load cart initially
  useEffect(() => {
    if (user && token) {
      // Fetch server cart
      setIsLoadingCart(true);
      
      // If we had a local cart before logging in, we sync it first
      const localCart = localStorage.getItem('rigstore_guest_cart');
      const localCartParsed = localCart ? JSON.parse(localCart) : [];
      
      if (localCartParsed.length > 0) {
        fetch(`${API_URL}/api/cart/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            localItems: localCartParsed.map((i: any) => ({ productId: i.id || i.productId, quantity: i.quantity }))
          })
        })
        .then(res => res.json())
        .then(data => {
          mapServerCart(data);
          localStorage.removeItem('rigstore_guest_cart');
        })
        .catch(err => console.error('Failed to sync cart:', err))
        .finally(() => setIsLoadingCart(false));
      } else {
        // Just fetch
        fetch(`${API_URL}/api/cart`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(mapServerCart)
        .catch(err => console.error('Failed to load cart:', err))
        .finally(() => setIsLoadingCart(false));
      }
    } else {
      // Load local guest cart
      const localCart = localStorage.getItem('rigstore_guest_cart');
      if (localCart) {
        setCart(JSON.parse(localCart));
      } else {
        setCart([]);
      }
    }
  }, [user, token]);

  const mapServerCart = (data: any) => {
    if (!data?.items) {
      setCart([]);
      return;
    }
    const formatted = data.items.map((i: any) => ({
      id: i.product.id,
      productId: i.product.id,
      sku: i.product.sku,
      name: i.product.name,
      brand: i.product.brand,
      basePrice: i.product.basePrice,
      quantity: i.quantity,
      image: i.product.imageUrl
    }));
    setCart(formatted);
  };

  const saveGuestCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('rigstore_guest_cart', JSON.stringify(newCart));
  };

  const addToCart = async (product: any, quantity: number = 1) => {
    if (user && token) {
      try {
        const res = await fetch(`${API_URL}/api/cart/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId: product.id, quantity })
        });
        if (res.ok) {
          const data = await res.json();
          mapServerCart(data);
        }
      } catch (err) {
        console.error('Failed to add to cart:', err);
      }
    } else {
      const existing = cart.find((item) => item.id === product.id);
      if (existing) {
        saveGuestCart(cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        ));
      } else {
        saveGuestCart([...cart, {
          id: product.id,
          productId: product.id,
          sku: product.sku,
          name: product.name,
          brand: product.brand,
          basePrice: product.basePrice,
          quantity,
          image: product.imageUrl
        }]);
      }
    }
    setIsCartOpen(true);
  };

  const removeFromCart = async (id: string) => {
    if (user && token) {
      try {
        const res = await fetch(`${API_URL}/api/cart/items/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          mapServerCart(data);
        }
      } catch (err) {
        console.error('Failed to remove from cart:', err);
      }
    } else {
      saveGuestCart(cart.filter((item) => item.id !== id));
    }
  };

  const clearCart = async () => {
    if (user && token) {
      try {
        await fetch(`${API_URL}/api/cart`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setCart([]);
      } catch (err) {
        console.error('Failed to clear cart:', err);
      }
    } else {
      saveGuestCart([]);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, isCartOpen, setIsCartOpen, isLoadingCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
