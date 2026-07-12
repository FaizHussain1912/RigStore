"use client";

import React from 'react';
import { useCart } from '../app/CartContext';
import { X, ShoppingCart, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCurrency } from '../app/CurrencyContext';

import Link from 'next/link';

export default function CartSidebar() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart } = useCart();
  const { formatPrice } = useCurrency();
  const router = useRouter();

  if (!isCartOpen) return null;

  const total = cart.reduce((acc, item) => acc + (item.basePrice * item.quantity), 0);

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-[90] transition-opacity" 
        onClick={() => setIsCartOpen(false)}
      />
      <div className="fixed right-0 top-0 h-full w-full md:w-[400px] bg-rig-surface border-l border-rig-border z-[100] shadow-2xl flex flex-col transform transition-transform">
        <div className="p-4 border-b border-rig-border flex justify-between items-center bg-rig-background">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart className="text-rig-primary" /> 
            Your Cart
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-rig-muted hover:text-rig-text" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {cart.length === 0 ? (
            <div className="text-center text-rig-muted mt-10">Your cart is empty.</div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 items-center bg-rig-background p-3 rounded-lg border border-rig-border">
                <Link href={`/product/${item.slug}`} onClick={() => setIsCartOpen(false)} className="w-16 h-16 bg-white/5 rounded flex items-center justify-center text-xs text-rig-muted uppercase font-bold hover:opacity-80 transition-opacity">
                  {item.brand}
                </Link>
                <div className="flex-1">
                  <Link href={`/product/${item.slug}`} onClick={() => setIsCartOpen(false)}>
                    <h4 className="text-sm font-semibold leading-tight mb-1 hover:text-rig-primary transition-colors">{item.name}</h4>
                  </Link>
                  
                  {item.specs && Object.keys(item.specs).length > 0 && (
                    <div className="text-[10px] text-rig-muted mb-2 leading-tight">
                      {Object.values(item.specs).slice(0, 4).map(v => String(v)).join(' • ')}
                    </div>
                  )}

                  <div className="text-xs text-rig-muted mb-1">Qty: {item.quantity}</div>
                  <div className="text-rig-primary font-bold">{formatPrice(item.basePrice * item.quantity)}</div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="p-2 text-rig-muted hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-rig-border bg-rig-background">
          <div className="flex justify-between items-center mb-4 text-lg">
            <span className="text-rig-muted">Subtotal</span>
            <span className="font-bold text-rig-text">{formatPrice(total)}</span>
          </div>
          <button 
            onClick={() => {
              setIsCartOpen(false);
              router.push('/checkout');
            }}
            className="w-full bg-rig-primary hover:bg-rose-500 text-white font-bold py-3 rounded transition-colors disabled:opacity-50"
            disabled={cart.length === 0}
          >
            Checkout Securely
          </button>
        </div>
      </div>
    </>
  );
}
